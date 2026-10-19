import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import {
  X,
  Check,
  Clock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Shield,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  FileText,
  Building2,
  RefreshCw,
  Copy,
  AlertTriangle,
} from "lucide-react";
import { useSolicitudesQuery } from "../../hooks/useAdminQueries";
import { queryKeys } from "../../lib/queryKeys";
import { solicitudesService, type SolicitudRegistro, type EstadoSolicitud } from "../../services/solicitudesService";

function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      mainBg: "#171622",
      cardBg: "#212130",
      inputBg: "#212130",
      innerBg: "#1e1d29",
      border: "rgba(46,46,66,0.5)",
      borderCard: "rgba(46,46,66,0.4)",
      borderInput: "rgba(46,46,66,0.8)",
      textPrimary: "#ffffff",
      textSecondary: "#828690",
      textMuted: "#969ba0",
      accent: "#5bcfc5",
      accentHover: "#4bc0b6",
      accentBg: "rgba(91,207,197,0.1)",
      hoverBg: "#212130",
    };
  }
  return {
    mainBg: "#f0f2f8",
    cardBg: "#ffffff",
    inputBg: "#f5f6fa",
    innerBg: "#f5f6fa",
    border: "rgba(220,222,235,0.9)",
    borderCard: "rgba(220,222,235,0.7)",
    borderInput: "rgba(220,222,235,0.9)",
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    accentBg: "rgba(91,207,197,0.1)",
    hoverBg: "#f5f6fa",
  };
}

export default function SolicitudesRegistro({ isDark }: { isDark: boolean }) {
  const t = getTheme(isDark);
  const queryClient = useQueryClient();

  // ═══ Datos reales (TanStack Query, caché 5 min) ═══
  const {
    data: solicitudes = [],
    isLoading,
    error: loadError,
    refetch,
  } = useSolicitudesQuery();

  const [selectedRequest, setSelectedRequest] = useState<SolicitudRegistro | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | EstadoSolicitud>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  // Credenciales temporales entregadas al aprobar una solicitud
  const [credenciales, setCredenciales] = useState<{ nombre: string; email: string; password: string } | null>(null);

  const errMsg =
    (loadError as { response?: { data?: { message?: string } } })?.response?.data?.message ??
    "No se pudieron cargar las solicitudes.";

  const invalidate = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.solicitudes.all });
  };

  // ═══ Mutación: aprobar (crea el usuario real) ═══
  const aprobarMutation = useMutation({
    mutationFn: (id: number) => solicitudesService.aprobarSolicitud(id),
    onSuccess: (data) => {
      toast.success(data.solicitud.estado === 'APROBADA' ? "Solicitud aprobada" : "Aprobada", {
        icon: "✅",
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
      setCredenciales({
        nombre: data.usuario.nombre_completo,
        email: data.usuario.email,
        password: data.password_temporal,
      });
      invalidate();
      setSelectedRequest(null);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "No se pudo aprobar la solicitud.";
      toast.error(msg, {
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
    },
  });

  // ═══ Mutación: rechazar ═══
  const rechazarMutation = useMutation({
    mutationFn: (id: number) => solicitudesService.rechazarSolicitud(id),
    onSuccess: () => {
      toast.success("Solicitud rechazada", {
        icon: "🚫",
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
      invalidate();
      setSelectedRequest(null);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "No se pudo rechazar la solicitud.";
      toast.error(msg, {
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
    },
  });

  const isProcessing = aprobarMutation.isPending || rechazarMutation.isPending;

  // Copiar contraseña al portapapeles
  const handleCopyPassword = async () => {
    if (!credenciales) return;
    try {
      await navigator.clipboard.writeText(credenciales.password);
      toast.success("Contraseña copiada al portapapeles", {
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
    } catch {
      toast.error("No se pudo copiar la contraseña", {
        style: { background: t.cardBg, color: t.textPrimary, border: `1px solid ${t.border}` },
      });
    }
  };

  // Filtrar solicitudes
  const filteredRequests = solicitudes.filter(req => {
    const matchesStatus = filterStatus === 'all' || req.estado === filterStatus;
    const matchesSearch = req.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.dni.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  // Contar por estado
  const counts = {
    all: solicitudes.length,
    pendiente: solicitudes.filter(r => r.estado === 'PENDIENTE').length,
    aprobada: solicitudes.filter(r => r.estado === 'APROBADA').length,
    rechazada: solicitudes.filter(r => r.estado === 'RECHAZADA').length,
  };

  const getRoleColor = (role: string) => {
    switch (role.toUpperCase()) {
      case 'VENDEDOR':
        return {
          bg: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.08)',
          text: '#4ade80',
          border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)',
        };
      case 'ALMACENERO':
        return {
          bg: isDark ? 'rgba(249, 115, 22, 0.12)' : 'rgba(249, 115, 22, 0.08)',
          text: '#fb923c',
          border: isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.25)',
        };
      case 'ADMINISTRATIVO':
        return {
          bg: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)',
          text: '#a78bfa',
          border: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.25)',
        };
      default:
        return {
          bg: isDark ? 'rgba(91, 207, 197, 0.12)' : 'rgba(91, 207, 197, 0.08)',
          text: '#5bcfc5',
          border: isDark ? 'rgba(91, 207, 197, 0.3)' : 'rgba(91, 207, 197, 0.25)',
        };
    }
  };

  const getRoleName = (req: SolicitudRegistro) =>
    req.rol?.nombre_rol ||
    ({ 1: 'ADMINISTRATIVO', 2: 'VENDEDOR', 3: 'ALMACENERO' }[req.id_rol] || 'USUARIO');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return {
          icon: Clock,
          text: 'Pendiente',
          bg: isDark ? 'rgba(251, 191, 36, 0.12)' : 'rgba(251, 191, 36, 0.08)',
          color: '#fbbf24',
          border: isDark ? 'rgba(251, 191, 36, 0.3)' : 'rgba(251, 191, 36, 0.25)',
        };
      case 'APROBADA':
        return {
          icon: CheckCircle,
          text: 'Aprobado',
          bg: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.08)',
          color: '#4ade80',
          border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)',
        };
      case 'RECHAZADA':
        return {
          icon: XCircle,
          text: 'Rechazado',
          bg: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
          color: '#ef4444',
          border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)',
        };
      default:
        return {
          icon: AlertCircle,
          text: 'Desconocido',
          bg: isDark ? 'rgba(156, 163, 175, 0.12)' : 'rgba(156, 163, 175, 0.08)',
          color: '#9ca3af',
          border: isDark ? 'rgba(156, 163, 175, 0.3)' : 'rgba(156, 163, 175, 0.25)',
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6 space-y-6" style={{ background: t.mainBg, minHeight: '100vh' }}>
      <Toaster
        position="top-right"
        gutter={8}
        toastOptions={{
          duration: 4500,
          style: { borderRadius: 12, fontFamily: "'Cairo', sans-serif" },
        }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-[28px] font-bold" style={{ color: t.textPrimary }}>
            Solicitudes de Registro
          </h1>
          <p className="text-[14px] mt-1" style={{ color: t.textSecondary }}>
            Gestiona las solicitudes de nuevos usuarios en el sistema
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => void refetch()}
            disabled={isLoading}
            title="Actualizar solicitudes"
            className="px-3 py-2 rounded-xl border transition-all"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
              color: t.textSecondary,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </button>
          <div
            className="px-4 py-2 rounded-xl border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Clock size={16} style={{ color: '#fbbf24' }} />
            <span style={{ color: t.textPrimary, fontSize: '14px', fontWeight: 600 }}>
              {counts.pendiente}
            </span>
            <span style={{ color: t.textSecondary, fontSize: '12px' }}>Pendientes</span>
          </div>
          <div
            className="px-4 py-2 rounded-xl border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <CheckCircle size={16} style={{ color: '#4ade80' }} />
            <span style={{ color: t.textPrimary, fontSize: '14px', fontWeight: 600 }}>
              {counts.aprobada}
            </span>
            <span style={{ color: t.textSecondary, fontSize: '12px' }}>Aprobados</span>
          </div>
          <div
            className="px-4 py-2 rounded-xl border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <XCircle size={16} style={{ color: '#ef4444' }} />
            <span style={{ color: t.textPrimary, fontSize: '14px', fontWeight: 600 }}>
              {counts.rechazada}
            </span>
            <span style={{ color: t.textSecondary, fontSize: '12px' }}>Rechazados</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div
        className="rounded-[20px] p-4 border flex flex-col md:flex-row gap-3"
        style={{ background: t.cardBg, borderColor: t.borderCard }}
      >
        {/* Search */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Buscar por nombre, email o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
            style={{
              background: t.inputBg,
              color: t.textPrimary,
              border: `1px solid ${t.borderInput}`,
            }}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2"
            size={18}
            style={{ color: t.textSecondary }}
          />
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="px-4 py-2.5 rounded-xl border flex items-center gap-2 text-sm font-semibold transition-all"
            style={{
              background: t.inputBg,
              borderColor: t.borderInput,
              color: t.textPrimary,
            }}
          >
            <Filter size={16} />
            <span>
              {filterStatus === 'all' ? 'Todos' :
               filterStatus === 'PENDIENTE' ? 'Pendientes' :
               filterStatus === 'APROBADA' ? 'Aprobados' : 'Rechazados'}
            </span>
            <ChevronDown size={16} />
          </button>

          {showFilterMenu && (
            <div
              className="absolute right-0 mt-2 w-48 rounded-xl border shadow-lg overflow-hidden z-50"
              style={{ background: t.cardBg, borderColor: t.borderCard }}
            >
              {(['all', 'PENDIENTE', 'APROBADA', 'RECHAZADA'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilterStatus(status);
                    setShowFilterMenu(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm font-medium transition-colors flex items-center justify-between"
                  style={{
                    background: filterStatus === status ? t.accentBg : 'transparent',
                    color: filterStatus === status ? t.accent : t.textPrimary,
                  }}
                >
                  <span>
                    {status === 'all' ? 'Todos' :
                     status === 'PENDIENTE' ? 'Pendientes' :
                     status === 'APROBADA' ? 'Aprobados' : 'Rechazados'}
                  </span>
                  <span style={{ color: t.textSecondary }}>
                    {status === 'all' ? counts.all :
                     status === 'PENDIENTE' ? counts.pendiente :
                     status === 'APROBADA' ? counts.aprobada : counts.rechazada}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ─── Cargando ─── */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-[20px] border p-5"
              style={{ background: t.cardBg, borderColor: t.borderCard }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: t.innerBg, animation: 'solPulse 1.4s ease-in-out infinite' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ width: '60%', height: 12, borderRadius: 6, background: t.innerBg, marginBottom: 8, animation: 'solPulse 1.4s ease-in-out 0.15s infinite' }} />
                  <div style={{ width: '80%', height: 10, borderRadius: 6, background: t.innerBg, animation: 'solPulse 1.4s ease-in-out 0.3s infinite' }} />
                </div>
              </div>
              <div style={{ height: 12, borderRadius: 6, background: t.innerBg, marginBottom: 10, animation: 'solPulse 1.4s ease-in-out 0.45s infinite' }} />
              <div style={{ width: '70%', height: 12, borderRadius: 6, background: t.innerBg, animation: 'solPulse 1.4s ease-in-out 0.6s infinite' }} />
            </div>
          ))}
          <style>{`
            @keyframes solPulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.45; }
            }
          `}</style>
        </div>
      )}

      {/* ─── Error ─── */}
      {!isLoading && loadError && (
        <div
          className="rounded-[20px] border p-12 text-center"
          style={{ background: t.cardBg, borderColor: t.borderCard }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(239, 68, 68, 0.12)' }}
          >
            <AlertTriangle size={32} style={{ color: '#ef4444' }} />
          </div>
          <h3 className="text-[18px] font-semibold mb-2" style={{ color: t.textPrimary }}>
            No se pudieron cargar las solicitudes
          </h3>
          <p className="text-[14px] mb-5" style={{ color: t.textSecondary }}>
            {errMsg}
          </p>
          <button
            onClick={() => void refetch()}
            className="px-5 py-2.5 rounded-xl font-semibold text-[13px]"
            style={{
              background: 'linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)',
              color: '#171622',
              cursor: 'pointer',
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Requests Grid */}
      {!isLoading && !loadError && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.estado);
            const StatusIcon = statusBadge.icon;
            const roleName = getRoleName(request);
            const roleColor = getRoleColor(roleName);
            const isProcessingThis =
              (aprobarMutation.isPending || rechazarMutation.isPending) &&
              (aprobarMutation.variables === request.id_solicitud || rechazarMutation.variables === request.id_solicitud);

            return (
              <div
                key={request.id_solicitud}
                className="rounded-[20px] border overflow-hidden transition-all duration-300 hover:shadow-lg"
                style={{
                  background: t.cardBg,
                  borderColor: t.borderCard,
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedRequest(request)}
              >
                {/* Header */}
                <div
                  className="p-4 border-b"
                  style={{
                    background: t.innerBg,
                    borderColor: t.border
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(request.nombre_completo)}&background=5bcfc5&color=fff`}
                        alt={request.nombre_completo}
                        className="w-14 h-14 rounded-xl object-cover"
                        style={{ border: `2px solid ${t.border}` }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                        style={{
                          background: statusBadge.color,
                          borderColor: t.cardBg
                        }}
                      >
                        <StatusIcon size={12} color="#fff" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-[15px] truncate"
                        style={{ color: t.textPrimary }}
                      >
                        {request.nombre_completo}
                      </h3>
                      <p
                        className="text-[12px] truncate"
                        style={{ color: t.textSecondary }}
                      >
                        {request.email}
                      </p>
                      <div className="mt-2">
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md"
                          style={{
                            background: roleColor.bg,
                            color: roleColor.text,
                            border: `1px solid ${roleColor.border}`,
                          }}
                        >
                          <Shield size={10} />
                          {roleName}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-[13px]">
                    <FileText size={14} style={{ color: t.textSecondary }} />
                    <span style={{ color: t.textSecondary }}>DNI:</span>
                    <span style={{ color: t.textPrimary, fontWeight: 600 }}>
                      {request.dni}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <Phone size={14} style={{ color: t.textSecondary }} />
                    <span style={{ color: t.textPrimary }}>
                      {request.telefono || 'No proporcionado'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[13px]">
                    <Calendar size={14} style={{ color: t.textSecondary }} />
                    <span style={{ color: t.textSecondary }}>Solicitado:</span>
                    <span style={{ color: t.textPrimary }}>
                      {formatDate(request.fecha_solicitud)}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="pt-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg"
                      style={{
                        background: statusBadge.bg,
                        color: statusBadge.color,
                        border: `1px solid ${statusBadge.border}`,
                      }}
                    >
                      <StatusIcon size={12} />
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {request.estado === 'PENDIENTE' && (
                  <div
                    className="p-4 border-t flex gap-2"
                    style={{ borderColor: t.border }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isProcessing) return;
                        rechazarMutation.mutate(request.id_solicitud);
                      }}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-300 flex items-center justify-center gap-2 border"
                      style={{
                        background: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
                        color: '#ef4444',
                        borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)',
                        opacity: isProcessing ? 0.5 : 1,
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <X size={16} />
                      Rechazar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        aprobarMutation.mutate(request.id_solicitud);
                      }}
                      disabled={isProcessing}
                      className="flex-1 py-2.5 rounded-xl font-semibold text-[13px] transition-all duration-300 flex items-center justify-center gap-2"
                      style={{
                        background: 'linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)',
                        color: '#171622',
                        boxShadow: '0 4px 12px rgba(91, 207, 197, 0.25)',
                        opacity: isProcessing ? 0.5 : 1,
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Check size={16} />
                      {isProcessingThis && aprobarMutation.isPending ? 'Aprobando…' : 'Aprobar'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !loadError && filteredRequests.length === 0 && (
        <div
          className="rounded-[20px] border p-12 text-center"
          style={{ background: t.cardBg, borderColor: t.borderCard }}
        >
          <div
            className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
            style={{ background: t.accentBg }}
          >
            <Mail size={32} style={{ color: t.accent }} />
          </div>
          <h3 className="text-[18px] font-semibold mb-2" style={{ color: t.textPrimary }}>
            No hay solicitudes
          </h3>
          <p className="text-[14px]" style={{ color: t.textSecondary }}>
            {searchTerm || filterStatus !== 'all'
              ? 'No se encontraron solicitudes con los filtros aplicados'
              : 'No hay solicitudes de registro en este momento'}
          </p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedRequest(null)}
        >
          <div
            className="max-w-2xl w-full rounded-[24px] border overflow-hidden shadow-2xl"
            style={{ background: t.cardBg, borderColor: t.borderCard }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="p-6 border-b flex items-center justify-between"
              style={{
                background: t.innerBg,
                borderColor: t.border
              }}
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedRequest.nombre_completo)}&background=5bcfc5&color=fff`}
                  alt={selectedRequest.nombre_completo}
                  className="w-16 h-16 rounded-xl object-cover"
                  style={{ border: `2px solid ${t.border}` }}
                />
                <div>
                  <h2 className="text-[20px] font-bold" style={{ color: t.textPrimary }}>
                    {selectedRequest.nombre_completo}
                  </h2>
                  <p className="text-[14px]" style={{ color: t.textSecondary }}>
                    {selectedRequest.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 rounded-xl transition-colors"
                style={{
                  background: t.inputBg,
                  color: t.textSecondary
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className="p-4 rounded-xl border"
                  style={{ background: t.innerBg, borderColor: t.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} style={{ color: t.accent }} />
                    <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                      DNI
                    </span>
                  </div>
                  <p className="text-[16px] font-semibold" style={{ color: t.textPrimary }}>
                    {selectedRequest.dni}
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border"
                  style={{ background: t.innerBg, borderColor: t.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Phone size={16} style={{ color: t.accent }} />
                    <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                      Teléfono
                    </span>
                  </div>
                  <p className="text-[16px] font-semibold" style={{ color: t.textPrimary }}>
                    {selectedRequest.telefono || '—'}
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border"
                  style={{ background: t.innerBg, borderColor: t.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar size={16} style={{ color: t.accent }} />
                    <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                      Fecha de Nacimiento
                    </span>
                  </div>
                  <p className="text-[16px] font-semibold" style={{ color: t.textPrimary }}>
                    {selectedRequest.fecha_nacimiento
                      ? new Date(`${selectedRequest.fecha_nacimiento}T00:00:00`).toLocaleDateString('es-PE', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric'
                        })
                      : '—'}
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border"
                  style={{ background: t.innerBg, borderColor: t.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} style={{ color: t.accent }} />
                    <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                      Rol Solicitado
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-lg"
                    style={{
                      background: getRoleColor(getRoleName(selectedRequest)).bg,
                      color: getRoleColor(getRoleName(selectedRequest)).text,
                      border: `1px solid ${getRoleColor(getRoleName(selectedRequest)).border}`,
                    }}
                  >
                    <Building2 size={12} />
                    {getRoleName(selectedRequest)}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: t.innerBg, borderColor: t.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={16} style={{ color: t.accent }} />
                  <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                    Dirección
                  </span>
                </div>
                <p className="text-[15px]" style={{ color: t.textPrimary }}>
                  {selectedRequest.direccion || '—'}
                </p>
              </div>

              {/* Request Date */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: t.innerBg, borderColor: t.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} style={{ color: t.accent }} />
                  <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                    Fecha de Solicitud
                  </span>
                </div>
                <p className="text-[15px]" style={{ color: t.textPrimary }}>
                  {formatDate(selectedRequest.fecha_solicitud)}
                </p>
              </div>

              {/* Notes */}
              {selectedRequest.notas && (
                <div
                  className="p-4 rounded-xl border"
                  style={{ background: t.innerBg, borderColor: t.border }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={16} style={{ color: t.accent }} />
                    <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                      Notas Adicionales
                    </span>
                  </div>
                  <p className="text-[15px]" style={{ color: t.textPrimary }}>
                    {selectedRequest.notas}
                  </p>
                </div>
              )}

              {/* Status */}
              <div
                className="p-4 rounded-xl border"
                style={{ background: t.innerBg, borderColor: t.border }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} style={{ color: t.accent }} />
                  <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                    Estado de la Solicitud
                  </span>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-[13px] font-bold px-4 py-2 rounded-xl"
                  style={{
                    background: getStatusBadge(selectedRequest.estado).bg,
                    color: getStatusBadge(selectedRequest.estado).color,
                    border: `1px solid ${getStatusBadge(selectedRequest.estado).border}`,
                  }}
                >
                  {(() => {
                    const StatusIcon = getStatusBadge(selectedRequest.estado).icon;
                    return <StatusIcon size={16} />;
                  })()}
                  {getStatusBadge(selectedRequest.estado).text}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            {selectedRequest.estado === 'PENDIENTE' && (
              <div
                className="p-6 border-t flex gap-3"
                style={{
                  background: t.innerBg,
                  borderColor: t.border
                }}
              >
                <button
                  onClick={() => rechazarMutation.mutate(selectedRequest.id_solicitud)}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2 border"
                  style={{
                    background: isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.08)',
                    color: '#ef4444',
                    borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.25)',
                    opacity: isProcessing ? 0.5 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                  }}
                >
                  <X size={18} />
                  Rechazar Solicitud
                </button>
                <button
                  onClick={() => aprobarMutation.mutate(selectedRequest.id_solicitud)}
                  disabled={isProcessing}
                  className="flex-1 py-3 rounded-xl font-semibold text-[14px] transition-all duration-300 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)',
                    color: '#171622',
                    boxShadow: '0 4px 16px rgba(91, 207, 197, 0.3)',
                    opacity: isProcessing ? 0.5 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Check size={18} />
                  {aprobarMutation.isPending ? 'Aprobando…' : 'Aprobar Solicitud'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ Credenciales del usuario creado ═══ */}
      {credenciales && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setCredenciales(null)}
        >
          <div
            className="max-w-md w-full rounded-[24px] border overflow-hidden shadow-2xl"
            style={{ background: t.cardBg, borderColor: t.borderCard }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-6 border-b flex items-center gap-4"
              style={{ background: t.innerBg, borderColor: t.border }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(34, 197, 94, 0.12)' }}
              >
                <CheckCircle size={24} style={{ color: '#4ade80' }} />
              </div>
              <div>
                <h2 className="text-[18px] font-bold" style={{ color: t.textPrimary }}>
                  ¡Usuario creado exitosamente!
                </h2>
                <p className="text-[13px]" style={{ color: t.textSecondary }}>
                  Entrega estas credenciales a {credenciales.nombre}
                </p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div
                className="p-4 rounded-xl border"
                style={{ background: t.innerBg, borderColor: t.border }}
              >
                <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                  Email (usuario de acceso)
                </span>
                <p className="text-[15px] font-semibold mt-1" style={{ color: t.textPrimary }}>
                  {credenciales.email}
                </p>
              </div>

              <div
                className="p-4 rounded-xl border flex items-center justify-between gap-3"
                style={{ background: t.innerBg, borderColor: t.border }}
              >
                <div className="min-w-0">
                  <span className="text-[12px] font-semibold" style={{ color: t.textSecondary }}>
                    Contraseña temporal
                  </span>
                  <p
                    className="text-[18px] font-bold mt-1 select-all"
                    style={{ color: t.accent, letterSpacing: '0.04em' }}
                  >
                    {credenciales.password}
                  </p>
                </div>
                <button
                  onClick={handleCopyPassword}
                  title="Copiar contraseña"
                  className="p-3 rounded-xl flex-shrink-0 transition-all"
                  style={{
                    background: 'linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)',
                    color: '#171622',
                    cursor: 'pointer',
                  }}
                >
                  <Copy size={18} />
                </button>
              </div>

              <p className="text-[12px]" style={{ color: t.textMuted }}>
                ⚠️ Esta contraseña solo se muestra una vez. Comparte de forma segura y
                recomienda cambiarla al iniciar sesión. También puede gestionarla en
                <span style={{ color: t.accent }}> Usuarios → editar</span>.
              </p>

              <button
                onClick={() => setCredenciales(null)}
                className="w-full py-3 rounded-xl font-semibold text-[14px]"
                style={{
                  background: 'linear-gradient(135deg, #5bcfc5 0%, #4bc0b6 100%)',
                  color: '#171622',
                  cursor: 'pointer',
                }}
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
