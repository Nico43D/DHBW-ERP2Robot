import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { products } from '../data/products';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { QuantityStepper } from '../components/QuantityStepper';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Check, ShoppingCart, AlertCircle } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find((p) => p.id === id);

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

  const handleAddToCart = () => {
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Image */}
          <div>
            <Card className="aspect-square rounded-lg overflow-hidden bg-white p-8 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </Card>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600">{product.description}</p>
            </div>

            <div className="text-4xl font-bold text-[#EB1A2B]">
              €{product.price.toFixed(2)}
            </div>

            <Card className="p-6 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Beschreibung</h3>
              <p className="text-gray-700 leading-relaxed">{product.fullDescription}</p>
            </Card>

            <Card className="p-6 border-t-4 border-[#EB1A2B]">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-semibold text-lg">Menge:</span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              <Button onClick={handleAddToCart} size="lg" className="w-full">
                {added ? (
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
          </div>
        </div>

        {/* Additional Product Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <Card className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-[#EB1A2B] rounded"></div>
              Inhaltsstoffe
            </h2>
            <ul className="space-y-2">
              {product.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-700">
                  <span className="text-[#EB1A2B] font-bold mt-1">•</span>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Allergens */}
          <Card className="p-6 md:p-8 bg-amber-50 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              Allergene und Spurenhinweise
            </h2>
            <div className="space-y-3">
              {product.allergens.map((allergen, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-600 rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    !
                  </div>
                  <p className="text-gray-900 font-medium">{allergen}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-amber-300">
              <p className="text-sm text-gray-700">
                <strong>Hinweis:</strong> Bitte beachten Sie die Allergenhinweise, wenn Sie unter 
                Lebensmittelallergien oder -unverträglichkeiten leiden.
              </p>
            </div>
          </Card>
        </div>

        {/* Product Highlights */}
        <Card className="p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produkthighlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {product.details.map((detail, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                <Check className="h-5 w-5 text-[#EB1A2B] flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{detail}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}