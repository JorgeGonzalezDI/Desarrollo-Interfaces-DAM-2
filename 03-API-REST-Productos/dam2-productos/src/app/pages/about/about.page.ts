import { Component, inject } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent,
} from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton, IonButton,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  ],
})
export class AboutPage {
  // Para el botón de modo oscuro de la cabecera (petición 9)
  theme = inject(ThemeService);
}
