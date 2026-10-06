import { useEffect, useState } from "react";
import { formatCurrency } from "./posData";
import ventasService, { type Venta } from "../../services/ventasService";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    ventasService
      .getHistorialTurno()
      .then((data) => {
        if (!active) return;
        setVentas(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || "No se pudo cargar el historial del turno.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="seller-panel-view">
        <div>
          <p className="seller-eyebrow">Ventas recientes</p>
          <h2>Historial del turno</h2>
        </div>
        <p>Cargando ventas del turno...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="seller-panel-view">
        <div>
          <p className="seller-eyebrow">Ventas recientes</p>
          <h2>Historial del turno</h2>
        </div>
        <p>{error}</p>
      </section>
    );
  }

  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Ventas recientes</p>
        <h2>Historial del turno ({ventas.length})</h2>
      </div>
      <div className="seller-history-list">
        {ventas.length === 0 ? (
          <p>Aún no hay ventas registradas en este turno.</p>
        ) : (
          ventas.map((sale) => (
            <article key={sale.id_venta} className="seller-history-row">
              <div>
                <strong>#V-{sale.id_venta}</strong>
                <span>{sale.cliente?.nombre_razon_social || "Cliente mostrador"}</span>
              </div>
              <div>
                <span>
                  {sale.items ?? sale.detalle_venta?.length ?? 0} items · {sale.tipo_comprobante}
                </span>
                <strong>{formatCurrency(Number(sale.total_pagar))}</strong>
                <small>{new Date(sale.fecha_venta).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}</small>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
