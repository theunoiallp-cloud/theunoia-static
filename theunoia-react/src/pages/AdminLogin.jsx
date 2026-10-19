import React, { useState } from 'react';
import { API_BASE_URL } from '../config/api.js';

export default function AdminLogin({ onLoginSuccess }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        if (onLoginSuccess) onLoginSuccess();
        else window.location.reload();
      } else {
        setError(data.error || 'Authentication failed. Please verify your password.');
      }
    } catch {
      setError('Unable to reach server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0E1830', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Manrope, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '440px', background: '#FAF7F0', borderRadius: '16px', padding: '48px 40px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/assets/logo.png" width="180" alt="THEUNOiA" style={{ marginBottom: '16px' }} />
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#14213D', margin: 0 }}>Admin Login</h1>
          <p style={{ color: '#6B6559', fontSize: '14px', marginTop: '6px' }}>Secure workspace for THEUNOiA operations</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="admin-password" style={{ fontSize: '14px', fontWeight: '700', color: '#14213D' }}>
              Master Password
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{ width: '100%', height: '50px', padding: '0 50px 0 16px', borderRadius: '8px', border: '1px solid #CFC4B0', fontSize: '15px', color: '#14213D' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', color: '#6B6559', fontSize: '13px', fontWeight: '600', cursor: 'pointer', padding: '4px 8px' }}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#FFEBEE', color: '#C62828', fontSize: '13.5px', fontWeight: '500', border: '1px solid #FFCDD2' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              height: '50px',
              borderRadius: '8px',
              border: 'none',
              background: '#14213D',
              color: '#FAF7F0',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              marginTop: '8px'
            }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
