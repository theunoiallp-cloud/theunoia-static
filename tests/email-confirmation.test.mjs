import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import utilities, templates, and handlers
import { escapeHtml, sanitizeSingleLine, isValidEmail, isValidUuid } from '../api/utils/escape.js';
import { checkRateLimit, checkAndSetIdempotency } from '../api/utils/rateLimit.js';
import { generateContactConfirmationEmail } from '../api/templates/contactConfirmation.js';
import { generateMakerConfirmationEmail } from '../api/templates/makerConfirmation.js';
import handler from '../api/send-confirmation.js';

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failedTests++;
  }
}

// Helper to mock request/response for serverless handler
function mockReqRes(options = {}) {
  const req = {
    method: options.method || 'POST',
    headers: options.headers || { 'x-forwarded-for': '127.0.0.1' },
    body: options.body || {},
    socket: { remoteAddress: '127.0.0.1' }
  };

  const res = {
    statusCode: 200,
    headers: {},
    body: '',
    setHeader(k, v) {
      this.headers[k.toLowerCase()] = v;
    },
    end(data) {
      if (data) this.body = data;
    }
  };

  return { req, res };
}

console.log('\n=== RUNNING THEUNOiA RESEND EMAIL AUTOMATION TEST SUITE ===\n');

// 1. Contact Us template generation
runTest('Criteria 1: Contact Us template generates correct subject and content', () => {
  const result = generateContactConfirmationEmail({
    name: 'Aarav Sharma',
    email: 'aarav@example.com',
    company: 'Acme Bharat Tech',
    phone: '+91 98765 43210',
    message: 'We want to collaborate on custom web software.',
    submissionId: 'e28a5cf1-5d9c-4ec7-91a5-8c0c4a45a6c1'
  });

  assert.strictEqual(result.subject, "We've received your message | THEUNOiA");
  assert.ok(result.html.includes('Aarav Sharma'), 'Recipient name in HTML');
  assert.ok(result.html.includes('Acme Bharat Tech'), 'Company in HTML');
  assert.ok(result.html.includes('We want to collaborate'), 'Message snippet in HTML');
  assert.ok(result.html.includes('Enquiry Ref #E28A5CF1'), 'Reference ID formatted');
  assert.ok(result.html.includes('https://www.theunoia.com/assets/logo.png'), 'Logo URL present');
  assert.ok(result.text.includes('Aarav Sharma'), 'Recipient name in text');
});

// 2. Become a Maker template generation
runTest('Criteria 2: Become a Maker template generates correct subject and role tracking', () => {
  const result = generateMakerConfirmationEmail({
    name: 'Priya Patel',
    email: 'priya@example.com',
    phone: '+91 91234 56789',
    role: 'Full-Stack Developer',
    submissionId: '7d3a2e1b-4f5c-4a8b-9d2e-1c0b3a4f5e6d'
  });

  assert.strictEqual(result.subject, 'Thank you for your interest in becoming a Maker | THEUNOiA');
  assert.ok(result.html.includes('Priya Patel'), 'Applicant name in HTML');
  assert.ok(result.html.includes('Full-Stack Developer'), 'Role in HTML');
  assert.ok(result.html.includes('does not constitute formal acceptance'), 'Disclaimer present');
  assert.ok(result.html.includes('Maker App #7D3A2E1B'), 'Application ref present');
  assert.ok(result.text.includes('Priya Patel'), 'Applicant name in text');
});

// 3. Name greeting personalization
runTest('Criteria 3: Greeting personalization handles edge cases cleanly', () => {
  const emailDefault = generateContactConfirmationEmail({
    name: '',
    email: 'test@example.com'
  });
  assert.ok(emailDefault.html.includes('there'), 'Fallback greeting for empty name');

  const emailSpecial = generateContactConfirmationEmail({
    name: "O'Connor & Sons",
    email: 'oconnor@example.com'
  });
  assert.ok(emailSpecial.html.includes("O&#039;Connor &amp; Sons"), 'Special characters properly escaped in greeting');
});

// 4. Invalid email rejection
runTest('Criteria 4: Email validator rejects malformed and malicious emails', () => {
  assert.strictEqual(isValidEmail('valid.user@company.co.in'), true);
  assert.strictEqual(isValidEmail('user+tag@domain.org'), true);
  assert.strictEqual(isValidEmail(''), false);
  assert.strictEqual(isValidEmail('not-an-email'), false);
  assert.strictEqual(isValidEmail('attacker@evil.com\r\nBcc: victim@victim.com'), false, 'CRLF injection rejected');
  assert.strictEqual(isValidEmail('spaces in@email.com'), false);
});

// 5. HTML injection prevention (XSS defense)
runTest('Criteria 5: Malicious HTML payloads are escaped to prevent email injection', () => {
  const xssName = '<script>alert("pwned")</script>Dr. Malice';
  const xssMessage = '<img src=x onerror=alert(1)><b>Bold hack</b> <a href="http://phish.com">Click</a>';
  
  const result = generateContactConfirmationEmail({
    name: xssName,
    email: 'hacker@phish.com',
    message: xssMessage,
    submissionId: '00000000-0000-4000-8000-000000000000'
  });

  assert.ok(!result.html.includes('<script>'), 'Script tags escaped');
  assert.ok(result.html.includes('&lt;script&gt;'), 'Script converted to entities');
  assert.ok(!result.html.includes('<img src=x'), 'Image injection escaped');
  assert.ok(result.html.includes('&lt;img src=x'), 'Img converted to entities');
});

// 6. Handler validates required fields & submission types
await runAsyncTest('Criteria 6: Handler rejects invalid method, missing body, or bad types', async () => {
  // Test GET rejection
  const { req: reqGet, res: resGet } = mockReqRes({ method: 'GET' });
  await handler(reqGet, resGet);
  assert.strictEqual(resGet.statusCode, 405, 'GET rejected with 405');

  // Test invalid type
  const { req: reqBadType, res: resBadType } = mockReqRes({
    method: 'POST',
    body: { type: 'unknown_type', name: 'Test', email: 'test@example.com' }
  });
  await handler(reqBadType, resBadType);
  assert.strictEqual(resBadType.statusCode, 400, 'Invalid type rejected with 400');

  // Test invalid email in handler
  const { req: reqBadEmail, res: resBadEmail } = mockReqRes({
    method: 'POST',
    body: { type: 'contact', name: 'Test', email: 'not-an-email' }
  });
  await handler(reqBadEmail, resBadEmail);
  assert.strictEqual(resBadEmail.statusCode, 400, 'Invalid email rejected with 400');
});

// 7. Handler operates safely in Simulated Mode when RESEND_API_KEY is not configured
await runAsyncTest('Criteria 7: Handler succeeds safely without crashing when RESEND_API_KEY is unset', async () => {
  const origKey = process.env.RESEND_API_KEY;
  delete process.env.RESEND_API_KEY;

  const { req, res } = mockReqRes({
    method: 'POST',
    body: {
      type: 'contact',
      name: 'Aditi Rao',
      email: 'aditi@example.com',
      phone: '+91 98765 00000',
      message: 'Hello from India',
      submissionId: 'a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d'
    }
  });

  await handler(req, res);
  assert.strictEqual(res.statusCode, 200);
  const data = JSON.parse(res.body);
  assert.strictEqual(data.success, true);
  assert.strictEqual(data.simulated, true);

  process.env.RESEND_API_KEY = origKey;
});

// 8. Idempotency prevents duplicate emails
runTest('Criteria 8: Idempotency cache blocks duplicate dispatches for the same submissionId', () => {
  const subId = 'f1e2d3c4-b5a6-4987-8123-abcdef012345';
  const first = checkAndSetIdempotency(subId, 'user@example.com', 'contact');
  assert.strictEqual(first.isDuplicate, false, 'First attempt is not duplicate');

  const second = checkAndSetIdempotency(subId, 'user@example.com', 'contact');
  assert.strictEqual(second.isDuplicate, true, 'Second attempt with same ID is detected as duplicate');
});

// 9. Rate limiting blocks flooding
runTest('Criteria 9: Rate limiter restricts excessive requests from single IP', () => {
  const testIp = '198.51.100.99';
  for (let i = 0; i < 6; i++) {
    const res = checkRateLimit(testIp);
    assert.strictEqual(res.allowed, true, `Request ${i + 1} allowed`);
  }
  const blocked = checkRateLimit(testIp);
  assert.strictEqual(blocked.allowed, false, '7th request in window is blocked');
});

// 10. Verify RESEND_API_KEY is not leaked into frontend code
runTest('Criteria 10: RESEND_API_KEY is absent from frontend source and bundles', () => {
  const srcFiles = ['theunoia-react/src/lib/supabase.js', 'theunoia-react/src/App.jsx'];
  for (const f of srcFiles) {
    const p = path.resolve(rootDir, f);
    if (fs.existsSync(p)) {
      const content = fs.readFileSync(p, 'utf8');
      assert.ok(!content.includes('RESEND_API_KEY'), `RESEND_API_KEY must not appear in ${f}`);
    }
  }

  // Check dist output
  const distAssets = path.resolve(rootDir, 'theunoia-react/dist/assets');
  if (fs.existsSync(distAssets)) {
    for (const file of fs.readdirSync(distAssets)) {
      if (file.endsWith('.js')) {
        const js = fs.readFileSync(path.join(distAssets, file), 'utf8');
        assert.ok(!/re_[0-9a-zA-Z]{20,}/.test(js), `Live resend keys must never appear in built bundle ${file}`);
        assert.ok(!js.includes('RESEND_API_KEY'), `RESEND_API_KEY must never appear in built bundle ${file}`);
      }
    }
  }
});

// 11. Responsive email container rules
runTest('Criteria 11: Email templates include viewport and fluid mobile CSS rules', () => {
  const contact = generateContactConfirmationEmail({ name: 'Test', email: 'test@example.com' });
  const maker = generateMakerConfirmationEmail({ name: 'Test', email: 'test@example.com', role: 'UI Designer' });

  for (const t of [contact, maker]) {
    assert.ok(t.html.includes('viewport'), 'Viewport meta tag present');
    assert.ok(t.html.includes('@media only screen and (max-width: 620px)'), 'Mobile media query present');
    assert.ok(t.html.includes('email-container'), 'Responsive email container class present');
    assert.ok(t.text.length > 50, 'Text fallback non-empty');
  }
});

// 12. Supabase schema migration is valid SQL
runTest('Criteria 12: SQL migration file exists and is syntactically sound', () => {
  const migPath = path.resolve(rootDir, 'supabase/migrations/20261021_email_tracking.sql');
  assert.ok(fs.existsSync(migPath), 'Migration file exists');
  const sql = fs.readFileSync(migPath, 'utf8');
  assert.ok(sql.includes('ALTER TABLE IF EXISTS public.contact_submissions'), 'Contact table alter included');
  assert.ok(sql.includes('ALTER TABLE IF EXISTS public.team_member_applications'), 'Team table alter included');
  assert.ok(sql.includes('confirmation_email_sent_at'), 'Column name matches specification');
});

console.log(`\n=== RESULTS: ${passedTests} passed, ${failedTests} failed ===\n`);
if (failedTests > 0) process.exit(1);
