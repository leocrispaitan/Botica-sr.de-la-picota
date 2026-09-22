import { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Sparkles, RotateCcw, Copy, Check, ChevronDown } from "lucide-react";
import { getLiveBusinessContext } from "../../services/aiContextService";

/* ─── Tipos ─────────────────────────────────────────────────────────── */
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface GeminiAIAssistantProps {
  isDark: boolean;
  activeMenu?: string;
}

/* ─── Configuración Gemini ──────────────────────────────────────────── */
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent";

/* ─── Contexto del sistema para la botica ──────────────────────────── */
const SYSTEM_CONTEXT = `Eres un asistente inteligente especializado en análisis de datos para "Botica" — un sistema de gestión farmacéutica en Perú.

Tu rol es ayudar al administrador a:
- Analizar ventas, inventario y movimientos de productos con cifras y métricas reales
- Responder con datos exactos: días de mayor y menor venta, totales recaudados, ticket promedio, unidades vendidas
- Alertar sobre productos en stock crítico o agotados y lotes próximos a vencer
- Dar recomendaciones comerciales estratégicas y resúmenes ejecutivos claros

REGLAS DE RESPUESTA OBLIGATORIAS:
- Dispones de un bloque de [REGISTROS Y DATOS REALES DE LA BOTICA] extraídos directamente de la base de datos del sistema.
- Cuando el usuario pregunte por cifras, ventas, el mejor o peor día, productos más vendidos, stock crítico o lotes, DEBES responder con los números, fechas, nombres y montos reales presentes en esos datos.
- NUNCA le pidas al usuario que te pase los datos si ya figuran en tu contexto de negocio.
- Usa formato ordenado: bullet points, negritas para cifras y fechas, y emojis descriptivos.
- Moneda: Soles peruanos (S/)
- Si te piden un resumen en 3 viñetas, proporciona exactamente 3 puntos concisos de alto impacto con datos reales.
- Idioma: Español (Perú)
- Máximo 3-4 párrafos por respuesta salvo que se pida un análisis extenso.`;

/* ─── Preguntas sugeridas por sección ──────────────────────────────── */
const SUGGESTIONS: Record<string, string[]> = {
  ReportesVentas: [
    "¿Cuál fue el día con más ventas este mes?",
    "Dame un resumen en 3 viñetas de las categorías más rentables",
    "¿Qué productos tienen menor rotación de inventario?",
  ],
  ReportesInventario: [
    "¿Qué productos están próximos a vencerse?",
    "¿Cuáles son los artículos con stock crítico?",
    "¿Cuál es el valor total del inventario actual?",
  ],
  ReportesMovimientos: [
    "¿Cuál fue el día con menor rotación de inventario el mes pasado?",
    "¿Qué movimientos generaron más ingresos?",
    "Analiza el comportamiento de compras vs ventas",
  ],
  default: [
    "¿Cuáles son las categorías que dejan más ganancias?",
    "Dame un resumen ejecutivo del negocio esta semana",
    "¿Qué proveedores tienen mejor relación precio-calidad?",
    "¿Cómo mejorar el control de stock crítico?",
  ],
};

/* ─── Utilidades ────────────────────────────────────────────────────── */
function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}

/* ─── Componente de burbuja de mensaje ──────────────────────────────── */
function MessageBubble({ message, isDark }: { message: Message; isDark: boolean }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i} style={{ fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.match(/^[-•*]\s/)) {
        const content = line.replace(/^[-•*]\s/, "");
        return (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            <span style={{ color: "#5bcfc5", flexShrink: 0, marginTop: "2px" }}>▸</span>
            <span>{renderInline(content)}</span>
          </div>
        );
      }
      if (line.match(/^\d+\.\s/)) {
        const num = line.match(/^(\d+)\.\s/)?.[1];
        const content = line.replace(/^\d+\.\s/, "");
        return (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            <span style={{ color: "#5bcfc5", flexShrink: 0, fontWeight: 700, minWidth: "20px" }}>{num}.</span>
            <span>{renderInline(content)}</span>
          </div>
        );
      }
      if (line.match(/^#{1,3}\s/)) {
        const content = line.replace(/^#{1,3}\s/, "");
        return (
          <div key={i} style={{ fontWeight: 700, fontSize: "14px", color: isUser ? "rgba(255,255,255,0.95)" : isDark ? "#ffffff" : "#3d4465", marginBottom: "6px", marginTop: i > 0 ? "10px" : "0" }}>
            {renderInline(content)}
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} style={{ height: "6px" }} />;
      return <div key={i} style={{ marginBottom: "2px" }}>{renderInline(line)}</div>;
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", gap: "10px", alignItems: "flex-start", animation: "messageFadeIn 0.3s ease both" }}>
      {!isUser && (
        <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 50%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 12px rgba(91,207,197,0.3)" }}>
          <Sparkles size={16} color="#fff" />
        </div>
      )}
      <div style={{ maxWidth: "85%", display: "flex", flexDirection: "column", gap: "4px" }}>
        <div style={{ padding: "12px 16px", borderRadius: isUser ? "18px 18px 6px 18px" : "18px 18px 18px 6px", background: isUser ? "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 60%, #8b5cf6 100%)" : isDark ? "rgba(33,33,48,0.9)" : "rgba(255,255,255,0.95)", border: isUser ? "none" : `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.8)"}`, color: isUser ? "#ffffff" : isDark ? "#e2e8f0" : "#3d4465", fontSize: "13.5px", lineHeight: "1.6", boxShadow: isUser ? "0 4px 16px rgba(91,207,197,0.2)" : isDark ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.06)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          {message.isStreaming ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span>Analizando</span>
              <span style={{ display: "flex", gap: "3px" }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#5bcfc5", animation: `dotBounce 1.2s ease-in-out ${i * 0.2}s infinite`, display: "inline-block" }} />
                ))}
              </span>
            </div>
          ) : (
            renderContent(message.content)
          )}
        </div>
        {!message.isStreaming && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: isUser ? "flex-end" : "flex-start", paddingInline: "4px" }}>
            <span style={{ fontSize: "10px", color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)" }}>{formatTime(message.timestamp)}</span>
            {!isUser && (
              <button onClick={handleCopy} title="Copiar" style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: copied ? "#5bcfc5" : isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.35)", transition: "color 0.2s ease", display: "flex", alignItems: "center" }}>
                {copied ? <Check size={11} /> : <Copy size={11} />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Componente Principal ──────────────────────────────────────────── */
export default function GeminiAIAssistant({ isDark, activeMenu = "Dashboard" }: GeminiAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasSentFirstMessage = messages.some((m) => m.role === "user");
  const suggestions = SUGGESTIONS[activeMenu as keyof typeof SUGGESTIONS] || SUGGESTIONS.default;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom();
  }, [messages, isOpen, isMinimized, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, isMinimized]);

  useEffect(() => {
    const t = setTimeout(() => setPulseActive(false), 5000);
    return () => clearTimeout(t);
  }, []);

  const callGemini = async (userMessage: string): Promise<string> => {
    // 1. Obtener registros y métricas reales de la base de datos (ventas, serie diaria, stock, etc.)
    const businessData = await getLiveBusinessContext();

    const history = messages
      .filter((m) => !m.isStreaming)
      .map((m) => ({ role: m.role === "user" ? "user" : "model", parts: [{ text: m.content }] }));

    const activeApiKey = import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY;

    if (!activeApiKey) {
      throw new Error(
        "Falta configurar la variable VITE_GEMINI_API_KEY en Vercel. Ve a Settings > Environment Variables, agrégala y haz un Redeploy del proyecto."
      );
    }

    const response = await fetch(`${GEMINI_API_URL}?key=${activeApiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: `${SYSTEM_CONTEXT}\n\n${businessData}` }] },
          ...history,
          { role: "user", parts: [{ text: `[Sección activa del panel: ${activeMenu}]\n\n${userMessage}` }] },
        ],
        generationConfig: { temperature: 0.3, topK: 40, topP: 0.95, maxOutputTokens: 1200 },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as { error?: { message?: string } })?.error?.message || `Error ${response.status}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error("Respuesta vacía de la IA");
    return text;
  };

  const handleSend = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;
    setInput("");
    setIsLoading(true);
    const userMsg: Message = { id: generateId(), role: "user", content: messageText, timestamp: new Date() };
    const loadingMsg: Message = { id: generateId(), role: "assistant", content: "", timestamp: new Date(), isStreaming: true };
    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    try {
      const reply = await callGemini(messageText);
      setMessages((prev) => prev.map((m) => m.isStreaming ? { ...m, content: reply, isStreaming: false, timestamp: new Date() } : m));
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error al conectar con Gemini AI";
      setMessages((prev) => prev.map((m) => m.isStreaming ? { ...m, content: `⚠️ **Error:** ${errorMsg}\n\nVerifica tu API key de Gemini en las variables de entorno (VITE_GEMINI_API_KEY).`, isStreaming: false, timestamp: new Date() } : m));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const t = {
    textPrimary: isDark ? "#ffffff" : "#3d4465",
    textSecondary: isDark ? "#828690" : "#787f9e",
    inputBg: isDark ? "#1e1d29" : "#f5f6fa",
    border: isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.9)",
  };

  const keyframes = `
    @keyframes messageFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; } 40% { transform: scale(1.2); opacity: 1; } }
    @keyframes aiButtonPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(91,207,197,0.5), 0 8px 32px rgba(91,207,197,0.3); } 50% { box-shadow: 0 0 0 14px rgba(91,207,197,0), 0 8px 32px rgba(91,207,197,0.4); } }
    @keyframes aiGradientShift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
    @keyframes modalSlideUp { from { opacity: 0; transform: translateY(20px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes shimmerLine { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
    @keyframes sparkleRotate { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.1) rotate(15deg); } }
  `;

  return (
    <>
      <style>{keyframes}</style>

      {/* ═══ Botón Flotante ═══ */}
      <button
        id="ai-assistant-btn"
        onClick={() => { setIsOpen(true); setIsMinimized(false); setPulseActive(false); }}
        title="Asistente IA Gemini"
        style={{
          position: "fixed", bottom: "28px", right: "28px",
          width: "62px", height: "62px", borderRadius: "20px",
          border: "none", cursor: "pointer", zIndex: 9990,
          display: isOpen ? "none" : "flex", alignItems: "center", justifyContent: "center",
          background: "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 50%, #8b5cf6 100%)",
          backgroundSize: "200% 200%",
          animation: pulseActive
            ? "aiButtonPulse 2s ease infinite, aiGradientShift 4s ease infinite"
            : "aiGradientShift 4s ease infinite",
          boxShadow: "0 8px 32px rgba(91,207,197,0.3), 0 4px 16px rgba(0,0,0,0.2)",
          transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.1) translateY(-2px)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1) translateY(0)"; }}
      >
        {/* Icono IA SVG personalizado */}
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="14" cy="14" r="7" stroke="white" strokeWidth="1.5" fill="rgba(255,255,255,0.15)" />
          <circle cx="14" cy="5" r="2" fill="white" opacity="0.9" />
          <circle cx="23" cy="14" r="1.5" fill="white" opacity="0.7" />
          <circle cx="5" cy="14" r="1.5" fill="white" opacity="0.7" />
          <circle cx="14" cy="23" r="2" fill="white" opacity="0.9" />
          <path d="M14 10.5L15.2 13.5H18L15.6 15.3L16.4 18L14 16.4L11.6 18L12.4 15.3L10 13.5H12.8L14 10.5Z" fill="white" />
          <line x1="14" y1="7" x2="14" y2="10.5" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="21" y1="14" x2="17.5" y2="14" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="7" y1="14" x2="10.5" y2="14" stroke="white" strokeWidth="1" opacity="0.5" />
          <line x1="14" y1="21" x2="14" y2="17.5" stroke="white" strokeWidth="1" opacity="0.5" />
        </svg>
        {/* Badge IA */}
        <span style={{ position: "absolute", top: "-4px", right: "-4px", background: "linear-gradient(135deg, #f59e0b, #ef4444)", color: "#fff", fontSize: "8px", fontWeight: 800, letterSpacing: "0.05em", padding: "2px 5px", borderRadius: "6px", border: `2px solid ${isDark ? "#171622" : "#f0f2f8"}`, lineHeight: 1 }}>
          IA
        </span>
      </button>

      {/* ═══ Modal del Asistente ═══ */}
      {isOpen && (
        <div style={{ position: "fixed", bottom: "28px", right: "28px", width: "420px", maxWidth: "calc(100vw - 40px)", height: isMinimized ? "60px" : "600px", maxHeight: "calc(100vh - 60px)", zIndex: 9991, borderRadius: "24px", display: "flex", flexDirection: "column", overflow: "hidden", background: isDark ? "linear-gradient(145deg, rgba(23,22,34,0.97), rgba(21,20,31,0.97))" : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,249,252,0.98))", border: `1px solid ${isDark ? "rgba(91,207,197,0.15)" : "rgba(91,207,197,0.2)"}`, boxShadow: isDark ? "0 32px 80px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(91,207,197,0.1), inset 0 1px 0 rgba(255,255,255,0.04)" : "0 32px 80px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(91,207,197,0.15), inset 0 1px 0 rgba(255,255,255,0.9)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)", animation: "modalSlideUp 0.35s cubic-bezier(0.22,1,0.36,1) both", transition: "height 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>

          {/* ── Header ── */}
          <div
            onClick={() => isMinimized && setIsMinimized(false)}
            style={{ padding: "16px 18px", borderBottom: isMinimized ? "none" : `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`, display: "flex", alignItems: "center", gap: "12px", background: isDark ? "linear-gradient(90deg, rgba(91,207,197,0.06) 0%, rgba(59,130,246,0.04) 50%, rgba(139,92,246,0.06) 100%)" : "linear-gradient(90deg, rgba(91,207,197,0.08) 0%, rgba(59,130,246,0.05) 50%, rgba(139,92,246,0.08) 100%)", flexShrink: 0, cursor: isMinimized ? "pointer" : "default" }}
          >
            <div style={{ width: "38px", height: "38px", borderRadius: "12px", background: "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 50%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 4px 14px rgba(91,207,197,0.35)", animation: "sparkleRotate 3s ease-in-out infinite" }}>
              <Sparkles size={18} color="#fff" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "14px", fontWeight: 700, color: t.textPrimary, display: "flex", alignItems: "center", gap: "6px" }}>
                Gemini AI
                <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em", color: "#5bcfc5", textTransform: "uppercase" as const, padding: "2px 6px", border: "1px solid rgba(91,207,197,0.3)", borderRadius: "6px" }}>PRO</span>
              </div>
              <div style={{ fontSize: "11px", color: t.textSecondary, marginTop: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Asistente de análisis</span>
                <span style={{ fontSize: "10px", color: "#10b981", display: "inline-flex", alignItems: "center", gap: "3px", fontWeight: 600 }}>
                  <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#10b981", display: "inline-block", boxShadow: "0 0 6px #10b981" }} />
                  BD en vivo
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {!isMinimized && messages.length > 0 && (
                <button
                  onClick={() => {
                    setMessages([]);
                    getLiveBusinessContext(true);
                  }}
                  title="Limpiar y actualizar datos de BD"
                  style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, transition: "all 0.2s ease" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; }}>
                  <RotateCcw size={13} />
                </button>
              )}
              <button onClick={() => setIsMinimized(!isMinimized)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, transform: isMinimized ? "rotate(180deg)" : "rotate(0deg)", transition: "all 0.2s ease" }}>
                <ChevronDown size={15} />
              </button>
              <button onClick={() => setIsOpen(false)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: `1px solid ${t.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.textSecondary, transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#ef4444"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.textSecondary; (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                <X size={15} />
              </button>
            </div>
          </div>

          {/* ── Body (ocultado si minimizado) ── */}
          {!isMinimized && (
            <>
              {/* Área de mensajes */}
              <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: "14px", scrollbarWidth: "thin" as const, scrollbarColor: isDark ? "rgba(91,207,197,0.2) transparent" : "rgba(91,207,197,0.3) transparent" }}>
                {/* Bienvenida */}
                {!hasSentFirstMessage && (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, gap: "16px", padding: "16px 0" }}>
                    <div style={{ position: "relative", width: "80px", height: "80px" }}>
                      <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 50%, #8b5cf6 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 32px rgba(91,207,197,0.4)", animation: "sparkleRotate 3s ease-in-out infinite" }}>
                        <Sparkles size={36} color="#fff" />
                      </div>
                      {[{ top: "-8px", right: "-8px", size: "16px", delay: "0s" }, { top: "-4px", left: "-12px", size: "10px", delay: "0.5s" }, { bottom: "-6px", right: "-6px", size: "12px", delay: "1s" }].map((p, i) => (
                        <div key={i} style={{ position: "absolute", top: p.top, right: p.right, left: p.left, bottom: p.bottom, width: p.size, height: p.size, borderRadius: "50%", background: "linear-gradient(135deg, #5bcfc5, #3b82f6)", opacity: 0.6, animation: `dotBounce 2s ease-in-out ${p.delay} infinite` }} />
                      ))}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <h3 style={{ fontSize: "17px", fontWeight: 700, color: t.textPrimary, marginBottom: "6px" }}>¡Hola! Soy tu Asistente IA</h3>
                      <p style={{ fontSize: "12.5px", color: t.textSecondary, lineHeight: 1.6, maxWidth: "280px" }}>
                        Pregúntame sobre ventas, inventario, reportes o pide un análisis de tus datos en lenguaje natural.
                      </p>
                    </div>
                    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: t.textSecondary, marginBottom: "2px" }}>
                        💡 Sugerencias para esta sección
                      </p>
                      {suggestions.map((s, i) => (
                        <button key={i} onClick={() => handleSend(s)} disabled={isLoading}
                          style={{ width: "100%", padding: "10px 14px", borderRadius: "12px", border: `1px solid ${isDark ? "rgba(91,207,197,0.15)" : "rgba(91,207,197,0.2)"}`, background: isDark ? "rgba(91,207,197,0.05)" : "rgba(91,207,197,0.04)", cursor: "pointer", textAlign: "left", fontSize: "12.5px", color: t.textPrimary, transition: "all 0.2s ease", fontFamily: "'Cairo', sans-serif" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(91,207,197,0.1)" : "rgba(91,207,197,0.08)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(91,207,197,0.05)" : "rgba(91,207,197,0.04)"; (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)"; }}>
                          <span style={{ marginRight: "8px", opacity: 0.7 }}>▸</span>{s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mensajes */}
                {messages.map((msg) => <MessageBubble key={msg.id} message={msg} isDark={isDark} />)}
                <div ref={messagesEndRef} />
              </div>

              {/* ── Input ── */}
              <div style={{ padding: "14px 16px", borderTop: `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`, background: isDark ? "rgba(23,22,34,0.5)" : "rgba(248,249,252,0.8)", flexShrink: 0 }}>
                {/* Sugerencias rápidas */}
                {hasSentFirstMessage && (
                  <div style={{ display: "flex", gap: "6px", marginBottom: "10px", overflowX: "auto", scrollbarWidth: "none" as const }}>
                    {suggestions.slice(0, 2).map((s, i) => (
                      <button key={i} onClick={() => handleSend(s)} disabled={isLoading}
                        style={{ flexShrink: 0, padding: "5px 10px", borderRadius: "20px", border: `1px solid ${isDark ? "rgba(91,207,197,0.2)" : "rgba(91,207,197,0.25)"}`, background: "transparent", cursor: "pointer", fontSize: "11px", color: "#5bcfc5", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s ease", whiteSpace: "nowrap" as const }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(91,207,197,0.1)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}>
                        {s.length > 35 ? s.substring(0, 33) + "..." : s}
                      </button>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", background: t.inputBg, borderRadius: "16px", border: `1px solid ${isDark ? "rgba(91,207,197,0.15)" : "rgba(91,207,197,0.2)"}`, padding: "10px 12px" }}>
                  <textarea
                    ref={inputRef} value={input} onChange={handleInputChange} onKeyDown={handleKeyDown}
                    placeholder="Pregunta sobre tus datos... (Enter para enviar)"
                    disabled={isLoading} rows={1}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", resize: "none", fontSize: "13px", color: t.textPrimary, fontFamily: "'Cairo', sans-serif", lineHeight: "1.5", maxHeight: "120px", overflowY: "auto", scrollbarWidth: "none" as const }}
                  />
                  <button onClick={() => handleSend()} disabled={isLoading || !input.trim()}
                    style={{ width: "34px", height: "34px", borderRadius: "10px", border: "none", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer", background: isLoading || !input.trim() ? (isDark ? "rgba(91,207,197,0.15)" : "rgba(91,207,197,0.1)") : "linear-gradient(135deg, #5bcfc5 0%, #3b82f6 100%)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s ease", boxShadow: !isLoading && input.trim() ? "0 4px 12px rgba(91,207,197,0.3)" : "none" }}
                    onMouseEnter={(e) => { if (!isLoading && input.trim()) (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}>
                    <Send size={14} color={isLoading || !input.trim() ? "#5bcfc5" : "#fff"} />
                  </button>
                </div>
                <p style={{ fontSize: "10px", color: isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.25)", textAlign: "center", marginTop: "8px" }}>
                  Powered by Google Gemini · Shift+Enter para nueva línea
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
