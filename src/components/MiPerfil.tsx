import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  CreditCard,
  Camera,
  Edit2,
  Save,
  X,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface MiPerfilProps {
  isDark: boolean;
}

export default function MiPerfil({ isDark }: MiPerfilProps) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Estados para el formulario de edición
  const [formData, setFormData] = useState({
    nombre_completo: user?.nombre_completo || "Leonel Jan Pérez",
    email: user?.email || "leonel.perez@botica.com",
    dni: user?.dni || "12345678",
    telefono: user?.telefono || "987654321",
    direccion: "Jr. Lima 123, Picota, San Martín",
    fecha_nacimiento: "1990-05-15",
  });

  // Estados para cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Datos del usuario con valores mock
  const userPhoto = user?.foto_perfil_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nombre_completo)}&background=5bcfc5&color=fff&size=200`;
  const userRole = user?.rol?.nombre_rol || "ADMINISTRATIVO";
  const userRoleDescription = user?.rol?.descripcion || "Acceso total: gestión de usuarios, reportes y configuración";
  // Valores mock para fechas (TODO: agregar estos campos al tipo User cuando estén en el backend)
  const fechaRegistro = "15 de enero de 2024";
  const ultimoAcceso = "Hoy, 10:30 AM";

  // Colores del tema
  const t = isDark ? {
    mainBg: "#171622",
    cardBg: "#212130",
    inputBg: "#212130",
    borderCard: "rgba(46,46,66,0.4)",
    borderInput: "rgba(46,46,66,0.8)",
    textPrimary: "#ffffff",
    textSecondary: "#828690",
    textMuted: "#969ba0",
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    accentBg: "rgba(91,207,197,0.1)",
    hoverBg: "#2c2c3e",
  } : {
    mainBg: "#f0f2f8",
    cardBg: "#ffffff",
    inputBg: "#f5f6fa",
    borderCard: "rgba(220,222,235,0.7)",
    borderInput: "rgba(220,222,235,0.9)",
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    accentBg: "rgba(91,207,197,0.1)",
    hoverBg: "#ecedf5",
  };

  // Función para obtener colores del rol
  const getRoleBadgeColors = (role: string) => {
    const roleUpper = role.toUpperCase();
    if (roleUpper.includes('ADMIN')) {
      return {
        bg: isDark ? 'rgba(139, 92, 246, 0.12)' : 'rgba(139, 92, 246, 0.08)',
        text: '#a78bfa',
        border: isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.25)',
        icon: '👑'
      };
    }
    if (roleUpper.includes('VENDEDOR')) {
      return {
        bg: isDark ? 'rgba(34, 197, 94, 0.12)' : 'rgba(34, 197, 94, 0.08)',
        text: '#4ade80',
        border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.25)',
        icon: '💼'
      };
    }
    if (roleUpper.includes('ALMACEN')) {
      return {
        bg: isDark ? 'rgba(249, 115, 22, 0.12)' : 'rgba(249, 115, 22, 0.08)',
        text: '#fb923c',
        border: isDark ? 'rgba(249, 115, 22, 0.3)' : 'rgba(249, 115, 22, 0.25)',
        icon: '📦'
      };
    }
    return {
      bg: isDark ? 'rgba(91, 207, 197, 0.12)' : 'rgba(91, 207, 197, 0.08)',
      text: '#5bcfc5',
      border: isDark ? 'rgba(91, 207, 197, 0.3)' : 'rgba(91, 207, 197, 0.25)',
      icon: '👤'
    };
  };

  const roleBadge = getRoleBadgeColors(userRole);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
    setPasswordError("");
    setPasswordSuccess(false);
  };

  const handleSaveProfile = () => {
    // Aquí iría la lógica para guardar el perfil
    console.log("Guardando perfil:", formData);
    setIsEditing(false);
    // TODO: Integrar con el backend
  };

  const handleCancelEdit = () => {
    // Restaurar datos originales
    setFormData({
      nombre_completo: user?.nombre_completo || "Leonel Jan Pérez",
      email: user?.email || "leonel.perez@botica.com",
      dni: user?.dni || "12345678",
      telefono: user?.telefono || "987654321",
      direccion: "Jr. Lima 123, Picota, San Martín",
      fecha_nacimiento: "1990-05-15",
    });
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    // Validaciones
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("Todos los campos son obligatorios");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("La nueva contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Las contraseñas no coinciden");
      return;
    }

    // Aquí iría la lógica para cambiar la contraseña
    console.log("Cambiando contraseña");
    setPasswordSuccess(true);
    setPasswordError("");
    
    // Limpiar formulario y cerrar modal después de 2 segundos
    setTimeout(() => {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordModal(false);
      setPasswordSuccess(false);
    }, 2000);

    // TODO: Integrar con el backend
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: t.textPrimary }}>
            Mi Perfil
          </h1>
          <p className="text-sm" style={{ color: t.textSecondary }}>
            Gestiona tu información personal y configuración de cuenta
          </p>
        </div>
        
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{
              background: t.accent,
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 16px rgba(91, 207, 197, 0.25)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = t.accent;
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
            }}
          >
            <Edit2 size={18} />
            Editar Perfil
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancelEdit}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)",
                color: "#ef4444",
                border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)"}`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(239, 68, 68, 0.18)" : "rgba(239, 68, 68, 0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)";
              }}
            >
              <X size={18} />
              Cancelar
            </button>
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: t.accent,
                color: "#ffffff",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 16px rgba(91, 207, 197, 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <Save size={18} />
              Guardar Cambios
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Foto de perfil y estadísticas */}
        <div className="space-y-6">
          {/* Card de foto de perfil */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
            }}
          >
            <div className="flex flex-col items-center">
              {/* Foto de perfil */}
              <div className="relative mb-4">
                <img
                  src={userPhoto}
                  alt={formData.nombre_completo}
                  className="w-32 h-32 rounded-full object-cover"
                  style={{
                    border: `3px solid ${t.accent}`,
                    boxShadow: `0 8px 24px rgba(91, 207, 197, 0.25)`,
                  }}
                />
                <button
                  className="absolute bottom-0 right-0 p-2 rounded-full transition-all duration-200"
                  style={{
                    background: t.accent,
                    color: "#ffffff",
                    border: `3px solid ${t.cardBg}`,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                    (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                  }}
                >
                  <Camera size={18} />
                </button>
              </div>

              {/* Nombre */}
              <h2 className="text-xl font-bold text-center mb-2" style={{ color: t.textPrimary }}>
                {formData.nombre_completo}
              </h2>

              {/* Email */}
              <p className="text-sm text-center mb-4" style={{ color: t.textSecondary }}>
                {formData.email}
              </p>

              {/* Badge de rol */}
              <div className="w-full mb-4">
                <div
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl"
                  style={{
                    background: roleBadge.bg,
                    border: `1px solid ${roleBadge.border}`,
                  }}
                >
                  <Shield size={18} style={{ color: roleBadge.text }} />
                  <div className="text-center">
                    <p className="text-xs font-bold uppercase" style={{ color: roleBadge.text }}>
                      {roleBadge.icon} {userRole}
                    </p>
                    <p className="text-xs mt-1" style={{ color: t.textMuted }}>
                      {userRoleDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información de cuenta */}
              <div className="w-full space-y-3 pt-4 border-t" style={{ borderColor: t.borderCard }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: t.textSecondary }}>
                    Fecha de registro
                  </span>
                  <span className="text-xs font-semibold" style={{ color: t.textPrimary }}>
                    {fechaRegistro}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: t.textSecondary }}>
                    Último acceso
                  </span>
                  <span className="text-xs font-semibold" style={{ color: t.textPrimary }}>
                    {ultimoAcceso}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card de seguridad */}
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="p-3 rounded-xl"
                style={{
                  background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
                }}
              >
                <Lock size={20} style={{ color: "#a78bfa" }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: t.textPrimary }}>
                  Seguridad
                </h3>
                <p className="text-xs" style={{ color: t.textSecondary }}>
                  Gestiona tu contraseña
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
              style={{
                background: t.accentBg,
                color: t.accent,
                border: `1px solid ${t.accent}40`,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(91, 207, 197, 0.18)" : "rgba(91, 207, 197, 0.15)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.accentBg;
              }}
            >
              <Lock size={16} />
              Cambiar Contraseña
            </button>
          </div>
        </div>

        {/* Columna derecha - Información personal */}
        <div className="lg:col-span-2">
          <div
            className="rounded-2xl p-6 border"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
            }}
          >
            <h3 className="text-lg font-bold mb-6" style={{ color: t.textPrimary }}>
              Información Personal
            </h3>

            <div className="space-y-6">
              {/* Nombre Completo */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Nombre Completo
                  </div>
                </label>
                <input
                  type="text"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                  style={{
                    background: isEditing ? t.inputBg : t.cardBg,
                    borderColor: t.borderInput,
                    color: t.textPrimary,
                    cursor: isEditing ? "text" : "not-allowed",
                  }}
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    Correo Electrónico
                  </div>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                  style={{
                    background: isEditing ? t.inputBg : t.cardBg,
                    borderColor: t.borderInput,
                    color: t.textPrimary,
                    cursor: isEditing ? "text" : "not-allowed",
                  }}
                />
              </div>

              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DNI */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} />
                      DNI
                    </div>
                  </label>
                  <input
                    type="text"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    maxLength={8}
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                    style={{
                      background: isEditing ? t.inputBg : t.cardBg,
                      borderColor: t.borderInput,
                      color: t.textPrimary,
                      cursor: isEditing ? "text" : "not-allowed",
                    }}
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      Teléfono
                    </div>
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                    style={{
                      background: isEditing ? t.inputBg : t.cardBg,
                      borderColor: t.borderInput,
                      color: t.textPrimary,
                      cursor: isEditing ? "text" : "not-allowed",
                    }}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    Dirección
                  </div>
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                  style={{
                    background: isEditing ? t.inputBg : t.cardBg,
                    borderColor: t.borderInput,
                    color: t.textPrimary,
                    cursor: isEditing ? "text" : "not-allowed",
                  }}
                />
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    Fecha de Nacimiento
                  </div>
                </label>
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 rounded-xl border transition-all duration-200"
                  style={{
                    background: isEditing ? t.inputBg : t.cardBg,
                    borderColor: t.borderInput,
                    color: t.textPrimary,
                    cursor: isEditing ? "text" : "not-allowed",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de cambiar contraseña */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          style={{
            background: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="rounded-2xl p-6 border max-w-md w-full mx-4"
            style={{
              background: t.cardBg,
              borderColor: t.borderCard,
              boxShadow: "0 20px 48px -8px rgba(0,0,0,0.4)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="p-3 rounded-xl"
                  style={{
                    background: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
                  }}
                >
                  <Lock size={20} style={{ color: "#a78bfa" }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: t.textPrimary }}>
                    Cambiar Contraseña
                  </h3>
                  <p className="text-xs" style={{ color: t.textSecondary }}>
                    Actualiza tu contraseña de acceso
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordModal(false)}
                className="p-2 rounded-lg transition-all duration-200"
                style={{
                  color: t.textSecondary,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Formulario */}
            <div className="space-y-4 mb-6">
              {/* Contraseña actual */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200"
                    style={{
                      background: t.inputBg,
                      borderColor: t.borderInput,
                      color: t.textPrimary,
                    }}
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: t.textSecondary }}
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200"
                    style={{
                      background: t.inputBg,
                      borderColor: t.borderInput,
                      color: t.textPrimary,
                    }}
                    placeholder="Ingresa tu nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: t.textSecondary }}
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmar contraseña */}
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: t.textSecondary }}>
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 pr-12 rounded-xl border transition-all duration-200"
                    style={{
                      background: t.inputBg,
                      borderColor: t.borderInput,
                      color: t.textPrimary,
                    }}
                    placeholder="Confirma tu nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    style={{ color: t.textSecondary }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Mensajes de error o éxito */}
              {passwordError && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: isDark ? "rgba(239, 68, 68, 0.12)" : "rgba(239, 68, 68, 0.08)",
                    border: `1px solid ${isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.25)"}`,
                  }}
                >
                  <AlertCircle size={18} style={{ color: "#ef4444" }} />
                  <p className="text-sm" style={{ color: "#ef4444" }}>
                    {passwordError}
                  </p>
                </div>
              )}

              {passwordSuccess && (
                <div
                  className="flex items-center gap-2 p-3 rounded-xl"
                  style={{
                    background: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
                    border: `1px solid ${isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)"}`,
                  }}
                >
                  <CheckCircle2 size={18} style={{ color: "#22c55e" }} />
                  <p className="text-sm" style={{ color: "#22c55e" }}>
                    Contraseña actualizada exitosamente
                  </p>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: t.hoverBg,
                  color: t.textPrimary,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "0.8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.opacity = "1";
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleChangePassword}
                disabled={passwordSuccess}
                className="flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200"
                style={{
                  background: passwordSuccess ? "#22c55e" : t.accent,
                  color: "#ffffff",
                  cursor: passwordSuccess ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!passwordSuccess) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.accentHover;
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!passwordSuccess) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.accent;
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  }
                }}
              >
                {passwordSuccess ? "¡Actualizada!" : "Actualizar Contraseña"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
