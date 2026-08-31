/**
 * Hook personalizado para verificar permisos del usuario
 * Proporciona funciones útiles para controlar acceso basado en roles
 */

import { useAuth } from '../contexts/AuthContext';
import {
  puedeVerMenu,
  puedeVerSubmenu,
  getMenuPredeterminado,
  esAdministrador,
  esVendedor,
  esAlmacenero,
  getPathsPermitidos,
} from '../config/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const userRole = user?.rol?.nombre_rol;

  return {
    // Información del usuario
    userRole,
    user,

    // Verificaciones de rol
    isAdmin: esAdministrador(userRole),
    isVendedor: esVendedor(userRole),
    isAlmacenero: esAlmacenero(userRole),

    // Verificaciones de permisos
    canViewMenu: (menuName: string) => puedeVerMenu(userRole, menuName),
    canViewSubmenu: (menuName: string, submenuName: string) => 
      puedeVerSubmenu(userRole, menuName, submenuName),

    // Utilidades
    getDefaultMenu: () => getMenuPredeterminado(userRole),
    getAllowedPaths: () => getPathsPermitidos(userRole),

    // Verificar si tiene acceso a un path específico
    canAccessPath: (path: string) => {
      const allowedPaths = getPathsPermitidos(userRole);
      return allowedPaths.includes(path);
    },
  };
};
