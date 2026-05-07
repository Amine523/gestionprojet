import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '@core/services/api.service';

interface DashboardData {
  TotalProjets: number;
  AvancementMoyen: number;
  TachesEnCours: number;
  TachesTerminees: number;
  TotalTaches: number;
  ProjetsActifs: number;
  ProjetsTermines: number;
  ProjetsEnRetard: number;
}

interface Projet {
  id?: string;
  nom?: string;
  description?: string;
  statut?: string;
  avancement?: string;
  dateDebut?: string;
  dateFin?: string;
}

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="client-dashboard">
      <!-- En-tête -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">
              <span class="greeting">👋 Bienvenue,</span>
              <span class="username">{{ userName }}</span>
            </h1>
            <p class="page-subtitle">Tableau de bord de vos projets en temps réel</p>
          </div>
          <div class="header-badge">
            <span class="badge-dot"></span>
            <span>Client Projet</span>
          </div>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ dashboardData?.TotalProjets ?? 0 }}</span>
            <span class="kpi-label">Projets totaux</span>
          </div>
          <div class="kpi-trend up">
            <span>{{ dashboardData?.ProjetsActifs ?? 0 }} actifs</span>
          </div>
        </div>

        <div class="kpi-card kpi-success">
          <div class="kpi-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ (dashboardData?.AvancementMoyen ?? 0) | number:'1.0-0' }}%</span>
            <span class="kpi-label">Avancement moyen</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar" [style.width.%]="dashboardData?.AvancementMoyen ?? 0"></div>
          </div>
        </div>

        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ dashboardData?.TachesEnCours ?? 0 }}</span>
            <span class="kpi-label">Tâches en cours</span>
          </div>
          <div class="kpi-trend neutral">
            <span>sur {{ dashboardData?.TotalTaches ?? 0 }} totales</span>
          </div>
        </div>

        <div class="kpi-card kpi-info">
          <div class="kpi-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="kpi-info">
            <span class="kpi-value">{{ dashboardData?.TachesTerminees ?? 0 }}</span>
            <span class="kpi-label">Tâches terminées</span>
          </div>
          <div class="kpi-trend up">
            <span>{{ dashboardData?.ProjetsTermines ?? 0 }} projets clôturés</span>
          </div>
        </div>
      </div>

      <!-- Projets récents -->
      <div class="section-grid">
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">📁 Mes Projets</h2>
            <a routerLink="/client/projets" class="see-all-link">Voir tous →</a>
          </div>

          @if (isLoading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Chargement des projets...</p>
            </div>
          } @else if (projets.length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
              <p>Aucun projet affecté pour le moment</p>
            </div>
          } @else {
            <div class="projets-list">
              @for (projet of projets.slice(0, 4); track projet.id) {
                <div class="projet-item" [routerLink]="['/client/projets', projet.id]">
                  <div class="projet-avatar">{{ getInitiales(projet.nom) }}</div>
                  <div class="projet-info">
                    <span class="projet-nom">{{ projet.nom || 'Projet sans nom' }}</span>
                    <span class="projet-desc">{{ projet.description?.substring(0, 60) || 'Aucune description' }}...</span>
                  </div>
                  <div class="projet-status">
                    <span class="status-badge" [class]="getStatutClass(projet.statut)">
                      {{ projet.statut || 'N/A' }}
                    </span>
                    <span class="projet-avancement">{{ projet.avancement || '0%' }}</span>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Alertes / Activité récente -->
        <div class="section-card">
          <div class="section-header">
            <h2 class="section-title">🔔 Activité récente</h2>
          </div>
          <div class="activity-list">
            <div class="activity-item">
              <div class="activity-dot dot-green"></div>
              <div class="activity-text">
                <span class="act-title">Projet {{ projets[0].nom || 'N/A' }}</span>
                <span class="act-subtitle">Avancement mis à jour</span>
              </div>
              <span class="act-time">Aujourd'hui</span>
            </div>
            <div class="activity-item">
              <div class="activity-dot dot-blue"></div>
              <div class="activity-text">
                <span class="act-title">Nouvelles tâches assignées</span>
                <span class="act-subtitle">{{ dashboardData?.TachesEnCours ?? 0 }} tâches en cours</span>
              </div>
              <span class="act-time">Cette semaine</span>
            </div>
            <div class="activity-item">
              <div class="activity-dot dot-orange"></div>
              <div class="activity-text">
                <span class="act-title">Rapport disponible</span>
                <span class="act-subtitle">Rapport d'avancement généré</span>
              </div>
              <span class="act-time">Hier</span>
            </div>
            @if (dashboardData && dashboardData.ProjetsEnRetard > 0) {
              <div class="activity-item">
                <div class="activity-dot dot-red"></div>
                <div class="activity-text">
                  <span class="act-title">⚠️ Projets en retard</span>
                  <span class="act-subtitle">{{ dashboardData.ProjetsEnRetard }} projet(s) nécessitent attention</span>
                </div>
                <span class="act-time">Alerte</span>
              </div>
            }
          </div>

          <!-- Actions rapides -->
          <div class="quick-actions">
            <h3 class="qa-title">Actions rapides</h3>
            <div class="qa-buttons">
              <a routerLink="/client/rapports" class="qa-btn qa-btn-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>
                Voir rapports
              </a>
              <a routerLink="/client/feedback" class="qa-btn qa-btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                Soumettre feedback
              </a>
              <a routerLink="/client/chat" class="qa-btn qa-btn-neutral">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg>
                Contacter l'équipe
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .client-dashboard {
      display: flex;
      flex-direction: column;
      gap: 28px;
      animation: fadeIn 0.4s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Header ── */
    .page-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%);
      border-radius: 18px;
      padding: 32px;
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .greeting { font-size: 16px; font-weight: 400; opacity: 0.85; }
    .username { font-size: 28px; font-weight: 700; }

    .page-subtitle {
      margin: 8px 0 0;
      opacity: 0.8;
      font-size: 14px;
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255,255,255,0.2);
      padding: 10px 20px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 600;
      backdrop-filter: blur(8px);
    }

    .badge-dot {
      width: 8px; height: 8px;
      background: #4ade80;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }

    /* ── KPI Grid ── */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
    }

    .kpi-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      transition: transform 0.2s, box-shadow 0.2s;
      border: 1px solid #f1f5f9;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }

    .kpi-icon {
      width: 52px; height: 52px;
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
    }

    .kpi-primary .kpi-icon { background: #eff6ff; color: #3b82f6; }
    .kpi-success .kpi-icon { background: #f0fdf4; color: #22c55e; }
    .kpi-warning .kpi-icon { background: #fffbeb; color: #f59e0b; }
    .kpi-info .kpi-icon { background: #f0f9ff; color: #06b6d4; }

    .kpi-value {
      font-size: 32px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }

    .kpi-label {
      font-size: 13px;
      color: #64748b;
      font-weight: 500;
      margin-top: 4px;
    }

    .kpi-trend {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;
      width: fit-content;
    }

    .kpi-trend.up { background: #f0fdf4; color: #16a34a; }
    .kpi-trend.neutral { background: #f8fafc; color: #64748b; }

    .progress-bar-wrap {
      height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;
    }

    .progress-bar {
      height: 100%; background: linear-gradient(90deg, #22c55e, #4ade80);
      border-radius: 3px; transition: width 0.6s ease;
    }

    /* ── Section Grid ── */
    .section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 900px) {
      .section-grid { grid-template-columns: 1fr; }
    }

    .section-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      border: 1px solid #f1f5f9;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }

    .see-all-link {
      font-size: 13px;
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .see-all-link:hover { color: #1d4ed8; }

    /* ── Projet Items ── */
    .projets-list { display: flex; flex-direction: column; gap: 12px; }

    .projet-item {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 14px;
      border-radius: 12px;
      border: 1px solid #f1f5f9;
      cursor: pointer;
      transition: all 0.2s;
    }

    .projet-item:hover {
      background: #f8fafc;
      border-color: #3b82f6;
      transform: translateX(4px);
    }

    .projet-avatar {
      width: 42px; height: 42px;
      border-radius: 10px;
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      color: white;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 14px;
      flex-shrink: 0;
    }

    .projet-info {
      flex: 1;
      min-width: 0;
      display: flex; flex-direction: column; gap: 2px;
    }

    .projet-nom {
      font-size: 14px; font-weight: 600; color: #0f172a;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .projet-desc {
      font-size: 12px; color: #94a3b8;
    }

    .projet-status {
      display: flex; flex-direction: column; align-items: flex-end; gap: 4px;
    }

    .status-badge {
      font-size: 11px; font-weight: 600;
      padding: 3px 10px; border-radius: 20px;
    }

    .status-actif { background: #f0fdf4; color: #16a34a; }
    .status-retard { background: #fef2f2; color: #dc2626; }
    .status-termin { background: #f0f9ff; color: #0891b2; }
    .status-defaut { background: #f8fafc; color: #64748b; }

    .projet-avancement {
      font-size: 13px; font-weight: 700; color: #3b82f6;
    }

    /* ── Loading / Empty ── */
    .loading-state, .empty-state {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 48px; gap: 16px;
      color: #94a3b8; text-align: center;
    }

    .spinner {
      width: 36px; height: 36px;
      border: 3px solid #e2e8f0;
      border-top-color: #3b82f6;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Activity ── */
    .activity-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 24px; }

    .activity-item {
      display: flex; align-items: flex-start; gap: 12px;
    }

    .activity-dot {
      width: 10px; height: 10px; border-radius: 50%; margin-top: 4px; flex-shrink: 0;
    }

    .dot-green { background: #22c55e; }
    .dot-blue { background: #3b82f6; }
    .dot-orange { background: #f59e0b; }
    .dot-red { background: #ef4444; }

    .activity-text {
      flex: 1; display: flex; flex-direction: column; gap: 2px;
    }

    .act-title { font-size: 13px; font-weight: 600; color: #0f172a; }
    .act-subtitle { font-size: 12px; color: #64748b; }
    .act-time { font-size: 11px; color: #94a3b8; white-space: nowrap; }

    /* ── Quick Actions ── */
    .quick-actions { border-top: 1px solid #f1f5f9; padding-top: 20px; }

    .qa-title {
      font-size: 13px; font-weight: 600; color: #64748b;
      text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;
    }

    .qa-buttons {
      display: flex; flex-wrap: wrap; gap: 8px;
    }

    .qa-btn {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 500;
      text-decoration: none; transition: all 0.2s;
      border: 1px solid transparent;
    }

    .qa-btn-primary {
      background: #eff6ff; color: #3b82f6; border-color: #bfdbfe;
    }
    .qa-btn-primary:hover { background: #3b82f6; color: white; }

    .qa-btn-secondary {
      background: #f0fdf4; color: #16a34a; border-color: #bbf7d0;
    }
    .qa-btn-secondary:hover { background: #16a34a; color: white; }

    .qa-btn-neutral {
      background: #f8fafc; color: #64748b; border-color: #e2e8f0;
    }
    .qa-btn-neutral:hover { background: #64748b; color: white; }
  `]
})
export class ClientDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  dashboardData: DashboardData | null = null;
  projets: Projet[] = [];
  isLoading = true;
  userName = '';

  private get apiBase() {
    return (this.api as any).baseUrl || '/api';
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.userName = user?.nom || user?.Nom || 'Client';
    const userId = user?.id || user?.Id || '';
    if (userId) {
      this.loadDashboard(userId);
      this.loadProjets(userId);
    } else {
      this.isLoading = false;
    }
  }

  private loadDashboard(userId: string) {
    this.http.get<DashboardData>(`${this.apiBase}/client-projet/dashboard/${userId}`)
      .subscribe({
        next: (data) => this.dashboardData = data,
        error: () => this.dashboardData = {
          TotalProjets: 0, AvancementMoyen: 0,
          TachesEnCours: 0, TachesTerminees: 0, TotalTaches: 0,
          ProjetsActifs: 0, ProjetsTermines: 0, ProjetsEnRetard: 0
        }
      });
  }

  private loadProjets(userId: string) {
    this.http.get<Projet[]>(`${this.apiBase}/client-projet/projets/${userId}`)
      .subscribe({
        next: (data) => {
          this.projets = data || [];
          this.isLoading = false;
        },
        error: () => {
          this.projets = [];
          this.isLoading = false;
        }
      });
  }

  getInitiales(nom?: string): string {
    if (!nom) return '?';
    return nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatutClass(statut?: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('cours') || s.includes('actif')) return 'status-badge status-actif';
    if (s.includes('retard') || s.includes('delay')) return 'status-badge status-retard';
    if (s.includes('termin') || s.includes('done')) return 'status-badge status-termin';
    return 'status-badge status-defaut';
  }
}
