// Forma de una fila de la tabla `products` de Supabase.
// Los nombres coinciden EXACTAMENTE con las columnas de la base de datos
// (por eso created_at va con guion bajo): así lo que llega de Supabase
// encaja sin tener que convertir nada.
export interface Product {
  id: number;
  name: string;
  description: string | null; // puede venir vacío (null) porque en la tabla no es NOT NULL
  price: number;
  stock: number;
  created_at: string; // las fechas viajan como texto ISO: "2026-11-08T20:59:00Z"
}

// Lo que enviamos al CREAR o EDITAR: sin id ni created_at,
// porque los pone la base de datos sola.
export type ProductInput = Pick<Product, 'name' | 'description' | 'price' | 'stock'>;