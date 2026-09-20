import type { CSSProperties } from "react";
import { Minus, Pill, Plus, ShoppingCart } from "lucide-react";
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
  selectedProductId,
  onSelectCategory,
  onSelectProduct,
  onUpdateSelection,
  onChangeQuantity,
  onAddToCart,
}: MenuProductosProps) {
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
          const isSelected = selectedProductId === product.id;

          return (
            <article
              key={product.id}
              className={`seller-product-card ${isSelected ? "is-selected" : ""}`}
              onClick={() => onSelectProduct(product.id)}
              style={{ "--product-accent": product.accent } as CSSProperties}
            >
              <div className="seller-product-top">
                <div className="seller-product-image">
                  <img
                    src={product.image}
                    alt={product.name}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                  <Pill className="seller-product-fallback" size={34} />
                </div>
                <div>
                  <h3>{product.name}</h3>
                  <p>
                    {product.stock} disponibles · {product.sold} vendidos
                  </p>
                  <strong>{formatCurrency(option.price)}</strong>
                </div>
              </div>

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

              <button
                className="seller-add-button"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToCart(product);
                }}
              >
                <ShoppingCart size={17} />
                Agregar al carrito
              </button>
            </article>
          );
        })}
      </div>
    </>
  );
}