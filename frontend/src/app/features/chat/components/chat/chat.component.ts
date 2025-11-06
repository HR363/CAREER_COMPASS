import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AiService } from '../../../../core/services/ai.service';
import { AuthService } from '../../../../core/services/auth.service';

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
}

@Component({
  selector: 'app-chat',
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
              <h1 class="text-xl font-bold text-primary-600">CareerCompass AI Chat</h1>
            </div>
            <div class="flex items-center">
              <span class="text-sm text-secondary-600">AI Career Assistant</span>
            </div>
          </div>
        </div>
      </nav>

      <!-- Chat Container -->
      <div class="max-w-4xl mx-auto h-[calc(100vh-64px)] flex flex-col">
        <!-- Chat Messages -->
        <div class="flex-1 overflow-y-auto p-6" #chatContainer>
          <div *ngIf="messages.length === 0" class="text-center text-secondary-500 mt-20">
            <div class="mb-4">
              <svg class="w-16 h-16 mx-auto text-primary-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-lg font-medium text-secondary-900 mb-2">Welcome to CareerCompass AI!</h3>
            <p class="text-secondary-600">Ask me anything about your career, skills development, or professional growth.</p>
          </div>

          <div *ngFor="let message of messages" class="mb-4">
            <div [ngClass]="message.isUser ? 'flex justify-end' : 'flex justify-start'">
              <div [ngClass]="message.isUser ? 'bg-primary-600 text-white' : 'bg-white border border-secondary-200'"
                   class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm">
                
                <!-- Loading indicator for AI messages -->
                <div *ngIf="message.isLoading" class="flex items-center space-x-2">
                  <div class="spinner w-4 h-4"></div>
                  <span class="text-sm">AI is thinking...</span>
                </div>
                
                <!-- Message content -->
                <div *ngIf="!message.isLoading" class="text-sm">
                  <div [innerHTML]="formatMessage(message.content)"></div>
                  <div class="text-xs opacity-75 mt-1">
                    {{ message.timestamp | date:'h:mm a' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div class="border-t border-secondary-200 bg-white p-4">
          <form [formGroup]="chatForm" (ngSubmit)="sendMessage()" class="flex space-x-4">
            <div class="flex-1">
              <input
                type="text"
                formControlName="message"
                placeholder="Ask about career advice, skills, or professional development..."
                class="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                (keydown.enter)="sendMessage()"
              />
            </div>
            <button
              type="submit"
              [disabled]="chatForm.invalid || isLoading"
              class="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <span *ngIf="isLoading" class="spinner mr-2"></span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  chatForm: FormGroup;
  messages: ChatMessage[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private aiService: AiService,
    private authService: AuthService,
    private router: Router
  ) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  ngOnInit(): void {
    // Add welcome message
    this.addMessage('Hello! I\'m your AI career assistant. I can help you with career guidance, skill development, job search tips, and professional growth strategies. What would you like to know?', false);
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(): void {
    if (this.chatForm.valid && !this.isLoading) {
      const messageText = this.chatForm.get('message')?.value.trim();
      
      if (messageText) {
        // Add user message
        this.addMessage(messageText, true);
        
        // Clear input
        this.chatForm.patchValue({ message: '' });
        
        // Add loading message for AI response
        const loadingMessage = this.addMessage('', false, true);
        
        // Send to AI service
        this.isLoading = true;
        this.aiService.chatWithAI({ message: messageText }).subscribe({
          next: (response: any) => {
            this.isLoading = false;
            this.removeMessage(loadingMessage.id);
            this.addMessage(response.response, false);
          },
          error: (error: any) => {
            this.isLoading = false;
            this.removeMessage(loadingMessage.id);
            this.addMessage('Sorry, I encountered an error. Please try again.', false);
            console.error('Chat error:', error);
          }
        });
      }
    }
  }

  private addMessage(content: string, isUser: boolean, isLoading: boolean = false): ChatMessage {
    const message: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
      isLoading
    };
    
    this.messages.push(message);
    return message;
  }

  private removeMessage(messageId: string): void {
    this.messages = this.messages.filter(m => m.id !== messageId);
  }

  private scrollToBottom(): void {
    if (this.chatContainer) {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  formatMessage(content: string): string {
    // Simple formatting for line breaks and basic markdown
    return content
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>');
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}

