import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline, trashOutline } from 'ionicons/icons';

import { GastosService } from '../../core/data/gastos.service';
import { EstadoGasto, Gasto } from '../../core/models/gasto.model';
import { NotificacionService } from '../../core/ui/notificacion.service';
import { AccionTabla, ColumnaTabla, EventoAccionTabla } from '../../shared/components/tabla-datos/tabla-datos.model';
import { TablaDatosComponent } from '../../shared/components/tabla-datos/tabla-datos.component';

type FiltroEstado = EstadoGasto | 'todos';

/**
 * "Mis gastos": lista de los gastos del usuario con la TablaDatos reutilizable.
 * La página solo define QUÉ columnas y acciones hay y reacciona al evento (accion)
 * que emite la tabla: la lógica de buscar, ordenar y paginar vive en el componente.
 */
@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  imports: [
    RouterLink,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonButton,
    IonIcon,
    IonNote,
    TablaDatosComponent,
  ],
})
export class GastosPage {
  protected readonly store = inject(GastosService);
  private readonly alertas = inject(AlertController);
  private readonly avisos = inject(NotificacionService);

  protected readonly filtro = signal<FiltroEstado>('todos');

  protected readonly filas = computed(() => {
    const filtro = this.filtro();
    const mios = this.store.misGastos();
    return filtro === 'todos' ? mios : mios.filter((g) => g.estado === filtro);
  });

  protected readonly columnas: ColumnaTabla<Gasto>[] = [
    { clave: 'fecha', titulo: 'Fecha', valor: (g) => g.fecha, tipo: 'fecha', ordenable: true },
    { clave: 'categoria', titulo: 'Categoría', valor: (g) => g.categoria?.nombre ?? '—', ordenable: true },
    { clave: 'descripcion', titulo: 'Descripción', valor: (g) => g.descripcion },
    { clave: 'proveedor', titulo: 'Proveedor', valor: (g) => g.detalles.proveedor ?? '—', ocultarEnMovil: true },
    { clave: 'importe', titulo: 'Importe', valor: (g) => g.importe, tipo: 'moneda', ordenable: true },
    { clave: 'estado', titulo: 'Estado', valor: (g) => g.estado, tipo: 'estado', ordenable: true },
  ];

  protected readonly acciones: AccionTabla<Gasto>[] = [
    { id: 'eliminar', etiqueta: 'Eliminar', icono: 'trash-outline', color: 'danger', visible: (g) => g.estado === 'pendiente' },
  ];

  protected readonly describir = (g: Gasto): string => g.descripcion;

  constructor() {
    addIcons({ addCircleOutline, trashOutline });
  }

  protected cambiarFiltro(valor: unknown): void {
    this.filtro.set((valor as FiltroEstado) ?? 'todos');
  }

  /** Respuesta al output (accion) de la tabla. */
  protected async alAccion(evento: EventoAccionTabla<Gasto>): Promise<void> {
    if (evento.accion !== 'eliminar') return;
    const alerta = await this.alertas.create({
      header: 'Eliminar gasto',
      message: `¿Seguro que quieres eliminar «${evento.fila.descripcion}»?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive' },
      ],
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    if (role !== 'destructive') return;
    try {
      await this.store.eliminar(evento.fila.id);
      await this.avisos.mostrar('Gasto eliminado.');
    } catch {
      await this.avisos.mostrar('No se ha podido eliminar el gasto.', 'danger');
    }
  }
}
