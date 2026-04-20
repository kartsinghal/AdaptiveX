import express from 'express';
import cors    from 'cors';
import routes  from './routes/index.js';

const app  = express();
const PORT = process.env.PORT || 4000;

// ── Middleware ─────────────────────────────────────────────
app.use(cors({ origin: '*', exposedHeaders: ['x-session-id'] }));
app.use(express.json());

// ── Request logger (dev-friendly) ─────────────────────────
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ─────────────────────────────────────────────────
app.use('/api', routes);

// ── Health check ───────────────────────────────────────────
app.get('/', (_req, res) =>
  res.json({ service: 'AdaptiveX API', status: 'running', version: '1.0.0' })
);

// ── 404 handler ────────────────────────────────────────────
app.use((_req, res) =>
  res.status(404).json({ error: 'Route not found.' })
);

// ── Start ──────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AdaptiveX API running on http://localhost:${PORT}`);
  console.log(`   Endpoints: /api/track | /api/insights | /api/predict | /api/metrics | /api/config\n`);
});

export default app;
