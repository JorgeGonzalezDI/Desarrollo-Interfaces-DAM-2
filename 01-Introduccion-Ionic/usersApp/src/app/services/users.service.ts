import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

// Simula una API REST (como la que habeis montado con Node.js/Express),
// pero sin backend real: los datos viven aqui mismo, en memoria.
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Ana', email: 'ana@test.com', active: true },
    { id: 2, name: 'Luis', email: 'luis@test.com', active: false },
    { id: 3, name: 'Carlos', email: 'carlos@test.com', active: true }
  ];

  // async + Promise para simular la latencia real de una petición HTTP
  async getUsers(): Promise<User[]> {
    return new Promise(resolve => {
      setTimeout(() => resolve(this.users), 500);
    });
  }

  async getActiveUsers(): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter(u => u.active);
  }
}
