# Desarrollo de Interfaces — Guía de estudio desde cero

> Para leer en VS Code con la vista previa: abre este fichero y pulsa **Ctrl + Shift + V**.
> Tiempo estimado: 2–3 horas leyendo con calma y abriendo el código a la vez.
> Si algo no lo entiendes, sigue leyendo: casi todo se aclara con el ejemplo siguiente.

## Índice

1. [El mapa: de qué va la asignatura](#1-el-mapa-de-qué-va-la-asignatura) — **incluye qué es un framework y qué problema resuelve Angular**
2. [Las herramientas: Node, npm, Ionic CLI, la terminal](#2-las-herramientas-node-npm-ionic-cli-la-terminal)
3. [JavaScript y TypeScript: lo mínimo para leer el código](#3-javascript-y-typescript-lo-mínimo-para-leer-el-código)
4. [Práctica: paradigmas asíncronos de JavaScript (`paradigmas-js`)](#4-práctica-paradigmas-asíncronos-de-javascript-paradigmas-js)
5. [Angular: las piezas](#5-angular-las-piezas) — **data binding explicado desde cero en 5.3**
6. [Práctica 1: el componente galería (data binding)](#6-práctica-1-el-componente-galería-data-binding)
7. [Práctica: `usersApp` línea a línea](#7-práctica-usersapp-línea-a-línea)
8. [Práctica 2: `corporateApp` línea a línea](#8-práctica-2-corporateapp-línea-a-línea)
9. [Cómo harías la Corporate App tú solo, desde cero](#9-cómo-harías-la-corporate-app-tú-solo-desde-cero)
10. [Git, GitHub y Vercel](#10-git-github-y-vercel)
11. [Glosario](#11-glosario)
12. [Ejercicios para practicar (con soluciones)](#12-ejercicios-para-practicar-con-soluciones)
13. [Chuleta para mañana en clase](#13-chuleta-para-mañana-en-clase)

**Parte 2 — Consumo de APIs REST** (clase del 05-10-2026)

14. [¿Qué es una API y qué es REST?](#14-qué-es-una-api-y-qué-es-rest)
15. [Promise vs Observable (`HttpClient` y RxJS)](#15-promise-vs-observable-httpclient-y-rxjs) — **por qué con APIs no se usa `async/await`**
16. [Actividad guiada: `dam2-productos` (dummyjson) línea a línea](#16-actividad-guiada-dam2-productos-dummyjson-línea-a-línea)
17. [El ejemplo del dossier: directorio de usuarios con `async` pipe](#17-el-ejemplo-del-dossier-directorio-de-usuarios-con-async-pipe)
18. [Ejercicio propuesto: Maestro-Detalle con Rick and Morty](#18-ejercicio-propuesto-maestro-detalle-con-la-api-de-rick-and-morty)
19. [Preguntas de repaso de la Parte 2](#19-preguntas-de-repaso-de-la-parte-2)

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

### 1.1 ¿Qué es un framework? (y en qué se diferencia de una librería)

Esta es la pregunta clave para entender Angular, así que vamos despacio.

**Librería** = una **caja de herramientas**. Tú escribes tu programa como quieras y, cuando
necesitas algo, **tú llamas** a la herramienta.

```java
// Java: usas la librería Math cuando TÚ quieres
double r = Math.sqrt(16);
```

Tú tienes el control: decides qué se ejecuta, cuándo y en qué orden. La librería solo hace lo que
le pides, cuando se lo pides.

**Framework** = un **esqueleto de programa que ya funciona**, con unas reglas, y **tú rellenas los
huecos**. Aquí el control es al revés: **el framework llama a tu código** cuando a él le toca. A
esto se le llama **inversión de control**, y se resume en una frase famosa:
*"no nos llames, ya te llamaremos nosotros"*.

**El mejor ejemplo lo conoces ya: Unity.**

```csharp
public class Jugador : MonoBehaviour {
    void Start()  { /* se ejecuta al aparecer el objeto */ }
    void Update() { /* se ejecuta en cada frame */ }
}
```

Tú **nunca** escribes `jugador.Update()` en ningún sitio. Escribes el método y **Unity decide
cuándo llamarlo** (60 veces por segundo). Tampoco escribes el bucle del juego, ni el código que
pinta en pantalla, ni el que lee el teclado: eso ya lo hace Unity. Tú solo rellenas lo que es
propio de tu juego. **Unity es un framework.**

**Angular es exactamente igual, pero para aplicaciones web:**

| | Unity | Angular |
|---|---|---|
| Tú escribes… | Scripts (clases C#) | Componentes (clases TypeScript + HTML) |
| El framework llama a… | `Start()`, `Update()` | `constructor`, `ngOnInit()`… |
| El framework se encarga de… | Bucle del juego, pintar, físicas, input | Pintar la página, actualizarla cuando cambian los datos, navegar entre pantallas |
| Reglas que te impone | Heredar de `MonoBehaviour`, carpeta `Assets`… | `@Component`, carpetas, ficheros `.ts`/`.html`/`.scss`… |

Otra analogía: una **librería** es ir a Leroy Merlin a comprar ladrillos y herramientas; construyes
la casa como quieras. Un **framework** es una casa prefabricada con la estructura, la luz y el agua
ya puestas: tú decides la distribución y la decoración, pero **respetando su estructura**.

| Ejemplos | Librería | Framework |
|---|---|---|
| Java | `java.util`, Gson, JDBC | Spring, JavaFX |
| JavaScript | RxJS, Capacitor | **Angular**, React* |
| Juegos | — | **Unity** |

\*React técnicamente se llama a sí mismo "librería", pero eso da igual ahora.

> **Para clase:** *"Un framework es una estructura base que impone una forma de organizar el
> código y que llama a nuestro código cuando corresponde (inversión de control). Una librería es
> un conjunto de funciones que nosotros llamamos cuando queremos."*

### 1.2 ¿Qué problema resuelve Angular? (cómo sería SIN Angular)

Imagina que quieres mostrar la lista de productos en una web **solo con HTML y JavaScript**, sin
Angular. Tendrías que hacer **a mano** todo esto:

```html
<!-- index.html -->
<ul id="lista"></ul>
<p>Total: <span id="total"></span></p>
<button id="boton">Añadir producto</button>
```

```js
// codigo.js — SIN Angular
let productos = ['Portátil', 'Monitor'];

function pintar() {
  const ul = document.getElementById('lista');    // 1. buscar el elemento en la página
  ul.innerHTML = '';                              // 2. borrar lo que había
  for (const p of productos) {                    // 3. crear un <li> por producto
    const li = document.createElement('li');
    li.textContent = p;
    ul.appendChild(li);
  }
  document.getElementById('total').textContent = productos.length;   // 4. actualizar el total
}

document.getElementById('boton').addEventListener('click', () => {  // 5. escuchar el clic
  productos.push('Teclado');
  pintar();                                       // 6. ¡acordarte de volver a pintar!
});

pintar();
```

Funciona, pero fíjate en el problema: **cada vez que cambian los datos, tienes que buscar los
elementos de la página y cambiarlos tú a mano**, y si se te olvida llamar a `pintar()`, la
pantalla muestra datos viejos. Con 4 pantallas, formularios y datos que llegan de internet, esto
se vuelve inmanejable.

**Lo mismo CON Angular:**

```ts
// lista.page.ts
export class ListaPage {
  productos = signal(['Portátil', 'Monitor']);
  anadir() { this.productos.update(lista => [...lista, 'Teclado']); }   // lista nueva = lo que había + 'Teclado'
}
```

```html
<!-- lista.page.html -->
<ul>
  @for (p of productos(); track p) { <li>{{ p }}</li> }
</ul>
<p>Total: {{ productos().length }}</p>
<button (click)="anadir()">Añadir producto</button>
```

Ya no hay `getElementById`, ni `createElement`, ni `pintar()`. **Tú solo describes cómo tiene que
verse la página en función de tus datos**, y Angular se encarga de que la pantalla **siempre**
coincida con los datos. Cambias el dato → Angular actualiza la pantalla solo.

Esa es la idea más importante de toda la asignatura:

> **En Angular, la pantalla es un reflejo de tus datos.** Tú cambias los datos (en el `.ts`) y
> Angular cambia la pantalla (el `.html`). Nunca tocas la pantalla a mano.

A esto se le llama programación **declarativa** (dices *qué* quieres ver) frente a
**imperativa** (dices *paso a paso cómo* cambiarlo, como en el ejemplo sin Angular).

### 1.3 Qué te da Angular "de serie"

| Pieza | Para qué | Sección |
|---|---|---|
| **Componentes** | Dividir la app en trozos (páginas, menús, tarjetas…) | 5.1 |
| **Data binding** | Conectar los datos del `.ts` con lo que se ve en el `.html` | 5.3 |
| **Directivas** (`@for`, `@if`…) | Repetir y mostrar/ocultar trozos de HTML | 5.4 |
| **Router** | Navegar entre pantallas según la URL | 5.8 |
| **Servicios + inyección de dependencias** | Lógica y datos compartidos entre pantallas | 5.9 |
| **HttpClient** | Pedir datos a un servidor (API) | 15 |
| **CLI** (`ng`, `ionic generate`…) | Crear proyectos y ficheros con comandos | 2.5 |


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

> Antes de esta sección lee la [1.1 y 1.2](#11-qué-es-un-framework-y-en-qué-se-diferencia-de-una-librería):
> si no tienes claro qué es un framework, esto no va a encajar.

### 5.0 La idea central en un dibujo

Todo lo de Angular gira alrededor de esto:

```
      productos.page.ts                          productos.page.html
   (los DATOS y la LÓGICA)                       (lo que SE VE)
 ┌───────────────────────────┐   data binding   ┌────────────────────────────┐
 │ titulo = 'Productos'      │ ───────────────▶ │ <h1>{{ titulo }}</h1>      │
 │ foto = 'assets/dell.jpg'  │ ───────────────▶ │ <img [src]="foto">         │
 │ comprar() { ... }         │ ◀─────────────── │ <button (click)="comprar()"│
 │ cantidad = 1              │ ◀──────────────▶ │ <input [(ngModel)]="cantidad">
 └───────────────────────────┘                  └────────────────────────────┘
            ▲
            │ Angular vigila los datos: si cambian, repinta el HTML solo
```

- A la izquierda, una **clase normal de TypeScript** con variables y métodos (como una clase Java).
- A la derecha, **HTML normal** con unos símbolos especiales (`{{ }}`, `[ ]`, `( )`).
- Esos símbolos son el **data binding**: los "cables" que conectan las variables de la izquierda con
  la pantalla de la derecha. Angular es quien mantiene esos cables funcionando.

### 5.1 Componente

Un **componente** es **un trozo de pantalla con su propia lógica**. Puede ser una página entera
(Productos) o un trozo pequeño (una tarjeta de producto, un menú, una galería).

**Analogía Unity:** un componente es como un **prefab** con su script: tiene su aspecto (el HTML,
como el modelo 3D) y su comportamiento (el `.ts`, como el script C#). Y igual que en Unity metes
prefabs dentro de otros, en Angular metes componentes dentro de otros: la app entera es un
**árbol de componentes**.

```
AppComponent                (raíz: siempre está)
└── <ion-router-outlet>     (hueco donde va la página actual)
    └── ProductosPage       (la página de la ruta /productos)
        ├── <ion-header>    (componente de Ionic)
        └── <ion-grid>      (componente de Ionic)
```

Cada componente son **3 ficheros** con el mismo nombre:

| Fichero | Qué contiene | Analogía |
|---|---|---|
| `productos.page.ts` | La **clase**: datos (variables) y comportamiento (métodos). | El script / el cerebro |
| `productos.page.html` | La **plantilla** (*template*): qué se dibuja. | El aspecto / el cuerpo |
| `productos.page.scss` | Los **estilos**: colores, tamaños… Solo afectan a este componente. | La ropa |

El `.ts` es lo que "convierte" una clase normal en un componente, gracias al decorador `@Component`:

```ts
import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular';

@Component({                               // "Angular: esta clase es un componente"
  selector: 'app-home',                    // 1
  templateUrl: './home.page.html',         // 2
  styleUrls: ['./home.page.scss'],         // 3
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],   // 4
})
export class HomePage {                    // 5
  titulo = 'Corporate App';                // 6
}
```

1. **`selector`**: el nombre de **etiqueta HTML** que tendrá este componente. Si en otro HTML
   escribes `<app-home></app-home>`, ahí se dibuja este componente. (Las páginas casi nunca se usan
   así porque las pone el router, pero el selector tiene que existir).
2. **`templateUrl`**: dónde está su HTML.
3. **`styleUrls`**: dónde están sus estilos (es una lista `[ ]` porque podrían ser varios).
4. **`imports`**: qué **otros componentes** usa su HTML (ver 5.2).
5. **`export class HomePage`**: una clase normal. `export` para que otros ficheros (las rutas)
   puedan usarla.
6. **`titulo = 'Corporate App'`**: una **propiedad** (variable de la clase). Todo lo que pongas
   aquí lo puede usar el HTML.

**Qué pasa cuando abres `/home`:** Angular ve en las rutas que `/home` es `HomePage` → crea un
objeto `new HomePage()` (tú nunca escribes ese `new`; lo hace Angular, inversión de control) → lee
su HTML → sustituye los `{{ }}` y demás por los valores reales → lo pinta en el hueco del
`router-outlet`.

> **"Page" o "component"?** Para Angular son lo mismo. Ionic llama *page* a los componentes que
> son una pantalla completa (con ruta) y *component* a los trozos que van dentro de una página.

### 5.2 Standalone

**Antes** (Angular hasta la versión 14 más o menos), los componentes no se podían usar solos:
había que registrarlos en un fichero central llamado **módulo** (`app.module.ts`, con
`@NgModule`), algo así como una "lista de inscritos". Era lioso: para usar un botón en una página
había que importarlo en el módulo, no en la página.

**Ahora** cada componente es **standalone** (*independiente*): **declara él mismo** en su
`imports: [...]` todo lo que usa en su HTML. No hay módulos.

**Regla práctica (la que más errores te va a quitar):**

> Cada etiqueta especial que escribas en el HTML tiene que estar en el `imports` del `.ts`.

| Si en el `.html` usas… | En el `.ts` necesitas importar… | Desde |
|---|---|---|
| `<ion-button>` | `IonButton` | `'@ionic/angular'` |
| `<ion-grid>`, `<ion-row>`, `<ion-col>` | `IonGrid`, `IonRow`, `IonCol` | `'@ionic/angular'` |
| `routerLink="..."` | `RouterLink` | `'@angular/router'` |
| `*ngFor` / `*ngIf` | `NgFor` / `NgIf` (o `CommonModule`) | `'@angular/common'` |
| `[(ngModel)]` | `FormsModule` | `'@angular/forms'` |
| `\| currency` | `CurrencyPipe` | `'@angular/common'` |
| `@for` / `@if` | **nada** (vienen de serie) | — |

Si te olvidas, sale un error del tipo *"'ion-button' is not a known element"* o
*"Can't bind to 'ngForOf'"*. Fíjate que el nombre siempre es el de la etiqueta en
**PascalCase**: `ion-card-title` → `IonCardTitle`.

Para importarlo se hace en **dos sitios** del mismo fichero:

```ts
import { IonButton } from '@ionic/angular';   // ① arriba: traer la clase al fichero (TypeScript)

@Component({
  imports: [IonButton],                        // ② en el decorador: decirle a Angular que el HTML la usa
})
```

### 5.3 Data binding: cómo se conecta el `.ts` con el `.html`

#### El problema

El `.ts` y el `.html` son **dos ficheros distintos**. Si en el `.ts` tienes `titulo = 'Productos'`,
¿cómo sabe el HTML que tiene que escribir "Productos"? Y si en el HTML hay un botón, ¿cómo llama a
un método del `.ts`?

**Data binding** (en español, "enlace de datos") es la respuesta: unos **símbolos especiales** que
pones en el HTML para conectarlo con la clase. "Binding" = atadura, enlace, cable.

Hay **4 tipos**, y se distinguen **solo por los símbolos**:

```
 {{ dato }}           interpolación       .ts ──▶ .html   (escribir un texto)
 [atributo]="dato"    property binding    .ts ──▶ .html   (rellenar un atributo)
 (evento)="metodo()"  event binding       .ts ◀── .html   (avisar de que ha pasado algo)
 [(ngModel)]="dato"   two-way binding     .ts ◀─▶ .html   (las dos cosas a la vez)
```

Vamos a verlos todos con **el mismo ejemplo**, una mini tienda:

```ts
// tienda.page.ts
export class TiendaPage {
  producto = 'Portátil Dell';
  precio = 1200;
  foto = 'assets/images/dell.jpg';
  agotado = false;
  cantidad = 1;

  comprar() {
    console.log('Has comprado ' + this.cantidad + ' ' + this.producto);
  }
}
```

#### 1) Interpolación: `{{ }}`

**Qué hace:** escribe el valor de una variable **como texto** dentro del HTML.

```html
<h1>{{ producto }}</h1>               <!-- se ve: Portátil Dell -->
<p>Precio: {{ precio }} €</p>         <!-- se ve: Precio: 1200 € -->
```

**Cómo leerlo:** "aquí dentro va el valor de `producto`". Las dobles llaves son como un hueco que
Angular rellena. Es el equivalente a hacer en Java:

```java
System.out.println("Precio: " + precio + " €");
```

**Dentro de `{{ }}` puedes poner expresiones sencillas**, no solo variables:

```html
<p>{{ precio * 2 }}</p>                      <!-- 2400 -->
<p>{{ producto.toUpperCase() }}</p>          <!-- PORTÁTIL DELL -->
<p>{{ agotado ? 'Agotado' : 'Disponible' }}</p>   <!-- Disponible (operador ternario, como en Java) -->
```

Lo que **no** puedes poner: sentencias como `if`, `for`, `let x = 3` o asignaciones (`precio = 5`).
Solo cosas que **den un valor**.

**Y si la variable cambia** (por ejemplo `this.precio = 999` desde un método), Angular vuelve a
escribir el texto solo. Eso es lo que no hacía el JavaScript sin framework.

#### 2) Property binding: `[atributo]="variable"`

Primero, ¿qué es un **atributo**? Las etiquetas HTML llevan **atributos**, que son ajustes con la
forma `nombre="valor"`:

```html
<img src="assets/images/dell.jpg" width="80">
<!--  ↑ atributo src     ↑ atributo width -->
<button disabled>Comprar</button>
<!--     ↑ atributo disabled (el botón no se puede pulsar) -->
```

**El problema:** si escribes una variable dentro de un atributo normal, HTML no sabe que es una
variable; la toma como **texto literal**:

```html
<img src="foto">           <!-- ❌ busca un fichero que se llama literalmente "foto" -->
```

**La solución:** poner el atributo **entre corchetes**. Los corchetes significan
*"lo que hay entre comillas NO es un texto: es código TypeScript, evalúalo"*:

```html
<img [src]="foto">         <!-- ✅ src = el VALOR de la variable foto = 'assets/images/dell.jpg' -->
```

Compara:

| Escribes | Angular entiende | Resultado |
|---|---|---|
| `src="foto"` | El texto `"foto"` | Imagen rota |
| `[src]="foto"` | El valor de la variable `foto` | `assets/images/dell.jpg` ✅ |
| `src="{{ foto }}"` | Interpolación dentro del atributo (también vale para textos) | `assets/images/dell.jpg` ✅ |

Más ejemplos con nuestra tienda:

```html
<button [disabled]="agotado">Comprar</button>
<!-- si agotado es true, el botón se desactiva; si cambia a false, se activa solo -->

<ion-button [color]="agotado ? 'medium' : 'success'">Comprar</ion-button>
<!-- botón gris si está agotado, verde si no -->

<p [style.color]="precio > 1000 ? 'red' : 'black'">{{ precio }} €</p>
<!-- texto rojo si es caro -->
```

**Truco para recordarlo:** los corchetes `[ ]` parecen una **caja donde METES** un valor:
el dato **entra** en el HTML.

#### 3) Event binding: `(evento)="metodo()"`

Hasta ahora los datos iban del `.ts` al `.html`. Ahora al revés: el usuario **hace algo** en la
pantalla (pulsar, escribir…) y queremos que se ejecute código del `.ts`.

```html
<ion-button (click)="comprar()">Comprar</ion-button>
```

**Cómo leerlo:** "cuando ocurra el evento `click` en este botón, ejecuta el método `comprar()` de
la clase". Los paréntesis rodean el **nombre del evento**.

Sin Angular habría que escribir
`document.getElementById('boton').addEventListener('click', comprar)`. En Java Swing sería un
`boton.addActionListener(e -> comprar())`. Es la misma idea, pero escrita directamente en el HTML.

Eventos habituales:

| Evento | Cuándo pasa |
|---|---|
| `(click)` | Al pulsar |
| `(input)` | Cada vez que se escribe una letra en un campo |
| `(change)` | Cuando cambia el valor y se sale del campo |
| `(submit)` | Al enviar un formulario |
| `(ionChange)` | Evento propio de componentes Ionic (selects, toggles…) |

Si necesitas los datos del evento (qué tecla, qué se ha escrito…), Angular te los da en la
variable especial **`$event`**: `(input)="buscar($event)"`.

**Truco para recordarlo:** los paréntesis `( )` son como unas **orejas que escuchan**: el HTML
**avisa** al código.

#### 4) Two-way binding: `[(ngModel)]="variable"`

Es la combinación de los dos anteriores: **`[ ]` + `( )` = `[( )]`**. Sirve para campos de
formulario donde el dato tiene que ir **en los dos sentidos**:

```html
<ion-input [(ngModel)]="cantidad" type="number"></ion-input>
<p>Vas a comprar {{ cantidad }} unidades</p>
```

Qué pasa:
- **`.ts → .html`**: al abrir la página, el campo muestra `1` (el valor inicial de `cantidad`).
- **`.html → .ts`**: el usuario escribe `3` → la variable `cantidad` pasa a valer `3` **sola**.
- Como `cantidad` ha cambiado, el `<p>` de debajo se actualiza a "Vas a comprar 3 unidades"
  **mientras escribes**.

Por dentro, `[(ngModel)]="cantidad"` es un atajo de:
`[ngModel]="cantidad" (ngModelChange)="cantidad = $event"` (meter el valor + escuchar cambios).

- Necesita importar **`FormsModule`** (de `'@angular/forms'`) en el componente.
- La forma `[( )]` se llama **"banana in a box"** 🍌📦: el plátano `( )` dentro de la caja `[ ]`.
  Si lo escribes al revés, `([ngModel])`, no funciona.

#### Resumen para memorizar

| Símbolo | Nombre | Dirección | Para qué | Ejemplo |
|---|---|---|---|---|
| `{{ }}` | Interpolación | `.ts → .html` | Escribir un texto | `{{ producto }}` |
| `[ ]` | Property binding | `.ts → .html` | Rellenar un atributo | `[src]="foto"` |
| `( )` | Event binding | `.html → .ts` | Reaccionar a algo del usuario | `(click)="comprar()"` |
| `[( )]` | Two-way binding | `.ts ↔ .html` | Campos de formulario | `[(ngModel)]="cantidad"` |

> Regla: **corchetes = entra un dato en el HTML. Paréntesis = sale un aviso del HTML.**

#### Practica leyendo tu propio código

En `02-CorporateApp/corporateApp/src/app/pages/productos/productos.page.html`, encuentra:
1. Una **interpolación** → `{{ product.nombre }}`, `{{ product.precio }} €`…
2. Un **property binding** → `<img [src]="product.foto">`
3. ¿Hay algún **event binding**? → No en esa página. En la actividad de dummyjson sí:
   `<ion-button (click)="loadProducts()">Reintentar</ion-button>`.

### 5.4 Directivas de control: repetir y condicionar

Las **directivas** son instrucciones en el HTML para **repetir** o **mostrar/ocultar** trozos.
Son el `for` y el `if` de la plantilla.

**Sintaxis nueva** (Angular 17+, la que recomienda tu profe; no hay que importar nada):

```html
@for (user of users; track user.id) {     <!-- for-each: un <li> por cada usuario -->
  <li>{{ user.name }}</li>
}

@if (loading) {                            <!-- if: solo se pinta si loading es true -->
  <p>Cargando...</p>
} @else {
  <p>Listo</p>
}
```

- `@for (user of users; ...)` = Java `for (User user : users)`. Dentro de las llaves, `user` es el
  elemento de esa vuelta.
- `track user.id` le dice a Angular qué identifica a cada elemento, para que, si cambia la lista,
  solo redibuje las filas que han cambiado. Es **obligatorio** en `@for`.
- Extra: `@for (...) { ... } @empty { <p>No hay nada</p> }` → lo que se muestra si la lista está vacía.

**Sintaxis clásica** (la verás en PDFs antiguos y en tu `usersApp`):

```html
<li *ngFor="let user of users">{{ user.name }}</li>
<p *ngIf="loading">Cargando...</p>
```

El `*` delante indica que la directiva **cambia la estructura** del HTML (añade o quita
elementos). Hay que importar `NgFor` / `NgIf` (o `CommonModule`). Hacen lo mismo que `@for`/`@if`.

### 5.5 Pipes `|`

Un **pipe** ("tubería") transforma un valor **solo para mostrarlo**, sin cambiar la variable:

```html
{{ precio | currency:'EUR' }}       <!-- €1,200.00  (formato inglés, el que viene por defecto) -->
{{ fecha | date:'short' }}          <!-- 10/2/26, 9:31 AM -->
{{ nombre | uppercase }}            <!-- ANA -->
```

Se lee "coge `precio` y pásalo por la tubería `currency`". Lo que va después de `:` son opciones.
Hay que importarlos en el componente (`CurrencyPipe`, `DatePipe`, `UpperCasePipe`… de
`'@angular/common'`). En tu Corporate App el precio se pone a mano: `{{ product.precio }} €`.

### 5.6 Signals (y por qué los usamos)

Volvamos a la idea central: **cuando cambian los datos, Angular repinta la pantalla**. Pero…
¿cómo se **entera** Angular de que un dato ha cambiado?

- **Antes** usaba una librería llamada **zone.js** que espiaba todo lo que pasaba en la página
  (clics, temporizadores, peticiones…) y, después de cada cosa, revisaba todas las variables por
  si alguna había cambiado. Funcionaba "por arte de magia", pero era lento.
- **Angular 22 ya no usa zone.js** (se llama *zoneless*). Ahora hay que **avisarle**. Si cambias
  una variable normal dentro de algo asíncrono (después de un `await` o dentro de un `subscribe`),
  **Angular no se entera** y la pantalla se queda como estaba.

```ts
products: Product[] = [];
async ngOnInit() {
  this.products = await this.servicio.getProducts();   // ❌ la variable cambia, la pantalla NO
}
```

Este fue exactamente el bug de `usersApp` ("Cargando..." para siempre).

La solución son los **signals** ("señales"). Un signal es una **caja que guarda un valor y que
avisa a Angular cada vez que cambia lo que hay dentro**:

```ts
import { signal } from '@angular/core';

products = signal<Product[]>([]);      // CREAR: caja de tipo Product[], empieza con [] dentro

this.products.set(nuevaLista);         // ESCRIBIR: cambia el contenido Y avisa a Angular → repinta
this.products();                       // LEER: se "abre la caja" llamándola como una función
```

En el HTML también se lee con paréntesis:

```html
@for (product of products(); track product.id) { ... }
<p>Hay {{ products().length }} productos</p>
```

**Analogía:** una variable normal es una pizarra donde cambias lo escrito sin que nadie se entere.
Un signal es un grupo de WhatsApp: cada vez que cambias algo, **les llega una notificación** a
todos los que estaban mirando.

> **Regla práctica para tu Angular 22:** todo dato que se muestre en el HTML y que cambie
> **después** de que la página se haya abierto (porque llega de un servicio, de una API, de un
> temporizador…) → **signal**.

### 5.7 Ciclo de vida: `ngOnInit`

Como Angular es un framework, **él** crea y destruye los componentes, y te avisa en ciertos
momentos llamando a métodos con nombres especiales (como `Start()` en Unity). El más usado:

```ts
export class ProductosPage implements OnInit {   // "implements OnInit" = prometo tener ngOnInit
  ngOnInit() {
    // Angular lo llama UNA vez, justo después de crear el componente
    // → es el sitio para cargar datos
  }
}
```

| Unity | Angular |
|---|---|
| `Awake()` | `constructor()` |
| `Start()` | `ngOnInit()` |
| `OnDestroy()` | `ngOnDestroy()` |

¿Por qué no cargar los datos en el constructor? Por convenio: el constructor solo **recibe** las
dependencias (servicios); el trabajo de verdad va en `ngOnInit`.

### 5.8 Rutas (routing)

Una app tiene **varias pantallas**, pero en realidad solo hay **un** `index.html` (es una SPA,
*Single Page Application*). El **router** de Angular decide **qué componente se pinta según la URL**:

```
localhost:8100/home        → HomePage
localhost:8100/productos   → ProductosPage
```

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },     // localhost:8100/ → /home
  { path: 'home', loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
];
```

- `path`: lo que va en la URL después de la barra.
- `redirectTo`: redirige a otra ruta. `pathMatch: 'full'`: solo si la URL es **exactamente** esa (vacía).
- `loadComponent: () => import(...)`: **lazy loading** (carga perezosa). El código de esa página no
  se descarga hasta que el usuario entra en ella, así la app arranca más rápido.
  - `() => ...` es una función flecha (sección 3.4) que Angular llamará **cuando haga falta**.
  - `import('./pages/home/home.page')` carga ese fichero (devuelve una Promise).
  - `.then(m => m.HomePage)` de ese fichero (`m`) coge la clase `HomePage`.
- `<router-outlet>` / `<ion-router-outlet>` es el **hueco** del HTML donde se pinta la página que
  toque. Está en el componente raíz.
- `routerLink="/productos"` en un botón = "al pulsarlo, navega a `/productos`".

### 5.9 Servicios e inyección de dependencias (DI)

Un **servicio** es una clase **que no se ve**: se encarga de la lógica y de conseguir los datos
(pedir productos, guardar mensajes, usar el GPS…). Las páginas lo usan.

**¿Por qué no poner el `fetch` directamente en la página?** Porque si tres páginas necesitan los
productos, tendrías el mismo código tres veces, y si cambia la URL tendrías que cambiarlo en tres
sitios. Con un servicio, está **en un único sitio**.

```ts
@Injectable({ providedIn: 'root' })     // "esto es un servicio, y hay UNO para toda la app"
export class ProductsService {
  async getProducts(): Promise<Product[]> { ... }
}
```

**Inyección de dependencias** = la página **no crea** el servicio con `new`; **lo pide**, y Angular
se lo da ya creado:

```ts
constructor(private productService: ProductsService) {}   // forma clásica
private productService = inject(ProductsService);          // forma moderna (hace lo mismo)
```

**Analogía:** en un restaurante, el camarero (la página) no construye su propia cocina (el
servicio). La cocina ya existe, y el restaurante (Angular) se la asigna. Todos los camareros usan
**la misma** cocina.

Ventajas:
1. **Una sola instancia** compartida por toda la app (*singleton*) gracias a `providedIn: 'root'`.
2. **Bajo acoplamiento**: si cambias de dónde salen los datos (JSON → API real), solo tocas el
   servicio; las páginas ni se enteran.
3. **Fácil de probar**: en un test se le puede dar a la página un servicio "falso".

Palabras clave para el profe: **dependencia** (lo que se necesita), **proveedor/provider** (la
receta para crearla: `providedIn: 'root'`), **inyector** (el que la guarda y la reparte),
**inversión de control** (crear objetos deja de ser cosa del componente; otra vez la idea del
framework de la sección 1.1).

### 5.10 `main.ts`: el arranque

```ts
bootstrapApplication(AppComponent, {    // "arranca la app empezando por AppComponent"
  providers: [ ... ]                    // configuración global: rutas, Ionic, HttpClient...
});
```

Orden de arranque: el navegador abre `index.html` (que tiene `<app-root>`) → se ejecuta `main.ts`
→ Angular crea `AppComponent` (el de selector `app-root`, que tiene el `router-outlet`) → el router
mira la URL y mete la página que toca dentro del hueco.

### 5.11 Todo junto: qué pasa al abrir `/productos` en tu Corporate App

1. El navegador carga `index.html` y `main.ts` arranca Angular.
2. El **router** ve la URL `/productos` → descarga `productos.page.ts` (lazy loading).
3. Angular necesita crear `ProductosPage`. Ve que el constructor pide un `ProductsService` →
   **inyección de dependencias**: se lo da.
4. Angular crea la página y llama a **`ngOnInit()`** (ciclo de vida).
5. `ngOnInit` pide los productos al **servicio**, que hace el `fetch` al JSON (**asíncrono**: tarda).
6. Mientras tanto, Angular ya pinta el HTML con `products()` vacío (tabla sin filas).
7. Llegan los datos → `this.products.set(lista)` → el **signal** avisa a Angular.
8. Angular repinta: el **`*ngFor`** crea una fila por producto, la **interpolación** escribe
   nombre, precio… y el **property binding** `[src]` pone cada foto.

Si entiendes estos 8 pasos, entiendes el 80 % de lo que hemos hecho.

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

---

# PARTE 2 — Consumo de APIs REST

> Material de clase del 05-10-2026: dossier **"Consumo de APIs en arquitecturas frontend con
> Ionic y Angular"** y **"Actividad guiada — Ionic + Angular Standalone: consumo de API REST"**.
>
> **Antes de esta parte** tienes que tener claro el [punto 3.10](#310-asincronía-promise-async-y-await)
> (Promise, `async/await`) y el [punto 4](#4-práctica-paradigmas-asíncronos-de-javascript-paradigmas-js).
> Aquí aparece una cosa nueva que se parece mucho: el **Observable**.

---

## 14. ¿Qué es una API y qué es REST?

### 14.1 API

**API** (*Application Programming Interface*) = un conjunto de reglas para que **dos programas
se hablen** sin que uno tenga que saber cómo está hecho el otro por dentro.

**Analogía del restaurante (otra vez):** tú (la app) no entras en la cocina (la base de datos).
Hablas con el **camarero** (la API): le pides algo de la carta (una petición), él va a cocina y te
trae el plato (la respuesta). No sabes ni te importa cómo se cocina.

```
 App Ionic (cliente)  ── petición ──▶  API (servidor)  ──▶  Base de datos
  "dame los productos"                  comprueba, busca     (MySQL, MongoDB...)
                      ◀── respuesta ──  devuelve JSON
```

- **Cliente** (*frontend*): lo que ve el usuario. Tu app Ionic.
- **Servidor** (*backend*): el programa que tiene los datos. Puede estar hecho en Node, Spring
  (Java), Django (Python)…
- Hasta ahora tus datos estaban en un JSON **dentro** de la app (`assets/data/products.json`).
  Ahora vienen de un **servidor de internet**.

### 14.2 Por qué se separa frontend y backend (lo que pide el dossier)

| Ventaja | Qué significa en cristiano |
|---|---|
| **Desacoplamiento** (*separation of concerns*) | El frontend y el backend se programan, se publican y se actualizan por separado. |
| **Reutilización omnicanal** | La misma API sirve a la web, a la app móvil y a otros programas. |
| **Escalabilidad** | Si hay mucha gente, se refuerza el servidor sin tocar la app. |
| **Seguridad** | Las contraseñas de la base de datos y la lógica importante se quedan en el servidor; la app solo ve lo que la API le deja ver (con tokens como **JWT** u **OAuth**). |

### 14.3 Tipos de API

| Tipo | Cómo es | Dónde se usa |
|---|---|---|
| **REST** | Usa HTTP normal: URLs + verbos (GET, POST…) + JSON. | Lo estándar hoy. **La que usamos.** |
| **GraphQL** | Una sola URL; el cliente pide **exactamente** los campos que quiere. Evita el *over-fetching* (recibir datos de más) y el *under-fetching* (recibir de menos y tener que pedir otra vez). | Creada por Facebook. |
| **SOAP** | Basada en XML, muy estricta y pesada. | Bancos, sistemas antiguos (*legacy*). |
| **gRPC** | Muy rápida, binaria (HTTP/2 + Protocol Buffers). | Comunicación entre microservicios (Google). |

### 14.4 REST: las 4 reglas

Una API es **REST** si cumple estas restricciones:

1. **Cliente-servidor**: el cliente se ocupa de la interfaz; el servidor, de los datos.
2. **Stateless (sin estado)**: cada petición lleva **toda** la información necesaria. El servidor no
   "se acuerda" de ti entre una petición y otra (por eso, si hay login, el token se manda en
   **cada** petición).
3. **Caché**: las respuestas dicen si se pueden guardar temporalmente para no volver a pedirlas.
4. **Interfaz uniforme**: cada cosa (**recurso**) tiene su URL (`/api/usuarios/123`) y se
   manipula con los verbos HTTP estándar, devolviendo JSON (o XML).

**REST vs RESTful:** *REST* es el **conjunto de reglas** (el estilo, definido por Roy Fielding).
*RESTful* es el **adjetivo** para una API concreta que las cumple: "he hecho una API RESTful en Node".

### 14.5 HTTP en lo justo

**Anatomía de una URL de API:**

```
https://dummyjson.com/products/1?select=title,price
└─┬─┘   └────┬─────┘ └───┬────┘ └┬┘ └──────┬──────┘
protocolo  dominio     recurso   id   parámetros (query string)
```

Cada URL a la que se le pueden hacer peticiones se llama **endpoint**.

**Verbos HTTP** (qué quieres hacer) — se corresponden con el **CRUD**:

| Verbo | CRUD | Ejemplo |
|---|---|---|
| **GET** | Read (leer) | `GET /products` → lista; `GET /products/1` → el producto 1 |
| **POST** | Create (crear) | `POST /products` con un JSON en el cuerpo → crea uno nuevo |
| **PUT** / **PATCH** | Update (modificar) | `PUT /products/1` → cambia el producto 1 entero / `PATCH` solo algunos campos |
| **DELETE** | Delete (borrar) | `DELETE /products/1` |

**Códigos de estado** (cómo ha ido): `200` OK · `201` creado · `400` petición mal hecha ·
`401` no autenticado · `403` prohibido · `404` no existe · `500` error del servidor.
Regla fácil: **2xx bien, 4xx culpa tuya (cliente), 5xx culpa del servidor**.

> **Pruébalo:** abre <https://dummyjson.com/products> en el navegador. Lo que ves es la
> respuesta JSON de un GET. Prueba también `https://dummyjson.com/products/1` y
> `https://dummyjson.com/products/9999` (un 404).

---

## 15. Promise vs Observable (`HttpClient` y RxJS)

> Lo que te dijo tu profe es correcto: **en el proyecto de Angular + API no vas a usar `async`
> ni `await`**, porque los datos no llegan con una **Promise** sino con un **Observable**.
> Esta sección explica qué es eso, por qué no lleva `await` y cómo se usa. Es la más importante
> de la Parte 2.
>
> Requisito: tener claro qué es una Promise y `async/await` (sección 3.10). Como dices que eso ya
> lo tienes, vamos a construir sobre ello.

### 15.1 Dos formas de pedir datos en Angular

| Herramienta | De dónde viene | Qué devuelve | Cómo se recibe el dato |
|---|---|---|---|
| `fetch(url)` | Del **navegador** (JavaScript normal) | Una **Promise** | `await` o `.then()` |
| `this.http.get(url)` | De **Angular** (`HttpClient`) | Un **Observable** | `.subscribe()` o pipe `async` |

Hasta ahora (Corporate App) usábamos `fetch` + `async/await`. **A partir de ahora**, como pide el
profe, usaremos **`HttpClient`**, que es la herramienta oficial de Angular para hablar con APIs.
`HttpClient` es un **servicio** de Angular, así que se consigue por **inyección de dependencias**
(sección 5.9): `private http = inject(HttpClient);`.

### 15.2 ¿Qué es un Observable? (con analogías)

**Repaso de la Promise:** es el **avisador del restaurante**. Pides, te dan el avisador, vibra
**una vez** con tu comida, y se acabó.

**Un Observable es como una suscripción a un canal de YouTube:**

| YouTube | Observable |
|---|---|
| El canal existe, pero **no te llega nada** si no estás suscrito. | El Observable existe, pero **no hace nada** hasta que alguien se suscribe. |
| Le das a **Suscribirse**. | Llamas a **`.subscribe(...)`**. |
| Te llegan notificaciones de vídeos nuevos (pueden ser muchas, a lo largo del tiempo). | Te llegan **valores** (`next`). Pueden ser varios. |
| Si el canal tiene un problema, te llega un aviso. | Te llega un **error** (`error`). |
| El canal cierra: ya no llegarán más vídeos. | El Observable **termina** (`complete`). |
| Te das de baja. | `unsubscribe()`. |

Hay **dos diferencias de fondo** con la Promise:

**1. Un Observable puede emitir muchos valores; una Promise, solo uno.**
Por ejemplo, un Observable podría emitir la posición del GPS cada segundo, o cada letra que el
usuario escribe en un buscador. **Una petición HTTP solo emite un valor** (la respuesta) y termina,
así que en la práctica, para APIs, se usa casi igual que una Promise.

**2. Un Observable es "perezoso" (*lazy*): no empieza hasta que te suscribes.**

Esta es la diferencia que más importa. Mira:

```ts
// PROMISE: la petición se envía YA, en esta línea, aunque nadie la espere
const promesa = fetch('https://dummyjson.com/products');

// OBSERVABLE: aquí NO se envía nada. Solo se ha preparado la petición.
const observable = this.http.get('https://dummyjson.com/products');

observable.subscribe(...);   // ← AHORA sí se envía la petición
```

**Analogía de la receta:** un Observable es como una **receta de cocina** escrita en un papel.
Tenerla no te da de comer; alguien tiene que **cocinarla** (suscribirse). Una Promise es un plato
que **ya se está cocinando** desde que lo pides.

> Si llamas a `this.http.get(url)` y no te suscribes, **la petición nunca se envía**. En la
> pestaña *Network* del F12 ni siquiera aparece. Es el error número 1 con Observables.

### 15.3 ¿Por qué NO se usa `async` / `await`?

Porque **`await` solo sabe esperar Promises**. Un Observable no es una Promise, así que `await` no
sabe qué hacer con él:

```ts
async cargar() {
  const datos = await this.http.get(url);   // ❌ NO espera nada
  console.log(datos);                        // muestra el Observable (la "receta"), no los productos
}
```

`await` ve algo que no es una Promise, lo devuelve tal cual y sigue. `datos` es el Observable sin
abrir, y además **la petición ni se ha enviado** (nadie se ha suscrito).

Por eso con `HttpClient` el patrón es otro: **no hay `async`, no hay `await`, hay `subscribe`**.

(Si algún día necesitas convertir un Observable en Promise para usar `await`, existe
`await firstValueFrom(this.http.get(url))`, de `'rxjs'`. Pero **no** es lo que pide el profe.)

### 15.4 `subscribe` paso a paso

```ts
this.productService.getProducts()          // ① devuelve un Observable (la receta, aún sin cocinar)
  .subscribe({                             // ② me suscribo → AHORA se envía la petición
    next: (response) => {                  // ③ esta función se ejecuta cuando LLEGA la respuesta
      this.products.set(response.products);
    },
    error: (err) => {                      // ④ esta, si FALLA (sin internet, 404, 500...)
      console.error(err);
    },
    complete: () => {                      // ⑤ (opcional) cuando el Observable termina
      console.log('terminado');
    }
  });
console.log('Esto sale ANTES que los productos');   // ⑥
```

Lo que le pasas a `subscribe` es un **objeto** `{ }` con hasta tres funciones flecha:

| Clave | Cuándo la llama RxJS | Equivale en Promise a… |
|---|---|---|
| `next` | Cada vez que llega un valor (en HTTP: una vez, con la respuesta) | `.then(...)` / el resultado del `await` |
| `error` | Si algo falla | `.catch(...)` / el `catch` del `try` |
| `complete` | Cuando ya no van a llegar más valores | `.finally(...)` (más o menos) |

**Orden en el tiempo** (igual que con `await`, el programa no se bloquea):

```
① se prepara el Observable
② subscribe → sale la petición hacia dummyjson.com
⑥ "Esto sale ANTES que los productos"     ← el código sigue sin esperar
   ... (unos milisegundos después) ...
③ next: llega la respuesta → se guardan los productos → la tabla se pinta
⑤ complete
```

Tú **no esperas** a los datos: dejas preparado **qué hacer cuando lleguen** (la función `next`), y
RxJS la llama él solo en su momento. (Fíjate que esto es la idea de *callback* de la sección 4:
le pasas una función a otro para que la llame más tarde. Por eso merecía la pena entenderlo).

### 15.5 La misma tarea de tres formas (compáralas)

Objetivo: cargar los productos de dummyjson en la página.

**A) Lo que hacíamos: `fetch` + `async/await` (Promise)**

```ts
// servicio
async getProducts(): Promise<ProductsResponse> {
  const response = await fetch('https://dummyjson.com/products');
  return await response.json();
}

// página
async ngOnInit() {
  const response = await this.productService.getProducts();
  this.products.set(response.products);
}
```

**B) Lo que pide el profe: `HttpClient` + `subscribe` (Observable)**

```ts
// servicio: SIN async, SIN await, SIN .json()
getProducts(): Observable<ProductsResponse> {
  return this.http.get<ProductsResponse>('https://dummyjson.com/products');
}

// página: SIN async, SIN await
ngOnInit() {
  this.productService.getProducts().subscribe({
    next: (response) => this.products.set(response.products),
    error: (err) => console.error(err)
  });
}
```

**C) La más corta: `HttpClient` + pipe `async` en el HTML (Observable)**

```ts
// página: ni siquiera hay subscribe
products$ = this.productService.getProducts();
```

```html
@if (products$ | async; as response) {
  @for (product of response.products; track product.id) { <p>{{ product.title }}</p> }
}
```

| | A) fetch | B) subscribe | C) pipe async |
|---|---|---|---|
| `async` / `await` | Sí | **No** | **No** |
| Convertir a JSON | A mano (`.json()`) | Automático | Automático |
| Dónde se recibe el dato | Después del `await` | En `next:` | En el HTML |
| ¿Necesita signal en Angular 22? | Sí | Sí | No (el pipe avisa solo) |
| Errores | `try/catch` | `error:` | (más avanzado: `catchError`) |

**B es la que usa la actividad guiada.** C es la que usa el dossier (sección 17). A ya no la usaremos
para APIs.

### 15.6 El servicio, línea a línea

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);                        // DI: pido el HttpClient de Angular
  private apiUrl = 'https://dummyjson.com/products';

  getProducts(): Observable<ProductsResponse> {             // devuelve "una receta que dará un ProductsResponse"
    return this.http.get<ProductsResponse>(this.apiUrl);    // prepara un GET; NO lo envía
  }
}
```

- **`this.http.get(url)`** = "prepara una petición GET a esta URL". Existen también `.post()`,
  `.put()`, `.delete()` para los otros verbos HTTP (sección 14.5).
- **`<ProductsResponse>`** después de `get` es un **genérico** (como `List<String>` en Java): le
  dice a TypeScript qué forma tendrá la respuesta, para que luego te autocomplete
  `response.products`. Ojo: es una promesa **tuya**; TypeScript no comprueba lo que manda de verdad
  el servidor.
- **`Observable<ProductsResponse>`** como tipo de retorno = "devuelvo un Observable que, cuando
  alguien se suscriba, emitirá un `ProductsResponse`".
- El servicio **no se suscribe**: devuelve la receta y **quien la use** (la página) decide cuándo
  cocinarla.

### 15.7 Activar `HttpClient`: `provideHttpClient()`

Para que `inject(HttpClient)` funcione, Angular tiene que tener registrado el "proveedor" de
`HttpClient`. Se hace en la configuración global:

```ts
providers: [
  // ...
  provideHttpClient(),      // de '@angular/common/http'
]
```

En tu plantilla de Ionic eso va en **`main.ts`** (ver 16.3). En Angular 22 funciona incluso sin
ponerlo, pero ponlo siempre: lo pide la checklist del profe.

### 15.8 La convención del `$`

Cuando una variable guarda un Observable, por costumbre se le pone **un `$` al final**:
`users$`, `products$`. No hace nada especial: solo avisa a quien lee el código de que
"esto es un Observable, hay que suscribirse para tener el dato".

### 15.9 El pipe `async` (forma C)

En vez de suscribirte tú en el `.ts`, dejas que **la plantilla se suscriba sola**:

```html
@if (users$ | async; as users) {        <!-- ① se suscribe ② espera ③ guarda el resultado en "users" -->
  @for (user of users; track user.id) { <p>{{ user.name }}</p> }
} @else {
  <p>Cargando...</p>                     <!-- mientras no ha llegado nada -->
}
```

- `users$ | async` = "suscríbete a `users$` y dame el último valor que haya llegado" (mientras no
  llega nada, vale `null`, y por eso entra en el `@else`).
- `as users` = "a ese valor llámalo `users` dentro del bloque".
- Ventajas: no escribes `subscribe`, Angular se **desuscribe solo** al salir de la página (evita
  *memory leaks*, fugas de memoria) y avisa él mismo a Angular para repintar (no necesita signals).
- Hay que importar `AsyncPipe` (de `'@angular/common'`) en el componente.

### 15.10 Errores típicos con Observables

| Error | Qué pasa | Solución |
|---|---|---|
| No suscribirse | La petición no se envía; la pantalla no muestra nada; en F12 → *Network* no aparece | Añadir `.subscribe({...})` o usar el pipe `async` |
| Usar `await` con un Observable | `datos` es el Observable, no los productos | Usar `subscribe` |
| Intentar **devolver** el dato desde dentro de `subscribe` | El `return` dentro de `next` no sale de tu método: se pierde | Guardarlo en una variable/signal dentro de `next` |
| Variable normal dentro de `next` (Angular 22) | Se queda en "Cargando" para siempre (comprobado) | Usar **signals** y `.set()` |
| Olvidar `response.products` | Intentas hacer `@for` sobre un objeto, no un array | Coger la lista de dentro del objeto envoltorio |

El tercero merece un ejemplo, porque es muy común:

```ts
// ❌ MAL: este método no devuelve los productos
getLista() {
  this.productService.getProducts().subscribe({
    next: (r) => { return r.products; }     // este return es de la función flecha, no de getLista
  });
}                                            // getLista termina sin devolver nada

// ✅ BIEN: guardarlo donde la plantilla lo pueda leer
loadProducts() {
  this.productService.getProducts().subscribe({
    next: (r) => this.products.set(r.products)
  });
}
```

### 15.11 Tabla final: Promise vs Observable

| | **Promise** | **Observable** |
|---|---|---|
| De dónde viene | JavaScript estándar | Librería **RxJS** (viene con Angular) |
| Quién lo usa | `fetch`, funciones `async` | `HttpClient` de Angular |
| Cuántos valores | **Uno** | **Cero, uno o muchos** a lo largo del tiempo |
| ¿Empieza solo? | **Sí**, en cuanto lo creas | **No**, hasta que te suscribes (*lazy*) |
| Recibir el valor | `await` o `.then(...)` | `.subscribe({ next })` o pipe `async` |
| Recibir el error | `try/catch` o `.catch(...)` | `error:` en el subscribe |
| ¿Se puede cancelar? | No | Sí (`unsubscribe()`) |
| Tipo en TypeScript | `Promise<Product[]>` | `Observable<Product[]>` |
| Analogía | El avisador del restaurante | La suscripción a un canal de YouTube |

### 15.12 `fetch` vs `HttpClient`

| | `fetch` | `HttpClient` |
|---|---|---|
| Qué es | Función del navegador | Servicio de Angular (se **inyecta**) |
| Devuelve | Promise | Observable |
| Convertir a JSON | A mano: `await response.json()` | Automático |
| Errores 404/500 | **No** cuentan como error (hay que mirar `response.ok`) | **Sí**, van a `error:` |
| Extras | — | Tipado con `<T>`, interceptores (p. ej. añadir un token a todas las peticiones) |

### 15.13 Para decirlo en clase

> *"Con `HttpClient`, Angular no devuelve una Promise sino un Observable de RxJS. Un Observable no
> hace la petición hasta que alguien se suscribe, y puede emitir varios valores. Por eso no se usa
> `await`: se llama a `subscribe` pasándole una función `next` para cuando llegan los datos y otra
> `error` para cuando falla. Otra opción es usar el pipe `async` en la plantilla, que se suscribe y
> se desuscribe solo."*

---

## 16. Actividad guiada: `dam2-productos` (dummyjson) línea a línea

**Objetivo:** app Ionic + Angular standalone que pide los productos a
`https://dummyjson.com/products`, los muestra en una **tabla**, tiene dos rutas (`/inicio` y
`/productos`), se sube a GitHub en una rama **`desarrollo`** y se publica en **Vercel**.

Es **la misma idea que tu Corporate App**, pero los datos vienen de una API de internet en vez de
un JSON local, y se usa `HttpClient` en vez de `fetch`.

```
src/app/
├── models/product.model.ts          → interfaces Product y ProductsResponse
├── services/product.service.ts      → pide los datos con HttpClient
├── pages/inicio/inicio.page.ts      → portada con un botón
├── pages/productos/productos.page.ts→ tabla con los productos
├── app.component.ts                 → raíz con <ion-router-outlet>
├── app.routes.ts                    → rutas
└── app.config.ts                    → configuración global (provideHttpClient)
```

### ⚠️ 16.0 Tres avisos antes de copiar el PDF (comprobados con tu versión)

Tu Ionic/Angular es más nuevo que el del PDF. He probado el código del PDF y pasa esto:

| En el PDF pone | En tu versión (Ionic 9 + Angular 22) | Qué hacer |
|---|---|---|
| `from '@ionic/angular/standalone'` | **No existe** en Ionic 9 → error al compilar. | Importar de **`'@ionic/angular'`** (como en tu Corporate App). |
| `products: Product[] = []`, `loading = false` y se cambian dentro de `subscribe` | Angular 22 no usa zone.js → **la página se queda en "Cargando" para siempre** (comprobado). | Usar **signals**: `products = signal<Product[]>([])` y `.set(...)`. Ver versión corregida en 16.7. |
| `app.config.ts` con `provideHttpClient()` | La plantilla de Ionic **no trae** `app.config.ts`: los *providers* están en `main.ts`. | Añadir `provideHttpClient()` a los `providers` de `main.ts` (o crear `app.config.ts`, ver 16.3). |

### 16.1 Crear el proyecto

```powershell
npm install -g @ionic/cli                          # actualizar la CLI de Ionic (global)
ionic start dam2-productos blank --type=angular    # crear proyecto en blanco
cd dam2-productos
ionic serve                                        # comprobar en http://localhost:8100
```

### 16.2 Standalone vs módulos (lo que explica el PDF)

```
Angular "tradicional"                Angular standalone (el nuestro)
AppModule                            Application
 ├── declarations (componentes)       ├── app.config.ts  (providers globales)
 ├── imports (otros módulos)          ├── app.routes.ts  (rutas)
 └── providers (servicios)            └── cada componente con sus propios imports
```

Antes, todo se "apuntaba" en un fichero central `AppModule` (`@NgModule`). Ahora **cada
componente declara lo que usa** en su `imports: [...]`, y lo global va en `app.config.ts` (o en
`main.ts`). **Checklist del profe:** no debe existir `app.module.ts` ni `@NgModule`.

Sobre `imports: [CommonModule, IonicModule]` que aparece en el PDF: funciona, pero **mete todo**
Ionic y todo `CommonModule`. Lo moderno (y lo que pide luego el propio PDF) es importar **solo lo
que usas**: `IonHeader`, `IonButton`, `CurrencyPipe`…

### 16.3 Activar `HttpClient`

Lo que pone el PDF (`src/app/app.config.ts`):

```ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {   // objeto de configuración de la app
  providers: [
    provideHttpClient()                         // "registra HttpClient para poder inyectarlo"
  ]
};
```

En **tu** plantilla Ionic los providers están en **`main.ts`**, así que lo más simple es añadirlo ahí:

```ts
import { provideHttpClient } from '@angular/common/http';   // ← añadir este import

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),                                     // ← y esta línea
  ],
});
```

> Nota: en Angular 22 `HttpClient` ya funciona aunque no pongas `provideHttpClient()` (lo he
> probado), pero **ponlo igualmente**: lo pide la checklist y es donde se configuran cosas como
> los interceptores.

Es **inyección de dependencias** otra vez (sección 5.9): `provideHttpClient()` registra el
"proveedor" de `HttpClient` en el inyector raíz, y luego el servicio lo pide con `inject(HttpClient)`.

### 16.4 El modelo: `models/product.model.ts`

```ts
export interface Product {
  id: number;
  title: string;                // nombre del producto
  description: string;
  category: string;
  price: number;
  discountPercentage: number;   // % de descuento
  rating: number;               // valoración (0-5)
  stock: number;                // unidades disponibles
  brand: string;                // marca (algunos productos NO la traen)
  thumbnail: string;            // URL de la imagen pequeña
}

export interface ProductsResponse {
  products: Product[];          // la lista de productos
  total: number;                // cuántos productos hay en total en la API (194)
  skip: number;                 // cuántos se ha saltado (para paginar)
  limit: number;                // cuántos devuelve por petición (30 por defecto)
}
```

**¿Por qué dos interfaces?** Porque la API **no devuelve directamente un array**, sino un objeto
que **envuelve** el array (abre <https://dummyjson.com/products> y lo verás):

```json
{
  "products": [ { "id": 1, "title": "Essence Mascara Lash Princess", ... }, ... ],
  "total": 194,
  "skip": 0,
  "limit": 30
}
```

Por eso luego hay que coger **`response.products`**. Los nombres de los campos de la interface
tienen que ser **exactamente** los del JSON (en inglés, como los manda la API). La API manda más
campos de los que pone la interface (`tags`, `reviews`, `images`…) y no pasa nada: la interface
solo describe los que vamos a usar.

### 16.5 El servicio: `services/product.service.ts`

```powershell
ionic generate service services/product
```

```ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';       // el cliente HTTP de Angular
import { Observable } from 'rxjs';                         // el tipo Observable
import { ProductsResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'                                       // un servicio para toda la app
})
export class ProductService {

  private http = inject(HttpClient);                       // DI con inject(): "dame un HttpClient"

  private apiUrl = 'https://dummyjson.com/products';       // el endpoint

  getProducts(): Observable<ProductsResponse> {            // devuelve un Observable (aún no pide nada)
    return this.http.get<ProductsResponse>(this.apiUrl);   // prepara un GET a la URL
  }
}
```

- `inject(HttpClient)` = lo mismo que `constructor(private http: HttpClient) {}`. El PDF lo usa para
  enseñarte `inject()` (lo viste en la sección 5.9).
- Fíjate: **no hay `async` ni `await`**. El servicio devuelve el Observable "sin abrir", y quien lo
  use se suscribirá.
- **Regla del dossier:** las peticiones HTTP van **siempre en un servicio**, nunca directamente en
  la página.

### 16.6 Rutas: `app.routes.ts`

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },            // / → /inicio
  { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio.page').then(m => m.InicioPage) },
  { path: 'productos', loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage) },
  { path: '**', redirectTo: 'inicio' }                              // cualquier otra URL → /inicio
];
```

Lo nuevo es **`'**'`** (comodín, *wildcard*): significa "cualquier ruta que no coincida con las
anteriores". Sirve para que una URL inventada (`/patata`) no deje la pantalla en blanco. **Tiene que
ir la última**, porque Angular mira las rutas de arriba abajo y se queda con la primera que encaje.

### 16.7 La página Productos (versión corregida para tu Angular)

**`productos.page.ts`**

```ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';                     // para | currency
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
} from '@ionic/angular';                                            // ← sin /standalone
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
    IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton,
  ],
})
export class ProductosPage implements OnInit {

  private productService = inject(ProductService);   // DI

  products = signal<Product[]>([]);   // la lista          (PDF: products: Product[] = [])
  total = signal(0);                  // total en la API   (PDF: total = 0)
  loading = signal(false);            // ¿cargando?        (PDF: loading = false)
  error = signal('');                 // mensaje de error  (PDF: error = '')

  ngOnInit(): void {                  // void = no devuelve nada
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading.set(true);           // enseña el spinner
    this.error.set('');               // borra errores anteriores (por si es un "Reintentar")

    this.productService.getProducts() // Observable (aún sin pedir)
      .subscribe({                    // ← aquí se hace la petición de verdad
        next: (response: ProductsResponse) => {    // llegó bien
          this.products.set(response.products);    // el array está DENTRO de response
          this.total.set(response.total);
          this.loading.set(false);
        },
        error: (error) => {                        // falló (sin internet, 404, 500...)
          console.error(error);
          this.error.set('No se han podido cargar los productos.');
          this.loading.set(false);
        }
      });
  }
}
```

La página tiene **tres estados**: *cargando*, *error* y *correcto*. Es lo que pide la checklist
("Estado de carga / correcto / error / botón de reintento").

**`productos.page.html`** (con `@if` / `@for`, la sintaxis que recomienda el profe)

```html
<ion-header>
  <ion-toolbar>
    <ion-buttons slot="start">
      <ion-back-button defaultHref="/inicio"></ion-back-button>
    </ion-buttons>
    <ion-title>Productos</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content class="ion-padding">           <!-- ion-padding: margen interior de Ionic -->
  <h1>Listado de productos</h1>

  @if (loading()) {                          <!-- ESTADO 1: cargando -->
    <div class="loading">
      <ion-spinner></ion-spinner>            <!-- ruedecita girando -->
      <p>Cargando productos...</p>
    </div>
  }

  @if (error()) {                            <!-- ESTADO 2: error (un texto no vacío cuenta como true) -->
    <ion-card>
      <ion-card-header>
        <ion-card-title>Error</ion-card-title>
      </ion-card-header>
      <ion-card-content>
        <p>{{ error() }}</p>
        <ion-button (click)="loadProducts()">Reintentar</ion-button>   <!-- event binding: vuelve a pedir -->
      </ion-card-content>
    </ion-card>
  }

  @if (!loading() && !error()) {             <!-- ESTADO 3: correcto. && = Y, ! = NO -->
    <p>Productos cargados: <strong>{{ products().length }}</strong> de {{ total() }}</p>

    <div class="table-container">
      <table>                                <!-- tabla HTML normal -->
        <thead>                              <!-- cabecera de la tabla -->
          <tr>                               <!-- tr = fila (table row) -->
            <th>ID</th>                      <!-- th = celda de cabecera -->
            <th>Producto</th>
            <th>Categoría</th>
            <th>Marca</th>
            <th>Precio</th>
            <th>Valoración</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>                              <!-- cuerpo de la tabla -->
          @for (product of products(); track product.id) {
            <tr>
              <td>{{ product.id }}</td>      <!-- td = celda normal (table data) -->
              <td>
                <div class="product">
                  <img [src]="product.thumbnail" [alt]="product.title">
                  <span>{{ product.title }}</span>
                </div>
              </td>
              <td>{{ product.category }}</td>
              <td>{{ product.brand || 'Sin marca' }}</td>      <!-- si no hay marca, pone 'Sin marca' -->
              <td>{{ product.price | currency:'EUR' }}</td>    <!-- pipe de moneda -->
              <td>⭐ {{ product.rating }}</td>
              <td>{{ product.stock }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</ion-content>
```

Cosas nuevas:
- **`a || b`** = "si `a` está vacío / no existe, usa `b`". Algunos productos de dummyjson no traen
  `brand`, y así no sale la celda vacía.
- **`<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`**: tabla HTML de toda la vida (en la
  Corporate App usamos el `ion-grid` de Ionic, que es otra forma de hacer tablas).
- **`| currency:'EUR'`** necesita `CurrencyPipe` en los `imports`. Sale como `€9.99` (formato inglés
  por defecto).
- Si usas `@if`/`@for`, **no hace falta `CommonModule`**. Si usas `*ngIf`/`*ngFor`, sí (o `NgIf`/`NgFor`).

**`productos.page.scss`**

```scss
.loading { text-align: center; padding: 40px; }        /* spinner centrado con aire */

.table-container {
  width: 100%;
  overflow-x: auto;              /* si la tabla no cabe (móvil), se hace scroll horizontal */
}

table {
  width: 100%;
  min-width: 900px;              /* nunca más estrecha de 900px → en móvil, scroll */
  border-collapse: collapse;     /* bordes de celdas pegados (sin doble línea) */
}

th, td {                         /* a la vez para th y td */
  padding: 12px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

th {
  background: var(--ion-color-primary);   /* color principal del tema de Ionic (azul) */
  color: white;
}

.product { display: flex; align-items: center; gap: 10px; }   /* imagen y nombre en fila, separados 10px */
.product img { width: 50px; height: 50px; object-fit: contain; }  /* imagen 50x50 sin deformarse */
```

- `var(--ion-color-primary)`: una **variable CSS** de Ionic. Si cambias el color primario del
  tema, cambia en toda la app.
- `display: flex`: pone los hijos uno al lado del otro.

### 16.8 Página Inicio y componente raíz

**`inicio.page.ts`** — solo declara lo que usa su HTML:

```ts
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink],
})
export class InicioPage {}
```

**`inicio.page.html`**

```html
<ion-header>
  <ion-toolbar><ion-title>Inicio</ion-title></ion-toolbar>
</ion-header>
<ion-content class="ion-padding">
  <h1>DAM2 - API REST</h1>
  <p>Aplicación Ionic + Angular Standalone para consumir una API REST.</p>
  <ion-button routerLink="/productos">Ver productos</ion-button>   <!-- necesita RouterLink -->
</ion-content>
```

**`app.component.ts`** + **`.html`**: igual que en la Corporate App (sección 8.4):
`imports: [IonApp, IonRouterOutlet]` y `<ion-app><ion-router-outlet></ion-router-outlet></ion-app>`.

### 16.9 GitHub con rama `desarrollo`

```powershell
git init                                           # convierte la carpeta en repositorio
git add .
git commit -m "Creación inicial de aplicación Ionic Standalone"
git checkout -b desarrollo                         # crea la rama "desarrollo" y se cambia a ella
git branch --show-current                          # comprobar: debe decir "desarrollo"
git remote add origin https://github.com/JorgeGonzalezDI/dam2-productos.git   # conectar con GitHub
git push -u origin desarrollo                      # subir la rama desarrollo
```

- `git checkout -b nombre` = crear rama **y** cambiarse a ella (`-b` de *branch*).
- `-u` (*upstream*) en el primer push = "recuerda que esta rama va con `origin/desarrollo`"; los
  siguientes push son solo `git push`.
- El profe entrará en GitHub → selector de ramas → **desarrollo**.
- El PDF pide un repositorio propio `dam2-productos`. Cuando la hagas, decidimos si va en ese
  repo nuevo (como pide el PDF) o como carpeta `03-...` de tu repo de la asignatura.

### 16.10 Vercel

Add New Project → importar `dam2-productos` → **Production Branch: `desarrollo`** (por defecto
Vercel usa `main`, hay que cambiarlo) → Deploy. Build `npm run build`, salida `www`, y el
`vercel.json` con el *rewrite* a `index.html` (sección 8.12).

**Comprobar dos cosas:** que `https://TU-APP.vercel.app/` funciona **y** que
`https://TU-APP.vercel.app/productos` funciona **recargando la página** (si da 404 → falta el
`vercel.json`). Y que los productos se cargan en producción (la API es pública, así que sí).

### 16.11 Checklist del profe (resumida)

- **Standalone:** sin `app.module.ts`, imports en cada componente, `provideHttpClient()`.
- **API:** se consume `dummyjson.com/products`; existen `Product`, `ProductsResponse`, `ProductService`.
- **Vista:** tabla con ID, nombre, categoría, precio, stock, valoración e imagen.
- **Navegación:** `/inicio`, `/productos`, `/` → `/inicio`, ruta desconocida → `/inicio`, ir y volver.
- **Estados:** carga, correcto, error, botón reintentar.
- **Git/GitHub:** repo, rama `desarrollo`, commits descriptivos.
- **Vercel:** desplegado desde `desarrollo`, URL funcionando, `/productos` funciona directamente.

---

## 17. El ejemplo del dossier: directorio de usuarios con `async` pipe

El dossier hace lo mismo con usuarios de `https://jsonplaceholder.typicode.com/users` (la API de tu
práctica `paradigmas-js`), pero usando el **pipe `async`** en lugar de `subscribe`.

**`api.service.ts`** — igual que el `ProductService`, con `getUsers(): Observable<User[]>`. Aquí
la API sí devuelve **directamente un array**, por eso es `User[]` y no un objeto envoltorio.

**`home.page.ts`**

```ts
export class HomePage implements OnInit {
  public users$!: Observable<User[]>;     // $ = es un Observable; ! = "ya le daré valor luego, no te quejes"
  private apiService = inject(ApiService);

  ngOnInit() { this.fetchData(); }

  fetchData() {
    this.users$ = this.apiService.getUsers();   // NO se suscribe: guarda el Observable "sin abrir"
  }
}
```

- **`!` después del nombre** (*definite assignment*): TypeScript se queja si declaras una propiedad
  sin valor inicial; el `!` le dice "tranquilo, se la doy en `ngOnInit`".

**`home.page.html`**

```html
<ion-list *ngIf="users$ | async as users; else loading">   <!-- se suscribe; mientras no llega → plantilla "loading" -->
  <ion-item *ngFor="let user of users">
    <ion-avatar slot="start">                                <!-- imagen redonda a la izquierda -->
      <img [src]="'https://ui-avatars.com/api/?name=' + user.name" alt="Avatar"/>  <!-- texto + variable -->
    </ion-avatar>
    <ion-label>
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p><ion-icon name="globe-outline"></ion-icon> {{ user.website }}</p>
    </ion-label>
  </ion-item>
</ion-list>

<ng-template #loading>                                       <!-- plantilla con nombre "loading" -->
  <ion-list>
    <ion-item *ngFor="let i of [1,2,3,4,5]">                 <!-- 5 filas falsas -->
      <ion-avatar slot="start"><ion-skeleton-text animated></ion-skeleton-text></ion-avatar>
      <ion-label>
        <h2><ion-skeleton-text animated style="width: 50%"></ion-skeleton-text></h2>
        <p><ion-skeleton-text animated style="width: 80%"></ion-skeleton-text></p>
      </ion-label>
    </ion-item>
  </ion-list>
</ng-template>
```

- **`users$ | async as users`**: el pipe `async` se suscribe y el resultado se llama `users` dentro.
- **`; else loading`** + **`<ng-template #loading>`**: "si todavía no hay datos, pinta la plantilla
  llamada `loading`". `#loading` es una **referencia de plantilla** (un nombre para ese trozo).
  Con la sintaxis nueva sería `@if (users$ | async; as users) { ... } @else { ... }`.
- **`<ion-skeleton-text animated>`**: rectángulos grises animados que imitan el contenido mientras
  carga (*skeleton loading*), como en YouTube o Instagram.
- **`'texto' + user.name`** dentro de `[src]`: concatena texto con la variable para formar la URL.
- Este ejemplo **sí funciona** en tu Angular 22 sin signals, porque el pipe `async` avisa él mismo
  a Angular de que hay datos nuevos (lo he comprobado).
- `IonicModule` en los imports del dossier = importar todo Ionic de golpe (forma antigua).

---

## 18. Ejercicio propuesto: Maestro-Detalle con la API de Rick and Morty

Lo propone el dossier. **Maestro-detalle** (*master-detail*) = una pantalla con la **lista**
(maestro) y, al pulsar un elemento, otra pantalla con **todos sus datos** (detalle). Como la app de
contactos del móvil.

| Requisito | Qué significa / qué vas a usar |
|---|---|
| 1. Interfaces estrictas | Abre <https://rickandmortyapi.com/api/character>. La respuesta es `{ info: {...}, results: [...] }` → interfaces `Character` y `CharacterResponse` (como `Product` y `ProductsResponse`). |
| 2. `CharacterService` | Dos métodos: `getCharacters()` → `GET /character` y `getCharacter(id)` → `GET /character/{id}` (un solo personaje). |
| 3. Vista maestra | `<ion-list>` con `<ion-item>` por personaje: `<ion-avatar>` con `image`, `name` y `species`. |
| 4. Navegación con id | Ruta con **parámetro**: `{ path: 'personaje/:id', loadComponent: ... }`. El `:id` es una variable de la URL. En la lista: `[routerLink]="['/personaje', character.id]"`. |
| 5. Vista detalle | La página lee el `id` de la URL, llama a `getCharacter(id)` y muestra `origin.name`, `status`, `gender` en un `<ion-card>`. |
| 6. Errores (avanzado) | Capturar el error (red caída, 404) con `catchError` de RxJS o en el `error:` del subscribe y mostrar un **`<ion-toast>`** (mensajito que aparece abajo y desaparece). |

**Pistas para leer el `id` de la URL:** tu plantilla Ionic ya trae `withComponentInputBinding()` en
`main.ts`, que permite recibir el parámetro de la ruta directamente como una entrada del componente:

```ts
import { input } from '@angular/core';
export class PersonajePage {
  id = input<string>();          // Angular rellena esto con el :id de la URL ("1", "2"...)
}
```

(La forma clásica es inyectar `ActivatedRoute` y leer `route.snapshot.paramMap.get('id')`.)

Cuando lo vayas a hacer, lo montamos paso a paso.

---

## 19. Preguntas de repaso de la Parte 2

1. ¿Qué es una API? ¿Y qué la hace REST?
2. ¿Qué verbo HTTP usarías para crear un producto? ¿Y para borrarlo?
3. ¿Qué significa un 404? ¿Y un 500?
4. ¿Qué diferencia hay entre una Promise y un Observable? (di al menos dos)
5. Si llamo a `this.http.get(url)` y no hago nada más, ¿se hace la petición?
6. ¿Por qué el modelo de dummyjson tiene `ProductsResponse` además de `Product`?
7. ¿Para qué sirve la ruta `'**'` y por qué va la última?
8. ¿Qué hace `{{ product.brand || 'Sin marca' }}`?
9. ¿Por qué con Angular 22 hay que usar signals dentro del `subscribe`? ¿Por qué con el pipe `async` no hace falta?
10. ¿Qué tienes que configurar en Vercel para que publique la rama `desarrollo`?

<details>
<summary><b>Respuestas</b></summary>

1. Un conjunto de reglas para que dos programas se comuniquen; REST si es cliente-servidor, sin estado, cacheable y con interfaz uniforme (recursos en URLs + verbos HTTP + JSON).
2. `POST` para crear, `DELETE` para borrar.
3. 404: el recurso no existe (error del cliente). 500: error interno del servidor.
4. Promise da un único valor y empieza sola; Observable puede dar varios, no empieza hasta suscribirse y se puede cancelar. Promise es JavaScript estándar; Observable es de RxJS.
5. No: un Observable no hace nada hasta que alguien se suscribe (con `.subscribe()` o con el pipe `async`).
6. Porque la API devuelve un objeto que envuelve la lista (`products`, `total`, `skip`, `limit`), no la lista directamente.
7. Es el comodín: atrapa cualquier URL que no exista y redirige. Va la última porque las rutas se comprueban en orden.
8. Muestra la marca y, si no tiene, el texto "Sin marca".
9. Porque sin zone.js Angular no se entera de cambios en propiedades normales hechos dentro de un callback; el signal le avisa con `.set()`. El pipe `async` ya avisa él solo cuando llegan datos.
10. Production Branch = `desarrollo` (en la importación o en Settings → Git).
</details>
