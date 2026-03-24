import { Router } from 'express';

const router = Router();

// Health-Check: Backend läuft noch?
router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

export default router;
