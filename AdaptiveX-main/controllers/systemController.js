import { buildMetrics } from '../services/metrics.js';

function metrics(req, res) {
  const mode = req.query.mode || 'auto'; // ?mode=performance|quality|auto
  res.json(buildMetrics(mode));
}

function config(req, res) {
  res.json({
    defaultMode: 'auto',
    networkThresholds: {
      slow:   '2g',
      medium: '3g',
      fast:   '4g',
    },
    adaptiveFeatures: {
      imageCompression: true,
      lazyLoading: true,
      prefetching: true,
      fontSubsetting: true,
    },
    supportedSections: ['hero', 'analytics', 'media', 'dashboard'],
    version: '1.0.0',
  });
}

export { metrics, config };
