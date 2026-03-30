import 'dotenv/config';

// Port auf dem der Backend läuft
export const PORT = Number(process.env.PORT || 3001);

// iDempiere REST API Basis-URL
export const IDEMPIERE_BASE_URL =
  process.env.IDEMPIERE_BASE_URL || 'http://localhost:8080/api/v1';

// Authentifizierung: User, Passwort und Kontextparameter (Client, Rolle, Org, Warehouse, Sprache)
export const AUTH_CONFIG = {
  userName: process.env.IDEMPIERE_USER || '',
  password: process.env.IDEMPIERE_PASSWORD || '',
  parameters: {
    clientId: Number(process.env.IDEMPIERE_CLIENT_ID || 11),
    roleId: Number(process.env.IDEMPIERE_ROLE_ID || 102),
    organizationId: Number(process.env.IDEMPIERE_ORG_ID || 11),
    warehouseId: Number(process.env.IDEMPIERE_WAREHOUSE_ID || 1000000),
    language: process.env.IDEMPIERE_LANGUAGE || 'en_US',
  },
};

// Katalog-Filter: Produktkategorie und Preisliste für Produktladen
export const CATALOG_CONFIG = {
  productCategoryId: Number(process.env.IDEMPIERE_PRODUCT_CATEGORY_ID || 1000000),
  priceListVersionId: Number(process.env.IDEMPIERE_PRICE_LIST_VERSION_ID || 104),
};

// Bestellungsstandardwerte: Partner, Zahlung, Versand, Lagerort usw.
export const ORDER_CONFIG = {
  C_BPartner_ID: Number(process.env.IDEMPIERE_ORDER_BPARTNER_ID || 1000015),
  C_BPartner_Location_ID: Number(process.env.IDEMPIERE_ORDER_BPARTNER_LOCATION_ID || 1000004),
  AD_Org_ID: Number(process.env.IDEMPIERE_ORDER_ORG_ID || 11),
  C_DocTypeTarget_ID: Number(process.env.IDEMPIERE_ORDER_DOCTYPE_ID || 133),
  AD_User_ID: Number(process.env.IDEMPIERE_ORDER_USER_ID || 102),
  SalesRep_ID: Number(process.env.IDEMPIERE_ORDER_SALESREP_ID || 101),
  Bill_BPartner_ID: Number(process.env.IDEMPIERE_ORDER_BILL_BPARTNER_ID || 119),
  Bill_Location_ID: Number(process.env.IDEMPIERE_ORDER_BILL_LOCATION_ID || 116),
  Bill_User_ID: Number(process.env.IDEMPIERE_ORDER_BILL_USER_ID || 102),
  C_PaymentTerm_ID: Number(process.env.IDEMPIERE_ORDER_PAYMENT_TERM_ID || 105),
  M_PriceList_ID: Number(process.env.IDEMPIERE_ORDER_PRICE_LIST_ID || 101),
  M_Shipper_ID: Number(process.env.IDEMPIERE_ORDER_SHIPPER_ID || 100),
  PaymentRule: process.env.IDEMPIERE_ORDER_PAYMENT_RULE || 'P',
  DeliveryViaRule: process.env.IDEMPIERE_ORDER_DELIVERY_RULE || 'S',
  IsSOTrx: true,
  IsSelfService: true,
  POReference: process.env.IDEMPIERE_ORDER_POREFERENCE || 'easwebtestfixed',
};

// Token-Lebensdauer: 20 Minuten bevor Neurauthentifizierung erforderlich ist
export const TOKEN_TTL_MS = 20 * 60 * 1000;

// JWT Secret für User-Session-Tokens
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// JWT Token Lebensdauer: 7 Tage
export const JWT_EXPIRES_IN = '7d';

// Registrierungs-Konfiguration: Rolle für neue Webshop-Kunden
export const REGISTRATION_CONFIG = {
  roleId: Number(process.env.IDEMPIERE_REGISTRATION_ROLE_ID || 1000000),
};
