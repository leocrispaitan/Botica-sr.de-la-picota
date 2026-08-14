# 📋 Resumen de Cambios: Base de Datos + Supabase Auth

## 🎯 Objetivo de los Cambios

Migrar de autenticación manual (con `password_hash` en tu tabla) a **Supabase Auth**, delegando toda la gestión de contraseñas, tokens y seguridad a Supabase.

---

## ⚡ Cambios Principales

### 1. Tabla `usuario` - ANTES vs AHORA

#### ❌ ANTES (Autenticación Manual)

```sql
CREATE TABLE usuario (
    id_usuario serial primary key,
    nombre_usuario varchar(50) not null unique,
    nombre_completo varchar(150) not null,
    id_rol int not null,
    password_hash varchar(255) not null,  -- ❌ Gestionabas tú las contraseñas
    foto_perfil_url varchar(500),
    ultimo_acceso timestamp,
    estado_logico boolean not null default true,
    fecha_registro timestamp not null default current_timestamp
);
```

**Problemas:**
- ❌ Implementar bcrypt manualmente
- ❌ Crear sistema de recuperación de contraseña
- ❌ Gestionar tokens de sesión
- ❌ Validar contraseñas en login
- ❌ Doble fuente de verdad (tu tabla vs hipotético sistema auth)

---

#### ✅ AHORA (Supabase Auth Integrado)

```sql
CREATE TABLE usuario (
    id_usuario serial primary key,
    id_auth uuid unique not null,           -- ⭐ Enlace con auth.users(id)
    email varchar(100) not null unique,     -- ⭐ Email de login
    dni varchar(8) not null unique,         -- ⭐ NUEVO: DNI obligatorio
    nombre_usuario varchar(50) not null unique,
    nombre_completo varchar(150) not null,
    id_rol int not null,
    foto_perfil_url varchar(500),
    telefono varchar(20),                   -- ⭐ NUEVO: Teléfono
    ultimo_acceso timestamp,
    estado_logico boolean not null default true,
    fecha_registro timestamp not null default current_timestamp,
    
    CONSTRAINT fk_usuario_auth FOREIGN KEY (id_auth)
        REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
```

**Ventajas:**
- ✅ Supabase Auth gestiona contraseñas (bcrypt automático)
- ✅ Recuperación de contraseña built-in
- ✅ JWT automático y seguro
- ✅ Email verification opcional
- ✅ OAuth providers disponibles (Google, GitHub)
- ✅ Una sola fuente de verdad

---

## 🆕 Campos Agregados

| Campo | Tipo | Descripción | Obligatorio |
|-------|------|-------------|-------------|
| `id_auth` | uuid | UUID del usuario en `auth.users` - Enlace único | ✅ Sí |
| `email` | varchar(100) | Email de login (copiado de auth.users) | ✅ Sí |
| `dni` | varchar(8) | DNI del personal (8 dígitos - Perú) | ✅ Sí |
| `telefono` | varchar(20) | Teléfono de contacto del personal | ❌ Opcional |

---

## ❌ Campos Eliminados

| Campo | Motivo |
|-------|--------|
| `password_hash` | Supabase Auth lo gestiona en `auth.users` |

---

## 🔧 Nuevas Funciones y Triggers

### 1. Trigger: Crear Perfil Automático

```sql
CREATE OR REPLACE FUNCTION fn_crear_perfil_usuario()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.usuario (
        id_auth,
        email,
        dni,
        nombre_usuario,
        nombre_completo,
        id_rol,
        telefono,
        foto_perfil_url
    ) VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'dni',
        new.raw_user_meta_data->>'nombre_usuario',
        new.raw_user_meta_data->>'nombre_completo',
        (new.raw_user_meta_data->>'id_rol')::int,
        new.raw_user_meta_data->>'telefono',
        coalesce(
            new.raw_user_meta_data->>'foto_perfil_url',
            'https://ui-avatars.com/api/?name=' || 
            replace(new.raw_user_meta_data->>'nombre_completo', ' ', '+') || 
            '&background=random&color=fff&size=200'
        )
    );
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**¿Qué hace?**
- Se ejecuta **automáticamente** cuando creas un usuario en Supabase Auth
- Lee los metadatos del usuario (`raw_user_meta_data`)
- Crea la fila correspondiente en tu tabla `usuario`
- Genera avatar automático si no se proporciona

---

### 2. Función: Actualizar Último Acceso

```sql
CREATE OR REPLACE FUNCTION fn_actualizar_ultimo_acceso(user_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE usuario
    SET ultimo_acceso = current_timestamp
    WHERE id_auth = user_id;
END;
$$ LANGUAGE plpgsql;
```

**Uso:**
```typescript
// Desde el frontend después de login exitoso
await supabase.rpc('fn_actualizar_ultimo_acceso', {
  user_id: session.user.id
});
```

---

## 🔗 Nuevos Índices

```sql
CREATE INDEX idx_usuario_id_auth ON usuario(id_auth);  -- ⭐ NUEVO
CREATE INDEX idx_usuario_email ON usuario(email);     -- ⭐ NUEVO
CREATE INDEX idx_usuario_dni ON usuario(dni);         -- ⭐ NUEVO
CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_usuario_nombre ON usuario(nombre_usuario);
```

**Mejoras de rendimiento:**
- Búsquedas rápidas por `id_auth` (la más usada)
- Búsquedas rápidas por `email` y `dni`
- Join eficiente con `auth.users`

---

## 📊 Comparación de Flujos

### ❌ ANTES: Login Manual

```
1. Usuario envía email/password al backend
2. Backend busca en tabla usuario por email
3. Backend compara password con bcrypt
4. Backend genera JWT manualmente
5. Backend devuelve JWT al frontend
6. Frontend guarda JWT
```

**Código requerido:** ~200 líneas (hash, compare, JWT, refresh, recovery)

---

### ✅ AHORA: Login con Supabase Auth

```
1. Usuario envía email/password a Supabase Auth
2. Supabase valida credenciales automáticamente
3. Supabase devuelve JWT con claims
4. Frontend guarda JWT (automático)
5. Backend verifica JWT con Supabase
6. Backend busca usuario por id_auth para obtener rol
```

**Código requerido:** ~50 líneas (solo validar JWT y buscar usuario)

---

## 🔐 Seguridad Mejorada

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Hashing** | Manual (bcrypt) | Automático (Supabase) |
| **Salt rounds** | Depende de ti | Optimizado por Supabase |
| **JWT** | Implementar librería | Automático |
| **Refresh tokens** | Implementar | Built-in |
| **Rate limiting** | Implementar | Built-in |
| **Email verification** | Implementar | Built-in (opcional) |
| **Password recovery** | Implementar | Built-in |
| **OAuth** | No disponible | Google, GitHub, etc. |

---

## 📝 Nuevos Metadatos de Usuario

Al crear un usuario en Supabase Auth, ahora debes enviar estos metadatos:

```json
{
  "dni": "12345678",
  "nombre_usuario": "admin.jperez",
  "nombre_completo": "Juan Pérez Gómez",
  "id_rol": 1,
  "telefono": "987654321"
}
```

**Campo `dni` - Validación:**
- ✅ Debe tener exactamente 8 dígitos
- ✅ Solo números (constraint en base de datos)
- ✅ Único (no pueden haber 2 usuarios con mismo DNI)

---

## 🗂️ Estructura de `auth.users` vs `usuario`

### `auth.users` (Tabla de Supabase - NO tocar directamente)

Gestiona:
- ✅ Email
- ✅ Contraseña hasheada
- ✅ Tokens de sesión
- ✅ Email verification
- ✅ Recovery tokens
- ✅ Metadata JSON

### `usuario` (Tu tabla - Perfil de negocio)

Gestiona:
- ✅ DNI del personal
- ✅ Nombre de usuario interno
- ✅ Rol (admin/vendedor/almacenero)
- ✅ Foto de perfil
- ✅ Teléfono
- ✅ Último acceso
- ✅ Estado lógico

**Relación:** `usuario.id_auth` → `auth.users.id`

---

## 🔄 Migración de Usuarios Existentes

Si ya tenías usuarios en la tabla antigua:

### Opción 1: Crear nuevos en Supabase Auth

```sql
-- Para cada usuario existente, crear en auth.users
-- Luego el trigger creará la fila en usuario automáticamente
```

### Opción 2: Script de migración manual

**NO RECOMENDADO** - Mejor empezar desde cero con Supabase Auth.

---

## 📊 Queries Actualizadas

### Obtener usuario autenticado

**Antes:**
```sql
SELECT * FROM usuario WHERE nombre_usuario = 'admin.jperez';
```

**Ahora:**
```sql
SELECT 
  u.*,
  r.nombre_rol,
  r.descripcion
FROM usuario u
INNER JOIN rol r ON r.id_rol = u.id_rol
WHERE u.id_auth = 'uuid-del-usuario-de-jwt';
```

---

### Crear usuario

**Antes:**
```sql
INSERT INTO usuario (nombre_usuario, password_hash, ...)
VALUES ('admin', '$2b$10$...', ...);
```

**Ahora:**
```typescript
// Desde el backend con Admin API
const { data, error } = await supabase.auth.admin.createUser({
  email: 'admin@botica.com',
  password: 'admin123',
  user_metadata: {
    dni: '12345678',
    nombre_usuario: 'admin.jperez',
    nombre_completo: 'Juan Pérez Gómez',
    id_rol: 1
  }
});
// El trigger crea la fila en usuario automáticamente
```

---

## 🧪 Testing

### Usuarios de Prueba Predefinidos

| Email | Password | Rol | DNI |
|-------|----------|-----|-----|
| admin@botica.com | admin123 | ADMINISTRATIVO | 12345678 |
| vendedor@botica.com | vendedor123 | VENDEDOR | 87654321 |
| almacenero@botica.com | almacenero123 | ALMACENERO | 11223344 |

**Crear:** Ver instrucciones en `GUIA-SUPABASE-AUTH.md`

---

## ⚠️ Cambios en INSERT de Datos Seed

### Usuarios
❌ **ANTES:** INSERT directo en `usuario`
```sql
INSERT INTO usuario (...) VALUES (...);
```

✅ **AHORA:** Crear en Supabase Auth (Dashboard o Admin API)
- El trigger crea automáticamente la fila en `usuario`

### Ventas y Movimientos
⚠️ **Temporalmente comentados** hasta que crees usuarios válidos
```sql
-- Descomentar después de crear usuarios y obtener id_usuario
/*
INSERT INTO venta (...) VALUES (...);
*/
```

---

## 📚 Archivos de Documentación Creados

| Archivo | Descripción |
|---------|-------------|
| `script-base-de-datos-supabase.md` | ✅ Script SQL actualizado con Supabase Auth |
| `GUIA-SUPABASE-AUTH.md` | 📘 Guía completa paso a paso |
| `CAMBIOS-BASE-DATOS-AUTH.md` | 📋 Este archivo (resumen de cambios) |
| `FOTOS-PERFIL-USUARIOS.md` | 🖼️ Gestión de fotos de perfil |
| `EJEMPLO-AVATARES-USUARIOS.md` | 👤 Ejemplos de avatares |

---

## ✅ Checklist de Migración

- [ ] **Paso 1:** Habilitar Email Provider en Supabase
- [ ] **Paso 2:** Ejecutar script SQL actualizado
- [ ] **Paso 3:** Verificar que se creó el trigger `fn_crear_perfil_usuario`
- [ ] **Paso 4:** Crear usuarios de prueba (admin, vendedor, almacenero)
- [ ] **Paso 5:** Verificar que se crearon filas en tabla `usuario`
- [ ] **Paso 6:** Actualizar frontend para usar `supabase.auth.signInWithPassword()`
- [ ] **Paso 7:** Actualizar backend para verificar JWT con Supabase
- [ ] **Paso 8:** Probar login con cada rol
- [ ] **Paso 9:** Verificar permisos por rol
- [ ] **Paso 10:** Descomentar y ejecutar INSERTs de ventas/movimientos

---

## 🎓 Conceptos Clave

### 1. **id_auth es el puente**
- Es el UUID que une `auth.users` con tu tabla `usuario`
- Viene en el JWT después del login
- Úsalo para buscar el usuario y obtener su rol

### 2. **auth.users vs usuario**
- `auth.users`: Autenticación (email, password, tokens)
- `usuario`: Perfil de negocio (DNI, rol, foto, teléfono)

### 3. **raw_user_meta_data**
- JSON en `auth.users` con datos personalizados
- El trigger lo lee para crear el perfil en `usuario`
- Accesible desde JWT en el frontend

### 4. **Trigger automático**
- Cada vez que creas un usuario en Auth, se crea su perfil
- No necesitas hacer INSERT manual en `usuario`
- Mantiene consistencia automática

---

## 🚀 Beneficios de este Cambio

1. ✅ **Seguridad:** Supabase gestiona contraseñas con mejores prácticas
2. ✅ **Menos código:** No implementas auth desde cero
3. ✅ **Escalabilidad:** Supabase maneja millones de usuarios
4. ✅ **Features gratis:** Recovery, verification, OAuth
5. ✅ **Mantenimiento:** Supabase se actualiza automáticamente
6. ✅ **Profesional:** Sistema de auth enterprise-grade

---

## 📞 Soporte

Si tienes dudas:
1. Revisa `GUIA-SUPABASE-AUTH.md` (guía paso a paso)
2. Consulta [Documentación oficial de Supabase Auth](https://supabase.com/docs/guides/auth)
3. Revisa ejemplos en el código

---

**¡Sistema de autenticación profesional implementado!** 🎉

**Fecha de actualización:** 2026-08-12
