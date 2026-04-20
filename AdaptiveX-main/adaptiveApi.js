/**
 * AdaptiveX API Client
 * Drop into your React project: import api from './adaptiveApi'
 *
 * Session ID is auto-generated per browser tab and stored in sessionStorage.
 */

const BASE_URL  = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const SESSION_KEY = 'adaptivex-session-id';

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `sx-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const headers = () => ({
  'Content-Type': 'application/json',
  'x-session-id': getSessionId(),
});

const api = {
  /** Track a user interaction */
  track(eventType, section) {
    return fetch(`${BASE_URL}/track`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ eventType, section, timestamp: Date.now() }),
    }).then((r) => r.json());
  },

  /** Get behaviour insights for this session */
  insights() {
    return fetch(`${BASE_URL}/insights`, { headers: headers() }).then((r) => r.json());
  },

  /** Get predicted next section */
  predict() {
    return fetch(`${BASE_URL}/predict`, { headers: headers() }).then((r) => r.json());
  },

  /** Get simulated performance metrics */
  metrics(mode = 'auto') {
    return fetch(`${BASE_URL}/metrics?mode=${mode}`, { headers: headers() }).then((r) => r.json());
  },

  /** Get system configuration */
  config() {
    return fetch(`${BASE_URL}/config`, { headers: headers() }).then((r) => r.json());
  },

  /** Reset this session's data */
  reset() {
    return fetch(`${BASE_URL}/reset`, { method: 'POST', headers: headers() }).then((r) => r.json());
  },
};

export default api;

// ── React hook (optional convenience) ─────────────────────
// Usage:  const { track } = useAdaptiveX();
import { useCallback } from 'react';

export function useAdaptiveX() {
  const track = useCallback((eventType, section) => {
    api.track(eventType, section).catch(console.error);
  }, []);

  return { track, api };
}
