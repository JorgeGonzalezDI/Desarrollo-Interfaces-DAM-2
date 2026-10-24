# 06 · Supabase + Angular: login, perfiles y roles (lo de ahora en clase)

> **Ordenado en la guía de estudio** (`00-Apuntes/01-guia-de-estudio-desde-cero.md`, o el PDF `00-Apuntes/Interfaces_Movil.pdf`): la teoría de Supabase en §A10 y la ficha con el mapa (dossier + Lab CRUD) en §B6.

## Dónde está la teoría

| Qué | Dónde |
|---|---|
| Dossier del profe | `Dossier_Tecnico_Supabase_y_Angular.pdf` (en esta carpeta, 8 págs.) |
| · Qué es Supabase, PostgREST, GoTrue y RLS | Dossier, pág. 2 |
| · Realtime y Storage | Dossier, pág. 3 |
| · El SQL: tipo `app_role` y tabla `profiles` | Dossier, pág. 3 |
| · RLS, `has_role()`, políticas y trigger | Dossier, págs. 4–5 |
| · `npm install` y `environment.ts` | Dossier, pág. 5 |
| · El servicio `supabase.service.ts` | Dossier, págs. 6–8 |
| · El guard `auth.guard.ts` | Dossier, pág. 8 |
| Signals y patrón Store (lo que usa el servicio) | `../04-Reactividad-Signals-Carrito/00-teoria-y-apuntes.md` y `../05-Lab-Reactividad-TechTicket/00-teoria-y-apuntes.md` |
| Tu guía de estudio | `00-Apuntes/01-guia-de-estudio-desde-cero.md` → §A3.10 (`async/await`), §A5.3 (`[(ngModel)]` para el login), §A5.8 (rutas), §A5.9 (`inject`), §A7.3 (por qué con `HttpClient` NO se usa `async/await`) |

**Carpeta:** `C:\DAM 2\Desarrollo de Interfaces\06-Supabase-Auth-Roles\`. Aquí van el dossier, este fichero y el proyecto cuando lo crees. También está en `00-Apuntes/Interfaces_Movil.pdf` (Parte 1).

---

## La idea en 3 líneas

- **Supabase es un backend ya hecho**: base de datos PostgreSQL, API REST que se genera sola, login de usuarios, tiempo real y almacenamiento de ficheros. Tú solo haces el frontend (Ionic + Angular).
- Es la **alternativa a Firebase**, pero **relacional**: tablas, SQL, claves foráneas y transacciones (ACID), no documentos NoSQL.
- **La seguridad vive en la base de datos** (RLS), no en la app. Por eso la clave que pones en el frontend puede ser pública.

### Con lo que ya conoces

| Ya lo has usado | En Supabase |
|---|---|
| SQLite del proyecto `03-JDBC-SQLite-CRUD` (un fichero en tu PC) | PostgreSQL en la nube, con su servidor |
| Escribir tú `SELECT ... WHERE id = ?` con JDBC | PostgREST: escribes `.from('profiles').select(...).eq('id', x)` y él genera el SQL |
| dummyjson o jsonplaceholder (la API de otro, solo para leer) | Una API REST de **tus** tablas, sin programar el backend |
| `if (!usuario.esAdmin()) throw ...` en tu Service de Java | RLS: la regla está en la BD y se comprueba **en cada fila** |
| `TicketService` con signals (actividad 05) | `SupabaseService`: el mismo patrón Store |
| `DriverManager.getConnection(url, usuario, pass)` | `createClient(url, key)` te da el objeto cliente |

---

## Los 5 servicios de Supabase (dossier, págs. 2–3)

### 1. PostgREST: la API que se hace sola

Mira las tablas de tu esquema `public` y crea automáticamente los endpoints REST para hacer CRUD. Tú no programas ningún backend.

La misma consulta de tres formas:

```ts
// Supabase (Angular)
supabase.from('profiles')
  .select('id, email, role')
  .eq('id', userId)
  .single();
```

```sql
-- Lo que acaba ejecutando PostgreSQL
SELECT id, email, role FROM profiles WHERE id = :userId;
```

```java
// Lo mismo en Java con JDBC (Acceso a Datos)
PreparedStatement ps = con.prepareStatement(
  "SELECT id, email, role FROM profiles WHERE id = ?");
ps.setString(1, userId);
ResultSet rs = ps.executeQuery();
```

- `.eq('id', x)` es el `WHERE id = x`. Hay más filtros: `.neq`, `.gt`, `.like`, `.order`...
- `.single()` significa "espero **una sola fila**": te devuelve un objeto y no un array. Si salen 0 filas o más de 1, devuelve error.
- Te devuelve el resultado en JSON, como dummyjson.

### 2. GoTrue (Auth): el login

Gestiona los usuarios: registro, login con contraseña, login con Google o GitHub (OAuth) y *magic links* (un enlace al correo para entrar sin contraseña).

Cuando entras te da un **JWT** (*JSON Web Token*). **Analogía: la pulsera de un festival.** En la puerta (el login) enseñas la entrada una vez y te ponen la pulsera; después, en cada barra (cada petición), solo enseñas la pulsera. El JWT lleva dentro tu id (`sub`), tu email y metadatos, firmado para que nadie lo pueda falsificar.

Los usuarios se guardan en una tabla interna, `auth.users`, que tú no tocas.

### 3. RLS (Row Level Security): el portero está en la base de datos

Con RLS activado, PostgreSQL comprueba **cada fila** de cada `SELECT`, `INSERT`, `UPDATE` y `DELETE` contra unas reglas (las **políticas**).

- `auth.uid()` devuelve el id del usuario que hace la petición (lo saca del JWT).
- **Analogía:** es como si la BD añadiera un `WHERE` invisible a cada consulta. Tú pides "todos los perfiles" y te devuelve solo el tuyo, porque la política dice `auth.uid() = id`.

**Por qué importa:** la clave del frontend es pública (cualquiera la ve con F12). Da igual: aunque alguien la use, la BD solo le enseña lo que las políticas le permiten.

### 4. Realtime: la BD te avisa

Abre un **WebSocket** y te manda un evento cada vez que hay un `INSERT`, `UPDATE` o `DELETE` en una tabla. Es como un Observable que nunca se completa: te vas enterando de los cambios sin volver a preguntar. Sirve para chats y paneles en directo.

### 5. Storage: ficheros

Guarda imágenes y documentos (avatares, PDFs...), con carpetas protegidas también por políticas RLS.

---

## Conceptos nuevos en una línea

| Concepto | Qué es |
|---|---|
| **BaaS** | *Backend as a Service*: el backend te lo da otro ya montado (Supabase, Firebase) |
| **ACID** | Las transacciones se hacen enteras o no se hacen; la BD nunca se queda a medias |
| **JWT** | La "pulsera": un token firmado con quién eres |
| **RLS / política** | Regla en la BD que decide qué filas puede ver o tocar cada usuario |
| **Trigger** | Código de la BD que se ejecuta solo cuando pasa algo (como un `effect()`, pero en la BD) |
| **UUID** | Id largo y aleatorio (`3f2a...`) en vez de 1, 2, 3 |
| **ENUM** | Lista cerrada de valores, igual que un `enum` de Java |
| **Clave publishable / `anon`** | Clave pública para el frontend. Puede estar en el código |
| **Clave secret / `service_role`** | Clave que **se salta RLS**. Nunca en el frontend ni en GitHub |
| **Guard** | Función que decide si puedes entrar en una ruta de Angular |
| **Sesión persistente** | La sesión queda guardada: cierras la app, vuelves y sigues dentro |

---

## El proyecto: qué vas a montar

Al final tienes una app Ionic donde:

1. El usuario entra con **email y contraseña**.
2. Al registrarse se le crea solo un **perfil** con rol `viewer`.
3. Hay 3 roles: `admin`, `developer` y `viewer`.
4. Algunas rutas solo se abren con cierto rol. Si no lo tienes, te manda a `/unauthorized`.
5. Un usuario solo ve **su** perfil; el admin los ve **todos** y es el único que puede cambiar roles.
6. La sesión se queda guardada.

El viaje de los datos:

```
Login (email + pass)
   │
   ▼
GoTrue ──► te da el JWT ──► se guarda (persistSession)
   │
   ▼
onAuthStateChange avisa al SupabaseService
   │
   ├─ currentUserSignal.set(user)
   └─ fetchUserProfile()
         │   .from('profiles')...single()
         ▼
      PostgreSQL + RLS (¿auth.uid() = id o admin?)
         │
         ▼
      currentProfileSignal.set(perfil)
         │
         ▼
computed: isAuthenticated / isAdmin / profile
         │
         ▼
roleGuard deja pasar (o te manda a /unauthorized)
```

---

## Paso 0 · Crear el proyecto en Supabase (el dossier no lo cuenta)

1. En supabase.com: **New project**. Ponle nombre, contraseña de la BD y región en Europa.
2. Busca la **Project URL** y la **clave pública** (Project Settings → API Keys, o el botón **Connect**).
   - Ahora el panel la llama **publishable key** (empieza por `sb_publishable_...`). La antigua `anon` todavía funciona y va en el mismo sitio, pero Supabase la retira a finales de 2026.
   - **Nunca** copies la `secret` / `service_role`.
3. En **Authentication**, comprueba que el proveedor Email está activado. Para pruebas en clase te viene bien desactivar la confirmación por correo.

## Paso 1 · El SQL, bloque a bloque (dossier, págs. 3–5)

Se pega en el **SQL Editor** del panel de Supabase.

**1. El ENUM de roles.** Igual que un `enum` de Java: solo admite esos 3 valores.

```sql
CREATE TYPE public.app_role AS ENUM ('admin', 'developer', 'viewer');
```

**2. La tabla `profiles`.** `auth.users` es la tabla interna de Supabase (no se toca); `profiles` es **tu** tabla con lo que quieras guardar de cada usuario, en relación 1 a 1.

```sql
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
role public.app_role NOT NULL DEFAULT 'viewer',
```

- `REFERENCES auth.users(id)` es una **clave foránea**: el id del perfil tiene que existir en `auth.users`.
- `ON DELETE CASCADE`: si borras el usuario, su perfil se borra solo.
- `DEFAULT 'viewer'`: si no dices rol, eres `viewer`.

**3. Activar RLS.**

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

A partir de aquí, **sin políticas nadie puede leer ni escribir** la tabla desde la API: todo está denegado por defecto. Las políticas abren puertas concretas.

**4. La función `has_role()`.** Devuelve `true` si el usuario actual tiene el rol que le pides.

```sql
SELECT EXISTS (
  SELECT 1 FROM public.profiles
  WHERE id = auth.uid() AND role = required_role
);
```

- `EXISTS (...)` da `true` si la subconsulta devuelve alguna fila.
- **`SECURITY DEFINER`** (lo importante): ejecuta la función con los permisos de quien la creó y **sin pasar por RLS**. Si no lo pusieras, la política de `profiles` llamaría a `has_role()`, que lee `profiles`, que vuelve a mirar la política... y entra en bucle infinito.

**5. Las políticas.**

```sql
-- SELECT: tu perfil, o todos si eres admin
USING ( auth.uid() = id OR public.has_role('admin') )

-- UPDATE: solo admin
USING (public.has_role('admin'))
WITH CHECK (public.has_role('admin'))
```

- **`USING`** = qué filas **existentes** puedes tocar. Es un filtro, como un `WHERE`.
- **`WITH CHECK`** = cómo tiene que quedar la fila **después** del cambio. Es una validación.
- No hay política de `INSERT`: los perfiles solo los crea el trigger.

**6. El trigger `handle_new_user`.** Cuando alguien se registra (entra una fila en `auth.users`), se crea su perfil automáticamente.

```sql
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

- **`NEW`** es la fila recién insertada: `NEW.id`, `NEW.email`.
- **`->>`** saca un campo de un JSON como texto: `raw_user_meta_data->>'full_name'`.
- **`COALESCE(a, b)`** devuelve `a` y, si es `null`, `b`. Es el `??` de TypeScript (en Java, `Objects.requireNonNullElse(a, b)`).
- **Por qué el rol se lee de `app_metadata` y no de `user_metadata`:** `user_metadata` lo rellena el propio usuario al registrarse, y si el rol saliera de ahí cualquiera se haría admin. `app_metadata` solo lo puede escribir el servidor. Por eso, por defecto, todos entran como `viewer`.

**Tu primer admin.** Créate un usuario (Authentication → Users → Add user) y luego, en el SQL Editor (que funciona como superusuario y no pasa por RLS):

```sql
UPDATE public.profiles SET role = 'admin'
WHERE email = 'tu-correo@ejemplo.com';
```

## Paso 2 · Instalar y configurar (dossier, pág. 5)

```bash
npm install @supabase/supabase-js
```

En `src/environments/environment.ts` van la URL y la clave pública. Si tu proyecto no tiene la carpeta `environments`, créala con `ng generate environments`.

La clave puede ir en el código y subirse a GitHub porque es **pública**: quien protege los datos es RLS.

## Paso 3 · El servicio `SupabaseService`, bloque a bloque (dossier, págs. 6–8)

Es el **mismo patrón Store** que `TicketService` (actividad 05):

| `TicketService` (05) | `SupabaseService` (06) |
|---|---|
| `private state = signal(...)` | `private currentUserSignal` y `currentProfileSignal` |
| `public tickets = computed(...)` | `public user`, `profile`, `isAuthenticated` e `isAdmin` (todos `computed`) |
| `inject(HttpClient)` | `createClient(url, key)` |
| `http.get().subscribe(...)` (Observable) | `await supabase.from(...)` (Promise) |

**Las signals públicas:**

```ts
isAuthenticated = computed(() => !!this.currentUserSignal());
isAdmin = computed(() => this.currentProfileSignal()?.role === 'admin');
```

- `!!x` convierte cualquier cosa a boolean: `null` da `false` y un objeto da `true`. En Java sería `user != null`.
- `?.` (*optional chaining*): si el perfil es `null`, devuelve `undefined` en vez de petar. En Java: `profile != null && profile.getRole().equals("admin")`.

**`createClient` y sus opciones:**

- `persistSession: true`: guarda la sesión en el navegador; cierras y vuelves y sigues dentro.
- `autoRefreshToken: true`: renueva el JWT antes de que caduque (la pulsera dura un rato).
- `detectSessionInUrl: true`: para el login por enlace o con Google, que vuelve con el token en la URL.

**`initSessionListener()` tiene 2 pasos:**

1. `getSession()`: "¿había ya una sesión guardada?".
2. `onAuthStateChange(...)`: se queda **escuchando** los logins y logouts, como un `subscribe` que no termina.

**Destructuring:**

```ts
const { data: { session } } = await this.supabase.auth.getSession();
// Java: Session session = respuesta.getData().getSession();
```

**Aquí SÍ hay `async/await`.** Con `HttpClient` usabas `subscribe` porque devuelve Observables (guía §A7.3). La librería de Supabase devuelve **Promises**, así que se usa `await` (guía §A3.10).

**`{ data, error }` en vez de excepciones:**

```ts
const { data, error } = await this.supabase.from('profiles')...;
if (error) { ... }
```

Las consultas de Supabase **no lanzan excepciones**: te devuelven el error dentro del resultado y tú lo compruebas con `if`. En `signIn` hacen `if (error) throw error;` para convertirlo en excepción, y así la página de login lo puede capturar con `try/catch`, como en Java.

**`fetchUserProfile`** es la consulta de PostgREST de arriba. RLS le añade por detrás el `WHERE` invisible (`auth.uid() = id OR has_role('admin')`).

## Paso 4 · El guard (dossier, pág. 8)

```ts
export const roleGuard = (expectedRole: ...): CanActivateFn => {
  return async () => { ... };
};
```

- `CanActivateFn` es una función que Angular ejecuta **antes** de entrar en una ruta. Si devuelve `true`, entras; si devuelve `router.createUrlTree(['/unauthorized'])`, te redirige.
- `roleGuard('admin')` es **una función que devuelve una función**. Es como un método de Java que devuelve una lambda:

```java
static Predicate<Usuario> tieneRol(String rol) {
    return u -> u.getRol().equals(rol);
}
```

- Dentro usa `inject()` para pedir el servicio y el router (guía §A5.9).

## Paso 5 · Lo que el dossier no trae y vas a necesitar (pistas, lo haces tú)

1. **Página de login**: dos `ion-input` con `[(ngModel)]` (guía §A5.3) y un botón con `(click)="entrar()"`. Dentro, `try { await this.supabase.signIn(email, pass); navegar } catch (e) { mostrar error }`.
2. **Rutas** en `app.routes.ts` (guía §A5.8):

```ts
{ path: 'login', loadComponent: () => ... },
{ path: 'admin', loadComponent: () => ...,
  canActivate: [roleGuard('admin')] },
{ path: 'unauthorized', loadComponent: () => ... },
```

3. **Página `/unauthorized`**: un mensaje y un botón para volver.
4. **Botón de cerrar sesión** que llame a `signOut()`.
5. **En los templates**, usa las signals: `@if (supabase.isAdmin()) { ... }`. Para eso el servicio tiene que ser `public` en el componente, como en el TechTicket.

---

## ⚠️ Avisos antes de copiar el dossier (comprobados)

1. **El guard falla si recargas (F5) estando en una ruta protegida.** Cargar la sesión y el perfil es asíncrono, así que cuando el guard lee `profile()` todavía vale `null` y manda al admin a `/unauthorized`. El comentario dice "esperar a que la señal resuelva", pero el código no espera. **Idea para arreglarlo:** guarda en el servicio la promesa del arranque (`this.ready = this.initSessionListener();` en el constructor) y en el guard haz `await supabaseService.ready;` antes de leer `profile()`.
2. **No hagas `await` de llamadas a Supabase dentro de `onAuthStateChange`.** La documentación de Supabase avisa de un fallo: si dentro de ese callback haces una llamada asíncrona a Supabase, la siguiente llamada se puede quedar colgada para siempre. El dossier lo hace (`processSession` consulta `profiles`). **Solución habitual:** sacarlo del callback con `setTimeout(() => this.processSession(session), 0);` y que el callback no sea `async`.
3. **Detalle sin importancia:** `onAuthStateChange` también salta al arrancar (evento `INITIAL_SESSION`), así que con el `getSession()` el perfil se pide dos veces al abrir la app. No rompe nada.

---

## Comprueba que lo entiendes

1. ¿Por qué se puede poner la clave pública en el frontend sin peligro?
   → Porque solo identifica el proyecto. Lo que ves depende de tu JWT y de las políticas RLS.
2. ¿Qué pasa si activas RLS y no creas ninguna política?
   → Que nadie puede leer ni escribir esa tabla desde la API.
3. ¿Por qué el rol se lee de `app_metadata` y no de `user_metadata`?
   → Porque `user_metadata` lo escribe el propio usuario y se podría poner admin.
4. ¿Por qué aquí sí `async/await` y con `HttpClient` no?
   → Supabase devuelve Promises; `HttpClient` devuelve Observables.
5. ¿Qué hace `.single()`?
   → Exige una sola fila y te devuelve un objeto en vez de un array.
6. ¿Diferencia entre `USING` y `WITH CHECK`?
   → `USING` filtra qué filas puedes tocar; `WITH CHECK` valida cómo quedan después del cambio.
7. ¿Para qué sirve `SECURITY DEFINER` en `has_role()`?
   → Para que no pase por RLS y no entre en bucle (una política de `profiles` que lee `profiles`).
8. ¿Qué hace el trigger?
   → Al registrarse un usuario, le crea su fila en `profiles` con rol `viewer`.


---

# Laboratorio · Gestión Completa CRUD con Roles (`dam-crm-app`)

## Dónde está

| Qué | Dónde |
|---|---|
| Enunciado | `Lab_Supabase_Ionic_Angular.pdf` (en esta carpeta, 11 págs.) |
| · SQL: enum `user_role`, tablas `profiles` y `clients`, RLS | Lab, pág. 2 |
| · Crear el proyecto e instalar `@supabase/supabase-js` | Lab, pág. 3 |
| · `environment.ts` y el modelo `Client` | Lab, pág. 3 |
| · El servicio `supabase.service.ts` | Lab, págs. 4–5 |
| · La página `home.page.ts` | Lab, págs. 6–8 |
| · La vista `home.page.html` | Lab, págs. 9–11 |
| Proyecto | `dam-crm-app/` (en esta carpeta) |
| Teoría que usa | Este mismo fichero, arriba (RLS, `.single()`, `USING` / `WITH CHECK`); formularios reactivos en `../07-Formularios-Reactivos-Inventario/00-teoria-y-apuntes.md` §1–2; signals en `../04-Reactividad-Signals-Carrito/00-teoria-y-apuntes.md` |

| Fichero del proyecto | Para qué |
|---|---|
| `src/environments/environment.ts` (y `.prod.ts`) | URL y clave pública de tu proyecto Supabase |
| `src/app/models/client.model.ts` | La forma de un cliente |
| `src/app/services/supabase.service.ts` | Login/logout, leer el rol y CRUD de `clients` |
| `src/app/guards/auth.guard.ts` | Sin sesión no se entra en `/home` |
| `src/app/login/` | Pantalla de login |
| `src/app/home/` | Listado + formulario (solo admin) + deslizar para editar/borrar |
| `src/app/utils/texto-error.ts` | Traduce los errores de Supabase al español para el toast |

## La idea

```
login (email + contraseña) ─► supabase.auth.signInWithPassword ─► currentUser.set(user)
                                                                   │
                                   profiles.select('role') ◄───────┘ loadRole()
                                          │
                                          ▼
                              userRole = 'admin' | 'user'   (signal)
                                          │
              ┌───────────────────────────┴───────────────────────────┐
              ▼                                                        ▼
   admin: formulario + deslizar editar/borrar           user: "Modo lectura", solo el listado
              │
              ▼
   insert / update / delete en clients ─► RLS en Supabase comprueba que eres admin
```

La seguridad de verdad está en la **base de datos** (RLS). El `@if (isAdmin())` solo **esconde** botones; aunque alguien los forzara, Supabase rechazaría la escritura de un `user`.

## Diferencias con el código del PDF (y por qué)

| PDF | Aquí | Por qué |
|---|---|---|
| No hay login ("asumimos que ya está logueado") | Página `login/` + `auth.guard.ts` | Sin sesión, la política "Lectura para autenticados" no deja ver nada |
| `from '@ionic/angular/standalone'` | `from '@ionic/angular'` | En Ionic 9 los componentes standalone ya vienen en el paquete principal |
| `clients: Client[] = []`, `isToastOpen = false`… | `clients = signal<Client[]>([])`… | Tu Angular 22 va **sin zone.js**: tras un `await`, una propiedad normal cambia pero la vista no se entera. Con signals sí |
| `isAdmin = this.supabaseService.userRole` y `isAdmin() === 'admin'` | `userRole` (el rol) + `isAdmin` (un `computed` que da `true`/`false`) | El nombre `isAdmin` para algo que vale `'admin'`/`'user'` confunde |
| `<ion-label position="stacked">` + `ion-input` | `<ion-input label="..." labelPlacement="stacked">` | Es la forma actual de Ionic (la otra está obsoleta) |
| `ion-item-option (click)` sin más | Se pasa `#sliding` y se hace `sliding.close()` | Si no, el item se queda abierto después de editar/borrar |
| Errores con `e.message` en inglés | `textoError(e)` | Mensajes claros: email repetido, sin permiso, contraseña mala |
| Sin `ion-grid` | `ion-grid` con 2 columnas en escritorio | Lo pide el CE 4.a |

## Preguntas para cuando lo estudies

1. ¿Por qué un usuario `user` no puede borrar aunque fuerce la petición? → Por la política "Escritura solo para admins" (RLS).
2. ¿Qué hace `.single()` en `loadRole`? → Devuelve un objeto (la fila del perfil) en vez de un array.
3. ¿Para qué sirve `sessionReady` en el guard? → Para esperar a que se recupere la sesión guardada antes de decidir si te deja pasar.
4. ¿Por qué hacen falta signals en este proyecto y en el PDF no? → Porque sin zone.js Angular solo repinta cuando cambia un signal (o hay un evento de la plantilla).
5. ¿Qué diferencia hay entre `USING` y `WITH CHECK` en la política de escritura? → `USING` decide qué filas puedes tocar; `WITH CHECK` valida la fila resultante.
