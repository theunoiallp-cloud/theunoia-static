import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { db, initDatabase, cleanupExpiredSessions } from './config/db.js';
import { initializeDbAndAuth } from './scripts/init-db.js';

import contactRouter from './routes/contact.js';
import makerRouter from './routes/maker.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Respect reverse proxy (e.g., Nginx, Caddy, Cloudflare)
app.set('trust proxy', 1);

// Configure CORS
const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(origin => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser tools (e.g., curl, server-to-server) or listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin '${origin}' not permitted by CORS policy`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request body size limits and cookie parsing
app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());

// Rate limiter for public submission endpoints (max 10 submissions per minute per IP)
const submissionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please wait a moment before submitting again.'
  }
});

// Health check endpoint (exposes no sensitive system/db data)
app.get('/api/health', (req, res) => {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
app.use('/api', submissionLimiter, contactRouter);
app.use('/api', submissionLimiter, makerRouter);
app.use('/api/admin', adminRouter);

// 404 handler for API
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'Endpoint not found' });
});

// Global error handler (prevents stack traces and internal leaks in production)
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  res.status(500).json({
    success: false,
    error: 'An internal server error occurred.'
  });
});

// Auto-cleanup expired sessions every hour
setInterval(() => {
  try {
    cleanupExpiredSessions();
  } catch (err) {
    console.error('Session cleanup error:', err.message);
  }
}, 60 * 60 * 1000);

// Initialize DB and start server
async function startServer() {
  await initializeDbAndAuth();
  const server = app.listen(PORT, () => {
    console.log(`THEUNOiA backend server running on port ${PORT}`);
  });
  return { app, server };
}

// Start if executed directly
if (process.argv[1] && process.argv[1].endsWith('server.js')) {
  startServer().catch(err => {
    console.error('Fatal server startup error:', err);
    process.exit(1);
  });
}

export { app, startServer };
