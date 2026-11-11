import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Exige rol admin. Se usa DESPUÉS de authGuard en las rutas.
export const roleGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await auth.ready;

  return auth.isAdmin() ? true : router.createUrlTree(['/products']);
};