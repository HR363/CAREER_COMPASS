import { Routes } from '@angular/router';
import { MentorshipComponent } from './components/mentorship/mentorship.component';
import { VideoCallComponent } from './components/video-call/video-call.component';

export const mentorshipRoutes: Routes = [
  {
    path: '',
    component: MentorshipComponent
  },
  {
    path: 'session/:id',
    component: VideoCallComponent
  }
];

