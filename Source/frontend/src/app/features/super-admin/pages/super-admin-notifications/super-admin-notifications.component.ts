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
  templateUrl: './super-admin-notifications.component.html',
  styleUrls: ['./super-admin-notifications.component.scss']
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

