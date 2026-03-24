import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { MapPin, CreditCard as CreditCardIcon, Loader2, AlertCircle } from 'lucide-react';
import { createOrder, OrderData } from '../services/api';

interface CreditCardData {
  cardHolder: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export default function Checkout() {
  const { user, isAuthenticated, isSimplifiedMode } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    paymentMethod: 'rechnung' as 'rechnung' | 'paypal' | 'kreditkarte',
    shippingMethod: 'standard' as 'standard' | 'express',
  });

  const [creditCard, setCreditCard] = useState<CreditCardData>(
    isSimplifiedMode
      ? {
          cardHolder: 'Max Mustermann',
          cardNumber: '4532 1488 0343 6467',
          expiryDate: '12/26',
          cvc: '123',
        }
      : {
          cardHolder: '',
          cardNumber: '',
          expiryDate: '',
          cvc: '',
        }
  );

  const [errors, setErrors] = useState<Partial<CreditCardData>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CreditCardData, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=checkout&message=login-required" replace />;
  }

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreditCardChange = (field: keyof CreditCardData, value: string) => {
    let formattedValue = value;

    // Format card number with spaces
    if (field === 'cardNumber') {
      formattedValue = value
        .replace(/\s/g, '')
        .replace(/(.{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
    }

    // Format expiry date with slash
    if (field === 'expiryDate') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
    }

    // Format CVC (3-4 digits)
    if (field === 'cvc') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCreditCard((prev) => ({ ...prev, [field]: formattedValue }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleCreditCardBlur = (field: keyof CreditCardData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateCreditCardField(field);
  };

  const validateCreditCardField = (field: keyof CreditCardData): boolean => {
    if (isSimplifiedMode) return true; // Skip validation in Demo-Version

    const value = creditCard[field];
    let error = '';

    switch (field) {
      case 'cardHolder':
        if (!value.trim()) {
          error = 'Karteninhaber ist erforderlich';
        }
        break;
      case 'cardNumber':
        const cardNumberOnly = value.replace(/\s/g, '');
        if (!cardNumberOnly) {
          error = 'Kartennummer ist erforderlich';
        } else if (cardNumberOnly.length < 15) {
          error = 'Ungültige Kartennummer';
        }
        break;
      case 'expiryDate':
        if (!value) {
          error = 'Ablaufdatum ist erforderlich';
        } else {
          const [month, year] = value.split('/');
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear() % 100;
          const currentMonth = currentDate.getMonth() + 1;
          
          if (!month || !year || parseInt(month) < 1 || parseInt(month) > 12) {
            error = 'Ungültiges Datum';
          } else if (
            parseInt(year) < currentYear ||
            (parseInt(year) === currentYear && parseInt(month) < currentMonth)
          ) {
            error = 'Karte ist abgelaufen';
          }
        }
        break;
      case 'cvc':
        if (!value) {
          error = 'CVC ist erforderlich';
        } else if (value.length < 3) {
          error = 'Ungültiger CVC';
        }
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const validateCreditCardForm = (): boolean => {
    if (isSimplifiedMode) return true; // Skip validation in Demo-Version

    const fields: (keyof CreditCardData)[] = ['cardHolder', 'cardNumber', 'expiryDate', 'cvc'];
    let isValid = true;

    fields.forEach((field) => {
      const fieldValid = validateCreditCardField(field);
      if (!fieldValid) isValid = false;
      setTouched((prev) => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate credit card if selected
    if (formData.paymentMethod === 'kreditkarte' && !validateCreditCardForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Bestellung an iDempiere senden
      const orderData: OrderData = {
        lines: items.map((item) => ({
          M_Product_ID: Number(item.productId),
          QtyOrdered: item.quantity,
        })),
        POReference: `WebShop-${Date.now()}`,
      };

      const apiResponse = await createOrder(orderData);

      // Lokale Bestellung für Anzeige erstellen
      const orderNumber = apiResponse.DocumentNo || Math.random().toString(36).substr(2, 9).toUpperCase();
      const order = {
        id: `${user?.id}-${Date.now()}`,
        orderNumber,
        idempiereOrderId: apiResponse.id,
        date: new Date().toISOString(),
        total: totalPrice + (formData.shippingMethod === 'express' ? 9.99 : 4.99),
        orderStatus: 'processing' as const,
        invoiceStatus: formData.paymentMethod === 'rechnung' ? ('pending' as const) : ('paid' as const),
        shippingStatus: 'preparing' as const,
        items: items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })),
        billingAddress: user!.billingAddress,
        deliveryAddress: user!.deliveryAddress,
        paymentMethod: formData.paymentMethod,
      };

      // Save order to localStorage (use different key for demo mode)
      const ordersKey = isSimplifiedMode ? 'duale-demo-orders' : 'duale-orders';
      const orders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      orders.push(order);
      localStorage.setItem(ordersKey, JSON.stringify(orders));

      // Navigate to confirmation FIRST, then clear cart after navigation is initiated
      navigate(`/order-confirmation/${orderNumber}`, { replace: true });

      // Clear cart after a brief delay to ensure navigation has started
      setTimeout(() => {
        clearCart();
      }, 100);
    } catch (error) {
      console.error('Fehler beim Erstellen der Bestellung:', error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Beim Erstellen der Bestellung ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
      );
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Addresses Summary */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-xl">Adressen</h2>
                  {!isSimplifiedMode && (
                    <Link 
                      to="/account/addresses" 
                      className="text-sm text-[#EB1A2B] hover:underline font-medium flex items-center gap-1"
                    >
                      <MapPin className="h-4 w-4" />
                      Adresse ändern
                    </Link>
                  )}
                </div>

                {isSimplifiedMode && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <strong>Demo-Version:</strong> Die Adressdaten sind bereits ausgefüllt
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Billing Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Rechnungsadresse</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.company && (
                        <p className="text-gray-700">{user.company}</p>
                      )}
                      <p className="text-gray-700">
                        {user?.billingAddress.street} {user?.billingAddress.houseNumber}
                      </p>
                      <p className="text-gray-700">
                        {user?.billingAddress.zipCode} {user?.billingAddress.city}
                      </p>
                      <p className="text-gray-700">{user?.billingAddress.country}</p>
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Lieferadresse</h3>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 font-medium">
                        {user?.firstName} {user?.lastName}
                      </p>
                      {user?.company && (
                        <p className="text-gray-700">{user.company}</p>
                      )}
                      <p className="text-gray-700">
                        {user?.deliveryAddress.street} {user?.deliveryAddress.houseNumber}
                      </p>
                      <p className="text-gray-700">
                        {user?.deliveryAddress.zipCode} {user?.deliveryAddress.city}
                      </p>
                      <p className="text-gray-700">{user?.deliveryAddress.country}</p>
                    </div>
                  </div>
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

                {/* Credit Card Form */}
                {formData.paymentMethod === 'kreditkarte' && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {isSimplifiedMode && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-900">
                          <strong>Demo-Version:</strong> Kreditkartendaten sind bereits ausgefüllt
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mb-4">
                      <CreditCardIcon className="h-5 w-5 text-[#EB1A2B]" />
                      <h3 className="font-semibold text-lg">Kreditkarteninformationen</h3>
                    </div>

                    <div className="space-y-4">
                      {/* Card Holder */}
                      <div>
                        <label htmlFor="cardHolder" className="block text-sm font-medium text-gray-700 mb-1">
                          Karteninhaber (Name auf der Karte) *
                        </label>
                        <input
                          type="text"
                          id="cardHolder"
                          value={creditCard.cardHolder}
                          onChange={(e) => handleCreditCardChange('cardHolder', e.target.value)}
                          onBlur={() => handleCreditCardBlur('cardHolder')}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            touched.cardHolder && errors.cardHolder
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-[#EB1A2B] focus:border-transparent'
                          }`}
                          placeholder="Max Mustermann"
                        />
                        {touched.cardHolder && errors.cardHolder && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardHolder}</p>
                        )}
                      </div>

                      {/* Card Number */}
                      <div>
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                          Kartennummer *
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          value={creditCard.cardNumber}
                          onChange={(e) => handleCreditCardChange('cardNumber', e.target.value)}
                          onBlur={() => handleCreditCardBlur('cardNumber')}
                          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                            touched.cardNumber && errors.cardNumber
                              ? 'border-red-500 focus:ring-red-500'
                              : 'border-gray-300 focus:ring-[#EB1A2B] focus:border-transparent'
                          }`}
                          placeholder="1234 5678 9012 3456"
                        />
                        {touched.cardNumber && errors.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                        )}
                      </div>

                      {/* Expiry and CVC */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                            Ablaufdatum (MM/JJ) *
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            value={creditCard.expiryDate}
                            onChange={(e) => handleCreditCardChange('expiryDate', e.target.value)}
                            onBlur={() => handleCreditCardBlur('expiryDate')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              touched.expiryDate && errors.expiryDate
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-[#EB1A2B] focus:border-transparent'
                            }`}
                            placeholder="MM/JJ"
                          />
                          {touched.expiryDate && errors.expiryDate && (
                            <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                            CVC/CVV *
                          </label>
                          <input
                            type="text"
                            id="cvc"
                            value={creditCard.cvc}
                            onChange={(e) => handleCreditCardChange('cvc', e.target.value)}
                            onBlur={() => handleCreditCardBlur('cvc')}
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                              touched.cvc && errors.cvc
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-[#EB1A2B] focus:border-transparent'
                            }`}
                            placeholder="123"
                          />
                          {touched.cvc && errors.cvc && (
                            <p className="mt-1 text-sm text-red-600">{errors.cvc}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    <div key={item.productId} className="flex gap-3 items-center">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden bg-white flex items-center justify-center p-1 border border-gray-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-medium">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
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

                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{submitError}</p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Bestellung wird verarbeitet...
                    </>
                  ) : isSimplifiedMode ? (
                    'Bestellung abschließen'
                  ) : (
                    'Zahlungspflichtig bestellen'
                  )}
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