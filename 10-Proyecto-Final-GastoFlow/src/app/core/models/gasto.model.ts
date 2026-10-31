/**
 * Modelo de datos de los gastos (lo que devuelve la API REST de Supabase).
 * Analogía Java: son los DTO / POJO que mapean las tablas.
 */

export type EstadoGasto = 'pendiente' | 'aprobado' | 'rechazado';

/**
 * Parte "documento" (NoSQL) del gasto: columna jsonb cuyos campos dependen
 * de la categoría (los kilómetros solo tienen sentido en un desplazamiento).
 */
export interface DetallesGasto {
  proveedor?: string;
  metodo_pago?: string;
  kilometros?: number;
  notas?: string;
  demo?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  icono: string;
  limite_mensual: number;
}

export interface Gasto {
  id: number;
  empleado_id: string;
  categoria_id: number;
  fecha: string; // ISO yyyy-mm-dd
  importe: number;
  descripcion: string;
  estado: EstadoGasto;
  detalles: DetallesGasto;
  motivo_rechazo: string | null;
  revisado_en: string | null;
  creado_en: string;
  /** Recursos "embebidos" por la API REST (join automático por clave foránea). */
  empleado: { nombre: string; departamento: string } | null;
  categoria: { nombre: string; icono: string } | null;
}

/** Lo que envía el formulario de alta (el resto lo pone la base de datos). */
export interface NuevoGasto {
  categoria_id: number;
  fecha: string;
  importe: number;
  descripcion: string;
  detalles: DetallesGasto;
}

export const ETIQUETA_ESTADO: Readonly<Record<EstadoGasto, string>> = {
  pendiente: 'Pendiente',
  aprobado: 'Aprobado',
  rechazado: 'Rechazado',
};

/** Color de Ionic de cada estado (siempre acompañado de texto, nunca solo color). */
export const COLOR_ESTADO: Readonly<Record<EstadoGasto, string>> = {
  pendiente: 'warning',
  aprobado: 'success',
  rechazado: 'danger',
};

export const DEPARTAMENTOS = ['Administración', 'Comercial', 'IT', 'Marketing', 'Operaciones'] as const;
export const METODOS_PAGO = ['Tarjeta de empresa', 'Efectivo', 'Transferencia'] as const;
