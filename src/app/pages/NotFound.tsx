import React from 'react';
import { Link } from 'react-router';
import { Button } from '../components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#EB1A2B] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Seite nicht gefunden
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Die angeforderte Seite existiert leider nicht.
        </p>
        <Link to="/">
          <Button size="lg">Zurück zur Startseite</Button>
        </Link>
      </div>
    </div>
  );
}
