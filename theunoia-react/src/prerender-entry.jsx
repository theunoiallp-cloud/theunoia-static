import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Story from './pages/Story.jsx';
import Team from './pages/Team.jsx';
import Hivh from './pages/Hivh.jsx';
import Hunhar from './pages/Hunhar.jsx';
import Blog from './pages/Blog.jsx';
import BlogPost from './pages/BlogPost.jsx';
import Contact from './pages/Contact.jsx';
import BecomeMaker from './pages/BecomeMaker.jsx';
import Privacy from './pages/Privacy.jsx';
import Terms from './pages/Terms.jsx';
import Refund from './pages/Refund.jsx';
import NotFound from './pages/NotFound.jsx';

export function renderPage(path, extraProps = {}) {
  if (path.startsWith('/blog/editor')) {
    return '<div class="editor-root" style="padding:80px 20px;text-align:center;color:#64748B;"><p>Loading Editorial Studio...</p></div>';
  }

  return renderToString(
    React.createElement(
      MemoryRouter,
      { initialEntries: [path] },
      React.createElement(
        Routes,
        null,
        React.createElement(Route, { path: '/', element: React.createElement(Home) }),
        React.createElement(Route, { path: '/story', element: React.createElement(Story) }),
        React.createElement(Route, { path: '/team', element: React.createElement(Team) }),
        React.createElement(Route, { path: '/hivh', element: React.createElement(Hivh) }),
        React.createElement(Route, { path: '/hunhar', element: React.createElement(Hunhar) }),
        React.createElement(Route, { path: '/blog', element: React.createElement(Blog) }),
        React.createElement(Route, { path: '/blog/:slug', element: React.createElement(BlogPost, extraProps) }),
        React.createElement(Route, { path: '/contact', element: React.createElement(Contact) }),
        React.createElement(Route, { path: '/become-a-maker', element: React.createElement(BecomeMaker) }),
        React.createElement(Route, { path: '/privacy', element: React.createElement(Privacy) }),
        React.createElement(Route, { path: '/terms', element: React.createElement(Terms) }),
        React.createElement(Route, { path: '/refund', element: React.createElement(Refund) }),
        React.createElement(Route, { path: '*', element: React.createElement(NotFound) })
      )
    )
  );
}
