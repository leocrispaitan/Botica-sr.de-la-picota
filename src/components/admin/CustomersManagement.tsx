import { useState, useEffect, useMemo } from "react";
import {
  Search,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  X,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { clientesService, type Cliente } from "../../services/clientesService";

/* ─── Theme ─────────────────────────────────────────────────────────── */
function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      mainBg: "#171622",
      cardBg: "#212130",
      inputBg: "#212130",
      innerBg: "#1e1d29",
      border: "rgba(46,46,66,0.5)",
      borderCard: "rgba(46,46,66,0.4)",
      textPrimary: "#ffffff",
      textSecondary: "#828690",
      textMuted: "#969ba0",
      accent: "#5bcfc5",
      accentHover: "#4bc0b6",
      hoverBg: "#2c2c3e",
    };
  }
  return {
    mainBg: "#f0f2f8",
    cardBg: "#ffffff",
    inputBg: "#f5f6fa",
    innerBg: "#f5f6fa",
    border: "rgba(220,222,235,0.9)",
    borderCard: "rgba(220,222,235,0.7)",
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    hoverBg: "#ecedf5",
  };
}

interface FormState {
  tipo_documento: string;
  numero_documento: string;
  nombre_razon_social: string;
  telefono: string;
  email: string;
  direccion: string;
  estado_logico: boolean;
}

const emptyForm: FormState = {
  tipo_documento: "DNI",
  numero_documento: "",
  nombre_razon_social: "",
  telefono: "",
  email: "",
  direccion: "",
  estado_logico: true,
};

export default function CustomersManagement({ isDark = true }: { isDark?: boolean }) {
  const t = getTheme(isDark);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "true" | "false">("all");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const [selected, setSelected] = useState<Cliente | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await clientesService.getAll({ search: searchTerm, estado: statusFilter, limit: 200 });
      setClientes(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Error al cargar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    load();
  };

  const openCreate = () => {
    setForm(emptyForm);
    setSelected(null);
    setModalMode("create");
    setShowModal(true);
  };

  const openEdit = (c: Cliente) => {
    setForm({
      tipo_documento: c.tipo_documento || "DNI",
      numero_documento: c.numero_documento || "",
      nombre_razon_social: c.nombre_razon_social || "",
      telefono: c.telefono || "",
      email: c.email || "",
      direccion: c.direccion || "",
      estado_logico: c.estado_logico !== false,
    });
    setSelected(c);
    setModalMode("edit");
    setShowModal(true);
  };

  const openView = (c: Cliente) => {
    setSelected(c);
    setModalMode("view");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelected(null);
    setForm(emptyForm);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.numero_documento.trim() || !form.nombre_razon_social.trim()) {
      toast.error("Número de documento y nombre son obligatorios");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        tipo_documento: form.tipo_documento,
        numero_documento: form.numero_documento.trim(),
        nombre_razon_social: form.nombre_razon_social.trim(),
        telefono: form.telefono.trim() || null,
        email: form.email.trim() || null,
        direccion: form.direccion.trim() || null,
        estado_logico: form.estado_logico,
      };
      if (modalMode === "create") {
        await clientesService.create(payload);
        toast.success("Cliente creado");
      } else if (selected) {
        await clientesService.update(selected.id_cliente, payload);
        toast.success("Cliente actualizado");
      }
      closeModal();
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Cliente) => {
    if (!confirm(`¿Desactivar al cliente "${c.nombre_razon_social}"?`)) return;
    try {
      await clientesService.delete(c.id_cliente);
      toast.success("Cliente desactivado");
      await load();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "No se pudo desactivar");
    }
  };

  const stats = useMemo(() => {
    const total = clientes.length;
    const activos = clientes.filter((c) => c.estado_logico).length;
    const compras = clientes.reduce((s, c) => s + (c.total_compras || 0), 0);
    const monto = clientes.reduce((s, c) => s + (c.monto_total || 0), 0);
    return { total, activos, compras, monto };
  }, [clientes]);

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return clientes.filter((c) => {
      const matchesSearch =
        !term ||
        c.nombre_razon_social.toLowerCase().includes(term) ||
        c.numero_documento.toLowerCase().includes(term);
      const matchesStatus =
        statusFilter === "all" || String(c.estado_logico) === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clientes, searchTerm, statusFilter]);

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "10px",
    border: `1px solid ${t.border}`,
    background: t.inputBg,
    color: t.textPrimary,
    fontSize: "14px",
    outline: "none",
    fontFamily: "'Cairo', sans-serif",
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      <Toaster />
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>Clientes</h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>Gestión de clientes (datos reales)</p>
        </div>
        <button onClick={openCreate} style={{ padding: "10px 18px", borderRadius: "12px", border: "none", background: t.accent, color: "#fff", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <UserPlus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
        {[
          { label: "Total Clientes", value: stats.total },
          { label: "Activos", value: stats.activos },
          { label: "Total Compras", value: stats.compras },
          { label: "Monto Total", value: `S/ ${stats.monto.toLocaleString("es-PE", { minimumFractionDigits: 2 })}` },
        ].map((s) => (
          <div key={s.label} style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "16px", padding: "16px" }}>
            <p style={{ fontSize: "12px", color: t.textSecondary, marginBottom: "4px" }}>{s.label}</p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: t.textPrimary }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: "flex", gap: "10px", marginBottom: "16px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre o documento..."
            style={{ ...inputStyle, paddingLeft: "36px" }}
          />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} style={inputStyle}>
          <option value="all">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <button type="submit" style={{ padding: "10px 16px", borderRadius: "10px", border: "none", background: t.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
          Buscar
        </button>
        <button type="button" onClick={load} style={{ padding: "10px 16px", borderRadius: "10px", border: `1px solid ${t.border}`, background: t.inputBg, color: t.textSecondary, cursor: "pointer" }}>
          <RefreshCw size={16} />
        </button>
      </form>

      {error && (
        <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", color: "#ef4444", borderRadius: "10px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "16px", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: t.innerBg }}>
              {["Documento", "Nombre / Razón Social", "Teléfono", "Email", "Compras", "Monto Total", "Estado", "Acciones"].map((h) => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: t.textSecondary, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ padding: "30px", textAlign: "center", color: t.textMuted }}>Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ padding: "30px", textAlign: "center", color: t.textMuted }}>Sin clientes</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id_cliente} style={{ borderTop: `1px solid ${t.border}` }}>
                  <td style={{ padding: "12px 16px", color: t.textPrimary }}>{c.tipo_documento} {c.numero_documento}</td>
                  <td style={{ padding: "12px 16px", color: t.textPrimary }}>{c.nombre_razon_social}</td>
                  <td style={{ padding: "12px 16px", color: t.textSecondary }}>{c.telefono || "-"}</td>
                  <td style={{ padding: "12px 16px", color: t.textSecondary }}>{c.email || "-"}</td>
                  <td style={{ padding: "12px 16px", color: t.textPrimary }}>{c.total_compras || 0}</td>
                  <td style={{ padding: "12px 16px", color: t.textPrimary }}>S/ {(c.monto_total || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: 700, background: c.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(148,163,184,0.1)", color: c.estado_logico ? "#22c55e" : "#94a3b8" }}>
                      {c.estado_logico ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", display: "flex", gap: "6px" }}>
                    <button onClick={() => openView(c)} style={{ padding: "6px", border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><Eye size={16} /></button>
                    <button onClick={() => openEdit(c)} style={{ padding: "6px", border: "none", background: "transparent", color: "#3b82f6", cursor: "pointer" }}><Edit2 size={16} /></button>
                    {c.estado_logico && (
                      <button onClick={() => handleDelete(c)} style={{ padding: "6px", border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}><Trash2 size={16} /></button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: t.cardBg, borderRadius: "20px", maxWidth: "600px", width: "100%", maxHeight: "90vh", overflow: "auto", padding: "24px", border: `1px solid ${t.borderCard}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ color: t.textPrimary, margin: 0 }}>
                {modalMode === "view" ? "Detalle del Cliente" : modalMode === "create" ? "Nuevo Cliente" : "Editar Cliente"}
              </h2>
              <button onClick={closeModal} style={{ border: "none", background: "transparent", color: t.textSecondary, cursor: "pointer" }}><X size={20} /></button>
            </div>

            {modalMode === "view" && selected && (
              <div style={{ display: "grid", gap: "10px", color: t.textPrimary }}>
                <p><strong>Documento:</strong> {selected.tipo_documento} {selected.numero_documento}</p>
                <p><strong>Nombre:</strong> {selected.nombre_razon_social}</p>
                <p><strong>Teléfono:</strong> {selected.telefono || "-"}</p>
                <p><strong>Email:</strong> {selected.email || "-"}</p>
                <p><strong>Dirección:</strong> {selected.direccion || "-"}</p>
                <p><strong>Compras:</strong> {selected.total_compras || 0}</p>
                <p><strong>Monto Total:</strong> S/ {(selected.monto_total || 0).toLocaleString("es-PE", { minimumFractionDigits: 2 })}</p>
                <p><strong>Estado:</strong> {selected.estado_logico ? "Activo" : "Inactivo"}</p>
                <p><strong>Registrado:</strong> {selected.fecha_registro}</p>
              </div>
            )}

            {(modalMode === "create" || modalMode === "edit") && (
              <form onSubmit={handleSave} style={{ display: "grid", gap: "12px" }}>
                <select value={form.tipo_documento} onChange={(e) => setForm({ ...form, tipo_documento: e.target.value })} style={inputStyle}>
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                  <option value="CE">CE</option>
                  <option value="PASAPORTE">Pasaporte</option>
                </select>
                <input required value={form.numero_documento} onChange={(e) => setForm({ ...form, numero_documento: e.target.value })} placeholder="Número de documento *" style={inputStyle} />
                <input required value={form.nombre_razon_social} onChange={(e) => setForm({ ...form, nombre_razon_social: e.target.value })} placeholder="Nombre / Razón Social *" style={inputStyle} />
                <input value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })} placeholder="Teléfono" style={inputStyle} />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email" style={inputStyle} />
                <input value={form.direccion} onChange={(e) => setForm({ ...form, direccion: e.target.value })} placeholder="Dirección" style={inputStyle} />
                <label style={{ color: t.textSecondary, fontSize: "13px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <input type="checkbox" checked={form.estado_logico} onChange={(e) => setForm({ ...form, estado_logico: e.target.checked })} />
                  Activo
                </label>
                <button type="submit" disabled={saving} style={{ padding: "12px", borderRadius: "10px", border: "none", background: t.accent, color: "#fff", fontWeight: 600, cursor: "pointer" }}>
                  {saving ? "Guardando..." : modalMode === "create" ? "Crear Cliente" : "Guardar Cambios"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
