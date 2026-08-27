import { useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  ShoppingCart,
  User,
  CreditCard,
  FileText,
  DollarSign,
  Save,
  X,
  AlertCircle,
  Package,
  Minus,
  Calculator,
  Receipt,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Product {
  id_producto: number;
  nombre_comercial: string;
  nombre_generico: string;
  precio_venta: number;
  stock_disponible: number;
  unidad_medida: string;
}

interface SaleItem {
  id_temporal: string;
  producto: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombre_razon_social: string;
}

interface MetodoPago {
  id_metodo_pago: number;
  nombre_metodo: string;
  descripcion: string;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockProducts: Product[] = [
  {
    id_producto: 1,
    nombre_comercial: "Paracetamol 500mg",
    nombre_generico: "Paracetamol",
    precio_venta: 0.50,
    stock_disponible: 500,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 2,
    nombre_comercial: "Ibuprofeno 400mg",
    nombre_generico: "Ibuprofeno",
    precio_venta: 0.80,
    stock_disponible: 300,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 3,
    nombre_comercial: "Amoxicilina 500mg",
    nombre_generico: "Amoxicilina",
    precio_venta: 1.20,
    stock_disponible: 200,
    unidad_medida: "Cápsula",
  },
  {
    id_producto: 4,
    nombre_comercial: "Omeprazol 20mg",
    nombre_generico: "Omeprazol",
    precio_venta: 1.50,
    stock_disponible: 400,
    unidad_medida: "Cápsula",
  },
  {
    id_producto: 5,
    nombre_comercial: "Loratadina 10mg",
    nombre_generico: "Loratadina",
    precio_venta: 0.60,
    stock_disponible: 350,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 6,
    nombre_comercial: "Salbutamol Inhalador 100mcg",
    nombre_generico: "Salbutamol",
    precio_venta: 25.00,
    stock_disponible: 50,
    unidad_medida: "Unidad",
  },
  {
    id_producto: 7,
    nombre_comercial: "Metformina 850mg",
    nombre_generico: "Metformina",
    precio_venta: 0.90,
    stock_disponible: 600,
    unidad_medida: "Tableta",
  },
  {
    id_producto: 8,
    nombre_comercial: "Atorvastatina 20mg",
    nombre_generico: "Atorvastatina",
    precio_venta: 1.80,
    stock_disponible: 250,
    unidad_medida: "Tableta",
  },
];

const mockClientes: Cliente[] = [
  {
    id_cliente: 1,
    tipo_documento: "DNI",
    numero_documento: "45678912",
    nombre_razon_social: "Carlos Ramírez Torres",
  },
  {
    id_cliente: 2,
    tipo_documento: "RUC",
    numero_documento: "20123456789",
    nombre_razon_social: "FARMACORP SAC",
  },
  {
    id_cliente: 3,
    tipo_documento: "DNI",
    numero_documento: "87654321",
    nombre_razon_social: "María González Pérez",
  },
];

const mockMetodosPago: MetodoPago[] = [
  {
    id_metodo_pago: 1,
    nombre_metodo: "EFECTIVO",
    descripcion: "Pago en efectivo",
  },
  {
    id_metodo_pago: 2,
    nombre_metodo: "TARJETA",
    descripcion: "Pago con tarjeta débito/crédito",
  },
  {
    id_metodo_pago: 3,
    nombre_metodo: "YAPE_PLIN",
    descripcion: "Pago por billetera digital",
  },
  {
    id_metodo_pago: 4,
    nombre_metodo: "TRANSFERENCIA",
    descripcion: "Transferencia bancaria",
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
/*  NEW SALE COMPONENT                                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export default function NewSale({ isDark = true }: { isDark?: boolean }) {
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [quantity, setQuantity] = useState("1");
  
  // Payment section
  const [tipoComprobante, setTipoComprobante] = useState<"BOLETA" | "FACTURA" | "TICKET">("BOLETA");
  const [selectedCliente, setSelectedCliente] = useState<number | "">("");
  const [selectedMetodoPago, setSelectedMetodoPago] = useState<number | "">(1); // Default: EFECTIVO
  const [montoPagado, setMontoPagado] = useState("");
  const [searchCliente, setSearchCliente] = useState("");

  const t = getTheme(isDark);

  // Calculate totals
  const subtotal = saleItems.reduce((sum, item) => sum + item.subtotal, 0);
  const total = subtotal; // En Perú, precios ya incluyen IGV
  const vuelto = montoPagado ? parseFloat(montoPagado) - total : 0;

  // Filter products by search
  const filteredProducts = mockProducts.filter(p =>
    p.nombre_comercial.toLowerCase().includes(searchProduct.toLowerCase()) ||
    p.nombre_generico.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Filter clientes by search
  const filteredClientes = mockClientes.filter(c =>
    c.nombre_razon_social.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.numero_documento.includes(searchCliente)
  );

  // Add item to sale
  const handleAddItem = () => {
    if (!selectedProduct || !quantity) {
      alert("Por favor selecciona un producto y cantidad");
      return;
    }

    const product = mockProducts.find(p => p.id_producto === Number(selectedProduct));
    if (!product) return;

    const cantidadNum = Number(quantity);
    if (cantidadNum <= 0) {
      alert("La cantidad debe ser mayor a 0");
      return;
    }

    if (cantidadNum > product.stock_disponible) {
      alert(`Stock insuficiente. Disponible: ${product.stock_disponible}`);
      return;
    }

    // Check if product already exists in cart
    const existingItem = saleItems.find(item => item.producto.id_producto === product.id_producto);
    
    if (existingItem) {
      const newQuantity = existingItem.cantidad + cantidadNum;
      if (newQuantity > product.stock_disponible) {
        alert(`Stock insuficiente. Disponible: ${product.stock_disponible}`);
        return;
      }
      // Update quantity
      setSaleItems(saleItems.map(item =>
        item.producto.id_producto === product.id_producto
          ? { ...item, cantidad: newQuantity, subtotal: newQuantity * item.precio_unitario }
          : item
      ));
    } else {
      // Add new item
      const newItem: SaleItem = {
        id_temporal: `temp-${Date.now()}`,
        producto: product,
        cantidad: cantidadNum,
        precio_unitario: product.precio_venta,
        subtotal: cantidadNum * product.precio_venta,
      };
      setSaleItems([...saleItems, newItem]);
    }

    // Reset form
    setSelectedProduct("");
    setQuantity("1");
    setSearchProduct("");
  };

  // Update item quantity
  const handleUpdateQuantity = (id_temporal: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id_temporal);
      return;
    }

    const item = saleItems.find(i => i.id_temporal === id_temporal);
    if (!item) return;

    if (newQuantity > item.producto.stock_disponible) {
      alert(`Stock insuficiente. Disponible: ${item.producto.stock_disponible}`);
      return;
    }

    setSaleItems(saleItems.map(i =>
      i.id_temporal === id_temporal
        ? { ...i, cantidad: newQuantity, subtotal: newQuantity * i.precio_unitario }
        : i
    ));
  };

  // Remove item
  const handleRemoveItem = (id_temporal: string) => {
    setSaleItems(saleItems.filter(item => item.id_temporal !== id_temporal));
  };

  // Process sale
  const handleProcessSale = () => {
    // Validations
    if (saleItems.length === 0) {
      alert("Debes agregar al menos un producto a la venta");
      return;
    }

    if (!selectedMetodoPago) {
      alert("Selecciona un método de pago");
      return;
    }

    if (tipoComprobante === "FACTURA") {
      if (!selectedCliente) {
        alert("Para emitir FACTURA debes seleccionar un cliente con RUC");
        return;
      }
      const cliente = mockClientes.find(c => c.id_cliente === selectedCliente);
      if (cliente && cliente.tipo_documento !== "RUC") {
        alert("Para emitir FACTURA el cliente debe tener RUC");
        return;
      }
    }

    const metodoPago = mockMetodosPago.find(m => m.id_metodo_pago === selectedMetodoPago);
    if (metodoPago?.nombre_metodo === "EFECTIVO") {
      if (!montoPagado || parseFloat(montoPagado) < total) {
        alert("El monto pagado debe ser igual o mayor al total");
        return;
      }
    }

    // Aquí iría la lógica para guardar la venta en el backend
    console.log("Procesando venta:", {
      tipo_comprobante: tipoComprobante,
      id_cliente: selectedCliente || null,
      id_metodo_pago: selectedMetodoPago,
      items: saleItems,
      total_pagar: total,
      monto_pagado: parseFloat(montoPagado) || total,
      vuelto: vuelto,
    });

    alert("Venta procesada exitosamente");
    handleCancelSale();
  };

  // Cancel sale
  const handleCancelSale = () => {
    if (saleItems.length > 0) {
      if (!confirm("¿Estás seguro de cancelar? Se perderán todos los datos.")) {
        return;
      }
    }
    setSaleItems([]);
    setTipoComprobante("BOLETA");
    setSelectedCliente("");
    setSelectedMetodoPago(1);
    setMontoPagado("");
    setSelectedProduct("");
    setQuantity("1");
    setSearchProduct("");
    setSearchCliente("");
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Nueva Venta
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Registra una nueva venta en el sistema de punto de venta
        </p>
      </div>

      {/* Main Layout: 2 columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "20px" }}>
        {/* Left Column: Product Selection & Cart */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Add Product Section */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Package size={20} color={t.accent} />
              Agregar Productos
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Product Search */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                  <Search size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  Buscar Producto
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre comercial o genérico..."
                  value={searchProduct}
                  onChange={(e) => setSearchProduct(e.target.value)}
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

              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr auto", gap: "12px", alignItems: "end" }}>
                {/* Product Select */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                    Producto *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => {
                      setSelectedProduct(Number(e.target.value));
                      const product = mockProducts.find(p => p.id_producto === Number(e.target.value));
                      if (product) {
                        setQuantity("1");
                      }
                    }}
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
                    <option value="">Seleccionar producto</option>
                    {filteredProducts.map((product) => (
                      <option key={product.id_producto} value={product.id_producto}>
                        {product.nombre_comercial} - S/ {product.precio_venta.toFixed(2)} (Stock: {product.stock_disponible})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Quantity */}
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                    Cantidad *
                  </label>
                  <input
                    type="number"
                    placeholder="1"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
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

                {/* Add Button */}
                <button
                  onClick={handleAddItem}
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
                    whiteSpace: "nowrap",
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
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {/* Shopping Cart */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px", flex: 1 }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <ShoppingCart size={20} color={t.accent} />
              Carrito de Compra ({saleItems.length} {saleItems.length === 1 ? "producto" : "productos"})
            </h2>

            {saleItems.length === 0 ? (
              <div style={{ padding: "60px 20px", textAlign: "center" }}>
                <ShoppingCart size={48} color={t.textMuted} style={{ marginBottom: "12px" }} />
                <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary, marginBottom: "8px" }}>
                  Carrito vacío
                </p>
                <p style={{ fontSize: "14px", color: t.textSecondary }}>
                  Agrega productos para comenzar la venta
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "500px", overflowY: "auto" }}>
                {saleItems.map((item) => (
                  <div
                    key={item.id_temporal}
                    style={{
                      padding: "16px",
                      background: t.innerBg,
                      borderRadius: "16px",
                      border: `1px solid ${t.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "4px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {item.producto.nombre_comercial}
                      </p>
                      <p style={{ fontSize: "12px", color: t.textSecondary }}>
                        S/ {item.precio_unitario.toFixed(2)} x {item.cantidad} = S/ {item.subtotal.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id_temporal, item.cantidad - 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "none",
                          background: t.inputBg,
                          color: t.textSecondary,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                          (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = t.inputBg;
                          (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                        }}
                      >
                        <Minus size={16} />
                      </button>

                      <span style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary, minWidth: "30px", textAlign: "center" }}>
                        {item.cantidad}
                      </span>

                      <button
                        onClick={() => handleUpdateQuantity(item.id_temporal, item.cantidad + 1)}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          border: "none",
                          background: t.inputBg,
                          color: t.textSecondary,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                          (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.background = t.inputBg;
                          (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                        }}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id_temporal)}
                      title="Eliminar producto"
                      style={{
                        width: "32px",
                        height: "32px",
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
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Payment & Summary */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Summary Card */}
          <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "24px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Calculator size={20} color={t.accent} />
              Resumen de Venta
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Tipo de Comprobante */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                  <Receipt size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  Tipo de Comprobante *
                </label>
                <select
                  value={tipoComprobante}
                  onChange={(e) => {
                    setTipoComprobante(e.target.value as "BOLETA" | "FACTURA" | "TICKET");
                    if (e.target.value !== "FACTURA") {
                      setSelectedCliente("");
                    }
                  }}
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
                  <option value="BOLETA">Boleta de Venta</option>
                  <option value="FACTURA">Factura</option>
                  <option value="TICKET">Ticket</option>
                </select>
              </div>

              {/* Cliente (required for FACTURA) */}
              {tipoComprobante === "FACTURA" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Buscar Cliente (RUC)
                    </label>
                    <input
                      type="text"
                      placeholder="Buscar por nombre o documento..."
                      value={searchCliente}
                      onChange={(e) => setSearchCliente(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        borderRadius: "12px",
                        border: `1px solid ${t.border}`,
                        background: t.inputBg,
                        color: t.textPrimary,
                        fontSize: "13px",
                        fontFamily: "'Cairo', sans-serif",
                        outline: "none",
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      <User size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                      Cliente * (Solo RUC)
                    </label>
                    <select
                      value={selectedCliente}
                      onChange={(e) => setSelectedCliente(Number(e.target.value))}
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
                      <option value="">Seleccionar cliente</option>
                      {filteredClientes
                        .filter(c => c.tipo_documento === "RUC")
                        .map((cliente) => (
                          <option key={cliente.id_cliente} value={cliente.id_cliente}>
                            {cliente.nombre_razon_social} - {cliente.numero_documento}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}

              {/* Método de Pago */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                  <CreditCard size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                  Método de Pago *
                </label>
                <select
                  value={selectedMetodoPago}
                  onChange={(e) => {
                    setSelectedMetodoPago(Number(e.target.value));
                    // Reset monto pagado si no es efectivo
                    const metodo = mockMetodosPago.find(m => m.id_metodo_pago === Number(e.target.value));
                    if (metodo?.nombre_metodo !== "EFECTIVO") {
                      setMontoPagado(total.toFixed(2));
                    } else {
                      setMontoPagado("");
                    }
                  }}
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
                  <option value="">Seleccionar método</option>
                  {mockMetodosPago.map((metodo) => (
                    <option key={metodo.id_metodo_pago} value={metodo.id_metodo_pago}>
                      {metodo.nombre_metodo} - {metodo.descripcion}
                    </option>
                  ))}
                </select>
              </div>

              {/* Monto Pagado (only for EFECTIVO) */}
              {selectedMetodoPago === 1 && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                    <DollarSign size={14} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                    Monto Pagado *
                  </label>
                  <input
                    type="number"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={montoPagado}
                    onChange={(e) => setMontoPagado(e.target.value)}
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
              )}

              {/* Summary Totals */}
              <div style={{ marginTop: "16px", padding: "20px", background: t.innerBg, borderRadius: "16px", border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                  <span style={{ fontSize: "14px", color: t.textSecondary }}>Subtotal:</span>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                    S/ {subtotal.toFixed(2)}
                  </span>
                </div>

                <div
                  style={{
                    borderTop: `2px solid ${t.border}`,
                    paddingTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>Total a Pagar:</span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: t.accent }}>
                    S/ {total.toFixed(2)}
                  </span>
                </div>

                {selectedMetodoPago === 1 && montoPagado && parseFloat(montoPagado) >= total && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${t.border}` }}>
                      <span style={{ fontSize: "14px", color: t.textSecondary }}>Monto Pagado:</span>
                      <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        S/ {parseFloat(montoPagado).toFixed(2)}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#22c55e" }}>Vuelto:</span>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "#22c55e" }}>
                        S/ {vuelto.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Warning Alert */}
              {tipoComprobante === "FACTURA" && !selectedCliente && (
                <div
                  style={{
                    padding: "12px 16px",
                    background: "rgba(249, 115, 22, 0.1)",
                    border: "1px solid rgba(249, 115, 22, 0.3)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <AlertCircle size={18} color="#fb923c" />
                  <p style={{ fontSize: "12px", color: "#fb923c", lineHeight: 1.4 }}>
                    Para emitir FACTURA debes seleccionar un cliente con RUC
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "8px" }}>
                <button
                  onClick={handleProcessSale}
                  disabled={saleItems.length === 0}
                  style={{
                    padding: "14px 20px",
                    borderRadius: "14px",
                    border: "none",
                    background: saleItems.length === 0 ? t.textMuted : t.accent,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: saleItems.length === 0 ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: saleItems.length === 0 ? "none" : `0 4px 12px ${t.accent}40`,
                    opacity: saleItems.length === 0 ? 0.5 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (saleItems.length > 0) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.accent}50`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (saleItems.length > 0) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                      (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`;
                    }
                  }}
                >
                  <Save size={16} />
                  Procesar Venta
                </button>

                <button
                  onClick={handleCancelSale}
                  style={{
                    padding: "12px 20px",
                    borderRadius: "14px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
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
                  <X size={16} />
                  Cancelar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
