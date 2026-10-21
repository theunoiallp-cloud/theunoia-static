import { supabase, isSupabaseConfigured } from './supabase.js';

/**
 * Calculates estimated reading time from HTML content.
 * @param {string} html
 * @returns {number} minutes
 */
export function calculateReadingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(wordCount / 200));
}

/**
 * Converts a string into a clean, URL-safe slug.
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Public: Fetch published blog posts with category and search filters.
 */
export async function getPublishedArticles({
  category = 'all',
  searchQuery = '',
  page = 1,
  pageSize = 12
} = {}) {
  if (!isSupabaseConfigured) {
    return { articles: [], totalCount: 0, error: null };
  }

  try {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('status', 'published')
      .order('published_at', { ascending: false, nullsFirst: false })
      .range(from, to);

    // Apply publication time filter (only show posts where published_at <= current time or is null)
    const nowIso = new Date().toISOString();
    query = query.or(`published_at.is.null,published_at.lte.${nowIso}`);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = `%${searchQuery.trim()}%`;
      query = query.or(`title.ilike.${q},excerpt.ilike.${q}`);
    }

    const { data, count, error } = await query;

    if (error) {
      console.warn('Supabase fetch published articles notice:', error.message);
      return { articles: [], totalCount: 0, error: error.message };
    }

    return {
      articles: data || [],
      totalCount: count || 0,
      error: null
    };
  } catch (err) {
    console.error('Error fetching published articles:', err);
    return { articles: [], totalCount: 0, error: err.message };
  }
}

/**
 * Public: Fetch a single published article by slug.
 */
export async function getPublishedArticleBySlug(slug) {
  if (!slug || !isSupabaseConfigured) {
    return { article: null, error: 'Article not found.' };
  }

  try {
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .single();

    if (error || !data) {
      return { article: null, error: error?.message || 'Article not found.' };
    }

    return { article: data, error: null };
  } catch (err) {
    return { article: null, error: err.message };
  }
}

/**
 * Public: Fetch related published articles.
 */
export async function getRelatedArticles(currentSlug, category, limit = 3) {
  if (!isSupabaseConfigured) return [];

  try {
    const nowIso = new Date().toISOString();
    let query = supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image, featured_image_alt, category, published_at, reading_time_minutes, author_name')
      .eq('status', 'published')
      .neq('slug', currentSlug)
      .or(`published_at.is.null,published_at.lte.${nowIso}`)
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data } = await query;
    return data || [];
  } catch {
    return [];
  }
}

/**
 * Authenticated: Fetch all articles for the Editor.
 */
export async function getEditorArticles({ status = 'all', searchQuery = '' } = {}) {
  if (!isSupabaseConfigured) {
    return { articles: [], error: 'Supabase credentials not configured.' };
  }

  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = `%${searchQuery.trim()}%`;
      query = query.or(`title.ilike.${q},slug.ilike.${q},excerpt.ilike.${q}`);
    }

    const { data, error } = await query;

    if (error) {
      return { articles: [], error: error.message };
    }

    return { articles: data || [], error: null };
  } catch (err) {
    return { articles: [], error: err.message };
  }
}

/**
 * Authenticated: Fetch an article by ID for editing.
 */
export async function getEditorArticleById(id) {
  if (!isSupabaseConfigured) {
    return { article: null, error: 'Supabase credentials not configured.' };
  }

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return { article: null, error: error.message };
    }

    return { article: data, error: null };
  } catch (err) {
    return { article: null, error: err.message };
  }
}

/**
 * Authenticated: Validate slug uniqueness.
 */
export async function isSlugAvailable(slug, excludeId = null) {
  if (!isSupabaseConfigured || !slug) return true;

  try {
    let query = supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    const { data, error } = await query;
    if (error) return true;
    return !data || data.length === 0;
  } catch {
    return true;
  }
}

/**
 * Authenticated: Save (create or update) an article.
 */
export async function saveArticle(articleData) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  const title = (articleData.title || '').trim();
  if (!title) {
    return { success: false, error: 'Article title is required.' };
  }

  let slug = slugify(articleData.slug || title);
  if (!slug) {
    return { success: false, error: 'A valid URL slug is required.' };
  }

  // Check slug uniqueness
  const isAvailable = await isSlugAvailable(slug, articleData.id || null);
  if (!isAvailable) {
    return {
      success: false,
      error: `The URL slug "/blog/${slug}" is already used by another article. Please choose a unique slug.`
    };
  }

  const readingTime = calculateReadingTime(articleData.content || '');

  const payload = {
    title,
    slug,
    excerpt: (articleData.excerpt || '').trim(),
    content: articleData.content || '',
    featured_image: articleData.featured_image || null,
    featured_image_alt: articleData.featured_image_alt || null,
    category: articleData.category || 'Insights',
    tags: Array.isArray(articleData.tags) ? articleData.tags : [],
    author_name: articleData.author_name || 'THEUNOiA Team',
    author_role: articleData.author_role || 'Editorial',
    author_avatar: articleData.author_avatar || null,
    seo_title: articleData.seo_title || title,
    seo_description: articleData.seo_description || articleData.excerpt || '',
    reading_time_minutes: readingTime,
    status: articleData.status || 'draft',
    scheduled_at: articleData.scheduled_at || null,
    published_at: articleData.published_at || (articleData.status === 'published' ? new Date().toISOString() : null)
  };

  try {
    if (articleData.id) {
      // Update
      const { data, error } = await supabase
        .from('blog_posts')
        .update(payload)
        .eq('id', articleData.id)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, article: data };
    } else {
      // Insert
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([payload])
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, article: data };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Authenticated: Delete an article.
 */
export async function deleteArticle(id) {
  if (!isSupabaseConfigured || !id) {
    return { success: false, error: 'Invalid request.' };
  }

  try {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Authenticated: Upload an image to Supabase Storage.
 */
export async function uploadBlogImage(file) {
  if (!isSupabaseConfigured) {
    return { url: null, error: 'Supabase credentials not configured.' };
  }

  try {
    const ext = file.name.split('.').pop();
    const cleanFileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
    const filePath = `articles/${cleanFileName}`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return { url: publicData.publicUrl, error: null };
  } catch (err) {
    return { url: null, error: err.message };
  }
}

/**
 * Editor Auth: Sign In
 */
export async function signInEditor(email, password) {
  if (!isSupabaseConfigured) {
    return { user: null, error: 'Supabase not configured.' };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { user: null, error: error.message };
    }

    return { user: data.user, session: data.session, error: null };
  } catch (err) {
    return { user: null, error: err.message };
  }
}

/**
 * Editor Auth: Sign Out
 */
export async function signOutEditor() {
  if (!isSupabaseConfigured) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

/**
 * Editor Auth: Get Current Session / User
 */
export async function getEditorUser() {
  if (!isSupabaseConfigured) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user || null;
  } catch {
    return null;
  }
}
