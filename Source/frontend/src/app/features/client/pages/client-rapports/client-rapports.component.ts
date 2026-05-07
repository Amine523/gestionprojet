import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

interface Rapport {
  ProjetId: string;
  ProjetNom: string;
  Avancement: number;
  TotalTaches: number;
  TachesTerminees: number;
  TachesEnCours: number;
  TachesAFaire: number;
  DateDebut?: string;
  DateFin?: string;
  Statut?: string;
}

interface BurndownPoint {
  day: string;
  ideal: number;
  remaining: number;
}

@Component({
  selector: 'app-client-rapports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="client-rapports">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">📊 Rapports & KPIs</h1>
          <p class="page-subtitle">Suivi de l'avancement de vos projets</p>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="loading-center">
          <div class="spinner"></div>
          <p>Chargement des rapports...</p>
        </div>
      } @else {
        <!-- Global KPIs -->
        <div class="global-kpis">
          <div class="gkpi-card">
            <div class="gkpi-icon gkpi-blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            </div>
            <div>
              <div class="gkpi-val">{{ rapports.length }}</div>
              <div class="gkpi-lbl">Projets suivis</div>
            </div>
          </div>
          <div class="gkpi-card">
            <div class="gkpi-icon gkpi-green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </div>
            <div>
              <div class="gkpi-val">{{ globalAvancement | number:'1.0-0' }}%</div>
              <div class="gkpi-lbl">Avancement global</div>
            </div>
          </div>
          <div class="gkpi-card">
            <div class="gkpi-icon gkpi-orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>
            </div>
            <div>
              <div class="gkpi-val">{{ totalTachesTerminees }}</div>
              <div class="gkpi-lbl">Tâches terminées</div>
            </div>
          </div>
          <div class="gkpi-card">
            <div class="gkpi-icon gkpi-purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div>
              <div class="gkpi-val">{{ totalTachesEnCours }}</div>
              <div class="gkpi-lbl">Tâches en cours</div>
            </div>
          </div>
        </div>

        <!-- Rapport par projet -->
        <div class="rapports-list">
          @for (rapport of rapports; track rapport.ProjetId) {
            <div class="rapport-card">
              <!-- Card Header -->
              <div class="rapport-header">
                <div class="rapport-avatar">{{ rapport.ProjetNom.charAt(0).toUpperCase() || 'P' }}</div>
                <div class="rapport-meta">
                  <h3 class="rapport-nom">{{ rapport.ProjetNom }}</h3>
                  <span class="rapport-statut" [class]="getStatutClass(rapport.Statut)">{{ rapport.Statut || 'N/A' }}</span>
                </div>
                <div class="rapport-avancement-label">
                  <span class="av-pct">{{ rapport.Avancement | number:'1.0-0' }}%</span>
                  <span class="av-lbl">avancement</span>
                </div>
              </div>

              <!-- Barre de progression grande -->
              <div class="big-progress">
                <div class="big-progress-fill" [style.width.%]="rapport.Avancement"
                     [class]="getProgressClass(rapport.Avancement)"></div>
              </div>

              <!-- Stats tâches -->
              <div class="tasks-stats">
                <div class="task-stat">
                  <div class="ts-dot dot-done"></div>
                  <span class="ts-val">{{ rapport.TachesTerminees }}</span>
                  <span class="ts-lbl">Terminées</span>
                </div>
                <div class="task-stat">
                  <div class="ts-dot dot-active"></div>
                  <span class="ts-val">{{ rapport.TachesEnCours }}</span>
                  <span class="ts-lbl">En cours</span>
                </div>
                <div class="task-stat">
                  <div class="ts-dot dot-todo"></div>
                  <span class="ts-val">{{ rapport.TachesAFaire }}</span>
                  <span class="ts-lbl">À faire</span>
                </div>
                <div class="task-stat ts-total">
                  <span class="ts-val">{{ rapport.TotalTaches }}</span>
                  <span class="ts-lbl">Total</span>
                </div>
              </div>

              <!-- Mini donut simulé via segments -->
              <div class="rapport-footer">
                <div class="dates-info">
                  @if (rapport.DateDebut) {
                    <span class="date-chip">📅 Début : {{ formatDate(rapport.DateDebut) }}</span>
                  }
                  @if (rapport.DateFin) {
                    <span class="date-chip">🏁 Fin : {{ formatDate(rapport.DateFin) }}</span>
                  }
                </div>
                <button class="burndown-btn" (click)="loadBurndown(rapport.ProjetId)">
                  Burndown chart
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </button>
              </div>

              <!-- Burndown (affiché si sélectionné) -->
              @if (selectedProjetId === rapport.ProjetId && burndownData.length > 0) {
                <div class="burndown-section">
                  <h4 class="burndown-title">📉 Burndown Chart</h4>
                  <div class="burndown-chart">
                    @for (point of burndownData; track point.day) {
                      <div class="burndown-col">
                        <div class="burndown-bars">
                          <div class="bar bar-ideal" [style.height.%]="point.ideal" title="Idéal: {{ point.ideal }}"></div>
                          <div class="bar bar-remaining" [style.height.%]="point.remaining" title="Restant: {{ point.remaining }}"></div>
                        </div>
                        <span class="bar-label">{{ point.day }}</span>
                      </div>
                    }
                  </div>
                  <div class="burndown-legend">
                    <div class="legend-item"><div class="legend-dot dot-ideal"></div> Idéal</div>
                    <div class="legend-item"><div class="legend-dot dot-remaining"></div> Restant</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        @if (rapports.length === 0) {
          <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3>Aucun rapport disponible</h3>
            <p>Les rapports apparaîtront une fois que vous aurez des projets affectés.</p>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .client-rapports { display: flex; flex-direction: column; gap: 28px; }

    .page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .page-title { font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; }
    .page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }

    .loading-center {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; padding: 80px; gap: 16px; color: #94a3b8;
    }

    .spinner {
      width: 40px; height: 40px; border: 3px solid #e2e8f0;
      border-top-color: #3b82f6; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Global KPIs */
    .global-kpis {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px;
    }

    .gkpi-card {
      background: white; border-radius: 16px; padding: 20px 24px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07); border: 1px solid #f1f5f9;
      transition: transform 0.2s;
    }
    .gkpi-card:hover { transform: translateY(-2px); }

    .gkpi-icon {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .gkpi-blue { background: #eff6ff; color: #3b82f6; }
    .gkpi-green { background: #f0fdf4; color: #22c55e; }
    .gkpi-orange { background: #fffbeb; color: #f59e0b; }
    .gkpi-purple { background: #faf5ff; color: #8b5cf6; }

    .gkpi-val { font-size: 28px; font-weight: 800; color: #0f172a; line-height: 1; }
    .gkpi-lbl { font-size: 12px; color: #64748b; margin-top: 4px; }

    /* Rapport cards */
    .rapports-list { display: flex; flex-direction: column; gap: 20px; }

    .rapport-card {
      background: white; border-radius: 18px; padding: 24px;
      border: 1px solid #f1f5f9; box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      display: flex; flex-direction: column; gap: 18px;
    }

    .rapport-header { display: flex; align-items: center; gap: 16px; }

    .rapport-avatar {
      width: 52px; height: 52px; border-radius: 14px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white; font-weight: 800; font-size: 20px;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }

    .rapport-meta { flex: 1; }
    .rapport-nom { font-size: 16px; font-weight: 700; color: #0f172a; margin: 0 0 6px; }

    .rapport-statut {
      font-size: 11px; font-weight: 600; padding: 3px 10px;
      border-radius: 20px;
    }
    .status-actif { background: #dcfce7; color: #15803d; }
    .status-retard { background: #fee2e2; color: #b91c1c; }
    .status-termin { background: #e0f2fe; color: #0369a1; }
    .status-defaut { background: #f1f5f9; color: #475569; }

    .rapport-avancement-label { text-align: right; }
    .av-pct { font-size: 32px; font-weight: 800; color: #6366f1; line-height: 1; display: block; }
    .av-lbl { font-size: 12px; color: #94a3b8; }

    /* Big progress */
    .big-progress {
      height: 12px; background: #f1f5f9; border-radius: 6px; overflow: hidden;
    }

    .big-progress-fill {
      height: 100%; border-radius: 6px; transition: width 0.8s ease;
    }

    .progress-low { background: linear-gradient(90deg, #ef4444, #f87171); }
    .progress-mid { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
    .progress-high { background: linear-gradient(90deg, #22c55e, #4ade80); }

    /* Tasks stats */
    .tasks-stats { display: flex; gap: 24px; flex-wrap: wrap; }

    .task-stat { display: flex; align-items: center; gap: 8px; }

    .ts-dot {
      width: 10px; height: 10px; border-radius: 50%;
    }
    .dot-done { background: #22c55e; }
    .dot-active { background: #3b82f6; }
    .dot-todo { background: #94a3b8; }

    .ts-val { font-size: 18px; font-weight: 700; color: #0f172a; }
    .ts-lbl { font-size: 12px; color: #64748b; }
    .ts-total { border-left: 1px solid #e2e8f0; padding-left: 24px; margin-left: 8px; }

    /* Footer */
    .rapport-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }

    .dates-info { display: flex; gap: 12px; flex-wrap: wrap; }

    .date-chip {
      font-size: 12px; color: #64748b; background: #f8fafc;
      padding: 4px 10px; border-radius: 6px; border: 1px solid #e2e8f0;
    }

    .burndown-btn {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: #6366f1;
      background: #f5f3ff; border: 1px solid #ddd6fe;
      border-radius: 8px; padding: 8px 16px; cursor: pointer;
      transition: all 0.2s;
    }
    .burndown-btn:hover { background: #6366f1; color: white; }

    /* Burndown section */
    .burndown-section {
      border-top: 1px solid #f1f5f9; padding-top: 20px;
    }

    .burndown-title { font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 16px; }

    .burndown-chart {
      display: flex; align-items: flex-end; gap: 12px; height: 120px;
    }

    .burndown-col {
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
    }

    .burndown-bars {
      flex: 1; width: 100%; display: flex; gap: 4px; align-items: flex-end;
    }

    .bar {
      flex: 1; border-radius: 4px 4px 0 0; min-height: 4px;
      transition: height 0.5s ease;
    }

    .bar-ideal { background: #bfdbfe; }
    .bar-remaining { background: #6366f1; }
    .bar-label { font-size: 11px; color: #94a3b8; }

    .burndown-legend {
      display: flex; gap: 20px; margin-top: 12px;
    }

    .legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748b; }

    .legend-dot { width: 10px; height: 10px; border-radius: 3px; }
    .dot-ideal { background: #bfdbfe; }
    .dot-remaining { background: #6366f1; }

    /* Empty */
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 80px 24px; gap: 16px; color: #94a3b8;
    }
    .empty-state h3 { font-size: 18px; font-weight: 700; color: #374151; margin: 0; }
    .empty-state p { font-size: 14px; max-width: 360px; margin: 0; }
  `]
})
export class ClientRapportsComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  rapports: Rapport[] = [];
  burndownData: BurndownPoint[] = [];
  selectedProjetId: string | null = null;
  isLoading = true;

  private get apiBase() {
    return (this.api as any).baseUrl || '/api';
  }

  get globalAvancement(): number {
    if (!this.rapports.length) return 0;
    return this.rapports.reduce((sum, r) => sum + (r.Avancement || 0), 0) / this.rapports.length;
  }

  get totalTachesTerminees(): number {
    return this.rapports.reduce((sum, r) => sum + (r.TachesTerminees || 0), 0);
  }

  get totalTachesEnCours(): number {
    return this.rapports.reduce((sum, r) => sum + (r.TachesEnCours || 0), 0);
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    if (userId) {
      this.http.get<Rapport[]>(`${this.apiBase}/client-projet/rapports/${userId}`)
        .subscribe({
          next: (data) => { this.rapports = data || []; this.isLoading = false; },
          error: () => { this.rapports = []; this.isLoading = false; }
        });
    } else {
      this.isLoading = false;
    }
  }

  loadBurndown(projetId: string) {
    if (this.selectedProjetId === projetId) {
      this.selectedProjetId = null;
      return;
    }
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    this.http.get<BurndownPoint[]>(`${this.apiBase}/client-projet/burndown/${userId}/${projetId}`)
      .subscribe({
        next: (data) => { this.burndownData = data || []; this.selectedProjetId = projetId; },
        error: () => { this.burndownData = []; this.selectedProjetId = projetId; }
      });
  }

  getStatutClass(statut?: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('cours') || s.includes('actif')) return 'rapport-statut status-actif';
    if (s.includes('retard') || s.includes('delay')) return 'rapport-statut status-retard';
    if (s.includes('termin') || s.includes('done')) return 'rapport-statut status-termin';
    return 'rapport-statut status-defaut';
  }

  getProgressClass(pct: number): string {
    if (pct < 33) return 'big-progress-fill progress-low';
    if (pct < 66) return 'big-progress-fill progress-mid';
    return 'big-progress-fill progress-high';
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return date; }
  }
}
