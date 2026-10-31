import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonMenuButton,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, checkmarkCircleOutline, closeCircleOutline, hourglassOutline, walletOutline } from 'ionicons/icons';
import { map } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { GastosService } from '../../core/data/gastos.service';
import { claveMes, hoyIso } from '../../core/utils/formato';
import { WidgetEstadisticoComponent } from '../../shared/components/widget-estadistico/widget-estadistico.component';

/**
 * Inicio: resumen personal con widgets (reutiliza WidgetEstadisticoComponent),
 * acceso rápido a registrar un gasto y, para administración, los pendientes de revisar.
 * Todo son computed() sobre el store: si llega un cambio en tiempo real, se recalcula solo.
 */
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonNote,
    IonButton,
    IonIcon,
    WidgetEstadisticoComponent,
  ],
})
export class InicioPage {
  private readonly route = inject(ActivatedRoute);
  protected readonly auth = inject(AuthService);
  protected readonly store = inject(GastosService);

  /** ?denegado=/admin/dashboard -> lo pone permisoGuard cuando falta un permiso. */
  public readonly denegado = toSignal(this.route.queryParamMap.pipe(map((p) => p.get('denegado'))), {
    initialValue: null,
  });

  protected readonly resumen = computed(() => {
    const mios = this.store.misGastos();
    const mesActual = claveMes(hoyIso());
    const suma = (estado: string) => mios.filter((g) => g.estado === estado).reduce((t, g) => t + g.importe, 0);
    return {
      pendiente: suma('pendiente'),
      numPendientes: mios.filter((g) => g.estado === 'pendiente').length,
      aprobadoMes: mios
        .filter((g) => g.estado === 'aprobado' && claveMes(g.fecha) === mesActual)
        .reduce((t, g) => t + g.importe, 0),
      rechazados: mios.filter((g) => g.estado === 'rechazado').length,
      total: mios.length,
    };
  });

  constructor() {
    addIcons({ addCircleOutline, hourglassOutline, checkmarkCircleOutline, closeCircleOutline, walletOutline });
  }
}
