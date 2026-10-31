/**
 * Modelo de control de acceso basado en roles (RBAC).
 *
 * Idea clave: las pantallas NO preguntan "¿eres admin?", preguntan
 * "¿tienes el permiso X?". El rol solo es un "paquete" de permisos.
 * Así, si mañana aparece un rol nuevo (p. ej. 'supervisor'), basta con
 * añadirlo aquí; las rutas, el menú y los botones no cambian.
 *
 * Analogía Java: Rol sería un enum, Permiso otro enum, y PERMISOS_POR_ROL
 * un Map<Rol, Set<Permiso>> inmutable.
 */

/** Roles de la aplicación (tipo unión: TypeScript solo admite estos textos). */
export type Rol = 'admin' | 'empleado';

/** Permisos atómicos con formato recurso:acción. */
export type Permiso =
  | 'gastos:ver-propios'
  | 'gastos:crear'
  | 'gastos:ver-todos'
  | 'gastos:aprobar'
  | 'dashboard:ver'
  | 'informes:exportar'
  | 'usuarios:gestionar';

/**
 * Matriz rol -> permisos. Es la ÚNICA fuente de verdad de la autorización
 * en el cliente (la base de datos lo repetirá con políticas RLS de Supabase,
 * porque el cliente nunca es de fiar por sí solo).
 */
export const PERMISOS_POR_ROL: Readonly<Record<Rol, readonly Permiso[]>> = {
  empleado: ['gastos:ver-propios', 'gastos:crear'],
  admin: [
    'gastos:ver-propios',
    'gastos:crear',
    'gastos:ver-todos',
    'gastos:aprobar',
    'dashboard:ver',
    'informes:exportar',
    'usuarios:gestionar',
  ],
};

/** Nombre "bonito" de cada rol para enseñarlo en pantalla. */
export const NOMBRE_ROL: Readonly<Record<Rol, string>> = {
  admin: 'Administración',
  empleado: 'Empleado',
};
