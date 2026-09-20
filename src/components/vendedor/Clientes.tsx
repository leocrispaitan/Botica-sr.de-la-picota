interface ClientesProps {
  onSelectCustomer: (name: string) => void;
}

const clientesRapidos = ["Cliente mostrador", "Rosa Velásquez", "Farmacia San Martín", "Carlos Paredes"];

export default function Clientes({ onSelectCustomer }: ClientesProps) {
  return (
    <section className="seller-panel-view">
      <div>
        <p className="seller-eyebrow">Clientes</p>
        <h2>Atención rápida</h2>
      </div>
      <div className="seller-client-grid">
        {clientesRapidos.map((client, index) => (
          <button key={client} className="seller-client-card" onClick={() => onSelectCustomer(client)}>
            <span>{client.charAt(0)}</span>
            <strong>{client}</strong>
            <small>{index === 0 ? "Sin documento" : index === 2 ? "RUC activo" : "DNI registrado"}</small>
          </button>
        ))}
      </div>
    </section>
  );
}