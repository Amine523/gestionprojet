import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-assistant-container" [class.open]="isOpen()">
      <!-- Chat Toggle Button -->
      <button class="chat-toggle" (click)="toggle()">
        <div class="toggle-icon">
          @if (!isOpen()) {
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <circle cx="9" cy="9" r="1"></circle>
              <circle cx="15" cy="9" r="1"></circle>
            </svg>
          } @else {
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          }
        </div>
        @if (!isOpen()) {
          <span class="toggle-label">Assistant IA</span>
        }
      </button>

      <!-- Chat Window -->
      @if (isOpen()) {
        <div class="chat-window">
          <div class="chat-header">
            <div class="header-ai-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16"></line>
                <line x1="16" y1="16" x2="16" y2="16"></line>
              </svg>
            </div>
            <div class="header-text">
              <h3>GestProjet AI</h3>
              <span class="status">En ligne</span>
            </div>
          </div>

          <div class="chat-messages" #scrollContainer>
            @for (msg of messages(); track msg.id) {
              <div class="message-wrapper" [class.user]="msg.isUser">
                <div class="message-bubble" [innerHTML]="msg.text"></div>
                <span class="message-time">{{msg.time | date:'HH:mm'}}</span>
              </div>
            }
            @if (isTyping()) {
              <div class="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            }
          </div>

          <div class="chat-footer">
            <input 
              type="text" 
              [(ngModel)]="userInput" 
              (keyup.enter)="sendMessage()" 
              placeholder="Comment puis-je vous aider ?" 
              [disabled]="isTyping()">
            <button class="send-btn" (click)="sendMessage()" [disabled]="!userInput.trim() || isTyping()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .ai-assistant-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 16px;
      pointer-events: none;
    }

    .ai-assistant-container * {
      pointer-events: auto;
    }

    .chat-toggle {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-toggle:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.4);
    }

    .toggle-label {
      font-weight: 600;
      font-size: 14px;
    }

    .chat-window {
      width: 380px;
      height: 500px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.15);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.05);
    }

    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .chat-header {
      padding: 20px;
      background: #0f172a;
      color: white;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .header-ai-icon {
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.1);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-text h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 700;
    }

    .status {
      font-size: 11px;
      opacity: 0.7;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .status::before {
      content: '';
      width: 6px;
      height: 6px;
      background: #4ade80;
      border-radius: 50%;
    }

    .chat-messages {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f8fafc;
    }

    .message-wrapper {
      display: flex;
      flex-direction: column;
      max-width: 85%;
      gap: 4px;
    }

    .message-wrapper.user {
      align-self: flex-end;
      align-items: flex-end;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.5;
    }

    .message-wrapper.user .message-bubble {
      background: #4f46e5;
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-wrapper:not(.user) .message-bubble {
      background: white;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .message-time {
      font-size: 10px;
      color: #94a3b8;
    }

    .typing-indicator {
      display: flex;
      gap: 4px;
      padding: 12px 16px;
      background: white;
      border-radius: 18px;
      width: fit-content;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }

    .typing-indicator span {
      width: 6px;
      height: 6px;
      background: #94a3b8;
      border-radius: 50%;
      animation: typing 1.4s infinite ease-in-out;
    }

    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    .chat-footer {
      padding: 16px;
      background: white;
      border-top: 1px solid #f1f5f9;
      display: flex;
      gap: 8px;
    }

    .chat-footer input {
      flex: 1;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 10px 16px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }

    .chat-footer input:focus {
      border-color: #4f46e5;
    }

    .send-btn {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      border: none;
      background: #4f46e5;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
      background: #3730a3;
      transform: scale(1.05);
    }

    .send-btn:disabled {
      background: #e2e8f0;
      cursor: not-allowed;
    }

    /* Dark mode */
    :host-context(.dark) .chat-window {
      background: #1e293b;
      border-color: rgba(255,255,255,0.1);
    }

    :host-context(.dark) .chat-messages {
      background: #0f172a;
    }

    :host-context(.dark) .message-wrapper:not(.user) .message-bubble {
      background: #334155;
      color: white;
    }

    :host-context(.dark) .chat-footer {
      background: #1e293b;
      border-top-color: #334155;
    }

    :host-context(.dark) .chat-footer input {
      background: #334155;
      border-color: #475569;
      color: white;
    }
  `]
})
export class AiAssistantComponent {
  private api = inject(ApiService);
  
  isOpen = signal(false);
  isTyping = signal(false);
  userInput = '';
  messages = signal<any[]>([
    { id: 1, text: 'Bonjour ! Je suis l\'assistant intelligent de GestProjet. Comment puis-je vous aider dans la gestion de vos missions aujourd\'hui ?', isUser: false, time: new Date() }
  ]);

  toggle() {
    this.isOpen.update(v => !v);
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userMsg = { id: Date.now(), text: this.userInput, isUser: true, time: new Date() };
    this.messages.update(prev => [...prev, userMsg]);
    
    const context = {
      user: this.api.getCurrentUser(),
      page: window.location.pathname
    };

    const query = this.userInput;
    this.userInput = '';
    this.isTyping.set(true);

    this.api.chatWithAI(query, context).subscribe({
      next: (res: any) => {
        this.isTyping.set(false);
        const aiMsg = { 
          id: Date.now(), 
          text: res.response || res.reply || 'Désolé, je n\'ai pas pu traiter votre demande.', 
          isUser: false, 
          time: new Date() 
        };
        this.messages.update(prev => [...prev, aiMsg]);
      },
      error: () => {
        this.isTyping.set(false);
        const errorMsg = { id: Date.now(), text: 'Une erreur est survenue lors de la communication avec l\'IA.', isUser: false, time: new Date() };
        this.messages.update(prev => [...prev, errorMsg]);
      }
    });
  }
}
