import { useState, useMemo } from "react";
import {
  FileBarChart,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  AlertCircle,
  RotateCcw,
  Trash2,
  Download,
  Filter,
  Search,
  User,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Activity,
  Layers,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
type TipoMovimiento = "COMPRA" | "VENTA" | "AJUSTE" | "DEVOLUCION" | "MERMA";

interface Movimiento {
  id_movimiento: number;
  tipo_movimiento: TipoMovimiento;
  fecha_hora: string;
  usuario: string;
  motivo_ajuste?: string;
  detalles: {
    producto: string;
    cantidad: number;
    costo_unitario: number;
  }[];
  total_movimiento: number;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockMovimientos: Movimiento[] = [
  {
    id_movimiento: 1,
    tipo_movimiento: "COMPRA",
    fecha_hora: "2024-02-15T09:30:00",
    usuario: "Roberto Silva",
    detalles: [
      { producto: "Panadol Jarabe 60ml", cantidad: 50, costo_unitario: 7.0 },
      { producto: "Ibuprofeno 400mg x20", cantidad: 30, costo_unitario: 9.0 },
    ],
    total_movimiento: 620.0,
  },
  {
    id_movimiento: 2,
    tipo_movimiento: "VENTA",
    fecha_hora: "2024-02-15T10:15:00",
    usuario: "María López",
    detalles: [
      { producto: "Amoxil 500mg x12", cantidad: 3, costo_unitario: 11.0 },
    ],
    total_movimiento: 33.0,
  },
  {
    id_movimiento: 3,
    tipo_movimiento: "AJUSTE",
    fecha_hora: "2024-02-15T11:00:00",
    usuario: "Roberto Silva",
    motivo_ajuste: "Corrección de inventario físico - discrepancia detectada en conteo",
    detalles: [
      { producto: "Omeprazol 20mg x14", cantidad: 5, costo_unitario: 14.0 },
    ],
    total_movimiento: 70.0,
  },
  {
    id_movimiento: 4,
    tipo_movimiento: "DEVOLUCION",
    fecha_hora: "2024-02-15T12:30:00",
    usuario: "María López",
    motivo_ajuste: "Cliente devuelve producto por fecha de vencimiento próxima",
    detalles: [
      { producto: "Loratadina 10mg x30", cantidad: 2, costo_unitario: 7.5 },
    ],
    total_movimiento: 15.0,
  },
  {
    id_movimiento: 5,
    tipo_movimiento: "MERMA",
    fecha_hora: "2024-02-15T14:00:00",
    usuario: "Roberto Silva",
    motivo_ajuste: "Productos vencidos dados de baja según protocolo sanitario",
    detalles: [
      { producto: "Clonazepam 2mg x30", cantidad: 8, costo_unitario: 16.0 },
    ],
    total_movimiento: 128.0,
  },
  {
    id_movimiento: 6,
    tipo_movimiento: "COMPRA",
    fecha_hora: "2024-02-14T16:00:00",
    usuario: "Roberto Silva",
    detalles: [
      { producto: "Losartan 50mg x30", cantidad: 40, costo_unitario: 18.0 },
      { producto: "Metformina 850mg x60", cantidad: 25, costo_unitario: 20.0 },
    ],
    total_movimiento: 1220.0,
  },
  {
    id_movimiento: 7,
    tipo_movimiento: "VENTA",
    fecha_hora: "2024-02-14T17:30:00",
    usuario: "María López",
    detalles: [
      { producto: "Panadol Jarabe 60ml", cantidad: 5, costo_unitario: 7.0 },
      { producto: "Ibuprofeno 400mg x20", cantidad: 3, costo_unitario: 9.0 },
    ],
    total_movimiento: 62.0,
  },
  {
    id_movimiento: 8,
    tipo_movimiento: "AJUSTE",
    fecha_hora: "2024-02-14T09:00:00",
    usuario: "Juan Pérez",
    motivo_ajuste: "Ajuste por error de registro en sistema anterior",
    detalles: [
      { producto: "Amoxil 500mg x12", cantidad: 10, costo_unitario: 11.0 },
    ],
    total_movimiento: 110.0,
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

/* ─── Helper Functions ──────────────────────────────────────────────── */
const getTipoMovimientoConfig = (tipo: TipoMovimiento) => {
  switch (tipo) {
    case "COMPRA":
      return {
        color: "#06b6d4",
        bg: "rgba(6, 182, 212, 0.1)",
        icon: ShoppingCart,
        label: "Compra",
        description: "Ingreso de mercadería",
      };
    case "VENTA":
      return {
        color: "#10b981",
        bg: "rgba(16, 185, 129, 0.1)",
        icon: TrendingUp,
        label: "Venta",
        description: "Salida por venta",
      };
    case "AJUSTE":
      return {
        color: "#f59e0b",
        bg: "rgba(245, 158, 11, 0.1)",
        icon: AlertCircle,
        label: "Ajuste",
        description: "Corrección de inventario",
      };
    case "DEVOLUCION":
      return {
        color: "#8b5cf6",
        bg: "rgba(139, 92, 246, 0.1)",
        icon: RotateCcw,
        label: "Devolución",
        description: "Retorno de producto",
      };
    case "MERMA":
      return {
        color: "#ef4444",
        bg: "rgba(239, 68, 68, 0.1)",
        icon: Trash2,
        label: "Merma",
        description: "Baja de producto",
      };
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  REPORTES MOVIMIENTOS COMPONENT                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export default function ReportesMovimientos({ isDark = true }: { isDark?: boolean }) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTipo, setSelectedTipo] = useState<TipoMovimiento | "TODOS">("TODOS");
  const [searchTerm, setSearchTerm] = useState("");

  const t = getTheme(isDark);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalMovimientos = mockMovimientos.length;
    const movimientosPorTipo = mockMovimientos.reduce((acc, mov) => {
      acc[mov.tipo_movimiento] = (acc[mov.tipo_movimiento] || 0) + 1;
      return acc;
    }, {} as Record<TipoMovimiento, number>);

    const valorPorTipo = mockMovimientos.reduce((acc, mov) => {
      acc[mov.tipo_movimiento] = (acc[mov.tipo_movimiento] || 0) + mov.total_movimiento;
      return acc;
    }, {} as Record<TipoMovimiento, number>);

    const usuariosActivos = [...new Set(mockMovimientos.map((m) => m.usuario))].length;

    const movimientosHoy = mockMovimientos.filter((m) => {
      const fecha = new Date(m.fecha_hora);
      const hoy = new Date();
      return fecha.toDateString() === hoy.toDateString();
    }).length;

    return {
      totalMovimientos,
      movimientosPorTipo,
      valorPorTipo,
      usuariosActivos,
      movimientosHoy,
    };
  }, []);

  // Filter movements
  const movimientosFiltrados = useMemo(() => {
    return mockMovimientos
      .filter((mov) => {
        if (selectedTipo !== "TODOS" && mov.tipo_movimiento !== selectedTipo) return false;
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          return (
            mov.usuario.toLowerCase().includes(searchLower) ||
            mov.detalles.some((d) => d.producto.toLowerCase().includes(searchLower)) ||
            mov.motivo_ajuste?.toLowerCase().includes(searchLower)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(b.fecha_hora).getTime() - new Date(a.fecha_hora).getTime());
  }, [selectedTipo, searchTerm]);

  const tiposMovimiento: TipoMovimiento[] = ["COMPRA", "VENTA", "AJUSTE", "DEVOLUCION", "MERMA"];

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          marginBottom: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
            Reporte de Movimientos
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Historial completo de transacciones de inventario
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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
            <Filter size={16} />
            Filtros
          </button>

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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Total Movimientos */}
        <div
          style={{
            background: "linear-gradient(135deg, #0891b2 0%, #06b6d4 40%, #0e7490 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(8, 145, 178, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Activity size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Total Movimientos
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
              {stats.totalMovimientos}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              {stats.movimientosHoy} registrados hoy
            </p>
          </div>
        </div>

        {/* Compras */}
        <div
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 40%, #0f766e 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(13, 148, 136, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <ShoppingCart size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Compras
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
              {stats.movimientosPorTipo["COMPRA"] || 0}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              S/ {(stats.valorPorTipo["COMPRA"] || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Ventas */}
        <div
          style={{
            background: "linear-gradient(135deg, #059669 0%, #10b981 40%, #047857 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(5, 150, 105, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <TrendingUp size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Ventas
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
              {stats.movimientosPorTipo["VENTA"] || 0}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              S/ {(stats.valorPorTipo["VENTA"] || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Otros Movimientos */}
        <div
          style={{
            background: "linear-gradient(135deg, #64748b 0%, #94a3b8 40%, #475569 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(100, 116, 139, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.2)",
                  backdropFilter: "blur(10px)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              >
                <Layers size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.8)",
                marginBottom: "8px",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              Otros Movimientos
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
              {(stats.movimientosPorTipo["AJUSTE"] || 0) +
                (stats.movimientosPorTipo["DEVOLUCION"] || 0) +
                (stats.movimientosPorTipo["MERMA"] || 0)}
            </p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <span
                style={{
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
              >
                Ajustes: {stats.movimientosPorTipo["AJUSTE"] || 0}
              </span>
              <span
                style={{
                  fontSize: "10px",
                  padding: "3px 8px",
                  borderRadius: "6px",
                  background: "rgba(255,255,255,0.15)",
                  color: "#ffffff",
                }}
              >
                Mermas: {stats.movimientosPorTipo["MERMA"] || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Distribution by Type - Horizontal Bars */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Distribución por Tipo
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>Cantidad de movimientos por categoría</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {tiposMovimiento.map((tipo) => {
              const config = getTipoMovimientoConfig(tipo);
              const cantidad = stats.movimientosPorTipo[tipo] || 0;
              const maxCantidad = Math.max(...Object.values(stats.movimientosPorTipo));
              const percentage = maxCantidad > 0 ? (cantidad / maxCantidad) * 100 : 0;
              const IconComponent = config.icon;

              return (
                <div key={tipo}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "10px",
                          background: config.bg,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          border: `1px solid ${config.color}30`,
                        }}
                      >
                        <IconComponent size={16} color={config.color} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>{config.label}</p>
                        <p style={{ fontSize: "11px", color: t.textSecondary }}>{config.description}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: "18px", fontWeight: 700, color: config.color }}>{cantidad}</span>
                  </div>
                  <div
                    style={{
                      height: "10px",
                      background: t.innerBg,
                      borderRadius: "999px",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: `${percentage}%`,
                        height: "100%",
                        background: `linear-gradient(90deg, ${config.color} 0%, ${config.color}cc 100%)`,
                        borderRadius: "999px",
                        transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                        boxShadow: `0 0 8px ${config.color}60`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Timeline */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Actividad Reciente
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>Últimos movimientos registrados</p>
          </div>

          <div style={{ maxHeight: "380px", overflowY: "auto", paddingRight: "8px" }}>
            {mockMovimientos.slice(0, 6).map((mov, index) => {
              const config = getTipoMovimientoConfig(mov.tipo_movimiento);
              const IconComponent = config.icon;

              return (
                <div
                  key={mov.id_movimiento}
                  style={{
                    position: "relative",
                    paddingLeft: "40px",
                    paddingBottom: index < 5 ? "24px" : "0",
                  }}
                >
                  {/* Timeline line */}
                  {index < 5 && (
                    <div
                      style={{
                        position: "absolute",
                        left: "15px",
                        top: "32px",
                        bottom: "0",
                        width: "2px",
                        background: t.border,
                      }}
                    />
                  )}

                  {/* Timeline dot with icon */}
                  <div
                    style={{
                      position: "absolute",
                      left: "0",
                      top: "0",
                      width: "32px",
                      height: "32px",
                      borderRadius: "10px",
                      background: config.bg,
                      border: `2px solid ${config.color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 1,
                    }}
                  >
                    <IconComponent size={14} color={config.color} strokeWidth={2.5} />
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      background: t.innerBg,
                      border: `1px solid ${t.border}`,
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = config.color;
                      (e.currentTarget as HTMLDivElement).style.background = config.bg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLDivElement).style.borderColor = t.border;
                      (e.currentTarget as HTMLDivElement).style.background = t.innerBg;
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: config.color,
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {config.label}
                      </span>
                      <span style={{ fontSize: "11px", color: t.textSecondary }}>{formatTime(mov.fecha_hora)}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: t.textPrimary, marginBottom: "4px" }}>
                      {mov.detalles[0].producto}
                      {mov.detalles.length > 1 && ` +${mov.detalles.length - 1} más`}
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "11px", color: t.textSecondary }}>
                        <User size={10} style={{ display: "inline", marginRight: "4px" }} />
                        {mov.usuario}
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: t.accent }}>
                        S/ {mov.total_movimiento.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      {showFilters && (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.borderCard}`,
            borderRadius: "20px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {/* Search */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                Buscar
              </label>
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }}
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Usuario, producto, motivo..."
                  style={{
                    width: "100%",
                    padding: "10px 10px 10px 36px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.inputBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                Tipo de Movimiento
              </label>
              <select
                value={selectedTipo}
                onChange={(e) => setSelectedTipo(e.target.value as TipoMovimiento | "TODOS")}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "12px",
                  border: `1px solid ${t.border}`,
                  background: t.inputBg,
                  color: t.textPrimary,
                  fontSize: "13px",
                  fontFamily: "'Cairo', sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              >
                <option value="TODOS">Todos</option>
                {tiposMovimiento.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {getTipoMovimientoConfig(tipo).label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Movements Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
        <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Historial de Movimientos
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Mostrando {movimientosFiltrados.length} de {mockMovimientos.length} movimientos
            </p>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: "0 8px" }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Tipo
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Fecha
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Usuario
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Productos
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Motivo
                </th>
                <th
                  style={{
                    textAlign: "right",
                    padding: "12px 16px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: t.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {movimientosFiltrados.map((mov) => {
                const config = getTipoMovimientoConfig(mov.tipo_movimiento);
                const IconComponent = config.icon;

                return (
                  <tr
                    key={mov.id_movimiento}
                    style={{
                      background: t.innerBg,
                      transition: "all 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      const row = e.currentTarget as HTMLTableRowElement;
                      row.style.background = t.hoverBg;
                      row.style.transform = "scale(1.01)";
                    }}
                    onMouseLeave={(e) => {
                      const row = e.currentTarget as HTMLTableRowElement;
                      row.style.background = t.innerBg;
                      row.style.transform = "scale(1)";
                    }}
                  >
                    <td style={{ padding: "16px", borderRadius: "12px 0 0 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: config.bg,
                            border: `1px solid ${config.color}30`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconComponent size={16} color={config.color} strokeWidth={2.5} />
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: config.color }}>{config.label}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <Calendar size={14} color={t.textMuted} />
                        <div>
                          <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>{formatDate(mov.fecha_hora)}</p>
                          <p style={{ fontSize: "11px", color: t.textSecondary }}>{formatTime(mov.fecha_hora)}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <User size={14} color={t.textMuted} />
                        <span style={{ fontSize: "13px", color: t.textPrimary }}>{mov.usuario}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <p style={{ fontSize: "13px", color: t.textPrimary, marginBottom: "2px" }}>{mov.detalles[0].producto}</p>
                      {mov.detalles.length > 1 && (
                        <p style={{ fontSize: "11px", color: t.textSecondary }}>+{mov.detalles.length - 1} productos más</p>
                      )}
                    </td>
                    <td style={{ padding: "16px" }}>
                      {mov.motivo_ajuste ? (
                        <p style={{ fontSize: "12px", color: t.textSecondary, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {mov.motivo_ajuste}
                        </p>
                      ) : (
                        <span style={{ fontSize: "12px", color: t.textMuted }}>-</span>
                      )}
                    </td>
                    <td style={{ padding: "16px", borderRadius: "0 12px 12px 0", textAlign: "right" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: t.accent }}>
                        S/ {mov.total_movimiento.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {movimientosFiltrados.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: t.textSecondary }}>
            <Package size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "14px" }}>No se encontraron movimientos con los filtros seleccionados</p>
          </div>
        )}
      </div>
    </div>
  );
}
