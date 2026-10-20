// Una fila de la tabla public.clients de Supabase (Paso 2.3 del laboratorio).
// id y created_at los pone la base de datos, por eso son opcionales (?).
export interface Client {
  id?: string;
  nombre: string;
  empresa: string;
  email: string;
  created_at?: string;
}
