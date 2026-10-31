/** Funciones puras de formato (es-ES). Puras = mismo resultado para la misma entrada: fáciles de testear. */

const MONEDA = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });
const FECHA = new Intl.DateTimeFormat('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' });
const MES = new Intl.DateTimeFormat('es-ES', { month: 'short', year: '2-digit', timeZone: 'UTC' });

export function formatearMoneda(valor: number): string {
  return MONEDA.format(valor);
}

/** '2026-10-31' -> '31/10/2026' */
export function formatearFecha(iso: string): string {
  return FECHA.format(new Date(`${iso.slice(0, 10)}T00:00:00Z`));
}

/** '2026-10-31' -> '2026-10' (para agrupar por mes) */
export function claveMes(iso: string): string {
  return iso.slice(0, 7);
}

/** '2026-10' -> 'oct 26' */
export function nombreMes(clave: string): string {
  return MES.format(new Date(`${clave}-01T00:00:00Z`));
}

/** Fecha de hoy en formato ISO (yyyy-mm-dd) y en hora local. */
export function hoyIso(): string {
  const hoy = new Date();
  const local = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}
