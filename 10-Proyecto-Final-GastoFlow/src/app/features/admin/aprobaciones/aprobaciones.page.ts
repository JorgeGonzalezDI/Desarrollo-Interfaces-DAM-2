import { Component, computed, inject, signal } from '@angular/core';
import {
  AlertController,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { checkmarkOutline, closeOutline } from 'ionicons/icons';

import { AuthService } from '../../../core/auth/auth.service';
import { GastosService } from '../../../core/data/gastos.service';
import { Gasto } from '../../../core/models/gasto.model';
import { NotificacionService } from '../../../core/ui/notificacion.service';
import { formatearMoneda } from '../../../core/utils/formato';
import { AccionTabla, ColumnaTabla, EventoAccionTabla } from '../../../shared/components/tabla-datos/tabla-datos.model';
import { TablaDatosComponent } from '../../../shared/components/tabla-datos/tabla-datos.component';

/**
 * Bandeja de aprobaciones (solo Administración, protegida por permisoGuard('gastos:aprobar')).
 * Reutiliza la misma TablaDatos que "Mis gastos" con otras columnas y acciones.
 * Los gastos nuevos de la plantilla aparecen solos gracias al tiempo real del store.
 */
@Component({
  selector: 'app-aprobaciones',
  templateUrl: './aprobaciones.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonNote,
    TablaDatosComponent,
  ],
})
export class AprobacionesPage {
  protected readonly store = inject(GastosService);
  protected readonly auth = inject(AuthService);
  private readonly alertas = inject(AlertController);
  private readonly avisos = inject(NotificacionService);

  protected readonly vista = signal<'pendientes' | 'todos'>('pendientes');

  protected readonly filas = computed(() =>
    this.vista() === 'pendientes' ? this.store.pendientes() : this.store.gastos(),
  );

  protected readonly importePendiente = computed(() =>
    formatearMoneda(this.store.pendientes().reduce((t, g) => t + g.importe, 0)),
  );

  protected readonly columnas: ColumnaTabla<Gasto>[] = [
    { clave: 'empleado', titulo: 'Empleado', valor: (g) => g.empleado?.nombre ?? '—', ordenable: true },
    { clave: 'departamento', titulo: 'Departamento', valor: (g) => g.empleado?.departamento ?? '—', ordenable: true, ocultarEnMovil: true },
    { clave: 'fecha', titulo: 'Fecha', valor: (g) => g.fecha, tipo: 'fecha', ordenable: true },
    { clave: 'categoria', titulo: 'Categoría', valor: (g) => g.categoria?.nombre ?? '—', ordenable: true, ocultarEnMovil: true },
    { clave: 'descripcion', titulo: 'Descripción', valor: (g) => g.descripcion },
    { clave: 'importe', titulo: 'Importe', valor: (g) => g.importe, tipo: 'moneda', ordenable: true },
    { clave: 'estado', titulo: 'Estado', valor: (g) => g.estado, tipo: 'estado', ordenable: true },
  ];

  /** Los botones solo aparecen si el usuario TIENE el permiso y el gasto sigue pendiente. */
  protected readonly acciones = computed<AccionTabla<Gasto>[]>(() =>
    this.auth.tienePermiso('gastos:aprobar')
      ? [
          { id: 'aprobar', etiqueta: 'Aprobar', icono: 'checkmark-outline', color: 'success', visible: (g) => g.estado === 'pendiente' },
          { id: 'rechazar', etiqueta: 'Rechazar', icono: 'close-outline', color: 'danger', visible: (g) => g.estado === 'pendiente' },
        ]
      : [],
  );

  protected readonly describir = (g: Gasto): string => `${g.empleado?.nombre ?? ''}, ${g.descripcion}`;

  constructor() {
    addIcons({ checkmarkOutline, closeOutline });
  }

  protected cambiarVista(valor: unknown): void {
    this.vista.set(valor === 'todos' ? 'todos' : 'pendientes');
  }

  protected async alAccion({ accion, fila }: EventoAccionTabla<Gasto>): Promise<void> {
    if (accion === 'aprobar') {
      await this.actualizar(fila, 'aprobado', null, 'Gasto aprobado.');
      return;
    }
    // Rechazar exige un motivo, que el empleado verá en su lista
    const alerta = await this.alertas.create({
      header: 'Rechazar gasto',
      subHeader: `${fila.empleado?.nombre} · ${formatearMoneda(fila.importe)}`,
      inputs: [{ name: 'motivo', type: 'textarea', placeholder: 'Motivo del rechazo (obligatorio)', attributes: { maxlength: 200 } }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Rechazar',
          role: 'confirm',
          handler: (datos: { motivo: string }) => datos.motivo.trim().length >= 3,
        },
      ],
    });
    await alerta.present();
    const { role, data } = await alerta.onDidDismiss<{ values: { motivo: string } }>();
    if (role === 'confirm' && data) {
      await this.actualizar(fila, 'rechazado', data.values.motivo.trim(), 'Gasto rechazado.');
    }
  }

  private async actualizar(fila: Gasto, estado: 'aprobado' | 'rechazado', motivo: string | null, mensaje: string): Promise<void> {
    try {
      await this.store.cambiarEstado(fila.id, estado, motivo);
      await this.avisos.mostrar(mensaje, estado === 'aprobado' ? 'success' : 'medium');
    } catch {
      await this.avisos.mostrar('No se ha podido actualizar el gasto.', 'danger');
    }
  }
}
