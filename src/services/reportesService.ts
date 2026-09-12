import api from "./api";

export interface ReporteRango {
  desde: string | null;
  hasta: string | null;
  dias: number | null;
  periodo_completo: boolean;
}

export interface ReporteKpis {
  total_ingresos: number;
  total_ventas: number;
  ticket_promedio: number;
  unidades_vendidas: number;
  clientes_unicos: number;
}

export interface ReporteCrecimiento {
  ingresos: number | null;
  ventas: number | null;
  ticket: number | null;
  clientes: number | null;
}

export interface SerieDia {
  fecha: string;
  etiqueta: string;
  ingresos: number;
  ventas: number;
  unidades: number;
}

export interface PuntoHora {
  hora: string;
  ventas: number;
  ingresos: number;
}

export interface DistribucionMetodo {
  metodo: string;
  ingresos: number;
  ventas: number;
  porcentaje: number;
}

export interface DistribucionComprobante {
  comprobante: string;
  ventas: number;
  ingresos: number;
  porcentaje: number;
}

export interface DistribucionEstado {
  estado: string;
  ventas: number;
}

export interface TopProducto {
  nombre: string;
  cantidad: number;
  ingresos: number;
  porcentaje: number;
}

export interface VentaReciente {
  id_venta: number;
  fecha_venta: string;
  cliente: string;
  vendedor: string;
  metodo: string;
  comprobante: string;
  total_pagar: number;
  estado_venta: string;
}

export interface ReporteVentas {
  rango: ReporteRango;
  kpis: ReporteKpis;
  crecimiento: ReporteCrecimiento;
  periodo_anterior: { desde: string; hasta: string } | null;
  serie_diaria: SerieDia[];
  por_hora: PuntoHora[];
  por_metodo: DistribucionMetodo[];
  por_comprobante: DistribucionComprobante[];
  por_estado: DistribucionEstado[];
  top_productos: TopProducto[];
  ventas_recientes: VentaReciente[];
}

interface GetReporteResponse {
  success: boolean;
  message: string;
  data: ReporteVentas;
}

export const reportesService = {
  /**
   * Obtener el reporte agregado de ventas.
   * Si no se pasan fechas, se reporta todo el período registrado.
   */
  getReporteVentas: async (desde?: string, hasta?: string): Promise<ReporteVentas> => {
    const params: Record<string, string> = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const response = await api.get<GetReporteResponse>("/reportes/ventas", { params });
    return response.data.data;
  },
};

export default reportesService;