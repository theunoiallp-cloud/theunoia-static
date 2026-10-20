import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const ssrOutDir = path.resolve(rootDir, 'dist-ssr');

const ROUTES = [
  {
    path: '/',
    title: 'THEUNOiA — Software Development Company in India',
    description: 'THEUNOiA builds websites, web apps, and custom software for businesses and startups. Beautiful thinking, built into every product.',
    canonical: 'https://www.theunoia.com/',
  },
  {
    path: '/story',
    title: 'Our Story · THEUNOiA',
    description: 'The story of THEUNOiA: turning ideas into impact with student makers, SkillBridge, and digital solutions for businesses.',
    canonical: 'https://www.theunoia.com/story',
  },
  {
    path: '/team',
    title: 'Team · THEUNOiA',
    description: 'Meet the squad building THEUNOiA, Hunhar, and Hivh across design, engineering, strategy, and brand.',
    canonical: 'https://www.theunoia.com/team',
  },
  {
    path: '/hivh',
    title: 'Hivh · THEUNOiA',
    description: 'Hivh: A student-first community hosting workshops, awareness drives, and meetups across 16 cities.',
    canonical: 'https://www.theunoia.com/hivh',
  },
  {
    path: '/hunhar',
    title: 'Hunhar · THEUNOiA',
    description: 'Hunhar: Bharat’s student-first freelance platform connecting emerging talent with real business projects.',
    canonical: 'https://www.theunoia.com/hunhar',
  },
  {
    path: '/blog',
    title: 'Blog · THEUNOiA',
    description: 'Read the latest insights, stories, student freelancing advice, and updates from the THEUNOiA team.',
    canonical: 'https://www.theunoia.com/blog',
  },
  {
    path: '/contact',
    title: 'Contact Us — THEUNOiA',
    description: 'Get in touch with THEUNOiA. We build software, digital platforms, and custom tech solutions for startups and businesses.',
    canonical: 'https://www.theunoia.com/contact',
  },
  {
    path: '/become-a-maker',
    title: 'Become a Maker · THEUNOiA',
    description: 'Apply to join THEUNOiA as a maker across engineering, design, product, and growth departments.',
    canonical: 'https://www.theunoia.com/become-a-maker',
  },
  {
    path: '/404',
    title: '404: Page Not Found — THEUNOiA',
    description: 'The page you are looking for does not exist.',
    canonical: 'https://www.theunoia.com/404',
    robots: 'noindex, nofollow',
  }
];

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

  console.log('[prerender] Step 2: Prerendering routes to static HTML...');
  for (const route of ROUTES) {
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

  console.log('[prerender] Step 3: Cleaning up temporary SSR artifacts...');
  fs.rmSync(ssrOutDir, { recursive: true, force: true });
  console.log('[prerender] Prerendering successfully completed!');
}

main().catch((err) => {
  console.error('[prerender] Failed to prerender:', err);
  process.exit(1);
});
