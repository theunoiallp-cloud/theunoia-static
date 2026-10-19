// Central API configuration for THEUNOiA frontend
// In production on unified Vercel deployment, empty string '' means relative to same host (/api/...)
// In local dev, falls back to VITE_API_BASE_URL or 'http://localhost:4000'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL !== undefined
  ? import.meta.env.VITE_API_BASE_URL
  : (import.meta.env.PROD ? '' : 'http://localhost:4000');
