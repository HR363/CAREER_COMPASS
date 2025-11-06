import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';
import { MentorshipService, Session } from '../../../../core/services/mentorship.service';

@Component({
  selector: 'app-mentorship',
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
              <h1 class="text-xl font-bold text-primary-600">Mentorship</h1>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-secondary-600">{{ currentUser?.name }}</span>
            </div>
          </div>
        </div>
      </nav>

      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          
          <!-- Schedule New Session (for students) -->
          <div *ngIf="currentUser?.role === 'STUDENT'" class="mb-8">
            <div class="card">
              <h2 class="text-lg font-medium text-secondary-900 mb-4">Schedule New Session</h2>
              <form [formGroup]="scheduleForm" (ngSubmit)="scheduleSession()">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="form-label">Select Mentor</label>
                    <select formControlName="mentorId" class="input-field">
                      <option value="">Choose a mentor</option>
                      <option *ngFor="let mentor of mentors" [value]="mentor.id">
                        {{ mentor.name }} - {{ mentor.profile?.education }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Date & Time</label>
                    <input type="datetime-local" formControlName="scheduledAt" class="input-field">
                  </div>
                </div>
                <div class="mt-4">
                  <label class="form-label">Description (Optional)</label>
                  <textarea formControlName="description" rows="3" class="input-field" 
                            placeholder="Describe what you'd like to discuss..."></textarea>
                </div>
                <button type="submit" [disabled]="scheduleForm.invalid || isScheduling"
                        class="btn-primary mt-4">
                  <span *ngIf="isScheduling" class="spinner mr-2"></span>
                  {{ isScheduling ? 'Scheduling...' : 'Schedule Session' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Sessions List -->
          <div class="card">
            <h2 class="text-lg font-medium text-secondary-900 mb-4">Your Sessions</h2>
            
            <div *ngIf="sessions.length === 0" class="text-center py-8 text-secondary-500">
              No sessions found. Schedule your first session to get started!
            </div>

            <div *ngFor="let session of sessions" class="border border-secondary-200 rounded-lg p-4 mb-4">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <div class="flex items-center space-x-4">
                    <div>
                      <h3 class="font-medium text-secondary-900">
                        {{ getSessionTitle(session) }}
                      </h3>
                      <p class="text-sm text-secondary-600">
                        {{ session.scheduledAt | date:'MMM dd, yyyy h:mm a' }}
                      </p>
                    </div>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          [ngClass]="getStatusBadgeClass(session.status)">
                      {{ session.status }}
                    </span>
                  </div>
                  
                  <div class="mt-2">
                    <p class="text-sm text-secondary-600">
                      <span *ngIf="currentUser?.role === 'STUDENT'">
                        Mentor: {{ session.mentor?.name }}
                      </span>
                      <span *ngIf="currentUser?.role === 'MENTOR'">
                        Student: {{ session.student?.name }}
                      </span>
                    </p>
                  </div>
                </div>
                
                <div class="flex space-x-2">
                  <button *ngIf="canJoinSession(session)" 
                          (click)="joinSession(session)"
                          class="btn-primary text-sm">
                    Join Session
                  </button>
                  <button *ngIf="canCancelSession(session)" 
                          (click)="cancelSession(session)"
                          class="btn-outline text-sm">
                    Cancel
                  </button>
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
export class MentorshipComponent implements OnInit {
  currentUser: User | null = null;
  sessions: Session[] = [];
  mentors: any[] = [];
  
  scheduleForm: FormGroup;
  isScheduling = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mentorshipService: MentorshipService,
    private router: Router
  ) {
    this.scheduleForm = this.fb.group({
      mentorId: ['', [Validators.required]],
      scheduledAt: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSessions();
    
    if (this.currentUser?.role === 'STUDENT') {
      this.loadMentors();
    }
  }

  loadSessions(): void {
    this.mentorshipService.getSessions().subscribe({
      next: (sessions: Session[]) => {
        this.sessions = sessions;
      },
      error: (error: any) => {
        console.error('Error loading sessions:', error);
      }
    });
  }

  loadMentors(): void {
    // This would typically load from a mentors API endpoint
    // For now, we'll use a mock list
    this.mentors = [
      { id: '1', name: 'John Smith', profile: { education: 'Software Engineering' } },
      { id: '2', name: 'Sarah Johnson', profile: { education: 'Data Science' } },
      { id: '3', name: 'Mike Wilson', profile: { education: 'Product Management' } }
    ];
  }

  scheduleSession(): void {
    if (this.scheduleForm.valid) {
      this.isScheduling = true;
      
      const formData = this.scheduleForm.value;
      const scheduleData = {
        mentorId: formData.mentorId,
        studentId: this.currentUser!.id,
        scheduledAt: formData.scheduledAt,
        description: formData.description
      };

      this.mentorshipService.scheduleSession(scheduleData).subscribe({
        next: (session: any) => {
          this.isScheduling = false;
          this.scheduleForm.reset();
          this.loadSessions();
        },
        error: (error: any) => {
          this.isScheduling = false;
          console.error('Error scheduling session:', error);
        }
      });
    }
  }

  joinSession(session: Session): void {
    this.router.navigate(['/mentorship/session', session.id]);
  }

  cancelSession(session: Session): void {
    if (confirm('Are you sure you want to cancel this session?')) {
      this.mentorshipService.cancelSession(session.id).subscribe({
        next: () => {
          this.loadSessions();
        },
        error: (error: any) => {
          console.error('Error cancelling session:', error);
        }
      });
    }
  }

  getSessionTitle(session: Session): string {
    if (this.currentUser?.role === 'STUDENT') {
      return `Session with ${session.mentor?.name}`;
    } else {
      return `Session with ${session.student?.name}`;
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

  canJoinSession(session: Session): boolean {
    const now = new Date();
    const sessionTime = new Date(session.scheduledAt);
    const timeDiff = Math.abs(now.getTime() - sessionTime.getTime()) / (1000 * 60); // minutes
    
    return session.status === 'SCHEDULED' && timeDiff <= 30; // Can join 30 minutes before/after
  }

  canCancelSession(session: Session): boolean {
    return session.status === 'SCHEDULED';
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

