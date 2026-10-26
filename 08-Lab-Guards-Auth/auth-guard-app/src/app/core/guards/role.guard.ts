import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * FACTORÍA de guardas (apartado 4.2): es una función que RECIBE el rol permitido
 * y DEVUELVE una guarda (CanActivateFn) configurada con ese rol.
 * Uso en las rutas: canActivate: [authGuard, roleGuard('admin')]
 * (En Java sería un método estático que devuelve una lambda que "recuerda" allowedRole.)
 */
export function roleGuard(allowedRole: string): CanActivateFn {
  return (route, state): boolean | UrlTree => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Sin sesión -> al login (por si la ruta usa roleGuard sin authGuard delante)
    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }

    // Rol correcto -> pasa
    if (authService.role() === allowedRole) {
      return true;
    }

    // Rol incorrecto (p. ej. un 'user' escribiendo /admin): se le manda a SU inicio
    // y se pasa la URL denegada para poder avisarle en pantalla.
    return router.createUrlTree([authService.rutaInicio(authService.role())], {
      queryParams: { denegado: state.url },
    });
  };
}
