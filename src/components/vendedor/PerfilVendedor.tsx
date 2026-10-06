import { useEffect, useState } from "react";
import { BadgeCheck, CalendarDays, Mail, ShoppingBag, Star, Wallet } from "lucide-react";
import { formatCurrency } from "./posData";
import ventasService, { type Venta } from "../../services/ventasService";

interface PerfilVendedorProps {
  userName: string;
  userEmail: string;
  userAvatar: string;
}

export default function PerfilVendedor({ userName, userEmail, userAvatar }: PerfilVendedorProps) {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    ventasService
      .getHistorialTurno()
      .then((data) => {
        if (!active) return;
        setVentas(data);
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const totalCobrado = ventas.reduce((s, v) => s + Number(v.total_pagar || 0), 0);
  const ticketPromedio = ventas.length > 0 ? totalCobrado / ventas.length : 0;
  const hoy = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const recientes = ventas.slice(0, 5);

  return (
    <section className="v2-profile">
      <style>{`
        .v2-profile { display: flex; flex-direction: column; gap: 16px; }
        .v2-head-eyebrow {
          margin: 0 0 4px; font-size: 12px; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase; color: #0E9F6E;
        }
        .v2-head-title { margin: 0; font-size: 24px; font-weight: 800; color: #0F172A; }
        .v2-head-sub { margin: 4px 0 0; font-size: 14px; color: #64748B; text-transform: capitalize; }
        .v2-card {
          background: #fff; border: 1px solid #E5E7EB; border-radius: 14px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
        }
        .v2-id { display: flex; align-items: center; gap: 16px; padding: 20px; }
        .v2-avatar {
          width: 68px; height: 68px; border-radius: 50%; object-fit: cover; flex: 0 0 68px;
          border: 3px solid #ECFDF5; background: #F1F5F9;
        }
        .v2-id-name { margin: 0; font-size: 19px; font-weight: 800; color: #0F172A; }
        .v2-id-mail {
          margin: 4px 0 0; font-size: 13px; color: #64748B;
          display: flex; align-items: center; gap: 6px;
        }
        .v2-role {
          display: inline-flex; align-items: center; gap: 5px; margin-top: 8px;
          padding: 4px 11px; border-radius: 999px; font-size: 12px; font-weight: 800;
          background: #0F172A; color: #fff;
        }
        .v2-role svg { color: #34D399; }
        .v2-stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .v2-stat { padding: 16px; display: grid; gap: 6px; }
        .v2-stat-top { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; }
        .v2-stat-top svg { color: #0E9F6E; }
        .v2-stat strong { font-size: 22px; font-weight: 800; color: #0F172A; font-variant-numeric: tabular-nums; }
        .v2-section-title { margin: 0; padding: 16px 18px 0; font-size: 14px; font-weight: 800; color: #0F172A; }
        .v2-activity { padding: 6px 10px 14px; }
        .v2-activity-row {
          display: flex; justify-content: space-between; gap: 12px; align-items: center;
          padding: 11px 8px; border-bottom: 1px solid #F1F5F9; font-size: 14px;
        }
        .v2-activity-row:last-child { border-bottom: 0; }
        .v2-activity-id { margin: 0; font-weight: 800; color: #0F172A; }
        .v2-activity-sub { margin: 2px 0 0; font-size: 12px; color: #64748B; }
        .v2-activity-amount { font-weight: 800; color: #0E9F6E; font-variant-numeric: tabular-nums; white-space: nowrap; }
        .v2-empty { padding: 20px; font-size: 14px; color: #64748B; }
        .v2-note {
          display: flex; gap: 10px; padding: 14px 16px; font-size: 13px; color: #475569; line-height: 1.5;
        }
        .v2-note svg { flex: 0 0 auto; color: #0E9F6E; margin-top: 1px; }
        @media (max-width: 640px) { .v2-stats { grid-template-columns: 1fr; } }
      `}</style>

      <div>
        <p className="v2-head-eyebrow">Mi perfil</p>
        <h2 className="v2-head-title">Hola, {userName.split(" ")[0]}</h2>
        <p className="v2-head-sub">{hoy} · turno activo</p>
      </div>

      <div className="v2-card v2-id">
        <img className="v2-avatar" src={userAvatar} alt={userName} />
        <div>
          <p className="v2-id-name">{userName}</p>
          <p className="v2-id-mail"><Mail size={14} />{userEmail}</p>
          <span className="v2-role"><BadgeCheck size={14} /> Vendedor activo</span>
        </div>
      </div>

      <div className="v2-stats">
        <div className="v2-card v2-stat">
          <span className="v2-stat-top"><ShoppingBag size={15} /> Ventas hoy</span>
          <strong>{loading ? "—" : ventas.length}</strong>
        </div>
        <div className="v2-card v2-stat">
          <span className="v2-stat-top"><Wallet size={15} /> Cobrado hoy</span>
          <strong>{loading ? "—" : formatCurrency(totalCobrado)}</strong>
        </div>
        <div className="v2-card v2-stat">
          <span className="v2-stat-top"><Star size={15} /> Ticket promedio</span>
          <strong>{loading ? "—" : formatCurrency(ticketPromedio)}</strong>
        </div>
      </div>

      <div className="v2-card">
        <h3 className="v2-section-title">Actividad reciente del turno</h3>
        {loading ? (
          <p className="v2-empty">Cargando actividad...</p>
        ) : recientes.length === 0 ? (
          <p className="v2-empty">Aún no registras ventas hoy. Tus cobros aparecerán aquí.</p>
        ) : (
          <div className="v2-activity">
            {recientes.map((v) => (
              <div className="v2-activity-row" key={v.id_venta}>
                <div>
                  <p className="v2-activity-id">#V-{v.id_venta} · {v.tipo_comprobante}</p>
                  <p className="v2-activity-sub">
                    {v.cliente?.nombre_razon_social || "Cliente mostrador"} ·{" "}
                    {new Date(v.fecha_venta).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <span className="v2-activity-amount">{formatCurrency(Number(v.total_pagar))}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="v2-card v2-note">
        <CalendarDays size={17} />
        <span>
          Recuerda: los productos con receta médica exigen el DNI del cliente antes de procesar la venta.
          El comprobante se genera automáticamente al cobrar.
        </span>
      </div>
    </section>
  );
}
