import { Rol } from '../models/rol.model';

/**
 * USUARIOS DE DEMOSTRACIÓN (TEMPORAL).
 *
 * Mientras no está conectado Supabase Auth, el login se comprueba contra esta lista.
 * Las contraseñas NO están en texto plano: solo se guarda su huella SHA-256.
 * Al hacer login se calcula el SHA-256 de lo que escribe el usuario y se compara.
 * (Las credenciales de prueba se facilitan en el PDF de entrega, nunca en el repositorio.)
 *
 * Esta lista desaparece cuando la autenticación pase a Supabase (Fase 3).
 */
export interface UsuarioDemo {
  readonly id: string;
  readonly email: string;
  readonly nombre: string;
  readonly departamento: string;
  readonly rol: Rol;
  readonly hashPassword: string; // SHA-256 en hexadecimal
}

export const USUARIOS_DEMO: readonly UsuarioDemo[] = [
  {
    id: 'u-0001',
    email: 'admin@gastoflow.dev',
    nombre: 'Laura Martín (demo)',
    departamento: 'Administración',
    rol: 'admin',
    hashPassword: '04445e6487736590d1ef50186b414e737e0164683cbbec64e00e73c000fd3bef',
  },
  {
    id: 'u-0002',
    email: 'empleado@gastoflow.dev',
    nombre: 'Carlos Ruiz (demo)',
    departamento: 'Comercial',
    rol: 'empleado',
    hashPassword: '09eda9d1f231d7170e9db0b1b9f84435fd88d5ac9ac5cfc9c864993d56fd5d56',
  },
];
