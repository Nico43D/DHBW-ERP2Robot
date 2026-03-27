import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth, Address } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';

export default function Register() {
  const [formData, setFormData] = useState({
    customerType: 'private' as 'private' | 'company',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
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
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (!formData.email) newErrors.email = 'E-Mail-Adresse ist erforderlich';
    if (!formData.password) newErrors.password = 'Passwort ist erforderlich';
    if (!formData.firstName) newErrors.firstName = 'Vorname ist erforderlich';
    if (!formData.lastName) newErrors.lastName = 'Nachname ist erforderlich';
    if (formData.customerType === 'company' && !formData.company) {
      newErrors.company = 'Firmenname ist erforderlich';
    }

    // Billing address validation
    if (!formData.billingStreet) newErrors.billingStreet = 'Straße ist erforderlich';
    if (!formData.billingHouseNumber) newErrors.billingHouseNumber = 'Hausnummer ist erforderlich';
    if (!formData.billingZipCode) newErrors.billingZipCode = 'PLZ ist erforderlich';
    if (!formData.billingCity) newErrors.billingCity = 'Ort ist erforderlich';

    // Delivery address validation (if different)
    if (!formData.sameAsDelivery) {
      if (!formData.deliveryStreet) newErrors.deliveryStreet = 'Straße ist erforderlich';
      if (!formData.deliveryHouseNumber) newErrors.deliveryHouseNumber = 'Hausnummer ist erforderlich';
      if (!formData.deliveryZipCode) newErrors.deliveryZipCode = 'PLZ ist erforderlich';
      if (!formData.deliveryCity) newErrors.deliveryCity = 'Ort ist erforderlich';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwörter stimmen nicht überein';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Passwort muss mindestens 6 Zeichen lang sein';
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

    setIsLoading(true);

    try {
      const result = await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerType: formData.customerType,
        company: formData.company || undefined,
        billingAddress,
        deliveryAddress,
      });

      if (result.success) {
        navigate('/dashboard');
      } else {
        setErrors({ email: result.error || 'Registrierung fehlgeschlagen' });
      }
    } catch (error) {
      setErrors({ email: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrieren</h1>
          <p className="text-gray-600">
            Erstellen Sie Ihr Konto für Duale Süßigkeiten
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Kundentyp *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleChange('customerType', 'private')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.customerType === 'private'
                      ? 'border-[#EB1A2B] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">Privatkunde</div>
                  <div className="text-sm text-gray-600 mt-1">Für Einzelpersonen</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleChange('customerType', 'company')}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.customerType === 'company'
                      ? 'border-[#EB1A2B] bg-red-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">Firmenkunde</div>
                  <div className="text-sm text-gray-600 mt-1">Für Unternehmen</div>
                </button>
              </div>
            </div>

            {/* Company Name (only for company customers) */}
            {formData.customerType === 'company' && (
              <Input
                label="Firmenname *"
                type="text"
                value={formData.company}
                onChange={(e) => handleChange('company', e.target.value)}
                placeholder="Ihre Firma GmbH"
                error={errors.company}
                required
              />
            )}

            {/* Personal Information */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-lg mb-4">Persönliche Daten</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Vorname *"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="Max"
                    error={errors.firstName}
                    required
                  />
                  <Input
                    label="Nachname *"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="Mustermann"
                    error={errors.lastName}
                    required
                  />
                </div>

                <Input
                  label="E-Mail-Adresse *"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="ihre@email.de"
                  error={errors.email}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Passwort *"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="••••••••"
                    error={errors.password}
                    required
                  />
                  <Input
                    label="Passwort bestätigen *"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Billing Address */}
            <div className="border-t pt-6">
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

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Wird registriert...' : 'Konto erstellen'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Bereits ein Konto?{' '}
              <Link to="/login" className="text-[#EB1A2B] font-medium hover:underline">
                Jetzt anmelden
              </Link>
            </p>
          </div>
        </Card>

        <div className="mt-4 text-center">
          <Link to="/shop" className="text-sm text-gray-600 hover:text-[#EB1A2B]">
            Zurück zum Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
