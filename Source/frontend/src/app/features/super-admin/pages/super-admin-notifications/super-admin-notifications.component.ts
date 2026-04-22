import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { ApiService } from '@core/services/api.service';

interface Notification {
  id: string;
  titre: string;
  message: string;
  date: string;
  type: string;
  lu: boolean;
  niveau?: string;
}

@Component({
  selector: 'app-super-admin-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatTabsModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Centre Notifications</span>
            @if (unreadAlerts > 0) {
              <span class="badge badge-alert">{{unreadAlerts}} non lue(s)</span>
            }
          </div>
          <h1 class="header-title">
            Notifications <span class="gradient-text">& Alertes.</span>
          </h1>
          <p class="header-subtitle">
            Centre de notifications et alertes de sécurité.
          </p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs-container">
        <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'">
          Toutes
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'alerts'" (click)="activeTab = 'alerts'">
          Alertes
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'info'" (click)="activeTab = 'info'">
          Informations
        </button>
      </div>

      <!-- Content -->
      <div class="notifications-list">
        @if (activeTab === 'all') {
          @for (notif of allNotifications; track notif.id) {
            <div class="notif-card" [class.non-lu]="!notif.lu" [class.alert-card]="notif.type === 'alerte'">
              <div class="notif-icon" [class.critique]="notif.niveau === 'critique'" [class.warning]="notif.niveau === 'warning'" [class.info]="notif.niveau === 'info'">
                @if (notif.type === 'alerte' && notif.niveau === 'critique') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                } @else if (notif.type === 'alerte') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                } @else {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                }
              </div>
              <div class="notif-content">
                <strong>{{notif.titre}}</strong>
                <p>{{notif.message}}</p>
                <span class="text-muted">{{notif.date}}</span>
              </div>
              @if (notif.type === 'alerte') {
                <span class="badge" [class.critique]="notif.niveau === 'critique'" [class.warning]="notif.niveau === 'warning'">{{notif.niveau}}</span>
              }
              @if (notif.type === 'info' && !notif.lu) {
                <span class="badge badge-new">Nouveau</span>
              }
              @if (!notif.lu) {
                <button class="btn-icon" (click)="marquerLu(notif)" title="Marquer comme lu">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              }
            </div>
          }
          @if (allNotifications.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                <path d="M12 2v4"/>
                <path d="M12 18v4"/>
                <path d="M4.93 4.93l2.83 2.83"/>
                <path d="M16.24 16.24l2.83 2.83"/>
                <path d="M2 12h4"/>
                <path d="M18 12h4"/>
                <path d="M4.93 19.07l2.83-2.83"/>
                <path d="M16.24 7.76l2.83-2.83"/>
              </svg>
              <p class="empty-state-text">Aucune notification</p>
            </div>
          }
        }

        @if (activeTab === 'alerts') {
          @for (notif of alertNotifications; track notif.id) {
            <div class="notif-card non-lu alert-card">
              <div class="notif-icon" [class.critique]="notif.niveau === 'critique'" [class.warning]="notif.niveau === 'warning'">
                @if (notif.niveau === 'critique') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                } @else {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                }
              </div>
              <div class="notif-content">
                <strong>{{notif.titre}}</strong>
                <p>{{notif.message}}</p>
                <span class="text-muted">{{notif.date}}</span>
              </div>
              <span class="badge" [class.critique]="notif.niveau === 'critique'" [class.warning]="notif.niveau === 'warning'">{{notif.niveau}}</span>
              @if (!notif.lu) {
                <button class="btn-icon" (click)="marquerLu(notif)" title="Marquer comme lu">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              }
            </div>
          }
          @if (alertNotifications.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p class="empty-state-text">Aucune alerte</p>
            </div>
          }
        }

        @if (activeTab === 'info') {
          @for (notif of infoNotifications; track notif.id) {
            <div class="notif-card" [class.non-lu]="!notif.lu">
              <div class="notif-icon info">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              </div>
              <div class="notif-content">
                <strong>{{notif.titre}}</strong>
                <p>{{notif.message}}</p>
                <span class="text-muted">{{notif.date}}</span>
              </div>
              @if (!notif.lu) {
                <span class="badge badge-new">Nouveau</span>
              }
              @if (!notif.lu) {
                <button class="btn-icon" (click)="marquerLu(notif)" title="Marquer comme lu">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </button>
              }
            </div>
          }
          @if (infoNotifications.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p class="empty-state-text">Aucune information</p>
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(249, 115, 22, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
      border: 1px solid rgba(249, 115, 22, 0.2);
    }

    .badge-alert {
      background: #ef4444;
      color: white;
      border: none;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .badge-new {
      background: #f97316;
      color: white;
      border: none;
    }

    .badge.critique {
      background: #ef4444;
      color: white;
      border: none;
    }

    .badge.warning {
      background: #f97316;
      color: white;
      border: none;
    }

    .badge.info {
      background: #3b82f6;
      color: white;
      border: none;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fdba74, #fb923c, #fbbf24);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .tabs-container {
      display: flex;
      gap: var(--space-xs);
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-xs);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .tab-btn {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn:hover {
      background: var(--color-bg);
    }

    .tab-btn.active {
      background: #f97316;
      color: white;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .notif-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .notif-card:hover {
      box-shadow: var(--shadow-md);
    }

    .notif-card.non-lu {
      background: rgba(249, 115, 22, 0.05);
      border-left: 4px solid #f97316;
    }

    .notif-card.alert-card {
      background: rgba(239, 68, 68, 0.05);
      border-left: 4px solid #ef4444;
    }

    .notif-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .notif-icon.critique {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .notif-icon.warning {
      background: linear-gradient(135deg, #f97316, #ea580c);
    }

    .notif-icon.info {
      background: linear-gradient(135deg, #3b82f6, #2563eb);
    }

    .notif-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .notif-content strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .notif-content p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
    }

    .text-muted {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-icon:hover {
      background: var(--color-bg);
    }

    .empty-state {
      padding: var(--space-3xl) 0;
      text-align: center;
    }

    .empty-state svg {
      margin: 0 auto var(--space-lg);
      color: var(--color-text-muted);
    }

    .empty-state-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .tabs-container {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-btn {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .tab-btn:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .notif-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .notif-card.non-lu {
      background: rgba(249, 115, 22, 0.1);
    }

    :host-context(.dark) .notif-card.alert-card {
      background: rgba(239, 68, 68, 0.1);
    }

    @media (max-width: 768px) {
      .notif-card {
      flex-wrap: wrap;
      }
    }
  `]
})
export class SuperAdminNotificationsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  activeTab = 'all';
  notifications: Notification[] = [];
  allNotifications: Notification[] = [];
  alertNotifications: Notification[] = [];
  infoNotifications: Notification[] = [];
  unreadAlerts = 0;

  ngOnInit() { this.loadNotifications(); }

  loadNotifications() {
    forkJoin({
      notifications: this.api.getNotifications(),
      anomalies: this.api.getAnomalies()
    }).subscribe({
      next: ({ notifications, anomalies }) => {
        const mapped: Notification[] = [];
        
        (anomalies || []).forEach((a: any) => {
          mapped.push({
            id: a.id || 'ANM_' + Math.random().toString(36),
            titre: a.type || 'Anomalie detectee',
            message: a.description || a.details || '',
            date: new Date(a.dateDetection || a.date).toLocaleString('fr-FR'),
            type: 'alerte',
            lu: a.estTraitee || false,
            niveau: a.niveau || 'warning'
          });
        });
        
        (notifications || []).forEach((n: any) => {
          mapped.push({
            id: n.id || 'NOTIF_' + Math.random().toString(36),
            titre: n.titre || 'Notification',
            message: n.contenu || '',
            date: new Date(n.dateCreation).toLocaleString('fr-FR'),
            type: 'info',
            lu: n.estLu || false,
            niveau: 'info'
          });
        });
        
        this.allNotifications = mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.alertNotifications = this.allNotifications.filter(n => n.type === 'alerte');
        this.infoNotifications = this.allNotifications.filter(n => n.type === 'info');
        this.unreadAlerts = this.alertNotifications.filter(n => !n.lu).length;
      },
      error: () => {
        this.notifications = [
          { id: '1', titre: 'Nouvel utilisateur', message: 'Ahmed Ben Ali vient de creer un compte', date: '04/04/2026 16:00', type: 'info', lu: false, niveau: 'info' },
          { id: '2', titre: 'Alerte securite', message: 'Tentative de connexion suspecte detectee', date: '04/04/2026 15:30', type: 'alerte', lu: false, niveau: 'critique' },
          { id: '3', titre: 'Nouvel abonnement', message: 'TechTunisia a souscrit au plan Premium', date: '04/04/2026 14:00', type: 'info', lu: true, niveau: 'info' }
        ];
        this.allNotifications = this.notifications;
        this.alertNotifications = this.notifications.filter(n => n.type === 'alerte');
        this.infoNotifications = this.notifications.filter(n => n.type === 'info');
        this.unreadAlerts = 1;
      }
    });
  }

  getIcon(type: string, niveau?: string): string {
    if (type === 'alerte') {
      return niveau === 'critique' ? 'error' : 'warning';
    }
    return 'info';
  }

  getIconClass(notif: Notification): string {
    if (notif.type === 'alerte') {
      return notif.niveau === 'critique' ? 'icon-critique' : 'icon-warning';
    }
    return 'icon-info';
  }

  marquerLu(notif: Notification) {
    notif.lu = true;
    this.unreadAlerts = this.alertNotifications.filter(n => !n.lu).length;
    this.snackBar.open('Notification marquee comme lue', 'OK', { duration: 2000 });
  }
}

