# 07 · Formularios reactivos en Ionic + Angular: Sistema de Gestión de Inventario Móvil

**Sesión:** 19-10-2026. Entrega: PDF con capturas.

Vista de **alta de productos** para operarios de almacén, con **Reactive Forms**, validadores personalizados,
un `Signal<boolean>` que bloquea el formulario y enseña el loader mientras guarda, y un `<ion-toast>` que
confirma el **guardado local** (Capacitor Preferences).

| Archivo | Qué es |
|---|---|
| `Dossier_Gestion_de_Formularios_Reactivos.pdf` | Enunciado y teoría del profe (el ejercicio está en la pág. 8) |
| `00-teoria-y-apuntes.md` | **Explicación** de Reactive Forms y del código, bloque a bloque (empieza por aquí) |
| `Entrega-Formularios-Reactivos-Inventario.pdf` | PDF que se entrega |
| `capturas/` | Capturas de la app en vista móvil (las del PDF) |
| `inventario-app/` | Proyecto Ionic 9 + Angular 22 standalone |

## Requisitos del ejercicio

| Nº | Requisito | Dónde |
|----|-----------|-------|
| 1 | Componente Ionic/Angular con Reactive Forms | `inventario-app/src/app/pages/nuevo-producto/` |
| 2 | SKU obligatorio, exactamente 12 alfanuméricos | `skuValidator(12)` en `src/app/validators/producto.validators.ts` |
| 2 | Nombre obligatorio | `Validators.required` + `noSoloEspaciosValidator` |
| 2 | Categoría en `<ion-select>` (Electrónica, Herramientas, Consumibles) | `CATEGORIAS` en `src/app/models/producto.model.ts` |
| 2 | Stock mínimo obligatorio, numérico (teclado numérico), > 0 | `type="number" inputmode="numeric"` + `enteroPositivoValidator` |
| 3 | Validadores personalizados | `src/app/validators/producto.validators.ts` (3) + tests en `.spec.ts` |
| 4 | Mensajes de error con `errorText` | `mensajeError(campo)` → `[errorText]` |
| 5 | `Signal<boolean>` que desactiva el form y muestra loader | `guardando` + `effect()` → `form.disable()`, spinner y barra de progreso |
| 5 | `<ion-toast>` confirmando el guardado local | `InventarioService` (Capacitor Preferences) + toast en la plantilla |

```bash
cd inventario-app
npm install
ionic serve     # http://localhost:8100/nuevo-producto
npm test        # 10 tests (validadores + app)
```
