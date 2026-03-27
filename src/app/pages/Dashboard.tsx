import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { ShoppingBag, MapPin, Package } from 'lucide-react';

export default function Dashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Hallo, {user?.firstName}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Willkommen zurück in Ihrem Dashboard
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/shop">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#EB1A2B] text-white rounded-lg">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Shop</h3>
                  <p className="text-sm text-gray-600">
                    Entdecken Sie unsere Produkte
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#EB1A2B] text-white rounded-lg">
                  <Package className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Bestellungen</h3>
                  <p className="text-sm text-gray-600">
                    Verwalten Sie Ihre Bestellungen
                  </p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/account/addresses">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#EB1A2B] text-white rounded-lg">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Adressen</h3>
                  <p className="text-sm text-gray-600">
                    Verwalten Sie Ihre Adressen
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Account Information */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="font-semibold text-xl mb-4">Kontoinformationen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">E-Mail</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kundentyp</p>
                <p className="font-medium">
                  {user?.customerType === 'private' ? 'Privatkunde' : 'Firmenkunde'}
                </p>
              </div>
              {user?.company && (
                <div>
                  <p className="text-sm text-gray-600">Firma</p>
                  <p className="font-medium">{user.company}</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}