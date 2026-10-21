import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import NotFound from './NotFound.jsx';
import { getPublishedArticleBySlug, getRelatedArticles } from '../lib/blogService.js';
import DOMPurify from 'dompurify';
import '../content/blog.css';

/**
 * Extracts H2 and H3 headings from HTML content to build a Table of Contents.
 * Injects IDs into the headings so anchor links scroll smoothly to them.
 */
function processContentAndExtractTOC(html) {
  if (!html) return { processedHtml: '', toc: [] };

  const toc = [];
  let index = 0;

  // Replace <h2...> and <h3...> with id attributes if missing
  const processedHtml = html.replace(/<(h[23])([^>]*)>(.*?)<\/\1>/gi, (match, tag, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return match;

    index++;
    const idMatch = attrs.match(/id="([^"]*)"/i);
    const id = idMatch
      ? idMatch[1]
      : `heading-${index}-${cleanText.toLowerCase().replace(/[^\w-]+/g, '-')}`;

    toc.push({
      id,
      text: cleanText,
      level: tag.toLowerCase()
    });

    const attrsWithoutId = attrs.replace(/\s*id="[^"]*"/gi, '');
    return `<${tag} id="${id}"${attrsWithoutId}>${text}</${tag}>`;
  });

  return { processedHtml, toc };
}

export default function BlogPost() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setNotFound(false);

    getPublishedArticleBySlug(slug).then(({ article: foundArticle, error }) => {
      if (!isMounted) return;

      if (error || !foundArticle) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setArticle(foundArticle);
      setLoading(false);
      window.scrollTo(0, 0);

      // Fetch related articles
      getRelatedArticles(foundArticle.slug, foundArticle.category).then((related) => {
        if (isMounted) setRelatedArticles(related || []);
      });
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Update dynamic page metadata
  useEffect(() => {
    if (!article) return;

    const pageTitle = article.seo_title
      ? `${article.seo_title} · THEUNOiA Blog`
      : `${article.title} · THEUNOiA Blog`;
    document.title = pageTitle;

    // Update canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', `https://www.theunoia.com/blog/${article.slug}`);

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', article.seo_description || article.excerpt || '');
    }

    // Update OG metadata
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', pageTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', article.seo_description || article.excerpt || '');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', `https://www.theunoia.com/blog/${article.slug}`);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg && article.featured_image) {
      ogImg.setAttribute('content', article.featured_image);
    }
  }, [article]);

  const { processedHtml, toc } = useMemo(() => {
    if (!article?.content) return { processedHtml: '', toc: [] };

    const { processedHtml: withIds, toc: extractedToc } = processContentAndExtractTOC(article.content);

    // Sanitize with DOMPurify if in browser environment
    const safeHtml = typeof window !== 'undefined' && DOMPurify.sanitize
      ? DOMPurify.sanitize(withIds, {
          ADD_ATTR: ['target', 'rel', 'id'],
          ADD_TAGS: ['iframe']
        })
      : withIds;

    return { processedHtml: safeHtml, toc: extractedToc };
  }, [article?.content]);

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="blog-page">
        <Header current="blog" />
        <div style={{ textAlign: 'center', padding: '140px 20px', color: '#64748B' }}>
          <p>Loading article...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (notFound || !article) {
    return <NotFound />;
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.theunoia.com/blog/${article.slug}`;
  const shareText = encodeURIComponent(article.title);

  // Schema.org BlogPosting
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    image: article.featured_image || 'https://www.theunoia.com/assets/og-image.png',
    author: {
      '@type': 'Person',
      name: article.author_name || 'THEUNOiA Team'
    },
    publisher: {
      '@type': 'Organization',
      name: 'THEUNOiA LLP',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.theunoia.com/assets/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.theunoia.com/blog/${article.slug}`
    }
  };

  return (
    <div className="article-page">
      <Header current="blog" />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="article-wrap">
        {/* Breadcrumbs */}
        <nav className="article-breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/blog">Blog</Link>
          <span>/</span>
          <span style={{ color: '#0F1B2D', fontWeight: 600 }}>{article.category || 'Article'}</span>
        </nav>

        {/* Article Header */}
        <header className="article-header">
          <span className="article-tag">{article.category || 'Insights'}</span>
          <h1 className="article-title">{article.title}</h1>
          {article.excerpt && <p className="article-excerpt">{article.excerpt}</p>}

          <div className="article-author-bar">
            <div className="article-author-info">
              {article.author_avatar ? (
                <img
                  src={article.author_avatar}
                  alt={article.author_name}
                  className="article-avatar"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="article-avatar">
                  {(article.author_name || 'TU').substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <strong style={{ color: '#0F1B2D', display: 'block' }}>
                  {article.author_name || 'THEUNOiA Team'}
                </strong>
                <span style={{ fontSize: '12px' }}>{article.author_role || 'Editorial'}</span>
              </div>
            </div>
            <span>•</span>
            <time dateTime={article.published_at || article.created_at}>
              {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{article.reading_time_minutes || 3} min read</span>
          </div>
        </header>

        {/* Featured Image */}
        {article.featured_image && (
          <figure className="article-featured-media">
            <img
              src={article.featured_image}
              alt={article.featured_image_alt || article.title}
              fetchPriority="high"
              decoding="async"
            />
            {article.featured_image_alt && (
              <figcaption>{article.featured_image_alt}</figcaption>
            )}
          </figure>
        )}

        {/* Two-Column Layout: Article Body + Table of Contents */}
        <div className="article-layout">
          <article className="article-body">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Social Share Bar */}
            <div className="article-share-bar">
              <span className="article-share-label">Share this article:</span>
              <div className="article-share-btns">
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-share-btn"
                  aria-label="Share on X"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Post
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-share-btn"
                  aria-label="Share on LinkedIn"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.95 0-1.72-.78-1.72-1.73s.77-1.73 1.72-1.73a1.73 1.73 0 0 1 1.73 1.73c0 .95-.78 1.73-1.73 1.73m1.4 9.74v-8.37H5.06v8.37h2.8z" />
                  </svg>
                  Share
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=${shareText}%20${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-share-btn"
                  aria-label="Share on WhatsApp"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  className="article-share-btn"
                  onClick={handleCopyLink}
                  aria-label="Copy link to article"
                >
                  {copied ? '✓ Copied!' : 'Copy Link'}
                </button>
              </div>
            </div>

            {/* In-Article Call to Action */}
            <section className="article-cta-box">
              <h3>Build your next software product with THEUNOiA</h3>
              <p>
                From bespoke web apps to scalable digital platforms, our student makers and engineers transform ambitious visions into reality.
              </p>
              <Link to="/contact" className="blog-btn-primary" style={{ background: '#C9A55C', color: '#0F1B2D' }}>
                Start a Conversation
              </Link>
            </section>
          </article>

          {/* Sticky Table of Contents Sidebar */}
          {toc.length > 0 && (
            <aside className="article-toc" aria-label="Table of Contents">
              <h2 className="article-toc-title">Table of Contents</h2>
              <ul className="article-toc-list">
                {toc.map((item) => (
                  <li key={item.id} className={`toc-${item.level}`}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section style={{ marginTop: '72px', borderTop: '1px solid var(--blog-border)', paddingTop: '48px' }}>
            <h2 style={{ fontFamily: 'Inter Tight', fontSize: '24px', fontWeight: 800, marginBottom: '24px' }}>
              More from the Editorial Desk
            </h2>
            <div className="blog-grid">
              {relatedArticles.map((rel) => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="blog-card">
                  <div className="blog-card-img-wrap">
                    {rel.featured_image ? (
                      <img src={rel.featured_image} alt={rel.title} className="blog-card-img" loading="lazy" decoding="async" />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: '#ECE5D6' }} />
                    )}
                  </div>
                  <div className="blog-card-body">
                    <span className="blog-card-category">{rel.category}</span>
                    <h3 className="blog-card-title">{rel.title}</h3>
                    <p className="blog-card-excerpt">{rel.excerpt}</p>
                    <div className="blog-card-footer">
                      <span>{rel.reading_time_minutes || 3} min read</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
