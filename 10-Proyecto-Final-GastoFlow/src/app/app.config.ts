import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

// Configuración global (sustituye al antiguo AppModule): aquí se registran los
// "providers", lo que Angular puede inyectar en cualquier clase.
// Angular 22 es zoneless por defecto: la vista se refresca con signals, no con zone.js.
//
// SIN precarga (se quitó withPreloading(PreloadAllModules) de la plantilla de Ionic):
// la precarga descargaría en segundo plano TODAS las páginas, también las de admin,
// aunque el usuario sea un empleado. Sin ella, el código de cada página solo se
// descarga si el usuario navega a ella Y los guards le dejan pasar.
//
// (Fase 3) Aquí se añadirá provideHttpClient(withInterceptors([authInterceptor]))
// para que TODAS las peticiones a la API REST pasen por el interceptor de seguridad.
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
  ],
};
