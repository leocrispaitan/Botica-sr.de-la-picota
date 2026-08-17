import { useState, useEffect, useCallback } from 'react';
import authService, { type User } from '../services/authService';

/**
 * Hook personalizado para gestionar autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    console.log('🔍 Checking auth...');
    try {
      const hasToken = authService.isAuthenticated();
      console.log('Has token:', hasToken);
      
      if (hasToken) {
        const currentUser = authService.getCurrentUser();
        console.log('Current user:', currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        console.log('No token found, setting unauthenticated');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
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
    console.log('🚪 Starting logout...');
    try {
      await authService.logout();
      console.log('✅ Logout service completed');
    } catch (error) {
      console.error('❌ Error al cerrar sesión:', error);
    } finally {
      // Siempre actualizar el estado
      console.log('🧹 Cleaning auth state...');
      setUser(null);
      setIsAuthenticated(false);
      console.log('✅ Auth state cleaned:', { user: null, isAuthenticated: false });
    }
  }, []);

  // Log cuando cambian los estados
  useEffect(() => {
    console.log('📊 Auth state update:', { isAuthenticated, user: user?.email });
  }, [isAuthenticated, user]);

  return {
    user,
    isAuthenticated,
    loading,
    logout,
    checkAuth,
    isAdmin: authService.isAdmin(),
    isVendedor: authService.isVendedor(),
    isAlmacenero: authService.isAlmacenero(),
  };
};

export default useAuth;
