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

-- Note:
-- NO SELECT policy is granted to anon.
-- NO UPDATE policy is granted to anon.
-- NO DELETE policy is granted to anon.
-- Anonymous visitors and public API clients CANNOT view, read, modify, or delete any submissions.
-- Only the Supabase Dashboard or authenticated service role can read/manage submissions.
