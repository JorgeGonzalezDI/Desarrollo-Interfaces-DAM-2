import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

// Componente raíz: solo contiene el "hueco" donde el router pinta cada página.
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {}
