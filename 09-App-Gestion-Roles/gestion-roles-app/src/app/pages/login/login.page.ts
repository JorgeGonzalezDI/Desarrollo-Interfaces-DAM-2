import { Component, inject, signal } from '@angular/core';
// ReactiveFormsModule: lo que permite usar [formGroup] y formControlName en el HTML
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonInput, IonItem } from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  // En un componente standalone, lo que usa el HTML hay que listarlo aquí
  imports: [ReactiveFormsModule, IonContent, IonItem, IonInput, IonButton],
})
export class LoginPage {
  // inject() pide una dependencia sin escribirla en un constructor
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  // El formulario es un objeto con un control por campo.
  // [valorInicial, validadores]: Validators.required = obligatorio, Validators.email = formato de email.
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  // Señales: sin zone.js, son lo que avisa a Angular de que la vista debe repintarse.
  readonly loading = signal(false);
  readonly error = signal<string | null>(null); // string | null = o un texto, o nada

  // async: la función espera (await) a que Supabase responda
  async submit(): Promise<void> {
    if (this.form.invalid) return; // si no pasa los validadores, no hacemos nada

    this.loading.set(true);
    this.error.set(null);

    try {
      // getRawValue() devuelve { email: string, password: string } ya tipado
      const { email, password } = this.form.getRawValue();
      await this.auth.login(email, password); // lanza error si las credenciales son malas
      await this.router.navigateByUrl('/products'); // todo bien: vamos a productos
    } catch {
      this.error.set('Email o contraseña incorrectos');
    } finally {
      this.loading.set(false); // se ejecuta siempre, haya ido bien o mal
    }
  }
}