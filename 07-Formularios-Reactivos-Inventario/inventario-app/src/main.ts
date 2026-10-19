import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Arranca la app con el componente raíz y la configuración de app.config.ts
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
