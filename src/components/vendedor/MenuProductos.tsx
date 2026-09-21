import { useState } from "react";
import type { CSSProperties } from "react";
import { ChevronDown, Minus, Pill, Plus, ShoppingCart } from "lucide-react";
import {
  categories,
  formatCurrency,
  products,
  type CategoryId,
  type Product,
  type ProductSelection,
} from "./posData";

interface MenuProductosProps {
  activeCategory: CategoryId;
  filteredProducts: Product[];
  selectionByProduct: Record<number, ProductSelection>;
  selectedProductId: number;
  onSelectCategory: (category: CategoryId) => void;
  onSelectProduct: (productId: number) => void;
  onUpdateSelection: (productId: number, patch: Partial<ProductSelection>) => void;
  onChangeQuantity: (productId: number, direction: "up" | "down") => void;
  onAddToCart: (product: Product) => void;
}

export default function MenuProductos({
  activeCategory,
  filteredProducts,
  selectionByProduct,
  // selectedProductId se mantiene en la interfaz por compatibilidad con PuntoVenta
  // pero el estado visual de expansión ahora es local (expandedProductId)
  onSelectCategory,
  onSelectProduct,
  onUpdateSelection,
  onChangeQuantity,
  onAddToCart,
}: MenuProductosProps) {
  // Estado local: qué tarjeta está expandida (null = ninguna)
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);

  const handleCardClick = (productId: number) => {
    // Alternar: si ya está expandida → contraer, si no → expandir y cerrar la anterior
    setExpandedProductId((prev) => (prev === productId ? null : productId));
    onSelectProduct(productId);
  };

  const handleAddToCart = (product: Product) => {
    onAddToCart(product);
    // Mantener la tarjeta expandida después de agregar al carrito (comportamiento actual)
  };

  return (
    <>
      <div className="seller-section-heading">
        <div>
          <p className="seller-eyebrow">Categorías</p>
          <h2>Selecciona productos</h2>
        </div>
        <span>Mostrando {filteredProducts.length} productos</span>
      </div>

      <div className="seller-categories" aria-label="Categorias de productos">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              className={`seller-category ${isActive ? "is-active" : ""}`}
              onClick={() => onSelectCategory(category.id)}
            >
              <Icon size={26} />
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      <div className="seller-section-heading seller-product-heading">
        <div>
          <p className="seller-eyebrow">Mostrador</p>
          <h2>Productos disponibles</h2>
        </div>
        <span>{products.reduce((sum, product) => sum + product.stock, 0)} unidades en stock</span>
      </div>

      <div className="seller-product-grid">
        {filteredProducts.map((product) => {
          const selection = selectionByProduct[product.id];
          const option =
            product.saleOptions.find((item) => item.label === selection.saleType) || product.saleOptions[0];
          const isExpanded = expandedProductId === product.id;

          return (
            <article
              key={product.id}
              className={`seller-product-card ${isExpanded ? "is-expanded" : ""}`}
              onClick={() => handleCardClick(product.id)}
              style={{ "--product-accent": product.accent } as CSSProperties}
            >
              {/* ── ESTADO SIEMPRE VISIBLE (contraído y expandido) ── */}
              <div className="seller-product-top">
                {/* Imagen grande en la parte superior de la tarjeta */}
                <div className="seller-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <Pill className="seller-product-fallback" size={44} />
                </div>
                <div className="seller-product-main">
                  <div className="seller-product-info">
                    <h3>{product.name}</h3>
                    {product.genericName && (
                      <p className="seller-product-generic">{product.genericName}</p>
                    )}
                    <p className="seller-product-meta">
                      {product.stock} disponibles · {product.sold} vendidos
                    </p>
                    <strong>{formatCurrency(option.price)}</strong>
                  </div>

                  {/* Indicador de expansión */}
                  <button
                    className={`seller-expand-icon ${isExpanded ? "is-open" : ""}`}
                    aria-label={isExpanded ? "Contraer tarjeta" : "Expandir tarjeta"}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(product.id);
                    }}
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
              </div>

              {/* Botón "Seleccionar producto" (solo visible cuando está CONTRAÍDO) */}
              {!isExpanded && (
                <button
                  className="seller-select-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCardClick(product.id);
                  }}
                >
                  Seleccionar producto
                </button>
              )}

              {/* ── SECCIÓN EXPANDIBLE (solo visible cuando está seleccionada) ── */}
              <div className={`seller-card-expandable ${isExpanded ? "is-open" : ""}`}>
                <div className="seller-card-expandable-inner">
                  {/* Separador visual */}
                  <div className="seller-card-divider" />

                  {/* Forma de venta + Receta */}
                  <div className="seller-card-row">
                    <span>Forma de venta</span>
                    <span>Receta</span>
                  </div>
                  <div className="seller-option-row">
                    {product.saleOptions.map((saleOption) => (
                      <button
                        key={saleOption.label}
                        className={selection.saleType === saleOption.label ? "is-active" : ""}
                        onClick={(event) => {
                          event.stopPropagation();
                          onUpdateSelection(product.id, { saleType: saleOption.label });
                        }}
                      >
                        {saleOption.shortLabel}
                      </button>
                    ))}
                    <button
                      className={product.requiresPrescription ? "is-warning" : "is-active"}
                      onClick={(event) => event.stopPropagation()}
                    >
                      {product.requiresPrescription ? "SI" : "NO"}
                    </button>
                  </div>

                  {/* Laboratorio + Cantidad */}
                  <div className="seller-card-row seller-card-row-spaced">
                    <span>Laboratorio</span>
                    <span>Cantidad</span>
                  </div>
                  <div className="seller-product-bottom">
                    <span className="seller-lab-pill">{product.laboratory}</span>
                    <div className="seller-amount">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeQuantity(product.id, "down");
                        }}
                        aria-label="Restar cantidad"
                      >
                        <Minus size={14} />
                      </button>
                      <strong>{selection.quantity}</strong>
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          onChangeQuantity(product.id, "up");
                        }}
                        aria-label="Sumar cantidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Botón Agregar al carrito */}
                  <button
                    className="seller-add-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleAddToCart(product);
                    }}
                  >
                    <ShoppingCart size={17} />
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}