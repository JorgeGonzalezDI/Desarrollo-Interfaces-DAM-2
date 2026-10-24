import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Punto de entrada: arranca la app con AppComponent como raíz.
// providers = servicios disponibles para toda la app.
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),   // activa los componentes de Ionic
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),   // registra la tabla de rutas de app.routes.ts
  ],
});
