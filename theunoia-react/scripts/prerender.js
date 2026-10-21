import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const ssrOutDir = path.resolve(rootDir, 'dist-ssr');

// Read environment variables from .env if present
function loadEnv() {
  const envPath = path.resolve(rootDir, '.env');
  const env = {};
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        env[match[1]] = val;
      }
    }
  }
  return { ...env, ...process.env };
}

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

const CORE_ROUTES = [
  {
    path: '/',
    title: 'THEUNOiA — Software Development Company in India',
    description: 'THEUNOiA builds websites, web apps, and custom software for businesses and startups. Beautiful thinking, built into every product.',
    canonical: 'https://www.theunoia.com/',
    priority: '1.0',
    changefreq: 'weekly'
  },
  {
    path: '/story',
    title: 'Our Story · THEUNOiA',
    description: 'The story of THEUNOiA: turning ideas into impact with student makers, Hunhar, and digital solutions for businesses.',
    canonical: 'https://www.theunoia.com/story',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/team',
    title: 'Team · THEUNOiA',
    description: 'Meet the squad building THEUNOiA, Hunhar, and Hivh across design, engineering, strategy, and brand.',
    canonical: 'https://www.theunoia.com/team',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/hivh',
    title: 'Hivh · THEUNOiA',
    description: 'Hivh: A student-first community hosting workshops, awareness drives, and meetups across 16 cities.',
    canonical: 'https://www.theunoia.com/hivh',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/hunhar',
    title: 'Hunhar · THEUNOiA',
    description: 'Hunhar: Bharat’s student-first freelance platform connecting emerging talent with real business projects.',
    canonical: 'https://www.theunoia.com/hunhar',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/blog',
    title: 'Blog · THEUNOiA',
    description: 'Read the latest insights, stories, student freelancing advice, and updates from the THEUNOiA team.',
    canonical: 'https://www.theunoia.com/blog',
    priority: '0.8',
    changefreq: 'weekly'
  },
  {
    path: '/contact',
    title: 'Contact Us — THEUNOiA',
    description: 'Get in touch with THEUNOiA. We build software, digital platforms, and custom tech solutions for startups and businesses.',
    canonical: 'https://www.theunoia.com/contact',
    priority: '0.8',
    changefreq: 'monthly'
  },
  {
    path: '/become-a-maker',
    title: 'Become a Maker · THEUNOiA',
    description: 'Apply to join THEUNOiA as a maker across engineering, design, product, and growth departments.',
    canonical: 'https://www.theunoia.com/become-a-maker',
    priority: '0.7',
    changefreq: 'monthly'
  },
  {
    path: '/privacy',
    title: 'Privacy Policy · THEUNOiA',
    description: 'Learn how THEUNOiA collects, protects, and handles personal information across our website and digital services.',
    canonical: 'https://www.theunoia.com/privacy',
    priority: '0.5',
    changefreq: 'monthly'
  },
  {
    path: '/terms',
    title: 'Terms of Service · THEUNOiA',
    description: 'Terms and conditions governing use of THEUNOiA software services, bespoke digital products, and websites.',
    canonical: 'https://www.theunoia.com/terms',
    priority: '0.5',
    changefreq: 'monthly'
  },
  {
    path: '/refund',
    title: 'Refund & Cancellation Policy · THEUNOiA',
    description: 'Review THEUNOiA milestone payment structures, sprint cancellations, defect warranty, and refund terms.',
    canonical: 'https://www.theunoia.com/refund',
    priority: '0.5',
    changefreq: 'monthly'
  },
  {
    path: '/blog/editor',
    title: 'Editorial Studio · THEUNOiA',
    description: 'THEUNOiA Blog Editorial Studio',
    canonical: 'https://www.theunoia.com/blog/editor',
    robots: 'noindex, nofollow'
  },
  {
    path: '/404',
    title: '404: Page Not Found — THEUNOiA',
    description: 'The page you are looking for does not exist.',
    canonical: 'https://www.theunoia.com/404',
    robots: 'noindex, nofollow'
  }
];

async function fetchPublishedArticles() {
  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('placeholder')) {
    console.log('[prerender] Supabase not fully configured; skipping dynamic article prerender.');
    return [];
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const nowIso = new Date().toISOString();
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'published')
      .or(`published_at.is.null,published_at.lte.${nowIso}`);

    if (error) {
      console.warn('[prerender] Could not fetch blog posts from Supabase:', error.message);
      return [];
    }
    return data || [];
  } catch (err) {
    console.warn('[prerender] Error connecting to Supabase:', err.message);
    return [];
  }
}

function generateSitemap(routes, publishedArticles) {
  const today = new Date().toISOString().split('T')[0];
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Core public routes (excluding 404 and editor)
  for (const r of routes) {
    if (r.path === '/404' || r.path.startsWith('/blog/editor')) continue;
    xml += '  <url>\n';
    xml += `    <loc>${r.canonical}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${r.changefreq || 'monthly'}</changefreq>\n`;
    xml += `    <priority>${r.priority || '0.7'}</priority>\n`;
    xml += '  </url>\n';
  }

  // Published articles
  for (const art of publishedArticles) {
    const artDate = art.published_at ? art.published_at.split('T')[0] : today;
    xml += '  <url>\n';
    xml += `    <loc>https://www.theunoia.com/blog/${art.slug}</loc>\n`;
    xml += `    <lastmod>${artDate}</lastmod>\n`;
    xml += '    <changefreq>weekly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  }

  xml += '</urlset>\n';
  return xml;
}

async function main() {
  console.log('[prerender] Step 1: Building SSR entry bundle...');
  execSync('npx vite build --ssr src/prerender-entry.jsx --outDir dist-ssr', {
    cwd: rootDir,
    stdio: 'inherit'
  });

  const ssrEntryPath = path.resolve(ssrOutDir, 'prerender-entry.js');
  const { renderPage } = await import(pathToFileURL(ssrEntryPath).href);

  const templatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error(`Client build not found at ${templatePath}. Run 'vite build' first.`);
  }
  const rawTemplate = fs.readFileSync(templatePath, 'utf8');

  // Fetch published articles
  console.log('[prerender] Checking Supabase for published articles...');
  const publishedArticles = await fetchPublishedArticles();
  console.log(`[prerender] Found ${publishedArticles.length} published articles.`);

  const allRoutes = [...CORE_ROUTES];
  for (const art of publishedArticles) {
    allRoutes.push({
      path: `/blog/${art.slug}`,
      title: `${art.seo_title || art.title} · THEUNOiA Blog`,
      description: art.seo_description || art.excerpt,
      canonical: `https://www.theunoia.com/blog/${art.slug}`,
      image: art.featured_image || 'https://www.theunoia.com/assets/og-image.png'
    });
  }

  console.log('[prerender] Step 2: Prerendering routes to static HTML...');
  for (const route of allRoutes) {
    console.log(`  -> Prerendering ${route.path}...`);
    const appHtml = renderPage(route.path);

    let html = rawTemplate;

    // Replace root content
    html = html.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    // Replace Title
    html = html.replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`);

    // Replace Meta Description
    html = html.replace(
      /<meta\s+name="description"\s+content=".*?"\s*\/?>/i,
      `<meta name="description" content="${route.description}">`
    );

    // Replace Canonical
    html = html.replace(
      /<link\s+rel="canonical"\s+href=".*?"\s*\/?>/i,
      `<link rel="canonical" href="${route.canonical}">`
    );

    // Replace OG Title & Description & URL
    html = html.replace(
      /<meta\s+property="og:title"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:title" content="${route.title}">`
    );
    html = html.replace(
      /<meta\s+property="og:description"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:description" content="${route.description}">`
    );
    html = html.replace(
      /<meta\s+property="og:url"\s+content=".*?"\s*\/?>/i,
      `<meta property="og:url" content="${route.canonical}">`
    );

    if (route.image) {
      html = html.replace(
        /<meta\s+property="og:image"\s+content=".*?"\s*\/?>/i,
        `<meta property="og:image" content="${route.image}">`
      );
    }

    // Replace Twitter Title & Description & URL
    html = html.replace(
      /<meta\s+name="twitter:title"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${route.title}">`
    );
    html = html.replace(
      /<meta\s+name="twitter:description"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${route.description}">`
    );
    html = html.replace(
      /<meta\s+name="twitter:url"\s+content=".*?"\s*\/?>/i,
      `<meta name="twitter:url" content="${route.canonical}">`
    );

    if (route.image) {
      html = html.replace(
        /<meta\s+name="twitter:image"\s+content=".*?"\s*\/?>/i,
        `<meta name="twitter:image" content="${route.image}">`
      );
    }

    // Add robots meta if needed
    if (route.robots) {
      html = html.replace('</head>', `  <meta name="robots" content="${route.robots}">\n</head>`);
    }

    // Determine target file
    let targetFile;
    if (route.path === '/') {
      targetFile = path.resolve(distDir, 'index.html');
    } else if (route.path === '/404') {
      targetFile = path.resolve(distDir, '404.html');
    } else {
      const subDir = path.resolve(distDir, route.path.replace(/^\//, ''));
      fs.mkdirSync(subDir, { recursive: true });
      targetFile = path.resolve(subDir, 'index.html');
    }

    fs.writeFileSync(targetFile, html, 'utf8');
  }

  // Step 3: Generate Sitemap
  console.log('[prerender] Step 3: Generating sitemap.xml...');
  const sitemapXml = generateSitemap(CORE_ROUTES, publishedArticles);
  fs.writeFileSync(path.resolve(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
  fs.writeFileSync(path.resolve(rootDir, 'public', 'sitemap.xml'), sitemapXml, 'utf8');

  // Step 4: Cleanup
  console.log('[prerender] Step 4: Cleaning up temporary SSR artifacts...');
  fs.rmSync(ssrOutDir, { recursive: true, force: true });
  console.log('[prerender] Prerendering successfully completed!');
}

main().catch((err) => {
  console.error('[prerender] Failed to prerender:', err);
  process.exit(1);
});
