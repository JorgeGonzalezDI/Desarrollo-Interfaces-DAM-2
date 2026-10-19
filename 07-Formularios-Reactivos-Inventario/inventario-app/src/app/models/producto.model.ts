// Categorías que puede elegir el operario en el <ion-select>.
// "as const" hace que TypeScript las trate como valores fijos, no como string cualquiera.
export const CATEGORIAS = ['Electrónica', 'Herramientas', 'Consumibles'] as const;

// Tipo que solo admite uno de los tres valores de arriba.
export type Categoria = (typeof CATEGORIAS)[number];

// Lo que sale del formulario (lo que rellena el operario).
export interface NuevoProducto {
  sku: string; // código de barras: 12 caracteres alfanuméricos
  nombre: string;
  categoria: Categoria;
  stockMinimo: number; // unidades, entero mayor que 0
}

// Lo que se guarda en el dispositivo: lo anterior + datos que pone la app.
export interface Producto extends NuevoProducto {
  id: string;
  fechaAlta: string; // fecha ISO, p. ej. "2026-10-19T10:30:00.000Z"
}
