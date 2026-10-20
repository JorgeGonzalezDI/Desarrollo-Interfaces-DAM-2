import { textoError } from './texto-error';

describe('textoError', () => {
  it('traduce las credenciales incorrectas', () => {
    expect(textoError({ message: 'Invalid login credentials' })).toBe('Email o contraseña incorrectos.');
  });

  it('traduce el email duplicado (UNIQUE)', () => {
    expect(textoError({ code: '23505', message: 'duplicate key' })).toBe('Ya existe un cliente con ese email.');
  });

  it('traduce el bloqueo de RLS', () => {
    expect(textoError({ code: '42501', message: 'row-level security' })).toContain('administradores');
  });

  it('deja pasar cualquier otro mensaje', () => {
    expect(textoError({ message: 'otro' })).toBe('otro');
  });
});
