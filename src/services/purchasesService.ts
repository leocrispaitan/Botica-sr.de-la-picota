import api from './api';

/* ─── Types ─────────────────────────────────────────────────────── */

export interface ProductoCompra {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  unidad_medida: string;
  costo_referencial: number;
  precio_venta: number;
  stock_actual: number;
  proveedor: {
    id_proveedor: number;
    nombre_proveedor: string;
  } | null;
}

export interface ProveedorCompra {
  id_proveedor: number;
  nombre_proveedor: string;
  ruc: string;
  telefono: string | null;
  email: string | null;
}

export interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo: string;
  descripcion: string | null;
}

export interface PurchaseDataResponse {
  productos: ProductoCompra[];
  proveedores: ProveedorCompra[];
  metodos_pago: MetodoPago[];
}

export interface PurchaseItemInput {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  numero_lote: string;
  fecha_vencimiento: string | null;
}

export interface CreatePurchaseInput {
  id_proveedor: number;
  fecha_compra: string;
  numero_documento: string;
  items: PurchaseItemInput[];
  subtotal: number;
  igv: number;
  total: number;
}

export interface DetalleMovimiento {
  id_detalle_mov: number;
  cantidad: number;
  costo_unitario: number;
  producto: {
    id_producto: number;
    nombre_comercial: string;
    nombre_generico: string;
    unidad_medida: string;
  } | null;
  inventario_lote: {
    id_inventario: number;
    numero_lote: string;
    fecha_vencimiento: string | null;
  } | null;
}

export interface CompraCompleta {
  id_movimiento: number;
  tipo_movimiento: string;
  fecha_hora: string;
  numero_documento: string | null;
  subtotal: number;
  igv: number;
  total: number;
  motivo_ajuste: string | null;
  proveedor: {
    id_proveedor: number;
    nombre_proveedor: string;
    ruc: string;
  } | null;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
  } | null;
  detalle_movimiento: DetalleMovimiento[];
}

export interface CompraHistorial {
  id_movimiento: number;
  tipo_movimiento: string;
  fecha_hora: string;
  numero_documento: string | null;
  subtotal: number;
  igv: number;
  total: number;
  proveedor: {
    id_proveedor: number;
    nombre_proveedor: string;
    ruc: string;
  } | null;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
  } | null;
  detalle_movimiento: {
    cantidad: number;
    costo_unitario: number;
    producto: {
      nombre_comercial: string;
    } | null;
  }[];
}

interface GetPurchaseDataResponse {
  success: boolean;
  message: string;
  data: PurchaseDataResponse;
}

interface CreatePurchaseResponse {
  success: boolean;
  message: string;
  data: CompraCompleta;
}

interface GetHistoryResponse {
  success: boolean;
  message: string;
  data: {
    compras: CompraHistorial[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    stats: {
      total_compras: number;
      total_monto: number;
      total_productos: number;
      proveedores: number;
    };
  };
}

interface GetPurchaseByIdResponse {
  success: boolean;
  message: string;
  data: CompraCompleta;
}

/* ─── Service ─────────────────────────────────────────────────────── */

export const purchasesService = {
  /**
   * Obtener datos para el formulario de nueva compra
   * (productos con stock, proveedores, métodos de pago)
   */
  getPurchaseData: async (): Promise<PurchaseDataResponse> => {
    const response = await api.get<GetPurchaseDataResponse>('/purchases/data');
    return response.data.data;
  },

  /**
   * Registrar una nueva compra
   */
  createPurchase: async (input: CreatePurchaseInput): Promise<CompraCompleta> => {
    const response = await api.post<CreatePurchaseResponse>('/purchases', input);
    return response.data.data;
  },

  /**
   * Obtener historial de compras con paginación y filtros (server-side)
   */
  getPurchaseHistory: async (
    params: {
      page?: number;
      limit?: number;
      search?: string;
      proveedor?: number;
      desde?: string;
      hasta?: string;
    } = {}
  ) => {
    const response = await api.get<GetHistoryResponse>('/purchases', {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        search: params.search || undefined,
        proveedor: params.proveedor || undefined,
        desde: params.desde || undefined,
        hasta: params.hasta || undefined,
      },
    });
    return response.data.data;
  },

  /**
   * Obtener detalle de una compra por ID
   */
  getPurchaseById: async (id: number): Promise<CompraCompleta> => {
    const response = await api.get<GetPurchaseByIdResponse>(`/purchases/${id}`);
    return response.data.data;
  },
};

export default purchasesService;
