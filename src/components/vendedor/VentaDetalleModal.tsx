import { useEffect, useState } from "react";
import { ReceiptText, X } from "lucide-react";
import ventasService, { type Venta } from "../../services/ventasService";
import { formatCurrency, maskDni } from "./posData";

const PRESENTACION_NOMBRE: Record<string, string> = {
  TAB: "Tableta", CAP: "Cápsula", AMP: "Ampolla", BL: "Blíster", CJ: "Caja",
  UND: "Unidad", FCO: "Frasco", GOT: "Gotero", TBO: "Tubo", SOB: "Sobre",
};

interface VentaDetalleModalProps {
  idVenta: number;
  onClose: () => void;
}

export default function VentaDetalleModal({ idVenta, onClose }: VentaDetalleModalProps) {
  const [venta, setVenta] = useState<Venta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    ventasService
      .getVentaById(idVenta)
      .then((data) => {
        if (!active) return;
        setVenta(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || "No se pudo cargar el detalle de la venta.");
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [idVenta]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="v2-modal-overlay" role="dialog" aria-modal="true" aria-label={`Detalle de venta ${idVenta}`} onClick={onClose}>
      <style>{`
        .v2-modal-overlay {
          position: fixed; inset: 0; z-index: 9000;
          background: rgba(15, 23, 42, 0.55);
          display: grid; place-items: center; padding: 16px; overflow-y: auto;
        }
        .v2-modal {
          width: 520px; max-width: 94vw; max-height: 90vh; overflow-y: auto;
          background: #fff; border-radius: 16px; border: 1px solid #E5E7EB;
          box-shadow: 0 24px 64px rgba(0,0,0,0.3);
        }
        .v2-modal-head {
          display: flex; align-items: flex-start; justify-content: space-between; gap: 12px;
          padding: 18px 20px 14px; border-bottom: 1px solid #F1F5F9;
          position: sticky; top: 0; background: #fff;
        }
        .v2-modal-eyebrow {
          margin: 0 0 2px; font-size: 11px; font-weight: 800;
          letter-spacing: 0.08em; text-transform: uppercase; color: #0E9F6E;
        }
        .v2-modal-title { margin: 0; font-size: 19px; font-weight: 800; color: #0F172A; }
        .v2-modal-sub { margin: 2px 0 0; font-size: 13px; color: #64748B; }
        .v2-modal-close {
          flex: 0 0 34px; width: 34px; height: 34px; display: grid; place-items: center;
          border: 1px solid #E5E7EB; border-radius: 10px; background: #fff; color: #475569; cursor: pointer;
        }
        .v2-modal-close:hover { background: #F8FAFC; }
        .v2-modal-body { padding: 16px 20px 20px; display: grid; gap: 14px; }
        .v2-kv { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; font-size: 13px; }
        .v2-kv span { color: #64748B; }
        .v2-kv strong { color: #0F172A; font-weight: 700; text-align: right; }
        .v2-pill {
          display: inline-block; padding: 3px 10px; border-radius: 999px;
          font-size: 11px; font-weight: 800; border: 1px solid;
        }
        .v2-pill-paid { background: #ECFDF5; color: #0B7A55; border-color: #A7F3D0; }
        .v2-pill-pending { background: #FEF3C7; color: #92400E; border-color: #FDE68A; }
        .v2-pill-void { background: #FEF2F2; color: #B91C1C; border-color: #FECACA; }
        .v2-items { border: 1px solid #E5E7EB; border-radius: 12px; overflow: hidden; }
        .v2-item {
          display: flex; justify-content: space-between; gap: 12px;
          padding: 11px 14px; border-bottom: 1px solid #F1F5F9; font-size: 13px;
        }
        .v2-item:last-child { border-bottom: 0; }
        .v2-item-name { margin: 0; font-weight: 700; color: #0F172A; }
        .v2-item-meta { margin: 2px 0 0; color: #64748B; }
        .v2-item-amount { font-weight: 800; color: #0F172A; white-space: nowrap; font-variant-numeric: tabular-nums; }
        .v2-totals { border-top: 1px solid #E5E7EB; padding-top: 10px; display: grid; gap: 4px; font-size: 14px; }
        .v2-total-row { display: flex; justify-content: space-between; color: #475569; }
        .v2-total-row strong { color: #0F172A; font-variant-numeric: tabular-nums; }
        .v2-grand { font-size: 16px; font-weight: 800; color: #0F172A; }
        .v2-grand strong { color: #0E9F6E; font-size: 20px; }
        .v2-state { padding: 32px 20px; text-align: center; color: #64748B; font-size: 14px; display: grid; gap: 8px; justify-items: center; }
      `}</style>

      <div className="v2-modal" onClick={(e) => e.stopPropagation()}>
        <div className="v2-modal-head">
          <div>
            <p className="v2-modal-eyebrow">Comprobante</p>
            <h3 className="v2-modal-title">Venta #V-{idVenta}</h3>
            <p className="v2-modal-sub">Detalle registrado en el sistema</p>
          </div>
          <button type="button" className="v2-modal-close" onClick={onClose} aria-label="Cerrar detalle">
            <X size={17} />
          </button>
        </div>

        {loading ? (
          <div className="v2-state"><ReceiptText size={28} /><span>Cargando detalle...</span></div>
        ) : error || !venta ? (
          <div className="v2-state"><span>{error || "Venta no encontrada."}</span></div>
        ) : (
          <div className="v2-modal-body">
            <div className="v2-kv">
              <span>Fecha</span><strong>{new Date(venta.fecha_venta).toLocaleString("es-PE")}</strong>
              <span>Comprobante</span><strong>{venta.tipo_comprobante}</strong>
              <span>Cliente</span><strong>{venta.cliente?.nombre_razon_social || "Cliente mostrador"}</strong>
              {venta.cliente?.numero_documento && (
                <>
                  <span>Documento</span><strong>{maskDni(venta.cliente.numero_documento)}</strong>
                </>
              )}
              <span>Método de pago</span><strong>{venta.metodo_pago?.nombre_metodo || "-"}</strong>
              <span>Vendedor</span><strong>{venta.usuario?.nombre_completo || "-"}</strong>
              <span>Estado</span>
              <strong>
                <span className={`v2-pill ${venta.estado_venta === "PAGADA" ? "v2-pill-paid" : venta.estado_venta === "ANULADA" ? "v2-pill-void" : "v2-pill-pending"}`}>
                  {venta.estado_venta}
                </span>
              </strong>
            </div>

            <div className="v2-items">
              {(venta.detalle_venta || []).map((d) => {
                const codigo = (d as { codigo_presentacion?: string }).codigo_presentacion;
                const cantPres = Number((d as { cantidad_presentacion?: number | string }).cantidad_presentacion ?? d.cantidad);
                const etiqueta = codigo ? PRESENTACION_NOMBRE[codigo] || codigo : "Unidad";
                const pu = cantPres > 0 ? Number(d.subtotal) / cantPres : 0;
                return (
                  <div className="v2-item" key={d.id_detalle_venta}>
                    <div>
                      <p className="v2-item-name">{d.producto?.nombre_comercial || `Producto`}</p>
                      <p className="v2-item-meta">{cantPres} x {etiqueta} · {formatCurrency(pu)}</p>
                    </div>
                    <span className="v2-item-amount">{formatCurrency(Number(d.subtotal))}</span>
                  </div>
                );
              })}
            </div>

            <div className="v2-totals">
              <div className="v2-total-row"><span>Total cobrado</span><strong>{formatCurrency(Number(venta.total_pagar))}</strong></div>
              <div className="v2-total-row"><span>Monto pagado</span><strong>{formatCurrency(Number(venta.monto_pagado))}</strong></div>
              <div className="v2-total-row v2-grand"><span>Total</span><strong>{formatCurrency(Number(venta.total_pagar))}</strong></div>
              <div className="v2-total-row"><span>Vuelto</span><strong>{formatCurrency(Number(venta.vuelto || 0))}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
