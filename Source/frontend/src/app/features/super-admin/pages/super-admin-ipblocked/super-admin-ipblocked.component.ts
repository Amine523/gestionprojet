import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface BlockedIP {
  id: string;
  ip: string;
  raison: string;
  dateBlocage: string;
  statut: 'bloqué' | 'debloqué';
}

@Component({
  selector: 'app-super-admin-ipblocked',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Sécurité Réseau</span>
          </div>
          <h1 class="header-title">
            IPs <span class="gradient-text">Bloquées.</span>
          </h1>
          <p class="header-subtitle">
            Gestion des adresses IP bloquées.
          </p>
        </div>
        <div class="header-actions">
          <div class="stats-card">
            <div class="stat-item">
              <p class="stat-label">Total Bloquées</p>
              <p class="stat-value text-primary">{{blockedIps.length}}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <p class="stat-label">Actif</p>
              <p class="stat-value text-primary">{{activeBlockedCount}}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Card -->
      <div class="card">
        <div class="card-header">
          <h3>Bloquer une nouvelle IP</h3>
        </div>
        <div class="block-form">
          <div class="form-field">
            <label>Adresse IP</label>
            <input type="text" class="form-input" [(ngModel)]="newIp" placeholder="192.168.1.100">
          </div>
          <div class="form-field">
            <label>Raison</label>
            <input type="text" class="form-input" [(ngModel)]="newRaison" placeholder="Raison du blocage">
          </div>
          <button class="btn btn-danger" (click)="bloquerIp()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Bloquer
          </button>
        </div>
      </div>

      <!-- IPs List -->
      <div class="card">
        <div class="card-header">
          <h3>Liste des IPs Bloquées</h3>
        </div>
        <div class="ips-list">
          @for (ip of blockedIps; track ip.id) {
            <div class="ip-card" [class.unblocked]="ip.statut === 'debloqué'">
              <div class="ip-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                  <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                  <line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
              </div>
              <div class="ip-details">
                <strong>{{ip.ip}}</strong>
                <span class="text-muted">{{ip.raison}} - {{ip.dateBlocage}}</span>
              </div>
              <span class="badge" [class.blocked]="ip.statut === 'bloqué'" [class.unblocked]="ip.statut === 'debloqué'">{{ip.statut}}</span>
              @if (ip.statut === 'bloqué') {
                <button class="btn-icon btn-success" (click)="debloquerIp(ip)" title="Débloquer">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </button>
              }
            </div>
          }
          @if (blockedIps.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <p class="empty-state-text">Aucune IP bloquée</p>
            </div>
          }
        </div>
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
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
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
      background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
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
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge.blocked {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge.unblocked {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #f87171, #fb923c, #fbbf24);
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

    .header-actions {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      color: white;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .text-primary {
      color: #ef4444;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
    }

    .card-header {
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .block-form {
      display: flex;
      gap: var(--space-md);
      align-items: flex-end;
    }

    .form-field {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-field label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      padding: var(--space-md);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
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

    .btn-success {
      color: #10b981;
    }

    .btn-success:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    .ips-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .ip-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: all var(--transition-base);
    }

    .ip-card.unblocked {
      opacity: 0.6;
    }

    .ip-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #ef4444, #f97316);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
    }

    .ip-card.unblocked .ip-icon {
      background: linear-gradient(135deg, #10b981, #06b6d4);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }

    .ip-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .ip-details strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .text-muted {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
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
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .ip-card {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .block-form {
        flex-direction: column;
      }

      .ip-card {
        flex-wrap: wrap;
      }
    }
  `]
})
export class SuperAdminIpBlockedComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  blockedIps: BlockedIP[] = [];
  newIp = '';
  newRaison = '';

  get activeBlockedCount(): number {
    return this.blockedIps.filter(ip => ip.statut === 'bloqué').length;
  }

  ngOnInit() { this.loadBlockedIps(); }

  loadBlockedIps() {
    this.api.getBlockedIps().subscribe({
      next: (data) => {
        this.blockedIps = (data || []).map((ip: any) => ({
          id: ip.id,
          ip: ip.ipAddress,
          raison: ip.raison,
          dateBlocage: new Date(ip.dateBlocage).toLocaleDateString('fr-FR'),
          statut: ip.statut === 'bloque' ? 'bloqué' as const : 'debloqué' as const
        }));
      },
      error: () => {
        this.blockedIps = [];
      }
    });
  }

  bloquerIp() {
    if (this.newIp) {
      const data = {
        id: 'BLK_' + Date.now().toString(36).toUpperCase(),
        ipAddress: this.newIp,
        raison: this.newRaison,
        dateBlocage: new Date(),
        statut: 'bloque'
      };

      this.api.blockIp(data).subscribe({
        next: () => {
          this.blockedIps.unshift({ id: data.id, ip: this.newIp, raison: this.newRaison, dateBlocage: new Date().toLocaleDateString('fr-FR'), statut: 'bloqué' });
          this.snackBar.open(`IP ${this.newIp} bloquée`, 'Fermer', { duration: 3000 });
          this.newIp = ''; this.newRaison = '';
        },
        error: () => {
          this.snackBar.open(`Erreur lors du blocage`, 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  debloquerIp(ip: BlockedIP) {
    ip.statut = 'debloqué';
    this.snackBar.open(`IP ${ip.ip} débloquée`, 'Fermer', { duration: 3000 });
  }
}
