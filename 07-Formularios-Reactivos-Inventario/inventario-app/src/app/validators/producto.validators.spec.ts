import { FormControl } from '@angular/forms';
import { enteroPositivoValidator, noSoloEspaciosValidator, skuValidator } from './producto.validators';

// Con Reactive Forms los validadores se prueban sin pintar nada en pantalla (sin DOM):
// se crea un FormControl con el valor y se miran sus errores.

describe('skuValidator(12)', () => {
  const validar = (valor: string) => new FormControl(valor, skuValidator(12)).errors;

  it('acepta 12 letras y números', () => {
    expect(validar('ABC123DEF456')).toBeNull();
  });

  it('deja el vacío para Validators.required', () => {
    expect(validar('')).toBeNull();
  });

  it('rechaza menos de 12 caracteres', () => {
    expect(validar('ABC123')).toEqual({ skuLongitud: { requerida: 12, actual: 6 } });
  });

  it('rechaza símbolos y espacios', () => {
    expect(validar('ABC-123 DEF4')).toEqual({ skuCaracteres: true });
  });
});

describe('noSoloEspaciosValidator', () => {
  it('rechaza un nombre que solo tiene espacios', () => {
    expect(new FormControl('   ', noSoloEspaciosValidator).errors).toEqual({ soloEspacios: true });
  });

  it('acepta un nombre normal', () => {
    expect(new FormControl('Taladro', noSoloEspaciosValidator).errors).toBeNull();
  });
});

describe('enteroPositivoValidator', () => {
  const validar = (valor: number | null) => new FormControl(valor, enteroPositivoValidator).errors;

  it('acepta enteros mayores que 0', () => {
    expect(validar(5)).toBeNull();
  });

  it('rechaza 0 y negativos', () => {
    expect(validar(0)).toEqual({ noPositivo: true });
    expect(validar(-3)).toEqual({ noPositivo: true });
  });

  it('rechaza decimales', () => {
    expect(validar(2.5)).toEqual({ noEntero: true });
  });
});
