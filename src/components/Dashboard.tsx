import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Puzzle,
  FileText,
  Table2,
  Copy,
  Mail,
  MessageSquare,
  Bell,
  Search,
  ChevronRight,
  CheckCircle,
  XCircle,
  FileUp,
  MoreVertical,
  Download,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  RefreshCw,
  Package,
  ShoppingBag,
  DollarSign,
  BarChart2,
  Users,
} from "lucide-react";

import {
  imgCanvas,
  imgRectangle,
  imgRectangle1,
  imgRectangle2,
  imgRectangle3,
  imgRectangle4,
  imgRectangle5,
  imgRectangle6,
  imgSvgjsLine2553,
  imgSvgjsG2566,
  imgClipPathGroup,
  imgClipPathGroup1,
  imgClipPathGroup2,
  imgClipPathGroup3,
  imgClipPathGroup4,
  imgClipPathGroup5,
  imgClipPathGroup6,
  imgClipPathGroup7,
  imgSvgjsLine2631,
  imgSvgjsG2646,
  imgClipPathGroup8,
  imgClipPathGroup9,
  imgClipPathGroup10,
  imgClipPathGroup11,
  imgClipPathGroup12,
  imgClipPathGroup13,
  imgClipPathGroup14,
  imgClipPathGroup15,
  imgClipPathGroup16,
  imgClipPathGroup17,
  imgClipPathGroup18,
  imgClipPathGroup19,
  imgGroup,
  imgGroup1,
  imgGroup2,
} from "./assets";

/* ─── Premium Theme Toggle ──────────────────────────────────────────── */
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        position: "relative",
        width: "56px",
        height: "28px",
        borderRadius: "999px",
        border: "none",
        cursor: "pointer",
        outline: "none",
        padding: 0,
        background: isDark
          ? "linear-gradient(135deg, #1a1040 0%, #2d1b6e 50%, #0f0c29 100%)"
          : "linear-gradient(135deg, #74d7f7 0%, #a8edea 50%, #fed6e3 100%)",
        boxShadow: isDark
          ? "0 0 12px rgba(139,92,246,0.5), inset 0 1px 0 rgba(255,255,255,0.08)"
          : "0 0 12px rgba(116,215,247,0.5), inset 0 1px 0 rgba(255,255,255,0.6)",
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        flexShrink: 0,
      }}
    >
      {/* Stars / Clouds decoration */}
      {isDark ? (
        <>
          <span style={{
            position: "absolute", left: "6px", top: "5px",
            width: "3px", height: "3px", borderRadius: "50%",
            background: "rgba(255,255,255,0.9)",
            boxShadow: "0 0 3px #fff",
            transition: "opacity 0.3s"
          }} />
          <span style={{
            position: "absolute", left: "12px", top: "11px",
            width: "2px", height: "2px", borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            transition: "opacity 0.3s"
          }} />
          <span style={{
            position: "absolute", left: "8px", top: "17px",
            width: "2px", height: "2px", borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            transition: "opacity 0.3s"
          }} />
        </>
      ) : (
        <>
          <span style={{
            position: "absolute", left: "6px", top: "9px",
            width: "14px", height: "8px", borderRadius: "999px",
            background: "rgba(255,255,255,0.7)",
            transition: "opacity 0.3s"
          }} />
          <span style={{
            position: "absolute", left: "10px", top: "6px",
            width: "8px", height: "8px", borderRadius: "50%",
            background: "rgba(255,255,255,0.7)",
            transition: "opacity 0.3s"
          }} />
        </>
      )}

      {/* Sliding orb */}
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: isDark ? "31px" : "3px",
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: isDark
            ? "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)"
            : "linear-gradient(135deg, #fde68a 0%, #fbbf24 50%, #f97316 100%)",
          boxShadow: isDark
            ? "0 0 8px rgba(192,132,252,0.8), 0 2px 6px rgba(0,0,0,0.4)"
            : "0 0 8px rgba(251,191,36,0.8), 0 2px 6px rgba(0,0,0,0.2)",
          transition: "left 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.4s ease, box-shadow 0.4s ease",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Inner glow ring */}
        <span style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(192,132,252,0.4) 100%)"
            : "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(251,191,36,0.3) 100%)",
          transition: "background 0.4s ease",
        }} />
      </span>
    </button>
  );
}

/* ─── Theme Config ───────────────────────────────────────────────────── */
function getTheme(isDark: boolean) {
  if (isDark) {
    return {
      // Backgrounds
      mainBg: "#171622",
      sidebarBg: "#15141f",
      cardBg: "#212130",
      inputBg: "#212130",
      innerBg: "#1e1d29",
      deepBg: "#171622",
      headerBg: "rgba(23,22,34,0.90)",
      footerBg: "rgba(18,17,26,0.3)",
      // Borders
      border: "rgba(46,46,66,0.5)",
      borderCard: "rgba(46,46,66,0.4)",
      borderInput: "rgba(46,46,66,0.8)",
      borderSoft: "rgba(46,46,66,0.6)",
      // Text
      textPrimary: "#ffffff",
      textSecondary: "#828690",
      textMuted: "#969ba0",
      textSubtle: "rgba(255,255,255,0.8)",
      // Accent
      accent: "#5bcfc5",
      accentHover: "#4bc0b6",
      accentBg: "rgba(91,207,197,0.1)",
      accentBorder: "rgba(91,207,197,0.25)",
      // Hover states
      hoverBg: "#212130",
      hoverBgDeep: "#2c2c3e",
      // Sidebar item
      activeItemBg: "rgba(91,207,197,0.10)",
      activeItemText: "#5bcfc5",
      inactiveItemText: "#969ba0",
      // Bar chart bg
      barBg: "#171622",
    };
  }
  return {
    // Backgrounds
    mainBg: "#f0f2f8",
    sidebarBg: "#ffffff",
    cardBg: "#ffffff",
    inputBg: "#f5f6fa",
    innerBg: "#f5f6fa",
    deepBg: "#eef0f8",
    headerBg: "rgba(255,255,255,0.95)",
    footerBg: "rgba(240,242,248,0.5)",
    // Borders
    border: "rgba(220,222,235,0.9)",
    borderCard: "rgba(220,222,235,0.7)",
    borderInput: "rgba(220,222,235,0.9)",
    borderSoft: "rgba(220,222,235,0.8)",
    // Text
    textPrimary: "#3d4465",
    textSecondary: "#787f9e",
    textMuted: "#9ea5c0",
    textSubtle: "rgba(61,68,101,0.8)",
    // Accent
    accent: "#5bcfc5",
    accentHover: "#4bc0b6",
    accentBg: "rgba(91,207,197,0.1)",
    accentBorder: "rgba(91,207,197,0.35)",
    // Hover states
    hoverBg: "#f5f6fa",
    hoverBgDeep: "#ecedf5",
    // Sidebar item
    activeItemBg: "rgba(91,207,197,0.12)",
    activeItemText: "#5bcfc5",
    inactiveItemText: "#787f9e",
    // Bar chart bg
    barBg: "#eef0f8",
  };
}

export default function Dashboard({ onLogout }: { onLogout?: () => void }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [isDark, setIsDark] = useState(true);
  const [logoutHover, setLogoutHover] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutAnimating, setLogoutAnimating] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileMenuPos, setProfileMenuPos] = useState({ top: 0, left: 0 });
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileBtnRef = useRef<HTMLButtonElement>(null);
  const logoutBtnRef = useRef<HTMLButtonElement>(null);
  const logoutConfirmRef = useRef<HTMLDivElement>(null);
  const [logoutConfirmPos, setLogoutConfirmPos] = useState({ bottom: 0, left: 0 });

  // Update logout confirm position when it opens
  useEffect(() => {
    if (showLogoutConfirm && logoutBtnRef.current) {
      const rect = logoutBtnRef.current.getBoundingClientRect();
      setLogoutConfirmPos({
        bottom: window.innerHeight - rect.bottom,
        left: rect.right + 12,
      });
    }
  }, [showLogoutConfirm]);

  // Close logout confirmation when clicking outside
  useEffect(() => {
    if (!showLogoutConfirm) return;
    const handler = (e: MouseEvent) => {
      if (logoutAnimating) return;
      if (
        logoutConfirmRef.current &&
        !logoutConfirmRef.current.contains(e.target as Node) &&
        logoutBtnRef.current &&
        !logoutBtnRef.current.contains(e.target as Node)
      ) {
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showLogoutConfirm, logoutAnimating]);

  const toggleProfileMenu = () => {
    if (!profileMenuOpen && profileBtnRef.current) {
      const rect = profileBtnRef.current.getBoundingClientRect();
      setProfileMenuPos({ top: rect.top, left: rect.right + 12 });
    }
    setProfileMenuOpen(!profileMenuOpen);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileMenuOpen]);

  const t = getTheme(isDark);

  // Quick Transfer interactive states
  const [transferTarget, setTransferTarget] = useState({
    name: "Samuel",
    handle: "@sam224",
    img: imgRectangle,
  });
  const [transferAmount, setTransferAmount] = useState("20.000");
  const [transferStatus, setTransferStatus] = useState<"idle" | "processing" | "success">("idle");

  const friends = [
    { name: "Samuel", handle: "@sam224", img: imgRectangle },
    { name: "Cindy", handle: "@cindy_a", img: imgRectangle1 },
    { name: "Renata", handle: "@chef_renata", img: imgRectangle2 },
    { name: "Alex", handle: "@alex23", img: imgRectangle3 },
    { name: "Hawkins", handle: "@hawk_jr", img: imgRectangle4 },
    { name: "William", handle: "@will_iam", img: imgRectangle5 },
    { name: "Julian", handle: "@julian_s", img: imgRectangle6 },
  ];

  const handleTransfer = () => {
    setTransferStatus("processing");
    setTimeout(() => {
      setTransferStatus("success");
      setTimeout(() => setTransferStatus("idle"), 3000);
    }, 1500);
  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Productos", icon: Package },
    { name: "Compras", icon: ShoppingBag },
    { name: "Ventas", icon: DollarSign },
    { name: "Reportes", icon: BarChart2 },
    { name: "Usuarios", icon: Users },
    { name: "Widget", icon: Puzzle },
    { name: "Forms", icon: FileText },
    { name: "Table", icon: Table2 },
    { name: "Pages", icon: Copy },
  ];

  return (
    <div
      className="h-screen font-['Cairo'] flex overflow-hidden"
      style={{ background: t.mainBg, color: t.textSecondary, transition: "background 0.4s ease, color 0.4s ease" }}
    >

      {/* Sidebar - Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen border-r z-50 flex flex-col justify-between transition-all duration-300 ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"
          } ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}`}
        style={{ background: t.sidebarBg, borderColor: t.border, transition: "background 0.4s ease, border-color 0.4s ease, width 0.3s ease, transform 0.3s ease" }}
      >
        <div 
          onScroll={() => profileMenuOpen && setProfileMenuOpen(false)}
          className={`flex flex-col flex-1 overflow-y-auto py-5 transition-all duration-300 scrollbar-thin ${sidebarCollapsed ? "px-4" : "px-6"
          }`}
        >
          {/* Brand Logo */}
          <div className={`flex items-center mb-8 ${sidebarCollapsed ? "flex-col gap-4 justify-center" : "justify-between"}`}>
            <div className={`flex items-center ${sidebarCollapsed ? "justify-center" : "gap-3"}`}>
              <div className="relative flex items-center justify-center bg-[#5bcfc5] rounded-[14px] h-[40px] w-[40px] shadow-lg shadow-[#5bcfc5]/20 flex-shrink-0">
                <svg className="w-5 h-5 text-[#171622]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM4 9h16v2H4V9zm0 8v-4h16v4H4z" />
                  <path d="M18 5H6a1 1 0 010-2h12a1 1 0 010 2z" />
                </svg>
              </div>
              {!sidebarCollapsed && (
                <span className="font-bold text-2xl tracking-wide font-sans" style={{ color: t.textPrimary }}>Botica</span>
              )}
            </div>
            {/* Close button on mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden hover:text-[#5bcfc5]"
              style={{ color: t.textPrimary }}
            >
              <X size={24} />
            </button>
          </div>

          {/* User Profile Card — Interactive */}
          <div className="relative mb-8" ref={profileMenuRef}>
            {/* Keyframes for profile menu */}
            <style>{`
              @keyframes profileMenuSlideIn {
                from { opacity: 0; transform: translateY(-8px) scale(0.96); }
                to { opacity: 1; transform: translateY(0) scale(1); }
              }
              @keyframes profileMenuItemFade {
                from { opacity: 0; transform: translateX(-6px); }
                to { opacity: 1; transform: translateX(0); }
              }
              @keyframes profilePulse {
                0%, 100% { box-shadow: 0 0 0 0 rgba(91,207,197,0.3); }
                50% { box-shadow: 0 0 0 6px rgba(91,207,197,0); }
              }
            `}</style>

            <button
              ref={profileBtnRef}
              onClick={toggleProfileMenu}
              className={`w-full flex items-center transition-all duration-300 ${sidebarCollapsed
                ? "justify-center px-0"
                : "rounded-[20px] p-4 gap-3"
                }`}
              style={{
                ...(!sidebarCollapsed ? {
                  border: `1px solid ${profileMenuOpen ? t.accent : t.borderSoft}`,
                  background: profileMenuOpen
                    ? (isDark ? "rgba(91,207,197,0.06)" : "rgba(91,207,197,0.04)")
                    : t.innerBg,
                  boxShadow: profileMenuOpen
                    ? `0 4px 20px -4px rgba(91,207,197,0.15)`
                    : "none",
                } : {}),
                cursor: "pointer",
                outline: "none",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                if (!profileMenuOpen && !sidebarCollapsed) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = `${t.accent}80`;
                  (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(91,207,197,0.04)" : "rgba(91,207,197,0.03)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px -4px rgba(91,207,197,0.12)";
                }
              }}
              onMouseLeave={(e) => {
                if (!profileMenuOpen && !sidebarCollapsed) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderSoft;
                  (e.currentTarget as HTMLButtonElement).style.background = t.innerBg;
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }
              }}
            >
              <div className="relative flex-shrink-0">
                <img
                  src={imgRectangle}
                  alt="Jefferson"
                  className="w-10 h-10 rounded-full object-cover transition-all duration-300"
                  style={{
                    border: profileMenuOpen ? `2px solid ${t.accent}` : `1px solid ${t.border}`,
                    animation: profileMenuOpen ? "profilePulse 2s ease infinite" : "none",
                  }}
                />
                <span
                  className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#68e365] border-2 rounded-full"
                  style={{ borderColor: !sidebarCollapsed ? (profileMenuOpen ? (isDark ? "rgba(91,207,197,0.06)" : "rgba(91,207,197,0.04)") : t.innerBg) : t.sidebarBg }}
                />
              </div>
              {!sidebarCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-semibold text-[15px] leading-tight truncate" style={{ color: t.textPrimary }}>Hola, Jefferson Manco</p>
                    <p className="font-normal text-[12px] truncate mt-0.5" style={{ color: t.textSecondary }}>jefferson@boticadmin.pe</p>
                  </div>
                  {/* Chevron indicator */}
                  <ChevronRight
                    size={16}
                    style={{
                      color: profileMenuOpen ? t.accent : `${t.textSecondary}60`,
                      transform: profileMenuOpen ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                      flexShrink: 0,
                    }}
                  />
                </>
              )}
            </button>

            {/* ─── Dropdown Menu ─── */}
            {profileMenuOpen && (
              <div
                style={{
                  position: sidebarCollapsed ? "fixed" : "absolute",
                  top: sidebarCollapsed ? `${profileMenuPos.top}px` : "100%",
                  left: sidebarCollapsed ? `${profileMenuPos.left}px` : "0",
                  transform: "none",
                  width: sidebarCollapsed ? "220px" : "100%",
                  marginTop: sidebarCollapsed ? "0" : "8px",
                  zIndex: 9999,
                  borderRadius: "18px",
                  padding: "6px",
                  background: isDark
                    ? "linear-gradient(145deg, rgba(33,33,48,0.97), rgba(21,20,31,0.97))"
                    : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                  border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.8)"}`,
                  boxShadow: isDark
                    ? "0 20px 48px -8px rgba(0,0,0,0.55), 0 8px 16px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)"
                    : "0 20px 48px -8px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.6)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  animation: "profileMenuSlideIn 0.25s cubic-bezier(.22,1,.36,1) both",
                  overflow: "hidden",
                }}
              >
                {/* User mini-card header inside dropdown */}
                <div
                  style={{
                    padding: "12px 14px",
                    borderBottom: `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`,
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    animation: "profileMenuItemFade 0.3s ease 0.05s both",
                  }}
                >
                  <img
                    src={imgRectangle}
                    alt="Jefferson"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${t.accent}`,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      Jefferson Manco
                    </p>
                    <p style={{ fontSize: "11px", color: t.accent, lineHeight: 1.3 }}>En línea</p>
                  </div>
                </div>

                {/* Menu Items */}
                {[
                  {
                    icon: User,
                    label: "Mi Perfil",
                    subtitle: "Ver y editar perfil",
                    color: "#5bcfc5",
                    colorBg: isDark ? "rgba(91,207,197,0.12)" : "rgba(91,207,197,0.08)",
                    hoverBg: isDark ? "rgba(91,207,197,0.08)" : "rgba(91,207,197,0.05)",
                    delay: "0.08s",
                    action: () => { setProfileMenuOpen(false); },
                  },
                  {
                    icon: Settings,
                    label: "Ajustes",
                    subtitle: "Configuración",
                    color: "#ffa755",
                    colorBg: isDark ? "rgba(255,167,85,0.12)" : "rgba(255,167,85,0.08)",
                    hoverBg: isDark ? "rgba(255,167,85,0.08)" : "rgba(255,167,85,0.05)",
                    delay: "0.12s",
                    action: () => { setProfileMenuOpen(false); },
                  },
                  {
                    icon: LogOut,
                    label: "Cerrar Sesión",
                    subtitle: "Salir del sistema",
                    color: "#ef4444",
                    colorBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                    hoverBg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                    delay: "0.16s",
                    action: () => { setProfileMenuOpen(false); setShowLogoutConfirm(true); },
                  },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={item.action}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        fontFamily: "'Cairo', sans-serif",
                        transition: "all 0.2s ease",
                        animation: `profileMenuItemFade 0.3s ease ${item.delay} both`,
                        marginBottom: idx < 2 ? "2px" : "0",
                        ...(idx === 2 ? {
                          marginTop: "4px",
                          borderTop: `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`,
                          paddingTop: "12px",
                          borderRadius: "0 0 12px 12px",
                        } : {}),
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = item.hoverBg;
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)";
                      }}
                    >
                      {/* Colored icon container */}
                      <span
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: item.colorBg,
                          color: item.color,
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      >
                        <ItemIcon size={16} />
                      </span>
                      {/* Label + subtitle */}
                      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: t.textPrimary, lineHeight: 1.3 }}>
                          {item.label}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 400, color: t.textSecondary, lineHeight: 1.3 }}>
                          {item.subtitle}
                        </span>
                      </span>
                      {/* Arrow */}
                      <ChevronRight
                        size={14}
                        style={{
                          marginLeft: "auto",
                          color: `${t.textSecondary}50`,
                          flexShrink: 0,
                          transition: "all 0.2s ease",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Nav Menu */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveMenu(item.name);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center transition-all duration-200 group ${sidebarCollapsed
                    ? "px-0 justify-center h-12 rounded-xl"
                    : "px-4 py-3.5 justify-between rounded-xl"
                    }`}
                  style={{
                    background: isActive ? t.activeItemBg : "transparent",
                    color: isActive ? t.activeItemText : t.inactiveItemText,
                    fontWeight: isActive ? 600 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                      (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                      (e.currentTarget as HTMLButtonElement).style.color = t.inactiveItemText;
                    }
                  }}
                >
                  {sidebarCollapsed ? (
                    <Icon
                      size={20}
                      className="transition-colors flex-shrink-0"
                    />
                  ) : (
                    <>
                      <div className="flex items-center gap-3.5 min-w-0">
                        <Icon size={20} className="transition-colors flex-shrink-0" />
                        <span className="text-[15px] truncate">{item.name}</span>
                      </div>
                      <ChevronRight
                        size={14}
                        className={`transition-transform duration-200 flex-shrink-0 ${isActive ? "rotate-90" : ""}`}
                        style={{ color: isActive ? t.activeItemText : `${t.textSecondary}80` }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Premium Logout */}
        <div className={`border-t transition-all duration-300 ${sidebarCollapsed ? "p-3 flex justify-center" : "p-4"}`}
          style={{ borderColor: t.border, background: t.footerBg, position: "relative" }}
        >
          {/* Keyframes for logout button */}
          <style>{`
            @keyframes logoutGradientSpin {
              0% { background-position: 0% 50%; }
              50% { background-position: 100% 50%; }
              100% { background-position: 0% 50%; }
            }
            @keyframes logoutIconSlide {
              0% { transform: translateX(0); opacity: 1; }
              40% { transform: translateX(6px); opacity: 0.6; }
              60% { transform: translateX(-2px); opacity: 0.8; }
              100% { transform: translateX(0); opacity: 1; }
            }
            @keyframes logoutPulseRing {
              0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.35); }
              70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
              100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
            }
            @keyframes logoutShimmer {
              0% { background-position: -200% center; }
              100% { background-position: 200% center; }
            }
            @keyframes confirmFadeIn {
              from { opacity: 0; transform: scale(0.92) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes confirmBackdrop {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            @keyframes logoutSpinOut {
              0% { transform: rotate(0deg) scale(1); opacity: 1; }
              100% { transform: rotate(180deg) scale(0.5); opacity: 0; }
            }
            @keyframes spinLoader {
              to { transform: rotate(360deg); }
            }
          `}</style>

          {/* Collapsed mode: icon-only logout */}
          {sidebarCollapsed ? (
            <button
              ref={logoutBtnRef}
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              title="Cerrar sesión"
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "14px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDark
                  ? "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08))"
                  : "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.05))",
                color: "#ef4444",
                transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                animation: logoutHover ? "logoutPulseRing 1.5s infinite" : "none",
              }}
              onMouseEnter={(e) => {
                setLogoutHover(true);
                (e.currentTarget as HTMLButtonElement).style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
                (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px -4px rgba(239,68,68,0.4)";
              }}
              onMouseLeave={(e) => {
                setLogoutHover(false);
                (e.currentTarget as HTMLButtonElement).style.background = isDark
                  ? "linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08))"
                  : "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(220,38,38,0.05))";
                (e.currentTarget as HTMLButtonElement).style.color = "#ef4444";
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
              }}
            >
              <LogOut size={20} />
            </button>
          ) : (
            /* Expanded mode: full premium logout button */
            <button
              ref={logoutBtnRef}
              onClick={() => setShowLogoutConfirm(!showLogoutConfirm)}
              style={{
                width: "100%",
                position: "relative",
                overflow: "hidden",
                padding: "14px 20px",
                borderRadius: "16px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                fontFamily: "'Cairo', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                color: logoutHover ? "#ffffff" : "#ef4444",
                background: logoutHover
                  ? "linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #b91c1c 100%)"
                  : isDark
                    ? "linear-gradient(135deg, rgba(239,68,68,0.10) 0%, rgba(220,38,38,0.06) 100%)"
                    : "linear-gradient(135deg, rgba(239,68,68,0.07) 0%, rgba(220,38,38,0.04) 100%)",
                boxShadow: logoutHover
                  ? "0 12px 32px -6px rgba(239,68,68,0.45), 0 4px 12px -2px rgba(239,68,68,0.25)"
                  : "none",
                transform: logoutHover ? "translateY(-2px)" : "translateY(0)",
                transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={() => setLogoutHover(true)}
              onMouseLeave={() => setLogoutHover(false)}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(0.97)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1)";
              }}
            >
              {/* Shimmer overlay on hover */}
              {logoutHover && (
                <span
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.12) 50%, transparent 100%)",
                    backgroundSize: "200% 100%",
                    animation: "logoutShimmer 1.8s ease infinite",
                    borderRadius: "16px",
                    pointerEvents: "none",
                  }}
                />
              )}

              {/* Icon container with glow ring */}
              <span
                style={{
                  position: "relative",
                  width: "36px",
                  height: "36px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: logoutHover
                    ? "rgba(255,255,255,0.18)"
                    : isDark
                      ? "rgba(239,68,68,0.12)"
                      : "rgba(239,68,68,0.08)",
                  transition: "all 0.3s ease",
                  flexShrink: 0,
                  animation: logoutHover ? "logoutPulseRing 1.8s infinite" : "none",
                }}
              >
                <LogOut
                  size={18}
                  style={{
                    animation: logoutHover ? "logoutIconSlide 0.6s ease" : "none",
                    transition: "transform 0.3s ease",
                  }}
                />
              </span>

              {/* Label + subtitle */}
              <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
                <span style={{ lineHeight: 1.2, whiteSpace: "nowrap" }}>Cerrar Sesión</span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 400,
                    opacity: 0.7,
                    lineHeight: 1.3,
                    whiteSpace: "nowrap",
                    color: logoutHover ? "rgba(255,255,255,0.8)" : t.textSecondary,
                    transition: "color 0.3s",
                  }}
                >
                  Salir de forma segura
                </span>
              </span>

              {/* Trailing arrow indicator */}
              <span
                style={{
                  marginLeft: "auto",
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.3s ease",
                  transform: logoutHover ? "translateX(4px)" : "translateX(0)",
                  opacity: logoutHover ? 1 : 0.4,
                }}
              >
                <ChevronRight size={16} />
              </span>
            </button>
          )}
        </div>

        {/* ═══ Logout Confirmation Popover ═══ */}
        {showLogoutConfirm && (
          <div
            ref={logoutConfirmRef}
            style={{
              position: sidebarCollapsed ? "fixed" : "absolute",
              bottom: sidebarCollapsed ? `${logoutConfirmPos.bottom}px` : "100%",
              left: sidebarCollapsed ? `${logoutConfirmPos.left}px` : "16px",
              right: sidebarCollapsed ? "auto" : "16px",
              width: sidebarCollapsed ? "280px" : "auto",
              marginBottom: sidebarCollapsed ? "0" : "12px",
              zIndex: 9999,
              borderRadius: "20px",
              padding: "20px",
              background: isDark
                ? "linear-gradient(145deg, rgba(33,33,48,0.98), rgba(21,20,31,0.98))"
                : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
              border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(226,232,240,0.8)"}`,
              boxShadow: isDark
                ? "0 20px 48px -8px rgba(0,0,0,0.55), 0 8px 16px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)"
                : "0 20px 48px -8px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              animation: "confirmFadeIn 0.25s cubic-bezier(.22,1,.36,1) both",
              textAlign: "center",
            }}
          >
            {/* Warning Icon with animated ring */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDark
                  ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.06))"
                  : "linear-gradient(135deg, rgba(239,68,68,0.10), rgba(239,68,68,0.04))",
                animation: logoutAnimating ? "logoutSpinOut 0.6s ease forwards" : "logoutPulseRing 2s infinite",
              }}
            >
              <LogOut size={20} style={{ color: "#ef4444" }} />
            </div>

            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: isDark ? "#ffffff" : "#1e293b",
                marginBottom: "6px",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              ¿Cerrar sesión?
            </h3>
            <p
              style={{
                fontSize: "12px",
                color: isDark ? "#969ba0" : "#64748b",
                lineHeight: 1.5,
                marginBottom: "18px",
                fontFamily: "'Cairo', sans-serif",
              }}
            >
              Tu sesión actual se cerrará y volverás a la pantalla de inicio de sesión.
            </p>

            {/* Action Buttons */}
            <div style={{ display: "flex", gap: "8px" }}>
              {/* Cancel */}
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={logoutAnimating}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "'Cairo', sans-serif",
                  cursor: logoutAnimating ? "not-allowed" : "pointer",
                  border: `1px solid ${isDark ? "rgba(46,46,66,0.6)" : "rgba(226,232,240,0.9)"}`,
                  background: isDark ? "rgba(33,33,48,0.8)" : "rgba(248,250,252,0.9)",
                  color: isDark ? "#ffffff" : "#1e293b",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(46,46,66,0.6)" : "rgba(226,232,240,0.6)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = isDark ? "rgba(33,33,48,0.8)" : "rgba(248,250,252,0.9)";
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                Cancelar
              </button>

              {/* Confirm Logout */}
              <button
                onClick={() => {
                  setLogoutAnimating(true);
                  setTimeout(() => {
                    setShowLogoutConfirm(false);
                    setLogoutAnimating(false);
                    if (onLogout) onLogout();
                  }, 700);
                }}
                disabled={logoutAnimating}
                style={{
                  flex: 1,
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  fontFamily: "'Cairo', sans-serif",
                  cursor: logoutAnimating ? "not-allowed" : "pointer",
                  border: "none",
                  background: logoutAnimating
                    ? "linear-gradient(135deg, #22c55e, #16a34a)"
                    : "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow: logoutAnimating
                    ? "0 6px 16px -4px rgba(34,197,94,0.5)"
                    : "0 6px 16px -4px rgba(239,68,68,0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!logoutAnimating) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px -4px rgba(239,68,68,0.5)";
                  }
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 16px -4px rgba(239,68,68,0.4)";
                }}
              >
                {logoutAnimating ? (
                  <>
                    <span
                      style={{
                        width: "12px",
                        height: "12px",
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spinLoader 0.6s linear infinite",
                      }}
                    />
                    Cerrando...
                  </>
                ) : (
                  <>
                    <LogOut size={12} />
                    Sí, cerrar
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Page Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">

        {/* Top Navbar */}
        <header
          className="sticky top-0 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between border-b"
          style={{ background: t.headerBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile open button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border transition-colors"
              style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}
            >
              <Menu size={22} />
            </button>
            {/* Desktop collapse toggle button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex items-center justify-center border rounded-xl size-9 transition-all duration-200 flex-shrink-0"
              style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <ChevronRight size={18} /> : <Menu size={18} />}
            </button>
            <h1 className="text-[24px] font-semibold leading-none capitalize" style={{ color: t.textPrimary }}>
              {activeMenu}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Input */}
            <div className="relative hidden md:block w-64 lg:w-72">
              <input
                type="text"
                placeholder="Search here..."
                className="w-full pl-4 pr-10 py-2 rounded-[16px] text-sm focus:outline-none transition-all duration-300"
                style={{
                  background: t.inputBg,
                  color: t.textPrimary,
                  border: `1px solid ${t.borderInput}`,
                  // @ts-ignore
                  "--tw-ring-color": t.accent,
                }}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: `${t.textSecondary}cc` }} />
            </div>

            {/* Notification Icons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* ✨ Premium Theme Toggle — replaces Settings icon */}
              <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />

              <button className="p-2.5 rounded-xl border transition-colors relative" style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}>
                <Mail size={18} />
                <span className="absolute -top-1 -right-1 bg-[#5bcfc5] text-[#171622] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  2
                </span>
              </button>
              <button className="p-2.5 rounded-xl border transition-colors relative" style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}>
                <MessageSquare size={18} />
                <span className="absolute -top-1 -right-1 bg-[#5bcfc5] text-[#171622] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  12
                </span>
              </button>
              <button className="p-2.5 rounded-xl border transition-colors relative" style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}>
                <Bell size={18} />
                <span className="absolute -top-1 -right-1 bg-[#5bcfc5] text-[#171622] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  5
                </span>
              </button>
            </div>

            {/* Generate Report Button */}
            <button className="bg-[#5bcfc5] hover:bg-[#4bc0b6] text-[#171622] font-semibold px-4 py-2.5 rounded-xl hidden sm:flex items-center gap-2 text-[14px] transition-all duration-300 shadow-lg shadow-[#5bcfc5]/15">
              <span>Generar Reporte</span>
              <TrendingUp size={16} />
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard View */}
        <main className="flex-1 p-6 space-y-6 overflow-y-auto" style={{ background: t.mainBg, transition: "background 0.4s ease" }}>

          {/* 4 Summary Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Card 1 */}
            <div className="bg-[#4d3422]/90 bg-gradient-to-br from-[#533a28] to-[#392518] border border-[#ffb74d]/10 rounded-[24px] p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <p className="text-white text-[28px] font-semibold leading-tight">2478</p>
                <p className="text-[#ffa755] text-[14px] mt-1 font-medium">Productos en Stock</p>
              </div>
              <div className="bg-[#ffa755]/15 p-3 rounded-2xl text-[#ffa755]">
                <FileText size={24} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-[#1a3b2b]/90 bg-gradient-to-br from-[#1e4431] to-[#122b1f] border border-[#81c784]/10 rounded-[24px] p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <p className="text-white text-[28px] font-semibold leading-tight">983</p>
                <p className="text-[#68e365] text-[14px] mt-1 font-medium">Ventas de Hoy</p>
              </div>
              <div className="bg-[#68e365]/15 p-3 rounded-2xl text-[#68e365]">
                <CheckCircle size={24} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-[#311b4d]/90 bg-gradient-to-br from-[#3b215c] to-[#221235] border border-[#ba68c8]/10 rounded-[24px] p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <p className="text-white text-[28px] font-semibold leading-tight">1256</p>
                <p className="text-[#f72b50] text-[14px] mt-1 font-medium">Stock Crítico</p>
              </div>
              <div className="bg-[#f72b50]/15 p-3 rounded-2xl text-[#f72b50]">
                <XCircle size={24} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-[#182c47]/90 bg-gradient-to-br from-[#1f3759] to-[#101f33] border border-[#64b5f6]/10 rounded-[24px] p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-300">
              <div>
                <p className="text-white text-[28px] font-semibold leading-tight">$2652</p>
                <p className="text-[#5bcfc5] text-[14px] mt-1 font-medium">Ingresos de Mes</p>
              </div>
              <div className="bg-[#5bcfc5]/15 p-3 rounded-2xl text-[#5bcfc5]">
                <FileUp size={24} />
              </div>
            </div>

          </div>

          {/* Wallet Balance + Card's Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Wallet Balance blue card */}
            <div className="lg:col-span-2 bg-[#2c4eff] bg-gradient-to-br from-[#3b5beb] to-[#1d3bcd] rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-xl shadow-blue-900/10">
              <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>

              <div className="flex justify-between items-start z-10">
                <div className="flex">
                  <div className="size-9 rounded-full bg-white/20 backdrop-blur-sm"></div>
                  <div className="size-9 rounded-full bg-white/20 backdrop-blur-sm -ml-4"></div>
                </div>
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 py-2 border border-white/20">
                  <span className="text-white text-[12px] font-bold tracking-wide uppercase select-none flex items-center gap-1.5">
                    <RefreshCw size={12} className="animate-spin-slow" />
                    Change
                  </span>
                </div>
              </div>

              <div className="z-10 mt-6">
                <p className="text-white/80 text-[14px] font-semibold tracking-wider uppercase font-sans">Wallet Balance</p>
                <p className="text-white text-[38px] sm:text-[44px] font-bold leading-tight font-sans mt-1">
                  $824,571.93
                </p>
                <p className="text-[#68e365] text-[13px] font-semibold bg-black/15 px-3 py-1 rounded-full w-fit mt-3">
                  +0.8% than last week
                </p>
              </div>
            </div>

            {/* Card's Overview */}
            <div className="rounded-[24px] p-6 flex flex-col justify-between min-h-[260px] border" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Card's Overview</h3>
                  <p className="text-[13px] mt-1 max-w-[180px] leading-relaxed" style={{ color: t.textSecondary }}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit psu olor
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 mt-4">
                <div className="space-y-3 flex-1">
                  {[
                    { color: "#496ecc", label: "Account", pct: "20%" },
                    { color: "#68e365", label: "Services", pct: "40%" },
                    { color: "#ffa755", label: "Restaurant", pct: "15%" },
                    { color: "#c8c8c8", label: "Others", pct: "15%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="size-3.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="font-medium" style={{ color: t.textPrimary }}>{item.label}</span>
                      </div>
                      <span className="font-bold" style={{ color: t.textMuted }}>{item.pct}</span>
                    </div>
                  ))}
                </div>
                <div className="size-28 relative flex-shrink-0 flex items-center justify-center">
                  <img src={imgCanvas} alt="Pie Chart" className="max-w-none object-cover size-full" />
                </div>
              </div>
            </div>

          </div>

          {/* Activity + Quick Transfer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Activity */}
            <div className="lg:col-span-4 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Activity</h3>
                    <p className="text-[28px] font-bold leading-tight mt-1" style={{ color: t.textPrimary }}>$78,120</p>
                  </div>
                  <div className="text-right space-y-1.5">
                    <div className="flex items-center justify-end gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                      <span>Income</span>
                      <span className="size-3.5 rounded-full bg-[#68e365]" />
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                      <span>Outcome</span>
                      <span className="size-3.5 rounded-full bg-[#f72b50]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex-1 relative min-h-[300px] mt-4 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="w-full h-[280px] relative overflow-hidden bg-transparent">
                    <div className="absolute inset-0">
                      <img alt="" className="w-full h-full object-fill opacity-10" src={imgSvgjsLine2553} />
                    </div>
                    <div className="absolute inset-0">
                      <img alt="" className="w-full h-full object-fill opacity-20" src={imgSvgjsG2566} />
                    </div>
                    <div className="absolute inset-0 flex">
                      {[imgClipPathGroup, imgClipPathGroup1, imgClipPathGroup2, imgClipPathGroup3, imgClipPathGroup4, imgClipPathGroup5, imgClipPathGroup6, imgClipPathGroup7].map((img, i) => (
                        <img key={i} alt="" className="absolute inset-0 w-full h-full object-contain" src={img} />
                      ))}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-6 text-[11px]" style={{ color: t.textMuted }}>
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                    </div>
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] py-2" style={{ color: t.textMuted }}>
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Transfer */}
            <div className="lg:col-span-8 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Quick Transfer</h3>
                    <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Lorem ipsum dolor sit amet, consectetur</p>
                  </div>
                  <button className="p-2 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }}>
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Recipient User Profile Card */}
                <div className="rounded-[20px] p-4 flex items-center justify-between mb-6" style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}` }}>
                  <div className="flex items-center gap-3">
                    <img src={transferTarget.img} alt={transferTarget.name} className="w-12 h-12 rounded-[16px] object-cover" />
                    <div>
                      <p className="font-semibold text-[16px]" style={{ color: t.textPrimary }}>{transferTarget.name}</p>
                      <p className="font-normal text-[13px]" style={{ color: t.textSecondary }}>{transferTarget.handle}</p>
                    </div>
                  </div>
                  <div className="bg-[#5bcfc5] text-[#171622] rounded-full p-1.5 size-7 flex items-center justify-center shadow-lg shadow-[#5bcfc5]/20">
                    ✓
                  </div>
                </div>

                {/* Recent Friends selection */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold text-[14px]" style={{ color: t.textPrimary }}>Recent Friend</span>
                    <button className="text-[#5bcfc5] hover:text-[#4bc0b6] text-[13px] font-semibold">See More</button>
                  </div>
                  <div className="flex items-center gap-3.5 overflow-x-auto py-2 scrollbar-thin">
                    {friends.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => setTransferTarget({ name: f.name, handle: f.handle, img: f.img })}
                        className={`flex flex-col items-center flex-shrink-0 gap-1.5 p-1.5 rounded-2xl transition-all duration-300`}
                        style={{
                          background: transferTarget.name === f.name ? t.innerBg : "transparent",
                          outline: transferTarget.name === f.name ? `2px solid #5bcfc5` : "none",
                        }}
                      >
                        <img src={f.img} alt={f.name} className="w-11 h-11 rounded-[14px] object-cover" />
                        <span className="text-[11px]" style={{ color: `${t.textPrimary}cc` }}>{f.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-3">
                  <span className="font-semibold text-[14px] block" style={{ color: t.textPrimary }}>Insert Amount</span>
                  <div className="border rounded-2xl p-4 flex items-center justify-between" style={{ background: t.deepBg, borderColor: t.border }}>
                    <input
                      type="text"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      className="bg-transparent text-2xl font-bold font-sans focus:outline-none w-2/3"
                      style={{ color: t.textPrimary }}
                    />
                    <span className="font-medium" style={{ color: `${t.textSecondary}99` }}>USD</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold px-1">
                    <span style={{ color: t.textSecondary }}>Your Balance</span>
                    <span className="text-[#5bcfc5]">$ 456,345.62</span>
                  </div>
                </div>
              </div>

              {/* Transfer button */}
              <button
                onClick={handleTransfer}
                disabled={transferStatus === "processing"}
                className={`w-full mt-6 bg-[#5bcfc5] hover:bg-[#4bc0b6] text-[#171622] font-semibold py-4 rounded-xl text-center uppercase tracking-wider text-[15px] transition-all duration-300 ${transferStatus === "processing" ? "opacity-75 cursor-not-allowed" : "shadow-lg shadow-[#5bcfc5]/15"
                  }`}
              >
                {transferStatus === "idle" && "Transfer Now"}
                {transferStatus === "processing" && "Processing..."}
                {transferStatus === "success" && "✓ Transfer Successful!"}
              </button>
            </div>

          </div>

          {/* Spendings + Transaction Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Spendings */}
            <div className="lg:col-span-4 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Spendings</h3>
                    <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Lorem ipsum dolor sit amet, consectetur</p>
                  </div>
                  <button className="p-2 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }}>
                    <MoreVertical size={16} />
                  </button>
                </div>

                <div className="space-y-6">
                  {[
                    { label: "Investment", amount: "$1415", total: "/$2000", pct: 45, gradient: "from-[#ac39d4] to-[#f04cf3]" },
                    { label: "Restaurant", amount: "$1567", total: "/$5000", pct: 70, gradient: "from-[#40d4a8] to-[#40e5dc]" },
                    { label: "Installment", amount: "$487", total: "/$10000", pct: 35, gradient: "from-[#1eb6e7] to-[#4aece2]" },
                    { label: "Property", amount: "$3890", total: "/$4000", pct: 95, gradient: "from-[#461ee7] to-[#ba49ff]" },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="h-4 rounded-full overflow-hidden" style={{ background: t.barBg }}>
                        <div
                          className={`h-full bg-gradient-to-r ${item.gradient} rounded-full transition-all duration-500`}
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span style={{ color: t.textMuted }}>{item.label}</span>
                        <span>
                          <span style={{ color: t.textPrimary }}>{item.amount}</span>
                          <span style={{ color: t.textSecondary }}> {item.total}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                className="w-full mt-6 font-semibold py-3.5 rounded-xl transition-all duration-300 text-[14px] border"
                style={{ background: t.cardBg, borderColor: t.accent, color: t.textPrimary }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.accent; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary; }}
              >
                View More
              </button>
            </div>

            {/* Transaction Overview */}
            <div className="lg:col-span-8 rounded-[24px] p-6 flex flex-col justify-between border min-h-[500px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
              <div>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                  <div>
                    <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Transaction Overview</h3>
                    <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Lorem ipsum dolor sit amet, consectetur</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="bg-[#5bcfc5] hover:bg-[#4bc0b6] text-[#171622] font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 text-[13px] transition-all duration-300">
                      <Download size={14} />
                      <span>Download Report</span>
                    </button>
                    <button className="p-2.5 rounded-lg border" style={{ color: t.textSecondary, background: t.innerBg, borderColor: t.borderSoft }}>
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-start gap-4 mb-4">
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                    <span className="size-3.5 rounded-full bg-[#68e365]" />
                    <span>Income</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: t.textPrimary }}>
                    <span className="size-3.5 rounded-full bg-[#fe7d65]" />
                    <span>Outcome</span>
                  </div>
                </div>
              </div>

              <div className="w-full flex-1 relative min-h-[300px] mt-4 flex items-center justify-center">
                <div className="w-full h-full relative">
                  <div className="w-full h-[280px] relative overflow-hidden bg-transparent">
                    <div className="absolute inset-0">
                      <img alt="" className="w-full h-full object-fill opacity-10" src={imgSvgjsLine2631} />
                    </div>
                    <div className="absolute inset-0">
                      <img alt="" className="w-full h-full object-fill opacity-20" src={imgSvgjsG2646} />
                    </div>
                    <div className="absolute inset-0 flex">
                      {[imgClipPathGroup8, imgClipPathGroup9, imgClipPathGroup10, imgClipPathGroup11, imgClipPathGroup12, imgClipPathGroup13, imgClipPathGroup14, imgClipPathGroup15, imgClipPathGroup16, imgClipPathGroup17, imgClipPathGroup18, imgClipPathGroup19].map((img, i) => (
                        <img key={i} alt="" className="absolute inset-0 w-full h-full object-contain" src={img} />
                      ))}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-8 text-[11px]" style={{ color: t.textMuted }}>
                      <span>Sun</span>
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                    </div>
                    <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[11px] py-2" style={{ color: t.textMuted }}>
                      <span>100</span>
                      <span>80</span>
                      <span>60</span>
                      <span>40</span>
                      <span>20</span>
                      <span>0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Previous Transactions Table */}
          <div className="rounded-[24px] p-6 border overflow-hidden" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
              <div>
                <h3 className="text-[18px] font-semibold" style={{ color: t.textPrimary }}>Previous Transactions</h3>
                <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>Lorem ipsum dolor sit amet, consectetur</p>
              </div>

              <div className="flex border-b self-start md:self-auto" style={{ borderColor: t.border }}>
                {["Monthly", "Weekly", "Today"].map((tab) => (
                  <button
                    key={tab}
                    className="px-4 py-2 text-sm font-semibold transition-colors relative"
                    style={{ color: tab === "Monthly" ? "#5bcfc5" : t.textMuted }}
                  >
                    {tab}
                    {tab === "Monthly" && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#5bcfc5] rounded-t-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto w-full scrollbar-thin">
              <table className="w-full min-w-[800px] text-left border-collapse">
                <tbody>
                  {[
                    { icon: imgGroup, iconBg: "rgba(104,227,101,0.1)", name: "XYZ Store ID", sub: "Cashback", date: "June 4, 2020", time: "05:34:45 AM", amount: "+$5,553", status: "Completed", statusColor: "#68e365" },
                    { icon: imgGroup1, iconBg: "rgba(247,43,80,0.15)", name: "Chef Renata", sub: "Transfer", date: "June 5, 2020", time: "05:34:45 AM", amount: "-$167", status: "Pending", statusColor: "#ffa755" },
                    { icon: imgGroup, iconBg: "rgba(104,227,101,0.1)", name: "Cindy Alexandro", sub: "Transfer", date: "June 5, 2020", time: "05:34:45 AM", amount: "+$5,553", status: "Canceled", statusColor: "#f72b50" },
                    { icon: imgGroup, iconBg: "rgba(104,227,101,0.1)", name: "Paipal", sub: "Transfer", date: "June 4, 2020", time: "05:34:45 AM", amount: "+$5,553", status: "Completed", statusColor: "#68e365" },
                    { icon: imgGroup1, iconBg: "rgba(247,43,80,0.15)", name: "Hawkins Jr.", sub: "Cashback", date: "June 4, 2020", time: "05:34:45 AM", amount: "+$5,553", status: "Canceled", statusColor: "#f72b50" },
                  ].map((row, i) => (
                    <tr
                      key={i}
                      className="transition-colors group"
                      style={{ borderBottom: `1px solid ${t.borderCard}` }}
                    >
                      <td className="py-4 pl-2 pr-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center rounded-[12px] size-12 flex-shrink-0" style={{ backgroundColor: row.iconBg }}>
                            <img alt="" className="size-[20px]" src={row.icon} />
                          </div>
                          <div>
                            <p className="font-semibold text-[15px] group-hover:text-[#5bcfc5] transition-colors" style={{ color: t.textPrimary }}>{row.name}</p>
                            <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>{row.sub}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[15px]" style={{ color: t.textPrimary }}>{row.date}</p>
                        <p className="text-[13px] mt-0.5" style={{ color: t.textSecondary }}>{row.time}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-[15px] font-sans" style={{ color: t.textPrimary }}>{row.amount}</p>
                      </td>
                      <td className="py-4 px-4 text-right pr-6">
                        <span
                          className="font-semibold text-[15px] px-3.5 py-1.5 rounded-full inline-block text-xs uppercase tracking-wide border border-current"
                          style={{ color: row.statusColor, backgroundColor: `${row.statusColor}10` }}
                        >
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Virtual Assistant Banner + Bottom Stats Cards */}
          <div className="space-y-6">

            {/* Banner */}
            <div className="bg-gradient-to-r from-[#0f6a62] to-[#084355] border border-[#5bcfc5]/10 rounded-[24px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/5 border border-white/10 pointer-events-none"></div>

              <div className="bg-black/25 rounded-2xl size-20 sm:size-24 flex items-center justify-center flex-shrink-0 border border-white/10">
                <img alt="" className="w-[32px] h-[34px] group-hover:scale-110 transition-transform" src={imgGroup2} />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-white text-[20px] sm:text-[22px] font-semibold leading-tight">
                  Get managed by Dompet's Virtual Assistant
                </h3>
                <p className="text-white/80 text-[14px] mt-2 max-w-[650px] leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                </p>
                <button className="text-[#5bcfc5] hover:text-[#4bc0b6] text-[14px] font-semibold mt-4 block">
                  Learn more &gt;&gt;
                </button>
              </div>
            </div>

            {/* Grid stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {/* Total Transactions */}
              <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[170px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
                <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Total Transactions</span>
                <div className="flex justify-between items-end">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[32px] font-bold font-sans" style={{ color: t.textPrimary }}>98k</span>
                    <span className="text-[#68e365] text-[14px] font-extrabold font-sans">+0.5%</span>
                  </div>
                  <div className="flex items-end gap-2.5">
                    {[44, 61, 88, 55].map((h, i) => (
                      <div key={i} className="h-20 w-2.5 rounded-full overflow-hidden relative" style={{ background: t.barBg }}>
                        <div className="absolute bg-[#5bcfc5] w-full bottom-0 rounded-full" style={{ height: `${h}%` }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoice Remaining */}
              <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[170px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
                <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Invoice Remaining</span>
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[32px] font-bold font-sans" style={{ color: t.textPrimary }}>854</span>
                    <span className="text-[#f72b50] text-[13px] font-semibold">-0,8%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: t.barBg }}>
                    <div className="bg-[#5bcfc5] h-full rounded-full" style={{ width: "45%" }} />
                  </div>
                  <span className="text-xs block font-medium" style={{ color: t.textSecondary }}>from last month</span>
                </div>
              </div>

              {/* Invoice Sent */}
              <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[164px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
                <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Invoice Sent</span>
                <div>
                  <span className="text-[32px] font-bold font-sans block leading-none" style={{ color: t.textPrimary }}>456</span>
                  <span className="bg-[#68e365]/10 border border-[#68e365]/25 text-[#68e365] text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-block mt-3.5">
                    +0.5%
                  </span>
                </div>
              </div>

              {/* Invoice Completed */}
              <div className="border rounded-[24px] p-6 flex flex-col justify-between h-[164px]" style={{ background: t.cardBg, borderColor: t.borderCard, transition: "background 0.4s ease" }}>
                <span className="text-[14px] font-semibold uppercase leading-tight" style={{ color: `${t.textPrimary}cc` }}>Invoice Completed</span>
                <div>
                  <span className="text-[32px] font-bold font-sans block leading-none" style={{ color: t.textPrimary }}>1467</span>
                  <span className="bg-[#f72b50]/10 border border-[#f72b50]/25 text-[#f72b50] text-[11px] font-extrabold px-2.5 py-1 rounded-full inline-block mt-3.5">
                    -6.4%
                  </span>
                </div>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}
