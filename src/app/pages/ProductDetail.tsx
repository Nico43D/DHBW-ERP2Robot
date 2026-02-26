import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { products } from '../data/products';
import { Button } from '../components/Button';
import { QuantityStepper } from '../components/QuantityStepper';
import { useCart } from '../contexts/CartContext';
import { ArrowLeft, Check } from 'lucide-react';

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md flex items-center justify-center p-8">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain"
            />
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

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-semibold text-lg mb-3">Produktdetails</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <Check className="h-5 w-5 text-[#EB1A2B] flex-shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Menge:</span>
                <QuantityStepper value={quantity} onChange={setQuantity} />
              </div>

              <div className="flex gap-3">
                <Button onClick={handleAddToCart} size="lg" className="flex-1">
                  {added ? (
                    <>
                      <Check className="h-5 w-5" />
                      Hinzugefügt
                    </>
                  ) : (
                    'In den Warenkorb'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}