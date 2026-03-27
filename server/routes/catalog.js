import { Router } from 'express';
import { loadCatalog } from '../services/catalogService.js';
import { logCatalogAccess } from '../services/auditService.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

const router = Router();

// GET /api/catalog: Lade alle Produkte mit Preisen, Bildern, Beständen
// Öffentlich zugänglich, aber mit optionalem Audit Logging
router.get('/catalog', async (req, res) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get('user-agent') || 'unknown';

  // Optional: Wenn User eingeloggt ist, logge den Zugriff
  try {
    const token = req.cookies.auth_token;
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      logCatalogAccess(decoded.userId, decoded.email, ip, userAgent);
    }
  } catch (error) {
    // Token ungültig/nicht vorhanden - ignorieren, Katalog ist öffentlich
  }

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
