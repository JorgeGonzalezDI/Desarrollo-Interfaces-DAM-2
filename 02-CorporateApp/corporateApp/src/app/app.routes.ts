import { Routes } from '@angular/router';

// Cada página se carga bajo demanda (lazy loading) con loadComponent():
// Angular genera un "chunk" JS independiente por página y solo lo descarga
// cuando el usuario navega a esa ruta.
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage),
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros.page').then((m) => m.NosotrosPage),
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then((m) => m.ContactoPage),
  },
];
