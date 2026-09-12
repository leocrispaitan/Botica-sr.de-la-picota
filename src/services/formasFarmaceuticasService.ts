import api from './api';

export interface FormaFarmaceutica {
  id_forma_farmaceutica: number;
  nombre: string;
  estado_logico: boolean;
  fecha_registro: string;
  total_productos?: number;
  productos?: FormaFarmaceuticaProducto[];
}

export interface FormaFarmaceuticaProducto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  estado_logico: boolean;
}

export interface NewFormaFarmaceuticaInput {
  nombre: string;
  estado_logico?: boolean;
}

interface GetFormasResponse {
  success: boolean;
  message: string;
  data: FormaFarmaceutica[];
}

interface GetFormaResponse {
  success: boolean;
  message: string;
  data: FormaFarmaceutica;
}

interface FormaResponse {
  success: boolean;
  message: string;
  data: FormaFarmaceutica;
}

export const formasFarmaceuticasService = {
  /**
   * Obtener todas las formas farmacéuticas con conteo de productos
   */
  getAllFormasFarmaceuticas: async (): Promise<FormaFarmaceutica[]> => {
    const response = await api.get<GetFormasResponse>('/formas-farmaceuticas');
    return response.data.data;
  },

  /**
   * Obtener una forma farmacéutica por ID con sus productos asociados
   */
  getFormaFarmaceuticaById: async (id: number): Promise<FormaFarmaceutica> => {
    const response = await api.get<GetFormaResponse>(`/formas-farmaceuticas/${id}`);
    return response.data.data;
  },

  /**
   * Crear una nueva forma farmacéutica
   */
  createFormaFarmaceutica: async (input: NewFormaFarmaceuticaInput): Promise<FormaFarmaceutica> => {
    const response = await api.post<FormaResponse>('/formas-farmaceuticas', input);
    return response.data.data;
  },

  /**
   * Actualizar una forma farmacéutica existente
   */
  updateFormaFarmaceutica: async (
    id: number,
    input: NewFormaFarmaceuticaInput
  ): Promise<FormaFarmaceutica> => {
    const response = await api.put<FormaResponse>(`/formas-farmaceuticas/${id}`, input);
    return response.data.data;
  },

  /**
   * Eliminar lógicamente una forma farmacéutica (soft delete: estado_logico = false)
   */
  deleteFormaFarmaceutica: async (id: number): Promise<FormaFarmaceutica> => {
    const response = await api.delete<FormaResponse>(`/formas-farmaceuticas/${id}`);
    return response.data.data;
  },
};

export default formasFarmaceuticasService;