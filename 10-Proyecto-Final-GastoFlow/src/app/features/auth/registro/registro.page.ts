import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonHeader,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

import { AuthService } from '../../../core/auth/auth.service';
import { UsuariosService } from '../../../core/data/usuarios.service';
import { DEPARTAMENTOS } from '../../../core/models/gasto.model';
import {
  coincidenPasswords,
  emailDisponibleValidator,
  passwordSegura,
} from '../../../core/utils/validadores';

/**
 * Alta de usuario (Fase 1.2): formulario reactivo con
 *  - validaciones síncronas (obligatorio, formato, contraseña segura),
 *  - validación ASÍNCRONA contra el servidor (¿el correo ya existe?),
 *  - validación de GRUPO (las dos contraseñas coinciden).
 * Toda cuenta nueva nace con rol 'empleado' (lo decide la base de datos, no el formulario).
 */
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
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
    IonSelect,
    IonSelectOption,
    IonButton,
    IonSpinner,
    IonText,
  ],
})
export class RegistroPage {
  private readonly auth = inject(AuthService);
  private readonly usuarios = inject(UsuariosService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  protected readonly departamentos = DEPARTAMENTOS;

  public readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      email: this.fb.nonNullable.control('', {
        validators: [Validators.required, Validators.email],
        asyncValidators: [emailDisponibleValidator((email) => this.usuarios.emailDisponible(email))],
        updateOn: 'change',
      }),
      departamento: ['', Validators.required],
      password: ['', [Validators.required, passwordSegura]],
      confirmar: ['', Validators.required],
    },
    { validators: coincidenPasswords('password', 'confirmar') },
  );

  public readonly enviando = signal(false);
  public readonly error = signal('');

  /** Mensaje de error del campo (solo cuando el usuario ya lo ha tocado). */
  public errorDe(campo: keyof typeof this.form.controls): string {
    const control = this.form.controls[campo];
    if (!control.errors || !(control.touched || control.dirty)) return '';
    const e = control.errors;
    if (e['required']) return 'Este campo es obligatorio.';
    if (e['email']) return 'Introduce un correo válido.';
    if (e['emailOcupado']) return 'Ya existe una cuenta con este correo.';
    if (e['minlength']) return `Mínimo ${e['minlength'].requiredLength} caracteres.`;
    if (e['maxlength']) return `Máximo ${e['maxlength'].requiredLength} caracteres.`;
    if (e['passwordDebil']) return 'Mínimo 8 caracteres, con letras y números.';
    return 'Revisa este campo.';
  }

  public passwordsDistintas(): boolean {
    return this.form.hasError('passwordsDistintas') && this.form.controls.confirmar.dirty;
  }

  public async registrar(): Promise<void> {
    if (this.form.invalid || this.form.pending) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    try {
      const { nombre, email, departamento, password } = this.form.getRawValue();
      await this.auth.registrar({ nombre, email, departamento, password });
      await this.router.navigateByUrl('/inicio', { replaceUrl: true });
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'No se ha podido crear la cuenta.');
    } finally {
      this.enviando.set(false);
    }
  }
}
