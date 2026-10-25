import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

// Punto de entrada. Sin NgModule: se arranca el componente raíz y en "providers"
// se registran los servicios globales (también inyección de dependencias).
bootstrapApplication(AppComponent, {
  providers: [
    // Ionic gestiona la navegación entre páginas (animaciones, historial)
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    // Rutas + precarga de las páginas lazy una vez arrancada la app
    provideRouter(routes, withPreloading(PreloadAllModules), withComponentInputBinding()),
  ],
});
