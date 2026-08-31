import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Package,
  Check,
  X,
} from "lucide-react";
import authService from "../services/authService";

/* ─── Premium Light Theme ─────────────────────────── */
const theme = {
  mainBg: "#f4f7fb",
  cardBg: "#ffffff",
  innerBg: "#f8fafc",
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
  successSoft: "rgba(16, 185, 129, 0.1)",
};

export default function ResetPassword() {
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Validaciones de contraseña
  const [validations, setValidations] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasDigit: false,
    hasSpecialChar: false,
  });

  useEffect(() => {
    // Extraer el token del hash de la URL (Supabase lo envía en el hash)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("access_token");
    
    if (token) {
      setAccessToken(token);
    } else {
      setErrorMessage("Enlace inválido o expirado");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    // Validar contraseña en tiempo real
    setValidations({
      minLength: newPassword.length >= 8,
      hasLowercase: /[a-z]/.test(newPassword),
      hasUppercase: /[A-Z]/.test(newPassword),
      hasDigit: /\d/.test(newPassword),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(newPassword),
    });
  }, [newPassword]);

  const isPasswordValid = 
    validations.minLength &&
    validations.hasLowercase &&
    validations.hasUppercase &&
    validations.hasDigit &&
    validations.hasSpecialChar;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!isPasswordValid) {
      setErrorMessage("La contraseña no cumple con los requisitos");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    if (!accessToken) {
      setErrorMessage("Token de acceso no válido");
      return;
    }

    setStatus("loading");

    try {
      const response = await authService.resetPassword(accessToken, newPassword);
      
      if (response.success) {
        setStatus("success");
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMsg = error.response?.data?.message || "Error al restablecer la contraseña. Intenta nuevamente.";
      setErrorMessage(errorMsg);
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setStatus("idle");
      }, 400);
    }
  };

  return (
    <>
      <style>{`
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
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Cairo', sans-serif",
          background: theme.mainBg,
          padding: "40px 24px",
        }}
      >
        {/* Mobile brand bar */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            display: "flex",
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

        {/* Form Card */}
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            style={{
              background: theme.cardBg,
              border: `1px solid ${theme.borderCard}`,
              borderRadius: "24px",
              padding: "40px 32px",
              position: "relative",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.08)",
              animation: shake
                ? "shakeX 0.38s ease"
                : "cardReveal 0.65s cubic-bezier(.22,1,.36,1) both",
            }}
          >
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
              <h2
                style={{
                  fontSize: "26px",
                  fontWeight: 700,
                  color: theme.textPrimary,
                  marginBottom: "6px",
                  lineHeight: 1.2,
                }}
              >
                Restablecer contraseña
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.textMuted,
                  lineHeight: 1.5,
                }}
              >
                Ingresa tu nueva contraseña. Asegúrate de que cumpla con todos los requisitos de seguridad (incluyendo un carácter especial).
              </p>
            </div>

            {status === "success" ? (
              /* Success Message */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: theme.successSoft,
                  border: `1px solid ${theme.success}`,
                  borderRadius: "16px",
                  padding: "24px",
                  textAlign: "center",
                }}
              >
                <CheckCircle
                  size={48}
                  color={theme.success}
                  style={{
                    margin: "0 auto 16px",
                    animation: "successPop 0.5s ease",
                  }}
                />
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: theme.textPrimary,
                    marginBottom: "8px",
                  }}
                >
                  ¡Contraseña actualizada!
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.textSecondary,
                    lineHeight: 1.6,
                  }}
                >
                  Tu contraseña ha sido restablecida exitosamente. Serás redirigido al inicio de sesión...
                </p>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate>
                {/* Error Message */}
                {errorMessage && (
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
                      {errorMessage}
                    </span>
                  </div>
                )}

                {/* New Password Field */}
                <div style={{ marginBottom: "20px" }}>
                  <label
                    htmlFor="new-password"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.textSecondary,
                      marginBottom: "8px",
                    }}
                  >
                    Nueva contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={18}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: theme.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                    <input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={status === "loading" || !accessToken}
                      style={{
                        width: "100%",
                        padding: "14px 44px 14px 42px",
                        borderRadius: "14px",
                        fontSize: "15px",
                        color: theme.textPrimary,
                        background: theme.innerBg,
                        border: `1.5px solid transparent`,
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                        fontFamily: "'Cairo', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.accent;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentSoft}`;
                        e.currentTarget.style.background = theme.cardBg;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = theme.innerBg;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label="Mostrar u ocultar contraseña"
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
                        transition: "color 0.2s",
                      }}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                {newPassword && (
                  <div
                    style={{
                      marginBottom: "20px",
                      background: theme.innerBg,
                      borderRadius: "12px",
                      padding: "16px",
                      border: `1px solid ${theme.border}`,
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        fontWeight: 600,
                        color: theme.textSecondary,
                        marginBottom: "10px",
                      }}
                    >
                      Requisitos de contraseña:
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <ValidationItem
                        text="Mínimo 8 caracteres"
                        isValid={validations.minLength}
                      />
                      <ValidationItem
                        text="Al menos una letra minúscula"
                        isValid={validations.hasLowercase}
                      />
                      <ValidationItem
                        text="Al menos una letra mayúscula"
                        isValid={validations.hasUppercase}
                      />
                      <ValidationItem
                        text="Al menos un dígito"
                        isValid={validations.hasDigit}
                      />
                      <ValidationItem
                        text="Al menos un carácter especial (!@#$%...)"
                        isValid={validations.hasSpecialChar}
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    htmlFor="confirm-password"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: theme.textSecondary,
                      marginBottom: "8px",
                    }}
                  >
                    Confirmar contraseña
                  </label>
                  <div style={{ position: "relative" }}>
                    <Lock
                      size={18}
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: theme.textMuted,
                        transition: "color 0.2s",
                      }}
                    />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={status === "loading" || !accessToken}
                      style={{
                        width: "100%",
                        padding: "14px 44px 14px 42px",
                        borderRadius: "14px",
                        fontSize: "15px",
                        color: theme.textPrimary,
                        background: theme.innerBg,
                        border: `1.5px solid transparent`,
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                        fontFamily: "'Cairo', sans-serif",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = theme.accent;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${theme.accentSoft}`;
                        e.currentTarget.style.background = theme.cardBg;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.background = theme.innerBg;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label="Mostrar u ocultar confirmación"
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
                        transition: "color 0.2s",
                      }}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading" || !accessToken || !isPasswordValid}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Cairo', sans-serif",
                    cursor: status === "loading" || !accessToken || !isPasswordValid ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, background 0.3s ease",
                    background: theme.accent,
                    color: "#ffffff",
                    boxShadow: `0 8px 24px -6px ${theme.accentGlow}`,
                    opacity: status === "loading" || !accessToken || !isPasswordValid ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (status === "idle" && accessToken && isPasswordValid) {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px -8px ${theme.accentGlow}`;
                      (e.currentTarget as HTMLElement).style.background = theme.accentHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status === "idle" && accessToken && isPasswordValid) {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px -6px ${theme.accentGlow}`;
                      (e.currentTarget as HTMLElement).style.background = theme.accent;
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
                  <span>
                    {status === "idle" && "Restablecer contraseña"}
                    {status === "loading" && "Actualizando..."}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Validation Item Component
function ValidationItem({ text, isValid }: { text: string; isValid: boolean }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "13px",
        color: isValid ? theme.success : theme.textMuted,
        transition: "color 0.2s",
      }}
    >
      {isValid ? (
        <Check size={16} strokeWidth={2.5} />
      ) : (
        <X size={16} strokeWidth={2.5} />
      )}
      <span>{text}</span>
    </div>
  );
}
