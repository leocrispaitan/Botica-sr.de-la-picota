import api from './api';

export interface ViaAdministracion {
  id_via_administracion: number;
  nombre: string;
  estado_logico: boolean;
  fecha_registro: string;
  total_productos?: number;
  productos?: ViaAdministracionProducto[];
}

export interface ViaAdministracionProducto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  estado_logico: boolean;
}

export interface NewViaAdministracionInput {
  nombre: string;
  estado_logico?: boolean;
}

interface GetViasResponse {
  success: boolean;
  message: string;
  data: ViaAdministracion[];
}

interface GetViaResponse {
  success: boolean;
  message: string;
  data: ViaAdministracion;
}

interface ViaResponse {
  success: boolean;
  message: string;
  data: ViaAdministracion;
}

export const viasAdministracionService = {
  /**
   * Obtener todas las vías de administración con conteo de productos
   */
  getAllViasAdministracion: async (): Promise<ViaAdministracion[]> => {
    const response = await api.get<GetViasResponse>('/vias-administracion');
    return response.data.data;
  },

  /**
   * Obtener una vía de administración por ID con sus productos asociados
   */
  getViaAdministracionById: async (id: number): Promise<ViaAdministracion> => {
    const response = await api.get<GetViaResponse>(`/vias-administracion/${id}`);
    return response.data.data;
  },

  /**
   * Crear una nueva vía de administración
   */
  createViaAdministracion: async (input: NewViaAdministracionInput): Promise<ViaAdministracion> => {
    const response = await api.post<ViaResponse>('/vias-administracion', input);
    return response.data.data;
  },

  /**
   * Actualizar una vía de administración existente
   */
  updateViaAdministracion: async (
    id: number,
    input: NewViaAdministracionInput
  ): Promise<ViaAdministracion> => {
    const response = await api.put<ViaResponse>(`/vias-administracion/${id}`, input);
    return response.data.data;
  },

  /**
   * Eliminar lógicamente una vía de administración (soft delete: estado_logico = false)
   */
  deleteViaAdministracion: async (id: number): Promise<ViaAdministracion> => {
    const response = await api.delete<ViaResponse>(`/vias-administracion/${id}`);
    return response.data.data;
  },
};

export default viasAdministracionService;