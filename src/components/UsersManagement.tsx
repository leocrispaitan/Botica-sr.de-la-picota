import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Clock,
  RefreshCw,
  AlertCircle,
  X,
  User,
  Lock,
  CreditCard,
  Image,
} from "lucide-react";
import { usersService, type Usuario } from "../services/usersService";
import { api } from "../services/api";

/* ─── Types ─────────────────────────────────────────────────────────── */
// Ya no necesitamos definir User aquí, lo importamos como Usuario desde usersService

/* ─── Form Data Interface ───────────────────────────────────────────── */
interface NewUserFormData {
  email: string;
  password: string;
  confirmPassword: string;
  dni: string;
  nombre_usuario: string;
  nombre_completo: string;
  id_rol: number;
  telefono: string;
  foto_perfil_url: string;
}

/* ─── Mock Data - ELIMINADO - Ahora usamos datos reales ─────────────── */

/* ─── Role Badge Colors ─────────────────────────────────────────────── */
const getRoleBadgeColors = (roleId: number, isDark: boolean) => {
  if (roleId === 1) {
    return {
      bg: isDark ? "rgba(139, 92, 246, 0.12)" : "rgba(139, 92, 246, 0.08)",
      text: "#a78bfa",
      border: isDark ? "rgba(139, 92, 246, 0.3)" : "rgba(139, 92, 246, 0.25)",
      icon: "👑",
    };
  }
  if (roleId === 2) {
    return {
      bg: isDark ? "rgba(34, 197, 94, 0.12)" : "rgba(34, 197, 94, 0.08)",
      text: "#4ade80",
      border: isDark ? "rgba(34, 197, 94, 0.3)" : "rgba(34, 197, 94, 0.25)",
      icon: "💼",
    };
  }
  if (roleId === 3) {
    return {
      bg: isDark ? "rgba(249, 115, 22, 0.12)" : "rgba(249, 115, 22, 0.08)",
      text: "#fb923c",
      border: isDark ? "rgba(249, 115, 22, 0.3)" : "rgba(249, 115, 22, 0.25)",
      icon: "📦",
    };
  }
  return {
    bg: isDark ? "rgba(91, 207, 197, 0.12)" : "rgba(91, 207, 197, 0.08)",
    text: "#5bcfc5",
    border: isDark ? "rgba(91, 207, 197, 0.3)" : "rgba(91, 207, 197, 0.25)",
    icon: "👤",
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
/*  USERS MANAGEMENT COMPONENT                                         */
/* ═══════════════════════════════════════════════════════════════════ */
export default function UsersManagement({ isDark = true }: { isDark?: boolean }) {
  // Estados para datos
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validatingDni, setValidatingDni] = useState(false);
  const itemsPerPage = 6;

  const t = getTheme(isDark);

  // Estado del formulario de nuevo usuario
  const [formData, setFormData] = useState<NewUserFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    dni: "",
    nombre_usuario: "",
    nombre_completo: "",
    id_rol: 2, // Por defecto: Vendedor
    telefono: "",
    foto_perfil_url: "",
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof NewUserFormData, string>>>({});

  // Limpiar formulario cuando se cierra el modal
  useEffect(() => {
    if (!showNewUserModal) {
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        dni: "",
        nombre_usuario: "",
        nombre_completo: "",
        id_rol: 2,
        telefono: "",
        foto_perfil_url: "",
      });
      setFormErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [showNewUserModal]);

  // Generar URL de vista previa del avatar
  const getAvatarPreview = () => {
    if (formData.foto_perfil_url && /^https?:\/\/.+/.test(formData.foto_perfil_url)) {
      return formData.foto_perfil_url;
    }
    // Generar avatar automático con iniciales si hay nombre completo
    if (formData.nombre_completo.trim()) {
      const nombre = encodeURIComponent(formData.nombre_completo.trim());
      return `https://ui-avatars.com/api/?name=${nombre}&background=5bcfc5&color=fff&size=200&bold=true`;
    }
    // Avatar por defecto
    return "https://ui-avatars.com/api/?name=?&background=e0e0e0&color=999&size=200";
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  // Función para cargar usuarios desde la API
  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usersService.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios. Por favor, intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Función para recargar usuarios
  const handleRefresh = () => {
    loadUsers();
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.dni.includes(searchTerm) ||
        user.nombre_usuario.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole = roleFilter === "all" || user.id_rol === roleFilter;
      const matchesStatus = statusFilter === "all" || user.estado_logico === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof NewUserFormData, string>> = {};

    // Email
    if (!formData.email.trim()) {
      errors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email inválido";
    }

    // Password - Nuevas reglas: mínimo 8 caracteres, letras mayúsculas, minúsculas y dígitos
    if (!formData.password) {
      errors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 8) {
      errors.password = "Mínimo 8 caracteres";
    } else if (!/[a-z]/.test(formData.password)) {
      errors.password = "Debe contener al menos una letra minúscula";
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = "Debe contener al menos una letra mayúscula";
    } else if (!/[0-9]/.test(formData.password)) {
      errors.password = "Debe contener al menos un dígito";
    }

    // Confirm Password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Las contraseñas no coinciden";
    }

    // DNI
    if (!formData.dni.trim()) {
      errors.dni = "El DNI es obligatorio";
    } else if (!/^\d{8}$/.test(formData.dni)) {
      errors.dni = "DNI debe tener 8 dígitos";
    }

    // Nombre Usuario
    if (!formData.nombre_usuario.trim()) {
      errors.nombre_usuario = "El nombre de usuario es obligatorio";
    } else if (formData.nombre_usuario.length < 4) {
      errors.nombre_usuario = "Mínimo 4 caracteres";
    }

    // Nombre Completo
    if (!formData.nombre_completo.trim()) {
      errors.nombre_completo = "El nombre completo es obligatorio";
    }

    // Teléfono (opcional pero si se proporciona, validar)
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      errors.telefono = "Teléfono debe tener 9 dígitos";
    }

    // URL de foto (opcional pero si se proporciona, validar)
    if (formData.foto_perfil_url && !/^https?:\/\/.+/.test(formData.foto_perfil_url)) {
      errors.foto_perfil_url = "URL inválida";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (field: keyof NewUserFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validar DNI con la API cuando se completan 8 dígitos
  const handleDniChange = async (dni: string) => {
    // Solo números, máximo 8 dígitos
    const cleanDni = dni.replace(/\D/g, "").slice(0, 8);
    handleInputChange("dni", cleanDni);

    // Si el DNI tiene 8 dígitos, validar con la API
    if (cleanDni.length === 8) {
      setValidatingDni(true);
      try {
        const response = await api.post("/validar-dni", { dni: cleanDni });

        if (response.data.success && response.data.data) {
          // Autocompletar campos con los datos obtenidos
          setFormData((prev) => ({
            ...prev,
            dni: cleanDni,
            nombre_completo: response.data.data.nombreCompleto || "",
            nombre_usuario: response.data.data.nombreUsuarioSugerido || "",
          }));

          // Limpiar errores de los campos autocompletados
          setFormErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.dni;
            delete newErrors.nombre_completo;
            delete newErrors.nombre_usuario;
            return newErrors;
          });

          console.log("✅ DNI validado:", response.data.data);
        } else {
          // Mostrar error si el DNI no es válido
          setFormErrors((prev) => ({
            ...prev,
            dni: response.data.message || "DNI no encontrado",
          }));
        }
      } catch (error: any) {
        console.error("❌ Error al validar DNI:", error);
        const errorMessage = error.response?.data?.message || "Error al validar DNI. Intenta nuevamente.";
        setFormErrors((prev) => ({
          ...prev,
          dni: errorMessage,
        }));
      } finally {
        setValidatingDni(false);
      }
    }
  };

  // Manejar envío del formulario
  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Por ahora solo mostramos los datos en consola
      console.log("✅ Formulario válido - Datos a enviar:", {
        email: formData.email,
        password: formData.password,
        dni: formData.dni,
        nombre_usuario: formData.nombre_usuario,
        nombre_completo: formData.nombre_completo,
        id_rol: formData.id_rol,
        telefono: formData.telefono || undefined,
        foto_perfil_url: formData.foto_perfil_url || undefined,
      });
      
      // Cerrar modal y mostrar mensaje de éxito
      setShowNewUserModal(false);
      alert("✅ Usuario creado exitosamente (solo frontend por ahora)");
    }
  };

  return (
    <div style={{ padding: "24px", background: t.mainBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
            Gestión de Usuarios
          </h1>
          <p style={{ fontSize: "14px", color: t.textSecondary }}>
            Administra y visualiza todos los usuarios del sistema
          </p>
        </div>
        
        {/* Botón de refrescar */}
        <button
          onClick={handleRefresh}
          disabled={loading}
          style={{
            padding: "10px 16px",
            borderRadius: "12px",
            border: `1px solid ${t.border}`,
            background: t.cardBg,
            color: t.textPrimary,
            fontSize: "14px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "'Cairo', sans-serif",
            transition: "all 0.2s",
            opacity: loading ? 0.6 : 1,
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
              (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
              (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
            }
          }}
        >
          <RefreshCw size={16} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "16px 20px",
            borderRadius: "16px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <AlertCircle size={20} color="#ef4444" />
          <div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "#ef4444", marginBottom: "4px" }}>
              Error al cargar datos
            </p>
            <p style={{ fontSize: "13px", color: "#ef4444" }}>{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            style={{
              marginLeft: "auto",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid #ef4444",
              background: "transparent",
              color: "#ef4444",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "24px" }}>
        {/* Total Usuarios - Blue Gradient */}
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
          {/* Decorative circles */}
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
                Total Usuarios
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "..." : users.length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  Registrados en el sistema
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
              <Shield size={28} color="#ffffff" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Usuarios Activos - Green Gradient */}
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
          {/* Decorative circles */}
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
                Usuarios Activos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "..." : users.filter((u) => u.estado_logico).length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  Con acceso al sistema
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

        {/* Usuarios Inactivos - Red/Orange Gradient */}
        <div 
          style={{ 
            background: "linear-gradient(135deg, #ea4335 0%, #f4511e 40%, #c62828 100%)",
            borderRadius: "24px", 
            padding: "24px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 8px 24px rgba(234, 67, 53, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Decorative circles */}
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
                Usuarios Inactivos
              </p>
              <p style={{ fontSize: "36px", fontWeight: 700, color: "#ffffff", marginBottom: "8px", lineHeight: 1 }}>
                {loading ? "..." : users.filter((u) => !u.estado_logico).length}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                  Sin acceso al sistema
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
                color: "#ea4335",
              }}>
                ✗
              </div>
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
                placeholder="Buscar por nombre, email, DNI o usuario..."
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
              {(roleFilter !== "all" || statusFilter !== "all") && (
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
                  {(roleFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)}
                </span>
              )}
            </button>

            {/* Add User Button */}
            <button
              onClick={() => setShowNewUserModal(true)}
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
              Nuevo Usuario
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
                  Rol
                </label>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value === "all" ? "all" : Number(e.target.value));
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
                  <option value="all">Todos los roles</option>
                  <option value={1}>👑 Administrador</option>
                  <option value={2}>💼 Vendedor</option>
                  <option value={3}>📦 Almacenero</option>
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

              {(roleFilter !== "all" || statusFilter !== "all") && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button
                    onClick={() => {
                      setRoleFilter("all");
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
          Mostrando {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} de {filteredUsers.length} usuarios
        </p>
        {filteredUsers.length === 0 && searchTerm && (
          <p style={{ fontSize: "13px", color: "#ef4444", fontWeight: 600 }}>
            No se encontraron resultados para "{searchTerm}"
          </p>
        )}
      </div>

      {/* Users Table */}
      <div style={{ background: t.cardBg, border: `1px solid ${t.borderCard}`, borderRadius: "20px", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: t.innerBg, borderBottom: `1px solid ${t.border}` }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Usuario
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Contacto
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Rol
                </th>
                <th style={{ padding: "16px 20px", textAlign: "left", fontSize: "12px", fontWeight: 700, color: t.textSecondary, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Último Acceso
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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <RefreshCw size={48} color={t.textMuted} style={{ animation: "spin 1s linear infinite" }} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                        Cargando usuarios...
                      </p>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Por favor espera un momento
                      </p>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: "60px 20px", textAlign: "center" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                      <Search size={48} color={t.textMuted} />
                      <p style={{ fontSize: "16px", fontWeight: 600, color: t.textPrimary }}>
                        No se encontraron usuarios
                      </p>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Intenta ajustar los filtros de búsqueda
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentUsers.map((user, index) => {
                  const roleBadge = getRoleBadgeColors(user.id_rol, isDark);
                  return (
                    <tr
                      key={user.id_usuario}
                      style={{
                        borderBottom: index < currentUsers.length - 1 ? `1px solid ${t.border}` : "none",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = t.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                      }}
                    >
                      {/* Usuario */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <img
                            src={user.foto_perfil_url}
                            alt={user.nombre_completo}
                            style={{
                              width: "44px",
                              height: "44px",
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: `2px solid ${t.border}`,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ minWidth: 0 }}>
                            <p style={{ fontSize: "14px", fontWeight: 600, color: t.textPrimary, marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {user.nombre_completo}
                            </p>
                            <p style={{ fontSize: "12px", color: t.textSecondary, display: "flex", alignItems: "center", gap: "4px" }}>
                              <span>@{user.nombre_usuario}</span>
                              <span style={{ color: t.textMuted }}>•</span>
                              <span>DNI: {user.dni}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Contacto */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.textPrimary }}>
                            <Mail size={14} color={t.textMuted} />
                            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.textSecondary }}>
                            <Phone size={14} color={t.textMuted} />
                            <span>{user.telefono}</span>
                          </div>
                        </div>
                      </td>

                      {/* Rol */}
                      <td style={{ padding: "16px 20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            background: roleBadge.bg,
                            color: roleBadge.text,
                            border: `1px solid ${roleBadge.border}`,
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ fontSize: "14px" }}>{roleBadge.icon}</span>
                          {user.rol?.nombre_rol || "USUARIO"}
                        </span>
                      </td>

                      {/* Último Acceso */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: t.textPrimary }}>
                            <Clock size={14} color={t.textMuted} />
                            <span>{new Date(user.ultimo_acceso).toLocaleDateString("es-PE", { day: "2-digit", month: "short", year: "numeric" })}</span>
                          </div>
                          <span style={{ fontSize: "12px", color: t.textSecondary, marginLeft: "20px" }}>
                            {new Date(user.ultimo_acceso).toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      </td>

                      {/* Estado */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "6px 12px",
                            borderRadius: "999px",
                            background: user.estado_logico ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                            color: user.estado_logico ? "#22c55e" : "#ef4444",
                            border: `1px solid ${user.estado_logico ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                            fontSize: "11px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: user.estado_logico ? "#22c55e" : "#ef4444" }} />
                          {user.estado_logico ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                          <button
                            title="Ver detalles"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = `${t.accent}15`;
                              (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            title="Editar usuario"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(249,115,22,0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#fb923c";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            title="Eliminar usuario"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.1)";
                              (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                          <button
                            title="Más opciones"
                            style={{
                              padding: "8px",
                              borderRadius: "8px",
                              border: "none",
                              background: "transparent",
                              color: t.textSecondary,
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                              (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                              (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                            }}
                          >
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div style={{ padding: "20px", borderTop: `1px solid ${t.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <p style={{ fontSize: "13px", color: t.textSecondary }}>
              Página {currentPage} de {totalPages}
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${t.border}`,
                  background: currentPage === 1 ? t.innerBg : t.cardBg,
                  color: currentPage === 1 ? t.textMuted : t.textPrimary,
                  fontSize: "13px",
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
                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== 1) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  }
                }}
              >
                <ChevronLeft size={16} />
                Anterior
              </button>

              <div style={{ display: "flex", gap: "4px" }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "10px",
                      border: `1px solid ${page === currentPage ? t.accent : t.border}`,
                      background: page === currentPage ? `${t.accent}15` : t.cardBg,
                      color: page === currentPage ? t.accent : t.textPrimary,
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Cairo', sans-serif",
                      transition: "all 0.2s",
                      minWidth: "36px",
                    }}
                    onMouseEnter={(e) => {
                      if (page !== currentPage) {
                        (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (page !== currentPage) {
                        (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                      }
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  borderRadius: "10px",
                  border: `1px solid ${t.border}`,
                  background: currentPage === totalPages ? t.innerBg : t.cardBg,
                  color: currentPage === totalPages ? t.textMuted : t.textPrimary,
                  fontSize: "13px",
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
                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== totalPages) {
                    (e.currentTarget as HTMLButtonElement).style.background = t.cardBg;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  }
                }}
              >
                Siguiente
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MODAL: NUEVO USUARIO - DISEÑO MEJORADO                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {showNewUserModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 0, 0, 0.7)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
          }}
          onClick={() => setShowNewUserModal(false)}
        >
          <div
            style={{
              background: t.cardBg,
              borderRadius: "24px",
              maxWidth: "1100px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4)",
              border: `1px solid ${t.borderCard}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div
              style={{
                padding: "24px 32px",
                borderBottom: `1px solid ${t.border}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "sticky",
                top: 0,
                background: t.cardBg,
                zIndex: 1,
                borderRadius: "24px 24px 0 0",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 8px 16px ${t.accent}40`,
                  }}
                >
                  <UserPlus size={28} color="#fff" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 style={{ fontSize: "24px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                    Crear Nuevo Usuario
                  </h2>
                  <p style={{ fontSize: "14px", color: t.textSecondary }}>
                    Complete la información del nuevo usuario del sistema
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewUserModal(false)}
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: t.textSecondary,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(239, 68, 68, 0.1)";
                  (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmitNewUser} style={{ padding: "32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "32px" }}>
                
                {/* Columna Izquierda: Formulario */}
                <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
                  
                  {/* Sección: Información de Cuenta */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                      <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        background: `${t.accent}15`, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                      }}>
                        <Lock size={16} color={t.accent} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        Información de Cuenta
                      </h3>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {/* Email */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Email <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="usuario@botica.com"
                            style={{
                              width: "100%",
                              padding: "12px 14px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.email ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.email) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.email ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {formErrors.email && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.email}
                          </p>
                        )}
                      </div>

                      {/* Rol */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Rol <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Shield size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                          <select
                            value={formData.id_rol}
                            onChange={(e) => handleInputChange("id_rol", Number(e.target.value))}
                            style={{
                              width: "100%",
                              padding: "12px 14px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              cursor: "pointer",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = t.accent;
                              e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            <option value={1}>👑 Administrador</option>
                            <option value={2}>💼 Vendedor</option>
                            <option value={3}>📦 Almacenero</option>
                          </select>
                        </div>
                      </div>

                      {/* Contraseña con toggle */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Contraseña <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            placeholder="Mín. 8 caracteres (Aa-Zz, 0-9)"
                            style={{
                              width: "100%",
                              padding: "12px 44px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.password ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.password) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.password ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: t.textMuted,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = t.textMuted;
                            }}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {formErrors.password && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.password}
                          </p>
                        )}
                        {!formErrors.password && formData.password && (
                          <div style={{ marginTop: "8px", padding: "8px 12px", background: t.innerBg, borderRadius: "8px", fontSize: "11px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: formData.password.length >= 8 ? "#22c55e" : t.textMuted }}>
                              <span>{formData.password.length >= 8 ? "✓" : "○"}</span>
                              <span>Mínimo 8 caracteres</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: /[a-z]/.test(formData.password) ? "#22c55e" : t.textMuted }}>
                              <span>{/[a-z]/.test(formData.password) ? "✓" : "○"}</span>
                              <span>Al menos una letra minúscula</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px", color: /[A-Z]/.test(formData.password) ? "#22c55e" : t.textMuted }}>
                              <span>{/[A-Z]/.test(formData.password) ? "✓" : "○"}</span>
                              <span>Al menos una letra mayúscula</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", color: /[0-9]/.test(formData.password) ? "#22c55e" : t.textMuted }}>
                              <span>{/[0-9]/.test(formData.password) ? "✓" : "○"}</span>
                              <span>Al menos un dígito</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Confirmar Contraseña con toggle */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Confirmar Contraseña <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            placeholder="Repite la contraseña"
                            style={{
                              width: "100%",
                              padding: "12px 44px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.confirmPassword ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.confirmPassword) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.confirmPassword ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{
                              position: "absolute",
                              right: "12px",
                              top: "50%",
                              transform: "translateY(-50%)",
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: t.textMuted,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "4px",
                              transition: "color 0.2s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = t.accent;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.color = t.textMuted;
                            }}
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {formErrors.confirmPassword && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Separador */}
                  <div style={{ height: "1px", background: t.border }} />

                  {/* Sección: Información Personal */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                      <div style={{ 
                        width: "32px", 
                        height: "32px", 
                        borderRadius: "8px", 
                        background: `${t.accent}15`, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                      }}>
                        <User size={16} color={t.accent} />
                      </div>
                      <h3 style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary }}>
                        Información Personal
                      </h3>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {/* DNI */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          DNI <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <CreditCard size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted, zIndex: 1 }} />
                          {validatingDni && (
                            <RefreshCw 
                              size={16} 
                              style={{ 
                                position: "absolute", 
                                right: "14px", 
                                top: "50%", 
                                transform: "translateY(-50%)", 
                                color: t.accent,
                                animation: "spin 1s linear infinite",
                                zIndex: 1
                              }} 
                            />
                          )}
                          <input
                            type="text"
                            value={formData.dni}
                            onChange={(e) => handleDniChange(e.target.value)}
                            placeholder="12345678"
                            maxLength={8}
                            disabled={validatingDni}
                            style={{
                              width: "100%",
                              padding: "12px 44px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.dni ? "#ef4444" : validatingDni ? t.accent : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                              opacity: validatingDni ? 0.7 : 1,
                              cursor: validatingDni ? "not-allowed" : "text",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.dni && !validatingDni) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.dni ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {validatingDni && (
                          <p style={{ fontSize: "12px", color: t.accent, marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <RefreshCw size={12} style={{ animation: "spin 1s linear infinite" }} /> Validando DNI...
                          </p>
                        )}
                        {formErrors.dni && !validatingDni && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.dni}
                          </p>
                        )}
                      </div>

                      {/* Nombre de Usuario */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Nombre de Usuario <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="text"
                            value={formData.nombre_usuario}
                            onChange={(e) => handleInputChange("nombre_usuario", e.target.value)}
                            placeholder="admin.jperez"
                            style={{
                              width: "100%",
                              padding: "12px 14px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.nombre_usuario ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.nombre_usuario) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.nombre_usuario ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {formErrors.nombre_usuario && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.nombre_usuario}
                          </p>
                        )}
                      </div>

                      {/* Nombre Completo */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Nombre Completo <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="text"
                            value={formData.nombre_completo}
                            onChange={(e) => handleInputChange("nombre_completo", e.target.value)}
                            placeholder="Juan Pérez Gómez"
                            style={{
                              width: "100%",
                              padding: "12px 14px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.nombre_completo ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.nombre_completo) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.nombre_completo ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {formErrors.nombre_completo && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.nombre_completo}
                          </p>
                        )}
                      </div>

                      {/* Teléfono */}
                      <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                          Teléfono <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                        </label>
                        <div style={{ position: "relative" }}>
                          <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                          <input
                            type="text"
                            value={formData.telefono}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "").slice(0, 9);
                              handleInputChange("telefono", value);
                            }}
                            placeholder="987654321"
                            maxLength={9}
                            style={{
                              width: "100%",
                              padding: "12px 14px 12px 44px",
                              borderRadius: "12px",
                              border: `2px solid ${formErrors.telefono ? "#ef4444" : t.border}`,
                              background: t.inputBg,
                              color: t.textPrimary,
                              fontSize: "14px",
                              outline: "none",
                              fontFamily: "'Cairo', sans-serif",
                              transition: "all 0.2s",
                            }}
                            onFocus={(e) => {
                              if (!formErrors.telefono) {
                                e.currentTarget.style.borderColor = t.accent;
                                e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                              }
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = formErrors.telefono ? "#ef4444" : t.border;
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        </div>
                        {formErrors.telefono && (
                          <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                            <AlertCircle size={12} /> {formErrors.telefono}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* URL Foto de Perfil */}
                    <div style={{ marginTop: "16px" }}>
                      <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "8px" }}>
                        URL de Foto de Perfil <span style={{ fontSize: "11px", color: t.textMuted }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Image size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: t.textMuted }} />
                        <input
                          type="text"
                          value={formData.foto_perfil_url}
                          onChange={(e) => handleInputChange("foto_perfil_url", e.target.value)}
                          placeholder="https://ejemplo.com/avatar.jpg"
                          style={{
                            width: "100%",
                            padding: "12px 14px 12px 44px",
                            borderRadius: "12px",
                            border: `2px solid ${formErrors.foto_perfil_url ? "#ef4444" : t.border}`,
                            background: t.inputBg,
                            color: t.textPrimary,
                            fontSize: "14px",
                            outline: "none",
                            fontFamily: "'Cairo', sans-serif",
                            transition: "all 0.2s",
                          }}
                          onFocus={(e) => {
                            if (!formErrors.foto_perfil_url) {
                              e.currentTarget.style.borderColor = t.accent;
                              e.currentTarget.style.boxShadow = `0 0 0 3px ${t.accent}15`;
                            }
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = formErrors.foto_perfil_url ? "#ef4444" : t.border;
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      {formErrors.foto_perfil_url && (
                        <p style={{ fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }}>
                          <AlertCircle size={12} /> {formErrors.foto_perfil_url}
                        </p>
                      )}
                      <p style={{ fontSize: "11px", color: t.textMuted, marginTop: "6px" }}>
                        Deja vacío para generar un avatar automático con las iniciales
                      </p>
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Vista Previa del Avatar */}
                <div>
                  <div style={{ position: "sticky", top: "32px" }}>
                    <div style={{ 
                      background: t.innerBg, 
                      borderRadius: "20px", 
                      padding: "24px",
                      border: `1px solid ${t.border}`,
                    }}>
                      <p style={{ fontSize: "13px", fontWeight: 600, color: t.textSecondary, marginBottom: "16px", textAlign: "center" }}>
                        Vista Previa del Perfil
                      </p>
                      
                      {/* Avatar Preview */}
                      <div style={{ 
                        width: "180px", 
                        height: "180px", 
                        margin: "0 auto 20px",
                        borderRadius: "50%",
                        overflow: "hidden",
                        border: `4px solid ${t.accent}`,
                        boxShadow: `0 8px 24px ${t.accent}30`,
                      }}>
                        <img
                          src={getAvatarPreview()}
                          alt="Avatar Preview"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=?&background=e0e0e0&color=999&size=200";
                          }}
                        />
                      </div>

                      {/* Info Preview */}
                      <div style={{ textAlign: "center", marginBottom: "20px" }}>
                        <p style={{ fontSize: "16px", fontWeight: 700, color: t.textPrimary, marginBottom: "4px" }}>
                          {formData.nombre_completo || "Nombre del Usuario"}
                        </p>
                        <p style={{ fontSize: "13px", color: t.textSecondary, marginBottom: "2px" }}>
                          @{formData.nombre_usuario || "nombre.usuario"}
                        </p>
                        <p style={{ fontSize: "12px", color: t.textMuted }}>
                          {formData.email || "email@ejemplo.com"}
                        </p>
                      </div>

                      {/* Role Badge */}
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            background: getRoleBadgeColors(formData.id_rol, isDark).bg,
                            color: getRoleBadgeColors(formData.id_rol, isDark).text,
                            border: `1px solid ${getRoleBadgeColors(formData.id_rol, isDark).border}`,
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.03em",
                          }}
                        >
                          <span style={{ fontSize: "16px" }}>{getRoleBadgeColors(formData.id_rol, isDark).icon}</span>
                          {formData.id_rol === 1 ? "ADMINISTRATIVO" : formData.id_rol === 2 ? "VENDEDOR" : "ALMACENERO"}
                        </span>
                      </div>

                      {/* Additional Info */}
                      <div style={{ 
                        background: t.cardBg, 
                        borderRadius: "12px", 
                        padding: "16px",
                        fontSize: "12px",
                        color: t.textSecondary,
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                          <CreditCard size={14} color={t.textMuted} />
                          <span>DNI: {formData.dni || "--------"}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <Phone size={14} color={t.textMuted} />
                          <span>Tel: {formData.telefono || "No especificado"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones del Footer */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  justifyContent: "flex-end",
                  marginTop: "32px",
                  paddingTop: "24px",
                  borderTop: `1px solid ${t.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowNewUserModal(false)}
                  style={{
                    padding: "12px 28px",
                    borderRadius: "12px",
                    border: `2px solid ${t.border}`,
                    background: "transparent",
                    color: t.textSecondary,
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                    (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                    (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary;
                    (e.currentTarget as HTMLButtonElement).style.borderColor = t.border;
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "12px 32px",
                    borderRadius: "12px",
                    border: "none",
                    background: `linear-gradient(135deg, ${t.accent} 0%, ${t.accentHover} 100%)`,
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                    boxShadow: `0 4px 16px ${t.accent}40`,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 24px ${t.accent}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${t.accent}40`;
                  }}
                >
                  <UserPlus size={18} />
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CSS Animation ────────────────────────────────────────────────── */
// Agregar esta animación CSS al archivo
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;
if (!document.head.querySelector('style[data-spin-animation]')) {
  style.setAttribute('data-spin-animation', 'true');
  document.head.appendChild(style);
}
