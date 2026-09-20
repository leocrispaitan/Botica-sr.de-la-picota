import { QueryClient } from "@tanstack/react-query";

/**
 * Cliente central de TanStack Query.
 *
 * Configuración pensada para pantallas tipo "panel administrativo":
 * - `staleTime`: los datos se consideran frescos 5 minutos. Navegar entre módulos
 *   ya cargados NO dispara nuevas peticiones HTTP mientras la caché siga fresca →
 *   la navegación se siente instantánea, sin el indicador de "Cargando...".
 * - `refetchOnWindowFocus: false`: evita re-fetches sorpresa al cambiar de pestaña/ventana.
 * - `refetchOnMount` (default): si la caché está "stale" se revalida en segundo plano,
 *   pero la UI muestra la información cacheada de inmediato (sin parpadeo).
 * - `retry: 1`: reintento único ante errores transitorios de red.
 * - `gcTime`: la caché descartada tras 30 min sin uso.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos de frescura
      gcTime: 30 * 60 * 1000, // 30 minutos en caché
      refetchOnWindowFocus: false,
      retry: 1,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
    },
    mutations: {
      retry: 0,
    },
  },
});

export default queryClient;