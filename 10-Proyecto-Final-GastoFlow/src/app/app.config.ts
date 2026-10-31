import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { RouteReuseStrategy, provideRouter } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth/auth.interceptor';

// Configuración global (sustituye al antiguo AppModule): aquí se registran los
// "providers", lo que Angular puede inyectar en cualquier clase.
// Angular 22 es zoneless por defecto: la vista se refresca con signals, no con zone.js.
//
// - SIN precarga de rutas: la precarga descargaría en segundo plano TODAS las páginas,
//   también las de administración, aunque el usuario sea un empleado.
// - HttpClient con el interceptor de seguridad: TODAS las peticiones a la API REST
//   pasan por authInterceptor (token, apikey y errores 401/403 en un único sitio).
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // PWA: service worker que cachea la app para que cargue rápido e instalable (solo en producción)
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
};
