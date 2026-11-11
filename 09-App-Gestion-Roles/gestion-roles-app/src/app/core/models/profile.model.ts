// Los dos roles posibles. Es el mismo enum que creamos en SQL (app_role).
export type AppRole = 'admin' | 'user';

// Forma de una fila de la tabla `profiles`.
export interface Profile {
  id: string; // el UUID del usuario (texto largo)
  email: string;
  role: AppRole;
  created_at: string;
}