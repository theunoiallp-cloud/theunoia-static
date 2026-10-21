import { isValidEmail, isValidUuid, sanitizeSingleLine } from './utils/escape.js';
import { checkRateLimit, checkAndSetIdempotency } from './utils/rateLimit.js';
import { generateContactConfirmationEmail } from './templates/contactConfirmation.js';
import { generateMakerConfirmationEmail } from './templates/makerConfirmation.js';

/**
 * Serverless API endpoint for sending transactional confirmation emails via Resend.
 * Compatible with Vercel Serverless Functions and local Node.js environments.
 *
 * Environment variables:
 * - RESEND_API_KEY: Resend API authentication token (server-side only)
 * - EMAIL_FROM: Verified sender address (e.g. "THEUNOiA <howdy@theunoia.com>")
 *
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Method not allowed. Use POST.' }));
    return;
  }

  // 1. IP Rate Limiting
  const clientIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    res.statusCode = 429;
    res.setHeader('Retry-After', Math.ceil(rateCheck.resetMs / 1000).toString());
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Too many confirmation requests from this network. Please try again shortly.'
      })
    );
    return;
  }

  // 2. Parse & Validate Payload
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Malformed JSON payload.' }));
      return;
    }
  }

  if (!body || typeof body !== 'object') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Request body is required.' }));
    return;
  }

  const {
    type,
    submissionId,
    name,
    email,
    phone,
    company,
    message,
    role,
    customRole
  } = body;

  if (type !== 'contact' && type !== 'maker') {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: "Invalid submission type. Expected 'contact' or 'maker'."
      })
    );
    return;
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ success: false, error: 'Valid recipient name is required.' }));
    return;
  }

  if (!email || !isValidEmail(email)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'A valid email address is required.'
      })
    );
    return;
  }

  if (submissionId && !isValidUuid(submissionId)) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: false,
        error: 'Invalid submission identifier.'
      })
    );
    return;
  }

  // 3. Idempotency Check (prevents double-sending if client retries)
  if (submissionId) {
    const idempotency = checkAndSetIdempotency(submissionId, email, type);
    if (idempotency.isDuplicate) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          emailSent: true,
          duplicate: true,
          message: 'Confirmation email has already been dispatched for this submission.'
        })
      );
      return;
    }
  }

  // 4. Generate Email Template
  let emailData;
  if (type === 'contact') {
    emailData = generateContactConfirmationEmail({
      name,
      email,
      company,
      phone,
      message,
      submissionId
    });
  } else {
    emailData = generateMakerConfirmationEmail({
      name,
      email,
      phone,
      role,
      customRole,
      submissionId
    });
  }

  // 5. Send via Resend
  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'THEUNOiA <howdy@theunoia.com>';

  // Simulated Mode for local testing or unconfigured environments
  if (!resendApiKey || resendApiKey.trim() === '' || resendApiKey.includes('placeholder')) {
    console.log(
      `[Resend: Simulated Mode] Confirmation email generated for "${sanitizeSingleLine(name)}" <${sanitizeSingleLine(email)}> [Type: ${type}, Ref: ${submissionId || 'N/A'}]`
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        emailSent: false,
        simulated: true,
        message: 'Confirmation registered (simulated mode; RESEND_API_KEY not configured).'
      })
    );
    return;
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [email.trim()],
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      })
    });

    const resendJson = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      // Log sanitized diagnostics server-side without leaking API keys
      console.error(
        `[Resend Delivery Error] Status: ${resendResponse.status}, Code: ${resendJson.name || 'UNKNOWN'}, Message: ${resendJson.message || 'Delivery rejected'}`
      );

      // Return a safe status to the frontend without exposing internals
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          success: true,
          emailSent: false,
          warning: 'Submission saved. Confirmation email delivery was queued or rejected by the provider.'
        })
      );
      return;
    }

    console.log(
      `[Resend Success] Confirmation email dispatched. ID: ${resendJson.id} to <${sanitizeSingleLine(email)}>`
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        emailSent: true,
        id: resendJson.id
      })
    );
  } catch (err) {
    console.error('[Resend Network Error] Failed to connect to Resend API:', err.message);

    // Submission was already stored in Supabase; return safe success with non-blocking warning
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        success: true,
        emailSent: false,
        warning: 'Submission stored successfully, but confirmation email could not be delivered at this time.'
      })
    );
  }
}
