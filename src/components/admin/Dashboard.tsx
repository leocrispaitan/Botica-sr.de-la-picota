import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  TrendingUp,
  Mail,
  //MessageSquare,
  Bell,
  Search,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  LogOut,
  Settings,
  User,
  Package,
  ShoppingBag,
  DollarSign,
  BarChart2,
  Users,
  Warehouse,
  Truck,
  FileBarChart,
  Tags,
  Building2,
  Pill,
  FlaskConical,
  Boxes,
  ListChecks,
  TrendingDown,
  ClipboardList,
  Shield,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { usePermissions } from "../../hooks/usePermissions";
import UsersManagement from "./UsersManagement";
import ProductsManagement from "./ProductsManagement";
import CategoriesManagement from "./CategoriesManagement";
import LotesManagement from "./LotesManagement";
import StockCriticoManagement from "./StockCriticoManagement";
import NewPurchase from "./NewPurchase";
import PurchaseHistory from "./PurchaseHistory";
import SuppliersManagement from "./SuppliersManagement";
import NewSale from "./NewSale";
import SalesHistory from "./SalesHistory";
import CustomersManagement from "./CustomersManagement";
import FormasFarmaceuticasManagement from "./FormasFarmaceuticasManagement";
import ViasAdministracionManagement from "./ViasAdministracionManagement";
import MetodosPagoManagement from "./MetodosPagoManagement";
import LaboratoriosManagement from "./LaboratoriosManagement";
import ReportesVentas from "./ReportesVentas";
import ReportesInventario from "./ReportesInventario";
import ReportesMovimientos from "./ReportesMovimientos";
import MiPerfil from "../shared/MiPerfil";
import SolicitudesRegistro from "./SolicitudesRegistro";
import AdminDashboard from "./AdminDashboard";
import GeminiAIAssistant from "./GeminiAIAssistant";

import {
  // imgCanvas,
  imgRectangle,
  // imgRectangle1,
  // imgRectangle2,
  // imgRectangle3,
  // imgRectangle4,
  // imgRectangle5,
  // imgRectangle6,
  // imgSvgjsLine2553,
  // imgSvgjsG2566,
  // imgClipPathGroup,
  // imgClipPathGroup1,
  // imgClipPathGroup2,
  // imgClipPathGroup3,
  // imgClipPathGroup4,
  // imgClipPathGroup5,
  // imgClipPathGroup6,
  // imgClipPathGroup7,
  // imgSvgjsLine2631,
  // imgSvgjsG2646,
  // imgClipPathGroup8,
  // imgClipPathGroup9,
  // imgClipPathGroup10,
  // imgClipPathGroup11,
  // imgClipPathGroup12,
  // imgClipPathGroup13,
  // imgClipPathGroup14,
  // imgClipPathGroup15,
  // imgClipPathGroup16,
  // imgClipPathGroup17,
  // imgClipPathGroup18,
  // imgClipPathGroup19,
} from "../shared/assets";

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
  // ═══ Autenticación ═══
  const { user, logout: authLogout } = useAuth();
  
  // ═══ Permisos ═══
  const { canViewMenu, canViewSubmenu, getDefaultMenu, isAdmin, isVendedor, isAlmacenero } = usePermissions();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // ═══ Inicializar activeMenu según el rol del usuario ═══
  const defaultMenu = getDefaultMenu();
  const [activeMenu, setActiveMenu] = useState(defaultMenu);
  
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
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
  
  // ═══ Flyout Menu States ═══
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const [flyoutMenuPos, setFlyoutMenuPos] = useState({ top: 0, left: 0 });
  const flyoutMenuRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const closeTimeoutRef = useRef<number | null>(null);

  // ═══ Datos del usuario autenticado ═══
  const userName = user?.nombre_completo || "Usuario";
  const userEmail = user?.email || "usuario@botica.com";
  const userPhoto = user?.foto_perfil_url || imgRectangle;
  const userRole = user?.rol?.nombre_rol || "USUARIO";
  
  // ═══ Colores del badge según rol ═══
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

  // ═══ Funciones para manejar el flyout menu ═══
  const openFlyoutMenu = (menuName: string, rect: DOMRect) => {
    // Cancelar cualquier timeout de cierre pendiente
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    setFlyoutMenuPos({
      top: rect.top,
      left: rect.right + 8,
    });
    setHoveredMenuItem(menuName);
  };

  const closeFlyoutMenu = () => {
    // Cerrar inmediatamente sin delay
    setHoveredMenuItem(null);
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const scheduleCloseFlyout = () => {
    // Programar cierre con delay más largo
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }
    
    closeTimeoutRef.current = window.setTimeout(() => {
      setHoveredMenuItem(null);
    }, 200); // 200ms delay
  };

  const cancelCloseFlyout = () => {
    // Cancelar el cierre programado
    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // ═══ Función para manejar logout ═══
  const handleLogout = async () => {
    setLogoutAnimating(true);
    try {
      // El logout del hook ahora maneja todo automáticamente
      await authLogout();
      setTimeout(() => {
        setShowLogoutConfirm(false);
        setLogoutAnimating(false);
        if (onLogout) onLogout();
      }, 700);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      setLogoutAnimating(false);
    }
  };

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

  const menuItems = [
    { 
      name: "Dashboard", 
      icon: LayoutDashboard,
      path: "Dashboard"
    },
    { 
      name: "Inventario", 
      icon: Warehouse,
      submenu: [
        { name: "Productos", icon: Package, path: "Productos" },
        { name: "Categorías", icon: Tags, path: "Categorias" },
        { name: "Lotes", icon: Boxes, path: "Lotes" },
        { name: "Stock Crítico", icon: TrendingDown, path: "StockCritico" },
      ]
    },
    { 
      name: "Compras", 
      icon: ShoppingBag,
      submenu: [
        { name: "Nueva Compra", icon: ShoppingBag, path: "NuevaCompra" },
        { name: "Historial", icon: ClipboardList, path: "HistorialCompras" },
        { name: "Proveedores", icon: Truck, path: "Proveedores" },
      ]
    },
    { 
      name: "Ventas", 
      icon: DollarSign,
      submenu: [
        { name: "Nueva Venta", icon: DollarSign, path: "NuevaVenta" },
        { name: "Historial", icon: FileBarChart, path: "HistorialVentas" },
        { name: "Clientes", icon: Users, path: "Clientes" },
      ]
    },
    { 
      name: "Catálogos", 
      icon: ListChecks,
      submenu: [
        { name: "Formas Farm.", icon: Pill, path: "FormasFarmaceuticas" },
        { name: "Vías Admin.", icon: FlaskConical, path: "ViasAdministracion" },
        { name: "Laboratorios", icon: Building2, path: "Laboratorios" },
        { name: "Métodos Pago", icon: DollarSign, path: "MetodosPago" },
      ]
    },
    { 
      name: "Reportes", 
      icon: BarChart2,
      submenu: [
        { name: "Ventas", icon: TrendingUp, path: "ReportesVentas" },
        { name: "Inventario", icon: Package, path: "ReportesInventario" },
        { name: "Movimientos", icon: FileBarChart, path: "ReportesMovimientos" },
      ]
    },
    { 
      name: "Usuarios", 
      icon: Users,
      path: "Usuarios"
    },
    { 
      name: "Configuración", 
      icon: Settings,
      submenu: [
        { name: "General", icon: Settings, path: "ConfigGeneral" },
        { name: "Roles", icon: Shield, path: "ConfigRoles" },
      ]
    },
    // Menú especial - No se muestra en sidebar pero debe pasar validación de permisos
    { 
      name: "MiPerfil", 
      icon: User,
      path: "MiPerfil",
      hidden: true // Marca para ocultar en el sidebar
    },
  ];

  const toggleSubmenu = (menuName: string) => {
    if (expandedMenus.includes(menuName)) {
      setExpandedMenus(expandedMenus.filter(m => m !== menuName));
    } else {
      setExpandedMenus([...expandedMenus, menuName]);
    }
  };

  // ═══ Filtrar menú según permisos del usuario ═══
  const menuItemsAutorizados = menuItems.filter(item => {
    // Verificar si el usuario tiene permiso para ver este menú
    return canViewMenu(item.name);
  }).map(item => {
    // Si el item tiene submenu, filtrarlo también
    if ('submenu' in item && item.submenu) {
      const submenuFiltrado = item.submenu.filter(subItem => 
        canViewSubmenu(item.name, subItem.name)
      );
      
      // Si después del filtro no queda ningún submenu, no mostrar el item
      if (submenuFiltrado.length === 0) {
        return null;
      }
      
      return {
        ...item,
        submenu: submenuFiltrado
      };
    }
    return item;
  }).filter((item): item is NonNullable<typeof item> => item !== null); // Type guard para eliminar nulls

  const menuItemsFiltrados = menuItemsAutorizados.filter(item => {
    // Excluir items marcados como hidden solo del sidebar, no de la validación de acceso
    return !('hidden' in item && item.hidden);
  });

  // ═══ Debug: Mostrar información de permisos (solo en desarrollo) ═══
  useEffect(() => {
    console.log('🔐 [Dashboard] Información de permisos:', {
      userRole,
      isAdmin,
      isVendedor,
      isAlmacenero,
      defaultMenu,
      activeMenu,
      menuItemsOriginales: menuItems.length,
      menuItemsAutorizados: menuItemsAutorizados.length,
      menuItemsFiltrados: menuItemsFiltrados.length,
    });
  }, [
    userRole,
    isAdmin,
    isVendedor,
    isAlmacenero,
    defaultMenu,
    activeMenu,
    menuItems.length,
    menuItemsAutorizados.length,
    menuItemsFiltrados.length,
  ]);

  // ═══ Protección: Verificar si el usuario tiene acceso al menú activo ═══
  useEffect(() => {
    // Verificar si el activeMenu actual es accesible para el usuario
    const tieneAcceso = menuItemsAutorizados.some(item => {
      // Verificar si es un item directo
      if ('path' in item && item.path === activeMenu) {
        return true;
      }
      // Verificar si está en algún submenu
      if ('submenu' in item && item.submenu) {
        return item.submenu.some(subItem => subItem.path === activeMenu);
      }
      // Verificar si es el nombre del menú principal
      if (item.name === activeMenu) {
        return true;
      }
      return false;
    });

    // Si no tiene acceso, redirigir al menú predeterminado
    if (!tieneAcceso && activeMenu !== defaultMenu) {
      console.warn(`⚠️ Usuario sin acceso a "${activeMenu}", redirigiendo a "${defaultMenu}"`);
      setActiveMenu(defaultMenu);
    }
  }, [activeMenu, menuItemsAutorizados, defaultMenu]);

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
                position: "relative",
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
                  src={userPhoto}
                  alt={userName}
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
                  {/* Keyframes para el efecto de scroll del nombre */}
                  <style>{`
                    @keyframes scrollName {
                      0%, 20% { transform: translateX(0); }
                      80%, 100% { transform: translateX(calc(-100% + var(--visible-width))); }
                    }
                    .name-scroll-container {
                      position: relative;
                      overflow: hidden;
                      width: 100%;
                    }
                    .name-scroll-text {
                      display: inline-block;
                      white-space: nowrap;
                      animation: scrollName 8s ease-in-out infinite;
                      padding-right: 20px;
                    }
                    .name-scroll-container:hover .name-scroll-text {
                      animation-play-state: running;
                    }
                  `}</style>
                  
                  <div className="flex-1 min-w-0 text-left">
                    {/* Nombre con efecto de scroll */}
                    <div className="name-scroll-container" style={{ '--visible-width': '140px' } as React.CSSProperties}>
                      <p className="name-scroll-text font-semibold text-[15px] leading-tight" style={{ color: t.textPrimary }}>
                        Hola, {userName}
                      </p>
                    </div>
                    
                    {/* Email */}
                    <p className="font-normal text-[12px] truncate mt-0.5" style={{ color: t.textSecondary }}>
                      {userEmail}
                    </p>
                    
                    {/* Badge de rol - debajo del email */}
                    <div style={{ marginTop: '6px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          padding: '3px 7px',
                          borderRadius: '6px',
                          background: roleBadge.bg,
                          color: roleBadge.text,
                          border: `1px solid ${roleBadge.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>{roleBadge.icon}</span>
                        {userRole.replace('ADMINISTRATIVO', 'ADMIN').substring(0, 10)}
                      </span>
                    </div>
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
                    padding: "14px 16px",
                    borderBottom: `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`,
                    marginBottom: "4px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    animation: "profileMenuItemFade 0.3s ease 0.05s both",
                  }}
                >
                  <img
                    src={userPhoto}
                    alt={userName}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: `2px solid ${t.accent}`,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    {/* Nombre con scroll */}
                    <div style={{ 
                      position: 'relative',
                      overflow: 'hidden',
                      marginBottom: '6px',
                    }}>
                      <p style={{ 
                        fontSize: "13px", 
                        fontWeight: 600, 
                        color: t.textPrimary, 
                        lineHeight: 1.3,
                        whiteSpace: "nowrap",
                        display: "inline-block",
                        animation: userName.length > 20 ? "scrollName 8s ease-in-out infinite" : "none",
                        paddingRight: userName.length > 20 ? "20px" : "0",
                      }}>
                        {userName}
                      </p>
                    </div>
                    
                    {/* Email y estado en línea */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <span style={{ 
                        fontSize: "11px", 
                        color: t.textSecondary,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: 1,
                      }}>
                        {userEmail}
                      </span>
                      <span style={{ 
                        fontSize: "10px", 
                        color: t.accent, 
                        lineHeight: 1.3,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        flexShrink: 0,
                      }}>
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: "#68e365",
                          boxShadow: "0 0 0 2px rgba(104, 227, 101, 0.2)",
                        }} />
                        En línea
                      </span>
                    </div>
                    
                    {/* Badge de rol - ahora debajo */}
                    <div>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.05em',
                          textTransform: 'uppercase',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: roleBadge.bg,
                          color: roleBadge.text,
                          border: `1px solid ${roleBadge.border}`,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <span style={{ fontSize: '10px' }}>{roleBadge.icon}</span>
                        {userRole}
                      </span>
                    </div>
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
                    action: () => { 
                      console.log('🔍 [Dashboard] Botón Mi Perfil clickeado');
                      setProfileMenuOpen(false); 
                      setActiveMenu("MiPerfil"); 
                      console.log('✅ [Dashboard] activeMenu actualizado a: MiPerfil');
                    },
                  },
                  {
                    icon: LogOut,
                    label: "Cerrar Sesión",
                    subtitle: "Salir del sistema",
                    color: "#ef4444",
                    colorBg: isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)",
                    hoverBg: isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.05)",
                    delay: "0.12s",
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
                        marginBottom: idx < 1 ? "2px" : "0",
                        ...(idx === 1 ? {
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
            {menuItemsFiltrados.map((item) => {
              const Icon = item.icon;
              const hasSubmenu = 'submenu' in item && item.submenu && item.submenu.length > 0;
              const isExpanded = expandedMenus.includes(item.name);
              // Marcar como activo si es la sección actual O si alguna subsección está activa
              const isActive = activeMenu === ('path' in item ? item.path : item.name) || 
                               (hasSubmenu && item.submenu?.some(sub => sub.path === activeMenu));
              
              return (
                <div key={item.name}>
                  {/* Main Menu Item */}
                  <button
                    ref={(el) => {
                      if (hasSubmenu) {
                        menuItemRefs.current[item.name] = el;
                      }
                    }}
                    onClick={() => {
                      if (hasSubmenu) {
                        // En modo colapsado, solo mostrar flyout sin cambiar activeMenu
                        if (sidebarCollapsed) {
                          // El click no hace nada, solo el hover
                          return;
                        }
                        // En modo expandido, comportamiento normal
                        setActiveMenu(item.name);
                        toggleSubmenu(item.name);
                        if (!isExpanded) {
                          setExpandedMenus([...expandedMenus, item.name]);
                        }
                      } else {
                        const menuPath = 'path' in item ? item.path || item.name : item.name;
                        setActiveMenu(menuPath);
                        if (window.innerWidth < 1024) setSidebarOpen(false);
                      }
                    }}
                    onMouseEnter={(e) => {
                      // Mostrar flyout menu si el sidebar está colapsado y tiene submenu
                      if (sidebarCollapsed && hasSubmenu) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        openFlyoutMenu(item.name, rect);
                      }
                      
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = t.hoverBg;
                        (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                      }
                    }}
                    onMouseLeave={(e) => {
                      // Programar cierre del flyout
                      if (sidebarCollapsed && hasSubmenu) {
                        scheduleCloseFlyout();
                      }
                      
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = t.inactiveItemText;
                      }
                    }}
                    className={`w-full flex items-center transition-all duration-200 group ${
                      sidebarCollapsed
                        ? "px-0 justify-center h-12 rounded-xl"
                        : "px-4 py-3.5 justify-between rounded-xl"
                    }`}
                    style={{
                      background: isActive ? t.activeItemBg : "transparent",
                      color: isActive ? t.activeItemText : t.inactiveItemText,
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {sidebarCollapsed ? (
                      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={20} className="transition-colors flex-shrink-0" />
                        {/* Tooltip con el nombre cuando está colapsado */}
                        {!hasSubmenu && (
                          <span
                            style={{
                              position: "absolute",
                              left: "calc(100% + 12px)",
                              whiteSpace: "nowrap",
                              padding: "6px 12px",
                              borderRadius: "8px",
                              fontSize: "12px",
                              fontWeight: 500,
                              background: isDark
                                ? "linear-gradient(145deg, rgba(33,33,48,0.97), rgba(21,20,31,0.97))"
                                : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
                              border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.8)"}`,
                              boxShadow: isDark
                                ? "0 8px 16px -4px rgba(0,0,0,0.4)"
                                : "0 8px 16px -4px rgba(0,0,0,0.1)",
                              color: t.textPrimary,
                              opacity: 0,
                              pointerEvents: "none",
                              transform: "translateX(-8px)",
                              transition: "all 0.2s ease",
                              zIndex: 10000,
                            }}
                            className="group-hover:opacity-100 group-hover:translate-x-0"
                          >
                            {item.name}
                          </span>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3.5 min-w-0">
                          <Icon size={20} className="transition-colors flex-shrink-0" />
                          <span className="text-[15px] truncate">{item.name}</span>
                        </div>
                        {hasSubmenu ? (
                          <ChevronDown
                            size={14}
                            className={`transition-transform duration-200 flex-shrink-0 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            style={{ color: isActive ? t.activeItemText : `${t.textSecondary}80` }}
                          />
                        ) : (
                          <ChevronRight
                            size={14}
                            className="transition-transform duration-200 flex-shrink-0"
                            style={{ color: isActive ? t.activeItemText : `${t.textSecondary}80` }}
                          />
                        )}
                      </>
                    )}
                  </button>

                  {/* Submenu Items */}
                  {hasSubmenu && isExpanded && !sidebarCollapsed && (
                    <div
                      className="relative mt-2 mb-2 space-y-0.5"
                      style={{
                        animation: "slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        paddingLeft: "24px",
                      }}
                    >
                      <style>{`
                        @keyframes slideDown {
                          from {
                            opacity: 0;
                            transform: translateY(-8px);
                            max-height: 0;
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0);
                            max-height: 500px;
                          }
                        }
                        @keyframes pulseGlow {
                          0%, 100% {
                            box-shadow: 0 0 0 0 ${t.accent}40;
                          }
                          50% {
                            box-shadow: 0 0 10px 2px ${t.accent}30;
                          }
                        }
                        @keyframes slideInRight {
                          from {
                            opacity: 0;
                            transform: translateX(-4px);
                          }
                          to {
                            opacity: 1;
                            transform: translateX(0);
                          }
                        }
                      `}</style>
                      
                      {/* Vertical Timeline Line - Mejorada */}
                      <div
                        style={{
                          position: "absolute",
                          left: "18px",
                          top: "8px",
                          bottom: "8px",
                          width: "2px",
                          background: isDark 
                            ? `linear-gradient(180deg, ${t.accent}50 0%, ${t.accent}30 50%, ${t.accent}15 100%)`
                            : `linear-gradient(180deg, ${t.accent}40 0%, ${t.accent}25 50%, ${t.accent}10 100%)`,
                          borderRadius: "2px",
                          zIndex: 0,
                          boxShadow: `0 0 8px ${t.accent}20`,
                        }}
                      />

                      {item.submenu?.map((subItem, idx) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeMenu === subItem.path;
                        
                        return (
                          <div 
                            key={subItem.path} 
                            style={{ 
                              position: "relative", 
                              zIndex: 1,
                              animation: `slideInRight 0.3s ease ${idx * 0.05}s both`,
                            }}
                          >
                            <button
                              onClick={() => {
                                setActiveMenu(subItem.path);
                                if (window.innerWidth < 1024) setSidebarOpen(false);
                              }}
                              className="w-full flex items-center py-2.5 px-3 rounded-xl transition-all duration-300 group relative"
                              style={{
                                background: isSubActive 
                                  ? isDark
                                    ? `linear-gradient(90deg, ${t.accent}15 0%, ${t.accent}08 100%)`
                                    : `linear-gradient(90deg, ${t.accent}12 0%, ${t.accent}06 100%)`
                                  : "transparent",
                                color: isSubActive ? t.accent : t.inactiveItemText,
                                fontWeight: isSubActive ? 600 : 400,
                                marginLeft: "8px",
                                transform: isSubActive ? "translateX(2px)" : "translateX(0)",
                                border: isSubActive 
                                  ? `1px solid ${t.accent}20` 
                                  : "1px solid transparent",
                              }}
                              onMouseEnter={(e) => {
                                if (!isSubActive) {
                                  (e.currentTarget as HTMLButtonElement).style.background = isDark
                                    ? `linear-gradient(90deg, ${t.accent}08 0%, ${t.accent}04 100%)`
                                    : `linear-gradient(90deg, ${t.accent}06 0%, ${t.accent}03 100%)`;
                                  (e.currentTarget as HTMLButtonElement).style.color = t.textPrimary;
                                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                                  (e.currentTarget as HTMLButtonElement).style.border = `1px solid ${t.accent}15`;
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSubActive) {
                                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                                  (e.currentTarget as HTMLButtonElement).style.color = t.inactiveItemText;
                                  (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)";
                                  (e.currentTarget as HTMLButtonElement).style.border = "1px solid transparent";
                                }
                              }}
                            >
                              {/* Connection Branch - Mejorada al lado derecho de la línea */}
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-8px",
                                  top: "50%",
                                  width: "12px",
                                  height: "2px",
                                  background: isSubActive 
                                    ? t.accent
                                    : isDark ? `${t.accent}35` : `${t.accent}30`,
                                  transform: "translateY(-50%)",
                                  borderRadius: "0 2px 2px 0",
                                  transition: "all 0.3s ease",
                                  boxShadow: isSubActive ? `0 0 8px ${t.accent}60` : "none",
                                }}
                              />

                              {/* Timeline Node - Mejorado */}
                              <div
                                style={{
                                  position: "absolute",
                                  left: "-13px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  width: isSubActive ? "12px" : "8px",
                                  height: isSubActive ? "12px" : "8px",
                                  borderRadius: "50%",
                                  background: isSubActive 
                                    ? t.accent 
                                    : isDark ? `${t.accent}30` : `${t.accent}25`,
                                  border: isSubActive 
                                    ? `2px solid ${isDark ? t.accent : t.accent}` 
                                    : `2px solid ${isDark ? `${t.accent}20` : `${t.accent}15`}`,
                                  boxShadow: isSubActive 
                                    ? `0 0 12px ${t.accent}80, 0 0 4px ${t.accent}, inset 0 0 4px ${t.accent}40` 
                                    : "none",
                                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                  animation: isSubActive ? "pulseGlow 2s infinite" : "none",
                                  zIndex: 2,
                                }}
                              >
                                {/* Inner glow for active state */}
                                {isSubActive && (
                                  <div
                                    style={{
                                      position: "absolute",
                                      inset: "2px",
                                      borderRadius: "50%",
                                      background: `radial-gradient(circle, ${t.accent} 0%, transparent 70%)`,
                                    }}
                                  />
                                )}
                              </div>

                              {/* Icon Container - Mejorado */}
                              <div
                                style={{
                                  width: "36px",
                                  height: "36px",
                                  borderRadius: "11px",
                                  background: isSubActive
                                    ? isDark
                                      ? `linear-gradient(135deg, ${t.accent}20 0%, ${t.accent}12 100%)`
                                      : `linear-gradient(135deg, ${t.accent}15 0%, ${t.accent}08 100%)`
                                    : isDark 
                                      ? "rgba(255,255,255,0.04)" 
                                      : "rgba(0,0,0,0.03)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginRight: "12px",
                                  flexShrink: 0,
                                  transition: "all 0.3s ease",
                                  border: isSubActive 
                                    ? `1px solid ${t.accent}30` 
                                    : isDark
                                      ? "1px solid rgba(255,255,255,0.02)"
                                      : "1px solid rgba(0,0,0,0.02)",
                                  boxShadow: isSubActive 
                                    ? `0 2px 8px ${t.accent}15, inset 0 1px 0 rgba(255,255,255,0.1)` 
                                    : "none",
                                }}
                              >
                                <SubIcon 
                                  size={17} 
                                  style={{ 
                                    transition: "all 0.3s ease",
                                    strokeWidth: isSubActive ? 2.5 : 2,
                                  }} 
                                />
                              </div>

                              {/* Label - Mejorado */}
                              <span 
                                className="text-[14px] truncate flex-1"
                                style={{
                                  letterSpacing: isSubActive ? "0.01em" : "0",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                {subItem.name}
                              </span>

                              {/* Active Indicator - Mejorado */}
                              {isSubActive && (
                                <div
                                  style={{
                                    width: "4px",
                                    height: "20px",
                                    background: `linear-gradient(180deg, ${t.accent} 0%, ${t.accent}70 100%)`,
                                    borderRadius: "4px 0 0 4px",
                                    marginLeft: "8px",
                                    boxShadow: `-3px 0 12px ${t.accent}40`,
                                    animation: "pulseGlow 2s infinite",
                                  }}
                                />
                              )}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
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
                  onClick={handleLogout}
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
        </div>
      </aside>

      {/* ═══ Flyout Menu - Mostrar submenu cuando el sidebar está colapsado ═══ */}
      {sidebarCollapsed && hoveredMenuItem && (
        <>
          {/* Área invisible de puente entre el botón y el flyout */}
          <div
            style={{
              position: "fixed",
              top: `${flyoutMenuPos.top - 10}px`,
              left: `${flyoutMenuPos.left - 20}px`,
              width: "30px",
              height: `${Math.min(400, window.innerHeight - flyoutMenuPos.top - 20)}px`,
              zIndex: 9998,
              pointerEvents: "auto",
            }}
            onMouseEnter={() => {
              cancelCloseFlyout();
            }}
            onMouseLeave={() => {
              scheduleCloseFlyout();
            }}
          />
          
          <div
            ref={flyoutMenuRef}
            onMouseEnter={() => {
              // Cancelar el cierre programado cuando el mouse entra al flyout
              cancelCloseFlyout();
            }}
            onMouseLeave={() => {
              // Cerrar inmediatamente cuando el mouse sale del flyout
              closeFlyoutMenu();
            }}
            style={{
              position: "fixed",
              top: `${flyoutMenuPos.top}px`,
              left: `${flyoutMenuPos.left}px`,
              zIndex: 9999,
              minWidth: "240px",
              maxWidth: "280px",
              borderRadius: "18px",
              padding: "8px",
              background: isDark
                ? "linear-gradient(145deg, rgba(33,33,48,0.97), rgba(21,20,31,0.97))"
                : "linear-gradient(145deg, rgba(255,255,255,0.98), rgba(248,250,252,0.98))",
              border: `1px solid ${isDark ? "rgba(46,46,66,0.5)" : "rgba(220,222,235,0.8)"}`,
              boxShadow: isDark
                ? "0 20px 48px -8px rgba(0,0,0,0.55), 0 8px 16px -4px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)"
                : "0 20px 48px -8px rgba(0,0,0,0.10), 0 8px 16px -4px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              animation: "flyoutSlideIn 0.2s cubic-bezier(.22,1,.36,1) both",
              pointerEvents: "auto",
            }}
          >
          <style>{`
            @keyframes flyoutSlideIn {
              from { 
                opacity: 0; 
                transform: translateX(-8px) scale(0.96); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0) scale(1); 
              }
            }
            @keyframes flyoutItemFade {
              from { 
                opacity: 0; 
                transform: translateX(-6px); 
              }
              to { 
                opacity: 1; 
                transform: translateX(0); 
              }
            }
          `}</style>

          {/* Header con el nombre del menú */}
          <div
            style={{
              padding: "12px 14px",
              borderBottom: `1px solid ${isDark ? "rgba(46,46,66,0.4)" : "rgba(220,222,235,0.6)"}`,
              marginBottom: "6px",
            }}
          >
            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: t.accent,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              {(() => {
                const currentItem = menuItems.find(item => item.name === hoveredMenuItem);
                if (currentItem) {
                  const Icon = currentItem.icon;
                  return (
                    <>
                      <Icon size={16} />
                      {currentItem.name}
                    </>
                  );
                }
                return null;
              })()}
            </p>
          </div>

          {/* Submenu items */}
          {(() => {
            const currentItem = menuItems.find(item => item.name === hoveredMenuItem);
            if (currentItem && 'submenu' in currentItem && currentItem.submenu) {
              return currentItem.submenu.map((subItem, idx) => {
                const SubIcon = subItem.icon;
                const isSubActive = activeMenu === subItem.path;
                
                return (
                  <button
                    key={subItem.path}
                    onClick={() => {
                      setActiveMenu(subItem.path);
                      closeFlyoutMenu(); // Cerrar inmediatamente al hacer click
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "10px 14px",
                      borderRadius: "12px",
                      border: "none",
                      background: isSubActive 
                        ? (isDark ? "rgba(91,207,197,0.12)" : "rgba(91,207,197,0.08)")
                        : "transparent",
                      cursor: "pointer",
                      fontFamily: "'Cairo', sans-serif",
                      transition: "all 0.2s ease",
                      animation: `flyoutItemFade 0.3s ease ${idx * 0.05}s both`,
                      marginBottom: idx < (currentItem.submenu!.length - 1) ? "2px" : "0",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = isDark
                          ? "rgba(91,207,197,0.06)"
                          : "rgba(91,207,197,0.04)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateX(4px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateX(0)";
                      }
                    }}
                  >
                    {/* Icon Container */}
                    <span
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "11px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isSubActive
                          ? (isDark ? `linear-gradient(135deg, ${t.accent}20 0%, ${t.accent}12 100%)` : `linear-gradient(135deg, ${t.accent}15 0%, ${t.accent}08 100%)`)
                          : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                        color: isSubActive ? t.accent : t.textSecondary,
                        flexShrink: 0,
                        transition: "all 0.2s ease",
                        border: isSubActive 
                          ? `1px solid ${t.accent}30` 
                          : (isDark ? "1px solid rgba(255,255,255,0.02)" : "1px solid rgba(0,0,0,0.02)"),
                      }}
                    >
                      <SubIcon size={17} />
                    </span>
                    
                    {/* Label */}
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: isSubActive ? 600 : 400,
                        color: isSubActive ? t.accent : t.textPrimary,
                        flex: 1,
                        textAlign: "left",
                      }}
                    >
                      {subItem.name}
                    </span>

                    {/* Active indicator */}
                    {isSubActive && (
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: t.accent,
                          boxShadow: `0 0 8px ${t.accent}60`,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </button>
                );
              });
            }
            return null;
          })()}
        </div>
        </>
      )}

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

              <button 
                onClick={() => setActiveMenu("SolicitudesRegistro")}
                className="p-2.5 rounded-xl border transition-colors relative" 
                style={{ color: t.textPrimary, background: t.innerBg, borderColor: t.borderSoft }}
              >
                <Mail size={18} />
                <span className="absolute -top-1 -right-1 bg-[#5bcfc5] text-[#171622] text-[10px] font-bold rounded-full size-4 flex items-center justify-center">
                  2
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
        <main className="flex-1 overflow-y-auto" style={{ background: t.mainBg, transition: "background 0.4s ease" }}>
          
          {/* Render content based on activeMenu */}
          {activeMenu === "MiPerfil" ? (
            <>
              {console.log('🔍 [Dashboard] Renderizando MiPerfil')}
              <MiPerfil isDark={isDark} />
            </>
          ) : activeMenu === "SolicitudesRegistro" ? (
            <SolicitudesRegistro isDark={isDark} />
          ) : activeMenu === "Usuarios" ? (
            <UsersManagement isDark={isDark} />
          ) : activeMenu === "Productos" ? (
            <ProductsManagement isDark={isDark} />
          ) : activeMenu === "Categorias" ? (
            <CategoriesManagement isDark={isDark} />
          ) : activeMenu === "Lotes" ? (
            <LotesManagement isDark={isDark} />
          ) : activeMenu === "StockCritico" ? (
            <StockCriticoManagement isDark={isDark} />
          ) : activeMenu === "NuevaCompra" ? (
            <NewPurchase isDark={isDark} />
          ) : activeMenu === "HistorialCompras" ? (
            <PurchaseHistory isDark={isDark} />
          ) : activeMenu === "Proveedores" ? (
            <SuppliersManagement isDark={isDark} />
          ) : activeMenu === "NuevaVenta" ? (
            <NewSale isDark={isDark} />
          ) : activeMenu === "HistorialVentas" ? (
            <SalesHistory isDark={isDark} />
          ) : activeMenu === "Clientes" ? (
            <CustomersManagement isDark={isDark} />
          ) : activeMenu === "FormasFarmaceuticas" ? (
            <FormasFarmaceuticasManagement isDark={isDark} />
          ) : activeMenu === "ViasAdministracion" ? (
            <ViasAdministracionManagement isDark={isDark} />
          ) : activeMenu === "MetodosPago" ? (
            <MetodosPagoManagement isDark={isDark} />
          ) : activeMenu === "Laboratorios" ? (
            <LaboratoriosManagement isDark={isDark} />
          ) : activeMenu === "ReportesVentas" ? (
            <ReportesVentas isDark={isDark} />
          ) : activeMenu === "ReportesInventario" ? (
            <ReportesInventario isDark={isDark} />
          ) : activeMenu === "ReportesMovimientos" ? (
            <ReportesMovimientos isDark={isDark} />
          ) : (
            <div className="p-6 space-y-6">
              {/* Banner de Bienvenida según Rol */}
              <div style={{
                background: isVendedor 
                  ? "linear-gradient(135deg, #10b981 0%, #34d399 40%, #059669 100%)"
                  : isAlmacenero 
                  ? "linear-gradient(135deg, #f97316 0%, #fb923c 40%, #ea580c 100%)"
                  : "linear-gradient(135deg, #8b5cf6 0%, #a78bfa 40%, #7c3aed 100%)",
                borderRadius: "24px",
                padding: "32px",
                marginBottom: "24px",
                boxShadow: isVendedor
                  ? "0 8px 24px rgba(16, 185, 129, 0.25)"
                  : isAlmacenero
                  ? "0 8px 24px rgba(249, 115, 22, 0.25)"
                  : "0 8px 24px rgba(139, 92, 246, 0.25)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                position: "relative",
                overflow: "hidden",
              }}>
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
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  position: "relative",
                  zIndex: 1,
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "20px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "40px",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}>
                    {isVendedor ? "💼" : isAlmacenero ? "📦" : "👑"}
                  </div>
                  
                  <div>
                    <h2 style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      color: "#fff",
                      marginBottom: "8px",
                    }}>
                      ¡Bienvenido, {userName}!
                    </h2>
                    <p style={{
                      fontSize: "16px",
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 1.5,
                    }}>
                      {isVendedor && "Panel de Ventas - Gestiona tus ventas y clientes de forma eficiente"}
                      {isAlmacenero && "Panel de Inventario - Controla el stock y gestiona las compras"}
                      {isAdmin && "Panel de Administración - Control total del sistema"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Acceso Rápido según Rol */}
              {isVendedor && (
                <div>
                  <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: 700, 
                    color: t.textPrimary, 
                    marginBottom: "16px" 
                  }}>
                    Acceso Rápido
                  </h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                    gap: "20px" 
                  }}>
                    <button
                      onClick={() => setActiveMenu("NuevaVenta")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <DollarSign size={32} color="#10b981" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Nueva Venta
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Registra una nueva venta en el sistema
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveMenu("HistorialVentas")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <FileBarChart size={32} color="#3b82f6" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Historial de Ventas
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Consulta todas tus ventas realizadas
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveMenu("Clientes")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <Users size={32} color="#8b5cf6" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Clientes
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Gestiona tu cartera de clientes
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {isAlmacenero && (
                <div>
                  <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: 700, 
                    color: t.textPrimary, 
                    marginBottom: "16px" 
                  }}>
                    Acceso Rápido
                  </h3>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                    gap: "20px" 
                  }}>
                    <button
                      onClick={() => setActiveMenu("Productos")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <Package size={32} color="#f97316" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Productos
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Gestiona el inventario de productos
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveMenu("NuevaCompra")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <ShoppingBag size={32} color="#10b981" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Nueva Compra
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Registra compras de mercadería
                      </p>
                    </button>

                    <button
                      onClick={() => setActiveMenu("StockCritico")}
                      style={{
                        padding: "24px",
                        background: t.cardBg,
                        border: `1px solid ${t.borderCard}`,
                        borderRadius: "20px",
                        textAlign: "left",
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-4px)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${t.accent}20`;
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.accent;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                        (e.currentTarget as HTMLButtonElement).style.borderColor = t.borderCard;
                      }}
                    >
                      <TrendingDown size={32} color="#ef4444" style={{ marginBottom: "12px" }} />
                      <h4 style={{ fontSize: "18px", fontWeight: 700, color: t.textPrimary, marginBottom: "8px" }}>
                        Stock Crítico
                      </h4>
                      <p style={{ fontSize: "14px", color: t.textSecondary }}>
                        Productos con stock bajo
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {isAdmin && (
                <AdminDashboard isDark={isDark} setActiveMenu={setActiveMenu} />
              )}
            </div>
          )}

        </main>
      </div>

      {/* ═══ Asistente IA Gemini - Flotante global ═══ */}
      <GeminiAIAssistant isDark={isDark} activeMenu={activeMenu} />

    </div>
  );
}
