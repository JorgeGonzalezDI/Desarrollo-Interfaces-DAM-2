import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Guard FUNCIONAL de AUTENTICACIÓN (¿hay sesión?).
 *
 * Usa canMatch y no canActivate: canMatch se ejecuta mientras el router RECONOCE la URL,
 * antes de dar la ruta por buena. Si devuelve false, para el router esa ruta "no existe"
 * para este usuario; si devuelve un UrlTree, redirige. Así la zona privada (el shell y sus
 * hijas, todas con loadComponent) no se descarga ni se construye sin sesión.
 * (Con loadChildren, canActivate llegaría tarde: la configuración hija ya estaría descargada.)
 *
 *  - true    -> deja pasar.
 *  - UrlTree -> cancela y redirige a /login?returnUrl=<url pedida>.
 *
 * canMatch no recibe la URL completa: se reconstruye con los "segments" (trozos de la URL).
 */
export const authGuard: CanMatchFn = (_route, segments): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.haySesionValida()) {
    return true;
  }

  const urlPedida = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: urlPedida !== '/' ? { returnUrl: urlPedida } : {},
  });
};

/**
 * Guard "de invitado": la pantalla de login solo tiene sentido SIN sesión.
 * Si ya hay sesión, manda directamente al inicio.
 */
export const guestGuard: CanMatchFn = (): boolean | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.haySesionValida() ? router.createUrlTree(['/inicio']) : true;
};
