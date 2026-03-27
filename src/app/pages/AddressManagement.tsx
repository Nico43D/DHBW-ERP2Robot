import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router';
import { useAuth, Address } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ArrowLeft } from 'lucide-react';

export default function AddressManagement() {
  const { user, isAuthenticated, updateAddresses, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    billingStreet: '',
    billingHouseNumber: '',
    billingZipCode: '',
    billingCity: '',
    billingCountry: 'Deutschland',
    sameAsDelivery: true,
    deliveryStreet: '',
    deliveryHouseNumber: '',
    deliveryZipCode: '',
    deliveryCity: '',
    deliveryCountry: 'Deutschland',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState('');

  // Scroll to top when loading completes
  useEffect(() => {
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (user) {
      setFormData({
        billingStreet: user.billingAddress.street,
        billingHouseNumber: user.billingAddress.houseNumber,
        billingZipCode: user.billingAddress.zipCode,
        billingCity: user.billingAddress.city,
        billingCountry: user.billingAddress.country,
        sameAsDelivery: 
          user.billingAddress.street === user.deliveryAddress.street &&
          user.billingAddress.houseNumber === user.deliveryAddress.houseNumber &&
          user.billingAddress.zipCode === user.deliveryAddress.zipCode &&
          user.billingAddress.city === user.deliveryAddress.city,
        deliveryStreet: user.deliveryAddress.street,
        deliveryHouseNumber: user.deliveryAddress.houseNumber,
        deliveryZipCode: user.deliveryAddress.zipCode,
        deliveryCity: user.deliveryAddress.city,
        deliveryCountry: user.deliveryAddress.country,
      });
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

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setSuccessMessage('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.billingStreet) newErrors.billingStreet = 'Straße ist erforderlich';
    if (!formData.billingHouseNumber) newErrors.billingHouseNumber = 'Hausnummer ist erforderlich';
    if (!formData.billingZipCode) newErrors.billingZipCode = 'PLZ ist erforderlich';
    if (!formData.billingCity) newErrors.billingCity = 'Ort ist erforderlich';

    if (!formData.sameAsDelivery) {
      if (!formData.deliveryStreet) newErrors.deliveryStreet = 'Straße ist erforderlich';
      if (!formData.deliveryHouseNumber) newErrors.deliveryHouseNumber = 'Hausnummer ist erforderlich';
      if (!formData.deliveryZipCode) newErrors.deliveryZipCode = 'PLZ ist erforderlich';
      if (!formData.deliveryCity) newErrors.deliveryCity = 'Ort ist erforderlich';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const billingAddress: Address = {
      street: formData.billingStreet,
      houseNumber: formData.billingHouseNumber,
      zipCode: formData.billingZipCode,
      city: formData.billingCity,
      country: formData.billingCountry,
    };

    const deliveryAddress: Address = formData.sameAsDelivery
      ? { ...billingAddress }
      : {
          street: formData.deliveryStreet,
          houseNumber: formData.deliveryHouseNumber,
          zipCode: formData.deliveryZipCode,
          city: formData.deliveryCity,
          country: formData.deliveryCountry,
        };

    updateAddresses(billingAddress, deliveryAddress);
    setSuccessMessage('Adressen erfolgreich aktualisiert');

    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-[#EB1A2B] mb-8 transition-colors">
          <ArrowLeft className="h-5 w-5" />
          Zurück zum Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Adressen verwalten</h1>
          <p className="text-gray-600">
            Bearbeiten Sie Ihre Rechnungs- und Lieferadresse
          </p>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">{successMessage}</p>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Address */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Rechnungsadresse</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-3">
                    <Input
                      label="Straße *"
                      value={formData.billingStreet}
                      onChange={(e) => handleChange('billingStreet', e.target.value)}
                      placeholder="Musterstraße"
                      error={errors.billingStreet}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      label="Hausnummer *"
                      value={formData.billingHouseNumber}
                      onChange={(e) => handleChange('billingHouseNumber', e.target.value)}
                      placeholder="123"
                      error={errors.billingHouseNumber}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Input
                      label="PLZ *"
                      value={formData.billingZipCode}
                      onChange={(e) => handleChange('billingZipCode', e.target.value)}
                      placeholder="12345"
                      error={errors.billingZipCode}
                      required
                    />
                  </div>
                  <div className="md:col-span-3">
                    <Input
                      label="Ort *"
                      value={formData.billingCity}
                      onChange={(e) => handleChange('billingCity', e.target.value)}
                      placeholder="Berlin"
                      error={errors.billingCity}
                      required
                    />
                  </div>
                </div>
                <Input
                  label="Land *"
                  value={formData.billingCountry}
                  onChange={(e) => handleChange('billingCountry', e.target.value)}
                  disabled
                />
              </div>
            </div>

            {/* Delivery Address Checkbox */}
            <div className="border-t pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sameAsDelivery}
                  onChange={(e) => handleChange('sameAsDelivery', e.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-[#EB1A2B] focus:ring-[#EB1A2B] cursor-pointer"
                />
                <span className="text-base font-medium text-gray-700">
                  Lieferadresse entspricht Rechnungsadresse
                </span>
              </label>
            </div>

            {/* Delivery Address (only if different) */}
            {!formData.sameAsDelivery && (
              <div className="border-t pt-6">
                <h3 className="font-semibold text-lg mb-4">Lieferadresse</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                      <Input
                        label="Straße *"
                        value={formData.deliveryStreet}
                        onChange={(e) => handleChange('deliveryStreet', e.target.value)}
                        placeholder="Musterstraße"
                        error={errors.deliveryStreet}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        label="Hausnummer *"
                        value={formData.deliveryHouseNumber}
                        onChange={(e) => handleChange('deliveryHouseNumber', e.target.value)}
                        placeholder="123"
                        error={errors.deliveryHouseNumber}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        label="PLZ *"
                        value={formData.deliveryZipCode}
                        onChange={(e) => handleChange('deliveryZipCode', e.target.value)}
                        placeholder="12345"
                        error={errors.deliveryZipCode}
                        required
                      />
                    </div>
                    <div className="md:col-span-3">
                      <Input
                        label="Ort *"
                        value={formData.deliveryCity}
                        onChange={(e) => handleChange('deliveryCity', e.target.value)}
                        placeholder="Berlin"
                        error={errors.deliveryCity}
                        required
                      />
                    </div>
                  </div>
                  <Input
                    label="Land *"
                    value={formData.deliveryCountry}
                    onChange={(e) => handleChange('deliveryCountry', e.target.value)}
                    disabled
                  />
                </div>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" size="lg" className="flex-1">
                Änderungen speichern
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                size="lg" 
                onClick={() => navigate(-1)}
              >
                Abbrechen
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
