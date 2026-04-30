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
  templateUrl: './admin-chat.component.html',
  styleUrls: ['./admin-chat.component.scss']
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
