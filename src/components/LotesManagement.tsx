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
  Package,
  Calendar,
  MapPin,
  AlertCircle,
  Box,
  RefreshCw,
  RotateCcw,
  X,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  DollarSign,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { lotesService, type Lote } from "../services/lotesService";
import { productsService, type Producto } from "../services/productsService";

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

/* ─── Toasts ─────────────────────────────────────────────────────────── */
const showLoteSuccessToast = (
  lote: Lote,
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
              <Box size={22} color="#5bcfc5" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: isDark ? "#ffffff" : "#3d4465", marginBottom: "2px", fontFamily: "'Cairo', sans-serif" }}>
                {lote.numero_lote}
              </p>
              <p style={{ fontSize: "12px", color: isDark ? "#828690" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
                {lote.producto.nombre_comercial} · {lote.stock_lote} unidades
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

const showLoteErrorToast = (mensaje: string, isDark: boolean, titulo: string) => {
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
          Entendido
        </button>
      </div>
    ),
    { duration: 6000 }
  );
};

/* ─── Formulario: Nuevo Lote ──────────────────────────────────────────── */
interface NewLoteFormData {
  id_producto: string;
  numero_lote: string;
  fecha_vencimiento: string;
  costo_unitario_compra: string;
  stock_lote: string;
  ubicacion_estante: string;
}

interface NewLoteFormErrors {
  id_producto?: string;
  numero_lote?: string;
  fecha_vencimiento?: string;
  costo_unitario_compra?: string;
  stock_lote?: string;
  ubicacion_estante?: string;
}

const emptyNewLoteForm: NewLoteFormData = {
  id_producto: "",
  numero_lote: "",
  fecha_vencimiento: "",
  costo_unitario_compra: "",
  stock_lote: "",
  ubicacion_estante: "",
};

/**
 * Ordenar lotes igual que el backend:
 * por fecha de vencimiento ascendente (nulos al final) y luego id desc.
 */
const sortLotes = (lotes: Lote[]): Lote[] =>
  [...lotes].sort((a, b) => {
    if (a.fecha_vencimiento !== b.fecha_vencimiento) {
      if (a.fecha_vencimiento === null) return 1;
      if (b.fecha_vencimiento === null) return -1;
      return a.fecha_vencimiento.localeCompare(b.fecha_vencimiento);
    }
    return b.id_inventario - a.id_inventario;
  });

/* ─── Componente principal ────────────────────────────────────────────── */
export default function LotesManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // ═══ Datos reales desde el backend ═══
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Nuevo Lote ═══
  const [showNewModal, setShowNewModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [formData, setFormData] = useState<NewLoteFormData>(emptyNewLoteForm);
  const [formErrors, setFormErrors] = useState<NewLoteFormErrors>({});

  // ═══ Modal: Ver Detalle ═══
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingLote, setViewingLote] = useState<Lote | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState<string | null>(null);

  // ═══ Modal: Editar Lote ═══
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFormData, setEditFormData] = useState<NewLoteFormData>(emptyNewLoteForm);
  const [editFormErrors, setEditFormErrors] = useState<NewLoteFormErrors>({});

  // ═══ Modal: Eliminar (Desactivar) Lote ═══
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loteToDelete, setLoteToDelete] = useState<Lote | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ═══ Modal: Reactivar Lote ═══
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [loteToReactivate, setLoteToReactivate] = useState<Lote | null>(null);
  const [reactivating, setReactivating] = useState(false);

  const t = getTheme(isDark);

  const loadLotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await lotesService.getAllLotes();
      setLotes(data);
    } catch (err: any) {
      console.error("❌ Error al cargar lotes:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los lotes. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLotes();
  }, [loadLotes]);

  // ═══ Formulario: Nuevo Lote ═══
  const loadProductOptions = useCallback(async () => {
    if (productos.length > 0) return;
    setLoadingProductos(true);
    try {
      const data = await productsService.getAllProducts();
      setProductos(data.filter((p) => p.estado_logico === true));
    } catch (err) {
      console.error("❌ Error al cargar productos:", err);
      showLoteErrorToast(
        "No se pudieron cargar los productos disponibles.",
        isDark,
        "Error al cargar productos"
      );
    } finally {
      setLoadingProductos(false);
    }
  }, [productos.length, isDark]);

  const handleOpenNewModal = async () => {
    setFormData(emptyNewLoteForm);
    setFormErrors({});
    setShowNewModal(true);
    loadProductOptions();
  };

  const handleInputChange = (field: keyof NewLoteFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: NewLoteFormErrors = {};

    if (!formData.id_producto) {
      newErrors.id_producto = "Selecciona un producto.";
    }

    if (!formData.numero_lote.trim()) {
      newErrors.numero_lote = "El número de lote es obligatorio.";
    } else if (formData.numero_lote.trim().length > 50) {
      newErrors.numero_lote = "El número de lote no puede superar los 50 caracteres.";
    }

    if (formData.fecha_vencimiento) {
      const esValida = /^\d{4}-\d{2}-\d{2}$/.test(formData.fecha_vencimiento) && !Number.isNaN(new Date(`${formData.fecha_vencimiento}T00:00:00`).getTime());
      if (!esValida) {
        newErrors.fecha_vencimiento = "La fecha de vencimiento no es válida.";
      }
    }

    const costo = Number(formData.costo_unitario_compra);
    if (formData.costo_unitario_compra === "" || Number.isNaN(costo) || costo < 0) {
      newErrors.costo_unitario_compra = "El costo unitario es obligatorio y debe ser mayor o igual a 0.";
    }

    const stock = Number(formData.stock_lote);
    if (formData.stock_lote === "" || !Number.isInteger(stock) || stock < 0) {
      newErrors.stock_lote = "El stock es obligatorio y debe ser un número entero mayor o igual a 0.";
    }

    if (formData.ubicacion_estante.trim().length > 50) {
      newErrors.ubicacion_estante = "La ubicación no puede superar los 50 caracteres.";
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      showLoteErrorToast(
        "Revisa los campos marcados en rojo.",
        isDark,
        "Datos incompletos"
      );
      return;
    }
    setSubmitting(true);
    try {
      const nuevoLote = await lotesService.createLote({
        id_producto: Number(formData.id_producto),
        numero_lote: formData.numero_lote.trim().toUpperCase(),
        fecha_vencimiento: formData.fecha_vencimiento || null,
        costo_unitario_compra: Number(formData.costo_unitario_compra),
        stock_lote: Number(formData.stock_lote),
        ubicacion_estante: formData.ubicacion_estante.trim() || null,
      });

      setShowNewModal(false);
      setFormData(emptyNewLoteForm);
      setFormErrors({});

      setLotes((prev) => sortLotes([...prev, nuevoLote]));

      showLoteSuccessToast(
        nuevoLote,
        isDark,
        "¡Lote Registrado Exitosamente!",
        `El lote ${nuevoLote.numero_lote} se registró para ${nuevoLote.producto.nombre_comercial}`
      );
    } catch (err: any) {
      console.error("❌ Error al crear lote:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo registrar el lote. Intenta nuevamente.";
      showLoteErrorToast(mensaje, isDark, "No se pudo registrar el lote");
    } finally {
      setSubmitting(false);
    }
  };

  // ═══ Gestión: Ver Detalle ═══
  const handleOpenViewModal = async (lote: Lote) => {
    setViewingLote(null);
    setViewError(null);
    setViewLoading(true);
    setShowViewModal(true);
    try {
      const detalle = await lotesService.getLoteById(lote.id_inventario);
      setViewingLote(detalle);
    } catch (err: any) {
      console.error("❌ Error al cargar detalle de lote:", err);
      setViewError(
        err?.response?.data?.message || "Error al cargar el detalle del lote."
      );
    } finally {
      setViewLoading(false);
    }
  };

  // ═══ Gestión: Editar Lote ═══
  const handleOpenEditModal = (lote: Lote) => {
    setEditingLote(lote);
    setEditFormData({
      id_producto: String(lote.id_producto),
      numero_lote: lote.numero_lote || "",
      fecha_vencimiento: lote.fecha_vencimiento || "",
      costo_unitario_compra: String(lote.costo_unitario_compra),
      stock_lote: String(lote.stock_lote),
      ubicacion_estante: lote.ubicacion_estante || "",
    });
    setEditFormErrors({});
    setShowEditModal(true);
    loadProductOptions();
  };

  const handleEditInputChange = (field: keyof NewLoteFormData, value: string) => {
    setEditFormData((prev) => ({ ...prev, [field]: value }));
    if (editFormErrors[field]) {
      setEditFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateEditForm = (): boolean => {
    const newErrors: NewLoteFormErrors = {};

    if (!editFormData.id_producto) {
      newErrors.id_producto = "Selecciona un producto.";
    }

    if (!editFormData.numero_lote.trim()) {
      newErrors.numero_lote = "El número de lote es obligatorio.";
    } else if (editFormData.numero_lote.trim().length > 50) {
      newErrors.numero_lote = "El número de lote no puede superar los 50 caracteres.";
    }

    if (editFormData.fecha_vencimiento) {
      const esValida = /^\d{4}-\d{2}-\d{2}$/.test(editFormData.fecha_vencimiento) && !Number.isNaN(new Date(`${editFormData.fecha_vencimiento}T00:00:00`).getTime());
      if (!esValida) {
        newErrors.fecha_vencimiento = "La fecha de vencimiento no es válida.";
      }
    }

    const costo = Number(editFormData.costo_unitario_compra);
    if (editFormData.costo_unitario_compra === "" || Number.isNaN(costo) || costo < 0) {
      newErrors.costo_unitario_compra = "El costo unitario es obligatorio y debe ser mayor o igual a 0.";
    }

    const stock = Number(editFormData.stock_lote);
    if (editFormData.stock_lote === "" || !Number.isInteger(stock) || stock < 0) {
      newErrors.stock_lote = "El stock es obligatorio y debe ser un número entero mayor o igual a 0.";
    }

    if (editFormData.ubicacion_estante.trim().length > 50) {
      newErrors.ubicacion_estante = "La ubicación no puede superar los 50 caracteres.";
    }

    setEditFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLote) return;

    if (!validateEditForm()) {
      showLoteErrorToast(
        "Revisa los campos marcados en rojo.",
        isDark,
        "Datos incompletos"
      );
      return;
    }

    setEditSubmitting(true);
    try {
      const actualizado = await lotesService.updateLote(editingLote.id_inventario, {
        id_producto: Number(editFormData.id_producto),
        numero_lote: editFormData.numero_lote.trim().toUpperCase(),
        fecha_vencimiento: editFormData.fecha_vencimiento || null,
        costo_unitario_compra: Number(editFormData.costo_unitario_compra),
        stock_lote: Number(editFormData.stock_lote),
        ubicacion_estante: editFormData.ubicacion_estante.trim() || null,
      });

      setShowEditModal(false);
      setEditingLote(null);
      setEditFormData(emptyNewLoteForm);
      setEditFormErrors({});

      setLotes((prev) =>
        sortLotes(prev.map((l) => (l.id_inventario === actualizado.id_inventario ? actualizado : l)))
      );

      showLoteSuccessToast(
        actualizado,
        isDark,
        "¡Lote Actualizado Exitosamente!",
        `El lote ${actualizado.numero_lote} se actualizó correctamente`
      );
    } catch (err: any) {
      console.error("❌ Error al actualizar lote:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo actualizar el lote. Intenta nuevamente.";
      showLoteErrorToast(mensaje, isDark, "No se pudo actualizar el lote");
    } finally {
      setEditSubmitting(false);
    }
  };

  // ═══ Gestión: Eliminar (Desactivar) Lote ═══
  const handleOpenDeleteModal = (lote: Lote) => {
    setLoteToDelete(lote);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!loteToDelete) return;
    setDeleting(true);
    try {
      const desactivado = await lotesService.deleteLote(loteToDelete.id_inventario);
      setShowDeleteModal(false);
      setLoteToDelete(null);
      setLotes((prev) =>
        sortLotes(prev.map((l) => (l.id_inventario === desactivado.id_inventario ? desactivado : l)))
      );
      showLoteSuccessToast(
        desactivado,
        isDark,
        "¡Lote Desactivado!",
        `El lote ${desactivado.numero_lote} se desactivó; sus registros históricos se conservan`
      );
    } catch (err: any) {
      console.error("❌ Error al desactivar lote:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo desactivar el lote. Intenta nuevamente.";
      showLoteErrorToast(mensaje, isDark, "No se pudo desactivar el lote");
    } finally {
      setDeleting(false);
    }
  };

  // ═══ Gestión: Reactivar Lote ═══
  const handleOpenReactivateModal = (lote: Lote) => {
    setLoteToReactivate(lote);
    setShowReactivateModal(true);
  };

  const handleConfirmReactivate = async () => {
    if (!loteToReactivate) return;
    setReactivating(true);
    try {
      const lote = loteToReactivate;
      const reactivado = await lotesService.updateLote(lote.id_inventario, {
        id_producto: lote.id_producto,
        numero_lote: lote.numero_lote,
        fecha_vencimiento: lote.fecha_vencimiento,
        costo_unitario_compra: Number(lote.costo_unitario_compra),
        stock_lote: Number(lote.stock_lote),
        ubicacion_estante: lote.ubicacion_estante,
        estado_logico: true,
      });
      setShowReactivateModal(false);
      setLoteToReactivate(null);
      setLotes((prev) =>
        sortLotes(prev.map((l) => (l.id_inventario === reactivado.id_inventario ? reactivado : l)))
      );
      showLoteSuccessToast(
        reactivado,
        isDark,
        "¡Lote Reactivado!",
        `El lote ${reactivado.numero_lote} se activó nuevamente en el inventario`
      );
    } catch (err: any) {
      console.error("❌ Error al reactivar lote:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo reactivar el lote. Intenta nuevamente.";
      showLoteErrorToast(mensaje, isDark, "No se pudo reactivar el lote");
    } finally {
      setReactivating(false);
    }
  };

  const filteredLotes = useMemo(() => {
    return lotes.filter((lote) => {
      const matchesSearch =
        lote.numero_lote.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.producto.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lote.producto.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lote.ubicacion_estante || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEstado = estadoFilter === "all" || lote.estado_vencimiento === estadoFilter;

      return matchesSearch && matchesEstado;
    });
  }, [lotes, searchTerm, estadoFilter]);

  const totalPages = Math.ceil(filteredLotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentLotes = filteredLotes.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const lotesActivos = lotes.filter((l) => l.estado_logico);
  const totalLotes = lotesActivos.length;
  const lotesVigentes = lotesActivos.filter(l => l.estado_vencimiento === "vigente").length;
  const lotesPorVencer = lotesActivos.filter(l => l.estado_vencimiento === "proximo").length;
  const lotesVencidos = lotesActivos.filter(l => l.estado_vencimiento === "vencido").length;

  const getEstadoVencimientoColors = (estado: string) => {
    if (estado === "vigente") return { bg: "rgba(34,197,94,0.1)", text: "#22c55e", border: "rgba(34,197,94,0.3)", icon: "✓" };
    if (estado === "proximo") return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)", icon: "⚠️" };
    return { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.3)", icon: "✗" };
  };

  const getDesactivadoColors = () => ({
    bg: "rgba(130, 134, 144, 0.1)",
    text: t.textSecondary,
    border: "rgba(130, 134, 144, 0.3)",
    icon: "—",
  });

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

  const selectStyle = (hasError: boolean) => ({
    ...inputStyle(hasError),
    cursor: "pointer",
  });

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, hasError: boolean) => {
    if (!hasError) {
      e.currentTarget.style.borderColor = t.accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? "#ef4444" : t.border;
    e.currentTarget.style.boxShadow = "none";
  };

  const fieldError = (message?: string) =>
    message ? (
      <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
        <AlertCircle size={12} /> {message}
      </p>
    ) : null;

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
              <input type="text" placeholder="Buscar por lote, producto o ubicación..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: "14px", outline: "none", transition: "all 0.2s" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}20`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${showFilters ? t.accent : t.border}`, background: showFilters ? `${t.accent}15` : t.inputBg, color: showFilters ? t.accent : t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} />Filtros
            </button>
            <button onClick={handleOpenNewModal} style={{ padding: "12px 20px", borderRadius: "14px", border: "none", background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 4px 12px ${t.accent}40` }}>
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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <RefreshCw size={48} color={t.textMuted} style={{ animation: "spin 1s linear infinite" }} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>Cargando lotes...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <AlertCircle size={48} color="#ef4444" />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>{error}</p>
                      <button onClick={loadLotes} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: t.accent, color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <RefreshCw size={14} /> Reintentar
                      </button>
                    </div>
                  </td>
                </tr>
              ) : currentLotes.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}><Search size={48} color={t.textMuted} /><p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>No se encontraron lotes</p></td></tr>
              ) : (
                currentLotes.map((lote, index) => {
                  const estadoColors = lote.estado_logico
                    ? getEstadoVencimientoColors(lote.estado_vencimiento)
                    : getDesactivadoColors();
                  const filaInactiva = !lote.estado_logico;
                  return (
                    <tr key={lote.id_inventario} style={{ borderBottom: index < currentLotes.length - 1 ? `1px solid ${t.border}` : "none", opacity: filaInactiva ? 0.65 : 1, transition: "opacity 0.2s" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                            <Box size={14} color={filaInactiva ? t.textMuted : t.accent} />
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, textDecoration: filaInactiva ? "line-through" : "none" }}>{lote.numero_lote}</p>
                          </div>
                          <p style={{ fontSize: "13px", color: t.textSecondary }}>{lote.producto.nombre_comercial}</p>
                          <p style={{ fontSize: "11px", color: t.textMuted }}>{lote.producto.nombre_generico}</p>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                            <Calendar size={14} color={t.textMuted} />
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>{lote.fecha_vencimiento ? new Date(lote.fecha_vencimiento).toLocaleDateString("es-PE") : "Sin fecha"}</p>
                          </div>
                          <p style={{ fontSize: "11px", color: t.textSecondary }}>{lote.dias_para_vencer == null ? "Sin fecha de vencimiento" : lote.dias_para_vencer > 0 ? `${lote.dias_para_vencer} días` : "Vencido"}</p>
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
                          <span style={{ fontSize: "13px", color: t.textSecondary }}>{lote.ubicacion_estante || "Sin ubicación"}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: estadoColors.bg, color: estadoColors.text, border: `1px solid ${estadoColors.border}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                          <span>{estadoColors.icon}</span>
                          {filaInactiva ? "Desactivado" : lote.estado_vencimiento === "vigente" ? "Vigente" : lote.estado_vencimiento === "proximo" ? "Por Vencer" : "Vencido"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button title="Ver" onClick={() => handleOpenViewModal(lote)} style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(91, 207, 197, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = t.accent; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
                          ><Eye size={16} /></button>
                          <button title="Editar" onClick={() => handleOpenEditModal(lote)} style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(245, 158, 11, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#f59e0b"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
                          ><Edit2 size={16} /></button>
                          {filaInactiva ? (
                            <button title="Este lote está desactivado" disabled style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textMuted, cursor: "not-allowed", opacity: 0.5 }}><Trash2 size={16} /></button>
                          ) : (
                            <button title="Eliminar" onClick={() => handleOpenDeleteModal(lote)} style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
                            ><Trash2 size={16} /></button>
                          )}
                          {filaInactiva ? (
                            <button title="Reactivar lote" onClick={() => handleOpenReactivateModal(lote)} style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(34, 197, 94, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#22c55e"; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
                            ><RotateCcw size={16} /></button>
                          ) : (
                            <button title="Más" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
                            ><MoreVertical size={16} /></button>
                          )}
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

      {/* ═══ Modal: Nuevo Lote ═══ */}
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
                  <Box size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Nuevo Lote
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Registra un nuevo lote para un producto del inventario
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
                {/* ─── Sección: Información del Lote ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información del Lote
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Producto */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Producto <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <select
                          value={formData.id_producto}
                          onChange={(e) => handleInputChange("id_producto", e.target.value)}
                          style={selectStyle(!!formErrors.id_producto)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.id_producto)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.id_producto)}
                        >
                          <option value="">Selecciona un producto...</option>
                          {loadingProductos && <option value="">Cargando productos...</option>}
                          {productos.map((p) => (
                            <option key={p.id_producto} value={p.id_producto}>
                              {p.nombre_comercial} — {p.nombre_generico}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.id_producto)}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                      {/* Número de Lote */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Número de Lote <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Box size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="text"
                            value={formData.numero_lote}
                            onChange={(e) => handleInputChange("numero_lote", e.target.value.toUpperCase())}
                            placeholder="Ej. LOTE-A003"
                            style={inputStyle(!!formErrors.numero_lote)}
                            onFocus={(e) => handleFieldFocus(e, !!formErrors.numero_lote)}
                            onBlur={(e) => handleFieldBlur(e, !!formErrors.numero_lote)}
                          />
                        </div>
                        {fieldError(formErrors.numero_lote)}
                        <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                          Se almacenará en mayúsculas automáticamente (máx. 50 caracteres)
                        </p>
                      </div>

                      {/* Fecha de Vencimiento */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Fecha de Vencimiento <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Calendar size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="date"
                            value={formData.fecha_vencimiento}
                            onChange={(e) => handleInputChange("fecha_vencimiento", e.target.value)}
                            style={inputStyle(!!formErrors.fecha_vencimiento)}
                            onFocus={(e) => handleFieldFocus(e, !!formErrors.fecha_vencimiento)}
                            onBlur={(e) => handleFieldBlur(e, !!formErrors.fecha_vencimiento)}
                          />
                        </div>
                        {fieldError(formErrors.fecha_vencimiento)}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                      {/* Costo Unitario */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Costo Unitario (S/) <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: "17px", fontWeight: 700 }}>S/</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.costo_unitario_compra}
                            onChange={(e) => handleInputChange("costo_unitario_compra", e.target.value)}
                            placeholder="Ej. 12.50"
                            style={inputStyle(!!formErrors.costo_unitario_compra)}
                            onFocus={(e) => handleFieldFocus(e, !!formErrors.costo_unitario_compra)}
                            onBlur={(e) => handleFieldBlur(e, !!formErrors.costo_unitario_compra)}
                          />
                        </div>
                        {fieldError(formErrors.costo_unitario_compra)}
                      </div>

                      {/* Stock */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Stock <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={formData.stock_lote}
                            onChange={(e) => handleInputChange("stock_lote", e.target.value)}
                            placeholder="Ej. 100"
                            style={inputStyle(!!formErrors.stock_lote)}
                            onFocus={(e) => handleFieldFocus(e, !!formErrors.stock_lote)}
                            onBlur={(e) => handleFieldBlur(e, !!formErrors.stock_lote)}
                          />
                        </div>
                        {fieldError(formErrors.stock_lote)}
                      </div>
                    </div>

                    {/* Ubicación / Estante */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Ubicación / Estante <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.ubicacion_estante}
                          onChange={(e) => handleInputChange("ubicacion_estante", e.target.value)}
                          placeholder="Ej. Estante A3"
                          style={inputStyle(!!formErrors.ubicacion_estante)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.ubicacion_estante)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.ubicacion_estante)}
                        />
                      </div>
                      {fieldError(formErrors.ubicacion_estante)}
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
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Registrar Lote
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Modal: Ver Detalle de Lote ═══ */}
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
              maxWidth: "760px",
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
                    Detalle de Lote
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Información completa del lote de inventario
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
                    Cargando detalle del lote...
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
              {!viewLoading && !viewError && viewingLote && (
                <>
                  {/* Hero: Lote + producto + badges */}
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
                    <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(91, 207, 197, 0.4)", flexShrink: 0 }}>
                      <Box size={36} color="#fff" strokeWidth={2.5} />
                    </div>
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                        {viewingLote.numero_lote}
                      </h2>
                      <p style={{ fontSize: "14px", color: t.textSecondary, marginBottom: "4px" }}>
                        {viewingLote.producto.nombre_comercial}
                      </p>
                      <p style={{ fontSize: "13px", color: t.textMuted, marginBottom: "12px" }}>
                        {viewingLote.producto.nombre_generico}
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: getEstadoVencimientoColors(viewingLote.estado_vencimiento).bg, color: getEstadoVencimientoColors(viewingLote.estado_vencimiento).text, border: `1px solid ${getEstadoVencimientoColors(viewingLote.estado_vencimiento).border}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {getEstadoVencimientoColors(viewingLote.estado_vencimiento).icon}{" "}
                          {viewingLote.estado_vencimiento === "vigente" ? "Vigente" : viewingLote.estado_vencimiento === "proximo" ? "Por Vencer" : "Vencido"}
                        </span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", fontSize: "11px", fontWeight: 700 }}>
                          <Package size={12} />
                          {viewingLote.stock_lote} unidades
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ─── Sección: Información del Lote ─── */}
                  <div style={{ marginBottom: "28px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Info size={16} color={t.accent} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        Información del Lote
                      </h3>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <FileText size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            ID
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            #{viewingLote.id_inventario}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Package size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Producto
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingLote.producto.nombre_generico}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Fecha de Vencimiento
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingLote.fecha_vencimiento
                              ? new Date(viewingLote.fecha_vencimiento).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
                              : "Sin fecha"}
                          </p>
                          <p style={{ fontSize: "11px", color: t.textSecondary }}>
                            {viewingLote.dias_para_vencer == null ? "Sin fecha de vencimiento" : viewingLote.dias_para_vencer > 0 ? `${viewingLote.dias_para_vencer} días restantes` : "Ya venció"}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Calendar size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Fecha de Ingreso
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingLote.fecha_ingreso
                              ? new Date(viewingLote.fecha_ingreso).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
                              : "—"}
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Package size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Stock
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingLote.stock_lote} unidades
                          </p>
                        </div>
                      </div>

                      <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <DollarSign size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Costo Unitario
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.accent }}>
                            S/ {Number(viewingLote.costo_unitario_compra).toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <MapPin size={18} color={t.accent} />
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                            Ubicación / Estante
                          </p>
                          <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                            {viewingLote.ubicacion_estante || "Sin ubicación asignada"}
                          </p>
                        </div>
                      </div>
                    </div>
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

      {/* ═══ Modal: Editar Lote ═══ */}
      {showEditModal && editingLote && (
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
                    Editar Lote
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Actualiza la información del lote seleccionado
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
                {/* ─── Sección: Información del Lote ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información del Lote
                    </h3>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {/* Producto */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Producto <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <select
                          value={editFormData.id_producto}
                          onChange={(e) => handleEditInputChange("id_producto", e.target.value)}
                          style={selectStyle(!!editFormErrors.id_producto)}
                          onFocus={(e) => handleFieldFocus(e, !!editFormErrors.id_producto)}
                          onBlur={(e) => handleFieldBlur(e, !!editFormErrors.id_producto)}
                        >
                          <option value="">Selecciona un producto...</option>
                          {loadingProductos && <option value="">Cargando productos...</option>}
                          {editingLote && editFormData.id_producto && !productos.some((p) => p.id_producto === Number(editFormData.id_producto)) && (
                            <option value={editFormData.id_producto}>
                              {editingLote.producto.nombre_comercial} — {editingLote.producto.nombre_generico}
                            </option>
                          )}
                          {productos.map((p) => (
                            <option key={p.id_producto} value={p.id_producto}>
                              {p.nombre_comercial} — {p.nombre_generico}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(editFormErrors.id_producto)}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                      {/* Número de Lote */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Número de Lote <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Box size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="text"
                            value={editFormData.numero_lote}
                            onChange={(e) => handleEditInputChange("numero_lote", e.target.value.toUpperCase())}
                            placeholder="Ej. LOTE-A003"
                            style={inputStyle(!!editFormErrors.numero_lote)}
                            onFocus={(e) => handleFieldFocus(e, !!editFormErrors.numero_lote)}
                            onBlur={(e) => handleFieldBlur(e, !!editFormErrors.numero_lote)}
                          />
                        </div>
                        {fieldError(editFormErrors.numero_lote)}
                        <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                          Se almacenará en mayúsculas automáticamente (máx. 50 caracteres)
                        </p>
                      </div>

                      {/* Fecha de Vencimiento */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Fecha de Vencimiento <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Calendar size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="date"
                            value={editFormData.fecha_vencimiento}
                            onChange={(e) => handleEditInputChange("fecha_vencimiento", e.target.value)}
                            style={inputStyle(!!editFormErrors.fecha_vencimiento)}
                            onFocus={(e) => handleFieldFocus(e, !!editFormErrors.fecha_vencimiento)}
                            onBlur={(e) => handleFieldBlur(e, !!editFormErrors.fecha_vencimiento)}
                          />
                        </div>
                        {fieldError(editFormErrors.fecha_vencimiento)}
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                      {/* Costo Unitario */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Costo Unitario (S/) <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: "17px", fontWeight: 700 }}>S/</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editFormData.costo_unitario_compra}
                            onChange={(e) => handleEditInputChange("costo_unitario_compra", e.target.value)}
                            placeholder="Ej. 12.50"
                            style={inputStyle(!!editFormErrors.costo_unitario_compra)}
                            onFocus={(e) => handleFieldFocus(e, !!editFormErrors.costo_unitario_compra)}
                            onBlur={(e) => handleFieldBlur(e, !!editFormErrors.costo_unitario_compra)}
                          />
                        </div>
                        {fieldError(editFormErrors.costo_unitario_compra)}
                      </div>

                      {/* Stock */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Stock <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editFormData.stock_lote}
                            onChange={(e) => handleEditInputChange("stock_lote", e.target.value)}
                            placeholder="Ej. 100"
                            style={inputStyle(!!editFormErrors.stock_lote)}
                            onFocus={(e) => handleFieldFocus(e, !!editFormErrors.stock_lote)}
                            onBlur={(e) => handleFieldBlur(e, !!editFormErrors.stock_lote)}
                          />
                        </div>
                        {fieldError(editFormErrors.stock_lote)}
                      </div>
                    </div>

                    {/* Ubicación / Estante */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Ubicación / Estante <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <MapPin size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={editFormData.ubicacion_estante}
                          onChange={(e) => handleEditInputChange("ubicacion_estante", e.target.value)}
                          placeholder="Ej. Estante A3"
                          style={inputStyle(!!editFormErrors.ubicacion_estante)}
                          onFocus={(e) => handleFieldFocus(e, !!editFormErrors.ubicacion_estante)}
                          onBlur={(e) => handleFieldBlur(e, !!editFormErrors.ubicacion_estante)}
                        />
                      </div>
                      {fieldError(editFormErrors.ubicacion_estante)}
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

      {/* ═══ Modal: Eliminar (Desactivar) Lote ═══ */}
      {showDeleteModal && loteToDelete && (
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
              maxWidth: "560px",
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
                    Eliminar Lote
                  </h2>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    Confirmación de desactivación
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
                    ¿Eliminar "{loteToDelete.numero_lote}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción desactivará el lote. Las ventas y movimientos históricos
                    que lo referencian se conservarán.
                  </p>
                </div>
              </div>

              {/* Lote a eliminar */}
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
                  <Box size={22} color="#5bcfc5" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {loteToDelete.numero_lote}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {loteToDelete.producto.nombre_comercial} · {loteToDelete.stock_lote} unidades
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  Activo
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

      {/* ═══ Modal: Reactivar Lote ═══ */}
      {showReactivateModal && loteToReactivate && (
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
            zIndex: 1201,
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
              maxWidth: "560px",
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
                    Reactivar Lote
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
                    ¿Reactivar "{loteToReactivate.numero_lote}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción volverá a activar el lote para que vuelva a contar
                    en el stock del producto.
                  </p>
                </div>
              </div>

              {/* Lote a reactivar */}
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
                  <Box size={22} color="#5bcfc5" />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {loteToReactivate.numero_lote}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {loteToReactivate.producto.nombre_comercial} · {loteToReactivate.stock_lote} unidades
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(130,134,144,0.1)", color: t.textSecondary, border: "1px solid rgba(130,134,144,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  Desactivado
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

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Toaster para notificaciones */}
      <Toaster
        position="top-center"
        toastOptions={{
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
