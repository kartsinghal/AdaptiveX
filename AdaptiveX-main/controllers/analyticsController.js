import { getSession } from '../services/store.js';
import { buildInsights, predictNext } from '../services/analytics.js';

function insights(req, res) {
  const sessionId = req.headers['x-session-id'] || 'default';
  const session   = getSession(sessionId);
  res.json(buildInsights(session));
}

function predict(req, res) {
  const sessionId = req.headers['x-session-id'] || 'default';
  const session   = getSession(sessionId);
  res.json(predictNext(session));
}

export { insights, predict };
