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
      title: 'AI-Powered Insights', 
      description: 'Leverage cutting-edge AI technology to discover career paths tailored to your unique skills and aspirations',
      gradient: 'from-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
    },
    {
      icon: '📚',
      title: 'Personalized Learning',
      description: 'Access curated learning roadmaps designed by industry experts to accelerate your professional growth',
      gradient: 'from-blue-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80'
    },
    {
      icon: '👥',
      title: 'Expert Mentorship',
      description: 'Connect face-to-face with seasoned professionals through our integrated video platform',
      gradient: 'from-green-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=80'
    },
    {
      icon: '💬',
      title: 'Smart AI Assistant',
      description: 'Get instant, intelligent answers to your career questions anytime, anywhere',
      gradient: 'from-orange-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
    }
  ];

  stats = [
    { value: '10K+', label: 'Active Users', icon: '👥' },
    { value: '500+', label: 'Expert Mentors', icon: '🎓' },
    { value: '95%', label: 'Success Rate', icon: '⭐' },
    { value: '24/7', label: 'AI Support', icon: '🤖' }
  ];

  testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      avatar: '👩‍💻',
      content: 'CareerCompass helped me transition from teaching to tech. The AI recommendations were spot-on!',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Product Manager',
      avatar: '👨‍💼',
      content: 'The mentorship sessions were invaluable. I landed my dream job within 3 months!',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Data Scientist',
      avatar: '👩‍🔬',
      content: 'Best career platform I\'ve used. The learning paths are perfectly structured.',
      rating: 5
    }
  ];
}
