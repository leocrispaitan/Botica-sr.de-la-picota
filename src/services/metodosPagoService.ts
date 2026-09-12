import api from './api';

export interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo: string;
  descripcion: string | null;
  estado_logico: boolean;
  fecha_registro: string;
  total_ventas?: number;
  ventas?: MetodoPagoVenta[];
}

export interface MetodoPagoVenta {
  id_venta: number;
  fecha_venta: string;
  total_pagar: number;
  estado_venta: string;
}

export interface NewMetodoPagoInput {
  nombre_metodo: string;
  descripcion?: string | null;
  estado_logico?: boolean;
}

interface GetMetodosResponse {
  success: boolean;
  message: string;
  data: MetodoPago[];
}

interface GetMetodoResponse {
  success: boolean;
  message: string;
  data: MetodoPago;
}

interface MetodoResponse {
  success: boolean;
  message: string;
  data: MetodoPago;
}

export const metodosPagoService = {
  /**
   * Obtener todos los métodos de pago con conteo de ventas
   */
  getAllMetodosPago: async (): Promise<MetodoPago[]> => {
    const response = await api.get<GetMetodosResponse>('/metodos-pago');
    return response.data.data;
  },

  /**
   * Obtener un método de pago por ID con sus ventas asociadas
   */
  getMetodoPagoById: async (id: number): Promise<MetodoPago> => {
    const response = await api.get<GetMetodoResponse>(`/metodos-pago/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo método de pago
   */
  createMetodoPago: async (input: NewMetodoPagoInput): Promise<MetodoPago> => {
    const response = await api.post<MetodoResponse>('/metodos-pago', input);
    return response.data.data;
  },

  /**
   * Actualizar un método de pago existente
   */
  updateMetodoPago: async (
    id: number,
    input: NewMetodoPagoInput
  ): Promise<MetodoPago> => {
    const response = await api.put<MetodoResponse>(`/metodos-pago/${id}`, input);
    return response.data.data;
  },

  /**
   * Eliminar lógicamente un método de pago (soft delete: estado_logico = false)
   */
  deleteMetodoPago: async (id: number): Promise<MetodoPago> => {
    const response = await api.delete<MetodoResponse>(`/metodos-pago/${id}`);
    return response.data.data;
  },
};

export default metodosPagoService;