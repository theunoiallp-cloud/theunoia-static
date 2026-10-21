import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';

// Route-level code splitting: secondary pages load on demand
const Story = lazy(() => import('./pages/Story.jsx'));
const Team = lazy(() => import('./pages/Team.jsx'));
const Hivh = lazy(() => import('./pages/Hivh.jsx'));
const Hunhar = lazy(() => import('./pages/Hunhar.jsx'));
const Blog = lazy(() => import('./pages/Blog.jsx'));
const BlogPost = lazy(() => import('./pages/BlogPost.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const BecomeMaker = lazy(() => import('./pages/BecomeMaker.jsx'));
const Privacy = lazy(() => import('./pages/Privacy.jsx'));
const Terms = lazy(() => import('./pages/Terms.jsx'));
const Refund = lazy(() => import('./pages/Refund.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const BlogEditor = lazy(() => import('./pages/BlogEditor.jsx'));

/** Opens each page at the top (or at its #anchor). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/** Links inside the page markup ("/team", "/hivh" …) move between pages without reloading. */
function LinkCatcher() {
  const navigate = useNavigate();
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest && e.target.closest('a[href]');
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return;
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      e.preventDefault();
      navigate(href);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [navigate]);
  return null;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: '60vh', background: '#FAF7F0' }} />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story key="story" />} />
        <Route path="/team" element={<Team key="team" />} />
        <Route path="/hivh" element={<Hivh key="hivh" />} />
        <Route path="/hunhar" element={<Hunhar key="hunhar" />} />
        <Route path="/blog" element={<Blog key="blog" />} />
        <Route path="/blog/:slug" element={<BlogPost key="blog-post" />} />
        <Route
          path="/blog/editor"
          element={
            <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>Loading Editorial Studio...</div>}>
              <BlogEditor />
            </Suspense>
          }
        />
        <Route
          path="/blog/editor/:id"
          element={
            <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center', color: '#64748B' }}>Loading Editorial Studio...</div>}>
              <BlogEditor />
            </Suspense>
          }
        />
        <Route path="/contact" element={<Contact key="contact" />} />
        <Route path="/become-a-maker" element={<BecomeMaker key="become-a-maker" />} />
        <Route path="/privacy" element={<Privacy key="privacy" />} />
        <Route path="/terms" element={<Terms key="terms" />} />
        <Route path="/refund" element={<Refund key="refund" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <LinkCatcher />
      <AppRoutes />
    </BrowserRouter>
  );
}
