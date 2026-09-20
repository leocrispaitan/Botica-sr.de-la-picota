# 🔄 Componentes Compartidos

Componentes utilizados por múltiples roles en el sistema.

## 📋 Lista de Componentes

### 🔐 Autenticación
- **Login.tsx** - Pantalla de inicio de sesión
  - Validación de credenciales
  - Recuperación de contraseña
  - Redirección según rol

- **ForgotPassword.tsx** - Solicitud de recuperación de contraseña
  - Envío de enlace de recuperación por email
  - Validación de email

- **ResetPassword.tsx** - Restablecimiento de contraseña
  - Token de seguridad
  - Validación de nueva contraseña
  - Confirmación de contraseña

### 👤 Perfil de Usuario
- **MiPerfil.tsx** - Vista y edición del perfil
  - Información personal
  - Foto de perfil
  - Cambio de contraseña
  - Preferencias del usuario

### 🎨 Recursos
- **assets.ts** - Imágenes y recursos compartidos
  - Avatares por defecto
  - Íconos del sistema
  - Imágenes de placeholder

## 🎯 Uso

### Importar desde cualquier componente

```typescript
// Desde App.tsx
import Login from './components/shared/Login';
import ResetPassword from './components/shared/ResetPassword';

// Desde admin/Dashboard.tsx
import MiPerfil from '../shared/MiPerfil';

// Desde vendedor/PuntoVenta.tsx  
import MiPerfil from '../shared/MiPerfil';

// Importar assets
import { imgRectangle, imgGroup, imgGroup1 } from '../shared/assets';
```

## 🔐 Autenticación

### Login.tsx

```typescript
import Login from './components/shared/Login';

<Login onLoginSuccess={checkAuth} />
```

**Props:**
- `onLoginSuccess?: () => void` - Callback después de login exitoso

**Funcionalidades:**
- ✅ Validación de email y contraseña
- ✅ Manejo de errores
- ✅ Redirección automática según rol
- ✅ Integración con AuthContext
- ✅ Enlace a recuperación de contraseña

### ResetPassword.tsx

```typescript
import ResetPassword from './components/shared/ResetPassword';

<Route path="/reset-password" element={<ResetPassword />} />
```

**Funcionalidades:**
- ✅ Validación de token desde URL
- ✅ Requisitos de contraseña segura
- ✅ Confirmación de contraseña
- ✅ Feedback visual de proceso

## 👤 Perfil de Usuario

### MiPerfil.tsx

```typescript
import MiPerfil from './components/shared/MiPerfil';

// Usar en Dashboard o cualquier vista
{activeMenu === "MiPerfil" && <MiPerfil />}
```

**Funcionalidades:**
- ✅ Ver información del usuario
- ✅ Editar datos personales
- ✅ Cambiar foto de perfil
- ✅ Actualizar contraseña
- ✅ Ver rol y permisos

## 🎨 Assets

### assets.ts

Contiene recursos compartidos como imágenes y placeholders:

```typescript
import { 
  imgRectangle,    // Avatar por defecto
  imgGroup,        // Gráfico 1
  imgGroup1,       // Gráfico 2
  imgGroup2        // Gráfico 3
} from '../shared/assets';

// Usar en componente
<img src={imgRectangle} alt="Avatar" />
```

## ✨ Buenas Prácticas

### ✅ Hacer
- ✅ Usar estos componentes en lugar de duplicar código
- ✅ Mantener componentes genéricos (sin lógica específica de rol)
- ✅ Exportar assets centralizados aquí
- ✅ Documentar props y uso de componentes

### ❌ Evitar
- ❌ Agregar lógica específica de un rol
- ❌ Componentes demasiado complejos
- ❌ Dependencias de otros roles (admin, vendedor, almacenero)
- ❌ Assets duplicados en otros directorios

## 🚀 Agregar Nuevo Componente Compartido

1. **Identifica que sea realmente compartido**
   - ¿Lo usan 2+ roles?
   - ¿Es genérico y reutilizable?
   - ¿No tiene lógica específica de rol?

2. **Crea el componente**
   ```typescript
   // src/components/shared/MiComponente.tsx
   export default function MiComponente({ ...props }) {
     return <div>...</div>;
   }
   ```

3. **Documenta su uso**
   - Agrega a este README
   - Documenta props
   - Agrega ejemplos de uso

4. **Actualiza importaciones**
   - Desde admin: `import MiComponente from '../shared/MiComponente';`
   - Desde vendedor: `import MiComponente from '../shared/MiComponente';`
   - Desde App: `import MiComponente from './components/shared/MiComponente';`

## 🎨 Diseño y Estilo

### Principios
- 🎨 Diseño neutral compatible con todos los roles
- 🎭 Soporte de tema claro/oscuro cuando aplique
- 📱 Responsive por defecto
- ♿ Accesibilidad (a11y)

### Fuentes y Colores
```css
/* Fuente principal */
font-family: 'Cairo', sans-serif;

/* Colores base (pueden variar por tema) */
--primary: #5bcfc5;
--success: #10b981;
--danger: #ef4444;
--warning: #f59e0b;
```

## 🔄 Componentes Futuros

Potenciales componentes para agregar a `/shared`:

- [ ] **Notifications.tsx** - Sistema de notificaciones
- [ ] **Modal.tsx** - Modal reutilizable
- [ ] **ConfirmDialog.tsx** - Diálogo de confirmación
- [ ] **DataTable.tsx** - Tabla de datos genérica
- [ ] **FormInput.tsx** - Input de formulario estandarizado
- [ ] **LoadingSpinner.tsx** - Indicador de carga
- [ ] **ErrorBoundary.tsx** - Manejo de errores
- [ ] **Toast.tsx** - Mensajes temporales
- [ ] **Breadcrumbs.tsx** - Migas de pan
- [ ] **Pagination.tsx** - Paginación genérica

## 📞 Guía de Decisión

**¿Cuándo poner un componente en `/shared`?**

✅ **SÍ, si:**
- Lo usan 2 o más roles
- Es genérico y reutilizable
- No tiene lógica de negocio específica
- Es una utilidad o UI común (botones, modales, etc.)

❌ **NO, si:**
- Es específico de un solo rol
- Tiene lógica de negocio compleja de un dominio
- Solo se usa en un contexto particular
- Requiere permisos especiales de un rol

## 🐛 Troubleshooting

**Problema:** Error al importar assets
- Verifica la ruta relativa desde tu componente
- Asegúrate de que assets.ts exporta el recurso

**Problema:** Props no definidas en TypeScript
- Agrega la interfaz de Props al componente
- Usa TypeScript para documentar props requeridas

**Problema:** Estilos no se aplican
- Verifica que los estilos inline o CSS modules sean correctos
- Revisa conflictos de clases CSS
