import { AUTH_CONFIG, ORDER_CONFIG } from '../config.js';
import { idempiereFetch } from '../idempiere/client.js';

// Konvertiere Datum zu ISO-Format (YYYY-MM-DD) für iDempiere
function toDateOnly(date = new Date()) {
  return date.toISOString().split('T')[0];
}

/**
 * Bestellung erstellen und sofort abschließen (3-Schritt-Prozess):
 * 1. POST /models/c_order: Auftragskopf erstellen
 * 2. POST /models/c_orderline: Positionen hinzufügen (je Zeile)
 * 3. PUT /models/c_order/{id}: doc-action=CO ausführen (Complete Order)
 *
 * @param {Object} orderData - Bestelldaten (lines, POReference, etc.)
 * @param {Object} userData - User-Daten aus JWT (businessPartnerId, bpLocationId, contactId)
 */
export async function createAndCompleteOrder(orderData, userData) {
  const today = toDateOnly();

  // Schritt 1: Auftragskopf aus Config + User-Daten zusammensetzen
  const orderHeader = {
    IsSOTrx: ORDER_CONFIG.IsSOTrx,
    IsSelfService: ORDER_CONFIG.IsSelfService,
    AD_Org_ID: { id: ORDER_CONFIG.AD_Org_ID },
    C_DocTypeTarget_ID: { id: ORDER_CONFIG.C_DocTypeTarget_ID },
    DateOrdered: orderData.DateOrdered || today,
    DatePromised: orderData.DatePromised || today,
    DateAcct: orderData.DateOrdered || today,

    // User-spezifische Daten aus JWT
    C_BPartner_ID: { id: userData.businessPartnerId },
    C_BPartner_Location_ID: { id: userData.bpLocationId },
    AD_User_ID: { id: userData.contactId },

    // Billing = gleicher User (Bill_BPartner_ID = C_BPartner_ID)
    Bill_BPartner_ID: { id: userData.businessPartnerId },
    Bill_Location_ID: { id: userData.bpLocationId },
    Bill_User_ID: { id: userData.contactId },

    // Allgemeine Config-Werte
    SalesRep_ID: { id: ORDER_CONFIG.SalesRep_ID },
    C_PaymentTerm_ID: { id: ORDER_CONFIG.C_PaymentTerm_ID },
    M_Warehouse_ID: { id: AUTH_CONFIG.parameters.warehouseId }, // Aus .env
    M_PriceList_ID: { id: ORDER_CONFIG.M_PriceList_ID },
    M_Shipper_ID: { id: ORDER_CONFIG.M_Shipper_ID },
    PaymentRule: { id: ORDER_CONFIG.PaymentRule },
    DeliveryViaRule: { id: ORDER_CONFIG.DeliveryViaRule },
    POReference: orderData.POReference || ORDER_CONFIG.POReference,
  };

  // POST: Auftragskopf in iDempiere anlegen
  const orderRes = await idempiereFetch('/models/c_order', {
    method: 'POST',
    body: JSON.stringify(orderHeader),
  });

  if (!orderRes.ok) {
    const errorText = await orderRes.text().catch(() => '');
    const error = new Error(`Order create failed: ${errorText}`);
    error.status = orderRes.status;
    throw error;
  }

  const createdOrder = await orderRes.json();
  const orderId = createdOrder.id;

  // Schritt 2: Positionen hinzufügen (je Position eine API-Anfrage)
  for (let index = 0; index < orderData.lines.length; index++) {
    const line = orderData.lines[index];
    const linePayload = {
      C_Order_ID: { id: orderId },
      Line: (index + 1) * 10,
      M_Product_ID: { id: line.M_Product_ID },
      C_UOM_ID: { id: line.C_UOM_ID || 100 },
      M_Warehouse_ID: { id: AUTH_CONFIG.parameters.warehouseId },
      QtyOrdered: line.QtyOrdered,
      QtyEntered: line.QtyEntered || line.QtyOrdered,
    };

    const lineRes = await idempiereFetch('/models/c_orderline', {
      method: 'POST',
      body: JSON.stringify(linePayload),
    });

    if (!lineRes.ok) {
      const errorText = await lineRes.text().catch(() => '');
      const error = new Error(`Order line create failed: ${errorText}`);
      error.status = lineRes.status;
      throw error;
    }
  }

  // Schritt 3: Auftrag abschließen (doc-action=CO)
  const completeRes = await idempiereFetch(`/models/c_order/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({ 'doc-action': 'CO' }),
  });

  const completeText = await completeRes.text();
  if (!completeRes.ok) {
    const error = new Error(`Order complete failed: ${completeText}`);
    error.status = completeRes.status;
    throw error;
  }

  // Gebe finalen Auftrag zurück
  return JSON.parse(completeText);
}
