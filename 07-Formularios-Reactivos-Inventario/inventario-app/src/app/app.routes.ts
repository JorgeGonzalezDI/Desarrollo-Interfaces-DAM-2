import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'nuevo-producto', pathMatch: 'full' },
  {
    path: 'nuevo-producto',
    loadComponent: () =>
      import('./pages/nuevo-producto/nuevo-producto.page').then((m) => m.NuevoProductoPage),
  },
  // Cualquier ruta desconocida vuelve al formulario (debe ir la última)
  { path: '**', redirectTo: 'nuevo-producto' },
];
