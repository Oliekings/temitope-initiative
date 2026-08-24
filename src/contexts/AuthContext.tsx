import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthUser {
  username: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  adminPassword?: string;
  loading: boolean;
  loginWithPassword: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  loading: true,
  loginWithPassword: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState<string | undefined>(() => {
    return localStorage.getItem('admin_password') || undefined;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    const storedUser = localStorage.getItem('admin_username') || 'Administrator';
    if (isAuth) {
      setIsAdmin(true);
      setUser({ username: storedUser, role: 'admin' });
    }
    setLoading(false);
  }, []);

  const loginWithPassword = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAdmin(true);
        setUser({ username: data.username || username, role: 'admin' });
        setAdminPassword(password);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', data.username || username);
        localStorage.setItem('admin_password', password);
        return true;
      }

      // Offline / Local default fallback
      if (username === 'Surprise-MFs' && password === 'Surprise') {
        setIsAdmin(true);
        setUser({ username, role: 'admin' });
        setAdminPassword(password);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_password', password);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Password login error:", error);
      if (username === 'Surprise-MFs' && password === 'Surprise') {
        setIsAdmin(true);
        setUser({ username, role: 'admin' });
        setAdminPassword(password);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_username', username);
        localStorage.setItem('admin_password', password);
        return true;
      }
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setAdminPassword(undefined);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    localStorage.removeItem('admin_password');
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, adminPassword, loading, loginWithPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
