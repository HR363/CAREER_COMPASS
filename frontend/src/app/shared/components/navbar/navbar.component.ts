import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  isScrolled = false;
  isMobileMenuOpen = false;
  currentRoute = '';
  private authSub?: Subscription;
  private routerSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    this.authSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.routerSub = this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.currentRoute = event.urlAfterRedirects;
      this.isMobileMenuOpen = false;
    });

    this.currentRoute = this.router.url;
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  get isLandingPage(): boolean {
    return this.currentRoute === '/' || this.currentRoute === '';
  }

  get isAuthPage(): boolean {
    return this.currentRoute.includes('/auth/');
  }

  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  getUserInitial(): string {
    return this.currentUser?.name?.charAt(0).toUpperCase() || 'U';
  }
}
