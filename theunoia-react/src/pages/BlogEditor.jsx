import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import LinkExtension from '@tiptap/extension-link';
import ImageExtension from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table';
import DOMPurify from 'dompurify';
import {
  getEditorArticles,
  getEditorArticleById,
  saveArticle,
  deleteArticle,
  uploadBlogImage,
  slugify,
  calculateReadingTime,
  signInEditor,
  signOutEditor,
  getEditorUser
} from '../lib/blogService.js';
import { isSupabaseConfigured } from '../lib/supabase.js';
import '../content/editor.css';

const CATEGORIES = [
  'Insights',
  'Hunhar Updates',
  'Engineering',
  'Design',
  'Client Stories',
  'Founder’s Notes'
];

export default function BlogEditor() {
  const { id: paramId } = useParams();
  const navigate = useNavigate();

  // User Authentication State
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [offlineMode, setOfflineMode] = useState(!isSupabaseConfigured);

  // Article Drawer State
  const [articlesList, setArticlesList] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [listSearch, setListSearch] = useState('');

  // Active Article Form State
  const [articleId, setArticleId] = useState(paramId || null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Insights');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [authorName, setAuthorName] = useState('THEUNOiA Team');
  const [authorRole, setAuthorRole] = useState('Editorial');
  const [authorAvatar, setAuthorAvatar] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [status, setStatus] = useState('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const [publishedAt, setPublishedAt] = useState('');

  // View & UI State
  const [viewMode, setViewMode] = useState('edit'); // 'edit', 'preview-desktop', 'preview-mobile'
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('All changes saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successToast, setSuccessToast] = useState('');
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  // File Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // TipTap Editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] }
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' }
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true
      }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell
    ],
    content: '',
    onUpdate: () => {
      setHasUnsavedChanges(true);
      setSaveStatus('Unsaved changes');
    }
  });

  // Check initial Auth
  useEffect(() => {
    document.title = 'Blog Editor Studio · THEUNOiA';
    getEditorUser().then((currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
  }, []);

  // Fetch Articles for Sidebar
  const loadSidebarArticles = useCallback(async () => {
    if (!user && !offlineMode) return;
    const { articles } = await getEditorArticles({ searchQuery: listSearch });
    setArticlesList(articles || []);
  }, [user, offlineMode, listSearch]);

  useEffect(() => {
    if (user || offlineMode) {
      loadSidebarArticles();
    }
  }, [user, offlineMode, loadSidebarArticles]);

  // Load Active Article Data
  useEffect(() => {
    if (!articleId) {
      // New Article
      setTitle('');
      setSlug('');
      setExcerpt('');
      setCategory('Insights');
      setTags([]);
      setAuthorName('THEUNOiA Team');
      setAuthorRole('Editorial');
      setAuthorAvatar('');
      setFeaturedImage('');
      setFeaturedImageAlt('');
      setSeoTitle('');
      setSeoDescription('');
      setStatus('draft');
      setScheduledAt('');
      setPublishedAt('');
      if (editor) editor.commands.setContent('');
      setHasUnsavedChanges(false);
      setSaveStatus('New article draft');
      return;
    }

    // Load existing
    getEditorArticleById(articleId).then(({ article, error }) => {
      if (error || !article) {
        // Try local storage draft
        const local = localStorage.getItem(`theunoia_editor_draft_${articleId}`);
        if (local) {
          try {
            const parsed = JSON.parse(local);
            loadArticleIntoForm(parsed);
            return;
          } catch {
            // pass
          }
        }
        return;
      }
      loadArticleIntoForm(article);
    });
  }, [articleId, editor]);

  function loadArticleIntoForm(data) {
    setTitle(data.title || '');
    setSlug(data.slug || '');
    setExcerpt(data.excerpt || '');
    setCategory(data.category || 'Insights');
    setTags(data.tags || []);
    setAuthorName(data.author_name || 'THEUNOiA Team');
    setAuthorRole(data.author_role || 'Editorial');
    setAuthorAvatar(data.author_avatar || '');
    setFeaturedImage(data.featured_image || '');
    setFeaturedImageAlt(data.featured_image_alt || '');
    setSeoTitle(data.seo_title || '');
    setSeoDescription(data.seo_description || '');
    setStatus(data.status || 'draft');
    setScheduledAt(data.scheduled_at ? data.scheduled_at.substring(0, 16) : '');
    setPublishedAt(data.published_at || '');

    if (editor && data.content !== undefined) {
      editor.commands.setContent(data.content || '');
    }

    setHasUnsavedChanges(false);
    setSaveStatus('Saved');
  }

  // Auto-generate slug from title if slug not manually customized
  const handleTitleChange = (val) => {
    setTitle(val);
    setHasUnsavedChanges(true);
    setSaveStatus('Unsaved changes');
    if (!articleId || !slug) {
      setSlug(slugify(val));
    }
  };

  // Warn on tab close if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Autosave to LocalStorage
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasUnsavedChanges && title) {
        const payload = {
          id: articleId,
          title,
          slug,
          excerpt,
          content: editor ? editor.getHTML() : '',
          category,
          tags,
          author_name: authorName,
          author_role: authorRole,
          author_avatar: authorAvatar,
          featured_image: featuredImage,
          featured_image_alt: featuredImageAlt,
          seo_title: seoTitle,
          seo_description: seoDescription,
          status,
          scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          saved_at: new Date().toISOString()
        };
        const key = articleId ? `theunoia_editor_draft_${articleId}` : 'theunoia_editor_new_draft';
        localStorage.setItem(key, JSON.stringify(payload));
        setSaveStatus('Autosaved locally');
      }
    }, 12000);
    return () => clearInterval(timer);
  }, [hasUnsavedChanges, articleId, title, slug, excerpt, category, tags, authorName, authorRole, authorAvatar, featuredImage, featuredImageAlt, seoTitle, seoDescription, status, scheduledAt, editor]);

  // Save Article Action
  const handleSave = async (overrideStatus = null) => {
    const finalStatus = overrideStatus || status;
    setSaving(true);
    setErrorMessage('');

    const contentHtml = editor ? editor.getHTML() : '';

    const payload = {
      id: articleId,
      title,
      slug: slugify(slug || title),
      excerpt,
      content: contentHtml,
      category,
      tags,
      author_name: authorName,
      author_role: authorRole,
      author_avatar: authorAvatar,
      featured_image: featuredImage,
      featured_image_alt: featuredImageAlt,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      status: finalStatus,
      scheduled_at: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      published_at: finalStatus === 'published' ? (publishedAt || new Date().toISOString()) : null
    };

    if (offlineMode) {
      // Offline local save
      const id = articleId || `local-${Date.now()}`;
      payload.id = id;
      localStorage.setItem(`theunoia_editor_draft_${id}`, JSON.stringify(payload));
      setArticleId(id);
      setStatus(finalStatus);
      setSaving(false);
      setHasUnsavedChanges(false);
      setSaveStatus('Saved locally');
      setSuccessToast(`Saved locally as ${finalStatus}!`);
      setTimeout(() => setSuccessToast(''), 3000);
      return;
    }

    const { success, article, error } = await saveArticle(payload);
    setSaving(false);

    if (!success || error) {
      setErrorMessage(error || 'Failed to save article.');
      return;
    }

    setArticleId(article.id);
    setStatus(article.status);
    setPublishedAt(article.published_at || '');
    setHasUnsavedChanges(false);
    setSaveStatus('Saved to cloud');
    setSuccessToast(`Article successfully ${finalStatus === 'published' ? 'published!' : finalStatus === 'scheduled' ? 'scheduled!' : 'saved as draft!'}`);
    setTimeout(() => setSuccessToast(''), 3500);

    // Refresh list
    loadSidebarArticles();

    if (!paramId && article.id) {
      navigate(`/blog/editor/${article.id}`, { replace: true });
    }
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setErrorMessage('');

    if (offlineMode) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFeaturedImage(event.target.result);
        setUploadingImage(false);
        setHasUnsavedChanges(true);
      };
      reader.readAsDataURL(file);
      return;
    }

    const { url, error } = await uploadBlogImage(file);
    setUploadingImage(false);

    if (error || !url) {
      setErrorMessage(`Image upload failed: ${error || 'Unknown error'}`);
      return;
    }

    setFeaturedImage(url);
    setHasUnsavedChanges(true);
  };

  // Login Handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    const { user: authedUser, error } = await signInEditor(loginEmail, loginPassword);
    setLoginLoading(false);

    if (error || !authedUser) {
      setLoginError(error || 'Invalid login credentials.');
      return;
    }

    setUser(authedUser);
    setOfflineMode(false);
  };

  // Word & Reading Time stats
  const currentHtml = editor ? editor.getHTML() : '';
  const readingTime = calculateReadingTime(currentHtml);
  const wordCount = currentHtml ? currentHtml.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length : 0;

  // Insert Link Prompt
  const handleSetLink = () => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('Enter destination URL (https://...):', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Insert Image Prompt
  const handleInsertEditorImage = () => {
    if (!editor) return;
    const url = window.prompt('Enter image URL (https://...):');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  // Delete Article Action
  const handleDeleteArticle = async () => {
    if (!articleId) return;
    if (!window.confirm('Are you sure you want to permanently delete this article?')) return;

    if (offlineMode) {
      localStorage.removeItem(`theunoia_editor_draft_${articleId}`);
      navigate('/blog/editor');
      return;
    }

    const { success, error } = await deleteArticle(articleId);
    if (!success) {
      setErrorMessage(error || 'Failed to delete article.');
      return;
    }

    navigate('/blog/editor');
  };

  // Add Tag
  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (clean && !tags.includes(clean)) {
        setTags([...tags, clean]);
        setHasUnsavedChanges(true);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    setHasUnsavedChanges(true);
  };

  // Authentication Gate Overlay
  if (authChecked && !user && !offlineMode) {
    return (
      <div className="editor-login-overlay">
        <div className="editor-login-card">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <img src="/assets/logo.png" width="220" alt="THEUNOiA" style={{ height: 'auto' }} />
          </div>
          <h2 className="editor-login-title">Editorial Studio Login</h2>
          <p className="editor-login-desc">
            Sign in with an authorized THEUNOiA editor account to manage articles, publish insights, and upload assets.
          </p>

          {loginError && (
            <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="editor-field-group">
              <label className="editor-label">Editor Email</label>
              <input
                type="email"
                required
                className="editor-input"
                placeholder="editor@theunoia.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="editor-field-group">
              <label className="editor-label">Password</label>
              <input
                type="password"
                required
                className="editor-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loginLoading}
              className="blog-btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: '12px' }}
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Studio'}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid rgba(15, 27, 45, 0.1)', textAlign: 'center' }}>
            <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
              First-time setup? You can provision an authorized user in your Supabase Auth dashboard or test the interface locally.
            </p>
            <button
              type="button"
              onClick={() => setOfflineMode(true)}
              style={{ background: 'transparent', border: '1px dashed #C9A55C', color: '#C2653F', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}
            >
              Enter Local Authoring / Preview Mode
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="editor-root">
      {/* Toast Notification */}
      {successToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0F1B2D',
          color: '#FAF7F0',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          zIndex: 1000,
          borderLeft: '4px solid #C9A55C',
          fontSize: '14px',
          fontWeight: 600
        }}>
          {successToast}
        </div>
      )}

      {/* Sidebar: Articles Drawer */}
      <aside className={`editor-sidebar ${sidebarOpen ? '' : 'collapsed'}`}>
        <div className="editor-sidebar-header">
          <h2 className="editor-sidebar-title">Articles</h2>
          <button
            type="button"
            className="editor-new-btn"
            onClick={() => navigate('/blog/editor')}
            title="Create new article"
          >
            + New
          </button>
        </div>

        <input
          type="search"
          placeholder="Filter articles..."
          className="editor-search-input"
          value={listSearch}
          onChange={(e) => setListSearch(e.target.value)}
        />

        <div className="editor-article-list">
          {articlesList.length === 0 ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#94A3B8', fontSize: '13px' }}>
              No articles found
            </div>
          ) : (
            articlesList.map((item) => (
              <div
                key={item.id}
                className={`editor-article-item ${item.id === articleId ? 'active' : ''}`}
                onClick={() => navigate(`/blog/editor/${item.id}`)}
              >
                <h4 className="editor-item-title">{item.title || 'Untitled Draft'}</h4>
                <div className="editor-item-meta">
                  <span className={`badge-status badge-${item.status}`}>
                    {item.status}
                  </span>
                  <span>{item.reading_time_minutes || 3}m</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(15, 27, 45, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
          <span>{offlineMode ? 'Local Mode' : user?.email || 'Logged In'}</span>
          {!offlineMode && (
            <button
              type="button"
              onClick={() => { signOutEditor(); setUser(null); }}
              style={{ background: 'none', border: 'none', color: '#C2653F', cursor: 'pointer', fontSize: '12px' }}
            >
              Sign Out
            </button>
          )}
        </div>
      </aside>

      {/* Main Studio View */}
      <main className="editor-main">
        {/* Top Control Bar */}
        <header className="editor-topbar">
          <div className="editor-topbar-left">
            <button
              type="button"
              className="editor-icon-btn"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'Hide drawer' : 'Show drawer'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>

            <Link to="/blog" className="editor-icon-btn" title="View Public Blog">
              ← Blog
            </Link>

            <span className={`badge-status badge-${status}`}>
              {status}
            </span>

            <span className="editor-save-indicator">
              {saving ? 'Saving...' : saveStatus}
            </span>
          </div>

          <div className="editor-topbar-center">
            <button
              type="button"
              className={`editor-mode-btn ${viewMode === 'edit' ? 'active' : ''}`}
              onClick={() => setViewMode('edit')}
            >
              Write
            </button>
            <button
              type="button"
              className={`editor-mode-btn ${viewMode === 'preview-desktop' ? 'active' : ''}`}
              onClick={() => setViewMode('preview-desktop')}
            >
              Desktop Preview
            </button>
            <button
              type="button"
              className={`editor-mode-btn ${viewMode === 'preview-mobile' ? 'active' : ''}`}
              onClick={() => setViewMode('preview-mobile')}
            >
              Mobile Preview
            </button>
          </div>

          <div className="editor-topbar-right">
            {status === 'published' ? (
              <button
                type="button"
                className="editor-icon-btn"
                style={{ color: '#C2653F' }}
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                Unpublish to Draft
              </button>
            ) : null}

            <button
              type="button"
              className="editor-icon-btn"
              onClick={() => handleSave('draft')}
              disabled={saving}
            >
              Save Draft
            </button>

            <button
              type="button"
              className="blog-btn-secondary"
              onClick={() => setScheduleModalOpen(true)}
              style={{ fontSize: '13px', padding: '6px 14px' }}
            >
              Schedule...
            </button>

            <button
              type="button"
              className="blog-btn-primary"
              onClick={() => handleSave('published')}
              disabled={saving}
              style={{ fontSize: '13px', padding: '6px 16px' }}
            >
              {status === 'published' ? 'Update Live' : 'Publish Now'}
            </button>
          </div>
        </header>

        {errorMessage && (
          <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '8px 24px', fontSize: '13px', borderBottom: '1px solid #FCA5A5' }}>
            {errorMessage}
          </div>
        )}

        {/* Schedule Modal */}
        {scheduleModalOpen && (
          <div className="editor-login-overlay" onClick={() => setScheduleModalOpen(false)}>
            <div className="editor-login-card" onClick={(e) => e.stopPropagation()}>
              <h3 className="editor-login-title">Schedule Publication</h3>
              <p className="editor-login-desc">
                Select the target publication date and time. When the scheduled timestamp arrives, the article automatically becomes visible to public visitors without needing an active browser session.
              </p>
              <div className="editor-field-group">
                <label className="editor-label">Publication Time (Local Time)</label>
                <input
                  type="datetime-local"
                  className="editor-input"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="editor-icon-btn"
                  onClick={() => setScheduleModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="blog-btn-primary"
                  onClick={() => {
                    setScheduleModalOpen(false);
                    handleSave('scheduled');
                  }}
                  disabled={!scheduledAt}
                >
                  Confirm Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Content Body Area */}
        <div className="editor-body-container">
          {/* Write Mode */}
          {viewMode === 'edit' && (
            <div className="editor-workspace">
              <div className="editor-paper">
                {/* Title & Slug */}
                <input
                  type="text"
                  placeholder="Article title..."
                  className="editor-title-input"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                />

                <div className="editor-slug-row">
                  <span>https://www.theunoia.com/blog/</span>
                  <input
                    type="text"
                    className="editor-slug-input"
                    value={slug}
                    onChange={(e) => {
                      setSlug(slugify(e.target.value));
                      setHasUnsavedChanges(true);
                    }}
                    placeholder="custom-slug"
                  />
                </div>

                {/* TipTap Rich Text Toolbar */}
                {editor && (
                  <div className="tiptap-toolbar" role="toolbar" aria-label="Formatting options">
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleBold().run()}
                      title="Bold (Ctrl+B)"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleItalic().run()}
                      title="Italic (Ctrl+I)"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('underline') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleUnderline().run()}
                      title="Underline (Ctrl+U)"
                    >
                      <u>U</u>
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('code') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleCode().run()}
                      title="Inline Code"
                    >
                      &lt;/&gt;
                    </button>

                    <div className="tiptap-divider"></div>

                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                      title="Heading 2"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                      title="Heading 3"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
                      title="Heading 4"
                    >
                      H4
                    </button>

                    <div className="tiptap-divider"></div>

                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleBulletList().run()}
                      title="Bullet List"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleOrderedList().run()}
                      title="Numbered List"
                    >
                      1. List
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleBlockquote().run()}
                      title="Blockquote"
                    >
                      “ Quote
                    </button>
                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('codeBlock') ? 'is-active' : ''}`}
                      onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                      title="Code Block"
                    >
                      Code
                    </button>

                    <div className="tiptap-divider"></div>

                    <button
                      type="button"
                      className={`tiptap-btn ${editor.isActive('link') ? 'is-active' : ''}`}
                      onClick={handleSetLink}
                      title="Link"
                    >
                      🔗 Link
                    </button>
                    <button
                      type="button"
                      className="tiptap-btn"
                      onClick={handleInsertEditorImage}
                      title="Insert Image by URL"
                    >
                      🖼️ Image
                    </button>
                    <button
                      type="button"
                      className="tiptap-btn"
                      onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                      title="Insert Table"
                    >
                      ▦ Table
                    </button>
                    <button
                      type="button"
                      className="tiptap-btn"
                      onClick={() => editor.chain().focus().setHorizontalRule().run()}
                      title="Divider"
                    >
                      — Rule
                    </button>

                    <div className="tiptap-divider"></div>

                    <button
                      type="button"
                      className="tiptap-btn"
                      onClick={() => editor.chain().focus().undo().run()}
                      disabled={!editor.can().undo()}
                      title="Undo (Ctrl+Z)"
                    >
                      ↶
                    </button>
                    <button
                      type="button"
                      className="tiptap-btn"
                      onClick={() => editor.chain().focus().redo().run()}
                      disabled={!editor.can().redo()}
                      title="Redo (Ctrl+Y)"
                    >
                      ↷
                    </button>
                  </div>
                )}

                {/* Editor Content Canvas */}
                <EditorContent editor={editor} />

                {/* Footer Stats Bar */}
                <div style={{ marginTop: '36px', paddingTop: '16px', borderTop: '1px solid rgba(15, 27, 45, 0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B' }}>
                  <span>{wordCount} words • {readingTime} min read</span>
                  <span>{currentHtml.length} characters</span>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Preview Mode */}
          {viewMode === 'preview-desktop' && (
            <div className="editor-workspace" style={{ background: '#FAF7F0' }}>
              <div style={{ maxWidth: '900px', width: '100%', margin: '0 auto', background: '#FFFFFF', padding: '48px', borderRadius: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.06)' }}>
                <span className="blog-featured-badge">{category}</span>
                <h1 style={{ fontFamily: 'Inter Tight', fontSize: '38px', fontWeight: 800, margin: '12px 0 16px' }}>{title || 'Untitled Article'}</h1>
                <p style={{ fontSize: '18px', color: '#4A5568', lineHeight: 1.6, marginBottom: '24px' }}>{excerpt}</p>
                {featuredImage && (
                  <img src={featuredImage} alt={featuredImageAlt || title} style={{ width: '100%', borderRadius: '12px', maxHeight: '420px', objectFit: 'cover', marginBottom: '32px' }} />
                )}
                <div
                  className="article-content"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentHtml) }}
                />
              </div>
            </div>
          )}

          {/* Mobile Preview Mode */}
          {viewMode === 'preview-mobile' && (
            <div className="mobile-frame-container">
              <div className="mobile-device-frame">
                <div className="mobile-notch"></div>
                <div className="mobile-screen-scroll">
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#C2653F', textTransform: 'uppercase' }}>{category}</span>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 12px', lineHeight: 1.2 }}>{title || 'Untitled Article'}</h1>
                  <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.5, marginBottom: '16px' }}>{excerpt}</p>
                  {featuredImage && (
                    <img src={featuredImage} alt={featuredImageAlt || title} style={{ width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover', marginBottom: '20px' }} />
                  )}
                  <div
                    className="article-content"
                    style={{ fontSize: '15px', lineHeight: 1.7 }}
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(currentHtml) }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Right Settings Panel */}
          <aside className="editor-settings-panel">
            {/* Metadata Section */}
            <div className="editor-panel-section">
              <h3 className="editor-panel-heading">Article Metadata</h3>

              <div className="editor-field-group">
                <label className="editor-label">Category</label>
                <select
                  className="editor-select"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="editor-field-group">
                <label className="editor-label">Excerpt / Summary</label>
                <textarea
                  className="editor-textarea"
                  placeholder="A concise 1-2 sentence overview for cards and social previews..."
                  value={excerpt}
                  onChange={(e) => {
                    setExcerpt(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="editor-field-group">
                <label className="editor-label">Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      style={{ background: '#ECE5D6', color: '#0F1B2D', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: '12px' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Add tag and press Enter..."
                  className="editor-input"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            {/* Featured Image Section */}
            <div className="editor-panel-section">
              <h3 className="editor-panel-heading">Featured Image</h3>

              {featuredImage ? (
                <div style={{ marginBottom: '12px' }}>
                  <img
                    src={featuredImage}
                    alt={featuredImageAlt}
                    style={{ width: '100%', borderRadius: '6px', maxHeight: '160px', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => { setFeaturedImage(''); setHasUnsavedChanges(true); }}
                    style={{ background: 'none', border: 'none', color: '#EF4444', fontSize: '12px', cursor: 'pointer', marginTop: '6px' }}
                  >
                    Remove image
                  </button>
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <button
                  type="button"
                  className="editor-icon-btn"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Image'}
                </button>
              </div>

              <div className="editor-field-group">
                <label className="editor-label">Or Image URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  className="editor-input"
                  value={featuredImage}
                  onChange={(e) => {
                    setFeaturedImage(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="editor-field-group">
                <label className="editor-label">Image Alt Text (SEO &amp; Accessibility)</label>
                <input
                  type="text"
                  placeholder="Describe the image content..."
                  className="editor-input"
                  value={featuredImageAlt}
                  onChange={(e) => {
                    setFeaturedImageAlt(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>

            {/* Author Settings */}
            <div className="editor-panel-section">
              <h3 className="editor-panel-heading">Author Attribution</h3>
              <div className="editor-field-group">
                <label className="editor-label">Author Name</label>
                <input
                  type="text"
                  className="editor-input"
                  value={authorName}
                  onChange={(e) => {
                    setAuthorName(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
              <div className="editor-field-group">
                <label className="editor-label">Author Role</label>
                <input
                  type="text"
                  className="editor-input"
                  value={authorRole}
                  onChange={(e) => {
                    setAuthorRole(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>
            </div>

            {/* SEO & Social Preview */}
            <div className="editor-panel-section">
              <h3 className="editor-panel-heading">SEO &amp; Search Snippet</h3>

              <div className="editor-field-group">
                <label className="editor-label">SEO Title</label>
                <input
                  type="text"
                  placeholder={title || 'Article Title'}
                  className="editor-input"
                  value={seoTitle}
                  onChange={(e) => {
                    setSeoTitle(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <div className="editor-field-group">
                <label className="editor-label">Meta Description</label>
                <textarea
                  className="editor-textarea"
                  placeholder={excerpt || 'Meta description for Google...'}
                  value={seoDescription}
                  onChange={(e) => {
                    setSeoDescription(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                />
              </div>

              <label className="editor-label">Google Search Preview</label>
              <div className="seo-preview-card">
                <div className="seo-preview-url">
                  https://www.theunoia.com › blog › {slug || 'custom-slug'}
                </div>
                <div className="seo-preview-title">
                  {seoTitle || title || 'Article Title'} · THEUNOiA Blog
                </div>
                <div className="seo-preview-desc">
                  {seoDescription || excerpt || 'Read this in-depth perspective from THEUNOiA...'}
                </div>
              </div>
            </div>

            {/* Delete Article Action */}
            {articleId && (
              <div style={{ paddingTop: '20px', borderTop: '1px solid rgba(15, 27, 45, 0.1)' }}>
                <button
                  type="button"
                  onClick={handleDeleteArticle}
                  style={{ background: 'transparent', border: '1px solid #FCA5A5', color: '#DC2626', width: '100%', padding: '8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Delete Article
                </button>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}
