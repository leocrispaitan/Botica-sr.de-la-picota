import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Bell,
  ChevronRight,
  ClipboardList,
  CreditCard,
  HelpCircle,
  History,
  LayoutGrid,
  LogOut,
  Menu,
  Pill,
  ReceiptText,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import MenuProductos from "./MenuProductos";
import OrdenActual from "./OrdenActual";
import HistorialVentas from "./HistorialVentas";
import Clientes from "./Clientes";
import PerfilVendedor from "./PerfilVendedor";
import {
  formatCurrency,
  getInitialSelections,
  products,
  type CartItem,
  type CategoryId,
  type PaymentMethod,
  type Product,
  type ProductSelection,
  type SellerView,
} from "./posData";

export default function PuntoVenta() {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState<SellerView>("menu");
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(products[0].id);
  const [selectionByProduct, setSelectionByProduct] = useState(getInitialSelections);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [documentType, setDocumentType] = useState<"Boleta" | "Factura" | "Ticket">("Boleta");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const userName = user?.nombre_completo || "Vendedor";
  const userEmail = user?.email || "vendedor@botica.com";
  const userAvatar =
    user?.foto_perfil_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=0fbf70&color=fff&size=160`;

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "all" || product.category === activeCategory;
      const matchesSearch =
        !normalizedSearch ||
        product.name.toLowerCase().includes(normalizedSearch) ||
        product.genericName.toLowerCase().includes(normalizedSearch) ||
        product.laboratory.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const selectedProduct = products.find((product) => product.id === selectedProductId) || products[0];
  const selectedProductSelection = selectionByProduct[selectedProduct.id];
  const selectedPrice =
    selectedProduct.saleOptions.find((option) => option.label === selectedProductSelection.saleType)?.price ||
    selectedProduct.saleOptions[0].price;

  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discount = subtotal >= 100 ? subtotal * 0.05 : 0;
  const total = subtotal - discount;
  const includedTax = total > 0 ? total - total / 1.18 : 0;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateProductSelection = (productId: number, patch: Partial<ProductSelection>) => {
    setSelectionByProduct((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        ...patch,
      },
    }));
  };

  const changeQuantity = (productId: number, direction: "up" | "down") => {
    const product = products.find((item) => item.id === productId);
    const currentSelection = selectionByProduct[productId];
    const nextQuantity =
      direction === "up"
        ? Math.min((product?.stock || 1), currentSelection.quantity + 1)
        : Math.max(1, currentSelection.quantity - 1);

    updateProductSelection(productId, { quantity: nextQuantity });
  };

  const addProductToCart = (product: Product) => {
    const selection = selectionByProduct[product.id];
    const option = product.saleOptions.find((item) => item.label === selection.saleType) || product.saleOptions[0];
    const cartKey = `${product.id}-${option.label}`;

    setSelectedProductId(product.id);
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.key === cartKey);

      if (existingItem) {
        return currentItems.map((item) =>
          item.key === cartKey
            ? {
                ...item,
                quantity: Math.min(product.stock, item.quantity + selection.quantity),
              }
            : item,
        );
      }

      return [
        ...currentItems,
        {
          key: cartKey,
          product,
          saleType: option.label,
          unitPrice: option.price,
          quantity: selection.quantity,
        },
      ];
    });
  };

  const updateCartQuantity = (cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((currentItems) => currentItems.filter((item) => item.key !== cartKey));
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.key === cartKey
          ? {
              ...item,
              quantity: Math.min(item.product.stock, quantity),
            }
          : item,
      ),
    );
  };

  const removeCartItem = (cartKey: string) => {
    setCartItems((currentItems) => currentItems.filter((item) => item.key !== cartKey));
  };

  const handleProcessSale = () => {
    if (cartItems.length === 0) {
      alert("Agrega al menos un producto al carrito.");
      return;
    }

    alert("Venta simulada correctamente. Esta pantalla es solo frontend.");
    setCartItems([]);
    setCustomerName("");
    setPaymentMethod("cash");
  };

  const handleLogout = async () => {
    await logout();
  };

  const navItems: Array<{ id: SellerView; label: string; icon: LucideIcon; badge?: string }> = [
    { id: "menu", label: "Menu", icon: LayoutGrid },
    { id: "orders", label: "Orden actual", icon: ClipboardList, badge: itemCount > 0 ? `${itemCount}` : undefined },
    { id: "history", label: "Historial", icon: History },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "profile", label: "Mi perfil", icon: UserRound },
  ];

  const currentDate = new Intl.DateTimeFormat("es-PE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const renderWorkspace = () => {
    if (activeView === "history") {
      return <HistorialVentas />;
    }

    if (activeView === "clients") {
      return <Clientes onSelectCustomer={setCustomerName} />;
    }

    if (activeView === "profile") {
      return <PerfilVendedor userName={userName} userEmail={userEmail} userAvatar={userAvatar} />;
    }

    if (activeView === "orders") {
      return <OrdenActual cartItems={cartItems} onUpdateQuantity={updateCartQuantity} />;
    }

    return (
      <MenuProductos
        activeCategory={activeCategory}
        filteredProducts={filteredProducts}
        selectionByProduct={selectionByProduct}
        selectedProductId={selectedProductId}
        onSelectCategory={setActiveCategory}
        onSelectProduct={setSelectedProductId}
        onUpdateSelection={updateProductSelection}
        onChangeQuantity={changeQuantity}
        onAddToCart={addProductToCart}
      />
    );
  };

  return (
    <div className="seller-pos-page">
      <style>{`
        .seller-pos-page {
          height: 100vh;
          width: 100%;
          padding: 0;
          margin: 0;
          overflow: hidden;
          background: #ffffff;
          color: #111827;
          font-family: 'Cairo', sans-serif;
        }

        .seller-pos-shell {
          height: 100vh;
          width: 100%;
          display: grid;
          grid-template-columns: 268px minmax(0, 1fr) 360px;
          grid-template-rows: minmax(0, 1fr);
          overflow: hidden;
          background: #f8fafb;
          border: none;
          border-radius: 0;
          box-shadow: none;
          transition: grid-template-columns 0.3s ease;
        }

        .seller-pos-shell.is-sidebar-collapsed {
          grid-template-columns: 106px minmax(0, 1fr) 360px;
        }

        .seller-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          gap: 28px;
          min-height: 0;
          margin: 20px 0 20px 20px;
          padding: 32px 20px;
          border-radius: 24px;
          background: #15141f;
          overflow-y: auto;
          box-shadow: 
            0 0 0 1px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 16px 48px rgba(0, 0, 0, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 100;
          position: relative;
        }

        .seller-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          color: #ffffff;
          font-size: 19px;
          font-weight: 800;
          padding-bottom: 8px;
        }

        .seller-brand-mark {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 18px;
          color: #ffffff;
          background: linear-gradient(135deg, #0fbf70, #14b8a6);
          box-shadow: 0 8px 20px rgba(15, 191, 112, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .seller-brand-mark:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(15, 191, 112, 0.4);
        }

        .seller-close-nav,
        .seller-mobilebar,
        .seller-nav-backdrop {
          display: none;
        }

        .seller-nav {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-top: 16px;
        }

        .seller-nav-button,
        .seller-logout-button {
          width: 100%;
          min-height: 52px;
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 0 16px;
          border: 0;
          outline: none;
          border-radius: 14px;
          background: transparent;
          color: #969ba0;
          font: inherit;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }

        .seller-nav-button:focus,
        .seller-logout-button:focus {
          outline: none;
        }

        .seller-nav-button:focus-visible,
        .seller-logout-button:focus-visible {
          outline: 2px solid rgba(15, 191, 112, 0.4);
          outline-offset: 2px;
        }

        .seller-nav-button:hover,
        .seller-logout-button:hover {
          color: #0fbf70;
          background: rgba(15, 191, 112, 0.12);
          transform: translateX(4px);
        }

        .seller-nav-button.is-active {
          color: #0fbf70;
          background: rgba(15, 191, 112, 0.14);
          box-shadow: 
            inset 0 0 0 1px rgba(15, 191, 112, 0.25),
            0 2px 8px rgba(15, 191, 112, 0.15);
          transform: translateX(4px);
        }

        .seller-nav-button.is-active::before {
          content: "";
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 28px;
          background: linear-gradient(180deg, #0fbf70, #14b8a6);
          border-radius: 0 4px 4px 0;
          box-shadow: 0 2px 8px rgba(15, 191, 112, 0.5);
        }

        .seller-nav-badge {
          margin-left: auto;
          min-width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          padding: 0 7px;
          border-radius: 999px;
          color: #fff;
          background: #ef4444;
          font-size: 11px;
          font-weight: 800;
        }

        .seller-sidebar-footer {
          display: grid;
          gap: 12px;
          margin-top: auto;
          padding-top: 20px;
          border-top: 1px solid rgba(46, 46, 66, 0.5);
        }

        /* Botones específicos del footer con altura y alineación fija */
        .seller-sidebar-footer .seller-nav-button,
        .seller-sidebar-footer .seller-logout-button {
          min-height: 52px;
          height: 52px;
        }

        .seller-shift-card {
          padding: 18px;
          border: 1px solid rgba(15, 191, 112, 0.2);
          border-radius: 16px;
          background: rgba(15, 191, 112, 0.08);
          transition: all 0.25s ease;
        }

        .seller-shift-card:hover {
          border-color: rgba(15, 191, 112, 0.35);
          background: rgba(15, 191, 112, 0.12);
          box-shadow: 0 4px 12px rgba(15, 191, 112, 0.2);
        }

        .seller-shift-card span {
          display: block;
          color: #969ba0;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .seller-shift-card strong {
          display: block;
          margin-top: 6px;
          color: #0fbf70;
          font-size: 24px;
          line-height: 1;
          font-weight: 900;
        }

        .seller-logout-button {
          color: #ef4444;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .seller-logout-button:hover {
          color: #ffffff;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          transform: translateX(4px);
        }

        /* Ajuste para botones de ajustes y ayuda en sidebar oscuro */
        .seller-sidebar-footer .seller-nav-button {
          color: #969ba0;
        }

        .seller-sidebar-footer .seller-nav-button:hover {
          color: #0fbf70;
          background: rgba(15, 191, 112, 0.12);
        }

        .seller-workspace {
          min-width: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: #f8fafb;
        }

        .seller-topbar {
          min-height: 92px;
          display: grid;
          grid-template-columns: minmax(0, 480px) 1fr auto;
          align-items: center;
          gap: 20px;
          padding: 24px 28px;
          border-bottom: none;
          background: #f8fafb;
        }

        .seller-topbar-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .seller-topbar-left .seller-search {
          flex: 1;
          min-width: 0;
        }

        .seller-sidebar-toggle {
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 14px;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .seller-sidebar-toggle:hover {
          color: #0f9f63;
          background: rgba(15, 191, 112, 0.1);
        }

        .seller-sidebar-toggle:active {
          transform: scale(0.94);
        }

        /* ---- Tooltips de la barra lateral (rail colapsada) ---- */
        .seller-nav-button[data-tooltip]::after,
        .seller-logout-button[data-tooltip]::after {
          content: attr(data-tooltip);
          position: absolute;
          left: calc(100% + 11px);
          top: 50%;
          transform: translateY(-50%) translateX(-6px);
          z-index: 9999;
          padding: 8px 12px;
          border-radius: 9px;
          background: #0f172a;
          color: #ffffff;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.02em;
          line-height: 1;
          white-space: nowrap;
          box-shadow: 0 14px 28px rgba(15, 23, 42, 0.26);
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease;
        }

        .seller-nav-button[data-tooltip]::before,
        .seller-logout-button[data-tooltip]::before {
          content: "";
          position: absolute;
          left: calc(100% + 7px);
          top: 50%;
          transform: translateY(-50%);
          z-index: 9999;
          border: 5px solid transparent;
          border-right-color: #0f172a;
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
          transition: opacity 0.16s ease, visibility 0.16s ease;
        }

        @media (min-width: 921px) {
          .seller-pos-shell.is-sidebar-collapsed .seller-sidebar {
            align-items: center;
            padding: 32px 18px;
            overflow: visible;
            margin: 20px 0 20px 20px;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-brand {
            justify-content: center;
            gap: 0;
            padding-bottom: 8px;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-brand strong,
          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button span:not(.seller-nav-badge),
          .seller-pos-shell.is-sidebar-collapsed .seller-logout-button span,
          .seller-pos-shell.is-sidebar-collapsed .seller-shift-card {
            display: none;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button,
          .seller-pos-shell.is-sidebar-collapsed .seller-logout-button {
            justify-content: center;
            padding: 0;
            width: 52px;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button.is-active::before {
            display: none;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-nav-badge {
            position: absolute;
            top: 4px;
            right: 4px;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button[data-tooltip]:hover::after,
          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button[data-tooltip]:hover::before,
          .seller-pos-shell.is-sidebar-collapsed .seller-logout-button[data-tooltip]:hover::after,
          .seller-pos-shell.is-sidebar-collapsed .seller-logout-button[data-tooltip]:hover::before {
            opacity: 1;
            visibility: visible;
          }

          .seller-pos-shell.is-sidebar-collapsed .seller-nav-button[data-tooltip]:hover::after,
          .seller-pos-shell.is-sidebar-collapsed .seller-logout-button[data-tooltip]:hover::after {
            transform: translateY(-50%) translateX(0);
          }
        }

        @media (min-width: 921px) and (max-width: 1240px) {
          /* En tabletas el sidebar ya es una rail de iconos: mostrar tooltips */
          .seller-nav-button[data-tooltip]:hover::after,
          .seller-nav-button[data-tooltip]:hover::before,
          .seller-logout-button[data-tooltip]:hover::after,
          .seller-logout-button[data-tooltip]:hover::before {
            opacity: 1;
            visibility: visible;
          }

          .seller-nav-button[data-tooltip]:hover::after,
          .seller-logout-button[data-tooltip]:hover::after {
            transform: translateY(-50%) translateX(0);
          }
        }

        .seller-search {
          height: 48px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          background: #ffffff;
          color: #667085;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
        }

        .seller-search input {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #111827;
          font: inherit;
          font-size: 15px;
          font-weight: 600;
        }

        .seller-date {
          justify-self: end;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
          text-transform: capitalize;
        }

        .seller-user {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #0f172a;
        }

        .seller-user-text {
          text-align: right;
          line-height: 1.25;
        }

        .seller-user-text strong {
          display: block;
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
          font-weight: 800;
        }

        .seller-user-text span {
          color: #667085;
          font-size: 12px;
          font-weight: 700;
        }

        .seller-avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #ffffff;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
        }

        .seller-bell {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 50%;
          background: #ffffff;
          color: #0f172a;
          cursor: pointer;
          position: relative;
          box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
          transition: all 0.2s ease;
        }

        .seller-bell:hover {
          background: rgba(15, 191, 112, 0.1);
          color: #0f9f63;
        }

        .seller-bell::after {
          content: "";
          position: absolute;
          top: 9px;
          right: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #ef4444;
          border: 2px solid #fff;
        }

        .seller-content {
          flex: 1;
          overflow-y: auto;
          padding: 0 28px 28px 28px;
          background: #f8fafb;
        }

        .seller-section-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .seller-section-heading h2,
        .seller-panel-view h2 {
          margin: 0;
          color: #111827;
          font-size: clamp(22px, 2vw, 28px);
          font-weight: 800;
          line-height: 1.1;
        }

        .seller-section-heading > span {
          color: #667085;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        .seller-eyebrow {
          margin: 0 0 5px;
          color: #0fbf70;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .seller-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(122px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .seller-category {
          min-height: 112px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border: 1px solid #dfe8ef;
          border-radius: 18px;
          background: #ffffff;
          color: #0f172a;
          font: inherit;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 16px 32px rgba(15, 23, 42, 0.04);
        }

        .seller-category svg {
          color: #607286;
        }

        .seller-category:hover,
        .seller-category.is-active {
          color: #0f9f63;
          border-color: #0fbf70;
          background: linear-gradient(180deg, rgba(15, 191, 112, 0.12), #ffffff 70%);
          transform: translateY(-2px);
        }

        .seller-category.is-active svg {
          color: #0fbf70;
        }

        .seller-product-heading {
          margin-top: 6px;
        }

        .seller-product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 18px;
        }

        .seller-product-card {
          min-width: 0;
          padding: 16px;
          border: 1px solid #dfe8ef;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.06);
          cursor: pointer;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }

        .seller-product-card:hover,
        .seller-product-card.is-selected {
          transform: translateY(-2px);
          border-color: var(--product-accent);
          box-shadow: 0 22px 42px rgba(15, 23, 42, 0.1);
        }

        .seller-product-top {
          display: grid;
          grid-template-columns: 112px minmax(0, 1fr);
          gap: 16px;
          align-items: start;
          margin-bottom: 16px;
        }

        .seller-product-image {
          height: 112px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border-radius: 14px;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0)),
            color-mix(in srgb, var(--product-accent) 16%, #eef6f5);
          position: relative;
        }

        .seller-product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          position: relative;
          z-index: 2;
        }

        .seller-product-fallback {
          position: absolute;
          color: var(--product-accent);
          z-index: 1;
        }

        .seller-product-top h3 {
          margin: 3px 0 6px;
          color: #111827;
          font-size: 17px;
          font-weight: 800;
          line-height: 1.2;
        }

        .seller-product-top p {
          margin: 0 0 18px;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }

        .seller-product-top strong {
          color: #0fbf70;
          font-size: 24px;
          font-weight: 900;
        }

        .seller-card-row {
          display: grid;
          grid-template-columns: 1fr 110px;
          gap: 12px;
          margin-bottom: 8px;
          color: #111827;
          font-size: 12px;
          font-weight: 800;
        }

        .seller-card-row-spaced {
          margin-top: 18px;
        }

        .seller-option-row {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
        }

        .seller-option-row button,
        .seller-amount button,
        .seller-order-actions button {
          border: 0;
          border-radius: 999px;
          background: #f2f5f7;
          color: #667085;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.18s ease;
        }

        .seller-option-row button {
          height: 40px;
          min-width: 0;
          font-size: 12px;
        }

        .seller-option-row button:hover,
        .seller-option-row button.is-active {
          color: #0f9f63;
          background: rgba(15, 191, 112, 0.11);
          box-shadow: inset 0 0 0 1px #0fbf70;
        }

        .seller-option-row button.is-warning {
          color: #b45309;
          background: rgba(245, 158, 11, 0.12);
          box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.42);
        }

        .seller-product-bottom {
          display: grid;
          grid-template-columns: 1fr 148px;
          gap: 12px;
          align-items: center;
        }

        .seller-lab-pill {
          min-width: 0;
          height: 42px;
          display: inline-flex;
          align-items: center;
          padding: 0 14px;
          border-radius: 999px;
          background: #f7fafc;
          color: #4b5563;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .seller-amount {
          height: 42px;
          display: grid;
          grid-template-columns: 40px 1fr 40px;
          align-items: center;
          gap: 8px;
        }

        .seller-amount button,
        .seller-order-actions button {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
        }

        .seller-amount button:last-child {
          color: #fff;
          background: linear-gradient(135deg, #0fbf70, #0aa565);
          box-shadow: 0 12px 18px rgba(15, 191, 112, 0.26);
        }

        .seller-amount strong {
          color: #111827;
          text-align: center;
          font-size: 16px;
          font-weight: 900;
        }

        .seller-add-button {
          width: 100%;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 18px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #0fbf70, #0aa565);
          color: #ffffff;
          font: inherit;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 16px 26px rgba(15, 191, 112, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .seller-add-button:hover {
          transform: translateY(-1px);
          box-shadow: 0 18px 32px rgba(15, 191, 112, 0.3);
        }

        .seller-panel-view {
          min-height: 520px;
          padding: 26px;
          border: 1px solid #dfe8ef;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 18px 34px rgba(15, 23, 42, 0.06);
        }

        .seller-history-list,
        .seller-client-grid,
        .seller-order-list-large {
          margin-top: 22px;
        }

        .seller-history-row,
        .seller-order-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          padding: 16px 0;
          border-bottom: 1px solid #edf2f5;
        }

        .seller-history-row:last-child,
        .seller-order-row:last-child {
          border-bottom: 0;
        }

        .seller-history-row div,
        .seller-order-row div:first-child {
          min-width: 0;
          display: grid;
          gap: 4px;
        }

        .seller-history-row strong,
        .seller-order-row strong {
          color: #111827;
          font-size: 15px;
          font-weight: 900;
        }

        .seller-history-row span,
        .seller-history-row small,
        .seller-order-row span {
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }

        .seller-client-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }

        .seller-client-card {
          min-height: 150px;
          display: grid;
          justify-items: start;
          gap: 10px;
          padding: 18px;
          border: 1px solid #dfe8ef;
          border-radius: 18px;
          background: #f8fafc;
          text-align: left;
          font: inherit;
          cursor: pointer;
        }

        .seller-client-card span {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          color: #fff;
          background: linear-gradient(135deg, #0fbf70, #14b8a6);
          font-weight: 900;
        }

        .seller-client-card strong {
          color: #111827;
          font-size: 15px;
          font-weight: 900;
        }

        .seller-client-card small {
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }

        .seller-profile-card {
          display: flex;
          align-items: center;
          gap: 18px;
          margin-top: 22px;
          padding: 20px;
          border: 1px solid #dfe8ef;
          border-radius: 20px;
          background: #f8fafc;
        }

        .seller-profile-card img {
          width: 78px;
          height: 78px;
          border-radius: 22px;
          object-fit: cover;
        }

        .seller-profile-card h3 {
          margin: 0;
          color: #111827;
          font-size: 22px;
          font-weight: 900;
        }

        .seller-profile-card p {
          margin: 4px 0 12px;
          color: #667085;
          font-weight: 700;
        }

        .seller-profile-card span {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          color: #0f9f63;
          background: rgba(15, 191, 112, 0.11);
          font-size: 12px;
          font-weight: 900;
        }

        .seller-bill {
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          padding: 28px 24px;
          border-left: 1px solid #e2ebf1;
          background: rgba(255, 255, 255, 0.82);
          overflow-y: auto;
        }

        .seller-bill-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 24px;
        }

        .seller-bill-header h2 {
          margin: 0;
          color: #111827;
          font-size: 23px;
          font-weight: 900;
        }

        .seller-bill-header span {
          color: #48556a;
          font-size: 15px;
          font-weight: 900;
        }

        .seller-form-block {
          display: grid;
          gap: 10px;
          margin-bottom: 22px;
        }

        .seller-form-block label,
        .seller-bill-label {
          color: #111827;
          font-size: 14px;
          font-weight: 900;
        }

        .seller-form-block input {
          height: 50px;
          width: 100%;
          border: 1px solid #d6e1e9;
          border-radius: 14px;
          outline: 0;
          padding: 0 16px;
          background: #f8fafc;
          color: #111827;
          font: inherit;
          font-weight: 700;
        }

        .seller-divider {
          height: 1px;
          margin: 2px 0 22px;
          background: #e0e8ee;
        }

        .seller-selected-detail {
          display: grid;
          grid-template-columns: 70px minmax(0, 1fr);
          gap: 14px;
          margin-bottom: 18px;
        }

        .seller-selected-detail img {
          width: 70px;
          height: 70px;
          border-radius: 14px;
          object-fit: cover;
          background: #eef6f5;
        }

        .seller-selected-detail h3 {
          margin: 0 0 4px;
          color: #111827;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.2;
        }

        .seller-selected-detail p {
          margin: 0 0 8px;
          color: #667085;
          font-size: 13px;
          font-weight: 700;
        }

        .seller-selected-detail strong {
          color: #0fbf70;
          font-size: 20px;
          font-weight: 900;
        }

        .seller-spec-list {
          display: grid;
          gap: 9px;
          margin-bottom: 20px;
        }

        .seller-spec-list div,
        .seller-total-row {
          display: flex;
          justify-content: space-between;
          gap: 14px;
          color: #667085;
          font-size: 14px;
          font-weight: 700;
        }

        .seller-spec-list strong,
        .seller-total-row strong {
          color: #344054;
          text-align: right;
          font-weight: 900;
        }

        .seller-order-list {
          display: grid;
          gap: 12px;
          max-height: 210px;
          overflow-y: auto;
          margin-bottom: 18px;
        }

        .seller-mini-cart-row {
          display: grid;
          grid-template-columns: 1fr auto auto;
          align-items: center;
          gap: 10px;
          padding: 12px;
          border: 1px solid #edf2f5;
          border-radius: 14px;
          background: #f8fafc;
        }

        .seller-mini-cart-row div {
          min-width: 0;
        }

        .seller-mini-cart-row strong {
          display: block;
          overflow: hidden;
          color: #111827;
          font-size: 13px;
          font-weight: 900;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .seller-mini-cart-row span {
          color: #667085;
          font-size: 12px;
          font-weight: 700;
        }

        .seller-mini-cart-row > strong {
          color: #0f9f63;
          font-size: 13px;
        }

        .seller-mini-cart-row button {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 9px;
          background: #fff;
          color: #ef4444;
          cursor: pointer;
        }

        .seller-empty-cart {
          min-height: 118px;
          display: grid;
          place-items: center;
          gap: 8px;
          padding: 18px;
          border: 1px dashed #d6e1e9;
          border-radius: 16px;
          color: #98a2b3;
          text-align: center;
          font-weight: 800;
        }

        .seller-total-box {
          display: grid;
          gap: 11px;
          margin-bottom: 22px;
          padding: 18px 0 0;
          border-top: 1px solid #e0e8ee;
        }

        .seller-total-row.is-grand {
          align-items: center;
          margin-top: 6px;
          padding-top: 14px;
          border-top: 1px solid #e0e8ee;
          color: #111827;
          font-size: 22px;
          font-weight: 900;
        }

        .seller-total-row.is-grand strong {
          color: #0fbf70;
          font-size: 28px;
        }

        .seller-document-select {
          height: 50px;
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 10px;
          margin: 10px 0 20px;
          padding: 0 14px 0 16px;
          border: 1px solid #d6e1e9;
          border-radius: 14px;
          background: #f8fafc;
        }

        .seller-document-select select {
          width: 100%;
          border: 0;
          outline: 0;
          background: transparent;
          color: #667085;
          font: inherit;
          font-weight: 800;
          appearance: none;
        }

        .seller-payment-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin: 12px 0 24px;
        }

        .seller-payment-grid button {
          min-height: 88px;
          display: grid;
          justify-items: center;
          align-content: center;
          gap: 8px;
          border: 1px solid #dfe8ef;
          border-radius: 16px;
          background: #ffffff;
          color: #111827;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .seller-payment-grid button.is-active {
          color: #0f9f63;
          border-color: #0fbf70;
          background: linear-gradient(180deg, rgba(15, 191, 112, 0.12), #ffffff);
        }

        .seller-process-button {
          width: 100%;
          min-height: 56px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #0fbf70, #0aa565);
          color: #ffffff;
          font: inherit;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 18px 30px rgba(15, 191, 112, 0.24);
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .seller-process-button:disabled {
          cursor: not-allowed;
          opacity: 0.48;
        }

        .seller-process-button:not(:disabled):hover {
          transform: translateY(-1px);
        }

        @media (max-width: 1240px) {
          .seller-pos-page {
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }

          .seller-pos-shell {
            grid-template-columns: 106px minmax(0, 1fr);
            grid-template-rows: none;
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }

          .seller-pos-shell.is-sidebar-collapsed {
            grid-template-columns: 106px minmax(0, 1fr);
          }

          .seller-sidebar {
            align-items: center;
            padding: 28px 18px;
            margin: 20px 0 20px 20px;
          }

          .seller-brand strong,
          .seller-nav-button span:not(.seller-nav-badge),
          .seller-logout-button span,
          .seller-shift-card,
          .seller-user-text {
            display: none;
          }

          .seller-nav-button,
          .seller-logout-button {
            justify-content: center;
            padding: 0;
          }

          .seller-nav-button.is-active::before {
            left: 4px;
          }

          .seller-nav-badge {
            position: absolute;
            top: 4px;
            right: 4px;
          }

          .seller-bill {
            grid-column: 2;
            border-top: 1px solid #e2ebf1;
            border-left: 0;
          }
        }

        @media (max-width: 920px) {
          .seller-pos-page {
            padding: 0;
          }

          .seller-pos-shell {
            min-height: 100vh;
            display: block;
            border: 0;
            border-radius: 0;
            background: #ffffff;
          }

          .seller-sidebar {
            position: fixed;
            inset: 0 auto 0 0;
            z-index: 70;
            width: min(290px, 86vw);
            align-items: stretch;
            margin: 0;
            padding: 28px 22px;
            border-radius: 0 24px 24px 0;
            transform: translateX(-105%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 24px 0 48px rgba(15, 23, 42, 0.12);
          }

          .seller-pos-shell.is-nav-open .seller-sidebar {
            transform: translateX(0);
          }

          .seller-pos-shell.is-nav-open .seller-nav-backdrop {
            display: block;
          }

          .seller-brand strong,
          .seller-nav-button span:not(.seller-nav-badge),
          .seller-logout-button span,
          .seller-shift-card {
            display: block;
          }

          .seller-nav-button,
          .seller-logout-button {
            justify-content: flex-start;
            padding: 0 16px;
          }

          .seller-close-nav {
            display: grid;
            place-items: center;
            width: 38px;
            height: 38px;
            border: 0;
            border-radius: 12px;
            background: rgba(15, 191, 112, 0.15);
            color: #0fbf70;
            transition: all 0.2s ease;
          }

          .seller-close-nav:hover {
            background: rgba(15, 191, 112, 0.25);
            transform: rotate(90deg);
          }

          .seller-mobilebar {
            min-height: 70px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            padding: 14px 18px;
            border-bottom: 1px solid #e2ebf1;
            background: rgba(255, 255, 255, 0.9);
          }

          .seller-sidebar-toggle {
            display: none;
          }

          .seller-mobilebar button {
            width: 42px;
            height: 42px;
            display: grid;
            place-items: center;
            border: 0;
            border-radius: 14px;
            background: rgba(15, 191, 112, 0.12);
            color: #0fbf70;
          }

          .seller-mobilebar strong {
            color: #111827;
            font-size: 18px;
            font-weight: 900;
          }

          .seller-nav-backdrop {
            display: none;
            position: fixed;
            inset: 0;
            z-index: 60;
            border: 0;
            background: rgba(15, 23, 42, 0.6);
            backdrop-filter: blur(4px);
          }

          .seller-topbar {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 18px;
          }

          .seller-date {
            justify-self: start;
          }

          .seller-user {
            justify-content: space-between;
          }

          .seller-user-text {
            display: block;
            text-align: left;
          }

          .seller-content {
            padding: 18px;
          }

          .seller-section-heading {
            align-items: start;
            flex-direction: column;
          }

          .seller-section-heading > span {
            white-space: normal;
          }

          .seller-categories {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .seller-product-grid {
            grid-template-columns: 1fr;
          }

          .seller-bill {
            padding: 22px 18px 28px;
            border-top: 1px solid #e2ebf1;
          }
        }

        @media (max-width: 520px) {
          .seller-product-top,
          .seller-selected-detail,
          .seller-product-bottom {
            grid-template-columns: 1fr;
          }

          .seller-product-image {
            height: 170px;
          }

          .seller-card-row {
            grid-template-columns: 1fr 74px;
          }

          .seller-payment-grid {
            grid-template-columns: 1fr;
          }

          .seller-history-row,
          .seller-order-row,
          .seller-profile-card {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <div
        className={`seller-pos-shell ${mobileMenuOpen ? "is-nav-open" : ""} ${sidebarCollapsed ? "is-sidebar-collapsed" : ""}`}
      >
        <aside className="seller-sidebar">
          <div>
            <div className="seller-brand">
              <div className="seller-brand-mark">
                <Pill size={22} />
              </div>
              <strong>Botica Dua</strong>
              <button className="seller-close-nav" onClick={() => setMobileMenuOpen(false)} aria-label="Cerrar menu">
                <X size={19} />
              </button>
            </div>

            <nav className="seller-nav" aria-label="Menu de vendedor">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    className={`seller-nav-button ${activeView === item.id ? "is-active" : ""}`}
                    data-tooltip={item.label}
                    onClick={() => {
                      setActiveView(item.id);
                      setMobileMenuOpen(false);
                    }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                    {item.badge && <span className="seller-nav-badge">{item.badge}</span>}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="seller-sidebar-footer">
            <div className="seller-shift-card">
              <span>Turno actual</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
            <button className="seller-nav-button" type="button" data-tooltip="Ajustes">
              <Settings size={20} />
              <span>Ajustes</span>
            </button>
            <button className="seller-nav-button" type="button" data-tooltip="Ayuda">
              <HelpCircle size={20} />
              <span>Ayuda</span>
            </button>
            <button className="seller-logout-button" type="button" data-tooltip="Cerrar sesión" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        <button
          className="seller-nav-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Cerrar menu lateral"
        />

        <section className="seller-workspace">
          <div className="seller-mobilebar">
            <button onClick={() => setMobileMenuOpen(true)} aria-label="Abrir menu">
              <Menu size={21} />
            </button>
            <strong>Punto de venta</strong>
            <span className="seller-brand-mark">
              <Pill size={19} />
            </span>
          </div>

          <header className="seller-topbar">
            <div className="seller-topbar-left">
              <button
                className="seller-sidebar-toggle"
                type="button"
                onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
                aria-label={sidebarCollapsed ? "Mostrar menú lateral" : "Ocultar menú lateral"}
                aria-expanded={!sidebarCollapsed}
              >
                <Menu size={21} />
              </button>
              <label className="seller-search">
                <Search size={20} />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar producto, genérico o laboratorio"
                />
              </label>
            </div>
            <div className="seller-date">{currentDate}</div>
            <div className="seller-user">
              <div className="seller-user-text">
                <strong>{userName}</strong>
                <span>Vendedor</span>
              </div>
              <img className="seller-avatar" src={userAvatar} alt={userName} />
              <button className="seller-bell" aria-label="Notificaciones">
                <Bell size={18} />
              </button>
            </div>
          </header>

          <main className="seller-content">{renderWorkspace()}</main>
        </section>

        <aside className="seller-bill">
          <div className="seller-bill-header">
            <h2>Detalle de venta</h2>
            <span>#POS-546234</span>
          </div>

          <div className="seller-form-block">
            <label htmlFor="seller-customer">Cliente</label>
            <input
              id="seller-customer"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Cliente mostrador"
            />
          </div>

          <div className="seller-divider" />

          <div className="seller-selected-detail">
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <div>
              <h3>{selectedProduct.name}</h3>
              <p>{selectedProduct.genericName}</p>
              <strong>{formatCurrency(selectedPrice)}</strong>
            </div>
          </div>

          <div className="seller-spec-list">
            <div>
              <span>Forma de venta</span>
              <strong>{selectedProductSelection.saleType}</strong>
            </div>
            <div>
              <span>Cantidad</span>
              <strong>{selectedProductSelection.quantity}</strong>
            </div>
            <div>
              <span>Stock</span>
              <strong>{selectedProduct.stock} unidades</strong>
            </div>
            <div>
              <span>Receta médica</span>
              <strong>{selectedProduct.requiresPrescription ? "Requerida" : "No requerida"}</strong>
            </div>
          </div>

          <div className="seller-divider" />

          <div className="seller-order-list">
            {cartItems.length === 0 ? (
              <div className="seller-empty-cart">
                <ShoppingCart size={34} />
                <span>El carrito esta vacío.</span>
              </div>
            ) : (
              cartItems.map((item) => (
                <article key={item.key} className="seller-mini-cart-row">
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>
                      {item.saleType} x {item.quantity}
                    </span>
                  </div>
                  <strong>{formatCurrency(item.unitPrice * item.quantity)}</strong>
                  <button onClick={() => removeCartItem(item.key)} aria-label="Eliminar producto">
                    <Trash2 size={15} />
                  </button>
                </article>
              ))
            )}
          </div>

          <div className="seller-total-box">
            <div className="seller-total-row">
              <span>Items</span>
              <strong>{itemCount}</strong>
            </div>
            <div className="seller-total-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <div className="seller-total-row">
              <span>Descuento</span>
              <strong>- {formatCurrency(discount)}</strong>
            </div>
            <div className="seller-total-row">
              <span>IGV incluido</span>
              <strong>{formatCurrency(includedTax)}</strong>
            </div>
            <div className="seller-total-row is-grand">
              <span>Total</span>
              <strong>{formatCurrency(total)}</strong>
            </div>
          </div>

          <label className="seller-bill-label" htmlFor="seller-document">
            Comprobante
          </label>
          <div className="seller-document-select">
            <select
              id="seller-document"
              value={documentType}
              onChange={(event) => setDocumentType(event.target.value as "Boleta" | "Factura" | "Ticket")}
            >
              <option>Boleta</option>
              <option>Factura</option>
              <option>Ticket</option>
            </select>
            <ChevronRight size={20} />
          </div>

          <span className="seller-bill-label">Método de pago</span>
          <div className="seller-payment-grid">
            <button
              className={paymentMethod === "cash" ? "is-active" : ""}
              onClick={() => setPaymentMethod("cash")}
            >
              <Banknote size={27} />
              Efectivo
            </button>
            <button
              className={paymentMethod === "card" ? "is-active" : ""}
              onClick={() => setPaymentMethod("card")}
            >
              <CreditCard size={27} />
              Tarjeta
            </button>
            <button
              className={paymentMethod === "yape" ? "is-active" : ""}
              onClick={() => setPaymentMethod("yape")}
            >
              <ReceiptText size={27} />
              Yape/Plin
            </button>
          </div>

          <button className="seller-process-button" disabled={cartItems.length === 0} onClick={handleProcessSale}>
            Procesar venta
          </button>
        </aside>
      </div>
    </div>
  );
}
