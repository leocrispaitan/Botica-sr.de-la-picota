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

  /**
   * Obtener el reporte de inventario.
   * Si no se pasan fechas, se reporta todo el historial de movimientos.
   */
  getReporteInventario: async (desde?: string, hasta?: string): Promise<ReporteInventario> => {
    const params: Record<string, string> = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const response = await api.get<GetReporteInventarioResponse>("/reportes/inventario", { params });
    return response.data.data;
  },

  /**
   * Obtener el reporte de movimientos de inventario.
   * Si no se pasan fechas, se reporta todo el historial registrado.
   */
  getReporteMovimientos: async (desde?: string, hasta?: string): Promise<ReporteMovimientos> => {
    const params: Record<string, string> = {};
    if (desde) params.desde = desde;
    if (hasta) params.hasta = hasta;
    const response = await api.get<GetReporteMovimientosResponse>("/reportes/movimientos", { params });
    return response.data.data;
  },
};

/* ═════════════════════════════════════════════════════════════════════
 *  REPORTE DE INVENTARIO
 * ═════════════════════════════════════════════════════════════════════ */

export interface InventarioRango {
  desde: string | null;
  hasta: string | null;
  periodo_completo: boolean;
}

export interface InventarioKpis {
  total_productos: number;
  total_categorias: number;
  total_proveedores: number;
  unidades_totales: number;
  lotes_total: number;
  valor_inventario: number;
  valor_potencial: number;
  margen_potencial: number;
  stock_ok: number;
  stock_bajo: number;
  stock_critico: number;
  stock_agotado: number;
  alertas_stock: number;
  lotes_vencen_30: number;
  lotes_vencen_60: number;
  lotes_vencen_90: number;
  lotes_vencidos: number;
  entradas_totales: number;
  salidas_totales: number;
  valor_promedio_producto: number;
}

export interface PorEstadoStock {
  estado: string;
  productos: number;
  unidades: number;
  valor: number;
  porcentaje: number;
}

export interface PorCategoria {
  categoria: string;
  productos: number;
  unidades: number;
  valor: number;
  porcentaje: number;
}

export interface TopValorItem {
  nombre: string;
  categoria: string;
  unidades: number;
  valor: number;
  potencial: number;
  margen: number;
}

export interface ProductoCritico {
  id_producto: number;
  nombre: string;
  categoria: string;
  stock: number;
  minimo: number;
  ratio: number;
  estado: string;
  valor: number;
}

export interface LotePorVencer {
  id_inventario: number;
  numero_lote: string;
  producto: string;
  fecha_vencimiento: string;
  dias: number;
  stock: number;
  ubicacion: string;
  urgencia: string;
}

export interface LoteVencido {
  id_inventario: number;
  numero_lote: string;
  producto: string;
  fecha_vencimiento: string;
  dias: number;
  stock: number;
  ubicacion: string;
}

export interface SerieMovimiento {
  fecha: string;
  etiqueta: string;
  entradas: number;
  salidas: number;
  neto: number;
}

export interface SerieStock {
  fecha: string;
  etiqueta: string;
  nivel: number;
  entradas: number;
  salidas: number;
}

export interface PorTipoMovimiento {
  tipo: string;
  movimientos: number;
  unidades: number;
}

export interface ReporteInventario {
  rango: InventarioRango;
  fecha_corte: string;
  kpis: InventarioKpis;
  por_estado: PorEstadoStock[];
  por_categoria: PorCategoria[];
  top_valor: TopValorItem[];
  productos_criticos: ProductoCritico[];
  lotes_por_vencer: LotePorVencer[];
  lotes_vencidos: LoteVencido[];
  serie_movimientos: SerieMovimiento[];
  serie_stock: SerieStock[];
  por_tipo_movimiento: PorTipoMovimiento[];
  paleta_estados: Record<string, string>;
}

interface GetReporteInventarioResponse {
  success: boolean;
  message: string;
  data: ReporteInventario;
}

/* ═════════════════════════════════════════════════════════════════════
 *  REPORTE DE MOVIMIENTOS
 * ═════════════════════════════════════════════════════════════════════ */

export interface MovimientosRango {
  desde: string | null;
  hasta: string | null;
  dias: number | null;
  periodo_completo: boolean;
}

export interface MovimientosKpis {
  total_movimientos: number;
  movimientos_hoy: number;
  entradas_mov: number;
  salidas_mov: number;
  entradas_unid: number;
  salidas_unid: number;
  entradas_valor: number;
  salidas_valor: number;
  unidades_movidas: number;
  valor_total: number;
  balance_unidades: number;
  usuarios_activos: number;
  productos_movidos: number;
}

export interface MovimientosCrecimiento {
  movimientos: number | null;
  unidades: number | null;
  valor: number | null;
}

export interface PorTipoDetalle {
  tipo: string;
  movimientos: number;
  unidades: number;
  valor: number;
  porcentaje: number;
}

export interface SerieDiaMovimiento {
  fecha: string;
  etiqueta: string;
  entradas: number;
  salidas: number;
  neto: number;
  valor: number;
}

export interface PuntoHoraMovimiento {
  hora: string;
  movimientos: number;
  entradas: number;
  salidas: number;
}

export interface TopProductoMovido {
  nombre: string;
  unidades: number;
  movimientos: number;
  valor: number;
  porcentaje: number;
}

export interface UsuarioActivo {
  nombre: string;
  movimientos: number;
  unidades: number;
}

export interface MovimientoReciente {
  id_movimiento: number;
  tipo_movimiento: string;
  fecha_hora: string;
  usuario: string;
  unidades: number;
  valor: number;
  total_registro: number | null;
}

export interface ReporteMovimientos {
  rango: MovimientosRango;
  kpis: MovimientosKpis;
  crecimiento: MovimientosCrecimiento;
  por_tipo: PorTipoDetalle[];
  serie_diaria: SerieDiaMovimiento[];
  por_hora: PuntoHoraMovimiento[];
  top_productos: TopProductoMovido[];
  usuarios_activos: UsuarioActivo[];
  movimientos_recientes: MovimientoReciente[];
  paleta_tipos: Record<string, string>;
}

interface GetReporteMovimientosResponse {
  success: boolean;
  message: string;
  data: ReporteMovimientos;
}

export default reportesService;