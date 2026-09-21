import { reportesService } from "./reportesService";

interface CachedContext {
  summaryText: string;
  timestamp: Date;
  status: "success" | "partial" | "empty";
}

let cachedContext: CachedContext | null = null;
const CACHE_TTL_MS = 60 * 1000; // 1 minuto de caché para evitar peticiones redundantes

/**
 * Obtiene un resumen estructurado y condensado de los datos reales del negocio
 * (ventas, serie diaria, top productos, stock crítico y lotes por vencer)
 * para inyectarlo en el contexto de Gemini AI.
 */
export async function getLiveBusinessContext(forceRefresh = false): Promise<string> {
  const now = Date.now();
  if (!forceRefresh && cachedContext && now - cachedContext.timestamp.getTime() < CACHE_TTL_MS) {
    return cachedContext.summaryText;
  }

  const hoy = new Date();
  const mesActual = hoy.getMonth() + 1;
  const mesStr = mesActual.toString().padStart(2, "0");
  const primerDiaMes = `${hoy.getFullYear()}-${mesStr}-01`;
  const hoyStr = `${hoy.getFullYear()}-${mesStr}-${hoy.getDate().toString().padStart(2, "0")}`;

  let ventasMesData: Awaited<ReturnType<typeof reportesService.getReporteVentas>> | null = null;
  let inventarioData: Awaited<ReturnType<typeof reportesService.getReporteInventario>> | null = null;

  try {
    const [ventasRes, invRes] = await Promise.allSettled([
      reportesService.getReporteVentas(primerDiaMes, hoyStr),
      reportesService.getReporteInventario(),
    ]);

    if (ventasRes.status === "fulfilled") ventasMesData = ventasRes.value;
    if (invRes.status === "fulfilled") inventarioData = invRes.value;
  } catch (err) {
    console.warn("⚠️ [AI Context] Error al cargar datos para la IA:", err);
  }

  // Si no hay ventas en el mes actual, consultar todo el período para tener datos históricos
  if (!ventasMesData || ventasMesData.kpis.total_ventas === 0) {
    try {
      const ventasHist = await reportesService.getReporteVentas();
      if (ventasHist && ventasHist.kpis.total_ventas > 0) {
        ventasMesData = ventasHist;
      }
    } catch {
      // Ignorar si no hay conexión
    }
  }

  const fechaFormateada = hoy.toLocaleDateString("es-PE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let text = `=== REGISTROS Y DATOS REALES DE LA BOTICA ===\n`;
  text += `Fecha actual de consulta: ${fechaFormateada}\n`;
  text += `Moneda oficial: Soles peruanos (S/)\n\n`;

  // 1. Reporte de ventas
  if (ventasMesData) {
    const k = ventasMesData.kpis;
    const rango = ventasMesData.rango;
    text += `[MÓDULO: VENTAS]\n`;
    text += `- Período analizado: ${rango?.desde || "Inicio registrado"} hasta ${rango?.hasta || "Hoy"}\n`;
    text += `- Total ingresos recaudados: S/ ${Number(k.total_ingresos || 0).toFixed(2)}\n`;
    text += `- Número total de ventas: ${k.total_ventas} transacciones\n`;
    text += `- Ticket promedio: S/ ${Number(k.ticket_promedio || 0).toFixed(2)}\n`;
    text += `- Unidades totales vendidas: ${k.unidades_vendidas}\n`;
    text += `- Clientes únicos atendidos: ${k.clientes_unicos}\n`;

    // Análisis de la serie diaria (día con más y menos ventas)
    if (ventasMesData.serie_diaria && ventasMesData.serie_diaria.length > 0) {
      const conVentas = ventasMesData.serie_diaria.filter((d) => d.ventas > 0);
      if (conVentas.length > 0) {
        const diaPicoIngresos = [...conVentas].sort((a, b) => b.ingresos - a.ingresos)[0];
        const diaPicoVentas = [...conVentas].sort((a, b) => b.ventas - a.ventas)[0];

        text += `\n* DÍA CON MÁS INGRESOS: ${diaPicoIngresos.fecha} (${diaPicoIngresos.etiqueta}) con S/ ${Number(diaPicoIngresos.ingresos).toFixed(2)} recaudados en ${diaPicoIngresos.ventas} ventas (${diaPicoIngresos.unidades} unidades).\n`;

        if (diaPicoVentas.fecha !== diaPicoIngresos.fecha) {
          text += `* DÍA CON MÁS TRANSACCIONES: ${diaPicoVentas.fecha} (${diaPicoVentas.etiqueta}) con ${diaPicoVentas.ventas} ventas (S/ ${Number(diaPicoVentas.ingresos).toFixed(2)}).\n`;
        }

        // Historial diario reciente
        text += `\n* Desglose de ventas por día (últimos días registrados):\n`;
        conVentas.slice(-10).forEach((d) => {
          text += `  • ${d.fecha} (${d.etiqueta}): S/ ${Number(d.ingresos).toFixed(2)} en ${d.ventas} ventas\n`;
        });
      } else {
        text += `* No se han registrado ventas en los días del período seleccionado.\n`;
      }
    }

    // Top productos más vendidos
    if (ventasMesData.top_productos && ventasMesData.top_productos.length > 0) {
      text += `\n* Top Productos más vendidos:\n`;
      ventasMesData.top_productos.slice(0, 7).forEach((p, idx) => {
        text += `  ${idx + 1}. ${p.nombre}: ${p.cantidad} unidades vendidas, S/ ${Number(p.ingresos).toFixed(2)} (${p.porcentaje}% del total)\n`;
      });
    }

    // Métodos de pago
    if (ventasMesData.por_metodo && ventasMesData.por_metodo.length > 0) {
      text += `\n* Distribución por método de pago:\n`;
      ventasMesData.por_metodo.forEach((m) => {
        text += `  • ${m.metodo}: S/ ${Number(m.ingresos).toFixed(2)} (${m.ventas} ventas, ${m.porcentaje}%)\n`;
      });
    }
  } else {
    text += `[MÓDULO: VENTAS] No hay datos de ventas disponibles actualmente o hubo un error al cargar.\n`;
  }

  // 2. Reporte de Inventario
  if (inventarioData) {
    const ik = inventarioData.kpis;
    text += `\n[MÓDULO: INVENTARIO Y STOCK]\n`;
    text += `- Total de productos registrados: ${ik.total_productos}\n`;
    text += `- Valor total del inventario: S/ ${Number(ik.valor_inventario || 0).toFixed(2)}\n`;
    text += `- Productos con stock óptimo: ${ik.stock_ok}\n`;
    text += `- Productos con stock bajo: ${ik.stock_bajo}\n`;
    text += `- Productos con STOCK CRÍTICO: ${ik.stock_critico}\n`;
    text += `- Productos AGOTADOS: ${ik.stock_agotado}\n`;
    text += `- Lotes que vencen en <30 días: ${ik.lotes_vencen_30}\n`;
    text += `- Lotes vencidos: ${ik.lotes_vencidos}\n`;

    // Productos críticos
    if (inventarioData.productos_criticos && inventarioData.productos_criticos.length > 0) {
      text += `\n* Productos en Stock Crítico o Alerta urgente:\n`;
      inventarioData.productos_criticos.slice(0, 8).forEach((p) => {
        text += `  • ${p.nombre} (${p.categoria || "Sin categoría"}): Stock actual: ${p.stock} (Mínimo requerido: ${p.minimo}) - Estado: ${p.estado}\n`;
      });
    }

    // Lotes por vencer
    if (inventarioData.lotes_por_vencer && inventarioData.lotes_por_vencer.length > 0) {
      text += `\n* Lotes próximos a vencer:\n`;
      inventarioData.lotes_por_vencer.slice(0, 6).forEach((l) => {
        text += `  • ${l.producto} | Lote: ${l.numero_lote} | Vence: ${l.fecha_vencimiento} (Quedan ${l.dias} días, ${l.stock} unidades en ${l.ubicacion || "Almacén"})\n`;
      });
    }
  } else {
    text += `\n[MÓDULO: INVENTARIO] No se pudo obtener el reporte de inventario.\n`;
  }

  cachedContext = {
    summaryText: text,
    timestamp: new Date(),
    status: ventasMesData || inventarioData ? "success" : "empty",
  };

  return text;
}
