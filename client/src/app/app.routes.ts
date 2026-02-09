import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Todos } from './components/todos/todos';
import { authGuard } from './core/auth-guard';

export const routes: Routes = [
    { path: 'login', component: Login }, //login /register page - should rename
    { 
        path: 'todos', 
        component: Todos,
        canActivate: [authGuard] 
    },
    { path: '', redirectTo: '/todos', pathMatch: 'full' }
];