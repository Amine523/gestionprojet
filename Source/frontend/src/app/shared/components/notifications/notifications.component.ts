import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="notifications-container">
      <header class="page-header">
        <div class="header-content">
          <h1 class="header-title">Centre de <span class="gradient-text">Notifications</span></h1>
          <p class="header-subtitle">Restez informé des dernières activités sur vos projets et votre compte.</p>
        </div>
        <div class="header-actions">
          <button class="btn btn-ghost" (click)="markAllAsRead()">Tout marquer comme lu</button>
          <button class="btn btn-primary" (click)="loadNotifications()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            Actualiser
          </button>
        </div>
      </header>

      <div class="content-grid">
        <!-- Main List -->
        <div class="card notification-card">
          <div class="card-header">
            <div class="tabs">
              <button class="tab" [class.active]="filter === 'all'" (click)="setFilter('all')">Toutes</button>
              <button class="tab" [class.active]="filter === 'unread'" (click)="setFilter('unread')">Non lues</button>
              <button class="tab" [class.active]="filter === 'system'" (click)="setFilter('system')">Système</button>
            </div>
          </div>

          <div class="notifications-list">
            <div *ngFor="let n of filteredNotifications" class="notification-item" [class.unread]="!n.read">
              <div class="item-icon" [ngClass]="n.type">
                <svg *ngIf="n.type === 'project'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <svg *ngIf="n.type === 'task'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <svg *ngIf="n.type === 'system'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <svg *ngIf="n.type === 'alert'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div class="item-content">
                <div class="item-header">
                  <h4 class="item-title">{{n.title}}</h4>
                  <span class="item-time">{{n.time}}</span>
                </div>
                <p class="item-desc">{{n.message}}</p>
                <div class="item-actions">
                  <button class="btn-text" (click)="markAsRead(n)" *ngIf="!n.read">Marquer comme lu</button>
                  <button class="btn-text danger" (click)="deleteNotification(n)">Supprimer</button>
                </div>
              </div>
              <div class="unread-dot" *ngIf="!n.read"></div>
            </div>

            <div *ngIf="filteredNotifications.length === 0" class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <h3>Aucune notification</h3>
              <p>Vous êtes à jour ! Toutes vos notifications ont été consultées.</p>
            </div>
          </div>
        </div>

        <!-- Sidebar Info -->
        <div class="space-y-6">
          <div class="card settings-card">
            <h3 class="card-title">Préférences</h3>
            <div class="toggle-list">
              <div class="toggle-item">
                <span>Alertes Email</span>
                <div class="toggle active"></div>
              </div>
              <div class="toggle-item">
                <span>Notifications Push</span>
                <div class="toggle active"></div>
              </div>
              <div class="toggle-item">
                <span>Rapports Hebdomadaires</span>
                <div class="toggle"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .header-title {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0;
    }

    .gradient-text {
      background: linear-gradient(135deg, #6366f1, #a855f7);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      margin: var(--space-xs) 0 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-md);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-xl);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .card-header {
      padding: var(--space-md) var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      background: #f8fafc;
    }

    .tabs {
      display: flex;
      gap: var(--space-md);
    }

    .tab {
      padding: var(--space-sm) 0;
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--color-text-muted);
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab.active {
      color: #6366f1;
      border-bottom-color: #6366f1;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
    }

    .notification-item {
      display: flex;
      gap: var(--space-lg);
      padding: var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      position: relative;
      transition: background 0.2s;
    }

    .notification-item:hover {
      background: #f8fafc;
    }

    .notification-item.unread {
      background: rgba(99, 102, 241, 0.03);
    }

    .item-icon {
      width: 48px;
      height: 48px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .item-icon.project { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .item-icon.task { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .item-icon.system { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .item-icon.alert { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

    .item-content {
      flex: 1;
    }

    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }

    .item-title {
      font-weight: 700;
      font-size: 16px;
      margin: 0;
    }

    .item-time {
      font-size: 12px;
      color: var(--color-text-muted);
    }

    .item-desc {
      font-size: 14px;
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
      line-height: 1.5;
    }

    .item-actions {
      display: flex;
      gap: var(--space-lg);
    }

    .btn-text {
      background: transparent;
      border: none;
      font-size: 12px;
      font-weight: 700;
      color: #6366f1;
      padding: 0;
      cursor: pointer;
    }

    .btn-text.danger { color: #f43f5e; }

    .unread-dot {
      position: absolute;
      top: 24px;
      right: 24px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #6366f1;
    }

    .empty-state {
      padding: var(--space-2xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .empty-icon {
      margin-bottom: var(--space-lg);
      color: #e2e8f0;
    }

    .card-title {
      padding: var(--space-xl);
      margin: 0;
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1px solid var(--color-border);
    }

    .toggle-list {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      font-weight: 500;
    }

    .toggle {
      width: 40px;
      height: 20px;
      background: #e2e8f0;
      border-radius: 20px;
      position: relative;
      cursor: pointer;
    }

    .toggle::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 16px;
      height: 16px;
      background: white;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .toggle.active { background: #6366f1; }
    .toggle.active::after { left: 22px; }

    .btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-lg);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .btn-primary { background: #0f172a; color: white; border: none; }
    .btn-ghost { background: transparent; border: 1px solid var(--color-border); }

    .space-y-6 > * + * { margin-top: var(--space-lg); }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  filter = 'all';
  notifications: any[] = [
    { id: 1, type: 'project', title: 'Nouveau projet assigné', message: 'Vous avez été assigné au projet "Alpha Web Redesign".', time: 'Il y a 10 min', read: false },
    { id: 2, type: 'task', title: 'Tâche complétée', message: 'Le développeur Amine a terminé la tâche "Intégration API".', time: 'Il y a 1h', read: false },
    { id: 3, type: 'system', title: 'Mise à jour système', message: 'La plateforme GestProjet a été mise à jour en version 3.2.', time: 'Hier', read: true },
    { id: 4, type: 'alert', title: 'Bug critique détecté', message: 'Un bug critique a été signalé sur le module de paiement.', time: '2 jours', read: true }
  ];

  get filteredNotifications() {
    if (this.filter === 'unread') return this.notifications.filter(n => !n.read);
    if (this.filter === 'system') return this.notifications.filter(n => n.type === 'system');
    return this.notifications;
  }

  ngOnInit() {}

  setFilter(f: string) { this.filter = f; }
  markAsRead(n: any) { n.read = true; }
  markAllAsRead() { this.notifications.forEach(n => n.read = true); }
  deleteNotification(n: any) { this.notifications = this.notifications.filter(x => x.id !== n.id); }
  loadNotifications() { /* Refresh logic */ }
}
