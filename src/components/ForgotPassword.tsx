import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Package,
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

interface ForgotPasswordProps {
  onBack: () => void;
}

export default function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [shake, setShake] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setEmailError("Ingresa un correo electrónico válido");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }

    setStatus("loading");
    setEmailError("");

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setStatus("success");
        setSuccessMessage(response.message);
      }
    } catch (error: any) {
      setStatus("error");
      const errorMessage = error.response?.data?.message || "Error al enviar el correo. Intenta nuevamente.";
      setEmailError(errorMessage);
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
            maxWidth: "420px",
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
            {/* Back Button */}
            <div style={{ marginBottom: "24px" }}>
              <button
                type="button"
                onClick={onBack}
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
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = theme.accent;
                  (e.currentTarget as HTMLElement).style.color = "#ffffff";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = theme.accentSoft;
                  (e.currentTarget as HTMLElement).style.color = theme.accent;
                }}
              >
                <ArrowLeft size={16} />
                Volver al inicio
              </button>
            </div>

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
                ¿Olvidaste tu contraseña?
              </h2>
              <p
                style={{
                  fontSize: "14px",
                  color: theme.textMuted,
                  lineHeight: 1.5,
                }}
              >
                Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
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
                  Correo enviado
                </h3>
                <p
                  style={{
                    fontSize: "14px",
                    color: theme.textSecondary,
                    lineHeight: 1.6,
                  }}
                >
                  {successMessage}
                </p>
                <button
                  onClick={onBack}
                  style={{
                    marginTop: "20px",
                    width: "100%",
                    padding: "12px",
                    borderRadius: "12px",
                    border: "none",
                    background: theme.accent,
                    color: "#ffffff",
                    fontSize: "14px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = theme.accentHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = theme.accent;
                  }}
                >
                  Volver al inicio de sesión
                </button>
              </motion.div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} noValidate>
                {/* Error Message */}
                {emailError && (
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
                      {emailError}
                    </span>
                  </div>
                )}

                {/* Email Field */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    htmlFor="forgot-email"
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
                      id="forgot-email"
                      type="email"
                      autoComplete="email"
                      placeholder="usuario@boticacontrol.pe"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      disabled={status === "loading"}
                      style={{
                        width: "100%",
                        padding: "14px 14px 14px 42px",
                        borderRadius: "14px",
                        fontSize: "15px",
                        color: theme.textPrimary,
                        background: theme.innerBg,
                        border: `1.5px solid ${emailError ? theme.danger : "transparent"}`,
                        outline: "none",
                        transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                        boxShadow: emailError ? `0 0 0 3px ${theme.dangerSoft}` : "none",
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
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  style={{
                    width: "100%",
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: 700,
                    fontFamily: "'Cairo', sans-serif",
                    cursor: status === "loading" ? "not-allowed" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                    transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, background 0.3s ease",
                    background: theme.accent,
                    color: "#ffffff",
                    boxShadow: `0 8px 24px -6px ${theme.accentGlow}`,
                    opacity: status === "loading" ? 0.85 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (status === "idle") {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px -8px ${theme.accentGlow}`;
                      (e.currentTarget as HTMLElement).style.background = theme.accentHover;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (status === "idle") {
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
                    {status === "idle" && "Enviar enlace"}
                    {status === "loading" && "Enviando..."}
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
