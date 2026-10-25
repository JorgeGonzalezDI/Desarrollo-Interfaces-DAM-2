import { Routes } from '@angular/router';

// RUTAS: relacionan una URL con una página.
// loadComponent + import() = lazy loading: cada página se descarga solo cuando se visita
// (Angular genera un "chunk" independiente por página y la app arranca más rápido).
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',   // la URL vacía lleva a /home
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)
  },
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then( m => m.ProductosPage)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/nosotros/nosotros.page').then( m => m.NosotrosPage)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contacto/contacto.page').then( m => m.ContactoPage)
  },
];
