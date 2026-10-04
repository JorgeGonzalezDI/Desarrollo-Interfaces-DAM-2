# Desarrollo de Interfaces · DAM 2

**Alumno:** Jorge González Gómez
**Módulo:** 0488 · Desarrollo de Interfaces
**Ciclo:** 2º DAM — Desarrollo de Aplicaciones Multiplataforma (Universidad Nebrija)
**Curso:** 2026-2027

Repositorio con las prácticas y apuntes de la asignatura. Las aplicaciones se desarrollan con
**Ionic + Angular (componentes standalone) + TypeScript**, se versionan en GitHub y se publican
en **Vercel**.

---

## Prácticas

| Nº | Práctica | Qué se trabaja | Código | Demo |
|----|----------|----------------|--------|------|
| 01 | Introducción a Ionic | Proyecto Angular, modelo + servicio + página, routing, signals. Paradigmas asíncronos de JavaScript (`.then()`, `async/await`, callbacks). | [`01-Introduccion-Ionic`](01-Introduccion-Ionic) | — |
| 02 | Corporate App | App Ionic standalone con menú, rutas *lazy*, productos desde JSON, servicio con **inyección de dependencias**, campo vendedor en el grid. Publicada en Vercel. | [`02-CorporateApp`](02-CorporateApp) | [desarrollo-interfaces-dam-2.vercel.app](https://desarrollo-interfaces-dam-2.vercel.app) |

Cada carpeta de práctica contiene:

- `00-teoria-y-apuntes.md`: explicación teórica de la práctica.
- `01-guia-tecnica-capturas.md`: pasos para reproducirla y obtener las capturas.
- `capturas/`: capturas usadas en la entrega.
- El proyecto (la carpeta con `package.json`) y, si aplica, el PDF entregado.

## Estructura

```
├── 00-Apuntes/                 Apuntes generales de la asignatura
├── 01-Introduccion-Ionic/
│   ├── usersApp/               Proyecto Angular: lista de usuarios activos
│   └── paradigmas-js/          fetch .then(), async/await y XMLHttpRequest
└── 02-CorporateApp/
    ├── corporateApp/           Proyecto Ionic + Angular standalone + Capacitor
    ├── capturas/
    └── Entrega-Tarea02-CorporateApp.pdf
```

## Tecnologías

| Herramienta | Uso |
|---|---|
| Node.js 24 + npm | Entorno de ejecución y gestor de paquetes |
| Ionic CLI 7 · @ionic/angular 9 | Componentes de interfaz móvil |
| Angular 22 (standalone, sin zone.js) | Framework: componentes, rutas, servicios, signals |
| TypeScript | Lenguaje |
| Capacitor | Puente a funciones nativas / Android |
| Git + GitHub | Control de versiones |
| Vercel | Despliegue web automático en cada `push` a `main` |

## Cómo ejecutar un proyecto

```bash
cd 02-CorporateApp/corporateApp   # carpeta que contiene package.json
npm install                       # descarga las dependencias (node_modules)
ionic serve                       # abre la app en http://localhost:8100
```
