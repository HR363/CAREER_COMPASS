import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {
  features = [
    {
      icon: '🎯',
      title: 'AI-Powered Career Guidance',
      description: 'Get personalized career recommendations powered by advanced AI technology'
    },
    {
      icon: '📚',
      title: 'Custom Learning Paths',
      description: 'Tailored learning paths designed to help you achieve your career goals'
    },
    {
      icon: '👥',
      title: 'Expert Mentorship',
      description: 'Connect with industry professionals for one-on-one guidance and support'
    },
    {
      icon: '💬',
      title: 'Real-time Chat Support',
      description: 'Get instant answers to your career questions through our AI assistant'
    }
  ];
}
