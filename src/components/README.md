# 📁 Estructura de Componentes por Rol

Este directorio está organizado por roles de usuario para facilitar el desarrollo, mantenimiento y escalabilidad del sistema.

## 🏗️ Estructura

```
src/components/
├── admin/                    # 👑 Componentes exclusivos de Administrador
├── almacenero/               # 📦 Componentes de Almacenero
├── vendedor/                 # 💼 Componentes de Vendedor
└── shared/                   # 🔄 Componentes compartidos entre roles
```

---

## 👑 Admin (`/admin`)

Componentes para el rol de **Administrador** con acceso completo al sistema.

### Componentes Disponibles

#### 🏠 Panel Principal
- `Dashboard.tsx` - Panel principal con métricas y accesos directos

#### 👥 Gestión de Usuarios
- `UsersManagement.tsx` - Gestión de usuarios del sistema
- `SolicitudesRegistro.tsx` - Aprobación de solicitudes de registro

#### 📦 Gestión de Inventario
- `ProductsManagement.tsx` - CRUD de productos farmacéuticos
- `CategoriesManagement.tsx` - Gestión de categorías de productos
- `LotesManagement.tsx` - Control de lotes y fechas de vencimiento
- `StockCriticoManagement.tsx` - Alertas de stock bajo

#### 🛒 Gestión de Compras
- `NewPurchase.tsx` - Registro de nuevas compras
- `PurchaseHistory.tsx` - Historial de compras realizadas
- `SuppliersManagement.tsx` - Gestión de proveedores

#### 👥 Gestión de Clientes
- `CustomersManagement.tsx` - Base de datos de clientes

#### 📚 Catálogos del Sistema
- `FormasFarmaceuticasManagement.tsx` - Formas farmacéuticas (tabletas, cápsulas, etc.)
- `ViasAdministracionManagement.tsx` - Vías de administración (oral, tópica, etc.)
- `LaboratoriosManagement.tsx` - Catálogo de laboratorios
- `MetodosPagoManagement.tsx` - Métodos de pago disponibles

#### 📊 Reportes
- `ReportesVentas.tsx` - Reportes y análisis de ventas
- `ReportesInventario.tsx` - Reportes de inventario y stock
- `ReportesMovimientos.tsx` - Movimientos de productos

### Rutas de Importación

```typescript
// Desde otro componente en admin/
import Dashboard from './Dashboard';
import UsersManagement from './UsersManagement';

// Desde fuera de admin/
import Dashboard from './components/admin/Dashboard';
```

---

## 📦 Almacenero (`/almacenero`)

Componentes para el rol de **Almacenero** con acceso a módulos de inventario y compras.

### Estado Actual

Por ahora, el almacenero comparte la interfaz del administrador con permisos restringidos:
- ✅ El `Dashboard.tsx` redirige a `admin/Dashboard.tsx`
- ✅ El sistema de permisos controla el acceso a módulos específicos
- ✅ Solo puede acceder a: Productos, Lotes, Stock Crítico, Compras, Reportes de Inventario

### Desarrollo Futuro

Cuando se necesite personalizar la experiencia del almacenero, se pueden crear componentes específicos aquí. Ver `almacenero/README.md` para más detalles.

### Rutas de Importación

```typescript
import AlmaceneroDashboard from './components/almacenero/Dashboard';
```

---

## 💼 Vendedor (`/vendedor`)

Componentes para el rol de **Vendedor** con interfaz optimizada para punto de venta.

### Componentes Disponibles

- `SellerPOS.tsx` - Punto de venta completo (POS) con interfaz táctil
- `NewSale.tsx` - Registro de nueva venta
- `SalesHistory.tsx` - Historial de ventas realizadas

### Características del POS

El `SellerPOS.tsx` incluye:
- 🛒 Carrito de compras interactivo
- 📦 Búsqueda de productos por categoría
- 💳 Múltiples métodos de pago (efectivo, tarjeta, Yape/Plin)
- 🧾 Generación de comprobantes (boleta, factura, ticket)
- 📊 Resumen del turno actual

### Rutas de Importación

```typescript
import SellerPOS from './components/vendedor/SellerPOS';
import NewSale from './components/vendedor/NewSale';
```

---

## 🔄 Shared (`/shared`)

Componentes compartidos entre todos los roles del sistema.

### Componentes Disponibles

#### 🔐 Autenticación
- `Login.tsx` - Pantalla de inicio de sesión
- `ForgotPassword.tsx` - Recuperación de contraseña
- `ResetPassword.tsx` - Restablecer contraseña

#### 👤 Perfil
- `MiPerfil.tsx` - Vista y edición del perfil de usuario

#### 🎨 Recursos
- `assets.ts` - Imágenes y recursos compartidos

### Rutas de Importación

```typescript
import Login from './components/shared/Login';
import MiPerfil from './components/shared/MiPerfil';
import { imgRectangle, imgGroup } from './components/shared/assets';
```

---

## 🔐 Sistema de Permisos

El acceso a los componentes está controlado por el hook `usePermissions()`:

```typescript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const { canViewMenu, isAdmin, isVendedor, isAlmacenero } = usePermissions();
  
  // Verificar acceso a un menú
  if (canViewMenu('Usuarios')) {
    // Usuario tiene permiso
  }
}
```

### Roles y Permisos

| Rol | ID | Permisos |
|-----|----|---------| 
| 👑 Administrador | 1 | Acceso completo a todos los módulos |
| 💼 Vendedor | 2 | POS, Ventas, Clientes |
| 📦 Almacenero | 3 | Inventario, Compras, Stock |

---

## 📝 Guía de Desarrollo

### Crear un Nuevo Componente

1. **Identifica el rol** al que pertenece el componente
2. **Crea el archivo** en la carpeta correspondiente:
   ```
   /admin      → Funcionalidad de administración
   /almacenero → Funcionalidad de almacén
   /vendedor   → Funcionalidad de ventas
   /shared     → Funcionalidad común
   ```

3. **Importa dependencias** usando rutas relativas:
   ```typescript
   // Mismo directorio
   import OtroComponente from './OtroComponente';
   
   // Directorio padre
   import Shared from '../shared/Componente';
   
   // Hooks y contextos
   import { useAuth } from '../../contexts/AuthContext';
   ```

4. **Registra permisos** si es necesario en `usePermissions()`

### Ejemplo: Crear Componente de Admin

```typescript
// src/components/admin/MiNuevoComponente.tsx
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { usePermissions } from '../../hooks/usePermissions';

export default function MiNuevoComponente() {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  
  if (!isAdmin) {
    return <div>Acceso denegado</div>;
  }
  
  return (
    <div>
      {/* Tu componente aquí */}
    </div>
  );
}
```

### Registrar en Dashboard

Si el componente debe aparecer en el menú del Dashboard:

```typescript
// src/components/admin/Dashboard.tsx

// 1. Importar el componente
import MiNuevoComponente from './MiNuevoComponente';

// 2. Agregar al array menuItems
const menuItems = [
  // ... otros items
  { 
    name: "Mi Nuevo Menú", 
    icon: IconoLucide,
    path: "MiNuevoPath"
  },
];

// 3. Agregar al renderizado condicional
{activeMenu === "MiNuevoPath" && <MiNuevoComponente />}
```

---

## 🚀 Buenas Prácticas

### ✅ Hacer

- ✅ Organizar componentes según su rol
- ✅ Usar rutas relativas para importaciones
- ✅ Verificar permisos antes de renderizar
- ✅ Reutilizar componentes de `/shared` cuando sea posible
- ✅ Documentar componentes complejos

### ❌ Evitar

- ❌ Mezclar componentes de diferentes roles en una misma carpeta
- ❌ Duplicar código que puede estar en `/shared`
- ❌ Hardcodear permisos (usar `usePermissions()`)
- ❌ Importaciones absolutas innecesarias
- ❌ Componentes sin control de acceso

---

## 🔄 Migración desde Estructura Anterior

Si tienes código antiguo que importa desde `./components/`, actualiza así:

```typescript
// ❌ Anterior
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import SellerPOS from './components/SellerPOS';

// ✅ Nuevo
import Dashboard from './components/admin/Dashboard';
import Login from './components/shared/Login';
import SellerPOS from './components/vendedor/SellerPOS';
```

---

## 📞 Soporte

Para dudas sobre la estructura de componentes:
1. Revisa este README
2. Consulta los README específicos en cada carpeta
3. Revisa ejemplos en componentes existentes

---

**Última actualización:** Reorganización completada - Estructura por roles implementada
