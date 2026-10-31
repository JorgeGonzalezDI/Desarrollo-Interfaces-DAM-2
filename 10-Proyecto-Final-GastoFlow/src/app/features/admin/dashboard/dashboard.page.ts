import { Component, computed, inject, signal } from '@angular/core';
import {
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { ChartConfiguration } from 'chart.js';
import { addIcons } from 'ionicons';
import {
  cashOutline,
  checkmarkDoneOutline,
  documentTextOutline,
  downloadOutline,
  hourglassOutline,
  receiptOutline,
} from 'ionicons/icons';

import { AuthService } from '../../../core/auth/auth.service';
import { GastosService } from '../../../core/data/gastos.service';
import { DEPARTAMENTOS, ETIQUETA_ESTADO, EstadoGasto, Gasto } from '../../../core/models/gasto.model';
import { NotificacionService } from '../../../core/ui/notificacion.service';
import { ColumnaInforme, descargarArchivo, generarCsv } from '../../../core/utils/exportar';
import { claveMes, formatearFecha, formatearMoneda, hoyIso, nombreMes } from '../../../core/utils/formato';
import { generarInformePdf } from '../../../core/utils/informe-pdf';
import { GraficoComponent } from '../../../shared/components/grafico/grafico.component';
import { ColumnaTabla } from '../../../shared/components/tabla-datos/tabla-datos.model';
import { TablaDatosComponent } from '../../../shared/components/tabla-datos/tabla-datos.component';
import { WidgetEstadisticoComponent } from '../../../shared/components/widget-estadistico/widget-estadistico.component';

type Periodo = '3' | '6' | '12' | 'todo';
type FiltroEstado = EstadoGasto | 'todos';

/** Paleta accesible (contraste suficiente sobre blanco) para las series de los gráficos. */
const PALETA = ['#1b3a5c', '#2a7f62', '#c0632a', '#7b4fa0', '#b3365b', '#4a7fb5'];

/**
 * CUADRO DE MANDO (solo Administración).
 * Todo el panel es un computed() que parte de "gastosFiltrados": al cambiar un filtro
 * o al llegar un gasto nuevo en tiempo real, widgets, gráficos y tabla se recalculan solos.
 * Reutiliza los tres componentes visuales: widget, gráfico y tabla.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonNote,
    WidgetEstadisticoComponent,
    GraficoComponent,
    TablaDatosComponent,
  ],
})
export class DashboardPage {
  protected readonly store = inject(GastosService);
  protected readonly auth = inject(AuthService);
  private readonly avisos = inject(NotificacionService);

  protected readonly departamentos = DEPARTAMENTOS;

  // ---- Filtros (signals) ----
  protected readonly periodo = signal<Periodo>('6');
  protected readonly departamento = signal<string>('todos');
  protected readonly estado = signal<FiltroEstado>('todos');
  protected readonly exportando = signal(false);

  /** Gastos que cumplen TODOS los filtros: la base de todo el panel. */
  protected readonly gastosFiltrados = computed(() => {
    const desde = this.fechaDesde();
    const dep = this.departamento();
    const est = this.estado();
    return this.store
      .gastos()
      .filter((g) => (!desde || g.fecha >= desde) && (dep === 'todos' || g.empleado?.departamento === dep))
      .filter((g) => est === 'todos' || g.estado === est);
  });

  /** Gastos por periodo y departamento, sin filtrar por estado (para los widgets por estado). */
  private readonly gastosSinFiltroEstado = computed(() => {
    const desde = this.fechaDesde();
    const dep = this.departamento();
    return this.store
      .gastos()
      .filter((g) => (!desde || g.fecha >= desde) && (dep === 'todos' || g.empleado?.departamento === dep));
  });

  protected readonly kpis = computed(() => {
    const base = this.gastosSinFiltroEstado();
    const suma = (lista: Gasto[]) => lista.reduce((t, g) => t + g.importe, 0);
    const aprobados = base.filter((g) => g.estado === 'aprobado');
    const pendientes = base.filter((g) => g.estado === 'pendiente');
    const revisados = base.filter((g) => g.estado !== 'pendiente');
    return {
      total: suma(base),
      aprobado: suma(aprobados),
      pendiente: suma(pendientes),
      numPendientes: pendientes.length,
      numGastos: base.length,
      tasaAprobacion: revisados.length ? (aprobados.length / revisados.length) * 100 : 0,
    };
  });

  // ---- Gráficos ----
  protected readonly graficoCategorias = computed<ChartConfiguration>(() => {
    const porCategoria = agrupar(this.gastosFiltrados(), (g) => g.categoria?.nombre ?? 'Sin categoría');
    return {
      type: 'doughnut',
      data: {
        labels: [...porCategoria.keys()],
        datasets: [{ data: [...porCategoria.values()], backgroundColor: PALETA }],
      },
      options: opcionesBase({ legend: true }),
    };
  });

  protected readonly graficoMeses = computed<ChartConfiguration>(() => {
    const porMes = agrupar(this.gastosFiltrados(), (g) => claveMes(g.fecha));
    const meses = [...porMes.keys()].sort();
    return {
      type: 'bar',
      data: {
        labels: meses.map(nombreMes),
        datasets: [{ label: 'Importe', data: meses.map((m) => porMes.get(m) ?? 0), backgroundColor: PALETA[0], borderRadius: 6 }],
      },
      options: opcionesBase({ legend: false }),
    };
  });

  protected readonly graficoDepartamentos = computed<ChartConfiguration>(() => {
    const porDep = agrupar(this.gastosFiltrados(), (g) => g.empleado?.departamento ?? 'Sin departamento');
    const ordenado = [...porDep.entries()].sort((a, b) => b[1] - a[1]);
    return {
      type: 'bar',
      data: {
        labels: ordenado.map(([d]) => d),
        datasets: [{ label: 'Importe', data: ordenado.map(([, v]) => v), backgroundColor: PALETA[1], borderRadius: 6 }],
      },
      options: { ...opcionesBase({ legend: false }), indexAxis: 'y' },
    };
  });

  /** Textos alternativos de los gráficos para lectores de pantalla. */
  protected readonly resumenCategorias = computed(() =>
    describir(agrupar(this.gastosFiltrados(), (g) => g.categoria?.nombre ?? 'Sin categoría')),
  );
  protected readonly resumenDepartamentos = computed(() =>
    describir(agrupar(this.gastosFiltrados(), (g) => g.empleado?.departamento ?? 'Sin departamento')),
  );
  protected readonly resumenMeses = computed(() =>
    describir(agrupar(this.gastosFiltrados(), (g) => nombreMes(claveMes(g.fecha)))),
  );

  // ---- Tabla y exportación (mismas columnas para la tabla, el CSV y el PDF) ----
  protected readonly columnasTabla: ColumnaTabla<Gasto>[] = [
    { clave: 'fecha', titulo: 'Fecha', valor: (g) => g.fecha, tipo: 'fecha', ordenable: true },
    { clave: 'empleado', titulo: 'Empleado', valor: (g) => g.empleado?.nombre ?? '—', ordenable: true },
    { clave: 'departamento', titulo: 'Departamento', valor: (g) => g.empleado?.departamento ?? '—', ordenable: true, ocultarEnMovil: true },
    { clave: 'categoria', titulo: 'Categoría', valor: (g) => g.categoria?.nombre ?? '—', ordenable: true, ocultarEnMovil: true },
    { clave: 'importe', titulo: 'Importe', valor: (g) => g.importe, tipo: 'moneda', ordenable: true },
    { clave: 'estado', titulo: 'Estado', valor: (g) => g.estado, tipo: 'estado', ordenable: true },
  ];

  private readonly columnasInforme: ColumnaInforme<Gasto>[] = [
    { titulo: 'Fecha', valor: (g) => formatearFecha(g.fecha) },
    { titulo: 'Empleado', valor: (g) => g.empleado?.nombre ?? '' },
    { titulo: 'Departamento', valor: (g) => g.empleado?.departamento ?? '' },
    { titulo: 'Categoría', valor: (g) => g.categoria?.nombre ?? '' },
    { titulo: 'Descripción', valor: (g) => g.descripcion },
    { titulo: 'Proveedor', valor: (g) => g.detalles.proveedor ?? '' },
    { titulo: 'Importe (€)', valor: (g) => g.importe },
    { titulo: 'Estado', valor: (g) => ETIQUETA_ESTADO[g.estado] },
  ];

  constructor() {
    addIcons({ cashOutline, checkmarkDoneOutline, hourglassOutline, receiptOutline, downloadOutline, documentTextOutline });
  }

  protected cambiarPeriodo(valor: unknown): void {
    this.periodo.set((valor as Periodo) ?? '6');
  }

  /** Clic en un widget (output "seleccionado"): activa o quita el filtro por ese estado. */
  protected alternarEstado(estado: EstadoGasto): void {
    this.estado.update((actual) => (actual === estado ? 'todos' : estado));
  }

  protected exportarCsv(): void {
    const csv = generarCsv(this.gastosFiltrados(), this.columnasInforme);
    descargarArchivo(csv, `gastoflow-informe-${hoyIso()}.csv`, 'text/csv;charset=utf-8');
    void this.avisos.mostrar(`CSV exportado con ${this.gastosFiltrados().length} gastos.`);
  }

  protected async exportarPdf(): Promise<void> {
    this.exportando.set(true);
    try {
      const k = this.kpis();
      await generarInformePdf({
        titulo: 'Informe de gastos',
        subtitulo: `${this.textoFiltros()} · Generado el ${formatearFecha(hoyIso())} por ${this.auth.sesion()?.nombre ?? ''}`,
        resumen: [
          { etiqueta: 'Gasto total', valor: formatearMoneda(k.total) },
          { etiqueta: 'Aprobado', valor: formatearMoneda(k.aprobado) },
          { etiqueta: 'Pendiente', valor: formatearMoneda(k.pendiente) },
          { etiqueta: 'Nº de gastos', valor: String(this.gastosFiltrados().length) },
        ],
        columnas: this.columnasInforme,
        filas: this.gastosFiltrados(),
        nombreArchivo: `gastoflow-informe-${hoyIso()}.pdf`,
      });
      await this.avisos.mostrar('Informe PDF generado.');
    } catch {
      await this.avisos.mostrar('No se ha podido generar el PDF.', 'danger');
    } finally {
      this.exportando.set(false);
    }
  }

  /** Resumen legible de los filtros activos (se muestra y se imprime en el PDF). */
  protected textoFiltros(): string {
    const periodo = this.periodo() === 'todo' ? 'Todo el histórico' : `Últimos ${this.periodo()} meses`;
    const dep = this.departamento() === 'todos' ? 'todos los departamentos' : this.departamento();
    const est = this.estado() === 'todos' ? 'todos los estados' : ETIQUETA_ESTADO[this.estado() as EstadoGasto].toLowerCase();
    return `${periodo} · ${dep} · ${est}`;
  }

  /** Primer día del periodo elegido (yyyy-mm-dd) o null para "todo". */
  private fechaDesde(): string | null {
    const meses = this.periodo();
    if (meses === 'todo') return null;
    const d = new Date();
    d.setMonth(d.getMonth() - Number(meses));
    return d.toISOString().slice(0, 10);
  }
}

/** Suma importes agrupando por la clave que devuelva la función. */
function agrupar(gastos: readonly Gasto[], clave: (g: Gasto) => string): Map<string, number> {
  const mapa = new Map<string, number>();
  for (const g of gastos) {
    const k = clave(g);
    mapa.set(k, Math.round(((mapa.get(k) ?? 0) + g.importe) * 100) / 100);
  }
  return mapa;
}

function describir(mapa: Map<string, number>): string {
  if (mapa.size === 0) return 'Sin datos para los filtros elegidos.';
  return [...mapa.entries()].map(([k, v]) => `${k}: ${formatearMoneda(v)}`).join('; ');
}

function opcionesBase({ legend }: { legend: boolean }): ChartConfiguration['options'] {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 300 },
    plugins: {
      legend: { display: legend, position: 'bottom' },
      tooltip: { callbacks: { label: (ctx) => ` ${formatearMoneda(Number(ctx.raw))}` } },
    },
  };
}
