import { Component, inject, signal, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="ai-assistant-container" [class.open]="isOpen()">
      <!-- Chat Toggle Button -->
      <button class="chat-toggle" (click)="toggle()" [attr.aria-label]="isOpen() ? 'Fermer l\\'assistant' : 'Ouvrir l\\'assistant'">
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
        <div class="chat-window shadow-premium">
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
              <span class="status">Connecté au Cloud</span>
            </div>
            <div class="header-actions">
               <button class="btn-minimize" (click)="toggle()">
                 <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
               </button>
            </div>
          </div>

          <div class="chat-messages" #scrollContainer>
            <div class="welcome-banner">
              <p>Optimisez votre productivité avec l'intelligence artificielle GestProjet.</p>
            </div>
            
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
            <div class="input-container">
              <input 
                type="text" 
                [(ngModel)]="userInput" 
                (keyup.enter)="sendMessage()" 
                placeholder="Posez une question..." 
                [disabled]="isTyping()">
              <button class="send-btn" (click)="sendMessage()" [disabled]="!userInput.trim() || isTyping()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
            <div class="footer-hint">Propulsé par GestProjet v4.0</div>
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

    .ai-assistant-container * { pointer-events: auto; }

    .chat-toggle {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      box-shadow: 0 12px 28px rgba(79, 70, 229, 0.35);
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .chat-toggle:hover {
      transform: translateY(-6px) scale(1.05);
      box-shadow: 0 18px 35px rgba(79, 70, 229, 0.45);
    }

    .toggle-label { font-weight: 700; font-size: 14px; letter-spacing: 0.5px; }

    .chat-window {
      width: 400px;
      height: 580px;
      background: white;
      border-radius: 28px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: chatAppear 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid rgba(0,0,0,0.06);
    }

    @keyframes chatAppear {
      from { opacity: 0; transform: translateY(40px) scale(0.9); filter: blur(10px); }
      to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    .chat-header {
      padding: 24px;
      background: #0f172a;
      color: white;
      display: flex;
      align-items: center;
      gap: 14px;
      position: relative;
    }

    .header-ai-icon {
      width: 44px; height: 44px;
      background: rgba(255,255,255,0.1);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .header-text h3 { margin: 0; font-size: 17px; font-weight: 700; letter-spacing: -0.5px; }
    .status { font-size: 11px; opacity: 0.8; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .status::before { content: ''; width: 8px; height: 8px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 8px #4ade80; }

    .header-actions { margin-left: auto; }
    .btn-minimize { background: transparent; border: none; color: white; opacity: 0.5; cursor: pointer; padding: 4px; border-radius: 4px; transition: 0.2s; }
    .btn-minimize:hover { opacity: 1; background: rgba(255,255,255,0.1); }

    .chat-messages {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background: #fcfdfe;
      scroll-behavior: smooth;
    }

    .welcome-banner {
      background: #eff6ff;
      border-radius: 16px;
      padding: 16px;
      font-size: 12px;
      color: #1e40af;
      text-align: center;
      border: 1px solid #dbeafe;
      margin-bottom: 8px;
    }

    .message-wrapper { display: flex; flex-direction: column; max-width: 88%; gap: 6px; }
    .message-wrapper.user { align-self: flex-end; align-items: flex-end; }

    .message-bubble {
      padding: 14px 18px;
      border-radius: 20px;
      font-size: 14.5px;
      line-height: 1.6;
      position: relative;
    }

    .message-wrapper.user .message-bubble {
      background: linear-gradient(135deg, #4f46e5, #6366f1);
      color: white;
      border-bottom-right-radius: 4px;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
    }

    .message-wrapper:not(.user) .message-bubble {
      background: white;
      color: #1e293b;
      border-bottom-left-radius: 4px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
      border: 1px solid #f1f5f9;
    }

    .message-time { font-size: 10px; color: #94a3b8; font-weight: 500; }

    .typing-indicator {
      display: flex; gap: 5px; padding: 14px 20px;
      background: white; border-radius: 20px; width: fit-content;
      box-shadow: 0 4px 12px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;
    }
    .typing-indicator span { width: 7px; height: 7px; background: #cbd5e1; border-radius: 50%; animation: typing 1.4s infinite ease-in-out; }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typing { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-5px); } }

    .chat-footer {
      padding: 24px;
      background: white;
      border-top: 1px solid #f1f5f9;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .input-container { display: flex; gap: 10px; }
    .input-container input {
      flex: 1; border: 1px solid #e2e8f0; border-radius: 16px;
      padding: 12px 18px; font-size: 14.5px; outline: none;
      transition: all 0.2s; background: #f8fafc;
    }
    .input-container input:focus { border-color: #4f46e5; background: white; box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1); }

    .send-btn {
      width: 48px; height: 48px; border-radius: 16px; border: none;
      background: #4f46e5; color: white; display: flex; align-items: center;
      justify-content: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .send-btn:hover:not(:disabled) { background: #3730a3; transform: scale(1.1) rotate(-10deg); }
    .send-btn:disabled { background: #f1f5f9; color: #cbd5e1; cursor: not-allowed; }

    .footer-hint { font-size: 10px; color: #cbd5e1; text-align: center; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

    .shadow-premium { box-shadow: 0 25px 80px rgba(0,0,0,0.18); }

    /* Dark mode */
    :host-context(.dark) .chat-window { background: #1e293b; border-color: rgba(255,255,255,0.08); }
    :host-context(.dark) .chat-messages { background: #0f172a; }
    :host-context(.dark) .message-wrapper:not(.user) .message-bubble { background: #334155; color: white; border-color: #475569; }
    :host-context(.dark) .chat-footer { background: #1e293b; border-top-color: #334155; }
    :host-context(.dark) .input-container input { background: #334155; border-color: #475569; color: white; }
    :host-context(.dark) .typing-indicator { background: #334155; border-color: #475569; }
    :host-context(.dark) .welcome-banner { background: rgba(30, 64, 175, 0.2); border-color: rgba(30, 64, 175, 0.3); color: #93c5fd; }
  `]
})
export class AIAssistantComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private api = inject(ApiService);
  private aiService = inject(AiService);
  
  isOpen = signal(false);
  isTyping = signal(false);
  userInput = '';
  messages = signal<any[]>([
    { id: 1, text: 'Bonjour ! Je suis <strong>GestProjet AI</strong>. Je peux vous aider à analyser vos missions, gérer vos équipes ou simplement répondre à vos questions techniques. Que souhaitez-vous faire ?', isUser: false, time: new Date() }
  ]);

  toggle() {
    this.isOpen.update(v => !v);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) {}
  }

  sendMessage() {
    const text = this.userInput.trim();
    if (!text || this.isTyping()) return;

    const userMsg = { id: Date.now(), text: text, isUser: true, time: new Date() };
    this.messages.update(prev => [...prev, userMsg]);
    this.userInput = '';
    
    const contextObj = {
      user: this.api.getCurrentUser(),
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    };
    const context = JSON.stringify(contextObj);

    this.isTyping.set(true);

    this.aiService.chat(text, context).subscribe({
      next: (res: any) => {
        this.isTyping.set(false);
        const aiMsg = { 
          id: Date.now() + 1, 
          text: res.response || res.reply || "Désolé, je n'ai pas pu traiter votre demande.", 
          isUser: false, 
          time: new Date() 
        };
        this.messages.update(prev => [...prev, aiMsg]);
      },
      error: (err) => {
        console.error('AI Chat Error:', err);
        this.isTyping.set(false);
        const errorMsg = { 
          id: Date.now() + 2, 
          text: "Une erreur est survenue lors de la communication avec l'IA.", 
          isUser: false, 
          time: new Date() 
        };
        this.messages.update(prev => [...prev, errorMsg]);
      }
    });
  }
}
