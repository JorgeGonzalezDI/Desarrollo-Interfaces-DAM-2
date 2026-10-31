import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonInput,
  IonNote,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { map } from 'rxjs';

import { AuthService } from '../../../core/auth/auth.service';
import { SupabaseService } from '../../../core/supabase/supabase.service';

/**
 * Pantalla de login con FORMULARIO REACTIVO: el formulario se define en TypeScript
 * (FormBuilder) y la plantilla solo se "engancha" con [formGroup] / formControlName.
 * Así la lógica y las validaciones quedan separadas de la vista (patrón MVVM).
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    ReactiveFormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
        IonCardContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
    IonNote,
  ],
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  /** Si falta la configuración de Supabase se avisa en pantalla en vez de fallar en silencio. */
  protected readonly configurado = inject(SupabaseService).configurado;

  /** Formulario: nonNullable -> al hacer reset vuelve a '' en vez de a null. */
  public readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  // Estado de la vista con signals (obligatorio tras un await: la app no usa zone.js)
  public readonly cargando = signal(false);
  public readonly error = signal('');

  /** ?returnUrl=/admin/dashboard -> lo pone authGuard al echarte de una ruta privada. */
  public readonly returnUrl = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('returnUrl'))),
    { initialValue: null },
  );

  /** Ionic reutiliza las páginas: al volver al login se limpia la contraseña y el error. */
  ionViewWillEnter(): void {
    this.form.controls.password.reset();
    this.error.set('');
  }

  /** ¿Mostrar el error de un campo? Solo si es inválido y el usuario ya lo ha tocado. */
  public campoInvalido(campo: 'email' | 'password'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  public async entrar(): Promise<void> {
    // Si el formulario no es válido, se marcan los campos para que se vean los errores
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password);
      // Vuelve a la página que pidió antes del login, o al inicio
      await this.router.navigateByUrl(this.returnUrl() ?? '/inicio', { replaceUrl: true });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se ha podido iniciar sesión.');
    } finally {
      this.cargando.set(false);
    }
  }
}
