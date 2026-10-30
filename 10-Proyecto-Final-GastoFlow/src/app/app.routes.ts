import { Routes } from '@angular/router';

/**
 * Tabla de rutas.
 *  - loadComponent = carga diferida (lazy loading): el código de cada página es un
 *    fichero JS aparte que solo se descarga la primera vez que se visita.
 *  - children: las páginas privadas se pintan DENTRO del shell (menú lateral).
 */
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./features/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'gastos',
        loadComponent: () => import('./features/gastos/gastos.page').then((m) => m.GastosPage),
      },
      {
        path: 'admin/aprobaciones',
        loadComponent: () =>
          import('./features/admin/aprobaciones/aprobaciones.page').then((m) => m.AprobacionesPage),
      },
      {
        path: 'admin/dashboard',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'ayuda',
        loadComponent: () => import('./features/ayuda/ayuda.page').then((m) => m.AyudaPage),
      },
    ],
  },
  // Cualquier URL desconocida vuelve al inicio (debe ir la última)
  { path: '**', redirectTo: '' },
];
