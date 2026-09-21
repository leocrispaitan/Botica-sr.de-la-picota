export type CategoryId = string;

export type PaymentMethod = "cash" | "card" | "yape";
export type SellerView = "menu" | "orders" | "history" | "clients" | "profile";

export interface SaleOption {
  label: string;
  shortLabel: string;
  price: number;
}

export interface Product {
  id: number;
  name: string;
  genericName: string;
  category: CategoryId;
  categoryLabel: string;
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

export const getInitialSelections = (productList: Product[]) =>
  productList.reduce<Record<number, ProductSelection>>((acc, product) => {
    acc[product.id] = {
      saleType: product.saleOptions[0].label,
      quantity: 1,
    };
    return acc;
  }, {});