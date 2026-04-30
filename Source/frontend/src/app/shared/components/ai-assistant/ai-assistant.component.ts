import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AiService } from '@core/services/ai.service';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="fixed bottom-6 right-6 z-50">
      <!-- Chat Bubble Button -->
      @if (!isOpen()) {
        <button mat-fab color="primary" class="shadow-2xl scale-110 hover:scale-125 transition-transform" (click)="toggleChat()">
          <mat-icon>smart_toy</mat-icon>
        </button>
      }

      <!-- Chat Window -->
      @if (isOpen()) {
        <mat-card class="w-80 md:w-96 h-[500px] flex flex-col shadow-2xl rounded-3xl border-none overflow-hidden animate-fade-in-up">
          <!-- Header -->
          <div class="bg-indigo-600 p-4 text-white flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <mat-icon class="text-sm">auto_awesome</mat-icon>
              </div>
              <div>
                <div class="font-bold text-sm">Assistant GestProjet</div>
                <div class="text-[10px] opacity-80 flex items-center">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
                  Propulsé par IA
                </div>
              </div>
            </div>
            <button mat-icon-button (click)="toggleChat()" class="text-white/80 hover:text-white">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Messages -->
          <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900">
            @for (msg of messages(); track msg.timestamp) {
              <div [class]="'flex ' + (msg.role === 'user' ? 'justify-end' : 'justify-start')">
                <div [class]="'max-w-[80%] p-3 rounded-2xl text-sm ' + 
                            (msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none shadow-sm')">
                  {{ msg.content }}
                  <div [class]="'text-[8px] mt-1 opacity-50 ' + (msg.role === 'user' ? 'text-right' : 'text-left')">
                    {{ msg.timestamp | date:'shortTime' }}
                  </div>
                </div>
              </div>
            }
            @if (isTyping()) {
              <div class="flex justify-start">
                <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm flex space-x-1">
                  <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div class="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            }
          </div>

          <!-- Input -->
          <div class="p-4 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
            <form (ngSubmit)="sendMessage()" class="flex items-center space-x-2">
              <input type="text" [(ngModel)]="userInput" name="userInput"
                     placeholder="Posez votre question..."
                     class="flex-1 bg-slate-100 dark:bg-slate-900 border-none rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 dark:text-slate-200">
              <button mat-mini-fab color="primary" [disabled]="!userInput.trim() || isTyping()">
                <mat-icon>send</mat-icon>
              </button>
            </form>
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
  `]
})
export class AIAssistantComponent implements AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private aiService = inject(AiService);

  isOpen = signal(false);
  isTyping = signal(false);
  userInput = '';
  messages = signal<Message[]>([
    { role: 'assistant', content: 'Bonjour ! Comment puis-je vous aider aujourd\'hui avec vos projets ?', timestamp: new Date() }
  ]);

  toggleChat() {
    this.isOpen.set(!this.isOpen());
    if (this.isOpen()) {
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isTyping()) return;

    const userMsg = this.userInput;
    this.userInput = '';
    
    // Add user message
    this.messages.update(prev => [...prev, { role: 'user', content: userMsg, timestamp: new Date() }]);
    this.isTyping.set(true);

    // Call AI service
    this.aiService.generate(userMsg).subscribe({
      next: (res) => {
        this.messages.update(prev => [...prev, { 
          role: 'assistant', 
          content: res.answer || res.content || res.generated_text || 'Je n\'ai pas compris votre question.', 
          timestamp: new Date() 
        }]);
        this.isTyping.set(false);
      },
      error: () => {
        this.messages.update(prev => [...prev, { role: 'assistant', content: 'Désolé, une erreur est survenue lors de la communication avec le serveur IA.', timestamp: new Date() }]);
        this.isTyping.set(false);
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) {}
    }
  }
}
