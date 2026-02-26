import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Order } from './Orders';
import { ArrowLeft, Package, CreditCard, Truck } from 'lucide-react';

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

export default function OrderDetail() {
  const { orderNumber } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    // Load order from localStorage
    const allOrders = JSON.parse(localStorage.getItem('duale-orders') || '[]');
    const foundOrder = allOrders.find((o: Order) => o.orderNumber === orderNumber);
    setOrder(foundOrder || null);
  }, [orderNumber]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="max-w-2xl mx-auto p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bestellung nicht gefunden
            </h2>
            <p className="text-gray-600 mb-6">
              Die angeforderte Bestellung konnte nicht gefunden werden
            </p>
            <Link to="/orders">
              <button className="inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-[#EB1A2B] text-white hover:bg-[#d01625] focus-visible:ring-[#EB1A2B] h-11 px-5 text-base">
                Zu meinen Bestellungen
              </button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/orders" className="flex items-center gap-2 text-gray-600 hover:text-[#EB1A2B] mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Zurück zu Bestellungen
        </Link>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Bestellung #{order.orderNumber}
            </h1>
            {getOrderStatusBadge(order.orderStatus)}
          </div>
          <p className="text-gray-600">
            Bestellt am {new Date(order.date).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })} Uhr
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Bestellstatus</p>
                <div className="mt-1">{getOrderStatusBadge(order.orderStatus)}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rechnungsstatus</p>
                <div className="mt-1">{getInvoiceStatusBadge(order.invoiceStatus)}</div>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Versandstatus</p>
                <div className="mt-1">{getShippingStatusBadge(order.shippingStatus)}</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Order Items */}
        <Card className="p-6 mb-6">
          <h2 className="font-semibold text-xl mb-4">Bestellte Artikel</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">Menge: {item.quantity}</p>
                </div>
                <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-6">
          <h2 className="font-semibold text-xl mb-4">Bestellübersicht</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Zwischensumme</span>
              <span>€{(order.total - 4.99).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Versand</span>
              <span>€4.99</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-xl">
              <span>Gesamt</span>
              <span className="text-[#EB1A2B]">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
