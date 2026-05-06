import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="ai-assistant-container" [class.opened]="isOpened()">
      <!-- Chat Window -->
      @if (isOpened()) {
        <div class="chat-window shadow-lg animate-fade-in">
          <div class="chat-header d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-2">
              <div class="ai-avatar pulse">
                <i class="bi bi-robot"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 14px;">Assistant IA NADHEMNI</div>
                <div class="status-indicator">En ligne</div>
              </div>
            </div>
            <button class="btn-close-ai" (click)="toggle()">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
          <div class="chat-body" #chatBody>
            @for (msg of messages(); track $index) {
              <div class="message-wrapper" [class.user]="msg.role === 'user'">
                <div class="message-bubble">
                  {{ msg.content }}
                </div>
              </div>
            }
            @if (isLoading()) {
              <div class="message-wrapper">
                <div class="message-bubble loading">
                  <span>.</span><span>.</span><span>.</span>
                </div>
              </div>
            }
          </div>
          
          <div class="chat-footer">
            <div class="input-group">
              <input type="text" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" 
                     placeholder="Posez une question..." class="form-control border-0 bg-light">
              <button class="btn btn-primary btn-send" (click)="sendMessage()" [disabled]="isLoading() || !userInput.trim()">
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Floating Button -->
      <button class="floating-btn shadow-lg" (click)="toggle()" [class.active]="isOpened()">
        @if (!isOpened()) {
          <i class="bi bi-robot"></i>
        } @else {
          <i class="bi bi-chevron-down"></i>
        }
      </button>
    </div>
  `,
  styles: [`
    .ai-assistant-container { position: fixed; bottom: 30px; right: 30px; z-index: 1000; font-family: 'Inter', sans-serif; }
    .floating-btn { width: 60px; height: 60px; border-radius: 30px; background: linear-gradient(135deg, #0284c7, #6366f1); color: white; border: none; display: flex; align-items: center; justify-content: center; font-size: 28px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); cursor: pointer; }
    .floating-btn:hover { transform: scale(1.1); box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4); }
    .floating-btn.active { background: #1e293b; transform: rotate(0deg); }
    
    .chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; background: white; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; border: 1px solid rgba(0,0,0,0.05); }
    .chat-header { background: #0f172a; color: white; padding: 15px 20px; }
    .ai-avatar { width: 32px; height: 32px; background: rgba(255,255,255,0.1); border-radius: 8px; display: flex; align-items: center; justify-content: center; }
    .status-indicator { font-size: 10px; color: #10b981; display: flex; align-items: center; gap: 4px; }
    .status-indicator::before { content: ''; width: 6px; height: 6px; background: #10b981; border-radius: 50%; display: inline-block; }
    .btn-close-ai { background: transparent; border: none; color: white; opacity: 0.7; transition: 0.2s; }
    .btn-close-ai:hover { opacity: 1; transform: scale(1.1); }

    .chat-body { flex-grow: 1; padding: 20px; overflow-y: auto; background: #f8fafc; display: flex; flex-direction: column; gap: 15px; }
    .message-wrapper { display: flex; flex-direction: column; }
    .message-wrapper.user { align-items: flex-end; }
    .message-bubble { max-width: 80%; padding: 10px 15px; border-radius: 15px; font-size: 14px; line-height: 1.5; box-shadow: 0 2px 5px rgba(0,0,0,0.02); }
    .message-wrapper:not(.user) .message-bubble { background: white; color: #1e293b; border-bottom-left-radius: 4px; border: 1px solid #e2e8f0; }
    .message-wrapper.user .message-bubble { background: #0284c7; color: white; border-bottom-right-radius: 4px; }

    .chat-footer { padding: 15px; background: white; border-top: 1px solid #f1f5f9; }
    .btn-send { background: #0284c7; border: none; border-radius: 10px !important; margin-left: 8px; }

    .loading span { animation: blink 1.4s infinite both; font-size: 24px; line-height: 10px; }
    .loading span:nth-child(2) { animation-delay: 0.2s; }
    .loading span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0% { opacity: 0.2; } 20% { opacity: 1; } 100% { opacity: 0.2; } }
    
    .pulse { animation: pulse-animation 2s infinite; }
    @keyframes pulse-animation { 0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4); } 100% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } }
  `]
})
export class AIAssistantComponent {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  
  isOpened = signal(false);
  isLoading = signal(false);
  messages = signal<{role: string, content: string}[]>([
    { role: 'ai', content: 'Bonjour ! Je suis votre assistant NADHEMNI IA. Comment puis-je vous aider aujourd\'hui ?' }
  ]);
  userInput = '';

  toggle() {
    this.isOpened.set(!this.isOpened());
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading()) return;

    const userMsg = this.userInput;
    this.messages.update(prev => [...prev, { role: 'user', content: userMsg }]);
    this.userInput = '';
    this.isLoading.set(true);

    // Call Backend AI
    this.api.chatWithAI(userMsg).subscribe({
      next: (res: any) => {
        this.messages.update(prev => [...prev, { role: 'ai', content: res.response || res.message }]);
        this.isLoading.set(false);
      },
      error: () => {
        this.messages.update(prev => [...prev, { role: 'ai', content: "Désolé, j'ai rencontré une erreur technique. Vérifiez que le service Ollama est actif." }]);
        this.isLoading.set(false);
      }
    });
  }
}
