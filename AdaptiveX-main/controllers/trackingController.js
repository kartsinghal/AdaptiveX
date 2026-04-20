import { recordEvent, resetSession, getSession } from '../services/store.js';

const VALID_EVENTS   = ['click', 'hover', 'scroll', 'focus', 'view'];
const VALID_SECTIONS = ['hero', 'analytics', 'media', 'dashboard'];

function track(req, res) {
  const sessionId = req.headers['x-session-id'] || 'default';
  const { eventType, section, timestamp } = req.body;

  // validation
  if (!eventType || !section) {
    return res.status(400).json({ error: 'eventType and section are required.' });
  }
  if (!VALID_EVENTS.includes(eventType)) {
    return res.status(400).json({ error: `eventType must be one of: ${VALID_EVENTS.join(', ')}` });
  }
  if (!VALID_SECTIONS.includes(section)) {
    return res.status(400).json({ error: `section must be one of: ${VALID_SECTIONS.join(', ')}` });
  }

  const ts = typeof timestamp === 'number' ? timestamp : Date.now();
  recordEvent(sessionId, { eventType, section, timestamp: ts });

  res.json({ ok: true, sessionId, recorded: { eventType, section, timestamp: ts } });
}

function reset(req, res) {
  const sessionId = req.headers['x-session-id'] || 'default';
  resetSession(sessionId);
  res.json({ ok: true, message: `Session "${sessionId}" has been reset.` });
}

function sessionInfo(req, res) {
  const sessionId = req.headers['x-session-id'] || 'default';
  const session   = getSession(sessionId);
  res.json({
    sessionId: session.sessionId,
    createdAt: session.createdAt,
    recentInteractions: session.interactions,
  });
}

export { track, reset, sessionInfo };
