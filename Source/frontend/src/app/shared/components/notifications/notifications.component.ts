import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { NotificationService, Notification } from '@core/services/notification.service';

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
            @for (n of filteredNotifications(); track n.id) {
              <div class="notification-item" [class.unread]="!n.read" [class.clickable]="n.actionUrl" (click)="handleNotificationClick(n, $event)">
                <div class="item-icon" [ngClass]="n.type">
                  @if (n.type === 'project' || n.type === 'success') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  } @else if (n.type === 'task') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                  } @else if (n.type === 'system' || n.type === 'info') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  } @else if (n.type === 'alert' || n.type === 'error' || n.type === 'warning') {
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  }
                </div>
                <div class="item-content">
                  <div class="item-header">
                    <h4 class="item-title">{{n.title}}</h4>
                    <span class="item-time">{{ getTimeLabel(n.timestamp) }}</span>
                  </div>
                  <p class="item-desc">{{n.message}}</p>
                  <div class="item-actions">
                    @if (!n.read) {
                      <button class="btn-text" (click)="markAsRead(n); $event.stopPropagation()">Marquer comme lu</button>
                    }
                    <button class="btn-text danger" (click)="deleteNotification(n); $event.stopPropagation()">Supprimer</button>
                    @if (n.actionUrl) {
                      <button class="btn-text" style="color: var(--color-brand-500)">Voir les détails <span aria-hidden="true">&rarr;</span></button>
                    }
                  </div>
                </div>
                @if (!n.read) {
                  <div class="unread-dot"></div>
                }
              </div>
            }

            @if (filteredNotifications().length === 0) {
              <div class="empty-state">
                <div class="empty-icon">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                </div>
                <h3>Aucune notification</h3>
                <p>Vous êtes à jour ! Toutes vos notifications ont été consultées.</p>
              </div>
            }
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

    :host-context(.dark) .card {
      background: #1e293b;
      border-color: #334155;
    }

    .card-header {
      padding: var(--space-md) var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      background: #f8fafc;
    }

    :host-context(.dark) .card-header {
      background: #0f172a;
      border-bottom-color: #334155;
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
    
    .notification-item.clickable {
      cursor: pointer;
    }

    :host-context(.dark) .notification-item {
      border-bottom-color: #334155;
    }

    .notification-item:hover {
      background: #f8fafc;
    }

    :host-context(.dark) .notification-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .notification-item.unread {
      background: rgba(99, 102, 241, 0.03);
    }

    :host-context(.dark) .notification-item.unread {
      background: rgba(99, 102, 241, 0.1);
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

    .item-icon.project, .item-icon.success { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
    .item-icon.task { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .item-icon.system, .item-icon.info { background: rgba(99, 102, 241, 0.1); color: #6366f1; }
    .item-icon.alert, .item-icon.error, .item-icon.warning { background: rgba(244, 63, 94, 0.1); color: #f43f5e; }

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

    :host-context(.dark) .card-title {
      border-bottom-color: #334155;
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
    :host-context(.dark) .btn-primary { background: #6366f1; }

    .btn-ghost { background: transparent; border: 1px solid var(--color-border); }
    :host-context(.dark) .btn-ghost { border-color: #334155; color: white; }

    .space-y-6 > * + * { margin-top: var(--space-lg); }

    @media (max-width: 1024px) {
      .content-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class NotificationsComponent implements OnInit {
  private notifService = inject(NotificationService);
  private router = inject(Router);
  filter = 'all';

  notifications = computed(() => this.notifService.notificationsSignal());

  filteredNotifications = computed(() => {
    const list = this.notifications();
    if (this.filter === 'unread') return list.filter(n => !n.read);
    if (this.filter === 'system') return list.filter(n => n.type === 'system' || n.type === 'alert');
    return list;
  });

  ngOnInit() {
    this.notifService.fetchNotifications();
  }

  setFilter(f: string) { this.filter = f; }

  handleNotificationClick(n: Notification, event: Event) {
    if (n.id && !n.read) {
      this.notifService.markAsRead(n.id);
    }
    
    if (n.actionUrl) {
      this.router.navigateByUrl(n.actionUrl);
    }
  }

  markAsRead(n: Notification) {
    if (n.id) this.notifService.markAsRead(n.id);
  }

  markAllAsRead() {
    this.notifService.markAllAsRead();
  }

  deleteNotification(n: Notification) {
    if (n.id) this.notifService.deleteNotification(n.id);
  }

  loadNotifications() {
    this.notifService.fetchNotifications();
  }

  getTimeLabel(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    if (days === 1) return 'Hier';
    return date.toLocaleDateString();
  }
}


