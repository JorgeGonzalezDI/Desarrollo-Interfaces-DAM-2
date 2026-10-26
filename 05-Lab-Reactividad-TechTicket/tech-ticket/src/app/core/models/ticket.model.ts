// Forma de cada ticket tal como lo devuelve la API (jsonplaceholder.typicode.com/todos).
// En esta práctica un "todo" hace de incidencia: completed=false es un ticket abierto
// y completed=true es un ticket ya resuelto.
export interface Ticket {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}
