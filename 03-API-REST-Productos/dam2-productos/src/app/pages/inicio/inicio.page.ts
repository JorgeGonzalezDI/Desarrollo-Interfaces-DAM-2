import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';   // para que funcione routerLink en el HTML
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons } from '@ionic/angular';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  // Solo declaramos lo que usa su HTML
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, RouterLink],
})
export class InicioPage {
  // Solo necesita el servicio del tema para el botón de modo oscuro (petición 9)
  theme = inject(ThemeService);
}