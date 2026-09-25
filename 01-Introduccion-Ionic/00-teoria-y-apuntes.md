# Tarea 01 · Introducción a Ionic + proyecto "usersApp"

---

## Parte 0 · Antes de nada: las piezas del puzle, explicadas desde cero

### ¿Qué es Angular?
Un framework de JavaScript/TypeScript para construir interfaces web. Organiza
el código en **componentes**: cada pantalla o trozo de UI es una clase (la
lógica, en un archivo `.ts`) + una plantilla (lo visual, en un archivo
`.html`), que van siempre de la mano.

### ¿Qué es Ionic?
Se monta **encima** de Angular (también puede ir con React o Vue). Aporta dos
cosas:
1. Componentes visuales que parecen nativos de móvil: `ion-button`,
   `ion-list`, `ion-header`...
2. **Capacitor**: acceso a funciones nativas del dispositivo (cámara, GPS,
   notificaciones) desde ese mismo código web.

Tu app corre, al final, dentro de un navegador "escondido" dentro de la app
nativa (un WebView). Por eso cuando la ves con `ionic serve` en Chrome, ves
básicamente lo mismo que verías en el móvil.

### ¿Qué es TypeScript?
JavaScript con tipos. Te deja declarar `interface User { name: string }` y el
editor te avisa si metes la pata con los tipos. Se compila a JavaScript
normal; el navegador nunca ve TypeScript directamente.

### Componentes *standalone*
En Angular antiguo, agrupabas componentes en "módulos" (`@NgModule`), y las
rutas se definían en un `app-routing.module.ts` aparte (así es como lo
enseña el PDF de la tarea, con una versión algo más antigua de Angular). En
las versiones recientes (la que se ha instalado aquí, Angular 22) ya no hace
falta: cada componente declara sus propios `imports: [...]`, y las rutas
viven en un simple array (`app.routes.ts`). El PDF y nuestro código difieren
un poco en la sintaxis por este motivo, pero el concepto de fondo (modelo /
service / página, rutas) es exactamente el mismo.

### Inyección de dependencias
Cuando un componente escribe `constructor(private usersService: UsersService)`,
no está haciendo `new UsersService()` él mismo. Angular ya tiene una
instancia guardada (gracias al `@Injectable({ providedIn: 'root' })` del
service) y se la entrega sola. Es el mismo concepto que `@Autowired` en
Spring (Java).

### `async` / `await` y las `Promise`
Una `Promise` representa "un valor que llegará más tarde" — como pedir datos
a un servidor. `async` marca una función que puede usar `await`; `await` le
dice "espera aquí a que esto termine", sin bloquear el resto de la app
mientras tanto. Lo usamos porque, en una API real, pedir datos tarda (viaja
por red). Aquí lo simulamos con un `setTimeout` de 500ms.

### Signals
La forma moderna que tiene Angular de saber que un dato ha cambiado y hay
que repintar la pantalla. Antes, una librería llamada Zone.js vigilaba *todo*
automáticamente sin que hicieras nada especial. En las versiones nuevas de
Angular eso ya no viene activado por defecto: si cambias una variable normal
desde dentro de un `async/await`, Angular puede no enterarse (esto es
justo lo que nos pasó: la pantalla se quedaba en "Cargando" para siempre).
Con `signal()` lo declaras explícitamente — `users.set(nuevaLista)` avisa a
Angular directamente.

### La arquitectura por capas (por qué se organiza así)
Es el mismo patrón que un backend en Node o Java/Spring:

| Backend              | Aquí (Ionic/Angular)      |
|-----------------------|----------------------------|
| Modelo/Entidad         | `user.model.ts`            |
| Service (negocio)      | `users.service.ts`         |
| Controller             | `users.page.ts`            |
| Vista / Route          | `users.page.html` + rutas  |

La página (`users.page.ts`) no debe saber de dónde salen los datos, solo se
los pide al `service`. Si mañana pasas de "datos simulados" a una API real,
solo tocas el service — la página no se entera del cambio.

---

## Parte A · Teoría: Introducción a Ionic

### 1. ¿Qué es Ionic?
Ionic es un **framework de desarrollo de aplicaciones híbridas**: permite
crear apps móviles, web y de escritorio con tecnologías web estándar
(HTML5, CSS3, JavaScript/TypeScript), apoyándose en frameworks como
Angular, React o Vue. Para acceder a funcionalidades nativas del
dispositivo (cámara, GPS, notificaciones...) usa **Capacitor**
(anteriormente Cordova).

### 2. Arquitectura de Ionic
- **Capa de presentación**: componentes UI reutilizables (`ion-button`,
  `ion-list`...) basados en Web Components, renderizados con Shadow DOM.
- **Capa lógica**: implementada en Angular/React/Vue — manejo de estado,
  eventos y comunicación con servicios.
- **Capa nativa (Capacitor)**: acceso a APIs del sistema operativo
  (cámara, geolocalización, sistema de archivos, notificaciones).

### 3. ¿Por qué se utiliza Ionic?
- **Reutilización de código**: un único código base genera apps Android,
  iOS y web (PWA).
- **Productividad**: no requiere conocimientos profundos de desarrollo
  nativo, se trabaja con tecnologías web ya conocidas.
- **Ecosistema JavaScript**: se integra con Node.js, APIs REST y
  librerías modernas.

### 4. Conceptos técnicos fundamentales
- **Web Components**: encapsulación del DOM, reutilización de
  componentes, independencia del framework.
- **Shadow DOM**: encapsula estilos y estructura, evita conflictos CSS.
- **Routing**: navegación tipo SPA (Single Page Application).
- **Observables y asincronía**: uso intensivo de Observables (RxJS) e
  integración con `async/await`.
- **Consumo de APIs**: igual que en Node.js, con `HTTP`, `JSON` y
  Promesas.
- **Gestión de estado**: en Angular, mediante servicios + RxJS (o, en
  las versiones más recientes, con signals).
- **CLI (Command Line Interface)**: herramienta principal de trabajo
  (`ionic start`, `ionic serve`, `ionic build`).

### 5. Alternativas a Ionic

| Tecnología    | Lenguaje   | UI      | Rendimiento | Complejidad |
|---------------|------------|---------|-------------|-------------|
| Ionic         | JS/TS      | Web UI  | Medio       | Baja        |
| React Native  | JS/TS      | Nativo  | Alto        | Media       |
| Flutter       | Dart       | Propio  | Muy alto    | Alta        |
| Nativo        | Java/Swift | Nativo  | Muy alto    | Muy alta    |

### 6. Flujo de ejecución en Ionic
1. Usuario interactúa con la UI (`ion-button`).
2. El evento se captura en el componente.
3. Se ejecuta la lógica JS (`async/await`).
4. Se llama a la API (Node.js).
5. Se actualiza el estado y la vista.

### 7. Ventajas y limitaciones
**Ventajas**: basado en estándares web, gran comunidad, compatible con
PWA, fácil integración con backend Node.js.
**Limitaciones**: rendimiento inferior a nativo en apps complejas,
dependencia del WebView, el acceso a hardware depende de plugins.

---

## Parte B · Primeros pasos con Ionic (entorno de trabajo)

### 1. Requisitos previos
Ionic depende del ecosistema **Node.js**:
- `node -v` / `npm -v` para comprobar versiones instaladas (recomendado:
  versión LTS de Node).
- Conocimientos previos imprescindibles: ES6+, async/await, Promesas,
  módulos (`import`/`export`), programación funcional básica, consumo de
  APIs REST.

> 📸 **CAPTURA 1** — Terminal mostrando la salida de `node -v` y `npm -v`.
> (Pégala aquí)

### 2. Instalación de Ionic CLI
```
npm install -g @ionic/cli
ionic -v
```

> 📸 **CAPTURA 2** — Terminal mostrando `ionic -v` con la versión instalada.
> (Pégala aquí)

### 3. Creación del proyecto
```
ionic start usersApp blank --type=angular
```
(En nuestro caso, este comando falló al descargar la plantilla, así que
usamos `ng new usersApp` — ver la Parte D para el detalle. El resultado
final, en la práctica, es el mismo: un proyecto Angular en blanco.)

Estructura generada:
```
/usersApp
  ├── src/
  │   ├── app/
  │   ├── assets/
  │   ├── index.html
  │   └── main.ts
  ├── angular.json
  ├── package.json
  └── ionic.config.json
```

> 📸 **CAPTURA 3** — Terminal mostrando el comando de creación del proyecto
> (o ya terminado) y la carpeta `usersApp` creada.
> (Pégala aquí)

### 4. Puesta en marcha
```
cd usersApp
ionic serve      (o "ng serve" si Ionic aún no está añadido al proyecto)
```
Internamente: se lanza un servidor de desarrollo, se compila el proyecto
Angular y se abre en el navegador simulando el WebView del dispositivo.

> 📸 **CAPTURA 4** — Navegador mostrando la app funcionando (la lista de
> usuarios activos).
> (Pégala aquí)

---

## Parte C · Proyecto práctico: "usersApp" (equivalente a una API REST)

**Objetivo**: construir una app Ionic que consuma datos (simulando una
API) aplicando una arquitectura por capas, igual que en un backend:

| Node.js      | Ionic                         |
|--------------|--------------------------------|
| Routes       | Routing (Angular)              |
| Controllers  | Pages (lógica del componente)  |
| Services     | Services                       |
| Models       | Interfaces                     |
| Middleware   | Interceptors / Guards          |

Estructura del proyecto (dentro de `src/app`):
```
/src/app
  ├── pages/
  │   └── users/
  │       ├── users.page.ts
  │       └── users.page.html
  ├── services/
  │   └── users.service.ts
  └── models/
      └── user.model.ts
```

Flujo completo: `Usuario → Página (UI) → Service → API/backend → Datos → UI`.

> 📸 **CAPTURA 5** — App en el navegador mostrando el listado de usuarios
> activos (Ana y Carlos, sin Luis porque está inactivo).
> (Pégala aquí)

> 📸 **CAPTURA 6** — VS Code con el árbol de archivos del proyecto
> (`models/`, `services/`, `pages/users/`) a la vista.
> (Pégala aquí)

### Buenas prácticas aplicadas
- No meter lógica en el HTML.
- Centralizar las llamadas a la "API" en los services.
- Usar interfaces para tipar los datos (`user.model.ts`).
- Separar responsabilidades (modelo / servicio / página).
- Async/await en todas las llamadas asíncronas.

### Posibles mejoras (para más adelante)
1. Formulario para crear usuario.
2. Navegación entre páginas.
3. Persistencia local.
4. Consumo de una API Node real (en vez de datos simulados).
5. Interceptors (equivalente a middleware).
6. Gestión de errores global.
7. Añadir de verdad `@ionic/angular` y sustituir el `<ul>/<li>` por
   `ion-list`/`ion-item`.

---

## Parte D · Qué hemos hecho, paso a paso (todo el proceso, en orden)

1. **Analizamos el PDF de la tarea** para sacar la teoría y el código de
   ejemplo (lo que forma las Partes A, B y C de arriba).
2. **Miramos cómo tienes organizada `C:\DAM 2`**: vimos que "Acceso a
   Datos" sigue el patrón `01-Tema`, `02-Tema`... y copiamos ese mismo
   estilo para esta asignatura.
3. **Creamos la carpeta** `C:\DAM 2\Desarrollo de Interfaces\` con un
   `README.md` general y la subcarpeta `01-Introduccion-Ionic\`.
4. **Inicializamos git** ahí (`git init`): a partir de ese momento, esa
   carpeta empieza a llevar un historial de cambios.
5. **Intentamos `ionic start usersApp blank --type=angular`** (el comando
   "oficial" que dice el PDF), pero falló: el CLI de Ionic descarga una
   plantilla desde un servidor externo, y esa descarga no funcionó bien.
6. **Usamos `ng new usersApp` en su lugar** (el CLI de Angular
   directamente) — consigue el mismo resultado (un proyecto Angular
   en blanco y funcional) sin depender de esa descarga que fallaba.
7. **Escribimos los apuntes de teoría** (este mismo archivo).
8. **Configuramos el acceso a tu GitHub**: creaste un token (una
   contraseña temporal, limitada solo a este repo) para que se pudiera
   hacer `git push` sin compartir tu contraseña real.
9. **Primer commit y push** — subió la estructura + apuntes + el
   esqueleto en blanco de Angular.
10. **Escribimos el código del ejercicio**: `user.model.ts`,
    `users.service.ts`, `users.page.ts/html`, y conectamos la ruta
    `/users`. Segundo commit y push.
11. **Detectamos y arreglamos un bug**: al ejecutar `ng serve` en tu PC,
    la pantalla se quedaba en "Cargando" para siempre. La causa: en esta
    versión de Angular, cambiar una variable normal desde un
    `async/await` no repinta la pantalla sola. Lo arreglamos usando
    `signal()`. Tercer commit y push.
12. **Tú ejecutaste `npm install` y `ng serve` en tu PC** y comprobamos
    juntos que la lista de usuarios aparece correctamente.

---

## Parte E · Git y GitHub, desde cero

- **Git**: un programa que vive en tu ordenador y guarda un historial de
  versiones de una carpeta. Cada "foto" del estado de los archivos en un
  momento dado es un **commit**.
- **GitHub**: una web que aloja una copia de ese historial en la nube,
  para compartirlo o que otra persona (el profesor) lo revise.
- **Repositorio (repo)**: la carpeta + todo su historial de commits.
- **`git add`**: marca qué archivos quieres incluir en el próximo commit
  (como meter cosas en una caja antes de cerrarla).
- **`git commit -m "mensaje"`**: cierra esa caja con una foto fija del
  estado + un mensaje explicando qué cambiaste.
- **`git push`**: envía esos commits nuevos desde tu ordenador a GitHub.
- **`git status`**: te dice qué archivos has cambiado y no has "cajeado"
  (add) todavía.
- **`git log`**: el historial de commits, en orden.
- **Token de acceso**: GitHub no deja usar tu contraseña normal para que
  un programa externo haga push. En su lugar generas una llave temporal
  (el token), con permisos limitados (en este caso: solo escribir
  contenido, solo en este repo). Se puede revocar cuando quieras.

### Tu repo
`https://github.com/JorgeGonzalezDI/Desarrollo-Interfaces-DAM-2`

Commits hasta ahora:
1. `Primer avance: estructura inicial y apuntes de Introduccion a Ionic`
2. `usersApp: modelo, service y pagina de usuarios activos con routing`
3. `fix: usar signals en UsersPage para que la vista se actualice`

---

## Parte F · El código, archivo por archivo

### `models/user.model.ts`
```typescript
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean;
}
```
Una `interface` define la forma que debe tener un objeto (como una interface
de Java, pero sin lógica y que se "borra" al compilar — solo ayuda al
editor/compilador a avisarte de errores).

### `services/users.service.ts`
```typescript
@Injectable({ providedIn: 'root' })
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Ana', email: 'ana@test.com', active: true },
    { id: 2, name: 'Luis', email: 'luis@test.com', active: false },
    { id: 3, name: 'Carlos', email: 'carlos@test.com', active: true }
  ];

  async getUsers(): Promise<User[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.users), 500);
    });
  }

  async getActiveUsers(): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter(u => u.active);
  }
}
```
- El array `users` es la "base de datos falsa" en memoria.
- `getUsers()` simula la latencia real de una API (500ms de espera).
- `getActiveUsers()` pide todos los usuarios y se queda solo con los
  `active: true`, usando `.filter()` (programación funcional, como los
  Streams de Java).

### `pages/users/users.page.ts` (versión final, con signals)
```typescript
export class UsersPage implements OnInit {
  users = signal<User[]>([]);
  loading = signal(false);

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading.set(true);
      const data = await this.usersService.getActiveUsers();
      this.users.set(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
```
- `constructor(private usersService: UsersService)`: aquí Angular
  **inyecta** el service — no lo creamos nosotros con `new`.
- `ngOnInit()`: se ejecuta automáticamente una vez, al crear la pantalla.
- `loadUsers()`: pone `loading` a `true`, pide los usuarios activos, y
  cuando llegan los guarda. El `finally` asegura que `loading` vuelve a
  `false` pase lo que pase (haya error o no).
- `signal(...)` / `.set(...)`: la forma moderna de avisar a Angular de que
  algo ha cambiado y hay que repintar.

### `pages/users/users.page.html`
```html
<h1>Usuarios activos</h1>
<p *ngIf="loading()">Cargando...</p>
<ul *ngIf="!loading()">
  <li *ngFor="let user of users()">
    <strong>{{ user.name }}</strong> — {{ user.email }}
  </li>
</ul>
```
- `*ngIf="loading()"`: solo se muestra si `loading()` es `true` (nota los
  paréntesis: al ser un signal, hay que "leerlo" como si fuera una
  función).
- `*ngFor="let user of users()"`: repite el `<li>` una vez por usuario —
  como un `for (User user : users)` de Java, pero en el propio HTML.
- `{{ user.name }}`: interpolación, mete el valor en el HTML.

### `app.routes.ts`
```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage) }
];
```
El "mapa" de rutas: si entras en `/`, te redirige a `/users`; `/users`
carga nuestra página (`loadComponent` la carga solo cuando hace falta).

### El recorrido completo, de principio a fin
1. Abres `http://localhost:4200` → el router te redirige a `/users`.
2. Angular crea `UsersPage` e inyecta `UsersService`.
3. Se ejecuta `ngOnInit()` → llama a `loadUsers()`.
4. `loadUsers()` pone `loading` a `true` y pide los usuarios activos.
5. El service espera 500ms (simulando la red) y filtra los activos.
6. El resultado se guarda con `.set(...)`, `loading` vuelve a `false`.
7. El HTML, que "escucha" esos signals, se repinta solo.

Si mañana hubiera un backend real, solo cambiaría `getUsers()` (usaría
`fetch('http://localhost:3000/api/users')` en vez del array en memoria)
— el resto de la cadena no cambiaría nada.

---

## Parte G · Cómo continuar tú solo, desde VS Code

1. Abre en VS Code la carpeta `Desarrollo de Interfaces` (la de arriba
   del todo, no `usersApp` directamente) — así ves el repositorio git
   completo.
2. Para programar: navega a `01-Introduccion-Ionic/usersApp/src/app/...`
   y edita con normalidad.
3. Para ejecutar la app: terminal integrada, `cd 01-Introduccion-Ionic\usersApp`,
   luego `ng serve`.
4. Para guardar cambios en git, con la interfaz (sin comandos):
   - Icono de la izquierda con forma de rama (**Source Control**): ahí
     ves los archivos que has cambiado.
   - Escribe un mensaje arriba y pulsa el ✓ (Commit).
   - Botón de sincronizar/subir ("Sync Changes") para hacer el push.
   - La primera vez que subas tú, VS Code te pedirá iniciar sesión en
     GitHub por el navegador — lo autorizas una vez y ya no te lo vuelve
     a pedir.
