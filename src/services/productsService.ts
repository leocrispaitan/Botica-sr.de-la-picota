import api from './api';

export interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

export interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  ruc: string;
}

export interface FormaFarmaceutica {
  id_forma_farmaceutica: number;
  nombre: string;
}

export interface CondicionVenta {
  id_condicion_venta: number;
  nombre: string;
  requiere_receta: boolean;
}

export interface ViaAdministracion {
  id_via_administracion: number;
  nombre: string;
}

export interface ClasificacionATC {
  codigo_atc: string;
  descripcion: string;
}

export interface Laboratorio {
  id_laboratorio: number;
  nombre: string;
  pais: string | null;
}

export interface Producto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  unidad_medida: string;
  composicion: string | null;
  presentacion: string | null;
  precio_venta: number;
  costo_referencial: number;
  stock_minimo_alerta: number;
  stock_actual: number;
  imagen_url: string | null;
  id_categoria: number;
  id_proveedor: number;
  id_forma_farmaceutica: number | null;
  id_via_administracion: number | null;
  id_condicion_venta: number | null;
  codigo_atc: string | null;
  id_laboratorio_titular: number | null;
  id_fabricante: number | null;
  estado_logico: boolean;
  fecha_registro: string;
  categoria?: Categoria | null;
  proveedor?: Proveedor | null;
  forma_farmaceutica?: FormaFarmaceutica | null;
  condicion_venta?: CondicionVenta | null;
  via_administracion?: ViaAdministracion | null;
  clasificacion_atc?: ClasificacionATC | null;
  laboratorio_titular?: Laboratorio | null;
  fabricante?: Laboratorio | null;
}

export interface ProductCatalog {
  categorias: Categoria[];
  condiciones_venta: CondicionVenta[];
  proveedores: Proveedor[];
  formas_farmaceuticas: FormaFarmaceutica[];
  vias_administracion: ViaAdministracion[];
  laboratorios: Laboratorio[];
  clasificaciones_atc: ClasificacionATC[];
}

export interface NewProductoInput {
  nombre_comercial: string;
  nombre_generico: string;
  unidad_medida: string;
  composicion?: string;
  presentacion?: string;
  precio_venta: number;
  costo_referencial: number;
  stock_minimo_alerta: number;
  imagen_url?: string;
  id_categoria: number;
  id_proveedor: number;
  id_forma_farmaceutica?: number;
  id_via_administracion?: number;
  id_condicion_venta?: number;
  codigo_atc?: string;
  id_laboratorio_titular?: number;
  id_fabricante?: number;
}

interface GetProductsResponse {
  success: boolean;
  message: string;
  data: Producto[];
}

interface GetCatalogResponse {
  success: boolean;
  message: string;
  data: ProductCatalog;
}

interface CreateProductResponse {
  success: boolean;
  message: string;
  data: Producto;
}

export const productsService = {
  /**
   * Obtener todos los productos con stock real
   */
  getAllProducts: async (): Promise<Producto[]> => {
    const response = await api.get<GetProductsResponse>('/products');
    return response.data.data;
  },

  /**
   * Obtener catálogos para filtros y formularios
   */
  getProductCatalog: async (): Promise<ProductCatalog> => {
    const response = await api.get<GetCatalogResponse>('/products/catalog');
    return response.data.data;
  },

  /**
   * Crear un nuevo producto
   */
  createProduct: async (producto: NewProductoInput): Promise<Producto> => {
    const response = await api.post<CreateProductResponse>('/products', producto);
    return response.data.data;
  },
};

export default productsService;