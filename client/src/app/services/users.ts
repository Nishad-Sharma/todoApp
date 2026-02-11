import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface User {
    id: number;
    email: string;
    role: 'USER' | 'ADMIN';
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/users';

    getAllUsers() {
        return this.http.get<User[]>(this.apiUrl);
    }
}