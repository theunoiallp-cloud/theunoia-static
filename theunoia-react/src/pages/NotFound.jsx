import { useEffect } from 'react';

export default function NotFound() {
  useEffect(() => {
    document.title = '404: Page Not Found — THEUNOiA';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0E1830',
      color: '#FAF7F0',
      fontFamily: "'Inter Tight', system-ui, -apple-system, sans-serif",
      textAlign: 'center',
      padding: '24px'
    }}>
      <a href="/" style={{ marginBottom: '32px' }} aria-label="THEUNOiA Home">
        <img src="/assets/logo.png" alt="THEUNOiA" width="180" style={{ height: 'auto' }} />
      </a>
      <span style={{
        fontSize: '14px',
        fontWeight: '700',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        color: '#C9A227',
        marginBottom: '12px'
      }}>
        Error 404
      </span>
      <h1 style={{
        fontSize: 'clamp(28px, 5vw, 48px)',
        fontWeight: '800',
        margin: '0 0 16px',
        color: '#FAF7F0',
        letterSpacing: '-0.02em'
      }}>
        Page Not Found
      </h1>
      <p style={{
        fontSize: '17px',
        maxWidth: '480px',
        lineHeight: '1.6',
        color: '#C8CFD9',
        margin: '0 0 32px'
      }}>
        The page you are looking for doesn't exist, has been moved, or is no longer available.
      </p>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="/" style={{
          display: 'inline-block',
          background: '#C9A227',
          color: '#0E1830',
          fontWeight: '700',
          fontSize: '15px',
          padding: '12px 28px',
          borderRadius: '999px',
          textDecoration: 'none',
          transition: 'transform 0.2s ease'
        }}>
          Return to Home
        </a>
        <a href="/contact" style={{
          display: 'inline-block',
          background: 'transparent',
          border: '1px solid rgba(250, 247, 240, 0.3)',
          color: '#FAF7F0',
          fontWeight: '600',
          fontSize: '15px',
          padding: '12px 28px',
          borderRadius: '999px',
          textDecoration: 'none'
        }}>
          Contact Support
        </a>
      </div>
    </div>
  );
}
