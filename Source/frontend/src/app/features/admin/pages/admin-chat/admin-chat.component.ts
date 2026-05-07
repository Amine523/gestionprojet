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
  timestamp?: string;
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
  timestamp: string;
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
          @if (canCreateGroup) {
            <button class="btn-icon" (click)="openNewGroupDialog()" title="Nouveau groupe">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </button>
          }
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
              <button class="btn-icon" (click)="showInfo()" title="Infos">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Messages Area -->
          <div class="messages-area" #scrollContainer>
            @for (msg of messages; track msg.id) {
              <div class="message-wrapper" [class.from-me]="msg.from == currentUserId" [class.from-them]="msg.from != currentUserId">
                @if (msg.from != currentUserId) {
                  <div class="message-avatar">{{(msg.fromName || '').charAt(0) || 'A'}}</div>
                }
                <div class="message-bubble" [class.from-me]="msg.from == currentUserId" [class.from-them]="msg.from != currentUserId">
                  @if (selectedContact.isGroup && msg.from !== currentUserId) {
                    <span class="message-sender">{{msg.fromName}}</span>
                  }
                  <p class="message-text">{{msg.text}}</p>
                  
                  @if (msg.attachments && msg.attachments.length > 0) {
                    <div class="message-attachments">
                      @for (att of msg.attachments; track att.name) {
                        <div class="attachment-item" (click)="downloadAttachment(att)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                            <polyline points="13 2 13 9 20 9"/>
                          </svg>
                          <span class="attachment-name">{{att.name}}</span>
                          <svg class="download-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                            <polyline points="7 10 12 15 17 10"/>
                            <line x1="12" y1="15" x2="12" y2="3"/>
                          </svg>
                        </div>
                      }
                    </div>
                  }

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

    @if (showNewGroupDialog) {
      <div class="dialog-overlay" (click)="showNewGroupDialog = false">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h3>Nouveau groupe</h3>
            <button class="btn-icon" (click)="showNewGroupDialog = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label>Nom du groupe</label>
              <input [(ngModel)]="newGroupName" class="message-input" placeholder="Nom du groupe...">
            </div>
            <p class="members-label">Sélectionnez les membres :</p>
            <div class="members-list">
              @for (c of groupContacts; track c.id) {
                <div class="member-item" [class.selected]="c.selected" (click)="c.selected = !c.selected">
                   <div class="checkbox" [class.checked]="c.selected">
                     @if (c.selected) {
                       <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                     }
                   </div>
                   <span>{{c.nom}}</span>
                </div>
              }
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn" (click)="showNewGroupDialog = false">Annuler</button>
            <button class="btn btn-primary" [disabled]="!newGroupName || selectedMembersCount === 0" (click)="createGroup()">Créer le groupe</button>
          </div>
        </div>
      </div>
    }
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

    /* Dialog Styles */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .dialog-content {
      background: white;
      border-radius: var(--radius-xl);
      width: 100%;
      max-width: 450px;
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
    }

    .dialog-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-bg);
    }

    .dialog-body {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .members-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .members-list {
      max-height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      padding: var(--space-xs);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .member-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .member-item:hover {
      background: white;
    }

    .member-item.selected {
      background: rgba(99, 102, 241, 0.1);
    }

    .checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid var(--color-border);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-base);
      flex-shrink: 0;
    }

    .checkbox.checked {
      background: #6366f1;
      border-color: #6366f1;
      color: white;
    }

    .dialog-footer {
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      background: var(--color-bg);
    }

    /* Dark mode for Dialog */
    :host-context(.dark) .dialog-content {
      background: var(--color-surface);
      border: 1px solid var(--color-border);
    }
    :host-context(.dark) .dialog-header,
    :host-context(.dark) .dialog-footer,
    :host-context(.dark) .members-list {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }
    :host-context(.dark) .member-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }
    :host-context(.dark) .checkbox {
      border-color: var(--color-border);
    }

    .message-attachments {
      margin-top: var(--space-sm);
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm);
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .message-bubble.from-them .attachment-item {
      background: var(--color-bg);
      border-color: var(--color-border);
    }

    .attachment-item:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .message-bubble.from-them .attachment-item:hover {
      background: var(--color-surface);
    }

    .attachment-name {
      font-size: var(--font-size-xs);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      flex: 1;
    }

    .download-icon {
      opacity: 0.7;
    }
  `]
})
export class AdminChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  currentUserId: string = '';
  currentUserRole: string = '';
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

  isMemberSelected = (c: any) => c.selected;

  get selectedMembersCount(): number {
    return this.groupContacts.filter(c => c.selected).length;
  }

  get canCreateGroup(): boolean {
    const allowed = ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'];
    return allowed.includes(this.currentUserRole);
  }

  ngOnInit() {
    const u = this.api.getCurrentUser();
    this.currentUserId = u?.id || '';
    this.currentUserRole = u?.typeUtilisateurId || '';
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
        time: '',
        timestamp: '',
        unread: 0
      }));

      // Charger le dernier message de chaque contact pour affichage et tri
      let pending = this.contacts.length;
      if (pending === 0) {
        this.filteredContacts = [];
        return;
      }
      this.contacts.forEach(contact => {
        const roomId = this.getRoomId(this.currentUserId, contact.id);
        this.api.getChatMessages(roomId).subscribe({
          next: (data) => {
            if (data && data.length > 0) {
              const last = data[data.length - 1];
              contact.dernierMessage = last.text || '';
              contact.time = last.time || '';
              contact.timestamp = last.timestamp || last.createdAt || last.date || '';
            }
            pending--;
            if (pending === 0) {
              this.sortContacts();
              this.filterContacts();
            }
          },
          error: () => {
            pending--;
            if (pending === 0) {
              this.sortContacts();
              this.filterContacts();
            }
          }
        });
      });
    });
  }

  private sortContacts() {
    this.contacts.sort((a, b) => {
      // Priorité au timestamp ISO complet (multi-jours)
      const tsA = a.timestamp || '';
      const tsB = b.timestamp || '';
      if (tsA && tsB) return tsB.localeCompare(tsA);
      if (tsA && !tsB) return -1;
      if (!tsA && tsB) return 1;
      // Fallback : comparer par heure HH:MM
      if (!a.time && !b.time) return 0;
      if (!a.time) return 1;
      if (!b.time) return -1;
      return b.time.localeCompare(a.time);
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
    const roomId = this.getRoomId(this.currentUserId, c.id);
    this.api.getChatMessages(roomId).subscribe({
      next: (data) => {
        this.messages = (data || []).map((m: any) => ({
          id: m.id,
          text: m.text,
          from: m.from,
          fromName: m.fromName,
          time: m.time,
          attachments: m.attachments
        }));
      },
      error: () => {
        this.messages = [];
      }
    });
  }

  private getRoomId(id1: string, id2: string): string {
    const ids = [id1, id2].sort();
    return `room_${ids[0]}_${ids[1]}`;
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedContact) return;
    
    const roomId = this.getRoomId(this.currentUserId, this.selectedContact.id);
    const now = new Date();
    const isoTimestamp = now.toISOString();
    const msg: Message = {
      id: Date.now().toString(),
      text: this.newMessage,
      from: this.currentUserId,
      fromName: 'Me',
      time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: isoTimestamp
    };

    const payload = { ...msg, chatRoomId: roomId, timestamp: isoTimestamp };

    this.api.sendChatMessage(payload).subscribe({
      next: () => {
        this.messages.push(msg);
        if (this.selectedContact) {
          this.selectedContact.dernierMessage = this.newMessage;
          this.selectedContact.time = msg.time;
          this.selectedContact.timestamp = isoTimestamp;
        }
        this.newMessage = '';
        // Re-trier les contacts après envoi
        this.sortContacts();
        this.filterContacts();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi du message', 'Fermer', { duration: 3000 });
      }
    });
  }

  saveMessages() {
    if (!this.selectedContact) return;
    const allMessages = JSON.parse(localStorage.getItem('admin_chat_messages') || '{}');
    const key = `conv_${this.selectedContact.id}_${this.societeId}`;
    allMessages[key] = this.messages;
    localStorage.setItem('admin_chat_messages', JSON.stringify(allMessages));
  }

  showInfo() {
    this.snackBar.open('Détails du contact : ' + this.selectedContact?.nom, 'Fermer', { duration: 3000 });
  }

  onFileSelected(e: any) {
    const files: FileList = e.target.files;
    if (!files || files.length === 0 || !this.selectedContact) return;

    this.snackBar.open('Téléchargement en cours...', 'Fermer', { duration: 2000 });
    const roomId = this.getRoomId(this.currentUserId, this.selectedContact.id);

    Array.from(files).forEach(file => {
      this.api.uploadFile(file, roomId, 'ChatAttachment').subscribe({
        next: (res: any) => {
          const now = new Date();
          const isoTimestamp = now.toISOString();
          const msg: Message = {
            id: Date.now().toString(),
            text: `Document envoyé : ${file.name}`,
            from: this.currentUserId,
            fromName: 'Me',
            time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
            timestamp: isoTimestamp,
            attachments: [{ name: file.name, type: file.type, url: res.url }]
          };

          const payload = { ...msg, chatRoomId: roomId, timestamp: isoTimestamp };

          this.api.sendChatMessage(payload).subscribe({
            next: () => {
              this.messages.push(msg);
              this.messages = [...this.messages];
              if (this.selectedContact) {
                this.selectedContact.dernierMessage = msg.text;
                this.selectedContact.time = msg.time;
                this.selectedContact.timestamp = isoTimestamp;
              }
              this.sortContacts();
              this.filterContacts();
              this.scrollToBottom();
              this.snackBar.open('Document envoyé avec succès', 'Fermer', { duration: 2000 });
            },
            error: () => {
              this.snackBar.open('Erreur lors de l\'enregistrement du message', 'Fermer', { duration: 3000 });
            }
          });
        },
        error: () => {
          this.snackBar.open('Erreur lors du téléchargement de ' + file.name, 'Fermer', { duration: 3000 });
        }
      });
    });
    // Reset file input
    e.target.value = '';
  }

  downloadAttachment(att: { name: string; url: string }) {
    const link = document.createElement('a');
    link.href = att.url;
    link.download = att.name;
    link.target = '_blank';
    link.click();
  }

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
    
    const now = new Date();
    const newGroup: Contact = {
      id: 'group_' + Date.now(),
      nom: this.newGroupName,
      avatar: this.newGroupName.charAt(0).toUpperCase(),
      email: '',
      typeUtilisateurId: 'GROUP',
      dernierMessage: 'Groupe créé',
      time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      timestamp: now.toISOString(),
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
