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
  DollarSign,
  CheckCircle2,
  Archive,
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  ArchiveRestore,
  X,
  Save,
  AlertCircle,
  RefreshCw,
  Receipt,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  metodosPagoService,
  type MetodoPago,
  type NewMetodoPagoInput,
} from "../services/metodosPagoService";

/* ─── Helper Function: Get Icon by Method Name ──────────────────────── */
const getMethodIcon = (nombre: string) => {
  const upperName = (nombre || "").toUpperCase();
  if (upperName.includes("EFECTIVO") || upperName.includes("CASH")) return Banknote;
  if (upperName.includes("TARJETA") || upperName.includes("CARD")) return CreditCard;
  if (upperName.includes("YAPE") || upperName.includes("PLIN") || upperName.includes("QR") || upperName.includes("SMARTPHONE")) return Smartphone;
  if (upperName.includes("WALLET") || upperName.includes("BILLETERA")) return Wallet;
  return DollarSign;
};

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
  nombre_metodo: "",
  descripcion: "",
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  METODOS PAGO MANAGEMENT COMPONENT                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export default function MetodosPagoManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ═══ Datos reales desde el backend ═══
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Crear / Editar / Ver ═══
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedMetodo, setSelectedMetodo] = useState<MetodoPago | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // ═══ Modal: Desactivar / Reactivar ═══
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [metodoToToggle, setMetodoToToggle] = useState<MetodoPago | null>(null);
  const [togglings, setTogglings] = useState(false);

  const itemsPerPage = 6;
  const t = getTheme(isDark);

  const loadMetodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await metodosPagoService.getAllMetodosPago();
      setMetodos(data);
    } catch (err: any) {
      console.error("❌ Error al cargar métodos de pago:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los métodos de pago. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMetodos();
  }, [loadMetodos]);

  // Mantener la lista ordenada por nombre (igual que el backend)
  const sortMetodos = (lista: MetodoPago[]) =>
    [...lista].sort((a, b) => (a.nombre_metodo || "").localeCompare(b.nombre_metodo || ""));

  // Filtered métodos
  const filteredMetodos = useMemo(() => {
    return metodos.filter((metodo) => {
      const matchesSearch =
        (metodo.nombre_metodo || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (metodo.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || metodo.estado_logico === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [metodos, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredMetodos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMetodos = filteredMetodos.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Total de métodos (datos reales de todos los registros)
  const totalMetodos = metodos.length;
  const metodosActivos = metodos.filter((m) => m.estado_logico).length;
  const metodosInactivos = metodos.filter((m) => !m.estado_logico).length;

  /* ─── Gestión del Modal ─── */
  const handleOpenModal = (mode: "create" | "edit" | "view", metodo?: MetodoPago) => {
    setModalMode(mode);
    setSelectedMetodo(metodo || null);

    if (mode === "create") {
      setFormData(emptyForm);
    } else if (metodo) {
      setFormData({
        nombre_metodo: metodo.nombre_metodo || "",
        descripcion: metodo.descripcion || "",
      });
    }

    if (mode === "view" && metodo) {
      setLoadingDetail(true);
      metodosPagoService
        .getMetodoPagoById(metodo.id_metodo_pago)
        .then((detalle) => setSelectedMetodo(detalle))
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
    setSelectedMetodo(null);
  };

  /* ─── Guardar Método de Pago (crear o editar) ─── */
  const handleSaveMetodo = async () => {
    if (!formData.nombre_metodo.trim()) {
      showToast(false, "Datos incompletos", "Por favor completa el nombre del método de pago.", isDark);
      return;
    }
    if (formData.nombre_metodo.trim().length > 50) {
      showToast(false, "Nombre muy largo", "El nombre no puede superar los 50 caracteres.", isDark);
      return;
    }
    if (formData.descripcion.trim().length > 200) {
      showToast(false, "Descripción muy larga", "La descripción no puede superar los 200 caracteres.", isDark);
      return;
    }

    const payload: NewMetodoPagoInput = {
      nombre_metodo: formData.nombre_metodo.trim(),
      descripcion: formData.descripcion.trim() || null,
    };

    setSaving(true);
    try {
      if (modalMode === "create") {
        const nuevo = await metodosPagoService.createMetodoPago(payload);
        setMetodos((prev) => sortMetodos([...prev, nuevo]));
        showToast(true, "¡Método Creado!", `${nuevo.nombre_metodo} se registró exitosamente.`, isDark);
      } else if (modalMode === "edit" && selectedMetodo) {
        const actualizado = await metodosPagoService.updateMetodoPago(
          selectedMetodo.id_metodo_pago,
          payload
        );
        setMetodos((prev) =>
          sortMetodos(prev.map((m) => (m.id_metodo_pago === actualizado.id_metodo_pago ? actualizado : m)))
        );
        showToast(true, "¡Método Actualizado!", `${actualizado.nombre_metodo} se actualizó correctamente.`, isDark);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("❌ Error al guardar método de pago:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo guardar el método de pago. Intenta nuevamente.";
      showToast(false, "No se pudo guardar", mensaje, isDark);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Desactivar / Reactivar Método de Pago ─── */
  const handleOpenToggleModal = (metodo: MetodoPago) => {
    setSelectedMetodo(metodo);
    setMetodoToToggle(metodo);
    setShowToggleModal(true);
  };

  const closeToggleModal = () => {
    setShowToggleModal(false);
    setMetodoToToggle(null);
  };

  const handleConfirmToggle = async () => {
    if (!metodoToToggle) return;

    const esActivacion = !metodoToToggle.estado_logico;
    setTogglings(true);
    try {
      if (esActivacion) {
        const reactivado = await metodosPagoService.updateMetodoPago(metodoToToggle.id_metodo_pago, {
          nombre_metodo: metodoToToggle.nombre_metodo,
          descripcion: metodoToToggle.descripcion,
          estado_logico: true,
        });
        setMetodos((prev) =>
          sortMetodos(prev.map((m) => (m.id_metodo_pago === reactivado.id_metodo_pago ? reactivado : m)))
        );
        showToast(true, "¡Método Reactivado!", `${reactivado.nombre_metodo} se habilitó nuevamente.`, isDark);
      } else {
        const desactivado = await metodosPagoService.deleteMetodoPago(metodoToToggle.id_metodo_pago);
        setMetodos((prev) =>
          sortMetodos(prev.map((m) => (m.id_metodo_pago === desactivado.id_metodo_pago ? desactivado : m)))
        );
        showToast(
          true,
          "¡Método Desactivado!",
          `${desactivado.nombre_metodo} se desactivó. Puedes reactivarlo cuando lo necesites.`,
          isDark
        );
      }
      closeToggleModal();
    } catch (err: any) {
      console.error("❌ Error al cambiar estado del método de pago:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo cambiar el estado. Intenta nuevamente.";
      showToast(false, "No se pudo cambiar el estado", mensaje, isDark);
    } finally {
      setTogglings(false);
    }
  };

  /* ─── Badge de estado de venta (para el detalle) ─── */
  const VentaEstadoBadge = ({ estado }: { estado: string }) => {
    const color =
      estado === "PAGADA" ? "#22c55e" : estado === "PENDIENTE" ? "#f59e0b" : "#ef4444";
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "2px 8px",
          borderRadius: "6px",
          background: `${color}1a`,
          color,
          border: `1px solid ${color}40`,
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.03em",
        }}
      >
        {estado}
      </span>
    );
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
          Métodos de Pago
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra los métodos de pago disponibles en el sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Métodos - Emerald Gradient */}
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
                Total Métodos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : totalMetodos}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#a7f3d0" }}>
                  Opciones de pago
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
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Métodos Activos - Teal Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 40%, #0d9488 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(20, 184, 166, 0.25)",
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
                Métodos Activos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : metodosActivos}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#99f6e4" }}>
                  En uso
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

        {/* Métodos Inactivos - Gray Gradient */}
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
                Métodos Inactivos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : metodosInactivos}
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
                placeholder="Buscar por nombre o descripción del método de pago..."
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
              {statusFilter !== "all" && (
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
                  1
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
              Nuevo Método
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

              {statusFilter !== "all" && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
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
            Cargando métodos de pago...
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
            No se pudieron cargar los métodos de pago
          </p>
          <p style={{ fontSize: "14px", color: t.textSecondary, textAlign: "center", maxWidth: "420px" }}>
            {error}
          </p>
          <button
            onClick={loadMetodos}
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
              Mostrando {filteredMetodos.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredMetodos.length)} de {filteredMetodos.length} métodos de pago
            </p>
            {filteredMetodos.length === 0 && searchTerm && (
              <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
                No se encontraron resultados para "{searchTerm}"
              </p>
            )}
          </div>

          {/* Métodos Table */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      ID
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Método de Pago
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Descripción
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Fecha Registro
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
                  {currentMetodos.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                          <Search size={48} color={t.textMuted} />
                          <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                            No se encontraron métodos de pago
                          </p>
                          <p style={{ fontSize: "14px", color: t.textSecondary }}>
                            Intenta ajustar los filtros de búsqueda
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentMetodos.map((metodo, index) => {
                      const IconComponent = getMethodIcon(metodo.nombre_metodo);
                      return (
                        <tr
                          key={metodo.id_metodo_pago}
                          style={{
                            borderBottom: index < currentMetodos.length - 1 ? `1px solid ${t.border}` : "none",
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
                                  background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
                                  flexShrink: 0,
                                }}
                              >
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>
                                  {metodo.id_metodo_pago}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Nombre */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                              <IconComponent size={18} color={t.accent} strokeWidth={2} />
                              <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                                {metodo.nombre_metodo}
                              </span>
                            </div>
                          </td>

                          {/* Descripción */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontSize: "13px", color: t.textSecondary }}>
                              {metodo.descripcion || "—"}
                            </span>
                          </td>

                          {/* Fecha Registro */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ fontSize: "13px", color: t.textSecondary }}>
                              {metodo.fecha_registro
                                ? new Date(metodo.fecha_registro).toLocaleDateString("es-PE", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
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
                                background: metodo.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                                color: metodo.estado_logico ? "#22c55e" : "#ef4444",
                                border: `1px solid ${metodo.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                                fontSize: "11px",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: metodo.estado_logico ? "#22c55e" : "#ef4444" }} />
                              {metodo.estado_logico ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                              <button
                                onClick={() => handleOpenModal("view", metodo)}
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
                                onClick={() => handleOpenModal("edit", metodo)}
                                title="Editar método"
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
                                onClick={() => handleOpenToggleModal(metodo)}
                                title={metodo.estado_logico ? "Desactivar método" : "Reactivar método"}
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
                                  if (metodo.estado_logico) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                                  } else {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.1)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#22c55e";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                                }}
                              >
                                {metodo.estado_logico ? (
                                  <Trash2 size={16} />
                                ) : (
                                  <ArchiveRestore size={16} />
                                )}
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
            {filteredMetodos.length > 0 && (
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
                  {modalMode === "create" ? "Nuevo Método de Pago" : modalMode === "edit" ? "Editar Método de Pago" : "Detalle del Método de Pago"}
                </h2>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  {modalMode === "create" ? "Registra un nuevo método de pago" : modalMode === "edit" ? "Actualiza los datos del método de pago" : "Información completa del método de pago"}
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
                loadingDetail || !selectedMetodo ? (
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
                        Nombre del Método de Pago
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, display: "flex", alignItems: "center", gap: "8px" }}>
                        {(() => {
                          const Icon = getMethodIcon(selectedMetodo.nombre_metodo);
                          return <Icon size={18} color={t.accent} strokeWidth={2} />;
                        })()}
                        {selectedMetodo.nombre_metodo}
                      </p>
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        Descripción
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedMetodo.descripcion || "—"}
                      </p>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          ID
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                          #{selectedMetodo.id_metodo_pago}
                        </p>
                      </div>

                      <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                          Fecha de Registro
                        </p>
                        <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                          {selectedMetodo.fecha_registro
                            ? new Date(selectedMetodo.fecha_registro).toLocaleDateString("es-PE", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "N/A"}
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
                          background: selectedMetodo.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: selectedMetodo.estado_logico ? "#22c55e" : "#ef4444",
                          border: `1px solid ${selectedMetodo.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedMetodo.estado_logico ? "#22c55e" : "#ef4444" }} />
                        {selectedMetodo.estado_logico ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div style={{ padding: "16px", background: `${t.accent}15`, borderRadius: "16px", border: `1px solid ${t.accent}30` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.accent, marginBottom: "8px", textTransform: "uppercase" }}>
                        Ventas asociadas
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: t.accent }}>
                        {selectedMetodo.total_ventas ?? 0}
                      </p>
                      {selectedMetodo.ventas && selectedMetodo.ventas.length > 0 && (
                        <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px", maxHeight: "220px", overflowY: "auto" }}>
                          {selectedMetodo.ventas.map((venta) => (
                            <div
                              key={venta.id_venta}
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
                                <Receipt size={14} color={t.textMuted} style={{ flexShrink: 0 }} />
                                <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  Venta #{venta.id_venta} · {new Date(venta.fecha_venta).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                                </span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                                <VentaEstadoBadge estado={venta.estado_venta} />
                                <span style={{ fontSize: "12px", color: t.textSecondary }}>
                                  S/ {(venta.total_pagar || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                                </span>
                              </div>
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
                      Nombre del Método de Pago *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: EFECTIVO, TARJETA, YAPE_PLIN..."
                      maxLength={50}
                      value={formData.nombre_metodo}
                      onChange={(e) => setFormData({ ...formData, nombre_metodo: e.target.value })}
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
                      Descripción
                    </label>
                    <textarea
                      placeholder="Ej: Pago en efectivo"
                      maxLength={200}
                      rows={3}
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
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
                        resize: "vertical",
                        minHeight: "80px",
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
                      El nombre y la descripción se guardan en mayúsculas. Los campos marcados con * son obligatorios.
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
                  onClick={handleSaveMetodo}
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
                    ? "Crear Método"
                    : "Guardar Cambios"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal: Confirmar Desactivar / Reactivar */}
      {showToggleModal && metodoToToggle && (
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
                  background: metodoToToggle.estado_logico
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(34,197,94,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {metodoToToggle.estado_logico ? (
                  <Trash2 size={30} color="#ef4444" />
                ) : (
                  <CheckCircle2 size={30} color="#22c55e" />
                )}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                {metodoToToggle.estado_logico ? "¿Desactivar método de pago?" : "¿Reactivar método de pago?"}
              </h2>
              <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                {metodoToToggle.estado_logico
                  ? `"${metodoToToggle.nombre_metodo}" dejará de estar disponible para nuevas ventas. Las ventas existentes que lo usan conservan este método en su historial.`
                  : `"${metodoToToggle.nombre_metodo}" volverá a estar disponible para las ventas del sistema.`}
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
                  background: metodoToToggle.estado_logico ? "#ef4444" : "#22c55e",
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
                  : metodoToToggle.estado_logico
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