import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ScheduleSessionRequest {
  mentorId: string;
  studentId: string;
  scheduledAt: string;
  description?: string;
}

export interface Session {
  id: string;
  mentorId: string;
  studentId: string;
  scheduledAt: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  roomId: string;
  mentor?: any;
  student?: any;
}

@Injectable({
  providedIn: 'root'
})
export class MentorshipService {
  constructor(private http: HttpClient) {}

  scheduleSession(request: ScheduleSessionRequest): Observable<Session> {
    return this.http.post<Session>(`${environment.apiUrl}/mentorship/schedule`, request);
  }

  getSessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${environment.apiUrl}/mentorship/sessions`);
  }

  getSession(sessionId: string): Observable<Session> {
    return this.http.get<Session>(`${environment.apiUrl}/mentorship/sessions/${sessionId}`);
  }

  joinSession(sessionId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/mentorship/sessions/${sessionId}/join`, {});
  }

  endSession(sessionId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/mentorship/sessions/${sessionId}/end`, {});
  }

  cancelSession(sessionId: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/mentorship/sessions/${sessionId}/cancel`, {});
  }
}
