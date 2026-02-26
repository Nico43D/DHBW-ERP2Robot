import React from 'react';
import { Link } from 'react-router';

export function Footer() {
  return (
    <footer className="bg-[#6E7C85] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-lg mb-3">Duale Süßigkeiten</h3>
            <p className="text-sm text-gray-300">
              Ihre Online-Quelle für die besten Süßigkeiten und Schokoladen.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Kundenservice</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/kontakt" className="hover:text-white transition-colors">
                  Kontakt
                </Link>
              </li>
              <li>
                <Link to="/versand-lieferung" className="hover:text-white transition-colors">
                  Versand & Lieferung
                </Link>
              </li>
              <li>
                <Link to="/rueckgabe-umtausch" className="hover:text-white transition-colors">
                  Rückgabe & Umtausch
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Rechtliches</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link to="/agb" className="hover:text-white transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="hover:text-white transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/impressum" className="hover:text-white transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/widerrufsrecht" className="hover:text-white transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-300">
          © 2026 Duale Süßigkeiten. Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
}