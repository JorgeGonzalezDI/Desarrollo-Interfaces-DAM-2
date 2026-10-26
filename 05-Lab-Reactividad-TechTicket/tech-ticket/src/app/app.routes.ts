import { Routes } from '@angular/router';

export const routes: Routes = [
  // Única pantalla de la app: el panel de tickets (lazy loading)
  {
    path: '',
    loadComponent: () =>
      import('./features/ticket-dashboard/ticket-dashboard.component').then((m) => m.TicketDashboardComponent),
  },

  // Comodín: cualquier URL que no encaje vuelve al panel
  { path: '**', redirectTo: '' },
];
