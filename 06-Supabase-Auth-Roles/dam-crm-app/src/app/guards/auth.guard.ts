import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { SupabaseService } from '../services/supabase.service';

/**
 * Guard de ruta: solo deja entrar en /home si hay usuario logueado.
 * Si no, redirige a /login. Espera a sessionReady para no echar a alguien
 * que sí tenía sesión guardada pero todavía no se había comprobado.
 */
export const authGuard: CanActivateFn = async () => {
  const supabase = inject(SupabaseService);
  const router = inject(Router);

  await supabase.sessionReady;

  return supabase.currentUser() ? true : router.createUrlTree(['/login']);
};
