import { useMemo, useState } from "react";
import { History, ReceiptText, RefreshCw, Search } from "lucide-react";
import { formatCurrency } from "./posData";
import { useVentasTimelineQuery } from "../../hooks/useVendedorQueries";
import VentaDetalleModal from "./VentaDetalleModal";
import type { Venta } from "../../services/ventasService";

type Rango = "hoy" | "7d" | "todo";

const ymdLima = (fecha: string): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date(fecha));

const hoyLima = (): string =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" })
    .format(new Date());

const etiquetaDia = (ymd: string, hoy: string): string => {
  if (ymd === hoy) return "Hoy";
  const d = new Date(`${ymd}T12:00:00`);
  const h = new Date(`${hoy}T12:00:00`);
  if (h.getTime() - d.getTime() === 86400000) return "Ayer";
  const texto = new Intl.DateTimeFormat("es-PE", {
    timeZone: "America/Lima",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${ymd}T12:00:00`));
  return texto.charAt(0).toUpperCase() + texto.slice(1);
};

interface GrupoDia {
  ymd: string;
  ventas: Venta[];
  total: number;
}

export default function HistorialVentas() {
  const { data, isLoading, isError, error, refetch } = useVentasTimelineQuery();
  const todas = data || [];
  const [rango, setRango] = useState<Rango>("todo");
  const [search, setSearch] = useState("");
  const [detalleId, setDetalleId] = useState<number | null>(null);

  const errorMsg = isError
    ? (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
      "No se pudo cargar tu recorrido de ventas."
    : null;

  const grupos = useMemo<GrupoDia[]>(() => {
    const hoy = hoyLima();
    const q = search.trim().toLowerCase();
    const filtradas = todas.filter((v) => {
      const ymd = ymdLima(v.fecha_venta);
      if (rango === "hoy" && ymd !== hoy) return false;
      if (rango === "7d") {
        const diff = new Date(`${hoy}T12:00:00`).getTime() - new Date(`${ymd}T12:00:00`).getTime();
        if (diff < 0 || diff > 6 * 86400000) return false;
      }
      if (!q) return true;
      return (
        `#v-${v.id_venta}`.includes(q) ||
        String(v.id_venta).includes(q) ||
        (v.cliente?.nombre_razon_social || "mostrador").toLowerCase().includes(q) ||
        v.tipo_comprobante.toLowerCase().includes(q)
      );
    });
    const mapa = new Map<string, Venta[]>();
    for (const v of filtradas) {
      const ymd = ymdLima(v.fecha_venta);
      const arr = mapa.get(ymd) || [];
      arr.push(v);
      mapa.set(ymd, arr);
    }
    return [...mapa.entries()]
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .map(([ymd, ventas]) => ({
        ymd,
        ventas: ventas.sort((a, b) => (a.fecha_venta < b.fecha_venta ? 1 : -1)),
        total: ventas.reduce((s, v) => s + Number(v.total_pagar || 0), 0),
      }));
  }, [todas, rango, search]);

  const totalVista = grupos.reduce((s, g) => s + g.total, 0);
  const countVista = grupos.reduce((s, g) => s + g.ventas.length, 0);
  const hoy = hoyLima();

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
        .v2-stat { background: #0F172A; border-radius: 14px; padding: 14px 16px; color: #fff; }
        .v2-stat span { display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #94A3B8; }
        .v2-stat strong { display: block; margin-top: 4px; font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
        .v2-stat-accent strong { color: #34D399; }
        .v2-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: stretch; }
        .v2-chips { display: flex; gap: 8px; }
        .v2-chip {
          padding: 0 18px; height: 44px; border-radius: 999px; cursor: pointer;
          border: 1px solid #E5E7EB; background: #fff; color: #475569;
          font: inherit; font-size: 13px; font-weight: 800;
        }
        .v2-chip.is-active { background: #0F172A; border-color: #0F172A; color: #fff; }
        .v2-search {
          flex: 1; min-width: 200px; display: flex; align-items: center; gap: 10px; background: #fff;
          border: 1px solid #E5E7EB; border-radius: 12px; padding: 0 14px; height: 44px; color: #64748B;
        }
        .v2-search input {
          flex: 1; border: 0; outline: 0; background: transparent;
          font: inherit; font-size: 14px; color: #0F172A;
        }
        .v2-day { display: grid; gap: 10px; }
        .v2-day-head { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 4px 2px 0; }
        .v2-day-title { margin: 0; font-size: 15px; font-weight: 800; color: #0F172A; }
        .v2-day-total { font-size: 13px; font-weight: 800; color: #0E9F6E; font-variant-numeric: tabular-nums; }
        .v2-timeline { position: relative; display: grid; gap: 10px; padding-left: 22px; }
        .v2-timeline::before {
          content: ""; position: absolute; left: 7px; top: 14px; bottom: 14px; width: 2px;
          background: #E5E7EB; border-radius: 2px;
        }
        .v2-stop { position: relative; }
        .v2-stop::before {
          content: ""; position: absolute; left: -21px; top: 20px; width: 12px; height: 12px;
          border-radius: 50%; background: #fff; border: 3px solid #0E9F6E;
        }
        .v2-sale-row {
          width: 100%; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px;
          padding: 13px 16px; border: 1px solid #E5E7EB; border-radius: 14px;
          background: #fff; cursor: pointer; text-align: left; font: inherit;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
          opacity: 0; animation: v2-tl-in 0.35s ease forwards;
        }
        @keyframes v2-tl-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .v2-sale-row:hover { border-color: #0E9F6E; }
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
          background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
        }
        .v2-state-icon {
          width: 52px; height: 52px; border-radius: 15px; display: grid; place-items: center;
          background: #F1F5F9; color: #94A3B8;
        }
        @media (max-width: 640px) { .v2-stats { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .v2-sale-row { opacity: 1; animation: none; }
        }
      `}</style>

      <div className="v2-head-row">
        <div>
          <p className="v2-head-eyebrow">Mi recorrido</p>
          <h2 className="v2-head-title">Historial de ventas</h2>
          <p className="v2-head-sub">Tu recorrido completo como vendedor. Toca una venta para ver su detalle.</p>
        </div>
        <button type="button" className="v2-refresh" onClick={() => void refetch()} aria-label="Recargar historial">
          <RefreshCw size={17} />
        </button>
      </div>

      <div className="v2-stats">
        <div className="v2-stat"><span>Ventas</span><strong>{countVista}</strong></div>
        <div className="v2-stat v2-stat-accent"><span>Cobrado</span><strong>{formatCurrency(totalVista)}</strong></div>
        <div className="v2-stat"><span>Días con venta</span><strong>{grupos.length}</strong></div>
      </div>

      <div className="v2-toolbar">
        <div className="v2-chips" role="tablist" aria-label="Rango del recorrido">
          {(["hoy", "7d", "todo"] as Rango[]).map((r) => (
            <button
              key={r}
              type="button"
              role="tab"
              aria-selected={rango === r}
              className={`v2-chip ${rango === r ? "is-active" : ""}`}
              onClick={() => setRango(r)}
            >
              {r === "hoy" ? "Hoy" : r === "7d" ? "7 días" : "Todo"}
            </button>
          ))}
        </div>
        <label className="v2-search">
          <Search size={17} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por número, cliente o comprobante..."
          />
        </label>
      </div>

      {isLoading ? (
        <div className="v2-state"><History size={26} /><span>Cargando tu recorrido...</span></div>
      ) : errorMsg ? (
        <div className="v2-state">
          <span>{errorMsg}</span>
          <button type="button" className="v2-refresh" onClick={() => void refetch()} aria-label="Reintentar">
            <RefreshCw size={17} />
          </button>
        </div>
      ) : grupos.length === 0 ? (
        <div className="v2-state">
          <span className="v2-state-icon"><ReceiptText size={24} /></span>
          <span>{todas.length === 0 ? "Aún no registras ventas." : "Sin resultados para ese filtro."}</span>
        </div>
      ) : (
        grupos.map((grupo) => (
          <div className="v2-day" key={grupo.ymd}>
            <div className="v2-day-head">
              <h3 className="v2-day-title">{etiquetaDia(grupo.ymd, hoy)}</h3>
              <span className="v2-day-total">{grupo.ventas.length} ventas · {formatCurrency(grupo.total)}</span>
            </div>
            <div className="v2-timeline">
              {grupo.ventas.map((sale, i) => (
                <div className="v2-stop" key={sale.id_venta}>
                  <button
                    type="button"
                    className="v2-sale-row"
                    style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}
                    onClick={() => setDetalleId(sale.id_venta)}
                  >
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
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {detalleId !== null && (
        <VentaDetalleModal idVenta={detalleId} onClose={() => setDetalleId(null)} />
      )}
    </section>
  );
}
