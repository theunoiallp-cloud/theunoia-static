import { app } from '../backend/src/server.js';
import { initDatabase } from '../backend/src/config/db.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    try {
      await initDatabase();
      initialized = true;
    } catch (err) {
      console.error('Failed to ensure database schema in serverless function:', err.message);
    }
  }
  return app(req, res);
}
