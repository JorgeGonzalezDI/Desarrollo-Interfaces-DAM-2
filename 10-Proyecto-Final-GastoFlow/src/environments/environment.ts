import { supabaseConfig } from './supabase.config';

// Entorno de desarrollo. supabase.config.ts lo genera scripts/generar-config.mjs
// a partir de .env, así que las claves nunca se escriben en el código.
export const environment = {
  production: false,
  supabaseUrl: supabaseConfig.url,
  supabaseAnonKey: supabaseConfig.anonKey,
};
