// Genera src/environments/supabase.config.ts con la URL y la clave PÚBLICA (anon) de Supabase.
//
// ¿Por qué un script? Para que NINGUNA clave quede escrita en el repositorio:
//  - En local se leen del archivo .env (ignorado por Git; ver .env.example).
//  - En Vercel se leen de las variables de entorno del proyecto.
// Se ejecuta solo antes de start, build y test (scripts "pre..." de package.json).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

/** Lee un archivo .env sencillo (CLAVE=valor por línea) y devuelve un objeto. */
function leerDotEnv(ruta) {
  if (!existsSync(ruta)) return {};
  return Object.fromEntries(
    readFileSync(ruta, 'utf8')
      .split(/\r?\n/)
      .map((linea) => linea.trim())
      .filter((linea) => linea && !linea.startsWith('#') && linea.includes('='))
      .map((linea) => {
        const i = linea.indexOf('=');
        return [linea.slice(0, i).trim(), linea.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
      }),
  );
}

const dotEnv = leerDotEnv('.env');
const url = process.env.SUPABASE_URL ?? dotEnv.SUPABASE_URL ?? '';
const anonKey = process.env.SUPABASE_ANON_KEY ?? dotEnv.SUPABASE_ANON_KEY ?? '';

const contenido = `// ARCHIVO GENERADO por scripts/generar-config.mjs. No editar ni subir a Git.
export const supabaseConfig = {
  url: ${JSON.stringify(url.replace(/\/$/, ''))},
  anonKey: ${JSON.stringify(anonKey)},
};
`;

writeFileSync('src/environments/supabase.config.ts', contenido);
console.log(
  url && anonKey
    ? `Supabase configurado (${new URL(url).host}).`
    : 'AVISO: faltan SUPABASE_URL / SUPABASE_ANON_KEY (.env o variables de entorno). La app arrancará sin backend.',
);
