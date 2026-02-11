import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Todos } from './components/todos/todos';
import { authGuard } from './core/auth-guard';
import { Users } from './components/users/users';

export const routes: Routes = [
    { path: 'login', component: Login }, //login /register page - should rename
    { 
        path: 'todos', 
        component: Todos,
        canActivate: [authGuard] 
    },
    {
        path: 'users',
        component: Users,
        canActivate: [authGuard],
    },
    { path: '', redirectTo: '/todos', pathMatch: 'full' }
];