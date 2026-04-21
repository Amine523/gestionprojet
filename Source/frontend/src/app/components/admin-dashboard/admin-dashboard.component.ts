import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AiService } from '../../services/ai.service';
import { Chart, registerables } from 'chart.js';
import { marked } from 'marked';
import { TranslationService } from '../../services/translation.service';
import { ExportService } from '../../services/export.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            {{t.get('COMMAND_CENTER')}}
          </h1>
          <p class="text-muted mb-0">{{societeNom}} • {{t.get('PERFORMANCE_ANALYSIS')}}</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-purple" (click)="analyserDashboard()" [disabled]="aiLoading" style="color: #8e24aa; border-color: #8e24aa;">
            <i class="bi bi-magic me-1"></i> {{t.get('ANALYZE_AI')}}
          </button>
          <button class="btn btn-outline-primary" (click)="loadData()">
            <i class="bi bi-arrow-clockwise me-1"></i> {{t.get('REFRESH')}}
          </button>
          <button class="btn btn-primary" (click)="exportRapport()">
            <i class="bi bi-file-earmark-pdf me-1"></i> {{t.get('EXPORT_REPORT')}}
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #8b5cf6;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(139, 92, 246, 0.1); color: #8b5cf6;">
                <i class="bi bi-people" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Collaborateurs</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.employes}}</h2>
              </div>
              <span class="badge bg-success rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">+3</span>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #3b82f6;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <i class="bi bi-rocket-takeoff" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Projets Actifs</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.projetsActifs}}</h2>
              </div>
              <span class="badge bg-success rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">+2</span>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #16a34a;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(22, 163, 74, 0.1); color: #16a34a;">
                <i class="bi bi-clock-history" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Heures Prod.</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.heuresTravaillees}}</h2>
              </div>
              <span class="badge bg-success rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">12%</span>
            </div>
          </div>
        </div>

        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #f59e0b;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                <i class="bi bi-lightning" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Efficacité</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.productivite}}%</h2>
              </div>
              <span class="badge bg-success rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">5%</span>
            </div>
          </div>
        </div>
      </div>

      @if (aiLoading) {
        <div class="mb-4 p-3 bg-light rounded text-center">
          <div class="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
          <span class="text-muted small">L'IA de Llama 3.2 analyse les performances globales...</span>
        </div>
      }

      @if (aiInsights) {
        <div class="mb-4 p-4 rounded-3 shadow-sm" style="background: linear-gradient(to right, #fdfbfb, #ebedee); border-left: 4px solid #8e24aa;">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-robot" style="color: #8e24aa; font-size: 24px;"></i>
            <h5 class="fw-bold mb-0" style="color: #8e24aa;">Analyse Globale Intelligente (Llama 3.2)</h5>
            <button class="btn btn-sm btn-close ms-auto" (click)="aiInsights = null"></button>
          </div>
          <div class="markdown-body" style="font-size: 14px;" [innerHTML]="aiInsights"></div>
        </div>
      }

      <!-- Content Grid -->
      <div class="row g-4 mb-4">
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-bar-chart text-primary"></i>
                <h5 class="fw-bold mb-0">Activité Hebdomadaire</h5>
              </div>
              <div style="height: 300px;">
                <canvas #activityChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-trending-up text-primary"></i>
                <h5 class="fw-bold mb-0">Avancement Projets</h5>
              </div>
              <div class="d-flex flex-column gap-4">
                @for (projet of projets; track projet.id) {
                  <div>
                    <div class="d-flex justify-content-between mb-2">
                      <span class="fw-bold" style="font-size: 13px;">{{projet.nom}}</span>
                      <span class="fw-bold text-primary" style="font-size: 13px;">{{projet.avancee}}%</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar" [style.width.%]="projet.avancee" style="background: linear-gradient(90deg, #0284c7, #0891b2);"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Grid -->
      <div class="row g-4">
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-people text-primary"></i>
                <h5 class="fw-bold mb-0">Performance Équipes</h5>
              </div>
              <div class="d-flex flex-column gap-3">
                @for (team of equipes; track team.id) {
                  <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background: white; border: 1px solid #f1f5f9;">
                    <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: rgba(2, 132, 199, 0.1); color: #0284c7; font-weight: 700;">
                      {{team.nom.charAt(team.nom.length-1)}}
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 14px;">{{team.nom}}</div>
                      <div class="text-muted" style="font-size: 12px;">{{team.membres}} membres</div>
                    </div>
                    <div class="position-relative" style="width: 48px; height: 48px;">
                      <svg viewBox="0 0 36 36" class="circular-chart" style="width: 48px; height: 48px;">
                        <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#f1f5f9" stroke-width="3" fill="none"/>
                        <path class="circle" [attr.stroke-dasharray]="team.performance + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#0284c7" stroke-width="3" fill="none" stroke-linecap="round"/>
                      </svg>
                      <span class="position-absolute top-50 start-50 translate-middle fw-bold" style="font-size: 10px; color: #0284c7;">{{team.performance}}%</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-clock-history text-primary"></i>
                <h5 class="fw-bold mb-0">Flux d'Activité</h5>
              </div>
              <div class="d-flex flex-column gap-3">
                @for (activity of activites; track activity.id) {
                  <div class="d-flex gap-3">
                    <div class="rounded-2" [class.bg-primary-subtle]="activity.type === 'tache'" [class.bg-success-subtle]="activity.type === 'connexion'" [class.bg-danger-subtle]="activity.type === 'alerte'" style="width: 4px; position: relative;">
                      <div class="rounded-circle position-absolute top-0 start-50 translate-middle-x" style="width: 12px; height: 12px; background: white; border: 3px solid #e2e8f0;" [style.border-color]="activity.type === 'tache' ? '#0284c7' : activity.type === 'connexion' ? '#16a34a' : '#ef4444'"></div>
                    </div>
                    <div>
                      <div class="fw-bold" style="font-size: 13px;">{{activity.title}}</div>
                      <div class="text-muted" style="font-size: 12px;">{{activity.user}} • {{activity.time}}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }

    .circular-chart:hover .circle {
      transition: stroke-dasharray 1s ease;
    }
  `]
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('activityChart') activityChartRef!: ElementRef<HTMLCanvasElement>;

  private api = inject(ApiService);
  private aiService = inject(AiService);
  public t = inject(TranslationService);
  
  societeId = '';
  societeNom = '';

  stats = { employes: 0, projetsActifs: 0, heuresTravaillees: 0, productivite: 0 };
  projets: any[] = [];
  equipes: any[] = [];
  activites: any[] = [];
  activities: any[] = [];

  aiLoading = false;
  aiInsights: string | null = null;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    this.api.getSocieteStats(this.societeId).subscribe({
      next: (res: any) => {
        this.stats.employes = res.totalEmployes;
        this.stats.projetsActifs = res.projetsEnCours;
        this.stats.heuresTravaillees = res.rh?.totalHeuresAujourdhui || 0;
        this.stats.productivite = res.rh?.tauxPresence || 0;
      }
    });

    this.api.getProjectsProgress(this.societeId).subscribe({
      next: (data: any[]) => {
        this.projets = data;
      }
    });

    this.api.getAttendanceTrends(this.societeId).subscribe({
        next: (data: any[]) => {
            this.updateActivityChart(data);
        }
    });

    this.equipes = [
      { id: 1, nom: 'Équipe Alpha', membres: 5, performance: 88 },
      { id: 2, nom: 'Équipe Beta', membres: 4, performance: 72 }
    ];

    this.activites = [
      { id: 1, title: 'Session de revue entamée', user: 'Admin', time: 'Il y a 10m', type: 'tache' },
      { id: 2, title: 'Serveur de prod à jour', user: 'System', time: 'Il y a 1h', type: 'connexion' }
    ];
  }

  updateActivityChart(trends: any[]) {
      if (this.activityChartRef?.nativeElement) {
          if (this.activitiesChart) this.activitiesChart.destroy();
          
          this.activitiesChart = new Chart(this.activityChartRef.nativeElement, {
            type: 'line',
            data: {
              labels: trends.map((t: any) => t.date),
              datasets: [{
                label: 'Taux de présence (%)',
                data: trends.map((t: any) => t.rate),
                borderColor: '#0284c7',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { min: 0, max: 100 } }
            }
          });
      }
  }

  private activitiesChart: any;

  private exportService = inject(ExportService);

  exportRapport() {
      const columns = ['Indicateur', 'Valeur'];
      const data = [
          ['Collaborateurs', this.stats.employes.toString()],
          ['Projets Actifs', this.stats.projetsActifs.toString()],
          ['Productivité', this.stats.productivite + '%']
      ];
      this.exportService.exportToPdf(columns, data, 'rapport_dashboard', 'Rapport de Performance - ' + this.societeNom);
  }

  ngAfterViewInit() {
    if (this.activityChartRef?.nativeElement) {
      new Chart(this.activityChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
          datasets: [{
            label: 'Activité',
            data: [12, 19, 15, 22, 18, 10],
            backgroundColor: '#9c27b0'
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }
  }

  async analyserDashboard() {
    this.aiLoading = true;
    this.aiInsights = null;
    
    const payload = {
      stats: this.stats,
      projets: this.projets,
      equipes: this.equipes
    };

    this.aiService.getDashboardInsights(payload).subscribe({
      next: async (res: any) => {
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
