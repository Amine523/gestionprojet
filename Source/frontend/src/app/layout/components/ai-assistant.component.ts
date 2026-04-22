import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `

    <div class="fixed bottom-10 right-10 z-[200] font-sans">
      <!-- Chat Interface -->
      @if (isOpened()) {
        <div class="absolute bottom-24 right-0 w-[400px] h-[600px] bg-white dark:bg-slate-900 rounded-[40px] shadow-3xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-500">
          <header class="p-8 bg-slate-900 text-white flex items-center justify-between relative overflow-hidden">
            <div class="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-2xl"></div>
            <div class="relative z-10 flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 animate-pulse">
                <i class="bi bi-robot text-2xl"></i>
              </div>
              <div>
                <h3 class="text-lg font-black tracking-tighter uppercase italic leading-none">Neural Core</h3>
                <div class="flex items-center gap-2 mt-1">
                  <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span class="text-[9px] font-black uppercase tracking-widest text-emerald-500">Processing Active</span>
                </div>
              </div>
            </div>
            <button (click)="toggle()" class="relative z-10 w-10 h-10 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center">
              <i class="bi bi-dash-lg text-xl"></i>
            </button>
          </header>

          <div class="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 dark:bg-slate-800/30 custom-scrollbar">
            @for (msg of messages(); track $index) {
              <div class="flex flex-col" [class.items-end]="msg.role === 'user'" [class.items-start]="msg.role !== 'user'">
                <div class="max-w-[85%] p-5 rounded-[24px] text-sm font-bold shadow-sm"
                     [class.bg-indigo-600]="msg.role === 'user'"
                     [class.text-white]="msg.role === 'user'"
                     [class.rounded-tr-md]="msg.role === 'user'"
                     [class.bg-white]="msg.role !== 'user'"
                     [class.dark:bg-slate-800]="msg.role !== 'user'"
                     [class.text-slate-700]="msg.role !== 'user'"
                     [class.dark:text-slate-200]="msg.role !== 'user'"
                     [class.rounded-tl-md]="msg.role !== 'user'"
                     [class.border]="msg.role !== 'user'"
                     [class.border-slate-100]="msg.role !== 'user'"
                     [class.dark:border-slate-700]="msg.role !== 'user'">
                  {{ msg.content }}
                </div>
              </div>
            }
            @if (isLoading()) {
              <div class="flex items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl w-20 border border-slate-100 dark:border-slate-700">
                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div class="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
              </div>
            }
          </div>

          <footer class="p-6 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800">
            <div class="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-3xl border-2 border-transparent focus-within:border-indigo-500/20 transition-all">
              <input type="text" [(ngModel)]="userInput" (keyup.enter)="sendMessage()" 
                     placeholder="Sync directive..." class="flex-1 bg-transparent border-none outline-none px-4 font-bold text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400">
              <button (click)="sendMessage()" [disabled]="isLoading() || !userInput.trim()"
                      class="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-indigo-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-30">
                <i class="bi bi-send-fill text-lg"></i>
              </button>
            </div>
          </footer>
        </div>
      }

      <!-- Toggle Button -->
      <button (click)="toggle()" 
              class="w-18 h-18 rounded-[28px] bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center shadow-3xl hover:scale-110 active:scale-95 transition-all group overflow-hidden relative">
        <div class="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
        @if (!isOpened()) {
          <i class="bi bi-robot text-3xl group-hover:rotate-12 transition-transform"></i>
        } @else {
          <i class="bi bi-chevron-down text-3xl"></i>
        }
      </button>
    </div>
  `
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

