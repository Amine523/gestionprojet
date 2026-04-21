import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { AiService } from '../../services/ai.service';
import { marked } from 'marked';

@Component({
  selector: 'app-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="container-fluid py-4">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1 text-primary">Tableau de Bord RH</h1>
          <p class="text-muted mb-0">{{societeNom}} • Vue d'ensemble</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-purple" (click)="analyserRH()" [disabled]="aiLoading" style="color: #8e24aa; border-color: #8e24aa;">
            <i class="bi bi-magic me-1"></i> Analyser avec IA
          </button>
          <button class="btn btn-outline-primary" (click)="loadData()">
            <i class="bi bi-arrow-clockwise me-1"></i> Actualiser
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <!-- Effectif Total -->
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #6366f1;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(99, 102, 241, 0.1); color: #6366f1;">
                <mat-icon style="font-size: 24px; width: 24px; height: 24px;">groups</mat-icon>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Effectif Total</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.totalEmployes}}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Présents -->
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #10b981;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(16, 185, 129, 0.1); color: #10b981;">
                <mat-icon style="font-size: 24px; width: 24px; height: 24px;">person_check</mat-icon>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Présents Aujourd'hui</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.presents}}</h2>
              </div>
              <span class="badge bg-success rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">{{tauxPresence}}%</span>
            </div>
          </div>
        </div>

        <!-- Congés -->
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #f59e0b;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(245, 158, 11, 0.1); color: #f59e0b;">
                <mat-icon style="font-size: 24px; width: 24px; height: 24px;">event_note</mat-icon>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Congés en attente</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.congesEnAttente}}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Absences -->
        <div class="col-lg-3 col-md-6">
          <div class="card border-0 shadow-sm position-relative overflow-hidden" style="border-left: 4px solid #ef4444;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                <mat-icon style="font-size: 24px; width: 24px; height: 24px;">work_off</mat-icon>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 13px; color: #64748b;">Absences</div>
                <h2 class="fw-bold mb-0" style="font-size: 32px; color: #1e293b;">{{stats.absences}}</h2>
              </div>
              <span class="badge bg-danger rounded-pill position-absolute top-0 end-0 m-3" style="font-size: 11px;">{{stats.tauxAbsent}}%</span>
            </div>
          </div>
        </div>
      </div>

      @if (aiLoading) {
        <div class="mb-4 p-3 bg-light rounded text-center">
          <div class="spinner-border text-primary spinner-border-sm me-2" role="status"></div>
          <span class="text-muted small">L'IA de Llama 3.2 analyse les données RH...</span>
        </div>
      }

      @if (aiInsights) {
        <div class="mb-4 p-4 rounded-3 shadow-sm" style="background: linear-gradient(to right, #fdfbfb, #ebedee); border-left: 4px solid #8e24aa;">
          <div class="d-flex align-items-center gap-2 mb-3">
            <i class="bi bi-robot" style="color: #8e24aa; font-size: 24px;"></i>
            <h5 class="fw-bold mb-0" style="color: #8e24aa;">Analyse RH Intelligente (Llama 3.2)</h5>
            <button class="btn btn-sm btn-close ms-auto" (click)="aiInsights = null"></button>
          </div>
          <div class="markdown-body" style="font-size: 14px;" [innerHTML]="aiInsights"></div>
        </div>
      }

      <div class="row g-4">
        <!-- Pointage History -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4"><i class="bi bi-clock-history text-primary me-2"></i>Activité de Pointage</h5>
              <div class="d-flex flex-column gap-3">
                @for (act of activities; track act.id) {
                  <div class="d-flex align-items-center gap-3 p-2 border-bottom">
                    <div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" [style.background]="'hsl('+(act.id.length * 30)+', 60%, 55%)'" style="width: 40px; height: 40px;">
                      {{act.title.split(': ')[1]?.charAt(0) || 'U'}}
                    </div>
                    <div>
                      <div class="fw-bold" style="font-size: 14px;">{{act.title.split(': ')[1]}}</div>
                      <div class="text-muted" style="font-size: 12px;">Arrivée enregistrée à {{act.time}}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <!-- KPI / Heatmap mock -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4"><i class="bi bi-calendar-check text-primary me-2"></i>Heatmap de Présence</h5>
              <div class="d-flex flex-wrap gap-1">
                @for (day of heatmapDays; track day.date) {
                  <div [style.background-color]="getHeatmapColor(day.level)" 
                       [matTooltip]="day.date + ': ' + day.count + '%'"
                       style="width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">
                  </div>
                }
              </div>
            </div>
          </div>

          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <h5 class="fw-bold mb-4"><i class="bi bi-person-add text-primary me-2"></i>Recrutement & KPI</h5>
              <div class="row text-center">
                <div class="col-6 border-end">
                  <h3 class="fw-bold text-dark mb-1">{{delaiMoyenRecrutement}} <small class="text-muted fs-6">jours</small></h3>
                  <div class="text-muted small text-uppercase fw-bold">Délai d'embauche</div>
                </div>
                <div class="col-6">
                  <h3 class="fw-bold text-dark mb-1">{{turnover}} <small class="text-muted fs-6">%</small></h3>
                  <div class="text-muted small text-uppercase fw-bold">Turnover</div>
                </div>
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
      transition: all 0.2s ease-in-out;
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
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
    this.generateHeatmap();
  }

  loadData() {
    this.api.getRHStats(this.societeId).subscribe({
      next: (data) => {
        this.stats.totalEmployes = data.totalEmployes;
        this.stats.absences = data.employesAbsents;
        this.stats.presents = data.totalEmployes - data.employesAbsents;
        this.stats.congesEnAttente = data.demandesCongesEnAttente;
        this.stats.tauxAbsent = 100 - data.tauxPresence;
        this.tauxPresence = data.tauxPresence;
        
        this.turnover = data.turnover || 8.5; 
      }
    });

    this.api.getCandidatures().subscribe(tousCandidats => {
      const societeCandidats = tousCandidats.filter((c: any) => c.societeId === this.societeId && c.statut === 'Accepté');
      if (societeCandidats.length > 0) {
        const delays = societeCandidats.map((c: any) => {
          const start = new Date(c.dateCandidature).getTime();
          const end = c.dateEntretien ? new Date(c.dateEntretien).getTime() : new Date().getTime();
          return (end - start) / (1000 * 3600 * 24);
        });
        this.delaiMoyenRecrutement = Math.max(1, Math.round(delays.reduce((a:number, b:number) => a + b, 0) / delays.length));
      } else {
        this.delaiMoyenRecrutement = 0;
      }
    });

    this.api.getPointages().subscribe({
      next: (pts) => {
        this.activities = pts.slice(0, 10).map((p: any) => ({
          id: p.id || 'act_'+Math.random(),
          title: `Pointage: ${p.utilisateurNom || 'Utilisateur'}`,
          time: p.heureDebut,
          type: 'pointage'
        }));
      }
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
