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
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatListModule, MatBadgeModule, MatMenuModule, MatTooltipModule, MatChipsModule, MatSnackBarModule],
  template: `
    <div class="chat-container">
      <mat-card class="chat-sidebar">
        <div class="sidebar-header">
          <h3>Messages</h3>
          <button mat-icon-button [matMenuTriggerFor]="menu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="showNewGroupDialog = true"><mat-icon>group_add</mat-icon>Nouveau groupe</button>
            <button mat-menu-item><mat-icon>search</mat-icon>Rechercher</button>
            <button mat-menu-item><mat-icon>settings</mat-icon>Paramètres</button>
          </mat-menu>
        </div>
        
        <div class="search-box">
          <mat-form-field appearance="outline" class="search-field">
            <mat-icon matPrefix>search</mat-icon>
            <input matInput placeholder="Rechercher..." [(ngModel)]="searchQuery">
          </mat-form-field>
        </div>

        <div class="tabs">
          <button [class.active]="activeTab === 'recent'" (click)="activeTab = 'recent'">
            <mat-icon>chat</mat-icon>
            <span>Récents</span>
          </button>
          <button [class.active]="activeTab === 'contacts'" (click)="activeTab = 'contacts'">
            <mat-icon>person</mat-icon>
            <span>Contacts</span>
          </button>
          <button [class.active]="activeTab === 'groups'" (click)="activeTab = 'groups'">
            <mat-icon>group</mat-icon>
            <span>Groupes</span>
          </button>
        </div>

        <mat-nav-list class="contacts-list">
          @if (activeTab === 'recent') {
            @if (conversations.length === 0) {
              <div class="empty-list">
                <mat-icon>forum</mat-icon>
                <span>Aucune conversation récente</span>
              </div>
            } @else {
              <div class="section-label">Récents</div>
              @for (conv of conversations; track conv.id) {
                <a mat-list-item (click)="selectConversation(conv)" [class.active]="selectedConversation?.id === conv.id" [class.unread]="conv.unread > 0">
                  <div matListItemIcon class="avatar" [class.online]="conv.online">
                    {{conv.initials}}
                    @if (conv.unread > 0) {
                      <span class="badge">{{conv.unread}}</span>
                    }
                  </div>
                  <div matLine class="conv-info">
                    <span class="conv-name">{{conv.nom}}</span>
                  </div>
                </a>
              }
            }
          }
          @if (activeTab === 'contacts') {
            <div class="section-label">Contacts</div>
            @for (contact of contacts; track contact.id) {
              <a mat-list-item (click)="startChat(contact)" [class.online]="contact.online">
                <div matListItemIcon class="avatar" [class.online]="contact.online">
                  {{contact.initials}}
                </div>
                <div matLine>
                  <span class="contact-name">{{contact.nom}}</span>
                  <mat-chip class="role-chip">{{contact.role}}</mat-chip>
                </div>
              </a>
            }
          }
          @if (activeTab === 'groups') {
            <div class="section-label">Groupes</div>
            @for (group of groups; track group.id) {
              <a mat-list-item (click)="selectConversation(group)" [class.active]="selectedConversation?.id === group.id">
                <mat-icon matListItemIcon>group</mat-icon>
                <div matLine>
                  <span class="contact-name">{{group.nom}}</span>
                  <span class="members-count">{{getMembersCount(group)}} membres</span>
                </div>
              </a>
            }
          }
        </mat-nav-list>
      </mat-card>

      <mat-card class="chat-main">
        @if (selectedConversation) {
          <div class="chat-header">
            <div class="header-info">
              <div class="avatar large" [class.online]="selectedConversation.online">
                {{selectedConversation.initials}}
              </div>
              <div class="header-details">
                <span class="header-name">{{selectedConversation.nom}}</span>
                <span class="header-status">{{selectedConversation.online ? 'En ligne' : selectedConversation.derniereActivite}}</span>
              </div>
            </div>
            <div class="header-actions">
              <button mat-icon-button matTooltip="Appeler"><mat-icon>call</mat-icon></button>
              <button mat-icon-button matTooltip="Vidéo"><mat-icon>videocam</mat-icon></button>
              <button mat-icon-button matTooltip="Infos" (click)="showInfo()"><mat-icon>info</mat-icon></button>
              <button mat-icon-button [matMenuTriggerFor]="chatMenu">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #chatMenu="matMenu">
                <button mat-menu-item><mat-icon>search</mat-icon>Rechercher</button>
                <button mat-menu-item><mat-icon>notifications_off</mat-icon>Masquer</button>
                <button mat-menu-item><mat-icon>delete</mat-icon>Supprimer</button>
              </mat-menu>
            </div>
          </div>

          <div class="messages-zone" #messagesZone>
            <div class="date-divider"><span>Aujourd'hui</span></div>
            @for (msg of messages; track msg.id) {
              <div class="message" [class.my-message]="msg.mien" [class.their-message]="!msg.mien">
                @if (!msg.mien) {
                  <div class="avatar small">{{msg.auteurInitials}}</div>
                }
                <div class="message-content">
                  @if (!msg.mien) {
                    <span class="sender-name">{{msg.auteur}}</span>
                  }
                  <p>{{msg.texte}}</p>
                  <span class="message-time">{{msg.heure}}</span>
                  @if (msg.mien) {
                    <mat-icon class="read-icon" [class.read]="msg.lu">done_all</mat-icon>
                  }
                </div>
              </div>
            }
          </div>

          <div class="input-zone">
            <button mat-icon-button matTooltip="Pièce jointe">
              <mat-icon>attach_file</mat-icon>
            </button>
            <button mat-icon-button matTooltip="Emoji">
              <mat-icon>sentiment_satisfied</mat-icon>
            </button>
            <mat-form-field appearance="outline" class="message-input">
              <input matInput placeholder="Tapez votre message..." [(ngModel)]="newMessage" (keyup.enter)="sendMessage()">
            </mat-form-field>
            <button mat-fab class="send-btn" (click)="sendMessage()" [disabled]="!newMessage.trim()">
              <mat-icon>send</mat-icon>
            </button>
          </div>
        } @else {
          <div class="no-chat-selected">
            <mat-icon>forum</mat-icon>
            <h3>Bienvenue</h3>
            <p>Sélectionnez une conversation pour commencer à discuter</p>
          </div>
        }
      </mat-card>

      @if (showConversationInfo) {
        <mat-card class="info-panel">
          <div class="info-header">
            <h3>Détails</h3>
            <button mat-icon-button (click)="showConversationInfo = false">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="info-content">
            <div class="avatar-info">
              <div class="avatar large">{{selectedConversation?.initials}}</div>
              <h4>{{selectedConversation?.nom}}</h4>
              <span>{{selectedConversation?.online ? 'En ligne' : 'Hors ligne'}}</span>
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
                <button mat-stroked-button color="warn" (click)="quitGroup()">
                  <mat-icon>exit_to_app</mat-icon> Quitter le groupe
                </button>
              </div>
            }
          </div>
        </mat-card>
      }
    </div>
    
    @if (showNewGroupDialog) {
      <div class="dialog-overlay">
        <mat-card class="group-dialog">
          <div class="dialog-header">
            <h3>Nouveau groupe</h3>
            <button mat-icon-button (click)="cancelCreateGroup()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nom du groupe</mat-label>
            <input matInput [(ngModel)]="newGroupName" placeholder="Nom du groupe...">
          </mat-form-field>
          <p class="select-members-label">Sélectionnez les membres (minimum 2):</p>
          <div class="members-list">
            @for (contact of contacts; track contact.id) {
              <div class="member-item" [class.selected]="selectedMembers.includes(contact)" (click)="toggleMember(contact)">
                <mat-icon>{{selectedMembers.includes(contact) ? 'check_box' : 'check_box_outline_blank'}}</mat-icon>
                <span>{{contact.nom}}</span>
                <span class="member-role">{{contact.role}}</span>
              </div>
            }
          </div>
          <div class="dialog-actions">
            <button mat-stroked-button (click)="cancelCreateGroup()">Annuler</button>
            <button mat-flat-button color="primary" [disabled]="!newGroupName || selectedMembers.length < 2" (click)="createGroup()">Créer</button>
          </div>
        </mat-card>
      </div>
    }
  `,
  styles: [`
    .chat-container { display: flex; gap: 24px; height: calc(100vh - 180px); position: relative; }
    
    .chat-sidebar { width: 340px; padding: 0; border-radius: 20px; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #e2e8f0; }
    .sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 20px 16px; border-bottom: 1px solid #e2e8f0; }
    .sidebar-header h3 { margin: 0; color: #0f172a; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
    
    .search-box { padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
    .search-field { width: 100%; margin-bottom: 0; }
    .search-field input { font-size: 14px; }
    
    .empty-list { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; color: #94a3b8; text-align: center; }
    .empty-list mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.4; }
    .empty-list span { font-size: 14px; }
    
    .section-label { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; padding: 16px 16px 10px; margin-top: 4px; }
    .search-field .mat-mdc-form-field-icon-prefix { color: #94a3b8; }
    
    .tabs { display: flex; padding: 12px 16px; gap: 6px; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
    .tabs button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; padding: 12px; background: none; border: none; cursor: pointer; color: #64748b; font-weight: 600; border-radius: 12px; font-size: 13px; transition: all 0.2s ease; }
    .tabs button:hover { background: #e2e8f0; }
    .tabs button.active { background: #dc2626; color: white; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35); }
    .tabs button mat-icon { font-size: 20px; width: 20px; height: 20px; }
    
    .contacts-list { flex: 1; overflow-y: auto; padding: 10px; }
    .contacts-list a { border-radius: 14px; margin-bottom: 6px; height: 64px; transition: all 0.2s ease; }
    .contacts-list a:hover { background: #f1f5f9; }
    .contacts-list a.active { background: rgba(220, 38, 38, 0.08); }
    .contacts-list a.mat-mdc-list-item { padding: 0 12px; }
    .contacts-list a.unread .conv-name { font-weight: 700; }
    
    .avatar { width: 44px; height: 44px; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; position: relative; flex-shrink: 0; margin-right: 14px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
    .avatar.online::after { content: ''; position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; background: #10b981; border: 3px solid white; border-radius: 50%; }
    .avatar.large { width: 52px; height: 52px; font-size: 18px; margin-right: 0; border-radius: 16px; }
    .avatar.small { width: 36px; height: 36px; font-size: 12px; margin-right: 10px; border-radius: 10px; }
    
    .badge { position: absolute; top: -6px; right: -6px; background: #dc2626; color: white; font-size: 10px; font-weight: 600; min-width: 20px; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4); }
    
    .conv-info, .contact-name { display: flex; flex-direction: column; flex: 1; justify-content: center; }
    .conv-name, .contact-name { font-weight: 600; font-size: 15px; line-height: 1.3; color: #1e293b; }
    .members-count { font-size: 13px; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 170px; margin-top: 4px; }
    .role-chip { font-size: 11px; min-height: 22px; height: 22px; }
    
    .chat-main { flex: 1; display: flex; flex-direction: column; border-radius: 20px; overflow: hidden; border: 1px solid #e2e8f0; }
    .chat-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: #fff; border-bottom: 1px solid #e2e8f0; }
    .header-info { display: flex; align-items: center; gap: 14px; }
    .header-details { display: flex; flex-direction: column; }
    .header-name { font-weight: 700; font-size: 17px; color: #0f172a; }
    .header-status { font-size: 13px; color: #10b981; font-weight: 500; }
    .header-actions { display: flex; gap: 6px; }
    .header-actions button { color: #64748b; }
    
    .messages-zone { flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 16px; background: #f8fafc; }
    .date-divider { text-align: center; font-size: 13px; color: #94a3b8; margin: 12px 0; font-weight: 500; }
    .date-divider span { background: #e2e8f0; padding: 6px 16px; border-radius: 20px; }
    
    .message { display: flex; align-items: flex-end; gap: 10px; max-width: 70%; }
    .message.my-message { align-self: flex-end; flex-direction: row-reverse; }
    .message.their-message { align-self: flex-start; }
    
    .message-content { padding: 12px 18px; border-radius: 20px; position: relative; }
    .my-message .message-content { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border-bottom-right-radius: 6px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3); }
    .their-message .message-content { background: white; border-bottom-left-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    
    .sender-name { font-size: 12px; font-weight: 600; display: block; margin-bottom: 6px; color: #dc2626; }
    .my-message .sender-name { display: none; }
    .message-content p { margin: 0; font-size: 14px; line-height: 1.5; }
    .message-time { font-size: 11px; opacity: 0.7; display: block; text-align: right; margin-top: 6px; }
    .read-icon { font-size: 16px; opacity: 0.5; }
    .read-icon.read { opacity: 1; color: #3b82f6; }
    
    .input-zone { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: white; border-top: 1px solid #e2e8f0; }
    .message-input { flex: 1; margin-bottom: 0; }
    .send-btn { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border-radius: 14px; box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35); }
    
    .no-chat-selected { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #94a3b8; }
    .no-chat-selected mat-icon { font-size: 72px; width: 72px; height: 72px; color: #dc2626; margin-bottom: 20px; opacity: 0.8; }
    .no-chat-selected h3 { margin: 0; color: #1e293b; font-size: 20px; font-weight: 600; }
    .no-chat-selected p { margin: 10px 0 0; font-size: 14px; }
    
    .info-panel { width: 300px; border-radius: 20px; position: absolute; right: 0; top: 0; bottom: 0; border: 1px solid #e2e8f0; }
    .info-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e2e8f0; }
    .info-header h3 { margin: 0; font-weight: 700; }
    .info-content { padding: 20px; }
    .avatar-info { text-align: center; margin-bottom: 28px; }
    .avatar-info h4 { margin: 14px 0 6px; font-size: 18px; font-weight: 700; }
    .avatar-info span { font-size: 13px; color: #10b981; font-weight: 600; }
    .info-section { margin-bottom: 20px; }
    .info-section h5 { margin: 0 0 10px; font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
    .info-section p { margin: 0; font-size: 14px; }
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
