import { useEffect, useMemo, useState } from "react";
import { History, ReceiptText, RefreshCw, Search } from "lucide-react";
import { formatCurrency } from "./posData";
import ventasService, { type Venta } from "../../services/ventasService";
import VentaDetalleModal from "./VentaDetalleModal";

export default function HistorialVentas() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [detalleId, setDetalleId] = useState<number | null>(null);

  const cargar = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ventasService.getHistorialTurno();
      setVentas(data);
    } catch (err) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "No se pudo cargar el historial del turno."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtradas = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ventas;
    return ventas.filter((v) =>
      `#v-${v.id_venta}`.includes(q) ||
      String(v.id_venta).includes(q) ||
      (v.cliente?.nombre_razon_social || "mostrador").toLowerCase().includes(q) ||
      v.tipo_comprobante.toLowerCase().includes(q)
    );
  }, [ventas, search]);

  const totalCobrado = ventas.reduce((s, v) => s + Number(v.total_pagar || 0), 0);
  const unidades = ventas.reduce((s, v) => s + (v.items || 0), 0);

  return (
    <section className="v2-history">
      <style>{`
        .v2-history { display: flex; flex-direction: column; gap: 16px; }
        .v2-head-eyebrow {
          margin: 0 0 4px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #0E9F6E;
        }
        .v2-head-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
        .v2-head-title { margin: 0; font-size: 24px; font-weight: 800; color: #0F172A; }
        .v2-head-sub { margin: 4px 0 0; font-size: 14px; color: #64748B; }
        .v2-refresh {
          flex: 0 0 38px; width: 38px; height: 38px; display: grid; place-items: center;
          border: 1px solid #E5E7EB; border-radius: 11px; background: #fff; color: #475569; cursor: pointer;
        }
        .v2-refresh:hover { background: #F8FAFC; color: #0E9F6E; }
        .v2-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .v2-stat {
          background: #0F172A; border-radius: 14px; padding: 14px 16px; color: #fff;
        }
        .v2-stat span { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; }
        .v2-stat strong { display: block; margin-top: 4px; font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
        .v2-stat-accent strong { color: #34D399; }
        .v2-search {
          display: flex; align-items: center; gap: 10px; background: #fff;
          border: 1px solid #E5E7EB; border-radius: 12px; padding: 0 14px; height: 44px; color: #64748B;
        }
        .v2-search input {
          flex: 1; border: 0; outline: 0; background: transparent;
          font: inherit; font-size: 14px; color: #0F172A;
        }
        .v2-card {
          background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05); overflow: hidden;
        }
        .v2-sale-row {
          width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px;
          padding: 13px 16px; border: 0; border-bottom: 1px solid #F1F5F9;
          background: #fff; cursor: pointer; text-align: left; font: inherit;
        }
        .v2-sale-row:last-child { border-bottom: 0; }
        .v2-sale-row:hover { background: #F8FAFC; }
        .v2-sale-id { margin: 0; font-size: 15px; font-weight: 800; color: #0F172A; }
        .v2-sale-client { margin: 2px 0 0; font-size: 13px; color: #64748B; }
        .v2-sale-right { text-align: right; }
        .v2-sale-total { margin: 0; font-size: 15px; font-weight: 800; color: #0E9F6E; font-variant-numeric: tabular-nums; }
        .v2-sale-meta { margin: 2px 0 0; font-size: 12px; color: #64748B; }
        .v2-pill {
          display: inline-block; margin-left: 6px; padding: 2px 8px; border-radius: 999px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.04em;
          background: #F1F5F9; color: #475569; border: 1px solid #E5E7EB;
        }
        .v2-state {
          padding: 44px 20px; text-align: center; color: #64748B; font-size: 14px;
          display: grid; gap: 8px; justify-items: center;
        }
        .v2-state-icon {
          width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center;
          background: #F1F5F9; color: #94A3B8;
        }
        @media (max-width: 640px) { .v2-stats { grid-template-columns: 1fr; } }
      `}</style>

      <div className="v2-head-row">
        <div>
          <p className="v2-head-eyebrow">Ventas recientes</p>
          <h2 className="v2-head-title">Historial del turno</h2>
          <p className="v2-head-sub">Toca una venta para ver su detalle. Solo ves tus ventas de hoy.</p>
        </div>
        <button type="button" className="v2-refresh" onClick={cargar} aria-label="Recargar historial">
          <RefreshCw size={17} />
        </button>
      </div>

      <div className="v2-stats">
        <div className="v2-stat"><span>Ventas hoy</span><strong>{ventas.length}</strong></div>
        <div className="v2-stat v2-stat-accent"><span>Cobrado hoy</span><strong>{formatCurrency(totalCobrado)}</strong></div>
        <div className="v2-stat"><span>Unidades</span><strong>{unidades}</strong></div>
      </div>

      <label className="v2-search">
        <Search size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por número, cliente o comprobante..."
        />
      </label>

      <div className="v2-card">
        {loading ? (
          <div className="v2-state"><History size={26} /><span>Cargando ventas del turno...</span></div>
        ) : error ? (
          <div className="v2-state">
            <span>{error}</span>
            <button type="button" className="v2-refresh" onClick={cargar} aria-label="Reintentar">
              <RefreshCw size={17} />
            </button>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="v2-state">
            <span className="v2-state-icon"><ReceiptText size={24} /></span>
            <span>{ventas.length === 0 ? "Aún no registras ventas en este turno." : "Sin resultados para esa búsqueda."}</span>
          </div>
        ) : (
          filtradas.map((sale) => (
            <button key={sale.id_venta} type="button" className="v2-sale-row" onClick={() => setDetalleId(sale.id_venta)}>
              <div>
                <p className="v2-sale-id">
                  #V-{sale.id_venta}
                  <span className="v2-pill">{sale.tipo_comprobante}</span>
                </p>
                <p className="v2-sale-client">{sale.cliente?.nombre_razon_social || "Cliente mostrador"}</p>
              </div>
              <div className="v2-sale-right">
                <p className="v2-sale-total">{formatCurrency(Number(sale.total_pagar))}</p>
                <p className="v2-sale-meta">
                  {sale.items ?? 0} items · {new Date(sale.fecha_venta).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {detalleId !== null && (
        <VentaDetalleModal idVenta={detalleId} onClose={() => setDetalleId(null)} />
      )}
    </section>
  );
}
