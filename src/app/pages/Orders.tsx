import React, { useState, useEffect, useMemo } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Package, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

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

type SortField = 'orderNumber' | 'date' | 'total';
type SortDirection = 'asc' | 'desc';

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
  const { user, isAuthenticated, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'orderNumber':
          cmp = a.orderNumber.localeCompare(b.orderNumber, undefined, { numeric: true });
          break;
        case 'date':
          cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'total':
          cmp = a.total - b.total;
          break;
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [orders, sortField, sortDirection]);

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    // Load orders from localStorage (use different key for demo mode)
    if (user) {
      const ordersKey = 'duale-orders';
      const allOrders = JSON.parse(localStorage.getItem(ordersKey) || '[]');
      const userOrders = allOrders.filter((order: Order) => order.id.startsWith(user.id));
      setOrders(userOrders);
    }
  }, [user]);

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

        {/* Sortier-Buttons */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm text-gray-600 mr-1">Sortieren:</span>
          {([
            { field: 'date' as SortField, label: 'Datum' },
            { field: 'orderNumber' as SortField, label: 'Bestellnr.' },
            { field: 'total' as SortField, label: 'Preis' },
          ]).map(({ field, label }) => {
            const isActive = sortField === field;
            return (
              <button
                key={field}
                onClick={() => handleSort(field)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#EB1A2B] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {label}
                {isActive ? (
                  sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />
                ) : (
                  <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                )}
              </button>
            );
          })}
        </div>

        <div className="space-y-4">
          {sortedOrders.map((order) => (
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
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} {order.items.reduce((sum, item) => sum + item.quantity, 0) === 1 ? 'Artikel' : 'Artikel'}
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