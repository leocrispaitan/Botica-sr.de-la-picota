import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  FileText,
  Truck,
  Building2,
  X,
  Save,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import {
  suppliersService,
  type Proveedor,
  type NewProveedorInput,
} from "../../services/suppliersService";

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
  nombre_proveedor: "",
  ruc: "",
  telefono: "",
  email: "",
  direccion: "",
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  SUPPLIERS MANAGEMENT COMPONENT                                     */
/* ═══════════════════════════════════════════════════════════════════ */
export default function SuppliersManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // ═══ Datos reales desde el backend ═══
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Crear / Editar / Ver ═══
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [selectedSupplier, setSelectedSupplier] = useState<Proveedor | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // ═══ Modal: Desactivar / Reactivar ═══
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [supplierToToggle, setSupplierToToggle] = useState<Proveedor | null>(null);
  const [togglings, setTogglings] = useState(false);

  const itemsPerPage = 8;
  const t = getTheme(isDark);

  const loadSuppliers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await suppliersService.getAllSuppliers();
      setProveedores(data);
    } catch (err: any) {
      console.error("❌ Error al cargar proveedores:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los proveedores. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  // Filtered suppliers
  const filteredSuppliers = useMemo(() => {
    return proveedores.filter((supplier) => {
      const matchesSearch =
        (supplier.nombre_proveedor || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.ruc || "").includes(searchTerm) ||
        (supplier.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (supplier.telefono || "").includes(searchTerm);

      const matchesStatus = statusFilter === "all" || supplier.estado_logico === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [proveedores, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = filteredSuppliers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate totals (datos reales de todos los proveedores)
  const totalProveedores = proveedores.length;
  const proveedoresActivos = proveedores.filter((s) => s.estado_logico).length;
  const proveedoresInactivos = proveedores.filter((s) => !s.estado_logico).length;

  /* ─── Gestión del Modal ─── */
  const handleOpenModal = (mode: "create" | "edit" | "view", supplier?: Proveedor) => {
    setModalMode(mode);
    setSelectedSupplier(supplier || null);

    if (mode === "create") {
      setFormData(emptyForm);
    } else if (supplier) {
      setFormData({
        nombre_proveedor: supplier.nombre_proveedor || "",
        ruc: supplier.ruc || "",
        telefono: supplier.telefono || "",
        email: supplier.email || "",
        direccion: supplier.direccion || "",
      });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
  };

  /* ─── Guardar Proveedor (crear o editar) ─── */
  const handleSaveSupplier = async () => {
    // Validaciones
    if (!formData.nombre_proveedor.trim() || !formData.ruc.trim() || !formData.email.trim()) {
      showToast(false, "Datos incompletos", "Por favor completa los campos obligatorios (Nombre, RUC, Email).", isDark);
      return;
    }
    if (!/^\d{11}$/.test(formData.ruc)) {
      showToast(false, "RUC inválido", "El RUC debe tener exactamente 11 dígitos.", isDark);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      showToast(false, "Email inválido", "Por favor ingresa un email válido.", isDark);
      return;
    }

    const payload: NewProveedorInput = {
      nombre_proveedor: formData.nombre_proveedor.trim(),
      ruc: formData.ruc.trim(),
      email: formData.email.trim(),
      ...(formData.telefono.trim() && { telefono: formData.telefono.trim() }),
      ...(formData.direccion.trim() && { direccion: formData.direccion.trim() }),
    };

    setSaving(true);
    try {
      if (modalMode === "create") {
        const nuevo = await suppliersService.createSupplier(payload);
        setProveedores((prev) => [nuevo, ...prev]);
        showToast(true, "¡Proveedor Creado!", `${nuevo.nombre_proveedor} se registró exitosamente.`, isDark);
      } else if (modalMode === "edit" && selectedSupplier) {
        const actualizado = await suppliersService.updateSupplier(selectedSupplier.id_proveedor, payload);
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === actualizado.id_proveedor ? actualizado : p))
        );
        showToast(true, "¡Proveedor Actualizado!", `${actualizado.nombre_proveedor} se actualizó correctamente.`, isDark);
      }
      handleCloseModal();
    } catch (err: any) {
      console.error("❌ Error al guardar proveedor:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo guardar el proveedor. Intenta nuevamente.";
      showToast(false, "No se pudo guardar el proveedor", mensaje, isDark);
    } finally {
      setSaving(false);
    }
  };

  /* ─── Desactivar / Reactivar Proveedor ─── */
  const handleOpenToggleModal = (supplier: Proveedor) => {
    setSelectedSupplier(supplier);
    setSupplierToToggle(supplier);
    setShowToggleModal(true);
  };

  const closeToggleModal = () => {
    setShowToggleModal(false);
    setSupplierToToggle(null);
  };

  const handleConfirmToggle = async () => {
    if (!supplierToToggle) return;

    const esActivacion = !supplierToToggle.estado_logico;
    setTogglings(true);
    try {
      if (esActivacion) {
        const reactivado = await suppliersService.updateSupplier(supplierToToggle.id_proveedor, {
          nombre_proveedor: supplierToToggle.nombre_proveedor,
          ruc: supplierToToggle.ruc,
          telefono: supplierToToggle.telefono || "",
          email: supplierToToggle.email || "",
          direccion: supplierToToggle.direccion || "",
          estado_logico: true,
        });
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === reactivado.id_proveedor ? reactivado : p))
        );
        showToast(true, "¡Proveedor Reactivado!", `${reactivado.nombre_proveedor} se habilitó nuevamente.`, isDark);
      } else {
        const desactivado = await suppliersService.deleteSupplier(supplierToToggle.id_proveedor);
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === desactivado.id_proveedor ? desactivado : p))
        );
        showToast(
          true,
          "¡Proveedor Desactivado!",
          `${desactivado.nombre_proveedor} se desactivó. Puedes reactivarlo cuando lo necesites.`,
          isDark
        );
      }
      closeToggleModal();
    } catch (err: any) {
      console.error("❌ Error al cambiar estado del proveedor:", err);
      const mensaje =
        err?.response?.data?.error?.[0] ||
        err?.response?.data?.message ||
        "No se pudo cambiar el estado del proveedor. Intenta nuevamente.";
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
          Gestión de Proveedores
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra y visualiza todos los proveedores del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Proveedores - Blue Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #2c4eff 0%, #3b5beb 40%, #1d3bcd 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(44, 78, 255, 0.25)",
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Proveedores
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : totalProveedores}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#68e365" }}>
                  Registrados
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  en el sistema
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
              <Truck size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Proveedores Activos - Green Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #0f9d58 0%, #16a765 40%, #0b7a44 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 157, 88, 0.25)",
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Proveedores Activos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : proveedoresActivos}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#a7f3d0" }}>
                  Habilitados
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  para realizar compras
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
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f9d58",
              }}>
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Proveedores Inactivos - Red Gradient */}
        <div
          style={{
            background: "linear-gradient(135deg, #ea4335 0%, #f4511e 40%, #c62828 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(234, 67, 53, 0.25)",
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

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Proveedores Inactivos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "—" : proveedoresInactivos}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fecaca" }}>
                  Inhabilitados
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  detenidos del sistema
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
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#ea4335",
              }}>
                ✗
              </div>
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
                placeholder="Buscar por nombre, RUC, email o teléfono..."
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

            {/* Add Supplier Button */}
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
              <UserPlus size={16} />
              Nuevo Proveedor
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
            Cargando proveedores...
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
            No se pudieron cargar los proveedores
          </p>
          <p style={{ fontSize: "14px", color: t.textSecondary, textAlign: "center", maxWidth: "420px" }}>
            {error}
          </p>
          <button
            onClick={loadSuppliers}
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
              Mostrando {filteredSuppliers.length > 0 ? startIndex + 1 : 0}-{Math.min(endIndex, filteredSuppliers.length)} de {filteredSuppliers.length} proveedores
            </p>
            {filteredSuppliers.length === 0 && searchTerm && (
              <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
                No se encontraron resultados para "{searchTerm}"
              </p>
            )}
          </div>

          {/* Suppliers Table */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Proveedor
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Contacto
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Ubicación
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Compras
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
                  {currentSuppliers.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                          <Search size={48} color={t.textMuted} />
                          <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                            No se encontraron proveedores
                          </p>
                          <p style={{ fontSize: "14px", color: t.textSecondary }}>
                            Intenta ajustar los filtros de búsqueda
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentSuppliers.map((supplier, index) => (
                      <tr
                        key={supplier.id_proveedor}
                        style={{
                          borderBottom: index < currentSuppliers.length - 1 ? `1px solid ${t.border}` : "none",
                          transition: "background 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                        }}
                      >
                        {/* Proveedor */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "50%",
                                background: `linear-gradient(135deg, ${t.accent}20 0%, ${t.accent}10 100%)`,
                                border: `2px solid ${t.accent}30`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <Building2 size={22} color={t.accent} />
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {supplier.nombre_proveedor}
                              </p>
                              <p style={{ fontSize: "12px", color: t.textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>
                                <FileText size={12} />
                                RUC: {supplier.ruc}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contacto */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.textPrimary }}>
                              <Mail size={14} color={t.textMuted} />
                              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{supplier.email || "—"}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.textSecondary }}>
                              <Phone size={14} color={t.textMuted} />
                              <span>{supplier.telefono || "—"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Ubicación */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", maxWidth: "300px" }}>
                            <MapPin size={14} color={t.textMuted} style={{ marginTop: "2px", flexShrink: 0 }} />
                            <span style={{ fontSize: "13px", color: t.textSecondary, lineHeight: 1.4 }}>
                              {supplier.direccion || "—"}
                            </span>
                          </div>
                        </td>

                        {/* Compras */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", flexDirection: "column", gap: "4px", alignItems: "center" }}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
                                color: "#a78bfa",
                                fontSize: "14px",
                                fontWeight: 700,
                                border: `1px solid ${isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)"}`,
                              }}
                            >
                              {supplier.total_compras ?? 0}
                            </span>
                            <span style={{ fontSize: "11px", color: t.textSecondary }}>
                              S/ {(supplier.monto_total_comprado || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
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
                              background: supplier.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                              color: supplier.estado_logico ? "#22c55e" : "#ef4444",
                              border: `1px solid ${supplier.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                              fontSize: "11px",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: supplier.estado_logico ? "#22c55e" : "#ef4444" }} />
                            {supplier.estado_logico ? "Activo" : "Inactivo"}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td style={{ padding: "16px 20px" }}>
                          <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                            <button
                              onClick={() => handleOpenModal("view", supplier)}
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
                              onClick={() => handleOpenModal("edit", supplier)}
                              title="Editar proveedor"
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
                              onClick={() => handleOpenToggleModal(supplier)}
                              title={supplier.estado_logico ? "Desactivar proveedor" : "Activar proveedor"}
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredSuppliers.length > 0 && (
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
              maxWidth: "600px",
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
                  {modalMode === "create" ? "Nuevo Proveedor" : modalMode === "edit" ? "Editar Proveedor" : "Detalle del Proveedor"}
                </h2>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  {modalMode === "create" ? "Completa los datos del nuevo proveedor" : modalMode === "edit" ? "Actualiza la información del proveedor" : "Información completa del proveedor"}
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
              {modalMode === "view" && selectedSupplier ? (
                // ─── View Mode ───
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                      Nombre del Proveedor
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                      {selectedSupplier.nombre_proveedor}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        RUC
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedSupplier.ruc}
                      </p>
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        Teléfono
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedSupplier.telefono || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                      Email
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                      {selectedSupplier.email || "—"}
                    </p>
                  </div>

                  <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                      Dirección
                    </p>
                    <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                      {selectedSupplier.direccion || "—"}
                    </p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
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
                          background: selectedSupplier.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          color: selectedSupplier.estado_logico ? "#22c55e" : "#ef4444",
                          border: `1px solid ${selectedSupplier.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                          fontSize: "11px",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                        }}
                      >
                        <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: selectedSupplier.estado_logico ? "#22c55e" : "#ef4444" }} />
                        {selectedSupplier.estado_logico ? "Activo" : "Inactivo"}
                      </span>
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px", textTransform: "uppercase" }}>
                        Fecha de Registro
                      </p>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary }}>
                        {new Date(selectedSupplier.fecha_registro).toLocaleDateString("es-PE")}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div style={{ padding: "16px", background: `${t.accent}15`, borderRadius: "16px", border: `1px solid ${t.accent}30` }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: t.accent, marginBottom: "8px", textTransform: "uppercase" }}>
                        Total Compras
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: t.accent }}>
                        {selectedSupplier.total_compras ?? 0}
                      </p>
                    </div>

                    <div style={{ padding: "16px", background: "rgba(34, 197, 94, 0.1)", borderRadius: "16px", border: "1px solid rgba(34, 197, 94, 0.3)" }}>
                      <p style={{ fontSize: "12px", fontWeight: 600, color: "#22c55e", marginBottom: "8px", textTransform: "uppercase" }}>
                        Monto Total
                      </p>
                      <p style={{ fontSize: "24px", fontWeight: 700, color: "#22c55e" }}>
                        S/ {(selectedSupplier.monto_total_comprado || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // ─── Create / Edit Mode ───
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Nombre del Proveedor *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Distribuidora Farmacéutica Lima S.A."
                      value={formData.nombre_proveedor}
                      onChange={(e) => setFormData({ ...formData, nombre_proveedor: e.target.value })}
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
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        RUC *
                      </label>
                      <input
                        type="text"
                        placeholder="20123456789"
                        maxLength={11}
                        value={formData.ruc}
                        onChange={(e) => setFormData({ ...formData, ruc: e.target.value.replace(/\D/g, "") })}
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
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Teléfono
                      </label>
                      <input
                        type="text"
                        placeholder="01-4567890"
                        value={formData.telefono}
                        onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
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
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      placeholder="ventas@ejemplo.com.pe"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Dirección
                    </label>
                    <textarea
                      placeholder="Av. Industrial 1234, Lima - Perú"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      rows={3}
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
                      Los campos marcados con * son obligatorios
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
                  onClick={handleSaveSupplier}
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
                    ? "Crear Proveedor"
                    : "Guardar Cambios"}
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal: Confirmar Desactivar / Reactivar */}
      {showToggleModal && supplierToToggle && (
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
                  background: supplierToToggle.estado_logico
                    ? "rgba(239,68,68,0.12)"
                    : "rgba(34,197,94,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {supplierToToggle.estado_logico ? (
                  <Trash2 size={30} color="#ef4444" />
                ) : (
                  <CheckCircle2 size={30} color="#22c55e" />
                )}
              </div>
              <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                {supplierToToggle.estado_logico ? "¿Desactivar proveedor?" : "¿Reactivar proveedor?"}
              </h2>
              <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                {supplierToToggle.estado_logico
                  ? `"${supplierToToggle.nombre_proveedor}" dejará de estar disponible para nuevas compras. Su historial se conserva.`
                  : `"${supplierToToggle.nombre_proveedor}" volverá a estar disponible para realizar compras.`}
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
                  background: supplierToToggle.estado_logico ? "#ef4444" : "#22c55e",
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
                  : supplierToToggle.estado_logico
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