import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Tabla de rutas. loadComponent = carga perezosa (lazy loading): el código de cada
// página solo se descarga cuando se navega a ella... y solo si las guardas dejan pasar.
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'admin',
    // Las guardas se ejecutan en orden: 1º ¿hay sesión? 2º ¿el rol es 'admin'?
    canActivate: [authGuard, roleGuard('admin')],
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: 'user-dashboard',
    // Solo pide sesión: el admin también puede verla (rol con más permisos)
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user-dashboard/user-dashboard.page').then((m) => m.UserDashboardPage),
  },
  // Cualquier ruta desconocida vuelve al login (debe ir la última)
  { path: '**', redirectTo: 'login' },
];
