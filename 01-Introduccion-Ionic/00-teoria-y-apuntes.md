# Tarea 01 · Introducción a Ionic + proyecto "usersApp"

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
- **Gestión de estado**: en Angular, mediante servicios + RxJS.
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

> 📸 **CAPTURA 3** — Terminal mostrando el comando `ionic start` ejecutándose
> (o ya terminado) y la carpeta `usersApp` creada.
> (Pégala aquí)

### 4. Puesta en marcha
```
cd usersApp
ionic serve
```
Internamente: se lanza un servidor de desarrollo, se compila el proyecto
Angular y se abre en el navegador simulando el WebView del dispositivo
(por defecto en `http://localhost:8100`).

> 📸 **CAPTURA 4** — Navegador mostrando la app por defecto en
> `http://localhost:8100`.
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
  │       ├── users.page.html
  │       └── users.page.scss
  ├── services/
  │   └── users.service.ts
  └── models/
      └── user.model.ts
```

Flujo completo: `Usuario → Página (UI) → Service → API/backend → Datos → UI`.

> 📸 **CAPTURA 5** — App en el navegador mostrando el listado de usuarios
> activos ("Usuarios Activos") generado por `usersApp`.
> (Pégala aquí)

> 📸 **CAPTURA 6** — VS Code con el árbol de archivos del proyecto
> (`models/`, `services/`, `pages/users/`) a la vista.
> (Pégala aquí)

El código de cada archivo (`user.model.ts`, `users.service.ts`,
`users.page.ts`, `users.page.html`, `app-routing.module.ts`) está en la
carpeta [`usersApp/`](./usersApp) de esta misma tarea.

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
