import { Component, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonContent,
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
  receiptOutline,
} from 'ionicons/icons';

import { ItemMenu } from '../../core/models/menu.model';

/**
 * Menú completo de la app. Cada entrada con "permiso" solo la verá quien lo tenga
 * (de momento se muestran todas; el filtrado por permisos llega con la autenticación).
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
  ],
})
export class ShellComponent {
  /** Entradas visibles del menú (computed: se recalcula solo si cambia algo de lo que lee). */
  public readonly menu = computed(() => MENU);

  constructor() {
    // Registra los iconos que usa el menú (solo se incluyen en el bundle los usados)
    addIcons({ homeOutline, receiptOutline, checkmarkDoneOutline, barChartOutline, helpCircleOutline });
  }
}
