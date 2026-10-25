import { Service } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

// Forma de cada mensaje guardado
export interface Mensaje {
  correo: string;
  mensaje: string;
  fecha: string;
}

// SERVICIO de mensajes: persistencia local con Capacitor Preferences.
// Preferences guarda pares clave → texto. En el navegador usa localStorage
// (clave "CapacitorStorage.mensajes") y en Android el almacenamiento nativo,
// con el mismo código en los dos casos.
@Service()
export class Messages {
  private readonly clave = 'mensajes';

  // Lee la lista guardada. Si todavía no hay nada, value es null y devolvemos [].
  async cargar(): Promise<Mensaje[]> {
    const { value } = await Preferences.get({ key: this.clave });
    return value ? JSON.parse(value) : [];  // JSON.parse: texto → objetos
  }

  // Añade un mensaje a la lista y la vuelve a guardar.
  async guardar(correo: string, mensaje: string): Promise<void> {
    const lista = await this.cargar();
    lista.push({ correo, mensaje, fecha: new Date().toLocaleString('es-ES') });
    // Preferences solo guarda texto, por eso JSON.stringify: objetos → texto
    await Preferences.set({ key: this.clave, value: JSON.stringify(lista) });
  }
}
