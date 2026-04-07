import { Router } from 'express';
import { requireAuth } from './auth.js';
import { getBPBankAccount } from '../services/bankAccountService.js';

const router = Router();

// GET /api/bank-account: Kreditkartendaten des eingeloggten Users abrufen
router.get(
  '/bank-account',
  requireAuth,
  async (req, res) => {
    try {
      const { businessPartnerId } = req.user;
      const bankAccount = await getBPBankAccount(businessPartnerId);

      if (!bankAccount) {
        return res.json({ exists: false });
      }

      // Kartennummer maskieren (nur letzte 4 Ziffern zeigen)
      const cardNumber = bankAccount.CreditCardNumber || '';
      const masked = cardNumber.length > 4
        ? '**** **** **** ' + cardNumber.slice(-4)
        : cardNumber;

      return res.json({
        exists: true,
        cardHolder: bankAccount.A_Name || '',
        cardNumber: masked,
        cardNumberRaw: cardNumber,
        expiryDate: bankAccount.CreditCardExpMM && bankAccount.CreditCardExpYY
          ? `${String(bankAccount.CreditCardExpMM).padStart(2, '0')}/${String(bankAccount.CreditCardExpYY).padStart(2, '0')}`
          : '',
        cvc: bankAccount.CreditCardVV || '',
        creditCardType: bankAccount.CreditCardType || '',
      });
    } catch (error) {
      console.error('[BANKACCOUNT] GET /bank-account error:', error.message);
      return res.status(500).json({ message: 'Fehler beim Laden der Bankdaten' });
    }
  }
);

export default router;
