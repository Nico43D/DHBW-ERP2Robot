import React from 'react';
import { Link, useLocation } from 'react-router';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Button } from './Button';

export function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#EB1A2B]">Duale Süßigkeiten</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-base font-medium transition-colors ${
                isActive('/') ? 'text-[#EB1A2B]' : 'text-gray-700 hover:text-[#EB1A2B]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`text-base font-medium transition-colors ${
                isActive('/shop') ? 'text-[#EB1A2B]' : 'text-gray-700 hover:text-[#EB1A2B]'
              }`}
            >
              Shop
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className={`text-base font-medium transition-colors ${
                    isActive('/dashboard') ? 'text-[#EB1A2B]' : 'text-gray-700 hover:text-[#EB1A2B]'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/orders"
                  className={`text-base font-medium transition-colors ${
                    isActive('/orders') ? 'text-[#EB1A2B]' : 'text-gray-700 hover:text-[#EB1A2B]'
                  }`}
                >
                  Bestellungen
                </Link>
              </>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Demo Link */}
            <Link
              to="/demo"
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
            >
              Demo
            </Link>

            <Link to="/cart" className="relative">
              <Button variant="ghost" className="relative h-10 w-10 p-0">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#EB1A2B] text-white text-xs flex items-center justify-center font-medium">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-sm text-gray-700">
                  Hallo, {user?.firstName}
                </span>
                <Button variant="ghost" onClick={logout} className="h-10 w-10 p-0">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="h-10 w-10 p-0">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-t border-gray-200 px-4 py-3 flex gap-4 overflow-x-auto">
        <Link
          to="/"
          className={`text-sm font-medium whitespace-nowrap ${
            isActive('/') ? 'text-[#EB1A2B]' : 'text-gray-700'
          }`}
        >
          Home
        </Link>
        <Link
          to="/shop"
          className={`text-sm font-medium whitespace-nowrap ${
            isActive('/shop') ? 'text-[#EB1A2B]' : 'text-gray-700'
          }`}
        >
          Shop
        </Link>
        {isAuthenticated && (
          <>
            <Link
              to="/dashboard"
              className={`text-sm font-medium whitespace-nowrap ${
                isActive('/dashboard') ? 'text-[#EB1A2B]' : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/orders"
              className={`text-sm font-medium whitespace-nowrap ${
                isActive('/orders') ? 'text-[#EB1A2B]' : 'text-gray-700'
              }`}
            >
              Bestellungen
            </Link>
          </>
        )}
        <Link
          to="/demo"
          className={`text-sm font-medium whitespace-nowrap ${
            isActive('/demo') ? 'text-[#EB1A2B]' : 'text-gray-700'
          }`}
        >
          Demo
        </Link>
      </nav>
    </header>
  );
}
