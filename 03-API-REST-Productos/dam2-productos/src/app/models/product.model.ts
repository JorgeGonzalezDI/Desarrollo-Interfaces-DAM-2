// Dimensiones físicas del producto (la API las da en cm)
export interface Dimensions {
  width: number;   // ancho
  height: number;  // alto
  depth: number;   // fondo
}

// Un producto tal y como lo devuelve https://dummyjson.com/products
export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;          // opcional: algunos productos no traen marca
  thumbnail: string;
  dimensions: Dimensions;  // petición del cliente nº 1
}

// La API no devuelve un array directamente, sino un objeto que lo envuelve
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
