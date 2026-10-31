import { PERMISOS_POR_ROL } from './rol.model';

describe('Modelo RBAC (PERMISOS_POR_ROL)', () => {
  it('el administrador tiene todos los permisos del empleado', () => {
    for (const permiso of PERMISOS_POR_ROL.empleado) {
      expect(PERMISOS_POR_ROL.admin).toContain(permiso);
    }
  });

  it('el empleado NO puede aprobar, ver el cuadro de mando ni exportar', () => {
    expect(PERMISOS_POR_ROL.empleado).not.toContain('gastos:aprobar');
    expect(PERMISOS_POR_ROL.empleado).not.toContain('dashboard:ver');
    expect(PERMISOS_POR_ROL.empleado).not.toContain('informes:exportar');
  });
});
