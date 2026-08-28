import { useState, useMemo } from "react";
import {
  Package,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Boxes,
  Archive,
  Layers,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Producto {
  id_producto: number;
  nombre_comercial: string;
  categoria: string;
  stock_actual: number;
  stock_minimo: number;
  precio_venta: number;
  costo_referencial: number;
  ubicacion: string;
  dias_hasta_vencer: number;
  estado_stock: "OK" | "BAJO" | "CRITICO" | "AGOTADO";
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockProductos: Producto[] = [
  {
    id_producto: 1,
    nombre_comercial: "Panadol Jarabe 60ml",
    categoria: "ANALGESICOS",
    stock_actual: 50,
    stock_minimo: 10,
    precio_venta: 12.50,
    costo_referencial: 7.00,
    ubicacion: "Estante A1",
    dias_hasta_vencer: 180,
    estado_stock: "OK",
  },
  {
    id_producto: 2,
    nombre_comercial: "Amoxil 500mg x12",
    categoria: "ANTIBIOTICOS",
    stock_actual: 8,
    stock_minimo: 15,
    precio_venta: 18.00,
    costo_referencial: 11.00,
    ubicacion: "Estante B2",
    dias_hasta_vencer: 90,
    estado_stock: "BAJO",
  },
  {
    id_producto: 3,
    nombre_comercial: "Ibuprofeno 400mg x20",
    categoria: "ANALGESICOS",
    stock_actual: 3,
    stock_minimo: 10,
    precio_venta: 15.00,
    costo_referencial: 9.00,
    ubicacion: "Estante A2",
    dias_hasta_vencer: 45,
    estado_stock: "CRITICO",
  },
  {
    id_producto: 4,
    nombre_comercial: "Loratadina 10mg x30",
    categoria: "ANTIALERGICOS",
    stock_actual: 0,
    stock_minimo: 5,
    precio_venta: 12.00,
    costo_referencial: 7.50,
    ubicacion: "Estante C1",
    dias_hasta_vencer: 0,
    estado_stock: "AGOTADO",
  },
  {
    id_producto: 5,
    nombre_comercial: "Omeprazol 20mg x14",
    categoria: "GASTROENTEROLOGICOS",
    stock_actual: 35,
    stock_minimo: 10,
    precio_venta: 22.00,
    costo_referencial: 14.00,
    ubicacion: "Estante D1",
    dias_hasta_vencer: 210,
    estado_stock: "OK",
  },
  {
    id_producto: 6,
    nombre_comercial: "Clonazepam 2mg x30",
    categoria: "SISTEMA NERVIOSO",
    stock_actual: 18,
    stock_minimo: 8,
    precio_venta: 25.00,
    costo_referencial: 16.00,
    ubicacion: "Estante E1",
    dias_hasta_vencer: 150,
    estado_stock: "OK",
  },
  {
    id_producto: 7,
    nombre_comercial: "Losartan 50mg x30",
    categoria: "CARDIOVASCULAR",
    stock_actual: 6,
    stock_minimo: 12,
    precio_venta: 28.00,
    costo_referencial: 18.00,
    ubicacion: "Estante F1",
    dias_hasta_vencer: 60,
    estado_stock: "BAJO",
  },
  {
    id_producto: 8,
    nombre_comercial: "Metformina 850mg x60",
    categoria: "ANTIDIABETICOS",
    stock_actual: 42,
    stock_minimo: 15,
    precio_venta: 32.00,
    costo_referencial: 20.00,
    ubicacion: "Estante G1",
    dias_hasta_vencer: 240,
    estado_stock: "OK",
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
/*  REPORTES INVENTARIO COMPONENT                                     */
/* ═══════════════════════════════════════════════════════════════════ */
export default function ReportesInventario({ isDark = true }: { isDark?: boolean }) {
  const [showFilters, setShowFilters] = useState(false);

  const t = getTheme(isDark);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProductos = mockProductos.length;
    const stockOK = mockProductos.filter((p) => p.estado_stock === "OK").length;
    const stockBajo = mockProductos.filter((p) => p.estado_stock === "BAJO").length;
    const stockCritico = mockProductos.filter((p) => p.estado_stock === "CRITICO").length;
    const stockAgotado = mockProductos.filter((p) => p.estado_stock === "AGOTADO").length;

    const valorInventario = mockProductos.reduce(
      (sum, p) => sum + p.stock_actual * p.costo_referencial,
      0
    );
    const valorPotencialVenta = mockProductos.reduce(
      (sum, p) => sum + p.stock_actual * p.precio_venta,
      0
    );

    // Stock by category
    const stockPorCategoria = mockProductos.reduce((acc, p) => {
      if (!acc[p.categoria]) {
        acc[p.categoria] = { cantidad: 0, valor: 0 };
      }
      acc[p.categoria].cantidad += p.stock_actual;
      acc[p.categoria].valor += p.stock_actual * p.costo_referencial;
      return acc;
    }, {} as Record<string, { cantidad: number; valor: number }>);

    // Products expiring soon
    const proximosVencer = mockProductos
      .filter((p) => p.dias_hasta_vencer > 0 && p.dias_hasta_vencer <= 90)
      .sort((a, b) => a.dias_hasta_vencer - b.dias_hasta_vencer);

    return {
      totalProductos,
      stockOK,
      stockBajo,
      stockCritico,
      stockAgotado,
      valorInventario,
      valorPotencialVenta,
      stockPorCategoria,
      proximosVencer,
    };
  }, []);

  const categoriaColors = [
    { color: "#3b82f6", light: "rgba(59, 130, 246, 0.1)" },
    { color: "#10b981", light: "rgba(16, 185, 129, 0.1)" },
    { color: "#f59e0b", light: "rgba(245, 158, 11, 0.1)" },
    { color: "#8b5cf6", light: "rgba(139, 92, 246, 0.1)" },
    { color: "#ec4899", light: "rgba(236, 72, 153, 0.1)" },
    { color: "#06b6d4", light: "rgba(6, 182, 212, 0.1)" },
  ];

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
            Reporte de Inventario
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Análisis detallado del stock y valorización del inventario
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
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Productos */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #6366f1 0%, #818cf8 40%, #4f46e5 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(99, 102, 241, 0.25)",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ 
                width: "52px", 
                height: "52px", 
                borderRadius: "16px", 
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                <Package size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Total Productos
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
              {stats.totalProductos}
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
              <div style={{ 
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(255,255,255,0.15)",
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
              }}>
                ✓ {stats.stockOK} OK
              </div>
              <div style={{ 
                padding: "6px 12px",
                borderRadius: "8px",
                background: "rgba(239, 68, 68, 0.2)",
                fontSize: "11px",
                fontWeight: 600,
                color: "#ffffff",
              }}>
                ⚠ {stats.stockBajo + stats.stockCritico} Alerta
              </div>
            </div>
          </div>
        </div>

        {/* Valor Inventario */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ 
                width: "52px", 
                height: "52px", 
                borderRadius: "16px", 
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                <DollarSign size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Valor Inventario
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
              S/ {(stats.valorInventario / 1000).toFixed(1)}K
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              Costo: S/ {stats.valorInventario.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        {/* Stock Bajo */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ 
                width: "52px", 
                height: "52px", 
                borderRadius: "16px", 
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                <TrendingDown size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Stock Bajo
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
              {stats.stockBajo}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              productos requieren reorden
            </p>
          </div>
        </div>

        {/* Stock Crítico/Agotado */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #ef4444 0%, #f87171 40%, #dc2626 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)",
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ 
                width: "52px", 
                height: "52px", 
                borderRadius: "16px", 
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}>
                <AlertTriangle size={26} color="#ffffff" strokeWidth={2.5} />
              </div>
            </div>
            <p style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.8)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Crítico/Agotado
            </p>
            <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
              {stats.stockCritico + stats.stockAgotado}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)" }}>
              requieren atención urgente
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>
        {/* Stock by Category - Donut Chart */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Distribución por Categoría
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Stock actual por categoría de producto
            </p>
          </div>

          {/* Donut Chart Simulation */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px", position: "relative", height: "220px" }}>
            <div style={{ position: "relative", width: "220px", height: "220px" }}>
              {/* Center circle with total */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "140px",
                  height: "140px",
                  borderRadius: "50%",
                  background: t.innerBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <span style={{ fontSize: "32px", fontWeight: 700, color: t.textPrimary }}>
                  {mockProductos.reduce((sum, p) => sum + p.stock_actual, 0)}
                </span>
                <span style={{ fontSize: "12px", color: t.textSecondary, marginTop: "4px" }}>
                  Unidades
                </span>
              </div>

              {/* Donut segments */}
              <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
                {Object.entries(stats.stockPorCategoria).map(([categoria, data], index) => {
                  const total = Object.values(stats.stockPorCategoria).reduce((sum, d) => sum + d.cantidad, 0);
                  const percentage = (data.cantidad / total) * 100;
                  const circumference = 2 * Math.PI * 90;
                  const offset = circumference - (percentage / 100) * circumference;
                  const rotation = Object.entries(stats.stockPorCategoria)
                    .slice(0, index)
                    .reduce((sum, [, d]) => sum + (d.cantidad / total) * 100, 0);

                  return (
                    <circle
                      key={categoria}
                      cx="110"
                      cy="110"
                      r="90"
                      fill="none"
                      stroke={categoriaColors[index % categoriaColors.length].color}
                      strokeWidth="30"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      style={{
                        transformOrigin: "50% 50%",
                        transform: `rotate(${(rotation * 360) / 100}deg)`,
                        transition: "all 0.5s ease",
                      }}
                    />
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {Object.entries(stats.stockPorCategoria).map(([categoria, data], index) => {
              const total = Object.values(stats.stockPorCategoria).reduce((sum, d) => sum + d.cantidad, 0);
              const percentage = ((data.cantidad / total) * 100).toFixed(1);

              return (
                <div
                  key={categoria}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px",
                    borderRadius: "12px",
                    background: categoriaColors[index % categoriaColors.length].light,
                    border: `1px solid ${categoriaColors[index % categoriaColors.length].color}20`,
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateX(4px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${categoriaColors[index % categoriaColors.length].color}20`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "4px",
                        background: categoriaColors[index % categoriaColors.length].color,
                      }}
                    />
                    <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                      {categoria}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: t.textSecondary }}>
                      {data.cantidad} uds
                    </span>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: categoriaColors[index % categoriaColors.length].color,
                      }}
                    >
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stock Status Heatmap */}
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Estado del Stock
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Resumen visual del estado de todos los productos
            </p>
          </div>

          {/* Status Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
            {/* OK */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                border: "2px solid rgba(16, 185, 129, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={20} color="#10b981" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                  Stock OK
                </span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#10b981" }}>
                {stats.stockOK}
              </span>
              <span style={{ fontSize: "11px", color: t.textSecondary }}>
                {((stats.stockOK / stats.totalProductos) * 100).toFixed(1)}% del total
              </span>
            </div>

            {/* Bajo */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)",
                border: "2px solid rgba(245, 158, 11, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <TrendingDown size={20} color="#f59e0b" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                  Stock Bajo
                </span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#f59e0b" }}>
                {stats.stockBajo}
              </span>
              <span style={{ fontSize: "11px", color: t.textSecondary }}>
                {((stats.stockBajo / stats.totalProductos) * 100).toFixed(1)}% del total
              </span>
            </div>

            {/* Crítico */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                border: "2px solid rgba(239, 68, 68, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <AlertTriangle size={20} color="#ef4444" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                  Stock Crítico
                </span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#ef4444" }}>
                {stats.stockCritico}
              </span>
              <span style={{ fontSize: "11px", color: t.textSecondary }}>
                {((stats.stockCritico / stats.totalProductos) * 100).toFixed(1)}% del total
              </span>
            </div>

            {/* Agotado */}
            <div
              style={{
                padding: "20px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(100, 116, 139, 0.05) 100%)",
                border: "2px solid rgba(100, 116, 139, 0.2)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <XCircle size={20} color="#64748b" />
                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                  Agotado
                </span>
              </div>
              <span style={{ fontSize: "32px", fontWeight: 700, color: "#64748b" }}>
                {stats.stockAgotado}
              </span>
              <span style={{ fontSize: "11px", color: t.textSecondary }}>
                {((stats.stockAgotado / stats.totalProductos) * 100).toFixed(1)}% del total
              </span>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                height: "12px",
                borderRadius: "999px",
                overflow: "hidden",
                background: t.innerBg,
              }}
            >
              <div
                style={{
                  width: `${(stats.stockOK / stats.totalProductos) * 100}%`,
                  background: "#10b981",
                  transition: "width 0.5s ease",
                }}
              />
              <div
                style={{
                  width: `${(stats.stockBajo / stats.totalProductos) * 100}%`,
                  background: "#f59e0b",
                  transition: "width 0.5s ease",
                }}
              />
              <div
                style={{
                  width: `${(stats.stockCritico / stats.totalProductos) * 100}%`,
                  background: "#ef4444",
                  transition: "width 0.5s ease",
                }}
              />
              <div
                style={{
                  width: `${(stats.stockAgotado / stats.totalProductos) * 100}%`,
                  background: "#64748b",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Expiring Soon */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
              Productos Próximos a Vencer
            </h3>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Productos que vencen en los próximos 90 días
            </p>
          </div>
          <Clock size={20} color={t.accent} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {stats.proximosVencer.map((producto) => {
            const urgencia =
              producto.dias_hasta_vencer <= 30
                ? { color: "#ef4444", label: "Urgente", bg: "rgba(239, 68, 68, 0.1)" }
                : producto.dias_hasta_vencer <= 60
                ? { color: "#f59e0b", label: "Pronto", bg: "rgba(245, 158, 11, 0.1)" }
                : { color: "#10b981", label: "Normal", bg: "rgba(16, 185, 129, 0.1)" };

            return (
              <div
                key={producto.id_producto}
                style={{
                  padding: "16px",
                  borderRadius: "14px",
                  background: t.innerBg,
                  border: `1px solid ${t.border}`,
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${urgencia.color}20`;
                  (e.currentTarget as HTMLDivElement).style.borderColor = urgencia.color;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLDivElement).style.borderColor = t.border;
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <h4 style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, flex: 1 }}>
                    {producto.nombre_comercial}
                  </h4>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      background: urgencia.bg,
                      color: urgencia.color,
                      fontSize: "11px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      border: `1px solid ${urgencia.color}30`,
                    }}
                  >
                    {urgencia.label}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        height: "6px",
                        background: t.border,
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min((producto.dias_hasta_vencer / 90) * 100, 100)}%`,
                          height: "100%",
                          background: urgencia.color,
                          borderRadius: "999px",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: urgencia.color }}>
                    {producto.dias_hasta_vencer} días
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: t.textSecondary }}>
                  <span>Stock: {producto.stock_actual} uds</span>
                  <span>{producto.ubicacion}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
