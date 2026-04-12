import { CATALOG_CONFIG } from '../config.js';
import { idempiereFetch } from '../idempiere/client.js';

/**
 * Produktbild aus iDempiere laden und als Base64 zurückgeben
 * Holt Attachment-Liste, wählt erste Datei, konvertiert zu Base64
 */
async function fetchProductImage(productId) {
  try {
    // Lade Attachment-Liste für Produkt
    const listRes = await idempiereFetch(`/models/m_product/${productId}/attachments`, {
      method: 'GET',
    });
    if (!listRes.ok) return '';

    const data = await listRes.json();
    const attachments = data.attachments ?? data;
    if (!Array.isArray(attachments) || attachments.length === 0) return '';

    // Lade erste Datei (Bild)
    const fileName = encodeURIComponent(attachments[0].name);
    const fileRes = await idempiereFetch(`/models/m_product/${productId}/attachments/${fileName}`, {
      method: 'GET',
      headers: {},
    });
    if (!fileRes.ok) return '';

    // Konvertiere zu Base64 Data-URL für direkte Darstellung im Frontend
    const contentType = fileRes.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await fileRes.arrayBuffer());
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch {
    return '';
  }
}

/**
 * Lade Produktkatalog: Kombiniere Daten aus 4 iDempiere-Tabellen:
 * - m_product: Basisdaten
 * - m_productprice: Standardpreise
 * - m_storageonhand: Lagerbestände
 * - ad_attachment: Produktbilder
 */
export async function loadCatalog() {
  // Filter: Aktiv, verkauft, featured, in korrekter Kategorie
  const productParams = new URLSearchParams({
    $filter: `IsActive eq true AND IsSold eq true AND IsWebStoreFeatured eq true AND M_Product_Category_ID eq ${CATALOG_CONFIG.productCategoryId}`,
    $select: 'Name,Value,Description,DocumentNote,M_Product_Category_ID',
    $orderby: 'Name asc',
    $top: '50',
  });

  // Abrufen Produktliste
  const productsRes = await idempiereFetch(`/models/m_product?${productParams.toString()}`, {
    method: 'GET',
  });
  if (!productsRes.ok) {
    const errorText = await productsRes.text().catch(() => '');
    const error = new Error(`Product fetch failed: ${errorText}`);
    error.status = productsRes.status;
    throw error;
  }

  const productsData = await productsRes.json();
  const rawProducts = productsData.records ?? [];
  const productIds = rawProducts.map((p) => p.id);

  // Lade Preise für alle Produkte
  const pricesMap = new Map();
  if (productIds.length > 0) {
    const idFilter = productIds.map((id) => `M_Product_ID eq ${id}`).join(' OR ');
    const priceParams = new URLSearchParams({
      $filter: `M_PriceList_Version_ID eq ${CATALOG_CONFIG.priceListVersionId} AND (${idFilter})`,
      $select: 'M_Product_ID,PriceStd,PriceList',
      $top: '200',
    });

    const pricesRes = await idempiereFetch(`/models/m_productprice?${priceParams.toString()}`, {
      method: 'GET',
    });
    if (pricesRes.ok) {
      const pricesData = await pricesRes.json();
      for (const rec of pricesData.records ?? []) {
        const productId = typeof rec.M_Product_ID === 'object' ? rec.M_Product_ID?.id : rec.M_Product_ID;
        if (productId != null) {
          pricesMap.set(productId, rec.PriceStd ?? 0);
        }
      }
    }
  }

  // Lade Lagerbestände (es können mehrere Einträge pro Produkt existieren → summieren)
  const stockMap = new Map();
  if (productIds.length > 0) {
    const idFilter = productIds.map((id) => `M_Product_ID eq ${id}`).join(' OR ');
    const stockParams = new URLSearchParams({
      $filter: `(${idFilter})`,
      $select: 'M_Product_ID,QtyOnHand',
      $top: '500',
    });

    const stockRes = await idempiereFetch(`/models/m_storageonhand?${stockParams.toString()}`, {
      method: 'GET',
    });
    if (stockRes.ok) {
      const stockData = await stockRes.json();
      for (const rec of stockData.records ?? []) {
        const productId = typeof rec.M_Product_ID === 'object' ? rec.M_Product_ID?.id : rec.M_Product_ID;
        const qty = rec.QtyOnHand ?? 0;
        if (productId != null) {
          stockMap.set(productId, (stockMap.get(productId) ?? 0) + qty);
        }
      }
    }
  }

  // Lade Bilder parallel für alle Produkte
  const images = await Promise.all(rawProducts.map((p) => fetchProductImage(p.id)));

  // Kombiniere alles zu Standard-Produktformat für Frontend
  return rawProducts.map((p, index) => ({
    id: String(p.id),
    name: p.Name,
    description: p.Description ?? '',
    documentNote: p.DocumentNote ?? '',
    searchKey: p.Value,
    price: pricesMap.get(p.id) ?? 0,
    stock: stockMap.get(p.id) ?? 0,
    image: images[index] || '',
  }));
}
