import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  barChartOutline,
  checkmarkDoneOutline,
  helpCircleOutline,
  homeOutline,
  logOutOutline,
  receiptOutline,
} from 'ionicons/icons';

import { AuthService } from '../../core/auth/auth.service';
import { ItemMenu } from '../../core/models/menu.model';

/**
 * Menú completo de la app. Cada entrada con "permiso" solo la verá quien lo tenga
 * (y aunque alguien escriba la URL a mano, la ruta está protegida por su guard).
 */
const MENU: readonly ItemMenu[] = [
  { titulo: 'Inicio', url: '/inicio', icono: 'home-outline' },
  { titulo: 'Mis gastos', url: '/gastos', icono: 'receipt-outline', permiso: 'gastos:ver-propios' },
  { titulo: 'Aprobaciones', url: '/admin/aprobaciones', icono: 'checkmark-done-outline', permiso: 'gastos:aprobar' },
  { titulo: 'Cuadro de mando', url: '/admin/dashboard', icono: 'bar-chart-outline', permiso: 'dashboard:ver' },
  { titulo: 'Ayuda', url: '/ayuda', icono: 'help-circle-outline' },
];

/**
 * "Shell" o carcasa de la zona privada: el menú lateral + el hueco (router-outlet)
 * donde se pintan las páginas hijas. Se carga UNA vez y las páginas cambian dentro.
 *
 * ion-split-pane: en pantallas grandes (when="lg") el menú queda fijo a la izquierda;
 * en móvil se convierte en un menú deslizante que se abre con el botón hamburguesa.
 */
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonFooter,
    IonButton,
  ],
})
export class ShellComponent {
  private readonly router = inject(Router);
  protected readonly auth = inject(AuthService);

  /**
   * Entradas visibles del menú. computed: se recalcula SOLO cuando cambian los
   * permisos (p. ej. al cambiar de usuario). Ocultar la opción es UX; la seguridad
   * real la ponen los guards de las rutas.
   */
  public readonly menu = computed(() => {
    const permisos = this.auth.permisos();
    return MENU.filter((item) => !item.permiso || permisos.includes(item.permiso));
  });

  constructor() {
    // Registra los iconos que usa el menú (solo se incluyen en el bundle los usados)
    addIcons({ homeOutline, receiptOutline, checkmarkDoneOutline, barChartOutline, helpCircleOutline, logOutOutline });
  }

  /** Cierra sesión y vuelve al login (replaceUrl: el botón "atrás" no vuelve a la zona privada). */
  public async salir(): Promise<void> {
    this.auth.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
