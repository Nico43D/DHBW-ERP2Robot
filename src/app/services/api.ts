// API Service für Backend-Kommunikation mit iDempiere

const API_BASE_URL = 'http://localhost:3001/api';

// Fallback-Bild für Produkte ohne Bild
export const FALLBACK_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmM2Y0ZjYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiPktlaW4gQmlsZDwvdGV4dD48L3N2Zz4=';

// Produkt-Interface wie vom Backend geliefert
export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  searchKey: string;
  price: number;
  stock: number;
  image: string; // Base64 Data-URL oder leer
}

// Produkt-Interface für Frontend-Komponenten (gemappt von ApiProduct)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock?: number;
  searchKey?: string;
}

/**
 * Konvertiert ein API-Produkt zum Frontend-Format
 * - description von iDempiere wird als Anzeigename verwendet
 */
export function mapApiProductToProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.description || p.name,
    description: '',
    price: p.price,
    image: p.image || FALLBACK_IMAGE,
    stock: p.stock,
    searchKey: p.searchKey || p.name,
  };
}

// Bestellposition für Order-API
export interface OrderLine {
  M_Product_ID: number;
  QtyOrdered: number;
  C_UOM_ID?: number;
}

// Bestellung für Order-API
export interface OrderData {
  lines: OrderLine[];
  POReference?: string;
  DateOrdered?: string;
  DatePromised?: string;
}

// API-Response wenn Bestellung erstellt wurde
export interface OrderResponse {
  id: number;
  DocumentNo?: string;
  DocStatus?: string;
  GrandTotal?: number;
}

/**
 * Lade alle Produkte aus dem Katalog
 */
export async function fetchCatalog(): Promise<ApiProduct[]> {
  const response = await fetch(`${API_BASE_URL}/catalog`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Fehler beim Laden des Katalogs (${response.status})`);
  }

  return response.json();
}

/**
 * Bestellung erstellen und abschließen
 */
export async function createOrder(orderData: OrderData): Promise<OrderResponse> {
  const response = await fetch(`${API_BASE_URL}/orders/create-and-complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Fehler beim Erstellen der Bestellung (${response.status})`);
  }

  return response.json();
}
