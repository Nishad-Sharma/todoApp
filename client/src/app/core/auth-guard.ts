import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // if someone logged in
    if (authService.currentUser()) {
        return true;
    }

    // otherwise check session cookie with server
    return authService.checkSession().pipe(
        map(user => { // map stays in same stream
            authService.currentUser.set(user);
            return true;
        }),
        catchError(() => { // catchError provides its own stream, need of(false) to return observable of false
            router.navigate(['/login']);
            return of(false);
        })
    );
};