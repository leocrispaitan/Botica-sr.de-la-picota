import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../lib/queryKeys";
import { usePosCatalogQuery } from "../../hooks/useVendedorQueries";
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
 * Catálogo del POS sobre TanStack Query (igual que admin): la primera carga
 * va al servidor; al volver a esta vista se muestra la caché al instante.
 */
export default function usePosCatalog(): UsePosCatalogResult {
  const client = useQueryClient();
  const { data, isLoading, isError, error } = usePosCatalogQuery();

  const categorias = data?.categorias || [];
  const productos = data?.productos || [];

  const categories: PosCategory[] = [
    { id: "all", label: "Todo", emoji: "🗂️", color: ACCENTS[0] },
    ...categorias
      .filter((categoria) => categoria.estado_logico !== false)
      .map((categoria, index) => ({
        id: String(categoria.id_categoria),
        label: categoria.nombre_categoria,
        emoji: pickCategoryEmoji(categoria.nombre_categoria),
        color: pickCategoryColor(index),
      })),
  ];

  const products: Product[] = productos
    .filter((producto) => producto.estado_logico !== false)
    .map((producto) => {
      const presentaciones = (producto.presentaciones || []).filter(
        (p) => p.estado_logico !== false && p.permite_venta !== false
      );
      const saleOptions =
        presentaciones.length > 0
          ? presentaciones.map((p) => ({
              label: p.nombre_presentacion,
              shortLabel: p.codigo_presentacion,
              price: Number(p.precio_venta) || 0,
              codigo: p.codigo_presentacion,
              nombreUnidad: p.nombre_presentacion,
              factorABase: Number(p.factor_a_base) || 1,
            }))
          : [
              {
                label: producto.unidad_medida || "Unidad",
                shortLabel: (producto.unidad_medida || "Unidad").slice(0, 3).toUpperCase(),
                price: Number(producto.precio_venta) || 0,
                codigo: (producto.unidad_medida || "UND").slice(0, 3).toUpperCase(),
                nombreUnidad: producto.unidad_medida || "Unidad",
                factorABase: 1,
              },
            ];
      return {
        id: producto.id_producto,
        name: producto.nombre_comercial,
        genericName: producto.nombre_generico,
        category: String(producto.id_categoria),
        categoryLabel: producto.categoria?.nombre_categoria ?? "",
        stock: Number(producto.stock_actual ?? 0),
        sold: Number(producto.vendidos ?? 0),
        requiresPrescription: producto.condicion_venta?.requiere_receta ?? false,
        laboratory: producto.laboratorio_titular?.nombre ?? producto.fabricante?.nombre ?? "",
        image: producto.imagen_url ?? "",
        accent: ACCENTS[producto.id_producto % ACCENTS.length],
        saleOptions,
      };
    });

  const reload = () => {
    void client.invalidateQueries({ queryKey: queryKeys.pos.catalog });
  };

  return {
    categories,
    products,
    loading: isLoading,
    error: isError
      ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "No se pudieron cargar los productos del servidor."
      : null,
    reload,
  };
}
