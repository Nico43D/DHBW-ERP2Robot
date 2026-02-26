import React from 'react';
import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { QuantityStepper } from '../components/QuantityStepper';
import { Trash2, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout&message=login-required');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ihr Warenkorb ist leer
            </h2>
            <p className="text-gray-600 mb-6">
              Fügen Sie Produkte zu Ihrem Warenkorb hinzu, um fortzufahren
            </p>
            <Link to="/shop">
              <Button size="lg">Zum Shop</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Warenkorb
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId} className="p-4">
                <div className="flex gap-4">
                  <Link to={`/products/${item.productId}`} className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.productId}`}>
                      <h3 className="font-semibold text-lg text-gray-900 hover:text-[#EB1A2B] transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-xl font-bold text-[#EB1A2B] mt-2">
                      €{item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <QuantityStepper
                      value={item.quantity}
                      onChange={(qty) => updateQuantity(item.productId, qty)}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-semibold text-xl mb-4">Bestellübersicht</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Zwischensumme</span>
                  <span>€{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Versand</span>
                  <span>€4.99</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-lg">
                  <span>Gesamt</span>
                  <span className="text-[#EB1A2B]">€{(totalPrice + 4.99).toFixed(2)}</span>
                </div>
              </div>

              <Button onClick={handleCheckout} size="lg" className="w-full">
                Zur Kasse
              </Button>

              <Link to="/shop" className="block mt-4">
                <Button variant="ghost" className="w-full">
                  Weiter einkaufen
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}