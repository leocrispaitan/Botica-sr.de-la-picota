import api from './api';

export interface VentaItemInput {
  id_producto: number;
  cantidad: number;
  /** Presentación elegida (TAB/BL/CJ/...). El precio y factor los resuelve el servidor. */
  codigo_presentacion?: string;
}

export interface CreateVentaInput {
  id_cliente?: number | null;
  /** DNI validado (8 dígitos). Si no existe, el backend crea el cliente. */
  dni_cliente?: string | null;
  nombre_cliente?: string | null;
  id_metodo_pago: number;
  tipo_comprobante: 'BOLETA' | 'FACTURA' | 'TICKET';
  monto_pagado?: number;
  items: VentaItemInput[];
}

export interface VentaDetalle {
  id_detalle_venta: number;
  cantidad: number;
  precio_unitario_venta: number;
  subtotal: number;
  producto?: { id_producto: number; nombre_comercial: string; nombre_generico: string } | null;
}

export interface Venta {
  id_venta: number;
  fecha_venta: string;
  tipo_comprobante: string;
  total_pagar: number;
  monto_pagado: number;
  vuelto: number;
  estado_venta: string;
  items?: number;
  cliente?: { id_cliente: number; nombre_razon_social: string; numero_documento?: string } | null;
  metodo_pago?: { nombre_metodo: string } | null;
  usuario?: { id_usuario: number; nombre_completo: string } | null;
  detalle_venta?: VentaDetalle[];
}

interface CreateVentaResponse {
  success: boolean;
  message: string;
  data: Venta;
}

interface GetVentasResponse {
  success: boolean;
  message: string;
  data: Venta[];
  pagination?: { page: number; limit: number; total: number };
}

export interface DniValidado {
  dni: string;
  nombreCompleto: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

export const ventasService = {
  createVenta: async (input: CreateVentaInput): Promise<Venta> => {
    const response = await api.post<CreateVentaResponse>('/ventas', input, { timeout: 30000 });
    return response.data.data;
  },

  /** Valida DNI con AQPFACT vía backend (el token nunca sale del servidor). */
  validarDni: async (dni: string): Promise<DniValidado> => {
    const response = await api.post<{ success: boolean; message: string; data: DniValidado }>(
      '/validar-dni',
      { dni },
      { timeout: 20000 }
    );
    return response.data.data;
  },

  getHistorialTurno: async (): Promise<Venta[]> => {
    const response = await api.get<GetVentasResponse>('/ventas', { params: { today: 1, limit: 50 } });
    return response.data.data;
  },

  getVentaById: async (id: number): Promise<Venta> => {
    const response = await api.get<{ success: boolean; message: string; data: Venta }>(`/ventas/${id}`);
    return response.data.data;
  },
};

export default ventasService;
