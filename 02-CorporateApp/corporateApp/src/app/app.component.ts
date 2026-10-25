import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

// Componente raíz: su plantilla solo contiene <ion-app> y <ion-router-outlet>,
// el hueco donde el router va mostrando la página que toca (home, productos…).
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {}
}
