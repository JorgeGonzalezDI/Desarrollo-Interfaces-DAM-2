import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

// Configuración global (sustituye al antiguo AppModule): aquí se registran los
// "providers", lo que Angular puede inyectar en cualquier clase.
// Angular 22 es zoneless por defecto: la vista se refresca con signals, no con zone.js.
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
};
