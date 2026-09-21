import { useEffect, useState } from "react";
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
  /** Emoji propio de la categoría (ej. 🦠 ANTIBIOTICOS, 🧴 DERMATOLOGICOS). */
  emoji: string;
  /** Color propio del icono de la categoría (cada categoría tiene el suyo). */
  color: string;
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

/** Emoji por coincidencia de palabra clave en el nombre real de la categoría. */
const CATEGORY_EMOJIS: Array<{ keywords: string[]; emoji: string }> = [
  { keywords: ["ANALGESICO", "DOLOR"], emoji: "💊" },
  { keywords: ["ANTIBIOTICO"], emoji: "🦠" },
  { keywords: ["ANTIINFLAMAT"], emoji: "🧊" },
  { keywords: ["DIGESTIVO", "GASTRO", "ANTIACIDO"], emoji: "🍽️" },
  { keywords: ["RESPIRATORIO", "BRONQUIAL"], emoji: "🫁" },
  { keywords: ["DERMATO", "TOPICO"], emoji: "🧴" },
  { keywords: ["ALERGIA", "ANTIHISTAMINICO"], emoji: "🤧" },
  { keywords: ["CARDIOVASCULAR", "CARDIACO"], emoji: "🫀" },
  { keywords: ["VITAMINA", "SUPLEMENTO", "MINERAL"], emoji: "🍊" },
  { keywords: ["OFTALMICO", "OPHTALMIC"], emoji: "👁️" },
  { keywords: ["OTICO", "OIDO"], emoji: "👂" },
  { keywords: ["NEUROLOGICO", "NEURO"], emoji: "🧠" },
  { keywords: ["ENDOCRINO", "DIABETES", "GLUCOSA"], emoji: "🩸" },
];

const pickCategoryEmoji = (name: string): string => {
  const upper = (name || "").toUpperCase();
  const match = CATEGORY_EMOJIS.find((item) => item.keywords.some((keyword) => upper.includes(keyword)));
  return match?.emoji ?? "🏥";
};

/** Color del icono por índice de categoría (determinista, basado en la paleta). */
const pickCategoryColor = (index: number): string => ACCENTS[index % ACCENTS.length];

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
          .map((categoria, index) => ({
            id: String(categoria.id_categoria),
            label: categoria.nombre_categoria,
            emoji: pickCategoryEmoji(categoria.nombre_categoria),
            color: pickCategoryColor(index),
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

        setCategories([{ id: "all", label: "Todo", emoji: "🗂️", color: ACCENTS[0] }, ...realCategories]);
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