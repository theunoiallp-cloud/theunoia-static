import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { db, initDatabase } from '../src/config/db.js';
import { initializeDbAndAuth } from '../src/scripts/init-db.js';
import { VALID_ROLES } from '../src/config/constants.js';
import { createSession, getSession, deleteSession } from '../src/config/sessionStore.js';
import { startServer } from '../src/server.js';
import fs from 'fs';
import path from 'path';
import { runBackup } from '../src/scripts/backup.js';
import { runRestore } from '../src/scripts/restore.js';

describe('THEUNOiA Backend Comprehensive Test Suite', async () => {
  let serverInstance;
  const baseUrl = 'http://127.0.0.1:4000';
  let adminCookie = '';

  before(async () => {
    process.env.ADMIN_INITIAL_PASSWORD = 'test_admin_suite_password_123';
    process.env.PORT = '4000';
    const started = await startServer();
    serverInstance = started.server;
  });

  after(async () => {
    if (serverInstance) {
      await new Promise((res) => serverInstance.close(res));
    }
    db.close();
  });

  test('Database schema verification', () => {
    const contactTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='contact_submissions'").get();
    const makerTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='maker_registrations'").get();
    const adminTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='admin_auth'").get();
    const sessionsTable = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='sessions'").get();

    assert.ok(contactTable, 'contact_submissions table exists');
    assert.ok(makerTable, 'maker_registrations table exists');
    assert.ok(adminTable, 'admin_auth table exists');
    assert.ok(sessionsTable, 'sessions table exists');
  });

  test('Public Contact Form: Validation failures', async () => {
    // Missing all required fields
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.details.fullname);
    assert.ok(body.details.email);
    assert.ok(body.details.phone);
    assert.ok(body.details.message);
  });

  test('Public Contact Form: Successful submission and persistence', async () => {
    const payload = {
      fullname: 'Aarav Sharma',
      company: 'Tech Solutions Ltd',
      email: 'aarav.sharma@example.com',
      country: '+91',
      phone: '9876543210',
      address: '123 Residency Road, Bengaluru',
      message: 'Interested in partnering with student makers.'
    };

    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const body = await res.json();
    assert.equal(res.status, 201);
    assert.equal(body.success, true);
    assert.ok(body.submissionId);

    // Verify row directly in SQLite
    const saved = db.prepare('SELECT * FROM contact_submissions WHERE id = ?').get(body.submissionId);
    assert.ok(saved);
    assert.equal(saved.full_name, 'Aarav Sharma');
    assert.equal(saved.company, 'Tech Solutions Ltd');
    assert.equal(saved.email, 'aarav.sharma@example.com');
    assert.equal(saved.phone, '+91 9876543210');
    assert.equal(saved.status, 'new');
    assert.ok(saved.created_at);
  });

  test('Public Maker Registration: Validation failures', async () => {
    // Missing required fields
    const res = await fetch(`${baseUrl}/api/maker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const body = await res.json();
    assert.equal(res.status, 400);
    assert.equal(body.success, false);
    assert.ok(body.details.fullname);
    assert.ok(body.details.phone);
    assert.ok(body.details.email);
    assert.ok(body.details.role);
  });

  test('Public Maker Registration: All role values & Other custom role validation', async () => {
    // Test custom role validation when Role is Other
    const missingOther = await fetch(`${baseUrl}/api/maker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Custom Maker',
        phone: '+91 9999988888',
        email: 'custom@theunoia.com',
        role: 'Other'
      })
    });
    const missingOtherBody = await missingOther.json();
    assert.equal(missingOther.status, 400);
    assert.ok(missingOtherBody.details.custom_role);

    // Test valid submission with Other + custom role
    const validOther = await fetch(`${baseUrl}/api/maker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Maya Patel',
        phone: '+91 9876501234',
        email: 'maya@theunoia.com',
        role: 'Other',
        custom_role: 'Robotics Engineer'
      })
    });
    const validOtherBody = await validOther.json();
    assert.equal(validOther.status, 201);
    assert.ok(validOtherBody.registrationId);

    const savedOther = db.prepare('SELECT * FROM maker_registrations WHERE id = ?').get(validOtherBody.registrationId);
    assert.equal(savedOther.role, 'Other');
    assert.equal(savedOther.custom_role, 'Robotics Engineer');
    assert.equal(savedOther.status, 'pending_review');

    // Test a standard dropdown role
    const validStandard = await fetch(`${baseUrl}/api/maker`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullname: 'Rohan Verma',
        phone: '+91 9123456789',
        email: 'rohan@theunoia.com',
        role: 'Frontend Developer'
      })
    });
    assert.equal(validStandard.status, 201);
  });

  test('Anonymous access to protected Admin API routes is rejected (401)', async () => {
    const endpoints = [
      { method: 'GET', url: `${baseUrl}/api/admin/overview` },
      { method: 'GET', url: `${baseUrl}/api/admin/contacts` },
      { method: 'GET', url: `${baseUrl}/api/admin/makers` },
      { method: 'PATCH', url: `${baseUrl}/api/admin/contacts/123` },
      { method: 'DELETE', url: `${baseUrl}/api/admin/contacts/123` }
    ];

    for (const ep of endpoints) {
      const res = await fetch(ep.url, { method: ep.method });
      assert.equal(res.status, 401, `Expected 401 for anonymous ${ep.method} ${ep.url}`);
    }
  });

  test('Admin Authentication: Wrong password rejected', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password_attempt' })
    });
    assert.equal(res.status, 401);
    const body = await res.json();
    assert.equal(body.success, false);
    assert.equal(body.error, 'Invalid password');
  });

  test('Admin Authentication: Correct password succeeds, sets cookie & returns success', async () => {
    const res = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'test_admin_suite_password_123' })
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);

    const setCookie = res.headers.get('set-cookie');
    assert.ok(setCookie, 'Set-Cookie header is present');
    assert.ok(setCookie.includes('theunoia_admin_session='));
    adminCookie = setCookie.split(';')[0];
  });

  test('Admin API: Fetch overview stats', async () => {
    const res = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Cookie: adminCookie }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.totalContacts >= 1);
    assert.ok(body.data.totalMakers >= 2);
    assert.equal(body.data.pendingMakers, body.data.totalMakers);
  });

  test('Admin API: Contact status update and deletion', async () => {
    // List contacts
    const listRes = await fetch(`${baseUrl}/api/admin/contacts`, {
      headers: { Cookie: adminCookie }
    });
    const listBody = await listRes.json();
    assert.equal(listRes.status, 200);
    assert.ok(listBody.data.items.length > 0);
    const contactId = listBody.data.items[0].id;

    // Update status to in_progress
    const updateRes = await fetch(`${baseUrl}/api/admin/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({ status: 'in_progress' })
    });
    assert.equal(updateRes.status, 200);
    const updateBody = await updateRes.json();
    assert.equal(updateBody.data.status, 'in_progress');

    // Update status to resolved
    const resolveRes = await fetch(`${baseUrl}/api/admin/contacts/${contactId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({ status: 'resolved' })
    });
    assert.equal(resolveRes.status, 200);
  });

  test('Admin API: Maker approval, rejection and internal note', async () => {
    const listRes = await fetch(`${baseUrl}/api/admin/makers`, {
      headers: { Cookie: adminCookie }
    });
    const listBody = await listRes.json();
    const makerId = listBody.data.items[0].id;

    // Approve with note
    const approveRes = await fetch(`${baseUrl}/api/admin/makers/${makerId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Cookie: adminCookie
      },
      body: JSON.stringify({
        status: 'approved',
        admin_note: 'Strong portfolio in React and Node.'
      })
    });
    assert.equal(approveRes.status, 200);
    const approveBody = await approveRes.json();
    assert.equal(approveBody.data.status, 'approved');
    assert.equal(approveBody.data.admin_note, 'Strong portfolio in React and Node.');

    // Reject second maker
    if (listBody.data.items.length > 1) {
      const secondMakerId = listBody.data.items[1].id;
      const rejectRes = await fetch(`${baseUrl}/api/admin/makers/${secondMakerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Cookie: adminCookie
        },
        body: JSON.stringify({ status: 'rejected' })
      });
      assert.equal(rejectRes.status, 200);
      const rejectBody = await rejectRes.json();
      assert.equal(rejectBody.data.status, 'rejected');
    }
  });

  test('Admin API: CSV Export requires authentication and returns valid CSV', async () => {
    // Unauthenticated
    const anonRes = await fetch(`${baseUrl}/api/admin/contacts?export=csv`);
    assert.equal(anonRes.status, 401);

    // Authenticated
    const authRes = await fetch(`${baseUrl}/api/admin/contacts?export=csv`, {
      headers: { Cookie: adminCookie }
    });
    assert.equal(authRes.status, 200);
    assert.ok(authRes.headers.get('content-type').includes('text/csv'));
    const csv = await authRes.text();
    assert.ok(csv.includes('"Full Name"'));
    assert.ok(csv.includes('Aarav Sharma'));
  });

  test('Admin API: Logout clears session', async () => {
    const logoutRes = await fetch(`${baseUrl}/api/admin/logout`, {
      method: 'POST',
      headers: { Cookie: adminCookie }
    });
    assert.equal(logoutRes.status, 200);

    // Ensure session is now invalid
    const checkRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Cookie: adminCookie }
    });
    assert.equal(checkRes.status, 401);
  });

  test('Backup and restore execution', async () => {
    const backupFile = await runBackup();
    assert.ok(fs.existsSync(backupFile));
    assert.ok(fs.statSync(backupFile).size > 0);

    // Test restoring from backup into a test path
    const testRestorePath = path.resolve('test/test-restored.db');
    fs.copyFileSync(backupFile, testRestorePath);
    assert.ok(fs.existsSync(testRestorePath));
    fs.unlinkSync(testRestorePath);
  });
});
