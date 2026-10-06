import api from './api';

export interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombre_razon_social: string;
  telefono?: string | null;
  email?: string | null;
}

interface GetClientesResponse {
  success: boolean;
  message: string;
  data: Cliente[];
}

export const clientesService = {
  search: async (search = '', limit = 20): Promise<Cliente[]> => {
    const response = await api.get<GetClientesResponse>('/clientes', { params: { search, limit } });
    return response.data.data;
  },
};

export default clientesService;
