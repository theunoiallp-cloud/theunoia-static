import { escapeHtml, sanitizeSingleLine } from '../utils/escape.js';

/**
 * Generates responsive HTML and plain-text confirmation email templates
 * for Contact Us submissions.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} [params.company]
 * @param {string} [params.phone]
 * @param {string} [params.message]
 * @param {string} [params.submissionId]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function generateContactConfirmationEmail({
  name,
  email,
  company,
  phone,
  message,
  submissionId
}) {
  const safeName = sanitizeSingleLine(name, 100) || 'there';
  const safeEmail = sanitizeSingleLine(email, 120);
  const safeCompany = sanitizeSingleLine(company, 100);
  const safePhone = sanitizeSingleLine(phone, 40);
  const safeSubmissionId = sanitizeSingleLine(submissionId, 40);

  const escapedName = escapeHtml(safeName);
  const escapedEmail = escapeHtml(safeEmail);
  const escapedCompany = escapeHtml(safeCompany);
  const escapedPhone = escapeHtml(safePhone);
  const escapedMessage = escapeHtml((message || '').trim().slice(0, 1500));
  const shortRef = safeSubmissionId ? safeSubmissionId.slice(0, 8).toUpperCase() : 'RCVD';

  const subject = "We've received your message | THEUNOiA";

  const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="format-detection" content="telephone=no" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, p, h1, h2, h3, h4, table, td {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    body {
      background-color: #FAF7F0;
      color: #1E293B;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: bicubic;
    }
    a {
      color: #C2653F;
      text-decoration: underline;
    }
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .email-body-cell {
        padding: 32px 20px !important;
      }
      .email-header-cell {
        padding: 28px 20px 20px !important;
      }
      .summary-cell {
        padding: 18px 16px !important;
      }
      .h1-title {
        font-size: 24px !important;
        line-height: 1.25 !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #FAF7F0; width: 100% !important;">
  <!-- Preheader preview text (hidden in display, visible in inbox preview) -->
  <div style="display: none; font-size: 1px; color: #FAF7F0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Thank you for contacting THEUNOiA. We have successfully received your enquiry.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF7F0; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 36px 16px 48px;">
        <!-- Email Container Card -->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #ECE5D6; box-shadow: 0 4px 18px rgba(15, 27, 45, 0.04);">
          
          <!-- Top Accent Bar (Brand Colors: Noir / Terracotta / Purple Gradient) -->
          <tr>
            <td height="5" style="height: 5px; background: linear-gradient(90deg, #170308 0%, #691D97 45%, #ED648B 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="email-header-cell" style="padding: 36px 40px 24px; border-bottom: 1px solid #F1EBE1;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <a href="https://www.theunoia.com" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                      <img src="https://www.theunoia.com/assets/logo.png" width="168" height="34" alt="THEUNOiA — Beautiful thinking, built into every product" border="0" style="display: block; width: 168px; height: auto; max-width: 100%;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" style="font-size: 12px; color: #94A3B8; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase;">
                    Enquiry Ref #${shortRef}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="email-body-cell" style="padding: 40px 40px 32px;">
              <h1 class="h1-title" style="margin: 0 0 16px; font-size: 28px; line-height: 1.2; font-weight: 700; color: #170308; letter-spacing: -0.02em;">
                We've received your message.
              </h1>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Hello <strong>${escapedName}</strong>,
              </p>

              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #475569;">
                Thank you for reaching out to <strong>THEUNOiA</strong>. We are writing to confirm that your message has been received safely by our team.
              </p>

              <p style="margin: 0 0 28px; font-size: 15px; line-height: 1.6; color: #475569;">
                We review every enquiry carefully to ensure it reaches the right specialist across engineering, design, or partnerships. A member of our team will follow up with you directly if your enquiry requires next steps or additional consultation.
              </p>

              <!-- Submission Summary Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border: 1px solid #EAE3D5; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td class="summary-cell" style="padding: 24px 24px;">
                    <p style="margin: 0 0 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #691D97;">
                      Submission Summary
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Full Name:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedName}</td>
                      </tr>
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Email:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedEmail}</td>
                      </tr>
                      ${
                        escapedCompany
                          ? `<tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Company:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedCompany}</td>
                      </tr>`
                          : ''
                      }
                      ${
                        escapedPhone
                          ? `<tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Phone:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedPhone}</td>
                      </tr>`
                          : ''
                      }
                      ${
                        escapedMessage
                          ? `<tr>
                        <td width="30%" valign="top" style="padding: 8px 0 0; font-size: 13px; color: #64748B; font-weight: 600;">Message:</td>
                        <td width="70%" valign="top" style="padding: 8px 0 0; font-size: 13px; color: #334155; line-height: 1.5; white-space: pre-wrap;">${escapedMessage}</td>
                      </tr>`
                          : ''
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #170308;">
                    <a href="https://www.theunoia.com" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; letter-spacing: 0.02em;">
                      Explore THEUNOiA &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748B;">
                Warm regards,<br />
                <strong style="color: #170308;">The THEUNOiA Team</strong><br />
                <span style="font-size: 12px; color: #94A3B8;">Beautiful thinking, built into every product.</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 40px; background-color: #FAF8F5; border-top: 1px solid #ECE5D6; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 12px; line-height: 1.6; color: #64748B;">
                <a href="https://www.theunoia.com/story" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Our Story</a> &bull;
                <a href="https://www.theunoia.com/hunhar" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Hunhar</a> &bull;
                <a href="https://www.theunoia.com/hivh" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Hivh</a> &bull;
                <a href="https://www.theunoia.com/blog" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Blog</a>
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; line-height: 1.5; color: #94A3B8;">
                THEUNOiA LLP &bull; Laxmi Nagar, Chandrapur, Maharashtra 442401, India.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #94A3B8;">
                This automated confirmation was sent to ${escapedEmail} regarding your submission on theunoia.com.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `We've received your message | THEUNOiA

Hello ${safeName},

Thank you for reaching out to THEUNOiA. We have successfully received your enquiry.

Our team reviews every message carefully to ensure it reaches the right specialist across engineering, design, or partnerships. A member of our team will follow up with you directly if your enquiry requires next steps or additional consultation.

---
SUBMISSION SUMMARY (Ref #${shortRef}):
- Name: ${safeName}
- Email: ${safeEmail}
${safeCompany ? `- Company: ${safeCompany}\n` : ''}${safePhone ? `- Phone: ${safePhone}\n` : ''}${
    message ? `- Message: ${message.trim()}\n` : ''
}---

Explore more about what we build at https://www.theunoia.com

Warm regards,
The THEUNOiA Team
Beautiful thinking, built into every product.

THEUNOiA LLP, Laxmi Nagar, Chandrapur, Maharashtra 442401, India.
This confirmation was sent to ${safeEmail}.`;

  return { subject, html, text };
}
