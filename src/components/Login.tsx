import { useState, useRef, useCallback } from "react";
import LottieModule from "lottie-react";
import { motion } from "framer-motion";
import animationData from "../assets/pharmacist-animation.json";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ChevronRight,
  Package,
  AlertTriangle,
  ArrowLeft,
  BriefcaseBusiness,
  IdCard,
  Phone,
  User,
  UserPlus,
} from "lucide-react";
import authService from "../services/authService";

/* ─── Premium Light Theme ─────────────────────────── */
const theme = {
  mainBg: "#f4f7fb",
  cardBg: "#ffffff",
  innerBg: "#f8fafc",
  sidebarBg: "#ffffff",
  accent: "#2563eb",
  accentHover: "#1d4ed8",
  accentGlow: "rgba(37, 99, 235, 0.15)",
  accentSoft: "rgba(37, 99, 235, 0.08)",
  textPrimary: "#1e293b",
  textSecondary: "#475569",
  textMuted: "#64748b",
  border: "rgba(226, 232, 240, 0.8)",
  borderCard: "rgba(226, 232, 240, 0.5)",
  danger: "#ef4444",
  dangerSoft: "rgba(239, 68, 68, 0.1)",
  success: "#10b981",
  warning: "#f59e0b",
  blue: "#3b82f6",
};

/* ─── Secure Badge ───────────────────────────────────────────────────── */
export function SecureBadge() {
  return (
    <div
      style={{
        position: "absolute",
        top: "-14px",
        right: "24px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 16px",
        borderRadius: "999px",
        background: theme.cardBg,
        border: `1px solid ${theme.border}`,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        zIndex: 10,
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: theme.success,
          boxShadow: `0 0 0 0 rgba(16, 185, 129, 0.5)`,
          animation: "securePulse 2s infinite",
        }}
      />
      <span
        style={{
          fontSize: "11px",
          letterSpacing: "0.05em",
          color: theme.textSecondary,
          fontWeight: 600,
        }}
      >
        Conexión segura
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ *
 *  LOGIN COMPONENT                                                       *
 * ═══════════════════════════════════════════════════════════════════════ */
export default function Login({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  /* ─── State ──────────────────────────────────────────────────────────── */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [remember, setRemember] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registerForm, setRegisterForm] = useState({
    email: "",
    role: "Vendedor",
    password: "",
    confirmPassword: "",
    dni: "",
    username: "",
    fullName: "",
    phone: "",
  });
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [shake, setShake] = useState(false);
  const [apiError, setApiError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  /* ─── Validation ─────────────────────────────────────────────────────── */
  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const clearErrors = useCallback(() => {
    setEmailError("");
    setPasswordError("");
    setApiError("");
  }, []);

  /* ─── Submit ─────────────────────────────────────────────────────────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    clearErrors();

    if (!validateEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres");
      valid = false;
    }

    if (!valid) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setStatus("loading");

    try {
      const response = await authService.login({ email, password });

      if (response.success) {
        setStatus("success");
        setTimeout(() => {
          setStatus("idle");
          if (onLoginSuccess) onLoginSuccess();
        }, 1500);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMessage = error.response?.data?.message || "Error al iniciar sesión. Verifica tus credenciales.";
      setApiError(errorMessage);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setStatus("idle");
      }, 400);
    }
  };

  const updateRegisterField = (
    field: keyof typeof registerForm,
    value: string
  ) => {
    setRegisterForm((current) => ({ ...current, [field]: value }));
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @keyframes securePulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(3px); }
        }
        @keyframes spinLoader {
          to { transform: rotate(360deg); }
        }
        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes successPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001s !important; animation-iteration-count: 1 !important; transition-duration: 0.001s !important; }
        }
      `}</style>

      <div
        id="login-page"
        style={{
          minHeight: "100vh",
          display: "flex",
          fontFamily: "'Cairo', sans-serif",
          background: theme.mainBg,
          color: theme.textSecondary,
          position: "relative",
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {/* ═══ LEFT PANEL — Brand / Context ═══════════════════════════════ */}
        <div
          style={{
            width: "46%",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "48px",
            borderRight: `1px solid ${theme.border}`,
            background: theme.sidebarBg,
          }}
          className="login-brand-panel"
        >
          {/* Logo */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              animation: "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) 0.1s both",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "14px",
                background: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 24px ${theme.accentGlow}`,
              }}
            >
              <Package size={20} color="#ffffff" strokeWidth={2.2} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                  color: theme.textPrimary,
                  letterSpacing: "-0.01em",
                }}
              >
                Botica Control
              </div>
              <div
                style={{
                  fontSize: "10px",
                  letterSpacing: "0.18em",
                  color: theme.textMuted,
                  textTransform: "uppercase",
                }}
              >
                Sistema de inventarios
              </div>
            </div>
          </div>

          {/* Headline + Lottie Animation */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              animation: "fadeSlideUp 0.6s cubic-bezier(.22,1,.36,1) 0.2s both",
            }}
          >
            <div style={{ maxWidth: "440px", marginBottom: "32px" }}>
              <h1
                style={{
                  fontSize: "36px",
                  lineHeight: 1.12,
                  fontWeight: 800,
                  color: theme.textPrimary,
                  marginBottom: "14px",
                }}
              >
                Bienvenido al sistema
              </h1>
              <p
                style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: theme.textSecondary,
                }}
              >
                Gestión de stock, lotes y vencimientos en tiempo real.
              </p>
            </div>
            
            <div style={{ width: "100%", maxWidth: "480px", margin: "0 auto" }}>
              {/* @ts-ignore - Handle Vite CJS/ESM interop differences */}
              {(() => {
                const Lottie = (LottieModule as any).default || LottieModule;
                return (
                  <motion.div animate={{ scaleX: -1 }}>
                    <Lottie animationData={animationData} loop={true} />
                  </motion.div>
                );
              })()}
            </div>
          </div>

          <div /> {/* Spacer for flex-between */}
        </div>

        {/* ═══ RIGHT PANEL — Login Form ═══════════════════════════════════ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            position: "relative",
          }}
          className="login-form-panel"
        >
          {/* Mobile brand bar */}
          <div
            className="login-mobile-brand"
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "none",
              alignItems: "center",
              gap: "10px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: theme.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 12px ${theme.accentGlow}`,
              }}
            >
              <Package size={16} color="#ffffff" strokeWidth={2.2} />
            </div>
            <span
              style={{
                fontWeight: 700,
                fontSize: "15px",
                color: theme.textPrimary,
              }}
            >
              Botica Control
            </span>
          </div>

          {/* ─── Form Card ─────────────────────────────────────────────── */}
          <div
            style={{
              width: "100%",
              maxWidth: authView === "register" ? "760px" : "420px",
              position: "relative",
              zIndex: 10,
              transition: "max-width 0.25s ease",
            }}
          >
            <div
              style={{
                background: theme.cardBg,
                border: `1px solid ${theme.borderCard}`,
                borderRadius: "24px",
                padding: authView === "register" ? "36px" : "40px 32px",
                position: "relative",
                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
                animation: shake
                  ? "shakeX 0.38s ease"
                  : "cardReveal 0.65s cubic-bezier(.22,1,.36,1) both",
              }}
            >
              {authView === "register" && (
                <div
                  style={{
                    animation:
                      "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) 0.15s both",
                    marginBottom: "24px",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAuthView("login")}
                    style={{
                      border: "none",
                      background: theme.accentSoft,
                      color: theme.accent,
                      borderRadius: "12px",
                      padding: "8px 12px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 700,
                      fontFamily: "'Cairo', sans-serif",
                      marginBottom: "18px",
                    }}
                  >
                    <ArrowLeft size={16} />
                    Volver al inicio
                  </button>
                  <h2
                    style={{
                      fontSize: "28px",
                      fontWeight: 800,
                      color: theme.textPrimary,
                      marginBottom: "6px",
                      lineHeight: 1.15,
                    }}
                  >
                    Crear cuenta
                  </h2>
                  <p
                    style={{
                      fontSize: "14px",
                      color: theme.textMuted,
                    }}
                  >
                    Completa los datos para preparar el alta del usuario.
                  </p>
                </div>
              )}

              {/* Header */}
              <div
                style={{
                  display: authView === "register" ? "none" : "block",
                  animation:
                    "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) 0.15s both",
                  marginBottom: "28px",
                }}
              >
                <h2
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    color: theme.textPrimary,
                    marginBottom: "6px",
                    lineHeight: 1.2,
                  }}
                >
                  Iniciar Sesión
                </h2>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.textMuted,
                  }}
                >
                  Ingresa tus credenciales para continuar
                </p>
              </div>

              {/* Form */}
              {authView === "login" && (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                noValidate
                style={{
                  animation:
                    "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) 0.25s both",
                }}
              >
                {/* API Error Message */}
                {apiError && (
                  <div
                    style={{
                      marginBottom: "20px",
                      background: theme.dangerSoft,
                      border: `1px solid ${theme.danger}`,
                      borderRadius: "12px",
                      padding: "14px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      animation: "fadeSlideUp 0.35s ease both",
                    }}
                  >
                    <AlertTriangle size={18} color={theme.danger} />
                    <span
                      style={{
                        fontSize: "13px",
                        color: theme.danger,
                        fontWeight: 500,
                      }}
                    >
                      {apiError}
                    </span>
                  </div>
                )}

                {/* Email Field */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="login-email"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.textSecondary,
                      marginBottom: "8px",
                    }}
                  >
                    Correo electrónico
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail
                      size={18}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: emailError ? theme.danger : theme.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                    <input
                      id="login-email"
                      type="email"
                      autoComplete="username"
                      placeholder="usuario@boticacontrol.pe"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 14px 14px 42px",
                        borderRadius: "14px",
                        fontSize: "15px",
                        color: theme.textPrimary,
                        background: theme.innerBg,
                        border: `1.5px solid ${emailError ? theme.danger : "transparent"}`,
                        outline: "none",
                        transition:
                          "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                        boxShadow: emailError
                          ? `0 0 0 3px ${theme.dangerSoft}`
                          : "none",
                        fontFamily: "'Cairo', sans-serif",
                      }}
                      onFocus={(e) => {
                        if (!emailError) {
                          e.currentTarget.style.borderColor = theme.accent;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentSoft}`;
                          e.currentTarget.style.background = theme.cardBg;
                        }
                      }}
                      onBlur={(e) => {
                        if (!emailError) {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = theme.innerBg;
                        }
                      }}
                    />
                  </div>
                  {emailError && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: theme.danger,
                        marginTop: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <AlertTriangle size={14} />
                      {emailError}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    htmlFor="login-password"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.textSecondary,
                      marginBottom: "8px",
                    }}
                  >
                    Contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={18}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: passwordError ? theme.danger : theme.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) setPasswordError("");
                      }}
                      style={{
                        width: "100%",
                        padding: "14px 44px 14px 42px",
                        borderRadius: "14px",
                        fontSize: "15px",
                        color: theme.textPrimary,
                        background: theme.innerBg,
                        border: `1.5px solid ${passwordError ? theme.danger : "transparent"}`,
                        outline: "none",
                        transition:
                          "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                        boxShadow: passwordError
                          ? `0 0 0 3px ${theme.dangerSoft}`
                          : "none",
                        fontFamily: "'Cairo', sans-serif",
                      }}
                      onFocus={(e) => {
                        if (!passwordError) {
                          e.currentTarget.style.borderColor = theme.accent;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentSoft}`;
                          e.currentTarget.style.background = theme.cardBg;
                        }
                      }}
                      onBlur={(e) => {
                        if (!passwordError) {
                          e.currentTarget.style.borderColor = "transparent";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.background = theme.innerBg;
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword
                          ? "Ocultar contraseña"
                          : "Mostrar contraseña"
                      }
                      style={{
                        position: "absolute",
                        right: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: theme.textMuted,
                        padding: "4px",
                        display: "flex",
                        alignItems: "center",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          theme.textPrimary;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.color =
                          theme.textMuted;
                      }}
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                  {passwordError && (
                    <p
                      style={{
                        fontSize: "13px",
                        color: theme.danger,
                        marginTop: "8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <AlertTriangle size={14} />
                      {passwordError}
                    </p>
                  )}
                </div>

                {/* Remember / Forgot */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "24px 0 32px",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => setRemember(!remember)}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "6px",
                        border: `1.5px solid ${remember ? theme.accent : theme.border}`,
                        background: remember
                          ? theme.accent
                          : theme.innerBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                        flexShrink: 0,
                      }}
                    >
                      {remember && (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      )}
                    </div>
                    <span style={{ fontSize: "14px", color: theme.textSecondary, fontWeight: 500 }}>
                      Recordarme
                    </span>
                  </label>
                  <a
                    href="#"
                    style={{
                      fontSize: "14px",
                      color: theme.accent,
                      textDecoration: "none",
                      fontWeight: 600,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        theme.accentHover;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color =
                        theme.accent;
                    }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="login-submit"
                  disabled={status === "loading" || status === "success"}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Cairo', sans-serif",
                    cursor:
                      status === "loading" || status === "success"
                        ? "not-allowed"
                        : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition:
                      "transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease, opacity 0.18s ease, background 0.3s ease",
                    background:
                      status === "success"
                        ? theme.success
                        : theme.accent,
                    color: "#ffffff",
                    boxShadow:
                      status === "success"
                        ? "0 8px 24px -6px rgba(16, 185, 129, 0.5)"
                        : `0 8px 24px -6px ${theme.accentGlow}`,
                    opacity:
                      status === "loading" ? 0.85 : 1,
                    transform:
                      status === "loading"
                        ? "scale(0.99)"
                        : "translateY(0)",
                  }}
                  onMouseEnter={(e) => {
                    if (status === "idle") {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        `0 12px 32px -8px ${theme.accentGlow}`;
                      (e.currentTarget as HTMLElement).style.background =
                        theme.accentHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status === "idle") {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow =
                        `0 8px 24px -6px ${theme.accentGlow}`;
                      (e.currentTarget as HTMLElement).style.background =
                        theme.accent;
                    }
                  }}
                  onMouseDown={(e) => {
                    if (status === "idle") {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(0) scale(0.98)";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (status === "idle") {
                      (e.currentTarget as HTMLElement).style.transform =
                        "translateY(-2px)";
                    }
                  }}
                >
                  {status === "loading" && (
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        border: `2.5px solid rgba(255,255,255,0.3)`,
                        borderTopColor: "#ffffff",
                        borderRadius: "50%",
                        animation: "spinLoader 0.7s linear infinite",
                        flexShrink: 0,
                      }}
                    />
                  )}
                  {status === "success" && (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: "successPop 0.35s ease" }}
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                  <span>
                    {status === "idle" && "Ingresar"}
                    {status === "loading" && "Verificando…"}
                    {status === "success" && "Acceso concedido"}
                  </span>
                  {status === "idle" && <ChevronRight size={18} />}
                </button>
              </form>
              )}

              {authView === "register" && (
                <form
                  onSubmit={handleRegisterSubmit}
                  noValidate
                  style={{
                    animation:
                      "fadeSlideUp 0.5s cubic-bezier(.22,1,.36,1) 0.25s both",
                  }}
                >
                  <div className="register-grid">
                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-email" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Email *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="off"
                          placeholder="usuario@botica.com"
                          value={registerForm.email}
                          onChange={(e) => updateRegisterField("email", e.target.value)}
                          style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-role" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Rol *
                      </label>
                      <div style={{ position: "relative" }}>
                        <BriefcaseBusiness size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <select
                          id="register-role"
                          value={registerForm.role}
                          onChange={(e) => updateRegisterField("role", e.target.value)}
                          style={{ width: "100%", padding: "14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif", appearance: "none", cursor: "pointer" }}
                        >
                          <option>Administrador</option>
                          <option>Vendedor</option>
                          <option>Farmaceutico</option>
                        </select>
                        <ChevronRight size={18} style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%) rotate(90deg)", color: theme.textMuted, pointerEvents: "none" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-password" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Contraseña *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input
                          id="register-password"
                          type={showRegisterPassword ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Min. 8 caracteres"
                          value={registerForm.password}
                          onChange={(e) => updateRegisterField("password", e.target.value)}
                          style={{ width: "100%", padding: "14px 44px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }}
                        />
                        <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} aria-label="Mostrar u ocultar contraseña" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: "4px", display: "flex" }}>
                          {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-confirm-password" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Confirmar Contraseña *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input
                          id="register-confirm-password"
                          type={showRegisterConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="Repite la contraseña"
                          value={registerForm.confirmPassword}
                          onChange={(e) => updateRegisterField("confirmPassword", e.target.value)}
                          style={{ width: "100%", padding: "14px 44px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }}
                        />
                        <button type="button" onClick={() => setShowRegisterConfirm(!showRegisterConfirm)} aria-label="Mostrar u ocultar confirmacion" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: theme.textMuted, padding: "4px", display: "flex" }}>
                          {showRegisterConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-dni" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        DNI *
                      </label>
                      <div style={{ position: "relative" }}>
                        <IdCard size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input id="register-dni" inputMode="numeric" placeholder="12345678" value={registerForm.dni} onChange={(e) => updateRegisterField("dni", e.target.value)} style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-username" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Nombre de Usuario *
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input id="register-username" placeholder="admin.jperez" value={registerForm.username} onChange={(e) => updateRegisterField("username", e.target.value)} style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }} />
                      </div>
                    </div>
                  </div>

                  <div className="register-grid">
                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-full-name" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Nombre Completo *
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input id="register-full-name" placeholder="Juan Perez Gomez" value={registerForm.fullName} onChange={(e) => updateRegisterField("fullName", e.target.value)} style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }} />
                      </div>
                    </div>

                    <div style={{ marginBottom: "18px" }}>
                      <label htmlFor="register-phone" style={{ display: "block", fontSize: "13px", fontWeight: 600, color: theme.textSecondary, marginBottom: "8px" }}>
                        Telefono <span style={{ color: theme.textMuted, fontWeight: 500 }}>(Opcional)</span>
                      </label>
                      <div style={{ position: "relative" }}>
                        <Phone size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: theme.textMuted }} />
                        <input id="register-phone" inputMode="tel" placeholder="987654321" value={registerForm.phone} onChange={(e) => updateRegisterField("phone", e.target.value)} style={{ width: "100%", padding: "14px 14px 14px 42px", borderRadius: "14px", fontSize: "15px", color: theme.textPrimary, background: theme.innerBg, border: `1.5px solid ${theme.border}`, outline: "none", fontFamily: "'Cairo', sans-serif" }} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "16px",
                      borderRadius: "14px",
                      border: "none",
                      fontSize: "15px",
                      fontWeight: 700,
                      fontFamily: "'Cairo', sans-serif",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      background: theme.accent,
                      color: "#ffffff",
                      boxShadow: `0 8px 24px -6px ${theme.accentGlow}`,
                    }}
                  >
                    <UserPlus size={18} />
                    Crear cuenta
                  </button>
                </form>
              )}

              {/* Toast Area */}
              {status === "success" && (
                <div
                  style={{
                    marginTop: "20px",
                    background: theme.innerBg,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "12px",
                    padding: "14px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    animation: "fadeSlideUp 0.35s ease both",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: theme.accent,
                      boxShadow: `0 0 0 0 ${theme.accentGlow}`,
                      animation: "securePulse 2s infinite",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: theme.textSecondary,
                    }}
                  >
                    Redirigiendo al panel de control...
                  </span>
                </div>
              )}

              {/* Auth switch */}
              <div
                style={{
                  textAlign: "center",
                  fontSize: "12px",
                  lineHeight: 1.6,
                  marginTop: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: theme.textMuted,
                }}
              >
                <UserPlus
                  size={14}
                  style={{ flexShrink: 0, color: theme.textMuted }}
                />
                <span>
                  {authView === "register"
                    ? "¿Ya tienes cuenta?"
                    : "¿No tienes cuenta?"}
                </span>
                <button
                  type="button"
                  onClick={() => setAuthView(authView === "register" ? "login" : "register")}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: theme.accent,
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 800,
                    fontFamily: "'Cairo', sans-serif",
                    padding: 0,
                  }}
                >
                  {authView === "register" ? "Iniciar sesión" : "Registrarse"}
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* ─── Responsive Styles ─────────────────────────────────────────── */}
      <style>{`
        .login-brand-panel {
          display: flex !important;
        }
        .login-mobile-brand {
          display: none !important;
        }
        .register-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 0 18px;
        }
        
        @media (max-width: 1023px) {
          .login-brand-panel {
            display: none !important;
          }
          .login-mobile-brand {
            display: flex !important;
          }
          .login-form-panel {
            padding-top: 80px !important;
          }
          .register-grid {
            grid-template-columns: 1fr;
            gap: 0;
          }
        }

        @media (max-width: 480px) {
          .login-form-panel {
            padding-left: 16px !important;
            padding-right: 16px !important;
          }
          .login-form-panel > div > div {
            padding: 32px 20px !important;
          }
        }
      `}</style>
    </>
  );
}
