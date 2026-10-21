import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import SiteFooter from '../sections/home/SiteFooter.jsx';
import { getPublishedArticles } from '../lib/blogService.js';
import '../content/blog.css';

const CATEGORIES = [
  'All',
  'Hunhar Updates',
  'Engineering',
  'Design',
  'Client Stories',
  'Founder’s Notes'
];

export default function Blog() {
  const [articles, setArticles] = useState([]);
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Blog · THEUNOiA';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getPublishedArticles({
      category: category === 'All' ? 'all' : category,
      searchQuery
    }).then(({ articles: fetchedArticles }) => {
      if (isMounted) {
        setArticles(fetchedArticles || []);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [category, searchQuery]);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const remainingArticles = articles.length > 1 ? articles.slice(1) : [];

  return (
    <div className="blog-page">
      <Header current="blog" />

      <main className="blog-wrap">
        <header className="blog-hero">
          <span className="blog-eyebrow">Editorial &amp; Insights</span>
          <h1 className="blog-hero-title">Thoughts on Craft, Code &amp; Youth</h1>
          <p className="blog-hero-desc">
            Perspectives from THEUNOiA on building software, student freelancing through Hunhar, and cultivating digital makers across Bharat.
          </p>
        </header>

        {/* Search & Category Filter Controls */}
        <section className="blog-controls" aria-label="Article filters">
          <div className="blog-search-box">
            <svg
              className="blog-search-icon"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              type="search"
              placeholder="Search articles by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search articles"
            />
          </div>

          <div className="blog-filters" role="tablist">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={category === cat}
                className={`blog-filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            <p>Loading articles...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <div className="blog-empty">
            <svg
              className="blog-empty-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h3>No articles published yet</h3>
            <p>
              {searchQuery || category !== 'All'
                ? 'No published articles matched your search filter. Try clearing your search or switching categories.'
                : 'Our editorial desk is actively preparing in-depth guides, founder notes, and technical writeups. Check back soon for fresh publications.'}
            </p>
            <div className="blog-empty-actions">
              {searchQuery || category !== 'All' ? (
                <button
                  type="button"
                  className="blog-btn-primary"
                  onClick={() => {
                    setSearchQuery('');
                    setCategory('All');
                  }}
                >
                  Clear Filters
                </button>
              ) : (
                <>
                  <Link to="/story" className="blog-btn-primary">
                    Read Our Story
                  </Link>
                  <Link to="/hunhar" className="blog-btn-secondary">
                    Explore Hunhar
                  </Link>
                  <Link to="/contact" className="blog-btn-secondary">
                    Contact Our Team
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {/* Featured Article */}
        {!loading && featuredArticle && (
          <Link
            to={`/blog/${featuredArticle.slug}`}
            className="blog-featured-card"
            aria-label={`Read featured article: ${featuredArticle.title}`}
          >
            <div className="blog-featured-content">
              <div>
                <span className="blog-featured-badge">{featuredArticle.category || 'Featured'}</span>
                <h2 className="blog-featured-title">{featuredArticle.title}</h2>
                <p className="blog-featured-excerpt">{featuredArticle.excerpt}</p>
              </div>
              <div className="blog-meta-row">
                <span>By {featuredArticle.author_name || 'THEUNOiA Team'}</span>
                <span>•</span>
                <span>
                  {featuredArticle.published_at
                    ? new Date(featuredArticle.published_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Recently'}
                </span>
                <span>•</span>
                <span>{featuredArticle.reading_time_minutes || 3} min read</span>
              </div>
            </div>
            <div className="blog-featured-img-wrap">
              {featuredArticle.featured_image ? (
                <img
                  src={featuredArticle.featured_image}
                  alt={featuredArticle.featured_image_alt || featuredArticle.title}
                  className="blog-featured-img"
                  loading="lazy"
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0F1B2D 0%, #1A2A42 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C9A55C',
                    fontSize: '14px',
                    letterSpacing: '0.1em'
                  }}
                >
                  THEUNOiA EDITORIAL
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Article Grid */}
        {!loading && remainingArticles.length > 0 && (
          <section className="blog-grid" aria-label="More articles">
            {remainingArticles.map((art) => (
              <Link
                key={art.id}
                to={`/blog/${art.slug}`}
                className="blog-card"
                aria-label={`Read article: ${art.title}`}
              >
                <div className="blog-card-img-wrap">
                  {art.featured_image ? (
                    <img
                      src={art.featured_image}
                      alt={art.featured_image_alt || art.title}
                      className="blog-card-img"
                      loading="lazy"
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        background: '#ECE5D6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#C2653F',
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      THEUNOiA
                    </div>
                  )}
                </div>
                <div className="blog-card-body">
                  <span className="blog-card-category">{art.category}</span>
                  <h3 className="blog-card-title">{art.title}</h3>
                  <p className="blog-card-excerpt">{art.excerpt}</p>
                  <div className="blog-card-footer">
                    <span>
                      {art.published_at
                        ? new Date(art.published_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : ''}
                    </span>
                    <span>{art.reading_time_minutes || 3} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
