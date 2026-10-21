import { escapeHtml, sanitizeSingleLine } from '../utils/escape.js';

/**
 * Generates responsive HTML and plain-text confirmation email templates
 * for Become a Maker (Team Member Application) submissions.
 *
 * @param {Object} params
 * @param {string} params.name
 * @param {string} params.email
 * @param {string} [params.phone]
 * @param {string} params.role
 * @param {string} [params.customRole]
 * @param {string} [params.submissionId]
 * @returns {{ subject: string, html: string, text: string }}
 */
export function generateMakerConfirmationEmail({
  name,
  email,
  phone,
  role,
  customRole,
  submissionId
}) {
  const safeName = sanitizeSingleLine(name, 100) || 'Maker';
  const safeEmail = sanitizeSingleLine(email, 120);
  const safePhone = sanitizeSingleLine(phone, 40);
  const rawRole = role === 'Other' && customRole ? `Other (${customRole})` : (role || 'General Maker');
  const safeRole = sanitizeSingleLine(rawRole, 100);
  const safeSubmissionId = sanitizeSingleLine(submissionId, 40);

  const escapedName = escapeHtml(safeName);
  const escapedEmail = escapeHtml(safeEmail);
  const escapedPhone = escapeHtml(safePhone);
  const escapedRole = escapeHtml(safeRole);
  const shortRef = safeSubmissionId ? safeSubmissionId.slice(0, 8).toUpperCase() : 'APP';

  const subject = "Thank you for your interest in becoming a Maker | THEUNOiA";

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
      color: #691D97;
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
  <!-- Preheader text -->
  <div style="display: none; font-size: 1px; color: #FAF7F0; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    Thank you for applying to become a Maker at THEUNOiA. We have received your registration details.
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF7F0; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 36px 16px 48px;">
        <!-- Email Container Card -->
        <table role="presentation" class="email-container" border="0" cellpadding="0" cellspacing="0" width="600" style="width: 600px; max-width: 600px; background-color: #FFFFFF; border-radius: 14px; overflow: hidden; border: 1px solid #ECE5D6; box-shadow: 0 4px 18px rgba(15, 27, 45, 0.04);">
          
          <!-- Top Accent Bar: Purple to Rose Gradient -->
          <tr>
            <td height="5" style="height: 5px; background: linear-gradient(90deg, #691D97 0%, #ED648B 50%, #C9A55C 100%); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td class="email-header-cell" style="padding: 36px 40px 24px; border-bottom: 1px solid #F1EBE1;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="left" valign="middle">
                    <a href="https://www.theunoia.com" target="_blank" rel="noopener noreferrer" style="text-decoration: none; display: inline-block;">
                      <img src="https://www.theunoia.com/assets/logo.png" width="168" height="34" alt="THEUNOiA — Where young talent builds the future" border="0" style="display: block; width: 168px; height: auto; max-width: 100%;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" style="font-size: 12px; color: #691D97; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
                    Maker App #${shortRef}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td class="email-body-cell" style="padding: 40px 40px 32px;">
              <span style="display: inline-block; padding: 4px 12px; background-color: #F5EFEB; color: #691D97; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; border-radius: 20px; margin-bottom: 16px;">
                Application Received
              </span>

              <h1 class="h1-title" style="margin: 0 0 16px; font-size: 28px; line-height: 1.2; font-weight: 700; color: #170308; letter-spacing: -0.02em;">
                Thank you for your interest in becoming a Maker.
              </h1>
              
              <p style="margin: 0 0 20px; font-size: 16px; line-height: 1.6; color: #334155;">
                Hello <strong>${escapedName}</strong>,
              </p>

              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #475569;">
                We are thrilled by your enthusiasm for <strong>THEUNOiA</strong>. We've safely received your application for the <strong>${escapedRole}</strong> track.
              </p>

              <p style="margin: 0 0 20px; font-size: 15px; line-height: 1.6; color: #475569;">
                At THEUNOiA, we unite driven student makers and rising professionals to build real-world software, design high-impact digital experiences, and power platforms like <strong>Hunhar</strong> and <strong>Hivh</strong> across 16 cities in Bharat.
              </p>

              <!-- Important Disclaimer Banner -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFF8E7; border-left: 4px solid #C9A55C; border-radius: 4px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 14px 18px; font-size: 13px; line-height: 1.5; color: #78350F;">
                    <strong>Next Steps:</strong> Our editorial and engineering teams review incoming maker registrations alongside active project roadmaps and cohort schedules. We will contact you regarding next steps when opportunities matching your profile become available.
                    <br /><span style="font-size: 12px; color: #92400E; display: block; margin-top: 4px;">*Note: This acknowledgement does not constitute formal acceptance or employment.</span>
                  </td>
                </tr>
              </table>

              <!-- Application Summary Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FAF8F5; border: 1px solid #EAE3D5; border-radius: 10px; margin-bottom: 28px;">
                <tr>
                  <td class="summary-cell" style="padding: 24px 24px;">
                    <p style="margin: 0 0 14px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 700; color: #170308;">
                      Your Registered Details
                    </p>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Applicant:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedName}</td>
                      </tr>
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Role Track:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #691D97; font-weight: 600;">${escapedRole}</td>
                      </tr>
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Email:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedEmail}</td>
                      </tr>
                      ${
                        escapedPhone
                          ? `<tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Phone:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">${escapedPhone}</td>
                      </tr>`
                          : ''
                      }
                      <tr>
                        <td width="30%" valign="top" style="padding: 5px 0; font-size: 13px; color: #64748B; font-weight: 600;">Status:</td>
                        <td width="70%" valign="top" style="padding: 5px 0; font-size: 13px; color: #0F1B2D; font-weight: 500;">Pending Review</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Button: Discover Our Story & Products -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 0 32px;">
                <tr>
                  <td align="center" style="border-radius: 8px; background-color: #691D97;">
                    <a href="https://www.theunoia.com/story" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #FFFFFF; text-decoration: none; border-radius: 8px; letter-spacing: 0.02em;">
                      Discover Our Story &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748B;">
                In camaraderie,<br />
                <strong style="color: #170308;">The THEUNOiA Squad</strong><br />
                <span style="font-size: 12px; color: #94A3B8;">Where young talent builds the future.</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 28px 40px; background-color: #FAF8F5; border-top: 1px solid #ECE5D6; text-align: center;">
              <p style="margin: 0 0 12px; font-size: 12px; line-height: 1.6; color: #64748B;">
                <a href="https://www.theunoia.com/become-a-maker" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Become a Maker</a> &bull;
                <a href="https://hunhar.in" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Hunhar</a> &bull;
                <a href="https://www.theunoia.com/hivh" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">Hivh</a> &bull;
                <a href="https://www.theunoia.com" target="_blank" rel="noopener noreferrer" style="color: #64748B; text-decoration: none; margin: 0 10px;">THEUNOiA</a>
              </p>
              <p style="margin: 0 0 8px; font-size: 11px; line-height: 1.5; color: #94A3B8;">
                THEUNOiA LLP &bull; Laxmi Nagar, Chandrapur, Maharashtra 442401, India.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.5; color: #94A3B8;">
                You received this automated notification because you submitted an application on the Become a Maker portal at theunoia.com.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Thank you for your interest in becoming a Maker | THEUNOiA

Hello ${safeName},

Thank you for your interest in becoming a Maker with THEUNOiA. We have safely received your application details for the ${safeRole} track.

At THEUNOiA, we unite driven student makers and rising professionals to build real-world software, design high-impact digital experiences, and power platforms like Hunhar and Hivh across 16 cities in Bharat.

---
APPLICATION SUMMARY (Ref #${shortRef}):
- Applicant: ${safeName}
- Role Track: ${safeRole}
- Email: ${safeEmail}
${safePhone ? `- Phone: ${safePhone}\n` : ''}- Status: Pending Review
---

NEXT STEPS:
Our team reviews incoming applications alongside active project roadmaps and cohort schedules. We will contact you regarding next steps when opportunities matching your profile become available.
(Please note that this acknowledgement does not constitute formal acceptance or employment.)

Learn more about our mission and squad at https://www.theunoia.com/story

In camaraderie,
The THEUNOiA Squad
Where young talent builds the future.

THEUNOiA LLP, Laxmi Nagar, Chandrapur, Maharashtra 442401, India.
This confirmation was sent to ${safeEmail}.`;

  return { subject, html, text };
}
