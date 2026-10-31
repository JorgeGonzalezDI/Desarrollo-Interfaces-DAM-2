import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { IonIcon } from '@ionic/angular';

import { formatearMoneda } from '../../../core/utils/formato';

/**
 * WIDGET ESTADÍSTICO reutilizable (Fase 2): muestra un dato clave (KPI).
 * Agnóstico: recibe título, valor, formato, icono y color por inputs.
 * Si "seleccionable" es true se comporta como un botón y emite (seleccionado)
 * al padre, que decide qué hacer (en el cuadro de mando, filtrar por estado).
 */
@Component({
  selector: 'app-widget-estadistico',
  templateUrl: './widget-estadistico.component.html',
  styleUrls: ['./widget-estadistico.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, IonIcon],
})
export class WidgetEstadisticoComponent {
  public readonly titulo = input.required<string>();
  public readonly valor = input.required<number>();
  public readonly formato = input<'moneda' | 'numero' | 'porcentaje'>('numero');
  public readonly icono = input('stats-chart-outline');
  public readonly color = input<'primary' | 'success' | 'warning' | 'danger' | 'medium'>('primary');
  public readonly descripcion = input<string>('');
  public readonly seleccionable = input(false);
  public readonly activo = input(false);

  public readonly seleccionado = output<void>();

  protected readonly valorFormateado = computed(() => {
    const valor = this.valor();
    switch (this.formato()) {
      case 'moneda':
        return formatearMoneda(valor);
      case 'porcentaje':
        return `${Math.round(valor)} %`;
      default:
        return new Intl.NumberFormat('es-ES').format(valor);
    }
  });

  protected seleccionar(): void {
    if (this.seleccionable()) {
      this.seleccionado.emit();
    }
  }
}
