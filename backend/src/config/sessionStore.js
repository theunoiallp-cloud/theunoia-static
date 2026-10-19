import crypto from 'crypto';
import { db } from '../config/db.js';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function createSession(userId, ip, userAgent) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const sessionData = JSON.stringify({
    userId,
    ip,
    userAgent,
    createdAt: new Date().toISOString()
  });

  const stmt = db.prepare('INSERT INTO sessions (id, data, expires_at) VALUES (?, ?, ?)');
  stmt.run(sessionId, sessionData, expiresAt);

  return { sessionId, expiresAt };
}

export function getSession(sessionId) {
  if (!sessionId) return null;
  const stmt = db.prepare('SELECT id, data, expires_at FROM sessions WHERE id = ?');
  const row = stmt.get(sessionId);

  if (!row) return null;

  if (row.expires_at < Date.now()) {
    deleteSession(sessionId);
    return null;
  }

  try {
    const data = JSON.parse(row.data);
    return { id: row.id, ...data, expiresAt: row.expires_at };
  } catch {
    return null;
  }
}

export function deleteSession(sessionId) {
  if (!sessionId) return;
  const stmt = db.prepare('DELETE FROM sessions WHERE id = ?');
  stmt.run(sessionId);
}
