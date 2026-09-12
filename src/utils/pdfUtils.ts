import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import type { CompraHistorial } from "../services/purchasesService";

/* ─── Colores de la marca ──────────────────────────────────────────── */
const BRAND = {
  primary: [44, 78, 255] as [number, number, number], // azul
  dark: [15, 23, 42] as [number, number, number], // slate-900
  gray: [71, 85, 105] as [number, number, number], // slate-500
  light: [241, 245, 249] as [number, number, number], // slate-100
  border: [203, 213, 225] as [number, number, number], // slate-300
  green: [22, 163, 74] as [number, number, number],
};

const MONTHS_ES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} de ${MONTHS_ES[d.getMonth()]} de ${d.getFullYear()}`;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${formatDate(iso)}, ${hh}:${mm}`;
}

function formatMoney(value: number | null | undefined): string {
  const n = Number(value || 0);
  return n.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  });
}

/* ─── Encabezado genérico ──────────────────────────────────────────── */
function drawHeader(doc: jsPDF, title: string, subtitle: string) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Barra superior
  doc.setFillColor(...BRAND.primary);
  doc.rect(0, 0, pageWidth, 8, "F");

  // Título del sistema
  doc.setFillColor(...BRAND.primary);
  doc.roundedRect(14, 20, 108, 30, 4, 4, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Botica SaludVida", 18, 32);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Sistema de Gestión de Compra y Venta", 18, 41);

  // Título del documento (derecha)
  doc.setTextColor(...BRAND.dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, pageWidth - 14 - titleWidth, 32);
  doc.setDrawColor(...BRAND.primary);
  doc.setLineWidth(0.8);
  doc.line(pageWidth - 14 - titleWidth, 35, pageWidth - 14, 35);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.gray);
  const subWidth = doc.getTextWidth(subtitle);
  doc.text(subtitle, pageWidth - 14 - subWidth, 42);
}

function drawFooter(doc: jsPDF) {
  const pageHeight = doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setDrawColor(...BRAND.border);
  doc.setLineWidth(0.3);
  doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);
  doc.setTextColor(...BRAND.gray);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Botica SaludVida - Av. Los Incas 123, Lima, Perú  |  Tel: (01) 555-1234",
    14,
    pageHeight - 12
  );
  doc.text(
    "Documento generado por el Sistema de Gestión.",
    14,
    pageHeight - 8
  );

  // Número de página
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.gray);
    doc.text(
      `Página ${i} de ${pages}`,
      pageWidth - 14,
      pageHeight - 12,
      { align: "right" }
    );
  }
}

/* ─── DATO: tipo de comprobante ────────────────────────────────────── */
export type ComprobanteTipo = "COMPROBANTE" | "COM_ACTIVIDAD";

/* ═══════════════════════════════════════════════════════════════════ */
/*  1. COMPROBANTE DE COMPRA (una sola fila)                           */
/*  Recibe el detalle completo (getPurchaseById)                       */
/* ═══════════════════════════════════════════════════════════════════ */

export interface ComprobanteDetail {
  id_movimiento: number;
  numero_documento: string | null;
  fecha_hora: string;
  subtotal: number;
  igv: number;
  total: number;
  proveedor: {
    nombre_proveedor: string;
    ruc: string;
    telefono: string | null;
    email: string | null;
  } | null;
  usuario: {
    nombre_completo: string;
  } | null;
  detalle_movimiento: {
    cantidad: number;
    costo_unitario: number;
    producto: { nombre_comercial: string; nombre_generico?: string; unidad_medida?: string } | null;
    inventario_lote: { numero_lote: string; fecha_vencimiento: string | null } | null;
  }[];
}

export function exportPurchaseComprobante(detail: ComprobanteDetail) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  drawHeader(doc, "COMPROBANTE", "Registro individual de compra");

  // ─── Datos del comprobante ───
  autoTable(doc, {
    startY: 62,
    theme: "plain",
    bodyStyles: { fillColor: BRAND.light, textColor: BRAND.dark, fontSize: 9 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 38, fillColor: [255, 255, 255] as never },
    },
    margin: { left: 14, right: 14 },
    body: [
      [
        { content: "N° de documento" },
        { content: detail.numero_documento || "—", styles: { halign: "right" as const } },
      ],
      [
        { content: "Fecha y hora" },
        { content: formatDateTime(detail.fecha_hora), styles: { halign: "right" as const } },
      ],
      [
        { content: "Tipo de operación" },
        { content: "Compra", styles: { halign: "right" as const } },
      ],
    ],
  });

  // ─── Proveedor ───
  const yAfter = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : 80;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("DATOS DEL PROVEEDOR", 14, yAfter);

  autoTable(doc, {
    startY: yAfter + 4,
    theme: "grid",
    headStyles: {
      fillColor: BRAND.primary,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Razón Social", "RUC", "Teléfono", "Email"]],
    body: [
      [
        detail.proveedor?.nombre_proveedor || "Sin proveedor",
        detail.proveedor?.ruc || "—",
        detail.proveedor?.telefono || "—",
        detail.proveedor?.email || "—",
      ],
    ],
  });

  // ─── Productos ───
  const yProducts = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : yAfter + 16;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("DETALLE DE PRODUCTOS", 14, yProducts);

  const rows = detail.detalle_movimiento.map((d) => {
    const lote = d.inventario_lote;
    return [
      d.producto?.nombre_comercial || "Producto no disponible",
      d.cantidad.toString(),
      (d.producto?.unidad_medida || "").toString(),
      formatMoney(d.costo_unitario),
      lote?.numero_lote || "—",
      lote?.fecha_vencimiento
        ? formatDate(lote.fecha_vencimiento)
        : "—",
      formatMoney(d.cantidad * d.costo_unitario),
    ];
  });

  autoTable(doc, {
    startY: yProducts + 4,
    theme: "grid",
    headStyles: {
      fillColor: BRAND.dark,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8.5,
    },
    bodyStyles: { fontSize: 8.5, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Producto", "Cant.", "Unid.", "P. Unit.", "Lote", "Vencimiento", "Subtotal"]],
    body: rows,
    columnStyles: {
      1: { halign: "center" as const },
      2: { halign: "center" as const },
      3: { halign: "right" as const },
      4: { halign: "center" as const },
      5: { halign: "center" as const },
      6: { halign: "right" as const, fontStyle: "bold" as const },
    },
  });

  // ─── Totales ───
  const yTotals = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 6
    : yProducts + 16;

  const tableWidth = pageWidth - 28;
  let ty = yTotals;

  const drawTotalRow = (label: string, value: string, bold = false) => {
    if (bold) {
      doc.setFillColor(...BRAND.primary);
      doc.setTextColor(255, 255, 255);
    } else {
      doc.setFillColor(255, 255, 255);
      doc.setTextColor(...BRAND.dark);
    }
    doc.setDrawColor(...BRAND.border);
    doc.roundedRect(14, ty, tableWidth, 9, 2, 2, "FD");
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 10 : 9);
    doc.text(label, 18, ty + 6);
    doc.text(value, pageWidth - 18, ty + 6, { align: "right" });
    ty += 11;
  };

  drawTotalRow("Subtotal", formatMoney(detail.subtotal));
  drawTotalRow("IGV (18%)", formatMoney(detail.igv));
  drawTotalRow("TOTAL", formatMoney(detail.total), true);

  // ─── Registrado por ───
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BRAND.gray);
  doc.text(
    `Registrado por: ${detail.usuario?.nombre_completo || "—"}`,
    14,
    ty + 4
  );

  drawFooter(doc);
  doc.setPage(1);
  doc.save(`Comprobante_Compra_${detail.numero_documento || detail.id_movimiento}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  2. REPORTE / EXPORTAR (todos los registros)                       */
/* ═══════════════════════════════════════════════════════════════════ */

export interface ExportStats {
  total_compras?: number;
  total_monto?: number;
  total_productos?: number;
  proveedores?: number;
}

export function exportPurchaseHistoryReport(
  compras: CompraHistorial[],
  stats: ExportStats,
  filters?: { search?: string; proveedor?: string; desde?: string; hasta?: string }
) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const subtitle = filters
    ? `Reporte de compras (${stats.total_compras ?? compras.length} registros)`
    : "Reporte completo de compras";

  drawHeader(doc, "REPORTE", subtitle);

  // ─── Tarjetas de estadísticas ───
  const cardW = (pageWidth - 14 * 2 - 8 * 3) / 4;
  const cardY = 58;
  const cardH = 22;

  const cards = [
    { label: "Total Compras", value: String(stats.total_compras ?? compras.length) },
    { label: "Monto Total", value: formatMoney(stats.total_monto ?? 0) },
    { label: "Productos", value: String(stats.total_productos ?? 0) },
    { label: "Proveedores", value: String(stats.proveedores ?? 0) },
  ];

  cards.forEach((c, i) => {
    const x = 14 + i * (cardW + 8);
    doc.setFillColor(...BRAND.primary);
    doc.setDrawColor(...BRAND.primary);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(c.label.toUpperCase(), x + 6, cardY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(c.value, x + 6, cardY + 17);
  });

  // ─── Filtros aplicados ───
  if (filters) {
    const parts: string[] = [];
    if (filters.search) parts.push(`Búsqueda: "${filters.search}"`);
    if (filters.proveedor) parts.push(`Proveedor: ${filters.proveedor}`);
    if (filters.desde) parts.push(`Desde: ${filters.desde}`);
    if (filters.hasta) parts.push(`Hasta: ${filters.hasta}`);
    if (parts.length) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND.gray);
      doc.text(`Filtros aplicados: ${parts.join("   |   ")}`, 14, cardY + cardH + 10);
    }
  }

  // ─── Tabla de compras ───
  const startY = cardY + cardH + (filters ? 18 : 8);

  const body = compras.map((c) => [
    c.numero_documento || "—",
    formatDate(c.fecha_hora),
    c.proveedor?.nombre_proveedor || "Sin proveedor",
    c.proveedor?.ruc || "—",
    String(c.detalle_movimiento?.length || 0),
    formatMoney(c.subtotal),
    formatMoney(c.igv),
    { content: formatMoney(c.total), styles: { fontStyle: "bold" as const, textColor: [...BRAND.primary] as never } },
  ]);

  autoTable(doc, {
    startY,
    theme: "grid",
    headStyles: {
      fillColor: BRAND.dark,
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 8, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["N° Documento", "Fecha", "Proveedor", "RUC", "# Prod.", "Subtotal", "IGV", "Total"]],
    body,
    columnStyles: {
      0: { cellWidth: 28 },
      1: { cellWidth: 32, halign: "center" as const },
      3: { cellWidth: 28 },
      5: { halign: "right" as const },
      6: { halign: "right" as const },
      7: { halign: "right" as const },
    },
  });

  // ─── Fila resumen al final ───
  const finalY =
    (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY
      : startY + 10;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...BRAND.primary);
  doc.text(
    `Total registros: ${compras.length}  |  Monto total: ${formatMoney(stats.total_monto ?? 0)}`,
    pageWidth - 14,
    finalY + 6,
    { align: "right" }
  );

  drawFooter(doc);
  doc.setPage(1);
  const today = new Date();
  const stamp = `${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, "0")}${today
    .getDate()
    .toString()
    .padStart(2, "0")}`;
  doc.save(`Reporte_Compras_${stamp}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  3. REPORTE DE VENTAS (dashboard)                                   */
/*  Recibe KPIs, tablas y capturas (PNG) de los gráficos del dashboard  */
/* ═══════════════════════════════════════════════════════════════════ */

export interface SalesReportChartImages {
  area?: string;
  horas?: string;
  metodo?: string;
  comprobante?: string;
  productos?: string;
}

export interface SalesPdfData {
  meta: { desde: string | null; hasta: string | null; dias: number | null; periodo_completo: boolean };
  kpis: {
    total_ingresos: number;
    total_ventas: number;
    ticket_promedio: number;
    unidades_vendidas: number;
    clientes_unicos: number;
  };
  crecimiento: { ingresos: number | null; ventas: number | null; ticket: number | null; clientes: number | null };
  topProductos: { nombre: string; cantidad: number; ingresos: number; porcentaje: number }[];
  ventasRecientes: {
    id_venta: number;
    fecha_venta: string;
    cliente: string;
    vendedor: string;
    metodo: string;
    comprobante: string;
    total_pagar: number;
    estado_venta: string;
  }[];
  chartImages: SalesReportChartImages;
}

const CHART_MAX_H = 78;

function addChartImage(doc: jsPDF, dataUrl: string, y: number): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const props = doc.getImageProperties(dataUrl);

  const contentW = pageWidth - 28;
  const ratio = (props.height || contentW) / (props.width || contentW);
  let h = contentW * ratio;
  let w = contentW;
  if (h > CHART_MAX_H) {
    h = CHART_MAX_H;
    w = h / ratio;
  }

  if (y + h > pageHeight - 28) {
    doc.addPage();
    y = 20;
  }

  const x = (pageWidth - w) / 2;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(x - 3, y - 3, w + 6, h + 6, 3, 3, "F");
  doc.addImage(dataUrl, "PNG", x, y, w, h);
  return y + h + 8;
}

export function exportSalesReportPdf(data: SalesPdfData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const subtitle = data.meta.periodo_completo
    ? "Todo el período registrado"
    : `Del ${formatDate(data.meta.desde!)} al ${formatDate(data.meta.hasta!)} (${data.meta.dias} días)`;

  drawHeader(doc, "REPORTE DE VENTAS", subtitle);

  // ─── Tarjetas de estadísticas ───
  const cardColors = [
    [16, 185, 129] as [number, number, number],
    [59, 130, 246] as [number, number, number],
    [139, 92, 246] as [number, number, number],
    [245, 158, 11] as [number, number, number],
  ];

  const cardW = (pageWidth - 14 * 2 - 8 * 3) / 4;
  const cardY = 56;
  const cardH = 26;

  const crecimientoIngresos = data.crecimiento.ingresos;

  const cards = [
    { label: "Total Ingresos", value: formatMoney(data.kpis.total_ingresos), growth: crecimientoIngresos },
    { label: "Total Ventas", value: String(data.kpis.total_ventas), growth: data.crecimiento.ventas },
    { label: "Ticket Promedio", value: formatMoney(data.kpis.ticket_promedio), growth: data.crecimiento.ticket },
    { label: "Clientes Únicos", value: String(data.kpis.clientes_unicos), growth: data.crecimiento.clientes },
  ];

  cards.forEach((c, i) => {
    const x = 14 + i * (cardW + 8);
    doc.setFillColor(...cardColors[i]);
    doc.setDrawColor(...cardColors[i]);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(c.label.toUpperCase(), x + 6, cardY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(c.value, x + 6, cardY + 17);
    if (c.growth !== null && c.growth !== undefined) {
      const signo = c.growth >= 0 ? "+" : "";
      const txt = `${signo}${c.growth.toFixed(1)}%`;
      const tw = doc.getTextWidth(txt) + 4;
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(255, 255, 255);
      doc.roundedRect(x + cardW - tw - 4, cardY + cardH - 7, tw, 4.5, 2, 2, "F");
      doc.setTextColor(...cardColors[i]);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.text(txt, x + cardW - tw - 2, cardY + cardH - 3.6);
    }
  });

  let y = cardY + cardH + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.gray);
  doc.text(`Unidades vendidas: ${data.kpis.unidades_vendidas}  |  Periodo anterior: ${data.meta.periodo_completo ? "—" : "sí"}`, 14, y);
  y += 8;

  // ─── Gráficos (imágenes capturadas del dashboard) ───
  const charts: Array<[string, string | undefined]> = [
    ["Tendencia de Ingresos", data.chartImages.area],
    ["Ventas por Hora", data.chartImages.horas],
    ["Métodos de Pago", data.chartImages.metodo],
    ["Tipos de Comprobante", data.chartImages.comprobante],
    ["Top Productos", data.chartImages.productos],
  ];

  charts.forEach(([titulo, imagen]) => {
    if (!imagen) return;
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.primary);
    doc.text(titulo.toUpperCase(), 14, y);
    y += 4;
    y = addChartImage(doc, imagen, y);
  });

  // ─── Tabla: Top productos ───
  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("TOP PRODUCTOS MÁS VENDIDOS", 14, y);
  y += 4;

  const productosBody = data.topProductos.map((p, i) => [
    String(i + 1),
    p.nombre,
    String(p.cantidad),
    formatMoney(p.ingresos),
    `${p.porcentaje.toFixed(1)}%`,
  ]);

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["#", "Producto", "Cantidad", "Ingresos", "%"]],
    body: productosBody.length > 0 ? productosBody : [["—", "Sin ventas registradas", "—", "—", "—"]],
    columnStyles: {
      0: { cellWidth: 10, halign: "center" as const },
      2: { cellWidth: 22, halign: "center" as const },
      3: { halign: "right" as const },
      4: { cellWidth: 18, halign: "right" as const },
    },
  });

  // ─── Tabla: Ventas recientes ───
  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : y + 10;

  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("ÚLTIMAS VENTAS", 14, y);
  y += 4;

  const ventasBody = data.ventasRecientes.map((v) => [
    String(v.id_venta),
    formatDateTime(v.fecha_venta),
    v.cliente,
    v.vendedor,
    v.metodo,
    v.comprobante,
    formatMoney(v.total_pagar),
    v.estado_venta,
  ]);

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 7 },
    bodyStyles: { fontSize: 7, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["N°", "Fecha", "Cliente", "Vendedor", "Método", "Comp.", "Total", "Estado"]],
    body: ventasBody.length > 0 ? ventasBody : [["—", "—", "Sin ventas en el período", "—", "—", "—", "—", "—"]],
    columnStyles: {
      0: { cellWidth: 12, halign: "center" as const },
      1: { cellWidth: 30, halign: "center" as const },
      4: { cellWidth: 20 },
      5: { cellWidth: 14, halign: "center" as const },
      6: { halign: "right" as const },
      7: { cellWidth: 18, halign: "center" as const },
    },
  });

  drawFooter(doc);
  doc.setPage(1);

  const dateStamp = new Date();
  const stamp = `${dateStamp.getFullYear()}${(dateStamp.getMonth() + 1).toString().padStart(2, "0")}${dateStamp
    .getDate()
    .toString()
    .padStart(2, "0")}`;
  doc.save(`Reporte_Ventas_${stamp}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  4. REPORTE DE INVENTARIO (dashboard)                               */
/*  Recibe KPIs, tablas y capturas (PNG) de los gráficos del dashboard  */
/* ═══════════════════════════════════════════════════════════════════ */

export interface InventoryReportChartImages {
  stock?: string;
  categoria?: string;
  movimientos?: string;
  tipos?: string;
  top?: string;
}

export interface InventoryPdfData {
  meta: {
    desde: string | null;
    hasta: string | null;
    periodo_completo: boolean;
  };
  fecha_corte: string;
  kpis: {
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
    lotes_vencen_30: number;
    lotes_vencen_60: number;
    lotes_vencen_90: number;
    lotes_vencidos: number;
  };
  entradas_totales: number;
  salidas_totales: number;
  porEstado: { estado: string; productos: number; unidades: number; valor: number; porcentaje: number }[];
  topValor: { nombre: string; categoria: string; unidades: number; valor: number; margen: number }[];
  criticos: { nombre: string; categoria: string; stock: number; minimo: number; estado: string }[];
  lotes: {
    numero_lote: string;
    producto: string;
    fecha_vencimiento: string;
    dias: number;
    stock: number;
    ubicacion: string;
    urgencia: string;
  }[];
  chartImages: InventoryReportChartImages;
}

const CARD_COLORS_INV = [
  [99, 102, 241] as [number, number, number], // indigo
  [16, 185, 129] as [number, number, number], // emerald
  [59, 130, 246] as [number, number, number], // azul
  [245, 158, 11] as [number, number, number], // amber
];

export function exportInventoryReportPdf(data: InventoryPdfData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  const subtitle = `Corte al ${formatDate(data.fecha_corte)}`;
  drawHeader(doc, "REPORTE DE INVENTARIO", subtitle);

  // ─── Tarjetas de estadísticas ───
  const cardW = (pageWidth - 14 * 2 - 8 * 3) / 4;
  const cardY = 56;
  const cardH = 28;

  const cards = [
    { label: "Productos", value: String(data.kpis.total_productos) },
    { label: "Unid. en Stock", value: String(data.kpis.unidades_totales) },
    { label: "Valor Inventario", value: formatMoney(data.kpis.valor_inventario) },
    { label: "Alertas Stock", value: String(
      data.kpis.stock_bajo + data.kpis.stock_critico + data.kpis.stock_agotado
    ) },
  ];

  cards.forEach((c, i) => {
    const x = 14 + i * (cardW + 8);
    doc.setFillColor(...CARD_COLORS_INV[i]);
    doc.setDrawColor(...CARD_COLORS_INV[i]);
    doc.roundedRect(x, cardY, cardW, cardH, 3, 3, "FD");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text(c.label.toUpperCase(), x + 6, cardY + 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(c.value, x + 6, cardY + 17);
  });

  let y = cardY + cardH + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...BRAND.gray);
  doc.text(
    `Categorías: ${data.kpis.total_categorias}  |  Proveedores: ${data.kpis.total_proveedores}  |  Lotes activos: ${data.kpis.lotes_total}`,
    14,
    y
  );
  y += 5;
  doc.text(
    `Valor potencial: ${formatMoney(data.kpis.valor_potencial)}  |  Margen potencial: ${formatMoney(data.kpis.margen_potencial)}`,
    14,
    y
  );
  y += 5;
  doc.text(
    `Lotes por vencer: 30d (${data.kpis.lotes_vencen_30}) / 60d (${data.kpis.lotes_vencen_60}) / 90d (${data.kpis.lotes_vencen_90})  |  Vencidos: ${data.kpis.lotes_vencidos}`,
    14,
    y
  );
  y += 5;
  doc.text(
    `Entradas: ${data.entradas_totales} unid.  |  Salidas: ${data.salidas_totales} unid.  |  Período: ${data.meta.periodo_completo ? "todo el historial" : `del ${data.meta.desde} al ${data.meta.hasta}`}`,
    14,
    y
  );
  y += 4;

  // ─── Gráficos (imágenes capturadas del dashboard) ───
  const charts: Array<[string, string | undefined]> = [
    ["Evolución del Stock", data.chartImages.stock],
    ["Unidades por Categoría", data.chartImages.categoria],
    ["Movimientos por Día", data.chartImages.movimientos],
    ["Tipo de Movimientos", data.chartImages.tipos],
    ["Top Valor en Inventario", data.chartImages.top],
  ];

  charts.forEach(([titulo, imagen]) => {
    if (!imagen) return;
    if (y > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      y = 20;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...BRAND.primary);
    doc.text(titulo.toUpperCase(), 14, y);
    y += 4;
    y = addChartImage(doc, imagen, y);
  });

  // ─── Tabla: Estado del stock ───
  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("ESTADO DEL STOCK", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Estado", "Productos", "Unidades", "Valor", "%"]],
    body: data.porEstado.map((e) => [
      e.estado,
      String(e.productos),
      String(e.unidades),
      formatMoney(e.valor),
      `${e.porcentaje.toFixed(1)}%`,
    ]),
    columnStyles: {
      1: { halign: "center" as const },
      2: { halign: "center" as const },
      3: { halign: "right" as const },
      4: { halign: "right" as const },
    },
  });

  // ─── Tabla: Top valor ───
  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : y + 10;

  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("TOP VALOR EN INVENTARIO", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Producto", "Categoría", "Unid.", "Valor Costo", "Margen"]],
    body: data.topValor.map((p) => [
      p.nombre,
      p.categoria,
      String(p.unidades),
      formatMoney(p.valor),
      formatMoney(p.margen),
    ]),
    columnStyles: {
      2: { halign: "center" as const },
      3: { halign: "right" as const },
      4: { halign: "right" as const },
    },
  });

  // ─── Tabla: Productos críticos ───
  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : y + 10;

  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("PRODUCTOS CON STOCK CRÍTICO", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 8 },
    bodyStyles: { fontSize: 8, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Producto", "Categoría", "Stock", "Mínimo", "Estado"]],
    body: data.criticos.map((p) => [
      p.nombre,
      p.categoria,
      String(p.stock),
      String(p.minimo),
      p.estado,
    ]),
    columnStyles: {
      2: { halign: "center" as const },
      3: { halign: "center" as const },
      4: { halign: "center" as const },
    },
  });

  // ─── Tabla: Lotes por vencer ───
  y = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
    ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY + 10
    : y + 10;

  if (y > doc.internal.pageSize.getHeight() - 45) {
    doc.addPage();
    y = 20;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BRAND.primary);
  doc.text("LOTES POR VENCER (90 DÍAS)", 14, y);
  y += 4;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    headStyles: { fillColor: BRAND.dark, textColor: 255, fontStyle: "bold", fontSize: 7.5 },
    bodyStyles: { fontSize: 7.5, textColor: BRAND.dark },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 14, right: 14 },
    head: [["Producto", "Lote", "Vence", "Días", "Stock", "Ubicación", "Urgencia"]],
    body: data.lotes.map((l) => [
      l.producto,
      l.numero_lote,
      l.fecha_vencimiento,
      String(l.dias),
      String(l.stock),
      l.ubicacion,
      l.urgencia,
    ]),
    columnStyles: {
      3: { halign: "center" as const },
      4: { halign: "center" as const },
      6: { halign: "center" as const },
    },
  });

  if (data.lotes.length === 0) {
    const finalY = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
      ? ((doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable as { finalY: number }).finalY
      : y;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.gray);
    doc.text("No hay lotes por vencer en los próximos 90 días.", 14, finalY + 8);
  }

  drawFooter(doc);
  doc.setPage(1);

  const dateStamp = new Date();
  const stamp = `${dateStamp.getFullYear()}${(dateStamp.getMonth() + 1).toString().padStart(2, "0")}${dateStamp
    .getDate()
    .toString()
    .padStart(2, "0")}`;
  doc.save(`Reporte_Inventario_${stamp}.pdf`);
}
