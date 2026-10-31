import { supabaseConfig } from './supabase.config';

// Entorno de producción (Vercel): las claves llegan como variables de entorno del proyecto.
export const environment = {
  production: true,
  supabaseUrl: supabaseConfig.url,
  supabaseAnonKey: supabaseConfig.anonKey,
};
