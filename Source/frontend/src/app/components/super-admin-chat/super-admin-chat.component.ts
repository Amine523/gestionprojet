import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface Message {
  id: string;
  text: string;
  from: string;
  fromName: string;
  fromRole: string;
  time: string;
  date: string;
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
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-wrapper">
      <div class="chat-container">
        <!-- Sidebar -->
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="header-brand">
              <div class="logo-icon">
                <i class="bi bi-headset text-white"></i>
              </div>
              <div class="header-title">
                <h2>Messages</h2>
                <span class="subtitle">{{conversations.length}} société(s)</span>
              </div>
            </div>
          </div>

          <div class="search-container">
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input type="text" class="form-control" placeholder="Rechercher une société..." [(ngModel)]="searchQuery" (ngModelChange)="filterConversations()">
            </div>
          </div>

          <div class="societies-list">
            @if (filteredConversations.length === 0) {
              <div class="empty-state">
                <i class="bi bi-building"></i>
                <p>Aucune société trouvée</p>
              </div>
            } @else {
              @for (conv of filteredConversations; track conv.id) {
                <div class="society-item" 
                     [class.active]="selectedConversation?.id === conv.id"
                     [class.unread]="conv.unread > 0"
                     (click)="selectConversation(conv)">
                  <div class="society-avatar" [style.background]="conv.couleur || 'linear-gradient(135deg, #667eea, #764ba2)'">
                    {{conv.avatar}}
                  </div>
                  <div class="society-info">
                    <div class="society-header">
                      <span class="society-name">{{conv.nom}}</span>
                      @if (conv.time) {
                        <span class="society-time">{{conv.time}}</span>
                      }
                    </div>
                    <div class="society-preview">
                      <span class="preview-text">{{conv.lastMessage || 'Démarrer une conversation'}}</span>
                      @if (conv.unread > 0) {
                        <span class="unread-badge">{{conv.unread}}</span>
                      }
                    </div>
                  </div>
                </div>
              }
            }
          </div>
        </div>

        <!-- Chat Area -->
        <div class="chat-area">
          @if (selectedConversation) {
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-header-left">
                <div class="chat-avatar" [style.background]="selectedConversation.couleur || 'linear-gradient(135deg, #667eea, #764ba2)'">
                  {{selectedConversation.avatar}}
                </div>
                <div class="chat-info">
                  <h3>{{selectedConversation.nom}}</h3>
                  <span class="chat-status">
                    <span class="status-dot"></span>
                    Admin Société
                  </span>
                </div>
              </div>
              <div class="chat-header-right">
                <button class="btn btn-sm btn-outline-primary" (click)="envoyerEmail()" title="Envoyer un email">
                  <i class="bi bi-envelope"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary" (click)="voirProfil()" title="Voir profil">
                  <i class="bi bi-person"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary" (click)="markAsRead()" title="Marquer comme lu">
                  <i class="bi bi-check-all"></i>
                </button>
              </div>
            </div>

            <!-- Messages -->
            <div class="messages-area">
              <div class="messages-scroll" #messagesScroll>
                @if (messages.length === 0) {
                  <div class="no-messages">
                    <i class="bi bi-chat-dots"></i>
                    <p>Aucun message avec {{selectedConversation.nom}}</p>
                    <span>Envoyez un message pour démarrer la conversation</span>
                  </div>
                } @else {
                  <div class="date-divider">
                    <span>Conversation avec {{selectedConversation.nom}}</span>
                  </div>
                  @for (msg of messages; track msg.id) {
                    <div class="message-wrapper" [class.from-me]="msg.from === currentUser?.id">
                      <div class="message-bubble" [class.unread]="msg.from !== currentUser?.id && msg.from !== 'SUPER_ADMIN'">
                        <div class="message-sender">
                          <span class="sender-name">{{msg.fromName}}</span>
                          <span class="sender-role">{{msg.fromRole}}</span>
                        </div>
                        <p class="message-text">{{msg.text}}</p>
                        <span class="message-timestamp">{{msg.time}}</span>
                      </div>
                    </div>
                  }
                }
              </div>
            </div>

            <!-- Input Area -->
            <div class="input-area">
              <div class="input-container">
                <div class="input-group">
                  <input type="text"
                         class="form-control"
                         placeholder="Tapez votre message..."
                         [(ngModel)]="newMessage"
                         (keyup.enter)="sendMessage()">
                  <button class="btn btn-primary" (click)="sendMessage()" [disabled]="!newMessage.trim()">
                    <i class="bi bi-send"></i>
                  </button>
                </div>
              </div>
            </div>
          } @else {
            <!-- No Chat Selected -->
            <div class="no-chat">
              <div class="no-chat-content">
                <div class="no-chat-icon">
                  <i class="bi bi-chat-square-text"></i>
                </div>
                <h3>Bienvenue dans les Messages</h3>
                <p>Sélectionnez une société dans la liste pour voir ou démarrer une conversation</p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .chat-wrapper {
      height: calc(100vh - 48px);
      background: #f8f9fc;
      padding: 20px;
    }
    
    .chat-container {
      display: flex;
      height: 100%;
      background: white;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    /* Sidebar */
    .sidebar {
      width: 360px;
      border-right: 1px solid #e8ecf0;
      display: flex;
      flex-direction: column;
      background: white;
    }
    
    .sidebar-header {
      padding: 20px;
      border-bottom: 1px solid #e8ecf0;
    }
    
    .header-brand {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    
    .logo-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #e53935, #c62828);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo-icon mat-icon {
      color: white;
      font-size: 24px;
    }
    
    .header-title h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
    }
    
    .header-title .subtitle {
      font-size: 13px;
      color: #888;
    }
    
    .search-container {
      padding: 16px 20px;
    }
    
    .search-field {
      width: 100%;
    }
    
    .search-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    
    .societies-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 12px;
    }
    
    .society-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 4px;
    }
    
    .society-item:hover {
      background: #f5f7fa;
    }
    
    .society-item.active {
      background: linear-gradient(135deg, rgba(229, 57, 53, 0.08), rgba(198, 40, 40, 0.04));
    }
    
    .society-item.unread {
      background: #fff8f0;
    }
    
    .society-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 18px;
      flex-shrink: 0;
    }
    
    .society-info {
      flex: 1;
      min-width: 0;
    }
    
    .society-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    
    .society-name {
      font-weight: 600;
      font-size: 14px;
      color: #1a1a2e;
    }
    
    .society-time {
      font-size: 11px;
      color: #aaa;
    }
    
    .society-preview {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .preview-text {
      font-size: 13px;
      color: #666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }
    
    .unread-badge {
      background: #e53935;
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
    
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #999;
    }
    
    .empty-state mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 12px;
      color: #ccc;
    }

    /* Chat Area */
    .chat-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #fafbfc;
    }
    
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background: white;
      border-bottom: 1px solid #e8ecf0;
    }
    
    .chat-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    
    .chat-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 16px;
    }
    
    .chat-info h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }
    
    .chat-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #666;
    }
    
    .status-dot {
      width: 8px;
      height: 8px;
      background: #4caf50;
      border-radius: 50%;
    }
    
    .chat-header-right {
      display: flex;
      gap: 4px;
    }
    
    .chat-header-right button {
      color: #666;
    }
    
    .chat-header-right button:hover {
      background: #f5f5f5;
    }
    
    .messages-area {
      flex: 1;
      overflow: hidden;
    }
    
    .messages-scroll {
      height: 100%;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .no-messages {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #999;
    }
    
    .no-messages mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      margin-bottom: 16px;
      color: #ddd;
    }
    
    .no-messages p {
      font-size: 16px;
      color: #666;
      margin: 0 0 8px;
    }
    
    .no-messages span {
      font-size: 13px;
      color: #999;
    }
    
    .date-divider {
      text-align: center;
      padding: 8px 0;
    }
    
    .date-divider span {
      background: #f0f2f5;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 12px;
      color: #666;
    }
    
    .message-wrapper {
      display: flex;
      justify-content: flex-start;
    }
    
    .message-wrapper.from-me {
      justify-content: flex-end;
    }
    
    .message-bubble {
      max-width: 70%;
      padding: 14px 18px;
      border-radius: 16px;
      background: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    
    .message-wrapper.from-me .message-bubble {
      background: linear-gradient(135deg, #e53935, #c62828);
      color: white;
    }
    
    .message-bubble.unread {
      border-left: 3px solid #e53935;
      background: #fffcf5;
    }
    
    .message-bubble.unread .sender-name {
      font-weight: 700;
    }
    
    .message-bubble.unread .message-text {
      font-weight: 500;
    }
    
    .message-sender {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }
    
    .sender-name {
      font-weight: 600;
      font-size: 13px;
    }
    
    .sender-role {
      font-size: 11px;
      opacity: 0.8;
    }
    
    .message-text {
      margin: 0;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .message-timestamp {
      display: block;
      text-align: right;
      font-size: 11px;
      opacity: 0.7;
      margin-top: 8px;
    }
    
    .input-area {
      padding: 16px 24px;
      background: white;
      border-top: 1px solid #e8ecf0;
    }
    
    .input-container {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .message-input-field {
      flex: 1;
    }
    
    .message-input-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    
    .message-input-field button[mat-icon-button] {
      color: #e53935;
    }
    
    .message-input-field button[mat-icon-button]:disabled {
      color: #ccc;
    }

    /* No Chat Selected */
    .no-chat {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .no-chat-content {
      text-align: center;
      max-width: 400px;
    }
    
    .no-chat-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #f5f5f5, #eee);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    
    .no-chat-icon mat-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #ccc;
    }
    
    .no-chat-content h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a2e;
      margin: 0 0 12px;
    }
    
    .no-chat-content p {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.6;
    }
  `]
})
export class SuperAdminChatComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);

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
    const storage = this.api.getRawStorage();
    
    if (!storage.conversations) {
      storage.conversations = {};
    }
    
    const conversationsData = storage.conversations;
    let msgs: Message[] = [];
    
    if (conversationsData[societeId]) {
      msgs = conversationsData[societeId];
    }
    
    this.messages = [...msgs].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateA - dateB;
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;

    const msg: Message = {
      id: Date.now().toString(),
      text: this.newMessage,
      from: this.currentUser?.id || 'SUPER_ADMIN',
      fromName: this.currentUser?.nom || 'Super Admin',
      fromRole: 'Super Administrateur',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString()
    };

    this.messages.push(msg);
    
    // Save to society-specific key
    this.saveMessages(this.selectedConversation.societeId, this.messages);
    
    if (this.selectedConversation) {
      this.selectedConversation.lastMessage = this.newMessage;
      this.selectedConversation.time = msg.time;
    }
    
    this.newMessage = '';
    alert('Message envoyé');
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
      alert('Marqué comme lu');
    }
  }

  envoyerEmail() {
    alert('Fonctionnalité Email bientôt disponible');
  }

  voirProfil() {
    alert('Profil de la société');
  }
}
