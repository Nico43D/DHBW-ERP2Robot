import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '../components/Button';
import { fetchCatalog, mapApiProductToProduct, Product, FALLBACK_IMAGE } from '../services/api';
import { ShoppingBag, Truck, CreditCard, Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const apiProducts = await fetchCatalog();
        // Nur die ersten 3 Produkte für die Startseite
        setProducts(apiProducts.slice(0, 3).map(mapApiProductToProduct));
      } catch (err) {
        console.error('Fehler beim Laden der Produkte:', err);
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#EB1A2B] to-[#c71622] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Willkommen bei Duale Süßigkeiten
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Entdecken Sie unsere Premium-Auswahl an köstlichen Süßigkeiten und Schokoladen
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" className="bg-white text-[#EB1A2B] hover:bg-gray-100">
                  Jetzt einkaufen
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#EB1A2B]">
                  Konto erstellen
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EB1A2B] text-white mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Qualität</h3>
              <p className="text-gray-600">Nur die besten Marken und Produkte</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EB1A2B] text-white mb-4">
                <Truck className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Schneller Versand</h3>
              <p className="text-gray-600">Lieferung innerhalb von 2-3 Werktagen</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EB1A2B] text-white mb-4">
                <CreditCard className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Sichere Zahlung</h3>
              <p className="text-gray-600">Multiple Zahlungsmethoden verfügbar</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Unsere Produkte
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Entdecken Sie unsere sorgfältig ausgewählten Premium-Süßigkeiten
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 text-[#EB1A2B] animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center py-12">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-4" />
              <p className="text-gray-600 mb-4">Produkte konnten nicht geladen werden</p>
              <Link to="/shop">
                <Button>Zum Shop</Button>
              </Link>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="group">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square overflow-hidden bg-white flex items-center justify-center p-6">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="font-semibold text-xl mb-2 group-hover:text-[#EB1A2B] transition-colors">
                        {product.name}
                      </h3>
                      <div className="text-2xl font-bold text-[#EB1A2B]">
                        €{product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">
              Keine Produkte verfügbar
            </p>
          )}

          <div className="text-center mt-12">
            <Link to="/shop">
              <Button size="lg">
                Alle Produkte ansehen
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
