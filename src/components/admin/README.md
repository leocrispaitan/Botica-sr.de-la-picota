# 👑 Componentes de Administrador

Componentes exclusivos para el rol de **Administrador** con acceso completo al sistema.

## 📋 Lista de Componentes

### 🏠 Panel Principal
- **Dashboard.tsx** - Panel de control principal con métricas, gráficos y accesos directos

### 👥 Usuarios y Accesos
- **UsersManagement.tsx** - CRUD de usuarios del sistema
- **SolicitudesRegistro.tsx** - Aprobación de nuevas solicitudes de registro

### 📦 Inventario
- **ProductsManagement.tsx** - Gestión completa de productos farmacéuticos
- **CategoriesManagement.tsx** - Categorías de productos
- **LotesManagement.tsx** - Control de lotes y fechas de vencimiento
- **StockCriticoManagement.tsx** - Alertas y gestión de stock bajo

### 🛒 Compras
- **NewPurchase.tsx** - Registro de nuevas compras a proveedores
- **PurchaseHistory.tsx** - Historial y seguimiento de compras
- **SuppliersManagement.tsx** - Gestión de proveedores

### 👥 Clientes
- **CustomersManagement.tsx** - Base de datos y gestión de clientes

### 📚 Catálogos
- **FormasFarmaceuticasManagement.tsx** - Formas farmacéuticas (tableta, cápsula, jarabe, etc.)
- **ViasAdministracionManagement.tsx** - Vías de administración (oral, tópica, intravenosa, etc.)
- **LaboratoriosManagement.tsx** - Catálogo de laboratorios farmacéuticos
- **MetodosPagoManagement.tsx** - Métodos de pago disponibles en el sistema

### 📊 Reportes
- **ReportesVentas.tsx** - Análisis y reportes de ventas
- **ReportesInventario.tsx** - Estado de inventario y stock
- **ReportesMovimientos.tsx** - Movimientos y transacciones de productos

## 🔗 Dependencias Externas

Estos componentes importan desde otras carpetas:

```typescript
// Componentes de vendedor (para ventas desde admin)
import NewSale from '../vendedor/NewSale';
import SalesHistory from '../vendedor/SalesHistory';

// Componentes compartidos
import MiPerfil from '../shared/MiPerfil';

// Contextos y hooks
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';
```

## 🎯 Uso

```typescript
// Importar desde App.tsx o rutas principales
import Dashboard from './components/admin/Dashboard';

// Importar entre componentes de admin
import UsersManagement from './UsersManagement';
import ProductsManagement from './ProductsManagement';
```

## 🔐 Permisos

Todos los componentes en esta carpeta requieren que el usuario tenga el rol de **Administrador** (id_rol = 1).

El Dashboard verifica automáticamente los permisos usando el hook `usePermissions()`.

## 📝 Agregar Nuevo Componente

1. Crea el archivo en `/admin`
2. Importa en `Dashboard.tsx`
3. Agrega al menú en el array `menuItems`
4. Registra el permiso en `usePermissions()` si es necesario
