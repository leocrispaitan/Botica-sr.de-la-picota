import { formatCurrency, recentSales } from "./posData";

export default function HistorialVentas() {
  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Ventas recientes</p>
        <h2>Historial del turno</h2>
      </div>
      <div className="seller-history-list">
        {recentSales.map((sale) => (
          <article key={sale.id} className="seller-history-row">
            <div>
              <strong>{sale.id}</strong>
              <span>{sale.customer}</span>
            </div>
            <div>
              <span>{sale.items} items</span>
              <strong>{formatCurrency(sale.total)}</strong>
              <small>{sale.time}</small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}