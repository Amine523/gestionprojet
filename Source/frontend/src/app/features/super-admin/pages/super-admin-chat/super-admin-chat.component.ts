import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Message {
  id: string;
  text: string;
  from: string;
  fromName: string;
  fromRole: string;
  time: string;
  date: string;
  attachments?: { name: string; url: string }[];
}

interface Conversation {
  id: string;
  nom: string;
  societeId: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  domaine?: string;
  couleur?: string;
}

@Component({
  selector: 'app-super-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="chat-layout">
      <!-- Sidebar -->
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <div class="header-content">
            <h2 class="header-title">Messages</h2>
            <span class="header-subtitle">{{conversations.length}} société(s)</span>
          </div>
        </div>

        <div class="search-container">
          <div class="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterConversations()"
              class="input-base pl-10 bg-gray-50 dark:bg-gray-800/50 border-transparent"
              placeholder="Rechercher une société...">
          </div>
        </div>

        <div class="contacts-list">
          @if (filteredConversations.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                <line x1="9" y1="22" x2="9" y2="22.01"/>
                <line x1="15" y1="22" x2="15" y2="22.01"/>
                <line x1="12" y1="22" x2="12" y2="22.01"/>
              </svg>
              <span>Aucune société trouvée</span>
            </div>
          } @else {
            @for (conv of filteredConversations; track conv.id) {
              <div class="contact-item" 
                   [class.active]="selectedConversation?.id === conv.id"
                   [class.unread]="conv.unread > 0"
                   (click)="selectConversation(conv)">
                <div class="contact-avatar" [style.background]="conv.couleur || 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'">
                  {{conv.avatar}}
                  @if (conv.unread > 0) {
                    <span class="unread-badge">{{conv.unread}}</span>
                  }
                </div>
                <div class="contact-info">
                  <div class="contact-header">
                    <span class="contact-name">{{conv.nom}}</span>
                    <span class="contact-time">{{conv.time}}</span>
                  </div>
                  <div class="contact-preview">
                    <span class="preview-text">{{conv.lastMessage || 'Démarrer une conversation'}}</span>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      </aside>

      <!-- Chat Area -->
      <main class="chat-main">
        @if (selectedConversation) {
          <!-- Chat Header -->
          <header class="chat-header">
            <div class="header-left">
              <div class="header-avatar" [style.background]="selectedConversation.couleur || 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))'">
                {{selectedConversation.avatar}}
              </div>
              <div class="header-details">
                <h3 class="header-name">{{selectedConversation.nom}}</h3>
                <span class="header-status">
                  <span class="status-dot"></span>
                  Admin Société
                </span>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn-icon btn-ghost" (click)="envoyerEmail()" title="Envoyer un email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </button>
              <button class="btn-icon btn-ghost" (click)="voirProfil()" title="Voir profil">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
              <button class="btn-icon btn-ghost" (click)="markAsRead()" title="Marquer comme lu">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                  <polyline points="20 12 9 17 4 12"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Messages Area -->
          <div class="messages-area" #messagesScroll>
            @if (messages.length === 0) {
              <div class="no-messages">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>Aucun message avec {{selectedConversation.nom}}</p>
                <span>Envoyez un message pour démarrer la conversation</span>
              </div>
            } @else {
              <div class="date-divider">
                <span>Conversation avec {{selectedConversation.nom}}</span>
              </div>
              @for (msg of messages; track msg.id) {
                <div class="message-wrapper" [class.from-me]="msg.from == currentUser?.id" [class.from-them]="msg.from != currentUser?.id">
                  @if (msg.from != currentUser?.id) {
                    <div class="message-avatar">{{(msg.fromName || '').charAt(0) || 'A'}}</div>
                  }
                  <div class="message-bubble" [class.from-me]="msg.from == currentUser?.id" [class.from-them]="msg.from != currentUser?.id">
                    <span class="message-sender">{{msg.fromName}}</span>
                    <span class="message-role">{{msg.fromRole}}</span>
                    <p class="message-text">{{msg.text}}</p>
                    
                    @if (msg.attachments && msg.attachments.length > 0) {
                      <div class="message-attachments" style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
                        @for (att of msg.attachments; track att.name) {
                          <div (click)="downloadAttachment(att)" class="attachment-item" style="display: flex; align-items: center; gap: 8px; padding: 6px 12px; background: rgba(255,255,255,0.1); border-radius: 6px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); font-size: 12px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{att.name}}</span>
                          </div>
                        }
                      </div>
                    }

                    <span class="message-time">{{msg.time}}</span>
                  </div>
                </div>
              }
            }
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <button class="btn-icon btn-ghost" (click)="fileInput.click()" title="Pièce jointe">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input type="file" #fileInput (change)="onFileSelected($event)" style="display: none" multiple>
            <input type="text"
                   [(ngModel)]="newMessage"
                   (keyup.enter)="sendMessage()"
                   class="input-base flex-1 bg-gray-50 dark:bg-gray-800/50 border-transparent"
                   placeholder="Tapez votre message...">
            <button class="btn btn-primary btn-icon" (click)="sendMessage()" [disabled]="!newMessage.trim()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        } @else {
          <div class="no-chat-selected">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Bienvenue dans les Messages</h3>
            <p>Sélectionnez une société dans la liste pour voir ou démarrer une conversation</p>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .chat-layout {
      display: flex;
      gap: 0;
      height: calc(100vh - 140px);
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .chat-sidebar {
      width: 340px;
      display: flex;
      flex-direction: column;
      background: white;
      border-right: 1px solid var(--color-border);
    }

    .sidebar-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .header-content h2 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .header-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .search-container {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .contacts-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-sm);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-2xl);
      color: var(--color-text-light);
      text-align: center;
    }

    .empty-state span {
      font-size: var(--font-size-sm);
      margin-top: var(--space-md);
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      margin-bottom: var(--space-xs);
    }

    .contact-item:hover {
      background: var(--color-bg);
    }

    .contact-item.active {
      background: var(--color-primary-light);
    }

    .contact-item.unread {
      background: rgba(var(--color-primary-rgb), 0.05);
    }

    .contact-avatar {
      width: 44px;
      height: 44px;
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      position: relative;
      flex-shrink: 0;
    }

    .unread-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--color-primary);
      color: white;
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    .contact-info {
      flex: 1;
      min-width: 0;
    }

    .contact-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }

    .contact-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .contact-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-light);
    }

    .contact-preview {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .preview-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .chat-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: white;
    }

    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) var(--space-lg);
      background: white;
      border-bottom: 1px solid var(--color-border);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .header-avatar {
      width: 44px;
      height: 44px;
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
    }

    .header-details {
      display: flex;
      flex-direction: column;
    }

    .header-name {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
      color: var(--color-text);
      margin: 0;
    }

    .header-status {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
    }

    .header-actions {
      display: flex;
      gap: var(--space-xs);
    }

    .messages-area {
      flex: 1;
      padding: var(--space-lg);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      background: var(--color-bg);
    }

    .no-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--color-text-light);
    }

    .no-messages p {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      margin: var(--space-md) 0 var(--space-xs);
    }

    .no-messages span {
      font-size: var(--font-size-sm);
    }

    .date-divider {
      text-align: center;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: var(--space-md) 0;
      font-weight: var(--font-weight-medium);
    }

    .date-divider span {
      background: var(--color-border);
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
    }

    .message-wrapper {
      display: flex;
      align-items: flex-end;
      gap: var(--space-sm);
      max-width: 70%;
    }

    .message-wrapper.from-me {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .message-wrapper.from-them {
      align-self: flex-start;
    }

    .message-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      flex-shrink: 0;
    }

    .message-bubble {
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-lg);
      position: relative;
      max-width: 100%;
    }

    .message-bubble.from-me {
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      border-bottom-right-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
    }

    .message-bubble.from-them {
      background: white;
      color: var(--color-text);
      border-bottom-left-radius: var(--radius-sm);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .message-sender {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      display: block;
      margin-bottom: var(--space-xs);
      color: var(--color-primary);
    }

    .message-role {
      font-size: 10px;
      opacity: 0.8;
      margin-left: var(--space-xs);
    }

    .message-text {
      margin: 0;
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
    }

    .message-time {
      font-size: 10px;
      opacity: 0.7;
      display: block;
      text-align: right;
      margin-top: var(--space-xs);
    }

    .input-area {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      background: white;
      border-top: 1px solid var(--color-border);
    }

    .no-chat-selected {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-light);
      padding: var(--space-2xl);
    }

    .no-chat-selected h3 {
      margin: var(--space-md) 0 var(--space-xs);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .no-chat-selected p {
      margin: 0;
      font-size: var(--font-size-sm);
    }

    /* Dark mode */
    :host-context(.dark) .chat-layout {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .chat-sidebar,
    :host-context(.dark) .chat-main {
      background: var(--color-surface);
    }

    :host-context(.dark) .message-bubble.from-them {
      background: var(--color-surface);
      border-color: var(--color-border);
    }
  `]
})
export class SuperAdminChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  searchQuery = '';
  currentUser: any = null;
  
  conversations: Conversation[] = [];
  filteredConversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  newMessage = '';

  ngOnInit() {
    this.currentUser = this.api.getCurrentUser();
    this.loadConversations();
  }

  loadConversations() {
    this.api.getSocietes().subscribe({
      next: (societes) => {
        this.conversations = societes.map((s: any) => ({
          id: s.id,
          nom: s.nom || 'Société',
          societeId: s.id,
          lastMessage: '',
          time: '',
          unread: 0,
          avatar: s.nom?.charAt(0)?.toUpperCase() || 'S',
          domaine: s.domaine || '',
          couleur: s.couleur || this.generateColor(s.nom)
        }));
        
        this.loadMessagesFromStorage();
        this.filterConversations();
      },
      error: () => {
        const storage = this.api.getRawStorage();
        this.conversations = (storage.societes || []).map((s: any) => ({
          id: s.id,
          nom: s.nom || 'Société',
          societeId: s.id,
          lastMessage: '',
          time: '',
          unread: 0,
          avatar: s.nom?.charAt(0)?.toUpperCase() || 'S',
          domaine: s.domaine || '',
          couleur: s.couleur || this.generateColor(s.nom)
        }));
        this.loadMessagesFromStorage();
        this.filterConversations();
      }
    });
  }

  generateColor(name: string): string {
    const colors = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a8edea, #fed6e3)',
      'linear-gradient(135deg, #ff9a9e, #fecfef)',
      'linear-gradient(135deg, #ffecd2, #fcb69f)'
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

  loadMessagesFromStorage() {
    const storage = this.api.getRawStorage();
    const conversationsData = storage.conversations || {};
    
    // Check each societeId key in conversations
    Object.keys(conversationsData).forEach(key => {
      if (key === 'SUPER') return; // Skip old SUPER key
      
      const conv = this.conversations.find(c => c.societeId === key);
      if (conv) {
        const msgs = conversationsData[key] || [];
        if (msgs.length > 0) {
          conv.lastMessage = msgs[msgs.length - 1].text || '';
          conv.time = msgs[msgs.length - 1].time || '';
          conv.unread = msgs.filter((m: any) => m.from !== this.currentUser?.id && !m.lu).length;
        }
      }
    });
    
    // Also check SUPER key for backward compatibility
    if (conversationsData['SUPER'] && conversationsData['SUPER'].length > 0) {
      const msgs = conversationsData['SUPER'];
      const lastMsg = msgs[msgs.length - 1];
      if (this.conversations.length > 0) {
        this.conversations[0].lastMessage = lastMsg?.text || '';
        this.conversations[0].time = lastMsg?.time || '';
      }
    }
  }

  filterConversations() {
    if (this.searchQuery) {
      this.filteredConversations = this.conversations.filter(c => 
        c.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredConversations = [...this.conversations];
    }
  }

  selectConversation(conv: Conversation) {
    this.selectedConversation = conv;
    this.loadMessages(conv.societeId);
  }

  loadMessages(societeId: string) {
    const roomId = `room_societe_${societeId}`;
    this.api.getChatMessages(roomId).subscribe({
      next: (data) => {
        this.messages = (data || []).map((m: any) => ({
          id: m.id,
          text: m.text,
          from: m.from,
          fromName: m.fromName,
          fromRole: m.fromRole,
          time: m.time,
          date: m.date,
          attachments: m.attachments
        })).sort((a: any, b: any) => {
          const dateA = a.date ? new Date(a.date).getTime() : 0;
          const dateB = b.date ? new Date(b.date).getTime() : 0;
          return dateA - dateB;
        });
      },
      error: () => {
        this.messages = [];
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0 || !this.selectedConversation) return;

    this.snackBar.open('Téléchargement...', 'Fermer', { duration: 2000 });
    const roomId = `room_societe_${this.selectedConversation.societeId}`;

    Array.from(files).forEach(file => {
      this.api.uploadFile(file, roomId, 'ChatAttachment').subscribe({
        next: (res: any) => {
          const now = new Date();
          const msg: Message = {
            id: Date.now().toString(),
            text: `Document envoyé : ${file.name}`,
            from: this.currentUser?.id || 'SUPER_ADMIN',
            fromName: this.currentUser?.nom || 'Super Admin',
            fromRole: 'Super Administrateur',
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            date: now.toISOString()
          };
          
          const payload = { ...msg, chatRoomId: roomId, attachments: [{ name: file.name, url: res.url }] };

          this.api.sendChatMessage(payload).subscribe({
            next: () => {
              this.messages.push({ ...msg, attachments: payload.attachments });
              this.messages = [...this.messages];
              this.snackBar.open('Fichier envoyé!', 'Fermer', { duration: 2000 });
            },
            error: () => this.snackBar.open('Erreur message', 'OK')
          });
        },
        error: () => this.snackBar.open('Erreur upload', 'OK')
      });
    });
    event.target.value = '';
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const roomId = `room_societe_${this.selectedConversation.societeId}`;
    const msg: Message = {
      id: Date.now().toString(),
      text: this.newMessage,
      from: this.currentUser?.id || 'SUPER_ADMIN',
      fromName: this.currentUser?.nom || 'Super Admin',
      fromRole: 'Super Administrateur',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    const payload = { ...msg, chatRoomId: roomId };

    this.api.sendChatMessage(payload).subscribe({
      next: () => {
        this.messages.push(msg);
        if (this.selectedConversation) {
          this.selectedConversation.lastMessage = this.newMessage;
          this.selectedConversation.time = msg.time;
        }
        this.newMessage = '';
        this.snackBar.open('Message envoyé', 'Fermer', { duration: 3000 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi du message', 'Fermer', { duration: 3000 });
      }
    });
  }

  downloadAttachment(att: { name: string; url: string }) {
    const link = document.createElement('a');
    link.href = att.url;
    link.download = att.name;
    link.target = '_blank';
    link.click();
  }

  saveMessages(societeId: string, msgs: Message[]) {
    const storage = this.api.getRawStorage();
    if (!storage.conversations) storage.conversations = {};
    // Save to society-specific key for unique conversation per society
    storage.conversations[societeId] = msgs;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  markAsRead() {
    if (this.selectedConversation) {
      this.selectedConversation.unread = 0;
      this.conversations = this.conversations.map(c => 
        c.id === this.selectedConversation?.id ? { ...c, unread: 0 } : c
      );
      this.snackBar.open('Marqué comme lu', 'Fermer', { duration: 3000 });
    }
  }

  envoyerEmail() {
    this.snackBar.open('Fonctionnalité Email bientôt disponible', 'Fermer', { duration: 3000 });
  }

  voirProfil() {
    this.snackBar.open('Profil de la société', 'Fermer', { duration: 3000 });
  }
}

