# 08 · Lab Guards: control de acceso y protección de rutas (Ionic + Angular standalone)

**Sesión:** 26-10-2026. Entrega: PDF con capturas (hora límite 14:15).

App con **login**, panel **/admin** protegido y panel **/user-dashboard** para operadores. La sesión vive en un
`signal` del `AuthService` y se guarda en **sessionStorage** (clave `DAM2_AUTH_SESSION`). Las rutas se protegen con
**guardas funcionales** (`CanActivateFn`) que redirigen devolviendo un `UrlTree`. Incluye las implementaciones
propuestas del apartado 4 (dos roles + factoría `roleGuard(allowedRole)`).

| Archivo | Qué es |
|---|---|
| `Lab_Guards.pdf` | Enunciado y teoría del profe (el ejercicio está en la pág. 12, apartado 4) |
| `00-teoria-y-apuntes.md` | **Explicación** de guards, UrlTree, sessionStorage y del código, archivo a archivo (empieza por aquí) |
| `Entrega-Lab-Guards.pdf` | PDF que se entrega |
| `capturas/` | Capturas de la app en vista móvil (las del PDF) |
| `auth-guard-app/` | Proyecto Ionic 9 + Angular 22 standalone |

## Requisitos del ejercicio

| Nº | Requisito | Dónde |
|----|-----------|-------|
| Paso 2 | Servicio con sesión en signal + sessionStorage | `auth-guard-app/src/app/core/services/auth.service.ts` |
| Paso 3 | Functional guard que devuelve `UrlTree` a `/login` | `src/app/core/guards/auth.guard.ts` |
| Paso 4 | Rutas con lazy loading y `canActivate` | `src/app/app.routes.ts` |
| Paso 5-6 | Vistas de login y admin | `src/app/pages/login/`, `src/app/pages/admin/` |
| 4.1 | Dos usuarios: `admin/123` (rol `admin`) y `operador/123` (rol `user`) | `USUARIOS` en `auth.service.ts` |
| 4.2 | Página `pages/user-dashboard` | `src/app/pages/user-dashboard/` |
| 4.2 | Factoría `roleGuard(allowedRole)` | `src/app/core/guards/role.guard.ts` |
| 4.2 | Rol `user` que escribe `/admin` → redirigido a `/user-dashboard` | `roleGuard('admin')` en la ruta `admin` |

```bash
cd auth-guard-app
npm install
ionic serve     # http://localhost:8100  (admin/123 u operador/123)
```

Prueba de "ataque": cierra sesión y escribe `http://localhost:8100/admin` → vuelve a `/login?returnUrl=%2Fadmin`.
DevTools: F12 → Application → Session Storage → `http://localhost:8100` → clave `DAM2_AUTH_SESSION`.
