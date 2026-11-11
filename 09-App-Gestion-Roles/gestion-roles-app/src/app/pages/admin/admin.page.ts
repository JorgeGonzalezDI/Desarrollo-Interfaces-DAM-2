import { Component, inject, signal } from '@angular/core';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonTitle, IonToolbar } from '@ionic/angular';
import { AppRole, Profile } from '../../core/models/profile.model';
import { AuthService } from '../../core/services/auth.service';
import { ProfilesService } from '../../core/services/profiles.service';

@Component({
  selector: 'app-admin',
  templateUrl: 'admin.page.html',
  styleUrls: ['admin.page.scss'],
  imports: [IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton],
})
export class AdminPage {
  private readonly profilesService = inject(ProfilesService);
  private readonly auth = inject(AuthService);

  readonly profiles = signal<Profile[]>([]);
  readonly error = signal<string | null>(null);

  // Mi propio id. `?.` = "si session() es null, devuelve undefined en vez de romper".
  // El HTML lo usa para NO enseñarte el botón en tu propia fila.
  readonly myId = this.auth.session()?.user.id;

  // Igual que en products: recarga cada vez que se muestra la pantalla
  ionViewWillEnter(): void {
    this.load();
  }

  private load(): void {
    this.profilesService.getAll().subscribe({
      next: (list) => this.profiles.set(list),
      error: () => this.error.set('No se pudieron cargar los usuarios'),
    });
  }

  // Recibe el perfil entero (no solo el id) para saber su rol actual
  toggleRole(profile: Profile): void {
    // AppRole es tu tipo 'admin' | 'user': TypeScript no deja poner otro texto
    const newRole: AppRole = profile.role === 'admin' ? 'user' : 'admin';

    this.profilesService.updateRole(profile.id, newRole).subscribe({
      next: () => this.load(), // tras cambiarlo en Supabase, refrescamos la lista
      error: () => this.error.set('No se pudo cambiar el rol'),
    });
  }
}