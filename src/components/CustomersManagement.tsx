import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserPlus,
  Edit2,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  DollarSign,
  X,
  Calendar,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Cliente {
  id_cliente: number;
  tipo_documento: "DNI" | "RUC" | "CE" | "PASAPORTE";
  numero_documento: string;
  nombre_razon_social: string;
  telefono: string;
  email: string;
  direccion: string;
  estado_logico: boolean;
  fecha_registro: string;
  // Campos adicionales calculados (mock)
  total_compras?: number;
  monto_total?: number;
}

/* ─── Mock Data ───────────────────────────────────────────────────────── */
const mockClientes: Cliente[] = [
  {
    id_cliente: 1,
    tipo_documento: "DNI",
    numero_documento: "45678912",
    nombre_razon_social: "Carlos Ramírez Torres",
    telefono: "987654321",
    email: "carlos.ramirez@example.com",
    direccion: "Jr. Lima 123, Picota",
    estado_logico: true,
    fecha_registro: "2026-01-15 10:30:00",
    total_compras: 24,
    monto_total: 1850.50,
  },
  {
    id_cliente: 2,
    tipo_documento: "RUC",
    numero_documento: "20123456789",
    nombre_razon_social: "FARMACORP SAC",
    telefono: "976543210",
    email: "contacto@farmacorp.com",
    direccion: "Av. Industrial 456, Tarapoto",
    estado_logico: true,
    fecha_registro: "2025-11-20 14:20:00",
    total_compras: 156,
    monto_total: 45680.00,
  },
  {
    id_cliente: 3,
    tipo_documento: "DNI",
    numero_documento: "78912345",
    nombre_razon_social: "Ana García Fernández",
    telefono: "965432198",
    email: "ana.garcia@gmail.com",
    direccion: "Av. Grau 789, Picota",
    estado_logico: true,
    fecha_registro: "2026-03-10 09:15:00",
    total_compras: 18,
    monto_total: 980.00,
  },
  {
    id_cliente: 4,
    tipo_documento: "CE",
    numero_documento: "001234567",
    nombre_razon_social: "Pedro Martínez López",
    telefono: "954321876",
    email: "pedro.martinez@hotmail.com",
    direccion: "Jr. Amazonas 234, Tarapoto",
    estado_logico: true,
    fecha_registro: "2026-02-05 16:45:00",
    total_compras: 8,
    monto_total: 450.75,
  },
  {
    id_cliente: 5,
    tipo_documento: "RUC",
    numero_documento: "20987654321",
    nombre_razon_social: "BOTICAS Y SALUD EIRL",
    telefono: "943210765",
    email: "ventas@boticasalud.com",
    direccion: "Av. Salaverry 890, Lima",
    estado_logico: true,
    fecha_registro: "2025-10-12 11:00:00",
    total_compras: 245,
    monto_total: 89340.25,
  },
  {
    id_cliente: 6,
    tipo_documento: "DNI",
    numero_documento: "23456789",
    nombre_razon_social: "Lucía Torres Mendoza",
    telefono: "932109654",
    email: "lucia.torres@yahoo.com",
    direccion: "Calle Los Olivos 567, Picota",
    estado_logico: false,
    fecha_registro: "2024-08-20 13:30:00",
    total_compras: 5,
    monto_total: 280.00,
  },
  {
    id_cliente: 7,
    tipo_documento: "PASAPORTE",
    numero_documento: "AB123456",
    nombre_razon_social: "John Smith Anderson",
    telefono: "921098543",
    email: "john.smith@outlook.com",
    direccion: "Hotel Central, Tarapoto",
    estado_logico: true,
    fecha_registro: "2026-07-01 08:20:00",
    total_compras: 2,
    monto_total: 120.50,
  },
  {
    id_cliente: 8,
    tipo_documento: "DNI",
    numero_documento: "34567890",
    nombre_razon_social: "María Elena Rojas Vega",
    telefono: "910987432",
    email: "maria.rojas@gmail.com",
    direccion: "Jr. San Martín 345, Picota",
    estado_logico: true,
    fecha_registro: "2026-04-18 15:10:00",
    total_compras: 32,
    monto_total: 2150.80,
  },
  {
    id_cliente: 9,
    tipo_documento: "RUC",
    numero_documento: "20345678901",
    nombre_razon_social: "DISTRIBUIDORA MEDICAL SAC",
    telefono: "909876321",
    email: "info@medical.com",
    direccion: "Av. Colonial 1234, Lima",
    estado_logico: true,
    fecha_registro: "2025-09-08 10:50:00",
    total_compras: 189,
    monto_total: 67890.50,
  },
  {
    id_cliente: 10,
    tipo_documento: "DNI",
    numero_documento: "56789012",
    nombre_razon_social: "Diego Castro Ramírez",
    telefono: "898765210",
    email: "diego.castro@hotmail.com",
    direccion: "Av. Los Pinos 678, Tarapoto",
    estado_logico: true,
    fecha_registro: "2026-05-22 12:25:00",
    total_compras: 14,
    monto_total: 760.00,
  },
];

/* ─── Document Type Badge Colors ─────────────────────────────────────────────── */
const getDocTypeBadgeColors = (tipo: string, isDark: boolean) => {
  if (tipo === "DNI") {
    return {
      bg: isDark ? "rgba(59, 130, 246, 0.12)" : "rgba(59, 130, 246, 0.08)",
      text: "#60a5fa",
      border: isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.25)",
      icon: "🪪",
    };
  }
  if (tipo === "RUC") {
    return {
      bg: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
      text: "#a78bfa",
      border: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)",
      icon: "🏢",
    };
  }
  if (tipo === "CE") {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      icon: "🌍",
    };
  }
  if (tipo === "PASAPORTE") {
    return {
      bg: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.08)",
      text: "#fb923c",
      border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)",
      icon: "✈️",
    };
  }
  return {
    bg: isDark ? "rgba(91, 207, 197, 0.12)" : "rgba(91, 207, 197, 0.08)",
    text: "#5bcfc5",
    border: isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.25)",
    icon: "📄",
  };
};

/* ─── Theme ────────────────────────────────────────────────────────── */
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

/* ═══════════════════════════════════════════════════════════════════ */
/*  CUSTOMERS MANAGEMENT COMPONENT                                     */
/* ═══════════════════════════════════════════════════════════════════ */
export default function CustomersManagement({ isDark = true }: { isDark?: boolean }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [docTypeFilter, setDocTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Cliente | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "create">("view");
  const itemsPerPage = 8;

  const t = getTheme(isDark);

  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return mockClientes.filter((cliente) => {
      const matchesSearch =
        cliente.nombre_razon_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.numero_documento.includes(searchTerm) ||
        cliente.telefono.includes(searchTerm);

      const matchesDocType = docTypeFilter === "all" || cliente.tipo_documento === docTypeFilter;
      const matchesStatus = statusFilter === "all" || cliente.estado_logico === statusFilter;

      return matchesSearch && matchesDocType && matchesStatus;
    });
  }, [searchTerm, docTypeFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Modal handlers
  const handleOpenModal = (mode: "view" | "edit" | "create", cliente?: Cliente) => {
    setModalMode(mode);
    setSelectedCustomer(cliente || null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
  };

  // Stats calculations
  const totalClientes = mockClientes.length;
  const clientesActivos = mockClientes.filter((c) => c.estado_logico).length;
  const totalComprasSum = mockClientes.reduce((sum, c) => sum + (c.total_compras || 0), 0);
  const montoTotalSum = mockClientes.reduce((sum, c) => sum + (c.monto_total || 0), 0);

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
          Gestión de Clientes
        </h1>
        <p style={{ fontSize: "14px", color: t.textSecondary }}>
          Administra y visualiza todos los clientes del sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Clientes - Blue Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #2c4eff 0%, #3b5beb 40%, #1d3bcd 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(44, 78, 255, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Clientes
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {totalClientes}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#68e365" }}>
                  +15.3%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <UserPlus size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Clientes Activos - Green Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #0f9d58 0%, #16a765 40%, #0b7a44 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(15, 157, 88, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Clientes Activos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {clientesActivos}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#a7f3d0" }}>
                  +10.2%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "50%", 
                background: "#ffffff",
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f9d58",
              }}>
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Total Compras - Purple Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #8b5cf6 0%, #9f7aea 40%, #7c3aed 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(139, 92, 246, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Total Compras
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {totalComprasSum}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#e9d5ff" }}>
                  +22.8%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <ShoppingBag size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Monto Total - Teal Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 40%, #0d9488 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(20, 184, 166, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div style={{ 
            position: "absolute", 
            top: "-40px", 
            right: "-40px", 
            width: "160px", 
            height: "160px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }} />
          <div style={{ 
            position: "absolute", 
            bottom: "-20px", 
            left: "-20px", 
            width: "100px", 
            height: "100px", 
            borderRadius: "50%", 
            background: "rgba(255, 255, 255, 0.03)",
          }} />
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
            <div>
              <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Monto Total
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                S/ {montoTotalSum.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#ccfbf1" }}>
                  +18.5%
                </span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  vs último mes
                </span>
              </div>
            </div>
            <div style={{ 
              width: "56px", 
              height: "56px", 
              borderRadius: "16px", 
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(10px)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.2)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}>
              <DollarSign size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Search Bar & Actions */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {/* Search Input */}
            <div style={{ flex: "1", minWidth: "250px", position: "relative" }}>
              <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
              <input
                type="text"
                placeholder="Buscar por nombre, documento, email o teléfono..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleFilterChange();
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px 12px 44px",
                  borderRadius: "14px",
                  border: `1px solid ${t.border}`,
                  background: t.inputBg,
                  color: t.textPrimary,
                  fontSize: "14px",
                  outline: "none",
                  fontFamily: "'Cairo', sans-serif",
                  transition: "all 0.2s",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = t.accent;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: `1px solid ${showFilters ? t.accent : t.border}`,
                background: showFilters ? `${t.accent}15` : t.inputBg,
                color: showFilters ? t.accent : t.textSecondary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (!showFilters) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }
              }}
            >
              <Filter size={16} />
              Filtros
              {(docTypeFilter !== "all" || statusFilter !== "all") && (
                <span
                  style={{
                    background: t.accent,
                    color: "#fff",
                    borderRadius: "50%",
                    width: "18px",
                    height: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {(docTypeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Add Customer Button */}
            <button
              onClick={() => handleOpenModal("create")}
              style={{
                padding: "12px 20px",
                borderRadius: "14px",
                border: "none",
                background: t.accent,
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
                boxShadow: `0 4px 12px ${t.accent}40`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 20px ${t.accent}50`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 12px ${t.accent}40`;
              }}
            >
              <UserPlus size={16} />
              Nuevo Cliente
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "12px",
                padding: "16px",
                background: t.innerBg,
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
              }}
            >
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Tipo de Documento
                </label>
                <select
                  value={docTypeFilter}
                  onChange={(e) => {
                    setDocTypeFilter(e.target.value);
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="DNI">🪪 DNI</option>
                  <option value="RUC">🏢 RUC</option>
                  <option value="CE">🌍 Carnet de Extranjería</option>
                  <option value="PASAPORTE">✈️ Pasaporte</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "6px" }}>
                  Estado
                </label>
                <select
                  value={statusFilter === "all" ? "all" : statusFilter ? "true" : "false"}
                  onChange={(e) => {
                    setStatusFilter(e.target.value === "all" ? "all" : e.target.value === "true");
                    handleFilterChange();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${t.border}`,
                    background: t.cardBg,
                    color: t.textPrimary,
                    fontSize: "13px",
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    outline: "none",
                  }}
                >
                  <option value="all">Todos los estados</option>
                  <option value="true">✓ Activos</option>
                  <option value="false">✗ Inactivos</option>
                </select>
              </div>

              {(docTypeFilter !== "all" || statusFilter !== "all") && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setDocTypeFilter("all");
                      setStatusFilter("all");
                      handleFilterChange();
                    }}
                    style={{
                      width: "100%",
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${t.border}`,
                      background: t.cardBg,
                      color: t.textSecondary,
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Cairo', sans-serif",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                    }}
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Results Info */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
        <p style={{ fontSize: "13px", color: t.textSecondary, fontWeight: 500 }}>
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredCustomers.length)} de {filteredCustomers.length} clientes
        </p>
        {filteredCustomers.length === 0 && searchTerm && (
          <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
            No se encontraron resultados para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Customers Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Cliente
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Documento
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Contacto
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Compras
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Monto Total
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Estado
                </th>
                <th style={{ padding: "16px 20px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.map((cliente, index) => {
                const docBadge = getDocTypeBadgeColors(cliente.tipo_documento, isDark);
                return (
                  <tr
                    key={cliente.id_cliente}
                    style={{
                      borderBottom: index < currentCustomers.length - 1 ? `1px solid ${t.border}` : "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = t.hoverBg;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    {/* Cliente */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                          {cliente.nombre_razon_social}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <MapPin size={12} color={t.textMuted} />
                          <span style={{ fontSize: "12px", color: t.textMuted }}>
                            {cliente.direccion}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "4px 10px",
                            borderRadius: "8px",
                            background: docBadge.bg,
                            border: `1px solid ${docBadge.border}`,
                            width: "fit-content",
                          }}
                        >
                          <span style={{ fontSize: "11px" }}>{docBadge.icon}</span>
                          <span style={{ fontSize: "11px", fontWeight: 700, color: docBadge.text }}>
                            {cliente.tipo_documento}
                          </span>
                        </div>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary }}>
                          {cliente.numero_documento}
                        </span>
                      </div>
                    </td>

                    {/* Contacto */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Mail size={14} color={t.textMuted} />
                          <span style={{ fontSize: "13px", color: t.textPrimary }}>
                            {cliente.email}
                          </span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Phone size={14} color={t.textMuted} />
                          <span style={{ fontSize: "13px", color: t.textSecondary }}>
                            {cliente.telefono}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Compras */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <ShoppingBag size={16} color={t.accent} />
                        <span style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                          {cliente.total_compras || 0}
                        </span>
                      </div>
                    </td>

                    {/* Monto Total */}
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: t.accent }}>
                        S/ {(cliente.monto_total || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Estado */}
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "10px",
                          background: cliente.estado_logico
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          border: `1px solid ${
                            cliente.estado_logico ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: cliente.estado_logico ? "#22c55e" : "#ef4444",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: cliente.estado_logico ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {cliente.estado_logico ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </td>

                    {/* Acciones */}
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                        <button
                          onClick={() => handleOpenModal("view", cliente)}
                          style={{
                            padding: "8px",
                            borderRadius: "10px",
                            border: "none",
                            background: "rgba(91, 207, 197, 0.1)",
                            color: t.accent,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}20`;
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(91, 207, 197, 0.1)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                          }}
                          title="Ver detalles"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenModal("edit", cliente)}
                          style={{
                            padding: "8px",
                            borderRadius: "10px",
                            border: "none",
                            background: "rgba(59, 130, 246, 0.1)",
                            color: "#3b82f6",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(59, 130, 246, 0.2)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(59, 130, 246, 0.1)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                          }}
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          style={{
                            padding: "8px",
                            borderRadius: "10px",
                            border: "none",
                            background: "rgba(239, 68, 68, 0.1)",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.2)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                          }}
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 20px",
              borderTop: `1px solid ${t.border}`,
              background: t.innerBg,
            }}
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
                background: currentPage === 1 ? t.innerBg : t.cardBg,
                color: currentPage === 1 ? t.textMuted : t.textPrimary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                }
              }}
            >
              <ChevronLeft size={16} />
              Anterior
            </button>

            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1px solid ${currentPage === page ? t.accent : t.border}`,
                    background: currentPage === page ? t.accent : t.cardBg,
                    color: currentPage === page ? "#fff" : t.textPrimary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    minWidth: "38px",
                  }}
                  onMouseEnter={(e) => {
                    if (currentPage !== page) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentPage !== page) {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                    }
                  }}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: "10px 16px",
                borderRadius: "12px",
                border: `1px solid ${t.border}`,
                background: currentPage === totalPages ? t.innerBg : t.cardBg,
                color: currentPage === totalPages ? t.textMuted : t.textPrimary,
                fontSize: "14px",
                fontWeight: 600,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "'Cairo', sans-serif",
                transition: "all 0.2s",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (currentPage !== totalPages) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== totalPages) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                }
              }}
            >
              Siguiente
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            animation: "fadeIn 0.2s ease-out",
          }}
          onClick={handleCloseModal}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
              animation: "slideUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "24px",
                borderBottom: `1px solid ${t.border}`,
              }}
            >
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: t.textPrimary, margin: 0 }}>
                {modalMode === "view" && "Detalles del Cliente"}
                {modalMode === "edit" && "Editar Cliente"}
                {modalMode === "create" && "Nuevo Cliente"}
              </h2>
              <button
                onClick={handleCloseModal}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  border: "none",
                  background: "rgba(239, 68, 68, 0.1)",
                  color: "#ef4444",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.2)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: "24px" }}>
              {modalMode === "view" && selectedCustomer && (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "20px",
                    }}
                  >
                    {/* Nombre/Razón Social */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre / Razón Social
                      </label>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedCustomer.nombre_razon_social}
                      </div>
                    </div>

                    {/* Tipo de Documento */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Tipo de Documento
                      </label>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "10px",
                          background: getDocTypeBadgeColors(selectedCustomer.tipo_documento, isDark).bg,
                          border: `1px solid ${getDocTypeBadgeColors(selectedCustomer.tipo_documento, isDark).border}`,
                        }}
                      >
                        <span style={{ fontSize: "12px" }}>{getDocTypeBadgeColors(selectedCustomer.tipo_documento, isDark).icon}</span>
                        <span style={{ fontSize: "13px", fontWeight: 700, color: getDocTypeBadgeColors(selectedCustomer.tipo_documento, isDark).text }}>
                          {selectedCustomer.tipo_documento}
                        </span>
                      </div>
                    </div>

                    {/* Número de Documento */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Número de Documento
                      </label>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary }}>
                        {selectedCustomer.numero_documento}
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Email
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Mail size={16} color={t.textMuted} />
                        <span style={{ fontSize: "14px", color: t.textPrimary }}>
                          {selectedCustomer.email}
                        </span>
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Teléfono
                      </label>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <Phone size={16} color={t.textMuted} />
                        <span style={{ fontSize: "14px", color: t.textPrimary }}>
                          {selectedCustomer.telefono}
                        </span>
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Estado
                      </label>
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "10px",
                          background: selectedCustomer.estado_logico
                            ? "rgba(34, 197, 94, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          border: `1px solid ${
                            selectedCustomer.estado_logico ? "rgba(34, 197, 94, 0.3)" : "rgba(239, 68, 68, 0.3)"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: selectedCustomer.estado_logico ? "#22c55e" : "#ef4444",
                          }}
                        />
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                            color: selectedCustomer.estado_logico ? "#22c55e" : "#ef4444",
                          }}
                        >
                          {selectedCustomer.estado_logico ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dirección - Full Width */}
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                      Dirección
                    </label>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <MapPin size={16} color={t.textMuted} />
                      <span style={{ fontSize: "14px", color: t.textPrimary }}>
                        {selectedCustomer.direccion}
                      </span>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginTop: "12px" }}>
                    <div
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #9f7aea 100%)",
                        borderRadius: "16px",
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
                          Total Compras
                        </p>
                        <p style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                          {selectedCustomer.total_compras || 0}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <ShoppingBag size={14} color="rgba(255,255,255,0.8)" />
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                            transacciones
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%)",
                        borderRadius: "16px",
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
                          Monto Total
                        </p>
                        <p style={{ fontSize: "28px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                          S/ {(selectedCustomer.monto_total || 0).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <DollarSign size={14} color="rgba(255,255,255,0.8)" />
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                            acumulado
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        background: "linear-gradient(135deg, #2c4eff 0%, #3b5beb 100%)",
                        borderRadius: "16px",
                        padding: "16px",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.7)", marginBottom: "6px" }}>
                          Registrado
                        </p>
                        <p style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff", marginBottom: "4px" }}>
                          {new Date(selectedCustomer.fecha_registro).toLocaleDateString("es-PE", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Calendar size={14} color="rgba(255,255,255,0.8)" />
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>
                            hace {Math.floor((Date.now() - new Date(selectedCustomer.fecha_registro).getTime()) / (1000 * 60 * 60 * 24))} días
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(modalMode === "edit" || modalMode === "create") && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                      gap: "16px",
                    }}
                  >
                    {/* Tipo de Documento */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Tipo de Documento *
                      </label>
                      <select
                        defaultValue={selectedCustomer?.tipo_documento || "DNI"}
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      >
                        <option value="DNI">🪪 DNI</option>
                        <option value="RUC">🏢 RUC</option>
                        <option value="CE">🌍 Carnet de Extranjería</option>
                        <option value="PASAPORTE">✈️ Pasaporte</option>
                      </select>
                    </div>

                    {/* Número de Documento */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCustomer?.numero_documento || ""}
                        placeholder="Ej: 12345678"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Nombre/Razón Social */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Nombre / Razón Social *
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCustomer?.nombre_razon_social || ""}
                        placeholder="Ej: Juan Pérez García"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={selectedCustomer?.email || ""}
                        placeholder="ejemplo@correo.com"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        defaultValue={selectedCustomer?.telefono || ""}
                        placeholder="987654321"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Dirección */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        Dirección
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedCustomer?.direccion || ""}
                        placeholder="Av. Principal 123, Ciudad"
                        style={{
                          width: "100%",
                          padding: "12px",
                          borderRadius: "12px",
                          border: `1px solid ${t.border}`,
                          background: t.inputBg,
                          color: t.textPrimary,
                          fontSize: "14px",
                          fontFamily: "'Cairo', sans-serif",
                          outline: "none",
                        }}
                      />
                    </div>

                    {/* Estado */}
                    {modalMode === "edit" && (
                      <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Estado
                        </label>
                        <select
                          defaultValue={selectedCustomer?.estado_logico ? "true" : "false"}
                          style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "12px",
                            border: `1px solid ${t.border}`,
                            background: t.inputBg,
                            color: t.textPrimary,
                            fontSize: "14px",
                            fontFamily: "'Cairo', sans-serif",
                            outline: "none",
                          }}
                        >
                          <option value="true">✓ Activo</option>
                          <option value="false">✗ Inactivo</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Validation Note */}
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: "12px",
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "16px" }}>ℹ️</span>
                    <div style={{ fontSize: "12px", color: "#3b82f6", lineHeight: 1.5 }}>
                      <strong>Validaciones:</strong> DNI debe tener 8 dígitos, RUC 11 dígitos, el número de documento debe ser único.
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "8px" }}>
                    <button
                      onClick={handleCloseModal}
                      style={{
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: `1px solid ${t.border}`,
                        background: t.cardBg,
                        color: t.textSecondary,
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      style={{
                        padding: "12px 24px",
                        borderRadius: "12px",
                        border: "none",
                        background: t.accent,
                        color: "#fff",
                        fontSize: "14px",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s",
                        boxShadow: `0 4px 12px ${t.accent}40`,
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      }}
                    >
                      {modalMode === "create" ? "Crear Cliente" : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}
