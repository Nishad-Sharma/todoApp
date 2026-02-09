import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private http = inject(HttpClient);
    private router = inject(Router);
    private apiUrl = 'http://localhost:3000';

    currentUser = signal<any>(null);

    login(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/auth/login`, credentials) // login call expects jwt in response
        .pipe(
            tap(() => {
                this.router.navigate(['/todos']);
            })
        );
    }

    register(credentials: any) {
        return this.http.post<any>(`${this.apiUrl}/users`, credentials);
    }

    checkSession() {
        return this.http.get<any>(`${this.apiUrl}/auth/me`);
    }

}