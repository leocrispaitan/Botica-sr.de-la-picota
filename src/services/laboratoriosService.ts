import api from './api';

export interface Laboratorio {
  id_laboratorio: number;
  nombre: string;
  pais: string | null;
  tipo_entidad: string | null;
  estado_logico: boolean;
  fecha_registro: string;
  total_productos?: number;
  productos?: LaboratorioProducto[];
}

export interface LaboratorioProducto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  estado_logico: boolean;
  rol: string;
}

export interface NewLaboratorioInput {
  nombre: string;
  pais?: string | null;
  tipo_entidad?: string | null;
  estado_logico?: boolean;
}

interface GetLaboratoriosResponse {
  success: boolean;
  message: string;
  data: Laboratorio[];
}

interface GetLaboratorioResponse {
  success: boolean;
  message: string;
  data: Laboratorio;
}

interface LaboratorioResponse {
  success: boolean;
  message: string;
  data: Laboratorio;
}

export const laboratoriosService = {
  /**
   * Obtener todos los laboratorios con conteo de productos
   */
  getAllLaboratorios: async (): Promise<Laboratorio[]> => {
    const response = await api.get<GetLaboratoriosResponse>('/laboratorios');
    return response.data.data;
  },

  /**
   * Obtener un laboratorio por ID con sus productos asociados
   */
  getLaboratorioById: async (id: number): Promise<Laboratorio> => {
    const response = await api.get<GetLaboratorioResponse>(`/laboratorios/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo laboratorio
   */
  createLaboratorio: async (input: NewLaboratorioInput): Promise<Laboratorio> => {
    const response = await api.post<LaboratorioResponse>('/laboratorios', input);
    return response.data.data;
  },

  /**
   * Actualizar un laboratorio existente
   */
  updateLaboratorio: async (
    id: number,
    input: NewLaboratorioInput
  ): Promise<Laboratorio> => {
    const response = await api.put<LaboratorioResponse>(`/laboratorios/${id}`, input);
    return response.data.data;
  },

  /**
   * Eliminar lógicamente un laboratorio (soft delete: estado_logico = false)
   */
  deleteLaboratorio: async (id: number): Promise<Laboratorio> => {
    const response = await api.delete<LaboratorioResponse>(`/laboratorios/${id}`);
    return response.data.data;
  },
};

export default laboratoriosService;