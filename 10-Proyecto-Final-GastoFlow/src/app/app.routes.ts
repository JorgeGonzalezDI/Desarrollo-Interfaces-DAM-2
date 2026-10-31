import { Routes } from '@angular/router';

import { authGuard, guestGuard } from './core/auth/auth.guard';
import { cambiosSinGuardarGuard } from './core/auth/cambios-sin-guardar.guard';
import { permisoGuard } from './core/auth/permiso.guard';

/**
 * Tabla de rutas.
 *  - loadComponent = carga diferida (lazy loading): cada página es un fichero JS aparte
 *    que solo se descarga la primera vez que se visita.
 *  - canMatch = guards que deciden si la ruta "existe" para este usuario ANTES de descargar
 *    su código (ver core/auth/auth.guard.ts).
 *  - canDeactivate = pregunta antes de salir de un formulario con cambios sin guardar.
 *  - children: las páginas privadas se pintan DENTRO del shell (menú lateral).
 *
 *  Ruta                  Sesión  Permiso necesario     Roles que entran
 *  /login, /registro     no      -                     invitados
 *  /inicio, /ayuda       sí      -                     admin, empleado
 *  /gastos               sí      gastos:ver-propios    admin, empleado
 *  /gastos/nuevo         sí      gastos:crear          admin, empleado
 *  /admin/aprobaciones   sí      gastos:aprobar        admin
 *  /admin/dashboard      sí      dashboard:ver         admin
 */
export const routes: Routes = [
  {
    path: 'login',
    canMatch: [guestGuard],
    loadComponent: () => import('./features/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'registro',
    canMatch: [guestGuard],
    loadComponent: () => import('./features/auth/registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: '',
    canMatch: [authGuard], // toda la zona privada exige sesión
    loadComponent: () => import('./layout/shell/shell.component').then((m) => m.ShellComponent),
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      {
        path: 'inicio',
        loadComponent: () => import('./features/inicio/inicio.page').then((m) => m.InicioPage),
      },
      {
        path: 'gastos',
        canMatch: [permisoGuard('gastos:ver-propios')],
        loadComponent: () => import('./features/gastos/gastos.page').then((m) => m.GastosPage),
      },
      {
        path: 'gastos/nuevo',
        canMatch: [permisoGuard('gastos:crear')],
        canDeactivate: [cambiosSinGuardarGuard],
        loadComponent: () => import('./features/gastos/gasto-form/gasto-form.page').then((m) => m.GastoFormPage),
      },
      {
        path: 'admin/aprobaciones',
        canMatch: [permisoGuard('gastos:aprobar')],
        loadComponent: () =>
          import('./features/admin/aprobaciones/aprobaciones.page').then((m) => m.AprobacionesPage),
      },
      {
        path: 'admin/dashboard',
        canMatch: [permisoGuard('dashboard:ver')],
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'ayuda',
        loadComponent: () => import('./features/ayuda/ayuda.page').then((m) => m.AyudaPage),
      },
    ],
  },
  // Cualquier URL desconocida vuelve a la raíz (y de ahí al login o al inicio)
  { path: '**', redirectTo: '' },
];
