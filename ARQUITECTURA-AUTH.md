# 🏗️ Arquitectura de Autenticación - Botica Control

## Diagrama General del Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React)                           │
│                                                                 │
│  ┌──────────────┐    ┌─────────────┐    ┌──────────────┐      │
│  │   Login      │ →  │   AuthContext│ →  │  Protected   │      │
│  │  Component   │    │   (Estado)   │    │   Routes     │      │
│  └──────────────┘    └─────────────┘    └──────────────┘      │
│         │                    │                    │             │
│         │ signInWithPassword │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────┐       │
│  │        Supabase Client (JavaScript SDK)             │       │
│  │  - Gestiona tokens JWT automáticamente              │       │
│  │  - Persiste sesión en localStorage                  │       │
│  │  - Auto-refresh de tokens                           │       │
│  └─────────────────────────────────────────────────────┘       │
└───────────────────────────┬─────────────────────────────────────┘
                            │ HTTPS
                            │ Authorization: Bearer <JWT>
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE CLOUD                               │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              SUPABASE AUTH SERVICE                   │       │
│  │  • Valida credenciales (email/password)             │       │
│  │  • Genera JWT con claims:                           │       │
│  │    - sub: id_auth (UUID)                            │       │
│  │    - email: correo del usuario                      │       │
│  │    - user_metadata: {dni, nombre, rol, ...}         │       │
│  │  • Maneja recuperación de contraseña                │       │
│  │  • Email verification                                │       │
│  └─────────────────────────────────────────────────────┘       │
│                            │                                    │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────┐       │
│  │              auth.users (Tabla Interna)             │       │
│  │  ┌──────────┬──────────────┬─────────────────┐     │       │
│  │  │ id (uuid)│ email        │ encrypted_pwd   │     │       │
│  │  ├──────────┼──────────────┼─────────────────┤     │       │
│  │  │ abc-123  │ admin@...    │ $2b$10$...      │     │       │
│  │  │ def-456  │ vendedor@... │ $2b$10$...      │     │       │
│  │  └──────────┴──────────────┴─────────────────┘     │       │
│  │                                                      │       │
│  │  Campos adicionales:                                │       │
│  │  • raw_user_meta_data: {dni, nombre, id_rol, ...}  │       │
│  │  • created_at, updated_at, last_sign_in_at         │       │
│  │  • confirmation_token, recovery_token               │       │
│  └─────────────────────────────────────────────────────┘       │
│                            │                                    │
│                            │ Trigger automático                 │
│                            ▼                                    │
│  ┌─────────────────────────────────────────────────────┐       │
│  │         usuario (Tu Tabla de Perfil)                │       │
│  │  ┌───────────┬──────────┬───────┬──────────────┐   │       │
│  │  │ id_usuario│ id_auth  │ dni   │ nombre_comp. │   │       │
│  │  ├───────────┼──────────┼───────┼──────────────┤   │       │
│  │  │ 1         │ abc-123  │ 12..8 │ Juan Pérez   │   │       │
│  │  │ 2         │ def-456  │ 87..1 │ María López  │   │       │
│  │  └───────────┴──────────┴───────┴──────────────┘   │       │
│  │                          │                          │       │
│  │                          ▼                          │       │
│  │  ┌─────────────────────────────────────────┐       │       │
│  │  │          rol (Tabla de Roles)            │       │       │
│  │  │  • ADMINISTRATIVO                        │       │       │
│  │  │  • VENDEDOR                              │       │       │
│  │  │  • ALMACENERO                            │       │       │
│  │  └─────────────────────────────────────────┘       │       │
│  └─────────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
                            │ PostgreSQL Connection
                            │ (Para operaciones de negocio)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Express API)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐          │
│  │     Middleware: authenticate()                    │          │
│  │  1. Extrae JWT del header Authorization          │          │
│  │  2. Verifica JWT con Supabase Auth               │          │
│  │  3. Obtiene id_auth del JWT                      │          │
│  │  4. Busca usuario en tabla usuario:              │          │
│  │     SELECT * FROM usuario                        │          │
│  │     WHERE id_auth = 'abc-123'                    │          │
│  │  5. Obtiene id_rol para permisos                 │          │
│  │  6. Adjunta datos a req.user                     │          │
│  └──────────────────────────────────────────────────┘          │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │     Middleware: requireRole()                     │          │
│  │  Verifica que req.user.rol esté en lista         │          │
│  │  de roles permitidos para ese endpoint           │          │
│  └──────────────────────────────────────────────────┘          │
│                         │                                       │
│                         ▼                                       │
│  ┌──────────────────────────────────────────────────┐          │
│  │          Controllers                              │          │
│  │  Ejecutan lógica de negocio con usuario          │          │
│  │  autenticado y rol verificado                    │          │
│  └──────────────────────────────────────────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Flujo Detallado de Login

```
┌──────────────┐
│   USUARIO    │
│ Ingresa      │
│ email/pass   │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Frontend llama a Supabase Auth                  │
│                                                          │
│ const { data, error } = await supabase.auth             │
│   .signInWithPassword({                                 │
│     email: 'admin@botica.com',                          │
│     password: 'admin123'                                │
│   });                                                   │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 2: Supabase Auth valida credenciales              │
│                                                          │
│ 1. Busca email en auth.users                           │
│ 2. Compara password con bcrypt                         │
│ 3. Si correcto:                                         │
│    ✅ Genera JWT con claims:                            │
│       {                                                 │
│         "sub": "uuid-del-usuario",                     │
│         "email": "admin@botica.com",                   │
│         "user_metadata": {                             │
│           "dni": "12345678",                           │
│           "nombre_completo": "Juan Pérez",             │
│           "id_rol": 1                                  │
│         }                                               │
│       }                                                 │
│    ✅ Actualiza last_sign_in_at                        │
│    ✅ Devuelve JWT + refresh_token                     │
│                                                         │
│ 4. Si incorrecto:                                      │
│    ❌ Error: "Invalid login credentials"              │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 3: Frontend recibe respuesta                       │
│                                                          │
│ Si exitoso:                                             │
│   • Supabase SDK guarda JWT automáticamente            │
│     en localStorage bajo 'supabase.auth.token'         │
│   • Configura auto-refresh de tokens                   │
│                                                         │
│ Luego frontend hace query adicional:                   │
│                                                         │
│ const { data: usuario } = await supabase               │
│   .from('usuario')                                     │
│   .select('*, rol:id_rol(nombre_rol)')                │
│   .eq('id_auth', data.user.id)                        │
│   .single();                                           │
│                                                         │
│ Actualiza último acceso:                               │
│                                                         │
│ await supabase.rpc('fn_actualizar_ultimo_acceso', {   │
│   user_id: data.user.id                               │
│ });                                                    │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 4: Frontend guarda datos en contexto              │
│                                                          │
│ setUser({                                               │
│   id_usuario: 1,                                        │
│   id_auth: 'uuid',                                     │
│   email: 'admin@botica.com',                           │
│   nombre_completo: 'Juan Pérez',                       │
│   rol: 'ADMINISTRATIVO'                                 │
│ });                                                     │
│                                                         │
│ navigate('/dashboard');                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de Request Autenticado

```
┌──────────────┐
│  FRONTEND    │
│ Click en     │
│ "Ver Ventas" │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 1: Frontend hace request con JWT                   │
│                                                          │
│ fetch('https://api.botica.com/ventas', {                │
│   headers: {                                            │
│     'Authorization': 'Bearer eyJhbGci...'              │
│   }                                                     │
│ });                                                     │
│                                                         │
│ // El JWT lo obtiene Supabase SDK automáticamente      │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 2: Backend recibe request                          │
│                                                          │
│ Middleware authenticate() se ejecuta:                   │
│                                                         │
│ 1. Extrae token del header:                            │
│    const token = req.headers                           │
│      .authorization?.replace('Bearer ', '');           │
│                                                         │
│ 2. Verifica con Supabase:                              │
│    const { data, error } = await supabase.auth        │
│      .getUser(token);                                  │
│                                                         │
│ 3. Si inválido → 401 Unauthorized                     │
│                                                         │
│ 4. Si válido, busca en tabla usuario:                 │
│    const usuario = await supabase                      │
│      .from('usuario')                                  │
│      .select('id_usuario, id_rol(nombre_rol)')        │
│      .eq('id_auth', data.user.id)                     │
│      .single();                                        │
│                                                         │
│ 5. Adjunta al request:                                 │
│    req.user = {                                        │
│      id_auth: data.user.id,                           │
│      id_usuario: usuario.id_usuario,                  │
│      rol: usuario.id_rol.nombre_rol                   │
│    };                                                  │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 3: Middleware requireRole() verifica permisos      │
│                                                          │
│ // Ruta requiere rol VENDEDOR o ADMINISTRATIVO         │
│ router.get('/ventas',                                   │
│   authenticate,                                         │
│   requireRole('VENDEDOR', 'ADMINISTRATIVO'),           │
│   getVentas                                             │
│ );                                                      │
│                                                         │
│ if (!['VENDEDOR', 'ADMINISTRATIVO']                    │
│     .includes(req.user.rol)) {                         │
│   return 403 Forbidden                                 │
│ }                                                       │
└──────┬──────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────┐
│ PASO 4: Controller ejecuta lógica                       │
│                                                          │
│ const getVentas = async (req, res) => {                │
│   const { id_usuario, rol } = req.user;                │
│                                                         │
│   // Si es vendedor, solo ve sus ventas                │
│   const query = supabase                                │
│     .from('venta')                                      │
│     .select('*');                                       │
│                                                         │
│   if (rol === 'VENDEDOR') {                            │
│     query.eq('id_usuario', id_usuario);                │
│   }                                                     │
│                                                         │
│   const { data } = await query;                        │
│   res.json(data);                                       │
│ };                                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Tabla de Roles y Permisos

| Endpoint | ADMINISTRATIVO | VENDEDOR | ALMACENERO |
|----------|----------------|----------|------------|
| GET /dashboard | ✅ | ✅ | ✅ |
| GET /productos | ✅ | ✅ Ver | ✅ |
| POST /productos | ✅ | ❌ | ✅ |
| PUT /productos/:id | ✅ | ❌ | ✅ |
| DELETE /productos/:id | ✅ | ❌ | ❌ |
| GET /ventas | ✅ Todas | ✅ Solo suyas | ❌ |
| POST /ventas | ✅ | ✅ | ❌ |
| GET /inventario | ✅ | ✅ Ver | ✅ |
| POST /inventario/lote | ✅ | ❌ | ✅ |
| GET /usuarios | ✅ | ❌ | ❌ |
| POST /usuarios | ✅ | ❌ | ❌ |
| GET /reportes | ✅ | ✅ Limitado | ❌ |

---

## Estructura de JWT

```json
{
  "aud": "authenticated",
  "exp": 1736707200,
  "iat": 1736620800,
  "sub": "abc-123-uuid-del-usuario",
  "email": "admin@botica.com",
  "phone": "",
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {
    "dni": "12345678",
    "nombre_usuario": "admin.jperez",
    "nombre_completo": "Juan Pérez Gómez",
    "id_rol": 1,
    "telefono": "987654321"
  },
  "role": "authenticated",
  "aal": "aal1",
  "amr": [
    {
      "method": "password",
      "timestamp": 1736620800
    }
  ],
  "session_id": "xyz-session-id"
}
```

**Campos importantes:**
- `sub`: UUID del usuario → Úsalo como `id_auth`
- `email`: Email del usuario
- `user_metadata`: Datos personalizados (DNI, nombre, rol)
- `exp`: Timestamp de expiración

---

## Relaciones de Tablas

```
┌─────────────────┐
│      rol        │
│─────────────────│
│ id_rol (PK)     │◄─────┐
│ nombre_rol      │      │
│ descripcion     │      │
└─────────────────┘      │
                         │
                         │ FK: id_rol
                         │
┌─────────────────┐      │
│ auth.users      │      │
│─────────────────│      │
│ id (PK, UUID)   │◄──┐  │
│ email           │   │  │
│ encrypted_pwd   │   │  │
│ user_metadata   │   │  │
└─────────────────┘   │  │
                      │  │
                      │  │ FK: id_auth
                      │  │
┌─────────────────────────────────┐
│          usuario                │
│─────────────────────────────────│
│ id_usuario (PK)                 │
│ id_auth (FK → auth.users.id)   │──┘
│ id_rol (FK → rol.id_rol)       │────┘
│ email                           │
│ dni (UNIQUE)                    │
│ nombre_usuario                  │
│ nombre_completo                 │
│ foto_perfil_url                 │
│ telefono                        │
│ ultimo_acceso                   │
└─────────────────────────────────┘
         │
         │ FK: id_usuario
         ▼
┌─────────────────┐
│     venta       │
│─────────────────│
│ id_venta (PK)   │
│ id_usuario (FK) │
│ id_cliente      │
│ total_pagar     │
└─────────────────┘
         │
         │ FK: id_usuario
         ▼
┌─────────────────┐
│   movimiento    │
│─────────────────│
│ id_movimiento   │
│ id_usuario (FK) │
│ tipo_movimiento │
└─────────────────┘
```

---

## Seguridad: Row Level Security (RLS)

```sql
-- Ejemplo de política RLS en tabla usuario
ALTER TABLE usuario ENABLE ROW LEVEL SECURITY;

-- Los usuarios solo pueden ver su propio perfil
CREATE POLICY "Usuarios pueden ver su perfil"
ON usuario FOR SELECT
TO authenticated
USING (id_auth = auth.uid());

-- Solo admin puede ver todos los usuarios
CREATE POLICY "Admin puede ver todos"
ON usuario FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM usuario
    WHERE id_auth = auth.uid()
    AND id_rol = 1  -- ADMINISTRATIVO
  )
);
```

---

## Monitoreo y Auditoría

### Logs de Autenticación

```sql
-- Ver últimos logins
SELECT 
  u.email,
  u.nombre_completo,
  r.nombre_rol,
  u.ultimo_acceso
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
ORDER BY u.ultimo_acceso DESC
LIMIT 10;
```

### Usuarios Activos

```sql
-- Usuarios con login en últimas 24 horas
SELECT 
  u.email,
  u.nombre_completo,
  r.nombre_rol,
  u.ultimo_acceso
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
WHERE u.ultimo_acceso > NOW() - INTERVAL '24 hours'
ORDER BY u.ultimo_acceso DESC;
```

---

**Arquitectura robusta y escalable lista para producción** ✨
