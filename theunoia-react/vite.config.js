import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Local development middleware for testing Vercel API routes with Vite dev server.
 */
function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/send-confirmation')) {
          if (req.method === 'POST') {
            let raw = '';
            req.on('data', (chunk) => (raw += chunk));
            req.on('end', async () => {
              try {
                req.body = raw ? JSON.parse(raw) : {};
              } catch {
                req.body = {};
              }
              try {
                const { default: handler } = await import('./api/send-confirmation.js');
                await handler(req, res);
              } catch (err) {
                console.error('[Local API Error]', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: err.message }));
              }
            });
            return;
          }
          if (req.method === 'OPTIONS') {
            res.statusCode = 200;
            res.end();
            return;
          }
        }
        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 650,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@tiptap')) {
              return 'vendor-editor';
            }
            if (id.includes('three')) {
              return 'vendor-three';
            }
            if (
              id.includes('/react/') ||
              id.includes('\\react\\') ||
              id.includes('/react-dom/') ||
              id.includes('\\react-dom\\') ||
              id.includes('/react-router/') ||
              id.includes('\\react-router\\') ||
              id.includes('/react-router-dom/') ||
              id.includes('\\react-router-dom\\') ||
              id.includes('/scheduler/') ||
              id.includes('\\scheduler\\')
            ) {
              return 'vendor-react';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('dompurify')) {
              return 'vendor-dompurify';
            }
          }
        }
      }
    }
  }
});
