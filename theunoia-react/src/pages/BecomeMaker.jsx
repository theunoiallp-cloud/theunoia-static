import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';

const ROLE_CATEGORIES = {
  'Engineering': [
    'Frontend Developer',
    'Backend Developer',
    'Full-Stack Developer',
    'Software Engineer',
    'Web Developer',
    'Mobile App Developer',
    'AI Engineer',
    'Machine Learning Engineer',
    'Data Scientist',
    'Data Analyst',
    'Data Engineer',
    'Cloud Engineer',
    'DevOps Engineer',
    'Site Reliability Engineer',
    'Cybersecurity Engineer',
    'QA Engineer / Software Tester',
    'Embedded Systems Engineer',
    'Blockchain Developer'
  ],
  'Design and Product': [
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Product Designer',
    'Product Manager',
    'Project Manager',
    'Business Analyst',
    'Technical Writer',
    'UX Researcher'
  ],
  'Creative and Marketing': [
    'Graphic Designer',
    'Video Editor',
    'Motion Graphics Designer',
    'Content Writer',
    'Content Creator',
    'Digital Marketing Specialist',
    'SEO Specialist',
    'Social Media Manager',
    'Brand Designer'
  ],
  'Business and Operations': [
    'Business Development Executive',
    'Sales Executive',
    'Marketing Manager',
    'Operations Manager',
    'Human Resources',
    'Recruiter',
    'Finance and Accounting',
    'Customer Success',
    'Customer Support',
    'Legal and Compliance'
  ],
  'Leadership and Other': [
    'CTO / Technical Lead',
    'Engineering Manager',
    'Team Lead',
    'Founder / Co-Founder',
    'Consultant',
    'Student / Intern',
    'Other'
  ]
};

const PHONE_PLACEHOLDERS = {
  '+91': '+91 98765 43210',
  '+1': '+1 (555) 000-0000',
  '+44': '+44 7700 900000',
  '+971': '+971 50 123 4567'
};

export default function BecomeMaker() {
  const [formData, setFormData] = useState({
    fullname: '',
    country: '+91',
    phone: '',
    email: '',
    role: '',
    customRole: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.email || !formData.phone || !formData.role) {
      setStatusMessage({
        type: 'error',
        text: 'Please complete all required fields.'
      });
      return;
    }

    if (formData.role === 'Other' && !formData.customRole.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Please specify your custom role.'
      });
      return;
    }

    setLoading(true);
    setStatusMessage({ type: 'info', text: 'Submitting your registration...' });

    try {
      const res = await fetch(`${API_BASE_URL}/api/maker`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setStatusMessage({
          type: 'success',
          text: data.message || 'Registration received! Our team will review your application.'
        });
        setFormData({
          fullname: '',
          country: '+91',
          phone: '',
          email: '',
          role: '',
          customRole: ''
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: data.error || 'Failed to submit registration. Please try again.'
        });
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Unable to connect to the server. Please check your connection or try again later.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#14213D', minHeight: '100vh', color: '#FAF7F0', fontFamily: 'Manrope, sans-serif' }}>
      {/* Navigation Bar */}
      <header className="tn-bar" data-tn style={{ borderBottom: '1px solid rgba(250, 247, 240, 0.1)', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1280px', margin: '0 auto' }}>
        <a href="/" aria-label="THEUNOiA home" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/logo.png" width="160" alt="THEUNOiA" style={{ objectFit: 'contain' }} />
        </a>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/story" style={{ color: '#FAF7F0', textDecoration: 'none', fontSize: '15px' }}>Our Story</a>
          <a href="/team" style={{ color: '#FAF7F0', textDecoration: 'none', fontSize: '15px' }}>Team</a>
          <a href="/contact" style={{ color: '#FAF7F0', textDecoration: 'none', fontSize: '15px' }}>Contact Us</a>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '860px', margin: '40px auto 80px', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <p style={{ textTransform: 'uppercase', color: '#C9A227', letterSpacing: '0.12em', fontWeight: '700', fontSize: '13px', margin: '0 0 10px' }}>
            Join the collective
          </p>
          <h1 style={{ fontSize: '42px', fontWeight: '800', margin: '0 0 14px', letterSpacing: '-0.02em', color: '#FAF7F0' }}>
            Become a Maker
          </h1>
          <p style={{ fontSize: '18px', color: '#CFC4B0', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Tell us what you build and what you love creating. We connect passionate student makers with real-world projects and businesses.
          </p>
        </div>

        {/* Card */}
        <div style={{ background: '#FAF7F0', color: '#14213D', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Full Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="fullname" style={{ fontWeight: '600', fontSize: '15px' }}>Full Name *</label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                required
                value={formData.fullname}
                onChange={handleChange}
                placeholder="e.g. Maya Patel"
                style={{ height: '52px', padding: '0 16px', borderRadius: '8px', border: '1px solid #CFC4B0', fontSize: '16px', color: '#14213D' }}
              />
            </div>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontWeight: '600', fontSize: '15px' }}>Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@student.edu"
                style={{ height: '52px', padding: '0 16px', borderRadius: '8px', border: '1px solid #CFC4B0', fontSize: '16px', color: '#14213D' }}
              />
            </div>

            {/* Phone */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="phone" style={{ fontWeight: '600', fontSize: '15px' }}>Phone Number *</label>
              <div style={{ display: 'flex', border: '1px solid #CFC4B0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  aria-label="Country Code"
                  style={{ border: 'none', padding: '0 12px', background: 'transparent', fontSize: '15px', fontWeight: '600', color: '#14213D', cursor: 'pointer' }}
                >
                  <option value="+91">IN (+91)</option>
                  <option value="+1">US (+1)</option>
                  <option value="+44">UK (+44)</option>
                  <option value="+971">AE (+971)</option>
                </select>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={PHONE_PLACEHOLDERS[formData.country] || '+91 98765 43210'}
                  style={{ flex: 1, border: 'none', height: '52px', padding: '0 16px', fontSize: '16px', color: '#14213D' }}
                />
              </div>
            </div>

            {/* Role Dropdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="role" style={{ fontWeight: '600', fontSize: '15px' }}>Select Your Role *</label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                style={{ height: '52px', padding: '0 16px', borderRadius: '8px', border: '1px solid #CFC4B0', fontSize: '16px', color: '#14213D', background: '#fff', cursor: 'pointer' }}
              >
                <option value="">-- Choose what fits you best --</option>
                {Object.entries(ROLE_CATEGORIES).map(([category, roles]) => (
                  <optgroup key={category} label={category}>
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Custom Role Field if "Other" is selected */}
            {formData.role === 'Other' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="customRole" style={{ fontWeight: '600', fontSize: '15px' }}>Specify Your Role *</label>
                <input
                  id="customRole"
                  name="customRole"
                  type="text"
                  required
                  value={formData.customRole}
                  onChange={handleChange}
                  placeholder="e.g. Robotics Engineer / Game Developer"
                  style={{ height: '52px', padding: '0 16px', borderRadius: '8px', border: '1px solid #C9A227', fontSize: '16px', color: '#14213D' }}
                />
              </div>
            )}

            {/* Status Message */}
            {statusMessage.text && (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '500',
                  background: statusMessage.type === 'success' ? '#E8F5E9' : statusMessage.type === 'error' ? '#FFEBEE' : '#E3F2FD',
                  color: statusMessage.type === 'success' ? '#2E7D32' : statusMessage.type === 'error' ? '#C62828' : '#1565C0',
                  border: `1px solid ${statusMessage.type === 'success' ? '#A5D6A7' : statusMessage.type === 'error' ? '#FFCDD2' : '#90CAF9'}`
                }}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                height: '54px',
                marginTop: '10px',
                borderRadius: '8px',
                border: 'none',
                background: '#B5543A',
                color: '#fff',
                fontSize: '17px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.2s'
              }}
            >
              {loading ? 'Submitting Application...' : 'Register as Maker'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
