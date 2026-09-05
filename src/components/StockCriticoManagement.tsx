import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  AlertTriangle,
  TrendingDown,
  Package,
  DollarSign,
  ShoppingCart,
  Boxes,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  RefreshCw,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Tag,
  MapPin,
  Info,
  Box,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { productsService, type Producto } from "../services/productsService";
import { lotesService } from "../services/lotesService";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface ProductoStockCritico extends Producto {
  diferencia: number;
  porcentaje_disponible: number;
  nivel_criticidad: "critico" | "bajo" | "alerta";
}

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
const showCriticoSuccessToast = (isDark: boolean, titulo: string, descripcion: string) => {
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

const showCriticoErrorToast = (mensaje: string, isDark: boolean, titulo: string) => {
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

/* ─── Formulario: Reponer Stock ────────────────────────────────────────── */
interface ReponerFormData {
  numero_lote: string;
  fecha_vencimiento: string;
  costo_unitario_compra: string;
  stock_lote: string;
  ubicacion_estante: string;
}

interface ReponerFormErrors {
  numero_lote?: string;
  fecha_vencimiento?: string;
  costo_unitario_compra?: string;
  stock_lote?: string;
  ubicacion_estante?: string;
}

const emptyReponerForm: ReponerFormData = {
  numero_lote: "",
  fecha_vencimiento: "",
  costo_unitario_compra: "",
  stock_lote: "",
  ubicacion_estante: "",
};

export default function StockCriticoManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [criticidadFilter, setCriticidadFilter] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // ═══ Datos reales desde el backend ═══
  const [productos, setProductos] = useState<ProductoStockCritico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Ver Detalle ═══
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoStockCritico | null>(null);

  // ═══ Modal: Reponer Stock ═══
  const [showReponerModal, setShowReponerModal] = useState(false);
  const [productToReponer, setProductToReponer] = useState<ProductoStockCritico | null>(null);
  const [reponerFormData, setReponerFormData] = useState<ReponerFormData>(emptyReponerForm);
  const [reponerFormErrors, setReponerFormErrors] = useState<ReponerFormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const t = getTheme(isDark);

  const loadProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await productsService.getAllProducts();
      const criticos = data
        .filter(
          (p) =>
            p.estado_logico === true &&
            (Number(p.stock_actual) || 0) <= (Number(p.stock_minimo_alerta) || 0)
        )
        .map<ProductoStockCritico>((p) => {
          const stock = Number(p.stock_actual) || 0;
          const minimo = Number(p.stock_minimo_alerta) || 0;
          const porcentaje = minimo > 0 ? (stock / minimo) * 100 : stock > 0 ? 100 : 0;
          return {
            ...p,
            diferencia: stock - minimo,
            porcentaje_disponible: porcentaje,
            nivel_criticidad: porcentaje <= 30 ? "critico" : porcentaje <= 60 ? "bajo" : "alerta",
          };
        })
        .sort((a, b) => {
          if (a.nivel_criticidad !== b.nivel_criticidad) {
            const orden = { critico: 0, bajo: 1, alerta: 2 } as const;
            return orden[a.nivel_criticidad] - orden[b.nivel_criticidad];
          }
          if (a.porcentaje_disponible !== b.porcentaje_disponible) {
            return a.porcentaje_disponible - b.porcentaje_disponible;
          }
          return a.nombre_comercial.localeCompare(b.nombre_comercial);
        });
      setProductos(criticos);
    } catch (err: any) {
      console.error("❌ Error al cargar stock crítico:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los productos con stock crítico. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProductos();
  }, [loadProductos]);

  const filteredProductos = useMemo(() => {
    return productos.filter((prod) => {
      const matchesSearch =
        prod.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (prod.categoria?.nombre_categoria || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCriticidad = criticidadFilter === "all" || prod.nivel_criticidad === criticidadFilter;

      return matchesSearch && matchesCriticidad;
    });
  }, [productos, searchTerm, criticidadFilter]);

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = filteredProductos.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const criticos = productos.filter((p) => p.nivel_criticidad === "critico").length;
  const bajos = productos.filter((p) => p.nivel_criticidad === "bajo").length;
  const alertas = productos.filter((p) => p.nivel_criticidad === "alerta").length;
  const valorEnRiesgo = productos.reduce((sum, p) => sum + (p.precio_venta * p.stock_actual), 0);

  const getNivelCriticidadColors = (nivel: string) => {
    if (nivel === "critico") return { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.3)", icon: "🔴" };
    if (nivel === "bajo") return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)", icon: "🟡" };
    return { bg: "rgba(249,115,22,0.1)", text: "#fb923c", border: "rgba(249,115,22,0.3)", icon: "🟠" };
  };

  // ═══ Gestión: Ver Detalle ═══
  const handleOpenViewModal = (prod: ProductoStockCritico) => {
    setSelectedProduct(prod);
    setShowViewModal(true);
  };

  // ═══ Gestión: Reponer Stock ═══
  const handleOpenReponerModal = (prod: ProductoStockCritico) => {
    setProductToReponer(prod);
    setReponerFormData(emptyReponerForm);
    setReponerFormErrors({});
    setShowReponerModal(true);
  };

  const handleReponerInputChange = (field: keyof ReponerFormData, value: string) => {
    setReponerFormData((prev) => ({ ...prev, [field]: value }));
    if (reponerFormErrors[field]) {
      setReponerFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateReponerForm = (): boolean => {
    const newErrors: ReponerFormErrors = {};

    if (!reponerFormData.numero_lote.trim()) {
      newErrors.numero_lote = "El número de lote es obligatorio.";
    } else if (reponerFormData.numero_lote.trim().length > 50) {
      newErrors.numero_lote = "El número de lote no puede superar los 50 caracteres.";
    }

    if (reponerFormData.fecha_vencimiento) {
      const esValida = /^\d{4}-\d{2}-\d{2}$/.test(reponerFormData.fecha_vencimiento) && !Number.isNaN(new Date(`${reponerFormData.fecha_vencimiento}T00:00:00`).getTime());
      if (!esValida) {
        newErrors.fecha_vencimiento = "La fecha de vencimiento no es válida.";
      }
    }

    const costo = Number(reponerFormData.costo_unitario_compra);
    if (reponerFormData.costo_unitario_compra === "" || Number.isNaN(costo) || costo < 0) {
      newErrors.costo_unitario_compra = "El costo unitario es obligatorio y debe ser mayor o igual a 0.";
    }

    const stock = Number(reponerFormData.stock_lote);
    if (reponerFormData.stock_lote === "" || !Number.isInteger(stock) || stock <= 0) {
      newErrors.stock_lote = "El stock a ingresar es obligatorio y debe ser un número entero mayor a 0.";
    }

    if (reponerFormData.ubicacion_estante.trim().length > 50) {
      newErrors.ubicacion_estante = "La ubicación no puede superar los 50 caracteres.";
    }

    setReponerFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReponer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productToReponer) return;

    if (!validateReponerForm()) {
      showCriticoErrorToast(
        "Revisa los campos marcados en rojo.",
        isDark,
        "Datos incompletos"
      );
      return;
    }

    setSubmitting(true);
    try {
      const nuevoLote = await lotesService.createLote({
        id_producto: productToReponer.id_producto,
        numero_lote: reponerFormData.numero_lote.trim().toUpperCase(),
        fecha_vencimiento: reponerFormData.fecha_vencimiento || null,
        costo_unitario_compra: Number(reponerFormData.costo_unitario_compra),
        stock_lote: Number(reponerFormData.stock_lote),
        ubicacion_estante: reponerFormData.ubicacion_estante.trim() || null,
      });

      setShowReponerModal(false);
      setProductToReponer(null);
      setReponerFormData(emptyReponerForm);
      setReponerFormErrors({});

      showCriticoSuccessToast(
        isDark,
        "¡Stock Repuesto Exitosamente!",
        `El lote ${nuevoLote.numero_lote} se registró para ${productToReponer.nombre_comercial}`
      );

      loadProductos();
    } catch (err: any) {
      console.error("❌ Error al reponer stock:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo reponer el stock. Intenta nuevamente.";
      showCriticoErrorToast(mensaje, isDark, "No se pudo reponer el stock");
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    if (!hasError) {
      e.currentTarget.style.borderColor = t.accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
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
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>Stock Crítico</h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>Productos que requieren reposición urgente</p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        <div style={{ background: "linear-gradient(135deg, #ef4444 0%, #f87171 40%, #dc2626 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(239, 68, 68, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Stock Crítico</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>{criticos}</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#fecaca" }}>🔴 Urgente</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 40%, #d97706 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(245, 158, 11, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Stock Bajo</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>{bajos}</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#fef3c7" }}>🟡 Reponer pronto</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingDown size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ea580c 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(249, 115, 22, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>En Alerta</p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>{alertas}</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#fed7aa" }}>🟠 Monitorear</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Boxes size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div style={{ background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #7c3aed 100%)", borderRadius: "24px", padding: "24px", position: "relative", overflow: "hidden", boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)" }} />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase" }}>Valor en Riesgo</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>S/ {valorEnRiesgo.toFixed(2)}</p>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#e9d5ff" }}>Stock actual</p>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Actions */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input
                type="text"
                placeholder="Buscar producto crítico..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }}
                style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: "14px", outline: "none", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}20`; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = t.border; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${showFilters ? t.accent : t.border}`, background: showFilters ? `${t.accent}15` : t.inputBg, color: showFilters ? t.accent : t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Cairo', sans-serif" }}>
              <Filter size={16} />Filtros
            </button>
            <button onClick={() => { loadProductos(); }} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent; (e.currentTarget as HTMLButtonElement).style.color = t.accent; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = t.border; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
            >
              <RefreshCw size={16} />Actualizar
            </button>
            <button title="Próximamente" style={{ padding: "12px 20px", borderRadius: "14px", border: "none", background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 4px 12px ${t.accent}40`, fontFamily: "'Cairo', sans-serif", opacity: 0.85 }}>
              <ShoppingCart size={16} />Generar Orden
            </button>
          </div>
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", padding: "16px", background: t.innerBg, borderRadius: "12px", border: `1px solid ${t.border}` }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>Nivel de Criticidad</label>
                <select value={criticidadFilter} onChange={(e) => { setCriticidadFilter(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}>
                  <option value="all">Todos los niveles</option>
                  <option value="critico">🔴 Crítico</option>
                  <option value="bajo">🟡 Bajo</option>
                  <option value="alerta">🟠 Alerta</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500, marginBottom: "16px" }}>Mostrando {filteredProductos.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length} productos</p>

      {/* Stock Crítico Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Producto</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Stock</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Requerido</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Nivel</th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <RefreshCw size={48} color={t.textMuted} style={{ animation: "spin 1s linear infinite" }} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>Cargando stock crítico...</p>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <AlertCircle size={48} color="#ef4444" />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>{error}</p>
                      <button onClick={loadProductos} style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: t.accent, color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
                        <RefreshCw size={14} /> Reintentar
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filteredProductos.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}><Search size={48} color={t.textMuted} /><p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>No se encontraron productos con stock crítico</p></td></tr>
              ) : (
                currentProductos.map((prod, index) => {
                  const nivelColors = getNivelCriticidadColors(prod.nivel_criticidad);
                  return (
                    <tr key={prod.id_producto} style={{ borderBottom: index < currentProductos.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ position: "relative", width: "50px", height: "50px", borderRadius: "10px", flexShrink: 0, overflow: "hidden", border: `2px solid ${t.border}`, background: `${t.accent}10`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Package size={22} color={t.accent} />
                            {prod.imagen_url && (
                              <img
                                src={prod.imagen_url}
                                alt={prod.nombre_comercial}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            )}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px" }}>{prod.nombre_comercial}</p>
                            <p style={{ fontSize: "12px", color: t.textSecondary }}>{prod.nombre_generico}</p>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "4px", padding: "2px 8px", borderRadius: "6px", background: `${t.accent}10`, fontSize: "10px", fontWeight: 600, color: t.accent }}>
                              {prod.categoria?.nombre_categoria || "Sin categoría"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Package size={16} color={nivelColors.text} />
                            <span style={{ fontSize: "16px", fontWeight: 700, color: nivelColors.text }}>{prod.stock_actual}</span>
                          </div>
                          <div style={{ width: "100%", maxWidth: "120px", height: "6px", borderRadius: "999px", background: t.innerBg, overflow: "hidden" }}>
                            <div style={{ width: `${Math.min(100, prod.porcentaje_disponible)}%`, height: "100%", background: nivelColors.text, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: "10px", color: t.textMuted }}>{prod.porcentaje_disponible.toFixed(0)}% del mínimo</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: t.innerBg }}>
                            <AlertTriangle size={14} color={t.textMuted} />
                            <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>{prod.stock_minimo_alerta}</span>
                          </div>
                          <span style={{ fontSize: "11px", fontWeight: 600, color: nivelColors.text }}>Falta: {Math.abs(prod.diferencia)}</span>
                        </div>
                      </td>
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: nivelColors.bg, color: nivelColors.text, border: `1px solid ${nivelColors.border}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                          <span>{nivelColors.icon}</span>
                          {prod.nivel_criticidad === "critico" ? "Crítico" : prod.nivel_criticidad === "bajo" ? "Bajo" : "Alerta"}
                        </span>
                      </td>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button title="Ver detalles" onClick={() => handleOpenViewModal(prod)} style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", transition: "all 0.2s" }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(59, 130, 246, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#3b82f6"; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
                          ><Eye size={16} /></button>
                          <button title="Reponer" onClick={() => handleOpenReponerModal(prod)} style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: t.accent, color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s", boxShadow: `0 4px 12px ${t.accent}40` }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 18px ${t.accent}50`; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`; }}
                          >
                            <Plus size={14} />Reponer
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
        {filteredProductos.length > 0 && (
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

      {/* ═══ Modal: Ver Detalle de Producto ═══ */}
      {showViewModal && selectedProduct && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1100, padding: "20px",
          }}
          onClick={() => setShowViewModal(false)}
        >
          <div
            style={{
              background: t.cardBg, borderRadius: "24px", maxWidth: "760px", width: "100%",
              maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px", borderBottom: `1px solid ${t.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                position: "sticky", top: 0, background: t.cardBg, zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(59, 130, 246, 0.4)" }}>
                  <Eye size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Detalle de Producto
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Información completa del producto en stock crítico
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                style={{
                  width: "44px", height: "44px", borderRadius: "12px", border: "none",
                  background: "transparent", color: t.textSecondary, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Contenido */}
            <div style={{ padding: "32px" }}>
              {/* Hero: Producto + badges */}
              <div style={{ display: "flex", gap: "24px", alignItems: "center", padding: "20px", borderRadius: "16px", background: t.innerBg, border: `1px solid ${t.border}`, marginBottom: "28px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", width: "72px", height: "72px", borderRadius: "20px", flexShrink: 0, overflow: "hidden", background: "linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 16px rgba(91, 207, 197, 0.4)" }}>
                  <Package size={36} color="#fff" strokeWidth={2.5} />
                  {selectedProduct.imagen_url && (
                    <img
                      src={selectedProduct.imagen_url}
                      alt={selectedProduct.nombre_comercial}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    {selectedProduct.nombre_comercial}
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary, marginBottom: "4px" }}>
                    {selectedProduct.nombre_generico}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textMuted, marginBottom: "12px" }}>
                    Presentación: {selectedProduct.presentacion || "—"} · {selectedProduct.unidad_medida}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: getNivelCriticidadColors(selectedProduct.nivel_criticidad).bg, color: getNivelCriticidadColors(selectedProduct.nivel_criticidad).text, border: `1px solid ${getNivelCriticidadColors(selectedProduct.nivel_criticidad).border}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {getNivelCriticidadColors(selectedProduct.nivel_criticidad).icon}{" "}
                      {selectedProduct.nivel_criticidad === "critico" ? "Crítico" : selectedProduct.nivel_criticidad === "bajo" ? "Bajo" : "Alerta"}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.3)", fontSize: "11px", fontWeight: 700 }}>
                      <Package size={12} />
                      {selectedProduct.stock_actual} / {selectedProduct.stock_minimo_alerta} unidades
                    </span>
                    {(selectedProduct.categoria?.nombre_categoria) && (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: `${t.accent}10`, color: t.accent, border: `1px solid ${t.accent}30`, fontSize: "11px", fontWeight: 700 }}>
                        <Tag size={12} />
                        {selectedProduct.categoria.nombre_categoria}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ─── Sección: Stock y Precios ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Info size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Stock y Precios
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Stock Actual
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.stock_actual} unidades
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AlertTriangle size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Stock Mínimo
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.stock_minimo_alerta} unidades
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <TrendingDown size={18} color="#ef4444" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Déficit
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444" }}>
                        {Math.abs(selectedProduct.diferencia)} unidades
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Boxes size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        % del Mínimo
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.porcentaje_disponible.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <DollarSign size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Precio de Venta
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.accent }}>
                        S/ {Number(selectedProduct.precio_venta).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <DollarSign size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Costo Referencial
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        S/ {Number(selectedProduct.costo_referencial).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Sección: Información del Producto ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Información del Producto
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
                        #{selectedProduct.id_producto}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Tag size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Categoría
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.categoria?.nombre_categoria || "Sin categoría"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ShoppingCart size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Proveedor
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.proveedor?.nombre_proveedor || "Sin proveedor"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Forma Farmacéutica
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.forma_farmaceutica?.nombre || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <FileText size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Composición
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.composicion || "Sin información"}
                      </p>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Condición de Venta
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedProduct.condicion_venta?.nombre || "Sin información"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", paddingTop: "24px", borderTop: `1px solid ${t.border}` }}>
                <button
                  onClick={() => { setShowViewModal(false); handleOpenReponerModal(selectedProduct); }}
                  style={{
                    padding: "12px 28px", borderRadius: "12px", border: "none",
                    background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
                    boxShadow: `0 4px 16px ${t.accent}40`, display: "flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 24px ${t.accent}50`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${t.accent}40`; }}
                >
                  <Plus size={18} />
                  Reponer Stock
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  style={{
                    padding: "12px 32px", borderRadius: "12px", border: "none",
                    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                    color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif", transition: "all 0.2s",
                    boxShadow: "0 4px 16px rgba(59, 130, 246, 0.4)",
                    display: "flex", alignItems: "center", gap: "8px",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(59, 130, 246, 0.5)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(59, 130, 246, 0.4)"; }}
                >
                  <CheckCircle2 size={18} />
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Reponer Stock ═══ */}
      {showReponerModal && productToReponer && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0, 0, 0, 0.7)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1200, padding: "20px",
          }}
          onClick={() => {
            if (!submitting) {
              setShowReponerModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg, borderRadius: "24px", maxWidth: "640px", width: "100%",
              maxHeight: "90vh", overflow: "auto", boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px", borderBottom: `1px solid ${t.border}`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                position: "sticky", top: 0, background: t.cardBg, zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 16px ${t.accent}40` }}>
                  <ShoppingCart size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Reponer Stock
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Registra un nuevo lote para aumentar el stock del producto
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowReponerModal(false)}
                disabled={submitting}
                style={{
                  width: "44px", height: "44px", borderRadius: "12px", border: "none",
                  background: "transparent", color: t.textSecondary,
                  cursor: submitting ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", opacity: submitting ? 0.5 : 1,
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

            {/* Producto a reponer */}
            <div style={{ padding: "24px 32px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "14px", background: t.innerBg, border: `1px solid ${t.border}` }}>
                <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0, overflow: "hidden", background: `${t.accent}12`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${t.accent}30` }}>
                  <Package size={22} color={t.accent} />
                  {productToReponer.imagen_url && (
                    <img
                      src={productToReponer.imagen_url}
                      alt={productToReponer.nombre_comercial}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {productToReponer.nombre_comercial}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {productToReponer.nombre_generico}
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase" }}>
                    <AlertTriangle size={12} />
                    Stock: {productToReponer.stock_actual}
                  </span>
                  <span style={{ fontSize: "11px", color: t.textSecondary, fontWeight: 600 }}>
                    Mínimo: {productToReponer.stock_minimo_alerta} · Falta: {Math.abs(productToReponer.diferencia)}
                  </span>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitReponer} style={{ padding: "24px 32px 32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                    Número de Lote <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Box size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                    <input
                      type="text"
                      placeholder="Ej. LOTE-C045"
                      value={reponerFormData.numero_lote}
                      onChange={(e) => handleReponerInputChange("numero_lote", e.target.value.toUpperCase())}
                      onFocus={(e) => handleFieldFocus(e, !!reponerFormErrors.numero_lote)}
                      onBlur={(e) => handleFieldBlur(e, !!reponerFormErrors.numero_lote)}
                      style={inputStyle(!!reponerFormErrors.numero_lote)}
                    />
                  </div>
                  {fieldError(reponerFormErrors.numero_lote)}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                    Fecha de Vencimiento
                  </label>
                  <div style={{ position: "relative" }}>
                    <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                    <input
                      type="date"
                      value={reponerFormData.fecha_vencimiento}
                      onChange={(e) => handleReponerInputChange("fecha_vencimiento", e.target.value)}
                      onFocus={(e) => handleFieldFocus(e, !!reponerFormErrors.fecha_vencimiento)}
                      onBlur={(e) => handleFieldBlur(e, !!reponerFormErrors.fecha_vencimiento)}
                      style={inputStyle(!!reponerFormErrors.fecha_vencimiento)}
                    />
                  </div>
                  {fieldError(reponerFormErrors.fecha_vencimiento)}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                    Costo Unitario (S/) <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <DollarSign size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Ej. 12.50"
                      value={reponerFormData.costo_unitario_compra}
                      onChange={(e) => handleReponerInputChange("costo_unitario_compra", e.target.value)}
                      onFocus={(e) => handleFieldFocus(e, !!reponerFormErrors.costo_unitario_compra)}
                      onBlur={(e) => handleFieldBlur(e, !!reponerFormErrors.costo_unitario_compra)}
                      style={inputStyle(!!reponerFormErrors.costo_unitario_compra)}
                    />
                  </div>
                  {fieldError(reponerFormErrors.costo_unitario_compra)}
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                    Stock a Ingresar <span style={{ color: "#ef4444" }}>*</span>
                  </label>
                  <div style={{ position: "relative" }}>
                    <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                    <input
                      type="number"
                      step="1"
                      min="1"
                      placeholder="Ej. 100"
                      value={reponerFormData.stock_lote}
                      onChange={(e) => handleReponerInputChange("stock_lote", e.target.value)}
                      onFocus={(e) => handleFieldFocus(e, !!reponerFormErrors.stock_lote)}
                      onBlur={(e) => handleFieldBlur(e, !!reponerFormErrors.stock_lote)}
                      style={inputStyle(!!reponerFormErrors.stock_lote)}
                    />
                  </div>
                  {fieldError(reponerFormErrors.stock_lote)}
                </div>

                <div style={{ gridColumn: "1 / -1" }}>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                    Ubicación / Estante
                  </label>
                  <div style={{ position: "relative" }}>
                    <MapPin size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                    <input
                      type="text"
                      placeholder="Ej. Estante A3"
                      value={reponerFormData.ubicacion_estante}
                      onChange={(e) => handleReponerInputChange("ubicacion_estante", e.target.value)}
                      onFocus={(e) => handleFieldFocus(e, !!reponerFormErrors.ubicacion_estante)}
                      onBlur={(e) => handleFieldBlur(e, !!reponerFormErrors.ubicacion_estante)}
                      style={inputStyle(!!reponerFormErrors.ubicacion_estante)}
                    />
                  </div>
                  {fieldError(reponerFormErrors.ubicacion_estante)}
                </div>
              </div>

              {/* Botones */}
              <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "28px", borderTop: `1px solid ${t.border}`, paddingTop: "24px" }}>
                <button
                  type="button"
                  onClick={() => setShowReponerModal(false)}
                  disabled={submitting}
                  style={{
                    padding: "12px 28px", borderRadius: "12px", border: `2px solid ${t.border}`,
                    background: "transparent", color: submitting ? t.textMuted : t.textSecondary,
                    fontSize: "14px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif", transition: "all 0.2s", opacity: submitting ? 0.5 : 1,
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
                    padding: "12px 32px", borderRadius: "12px", border: "none",
                    background: submitting ? t.textMuted : `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                    color: "#fff", fontSize: "14px", fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer", fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s", boxShadow: submitting ? "none" : `0 4px 16px ${t.accent}40`,
                    display: "flex", alignItems: "center", gap: "8px", opacity: submitting ? 0.6 : 1,
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
                      <ShoppingCart size={18} />
                      Reponer Stock
                    </>
                  )}
                </button>
              </div>
            </form>
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
          style: { background: "transparent", boxShadow: "none", padding: 0 },
        }}
      />
    </div>
  );
}