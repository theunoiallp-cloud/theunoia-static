import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db, initDatabase } from '../config/db.js';

export async function setAdminPassword(newPassword) {
  if (!newPassword || typeof newPassword !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  await initDatabase();
  const saltRounds = 12;
  const hash = await bcrypt.hash(newPassword, saltRounds);
  const now = new Date().toISOString();

  // Upsert the single admin auth record (id = 1)
  await db.execute({
    sql: `
      INSERT INTO admin_auth (id, password_hash, updated_at)
      VALUES (1, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        password_hash = excluded.password_hash,
        updated_at = excluded.updated_at
    `,
    args: [hash, now]
  });

  // Invalidate any active sessions on password change for security
  await db.execute('DELETE FROM sessions');
}

if (process.argv[1] && process.argv[1].endsWith('set-admin-password.js')) {
  const pwd = process.env.ADMIN_INITIAL_PASSWORD;
  if (!pwd) {
    console.error('Error: No ADMIN_INITIAL_PASSWORD environment variable found.');
    process.exit(1);
  }

  setAdminPassword(pwd)
    .then(() => {
      console.log('Admin password hash successfully updated in database.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Error updating admin password:', err.message);
      process.exit(1);
    });
}
