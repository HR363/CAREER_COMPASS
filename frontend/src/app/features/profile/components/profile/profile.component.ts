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
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isUpdating = false;
  isGeneratingRecommendations = false;
  recommendations: any[] = [];

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
        // Handle the response structure - suggestedCareers contains the array
        let careers = response?.suggestedCareers || response;
        
        // If it's still a string, try to parse it
        if (typeof careers === 'string') {
          try {
            // Strip markdown code fences if present
            let cleaned = careers.trim();
            cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
            cleaned = cleaned.replace(/\n?```\s*$/i, '');
            careers = JSON.parse(cleaned.trim());
          } catch (e) {
            console.error('Failed to parse careers:', e);
            careers = [];
          }
        }
        
        // Ensure it's an array
        this.recommendations = Array.isArray(careers) ? careers : [];
        console.log('Career recommendations:', this.recommendations);
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

  isArray(value: any): boolean {
    return Array.isArray(value);
  }
}

