import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatListModule, MatBadgeModule, MatMenuModule, MatTooltipModule, MatChipsModule, MatSnackBarModule],
  template: `

    <div class="chat-layout">
      <!-- Sidebar -->
      <aside class="chat-sidebar">
        <div class="sidebar-header">
          <div class="header-content">
            <h2 class="header-title">Messages</h2>
            <span class="header-subtitle">{{conversations.length}} conversation(s)</span>
          </div>
          <button class="btn-icon btn-ghost" (click)="showNewGroupDialog = true" title="Nouveau groupe">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="22" y1="11" x2="16" y2="11"/>
            </svg>
          </button>
        </div>

        <div class="search-container">
          <div class="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" stroke-width="2" stroke-linecap="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" 
              class="input-base pl-10 bg-gray-50 dark:bg-gray-800/50 border-transparent"
              placeholder="Rechercher...">
          </div>
        </div>

        <div class="tabs">
          <button [class.active]="activeTab === 'recent'" (click)="activeTab = 'recent'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Récents</span>
          </button>
          <button [class.active]="activeTab === 'contacts'" (click)="activeTab = 'contacts'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>Contacts</span>
          </button>
          <button [class.active]="activeTab === 'groups'" (click)="activeTab = 'groups'">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>Groupes</span>
          </button>
        </div>

        <div class="contacts-list">
          @if (activeTab === 'recent') {
            @if (conversations.length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-gray-300">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span>Aucune conversation récente</span>
              </div>
            } @else {
              @for (conv of conversations; track conv.id) {
                <div class="contact-item" 
                     [class.active]="selectedConversation?.id === conv.id"
                     [class.unread]="conv.unread > 0"
                     (click)="selectConversation(conv)">
                  <div class="contact-avatar" [class.online]="conv.online">
                    {{conv.initials}}
                    @if (conv.unread > 0) {
                      <span class="unread-badge">{{conv.unread}}</span>
                    }
                  </div>
                  <div class="contact-info">
                    <div class="contact-header">
                      <span class="contact-name">{{conv.nom}}</span>
                      <span class="contact-time">{{conv.heure}}</span>
                    </div>
                    <div class="contact-preview">
                      <span class="preview-text">{{conv.dernierMessage || 'Démarrer une conversation'}}</span>
                    </div>
                  </div>
                </div>
              }
            }
          }
          @if (activeTab === 'contacts') {
            @for (contact of contacts; track contact.id) {
              <div class="contact-item" [class.online]="contact.online" (click)="startChat(contact)">
                <div class="contact-avatar" [class.online]="contact.online">
                  {{contact.initials}}
                </div>
                <div class="contact-info">
                  <div class="contact-header">
                    <span class="contact-name">{{contact.nom}}</span>
                  </div>
                  <div class="contact-preview">
                    <span class="badge badge-gray">{{contact.role}}</span>
                  </div>
                </div>
              </div>
            }
          }
          @if (activeTab === 'groups') {
            @for (group of groups; track group.id) {
              <div class="contact-item" [class.active]="selectedConversation?.id === group.id" (click)="selectConversation(group)">
                <div class="contact-avatar group-avatar">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="contact-info">
                  <div class="contact-header">
                    <span class="contact-name">{{group.nom}}</span>
                  </div>
                  <div class="contact-preview">
                    <span class="preview-text">{{getMembersCount(group)}} membres</span>
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
              <div class="header-avatar" [class.online]="selectedConversation.online">
                {{selectedConversation.initials}}
              </div>
              <div class="header-details">
                <h3 class="header-name">{{selectedConversation.nom}}</h3>
                <span class="header-status">
                  <span class="status-dot"></span>
                  {{selectedConversation.online ? 'En ligne' : selectedConversation.derniereActivite}}
                </span>
              </div>
            </div>
            <div class="header-actions">
              <button class="btn-icon btn-ghost" title="Appeler">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
              </button>
              <button class="btn-icon btn-ghost" title="Vidéo">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m23 7-7 5 7 5V7Z"/>
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </button>
              <button class="btn-icon btn-ghost" (click)="showInfo()" title="Infos">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </button>
            </div>
          </header>

          <!-- Messages Area -->
          <div class="messages-area" #messagesZone>
            <div class="date-divider"><span>Aujourd'hui</span></div>
            @for (msg of messages; track msg.id) {
              <div class="message-wrapper" [class.from-me]="msg.mien" [class.from-them]="!msg.mien">
                @if (!msg.mien) {
                  <div class="message-avatar">{{msg.auteurInitials}}</div>
                }
                <div class="message-bubble" [class.from-me]="msg.mien" [class.from-them]="!msg.mien">
                  @if (!msg.mien) {
                    <span class="message-sender">{{msg.auteur}}</span>
                  }
                  <p class="message-text">{{msg.texte}}</p>
                  <div class="message-meta">
                    <span class="message-time">{{msg.heure}}</span>
                    @if (msg.mien) {
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.read]="msg.lu">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    }
                  </div>
                </div>
              </div>
            }
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <button class="btn-icon btn-ghost" title="Pièce jointe">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
              </svg>
            </button>
            <button class="btn-icon btn-ghost" title="Emoji">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
                <line x1="9" y1="9" x2="9.01" y2="9"/>
                <line x1="15" y1="9" x2="15.01" y2="9"/>
              </svg>
            </button>
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
            <h3>Bienvenue</h3>
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        }
      </main>

      <!-- Info Panel -->
      @if (showConversationInfo) {
        <aside class="info-panel">
          <div class="info-header">
            <h3>Détails</h3>
            <button class="btn-icon btn-ghost" (click)="showConversationInfo = false">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="info-content">
            <div class="info-avatar-section">
              <div class="info-avatar">{{selectedConversation?.initials}}</div>
              <h4>{{selectedConversation?.nom}}</h4>
              <span class="info-status">{{selectedConversation?.online ? 'En ligne' : 'Hors ligne'}}</span>
            </div>
            <div class="info-section">
              <h5>À propos</h5>
              <p>{{selectedConversation?.about || 'Disponible'}}</p>
            </div>
            <div class="info-section">
              <h5>Membres</h5>
              <p>{{getMembersCount(selectedConversation)}} membre(s)</p>
            </div>
            @if (selectedConversation?.createurId && selectedConversation.createurId !== currentUser?.id) {
              <div class="info-section">
                <button class="btn btn-danger btn-sm" (click)="quitGroup()">
                  Quitter le groupe
                </button>
              </div>
            }
          </div>
        </aside>
      }
    </div>
    
    @if (showNewGroupDialog) {
      <div class="dialog-overlay" (click)="cancelCreateGroup()">
        <div class="dialog-content" (click)="$event.stopPropagation()">
          <div class="dialog-header">
            <h3>Nouveau groupe</h3>
            <button class="btn-icon btn-ghost" (click)="cancelCreateGroup()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="dialog-body">
            <div class="form-group">
              <label class="label-base">Nom du groupe</label>
              <input [(ngModel)]="newGroupName" class="input-base" placeholder="Nom du groupe...">
            </div>
            <p class="members-label">Sélectionnez les membres (minimum 2):</p>
            <div class="members-list">
              @for (contact of contacts; track contact.id) {
                <div class="member-item" [class.selected]="selectedMembers.includes(contact)" (click)="toggleMember(contact)">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.text-brand-500]="selectedMembers.includes(contact)">
                    @if (selectedMembers.includes(contact)) {
                      <rect x="3" y="3" width="18" height="18" rx="2" fill="currentColor"/>
                    } @else {
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                    }
                  </svg>
                  <span class="member-name">{{contact.nom}}</span>
                  <span class="badge badge-gray">{{contact.role}}</span>
                </div>
              }
            </div>
          </div>
          <div class="dialog-footer">
            <button class="btn btn-secondary" (click)="cancelCreateGroup()">Annuler</button>
            <button class="btn btn-primary" [disabled]="!newGroupName || selectedMembers.length < 2" (click)="createGroup()">Créer</button>
          </div>
        </div>
      </div>
    }
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

    /* Sidebar */
    .chat-sidebar {
      width: 340px;
      display: flex;
      flex-direction: column;
      background: white;
      border-right: 1px solid var(--color-border);
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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

    .tabs {
      display: flex;
      padding: var(--space-sm) var(--space-md);
      gap: var(--space-xs);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .tabs button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      background: transparent;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .tabs button:hover {
      background: var(--color-border);
    }

    .tabs button.active {
      background: var(--color-primary);
      color: white;
      box-shadow: var(--shadow-sm);
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
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
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

    .contact-avatar.online::after {
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }

    .contact-avatar.group-avatar {
      background: var(--color-text-muted);
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

    /* Chat Main */
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
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      position: relative;
    }

    .header-avatar.online::after {
      content: '';
      position: absolute;
      bottom: -2px;
      right: -2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
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

    /* Messages Area */
    .messages-area {
      flex: 1;
      padding: var(--space-lg);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      background: var(--color-bg);
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

    .message-text {
      margin: 0;
      font-size: var(--font-size-sm);
      line-height: var(--line-height-normal);
    }

    .message-meta {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--space-xs);
      margin-top: var(--space-xs);
    }

    .message-time {
      font-size: 10px;
      opacity: 0.7;
    }

    .message-meta svg {
      opacity: 0.5;
    }

    .message-meta svg.read {
      opacity: 1;
      color: #3b82f6;
    }

    /* Input Area */
    .input-area {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      background: white;
      border-top: 1px solid var(--color-border);
    }

    /* No Chat Selected */
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

    /* Info Panel */
    .info-panel {
      width: 300px;
      border-left: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      background: white;
    }

    .info-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .info-header h3 {
      margin: 0;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-base);
    }

    .info-content {
      padding: var(--space-lg);
    }

    .info-avatar-section {
      text-align: center;
      margin-bottom: var(--space-xl);
    }

    .info-avatar {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, var(--color-primary), var(--color-primary-dark));
      color: white;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      margin: 0 auto var(--space-md);
    }

    .info-avatar-section h4 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .info-status {
      font-size: var(--font-size-sm);
      color: #10b981;
      font-weight: var(--font-weight-medium);
    }

    .info-section {
      margin-bottom: var(--space-lg);
    }

    .info-section h5 {
      margin: 0 0 var(--space-sm);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: var(--font-weight-semibold);
    }

    .info-section p {
      margin: 0;
      font-size: var(--font-size-sm);
    }

    /* Dialog */
    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .dialog-content {
      background: white;
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 500px;
      max-height: 80vh;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .dialog-header h3 {
      margin: 0;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-lg);
    }

    .dialog-body {
      padding: var(--space-lg);
      overflow-y: auto;
      max-height: 400px;
    }

    .form-group {
      margin-bottom: var(--space-lg);
    }

    .label-base {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text);
      margin-bottom: var(--space-sm);
    }

    .members-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .members-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .member-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .member-item:hover {
      border-color: var(--color-primary);
    }

    .member-item.selected {
      background: var(--color-primary-light);
      border-color: var(--color-primary);
    }

    .member-name {
      flex: 1;
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-sm);
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    /* Dark mode */
    :host-context(.dark) .chat-layout {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .chat-sidebar,
    :host-context(.dark) .chat-main,
    :host-context(.dark) .info-panel {
      background: var(--color-surface);
    }

    :host-context(.dark) .message-bubble.from-them {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .dialog-content {
      background: var(--color-surface);
    }
  `]
})
export class ChatComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  conversations = [
    { id: 1, nom: 'Équipe Mobile', initials: 'EM', dernierMessage: 'Le projet avance bien 👍', heure: '17:30', unread: 3, online: true, about: 'Équipe desenvolvimento app mobile', membres: 5 },
    { id: 2, nom: 'Ahmed Ben Ali', initials: 'AB', dernierMessage: 'Merci pour le code', heure: '16:45', unread: 0, online: true, about: 'Développeur Senior', membres: 1 },
    { id: 3, nom: 'Sofia Karoui', initials: 'SK', dernierMessage: 'Les designs sont prêts', heure: '14:20', unread: 1, online: false, derniereActivite: 'Il y a 2h', about: 'Designer UI/UX', membres: 1 },
    { id: 4, nom: 'API REST Team', initials: 'AR', dernierMessage: 'Réunion demain à 10h', heure: '11:00', unread: 0, online: true, about: 'Gestion API backend', membres: 3, isGroup: true }
  ];
  
  [key: string]: any;
  
  societeId = '';
  currentUser: any = null;
  societeNom = '';
  
  contacts: any[] = [];
  
  groups: any[] = [];
  
  messages = [
    { id: 1, auteur: 'Ahmed Ben Ali', auteurInitials: 'AB', texte: 'Salut! Comment ça va?', heure: '17:25', mien: false },
    { id: 2, auteur: 'Moi', auteurInitials: 'CP', texte: 'Ça va bien! Tu as vu les последiers commits?', heure: '17:26', mien: true, lu: true },
    { id: 3, auteur: 'Ahmed Ben Ali', auteurInitials: 'AB', texte: 'Oui, tout a l\'air bon. Le module d\'auth fonctionne parfaitement.', heure: '17:28', mien: false },
    { id: 4, auteur: 'Moi', auteurInitials: 'CP', texte: 'Parfait! On fait la démo demain?', heure: '17:29', mien: true, lu: true },
    { id: 5, auteur: 'Ahmed Ben Ali', auteurInitials: 'AB', texte: 'Le projet avance bien 👍', heure: '17:30', mien: false }
  ];
  
  selectedConversation: any = null;
  showConversationInfo = false;
  activeTab = 'recent';
  newMessage = '';
  searchQuery = '';
  showNewGroupDialog = false;
  newGroupName = '';
  selectedMembers: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.currentUser = user;
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadContacts();
    if (this.conversations.length > 0) {
      this.selectedConversation = this.conversations[0];
    }
    this.loadGroups();
  }
  
  loadContacts() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.contacts = employes.map((e: any, idx: number) => ({
          id: e.id || idx + 1,
          nom: e.nom,
          initials: e.nom?.charAt(0) || 'E',
          role: e.typeUtilisateurId || 'Employé',
          online: Math.random() > 0.5
        }));
        this.loadConversations();
        this.loadGroups();
      },
      error: () => {}
    });
  }
  
  loadGroups() {
    const currentUser = this.api.getCurrentUser();
    const userId = currentUser?.id;
    const chatData = JSON.parse(localStorage.getItem('app_chat_groups') || '{}');
    const allGroups: any[] = chatData[this.societeId] || [];
    this.groups = allGroups.filter((g: any) => g.membres?.includes(userId) || g.creePar === userId);
  }
  
  loadConversations() {
    const chatData = JSON.parse(localStorage.getItem('chat_data') || '{}');
    const userChats: any[] = chatData[this.societeId] || [];
    if (userChats.length > 0) {
      this.conversations = userChats;
    } else {
      this.conversations = this.contacts.slice(0, 4).map((c: any, idx: number) => ({
        id: c.id,
        nom: c.nom,
        initials: c.initials,
        dernierMessage: this.getRandomMessage(),
        heure: this.getRandomTime(),
        unread: Math.floor(Math.random() * 3),
        online: c.online,
        about: c.role,
        membres: 1
      }));
    }
  }
  
  getRandomMessage(): string {
    const msgs = ['Bonjour', 'Comment ça va?', 'Le projet avance bien', 'Réunion à 10h', 'Merci!', 'Daccord', 'Bien reçu'];
    return msgs[Math.floor(Math.random() * msgs.length)];
  }
  
  getRandomTime(): string {
    const h = Math.floor(Math.random() * 12) + 8;
    const m = Math.floor(Math.random() * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }

  getMembersCount(group: any): number {
    if (Array.isArray(group.membres)) return group.membres.length;
    return group.membres || 0;
  }

  quitGroup() {
    if (!this.selectedConversation) return;
    if (confirm('Voulez-vous quitter ce groupe?')) {
      this.groups = this.groups.filter((g: any) => g.id !== this.selectedConversation.id);
      const chatData = JSON.parse(localStorage.getItem('chat_groups') || '{}');
      chatData[this.societeId] = this.groups;
      localStorage.setItem('chat_groups', JSON.stringify(chatData));
      this.selectedConversation = null;
      this.snackBar.open('Vous avez quitté le groupe', 'Fermer', { duration: 2000 });
    }
  }
  
  saveConversations() {
    const chatData = JSON.parse(localStorage.getItem('chat_data') || '{}');
    chatData[this.societeId] = this.conversations;
    localStorage.setItem('chat_data', JSON.stringify(chatData));
  }

  selectConversation(conv: any) {
    this.selectedConversation = conv;
    conv.unread = 0;
    this.loadMessages(conv);
  }
  
  loadMessages(conv: any) {
    const allMessages = JSON.parse(localStorage.getItem('chat_messages') || '{}');
    const key = `conv_${conv.id}_${this.societeId}`;
    const saved = allMessages[key];
    if (saved && saved.length > 0) {
      this.messages = saved;
    } else {
      this.messages = [
        { id: 1, auteur: conv.nom, auteurInitials: conv.initials, texte: 'Salut!', heure: '09:00', mien: false },
        { id: 2, auteur: 'Moi', auteurInitials: 'CP', texte: 'Bonjour', heure: '09:05', mien: true, lu: true }
      ];
    }
  }

  startChat(contact: any) {
    const existing = this.conversations.find(c => c.nom === contact.nom);
    if (existing) {
      this.selectConversation(existing);
    } else {
      this.conversations.unshift({
        id: Date.now(),
        nom: contact.nom,
        initials: contact.initials,
        dernierMessage: '',
        heure: '',
        unread: 0,
        online: contact.online,
        about: contact.role,
        membres: 1
      });
      this.selectConversation(this.conversations[0]);
    }
    this.activeTab = 'recent';
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedConversation) return;
    this.messages.push({
      id: Date.now(),
      auteur: 'Moi',
      auteurInitials: 'CP',
      texte: this.newMessage,
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      mien: true,
      lu: true
    });
    this.selectedConversation.dernierMessage = this.newMessage;
    this.selectedConversation.heure = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const convIdx = this.conversations.findIndex(c => c.id === this.selectedConversation.id);
    if (convIdx >= 0) {
      this.conversations[convIdx] = this.selectedConversation;
    }
    this.saveConversations();
    this.saveMessages();
    this.newMessage = '';
  }
  
  saveMessages() {
    if (!this.selectedConversation) return;
    const allMessages = JSON.parse(localStorage.getItem('chat_messages') || '{}');
    const key = `conv_${this.selectedConversation.id}_${this.societeId}`;
    allMessages[key] = this.messages;
    localStorage.setItem('chat_messages', JSON.stringify(allMessages));
  }
  
  toggleMember(member: any) {
    const idx = this.selectedMembers.findIndex(m => m.id === member.id);
    if (idx >= 0) {
      this.selectedMembers.splice(idx, 1);
    } else {
      this.selectedMembers.push(member);
    }
  }
  
  createGroup() {
    if (!this.newGroupName || this.selectedMembers.length < 2) return;
    const newGroup = {
      id: Date.now(),
      nom: this.newGroupName,
      membres: this.selectedMembers.length,
      memberNames: this.selectedMembers.map((m: any) => m.nom)
    };
    this.groups.unshift(newGroup);
    this.saveGroups();
    this.conversations.unshift({
      id: newGroup.id,
      nom: this.newGroupName,
      initials: this.newGroupName.charAt(0),
      dernierMessage: 'Groupe créé',
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      online: true,
      about: this.selectedMembers.length + ' membres',
      membres: this.selectedMembers.length,
      isGroup: true
    });
    this.saveConversations();
    this.showNewGroupDialog = false;
    this.newGroupName = '';
    this.selectedMembers = [];
    this.activeTab = 'recent';
  }
  
  saveGroups() {
    const currentUser = this.api.getCurrentUser();
    const chatData = JSON.parse(localStorage.getItem('app_chat_groups') || '{}');
    if (!chatData[this.societeId]) chatData[this.societeId] = [];
    chatData[this.societeId] = this.groups;
    localStorage.setItem('app_chat_groups', JSON.stringify(chatData));
  }
  
  cancelCreateGroup() {
    this.showNewGroupDialog = false;
    this.newGroupName = '';
    this.selectedMembers = [];
  }
  
  showInfo() {
    this.showConversationInfo = !this.showConversationInfo;
  }
}

