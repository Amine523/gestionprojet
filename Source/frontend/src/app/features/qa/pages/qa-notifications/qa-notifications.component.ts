import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qa-notifications.component.html',
  styleUrls: ['./qa-notifications.component.scss']
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

