// Credenciales del proyecto de Supabase (Project Settings → API Keys).
// La clave publishable/anon es PÚBLICA: puede ir en el frontend porque la seguridad
// la ponen las políticas RLS de la base de datos. NUNCA pongas aquí la secret/service_role.
export const environment = {
  production: false,
  supabaseUrl: 'https://owugfobtoumsmlmwbclu.supabase.co',
  supabaseKey: 'sb_publishable_5x0wdpNL71SpevA7aiyIfQ_F_6lpHC-',
};
