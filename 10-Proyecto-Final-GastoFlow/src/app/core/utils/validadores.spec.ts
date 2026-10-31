import { FormControl, FormGroup } from '@angular/forms';
import { firstValueFrom, of, Observable } from 'rxjs';

import { hoyIso } from './formato';
import { coincidenPasswords, emailDisponibleValidator, fechaNoFutura, passwordSegura } from './validadores';

describe('Validadores', () => {
  it('fechaNoFutura acepta hoy y rechaza mañana', () => {
    const manana = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
    expect(fechaNoFutura(new FormControl(hoyIso()))).toBeNull();
    expect(fechaNoFutura(new FormControl(manana))).toEqual({ fechaFutura: true });
  });

  it('passwordSegura exige 8 caracteres con letras y números', () => {
    expect(passwordSegura(new FormControl('corta1'))).toEqual({ passwordDebil: true });
    expect(passwordSegura(new FormControl('sinnumeros'))).toEqual({ passwordDebil: true });
    expect(passwordSegura(new FormControl('Segura2026'))).toBeNull();
  });

  it('coincidenPasswords marca el grupo si las contraseñas no coinciden', () => {
    const grupo = new FormGroup(
      { password: new FormControl('Clave2026'), confirmar: new FormControl('Otra2026') },
      { validators: coincidenPasswords('password', 'confirmar') },
    );
    expect(grupo.hasError('passwordsDistintas')).toBe(true);
    grupo.controls.confirmar.setValue('Clave2026');
    expect(grupo.hasError('passwordsDistintas')).toBe(false);
  });

  it('emailDisponibleValidator devuelve emailOcupado si el servidor dice que no está libre', async () => {
    const validador = emailDisponibleValidator(() => of(false));
    const resultado = await firstValueFrom(validador(new FormControl('ya@existe.com')) as Observable<unknown>);
    expect(resultado).toEqual({ emailOcupado: true });
  });
});
