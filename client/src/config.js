// Base API URL config
export function getBaseApiUrl() {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    // If in dev mode or running on common dev ports, point to backend on port 5000
    if (import.meta.env.DEV || window.location.port.startsWith('517') || window.location.port === '3000') {
      return `http://${window.location.hostname}:5000`;
    }
    // Production / preview build / same origin
    return window.location.origin;
  }
  return '';
}

export const API_URL = getBaseApiUrl();
