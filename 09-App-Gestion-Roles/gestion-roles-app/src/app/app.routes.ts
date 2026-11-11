import type { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

// Routes es un TIPO: "un array de reglas ruta → pantalla".
// Angular recorre el array de arriba abajo y usa la PRIMERA regla que encaje.
export const routes: Routes = [
  {
    path: 'login', // la URL /login
    // Carga perezosa: el código de LoginPage solo se descarga al entrar aquí.
    // import() devuelve una Promise; .then saca la clase LoginPage del archivo.
    loadComponent: () => import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'products',
    canActivate: [authGuard], // antes de entrar, se ejecuta authGuard; si no hay sesión, va a /login
    loadComponent: () => import('./pages/products/products.page').then((m) => m.ProductsPage),
  },
  {
    path: 'product-form', // sin id → crear
    canActivate: [authGuard, roleGuard], // primero hay sesión, luego hay que ser admin
    loadComponent: () => import('./pages/product-form/product-form.page').then((m) => m.ProductFormPage),
  },
  {
    path: 'product-form/:id', // con id → editar. ":id" es un parámetro: acepta cualquier valor
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('./pages/product-form/product-form.page').then((m) => m.ProductFormPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard], // sesión + rol admin
    loadComponent: () => import('./pages/admin/admin.page').then((m) => m.AdminPage),
  },
  {
    path: '', // la URL vacía (la raíz)
    redirectTo: 'products', // te manda a /products (y el guard decide si pasas)
    pathMatch: 'full', // solo si la URL es EXACTAMENTE vacía
  },
  {
    path: '**', // comodín: cualquier URL que no encajó antes
    redirectTo: 'products',
  },
];