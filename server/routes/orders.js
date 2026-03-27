import { Router } from 'express';
import { createAndCompleteOrder } from '../services/orderService.js';
import { requireAuth } from './auth.js';
import { orderRateLimiter, authorize } from '../middleware/security.js';
import {
  logOrderCreation,
  logOrderCreationFailure,
} from '../services/auditService.js';

const router = Router();

// POST /api/orders/create-and-complete: Bestellung erstellen und sofort abschließen
// Mit Authentication, Authorization und Rate Limiting
router.post(
  '/orders/create-and-complete',
  requireAuth,
  authorize(),
  orderRateLimiter,
  async (req, res) => {
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent') || 'unknown';
    const { userId = null, email = null } = req.user || {};

    try {
      // Validierung: Request muss lines Array enthalten
      const orderData = req.body;
      if (!orderData || !Array.isArray(orderData.lines) || orderData.lines.length === 0) {
        logOrderCreationFailure(userId, email, 'invalid_payload', ip, userAgent);
        return res.status(400).json({ message: 'Order payload requires non-empty lines array' });
      }

      // User-Daten aus JWT für die Order
      const { businessPartnerId, bpLocationId, contactId } = req.user;

      // Bestellung an iDempiere senden mit User-Daten
      const completedOrder = await createAndCompleteOrder(orderData, {
        businessPartnerId,
        bpLocationId,
        contactId
      });

      // Audit Log
      logOrderCreation(
        userId,
        email,
        completedOrder.id,
        completedOrder.GrandTotal || 0,
        ip,
        userAgent
      );

      return res.json(completedOrder);
    } catch (error) {
      // Audit Log für Fehler
      logOrderCreationFailure(userId, email, error.message, ip, userAgent);

      // Fehlerbehandlung: Status-Code von Service oder 500 im Fallback
      const status = error instanceof Error && 'status' in error ? Number(error.status) : 500;
      const message = error instanceof Error ? error.message : 'Unexpected server error';
      return res.status(status).json({ message });
    }
  }
);

export default router;
