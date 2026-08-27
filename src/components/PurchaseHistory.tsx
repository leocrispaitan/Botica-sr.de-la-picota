import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  Calendar,
  Package,
  DollarSign,
  User,
  ChevronLeft,
  ChevronRight,
  FileText,
  TrendingUp,
  ShoppingBag,
  X,
  Truck,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface PurchaseDetail {
  id_detalle: number;
  nombre_producto: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  numero_lote: string;
  fecha_vencimiento: string;
}

interface Purchase {
  id_movimiento: number;
  fecha_compra: string;
  numero_factura: string;
  proveedor: {
    id_proveedor: number;
    nombre_proveedor: string;
    ruc: string;
  };
  usuario: {
    id_usuario: number;
    nombre_completo: string;
  };
  subtotal: number;
  igv: number;
  total: number;
  cantidad_productos: number;
  estado: "REGISTRADA" | "RECIBIDA" | "CANCELADA";
  detalles: PurchaseDetail[];
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockPurchases: Purchase[] = [
  {
    id_movimiento: 1,
    fecha_compra: "2026-08-27 10:30:00",
    numero_factura: "F001-00001234",
    proveedor: {
      id_proveedor: 1,
      nombre_proveedor: "Distribuidora Farmacéutica Lima S.A.",
      ruc: "20123456789",
    },
    usuario: {
      id_usuario: 3,
      nombre_completo: "Roberto Silva Vargas",
    },
    subtotal: 1500.00,
    igv: 270.00,
    total: 1770.00,
    cantidad_productos: 5,
    estado: "RECIBIDA",
    detalles: [
      {
        id_detalle: 1,
        nombre_producto: "Paracetamol 500mg",
        cantidad: 500,
        precio_unitario: 0.50,
        subtotal: 250.00,
        numero_lote: "L2026001",
        fecha_vencimiento: "2027-12-31",
      },
      {
        id_detalle: 2,
        nombre_producto: "Ibuprofeno 400mg",
        cantidad: 300,
        precio_unitario: 0.80,
        subtotal: 240.00,
        numero_lote: "L2026002",
        fecha_vencimiento: "2027-11-30",
      },
      {
        id_detalle: 3,
        nombre_producto: "Amoxicilina 500mg",
        cantidad: 200,
        precio_unitario: 1.20,
        subtotal: 240.00,
        numero_lote: "L2026003",
        fecha_vencimiento: "2027-10-31",
      },
      {
        id_detalle: 4,
        nombre_producto: "Omeprazol 20mg",
        cantidad: 400,
        precio_unitario: 1.50,
        subtotal: 600.00,
        numero_lote: "L2026004",
        fecha_vencimiento: "2028-01-31",
      },
      {
        id_detalle: 5,
        nombre_producto: "Loratadina 10mg",
        cantidad: 300,
        precio_unitario: 0.60,
        subtotal: 180.00,
        numero_lote: "L2026005",
        fecha_vencimiento: "2027-09-30",
      },
    ],
  },
  {
    id_movimiento: 2,
    fecha_compra: "2026-08-25 14:15:00",
    numero_factura: "F001-00001220",
    proveedor: {
      id_proveedor: 2,
      nombre_proveedor: "MediFarma Distribuciones",
      ruc: "20987654321",
    },
    usuario: {
      id_usuario: 3,
      nombre_completo: "Roberto Silva Vargas",
    },
    subtotal: 2800.00,
    igv: 504.00,
    total: 3304.00,
    cantidad_productos: 4,
    estado: "RECIBIDA",
    detalles: [
      {
        id_detalle: 6,
        nombre_producto: "Salbutamol Inhalador 100mcg",
        cantidad: 50,
        precio_unitario: 25.00,
        subtotal: 1250.00,
        numero_lote: "L2026006",
        fecha_vencimiento: "2027-08-31",
      },
      {
        id_detalle: 7,
        nombre_producto: "Metformina 850mg",
        cantidad: 600,
        precio_unitario: 0.90,
        subtotal: 540.00,
        numero_lote: "L2026007",
        fecha_vencimiento: "2028-02-28",
      },
      {
        id_detalle: 8,
        nombre_producto: "Atorvastatina 20mg",
        cantidad: 400,
        precio_unitario: 1.80,
        subtotal: 720.00,
        numero_lote: "L2026008",
        fecha_vencimiento: "2027-12-31",
      },
      {
        id_detalle: 9,
        nombre_producto: "Losartán 50mg",
        cantidad: 350,
        precio_unitario: 0.85,
        subtotal: 297.50,
        numero_lote: "L2026009",
        fecha_vencimiento: "2027-11-30",
      },
    ],
  },
  {
    id_movimiento: 3,
    fecha_compra: "2026-08-22 09:00:00",
    numero_factura: "F001-00001198",
    proveedor: {
      id_proveedor: 3,
      nombre_proveedor: "Droguería El Sol",
      ruc: "20456789123",
    },
    usuario: {
      id_usuario: 1,
      nombre_completo: "Juan Pérez Gómez",
    },
    subtotal: 950.00,
    igv: 171.00,
    total: 1121.00,
    cantidad_productos: 3,
    estado: "REGISTRADA",
    detalles: [
      {
        id_detalle: 10,
        nombre_producto: "Diclofenaco 50mg",
        cantidad: 400,
        precio_unitario: 0.70,
        subtotal: 280.00,
        numero_lote: "L2026010",
        fecha_vencimiento: "2027-10-31",
      },
      {
        id_detalle: 11,
        nombre_producto: "Ranitidina 150mg",
        cantidad: 300,
        precio_unitario: 0.90,
        subtotal: 270.00,
        numero_lote: "L2026011",
        fecha_vencimiento: "2027-09-30",
      },
      {
        id_detalle: 12,
        nombre_producto: "Ciprofloxacino 500mg",
        cantidad: 200,
        precio_unitario: 2.00,
        subtotal: 400.00,
        numero_lote: "L2026012",
        fecha_vencimiento: "2028-03-31",
      },
    ],
  },
  {
    id_movimiento: 4,
    fecha_compra: "2026-08-20 16:45:00",
    numero_factura: "F001-00001185",
    proveedor: {
      id_proveedor: 1,
      nombre_proveedor: "Distribuidora Farmacéutica Lima S.A.",
      ruc: "20123456789",
    },
    usuario: {
      id_usuario: 3,
      nombre_completo: "Roberto Silva Vargas",
    },
    subtotal: 1200.00,
    igv: 216.00,
    total: 1416.00,
    cantidad_productos: 4,
    estado: "RECIBIDA",
    detalles: [
      {
        id_detalle: 13,
        nombre_producto: "Captopril 25mg",
        cantidad: 500,
        precio_unitario: 0.60,
        subtotal: 300.00,
        numero_lote: "L2026013",
        fecha_vencimiento: "2027-11-30",
      },
      {
        id_detalle: 14,
        nombre_producto: "Enalapril 10mg",
        cantidad: 400,
        precio_unitario: 0.75,
        subtotal: 300.00,
        numero_lote: "L2026014",
        fecha_vencimiento: "2028-01-31",
      },
      {
        id_detalle: 15,
        nombre_producto: "Hidroclorotiazida 25mg",
        cantidad: 600,
        precio_unitario: 0.50,
        subtotal: 300.00,
        numero_lote: "L2026015",
        fecha_vencimiento: "2027-12-31",
      },
      {
        id_detalle: 16,
        nombre_producto: "Amlodipino 5mg",
        cantidad: 400,
        precio_unitario: 0.75,
        subtotal: 300.00,
        numero_lote: "L2026016",
        fecha_vencimiento: "2028-02-28",
      },
    ],
  },
  {
    id_movimiento: 5,
    fecha_compra: "2026-08-18 11:20:00",
    numero_factura: "F001-00001172",
    proveedor: {
      id_proveedor: 4,
      nombre_proveedor: "Farmacéutica Universal",
      ruc: "20654321987",
    },
    usuario: {
      id_usuario: 3,
      nombre_completo: "Roberto Silva Vargas",
    },
    subtotal: 750.00,
    igv: 135.00,
    total: 885.00,
    cantidad_productos: 2,
    estado: "RECIBIDA",
    detalles: [
      {
        id_detalle: 17,
        nombre_producto: "Acetilcisteína 600mg",
        cantidad: 300,
        precio_unitario: 1.50,
        subtotal: 450.00,
        numero_lote: "L2026017",
        fecha_vencimiento: "2027-10-31",
      },
      {
        id_detalle: 18,
        nombre_producto: "Dextrometorfano Jarabe",
        cantidad: 100,
        precio_unitario: 3.00,
        subtotal: 300.00,
        numero_lote: "L2026018",
        fecha_vencimiento: "2027-09-30",
      },
    ],
  },
];

/* ─── Estado Badge Colors ───────────────────────────────────────────── */
const getStatusBadgeColors = (status: string, isDark: boolean) => {
  if (status === "RECIBIDA") {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      icon: "✓",
    };
  }
  if (status === "REGISTRADA") {
    return {
      bg: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.08)",
      text: "#fb923c",
      border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)",
      icon: "⏳",
    };
  }
  if (status === "CANCELADA") {
    return {
      bg: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)",
      text: "#ef4444",
      border: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)",
      icon: "✗",
    };
  }
  return {
    bg: isDark ? "rgba(91, 207, 197, 0.12)" : "rgba(91, 207, 197, 0.08)",
    text: "#5bcfc5",
    border: isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.25)",
    icon: "•",
  };
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
/*  PURCHASE HISTORY COMPONENT                                         */
/* ═══════════════════════════════════════════════════════════════════ */
export default function PurchaseHistory({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [providerFilter, setProviderFilter] = useState<number | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const itemsPerPage = 10;

  const t = getTheme(isDark);

  // Get unique providers
  const providers = Array.from(
    new Set(mockPurchases.map((p) => JSON.stringify(p.proveedor)))
  ).map((p) => JSON.parse(p));

  // Filtered purchases
  const filteredPurchases = useMemo(() => {
    return mockPurchases.filter((purchase) => {
      const matchesSearch =
        purchase.numero_factura.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.proveedor.nombre_proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        purchase.proveedor.ruc.includes(searchTerm);

      const matchesStatus = statusFilter === "all" || purchase.estado === statusFilter;
      const matchesProvider = providerFilter === "all" || purchase.proveedor.id_proveedor === providerFilter;

      let matchesDate = true;
      const purchaseDate = new Date(purchase.fecha_compra);
      if (dateFrom) {
        matchesDate = matchesDate && purchaseDate >= new Date(dateFrom);
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && purchaseDate <= toDate;
      }

      return matchesSearch && matchesStatus && matchesProvider && matchesDate;
    });
  }, [searchTerm, statusFilter, providerFilter, dateFrom, dateTo]);

  // Pagination
  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPurchases = filteredPurchases.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate totals
  const totalCompras = filteredPurchases.length;
  const totalMonto = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalProductos = filteredPurchases.reduce((sum, p) => sum + p.cantidad_productos, 0);

  // View purchase details
  const handleViewDetails = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Historial de Compras
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Visualiza y gestiona todas las compras realizadas
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Compras - Blue Gradient */}
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
                Total Compras
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {totalCompras}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Registros encontrados
              </p>
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
              <ShoppingBag size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Total Monto - Green Gradient */}
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
                Monto Total
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                S/ {totalMonto.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Inversión realizada
              </p>
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

        {/* Total Productos - Purple Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 40%, #6d28d9 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
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
                Productos Comprados
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {totalProductos}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Ítems diferentes
              </p>
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
              <Package size={28} color="#ffffff" strokeWidth={2.5} />
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
                placeholder="Buscar por factura, proveedor o RUC..."
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
              {(statusFilter !== "all" || providerFilter !== "all" || dateFrom || dateTo) && (
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
                  {(statusFilter !== "all" ? 1 : 0) + (providerFilter !== "all" ? 1 : 0) + (dateFrom ? 1 : 0) + (dateTo ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Export Button */}
            <button
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: `1px solid ${t.border}`,
                background: t.inputBg,
                color: t.textSecondary,
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
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.inputBg;
                (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
              }}
            >
              <Download size={16} />
              Exportar
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
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
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
                  <option value="RECIBIDA">✓ Recibida</option>
                  <option value="REGISTRADA">⏳ Registrada</option>
                  <option value="CANCELADA">✗ Cancelada</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Proveedor
                </label>
                <select
                  value={providerFilter}
                  onChange={(e) => {
                    setProviderFilter(e.target.value === "all" ? "all" : Number(e.target.value));
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
                  <option value="all">Todos los proveedores</option>
                  {providers.map((provider) => (
                    <option key={provider.id_proveedor} value={provider.id_proveedor}>
                      {provider.nombre_proveedor}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Fecha Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
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
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Fecha Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
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
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {(statusFilter !== "all" || providerFilter !== "all" || dateFrom || dateTo) && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setStatusFilter("all");
                      setProviderFilter("all");
                      setDateFrom("");
                      setDateTo("");
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredPurchases.length)} de {filteredPurchases.length} compras
        </p>
        {filteredPurchases.length === 0 && searchTerm && (
          <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
            No se encontraron resultados para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Purchases Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Factura
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Proveedor
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Fecha
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Productos
                </th>
                <th style={{ padding: "16px 20px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Total
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
              {currentPurchases.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <Search size={48} color={t.textMuted} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                        No se encontraron compras
                      </p>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentPurchases.map((purchase, index) => {
                  const statusBadge = getStatusBadgeColors(purchase.estado, isDark);
                  return (
                    <tr
                      key={purchase.id_movimiento}
                      style={{
                        borderBottom: index < currentPurchases.length - 1 ? `1px solid ${t.border}` : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                      }}
                    >
                      {/* Factura */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div
                            style={{
                              width: "36px",
                              height: "36px",
                              borderRadius: "10px",
                              background: `${t.accent}15`,
                              border: `1px solid ${t.accent}30`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            <FileText size={18} color={t.accent} />
                          </div>
                          <div>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px" }}>
                              {purchase.numero_factura}
                            </p>
                            <p style={{ fontSize: "12px", color: t.textSecondary }}>
                              ID: #{purchase.id_movimiento}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Proveedor */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Truck size={14} color={t.textMuted} />
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                              {purchase.proveedor.nombre_proveedor}
                            </p>
                          </div>
                          <p style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            RUC: {purchase.proveedor.ruc}
                          </p>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} color={t.textMuted} />
                            <span style={{ fontSize: "13px", color: t.textPrimary }}>
                              {new Date(purchase.fecha_compra).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            {new Date(purchase.fecha_compra).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Productos */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
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
                          {purchase.cantidad_productos}
                        </span>
                      </td>

                      {/* Total */}
                      <td style={{ padding: "16px 20px", textAlign: "right" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", alignItems: "flex-end" }}>
                          <span style={{ fontSize: "16px", fontWeight: 700, color: t.accent }}>
                            S/ {purchase.total.toFixed(2)}
                          </span>
                          <span style={{ fontSize: "11px", color: t.textSecondary }}>
                            IGV: S/ {purchase.igv.toFixed(2)}
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
                            background: statusBadge.bg,
                            color: statusBadge.text,
                            border: `1px solid ${statusBadge.border}`,
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: "12px" }}>{statusBadge.icon}</span>
                          {purchase.estado}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button
                            onClick={() => handleViewDetails(purchase)}
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
                            title="Descargar factura"
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
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(34, 197, 94, 0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Download size={16} />
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
        {filteredPurchases.length > 0 && (
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
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let page;
                  if (totalPages <= 5) {
                    page = i + 1;
                  } else if (currentPage <= 3) {
                    page = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i;
                  } else {
                    page = currentPage - 2 + i;
                  }
                  
                  return (
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
                  );
                })}
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

      {/* Detail Modal */}
      {showDetailModal && selectedPurchase && (
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
            onClick={() => setShowDetailModal(false)}
          />

          {/* Modal */}
          <div
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: "900px",
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
                  Detalle de Compra
                </h2>
                <p style={{ fontSize: "13px", color: t.textSecondary }}>
                  Factura: {selectedPurchase.numero_factura}
                </p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
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
              {/* Purchase Info */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px", marginBottom: "24px" }}>
                <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <Truck size={18} color={t.accent} />
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                      Proveedor
                    </p>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                    {selectedPurchase.proveedor.nombre_proveedor}
                  </p>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    RUC: {selectedPurchase.proveedor.ruc}
                  </p>
                </div>

                <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                    <User size={18} color={t.accent} />
                    <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                      Registrado Por
                    </p>
                  </div>
                  <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                    {selectedPurchase.usuario.nombre_completo}
                  </p>
                  <p style={{ fontSize: "13px", color: t.textSecondary }}>
                    {new Date(selectedPurchase.fecha_compra).toLocaleString("es-PE")}
                  </p>
                </div>
              </div>

              {/* Products Table */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary, marginBottom: "16px" }}>
                  Productos Comprados
                </h3>
                <div style={{ background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ background: t.cardBg, borderBottom: `1px solid ${t.border}` }}>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Producto
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Cantidad
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          P. Unit.
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Lote
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Vencimiento
                        </th>
                        <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "11px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPurchase.detalles.map((detail, index) => (
                        <tr
                          key={detail.id_detalle}
                          style={{
                            borderBottom: index < selectedPurchase.detalles.length - 1 ? `1px solid ${t.border}` : "none",
                          }}
                        >
                          <td style={{ padding: "12px 16px" }}>
                            <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                              {detail.nombre_producto}
                            </p>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "center" }}>
                            <span style={{ fontSize: "13px", color: t.textPrimary }}>
                              {detail.cantidad}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <span style={{ fontSize: "13px", color: t.textSecondary }}>
                              S/ {detail.precio_unitario.toFixed(2)}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: "12px", color: t.textSecondary }}>
                              {detail.numero_lote}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ fontSize: "12px", color: t.textSecondary }}>
                              {new Date(detail.fecha_vencimiento).toLocaleDateString("es-PE")}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <span style={{ fontSize: "14px", fontWeight: 700, color: t.accent }}>
                              S/ {detail.subtotal.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div style={{ padding: "20px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: t.textSecondary }}>Subtotal:</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                    S/ {selectedPurchase.subtotal.toFixed(2)}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: t.textSecondary }}>IGV (18%):</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                    S/ {selectedPurchase.igv.toFixed(2)}
                  </span>
                </div>
                <div
                  style={{
                    borderTop: `1px solid ${t.border}`,
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>Total:</span>
                  <span style={{ fontSize: "18px", fontWeight: 700, color: t.accent }}>
                    S/ {selectedPurchase.total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
