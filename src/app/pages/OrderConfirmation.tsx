import React from 'react';
import { useParams, Link, Navigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CheckCircle } from 'lucide-react';

export default function OrderConfirmation() {
  const { orderNumber } = useParams();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!orderNumber) {
    return <Navigate to="/orders" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Vielen Dank für Ihre Bestellung!
          </h1>
          
          <p className="text-lg text-gray-600 mb-6">
            Ihre Bestellung wurde erfolgreich aufgegeben.
          </p>

          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Bestellnummer</p>
            <p className="text-2xl font-bold text-[#EB1A2B]">#{orderNumber}</p>
          </div>

          <div className="text-left bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-900">
              <strong>Was passiert als Nächstes?</strong>
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1 list-disc list-inside">
              <li>Sie erhalten eine Bestätigungs-E-Mail mit allen Details</li>
              <li>Ihre Bestellung wird innerhalb von 24 Stunden bearbeitet</li>
              <li>Sie können den Status in Ihrem Dashboard verfolgen</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard">
              <Button size="lg" className="w-full sm:w-auto">
                Zum Dashboard
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Weiter einkaufen
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
