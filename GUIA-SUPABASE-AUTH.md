# 🔐 Guía Completa: Supabase Auth + Base de Datos

## 📋 Cambios Implementados

### Antes (Autenticación Manual)
```sql
CREATE TABLE usuario (
    id_usuario serial primary key,
    nombre_usuario varchar(50),
    password_hash varchar(255),  -- ❌ Tú gestionabas las contraseñas
    ...
);
```

**Problemas:**
- ❌ Tienes que hashear contraseñas manualmente
- ❌ Implementar recuperación de contraseña
- ❌ Gestionar tokens de sesión
- ❌ Dos fuentes de verdad (tu tabla vs auth)

---

### Ahora (Supabase Auth)
```sql
CREATE TABLE usuario (
    id_usuario serial primary key,
    id_auth uuid unique not null,  -- ⭐ Enlace con auth.users(id)
    email varchar(100) not null unique,
    dni varchar(8) not null unique,  -- ⭐ NUEVO: DNI obligatorio
    nombre_usuario varchar(50),
    nombre_completo varchar(150),
    id_rol int not null,
    foto_perfil_url varchar(500),
    telefono varchar(20),
    -- ❌ NO HAY password_hash
    ...
);
```

**Ventajas:**
- ✅ Supabase Auth gestiona contraseñas (bcrypt automático)
- ✅ Recuperación de contraseña built-in
- ✅ JWT automático
- ✅ Una sola fuente de verdad
- ✅ Email verification opcional
- ✅ OAuth providers disponibles (Google, GitHub, etc.)

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                   FRONTEND (React)                          │
│   supabase.auth.signInWithPassword(email, password)        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP Request
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE AUTH (Automático)                 │
│   • Valida email/password en auth.users                    │
│   • Genera JWT con claims:                                 │
│     - sub: id_auth (UUID)                                  │
│     - email: correo del usuario                            │
│     - user_metadata: {dni, nombre_completo, id_rol, ...}   │
└──────────────────────┬──────────────────────────────────────┘
                       │ Devuelve JWT
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  FRONTEND guarda JWT                        │
│   localStorage.setItem('supabase.auth.token', jwt)         │
└──────────────────────┬──────────────────────────────────────┘
                       │ Requests con JWT
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express API)                          │
│   1. Verifica JWT (con supabase.auth.getUser())            │
│   2. Extrae id_auth del JWT                                │
│   3. Busca en tabla usuario:                               │
│      SELECT * FROM usuario WHERE id_auth = [uuid]          │
│   4. Obtiene id_rol para permisos                          │
│   5. Ejecuta lógica de negocio                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Paso 1: Habilitar Email Auth en Supabase

1. Ir a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. **Authentication** → **Providers**
3. Buscar **Email** y asegurarte que está habilitado ✅
4. Configuraciones recomendadas:
   ```
   ✅ Enable Email Provider
   ✅ Confirm email (opcional para desarrollo, recomendado producción)
   ✅ Secure email change (recomendado)
   ⏱️ Mailer autoconfirm (disable en producción)
   ```

---

## 📝 Paso 2: Ejecutar el Script SQL Actualizado

1. Ir a **SQL Editor** en Supabase
2. Copiar y pegar el contenido de `script-base-de-datos-supabase.md`
3. Click en **Run**
4. Verificar que se crearon:
   - ✅ Tabla `usuario` con campos `id_auth`, `email`, `dni`
   - ✅ Trigger `fn_crear_perfil_usuario()`
   - ✅ Función `fn_actualizar_ultimo_acceso()`

---

## 👥 Paso 3: Crear Usuarios de Prueba

### Opción A: Desde Dashboard (Más Fácil)

1. **Authentication** → **Users** → **Add User**
2. Llenar formulario:
   ```
   Email: admin@botica.com
   Password: admin123
   Auto Confirm User: ✅ (para testing)
   ```
3. En **User Metadata (JSON)**, pegar:
   ```json
   {
     "dni": "12345678",
     "nombre_usuario": "admin.jperez",
     "nombre_completo": "Juan Pérez Gómez",
     "id_rol": 1,
     "telefono": "987654321"
   }
   ```
4. Click **Create User**
5. ✅ El trigger automáticamente crea la fila en `usuario`

**Repetir para los otros roles:**

**Vendedor:**
```json
{
  "email": "vendedor@botica.com",
  "password": "vendedor123",
  "metadata": {
    "dni": "87654321",
    "nombre_usuario": "vend.mlopez",
    "nombre_completo": "María López Ruiz",
    "id_rol": 2,
    "telefono": "976543210"
  }
}
```

**Almacenero:**
```json
{
  "email": "almacenero@botica.com",
  "password": "almacenero123",
  "metadata": {
    "dni": "11223344",
    "nombre_usuario": "alm.rsilva",
    "nombre_completo": "Roberto Silva Vargas",
    "id_rol": 3,
    "telefono": "965432109"
  }
}
```

---

### Opción B: Script SQL Temporal (Para Testing Rápido)

**⚠️ IMPORTANTE:** Este script inserta directamente en `auth.users`. Solo para desarrollo/testing.

```sql
-- Ejecutar en SQL Editor de Supabase

-- 1. Habilitar extensión pgcrypto si no está
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Administrador
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@botica.com',
    crypt('admin123', gen_salt('bf')),
    now(),
    jsonb_build_object(
        'dni', '12345678',
        'nombre_usuario', 'admin.jperez',
        'nombre_completo', 'Juan Pérez Gómez',
        'id_rol', 1,
        'telefono', '987654321'
    ),
    now(),
    now(),
    ''
);

-- 3. Vendedor
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'vendedor@botica.com',
    crypt('vendedor123', gen_salt('bf')),
    now(),
    jsonb_build_object(
        'dni', '87654321',
        'nombre_usuario', 'vend.mlopez',
        'nombre_completo', 'María López Ruiz',
        'id_rol', 2,
        'telefono', '976543210'
    ),
    now(),
    now(),
    ''
);

-- 4. Almacenero
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'almacenero@botica.com',
    crypt('almacenero123', gen_salt('bf')),
    now(),
    jsonb_build_object(
        'dni', '11223344',
        'nombre_usuario', 'alm.rsilva',
        'nombre_completo', 'Roberto Silva Vargas',
        'id_rol', 3,
        'telefono', '965432109'
    ),
    now(),
    now(),
    ''
);
```

**Verificar que se crearon:**
```sql
-- Ver usuarios en auth
SELECT id, email, raw_user_meta_data FROM auth.users;

-- Ver usuarios en tu tabla (creados por el trigger)
SELECT id_usuario, id_auth, email, dni, nombre_completo, id_rol 
FROM usuario;
```

---

### Opción C: Backend Admin API (Recomendado Producción)

```typescript
// backend/src/services/usuario.service.ts
import { supabase } from '@config/database';

export const crearUsuarioPersonal = async (data: {
  email: string;
  password: string;
  dni: string;
  nombre_usuario: string;
  nombre_completo: string;
  id_rol: number;
  telefono?: string;
}) => {
  // Usar Admin API de Supabase (requiere service_role key)
  const { data: authUser, error } = await supabase.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,  // Auto-confirmar email
    user_metadata: {
      dni: data.dni,
      nombre_usuario: data.nombre_usuario,
      nombre_completo: data.nombre_completo,
      id_rol: data.id_rol,
      telefono: data.telefono,
    },
  });

  if (error) {
    throw new Error(`Error al crear usuario: ${error.message}`);
  }

  // El trigger creó automáticamente la fila en usuario
  // Obtener el perfil completo
  const { data: usuario, error: errorUsuario } = await supabase
    .from('usuario')
    .select('*')
    .eq('id_auth', authUser.user.id)
    .single();

  if (errorUsuario) {
    throw new Error(`Error al obtener perfil: ${errorUsuario.message}`);
  }

  return usuario;
};
```

---

## 🔑 Paso 4: Login desde Frontend

### Configuración de Supabase Client

```typescript
// src/config/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
```

### Componente de Login

```tsx
// src/components/Login.tsx
import { useState } from 'react';
import { supabase } from '@/config/supabase';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Login con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // 2. Obtener perfil completo desde tu tabla usuario
      const { data: usuario, error: usuarioError } = await supabase
        .from('usuario')
        .select(`
          *,
          rol:id_rol(nombre_rol, descripcion)
        `)
        .eq('id_auth', authData.user.id)
        .single();

      if (usuarioError) throw usuarioError;

      // 3. Actualizar último acceso
      await supabase.rpc('fn_actualizar_ultimo_acceso', {
        user_id: authData.user.id,
      });

      // 4. Guardar en contexto/estado global
      console.log('Usuario autenticado:', usuario);
      
      // 5. Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Botica Control
        </h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="admin@botica.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <a href="#" className="text-blue-600 hover:underline">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </div>
  );
}
```

---

## 🛡️ Paso 5: Proteger Rutas y Verificar Rol

### Context de Autenticación

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/config/supabase';

interface Usuario {
  id_usuario: number;
  id_auth: string;
  email: string;
  dni: string;
  nombre_completo: string;
  foto_perfil_url?: string;
  rol: {
    nombre_rol: 'ADMINISTRATIVO' | 'VENDEDOR' | 'ALMACENERO';
    descripcion: string;
  };
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sesión al cargar
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        cargarUsuario(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await cargarUsuario(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUsuario(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const cargarUsuario = async (id_auth: string) => {
    const { data, error } = await supabase
      .from('usuario')
      .select(`
        *,
        rol:id_rol(nombre_rol, descripcion)
      `)
      .eq('id_auth', id_auth)
      .single();

    if (!error && data) {
      setUsuario(data);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### Componente de Ruta Protegida

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { usuario, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.rol.nombre_rol)) {
    return <div>No tienes permisos para acceder a esta página</div>;
  }

  return <>{children}</>;
}
```

### Uso en App.tsx

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';
import { Productos } from '@/components/Productos';
import { Usuarios } from '@/components/Usuarios';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/productos"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRATIVO', 'ALMACENERO']}>
                <Productos />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute allowedRoles={['ADMINISTRATIVO']}>
                <Usuarios />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

---

## 🔧 Paso 6: Backend con Express

### Middleware de Autenticación

```typescript
// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '@config/database';

export interface AuthRequest extends Request {
  user?: {
    id_auth: string;
    id_usuario: number;
    email: string;
    rol: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1. Obtener token del header
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No autorizado' });
    }

    // 2. Verificar token con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // 3. Buscar usuario en tu tabla
    const { data: usuario, error: errorUsuario } = await supabase
      .from('usuario')
      .select('id_usuario, id_rol(nombre_rol)')
      .eq('id_auth', user.id)
      .single();

    if (errorUsuario || !usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // 4. Adjuntar datos al request
    req.user = {
      id_auth: user.id,
      id_usuario: usuario.id_usuario,
      email: user.email!,
      rol: usuario.id_rol.nombre_rol,
    };

    next();
  } catch (error) {
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Middleware para verificar rol
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    next();
  };
};
```

### Uso en Rutas

```typescript
// backend/src/routes/producto.routes.ts
import { Router } from 'express';
import { authenticate, requireRole } from '@middlewares/auth.middleware';
import * as productoController from '@controllers/producto.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Listar productos: todos los roles
router.get('/', productoController.getAll);

// Crear producto: solo admin y almacenero
router.post(
  '/',
  requireRole('ADMINISTRATIVO', 'ALMACENERO'),
  productoController.create
);

// Eliminar producto: solo admin
router.delete(
  '/:id',
  requireRole('ADMINISTRATIVO'),
  productoController.remove
);

export default router;
```

---

## 📊 Consultas Útiles

### Obtener usuario con rol

```sql
SELECT 
  u.id_usuario,
  u.id_auth,
  u.email,
  u.dni,
  u.nombre_usuario,
  u.nombre_completo,
  u.foto_perfil_url,
  u.telefono,
  r.nombre_rol,
  r.descripcion as rol_descripcion
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
WHERE u.id_auth = 'uuid-del-usuario';
```

### Verificar usuarios creados

```sql
-- En auth.users
SELECT 
  id,
  email,
  created_at,
  raw_user_meta_data->'nombre_completo' as nombre,
  raw_user_meta_data->'id_rol' as rol
FROM auth.users
ORDER BY created_at DESC;

-- En tu tabla usuario
SELECT 
  u.email,
  u.dni,
  u.nombre_completo,
  r.nombre_rol
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
ORDER BY u.fecha_registro DESC;
```

---

## 🎯 Credenciales de Testing

Después de crear los usuarios, podrás usar:

| Email | Password | Rol | DNI |
|-------|----------|-----|-----|
| admin@botica.com | admin123 | ADMINISTRATIVO | 12345678 |
| vendedor@botica.com | vendedor123 | VENDEDOR | 87654321 |
| almacenero@botica.com | almacenero123 | ALMACENERO | 11223344 |

---

## ✅ Checklist de Implementación

- [ ] Habilitar Email Provider en Supabase Dashboard
- [ ] Ejecutar script SQL actualizado (con triggers)
- [ ] Crear 3 usuarios de prueba (admin, vendedor, almacenero)
- [ ] Verificar que se crearon filas en `usuario`
- [ ] Configurar Supabase client en frontend
- [ ] Implementar componente Login
- [ ] Implementar AuthContext
- [ ] Proteger rutas con ProtectedRoute
- [ ] Implementar middleware de auth en backend
- [ ] Probar login con cada rol
- [ ] Verificar permisos por rol

---

**¡Sistema de autenticación profesional listo!** 🎉
