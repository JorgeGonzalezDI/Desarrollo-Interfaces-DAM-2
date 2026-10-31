import { Component } from '@angular/core';
import {
  IonAccordion,
  IonAccordionGroup,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

/**
 * Manual de usuario dentro de la propia app (lo pide la Fase 5.2 y el RA 6).
 * Cada pregunta es un acordeón: se abre con clic, Enter o Espacio (accesible por teclado).
 * Se irá ampliando a medida que se añadan funcionalidades.
 */
@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.page.html',
  imports: [IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent, IonAccordionGroup, IonAccordion, IonItem, IonLabel],
})
export class AyudaPage {}
