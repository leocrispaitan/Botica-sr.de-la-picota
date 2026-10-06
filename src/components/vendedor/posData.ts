export type CategoryId = string;

export type PaymentMethod = "cash" | "card" | "yape";
export type SellerView = "menu" | "orders" | "history" | "clients" | "profile";

export interface SaleOption {
  label: string;
  shortLabel: string;
  price: number;
  /** Código de presentación (TAB/BL/CJ/CAP/UND/FCO...) */
  codigo: string;
  /** Nombre de la unidad (Tableta, Blíster, Caja...) para mostrar "S/ 0.50 / Tableta" */
  nombreUnidad: string;
  /** Cuántas unidades base equivale 1 unidad de esta presentación (ej. TAB de caja-10 = 0.1) */
  factorABase: number;
}

export interface Product {
  id: number;
  name: string;
  genericName: string;
  category: CategoryId;
  categoryLabel: string;
  /** Stock en unidades base (ej. cajas). El POS muestra el equivalente fraccionado. */
  stock: number;
  sold: number;
  requiresPrescription: boolean;
  laboratory: string;
  image: string;
  accent: string;
  saleOptions: SaleOption[];
}

export interface ProductSelection {
  saleType: string;
  quantity: number;
}

export interface CartItem {
  key: string;
  product: Product;
  saleType: string;
  unitPrice: number;
  quantity: number;
  /** Presentación elegida para trazabilidad y envío al backend */
  presentacionCodigo: string;
  factorABase: number;
}

export const recentSales = [
  { id: "#V-1048", customer: "Cliente mostrador", time: "09:42", total: 37.5, items: 3 },
  { id: "#V-1047", customer: "Rosa Velásquez", time: "09:18", total: 82.8, items: 5 },
  { id: "#V-1046", customer: "Farmacia San Martín", time: "08:55", total: 156.4, items: 9 },
];

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(value);

/** Stock puede ser fraccionado (0.1 base por TAB): enteros tal cual, resto máx. 3 decimales sin ceros. */
export const formatStock = (value: number): string => {
  if (!Number.isFinite(value)) return "0";
  if (Number.isInteger(value)) return `${value}`;
  return `${Number(value.toFixed(3))}`;
};

/** DNI enmascarado para el comprobante: 63381113 -> 63****13 */
export const maskDni = (dni: string | null | undefined): string => {
  if (!dni || dni.length < 4) return "***";
  return `${dni.slice(0, 2)}****${dni.slice(-2)}`;
};

export const getInitialSelections = (productList: Product[]) =>
  productList.reduce<Record<number, ProductSelection>>((acc, product) => {
    acc[product.id] = {
      saleType: product.saleOptions[0].label,
      quantity: 1,
    };
    return acc;
  }, {});