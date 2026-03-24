import { Router } from 'express';
import { loadCatalog } from '../services/catalogService.js';

const router = Router();

// GET /api/catalog: Lade alle Produkte mit Preisen, Bildern, Beständen
router.get('/catalog', async (_req, res) => {
  try {
    const result = await loadCatalog();
    return res.json(result);
  } catch (error) {
    // Fehlerbehandlung: Status-Code von Service oder 500 im Fallback
    const status = error instanceof Error && 'status' in error ? Number(error.status) : 500;
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return res.status(status).json({ message });
  }
});

export default router;
