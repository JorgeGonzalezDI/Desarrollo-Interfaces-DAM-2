import { Service } from '@angular/core';
import { User } from '../models/user.model';

// Servicio: aquí van los datos y la lógica, separados de la página que los pinta.
// @Service() (Angular 22) equivale a @Injectable({ providedIn: 'root' }):
// Angular crea UNA sola instancia para toda la app y se la da a quien la pida con inject(Users).
@Service()
export class Users {

  // Datos de prueba (más adelante vendrían de una API).
  // private: solo se usan desde los métodos de este servicio.
  private users: User[] = [
    { id: 1, name: 'Ana', email: 'ana@test.com', active: true },
    { id: 2, name: 'Luis', email: 'luis@test.com', active: false },
    { id: 3, name: 'Carlos', email: 'carlos@test.com', active: true },
    { id: 4, name: 'Marta', email: 'marta@test.com', active: true },
  ];

  // Simula una petición a un servidor que tarda 0,8 segundos.
  // Devuelve una Promise ("te prometo un User[] más adelante");
  // resolve(...) cumple la promesa y entrega los datos.
  getUsers(): Promise<User[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(this.users), 800);
    });
  }

  // Devuelve solo los usuarios activos.
  // await espera a que getUsers() termine sin bloquear la app;
  // filter() se queda con los elementos que cumplen la condición (u.active === true).
  async getActiveUsers(): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter((u) => u.active);
  }

}
