import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Address {
  street: string;
  houseNumber: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  customerType: 'private' | 'company';
  company?: string;
  billingAddress: Address;
  deliveryAddress: Address;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => boolean;
  updateAddresses: (billingAddress: Address, deliveryAddress: Address) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isSimplifiedMode: boolean;
  toggleSimplifiedMode: () => void;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  customerType: 'private' | 'company';
  company?: string;
  billingAddress: Address;
  deliveryAddress: Address;
}

// Demo user for Demo-Version
const DEMO_USER: User = {
  id: 'demo-user',
  email: 'demo@duale-suessigkeiten.de',
  firstName: 'Demo',
  lastName: 'Benutzer',
  customerType: 'private',
  billingAddress: {
    street: 'Musterstraße',
    houseNumber: '42',
    zipCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
  },
  deliveryAddress: {
    street: 'Musterstraße',
    houseNumber: '42',
    zipCode: '10115',
    city: 'Berlin',
    country: 'Deutschland',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load simplified mode preference from localStorage
    const savedSimplifiedMode = localStorage.getItem('simplified-mode');
    if (savedSimplifiedMode === 'true') {
      setIsSimplifiedMode(true);
      setUser(DEMO_USER);
      setIsLoading(false);
    } else {
      // Check session with backend
      checkSession();
    }
  }, []);

  const checkSession = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Wichtig: Cookies mitsenden
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // 401 ist erwartet, wenn kein User eingeloggt ist - kein Fehler
        setUser(null);
      }
    } catch (error) {
      // Nur bei Netzwerkfehlern (nicht bei 401) loggen
      console.debug('Session check network error:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSimplifiedMode = () => {
    const newMode = !isSimplifiedMode;
    setIsSimplifiedMode(newMode);
    localStorage.setItem('simplified-mode', newMode.toString());

    if (newMode) {
      // Switch to simplified mode
      setUser(DEMO_USER);
    } else {
      // Switch back to normal mode
      setUser(null);
      checkSession();
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isSimplifiedMode) return true; // Always logged in as demo user

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Wichtig: Cookies empfangen
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = (data: RegisterData): boolean => {
    if (isSimplifiedMode) return true; // Always logged in as demo user

    // Mock registration - TODO: Implement real registration
    const users = JSON.parse(localStorage.getItem('duale-users') || '[]');

    // Check if user already exists
    if (users.some((u: any) => u.email === data.email)) {
      return false;
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
    };

    users.push(newUser);
    localStorage.setItem('duale-users', JSON.stringify(users));

    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('duale-user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const updateAddresses = (billingAddress: Address, deliveryAddress: Address) => {
    if (!user || isSimplifiedMode) return; // Don't update demo user

    const updatedUser = {
      ...user,
      billingAddress,
      deliveryAddress,
    };

    setUser(updatedUser);
    // TODO: Update in backend
  };

  const logout = async () => {
    if (isSimplifiedMode) return; // Can't logout in simplified mode

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        updateAddresses,
        logout,
        isAuthenticated: !!user,
        isSimplifiedMode,
        toggleSimplifiedMode,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}