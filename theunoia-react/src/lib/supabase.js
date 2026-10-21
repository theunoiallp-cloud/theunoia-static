import { createClient } from '@supabase/supabase-js';

const env = (typeof import.meta !== 'undefined' && import.meta.env) || (typeof process !== 'undefined' && process.env) || {};
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy client for build-time SSR or unconfigured dev environments
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => ({
          eq: () => ({
            or: () => ({
              order: () => ({
                range: async () => ({ data: [], count: 0, error: null }),
                limit: async () => ({ data: [], count: 0, error: null })
              }),
              single: async () => ({ data: null, error: new Error('Unconfigured') })
            }),
            single: async () => ({ data: null, error: new Error('Unconfigured') })
          }),
          order: () => ({
            range: async () => ({ data: [], count: 0, error: null })
          }),
          single: async () => ({ data: null, error: new Error('Unconfigured') })
        }),
        insert: async () => ({
          data: null,
          error: new Error('Supabase credentials are not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
        }),
        update: () => ({
          eq: () => ({
            select: () => ({
              single: async () => ({ data: null, error: new Error('Unconfigured') })
            })
          })
        }),
        delete: () => ({
          eq: async () => ({ error: new Error('Unconfigured') })
        })
      }),
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        signInWithPassword: async () => ({ data: {}, error: new Error('Supabase not configured.') }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: new Error('Storage not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } })
        })
      }
    };

/**
 * Generates a standard UUID v4 string.
 * @returns {string}
 */
function generateUuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Dispatches a request to the protected serverless confirmation endpoint.
 * Non-blocking: failures do not revert or misreport already-saved database rows.
 *
 * @param {Object} payload
 * @returns {Promise<{ success: boolean, emailSent?: boolean, error?: string }>}
 */
async function dispatchConfirmationEmail(payload) {
  try {
    const response = await fetch('/api/send-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.warn(`[Confirmation API] Server returned status ${response.status}`);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.warn('[Confirmation API Network Warning]', err.message);
    return { success: false, error: err.message };
  }
}

/**
 * Validates and submits a contact form message to Supabase, then triggers
 * an automated confirmation email.
 *
 * @param {Object} payload
 * @param {string} payload.fullname
 * @param {string} [payload.company]
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} [payload.address]
 * @param {string} payload.message
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function submitContactForm({ fullname, company, email, phone, address, message }) {
  const cleanName = (fullname || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanMessage = (message || '').trim();
  const cleanCompany = (company || '').trim() || null;
  const cleanAddress = (address || '').trim() || null;

  if (!cleanName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!cleanPhone || cleanPhone.length < 5) {
    return { success: false, error: 'A valid phone number is required.' };
  }
  if (!cleanMessage) {
    return { success: false, error: 'Message cannot be empty.' };
  }

  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.'
    };
  }

  const submissionId = generateUuid();

  const { error } = await supabase
    .from('contact_submissions')
    .insert([
      {
        id: submissionId,
        full_name: cleanName,
        company: cleanCompany,
        email: cleanEmail,
        phone: cleanPhone,
        address: cleanAddress,
        message: cleanMessage,
        status: 'new'
      }
    ]);

  if (error) {
    console.error('Supabase contact submission error:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit contact enquiry. Please try again.'
    };
  }

  // Trigger automated confirmation email in the background
  dispatchConfirmationEmail({
    type: 'contact',
    submissionId,
    name: cleanName,
    email: cleanEmail,
    company: cleanCompany,
    phone: cleanPhone,
    message: cleanMessage
  });

  return {
    success: true,
    message: 'Thank you! Your message has been sent successfully.'
  };
}

/**
 * Validates and submits a team member / maker application to Supabase, then triggers
 * an automated confirmation email.
 *
 * @param {Object} payload
 * @param {string} payload.fullname
 * @param {string} payload.email
 * @param {string} payload.phone
 * @param {string} payload.role
 * @param {string} [payload.customRole]
 * @returns {Promise<{ success: boolean, message?: string, error?: string }>}
 */
export async function submitTeamApplication({ fullname, email, phone, role, customRole }) {
  const cleanName = (fullname || '').trim();
  const cleanEmail = (email || '').trim();
  const cleanPhone = (phone || '').trim();
  const cleanRole = (role || '').trim();
  const cleanCustomRole = (customRole || '').trim() || null;

  if (!cleanName) {
    return { success: false, error: 'Full name is required.' };
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'A valid email address is required.' };
  }
  if (!cleanPhone || cleanPhone.length < 5) {
    return { success: false, error: 'A valid phone number is required.' };
  }
  if (!cleanRole) {
    return { success: false, error: 'Role selection is required.' };
  }
  if (cleanRole === 'Other' && !cleanCustomRole) {
    return { success: false, error: 'Please specify your custom role.' };
  }

  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment.'
    };
  }

  const submissionId = generateUuid();

  const { error } = await supabase
    .from('team_member_applications')
    .insert([
      {
        id: submissionId,
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: cleanRole,
        custom_role: cleanRole === 'Other' ? cleanCustomRole : null,
        status: 'pending_review'
      }
    ]);

  if (error) {
    console.error('Supabase team application error:', error);
    return {
      success: false,
      error: error.message || 'Failed to submit application. Please try again.'
    };
  }

  // Trigger automated confirmation email in the background
  dispatchConfirmationEmail({
    type: 'maker',
    submissionId,
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone,
    role: cleanRole,
    customRole: cleanCustomRole
  });

  return {
    success: true,
    message: 'Registration received! Our team will review your application.'
  };
}
