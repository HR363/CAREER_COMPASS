import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../../core/services/auth.service';
import { MentorshipService, Session } from '../../../../../core/services/mentorship.service';
import { WebSocketService } from '../../../../../core/services/websocket.service';

@Component({
  selector: 'app-video-call',
  standalone: true,
  imports: [CommonModule],
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
            
            <div class="flex-1 p-4 overflow-y-auto" #chatMessages>
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
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  session: Session | null = null;
  
  // WebRTC
  private peerConnection: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  
  // UI State
  isMuted = false;
  isVideoEnabled = true;
  isRemoteStreamActive = false;
  
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
      await this.initializeVideoCall();
      this.setupWebSocketListeners();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async loadSession(sessionId: string): Promise<void> {
    this.mentorshipService.getSession(sessionId).subscribe({
      next: (session) => {
        this.session = session;
        this.joinSession();
      },
      error: (error) => {
        console.error('Error loading session:', error);
        this.router.navigate(['/mentorship']);
      }
    });
  }

  private async initializeVideoCall(): Promise<void> {
    try {
      // Get user media
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      // Set up local video
      if (this.localVideo) {
        this.localVideo.nativeElement.srcObject = this.localStream;
      }

      // Initialize peer connection
      this.initializePeerConnection();

    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  }

  private initializePeerConnection(): void {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    this.peerConnection = new RTCPeerConnection(configuration);

    // Add local stream to peer connection
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        this.peerConnection!.addTrack(track, this.localStream!);
      });
    }

    // Handle remote stream
    this.peerConnection.ontrack = (event) => {
      const remoteStream = event.streams[0];
      if (this.remoteVideo) {
        this.remoteVideo.nativeElement.srcObject = remoteStream;
        this.isRemoteStreamActive = true;
      }
    };

    // Handle ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate && this.session) {
        this.webSocketService.sendIceCandidate(
          this.session.roomId,
          event.candidate,
          'remote-user' // This should be the actual remote user ID
        );
      }
    };
  }

  private setupWebSocketListeners(): void {
    this.webSocketService.onWebRTCOffer((data) => {
      this.handleOffer(data.offer);
    });

    this.webSocketService.onWebRTCAnswer((data) => {
      this.handleAnswer(data.answer);
    });

    this.webSocketService.onIceCandidate((data) => {
      this.handleIceCandidate(data.candidate);
    });

    this.webSocketService.onChatMessage((data) => {
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

  private async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(offer);
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(answer);
      
      if (this.session) {
        this.webSocketService.sendWebRTCAnswer(this.session.roomId, answer, 'remote-user');
      }
    }
  }

  private async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    if (this.peerConnection) {
      await this.peerConnection.setRemoteDescription(answer);
    }
  }

  private async handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (this.peerConnection) {
      await this.peerConnection.addIceCandidate(candidate);
    }
  }

  toggleMute(): void {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        this.isMuted = !audioTrack.enabled;
      }
    }
  }

  toggleVideo(): void {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        this.isVideoEnabled = videoTrack.enabled;
      }
    }
  }

  async endCall(): Promise<void> {
    if (this.session) {
      await this.mentorshipService.endSession(this.session.id).subscribe({
        next: () => {
          this.leaveSession();
        },
        error: (error) => {
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
      if (this.chatMessages) {
        this.chatMessages.nativeElement.scrollTop = this.chatMessages.nativeElement.scrollHeight;
      }
    }, 100);
  }

  private cleanup(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    if (this.peerConnection) {
      this.peerConnection.close();
    }

    this.webSocketService.disconnect();
  }
}

