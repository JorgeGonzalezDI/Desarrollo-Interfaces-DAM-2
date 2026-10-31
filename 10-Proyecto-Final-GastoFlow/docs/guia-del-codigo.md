# Guía del código de GastoFlow (explicada desde cero)

Qué es cada archivo, qué hace y por qué está donde está. Hay analogías con Java donde ayudan.

## 1. Archivos de la raíz (configuración)

| Archivo | Qué es |
|---|---|
| `package.json` | Lista de dependencias y scripts (`npm start`, `npm run build`). Es el `pom.xml` de Maven. |
| `package-lock.json` | Versiones exactas instaladas, para que todos instalen lo mismo. |
| `angular.json` | Cómo compila Angular: carpeta de salida `www/`, estilos globales y tamaños máximos. |
| `tsconfig*.json` | Opciones del compilador de TypeScript (como el nivel de Java en Maven). |
| `ionic.config.json` / `capacitor.config.ts` | Configuración de Ionic y de Capacitor (para empaquetar como app de Android/iOS). |
| `vercel.json` | Le dice a Vercel que cualquier URL sirva `index.html`. Sin esto, al recargar `/inicio` daría 404, porque las rutas las resuelve Angular en el navegador. |
| `.gitignore` | Lo que Git no sube: `node_modules/`, `www/`, `.angular/`. |

## 2. Arranque: `src/`

- `index.html`: la única página HTML real. Contiene `<app-root>`, donde Angular pinta la app. Tiene `lang="es"` y permite hacer zoom, por accesibilidad.
- `main.ts`: el `main()` de la app. Arranca Angular con `AppComponent` y `appConfig`.
- `global.scss` y `theme/variables.scss`: estilos de toda la app. El color primario azul oscuro tiene contraste suficiente con el texto blanco (WCAG AA).

## 3. `src/app/`: la aplicación

- `app.config.ts`: los *providers* globales (router, Ionic). Sustituye al antiguo `AppModule`. Aquí se quitó la **precarga**, para que no se descargue en segundo plano el código de páginas a las que el usuario no tiene acceso.
- `app.routes.ts`: la **tabla de rutas**. Indica qué URL carga qué página (`loadComponent`, es decir, carga diferida) y qué guards la protegen. Arriba lleva una tabla resumen de rutas, permisos y roles.
- `app.component.*`: componente raíz. Solo tiene `<ion-router-outlet>`, el hueco donde se pintan las páginas.

### `core/`: lo que existe una sola vez

Está separado de las pantallas porque no es interfaz: es "infraestructura", como la capa de servicios en una aplicación Java.

- `models/rol.model.ts`: el modelo **RBAC**. `Rol` y `Permiso` son tipos cerrados (como dos `enum`). `PERMISOS_POR_ROL` es el `Map<Rol, Set<Permiso>>` que dice qué puede hacer cada rol. Es la única fuente de verdad.
- `models/sesion.model.ts`: `SesionClaims`, los datos de la sesión con la forma del *payload* de un JWT (`sub`, `email`, `rol`, `exp`...). Así, al pasar a Supabase, el resto de la app no cambia.
- `models/menu.model.ts`: cómo es una opción del menú (título, URL, icono y permiso opcional).
- `auth/auth.service.ts`: el **servicio central de sesión** (singleton, como un `@Service` de Spring):
  - `login()` es `async`: calcula el SHA-256 de la contraseña con la Web Crypto API y lo compara con el guardado.
  - Guarda la sesión en un **signal** (para que la interfaz reaccione) y en **sessionStorage** (para que sobreviva a F5).
  - Expone `sesion`, `rol`, `permisos` y `estaAutenticado` como signals de solo lectura, y `tienePermiso()` y `haySesionValida()`, que también comprueba la caducidad.
- `auth/usuarios-demo.ts`: dos usuarios de prueba **temporales**, con las contraseñas guardadas como hash, no en texto plano. Desaparece al conectar Supabase.
- `auth/auth.guard.ts`:
  - `authGuard` (¿hay sesión?). Si no la hay, redirige a `/login?returnUrl=...`.
  - `guestGuard`: si ya tienes sesión, no tiene sentido ver el login, así que te manda a `/inicio`.
- `auth/permiso.guard.ts`: `permisoGuard('permiso')` es una **factoría**: una función que devuelve un guard, como un método estático de Java que devuelve una lambda. Si te falta el permiso, te manda a `/inicio?denegado=...`.

> **¿Por qué `canMatch` y no `canActivate`?** `canMatch` decide durante el reconocimiento de la URL, antes de aceptar la ruta. Si falla, la página protegida no se descarga ni se construye. Está explicado a fondo en `docs/security-architecture.md`.

### `layout/shell/`: la carcasa de la zona privada

`shell.component.*` contiene el **menú lateral** (`ion-split-pane` + `ion-menu`) y un `ion-router-outlet` donde se pintan las páginas hijas. En escritorio el menú está fijo; en móvil se abre con el botón hamburguesa. El menú es una signal `computed` que filtra las opciones según los permisos, así que un empleado no ve "Aprobaciones". Abajo tiene el botón **Cerrar sesión**.

### `features/`: una carpeta por pantalla

Todas se cargan con `loadComponent`, así que cada una es un archivo JS aparte que solo se descarga al visitarla.

- `auth/login/`: **formulario reactivo**. El formulario se define en TypeScript con `FormBuilder` y validadores (`required`, `email`, `minLength`), y la plantilla se engancha con `[formGroup]` y `formControlName`. Lleva un spinner mientras comprueba, un error accesible (`aria-live`) y la vuelta a `returnUrl`.
- `inicio/`: saluda al usuario, enseña su rol y avisa si un guard le denegó una página.
- `gastos/`, `admin/aprobaciones/`, `admin/dashboard/`: esqueletos. Las rutas, los guards y el menú ya funcionan; el contenido llega en las fases 2 y 3.
- `ayuda/`: **manual de usuario** dentro de la app, con acordeones accesibles por teclado.

## 4. Cómo viaja una navegación (ejemplo)

Un empleado escribe `/admin/dashboard`:

1. El router prueba la ruta `''`. `authGuard` comprueba que hay sesión válida y deja pasar.
2. Dentro, la ruta `admin/dashboard` tiene `permisoGuard('dashboard:ver')`. El empleado no tiene ese permiso, así que el guard devuelve un `UrlTree` hacia `/inicio?denegado=/admin/dashboard`.
3. El código del dashboard **no se descarga**. La página de inicio lee `denegado` y muestra el aviso.

## 5. Novedades de la v1.0.0 (Supabase, componentes e informes)

| Archivo | Qué hace |
|---|---|
| `scripts/generar-config.mjs` | Antes de `start`, `build` y `test`, escribe `src/environments/supabase.config.ts` con la URL y la clave pública, leídas de `.env` (local) o de las variables de entorno (Vercel). Así ninguna clave está en el repositorio. |
| `core/supabase/supabase.service.ts` | Crea el cliente de Supabase **una sola vez**. Se usa para Auth y Realtime. |
| `core/auth/auth.service.ts` | Login, registro, logout y renovación del token con Supabase Auth. El **rol** se lee de la tabla `perfiles`. `listo` es la promesa que esperan los guards. |
| `core/auth/auth.interceptor.ts` | Añade `apikey` y `Authorization: Bearer` a las peticiones a la API REST propia; ante un 401 renueva el token y reintenta **una vez**; ante un 403 avisa. |
| `core/auth/cambios-sin-guardar.guard.ts` | `canDeactivate`: pregunta antes de salir de un formulario con cambios. |
| `core/api/api-rest.service.ts` | "DAO" genérico con `HttpClient` contra `/rest/v1` (listar, crear, actualizar, eliminar, rpc). |
| `core/data/gastos.service.ts` | **Store** de gastos con signals. Carga en paralelo con `forkJoin`, crea, aprueba y elimina, y se suscribe a **Realtime** (los cambios llegan por WebSocket). |
| `core/utils/validadores.ts` | Validadores propios, incluido el **asíncrono** `emailDisponibleValidator` (espera 400 ms, cancela con `switchMap` y llama a la función SQL `email_disponible`). |
| `core/utils/exportar.ts`, `informe-pdf.ts` | CSV compatible con Excel (`;`, BOM) e informe PDF con jsPDF, que se carga de forma **dinámica**, solo al exportar. |
| `shared/components/tabla-datos` | Tabla **genérica `<T>`**: recibe columnas, filas y acciones por `input()` y emite `(accion)` con `output()`. Su lógica de filtrar y ordenar es una función pura con tests. |
| `shared/components/widget-estadistico` | Indicador (KPI); si es seleccionable es un `<button>` y emite `(seleccionado)`. |
| `shared/components/grafico` | Envoltorio de Chart.js: lo crea en `afterNextRender`, lo actualiza con `effect()` y lo destruye con `DestroyRef`, para no dejar fugas de memoria. |
| `features/auth/registro` | Formulario reactivo con validación síncrona, **asíncrona** y de **grupo** (las contraseñas coinciden). |
| `features/gastos/gasto-form` | Alta con grupo anidado `detalles` (que se guarda en la columna jsonb) y validación dinámica de kilómetros. |
| `features/admin/aprobaciones`, `dashboard` | Reutilizan la tabla, los widgets y los gráficos. El dashboard es una cadena de `computed()`: al cambiar un filtro o llegar un dato en tiempo real, todo se recalcula solo. |
| `supabase/*.sql` | Tablas, **RLS**, triggers de reglas de negocio, función de validación de correo, publicación de Realtime y datos de demo. |
| `ngsw-config.json`, `public/manifest.webmanifest` | **PWA**: service worker (caché de la app) y manifiesto para instalarla. |
