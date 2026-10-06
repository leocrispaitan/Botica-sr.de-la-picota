import { maskDni, formatCurrency } from "./posData";

export interface ComprobanteItem {
  nombre: string;
  presentacion: string;
  cantidad: number;
  precio: number;
  conReceta: boolean;
}

export interface ComprobanteData {
  idVenta: number;
  fecha: string;
  tipo: "BOLETA" | "FACTURA" | "TICKET";
  clienteNombre: string;
  clienteDoc: string | null;
  items: ComprobanteItem[];
  subtotal: number;
  descuento: number;
  total: number;
  pagado: number;
  vuelto: number;
  metodoPago: string;
  vendedor: string;
}

interface ComprobanteModalProps {
  data: ComprobanteData;
  onClose: () => void;
  onNewSale: () => void;
}

const serieDe = (tipo: ComprobanteData["tipo"], id: number): string =>
  tipo === "BOLETA" ? `B001-${String(id).padStart(6, "0")}` : tipo === "FACTURA" ? `F001-${String(id).padStart(6, "0")}` : `T-${id}`;

const tituloDe = (tipo: ComprobanteData["tipo"]): string =>
  tipo === "BOLETA" ? "BOLETA DE VENTA" : tipo === "FACTURA" ? "FACTURA" : "TICKET DE VENTA";

export default function ComprobanteModal({ data, onClose, onNewSale }: ComprobanteModalProps) {
  const conReceta = data.items.some((i) => i.conReceta);

  return (
    <div className="ticket-overlay" role="dialog" aria-modal="true" aria-label="Comprobante de venta">
      <style>{`
        .ticket-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(15, 23, 42, 0.55);
          display: grid; place-items: center; padding: 16px;
          overflow-y: auto;
        }
        .print-ticket {
          width: 300px; max-width: 92vw; max-height: 92vh; overflow-y: auto;
          background: #fff; color: #111;
          font-family: 'Courier New', ui-monospace, monospace;
          font-size: 12px; line-height: 1.45;
          padding: 18px 16px 20px;
          border-radius: 6px;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .print-ticket .tk-center { text-align: center; }
        .print-ticket .tk-bold { font-weight: 700; }
        .print-ticket .tk-big { font-size: 15px; }
        .print-ticket .tk-total { font-size: 16px; }
        .print-ticket hr.tk-dash { border: 0; border-top: 1px dashed #111; margin: 8px 0; }
        .print-ticket .tk-row { display: flex; justify-content: space-between; gap: 8px; }
        .print-ticket .tk-item { margin: 6px 0; }
        .print-ticket .tk-item-name { font-weight: 700; word-break: break-word; }
        .print-ticket .tk-muted { opacity: 0.85; }
        .ticket-actions { display: flex; gap: 10px; margin-top: 14px; }
        .ticket-actions button {
          flex: 1; padding: 11px 8px; border-radius: 10px; cursor: pointer;
          font-family: 'Cairo', sans-serif; font-weight: 800; font-size: 14px;
        }
        .ticket-btn-print { border: 0; background: #0fbf70; color: #fff; }
        .ticket-btn-new { border: 1px solid #cbd5e1; background: #fff; color: #0f172a; }
        @media print {
          body * { visibility: hidden !important; }
          .print-ticket, .print-ticket * { visibility: visible !important; }
          .print-ticket {
            position: absolute; left: 0; top: 0; width: 80mm;
            max-height: none; border-radius: 0; box-shadow: none; margin: 0;
          }
          .ticket-actions { display: none !important; }
        }
      `}</style>

      <div>
        <div className="print-ticket">
          <div className="tk-center tk-bold tk-big">BOTICA DUA</div>
          <div className="tk-center tk-muted">Cuidado de tu salud</div>
          <hr className="tk-dash" />
          <div className="tk-center tk-bold">{tituloDe(data.tipo)}</div>
          <div className="tk-center tk-bold">{serieDe(data.tipo, data.idVenta)}</div>
          <hr className="tk-dash" />
          <div className="tk-row"><span>Fecha:</span><span>{new Date(data.fecha).toLocaleString("es-PE")}</span></div>
          <div className="tk-row"><span>Vendedor:</span><span>{data.vendedor}</span></div>
          <div className="tk-row"><span>Cliente:</span><span>{data.clienteNombre}</span></div>
          {data.clienteDoc && (
            <div className="tk-row"><span>Doc:</span><span>{maskDni(data.clienteDoc)}</span></div>
          )}
          <hr className="tk-dash" />
          {data.items.map((item, i) => (
            <div className="tk-item" key={i}>
              <div className="tk-item-name">{item.nombre}</div>
              <div className="tk-row tk-muted">
                <span>{item.cantidad} x {item.presentacion} · {formatCurrency(item.precio)}</span>
                <span className="tk-bold">{formatCurrency(item.cantidad * item.precio)}</span>
              </div>
            </div>
          ))}
          <hr className="tk-dash" />
          <div className="tk-row"><span>Subtotal:</span><span>{formatCurrency(data.subtotal)}</span></div>
          <div className="tk-row"><span>Descuento:</span><span>-{formatCurrency(data.descuento)}</span></div>
          <div className="tk-row tk-bold tk-total"><span>TOTAL:</span><span>{formatCurrency(data.total)}</span></div>
          <div className="tk-row"><span>Pagado ({data.metodoPago}):</span><span>{formatCurrency(data.pagado)}</span></div>
          <div className="tk-row"><span>Vuelto:</span><span>{formatCurrency(data.vuelto)}</span></div>
          <hr className="tk-dash" />
          {conReceta && (
            <div className="tk-center tk-bold">* Venta con receta médica *</div>
          )}
          <div className="tk-center tk-muted">¡Gracias por su compra!</div>
          <div className="tk-center tk-muted">Revise sus medicamentos antes de salir</div>
        </div>

        <div className="ticket-actions no-print">
          <button type="button" className="ticket-btn-new" onClick={onClose}>Cerrar</button>
          <button type="button" className="ticket-btn-print" onClick={() => window.print()}>Imprimir</button>
          <button type="button" className="ticket-btn-new" onClick={onNewSale}>Nueva venta</button>
        </div>
      </div>
    </div>
  );
}
