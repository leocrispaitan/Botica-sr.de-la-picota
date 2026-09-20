import { useEffect } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";
import { queryKeys, type QueryKeyTuple } from "./queryKeys";

/* ═══════════════════════════════════════════════════════════════════
 *  Capa de tiempo real (Socket.io)
 *
 *  El backend emite eventos `realtime:change` con la forma
 *  `{ entity, action, record }` después de cada mutación exitosa.
 *
 *  Este módulo:
 *   1. Conecta el socket del cliente contra el backend.
 *   2. Escucha los eventos y actualiza la caché de TanStack Query de
 *      forma QUIRÚRGICA (setQueryData), sin peticiones de recarga
 *      completa. Ej.: un producto actualizado se reemplaza dentro del
 *      array cacheado, una categoría eliminada se filtra, etc.
 *   3. Para caches derivadas (catálogo de productos, historial de
 *      compras, reportes) invalida la consulta en segundo plano.
 * ═══════════════════════════════════════════════════════════════════ */

const API_URL: string = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

// Derivar la base del backend a partir del URL de la API:
//   http://localhost:5000/api/v1  →  http://localhost:5000
const SOCKET_URL: string = API_URL.replace(/\/+$/, "").replace(/\/api\/v\d+\/?$/i, "");

export const realtimeSocket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 10000,
});

export type RealtimeAction =
  | "created"
  | "updated"
  | "deleted"
  | "activated"
  | "desactivated";

export interface RealtimeChange {
  entity: string;
  action: RealtimeAction;
  record?: Record<string, unknown>;
}

interface EntityRealtimeConfig {
  /** Caches de lista que se pueden actualizar quirúrgicamente. */
  keys: QueryKeyTuple[];
  /** Caches derivadas que se invalidan en segundo plano. */
  related: QueryKeyTuple[];
}

/** Mapeo entidad → claves de caché (validado contra la capa `useAdminQueries`). */
const ENTITY_CONFIG: Record<string, EntityRealtimeConfig> = {
  users: { keys: [queryKeys.users.all], related: [] },
  products: {
    keys: [queryKeys.products.all],
    related: [queryKeys.products.catalog, queryKeys.products.management],
  },
  categories: { keys: [queryKeys.categories.all], related: [] },
  lotes: { keys: [queryKeys.lotes.all], related: [] },
  suppliers: { keys: [queryKeys.suppliers.all], related: [] },
  viasAdministracion: { keys: [queryKeys.viasAdministracion.all], related: [] },
  formasFarmaceuticas: { keys: [queryKeys.formasFarmaceuticas.all], related: [] },
  metodosPago: { keys: [queryKeys.metodosPago.all], related: [] },
  laboratorios: { keys: [queryKeys.laboratorios.all], related: [] },
  purchases: { keys: [], related: [queryKeys.purchaseData, queryKeys.purchaseHistory] },
};

/** Número de identificación de cada entidad (para el upsert/delete). */
const ENTITY_ID_FIELD: Record<string, string> = {
  users: "id_usuario",
  products: "id_producto",
  categories: "id_categoria",
  lotes: "id_inventario",
  suppliers: "id_proveedor",
  viasAdministracion: "id_via_administracion",
  formasFarmaceuticas: "id_forma_farmaceutica",
  metodosPago: "id_metodo_pago",
  laboratorios: "id_laboratorio",
};

function applyRealtimeChange(client: QueryClient, event: RealtimeChange): void {
  const { entity, action, record } = event;
  const config = ENTITY_CONFIG[entity];
  if (!config) return;

  const idField = ENTITY_ID_FIELD[entity];

  // ── Borrar: filtrar el registro fuera de cada lista cacheada ──
  if (action === "deleted") {
    if (record && idField) {
      const removedId = record[idField];
      for (const key of config.keys) {
        const list = client.getQueryData<Record<string, unknown>[]>(key);
        if (!list) continue;
        client.setQueryData(
          key,
          list.filter((item) => item[idField] !== removedId)
        );
      }
    }
  } else if (record) {
    // ── Crear / actualizar / activar / desactivar: upsert quirúrgico ──
    for (const key of config.keys) {
      const list = client.getQueryData<Record<string, unknown>[]>(key);
      if (!list) continue;

      if (action === "created") {
        client.setQueryData(key, [record, ...list]);
        continue;
      }

      if (!idField) continue;
      const id = record[idField];
      const index = list.findIndex((item) => item[idField] === id);
      if (index >= 0) {
        client.setQueryData(
          key,
          list.map((item, i) => (i === index ? { ...item, ...record } : item))
        );
      } else {
        client.setQueryData(key, [record, ...list]);
      }
    }
  }

  // ── Caches derivadas: invalidar en segundo plano ──
  if (config.related.length > 0) {
    for (const key of config.related) {
      void client.invalidateQueries({ queryKey: key });
    }
  }
}

/**
 * Proveedor de tiempo real. Se monta UNA vez en `main.tsx` junto al
 * `QueryClientProvider`; escucha los eventos del backend y mantiene la
 * caché sincronizada sin recargas completas de las tablas.
 */
export function RealtimeProvider(): null {
  const client = useQueryClient();

  useEffect(() => {
    const handler = (event: RealtimeChange) => applyRealtimeChange(client, event);
    realtimeSocket.on("realtime:change", handler);

    if (!realtimeSocket.connected) {
      realtimeSocket.connect();
    }

    return () => {
      realtimeSocket.off("realtime:change", handler);
      realtimeSocket.disconnect();
    };
  }, [client]);

  return null;
}