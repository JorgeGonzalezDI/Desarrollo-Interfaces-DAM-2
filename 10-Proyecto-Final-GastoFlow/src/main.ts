import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Punto de entrada (como el main() de Java): arranca Angular con el componente raíz
// y la configuración global definida en app.config.ts.
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
