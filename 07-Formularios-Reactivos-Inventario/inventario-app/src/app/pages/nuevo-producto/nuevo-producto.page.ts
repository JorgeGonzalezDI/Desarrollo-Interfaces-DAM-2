import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonProgressBar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  alertCircleOutline,
  barcodeOutline,
  checkmarkCircleOutline,
  cubeOutline,
  layersOutline,
  pricetagOutline,
  saveOutline,
} from 'ionicons/icons';

import { CATEGORIAS, Categoria } from '../../models/producto.model';
import { InventarioService } from '../../services/inventario.service';
import {
  enteroPositivoValidator,
  noSoloEspaciosValidator,
  skuValidator,
} from '../../validators/producto.validators';

// Nombres de los campos del formulario (sirve para tipar mensajeError()).
type Campo = 'sku' | 'nombre' | 'categoria' | 'stockMinimo';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.page.html',
  styleUrls: ['./nuevo-producto.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonProgressBar,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonIcon,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonLabel,
    IonNote,
    IonBadge,
    IonToast,
  ],
})
export class NuevoProductoPage {
  // Dependencias con inject() (inyección de dependencias, sin "new")
  private readonly fb = inject(FormBuilder);
  protected readonly inventario = inject(InventarioService);

  protected readonly categorias = CATEGORIAS;

  // 1) EL FORMULARIO REACTIVO: se define entero aquí, en TypeScript.
  //    Cada campo: [valor inicial, [validadores]].
  //    nonNullable -> al hacer reset() vuelve al valor inicial (no a null).
  protected readonly form = this.fb.nonNullable.group({
    sku: ['', [Validators.required, skuValidator(12)]],
    nombre: ['', [Validators.required, noSoloEspaciosValidator, Validators.maxLength(60)]],
    categoria: ['' as Categoria | '', Validators.required],
    stockMinimo: [null as number | null, [Validators.required, enteroPositivoValidator]],
  });

  // 2) ESTADO CON SIGNALS
  protected readonly guardando = signal<boolean>(false); // ¿hay un guardado en curso?
  protected readonly toastAbierto = signal<boolean>(false);
  protected readonly toastMensaje = signal<string>('');
  protected readonly toastColor = signal<'success' | 'danger'>('success');

  constructor() {
    // Registra los iconos de Ionicons que usa la plantilla
    addIcons({
      alertCircleOutline,
      barcodeOutline,
      checkmarkCircleOutline,
      cubeOutline,
      layersOutline,
      pricetagOutline,
      saveOutline,
    });

    // El signal "guardando" manda: mientras sea true, el formulario entero
    // queda desactivado; cuando vuelve a false, se reactiva.
    effect(() => {
      if (this.guardando()) {
        this.form.disable();
      } else {
        this.form.enable();
      }
    });
  }

  /** Se ejecuta con (ngSubmit) al pulsar "Guardar producto". */
  protected async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // enseña los errores de todos los campos
      this.abrirToast('Revisa los campos marcados en rojo.', 'danger');
      return;
    }

    // getRawValue() antes de desactivar (un form desactivado no da sus valores con .value)
    const datos = this.form.getRawValue();
    this.guardando.set(true); // -> se desactiva el form y aparece el loader

    try {
      const producto = await this.inventario.guardar({
        sku: datos.sku.toUpperCase(),
        nombre: datos.nombre.trim(),
        categoria: datos.categoria as Categoria,
        stockMinimo: Number(datos.stockMinimo),
      });

      this.form.reset(); // limpia valores y estado "touched"
      this.abrirToast(`"${producto.nombre}" guardado en el dispositivo.`, 'success');
    } catch (error) {
      console.error('Error al guardar el producto', error);
      this.abrirToast('No se pudo guardar el producto. Inténtalo de nuevo.', 'danger');
    } finally {
      this.guardando.set(false); // -> se reactiva el form y desaparece el loader
    }
  }

  /** Texto que se pasa a [errorText] de cada campo según el error que tenga. */
  protected mensajeError(campo: Campo): string {
    const errores = this.form.controls[campo].errors;

    if (!errores) {
      return '';
    }

    switch (campo) {
      case 'sku':
        if (errores['required']) return 'El código de barras es obligatorio.';
        if (errores['skuCaracteres']) return 'Solo letras y números, sin espacios ni símbolos.';
        if (errores['skuLongitud']) {
          const { requerida, actual } = errores['skuLongitud'];
          return `Debe tener exactamente ${requerida} caracteres (llevas ${actual}).`;
        }
        break;

      case 'nombre':
        if (errores['required'] || errores['soloEspacios']) return 'El nombre del producto es obligatorio.';
        if (errores['maxlength']) return 'Máximo 60 caracteres.';
        break;

      case 'categoria':
        if (errores['required']) return 'Elige una categoría.';
        break;

      case 'stockMinimo':
        if (errores['required']) return 'El stock mínimo es obligatorio.';
        if (errores['noPositivo']) return 'Tiene que ser mayor que 0.';
        if (errores['noEntero']) return 'Tiene que ser un número entero de unidades.';
        if (errores['noNumerico']) return 'Introduce un número.';
        break;
    }

    return 'Valor no válido.';
  }

  private abrirToast(mensaje: string, color: 'success' | 'danger'): void {
    this.toastMensaje.set(mensaje);
    this.toastColor.set(color);
    this.toastAbierto.set(true);
  }
}
