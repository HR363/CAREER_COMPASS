import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { MentorshipService, Session } from '../../../../core/services/mentorship.service';
import { WebSocketService } from '../../../../core/services/websocket.service';
import AgoraRTC, {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
  IAgoraRTCRemoteUser,
} from 'agora-rtc-sdk-ng';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-secondary-900 flex flex-col">
      <!-- Header -->
      <div class="bg-secondary-800 px-4 py-3 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <button (click)="leaveSession()" class="text-white hover:text-secondary-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-white font-medium">{{ session?.mentor?.name }} & {{ session?.student?.name }}</h1>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-secondary-300 text-sm">{{ session?.status }}</span>
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>

      <!-- Video Container -->
      <div class="flex-1 flex flex-col lg:flex-row">
        <!-- Main Video Area -->
        <div class="flex-1 flex flex-col">
          <!-- Remote Video -->
          <div class="flex-1 bg-secondary-800 flex items-center justify-center relative">
            <video #remoteVideo 
                   class="w-full h-full object-cover"
                   autoplay 
                   playsinline
                   [class.hidden]="!isRemoteStreamActive">
            </video>
            <div *ngIf="!isRemoteStreamActive" class="text-center text-white">
              <div class="mb-4">
                <svg class="w-16 h-16 mx-auto text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </div>
              <p class="text-lg">Waiting for other participant...</p>
            </div>
          </div>

          <!-- Controls -->
          <div class="bg-secondary-800 px-6 py-4 flex justify-center space-x-4">
            <button (click)="toggleMute()" 
                    [class]="isMuted ? 'bg-red-600 hover:bg-red-700' : 'bg-secondary-700 hover:bg-secondary-600'"
                    class="p-3 rounded-full text-white transition-colors">
              <svg *ngIf="!isMuted" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              <svg *ngIf="isMuted" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>
              </svg>
            </button>

            <button (click)="toggleVideo()" 
                    [class]="!isVideoEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-secondary-700 hover:bg-secondary-600'"
                    class="p-3 rounded-full text-white transition-colors">
              <svg *ngIf="isVideoEnabled" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
              </svg>
              <svg *ngIf="!isVideoEnabled" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
              </svg>
            </button>

            <button (click)="endCall()" 
                    class="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.684A1 1 0 008.279 3H5z"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:w-80 bg-secondary-800 flex flex-col">
          <!-- Local Video -->
          <div class="p-4 border-b border-secondary-700">
            <video #localVideo 
                   class="w-full h-32 object-cover rounded-lg"
                   autoplay 
                   playsinline 
                   muted
                   [class.hidden]="!isVideoEnabled">
            </video>
            <div *ngIf="!isVideoEnabled" class="w-full h-32 bg-secondary-700 rounded-lg flex items-center justify-center">
              <span class="text-secondary-400 text-sm">Camera off</span>
            </div>
          </div>

          <!-- Chat -->
          <div class="flex-1 flex flex-col">
            <div class="p-4 border-b border-secondary-700">
              <h3 class="text-white font-medium">Chat</h3>
            </div>
            
            <div class="flex-1 p-4 overflow-y-auto" #chatContainer>
              <div *ngFor="let message of chatMessages" class="mb-3">
                <div [ngClass]="message.isFromUser ? 'text-right' : 'text-left'">
                  <div [ngClass]="message.isFromUser ? 'bg-primary-600' : 'bg-secondary-700'"
                       class="inline-block px-3 py-2 rounded-lg text-white text-sm max-w-xs">
                    {{ message.content }}
                  </div>
                  <div class="text-xs text-secondary-400 mt-1">
                    {{ message.timestamp | date:'h:mm a' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="p-4 border-t border-secondary-700">
              <div class="flex space-x-2">
                <input type="text" 
                       [(ngModel)]="chatMessage"
                       (keydown.enter)="sendChatMessage()"
                       placeholder="Type a message..."
                       class="flex-1 px-3 py-2 bg-secondary-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                <button (click)="sendChatMessage()"
                        class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                  Send
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
export class VideoCallComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef<HTMLVideoElement>;
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  session: Session | null = null;
  
  // Agora RTC
  private client: IAgoraRTCClient | null = null;
  private localAudioTrack: IMicrophoneAudioTrack | null = null;
  private localVideoTrack: ICameraVideoTrack | null = null;
  
  // UI State
  isMuted = false;
  isVideoEnabled = true;
  isRemoteStreamActive = false;
  isConnected = false;
  
  // Chat
  chatMessages: Array<{content: string, isFromUser: boolean, timestamp: Date}> = [];
  chatMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private mentorshipService: MentorshipService,
    private webSocketService: WebSocketService
  ) {}

  async ngOnInit(): Promise<void> {
    const sessionId = this.route.snapshot.paramMap.get('id');
    
    if (sessionId) {
      await this.loadSession(sessionId);
      await this.initializeAgoraCall();
      this.setupWebSocketListeners();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async loadSession(sessionId: string): Promise<void> {
    this.mentorshipService.getSession(sessionId).subscribe({
      next: (session: any) => {
        this.session = session;
        this.joinSession();
      },
      error: (error: any) => {
        console.error('Error loading session:', error);
        this.router.navigate(['/mentorship']);
      }
    });
  }

  private async initializeAgoraCall(): Promise<void> {
    try {
      const sessionId = this.route.snapshot.paramMap.get('id');
      if (!sessionId) return;

      // Get Agora credentials from backend
      const credentials: any = await this.mentorshipService.getVideoCallToken(sessionId).toPromise();
      
      // Create Agora client
      this.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

      // Set up event listeners
      this.setupAgoraEvents();

      // Join the channel
      await this.client.join(
        credentials.appId,
        credentials.channel,
        credentials.token,
        credentials.uid
      );

      // Create and publish local tracks
      [this.localAudioTrack, this.localVideoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();

      // Play local video
      if (this.localVideo && this.localVideoTrack) {
        this.localVideoTrack.play(this.localVideo.nativeElement);
      }

      // Publish tracks
      await this.client.publish([this.localAudioTrack, this.localVideoTrack]);
      
      this.isConnected = true;

    } catch (error) {
      console.error('Error initializing Agora call:', error);
    }
  }

  private setupAgoraEvents(): void {
    if (!this.client) return;

    // Handle remote user joined
    this.client.on('user-published', async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await this.client!.subscribe(user, mediaType);
      
      if (mediaType === 'video') {
        this.isRemoteStreamActive = true;
        setTimeout(() => {
          const remoteVideoTrack = user.videoTrack;
          if (remoteVideoTrack && this.remoteVideo) {
            remoteVideoTrack.play(this.remoteVideo.nativeElement);
          }
        }, 100);
      }

      if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack;
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
        }
      }
    });

    // Handle remote user left
    this.client.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
      this.isRemoteStreamActive = false;
    });

    this.client.on('user-left', (user: IAgoraRTCRemoteUser) => {
      this.isRemoteStreamActive = false;
    });
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.onChatMessage((data: any) => {
      this.chatMessages.push({
        content: data.message,
        isFromUser: data.fromUserId !== this.authService.getCurrentUser()?.id,
        timestamp: new Date(data.timestamp)
      });
      this.scrollChatToBottom();
    });
  }

  private async joinSession(): Promise<void> {
    if (this.session) {
      try {
        await this.webSocketService.joinRoom(this.session.roomId);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    }
  }

  toggleMute(): void {
    if (this.localAudioTrack) {
      this.isMuted = !this.isMuted;
      this.localAudioTrack.setEnabled(!this.isMuted);
    }
  }

  toggleVideo(): void {
    if (this.localVideoTrack) {
      this.isVideoEnabled = !this.isVideoEnabled;
      this.localVideoTrack.setEnabled(this.isVideoEnabled);
    }
  }

  async endCall(): Promise<void> {
    if (this.session) {
      await this.mentorshipService.endSession(this.session.id).subscribe({
        next: () => {
          this.leaveSession();
        },
        error: (error: any) => {
          console.error('Error ending session:', error);
          this.leaveSession();
        }
      });
    } else {
      this.leaveSession();
    }
  }

  leaveSession(): void {
    this.cleanup();
    this.router.navigate(['/mentorship']);
  }

  sendChatMessage(): void {
    if (this.chatMessage.trim() && this.session) {
      this.webSocketService.sendChatMessage(this.session.roomId, this.chatMessage);
      this.chatMessages.push({
        content: this.chatMessage,
        isFromUser: true,
        timestamp: new Date()
      });
      this.chatMessage = '';
      this.scrollChatToBottom();
    }
  }

  private scrollChatToBottom(): void {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private async cleanup(): Promise<void> {
    // Stop and close local tracks
    if (this.localAudioTrack) {
      this.localAudioTrack.stop();
      this.localAudioTrack.close();
      this.localAudioTrack = null;
    }

    if (this.localVideoTrack) {
      this.localVideoTrack.stop();
      this.localVideoTrack.close();
      this.localVideoTrack = null;
    }

    // Leave the channel
    if (this.client) {
      await this.client.leave();
      this.client = null;
    }

    this.webSocketService.disconnect();
  }
}

