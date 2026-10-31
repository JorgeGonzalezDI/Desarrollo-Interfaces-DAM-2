import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { ConCambiosSinGuardar } from '../../../core/auth/cambios-sin-guardar.guard';
import { GastosService } from '../../../core/data/gastos.service';
import { DetallesGasto, METODOS_PAGO } from '../../../core/models/gasto.model';
import { NotificacionService } from '../../../core/ui/notificacion.service';
import { formatearMoneda, hoyIso } from '../../../core/utils/formato';
import { fechaNoFutura } from '../../../core/utils/validadores';

/**
 * Alta de un gasto con FORMULARIO REACTIVO.
 *  - Grupo anidado "detalles": se guarda tal cual en la columna jsonb (parte NoSQL).
 *  - Validación DINÁMICA: si la categoría es Desplazamiento, los kilómetros pasan a ser obligatorios.
 *  - Implementa ConCambiosSinGuardar: el guard canDeactivate pregunta antes de perder datos.
 *  - takeUntilDestroyed: la suscripción a valueChanges se cierra sola al salir (sin fugas de memoria).
 */
@Component({
  selector: 'app-gasto-form',
  templateUrl: './gasto-form.page.html',
  styleUrls: ['./gasto-form.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonBackButton,
    IonTitle,
    IonContent,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonButton,
    IonSpinner,
    IonText,
    IonNote,
  ],
})
export class GastoFormPage implements OnInit, ConCambiosSinGuardar {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly avisos = inject(NotificacionService);
  protected readonly store = inject(GastosService);

  protected readonly hoy = hoyIso();
  protected readonly metodosPago = METODOS_PAGO;

  public readonly form = this.fb.group({
    fecha: this.fb.nonNullable.control(this.hoy, [Validators.required, fechaNoFutura]),
    categoria_id: this.fb.control<number | null>(null, Validators.required),
    importe: this.fb.control<number | null>(null, [Validators.required, Validators.min(0.01), Validators.max(5000)]),
    descripcion: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]),
    detalles: this.fb.group({
      proveedor: this.fb.nonNullable.control('', Validators.maxLength(80)),
      metodo_pago: this.fb.nonNullable.control<string>(METODOS_PAGO[0]),
      kilometros: this.fb.control<number | null>(null, [Validators.min(1), Validators.max(2000)]),
      notas: this.fb.nonNullable.control('', Validators.maxLength(300)),
    }),
  });

  public readonly guardando = signal(false);
  public readonly error = signal('');
  private guardado = false;

  /** Categoría elegida (signal a partir del Observable valueChanges). */
  private readonly categoriaId = toSignal(this.form.controls.categoria_id.valueChanges, { initialValue: null });
  protected readonly categoria = computed(() => this.store.categorias().find((c) => c.id === this.categoriaId()) ?? null);
  protected readonly esDesplazamiento = computed(() => this.categoria()?.nombre === 'Desplazamiento');
  protected readonly ayudaImporte = computed(() => {
    const c = this.categoria();
    return c ? `Límite orientativo de ${c.nombre}: ${formatearMoneda(c.limite_mensual)} al mes` : 'Hasta 5.000 € por gasto';
  });

  ngOnInit(): void {
    // Validación dinámica de kilómetros según la categoría
    const km = this.form.controls.detalles.controls.kilometros;
    this.form.controls.categoria_id.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      if (this.esDesplazamiento()) {
        km.addValidators(Validators.required);
      } else {
        km.removeValidators(Validators.required);
        km.reset(null);
      }
      km.updateValueAndValidity();
    });
  }

  public hayCambiosSinGuardar(): boolean {
    return this.form.dirty && !this.guardado;
  }

  public errorDe(ruta: string): string {
    const control = this.form.get(ruta);
    if (!control?.errors || !(control.touched || control.dirty)) return '';
    const e = control.errors;
    if (e['required']) return 'Este campo es obligatorio.';
    if (e['fechaFutura']) return 'La fecha no puede ser posterior a hoy.';
    if (e['min']) return `El valor mínimo es ${e['min'].min}.`;
    if (e['max']) return `El valor máximo es ${e['max'].max}.`;
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres.`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    return 'Revisa este campo.';
  }

  public async guardar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    try {
      const v = this.form.getRawValue();
      // Solo se guardan en el documento jsonb los detalles que tienen valor
      const detalles: DetallesGasto = {
        metodo_pago: v.detalles.metodo_pago,
        ...(v.detalles.proveedor.trim() && { proveedor: v.detalles.proveedor.trim() }),
        ...(v.detalles.notas.trim() && { notas: v.detalles.notas.trim() }),
        ...(this.esDesplazamiento() && v.detalles.kilometros && { kilometros: Number(v.detalles.kilometros) }),
      };
      await this.store.crear({
        fecha: v.fecha,
        categoria_id: Number(v.categoria_id),
        importe: Number(v.importe),
        descripcion: v.descripcion.trim(),
        detalles,
      });
      this.guardado = true;
      await this.avisos.mostrar('Gasto registrado. Queda pendiente de revisión.');
      await this.router.navigateByUrl('/gastos');
    } catch {
      this.error.set('No se ha podido guardar el gasto. Revisa los datos e inténtalo de nuevo.');
    } finally {
      this.guardando.set(false);
    }
  }
}
