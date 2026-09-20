/**
 * Claves de caché centralizadas para TanStack Query.
 *
 * Se usan tanto en las hooks (`useAdminQueries`) como en la capa de
 * realtime (`lib/realtime.tsx`) para invalidar o actualizar tablas de
 * forma quirúrgica tras un evento del backend (Socket.io).
 */
export const queryKeys = {
  users: { all: ["users"] as const },
  products: {
    all: ["products"] as const,
    catalog: ["products", "catalog"] as const,
    management: ["products", "management"] as const,
  },
  categories: { all: ["categories"] as const },
  lotes: { all: ["lotes"] as const },
  suppliers: { all: ["suppliers"] as const },
  viasAdministracion: { all: ["viasAdministracion"] as const },
  formasFarmaceuticas: { all: ["formasFarmaceuticas"] as const },
  metodosPago: { all: ["metodosPago"] as const },
  laboratorios: { all: ["laboratorios"] as const },
  purchaseData: ["purchases", "data"] as const,
  purchaseHistory: ["purchases", "history"] as const,
  reportes: {
    ventas: ["reportes", "ventas"] as const,
    inventario: ["reportes", "inventario"] as const,
    movimientos: ["reportes", "movimientos"] as const,
  },
} as const;

export type QueryKeyTuple = readonly unknown[];

export default queryKeys;