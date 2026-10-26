import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
  ],
})
export class AdminPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signal de solo lectura del servicio: si cambia la sesión, la vista se actualiza
  public readonly currentSession = this.authService.currentUser;

  // Lo que hay ahora mismo en sessionStorage (evidencia de la persistencia)
  public readonly storage = signal<string | null>(null);

  ionViewWillEnter(): void {
    this.storage.set(this.authService.leerStorageEnBruto());
  }

  public handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
