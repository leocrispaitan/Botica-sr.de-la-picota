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
  DollarSign,
  AlertTriangle,
  Pill,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
  descripcion: string;
}

interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  ruc: string;
}

interface FormaFarmaceutica {
  id_forma_farmaceutica: number;
  nombre: string;
}

interface CondicionVenta {
  id_condicion_venta: number;
  nombre: string;
  requiere_receta: boolean;
}

interface Producto {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  unidad_medida: string;
  composicion: string;
  presentacion: string;
  precio_venta: number;
  costo_referencial: number;
  stock_minimo_alerta: number;
  stock_actual: number;
  imagen_url: string;
  id_categoria: number;
  id_proveedor: number;
  id_forma_farmaceutica: number;
  id_condicion_venta: number;
  estado_logico: boolean;
  fecha_registro: string;
  categoria?: Categoria;
  proveedor?: Proveedor;
  forma_farmaceutica?: FormaFarmaceutica;
  condicion_venta?: CondicionVenta;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockCategorias: Categoria[] = [
  { id_categoria: 1, nombre_categoria: "ANALGÉSICOS", descripcion: "Medicamentos para el alivio del dolor" },
  { id_categoria: 2, nombre_categoria: "ANTIBIÓTICOS", descripcion: "Medicamentos para tratar infecciones" },
  { id_categoria: 3, nombre_categoria: "VITAMINAS", descripcion: "Suplementos vitamínicos" },
  { id_categoria: 4, nombre_categoria: "ANTIINFLAMATORIOS", descripcion: "Medicamentos antiinflamatorios" },
  { id_categoria: 5, nombre_categoria: "DERMATOLÓGICOS", descripcion: "Productos para la piel" },
];

const mockProveedores: Proveedor[] = [
  { id_proveedor: 1, nombre_proveedor: "DROGUERIA DEL NORTE SAC", ruc: "20456789123" },
  { id_proveedor: 2, nombre_proveedor: "QUÍMICA SUIZA S.A.", ruc: "20567891234" },
  { id_proveedor: 3, nombre_proveedor: "MEDIFARMA S.A.", ruc: "20678912345" },
];

const mockFormasFarmaceuticas: FormaFarmaceutica[] = [
  { id_forma_farmaceutica: 1, nombre: "JARABE" },
  { id_forma_farmaceutica: 2, nombre: "TABLETA" },
  { id_forma_farmaceutica: 3, nombre: "CÁPSULA" },
  { id_forma_farmaceutica: 4, nombre: "CREMA" },
  { id_forma_farmaceutica: 5, nombre: "SUSPENSION" },
  { id_forma_farmaceutica: 6, nombre: "GOTAS" },
];

const mockCondicionesVenta: CondicionVenta[] = [
  { id_condicion_venta: 1, nombre: "Venta Libre", requiere_receta: false },
  { id_condicion_venta: 2, nombre: "Venta Bajo Receta Médica", requiere_receta: true },
];

const mockProductos: Producto[] = [
  {
    id_producto: 1,
    nombre_comercial: "Panadol Jarabe",
    nombre_generico: "Paracetamol",
    unidad_medida: "Frasco",
    composicion: "POR DOSIS 5.00 mL - PARACETAMOL 160.000000 mg",
    presentacion: "Caja de cartón con frasco x 60 mL",
    precio_venta: 12.50,
    costo_referencial: 7.00,
    stock_minimo_alerta: 10,
    stock_actual: 50,
    imagen_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    id_categoria: 1,
    id_proveedor: 1,
    id_forma_farmaceutica: 1,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-01 10:00:00",
    categoria: mockCategorias[0],
    proveedor: mockProveedores[0],
    forma_farmaceutica: mockFormasFarmaceuticas[0],
    condicion_venta: mockCondicionesVenta[0],
  },
  {
    id_producto: 2,
    nombre_comercial: "Amoxil 500",
    nombre_generico: "Amoxicilina",
    unidad_medida: "Caja",
    composicion: "CADA CAPSULA CONTIENE - AMOXICILINA 500 mg",
    presentacion: "Caja con 12 cápsulas",
    precio_venta: 18.00,
    costo_referencial: 11.00,
    stock_minimo_alerta: 15,
    stock_actual: 30,
    imagen_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    id_categoria: 2,
    id_proveedor: 2,
    id_forma_farmaceutica: 3,
    id_condicion_venta: 2,
    estado_logico: true,
    fecha_registro: "2026-08-02 11:30:00",
    categoria: mockCategorias[1],
    proveedor: mockProveedores[1],
    forma_farmaceutica: mockFormasFarmaceuticas[2],
    condicion_venta: mockCondicionesVenta[1],
  },
  {
    id_producto: 3,
    nombre_comercial: "Centrum Adultos",
    nombre_generico: "Multivitamínico",
    unidad_medida: "Caja",
    composicion: "Vitaminas y minerales esenciales",
    presentacion: "Caja con 30 tabletas",
    precio_venta: 45.00,
    costo_referencial: 30.00,
    stock_minimo_alerta: 20,
    stock_actual: 75,
    imagen_url: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    id_categoria: 3,
    id_proveedor: 1,
    id_forma_farmaceutica: 2,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-03 14:15:00",
    categoria: mockCategorias[2],
    proveedor: mockProveedores[0],
    forma_farmaceutica: mockFormasFarmaceuticas[1],
    condicion_venta: mockCondicionesVenta[0],
  },
  {
    id_producto: 4,
    nombre_comercial: "Ibuprofeno 400mg",
    nombre_generico: "Ibuprofeno",
    unidad_medida: "Caja",
    composicion: "CADA TABLETA CONTIENE - IBUPROFENO 400 mg",
    presentacion: "Caja con 20 tabletas",
    precio_venta: 8.50,
    costo_referencial: 4.50,
    stock_minimo_alerta: 25,
    stock_actual: 120,
    imagen_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    id_categoria: 4,
    id_proveedor: 3,
    id_forma_farmaceutica: 2,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-04 09:45:00",
    categoria: mockCategorias[3],
    proveedor: mockProveedores[2],
    forma_farmaceutica: mockFormasFarmaceuticas[1],
    condicion_venta: mockCondicionesVenta[0],
  },
  {
    id_producto: 5,
    nombre_comercial: "Crema Dermatológica",
    nombre_generico: "Hidrocortisona",
    unidad_medida: "Tubo",
    composicion: "HIDROCORTISONA 1%",
    presentacion: "Tubo de 30g",
    precio_venta: 15.00,
    costo_referencial: 9.00,
    stock_minimo_alerta: 12,
    stock_actual: 8,
    imagen_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    id_categoria: 5,
    id_proveedor: 2,
    id_forma_farmaceutica: 4,
    id_condicion_venta: 2,
    estado_logico: true,
    fecha_registro: "2026-08-05 16:20:00",
    categoria: mockCategorias[4],
    proveedor: mockProveedores[1],
    forma_farmaceutica: mockFormasFarmaceuticas[3],
    condicion_venta: mockCondicionesVenta[1],
  },
  {
    id_producto: 6,
    nombre_comercial: "Aspirina 500mg",
    nombre_generico: "Ácido Acetilsalicílico",
    unidad_medida: "Caja",
    composicion: "CADA TABLETA CONTIENE - ÁCIDO ACETILSALICÍLICO 500 mg",
    presentacion: "Caja con 10 tabletas",
    precio_venta: 6.00,
    costo_referencial: 3.50,
    stock_minimo_alerta: 30,
    stock_actual: 95,
    imagen_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    id_categoria: 1,
    id_proveedor: 1,
    id_forma_farmaceutica: 2,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-06 08:30:00",
    categoria: mockCategorias[0],
    proveedor: mockProveedores[0],
    forma_farmaceutica: mockFormasFarmaceuticas[1],
    condicion_venta: mockCondicionesVenta[0],
  },
  {
    id_producto: 7,
    nombre_comercial: "Loratadina 10mg",
    nombre_generico: "Loratadina",
    unidad_medida: "Caja",
    composicion: "CADA TABLETA CONTIENE - LORATADINA 10 mg",
    presentacion: "Caja con 10 tabletas",
    precio_venta: 5.50,
    costo_referencial: 3.00,
    stock_minimo_alerta: 20,
    stock_actual: 65,
    imagen_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    id_categoria: 1,
    id_proveedor: 3,
    id_forma_farmaceutica: 2,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-07 12:00:00",
    categoria: mockCategorias[0],
    proveedor: mockProveedores[2],
    forma_farmaceutica: mockFormasFarmaceuticas[1],
    condicion_venta: mockCondicionesVenta[0],
  },
  {
    id_producto: 8,
    nombre_comercial: "Omeprazol 20mg",
    nombre_generico: "Omeprazol",
    unidad_medida: "Caja",
    composicion: "CADA CÁPSULA CONTIENE - OMEPRAZOL 20 mg",
    presentacion: "Caja con 14 cápsulas",
    precio_venta: 12.00,
    costo_referencial: 7.50,
    stock_minimo_alerta: 15,
    stock_actual: 45,
    imagen_url: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    id_categoria: 1,
    id_proveedor: 2,
    id_forma_farmaceutica: 3,
    id_condicion_venta: 1,
    estado_logico: true,
    fecha_registro: "2026-08-08 10:30:00",
    categoria: mockCategorias[0],
    proveedor: mockProveedores[1],
    forma_farmaceutica: mockFormasFarmaceuticas[2],
    condicion_venta: mockCondicionesVenta[0],
  },
];

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

  const t = getTheme(isDark);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return mockProductos.filter((product) => {
      const matchesSearch =
        product.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria?.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.composicion.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || product.id_categoria === categoryFilter;
      const matchesCondicion = condicionFilter === "all" || product.id_condicion_venta === condicionFilter;
      const matchesStatus = statusFilter === "all" || product.estado_logico === statusFilter;

      return matchesSearch && matchesCategory && matchesCondicion && matchesStatus;
    });
  }, [searchTerm, categoryFilter, condicionFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate total stock value
  const totalStockValue = mockProductos.reduce((sum, p) => sum + (p.precio_venta * p.stock_actual), 0);
  const totalProducts = mockProductos.length;
  const stockCritico = mockProductos.filter(p => p.stock_actual <= p.stock_minimo_alerta).length;

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
                  {mockCategorias.map((cat) => (
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
                  {mockCondicionesVenta.map((cond) => (
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
                  const isStockCritico = product.stock_actual <= product.stock_minimo_alerta;
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
                            src={product.imagen_url}
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
                            <span>S/ {product.precio_venta.toFixed(2)}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: isStockCritico ? "#ef4444" : t.textSecondary }}>
                            <Package size={14} color={isStockCritico ? "#ef4444" : t.textMuted} />
                            <span>
                              Stock: {product.stock_actual} {product.unidad_medida}
                              {isStockCritico && " ⚠️"}
                            </span>
                          </div>
                          <div style={{ fontSize: "11px", color: t.textMuted }}>
                            Costo: S/ {product.costo_referencial.toFixed(2)}
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
                            title="Eliminar producto"
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
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
                            style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
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
    </div>
  );
}
