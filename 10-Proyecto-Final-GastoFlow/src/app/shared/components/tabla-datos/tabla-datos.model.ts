/** Tipos de celda que sabe pintar la tabla. */
export type TipoColumna = 'texto' | 'moneda' | 'fecha' | 'estado';

/** Definición de una columna: la tabla no sabe nada de "gastos", solo de columnas. */
export interface ColumnaTabla<T> {
  /** Identificador único de la columna (se usa para ordenar). */
  clave: string;
  titulo: string;
  /** Cómo obtener el valor de la celda a partir de la fila. */
  valor: (fila: T) => string | number;
  tipo?: TipoColumna;
  ordenable?: boolean;
  /** Ocultar en móvil para ganar espacio (la información sigue en el resto). */
  ocultarEnMovil?: boolean;
}

/** Botón de acción por fila (p. ej. aprobar, rechazar, eliminar). */
export interface AccionTabla<T> {
  id: string;
  etiqueta: string;
  icono: string;
  color?: string;
  /** Si se indica, el botón solo aparece en las filas que cumplan la condición. */
  visible?: (fila: T) => boolean;
}

/** Evento que la tabla emite al componente padre cuando se pulsa una acción. */
export interface EventoAccionTabla<T> {
  accion: string;
  fila: T;
}

export interface OrdenTabla {
  clave: string;
  direccion: 'asc' | 'desc';
}
