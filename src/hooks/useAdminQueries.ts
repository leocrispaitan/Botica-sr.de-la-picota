import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { usersService } from "../services/usersService";
import { productsService } from "../services/productsService";
import { categoriesService } from "../services/categoriesService";
import { lotesService } from "../services/lotesService";
import { suppliersService } from "../services/suppliersService";
import { viasAdministracionService } from "../services/viasAdministracionService";
import { formasFarmaceuticasService } from "../services/formasFarmaceuticasService";
import { metodosPagoService } from "../services/metodosPagoService";
import { laboratoriosService } from "../services/laboratoriosService";
import { purchasesService } from "../services/purchasesService";
import { reportesService } from "../services/reportesService";
import { queryKeys } from "../lib/queryKeys";

/* ═══════════════════════════════════════════════════════════════════
 *  Hooks de consulta (TanStack Query)
 *
 *  Cada hook equivale al "loadX()" que los componentes ejecutaban en su
 *  `useEffect` de montaje. Al estar cacheada la petición, volver a
 *  navegar al módulo NO dispara un fetch nuevo (staleTime 5 min), por lo
 *  que la tabla aparece al instante sin el indicador de "Cargando...".
 * ═══════════════════════════════════════════════════════════════════ */

export function useUsersQuery() {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => usersService.getAllUsers(),
  });
}

export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: () => productsService.getAllProducts(),
  });
}

export function useProductCatalogQuery() {
  return useQuery({
    queryKey: queryKeys.products.catalog,
    queryFn: () => productsService.getProductCatalog(),
  });
}

/** Consulta combinada usada por ProductsManagement (productos + catálogo). */
export function useProductsManagementQuery() {
  return useQuery({
    queryKey: ["products", "management"] as const,
    queryFn: async () => {
      const [productos, catalogo] = await Promise.all([
        productsService.getAllProducts(),
        productsService.getProductCatalog(),
      ]);
      return { productos, catalogo };
    },
  });
}

export function useCategoriesQuery() {
  return useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: () => categoriesService.getAllCategories(),
  });
}

export function useLotesQuery() {
  return useQuery({
    queryKey: queryKeys.lotes.all,
    queryFn: () => lotesService.getAllLotes(),
  });
}

export function useSuppliersQuery() {
  return useQuery({
    queryKey: queryKeys.suppliers.all,
    queryFn: () => suppliersService.getAllSuppliers(),
  });
}

export function useViasAdministracionQuery() {
  return useQuery({
    queryKey: queryKeys.viasAdministracion.all,
    queryFn: () => viasAdministracionService.getAllViasAdministracion(),
  });
}

export function useFormasFarmaceuticasQuery() {
  return useQuery({
    queryKey: queryKeys.formasFarmaceuticas.all,
    queryFn: () => formasFarmaceuticasService.getAllFormasFarmaceuticas(),
  });
}

export function useMetodosPagoQuery() {
  return useQuery({
    queryKey: queryKeys.metodosPago.all,
    queryFn: () => metodosPagoService.getAllMetodosPago(),
  });
}

export function useLaboratoriosQuery() {
  return useQuery({
    queryKey: queryKeys.laboratorios.all,
    queryFn: () => laboratoriosService.getAllLaboratorios(),
  });
}

/* ─── Compras ────────────────────────────────────────────────────── */

/** Datos del formulario de nueva compra (productos, proveedores, métodos). */
export function usePurchaseDataQuery() {
  return useQuery({
    queryKey: queryKeys.purchaseData,
    queryFn: () => purchasesService.getPurchaseData(),
  });
}

export interface PurchaseHistoryFilters {
  page: number;
  limit: number;
  search?: string;
  proveedor?: number;
  desde?: string;
  hasta?: string;
}

/** Historial de compras con paginación/filtros server-side, sin parpadeos. */
export function usePurchaseHistoryQuery(filters: PurchaseHistoryFilters) {
  return useQuery({
    queryKey: [queryKeys.purchaseHistory, filters] as const,
    queryFn: () =>
      purchasesService.getPurchaseHistory({
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        proveedor: filters.proveedor,
        desde: filters.desde,
        hasta: filters.hasta,
      }),
    placeholderData: keepPreviousData,
  });
}

/* ─── Reportes ───────────────────────────────────────────────────── */

export function useReporteVentasQuery(
  desde?: string,
  hasta?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.reportes.ventas, { desde, hasta }] as const,
    queryFn: () => reportesService.getReporteVentas(desde, hasta),
    ...options,
  });
}

export function useReporteInventarioQuery(
  desde?: string,
  hasta?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.reportes.inventario, { desde, hasta }] as const,
    queryFn: () => reportesService.getReporteInventario(desde, hasta),
    ...options,
  });
}

export function useReporteMovimientosQuery(
  desde?: string,
  hasta?: string,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: [...queryKeys.reportes.movimientos, { desde, hasta }] as const,
    queryFn: () => reportesService.getReporteMovimientos(desde, hasta),
    ...options,
  });
}