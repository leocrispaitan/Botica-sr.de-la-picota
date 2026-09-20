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
  Activity,
  AlertTriangle,
  BarChart3,
  Boxes,
  Calendar,
  ChartPie,
  Clock,
  DollarSign,
  Download,
  Inbox,
  Layers,
  Package,
  Receipt,
  RefreshCw,
  Repeat,
  RotateCcw,
  ShoppingCart,
  SlidersHorizontal,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import reportesService from "../../services/reportesService";
import type { ReporteMovimientos } from "../../services/reportesService";
import { exportMovementsReportPdf } from "../../utils/pdfUtils";
import type { MovementsReportChartImages } from "../../utils/pdfUtils";

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

/* ─── Paleta de tipos ──────────────────────────────────────────────── */
const TIPO_COLORS: Record<string, string> = {
  COMPRA: "#06b6d4",
  VENTA: "#10b981",
  AJUSTE: "#f59e0b",
  DEVOLUCION: "#8b5cf6",
  MERMA: "#f43f5e",
};

const TIPO_CONFIG: Record<
  string,
  { color: string; bg: string; icon: typeof ShoppingCart; label: string }
> = {
  COMPRA: { color: "#06b6d4", bg: "rgba(6,182,212,0.12)", icon: ShoppingCart, label: "Compras" },
  VENTA: { color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: TrendingUp, label: "Ventas" },
  AJUSTE: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: SlidersHorizontal, label: "Ajustes" },
  DEVOLUCION: { color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", icon: RotateCcw, label: "Devoluciones" },
  MERMA: { color: "#f43f5e", bg: "rgba(244,63,94,0.12)", icon: Trash2, label: "Mermas" },
};

const tipoColor = (t: string) => TIPO_COLORS[t] || "#64748b";
const tipoConfig = (t: string) =>
  TIPO_CONFIG[t] || { color: "#64748b", bg: "rgba(100,116,139,0.12)", icon: Package, label: t };

/* ─── Helpers ───────────────────────────────────────────────────────── */
const moneyFmt = (v: number) =>
  v.toLocaleString("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 });

const moneyTick = (v: number) => (v >= 1000 ? `S/${(v / 1000).toFixed(1)}k` : `S/${v}`);

const numFmt = (v: number) => v.toLocaleString("es-PE");

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

const fechaHora = (iso: string) =>
  new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const fechaLarga = (iso: string) =>
  new Date(`${iso.slice(0, 10)}T00:00:00`).toLocaleDateString("es-PE", {
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
            {money ? moneyFmt(Number(p.value) || 0) : `${numFmt(Number(p.value) || 0)}${suffix || ""}`}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Card de KPI ───────────────────────────────────────────────────── */
function KpiCard({
  icon,
  label,
  value,
  gradient,
  boxShadow,
  index,
  sub,
  chips,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  gradient: string;
  boxShadow: string;
  index: number;
  sub: string;
  chips?: ReactNode;
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
        <p style={{ fontSize: 28, fontWeight: 800, color: "#ffffff", lineHeight: 1.1 }}>{value}</p>
        <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.62)", marginTop: 6 }}>{sub}</p>
        {chips ? <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>{chips}</div> : null}
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
/*  REPORTES MOVIMIENTOS COMPONENT                                      */
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

export default function ReportesMovimientos({ isDark = true }: { isDark?: boolean }) {
  const t = getTheme(isDark);

  const [preset, setPreset] = useState<Preset>("30d");
  const [desdeInput, setDesdeInput] = useState("");
  const [hastaInput, setHastaInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [reporte, setReporte] = useState<ReporteMovimientos | null>(null);
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
      .getReporteMovimientos(r.desde, r.hasta)
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
    if (reporte.rango.periodo_completo) return "Todo el historial de movimientos";
    return `Movimientos del ${reporte.rango.desde ? fechaLarga(reporte.rango.desde) : "—"} al ${
      reporte.rango.hasta ? fechaLarga(reporte.rango.hasta) : "—"
    }`;
  }, [reporte]);

  const kpis = reporte?.kpis;
  const crecimiento = reporte?.crecimiento;

  const balanceSeries = useMemo(() => {
    let acc = 0;
    return (reporte?.serie_diaria || []).map((d) => {
      acc += d.neto;
      return { etiqueta: d.etiqueta, balance: acc, neto: d.neto };
    });
  }, [reporte]);

  const tipos = reporte?.por_tipo || [];
  const top6 = useMemo(() => (reporte?.top_productos || []).slice(0, 6), [reporte]);
  const usuarios = reporte?.usuarios_activos || [];
  const recientes = reporte?.movimientos_recientes || [];

  const maxUsuarioMovs = Math.max(1, ...usuarios.map((u) => u.movimientos));

  // ─── Exportar PDF ───────────────────────────────────────────────────
  const handleExport = async () => {
    if (!reporte || exporting) return;
    setExporting(true);
    const toastId = toast.loading("Generando reporte PDF…");
    try {
      const refs: Array<[keyof MovementsReportChartImages, string]> = [
        ["balance", "chart-balance"],
        ["tipos", "chart-tipos"],
        ["hora", "chart-hora"],
        ["top", "chart-top"],
      ];
      const chartImages: MovementsReportChartImages = {};
      for (const [key, id] of refs) {
        const node = document.getElementById(id);
        if (!node) continue;
        chartImages[key] = await toPng(node, { pixelRatio: 2, backgroundColor: t.cardBg });
      }
      exportMovementsReportPdf({
        meta: {
          desde: reporte.rango.desde,
          hasta: reporte.rango.hasta,
          dias: reporte.rango.dias,
          periodo_completo: reporte.rango.periodo_completo,
        },
        kpis: reporte.kpis,
        crecimiento: reporte.crecimiento,
        porTipo: reporte.por_tipo,
        topProductos: reporte.top_productos,
        usuariosActivos: reporte.usuarios_activos,
        recientes: reporte.movimientos_recientes.map((m) => ({
          id_movimiento: m.id_movimiento,
          tipo_movimiento: m.tipo_movimiento,
          fecha_hora: m.fecha_hora,
          usuario: m.usuario,
          unidades: m.unidades,
          valor: m.valor,
        })),
        chartImages,
      });
      toast.success("Reporte de movimientos exportado a PDF", { id: toastId });
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

  const noData = !loading && !error && reporte && kpis && kpis.total_movimientos === 0;

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
                background: `linear-gradient(135deg, ${t.accent} 0%, #06b6d4 120%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 6px 16px ${t.accent}40`,
              }}
            >
              <Layers size={22} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, lineHeight: 1.1 }}>
                Reporte de Movimientos
              </h1>
              <p style={{ fontSize: 12.5, color: t.textSecondary }}>
                {reporte ? `${periodLabel} · ${numFmt(kpis?.total_movimientos || 0)} movimientos` : periodLabel}
              </p>
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
            disabled={exporting || !reporte || !kpis || kpis.total_movimientos === 0}
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
              opacity: exporting || !reporte || !kpis || kpis.total_movimientos === 0 ? 0.55 : 1,
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
              <SkeletonCard key={i} h={160} theme={t} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
            <SkeletonCard h={320} theme={t} />
            <SkeletonCard h={320} theme={t} />
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
            Aún no hay movimientos registrados
          </h3>
          <p style={{ fontSize: 13, color: t.textSecondary, maxWidth: 420, margin: "0 auto" }}>
            Registra compras, ventas, ajustes, devoluciones o mermas para que este reporte muestre
            la actividad de tu inventario.
          </p>
        </div>
      )}

      {/* ─── Dashboard ──────────────────────────────────────────────── */}
      {!loading && !error && reporte && kpis && kpis.total_movimientos > 0 && (
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
              icon={<Activity size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Total Movimientos"
              value={numFmt(kpis.total_movimientos)}
              sub={`${kpis.movimientos_hoy} hoy · ${kpis.usuarios_activos} usuarios activos`}
              gradient="linear-gradient(135deg, #0891b2 0%, #22d3ee 45%, #0e7490 130%)"
              boxShadow="0 8px 22px rgba(8,145,178,0.28)"
              chips={
                crecimiento?.movimientos !== null && crecimiento?.movimientos !== undefined ? (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {`${crecimiento.movimientos >= 0 ? "+" : ""}${crecimiento.movimientos.toFixed(1)}% vs período anterior`}
                  </span>
                ) : undefined
              }
            />
            <KpiCard
              index={1}
              icon={<Boxes size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Unidades Movidas"
              value={numFmt(kpis.unidades_movidas)}
              sub={`${kpis.productos_movidos} productos distintos`}
              gradient="linear-gradient(135deg, #7c3aed 0%, #a78bfa 45%, #6d28d9 130%)"
              boxShadow="0 8px 22px rgba(124,58,237,0.28)"
              chips={
                crecimiento?.unidades !== null && crecimiento?.unidades !== undefined ? (
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                    }}
                  >
                    {`${crecimiento.unidades >= 0 ? "+" : ""}${crecimiento.unidades.toFixed(1)}%`}
                  </span>
                ) : undefined
              }
            />
            <KpiCard
              index={2}
              icon={<DollarSign size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Valor Movido"
              value={moneyFmt(kpis.valor_total)}
              sub={`Entradas ${moneyFmt(kpis.entradas_valor)} · Salidas ${moneyFmt(kpis.salidas_valor)}`}
              gradient="linear-gradient(135deg, #059669 0%, #34d399 45%, #047857 130%)"
              boxShadow="0 8px 22px rgba(5,150,105,0.28)"
            />
            <KpiCard
              index={3}
              icon={<Repeat size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Balance Unidades"
              value={`${kpis.balance_unidades >= 0 ? "+" : ""}${numFmt(kpis.balance_unidades)}`}
              sub="entradas − salidas en el período"
              gradient="linear-gradient(135deg, #d97706 0%, #fbbf24 45%, #b45309 130%)"
              boxShadow="0 8px 22px rgba(217,119,6,0.28)"
              chips={
                <>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: "#10b981" }} />
                    Entradas {numFmt(kpis.entradas_unid)} · {kpis.entradas_mov} movs
                  </span>
                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.16)",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: 999, background: "#f43f5e" }} />
                    Salidas {numFmt(kpis.salidas_unid)} · {kpis.salidas_mov} movs
                  </span>
                </>
              }
            />
          </div>

          {/* Fila 1: balance acumulado + tipos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Balance acumulado */}
            <div style={chartCard(320)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Balance acumulado</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>
                    Evolución del saldo neto de unidades (entradas − salidas)
                  </p>
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
                  <Activity size={13} />
                  {`${kpis.balance_unidades >= 0 ? "+" : ""}${numFmt(kpis.balance_unidades)} uds.`}
                </div>
              </div>
              <div id="chart-balance" style={{ width: "100%", height: 250 }}>
                {balanceSeries.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={balanceSeries} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity={0.45} />
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
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} width={46} allowDecimals={false} />
                      <Tooltip content={<ChartTooltip theme={t} suffix=" uds" />} cursor={{ stroke: t.border, strokeDasharray: "3 3" }} />
                      <Area
                        type="monotone"
                        dataKey="balance"
                        name="Balance"
                        stroke="#10b981"
                        strokeWidth={2.5}
                        fill="url(#gradBalance)"
                        dot={false}
                        activeDot={{ r: 5, strokeWidth: 2, stroke: t.cardBg }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Inbox size={26} color={t.textMuted} />
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin movimientos en el período.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Donut por tipo */}
            <div style={chartCard(320)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <ChartPie size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Movimientos por tipo</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Documentos registrados</p>
              <div id="chart-tipos" style={{ position: "relative", width: "100%", height: 175 }}>
                {tipos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={tipos}
                        dataKey="movimientos"
                        nameKey="tipo"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={74}
                        paddingAngle={3}
                        cornerRadius={6}
                        stroke="none"
                      >
                        {tipos.map((pt, i) => (
                          <Cell key={i} fill={tipoColor(pt.tipo)} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip theme={t} suffix=" movs" />} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Inbox size={26} color={t.textMuted} />
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin tipos registrados.</p>
                  </div>
                )}
                {tipos.length > 0 && (
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
                    <div style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary }}>{kpis.total_movimientos}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600 }}>movimientos</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                {tipos.slice(0, 5).map((pt) => {
                  const cfg = tipoConfig(pt.tipo);
                  return (
                    <div
                      key={pt.tipo}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: t.innerBg,
                        borderRadius: 10,
                        padding: "6px 10px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 11.5,
                          fontWeight: 700,
                          color: t.textPrimary,
                        }}
                      >
                        <span style={{ width: 8, height: 8, borderRadius: 3, background: cfg.color }} />
                        {cfg.label}
                      </span>
                      <span style={{ fontSize: 11.5, fontWeight: 800, color: t.textSecondary }}>
                        {pt.movimientos} movs · {pt.porcentaje.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Fila 2: diario + hora + usuarios */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Entradas vs salidas por día */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <BarChart3 size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Entradas vs salidas diarias</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Unidades por día en el período</p>
              <div id="chart-diario" style={{ width: "100%", height: 220 }}>
                {reporte.serie_diaria.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporte.serie_diaria} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                      <XAxis dataKey="etiqueta" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
                      <Tooltip content={<ChartTooltip theme={t} suffix=" uds" />} cursor={{ fill: `${t.accent}0d` }} />
                      <Bar dataKey="entradas" name="Entradas" fill={TIPO_COLORS.COMPRA} radius={[4, 4, 0, 0]} maxBarSize={20} />
                      <Bar dataKey="salidas" name="Salidas" fill={TIPO_COLORS.MERMA} radius={[4, 4, 0, 0]} maxBarSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Inbox size={26} color={t.textMuted} />
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin movimientos diarios.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Actividad por hora */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Clock size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Actividad por hora</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Unidades movidas según la hora</p>
              <div id="chart-hora" style={{ width: "100%", height: 220 }}>
                {reporte.por_hora.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporte.por_hora} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                      <XAxis dataKey="hora" tick={axisTick} tickLine={false} axisLine={false} interval={1} />
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
                      <Tooltip content={<ChartTooltip theme={t} suffix=" uds" />} cursor={{ fill: `${t.accent}0d` }} />
                      <Bar dataKey="entradas" name="Entradas" stackId="h" fill={TIPO_COLORS.COMPRA} maxBarSize={22} />
                      <Bar dataKey="salidas" name="Salidas" stackId="h" fill={TIPO_COLORS.MERMA} maxBarSize={22} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Inbox size={26} color={t.textMuted} />
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin actividad horaria.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Usuarios más activos */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Users size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Usuarios más activos</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 16 }}>Movimientos registrados por usuario</p>
              {usuarios.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {usuarios.slice(0, 5).map((u, i) => {
                    const color = [TIPO_COLORS.COMPRA, TIPO_COLORS.VENTA, TIPO_COLORS.AJUSTE, TIPO_COLORS.DEVOLUCION, TIPO_COLORS.MERMA][i % 5];
                    const pct = (u.movimientos / maxUsuarioMovs) * 100;
                    return (
                      <div key={u.nombre}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                            <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
                            {u.nombre}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: t.textPrimary }}>
                            {u.movimientos} movs · {numFmt(u.unidades)} uds
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
                              background: `linear-gradient(90deg, ${color} 0%, ${color}bb 100%)`,
                              borderRadius: 999,
                              transition: "width 0.6s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ fontSize: 13, color: t.textMuted }}>Sin usuarios con movimientos.</p>
              )}
            </div>
          </div>

          {/* Fila 3: top productos + recientes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Top productos movidos */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Top productos movidos</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Productos con mayor valor de movimiento</p>
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
                  {top6.length} destacados
                </div>
              </div>
              <div id="chart-top" style={{ width: "100%", height: 250 }}>
                {top6.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top6} layout="vertical" margin={{ top: 6, right: 14, left: 8, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} horizontal={false} />
                      <XAxis type="number" tick={axisTick} tickLine={false} axisLine={false} tickFormatter={(v) => moneyTick(Number(v))} />
                      <YAxis
                        type="category"
                        dataKey="nombre"
                        tick={{ fill: t.textSecondary, fontSize: 10.5 }}
                        tickLine={false}
                        axisLine={false}
                        width={150}
                      />
                      <Tooltip content={<ChartTooltip theme={t} money />} cursor={{ fill: `${t.accent}0d` }} />
                      <Bar dataKey="valor" name="Valor" radius={[0, 6, 6, 0]} maxBarSize={18}>
                        {top6.map((_, i) => (
                          <Cell key={i} fill={[TIPO_COLORS.DEVOLUCION, TIPO_COLORS.COMPRA, TIPO_COLORS.VENTA, TIPO_COLORS.AJUSTE, TIPO_COLORS.MERMA][i % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ fontSize: 13, color: t.textMuted }}>Sin productos movidos.</p>
                )}
              </div>
            </div>

            {/* Últimos movimientos */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Receipt size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Últimos movimientos</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 12 }}>
                {recientes.length} registros más recientes del período
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 260, overflowY: "auto", paddingRight: 6 }}>
                {recientes.map((mov) => {
                  const cfg = tipoConfig(mov.tipo_movimiento);
                  const IconComponent = cfg.icon;
                  return (
                    <div
                      key={mov.id_movimiento}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        background: t.innerBg,
                        border: `1px solid ${t.border}`,
                        borderRadius: 12,
                        padding: "10px 12px",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: cfg.bg,
                          border: `1px solid ${cfg.color}30`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={16} color={cfg.color} strokeWidth={2.5} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                          <span style={{ fontSize: 11, color: t.textSecondary }}>{fechaHora(mov.fecha_hora)}</span>
                        </div>
                        <p
                          style={{
                            fontSize: 11.5,
                            color: t.textSecondary,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {mov.usuario} · {numFmt(mov.unidades)} uds
                        </p>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: t.accent }}>{moneyFmt(mov.valor)}</div>
                        <div style={{ fontSize: 10, color: t.textMuted }}>N° {mov.id_movimiento}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}