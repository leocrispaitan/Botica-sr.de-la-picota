import api from './api';

export interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  ruc: string;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  estado_logico: boolean;
  fecha_registro: string;
  total_compras?: number;
  monto_total_comprado?: number;
  productos?: ProveedorProducto[];
}

export interface ProveedorProducto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  estado_logico: boolean;
}

export interface NewProveedorInput {
  nombre_proveedor: string;
  ruc: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  estado_logico?: boolean;
}

interface GetSuppliersResponse {
  success: boolean;
  message: string;
  data: Proveedor[];
}

interface GetSupplierResponse {
  success: boolean;
  message: string;
  data: Proveedor;
}

interface SupplierResponse {
  success: boolean;
  message: string;
  data: Proveedor;
}

export const suppliersService = {
  /**
   * Obtener todos los proveedores con estadísticas reales de compras
   */
  getAllSuppliers: async (): Promise<Proveedor[]> => {
    const response = await api.get<GetSuppliersResponse>('/suppliers');
    return response.data.data;
  },

  /**
   * Obtener un proveedor por ID con sus productos asociados
   */
  getSupplierById: async (id: number): Promise<Proveedor> => {
    const response = await api.get<GetSupplierResponse>(`/suppliers/${id}`);
    return response.data.data;
  },

  /**
   * Crear un nuevo proveedor
   */
  createSupplier: async (proveedor: NewProveedorInput): Promise<Proveedor> => {
    const response = await api.post<SupplierResponse>('/suppliers', proveedor);
    return response.data.data;
  },

  /**
   * Actualizar un proveedor existente
   */
  updateSupplier: async (id: number, proveedor: NewProveedorInput): Promise<Proveedor> => {
    const response = await api.put<SupplierResponse>(`/suppliers/${id}`, proveedor);
    return response.data.data;
  },

  /**
   * Eliminar lógicamente un proveedor (soft delete: estado_logico = false)
   */
  deleteSupplier: async (id: number): Promise<Proveedor> => {
    const response = await api.delete<SupplierResponse>(`/suppliers/${id}`);
    return response.data.data;
  },
};

export default suppliersService;