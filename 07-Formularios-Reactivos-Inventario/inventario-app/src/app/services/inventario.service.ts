import { Injectable, signal } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

import { NuevoProducto, Producto } from '../models/producto.model';

// Clave con la que se guarda la lista en el almacenamiento del dispositivo.
const CLAVE = 'inventario.productos';

// Tiempo que tarda la "petición" simulada, para que se vea el loader.
const LATENCIA_MS = 1500;

/**
 * Servicio de inventario: guarda los productos EN LOCAL (Offline First).
 *
 * Usa Capacitor Preferences (clave-valor):
 *  - En Android/iOS lo guarda en el almacenamiento nativo (SharedPreferences / UserDefaults).
 *  - En el navegador (ionic serve) lo guarda en localStorage.
 * Como solo guarda texto, la lista se convierte a JSON con JSON.stringify.
 */
@Injectable({ providedIn: 'root' })
export class InventarioService {
  // Estado privado: solo el servicio puede cambiarlo...
  private readonly _productos = signal<Producto[]>([]);
  // ...y fuera se expone en solo lectura (sin .set()).
  readonly productos = this._productos.asReadonly();

  constructor() {
    this.cargar();
  }

  /** Simula la petición de guardado y persiste el producto en el dispositivo. */
  async guardar(datos: NuevoProducto): Promise<Producto> {
    await esperar(LATENCIA_MS);

    const producto: Producto = {
      ...datos,
      id: `${Date.now()}`,
      fechaAlta: new Date().toISOString(),
    };

    const lista = [producto, ...this._productos()];
    await Preferences.set({ key: CLAVE, value: JSON.stringify(lista) });
    this._productos.set(lista);

    return producto;
  }

  /** Lee lo que ya hubiera guardado (así sobrevive a recargar la app). */
  private async cargar(): Promise<void> {
    try {
      const { value } = await Preferences.get({ key: CLAVE });
      this._productos.set(value ? (JSON.parse(value) as Producto[]) : []);
    } catch (error) {
      console.error('No se pudo leer el inventario local', error);
      this._productos.set([]);
    }
  }
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
