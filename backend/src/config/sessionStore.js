import crypto from 'crypto';
import { db } from '../config/db.js';

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function createSession(userId, ip, userAgent) {
  const sessionId = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const sessionData = JSON.stringify({
    userId,
    ip,
    userAgent,
    createdAt: new Date().toISOString()
  });

  await db.execute({
    sql: 'INSERT INTO sessions (id, data, expires_at) VALUES (?, ?, ?)',
    args: [sessionId, sessionData, expiresAt]
  });

  return { sessionId, expiresAt };
}

export async function getSession(sessionId) {
  if (!sessionId) return null;
  const rs = await db.execute({
    sql: 'SELECT id, data, expires_at FROM sessions WHERE id = ?',
    args: [sessionId]
  });

  const row = rs.rows[0];
  if (!row) return null;

  if (Number(row.expires_at) < Date.now()) {
    await deleteSession(sessionId);
    return null;
  }

  try {
    const data = JSON.parse(row.data);
    return { id: row.id, ...data, expiresAt: row.expires_at };
  } catch {
    return null;
  }
}

export async function deleteSession(sessionId) {
  if (!sessionId) return;
  await db.execute({
    sql: 'DELETE FROM sessions WHERE id = ?',
    args: [sessionId]
  });
}
