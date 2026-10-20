import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { logInOutline } from 'ionicons/icons';

import { SupabaseService } from '../services/supabase.service';
import { textoError } from '../utils/texto-error';

/**
 * Pantalla de login. El laboratorio "asume que ya estás logueado", pero sin login
 * las políticas RLS no dejan leer nada; por eso esta página existe (RA 3, CE 3.d:
 * eventos de autenticación).
 */
@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonIcon,
    IonNote,
    IonToast,
  ],
})
export class LoginPage implements OnInit {
  private supabaseService = inject(SupabaseService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  entrando = signal(false);
  toastMessage = signal('');
  isToastOpen = signal(false);

  constructor() {
    addIcons({ logInOutline });
  }

  async ngOnInit() {
    // Si ya había sesión guardada, directamente a home
    await this.supabaseService.sessionReady;
    if (this.supabaseService.currentUser()) {
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    }
  }

  async login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.entrando.set(true);
    try {
      const { email, password } = this.loginForm.getRawValue();
      await this.supabaseService.login(email, password);
      this.isToastOpen.set(false); // por si quedaba abierto un error de un intento anterior
      this.loginForm.reset();
      await this.router.navigateByUrl('/home', { replaceUrl: true });
    } catch (e) {
      this.showToast(textoError(e));
    } finally {
      this.entrando.set(false);
    }
  }

  mensajeError(campo: 'email' | 'password'): string {
    const errores = this.loginForm.controls[campo].errors;
    if (!errores) return '';
    if (errores['required']) return campo === 'email' ? 'Escribe tu email.' : 'Escribe tu contraseña.';
    if (errores['email']) return 'Ese email no es válido.';
    if (errores['minlength']) return 'Mínimo 6 caracteres.';
    return 'Valor no válido.';
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    this.isToastOpen.set(true);
  }
}
