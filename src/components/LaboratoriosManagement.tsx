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
  Building2,
  CheckCircle2,
  Archive,
  Globe,
  MapPin,
  Briefcase,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Laboratorio {
  id_laboratorio: number;
  nombre: string;
  pais: string;
  tipo_entidad: string;
  estado_logico: boolean;
  fecha_registro?: string;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockLaboratorios: Laboratorio[] = [
  {
    id_laboratorio: 1,
    nombre: "GLAXOSMITHKLINE PERU S.A.",
    pais: "PERU",
    tipo_entidad: "DROGUERÍA",
    estado_logico: true,
    fecha_registro: "2026-01-15 10:30:00",
  },
  {
    id_laboratorio: 2,
    nombre: "GLAXOSMITHKLINE COSTA RICA S.A.",
    pais: "COSTA RICA",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-01-15 10:31:00",
  },
  {
    id_laboratorio: 3,
    nombre: "PFIZER S.A.",
    pais: "ESTADOS UNIDOS",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-01-20 11:45:00",
  },
  {
    id_laboratorio: 4,
    nombre: "BAYER S.A.",
    pais: "ALEMANIA",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-01-20 11:46:00",
  },
  {
    id_laboratorio: 5,
    nombre: "NOVARTIS PHARMACEUTICAL S.A.",
    pais: "SUIZA",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-02-05 14:20:00",
  },
  {
    id_laboratorio: 6,
    nombre: "ROCHE PERU S.A.",
    pais: "PERU",
    tipo_entidad: "DROGUERÍA",
    estado_logico: true,
    fecha_registro: "2026-02-05 14:21:00",
  },
  {
    id_laboratorio: 7,
    nombre: "SANOFI AVENTIS S.A.",
    pais: "FRANCIA",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-02-10 09:15:00",
  },
  {
    id_laboratorio: 8,
    nombre: "MERCK SHARP & DOHME PERU S.R.L.",
    pais: "PERU",
    tipo_entidad: "DROGUERÍA",
    estado_logico: true,
    fecha_registro: "2026-02-10 09:16:00",
  },
  {
    id_laboratorio: 9,
    nombre: "JOHNSON & JOHNSON S.A.",
    pais: "ESTADOS UNIDOS",
    tipo_entidad: "FABRICANTE",
    estado_logico: false,
    fecha_registro: "2026-02-15 10:30:00",
  },
  {
    id_laboratorio: 10,
    nombre: "ABBOTT LABORATORIES S.A.",
    pais: "ESTADOS UNIDOS",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-03-01 08:45:00",
  },
  {
    id_laboratorio: 11,
    nombre: "ASTRAZENECA PERU S.A.C.",
    pais: "PERU",
    tipo_entidad: "DROGUERÍA",
    estado_logico: true,
    fecha_registro: "2026-03-01 08:46:00",
  },
  {
    id_laboratorio: 12,
    nombre: "ELI LILLY AND COMPANY",
    pais: "ESTADOS UNIDOS",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-03-05 11:20:00",
  },
  {
    id_laboratorio: 13,
    nombre: "BOEHRINGER INGELHEIM S.A.",
    pais: "ALEMANIA",
    tipo_entidad: "FABRICANTE",
    estado_logico: true,
    fecha_registro: "2026-03-05 11:21:00",
  },
  {
    id_laboratorio: 14,
    nombre: "BRISTOL MYERS SQUIBB PERU S.A.",
    pais: "PERU",
    tipo_entidad: "DROGUERÍA",
    estado_logico: true,
    fecha_registro: "2026-03-10 13:30:00",
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
/*  LABORATORIOS MANAGEMENT COMPONENT                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export default function LaboratoriosManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [paisFilter, setPaisFilter] = useState<string>("all");
  const [tipoFilter, setTipoFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  const t = getTheme(isDark);

  // Get unique countries and entity types for filters
  const paises = Array.from(new Set(mockLaboratorios.map((lab) => lab.pais))).sort();
  const tipos = Array.from(new Set(mockLaboratorios.map((lab) => lab.tipo_entidad))).sort();

  // Filtered laboratorios
  const filteredLaboratorios = useMemo(() => {
    return mockLaboratorios.filter((lab) => {
      const matchesSearch =
        lab.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.pais.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lab.tipo_entidad.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lab.estado_logico === statusFilter;
      const matchesPais = paisFilter === "all" || lab.pais === paisFilter;
      const matchesTipo = tipoFilter === "all" || lab.tipo_entidad === tipoFilter;
      return matchesSearch && matchesStatus && matchesPais && matchesTipo;
    });
  }, [searchTerm, statusFilter, paisFilter, tipoFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLaboratorios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaboratorios = filteredLaboratorios.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Laboratorios
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra los laboratorios farmacéuticos y fabricantes registrados
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Laboratorios - Orange Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ea580c 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(249, 115, 22, 0.25)",
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
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Laboratorios
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {mockLaboratorios.length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fed7aa" }}>
                  Registrados
                </span>
              </div>
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
              <Building2 size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Laboratorios Activos - Amber Gradient */}
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
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Laboratorios Activos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {mockLaboratorios.filter((l) => l.estado_logico).length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fde68a" }}>
                  Operativos
                </span>
              </div>
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
              <CheckCircle2 size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Laboratorios Inactivos - Gray Gradient */}
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
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Laboratorios Inactivos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {mockLaboratorios.filter((l) => !l.estado_logico).length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#cbd5e1" }}>
                  Archivados
                </span>
              </div>
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
              <Archive size={28} color="#ffffff" strokeWidth={2.5} />
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
                placeholder="Buscar por nombre, país o tipo de entidad..."
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
              {(statusFilter !== "all" || paisFilter !== "all" || tipoFilter !== "all") && (
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
                  {(statusFilter !== "all" ? 1 : 0) + (paisFilter !== "all" ? 1 : 0) + (tipoFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Add Button */}
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
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.accent}50`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`;
              }}
            >
              <Plus size={16} />
              Nuevo Laboratorio
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                padding: "16px",
                background: t.innerBg,
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  País
                </label>
                <select
                  value={paisFilter}
                  onChange={(e) => {
                    setPaisFilter(e.target.value);
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
                  <option value="all">Todos los países</option>
                  {paises.map((pais) => (
                    <option key={pais} value={pais}>
                      {pais}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Tipo de Entidad
                </label>
                <select
                  value={tipoFilter}
                  onChange={(e) => {
                    setTipoFilter(e.target.value);
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
                  <option value="all">Todos los tipos</option>
                  {tipos.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Estado
                </label>
                <select
                  value={statusFilter === "all" ? "all" : statusFilter ? "true" : "false"}
                  onChange={(e) => {
                    setStatusFilter(e.target.value === "all" ? "all" : e.target.value === "true");
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
                  <option value="all">Todos los estados</option>
                  <option value="true">✓ Activos</option>
                  <option value="false">✗ Inactivos</option>
                </select>
              </div>

              {(statusFilter !== "all" || paisFilter !== "all" || tipoFilter !== "all") && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setPaisFilter("all");
                      setTipoFilter("all");
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredLaboratorios.length)} de {filteredLaboratorios.length} laboratorios
        </p>
        {filteredLaboratorios.length === 0 && searchTerm && (
          <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
            No se encontraron resultados para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Laboratorios Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ID
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Laboratorio
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  País
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Tipo Entidad
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
              {currentLaboratorios.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <Search size={48} color={t.textMuted} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                        No se encontraron laboratorios
                      </p>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentLaboratorios.map((lab, index) => {
                  return (
                    <tr
                      key={lab.id_laboratorio}
                      style={{
                        borderBottom: index < currentLaboratorios.length - 1 ? `1px solid ${t.border}` : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                      }}
                    >
                      {/* ID */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "12px",
                              background: "linear-gradient(135deg, #f97316 0%, #fb923c 100%)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              boxShadow: "0 4px 12px rgba(249, 115, 22, 0.25)",
                              flexShrink: 0,
                            }}
                          >
                            <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                              {lab.id_laboratorio}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Nombre */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <Building2 size={18} color={t.accent} strokeWidth={2} />
                          <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {lab.nombre}
                          </span>
                        </div>
                      </td>

                      {/* País */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MapPin size={14} color={t.textMuted} />
                          <span style={{ fontSize: "13px", color: t.textSecondary }}>
                            {lab.pais}
                          </span>
                        </div>
                      </td>

                      {/* Tipo Entidad */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Briefcase size={14} color={t.textMuted} />
                          <span
                            style={{
                              fontSize: "12px",
                              fontWeight: 600,
                              color: lab.tipo_entidad === "FABRICANTE" ? "#3b82f6" : "#8b5cf6",
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: lab.tipo_entidad === "FABRICANTE" ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.1)",
                              border: `1px solid ${lab.tipo_entidad === "FABRICANTE" ? "rgba(59, 130, 246, 0.3)" : "rgba(139, 92, 246, 0.3)"}`,
                            }}
                          >
                            {lab.tipo_entidad}
                          </span>
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
                            background: lab.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                            color: lab.estado_logico ? "#22c55e" : "#ef4444",
                            border: `1px solid ${lab.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: lab.estado_logico ? "#22c55e" : "#ef4444" }} />
                          {lab.estado_logico ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button
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
                            title="Editar laboratorio"
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
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#fb923c";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            title="Eliminar laboratorio"
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
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            title="Más opciones"
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
                              (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                              (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <MoreVertical size={16} />
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
        {filteredLaboratorios.length > 0 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                ))}
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
    </div>
  );
}
