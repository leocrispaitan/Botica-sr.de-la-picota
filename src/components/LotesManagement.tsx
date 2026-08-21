import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Package,
  Calendar,
  MapPin,
  DollarSign,
  AlertCircle,
  Box,
  Pill,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Producto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
}

interface Lote {
  id_inventario: number;
  id_producto: number;
  numero_lote: string;
  fecha_vencimiento: string;
  fecha_ingreso: string;
  costo_unitario_compra: number;
  stock_lote: number;
  ubicacion_estante: string;
  producto: Producto;
  dias_para_vencer: number;
  estado_vencimiento: "vigente" | "proximo" | "vencido";
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockLotes: Lote[] = [
  {
    id_inventario: 1,
    id_producto: 1,
    numero_lote: "LOTE-A001",
    fecha_vencimiento: "2027-01-15",
    fecha_ingreso: "2026-01-10 08:30:00",
    costo_unitario_compra: 7.00,
    stock_lote: 50,
    ubicacion_estante: "Estante A1",
    dias_para_vencer: 512,
    estado_vencimiento: "vigente",
    producto: {
      id_producto: 1,
      nombre_comercial: "Panadol Jarabe",
      nombre_generico: "Paracetamol",
    },
  },
  {
    id_inventario: 2,
    id_producto: 2,
    numero_lote: "LOTE-B002",
    fecha_vencimiento: "2026-11-20",
    fecha_ingreso: "2026-02-15 10:00:00",
    costo_unitario_compra: 11.00,
    stock_lote: 30,
    ubicacion_estante: "Estante B2",
    dias_para_vencer: 456,
    estado_vencimiento: "vigente",
    producto: {
      id_producto: 2,
      nombre_comercial: "Amoxil 500",
      nombre_generico: "Amoxicilina",
    },
  },
  {
    id_inventario: 3,
    id_producto: 3,
    numero_lote: "LOTE-C003",
    fecha_vencimiento: "2026-09-10",
    fecha_ingreso: "2026-03-01 14:20:00",
    costo_unitario_compra: 30.00,
    stock_lote: 75,
    ubicacion_estante: "Estante C1",
    dias_para_vencer: 385,
    estado_vencimiento: "vigente",
    producto: {
      id_producto: 3,
      nombre_comercial: "Centrum Adultos",
      nombre_generico: "Multivitamínico",
    },
  },
  {
    id_inventario: 4,
    id_producto: 4,
    numero_lote: "LOTE-D004",
    fecha_vencimiento: "2026-10-05",
    fecha_ingreso: "2026-04-10 09:15:00",
    costo_unitario_compra: 4.50,
    stock_lote: 120,
    ubicacion_estante: "Estante D3",
    dias_para_vencer: 410,
    estado_vencimiento: "vigente",
    producto: {
      id_producto: 4,
      nombre_comercial: "Ibuprofeno 400mg",
      nombre_generico: "Ibuprofeno",
    },
  },
  {
    id_inventario: 5,
    id_producto: 5,
    numero_lote: "LOTE-E005",
    fecha_vencimiento: "2026-09-25",
    fecha_ingreso: "2026-05-20 11:45:00",
    costo_unitario_compra: 9.00,
    stock_lote: 8,
    ubicacion_estante: "Estante E2",
    dias_para_vencer: 400,
    estado_vencimiento: "vigente",
    producto: {
      id_producto: 5,
      nombre_comercial: "Crema Dermatológica",
      nombre_generico: "Hidrocortisona",
    },
  },
  {
    id_inventario: 6,
    id_producto: 1,
    numero_lote: "LOTE-A002",
    fecha_vencimiento: "2026-09-01",
    fecha_ingreso: "2026-06-01 08:00:00",
    costo_unitario_compra: 7.20,
    stock_lote: 45,
    ubicacion_estante: "Estante A2",
    dias_para_vencer: 376,
    estado_vencimiento: "proximo",
    producto: {
      id_producto: 1,
      nombre_comercial: "Panadol Jarabe",
      nombre_generico: "Paracetamol",
    },
  },
  {
    id_inventario: 7,
    id_producto: 6,
    numero_lote: "LOTE-F006",
    fecha_vencimiento: "2026-08-25",
    fecha_ingreso: "2026-07-10 16:30:00",
    costo_unitario_compra: 3.50,
    stock_lote: 95,
    ubicacion_estante: "Estante F1",
    dias_para_vencer: 369,
    estado_vencimiento: "proximo",
    producto: {
      id_producto: 6,
      nombre_comercial: "Aspirina 500mg",
      nombre_generico: "Ácido Acetilsalicílico",
    },
  },
  {
    id_inventario: 8,
    id_producto: 7,
    numero_lote: "LOTE-G007",
    fecha_vencimiento: "2025-12-31",
    fecha_ingreso: "2025-11-01 10:00:00",
    costo_unitario_compra: 3.00,
    stock_lote: 15,
    ubicacion_estante: "Estante G2",
    dias_para_vencer: -232,
    estado_vencimiento: "vencido",
    producto: {
      id_producto: 7,
      nombre_comercial: "Loratadina 10mg",
      nombre_generico: "Loratadina",
    },
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

export default function LotesManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  const t = getTheme(isDark);

  const filteredLotes = useMemo(() => {
    return mockLotes.filter((lote) => {
      const matchesSearch =
        lote.numero_lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.producto.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.producto.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.ubicacion_estante.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = estadoFilter === "all" || lote.estado_vencimiento === estadoFilter;

      return matchesSearch && matchesEstado;
    });
  }, [searchTerm, estadoFilter]);

  const totalPages = Math.ceil(filteredLotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLotes = filteredLotes.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const totalLotes = mockLotes.length;
  const lotesVigentes = mockLotes.filter(l => l.estado_vencimiento === "vigente").length;
  const lotesPorVencer = mockLotes.filter(l => l.estado_vencimiento === "proximo").length;
  const lotesVencidos = mockLotes.filter(l => l.estado_vencimiento === "vencido").length;
  const valorInventario = mockLotes.reduce((sum, l) => sum + (l.costo_unitario_compra * l.stock_lote), 0);

  const getEstadoVencimientoColors = (estado: string) => {
    if (estado === "vigente") return { bg: "rgba(34,197,94,0.1)", text: "#22c55e", border: "rgba(34,197,94,0.3)", icon: "✓" };
    if (estado === "proximo") return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)", icon: "⚠️" };
    return { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.3)", icon: "✗" };
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>Gestión de Lotes</h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>Control de lotes, fechas de vencimiento y ubicaciones</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <div style={{ background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 40%, #2563eb 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(59, 130, 246, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Total Lotes</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>{totalLotes}</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Box size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 40%, #059669 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Lotes Vigentes</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>{lotesVigentes}</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#10b981" }}>✓</div>
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Por Vencer</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>{lotesPorVencer}</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertCircle size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #ef4444 0%, #f87171 40%, #dc2626 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Lotes Vencidos</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", lineHeight: 1 }}>{lotesVencidos}</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", color: "#ef4444" }}>✗</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input type="text" placeholder="Buscar por lote, producto o ubicación..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: "14px", outline: "none" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${showFilters ? t.accent : t.border}`, background: showFilters ? `${t.accent}15` : t.inputBg, color: showFilters ? t.accent : t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} />Filtros
            </button>
            <button style={{ padding: "12px 20px", borderRadius: "14px", border: "none", background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 4px 12px ${t.accent}40` }}>
              <Plus size={16} />Nuevo Lote
            </button>
          </div>
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", padding: "16px", background: t.innerBg, borderRadius: "12px", border: `1px solid ${t.border}` }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>Estado Vencimiento</label>
                <select value={estadoFilter} onChange={(e) => { setEstadoFilter(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer" }}>
                  <option value="all">Todos</option>
                  <option value="vigente">✓ Vigentes</option>
                  <option value="proximo">⚠️ Por Vencer</option>
                  <option value="vencido">✗ Vencidos</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500, marginBottom: "16px" }}>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredLotes.length)} de {filteredLotes.length} lotes</p>

      {/* Lotes Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Lote / Producto</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Vencimiento</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Stock</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Ubicación</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Estado</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentLotes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}><Search size={48} color={t.textMuted} /><p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>No se encontraron lotes</p></td></tr>
              ) : (
                currentLotes.map((lote, index) => {
                  const estadoColors = getEstadoVencimientoColors(lote.estado_vencimiento);
                  return (
                    <tr key={lote.id_inventario} style={{ borderBottom: index < currentLotes.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <Box size={14} color={t.accent} />
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>{lote.numero_lote}</p>
                          </div>
                          <p style={{ fontSize: "13px", color: t.textSecondary }}>{lote.producto.nombre_comercial}</p>
                          <p style={{ fontSize: "11px", color: t.textMuted }}>{lote.producto.nombre_generico}</p>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <Calendar size={14} color={t.textMuted} />
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>{new Date(lote.fecha_vencimiento).toLocaleDateString("es-PE")}</p>
                          </div>
                          <p style={{ fontSize: "11px", color: t.textSecondary }}>{lote.dias_para_vencer > 0 ? `${lote.dias_para_vencer} días` : "Vencido"}</p>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 12px", borderRadius: "10px", background: `${t.accent}10`, border: `1px solid ${t.accent}30` }}>
                          <Package size={16} color={t.accent} />
                          <span style={{ fontSize: "14px", fontWeight: 700, color: t.textPrimary }}>{lote.stock_lote}</span>
                          <span style={{ fontSize: "10px", color: t.textSecondary }}>unidades</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MapPin size={14} color={t.textMuted} />
                          <span style={{ fontSize: "13px", color: t.textSecondary }}>{lote.ubicacion_estante}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: estadoColors.bg, color: estadoColors.text, border: `1px solid ${estadoColors.border}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                          <span>{estadoColors.icon}</span>
                          {lote.estado_vencimiento === "vigente" ? "Vigente" : lote.estado_vencimiento === "proximo" ? "Por Vencer" : "Vencido"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button title="Ver" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><Eye size={16} /></button>
                          <button title="Editar" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><Edit2 size={16} /></button>
                          <button title="Eliminar" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><Trash2 size={16} /></button>
                          <button title="Más" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><MoreVertical size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {filteredLotes.length > 0 && (
          <div style={{ padding: "20px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>Página {currentPage} de {totalPages}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === 1 ? t.innerBg : t.cardBg, color: currentPage === 1 ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: currentPage === 1 ? 0.5 : 1 }}><ChevronLeft size={16} />Anterior</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${page === currentPage ? t.accent : t.border}`, background: page === currentPage ? `${t.accent}15` : t.cardBg, color: page === currentPage ? t.accent : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: "pointer", minWidth: "36px" }}>{page}</button>
              ))}
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === totalPages ? t.innerBg : t.cardBg, color: currentPage === totalPages ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: currentPage === totalPages ? 0.5 : 1 }}>Siguiente<ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
