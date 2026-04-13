import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { CheckCircle } from 'lucide-react';
import { Order } from './Orders';

function getOrderStatusText(status: Order['orderStatus']) {
  switch (status) {
    case 'processing':
      return 'Eingegangen';
    case 'shipped':
      return 'Versandt';
    case 'delivered':
      return 'Zugestellt';
  }
}

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { isAuthenticated, isLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (orderNumber) {
      // Load order from localStorage
      const ordersKey = 'duale-orders';
      const allOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      const foundOrder = allOrders.find((o: Order) => o.orderNumber === orderNumber);
      setOrder(foundOrder || null);
      
      // Set a flag to indicate we're on the confirmation page
      // This prevents the Cart page from showing "empty" state prematurely
      sessionStorage.setItem('order-confirmation-active', 'true');
    }
    
    return () => {
      // Clear the flag when leaving the confirmation page
      sessionStorage.removeItem('order-confirmation-active');
    };
  }, [orderNumber]);

  // Warte bis Session-Check abgeschlossen ist
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Lädt...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!orderNumber) {
    return <Navigate to="/orders" replace />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bestellung wird geladen...
            </h2>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <Card className="p-8 md:p-12 text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Vielen Dank für Ihre Bestellung!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Ihre Bestellung wurde erfolgreich aufgegeben.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Bestellnummer</p>
            <p className="text-2xl font-bold text-[#EB1A2B]">#{orderNumber}</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-1">Bestellstatus</p>
            <p className="text-lg font-semibold text-blue-900">{getOrderStatusText(order.orderStatus)}</p>
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6 md:p-8 mb-6">
          <h2 className="font-semibold text-2xl mb-6">Zusammenfassung der bestellten Produkte</h2>
          
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                {/* Product Image */}
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-white flex items-center justify-center p-2 border border-gray-200">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Menge: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Einzelpreis: €{item.price.toFixed(2)}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-bold text-[#EB1A2B]">
                    €{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Zwischensumme</span>
              <span>€{order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Versand</span>
              <span>€{(order.total - order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
              <span>Gesamt</span>
              <span className="text-[#EB1A2B]">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-6 md:p-8 mb-6">
          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Was passiert als Nächstes?</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Sie erhalten eine Bestätigungs-E-Mail mit allen Details</li>
              <li>Ihre Bestellung wird innerhalb von 24 Stunden bearbeitet</li>
              <li>Sie können den Status jederzeit verfolgen</li>
            </ul>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={`/orders/${orderNumber}`} className="flex-1 sm:flex-initial">
            <Button size="lg" className="w-full sm:w-auto">
              Zur Bestellung
            </Button>
          </Link>
          <Link to="/shop" className="flex-1 sm:flex-initial">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Weiter einkaufen
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}