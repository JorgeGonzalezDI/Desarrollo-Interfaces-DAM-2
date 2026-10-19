# 04 · Reactividad con Signals: el carrito (Seguimiento, entrega 10-10-2026)

## Dónde está la teoría

| Qué | Dónde |
|---|---|
| Dossier del profe | `Dossier_Reactividad_y_Signals.pdf` (en esta carpeta) |
| · Cómo se hacía antes (Zone.js, RxJS) | Dossier, pág. 1 |
| · Qué es una signal y sus 3 tipos | Dossier, pág. 2 |
| · El código del carrito | Dossier, págs. 3–5 |
| · `OnPush` y por qué se usa `update()` con `...` | Dossier, pág. 6 |
| · `computed()` y `effect()` por dentro | Dossier, pág. 7 |
| · `@for` y `track` | Dossier, pág. 8 |
| Tu guía de estudio | `00-Apuntes/01-guia-de-estudio-desde-cero.md` → §5.3 (binding `{{ }}` y `(click)`), §5.4 (`@for`, `@if`), §5.6 (Signals) |

---

## La idea en 3 líneas

- **`signal()`**: una caja con un valor que **avisa** cuando cambia.
- **`computed()`**: un valor **calculado** a partir de otras signals. Se recalcula solo, y solo cuando cambian.
- **`effect()`**: un trozo de código que **se ejecuta solo** cada vez que cambian las signals que lee (para cosas "de fuera": `console.log`, guardar en `localStorage`…).

Analogía con Excel: `A1` es una signal, `B1 = SUMA(A1:A9)` es un computed y una macro que salta cada vez que cambias `A1` es un effect.

---

## El código, bloque a bloque

Archivo: `carrito-signals/src/app/carrito-signals/carrito-signals.component.ts`

### 1. El estado: `signal`

```ts
public productos = signal<Producto[]>([
  { id: 1, nombre: 'Licencia IDE', precio: 89 },
  { id: 2, nombre: 'Teclado Mecánico', precio: 120 }
]);
```

- **Leer**: `this.productos()`, con paréntesis, porque una signal es una función.
- **Escribir**: `.set(valorNuevo)` lo sustituye entero; `.update(anterior => nuevo)` lo calcula a partir del anterior.

### 2. El valor derivado: `computed`

```ts
public precioTotal = computed(() => {
  return this.productos().reduce((total, prod) => total + prod.precio, 0);
});
```

- `reduce` recorre el array acumulando: empieza en `0` y en cada vuelta suma el precio del producto (0 → 89 → 209).
- Angular apunta que `precioTotal` **depende** de `productos`. Si `productos` no cambia, no vuelve a hacer el `reduce` y usa el valor guardado (caché).

### 3. El efecto secundario: `effect`

```ts
constructor() {
  effect(() => {
    console.log(`[Persistencia] ... Items: ${this.productos().length}`);
  });
}
```

- Se ejecuta **una vez al arrancar** (Items: 2) y **otra vez cada vez que cambia `productos`** (Items: 3). Eso es la captura 3.
- Va en el constructor porque ahí Angular lo ata a la vida del componente: cuando el componente se destruye, el efecto se para solo y no hay fugas de memoria.

### 4. Cambiar el estado: `update` con `...` (spread)

```ts
this.productos.update(anterior => [...anterior, nuevoProducto]);   // añadir
this.productos.update(anterior => anterior.filter(p => p.id !== id)); // eliminar
```

- `[...anterior, nuevo]` crea un **array nuevo** con todo lo de antes más el nuevo. `filter` también devuelve un array nuevo.
- **Por qué no `push()`**: `push` mete el producto en el **mismo** array (misma referencia en memoria) y Angular cree que no ha cambiado nada, así que la pantalla no se repinta.

### 5. `ChangeDetectionStrategy.OnPush`

Le dice a Angular que solo revise este componente si hay un evento suyo (un `click`) o si cambia una signal que usa el template. Así no recorre toda la app en cada evento.

### 6. El template

```html
Total: {{ precioTotal() }}€                         <!-- interpolación de un computed -->

@for (prod of productos(); track prod.id) {        <!-- repetir por cada producto -->
  ... {{ prod.nombre }} ... (click)="eliminarProducto(prod.id)"
} @empty {
  El carrito está vacío                             <!-- si el array está vacío -->
}
```

- `track prod.id` es obligatorio. Le dice a Angular cómo reconocer cada fila, para que al añadir o quitar uno solo toque **ese** nodo del DOM y no repinte la lista entera.

---

## Qué demuestra cada captura (`capturas/`)

| Captura | Qué se ve | Qué concepto demuestra |
|---|---|---|
| 1 · render inicial | 2 productos, Total 209 € | `signal` inicial + `computed` (89 + 120) |
| 2 · producto añadido | Aparece "Monitor ###" | `update` con spread + `@for track` |
| 3 · consola | `Items: 2` y luego `Items: 3` | `effect` al arrancar y al cambiar |
| 4 · total | Total 459 € | `computed` recalculado (89 + 120 + 250) |

---

## Cosas que pasaron montándolo (por si te pasan a ti)

- **Si pones el componente directamente dentro de `<ion-app>` se ve mal** (solo sale un producto y no se ve el botón). Ionic necesita que la página esté dentro de `<ion-router-outlet>`, que le pone la clase `ion-page`. Por eso `app.ts` tiene `<ion-router-outlet>` y `app.routes.ts` carga el componente con `loadComponent`, como hace la plantilla `ionic start blank`.
- **Versión de Ionic**: el dossier importa de `'@ionic/angular/standalone'`. Eso existe en **Ionic 8** (el que usa este proyecto, `^8.8.19`). En **Ionic 9**, que es el que tienes en tus otros proyectos, se importa de `'@ionic/angular'` y `/standalone` ya no existe.

## Cómo ejecutarlo

```bash
cd carrito-signals
npm install
npm start          # abre http://localhost:4200
```

Abre la consola del navegador (F12 → Console) para ver los mensajes del `effect`.

---

## Comprueba que lo entiendes

1. ¿Qué diferencia hay entre `.set()` y `.update()`?
   → `set` pone un valor nuevo sin mirar el anterior; `update` recibe el anterior y devuelve el nuevo.
2. ¿Por qué `this.productos().push(x)` no actualizaría la pantalla?
   → Porque es el mismo array (misma referencia) y la signal no detecta el cambio.
3. ¿Cuántas veces se ejecuta el `reduce` de `precioTotal` si nadie toca `productos`?
   → Una. Después usa el valor cacheado.
4. ¿Cuándo se ejecuta el `effect`?
   → Al crear el componente y cada vez que cambia una signal que lee dentro.
5. ¿Para qué sirve `track prod.id`?
   → Para que Angular identifique cada fila y solo añada o quite la que cambia.
