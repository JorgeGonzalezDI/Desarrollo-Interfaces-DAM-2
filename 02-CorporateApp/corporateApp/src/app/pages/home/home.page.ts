import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular';

// PÁGINA Home: menú horizontal. No tiene lógica propia; la navegación la hace
// routerLink en el HTML, por eso importamos RouterLink.
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, IonSegment, IonSegmentButton, IonLabel]
})
export class HomePage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
