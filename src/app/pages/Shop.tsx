import React, { useEffect, useState } from 'react';
import { ProductCard } from '../components/ProductCard';
import { fetchCatalog, mapApiProductToProduct, Product } from '../services/api';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../components/Button';

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiProducts = await fetchCatalog();
      setProducts(apiProducts.map(mapApiProductToProduct));
    } catch (err) {
      console.error('Fehler beim Laden der Produkte:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Shop</h1>
          <p className="text-lg text-gray-600">
            Entdecken Sie unsere Premium-Auswahl an Süßigkeiten
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-[#EB1A2B] animate-spin mb-4" />
            <p className="text-gray-600">Produkte werden geladen...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="max-w-md text-center">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Verbindung fehlgeschlagen
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={loadProducts} className="flex items-center gap-2 mx-auto">
                <RefreshCw className="h-4 w-4" />
                Erneut versuchen
              </Button>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg mb-4">
              Derzeit sind keine Produkte verfügbar.
            </p>
            <Button onClick={loadProducts} className="flex items-center gap-2 mx-auto">
              <RefreshCw className="h-4 w-4" />
              Erneut laden
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
