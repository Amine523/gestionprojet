import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-qa-rapports',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `

    <div class="rapports-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="header-title">Rapports Qualité - {{societeNom}}</h1>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exporter
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-value">{{rapports.tauxReussite}}%</div>
          <div class="stat-label">Taux de réussite</div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="rapports.tauxReussite"></div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{rapports.totalTests}}</div>
          <div class="stat-label">Total tests exécutés</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{rapports.totalBugs}}</div>
          <div class="stat-label">Total bugs détectés</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{rapports.bugsCorriges}}</div>
          <div class="stat-label">Bugs corrigés</div>
        </div>
      </div>

      <!-- Chart Card -->
      <div class="chart-card">
        <h3 class="chart-title">Répartition des bugs par projet</h3>
        @for (p of projets; track p.nom) {
          <div class="bar-item">
            <span class="bar-label">{{p.nom}}</span>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="p.percentage" [ngClass]="p.percentage > 50 ? 'warn' : 'primary'"></div>
            </div>
            <span class="bar-value">{{p.nombre}} bugs</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .rapports-container {
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .stat-value {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .progress-fill.warn {
      background: #ef4444;
    }

    .progress-fill.primary {
      background: #3b82f6;
    }

    .chart-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }

    .chart-title {
      margin: 0 0 var(--space-lg);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .bar-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .bar-label {
      width: 120px;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .bar-item .progress-bar {
      flex: 1;
    }

    .bar-value {
      width: 80px;
      text-align: right;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    /* Dark mode */
    :host-context(.dark) .stat-card,
    :host-context(.dark) .chart-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .chart-title,
    :host-context(.dark) .bar-label,
    :host-context(.dark) .bar-value {
      color: var(--color-text);
    }

    :host-context(.dark) .stat-label {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 1024px) {
      .stats-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .stats-row {
        grid-template-columns: 1fr;
      }

      .bar-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .bar-label {
        width: auto;
      }

      .bar-item .progress-bar {
        width: 100%;
      }

      .bar-value {
        width: auto;
        text-align: left;
      }
    }
  `]
})
export class QaRapportsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';

  rapports = { tauxReussite: 0, totalTests: 0, totalBugs: 0, bugsCorriges: 0 };
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    forkJoin({
      tests: this.api.getTestsBySociete(this.societeId),
      taches: this.api.getTachesBySociete(this.societeId)
    }).subscribe({
      next: (res) => {
        const societeData = res.tests || [];
        const societeBugs = (res.taches || []).filter((t: any) => 
          (t.type === 'Bug' || t.Type === 'Bug' || (t.titre || '').toLowerCase().includes('bug'))
        );

        this.rapports.totalTests = societeData.length;
        this.rapports.totalBugs = societeBugs.length;
        this.rapports.bugsCorriges = societeBugs.filter((b: any) => 
          ['Fixed', 'Terminé', 'Done', 'Resolved'].includes(b.statut || b.Statut)
        ).length;

        if (this.rapports.totalTests > 0) {
          this.rapports.tauxReussite = Math.round(((this.rapports.totalTests - this.rapports.totalBugs) / this.rapports.totalTests) * 100);
        } else {
          this.rapports.tauxReussite = 0;
        }

        const bugsByProjet: { [key: string]: number } = {};
        societeBugs.forEach((b: any) => {
          const projetNom = b.projetNom || b.ProjetNom || b.projet || 'Inconnu';
          bugsByProjet[projetNom] = (bugsByProjet[projetNom] || 0) + 1;
        });

        this.projets = Object.entries(bugsByProjet).map(([nom, nombre]) => ({
          nom,
          nombre,
          percentage: this.rapports.totalBugs > 0 ? Math.round((nombre as number / this.rapports.totalBugs) * 100) : 0
        }));
      },
      error: (err) => {
        console.error('Erreur lors du chargement des rapports QA:', err);
      }
    });
  }
}

