import React from 'react';
import { renderToString } from 'react-dom/server';
import Home from './pages/Home.jsx';
import Story from './pages/Story.jsx';
import Team from './pages/Team.jsx';
import Hivh from './pages/Hivh.jsx';
import Hunhar from './pages/Hunhar.jsx';
import Blog from './pages/Blog.jsx';
import Contact from './pages/Contact.jsx';
import BecomeMaker from './pages/BecomeMaker.jsx';
import NotFound from './pages/NotFound.jsx';

const PAGE_MAP = {
  '/': Home,
  '/story': Story,
  '/team': Team,
  '/hivh': Hivh,
  '/hunhar': Hunhar,
  '/blog': Blog,
  '/contact': Contact,
  '/become-a-maker': BecomeMaker,
  '/404': NotFound,
};

export function renderPage(path) {
  const Component = PAGE_MAP[path] || NotFound;
  return renderToString(React.createElement(Component));
}
