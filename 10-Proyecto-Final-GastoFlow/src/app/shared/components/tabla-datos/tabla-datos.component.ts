import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { IonBadge, IonButton, IonIcon, IonSearchbar, IonSpinner } from '@ionic/angular';

import { COLOR_ESTADO, ETIQUETA_ESTADO, EstadoGasto } from '../../../core/models/gasto.model';
import { formatearFecha, formatearMoneda } from '../../../core/utils/formato';
import { AccionTabla, ColumnaTabla, EventoAccionTabla, OrdenTabla } from './tabla-datos.model';
import { filtrarYOrdenar } from './tabla-datos.utils';

/**
 * TABLA DE DATOS AVANZADA reutilizable (Fase 2 del proyecto).
 *
 * Es AGNÓSTICA: no sabe qué es un gasto. Recibe por inputs las columnas, las filas y las
 * acciones, y avisa al padre por un output cuando el usuario pulsa una acción.
 * Incluye buscador, ordenación por columna, paginación y estado vacío/cargando.
 *
 * - Genérica <T>: sirve para cualquier tipo de fila (como List<T> en Java).
 * - Signal inputs (input()) + computed(): la tabla se recalcula sola si cambian los datos.
 * - OnPush: Angular solo la repinta cuando cambian sus inputs o sus signals.
 * - Accesible: <table> nativa con caption, th scope y aria-sort; en móvil cada fila
 *   se muestra como una tarjeta (CSS), sin perder la semántica de tabla.
 */
@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonSearchbar, IonButton, IonIcon, IonBadge, IonSpinner],
})
export class TablaDatosComponent<T extends { id: number | string }> {
  // ---- Entradas (Inputs) ----
  public readonly titulo = input.required<string>();
  public readonly columnas = input.required<readonly ColumnaTabla<T>[]>();
  public readonly filas = input.required<readonly T[]>();
  public readonly acciones = input<readonly AccionTabla<T>[]>([]);
  public readonly cargando = input(false);
  public readonly textoVacio = input('No hay datos que mostrar.');
  public readonly tamanoPagina = input(10);
  /** Texto que identifica cada fila para los lectores de pantalla ("Aprobar: Hotel en Sevilla"). */
  public readonly descripcionFila = input<(fila: T) => string>((fila) => String(fila.id));

  // ---- Salida (Output) ----
  public readonly accion = output<EventoAccionTabla<T>>();

  // ---- Estado interno ----
  protected readonly busqueda = signal('');
  protected readonly orden = signal<OrdenTabla | null>(null);
  protected readonly pagina = signal(0);

  protected readonly filasVisibles = computed(() =>
    filtrarYOrdenar(this.filas(), this.columnas(), this.busqueda(), this.orden()),
  );
  protected readonly totalPaginas = computed(() =>
    Math.max(1, Math.ceil(this.filasVisibles().length / this.tamanoPagina())),
  );
  protected readonly filasPagina = computed(() => {
    const inicio = this.pagina() * this.tamanoPagina();
    return this.filasVisibles().slice(inicio, inicio + this.tamanoPagina());
  });

  constructor() {
    // Si cambian los datos o el filtro y la página actual deja de existir, se vuelve a la primera
    effect(() => {
      if (this.pagina() >= this.totalPaginas()) {
        this.pagina.set(0);
      }
    });
  }

  protected buscar(texto: string | null | undefined): void {
    this.busqueda.set(texto ?? '');
    this.pagina.set(0);
  }

  /** Clic en la cabecera: asc -> desc -> sin ordenar. */
  protected ordenarPor(columna: ColumnaTabla<T>): void {
    const actual = this.orden();
    if (actual?.clave !== columna.clave) {
      this.orden.set({ clave: columna.clave, direccion: 'asc' });
    } else if (actual.direccion === 'asc') {
      this.orden.set({ clave: columna.clave, direccion: 'desc' });
    } else {
      this.orden.set(null);
    }
  }

  protected ariaSort(columna: ColumnaTabla<T>): 'ascending' | 'descending' | 'none' {
    const actual = this.orden();
    if (actual?.clave !== columna.clave) return 'none';
    return actual.direccion === 'asc' ? 'ascending' : 'descending';
  }

  protected accionesDe(fila: T): AccionTabla<T>[] {
    return this.acciones().filter((a) => !a.visible || a.visible(fila));
  }

  protected emitir(accion: AccionTabla<T>, fila: T): void {
    this.accion.emit({ accion: accion.id, fila });
  }

  protected irAPagina(pagina: number): void {
    this.pagina.set(Math.min(Math.max(pagina, 0), this.totalPaginas() - 1));
  }

  /** Texto de la celda según su tipo (moneda, fecha...). */
  protected textoCelda(columna: ColumnaTabla<T>, fila: T): string {
    const valor = columna.valor(fila);
    switch (columna.tipo) {
      case 'moneda':
        return formatearMoneda(Number(valor));
      case 'fecha':
        return formatearFecha(String(valor));
      case 'estado':
        return ETIQUETA_ESTADO[valor as EstadoGasto] ?? String(valor);
      default:
        return String(valor);
    }
  }

  protected colorEstado(columna: ColumnaTabla<T>, fila: T): string {
    return COLOR_ESTADO[columna.valor(fila) as EstadoGasto] ?? 'medium';
  }
}
