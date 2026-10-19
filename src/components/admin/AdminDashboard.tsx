/**
 * AdminDashboard — Vista del panel principal del Administrador.
 *
 * Reproduce EXACTAMENTE el diseño original del Dashboard (colores, gradientes,
 * bordes, tipografía y disposición), pero alimentado con DATOS REALES:
 *  - Reporte de ventas   (/reportes/ventas)      → ingresos, ventas, crecimiento
 *  - Reporte de inventario (/reportes/inventario) → stock, estados, valorización
 *  - Reporte de movimientos (/reportes/movimientos) → entradas vs salidas
 *  - Usuarios del sistema (/users)                → lista de personal
 */
import { useMemo, useState } from "react";
import {
  TrendingUp,
  MoreVertical,
  Download,
  RefreshCw,
  Package,
  ShoppingBag,
  DollarSign,
  XCircle,
} from "lucide-react";
import { useReporteVentasQuery, useReporteInventarioQuery, useReporteMovimientosQuery, useUsersQuery } from "../../hooks/useAdminQueries";
import type { Usuario } from "../../services/usersService";

/* ─── Theme (idéntico al Dashboard) ─────────────────────────────────── */
function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      mainBg: "#171622",
      cardBg: "#212130",
      innerBg: "#1e1d29",
      deepBg: "#171622",
      border: "rgba(46,46,66,0.5)",
      borderCard: "rgba(46,46,66,0.4)",
      textPrimary: "#ffffff",
      textSecondary: "#828690",
      textMuted: "#969ba0",
      accent: "#5bcfc5",
      accentBg: "rgba(91,207,197,0.1)",
      accentBorder: "rgba(91,207,197,0.25)",
      borderSoft: "rgba(46,46,66,0.6)",
      barBg: "#171622",
    };
  }
  return {
    mainBg: "#f0f2f8",
    cardBg: "#ffffff",
    innerBg: "#f5f6fa",
    deepBg: "#eef0f8",
    border: "rgba(220,222,235,0.9)",
    borderCard: "rgba(220,222,235,0.7)",
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    accent: "#5bcfc5",
    accentBg: "rgba(91,207,197,0.1)",
    accentBorder: "rgba(91,207,197,0.35)",
    borderSoft: "rgba(220,222,235,0.8)",
    barBg: "#eef0f8",
  };
}

/* ─── Helpers ───────────────────────────────────────────────────────── */
const moneyFmt = (v: number) =>
  v.toLocaleString("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2, maximumFractionDigits: 2 });

const moneyShort = (v: number) =>
  v >= 1000 ? `S/${(v / 1000).toFixed(1)}k` : `S/${Math.round(v)}`;

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
  if (isNaN(d.getTime())) return iso.slice(11, 16) || "—";
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  return `${hh}:${mm}`;
};

const fechaLarga = (iso: string) => {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric" });
};

const pctFmt = (v: number | null | undefined) =>
  v === null || v === undefined ? "—" : `${v >= 0 ? "+" : ""}${Number(v).toFixed(1)}%`;

const countFmt = (v: number | undefined) => (v === undefined || v === null ? "—" : String(v));

/** Color por estado de venta — paleta de acentos del dashboard */
const ESTADO_COLORS: Record<string, string> = {
  PAGADA: "#68e365",
  PENDIENTE: "#ffa755",
  ANULADA: "#f72b50",
};

const ESTADO_LABELS: Record<string, string> = {
  PAGADA: "Completada",
  PENDIENTE: "Pendiente",
  ANULADA: "Anulada",
};

/* ─── Avatar con fallback (foto real o inicial) ─────────────────────── */
function UserAvatar({ user, className }: { user: Usuario; className: string }) {
  if (user.foto_perfil_url) {
    return (
      <img
        src={user.foto_perfil_url}
        alt={user.nombre_completo}
        className={`${className} object-cover`}
      />
    );
  }
  const inicial = (user.nombre_completo || user.nombre_usuario || "?").charAt(0).toUpperCase();
  return (
    <div
      className={`${className} flex items-center justify-center font-bold`}
      style={{
        background: "linear-gradient(135deg, rgba(91,207,197,0.25) 0%, rgba(91,207,197,0.1) 100%)",
        border: "1px solid rgba(91,207,197,0.35)",
        color: "#5bcfc5",
        flexShrink: 0,
      }}
    >
      {inicial}
    </div>
  );
}

/* ═════════════════════════════════════════════════════════════════════
 *  COMPONENTE PRINCIPAL
 * ═════════════════════════════════════════════════════════════════════ */
export default function AdminDashboard({
  isDark,
  setActiveMenu,
}: {
  isDark: boolean;
  setActiveMenu: (menu: string) => void;
}) {
  const t = getTheme(isDark);

  /* ─── Rangos de fecha ─── */
  const hoy = useMemo(() => toYMD(new Date()), []);
  const inicioMes = useMemo(() => {
    const d = new Date();
    return toYMD(new Date(d.getFullYear(), d.getMonth(), 1));
  }, []);
  const hace6 = useMemo(() => toYMD(addDays(new Date(), -6)), []);

  /* ─── Consultas reales (TanStack Query, caché 5 min) ─── */
  const { data: ventasAll } = useReporteVentasQuery(undefined, undefined);
  const { data: ventasHoy } = useReporteVentasQuery(hoy, hoy);
  const { data: ventasMes } = useReporteVentasQuery(inicioMes, hoy);
  const { data: inventario } = useReporteInventarioQuery();
  const { data: movimientos } = useReporteMovimientosQuery(hace6, hoy);
  const { data: usuarios } = useUsersQuery();

  const invK = inventario?.kpis;
  const venAll = ventasAll?.kpis;
  const venCrec = ventasAll?.crecimiento;

  /* ─── Serie últimos 7 días (ingresos reales) ─── */
  const serie7 = useMemo(() => (ventasAll?.serie_diaria || []).slice(-7), [ventasAll]);
  const maxIngresos = useMemo(
    () => Math.max(1, ...serie7.map((d) => d.ingresos)),
    [serie7]
  );

  /* ─── Serie de movimientos últimos 7 días (entradas vs salidas) ─── */
  const movSerie7 = useMemo(() => (movimientos?.serie_diaria || []).slice(-7), [movimientos]);
  const maxMov = useMemo(
    () => Math.max(1, ...movSerie7.flatMap((d) => [d.entradas, d.salidas])),
    [movSerie7]
  );

  /* ─── Distribución de métodos de pago (real) ─── */
  const metodos = useMemo(() => (ventasAll?.por_metodo || []).slice(0, 4), [ventasAll]);

  /* ─── Estados de stock (real) ─── */
  const totalProductos = invK ? invK.total_productos : undefined;
  const stockCriticoTotal = invK ? invK.stock_critico + invK.stock_agotado : undefined;

  /* ─── Conteo de estados de venta ─── */
  const estadoCount = (estado: string) =>
    ventasAll?.por_estado.find((e) => e.estado === estado)?.ventas ?? 0;

  /* ─── Usuarios ─── */
  const listaUsuarios = useMemo(() => usuarios || [], [usuarios]);
  const usuariosActivos = useMemo(
    () => listaUsuarios.filter((u) => u.estado_logico).length,
    [listaUsuarios]
  );
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const usuarioMostrado = selectedUser || listaUsuarios[0] || null;

  /* ─── Tabs de transacciones: Hoy / Semana / Mes ─── */
  const TABS = ["Este mes", "Esta semana", "Hoy"] as const;
  const [tabActivo, setTabActivo] = useState<(typeof TABS)[number]>("Este mes");
  const ventasFiltradas = useMemo(() => {
    if (!ventasAll?.ventas_recientes) return [];
    const ahora = new Date();
    const limite =
      tabActivo === "Hoy"
        ? ahora
        : tabActivo === "Esta semana"
          ? addDays(ahora, -6)
          : new Date(ahora.getFullYear(), ahora.getMonth(), 1);
    return ventasAll.ventas_recientes.filter((v) => {
      const f = new Date(`${v.fecha_venta.slice(0, 10)}T23:59:59`);
      return f >= limite && f <= ahora;
    });
  }, [ventasAll, tabActivo]);

  return (
    <>
      {/* 4 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {/* Card 1 - Productos en Stock - Orange Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ea580c 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(249, 115, 22, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(249, 115, 22, 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(249, 115, 22, 0.25)";
          }}
        >
          {/* Decorative circles */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Productos en Stock
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {countFmt(invK?.unidades_totales)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fed7aa" }}>
                  {countFmt(totalProductos)}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  productos registrados
                </span>
              </div>
            </div>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <Package size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Card 2 - Ventas de Hoy - Green Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #34d399 40%, #059669 100%)",
            borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(16, 185, 129, 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.25)";
          }}
        >
          <div style={{
            position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ventas de Hoy
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {countFmt(ventasHoy?.kpis.total_ventas)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#d1fae5" }}>
                  {ventasHoy ? moneyFmt(ventasHoy.kpis.total_ingresos) : "—"}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  ingresos hoy
                </span>
              </div>
            </div>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <ShoppingBag size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Card 3 - Stock Crítico - Red Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #ef4444 0%, #f87171 40%, #dc2626 100%)",
            borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(239, 68, 68, 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(239, 68, 68, 0.25)";
          }}
        >
          <div style={{
            position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Stock Crítico
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {countFmt(stockCriticoTotal)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fecaca" }}>
                  {(stockCriticoTotal ?? 0) > 0 ? "¡Alerta!" : "Todo OK"}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  {(stockCriticoTotal ?? 0) > 0 ? "Reabastecer" : "Sin déficit"}
                </span>
              </div>
            </div>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <XCircle size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Card 4 - Ingresos de Mes - Blue/Teal Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #06b6d4 0%, #22d3ee 40%, #0891b2 100%)",
            borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(6, 182, 212, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 32px rgba(6, 182, 212, 0.35)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(6, 182, 212, 0.25)";
          }}
        >
          <div style={{
            position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{
            position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px",
            borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)",
          }} />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Ingresos de Mes
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {ventasMes ? moneyFmt(ventasMes.kpis.total_ingresos) : "—"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#cffafe" }}>
                  {pctFmt(ventasMes?.crecimiento.ingresos ?? null)}
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs mes anterior
                </span>
              </div>
            </div>
            <div style={{
              width: "56px", height: "56px", borderRadius: "16px",
              background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255, 255, 255, 0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

      </div>

      {/* Wallet Balance + Card's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Wallet Balance blue card (Ingresos totales reales) */}
        <div className="lg:col-span-2 bg-[#2c4eff] bg-gradient-to-br from-[#3b5beb] to-[#1d3bcd] rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-xl shadow-blue-900/10">
          <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>

          <div className="flex justify-between items-start z-10">
            <div className="flex">
              <div className="size-9 rounded-full bg-white/20 backdrop-blur-sm"></div>
              <div className="size-9 rounded-full bg-white/20 backdrop-blur-sm -ml-4"></div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20">
              <span className="text-white text-[12px] font-bold tracking-wide uppercase select-none flex items-center gap-1.5">
                <RefreshCw size={12} className="animate-spin-slow" />
                PEN
              </span>
            </div>
          </div>

          <div className="z-10 mt-6">
            <p className="text-white/80 text-[14px] font-semibold tracking-wider uppercase font-sans">Ingresos Totales</p>
            <p className="text-white text-[38px] sm:text-[44px] font-bold leading-tight font-sans mt-1">
              {venAll ? moneyFmt(venAll.total_ingresos) : "—"}
            </p>
            <p
              className="text-[13px] font-semibold bg-black/15 px-3 py-1 rounded-full w-fit mt-1"
              style={{ color: (venCrec?.ingresos ?? 0) >= 0 ? "#68e365" : "#ff8fa0" }}
            >
              {pctFmt(venCrec?.ingresos ?? null)} vs período anterior
            </p>
          </div>
        </div>

        {/* Card's Overview → Distribución por método de pago (real) */}
        <div className="rounded-[24px] p-6 flex flex-col justify-between min-h-[260px] border" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Distribución de Pagos</h3>
              <p className="text-[13px] mt-1 max-w-[180px] leading-relaxed" style={{ color: t.textSecondary }}>
                Participación de cada método de pago en tus ingresos
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="space-y-3 flex-1">
              {metodos.length > 0 ? (
                metodos.map((item, i) => (
                  <div key={item.metodo} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="size-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: ["#496ecc", "#68e365", "#ffa755", "#c8c8c8"][i % 4] }} />
                      <span className="font-medium truncate" style={{ color: t.textPrimary }}>{item.metodo}</span>
                    </div>
                    <span className="font-bold" style={{ color: t.textMuted }}>{item.porcentaje.toFixed(0)}%</span>
                  </div>
                ))
              ) : (
                <p className="text-xs" style={{ color: t.textMuted }}>Sin métodos de pago registrados</p>
              )}
            </div>
            <div className="size-28 relative flex-shrink-0 flex items-center justify-center">
              {/* Gráfico de Dona (Donut Chart) SVG — segmentos calculados con datos reales */}
              <svg className="w-full h-full" viewBox="0 0 120 120">
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#5a7edc" />
                    <stop offset="100%" stopColor="#496ecc" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7beb6f" />
                    <stop offset="100%" stopColor="#68e365" />
                  </linearGradient>
                  <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffb366" />
                    <stop offset="100%" stopColor="#ffa755" />
                  </linearGradient>
                  <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d8d8d8" />
                    <stop offset="100%" stopColor="#c8c8c8" />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
                  </filter>
                </defs>

                <circle cx="60" cy="60" r="50" fill="none" stroke={t.border} strokeWidth="0.5" opacity="0.2" />

                {/*
                  Cada segmento usa strokeDasharray = pct*C, dashoffset acumulado.
                  C (circunferencia r=40) = 251.33
                */}
                {(() => {
                  const C = 251.33;
                  let offset = 0;
                  return metodos.map((m, i) => {
                    const len = (m.porcentaje / 100) * C;
                    const seg = (
                      <circle
                        key={m.metodo}
                        cx="60" cy="60" r="40"
                        fill="none"
                        stroke={`url(#grad${i + 1})`}
                        strokeWidth="20"
                        strokeDasharray={`${len} ${C - len}`}
                        strokeDashoffset={-offset}
                        transform="rotate(-90 60 60)"
                        filter="url(#shadow)"
                        style={{ transition: "all 0.3s ease" }}
                      />
                    );
                    offset += len;
                    return seg;
                  });
                })()}

                {/* Círculo interior para efecto de dona */}
                <circle cx="60" cy="60" r="30" fill={t.cardBg} style={{ transition: "fill 0.3s ease" }} />

                {/* Texto central */}
                <text
                  x="60" y="60" textAnchor="middle" dominantBaseline="middle"
                  fill={t.textPrimary} fontSize="18" fontWeight="700" fontFamily="'Cairo', sans-serif"
                >
                  100%
                </text>
              </svg>
            </div>
          </div>
        </div>

      </div>

      {/* Activity + Quick Transfer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Activity — Ingresos reales últimos 7 días */}
        <div className="lg:col-span-4 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Actividad</h3>
                <p className="text-[28px] font-bold leading-tight mt-1" style={{ color: t.textPrimary }}>
                  {venAll ? moneyFmt(venAll.total_ingresos) : "—"}
                </p>
              </div>
              <div className="text-right space-y-1.5">
                <div className="flex items-center justify-end gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                  <span>Ingresos</span>
                  <span className="size-3.5 rounded-full bg-[#68e365]" />
                </div>
                <div className="flex items-center justify-end gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                  <span>Ventas</span>
                  <span className="size-3.5 rounded-full bg-[#f72b50]" />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 relative min-h-[300px] mt-4 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="w-full h-[280px] relative overflow-hidden bg-transparent">
                {/* Grid de fondo */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke={t.textMuted} strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Gráfico de línea dinámico (datos reales) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="activityGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#68e365" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#68e365" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {(() => {
                    const n = serie7.length;
                    if (n === 0) return null;
                    const stepX = n > 1 ? 400 / (n - 1) : 0;
                    const xAt = (i: number) => (n > 1 ? i * stepX : 200);
                    const yAt = (v: number, max: number) => 245 - (v / max) * 190;

                    const ptsIngresos = serie7.map((d, i) => ({ x: xAt(i), y: yAt(d.ingresos, maxIngresos) }));
                    const lineIngresos = ptsIngresos.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
                    const areaIngresos = `${lineIngresos} L 400 245 L 0 245 Z`;

                    const maxVentas = Math.max(1, ...serie7.map((d) => d.ventas));
                    const ptsVentas = serie7.map((d, i) => ({ x: xAt(i), y: yAt(d.ventas, maxVentas) }));
                    const lineVentas = ptsVentas.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

                    return (
                      <>
                        {/* Área bajo la curva (ingresos) */}
                        <path d={areaIngresos} fill="url(#activityGradient)" opacity="0.6" />
                        {/* Línea principal (ingresos) */}
                        <path d={lineIngresos} fill="none" stroke="#68e365" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        {/* Línea secundaria (ventas) */}
                        {n > 1 && (
                          <path d={lineVentas} fill="none" stroke="#f72b50" strokeWidth="2" strokeDasharray="6 5" strokeLinecap="round" opacity="0.8" />
                        )}
                        {/* Puntos en la línea */}
                        {ptsIngresos.map((point, i) => (
                          <g key={i}>
                            <circle cx={point.x} cy={point.y} r="5" fill="#68e365" stroke={t.cardBg} strokeWidth="2" />
                            <circle cx={point.x} cy={point.y} r="5" fill="#68e365" opacity="0.3">
                              <animate attributeName="r" from="5" to="10" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                              <animate attributeName="opacity" from="0.3" to="0" dur="2s" begin={`${i * 0.2}s`} repeatCount="indefinite" />
                            </circle>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Etiquetas del eje X (fechas reales) */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 text-[11px]" style={{ color: t.textMuted }}>
                  {serie7.length > 0 ? (
                    [0, 2, 4, 6].map((idx) => (
                      <span key={idx}>{serie7[Math.min(idx, serie7.length - 1)].etiqueta}</span>
                    ))
                  ) : (
                    <span>Sin datos</span>
                  )}
                </div>

                {/* Etiquetas del eje Y (escala real) */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] py-2" style={{ color: t.textMuted }}>
                  <span>{moneyShort(maxIngresos)}</span>
                  <span>{moneyShort(maxIngresos * 0.75)}</span>
                  <span>{moneyShort(maxIngresos * 0.5)}</span>
                  <span>{moneyShort(maxIngresos * 0.25)}</span>
                  <span>S/0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Transfer → Usuarios del sistema (reales) */}
        <div className="lg:col-span-8 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Usuarios del Equipo</h3>
                <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Personal registrado en el sistema</p>
              </div>
              <button className="p-2 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }} onClick={() => setActiveMenu("Usuarios")}>
                <MoreVertical size={16} />
              </button>
            </div>

            {/* Recipient User Profile Card */}
            <div className="rounded-[20px] p-4 flex items-center justify-between mb-6" style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
              {usuarioMostrado ? (
                <>
                  <div className="flex items-center gap-3">
                    <UserAvatar user={usuarioMostrado} className="w-12 h-12 rounded-[16px]" />
                    <div>
                      <p className="font-semibold text-[16px]" style={{ color: t.textPrimary }}>{usuarioMostrado.nombre_completo}</p>
                      <p className="font-normal text-[13px]" style={{ color: t.textSecondary }}>@{usuarioMostrado.nombre_usuario}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      style={{
                        fontSize: "10px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
                        padding: "4px 8px", borderRadius: "8px",
                        background: t.accentBg, color: t.accent, border: `1px solid ${t.accentBorder}`,
                      }}
                    >
                      {usuarioMostrado.rol?.nombre_rol.replace("ADMINISTRATIVO", "ADMIN") || "USUARIO"}
                    </span>
                    <div className="bg-[#5bcfc5] text-[#171622] rounded-full p-1.5 size-7 flex items-center justify-center shadow-lg shadow-[#5bcfc5]/20">
                      ✓
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-[14px]" style={{ color: t.textSecondary }}>No hay usuarios registrados</p>
              )}
            </div>

            {/* Selección de usuarios reales */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <span className="font-semibold text-[14px]" style={{ color: t.textPrimary }}>Miembros del Panel</span>
                <button onClick={() => setActiveMenu("Usuarios")} className="text-[#5bcfc5] hover:text-[#4bc0b6] text-[13px] font-semibold">Ver más</button>
              </div>
              <div className="flex items-center gap-3.5 overflow-x-auto py-2 scrollbar-thin">
                {listaUsuarios.slice(0, 7).map((u) => (
                  <button
                    key={u.id_usuario}
                    onClick={() => setSelectedUser(u)}
                    className="flex flex-col items-center flex-shrink-0 gap-1.5 p-1.5 rounded-2xl transition-all duration-300"
                    style={{
                      background: usuarioMostrado?.id_usuario === u.id_usuario ? t.innerBg : "transparent",
                      outline: usuarioMostrado?.id_usuario === u.id_usuario ? `2px solid #5bcfc5` : "none",
                    }}
                  >
                    <UserAvatar user={u} className="w-11 h-11 rounded-[14px]" />
                    <span className="text-[11px]" style={{ color: `${t.textPrimary}cc` }}>
                      {u.nombre_completo.split(" ")[0]}
                    </span>
                  </button>
                ))}
                {listaUsuarios.length === 0 && (
                  <p className="text-[13px]" style={{ color: t.textMuted }}>Sin usuarios registrados</p>
                )}
              </div>
            </div>

            {/* Resumen de usuarios (mismo diseño del input) */}
            <div className="space-y-3">
              <span className="font-semibold text-[14px] block" style={{ color: t.textPrimary }}>Miembros Activos</span>
              <div className="border rounded-2xl p-4 flex items-center justify-between" style={{ background: t.deepBg, borderColor: t.border }}>
                <span className="text-2xl font-bold font-sans w-2/3" style={{ color: t.textPrimary }}>
                  {countFmt(usuariosActivos)}
                </span>
                <span className="font-medium" style={{ color: `${t.textSecondary}99` }}>de {countFmt(listaUsuarios.length)}</span>
              </div>
              <div className="flex justify-between text-xs font-semibold px-1">
                <span style={{ color: t.textSecondary }}>Personal Inactivo</span>
                <span className="text-[#5bcfc5]">{countFmt(listaUsuarios.length - usuariosActivos)}</span>
              </div>
            </div>
          </div>

          {/* Botón: ver todos los usuarios */}
          <button
            onClick={() => setActiveMenu("Usuarios")}
            className="w-full mt-6 bg-[#5bcfc5] hover:bg-[#4bc0b6] text-[#171622] font-semibold py-4 rounded-xl text-center uppercase tracking-wider text-[15px] transition-all duration-300 shadow-lg shadow-[#5bcfc5]/15"
          >
            Gestionar Usuarios
          </button>
        </div>

      </div>

      {/* Spendings + Transaction Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Spendings → Distribución de Stock (real) */}
        <div className="lg:col-span-4 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Estado del Stock</h3>
                <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Distribución real del inventario</p>
              </div>
              <button className="p-2 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }} onClick={() => setActiveMenu("StockCritico")}>
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="space-y-6">
              {(() => {
                const total = totalProductos ?? 0;
                const items = invK
                  ? [
                    { label: "Stock Óptimo", amount: `${invK.stock_ok}`, pct: total > 0 ? (invK.stock_ok / total) * 100 : 0, gradient: "from-[#ac39d4] to-[#f04cf3]" },
                    { label: "Stock Bajo", amount: `${invK.stock_bajo}`, pct: total > 0 ? (invK.stock_bajo / total) * 100 : 0, gradient: "from-[#40d4a8] to-[#40e5dc]" },
                    { label: "Stock Crítico", amount: `${invK.stock_critico}`, pct: total > 0 ? (invK.stock_critico / total) * 100 : 0, gradient: "from-[#1eb6e7] to-[#4aece2]" },
                    { label: "Agotado", amount: `${invK.stock_agotado}`, pct: total > 0 ? (invK.stock_agotado / total) * 100 : 0, gradient: "from-[#461ee7] to-[#ba49ff]" },
                  ]
                  : [
                    { label: "Stock Óptimo", amount: "—", pct: 0, gradient: "from-[#ac39d4] to-[#f04cf3]" },
                    { label: "Stock Bajo", amount: "—", pct: 0, gradient: "from-[#40d4a8] to-[#40e5dc]" },
                    { label: "Stock Crítico", amount: "—", pct: 0, gradient: "from-[#1eb6e7] to-[#4aece2]" },
                    { label: "Agotado", amount: "—", pct: 0, gradient: "from-[#461ee7] to-[#ba49ff]" },
                  ];
                return items.map((item) => (
                  <div key={item.label} className="space-y-2">
                    <div className="h-4 rounded-full overflow-hidden" style={{ background: t.barBg }}>
                      <div
                        className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`}
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span style={{ color: t.textMuted }}>{item.label}</span>
                      <span>
                        <span style={{ color: t.textPrimary }}>{item.amount}</span>
                        <span style={{ color: t.textSecondary }}> de {countFmt(totalProductos)} prod.</span>
                      </span>
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          <button
            onClick={() => setActiveMenu("ReportesInventario")}
            className="w-full mt-6 font-semibold py-3.5 rounded-xl transition-all duration-300 text-[14px] border"
            style={{ background: t.cardBg, borderColor: t.accent, color: t.textPrimary }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.accent; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary; }}
          >
            Ver Inventario
          </button>
        </div>

        {/* Transaction Overview → Movimientos de inventario (real) */}
        <div className="lg:col-span-8 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
          <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
              <div>
                <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Resumen de Movimientos</h3>
                <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Entradas y salidas del inventario</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveMenu("ReportesMovimientos")}
                  className="bg-[#5bcfc5] hover:bg-[#4bc0b6] text-[#171622] font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-[13px] transition-all duration-300"
                >
                  <Download size={14} />
                  <span>Ver Reporte</span>
                </button>
                <button className="p-2.5 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }} onClick={() => setActiveMenu("ReportesMovimientos")}>
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>

            <div className="flex justify-start gap-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                <span className="size-3.5 rounded-full bg-[#68e365]" />
                <span>Entradas</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                <span className="size-3.5 rounded-full bg-[#fe7d65]" />
                <span>Salidas</span>
              </div>
            </div>
          </div>

          <div className="w-full flex-1 relative min-h-[300px] mt-4 flex items-center justify-center">
            <div className="w-full h-full relative">
              <div className="w-full h-[280px] relative overflow-hidden bg-transparent">
                {/* Grid de fondo */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.08 }}>
                  <defs>
                    <pattern id="grid-transaction" width="60" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 40" fill="none" stroke={t.textMuted} strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-transaction)" />
                </svg>

                {/* Gráfico de barras dinámico (movimientos reales) */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="incomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#68e365" stopOpacity="1" />
                      <stop offset="100%" stopColor="#68e365" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="outcomeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#fe7d65" stopOpacity="1" />
                      <stop offset="100%" stopColor="#fe7d65" stopOpacity="0.7" />
                    </linearGradient>
                    <filter id="barShadow">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
                    </filter>
                  </defs>

                  {(() => {
                    const n = movSerie7.length;
                    if (n === 0) return null;
                    const start = n < 7 ? 60 + (7 - n) * 40 : 60;
                    return movSerie7.map((day, index) => {
                      const x = start + (index * 80);
                      const maxHeight = 180;
                      const incomeHeight = (day.entradas / maxMov) * maxHeight;
                      const outcomeHeight = (day.salidas / maxMov) * maxHeight;
                      const barWidth = 28;
                      const spacing = 8;

                      return (
                        <g key={index}>
                          {/* Barra Entradas */}
                          <rect
                            x={x - spacing}
                            y={220 - incomeHeight}
                            width={barWidth}
                            height={Math.max(incomeHeight, day.entradas > 0 ? 3 : 0)}
                            fill="url(#incomeGrad)"
                            rx="6"
                            ry="6"
                            filter="url(#barShadow)"
                            style={{ transition: "all 0.5s ease", cursor: "pointer" }}
                          >
                            <animate attributeName="height" from="0" to={Math.max(incomeHeight, day.entradas > 0 ? 3 : 0)} dur="1s" begin={`${index * 0.1}s`} fill="freeze" />
                            <animate attributeName="y" from="220" to={220 - Math.max(incomeHeight, day.entradas > 0 ? 3 : 0)} dur="1s" begin={`${index * 0.1}s`} fill="freeze" />
                          </rect>

                          {/* Barra Salidas */}
                          <rect
                            x={x + spacing + barWidth}
                            y={220 - outcomeHeight}
                            width={barWidth}
                            height={Math.max(outcomeHeight, day.salidas > 0 ? 3 : 0)}
                            fill="url(#outcomeGrad)"
                            rx="6"
                            ry="6"
                            filter="url(#barShadow)"
                            style={{ transition: "all 0.5s ease", cursor: "pointer" }}
                          >
                            <animate attributeName="height" from="0" to={Math.max(outcomeHeight, day.salidas > 0 ? 3 : 0)} dur="1s" begin={`${index * 0.1}s`} fill="freeze" />
                            <animate attributeName="y" from="220" to={220 - Math.max(outcomeHeight, day.salidas > 0 ? 3 : 0)} dur="1s" begin={`${index * 0.1}s`} fill="freeze" />
                          </rect>

                          {/* Highlight en hover */}
                          <rect
                            x={x - spacing}
                            y={220 - Math.max(incomeHeight, day.entradas > 0 ? 3 : 0)}
                            width={barWidth}
                            height={Math.max(incomeHeight, day.entradas > 0 ? 3 : 0)}
                            fill="white"
                            rx="6" ry="6"
                            opacity="0"
                            className="hover:opacity-20 transition-opacity duration-200"
                            style={{ cursor: "pointer" }}
                          />
                          <rect
                            x={x + spacing + barWidth}
                            y={220 - Math.max(outcomeHeight, day.salidas > 0 ? 3 : 0)}
                            width={barWidth}
                            height={Math.max(outcomeHeight, day.salidas > 0 ? 3 : 0)}
                            fill="white"
                            rx="6" ry="6"
                            opacity="0"
                            className="hover:opacity-20 transition-opacity duration-200"
                            style={{ cursor: "pointer" }}
                          />
                        </g>
                      );
                    });
                  })()}

                  {/* Línea base */}
                  <line x1="40" y1="220" x2="580" y2="220" stroke={t.border} strokeWidth="1" opacity="0.3" />
                </svg>

                {/* Etiquetas del eje X (fechas reales) */}
                <div className="absolute inset-x-0 bottom-0 flex justify-between px-8 text-[11px]" style={{ color: t.textMuted }}>
                  {movSerie7.length > 0 ? (
                    movSerie7.map((d) => <span key={d.fecha}>{d.etiqueta}</span>)
                  ) : (
                    <span>Sin movimientos</span>
                  )}
                </div>

                {/* Etiquetas del eje Y (escala real) */}
                <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] py-2" style={{ color: t.textMuted }}>
                  <span>{Math.ceil(maxMov)}</span>
                  <span>{Math.ceil(maxMov * 0.8)}</span>
                  <span>{Math.ceil(maxMov * 0.6)}</span>
                  <span>{Math.ceil(maxMov * 0.4)}</span>
                  <span>{Math.ceil(maxMov * 0.2)}</span>
                  <span>0</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Previous Transactions → Últimas Ventas (reales) */}
      <div className="rounded-[24px] p-6 border overflow-hidden" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <div>
            <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Últimas Ventas</h3>
            <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>
              {ventasFiltradas.length} venta(s) en el período seleccionado
            </p>
          </div>

          <div className="flex border-b self-start md:self-auto" style={{ borderColor: t.border }}>
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setTabActivo(tab)}
                className="px-4 py-2 text-sm font-semibold transition-colors relative"
                style={{ color: tab === tabActivo ? "#5bcfc5" : t.textMuted }}
              >
                {tab}
                {tab === tabActivo && (
                  <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#5bcfc5] rounded-t-full"></span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto w-full scrollbar-thin">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <tbody>
              {ventasFiltradas.length > 0 ? (
                ventasFiltradas.slice(0, 5).map((row) => {
                  const estadoColor = ESTADO_COLORS[row.estado_venta] || "#c8c8c8";
                  return (
                    <tr key={row.id_venta} className="transition-colors group" style={{ borderBottom: `1px solid ${t.borderCard}` }}>
                      <td className="py-4 pl-2 pr-4">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex items-center justify-center rounded-[12px] size-12 flex-shrink-0 font-bold text-[16px]"
                            style={{ backgroundColor: `${estadoColor}1a`, color: estadoColor }}
                          >
                            {(row.cliente || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[15px] group-hover:text-[#5bcfc5] transition-colors" style={{ color: t.textPrimary }}>
                              {row.id_venta} · {row.cliente}
                            </p>
                            <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>
                              {row.metodo} · Vendido por {row.vendedor}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[15px]" style={{ color: t.textPrimary }}>{fechaLarga(row.fecha_venta)}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>{horaMin(row.fecha_venta)}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[15px] font-sans" style={{ color: t.textPrimary }}>
                          {moneyFmt(row.total_pagar)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right pr-6">
                        <span
                          className="font-semibold text-[15px] px-3.5 py-1.5 rounded-full inline-block text-xs uppercase tracking-wide border border-current"
                          style={{ color: estadoColor, backgroundColor: `${estadoColor}10` }}
                        >
                          {ESTADO_LABELS[row.estado_venta] || row.estado_venta}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="py-10 text-center">
                    <p className="text-[14px]" style={{ color: t.textMuted }}>
                      No hay ventas registradas en este período
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Banner Asistente + Stats */}
      <div className="space-y-6">

        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0f6a62] to-[#084355] border border-[#5bcfc5]/10 rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>

          <div className="bg-black/25 rounded-2xl size-20 sm:size-24 flex items-center justify-center flex-shrink-0 border border-white/10">
            <TrendingUp size={36} color="#5bcfc5" strokeWidth={2.2} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-white text-[20px] sm:text-[22px] font-semibold leading-tight">
              Impulsa tu botica con el Asistente IA
            </h3>
            <p className="text-white/80 text-[14px] mt-2 max-w-[650px] leading-relaxed">
              Consulta ventas, inventario y movimientos con análisis inteligente en tiempo real. El asistente analiza los datos de tu sistema para darte respuestas al instante.
            </p>
            <button className="text-[#5bcfc5] hover:text-[#4bc0b6] text-[14px] font-semibold mt-4 block">
              Saber más &gt;&gt;
            </button>
          </div>
        </div>

        {/* Grid stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Total de Ventas */}
          <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[170px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
            <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Total de Ventas</span>
            <div className="flex justify-between items-end">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] font-bold font-sans" style={{ color: t.textPrimary }}>{countFmt(venAll?.total_ventas)}</span>
                <span className="text-[#68e365] text-[14px] font-extrabold font-sans">{pctFmt(venCrec?.ventas ?? null)}</span>
              </div>
              <div className="flex items-end gap-2.5">
                {(() => {
                  const last4 = serie7.slice(-4);
                  const max = Math.max(1, ...last4.map((d) => d.ventas));
                  if (last4.length === 0) {
                    return [44, 61, 88, 55].map((h, i) => (
                      <div key={i} className="h-20 w-2.5 rounded-full overflow-hidden relative" style={{ background: t.barBg }}>
                        <div className="absolute bg-[#5bcfc5]/30 w-full bottom-0 rounded-full" style={{ height: `${h}%` }} />
                      </div>
                    ));
                  }
                  return [0, 1, 2, 3].map((i) => {
                    const d = last4[Math.min(i, last4.length - 1)];
                    const h = (d.ventas / max) * 100;
                    return (
                      <div key={i} className="h-20 w-2.5 rounded-full overflow-hidden relative" style={{ background: t.barBg }}>
                        <div className="absolute bg-[#5bcfc5] w-full bottom-0 rounded-full transition-all duration-500" style={{ height: `${h > 0 ? h : 6}%` }} />
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>

          {/* Ventas Pendientes */}
          <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[170px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
            <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Ventas Pendientes</span>
            <div className="space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[32px] font-bold font-sans" style={{ color: t.textPrimary }}>{countFmt(estadoCount("PENDIENTE"))}</span>
                <span className="text-[#ffa755] text-[13px] font-semibold">
                  {venAll && venAll.total_ventas > 0
                    ? `${((estadoCount("PENDIENTE") / venAll.total_ventas) * 100).toFixed(1)}% del total`
                    : "—"}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: t.barBg }}>
                <div
                  className="bg-[#5bcfc5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${venAll && venAll.total_ventas > 0 ? (estadoCount("PENDIENTE") / venAll.total_ventas) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs block font-medium" style={{ color: t.textSecondary }}>del total de ventas</span>
            </div>
          </div>

          {/* Ventas Completadas */}
          <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[164px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
            <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Ventas Completadas</span>
            <div>
              <span className="text-[32px] font-bold font-sans block leading-none" style={{ color: t.textPrimary }}>{countFmt(estadoCount("PAGADA"))}</span>
              <span className="bg-[#68e365]/10 border border-[#68e365]/25 text-[#68e365] text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-block mt-3.5">
                {venAll && venAll.total_ventas > 0
                  ? `${((estadoCount("PAGADA") / venAll.total_ventas) * 100).toFixed(1)}% del total`
                  : "—"}
              </span>
            </div>
          </div>

          {/* Ventas Anuladas */}
          <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[164px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
            <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Ventas Anuladas</span>
            <div>
              <span className="text-[32px] font-bold font-sans block leading-none" style={{ color: t.textPrimary }}>{countFmt(estadoCount("ANULADA"))}</span>
              <span className="bg-[#f72b50]/10 border border-[#f72b50]/25 text-[#f72b50] text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-block mt-3.5">
                {venAll && venAll.total_ventas > 0
                  ? `${((estadoCount("ANULADA") / venAll.total_ventas) * 100).toFixed(1)}% del total`
                  : "—"}
              </span>
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
