import { Routes } from '@angular/router';

export const routes: Routes = [
  // Entrar en "/" te lleva a /inicio. pathMatch 'full' = solo si la URL está VACÍA del todo
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // /inicio muestra InicioPage. loadComponent con import() la carga solo cuando se visita (lazy loading)
  {
    path: 'inicio',
    loadComponent: () => import('./pages/inicio/inicio.page').then((m) => m.InicioPage),
  },

  // /productos muestra ProductosPage
  {
    path: 'productos',
    loadComponent: () => import('./pages/productos/productos.page').then((m) => m.ProductosPage),
  },

  // /about muestra AboutPage (petición 4). Tiene que ir ANTES del comodín '**'
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
  },

  // Comodín: cualquier URL que no encaje arriba vuelve a /inicio. TIENE QUE IR LA ÚLTIMA
  { path: '**', redirectTo: 'inicio' },
];