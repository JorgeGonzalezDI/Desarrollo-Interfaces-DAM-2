import { TestBed } from '@angular/core/testing';
import { Route, Router, UrlSegment, UrlTree, provideRouter } from '@angular/router';

import { AuthService } from './auth.service';
import { permisoGuard } from './permiso.guard';

/** AuthService falso: solo lo que usa el guard. */
function authFalso(permisos: string[]) {
  return { listo: Promise.resolve(), tienePermiso: (p: string) => permisos.includes(p) };
}

describe('permisoGuard', () => {
  const segmentos = [new UrlSegment('admin', {}), new UrlSegment('dashboard', {})];

  function ejecutar(permisos: string[]) {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useValue: authFalso(permisos) }],
    });
    return TestBed.runInInjectionContext(() => permisoGuard('dashboard:ver')({} as Route, segmentos, {} as never));
  }

  it('deja pasar si el usuario tiene el permiso', async () => {
    await expect(ejecutar(['dashboard:ver'])).resolves.toBe(true);
  });

  it('redirige a /inicio?denegado=... si le falta el permiso', async () => {
    const resultado = (await ejecutar([])) as UrlTree;
    const router = TestBed.inject(Router);
    expect(router.serializeUrl(resultado)).toBe('/inicio?denegado=%2Fadmin%2Fdashboard');
  });
});
