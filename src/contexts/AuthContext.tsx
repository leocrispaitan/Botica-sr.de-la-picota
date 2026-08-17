import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import authService, { type User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
  checkAuth: () => void;
  isAdmin: boolean;
  isVendedor: boolean;
  isAlmacenero: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    console.log('🔍 [Context] Checking auth...');
    try {
      const hasToken = authService.isAuthenticated();
      console.log('[Context] Has token:', hasToken);
      
      if (hasToken) {
        const currentUser = authService.getCurrentUser();
        console.log('[Context] Current user:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log('[Context] No token found, setting unauthenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[Context] Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const logout = useCallback(async () => {
    console.log('🚪 [Context] Starting logout...');
    try {
      await authService.logout();
      console.log('✅ [Context] Logout service completed');
    } catch (error) {
      console.error('❌ [Context] Error al cerrar sesión:', error);
    } finally {
      // Siempre actualizar el estado
      console.log('🧹 [Context] Cleaning auth state...');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ [Context] Auth state cleaned');
    }
  }, []);

  // Log cuando cambian los estados
  useEffect(() => {
    console.log('📊 [Context] Auth state update:', { isAuthenticated, user: user?.email });
  }, [isAuthenticated, user]);

  const value = {
    user,
    isAuthenticated,
    loading,
    logout,
    checkAuth,
    isAdmin: authService.isAdmin(),
    isVendedor: authService.isVendedor(),
    isAlmacenero: authService.isAlmacenero(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
