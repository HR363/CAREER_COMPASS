import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
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
              <h1 class="text-xl font-bold text-primary-600">Admin Panel</h1>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-secondary-600">{{ currentUser?.name }}</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Dashboard Stats -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-2xl font-bold text-secondary-900">{{ stats?.users?.total || 0 }}</h3>
                  <p class="text-sm text-secondary-500">Total Users</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-2xl font-bold text-secondary-900">{{ stats?.users?.mentors || 0 }}</h3>
                  <p class="text-sm text-secondary-500">Mentors</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-2xl font-bold text-secondary-900">{{ stats?.users?.students || 0 }}</h3>
                  <p class="text-sm text-secondary-500">Students</p>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-2xl font-bold text-secondary-900">{{ stats?.sessions?.total || 0 }}</h3>
                  <p class="text-sm text-secondary-500">Total Sessions</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Management Sections -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <!-- Users Management -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">User Management</h3>
              <div class="space-y-3">
                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">All Users</h4>
                      <p class="text-sm text-secondary-600">View and manage all platform users</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>

                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">Role Management</h4>
                      <p class="text-sm text-secondary-600">Update user roles and permissions</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- Sessions Management -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">Session Management</h3>
              <div class="space-y-3">
                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">All Sessions</h4>
                      <p class="text-sm text-secondary-600">Monitor and manage mentorship sessions</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>

                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">Session Reports</h4>
                      <p class="text-sm text-secondary-600">View session analytics and reports</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- AI & Recommendations -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">AI & Recommendations</h3>
              <div class="space-y-3">
                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">Recommendation History</h4>
                      <p class="text-sm text-secondary-600">View all AI-generated recommendations</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>

                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">AI Analytics</h4>
                      <p class="text-sm text-secondary-600">Monitor AI usage and performance</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>

            <!-- System Settings -->
            <div class="card">
              <h3 class="text-lg font-medium text-secondary-900 mb-4">System Settings</h3>
              <div class="space-y-3">
                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">Platform Configuration</h4>
                      <p class="text-sm text-secondary-600">Configure platform settings and features</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>

                <button class="w-full text-left p-3 bg-secondary-50 hover:bg-secondary-100 rounded-lg transition-colors">
                  <div class="flex justify-between items-center">
                    <div>
                      <h4 class="font-medium text-secondary-900">System Health</h4>
                      <p class="text-sm text-secondary-600">Monitor system performance and health</p>
                    </div>
                    <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AdminComponent implements OnInit {
  currentUser: User | null = null;
  stats: any = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadDashboardStats();
  }

  loadDashboardStats(): void {
    // Mock stats - in a real app, this would come from an API
    this.stats = {
      users: {
        total: 150,
        mentors: 25,
        students: 120
      },
      sessions: {
        total: 45,
        active: 8,
        completed: 35
      },
      recommendations: {
        total: 89
      }
    };
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

