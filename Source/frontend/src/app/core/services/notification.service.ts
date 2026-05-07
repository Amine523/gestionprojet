import { Injectable, inject, signal, effect } from '@angular/core';
import { ApiService } from './api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as signalR from '@microsoft/signalr';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'project' | 'task' | 'system' | 'alert';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private hubConnection: signalR.HubConnection | undefined;

  notificationsSignal = signal<Notification[]>([]);
  unreadCount = signal(0);

  constructor() {
    this.loadFromStorage();
    this.startPolling();
    this.startSignalRConnection();

    this.api.userUpdate$.subscribe(() => {
      if (this.api.isLoggedIn() && (!this.hubConnection || this.hubConnection.state === signalR.HubConnectionState.Disconnected)) {
        this.startSignalRConnection();
        this.fetchNotifications();
      }
    });
  }

  private startSignalRConnection() {
    const token = this.api.getToken();
    if (!this.api.isLoggedIn() || !token) {
      console.warn('SignalR: Connexion annulée (non authentifié ou token manquant)');
      return;
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/notifications', {
        accessTokenFactory: () => {
          const t = this.api.getToken();
          if (!t) console.error('SignalR: Token manquant lors de la factory');
          return t || '';
        }
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR: Connecté avec succès pour les notifications'))
      .catch(err => {
        console.warn('SignalR: Erreur de connexion (401 probable si token invalide):', err);
      });

    this.hubConnection.on('ReceiveNotification', (notification: any) => {
      const newNotif: Notification = {
        id: notification.id || notification.Id || notification.idNotification || notification.IdNotification || Date.now().toString(),
        title: notification.titre || notification.Title || 'Nouvelle notification',
        message: notification.contenu || notification.Message || notification.description || '',
        type: (notification.type || notification.Type || 'info').toLowerCase() as any,
        timestamp: new Date(notification.dateCreation || notification.DateCreation || Date.now()),
        read: notification.estLu || notification.IsRead || notification.lu || false,
        actionUrl: notification.actionUrl || notification.ActionUrl || this.inferActionUrl(notification)
      };

      this.notificationsSignal.update(list => {
        if (!list.find(m => m.id === newNotif.id)) {
          return [newNotif, ...list];
        }
        return list;
      });
      this.updateUnreadCount();
      this.saveToStorage();

      this.snackBar.open(newNotif.message, 'Fermer', {
        duration: 5000,
        panelClass: [`snack-${newNotif.type}`],
        horizontalPosition: 'right',
        verticalPosition: 'top'
      });
    });
  }

  private startPolling() {
    this.fetchNotifications();
    setInterval(() => {
      if (this.api.isLoggedIn()) {
        this.fetchNotifications();
      }
    }, 30000);
  }

  fetchNotifications() {
    const user = this.api.getCurrentUser();
    if (!user) return;
    const userId = user.id || user.Id || user.utilisateurId;
    if (!userId) return;

    this.api.getUserNotifications(userId).subscribe({
      next: (res: any[]) => {
        if (res && Array.isArray(res)) {
          const apiNotifs: Notification[] = res.map(n => ({
            id: n.id || n.Id || n.idNotification || n.IdNotification,
            title: n.titre || n.Title || 'Notification',
            message: n.contenu || n.Message || n.description || '',
            type: (n.type || n.Type || 'info').toLowerCase() as any,
            timestamp: new Date(n.dateCreation || n.DateCreation || Date.now()),
            read: n.estLu || n.IsRead || n.lu || false,
            actionUrl: n.actionUrl || n.ActionUrl || this.inferActionUrl(n)
          }));

          const current = this.notificationsSignal();
          const merged = [...apiNotifs];
          
          current.forEach(local => {
            if (!merged.find(m => m.id === local.id)) {
              merged.push(local);
            }
          });

          const sorted = merged.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          this.notificationsSignal.set(sorted);
          this.updateUnreadCount();
          this.saveToStorage();
        }
      },
      error: (err) => console.warn('Erreur lors de la récupération des notifications:', err)
    });
  }

  private inferActionUrl(n: any): string | undefined {
    const title = (n.titre || n.Title || '').toLowerCase();
    const msg = (n.contenu || n.Message || n.description || '').toLowerCase();
    const role = this.api.getUserRole();
    
    let prefix = 'dev';
    if (role === 't001' || role === 'superadmin') prefix = 'superadmin';
    else if (role === 't002' || role === 'admin_societe') prefix = 'admin';
    else if (role === 't003' || role === 'rh') prefix = 'rh';
    else if (role === 't004' || role === 'chef_projet') prefix = 'chef';
    else if (role === 't006' || role === 'testeur') prefix = 'qa';
    else if (role === 't007' || role === 'candidat') prefix = 'applicant';
    else if (role === 't008' || role === 'client') prefix = 'client';

    if (title.includes('tâche') || msg.includes('tâche') || title.includes('task') || msg.includes('task')) return `/${prefix}/taches`;
    if (title.includes('projet') || msg.includes('projet') || title.includes('project')) return `/${prefix}/projets`;
    if (title.includes('congé') || msg.includes('congé') || title.includes('leave')) return `/${prefix}/conges`;
    if (title.includes('bug') || msg.includes('bug') || title.includes('anomalie')) return `/${prefix}/bugs`;
    if (title.includes('candidat') || msg.includes('candidat') || title.includes('candidature')) return `/${prefix}/candidats`;
    if (title.includes('entretien') || msg.includes('entretien') || title.includes('interview')) return `/${prefix}/entretiens`;
    if (title.includes('utilisateur') || msg.includes('utilisateur') || title.includes('employé')) return `/${prefix}/utilisateurs`;
    if (title.includes('test') || msg.includes('test')) return `/${prefix}/tests`;
    
    return undefined;
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('app_notifications');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.notificationsSignal.set(parsed.map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })));
        this.updateUnreadCount();
      } catch (e) {
        console.error('Error parsing notifications from storage', e);
      }
    }
  }

  private saveToStorage() {
    localStorage.setItem('app_notifications', JSON.stringify(this.notificationsSignal()));
  }

  private updateUnreadCount() {
    this.unreadCount.set(this.notificationsSignal().filter(n => !n.read).length);
  }

  notifyUser(userId: string, title: string, message: string, type: any = 'info') {
    this.api.sendNotificationToUser(userId, title, message, type).subscribe();
    const currentUser = this.api.getCurrentUser();
    if (currentUser && (currentUser.id === userId || currentUser.utilisateurId === userId)) {
      this.addLocalNotification(title, message, type);
    }
  }

  notifySociete(societeId: string, title: string, message: string, type: any = 'info') {
    this.api.sendNotificationToSociete(societeId, title, message, type).subscribe();
    const currentUser = this.api.getCurrentUser();
    if (currentUser && currentUser.societeId === societeId) {
      this.addLocalNotification(title, message, type);
    }
  }

  addLocalNotification(title: string, message: string, type: any = 'info') {
    const newNotif: Notification = {
      id: 'local_' + Date.now().toString(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false,
      actionUrl: this.inferActionUrl({ title, message })
    };

    this.notificationsSignal.update(list => [newNotif, ...list]);
    this.updateUnreadCount();
    this.saveToStorage();

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
    // this.api.patch(`notifications/${id}/read`, {}).subscribe();
  }

  markAllAsRead() {
    this.notificationsSignal.update(list => list.map(n => ({ ...n, read: true })));
    this.updateUnreadCount();
    this.saveToStorage();
  }

  deleteNotification(id: string) {
    this.notificationsSignal.update(list => list.filter(n => n.id !== id));
    this.updateUnreadCount();
    this.saveToStorage();
  }

  clearAll() {
    this.notificationsSignal.set([]);
    this.updateUnreadCount();
    this.saveToStorage();
  }
}

