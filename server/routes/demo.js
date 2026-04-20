import { Router } from 'express';
import { createAndCompleteOrder } from '../services/orderService.js';
import { ORDER_CONFIG } from '../config.js';

const router = Router();

// POST /api/demo/orders/create-and-complete: Demo-Bestellung ohne Authentifizierung
// Verwendet Standard-BPartner aus ORDER_CONFIG (Fallback: 1000015)
router.post(
  '/demo/orders/create-and-complete',
  async (req, res) => {
    try {
      const orderData = req.body;
      if (!orderData || !Array.isArray(orderData.lines) || orderData.lines.length === 0) {
        return res.status(400).json({ message: 'Order payload requires non-empty lines array' });
      }

      const demoBusinessPartnerId = ORDER_CONFIG.C_BPartner_ID || 1000015;

      const completedOrder = await createAndCompleteOrder(orderData, {
        businessPartnerId: demoBusinessPartnerId,
        bpLocationId: ORDER_CONFIG.Bill_Location_ID,
        contactId: ORDER_CONFIG.Bill_User_ID,
      });

      return res.json(completedOrder);
    } catch (error) {
      const status = error instanceof Error && 'status' in error ? Number(error.status) : 500;
      const message = error instanceof Error ? error.message : 'Unexpected server error';
      return res.status(status).json({ message });
    }
  }
);

export default router;
