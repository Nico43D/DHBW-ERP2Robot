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
  login: (email: string, password: string) => boolean;
  register: (data: RegisterData) => boolean;
  updateAddresses: (billingAddress: Address, deliveryAddress: Address) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isSimplifiedMode: boolean;
  toggleSimplifiedMode: () => void;
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

  useEffect(() => {
    // Load simplified mode preference from localStorage
    const savedSimplifiedMode = localStorage.getItem('simplified-mode');
    if (savedSimplifiedMode === 'true') {
      setIsSimplifiedMode(true);
      setUser(DEMO_USER);
    } else {
      // Load user from localStorage on mount
      const savedUser = localStorage.getItem('duale-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    }
  }, []);

  const toggleSimplifiedMode = () => {
    const newMode = !isSimplifiedMode;
    setIsSimplifiedMode(newMode);
    localStorage.setItem('simplified-mode', newMode.toString());
    
    if (newMode) {
      // Switch to simplified mode
      setUser(DEMO_USER);
    } else {
      // Switch back to normal mode
      const savedUser = localStorage.getItem('duale-user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    }
  };

  const login = (email: string, password: string): boolean => {
    if (isSimplifiedMode) return true; // Always logged in as demo user
    
    // Mock login - check if user exists in localStorage
    const users = JSON.parse(localStorage.getItem('duale-users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('duale-user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = (data: RegisterData): boolean => {
    if (isSimplifiedMode) return true; // Always logged in as demo user
    
    // Mock registration
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
    localStorage.setItem('duale-user', JSON.stringify(updatedUser));

    // Update in users list
    const users = JSON.parse(localStorage.getItem('duale-users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], billingAddress, deliveryAddress };
      localStorage.setItem('duale-users', JSON.stringify(users));
    }
  };

  const logout = () => {
    if (isSimplifiedMode) return; // Can't logout in simplified mode
    
    setUser(null);
    localStorage.removeItem('duale-user');
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