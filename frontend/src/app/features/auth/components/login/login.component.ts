import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, LoginRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-secondary-900">
            Sign in to CareerCompass AI
          </h2>
          <p class="mt-2 text-sm text-secondary-600">
            Access your personalized career guidance platform
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                formControlName="email"
              />
              <div *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" 
                   class="text-red-600 text-sm mt-1">
                Please enter a valid email address
              </div>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                formControlName="password"
              />
              <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" 
                   class="text-red-600 text-sm mt-1">
                Password is required
              </div>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="spinner mr-2"></span>
              {{ isLoading ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-secondary-600">
              Don't have an account?
              <a routerLink="/auth/register" class="font-medium text-primary-600 hover:text-primary-500">
                Sign up here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const loginData: LoginRequest = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        }
      });
    }
  }
}
