import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';

import { environment } from '../../../environments/environment';

/**
 * Punto ÚNICO de acceso al cliente de Supabase (singleton).
 * Se usa para lo que no es REST "puro": autenticación (Auth) y tiempo real (Realtime).
 * Los datos SQL se piden con HttpClient a la API REST (ver ApiRestService),
 * para que pasen por el interceptor de seguridad.
 */
@Injectable({ providedIn: 'root' })
export class SupabaseService {
  /** false si falta la configuración (.env / variables de Vercel): la app avisa en el login. */
  public readonly configurado = Boolean(environment.supabaseUrl && environment.supabaseAnonKey);

  /** Base de la API REST (PostgREST) que Supabase genera a partir de las tablas. */
  public readonly restUrl = `${environment.supabaseUrl}/rest/v1`;

  /** Clave pública (anon). La seguridad real la ponen las políticas RLS. */
  public readonly anonKey = environment.supabaseAnonKey;

  public readonly client: SupabaseClient = createClient(
    environment.supabaseUrl || 'http://localhost',
    environment.supabaseAnonKey || 'sin-configurar',
    { auth: { persistSession: true, autoRefreshToken: true } },
  );
}
