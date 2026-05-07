import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';

import { FormsModule } from '@angular/forms';
import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, FormsModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Plateforme de Gestion RH</span>
            <span class="badge badge-success">
              <span class="status-dot"></span>
              En ligne
            </span>
          </div>
          <h1 class="header-title">
            DASHBOARD <span class="gradient-text">RESSOURCES HUMAINES</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • Vue d'ensemble de l'effectif, de la présence et des indicateurs de performance RH.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="analyserRH()" [disabled]="aiLoading" class="btn btn-primary" [class.btn-disabled]="aiLoading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
              <path d="M12 12 2.1 12.05"/>
              <path d="M12 12 12 21.9"/>
            </svg>
            Analyste IA
          </button>
          <button (click)="loadData()" class="btn-icon btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <app-metric-card
          title="EFFECTIF TOTAL"
          [value]="stats.totalEmployes.toString()"
          icon="bi-people-fill"
          color="indigo"
          [trend]="'Équipe complète'">
        </app-metric-card>

        <app-metric-card
          title="PRÉSENTS AUJOURD'HUI"
          [value]="stats.presents.toString()"
          icon="bi-person-check-fill"
          color="emerald"
          [trend]="tauxPresence + '% de présence'"
          [isPositive]="tauxPresence > 80">
        </app-metric-card>

        <app-metric-card
          title="CONGÉS EN ATTENTE"
          [value]="stats.congesEnAttente.toString()"
          icon="bi-calendar-event"
          color="amber"
          [trend]="stats.congesEnAttente > 0 ? 'À traiter' : 'Tout à jour'"
          [isPositive]="stats.congesEnAttente === 0">
        </app-metric-card>

        <app-metric-card
          title="RECRUTEMENT"
          [value]="stats.candidatures.toString()"
          icon="bi-briefcase-fill"
          color="purple"
          [trend]="'Candidatures actives'">
        </app-metric-card>
      </div>

      <!-- AI Insights Panel -->
      @if (aiLoading || aiInsights) {
        <div class="card card-ai animate-in slide-in-from-top duration-500">
          <div class="card-header">
            <div class="ai-header">
              <div class="ai-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                  <path d="M12 12 2.1 12.05"/>
                  <path d="M12 12 12 21.9"/>
                </svg>
              </div>
              <div class="ai-info">
                <h3>Analyse Cognitive RH</h3>
                <p class="ai-subtitle">Propulsé par Llama 3.2</p>
              </div>
            </div>
          </div>

          @if (aiLoading) {
            <div class="ai-loading">
              <div class="spinner"></div>
              <p>Synthèse des données en cours...</p>
            </div>
          } @else {
            <div class="ai-content markdown-body" [innerHTML]="aiInsights"></div>
          }
        </div>
      }

      <div class="dashboard-grid">
        <!-- Recruitment Funnel -->
        <div class="card">
          <div class="card-header">
            <h3>État du Recrutement</h3>
          </div>
          <div class="recruitment-stats">
            <div class="stat-item">
              <span class="stat-label">Nouveaux Candidats</span>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="100"></div>
              </div>
              <span class="stat-value">{{recrutementStats.nouveaux}}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">En Entretien</span>
              <div class="progress-bar">
                <div class="progress-fill warning" [style.width.%]="(recrutementStats.entretiens / (recrutementStats.nouveaux || 1)) * 100"></div>
              </div>
              <span class="stat-value">{{recrutementStats.entretiens}}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Acceptés</span>
              <div class="progress-bar">
                <div class="progress-fill success" [style.width.%]="(recrutementStats.acceptes / (recrutementStats.nouveaux || 1)) * 100"></div>
              </div>
              <span class="stat-value">{{recrutementStats.acceptes}}</span>
            </div>
          </div>
        </div>

         <!-- Activity Timeline -->
        <div class="card card-activity">
          <div class="card-header">
            <h3>Historique des Activités</h3>
            <div class="header-filters">
               <div class="search-box">
                 <input type="text" [(ngModel)]="activitySearch" placeholder="Filtrer...">
               </div>
            </div>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Action & Ressource</th>
                  <th>Utilisateur</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                @for (act of paginatedActivities; track act.id) {
                  <tr class="hover-lift">
                    <td>
                      <span class="type-badge" [ngClass]="act.type">
                        {{act.type === 'presence' ? 'Présence' : (act.type === 'recrutement' ? 'Recrutement' : 'Congé')}}
                      </span>
                    </td>
                    <td>
                      <div class="activity-info">
                        <span class="activity-title">{{act.title}}</span>
                      </div>
                    </td>
                    <td><span class="user-tag">{{act.user}}</span></td>
                    <td>{{act.time | date:'dd/MM HH:mm'}}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="4" class="empty-state">Aucune activité récente.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <!-- Pagination -->
          <div class="pagination-container">
            <div class="pagination-info">Page {{activityPage}} sur {{totalActivityPages}}</div>
            <div class="pagination-controls">
              <button class="btn-page" [disabled]="activityPage === 1" (click)="activityPage = activityPage - 1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button class="btn-page" [disabled]="activityPage === totalActivityPages" (click)="activityPage = activityPage + 1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 1.5rem;
      padding: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .dashboard-header::after {
      content: '';
      position: absolute;
      top: -10%;
      right: -5%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary { background: rgba(99, 102, 241, 0.2); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.3); }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 4px;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;
    }

    .gradient-text {
      background: linear-gradient(to right, #6366f1, #a855f7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      max-width: 600px;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      z-index: 1;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: white;
      color: #0f172a;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .btn-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 1.25rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-header h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 1.5rem;
    }

    .recruitment-stats {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: #64748b;
    }

    .progress-bar {
      height: 0.5rem;
      background: #f1f5f9;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #6366f1;
      border-radius: 9999px;
    }

    .progress-fill.warning { background: #f59e0b; }
    .progress-fill.success { background: #10b981; }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      align-self: flex-end;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .activity-item {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
    }

    .activity-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f1f5f9;
      color: #64748b;
    }

    .activity-icon.conge { background: #fef3c7; color: #d97706; }
    .activity-icon.recrutement { background: #f3e8ff; color: #9333ea; }
    .activity-icon.presence { background: #d1fae5; color: #059669; }

    .activity-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .activity-meta {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0.25rem 0 0;
    }

     .table-container {
      margin-top: 1rem;
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }

    .data-table th {
      text-align: left;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      font-size: 0.75rem;
      border-bottom: 1px solid #e2e8f0;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
    }

    .hover-lift:hover {
      background: #f8fafc;
      transform: translateX(4px);
      transition: all 0.2s;
    }

    .type-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .type-badge.presence { background: #d1fae5; color: #059669; }
    .type-badge.recrutement { background: #f3e8ff; color: #9333ea; }
    .type-badge.conge { background: #fef3c7; color: #d97706; }

    .user-tag {
      font-weight: 600;
      color: #6366f1;
    }

    .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid #e2e8f0;
    }

    .pagination-info {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
    }

    .pagination-controls {
      display: flex;
      gap: 0.5rem;
    }

    .btn-page {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      background: white;
      cursor: pointer;
    }

    .btn-page:disabled { opacity: 0.5; cursor: not-allowed; }

    .header-filters {
      display: flex;
      gap: 1rem;
    }

    .search-box input {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: 1px solid #e2e8f0;
      font-size: 0.875rem;
      outline: none;
    }

    .activity-title { font-weight: 600; }

    @media (max-width: 1024px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class RhDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);

  societeId = '';
  societeNom = '';

  stats = { totalEmployes: 0, presents: 0, congesEnAttente: 0, candidatures: 0 };
  recrutementStats = { nouveaux: 0, entretiens: 0, acceptes: 0 };
  activities: any[] = [];
  tauxPresence = 0;

  aiLoading = false;
  aiInsights: string | null = null;

  // Activity Pagination
  activityPage = 1;
  activityPageSize = 4;
  activitySearch = '';

  get filteredActivities() {
    return this.activities.filter(a => 
      !this.activitySearch || a.title.toLowerCase().includes(this.activitySearch.toLowerCase()) ||
      a.user.toLowerCase().includes(this.activitySearch.toLowerCase())
    );
  }

  get totalActivityPages() {
    return Math.ceil(this.filteredActivities.length / this.activityPageSize) || 1;
  }

  get paginatedActivities() {
    const start = (this.activityPage - 1) * this.activityPageSize;
    return this.filteredActivities.slice(start, start + this.activityPageSize);
  }

  ngOnInit() {
    this.societeId = this.api.getCurrentSocieteId();
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    // 1. Stats de présence réelles via Dashboard/RH-Stats
    this.api.getRHStats(this.societeId).subscribe({
      next: (data) => {
        this.stats.totalEmployes = data.totalEmployes || 0;
        this.stats.presents = data.employesPresents || 0;
        this.stats.congesEnAttente = data.demandesCongesEnAttente || 0;
        this.tauxPresence = data.tauxPresence || 0;
      }
    });

    // 2. Stats de recrutement réelles
    this.api.getCandidaturesBySociete(this.societeId).subscribe({
      next: (data) => {
        this.stats.candidatures = data.length;
        this.recrutementStats.nouveaux = data.filter((c: any) => 
          ['NOUVEAU', 'EN ATTENTE', 'EN_ATTENTE'].includes((c.statut || '').toUpperCase())
        ).length;
        this.recrutementStats.entretiens = data.filter((c: any) => 
          (c.statut || '').toUpperCase().includes('ENTRETIEN') || (c.statut || '').toUpperCase().includes('PLANIFIE')
        ).length;
        this.recrutementStats.acceptes = data.filter((c: any) => 
          (c.statut || '').toUpperCase().includes('ACCEPTE')
        ).length;
      }
    });

    // 3. Activités récentes filtrées pour la société
    this.api.getActiviteRecente(20, this.societeId).subscribe({
      next: (data) => {
        this.activities = (data || []).map((a: any) => ({
          id: a.id || Math.random().toString(36).substr(2, 9),
          title: `${a.action || 'Action'} sur ${a.nom || 'ressource'}`,
          time: a.date || new Date(),
          user: a.utilisateur || 'Système',
          type: (a.type || '').toLowerCase().includes('utilisateur') ? 'presence' : 
                ((a.type || '').toLowerCase().includes('candidature') ? 'recrutement' : 'conge')
        })).sort((a: any, b: any) => new Date(b.time).getTime() - new Date(a.time).getTime());
      }
    });
  }

  async analyserRH() {
    this.aiLoading = true;
    this.aiInsights = null;
    
    const context = `
      SOCIÉTÉ: ${this.societeNom}
      INDICATEURS:
      - Effectif total: ${this.stats.totalEmployes}
      - Présence aujourd'hui: ${this.stats.presents} (${this.tauxPresence}%)
      - Demandes de congés en attente: ${this.stats.congesEnAttente}
      - Pipeline Recrutement: ${this.stats.candidatures} candidats, ${this.recrutementStats.entretiens} en cours.
    `;

    const prompt = `Agis en tant qu'expert en ressources humaines. Analyse ces chiffres réels et propose 3 recommandations stratégiques. Sois précis et utilise un ton professionnel.`;

    try {
      const res = await this.aiService.generateResponse(prompt, context).toPromise();
      this.aiInsights = String(marked.parse(res || "L'analyse n'a pas pu être générée."));
    } catch (e) {
      this.aiInsights = "Une erreur est survenue lors de la connexion à l'intelligence artificielle.";
    } finally {
      this.aiLoading = false;
    }
  }
}
