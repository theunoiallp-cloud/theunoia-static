import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Story from './pages/Story.jsx';
import Team from './pages/Team.jsx';
import Hivh from './pages/Hivh.jsx';
import Hunhar from './pages/Hunhar.jsx';
import Blog from './pages/Blog.jsx';
import Contact from './pages/Contact.jsx';
import BecomeMaker from './pages/BecomeMaker.jsx';
import Admin from './pages/Admin.jsx';

/** Opens each page at the top (or at its #anchor). */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { el.scrollIntoView(); return; } }
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

export default function App() {
  return (
    <BrowserRouter>
      <ScrollManager />
      <LinkCatcher />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story key="story" />} />
        <Route path="/team" element={<Team key="team" />} />
        <Route path="/hivh" element={<Hivh key="hivh" />} />
        <Route path="/hunhar" element={<Hunhar key="hunhar" />} />
        <Route path="/blog" element={<Blog key="blog" />} />
        <Route path="/contact" element={<Contact key="contact" />} />
        <Route path="/become-a-maker" element={<BecomeMaker key="become-a-maker" />} />
        <Route path="/admin" element={<Admin key="admin" />} />
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}
