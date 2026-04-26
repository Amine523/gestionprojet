import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Message {
  id: string;
  text: string;
  from: string;
  fromName: string;
  time: string;
  attachments?: { name: string; type: string; url: string }[];
}

interface Contact {
  id: string;
  nom: string;
  avatar: string;
  email: string;
  typeUtilisateurId: string;
  dernierMessage: string;
  time: string;
  unread: number;
  isGroup?: boolean;
}

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="chat-container">
      <!-- Sidebar -->
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <div class="header-content">
            <h2>Messages</h2>
            <span>{{contacts.length}} contact(s)</span>
          </div>
          <button class="btn-icon" (click)="openNewGroupDialog()" title="Nouveau groupe">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </button>
        </div>

        <div class="search-wrapper">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterContacts()"
            class="search-input"
            placeholder="Rechercher...">
        </div>

        <div class="contacts-list">
          @for (contact of filteredContacts; track contact.id) {
            <div class="contact-item" 
                 [class.active]="selectedContact?.id === contact.id"
                 [class.unread]="contact.unread > 0"
                 (click)="selectContact(contact)">
              <div class="contact-avatar">
                {{contact.avatar}}
                @if (contact.unread > 0) {
                  <span class="unread-badge">{{contact.unread}}</span>
                }
              </div>
              <div class="contact-info">
                <div class="contact-header">
                  <span class="contact-name">{{contact.nom}}</span>
                  <span class="contact-time">{{contact.time}}</span>
                </div>
                <div class="contact-preview">
                  <span class="preview-text">{{contact.dernierMessage || 'Démarrer une conversation'}}</span>
                </div>
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Chat Area -->
      <main class="chat-main">
        @if (selectedContact) {
          <!-- Chat Header -->
          <header class="chat-header">
            <div class="header-left">
              <div class="header-avatar">
                {{selectedContact.avatar}}
              </div>
              <div class="header-details">
                <h3>{{selectedContact.nom}}</h3>
                <span class="header-status">
                  <span class="status-dot"></span>
                  En ligne
                </span>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn-icon" title="Appeler">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </button>
              <button class="btn-icon" title="Vidéo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m23 7-7 5 7 5V7Z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Messages Area -->
          <div class="messages-area" #scrollContainer>
            @for (msg of messages; track msg.id) {
              <div class="message-wrapper" [class.from-me]="msg.from === currentUserId" [class.from-them]="msg.from !== currentUserId">
                @if (msg.from !== currentUserId) {
                  <div class="message-avatar">{{(msg.fromName || '').charAt(0) || 'A'}}</div>
                }
                <div class="message-bubble" [class.from-me]="msg.from === currentUserId" [class.from-them]="msg.from !== currentUserId">
                  @if (selectedContact.isGroup && msg.from !== currentUserId) {
                    <span class="message-sender">{{msg.fromName}}</span>
                  }
                  <p class="message-text">{{msg.text}}</p>
                  <span class="message-time">{{msg.time}}</span>
                </div>
              </div>
            }
            @if (messages.length === 0) {
              <div class="no-messages">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <p>Aucun message avec {{selectedContact.nom}}</p>
                <span>Envoyez un message pour démarrer la conversation</span>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <button class="btn-icon" (click)="fileInput.click()" title="Pièce jointe">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <input #fileInput type="file" hidden (change)="onFileSelected($event)" multiple>
            <input type="text" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()"
              class="message-input"
              placeholder="Tapez votre message...">
            <button class="btn btn-primary btn-icon" (click)="sendMessage()" [disabled]="!newMessage.trim()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
          </div>
        } @else {
          <div class="no-chat-selected">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>Bienvenue dans les Messages</h3>
            <p>Sélectionnez un contact pour commencer à discuter</p>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .chat-container {
      display: flex;
      gap: 0;
      height: calc(100vh - 140px);
      background: white;
      border-radius: var(--radius-xl);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-content h2 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .header-content span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .search-wrapper {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      position: relative;
    }

    .search-wrapper svg {
      position: absolute;
      left: calc(var(--space-lg) + 8px);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
    }

    .search-input {
      width: 100%;
      padding: var(--space-sm) var(--space-sm) var(--space-sm) calc(var(--space-lg) + 36px);
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .search-input:focus {
      border-color: rgba(99, 102, 241, 0.3);
    }

    .contacts-list {
      flex: 1;
      overflow-y: auto;
      padding: var(--space-sm);
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
      background: rgba(99, 102, 241, 0.1);
    }

    .contact-item.unread {
      background: rgba(99, 102, 241, 0.05);
    }

    .contact-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
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
      background: #6366f1;
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
      color: var(--color-text-muted);
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
      background: linear-gradient(135deg, #6366f1, #4f46e5);
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

    .header-details h3 {
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
      gap: var(--space-sm);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      border-color: rgba(99, 102, 241, 0.3);
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
      color: var(--color-text-muted);
    }

    .no-messages svg {
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .no-messages p {
      font-size: var(--font-size-base);
      color: var(--color-text-muted);
      margin: var(--space-md) 0 var(--space-xs);
    }

    .no-messages span {
      font-size: var(--font-size-sm);
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
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: white;
      border-radius: var(--radius-md);
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
      background: linear-gradient(135deg, #6366f1, #4f46e5);
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
      color: #6366f1;
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

    .message-input {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .message-input:focus {
      border-color: rgba(99, 102, 241, 0.3);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon.btn-primary {
      width: 36px;
      height: 36px;
      padding: 0;
    }

    .no-chat-selected {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      color: var(--color-text-muted);
      padding: var(--space-2xl);
    }

    .no-chat-selected svg {
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
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
    :host-context(.dark) .chat-container {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .chat-sidebar,
    :host-context(.dark) .chat-main,
    :host-context(.dark) .chat-header {
      background: var(--color-surface);
    }

    :host-context(.dark) .message-bubble.from-them {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .search-input,
    :host-context(.dark) .message-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .search-input:focus,
    :host-context(.dark) .message-input:focus {
      border-color: rgba(99, 102, 241, 0.3);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class AdminChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  currentUserId: string = '';
  societeId: string = '';
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  messages: Message[] = [];
  selectedContact: Contact | null = null;
  newMessage = '';
  searchQuery = '';
  showNewGroupDialog = false;
  newGroupName = '';
  groupContacts: any[] = [];

  ngOnInit() {
    const u = this.api.getCurrentUser();
    this.currentUserId = u?.id || '';
    this.societeId = u?.societeId || '';
    this.loadContacts();
  }

  ngAfterViewChecked() { this.scrollToBottom(); }

  private scrollToBottom(): void {
    try { this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight; } catch(err) {}
  }

  loadContacts() {
    this.api.getUtilisateurs().subscribe(users => {
      this.contacts = users.filter(u => u.societeId === this.societeId && u.id !== this.currentUserId).map(u => ({
        id: u.id,
        nom: u.nom,
        avatar: u.nom.charAt(0),
        email: u.email,
        typeUtilisateurId: u.typeUtilisateurId,
        dernierMessage: '',
        time: '12:00',
        unread: 0
      }));
      this.filteredContacts = [...this.contacts];
    });
  }

  filterContacts() {
    this.filteredContacts = this.contacts.filter(c => c.nom.toLowerCase().includes(this.searchQuery.toLowerCase()));
  }

  selectContact(c: Contact) {
    this.selectedContact = c;
    this.loadMessages(c);
  }

  loadMessages(c: Contact) {
    const allMessages = JSON.parse(localStorage.getItem('admin_chat_messages') || '{}');
    const key = `conv_${c.id}_${this.societeId}`;
    const saved = allMessages[key];
    if (saved && saved.length > 0) {
      this.messages = saved;
    } else {
      this.messages = [];
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;
    this.messages.push({
      id: Date.now().toString(),
      text: this.newMessage,
      from: this.currentUserId,
      fromName: 'Me',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });
    
    this.saveMessages();
    
    this.selectedContact.dernierMessage = this.newMessage;
    this.selectedContact.time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.newMessage = '';
  }

  saveMessages() {
    if (!this.selectedContact) return;
    const allMessages = JSON.parse(localStorage.getItem('admin_chat_messages') || '{}');
    const key = `conv_${this.selectedContact.id}_${this.societeId}`;
    allMessages[key] = this.messages;
    localStorage.setItem('admin_chat_messages', JSON.stringify(allMessages));
  }

  onFileSelected(e: any) { this.snackBar.open('Uploading transmission packets...', 'Fermer', { duration: 3000 }); }

  openNewGroupDialog() {
    this.newGroupName = '';
    this.groupContacts = this.contacts.filter(c => !c.isGroup).map(c => ({ ...c, selected: false }));
    this.showNewGroupDialog = true;
  }

  createGroup() {
    if (!this.newGroupName.trim()) return;
    const selectedUsers = this.groupContacts.filter(c => c.selected);
    if (selectedUsers.length === 0) {
      this.snackBar.open('Sélectionnez au moins un participant', 'Fermer', { duration: 3000 });
      return;
    }
    
    const newGroup: Contact = {
      id: 'group_' + Date.now(),
      nom: this.newGroupName,
      avatar: this.newGroupName.charAt(0).toUpperCase(),
      email: '',
      typeUtilisateurId: 'GROUP',
      dernierMessage: 'Groupe créé',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      isGroup: true
    };

    this.contacts.unshift(newGroup);
    this.filterContacts();
    this.showNewGroupDialog = false;
    this.selectContact(newGroup);
    this.snackBar.open('Groupe créé avec succès', 'Fermer', { duration: 3000 });
  }
}
