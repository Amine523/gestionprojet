import { Injectable, inject, signal } from '@angular/core';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  notificationsSignal = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('app_notifications');
    if (stored) {
      const parsed = JSON.parse(stored);
      this.notificationsSignal.set(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
      this.updateUnreadCount();
    }
  }

  private saveToStorage() {
    localStorage.setItem('app_notifications', JSON.stringify(this.notificationsSignal()));
  }

  private updateUnreadCount() {
    this.unreadCount.set(this.notificationsSignal().filter(n => !n.read).length);
  }

  notifyUser(userId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    // API Call
    this.api.sendNotificationToUser(userId, title, message, type).subscribe();

    // Local UI Update if the recipient is the current user
    const currentUser = this.api.getCurrentUser();
    if (currentUser && (currentUser.id === userId || currentUser.utilisateurId === userId)) {
      this.addLocalNotification(title, message, type);
    }
  }

  notifySociete(societeId: string, title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    this.api.sendNotificationToSociete(societeId, title, message, type).subscribe();
    
    const currentUser = this.api.getCurrentUser();
    if (currentUser && currentUser.societeId === societeId) {
      this.addLocalNotification(title, message, type);
    }
  }

  addLocalNotification(title: string, message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') {
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };

    this.notificationsSignal.update(list => [newNotif, ...list]);
    this.updateUnreadCount();
    this.saveToStorage();

    // Show Snack
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
      panelClass: [`snack-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  markAsRead(id: string) {
    this.notificationsSignal.update(list => list.map(n => n.id === id ? { ...n, read: true } : n));
    this.updateUnreadCount();
    this.saveToStorage();
  }

  markAllAsRead() {
    this.notificationsSignal.update(list => list.map(n => ({ ...n, read: true })));
    this.updateUnreadCount();
    this.saveToStorage();
  }

  clearAll() {
    this.notificationsSignal.set([]);
    this.updateUnreadCount();
    this.saveToStorage();
  }
}
