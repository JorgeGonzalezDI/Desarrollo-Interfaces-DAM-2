import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Guarda FUNCIONAL (Angular 16+): no es una clase, es una función que el router
 * ejecuta ANTES de cargar la página de la ruta.
 *  - Devuelve true      -> deja pasar.
 *  - Devuelve un UrlTree -> cancela esa navegación y redirige a otra URL.
 * inject() saca las dependencias del inyector sin necesitar constructor.
 */
export const authGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // El estado sale del signal, que a su vez se inicializó desde sessionStorage
  if (authService.isAuthenticated()) {
    return true;
  }

  // No hay sesión: a /login, recordando a dónde quería ir (?returnUrl=/admin)
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
