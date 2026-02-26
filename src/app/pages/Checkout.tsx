import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    street: '',
    houseNumber: '',
    zipCode: '',
    city: '',
    country: 'Deutschland',
    paymentMethod: 'rechnung' as 'rechnung' | 'paypal' | 'kreditkarte',
    shippingMethod: 'standard' as 'standard' | 'express',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=checkout&message=login-required" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.street) newErrors.street = 'Straße ist erforderlich';
    if (!formData.houseNumber) newErrors.houseNumber = 'Hausnummer ist erforderlich';
    if (!formData.zipCode) newErrors.zipCode = 'PLZ ist erforderlich';
    if (!formData.city) newErrors.city = 'Stadt ist erforderlich';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create order
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    const order = {
      id: `${user?.id}-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      total: totalPrice + (formData.shippingMethod === 'express' ? 9.99 : 4.99),
      orderStatus: 'processing' as const,
      invoiceStatus: formData.paymentMethod === 'rechnung' ? 'pending' as const : 'paid' as const,
      shippingStatus: 'preparing' as const,
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      address: formData,
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('duale-orders') || '[]');
    orders.push(order);
    localStorage.setItem('duale-orders', JSON.stringify(orders));

    // Clear cart
    clearCart();

    // Navigate to confirmation
    navigate(`/order-confirmation/${orderNumber}`);
  };

  const shippingCost = formData.shippingMethod === 'express' ? 9.99 : 4.99;
  const total = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          Kasse
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Lieferadresse</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Input
                        label="Straße *"
                        value={formData.street}
                        onChange={(e) => handleChange('street', e.target.value)}
                        error={errors.street}
                        placeholder="Musterstraße"
                      />
                    </div>
                    <div>
                      <Input
                        label="Nr. *"
                        value={formData.houseNumber}
                        onChange={(e) => handleChange('houseNumber', e.target.value)}
                        error={errors.houseNumber}
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        label="PLZ *"
                        value={formData.zipCode}
                        onChange={(e) => handleChange('zipCode', e.target.value)}
                        error={errors.zipCode}
                        placeholder="12345"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input
                        label="Stadt *"
                        value={formData.city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        error={errors.city}
                        placeholder="Berlin"
                      />
                    </div>
                  </div>
                  <Input
                    label="Land"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    disabled
                  />
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Zahlungsart</h2>
                <div className="space-y-3">
                  {[
                    { value: 'rechnung', label: 'Rechnung', desc: 'Zahlung nach Erhalt der Ware' },
                    { value: 'paypal', label: 'PayPal', desc: 'Schnell und sicher bezahlen' },
                    { value: 'kreditkarte', label: 'Kreditkarte', desc: 'Visa, Mastercard, American Express' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => handleChange('paymentMethod', method.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                        formData.paymentMethod === method.value
                          ? 'border-[#EB1A2B] bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium">{method.label}</div>
                      <div className="text-sm text-gray-600 mt-1">{method.desc}</div>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Shipping Method */}
              <Card className="p-6">
                <h2 className="font-semibold text-xl mb-4">Versandart</h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => handleChange('shippingMethod', 'standard')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      formData.shippingMethod === 'standard'
                        ? 'border-[#EB1A2B] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Standard-Versand</div>
                        <div className="text-sm text-gray-600 mt-1">Lieferung in 2-3 Werktagen</div>
                      </div>
                      <div className="font-semibold">€4.99</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange('shippingMethod', 'express')}
                    className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                      formData.shippingMethod === 'express'
                        ? 'border-[#EB1A2B] bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Express-Versand</div>
                        <div className="text-sm text-gray-600 mt-1">Lieferung in 1-2 Werktagen</div>
                      </div>
                      <div className="font-semibold">€9.99</div>
                    </div>
                  </button>
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h2 className="font-semibold text-xl mb-4">Bestellübersicht</h2>
                
                <div className="space-y-3 mb-6">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Zwischensumme</span>
                    <span>€{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Versand</span>
                    <span>€{shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-lg">
                    <span>Gesamt</span>
                    <span className="text-[#EB1A2B]">€{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Zahlungspflichtig bestellen
                </Button>

                <p className="text-xs text-gray-600 mt-4 text-center">
                  Mit der Bestellung akzeptieren Sie unsere AGB und Datenschutzbestimmungen
                </p>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
