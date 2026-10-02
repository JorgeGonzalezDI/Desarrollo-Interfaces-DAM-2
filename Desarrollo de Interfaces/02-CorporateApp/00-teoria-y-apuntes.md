# Tarea 02 — Corporate App (Ionic + Angular Standalone + Capacitor + GitHub + Vercel)

**Alumno:** Jorge González Gómez
**Módulo:** 0488 Desarrollo de Interfaces — 2º DAM (Nebrija)
**Sesión de trabajo:** 02-10-2026 · **Entrega:** lunes 05-10-2026
**Proyecto:** `C:\DAM 2\Desarrollo de Interfaces\02-CorporateApp\corporateApp`

> Alcance de esta entrega: puntos **1 a 9** del enunciado + **inyección de dependencias** +
> ampliación pedida: **campo `vendedor`** en el grid con al menos **3 productos**, y publicación
> en **GitHub** y **Vercel**.

---

## Índice

0. Objetivo y tecnologías
1. Creación del proyecto
2. Estructura inicial
3. Generación de páginas
4. Configuración de rutas
5. Menú principal horizontal
6. Modelo de producto
7. Datos fake (JSON local)
8. Servicio para productos
9. Componente Productos
10. **Inyección de dependencias**
11. Ampliación: campo vendedor
12. Publicación en GitHub
13. Despliegue en Vercel
14. Conclusiones

---

## 0. Objetivo y tecnologías

Construir una aplicación corporativa con cuatro pantallas (Home, Productos, Nosotros y
Contacto) que se pueda publicar en la web y ejecutar en Android.

| Tecnología | Papel en el proyecto |
|---|---|
| **TypeScript** | JavaScript con tipos: interfaces y comprobación de errores al compilar. |
| **Angular (standalone)** | Framework: componentes, rutas, servicios e inyección de dependencias, sin `NgModule`. |
| **Ionic** | Componentes visuales con aspecto de app móvil (`ion-header`, `ion-segment`, `ion-grid`…). |
| **Capacitor** | Puente hacia las funciones nativas del móvil (se usará más adelante). |
| **GitHub / Vercel** | Repositorio del código y publicación web (más adelante). |
| **Android Studio** | Ejecución en el emulador Pixel 9 (más adelante). |

> 📸 **Captura 1** — Versiones: `node -v`, `ionic -v`, `ionic info`.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 1. Creación del proyecto

```bash
ionic start corporateApp blank --type=angular --standalone
cd corporateApp
ionic serve
```

- `blank`: plantilla vacía, con una sola página.
- `--type=angular`: proyecto Angular (Ionic también admite React y Vue).
- `--standalone`: componentes independientes, sin `NgModule`.
- `ionic serve`: compila y abre un servidor de desarrollo en `http://localhost:8100` con
  *live reload* (la página se recarga sola al guardar un fichero).

> 📸 **Captura 2** — Terminal con `ionic serve` arrancado.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 2. Estructura inicial

```
src
├── app
│   ├── pages
│   │   ├── home
│   │   ├── productos
│   │   ├── nosotros
│   │   └── contacto
│   ├── services
│   │   └── products.service.ts      (geolocation y messages: siguientes puntos)
│   └── models
│       └── product.interface.ts
└── assets
    ├── data
    │   └── products.json
    └── images
        ├── dell.jpg
        ├── lg.jpg
        └── logitech.jpg
```

Cada carpeta tiene una responsabilidad:

- **pages**: lo que ve el usuario (plantilla HTML, estilos y lógica de la vista).
- **services**: acceso a datos y lógica de negocio.
- **models**: los tipos de datos que comparten páginas y servicios.
- **assets**: ficheros estáticos (JSON, imágenes) que se copian tal cual al compilar.

> 📸 **Captura 3** — Árbol de carpetas en el explorador de VS Code.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 3. Generación de páginas

```bash
ionic generate page pages/home --standalone
ionic generate page pages/productos --standalone
ionic generate page pages/nosotros --standalone
ionic generate page pages/contacto --standalone
```

Cada página tiene su `.page.ts` (clase), `.page.html` (plantilla) y `.page.scss` (estilos).
Al ser **standalone**, cada componente indica en su propio `imports: [...]` los componentes
de Ionic y directivas que usa su plantilla. Nosotros y Contacto, de momento, solo tienen la
cabecera con el botón de volver.

> 📸 **Captura 4** — Terminal con los `ionic generate page`.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 4. Configuración de rutas

Fichero `src/app/app.routes.ts`:

```ts
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home',      loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage) },
  { path: 'productos', loadComponent: () => import('./pages/productos/productos.page').then(m => m.ProductosPage) },
  { path: 'nosotros',  loadComponent: () => import('./pages/nosotros/nosotros.page').then(m => m.NosotrosPage) },
  { path: 'contacto',  loadComponent: () => import('./pages/contacto/contacto.page').then(m => m.ContactoPage) },
];
```

- `redirectTo: 'home'` + `pathMatch: 'full'`: la ruta vacía (`/`) lleva a `/home`.
- `loadComponent` con `import()` = **lazy loading**: cada página se compila en un fichero JS
  aparte que solo se descarga cuando el usuario entra en esa ruta.

> 📸 **Captura 5** — `app.routes.ts` en VS Code.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 5. Menú principal horizontal

`home.page.html`:

```html
<ion-header>
  <ion-toolbar>
    <ion-title>Corporate App</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content>
  <ion-segment>
    <ion-segment-button value="productos" routerLink="/productos">
      <ion-label>Productos</ion-label>
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

`ion-segment` dibuja la barra de botones horizontal y `routerLink` navega a la ruta indicada.
Para que funcione, `home.page.ts` importa `RouterLink` y los componentes `IonSegment`,
`IonSegmentButton`, `IonLabel`, etc.

> 📸 **Captura 6** — Home en el navegador con el menú horizontal.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 6. Modelo de producto

`src/app/models/product.interface.ts`:

```ts
export interface Product {
  id: number;
  nombre: string;
  vendedor: string;
  unidades: number;
  precio: number;
  foto: string;
}
```

Una `interface` solo existe al compilar (no genera JavaScript). Sirve para que TypeScript
avise si a un producto le falta un campo o tiene un tipo incorrecto.

---

## 7. Datos fake (JSON local)

`src/assets/data/products.json`:

```json
[
  { "id": 1, "nombre": "Portátil Dell",    "vendedor": "Ana García",   "unidades": 12, "precio": 1200, "foto": "assets/images/dell.jpg" },
  { "id": 2, "nombre": "Monitor LG",       "vendedor": "Luis Martín",  "unidades": 8,  "precio": 299,  "foto": "assets/images/lg.jpg" },
  { "id": 3, "nombre": "Teclado Logitech", "vendedor": "Carlos Pérez", "unidades": 25, "precio": 89,   "foto": "assets/images/logitech.jpg" }
]
```

Como `assets` se copia tal cual al compilar, el JSON y las imágenes se pueden pedir por URL.

> 📸 **Captura 7** — `products.json` en VS Code.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 8. Servicio para productos

```bash
ionic generate service services/products
```

```ts
@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  async getProducts(): Promise<Product[]> {
    const response = await fetch('assets/data/products.json');
    const products = await response.json();
    return products;
  }
}
```

- `fetch` pide el fichero JSON; es asíncrono, por eso se usa `async/await`.
- `Promise<Product[]>`: el método promete devolver un array de productos.
- `@Injectable({ providedIn: 'root' })`: convierte la clase en un servicio que Angular puede
  **inyectar** (ver punto 10).

> 📸 **Captura 8** — `products.service.ts` en VS Code.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 9. Componente Productos

`productos.page.ts`:

```ts
export class ProductosPage implements OnInit {
  products = signal<Product[]>([]);

  constructor(private productService: ProductsService) {}

  async ngOnInit() {
    this.products.set(await this.productService.getProducts());
  }
}
```

`productos.page.html`:

```html
<ion-grid>
  <ion-row class="header">
    <ion-col>ID</ion-col> <ion-col>Nombre</ion-col> <ion-col>Vendedor</ion-col> <ion-col>Unidades</ion-col>
    <ion-col>Precio</ion-col> <ion-col>Foto</ion-col>
  </ion-row>

  <ion-row *ngFor="let product of products()">
    <ion-col>{{ product.id }}</ion-col>
    <ion-col>{{ product.nombre }}</ion-col>
    <ion-col>{{ product.vendedor }}</ion-col>
    <ion-col>{{ product.unidades }}</ion-col>
    <ion-col>{{ product.precio }} €</ion-col>
    <ion-col><img [src]="product.foto" width="80" /></ion-col>
  </ion-row>
</ion-grid>
```

- `ngOnInit`: se ejecuta una vez al crear el componente; es el sitio para cargar datos.
- `*ngFor`: repite la fila por cada producto. Hay que importar `NgFor` en el componente.
- `{{ }}` es interpolación y `[src]` es *property binding* (lo visto en la tarea 1).
- **Diferencia con el PDF:** en lugar de `products: any[] = []` se usa un **signal**
  (`signal<Product[]>([])`). Angular 22 funciona sin `zone.js`, y una propiedad normal
  asignada después de un `await` no refresca la pantalla (la tabla saldría vacía). Con
  `.set(...)` Angular sabe que tiene que repintar. En la plantilla se lee como `products()`.

> 📸 **Captura 9** — `productos.page.ts` en VS Code.
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 10** — Página Productos en el navegador con la tabla y las fotos.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 10. Inyección de dependencias (DI)

### 10.1 Qué problema resuelve

Sin DI, la página crearía el servicio ella misma:

```ts
// ❌ sin inyección de dependencias
private productService = new ProductsService();
```

Eso tiene tres problemas:

1. **Acoplamiento**: la página depende de cómo se construye el servicio. Si el servicio
   necesitara otros objetos en su constructor, habría que cambiar todas las páginas.
2. **Copias duplicadas**: cada página tendría su propia instancia y no podrían compartir datos.
3. **Difícil de probar**: no se puede cambiar el servicio real por uno falso en un test.

Con DI la página **no crea** el servicio: solo **dice que lo necesita**, y Angular se lo
entrega ya construido. A esto se le llama **inversión de control**: crear los objetos deja de
ser tarea del componente y pasa a ser tarea del framework.

### 10.2 Piezas

| Pieza | Qué es | En el proyecto |
|---|---|---|
| **Dependencia** | Lo que se necesita | `ProductsService` |
| **Proveedor** | La "receta" para crearla | `@Injectable({ providedIn: 'root' })` |
| **Inyector** | El contenedor que guarda las instancias y las reparte | Inyector raíz de la app |
| **Consumidor** | Quien la pide | `ProductosPage` |

### 10.3 Registrar el servicio: `providedIn: 'root'`

- Registra el servicio en el **inyector raíz** de la aplicación.
- **Singleton**: hay una sola instancia compartida por toda la app.
- **Se crea solo cuando alguien lo pide** por primera vez.
- **Tree-shakable**: si nadie lo usa, se elimina del build final.

### 10.4 Pedir el servicio: inyección por constructor

```ts
constructor(private productService: ProductsService) {}
```

Angular lee el **tipo** del parámetro (`ProductsService`), lo busca en el inyector y pasa la
instancia al crear la página. El `private` crea a la vez la propiedad `this.productService`.

Angular moderno tiene una forma equivalente, la función `inject()`:

```ts
private productService = inject(ProductsService);
```

Hace lo mismo con menos código. En esta práctica se usa la del constructor, que es la del
enunciado.

### 10.5 DI también en la configuración: `main.ts`

```ts
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, ...),
  ],
});
```

`providers` configura el inyector raíz. La línea `{ provide: RouteReuseStrategy, useClass:
IonicRouteStrategy }` significa: "cuando el router de Angular pida una `RouteReuseStrategy`,
entrégale la de Ionic". El router no sabe que se la han cambiado; así funciona la navegación
con animaciones de Ionic. Es la misma idea: el que pide no elige qué recibe.

### 10.6 Ventaja para el resto del proyecto

```
ProductosPage ──(DI)──▶ ProductsService ──fetch──▶ assets/data/products.json
```

Si más adelante los productos vienen de una API REST en Node.js, solo cambia el interior de
`ProductsService`. `ProductosPage` no se toca. Los siguientes servicios
(`GeolocationService`, `MessagesService`) seguirán el mismo patrón.

---

## 11. Ampliación: campo vendedor

Se pide que cada producto tenga un **vendedor** (texto) y que se muestre en el grid, con al
menos tres productos. El cambio toca tres sitios, siempre en este orden:

1. **Modelo** (`product.interface.ts`): se añade `vendedor: string;`. A partir de aquí
   TypeScript exige que todo `Product` tenga vendedor.
2. **Datos** (`products.json`): se añade `"vendedor": "..."` a cada producto y un tercer
   producto (Teclado Logitech) con su foto `assets/images/logitech.jpg`.
3. **Vista** (`productos.page.html`): una columna más en la cabecera (`Vendedor`) y otra en
   la fila (`{{ product.vendedor }}`).

El **servicio y la página `.ts` no cambian**: el servicio devuelve lo que haya en el JSON y la
página lo pasa a la plantilla. Es la ventaja de tener separadas las capas (modelo, datos,
servicio y vista).

Para que las 6 columnas quepan en un móvil se fijó el ancho de cada una con `size` (el grid de
Ionic se divide en 12 partes: `ID 1 + Nombre 2.5 + Vendedor 2.5 + Uds. 1.5 + Precio 2 + Foto 2.5 = 12`).

> 📸 **Captura 11** — `product.interface.ts` con el campo `vendedor`.
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 12** — `products.json` con los 3 productos y sus vendedores.
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 13** — Página Productos en el navegador con la columna Vendedor.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 12. Publicación en GitHub

El proyecto está dentro del repositorio de la asignatura
(`https://github.com/JorgeGonzalezDI/Desarrollo-Interfaces-DAM-2`), en la carpeta
`02-CorporateApp/corporateApp`. Por eso no hace falta `git init` ni `git remote add`: ya se
hicieron al crear el repositorio. Solo hay que guardar los cambios y subirlos:

```bash
git add .
git commit -m "Tarea 02: Corporate App con productos, vendedor e inyeccion de dependencias"
git push
```

- `git add .`: prepara todos los ficheros nuevos y modificados.
- `git commit -m`: crea una "foto" del proyecto con un mensaje.
- `git push`: sube los commits a GitHub.

`node_modules`, `.angular` y `www` no se suben (están en `.gitignore`): se regeneran con
`npm install` y `npm run build`.

> 📸 **Captura 14** — Terminal con `git add`, `git commit` y `git push`.
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 15** — Repositorio en GitHub mostrando `02-CorporateApp/corporateApp`.
>
> `[ PEGAR CAPTURA AQUÍ ]`

---

## 13. Despliegue en Vercel

Vercel descarga el repositorio, ejecuta el build y publica la carpeta resultante en una URL
pública. Configuración:

| Opción | Valor | Por qué |
|---|---|---|
| Repositorio | `Desarrollo-Interfaces-DAM-2` | El repo de la asignatura. |
| Root Directory | `02-CorporateApp/corporateApp` | El repo contiene varias tareas; hay que indicar dónde está el `package.json` de esta. |
| Framework Preset | Other | Como indica el enunciado. |
| Build Command | `npm run build` | Ejecuta `ng build`. |
| Output Directory | `www` | Donde Angular deja la app compilada (`angular.json` → `outputPath`). |

Dos ficheros añadidos al proyecto para que el despliegue funcione:

- **`package.json` → `"engines": { "node": "24.x" }`**: Angular 22 necesita Node 22.22.3 o
  superior; así Vercel usa Node 24.
- **`vercel.json`** con una regla *rewrite*:
  ```json
  { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
  ```
  Es una SPA (*Single Page Application*): solo existe `index.html` y es Angular quien decide
  qué página mostrar según la URL. Sin esta regla, al recargar `/productos` Vercel buscaría un
  fichero `productos` que no existe y daría error 404.

Despliegue automático: cada `git push` a la rama de producción genera un nuevo deploy.

> 📸 **Captura 16** — Pantalla de configuración del proyecto en Vercel.
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 17** — Deploy completado (pantalla "Congratulations" o el panel con estado *Ready*).
>
> `[ PEGAR CAPTURA AQUÍ ]`

> 📸 **Captura 18** — La app abierta en la URL pública de Vercel, en la página Productos.
>
> `[ PEGAR CAPTURA AQUÍ ]`

**URL pública:** `https://__________.vercel.app`

---

## 14. Conclusiones

*(Escribir 4-5 líneas con tus palabras. Ideas: el proyecto standalone con lazy loading separa
cada página en su propio fichero; la inyección de dependencias permite que la página use el
servicio sin crearlo; añadir el vendedor solo obligó a tocar modelo, datos y vista; en Angular
22 hubo que usar signals porque funciona sin zone.js; Vercel publica la app automáticamente con
cada push.)*
