import { useEffect, useMemo, useState, type ReactNode, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toPng } from "html-to-image";
import toast, { Toaster } from "react-hot-toast";
import {
  DollarSign,
  ShoppingCart,
  CreditCard,
  Users,
  Download,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  Receipt,
  BarChart3,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import reportesService from "../services/reportesService";
import type { ReporteVentas } from "../services/reportesService";
import { exportSalesReportPdf } from "../utils/pdfUtils";
import type { SalesReportChartImages } from "../utils/pdfUtils";

/* ─── Theme ────────────────────────────────────────────────────────── */
type Theme = ReturnType<typeof getTheme>;

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

/* ─── Paleta ────────────────────────────────────────────────────────── */
const COLORS = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#f97316"];

const ESTADO_COLORS: Record<string, string> = {
  PAGADA: "#10b981",
  PENDIENTE: "#f59e0b",
  ANULADA: "#f43f5e",
};

const ESTADO_BG: Record<string, string> = {
  PAGADA: "rgba(16,185,129,0.14)",
  PENDIENTE: "rgba(245,158,11,0.14)",
  ANULADA: "rgba(244,63,94,0.14)",
};

/* ─── Helpers ───────────────────────────────────────────────────────── */
const moneyFmt = (v: number) =>
  v.toLocaleString("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });

const moneyTick = (v: number) =>
  v >= 1000 ? `S/${(v / 1000).toFixed(1)}k` : `S/${v}`;

const toYMD = (d: Date) => {
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const addDays = (d: Date, n: number) => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
};

const horaMin = (iso: string) => {
  const d = new Date(iso.replace(" ", "T"));
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const fechaLarga = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

type Preset = "7d" | "30d" | "90d" | "mes" | "todo" | "custom";

interface RangoResult {
  desde?: string;
  hasta?: string;
}

const getRango = (p: Preset, desde: string, hasta: string): RangoResult => {
  const hoy = new Date();
  switch (p) {
    case "7d":
      return { desde: toYMD(addDays(hoy, -6)), hasta: toYMD(hoy) };
    case "90d":
      return { desde: toYMD(addDays(hoy, -89)), hasta: toYMD(hoy) };
    case "mes":
      return { desde: toYMD(new Date(hoy.getFullYear(), hoy.getMonth(), 1)), hasta: toYMD(hoy) };
    case "custom":
      return { desde: desde || undefined, hasta: hasta || undefined };
    case "todo":
      return {};
    default:
      return { desde: toYMD(addDays(hoy, -29)), hasta: toYMD(hoy) };
  }
};

/* ─── Tooltip de gráficos ───────────────────────────────────────────── */
function ChartTooltip({
  active,
  payload,
  label,
  theme,
  money,
  suffix,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string | number;
  theme: Theme;
  money?: boolean;
  suffix?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        minWidth: 130,
      }}
    >
      {label !== undefined && label !== "" && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: theme.textSecondary,
            marginBottom: 6,
            textTransform: "capitalize",
          }}
        >
          {label}
        </div>
      )}
      {payload.map((p, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: theme.textSecondary,
            }}
          >
            <span style={{ width: 8, height: 8, borderRadius: 3, background: p.color }} />
            {p.name}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>
            {money ? moneyFmt(Number(p.value) || 0) : `${p.value ?? 0}${suffix || ""}`}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Tooltip para barras con ingresos + ventas ───────────────────────── */
function ChartTooltip2({
  active,
  payload,
  label,
  theme,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string | number;
  theme: Theme;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const ingresos = payload.find((p) => p.name === "ingresos")?.value || 0;
  const ventas = payload.find((p) => p.name === "ventas")?.value || 0;
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        minWidth: 130,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "#3b82f6", marginRight: 6 }} />
          Ventas
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{ventas}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "#10b981", marginRight: 6 }} />
          Ingresos
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{moneyFmt(ingresos)}</span>
      </div>
    </div>
  );
}

/* ─── Card de KPI ───────────────────────────────────────────────────── */
function KpiCard({
  icon,
  label,
  value,
  growth,
  gradient,
  boxShadow,
  index,
  sub,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  growth: number | null;
  gradient: string;
  boxShadow: string;
  index: number;
  sub: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      style={{
        background: gradient,
        borderRadius: 22,
        padding: "22px",
        position: "relative",
        overflow: "hidden",
        boxShadow,
        border: "1px solid rgba(255,255,255,0.12)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              background: "rgba(255,255,255,0.16)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {icon}
          </div>
          {growth !== null && growth !== undefined ? (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                padding: "4px 9px",
                borderRadius: 999,
                background: growth >= 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.22)",
                fontSize: 12,
                fontWeight: 700,
                color: "#ffffff",
              }}
            >
              {growth >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {growth >= 0 ? "+" : ""}
              {growth.toFixed(1)}%
            </div>
          ) : null}
        </div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "rgba(255,255,255,0.72)",
            marginBottom: 6,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          {label}
        </p>
        <p style={{ fontSize: 30, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.62)", marginTop: 6 }}>{sub}</p>
      </div>
    </motion.div>
  );
}

/* ─── Skeleton ──────────────────────────────────────────────────────── */
function SkeletonCard({ h, theme }: { h: number; theme: Theme }) {
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.borderCard}`,
        borderRadius: 20,
        padding: 20,
        height: h,
      }}
    >
      <div
        style={{
          width: "30%",
          height: 14,
          background: theme.innerBg,
          borderRadius: 6,
          animation: "reportesPulse 1.4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          width: "100%",
          height: 8,
          background: theme.innerBg,
          borderRadius: 6,
          marginTop: 10,
          animation: "reportesPulse 1.4s ease-in-out 0.15s infinite",
        }}
      />
      <div
        style={{
          width: "70%",
          height: 8,
          background: theme.innerBg,
          borderRadius: 6,
          marginTop: 8,
          animation: "reportesPulse 1.4s ease-in-out 0.3s infinite",
        }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  REPORTES VENTAS COMPONENT                                          */
/* ═══════════════════════════════════════════════════════════════════ */

type PresetOption = { id: Preset; label: string };

const PRESETS: PresetOption[] = [
  { id: "7d", label: "7 días" },
  { id: "30d", label: "30 días" },
  { id: "90d", label: "90 días" },
  { id: "mes", label: "Este mes" },
  { id: "todo", label: "Todo" },
  { id: "custom", label: "Personalizado" },
];

export default function ReportesVentas({ isDark = true }: { isDark?: boolean }) {
  const t = getTheme(isDark);

  const [preset, setPreset] = useState<Preset>("30d");
  const [desdeInput, setDesdeInput] = useState("");
  const [hastaInput, setHastaInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [reporte, setReporte] = useState<ReporteVentas | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const r = getRango(preset, desdeInput, hastaInput);

    if (preset === "custom" && (!r.desde || !r.hasta)) {
      setError("Selecciona las fechas de inicio y fin del período.");
      setReporte(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    reportesService
      .getReporteVentas(r.desde, r.hasta)
      .then((data) => {
        if (!cancelled) setReporte(data);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        const msg =
          err && typeof err === "object" && "response" in err
            ? String((err as { response?: { data?: { message?: string } } }).response?.data?.message || "No se pudo cargar el reporte.")
            : "No se pudo cargar el reporte.";
        setError(msg);
        setReporte(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [preset, desdeInput, hastaInput, refreshKey]);

  const periodLabel = useMemo(() => {
    if (!reporte) return "Cargando período…";
    if (reporte.rango.periodo_completo) return "Todo el período registrado";
    return `Del ${reporte.rango.desde ? fechaLarga(reporte.rango.desde) : "—"} al ${
      reporte.rango.hasta ? fechaLarga(reporte.rango.hasta) : "—"
    }`;
  }, [reporte]);

  const kpis = reporte?.kpis;

  const top5 = useMemo(() => (reporte?.top_productos || []).slice(0, 5), [reporte]);

  // ─── Exportar PDF ───────────────────────────────────────────────────
  const handleExport = async () => {
    if (!reporte || exporting) return;
    setExporting(true);
    const toastId = toast.loading("Generando reporte PDF…");
    try {
      const refs: Array<[keyof SalesReportChartImages, string]> = [
        ["area", "chart-area"],
        ["horas", "chart-horas"],
        ["metodo", "chart-metodo"],
        ["comprobante", "chart-comprobante"],
        ["productos", "chart-productos"],
      ];
      const chartImages: SalesReportChartImages = {};
      for (const [key, id] of refs) {
        const node = document.getElementById(id);
        if (!node) continue;
        chartImages[key] = await toPng(node, { pixelRatio: 2, backgroundColor: t.cardBg });
      }
      exportSalesReportPdf({
        meta: {
          desde: reporte.rango.desde,
          hasta: reporte.rango.hasta,
          dias: reporte.rango.dias,
          periodo_completo: reporte.rango.periodo_completo,
        },
        kpis: reporte.kpis,
        crecimiento: reporte.crecimiento,
        topProductos: reporte.top_productos,
        ventasRecientes: reporte.ventas_recientes,
        chartImages,
      });
      toast.success("Reporte de ventas exportado a PDF", { id: toastId });
    } catch {
      toast.error("No se pudo exportar el reporte", { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  const chartCard = (h: number): CSSProperties => ({
    background: t.cardBg,
    border: `1px solid ${t.borderCard}`,
    borderRadius: 20,
    padding: "20px 22px",
    height: h,
  });

  const axisTick = { fill: t.textMuted, fontSize: 11 };

  const noData = !loading && !error && reporte && kpis && kpis.total_ventas === 0;

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      <style>{`
        @keyframes reportesPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4500,
          style: {
            background: t.cardBg,
            color: t.textPrimary,
            border: `1px solid ${t.border}`,
            borderRadius: 12,
          },
        }}
      />

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div
        style={{
          marginBottom: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: `linear-gradient(135deg, ${t.accent} 0%, #3b82f6 120%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 6px 16px ${t.accent}40`,
              }}
            >
              <BarChart3 size={22} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, lineHeight: 1.1 }}>
                Reporte de Ventas
              </h1>
              <p style={{ fontSize: 12.5, color: t.textSecondary }}>{periodLabel}</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          {/* Rango */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: t.inputBg,
              border: `1px solid ${t.border}`,
              borderRadius: 14,
              padding: 4,
            }}
          >
            <Calendar size={15} color={t.textMuted} style={{ marginLeft: 8 }} />
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPreset(p.id)}
                style={{
                  padding: "7px 10px",
                  borderRadius: 10,
                  border: "none",
                  background: preset === p.id ? t.accent : "transparent",
                  color: preset === p.id ? "#ffffff" : t.textSecondary,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {preset === "custom" && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                background: t.inputBg,
                border: `1px solid ${t.border}`,
                borderRadius: 14,
                padding: "6px 8px",
              }}
            >
              <input
                type="date"
                value={desdeInput}
                onChange={(e) => setDesdeInput(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.textPrimary,
                  fontSize: 12,
                  fontFamily: "'Cairo', sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
              <span style={{ color: t.textMuted, fontSize: 12 }}>→</span>
              <input
                type="date"
                value={hastaInput}
                onChange={(e) => setHastaInput(e.target.value)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: t.textPrimary,
                  fontSize: 12,
                  fontFamily: "'Cairo', sans-serif",
                  outline: "none",
                  cursor: "pointer",
                }}
              />
            </div>
          )}

          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            disabled={loading}
            title="Actualizar"
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              border: `1px solid ${t.border}`,
              background: t.inputBg,
              color: t.textSecondary,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.2s",
            }}
          >
            <RefreshCw size={16} className={loading ? "reportes-spin" : ""} />
          </button>
          <style>{`
            @keyframes reportesSpin { to { transform: rotate(360deg); } }
            .reportes-spin { animation: reportesSpin 1s linear infinite; }
          `}</style>

          <button
            onClick={handleExport}
            disabled={exporting || !reporte || !kpis || kpis.total_ventas === 0}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "none",
              background: t.accent,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              boxShadow: `0 4px 14px ${t.accent}40`,
              opacity: exporting || !reporte || !kpis || kpis.total_ventas === 0 ? 0.55 : 1,
            }}
          >
            <Download size={15} />
            {exporting ? "Generando…" : "Exportar PDF"}
          </button>
        </div>
      </div>

      {/* ─── Cargando ───────────────────────────────────────────────── */}
      {loading && (
        <div style={{ display: "grid", gap: 20 }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 20,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <SkeletonCard key={i} h={150} theme={t} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <SkeletonCard h={300} theme={t} />
            <SkeletonCard h={300} theme={t} />
            <SkeletonCard h={300} theme={t} />
          </div>
        </div>
      )}

      {/* ─── Error ──────────────────────────────────────────────────── */}
      {!loading && error && (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.borderCard}`,
            borderRadius: 20,
            padding: "48px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "rgba(244,63,94,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <AlertTriangle size={30} color="#f43f5e" />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>
            No se pudo cargar el reporte
          </h3>
          <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 20 }}>{error}</p>
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            style={{
              padding: "10px 20px",
              borderRadius: 14,
              border: "none",
              background: t.accent,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* ─── Sin datos ──────────────────────────────────────────────── */}
      {noData && (
        <div
          style={{
            background: t.cardBg,
            border: `1px solid ${t.borderCard}`,
            borderRadius: 20,
            padding: "52px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              background: t.innerBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Inbox size={32} color={t.textMuted} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.textPrimary, marginBottom: 6 }}>
            Aún no hay ventas en este período
          </h3>
          <p style={{ fontSize: 13, color: t.textSecondary, marginBottom: 20, maxWidth: 420, margin: "0 auto 20px" }}>
            Registra ventas en el módulo de punto de venta o cambia el período para ver el reporte.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setPreset("todo")}
              style={{
                padding: "10px 20px",
                borderRadius: 14,
                border: "none",
                background: t.accent,
                color: "#fff",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              Ver todo el período
            </button>
          </div>
        </div>
      )}

      {/* ─── Dashboard ──────────────────────────────────────────────── */}
      {!loading && !error && reporte && kpis && kpis.total_ventas > 0 && (
        <>
          {/* KPIs */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 18,
              marginBottom: 20,
            }}
          >
            <KpiCard
              index={0}
              icon={<DollarSign size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Total Ingresos"
              value={moneyFmt(kpis.total_ingresos)}
              growth={reporte.crecimiento.ingresos}
              sub={`vs período anterior · ${kpis.unidades_vendidas} unidades`}
              gradient="linear-gradient(135deg, #10b981 0%, #34d399 45%, #059669 130%)"
              boxShadow="0 8px 22px rgba(16,185,129,0.28)"
            />
            <KpiCard
              index={1}
              icon={<ShoppingCart size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Total Ventas"
              value={String(kpis.total_ventas)}
              growth={reporte.crecimiento.ventas}
              sub="transacciones realizadas"
              gradient="linear-gradient(135deg, #3b82f6 0%, #60a5fa 45%, #2563eb 130%)"
              boxShadow="0 8px 22px rgba(59,130,246,0.28)"
            />
            <KpiCard
              index={2}
              icon={<CreditCard size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Ticket Promedio"
              value={moneyFmt(kpis.ticket_promedio)}
              growth={reporte.crecimiento.ticket}
              sub="por transacción"
              gradient="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 45%, #7c3aed 130%)"
              boxShadow="0 8px 22px rgba(139,92,246,0.28)"
            />
            <KpiCard
              index={3}
              icon={<Users size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Clientes Únicos"
              value={String(kpis.clientes_unicos)}
              growth={reporte.crecimiento.clientes}
              sub="clientes diferentes"
              gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #d97706 130%)"
              boxShadow="0 8px 22px rgba(245,158,11,0.28)"
            />
          </div>

          {/* Fila 1: tendencia + métodos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Tendencia */}
            <div style={chartCard(320)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Tendencia de ventas</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Ingresos diarios del período</p>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(16,185,129,0.12)",
                    color: "#10b981",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Package size={13} />
                  {kpis.unidades_vendidas} uds.
                </div>
              </div>
              <div id="chart-area" style={{ width: "100%", height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reporte.serie_diaria} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={0.55} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis
                      dataKey="etiqueta"
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                      minTickGap={28}
                    />
                    <YAxis
                      tick={axisTick}
                      tickLine={false}
                      axisLine={false}
                      width={52}
                      tickFormatter={(v) => moneyTick(Number(v))}
                    />
                    <Tooltip content={<ChartTooltip2 theme={t} />} cursor={{ stroke: t.border, strokeDasharray: "3 3" }} />
                    <Area
                      type="monotone"
                      dataKey="ingresos"
                      name="ingresos"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fill="url(#gradIngresos)"
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 2, stroke: t.cardBg }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Donut métodos */}
            <div style={chartCard(320)}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary, marginBottom: 2 }}>Métodos de pago</h3>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Distribución por ingresos</p>
              <div id="chart-metodo" style={{ position: "relative", width: "100%", height: 190 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reporte.por_metodo}
                      dataKey="ingresos"
                      nameKey="metodo"
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={82}
                      paddingAngle={3}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {(reporte.por_metodo || []).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip theme={t} money suffix="%" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    textAlign: "center",
                    pointerEvents: "none",
                  }}
                >
                  <div style={{ fontSize: 19, fontWeight: 800, color: t.textPrimary }}>{reporte.por_metodo.length}</div>
                  <div style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600 }}>métodos</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginTop: 8 }}>
                {(reporte.por_metodo || []).slice(0, 5).map((m, i) => (
                  <div
                    key={m.metodo}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: t.innerBg,
                      borderRadius: 10,
                      padding: "6px 8px",
                    }}
                  >
                    <span style={{ width: 8, height: 8, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 10.5, color: t.textSecondary, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {m.metodo}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: t.textPrimary }}>
                        {m.porcentaje.toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fila 2: horas + comprobantes + estados */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Por hora */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Clock size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Ventas por hora</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Horario con más actividad</p>
              <div id="chart-horas" style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reporte.por_hora} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis dataKey="hora" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
                    <Tooltip content={<ChartTooltip theme={t} suffix=" ventas" />} cursor={{ fill: `${t.accent}0d` }} />
                    <Bar dataKey="ventas" name="ventas" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={26} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Comprobantes */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Receipt size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Tipo de comprobante</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Cantidad por documento</p>
              <div id="chart-comprobante" style={{ width: "100%", height: 230 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reporte.por_comprobante} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                    <XAxis dataKey="comprobante" tick={axisTick} tickLine={false} axisLine={false} />
                    <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
                    <Tooltip content={<ChartTooltip theme={t} suffix=" ventas" />} cursor={{ fill: `${t.accent}0d` }} />
                    <Bar dataKey="ventas" name="ventas" radius={[6, 6, 0, 0]} maxBarSize={44}>
                      {(reporte.por_comprobante || []).map((_, i) => (
                        <Cell key={i} fill={[COLORS[4], COLORS[0], COLORS[3]][i % 3]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Estados */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <BarChart3 size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Estado de ventas</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 14 }}>Resumen general</p>
              {(reporte.por_estado || []).length > 0 ? (
                <>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {(reporte.por_estado || []).map((e) => (
                      <div
                        key={e.estado}
                        style={{
                          flex: e.ventas,
                          height: 10,
                          borderRadius: 6,
                          background: ESTADO_COLORS[e.estado] || COLORS[4],
                          minWidth: 4,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {(reporte.por_estado || []).map((e) => {
                      const total = (reporte.por_estado || []).reduce((a, b) => a + b.ventas, 0);
                      const pct = total > 0 ? (e.ventas / total) * 100 : 0;
                      return (
                        <div key={e.estado}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                              <span style={{ width: 9, height: 9, borderRadius: 3, background: ESTADO_COLORS[e.estado] || COLORS[4] }} />
                              {e.estado}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: t.textPrimary }}>
                              {e.ventas} · {pct.toFixed(0)}%
                            </span>
                          </div>
                          <div
                            style={{
                              width: "100%",
                              height: 8,
                              background: t.innerBg,
                              borderRadius: 999,
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                width: `${pct}%`,
                                height: "100%",
                                background: ESTADO_COLORS[e.estado] || COLORS[4],
                                borderRadius: 999,
                                transition: "width 0.6s ease",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <p style={{ fontSize: 13, color: t.textMuted }}>Sin datos de estado.</p>
              )}
            </div>
          </div>

          {/* Fila 3: top productos + últimas ventas */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
              gap: 18,
            }}
          >
            {/* Top productos */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Top productos</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Mayores ingresos del período</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 10px",
                    borderRadius: 999,
                    background: "rgba(139,92,246,0.12)",
                    color: "#8b5cf6",
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  <Package size={13} />
                  {top5.length} destacados
                </div>
              </div>
              <div id="chart-productos" style={{ width: "100%", height: 250 }}>
                {top5.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={top5}
                      layout="vertical"
                      margin={{ top: 6, right: 14, left: 8, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} horizontal={false} />
                      <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={(v) => moneyTick(Number(v))} />
                      <YAxis
                        type="category"
                        dataKey="nombre"
                        tick={{ fill: t.textSecondary, fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={118}
                      />
                      <Tooltip content={<ChartTooltip theme={t} money />} cursor={{ fill: `${t.accent}0d` }} />
                      <Bar dataKey="ingresos" name="ingresos" radius={[0, 6, 6, 0]} maxBarSize={18}>
                        {top5.map((_, i) => (
                          <Cell key={i} fill={[COLORS[2], COLORS[0], COLORS[1], COLORS[3], COLORS[5]][i % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ fontSize: 13, color: t.textMuted }}>Sin productos vendidos.</p>
                )}
              </div>
            </div>

            {/* Últimas ventas */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Últimas ventas</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Actividad más reciente</p>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: t.innerBg,
                    color: t.textSecondary,
                    fontSize: 11.5,
                    fontWeight: 700,
                  }}
                >
                  {reporte.ventas_recientes.length} registros
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", height: 250 }}>
                {reporte.ventas_recientes.length > 0 ? (
                  reporte.ventas_recientes.map((v) => (
                    <div
                      key={v.id_venta}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: t.innerBg,
                        borderRadius: 14,
                        padding: "10px 12px",
                        transition: "background 0.2s",
                      }}
                    >
                      <div
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: 12,
                          flexShrink: 0,
                          background: ESTADO_BG[v.estado_venta] || t.hoverBg,
                          color: ESTADO_COLORS[v.estado_venta] || t.textMuted,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {(v.cliente || "?").charAt(0)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {v.id_venta} · {v.cliente}
                        </div>
                        <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {horaMin(v.fecha_venta)} · {v.vendedor} · {v.metodo}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: t.textPrimary }}>{moneyFmt(v.total_pagar)}</div>
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: ESTADO_BG[v.estado_venta] || t.hoverBg,
                            color: ESTADO_COLORS[v.estado_venta] || t.textMuted,
                          }}
                        >
                          {v.estado_venta}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 13, color: t.textMuted }}>Sin ventas recientes.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}