/** Columna de un informe: título visible y cómo obtener el valor de cada fila. */
export interface ColumnaInforme<T> {
  titulo: string;
  valor: (fila: T) => string | number;
}

/**
 * Genera un CSV compatible con Excel en español:
 *  - separador ';' (la coma es el separador decimal en es-ES),
 *  - BOM UTF-8 al principio para que Excel lea bien tildes y eñes,
 *  - comillas en los campos que contienen ; " o saltos de línea (RFC 4180).
 */
export function generarCsv<T>(filas: readonly T[], columnas: readonly ColumnaInforme<T>[]): string {
  const escapar = (valor: string | number): string => {
    const texto = typeof valor === 'number' ? String(valor).replace('.', ',') : valor;
    return /[;"\n\r]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
  };
  const cabecera = columnas.map((c) => escapar(c.titulo)).join(';');
  const cuerpo = filas.map((fila) => columnas.map((c) => escapar(c.valor(fila))).join(';'));
  return '﻿' + [cabecera, ...cuerpo].join('\r\n');
}

/** Descarga un archivo generado en el navegador (sin pasar por ningún servidor). */
export function descargarArchivo(contenido: BlobPart, nombre: string, tipo: string): void {
  const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  enlace.click();
  URL.revokeObjectURL(url);
}
