import { Component } from '@angular/core';
import {
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

/**
 * Página "Mis gastos". De momento es un esqueleto: la ruta, el menú y la carga
 * diferida ya funcionan; el contenido se completa en su fase del proyecto.
 */
@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardContent],
})
export class GastosPage {}
