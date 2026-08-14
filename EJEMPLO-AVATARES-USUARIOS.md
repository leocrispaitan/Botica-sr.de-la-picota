# 👥 Avatares de Usuarios - Ejemplos Visuales

## URLs Configuradas en la Base de Datos

Las URLs de las fotos de perfil están almacenadas en la columna `foto_perfil_url` de la tabla `usuario`.

---

## 1. Administrador - Juan Pérez Gómez

**Datos del Usuario:**
- **ID:** 1
- **Usuario:** admin.jperez
- **Nombre Completo:** Juan Pérez Gómez
- **Rol:** ADMINISTRATIVO
- **Color:** Azul (#3b82f6)

**URL del Avatar:**
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200
```

**Vista Previa:**
- Fondo: Azul vibrante
- Iniciales: **JP**
- Color de texto: Blanco
- Tamaño: 200x200px

**Uso en Frontend:**
```tsx
<Avatar
  src="https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200"
  name="Juan Pérez Gómez"
  size="lg"
/>
```

---

## 2. Vendedor - María López Ruiz

**Datos del Usuario:**
- **ID:** 2
- **Usuario:** vend.mlopez
- **Nombre Completo:** María López Ruiz
- **Rol:** VENDEDOR
- **Color:** Verde (#10b981)

**URL del Avatar:**
```
https://ui-avatars.com/api/?name=Maria+Lopez&background=10b981&color=fff&size=200
```

**Vista Previa:**
- Fondo: Verde esmeralda
- Iniciales: **ML**
- Color de texto: Blanco
- Tamaño: 200x200px

**Uso en Frontend:**
```tsx
<Avatar
  src="https://ui-avatars.com/api/?name=Maria+Lopez&background=10b981&color=fff&size=200"
  name="María López Ruiz"
  size="lg"
/>
```

---

## 3. Almacenero - Roberto Silva Vargas

**Datos del Usuario:**
- **ID:** 3
- **Usuario:** alm.rsilva
- **Nombre Completo:** Roberto Silva Vargas
- **Rol:** ALMACENERO
- **Color:** Amarillo/Naranja (#f59e0b)

**URL del Avatar:**
```
https://ui-avatars.com/api/?name=Roberto+Silva&background=f59e0b&color=fff&size=200
```

**Vista Previa:**
- Fondo: Amarillo/Naranja cálido
- Iniciales: **RS**
- Color de texto: Blanco
- Tamaño: 200x200px

**Uso en Frontend:**
```tsx
<Avatar
  src="https://ui-avatars.com/api/?name=Roberto+Silva&background=f59e0b&color=fff&size=200"
  name="Roberto Silva Vargas"
  size="lg"
/>
```

---

## Paleta de Colores por Rol

| Rol | Color | Hex | Tailwind Class |
|-----|-------|-----|----------------|
| **Administrativo** | Azul | `#3b82f6` | `bg-blue-500` |
| **Vendedor** | Verde | `#10b981` | `bg-emerald-500` |
| **Almacenero** | Amarillo/Naranja | `#f59e0b` | `bg-amber-500` |

---

## Diferentes Tamaños de Avatar

### Pequeño (40px)
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=40
```

### Mediano (80px)
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=80
```

### Grande (200px) - Por defecto
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200
```

### Extra Grande (400px)
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=400
```

---

## Personalizaciones Adicionales

### Avatar Redondeado
Agregar parámetro `rounded=true`:
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200&rounded=true
```

### Texto en Negrita
Agregar parámetro `bold=true`:
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200&bold=true
```

### Formato SVG (recomendado para web)
Agregar parámetro `format=svg`:
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200&format=svg
```

### Combinación Completa
```
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200&rounded=true&bold=true&format=svg
```

---

## Componente React para Avatar

```tsx
// components/UserAvatar.tsx
import { useState } from 'react';

interface UserAvatarProps {
  usuario: {
    foto_perfil_url?: string | null;
    nombre_completo: string;
    rol: string;
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  showRole?: boolean;
}

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

const roleColors = {
  ADMINISTRATIVO: 'from-blue-500 to-blue-600',
  VENDEDOR: 'from-emerald-500 to-emerald-600',
  ALMACENERO: 'from-amber-500 to-amber-600',
};

export function UserAvatar({
  usuario,
  size = 'md',
  showName = false,
  showRole = false,
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarElement = usuario.foto_perfil_url && !imageError ? (
    <img
      src={usuario.foto_perfil_url}
      alt={usuario.nombre_completo}
      className={`rounded-full object-cover ${sizeMap[size]}`}
      onError={() => setImageError(true)}
    />
  ) : (
    <div
      className={`rounded-full bg-gradient-to-br ${
        roleColors[usuario.rol as keyof typeof roleColors] || 'from-gray-500 to-gray-600'
      } flex items-center justify-center text-white font-semibold ${sizeMap[size]}`}
    >
      {getInitials(usuario.nombre_completo)}
    </div>
  );

  if (!showName && !showRole) {
    return avatarElement;
  }

  return (
    <div className="flex items-center gap-3">
      {avatarElement}
      {(showName || showRole) && (
        <div className="flex flex-col">
          {showName && (
            <span className="font-medium text-gray-900">
              {usuario.nombre_completo}
            </span>
          )}
          {showRole && (
            <span className="text-sm text-gray-500">{usuario.rol}</span>
          )}
        </div>
      )}
    </div>
  );
}
```

---

## Ejemplos de Uso en Componentes

### 1. En Header/Navbar

```tsx
function Header() {
  const { usuario } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold">Botica Control</h1>
        
        <UserAvatar
          usuario={usuario}
          size="md"
          showName={true}
        />
      </div>
    </header>
  );
}
```

### 2. En Dropdown de Usuario

```tsx
function UserMenu() {
  const { usuario } = useAuth();

  return (
    <Menu>
      <MenuButton>
        <UserAvatar usuario={usuario} size="md" />
      </MenuButton>
      
      <MenuItems>
        <MenuItem>
          <UserAvatar
            usuario={usuario}
            size="lg"
            showName={true}
            showRole={true}
          />
        </MenuItem>
        <MenuItem>Mi Perfil</MenuItem>
        <MenuItem>Configuración</MenuItem>
        <MenuItem>Cerrar Sesión</MenuItem>
      </MenuItems>
    </Menu>
  );
}
```

### 3. En Lista de Usuarios

```tsx
function UserList({ usuarios }) {
  return (
    <div className="space-y-3">
      {usuarios.map((usuario) => (
        <div key={usuario.id_usuario} className="flex items-center gap-3 p-3 border rounded">
          <UserAvatar
            usuario={usuario}
            size="md"
            showName={true}
            showRole={true}
          />
          <div className="ml-auto">
            <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded">
              Ver Detalle
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4. En Perfil de Usuario

```tsx
function UserProfile({ usuario }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center">
        <UserAvatar usuario={usuario} size="xl" />
        
        <h2 className="mt-4 text-2xl font-bold">
          {usuario.nombre_completo}
        </h2>
        
        <span className="mt-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
          {usuario.rol}
        </span>
        
        <div className="mt-6 w-full space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Usuario:</span>
            <span className="font-medium">{usuario.nombre_usuario}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Último acceso:</span>
            <span className="font-medium">
              {new Date(usuario.ultimo_acceso).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Datos de Consulta desde Backend

### Query SQL con Avatar

```sql
SELECT
  u.id_usuario,
  u.nombre_usuario,
  u.nombre_completo,
  u.foto_perfil_url,
  u.ultimo_acceso,
  r.nombre_rol as rol
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
WHERE u.estado_logico = true
ORDER BY u.nombre_completo;
```

### Endpoint Backend

```typescript
// GET /api/v1/auth/me
export const getCurrentUser = async (req: Request, res: Response) => {
  const userId = req.user.id; // Del JWT

  const { data, error } = await supabase
    .from('usuario')
    .select(`
      id_usuario,
      nombre_usuario,
      nombre_completo,
      foto_perfil_url,
      ultimo_acceso,
      rol:id_rol(nombre_rol)
    `)
    .eq('id_usuario', userId)
    .single();

  if (error) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  res.json({
    ...data,
    rol: data.rol.nombre_rol,
  });
};
```

---

## Migración Futura a Fotos Reales

Cuando decidas permitir que los usuarios suban fotos reales:

1. Crea bucket en Supabase Storage llamado `usuarios`
2. Configura políticas de seguridad
3. Implementa endpoint de upload
4. Las URLs de UI Avatars seguirán funcionando como fallback
5. Actualiza gradualmente los usuarios a fotos reales

**No hay cambios en el frontend**, el componente `UserAvatar` ya maneja ambos casos automáticamente.

---

**Vista Previa en Navegador:**

Puedes copiar y pegar estas URLs directamente en tu navegador para ver los avatares:

- **Administrador:** https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200
- **Vendedor:** https://ui-avatars.com/api/?name=Maria+Lopez&background=10b981&color=fff&size=200
- **Almacenero:** https://ui-avatars.com/api/?name=Roberto+Silva&background=f59e0b&color=fff&size=200

---

**Última actualización:** 2026-08-12
