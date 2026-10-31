import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, catchError, first, map, of, switchMap, timer } from 'rxjs';

import { hoyIso } from './formato';

/** La fecha (yyyy-mm-dd) no puede ser posterior a hoy. */
export const fechaNoFutura: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = control.value as string | null;
  return valor && valor > hoyIso() ? { fechaFutura: true } : null;
};

/** Validador de GRUPO: los dos campos de contraseña deben coincidir. */
export function coincidenPasswords(campo: string, confirmacion: string): ValidatorFn {
  return (grupo: AbstractControl): ValidationErrors | null => {
    const a = grupo.get(campo)?.value as string | undefined;
    const b = grupo.get(confirmacion)?.value as string | undefined;
    return a && b && a !== b ? { passwordsDistintas: true } : null;
  };
}

/** Contraseña segura: al menos 8 caracteres, una letra y un número. */
export const passwordSegura: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = (control.value as string | null) ?? '';
  if (!valor) return null;
  return valor.length >= 8 && /[a-zA-Z]/.test(valor) && /\d/.test(valor) ? null : { passwordDebil: true };
};

/**
 * VALIDADOR ASÍNCRONO: consulta al servidor si el correo ya está registrado.
 *  - timer(400): espera a que el usuario deje de escribir (debounce) para no lanzar
 *    una petición por cada tecla.
 *  - switchMap: si llega otra tecla, la petición anterior se cancela.
 *  - Mientras tanto el control está en estado PENDING (la vista enseña "Comprobando...").
 *  - Si falla la red, no se bloquea el registro: el servidor volverá a comprobarlo.
 */
export function emailDisponibleValidator(consulta: (email: string) => Observable<boolean>): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = ((control.value as string | null) ?? '').trim().toLowerCase();
    if (!email) {
      return of(null);
    }
    return timer(400).pipe(
      switchMap(() => consulta(email)),
      map((disponible) => (disponible ? null : { emailOcupado: true })),
      catchError(() => of(null)),
      first(),
    );
  };
}
