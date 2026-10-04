# Desarrollo de Interfaces — Guía de estudio desde cero

> Para leer en VS Code con la vista previa: abre este fichero y pulsa **Ctrl + Shift + V**.
> Tiempo estimado: 2–3 horas leyendo con calma y abriendo el código a la vez.
> Si algo no lo entiendes, sigue leyendo: casi todo se aclara con el ejemplo siguiente.

## Índice

1. [El mapa: de qué va la asignatura](#1-el-mapa-de-qué-va-la-asignatura)
2. [Las herramientas: Node, npm, Ionic CLI, la terminal](#2-las-herramientas-node-npm-ionic-cli-la-terminal)
3. [JavaScript y TypeScript: lo mínimo para leer el código](#3-javascript-y-typescript-lo-mínimo-para-leer-el-código)
4. [Práctica: paradigmas asíncronos de JavaScript (`paradigmas-js`)](#4-práctica-paradigmas-asíncronos-de-javascript-paradigmas-js)
5. [Angular: las piezas](#5-angular-las-piezas)
6. [Práctica 1: el componente galería (data binding)](#6-práctica-1-el-componente-galería-data-binding)
7. [Práctica: `usersApp` línea a línea](#7-práctica-usersapp-línea-a-línea)
8. [Práctica 2: `corporateApp` línea a línea](#8-práctica-2-corporateapp-línea-a-línea)
9. [Cómo harías la Corporate App tú solo, desde cero](#9-cómo-harías-la-corporate-app-tú-solo-desde-cero)
10. [Git, GitHub y Vercel](#10-git-github-y-vercel)
11. [Glosario](#11-glosario)
12. [Ejercicios para practicar (con soluciones)](#12-ejercicios-para-practicar-con-soluciones)
13. [Chuleta para mañana en clase](#13-chuleta-para-mañana-en-clase)

---

## 1. El mapa: de qué va la asignatura

**Desarrollo de Interfaces** trata de hacer **la parte que ve y toca el usuario** de una
aplicación: pantallas, botones, listas, formularios, navegación entre pantallas…

En esta asignatura no se hacen interfaces con Java (como Swing o JavaFX), sino con
**tecnologías web**, para que **la misma app funcione en el navegador y en el móvil**. A esto se
le llama **app híbrida**.

### Las capas, de abajo arriba

Piensa en una tarta de capas. Cada una se apoya en la anterior:

```
┌─────────────────────────────────────────────┐
│ Capacitor   → convierte la web en app Android/iOS y da acceso a GPS, cámara...
├─────────────────────────────────────────────┤
│ Ionic       → piezas visuales con aspecto de móvil (<ion-button>, <ion-list>...)
├─────────────────────────────────────────────┤
│ Angular     → organiza la app: componentes, rutas, servicios
├─────────────────────────────────────────────┤
│ TypeScript  → el lenguaje: JavaScript + tipos
├─────────────────────────────────────────────┤
│ HTML + CSS + JavaScript → lo que entiende el navegador
└─────────────────────────────────────────────┘
```

| Capa | Qué es | Comparación con lo que ya sabes |
|---|---|---|
| **HTML** | Describe *qué hay* en la página: un título, un botón, una imagen. | Como el "esqueleto". |
| **CSS** (o SCSS) | Describe *cómo se ve*: colores, tamaños, márgenes. | La "ropa". |
| **JavaScript** | Describe *qué hace*: reaccionar a clics, pedir datos… | El "cerebro". |
| **TypeScript** | JavaScript con tipos (`number`, `string`…). Se traduce a JavaScript antes de ejecutarse. | Como Java: te obliga a decir el tipo y te avisa de errores **antes** de ejecutar. |
| **Angular** | Un *framework*: un esqueleto de proyecto con reglas para organizarlo. | Como Spring para Java: impone estructura. |
| **Ionic** | Una librería de componentes visuales con estilo de app móvil. | Como tener los botones y listas de Android ya hechos. |
| **Capacitor** | Empaqueta la web como app nativa y le da acceso al hardware. | El "traductor" a móvil. |

**Idea clave:** cuando ejecutas `ionic serve`, todo se **compila** a HTML + CSS + JavaScript
normal, que es lo único que el navegador entiende.

---

## 2. Las herramientas: Node, npm, Ionic CLI, la terminal

### 2.1 Node.js

**Node.js** permite ejecutar JavaScript **fuera del navegador**, en tu ordenador. Lo necesitamos
porque las herramientas (Angular CLI, Ionic CLI, el compilador de TypeScript…) son programas
escritos en JavaScript.

```powershell
node -v      # muestra la versión de Node (tú tienes la 24)
```

### 2.2 npm (Node Package Manager)

**npm** es el **gestor de paquetes** de Node. Un *paquete* es una librería que ha hecho otra
persona (Angular, Ionic, Capacitor…). npm las descarga de internet.

Comparación: es como **Maven** en Java (el `pom.xml`), pero para JavaScript.

| Comando | Qué hace |
|---|---|
| `npm install` | Lee `package.json` y descarga **todas** las dependencias a la carpeta `node_modules/`. |
| `npm install paquete` | Descarga un paquete nuevo y lo apunta en `package.json`. |
| `npm install -D paquete` | Igual, pero como **devDependency** (solo para desarrollar). |
| `npm install -g paquete` | Lo instala **globalmente** en tu PC (para usarlo como comando en cualquier carpeta, p. ej. `ionic`). |
| `npm run build` | Ejecuta el script `build` que está definido en `package.json`. |
| `npx comando` | Ejecuta un programa que está dentro de `node_modules` sin instalarlo globalmente (p. ej. `npx cap sync`). |

### 2.3 `package.json`, `package-lock.json` y `node_modules`

**`package.json`** es la "ficha" del proyecto. El de tu Corporate App (resumido):

```json
{
  "name": "corporateApp",
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  },
  "dependencies": {
    "@angular/core": "22.1.7",
    "@ionic/angular": "^9.0.0",
    "@capacitor/core": "^8.5.2"
  },
  "devDependencies": {
    "@angular/cli": "22.1.8",
    "typescript": "~6.0.0"
  },
  "engines": { "node": "24.x" }
}
```

| Parte | Qué significa |
|---|---|
| `"name"` | Nombre del proyecto. |
| `"scripts"` | Atajos. `npm run build` ejecuta `ng build`. |
| `"dependencies"` | Librerías que la app **necesita para funcionar** (acaban dentro de la app final). Ej.: Angular, Ionic. |
| `"devDependencies"` | Librerías que solo se usan **mientras programas o compilas** (no van en la app final). Ej.: el compilador de TypeScript, la CLI de Angular. |
| `"engines"` | Qué versión de Node necesita el proyecto. Lo añadimos para que Vercel use Node 24. |
| `^9.0.0` | "Cualquier 9.x.x, desde la 9.0.0". |
| `~6.0.0` | "Cualquier 6.0.x" (más estricto). |
| `22.1.7` | Exactamente esa versión. |

- **`node_modules/`**: la carpeta donde npm mete las librerías descargadas. Pesa cientos de MB.
  **Nunca se sube a GitHub** (está en `.gitignore`) porque se regenera con `npm install`.
- **`package-lock.json`**: apunta la versión **exacta** que se instaló de cada librería, para que
  en otro ordenador (o en Vercel) se instale lo mismo. No se toca a mano.

> Error típico que ya te pasó: lanzar `npm install` en una carpeta **sin** `package.json`.
> Siempre hay que estar **dentro** de la carpeta del proyecto (`corporateApp`).

### 2.4 La terminal (PowerShell)

| Comando | Qué hace |
|---|---|
| `cd carpeta` | Entrar en una carpeta. Si el nombre tiene espacios: `cd "C:\DAM 2\Desarrollo de Interfaces"`. |
| `cd ..` | Subir una carpeta. |
| `ls` (o `dir`) | Ver qué hay en la carpeta actual. |
| `Ctrl + C` | Parar el programa que está corriendo (por ejemplo `ionic serve`). |
| Flecha ↑ | Repetir comandos anteriores. |

En VS Code la terminal se abre con **Ctrl + ñ** y se abre en la carpeta que tengas abierta.

### 2.5 Ionic CLI y Angular CLI

Una **CLI** (*Command Line Interface*) es un programa que se usa escribiendo comandos.

| Comando | Qué hace |
|---|---|
| `ionic start nombre blank --type=angular` | Crea un proyecto nuevo con la plantilla vacía. |
| `ionic serve` | Compila y arranca un **servidor de desarrollo** en `http://localhost:8100`. |
| `ionic generate page pages/home` | Crea una página (carpeta con `.ts`, `.html`, `.scss`). |
| `ionic generate service services/products` | Crea un servicio. |
| `ionic generate component components/galeria` | Crea un componente. |
| `ionic build` | Compila la app para producción (carpeta `www/`). |
| `ionic info` | Muestra las versiones de todo. |

- **`localhost:8100`**: `localhost` significa "este mismo ordenador"; `8100` es el **puerto**
  (como el número de puerta por el que entra el navegador). La app solo la ves tú.
- **Live reload**: mientras `ionic serve` está corriendo, cada vez que guardas un fichero
  (**Ctrl + S**) la página del navegador se recarga sola con los cambios.

---

## 3. JavaScript y TypeScript: lo mínimo para leer el código

Tú sabes Java, así que vas a ver que se parece mucho. Te pongo cada cosa con su equivalente en Java.

### 3.1 Variables

```ts
let edad = 20;          // variable que puede cambiar     (Java: int edad = 20;)
const nombre = 'Ana';   // constante, no se puede reasignar (Java: final String nombre = "Ana";)
let precio: number = 9.99;   // TypeScript: con tipo explícito
```

- En TypeScript el tipo va **después** del nombre, con dos puntos: `nombre: tipo`.
- Tipos básicos: `number` (todos los números, enteros y decimales), `string` (texto),
  `boolean` (`true`/`false`), `any` (cualquier cosa: evitarlo).
- Los textos pueden ir con `'comillas simples'`, `"dobles"` o `` `backticks` ``. Los backticks
  permiten meter variables dentro: `` `Hola ${nombre}` `` → `Hola Ana`.

### 3.2 Arrays y objetos

```ts
const numeros: number[] = [1, 2, 3];        // array de números  (Java: int[] / List<Integer>)

const producto = {                           // objeto "literal": pares clave: valor
  id: 1,
  nombre: 'Portátil Dell',
  precio: 1200
};
console.log(producto.nombre);                // 'Portátil Dell'
```

En JavaScript **no hace falta una clase** para crear un objeto: se escribe directamente entre
llaves `{ }`. Esto es muy distinto de Java.

### 3.3 JSON

**JSON** (*JavaScript Object Notation*) es un formato de **texto** para guardar o enviar datos.
Es casi igual que un objeto JavaScript, pero las claves van **siempre entre comillas dobles**:

```json
[
  { "id": 1, "nombre": "Portátil Dell", "precio": 1200 },
  { "id": 2, "nombre": "Monitor LG", "precio": 299 }
]
```

- `[ ]` = una lista (array). `{ }` = un objeto.
- `JSON.parse(texto)` convierte texto JSON → objeto. `JSON.stringify(objeto)` hace lo contrario.

### 3.4 Funciones y funciones flecha

```ts
// Función normal
function sumar(a: number, b: number): number {
  return a + b;
}

// Función flecha (arrow function): lo mismo, más corto
const sumar2 = (a: number, b: number): number => a + b;

// Con un solo parámetro se pueden quitar los paréntesis
const doble = x => x * 2;
```

La flecha `=>` se lee "devuelve". Es como las **lambdas** de Java (`(a, b) -> a + b`).
Las vas a ver muchísimo: `.then(respuesta => respuesta.json())`, `.filter(u => u.active)`…

### 3.5 Métodos de arrays más usados

```ts
const usuarios = [
  { name: 'Ana', active: true },
  { name: 'Luis', active: false }
];

usuarios.filter(u => u.active);     // [{ name: 'Ana', active: true }]  → se queda con los que cumplen
usuarios.map(u => u.name);          // ['Ana', 'Luis']                   → transforma cada elemento
usuarios.length;                    // 2
```

Igual que los Streams de Java (`filter`, `map`).

### 3.6 Clases

```ts
export class Persona {
  nombre: string;                       // propiedad (atributo)
  private edad = 0;                     // privada, con valor inicial

  constructor(nombre: string) {         // constructor (en Java se llamaría igual que la clase)
    this.nombre = nombre;
  }

  saludar(): string {                   // método
    return `Hola, soy ${this.nombre}`;
  }
}
```

Atajo muy usado en Angular: poner `private` (o `public`) **en el parámetro del constructor**
crea la propiedad automáticamente:

```ts
constructor(private servicio: ProductsService) {}
// equivale a:
// private servicio: ProductsService;
// constructor(servicio: ProductsService) { this.servicio = servicio; }
```

### 3.7 Interfaces

```ts
export interface Product {
  id: number;
  nombre: string;
  precio: number;
}
```

Una **interface** en TypeScript describe **la forma** que debe tener un objeto (qué campos y de
qué tipo). No tiene código ni se puede instanciar con `new`. Sirve para que el editor te avise si
te equivocas: si escribes `producto.nombr`, sale en rojo.

> Diferencia con Java: en Java una interface define **métodos** que una clase implementa. En
> TypeScript se usa sobre todo para definir **la forma de los datos** (como un "molde").

### 3.8 `import` / `export`

Cada fichero `.ts` es un **módulo**. Lo que quieras usar desde otro fichero tiene que llevar
`export`, y el otro fichero lo trae con `import`:

```ts
// models/product.interface.ts
export interface Product { ... }

// services/products.service.ts
import { Product } from '../models/product.interface';
```

- `'../'` = subir una carpeta. `'./'` = la carpeta actual.
- Si la ruta **no** empieza por `.` (`'@angular/core'`), viene de `node_modules` (una librería).
- No se pone la extensión `.ts`.

### 3.9 Decoradores `@`

```ts
@Component({ ... })
export class HomePage { }
```

Un **decorador** es una etiqueta que se pone encima de una clase para darle un "superpoder" o
información extra. Como las anotaciones de Java (`@Override`, `@Test`). En Angular los
principales son `@Component` (esto es un componente) e `@Injectable` (esto es un servicio).

### 3.10 Asincronía: `Promise`, `async` y `await`

Algunas operaciones **tardan**: pedir datos a un servidor, leer un fichero, el GPS… JavaScript
no se queda bloqueado esperando: sigue ejecutando y "ya avisará" cuando llegue el resultado.

- Una **Promise** (promesa) es un objeto que representa "un valor que llegará más tarde".
  Puede acabar **bien** (*resolved*) o **mal** (*rejected*).
- `async` delante de una función → esa función devuelve siempre una `Promise`.
- `await` delante de una promesa → "espera aquí a que llegue el resultado" (solo se puede usar
  dentro de una función `async`).

```ts
async function cargar() {
  const respuesta = await fetch('assets/data/products.json');  // espera la respuesta
  const datos = await respuesta.json();                         // espera a convertirla
  return datos;
}
```

`Promise<Product[]>` como tipo significa "una promesa que, cuando termine, dará un array de
`Product`".

---

## 4. Práctica: paradigmas asíncronos de JavaScript (`paradigmas-js`)

📁 `01-Introduccion-Ionic/paradigmas-js/` — `index.html` + `codigo.js`

**Objetivo:** pedir la lista de usuarios a una API pública
(`https://jsonplaceholder.typicode.com/users`) de **tres formas distintas** y ver que hacen lo
mismo. Para verlo: abrir `index.html` en el navegador → **F12** → pestaña **Console**.

### `index.html`

```html
<!DOCTYPE html>                       <!-- "esto es HTML5" -->
<html lang="es">                      <!-- empieza la página; idioma español -->
<head>                                <!-- cabecera: info que no se ve -->
    <meta charset="UTF-8">            <!-- codificación: para que salgan bien tildes y ñ -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">  <!-- se adapta al móvil -->
    <title>Paradigmas de JavaScript</title>   <!-- texto de la pestaña -->
</head>
<body>                                <!-- lo que se ve -->
    <h2>Paradigmas de JavaScript</h2> <!-- título de nivel 2 -->
    <p>Abre la consola ... </p>       <!-- párrafo -->
    <script src="codigo.js"></script> <!-- carga y ejecuta el fichero JavaScript -->
</body>
</html>
```

### Caso 1 — `fetch` con `.then()`

```js
function casoFetch() {
  console.log("--- CASO 1: fetch con .then() ---");     // escribe en la consola (como System.out.println)
  fetch("https://jsonplaceholder.typicode.com/users")    // 1) pide la URL → devuelve una Promise
    .then((respuesta) => respuesta.json())               // 2) cuando llegue: convierte el cuerpo a JSON (otra Promise)
    .then((datos) => console.log("[fetch .then] JSON recibido:", datos))  // 3) cuando esté: lo muestra
    .catch((error) => console.error("[fetch .then] Error:", error));     // si algo falla en cualquier paso
}
```

- `fetch(url)` es la función del navegador para hacer peticiones HTTP.
- `.then(función)` = "cuando la promesa termine bien, ejecuta esta función con el resultado".
- Encadenar `.then().then()` = hacer pasos uno detrás de otro.
- `.catch(función)` = "si falla, ejecuta esto".

### Caso 2 — `async/await`

```js
async function casoAsyncAwait() {
  try {
    const respuesta = await fetch("https://jsonplaceholder.typicode.com/users");
    const datos = await respuesta.json();
    console.log("[async/await] JSON recibido:", datos);
  } catch (error) {
    console.error("[async/await] Error:", error);
  }
}
```

Hace **exactamente lo mismo** que el caso 1, pero se lee como código normal de arriba abajo.
`try/catch` funciona igual que en Java. **Esta es la forma que usamos en Angular.**

### Caso 3 — callback clásico con `XMLHttpRequest`

```js
function casoCallback() {
  const xhr = new XMLHttpRequest();                    // objeto antiguo para peticiones HTTP
  xhr.open("GET", "https://jsonplaceholder...", true); // prepara: método GET, URL, true = asíncrono
  xhr.onreadystatechange = function () {               // CALLBACK: función que el navegador llamará él solo
    if (xhr.readyState === 4 && xhr.status === 200) {  // 4 = terminado, 200 = OK
      const datos = JSON.parse(xhr.responseText);      // el texto recibido → objeto
      console.log("[callback clásico] JSON recibido:", datos);
    }
  };
  xhr.send();                                          // ahora sí, envía la petición
}
```

- Un **callback** es una función que le pasas a otro para que **él la llame cuando toque**.
- `===` compara valor **y** tipo (en JavaScript siempre se usa `===`, no `==`).
- Así se hacía antes de que existieran las promesas. Si encadenas muchas peticiones así, las
  funciones quedan unas dentro de otras ("callback hell"); por eso aparecieron `.then()` y
  después `async/await`.

### Al final

```js
casoFetch();
casoAsyncAwait();
casoCallback();
```

Se lanzan los tres seguidos. **Pregunta de examen:** ¿en qué orden salen los resultados en la
consola? **No se sabe**: depende de cuál responda antes el servidor. Los tres `console.log` de
"--- CASO ---" sí salen primero y en orden, porque esos no esperan nada.

---

## 5. Angular: las piezas

### 5.1 Componente

Un **componente** es un trozo de interfaz reutilizable con su propia lógica. Una página entera es
un componente; un botón especial o una galería también pueden serlo. Tiene **3 ficheros**:

| Fichero | Contenido | Equivale a |
|---|---|---|
| `nombre.page.ts` (o `.component.ts`) | La clase TypeScript: datos y funciones. | El "cerebro". |
| `nombre.page.html` | La **plantilla**: qué se ve. | El "esqueleto". |
| `nombre.page.scss` | Los estilos **solo de este componente**. | La "ropa". |

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',                 // nombre de la etiqueta HTML: <app-home></app-home>
  templateUrl: './home.page.html',      // dónde está su HTML
  styleUrls: ['./home.page.scss'],      // dónde están sus estilos
  imports: [IonHeader, IonTitle],       // qué cosas usa su HTML (componentes standalone)
})
export class HomePage {
  titulo = 'Corporate App';             // un dato que puede usar el HTML
}
```

> **"Page" o "component"?** Para Angular son lo mismo. Ionic llama *page* a los componentes que
> son una pantalla completa (con su ruta) y *component* a los trozos que van dentro de una página.

### 5.2 Standalone

Antes, en Angular, cada componente tenía que declararse en un fichero aparte llamado **módulo**
(`NgModule`). Desde Angular 17 lo normal es **standalone**: cada componente es independiente y
declara él mismo en `imports: [...]` todo lo que usa en su HTML.

**Regla práctica:** si en el HTML usas `<ion-button>`, en el `.ts` tienes que importar
`IonButton` (de `'@ionic/angular'`) y ponerlo en `imports`. Si se te olvida, sale un error del
tipo *"'ion-button' is not a known element"*.

### 5.3 Data binding: cómo se conecta el `.ts` con el `.html`

Es **lo más importante de Angular**. Hay 4 formas, y se distinguen por los símbolos:

| Sintaxis | Nombre | Dirección | Ejemplo |
|---|---|---|---|
| `{{ dato }}` | **Interpolación** | `.ts` → `.html` (texto) | `<h1>{{ titulo }}</h1>` |
| `[propiedad]="dato"` | **Property binding** | `.ts` → `.html` (atributo) | `<img [src]="product.foto">` |
| `(evento)="funcion()"` | **Event binding** | `.html` → `.ts` | `<ion-button (click)="enviar()">` |
| `[(ngModel)]="dato"` | **Two-way binding** | en los dos sentidos | `<ion-input [(ngModel)]="correo">` |

- **Interpolación** `{{ }}`: escribe el valor como texto. Dentro puedes poner expresiones
  sencillas: `{{ product.precio * 2 }}`, `{{ nombre.toUpperCase() }}`.
- **Property binding** `[ ]`: rellena un atributo con el valor de una variable.
  - `src="product.foto"` (sin corchetes) → pondría literalmente el texto `"product.foto"`. ❌
  - `[src]="product.foto"` (con corchetes) → pone el valor de la variable: `assets/images/dell.jpg`. ✅
- **Event binding** `( )`: cuando pasa algo (clic, escribir…), llama a una función del `.ts`.
- **Two-way** `[( )]` (se llama "banana in a box" 🍌📦): lo que escribe el usuario actualiza la
  variable, y si la variable cambia, cambia el campo. Necesita importar `FormsModule`.

### 5.4 Directivas de control: repetir y condicionar

**Sintaxis clásica** (la que usa tu profe en los PDF):

```html
<li *ngFor="let user of users">{{ user.name }}</li>   <!-- repite el <li> por cada usuario -->
<p *ngIf="loading">Cargando...</p>                      <!-- solo se muestra si loading es true -->
```

- `*ngFor="let x of lista"` = un bucle *for-each* (Java: `for (User user : users)`).
  Hay que importar `NgFor` (o `CommonModule`).
- `*ngIf="condicion"` = un `if`. Hay que importar `NgIf` (o `CommonModule`).

**Sintaxis nueva** (Angular 17+), hace lo mismo sin importar nada:

```html
@for (user of users; track user.id) {
  <li>{{ user.name }}</li>
}
@if (loading) {
  <p>Cargando...</p>
} @else {
  <p>Listo</p>
}
```

`track user.id` le dice a Angular qué identifica a cada elemento, para redibujar solo lo que cambia.

### 5.5 Pipes `|`

Transforman un valor **solo para mostrarlo**:

```html
{{ precio | currency:'EUR' }}       <!-- €1,200.00  (formato inglés, el que viene por defecto) -->
{{ fecha | date:'short' }}          <!-- 10/2/26, 9:31 AM -->
{{ nombre | uppercase }}            <!-- ANA -->
```

Los pipes como `currency` y `date` vienen de `@angular/common` y hay que importarlos en el
componente (`CurrencyPipe`, `DatePipe`…). Para que salgan en formato español (`1.200,00 €`) hay
que configurar el idioma de la app; de momento en tu práctica el precio se pone a mano:
`{{ product.precio }} €`.

### 5.6 Signals (y por qué los usamos)

Angular tiene que saber **cuándo** ha cambiado un dato para volver a pintar la pantalla
(*detección de cambios*). Antes lo hacía con una librería llamada **zone.js** que vigilaba todo.
**Angular 22 ya no la usa** (*zoneless*). Consecuencia:

```ts
products: Product[] = [];
async ngOnInit() {
  this.products = await this.servicio.getProducts();   // ❌ Angular no se entera: la tabla sale vacía
}
```

La solución son los **signals** (señales): una "caja" que avisa a Angular cuando cambia su contenido.

```ts
import { signal } from '@angular/core';

products = signal<Product[]>([]);            // crear: caja con un array vacío dentro

this.products.set(nuevosDatos);              // escribir: cambia el contenido Y avisa a Angular
this.products();                             // leer: se llama como una función
```

En el HTML también se lee con paréntesis: `*ngFor="let product of products()"`.

> Este fue el bug de `usersApp`: la pantalla se quedaba en "Cargando..." para siempre porque
> `loading = false` se cambiaba después de un `await` y Angular no repintaba. Con
> `loading = signal(false)` y `.set(...)` se arregló.

### 5.7 Ciclo de vida: `ngOnInit`

Angular llama a ciertos métodos del componente en momentos concretos. El más usado:

```ts
export class ProductosPage implements OnInit {   // "implements OnInit" = prometo tener ngOnInit
  ngOnInit() {
    // se ejecuta UNA vez, cuando el componente ya está creado
    // → es el sitio para cargar datos
  }
}
```

¿Por qué no cargar los datos en el constructor? Por convenio: el constructor solo debe
**recibir** cosas (dependencias); el trabajo de verdad va en `ngOnInit`.

### 5.8 Rutas (routing)

Las **rutas** dicen qué componente se muestra según la URL:

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },     // localhost:8100/ → /home
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
];
```

- `path`: la parte de la URL después de la barra (`/home`).
- `redirectTo`: redirige a otra ruta. `pathMatch: 'full'`: solo si la URL es **exactamente** esa (vacía).
- `loadComponent: () => import(...)`: **lazy loading** (carga perezosa): el código de esa
  página no se descarga hasta que el usuario entra en ella. La app arranca más rápido.
  - `import('./pages/home/home.page')` carga el fichero (devuelve una promesa).
  - `.then(m => m.HomePage)` de ese fichero (`m`, de "módulo") coge la clase `HomePage`.
- `<router-outlet>` (o `<ion-router-outlet>` en Ionic) es el **hueco** del HTML donde se pinta
  la página que toque según la ruta.
- `routerLink="/productos"` en un botón o enlace = navegar a esa ruta al pulsarlo.

### 5.9 Servicios e inyección de dependencias (DI)

Un **servicio** es una clase que **no se ve**: se encarga de la lógica y los datos (pedir
productos, guardar mensajes, usar el GPS…). Las páginas lo usan.

```ts
@Injectable({ providedIn: 'root' })     // "esto es un servicio, y hay UNO para toda la app"
export class ProductsService {
  async getProducts(): Promise<Product[]> { ... }
}
```

**Inyección de dependencias** = la página **no crea** el servicio con `new`; lo **pide**, y
Angular se lo da:

```ts
constructor(private productService: ProductsService) {}   // "necesito un ProductsService"
// o, forma moderna:
private productService = inject(ProductsService);
```

Analogía: en un restaurante el camarero (página) no fabrica la cocina (servicio); simplemente
la cocina existe y el restaurante (Angular) se la "asigna". Ventajas:

1. **Una sola instancia** compartida por toda la app (*singleton*) gracias a `providedIn: 'root'`.
2. **Bajo acoplamiento**: si cambias de dónde salen los datos (JSON → servidor real), solo tocas
   el servicio; las páginas ni se enteran.
3. **Fácil de probar**: en un test se puede dar un servicio "falso".

Palabras clave para el profe: **dependencia** (lo que se necesita), **proveedor/provider** (la
receta para crearla: `providedIn: 'root'`), **inyector** (el que la guarda y la reparte),
**inversión de control** (crear objetos deja de ser cosa del componente).

### 5.10 `main.ts`: el arranque

```ts
bootstrapApplication(AppComponent, {    // "arranca la app empezando por AppComponent"
  providers: [ ... ]                    // configuración global: rutas, Ionic, etc.
});
```

Orden de arranque: `index.html` (tiene `<app-root>`) → `main.ts` → `AppComponent` (tiene el
`router-outlet`) → la ruta decide qué página va dentro.

---

## 6. Práctica 1: el componente galería (data binding)

Esta tarea (21-09) la hiciste en un proyecto aparte (`myApp`), que **no está en este
repositorio**. Lo que se pedía y lo que significa:

| Punto de la tarea | Qué es |
|---|---|
| Versiones de Node, Ionic CLI, Angular CLI | `node -v`, `ionic -v`, `ng version`: comprobar el entorno. |
| `package.json`: dependencies vs devDependencies | Ver [2.3](#23-packagejson-package-lockjson-y-node_modules). |
| `ionic serve` y live reload | Ver [2.5](#25-ionic-cli-y-angular-cli). |
| Imagen en `src/assets` | `assets` es la carpeta de ficheros estáticos (imágenes, JSON) que se copian tal cual a la app final. Se referencian como `assets/foto1.png`. |
| Componente `galeria` con interpolación y `[src]` | Un componente que muestra un título con `{{ }}` y una imagen con `[src]`. |

Así sería un componente galería equivalente (para que entiendas la idea):

```bash
ionic generate component components/galeria
```

```ts
// galeria.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-galeria',               // se usará como <app-galeria></app-galeria>
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
})
export class GaleriaComponent {
  titulo = 'Mi galería';                  // dato para la interpolación
  imagen = 'assets/foto1.png';            // dato para el property binding
  descripcion = 'Foto guardada en src/assets';
}
```

```html
<!-- galeria.component.html -->
<h2>{{ titulo }}</h2>                     <!-- interpolación: escribe "Mi galería" -->
<img [src]="imagen" [alt]="descripcion" width="300">   <!-- property binding -->
<p>{{ descripcion }}</p>
```

Y para que aparezca en una página, en su `.ts` se importa `GaleriaComponent` (en `imports`) y en
su `.html` se escribe `<app-galeria></app-galeria>`.

---

## 7. Práctica: `usersApp` línea a línea

📁 `01-Introduccion-Ionic/usersApp/` — proyecto **Angular puro** (todavía sin componentes de
Ionic). Muestra los usuarios **activos** de una lista.

Es el mismo esquema que la Corporate App, en pequeño: **modelo → servicio → página → HTML**.

### `src/app/models/user.model.ts`

```ts
export interface User {   // molde de un usuario; export para usarlo en otros ficheros
  id: number;             // identificador numérico
  name: string;           // nombre
  email: string;          // correo
  active: boolean;        // ¿está activo? true / false
}
```

### `src/app/services/users.service.ts`

```ts
import { Injectable } from '@angular/core';      // el decorador para servicios
import { User } from '../models/user.model';     // el molde (subimos de services/ a app/ y entramos en models/)

@Injectable({
  providedIn: 'root'                             // una instancia para toda la app
})
export class UsersService {
  private users: User[] = [                      // array de User, privado: solo lo usa el servicio
    { id: 1, name: 'Ana', email: 'ana@test.com', active: true },
    { id: 2, name: 'Luis', email: 'luis@test.com', active: false },
    { id: 3, name: 'Carlos', email: 'carlos@test.com', active: true }
  ];

  async getUsers(): Promise<User[]> {            // devuelve "una promesa de array de User"
    return new Promise(resolve => {              // creamos una promesa a mano...
      setTimeout(() => resolve(this.users), 500);// ...que se cumple a los 500 ms con la lista
    });                                          // (simula lo que tardaría un servidor real)
  }

  async getActiveUsers(): Promise<User[]> {
    const users = await this.getUsers();         // espera la lista completa
    return users.filter(u => u.active);          // devuelve solo los que tienen active = true
  }
}
```

- `new Promise(resolve => ...)`: forma de crear una promesa. `resolve(valor)` = "ya está, el
  resultado es este".
- `setTimeout(funcion, 500)`: ejecuta la función dentro de 500 milisegundos.

### `src/app/pages/users/users.page.ts`

```ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';                // trae *ngIf y *ngFor
import { UsersService } from '../../services/users.service';   // ../../ = sube dos carpetas (users/ y pages/)
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,                     // componente independiente (en Angular 22 ya es así por defecto)
  imports: [CommonModule],              // lo que usa el HTML
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {
  users = signal<User[]>([]);           // caja con la lista; empieza vacía
  loading = signal(false);              // caja con un boolean; empieza en false

  constructor(private usersService: UsersService) {}   // INYECCIÓN DE DEPENDENCIAS

  async ngOnInit() {                    // al crearse la página...
    await this.loadUsers();             // ...carga los usuarios
  }

  async loadUsers() {
    try {
      this.loading.set(true);                                   // muestra "Cargando..."
      const data = await this.usersService.getActiveUsers();    // pide los activos y espera
      this.users.set(data);                                     // guarda → Angular repinta
    } catch (error) {
      console.error('Error:', error);                           // si falla, lo muestra en consola
    } finally {
      this.loading.set(false);                                  // pase lo que pase, quita "Cargando..."
    }
  }
}
```

`finally` se ejecuta siempre, haya error o no (igual que en Java).

### `src/app/pages/users/users.page.html`

```html
<h1>Usuarios activos</h1>

<p *ngIf="loading()">Cargando...</p>                  <!-- solo si loading vale true -->

<ul *ngIf="!loading()">                                <!-- ! = NOT: solo si NO está cargando -->
  <li *ngFor="let user of users()">                    <!-- un <li> por cada usuario -->
    <strong>{{ user.name }}</strong> — {{ user.email }} <!-- interpolación -->
  </li>
</ul>
```

Resultado: "Ana — ana@test.com" y "Carlos — carlos@test.com" (Luis no, porque no está activo).

### `src/app/app.routes.ts`

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },        // / → /users
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.page').then(m => m.UsersPage)
  }
];
```

### `src/app/app.ts` y `app.html` (el componente raíz)

```ts
@Component({
  imports: [RouterOutlet],          // necesita el hueco de rutas
  selector: 'app-root',             // <app-root> está en index.html
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('usersApp');   // protected: solo la clase y su HTML; readonly: no se reasigna
}
```

```html
<h2>usersApp</h2>
<router-outlet />          <!-- aquí se pinta la página de la ruta actual (UsersPage) -->
```

### `src/main.ts` y `app.config.ts`

```ts
bootstrapApplication(App, appConfig)          // arranca la app con el componente App y esta configuración
  .catch((err) => console.error(err));        // si falla el arranque, muéstralo
```

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),     // captura errores globales
    provideRouter(routes)                     // activa las rutas de app.routes.ts
  ]
};
```

---

## 8. Práctica 2: `corporateApp` línea a línea

📁 `02-CorporateApp/corporateApp/` — App de una empresa con Home (menú), Productos (tabla desde
JSON), Nosotros y Contacto (vacías por ahora). Publicada en
<https://desarrollo-interfaces-dam-2.vercel.app>.

### 8.1 El viaje de los datos

```
products.json ──fetch──▶ ProductsService ──(inyección)──▶ ProductosPage ──signal──▶ productos.page.html
  (datos)                (los va a buscar)                (los guarda)              (los pinta)
```

### 8.2 Estructura

```
corporateApp/
├── package.json            ficha del proyecto (ver 2.3)
├── angular.json            configuración de Angular: dónde compila (www/), qué estilos carga...
├── capacitor.config.ts     configuración de Capacitor (nombre de la app, carpeta www)
├── ionic.config.json       configuración de Ionic CLI
├── vercel.json             regla para Vercel (ver 8.12)
└── src/
    ├── index.html          la única página HTML real; contiene <app-root>
    ├── main.ts             arranque
    ├── global.scss         estilos para toda la app (importa los CSS de Ionic)
    ├── theme/variables.scss colores del tema
    ├── assets/             ficheros estáticos: data/products.json, images/*.jpg
    └── app/
        ├── app.component.ts / .html   componente raíz
        ├── app.routes.ts              rutas
        ├── models/product.interface.ts
        ├── services/products.service.ts
        └── pages/home, productos, nosotros, contacto
```

### 8.3 `src/main.ts`

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
  ],
});
```

| Línea | Qué hace |
|---|---|
| `bootstrapApplication(AppComponent, {...})` | Arranca la app desde `AppComponent`. |
| `providers: [...]` | Configura el **inyector raíz** (lo que Angular puede "dar" a quien lo pida). |
| `{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }` | DI: "cuando el router pida una `RouteReuseStrategy`, dale la de Ionic". Hace que la navegación tenga animaciones y pila de páginas tipo móvil. |
| `provideIonicAngular()` | Activa Ionic. |
| `provideRouter(routes, ...)` | Activa las rutas. `withPreloading(PreloadAllModules)`: cuando la app ya ha cargado, descarga en segundo plano el resto de páginas para que luego vayan rápido. `withComponentInputBinding()`: permite pasar datos de la URL a la página (no lo usamos todavía). |

### 8.4 `src/app/app.component.ts` y `.html`

```ts
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
```

```html
<ion-app>                         <!-- contenedor raíz obligatorio de Ionic -->
  <ion-router-outlet></ion-router-outlet>   <!-- hueco donde va la página de la ruta -->
</ion-app>
```

### 8.5 `src/app/app.routes.ts`

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage) },
  { path: 'productos', loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage) },
  { path: 'nosotros',  loadComponent: () => import('./pages/nosotros/nosotros.page').then((m) => m.NosotrosPage) },
  { path: 'contacto',  loadComponent: () => import('./pages/contacto/contacto.page').then((m) => m.ContactoPage) },
];
```

`Routes` es un array de objetos; cada objeto es una ruta. Todo lo demás está explicado en [5.8](#58-rutas-routing).
Si al compilar ves en la terminal "Lazy chunk files: home-page, productos-page…", esos son los
trozos separados que genera el lazy loading.

### 8.6 Home: `home.page.ts`

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';            // para usar routerLink en el HTML
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
} from '@ionic/angular';                                   // cada etiqueta <ion-...> que usa el HTML

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [RouterLink, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel],
})
export class HomePage {
  constructor() {}                // no necesita nada: solo muestra el menú
}
```

### 8.7 Home: `home.page.html`

```html
<ion-header>                         <!-- cabecera fija arriba -->
  <ion-toolbar>                      <!-- la barra de la cabecera -->
    <ion-title>Corporate App</ion-title>   <!-- título de la barra -->
  </ion-toolbar>
</ion-header>

<ion-content>                        <!-- zona con scroll: el contenido de la página -->
  <ion-segment>                      <!-- barra de botones horizontal (el "menú") -->
    <ion-segment-button value="productos" routerLink="/productos">   <!-- value: id del botón; routerLink: a dónde va -->
      <ion-label>Productos</ion-label>                              <!-- texto del botón -->
    </ion-segment-button>
    <ion-segment-button value="nosotros" routerLink="/nosotros">
      <ion-label>Nosotros</ion-label>
    </ion-segment-button>
    <ion-segment-button value="contacto" routerLink="/contacto">
      <ion-label>Contacto</ion-label>
    </ion-segment-button>
  </ion-segment>
</ion-content>
```

Estructura **típica de cualquier página Ionic**: `ion-header > ion-toolbar > ion-title` arriba y
`ion-content` con el contenido.

### 8.8 El modelo: `models/product.interface.ts`

```ts
export interface Product {
  id: number;
  nombre: string;
  vendedor: string;     // ← añadido en la ampliación de la entrega
  unidades: number;
  precio: number;
  foto: string;         // ruta de la imagen, p. ej. "assets/images/dell.jpg"
}
```

### 8.9 Los datos: `assets/data/products.json`

```json
[
  { "id": 1, "nombre": "Portátil Dell", "vendedor": "Ana García", "unidades": 12, "precio": 1200, "foto": "assets/images/dell.jpg" },
  { "id": 2, "nombre": "Monitor LG", "vendedor": "Luis Martín", "unidades": 8, "precio": 299, "foto": "assets/images/lg.jpg" },
  { "id": 3, "nombre": "Teclado Logitech", "vendedor": "Carlos Pérez", "unidades": 25, "precio": 89, "foto": "assets/images/logitech.jpg" }
]
```

Es una **base de datos falsa** ("datos fake"). Como está en `assets`, al compilar se copia tal cual
y se puede pedir por URL: `localhost:8100/assets/data/products.json` (pruébalo en el navegador).

### 8.10 El servicio: `services/products.service.ts`

```ts
import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',                                      // servicio único para toda la app
})
export class ProductsService {

  async getProducts(): Promise<Product[]> {                // devolverá (más tarde) un array de Product
    const response = await fetch('assets/data/products.json');   // pide el fichero y espera
    const products = await response.json();                // convierte el texto JSON en array de objetos
    return products;                                       // lo devuelve a quien lo pidió
  }

}
```

### 8.11 La página Productos

**`productos.page.ts`**

```ts
import { Component, OnInit, signal } from '@angular/core';
import { NgFor } from '@angular/common';                    // para *ngFor
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol,
} from '@ionic/angular';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../models/product.interface';

@Component({
  standalone: true,
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [NgFor, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonGrid, IonRow, IonCol],
})
export class ProductosPage implements OnInit {
  products = signal<Product[]>([]);                         // caja con la lista, empieza vacía

  constructor(private productService: ProductsService) {}  // DI: Angular nos da el servicio

  async ngOnInit() {                                        // al crearse la página:
    this.products.set(await this.productService.getProducts());   // pide productos, espera, guarda
  }
}
```

La línea de `ngOnInit` hace 3 cosas a la vez; desglosada sería:

```ts
const lista = await this.productService.getProducts();   // 1) pedir y esperar
this.products.set(lista);                                 // 2) guardar en el signal → 3) Angular repinta
```

**`productos.page.html`**

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">                           <!-- grupo de botones a la izquierda (slot="start") -->
      <ion-back-button defaultHref="/home"></ion-back-button>   <!-- flecha atrás; si no hay historial, va a /home -->
    </ion-buttons>
    <ion-title>Productos</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-grid>                                             <!-- rejilla (tabla) de Ionic -->
    <ion-row class="header">                             <!-- fila de cabecera; class para darle estilo -->
      <ion-col size="1">ID</ion-col>                     <!-- columna que ocupa 1 de 12 partes -->
      <ion-col size="2.5">Nombre</ion-col>
      <ion-col size="2.5">Vendedor</ion-col>
      <ion-col size="1.5">Uds.</ion-col>
      <ion-col size="2">Precio</ion-col>
      <ion-col size="2.5">Foto</ion-col>
    </ion-row>

    <ion-row *ngFor="let product of products()">         <!-- una fila por producto -->
      <ion-col size="1">{{ product.id }}</ion-col>
      <ion-col size="2.5">{{ product.nombre }}</ion-col>
      <ion-col size="2.5">{{ product.vendedor }}</ion-col>
      <ion-col size="1.5">{{ product.unidades }}</ion-col>
      <ion-col size="2">{{ product.precio }} €</ion-col>
      <ion-col size="2.5">
        <img [src]="product.foto" width="60" />          <!-- property binding a la ruta de la foto -->
      </ion-col>
    </ion-row>
  </ion-grid>
</ion-content>
```

- El **grid de Ionic divide el ancho en 12 partes**. `size="2.5"` = 2,5 de 12. Si sumas todas:
  1 + 2,5 + 2,5 + 1,5 + 2 + 2,5 = **12**. Sin `size`, todas las columnas serían iguales.

**`productos.page.scss`**

```scss
ion-row {                         /* a todas las filas: */
  align-items: center;            /*   centrar verticalmente el contenido */
  border-bottom: 1px solid #ddd;  /*   línea gris debajo */
}
.header {                         /* a lo que tenga class="header": */
  font-weight: bold;              /*   negrita */
}
ion-col {
  overflow-wrap: anywhere;        /* si una palabra no cabe, se parte */
}
.header ion-col {                 /* columnas dentro de la cabecera: */
  font-size: 0.85rem;             /*   letra un poco más pequeña */
  overflow-wrap: normal;          /*   no partir "Vendedor" a la mitad */
}
```

En CSS: `etiqueta { }` aplica a esas etiquetas; `.clase { }` a lo que tenga ese `class`;
`.a b { }` a los `b` que están **dentro** de `.a`.

### 8.12 Ficheros para el despliegue

**`vercel.json`**

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

La app es una **SPA** (*Single Page Application*): en realidad solo existe `index.html`, y es
Angular quien cambia el contenido según la URL. Si alguien entra directamente a
`.../productos`, Vercel buscaría un fichero llamado `productos` y daría **404**. Esta regla dice:
"para **cualquier** URL (`/(.*)`), sirve `index.html`", y Angular ya se encarga del resto.

**`"engines": { "node": "24.x" }`** en `package.json`: Angular 22 necesita un Node moderno; así
Vercel usa Node 24.

**`capacitor.config.ts`**

```ts
const config: CapacitorConfig = {
  appId: 'io.ionic.corporateapp',   // identificador único de la app Android (como un paquete Java)
  appName: 'corporateApp',          // nombre que se verá en el móvil
  webDir: 'www'                     // carpeta donde está la app compilada que se meterá en el móvil
};
```

### 8.13 Nosotros y Contacto

De momento solo tienen la cabecera con el botón atrás. En los puntos 10–16 del PDF del profe se
completan: Nosotros con **geolocalización** (GPS con `@capacitor/geolocation` y la fórmula de
Haversine para calcular la distancia a la oficina) y Contacto con un **formulario**
(`[(ngModel)]`) que guarda los mensajes con `@capacitor/preferences`.

---

## 9. Cómo harías la Corporate App tú solo, desde cero

Este es el **orden de trabajo** que tienes que interiorizar. Sirve para casi cualquier app:

```powershell
# 1. Crear el proyecto y entrar
ionic start corporateApp blank --type=angular --standalone
cd corporateApp

# 2. Generar las páginas
ionic generate page pages/home --standalone
ionic generate page pages/productos --standalone
ionic generate page pages/nosotros --standalone
ionic generate page pages/contacto --standalone

# 3. Generar el servicio
ionic generate service services/products

# 4. Arrancar (y dejarlo corriendo mientras programas)
ionic serve
```

Después, a mano, **en este orden** (de lo que no depende de nada a lo que depende de todo):

| Paso | Fichero | Qué escribes |
|---|---|---|
| 5 | `app.routes.ts` | Una ruta por página + la redirección de `''` a `home`. Borra la carpeta `home` que trae la plantilla si la duplicaste. |
| 6 | `home.page.html` + `.ts` | El `ion-segment` con 3 botones y `routerLink`. Importar `RouterLink` y los `Ion...` en el `.ts`. |
| 7 | `models/product.interface.ts` | La interface con los campos. |
| 8 | `assets/data/products.json` + `assets/images/` | Los datos y las fotos. |
| 9 | `products.service.ts` | `getProducts()` con `fetch` + `await`. |
| 10 | `productos.page.ts` | `signal`, constructor con el servicio, `ngOnInit` que llama al servicio. |
| 11 | `productos.page.html` | `ion-grid` con la fila cabecera y la fila con `*ngFor`. Importar `NgFor`, `IonGrid`, `IonRow`, `IonCol`. |
| 12 | Probar en el navegador | Si sale en blanco: **F12 → Console** y leer el error. |

**Errores típicos y qué significan:**

| Error | Causa | Solución |
|---|---|---|
| `'ion-grid' is not a known element` | No importaste `IonGrid` en el `.ts`. | Añadirlo al `import` y a `imports: [...]`. |
| `Can't bind to 'ngForOf'` | Usas `*ngFor` sin importar `NgFor`. | Importar `NgFor` (o usar `@for`). |
| La tabla sale vacía sin errores | Asignas una propiedad normal después de `await`. | Usar `signal` y `.set()`. |
| `404 assets/data/products.json` | La ruta o el nombre del fichero están mal. | Revisar que esté en `src/assets/data/`. |
| `Cannot find module '../models/...'` | Ruta del `import` mal (número de `../`). | Contar las carpetas que hay que subir. |

---

## 10. Git, GitHub y Vercel

### 10.1 Conceptos

| Palabra | Qué es |
|---|---|
| **Git** | Programa en tu PC que guarda el **historial** de una carpeta. |
| **Repositorio (repo)** | Una carpeta controlada por Git (tiene una carpeta oculta `.git` con el historial). |
| **Commit** | Una "foto" del proyecto en un momento, con un mensaje. |
| **Rama (branch)** | Una línea de trabajo paralela. La principal es `main`. |
| **GitHub** | Web que guarda una copia de tu repositorio en internet. |
| **remote / origin** | La dirección del repo en GitHub. `origin` es el nombre por defecto. |
| **push** | Subir tus commits a GitHub. |
| **pull** | Bajar de GitHub los commits que no tienes. |
| **`.gitignore`** | Lista de cosas que Git debe ignorar (`node_modules`, `www`…). |
| **Vercel** | Web que coge tu repo de GitHub, ejecuta el build y publica la app con una URL. |

### 10.2 Tu organización (desde hoy)

Cada asignatura es **un repositorio distinto**, en tu cuenta **JorgeGonzalezDI**:

| Carpeta en tu PC | Repositorio |
|---|---|
| `C:\DAM 2\Desarrollo de Interfaces` | `Desarrollo-Interfaces-DAM-2` (el que tiene tu profe) |
| `C:\DAM 2\Acceso a Datos` | `Acceso-Datos-DAM-2` |
| `C:\DAM 2\Programacion de Servicios y Procesos` | `Programacion-Servicios-Procesos-DAM-2` |
| `C:\DAM 2\Unity` | `Unity-DAM-2` |

`C:\DAM 2` **no** es un repositorio: los comandos de git se lanzan siempre **dentro** de la
carpeta de la asignatura.

### 10.3 El flujo de cada día

```powershell
cd "C:\DAM 2\Desarrollo de Interfaces"
git status                       # ¿qué he cambiado? (rojo = sin preparar, verde = preparado)
git add .                        # preparar TODOS los cambios (el punto = "todo")
git commit -m "Mensaje claro"    # hacer la foto con un mensaje
git push                         # subir a GitHub
```

Otros útiles: `git log --oneline` (ver el historial), `git pull` (bajar cambios),
`git branch` (ver ramas), `git checkout nombre` (cambiar de rama), `git merge rama` (traer los
cambios de otra rama a la actual).

### 10.4 Vercel

Configuración de tu proyecto (ya hecho): repo `Desarrollo-Interfaces-DAM-2`, *Root Directory*
`02-CorporateApp/corporateApp` (dónde está el `package.json`), *Build Command* `npm run build`,
*Output Directory* `www`. Cada `git push` a `main` → Vercel vuelve a compilar y publicar solo.

---

## 11. Glosario

| Término | Significado corto |
|---|---|
| **Angular** | Framework de Google para hacer aplicaciones web con componentes. |
| **App híbrida** | App hecha con tecnología web que funciona en navegador y móvil. |
| **assets** | Carpeta de ficheros estáticos (imágenes, JSON) que se copian tal cual. |
| **async / await** | Forma de escribir código asíncrono como si fuera secuencial. |
| **Binding** | Conexión entre datos del `.ts` y el `.html`. |
| **Build** | Compilar el proyecto para producción (genera `www/`). |
| **Callback** | Función que pasas a otro para que la llame más tarde. |
| **Capacitor** | Herramienta para convertir la web en app nativa y acceder al hardware. |
| **CLI** | Programa que se usa con comandos de texto (`ionic`, `ng`, `git`). |
| **Componente** | Trozo de interfaz con su `.ts`, `.html` y `.scss`. |
| **Decorador** | Etiqueta con `@` que da información extra a una clase (`@Component`). |
| **Dependencia** | Librería que necesita el proyecto, o servicio que necesita un componente. |
| **Deploy / despliegue** | Publicar la app en internet. |
| **DI (inyección de dependencias)** | Angular entrega a cada componente los servicios que pide. |
| **fetch** | Función del navegador para hacer peticiones HTTP. Devuelve una Promise. |
| **Framework** | Esqueleto con reglas para construir aplicaciones. |
| **Interface (TS)** | Molde que define la forma de un objeto. |
| **Interpolación** | `{{ dato }}`: escribir un valor en el HTML. |
| **JSON** | Formato de texto para datos: `{ "clave": valor }`. |
| **Lazy loading** | Cargar el código de una página solo cuando se visita. |
| **Live reload** | Recarga automática del navegador al guardar. |
| **ngOnInit** | Método que Angular ejecuta al crear el componente. |
| **node_modules** | Carpeta con las librerías descargadas por npm. No se sube a GitHub. |
| **npm** | Gestor de paquetes de Node. |
| **Pipe** | `{{ valor | formato }}`: transforma un valor para mostrarlo. |
| **Promise** | Objeto que representa un resultado que llegará más tarde. |
| **Property binding** | `[atributo]="dato"`: rellenar un atributo con una variable. |
| **Ruta** | Asociación entre una URL (`/productos`) y una página. |
| **Selector** | Nombre de etiqueta de un componente (`app-home`). |
| **Servicio** | Clase con lógica/datos que usan los componentes. `@Injectable`. |
| **Signal** | Caja de valor que avisa a Angular cuando cambia. `.set()` / `()`. |
| **Singleton** | Que solo existe una instancia. |
| **SPA** | Aplicación de una sola página HTML cuyo contenido cambia con JavaScript. |
| **Standalone** | Componente que declara él mismo lo que usa (sin NgModule). |
| **TypeScript** | JavaScript con tipos. |
| **Two-way binding** | `[(ngModel)]`: el campo y la variable se actualizan mutuamente. |
| **Zoneless** | Angular sin zone.js; por eso usamos signals. |

---

## 12. Ejercicios para practicar (con soluciones)

Hazlos sobre la Corporate App, con `ionic serve` corriendo. Si rompes algo, `git checkout .`
deshace todos los cambios no guardados en un commit.

**Ejercicio 1 (fácil).** Añade un 4º producto al JSON (por ejemplo, un ratón). Usa una foto que ya
exista. ¿Qué ficheros has tenido que tocar?

**Ejercicio 2 (fácil).** En la Home, cambia el título "Corporate App" por el nombre de tu empresa
inventada, pero sacándolo de una variable del `.ts` con interpolación.

**Ejercicio 3 (medio).** Añade el campo `categoria` (texto) a los productos y muéstralo como una
columna más del grid. Ajusta los `size` para que sigan sumando 12.

**Ejercicio 4 (medio).** Debajo de la tabla, muestra el texto "Total de unidades: X", calculado
a partir de la lista.

**Ejercicio 5 (medio).** Muestra el precio en rojo si quedan menos de 10 unidades.

**Ejercicio 6 (más difícil).** Crea una página nueva `ofertas` con su ruta y un 4º botón en el
menú de la Home que lleve a ella.

<details>
<summary><b>Soluciones</b> (intenta primero sin mirar)</summary>

**1.** Solo `products.json`: añadir un objeto más (con coma después del anterior):

```json
{ "id": 4, "nombre": "Ratón Razer", "vendedor": "Ana García", "unidades": 30, "precio": 59, "foto": "assets/images/dell.jpg" }
```

El servicio, la página y el HTML no cambian: es la ventaja de separar datos, servicio y vista.

**2.** `home.page.ts`: dentro de la clase, `nombreEmpresa = 'Jorge Tech';`.
`home.page.html`: `<ion-title>{{ nombreEmpresa }}</ion-title>`.

**3.** `product.interface.ts`: `categoria: string;`. `products.json`: `"categoria": "Portátiles"` en
cada producto. `productos.page.html`: `<ion-col size="...">Categoría</ion-col>` en la cabecera y
`<ion-col size="...">{{ product.categoria }}</ion-col>` en la fila. Por ejemplo:
ID 1, Nombre 2, Vendedor 2, Categoría 2, Uds. 1, Precio 2, Foto 2 = 12.

**4.** En `productos.page.ts`:

```ts
import { computed } from '@angular/core';
totalUnidades = computed(() => this.products().reduce((suma, p) => suma + p.unidades, 0));
```

`computed` crea un signal que se recalcula solo cuando cambia `products`. `reduce` recorre el
array acumulando: empieza en 0 y a cada producto le suma sus unidades.
En el HTML, después de `</ion-grid>`: `<p>Total de unidades: {{ totalUnidades() }}</p>`.

**5.** En la columna del precio, *style binding*:

```html
<ion-col size="2" [style.color]="product.unidades < 10 ? 'red' : null">{{ product.precio }} €</ion-col>
```

`condición ? valorSiSí : valorSiNo` es el operador ternario (igual que en Java).

**6.**
```powershell
ionic generate page pages/ofertas --standalone
```
`app.routes.ts`:
```ts
{ path: 'ofertas', loadComponent: () => import('./pages/ofertas/ofertas.page').then((m) => m.OfertasPage) },
```
`home.page.html`, dentro de `ion-segment`:
```html
<ion-segment-button value="ofertas" routerLink="/ofertas">
  <ion-label>Ofertas</ion-label>
</ion-segment-button>
```
</details>

---

## 13. Chuleta para mañana en clase

Si el profe pregunta, esto es lo que tienes que saber decir **con tus palabras**:

1. **¿Qué es Ionic / Angular / Capacitor?** Ionic = componentes visuales de móvil; Angular = el
   framework que organiza la app en componentes, rutas y servicios; Capacitor = convierte la web
   en app nativa y da acceso al hardware.
2. **¿Qué es un componente standalone?** Un componente que declara él mismo en `imports` lo que
   usa, sin necesidad de un `NgModule`.
3. **¿Qué es el lazy loading?** Cargar cada página solo cuando se visita, con `loadComponent`
   e `import()` dinámico.
4. **¿Cómo llegan los productos a la pantalla?** JSON en `assets` → `ProductsService` lo lee con
   `fetch` → `ProductosPage` recibe el servicio por inyección de dependencias y en `ngOnInit`
   guarda los productos en un signal → el HTML los recorre con `*ngFor` y los muestra con
   interpolación y `[src]`.
5. **¿Qué es la inyección de dependencias?** Que la página no crea el servicio con `new`, sino
   que lo pide en el constructor (o con `inject()`) y Angular se lo da. Con `providedIn: 'root'`
   hay una sola instancia para toda la app.
6. **¿Por qué usas `signal` y no `products: any[]` como en el PDF?** Porque Angular 22 no usa
   zone.js y no se enteraría de un cambio hecho después de un `await`; el signal le avisa.
7. **Diferencia entre `{{ }}`, `[ ]`, `( )` y `[( )]`.** Interpolación, property binding,
   event binding y two-way binding (ver [5.3](#53-data-binding-cómo-se-conecta-el-ts-con-el-html)).
8. **dependencies vs devDependencies.** Las primeras van en la app final; las segundas solo se
   usan para desarrollar/compilar.
9. **¿Qué hace `vercel.json`?** Redirige todas las URLs a `index.html` porque es una SPA.
10. **¿Por qué no se sube `node_modules`?** Porque pesa mucho y se regenera con `npm install`
    a partir de `package.json` y `package-lock.json`.

**Siguiente en la práctica (lo que probablemente toque mañana):** punto 10 del PDF,
geolocalización en la página Nosotros (`npm install @capacitor/geolocation`, un
`GeolocationService` y la fórmula de Haversine).
