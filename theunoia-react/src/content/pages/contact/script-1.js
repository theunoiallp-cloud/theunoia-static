// Update phone placeholder when the country code changes
const placeholders = {
  '+91': '+91 98765 43210',
  '+1': '+1 (555) 000-0000',
  '+44': '+44 7700 900000',
  '+971': '+971 50 123 4567'
};

const country = document.getElementById('country');
const phone = document.getElementById('phone');
if (country && phone) {
  country.addEventListener('change', () => {
    phone.placeholder = placeholders[country.value] || '';
  });
}

// Contact form submission directly to Supabase
const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');
const submitBtn = form ? form.querySelector('button[type="submit"]') : null;

if (form && status) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!form.checkValidity()) {
      const firstInvalid = form.querySelector(':invalid');
      status.textContent = 'Please fill in your name, a valid email, phone number, and your message.';
      status.style.color = '#B5543A';
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const fd = new FormData(form);
    const rawPhone = (fd.get('phone') || '').trim();
    const selCountry = fd.get('country') || '+91';
    let combinedPhone = rawPhone;
    if (rawPhone && !rawPhone.startsWith('+')) {
      combinedPhone = `${selCountry} ${rawPhone}`;
    }

    const payload = {
      fullname: fd.get('fullname'),
      company: fd.get('company'),
      email: fd.get('email'),
      phone: combinedPhone,
      address: fd.get('address'),
      message: fd.get('message')
    };

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    status.textContent = 'Sending your message...';
    status.style.color = '#14213D';

    try {
      if (typeof window.__THEUNOiA_SUBMIT_CONTACT__ !== 'function') {
        throw new Error('Supabase submission handler is not initialized. Please refresh the page.');
      }

      const res = await window.__THEUNOiA_SUBMIT_CONTACT__(payload);

      if (res && res.success) {
        status.textContent = res.message || 'Thank you! Your message has been sent successfully.';
        status.style.color = '#2E7D32';
        form.reset();
      } else {
        status.textContent = (res && res.error) || 'Failed to submit message. Please try again.';
        status.style.color = '#B5543A';
      }
    } catch (err) {
      status.textContent = err.message || 'Unable to connect to database. Please check your connection or try again later.';
      status.style.color = '#B5543A';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}
