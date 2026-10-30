import { Rol } from './rol.model';

/**
 * Datos de la sesión, con la MISMA forma que el "payload" (claims) de un JWT.
 * Ahora la sesión es simulada; cuando se conecte Supabase Auth, estos campos
 * saldrán del token real sin tener que cambiar el resto de la app.
 *
 *  - sub: identificador único del usuario (subject).
 *  - exp: fecha de caducidad en SEGUNDOS desde 1970 (formato estándar de JWT).
 *
 * Analogía Java: un record inmutable con estos atributos.
 */
export interface SesionClaims {
  readonly sub: string;
  readonly email: string;
  readonly nombre: string;
  readonly departamento: string;
  readonly rol: Rol;
  readonly exp: number;
}
