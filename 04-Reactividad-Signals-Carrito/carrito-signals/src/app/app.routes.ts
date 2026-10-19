import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./carrito-signals/carrito-signals.component').then(m => m.CarritoSignalsComponent),
  },
];
