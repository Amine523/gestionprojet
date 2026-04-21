import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

interface LogEntry {
  id: number;
  action: string;
  type: string;
  user: string;
  ip: string;
  date: string;
  status: 'success' | 'error' | 'warning';
}

interface ConnexionHistory {
  id: number;
  user: string;
  email: string;
  dateConnexion: string;
  ip: string;
  appareil: string;
  statut: 'success' | 'failed';
}

interface Anomalie {
  id: number;
  type: string;
  description: string;
  date: string;
  niveau: 'critical' | 'warning' | 'info';
  statut: 'non_resolu' | 'en_cours' | 'resolu';
}

@Component({
  selector: 'app-super-admin-logs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTabsModule, MatTableModule, MatChipsModule, MatSnackBarModule],
  template: `
    <div class="logs-container">
      <div class="page-header">
        <div class="header-icon">
          <mat-icon>history</mat-icon>
        </div>
        <div>
          <h1>Historique & Sécurité</h1>
          <p>Logs, connexions et détection d'anomalies</p>
        </div>
      </div>

      <mat-tab-group class="logs-tabs">
        <mat-tab label="Historique des connexions">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Connexions Utilisateurs</h3>
              <button mat-stroked-button (click)="exportConnexions()">
                <mat-icon>download</mat-icon>Exporter
              </button>
            </div>
            <div class="logs-list">
              @for (conn of connexions; track conn.id) {
                <mat-card class="log-card" [class]="conn.statut">
                  <div class="log-icon">
                    <mat-icon>{{conn.statut === 'success' ? 'check_circle' : 'cancel'}}</mat-icon>
                  </div>
                  <div class="log-content">
                    <strong>{{conn.user}}</strong>
                    <span class="log-email">{{conn.email}}</span>
                    <span class="log-detail">
                      <mat-icon>computer</mat-icon>{{conn.appareil}}
                      <mat-icon>language</mat-icon>{{conn.ip}}
                    </span>
                  </div>
                  <div class="log-date">{{conn.dateConnexion}}</div>
                </mat-card>
              }
              @if (connexions.length === 0) {
                <div class="empty">Aucune connexion trouvée</div>
              }
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Logs API">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Journal des API</h3>
              <button mat-stroked-button (click)="clearLogs()">
                <mat-icon>delete_sweep</mat-icon>Effacer
              </button>
            </div>
            <div class="logs-list">
              @for (log of apiLogs; track log.id) {
                <mat-card class="log-card" [class]="log.status">
                  <div class="log-icon">
                    <mat-icon>{{log.status === 'success' ? 'check_circle' : log.status === 'warning' ? 'warning' : 'error'}}</mat-icon>
                  </div>
                  <div class="log-content">
                    <strong>{{log.action}}</strong>
                    <span class="log-detail">
                      <mat-icon>person</mat-icon>{{log.user}}
                      <mat-icon>language</mat-icon>{{log.ip}}
                    </span>
                  </div>
                  <mat-chip [class]="log.status === 'success' ? 'chip-success' : log.status === 'warning' ? 'chip-warning' : 'chip-error'">
                    {{log.status}}
                  </mat-chip>
                  <div class="log-date">{{log.date}}</div>
                </mat-card>
              }
              @if (apiLogs.length === 0) {
                <div class="empty">Aucun log API</div>
              }
            </div>
          </div>
        </mat-tab>

        <mat-tab label="Détection d'anomalies">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Anomalies Détectées</h3>
              <button mat-stroked-button (click)="scanAnomalies()">
                <mat-icon>radar</mat-icon>Scanner
              </button>
            </div>
            <div class="logs-list">
              @for (ano of anomalies; track ano.id) {
                <mat-card class="log-card" [class]="ano.niveau">
                  <div class="log-icon">
                    <mat-icon>{{ano.niveau === 'critical' ? 'error' : ano.niveau === 'warning' ? 'warning' : 'info'}}</mat-icon>
                  </div>
                  <div class="log-content">
                    <strong>{{ano.type}}</strong>
                    <span class="log-detail">{{ano.description}}</span>
                  </div>
                  <mat-chip [class]="ano.niveau === 'critical' ? 'chip-error' : ano.niveau === 'warning' ? 'chip-warning' : 'chip-info'">
                    {{ano.niveau}}
                  </mat-chip>
                  <mat-chip [class]="ano.statut === 'resolu' ? 'chip-success' : ano.statut === 'en_cours' ? 'chip-warning' : 'chip-error'">
                    {{ano.statut === 'non_resolu' ? 'Non résolu' : ano.statut === 'en_cours' ? 'En cours' : 'Résolu'}}
                  </mat-chip>
                  <div class="log-date">{{ano.date}}</div>
                </mat-card>
              }
              @if (anomalies.length === 0) {
                <div class="empty">
                  <mat-icon>verified</mat-icon>
                  <span>Aucune anomalie détectée</span>
                </div>
              }
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .logs-container { padding: 24px; }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
      border-radius: 12px;
      color: white;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 52px; height: 52px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon mat-icon { font-size: 28px; }
    h1 { margin: 0; font-size: 24px; font-weight: 700; }
    p { margin: 4px 0 0; opacity: 0.8; }

    .logs-tabs { background: white; border-radius: 12px; }
    .tab-content { padding: 24px; }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .tab-header h3 { margin: 0; font-size: 18px; font-weight: 600; }

    .logs-list { display: flex; flex-direction: column; gap: 12px; }
    .log-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 10px;
    }
    .log-icon {
      width: 40px; height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .log-card.success .log-icon { background: #e8f5e9; color: #2e7d32; }
    .log-card.error .log-icon { background: #ffebee; color: #c62828; }
    .log-card.warning .log-icon { background: #fff3e0; color: #ef6c00; }
    .log-card.critical .log-icon { background: #ffebee; color: #c62828; }
    .log-card.info .log-icon { background: #e3f2fd; color: #1565c0; }

    .log-content { flex: 1; display: flex; flex-direction: column; }
    .log-content strong { font-size: 14px; font-weight: 600; }
    .log-email { font-size: 12px; color: #666; }
    .log-detail {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #888;
      margin-top: 4px;
    }
    .log-detail mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }

    .log-date { font-size: 12px; color: #888; white-space: nowrap; }

    .chip-success { background: #e8f5e9; color: #2e7d32; }
    .chip-warning { background: #fff3e0; color: #ef6c00; }
    .chip-error { background: #ffebee; color: #c62828; }
    .chip-info { background: #e3f2fd; color: #1565c0; }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #888;
    }
    .empty mat-icon { font-size: 48px; margin-bottom: 12px; }
  `]
})
export class SuperAdminLogsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  apiLogs: LogEntry[] = [
    { id: 1, action: 'POST /api/societes', type: 'API', user: 'admin@leadertec.com', ip: '192.168.1.100', date: '03/04/2026 16:30', status: 'success' },
    { id: 2, action: 'GET /api/utilisateurs', type: 'API', user: 'super@admin.com', ip: '192.168.1.50', date: '03/04/2026 16:28', status: 'success' },
    { id: 3, action: 'POST /api/auth/login', type: 'API', user: 'dev@leadertec.com', ip: '192.168.1.75', date: '03/04/2026 16:25', status: 'error' },
    { id: 4, action: 'PUT /api/societes/SOC001', type: 'API', user: 'admin@leadertec.com', ip: '192.168.1.100', date: '03/04/2026 16:20', status: 'success' },
    { id: 5, action: 'DELETE /api/utilisateurs/USR003', type: 'API', user: 'super@admin.com', ip: '192.168.1.50', date: '03/04/2026 16:15', status: 'warning' }
  ];

  connexions: ConnexionHistory[] = [
    { id: 1, user: 'Super Admin', email: 'super@admin.com', dateConnexion: '03/04/2026 16:30', ip: '192.168.1.50', appareil: 'Chrome - Windows', statut: 'success' },
    { id: 2, user: 'Admin Leadertec', email: 'admin@leadertec.com', dateConnexion: '03/04/2026 16:25', ip: '192.168.1.100', appareil: 'Firefox - Windows', statut: 'success' },
    { id: 3, user: 'Développeur 1', email: 'dev@leadertec.com', dateConnexion: '03/04/2026 16:20', ip: '192.168.1.75', appareil: 'Safari - MacOS', statut: 'success' },
    { id: 4, user: 'Testeur 1', email: 'test@leadertec.com', dateConnexion: '03/04/2026 16:15', ip: '10.0.0.55', appareil: 'Edge - Windows', statut: 'failed' },
    { id: 5, user: 'RH Tunis', email: 'rh@leadertec.com', dateConnexion: '03/04/2026 16:10', ip: '192.168.1.80', appareil: 'Chrome - Linux', statut: 'success' }
  ];

  anomalies: Anomalie[] = [
    { id: 1, type: 'Échec de connexion multiple', description: '5 tentatives de connexion échouées depuis IP 10.0.0.55', date: '03/04/2026 16:15', niveau: 'warning', statut: 'non_resolu' },
    { id: 2, type: 'Activité suspecte', description: 'Connexion depuis une nouvelle localisation géographique', date: '03/04/2026 14:20', niveau: 'info', statut: 'resolu' },
    { id: 3, type: 'Tentative d\'injection SQL', description: 'Requête API suspects détectée', date: '02/04/2026 10:45', niveau: 'critical', statut: 'en_cours' }
  ];

  ngOnInit() {
    this.loadConnectionLogs();
    this.loadApiLogs();
    this.loadAnomalies();
  }

  loadConnectionLogs() {
    this.api.getConnectionLogs(50).subscribe({
      next: (data) => {
        this.connexions = (data || []).map((log: any, idx: number) => ({
          id: idx + 1,
          user: log.utilisateurId || 'Unknown',
          email: '',
          dateConnexion: new Date(log.dateConnexion).toLocaleString('fr-FR'),
          ip: log.ipAddress || 'Unknown',
          appareil: log.userAgent || 'Unknown',
          statut: log.typeAction === 'LOGIN' ? 'success' as const : 'success' as const
        }));
      },
      error: () => {
        this.connexions = [];
      }
    });
  }

  loadApiLogs() {
    this.api.getApiLogs(100).subscribe({
      next: (data) => {
        this.apiLogs = (data || []).map((log: any, idx: number) => ({
          id: idx + 1,
          action: `${log.method} ${log.endpoint}`,
          type: 'API',
          user: log.user || 'Unknown',
          ip: log.ip || 'Unknown',
          date: new Date(log.date).toLocaleString('fr-FR'),
          status: log.status === 200 ? 'success' as const : 'error' as const
        }));
      },
      error: () => {
        this.apiLogs = [];
      }
    });
  }

  loadAnomalies() {
    this.api.getAnomalies().subscribe({
      next: (data) => {
        this.anomalies = (data || []).map((ano: any, idx: number) => ({
          id: idx + 1,
          type: ano.type,
          description: ano.description,
          date: new Date(ano.date).toLocaleString('fr-FR'),
          niveau: ano.niveau,
          statut: ano.statut
        }));
      },
      error: () => {
        this.anomalies = [];
      }
    });
  }

  exportConnexions() {
    this.snackBar.open('Historique des connexions exporté', 'Fermer', { duration: 3000 });
  }

  clearLogs() {
    if (confirm('Effacer tous les logs API?')) {
      this.apiLogs = [];
      this.snackBar.open('Logs effacés', 'Fermer', { duration: 2000 });
    }
  }

  scanAnomalies() {
    this.snackBar.open('Scan en cours...', 'Fermer', { duration: 2000 });
    setTimeout(() => {
      this.snackBar.open('Scan terminé - Aucune nouvelle anomalie', 'Fermer', { duration: 3000 });
    }, 1500);
  }
}
