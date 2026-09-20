# 💼 Componentes de Vendedor

Componentes exclusivos para el rol de **Vendedor** con interfaz optimizada para punto de venta.

## 📋 Lista de Componentes

### 🛒 Punto de Venta
- **SellerPOS.tsx** - Interfaz completa de punto de venta (Point of Sale)
  - Diseño táctil y responsivo
  - Búsqueda rápida de productos
  - Carrito de compras interactivo
  - Múltiples métodos de pago
  - Generación de comprobantes

### 💰 Gestión de Ventas
- **NewSale.tsx** - Registro de nueva venta (usado también por admin)
- **SalesHistory.tsx** - Historial de ventas realizadas

## ✨ Características del SellerPOS

### 🎨 Interfaz de Usuario
- Diseño moderno con tema claro/oscuro
- Sidebar colapsable con navegación
- Barra de búsqueda inteligente
- Categorías de productos con iconos
- Cards de productos con información detallada

### 🛍️ Funcionalidades de Venta
- ✅ Selección de productos por categoría
- ✅ Búsqueda por nombre, genérico o laboratorio
- ✅ Opciones de venta (tableta, blister, caja)
- ✅ Control de cantidad y stock disponible
- ✅ Carrito de compras en tiempo real
- ✅ Cálculo automático de subtotal, descuentos e IGV
- ✅ Información de cliente
- ✅ Selección de comprobante (Boleta/Factura/Ticket)

### 💳 Métodos de Pago
- 💵 Efectivo
- 💳 Tarjeta de crédito/débito
- 📱 Yape/Plin

### 📊 Panel de Control
- Ventas del turno actual
- Historial de transacciones
- Lista de clientes frecuentes
- Perfil del vendedor

## 🎯 Uso

### Desde App.tsx
```typescript
import SellerPOS from './components/vendedor/SellerPOS';

// Renderizar según rol
{isSellerRole ? <SellerPOS /> : <Dashboard />}
```

### Entre componentes de vendedor
```typescript
import NewSale from './NewSale';
import SalesHistory from './SalesHistory';
```

### Desde otros roles
```typescript
// Desde admin Dashboard
import NewSale from '../vendedor/NewSale';
import SalesHistory from '../vendedor/SalesHistory';
```

## 🔐 Permisos

Los componentes de vendedor requieren:
- **Rol:** Vendedor (id_rol = 2)
- **Acceso:** Solo a módulos de ventas y clientes

## 📱 Responsive Design

El SellerPOS está optimizado para:
- 🖥️ Desktop (1920px+)
- 💻 Laptop (1366px - 1920px)
- 📱 Tablet (768px - 1366px)
- 📱 Mobile (320px - 768px)

### Breakpoints
- `920px` - Cambia a menú móvil
- `1240px` - Sidebar colapsada por defecto
- `520px` - Layout de una columna

## 🎨 Temas

El componente soporta tema claro y oscuro con transiciones suaves:

```typescript
const [isDark, setIsDark] = useState(true);

// Toggle automático con persistencia (futuro)
<ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
```

## 🚀 Desarrollo Futuro

### Próximas Funcionalidades
- [ ] Integración con backend real
- [ ] Impresión de comprobantes
- [ ] Scanner de código de barras
- [ ] Caja registradora virtual
- [ ] Estadísticas personales del vendedor
- [ ] Notificaciones de productos agotados
- [ ] Sistema de fidelización de clientes

### Mejoras de UX
- [ ] Atajos de teclado
- [ ] Modo pantalla completa
- [ ] Sonidos de confirmación
- [ ] Animaciones de transacciones
- [ ] Tutorial interactivo

## 📝 Notas de Desarrollo

- El componente usa **Cairo** como fuente principal
- Iconos de **Lucide React**
- Estados locales con **useState**
- Autenticación con **AuthContext**
- Formato de moneda: Nuevos Soles (PEN)
- Los datos de productos son actualmente mock (hardcoded)

## 🐛 Troubleshooting

**Problema:** El carrito no se actualiza
- Verifica que `cartItems` esté en el estado
- Revisa la función `addProductToCart`

**Problema:** El menú móvil no se cierra
- Verifica el estado `mobileMenuOpen`
- Revisa el `backdrop` y sus eventos

**Problema:** Las categorías no filtran
- Verifica `activeCategory` y `filteredProducts`
- Revisa el `useMemo` de filtrado
