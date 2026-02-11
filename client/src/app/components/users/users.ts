import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, User } from '../../services/users';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
    private usersService = inject(UsersService);
    
    users = signal<User[]>([]);
    error = signal('');

    ngOnInit() {
        this.usersService.getAllUsers().subscribe({
            next: (data) => this.users.set(data),
            error: (err) => {
                console.error(err);
                this.error.set('loading users failed.');
            }
        });
    }
}