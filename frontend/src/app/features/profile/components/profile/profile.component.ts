import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { AiService } from '../../../../core/services/ai.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-secondary-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b border-secondary-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <button (click)="goBack()" class="mr-4 text-secondary-500 hover:text-secondary-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <h1 class="text-xl font-bold text-primary-600">Profile</h1>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-secondary-600">{{ currentUser?.name }}</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Profile Header -->
          <div class="card mb-8">
            <div class="flex items-center space-x-6">
              <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-bold text-secondary-900">{{ currentUser?.name }}</h2>
                <p class="text-secondary-600">{{ currentUser?.email }}</p>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2"
                      [ngClass]="getRoleBadgeClass(currentUser?.role)">
                  {{ currentUser?.role }}
                </span>
              </div>
            </div>
          </div>

          <!-- Profile Form -->
          <div class="card">
            <h3 class="text-lg font-medium text-secondary-900 mb-6">Profile Information</h3>
            
            <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="form-label">Education</label>
                  <input type="text" 
                         formControlName="education" 
                         placeholder="e.g., Bachelor's in Computer Science"
                         class="input-field">
                </div>

                <div>
                  <label class="form-label">Career Goals</label>
                  <input type="text" 
                         formControlName="goals" 
                         placeholder="e.g., Become a Senior Software Engineer"
                         class="input-field">
                </div>
              </div>

              <div class="mt-6">
                <label class="form-label">Skills</label>
                <textarea formControlName="skills" 
                          rows="3" 
                          placeholder="Enter your skills (comma-separated): JavaScript, React, Node.js, Python..."
                          class="input-field"></textarea>
                <p class="text-sm text-secondary-500 mt-1">Separate skills with commas</p>
              </div>

              <div class="mt-6">
                <label class="form-label">Interests</label>
                <textarea formControlName="interests" 
                          rows="3" 
                          placeholder="Enter your interests (comma-separated): Web Development, AI, Data Science..."
                          class="input-field"></textarea>
                <p class="text-sm text-secondary-500 mt-1">Separate interests with commas</p>
              </div>

              <div class="mt-6 flex justify-end space-x-4">
                <button type="button" 
                        (click)="goBack()"
                        class="btn-secondary">
                  Cancel
                </button>
                <button type="submit" 
                        [disabled]="profileForm.invalid || isUpdating"
                        class="btn-primary">
                  <span *ngIf="isUpdating" class="spinner mr-2"></span>
                  {{ isUpdating ? 'Updating...' : 'Update Profile' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Career Recommendations -->
          <div class="card mt-8" *ngIf="currentUser?.role === 'STUDENT'">
            <h3 class="text-lg font-medium text-secondary-900 mb-6">Get Career Recommendations</h3>
            <p class="text-secondary-600 mb-4">
              Based on your profile, we can suggest personalized career paths and learning roadmaps.
            </p>
            
            <div class="flex space-x-4">
              <button (click)="getCareerRecommendations()" 
                      [disabled]="isGeneratingRecommendations"
                      class="btn-primary">
                <span *ngIf="isGeneratingRecommendations" class="spinner mr-2"></span>
                {{ isGeneratingRecommendations ? 'Generating...' : 'Get Recommendations' }}
              </button>
            </div>

            <!-- Recommendations Display -->
            <div *ngIf="recommendations" class="mt-6">
              <h4 class="font-medium text-secondary-900 mb-4">Suggested Career Paths</h4>
              <div class="space-y-4">
                <div *ngFor="let career of recommendations.suggestedCareers" 
                     class="border border-secondary-200 rounded-lg p-4">
                  <h5 class="font-medium text-secondary-900">{{ career.title }}</h5>
                  <p class="text-sm text-secondary-600 mt-1">{{ career.description }}</p>
                  <div class="mt-2 text-sm text-secondary-500">
                    <p><strong>Skills:</strong> {{ career.requiredSkills }}</p>
                    <p><strong>Salary:</strong> {{ career.salaryRange }}</p>
                    <p><strong>Why this fits:</strong> {{ career.matchReason }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isUpdating = false;
  isGeneratingRecommendations = false;
  recommendations: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private aiService: AiService,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      education: [''],
      skills: [''],
      interests: [''],
      goals: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadProfile();
  }

  loadProfile(): void {
    if (this.currentUser?.profile) {
      const profile = this.currentUser.profile;
      this.profileForm.patchValue({
        education: profile.education || '',
        skills: profile.skills ? JSON.parse(profile.skills).join(', ') : '',
        interests: profile.interests ? JSON.parse(profile.interests).join(', ') : '',
        goals: profile.goals || ''
      });
    }
  }

  updateProfile(): void {
    if (this.profileForm.valid) {
      this.isUpdating = true;

      const formData = this.profileForm.value;
      const profileData = {
        education: formData.education,
        skills: formData.skills ? JSON.stringify(formData.skills.split(',').map((s: string) => s.trim())) : '[]',
        interests: formData.interests ? JSON.stringify(formData.interests.split(',').map((s: string) => s.trim())) : '[]',
        goals: formData.goals
      };

      // Here you would typically call a profile update service
      // For now, we'll simulate the update
      setTimeout(() => {
        this.isUpdating = false;
        // Update local user data
        if (this.currentUser) {
          this.currentUser.profile = {
            ...this.currentUser.profile,
            ...profileData
          };
        }
        console.log('Profile updated:', profileData);
      }, 1000);
    }
  }

  getCareerRecommendations(): void {
    if (!this.profileForm.valid) {
      alert('Please fill in your profile information first');
      return;
    }

    this.isGeneratingRecommendations = true;

    const formData = this.profileForm.value;
    const requestData = {
      skills: formData.skills || '',
      interests: formData.interests || '',
      education: formData.education || '',
      goals: formData.goals || ''
    };

    this.aiService.getCareerRecommendations(requestData).subscribe({
      next: (response: any) => {
        this.isGeneratingRecommendations = false;
        this.recommendations = response;
      },
      error: (error: any) => {
        this.isGeneratingRecommendations = false;
        console.error('Error getting recommendations:', error);
        alert('Failed to generate recommendations. Please try again.');
      }
    });
  }

  getRoleBadgeClass(role?: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'MENTOR':
        return 'bg-purple-100 text-purple-800';
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

