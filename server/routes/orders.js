import { Router } from 'express';
import { createAndCompleteOrder } from '../services/orderService.js';

const router = Router();

// POST /api/orders/create-and-complete: Bestellung erstellen und sofort abschließen
router.post('/orders/create-and-complete', async (req, res) => {
  try {
    // Validierung: Request muss lines Array enthalten
    const orderData = req.body;
    if (!orderData || !Array.isArray(orderData.lines) || orderData.lines.length === 0) {
      return res.status(400).json({ message: 'Order payload requires non-empty lines array' });
    }

    // Bestellung an iDempiere senden
    const completedOrder = await createAndCompleteOrder(orderData);
    return res.json(completedOrder);
  } catch (error) {
    // Fehlerbehandlung: Status-Code von Service oder 500 im Fallback
    const status = error instanceof Error && 'status' in error ? Number(error.status) : 500;
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return res.status(status).json({ message });
  }
});

export default router;
