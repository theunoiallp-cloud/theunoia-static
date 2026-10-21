import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Regular expressions and validation
function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  const trimmed = email.trim();
  if (trimmed.length > 254 || trimmed.length < 5) return false;
  if (/[\r\n\t]/.test(trimmed)) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(trimmed);
}

function escapeHtml(val: unknown): string {
  if (val === null || val === undefined) return '';
  return String(val)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function sanitizeSingleLine(val: unknown, maxLength = 150): string {
  if (typeof val !== 'string') return '';
  return val.replace(/[\r\n\t\x00-\x1F\x7F]/g, ' ').trim().slice(0, maxLength);
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await req.json();
    const { type, name, email, phone, company, message, role, customRole, submissionId } = body;

    if (type !== 'contact' && type !== 'maker') {
      return new Response(JSON.stringify({ error: "Invalid type. Expected 'contact' or 'maker'" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return new Response(JSON.stringify({ error: 'Name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ error: 'Valid email is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const safeName = sanitizeSingleLine(name, 100);
    const safeEmail = sanitizeSingleLine(email, 120);
    const safePhone = sanitizeSingleLine(phone, 40);
    const shortRef = submissionId ? String(submissionId).slice(0, 8).toUpperCase() : 'RCVD';

    let subject = '';
    let html = '';
    let text = '';

    if (type === 'contact') {
      subject = "We've received your message | THEUNOiA";
      const escapedCompany = escapeHtml(sanitizeSingleLine(company, 100));
      const escapedMessage = escapeHtml((message || '').trim().slice(0, 1500));

      html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAF7F0;font-family:sans-serif;color:#1E293B;">
<table style="max-width:600px;width:100%;margin:0 auto;background:#FFFFFF;border-radius:12px;border:1px solid #ECE5D6;overflow:hidden;">
  <tr><td style="height:5px;background:linear-gradient(90deg, #170308, #691D97, #ED648B);"></td></tr>
  <tr><td style="padding:28px 36px 16px;border-bottom:1px solid #F1EBE1;">
    <img src="https://www.theunoia.com/assets/logo.png" width="160" alt="THEUNOiA" style="display:block;max-width:160px;height:auto;" />
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <h1 style="margin:0 0 16px;font-size:24px;color:#170308;">We've received your message.</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Hello <strong>${escapeHtml(safeName)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">Thank you for contacting THEUNOiA. We have received your message safely and our team will review your enquiry shortly.</p>
    <div style="background:#FAF8F5;border:1px solid #EAE3D5;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#691D97;text-transform:uppercase;">Submission Details (Ref #${shortRef})</p>
      <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      ${escapedCompany ? `<p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Company:</strong> ${escapedCompany}</p>` : ''}
      ${safePhone ? `<p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>` : ''}
      ${escapedMessage ? `<p style="margin:8px 0 0;font-size:13px;color:#475569;white-space:pre-wrap;">${escapedMessage}</p>` : ''}
    </div>
    <p style="margin:0;font-size:14px;color:#64748B;">Warm regards,<br><strong style="color:#170308;">The THEUNOiA Team</strong></p>
  </td></tr>
  <tr><td style="padding:20px;background:#FAF8F5;border-top:1px solid #ECE5D6;text-align:center;font-size:11px;color:#94A3B8;">
    THEUNOiA LLP &bull; Chandrapur, Maharashtra 442401, India.
  </td></tr>
</table></body></html>`;

      text = `We've received your message | THEUNOiA\n\nHello ${safeName},\n\nThank you for reaching out to THEUNOiA. We have successfully received your enquiry.\n\nReference: #${shortRef}\nEmail: ${safeEmail}\n\nWarm regards,\nThe THEUNOiA Team\nhttps://www.theunoia.com`;
    } else {
      subject = 'Thank you for your interest in becoming a Maker | THEUNOiA';
      const rawRole = role === 'Other' && customRole ? `Other (${customRole})` : (role || 'General Maker');
      const safeRole = sanitizeSingleLine(rawRole, 100);

      html = `<!DOCTYPE html><html><body style="margin:0;padding:24px;background:#FAF7F0;font-family:sans-serif;color:#1E293B;">
<table style="max-width:600px;width:100%;margin:0 auto;background:#FFFFFF;border-radius:12px;border:1px solid #ECE5D6;overflow:hidden;">
  <tr><td style="height:5px;background:linear-gradient(90deg, #691D97, #ED648B, #C9A55C);"></td></tr>
  <tr><td style="padding:28px 36px 16px;border-bottom:1px solid #F1EBE1;">
    <img src="https://www.theunoia.com/assets/logo.png" width="160" alt="THEUNOiA" style="display:block;max-width:160px;height:auto;" />
  </td></tr>
  <tr><td style="padding:32px 36px;">
    <h1 style="margin:0 0 16px;font-size:24px;color:#170308;">Thank you for your interest in becoming a Maker.</h1>
    <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#334155;">Hello <strong>${escapeHtml(safeName)}</strong>,</p>
    <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:#475569;">We have safely received your application details for the <strong>${escapeHtml(safeRole)}</strong> track. Our team will review your application and contact you regarding next steps when opportunities aligning with your skills open up.</p>
    <p style="margin:0 0 20px;font-size:12px;color:#92400E;background:#FFF8E7;padding:12px;border-radius:6px;">*Note: This acknowledgement does not constitute formal acceptance or employment.</p>
    <div style="background:#FAF8F5;border:1px solid #EAE3D5;border-radius:8px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#170308;text-transform:uppercase;">Application Summary (Ref #${shortRef})</p>
      <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Applicant:</strong> ${escapeHtml(safeName)}</p>
      <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Role:</strong> ${escapeHtml(safeRole)}</p>
      <p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      ${safePhone ? `<p style="margin:4px 0;font-size:13px;color:#334155;"><strong>Phone:</strong> ${escapeHtml(safePhone)}</p>` : ''}
    </div>
    <p style="margin:0;font-size:14px;color:#64748B;">In camaraderie,<br><strong style="color:#170308;">The THEUNOiA Squad</strong></p>
  </td></tr>
  <tr><td style="padding:20px;background:#FAF8F5;border-top:1px solid #ECE5D6;text-align:center;font-size:11px;color:#94A3B8;">
    THEUNOiA LLP &bull; Chandrapur, Maharashtra 442401, India.
  </td></tr>
</table></body></html>`;

      text = `Thank you for your interest in becoming a Maker | THEUNOiA\n\nHello ${safeName},\n\nWe have safely received your application details for the ${safeRole} track. Our team will review your application and contact you regarding next steps.\n\nReference: #${shortRef}\nEmail: ${safeEmail}\n\nIn camaraderie,\nThe THEUNOiA Squad\nhttps://www.theunoia.com`;
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const emailFrom = Deno.env.get('EMAIL_FROM') || 'THEUNOiA <noreply@theunoia.com>';

    if (!resendApiKey) {
      console.log(`[Edge Function: Simulated Mode] Confirmation for ${safeEmail}`);
      return new Response(JSON.stringify({ success: true, emailSent: false, simulated: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [safeEmail],
        subject,
        html,
        text
      })
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('[Resend Error]', resendData);
      return new Response(JSON.stringify({ success: true, emailSent: false, warning: 'Provider rejected' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, emailSent: true, id: resendData.id }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Edge Function Error]', message);
    return new Response(JSON.stringify({ success: false, error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
