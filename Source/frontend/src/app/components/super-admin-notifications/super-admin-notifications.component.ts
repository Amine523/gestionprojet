import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../services/api.service';

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
    <div class="page-container">
      <div class="page-header"><div class="header-icon"><mat-icon>notifications_active</mat-icon></div>
        <div><h1>Notifications & Alertes</h1><p>Centre de notifications et alertes de securite</p><div class="alert-badge" *ngIf="unreadAlerts>0">{{unreadAlerts}} alerte(s) non lue(s)</div></div>
      </div>
      <mat-tab-group>
        <mat-tab label="Toutes">
          <div class="notifications-list">
            @for (notif of allNotifications; track notif.id) {
              <mat-card class="notif-card" [class.non-lu]="!notif.lu" [class.alert-card]="notif.type==='alerte'">
                <mat-icon [class]="getIconClass(notif)">{{getIcon(notif.type, notif.niveau)}}</mat-icon>
                <div class="notif-content">
                  <strong>{{notif.titre}}</strong>
                  <p>{{notif.message}}</p>
                  <span>{{notif.date}}</span>
                </div>
                <mat-chip *ngIf="notif.type==='alerte'" [class]="'chip-alerte chip-'+notif.niveau">{{notif.niveau}}</mat-chip>
                <mat-chip *ngIf="notif.type==='info' && !notif.lu" class="chip-nouveau">Nouveau</mat-chip>
                <button mat-icon-button (click)="marquerLu(notif)" *ngIf="!notif.lu"><mat-icon>check</mat-icon></button>
              </mat-card>
            }
            @if (allNotifications.length===0) {
              <mat-card class="notif-card"><mat-icon>notifications_none</mat-icon><div class="notif-content"><p>Aucune notification</p></div></mat-card>
            }
          </div>
        </mat-tab>
        <mat-tab label="Alertes">
          <div class="notifications-list">
            @for (notif of alertNotifications; track notif.id) {
              <mat-card class="notif-card" [class.non-lu]="!notif.lu" class="alert-card">
                <mat-icon [class]="getIconClass(notif)">{{getIcon(notif.type, notif.niveau)}}</mat-icon>
                <div class="notif-content">
                  <strong>{{notif.titre}}</strong>
                  <p>{{notif.message}}</p>
                  <span>{{notif.date}}</span>
                </div>
                <mat-chip [class]="'chip-alerte chip-'+notif.niveau">{{notif.niveau}}</mat-chip>
                <button mat-icon-button (click)="marquerLu(notif)" *ngIf="!notif.lu"><mat-icon>check</mat-icon></button>
              </mat-card>
            }
            @if (alertNotifications.length===0) {
              <mat-card class="notif-card"><mat-icon>check_circle</mat-icon><div class="notif-content"><p>Aucune alerte</p></div></mat-card>
            }
          </div>
        </mat-tab>
        <mat-tab label="Informations">
          <div class="notifications-list">
            @for (notif of infoNotifications; track notif.id) {
              <mat-card class="notif-card" [class.non-lu]="!notif.lu">
                <mat-icon>{{getIcon(notif.type, notif.niveau)}}</mat-icon>
                <div class="notif-content">
                  <strong>{{notif.titre}}</strong>
                  <p>{{notif.message}}</p>
                  <span>{{notif.date}}</span>
                </div>
                <mat-chip *ngIf="!notif.lu" class="chip-nouveau">Nouveau</mat-chip>
                <button mat-icon-button (click)="marquerLu(notif)" *ngIf="!notif.lu"><mat-icon>check</mat-icon></button>
              </mat-card>
            }
            @if (infoNotifications.length===0) {
              <mat-card class="notif-card"><mat-icon>info</mat-icon><div class="notif-content"><p>Aucune information</p></div></mat-card>
            }
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`.page-container { padding: 28px; } .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; position: relative; } .header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #ff9800, #f57c00); border-radius: 14px; display: flex; align-items: center; justify-content: center; } .header-icon mat-icon { color: #fff; font-size: 28px; } h1 { font-size: 24px; font-weight: 700; margin: 0; } .page-header p { color: #666; margin: 4px 0 0; } .alert-badge { position: absolute; top: 0; right: 0; background: #d32f2f; color: #fff; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 600; } .notifications-list { display: flex; flex-direction: column; gap: 12px; padding-top: 16px; } .notif-card { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 10px; background: #fff; } .notif-card.non-lu { background: #fff8e1; border-left: 4px solid #ff9800; } .notif-card.alert-card { background: #ffebee; border-left: 4px solid #d32f2f; } .notif-card mat-icon { font-size: 28px; color: #666; } .notif-card mat-icon.icon-critique { color: #d32f2f; } .notif-card mat-icon.icon-warning { color: #ff9800; } .notif-card mat-icon.icon-info { color: #1976d2; } .notif-content { flex: 1; } .notif-content strong { display: block; } .notif-content p { margin: 4px 0; color: #666; font-size: 14px; } .notif-content span { font-size: 12px; color: #888; } .chip-nouveau { background: #ff9800; color: #fff; } .chip-alerte { font-size: 11px; font-weight: 600; text-transform: uppercase; } .chip-critique { background: #d32f2f; color: #fff; } .chip-warning { background: #ff9800; color: #fff; } .chip-info { background: #1976d2; color: #fff; }`]
})
export class SuperAdminNotificationsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
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
