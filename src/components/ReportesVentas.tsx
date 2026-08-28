import { useState, useMemo } from "react";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  CreditCard,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Package,
  BarChart3,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Venta {
  id_venta: number;
  fecha_venta: string;
  cliente: string | null;
  vendedor: string;
  metodo_pago: string;
  tipo_comprobante: string;
  total_pagar: number;
  estado_venta: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio: number;
  }>;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockVentas: Venta[] = [
  {
    id_venta: 1,
    fecha_venta: "2026-08-20 10:30:00",
    cliente: "Carlos Ramírez Torres",
    vendedor: "María López",
    metodo_pago: "EFECTIVO",
    tipo_comprobante: "BOLETA",
    total_pagar: 125.50,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Panadol Jarabe", cantidad: 2, precio: 12.50 },
      { nombre: "Amoxil 500", cantidad: 3, precio: 18.00 },
    ],
  },
  {
    id_venta: 2,
    fecha_venta: "2026-08-20 11:45:00",
    cliente: "FARMACORP SAC",
    vendedor: "María López",
    metodo_pago: "TRANSFERENCIA",
    tipo_comprobante: "FACTURA",
    total_pagar: 540.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 30, precio: 18.00 },
    ],
  },
  {
    id_venta: 3,
    fecha_venta: "2026-08-21 09:15:00",
    cliente: null,
    vendedor: "María López",
    metodo_pago: "YAPE_PLIN",
    tipo_comprobante: "TICKET",
    total_pagar: 75.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Panadol Jarabe", cantidad: 6, precio: 12.50 },
    ],
  },
  {
    id_venta: 4,
    fecha_venta: "2026-08-21 14:30:00",
    cliente: "Ana García",
    vendedor: "Pedro Ramírez",
    metodo_pago: "TARJETA",
    tipo_comprobante: "BOLETA",
    total_pagar: 216.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 12, precio: 18.00 },
    ],
  },
  {
    id_venta: 5,
    fecha_venta: "2026-08-22 10:00:00",
    cliente: "Luis Martínez",
    vendedor: "María López",
    metodo_pago: "EFECTIVO",
    tipo_comprobante: "BOLETA",
    total_pagar: 150.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Panadol Jarabe", cantidad: 12, precio: 12.50 },
    ],
  },
  {
    id_venta: 6,
    fecha_venta: "2026-08-22 15:20:00",
    cliente: null,
    vendedor: "Pedro Ramírez",
    metodo_pago: "YAPE_PLIN",
    tipo_comprobante: "TICKET",
    total_pagar: 90.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 5, precio: 18.00 },
    ],
  },
  {
    id_venta: 7,
    fecha_venta: "2026-08-23 11:30:00",
    cliente: "Rosa Torres",
    vendedor: "María López",
    metodo_pago: "TARJETA",
    tipo_comprobante: "BOLETA",
    total_pagar: 180.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 10, precio: 18.00 },
    ],
  },
  {
    id_venta: 8,
    fecha_venta: "2026-08-24 09:45:00",
    cliente: "BOTICAS UNIDAS S.A.C.",
    vendedor: "Pedro Ramírez",
    metodo_pago: "TRANSFERENCIA",
    tipo_comprobante: "FACTURA",
    total_pagar: 720.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 40, precio: 18.00 },
    ],
  },
  {
    id_venta: 9,
    fecha_venta: "2026-08-25 13:00:00",
    cliente: "Jorge Sánchez",
    vendedor: "María López",
    metodo_pago: "EFECTIVO",
    tipo_comprobante: "BOLETA",
    total_pagar: 125.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Panadol Jarabe", cantidad: 10, precio: 12.50 },
    ],
  },
  {
    id_venta: 10,
    fecha_venta: "2026-08-26 16:30:00",
    cliente: null,
    vendedor: "Pedro Ramírez",
    metodo_pago: "YAPE_PLIN",
    tipo_comprobante: "TICKET",
    total_pagar: 54.00,
    estado_venta: "PAGADA",
    productos: [
      { nombre: "Amoxil 500", cantidad: 3, precio: 18.00 },
    ],
  },
];

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
/*  REPORTES VENTAS COMPONENT                                         */
/* ═══════════════════════════════════════════════════════════════════ */
export default function ReportesVentas({ isDark = true }: { isDark?: boolean }) {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days" | "all">("30days");
  const [showFilters, setShowFilters] = useState(false);

  const t = getTheme(isDark);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIngresos = mockVentas.reduce((sum, v) => sum + v.total_pagar, 0);
    const numVentas = mockVentas.length;
    const ticketPromedio = totalIngresos / numVentas;
    const clientesUnicos = new Set(mockVentas.filter(v => v.cliente).map(v => v.cliente)).size;

    // Previous period comparison (mock)
    const crecimientoIngresos = 12.5;
    const crecimientoVentas = 8.3;
    const crecimientoTicket = 3.8;
    const crecimientoClientes = 15.2;

    // Sales by payment method
    const ventasPorMetodo = mockVentas.reduce((acc, v) => {
      acc[v.metodo_pago] = (acc[v.metodo_pago] || 0) + v.total_pagar;
      return acc;
    }, {} as Record<string, number>);

    // Sales by document type
    const ventasPorComprobante = mockVentas.reduce((acc, v) => {
      acc[v.tipo_comprobante] = (acc[v.tipo_comprobante] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Best selling products
    const productosMasVendidos = mockVentas
      .flatMap(v => v.productos)
      .reduce((acc, p) => {
        const existing = acc.find(item => item.nombre === p.nombre);
        if (existing) {
          existing.cantidad += p.cantidad;
          existing.ingresos += p.cantidad * p.precio;
        } else {
          acc.push({
            nombre: p.nombre,
            cantidad: p.cantidad,
            ingresos: p.cantidad * p.precio,
          });
        }
        return acc;
      }, [] as Array<{ nombre: string; cantidad: number; ingresos: number }>)
      .sort((a, b) => b.ingresos - a.ingresos)
      .slice(0, 5);

    // Sales by day (for chart)
    const ventasPorDia = mockVentas.reduce((acc, v) => {
      const fecha = v.fecha_venta.split(" ")[0];
      acc[fecha] = (acc[fecha] || 0) + v.total_pagar;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalIngresos,
      numVentas,
      ticketPromedio,
      clientesUnicos,
      crecimientoIngresos,
      crecimientoVentas,
      crecimientoTicket,
      crecimientoClientes,
      ventasPorMetodo,
      ventasPorComprobante,
      productosMasVendidos,
      ventasPorDia,
    };
  }, []);

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
            Reporte de Ventas
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Análisis detallado del desempeño de ventas del período
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {/* Date Range Filter */}
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
          >
            <Calendar size={16} />
            Últimos 30 días
          </button>

          {/* Export Button */}
          <button
            style={{
              padding: "12px 20px",
              borderRadius: "14px",
              border: "none",
              background: t.accent,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              boxShadow: `0 4px 12px ${t.accent}40`,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = t.accent;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Ingresos */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #10b981 0%, #34d399 40%, #059669 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)",
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
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "14px", 
                background: "rgba(255,255,255,0.15)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}>
                <DollarSign size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ 
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <ArrowUpRight size={14} color="#ffffff" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                  +{stats.crecimientoIngresos}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>
              Total Ingresos
            </p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              S/ {stats.totalIngresos.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              vs período anterior
            </p>
          </div>
        </div>

        {/* Total Ventas */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #2563eb 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)",
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
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "14px", 
                background: "rgba(255,255,255,0.15)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}>
                <ShoppingCart size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ 
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <ArrowUpRight size={14} color="#ffffff" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                  +{stats.crecimientoVentas}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>
              Total Ventas
            </p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {stats.numVentas}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              transacciones realizadas
            </p>
          </div>
        </div>

        {/* Ticket Promedio */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #7c3aed 100%)",
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
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "14px", 
                background: "rgba(255,255,255,0.15)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}>
                <CreditCard size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ 
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <ArrowUpRight size={14} color="#ffffff" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                  +{stats.crecimientoTicket}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>
              Ticket Promedio
            </p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              S/ {stats.ticketPromedio.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              por transacción
            </p>
          </div>
        </div>

        {/* Clientes Únicos */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)",
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
          }} />
          
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                borderRadius: "14px", 
                background: "rgba(255,255,255,0.15)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
              }}>
                <Users size={24} color="#ffffff" strokeWidth={2.5} />
              </div>
              <div style={{ 
                padding: "4px 10px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                <ArrowUpRight size={14} color="#ffffff" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ffffff" }}>
                  +{stats.crecimientoClientes}%
                </span>
              </div>
            </div>
            <p style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>
              Clientes Únicos
            </p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
              {stats.clientesUnicos}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}>
              clientes diferentes
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Sales Trend Chart */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                Tendencia de Ventas
              </h3>
              <p style={{ fontSize: "13px", color: t.textSecondary }}>
                Ingresos diarios del período
              </p>
            </div>
            <BarChart3 size={20} color={t.accent} />
          </div>

          {/* Simple Line Chart Visualization */}
          <div style={{ height: "250px", display: "flex", alignItems: "flex-end", gap: "8px", padding: "20px 0" }}>
            {Object.entries(stats.ventasPorDia).map(([fecha, monto], index) => {
              const maxMonto = Math.max(...Object.values(stats.ventasPorDia));
              const altura = (monto / maxMonto) * 100;
              return (
                <div key={fecha} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: t.accent, marginBottom: "4px" }}>
                      S/ {monto.toFixed(0)}
                    </span>
                    <div
                      style={{
                        width: "100%",
                        height: `${altura * 2}px`,
                        background: `linear-gradient(180deg, ${t.accent} 0%, ${t.accent}80 100%)`,
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.3s ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "scaleY(1.05)";
                        (e.currentTarget as HTMLDivElement).style.filter = "brightness(1.2)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "scaleY(1)";
                        (e.currentTarget as HTMLDivElement).style.filter = "brightness(1)";
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "10px", color: t.textMuted, textAlign: "center" }}>
                    {new Date(fecha).toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment Methods Distribution */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Métodos de Pago
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Distribución por método
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {Object.entries(stats.ventasPorMetodo).map(([metodo, monto], index) => {
              const total = Object.values(stats.ventasPorMetodo).reduce((a, b) => a + b, 0);
              const porcentaje = (monto / total) * 100;
              const colores = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
              const color = colores[index % colores.length];
              
              return (
                <div key={metodo}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                      {metodo}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 700, color }}>
                      {porcentaje.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ 
                    width: "100%", 
                    height: "8px", 
                    background: t.innerBg, 
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}>
                    <div
                      style={{
                        width: `${porcentaje}%`,
                        height: "100%",
                        background: color,
                        borderRadius: "999px",
                        transition: "width 0.5s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: "12px", color: t.textMuted, marginTop: "4px", display: "block" }}>
                    S/ {monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Best Selling Products Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ padding: "24px", borderBottom: `1px solid ${t.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                Productos Más Vendidos
              </h3>
              <p style={{ fontSize: "13px", color: t.textSecondary }}>
                Top 5 productos por ingresos generados
              </p>
            </div>
            <Package size={20} color={t.accent} />
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg }}>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                  #
                </th>
                <th style={{ padding: "16px 24px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                  Producto
                </th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                  Cantidad Vendida
                </th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                  Ingresos Generados
                </th>
                <th style={{ padding: "16px 24px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                  % del Total
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.productosMasVendidos.map((producto, index) => {
                const porcentaje = (producto.ingresos / stats.totalIngresos) * 100;
                return (
                  <tr
                    key={producto.nombre}
                    style={{
                      borderBottom: index < stats.productosMasVendidos.length - 1 ? `1px solid ${t.border}` : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "20px 24px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          background: index === 0 ? "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)" : 
                                     index === 1 ? "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)" :
                                     index === 2 ? "linear-gradient(135deg, #fb923c 0%, #f97316 100%)" :
                                     t.innerBg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 700,
                          fontSize: "14px",
                          color: index < 3 ? "#ffffff" : t.textPrimary,
                        }}
                      >
                        {index + 1}
                      </div>
                    </td>
                    <td style={{ padding: "20px 24px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {producto.nombre}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {producto.cantidad} unidades
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#10b981" }}>
                        S/ {producto.ingresos.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td style={{ padding: "20px 24px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ 
                          width: "60px", 
                          height: "6px", 
                          background: t.innerBg, 
                          borderRadius: "999px",
                          overflow: "hidden",
                        }}>
                          <div
                            style={{
                              width: `${porcentaje}%`,
                              height: "100%",
                              background: t.accent,
                              borderRadius: "999px",
                            }}
                          />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: t.textSecondary, minWidth: "45px" }}>
                          {porcentaje.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
