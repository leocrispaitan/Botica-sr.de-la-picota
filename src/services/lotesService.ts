import api from './api';

export interface ProductoEnLote {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
}

export type EstadoVencimiento = "vigente" | "proximo" | "vencido";

export interface Lote {
  id_inventario: number;
  id_producto: number;
  numero_lote: string;
  fecha_vencimiento: string | null;
  fecha_ingreso: string;
  costo_unitario_compra: number;
  stock_lote: number;
  ubicacion_estante: string | null;
  producto: ProductoEnLote;
  dias_para_vencer: number | null;
  estado_vencimiento: EstadoVencimiento;
}

interface GetLotesResponse {
  success: boolean;
  message: string;
  data: Lote[];
}

export interface NewLoteInput {
  id_producto: number;
  numero_lote: string;
  fecha_vencimiento?: string | null;
  costo_unitario_compra: number;
  stock_lote: number;
  ubicacion_estante?: string | null;
}

interface CreateLotesResponse {
  success: boolean;
  message: string;
  data: Lote;
}

export const lotesService = {
  /**
   * Obtener todos los lotes con su producto y estado de vencimiento
   */
  getAllLotes: async (): Promise<Lote[]> => {
    const response = await api.get<GetLotesResponse>('/lotes');
    return response.data.data;
  },

  /**
   * Registrar un nuevo lote en el inventario
   */
  createLote: async (input: NewLoteInput): Promise<Lote> => {
    const response = await api.post<CreateLotesResponse>('/lotes', input);
    return response.data.data;
  },
};

export default lotesService;