import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { map } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';

/**
 * Página de inicio de la zona privada: saluda al usuario, enseña su rol y,
 * si permisoGuard le ha redirigido aquí, le avisa de que no tenía acceso.
 * (El resumen con datos reales llega en la Fase 3.)
 */
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonNote],
})
export class InicioPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);

  /** ?denegado=/admin/dashboard -> lo pone permisoGuard cuando falta un permiso. */
  public readonly denegado = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('denegado'))),
    { initialValue: null },
  );
}
