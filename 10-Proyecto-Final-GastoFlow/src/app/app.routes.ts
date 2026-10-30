import { Routes } from '@angular/router';

// Tabla de rutas inicial (la de "ionic start blank"): solo la página home.
export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
