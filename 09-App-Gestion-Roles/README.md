# 09 · App Gestión de Roles (Ionic + Angular standalone + Supabase)

App de **gestión de productos con login y dos roles** (`admin` y `user`) que junta en un solo proyecto lo
trabajado en las prácticas 04 a 08: signals, formularios reactivos, guards y Supabase (Auth + RLS).
Ionic 9 + Angular 22 standalone **sin zone.js**, con estado en `signal()`.

| Rol | Qué puede hacer |
|---|---|
| `user` | Iniciar sesión y **ver** el listado de productos |
| `admin` | Todo lo anterior + **crear, editar y borrar** productos + **cambiar el rol** de otros usuarios |

**Cuentas de demo** (solo existen para probar la app):

| Email | Rol | Contraseña |
|---|---|---|
| `admin@gestion.com` | admin | Nevera200789 |
| `user@gestion.com` | user | Nevera200789 |

## Qué práctica se ve en cada parte

| Práctica | Cómo aparece en esta app | Dónde |
|---|---|---|
| 04 · Reactividad con signals | Sesión, rol, `isLoggedIn` e `isAdmin` como `signal` / `computed`; listas y mensajes de error en signals | `core/services/auth.service.ts`, `pages/*` |
| 05 · Lab TechTicket | Estados cargando / error / datos y servicios que devuelven `Observable` | `core/services/products.service.ts`, `pages/products/` |
| 06 · Supabase: login y roles | `signInWithPassword`, tabla `profiles` con rol, seguridad **RLS** y función `has_role()` | `core/services/`, base de datos |
| 07 · Formularios reactivos | Login y formulario de producto con `FormBuilder` y `Validators`; la misma pantalla crea y edita | `pages/login/`, `pages/product-form/` |
| 08 · Lab Guards | `authGuard` (hay sesión) y `roleGuard` (hay que ser admin), con redirección por `UrlTree` | `core/guards/`, `app.routes.ts` |

## Estructura

```
gestion-roles-app/
├── vercel.json                  Despliegue en Vercel: carpeta www + todas las rutas → index.html
└── src/
    ├── environments/            URL y clave pública (publishable) de Supabase
    ├── global.scss              Tema: color, modo oscuro automático, tarjetas
    └── app/
        ├── app.routes.ts        Rutas con lazy loading y guards
        ├── core/                Lo que NO es una pantalla
        │   ├── models/          Product, ProductInput, Profile, AppRole
        │   ├── services/        supabase.client, auth, products, profiles
        │   └── guards/          authGuard, roleGuard
        └── pages/               Una carpeta por pantalla (.ts + .html + .scss)
            ├── login/           Formulario reactivo de inicio de sesión
            ├── products/        Listado; el admin ve Nuevo / Editar / Borrar / Usuarios
            ├── product-form/    Crear (/product-form) y editar (/product-form/:id)
            └── admin/           Listado de usuarios y cambio de rol
```

## Base de datos (Supabase)

- Tabla `products` (`id`, `name`, `description`, `price`, `stock`, `created_at`) y tabla `profiles`
  (`id`, `email`, `role`, `created_at`).
- Las políticas **RLS** hacen que solo el admin pueda escribir en `products` y ver o cambiar todos los perfiles,
  aunque alguien se salte la interfaz.
- [`datos-demo.sql`](datos-demo.sql): 20 productos de ejemplo para el SQL Editor de Supabase.
- La clave del frontend es la *publishable* (pública por diseño): la seguridad la ponen las políticas RLS.

```bash
cd gestion-roles-app
npm install
ionic serve      # http://localhost:8100
ng build         # compila a www/
```
