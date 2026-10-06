# 03 · Actividad guiada — Ionic + Angular Standalone: consumo de API REST

App Ionic + Angular standalone que consume `https://dummyjson.com/products` con `HttpClient`
(Observables) y muestra los productos en una tabla.

- Proyecto: [`dam2-productos/`](dam2-productos)
- Flujo de ramas: se trabaja en `desarrollo` y, cuando está validado, se pasa a `main` (Vercel publica `main`).

## Estado (entrega parcial, se irá actualizando durante la semana)

| Nº | Petición | Estado |
|----|----------|--------|
| — | Base de la actividad guiada (modelo, servicio, rutas, inicio, tabla, estados carga/error) | Hecho |
| 1 | Dimensiones ancho y alto en la tabla | Hecho |
| 2 | Stock valorado (unidades × precio − descuento) | Hecho |
| 3 | Botón para regresar a inicio | Hecho |
| 4 | Página About con reseña y enlace a GitHub | Pendiente |
| 5 | Troubleshooting (2 ejemplos) | Hecho (en el PDF) |
| 6 | Paginación | Pendiente |
| 7 | Por qué existe `app.config.ts` | Hecho (en el PDF) |
| 8 | Flujo `desarrollo` → `main` y Vercel desde `main` | Hecho |
| 9 | Botón modo oscuro | Pendiente |
| 10 | Vista más visual que una tabla (cards/dashboard) | Pendiente |

## Ejecutar

```bash
cd dam2-productos
npm install
ionic serve
```
