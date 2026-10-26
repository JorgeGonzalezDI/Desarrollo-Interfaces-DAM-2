# 08 · Lab Guards — teoría y código explicado desde cero

Enunciado: `Lab_Guards.pdf` (en esta carpeta). Proyecto: `auth-guard-app/`. Mapa en la guía de estudio: `00-Apuntes\01-guia-de-estudio-desde-cero.md`, sección **B8**.

---

## 1. El problema que resuelve

Una SPA (Single Page Application) es **un solo `index.html`** y el "cambio de página" lo hace el **router de Angular**
en el navegador, sin pedir nada al servidor. Eso significa que cualquiera puede escribir `http://localhost:8100/admin`
en la barra y el router intentará pintar `AdminPage`. Si no hay nada que lo impida, un usuario sin sesión vería el panel.

Además, al escribir una URL a mano y pulsar Enter **se recarga la app entera**: todo lo que estaba en memoria
(variables, signals) se pierde. Así que hacen falta dos cosas:

1. **Guardar la sesión fuera de la memoria** → `sessionStorage` (Web Storage API del navegador).
2. **Un "portero" en cada ruta protegida** que mire si hay sesión antes de dejar pasar → una **guarda** (*guard*).

> Analogía Java: una guarda es como un **filtro de servlet** (`Filter.doFilter`) o un interceptor de Spring Security:
> se ejecuta antes de llegar al "controlador" (aquí, la página) y decide si sigue o redirige.

---

## 2. Conceptos

### 2.1 Functional Guard (`CanActivateFn`)
Antes (Angular < 15) una guarda era una **clase** que implementaba la interfaz `CanActivate`. Desde Angular 16 se usa
una **función**:

```ts
export const authGuard: CanActivateFn = (route, state) => { ... };
```

- `route`: info de la ruta a la que se quiere ir (parámetros, datos...).
- `state.url`: la URL completa pedida (p. ej. `/admin`). La usamos para el `returnUrl`.
- Como no hay constructor, las dependencias se sacan con **`inject(AuthService)`** (equivalente a un `@Autowired`
  pero llamado dentro de la función).

**Qué puede devolver:**

| Devuelve | Efecto |
|---|---|
| `true` | Deja pasar, se carga la página |
| `false` | Cancela la navegación y te quedas "en blanco" donde estabas (mala UX) |
| `UrlTree` | Cancela **y redirige** a otra URL en el mismo paso (lo correcto) |
| `Promise`/`Observable` de lo anterior | Igual, pero asíncrono (p. ej. si hay que preguntar a un servidor) |

`router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } })` construye la URL
`/login?returnUrl=%2Fadmin` (el `%2F` es la `/` codificada).

### 2.2 `sessionStorage` vs `localStorage`
Las dos son un "mapa clave → texto" que guarda el navegador por cada web (origen `http://localhost:8100`).

| | `sessionStorage` | `localStorage` |
|---|---|---|
| Dura | Mientras la **pestaña** esté abierta (sobrevive a F5) | Para siempre (hasta borrarlo) |
| Uso aquí | El lab lo pide: cierras la pestaña = cierras sesión | Sería "recordarme" |

Solo guardan **texto**, por eso: `JSON.stringify(objeto)` al guardar y `JSON.parse(texto)` al leer
(como serializar/deserializar con Jackson en Java).

### 2.3 Signals en el servicio
`signal()` = variable observable: cuando cambia, Angular repinta lo que la usa. `computed()` = valor derivado que
se recalcula solo (como un getter cacheado). `asReadonly()` = se expone sin `.set()` → **encapsulación** (como un
atributo `private` con solo getter en Java).

### 2.4 Factoría de guardas (apartado 4)
`roleGuard('admin')` no **es** una guarda: es una función que **devuelve** una guarda configurada con ese rol.
La guarda devuelta "recuerda" `allowedRole` aunque `roleGuard` ya haya terminado → eso es un **closure**.
En Java sería un método estático que devuelve una lambda que captura una variable *effectively final*:

```java
static Predicate<User> roleGuard(String allowedRole) { return u -> u.role().equals(allowedRole); }
```

### 2.5 Orden de ejecución al escribir `/admin`
```
Escribes /admin → se recarga la app → AuthService se crea → su signal lee sessionStorage
→ el router mira la ruta 'admin' → ejecuta authGuard → ejecuta roleGuard('admin')
   ├─ todo true  → descarga el chunk de AdminPage y la pinta
   └─ algún UrlTree → redirige (AdminPage ni se descarga)
```

---

## 3. Estructura del proyecto (`auth-guard-app/src/app/`)

```
app/
├── app.component.ts / .html   ← raíz: solo <ion-app><ion-router-outlet> (donde se pintan las páginas)
├── app.config.ts              ← providers globales: router e Ionic (sustituye al AppModule)
├── app.routes.ts              ← tabla de rutas + qué guardas tiene cada una
├── core/                      ← lógica que NO es pantalla (se usa en toda la app)
│   ├── services/auth.service.ts   ← quién está logueado, login/logout, storage
│   └── guards/
│       ├── auth.guard.ts          ← ¿hay sesión?
│       └── role.guard.ts          ← ¿tiene el rol? (factoría)
└── pages/                     ← una carpeta por pantalla (ts + html + scss)
    ├── login/
    ├── admin/
    └── user-dashboard/
```

**¿Por qué `core/`?** Separación de responsabilidades (CE 1.b): las páginas solo pintan y reaccionan a clics; la
lógica de sesión vive en el servicio y la de permisos en las guardas. Como en Java separar `controller`, `service`
y `security` en paquetes distintos.

---

## 4. El código, archivo a archivo

### 4.1 `core/services/auth.service.ts`
- `type Rol = 'admin' | 'user'` → tipo unión: el compilador no deja poner otro texto (como un `enum`).
- `interface UserSession` → forma del objeto de sesión (como un `record` de Java).
- `USUARIOS` → "base de datos" de prueba: `admin/123` → `admin`, `operador/123` → `user` (apartado 4.1).
- `@Injectable({ providedIn: 'root' })` → **singleton** para toda la app.
- `_currentUser = signal(this.readSessionFromStorage())` → **clave de la persistencia**: al crearse el servicio
  (cada vez que se recarga la app) lee el storage. Por eso tras un F5 la guarda ya ve la sesión.
- `isAuthenticated` y `role` → `computed` de solo lectura que usan las guardas.
- `login()` → busca el usuario, comprueba la contraseña, guarda en el signal **y** en `sessionStorage`.
- `logout()` → borra de los dos sitios.
- `rutaInicio(role)` → `/admin` para admin, `/user-dashboard` para user (lo usan el login y `roleGuard`).
- `readSessionFromStorage()` → si el JSON está corrupto (alguien lo editó a mano en DevTools), lo borra: `try/catch`.

### 4.2 `core/guards/auth.guard.ts`
Si `isAuthenticated()` → `true`. Si no → `UrlTree` a `/login?returnUrl=<lo que pedía>`.

### 4.3 `core/guards/role.guard.ts`
1. Sin sesión → al login (por si alguien usa `roleGuard` sin `authGuard` delante).
2. Rol igual a `allowedRole` → `true`.
3. Rol distinto → `UrlTree` a **su** página de inicio con `?denegado=/admin`, para que la vista avise.

### 4.4 `app.routes.ts`
- `''` → redirige a `login`. `'**'` (cualquier otra) → `login`; va la **última** porque el router mira en orden.
- `admin`: `canActivate: [authGuard, roleGuard('admin')]` → se ejecutan **en orden**; si una falla, no se mira la siguiente.
- `user-dashboard`: solo `authGuard` (el admin también puede verla).
- `loadComponent: () => import(...)` → **lazy loading**: cada página es un archivo JS aparte (chunk) que solo se
  descarga si se navega a ella y las guardas dejan pasar.

### 4.5 `pages/login/`
- `[(ngModel)]="username"` → two-way binding: lo que escribes va a la variable y al revés (necesita `FormsModule`).
- `errorMessage` es un `signal` (la app no usa zone.js).
- `returnUrl = toSignal(route.queryParamMap...)` → lee `?returnUrl=` de la URL y lo convierte en signal.
  Si existe, se enseña el aviso amarillo "Ruta protegida".
- `handleLogin()` → si va bien, navega a `returnUrl` o a la página de su rol. Si un operador venía de `/admin`,
  `roleGuard` lo reenvía a `/user-dashboard` (prueba 7 de las capturas).
- `ionViewWillEnter()` → hook de Ionic que salta **cada vez** que entras a la página (Ionic reutiliza las páginas,
  así que `ngOnInit` no volvería a ejecutarse). Limpia contraseña y error.
- `(keyup.enter)` → entrar pulsando Enter.

### 4.6 `pages/admin/`
- `currentSession = authService.currentUser` → el signal de solo lectura; en el HTML `currentSession()?.username`
  (el `?.` evita error si es `null`).
- `storage` → texto real de `sessionStorage`, para que se vea en las capturas sin abrir DevTools.
- `handleLogout()` → `logout()` + navegar a `/login`.

### 4.7 `pages/user-dashboard/`
Igual que admin, más `denegado = toSignal(...?denegado=)` → muestra el aviso rojo cuando `roleGuard` te ha echado de `/admin`.

---

## 5. Cómo se hicieron las capturas (`capturas/`)

| Nº | Archivo | Qué hacer |
|---|---|---|
| 1 | `1_login.png` | Abrir `http://localhost:8100` → redirige a `/login` |
| 2 | `2_login_error.png` | `admin` / `mala` → Acceder |
| 3 | `3_admin_panel.png` | `admin` / `123` → `/admin` (se ve el JSON del storage) |
| 4 | `4_admin_tras_recargar.png` | F5 en `/admin` → sigue dentro |
| 5 | `5_logout.png` | Cerrar Sesión → `/login`, la clave desaparece |
| 6 | `6_ataque_url_admin.png` | Escribir `/admin` en la barra sin sesión → `/login?returnUrl=%2Fadmin` |
| 7 | `7_operador_login_returnUrl.png` | Desde ahí, `operador` / `123` → acaba en `/user-dashboard?denegado=%2Fadmin` |
| 8 | `8_user_dashboard.png` | Cerrar sesión y entrar con `operador` / `123` → `/user-dashboard` |
| 9 | `9_operador_escribe_admin.png` | Con el operador dentro, escribir `/admin` → vuelve a `/user-dashboard` con aviso |

Captura extra opcional (DevTools): F12 → **Application** → **Session Storage** → `http://localhost:8100` → clave `DAM2_AUTH_SESSION`.

---

## 6. Diferencias con el código del PDF del profe (y por qué)

- Imports de Ionic desde `'@ionic/angular'` y **sin** `standalone: true`: así está el resto del repo (Ionic 9 /
  Angular 22, standalone ya es el valor por defecto).
- `<ion-input label=... labelPlacement="floating" fill="outline">` en vez de `<ion-item><ion-label position="floating">`:
  es la sintaxis moderna de Ionic (la antigua está obsoleta).
- `errorMessage` como `signal` (la app no tiene zone.js).
- `role` (`computed`) y `rutaInicio()` añadidos al servicio para el apartado 4.

## 7. Preguntas tipo examen
1. ¿Por qué devolver un `UrlTree` y no `false`? → Redirige en el mismo paso; con `false` la navegación se cancela y no vas a ningún sitio.
2. ¿Qué pasa si quitas `readSessionFromStorage()` del signal? → Tras un F5 el signal empieza en `null` y la guarda te echa al login aunque la clave siga en el storage.
3. ¿Diferencia entre `sessionStorage` y `localStorage`? → Pestaña vs. permanente.
4. ¿Qué es una factoría de guardas? → Función que recibe parámetros y devuelve una `CanActivateFn` (closure).
5. ¿Es esto seguridad real? → **No**: el storage se puede editar en DevTools. En una app real el servidor valida un token (p. ej. JWT de Supabase) en cada petición; la guarda solo mejora la UX.
