import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  sessions: any[] = [];
  recommendations: any[] = [];
  resources: any[] = [];
  profileCompletion = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
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

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

