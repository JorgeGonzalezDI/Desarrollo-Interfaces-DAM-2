# GastoFlow · Gestión de gastos corporativos

Aplicación multiplataforma (**PWA / híbrida**) para registrar, aprobar y analizar los gastos de una empresa.
Proyecto final del módulo **Desarrollo de Interfaces (0488)** · DAM 2 · Nebrija · Jorge González Gómez.

| | |
|---|---|
| **Producción** | Vercel (despliegue automático desde `main`) |
| **Stack** | Ionic 9 + Angular 22 (standalone, signals, sin zone.js) · Supabase (PostgreSQL, Auth, REST, Realtime) · Chart.js · jsPDF |
| **Documentación** | [Manual de usuario](docs/manual-usuario.md) · [Anexo de seguridad](docs/security-architecture.md) · [Guía del código](docs/guia-del-codigo.md) · Documentación técnica generada (Compodoc): `docs/compodoc/` y `/documentacion` en la web |

![Cuadro de mando](docs/capturas/09-dashboard.png)

## Funcionalidades

- **Empleado:** se registra con validación asíncrona del correo, registra gastos (formulario reactivo con validación dinámica y aviso si sale sin guardar), y consulta y filtra sus gastos con el estado actualizado en tiempo real.
- **Administración:** bandeja de aprobaciones (aprobar o rechazar con motivo) y cuadro de mando con indicadores, 3 gráficos y filtros por periodo, departamento y estado. Exporta informes **PDF** y **CSV** de lo que está viendo.
- **Seguridad en 3 capas:** permisos RBAC en la interfaz, guards `canMatch` + interceptor HTTP en el router, y RLS + triggers en PostgreSQL ([anexo](docs/security-architecture.md)).
- **Accesibilidad (WCAG 2.1 AA):** contraste AA, navegación completa por teclado, ARIA, zoom permitido, diseño *mobile-first*. Lighthouse: Accessibility 100 · Best Practices 100 · SEO 100.

## Arquitectura (MVVM)

```
src/app/
  core/                 una sola instancia en toda la app (como la capa de servicios en Java)
    auth/               AuthService (sesión Supabase), guards, authInterceptor, cambiosSinGuardarGuard
    api/                ApiRestService: HttpClient contra la API REST de Supabase (/rest/v1)
    data/               GastosService (store con signals + Realtime), UsuariosService
    models/             tipos: RBAC (roles y permisos), sesión, gastos
    supabase/           cliente único de Supabase (Auth y Realtime)
    ui/  utils/         avisos (toasts), formato, validadores, exportación CSV/PDF
  shared/components/    componentes reutilizables y agnósticos (input/output, OnPush)
    tabla-datos/        tabla avanzada genérica: buscador, ordenación, paginación, acciones
    widget-estadistico/ indicador (KPI) que puede emitir un evento de selección
    grafico/            envoltorio de Chart.js con ciclo de vida (se destruye al salir)
  layout/shell/         menú lateral (ion-split-pane) + carga de datos y canal de tiempo real
  features/             una carpeta por pantalla, todas con carga diferida
supabase/               01_esquema.sql (tablas, RLS, triggers, Realtime) · 02_datos_demo.sql
docs/                   manual, anexo de seguridad, guía del código, capturas, Compodoc
```

- **Vista:** componentes y plantillas.
- **ViewModel:** servicios con signals (`GastosService` es un *store*: estado privado y `computed` públicos de solo lectura).
- **Modelo:** la API REST de Supabase.
- Gastos y categorías se cargan **en paralelo** con `forkJoin`.

## Puesta en marcha

1. Crea un proyecto en Supabase y ejecuta, en el SQL Editor, `supabase/01_esquema.sql`. Después crea los usuarios en Authentication y ejecuta `supabase/02_datos_demo.sql` (datos sintéticos).
2. Copia `.env.example` como `.env` y rellena `SUPABASE_URL` y `SUPABASE_ANON_KEY` (la clave **pública**). `.env` no se sube a Git.
3. Ejecuta:
   ```powershell
   npm install
   npm start          # http://localhost:4200
   npm test           # tests unitarios (Vitest)
   npm run build      # producción en www/ (PWA con service worker)
   npm run docs       # regenera la documentación técnica (Compodoc)
   ```
4. **Vercel:**
   - *Root Directory* = `10-Proyecto-Final-GastoFlow`.
   - Variables de entorno `SUPABASE_URL` y `SUPABASE_ANON_KEY`.
   - `vercel.json` ejecuta `npm run build:vercel`: **tests + build**. Si falla un test, no se despliega.

## Flujo de trabajo con Git

- `main`: versiones terminadas (etiquetas `v0.1.0`, `v1.0.0`). Vercel publica desde aquí.
- `develop`: integración.
- `feature/*`: una rama por funcionalidad, fusionada en `develop` con `--no-ff`.
- **CI:** GitHub Actions (`.github/workflows/gastoflow-ci.yml`) pasa los tests y compila en cada push o Pull Request.

## Calidad

| Prueba | Resultado |
|---|---|
| Tests unitarios (Vitest) | 14 tests en verde: RBAC, guards, validadores, CSV, lógica de la tabla |
| Pruebas de extremo a extremo (Playwright) | Login, `returnUrl`, acceso denegado, alta con `canDeactivate`, validación asíncrona, aprobar y rechazar, dashboard y exportaciones, 401 → renovación del token |
| Lighthouse (login) | Accessibility **100** · Best Practices **100** · SEO **100** |

Datos 100 % sintéticos: personas y empresas ficticias. Ninguna clave privada en el repositorio.
