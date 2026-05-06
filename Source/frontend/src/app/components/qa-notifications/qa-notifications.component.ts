import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-notifications',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Notifications - {{societeNom}}</h1>
      </div>

      <mat-card class="notif-card">
        @for (notif of notifications; track notif.id) {
          <div class="notif-item" [class.unread]="!notif.lu" (click)="markLu(notif)">
            <mat-icon [class]="notif.type">{{notif.icon}}</mat-icon>
            <div class="notif-content">
              <span class="notif-text">{{notif.texte}}</span>
              <span class="notif-time">{{notif.heure}}</span>
            </div>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }

    .notif-card { padding: 0; border-radius: 12px; }
    .notif-item { display: flex; align-items: center; gap: 14px; padding: 16px 20px; border-bottom: 1px solid #eee; cursor: pointer; }
    .notif-item:hover { background: #f9f9f9; }
    .notif-item.unread { background: #e3f2fd; }
    .notif-item mat-icon { color: #2196f3; }
    .notif-item mat-icon.bug { color: #f44336; }
    .notif-item mat-icon.test { color: #4caf50; }
    .notif-content { flex: 1; }
    .notif-text { display: block; font-size: 14px; }
    .notif-time { font-size: 12px; color: #999; }
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
