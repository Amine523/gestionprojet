import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="notifications-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="header-title">Notifications - {{societeNom}}</h1>
      </div>

      <!-- Notifications List -->
      <div class="notif-card">
        @for (notif of notifications; track notif.id) {
          <div class="notif-item" [class.unread]="!notif.lu" (click)="markLu(notif)">
            <div class="notif-icon" [ngClass]="notif.type">
              @if (notif.type === 'test') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
              } @else if (notif.type === 'bug') {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M8 12h8"/>
                  <path d="M12 8v8"/>
                </svg>
              } @else {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              }
            </div>
            <div class="notif-content">
              <span class="notif-text">{{notif.texte}}</span>
              <span class="notif-time">{{notif.heure}}</span>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      padding: var(--space-lg);
    }

    .page-header {
      margin-bottom: var(--space-xl);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .notif-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: 0;
      box-shadow: var(--shadow-sm);
    }

    .notif-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      cursor: pointer;
      transition: background var(--transition-base);
    }

    .notif-item:hover {
      background: var(--color-bg);
    }

    .notif-item.unread {
      background: #e3f2fd;
    }

    .notif-item.unread:hover {
      background: #bbdefb;
    }

    .notif-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      background: rgba(59, 130, 246, 0.1);
    }

    .notif-icon.bug {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.1);
    }

    .notif-icon.test {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }

    .notif-content {
      flex: 1;
    }

    .notif-text {
      display: block;
      font-size: var(--font-size-sm);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .notif-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    /* Dark mode */
    :host-context(.dark) .notif-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .notif-text {
      color: var(--color-text);
    }

    :host-context(.dark) .notif-time {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .notif-item {
      border-color: var(--color-border);
    }

    :host-context(.dark) .notif-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .notif-item.unread {
      background: rgba(59, 130, 246, 0.1);
    }

    :host-context(.dark) .notif-item.unread:hover {
      background: rgba(59, 130, 246, 0.2);
    }

    @media (max-width: 768px) {
      .notifications-container {
        padding: var(--space-md);
      }

      .notif-item {
        padding: var(--space-sm) var(--space-md);
      }
    }
  `]
})
export class QaNotificationsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';
  notifications: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    
    const storedNotifs = data.notifications?.[this.societeId] || [];
    storedNotifs.forEach((n: any) => {
      this.notifications.push({
        id: n.id,
        type: n.type,
        icon: n.type === 'test' ? 'assignment' : n.type === 'bug' ? 'bug_report' : 'folder',
        texte: n.message || n.titre,
        heure: this.formatDate(n.date),
        lu: n.lu
      });
    });

    const societeTests = data.qaTests?.[this.societeId] || [];
    const societeBugs = data.qaBugs?.[this.societeId] || [];

    societeTests.forEach((t: any) => {
      this.notifications.push({
        id: t.id + '_test',
        type: 'test',
        icon: 'assignment',
        texte: 'Test: ' + (t.titre || t.nom || 'Sans titre'),
        heure: t.dateCreation || 'Récent',
        lu: false
      });
    });

    societeBugs.forEach((b: any) => {
      this.notifications.push({
        id: b.id + '_bug',
        type: 'bug',
        icon: 'bug_report',
        texte: 'Bug: ' + b.titre,
        heure: b.dateCreation || 'Récent',
        lu: false
      });
    });

    this.notifications.sort((a, b) => b.id - a.id);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return 'Récent';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `Il y a ${minutes}min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    const days = Math.floor(hours / 24);
    return `Il y a ${days}j`;
  }

  markLu(notif: any) {
    notif.lu = true;
  }
}

