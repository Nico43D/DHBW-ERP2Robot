import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
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
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      setError('Bitte füllen Sie alle Pflichtfelder aus');
      return;
    }

    if (formData.customerType === 'company' && !formData.company) {
      setError('Bitte geben Sie einen Firmennamen ein');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    const success = register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      customerType: formData.customerType,
      company: formData.company || undefined,
    });

    if (success) {
      navigate('/dashboard');
    } else {
      setError('Ein Konto mit dieser E-Mail-Adresse existiert bereits');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Registrieren</h1>
          <p className="text-gray-600">
            Erstellen Sie Ihr Konto für Duale Süßigkeiten
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

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
                required
              />
            )}

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vorname *"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder="Max"
                required
              />
              <Input
                label="Nachname *"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder="Mustermann"
                required
              />
            </div>

            {/* Account Information */}
            <Input
              label="E-Mail-Adresse *"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ihre@email.de"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Passwort *"
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder="••••••••"
                required
              />
              <Input
                label="Passwort bestätigen *"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Konto erstellen
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
