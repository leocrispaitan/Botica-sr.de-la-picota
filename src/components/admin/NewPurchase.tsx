import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Trash2,
  Package,
  User,
  Calendar,
  DollarSign,
  ShoppingCart,
  AlertCircle,
  Save,
  X,
  FileText,
  Loader2,
  RefreshCw,
  CheckCircle2,
  ShoppingCart as ShoppingCartIcon,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import purchasesService from "../../services/purchasesService";
import type {
  ProductoCompra,
  ProveedorCompra,
  PurchaseItemInput,
} from "../../services/purchasesService";

/* ─── Types ─────────────────────────────────────────────────────── */
interface PurchaseItem {
  id_temporal: string;
  producto: ProductoCompra;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_vencimiento: string;
  lote: string;
}

/* ─── Theme ──────────────────────────────────────────────────────── */
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

/* ─── Toasts ──────────────────────────────────────────────────────── */
const showPurchaseSuccessToast = (
  isDark: boolean,
  total: number
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
              Compra Registrada
            </h3>
            <p style={{ fontSize: "13px", color: isDark ? "#969ba0" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
              La compra se guardó correctamente en el sistema
            </p>
          </div>
        </div>

        <div style={{ background: isDark ? "#1e1d29" : "#f5f6fa", padding: "16px", borderRadius: "12px", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(91, 207, 197, 0.12)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(91, 207, 197, 0.3)", flexShrink: 0 }}>
              <ShoppingCartIcon size={22} color="#5bcfc5" />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "15px", fontWeight: 600, color: isDark ? "#ffffff" : "#3d4465", marginBottom: "2px", fontFamily: "'Cairo', sans-serif" }}>
                Total: S/ {total.toFixed(2)}
              </p>
              <p style={{ fontSize: "12px", color: isDark ? "#828690" : "#787f9e", fontFamily: "'Cairo', sans-serif" }}>
                Stock actualizado automáticamente
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

const showPurchaseErrorToast = (mensaje: string, isDark: boolean) => {
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
              Error
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
            (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(239,68,68,0.1)" : "rgba(239,68,68,0.05)";
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

const showValidationToast = (mensaje: string, isDark: boolean) => {
  toast.custom(
    (t) => (
      <div
        style={{
          background: isDark ? "#212130" : "#ffffff",
          padding: "20px 24px",
          borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          border: `2px solid ${isDark ? "rgba(249, 115, 22, 0.4)" : "rgba(249, 115, 22, 0.25)"}`,
          maxWidth: "400px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          animation: t.visible ? "slideIn 0.4s ease-out forwards" : "slideOut 0.3s ease-in forwards",
        }}
      >
        <AlertCircle size={22} color="#fb923c" style={{ flexShrink: 0 }} />
        <p style={{ fontSize: "14px", fontWeight: 600, color: "#fb923c", fontFamily: "'Cairo', sans-serif", margin: 0 }}>
          {mensaje}
        </p>
      </div>
    ),
    { duration: 4000 }
  );
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  NEW PURCHASE COMPONENT                                            */
/* ═══════════════════════════════════════════════════════════════════ */
export default function NewPurchase({ isDark = true }: { isDark?: boolean }) {
  const [selectedSupplier, setSelectedSupplier] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  // Add product form
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [quantity, setQuantity] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [lote, setLote] = useState("");
  const [searchProduct, setSearchProduct] = useState("");

  // API data
  const [products, setProducts] = useState<ProductoCompra[]>([]);
  const [suppliers, setSuppliers] = useState<ProveedorCompra[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);

  // Submit state
  const [saving, setSaving] = useState(false);

  const t = getTheme(isDark);

  // ─── Fetch products, suppliers from API ───
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    setErrorData(null);
    try {
      const data = await purchasesService.getPurchaseData();
      setProducts(data.productos);
      setSuppliers(data.proveedores);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al cargar datos";
      setErrorData(message);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Calculate totals
  const subtotalGeneral = purchaseItems.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );
  const igv = subtotalGeneral * 0.18;
  const totalGeneral = subtotalGeneral + igv;

  // Add item to purchase
  const handleAddItem = () => {
    if (!selectedProduct || !quantity || !unitPrice || !expirationDate || !lote) {
      showValidationToast("Completa todos los campos del producto", isDark);
      return;
    }

    const product = products.find((p) => p.id_producto === Number(selectedProduct));
    if (!product) return;

    const newItem: PurchaseItem = {
      id_temporal: `temp-${Date.now()}`,
      producto: product,
      cantidad: Number(quantity),
      precio_unitario: Number(unitPrice),
      subtotal: Number(quantity) * Number(unitPrice),
      fecha_vencimiento: expirationDate,
      lote: lote,
    };

    setPurchaseItems([...purchaseItems, newItem]);

    // Reset form
    setSelectedProduct("");
    setQuantity("");
    setUnitPrice("");
    setExpirationDate("");
    setLote("");
    setShowAddProduct(false);
    setSearchProduct("");
  };

  // Remove item
  const handleRemoveItem = (id_temporal: string) => {
    setPurchaseItems(
      purchaseItems.filter((item) => item.id_temporal !== id_temporal)
    );
  };

  // Reset form (without confirmation)
  const resetForm = () => {
    setSelectedSupplier("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setInvoiceNumber("");
    setPurchaseItems([]);
    setShowAddProduct(false);
    setSearchProduct("");
  };

  // Save purchase
  const handleSavePurchase = async () => {
    if (!selectedSupplier) {
      showValidationToast("Selecciona un proveedor", isDark);
      return;
    }
    if (purchaseItems.length === 0) {
      showValidationToast("Agrega al menos un producto a la compra", isDark);
      return;
    }
    if (!invoiceNumber) {
      showValidationToast("Ingresa el número de factura", isDark);
      return;
    }

    setSaving(true);
    try {
      const items: PurchaseItemInput[] = purchaseItems.map((item) => ({
        id_producto: item.producto.id_producto,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        numero_lote: item.lote,
        fecha_vencimiento: item.fecha_vencimiento || null,
      }));

      await purchasesService.createPurchase({
        id_proveedor: Number(selectedSupplier),
        fecha_compra: purchaseDate,
        numero_documento: invoiceNumber,
        items,
        subtotal: subtotalGeneral,
        igv,
        total: totalGeneral,
      });

      showPurchaseSuccessToast(isDark, totalGeneral);
      resetForm();
      // Reload products to get updated stock
      fetchData();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Error al registrar la compra";
      showPurchaseErrorToast(message, isDark);
    } finally {
      setSaving(false);
    }
  };

  // Cancel purchase (with confirmation)
  const handleCancelPurchase = () => {
    if (purchaseItems.length > 0) {
      if (
        !confirm(
          "¿Estás seguro de cancelar? Se perderán todos los datos ingresados."
        )
      ) {
        return;
      }
    }
    resetForm();
  };

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.nombre_comercial.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Auto-fill unit price when product is selected
  const handleProductSelect = (productId: number) => {
    setSelectedProduct(productId);
    const product = products.find((p) => p.id_producto === productId);
    if (product) {
      setUnitPrice(product.costo_referencial.toFixed(2));
    }
  };

  // ─── Loading state ───
  if (loadingData) {
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
          Cargando datos...
        </p>
      </div>
    );
  }

  // ─── Error state ───
  if (errorData) {
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
          {errorData}
        </p>
        <button
          onClick={fetchData}
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
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            color: t.textPrimary,
            marginBottom: "8px",
          }}
        >
          Nueva Compra
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Registra una nueva compra de productos para el inventario
        </p>
      </div>

      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {/* Subtotal - Blue Gradient */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #2c4eff 0%, #3b5beb 40%, #1d3bcd 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(44, 78, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Subtotal
              </p>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "4px",
                  lineHeight: 1,
                }}
              >
                S/ {subtotalGeneral.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {purchaseItems.length}{" "}
                {purchaseItems.length === 1 ? "producto" : "productos"}
              </p>
            </div>
            <div
              style={{
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
              }}
            >
              <ShoppingCart size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* IGV - Green Gradient */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #0f9d58 0%, #16a765 40%, #0b7a44 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 157, 88, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                IGV (18%)
              </p>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "4px",
                  lineHeight: 1,
                }}
              >
                S/ {igv.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Impuesto incluido
              </p>
            </div>
            <div
              style={{
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
              }}
            >
              <FileText size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Total - Purple Gradient */}
        <div
          style={{
            background:
              "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 40%, #6d28d9 100%)",
            borderRadius: "24px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-40px",
              right: "-40px",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  marginBottom: "8px",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Total General
              </p>
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: 700,
                  color: "#ffffff",
                  marginBottom: "4px",
                  lineHeight: 1,
                }}
              >
                S/ {totalGeneral.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Monto final a pagar
              </p>
            </div>
            <div
              style={{
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
              }}
            >
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Form */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.borderCard}`,
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: t.textPrimary,
            marginBottom: "20px",
          }}
        >
          Información de la Compra
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "16px",
          }}
        >
          {/* Supplier */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: t.textSecondary,
                marginBottom: "8px",
              }}
            >
              <User
                size={16}
                style={{
                  display: "inline",
                  marginRight: "6px",
                  verticalAlign: "middle",
                }}
              />
              Proveedor *
            </label>
            <select
              value={selectedSupplier}
              onChange={(e) =>
                setSelectedSupplier(
                  e.target.value ? Number(e.target.value) : ""
                )
              }
              style={{
                width: "100%",
                padding: "12px 14px",
                borderRadius: "14px",
                border: `1px solid ${t.border}`,
                background: t.inputBg,
                color: t.textPrimary,
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: "'Cairo', sans-serif",
                outline: "none",
              }}
            >
              <option value="">Seleccionar proveedor</option>
              {suppliers.map((supplier) => (
                <option
                  key={supplier.id_proveedor}
                  value={supplier.id_proveedor}
                >
                  {supplier.nombre_proveedor} - {supplier.ruc}
                </option>
              ))}
            </select>
          </div>

          {/* Purchase Date */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: t.textSecondary,
                marginBottom: "8px",
              }}
            >
              <Calendar
                size={16}
                style={{
                  display: "inline",
                  marginRight: "6px",
                  verticalAlign: "middle",
                }}
              />
              Fecha de Compra *
            </label>
            <input
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
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

          {/* Invoice Number */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: "13px",
                fontWeight: 600,
                color: t.textSecondary,
                marginBottom: "8px",
              }}
            >
              <FileText
                size={16}
                style={{
                  display: "inline",
                  marginRight: "6px",
                  verticalAlign: "middle",
                }}
              />
              Número de Factura *
            </label>
            <input
              type="text"
              placeholder="Ej: F001-00001234"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
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
      </div>

      {/* Products Section */}
      <div
        style={{
          background: t.cardBg,
          border: `1px solid ${t.borderCard}`,
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2
            style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary }}
          >
            Productos de la Compra
          </h2>

          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            style={{
              padding: "12px 20px",
              borderRadius: "14px",
              border: "none",
              background: showAddProduct ? t.hoverBg : t.accent,
              color: showAddProduct ? t.textPrimary : "#fff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'Cairo', sans-serif",
              transition: "all 0.2s",
              boxShadow: showAddProduct ? "none" : `0 4px 12px ${t.accent}40`,
            }}
            onMouseEnter={(e) => {
              if (!showAddProduct) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  t.accentHover;
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 6px 20px ${t.accent}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!showAddProduct) {
                (e.currentTarget as HTMLButtonElement).style.background =
                  t.accent;
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  `0 4px 12px ${t.accent}40`;
              }
            }}
          >
            {showAddProduct ? <X size={16} /> : <Plus size={16} />}
            {showAddProduct ? "Cancelar" : "Agregar Producto"}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddProduct && (
          <div
            style={{
              padding: "20px",
              background: t.innerBg,
              borderRadius: "16px",
              border: `1px solid ${t.border}`,
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: t.textPrimary,
                marginBottom: "16px",
              }}
            >
              Agregar Nuevo Producto
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                marginBottom: "16px",
              }}
            >
              {/* Product Search */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  <Search
                    size={14}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Buscar Producto *
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {/* Product Select */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  <Package
                    size={14}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Producto *
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => handleProductSelect(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="">Seleccionar producto</option>
                  {filteredProducts.map((product) => (
                    <option
                      key={product.id_producto}
                      value={product.id_producto}
                    >
                      {product.nombre_comercial} - Stock: {product.stock_actual}{" "}
                      {product.unidad_medida}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  Cantidad *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {/* Unit Price */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  <DollarSign
                    size={14}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Precio Unitario *
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {/* Lote */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  Lote *
                </label>
                <input
                  type="text"
                  placeholder="Ej: L2026001"
                  value={lote}
                  onChange={(e) => setLote(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>

              {/* Expiration Date */}
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: t.textSecondary,
                    marginBottom: "6px",
                  }}
                >
                  <Calendar
                    size={14}
                    style={{
                      display: "inline",
                      marginRight: "4px",
                      verticalAlign: "middle",
                    }}
                  />
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Subtotal Preview */}
            {quantity && unitPrice && (
              <div
                style={{
                  padding: "12px 16px",
                  background: `${t.accent}15`,
                  border: `1px solid ${t.accent}40`,
                  borderRadius: "12px",
                  marginBottom: "12px",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: t.textSecondary,
                    marginBottom: "4px",
                  }}
                >
                  Subtotal del producto:
                </p>
                <p
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: t.accent,
                  }}
                >
                  S/ {(Number(quantity) * Number(unitPrice)).toFixed(2)}
                </p>
              </div>
            )}

            <button
              onClick={handleAddItem}
              style={{
                width: "100%",
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: t.accent,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  t.accentHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  t.accent;
              }}
            >
              Agregar a la Compra
            </button>
          </div>
        )}

        {/* Products Table */}
        {purchaseItems.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <Package
              size={48}
              color={t.textMuted}
              style={{ marginBottom: "12px" }}
            />
            <p
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: t.textPrimary,
                marginBottom: "8px",
              }}
            >
              No hay productos agregados
            </p>
            <p style={{ fontSize: "14px", color: t.textSecondary }}>
              Haz clic en "Agregar Producto" para comenzar
            </p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    background: t.innerBg,
                    borderBottom: `1px solid ${t.border}`,
                  }}
                >
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Producto
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Cantidad
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    P. Unitario
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Lote
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Vencimiento
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Subtotal
                  </th>
                  <th
                    style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: 700,
                      color: t.textSecondary,
                      textTransform: "uppercase",
                    }}
                  >
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.map((item, index) => (
                  <tr
                    key={item.id_temporal}
                    style={{
                      borderBottom:
                        index < purchaseItems.length - 1
                          ? `1px solid ${t.border}`
                          : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        t.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background =
                        "transparent";
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: t.textPrimary,
                            marginBottom: "2px",
                          }}
                        >
                          {item.producto.nombre_comercial}
                        </p>
                        <p style={{ fontSize: "12px", color: t.textSecondary }}>
                          {item.producto.unidad_medida}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: t.textPrimary,
                        }}
                      >
                        {item.cantidad}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <span style={{ fontSize: "14px", color: t.textPrimary }}>
                        S/ {item.precio_unitario.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "13px", color: t.textSecondary }}>
                        {item.lote}
                      </span>
                    </td>
                    <td style={{ padding: "16px" }}>
                      <span style={{ fontSize: "13px", color: t.textSecondary }}>
                        {new Date(item.fecha_vencimiento).toLocaleDateString(
                          "es-PE"
                        )}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 700,
                          color: t.accent,
                        }}
                      >
                        S/ {item.subtotal.toFixed(2)}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <button
                        onClick={() => handleRemoveItem(item.id_temporal)}
                        title="Eliminar producto"
                        style={{
                          padding: "8px",
                          borderRadius: "8px",
                          border: "none",
                          background: "transparent",
                          color: t.textSecondary,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "rgba(239,68,68,0.1)";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            "#ef4444";
                        }}
                        onMouseLeave={(e) => {
                          (
                            e.currentTarget as HTMLButtonElement
                          ).style.background = "transparent";
                          (e.currentTarget as HTMLButtonElement).style.color =
                            t.textSecondary;
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Warning Alert */}
      {purchaseItems.length > 0 && !selectedSupplier && (
        <div
          style={{
            padding: "16px 20px",
            background: "rgba(249, 115, 22, 0.1)",
            border: "1px solid rgba(249, 115, 22, 0.3)",
            borderRadius: "16px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <AlertCircle size={20} color="#fb923c" />
          <p
            style={{ fontSize: "14px", color: "#fb923c", fontWeight: 600 }}
          >
            Debes seleccionar un proveedor antes de guardar la compra
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={handleCancelPurchase}
          disabled={saving}
          style={{
            padding: "14px 28px",
            borderRadius: "14px",
            border: `1px solid ${t.border}`,
            background: t.cardBg,
            color: t.textSecondary,
            fontSize: "14px",
            fontWeight: 600,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
            opacity: saving ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!saving) {
              (e.currentTarget as HTMLButtonElement).style.background =
                t.hoverBg;
              (e.currentTarget as HTMLButtonElement).style.color =
                t.textPrimary;
            }
          }}
          onMouseLeave={(e) => {
            if (!saving) {
              (e.currentTarget as HTMLButtonElement).style.background =
                t.cardBg;
              (e.currentTarget as HTMLButtonElement).style.color =
                t.textSecondary;
            }
          }}
        >
          <X
            size={16}
            style={{
              display: "inline",
              marginRight: "6px",
              verticalAlign: "middle",
            }}
          />
          Cancelar
        </button>

        <button
          onClick={handleSavePurchase}
          disabled={
            !selectedSupplier || purchaseItems.length === 0 || saving
          }
          style={{
            padding: "14px 28px",
            borderRadius: "14px",
            border: "none",
            background:
              !selectedSupplier || purchaseItems.length === 0 || saving
                ? t.textMuted
                : t.accent,
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor:
              !selectedSupplier || purchaseItems.length === 0 || saving
                ? "not-allowed"
                : "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
            boxShadow:
              !selectedSupplier || purchaseItems.length === 0 || saving
                ? "none"
                : `0 4px 12px ${t.accent}40`,
            opacity:
              !selectedSupplier || purchaseItems.length === 0 || saving
                ? 0.5
                : 1,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            if (selectedSupplier && purchaseItems.length > 0 && !saving) {
              (e.currentTarget as HTMLButtonElement).style.background =
                t.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 6px 20px ${t.accent}50`;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedSupplier && purchaseItems.length > 0 && !saving) {
              (e.currentTarget as HTMLButtonElement).style.background =
                t.accent;
              (e.currentTarget as HTMLButtonElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                `0 4px 12px ${t.accent}40`;
            }
          }}
        >
          {saving ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          {saving ? "Guardando..." : "Guardar Compra"}
        </button>
      </div>

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
