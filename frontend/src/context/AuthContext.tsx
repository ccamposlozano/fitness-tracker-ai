import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, MacroResponse } from '../types';
import { getProfile, getMacros } from '../api';

interface AuthContextType {
  user: User | null;
  macros: MacroResponse | null;
  setUser: (user: User | null) => void;
  setMacros: (macros: MacroResponse | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [macros, setMacros] = useState<MacroResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getProfile();
      setUser(userData);
      const macroData = await getMacros();
      setMacros(macroData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setMacros(null);
  };

  return (
    <AuthContext.Provider value={{ user, macros, setUser, setMacros, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 