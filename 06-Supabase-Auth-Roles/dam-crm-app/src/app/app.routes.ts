import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'home',
    canActivate: [authGuard], // sin sesión → /login
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  // Cualquier ruta desconocida vuelve a home (debe ir la última)
  { path: '**', redirectTo: 'home' },
];
