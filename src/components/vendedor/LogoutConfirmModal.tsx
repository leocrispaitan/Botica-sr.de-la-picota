import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, LogOut, ShieldCheck, X } from "lucide-react";
import { formatCurrency } from "./posData";

interface LogoutConfirmModalProps {
  open: boolean;
  userName: string;
  userEmail: string;
  userAvatar: string;
  pendingItems: number;
  pendingTotal: number;
  loggingOut: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutConfirmModal({
  open,
  userName,
  userEmail,
  userAvatar,
  pendingItems,
  pendingTotal,
  loggingOut,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const hasPending = pendingItems > 0;

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loggingOut) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loggingOut, onClose]);

  if (!open) return null;

  return (
    <div
      className="logout-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-title"
      aria-describedby="logout-desc"
      onClick={() => {
        if (!loggingOut) onClose();
      }}
    >
      <style>{`
        .logout-overlay {
          position: fixed; inset: 0; z-index: 9500;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: grid; place-items: center; padding: 16px; overflow-y: auto;
          font-family: 'Inter', 'Poppins', system-ui, sans-serif;
        }
        .logout-card {
          width: 430px; max-width: 94vw; max-height: 92vh; overflow-y: auto;
          background: #fff; border-radius: 24px; border: 1px solid #EEF2F6;
          box-shadow: 0 24px 64px rgba(15,23,42,.28);
        }
        .logout-top {
          height: 96px; border-radius: 24px 24px 0 0;
          background: radial-gradient(400px 120px at 50% 0%, #B8F35A 0%, #5AC85A 45%, #17A15B 100%);
          display: grid; place-items: center; position: relative;
        }
        .logout-icon {
          width: 64px; height: 64px; border-radius: 50%;
          background: #fff; display: grid; place-items: center; color: #E30613;
          border: 4px solid #fff;
          box-shadow: 0 12px 28px rgba(0,0,0,.22);
          transform: translateY(26px);
        }
        .logout-close {
          position: absolute; top: 12px; right: 12px;
          width: 34px; height: 34px; display: grid; place-items: center;
          border: 0; border-radius: 50%; cursor: pointer;
          background: rgba(255,255,255,.22); color: #fff;
          transition: background .2s ease;
        }
        .logout-close:hover { background: rgba(255,255,255,.38); }
        .logout-body { padding: 44px 26px 24px; text-align: center; }
        .logout-eyebrow {
          margin: 0; font-size: 11px; font-weight: 800;
          letter-spacing: .1em; text-transform: uppercase; color: #17A15B;
        }
        .logout-title {
          margin: 6px 0 0; font-family: 'Poppins','Inter',sans-serif;
          font-size: 22px; font-weight: 800; color: #0F172A; letter-spacing: -.01em;
        }
        .logout-desc { margin: 8px 0 0; font-size: 14px; line-height: 1.55; color: #64748B; }
        .logout-user {
          display: flex; align-items: center; gap: 12px; text-align: left;
          margin-top: 18px; padding: 12px 14px;
          border: 1px solid #EEF2F6; border-radius: 16px; background: #F4F5F8;
        }
        .logout-user img {
          width: 44px; height: 44px; border-radius: 50%; object-fit: cover; flex: 0 0 44px;
          border: 2px solid #B9E6C9; background: #E6F6EC;
        }
        .logout-user strong { display: block; font-size: 14px; font-weight: 800; color: #0F172A; }
        .logout-user span { display: block; font-size: 12px; color: #64748B; margin-top: 1px; }
        .logout-user-badge {
          margin-left: auto; display: inline-flex; align-items: center; gap: 5px;
          font-size: 11px; font-weight: 800; color: #0E7A44;
          background: #E6F6EC; border: 1px solid #B9E6C9; border-radius: 999px; padding: 4px 10px;
          white-space: nowrap;
        }
        .logout-warn {
          display: flex; gap: 10px; text-align: left; margin-top: 12px;
          padding: 12px 14px; border-radius: 14px; font-size: 13px; line-height: 1.5;
          background: #FFFBEB; border: 1px solid #FDE68A; color: #92400E;
        }
        .logout-warn svg { flex: 0 0 auto; margin-top: 1px; }
        .logout-safe {
          display: flex; gap: 8px; align-items: center; justify-content: center;
          margin-top: 14px; font-size: 12.5px; color: #64748B;
        }
        .logout-safe svg { color: #17A15B; }
        .logout-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
        .logout-btn {
          min-height: 50px; border-radius: 14px; cursor: pointer;
          font: inherit; font-size: 14px; font-weight: 800;
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          transition: transform .15s ease, filter .2s ease, background .2s ease;
        }
        .logout-btn:active:not(:disabled) { transform: scale(.98); }
        .logout-btn-cancel { border: 1.5px solid #17A15B; background: #fff; color: #0E7A44; }
        .logout-btn-cancel:hover:not(:disabled) { background: #E6F6EC; }
        .logout-btn-danger {
          border: 0; color: #fff;
          background: linear-gradient(135deg, #E30613, #B91C1C);
          box-shadow: 0 12px 24px rgba(227,6,19,.28);
        }
        .logout-btn-danger:hover:not(:disabled) { filter: brightness(1.06); }
        .logout-btn:disabled { opacity: .6; cursor: not-allowed; }
        .logout-spinner {
          width: 16px; height: 16px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
          animation: logout-spin .7s linear infinite;
        }
        @keyframes logout-spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .logout-actions { grid-template-columns: 1fr; } }
        @media (prefers-reduced-motion: reduce) {
          .logout-spinner { animation: none; }
        }
      `}</style>

      <motion.div
        className="logout-card"
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="logout-top">
          <button
            type="button"
            className="logout-close"
            onClick={onClose}
            disabled={loggingOut}
            aria-label="Cerrar ventana"
          >
            <X size={17} />
          </button>
          <span className="logout-icon">
            <LogOut size={28} />
          </span>
        </div>

        <div className="logout-body">
          <p className="logout-eyebrow">Botica Dua · Turno activo</p>
          <h3 className="logout-title" id="logout-title">
            ¿Cerrar sesión, {userName.split(" ")[0]}?
          </h3>
          <p className="logout-desc" id="logout-desc">
            Estás por salir del punto de venta. Podrás volver a ingresar cuando
            lo necesites con tus credenciales.
          </p>

          <div className="logout-user">
            <img src={userAvatar} alt={userName} />
            <div>
              <strong>{userName}</strong>
              <span>{userEmail}</span>
            </div>
            <span className="logout-user-badge">
              <ShieldCheck size={13} /> Verificado
            </span>
          </div>

          {hasPending && (
            <div className="logout-warn" role="alert">
              <AlertTriangle size={17} />
              <span>
                Tienes <strong>{pendingItems} producto(s)</strong> en la orden
                actual por <strong>{formatCurrency(pendingTotal)}</strong>. Si
                sales ahora, la orden sin cobrar se perderá.
              </span>
            </div>
          )}

          <p className="logout-safe">
            <ShieldCheck size={15} />
            Tus ventas registradas y tu turno quedan guardados.
          </p>

          <div className="logout-actions">
            <button
              ref={cancelRef}
              type="button"
              className="logout-btn logout-btn-cancel"
              onClick={onClose}
              disabled={loggingOut}
            >
              Seguir vendiendo
            </button>
            <button
              type="button"
              className="logout-btn logout-btn-danger"
              onClick={onConfirm}
              disabled={loggingOut}
            >
              {loggingOut ? (
                <>
                  <span className="logout-spinner" aria-hidden />
                  Cerrando…
                </>
              ) : (
                <>
                  <LogOut size={16} /> Cerrar sesión
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
