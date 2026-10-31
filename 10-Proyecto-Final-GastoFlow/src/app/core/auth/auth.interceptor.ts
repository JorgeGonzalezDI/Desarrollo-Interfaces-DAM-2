import {
  HttpContextToken,
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, from, switchMap, throwError } from 'rxjs';

import { NotificacionService } from '../ui/notificacion.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthService } from './auth.service';

/** Marca interna para no reintentar dos veces la misma petición (evita bucles infinitos). */
const YA_REINTENTADA = new HttpContextToken<boolean>(() => false);

/**
 * Interceptor HTTP funcional: TODAS las peticiones de HttpClient pasan por aquí
 * (patrón Chain of Responsibility, como los Filter de los Servlets en Java).
 *
 * 1. Solo actúa sobre la API REST propia: así el token nunca viaja a terceros.
 * 2. Añade las cabeceras que exige Supabase: apikey y Authorization: Bearer <JWT>.
 * 3. 401 (token caducado o inválido): renueva la sesión UNA vez y repite la petición;
 *    si no se puede, cierra la sesión y manda al login recordando la página.
 * 4. 403 (sin permiso, p. ej. una política RLS lo impide): avisa sin cerrar la sesión.
 *
 * Se registra una sola vez en app.config.ts: provideHttpClient(withInterceptors([authInterceptor])).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const supabase = inject(SupabaseService);
  if (!req.url.startsWith(supabase.restUrl)) {
    return next(req);
  }

  const auth = inject(AuthService);
  const router = inject(Router);
  const avisos = inject(NotificacionService);

  return next(conCabeceras(req, auth.accessToken(), supabase.anonKey)).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse)) {
        return throwError(() => error);
      }

      if (error.status === 401 && !req.context.get(YA_REINTENTADA)) {
        return from(auth.refrescarSesion()).pipe(
          switchMap((renovada) => {
            if (!renovada) {
              auth.limpiarSesion();
              void router.navigate(['/login'], { queryParams: { returnUrl: router.url } });
              void avisos.mostrar('Tu sesión ha caducado. Vuelve a iniciar sesión.', 'warning');
              return throwError(() => error);
            }
            return reintentar(req, next, auth.accessToken(), supabase.anonKey);
          }),
        );
      }

      if (error.status === 403) {
        void avisos.mostrar('No tienes permiso para realizar esta operación.', 'danger');
      }
      return throwError(() => error);
    }),
  );
};

/** Copia la petición (son inmutables) añadiendo las cabeceras de Supabase. */
function conCabeceras(req: HttpRequest<unknown>, token: string | null, anonKey: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
    },
  });
}

/** Repite la petición con el token nuevo, marcándola para no reintentarla otra vez. */
function reintentar(req: HttpRequest<unknown>, next: HttpHandlerFn, token: string | null, anonKey: string) {
  const marcada = req.clone({ context: req.context.set(YA_REINTENTADA, true) });
  return next(conCabeceras(marcada, token, anonKey));
}
