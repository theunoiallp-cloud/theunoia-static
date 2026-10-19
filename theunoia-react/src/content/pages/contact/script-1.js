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

// Contact form submission directly to the backend
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
    const payload = {
      fullname: fd.get('fullname'),
      company: fd.get('company'),
      email: fd.get('email'),
      country: fd.get('country'),
      phone: fd.get('phone'),
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
      const apiBase = window.__THEUNOiA_API_BASE_URL__ || 'http://localhost:4000';
      const res = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        status.textContent = data.message || 'Thank you! Your message has been saved successfully.';
        status.style.color = '#2E7D32';
        form.reset();
      } else {
        status.textContent = data.error || 'Failed to submit message. Please try again.';
        status.style.color = '#B5543A';
      }
    } catch (err) {
      status.textContent = 'Unable to connect to the server. Please check your internet connection or try again later.';
      status.style.color = '#B5543A';
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    }
  });
}
