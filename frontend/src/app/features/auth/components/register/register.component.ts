import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="mt-6 text-3xl font-extrabold text-secondary-900">
            Join CareerCompass AI
          </h2>
          <p class="mt-2 text-sm text-secondary-600">
            Start your personalized career journey today
          </p>
        </div>
        
        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-secondary-700">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your full name"
                formControlName="name"
              />
              <div *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" 
                   class="text-red-600 text-sm mt-1">
                Please enter your full name
              </div>
            </div>

            <div>
              <label for="email" class="block text-sm font-medium text-secondary-700">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autocomplete="email"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your email"
                formControlName="email"
              />
              <div *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" 
                   class="text-red-600 text-sm mt-1">
                Please enter a valid email address
              </div>
            </div>

            <div>
              <label for="password" class="block text-sm font-medium text-secondary-700">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autocomplete="new-password"
                required
                class="mt-1 appearance-none relative block w-full px-3 py-2 border border-secondary-300 placeholder-secondary-500 text-secondary-900 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Enter your password"
                formControlName="password"
              />
              <div *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" 
                   class="text-red-600 text-sm mt-1">
                Password must be at least 6 characters long
              </div>
            </div>

            <div>
              <label for="role" class="block text-sm font-medium text-secondary-700">I am a</label>
              <select
                id="role"
                name="role"
                class="mt-1 block w-full px-3 py-2 border border-secondary-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                formControlName="role"
              >
                <option value="STUDENT">Student</option>
                <option value="MENTOR">Mentor</option>
              </select>
            </div>
          </div>

          <div *ngIf="errorMessage" class="text-red-600 text-sm text-center">
            {{ errorMessage }}
          </div>

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span *ngIf="isLoading" class="spinner mr-2"></span>
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>

          <div class="text-center">
            <p class="text-sm text-secondary-600">
              Already have an account?
              <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['STUDENT', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const registerData: RegisterRequest = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
        }
      });
    }
  }
}

