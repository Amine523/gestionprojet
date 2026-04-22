import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';

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

interface ChatGroup {
  id: string;
  nom: string;
  membres: string[];
  creePar: string;
  dateCreation: string;
}

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="d-flex" style="height: calc(100vh - 112px); background: white; border-radius: 12px; overflow: hidden;">
      <div class="d-flex flex-column" style="width: 320px; border-right: 1px solid #eee;">
        <div class="d-flex justify-content-between align-items-center p-3" style="border-bottom: 1px solid #eee;">
          <h5 class="fw-bold mb-0">Messages</h5>
          <div class="dropdown">
            <button class="btn btn-sm btn-outline-secondary" data-bs-toggle="dropdown">
              <i class="bi bi-plus-lg"></i>
            </button>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" (click)="openNewGroupDialog()"><i class="bi bi-people me-2"></i>Nouveau groupe</a></li>
              <li><a class="dropdown-item" (click)="loadContacts()"><i class="bi bi-arrow-clockwise me-2"></i>Actualiser</a></li>
            </ul>
          </div>
        </div>
        
        <div class="p-2">
          <div class="input-group">
            <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
            <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchQuery" (ngModelChange)="filterContacts()" placeholder="Rechercher...">
          </div>
        </div>
        
        <div class="flex-grow-1 overflow-y-auto">
          @for (contact of filteredContacts; track contact.id) {
            <div class="d-flex align-items-center gap-2 p-3" [class.bg-light]="selectedContact?.id === contact.id" [class.bg-success-subtle]="contact.isGroup" style="cursor: pointer; border-bottom: 1px solid #eee;" (click)="selectContact(contact)">
              <div class="rounded-circle d-flex align-items-center justify-content-center" [style.background]="contact.isGroup ? '#4caf50' : '#667eea'" style="width: 44px; height: 44px; color: white; font-weight: 600; font-size: 14px;">{{contact.avatar}}</div>
              <div class="flex-grow-1">
                <div class="fw-bold" style="font-size: 14px;">{{contact.nom}}</div>
                <div class="small" style="color: #667eea; font-weight: 500;">{{getPosteLabel(contact.typeUtilisateurId)}}</div>
                <div class="small text-muted" style="font-size: 12px;">{{contact.dernierMessage || 'Aucun message'}}</div>
              </div>
              <div class="d-flex flex-column align-items-end gap-1">
                <div class="small text-muted" style="font-size: 11px;">{{contact.time}}</div>
                @if (contact.unread > 0) {
                  <span class="badge rounded-pill" style="background: #667eea; font-size: 11px;">{{contact.unread}}</span>
                }
              </div>
            </div>
          }
          
          @if (filteredContacts.length === 0) {
            <div class="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
              <i class="bi bi-person-search" style="font-size: 48px;"></i>
              <span>Aucun contact</span>
            </div>
          }
        </div>
      </div>

      <div class="flex-grow-1 d-flex flex-column">
        @if (selectedContact) {
          <div class="d-flex justify-content-between align-items-center p-3" style="border-bottom: 1px solid #eee;">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: #667eea; color: white; font-weight: 600;">{{selectedContact.avatar}}</div>
              <div>
                <span class="fw-bold d-block" style="font-size: 16px;">{{selectedContact.nom}}</span>
                <span class="small text-success">{{selectedContact.isGroup ? (groupMembreCount + ' membres') : 'En ligne'}}</span>
              </div>
            </div>
            <div>
              @if (selectedContact && selectedContact.isGroup) {
                <button class="btn btn-sm btn-outline-secondary" (click)="viewGroupMembers()">
                  <i class="bi bi-people"></i>
                </button>
              }
            </div>
          </div>

          <div class="flex-grow-1 p-3 overflow-y-auto d-flex flex-column gap-3">
            @if (messages.length === 0) {
              <div class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
                <i class="bi bi-chat-dots" style="font-size: 48px;"></i>
                <span>Aucun message. Commencez la conversation!</span>
              </div>
            }
            @for (msg of messages; track msg.id) {
              <div class="p-3 rounded-4" [class]="msg.from === currentUserId ? 'ms-auto text-white' : 'me-auto bg-light'" [style.background]="msg.from === currentUserId ? '#667eea' : '#f0f0f0'" style="max-width: 70%;">
                @if (selectedContact.isGroup) {
                  <span class="small fw-bold d-block mb-1" [style.color]="msg.from === currentUserId ? 'rgba(255,255,255,0.8)' : '#667eea'">{{msg.fromName}}</span>
                }
                <span style="font-size: 14px;">{{msg.text}}</span>
                @if (msg.attachments && msg.attachments.length > 0) {
                  <div class="d-flex flex-wrap gap-2 mt-2">
                    @for (att of msg.attachments; track att.name) {
                      <div class="d-flex align-items-center gap-2 p-2 rounded-2" [style.background]="msg.from === currentUserId ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)'" style="cursor: pointer;" (click)="downloadAttachment(att)">
                        <i class="bi bi-file-earmark"></i>
                        <span class="small">{{att.name}}</span>
                      </div>
                    }
                  </div>
                }
                <span class="small d-block mt-1" style="opacity: 0.7; font-size: 10px;">{{msg.time}}</span>
              </div>
            }
          </div>

          <div class="d-flex align-items-center gap-2 p-3" style="border-top: 1px solid #eee;">
            <button class="btn btn-outline-secondary" (click)="fileInput.click()">
              <i class="bi bi-paperclip"></i>
            </button>
            <input #fileInput type="file" hidden (change)="onFileSelected($event)" multiple>
            <input type="text" class="form-control flex-grow-1" [(ngModel)]="newMessage" (keyup.enter)="sendMessage()" placeholder="Tapez un message...">
            <button class="btn btn-primary" style="background: #667eea; border: none;" (click)="sendMessage()">
              <i class="bi bi-send"></i>
            </button>
          </div>
        } @else {
          <div class="flex-grow-1 d-flex flex-column align-items-center justify-content-center text-muted">
            <i class="bi bi-chat" style="font-size: 64px;"></i>
            <span>Sélectionnez une conversation</span>
          </div>
        }
      </div>
      
      @if (showNewGroupDialog) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: #667eea;">
                <h5 class="modal-title">Nouveau Groupe</h5>
                <button type="button" class="btn-close btn-close-white" (click)="showNewGroupDialog = false"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nom du groupe</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-people"></i></span>
                    <input type="text" class="form-control" [(ngModel)]="newGroupName">
                  </div>
                </div>
                <p class="fw-bold mb-2">Sélectionner les membres:</p>
                <div style="max-height: 200px; overflow-y: auto;">
                  @for (c of availableMembers; track c.id) {
                    <div class="d-flex align-items-center gap-2 p-2 rounded-2" style="cursor: pointer;" (click)="toggleGroupMember(c)">
                      <i class="bi bi-{{selectedGroupMembers.includes(c.id) ? 'check-circle-fill' : 'circle'}}"></i>
                      <span>{{c.nom}}</span>
                    </div>
                  }
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="showNewGroupDialog = false">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: #667eea; border: none;" (click)="createGroup()" [disabled]="!newGroupName || selectedGroupMembers.length === 0">
                  <i class="bi bi-plus-lg me-2"></i>Créer
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="showNewGroupDialog = false"></div>
      }
      
      @if (groupMembersDialog) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: #667eea;">
                <h5 class="modal-title">Membres du groupe</h5>
                <button type="button" class="btn-close btn-close-white" (click)="groupMembersDialog = false"></button>
              </div>
              <div class="modal-body">
                <div style="max-height: 300px; overflow-y: auto;">
                  @for (m of groupMembersList; track m.id) {
                    <div class="d-flex align-items-center gap-3 p-3" style="border-bottom: 1px solid #eee;">
                      <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background: #667eea; color: white; font-weight: 600;">{{m.avatar}}</div>
                      <div>
                        <div class="fw-bold">{{m.nom}}</div>
                        <div class="small text-muted">{{m.typeUtilisateurId}}</div>
                      </div>
                    </div>
                  }
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-primary" style="background: #667eea; border: none;" (click)="groupMembersDialog = false">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="groupMembersDialog = false"></div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminChatComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  
  societeId: string = '';
  currentUserId: string = '';
  currentUserNom: string = '';
  currentUser: any = null;
  
  contacts: Contact[] = [];
  filteredContacts: Contact[] = [];
  messages: Message[] = [];
  selectedContact: Contact | null = null;
  newMessage = '';
  searchQuery = '';
  
  showNewGroupDialog = false;
  newGroupName = '';
  availableMembers: Contact[] = [];
  selectedGroupMembers: string[] = [];
  groupMemeCount = 0;
  
  groupMembersDialog = false;
  groupMembersList: Contact[] = [];
  pendingAttachments: { name: string; type: string; data: string }[] = [];
  
get groupMembreCount(): number {
    if (!this.selectedContact?.isGroup) return 0;
    const groups = this.getStoredGroups();
    const group = groups.find((g: ChatGroup) => g.id === this.selectedContact?.id);
    return group ? group.membres.length : 0;
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.currentUser = user;
    this.currentUserId = user?.id || '';
    this.currentUserNom = user?.nom || 'Admin';
    this.societeId = user?.societeId || '';
    this.loadContacts();
    this.loadRenewalAlerts();
  }

  loadRenewalAlerts() {
    this.api.getExpiringSubscriptions(7).subscribe({
      next: (expiringList) => {
        if (!expiringList || expiringList.length === 0) return;
        
        const storage = this.api.getRawStorage();
        if (!storage.renewalAlerts) storage.renewalAlerts = {};
        
        const alertKey = `alert_${this.societeId}`;
        if (!storage.renewalAlerts[alertKey]) {
          expiringList.forEach((abo: any) => {
            const alertMessage = {
              id: Date.now().toString() + Math.random(),
              text: `🔔 Alerte de renouvellement d'abonnement!\n\nSociété: ${abo.societeNom}\nPlan: ${abo.type}\nPrix: ${abo.prix} DT\nExpire le: ${new Date(abo.dateFin).toLocaleDateString('fr-FR')}\nJours restants: ${abo.joursRestants}`,
              from: 'SYSTEM',
              fromName: 'Système',
              fromRole: 'Alerte',
              time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
              date: new Date().toISOString(),
              isAlert: true
            };
            
            const superAdminKey = 'SUPER_ADMIN';
            if (!storage.conversations) storage.conversations = {};
            if (!storage.conversations[superAdminKey]) storage.conversations[superAdminKey] = [];
            storage.conversations[superAdminKey].unshift(alertMessage);
          });
          
          storage.renewalAlerts[alertKey] = true;
          localStorage.setItem('app_data', JSON.stringify(storage));
        }
      }
    });
  }

  openNewGroupDialog() {
    this.showNewGroupDialog = true;
    this.newGroupName = '';
    this.selectedGroupMembers = [];
    
    this.api.getUtilisateurs().subscribe({
      next: (users) => {
        this.availableMembers = users
          .filter((u: any) => u.societeId === this.societeId && u.id !== this.currentUserId)
          .map((u: any) => ({
            id: u.id,
            nom: u.nom,
            avatar: this.getInitials(u.nom),
            email: u.email,
            typeUtilisateurId: u.typeUtilisateurId,
            dernierMessage: '',
            time: '',
            unread: 0
          }));
      },
      error: () => {
        this.availableMembers = this.contacts.filter(c => c.id !== this.currentUserId && !c.isGroup);
      }
    });
  }

  loadContacts() {
    this.currentUser = this.api.getCurrentUser();
    const isAdminSociete = this.api.getUserRole() === 'admin_societe';
    const currentUserId = this.currentUser?.id;
    
    const superAdminContact: Contact = {
      id: 'SUPER_ADMIN',
      nom: 'Support NADHEMNI',
      avatar: 'SA',
      email: 'super@nademhni.tn',
      typeUtilisateurId: 'superadmin',
      dernierMessage: 'Contactez le support',
      time: '',
      unread: 0
    };
    
    this.api.getUtilisateurs().subscribe({
      next: (users) => {
        const usersOfSociete = users.filter((u: any) => u.societeId === this.societeId && u.id !== currentUserId);
        this.contacts = usersOfSociete.map((u: any) => ({
          id: u.id,
          nom: u.nom,
          avatar: this.getInitials(u.nom),
          email: u.email,
          typeUtilisateurId: u.typeUtilisateurId,
          dernierMessage: '',
          time: '',
          unread: 0
        }));
        
        if (isAdminSociete) {
          this.contacts.unshift(superAdminContact);
        }
        
        const storedGroups = this.getStoredGroups();
        const userGroups = storedGroups.filter((g: ChatGroup) => 
          g.membres.includes(currentUserId) || g.creePar === currentUserId
        );
        const groups = userGroups.map((g: ChatGroup) => ({
          id: g.id,
          nom: g.nom,
          avatar: 'G',
          email: '',
          typeUtilisateurId: 'group',
          dernierMessage: '',
          time: '',
          unread: 0,
          isGroup: true
        }));
        this.contacts = [...this.contacts, ...groups];
        
        this.filterContacts();
        
        this.route.queryParams.subscribe(params => {
          if (params['contact'] === 'superadmin' && isAdminSociete) {
            this.selectContact(superAdminContact);
          }
        });
      },
      error: () => {
        this.contacts = isAdminSociete ? [superAdminContact] : [];
        this.filterContacts();
      }
    });
  }

  filterContacts() {
    if (!this.searchQuery) {
      this.filteredContacts = this.contacts;
    } else {
      this.filteredContacts = this.contacts.filter(c => 
        c.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }

  getInitials(nom: string): string {
    return nom.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  }

  getPosteLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'admin_societe': 'Admin Société',
      'rh': 'RH',
      'chef_projet': 'Chef de Projet',
      'developpeur': 'Développeur',
      'testeur': 'Testeur',
      'utilisateur': 'Utilisateur',
      'group': 'Groupe'
    };
    return labels[type] || type || '';
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    this.messages = this.getStoredMessages(contact.id);
    
    const idx = this.contacts.findIndex(c => c.id === contact.id);
    if (idx >= 0) {
      this.contacts[idx].unread = 0;
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() && this.pendingAttachments.length === 0) return;
    if (!this.selectedContact) return;
    
    const now = new Date();
    const message: Message = {
      id: this.generateId('MSG_'),
      text: this.newMessage,
      from: this.currentUserId,
      fromName: this.currentUserNom,
      time: now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    
    if (this.pendingAttachments.length > 0) {
      message.attachments = this.pendingAttachments.map(a => ({
        name: a.name,
        type: a.type,
        url: a.data
      }));
    }
    
    this.messages.push(message);
    this.saveMessage(this.selectedContact.id, message);
    
    this.newMessage = '';
    this.pendingAttachments = [];
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      reader.onload = () => {
        this.pendingAttachments.push({
          name: file.name,
          type: file.type,
          data: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  }

  downloadAttachment(att: { name: string; type: string; url: string }) {
    const link = document.createElement('a');
    link.href = att.url;
    link.download = att.name;
    link.click();
  }

  saveMessage(contactId: string, message: Message) {
    if (contactId === 'SUPER_ADMIN') {
      const storage = this.api.getRawStorage();
      if (!storage.conversations) storage.conversations = {};
      
      const key = this.societeId || 'SUPER';
      
      if (!storage.conversations[key]) storage.conversations[key] = [];
      
      const msgToSave = {
        id: message.id,
        text: message.text,
        from: message.from,
        fromName: message.fromName,
        fromRole: 'Admin Société',
        time: message.time,
        date: new Date().toISOString()
      };
      
      storage.conversations[key].push(msgToSave);
      localStorage.setItem('app_data', JSON.stringify(storage));
    } else {
      const messages = this.getStoredMessages(contactId);
      messages.push(message);
      localStorage.setItem('app_chat_' + contactId, JSON.stringify(messages));
    }
  }

  getStoredMessages(contactId: string): Message[] {
    if (contactId === 'SUPER_ADMIN') {
      const storage = this.api.getRawStorage();
      const conversations = storage.conversations || {};
      const key = this.societeId || 'SUPER';
      const msgs = conversations[key] || [];
      return msgs.map((m: any) => ({
        id: m.id,
        text: m.text,
        from: m.from,
        fromName: m.fromName,
        time: m.time
      }));
    }
    
    const data = localStorage.getItem('app_chat_' + contactId);
    return data ? JSON.parse(data) : [];
  }

  getStoredGroups(): ChatGroup[] {
    const data = localStorage.getItem('app_chat_groups');
    return data ? JSON.parse(data) : [];
  }

  saveGroups(groups: ChatGroup[]) {
    localStorage.setItem('app_chat_groups', JSON.stringify(groups));
  }

  toggleGroupMember(contact: Contact) {
    const idx = this.selectedGroupMembers.indexOf(contact.id);
    if (idx >= 0) {
      this.selectedGroupMembers.splice(idx, 1);
    } else {
      this.selectedGroupMembers.push(contact.id);
    }
  }

  createGroup() {
    if (!this.newGroupName || this.selectedGroupMembers.length === 0) return;
    
    const members = [this.currentUserId, ...this.selectedGroupMembers];
    const group: ChatGroup = {
      id: this.generateId('GRP_'),
      nom: this.newGroupName,
      membres: members,
      creePar: this.currentUserId,
      dateCreation: new Date().toISOString()
    };
    
    const groups = this.getStoredGroups();
    groups.push(group);
    this.saveGroups(groups);
    
    const groupContact: Contact = {
      id: group.id,
      nom: group.nom,
      avatar: 'G',
      email: '',
      typeUtilisateurId: 'group',
      dernierMessage: '',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      isGroup: true
    };
    
    this.contacts.unshift(groupContact);
    this.filterContacts();
    
    this.showNewGroupDialog = false;
    this.newGroupName = '';
    this.selectedGroupMembers = [];
    this.availableMembers = [];
    
    alert('Groupe créé: ' + group.nom);
  }

  viewGroupMembers() {
    if (!this.selectedContact?.isGroup) return;
    const group = this.getStoredGroups().find((g: ChatGroup) => g.id === this.selectedContact?.id);
    if (group) {
      this.api.getUtilisateurs().subscribe({
        next: (users) => {
          this.groupMembersList = group.membres.map((mId: string) => {
            const user = users.find((u: any) => u.id === mId);
            return user ? {
              id: user.id,
              nom: user.nom,
              avatar: this.getInitials(user.nom),
              email: user.email,
              typeUtilisateurId: user.typeUtilisateurId,
              dernierMessage: '',
              time: '',
              unread: 0
            } : { id: mId, nom: mId, avatar: '??', email: '', typeUtilisateurId: '', dernierMessage: '', time: '', unread: 0 };
          });
          this.groupMembersDialog = true;
        },
        error: () => {
          this.groupMembersList = group.membres.map((mId: string) => ({
            id: mId,
            nom: mId,
            avatar: '??',
            email: '',
            typeUtilisateurId: '',
            dernierMessage: '',
            time: '',
            unread: 0
          }));
          this.groupMembersDialog = true;
        }
      });
    }
  }

  generateId(prefix: string): string {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  }
}

