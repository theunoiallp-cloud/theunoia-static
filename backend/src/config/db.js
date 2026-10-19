import { createClient } from '@libsql/client';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Turso or local SQLite
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

let clientConfig;

if (tursoUrl) {
  // Production / Remote Turso cloud connection
  clientConfig = {
    url: tursoUrl,
    authToken: tursoAuthToken
  };
} else {
  // Local development / fallback to SQLite file
  const defaultDbPath = path.resolve(__dirname, '../../data/theunoia.db');
  const dbPath = process.env.DATABASE_PATH ? path.resolve(process.env.DATABASE_PATH) : defaultDbPath;
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  // Convert Windows path separators for libSQL file URL
  const normalizedPath = dbPath.replace(/\\/g, '/');
  clientConfig = {
    url: `file:${normalizedPath}`
  };
}

export const db = createClient(clientConfig);

export async function initDatabase() {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      company TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      message TEXT,
      status TEXT NOT NULL DEFAULT 'new',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
    CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);

    CREATE TABLE IF NOT EXISTS maker_registrations (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      custom_role TEXT,
      admin_note TEXT,
      status TEXT NOT NULL DEFAULT 'pending_review',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_maker_status ON maker_registrations(status);
    CREATE INDEX IF NOT EXISTS idx_maker_role ON maker_registrations(role);
    CREATE INDEX IF NOT EXISTS idx_maker_created_at ON maker_registrations(created_at);

    CREATE TABLE IF NOT EXISTS admin_auth (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      password_hash TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);
  `);
}

export async function cleanupExpiredSessions() {
  const now = Date.now();
  await db.execute({
    sql: 'DELETE FROM sessions WHERE expires_at < ?',
    args: [now]
  });
}
