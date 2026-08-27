import { useState } from "react";
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
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Product {
  id_producto: number;
  nombre_producto: string;
  precio_unitario: number;
  stock_actual: number;
  unidad_medida: string;
}

interface PurchaseItem {
  id_temporal: string;
  producto: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  fecha_vencimiento: string;
  lote: string;
}

interface Supplier {
  id_proveedor: number;
  nombre_proveedor: string;
  ruc: string;
  telefono: string;
  email: string;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockProducts: Product[] = [
  {
    id_producto: 1,
    nombre_producto: "Paracetamol 500mg",
    precio_unitario: 0.5,
    stock_actual: 150,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 2,
    nombre_producto: "Ibuprofeno 400mg",
    precio_unitario: 0.8,
    stock_actual: 200,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 3,
    nombre_producto: "Amoxicilina 500mg",
    precio_unitario: 1.2,
    stock_actual: 80,
    unidad_medida: "Cápsula",
  },
  {
    id_producto: 4,
    nombre_producto: "Omeprazol 20mg",
    precio_unitario: 1.5,
    stock_actual: 120,
    unidad_medida: "Cápsula",
  },
  {
    id_producto: 5,
    nombre_producto: "Loratadina 10mg",
    precio_unitario: 0.6,
    stock_actual: 90,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 6,
    nombre_producto: "Salbutamol Inhalador 100mcg",
    precio_unitario: 25.0,
    stock_actual: 30,
    unidad_medida: "Unidad",
  },
  {
    id_producto: 7,
    nombre_producto: "Metformina 850mg",
    precio_unitario: 0.9,
    stock_actual: 180,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 8,
    nombre_producto: "Atorvastatina 20mg",
    precio_unitario: 1.8,
    stock_actual: 60,
    unidad_medida: "Tableta",
  },
];

const mockSuppliers: Supplier[] = [
  {
    id_proveedor: 1,
    nombre_proveedor: "Distribuidora Farmacéutica Lima S.A.",
    ruc: "20123456789",
    telefono: "01-4567890",
    email: "ventas@difalima.com.pe",
  },
  {
    id_proveedor: 2,
    nombre_proveedor: "MediFarma Distribuciones",
    ruc: "20987654321",
    telefono: "01-9876543",
    email: "pedidos@medifarma.com.pe",
  },
  {
    id_proveedor: 3,
    nombre_proveedor: "Droguería El Sol",
    ruc: "20456789123",
    telefono: "01-5551234",
    email: "compras@elsol.com.pe",
  },
  {
    id_proveedor: 4,
    nombre_proveedor: "Farmacéutica Universal",
    ruc: "20654321987",
    telefono: "01-7778899",
    email: "ventas@farmauniversal.com.pe",
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

/* ═══════════════════════════════════════════════════════════════════ */
/*  NEW PURCHASE COMPONENT                                             */
/* ═══════════════════════════════════════════════════════════════════ */
export default function NewPurchase({ isDark = true }: { isDark?: boolean }) {
  const [selectedSupplier, setSelectedSupplier] = useState<number | "">("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().split("T")[0]);
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

  const t = getTheme(isDark);

  // Calculate totals
  const subtotalGeneral = purchaseItems.reduce((sum, item) => sum + item.subtotal, 0);
  const igv = subtotalGeneral * 0.18;
  const totalGeneral = subtotalGeneral + igv;

  // Add item to purchase
  const handleAddItem = () => {
    if (!selectedProduct || !quantity || !unitPrice || !expirationDate || !lote) {
      alert("Por favor completa todos los campos del producto");
      return;
    }

    const product = mockProducts.find(p => p.id_producto === Number(selectedProduct));
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
    setPurchaseItems(purchaseItems.filter(item => item.id_temporal !== id_temporal));
  };

  // Save purchase
  const handleSavePurchase = () => {
    if (!selectedSupplier) {
      alert("Por favor selecciona un proveedor");
      return;
    }
    if (purchaseItems.length === 0) {
      alert("Debes agregar al menos un producto a la compra");
      return;
    }
    if (!invoiceNumber) {
      alert("Por favor ingresa el número de factura");
      return;
    }

    // Aquí iría la lógica para guardar la compra
    console.log("Guardando compra:", {
      proveedor: selectedSupplier,
      fecha: purchaseDate,
      factura: invoiceNumber,
      items: purchaseItems,
      subtotal: subtotalGeneral,
      igv: igv,
      total: totalGeneral,
    });
    
    alert("Compra registrada exitosamente");
    // Reset form
    handleCancelPurchase();
  };

  // Cancel purchase
  const handleCancelPurchase = () => {
    if (purchaseItems.length > 0) {
      if (!confirm("¿Estás seguro de cancelar? Se perderán todos los datos ingresados.")) {
        return;
      }
    }
    setSelectedSupplier("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    setInvoiceNumber("");
    setPurchaseItems([]);
    setShowAddProduct(false);
  };

  // Filter products by search
  const filteredProducts = mockProducts.filter(p =>
    p.nombre_producto.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Auto-fill unit price when product is selected
  const handleProductSelect = (productId: number) => {
    setSelectedProduct(productId);
    const product = mockProducts.find(p => p.id_producto === productId);
    if (product) {
      setUnitPrice(product.precio_unitario.toFixed(2));
    }
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Nueva Compra
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Registra una nueva compra de productos para el inventario
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Subtotal - Blue Gradient */}
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
                Subtotal
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                S/ {subtotalGeneral.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {purchaseItems.length} {purchaseItems.length === 1 ? "producto" : "productos"}
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
              <ShoppingCart size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* IGV - Green Gradient */}
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
                IGV (18%)
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                S/ {igv.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Impuesto incluido
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
              <FileText size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Total - Purple Gradient */}
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
                Total General
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "4px", lineHeight: 1 }}>
                S/ {totalGeneral.toFixed(2)}
              </p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                Monto final a pagar
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
      </div>

      {/* Purchase Form */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "20px" }}>
          Información de la Compra
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
          {/* Supplier */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
              <User size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
              Proveedor *
            </label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value ? Number(e.target.value) : "")}
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
              {mockSuppliers.map((supplier) => (
                <option key={supplier.id_proveedor} value={supplier.id_proveedor}>
                  {supplier.nombre_proveedor} - {supplier.ruc}
                </option>
              ))}
            </select>
          </div>

          {/* Purchase Date */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
              <Calendar size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
              <FileText size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
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
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary }}>
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
                (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.accent}50`;
              }
            }}
            onMouseLeave={(e) => {
              if (!showAddProduct) {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`;
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
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: t.textPrimary, marginBottom: "16px" }}>
              Agregar Nuevo Producto
            </h3>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              {/* Product Search */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  <Search size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  <Package size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
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
                    <option key={product.id_producto} value={product.id_producto}>
                      {product.nombre_producto} - Stock: {product.stock_actual} {product.unidad_medida}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  <DollarSign size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
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
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  <Calendar size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
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
                <p style={{ fontSize: "13px", color: t.textSecondary, marginBottom: "4px" }}>
                  Subtotal del producto:
                </p>
                <p style={{ fontSize: "20px", fontWeight: 700, color: t.accent }}>
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
                (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
              }}
            >
              Agregar a la Compra
            </button>
          </div>
        )}

        {/* Products Table */}
        {purchaseItems.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <Package size={48} color={t.textMuted} style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginBottom: "8px" }}>
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
                <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Producto
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Cantidad
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    P. Unitario
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Lote
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Vencimiento
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Subtotal
                  </th>
                  <th style={{ padding: "12px 16px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase" }}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseItems.map((item, index) => (
                  <tr
                    key={item.id_temporal}
                    style={{
                      borderBottom: index < purchaseItems.length - 1 ? `1px solid ${t.border}` : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                    }}
                  >
                    <td style={{ padding: "16px" }}>
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px" }}>
                          {item.producto.nombre_producto}
                        </p>
                        <p style={{ fontSize: "12px", color: t.textSecondary }}>
                          {item.producto.unidad_medida}
                        </p>
                      </div>
                    </td>
                    <td style={{ padding: "16px", textAlign: "center" }}>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
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
                        {new Date(item.fecha_vencimiento).toLocaleDateString("es-PE")}
                      </span>
                    </td>
                    <td style={{ padding: "16px", textAlign: "right" }}>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: t.accent }}>
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
          <p style={{ fontSize: "14px", color: "#fb923c", fontWeight: 600 }}>
            Debes seleccionar un proveedor antes de guardar la compra
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          onClick={handleCancelPurchase}
          style={{
            padding: "14px 28px",
            borderRadius: "14px",
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
          <X size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
          Cancelar
        </button>

        <button
          onClick={handleSavePurchase}
          disabled={!selectedSupplier || purchaseItems.length === 0}
          style={{
            padding: "14px 28px",
            borderRadius: "14px",
            border: "none",
            background: !selectedSupplier || purchaseItems.length === 0 ? t.textMuted : t.accent,
            color: "#fff",
            fontSize: "14px",
            fontWeight: 600,
            cursor: !selectedSupplier || purchaseItems.length === 0 ? "not-allowed" : "pointer",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
            boxShadow: !selectedSupplier || purchaseItems.length === 0 ? "none" : `0 4px 12px ${t.accent}40`,
            opacity: !selectedSupplier || purchaseItems.length === 0 ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (selectedSupplier && purchaseItems.length > 0) {
              (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.accent}50`;
            }
          }}
          onMouseLeave={(e) => {
            if (selectedSupplier && purchaseItems.length > 0) {
              (e.currentTarget as HTMLButtonElement).style.background = t.accent;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`;
            }
          }}
        >
          <Save size={16} style={{ display: "inline", marginRight: "6px", verticalAlign: "middle" }} />
          Guardar Compra
        </button>
      </div>
    </div>
  );
}
