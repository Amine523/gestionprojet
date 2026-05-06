import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatSnackBarModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Rapports Qualité - {{societeNom}}</h1>
        <button mat-flat-button class="export-btn">
          <mat-icon>download</mat-icon> Exporter
        </button>
      </div>

      <div class="stats-row">
        <mat-card class="stat-card">
          <div class="stat-value">{{rapports.tauxReussite}}%</div>
          <div class="stat-label">Taux de réussite</div>
          <mat-progress-bar mode="determinate" [value]="rapports.tauxReussite"></mat-progress-bar>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-value">{{rapports.totalTests}}</div>
          <div class="stat-label">Total tests exécutés</div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-value">{{rapports.totalBugs}}</div>
          <div class="stat-label">Total bugs détectés</div>
        </mat-card>
        <mat-card class="stat-card">
          <div class="stat-value">{{rapports.bugsCorriges}}</div>
          <div class="stat-label">Bugs corrigés</div>
        </mat-card>
      </div>

      <mat-card class="chart-card">
        <h3>Répartition des bugs par projet</h3>
        @for (p of projets; track p.nom) {
          <div class="bar-item">
            <span class="bar-label">{{p.nom}}</span>
            <mat-progress-bar mode="determinate" [value]="p.percentage" [color]="p.percentage > 50 ? 'warn' : 'primary'"></mat-progress-bar>
            <span class="bar-value">{{p.nombre}} bugs</span>
          </div>
        }
      </mat-card>
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .export-btn { background: #2196f3; color: white; }

    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { padding: 24px; border-radius: 12px; text-align: center; }
    .stat-card .stat-value { font-size: 32px; font-weight: 700; color: #1a1a2e; }
    .stat-card .stat-label { font-size: 13px; color: #666; margin-bottom: 12px; }

    .chart-card { padding: 24px; border-radius: 12px; }
    .chart-card h3 { margin: 0 0 20px; }
    .bar-item { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
    .bar-label { width: 120px; font-size: 14px; }
    .bar-item mat-progress-bar { flex: 1; }
    .bar-value { width: 80px; text-align: right; font-weight: 600; }
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
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const societeData = data.qaTests?.[this.societeId] || [];
    const societeBugs = data.qaBugs?.[this.societeId] || [];

    this.rapports.totalTests = societeData.length;
    this.rapports.totalBugs = societeBugs.length;
    this.rapports.bugsCorriges = societeBugs.filter((b: any) => b.statut === 'Fixed').length;

    if (this.rapports.totalTests > 0) {
      this.rapports.tauxReussite = Math.round(((this.rapports.totalTests - this.rapports.totalBugs) / this.rapports.totalTests) * 100);
    }

    const bugsByProjet: { [key: string]: number } = {};
    societeBugs.forEach((b: any) => {
      bugsByProjet[b.projet] = (bugsByProjet[b.projet] || 0) + 1;
    });

    this.projets = Object.entries(bugsByProjet).map(([nom, nombre]) => ({
      nom,
      nombre,
      percentage: this.rapports.totalBugs > 0 ? Math.round((nombre as number / this.rapports.totalBugs) * 100) : 0
    }));
  }
}
