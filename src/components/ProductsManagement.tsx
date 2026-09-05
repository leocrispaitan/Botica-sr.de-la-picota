import { useState, useEffect, useMemo, useCallback } from "react";
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
  DollarSign,
  AlertTriangle,
  Pill,
  RefreshCw,
  X,
  CheckCircle2,
  AlertCircle,
  Image,
  Layers,
  AlignLeft,
  Tag,
  Truck,
  Route,
  Shield,
  Hash,
  Coins,
  Archive,
  Building2,
  Info,
  HeartPulse,
  Calendar,
  RotateCcw,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { productsService } from "../services/productsService";

const { updateProduct, deleteProduct } = productsService;
import type {
  Categoria,
  CondicionVenta,
  Producto,
  NewProductoInput,
  Proveedor,
  FormaFarmaceutica,
  ViaAdministracion,
  ClasificacionATC,
  Laboratorio,
} from "../services/productsService";

/* ─── Default Image ─────────────────────────────────────────────────── */
const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop";

/* ─── Category Badge Colors ─────────────────────────────────────────────── */
const getCategoryBadgeColors = (categoryId: number, isDark: boolean) => {
  const colors = [
    { bg: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)", text: "#a78bfa", border: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)", icon: "💊" },
    { bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)", text: "#4ade80", border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)", icon: "🦠" },
    { bg: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.08)", text: "#fb923c", border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)", icon: "🌟" },
    { bg: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)", text: "#ef4444", border: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)", icon: "🔥" },
    { bg: isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.08)", text: "#60a5fa", border: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)", icon: "🧴" },
  ];
  return colors[(categoryId - 1) % colors.length] || colors[0];
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

/* ─── New Product Form Types ─────────────────────────────────────── */
type SelectValue = number | "";

interface NewProductFormData {
  nombre_comercial: string;
  nombre_generico: string;
  unidad_medida: string;
  presentacion: string;
  composicion: string;
  imagen_url: string;
  id_categoria: SelectValue;
  id_proveedor: SelectValue;
  id_forma_farmaceutica: SelectValue;
  id_via_administracion: SelectValue;
  id_condicion_venta: SelectValue;
  codigo_atc: string;
  id_laboratorio_titular: SelectValue;
  id_fabricante: SelectValue;
  precio_venta: string;
  costo_referencial: string;
  stock_minimo_alerta: string;
}

interface NewProductFormErrors {
  nombre_comercial?: string;
  nombre_generico?: string;
  unidad_medida?: string;
  id_categoria?: string;
  id_proveedor?: string;
  precio_venta?: string;
  costo_referencial?: string;
  stock_minimo_alerta?: string;
  imagen_url?: string;
}

const UNIDADES_MEDIDA = [
  "UNIDAD",
  "FRASCO",
  "CAJA",
  "BLISTER",
  "TABLETA",
  "AMPOLLA",
  "GOTERO",
  "SOBRE",
  "TUBO",
  "SPRAY",
];

const emptyNewProductForm: NewProductFormData = {
  nombre_comercial: "",
  nombre_generico: "",
  unidad_medida: "UNIDAD",
  presentacion: "",
  composicion: "",
  imagen_url: "",
  id_categoria: "",
  id_proveedor: "",
  id_forma_farmaceutica: "",
  id_via_administracion: "",
  id_condicion_venta: "",
  codigo_atc: "",
  id_laboratorio_titular: "",
  id_fabricante: "",
  precio_venta: "",
  costo_referencial: "",
  stock_minimo_alerta: "",
};

const findCategoriaNombre = (id: number, categorias: Categoria[]) =>
  categorias.find((c) => c.id_categoria === id)?.nombre_categoria || "";

/* ─── Construcción del payload de producto ──────────────────────── */
const buildProductPayload = (formData: NewProductFormData): NewProductoInput => ({
  nombre_comercial: String(formData.nombre_comercial).trim(),
  nombre_generico: String(formData.nombre_generico).trim(),
  unidad_medida: String(formData.unidad_medida).trim(),
  ...(String(formData.presentacion || "").trim() && {
    presentacion: String(formData.presentacion).trim(),
  }),
  ...(String(formData.composicion || "").trim() && {
    composicion: String(formData.composicion).trim(),
  }),
  ...(String(formData.imagen_url || "").trim() && {
    imagen_url: String(formData.imagen_url).trim(),
  }),
  id_categoria: Number(formData.id_categoria),
  id_proveedor: Number(formData.id_proveedor),
  ...(formData.id_forma_farmaceutica !== "" && {
    id_forma_farmaceutica: Number(formData.id_forma_farmaceutica),
  }),
  ...(formData.id_via_administracion !== "" && {
    id_via_administracion: Number(formData.id_via_administracion),
  }),
  ...(formData.id_condicion_venta !== "" && {
    id_condicion_venta: Number(formData.id_condicion_venta),
  }),
  ...(formData.codigo_atc && { codigo_atc: formData.codigo_atc }),
  ...(formData.id_laboratorio_titular !== "" && {
    id_laboratorio_titular: Number(formData.id_laboratorio_titular),
  }),
  ...(formData.id_fabricante !== "" && {
    id_fabricante: Number(formData.id_fabricante),
  }),
  precio_venta: Number(formData.precio_venta),
  costo_referencial: Number(formData.costo_referencial),
  stock_minimo_alerta: Number(formData.stock_minimo_alerta),
});

/* ─── Toast de éxito / error para productos ──────────────────────── */
const showProductSuccessToast = (
  producto: Producto,
  categorias: Categoria[],
  isDark: boolean,
  titulo: string,
  descripcion: string
) => {
  const categoriaNombre = findCategoriaNombre(producto.id_categoria, categorias);
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
            <img
              src={producto.imagen_url || DEFAULT_PRODUCT_IMAGE}
              alt={producto.nombre_comercial}
              style={{ width: "48px", height: "48px", borderRadius: "12px", objectFit: "cover", border: "2px solid #5bcfc5" }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
              }}
            />
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: isDark ? "#ffffff" : "#3d4465", marginBottom: "2px", fontFamily: "'Cairo', sans-serif" }}>
                {producto.nombre_comercial}
              </p>
              <p style={{ fontSize: "12px", color: isDark ? "#828690" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
                {producto.nombre_generico}
              </p>
            </div>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {categoriaNombre && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: "rgba(91, 207, 197, 0.12)", color: "#5bcfc5", border: "1px solid rgba(91, 207, 197, 0.3)", fontSize: "12px", fontWeight: 700 }}>
                {categoriaNombre}
              </span>
            )}
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: isDark ? "#212130" : "#ffffff", color: isDark ? "#fff" : "#3d4465", border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.9)"}`, fontSize: "12px", fontWeight: 700 }}>
              S/ {Number(producto.precio_venta).toFixed(2)}
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: isDark ? "#212130" : "#ffffff", color: isDark ? "#fff" : "#3d4465", border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.9)"}`, fontSize: "12px", fontWeight: 700 }}>
              Stock: {Number(producto.stock_actual) || 0}
            </span>
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

const showProductErrorToast = (mensaje: string, isDark: boolean, titulo: string) => {
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

const showProductDeleteSuccessToast = (producto: Producto, isDark: boolean) => {
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
            <Trash2 size={28} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#ef4444", marginBottom: "4px", fontFamily: "'Cairo', sans-serif" }}>
              ¡Producto Eliminado!
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
              {producto.nombre_comercial} se desactivó del inventario
            </p>
          </div>
        </div>
        <div style={{ background: isDark ? "#1e1d29" : "#f5f6fa", padding: "12px 16px", borderRadius: "12px", display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
          <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0 }} />
          <span>
            El historial de compras y lotes se conserva; solo se desactiva el producto en el inventario.
          </span>
        </div>
        <button
          onClick={() => toast.dismiss(t.id)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "linear-gradient(135deg, #ef4444 0%, #f87171 100%)",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
            marginTop: "16px",
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

/* ═══════════════════════════════════════════════════════════════════ */
/*  PRODUCTS MANAGEMENT COMPONENT                                      */
/* ═══════════════════════════════════════════════════════════════════ */
export default function ProductsManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<number | "all">("all");
  const [condicionFilter, setCondicionFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  // ═══ Datos reales desde el backend ═══
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [condicionesVenta, setCondicionesVenta] = useState<CondicionVenta[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [formasFarmaceuticas, setFormasFarmaceuticas] = useState<FormaFarmaceutica[]>([]);
  const [viasAdministracion, setViasAdministracion] = useState<ViaAdministracion[]>([]);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [clasificacionesAtc, setClasificacionesAtc] = useState<ClasificacionATC[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ═══ Modal: Nuevo Producto ═══
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<NewProductFormData>(emptyNewProductForm);
  const [formErrors, setFormErrors] = useState<NewProductFormErrors>({});

  // ═══ Modal: Editar Producto ═══
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  // ═══ Modal: Ver Producto ═══
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingProduct, setViewingProduct] = useState<Producto | null>(null);

  // ═══ Modal: Eliminar Producto ═══
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Producto | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);
  const [productToReactivate, setProductToReactivate] = useState<Producto | null>(null);
  const [reactivating, setReactivating] = useState(false);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, catalogData] = await Promise.all([
        productsService.getAllProducts(),
        productsService.getProductCatalog(),
      ]);
      setProductos(productsData);
      setCategorias(catalogData.categorias);
      setCondicionesVenta(catalogData.condiciones_venta);
      setProveedores(catalogData.proveedores);
      setFormasFarmaceuticas(catalogData.formas_farmaceuticas);
      setViasAdministracion(catalogData.vias_administracion);
      setLaboratorios(catalogData.laboratorios);
      setClasificacionesAtc(catalogData.clasificaciones_atc);
    } catch (err: any) {
      console.error("❌ Error al cargar productos:", err);
      setError(
        err?.response?.data?.message || "Error al cargar los productos. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const t = getTheme(isDark);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return productos.filter((product) => {
      const matchesSearch =
        product.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.categoria?.nombre_categoria || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.composicion || "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || product.id_categoria === categoryFilter;
      const matchesCondicion = condicionFilter === "all" || product.id_condicion_venta === condicionFilter;
      const matchesStatus = statusFilter === "all" || product.estado_logico === statusFilter;

      return matchesSearch && matchesCategory && matchesCondicion && matchesStatus;
    });
  }, [productos, searchTerm, categoryFilter, condicionFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // ═══ Formulario: Nuevo Producto ═══
  const handleOpenNewProductModal = () => {
    setFormData(emptyNewProductForm);
    setFormErrors({});
    setShowNewProductModal(true);
  };

  const handleInputChange = (field: keyof NewProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: keyof NewProductFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value === "" ? "" : Number(value) }));
  };

  const validateNewProductForm = (): boolean => {
    const newErrors: NewProductFormErrors = {};
    if (!String(formData.nombre_comercial || "").trim()) {
      newErrors.nombre_comercial = "El nombre comercial es obligatorio.";
    }
    if (!String(formData.nombre_generico || "").trim()) {
      newErrors.nombre_generico = "El nombre genérico es obligatorio.";
    }
    if (!String(formData.unidad_medida || "").trim()) {
      newErrors.unidad_medida = "Selecciona la unidad de medida.";
    }
    if (formData.id_categoria === "") {
      newErrors.id_categoria = "Selecciona una categoría.";
    }
    if (formData.id_proveedor === "") {
      newErrors.id_proveedor = "Selecciona un proveedor.";
    }
    if (formData.precio_venta === "" || !(Number(formData.precio_venta) > 0)) {
      newErrors.precio_venta = "Debe ser mayor a 0.";
    }
    if (formData.costo_referencial === "" || !(Number(formData.costo_referencial) >= 0)) {
      newErrors.costo_referencial = "Debe ser mayor o igual a 0.";
    }
    if (
      formData.stock_minimo_alerta === "" ||
      !Number.isInteger(Number(formData.stock_minimo_alerta)) ||
      Number(formData.stock_minimo_alerta) < 0
    ) {
      newErrors.stock_minimo_alerta = "Debe ser un entero mayor o igual a 0.";
    }
    const imagen = String(formData.imagen_url || "").trim();
    if (imagen && !/^https?:\/\/.+/.test(imagen)) {
      newErrors.imagen_url = "Ingresa una URL válida (https://...)";
    }
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateNewProductForm()) {
      return;
    }
    setSubmitting(true);
    try {
      const payload = buildProductPayload(formData);

      console.log("📤 Enviando nuevo producto al backend:", payload);

      const nuevoProducto = await productsService.createProduct(payload);

      console.log("✅ Producto creado exitosamente:", nuevoProducto);

      setShowNewProductModal(false);
      setFormData(emptyNewProductForm);
      setFormErrors({});

      await loadProducts();

      showProductSuccessToast(
        nuevoProducto,
        categorias,
        isDark,
        "¡Producto Creado Exitosamente!",
        `${nuevoProducto.nombre_comercial} se agregó al inventario`
      );
    } catch (err: any) {
      console.error("❌ Error al crear producto:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo crear el producto. Intenta nuevamente.";
      showProductErrorToast(mensaje, isDark, "No se pudo crear el producto");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Gestión: Editar Producto ─── */
  const handleOpenEditModal = (product: Producto) => {
    setEditingProductId(product.id_producto);
    setFormData({
      nombre_comercial: product.nombre_comercial || "",
      nombre_generico: product.nombre_generico || "",
      unidad_medida: product.unidad_medida || "",
      presentacion: product.presentacion || "",
      composicion: product.composicion || "",
      imagen_url: product.imagen_url || "",
      id_categoria: product.id_categoria ?? "",
      id_proveedor: product.id_proveedor ?? "",
      id_forma_farmaceutica: product.id_forma_farmaceutica ?? "",
      id_via_administracion: product.id_via_administracion ?? "",
      id_condicion_venta: product.id_condicion_venta ?? "",
      codigo_atc: product.codigo_atc || "",
      id_laboratorio_titular: product.laboratorio_titular?.id_laboratorio ?? "",
      id_fabricante: product.fabricante?.id_laboratorio ?? "",
      precio_venta: product.precio_venta != null ? String(product.precio_venta) : "",
      costo_referencial: product.costo_referencial != null ? String(product.costo_referencial) : "",
      stock_minimo_alerta: product.stock_minimo_alerta != null ? String(product.stock_minimo_alerta) : "",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  /* ─── Gestión: Ver Producto ─── */
  const handleOpenViewModal = (product: Producto) => {
    setViewingProduct(product);
    setShowViewModal(true);
  };

  /* ─── Gestión: Eliminar Producto ─── */
  const handleOpenDeleteModal = (product: Producto) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id_producto);
      const eliminado = productToDelete;
      setShowDeleteModal(false);
      setProductToDelete(null);
      await loadProducts();
      showProductDeleteSuccessToast(eliminado, isDark);
    } catch (err: any) {
      console.error("❌ Error al eliminar producto:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo eliminar el producto. Intenta nuevamente.";
      showProductErrorToast(mensaje, isDark, "No se pudo eliminar");
    } finally {
      setDeleting(false);
    }
  };

  /* ─── Gestión: Reactivar Producto ─── */
  const handleOpenReactivateModal = (product: Producto) => {
    setProductToReactivate(product);
    setShowReactivateModal(true);
  };

  const handleConfirmReactivate = async () => {
    if (!productToReactivate) return;
    setReactivating(true);
    try {
      const reactivado = await updateProduct(productToReactivate.id_producto, {
        nombre_comercial: productToReactivate.nombre_comercial,
        nombre_generico: productToReactivate.nombre_generico,
        unidad_medida: productToReactivate.unidad_medida,
        composicion: productToReactivate.composicion || "",
        presentacion: productToReactivate.presentacion || "",
        imagen_url: productToReactivate.imagen_url || "",
        id_categoria: productToReactivate.id_categoria,
        id_proveedor: productToReactivate.id_proveedor,
        id_forma_farmaceutica: productToReactivate.id_forma_farmaceutica ?? undefined,
        id_via_administracion: productToReactivate.id_via_administracion ?? undefined,
        id_condicion_venta: productToReactivate.id_condicion_venta ?? undefined,
        codigo_atc: productToReactivate.codigo_atc || "",
        id_laboratorio_titular: productToReactivate.id_laboratorio_titular ?? undefined,
        id_fabricante: productToReactivate.id_fabricante ?? undefined,
        precio_venta: Number(productToReactivate.precio_venta),
        costo_referencial: Number(productToReactivate.costo_referencial),
        stock_minimo_alerta: Number(productToReactivate.stock_minimo_alerta),
        estado_logico: true,
      });
      setShowReactivateModal(false);
      setProductToReactivate(null);
      await loadProducts();
      showProductSuccessToast(
        reactivado,
        categorias,
        isDark,
        "¡Producto Reactivado!",
        `${reactivado.nombre_comercial} se activó nuevamente en el inventario`
      );
    } catch (err: any) {
      console.error("❌ Error al reactivar producto:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo reactivar el producto. Intenta nuevamente.";
      showProductErrorToast(mensaje, isDark, "No se pudo reactivar el producto");
    } finally {
      setReactivating(false);
    }
  };

  const handleSubmitEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId == null) {
      showProductErrorToast("No se pudo identificar el producto a editar.", isDark, "Error");
      return;
    }

    if (!validateNewProductForm()) {
      showProductErrorToast("Revisa los campos marcados en rojo.", isDark, "Datos incompletos");
      return;
    }

    setSubmitting(true);
    try {
      const product = await updateProduct(editingProductId, buildProductPayload(formData));
      setShowEditModal(false);
      await loadProducts();
      showProductSuccessToast(
        product,
        categorias,
        isDark,
        "¡Producto Actualizado Exitosamente!",
        `${product.nombre_comercial} se actualizó correctamente`
      );
    } catch (err: any) {
      console.error("❌ Error al actualizar producto:", err);
      const mensaje =
        err?.response?.data?.message ||
        "No se pudo actualizar el producto. Intenta nuevamente.";
      showProductErrorToast(mensaje, isDark, "No se pudo actualizar el producto");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total stock value
  const totalStockValue = productos.reduce((sum, p) => sum + (Number(p.precio_venta) || 0) * (Number(p.stock_actual) || 0), 0);
  const totalProducts = productos.length;
  const stockCritico = productos.filter(p => (Number(p.stock_actual) || 0) <= (Number(p.stock_minimo_alerta) || 0)).length;

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

  const selectStyle = (hasError: boolean) => ({
    ...inputStyle(hasError),
    cursor: "pointer",
  });

  const handleFieldFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) => {
    if (!hasError) {
      e.currentTarget.style.borderColor = t.accent;
      e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
    }
  };

  const handleFieldBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, hasError: boolean) => {
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
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Gestión de Productos
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra y visualiza el inventario de productos farmacéuticos
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Productos - Purple Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #7c3aed 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)" }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Productos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {totalProducts}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#a7f3d0" }}>
                  +5.2%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <Package size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Valor Inventario - Green Gradient */}
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
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)" }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Valor Inventario
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                S/ {totalStockValue.toFixed(2)}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#d1fae5" }}>
                  +12.8%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Stock Crítico - Orange/Red Gradient */}
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
          <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "160px", height: "160px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.05)", border: "1px solid rgba(255, 255, 255, 0.1)" }} />
          <div style={{ position: "absolute", bottom: "-20px", left: "-20px", width: "100px", height: "100px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.03)" }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Stock Crítico
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {stockCritico}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#fed7aa" }}>
                  ⚠️ Requiere atención
                </span>
              </div>
            </div>
            <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.2)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
              <AlertTriangle size={28} color="#ffffff" strokeWidth={2.5} />
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
                placeholder="Buscar por nombre, genérico, categoría o composición..."
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
              {(categoryFilter !== "all" || condicionFilter !== "all" || statusFilter !== "all") && (
                <span style={{ background: t.accent, color: "#fff", borderRadius: "50%", width: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700 }}>
                  {(categoryFilter !== "all" ? 1 : 0) + (condicionFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Add Product Button */}
            <button
              onClick={handleOpenNewProductModal}
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
              Nuevo Producto
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", padding: "16px", background: t.innerBg, borderRadius: "12px", border: `1px solid ${t.border}` }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Categoría
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value === "all" ? "all" : Number(e.target.value));
                    handleFilterChange();
                  }}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif", outline: "none" }}
                >
                  <option value="all">Todas las categorías</option>
                  {categorias.map((cat) => (
                    <option key={cat.id_categoria} value={cat.id_categoria}>
                      {cat.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Condición de Venta
                </label>
                <select
                  value={condicionFilter}
                  onChange={(e) => {
                    setCondicionFilter(e.target.value === "all" ? "all" : Number(e.target.value));
                    handleFilterChange();
                  }}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif", outline: "none" }}
                >
                  <option value="all">Todas las condiciones</option>
                  {condicionesVenta.map((cond) => (
                    <option key={cond.id_condicion_venta} value={cond.id_condicion_venta}>
                      {cond.requiere_receta ? "🔒" : "🆓"} {cond.nombre}
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
                  style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif", outline: "none" }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="true">✓ Activos</option>
                  <option value="false">✗ Inactivos</option>
                </select>
              </div>

              {(categoryFilter !== "all" || condicionFilter !== "all" || statusFilter !== "all") && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setCondicionFilter("all");
                      setStatusFilter("all");
                      handleFilterChange();
                    }}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textSecondary, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s" }}
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
            Cargando productos...
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
            No se pudieron cargar los productos
          </p>
          <p style={{ fontSize: "14px", color: t.textSecondary, textAlign: "center", maxWidth: "420px" }}>
            {error}
          </p>
          <button
            onClick={loadProducts}
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
              Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} de {filteredProducts.length} productos
            </p>
            {filteredProducts.length === 0 && searchTerm && (
              <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
                No se encontraron resultados para "{searchTerm}"
              </p>
            )}
          </div>

          {/* Products Table */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Producto
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Categoría
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Precio / Stock
                    </th>
                    <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Condición
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
                  {currentProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                          <Search size={48} color={t.textMuted} />
                          <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                            No se encontraron productos
                          </p>
                          <p style={{ fontSize: "14px", color: t.textSecondary }}>
                            Intenta ajustar los filtros de búsqueda
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentProducts.map((product, index) => {
                      const categoryBadge = getCategoryBadgeColors(product.id_categoria, isDark);
                      const isStockCritico = (Number(product.stock_actual) || 0) <= (Number(product.stock_minimo_alerta) || 0);
                      return (
                        <tr
                          key={product.id_producto}
                          style={{ borderBottom: index < currentProducts.length - 1 ? `1px solid ${t.border}` : "none", transition: "background 0.2s" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                          }}
                        >
                          {/* Producto con Imagen */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <img
                                src={product.imagen_url || DEFAULT_PRODUCT_IMAGE}
                                alt={product.nombre_comercial}
                                style={{ width: "60px", height: "60px", borderRadius: "12px", objectFit: "cover", border: `2px solid ${t.border}`, flexShrink: 0 }}
                              />
                              <div style={{ minWidth: 0 }}>
                                <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {product.nombre_comercial}
                                </p>
                                <p style={{ fontSize: "12px", color: t.textSecondary, marginBottom: "2px" }}>
                                  {product.nombre_generico}
                                </p>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: t.textMuted }}>
                                  <Pill size={12} />
                                  <span>{product.forma_farmaceutica?.nombre}</span>
                                  <span>•</span>
                                  <span>{product.presentacion}</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Categoría */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: categoryBadge.bg, color: categoryBadge.text, border: `1px solid ${categoryBadge.border}`, fontSize: "12px", fontWeight: 700, letterSpacing: "0.03em", whiteSpace: "nowrap" }}>
                              <span style={{ fontSize: "14px" }}>{categoryBadge.icon}</span>
                              {product.categoria?.nombre_categoria}
                            </span>
                          </td>

                          {/* Precio / Stock */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", color: t.textPrimary, fontWeight: 600 }}>
                                <DollarSign size={14} color={t.accent} />
                                <span>S/ {Number(product.precio_venta).toFixed(2)}</span>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: isStockCritico ? "#ef4444" : t.textSecondary }}>
                                <Package size={14} color={isStockCritico ? "#ef4444" : t.textMuted} />
                                <span>
                                  Stock: {Number(product.stock_actual) || 0} {product.unidad_medida}
                                  {isStockCritico && " ⚠️"}
                                </span>
                              </div>
                              <div style={{ fontSize: "11px", color: t.textMuted }}>
                                Costo: S/ {Number(product.costo_referencial).toFixed(2)}
                              </div>
                            </div>
                          </td>

                          {/* Condición de Venta */}
                          <td style={{ padding: "16px 20px" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "8px", background: product.condicion_venta?.requiere_receta ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: product.condicion_venta?.requiere_receta ? "#ef4444" : "#22c55e", border: `1px solid ${product.condicion_venta?.requiere_receta ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                              <span style={{ fontSize: "14px" }}>{product.condicion_venta?.requiere_receta ? "🔒" : "🆓"}</span>
                              {product.condicion_venta?.requiere_receta ? "Con Receta" : "Venta Libre"}
                            </span>
                          </td>

                          {/* Estado */}
                          <td style={{ padding: "16px 20px", textAlign: "center" }}>
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: product.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: product.estado_logico ? "#22c55e" : "#ef4444", border: `1px solid ${product.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: product.estado_logico ? "#22c55e" : "#ef4444" }} />
                              {product.estado_logico ? "Activo" : "Inactivo"}
                            </span>
                          </td>

                          {/* Acciones */}
                          <td style={{ padding: "16px 20px" }}>
                            <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                              <button
                                title="Ver detalles"
                                onClick={() => handleOpenViewModal(product)}
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
                                title="Editar producto"
                                onClick={() => handleOpenEditModal(product)}
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
                                title={product.estado_logico ? "Eliminar producto" : "Producto inactivo - no se puede eliminar"}
                                onClick={() => handleOpenDeleteModal(product)}
                                disabled={!product.estado_logico}
                                style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: product.estado_logico ? t.textSecondary : t.textMuted, cursor: product.estado_logico ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", opacity: product.estado_logico ? 1 : 0.4 }}
                                onMouseEnter={(e) => {
                                  if (product.estado_logico) {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                  (e.currentTarget as HTMLButtonElement).style.color = product.estado_logico ? t.textSecondary : t.textMuted;
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                              <button
                                title={product.estado_logico ? "Más opciones" : "Reactivar producto"}
                                onClick={() => {
                                  if (!product.estado_logico) {
                                    handleOpenReactivateModal(product);
                                  }
                                }}
                                style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: product.estado_logico ? t.textSecondary : "#22c55e", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                                onMouseEnter={(e) => {
                                  if (product.estado_logico) {
                                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                                    (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                                  } else {
                                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(34,197,94,0.12)";
                                    (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                  (e.currentTarget as HTMLButtonElement).style.color = product.estado_logico ? t.textSecondary : "#22c55e";
                                }}
                              >
                                {product.estado_logico ? <MoreVertical size={16} /> : <RotateCcw size={16} />}
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
            {filteredProducts.length > 0 && (
              <div style={{ padding: "20px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  Página {currentPage} de {totalPages}
                </p>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === 1 ? t.innerBg : t.cardBg, color: currentPage === 1 ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === 1 ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s", opacity: currentPage === 1 ? 0.5 : 1 }}
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
                        style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${page === currentPage ? t.accent : t.border}`, background: page === currentPage ? `${t.accent}15` : t.cardBg, color: page === currentPage ? t.accent : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s", minWidth: "36px" }}
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
                    style={{ padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: currentPage === totalPages ? t.innerBg : t.cardBg, color: currentPage === totalPages ? t.textMuted : t.textPrimary, fontSize: "13px", fontWeight: 600, cursor: currentPage === totalPages ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s", opacity: currentPage === totalPages ? 0.5 : 1 }}
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

      {/* MODAL: NUEVO PRODUCTO */}
      {showNewProductModal && (
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
              setShowNewProductModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "1100px",
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
                  <Pill size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Nuevo Producto
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Registra un nuevo producto farmacéutico en el inventario
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewProductModal(false)}
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
            <form onSubmit={handleSubmitNewProduct} style={{ padding: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* ─── Sección: Información General ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información General
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Nombre Comercial */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre Comercial <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.nombre_comercial}
                          onChange={(e) => handleInputChange("nombre_comercial", e.target.value)}
                          placeholder="Ej. Panadol Jarabe"
                          style={inputStyle(!!formErrors.nombre_comercial)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.nombre_comercial)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.nombre_comercial)}
                        />
                      </div>
                      {fieldError(formErrors.nombre_comercial)}
                    </div>

                    {/* Nombre Genérico */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre Genérico <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Pill size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.nombre_generico}
                          onChange={(e) => handleInputChange("nombre_generico", e.target.value)}
                          placeholder="Ej. Paracetamol"
                          style={inputStyle(!!formErrors.nombre_generico)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.nombre_generico)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.nombre_generico)}
                        />
                      </div>
                      {fieldError(formErrors.nombre_generico)}
                    </div>

                    {/* Unidad de Medida */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Unidad de Medida <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Layers size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.unidad_medida}
                          onChange={(e) => handleInputChange("unidad_medida", e.target.value)}
                          style={selectStyle(!!formErrors.unidad_medida)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.unidad_medida)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.unidad_medida)}
                        >
                          {UNIDADES_MEDIDA.map((um) => (
                            <option key={um} value={um}>
                              {um}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.unidad_medida)}
                    </div>

                    {/* Presentación */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Presentación <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Info size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.presentacion}
                          onChange={(e) => handleInputChange("presentacion", e.target.value)}
                          placeholder="Ej. Caja de cartón con frasco x 60 mL"
                          style={inputStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        />
                      </div>
                    </div>

                    {/* Composición */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Composición <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <AlignLeft size={16} style={{ position: "absolute", left: "14px", top: "14px", color: t.textMuted }} />
                        <textarea
                          value={formData.composicion}
                          onChange={(e) => handleInputChange("composicion", e.target.value)}
                          placeholder='Ej. Cada 5 mL contiene PARACETAMOL 160 mg'
                          rows={3}
                          style={{ ...inputStyle(false), resize: "vertical", minHeight: "84px" }}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        />
                      </div>
                    </div>

                    {/* URL de Imagen */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        URL de Imagen <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Image size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.imagen_url}
                          onChange={(e) => handleInputChange("imagen_url", e.target.value)}
                          placeholder="https://ejemplo.com/producto.jpg"
                          style={inputStyle(!!formErrors.imagen_url)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.imagen_url)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.imagen_url)}
                        />
                      </div>
                      {fieldError(formErrors.imagen_url)}
                      <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                        Deja vacío para usar una imagen por defecto
                      </p>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Clasificación ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Tag size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Clasificación
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Categoría */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Categoría <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_categoria === "" ? "" : String(formData.id_categoria)}
                          onChange={(e) => handleSelectChange("id_categoria", e.target.value)}
                          style={selectStyle(!!formErrors.id_categoria)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.id_categoria)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.id_categoria)}
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                              {cat.nombre_categoria} — {cat.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.id_categoria)}
                    </div>

                    {/* Proveedor */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Proveedor <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Truck size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_proveedor === "" ? "" : String(formData.id_proveedor)}
                          onChange={(e) => handleSelectChange("id_proveedor", e.target.value)}
                          style={selectStyle(!!formErrors.id_proveedor)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.id_proveedor)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.id_proveedor)}
                        >
                          <option value="">Selecciona un proveedor</option>
                          {proveedores.map((prov) => (
                            <option key={prov.id_proveedor} value={prov.id_proveedor}>
                              {prov.nombre_proveedor}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.id_proveedor)}
                    </div>

                    {/* Forma Farmacéutica */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Forma Farmacéutica <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Pill size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_forma_farmaceutica === "" ? "" : String(formData.id_forma_farmaceutica)}
                          onChange={(e) => handleSelectChange("id_forma_farmaceutica", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una forma</option>
                          {formasFarmaceuticas.map((ff) => (
                            <option key={ff.id_forma_farmaceutica} value={ff.id_forma_farmaceutica}>
                              {ff.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Vía de Administración */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Vía de Administración <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Route size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_via_administracion === "" ? "" : String(formData.id_via_administracion)}
                          onChange={(e) => handleSelectChange("id_via_administracion", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una vía</option>
                          {viasAdministracion.map((via) => (
                            <option key={via.id_via_administracion} value={via.id_via_administracion}>
                              {via.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Condición de Venta */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Condición de Venta <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Shield size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_condicion_venta === "" ? "" : String(formData.id_condicion_venta)}
                          onChange={(e) => handleSelectChange("id_condicion_venta", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una condición</option>
                          {condicionesVenta.map((cv) => (
                            <option key={cv.id_condicion_venta} value={cv.id_condicion_venta}>
                              {cv.requiere_receta ? "🔒" : "🆓"} {cv.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Código ATC */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Clasificación ATC <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Hash size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.codigo_atc}
                          onChange={(e) => handleInputChange("codigo_atc", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un código</option>
                          {clasificacionesAtc.map((atc) => (
                            <option key={atc.codigo_atc} value={atc.codigo_atc}>
                              {atc.codigo_atc} — {atc.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Precios y Stock ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <DollarSign size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Precios y Stock
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Precio de Venta */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Precio de Venta (S/) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <DollarSign size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={formData.precio_venta}
                          onChange={(e) => handleInputChange("precio_venta", e.target.value)}
                          placeholder="0.00"
                          style={inputStyle(!!formErrors.precio_venta)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.precio_venta)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.precio_venta)}
                        />
                      </div>
                      {fieldError(formErrors.precio_venta)}
                    </div>

                    {/* Costo Referencial */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Costo Referencial (S/) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Coins size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costo_referencial}
                          onChange={(e) => handleInputChange("costo_referencial", e.target.value)}
                          placeholder="0.00"
                          style={inputStyle(!!formErrors.costo_referencial)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.costo_referencial)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.costo_referencial)}
                        />
                      </div>
                      {fieldError(formErrors.costo_referencial)}
                    </div>

                    {/* Stock Mínimo */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Stock Mínimo de Alerta <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Archive size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock_minimo_alerta}
                          onChange={(e) => handleInputChange("stock_minimo_alerta", e.target.value)}
                          placeholder="Ej. 10"
                          style={inputStyle(!!formErrors.stock_minimo_alerta)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.stock_minimo_alerta)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.stock_minimo_alerta)}
                        />
                      </div>
                      {fieldError(formErrors.stock_minimo_alerta)}
                    </div>

                    {/* Nota */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "12px", background: `${t.accent}10`, border: `1px solid ${t.accent}30`, fontSize: "12px", color: t.textSecondary }}>
                        <Info size={16} color={t.accent} style={{ flexShrink: 0 }} />
                        <span>
                          El stock inicial del producto se registrará al ingresar una compra o lote desde el módulo de compras.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Fabricación ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building2 size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Fabricación <span style={{ fontSize: "12px", fontWeight: 500, color: t.textMuted }}>(Opcional)</span>
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Laboratorio Titular */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Laboratorio Titular <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Building2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_laboratorio_titular === "" ? "" : String(formData.id_laboratorio_titular)}
                          onChange={(e) => handleSelectChange("id_laboratorio_titular", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un laboratorio</option>
                          {laboratorios.map((lab) => (
                            <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                              {lab.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Fabricante */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Fabricante <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Building2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_fabricante === "" ? "" : String(formData.id_fabricante)}
                          onChange={(e) => handleSelectChange("id_fabricante", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un fabricante</option>
                          {laboratorios.map((lab) => (
                            <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                              {lab.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
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
                  onClick={() => setShowNewProductModal(false)}
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
                      Crear Producto
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Modal: Editar Producto ═══ */}
      {showEditModal && (
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
              setShowEditModal(false);
            }
          }}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "1100px",
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
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 8px 16px rgba(249, 115, 22, 0.4)",
                  }}
                >
                  <Edit2 size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Editar Producto
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Modifica la información del producto farmacéutico
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
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
            <form onSubmit={handleSubmitEditProduct} style={{ padding: "32px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                {/* ─── Sección: Información General ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Info size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Información General
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Nombre Comercial */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre Comercial <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Package size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.nombre_comercial}
                          onChange={(e) => handleInputChange("nombre_comercial", e.target.value)}
                          placeholder="Ej. Panadol Jarabe"
                          style={inputStyle(!!formErrors.nombre_comercial)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.nombre_comercial)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.nombre_comercial)}
                        />
                      </div>
                      {fieldError(formErrors.nombre_comercial)}
                    </div>

                    {/* Nombre Genérico */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre Genérico <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Pill size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.nombre_generico}
                          onChange={(e) => handleInputChange("nombre_generico", e.target.value)}
                          placeholder="Ej. Paracetamol"
                          style={inputStyle(!!formErrors.nombre_generico)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.nombre_generico)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.nombre_generico)}
                        />
                      </div>
                      {fieldError(formErrors.nombre_generico)}
                    </div>

                    {/* Unidad de Medida */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Unidad de Medida <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Layers size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.unidad_medida}
                          onChange={(e) => handleInputChange("unidad_medida", e.target.value)}
                          style={selectStyle(!!formErrors.unidad_medida)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.unidad_medida)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.unidad_medida)}
                        >
                          {UNIDADES_MEDIDA.map((um) => (
                            <option key={um} value={um}>
                              {um}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.unidad_medida)}
                    </div>

                    {/* Presentación */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Presentación <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Info size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.presentacion}
                          onChange={(e) => handleInputChange("presentacion", e.target.value)}
                          placeholder="Ej. Caja de cartón con frasco x 60 mL"
                          style={inputStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        />
                      </div>
                    </div>

                    {/* Composición */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Composición <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <AlignLeft size={16} style={{ position: "absolute", left: "14px", top: "14px", color: t.textMuted }} />
                        <textarea
                          value={formData.composicion}
                          onChange={(e) => handleInputChange("composicion", e.target.value)}
                          placeholder='Ej. Cada 5 mL contiene PARACETAMOL 160 mg'
                          rows={3}
                          style={{ ...inputStyle(false), resize: "vertical", minHeight: "84px" }}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        />
                      </div>
                    </div>

                    {/* URL de Imagen */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        URL de Imagen <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Image size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.imagen_url}
                          onChange={(e) => handleInputChange("imagen_url", e.target.value)}
                          placeholder="https://ejemplo.com/producto.jpg"
                          style={inputStyle(!!formErrors.imagen_url)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.imagen_url)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.imagen_url)}
                        />
                      </div>
                      {fieldError(formErrors.imagen_url)}
                      <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                        Deja vacío para usar una imagen por defecto
                      </p>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Clasificación ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Tag size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Clasificación
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Categoría */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Categoría <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Tag size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_categoria === "" ? "" : String(formData.id_categoria)}
                          onChange={(e) => handleSelectChange("id_categoria", e.target.value)}
                          style={selectStyle(!!formErrors.id_categoria)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.id_categoria)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.id_categoria)}
                        >
                          <option value="">Selecciona una categoría</option>
                          {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                              {cat.nombre_categoria} — {cat.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.id_categoria)}
                    </div>

                    {/* Proveedor */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Proveedor <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Truck size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_proveedor === "" ? "" : String(formData.id_proveedor)}
                          onChange={(e) => handleSelectChange("id_proveedor", e.target.value)}
                          style={selectStyle(!!formErrors.id_proveedor)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.id_proveedor)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.id_proveedor)}
                        >
                          <option value="">Selecciona un proveedor</option>
                          {proveedores.map((prov) => (
                            <option key={prov.id_proveedor} value={prov.id_proveedor}>
                              {prov.nombre_proveedor}
                            </option>
                          ))}
                        </select>
                      </div>
                      {fieldError(formErrors.id_proveedor)}
                    </div>

                    {/* Forma Farmacéutica */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Forma Farmacéutica <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Pill size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_forma_farmaceutica === "" ? "" : String(formData.id_forma_farmaceutica)}
                          onChange={(e) => handleSelectChange("id_forma_farmaceutica", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una forma</option>
                          {formasFarmaceuticas.map((ff) => (
                            <option key={ff.id_forma_farmaceutica} value={ff.id_forma_farmaceutica}>
                              {ff.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Vía de Administración */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Vía de Administración <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Route size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_via_administracion === "" ? "" : String(formData.id_via_administracion)}
                          onChange={(e) => handleSelectChange("id_via_administracion", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una vía</option>
                          {viasAdministracion.map((via) => (
                            <option key={via.id_via_administracion} value={via.id_via_administracion}>
                              {via.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Condición de Venta */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Condición de Venta <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Shield size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_condicion_venta === "" ? "" : String(formData.id_condicion_venta)}
                          onChange={(e) => handleSelectChange("id_condicion_venta", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona una condición</option>
                          {condicionesVenta.map((cv) => (
                            <option key={cv.id_condicion_venta} value={cv.id_condicion_venta}>
                              {cv.requiere_receta ? "🔒" : "🆓"} {cv.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Código ATC */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Clasificación ATC <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Hash size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.codigo_atc}
                          onChange={(e) => handleInputChange("codigo_atc", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un código</option>
                          {clasificacionesAtc.map((atc) => (
                            <option key={atc.codigo_atc} value={atc.codigo_atc}>
                              {atc.codigo_atc} — {atc.descripcion}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Precios y Stock ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <DollarSign size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Precios y Stock
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Precio de Venta */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Precio de Venta (S/) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <DollarSign size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.precio_venta}
                          onChange={(e) => handleInputChange("precio_venta", e.target.value)}
                          placeholder="0.00"
                          style={inputStyle(!!formErrors.precio_venta)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.precio_venta)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.precio_venta)}
                        />
                      </div>
                      {fieldError(formErrors.precio_venta)}
                    </div>

                    {/* Costo Referencial */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Costo Referencial (S/) <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Coins size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.costo_referencial}
                          onChange={(e) => handleInputChange("costo_referencial", e.target.value)}
                          placeholder="0.00"
                          style={inputStyle(!!formErrors.costo_referencial)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.costo_referencial)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.costo_referencial)}
                        />
                      </div>
                      {fieldError(formErrors.costo_referencial)}
                    </div>

                    {/* Stock Mínimo */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Stock Mínimo de Alerta <span style={{ color: "#ef4444" }}>*</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Archive size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.stock_minimo_alerta}
                          onChange={(e) => handleInputChange("stock_minimo_alerta", e.target.value)}
                          placeholder="Ej. 10"
                          style={inputStyle(!!formErrors.stock_minimo_alerta)}
                          onFocus={(e) => handleFieldFocus(e, !!formErrors.stock_minimo_alerta)}
                          onBlur={(e) => handleFieldBlur(e, !!formErrors.stock_minimo_alerta)}
                        />
                      </div>
                      {fieldError(formErrors.stock_minimo_alerta)}
                    </div>

                    {/* Nota */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "12px", background: `${t.accent}10`, border: `1px solid ${t.accent}30`, fontSize: "12px", color: t.textSecondary }}>
                        <Info size={16} color={t.accent} style={{ flexShrink: 0 }} />
                        <span>
                          El stock inicial del producto se registrará al ingresar una compra o lote desde el módulo de compras.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Separador */}
                <div style={{ height: "1px", background: t.border }} />

                {/* ─── Sección: Fabricación ─── */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Building2 size={16} color={t.accent} />
                    </div>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                      Fabricación <span style={{ fontSize: "12px", fontWeight: 500, color: t.textMuted }}>(Opcional)</span>
                    </h3>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    {/* Laboratorio Titular */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Laboratorio Titular <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Building2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_laboratorio_titular === "" ? "" : String(formData.id_laboratorio_titular)}
                          onChange={(e) => handleSelectChange("id_laboratorio_titular", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un laboratorio</option>
                          {laboratorios.map((lab) => (
                            <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                              {lab.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Fabricante */}
                    <div>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Fabricante <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Building2 size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                        <select
                          value={formData.id_fabricante === "" ? "" : String(formData.id_fabricante)}
                          onChange={(e) => handleSelectChange("id_fabricante", e.target.value)}
                          style={selectStyle(false)}
                          onFocus={(e) => handleFieldFocus(e, false)}
                          onBlur={(e) => handleFieldBlur(e, false)}
                        >
                          <option value="">Selecciona un fabricante</option>
                          {laboratorios.map((lab) => (
                            <option key={lab.id_laboratorio} value={lab.id_laboratorio}>
                              {lab.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
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
                      : "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: submitting ? "not-allowed" : "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: submitting ? "none" : "0 4px 16px rgba(249, 115, 22, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    opacity: submitting ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(249, 115, 22, 0.5)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!submitting) {
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(249, 115, 22, 0.4)";
                    }
                  }}
                >
                  {submitting ? (
                    <>
                      <RefreshCw size={18} style={{ animation: "spin 1s linear infinite" }} />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Edit2 size={18} />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══ Modal: Ver Producto ═══ */}
      {showViewModal && viewingProduct && (
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
              maxWidth: "1000px",
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
                    Detalle del Producto
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Información completa del producto farmacéutico
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
              {/* Hero: Imagen + nombres + badges */}
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
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <img
                    src={viewingProduct.imagen_url || DEFAULT_PRODUCT_IMAGE}
                    alt={viewingProduct.nombre_comercial}
                    style={{ width: "120px", height: "120px", borderRadius: "16px", objectFit: "cover", border: `2px solid ${t.accent}` }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "-8px",
                      width: "36px",
                      height: "36px",
                      borderRadius: "12px",
                      background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 6px 14px ${t.accent}40`,
                    }}
                  >
                    <Pill size={18} color="#fff" />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    {viewingProduct.nombre_comercial}
                  </h2>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                    <HeartPulse size={16} color={t.accent} />
                    <p style={{ fontSize: "15px", fontWeight: 500, color: t.textSecondary }}>
                      {viewingProduct.nombre_generico}
                    </p>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", background: getCategoryBadgeColors(viewingProduct.id_categoria, isDark).bg, color: getCategoryBadgeColors(viewingProduct.id_categoria, isDark).text, border: `1px solid ${getCategoryBadgeColors(viewingProduct.id_categoria, isDark).border}`, fontSize: "12px", fontWeight: 700 }}>
                      <span style={{ fontSize: "14px" }}>{getCategoryBadgeColors(viewingProduct.id_categoria, isDark).icon}</span>
                      {viewingProduct.categoria?.nombre_categoria || "Sin categoría"}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "10px", background: viewingProduct.condicion_venta?.requiere_receta ? "rgba(239,68,68,0.1)" : "rgba(34,197,94,0.1)", color: viewingProduct.condicion_venta?.requiere_receta ? "#ef4444" : "#22c55e", border: `1px solid ${viewingProduct.condicion_venta?.requiere_receta ? "rgba(239,68,68,0.3)" : "rgba(34,197,94,0.3)"}`, fontSize: "12px", fontWeight: 700 }}>
                      <span style={{ fontSize: "14px" }}>{viewingProduct.condicion_venta?.requiere_receta ? "🔒" : "🆓"}</span>
                      {viewingProduct.condicion_venta?.requiere_receta ? "Con Receta" : "Venta Libre"}
                    </span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "999px", background: viewingProduct.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)", color: viewingProduct.estado_logico ? "#22c55e" : "#ef4444", border: `1px solid ${viewingProduct.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: viewingProduct.estado_logico ? "#22c55e" : "#ef4444" }} />
                      {viewingProduct.estado_logico ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>

              {/* ─── Sección: Información General ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Info size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Información General
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Nombre Comercial
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.nombre_comercial || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <HeartPulse size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Nombre Genérico
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.nombre_generico || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Layers size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Unidad de Medida
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.unidad_medida || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Info size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Presentación
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.presentacion || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <AlignLeft size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Composición
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, lineHeight: 1.5 }}>
                        {viewingProduct.composicion || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Sección: Clasificación ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Tag size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Clasificación
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Tag size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Categoría
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.categoria?.nombre_categoria || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Shield size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Condición de Venta
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.condicion_venta
                          ? `${viewingProduct.condicion_venta.requiere_receta ? "🔒" : "🆓"} ${viewingProduct.condicion_venta.nombre}`
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Pill size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Forma Farmacéutica
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.forma_farmaceutica?.nombre || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Route size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Vía de Administración
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.via_administracion?.nombre || "—"}
                      </p>
                    </div>
                  </div>

                  <div style={{ gridColumn: "1 / -1", background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Hash size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Clasificación ATC
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.codigo_atc ? (
                          <span>
                            <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: "8px", background: `${t.accent}15`, border: `1px solid ${t.accent}30`, color: t.accent, fontWeight: 700, marginRight: "8px" }}>
                              {viewingProduct.codigo_atc}
                            </span>
                            {viewingProduct.clasificacion_atc?.descripcion || ""}
                          </span>
                        ) : (
                          "—"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Sección: Precios y Stock ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <DollarSign size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Precios y Stock
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <DollarSign size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Precio de Venta
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: t.accent }}>
                        S/ {Number(viewingProduct.precio_venta).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Coins size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Costo Referencial
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        S/ {Number(viewingProduct.costo_referencial).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Package size={18} color={(Number(viewingProduct.stock_actual) || 0) <= (Number(viewingProduct.stock_minimo_alerta) || 0) ? "#ef4444" : t.accent} />
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Stock Actual
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <p style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                          {Number(viewingProduct.stock_actual) || 0} {viewingProduct.unidad_medida}
                        </p>
                        {(() => {
                          const stockVal = Number(viewingProduct.stock_actual) || 0;
                          const minVal = Number(viewingProduct.stock_minimo_alerta) || 0;
                          if (stockVal === 0) {
                            return (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "999px", background: "rgba(239,68,68,0.12)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Sin Stock
                              </span>
                            );
                          }
                          if (stockVal <= minVal) {
                            return (
                              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "999px", background: "rgba(249,115,22,0.12)", color: "#fb923c", border: "1px solid rgba(249,115,22,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Stock Bajo
                              </span>
                            );
                          }
                          return (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 10px", borderRadius: "999px", background: "rgba(34,197,94,0.12)", color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                              Suficiente
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Archive size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Stock Mínimo de Alerta
                      </p>
                      <p style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        {Number(viewingProduct.stock_minimo_alerta) || 0} {viewingProduct.unidad_medida}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ─── Sección: Fabricación ─── */}
              <div style={{ marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Building2 size={16} color={t.accent} />
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                    Fabricación
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building2 size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Laboratorio Titular
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.laboratorio_titular?.nombre || "—"}
                      </p>
                      {viewingProduct.laboratorio_titular?.pais && (
                        <p style={{ fontSize: "12px", color: t.textMuted }}>
                          {viewingProduct.laboratorio_titular.pais}
                        </p>
                      )}
                    </div>
                  </div>

                  <div style={{ background: t.innerBg, border: `1px solid ${t.border}`, borderRadius: "12px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${t.accent}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Building2 size={18} color={t.accent} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: "11px", fontWeight: 700, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "2px" }}>
                        Fabricante
                      </p>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {viewingProduct.fabricante?.nombre || "—"}
                      </p>
                      {viewingProduct.fabricante?.pais && (
                        <p style={{ fontSize: "12px", color: t.textMuted }}>
                          {viewingProduct.fabricante.pais}
                        </p>
                      )}
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
                        {viewingProduct.fecha_registro
                          ? new Date(viewingProduct.fecha_registro).toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })
                          : "—"}
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
            </div>
          </div>
        </div>
      )}

      {/* ═══ Modal: Eliminar Producto ═══ */}
      {showDeleteModal && productToDelete && (
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
                    Eliminar Producto
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
                    ¿Eliminar "{productToDelete.nombre_comercial}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción desactivará el producto del inventario. Los registros históricos
                    (lotes, compras y ventas) se conservarán.
                  </p>
                </div>
              </div>

              {/* Producto a eliminar */}
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
                <img
                  src={productToDelete.imagen_url || DEFAULT_PRODUCT_IMAGE}
                  alt={productToDelete.nombre_comercial}
                  style={{ width: "44px", height: "44px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${t.border}`, flexShrink: 0 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {productToDelete.nombre_comercial}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary }}>
                    {productToDelete.nombre_generico}
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  {productToDelete.estado_logico ? "Activo" : "Inactivo"}
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

      {showReactivateModal && productToReactivate && (
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
                    Reactivar Producto
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
                    ¿Reactivar "{productToReactivate.nombre_comercial}"?
                  </h3>
                  <p style={{ fontSize: "14px", color: t.textSecondary, lineHeight: 1.5 }}>
                    Esta acción volverá a activar el producto en el inventario para
                    nuevas compras, ventas y lotes.
                  </p>
                </div>
              </div>

              {/* Producto a reactivar */}
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
                <img
                  src={productToReactivate.imagen_url || DEFAULT_PRODUCT_IMAGE}
                  alt={productToReactivate.nombre_comercial}
                  style={{ width: "44px", height: "44px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${t.border}`, flexShrink: 0 }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = DEFAULT_PRODUCT_IMAGE;
                  }}
                />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {productToReactivate.nombre_comercial}
                  </p>
                  <p style={{ fontSize: "12px", color: t.textSecondary }}>
                    {productToReactivate.nombre_generico}
                  </p>
                </div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "5px 10px", borderRadius: "8px", background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.3)", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", flexShrink: 0 }}>
                  <AlertCircle size={12} />
                  Inactivo
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

      {/* Animaciones del modal y toasts */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(20px); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}