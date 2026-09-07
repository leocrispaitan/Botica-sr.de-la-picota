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
