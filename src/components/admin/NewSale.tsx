import React, { useMemo, useState } from "react";
import LottieLib from "lottie-react";
import cartEmptyAnimation from "../../assets/cart-empty.json";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Lottie = (LottieLib as any).default ?? LottieLib;
import {
  Search,
  Plus,
  Trash2,
  CreditCard,
  DollarSign,
  X,
  AlertCircle,
  Minus,
  Receipt,
  Pill,
  Package,
  ShieldCheck,
  BadgePercent,
  Stethoscope,
  LayoutGrid,
  Banknote,
  Smartphone,
  ArrowRightLeft,
  User,
  CheckCircle2,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
type CategoryId = "all" | "pain" | "antibiotics" | "digestive" | "allergy" | "respiratory" | "diabetes";
type PaymentMethod = "EFECTIVO" | "TARJETA" | "YAPE_PLIN" | "TRANSFERENCIA";
type TipoComprobante = "BOLETA" | "FACTURA" | "TICKET";

interface OpcionVenta {
  label: string;
  shortLabel: string;
  precio: number;
}

interface Product {
  id: number;
  nombre: string;
  generico: string;
  categoria: CategoryId;
  categoriaLabel: string;
  stock: number;
  vendidos: number;
  requiereReceta: boolean;
  laboratorio: string;
  imagen: string;
  accent: string;
  opciones: OpcionVenta[];
  precio?: number;
  unidad?: string;
}

interface CartItem {
  key: string;
  producto: Product;
  opcionLabel: string;
  opcionShortLabel: string;
  cantidad: number;
  precioUnitario: number;
}

interface Cliente {
  id: number;
  tipo: string;
  documento: string;
  nombre: string;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const categorias: Array<{ id: CategoryId; label: string; icon: React.ElementType; count: number }> = [
  { id: "all", label: "Todo", icon: LayoutGrid, count: 8 },
  { id: "pain", label: "Analgésicos", icon: Pill, count: 2 },
  { id: "antibiotics", label: "Antibióticos", icon: ShieldCheck, count: 1 },
  { id: "digestive", label: "Digestivo", icon: Package, count: 1 },
  { id: "allergy", label: "Alergias", icon: BadgePercent, count: 2 },
  { id: "respiratory", label: "Respiratorio", icon: Stethoscope, count: 1 },
  { id: "diabetes", label: "Diabetes", icon: Receipt, count: 1 },
];

const productos: Product[] = [
  {
    id: 1,
    nombre: "Paracetamol 500mg",
    generico: "Paracetamol",
    categoria: "pain",
    categoriaLabel: "Analgésico",
    stock: 500,
    vendidos: 64,
    requiereReceta: false,
    laboratorio: "Genfar",
    imagen: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80",
    accent: "#0fbf70",
    opciones: [
      { label: "Tableta", shortLabel: "TAB", precio: 0.5 },
      { label: "Blister", shortLabel: "BL", precio: 5.0 },
      { label: "Caja", shortLabel: "CJ", precio: 42.0 },
    ],
  },
  {
    id: 2,
    nombre: "Ibuprofeno 400mg",
    generico: "Ibuprofeno",
    categoria: "pain",
    categoriaLabel: "Antiinflamatorio",
    stock: 300,
    vendidos: 51,
    requiereReceta: false,
    laboratorio: "Medifarma",
    imagen: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=400&q=80",
    accent: "#22a7f0",
    opciones: [
      { label: "Tableta", shortLabel: "TAB", precio: 0.8 },
      { label: "Blister", shortLabel: "BL", precio: 8.0 },
      { label: "Caja", shortLabel: "CJ", precio: 68.0 },
    ],
  },
  {
    id: 3,
    nombre: "Amoxicilina 500mg",
    generico: "Amoxicilina",
    categoria: "antibiotics",
    categoriaLabel: "Antibiótico",
    stock: 118,
    vendidos: 22,
    requiereReceta: true,
    laboratorio: "Portugal",
    imagen: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80",
    accent: "#f59e0b",
    opciones: [
      { label: "Cápsula", shortLabel: "CAP", precio: 1.2 },
      { label: "Blister", shortLabel: "BL", precio: 12.0 },
      { label: "Caja", shortLabel: "CJ", precio: 98.0 },
    ],
  },
  {
    id: 4,
    nombre: "Omeprazol 20mg",
    generico: "Omeprazol",
    categoria: "digestive",
    categoriaLabel: "Digestivo",
    stock: 240,
    vendidos: 39,
    requiereReceta: false,
    laboratorio: "Farmindustria",
    imagen: "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80",
    accent: "#8b5cf6",
    opciones: [
      { label: "Cápsula", shortLabel: "CAP", precio: 1.5 },
      { label: "Blister", shortLabel: "BL", precio: 15.0 },
      { label: "Caja", shortLabel: "CJ", precio: 125.0 },
    ],
  },
  {
    id: 5,
    nombre: "Loratadina 10mg",
    generico: "Loratadina",
    categoria: "allergy",
    categoriaLabel: "Alergias",
    stock: 350,
    vendidos: 45,
    requiereReceta: false,
    laboratorio: "Bago",
    imagen: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80",
    accent: "#06b6d4",
    opciones: [
      { label: "Tableta", shortLabel: "TAB", precio: 0.6 },
      { label: "Blister", shortLabel: "BL", precio: 6.0 },
      { label: "Caja", shortLabel: "CJ", precio: 52.0 },
    ],
  },
  {
    id: 6,
    nombre: "Salbutamol Inhalador",
    generico: "Salbutamol 100mcg",
    categoria: "respiratory",
    categoriaLabel: "Respiratorio",
    stock: 48,
    vendidos: 16,
    requiereReceta: true,
    laboratorio: "Glaxo",
    imagen: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=400&q=80",
    accent: "#ef4444",
    opciones: [
      { label: "Unidad", shortLabel: "UND", precio: 25.0 },
      { label: "Pack x2", shortLabel: "P2", precio: 48.0 },
      { label: "Caja", shortLabel: "CJ", precio: 290.0 },
    ],
  },
  {
    id: 7,
    nombre: "Metformina 850mg",
    generico: "Metformina",
    categoria: "diabetes",
    categoriaLabel: "Diabetes",
    stock: 600,
    vendidos: 72,
    requiereReceta: true,
    laboratorio: "AC Farma",
    imagen: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=400&q=80",
    accent: "#14b8a6",
    opciones: [
      { label: "Tableta", shortLabel: "TAB", precio: 0.9 },
      { label: "Blister", shortLabel: "BL", precio: 9.0 },
      { label: "Caja", shortLabel: "CJ", precio: 76.0 },
    ],
  },
  {
    id: 8,
    nombre: "Vitamina C 1g",
    generico: "Ácido ascórbico",
    categoria: "allergy",
    categoriaLabel: "Suplemento",
    stock: 180,
    vendidos: 31,
    requiereReceta: false,
    laboratorio: "Mason",
    imagen: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=400&q=80",
    accent: "#f97316",
    opciones: [
      { label: "Tableta", shortLabel: "TAB", precio: 1.1 },
      { label: "Tubo", shortLabel: "TUB", precio: 16.0 },
      { label: "Caja", shortLabel: "CJ", precio: 90.0 },
    ],
  },
];

const mockClientes: Cliente[] = [
  { id: 1, tipo: "DNI", documento: "45678912", nombre: "Carlos Ramírez Torres" },
  { id: 2, tipo: "RUC", documento: "20123456789", nombre: "FARMACORP SAC" },
  { id: 3, tipo: "DNI", documento: "87654321", nombre: "María González Pérez" },
];

const formatSoles = (v: number) =>
  new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", minimumFractionDigits: 2 }).format(v);

/** Convert hex color to rgba string */
const hexRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};

/* ─── Theme ────────────────────────────────────────────────────────── */
function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      bg: "#13121f",
      panel: "#1a1928",
      card: "#1f1e30",
      cardHover: "#252438",
      input: "#252438",
      border: "rgba(255,255,255,0.06)",
      borderStrong: "rgba(255,255,255,0.1)",
      text: "#f0f0ff",
      textSub: "#9b9bbf",
      textMuted: "#5a5a7a",
      accent: "#6c63ff",
      accentGrad: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
      accentShadow: "rgba(108,99,255,0.35)",
      success: "#0fbf70",
      danger: "#ef4444",
      orange: "#f97316",
    };
  }
  return {
    bg: "#f0f2fb",
    panel: "#ffffff",
    card: "#ffffff",
    cardHover: "#f5f6ff",
    input: "#f4f5fc",
    border: "rgba(0,0,0,0.07)",
    borderStrong: "rgba(0,0,0,0.12)",
    text: "#1a1a3a",
    textSub: "#6b6b8f",
    textMuted: "#aaaac0",
    accent: "#6c63ff",
    accentGrad: "linear-gradient(135deg, #6c63ff 0%, #3ecfcf 100%)",
    accentShadow: "rgba(108,99,255,0.30)",
    success: "#0fbf70",
    danger: "#ef4444",
    orange: "#f97316",
  };
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  NEW SALE COMPONENT                                                 */
/* ═══════════════════════════════════════════════════════════════════ */
export default function NewSale({ isDark = true }: { isDark?: boolean }) {
  const t = getTheme(isDark);

  const [categoriaActiva, setCategoriaActiva] = useState<CategoryId>("all");
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState<CartItem[]>([]);
  const [tipoComprobante, setTipoComprobante] = useState<TipoComprobante>("BOLETA");
  const [metodoPago, setMetodoPago] = useState<PaymentMethod>("EFECTIVO");
  const [montoPagado, setMontoPagado] = useState("");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | "">("");
  const [ventaExitosa, setVentaExitosa] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<Record<number, string>>(() =>
    productos.reduce((acc, p) => ({ ...acc, [p.id]: p.opciones[0].label }), {})
  );

  /* ─── Filtered products ─── */
  const productosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return productos.filter((p) => {
      const matchCat = categoriaActiva === "all" || p.categoria === categoriaActiva;
      const matchSearch =
        !q ||
        p.nombre.toLowerCase().includes(q) ||
        p.generico.toLowerCase().includes(q) ||
        p.laboratorio.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [categoriaActiva, busqueda]);

  /* ─── Totals ─── */
  const subtotal = carrito.reduce((s, i) => s + i.precioUnitario * i.cantidad, 0);
  const igvIncluido = subtotal > 0 ? subtotal - subtotal / 1.18 : 0;
  const total = subtotal;
  const vuelto = montoPagado && parseFloat(montoPagado) >= total ? parseFloat(montoPagado) - total : 0;
  const itemCount = carrito.reduce((s, i) => s + i.cantidad, 0);

  /* ─── Cart actions ─── */
  const agregarAlCarrito = (producto: Product) => {
    const opcionActiva =
      producto.opciones.find((opt) => opt.label === (opcionSeleccionada[producto.id] || producto.opciones[0].label)) ||
      producto.opciones[0];
    const key = `${producto.id}-${opcionActiva.label}`;

    setCarrito((prev) => {
      const existe = prev.find((i) => i.key === key);
      if (existe) {
        return prev.map((i) =>
          i.key === key
            ? { ...i, cantidad: Math.min(producto.stock, i.cantidad + 1) }
            : i
        );
      }
      return [
        ...prev,
        {
          key,
          producto,
          opcionLabel: opcionActiva.label,
          opcionShortLabel: opcionActiva.shortLabel,
          cantidad: 1,
          precioUnitario: opcionActiva.precio,
        },
      ];
    });
  };

  const actualizarCantidad = (key: string, delta: number) => {
    setCarrito((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, cantidad: i.cantidad + delta } : i))
        .filter((i) => i.cantidad > 0)
    );
  };

  const eliminarDelCarrito = (key: string) => {
    setCarrito((prev) => prev.filter((i) => i.key !== key));
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setMontoPagado("");
    setClienteSeleccionado("");
    setTipoComprobante("BOLETA");
    setMetodoPago("EFECTIVO");
  };

  const procesarVenta = () => {
    if (carrito.length === 0) return;
    console.log("Venta procesada:", { tipoComprobante, metodoPago, carrito, total });
    setVentaExitosa(true);
    setTimeout(() => {
      setVentaExitosa(false);
      limpiarCarrito();
    }, 2500);
  };

  /* ─── Payment method config ─── */
  const metodosPago: Array<{ id: PaymentMethod; label: string; icon: React.ElementType }> = [
    { id: "EFECTIVO", label: "Efectivo", icon: Banknote },
    { id: "TARJETA", label: "Tarjeta", icon: CreditCard },
    { id: "YAPE_PLIN", label: "Yape/Plin", icon: Smartphone },
    { id: "TRANSFERENCIA", label: "Transferencia", icon: ArrowRightLeft },
  ];

  /* ─── Styles ─── */
  const S = {
    root: {
      display: "flex",
      height: "calc(100vh - 80px)",
      minHeight: "600px",
      fontFamily: "'Inter', 'Cairo', sans-serif",
      background: t.bg,
      overflow: "hidden",
      gap: "0",
    } as React.CSSProperties,

    /* LEFT PANEL */
    left: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      padding: "16px 16px 20px 20px",
      gap: "10px",
      minWidth: 0,
      minHeight: 0,
    },

    topBar: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },

    searchWrap: {
      position: "relative" as const,
      width: "100%",
    },

    searchIcon: {
      position: "absolute" as const,
      left: "14px",
      top: "50%",
      transform: "translateY(-50%)",
      color: t.textMuted,
      pointerEvents: "none" as const,
      zIndex: 1,
    },

    searchInput: {
      width: "100%",
      padding: "12px 14px 12px 42px",
      borderRadius: "14px",
      border: `1.5px solid ${t.border}`,
      background: t.panel,
      color: t.text,
      fontSize: "14px",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box" as const,
      transition: "border-color 0.2s",
      boxShadow: `0 2px 8px rgba(0,0,0,0.06)`,
    },

    categoriesRow: {
      display: "flex",
      gap: "8px",
      overflowX: "auto" as const,
      paddingBottom: "4px",
      scrollbarWidth: "none" as const,
    },

    catBtn: (active: boolean) => ({
      display: "flex",
      alignItems: "center",
      gap: "6px",
      padding: "8px 16px",
      borderRadius: "40px",
      border: active ? "none" : `1.5px solid ${t.border}`,
      background: active ? t.accent : t.panel,
      color: active ? "#fff" : t.textSub,
      fontSize: "13px",
      fontWeight: 600,
      cursor: "pointer",
      whiteSpace: "nowrap" as const,
      transition: "all 0.2s",
      flexShrink: 0,
      boxShadow: active ? `0 4px 14px ${t.accentShadow}` : "none",
    }),

    sectionInfo: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: "15px",
      fontWeight: 700,
      color: t.text,
      margin: 0,
    },

    sectionCount: {
      fontSize: "12px",
      color: t.textMuted,
      background: t.input,
      padding: "4px 10px",
      borderRadius: "20px",
      fontWeight: 600,
    },

    grid: {
      gap: "12px",
      overflowY: "auto" as const,
      paddingRight: "6px",
      paddingBottom: "32px",
      flex: 1,
      minHeight: 0,
      alignContent: "start",
    },

    productCard: (_accent: string) => ({
      background: t.card,
      borderRadius: "16px",
      border: `1.5px solid ${t.border}`,
      overflow: "hidden",
      cursor: "pointer",
      transition: "all 0.2s",
      display: "flex",
      flexDirection: "column" as const,
      position: "relative" as const,
      minWidth: 0,
      height: "100%",
      boxSizing: "border-box" as const,
    }),

    productImg: {
      position: "absolute" as const,
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover" as const,
      zIndex: 1,
      transition: "transform 0.3s ease",
    },

    productImgWrap: (accent: string) => ({
      width: "100%",
      /* aspect-ratio scales proportionally at any zoom level */
      aspectRatio: "16/9",
      position: "relative" as const,
      overflow: "hidden" as const,
      background: `linear-gradient(135deg, ${hexRgba(accent, 0.35)}, ${hexRgba(accent, 0.70)})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),

    productBody: {
      padding: "12px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "6px",
      flex: 1,
    },

    productName: {
      fontSize: "13px",
      fontWeight: 700,
      color: t.text,
      margin: 0,
      lineHeight: 1.3,
    },

    productSub: {
      fontSize: "11px",
      color: t.textMuted,
      margin: 0,
    },

    productMeta: {
      fontSize: "11px",
      color: t.textSub,
      marginTop: "2px",
    },

    productPrice: (accent: string) => ({
      fontSize: "14px",
      fontWeight: 800,
      color: accent,
      margin: 0,
      lineHeight: 1.2,
    }),

    addBtn: (accent: string) => ({
      width: "30px",
      height: "30px",
      borderRadius: "9px",
      border: "none",
      background: accent,
      color: "#fff",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: `0 4px 12px ${accent}55`,
      transition: "transform 0.15s",
      flexShrink: 0,
    }),

    /* RIGHT PANEL - BILL */
    right: {
      width: "clamp(260px, 28vw, 340px)",
      flexShrink: 0,
      display: "flex",
      flexDirection: "column" as const,
      background: t.panel,
      borderLeft: `1.5px solid ${t.border}`,
      height: "100%",
      overflow: "hidden",
    },

    billHeader: {
      padding: "20px 20px 16px",
      borderBottom: `1px solid ${t.border}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    billTitle: {
      fontSize: "20px",
      fontWeight: 800,
      color: t.text,
      margin: 0,
    },

    billCount: {
      fontSize: "12px",
      color: t.textSub,
      background: t.input,
      padding: "4px 12px",
      borderRadius: "20px",
      fontWeight: 600,
    },

    billItems: {
      flex: 1,
      overflowY: "auto" as const,
      padding: "12px 20px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "10px",
    },

    billItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 12px",
      background: t.input,
      borderRadius: "14px",
      transition: "background 0.15s",
    },

    billItemImg: {
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      objectFit: "cover" as const,
      flexShrink: 0,
    },

    billItemImgPlaceholder: (accent: string) => ({
      width: "44px",
      height: "44px",
      borderRadius: "10px",
      background: `linear-gradient(135deg, ${accent}25, ${accent}45)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }),

    billItemInfo: {
      flex: 1,
      minWidth: 0,
    },

    billItemName: {
      fontSize: "13px",
      fontWeight: 600,
      color: t.text,
      margin: 0,
      whiteSpace: "nowrap" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    billItemSub: {
      fontSize: "11px",
      color: t.textMuted,
    },

    qtyControl: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },

    qtyBtn: (color?: string) => ({
      width: "24px",
      height: "24px",
      borderRadius: "7px",
      border: "none",
      background: color || t.card,
      color: color ? "#fff" : t.textSub,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.15s",
      boxShadow: color ? `0 2px 8px ${color}44` : "none",
    }),

    qtyNum: {
      fontSize: "14px",
      fontWeight: 700,
      color: t.text,
      minWidth: "20px",
      textAlign: "center" as const,
    },

    billItemPrice: (accent: string) => ({
      fontSize: "13px",
      fontWeight: 700,
      color: accent,
      flexShrink: 0,
      textAlign: "right" as const,
    }),

    emptyCart: {
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      justifyContent: "center",
      flex: 1,
      gap: "8px",
      padding: "20px 20px",
    },

    /* Summary section */
    summarySection: {
      padding: "16px 20px",
      borderTop: `1px solid ${t.border}`,
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },

    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    summaryLabel: {
      fontSize: "13px",
      color: t.textSub,
    },

    summaryValue: {
      fontSize: "13px",
      fontWeight: 600,
      color: t.text,
    },

    divider: {
      borderTop: `1.5px dashed ${t.border}`,
      margin: "2px 0",
    },

    totalRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "2px",
    },

    totalLabel: {
      fontSize: "16px",
      fontWeight: 800,
      color: t.text,
    },

    totalValue: {
      fontSize: "22px",
      fontWeight: 900,
      background: t.accentGrad,
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },

    /* Payment section */
    paymentSection: {
      padding: "0 20px 16px",
      display: "flex",
      flexDirection: "column" as const,
      gap: "12px",
    },

    paymentLabel: {
      fontSize: "13px",
      fontWeight: 700,
      color: t.text,
      marginBottom: "4px",
    },

    paymentMethodsRow: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
    },

    payMethod: (active: boolean) => ({
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "5px",
      padding: "10px 4px",
      borderRadius: "12px",
      border: active ? `2px solid ${t.accent}` : `1.5px solid ${t.border}`,
      background: active ? `${t.accent}15` : t.input,
      cursor: "pointer",
      transition: "all 0.2s",
    }),

    payMethodIcon: (active: boolean) => ({
      color: active ? t.accent : t.textMuted,
    }),

    payMethodLabel: (active: boolean) => ({
      fontSize: "10px",
      fontWeight: 600,
      color: active ? t.accent : t.textMuted,
    }),

    comprobanteRow: {
      display: "flex",
      gap: "8px",
    },

    comprobanteBtn: (active: boolean) => ({
      flex: 1,
      padding: "8px 4px",
      borderRadius: "10px",
      border: active ? `2px solid ${t.accent}` : `1.5px solid ${t.border}`,
      background: active ? `${t.accent}12` : "transparent",
      color: active ? t.accent : t.textMuted,
      fontSize: "12px",
      fontWeight: 700,
      cursor: "pointer",
      transition: "all 0.2s",
      textAlign: "center" as const,
    }),

    montoInput: {
      width: "100%",
      padding: "10px 14px",
      borderRadius: "12px",
      border: `1.5px solid ${t.border}`,
      background: t.input,
      color: t.text,
      fontSize: "14px",
      fontFamily: "inherit",
      fontWeight: 600,
      outline: "none",
      boxSizing: "border-box" as const,
    },

    vueltoBox: {
      background: `${t.success}15`,
      border: `1.5px solid ${t.success}40`,
      borderRadius: "12px",
      padding: "10px 14px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },

    processBtn: (disabled: boolean) => ({
      width: "100%",
      padding: "14px",
      borderRadius: "14px",
      border: "none",
      background: disabled ? t.textMuted : t.accentGrad,
      color: "#fff",
      fontSize: "15px",
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      boxShadow: disabled ? "none" : `0 6px 20px ${t.accentShadow}`,
      transition: "all 0.2s",
      fontFamily: "inherit",
    }),

    successOverlay: {
      position: "fixed" as const,
      inset: 0,
      background: "rgba(0,0,0,0.55)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(4px)",
    },

    successCard: {
      background: t.panel,
      borderRadius: "24px",
      padding: "48px 40px",
      textAlign: "center" as const,
      display: "flex",
      flexDirection: "column" as const,
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.4)",
      animation: "popIn 0.35s cubic-bezier(.34,1.56,.64,1)",
    },
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        /* Card hover effects */
        .ns-product-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.18) !important; }
        .ns-product-card:hover .ns-product-img { transform: scale(1.06); }
        .ns-add-btn:hover { transform: scale(1.12); }
        .ns-opt-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
        .ns-cat-btn:hover { opacity: 0.85; }
        .ns-qty-btn:hover { opacity: 0.8; }
        .ns-process-btn:not(:disabled):hover { transform: translateY(-2px); filter: brightness(1.08); }
        .ns-comprobante-btn:hover { opacity: 0.85; }
        .ns-pay-method:hover { opacity: 0.85; }

        /* Responsive grid — cards push cleanly to next row, never overlapping */
        .ns-grid {
          display: grid !important;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
          grid-auto-rows: max-content !important;
          gap: 16px !important;
          overflow-y: auto !important;
          padding-right: 6px !important;
          padding-bottom: 40px !important;
          flex: 1 !important;
          min-height: 0 !important;
          align-content: start !important;
        }
        @media (max-width: 1200px) {
          .ns-grid { grid-template-columns: repeat(auto-fill, minmax(175px, 1fr)) !important; gap: 14px !important; }
        }
        /* Medium viewport or zoomed-in: 2-col min */
        @media (max-width: 900px) {
          .ns-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; gap: 10px !important; }
        }
        /* Small viewport */
        @media (max-width: 640px) {
          .ns-grid { grid-template-columns: 1fr 1fr !important; gap: 8px !important; }
        }

        .ns-product-card {
          display: flex !important;
          flex-direction: column !important;
          height: 100% !important;
          position: relative !important;
        }

        /* Scrollbars */
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.25); border-radius: 10px; }

        /* Animations */
        @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes checkPop { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        .check-anim { animation: checkPop 0.5s cubic-bezier(.34,1.56,.64,1) 0.1s both; }
        .ns-success-card { animation: popIn 0.35s cubic-bezier(.34,1.56,.64,1); }
      `}</style>

      {/* Success overlay */}
      {ventaExitosa && (
        <div style={S.successOverlay}>
          <div style={S.successCard}>
            <CheckCircle2 size={72} color={t.success} className="check-anim" />
            <div>
              <p style={{ fontSize: "24px", fontWeight: 800, color: t.text, margin: "0 0 6px" }}>
                ¡Venta procesada!
              </p>
              <p style={{ fontSize: "14px", color: t.textSub, margin: 0 }}>
                {formatSoles(total)} — {tipoComprobante}
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={S.root}>
        {/* ════════════════════════════════════ LEFT PANEL ═══════════════════════════════════════ */}
        <div style={S.left}>

          {/* Search + header */}
          <div style={S.topBar}>
            <div style={{ flex: 1 }}>
              <h1 style={{ fontSize: "20px", fontWeight: 800, color: t.text, margin: "0 0 2px" }}>
                Nueva Venta
              </h1>
              <p style={{ fontSize: "12px", color: t.textMuted, margin: 0 }}>
                Selecciona los productos para agregar al comprobante
              </p>
            </div>
          </div>

          {/* Search bar */}
          <div style={S.searchWrap}>
            <Search size={16} style={S.searchIcon} />
            <input
              style={S.searchInput}
              placeholder="Buscar por nombre, genérico o laboratorio..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = t.accent)}
              onBlur={(e) => (e.currentTarget.style.borderColor = t.border)}
            />
          </div>

          {/* Categories */}
          <div style={S.categoriesRow}>
            {categorias.map((cat) => {
              const Icon = cat.icon;
              const active = categoriaActiva === cat.id;
              return (
                <button
                  key={cat.id}
                  className="ns-cat-btn"
                  style={S.catBtn(active)}
                  onClick={() => setCategoriaActiva(cat.id)}
                >
                  <Icon size={14} />
                  {cat.label}
                  <span style={{
                    background: active ? "rgba(255,255,255,0.25)" : t.input,
                    color: active ? "#fff" : t.textMuted,
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "10px",
                  }}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Products count */}
          <div style={S.sectionInfo}>
            <h2 style={S.sectionTitle}>Productos disponibles</h2>
            <span style={S.sectionCount}>{productosFiltrados.length} resultados</span>
          </div>

          {/* Products grid */}
          <div className="ns-grid" style={S.grid}>
            {productosFiltrados.length === 0 ? (
              <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px 20px", color: t.textMuted }}>
                <Package size={48} style={{ marginBottom: "12px", opacity: 0.4 }} />
                <p style={{ fontWeight: 600, margin: "0 0 4px" }}>Sin resultados</p>
                <p style={{ fontSize: "13px" }}>Prueba con otro término de búsqueda</p>
              </div>
            ) : (
              productosFiltrados.map((producto) => {
                const opcionActiva =
                  producto.opciones.find(
                    (opt) => opt.label === (opcionSeleccionada[producto.id] || producto.opciones[0].label)
                  ) || producto.opciones[0];

                return (
                  <article
                    key={producto.id}
                    className="ns-product-card"
                    style={S.productCard(producto.accent)}
                    onClick={() => agregarAlCarrito(producto)}
                  >
                    {/* Badge receta superior */}
                    {producto.requiereReceta && (
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          background: "rgba(239,68,68,0.92)",
                          color: "#fff",
                          fontSize: "9px",
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: "8px",
                          backdropFilter: "blur(4px)",
                          zIndex: 2,
                        }}
                      >
                        RECETA
                      </div>
                    )}

                    {/* Stock badge */}
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "rgba(0,0,0,0.5)",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "8px",
                        backdropFilter: "blur(4px)",
                        zIndex: 2,
                      }}
                    >
                      {producto.stock} uds
                    </div>

                    {/* Image — placeholder gradient always visible; photo overlaid on top via z-index */}
                    <div style={S.productImgWrap(producto.accent)}>
                      <Pill
                        size={34}
                        color={producto.accent}
                        style={{
                          opacity: 0.6,
                          flexShrink: 0,
                          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.25))",
                        }}
                      />
                      <img
                        className="ns-product-img"
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={S.productImg}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Body */}
                    <div style={S.productBody}>
                      <h3 style={S.productName}>{producto.nombre}</h3>
                      <p style={S.productSub}>{producto.generico}</p>
                      <p style={S.productMeta}>
                        <span
                          style={{
                            display: "inline-block",
                            background: `${producto.accent}20`,
                            color: producto.accent,
                            fontSize: "10px",
                            fontWeight: 700,
                            padding: "1px 7px",
                            borderRadius: "8px",
                            marginRight: "4px",
                          }}
                        >
                          {producto.categoriaLabel}
                        </span>
                        {producto.laboratorio}
                      </p>

                      {/* Forma de venta & Receta labels */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: t.textSub,
                          marginTop: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <span>Forma de venta</span>
                        <span>Receta</span>
                      </div>

                      {/* Forma de venta & Receta buttons */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                          gap: "5px",
                        }}
                      >
                        {producto.opciones.map((opt) => {
                          const isSelected = opcionActiva.label === opt.label;
                          return (
                            <button
                              key={opt.label}
                              type="button"
                              className="ns-opt-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpcionSeleccionada((prev) => ({
                                  ...prev,
                                  [producto.id]: opt.label,
                                }));
                              }}
                              style={{
                                height: "26px",
                                borderRadius: "7px",
                                border: isSelected
                                  ? `1.5px solid ${producto.accent}`
                                  : `1px solid ${t.border}`,
                                background: isSelected ? `${producto.accent}22` : t.input,
                                color: isSelected ? producto.accent : t.textMuted,
                                fontSize: "10px",
                                fontWeight: 800,
                                cursor: "pointer",
                                padding: 0,
                                transition: "all 0.15s ease",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              title={`${opt.label} (${opt.shortLabel}) - ${formatSoles(opt.precio)}`}
                            >
                              {opt.shortLabel}
                            </button>
                          );
                        })}

                        {/* Botón de estado de receta */}
                        <button
                          type="button"
                          className="ns-receta-btn"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            height: "26px",
                            borderRadius: "7px",
                            border: producto.requiereReceta
                              ? "1px solid rgba(245, 158, 11, 0.5)"
                              : "1px solid rgba(15, 191, 112, 0.4)",
                            background: producto.requiereReceta
                              ? "rgba(245, 158, 11, 0.14)"
                              : "rgba(15, 191, 112, 0.10)",
                            color: producto.requiereReceta ? "#f59e0b" : "#0fbf70",
                            fontSize: "10px",
                            fontWeight: 800,
                            cursor: "default",
                            padding: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                          title={producto.requiereReceta ? "Requiere receta médica" : "Venta libre (Sin receta)"}
                        >
                          {producto.requiereReceta ? "SI" : "NO"}
                        </button>
                      </div>

                      {/* Bottom action area: Precio, Botón Agregar y Disponibilidad */}
                      <div style={{ marginTop: "auto", paddingTop: "8px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <span style={S.productPrice(producto.accent)}>
                              {formatSoles(opcionActiva.precio)}
                            </span>
                            <span
                              style={{
                                fontSize: "10px",
                                color: t.textMuted,
                                marginLeft: "3px",
                              }}
                            >
                              / {opcionActiva.label}
                            </span>
                          </div>
                          <button
                            className="ns-add-btn"
                            style={S.addBtn(producto.accent)}
                            onClick={(e) => {
                              e.stopPropagation();
                              agregarAlCarrito(producto);
                            }}
                            title={`Agregar ${producto.nombre} (${opcionActiva.label}) al carrito`}
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Sold indicator */}
                        <p
                          style={{
                            fontSize: "10px",
                            color: t.textMuted,
                            margin: "4px 0 0",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: t.success,
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          Disponible · {producto.vendidos} vendidos
                        </p>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* ════════════════════════════════════ RIGHT PANEL - BILL ══════════════════════════════ */}
        <div style={S.right}>

          {/* Bill header */}
          <div style={S.billHeader}>
            <h2 style={S.billTitle}>Comprobante</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {carrito.length > 0 && (
                <button
                  onClick={limpiarCarrito}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: t.danger,
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  title="Limpiar carrito"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <span style={S.billCount}>
                {itemCount} {itemCount === 1 ? "ítem" : "ítems"}
              </span>
            </div>
          </div>

          {/* Cart items */}
          <div style={S.billItems}>
            {carrito.length === 0 ? (
              <div style={S.emptyCart}>
                <Lottie
                  animationData={cartEmptyAnimation}
                  loop={true}
                  style={{ width: 110, height: 110 }}
                />
                <div style={{ textAlign: "center" }}>
                  <p style={{ fontWeight: 700, color: t.textSub, margin: "0 0 4px", fontSize: "15px" }}>
                    Carrito vacío
                  </p>
                  <p style={{ color: t.textMuted, margin: 0, fontSize: "13px" }}>
                    Haz clic en un producto para agregarlo
                  </p>
                </div>
              </div>
            ) : (
              carrito.map((item) => (
                <div key={item.key} style={S.billItem}>
                  {/* Thumbnail */}
                  <div>
                    <img
                      src={item.producto.imagen}
                      alt={item.producto.nombre}
                      style={S.billItemImg}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                        const ph = e.currentTarget.nextElementSibling as HTMLElement;
                        if (ph) ph.style.display = "flex";
                      }}
                    />
                    <div style={{ ...S.billItemImgPlaceholder(item.producto.accent), display: "none" }}>
                      <Pill size={20} color={item.producto.accent} />
                    </div>
                  </div>

                  {/* Info */}
                  <div style={S.billItemInfo}>
                    <p style={S.billItemName}>{item.producto.nombre}</p>
                    <p style={S.billItemSub}>
                      {item.producto.categoriaLabel} ·{" "}
                      <span style={{ color: item.producto.accent, fontWeight: 700 }}>
                        {item.opcionLabel} ({item.opcionShortLabel})
                      </span>
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div style={S.qtyControl}>
                    <button
                      className="ns-qty-btn"
                      style={S.qtyBtn()}
                      onClick={() => actualizarCantidad(item.key, -1)}
                    >
                      <Minus size={11} />
                    </button>
                    <span style={S.qtyNum}>{item.cantidad}</span>
                    <button
                      className="ns-qty-btn"
                      style={S.qtyBtn(t.accent)}
                      onClick={() => actualizarCantidad(item.key, 1)}
                    >
                      <Plus size={11} />
                    </button>
                  </div>

                  {/* Price + remove */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                    <span style={S.billItemPrice(item.producto.accent)}>
                      {formatSoles(item.precioUnitario * item.cantidad)}
                    </span>
                    <button
                      style={{ background: "none", border: "none", cursor: "pointer", color: t.textMuted, padding: "0" }}
                      onClick={() => eliminarDelCarrito(item.key)}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {carrito.length > 0 && (
            <div style={S.summarySection}>
              <div style={S.summaryRow}>
                <span style={S.summaryLabel}>Ítems ({itemCount})</span>
                <span style={S.summaryValue}>{formatSoles(subtotal)}</span>
              </div>
              <div style={S.summaryRow}>
                <span style={S.summaryLabel}>IGV incluido (18%)</span>
                <span style={S.summaryValue}>{formatSoles(igvIncluido)}</span>
              </div>
              <div style={S.divider} />
              <div style={S.totalRow}>
                <span style={S.totalLabel}>Total</span>
                <span style={S.totalValue}>{formatSoles(total)}</span>
              </div>
            </div>
          )}

          {/* Payment section */}
          <div style={S.paymentSection}>
            {/* Tipo comprobante */}
            <p style={S.paymentLabel}>Comprobante</p>
            <div style={S.comprobanteRow}>
              {(["BOLETA", "FACTURA", "TICKET"] as TipoComprobante[]).map((tc) => (
                <button
                  key={tc}
                  className="ns-comprobante-btn"
                  style={S.comprobanteBtn(tipoComprobante === tc)}
                  onClick={() => setTipoComprobante(tc)}
                >
                  {tc}
                </button>
              ))}
            </div>

            {/* Cliente para factura */}
            {tipoComprobante === "FACTURA" && (
              <div>
                <div style={{ position: "relative" }}>
                  <User size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} />
                  <select
                    value={clienteSeleccionado}
                    onChange={(e) => setClienteSeleccionado(Number(e.target.value))}
                    style={{
                      ...S.montoInput,
                      paddingLeft: "34px",
                      cursor: "pointer",
                      color: clienteSeleccionado ? t.text : t.textMuted,
                    }}
                  >
                    <option value="">Seleccionar cliente (RUC)...</option>
                    {mockClientes.filter(c => c.tipo === "RUC").map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} — {c.documento}</option>
                    ))}
                  </select>
                </div>
                {tipoComprobante === "FACTURA" && !clienteSeleccionado && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                    <AlertCircle size={13} color={t.orange} />
                    <p style={{ fontSize: "11px", color: t.orange, margin: 0 }}>
                      Selecciona un cliente con RUC para factura
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Método de pago */}
            <p style={{ ...S.paymentLabel, marginBottom: "4px" }}>Método de pago</p>
            <div style={S.paymentMethodsRow}>
              {metodosPago.map((mp) => {
                const Icon = mp.icon;
                const active = metodoPago === mp.id;
                return (
                  <button
                    key={mp.id}
                    className="ns-pay-method"
                    style={S.payMethod(active)}
                    onClick={() => {
                      setMetodoPago(mp.id);
                      if (mp.id !== "EFECTIVO") setMontoPagado("");
                    }}
                  >
                    <Icon size={18} style={S.payMethodIcon(active)} />
                    <span style={S.payMethodLabel(active)}>{mp.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Monto pagado (solo efectivo) */}
            {metodoPago === "EFECTIVO" && (
              <div>
                <div style={{ position: "relative" }}>
                  <DollarSign size={14} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, pointerEvents: "none" }} />
                  <input
                    type="number"
                    placeholder="Monto recibido..."
                    value={montoPagado}
                    min={0}
                    step={0.1}
                    onChange={(e) => setMontoPagado(e.target.value)}
                    style={{ ...S.montoInput, paddingLeft: "34px" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = t.accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = t.border)}
                  />
                </div>
                {montoPagado && parseFloat(montoPagado) >= total && total > 0 && (
                  <div style={S.vueltoBox}>
                    <span style={{ fontSize: "13px", fontWeight: 700, color: t.success }}>Vuelto</span>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: t.success }}>
                      {formatSoles(vuelto)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Process button */}
            <button
              className="ns-process-btn"
              style={S.processBtn(carrito.length === 0)}
              disabled={carrito.length === 0}
              onClick={procesarVenta}
            >
              <Receipt size={18} />
              Procesar Venta · {formatSoles(total)}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


