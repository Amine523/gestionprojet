import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { interval } from 'rxjs';

interface SurveillanceData {
  utilisateursActifs: number;
  connexionsTempsReel: number;
  requetesApiMinute: number;
  notificationsRecues: number;
  alerts: number;
  cpu: number;
  memoire: number;
}

@Component({
  selector: 'app-super-admin-surveillance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container">
      <div class="page-header"><div class="header-icon"><mat-icon>monitoring</mat-icon></div>
        <div><h1>Surveillance Temps Réel</h1><p>Monitoring en direct du système</p></div>
      </div>
      <div class="stats-grid">
        <mat-card class="stat-card"><mat-icon>people</mat-icon><div class="stat-value">{{data.utilisateursActifs}}</div><div class="stat-label">Utilisateurs Actifs</div></mat-card>
        <mat-card class="stat-card"><mat-icon>wifi</mat-icon><div class="stat-value">{{data.connexionsTempsReel}}</div><div class="stat-label">Connexions Temps Réel</div></mat-card>
        <mat-card class="stat-card"><mat-icon>api</mat-icon><div class="stat-value">{{data.requetesApiMinute}}</div><div class="stat-label">Requêtes/min</div></mat-card>
        <mat-card class="stat-card"><mat-icon>notifications_active</mat-icon><div class="stat-value">{{data.notificationsRecues}}</div><div class="stat-label">Notifications</div></mat-card>
        <mat-card class="stat-card" [class.alert]="data.alerts > 0"><mat-icon>warning</mat-icon><div class="stat-value">{{data.alerts}}</div><div class="stat-label">Alertes</div></mat-card>
        <mat-card class="stat-card server"><mat-icon>dns</mat-icon><div class="stat-value">{{data.cpu}}%</div><div class="stat-label">CPU Serveur</div></mat-card>
      </div>
      <mat-card class="live-card"><div class="live-header"><mat-icon>circle css=spin></mat-icon> Activité en direct</div>
        <div class="activity-list">
          @for (act of activities; track act.id) {
            <div class="activity-item"><span class="time">{{act.time}}</span><span class="action">{{act.action}}</span><span class="ip">{{act.ip}}</span></div>
          }
        </div>
      </mat-card>
    </div>
  `,
  styles: [`.page-container { padding: 28px; } .page-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; } .header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #4caf50, #2e7d32); border-radius: 14px; display: flex; align-items: center; justify-content: center; } .header-icon mat-icon { color: #fff; font-size: 28px; } h1 { font-size: 24px; font-weight: 700; margin: 0; } p { color: #666; margin: 4px 0 0; } .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; } .stat-card { padding: 20px; border-radius: 12px; text-align: center; } .stat-card mat-icon { font-size: 32px; color: #4caf50; } .stat-card.server mat-icon { color: #2196f3; } .stat-card.alert mat-icon { color: #f44336; } .stat-value { font-size: 32px; font-weight: 700; margin: 8px 0; } .stat-label { font-size: 12px; color: #666; } .live-card { padding: 20px; border-radius: 12px; } .live-header { display: flex; align-items: center; gap: 8px; font-weight: 600; margin-bottom: 16px; } .activity-list { max-height: 300px; overflow-y: auto; } .activity-item { display: flex; gap: 16px; padding: 8px 0; border-bottom: 1px solid #eee; } .activity-item .time { color: #888; font-size: 12px; width: 60px; } .activity-item .action { flex: 1; } .activity-item .ip { color: #666; font-size: 12px; }`]
})
export class SuperAdminSurveillanceComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private intervalSub: any;
  
  data: SurveillanceData = { utilisateursActifs: 24, connexionsTempsReel: 18, requetesApiMinute: 156, notificationsRecues: 42, alerts: 3, cpu: 45, memoire: 62 };
  activities = [
    { id: 1, time: '16:23:30', action: 'Connexion utilisateur SOC_TN001_ADM', ip: '196.216.84.12' },
    { id: 2, time: '16:23:15', action: 'API /api/projets appelée', ip: '196.216.85.10' },
    { id: 3, time: '16:23:00', action: 'Notification envoyée', ip: '196.216.86.12' }
  ];

  ngOnInit() {
    this.intervalSub = setInterval(() => {
      this.data.utilisateursActifs = Math.floor(Math.random() * 10) + 20;
      this.data.connexionsTempsReel = Math.floor(Math.random() * 8) + 15;
      this.data.requetesApiMinute = Math.floor(Math.random() * 50) + 140;
      this.data.cpu = Math.floor(Math.random() * 30) + 35;
    }, 3000);
  }

  ngOnDestroy() { if (this.intervalSub) clearInterval(this.intervalSub); }
}
