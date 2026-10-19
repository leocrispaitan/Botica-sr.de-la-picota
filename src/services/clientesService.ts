import api from './api';

export interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombre_razon_social: string;
  telefono?: string | null;
  email?: string | null;
  direccion?: string | null;
  estado_logico: boolean;
  fecha_registro: string;
  total_compras?: number;
  monto_total?: number;
}

interface GetClientesResponse {
  success: boolean;
  message: string;
  data: Cliente[];
  total?: number;
  page?: number;
  limit?: number;
}

interface GetClienteResponse {
  success: boolean;
  message: string;
  data: Cliente;
}

export const clientesService = {
  search: async (search = '', limit = 20): Promise<Cliente[]> => {
    const response = await api.get<GetClientesResponse>('/clientes', { params: { search, limit } });
    return response.data.data;
  },

  getAll: async (params?: { search?: string; estado?: string; page?: number; limit?: number }): Promise<{ data: Cliente[]; total: number }> => {
    const response = await api.get<GetClientesResponse>('/clientes/all', { params });
    return { data: response.data.data, total: response.data.total || response.data.data.length };
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await api.get<GetClienteResponse>(`/clientes/${id}`);
    return response.data.data;
  },

  create: async (payload: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.post<GetClienteResponse>('/clientes', payload);
    return response.data.data;
  },

  update: async (id: number, payload: Partial<Cliente>): Promise<Cliente> => {
    const response = await api.put<GetClienteResponse>(`/clientes/${id}`, payload);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/clientes/${id}`);
  },
};

export default clientesService;
