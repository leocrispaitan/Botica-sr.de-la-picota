import { useState, useEffect } from 'react';
import authService, { type User } from '../services/authService';

/**
 * Hook personalizado para gestionar autenticación
 */
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

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
