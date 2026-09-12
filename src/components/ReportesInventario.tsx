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
  Package,
  Boxes,
  DollarSign,
  AlertTriangle,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  BarChart3,
  ChartPie,
  CheckCircle2,
  Inbox,
  Repeat,
  Activity,
} from "lucide-react";
import reportesService from "../services/reportesService";
import type { ReporteInventario } from "../services/reportesService";
import { exportInventoryReportPdf } from "../utils/pdfUtils";
import type { InventoryReportChartImages } from "../utils/pdfUtils";

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
const COLORS = ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#f43f5e", "#06b6d4", "#8b5cf6", "#f97316"];

const DEFAULT_ESTADO_COLORS: Record<string, string> = {
  OK: "#10b981",
  BAJO: "#f59e0b",
  CRITICO: "#f43f5e",
  AGOTADO: "#64748b",
};

const DEFAULT_ESTADO_BG: Record<string, string> = {
  OK: "rgba(16,185,129,0.14)",
  BAJO: "rgba(245,158,11,0.14)",
  CRITICO: "rgba(244,63,94,0.14)",
  AGOTADO: "rgba(100,116,139,0.14)",
};

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

/* ─── Tooltip para el área de stock (nivel + neto) ───────────────────── */
function ChangableTooltip({
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
  const nivel = payload.find((p) => p.name === "nivel")?.value || 0;
  const entradas = payload.find((p) => p.name === "entradas")?.value || 0;
  const salidas = payload.find((p) => p.name === "salidas")?.value || 0;
  return (
    <div
      style={{
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        borderRadius: 12,
        padding: "10px 12px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
        minWidth: 150,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 700, color: theme.textSecondary, marginBottom: 6 }}>{label}</div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "#6366f1", marginRight: 6 }} />
          Nivel stock
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{numFmt(nivel)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "#10b981", marginRight: 6 }} />
          Entradas
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{numFmt(entradas)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 18 }}>
        <span style={{ fontSize: 12, color: theme.textSecondary }}>
          <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 3, background: "#f43f5e", marginRight: 6 }} />
          Salidas
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: theme.textPrimary }}>{numFmt(salidas)}</span>
      </div>
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
/*  REPORTES INVENTARIO COMPONENT                                      */
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

export default function ReportesInventario({ isDark = true }: { isDark?: boolean }) {
  const t = getTheme(isDark);

  const [preset, setPreset] = useState<Preset>("30d");
  const [desdeInput, setDesdeInput] = useState("");
  const [hastaInput, setHastaInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [reporte, setReporte] = useState<ReporteInventario | null>(null);
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
      .getReporteInventario(r.desde, r.hasta)
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

  const estadoColor = (estado: string) => reporte?.paleta_estados?.[estado] || DEFAULT_ESTADO_COLORS[estado] || "#8b5cf6";
  const estadoBg = (estado: string) => DEFAULT_ESTADO_BG[estado] || "rgba(139,92,246,0.12)";

  const top5 = useMemo(() => (reporte?.top_valor || []).slice(0, 5), [reporte]);

  // ─── Exportar PDF ───────────────────────────────────────────────────
  const handleExport = async () => {
    if (!reporte || exporting) return;
    setExporting(true);
    const toastId = toast.loading("Generando reporte PDF…");
    try {
      const refs: Array<[keyof InventoryReportChartImages, string]> = [
        ["stock", "chart-stock"],
        ["categoria", "chart-categoria"],
        ["movimientos", "chart-movimientos"],
        ["tipos", "chart-tipos"],
        ["top", "chart-top"],
      ];
      const chartImages: InventoryReportChartImages = {};
      for (const [key, id] of refs) {
        const node = document.getElementById(id);
        if (!node) continue;
        chartImages[key] = await toPng(node, { pixelRatio: 2, backgroundColor: t.cardBg });
      }
      exportInventoryReportPdf({
        meta: {
          desde: reporte.rango.desde,
          hasta: reporte.rango.hasta,
          periodo_completo: reporte.rango.periodo_completo,
        },
        fecha_corte: reporte.fecha_corte,
        kpis: reporte.kpis,
        entradas_totales: reporte.kpis.entradas_totales,
        salidas_totales: reporte.kpis.salidas_totales,
        porEstado: reporte.por_estado,
        topValor: reporte.top_valor,
        criticos: reporte.productos_criticos,
        lotes: reporte.lotes_por_vencer,
        chartImages,
      });
      toast.success("Reporte de inventario exportado a PDF", { id: toastId });
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

  const noData = !loading && !error && reporte && kpis && kpis.total_productos === 0;

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
                background: `linear-gradient(135deg, ${t.accent} 0%, #6366f1 120%)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 6px 16px ${t.accent}40`,
              }}
            >
              <Boxes size={22} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: t.textPrimary, lineHeight: 1.1 }}>
                Reporte de Inventario
              </h1>
              <p style={{ fontSize: 12.5, color: t.textSecondary }}>
                {reporte ? `Stock valorizado al ${fechaLarga(reporte.fecha_corte)} · ${periodLabel}` : periodLabel}
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
            disabled={exporting || !reporte || !kpis || kpis.total_productos === 0}
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
              opacity: exporting || !reporte || !kpis || kpis.total_productos === 0 ? 0.55 : 1,
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
            Aún no hay productos en el inventario
          </h3>
          <p style={{ fontSize: 13, color: t.textSecondary, maxWidth: 420, margin: "0 auto" }}>
            Registra productos y lotes para que este reporte muestre la valorización del stock y sus alertas.
          </p>
        </div>
      )}

      {/* ─── Dashboard ──────────────────────────────────────────────── */}
      {!loading && !error && reporte && kpis && kpis.total_productos > 0 && (
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
              icon={<Package size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Productos Vigentes"
              value={numFmt(kpis.total_productos)}
              sub={`${kpis.total_categorias} categorías · ${kpis.total_proveedores} proveedores`}
              gradient="linear-gradient(135deg, #6366f1 0%, #818cf8 45%, #4f46e5 130%)"
              boxShadow="0 8px 22px rgba(99,102,241,0.28)"
            />
            <KpiCard
              index={1}
              icon={<Boxes size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Unidades en Stock"
              value={numFmt(kpis.unidades_totales)}
              sub={`distribuidas en ${kpis.lotes_total} lotes activos`}
              gradient="linear-gradient(135deg, #06b6d4 0%, #22d3ee 45%, #0891b2 130%)"
              boxShadow="0 8px 22px rgba(6,182,212,0.28)"
            />
            <KpiCard
              index={2}
              icon={<DollarSign size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Valor Inventario"
              value={moneyFmt(kpis.valor_inventario)}
              sub={`Margen potencial ${moneyFmt(kpis.margen_potencial)}`}
              gradient="linear-gradient(135deg, #10b981 0%, #34d399 45%, #059669 130%)"
              boxShadow="0 8px 22px rgba(16,185,129,0.28)"
            />
            <KpiCard
              index={3}
              icon={<AlertTriangle size={23} color="#ffffff" strokeWidth={2.4} />}
              label="Alertas de Stock"
              value={numFmt(kpis.alertas_stock)}
              sub={`${kpis.lotes_vencen_90} lotes vencen en 90 días · ${kpis.lotes_vencidos} vencidos`}
              gradient="linear-gradient(135deg, #f59e0b 0%, #fbbf24 45%, #d97706 130%)"
              boxShadow="0 8px 22px rgba(245,158,11,0.28)"
              chips={
                <>
                  {[
                    { estado: "OK", count: kpis.stock_ok, color: "#10b981" },
                    { estado: "BAJO", count: kpis.stock_bajo, color: "#fbbf24" },
                    { estado: "CRITICO", count: kpis.stock_critico, color: "#fb7185" },
                    { estado: "AGOTADO", count: kpis.stock_agotado, color: "#cbd5e1" },
                  ].map((c) => (
                    <span
                      key={c.estado}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.14)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#ffffff",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                      }}
                    >
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: c.color }} />
                      {c.estado} {c.count}
                    </span>
                  ))}
                </>
              }
            />
          </div>

          {/* Fila 1: evolución + categorías */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) minmax(0, 1fr)",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Evolución del stock */}
            <div style={chartCard(320)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Evolución del stock</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Nivel estimado de unidades en el período</p>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(99,102,241,0.12)",
                    color: "#6366f1",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <Activity size={13} />
                  {numFmt(kpis.unidades_totales)} uds.
                </div>
              </div>
              <div id="chart-stock" style={{ width: "100%", height: 250 }}>
                {reporte.serie_stock.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reporte.serie_stock} margin={{ top: 8, right: 4, left: -8, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gradStock" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity={0.02} />
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
                        width={46}
                        allowDecimals={false}
                      />
                      <Tooltip content={<ChangableTooltip theme={t} />} cursor={{ stroke: t.border, strokeDasharray: "3 3" }} />
                      <Area
                        type="monotone"
                        dataKey="nivel"
                        name="nivel"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        fill="url(#gradStock)"
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

            {/* Donut por categoría */}
            <div style={chartCard(320)}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary, marginBottom: 2 }}>Unidades por categoría</h3>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Distribución del stock</p>
              <div id="chart-categoria" style={{ position: "relative", width: "100%", height: 175 }}>
                {reporte.por_categoria.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reporte.por_categoria}
                        dataKey="unidades"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        innerRadius={46}
                        outerRadius={74}
                        paddingAngle={3}
                        cornerRadius={6}
                        stroke="none"
                      >
                        {(reporte.por_categoria || []).map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip theme={t} suffix=" uds" />} />
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
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin categorías.</p>
                  </div>
                )}
                {reporte.por_categoria.length > 0 && (
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
                    <div style={{ fontSize: 18, fontWeight: 800, color: t.textPrimary }}>{reporte.por_categoria.length}</div>
                    <div style={{ fontSize: 11, color: t.textSecondary, fontWeight: 600 }}>categorías</div>
                  </div>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 8, marginTop: 8 }}>
                {(reporte.por_categoria || []).slice(0, 6).map((c, i) => (
                  <div
                    key={c.categoria}
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
                        {c.categoria}
                      </div>
                      <div style={{ fontSize: 11.5, fontWeight: 800, color: t.textPrimary }}>{c.porcentaje.toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fila 2: movimientos + tipos + estado */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Movimientos por día */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <BarChart3 size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Movimientos por día</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Entradas vs salidas de unidades</p>
              <div id="chart-movimientos" style={{ width: "100%", height: 220 }}>
                {reporte.serie_movimientos.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={reporte.serie_movimientos} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={t.border} vertical={false} />
                      <XAxis dataKey="etiqueta" tick={axisTick} tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} width={42} />
                      <Tooltip content={<ChartTooltip theme={t} suffix=" uds" />} cursor={{ fill: `${t.accent}0d` }} />
                      <Bar dataKey="entradas" name="Entradas" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={18} />
                      <Bar dataKey="salidas" name="Salidas" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={18} />
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
                    <p style={{ fontSize: 12.5, color: t.textMuted }}>Sin movimientos registrados.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tipo de movimientos */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <Repeat size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Tipo de movimientos</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 6 }}>Documentos registrados</p>
              <div id="chart-tipos" style={{ position: "relative", width: "100%", height: 165 }}>
                {reporte.por_tipo_movimiento.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={reporte.por_tipo_movimiento}
                        dataKey="movimientos"
                        nameKey="tipo"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={66}
                        paddingAngle={3}
                        cornerRadius={5}
                        stroke="none"
                      >
                        {(reporte.por_tipo_movimiento || []).map((_, i) => (
                          <Cell key={i} fill={[COLORS[1], COLORS[4], COLORS[3], COLORS[2], COLORS[0]][i % 5]} />
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
                {reporte.por_tipo_movimiento.length > 0 && (
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
                    <div style={{ fontSize: 17, fontWeight: 800, color: t.textPrimary }}>
                      {reporte.por_tipo_movimiento.reduce((a, b) => a + b.movimientos, 0)}
                    </div>
                    <div style={{ fontSize: 10.5, color: t.textSecondary, fontWeight: 600 }}>movimientos</div>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                {(reporte.por_tipo_movimiento || []).slice(0, 4).map((m, i) => (
                  <div
                    key={m.tipo}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      background: t.innerBg,
                      borderRadius: 10,
                      padding: "6px 10px",
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, fontWeight: 700, color: t.textPrimary }}>
                      <span style={{ width: 8, height: 8, borderRadius: 3, background: [COLORS[1], COLORS[4], COLORS[3], COLORS[2]][i % 4] }} />
                      {m.tipo}
                    </span>
                    <span style={{ fontSize: 11.5, fontWeight: 800, color: t.textSecondary }}>
                      {m.movimientos} movs · {numFmt(m.unidades)} uds.
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Estado del stock */}
            <div style={chartCard(300)}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                <ChartPie size={15} color={t.accent} />
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Estado del stock</h3>
              </div>
              <p style={{ fontSize: 12, color: t.textSecondary, marginBottom: 14 }}>Resumen por nivel de inventario</p>
              {(reporte.por_estado || []).length > 0 ? (
                <>
                  <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                    {(reporte.por_estado || []).map((e) => (
                      <div
                        key={e.estado}
                        style={{
                          flex: Math.max(e.productos, 1),
                          height: 10,
                          borderRadius: 6,
                          background: estadoColor(e.estado),
                          minWidth: 4,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {(reporte.por_estado || []).map((e) => {
                      const pct = e.porcentaje;
                      return (
                        <div key={e.estado}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: t.textPrimary }}>
                              <span style={{ width: 9, height: 9, borderRadius: 3, background: estadoColor(e.estado) }} />
                              {e.estado}
                            </span>
                            <span style={{ fontSize: 12, fontWeight: 800, color: t.textPrimary }}>
                              {e.productos} · {pct.toFixed(0)}%
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
                                background: estadoColor(e.estado),
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

          {/* Fila 3: top valor + críticos */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
              gap: 18,
              marginBottom: 18,
            }}
          >
            {/* Top valor inventario */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Top valor en inventario</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Productos con mayor capital invertido</p>
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
              <div id="chart-top" style={{ width: "100%", height: 250 }}>
                {top5.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={top5} layout="vertical" margin={{ top: 6, right: 14, left: 8, bottom: 0 }}>
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
                      <Bar dataKey="valor" name="valor" radius={[0, 6, 6, 0]} maxBarSize={18}>
                        {top5.map((_, i) => (
                          <Cell key={i} fill={[COLORS[2], COLORS[0], COLORS[1], COLORS[3], COLORS[5]][i % 5]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p style={{ fontSize: 13, color: t.textMuted }}>Sin productos con stock.</p>
                )}
              </div>
            </div>

            {/* Productos críticos */}
            <div style={chartCard(360)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Productos críticos</h3>
                  <p style={{ fontSize: 12, color: t.textSecondary }}>Requieren reposición</p>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "3px 10px",
                    borderRadius: 999,
                    background: "rgba(244,63,94,0.12)",
                    color: "#f43f5e",
                    fontSize: 11,
                    fontWeight: 800,
                  }}
                >
                  {kpis.alertas_stock} alertas
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", height: 275 }}>
                {reporte.productos_criticos.length > 0 ? (
                  reporte.productos_criticos.map((p) => (
                    <div
                      key={p.id_producto}
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
                          background: estadoBg(p.estado),
                          color: estadoColor(p.estado),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: 14,
                        }}
                      >
                        {p.estado === "AGOTADO" ? <Inbox size={18} /> : <AlertTriangle size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.nombre}
                        </div>
                        <div style={{ fontSize: 11, color: t.textMuted, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.categoria}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: t.textPrimary }}>
                          {p.stock} <span style={{ fontSize: 10, color: t.textMuted, fontWeight: 600 }}>/ {p.minimo}</span>
                        </div>
                        <div
                          style={{
                            display: "inline-block",
                            fontSize: 10,
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: estadoBg(p.estado),
                            color: estadoColor(p.estado),
                          }}
                        >
                          {p.estado}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                      height: "100%",
                    }}
                  >
                    <CheckCircle2 size={26} color="#10b981" />
                    <p style={{ fontSize: 12.5, color: t.textSecondary }}>Sin productos con stock crítico.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fila 4: lotes por vencer + resumen de lotes vencidos */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: 20, padding: "20px 22px", marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: t.textPrimary }}>Lotes por vencer (90 días)</h3>
                <p style={{ fontSize: 12, color: t.textSecondary }}>Programación de vencimientos por lote</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(244,63,94,0.12)",
                    color: "#f43f5e",
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  <Clock size={12} />
                  ≤30d: {kpis.lotes_vencen_30}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(245,158,11,0.12)",
                    color: "#f59e0b",
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  <Clock size={12} />
                  60d: {kpis.lotes_vencen_60}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 10px",
                    borderRadius: 999,
                    background: "rgba(129,140,248,0.12)",
                    color: "#818cf8",
                    fontSize: 11.5,
                    fontWeight: 800,
                  }}
                >
                  <Clock size={12} />
                  90d: {kpis.lotes_vencen_90}
                </span>
                {kpis.lotes_vencidos > 0 && (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "4px 10px",
                      borderRadius: 999,
                      background: "rgba(100,116,139,0.14)",
                      color: t.textSecondary,
                      fontSize: 11.5,
                      fontWeight: 800,
                    }}
                  >
                    <AlertTriangle size={12} />
                    {kpis.lotes_vencidos} vencidos
                  </span>
                )}
              </div>
            </div>

            {reporte.lotes_por_vencer.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12, marginTop: 14 }}>
                {reporte.lotes_por_vencer.map((l) => {
                  const urgente = l.urgencia === "URGENTE";
                  const color = urgente ? "#f43f5e" : "#f59e0b";
                  const bgColor = urgente ? "rgba(244,63,94,0.12)" : "rgba(245,158,11,0.12)";
                  return (
                    <div
                      key={l.id_inventario}
                      style={{
                        borderRadius: 14,
                        border: `1px solid ${urgente ? "rgba(244,63,94,0.35)" : t.border}`,
                        background: urgente ? "rgba(244,63,94,0.06)" : t.innerBg,
                        padding: "14px 14px",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 12px ${color}20`;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div style={{ minWidth: 0, marginRight: 8 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {l.producto}
                          </div>
                          <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>
                            Lote {l.numero_lote} · {l.ubicacion}
                          </div>
                        </div>
                        <span
                          style={{
                            flexShrink: 0,
                            padding: "3px 9px",
                            borderRadius: 8,
                            background: bgColor,
                            color,
                            fontSize: 10.5,
                            fontWeight: 800,
                            textTransform: "uppercase",
                            border: `1px solid ${color}30`,
                          }}
                        >
                          {l.urgencia}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ height: 6, background: t.border, borderRadius: 999, overflow: "hidden" }}>
                            <div
                              style={{
                                width: `${Math.min((l.dias / 90) * 100, 100)}%`,
                                height: "100%",
                                background: color,
                                borderRadius: 999,
                              }}
                            />
                          </div>
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 800, color }}>{l.dias} días</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: t.textSecondary, marginTop: 10 }}>
                        <span>Vence: {l.fecha_vencimiento}</span>
                        <span>Stock: {numFmt(l.stock)} uds</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "28px 0",
                  color: t.textMuted,
                }}
              >
                <CheckCircle2 size={26} color="#10b981" />
                <p style={{ fontSize: 12.5 }}>No hay lotes por vencer en los próximos 90 días.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}