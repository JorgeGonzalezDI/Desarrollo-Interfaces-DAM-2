import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

/**
 * Guard FUNCIONAL de AUTENTICACIÓN (¿hay sesión?).
 *
 * Usa canMatch y no canActivate: canMatch se ejecuta mientras el router RECONOCE la URL,
 * antes de dar la ruta por buena. Si devuelve un UrlTree, redirige y la zona privada
 * (shell y páginas, todas con loadComponent) no se descarga ni se construye.
 *
 * Es async: primero espera a que AuthService haya recuperado la sesión guardada
 * (si no, un F5 en una página privada mandaría al login sin motivo).
 * canMatch no recibe la URL completa: se reconstruye con los "segments".
 */
export const authGuard: CanMatchFn = async (_route, segments): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.listo;
  if (auth.haySesionValida()) {
    return true;
  }
  // Había sesión pero el token caducó: se intenta renovar antes de echar al usuario
  if (auth.estaAutenticado() && (await auth.refrescarSesion())) {
    return true;
  }

  const urlPedida = '/' + segments.map((s) => s.path).join('/');
  return router.createUrlTree(['/login'], {
    queryParams: urlPedida !== '/' ? { returnUrl: urlPedida } : {},
  });
};

/**
 * Guard "de invitado": login y registro solo tienen sentido SIN sesión.
 * Si ya hay sesión, manda directamente al inicio.
 */
export const guestGuard: CanMatchFn = async (): Promise<boolean | UrlTree> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  await auth.listo;
  return auth.haySesionValida() ? router.createUrlTree(['/inicio']) : true;
};
