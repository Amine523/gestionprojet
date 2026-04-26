import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Centre de Commande RH v4.0</span>
            <span class="badge badge-success">
              <span class="status-dot"></span>
              Actif
            </span>
          </div>
          <h1 class="header-title">
            DASHBOARD <span class="gradient-text">INTELLIGENCE RH</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • Suivi en temps réel de la performance du capital humain, des indicateurs de recrutement et de la santé organisationnelle.
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
          <button (click)="loadData()" class="btn-icon btn-ghost btn-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Critical Metrics Grid -->
      <div class="metrics-grid">
        <app-metric-card
          title="EFFECTIF TOTAL"
          [value]="stats.totalEmployes.toString()"
          icon="bi-people-fill"
          color="indigo"
          [trend]="'+4.2%'"
          [isPositive]="true">
        </app-metric-card>

        <app-metric-card
          title="PRÉSENTS AUJOURD'HUI"
          [value]="stats.presents.toString()"
          icon="bi-person-check-fill"
          color="emerald"
          [trend]="tauxPresence + '% Taux'"
          [isPositive]="true">
        </app-metric-card>

        <app-metric-card
          title="DEMANDES DE CONGÉS"
          [value]="stats.congesEnAttente.toString()"
          icon="bi-calendar-event"
          color="amber"
          [trend]="'Attention Urgente'"
          [isPositive]="false">
        </app-metric-card>

        <app-metric-card
          title="TURNOVER DU PERSONNEL"
          [value]="turnover + '%'"
          icon="bi-arrow-repeat"
          color="rose"
          [trend]="stats.absences + ' Absences'"
          [isPositive]="false">
        </app-metric-card>
      </div>

      <!-- AI Insights Panel -->
      @if (aiLoading || aiInsights) {
        <div class="card card-ai">
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
                <h3>Analyse Cognitive</h3>
                <p class="ai-subtitle">Moteur Stratégique Llama 3.2</p>
              </div>
            </div>
          </div>

          @if (aiLoading) {
            <div class="ai-loading">
              <div class="spinner"></div>
              <p>Synthèse des données RH...</p>
            </div>
          } @else {
            <div class="ai-content" [innerHTML]="aiInsights"></div>
          }
        </div>
      }

      <div class="dashboard-grid">
        <!-- Activity Timeline -->
        <div class="card card-activity">
          <div class="card-header">
            <h3>Activité en Temps Réel</h3>
            <span class="badge badge-gray">10 derniers événements</span>
          </div>
          <div class="activity-list">
            @for (act of activities; track act.id) {
              <div class="activity-item">
                <div class="activity-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="activity-details">
                  <p class="activity-title">{{act.title.split(': ')[1]}}</p>
                  <p class="activity-meta">{{act.time}}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Heatmap & Performance -->
        <div class="sidebar">
          <div class="card">
            <div class="card-header">
              <h3>Matrice de Présence</h3>
            </div>
            <div class="heatmap-grid">
              @for (day of heatmapDays; track day.date) {
                <div [style.background-color]="getHeatmapColor(day.level)" 
                     class="heatmap-cell"></div>
              }
            </div>
            <div class="heatmap-legend">
              <span>Faible</span>
              <div class="legend-scale">
                <div class="scale-item"></div>
                <div class="scale-item"></div>
                <div class="scale-item"></div>
                <div class="scale-item"></div>
              </div>
              <span>Optimal</span>
            </div>
          </div>

          <div class="card card-metric">
            <h3>Vélocité de Recrutement</h3>
            <div class="metric-value">
              <span class="metric-number">{{delaiMoyenRecrutement}}</span>
              <span class="metric-unit">Jours en Moyenne</span>
            </div>
            <p class="metric-description">
              Temps moyen pour pourvoir les postes ouverts sur toutes les offres actives.
            </p>
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
      background: radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%);
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
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-gray {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #f59e0b, #f97316);
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
      position: relative;
      z-index: 1;
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

    .btn-primary {
      background: white;
      color: #0f172a;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
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
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .card-ai {
      position: relative;
      overflow: hidden;
    }

    .ai-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .ai-icon {
      width: 48px;
      height: 48px;
      background: rgba(245, 158, 11, 0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }

    .ai-info h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .ai-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-xs) 0 0;
    }

    .ai-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      gap: var(--space-md);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(245, 158, 11, 0.1);
      border-top-color: #f59e0b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .ai-loading p {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .ai-content {
      color: var(--color-text);
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: all var(--transition-base);
    }

    .activity-item:hover {
      background: var(--color-bg);
      border-color: var(--color-border);
    }

    .activity-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      flex-shrink: 0;
    }

    .activity-item:hover .activity-icon {
      transform: scale(1.1);
    }

    .activity-details {
      flex: 1;
    }

    .activity-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .activity-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .heatmap-cell {
      aspect-ratio: 1;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all var(--transition-base);
      cursor: pointer;
    }

    .heatmap-cell:hover {
      transform: scale(1.1);
    }

    .heatmap-legend {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .heatmap-legend span {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .legend-scale {
      display: flex;
      gap: var(--space-xs);
    }

    .scale-item {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .scale-item:nth-child(1) { background: #f1f5f9; }
    .scale-item:nth-child(2) { background: #bae6fd; }
    .scale-item:nth-child(3) { background: #38bdf8; }
    .scale-item:nth-child(4) { background: #0284c7; }

    .card-metric {
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: white;
      box-shadow: var(--shadow-lg), rgba(245, 158, 11, 0.2);
    }

    .card-metric h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-md);
    }

    .metric-value {
      display: flex;
      align-items: baseline;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .metric-number {
      font-size: var(--font-size-6xl);
      font-weight: var(--font-weight-bold);
      line-height: 1;
    }

    .metric-unit {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .metric-description {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.7);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .activity-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .activity-title {
      color: var(--color-text);
    }

    :host-context(.dark) .activity-meta {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .heatmap-cell {
      border-color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .scale-item:nth-child(1) { background: rgba(255, 255, 255, 0.1); }
    :host-context(.dark) .scale-item:nth-child(2) { background: rgba(56, 189, 248, 0.5); }
    :host-context(.dark) .scale-item:nth-child(3) { background: #38bdf8; }
    :host-context(.dark) .scale-item:nth-child(4) { background: #0284c7; }

    :host-context(.dark) .activity-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RhDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);

  societeId = '';
  societeNom = '';

  stats = { totalEmployes: 0, presents: 0, congesEnAttente: 0, absences: 0, tauxAbsent: 0 };
  activities: any[] = [];
  
  delaiMoyenRecrutement = 0;
  turnover = 0;
  tauxPresence = 0;
  heatmapDays: any[] = [];

  aiLoading = false;
  aiInsights: string | null = null;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = this.api.getCurrentSocieteId();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
    this.generateHeatmap();
  }

  loadData() {
    this.api.getRHStats(this.societeId).subscribe({
      next: (data) => {
        this.stats.totalEmployes = data.totalEmployes || 0;
        this.stats.absences = data.employesAbsents || 0;
        this.stats.presents = data.employesPresents || 0;
        this.stats.congesEnAttente = data.demandesCongesEnAttente || 0;
        this.stats.tauxAbsent = 100 - (data.tauxPresence || 0);
        this.tauxPresence = data.tauxPresence || 0;
        
        this.turnover = data.turnover || 8.5; 
      },
      error: () => {
        // Données par défaut si l'API échoue
        this.stats.totalEmployes = 24;
        this.stats.absences = 2;
        this.stats.presents = 22;
        this.stats.congesEnAttente = 5;
        this.stats.tauxAbsent = 8;
        this.tauxPresence = 92;
        this.turnover = 8.5;
      }
    });

    this.api.getCandidaturesBySociete(this.societeId).subscribe(societeCandidats => {
      const acceptedCandidats = societeCandidats.filter((c: any) => c.statut === 'Accepté');
      if (acceptedCandidats.length > 0) {
        const delays = acceptedCandidats.map((c: any) => {
          const start = new Date(c.dateCandidature || Date.now()).getTime();
          const end = c.dateEntretien ? new Date(c.dateEntretien).getTime() : new Date().getTime();
          return (end - start) / (1000 * 3600 * 24);
        });
        this.delaiMoyenRecrutement = Math.max(1, Math.round(delays.reduce((a:number, b:number) => a + b, 0) / delays.length));
      } else {
        this.delaiMoyenRecrutement = 12;
      }
    });

    this.api.getEmployesBySociete(this.societeId).subscribe(employes => {
      const employesMap: { [id: string]: boolean } = {};
      employes.forEach((e: any) => employesMap[e.id || e.Id] = true);

      this.api.getPointages().subscribe({
        next: (pts) => {
          const societePts = (pts || []).filter((p: any) => employesMap[p.utilisateurId || p.UtilisateurId]);
          if (societePts.length > 0) {
            this.activities = societePts.slice(0, 10).map((p: any) => ({
              id: p.id || 'act_'+Math.random(),
              title: `Pointage: ${p.utilisateurNom || 'Utilisateur'}`,
              time: p.heureDebut || p.HeureEntree || '--:--',
              type: 'pointage'
            }));
          } else {
            // Données par défaut
            this.activities = [
              { id: 1, title: 'Pointage: Ahmed Benali', time: '08:00', type: 'pointage' },
              { id: 2, title: 'Pointage: Sara Karoui', time: '08:15', type: 'pointage' },
              { id: 3, title: 'Pointage: Mohamed Salah', time: '08:30', type: 'pointage' },
              { id: 4, title: 'Pointage: Fatima Zahra', time: '08:45', type: 'pointage' },
              { id: 5, title: 'Pointage: Youssef Amrani', time: '09:00', type: 'pointage' }
            ];
          }
        },
        error: () => {
          this.activities = [
            { id: 1, title: 'Pointage: Ahmed Benali', time: '08:00', type: 'pointage' },
            { id: 2, title: 'Pointage: Sara Karoui', time: '08:15', type: 'pointage' },
            { id: 3, title: 'Pointage: Mohamed Salah', time: '08:30', type: 'pointage' }
          ];
        }
      });
    });
  }

  generateHeatmap() {
    const days = [];
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      days.push({
        date: date.toLocaleDateString(),
        count: Math.floor(Math.random() * 20) + 80,
        level: Math.floor(Math.random() * 4) + 1
      });
    }
    this.heatmapDays = days;
  }

  getHeatmapColor(level: number): string {
    const colors = ['#f1f5f9', '#bae6fd', '#38bdf8', '#0284c7', '#0369a1'];
    return colors[level] || colors[0];
  }

  async analyserRH() {
    this.aiLoading = true;
    this.aiInsights = null;
    
    const payload = {
      totalEmployes: this.stats.totalEmployes,
      presents: this.stats.presents,
      absences: this.stats.absences,
      congesEnAttente: this.stats.congesEnAttente,
      turnover: this.turnover,
      tauxPresence: this.tauxPresence,
      delaiMoyenRecrutement: this.delaiMoyenRecrutement
    };

    this.aiService.getRhInsights(payload).subscribe({
      next: async (res) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "L'IA n'a pas pu analyser ces données.";
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = "Erreur lors de la connexion à l'IA.";
        this.aiLoading = false;
      }
    });
  }
}

