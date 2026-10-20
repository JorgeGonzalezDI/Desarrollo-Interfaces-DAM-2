/**
 * Supabase no lanza Error normales: devuelve objetos con `code` y `message`.
 * Esta función los traduce a un mensaje entendible para el toast.
 */
export function textoError(e: unknown): string {
  const error = e as { code?: string; message?: string } | null;

  if (error?.message === 'Invalid login credentials') return 'Email o contraseña incorrectos.';
  if (error?.code === '23505') return 'Ya existe un cliente con ese email.';
  if (error?.code === '42501') return 'No tienes permiso: solo los administradores pueden modificar clientes.';

  return error?.message ?? 'Error desconocido.';
}
