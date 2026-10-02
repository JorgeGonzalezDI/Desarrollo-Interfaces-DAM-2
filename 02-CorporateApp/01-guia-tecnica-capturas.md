# Guía técnica — capturas de la Tarea 02 (puntos 1 a 9)

Proyecto: `C:\DAM 2\Desarrollo de Interfaces\02-CorporateApp\corporateApp`

Guarda las capturas en `02-CorporateApp\capturas\` con el nombre indicado.
Para recortar una zona de la pantalla: **Win + Shift + S**.

---

## Paso 0 — Preparación

1. VS Code → *File → Open Folder* → `...\02-CorporateApp\corporateApp` (la carpeta del `package.json`).
2. Terminal integrada: **Ctrl + ñ** (PowerShell).
3. Instala dependencias (no venían copiadas):
   ```powershell
   npm install
   ```

---

## Captura 1 — Versiones → `01-versiones.png`

```powershell
node -v
ionic -v
ionic info
```
Captura la terminal con las tres salidas.

## Captura 2 — `ionic serve` → `02-serve.png`

```powershell
ionic serve
```
Cuando salga `Local: http://localhost:8100/`, captura la terminal. Déjalo corriendo.

> Si quieres enseñar el `ionic start`, ejecútalo en otra carpeta de prueba (p. ej. `C:\temp`):
> `ionic start corporateApp blank --type=angular --standalone`. El proyecto bueno es el de `02-CorporateApp`.

## Captura 3 — Estructura → `03-estructura.png`

En el explorador de VS Code despliega `src/app/pages`, `src/app/services`, `src/app/models`,
`src/assets/data` y `src/assets/images`. Captura el panel lateral.

## Captura 4 — Generar páginas → `04-generate.png`

Las páginas ya existen, así que para la foto abre una **segunda terminal** (icono **+** en el
panel de terminal) y genera una página de prueba:

```powershell
ionic generate page pages/prueba --standalone
```

Captura la salida (CREATE ...page.ts, .html, .scss) y luego borra la carpeta
`src/app/pages/prueba` para no ensuciar el proyecto.

## Captura 5 — Rutas → `05-rutas.png`

Abre `src/app/app.routes.ts` y captura el editor.

## Captura 6 — Home → `06-home.png`

Chrome → `http://localhost:8100/home` → **F12** → modo móvil (**Ctrl + Shift + M**) →
elige *Pixel 7* o similar. Captura la pantalla con el menú Productos / Nosotros / Contacto.

## Captura 7 — JSON → `07-json.png`

Abre `src/assets/data/products.json` y captura.

## Captura 8 — Servicio → `08-servicio.png`

Abre `src/app/services/products.service.ts`. Que se vea `@Injectable({ providedIn: 'root' })`
y `getProducts()`.

## Captura 9 — Componente → `09-productos-ts.png`

Abre `src/app/pages/productos/productos.page.ts`. Que se vea el `signal`, el
`constructor(private productService: ProductsService)` (inyección de dependencias) y `ngOnInit`.

## Captura 10 — Productos en el navegador → `10-productos.png`

En el navegador pulsa **Productos** en el menú. Debe salir la tabla con el Portátil Dell y el
Monitor LG, sus precios y fotos. Captura.

---

## Si algo falla

| Síntoma | Solución |
|---|---|
| `ionic` no se reconoce | `npm install -g @ionic/cli` |
| `The Angular CLI requires a minimum Node.js version` | Necesitas Node 24.15 o superior (tienes 24.19). |
| Puerto 8100 ocupado | Ctrl + C en el otro `ionic serve`, o `ionic serve --port 8101`. |
| La tabla de productos sale vacía | F12 → Console para ver el error; comprueba que existe `src/assets/data/products.json`. |
| No salen las fotos | Deben estar en `src/assets/images/` con el nombre exacto que pone el JSON. |
