import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const CURRENT_USER_KEY = "emporio_current_user";

function getAPIUrl() {
  if (typeof window === 'undefined') return 'http://localhost:3000';
  const h = window.location.hostname;
  if (h !== 'localhost' && h !== '127.0.0.1') return window.location.origin;
  return 'http://localhost:3000';
}

const API = getAPIUrl();

function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveCurrentUser(user) {
  if (user) localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  else localStorage.removeItem(CURRENT_USER_KEY);
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState({ public: true });

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) {
      setUser(saved);
      setIsAuthenticated(true);
    }
    setIsLoadingAuth(false);
    setAppPublicSettings({ public: true });
  }, []);

  const register = async (name, email, phone, password) => {
    try {
      const res = await fetch(`${API}/api/customers/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Erro ao cadastrar' };
      setUser(data);
      setIsAuthenticated(true);
      saveCurrentUser(data);
      return { success: true, user: data };
    } catch {
      return { error: 'Erro de conexão com o servidor' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API}/api/customers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error || 'Erro ao entrar' };
      setUser(data);
      setIsAuthenticated(true);
      saveCurrentUser(data);
      return { success: true, user: data };
    } catch {
      return { error: 'Erro de conexão com o servidor' };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    saveCurrentUser(null);
  };

  const updateLoyalty = async (purchaseAmount) => {
    if (!user) return;
    try {
      const res = await fetch(`${API}/api/customers/${user.id}/loyalty`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ purchaseAmount }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        saveCurrentUser(updated);
      }
    } catch { /* ignore */ }
  };

  const redeemPoints = async (points) => {
    if (!user || !user.loyalty || user.loyalty.points < points) return { error: "Pontos insuficientes" };
    try {
      const res = await fetch(`${API}/api/customers/${user.id}/loyalty`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redeemPoints: points }),
      });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        saveCurrentUser(updated);
        return { success: true, discount: points / 10 };
      }
      return { error: 'Erro ao resgatar pontos' };
    } catch {
      return { error: 'Erro de conexão' };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      register,
      login,
      logout,
      updateLoyalty,
      redeemPoints,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
