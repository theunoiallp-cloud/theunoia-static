import fs from 'fs';
import path from 'path';
import { db, dbPath } from '../config/db.js';

export function runBackup() {
  const backupDir = process.env.BACKUP_PATH
    ? path.resolve(process.env.BACKUP_PATH)
    : path.resolve(path.dirname(dbPath), '../backups');

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFile = path.join(backupDir, `theunoia-backup-${timestamp}.db`);

  console.log(`Starting backup of ${dbPath} to ${backupFile}...`);
  // Use SQLite online backup API provided by better-sqlite3
  return db.backup(backupFile)
    .then(() => {
      console.log(`Backup completed successfully: ${backupFile}`);
      // Set secure permissions on Unix if available
      try {
        fs.chmodSync(backupFile, 0o600);
      } catch {
        // Ignored on Windows
      }
      return backupFile;
    })
    .catch((err) => {
      console.error('Backup failed:', err);
      throw err;
    });
}

if (process.argv[1] && process.argv[1].endsWith('backup.js')) {
  runBackup()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
