import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
  IonList, IonItem, IonBadge, IonSpinner, IonButton,
} from '@ionic/angular';
import { TicketService } from '../../core/services/ticket.service';

type Filtro = 'todos' | 'abiertos' | 'cerrados';

// Vista (en el patrón Store, el componente SOLO pinta y recoge eventos: filtros, reintentar).
// OnPush: Angular no vuelve a comprobar este componente en cada ciclo, solo cuando cambia
// un signal que lee la plantilla. Combinado con signals, es la forma recomendada en Angular 22.
@Component({
  selector: 'app-ticket-dashboard',
  templateUrl: './ticket-dashboard.component.html',
  styleUrl: './ticket-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel,
    IonList, IonItem, IonBadge, IonSpinner, IonButton,
  ],
})
export class TicketDashboardComponent {
  // El Store: todo el estado (tickets, carga, error) vive aquí, no en el componente
  protected readonly ticketService = inject(TicketService);

  // Único estado propio de la vista: qué pestaña está activa
  protected readonly filtroActual = signal<Filtro>('todos');

  // Se recalcula solo cuando cambian los tickets del servicio o el filtro elegido
  protected readonly ticketsFiltrados = computed(() => {
    const tickets = this.ticketService.tickets();
    switch (this.filtroActual()) {
      case 'abiertos':
        return tickets.filter((t) => !t.completed);
      case 'cerrados':
        return tickets.filter((t) => t.completed);
      default:
        return tickets;
    }
  });

  // El <ion-segment> dispara un CustomEvent; el valor nuevo viene en event.detail.value
  cambiarFiltro(event: CustomEvent): void {
    this.filtroActual.set(event.detail.value as Filtro);
  }

  reintentar(): void {
    this.ticketService.fetchTickets();
  }
}
