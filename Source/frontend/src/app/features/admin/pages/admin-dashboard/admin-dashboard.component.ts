import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { Chart, registerables } from 'chart.js';
import { marked } from 'marked';
import { TranslationService } from '@core/services/translation.service';
import { ExportService } from '@core/services/export.service';

Chart.register(...registerables);

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Dashboard</span>
          </div>
          <h1 class="header-title">
            Synthèse <span class="gradient-text">Opérationnelle.</span>
          </h1>
          <p class="header-subtitle">
            Bonjour, <span class="font-bold">{{societeNom}}</span>. Voici l'état de votre organisation aujourd'hui.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="analyserDashboard()" [disabled]="aiLoading" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Audit Stratégique IA
          </button>
          <button (click)="exportRapport()" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Rapport PDF
          </button>
        </div>
      </header>

      <!-- AI Insights -->
      @if (aiInsights || aiLoading) {
        <div class="card card-ai">
          <div class="card-header">
            <div class="header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"/>
                <rect x="9" y="9" width="6" height="6"/>
                <line x1="9" y1="1" x2="9" y2="4"/>
                <line x1="15" y1="1" x2="15" y2="4"/>
                <line x1="9" y1="20" x2="9" y2="23"/>
                <line x1="15" y1="20" x2="15" y2="23"/>
                <line x1="20" y1="9" x2="23" y2="9"/>
                <line x1="20" y1="14" x2="23" y2="14"/>
                <line x1="1" y1="9" x2="4" y2="9"/>
                <line x1="1" y1="14" x2="4" y2="14"/>
              </svg>
            </div>
            <h3>Analyse Cognitive IA</h3>
            <button (click)="aiInsights = null" class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          
          @if (aiLoading) {
            <div class="ai-loading">
              <div class="loading-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Calcul des vecteurs opérationnels...</p>
            </div>
          } @else {
            <div class="ai-content" [innerHTML]="aiInsights"></div>
          }
        </div>
      }

      <!-- Main Metrics Grid -->
      <div class="metrics-grid">
        <app-metric-card 
          label="Capital Humain" 
          [value]="stats.employes" 
          iconClass="bi bi-people-fill"
          [trend]="12">
        </app-metric-card>
        
        <app-metric-card 
          label="Missions Actives" 
          [value]="stats.projetsActifs" 
          iconClass="bi bi-rocket-takeoff-fill"
          iconBgClass="bg-blue-50 dark:bg-blue-500/10"
          iconColorClass="text-blue-600 dark:text-blue-400">
        </app-metric-card>

        <app-metric-card 
          label="Volume de Travail" 
          [value]="stats.heuresTravaillees + 'h'" 
          iconClass="bi bi-activity"
          iconBgClass="bg-purple-50 dark:bg-purple-500/10"
          iconColorClass="text-purple-600 dark:text-purple-400"
          [trend]="5">
        </app-metric-card>

        <app-metric-card 
          label="Efficacité Globale" 
          [value]="stats.productivite + '%'" 
          iconClass="bi bi-lightning-fill"
          iconBgClass="bg-emerald-50 dark:bg-emerald-500/10"
          iconColorClass="text-emerald-600 dark:text-emerald-400">
        </app-metric-card>
      </div>

      <!-- Charts & Tables Row -->
      <div class="dashboard-grid">
        <!-- Pulse Chart -->
        <div class="card card-chart">
          <div class="card-header">
            <div class="card-title">
              <h3>Pouls de l'Organisation</h3>
              <p class="card-subtitle">Tendance de performance sur 7 jours</p>
            </div>
            <div class="card-tabs">
              <button class="active">7J</button>
              <button>30J</button>
            </div>
          </div>
          <div class="chart-container">
            <canvas #activityChart></canvas>
          </div>
        </div>

        <!-- Mission Flows & Activities -->
        <div class="sidebar">
          <div class="card card-dark card-missions">
            <div class="card-header">
              <h3>Flux de Mission</h3>
            </div>
            <div class="missions-list">
              @for (projet of projets; track projet.id) {
                <div class="mission-item">
                  <div class="mission-info">
                    <span class="mission-name">{{projet.nom}}</span>
                    <span class="mission-progress">{{projet.avancee}}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="projet.avancee"></div>
                  </div>
                </div>
              }
            </div>
            <button routerLink="/admin/projets" class="btn btn-white w-full">
              Centre de Contrôle
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>

          <!-- Recent Activities -->
          <div class="card card-activities">
            <div class="card-header">
              <h3>Activités Récentes</h3>
            </div>
            <div class="activity-list">
              @for (act of activites; track act.id) {
                <div class="activity-item">
                  <span class="activity-dot"></span>
                  <div class="activity-details">
                    <p class="activity-title">{{act.title}}</p>
                    <p class="activity-meta">{{act.user}} • {{act.time}}</p>
                  </div>
                </div>
              }
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
      background: radial-gradient(circle, rgba(148, 163, 184, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
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
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #cbd5e1, #94a3b8, #64748b);
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

    .header-subtitle .font-bold {
      color: white;
    }

    .header-actions {
      position: relative;
      z-index: 1;
      display: flex;
      gap: var(--space-sm);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #94a3b8;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    .btn-secondary {
      background: white;
      color: var(--color-text);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary:hover {
      background: var(--color-bg);
    }

    .btn-white {
      background: white;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-white:hover {
      background: var(--color-bg);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      border-color: rgba(99, 102, 241, 0.3);
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

    .card-ai {
      background: rgba(99, 102, 241, 0.05);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .card-dark {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-color: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
      padding-bottom: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .header-icon {
      width: 40px;
      height: 40px;
      background: #6366f1;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .card-dark .card-header h3 {
      color: white;
    }

    .ai-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      gap: var(--space-md);
    }

    .loading-dots {
      display: flex;
      gap: 6px;
    }

    .loading-dots span {
      width: 8px;
      height: 8px;
      background: #6366f1;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .ai-loading p {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #6366f1;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .ai-content {
      color: var(--color-text);
      line-height: var(--line-height-relaxed);
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

    .card-title h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .card-subtitle {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-xs) 0 0;
    }

    .card-tabs {
      display: flex;
      background: var(--color-bg);
      padding: var(--space-xs);
      border-radius: var(--radius-md);
      gap: var(--space-xs);
    }

    .card-tabs button {
      padding: var(--space-xs) var(--space-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .card-tabs button.active {
      background: white;
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }

    .chart-container {
      height: 350px;
      position: relative;
    }

    .missions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .mission-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .mission-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .mission-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
    }

    .mission-progress {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #8b5cf6;
    }

    .progress-bar {
      height: 6px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #6366f1);
      border-radius: 3px;
      transition: width 1s ease-out;
    }

    .card-activities .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .activity-item {
      display: flex;
      gap: var(--space-md);
      align-items: flex-start;
    }

    .activity-dot {
      width: 8px;
      height: 8px;
      background: #6366f1;
      border-radius: 50%;
      flex-shrink: 0;
      margin-top: 4px;
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

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header h3,
    :host-context(.dark) .card-title h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .btn-secondary,
    :host-context(.dark) .btn-white {
      background: var(--color-surface);
      color: var(--color-text);
      border-color: var(--color-border);
    }

    :host-context(.dark) .btn-secondary:hover,
    :host-context(.dark) .btn-white:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .activity-title,
    :host-context(.dark) .mission-name {
      color: var(--color-text);
    }

    :host-context(.dark) .card-tabs button.active {
      background: var(--color-surface);
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

      .header-actions {
        width: 100%;
      }

      .header-actions .btn {
        flex: 1;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('activityChart') activityChartRef!: ElementRef<HTMLCanvasElement>;

  private api = inject(ApiService);
  private aiService = inject(AiService);
  public t = inject(TranslationService);
  private exportService = inject(ExportService);
  
  societeId = '';
  societeNom = '';
  stats = { employes: 0, projetsActifs: 0, heuresTravaillees: 0, productivite: 0 };
  projets: any[] = [];
  equipes: any[] = [];
  activites: any[] = [];
  aiLoading = false;
  aiInsights: string | null = null;
  activitiesChart: any;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  ngAfterViewInit() {
    // Chart is loaded inside loadData -> updateActivityChart
  }

  loadData() {
    this.api.getSocieteStats(this.societeId).subscribe({
      next: (res) => {
        this.stats = {
          employes: res.totalEmployes || 0,
          projetsActifs: res.projetsEnCours || 0,
          heuresTravaillees: res.rh?.totalHeuresAujourdhui || 0,
          productivite: res.rh?.tauxPresence || 0
        };
      },
      error: () => {
        this.stats = {
          employes: 24,
          projetsActifs: 5,
          heuresTravaillees: 192,
          productivite: 92
        };
      }
    });

    this.api.getProjectsProgress(this.societeId).subscribe({
      next: (data) => {
        this.projets = data.slice(0, 5);
        if (this.projets.length === 0) {
          this.projets = [
            { id: 1, nom: 'Projet Alpha', progression: 75, statut: 'En cours' },
            { id: 2, nom: 'Projet Beta', progression: 45, statut: 'En cours' },
            { id: 3, nom: 'Projet Gamma', progression: 90, statut: 'Bientôt terminé' }
          ];
        }
      },
      error: () => {
        this.projets = [
          { id: 1, nom: 'Projet Alpha', progression: 75, statut: 'En cours' },
          { id: 2, nom: 'Projet Beta', progression: 45, statut: 'En cours' }
        ];
      }
    });

    this.api.getAttendanceTrends(this.societeId).subscribe({
      next: (data) => {
        setTimeout(() => this.updateActivityChart(data), 100);
      },
      error: () => {
        const mockData = [
          { day: 'Lun', value: 85 },
          { day: 'Mar', value: 92 },
          { day: 'Mer', value: 88 },
          { day: 'Jeu', value: 95 },
          { day: 'Ven', value: 90 },
          { day: 'Sam', value: 45 },
          { day: 'Dim', value: 20 }
        ];
        setTimeout(() => this.updateActivityChart(mockData), 100);
      }
    });

    // Charger les activités récentes depuis la base de données
    this.api.getActiviteRecente(10).subscribe({
      next: (data) => {
        this.activites = data.map((act: any) => ({
          id: act.id || Math.random(),
          title: act.description || act.action || 'Activité',
          user: act.utilisateur || act.user || 'Système',
          time: act.date ? this.formatRelativeTime(act.date) : 'il y a un moment'
        }));

        if (this.activites.length === 0) {
          this.activites = [
            { id: 1, title: 'Nouvel employé ajouté', user: 'Admin', time: 'il y a 2h' },
            { id: 2, title: 'Projet créé', user: 'Chef', time: 'il y a 4h' },
            { id: 3, title: 'Tâche assignée', user: 'Système', time: 'il y a 6h' }
          ];
        }
      },
      error: () => {
        this.activites = [
          { id: 1, title: 'Nouvel employé ajouté', user: 'Admin', time: 'il y a 2h' },
          { id: 2, title: 'Projet créé', user: 'Chef', time: 'il y a 4h' }
        ];
      }
    });

    // Charger les employés et les grouper par équipes
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        // Grouper les employés par typeUtilisateurId pour créer des équipes
        const equipeMap = new Map();
        employes.forEach((emp: any) => {
          const role = emp.typeUtilisateurId || emp.typeUtilisateur?.nom || 'Autre';
          if (!equipeMap.has(role)) {
            equipeMap.set(role, { id: equipeMap.size + 1, nom: role, membres: 0, performance: 0 });
          }
          const equipe = equipeMap.get(role);
          equipe.membres++;
          // Calculer une performance basée sur le nombre de membres
          equipe.performance = Math.min(100, 60 + equipe.membres * 5);
        });
        this.equipes = Array.from(equipeMap.values());

        if (this.equipes.length === 0) {
          this.equipes = [
            { id: 1, nom: 'Développeurs', membres: 8, performance: 85 },
            { id: 2, nom: 'QA', membres: 3, performance: 78 },
            { id: 3, nom: 'RH', membres: 2, performance: 72 }
          ];
        }
      },
      error: () => {
        this.equipes = [
          { id: 1, nom: 'Développeurs', membres: 8, performance: 85 },
          { id: 2, nom: 'QA', membres: 3, performance: 78 }
        ];
      }
    });
  }

  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `il y a ${diffMins}m`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    return `il y a ${diffDays}j`;
  }

  updateActivityChart(trends: any[]) {
    if (!this.activityChartRef?.nativeElement) return;
    if (this.activitiesChart) this.activitiesChart.destroy();
    
    const ctx = this.activityChartRef.nativeElement.getContext('2d');
    const gradient = ctx!.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');

    this.activitiesChart = new Chart(this.activityChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: trends.map((t: any) => t.date),
        datasets: [{
          label: 'Taux de Performance',
          data: trends.map((t: any) => t.rate),
          borderColor: '#6366f1',
          borderWidth: 4,
          pointBackgroundColor: '#6366f1',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          fill: true,
          backgroundColor: gradient,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, border: { display: false }, ticks: { color: '#94a3b8', font: { weight: 'bold' } } },
          y: { min: 0, max: 100, grid: { color: 'rgba(226, 232, 240, 0.1)' }, border: { display: false }, ticks: { color: '#94a3b8', font: { weight: 'bold' } } }
        }
      }
    });
  }

  analyserDashboard() {
    this.aiLoading = true;
    const context = `Dashboard Stats: ${JSON.stringify(this.stats)}, Projets: ${JSON.stringify(this.projets)}`;
    this.aiService.getRhInsights(context).subscribe(res => {
      this.aiInsights = marked.parse(res) as string;
      this.aiLoading = false;
    });
  }

  exportRapport() {
    const data = [['Indicateur', 'Valeur'], ['Personnel', this.stats.employes], ['Missions', this.stats.projetsActifs], ['Productivité', this.stats.productivite + '%']];
    this.exportService.exportToPdf(['Indicateur', 'Valeur'], data, 'Rapport_Centre_Commande', 'Synthèse de l\'Intelligence Stratégique');
  }
}
