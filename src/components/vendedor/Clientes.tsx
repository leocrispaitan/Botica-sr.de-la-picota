import { useEffect, useState } from "react";
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
    return () => {
      active = false;
    };
  }, [search]);

  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Clientes</p>
        <h2>Atención rápida</h2>
      </div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nombre o documento"
        aria-label="Buscar cliente"
      />
      <button
        className="seller-client-card"
        onClick={() => onSelectCustomer({ id: null, nombre: "" })}
      >
        <span>M</span>
        <strong>Cliente mostrador</strong>
        <small>Sin documento</small>
      </button>
      <div className="seller-client-grid">
        {loading ? (
          <p>Cargando clientes...</p>
        ) : (
          clientes.map((client) => (
            <button
              key={client.id_cliente}
              className="seller-client-card"
              onClick={() => onSelectCustomer({ id: client.id_cliente, nombre: client.nombre_razon_social })}
            >
              <span>{client.nombre_razon_social.charAt(0)}</span>
              <strong>{client.nombre_razon_social}</strong>
              <small>
                {client.tipo_documento}: {client.numero_documento}
              </small>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
