# GastoFlow · Gestión de gastos corporativos

Aplicación multiplataforma (PWA / híbrida) para registrar, aprobar y analizar los gastos de empresa.
Proyecto final del módulo **Desarrollo de Interfaces (0488)**, DAM 2 · Nebrija · Jorge González Gómez.

- **Empleado** (usuario estándar): registra sus gastos y sigue su estado.
- **Administración** (administrador): aprueba o rechaza gastos, consulta el cuadro de mando y exporta informes PDF/CSV.

| | |
|---|---|
| Stack | Ionic 9 + Angular 22 (standalone, signals, sin zone.js) · Supabase · Chart.js |
| Propuesta | [docs/propuesta-proyecto.pdf](docs/propuesta-proyecto.pdf) |
| Seguridad | [docs/security-architecture.md](docs/security-architecture.md) |
| Guía del código | [docs/guia-del-codigo.md](docs/guia-del-codigo.md) |
| Producción | Vercel (se publica desde `main`) |

## Cómo arrancarlo en local

```powershell
npm install        # descarga las dependencias (carpeta node_modules)
npm start          # servidor de desarrollo en http://localhost:4200
npm run build      # compila para producción en la carpeta www/
```

Las credenciales de prueba se entregan en el PDF de la entrega, no en el repositorio.

## Estructura

```
src/app/
  core/          lo que existe UNA vez en toda la app (como la capa de servicios en Java)
    auth/        AuthService (sesión), guards (authGuard, guestGuard, permisoGuard), usuarios demo
    models/      tipos e interfaces: roles y permisos (RBAC), sesión, menú
  layout/shell/  carcasa de la zona privada: menú lateral + hueco para las páginas
  features/      una carpeta por pantalla, todas con carga diferida (lazy loading)
    auth/login · inicio · gastos · admin/aprobaciones · admin/dashboard · ayuda
docs/            propuesta, memoria de seguridad, guía del código
```

## Flujo de trabajo con Git

- `main`: solo lo terminado. Es la rama que se publica en Vercel.
- `develop`: integración del trabajo en curso.
- `feature/*`: una rama por funcionalidad. Sale de `develop` y vuelve a ella con un merge (`--no-ff`) o un Pull Request.
- Al cerrar cada fase, `develop` pasa a `main` y se etiqueta (`v0.1`, `v0.2`, ...).
- Mensajes de commit con prefijo: `feat:` (funcionalidad), `fix:` (corrección), `docs:` (documentación), `chore:` (configuración).

## Estado por fases

| Fase | Contenido | Estado |
|---|---|---|
| 1 | Menú lateral, lazy loading, guards por rol, login reactivo | En curso (falta alta con validación asíncrona) |
| 2 | Componentes reutilizables (tabla con buscador, widget) | Pendiente |
| 3 | Supabase (REST + Realtime), interceptor HTTP, dashboard Chart.js, PDF/CSV | Pendiente |
| 4 | Accesibilidad WCAG y Lighthouse >= 90 | Aplicándose desde el inicio |
| 5 | Compodoc, manual de usuario, CI y despliegue | En curso |

## Registro de trabajo

| Fecha | Rama | Trabajo |
|---|---|---|
| 30-10-2026 | `main` | Proyecto base Ionic + Angular; README y propuesta del proyecto |
| 30-10-2026 | `feature/estructura-layout` | Modelos RBAC; shell con menú lateral y páginas con carga diferida; pantalla de ayuda |
| 30-10-2026 | `feature/auth-guards` | AuthService con signals; login reactivo con `returnUrl`; guards `canMatch`; menú según permisos |
| 30-10-2026 | `feature/docs-seguridad` | Memoria de arquitectura de seguridad y guía del código |

El historial completo, con la hora de cada commit, está en `git log --graph --oneline --all`.
