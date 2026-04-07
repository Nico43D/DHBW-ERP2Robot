import { AUTH_CONFIG } from '../config.js';
import { idempiereFetch } from '../idempiere/client.js';

/**
 * Baut das Payload-Objekt für die iDempiere C_BP_BankAccount API.
 * ACH=false → Kreditkarten-Modus (Credit Card, Number, Exp. Month etc.)
 */
function buildPayload(creditCardData, businessPartnerId) {
  const stripped = creditCardData.cardNumber.replace(/\s/g, '');
  const [expMM, expYY] = creditCardData.expiryDate.split('/');

  return {
    AD_Org_ID: { id: AUTH_CONFIG.parameters.organizationId },
    C_BPartner_ID: { id: businessPartnerId },
    IsACH: false,
    A_Name: creditCardData.cardHolder,
    CreditCardType: creditCardData.creditCardType,
    CreditCardNumber: stripped,
    CreditCardExpMM: parseInt(expMM, 10),
    CreditCardExpYY: parseInt(expYY, 10),
    CreditCardVV: creditCardData.cvc,
    IsActive: true,
  };
}

/**
 * Holt den bestehenden C_BP_BankAccount (Kreditkarte) für einen Business Partner.
 *
 * @param {number} businessPartnerId - C_BPartner_ID
 * @returns {Promise<Object|null>} Der BankAccount-Eintrag oder null
 */
export async function getBPBankAccount(businessPartnerId) {
  console.log('[BANKACCOUNT] Looking up C_BP_BankAccount for BP:', businessPartnerId);

  const res = await idempiereFetch(
    `/models/c_bp_bankaccount?$filter=C_BPartner_ID eq ${businessPartnerId} and IsACH eq false&$top=1`,
    { method: 'GET' }
  );

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('[BANKACCOUNT] Lookup failed:', errorText);
    return null;
  }

  const data = await res.json();
  const records = data.records || [];

  if (records.length === 0) {
    console.log('[BANKACCOUNT] No existing bank account found for BP:', businessPartnerId);
    return null;
  }

  const record = records[0];
  console.log('[BANKACCOUNT] Found existing bank account:', record.id);
  return record;
}

/**
 * Erstellt oder aktualisiert einen C_BP_BankAccount-Eintrag in iDempiere.
 *
 * @param {{ cardHolder: string, cardNumber: string, expiryDate: string, cvc: string, creditCardType: string }} creditCardData
 * @param {number} businessPartnerId - C_BPartner_ID aus JWT
 * @returns {Promise<number|null>} ID des Eintrags oder null bei Fehler
 */
export async function createOrUpdateBPBankAccount(creditCardData, businessPartnerId) {
  const payload = buildPayload(creditCardData, businessPartnerId);

  // Prüfe ob bereits ein Eintrag existiert
  const existing = await getBPBankAccount(businessPartnerId);

  if (existing) {
    console.log('[BANKACCOUNT] Updating existing C_BP_BankAccount:', existing.id);

    const res = await idempiereFetch(`/models/c_bp_bankaccount/${existing.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorText = await res.text().catch(() => '');
      console.error('[BANKACCOUNT] Update failed (status %d):', res.status, errorText);
      return null;
    }

    const updated = await res.json();
    console.log('[BANKACCOUNT] Updated C_BP_BankAccount:', updated.id);
    return updated.id;
  }

  console.log('[BANKACCOUNT] Creating new C_BP_BankAccount for BP:', businessPartnerId);
  console.log('[BANKACCOUNT] Payload:', JSON.stringify(payload, null, 2));

  const res = await idempiereFetch('/models/c_bp_bankaccount', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    console.error('[BANKACCOUNT] Create failed (status %d):', res.status, errorText);
    return null;
  }

  const created = await res.json();
  console.log('[BANKACCOUNT] Created C_BP_BankAccount:', created.id);
  return created.id;
}
