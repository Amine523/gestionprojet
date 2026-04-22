import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

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

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Surveillance Temps Réel</span>
            <div class="live-indicator">
              <span class="ping"></span>
              <span class="dot"></span>
            </div>
            <span class="badge badge-live">Système Live</span>
          </div>
          <h1 class="header-title">
            Nœuds <span class="gradient-text">& Performances.</span>
          </h1>
          <p class="header-subtitle">
            Analyse granulaire du trafic système, de la charge serveur et de la santé de l'écosystème.
          </p>
        </div>
      </header>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <div class="card metric-card">
          <p class="metric-label">Utilisateurs Actifs</p>
          <h3 class="metric-value">{{data.utilisateursActifs}}</h3>
          <div class="metric-footer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>En ligne maintenant</span>
          </div>
        </div>

        <div class="card metric-card">
          <p class="metric-label">Trafic API / min</p>
          <h3 class="metric-value">{{data.requetesApiMinute}}</h3>
          <div class="metric-footer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Haute Intensité</span>
          </div>
        </div>

        <div class="card metric-card">
          <p class="metric-label">Charge CPU</p>
          <h3 class="metric-value">{{data.cpu}}%</h3>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="data.cpu"></div>
          </div>
        </div>

        <div class="card metric-card" [class.alert]="data.alerts > 0">
          <p class="metric-label">Alertes Système</p>
          <h3 class="metric-value" [class.text-danger]="data.alerts > 0">{{data.alerts}}</h3>
          <div class="metric-footer" [class.text-danger]="data.alerts > 0">
            @if (data.alerts > 0) {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Attention Requise</span>
            } @else {
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
              <span>Système Sain</span>
            }
          </div>
        </div>
      </div>

      <div class="content-grid">
        <!-- Live Activity Stream -->
        <div class="card activity-card">
          <div class="card-header">
            <h3>Flux d'Activité Live</h3>
            <div class="sync-indicator">
              <span class="ping"></span>
              <span>Sync en cours</span>
            </div>
          </div>
          
          <div class="activity-list">
            @for (act of activities; track act.id) {
              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="16 18 22 12 16 6"/>
                    <polyline points="8 6 2 12 8 18"/>
                  </svg>
                </div>
                <div class="activity-info">
                  <p class="activity-action">{{act.action}}</p>
                  <p class="activity-ip">IP: {{act.ip}}</p>
                </div>
                <div class="activity-meta">
                  <p class="activity-time">{{act.time}}</p>
                  <p class="activity-latency">Latence: 12ms</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- System Resources Pulse -->
        <div class="card resources-card">
          <h3>Ressources Cluster</h3>
          
          <div class="resource-item">
            <div class="resource-header">
              <p class="resource-label">CPU NODE_01</p>
              <p class="resource-value">{{data.cpu}}%</p>
            </div>
            <div class="progress-bar">
              <div class="progress-fill gradient" [style.width.%]="data.cpu"></div>
            </div>
          </div>

          <div class="resource-item">
            <div class="resource-header">
              <p class="resource-label">MÉMOIRE CACHE</p>
              <p class="resource-value">{{data.memoire}}%</p>
            </div>
            <div class="progress-bar">
              <div class="progress-fill gradient-purple" [style.width.%]="data.memoire"></div>
            </div>
          </div>

          <div class="resource-status">
            <div class="status-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <p>Cluster sécurisé et optimisé. Aucun goulot d'étranglement détecté.</p>
          </div>
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
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      align-items: center;
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
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-live {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .live-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .live-indicator .ping {
      position: relative;
      display: inline-flex;
      width: 12px;
      height: 12px;
    }

    .live-indicator .ping::before {
      content: '';
      position: absolute;
      inset: 0;
      background: #10b981;
      border-radius: 50%;
      animation: ping 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .live-indicator .dot {
      position: relative;
      display: inline-flex;
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
    }

    @keyframes ping {
      75%, 100% {
        transform: scale(2);
        opacity: 0;
      }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #34d399, #10b981, #06b6d4);
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

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .metric-card {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .metric-card.alert {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .metric-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .metric-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      line-height: 1;
    }

    .metric-value.text-danger {
      color: #ef4444;
    }

    .metric-footer {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .metric-footer svg {
      width: 16px;
      height: 16px;
    }

    .metric-footer.text-danger {
      color: #ef4444;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #10b981;
      border-radius: 4px;
      transition: width var(--transition-base);
    }

    .progress-fill.gradient {
      background: linear-gradient(90deg, #10b981, #06b6d4);
    }

    .progress-fill.gradient-purple {
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }

    .activity-card {
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .card-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .sync-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .sync-indicator .ping {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      animation: ping 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    .activity-list {
      max-height: 500px;
      overflow-y: auto;
      padding: var(--space-lg);
    }

    .activity-list::-webkit-scrollbar {
      width: 6px;
    }

    .activity-list::-webkit-scrollbar-thumb {
      background: var(--color-border);
      border-radius: 3px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
      transition: all var(--transition-base);
    }

    .activity-item:hover {
      background: var(--color-bg);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: white;
      border: 2px solid var(--color-border);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      margin-right: var(--space-md);
      transition: all var(--transition-base);
    }

    .activity-item:hover .activity-icon {
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.2);
    }

    .activity-info {
      flex: 1;
    }

    .activity-action {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .activity-ip {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .activity-meta {
      text-align: right;
    }

    .activity-time {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .activity-latency {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .resources-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 400px;
      position: relative;
      overflow: hidden;
    }

    .resources-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 160px;
      height: 160px;
      background: rgba(16, 185, 129, 0.1);
      filter: blur(48px);
    }

    .resources-card h3 {
      margin: 0 0 var(--space-lg);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      position: relative;
      z-index: 1;
    }

    .resource-item {
      margin-bottom: var(--space-xl);
      position: relative;
      z-index: 1;
    }

    .resource-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--space-md);
    }

    .resource-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .resource-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
    }

    .resource-status {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding-top: var(--space-lg);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      z-index: 1;
    }

    .status-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #10b981;
    }

    .resource-status p {
      font-size: var(--font-size-xs);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .activity-icon {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .activity-item:hover {
      background: rgba(255, 255, 255, 0.02);
    }

    @media (max-width: 1024px) {
      .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminSurveillanceComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private intervalSub: any;
  
  data: SurveillanceData = { utilisateursActifs: 24, connexionsTempsReel: 18, requetesApiMinute: 156, notificationsRecues: 42, alerts: 0, cpu: 45, memoire: 62 };
  activities = [
    { id: 1, time: '16:23:30', action: 'Connexion utilisateur SOC_TN001_ADM', ip: '196.216.84.12' },
    { id: 2, time: '16:23:15', action: 'API /api/projets appelée', ip: '196.216.85.10' },
    { id: 3, time: '16:23:00', action: 'Notification envoyée', ip: '196.216.86.12' },
    { id: 4, time: '16:22:45', action: 'Modification rôle SuperAdmin', ip: '196.216.84.12' },
    { id: 5, time: '16:22:30', action: 'Sauvegarde DB réussie', ip: 'internal' },
  ];

  ngOnInit() {
    this.intervalSub = setInterval(() => {
      this.data.utilisateursActifs = Math.floor(Math.random() * 10) + 20;
      this.data.requetesApiMinute = Math.floor(Math.random() * 50) + 140;
      this.data.cpu = Math.floor(Math.random() * 30) + 35;
      this.data.memoire = Math.floor(Math.random() * 10) + 55;
    }, 3000);
  }

  ngOnDestroy() { if (this.intervalSub) clearInterval(this.intervalSub); }
}
