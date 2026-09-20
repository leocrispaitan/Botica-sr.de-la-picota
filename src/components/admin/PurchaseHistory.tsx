import { useState, useEffect } from "react";
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
  ShoppingBag,
  X,
  Truck,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { purchasesService, type CompraHistorial as Purchase } from "../../services/purchasesService";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { usePurchaseHistoryQuery, usePurchaseDataQuery } from "../../hooks/useAdminQueries";
import {
  exportPurchaseComprobante,
  exportPurchaseHistoryReport,
  type ComprobanteDetail,
} from "../../utils/pdfUtils";
import toast, { Toaster } from "react-hot-toast";

/* ─── Tipo para el detalle completo (getPurchaseById) ────────────────── */
interface PurchaseDetail {
  id_movimiento: number;
  tipo_movimiento: string;
  fecha_hora: string;
  numero_documento: string | null;
  subtotal: number;
  igv: number;
  total: number;
  motivo_ajuste: string | null;
  proveedor: {
    id_proveedor: number;
    nombre_proveedor: string;
    ruc: string;
    telefono: string | null;
    email: string | null;
  } | null;
  usuario: {
    id_usuario: number;
    nombre_completo: string;
    dni: string | null;
  } | null;
  detalle_movimiento: {
    id_detalle_mov: number;
    cantidad: number;
    costo_unitario: number;
    producto: {
      id_producto: number;
      nombre_comercial: string;
      nombre_generico: string;
      unidad_medida: string;
    } | null;
    inventario_lote: {
      id_inventario: number;
      numero_lote: string;
      fecha_vencimiento: string | null;
    } | null;
  }[];
}

/* ─── Estado Badge Colors ───────────────────────────────────────────── */
const getStatusBadgeColors = (status: string, isDark: boolean) => {
  if (status === "COMPRA") {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      icon: "✓",
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
  const itemsPerPage = 10;

  // Filter state (client controls para enviar al servidor)
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | "all">("all");
  const [providerFilter, setProviderFilter] = useState<number | "all">("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal state
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [detailData, setDetailData] = useState<PurchaseDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);

  const t = getTheme(isDark);

  // Debounce de la búsqueda (200ms)
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 200);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Al cambiar el término debounced o filtros, volver a la página 1
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, providerFilter, dateFrom, dateTo]);

  // ═══ Datos desde caché (TanStack Query) ═══
  // Paginación + filtros server-side con keepPreviousData: al cambiar de
  // página o filtros NUNCA se muestra "Cargando...", la tabla anterior
  // permanece visible hasta que llega la respuesta nueva.
  const queryClient = useQueryClient();
  const {
    data: historyData,
    isLoading,
    error: queryError,
  } = usePurchaseHistoryQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch || undefined,
    proveedor: providerFilter === "all" ? undefined : providerFilter,
    desde: dateFrom || undefined,
    hasta: dateTo || undefined,
  });
  const purchases: Purchase[] = historyData?.compras ?? [];
  const totalPages = historyData?.pagination?.totalPages ?? 1;
  const totalCompras = historyData?.stats?.total_compras ?? 0;
  const totalMonto = historyData?.stats?.total_monto ?? 0;
  const totalProductos = historyData?.stats?.total_productos ?? 0;
  const totalProveedores = historyData?.stats?.proveedores ?? 0;
  const loading = isLoading;
  const errorMsg = queryError
    ? queryError instanceof Error
      ? queryError.message
      : "Error al cargar las compras"
    : null;

  // Revalidar la página actual (botones "Reintentar")
  const fetchPurchases = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.purchaseHistory });
  };

  // Proveedores activos (caché ligera) para el dropdown del filtro
  const { data: purchaseData } = usePurchaseDataQuery();
  const [providers, setProviders] = useState<
    { id_proveedor: number; nombre_proveedor: string; ruc: string }[]
  >([]);

  useEffect(() => {
    if (purchaseData?.proveedores) {
      setProviders(purchaseData.proveedores);
    }
  }, [purchaseData]);

  // Proveedores de emergencia desde la página actual si aún no carga la lista
  const pageProviders = Array.from(
    new Map(
      purchases.map((p) => [
        p.proveedor?.id_proveedor ?? 0,
        p.proveedor
          ? { id_proveedor: p.proveedor.id_proveedor, nombre_proveedor: p.proveedor.nombre_proveedor, ruc: p.proveedor.ruc }
          : { id_proveedor: 0, nombre_proveedor: "Sin proveedor", ruc: "-" },
      ])
    ).values()
  );

  const allProviders =
    providers.length > 0
      ? providers
      : (pageProviders as { id_proveedor: number; nombre_proveedor: string; ruc: string }[]);

  // Pagination
  const currentPurchases = purchases;

  // Reset de página al cambiar filtros (sin disparar doble request)
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // ─── Ver detalles: carga completa con lotes/vencimientos vía getPurchaseById ───
  const handleViewDetails = async (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setShowDetailModal(true);
    setDetailLoading(true);
    setDetailError(null);
    setDetailData(null);
    try {
      const full = await purchasesService.getPurchaseById(purchase.id_movimiento);
      setDetailData(full as unknown as PurchaseDetail);
    } catch (err: unknown) {
      setDetailError(
        err instanceof Error ? err.message : "Error al cargar el detalle de la compra"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const [exporting, setExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  // ─── Descargar comprobante PDF (una sola fila) ───
  const handleDownloadComprobante = async (purchase: Purchase) => {
    setDownloadingId(purchase.id_movimiento);
    try {
      const full = await purchasesService.getPurchaseById(purchase.id_movimiento);
      const detail: ComprobanteDetail = {
        id_movimiento: full.id_movimiento,
        numero_documento: full.numero_documento,
        fecha_hora: full.fecha_hora,
        subtotal: Number(full.subtotal || 0),
        igv: Number(full.igv || 0),
        total: Number(full.total || 0),
        proveedor: full.proveedor
          ? {
              nombre_proveedor: full.proveedor.nombre_proveedor,
              ruc: full.proveedor.ruc,
              telefono: (full.proveedor as { telefono?: string | null }).telefono ?? null,
              email: (full.proveedor as { email?: string | null }).email ?? null,
            }
          : null,
        usuario: full.usuario
          ? { nombre_completo: full.usuario.nombre_completo }
          : null,
        detalle_movimiento: (full.detalle_movimiento || []).map((d) => ({
          cantidad: Number(d.cantidad || 0),
          costo_unitario: Number(d.costo_unitario || 0),
          producto: d.producto
            ? {
                nombre_comercial: d.producto.nombre_comercial,
                nombre_generico: (d.producto as { nombre_generico?: string }).nombre_generico,
                unidad_medida: (d.producto as { unidad_medida?: string }).unidad_medida,
              }
            : null,
          inventario_lote: d.inventario_lote
            ? {
                numero_lote: d.inventario_lote.numero_lote,
                fecha_vencimiento: d.inventario_lote.fecha_vencimiento,
              }
            : null,
        })),
      };
      exportPurchaseComprobante(detail);
      toast.success("Comprobante descargado");
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al descargar el comprobante"
      );
    } finally {
      setDownloadingId(null);
    }
  };

  // ─── Exportar reporte PDF (todos los registros con filtros actuales) ───
  const handleExportAll = async () => {
    if (exporting) return;
    setExporting(true);
    const exportingToast = toast.loading("Generando reporte PDF...");
    try {
      const data = await purchasesService.getPurchaseHistory({
        page: 1,
        limit: 1000,
        search: debouncedSearch || undefined,
        proveedor: providerFilter === "all" ? undefined : providerFilter,
        desde: dateFrom || undefined,
        hasta: dateTo || undefined,
      });
      const providerName = allProviders.find(
        (p) => p.id_proveedor === providerFilter
      )?.nombre_proveedor;
      exportPurchaseHistoryReport(
        data.compras,
        data.stats,
        {
          search: debouncedSearch || undefined,
          proveedor:
            providerFilter !== "all" && providerName ? providerName : undefined,
          desde: dateFrom || undefined,
          hasta: dateTo || undefined,
        }
      );
      toast.success(`Se exportaron ${data.compras.length} registros`, {
        id: exportingToast,
      });
    } catch (err: unknown) {
      toast.error(
        err instanceof Error ? err.message : "Error al exportar el reporte",
        { id: exportingToast }
      );
    } finally {
      setExporting(false);
    }
  };

  // ─── Loading state ───
  if (loading) {
    return (
      <div
        style={{
          padding: "24px",
          background: t.mainBg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <Loader2 size={40} color={t.accent} className="animate-spin" />
        <p style={{ fontSize: "16px", color: t.textSecondary }}>
          Cargando historial de compras...
        </p>
      </div>
    );
  }

  // ─── Error state ───
  if (errorMsg) {
    return (
      <div
        style={{
          padding: "24px",
          background: t.mainBg,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <AlertCircle size={40} color="#ef4444" />
        <p style={{ fontSize: "16px", color: "#ef4444", fontWeight: 600 }}>
          {errorMsg}
        </p>
        <button
          onClick={fetchPurchases}
          style={{
            padding: "10px 20px",
            borderRadius: "12px",
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
          }}
        >
          <RefreshCw size={16} />
          Reintentar
        </button>
      </div>
    );
  }

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

        {/* Total Proveedores - Teal Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 40%, #0f766e 100%)",
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
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Proveedores
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                {totalProveedores}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Activos en compras
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
              <Truck size={28} color="#ffffff" strokeWidth={2.5} />
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
              onClick={handleExportAll}
              disabled={exporting}
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: `1px solid ${exporting ? t.accent : t.border}`,
                background: exporting ? `${t.accent}15` : t.inputBg,
                color: exporting ? t.accent : t.textSecondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: exporting ? "pointer" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!exporting) {
                  (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                  (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!exporting) {
                  (e.currentTarget as HTMLButtonElement).style.background = t.inputBg;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                }
              }}
            >
              {exporting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {exporting ? "Exportando..." : "Exportar"}
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
                  <option value="COMPRA">✓ Compra</option>
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
                  {allProviders.map((provider) => (
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
          Mostrando {totalCompras === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalCompras)} de {totalCompras} compras
        </p>
        {totalCompras === 0 && searchTerm && (
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
                  const statusBadge = getStatusBadgeColors("COMPRA", isDark);
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
                              {purchase.numero_documento}
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
                              {purchase.proveedor?.nombre_proveedor ?? "Sin proveedor"}
                            </p>
                          </div>
                          <p style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            RUC: {purchase.proveedor?.ruc ?? "-"}
                          </p>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <Calendar size={14} color={t.textMuted} />
                            <span style={{ fontSize: "13px", color: t.textPrimary }}>
                              {new Date(purchase.fecha_hora).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}
                            </span>
                          </div>
                          <span style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            {new Date(purchase.fecha_hora).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
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
                          {purchase.detalle_movimiento?.length ?? 0}
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
                          COMPRA
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
                            title="Descargar comprobante"
                            onClick={() => handleDownloadComprobante(purchase)}
                            disabled={downloadingId !== null}
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
                              opacity: downloadingId !== null ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (downloadingId === null) {
                                (e.currentTarget as HTMLButtonElement).style.background = "rgba(34, 197, 94, 0.1)";
                                (e.currentTarget as HTMLButtonElement).style.color = "#4ade80";
                              }
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            {downloadingId === purchase.id_movimiento ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Download size={16} />
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
        {totalCompras > 0 && totalPages > 1 && (
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
                  Factura: {selectedPurchase.numero_documento ?? "—"}
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
              {detailLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "60px 20px" }}>
                  <Loader2 size={36} color={t.accent} className="animate-spin" />
                  <p style={{ fontSize: "15px", color: t.textSecondary }}>
                    Cargando detalle de la compra...
                  </p>
                </div>
              ) : detailError ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "60px 20px" }}>
                  <AlertCircle size={36} color="#ef4444" />
                  <p style={{ fontSize: "15px", color: "#ef4444", fontWeight: 600, textAlign: "center" }}>
                    {detailError}
                  </p>
                  <button
                    onClick={() => selectedPurchase && handleViewDetails(selectedPurchase)}
                    style={{
                      padding: "10px 20px",
                      borderRadius: "12px",
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
                    }}
                  >
                    <RefreshCw size={16} />
                    Reintentar
                  </button>
                </div>
              ) : detailData ? (
                <>
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
                        {detailData.proveedor?.nombre_proveedor ?? "Sin proveedor"}
                      </p>
                      <p style={{ fontSize: "13px", color: t.textSecondary }}>
                        RUC: {detailData.proveedor?.ruc ?? "-"}
                      </p>
                      {(detailData.proveedor?.telefono || detailData.proveedor?.email) && (
                        <p style={{ fontSize: "12px", color: t.textSecondary, marginTop: "6px" }}>
                          {detailData.proveedor?.telefono
                            ? `${detailData.proveedor.telefono}${detailData.proveedor?.email ? " · " + detailData.proveedor.email : ""}`
                            : detailData.proveedor?.email}
                        </p>
                      )}
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <User size={18} color={t.accent} />
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                          Registrado Por
                        </p>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                        {detailData.usuario?.nombre_completo ?? "No registrado"}
                      </p>
                      <p style={{ fontSize: "13px", color: t.textSecondary }}>
                        {new Date(detailData.fecha_hora).toLocaleString("es-PE")}
                      </p>
                    </div>

                    <div style={{ padding: "16px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                        <FileText size={18} color={t.accent} />
                        <p style={{ fontSize: "12px", fontWeight: 600, color: t.textSecondary, textTransform: "uppercase" }}>
                          Documento
                        </p>
                      </div>
                      <p style={{ fontSize: "15px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px" }}>
                        {detailData.numero_documento ?? "—"}
                      </p>
                      <p style={{ fontSize: "13px", color: t.textSecondary }}>
                        Tipo: {detailData.tipo_movimiento}
                      </p>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary, marginBottom: "16px" }}>
                      Productos Comprados
                    </h3>
                    <div style={{ background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}`, overflow: "hidden" }}>
                      <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "640px" }}>
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
                            {detailData.detalle_movimiento.map((detail, index) => {
                              const lote = detail.inventario_lote;
                              return (
                                <tr
                                  key={detail.id_detalle_mov}
                                  style={{
                                    borderBottom: index < detailData.detalle_movimiento.length - 1 ? `1px solid ${t.border}` : "none",
                                  }}
                                >
                                  <td style={{ padding: "12px 16px" }}>
                                    <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                                      {detail.producto?.nombre_comercial ?? "Producto no disponible"}
                                    </p>
                                    {detail.producto?.nombre_generico && (
                                      <p style={{ fontSize: "11px", color: t.textSecondary }}>
                                        {detail.producto.nombre_generico}
                                      </p>
                                    )}
                                  </td>
                                  <td style={{ padding: "12px 16px", textAlign: "center" }}>
                                    <span style={{ fontSize: "13px", color: t.textPrimary }}>
                                      {detail.cantidad} {detail.producto?.unidad_medida ?? ""}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                    <span style={{ fontSize: "13px", color: t.textSecondary }}>
                                      S/ {detail.costo_unitario.toFixed(2)}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 16px" }}>
                                    <span style={{ fontSize: "12px", color: t.textSecondary }}>
                                      {lote?.numero_lote ?? "—"}
                                    </span>
                                  </td>
                                  <td style={{ padding: "12px 16px" }}>
                                    {lote?.fecha_vencimiento ? (
                                      <span style={{ fontSize: "12px", color: t.textSecondary }}>
                                        {new Date(lote.fecha_vencimiento).toLocaleDateString("es-PE")}
                                      </span>
                                    ) : (
                                      <span style={{ fontSize: "12px", color: t.textMuted }}>—</span>
                                    )}
                                  </td>
                                  <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                    <span style={{ fontSize: "14px", fontWeight: 700, color: t.accent }}>
                                      S/ {(detail.cantidad * detail.costo_unitario).toFixed(2)}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Totals */}
                  <div style={{ padding: "20px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "14px", color: t.textSecondary }}>Subtotal:</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        S/ {detailData.subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                      <span style={{ fontSize: "14px", color: t.textSecondary }}>IGV (18%):</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        S/ {detailData.igv.toFixed(2)}
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
                        S/ {detailData.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "60px 20px" }}>
                  <p style={{ fontSize: "15px", color: t.textSecondary }}>
                    No se pudo cargar el detalle.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

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
