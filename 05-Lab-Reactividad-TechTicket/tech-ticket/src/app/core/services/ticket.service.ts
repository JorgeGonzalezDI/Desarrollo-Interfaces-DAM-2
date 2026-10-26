import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ticket } from '../models/ticket.model';

// Forma del estado interno: datos + si está cargando + el error (patrón Store).
interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

// TicketService es la ÚNICA fuente de la verdad (Store / patrón MVVM).
// SRP: este servicio solo gestiona el estado de los tickets, nada de vista.
// OCP: "state" es privado y solo se expone en solo lectura con computed().
// DIP: se inyecta con inject(HttpClient), no con "new", así es fácil de testear con mocks.
@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = 'https://jsonplaceholder.typicode.com/todos?_limit=15';

  // Un único signal privado con todo el estado (datos, carga y error a la vez)
  private state = signal<TicketState>({ tickets: [], loading: true, error: null });

  // Señales derivadas de solo lectura: el componente no puede hacer tickets.set(...)
  readonly tickets = computed(() => this.state().tickets);
  readonly isLoading = computed(() => this.state().loading);
  readonly errorMessage = computed(() => this.state().error);

  constructor() {
    this.fetchTickets(); // primera carga al crear el servicio
  }

  // Pide los 15 tickets a la API. Se puede volver a llamar (botón "Reintentar").
  fetchTickets(): void {
    this.state.update((s) => ({ ...s, loading: true, error: null }));

    this.http.get<Ticket[]>(this.apiUrl).subscribe({
      next: (tickets) => this.state.set({ tickets, loading: false, error: null }),
      error: () => this.state.set({ tickets: [], loading: false, error: 'No se han podido cargar los tickets.' }),
    });
  }
}
