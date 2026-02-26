import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const messageType = searchParams.get('message');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Bitte füllen Sie alle Felder aus');
      return;
    }

    const success = login(email, password);
    if (success) {
      navigate(`/${redirectTo}`);
    } else {
      setError('Ungültige E-Mail-Adresse oder Passwort');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Anmelden</h1>
          <p className="text-gray-600">
            Melden Sie sich bei Ihrem Konto an
          </p>
        </div>

        {messageType === 'login-required' && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800">Login erforderlich</p>
              <p className="text-sm text-yellow-700 mt-1">
                Bitte einloggen oder registrieren, um fortzufahren.
              </p>
            </div>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <Input
              label="E-Mail-Adresse"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ihre@email.de"
              required
            />

            <Input
              label="Passwort"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button type="submit" size="lg" className="w-full">
              Anmelden
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Noch kein Konto?{' '}
              <Link to="/register" className="text-[#EB1A2B] font-medium hover:underline">
                Jetzt registrieren
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
