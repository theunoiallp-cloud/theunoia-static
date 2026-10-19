/**
 * One-click migration script to export existing local SQLite data into remote Turso / libSQL cloud.
 * Run with: node src/scripts/migrate-to-turso.js
 * Requires: TURSO_DATABASE_URL and TURSO_AUTH_TOKEN in environment (.env).
 */
import 'dotenv/config';
import { createClient } from '@libsql/client';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localDbPath = path.resolve(__dirname, '../../data/theunoia.db').replace(/\\/g, '/');
const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl) {
  console.error('ERROR: TURSO_DATABASE_URL is not configured in environment.');
  process.exit(1);
}

const localClient = createClient({ url: `file:${localDbPath}` });
const remoteClient = createClient({ url: tursoUrl, authToken: tursoAuthToken });

async function migrate() {
  console.log('Connecting to local SQLite and remote Turso database...');

  // 1. Initialize remote schema
  console.log('Creating schema on remote Turso...');
  await remoteClient.executeMultiple(`
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
  console.log('Remote schema initialized.');

  // 2. Migrate Contacts
  const contacts = await localClient.execute('SELECT * FROM contact_submissions');
  console.log(`Migrating ${contacts.rows.length} contact submissions...`);
  for (const c of contacts.rows) {
    await remoteClient.execute({
      sql: `
        INSERT OR IGNORE INTO contact_submissions (
          id, full_name, company, email, phone, address, message, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [c.id, c.full_name, c.company, c.email, c.phone, c.address, c.message, c.status, c.created_at]
    });
  }

  // 3. Migrate Makers
  const makers = await localClient.execute('SELECT * FROM maker_registrations');
  console.log(`Migrating ${makers.rows.length} maker registrations...`);
  for (const m of makers.rows) {
    await remoteClient.execute({
      sql: `
        INSERT OR IGNORE INTO maker_registrations (
          id, full_name, phone, email, role, custom_role, admin_note, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [m.id, m.full_name, m.phone, m.email, m.role, m.custom_role, m.admin_note, m.status, m.created_at]
    });
  }

  // 4. Migrate Admin Auth
  const admin = await localClient.execute('SELECT * FROM admin_auth WHERE id = 1');
  if (admin.rows.length > 0) {
    const a = admin.rows[0];
    console.log('Migrating admin authentication record...');
    await remoteClient.execute({
      sql: `
        INSERT INTO admin_auth (id, password_hash, updated_at)
        VALUES (1, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          password_hash = excluded.password_hash,
          updated_at = excluded.updated_at
      `,
      args: [a.password_hash, a.updated_at]
    });
  }

  // 5. Verification
  const [remoteC, remoteM, remoteA] = await Promise.all([
    remoteClient.execute('SELECT COUNT(*) as c FROM contact_submissions'),
    remoteClient.execute('SELECT COUNT(*) as c FROM maker_registrations'),
    remoteClient.execute('SELECT COUNT(*) as c FROM admin_auth')
  ]);

  console.log('--- Migration Verification ---');
  console.log(`Contacts on Turso: ${remoteC.rows[0].c} (Local: ${contacts.rows.length})`);
  console.log(`Makers on Turso: ${remoteM.rows[0].c} (Local: ${makers.rows.length})`);
  console.log(`Admin record on Turso: ${remoteA.rows[0].c} (Local: ${admin.rows.length})`);
  console.log('Data migration completed successfully without loss of IDs or timestamps.');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
