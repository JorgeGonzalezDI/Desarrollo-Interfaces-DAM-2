# 05 · Laboratorio TechTicket: estado reactivo (Store + Signals) y Android (entrega 09-10-2026)

> **Ordenado en la guía de estudio** (`00-Apuntes/01-guia-de-estudio-desde-cero.md`, o el PDF `00-Apuntes/Interfaces_Movil.pdf`): el patrón Store en §A8.3–A8.4, Capacitor en §A11 y la ficha con el mapa en §B5.

## Dónde está la teoría

| Qué | Dónde |
|---|---|
| Enunciado del profe | `Lab_Reactividad.pdf` (en esta carpeta) |
| · Comandos para crear el proyecto | Lab, pág. 1 |
| · Patrón Store / MVVM y SOLID | Lab, pág. 2 |
| · El servicio `TicketService` | Lab, págs. 3–4 |
| · El componente `TicketDashboard` | Lab, págs. 5–7 |
| · Capacitor y Android | Lab, pág. 7 |
| Signals (`signal`, `computed`, `update`) | `../04-Reactividad-Signals-Carrito/00-teoria-y-apuntes.md` (léelo antes que este) |
| Tu guía de estudio | `00-Apuntes/01-guia-de-estudio-desde-cero.md` → §A5.7 (`ngOnInit`), §A5.9 (servicios e inyección de dependencias), §A6 (qué es una API REST), §A7.4 (`subscribe` paso a paso), §A7.7 (`provideHttpClient`) |

---

## La idea

Es el carrito pero "en serio": el estado ya no vive en el componente, sino en un **servicio** (el *Store*). El componente solo pinta lo que el servicio le da.

```
ngOnInit ─► cargarDatos() ─► ticketService.fetchTickets()
                                   │
                                   ├─ state.update(loading: true)       → se ve el spinner
                                   ├─ http.get('jsonplaceholder/todos')
                                   │     ├─ next  → state.update(data, loading: false) → se ve la lista
                                   │     └─ error → state.update(error, loading: false) → mensaje + Reintentar
                                   ▼
               computed tickets / isLoading / errorMessage  (solo lectura)
                                   ▼
               componente: computed ticketsFiltrados (datos + filtro) → template
```

---

## El servicio, bloque a bloque

Archivo: `tech-ticket/src/app/core/services/ticket.service.ts`

```ts
private http = inject(HttpClient);
```
Pide el `HttpClient` a Angular en vez de hacer `new`. Esto es la **inyección de dependencias** (DIP). Para que funcione, `app.config.ts` tiene `provideHttpClient()`.

```ts
private state = signal<TicketState>({ data: [], loading: false, error: null });
```
**Un solo objeto con todo el estado**: los datos, si está cargando y el error. Es `private`, así que nadie de fuera puede tocarlo.

```ts
public tickets      = computed(() => this.state().data);
public isLoading    = computed(() => this.state().loading);
public errorMessage = computed(() => this.state().error);
```
Lo que se enseña fuera es **solo lectura**: un `computed` no tiene `.set()`. Esto es el **OCP** (abierto a añadir selectores nuevos, cerrado a que te cambien el estado desde fuera).

```ts
this.state.update(s => ({ ...s, loading: true, error: null }));
```
`{ ...s, loading: true }` es el spread de **objetos**: copia todo lo que había en `s` y sobreescribe `loading` y `error`. Es la misma idea que `[...array, nuevo]` del carrito: siempre un objeto nuevo.

```ts
this.http.get<Ticket[]>(url).subscribe({
  next:  (response) => this.state.update(s => ({ ...s, data: response, loading: false })),
  error: ()         => this.state.update(s => ({ ...s, error: 'Error de red…', loading: false }))
});
```
`get` devuelve un Observable y no hace nada hasta que te suscribes (guía §A7.4). `next` se ejecuta si va bien y `error` si falla.

## El componente, bloque a bloque

Archivo: `tech-ticket/src/app/features/ticket-dashboard/ticket-dashboard.component.ts`

- `public ticketService = inject(TicketService);` es **public** para poder usarlo en el template (`ticketService.isLoading()`).
- `filtroActual = signal<'todos' | 'abiertos' | 'cerrados'>('todos')` usa un **tipo unión**: solo admite esos 3 textos.
- `ticketsFiltrados = computed(...)` depende de **dos** signals, `tickets()` y `filtroActual()`. Cambia una cualquiera y se recalcula.
- `ngOnInit()` se ejecuta una vez al crear el componente y lanza la carga (guía §A5.7).
- `cambiarFiltro(event)`: el `<ion-segment>` lanza `ionChange` y el valor elegido viene en `event.detail.value`.

Template:
- `@if (isLoading()) {…} @else if (errorMessage()) {…} @else {…}` son los 3 estados de la pantalla: cargando, error y datos.
- `[color]="ticket.completed ? 'success' : 'warning'"` es un property binding con un ternario: verde si está resuelto y amarillo si está pendiente.

---

## SOLID en una tabla

| Principio | Dónde se ve |
|---|---|
| **SRP** (una responsabilidad) | El servicio solo gestiona el estado; el componente solo pinta y recoge clicks |
| **OCP** (abierto/cerrado) | `state` privado + `computed` públicos de solo lectura |
| **DIP** (inversión de dependencias) | `inject(HttpClient)` e `inject(TicketService)`, nunca `new` |

---

## Android con Capacitor (capturas 6 y 7)

```bash
ionic build --prod        # compila a www/
npx cap add android       # crea la carpeta android/ (una sola vez)
npx cap sync android      # copia www/ dentro de android/ (cada vez que vuelves a hacer build)
npx cap open android      # abre Android Studio → emulador   (PENDIENTE)
npx cap run android       # o directo a un móvil por USB
```

- **Cosa que falló y cómo se arregló**: `ionic build` daba `Project "app" does not exist`. El Ionic CLI busca un proyecto llamado `app` en `angular.json`. Se renombró a `app` y se puso `outputPath: www` (lo que hace `ionic start`), y en `capacitor.config.ts` → `webDir: 'www'`.
- **Pendiente**: abrirlo en Android Studio y probarlo en el emulador.

## Qué demuestra cada captura (`capturas/`)

| Captura | Qué se ve |
|---|---|
| 1_cargando | Spinner "Sincronizando incidencias…" (`isLoading`) |
| 2_todos | Los 15 tickets con badge Pendiente/Resuelto |
| 3_abiertos | Solo los 8 con `completed = false` |
| 4_cerrados | Solo los 7 con `completed = true` |
| 5_error_red | Mensaje de error + botón Reintentar |
| 6_terminal_build | `ionic build --prod` |
| 7_terminal_capacitor | `npx cap add android` + `npx cap sync android` |

Las capturas se hicieron en un entorno sin acceso a jsonplaceholder, así que la app recibió la misma respuesta que da la API real (los 15 primeros todos). En tu PC va contra la API de verdad.

## Cómo ejecutarlo

```bash
cd tech-ticket
npm install
ionic serve        # o npm start
```

---

## Comprueba que lo entiendes

1. ¿Por qué `state` es `private` y `tickets` es un `computed` público?
   → Para que solo el servicio pueda cambiar el estado; desde fuera solo se lee (OCP y encapsulación).
2. ¿Qué hace `{ ...s, loading: true }`?
   → Crea un objeto nuevo copiando `s` y cambiando solo `loading`.
3. ¿Por qué al cambiar de filtro no se vuelve a llamar a la API?
   → Porque `ticketsFiltrados` filtra en memoria los datos que ya están en la signal.
4. ¿Qué tiene que pasar para que se vea el botón Reintentar?
   → Que la petición falle: el `subscribe` entra en `error` y se rellena `errorMessage`.
5. ¿Cuándo hay que repetir `npx cap sync android`?
   → Cada vez que cambias el código y vuelves a hacer `ionic build`.
