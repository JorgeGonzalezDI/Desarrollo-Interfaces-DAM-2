// Modelo: la "forma" que tiene un usuario (parecido a una clase POJO de Java, pero solo con tipos).
// Una interface no genera código JavaScript: sirve para que TypeScript avise
// si falta un campo o si un tipo no coincide.
export interface User {
  id: number;
  name: string;
  email: string;
  active: boolean; // true = activo (la página solo enseña los activos)
}
