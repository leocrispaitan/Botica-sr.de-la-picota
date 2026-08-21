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
  Tag,
  Package,
  Calendar,
  FileText,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
  total_productos: number;
  estado_logico: boolean;
  fecha_registro: string;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockCategorias: Categoria[] = [
  {
    id_categoria: 1,
    nombre_categoria: "ANALGÉSICOS",
    descripcion: "Medicamentos para el alivio del dolor y la fiebre",
    total_productos: 15,
    estado_logico: true,
    fecha_registro: "2026-01-15 10:00:00",
  },
  {
    id_categoria: 2,
    nombre_categoria: "ANTIBIÓTICOS",
    descripcion: "Medicamentos para tratar infecciones bacterianas",
    total_productos: 22,
    estado_logico: true,
    fecha_registro: "2026-01-16 11:30:00",
  },
  {
    id_categoria: 3,
    nombre_categoria: "VITAMINAS",
    descripcion: "Suplementos vitamínicos y minerales esenciales",
    total_productos: 18,
    estado_logico: true,
    fecha_registro: "2026-01-17 09:45:00",
  },
  {
    id_categoria: 4,
    nombre_categoria: "ANTIINFLAMATORIOS",
    descripcion: "Medicamentos antiinflamatorios no esteroideos",
    total_productos: 12,
    estado_logico: true,
    fecha_registro: "2026-01-18 14:20:00",
  },
  {
    id_categoria: 5,
    nombre_categoria: "DERMATOLÓGICOS",
    descripcion: "Productos para el cuidado y tratamiento de la piel",
    total_productos: 9,
    estado_logico: true,
    fecha_registro: "2026-01-19 16:10:00",
  },
  {
    id_categoria: 6,
    nombre_categoria: "CARDIOVASCULARES",
    descripcion: "Medicamentos para el sistema cardiovascular",
    total_productos: 14,
    estado_logico: true,
    fecha_registro: "2026-01-20 08:30:00",
  },
  {
    id_categoria: 7,
    nombre_categoria: "RESPIRATORIOS",
    descripcion: "Tratamiento de enfermedades respiratorias",
    total_productos: 11,
    estado_logico: true,
    fecha_registro: "2026-01-21 13:15:00",
  },
  {
    id_categoria: 8,
    nombre_categoria: "DIGESTIVOS",
    descripcion: "Medicamentos para el sistema digestivo",
    total_productos: 0,
    estado_logico: false,
    fecha_registro: "2026-01-22 10:45:00",
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
/*  CATEGORIES MANAGEMENT COMPONENT                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export default function CategoriesManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  const t = getTheme(isDark);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return mockCategorias.filter((cat) => {
      const matchesSearch =
        cat.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || cat.estado_logico === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate stats
  const totalCategorias = mockCategorias.length;
  const categoriasActivas = mockCategorias.filter(c => c.estado_logico).length;
  const totalProductos = mockCategorias.reduce((sum, c) => sum + c.total_productos, 0);

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Gestión de Categorías
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra las categorías de productos del inventario
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Categorías */}
        <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #7c3aed 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Categorías</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>{totalCategorias}</p>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#d8b4fe" }}>Registradas</span>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Tag size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Categorías Activas */}
        <div style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 40%, #059669 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(16, 185, 129, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Categorías Activas</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>{categoriasActivas}</p>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#d1fae5" }}>En uso</span>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", fontWeight: 700, color: "#10b981" }}>✓</div>
            </div>
          </div>
        </div>

        {/* Total Productos */}
        <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Productos</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>{totalProductos}</p>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#fef3c7" }}>En todas las categorías</span>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Package size={28} color="#ffffff" strokeWidth={2.5} />
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
              <input type="text" placeholder="Buscar categoría..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: "14px", outline: "none", fontFamily: "'Cairo', sans-serif" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${showFilters ? t.accent : t.border}`, background: showFilters ? `${t.accent}15` : t.inputBg, color: showFilters ? t.accent : t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} />Filtros
            </button>
            <button style={{ padding: "12px 20px", borderRadius: "14px", border: "none", background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 4px 12px ${t.accent}40` }}>
              <Plus size={16} />Nueva Categoría
            </button>
          </div>
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", padding: "16px", background: t.innerBg, borderRadius: "12px", border: `1px solid ${t.border}` }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>Estado</label>
                <select value={statusFilter === "all" ? "all" : statusFilter ? "true" : "false"} onChange={(e) => { setStatusFilter(e.target.value === "all" ? "all" : e.target.value === "true"); handleFilterChange(); }} style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer" }}>
                  <option value="all">Todos</option>
                  <option value="true">✓ Activas</option>
                  <option value="false">✗ Inactivas</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500 }}>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} de {filteredCategories.length} categorías</p>
      </div>

      {/* Categories Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Categoría</th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Descripción</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Productos</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Estado</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}><Search size={48} color={t.textMuted} /><p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>No se encontraron categorías</p></td></tr>
              ) : (
                currentCategories.map((cat, index) => (
                  <tr key={cat.id_categoria} style={{ borderBottom: index < currentCategories.length - 1 ? `1px solid ${t.border}` : "none" }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.accent}30` }}>
                          <Tag size={20} color={t.accent} />
                        </div>
                        <div>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>{cat.nombre_categoria}</p>
                          <p style={{ fontSize: "12px", color: t.textSecondary }}>ID: {cat.id_categoria}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <FileText size={14} color={t.textMuted} />
                        <p style={{ fontSize: "13px", color: t.textSecondary }}>{cat.descripcion}</p>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: cat.total_productos > 0 ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.1)", color: cat.total_productos > 0 ? "#22c55e" : "#9ca3af", border: `1px solid ${cat.total_productos > 0 ? "rgba(34,197,94,0.3)" : "rgba(156,163,175,0.3)"}` }}>
                        <Package size={14} />
                        <span style={{ fontSize: "13px", fontWeight: 700 }}>{cat.total_productos}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: cat.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: cat.estado_logico ? "#22c55e" : "#ef4444", border: `1px solid ${cat.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: cat.estado_logico ? "#22c55e" : "#ef4444" }} />
                        {cat.estado_logico ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                        <button title="Ver detalles" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}>
                          <Eye size={16} />
                        </button>
                        <button title="Editar" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}>
                          <Edit2 size={16} />
                        </button>
                        <button title="Eliminar" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}>
                          <Trash2 size={16} />
                        </button>
                        <button title="Más" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}>
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCategories.length > 0 && (
          <div style={{ padding: "20px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>Página {currentPage} de {totalPages}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === 1 ? t.innerBg : t.cardBg, color: currentPage === 1 ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: currentPage === 1 ? 0.5 : 1 }}>
                <ChevronLeft size={16} />Anterior
              </button>
              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${page === currentPage ? t.accent : t.border}`, background: page === currentPage ? `${t.accent}15` : t.cardBg, color: page === currentPage ? t.accent : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: "pointer", minWidth: "36px" }}>
                    {page}
                  </button>
                ))}
              </div>
              <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === totalPages ? t.innerBg : t.cardBg, color: currentPage === totalPages ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", opacity: currentPage === totalPages ? 0.5 : 1 }}>
                Siguiente<ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
