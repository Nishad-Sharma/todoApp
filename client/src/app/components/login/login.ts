import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './login.html',
    styleUrl: './login.scss'
})
export class Login {
    private fb = inject(FormBuilder);
    private authService = inject(AuthService);

    isLoginMode = signal(true);
    errorMessage = signal('');

    form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
    });

    // clear form state
    toggleMode() {
        this.isLoginMode.update(prev => !prev);
        this.errorMessage.set('');
        this.form.reset();
    }

    submit() {
        if (this.form.invalid) return;

        const credentials = this.form.value;
        
        const action$ = this.isLoginMode() 
        ? this.authService.login(credentials)
        : this.authService.register(credentials);

        action$.subscribe({
            next: () => {
                if (!this.isLoginMode()) {
                    alert('Registration successful! Please log in.');
                    this.toggleMode();
                }
            },
            error: (err) => {
                if (this.isLoginMode()) {
                    if (err.status === 429) {
                        this.errorMessage.set('Too many login attempts. Please try again later.');
                    } else {
                        this.errorMessage.set('Login failed. Incorrect credentials.');
                    }
                } else {
                    this.errorMessage.set('Registration failed. Please try again.');
                }
            }
        });
    }
}