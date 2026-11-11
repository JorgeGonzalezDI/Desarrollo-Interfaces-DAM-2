import { createClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

// Conexión ÚNICA a Supabase para toda la app.
// Un archivo .ts se ejecuta una sola vez, la primera vez que alguien lo importa;
// después todos reciben ESTE mismo objeto. Por eso no hace falta una clase.
export const supabase = createClient(environment.supabaseUrl, environment.supabaseKey);