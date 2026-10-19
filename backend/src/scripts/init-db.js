import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db, initDatabase } from '../config/db.js';

export async function initializeDbAndAuth() {
  console.log('Initializing database schema...');
  initDatabase();
  console.log('Database tables and indexes initialized.');

  const adminRow = db.prepare('SELECT id FROM admin_auth WHERE id = 1').get();
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD;

  if (!adminRow) {
    if (!initialPassword) {
      console.warn('WARNING: No ADMIN_INITIAL_PASSWORD supplied in environment. Admin account is not seeded yet.');
    } else {
      console.log('Seeding initial admin password hash into SQLite...');
      const saltRounds = 12;
      const hash = await bcrypt.hash(initialPassword, saltRounds);
      const now = new Date().toISOString();
      db.prepare('INSERT INTO admin_auth (id, password_hash, updated_at) VALUES (1, ?, ?)').run(hash, now);
      console.log('Admin password hash seeded successfully.');
    }
  } else {
    console.log('Admin password already initialized in database.');
  }
}

// Execute directly if run as CLI script
if (process.argv[1] && process.argv[1].endsWith('init-db.js')) {
  initializeDbAndAuth()
    .then(() => {
      console.log('Database initialization complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error during database initialization:', err);
      process.exit(1);
    });
}
