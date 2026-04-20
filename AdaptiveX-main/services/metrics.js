import { getAllSessions } from './store.js';

/**
 * Simulates adaptive performance metrics.
 * Values shift based on total interactions — mimics a system
 * that gets "smarter" the more it's used.
 */
function buildMetrics(mode = 'auto') {
  const sessions   = getAllSessions();
  const totalEvents = sessions.reduce(
    (sum, s) => sum + s.interactions.length, 0
  );

  // simulate improvement as interactions grow (cap at 500)
  const maturity = Math.min(totalEvents / 500, 1); // 0 → 1

  const baseScore = mode === 'performance' ? 78 : mode === 'quality' ? 70 : 75;
  const performanceScore = Math.round(baseScore + maturity * 22); // up to 97

  const baseSaved = 0.4 + maturity * 2.8; // 0.4 MB → 3.2 MB
  const dataSaved = `${baseSaved.toFixed(1)} MB`;

  const baseLoad  = 3.2 - maturity * 1.8; // 3.2 s → 1.4 s
  const loadTime  = `${baseLoad.toFixed(1)}s`;

  return {
    dataSaved,
    loadTime,
    performanceScore,
    totalEvents,
    activeSessions: sessions.length,
    mode,
  };
}

export { buildMetrics };
