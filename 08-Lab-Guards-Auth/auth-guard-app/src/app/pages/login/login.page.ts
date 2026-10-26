import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { map } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    FormsModule, // para [(ngModel)]
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonText,
    IonNote,
  ],
})
export class LoginPage {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Campos del formulario (enlazados con [(ngModel)])
  public username = '';
  public password = '';

  // Estado de la vista con signals (la app no usa zone.js)
  public readonly errorMessage = signal<string>('');

  // ?returnUrl=/admin -> lo pone authGuard cuando te echa de una ruta protegida
  public readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('returnUrl'))),
    { initialValue: null },
  );

  /** Ionic reutiliza la página: al volver a ella se limpian contraseña y errores. */
  ionViewWillEnter(): void {
    this.password = '';
    this.errorMessage.set('');
  }

  public handleLogin(): void {
    this.errorMessage.set('');
    const success = this.authService.login(this.username, this.password);

    if (success) {
      // Si venía de una ruta protegida vuelve a ella; si no, a la página de su rol
      const destino = this.returnUrl() ?? this.authService.rutaInicio(this.authService.role());
      this.router.navigateByUrl(destino);
    } else {
      this.errorMessage.set('Credenciales no autorizadas. Use admin / 123 u operador / 123');
    }
  }
}
