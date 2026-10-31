import { ColumnaTabla, OrdenTabla } from './tabla-datos.model';

/** Quita tildes y pasa a minúsculas para que "formacion" encuentre "Formación". */
export function normalizarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Filtra por texto (en todas las columnas) y ordena. Función PURA: no depende del
 * componente, así que se testea sola y el componente solo la llama desde un computed().
 */
export function filtrarYOrdenar<T>(
  filas: readonly T[],
  columnas: readonly ColumnaTabla<T>[],
  busqueda: string,
  orden: OrdenTabla | null,
): T[] {
  const termino = normalizarTexto(busqueda.trim());
  let resultado = termino
    ? filas.filter((fila) => columnas.some((c) => normalizarTexto(String(c.valor(fila))).includes(termino)))
    : [...filas];

  if (orden) {
    const columna = columnas.find((c) => c.clave === orden.clave);
    if (columna) {
      const signo = orden.direccion === 'asc' ? 1 : -1;
      resultado = resultado.sort((a, b) => {
        const va = columna.valor(a);
        const vb = columna.valor(b);
        const comparacion =
          typeof va === 'number' && typeof vb === 'number' ? va - vb : String(va).localeCompare(String(vb), 'es');
        return comparacion * signo;
      });
    }
  }
  return resultado;
}
