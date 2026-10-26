# Desarrollo de Interfaces · DAM 2

**Alumno:** Jorge González Gómez
**Módulo:** 0488 · Desarrollo de Interfaces
**Ciclo:** 2º DAM — Desarrollo de Aplicaciones Multiplataforma (Universidad Nebrija)
**Curso:** 2026-2027

Repositorio con las prácticas y apuntes de la asignatura. Las aplicaciones se desarrollan con
**Ionic + Angular (componentes standalone, sin zone.js) + TypeScript**, se versionan en GitHub y
se publican en **Vercel**.

> El [**registro de trabajo**](#registro-de-trabajo) del final recoge la fecha y la hora de cada
> avance, sacadas directamente del historial de Git.

---

## Prácticas

| Nº | Práctica | Qué se trabaja | Código | Demo |
|----|----------|----------------|--------|------|
| 01 | Introducción a Ionic | App Ionic standalone `usersApp`: modelo, servicio con `Promise` y `async/await`, página con `ion-list`, `ion-spinner` e `ion-badge`, `inject()` y signals. Paradigmas asíncronos de JavaScript (`.then()`, `async/await`, callbacks). | [`01-Introduccion-Ionic`](01-Introduccion-Ionic) | — |
| 02 | Corporate App | App Ionic standalone con menú, rutas *lazy*, productos desde JSON, servicio con **inyección de dependencias**, campo vendedor en el grid, **geolocalización** con distancia a la oficina (Haversine) y **formulario de contacto** con persistencia local (Capacitor Preferences). | [`02-CorporateApp`](02-CorporateApp) | [desarrollo-interfaces-dam-2.vercel.app](https://desarrollo-interfaces-dam-2.vercel.app) |
| 03 | API REST de productos | Consumo de `dummyjson.com/products` con `HttpClient` y Observables: tabla y vista de cards, paginación con `limit`/`skip`, modo oscuro con un `ThemeService`, página About y despliegue en Vercel. | [`03-API-REST-Productos`](03-API-REST-Productos) | En el PDF de entrega |
| 04 | Reactividad con Signals | Carrito reactivo con `signal`, `computed` y `effect`. | [`04-Reactividad-Signals-Carrito`](04-Reactividad-Signals-Carrito) | — |
| 05 | Lab TechTicket | Patrón *Store* con signals, `HttpClient`, estados cargando / error / datos, filtros con `ion-segment` y empaquetado Android con Capacitor. | [`05-Lab-Reactividad-TechTicket`](05-Lab-Reactividad-TechTicket) | — |
| 06 | Supabase: login y roles | Autenticación, tabla de perfiles con rol, seguridad RLS y CRUD de clientes solo para administradores. | [`06-Supabase-Auth-Roles`](06-Supabase-Auth-Roles) | — |
| 07 | Formularios reactivos | Alta de productos de inventario: Reactive Forms, validadores personalizados, signal que bloquea el formulario mientras guarda, `ion-toast` y guardado local con Capacitor Preferences. | [`07-Formularios-Reactivos-Inventario`](07-Formularios-Reactivos-Inventario) | — |
| 08 | Lab Guards: control de acceso | Login con dos roles, sesión en un signal persistida en `sessionStorage`, **functional guards** (`authGuard`) que redirigen con `UrlTree` y factoría `roleGuard(rol)` para que el operador no entre en `/admin`. | [`08-Lab-Guards-Auth`](08-Lab-Guards-Auth) | — |

Cada carpeta contiene el proyecto (la carpeta con `package.json`), el PDF entregado y `capturas/`.
La mayoría incluye también un `README.md` con la tabla requisito → fichero y
`00-teoria-y-apuntes.md` con la explicación del código.

## Revisiones de prácticas ya entregadas

Estoy rehaciendo las prácticas a mano, una a una, para entenderlas a fondo. Cuando la versión
nueva queda mejor que la entregada, sustituye a la anterior (la antigua sigue en el historial de Git).

| Práctica | Fecha | Qué cambia respecto a la entregada |
|---|---|---|
| 01 · `usersApp` | 24-10-2026 | Pasa de proyecto Angular sin Ionic a **app Ionic standalone** con `ion-list`, `ion-spinner` e `ion-badge`. El servicio se declara con `@Service()` (Angular 22) y la página lo recibe con **`inject()`** en lugar de por el constructor. El estado (la lista y "cargando") va en **`signal()`**, necesario en una app sin zone.js para que la vista se actualice tras un `await`. La carga usa `try / catch / finally` y la plantilla `@if` / `@for` / `@empty`. Código comentado. |
| 02 · `corporateApp` | 25-10-2026 | Se completa lo que faltaba de la práctica: **Nosotros** pide la ubicación con `@capacitor/geolocation` y calcula la distancia a la oficina con la fórmula de **Haversine**; **Contacto** tiene un formulario (`ngModel` sobre `signal`) y guarda los mensajes con `@capacitor/preferences`. El servicio de productos pasa a `@Service()` con **`inject()`** y el estado va en **`signal()`**; las plantillas usan `@for` / `@if` / `@empty`. Código comentado. |
| 03 · `dam2-productos` | 26-10-2026 | Rehecha a mano y completadas las 10 peticiones: además de la tabla con estados de carga / error / reintento, **página About**, **paginación** con `limit` y `skip` (signal `pagina` y `computed` para el total de páginas), **modo oscuro** con un `ThemeService` (signal + clase `ion-palette-dark` + `localStorage`) y **vista de cards** con selector `ion-segment`. Rutas con *lazy loading* y estado en `signal()`. Código comentado. |

## Estructura

```
├── 00-Apuntes/                          Guía de estudio (teoría + prácticas) y su PDF para el móvil
├── 01-Introduccion-Ionic/
│   ├── usersApp/                        App Ionic: lista de usuarios activos
│   └── paradigmas-js/                   fetch .then(), async/await y XMLHttpRequest
├── 02-CorporateApp/corporateApp/        App corporativa: menú, productos, geolocalización y contacto (Vercel)
├── 03-API-REST-Productos/dam2-productos/        Consumo de API REST con HttpClient
├── 04-Reactividad-Signals-Carrito/carrito-signals/
├── 05-Lab-Reactividad-TechTicket/tech-ticket/   + proyecto Android (Capacitor)
├── 06-Supabase-Auth-Roles/dam-crm-app/
├── 07-Formularios-Reactivos-Inventario/inventario-app/
├── 08-Lab-Guards-Auth/auth-guard-app/
└── actualizar-registro.mjs              Regenera el registro de trabajo de este README
```

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 24 + npm | Entorno de ejecución y gestor de paquetes |
| Ionic CLI 7 · @ionic/angular 9 | Componentes de interfaz móvil |
| Angular 22 (standalone, sin zone.js) | Framework: componentes, rutas, servicios, signals |
| TypeScript | Lenguaje |
| Capacitor | Puente a funciones nativas / Android |
| Supabase | Base de datos PostgreSQL, autenticación y seguridad RLS |
| Git + GitHub | Control de versiones |
| Vercel | Despliegue web automático en cada `push` a `main` |

## Cómo ejecutar un proyecto

```bash
cd 01-Introduccion-Ionic/usersApp   # carpeta que contiene package.json
npm install                         # descarga las dependencias (node_modules)
ionic serve                         # abre la app en http://localhost:8100
```

## Registro de trabajo

Generado a partir del historial de Git con `node actualizar-registro.mjs`: cada fila es un commit
con su fecha y hora reales.

<!-- REGISTRO:INICIO -->
**29 commits** en **11 días de trabajo**, del 25-09-2026 al 26-10-2026 (lo más reciente arriba).

| Fecha | Hora | Trabajo realizado |
|---|---|---|
| **26-10-2026** | 18:36 | 03 API REST: PDF de entrega final (10 peticiones, sin capturas) |
|  | 18:03 | 03 API REST: version rehecha a mano con About, paginacion, modo oscuro y cards |
|  | 13:11 | PDFs de entrega de 01, 02 y 08 sin capturas (el codigo esta en GitHub) |
|  | 13:01 | Corporate App: PDF de entrega de la version final (geolocalizacion y contacto) + capturas |
|  | 13:01 | Ionic Intro: PDF de entrega de la version final (usersApp) + capturas |
|  | 12:50 | Actividad 08: Lab Guards (authGuard, roleGuard y sesion en sessionStorage) + PDF de entrega y apuntes |
| **25-10-2026** | 17:54 | Corporate App: rehecha a mano con geolocalizacion (Haversine) y contacto con Preferences (codigo comentado) |
| **24-10-2026** | 22:01 | Ionic Intro: usersApp rehecha con componentes de Ionic, inject() y signals (codigo comentado) |
|  | 21:42 | Apuntes: guia reorganizada en teoria (Parte A) y practicas (Parte B) |
| **20-10-2026** | 19:01 | Supabase: Lab CRUD con roles + capturas |
| **19-10-2026** | 13:05 | Actividad 07: formularios reactivos (inventario) + carpetas 04-06 |
| **06-10-2026** | 21:40 | Actividad API REST: enlace de Vercel en el PDF |
|  | 20:46 | Apuntes: parte 3, proyecto dam2-productos y Git a fondo (ramas y comandos) |
|  | 20:44 | Actividad API REST: PDF de entrega mas breve |
|  | 20:40 | Actividad API REST: PDF de entrega (version 1) |
|  | 20:38 | Actividad API REST: README con estado de las peticiones |
|  | 20:35 | Actividad API REST: base dummyjson + dimensiones, stock valorado y boton volver (entrega parcial) |
| **05-10-2026** | 11:43 | Apuntes: explicar framework, data binding y Observables con mas detalle |
|  | 08:56 | Apuntes: parte 2, APIs REST, Observables y actividad guiada dummyjson |
| **04-10-2026** | 18:03 | Apuntes: guia de estudio desde cero de la asignatura |
|  | 17:57 | Repositorio solo de Desarrollo de Interfaces: README de presentacion y .gitignore |
| **02-10-2026** | 10:11 | PDF de entrega final |
|  | 10:00 | Tarea 02: Corporate App con vendedor |
| **28-09-2026** | 11:38 | Paradigmas JS: fetch, async/await y callback clasico con jsonplaceholder |
|  | 09:05 | Tarea Ionic: estructura de proyecto y Data Binding (componente galeria) |
| **25-09-2026** | 08:39 | apuntes: teoria ampliada desde cero (Angular/Ionic/TS, git/GitHub, codigo explicado y proceso completo) |
|  | 08:13 | fix: usar signals en UsersPage para que la vista se actualice (Angular sin zone.js) |
|  | 07:57 | usersApp: modelo, service y pagina de usuarios activos con routing (version minima sin Ionic UI todavia) |
|  | 07:51 | Primer avance: estructura inicial y apuntes de Introduccion a Ionic |
<!-- REGISTRO:FIN -->
