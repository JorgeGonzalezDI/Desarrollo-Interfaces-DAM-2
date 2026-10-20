import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  createOutline,
  eyeOutline,
  logOutOutline,
  personCircleOutline,
  saveOutline,
  trashOutline,
} from 'ionicons/icons';

import { Client } from '../models/client.model';
import { SupabaseService } from '../services/supabase.service';
import { textoError } from '../utils/texto-error';

type Campo = 'nombre' | 'empresa' | 'email';

/**
 * Página principal (Pasos 2.5 y 2.6 del laboratorio): listado de clientes para
 * cualquier usuario autenticado y formulario + editar/borrar solo para admins.
 *
 * Diferencia con el código del PDF: aquí el estado va en signals (clients, toast...)
 * en vez de propiedades normales. Este proyecto usa Angular 22 SIN zone.js, y sin
 * signals la vista no se enteraría de los cambios que llegan tras un `await`.
 */
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonChip,
    IonBadge,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonNote,
    IonInput,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonSpinner,
    IonToast,
  ],
})
export class HomePage implements OnInit {
  private supabaseService = inject(SupabaseService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Estado de la página (signals)
  clients = signal<Client[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  editingClientId = signal<string | null>(null);
  toastMessage = signal('');
  toastColor = signal<'success' | 'danger'>('success');
  isToastOpen = signal(false);

  // Señales expuestas a la vista (vienen del servicio)
  currentUser = this.supabaseService.currentUser;
  userRole = this.supabaseService.userRole;
  isAdmin = this.supabaseService.isAdmin;

  // Formulario reactivo (mismas validaciones que el laboratorio)
  clientForm = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    empresa: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
  });

  constructor() {
    addIcons({ createOutline, trashOutline, logOutOutline, personCircleOutline, eyeOutline, saveOutline });
  }

  async ngOnInit() {
    await this.loadClients();
  }

  async loadClients() {
    this.cargando.set(true);
    try {
      this.clients.set(await this.supabaseService.getClients());
    } catch (e) {
      this.showToast('Error cargando clientes: ' + textoError(e), 'danger');
    } finally {
      this.cargando.set(false);
    }
  }

  async saveClient() {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    try {
      const formValue = this.clientForm.getRawValue();
      const id = this.editingClientId();
      if (id) {
        await this.supabaseService.updateClient(id, formValue);
        this.showToast('Cliente actualizado');
      } else {
        await this.supabaseService.createClient(formValue);
        this.showToast('Cliente insertado');
      }
      this.resetForm();
      await this.loadClients();
    } catch (e) {
      this.showToast('Error de guardado: ' + textoError(e), 'danger');
    } finally {
      this.guardando.set(false);
    }
  }

  /** Opción "editar" del ion-item-sliding: carga el cliente en el formulario. */
  async editClient(client: Client, sliding: IonItemSliding) {
    await sliding.close();
    this.editingClientId.set(client.id!);
    this.clientForm.patchValue({
      nombre: client.nombre,
      empresa: client.empresa,
      email: client.email,
    });
  }

  async deleteClient(client: Client, sliding: IonItemSliding) {
    await sliding.close();
    try {
      await this.supabaseService.deleteClient(client.id!);
      this.showToast(`Cliente "${client.nombre}" eliminado`);
      await this.loadClients();
    } catch (e) {
      this.showToast('Error eliminando: ' + textoError(e), 'danger');
    }
  }

  resetForm() {
    this.clientForm.reset();
    this.editingClientId.set(null);
  }

  async logout() {
    await this.supabaseService.logout();
    this.resetForm();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  mensajeError(campo: Campo): string {
    const errores = this.clientForm.controls[campo].errors;
    if (!errores) return '';
    if (errores['required']) return 'Campo obligatorio.';
    if (errores['minlength']) return 'Mínimo 3 caracteres.';
    if (errores['email']) return 'Introduce un email válido.';
    return 'Valor no válido.';
  }

  showToast(msg: string, color: 'success' | 'danger' = 'success') {
    this.toastMessage.set(msg);
    this.toastColor.set(color);
    this.isToastOpen.set(true);
  }
}
