import { useEffect, useState } from "react";
import { Search, UserRound, Users } from "lucide-react";
import clientesService, { type Cliente } from "../../services/clientesService";

interface ClientesProps {
  onSelectCustomer: (cliente: { id: number | null; nombre: string }) => void;
}

export default function Clientes({ onSelectCustomer }: ClientesProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const t = setTimeout(() => {
      clientesService
        .search(search, 12)
        .then((data) => {
          if (!active) return;
          setClientes(data);
          setLoading(false);
        })
        .catch(() => {
          if (!active) return;
          setLoading(false);
        });
    }, search ? 300 : 0);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [search]);

  return (
    <section className="v2-clients">
      <style>{`
        .v2-clients { display: flex; flex-direction: column; gap: 16px; }
        .v2-head-eyebrow {
          margin: 0 0 4px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #0E9F6E;
        }
        .v2-head-title { margin: 0; font-size: 24px; font-weight: 800; color: #0F172A; }
        .v2-head-sub { margin: 4px 0 0; font-size: 14px; color: #64748B; }
        .v2-search {
          display: flex; align-items: center; gap: 10px; background: #fff;
          border: 1px solid #E5E7EB; border-radius: 12px; padding: 0 14px; height: 44px; color: #64748B;
        }
        .v2-search input {
          flex: 1; border: 0; outline: 0; background: transparent;
          font: inherit; font-size: 14px; color: #0F172A;
        }
        .v2-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .v2-client-card {
          display: flex; align-items: center; gap: 12px; text-align: left;
          background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
          padding: 14px; cursor: pointer; font: inherit;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
        }
        .v2-client-card:hover { border-color: #0E9F6E; background: #F6FEFA; }
        .v2-client-card.is-counter { border-style: dashed; }
        .v2-avatar {
          flex: 0 0 42px; width: 42px; height: 42px; border-radius: 50%;
          display: grid; place-items: center;
          background: #0F172A; color: #fff; font-weight: 800; font-size: 17px;
        }
        .v2-client-card.is-counter .v2-avatar { background: #ECFDF5; color: #0B7A55; }
        .v2-client-name { margin: 0; font-size: 14px; font-weight: 800; color: #0F172A; }
        .v2-client-doc { margin: 2px 0 0; font-size: 12px; color: #64748B; }
        .v2-state { padding: 36px 16px; text-align: center; color: #64748B; font-size: 14px; }
      `}</style>

      <div>
        <p className="v2-head-eyebrow">Clientes</p>
        <h2 className="v2-head-title">Atención rápida</h2>
        <p className="v2-head-sub">Elige al cliente para precargar sus datos en el detalle de venta.</p>
      </div>

      <label className="v2-search">
        <Search size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o documento..."
        />
      </label>

      <div className="v2-grid">
        <button type="button" className="v2-client-card is-counter" onClick={() => onSelectCustomer({ id: null, nombre: "" })}>
          <span className="v2-avatar"><UserRound size={19} /></span>
          <span>
            <p className="v2-client-name">Cliente mostrador</p>
            <p className="v2-client-doc">Sin documento · venta rápida</p>
          </span>
        </button>

        {loading ? (
          <p className="v2-state"><Users size={20} /> Cargando clientes...</p>
        ) : (
          clientes.map((client) => (
            <button
              key={client.id_cliente}
              type="button"
              className="v2-client-card"
              onClick={() => onSelectCustomer({ id: client.id_cliente, nombre: client.nombre_razon_social })}
            >
              <span className="v2-avatar">{client.nombre_razon_social.charAt(0)}</span>
              <span>
                <p className="v2-client-name">{client.nombre_razon_social}</p>
                <p className="v2-client-doc">{client.tipo_documento}: {client.numero_documento}</p>
              </span>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
