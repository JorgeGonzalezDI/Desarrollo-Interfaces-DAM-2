import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

// Configuración global de la aplicación (sustituye al antiguo AppModule).
// Aquí se registran los "providers": lo que Angular podrá inyectar en
// cualquier componente o servicio (router, Ionic...).
// No hace falta provideHttpClient(): las peticiones las hace el SDK de Supabase.
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
};
