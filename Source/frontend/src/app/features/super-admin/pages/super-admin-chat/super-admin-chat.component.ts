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
  templateUrl: './super-admin-chat.component.html',
  styleUrls: ['./super-admin-chat.component.scss']
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
    this.snackBar.open('Message envoyé', 'Fermer', { duration: 3000 });
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

