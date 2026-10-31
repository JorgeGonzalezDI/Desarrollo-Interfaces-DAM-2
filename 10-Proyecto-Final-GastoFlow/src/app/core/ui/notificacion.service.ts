import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

/**
 * Avisos breves (toasts) para toda la app. Ionic los anuncia a los lectores de pantalla
 * (role="status"), así que el usuario se entera aunque no vea la pantalla.
 */
@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private readonly toasts = inject(ToastController);

  public async mostrar(mensaje: string, color: 'success' | 'warning' | 'danger' | 'medium' = 'success'): Promise<void> {
    const toast = await this.toasts.create({
      message: mensaje,
      color,
      duration: 3500,
      position: 'bottom',
      buttons: [{ text: 'Cerrar', role: 'cancel' }],
    });
    await toast.present();
  }
}
