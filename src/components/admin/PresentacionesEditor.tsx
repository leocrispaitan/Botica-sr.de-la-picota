import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import productsService, {
  type Producto,
  type ProductoPresentacion,
} from "../../services/productsService";

/* ═══════════════════════════════════════════════════════════════════
 *  Editor de presentaciones de venta (TAB/BL/CJ...) para el admin.
 *  El precio BASE se edita en el producto; aquí solo fracciones.
 * ═══════════════════════════════════════════════════════════════════ */

interface PresentacionesEditorProps {
  producto: Producto;
  t: Record<string, string>;
  onChanged: (presentaciones: ProductoPresentacion[]) => void;
}

interface FilaEdicion {
  codigo: string;
  precio: string;
  permite: boolean;
  tocada: boolean;
}

export default function PresentacionesEditor({ producto, t, onChanged }: PresentacionesEditorProps) {
  const filas = (producto.presentaciones || [])
    .filter((p) => p.estado_logico !== false)
    .sort((a, b) => Number(a.factor_a_base) - Number(b.factor_a_base));

  const [edicion, setEdicion] = useState<Record<string, FilaEdicion>>({});
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const init: Record<string, FilaEdicion> = {};
    filas.forEach((p) => {
      init[p.codigo_presentacion] = {
        codigo: p.codigo_presentacion,
        precio: String(p.precio_venta),
        permite: p.permite_venta !== false,
        tocada: false,
      };
    });
    setEdicion(init);
    setOk(false);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto.id_producto]);

  if (filas.length === 0) {
    return (
      <p style={{ fontSize: "13px", color: t.textMuted }}>
        Este producto aún no tiene presentaciones. Se generan al guardar el fraccionamiento.
      </p>
    );
  }

  const guardar = async () => {
    setGuardando(true);
    setError(null);
    setOk(false);
    try {
      const payload = filas
        .filter((p) => !p.es_base)
        .map((p) => {
          const e = edicion[p.codigo_presentacion];
          return {
            codigo_presentacion: p.codigo_presentacion,
            precio_venta: Number(e?.precio ?? p.precio_venta),
            permite_venta: e?.permite ?? true,
          };
        });
      const data = await productsService.updatePresentaciones(producto.id_producto, payload);
      onChanged(data);
      setOk(true);
    } catch (err) {
      const data = (err as { response?: { data?: { message?: string; error?: string[] | string } } })?.response?.data;
      setError(
        data?.message ||
          (Array.isArray(data?.error) ? data.error.join(", ") : undefined) ||
          "No se pudieron guardar las presentaciones."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: "10px" }}>
      {filas.map((p) => {
        const e = edicion[p.codigo_presentacion];
        return (
          <div
            key={p.codigo_presentacion}
            style={{
              background: t.innerBg,
              border: `1px solid ${t.border}`,
              borderRadius: "12px",
              padding: "12px 14px",
              display: "grid",
              gridTemplateColumns: "auto minmax(0,1fr) auto auto",
              gap: "12px",
              alignItems: "center",
            }}
          >
            <span
              style={{
                minWidth: "44px",
                textAlign: "center",
                padding: "5px 10px",
                borderRadius: "8px",
                background: p.es_base ? `${t.accent}18` : t.input,
                color: p.es_base ? t.accent : t.textPrimary,
                fontSize: "12px",
                fontWeight: 800,
              }}
            >
              {p.codigo_presentacion}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: t.textPrimary, margin: 0 }}>
                {p.nombre_presentacion}
                {p.es_base ? " · base" : ""}
              </p>
              <p style={{ fontSize: "11px", color: t.textMuted, margin: "2px 0 0" }}>
                1 {p.codigo_presentacion} = {Number(p.factor_a_base)} base
              </p>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: t.textSub }}>
              <input
                type="checkbox"
                checked={e?.permite ?? true}
                disabled={guardando}
                onChange={(ev) =>
                  setEdicion((prev) => ({
                    ...prev,
                    [p.codigo_presentacion]: {
                      codigo: p.codigo_presentacion,
                      precio: e?.precio ?? String(p.precio_venta),
                      permite: ev.target.checked,
                      tocada: true,
                    },
                  }))
                }
              />
              Activa
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "12px", color: t.textMuted }}>S/</span>
              <input
                type="number"
                min={0.01}
                step={0.01}
                value={e?.precio ?? String(p.precio_venta)}
                disabled={guardando || p.es_base}
                title={p.es_base ? "El precio base se edita en el producto" : "Precio de la presentación"}
                onChange={(ev) =>
                  setEdicion((prev) => ({
                    ...prev,
                    [p.codigo_presentacion]: {
                      codigo: p.codigo_presentacion,
                      precio: ev.target.value,
                      permite: e?.permite ?? true,
                      tocada: true,
                    },
                  }))
                }
                style={{
                  width: "86px",
                  padding: "8px 10px",
                  borderRadius: "9px",
                  border: `1px solid ${t.border}`,
                  background: p.es_base ? t.input : t.card,
                  color: t.textPrimary,
                  fontSize: "13px",
                  fontWeight: 700,
                  opacity: p.es_base ? 0.65 : 1,
                }}
              />
            </div>
          </div>
        );
      })}

      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#ef4444" }}>
          <AlertCircle size={14} /> {error}
        </div>
      )}
      {ok && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#0fbf70", fontWeight: 700 }}>
          <CheckCircle2 size={14} /> Presentaciones guardadas.
        </div>
      )}

      <button
        type="button"
        onClick={guardar}
        disabled={guardando}
        style={{
          justifySelf: "start",
          padding: "10px 22px",
          borderRadius: "10px",
          border: "none",
          background: guardando ? t.textMuted : t.accent,
          color: "#fff",
          fontSize: "13px",
          fontWeight: 700,
          cursor: guardando ? "not-allowed" : "pointer",
          fontFamily: "inherit",
        }}
      >
        {guardando ? "Guardando..." : "Guardar presentaciones"}
      </button>
      <p style={{ fontSize: "11px", color: t.textMuted, margin: 0 }}>
        El precio base (CJ) se edita en el producto. Cambiar unidades por base re-deriva factores y precios.
      </p>
    </div>
  );
}
