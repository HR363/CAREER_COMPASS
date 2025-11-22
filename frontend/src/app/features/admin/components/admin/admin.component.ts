import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, User } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
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

