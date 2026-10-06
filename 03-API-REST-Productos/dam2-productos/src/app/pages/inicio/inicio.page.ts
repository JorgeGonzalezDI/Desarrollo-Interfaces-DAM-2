import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  // Standalone: el componente declara exactamente lo que usa su HTML
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RouterLink],
})
export class InicioPage {}
