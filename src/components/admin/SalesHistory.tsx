import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  DollarSign,
  User,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  X,
  CreditCard,
  Receipt,
  XCircle,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface SaleDetail {
  id_detalle_venta: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario_venta: number;
  subtotal: number;
}

interface Sale {
  id_venta: number;
  fecha_venta: string;
  cliente: {
    id_cliente: number;
    nombre_razon_social: string;
    tipo_documento: string;
    numero_documento: string;
  } | null;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
  };
  metodo_pago: {
    id_metodo_pago: number;
    nombre_metodo: string;
  };
  tipo_comprobante: "BOLETA" | "FACTURA" | "TICKET";
  total_pagar: number;
  monto_pagado: number;
  vuelto: number;
  estado_venta: "PENDIENTE" | "PAGADA" | "ANULADA";
  cantidad_productos: number;
  detalles: SaleDetail[];
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockSales: Sale[] = [
  {
    id_venta: 1,
    fecha_venta: "2026-08-27 10:30:00",
    cliente: {
      id_cliente: 1,
      nombre_razon_social: "Carlos Ramírez Torres",
      tipo_documento: "DNI",
      numero_documento: "45678912",
    },
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 1,
      nombre_metodo: "EFECTIVO",
    },
    tipo_comprobante: "BOLETA",
    total_pagar: 25.50,
    monto_pagado: 30.00,
    vuelto: 4.50,
    estado_venta: "PAGADA",
    cantidad_productos: 3,
    detalles: [
      {
        id_detalle_venta: 1,
        nombre_producto: "Paracetamol 500mg",
        cantidad: 20,
        precio_unitario_venta: 0.50,
        subtotal: 10.00,
      },
      {
        id_detalle_venta: 2,
        nombre_producto: "Ibuprofeno 400mg",
        cantidad: 10,
        precio_unitario_venta: 0.80,
        subtotal: 8.00,
      },
      {
        id_detalle_venta: 3,
        nombre_producto: "Loratadina 10mg",
        cantidad: 12,
        precio_unitario_venta: 0.60,
        subtotal: 7.20,
      },
    ],
  },
  {
    id_venta: 2,
    fecha_venta: "2026-08-27 11:15:00",
    cliente: {
      id_cliente: 2,
      nombre_razon_social: "FARMACORP SAC",
      tipo_documento: "RUC",
      numero_documento: "20123456789",
    },
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 4,
      nombre_metodo: "TRANSFERENCIA",
    },
    tipo_comprobante: "FACTURA",
    total_pagar: 450.00,
    monto_pagado: 450.00,
    vuelto: 0.00,
    estado_venta: "PAGADA",
    cantidad_productos: 5,
    detalles: [
      {
        id_detalle_venta: 3,
        nombre_producto: "Amoxicilina 500mg",
        cantidad: 100,
        precio_unitario_venta: 1.20,
        subtotal: 120.00,
      },
      {
        id_detalle_venta: 4,
        nombre_producto: "Omeprazol 20mg",
        cantidad: 80,
        precio_unitario_venta: 1.50,
        subtotal: 120.00,
      },
      {
        id_detalle_venta: 5,
        nombre_producto: "Metformina 850mg",
        cantidad: 100,
        precio_unitario_venta: 0.90,
        subtotal: 90.00,
      },
      {
        id_detalle_venta: 6,
        nombre_producto: "Atorvastatina 20mg",
        cantidad: 50,
        precio_unitario_venta: 1.80,
        subtotal: 90.00,
      },
      {
        id_detalle_venta: 7,
        nombre_producto: "Salbutamol Inhalador 100mcg",
        cantidad: 1,
        precio_unitario_venta: 25.00,
        subtotal: 25.00,
      },
    ],
  },
  {
    id_venta: 3,
    fecha_venta: "2026-08-27 14:20:00",
    cliente: null,
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 3,
      nombre_metodo: "YAPE_PLIN",
    },
    tipo_comprobante: "TICKET",
    total_pagar: 12.80,
    monto_pagado: 12.80,
    vuelto: 0.00,
    estado_venta: "PAGADA",
    cantidad_productos: 2,
    detalles: [
      {
        id_detalle_venta: 8,
        nombre_producto: "Paracetamol 500mg",
        cantidad: 10,
        precio_unitario_venta: 0.50,
        subtotal: 5.00,
      },
      {
        id_detalle_venta: 9,
        nombre_producto: "Loratadina 10mg",
        cantidad: 13,
        precio_unitario_venta: 0.60,
        subtotal: 7.80,
      },
    ],
  },
  {
    id_venta: 4,
    fecha_venta: "2026-08-27 15:45:00",
    cliente: {
      id_cliente: 3,
      nombre_razon_social: "María González Pérez",
      tipo_documento: "DNI",
      numero_documento: "87654321",
    },
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 2,
      nombre_metodo: "TARJETA",
    },
    tipo_comprobante: "BOLETA",
    total_pagar: 38.40,
    monto_pagado: 38.40,
    vuelto: 0.00,
    estado_venta: "PAGADA",
    cantidad_productos: 4,
    detalles: [
      {
        id_detalle_venta: 10,
        nombre_producto: "Ibuprofeno 400mg",
        cantidad: 20,
        precio_unitario_venta: 0.80,
        subtotal: 16.00,
      },
      {
        id_detalle_venta: 11,
        nombre_producto: "Omeprazol 20mg",
        cantidad: 10,
        precio_unitario_venta: 1.50,
        subtotal: 15.00,
      },
      {
        id_detalle_venta: 12,
        nombre_producto: "Loratadina 10mg",
        cantidad: 8,
        precio_unitario_venta: 0.60,
        subtotal: 4.80,
      },
      {
        id_detalle_venta: 13,
        nombre_producto: "Metformina 850mg",
        cantidad: 3,
        precio_unitario_venta: 0.90,
        subtotal: 2.70,
      },
    ],
  },
  {
    id_venta: 5,
    fecha_venta: "2026-08-26 16:30:00",
    cliente: null,
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 1,
      nombre_metodo: "EFECTIVO",
    },
    tipo_comprobante: "BOLETA",
    total_pagar: 15.00,
    monto_pagado: 20.00,
    vuelto: 5.00,
    estado_venta: "PAGADA",
    cantidad_productos: 1,
    detalles: [
      {
        id_detalle_venta: 14,
        nombre_producto: "Amoxicilina 500mg",
        cantidad: 10,
        precio_unitario_venta: 1.20,
        subtotal: 12.00,
      },
    ],
  },
  {
    id_venta: 6,
    fecha_venta: "2026-08-26 09:15:00",
    cliente: null,
    usuario: {
      id_usuario: 2,
      nombre_completo: "María López Ruiz",
    },
    metodo_pago: {
      id_metodo_pago: 1,
      nombre_metodo: "EFECTIVO",
    },
    tipo_comprobante: "TICKET",
    total_pagar: 5.00,
    monto_pagado: 5.00,
    vuelto: 0.00,
    estado_venta: "ANULADA",
    cantidad_productos: 1,
    detalles: [
      {
        id_detalle_venta: 15,
        nombre_producto: "Paracetamol 500mg",
        cantidad: 10,
        precio_unitario_venta: 0.50,
        subtotal: 5.00,
      },
    ],
  },
];

/* ─── Estado Badge Colors ───────────────────────────────────────────── */
const getStatusBadgeColors = (status: string, isDark: boolean) => {
  if (status === "PAGADA") {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      icon: "✓",
    };
  }
  if (status === "PENDIENTE") {
    return {
      bg: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.08)",
      text: "#fb923c",
      border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)",
      icon: "⏳",
    };
  }
  if (status === "ANULADA") {
    return {
      bg: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)",
      text: "#ef4444",
      border: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)",
      icon: "✗",
    };
  }
  return {
    bg: isDark ? "rgba(91, 207, 197, 0.12)" : "rgba(91, 207, 197, 0.08)",
    text: "#5bcfc5",
    border: isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.25)",
    icon: "•",
  };
};

/* ─── Comprobante Badge Colors ──────────────────────────────────────── */
const getComprobanteBadgeColors = (tipo: string, isDark: boolean) => {
  if (tipo === "FACTURA") {
    return {
      bg: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
      text: "#a78bfa",
      border: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)",
    };
  }
  if (tipo === "BOLETA") {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
    };
  }
  return {
    bg: isDark ? "rgba(91, 207, 197, 0.12)" : "rgba(91, 207, 197, 0.08)",
    text: "#5bcfc5",
    border: isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.25)",
  };
};

/* ─── Theme ────────────────────────────────────────────────────────── */
function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      mainBg: "#171622",
      cardBg: "#212130",
      inputBg: "#212130",
      innerBg: "#1e1d29",
      border: "rgba(46,46,66,0.5)",
      borderCard: "rgba(46,46,66,0.4)",
      textPrimary: "#ffffff",
      textSecondary: "#828690",
      textMuted: "#969ba0",
      accent: "#5bcfc5",
      accentHover: "#4bc0b6",
      hoverBg: "#2c2c3e",
    };
  }
  return {
    mainBg: "#f0f2f8",
    cardBg: "#ffffff",
    inputBg: "#f5f6fa",
    innerBg: "#f5f6fa",
    border: "rgba(220,222,235,0.9)",
    borderCard: "rgba(220,222,235,0.7)",
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    hoverBg: "#ecedf5",
  };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  SALES HISTORY COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════════════ */
export default function SalesHistory({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [tipoComprobanteFilter, setTipoComprobanteFilter] = useState<string | "all">("all");
  const [metodoPagoFilter, setMetodoPagoFilter] = useState<string | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  const t = getTheme(isDark);

  // Filtered sales
  const filteredSales = useMemo(() => {
    return mockSales.filter((sale) => {
      const matchesSearch =
        sale.id_venta.toString().includes(searchTerm) ||
        (sale.cliente?.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (sale.cliente?.numero_documento.includes(searchTerm)) ||
        sale.usuario.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || sale.estado_venta === statusFilter;
      const matchesTipoComprobante = tipoComprobanteFilter === "all" || sale.tipo_comprobante === tipoComprobanteFilter;
      const matchesMetodoPago = metodoPagoFilter === "all" || sale.metodo_pago.nombre_metodo === metodoPagoFilter;

      let matchesDate = true;
      const saleDate = new Date(sale.fecha_venta);
      if (dateFrom) {
        matchesDate = matchesDate && saleDate >= new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && saleDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesTipoComprobante && matchesMetodoPago && matchesDate;
    });
  }, [searchTerm, statusFilter, tipoComprobanteFilter, metodoPagoFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSales = filteredSales.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate totals
  const totalVentas = filteredSales.length;
  const totalMonto = filteredSales.filter(s => s.estado_venta === "PAGADA").reduce((sum, s) => sum + s.total_pagar, 0);
  const ventasPagadas = filteredSales.filter(s => s.estado_venta === "PAGADA").length;
  const ventasAnuladas = filteredSales.filter(s => s.estado_venta === "ANULADA").length;

  // View sale details
  const handleViewDetails = (sale: Sale) => {
    setSelectedSale(sale);
    setShowDetailModal(true);
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Historial de Ventas
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Visualiza y gestiona todas las ventas realizadas
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Ventas - Blue Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #2c4eff 0%, #3b5beb 40%, #1d3bcd 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(44, 78, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Ventas
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {totalVentas}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Registros encontrados
              </p>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <ShoppingCart size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Total Monto - Green Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #0f9d58 0%, #16a765 40%, #0b7a44 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 157, 88, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Recaudado
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                S/ {totalMonto.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Solo ventas pagadas
              </p>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Ventas Pagadas - Purple Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 40%, #6d28d9 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ventas Pagadas
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {ventasPagadas}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Completadas exitosamente
              </p>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: "#ffffff",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#8b5cf6",
              }}>
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Ventas Anuladas - Red Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #ea4335 0%, #f4511e 40%, #c62828 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(234, 67, 53, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ventas Anuladas
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {ventasAnuladas}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Canceladas
              </p>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <XCircle size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search Bar & Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input
                type="text"
                placeholder="Buscar por ID, cliente, documento o vendedor..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  borderRadius: "14px",
                  border: `1px solid ${t.border}`,
                  background: t.inputBg,
                  color: t.textPrimary,
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = t.accent;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: `1px solid ${showFilters ? t.accent : t.border}`,
                background: showFilters ? `${t.accent}15` : t.inputBg,
                color: showFilters ? t.accent : t.textSecondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }
              }}
            >
              <Filter size={16} />
              Filtros
              {(statusFilter !== "all" || tipoComprobanteFilter !== "all" || metodoPagoFilter !== "all" || dateFrom || dateTo) && (
                <span
                  style={{
                    background: t.accent,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {(statusFilter !== "all" ? 1 : 0) + (tipoComprobanteFilter !== "all" ? 1 : 0) + (metodoPagoFilter !== "all" ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Export Button */}
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: `1px solid ${t.border}`,
                background: t.inputBg,
                color: t.textSecondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.inputBg;
                (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
              }}
            >
              <Download size={16} />
              Exportar
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                padding: "16px",
                background: t.innerBg,
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="PAGADA">✓ Pagada</option>
                  <option value="PENDIENTE">⏳ Pendiente</option>
                  <option value="ANULADA">✗ Anulada</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Comprobante
                </label>
                <select
                  value={tipoComprobanteFilter}
                  onChange={(e) => {
                    setTipoComprobanteFilter(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="BOLETA">Boleta</option>
                  <option value="FACTURA">Factura</option>
                  <option value="TICKET">Ticket</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Método de Pago
                </label>
                <select
                  value={metodoPagoFilter}
                  onChange={(e) => {
                    setMetodoPagoFilter(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="all">Todos</option>
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TARJETA">Tarjeta</option>
                  <option value="YAPE_PLIN">Yape/Plin</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {(statusFilter !== "all" || tipoComprobanteFilter !== "all" || metodoPagoFilter !== "all" || dateFrom || dateTo) && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setTipoComprobanteFilter("all");
                      setMetodoPagoFilter("all");
                      setDateFrom("");
                      setDateTo("");
                      handleFilterChange();
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${t.border}`,
                      background: t.cardBg,
                      color: t.textSecondary,
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Cairo', sans-serif",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500 }}>
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredSales.length)} de {filteredSales.length} ventas
        </p>
        {filteredSales.length === 0 && searchTerm && (
          <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
            No se encontraron resultados para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Sales Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Venta
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Cliente
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Fecha
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Productos
                </th>
                <th style={{ padding: "16px 20px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Estado
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentSales.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <Search size={48} color={t.textMuted} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                        No se encontraron ventas
                      </p>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentSales.map((sale, index) => {
                  const statusBadge = getStatusBadgeColors(sale.estado_venta, isDark);
                  const comprobanteBadge = getComprobanteBadgeColors(sale.tipo_comprobante, isDark);
                  
                  return (
                    <tr
                      key={sale.id_venta}
                      style={{
                        borderBottom: index < currentSales.length - 1 ? `1px solid ${t.border}` : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                      }}
                    >
                      {/* Venta */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Receipt size={16} color={t.textMuted} />
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                              #{sale.id_venta}
                            </p>
                          </div>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              padding: "4px 10px",
                              borderRadius: "8px",
                              background: comprobanteBadge.bg,
                              color: comprobanteBadge.text,
                              border: `1px solid ${comprobanteBadge.border}`,
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.03em",
                              whiteSpace: "nowrap",
                              width: "fit-content",
                            }}
                          >
                            {sale.tipo_comprobante}
                          </span>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: t.textSecondary }}>
                            <CreditCard size={12} />
                            {sale.metodo_pago.nombre_metodo}
                          </div>
                        </div>
                      </td>

                      {/* Cliente */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", maxWidth: "200px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <User size={14} color={t.textMuted} />
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {sale.cliente ? sale.cliente.nombre_razon_social : "Sin cliente"}
                            </p>
                          </div>
                          {sale.cliente && (
                            <p style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                              {sale.cliente.tipo_documento}: {sale.cliente.numero_documento}
                            </p>
                          )}
                          <p style={{ fontSize: "11px", color: t.textMuted, marginLeft: "20px" }}>
                            Vendedor: {sale.usuario.nombre_completo}
                          </p>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} color={t.textMuted} />
                            <span style={{ fontSize: "13px", color: t.textPrimary }}>
                              {new Date(sale.fecha_venta).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            {new Date(sale.fecha_venta).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Productos */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
                            color: "#a78bfa",
                            fontSize: "14px",
                            fontWeight: 700,
                            border: `1px solid ${isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)"}`,
                          }}
                        >
                          {sale.cantidad_productos}
                        </span>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "flex-end" }}>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: t.accent }}>
                            S/ {sale.total_pagar.toFixed(2)}
                          </span>
                          {sale.vuelto > 0 && (
                            <span style={{ fontSize: "11px", color: "#4ade80" }}>
                              Vuelto: S/ {sale.vuelto.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            background: statusBadge.bg,
                            color: statusBadge.text,
                            border: `1px solid ${statusBadge.border}`,
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>{statusBadge.icon}</span>
                          {sale.estado_venta}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button
                            onClick={() => handleViewDetails(sale)}
                            title="Ver detalles"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}15`;
                              (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Descargar comprobante"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(34, 197, 94, 0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSales.length > 0 && (
          <div style={{ padding: "20px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Página {currentPage} de {totalPages}
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${t.border}`,
                  background: currentPage === 1 ? t.innerBg : t.cardBg,
                  color: currentPage === 1 ? t.textMuted : t.textPrimary,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== 1) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  }
                }}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${page === currentPage ? t.accent : t.border}`,
                        background: page === currentPage ? `${t.accent}15` : t.cardBg,
                        color: page === currentPage ? t.accent : t.textPrimary,
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s",
                        minWidth: "36px",
                      }}
                      onMouseEnter={(e) => {
                        if (page !== currentPage) {
                          (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                          (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (page !== currentPage) {
                          (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                          (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                        }
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${t.border}`,
                  background: currentPage === totalPages ? t.innerBg : t.cardBg,
                  color: currentPage === totalPages ? t.textMuted : t.textPrimary,
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                  opacity: currentPage === totalPages ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== totalPages) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  }
                }}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSale && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
              animation: "fadeIn 0.2s ease",
            }}
            onClick={() => setShowDetailModal(false)}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "900px",
              maxHeight: "90vh",
              background: t.cardBg,
              borderRadius: "24px",
              border: `1px solid ${t.borderCard}`,
              boxShadow: isDark
                ? "0 24px 48px rgba(0,0,0,0.6)"
                : "0 24px 48px rgba(0,0,0,0.15)",
              zIndex: 9999,
              overflow: "hidden",
              animation: "slideUp 0.3s ease",
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translate(-50%, -45%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
              }
            `}</style>

            {/* Modal Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                  Detalle de Venta #{selectedSale.id_venta}
                </h2>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  {selectedSale.tipo_comprobante} - {selectedSale.metodo_pago.nombre_metodo}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "none",
                  background: t.innerBg,
                  color: t.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = t.innerBg;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", maxHeight: "calc(90vh - 180px)", overflowY: "auto" }}>
              {/* Sale Info */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                {selectedSale.cliente ? (
                  <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <User size={18} color={t.accent} />
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                        Cliente
                      </p>
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                      {selectedSale.cliente.nombre_razon_social}
                    </p>
                    <p style={{ fontSize: "13px", color: t.textSecondary }}>
                      {selectedSale.cliente.tipo_documento}: {selectedSale.cliente.numero_documento}
                    </p>
                  </div>
                ) : (
                  <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <User size={18} color={t.textMuted} />
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                        Cliente
                      </p>
                    </div>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: t.textMuted }}>
                      Sin cliente registrado
                    </p>
                  </div>
                )}

                <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <User size={18} color={t.accent} />
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                      Vendedor
                    </p>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                    {selectedSale.usuario.nombre_completo}
                  </p>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    {new Date(selectedSale.fecha_venta).toLocaleString("es-PE")}
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary, marginBottom: "16px" }}>
                  Productos Vendidos
                </h3>
                <div style={{ background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Producto
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Cantidad
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          P. Unit.
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSale.detalles.map((detail, index) => (
                        <tr
                          key={detail.id_detalle_venta}
                          style={{
                            borderBottom: index < selectedSale.detalles.length - 1 ? `1px solid ${t.border}` : "none",
                          }}
                        >
                          <td style={{ padding: "12px 16px" }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                              {detail.nombre_producto}
                            </p>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ fontSize: "13px", color: t.textPrimary }}>
                              {detail.cantidad}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <span style={{ fontSize: "13px", color: t.textSecondary }}>
                              S/ {detail.precio_unitario_venta.toFixed(2)}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: t.accent }}>
                              S/ {detail.subtotal.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div style={{ padding: "20px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: t.textSecondary }}>Total a Pagar:</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                    S/ {selectedSale.total_pagar.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: t.textSecondary }}>Monto Pagado:</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                    S/ {selectedSale.monto_pagado.toFixed(2)}
                  </span>
                </div>
                {selectedSale.vuelto > 0 && (
                  <div
                    style={{
                      borderTop: `1px solid ${t.border}`,
                      paddingTop: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: "16px", fontWeight: 700, color: "#4ade80" }}>Vuelto:</span>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: "#4ade80" }}>
                      S/ {selectedSale.vuelto.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
