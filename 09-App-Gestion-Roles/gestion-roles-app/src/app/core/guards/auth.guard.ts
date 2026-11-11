import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Un guard es una función, no una clase. CanActivateFn es el TIPO que describe
// "una función que decide si se puede activar (entrar en) una ruta".
export const authGuard: CanActivateFn = async () => {
  // inject() pide un servicio desde fuera de una clase.
  const auth = inject(AuthService);
  const router = inject(Router);

  // Esperamos a que init() termine de leer la sesión guardada (lo de F5).
  await auth.ready;

  // condición ? valorSiVerdadero : valorSiFalso
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};