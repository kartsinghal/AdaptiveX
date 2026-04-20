/**
 * In-memory store for AdaptiveX
 * Holds per-session interaction data
 */

const sessions = new Map();

const SECTIONS = ['hero', 'analytics', 'media', 'dashboard'];

function getSession(sessionId) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      sessionId,
      createdAt: Date.now(),
      interactions: [],           // last 10 events
      sectionCounts: { hero: 0, analytics: 0, media: 0, dashboard: 0 },
      sectionTime:  { hero: 0, analytics: 0, media: 0, dashboard: 0 },
      lastSection: null,
      lastEventAt: null,
    });
  }
  return sessions.get(sessionId);
}

function recordEvent(sessionId, { eventType, section, timestamp }) {
  const session = getSession(sessionId);

  // accumulate time on previous section
  if (session.lastSection && session.lastEventAt) {
    const delta = Math.min(timestamp - session.lastEventAt, 30_000); // cap 30 s
    if (delta > 0) session.sectionTime[session.lastSection] += delta;
  }

  // bump count
  if (SECTIONS.includes(section)) session.sectionCounts[section]++;

  // keep last 10 interactions
  session.interactions.push({ eventType, section, timestamp });
  if (session.interactions.length > 10) session.interactions.shift();

  session.lastSection = section;
  session.lastEventAt = timestamp;
}

function resetSession(sessionId) {
  sessions.delete(sessionId);
}

function getAllSessions() {
  return [...sessions.values()];
}

export { getSession, recordEvent, resetSession, getAllSessions, SECTIONS };
