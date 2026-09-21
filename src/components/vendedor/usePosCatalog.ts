import { useEffect, useState } from "react";
import {
  BadgePercent,
  LayoutGrid,
  Package,
  Pill,
  ReceiptText,
  ShieldCheck,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import categoriesService from "../../services/categoriesService";
import productsService from "../../services/productsService";
import type { Product } from "./posData";

/**
 * Ítem de categoría que consume el menú del POS.
 * id = String(id_categoria) real ("all" representa "Todo").
 */
export interface PosCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface UsePosCatalogResult {
  categories: PosCategory[];
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/** Paleta de acentos determinista por id de producto (solo estética de la tarjeta). */
const ACCENTS = [
  "#0fbf70",
  "#22a7f0",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ef4444",
  "#14b8a6",
  "#f97316",
];

/** Ícono por coincidencia de palabra clave en el nombre real de la categoría. */
const CATEGORY_ICONS: Array<{ keywords: string[]; icon: LucideIcon }> = [
  { keywords: ["ANALGESICO", "DOLOR"], icon: Pill },
  { keywords: ["ANTIBIOTICO"], icon: ShieldCheck },
  { keywords: ["DIGESTIVO", "GASTRO", "ANTIACIDO"], icon: Package },
  { keywords: ["ALERGIA", "ANTIHISTAMINICO"], icon: BadgePercent },
  { keywords: ["RESPIRATORIO", "BRONQUIAL"], icon: Stethoscope },
  { keywords: ["DIABETES", "GLUCOSA"], icon: ReceiptText },
];

const pickCategoryIcon = (name: string): LucideIcon => {
  const upper = (name || "").toUpperCase();
  const match = CATEGORY_ICONS.find((item) => item.keywords.some((keyword) => upper.includes(keyword)));
  return match?.icon ?? Package;
};

/**
 * Carga categorías y productos reales desde el backend
 * (GET /api/v1/categories y GET /api/v1/products) y los adapta
 * a las formas que ya usa el POS, manteniendo el diseño intacto.
 */
export default function usePosCatalog(): UsePosCatalogResult {
  const [categories, setCategories] = useState<PosCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    Promise.all([categoriesService.getAllCategories(), productsService.getAllProducts()])
      .then(([categorias, productos]) => {
        if (!active) return;

        const realCategories = (categorias || [])
          .filter((categoria) => categoria.estado_logico !== false)
          .map((categoria) => ({
            id: String(categoria.id_categoria),
            label: categoria.nombre_categoria,
            icon: pickCategoryIcon(categoria.nombre_categoria),
          }));

        const realProducts = (productos || [])
          .filter((producto) => producto.estado_logico !== false)
          .map((producto) => ({
            id: producto.id_producto,
            name: producto.nombre_comercial,
            genericName: producto.nombre_generico,
            category: String(producto.id_categoria),
            categoryLabel: producto.categoria?.nombre_categoria ?? "",
            stock: producto.stock_actual ?? 0,
            sold: 0,
            requiresPrescription: producto.condicion_venta?.requiere_receta ?? false,
            laboratory: producto.laboratorio_titular?.nombre ?? producto.fabricante?.nombre ?? "",
            image: producto.imagen_url ?? "",
            accent: ACCENTS[producto.id_producto % ACCENTS.length],
            saleOptions: [
              {
                label: producto.unidad_medida || "Unidad",
                shortLabel: (producto.unidad_medida || "Unidad").slice(0, 3).toUpperCase(),
                price: Number(producto.precio_venta) || 0,
              },
            ],
          }));

        setCategories([{ id: "all", label: "Todo", icon: LayoutGrid }, ...realCategories]);
        setProducts(realProducts);
        setLoading(false);
      })
      .catch((fetchError) => {
        if (!active) return;
        setError(fetchError?.response?.data?.message || "No se pudieron cargar los productos del servidor.");
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = () => setReloadKey((key) => key + 1);

  return { categories, products, loading, error, reload };
}