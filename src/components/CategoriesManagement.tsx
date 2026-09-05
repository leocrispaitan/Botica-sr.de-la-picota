import { useState, useMemo, useEffect, useCallback } from "react";
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
  FileText,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  X,
  CheckCircle2,
  AlignLeft,
  Info,
  Calendar,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { categoriesService, type Categoria, type CategoriaDetalle } from "../services/categoriesService";

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

/* ─── New Category Form Types ─────────────────────────────────────── */
interface NewCategoriaFormData {
  nombre_categoria: string;
  descripcion: string;
}

interface NewCategoriaFormErrors {
  nombre_categoria?: string;
  descripcion?: string;
}

const emptyNewCategoriaForm: NewCategoriaFormData = {
  nombre_categoria: "",
  descripcion: "",
};

/* ─── Toast de éxito para categorías ─────────────────────────────── */
const showCategoriaSuccessToast = (
  categoria: Categoria,
  isDark: boolean,
  titulo: string,
  descripcion: string
) => {
  toast.custom(
    (t) => (
      <div
        style={{
          background: isDark ? "#212130" : "#ffffff",
          padding: "24px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: `2px solid ${isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.2)"}`,
          maxWidth: "420px",
          animation: t.visible ? "slideIn 0.4s ease-out forwards" : "slideOut 0.3s ease-in forwards",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(91, 207, 197, 0.4)",
              animation: "scaleIn 0.5s ease-out",
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={32} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#5bcfc5", marginBottom: "4px", fontFamily: "'Cairo', sans-serif" }}>
              {titulo}
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
              {descripcion}
            </p>
          </div>
        </div>

        <div style={{ background: isDark ? "#1e1d29" : "#f5f6fa", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(91, 207, 197, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(91, 207, 197, 0.3)", flexShrink: 0 }}>
              <Tag size={22} color="#5bcfc5" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: isDark ? "#ffffff" : "#3d4465", marginBottom: "2px", fontFamily: "'Cairo', sans-serif" }}>
                {categoria.nombre_categoria}
              </p>
              <p style={{ fontSize: "12px", color: isDark ? "#828690" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
                {categoria.descripcion || "Sin descripción"}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "0.9";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.opacity = "1";
          }}
        >
          Entendido
        </button>
      </div>
    ),
    { duration: 6000 }
  );
};

const showCategoriaErrorToast = (mensaje: string, isDark: boolean, titulo: string) => {
  toast.custom(
    (t) => (
      <div
        style={{
          background: isDark ? "#212130" : "#ffffff",
          padding: "24px",
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: `2px solid ${isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.25)"}`,
          maxWidth: "420px",
          animation: t.visible ? "slideIn 0.4s ease-out forwards" : "slideOut 0.3s ease-in forwards",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 24px rgba(239, 68, 68, 0.4)",
              animation: "scaleIn 0.5s ease-out",
              flexShrink: 0,
            }}
          >
            <AlertCircle size={32} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ef4444", marginBottom: "4px", fontFamily: "'Cairo', sans-serif" }}>
              {titulo}
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
              {mensaje}
            </p>
          </div>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: `2px solid ${isDark ? "rgba(239, 68, 68, 0.4)" : "rgba(239, 68, 68, 0.3)"}`,
            background: "transparent",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          Cerrar
        </button>
      </div>
    ),
    { duration: 6000 }
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  CATEGORIES MANAGEMENT COMPONENT                                    */
/* ═══════════════════════════════════════════════════════════════════ */
export default function CategoriesManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // ═══ Datos reales desde el backend ═══
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Nueva Categoría ═══
  const [showNewModal, setShowNewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewCategoriaFormData>(emptyNewCategoriaForm);
  const [formErrors, setFormErrors] = useState<NewCategoriaFormErrors>({});

  // ═══ Modal: Ver Detalle ═══
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingCategory, setViewingCategory] = useState<CategoriaDetalle | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // ═══ Modal: Editar Categoría ═══
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categoria | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<NewCategoriaFormData>(emptyNewCategoriaForm);
  const [editFormErrors, setEditFormErrors] = useState<NewCategoriaFormErrors>({});

  // ═══ Modal: Eliminar Categoría ═══
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Categoria | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ═══ Modal: Reactivar Categoría ═══
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [categoryToReactivate, setCategoryToReactivate] = useState<Categoria | null>(null);
  const [reactivating, setReactivating] = useState(false);

  const t = getTheme(isDark);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await categoriesService.getAllCategories();
      setCategorias(data);
    } catch (err: any) {
      console.error("❌ Error al cargar categorías:", err);
      setError(
        err?.response?.data?.message || "Error al cargar las categorías. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ═══ Formulario: Nueva Categoría ═══
  const handleOpenNewModal = () => {
    setFormData(emptyNewCategoriaForm);
    setFormErrors({});
    setShowNewModal(true);
  };

  const handleInputChange = (field: keyof NewCategoriaFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: NewCategoriaFormErrors = {};
    if (!formData.nombre_categoria.trim()) {
      newErrors.nombre_categoria = "El nombre de la categoría es obligatorio.";
    } else if (formData.nombre_categoria.trim().length > 100) {
      newErrors.nombre_categoria = "El nombre no puede superar los 100 caracteres.";
    }
    if (formData.descripcion.trim().length > 500) {
      newErrors.descripcion = "La descripción no puede superar los 500 caracteres.";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showCategoriaErrorToast(
        formErrors.nombre_categoria || formErrors.descripcion || "Revisa los campos marcados en rojo.",
        isDark,
        "Datos incompletos"
      );
      return;
    }
    setSubmitting(true);
    try {
      const nuevaCategoria = await categoriesService.createCategory({
        nombre_categoria: formData.nombre_categoria.trim(),
        descripcion: formData.descripcion.trim() || undefined,
      });

      setShowNewModal(false);
      setFormData(emptyNewCategoriaForm);
      setFormErrors({});

      setCategorias((prev) =>
        [...prev, nuevaCategoria].sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria))
      );

      showCategoriaSuccessToast(
        nuevaCategoria,
        isDark,
        "¡Categoría Creada Exitosamente!",
        `${nuevaCategoria.nombre_categoria} se registró en el inventario`
      );
    } catch (err: any) {
      console.error("❌ Error al crear categoría:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo crear la categoría. Intenta nuevamente.";
      showCategoriaErrorToast(mensaje, isDark, "No se pudo crear la categoría");
    } finally {
      setSubmitting(false);
    }
  };

  // ═══ Gestión: Editar Categoría ═══
  const handleOpenEditModal = (categoria: Categoria) => {
    setEditingCategory(categoria);
    setEditFormData({
      nombre_categoria: categoria.nombre_categoria || "",
      descripcion: categoria.descripcion || "",
    });
    setEditFormErrors({});
    setShowEditModal(true);
  };

  const handleEditInputChange = (field: keyof NewCategoriaFormData, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEditForm = (): boolean => {
    const newErrors: NewCategoriaFormErrors = {};
    if (!editFormData.nombre_categoria.trim()) {
      newErrors.nombre_categoria = "El nombre de la categoría es obligatorio.";
    } else if (editFormData.nombre_categoria.trim().length > 100) {
      newErrors.nombre_categoria = "El nombre no puede superar los 100 caracteres.";
    }
    if (editFormData.descripcion.trim().length > 500) {
      newErrors.descripcion = "La descripción no puede superar los 500 caracteres.";
    }
    setEditFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    if (!validateEditForm()) {
      showCategoriaErrorToast(
        editFormErrors.nombre_categoria || editFormErrors.descripcion || "Revisa los campos marcados en rojo.",
        isDark,
        "Datos incompletos"
      );
      return;
    }

    setEditSubmitting(true);
    try {
      const actualizada = await categoriesService.updateCategory(editingCategory.id_categoria, {
        nombre_categoria: editFormData.nombre_categoria.trim(),
        descripcion: editFormData.descripcion.trim() || undefined,
      });

      setShowEditModal(false);
      setEditingCategory(null);
      setEditFormData(emptyNewCategoriaForm);
      setEditFormErrors({});

      setCategorias((prev) =>
        prev
          .map((cat) => (cat.id_categoria === actualizada.id_categoria ? actualizada : cat))
          .sort((a, b) => a.nombre_categoria.localeCompare(b.nombre_categoria))
      );

      showCategoriaSuccessToast(
        actualizada,
        isDark,
        "¡Categoría Actualizada Exitosamente!",
        `${actualizada.nombre_categoria} se actualizó correctamente`
      );
    } catch (err: any) {
      console.error("❌ Error al actualizar categoría:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo actualizar la categoría. Intenta nuevamente.";
      showCategoriaErrorToast(mensaje, isDark, "No se pudo actualizar la categoría");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ═══ Gestión: Eliminar Categoría ═══
  const handleOpenDeleteModal = (categoria: Categoria) => {
    setCategoryToDelete(categoria);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    setDeleting(true);
    try {
      const eliminada = await categoriesService.deleteCategory(categoryToDelete.id_categoria);
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      setCategorias((prev) =>
        prev.map((cat) =>
          cat.id_categoria === eliminada.id_categoria
            ? { ...eliminada, total_productos: cat.total_productos }
            : cat
        )
      );
      showCategoriaSuccessToast(
        eliminada,
        isDark,
        "¡Categoría Eliminada Exitosamente!",
        `${eliminada.nombre_categoria} se desactivó del registro de categorías`
      );
    } catch (err: any) {
      console.error("❌ Error al eliminar categoría:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo eliminar la categoría. Intenta nuevamente.";
      showCategoriaErrorToast(mensaje, isDark, "No se pudo eliminar la categoría");
    } finally {
      setDeleting(false);
    }
  };

  // ═══ Gestión: Reactivar Categoría ═══
  const handleOpenReactivateModal = (categoria: Categoria) => {
    setCategoryToReactivate(categoria);
    setShowReactivateModal(true);
  };

  const handleConfirmReactivate = async () => {
    if (!categoryToReactivate) return;
    setReactivating(true);
    try {
      const reactivada = await categoriesService.updateCategory(categoryToReactivate.id_categoria, {
        nombre_categoria: categoryToReactivate.nombre_categoria,
        descripcion: categoryToReactivate.descripcion || "",
        estado_logico: true,
      });
      setShowReactivateModal(false);
      setCategoryToReactivate(null);
      setCategorias((prev) =>
        prev.map((cat) => (cat.id_categoria === reactivada.id_categoria ? reactivada : cat))
      );
      showCategoriaSuccessToast(
        reactivada,
        isDark,
        "¡Categoría Reactivada!",
        `${reactivada.nombre_categoria} se activó nuevamente en el registro`
      );
    } catch (err: any) {
      console.error("❌ Error al reactivar categoría:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo reactivar la categoría. Intenta nuevamente.";
      showCategoriaErrorToast(mensaje, isDark, "No se pudo reactivar la categoría");
    } finally {
      setReactivating(false);
    }
  };

  // ═══ Gestión: Ver Detalle ═══
  const handleOpenViewModal = async (categoria: Categoria) => {
    setViewingCategory(null);
    setViewError(null);
    setViewLoading(true);
    setShowViewModal(true);
    try {
      const detalle = await categoriesService.getCategoryById(categoria.id_categoria);
      setViewingCategory(detalle);
    } catch (err: any) {
      console.error("❌ Error al cargar detalle de categoría:", err);
      setViewError(
        err?.response?.data?.message || "Error al cargar el detalle de la categoría."
      );
    } finally {
      setViewLoading(false);
    }
  };

  // ═══ Estilos reutilizables del formulario ═══
  const inputStyle = (hasError: boolean) => ({
    width: "100%",
    padding: "12px 14px 12px 44px",
    borderRadius: "12px",
    border: `2px solid ${hasError ? "#ef4444" : t.border}`,
    background: t.inputBg,
    color: t.textPrimary,
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Cairo', sans-serif",
    transition: "all 0.2s",
  });

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    if (!hasError) {
      e.currentTarget.style.borderColor = t.accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? "#ef4444" : t.border;
    e.currentTarget.style.boxShadow = "none";
  };

  const fieldError = (message?: string) =>
    message ? (
      <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
        <AlertCircle size={12} /> {message}
      </p>
    ) : null;

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categorias.filter((cat) => {
      const matchesSearch =
        cat.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cat.descripcion || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || cat.estado_logico === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [categorias, searchTerm, statusFilter]);

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
  const totalCategorias = categorias.length;
  const categoriasActivas = categorias.filter(c => c.estado_logico).length;
  const totalProductos = categorias.reduce((sum, c) => sum + (c.total_productos || 0), 0);

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
            Gestión de Categorías
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Administra las categorías de productos del inventario
          </p>
        </div>
        <button
          onClick={loadCategories}
          disabled={loading}
          title="Actualizar datos"
          style={{
            padding: "10px 14px",
            borderRadius: "12px",
            border: `1px solid ${t.border}`,
            background: t.inputBg,
            color: t.textSecondary,
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
            (e.currentTarget as HTMLButtonElement).style.color = t.accent;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
            (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
          }}
        >
          <RefreshCw size={16} style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }} />
          Actualizar
        </button>
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

      {/* Error State */}
      {error && (
        <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(239,68,68,0.3)" }}>
              <AlertCircle size={20} color="#ef4444" />
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>Error al cargar las categorías</p>
              <p style={{ fontSize: "13px", color: t.textSecondary }}>{error}</p>
            </div>
          </div>
          <button
            onClick={loadCategories}
            style={{
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            <RefreshCw size={16} />Reintentar
          </button>
        </div>
      )}

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
            <button
              onClick={handleOpenNewModal}
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
                boxShadow: `0 4px 12px ${t.accent}40`,
                fontFamily: "'Cairo', sans-serif",
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
        <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500 }}>Mostrando {filteredCategories.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredCategories.length)} de {filteredCategories.length} categorías</p>
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
          <p style={{ fontSize: "14px", color: t.textSecondary, fontWeight: 500 }}>Cargando categorías...</p>
        </div>
      )}

      {/* Categories Table */}
      {!loading && (
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
                          <p style={{ fontSize: "13px", color: t.textSecondary }}>{cat.descripcion || "—"}</p>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: cat.total_productos > 0 ? "rgba(34,197,94,0.1)" : "rgba(156,163,175,0.1)", color: cat.total_productos > 0 ? "#22c55e" : "#9ca3af", border: `1px solid ${cat.total_productos > 0 ? "rgba(34,197,94,0.3)" : "rgba(156,163,175,0.3)"}` }}>
                          <Package size={14} />
                          <span style={{ fontSize: "13px", fontWeight: 700 }}>{cat.total_productos || 0}</span>
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
                          <button
                            title="Ver detalles"
                            onClick={() => handleOpenViewModal(cat)}
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
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
                            title="Editar"
                            onClick={() => handleOpenEditModal(cat)}
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
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
                            title={cat.estado_logico ? "Eliminar" : "Categoría inactiva - no se puede eliminar"}
                            onClick={() => cat.estado_logico && handleOpenDeleteModal(cat)}
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: cat.estado_logico ? t.textSecondary : t.textMuted, cursor: cat.estado_logico ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: cat.estado_logico ? 1 : 0.4 }}
                            onMouseEnter={(e) => {
                              if (cat.estado_logico) {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = cat.estado_logico ? t.textSecondary : t.textMuted;
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            title={cat.estado_logico ? "Más opciones" : "Reactivar categoría"}
                            onClick={() => {
                              if (!cat.estado_logico) {
                                handleOpenReactivateModal(cat);
                              }
                            }}
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: cat.estado_logico ? t.textSecondary : "#22c55e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                            onMouseEnter={(e) => {
                              if (cat.estado_logico) {
                                (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                                (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                              } else {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.12)";
                                (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = cat.estado_logico ? t.textSecondary : "#22c55e";
                            }}
                          >
                            {cat.estado_logico ? <MoreVertical size={16} /> : <RotateCcw size={16} />}
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
      )}

      {/* ═══ Modal: Nueva Categoría ═══ */}
      {showNewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            if (!submitting) {
              setShowNewModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: t.cardBg,
                zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 16px ${t.accent}40`,
                  }}
                >
                  <Tag size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Nueva Categoría
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Registra una nueva categoría para los productos del inventario
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                disabled={submitting}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: t.textSecondary,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: submitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!submitting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!submitting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                  }
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitNew} style={{ padding: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* ─── Sección: Información de la Categoría ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información de la Categoría
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Nombre de la Categoría */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre de la Categoría <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.nombre_categoria}
                          onChange={(e) => handleInputChange("nombre_categoria", e.target.value)}
                          placeholder="Ej. ANALGÉSICOS"
                          style={inputStyle(!!formErrors.nombre_categoria)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.nombre_categoria)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.nombre_categoria)}
                        />
                      </div>
                      {fieldError(formErrors.nombre_categoria)}
                      <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                        Se almacenará en mayúsculas automáticamente
                      </p>
                    </div>

                    {/* Descripción */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Descripción <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <AlignLeft size={16} style={{ position: "absolute", left: "14px", top: "14px", color: t.textMuted }} />
                        <textarea
                          value={formData.descripcion}
                          onChange={(e) => handleInputChange("descripcion", e.target.value)}
                          placeholder="Ej. Medicamentos para el alivio del dolor y la fiebre"
                          rows={4}
                          style={{ ...inputStyle(!!formErrors.descripcion), resize: "vertical", minHeight: "100px" }}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.descripcion)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.descripcion)}
                        />
                      </div>
                      {fieldError(formErrors.descripcion)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones del Footer */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: `1px solid ${t.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  disabled={submitting}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: `2px solid ${t.border}`,
                    background: "transparent",
                    color: submitting ? t.textMuted : t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    opacity: submitting ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                    }
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    border: "none",
                    background: submitting
                      ? t.textMuted
                      : `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: submitting ? "none" : `0 4px 16px ${t.accent}40`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 24px ${t.accent}50`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${t.accent}40`;
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Crear Categoría
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Modal: Editar Categoría ═══ */}
      {showEditModal && editingCategory && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => {
            if (!editSubmitting) {
              setShowEditModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "640px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: t.cardBg,
                zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(245, 158, 11, 0.4)",
                  }}
                >
                  <Edit2 size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Editar Categoría
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Actualiza la información de la categoría seleccionada
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                disabled={editSubmitting}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: t.textSecondary,
                  cursor: editSubmitting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: editSubmitting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!editSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!editSubmitting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                  }
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitEdit} style={{ padding: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* ─── Sección: Información de la Categoría ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información de la Categoría
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Nombre de la Categoría */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre de la Categoría <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={editFormData.nombre_categoria}
                          onChange={(e) => handleEditInputChange("nombre_categoria", e.target.value)}
                          placeholder="Ej. ANALGÉSICOS"
                          style={inputStyle(!!editFormErrors.nombre_categoria)}
                          onFocus={(e) => handleFieldFocus(e, !!editFormErrors.nombre_categoria)}
                          onBlur={(e) => handleFieldBlur(e, !!editFormErrors.nombre_categoria)}
                        />
                      </div>
                      {fieldError(editFormErrors.nombre_categoria)}
                    </div>

                    {/* Descripción */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Descripción <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <AlignLeft size={16} style={{ position: "absolute", left: "14px", top: "14px", color: t.textMuted }} />
                        <textarea
                          value={editFormData.descripcion}
                          onChange={(e) => handleEditInputChange("descripcion", e.target.value)}
                          placeholder="Ej. Medicamentos para el alivio del dolor y la fiebre"
                          rows={4}
                          style={{ ...inputStyle(!!editFormErrors.descripcion), resize: "vertical", minHeight: "100px" }}
                          onFocus={(e) => handleFieldFocus(e, !!editFormErrors.descripcion)}
                          onBlur={(e) => handleFieldBlur(e, !!editFormErrors.descripcion)}
                        />
                      </div>
                      {fieldError(editFormErrors.descripcion)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones del Footer */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: `1px solid ${t.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={editSubmitting}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: `2px solid ${t.border}`,
                    background: "transparent",
                    color: editSubmitting ? t.textMuted : t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: editSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    opacity: editSubmitting ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!editSubmitting) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!editSubmitting) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                    }
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    border: "none",
                    background: editSubmitting
                      ? t.textMuted
                      : `linear-gradient(135deg, #f59e0b 0%, #d97706 100%)`,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: editSubmitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: editSubmitting ? "none" : "0 4px 16px rgba(245, 158, 11, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: editSubmitting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!editSubmitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(245, 158, 11, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!editSubmitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(245, 158, 11, 0.4)";
                    }
                  }}
                >
                  {editSubmitting ? (
                    <>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={18} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Modal: Eliminar Categoría ═══ */}
      {showDeleteModal && categoryToDelete && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: "20px",
          }}
          onClick={() => {
            if (!deleting) {
              setShowDeleteModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "520px",
              width: "100%",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(239, 68, 68, 0.4)",
                  }}
                >
                  <Trash2 size={26} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Eliminar Categoría
                  </h2>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    Confirmación de eliminación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: t.textSecondary,
                  cursor: deleting ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: deleting ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!deleting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!deleting) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "2px solid rgba(239, 68, 68, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "scaleIn 0.5s ease-out",
                  }}
                >
                  <AlertTriangle size={36} color="#ef4444" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                    ¿Eliminar "{categoryToDelete.nombre_categoria}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción desactivará la categoría del registro. Los productos asociados
                    y los registros históricos se conservarán.
                  </p>
                </div>
              </div>

              {/* Categoría a eliminar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: t.innerBg,
                  border: `1px solid ${t.border}`,
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(91, 207, 197, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(91, 207, 197, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <Tag size={22} color="#5bcfc5" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {categoryToDelete.nombre_categoria}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {categoryToDelete.descripcion || "Sin descripción"}
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  {categoryToDelete.estado_logico ? "Activa" : "Inactiva"}
                </span>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: `2px solid ${t.border}`,
                    background: "transparent",
                    color: deleting ? t.textMuted : t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    opacity: deleting ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!deleting) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                    }
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "none",
                    background: deleting ? t.textMuted : "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: deleting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: deleting ? "none" : "0 4px 16px rgba(239, 68, 68, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: deleting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!deleting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(239, 68, 68, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!deleting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(239, 68, 68, 0.4)";
                    }
                  }}
                >
                  {deleting ? (
                    <>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 size={18} />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Reactivar Categoría ═══ */}
      {showReactivateModal && categoryToReactivate && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1200,
            padding: "20px",
          }}
          onClick={() => {
            if (!reactivating) {
              setShowReactivateModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "520px",
              width: "100%",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(34, 197, 94, 0.4)",
                  }}
                >
                  <RotateCcw size={26} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Reactivar Categoría
                  </h2>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    Confirmación de reactivación
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReactivateModal(false)}
                disabled={reactivating}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: t.textSecondary,
                  cursor: reactivating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  opacity: reactivating ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!reactivating) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(34, 197, 94, 0.1)";
                    (e.currentTarget as HTMLButtonElement).style.color = "#22c55e";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!reactivating) {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                  }
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Contenido */}
            <div style={{ padding: "28px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
                <div
                  style={{
                    width: "72px",
                    height: "72px",
                    borderRadius: "50%",
                    background: "rgba(34, 197, 94, 0.1)",
                    border: "2px solid rgba(34, 197, 94, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    animation: "scaleIn 0.5s ease-out",
                  }}
                >
                  <RotateCcw size={36} color="#22c55e" />
                </div>
                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                    ¿Reactivar "{categoryToReactivate.nombre_categoria}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción volverá a activar la categoría para que pueda ser
                    utilizada nuevamente en el registro de productos.
                  </p>
                </div>
              </div>

              {/* Categoría a reactivar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  background: t.innerBg,
                  border: `1px solid ${t.border}`,
                  marginBottom: "24px",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    background: "rgba(91, 207, 197, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid rgba(91, 207, 197, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <Tag size={22} color="#5bcfc5" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {categoryToReactivate.nombre_categoria}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {categoryToReactivate.descripcion || "Sin descripción"}
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  Inactiva
                </span>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                <button
                  onClick={() => setShowReactivateModal(false)}
                  disabled={reactivating}
                  style={{
                    padding: "12px 24px",
                    borderRadius: "12px",
                    border: `2px solid ${t.border}`,
                    background: "transparent",
                    color: reactivating ? t.textMuted : t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: reactivating ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    opacity: reactivating ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!reactivating) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!reactivating) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                    }
                  }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmReactivate}
                  disabled={reactivating}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: "none",
                    background: reactivating ? t.textMuted : "linear-gradient(135deg, #22c55e 0%, #4ade80 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: reactivating ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: reactivating ? "none" : "0 4px 16px rgba(34, 197, 94, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: reactivating ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!reactivating) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(34, 197, 94, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!reactivating) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(34, 197, 94, 0.4)";
                    }
                  }}
                >
                  {reactivating ? (
                    <>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Reactivando...
                    </>
                  ) : (
                    <>
                      <RotateCcw size={18} />
                      Reactivar
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Ver Detalle de Categoría ═══ */}
      {showViewModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100,
            padding: "20px",
          }}
          onClick={() => setShowViewModal(false)}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "900px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: t.cardBg,
                zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(59, 130, 246, 0.4)",
                  }}
                >
                  <Eye size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Detalle de Categoría
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Información completa de la categoría y sus productos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
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
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Contenido */}
            <div style={{ padding: "32px" }}>
              {/* Loading State */}
              {viewLoading && (
                <div style={{ padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                  <div style={{
                    width: "44px",
                    height: "44px",
                    border: `4px solid ${t.border}`,
                    borderTopColor: t.accent,
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <p style={{ fontSize: "14px", color: t.textSecondary, fontWeight: 500 }}>
                    Cargando detalle de la categoría...
                  </p>
                </div>
              )}

              {/* Error State */}
              {!viewLoading && viewError && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", padding: "40px 20px" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(239,68,68,0.3)" }}>
                    <AlertCircle size={28} color="#ef4444" />
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                      No se pudo cargar el detalle
                    </p>
                    <p style={{ fontSize: "14px", color: t.textSecondary, marginTop: "6px", maxWidth: "360px" }}>
                      {viewError}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    style={{
                      padding: "12px 28px",
                      borderRadius: "12px",
                      border: "none",
                      background: "#ef4444",
                      color: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Cairo', sans-serif",
                    }}
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {/* Contenido con datos */}
              {!viewLoading && !viewError && viewingCategory && (
                <>
                  {/* Hero: Nombre + descripción + badges */}
                  <div
                    style={{
                      display: "flex",
                      gap: "24px",
                      alignItems: "center",
                      padding: "20px",
                      borderRadius: "16px",
                      background: t.innerBg,
                      border: `1px solid ${t.border}`,
                      marginBottom: "28px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(59, 130, 246, 0.4)", flexShrink: 0 }}>
                      <Tag size={36} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                        {viewingCategory.nombre_categoria}
                      </h2>
                      <p style={{ fontSize: "14px", color: t.textSecondary, marginBottom: "12px" }}>
                        {viewingCategory.descripcion || "Sin descripción"}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: viewingCategory.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: viewingCategory.estado_logico ? "#22c55e" : "#ef4444", border: `1px solid ${viewingCategory.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: viewingCategory.estado_logico ? "#22c55e" : "#ef4444" }} />
                          {viewingCategory.estado_logico ? "Activa" : "Inactiva"}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", fontSize: "11px", fontWeight: 700 }}>
                          <Package size={12} />
                          {viewingCategory.total_productos} productos
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── Sección: Información de la Categoría ─── */}
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Info size={16} color={t.accent} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        Información de la Categoría
                      </h3>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Tag size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Nombre de Categoría
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingCategory.nombre_categoria || "—"}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            ID
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            #{viewingCategory.id_categoria}
                          </p>
                        </div>
                      </div>

                      <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <AlignLeft size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Descripción
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, lineHeight: 1.5 }}>
                            {viewingCategory.descripcion || "—"}
                          </p>
                        </div>
                      </div>

                      <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Fecha de Registro
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingCategory.fecha_registro
                              ? new Date(viewingCategory.fecha_registro).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ─── Sección: Productos Asociados ─── */}
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Package size={16} color={t.accent} />
                        </div>
                        <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                          Productos Asociados
                        </h3>
                      </div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", fontSize: "12px", fontWeight: 700 }}>
                        {viewingCategory.productos?.length || 0} activos
                      </span>
                    </div>

                    {viewingCategory.productos?.length ? (
                      <div style={{ overflow: "hidden", border: `1px solid ${t.border}`, borderRadius: "12px" }}>
                        <div style={{ overflowX: "auto" }}>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ background: t.innerBg }}>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase" }}>Producto</th>
                                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase" }}>Precio</th>
                                <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase" }}>Stock</th>
                              </tr>
                            </thead>
                            <tbody>
                              {viewingCategory.productos!.map((prod, index) => (
                                <tr key={prod.id_producto} style={{ borderTop: index > 0 ? `1px solid ${t.border}` : "none" }}>
                                  <td style={{ padding: "12px 16px" }}>
                                    <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px" }}>
                                      {prod.nombre_comercial}
                                    </p>
                                    <p style={{ fontSize: "11px", color: t.textSecondary }}>
                                      {prod.nombre_generico}
                                    </p>
                                  </td>
                                  <td style={{ padding: "12px 16px", textAlign: "right", fontSize: "13px", fontWeight: 700, color: t.accent }}>
                                    S/ {Number(prod.precio_venta).toFixed(2)}
                                  </td>
                                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "999px", background: prod.stock_actual <= prod.stock_minimo_alerta ? "rgba(249,115,22,0.12)" : "rgba(34,197,94,0.12)", color: prod.stock_actual <= prod.stock_minimo_alerta ? "#fb923c" : "#22c55e", border: `1px solid ${prod.stock_actual <= prod.stock_minimo_alerta ? "rgba(249,115,22,0.3)" : "rgba(34,197,94,0.3)"}`, fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap" }}>
                                      <Package size={12} />
                                      {prod.stock_actual}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ) : (
                      <div style={{ padding: "40px 20px", borderRadius: "12px", border: `1px dashed ${t.border}`, background: t.innerBg, textAlign: "center" }}>
                        <Package size={40} color={t.textMuted} />
                        <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>
                          No hay productos en esta categoría
                        </p>
                        <p style={{ fontSize: "12px", color: t.textSecondary, marginTop: "4px" }}>
                          Los productos se gestionan desde el módulo de Inventario
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "24px", borderTop: `1px solid ${t.border}` }}>
                    <button
                      onClick={() => setShowViewModal(false)}
                      style={{
                        padding: "12px 32px",
                        borderRadius: "12px",
                        border: "none",
                        background: `linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)`,
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s",
                        boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(59, 130, 246, 0.5)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.4)";
                      }}
                    >
                      <CheckCircle2 size={18} />
                      Cerrar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(20px) scale(0.95); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Toaster para notificaciones */}
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
          },
        }}
      />
    </div>
  );
}