import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { fetchCatalog, mapApiProductToProduct, Product, FALLBACK_IMAGE } from '../services/api';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { QuantityStepper } from '../components/QuantityStepper';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Check, ShoppingCart, Package, Loader2, AlertCircle, RefreshCw, Info } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProduct = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiProducts = await fetchCatalog();
      const apiProduct = apiProducts.find((p) => p.id === id);

      if (apiProduct) {
        setProduct(mapApiProductToProduct(apiProduct));
      }
    } catch (err) {
      console.error('Fehler beim Laden des Produkts:', err);
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }

    setLoading(false);
  };

  useEffect(() => {
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-[#EB1A2B] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Fehler beim Laden
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={loadProduct} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Erneut versuchen
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Produkt nicht gefunden</h1>
          <Link to="/shop">
            <Button>Zurück zum Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isInStock = product.stock === undefined || product.stock > 0;

  const handleAddToCart = () => {
    if (!isInStock) return;

    addToCart(
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      },
      quantity
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-[#EB1A2B] mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <Card className="aspect-square rounded-lg overflow-hidden bg-white p-8 flex items-center justify-center relative">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
              {/* Lagerbestand-Badge */}
              {product.stock !== undefined && (
                <div
                  className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                    product.stock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  <Package className="h-4 w-4" />
                  {product.stock > 0 ? `${product.stock} auf Lager` : 'Nicht verfügbar'}
                </div>
              )}
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              {product.description && (
                <p className="text-gray-600 text-lg leading-relaxed">
                  {product.description}
                </p>
              )}
            </div>

            <div className="text-4xl font-bold text-[#EB1A2B]">
              €{product.price.toFixed(2)}
            </div>

            <Card className="p-6 border-t-4 border-[#EB1A2B]">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold text-lg">Menge:</span>
                <QuantityStepper value={quantity} onChange={setQuantity} max={product.stock} />
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full"
                disabled={!isInStock}
              >
                {!isInStock ? (
                  'Nicht verfügbar'
                ) : added ? (
                  <>
                    <Check className="h-5 w-5" />
                    Hinzugefügt
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    In den Warenkorb
                  </>
                )}
              </Button>
            </Card>

            {product.documentNote && (
              <Card className="p-5 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-[#EB1A2B]" />
                  <h3 className="font-semibold text-lg">Inhaltsstoffe & Allergene</h3>
                </div>
                <div
                  className="text-gray-600 text-sm leading-relaxed prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: product.documentNote }}
                />
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
