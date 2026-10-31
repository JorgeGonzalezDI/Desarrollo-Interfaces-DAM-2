import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';

import { Permiso } from '../models/rol.model';
import { AuthService } from './auth.service';

/**
 * FACTORÍA de guards de AUTORIZACIÓN (RBAC): recibe el permiso necesario y
 * devuelve un guard configurado con él.
 *   Uso en rutas: canMatch: [permisoGuard('gastos:aprobar')]
 * (En Java: un método estático que devuelve una lambda que "recuerda" el permiso.)
 *
 * Si falta el permiso, el usuario va a SU inicio con ?denegado=<url> para avisarle,
 * y el código de la página prohibida no llega a descargarse (canMatch + lazy loading,
 * sin precarga: ver app.config.ts).
 */
export function permisoGuard(permiso: Permiso): CanMatchFn {
  return async (_route, segments): Promise<boolean | UrlTree> => {
    const auth = inject(AuthService);
    const router = inject(Router);

    await auth.listo;
    if (auth.tienePermiso(permiso)) {
      return true;
    }

    const urlPedida = '/' + segments.map((s) => s.path).join('/');
    return router.createUrlTree(['/inicio'], { queryParams: { denegado: urlPedida } });
  };
}
