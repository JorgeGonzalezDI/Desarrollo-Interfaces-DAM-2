# 06 · Supabase + Angular: login, perfiles y roles

Dos entregas con el mismo proyecto de Supabase (`dam-crm`):

| Entrega | Qué es | Fecha |
|---|---|---|
| **Capturas Supabase** | 7 capturas del panel de Supabase + `environment.ts` | 20-10-2026 23:59 |
| **Laboratorio CRUD con roles** | App `dam-crm-app`: login, listado de clientes y CRUD solo para admins | 19-10-2026 |

| Archivo | Qué es |
|---|---|
| `Dossier_Tecnico_Supabase_y_Angular.pdf` | Teoría de clase (Supabase, RLS, servicio, guard) |
| `Lab_Supabase_Ionic_Angular.pdf` | Enunciado del laboratorio CRUD con roles |
| `00-teoria-y-apuntes.md` | Explicación del dossier y, al final, del laboratorio (empieza por aquí) |
| `capturas/` | Capturas 1–7 de Supabase y las de la app funcionando |
| `dam-crm-app/` | Proyecto Ionic 9 + Angular 22 standalone + `@supabase/supabase-js` |

## Supabase (proyecto `dam-crm`)

- Tablas `profiles` (rol `admin`/`user`) y `clients` (nombre, empresa, email único), con RLS:
  leer clientes = cualquier usuario autenticado; crear/editar/borrar = solo `admin`.
- Usuarios de prueba: `admin@dam.com` (admin) y `user@dam.com` (user).
- Bucket de Storage `avatars` (público).

## Laboratorio: qué hace la app

| Requisito | Dónde |
|---|---|
| Modelo `Client` | `dam-crm-app/src/app/models/client.model.ts` |
| Servicio único Auth + CRUD con signals `currentUser` / `userRole` | `dam-crm-app/src/app/services/supabase.service.ts` |
| Login (eventos de autenticación, CE 3.d) | `dam-crm-app/src/app/login/` + guard `src/app/guards/auth.guard.ts` |
| Formulario reactivo con validaciones (CE 1.c) | `dam-crm-app/src/app/home/home.page.ts` |
| UI según rol con `@if` (CE 3.d) | `home.page.html`: formulario y deslizar solo para admin; "Modo lectura" para user |
| `ion-item-sliding` para editar/borrar | `home.page.html` |
| Diseño responsivo con `ion-list` + `ion-grid` (CE 4.a) | `home.page.html`: 1 columna en móvil, 2 en escritorio |
| `@for` / `@empty` e `ion-toast` | `home.page.html` |

```bash
cd dam-crm-app
npm install
ionic serve      # http://localhost:8100 → login
npm test
```
