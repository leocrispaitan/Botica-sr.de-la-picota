import api from './api';

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string | null;
  total_productos: number;
  estado_logico: boolean;
  fecha_registro: string;
}

interface GetCategoriesResponse {
  success: boolean;
  message: string;
  data: Categoria[];
}

export interface NewCategoriaInput {
  nombre_categoria: string;
  descripcion?: string;
  estado_logico?: boolean;
}

export interface ProductoEnCategoria {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  costo_referencial: number;
  stock_minimo_alerta: number;
  stock_actual: number;
  alerta_stock_bajo: boolean;
  estado_logico: boolean;
  fecha_registro: string;
}

export interface CategoriaDetalle extends Categoria {
  productos_activos: number;
  productos: ProductoEnCategoria[];
}

interface GetCategoryResponse {
  success: boolean;
  message: string;
  data: CategoriaDetalle;
}

interface CreateCategoryResponse {
  success: boolean;
  message: string;
  data: Categoria;
}

export const categoriesService = {
  /**
   * Obtener todas las categorías con conteo de productos
   */
  getAllCategories: async (): Promise<Categoria[]> => {
    const response = await api.get<GetCategoriesResponse>('/categories');
    return response.data.data;
  },

  /**
   * Obtener una categoría por ID con sus productos y stock real
   */
  getCategoryById: async (id: number): Promise<CategoriaDetalle> => {
    const response = await api.get<GetCategoryResponse>(`/categories/${id}`);
    return response.data.data;
  },

  /**
   * Crear una nueva categoría
   */
  createCategory: async (input: NewCategoriaInput): Promise<Categoria> => {
    const response = await api.post<CreateCategoryResponse>('/categories', input);
    return response.data.data;
  },

  /**
   * Actualizar una categoría existente
   */
  updateCategory: async (id: number, input: NewCategoriaInput): Promise<Categoria> => {
    const response = await api.put<CreateCategoryResponse>(`/categories/${id}`, input);
    return response.data.data;
  },

  /**
   * Eliminar (desactivar) una categoría
   */
  deleteCategory: async (id: number): Promise<Categoria> => {
    const response = await api.delete<CreateCategoryResponse>(`/categories/${id}`);
    return response.data.data;
  },
};

export default categoriesService;