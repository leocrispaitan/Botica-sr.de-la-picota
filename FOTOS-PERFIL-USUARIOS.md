# 📸 Gestión de Fotos de Perfil de Usuarios

## Campo en Base de Datos

La tabla `usuario` incluye el campo `foto_perfil_url`:

```sql
foto_perfil_url varchar(500)  -- URL de la imagen de perfil (nullable)
```

---

## Opciones de Almacenamiento

### 1. **Supabase Storage (Recomendado)**

Ventajas:
- ✅ Almacenamiento integrado con tu base de datos
- ✅ CDN global para carga rápida
- ✅ 1GB gratis en plan gratuito
- ✅ URLs permanentes y seguras
- ✅ Control de acceso y políticas de seguridad

**Configuración:**

```typescript
// Upload a Supabase Storage
import { supabase } from './config/supabase';

async function uploadAvatar(file: File, userId: number) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  // Subir archivo
  const { data, error } = await supabase.storage
    .from('usuarios')
    .upload(filePath, file);

  if (error) throw error;

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('usuarios')
    .getPublicUrl(filePath);

  // Actualizar usuario
  await supabase
    .from('usuario')
    .update({ foto_perfil_url: publicUrl })
    .eq('id_usuario', userId);

  return publicUrl;
}
```

**URLs de ejemplo:**
```
https://[project-id].supabase.co/storage/v1/object/public/usuarios/avatars/1-1705334400000.jpg
```

---

### 2. **UI Avatars (Usado en datos de ejemplo)**

Servicio gratuito que genera avatares con iniciales.

**URLs actuales en la base de datos:**

```javascript
// Administrador (Azul)
https://ui-avatars.com/api/?name=Juan+Perez&background=3b82f6&color=fff&size=200

// Vendedor (Verde)
https://ui-avatars.com/api/?name=Maria+Lopez&background=10b981&color=fff&size=200

// Almacenero (Amarillo)
https://ui-avatars.com/api/?name=Roberto+Silva&background=f59e0b&color=fff&size=200
```

**Parámetros personalizables:**

| Parámetro | Descripción | Ejemplo |
|-----------|-------------|---------|
| `name` | Nombre completo (con +) | `Juan+Perez` |
| `background` | Color de fondo (hex sin #) | `3b82f6` |
| `color` | Color del texto (hex sin #) | `fff` |
| `size` | Tamaño en píxeles | `200` |
| `rounded` | Bordes redondeados | `true` |
| `bold` | Texto en negrita | `true` |
| `format` | Formato (svg o png) | `svg` |

**Ejemplo de uso:**
```
https://ui-avatars.com/api/?name=Carlos+Martinez&background=random&size=200&rounded=true&bold=true
```

Ventajas:
- ✅ Gratuito sin límites
- ✅ No requiere registro
- ✅ Personalizable
- ✅ Ideal para placeholders

Desventajas:
- ❌ Servicio externo (depende de terceros)
- ❌ No permite subir fotos reales

---

### 3. **Cloudinary**

Plataforma de gestión de imágenes en la nube.

Características:
- ✅ Optimización automática de imágenes
- ✅ Transformaciones en tiempo real (resize, crop, filters)
- ✅ 25GB gratis/mes
- ✅ CDN global

**Ejemplo de URL:**
```
https://res.cloudinary.com/tu-cloud-name/image/upload/v1234567890/avatars/usuario-1.jpg
```

---

### 4. **ImgBB**

Servicio de hosting de imágenes gratuito.

**Ejemplo de URL:**
```
https://i.ibb.co/abc123/avatar.jpg
```

---

### 5. **Gravatar**

Sistema de avatares global basado en email.

**Ejemplo:**
```typescript
import crypto from 'crypto';

function getGravatarUrl(email: string, size: number = 200) {
  const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`;
}

// Ejemplo
getGravatarUrl('juan@example.com', 200);
// https://www.gravatar.com/avatar/abc123...?s=200&d=identicon
```

---

## Implementación en Frontend

### Componente Avatar

```tsx
// components/Avatar.tsx
interface AvatarProps {
  src?: string | null;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-2xl',
};

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  // Función para obtener iniciales
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Si tiene URL y no hay error, mostrar imagen
  if (src && !imageError) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${sizeClasses[size]} ${className}`}
        onError={() => setImageError(true)}
      />
    );
  }

  // Fallback: avatar con iniciales
  return (
    <div
      className={`rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold ${sizeClasses[size]} ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
```

### Uso del Componente

```tsx
import { Avatar } from './components/Avatar';

function UserProfile({ user }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar
        src={user.foto_perfil_url}
        name={user.nombre_completo}
        size="lg"
      />
      <div>
        <h3 className="font-semibold">{user.nombre_completo}</h3>
        <p className="text-sm text-gray-500">{user.rol}</p>
      </div>
    </div>
  );
}
```

---

## Actualización de Foto de Perfil

### Endpoint Backend

```typescript
// POST /api/v1/usuarios/:id/avatar
export const updateAvatar = async (req: Request, res: Response) => {
  const { id } = req.params;
  const file = req.file; // Multer middleware

  if (!file) {
    return res.status(400).json({ error: 'No se proporcionó archivo' });
  }

  // Subir a Supabase Storage
  const { data, error } = await supabase.storage
    .from('usuarios')
    .upload(`avatars/${id}-${Date.now()}.${file.mimetype.split('/')[1]}`, file.buffer);

  if (error) {
    return res.status(500).json({ error: 'Error al subir imagen' });
  }

  // Obtener URL pública
  const { data: { publicUrl } } = supabase.storage
    .from('usuarios')
    .getPublicUrl(data.path);

  // Actualizar base de datos
  await supabase
    .from('usuario')
    .update({ foto_perfil_url: publicUrl })
    .eq('id_usuario', id);

  res.json({ foto_perfil_url: publicUrl });
};
```

### Formulario Frontend

```tsx
function UploadAvatar({ userId }: { userId: number }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tamaño (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('La imagen no debe superar 2MB');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten imágenes');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await fetch(`/api/v1/usuarios/${userId}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();
      
      // Actualizar UI
      console.log('Nueva URL:', data.foto_perfil_url);
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="cursor-pointer">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        <div className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          {uploading ? 'Subiendo...' : 'Cambiar Foto'}
        </div>
      </label>
    </div>
  );
}
```

---

## Validaciones Recomendadas

### Backend

```typescript
// Validación con Zod
import { z } from 'zod';

const avatarSchema = z.object({
  file: z.object({
    mimetype: z.string().refine(
      (type) => type.startsWith('image/'),
      'Solo se permiten imágenes'
    ),
    size: z.number().max(2 * 1024 * 1024, 'Máximo 2MB'),
  }),
});
```

### Frontend

```typescript
const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const maxSizeBytes = 2 * 1024 * 1024; // 2MB

function validateImage(file: File): string | null {
  if (!validImageTypes.includes(file.type)) {
    return 'Formato no permitido. Use JPG, PNG, GIF o WebP';
  }
  
  if (file.size > maxSizeBytes) {
    return 'La imagen no debe superar 2MB';
  }
  
  return null; // Sin errores
}
```

---

## Políticas de Seguridad en Supabase Storage

```sql
-- Crear bucket
insert into storage.buckets (id, name, public)
values ('usuarios', 'usuarios', true);

-- Política: Cualquiera puede VER
create policy "Avatares son públicos"
on storage.objects for select
using ( bucket_id = 'usuarios' );

-- Política: Solo el usuario autenticado puede SUBIR
create policy "Usuarios pueden subir su avatar"
on storage.objects for insert
with check (
  bucket_id = 'usuarios' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Política: Solo el usuario puede ACTUALIZAR su avatar
create policy "Usuarios pueden actualizar su avatar"
on storage.objects for update
using (
  bucket_id = 'usuarios'
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Política: Solo el usuario puede ELIMINAR su avatar
create policy "Usuarios pueden eliminar su avatar"
on storage.objects for delete
using (
  bucket_id = 'usuarios'
  and auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Resumen de Recomendaciones

### Para Desarrollo/MVP:
✅ Usar **UI Avatars** como placeholder (ya configurado)
✅ No requiere configuración adicional

### Para Producción:
✅ Migrar a **Supabase Storage** para fotos reales
✅ Implementar upload desde frontend
✅ Configurar políticas de seguridad
✅ Mantener UI Avatars como fallback

### Mejores Prácticas:
- ✅ Validar tamaño máximo (2MB recomendado)
- ✅ Validar formatos (JPG, PNG, WebP)
- ✅ Optimizar imágenes antes de subir
- ✅ Usar lazy loading para avatares
- ✅ Implementar fallback a iniciales si falla la carga

---

**Última actualización:** 2026-08-12
