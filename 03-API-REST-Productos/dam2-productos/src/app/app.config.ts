import { ApplicationConfig } from '@angular/core';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app.routes';

// Configuración global de la aplicación (sustituye al antiguo AppModule).
// Aquí se registran los "providers": lo que Angular podrá inyectar en
// cualquier componente o servicio (router, Ionic, HttpClient...).
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
    provideHttpClient(), // permite inyectar HttpClient para consumir la API REST
  ],
};
