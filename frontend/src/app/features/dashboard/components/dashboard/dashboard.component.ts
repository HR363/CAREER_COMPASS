import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { AiService } from '../../../../core/services/ai.service';
import { MentorshipService } from '../../../../core/services/mentorship.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-secondary-50">
      <!-- Navigation -->
      <nav class="bg-white shadow-sm border-b border-secondary-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <h1 class="text-xl font-bold text-primary-600">CareerCompass AI</h1>
            </div>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-secondary-600">Welcome, {{ currentUser?.name }}</span>
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    [ngClass]="getRoleBadgeClass(currentUser?.role)">
                {{ currentUser?.role }}
              </span>
              <button (click)="logout()" 
                      class="text-secondary-500 hover:text-secondary-700 text-sm font-medium">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <!-- Welcome Section -->
          <div class="mb-8">
            <h2 class="text-2xl font-bold text-secondary-900 mb-2">
              Welcome back, {{ currentUser?.name }}!
            </h2>
            <p class="text-secondary-600">
              Ready to advance your career journey? Explore your personalized dashboard.
            </p>
          </div>

          <!-- Quick Actions -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
                 (click)="navigateTo('/profile')">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-secondary-900">Profile</h3>
                  <p class="text-sm text-secondary-500">Update your information</p>
                </div>
              </div>
            </div>

            <div class="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
                 (click)="navigateTo('/chat')">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-secondary-900">AI Chat</h3>
                  <p class="text-sm text-secondary-500">Get career advice</p>
                </div>
              </div>
            </div>

            <div class="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
                 (click)="navigateTo('/mentorship')">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-secondary-900">Mentorship</h3>
                  <p class="text-sm text-secondary-500">Connect with mentors</p>
                </div>
              </div>
            </div>

            <div class="card cursor-pointer hover:shadow-xl transition-shadow duration-200"
                 *ngIf="currentUser?.role === 'ADMIN'"
                 (click)="navigateTo('/admin')">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-sm font-medium text-secondary-900">Admin Panel</h3>
                  <p class="text-sm text-secondary-500">Manage platform</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Recent Sessions -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">Recent Sessions</h3>
              <div *ngIf="recentSessions.length === 0" class="text-center py-8 text-secondary-500">
                No recent sessions found
              </div>
              <div *ngFor="let session of recentSessions" class="border-b border-secondary-200 pb-3 mb-3 last:border-b-0">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-medium text-secondary-900">
                      {{ currentUser?.role === 'MENTOR' ? session.student?.name : session.mentor?.name }}
                    </p>
                    <p class="text-xs text-secondary-500">
                      {{ session.scheduledAt | date:'MMM dd, yyyy h:mm a' }}
                    </p>
                  </div>
                  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        [ngClass]="getStatusBadgeClass(session.status)">
                    {{ session.status }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">Quick Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary-600">Total Sessions</span>
                  <span class="text-sm font-medium text-secondary-900">{{ totalSessions }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary-600">Completed Sessions</span>
                  <span class="text-sm font-medium text-secondary-900">{{ completedSessions }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-secondary-600">Profile Completion</span>
                  <span class="text-sm font-medium text-secondary-900">{{ profileCompletion }}%</span>
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
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  recentSessions: any[] = [];
  totalSessions = 0;
  completedSessions = 0;
  profileCompletion = 0;

  constructor(
    private authService: AuthService,
    private aiService: AiService,
    private mentorshipService: MentorshipService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load recent sessions
    this.mentorshipService.getSessions().subscribe({
      next: (sessions: any[]) => {
        this.recentSessions = sessions.slice(0, 5);
        this.totalSessions = sessions.length;
        this.completedSessions = sessions.filter((s: any) => s.status === 'COMPLETED').length;
      },
      error: (error: any) => {
        console.error('Error loading sessions:', error);
      }
    });

    // Calculate profile completion
    if (this.currentUser?.profile) {
      const profile = this.currentUser.profile;
      let completedFields = 0;
      const totalFields = 4;

      if (profile.education) completedFields++;
      if (profile.skills) completedFields++;
      if (profile.interests) completedFields++;
      if (profile.goals) completedFields++;

      this.profileCompletion = Math.round((completedFields / totalFields) * 100);
    }
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

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  }

  navigateTo(path: string): void {
    // This would typically use Router.navigate, but for simplicity we'll use window.location
    window.location.href = path;
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/auth/login';
  }
}

