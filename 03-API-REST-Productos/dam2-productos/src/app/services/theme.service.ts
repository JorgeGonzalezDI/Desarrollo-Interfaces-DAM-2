import { Service, signal } from '@angular/core';

// Servicio del modo oscuro (petición 9). Una sola instancia para toda la app.
@Service()
export class ThemeService {
  // Signal: true = modo oscuro activado. Las pantallas leen dark() para pintar el icono
  dark = signal(false);

  constructor() {
    // Al arrancar: usa lo que el usuario eligió la última vez; si no hay nada, el tema del sistema
    const guardado = localStorage.getItem('modo-oscuro');
    const inicial = guardado !== null
      ? guardado === 'true'
      : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);   // ?. por si no existe (tests)
    this.aplicar(inicial);
  }

  // Lo llaman los botones de las cabeceras
  toggle(): void {
    this.aplicar(!this.dark());
  }

  private aplicar(oscuro: boolean): void {
    this.dark.set(oscuro);
    // Ionic activa su paleta oscura cuando <html> lleva la clase "ion-palette-dark"
    document.documentElement.classList.toggle('ion-palette-dark', oscuro);
    localStorage.setItem('modo-oscuro', String(oscuro));   // recordarlo para la próxima vez
  }
}
