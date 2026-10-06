import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage),
  },
  // Cualquier ruta desconocida vuelve a inicio (debe ir la última)
  { path: '**', redirectTo: 'inicio' },
];
