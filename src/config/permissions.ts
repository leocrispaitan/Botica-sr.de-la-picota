/**
 * Configuración de permisos por rol
 * Define qué puede ver y hacer cada tipo de usuario
 */

export type RoleName = 'ADMINISTRATIVO' | 'VENDEDOR' | 'ALMACENERO';

/**
 * Configuración de permisos para cada rol
 */
export const PERMISOS_POR_ROL: Record<RoleName, {
  menuVisible: string[];
  submenuVisible: Record<string, string[]>;
}> = {
  // ═══ ADMINISTRATIVO - Acceso completo a todo ═══
  ADMINISTRATIVO: {
    menuVisible: [
      'Dashboard',
      'Inventario',
      'Compras',
      'Ventas',
      'Catálogos',
      'Reportes',
      'Usuarios',
      'Configuración'
    ],
    submenuVisible: {
      'Inventario': ['Productos', 'Categorías', 'Lotes', 'Stock Crítico'],
      'Compras': ['Nueva Compra', 'Historial', 'Proveedores'],
      'Ventas': ['Nueva Venta', 'Historial', 'Clientes'],
      'Catálogos': ['Formas Farm.', 'Vías Admin.', 'Laboratorios', 'Métodos Pago'],
      'Reportes': ['Ventas', 'Inventario', 'Movimientos'],
      'Configuración': ['General', 'Roles']
    }
  },

  // ═══ VENDEDOR - Solo puede realizar ventas ═══
  VENDEDOR: {
    menuVisible: [
      'Dashboard',
      'Ventas'
    ],
    submenuVisible: {
      'Ventas': ['Nueva Venta', 'Historial', 'Clientes']
    }
  },

  // ═══ ALMACENERO - Solo gestiona inventario y compras ═══
  ALMACENERO: {
    menuVisible: [
      'Dashboard',
      'Inventario',
      'Compras'
    ],
    submenuVisible: {
      'Inventario': ['Productos', 'Categorías', 'Lotes', 'Stock Crítico'],
      'Compras': ['Nueva Compra', 'Historial', 'Proveedores']
    }
  }
};

/**
 * Verifica si un rol tiene permiso para ver un menú específico
 */
export const puedeVerMenu = (rol: string | undefined, menuName: string): boolean => {
  if (!rol) return false;
  
  // Normalizar el nombre del rol
  const rolNormalizado = rol.toUpperCase() as RoleName;
  
  // Si el rol no existe en la configuración, denegar acceso
  if (!PERMISOS_POR_ROL[rolNormalizado]) {
    console.warn(`⚠️ Rol desconocido: ${rol}`);
    return false;
  }

  const permisos = PERMISOS_POR_ROL[rolNormalizado];
  return permisos.menuVisible.includes(menuName);
};

/**
 * Verifica si un rol tiene permiso para ver un submenú específico
 */
export const puedeVerSubmenu = (
  rol: string | undefined, 
  menuName: string, 
  submenuName: string
): boolean => {
  if (!rol) return false;
  
  // Normalizar el nombre del rol
  const rolNormalizado = rol.toUpperCase() as RoleName;
  
  // Si el rol no existe en la configuración, denegar acceso
  if (!PERMISOS_POR_ROL[rolNormalizado]) {
    console.warn(`⚠️ Rol desconocido: ${rol}`);
    return false;
  }

  const permisos = PERMISOS_POR_ROL[rolNormalizado];
  const submenus = permisos.submenuVisible[menuName];
  
  if (!submenus) return false;
  
  return submenus.includes(submenuName);
};

/**
 * Obtiene el menú predeterminado para un rol
 * Útil para redireccionar al usuario a su vista principal
 */
export const getMenuPredeterminado = (rol: string | undefined): string => {
  if (!rol) return 'Dashboard';
  
  const rolNormalizado = rol.toUpperCase() as RoleName;
  
  if (!PERMISOS_POR_ROL[rolNormalizado]) {
    return 'Dashboard';
  }

  const permisos = PERMISOS_POR_ROL[rolNormalizado];
  
  // Si solo tiene acceso al Dashboard, retornar Dashboard
  if (permisos.menuVisible.length === 1 && permisos.menuVisible[0] === 'Dashboard') {
    return 'Dashboard';
  }
  
  // Si tiene acceso a Ventas, preferir Nueva Venta (para vendedores)
  if (permisos.menuVisible.includes('Ventas')) {
    const ventasSubmenus = permisos.submenuVisible['Ventas'];
    if (ventasSubmenus?.includes('Nueva Venta')) {
      return 'NuevaVenta';
    }
  }
  
  // Si tiene acceso a Inventario, preferir Productos (para almaceneros)
  if (permisos.menuVisible.includes('Inventario')) {
    const inventarioSubmenus = permisos.submenuVisible['Inventario'];
    if (inventarioSubmenus?.includes('Productos')) {
      return 'Productos';
    }
  }
  
  // Por defecto, retornar Dashboard
  return 'Dashboard';
};

/**
 * Verifica si un rol es administrador
 */
export const esAdministrador = (rol: string | undefined): boolean => {
  if (!rol) return false;
  return rol.toUpperCase() === 'ADMINISTRATIVO';
};

/**
 * Verifica si un rol es vendedor
 */
export const esVendedor = (rol: string | undefined): boolean => {
  if (!rol) return false;
  return rol.toUpperCase() === 'VENDEDOR';
};

/**
 * Verifica si un rol es almacenero
 */
export const esAlmacenero = (rol: string | undefined): boolean => {
  if (!rol) return false;
  return rol.toUpperCase() === 'ALMACENERO';
};

/**
 * Obtiene todos los paths permitidos para un rol
 * Útil para validar rutas
 */
export const getPathsPermitidos = (rol: string | undefined): string[] => {
  if (!rol) return ['Dashboard'];
  
  const rolNormalizado = rol.toUpperCase() as RoleName;
  
  if (!PERMISOS_POR_ROL[rolNormalizado]) {
    return ['Dashboard'];
  }

  const permisos = PERMISOS_POR_ROL[rolNormalizado];
  const paths: string[] = ['Dashboard']; // Dashboard siempre accesible
  
  // Agregar todos los submenus como paths
  Object.values(permisos.submenuVisible).forEach(submenus => {
    paths.push(...submenus.map(s => {
      // Convertir nombre de submenu a path
      return s.replace(/\s+/g, '').replace('.', '');
    }));
  });
  
  return paths;
};
