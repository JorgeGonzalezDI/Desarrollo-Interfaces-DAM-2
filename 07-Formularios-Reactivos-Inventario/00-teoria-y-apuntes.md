# 07 · Formularios reactivos en Ionic + Angular: alta de productos de inventario (19-10-2026)

## Dónde está la teoría

| Qué | Dónde |
|---|---|
| Dossier del profe | `Dossier_Gestion_de_Formularios_Reactivos.pdf` (en esta carpeta, 8 págs.) |
| · Qué es un formulario y por qué importa en móvil | Dossier, pág. 1 (§1.1) |
| · Template-Driven vs Reactive Forms (tabla) | Dossier, pág. 2 (§1.2) |
| · Formularios en Ionic: `ion-input`, teclado, `inputmode`, errores | Dossier, pág. 3 (§1.3) |
| · A dónde van los datos: local (Preferences / SQLite) o API REST | Dossier, pág. 3 (§1.4) |
| · Ejemplo de registro de usuarios: `.ts` | Dossier, págs. 4–5 |
| · Ejemplo de registro de usuarios: `.html` | Dossier, págs. 6–7 |
| · **El ejercicio (inventario)** | Dossier, pág. 8 |
| Signals (`signal`, `set`, `computed`) | `../04-Reactividad-Signals-Carrito/00-teoria-y-apuntes.md` |
| Servicio con estado privado y solo lectura (patrón Store) | `../05-Lab-Reactividad-TechTicket/00-teoria-y-apuntes.md` → "El servicio, bloque a bloque" |
| Tu guía de estudio | `00-Apuntes/01-guia-de-estudio-desde-cero.md` → §3.10 (`async/await`), §5.3 (data binding; en el 4) está `[(ngModel)]`, que es lo "otro" tipo de formulario), §5.4 (`@if` / `@for`), §5.6 (signals), §5.9 (servicios e `inject`) |

**Carpeta:** `C:\DAM 2\Desarrollo de Interfaces\07-Formularios-Reactivos-Inventario\`

| Archivo | Qué es |
|---|---|
| `Dossier_Gestion_de_Formularios_Reactivos.pdf` | Enunciado y teoría del profe |
| `00-teoria-y-apuntes.md` | Este fichero (empieza por aquí) |
| `Entrega-Formularios-Reactivos-Inventario.pdf` | PDF que se entrega (3 págs.) |
| `capturas/` | Las 8 capturas del PDF (vista móvil) |
| `inventario-app/` | El proyecto Ionic + Angular 22 |

Dentro del proyecto, lo que he escrito yo (lo demás es la plantilla de Ionic, igual que en `dam2-productos`):

| Fichero | Para qué |
|---|---|
| `src/app/models/producto.model.ts` | Las 3 categorías y la forma de un producto |
| `src/app/validators/producto.validators.ts` | Los 3 validadores personalizados |
| `src/app/validators/producto.validators.spec.ts` | Los tests de esos validadores |
| `src/app/services/inventario.service.ts` | "Petición" simulada + guardado en el dispositivo |
| `src/app/pages/nuevo-producto/nuevo-producto.page.ts` | El formulario y la lógica |
| `src/app/pages/nuevo-producto/nuevo-producto.page.html` | La plantilla con los componentes de Ionic |
| `src/app/pages/nuevo-producto/nuevo-producto.page.scss` | Cuatro estilos |
| `src/app/app.routes.ts` | `''` → `nuevo-producto` |

---

## La idea en 3 líneas

- Un **formulario reactivo** se define **entero en TypeScript**: qué campos hay, su valor inicial y sus reglas (validadores). El HTML solo dice "este `ion-input` es el campo `sku`".
- Angular lleva la cuenta de **cómo está cada campo** en todo momento: si es válido, si el usuario ya lo ha tocado, si está desactivado… Ionic lee eso y pinta el campo en rojo con su mensaje.
- Al pulsar Guardar: si hay errores, se enseñan todos; si no, un **signal** `guardando` bloquea el formulario y enseña el loader, se guarda en el móvil y sale un **toast** de confirmación.

```
operario escribe ──► FormControl (valor + validadores) ──► ¿errores?
                                                            │
             ┌──────────────── no ───────────────────────────┴──── sí ────────────┐
             ▼                                                                    ▼
  guardar() ─► guardando.set(true) ─► effect: form.disable()        mensajeError(campo) ─► [errorText]
             │                        plantilla: spinner + barra     (Ionic lo enseña si está
             ▼                                                        ion-invalid + ion-touched)
  inventario.guardar() ─► espera 1,5 s ─► Preferences.set(JSON)
             │
             ▼
  form.reset() ─► toast verde ─► guardando.set(false) ─► effect: form.enable()
```

---

## 1. Los dos tipos de formulario (dossier pág. 2)

Ya has usado el otro tipo sin saberlo: en el Contacto de la Corporate App ponías `[(ngModel)]="nombre"` en cada `ion-input`. Eso es un formulario **Template-Driven** (basado en plantilla): la lógica vive en el HTML.

| | Template-Driven (`[(ngModel)]`) | Reactive Forms (`formControlName`) |
|---|---|---|
| Dónde se define | En el HTML | En el `.ts` |
| Módulo que importas | `FormsModule` | `ReactiveFormsModule` |
| Validaciones | Atributos HTML (`required`, `minlength`…) | Funciones (`Validators.required`, las tuyas…) |
| Para qué | 2–3 campos sencillos | Lo que sea serio (es lo que se usa en empresa) |
| Tests | Necesitas pintar la página | Pruebas la lógica sin pintar nada (ver §8) |

El profe quiere **Reactive Forms**.

---

## 2. Las piezas de Reactive Forms

| Pieza | Qué es | En tu código |
|---|---|---|
| `FormControl` | **Un campo**: guarda su valor, sus validadores y su estado | cada uno de `sku`, `nombre`, `categoria`, `stockMinimo` |
| `FormGroup` | **Un grupo de campos** (el formulario entero) | `form` |
| `FormBuilder` | Un atajo para crear los dos de arriba sin escribir `new FormControl(...)` cada vez | `this.fb.group({...})` |
| `Validators` | Validadores que trae Angular: `required`, `minLength`, `maxLength`, `email`, `pattern`, `min`… | `Validators.required`, `Validators.maxLength(60)` |
| Validador propio | Una función tuya con la misma forma | `skuValidator(12)`, `noSoloEspaciosValidator`, `enteroPositivoValidator` |

### Los estados de un campo (esto es lo que hace que salgan o no los errores)

| Propiedad | Significa | Clase que pone Angular | Clase que pone Ionic |
|---|---|---|---|
| `valid` / `invalid` | Cumple / no cumple sus validadores | `ng-valid` / `ng-invalid` | `ion-valid` / `ion-invalid` |
| `touched` / `untouched` | El usuario ha entrado y salido del campo (blur) / todavía no | `ng-touched` | `ion-touched` |
| `dirty` / `pristine` | El usuario ha cambiado el valor / sigue el original | `ng-dirty` | `ion-dirty` |
| `disabled` | Desactivado: no se puede escribir y **no cuenta** en `.value` | — | atributo `disabled` |

**Regla de Ionic:** el `errorText` de un `ion-input` / `ion-select` solo se ve cuando el campo tiene **a la vez** `ion-invalid` e `ion-touched`. Por eso al abrir la página no sale todo en rojo (aún no has tocado nada), y por eso `markAllAsTouched()` hace que salgan todos de golpe.

---

## 3. El modelo: `models/producto.model.ts`

```ts
export const CATEGORIAS = ['Electrónica', 'Herramientas', 'Consumibles'] as const;
export type Categoria = (typeof CATEGORIAS)[number];
```
- `CATEGORIAS` es el array que recorre el `@for` del `ion-select` → si mañana hay otra categoría, solo la añades aquí.
- `as const` le dice a TypeScript "estos tres textos exactos, no un `string` cualquiera".
- `Categoria` es un tipo que **solo** admite `'Electrónica' | 'Herramientas' | 'Consumibles'`. Se saca del array para no escribirlo dos veces.

```ts
export interface NuevoProducto { sku: string; nombre: string; categoria: Categoria; stockMinimo: number; }
export interface Producto extends NuevoProducto { id: string; fechaAlta: string; }
```
- `NuevoProducto` = lo que rellena el operario. `Producto` = eso **más** lo que añade la app al guardar (`extends` = "todo lo de la otra interfaz y además…").

---

## 4. Los validadores personalizados: `validators/producto.validators.ts`

Un validador es **una función que recibe el campo y devuelve `null` si está bien, o un objeto con el error si está mal**. El nombre de la clave del objeto lo eliges tú (`skuCaracteres`, `soloEspacios`…) y luego lo lees para elegir el mensaje.

Todos empiezan igual: **si el campo está vacío, devuelven `null`**. El "está vacío" ya lo avisa `Validators.required`; si no, saldrían dos errores a la vez para lo mismo.

### 4.1 `skuValidator(longitud)` — una *fábrica* de validadores

```ts
export function skuValidator(longitud: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = control.value ?? '';
    if (valor === '') return null;
    if (!/^[A-Za-z0-9]+$/.test(valor)) return { skuCaracteres: true };
    if (valor.length !== longitud)     return { skuLongitud: { requerida: longitud, actual: valor.length } };
    return null;
  };
}
```
- Es una función que **devuelve otra función** (el validador de verdad). Así puedes pasarle el número: `skuValidator(12)`. Es exactamente como funciona `Validators.minLength(3)`.
- `control.value ?? ''` → si el valor es `null` o `undefined`, usa `''` (el operador `??`).
- `/^[A-Za-z0-9]+$/` es una **expresión regular**: `^` principio, `[A-Za-z0-9]` una letra o número, `+` una o más veces, `$` final. O sea: "solo letras y números de principio a fin". `.test(valor)` devuelve `true`/`false`.
- El error de longitud **lleva datos** (`requerida` y `actual`) para que el mensaje pueda decir "llevas 6".
- ¿Por qué no `Validators.pattern(/^[A-Za-z0-9]{12}$/)`? Funcionaría, pero solo dice "patrón incorrecto": no sabrías si falla por un símbolo o por la longitud, y el mensaje sería peor.

### 4.2 `noSoloEspaciosValidator` — validador directo

```ts
export const noSoloEspaciosValidator: ValidatorFn = (control) => {
  const valor = control.value;
  if (typeof valor === 'string' && valor.length > 0 && valor.trim().length === 0) return { soloEspacios: true };
  return null;
};
```
- No tiene parámetros, así que se usa **sin paréntesis**: `noSoloEspaciosValidator` (igual que `Validators.required`).
- `Validators.required` da por bueno `"   "` (tres espacios no es "vacío"). `.trim()` quita los espacios de los lados: si después no queda nada, es un nombre falso.

### 4.3 `enteroPositivoValidator`

```ts
const numero = Number(valor);
if (Number.isNaN(numero))      return { noNumerico: true };
if (numero <= 0)               return { noPositivo: true };
if (!Number.isInteger(numero)) return { noEntero: true };
```
- El enunciado pide "mayor que 0". `Validators.min(1)` dejaría pasar `2.5`, y en un almacén no hay media unidad: por eso un validador propio.
- El orden importa: `-2.5` da "mayor que 0", que es lo más útil de decir primero.

---

## 5. La página: `pages/nuevo-producto/nuevo-producto.page.ts`

### 5.1 Imports del componente

```ts
imports: [ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonProgressBar, IonContent, IonList, ..., IonToast],
```
- `ReactiveFormsModule` es lo que hace que funcionen `[formGroup]` y `formControlName` en el HTML. **Si se te olvida**, error: *Can't bind to 'formGroup' since it isn't a known property of 'form'*.
- Cada componente de Ionic que usas en la plantilla se importa uno a uno desde `'@ionic/angular'` (standalone). El dossier importa `IonicModule` entero: eso es la forma antigua; con tu versión (Ionic 9 standalone) se hace así.

### 5.2 Las dependencias

```ts
private readonly fb = inject(FormBuilder);
protected readonly inventario = inject(InventarioService);
```
Lo mismo que en la 05: se piden con `inject()` en vez de hacer `new`. El dossier lo hace con `constructor(private fb: FormBuilder)`; son dos formas de lo mismo.
`inventario` es `protected` (no `private`) porque **la plantilla** lo usa para pintar la lista de guardados.

### 5.3 El formulario

```ts
protected readonly form = this.fb.nonNullable.group({
  sku:         ['',   [Validators.required, skuValidator(12)]],
  nombre:      ['',   [Validators.required, noSoloEspaciosValidator, Validators.maxLength(60)]],
  categoria:   ['' as Categoria | '', Validators.required],
  stockMinimo: [null as number | null, [Validators.required, enteroPositivoValidator]],
});
```
- Cada línea: `nombreDelCampo: [valorInicial, validadores]`. Si hay varios validadores van en un array; si hay uno, puede ir solo.
- `nonNullable` → al hacer `form.reset()` cada campo vuelve a **su valor inicial** (`''`), no a `null`. Así `datos.sku` siempre es `string` y TypeScript no se queja al hacer `.toUpperCase()`.
- `'' as Categoria | ''` → le dice a TypeScript que ese campo puede valer una categoría o vacío (al principio no hay ninguna elegida).
- `null as number | null` → el stock empieza vacío, no en 0 (si empezara en 0 el operario vería un 0 que no ha escrito).
- Los nombres de aquí (`sku`, `stockMinimo`…) son los que pones en `formControlName="..."` en el HTML. **Tienen que coincidir exactamente.**

### 5.4 El estado con signals

```ts
protected readonly guardando    = signal<boolean>(false);
protected readonly toastAbierto = signal<boolean>(false);
protected readonly toastMensaje = signal<string>('');
protected readonly toastColor   = signal<'success' | 'danger'>('success');
```
`guardando` es el `Signal<boolean>` que pide el enunciado. Los otros tres controlan el `<ion-toast>`.

### 5.5 El constructor: iconos y el `effect`

```ts
addIcons({ barcodeOutline, pricetagOutline, ... });
```
En standalone, los iconos de Ionicons hay que **registrarlos** antes de usarlos con `name="barcode-outline"` (el nombre con guiones sale del nombre en camelCase). Si no, el icono sale en blanco.

```ts
effect(() => {
  if (this.guardando()) this.form.disable();
  else this.form.enable();
});
```
- Un `effect` es código que **se vuelve a ejecutar solo cada vez que cambia un signal que lee**. Este lee `guardando()`, así que cada vez que hagas `guardando.set(...)` se ejecuta.
- Resultado: no tienes que acordarte de desactivar y reactivar el formulario a mano en cada sitio. **El signal manda** y el formulario le sigue.
- `form.disable()` desactiva todos los campos a la vez (Ionic les pone el atributo `disabled` y salen en gris).

### 5.6 `guardar()` — lo que pasa al pulsar el botón

```ts
protected async guardar(): Promise<void> {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.abrirToast('Revisa los campos marcados en rojo.', 'danger');
    return;
  }
```
- Si algo está mal, `markAllAsTouched()` marca todos los campos como "tocados" → Ionic enseña **todos** los mensajes de error de golpe. Y `return` corta: no se guarda nada.

```ts
  const datos = this.form.getRawValue();
  this.guardando.set(true);
```
- **Primero** se leen los datos y **después** se activa `guardando`. ¿Por qué? Porque un formulario desactivado **no** devuelve sus campos en `.value`. `getRawValue()` los devuelve siempre, pero así queda claro el orden.
- `guardando.set(true)` → el `effect` desactiva el form, y la plantilla enseña spinner y barra de progreso.

```ts
  try {
    const producto = await this.inventario.guardar({
      sku: datos.sku.toUpperCase(),
      nombre: datos.nombre.trim(),
      categoria: datos.categoria as Categoria,
      stockMinimo: Number(datos.stockMinimo),
    });
    this.form.reset();
    this.abrirToast(`"${producto.nombre}" guardado en el dispositivo.`, 'success');
  } catch (error) {
    this.abrirToast('No se pudo guardar el producto. Inténtalo de nuevo.', 'danger');
  } finally {
    this.guardando.set(false);
  }
}
```
- `await` espera a que el servicio termine (1,5 s). Aquí sí se usa `async/await` porque `Preferences` devuelve **Promesas**, no Observables (al revés que `HttpClient`, guía §15.3).
- Antes de guardar se **limpian los datos**: SKU en mayúsculas, nombre sin espacios a los lados, stock como número.
- `form.reset()` vacía los campos **y** quita el "tocado", así no salen errores en el formulario vacío.
- `try / catch / finally`: `try` = lo normal; `catch` = si algo falla; `finally` = **se ejecuta siempre**, falle o no. Por eso `guardando.set(false)` va ahí: pase lo que pase, el formulario se reactiva. Si lo pusieras dentro del `try` y fallara el guardado, el formulario se quedaría bloqueado para siempre.

### 5.7 `mensajeError(campo)` — el texto de cada error

```ts
protected mensajeError(campo: Campo): string {
  const errores = this.form.controls[campo].errors;
  if (!errores) return '';
  switch (campo) {
    case 'sku':
      if (errores['required']) return 'El código de barras es obligatorio.';
      if (errores['skuCaracteres']) return 'Solo letras y números, sin espacios ni símbolos.';
      if (errores['skuLongitud']) {
        const { requerida, actual } = errores['skuLongitud'];
        return `Debe tener exactamente ${requerida} caracteres (llevas ${actual}).`;
      }
      break;
    ...
```
- `this.form.controls[campo].errors` es el objeto que devolvieron los validadores, juntos. Por ejemplo `{ skuLongitud: { requerida: 12, actual: 6 } }`, o `null` si no hay errores.
- `errores['required']` → los errores de Angular se leen con corchetes (por cómo está configurado TypeScript en el proyecto).
- `const { requerida, actual } = ...` es **desestructuración**: saca dos propiedades a dos variables de una vez.
- `type Campo = 'sku' | 'nombre' | 'categoria' | 'stockMinimo'` (arriba del todo) hace que si escribes `mensajeError('skuu')` el editor te avise.
- El dossier escribe el `errorText` fijo en el HTML (`[errorText]="'El nombre es obligatorio…'"`). Aquí el mensaje **cambia según el error**, que es lo que pide el punto 4 del ejercicio ("mensajes de error claros").

---

## 6. La plantilla: `nuevo-producto.page.html`

### 6.1 Enlazar el formulario

```html
<form [formGroup]="form" (ngSubmit)="guardar()" [attr.aria-busy]="guardando()" novalidate>
```
- `[formGroup]="form"` → property binding: "este `<form>` es el `form` del `.ts`".
- `(ngSubmit)="guardar()"` → event binding: al enviar, llama a `guardar()`.
- `[attr.aria-busy]` → le dice al lector de pantalla que el formulario está ocupado mientras guarda (accesibilidad, RA 4).
- `novalidate` → apaga las burbujas de validación del navegador; las validaciones son las nuestras.

### 6.2 Un campo de texto

```html
<ion-item>
  <ion-icon slot="start" name="barcode-outline" aria-hidden="true"></ion-icon>
  <ion-input
    label="Código de barras (SKU) *" labelPlacement="floating"
    type="text" inputmode="text" autocapitalize="characters" autocomplete="off" enterkeyhint="next"
    [maxlength]="12" [counter]="true" helperText="12 letras o números"
    formControlName="sku"
    [errorText]="mensajeError('sku')">
  </ion-input>
</ion-item>
```
| Atributo | Para qué |
|---|---|
| `label` + `labelPlacement="floating"` | La etiqueta va dentro del campo y "sube" al escribir. Además es la etiqueta accesible (el lector de pantalla la lee) |
| `slot="start"` en el icono | Lo coloca a la izquierda del `ion-item`. `aria-hidden` = el lector de pantalla lo ignora (es decoración) |
| `inputmode` | **Qué teclado saca el móvil**: `text`, `numeric`, `email`, `tel`… (dossier §1.3) |
| `autocapitalize="characters"` | En el móvil el teclado sale en mayúsculas (los SKU suelen ir así) |
| `enterkeyhint="next"` / `"done"` | Qué pone en la tecla Intro del teclado del móvil |
| `[maxlength]="12"` + `[counter]="true"` | No deja escribir más de 12 y enseña el contador `6 / 12` |
| `helperText` | Ayuda en gris debajo, cuando no hay error |
| `formControlName="sku"` | **Lo que conecta** este input con el campo `sku` del `.ts` |
| `[errorText]` | El mensaje rojo. Se ve solo con `ion-invalid` + `ion-touched` (§2) |

### 6.3 El desplegable

```html
<ion-select label="Categoría *" labelPlacement="floating" interface="action-sheet" cancelText="Cancelar"
            formControlName="categoria" [errorText]="mensajeError('categoria')">
  @for (categoria of categorias; track categoria) {
    <ion-select-option [value]="categoria">{{ categoria }}</ion-select-option>
  }
</ion-select>
```
- `interface="action-sheet"` → las opciones salen en una hoja desde abajo (cómoda con el pulgar). Otras opciones: `alert` (la de por defecto) o `popover`.
- El `@for` recorre `CATEGORIAS` del modelo. `track categoria` le dice a Angular cómo distinguir cada opción (guía §5.4).

### 6.4 El número

```html
<ion-input label="Stock mínimo *" labelPlacement="floating" type="number" inputmode="numeric" min="1" step="1" ...
           formControlName="stockMinimo" [errorText]="mensajeError('stockMinimo')">
```
- `type="number"` → Ionic convierte lo que escribes en **número** (si lo dejas vacío, da `null`).
- `inputmode="numeric"` → el móvil saca el **teclado numérico** (es lo que pide el enunciado). `type="number"` solo no basta en todos los móviles.

### 6.5 El botón con loader

```html
<ion-button expand="block" type="submit" [disabled]="guardando()">
  @if (guardando()) {
    <ion-spinner slot="start" name="crescent" aria-hidden="true"></ion-spinner>
    Guardando…
  } @else {
    <ion-icon slot="start" name="save-outline" aria-hidden="true"></ion-icon>
    Guardar producto
  }
</ion-button>
```
- `type="submit"` → al pulsarlo se dispara el `(ngSubmit)` del `<form>`.
- `[disabled]="guardando()"` → solo se bloquea **mientras guarda** (para que no lo pulsen dos veces).
- **Diferencia con el dossier:** allí es `[disabled]="registroForm.invalid || isSubmitting()"`. Con eso, si el formulario es inválido el botón no se puede pulsar… y entonces el `markAllAsTouched()` de su `onSubmit()` nunca se ejecuta (código muerto). Aquí el botón está activo, y al pulsarlo con errores salen todos marcados.
- `@if` / `@else` es la sintaxis nueva; el dossier usa `*ngIf`, que es la antigua (y necesitaría importar `CommonModule`).

### 6.6 La barra de progreso

```html
<ion-toolbar color="primary">
  <ion-title>Nuevo producto</ion-title>
  @if (guardando()) { <ion-progress-bar type="indeterminate" color="light"></ion-progress-bar> }
</ion-toolbar>
```
`indeterminate` = la barra va y viene sin porcentaje (no sabemos cuánto falta).

### 6.7 La lista de guardados

```html
@for (producto of inventario.productos(); track producto.id) { <ion-item>…</ion-item> }
@empty { <ion-item lines="none"><ion-note>Todavía no hay productos guardados.</ion-note></ion-item> }
```
- `inventario.productos()` es un signal del servicio: cuando se guarda uno nuevo, la lista se repinta sola.
- `@empty` = lo que se ve si el array está vacío.
- No lo pedía el enunciado, pero sirve para **demostrar** que el guardado local funciona (y que sigue ahí tras recargar).

### 6.8 El toast

```html
<ion-toast [isOpen]="toastAbierto()" [message]="toastMensaje()" [color]="toastColor()"
           [icon]="toastColor() === 'success' ? 'checkmark-circle-outline' : 'alert-circle-outline'"
           [duration]="2500" position="bottom" (didDismiss)="toastAbierto.set(false)">
</ion-toast>
```
- Es el **toast en línea** (dentro de la plantilla), como pide el enunciado (`<ion-toast>`). La otra forma es `ToastController` desde el `.ts`.
- `[isOpen]` → se abre cuando el signal está a `true`. `[duration]="2500"` → se cierra solo a los 2,5 s.
- `(didDismiss)` → cuando se ha cerrado, el signal vuelve a `false`. **Si no lo pones**, el signal se queda en `true` y el siguiente `set(true)` no cambia nada → el toast no vuelve a salir.
- `condición ? a : b` es el operador ternario: "si es éxito, este icono; si no, este otro".

---

## 7. El servicio: `services/inventario.service.ts` (dossier §1.4, pág. 3)

El dossier dice que los datos pueden ir a **local** (Offline First) o a una **API REST**. El enunciado pide "simular una petición de guardado" y "confirmar el guardado local", así que: espera simulada + guardado en el dispositivo.

```ts
private readonly _productos = signal<Producto[]>([]);
readonly productos = this._productos.asReadonly();
```
El mismo truco que el Store de la 05: el signal con `.set()` es **privado**, y fuera solo se ve una versión de **solo lectura**. La página puede leer la lista, pero no cambiarla por su cuenta.

```ts
async guardar(datos: NuevoProducto): Promise<Producto> {
  await esperar(LATENCIA_MS);                              // simula la petición (1,5 s)
  const producto: Producto = { ...datos, id: `${Date.now()}`, fechaAlta: new Date().toISOString() };
  const lista = [producto, ...this._productos()];          // el nuevo, el primero
  await Preferences.set({ key: CLAVE, value: JSON.stringify(lista) });
  this._productos.set(lista);
  return producto;
}
```
- `{ ...datos, id, fechaAlta }` → **spread**: copia todo lo de `datos` y añade dos campos.
- `Date.now()` son los milisegundos desde 1970: sirve de id único sencillo.
- **Capacitor Preferences** es un almacén **clave → texto**:
  - en Android → `SharedPreferences`; en iOS → `UserDefaults`; en el navegador (`ionic serve`) → `localStorage` (lo puedes ver en F12 → Application → Local Storage, clave `CapacitorStorage.inventario.productos`).
  - Como solo guarda texto, la lista se pasa a JSON con `JSON.stringify` al guardar y se recupera con `JSON.parse` al cargar.
- `cargar()` se llama en el constructor: al abrir la app lee lo que hubiera guardado → por eso la lista sobrevive a recargar.
- Para datos más grandes o con relaciones, el dossier menciona **Capacitor SQLite**.

Para instalarlo en un proyecto nuevo: `npm install @capacitor/preferences` (necesita `@capacitor/core`; aquí ya están los dos en `package.json`).

---

## 8. Los tests: `validators/producto.validators.spec.ts`

La tabla del dossier dice que los Reactive Forms se testean fácil "sin el DOM". Esto es lo que significa:

```ts
const errores = new FormControl('ABC123', skuValidator(12)).errors;
expect(errores).toEqual({ skuLongitud: { requerida: 12, actual: 6 } });
```
Creas un campo suelto con un valor y su validador, y miras los errores. **No hace falta abrir la app ni pintar nada.**

```bash
npm test        # o: ng test --watch=false  →  10 tests OK
```

---

## 9. Diferencias con el código del dossier (por tu versión de Angular/Ionic)

| Dossier | Aquí | Por qué |
|---|---|---|
| `imports: [IonicModule, CommonModule, ...]` | Cada componente desde `'@ionic/angular'` | Ionic 9 standalone (igual que tus prácticas anteriores) |
| `constructor(private fb: FormBuilder)` | `inject(FormBuilder)` | Las dos valen; `inject` es lo que usas desde la 05 |
| `*ngIf` | `@if` / `@else` | Sintaxis nueva, sin `CommonModule` |
| `public registroForm: FormGroup;` | `fb.nonNullable.group(...)` | Formulario **tipado**: TypeScript sabe que `sku` es `string` |
| `[disabled]="form.invalid \|\| isSubmitting()"` | `[disabled]="guardando()"` | Para que `markAllAsTouched()` sirva (§6.5) |
| `errorText` fijo en el HTML | `mensajeError(campo)` | Un mensaje distinto según el error |
| Envío simulado en el componente | En el servicio | La página solo pinta; el servicio guarda (SRP, como la 05) |

---

## 10. Errores típicos

| Te pasa esto | Es por esto |
|---|---|
| *Can't bind to 'formGroup' since it isn't a known property of 'form'* | Falta `ReactiveFormsModule` en `imports` del componente |
| *Cannot find control with name: 'skus'* | El `formControlName` del HTML no coincide con el nombre del `.ts` |
| El `errorText` no sale nunca | El campo no está "tocado" (sal del campo o llama a `markAllAsTouched()`), o el texto está vacío |
| Salen todos los errores en rojo nada más abrir | Estás llamando a `markAllAsTouched()` al iniciar, o el validador no devuelve `null` con el campo vacío |
| `form.value` no trae los campos | El form está desactivado: usa `getRawValue()` |
| El toast sale una vez y luego nunca más | Falta `(didDismiss)="toastAbierto.set(false)"` |
| El icono sale vacío | No está registrado en `addIcons({...})` |
| El formulario se queda bloqueado si falla el guardado | `guardando.set(false)` tiene que ir en `finally`, no en el `try` |

---

## 11. Preguntas de repaso (con respuesta)

1. **¿Qué diferencia hay entre `[(ngModel)]` y `formControlName`?** El primero es Template-Driven (la lógica en el HTML, con `FormsModule`); el segundo es Reactive (el formulario se define en el `.ts`, con `ReactiveFormsModule`).
2. **¿Qué devuelve un validador?** `null` si el valor es correcto, o un objeto con el error (`{ nombreDelError: true }` o con datos).
3. **¿Por qué los validadores propios devuelven `null` si el campo está vacío?** Porque de eso se encarga `Validators.required`; si no, saldrían dos errores por lo mismo.
4. **¿Cuándo enseña Ionic el `errorText`?** Cuando el campo tiene `ion-invalid` y `ion-touched` a la vez.
5. **¿Para qué sirve `markAllAsTouched()`?** Para marcar todos los campos como tocados y que se vean todos los errores de golpe al intentar enviar.
6. **¿Qué hace `inputmode="numeric"`?** Que el móvil saque el teclado numérico.
7. **¿Por qué `guardando.set(false)` va en `finally`?** Porque `finally` se ejecuta siempre: si el guardado falla, el formulario también se reactiva.
8. **¿Qué hace el `effect` del constructor?** Se vuelve a ejecutar cada vez que cambia `guardando`, y desactiva o activa el formulario según su valor.
9. **¿Dónde guarda Capacitor Preferences en el navegador? ¿Y en Android?** En `localStorage`; en Android, en `SharedPreferences`.
10. **¿Por qué se usa `async/await` con Preferences y no con `HttpClient`?** Porque Preferences devuelve Promesas y `HttpClient` devuelve Observables (guía §15.3).

---

## Ejecutar

```bash
cd inventario-app
npm install
ionic serve      # http://localhost:8100/nuevo-producto
npm test         # tests de los validadores
```
Para verlo como en el móvil: F12 → icono de móvil (Ctrl + Shift + M).

---

## Rehazlo tú desde cero (cuando vuelvas a esta práctica)

**Antes, tener leído:** guía de estudio §5 entera (sobre todo §5.3 data binding, §5.4 `@if`/`@for`, §5.6 signals, §5.9 servicios) y los apuntes de la 04 (signals). Luego lee de este fichero §1 y §2 (qué es un formulario reactivo).

La solución buena está en `inventario-app/`: **no la toques**. Haz la tuya al lado, en `07-Formularios-Reactivos-Inventario/inventario-mio/`, y compara solo cuando te atasques.

| Paso | Qué haces | Comando / fichero | Si te atascas |
|---|---|---|---|
| 1 | Crear el proyecto (sin git, que ya estás dentro del repo) | `ionic start inventario-mio blank --type=angular-standalone --no-git` | — |
| 2 | Instalar el guardado local | `cd inventario-mio` → `npm install @capacitor/preferences` | §7 |
| 3 | Generar la página | `ionic g page pages/nuevo-producto` y en `app.routes.ts` que `''` redirija a `nuevo-producto` | guía §5.8 |
| 4 | El modelo | `src/app/models/producto.model.ts`: `CATEGORIAS`, tipo `Categoria`, interfaces | §3 |
| 5 | Formulario mínimo **sin** validaciones: 4 `ion-input`/`ion-select` con `formControlName`, botón submit que hace `console.log(this.form.value)` | `.page.ts` + `.page.html` (acuérdate de `ReactiveFormsModule`) | §5.1, §5.3, §6.1–6.4 |
| 6 | Validaciones de Angular (`Validators.required`, `maxLength`) y `errorText` fijo | `.page.ts` | §2 (estados), §6.2 |
| 7 | Tus 3 validadores personalizados | `src/app/validators/producto.validators.ts` | §4 |
| 8 | `mensajeError(campo)` para que el mensaje dependa del error | `.page.ts` | §5.7 |
| 9 | El servicio con espera simulada + `Preferences` | `src/app/services/inventario.service.ts` | §7 |
| 10 | Signal `guardando`, `effect` que desactiva el form, spinner en el botón | `.page.ts` + `.page.html` | §5.4–5.6, §6.5 |
| 11 | `<ion-toast>` con signals | `.page.html` | §6.8 |
| 12 | Probar: enviar vacío, SKU corto, stock 0, guardar, recargar | `ionic serve` + F12 → Ctrl+Shift+M | §10 (errores típicos) |

Prueba de que lo has entendido: responder sin mirar las **preguntas de repaso** (§11).
