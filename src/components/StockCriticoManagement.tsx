import { useState, useMemo } from "react";
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
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Categoria {
  id_categoria: number;
  nombre_categoria: string;
}

interface ProductoStockCritico {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  imagen_url: string;
  precio_venta: number;
  stock_actual: number;
  stock_minimo_alerta: number;
  diferencia: number;
  porcentaje_disponible: number;
  nivel_criticidad: "critico" | "bajo" | "alerta";
  id_categoria: number;
  categoria?: Categoria;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockProductosStockCritico: ProductoStockCritico[] = [
  {
    id_producto: 5,
    nombre_comercial: "Crema Dermatológica",
    nombre_generico: "Hidrocortisona",
    imagen_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    precio_venta: 15.00,
    stock_actual: 8,
    stock_minimo_alerta: 12,
    diferencia: -4,
    porcentaje_disponible: 66.7,
    nivel_criticidad: "alerta",
    id_categoria: 5,
    categoria: { id_categoria: 5, nombre_categoria: "DERMATOLÓGICOS" },
  },
  {
    id_producto: 9,
    nombre_comercial: "Acetaminofén 500mg",
    nombre_generico: "Paracetamol",
    imagen_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop",
    precio_venta: 5.50,
    stock_actual: 5,
    stock_minimo_alerta: 20,
    diferencia: -15,
    porcentaje_disponible: 25,
    nivel_criticidad: "critico",
    id_categoria: 1,
    categoria: { id_categoria: 1, nombre_categoria: "ANALGÉSICOS" },
  },
  {
    id_producto: 10,
    nombre_comercial: "Amoxicilina 875mg",
    nombre_generico: "Amoxicilina",
    imagen_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    precio_venta: 22.00,
    stock_actual: 3,
    stock_minimo_alerta: 15,
    diferencia: -12,
    porcentaje_disponible: 20,
    nivel_criticidad: "critico",
    id_categoria: 2,
    categoria: { id_categoria: 2, nombre_categoria: "ANTIBIÓTICOS" },
  },
  {
    id_producto: 11,
    nombre_comercial: "Vitamina C 1000mg",
    nombre_generico: "Ácido Ascórbico",
    imagen_url: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    precio_venta: 35.00,
    stock_actual: 14,
    stock_minimo_alerta: 20,
    diferencia: -6,
    porcentaje_disponible: 70,
    nivel_criticidad: "alerta",
    id_categoria: 3,
    categoria: { id_categoria: 3, nombre_categoria: "VITAMINAS" },
  },
  {
    id_producto: 12,
    nombre_comercial: "Diclofenaco 50mg",
    nombre_generico: "Diclofenaco Sódico",
    imagen_url: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop",
    precio_venta: 9.50,
    stock_actual: 7,
    stock_minimo_alerta: 25,
    diferencia: -18,
    porcentaje_disponible: 28,
    nivel_criticidad: "critico",
    id_categoria: 4,
    categoria: { id_categoria: 4, nombre_categoria: "ANTIINFLAMATORIOS" },
  },
  {
    id_producto: 13,
    nombre_comercial: "Ranitidina 150mg",
    nombre_generico: "Ranitidina",
    imagen_url: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400&h=400&fit=crop",
    precio_venta: 8.00,
    stock_actual: 10,
    stock_minimo_alerta: 18,
    diferencia: -8,
    porcentaje_disponible: 55.6,
    nivel_criticidad: "bajo",
    id_categoria: 1,
    categoria: { id_categoria: 1, nombre_categoria: "ANALGÉSICOS" },
  },
  {
    id_producto: 14,
    nombre_comercial: "Clotrimazol Crema",
    nombre_generico: "Clotrimazol",
    imagen_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
    precio_venta: 12.50,
    stock_actual: 4,
    stock_minimo_alerta: 10,
    diferencia: -6,
    porcentaje_disponible: 40,
    nivel_criticidad: "bajo",
    id_categoria: 5,
    categoria: { id_categoria: 5, nombre_categoria: "DERMATOLÓGICOS" },
  },
  {
    id_producto: 15,
    nombre_comercial: "Metformina 850mg",
    nombre_generico: "Metformina",
    imagen_url: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=400&fit=crop",
    precio_venta: 18.00,
    stock_actual: 2,
    stock_minimo_alerta: 30,
    diferencia: -28,
    porcentaje_disponible: 6.7,
    nivel_criticidad: "critico",
    id_categoria: 2,
    categoria: { id_categoria: 2, nombre_categoria: "ANTIBIÓTICOS" },
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

export default function StockCriticoManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [criticidadFilter, setCriticidadFilter] = useState<string | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 6;

  const t = getTheme(isDark);

  const filteredProductos = useMemo(() => {
    return mockProductosStockCritico.filter((prod) => {
      const matchesSearch =
        prod.nombre_comercial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.nombre_generico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.categoria?.nombre_categoria.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCriticidad = criticidadFilter === "all" || prod.nivel_criticidad === criticidadFilter;

      return matchesSearch && matchesCriticidad;
    });
  }, [searchTerm, criticidadFilter]);

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = filteredProductos.slice(startIndex, endIndex);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const totalProductos = mockProductosStockCritico.length;
  const criticos = mockProductosStockCritico.filter(p => p.nivel_criticidad === "critico").length;
  const bajos = mockProductosStockCritico.filter(p => p.nivel_criticidad === "bajo").length;
  const alertas = mockProductosStockCritico.filter(p => p.nivel_criticidad === "alerta").length;
  const valorEnRiesgo = mockProductosStockCritico.reduce((sum, p) => sum + (p.precio_venta * p.stock_actual), 0);

  const getNivelCriticidadColors = (nivel: string) => {
    if (nivel === "critico") return { bg: "rgba(239,68,68,0.1)", text: "#ef4444", border: "rgba(239,68,68,0.3)", icon: "🔴" };
    if (nivel === "bajo") return { bg: "rgba(245,158,11,0.1)", text: "#f59e0b", border: "rgba(245,158,11,0.3)", icon: "🟡" };
    return { bg: "rgba(249,115,22,0.1)", text: "#fb923c", border: "rgba(249,115,22,0.3)", icon: "🟠" };
  };

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
              <input type="text" placeholder="Buscar producto crítico..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "12px 14px 12px 44px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textPrimary, fontSize: "14px", outline: "none" }} />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${showFilters ? t.accent : t.border}`, background: showFilters ? `${t.accent}15` : t.inputBg, color: showFilters ? t.accent : t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <Filter size={16} />Filtros
            </button>
            <button style={{ padding: "12px 20px", borderRadius: "14px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textSecondary, fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              <RefreshCw size={16} />Actualizar
            </button>
            <button style={{ padding: "12px 20px", borderRadius: "14px", border: "none", background: t.accent, color: "#fff", fontSize: "14px", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", boxShadow: `0 4px 12px ${t.accent}40` }}>
              <ShoppingCart size={16} />Generar Orden
            </button>
          </div>
          {showFilters && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", padding: "16px", background: t.innerBg, borderRadius: "12px", border: `1px solid ${t.border}` }}>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>Nivel de Criticidad</label>
                <select value={criticidadFilter} onChange={(e) => { setCriticidadFilter(e.target.value); handleFilterChange(); }} style={{ width: "100%", padding: "8px 12px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.cardBg, color: t.textPrimary, fontSize: "13px", cursor: "pointer" }}>
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

      <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500, marginBottom: "16px" }}>Mostrando {startIndex + 1}-{Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length} productos</p>

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
              {currentProductos.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "60px 20px", textAlign: "center" }}><Search size={48} color={t.textMuted} /><p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginTop: "12px" }}>No se encontraron productos</p></td></tr>
              ) : (
                currentProductos.map((prod, index) => {
                  const nivelColors = getNivelCriticidadColors(prod.nivel_criticidad);
                  return (
                    <tr key={prod.id_producto} style={{ borderBottom: index < currentProductos.length - 1 ? `1px solid ${t.border}` : "none" }}>
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img src={prod.imagen_url} alt={prod.nombre_comercial} style={{ width: "50px", height: "50px", borderRadius: "10px", objectFit: "cover", border: `2px solid ${t.border}`, flexShrink: 0 }} />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px" }}>{prod.nombre_comercial}</p>
                            <p style={{ fontSize: "12px", color: t.textSecondary }}>{prod.nombre_generico}</p>
                            <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "4px", padding: "2px 8px", borderRadius: "6px", background: `${t.accent}10`, fontSize: "10px", fontWeight: 600, color: t.accent }}>
                              {prod.categoria?.nombre_categoria}
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
                            <div style={{ width: `${prod.porcentaje_disponible}%`, height: "100%", background: nivelColors.text, transition: "width 0.3s" }} />
                          </div>
                          <span style={{ fontSize: "10px", color: t.textMuted }}>{prod.porcentaje_disponible.toFixed(0)}% disponible</span>
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
                          <button title="Ver detalles" style={{ padding: "8px", borderRadius: "8px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><Eye size={16} /></button>
                          <button title="Reponer" style={{ padding: "8px 12px", borderRadius: "8px", border: "none", background: t.accent, color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
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
    </div>
  );
}
