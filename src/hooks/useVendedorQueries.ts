import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import categoriesService from "../services/categoriesService";
import productsService from "../services/productsService";
import clientesService from "../services/clientesService";
import ventasService from "../services/ventasService";
import { queryKeys } from "../lib/queryKeys";

/* ═══════════════════════════════════════════════════════════════════
 *  Hooks del POS vendedor (mismo flujo que admin)
 *
 *  TanStack Query cachea cada petición 5 min (ver lib/queryClient):
 *  cambiar entre Menú / Orden / Historial / Clientes / Perfil muestra
 *  los datos cacheados al instante, sin "Cargando..." ni refetch.
 *  El backend emite `realtime:change` (ventas, productos, clientes) y
 *  lib/realtime invalida estas cachés en segundo plano → tiempo real
 *  sin recargar la página.
 * ═══════════════════════════════════════════════════════════════════ */

/** Catálogo del mostrador: categorías + productos con presentaciones y stock. */
export function usePosCatalogQuery() {
  return useQuery({
    queryKey: queryKeys.pos.catalog,
    queryFn: async () => {
      const [categorias, productos] = await Promise.all([
        categoriesService.getAllCategories(),
        productsService.getAllProducts(),
      ]);
      return { categorias, productos };
    },
  });
}

/** Ventas del turno del vendedor autenticado (compartida por Historial y Perfil). */
export function useVentasTurnoQuery() {
  return useQuery({
    queryKey: queryKeys.ventas.turno,
    queryFn: () => ventasService.getHistorialTurno(),
  });
}

/** Timeline del vendedor: todas sus ventas (límite 100, las más recientes). */
export function useVentasTimelineQuery() {
  return useQuery({
    queryKey: ["ventas", "timeline"] as const,
    queryFn: () => ventasService.getHistorial({ today: false, limit: 100 }),
  });
}

/** Buscador de clientes del POS. Mantiene el texto anterior mientras escribe. */
export function useClientesSearchQuery(search: string, limit = 12, enabled = true) {
  const q = search.trim();
  return useQuery({
    queryKey: ["clientes", "search", q, limit] as const,
    queryFn: () => clientesService.search(q, limit),
    placeholderData: keepPreviousData,
    enabled,
  });
}

/** Invalida lo que cambia tras cobrar: historial, catálogo (stock) y clientes. */
export function useInvalidarTrasVenta() {
  const client = useQueryClient();
  return () => {
    void client.invalidateQueries({ queryKey: queryKeys.ventas.turno });
    void client.invalidateQueries({ queryKey: queryKeys.pos.catalog });
    void client.invalidateQueries({ queryKey: queryKeys.clientes.searchPrefix });
  };
}
