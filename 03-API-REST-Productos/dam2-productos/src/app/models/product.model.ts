// Dimensiones físicas del producto (la API las da en cm)
export interface Dimensions {
  width: number;   // ancho
  height: number;  // alto
  depth: number;   // fondo
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;          // CAMBIO: el ? = "opcional": algunos productos no traen marca
  thumbnail: string;
  dimensions: Dimensions;  // NUEVO: petición 1
}

// La API no devuelve un array directamente, sino un objeto que lo envuelve
export interface ProductsResponse {
  products: Product[];   // la lista de productos
  total: number;         // cuántos productos hay en total en la API (194)
  skip: number;          // cuántos se ha saltado (lo usaremos para paginar)
  limit: number;         // cuántos devuelve por petición (30 por defecto)
}