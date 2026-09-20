import { Minus, Plus, ShoppingCart } from "lucide-react";
import { formatCurrency, type CartItem } from "./posData";

interface OrdenActualProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
}

export default function OrdenActual({ cartItems, onUpdateQuantity }: OrdenActualProps) {
  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Orden actual</p>
        <h2>Carrito de venta</h2>
      </div>
      <div className="seller-order-list seller-order-list-large">
        {cartItems.length === 0 ? (
          <div className="seller-empty-cart">
            <ShoppingCart size={34} />
            <span>No hay productos agregados.</span>
          </div>
        ) : (
          cartItems.map((item) => (
            <article key={item.key} className="seller-order-row">
              <div>
                <strong>{item.product.name}</strong>
                <span>
                  {item.saleType} · {formatCurrency(item.unitPrice)}
                </span>
              </div>
              <div className="seller-order-actions">
                <button onClick={() => onUpdateQuantity(item.key, item.quantity - 1)} aria-label="Restar">
                  <Minus size={14} />
                </button>
                <strong>{item.quantity}</strong>
                <button onClick={() => onUpdateQuantity(item.key, item.quantity + 1)} aria-label="Sumar">
                  <Plus size={14} />
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}