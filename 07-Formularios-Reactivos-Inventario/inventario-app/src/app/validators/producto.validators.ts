import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/*
 * Validadores personalizados (Custom Validators) del formulario de productos.
 *
 * Un validador es una función que recibe el control (el campo) y devuelve:
 *   - null                -> el valor es válido
 *   - un objeto de errores -> el valor NO es válido, p. ej. { skuCaracteres: true }
 *
 * Si el campo está vacío devuelven null: de eso ya se encarga Validators.required,
 * así cada validador comprueba una sola cosa y los mensajes de error no se pisan.
 */

/**
 * Fábrica de validador: recibe la longitud y DEVUELVE el validador.
 * Comprueba que el SKU tenga solo letras y números y exactamente `longitud` caracteres.
 * Uso: skuValidator(12)
 */
export function skuValidator(longitud: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const valor: string = control.value ?? '';

    if (valor === '') {
      return null;
    }

    if (!/^[A-Za-z0-9]+$/.test(valor)) {
      return { skuCaracteres: true };
    }

    if (valor.length !== longitud) {
      return { skuLongitud: { requerida: longitud, actual: valor.length } };
    }

    return null;
  };
}

/**
 * Validador directo (sin fábrica): rechaza un texto que solo tenga espacios.
 * Validators.required da por bueno "   ", este no.
 */
export const noSoloEspaciosValidator: ValidatorFn = (control) => {
  const valor = control.value;

  if (typeof valor === 'string' && valor.length > 0 && valor.trim().length === 0) {
    return { soloEspacios: true };
  }

  return null;
};

/**
 * Validador directo: el stock mínimo tiene que ser un número entero mayor que 0.
 * (Validators.min(1) dejaría pasar 2.5, y en un almacén no hay medias unidades.)
 */
export const enteroPositivoValidator: ValidatorFn = (control) => {
  const valor = control.value;

  if (valor === null || valor === '') {
    return null;
  }

  const numero = Number(valor);

  if (Number.isNaN(numero)) {
    return { noNumerico: true };
  }

  if (numero <= 0) {
    return { noPositivo: true };
  }

  if (!Number.isInteger(numero)) {
    return { noEntero: true };
  }

  return null;
};
