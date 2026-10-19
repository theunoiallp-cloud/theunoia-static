import fs from 'fs';
import path from 'path';
import { dbPath } from '../config/db.js';

export function runRestore(backupFilePath) {
  if (!backupFilePath) {
    console.error('Usage: node restore.js <path-to-backup.db>');
    process.exit(1);
  }

  const resolvedBackup = path.resolve(backupFilePath);
  if (!fs.existsSync(resolvedBackup)) {
    console.error(`Backup file does not exist: ${resolvedBackup}`);
    process.exit(1);
  }

  console.log(`Restoring database from ${resolvedBackup} to ${dbPath}...`);
  // Ensure target directory exists
  const targetDir = path.dirname(dbPath);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Copy backup file over target database
  fs.copyFileSync(resolvedBackup, dbPath);
  console.log(`Database successfully restored to ${dbPath}`);
}

if (process.argv[1] && process.argv[1].endsWith('restore.js')) {
  const targetBackup = process.argv[2];
  runRestore(targetBackup);
}
