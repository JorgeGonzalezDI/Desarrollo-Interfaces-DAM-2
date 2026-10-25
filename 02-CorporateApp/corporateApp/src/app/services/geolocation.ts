import { Service } from '@angular/core';
// Alias CapGeolocation: la clase de este archivo también se llama Geolocation
// (así la nombra el CLI) y sin alias chocarían.
import { Geolocation as CapGeolocation } from '@capacitor/geolocation';

// SERVICIO de geolocalización: esconde el plugin de Capacitor y el cálculo de distancia.
// La página solo pide "dame la distancia" y no sabe cómo se obtiene la posición.
@Service()
export class Geolocation {

  // Pide la posición al navegador (o al GPS en Android). El navegador antes
  // pregunta al usuario si da permiso; si lo deniega, lanza un error.
  async getCurrentPosition() {
    const data = await CapGeolocation.getCurrentPosition();
    return data.coords; // { latitude, longitude, accuracy, ... }
  }

  // Coordenadas de la oficina (Arcos de Jalón 18, Madrid), a efectos de la práctica.
  // readonly: no se pueden modificar por error desde fuera.
  readonly oficinaLat = 40.4452;
  readonly oficinaLon = -3.6115;

  // Fórmula Haversine: distancia en km entre dos puntos de la superficie terrestre.
  // La Tierra es una esfera, por eso no vale restar coordenadas sin más.
  calcularDistancia(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // radio medio de la Tierra en km

    // Diferencias de latitud y longitud, pasadas de grados a radianes
    // (Math.sin y Math.cos trabajan en radianes)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    // a: 0 si los puntos coinciden y 1 si están en lados opuestos de la Tierra.
    // El producto de cosenos corrige que los meridianos se juntan hacia los polos.
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    // c: ángulo entre los dos puntos visto desde el centro de la Tierra
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // longitud del arco = radio × ángulo
    return R * c;
  }

}
