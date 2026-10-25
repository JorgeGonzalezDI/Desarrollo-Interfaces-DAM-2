import { Component, OnInit, signal, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
         IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/angular';
import { Geolocation } from '../../services/geolocation';

// PÁGINA Nosotros: descripción de la empresa y distancia entre el usuario y la oficina.
@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
            IonCard, IonCardHeader, IonCardTitle, IonCardContent]
})
export class NosotrosPage implements OnInit {
  private geolocation = inject(Geolocation);

  // null = todavía no calculada. Dos signals más abajo: uno para el resultado y otro para el error.
  distancia = signal<number | null>(null);
  error = signal('');

  async ngOnInit() {
    try {
      // 1) posición del usuario (el navegador pide permiso)
      const coords = await this.geolocation.getCurrentPosition();
      // 2) distancia con Haversine entre el usuario y la oficina
      const km = this.geolocation.calcularDistancia(
        coords.latitude, coords.longitude,
        this.geolocation.oficinaLat, this.geolocation.oficinaLon
      );
      this.distancia.set(km);
    } catch {
      // permiso denegado o sin GPS: mostramos un mensaje en lugar de romper la app
      this.error.set('No se pudo obtener tu ubicación');
    }
  }
}
