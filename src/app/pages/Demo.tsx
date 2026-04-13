import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router';
import { ArrowLeft } from 'lucide-react';

const DEFAULT_BPARTNER_ID = 119;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
}

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

const PLACEHOLDER_IMG =
  'data:image/svg+xml;base64,' +
  btoa(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <rect width="200" height="200" fill="#f9fafb"/>
      <rect x="60" y="50" width="80" height="80" rx="8" fill="#e5e7eb"/>
      <path d="M85 90 L100 75 L115 90 L125 80 L140 100 L60 100 Z" fill="#d1d5db"/>
      <circle cx="80" cy="70" r="8" fill="#d1d5db"/>
      <text x="100" y="155" text-anchor="middle" font-family="system-ui" font-size="13" fill="#9ca3af">Kein Bild</text>
    </svg>`
  );

export default function Demo() {
  const [products, setProducts] = useState<Product[]>([]);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [showModal, setShowModal] = useState(false);
  const [orderedItems, setOrderedItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stockWarning, setStockWarning] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<{ success: boolean; message: string; documentNo?: string } | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/catalog');
      if (!res.ok) throw new Error(`Produkte laden fehlgeschlagen (${res.status})`);
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fehler beim Laden:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleQuantityChange = (productId: string, value: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const clamped = Math.max(0, value);
    if (clamped > product.stock) {
      setStockWarning(`„${product.name}" hat nur noch ${product.stock} St. auf Lager.`);
      return;
    }
    setQuantities((prev) => ({ ...prev, [productId]: clamped }));
  };

  const handleSubmitOrder = async () => {
    const items: OrderItem[] = [];
    const orderLines: Array<{ M_Product_ID: number; QtyOrdered: number }> = [];

    products.forEach((product) => {
      const quantity = quantities[product.id] || 0;
      if (quantity > 0) {
        items.push({ productName: product.name, quantity, price: product.price });
        orderLines.push({ M_Product_ID: parseInt(product.id), QtyOrdered: quantity });
      }
    });

    if (items.length === 0) return;

    setOrderedItems(items);
    setShowModal(true);
    setIsSubmitting(true);
    setOrderResult(null);

    try {
      const res = await fetch('/api/demo/orders/create-and-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          C_BPartner_ID: DEFAULT_BPARTNER_ID,
          lines: orderLines,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Bestellung fehlgeschlagen (${res.status})`);
      }
      const result = await res.json();
      setOrderResult({
        success: true,
        message: 'Bestellung erfolgreich erstellt und bestätigt!',
        documentNo: result.DocumentNo,
      });
      setTimeout(() => closeModal(), 3000);
    } catch (err) {
      setOrderResult({
        success: false,
        message: `Fehler beim Erstellen: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setQuantities({});
    setTimeout(() => setOrderedItems([]), 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-[#EB1A2B] text-white py-8 shadow-lg">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Zurück zum Shop
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Duale Süßigkeiten
          </h1>
          <p className="text-center text-white/90 mt-2">
            Demo-Bestellung – Einfach & Direkt
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12 flex-1">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#EB1A2B] rounded-full animate-spin" />
            <p className="mt-4 text-gray-600 text-lg">Produkte werden geladen...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto">
            <p className="text-red-800 font-semibold text-lg mb-2">Verbindungsfehler</p>
            <p className="text-red-600 text-sm mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="w-full bg-[#EB1A2B] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#c91523] transition-colors"
            >
              Erneut versuchen
            </button>
          </div>
        )}

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">Keine Produkte gefunden.</p>
          </div>
        )}

        {!isLoading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="aspect-square bg-white p-6 flex items-center justify-center border-b border-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = PLACEHOLDER_IMG;
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h2>
                    {product.price > 0 ? (
                      <p className="text-2xl font-bold text-[#EB1A2B] mb-2">
                        &euro;{product.price.toFixed(2)}
                      </p>
                    ) : (
                      <p className="text-lg text-gray-400 mb-2">Kein Preis hinterlegt</p>
                    )}
                    {product.stock <= 0 ? (
                      <p className="text-sm font-semibold text-red-600 mb-4">Ausverkauft</p>
                    ) : product.stock <= 5 ? (
                      <p className="text-sm font-semibold text-red-600 mb-4">
                        Nur noch {product.stock} St. verfügbar
                      </p>
                    ) : (
                      <p className="text-sm text-green-600 mb-4">Auf Lager</p>
                    )}
                    <div className="mb-4">
                      <label htmlFor={`qty-${product.id}`} className="block text-sm font-medium text-gray-700 mb-2">
                        Anzahl
                      </label>
                      <input
                        id={`qty-${product.id}`}
                        type="number"
                        min="0"
                        max={product.stock}
                        disabled={product.stock <= 0}
                        value={quantities[product.id] || 0}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EB1A2B] focus:border-transparent text-lg ${
                          product.stock <= 0 ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 flex justify-center">
              <button
                onClick={handleSubmitOrder}
                className="bg-[#EB1A2B] text-white font-bold py-4 px-12 rounded-lg hover:bg-[#c91523] transition-colors duration-200 shadow-lg hover:shadow-xl text-xl"
              >
                Bestellung abschicken
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="bg-[#6E7C85] text-white py-6">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2024 Duale Süßigkeiten – Demo-Version</p>
        </div>
      </footer>

      {/* Bestätigungs-Modal */}
      {showModal && orderedItems.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]"
          onClick={!isSubmitting ? closeModal : undefined}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {isSubmitting && !orderResult ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#EB1A2B] rounded-full animate-spin" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Bestellung wird verarbeitet...</h2>
                  <p className="text-gray-600">Bitte warten.</p>
                </div>
              </>
            ) : orderResult?.success ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Bestellung erfolgreich!</h2>
                  {orderResult.documentNo && (
                    <p className="text-sm text-gray-500 mb-3">Bestellnummer: <span className="font-semibold text-gray-700">{orderResult.documentNo}</span></p>
                  )}
                  <div className="space-y-2 mt-4">
                    {orderedItems.map((item, index) => (
                      <p key={index} className="text-lg text-gray-700">
                        <span className="font-bold text-[#EB1A2B]">{item.quantity}x</span>{' '}
                        <span className="font-semibold">{item.productName}</span>
                      </p>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Gesamtpreis</p>
                    <p className="text-2xl font-bold text-[#EB1A2B]">
                      &euro;{orderedItems.reduce((total, item) => total + item.quantity * item.price, 0).toFixed(2)}
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} className="w-full bg-[#EB1A2B] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#c91523] transition-colors">
                  Schließen
                </button>
              </>
            ) : orderResult?.success === false ? (
              <>
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Fehler bei der Bestellung</h2>
                  <p className="text-red-600 text-sm mb-4">{orderResult.message}</p>
                  <div className="space-y-2">
                    {orderedItems.map((item, index) => (
                      <p key={index} className="text-sm text-gray-700">
                        <span className="font-semibold">{item.quantity}x</span> {item.productName}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={closeModal} className="flex-1 bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors">
                    Abbrechen
                  </button>
                  <button
                    onClick={() => { setOrderResult(null); setIsSubmitting(true); handleSubmitOrder(); }}
                    className="flex-1 bg-[#EB1A2B] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#c91523] transition-colors"
                  >
                    Erneut versuchen
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Lagerbestand-Warnung */}
      {stockWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-[fadeIn_0.2s_ease-out]" onClick={() => setStockWarning(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 animate-[slideUp_0.3s_ease-out]" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m0 4h.01M12 2L2 20h20L12 2z" />
                </svg>
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Nicht genügend verfügbar</h2>
              <p className="text-gray-600">{stockWarning}</p>
            </div>
            <button onClick={() => setStockWarning(null)} className="w-full bg-[#EB1A2B] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#c91523] transition-colors">
              Verstanden
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>
    </div>
  );
}
