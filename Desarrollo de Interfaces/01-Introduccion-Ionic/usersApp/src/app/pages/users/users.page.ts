import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../services/users.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.page.html'
})
export class UsersPage implements OnInit {
  // signals: cuando cambian con .set(...), Angular repinta la vista solo.
  // (con una propiedad normal, en las versiones nuevas de Angular ya no
  // se entera automaticamente de cambios que vienen de un async/await).
  users = signal<User[]>([]);
  loading = signal(false);

  constructor(private usersService: UsersService) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async loadUsers() {
    try {
      this.loading.set(true);
      const data = await this.usersService.getActiveUsers();
      this.users.set(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
