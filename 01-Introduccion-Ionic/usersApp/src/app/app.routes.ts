import { Routes } from '@angular/router';

// Tabla de rutas: qué página se enseña según la URL.
// Angular las recorre en orden y se queda con la PRIMERA que coincide.
export const routes: Routes = [
  {
    // URL vacía (http://localhost:8100/) → redirige a /users
    path: '',
    redirectTo: 'users',
    pathMatch: 'full', // solo cuando la URL está vacía del todo
  },
  {
    // /users → página de usuarios activos.
    // loadComponent = carga perezosa (lazy loading): el código de la página
    // se descarga solo la primera vez que se visita.
    path: 'users',
    loadComponent: () => import('./pages/users/users.page').then((m) => m.UsersPage),
  },
];
