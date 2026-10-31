import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  input,
  viewChild,
} from '@angular/core';
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart,
  ChartConfiguration,
  DoughnutController,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js';

// Solo se registran las piezas de Chart.js que se usan (bundle más pequeño).
Chart.register(BarController, BarElement, DoughnutController, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

/**
 * GRÁFICO reutilizable que envuelve Chart.js.
 *  - Recibe la configuración por input; un effect() actualiza el gráfico cuando cambia
 *    (por ejemplo al cambiar un filtro del cuadro de mando), sin volver a crearlo.
 *  - Ciclo de vida: se crea tras el primer renderizado (afterNextRender: el <canvas> ya existe)
 *    y se DESTRUYE al salir de la página (DestroyRef) para no dejar fugas de memoria.
 *  - Accesible: el canvas es role="img" con una descripción del contenido.
 */
@Component({
  selector: 'app-grafico',
  template: `
    <figure>
      <figcaption>{{ titulo() }}</figcaption>
      <div class="lienzo"><canvas #lienzo role="img" [attr.aria-label]="descripcion()"></canvas></div>
    </figure>
  `,
  styles: `
    :host { display: block; }
    figure { margin: 0; }
    figcaption { font-weight: 600; margin-bottom: 8px; }
    .lienzo { position: relative; height: 260px; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraficoComponent {
  public readonly titulo = input.required<string>();
  public readonly descripcion = input.required<string>();
  public readonly configuracion = input.required<ChartConfiguration>();

  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private grafico: Chart | null = null;

  constructor() {
    afterNextRender(() => {
      this.grafico = new Chart(this.lienzo().nativeElement, this.configuracion());
    });

    effect(() => {
      const config = this.configuracion();
      if (this.grafico) {
        this.grafico.data = config.data;
        this.grafico.update();
      }
    });

    inject(DestroyRef).onDestroy(() => this.grafico?.destroy());
  }
}
