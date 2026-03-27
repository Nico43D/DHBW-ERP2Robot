import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Package } from 'lucide-react';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  orderStatus: 'processing' | 'shipped' | 'delivered';
  invoiceStatus: 'pending' | 'paid' | 'overdue';
  shippingStatus: 'preparing' | 'shipped' | 'delivered';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

function getOrderStatusBadge(status: Order['orderStatus']) {
  switch (status) {
    case 'processing':
      return <Badge variant="warning">In Bearbeitung</Badge>;
    case 'shipped':
      return <Badge variant="info">Versandt</Badge>;
    case 'delivered':
      return <Badge variant="success">Zugestellt</Badge>;
  }
}

function getInvoiceStatusBadge(status: Order['invoiceStatus']) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Ausstehend</Badge>;
    case 'paid':
      return <Badge variant="success">Bezahlt</Badge>;
    case 'overdue':
      return <Badge variant="error">Überfällig</Badge>;
  }
}

function getShippingStatusBadge(status: Order['shippingStatus']) {
  switch (status) {
    case 'preparing':
      return <Badge variant="warning">Wird vorbereitet</Badge>;
    case 'shipped':
      return <Badge variant="info">Unterwegs</Badge>;
    case 'delivered':
      return <Badge variant="success">Zugestellt</Badge>;
  }
}

export default function Orders() {
  const { user, isAuthenticated, isSimplifiedMode, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    // Load orders from localStorage (use different key for demo mode)
    if (user) {
      const ordersKey = isSimplifiedMode ? 'duale-demo-orders' : 'duale-orders';
      const allOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      const userOrders = allOrders.filter((order: Order) => order.id.startsWith(user.id));
      setOrders(userOrders);
    }
  }, [user, isSimplifiedMode]);

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

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Meine Bestellungen
          </h1>
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Keine Bestellungen
            </h2>
            <p className="text-gray-600 mb-6">
              Sie haben noch keine Bestellungen aufgegeben
            </p>
            <Link to="/shop">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#EB1A2B] text-white hover:bg-[#d01625] focus-visible:ring-[#EB1A2B] h-11 px-5 text-base">
                Jetzt einkaufen
              </button>
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
          Meine Bestellungen
        </h1>

        {isSimplifiedMode && orders.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
            <p className="text-sm font-semibold text-amber-900">
              📦 Demo-Version Bestellungen
            </p>
            <p className="text-xs text-amber-800 mt-1">
              Diese Bestellungen wurden in der Demo-Version erstellt
            </p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <Link key={order.orderNumber} to={`/orders/${order.orderNumber}`}>
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        Bestellung #{order.orderNumber}
                      </h3>
                      {getOrderStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Bestellt am {new Date(order.date).toLocaleDateString('de-DE', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <div>
                        <span className="text-xs text-gray-600">Rechnung: </span>
                        {getInvoiceStatusBadge(order.invoiceStatus)}
                      </div>
                      <div>
                        <span className="text-xs text-gray-600">Versand: </span>
                        {getShippingStatusBadge(order.shippingStatus)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#EB1A2B]">
                      €{order.total.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.items.length} {order.items.length === 1 ? 'Artikel' : 'Artikel'}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}