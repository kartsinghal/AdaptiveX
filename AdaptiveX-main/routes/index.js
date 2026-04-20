import { Router } from 'express';
import { track, reset, sessionInfo }  from '../controllers/trackingController.js';
import { insights, predict }          from '../controllers/analyticsController.js';
import { metrics, config }            from '../controllers/systemController.js';

const router = Router();

// ── Tracking ──────────────────────────────────────────────
router.post('/track',   track);        // log an interaction
router.post('/reset',   reset);        // clear session data
router.get('/session',  sessionInfo);  // inspect raw session

// ── Intelligence ──────────────────────────────────────────
router.get('/insights', insights);     // behaviour analysis
router.get('/predict',  predict);      // next section prediction

// ── System ────────────────────────────────────────────────
router.get('/metrics',  metrics);      // simulated perf metrics
router.get('/config',   config);       // frontend configuration

export default router;
