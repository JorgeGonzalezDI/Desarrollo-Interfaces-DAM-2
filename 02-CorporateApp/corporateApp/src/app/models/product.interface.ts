// MODELO: describe la forma de un producto.
// Una interface solo existe en TypeScript (no genera código JavaScript):
// sirve para que el editor y el compilador avisen si usamos mal un campo.
export interface Product {
  id: number;
  nombre: string;
  vendedor: string;   // campo añadido en la ampliación (se muestra en el grid)
  unidades: number;
  precio: number;
  foto: string;       // ruta de la imagen dentro de src/assets
}
