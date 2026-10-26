import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

/** Página de inicio de los usuarios con rol 'user' (apartado 4.2 del enunciado). */
@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss'],
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
    IonNote,
  ],
})
export class UserDashboardPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public readonly currentSession = this.authService.currentUser;
  public readonly storage = signal<string | null>(null);

  // ?denegado=/admin -> lo pone roleGuard cuando el rol no tiene permiso
  public readonly denegado = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('denegado'))),
    { initialValue: null },
  );

  ionViewWillEnter(): void {
    this.storage.set(this.authService.leerStorageEnBruto());
  }

  public handleLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
