import { ColumnaTabla } from './tabla-datos.model';
import { filtrarYOrdenar } from './tabla-datos.utils';

interface Fila {
  id: number;
  nombre: string;
  importe: number;
}

const filas: Fila[] = [
  { id: 1, nombre: 'Formación', importe: 300 },
  { id: 2, nombre: 'Dietas', importe: 20 },
  { id: 3, nombre: 'Alojamiento', importe: 150 },
];
const columnas: ColumnaTabla<Fila>[] = [
  { clave: 'nombre', titulo: 'Nombre', valor: (f) => f.nombre },
  { clave: 'importe', titulo: 'Importe', valor: (f) => f.importe },
];

describe('filtrarYOrdenar (lógica de la tabla de datos)', () => {
  it('busca sin distinguir tildes ni mayúsculas', () => {
    expect(filtrarYOrdenar(filas, columnas, 'FORMACION', null).map((f) => f.id)).toEqual([1]);
  });

  it('ordena números de mayor a menor', () => {
    const ids = filtrarYOrdenar(filas, columnas, '', { clave: 'importe', direccion: 'desc' }).map((f) => f.id);
    expect(ids).toEqual([1, 3, 2]);
  });

  it('no modifica el array original (función pura)', () => {
    filtrarYOrdenar(filas, columnas, '', { clave: 'nombre', direccion: 'asc' });
    expect(filas.map((f) => f.id)).toEqual([1, 2, 3]);
  });
});
