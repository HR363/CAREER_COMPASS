import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { AiService } from '../../../../core/services/ai.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgChartsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  isUpdating = false;
  isGeneratingRecommendations = false;
  recommendations: any[] = [];
  
  // Roadmap State
  isGeneratingRoadmap = false;
  activeRoadmapCareer: string | null = null;
  selectedRoadmap: any = null;

  // Chart Data
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right',
        labels: {
          color: '#334155' // Slate-700 text for white card background
        }
      }
    }
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)', // Indigo
        'rgba(139, 92, 246, 0.8)', // Violet
        'rgba(236, 72, 153, 0.8)', // Pink
        'rgba(34, 197, 94, 0.8)',  // Green
        'rgba(234, 179, 8, 0.8)',  // Yellow
        'rgba(59, 130, 246, 0.8)', // Blue
      ],
      hoverBackgroundColor: [
        'rgba(99, 102, 241, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
        'rgba(34, 197, 94, 1)',
        'rgba(234, 179, 8, 1)',
        'rgba(59, 130, 246, 1)',
      ],
      hoverBorderColor: '#ffffff'
    }]
  };
  public pieChartType: ChartType = 'pie';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private aiService: AiService,
    private profileService: ProfileService,
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

      this.profileService.updateProfile(profileData).subscribe({
        next: (updatedProfile) => {
          this.isUpdating = false;
          // Update local user data
          if (this.currentUser) {
            this.currentUser.profile = updatedProfile;
            // Update storage to persist changes
            localStorage.setItem('user', JSON.stringify(this.currentUser));
          }
          console.log('Profile updated:', updatedProfile);
          alert('Profile updated successfully!');
        },
        error: (error) => {
          this.isUpdating = false;
          console.error('Error updating profile:', error);
          alert('Failed to update profile. Please try again.');
        }
      });
    }
  }

  getCareerRecommendations(): void {
    if (!this.profileForm.valid) {
      alert('Please fill in your profile information first');
      return;
    }

    this.isGeneratingRecommendations = true;
    // Reset roadmap state when generating new recommendations
    this.activeRoadmapCareer = null;
    this.selectedRoadmap = null;

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

  generateRoadmap(career: any): void {
    const careerTitle = career.title;
    
    // If clicking same career, toggle visibility
    if (this.activeRoadmapCareer === careerTitle && this.selectedRoadmap) {
      this.activeRoadmapCareer = null;
      return;
    }

    this.activeRoadmapCareer = careerTitle;
    this.selectedRoadmap = null;
    this.isGeneratingRoadmap = true;

    const request = {
      careerPath: careerTitle,
      currentSkills: this.profileForm.get('skills')?.value || '',
      timeframe: '6 months'
    };

    this.aiService.getLearningPath(request).subscribe({
      next: (response: any) => {
        this.isGeneratingRoadmap = false;
        
        let roadmap = response?.learningPath || response;
        if (typeof roadmap === 'string') {
          try {
            let cleaned = roadmap.trim();
            cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, '');
            cleaned = cleaned.replace(/\n?```\s*$/i, '');
            roadmap = JSON.parse(cleaned);
          } catch (e) {
            console.error('Failed to parse roadmap:', e);
            roadmap = null;
          }
        }
        
        this.selectedRoadmap = roadmap;
        this.updateChartData();
        console.log('Generated Roadmap:', this.selectedRoadmap);
      },
      error: (err) => {
        this.isGeneratingRoadmap = false;
        console.error('Error generating roadmap:', err);
        alert('Failed to generate learning path. Please try again.');
        this.activeRoadmapCareer = null;
      }
    });
  }

  // Helper to safely get phases if it's nested or direct
  getRoadmapPhases(): any[] {
    if (!this.selectedRoadmap) return [];
    if (Array.isArray(this.selectedRoadmap)) return this.selectedRoadmap; // If it's just the array
    if (this.selectedRoadmap.phases && Array.isArray(this.selectedRoadmap.phases)) return this.selectedRoadmap.phases;
    // Walkaround if it's wrapped differently
    return [];
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

  updateChartData(): void {
    const phases = this.getRoadmapPhases();
    const labels: string[] = [];
    const data: number[] = [];

    phases.forEach(phase => {
      labels.push(phase.name);
      data.push(this.parseDurationToWeeks(phase.duration));
    });

    this.pieChartData = {
      ...this.pieChartData,
      labels: labels,
      datasets: [{
        ...this.pieChartData.datasets[0],
        data: data
      }]
    };
  }

  parseDurationToWeeks(duration: string): number {
    if (!duration) return 1;
    const lowerDuration = duration.toLowerCase();
    
    // Extract number
    const match = lowerDuration.match(/(\d+)/);
    const num = match ? parseInt(match[0]) : 1;

    if (lowerDuration.includes('month')) {
      return num * 4;
    } else if (lowerDuration.includes('year')) {
      return num * 52;
    } else if (lowerDuration.includes('week')) {
      return num;
    } else if (lowerDuration.includes('day')) {
      return num / 7;
    }
    return num;
  }
}

