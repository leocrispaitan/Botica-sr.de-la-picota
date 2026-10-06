import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { formatCurrency, type CartItem } from "./posData";

interface OrdenActualProps {
  cartItems: CartItem[];
  onUpdateQuantity: (cartKey: string, quantity: number) => void;
  onRemoveItem?: (cartKey: string) => void;
  onCheckout?: () => void;
}

export default function OrdenActual({ cartItems, onUpdateQuantity, onRemoveItem, onCheckout }: OrdenActualProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = subtotal >= 100 ? subtotal * 0.05 : 0;
  const total = subtotal - discount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <section className="v2-order">
      <style>{`
        .v2-order { display: flex; flex-direction: column; gap: 16px; }
        .v2-head-eyebrow {
          margin: 0 0 4px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #0E9F6E;
        }
        .v2-head-title { margin: 0; font-size: 24px; font-weight: 800; color: #0F172A; }
        .v2-head-sub { margin: 4px 0 0; font-size: 14px; color: #64748B; }
        .v2-card {
          background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
        }
        .v2-order-list { overflow: hidden; }
        .v2-order-row {
          display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px;
          padding: 14px 16px; border-bottom: 1px solid #F1F5F9; align-items: center;
        }
        .v2-order-row:last-child { border-bottom: 0; }
        .v2-order-name { margin: 0; font-size: 15px; font-weight: 700; color: #0F172A; }
        .v2-order-meta { margin: 2px 0 0; font-size: 13px; color: #64748B; }
        .v2-order-badge {
          display: inline-block; margin-right: 6px; padding: 2px 8px; border-radius: 999px;
          background: #ECFDF5; color: #0B7A55; font-size: 11px; font-weight: 800;
          border: 1px solid #A7F3D0;
        }
        .v2-order-right { display: flex; align-items: center; gap: 10px; }
        .v2-stepper { display: flex; align-items: center; gap: 2px; border: 1px solid #E5E7EB; border-radius: 999px; padding: 2px; }
        .v2-stepper button {
          width: 28px; height: 28px; display: grid; place-items: center;
          border: 0; border-radius: 50%; background: transparent; color: #0F172A; cursor: pointer;
        }
        .v2-stepper button:hover { background: #F1F5F9; }
        .v2-stepper strong { min-width: 28px; text-align: center; font-size: 14px; font-variant-numeric: tabular-nums; }
        .v2-order-total { min-width: 86px; text-align: right; font-size: 15px; font-weight: 800; color: #0F172A; font-variant-numeric: tabular-nums; }
        .v2-icon-btn {
          width: 32px; height: 32px; display: grid; place-items: center;
          border: 1px solid #FECACA; border-radius: 9px; background: #fff; color: #DC2626; cursor: pointer;
        }
        .v2-icon-btn:hover { background: #FEF2F2; }
        .v2-summary { padding: 16px; }
        .v2-summary-row { display: flex; justify-content: space-between; font-size: 14px; color: #475569; padding: 3px 0; }
        .v2-summary-row strong { color: #0F172A; font-variant-numeric: tabular-nums; }
        .v2-summary-grand {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 10px; padding-top: 12px; border-top: 1px solid #E5E7EB;
          font-size: 17px; font-weight: 800; color: #0F172A;
        }
        .v2-summary-grand strong { color: #0E9F6E; font-size: 22px; font-variant-numeric: tabular-nums; }
        .v2-primary-btn {
          width: 100%; margin-top: 12px; padding: 13px; border: 0; border-radius: 12px;
          background: #0E9F6E; color: #fff; font: inherit; font-size: 15px; font-weight: 800;
          display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer;
        }
        .v2-primary-btn:hover { background: #0B7A55; }
        .v2-hint { margin: 10px 2px 0; font-size: 13px; color: #64748B; }
        .v2-empty {
          padding: 48px 24px; text-align: center; display: grid; gap: 10px; justify-items: center;
        }
        .v2-empty-icon {
          width: 56px; height: 56px; border-radius: 16px; display: grid; place-items: center;
          background: #F1F5F9; color: #94A3B8;
        }
        .v2-empty strong { font-size: 17px; color: #0F172A; }
        .v2-empty span { font-size: 14px; color: #64748B; max-width: 340px; }
        .v2-secondary-btn {
          margin-top: 6px; padding: 11px 22px; border-radius: 999px; cursor: pointer;
          border: 1px solid #0E9F6E; background: #fff; color: #0B7A55;
          font: inherit; font-size: 14px; font-weight: 800;
        }
        .v2-secondary-btn:hover { background: #ECFDF5; }
        @media (max-width: 560px) {
          .v2-order-row { grid-template-columns: minmax(0, 1fr); }
          .v2-order-right { justify-content: space-between; }
        }
      `}</style>

      <div>
        <p className="v2-head-eyebrow">Orden actual</p>
        <h2 className="v2-head-title">Carrito de venta</h2>
        <p className="v2-head-sub">
          {cartItems.length === 0 ? "Sin productos por cobrar." : `${itemCount} unidades en ${cartItems.length} líneas.`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="v2-card v2-empty">
          <span className="v2-empty-icon"><ShoppingCart size={26} /></span>
          <strong>Carrito vacío</strong>
          <span>Explora el mostrador, elige presentación (tableta, blíster o caja) y agrégala para empezar a cobrar.</span>
          {onCheckout && (
            <button type="button" className="v2-secondary-btn" onClick={onCheckout}>
              Explorar productos
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="v2-card v2-order-list">
            {cartItems.map((item) => (
              <article key={item.key} className="v2-order-row">
                <div>
                  <p className="v2-order-name">{item.product.name}</p>
                  <p className="v2-order-meta">
                    <span className="v2-order-badge">{item.saleType}</span>
                    {formatCurrency(item.unitPrice)} c/u
                  </p>
                </div>
                <div className="v2-order-right">
                  <div className="v2-stepper">
                    <button type="button" onClick={() => onUpdateQuantity(item.key, item.quantity - 1)} aria-label="Restar">
                      <Minus size={14} />
                    </button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => onUpdateQuantity(item.key, item.quantity + 1)} aria-label="Sumar">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="v2-order-total">{formatCurrency(item.unitPrice * item.quantity)}</span>
                  {onRemoveItem && (
                    <button type="button" className="v2-icon-btn" onClick={() => onRemoveItem(item.key)} aria-label="Quitar de la orden">
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="v2-card v2-summary">
            <div className="v2-summary-row"><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></div>
            <div className="v2-summary-row"><span>Descuento (5% desde S/ 100)</span><strong>-{formatCurrency(discount)}</strong></div>
            <div className="v2-summary-grand"><span>Total a cobrar</span><strong>{formatCurrency(total)}</strong></div>
            {onCheckout && (
              <button type="button" className="v2-primary-btn" onClick={onCheckout}>
                Ir a pagar <ArrowRight size={17} />
              </button>
            )}
            <p className="v2-hint">El pago, comprobante y cliente se completan en el panel Detalle de venta.</p>
          </div>
        </>
      )}
    </section>
  );
}
