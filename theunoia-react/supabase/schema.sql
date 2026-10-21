-- ==============================================================================
-- THEUNOiA — Supabase Database Schema & Row Level Security (RLS) Migration
-- ==============================================================================
-- Run this script in the Supabase SQL Editor (Dashboard > SQL Editor) to initialize
-- the persistent database storage for THEUNOiA's public website.
-- ==============================================================================

-- 1. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_status ON public.contact_submissions(status);

-- 2. Team Member / Become a Maker Applications Table
CREATE TABLE IF NOT EXISTS public.team_member_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  custom_role TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_team_created_at ON public.team_member_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_team_status ON public.team_member_applications(status);
CREATE INDEX IF NOT EXISTS idx_team_role ON public.team_member_applications(role);

-- ==============================================================================
-- 3. Row Level Security (RLS) Configuration
-- ==============================================================================
-- Enable RLS on both tables to strictly isolate visitor permissions.
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_member_applications ENABLE ROW LEVEL SECURITY;

-- Revoke all default public permissions
REVOKE ALL ON public.contact_submissions FROM anon, authenticated;
REVOKE ALL ON public.team_member_applications FROM anon, authenticated;

-- Allow anonymous visitors (the website form) ONLY to INSERT valid rows
GRANT INSERT ON public.contact_submissions TO anon, authenticated;
GRANT INSERT ON public.team_member_applications TO anon, authenticated;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Allow anonymous insert only" ON public.contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous insert only" ON public.team_member_applications;

-- Policy 1: Anyone (anon) can insert a new contact message
CREATE POLICY "Allow anonymous insert only"
  ON public.contact_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy 2: Anyone (anon) can insert a new team member application
CREATE POLICY "Allow anonymous insert only"
  ON public.team_member_applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);


-- ==============================================================================
-- THEUNOiA — Blog Platform Database Schema & Row Level Security (RLS)
-- ==============================================================================
-- Run this migration in your Supabase SQL Editor (Dashboard > SQL Editor) to
-- provision the blog tables, indexes, storage buckets, and RLS security policies.
-- ==============================================================================

-- 1. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  featured_image TEXT,
  featured_image_alt TEXT,
  category TEXT NOT NULL DEFAULT 'Insights',
  tags TEXT[] DEFAULT '{}'::TEXT[],
  author_name TEXT NOT NULL DEFAULT 'THEUNOiA Team',
  author_role TEXT DEFAULT 'Editorial',
  author_avatar TEXT,
  seo_title TEXT,
  seo_description TEXT,
  reading_time_minutes INTEGER DEFAULT 3,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled', 'archived')),
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Indexes for Query Optimization
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_created_at ON public.blog_posts(created_at DESC);

-- 3. Automatic Updated-At Trigger
CREATE OR REPLACE FUNCTION public.handle_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_blog_posts_updated_at();

-- ==============================================================================
-- 4. Row Level Security (RLS) Configuration
-- ==============================================================================
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Revoke default public permissions
REVOKE ALL ON public.blog_posts FROM anon, authenticated;

-- Grant selective permissions
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Public read published blog posts only" ON public.blog_posts;
DROP POLICY IF EXISTS "Authenticated editors full access" ON public.blog_posts;

-- Policy 1: Public visitors (anon) can ONLY view published posts whose publication time has arrived
CREATE POLICY "Public read published blog posts only"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= timezone('utc'::text, now()))
  );

-- Policy 2: Authenticated editors have full CRUD access (drafts, scheduled, publishing, updates, deletion)
CREATE POLICY "Authenticated editors full access"
  ON public.blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ==============================================================================
-- 5. Storage Bucket Configuration for Blog Images
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing storage policies if re-running
DROP POLICY IF EXISTS "Public read blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update blog images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete blog images" ON storage.objects;

-- Storage Policy 1: Anyone can view blog images
CREATE POLICY "Public read blog images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'blog-images');

-- Storage Policy 2: Authenticated editors can upload images
CREATE POLICY "Authenticated upload blog images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images');

-- Storage Policy 3: Authenticated editors can update images
CREATE POLICY "Authenticated update blog images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images');

-- Storage Policy 4: Authenticated editors can delete images
CREATE POLICY "Authenticated delete blog images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images');
