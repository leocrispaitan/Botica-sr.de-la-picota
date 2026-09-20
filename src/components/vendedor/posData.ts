import type { LucideIcon } from "lucide-react";
import {
  BadgePercent,
  LayoutGrid,
  Package,
  Pill,
  ReceiptText,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export type CategoryId =
  | "all"
  | "pain"
  | "antibiotics"
  | "digestive"
  | "allergy"
  | "respiratory"
  | "diabetes";

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

export const categories: Array<{ id: CategoryId; label: string; icon: LucideIcon }> = [
  { id: "all", label: "Todo", icon: LayoutGrid },
  { id: "pain", label: "Analgésicos", icon: Pill },
  { id: "antibiotics", label: "Antibióticos", icon: ShieldCheck },
  { id: "digestive", label: "Digestivo", icon: Package },
  { id: "allergy", label: "Alergias", icon: BadgePercent },
  { id: "respiratory", label: "Respiratorio", icon: Stethoscope },
  { id: "diabetes", label: "Diabetes", icon: ReceiptText },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500 mg",
    genericName: "Paracetamol",
    category: "pain",
    categoryLabel: "Analgésico",
    stock: 500,
    sold: 64,
    requiresPrescription: false,
    laboratory: "Genfar",
    image:
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=640&q=80",
    accent: "#0fbf70",
    saleOptions: [
      { label: "Tableta", shortLabel: "TAB", price: 0.5 },
      { label: "Blister", shortLabel: "BL", price: 5 },
      { label: "Caja", shortLabel: "CJ", price: 42 },
    ],
  },
  {
    id: 2,
    name: "Ibuprofeno 400 mg",
    genericName: "Ibuprofeno",
    category: "pain",
    categoryLabel: "Antiinflamatorio",
    stock: 300,
    sold: 51,
    requiresPrescription: false,
    laboratory: "Medifarma",
    image:
      "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&w=640&q=80",
    accent: "#22a7f0",
    saleOptions: [
      { label: "Tableta", shortLabel: "TAB", price: 0.8 },
      { label: "Blister", shortLabel: "BL", price: 8 },
      { label: "Caja", shortLabel: "CJ", price: 68 },
    ],
  },
  {
    id: 3,
    name: "Amoxicilina 500 mg",
    genericName: "Amoxicilina",
    category: "antibiotics",
    categoryLabel: "Antibiótico",
    stock: 118,
    sold: 22,
    requiresPrescription: true,
    laboratory: "Portugal",
    image:
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=640&q=80",
    accent: "#f59e0b",
    saleOptions: [
      { label: "Cápsula", shortLabel: "CAP", price: 1.2 },
      { label: "Blister", shortLabel: "BL", price: 12 },
      { label: "Caja", shortLabel: "CJ", price: 98 },
    ],
  },
  {
    id: 4,
    name: "Omeprazol 20 mg",
    genericName: "Omeprazol",
    category: "digestive",
    categoryLabel: "Digestivo",
    stock: 240,
    sold: 39,
    requiresPrescription: false,
    laboratory: "Farmindustria",
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=640&q=80",
    accent: "#8b5cf6",
    saleOptions: [
      { label: "Cápsula", shortLabel: "CAP", price: 1.5 },
      { label: "Blister", shortLabel: "BL", price: 15 },
      { label: "Caja", shortLabel: "CJ", price: 125 },
    ],
  },
  {
    id: 5,
    name: "Loratadina 10 mg",
    genericName: "Loratadina",
    category: "allergy",
    categoryLabel: "Alergias",
    stock: 350,
    sold: 45,
    requiresPrescription: false,
    laboratory: "Bago",
    image:
      "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=640&q=80",
    accent: "#06b6d4",
    saleOptions: [
      { label: "Tableta", shortLabel: "TAB", price: 0.6 },
      { label: "Blister", shortLabel: "BL", price: 6 },
      { label: "Caja", shortLabel: "CJ", price: 52 },
    ],
  },
  {
    id: 6,
    name: "Salbutamol inhalador",
    genericName: "Salbutamol 100 mcg",
    category: "respiratory",
    categoryLabel: "Respiratorio",
    stock: 48,
    sold: 16,
    requiresPrescription: true,
    laboratory: "Glaxo",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=640&q=80",
    accent: "#ef4444",
    saleOptions: [
      { label: "Unidad", shortLabel: "UND", price: 25 },
      { label: "Pack x2", shortLabel: "P2", price: 48 },
      { label: "Caja", shortLabel: "CJ", price: 290 },
    ],
  },
  {
    id: 7,
    name: "Metformina 850 mg",
    genericName: "Metformina",
    category: "diabetes",
    categoryLabel: "Diabetes",
    stock: 600,
    sold: 72,
    requiresPrescription: true,
    laboratory: "AC Farma",
    image:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=640&q=80",
    accent: "#14b8a6",
    saleOptions: [
      { label: "Tableta", shortLabel: "TAB", price: 0.9 },
      { label: "Blister", shortLabel: "BL", price: 9 },
      { label: "Caja", shortLabel: "CJ", price: 76 },
    ],
  },
  {
    id: 8,
    name: "Vitamina C 1 g",
    genericName: "Ácido ascórbico",
    category: "allergy",
    categoryLabel: "Suplemento",
    stock: 180,
    sold: 31,
    requiresPrescription: false,
    laboratory: "Mason",
    image:
      "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=640&q=80",
    accent: "#f97316",
    saleOptions: [
      { label: "Tableta", shortLabel: "TAB", price: 1.1 },
      { label: "Tubo", shortLabel: "TUB", price: 16 },
      { label: "Caja", shortLabel: "CJ", price: 90 },
    ],
  },
];

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

export const getInitialSelections = () =>
  products.reduce<Record<number, ProductSelection>>((acc, product) => {
    acc[product.id] = {
      saleType: product.saleOptions[0].label,
      quantity: 1,
    };
    return acc;
  }, {});