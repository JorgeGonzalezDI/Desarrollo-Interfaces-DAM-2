import { Component, OnInit, inject, signal } from '@angular/core';
// Componentes de Ionic que usa la plantilla. En standalone, cada página importa
// lo que usa su HTML: si falta uno aquí, esa etiqueta no se pinta.
import {
  IonContent, IonHeader, IonTitle, IonToolbar,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner,
} from '@ionic/angular';
import { Users } from '../../services/users';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',              // nombre de su etiqueta: <app-users>
  templateUrl: './users.page.html',   // la vista
  styleUrls: ['./users.page.scss'],   // estilos que solo afectan a esta página
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonBadge, IonSpinner],
})
export class UsersPage implements OnInit {

  // inject(): pide a Angular la instancia del servicio (inyección de dependencias).
  // Hace lo mismo que recibirlo por el constructor, pero en una sola línea.
  private usersService = inject(Users);

  // signal(): una variable que "avisa". Al cambiarla con .set(), Angular repinta la vista.
  // Esta app no usa zone.js (Angular 22 zoneless): sin signals, la vista no se enteraría
  // de los datos que llegan después de un await.
  users = signal<User[]>([]);   // empieza como lista vacía
  loading = signal(false);      // true mientras se cargan los datos → se ve el spinner

  // ngOnInit: se ejecuta una vez, cuando se crea la página. Aquí se piden los datos.
  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading.set(true);                                  // enseña el spinner
      const data = await this.usersService.getActiveUsers();   // espera los datos
      this.users.set(data);                                    // la lista se pinta sola
    } catch (error) {
      // si la "petición" falla, la app no se rompe: se registra el error en la consola
      console.error('Error al cargar usuarios:', error);
    } finally {
      // finally se ejecuta siempre, haya ido bien o mal: quita el spinner
      this.loading.set(false);
    }
  }

}
