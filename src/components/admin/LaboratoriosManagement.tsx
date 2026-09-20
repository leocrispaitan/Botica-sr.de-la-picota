import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  CheckCircle2,
  Archive,
  MapPin,
  Briefcase,
  X,
  Save,
  AlertCircle,
  RefreshCw,
  Package,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  laboratoriosService,
  type Laboratorio,
  type NewLaboratorioInput,
} from "../../services/laboratoriosService";

/* ─── Toast de éxito / error ─────────────────────────────────────── */
const showToast = (
  esExito: boolean,
  titulo: string,
  descripcion: string,
  isDark: boolean
) => {
  const color = esExito ? "#5bcfc5" : "#ef4444";
  toast.custom(
    (t) => (
      <div
        style={{
          background: isDark ? "#212130" : "#ffffff",
          padding: "20px 24px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: `2px solid ${isDark ? `${color}40` : `${color}33`}`,
          maxWidth: "420px",
          width: "100%",
          animation: t.visible ? "slideIn 0.4s ease-out forwards" : "slideOut 0.3s ease-in forwards",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: esExito
                ? "linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)"
                : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 8px 24px ${color}40`,
              flexShrink: 0,
            }}
          >
            {esExito ? (
              <CheckCircle2 size={30} color="#fff" strokeWidth={2.5} />
            ) : (
              <AlertCircle size={30} color="#fff" strokeWidth={2.5} />
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontSize: "17px", fontWeight: 700, color, marginBottom: "4px", fontFamily: "'Cairo', sans-serif" }}>
              {titulo}
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
              {descripcion}
            </p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              border: "none",
              background: isDark ? "#1e1d29" : "#f5f6fa",
              color: isDark ? "#828690" : "#787f9e",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </div>
        <style>{`
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-12px); }
          }
        `}</style>
      </div>
    ),
    { duration: 5000 }
  );
};

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

/* ─── Form state inicial ─────────────────────────────────────────── */
const emptyForm = {
  nombre: "",
  pais: "",
  tipo_entidad: "",
};

/* ─── Opciones sugeridas de país y tipo de entidad ───────────────── */
const tiposEntidadSugeridos = [
  "FABRICANTE",
  "DROGUERÍA",
  "IMPORTADOR",
  "DISTRIBUIDOR",
  "LABORATORIO",
  "OTRO",
];

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

  // ═══ Datos reales desde el backend ═══
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Crear / Editar / Ver ═══
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedLab, setSelectedLab] = useState<Laboratorio | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ═══ Modal: Desactivar / Reactivar ═══
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [labToToggle, setLabToToggle] = useState<Laboratorio | null>(null);
  const [togglings, setTogglings] = useState(false);

  const itemsPerPage = 6;
  const t = getTheme(isDark);

  const loadLaboratorios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await laboratoriosService.getAllLaboratorios();
      setLaboratorios(data);
    } catch (err: any) {
      console.error("❌ Error al cargar laboratorios:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los laboratorios. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLaboratorios();
  }, [loadLaboratorios]);

  // Mantener la lista ordenada por nombre (igual que el backend)
  const sortLaboratorios = (lista: Laboratorio[]) =>
    [...lista].sort((a, b) => (a.nombre || "").localeCompare(b.nombre || ""));

  // Unique countries and entity types for filters based on real data
  const paises = Array.from(new Set(laboratorios.map((lab) => lab.pais).filter(Boolean))).sort() as string[];
  const tipos = Array.from(new Set(laboratorios.map((lab) => lab.tipo_entidad).filter(Boolean))).sort() as string[];

  // Filtered laboratorios
  const filteredLaboratorios = useMemo(() => {
    return laboratorios.filter((lab) => {
      const matchesSearch =
        (lab.nombre || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lab.pais || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lab.tipo_entidad || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || lab.estado_logico === statusFilter;
      const matchesPais = paisFilter === "all" || lab.pais === paisFilter;
      const matchesTipo = tipoFilter === "all" || lab.tipo_entidad === tipoFilter;
      return matchesSearch && matchesStatus && matchesPais && matchesTipo;
    });
  }, [laboratorios, searchTerm, statusFilter, paisFilter, tipoFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredLaboratorios.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLaboratorios = filteredLaboratorios.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Total de laboratorios (datos reales de todos los registros)
  const totalLaboratorios = laboratorios.length;
  const laboratoriosActivos = laboratorios.filter((l) => l.estado_logico).length;
  const laboratoriosInactivos = laboratorios.filter((l) => !l.estado_logico).length;

  const numFiltrosActivos =
    (statusFilter !== "all" ? 1 : 0) + (paisFilter !== "all" ? 1 : 0) + (tipoFilter !== "all" ? 1 : 0);

  /* ─── Gestión del Modal ─── */
  const handleOpenModal = (mode: "create" | "edit" | "view", lab?: Laboratorio) => {
    setModalMode(mode);
    setSelectedLab(lab || null);

    if (mode === "create") {
      setFormData(emptyForm);
    } else if (lab) {
      setFormData({
        nombre: lab.nombre || "",
        pais: lab.pais || "",
        tipo_entidad: lab.tipo_entidad || "",
      });
    }

    if (mode === "view" && lab) {
      setLoadingDetail(true);
      laboratoriosService
        .getLaboratorioById(lab.id_laboratorio)
        .then((detalle) => setSelectedLab(detalle))
        .catch((err) => {
          console.error("❌ Error al cargar el detalle:", err);
          showToast(
            false,
            "No se pudo cargar el detalle",
            err?.response?.data?.message || "Intenta nuevamente.",
            isDark
          );
        })
        .finally(() => setLoadingDetail(false));
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedLab(null);
  };

  /* ─── Guardar Laboratorio (crear o editar) ─── */
  const handleSaveLaboratorio = async () => {
    if (!formData.nombre.trim()) {
      showToast(false, "Datos incompletos", "Por favor completa el nombre del laboratorio.", isDark);
      return;
    }
    if (formData.nombre.trim().length > 150) {
      showToast(false, "Nombre muy largo", "El nombre no puede superar los 150 caracteres.", isDark);
      return;
    }
    if (formData.pais.trim().length > 80) {
      showToast(false, "País muy largo", "El país no puede superar los 80 caracteres.", isDark);
      return;
    }
    if (formData.tipo_entidad.trim().length > 50) {
      showToast(false, "Tipo de entidad muy largo", "El tipo de entidad no puede superar los 50 caracteres.", isDark);
      return;
    }

    const payload: NewLaboratorioInput = {
      nombre: formData.nombre.trim(),
      pais: formData.pais.trim() || null,
      tipo_entidad: formData.tipo_entidad.trim() || null,
    };

    setSaving(true);
    try {
      if (modalMode === "create") {
        const nuevo = await laboratoriosService.createLaboratorio(payload);
        setLaboratorios((prev) => sortLaboratorios([...prev, nuevo]));
        showToast(true, "¡Laboratorio Creado!", `${nuevo.nombre} se registró exitosamente.`, isDark);
      } else if (modalMode === "edit" && selectedLab) {
        const actualizado = await laboratoriosService.updateLaboratorio(
          selectedLab.id_laboratorio,
          payload
        );
        setLaboratorios((prev) =>
          sortLaboratorios(prev.map((l) => (l.id_laboratorio === actualizado.id_laboratorio ? actualizado : l)))
        );
        showToast(true, "¡Laboratorio Actualizado!", `${actualizado.nombre} se actualizó correctamente.`, isDark);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("❌ Error al guardar laboratorio:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo guardar el laboratorio. Intenta nuevamente.";
      showToast(false, "No se pudo guardar", mensaje, isDark);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Desactivar / Reactivar Laboratorio ─── */
  const handleOpenToggleModal = (lab: Laboratorio) => {
    setSelectedLab(lab);
    setLabToToggle(lab);
    setShowToggleModal(true);
  };

  const closeToggleModal = () => {
    setShowToggleModal(false);
    setLabToToggle(null);
  };

  const handleConfirmToggle = async () => {
    if (!labToToggle) return;

    const esActivacion = !labToToggle.estado_logico;
    setTogglings(true);
    try {
      if (esActivacion) {
        const reactivado = await laboratoriosService.updateLaboratorio(labToToggle.id_laboratorio, {
          nombre: labToToggle.nombre,
          pais: labToToggle.pais,
          tipo_entidad: labToToggle.tipo_entidad,
          estado_logico: true,
        });
        setLaboratorios((prev) =>
          sortLaboratorios(prev.map((l) => (l.id_laboratorio === reactivado.id_laboratorio ? reactivado : l)))
        );
        showToast(true, "¡Laboratorio Reactivado!", `${reactivado.nombre} se habilitó nuevamente.`, isDark);
      } else {
        const desactivado = await laboratoriosService.deleteLaboratorio(labToToggle.id_laboratorio);
        setLaboratorios((prev) =>
          sortLaboratorios(prev.map((l) => (l.id_laboratorio === desactivado.id_laboratorio ? desactivado : l)))
        );
        showToast(
          true,
          "¡Laboratorio Desactivado!",
          `${desactivado.nombre} se desactivó. Puedes reactivarlo cuando lo necesites.`,
          isDark
        );
      }
      closeToggleModal();
    } catch (err: any) {
      console.error("❌ Error al cambiar estado del laboratorio:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo cambiar el estado. Intenta nuevamente.";
      showToast(false, "No se pudo cambiar el estado", mensaje, isDark);
    } finally {
      setTogglings(false);
    }
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "transparent",
            boxShadow: "none",
            padding: 0,
            width: "auto",
          },
        }}
      />

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
                {loading ? "—" : totalLaboratorios}
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
                {loading ? "—" : laboratoriosActivos}
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
                {loading ? "—" : laboratoriosInactivos}
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
              {numFiltrosActivos > 0 && (
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
                  {numFiltrosActivos}
                </span>
              )}
            </button>

            {/* Add Button */}
            <button
              onClick={() => handleOpenModal("create")}
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

              {numFiltrosActivos > 0 && (
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

      {/* Loading State */}
      {loading && (
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            border: `4px solid ${t.border}`,
            borderTopColor: t.accent,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
          }} />
          <p style={{ fontSize: "15px", fontWeight: 600, color: t.textSecondary }}>
            Cargando laboratorios...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "80px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "44px" }}>😕</span>
          <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
            No se pudieron cargar los laboratorios
          </p>
          <p style={{ fontSize: "14px", color: t.textSecondary, textAlign: "center", maxWidth: "420px" }}>
            {error}
          </p>
          <button
            onClick={loadLaboratorios}
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
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = t.accent;
            }}
          >
            <RefreshCw size={16} />
            Reintentar
          </button>
        </div>
      )}

      {/* Results + Table */}
      {!loading && !error && (
        <>
          {/* Results Info */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500 }}>
              Mostrando {filteredLaboratorios.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredLaboratorios.length)} de {filteredLaboratorios.length} laboratorios
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
                      const esFabricante = lab.tipo_entidad === "FABRICANTE";
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
                                {lab.pais || "—"}
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
                                  color: esFabricante ? "#3b82f6" : "#8b5cf6",
                                  padding: "4px 8px",
                                  borderRadius: "6px",
                                  background: esFabricante ? "rgba(59, 130, 246, 0.1)" : "rgba(139, 92, 246, 0.1)",
                                  border: `1px solid ${esFabricante ? "rgba(59, 130, 246, 0.3)" : "rgba(139, 92, 246, 0.3)"}`,
                                }}
                              >
                                {lab.tipo_entidad || "—"}
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
                                onClick={() => handleOpenModal("view", lab)}
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
                                onClick={() => handleOpenModal("edit", lab)}
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
                                onClick={() => handleOpenToggleModal(lab)}
                                title={lab.estado_logico ? "Desactivar laboratorio" : "Activar laboratorio"}
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
        </>
      )}

      {/* Modal: Crear / Editar / Ver */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
              animation: "fadeIn 0.2s ease",
            }}
            onClick={handleCloseModal}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "560px",
              maxHeight: "90vh",
              background: t.cardBg,
              borderRadius: "24px",
              border: `1px solid ${t.borderCard}`,
              boxShadow: isDark
                ? "0 24px 48px rgba(0,0,0,0.6)"
                : "0 24px 48px rgba(0,0,0,0.15)",
              zIndex: 9999,
              overflow: "hidden",
              animation: "slideUp 0.3s ease",
            }}
          >
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideUp {
                from { opacity: 0; transform: translate(-50%, -45%); }
                to { opacity: 1; transform: translate(-50%, -50%); }
              }
            `}</style>

            {/* Modal Header */}
            <div
              style={{
                padding: "24px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                  {modalMode === "create" ? "Nuevo Laboratorio" : modalMode === "edit" ? "Editar Laboratorio" : "Detalle del Laboratorio"}
                </h2>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  {modalMode === "create" ? "Registra un nuevo laboratorio del catálogo" : modalMode === "edit" ? "Actualiza los datos del laboratorio" : "Información completa del laboratorio"}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "none",
                  background: t.innerBg,
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
                  (e.currentTarget as HTMLButtonElement).style.background = t.innerBg;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", maxHeight: "calc(90vh - 180px)", overflowY: "auto" }}>
              {modalMode === "view" ? (
                loadingDetail || !selectedLab ? (
                  // ─── Cargando detalle ───
                  <div style={{ padding: "40px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <div style={{
                      width: "40px",
                      height: "40px",
                      border: `4px solid ${t.border}`,
                      borderTopColor: t.accent,
                      borderRadius: "50%",
                      animation: "spinDetail 0.8s linear infinite",
                    }} />
                    <p style={{ fontSize: "14px", fontWeight: 600, color: t.textSecondary }}>
                      Cargando detalle...
                    </p>
                    <style>{`
                      @keyframes spinDetail {
                        to { transform: rotate(360deg); }
                      }
                    `}</style>
                  </div>
                ) : (
                  // ─── View Mode ───
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        Nombre del Laboratorio
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, display: "flex", alignItems: "center", gap: "8px" }}>
                        <Building2 size={18} color={t.accent} strokeWidth={2} />
                        {selectedLab.nombre}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          ID
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                          #{selectedLab.id_laboratorio}
                        </p>
                      </div>

                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          Fecha de Registro
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                          {selectedLab.fecha_registro
                            ? new Date(selectedLab.fecha_registro).toLocaleDateString("es-PE", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          País
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, display: "flex", alignItems: "center", gap: "8px" }}>
                          <MapPin size={16} color={t.textMuted} />
                          {selectedLab.pais || "—"}
                        </p>
                      </div>

                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          Tipo de Entidad
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, display: "flex", alignItems: "center", gap: "8px" }}>
                          <Briefcase size={16} color={t.textMuted} />
                          {selectedLab.tipo_entidad || "—"}
                        </p>
                      </div>
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        Estado
                      </p>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: selectedLab.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: selectedLab.estado_logico ? "#22c55e" : "#ef4444",
                          border: `1px solid ${selectedLab.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedLab.estado_logico ? "#22c55e" : "#ef4444" }} />
                        {selectedLab.estado_logico ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div style={{ padding: "16px", background: `${t.accent}15`, borderRadius: "16px", border: `1px solid ${t.accent}30` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.accent, marginBottom: "8px", textTransform: "uppercase" }}>
                        Productos Asociados (Titular / Fabricante)
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: t.accent }}>
                        {selectedLab.total_productos ?? 0}
                      </p>
                      {selectedLab.productos && selectedLab.productos.length > 0 && (
                        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                          {selectedLab.productos.map((producto) => (
                            <div
                              key={producto.id_producto}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                gap: "10px",
                                padding: "10px 12px",
                                background: t.cardBg,
                                borderRadius: "10px",
                                border: `1px solid ${t.border}`,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                                <Package size={14} color={t.textMuted} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {producto.nombre_comercial}
                                </span>
                                <span
                                  style={{
                                    fontSize: "10px",
                                    fontWeight: 700,
                                    color: "#8b5cf6",
                                    padding: "2px 6px",
                                    borderRadius: "5px",
                                    background: "rgba(139, 92, 246, 0.1)",
                                    border: "1px solid rgba(139, 92, 246, 0.3)",
                                    flexShrink: 0,
                                  }}
                                >
                                  {producto.rol}
                                </span>
                              </div>
                              <span style={{ fontSize: "12px", color: t.textSecondary, flexShrink: 0 }}>
                                S/ {(producto.precio_venta || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              ) : (
                // ─── Create / Edit Mode ───
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Nombre del Laboratorio *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: GLAXOSMITHKLINE PERU S.A."
                      maxLength={150}
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        border: `1px solid ${t.border}`,
                        background: t.inputBg,
                        color: t.textPrimary,
                        fontSize: "14px",
                        fontFamily: "'Cairo', sans-serif",
                        outline: "none",
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

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      País
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: PERÚ, COSTA RICA..."
                      maxLength={80}
                      value={formData.pais}
                      onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        border: `1px solid ${t.border}`,
                        background: t.inputBg,
                        color: t.textPrimary,
                        fontSize: "14px",
                        fontFamily: "'Cairo', sans-serif",
                        outline: "none",
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

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Tipo de Entidad
                    </label>
                    <input
                      type="text"
                      list="tipos-entidad"
                      placeholder="Selecciona o escribe: FABRICANTE, DROGUERÍA..."
                      maxLength={50}
                      value={formData.tipo_entidad}
                      onChange={(e) => setFormData({ ...formData, tipo_entidad: e.target.value })}
                      style={{
                        width: "100%",
                        padding: "12px 14px",
                        borderRadius: "14px",
                        border: `1px solid ${t.border}`,
                        background: t.inputBg,
                        color: t.textPrimary,
                        fontSize: "14px",
                        fontFamily: "'Cairo', sans-serif",
                        outline: "none",
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
                    <datalist id="tipos-entidad">
                      {tiposEntidadSugeridos.map((tipo) => (
                        <option key={tipo} value={tipo} />
                      ))}
                    </datalist>
                  </div>

                  <div
                    style={{
                      padding: "12px 16px",
                      background: "rgba(249, 115, 22, 0.1)",
                      border: "1px solid rgba(249, 115, 22, 0.3)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <AlertCircle size={18} color="#fb923c" />
                    <p style={{ fontSize: "12px", color: "#fb923c", lineHeight: 1.4 }}>
                      El nombre, país y tipo de entidad se guardan en mayúsculas. Los campos marcados con * son obligatorios.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "20px 24px",
                borderTop: `1px solid ${t.border}`,
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={handleCloseModal}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  color: t.textSecondary,
                  fontSize: "14px",
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
                {modalMode === "view" ? "Cerrar" : "Cancelar"}
              </button>

              {modalMode !== "view" && (
                <button
                  onClick={handleSaveLaboratorio}
                  disabled={saving}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: "none",
                    background: saving ? t.textMuted : t.accent,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    opacity: saving ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = saving ? t.textMuted : t.accent;
                  }}
                >
                  <Save size={16} />
                  {saving
                    ? "Guardando..."
                    : modalMode === "create"
                    ? "Crear Laboratorio"
                    : "Guardar Cambios"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal: Confirmar Desactivar / Reactivar */}
      {showToggleModal && labToToggle && (
        <>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.6)",
              backdropFilter: "blur(4px)",
              zIndex: 9998,
              animation: "fadeIn 0.2s ease",
            }}
            onClick={closeToggleModal}
          />
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "440px",
              background: t.cardBg,
              borderRadius: "24px",
              border: `1px solid ${t.borderCard}`,
              boxShadow: isDark
                ? "0 24px 48px rgba(0,0,0,0.6)"
                : "0 24px 48px rgba(0,0,0,0.15)",
              zIndex: 9999,
              overflow: "hidden",
              animation: "slideUp 0.3s ease",
            }}
          >
            <div style={{ padding: "24px", textAlign: "center" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 16px",
                  borderRadius: "50%",
                  background: labToToggle.estado_logico
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(34,197,94,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {labToToggle.estado_logico ? (
                  <Trash2 size={30} color="#ef4444" />
                ) : (
                  <CheckCircle2 size={30} color="#22c55e" />
                )}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                {labToToggle.estado_logico ? "¿Desactivar laboratorio?" : "¿Reactivar laboratorio?"}
              </h2>
              <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                {labToToggle.estado_logico
                  ? `"${labToToggle.nombre}" dejará de estar disponible para nuevos productos. Los productos existentes que lo referencian (como titular o fabricante) conservan su laboratorio.`
                  : `"${labToToggle.nombre}" volverá a estar disponible para el catálogo de productos.`}
              </p>
            </div>
            <div style={{ padding: "0 24px 24px", display: "flex", gap: "12px" }}>
              <button
                onClick={closeToggleModal}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: `1px solid ${t.border}`,
                  background: t.cardBg,
                  color: t.textSecondary,
                  fontSize: "14px",
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
                Cancelar
              </button>
              <button
                onClick={handleConfirmToggle}
                disabled={togglings}
                style={{
                  flex: 1,
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  background: labToToggle.estado_logico ? "#ef4444" : "#22c55e",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: togglings ? "not-allowed" : "pointer",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                  opacity: togglings ? 0.7 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!togglings) {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!togglings) {
                    (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                  }
                }}
              >
                {togglings
                  ? "Procesando..."
                  : labToToggle.estado_logico
                  ? "Desactivar"
                  : "Reactivar"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}