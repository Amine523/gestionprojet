import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="rapports-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"/>
            <line x1="18" y1="20" x2="18" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="16"/>
          </svg>
        </div>
        <div class="header-content">
          <h1 class="header-title">Rapports</h1>
          <p class="header-subtitle">Analysez la performance de vos projets - {{societeNom}}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <select class="form-select form-select-sm" [(ngModel)]="periode" (ngModelChange)="updateRapport()">
          <option value="semaine">Cette semaine</option>
          <option value="mois">Ce mois</option>
          <option value="trimestre">Ce trimestre</option>
        </select>
        <select class="form-select form-select-sm" [(ngModel)]="selectedProjet" (ngModelChange)="updateRapport()">
          <option value="">Tous</option>
          <option value="Application Mobile">Application Mobile</option>
          <option value="API REST">API REST</option>
          <option value="Dashboard">Dashboard</option>
        </select>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          PDF
        </button>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="8" y1="13" x2="16" y2="13"/>
            <line x1="8" y1="17" x2="16" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
          Excel
        </button>
      </div>

      <!-- Tabs Card -->
      <div class="card">
        <div class="tabs">
          <button class="tab active" (click)="activeTab = 'avancement'">Avancement</button>
          <button class="tab" (click)="activeTab = 'productivite'">Productivité</button>
          <button class="tab" (click)="activeTab = 'delais'">Respect des délais</button>
        </div>

        @if (activeTab === 'avancement') {
          <div class="tab-content">
            <h3 class="tab-title">Avancement global</h3>
            <div class="gauge-section">
              <svg viewBox="0 0 100 50" class="gauge-chart">
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--color-border)" stroke-width="10"/>
                <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#3b82f6" stroke-width="10" [attr.stroke-dasharray]="avancement * 1.25 + ' 125'"/>
              </svg>
              <div class="gauge-value">{{avancement}}%</div>
            </div>

            <h3 class="tab-title">Par projet</h3>
            <div class="progress-list">
              @for (p of projets; track p.nom) {
                <div class="progress-item">
                  <div class="progress-header">
                    <span class="progress-label">{{p.nom}}</span>
                    <span class="progress-value" [ngClass]="p.avancement > 70 ? 'progress-high' : 'progress-medium'">{{p.avancement}}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="p.avancement" [ngClass]="p.avancement > 70 ? 'progress-high' : 'progress-medium'"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab === 'productivite') {
          <div class="tab-content">
            <h3 class="tab-title">Productivité de l'équipe</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div class="stat-value">{{tachesTerminees}}</div>
                <div class="stat-label">Tâches terminées</div>
              </div>
              <div class="stat-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div class="stat-value">{{tempsMoyen}}</div>
                <div class="stat-label">Temps moyen (h)</div>
              </div>
              <div class="stat-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
                <div class="stat-value">{{vlocuteur}}</div>
                <div class="stat-label">Vitesse (h/semaine)</div>
              </div>
              <div class="stat-card">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="stat-icon">
                  <line x1="12" y1="20" x2="12" y2="10"/>
                  <line x1="18" y1="20" x2="18" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="16"/>
                </svg>
                <div class="stat-value">{{rendement}}%</div>
                <div class="stat-label">Rendement</div>
              </div>
            </div>

            <h3 class="tab-title">Par développeur</h3>
            <div class="developer-list">
              @for (d of developpeurs; track d.nom) {
                <div class="developer-item">
                  <div>
                    <div class="developer-name">{{d.nom}}</div>
                    <div class="developer-role">{{d.role}}</div>
                  </div>
                  <div class="developer-stats">
                    <span>{{d.taches}} tâches</span>
                    <span>{{d.heures}}h</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab === 'delais') {
          <div class="tab-content">
            <h3 class="tab-title">Indicateurs délais</h3>
            <div class="delais-grid">
              <div class="delai-card delai-success">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delai-icon">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <div class="delai-value">{{dansLesDelais}}</div>
                <div class="delai-label">Dans les délais</div>
              </div>
              <div class="delai-card delai-warning">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delai-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div class="delai-value">{{avecRetard}}</div>
                <div class="delai-label">Avec retard</div>
              </div>
              <div class="delai-card delai-danger">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="delai-icon">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <div class="delai-value">{{nonTermines}}</div>
                <div class="delai-label">Non terminé(e)s</div>
              </div>
            </div>

            <h3 class="tab-title">Tendance</h3>
            <div class="trend-list">
              <div class="trend-item">
                <span class="trend-label">Semaine 12</span>
                <div class="trend-bar">
                  <div class="trend-fill" style="width: 85%;"></div>
                </div>
                <span class="trend-value">85%</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">Semaine 13</span>
                <div class="trend-bar">
                  <div class="trend-fill" style="width: 78%;"></div>
                </div>
                <span class="trend-value">78%</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">Semaine 14</span>
                <div class="trend-bar">
                  <div class="trend-fill" style="width: 92%;"></div>
                </div>
                <span class="trend-value">92%</span>
              </div>
              <div class="trend-item">
                <span class="trend-label">Semaine 15</span>
                <div class="trend-bar">
                  <div class="trend-fill" style="width: 88%;"></div>
                </div>
                <span class="trend-value">88%</span>
              </div>
            </div>
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
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
      box-shadow: var(--shadow-lg);
    }

    .header-icon {
      width: 52px;
      height: 52px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .header-content {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-xs);
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .filters-bar {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
      flex-wrap: wrap;
    }

    .form-select {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      background: white;
      transition: border-color var(--transition-base);
    }

    .form-select:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-select-sm {
      width: auto;
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

    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .tabs {
      display: flex;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .tab {
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .tab:hover {
      background: var(--color-bg);
    }

    .tab.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .tab-content {
      padding: var(--space-lg);
    }

    .tab-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-lg);
    }

    .gauge-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: var(--space-2xl);
    }

    .gauge-chart {
      width: 200px;
      height: 100px;
      margin-bottom: var(--space-md);
    }

    .gauge-value {
      font-size: 48px;
      font-weight: var(--font-weight-bold);
      color: #3b82f6;
    }

    .progress-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .progress-item {
      margin-bottom: var(--space-md);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-sm);
    }

    .progress-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .progress-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: #3b82f6;
    }

    .progress-value.progress-medium {
      color: #f59e0b;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-border);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .progress-fill.progress-medium {
      background: #f59e0b;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      text-align: center;
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      color: #3b82f6;
      margin-bottom: var(--space-sm);
    }

    .stat-value {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .developer-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .developer-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .developer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .developer-role {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .developer-stats {
      display: flex;
      gap: var(--space-lg);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .delais-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .delai-card {
      padding: var(--space-lg);
      text-align: center;
      border-radius: var(--radius-lg);
      border: none;
    }

    .delai-success {
      background: rgba(16, 185, 129, 0.1);
    }

    .delai-warning {
      background: rgba(245, 158, 11, 0.1);
    }

    .delai-danger {
      background: rgba(239, 68, 68, 0.1);
    }

    .delai-icon {
      margin-bottom: var(--space-sm);
    }

    .delai-success .delai-icon {
      color: #10b981;
    }

    .delai-warning .delai-icon {
      color: #f59e0b;
    }

    .delai-danger .delai-icon {
      color: #ef4444;
    }

    .delai-value {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .delai-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .trend-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .trend-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .trend-label {
      width: 100px;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .trend-bar {
      flex: 1;
      height: 20px;
      background: var(--color-border);
      border-radius: 10px;
      overflow: hidden;
    }

    .trend-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #10b981);
      border-radius: 10px;
    }

    .trend-value {
      width: 50px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      text-align: right;
      color: var(--color-text);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .stat-card,
    :host-context(.dark) .developer-item {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-title,
    :host-context(.dark) .progress-label,
    :host-context(.dark) .developer-name,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .delai-value,
    :host-context(.dark) .trend-label,
    :host-context(.dark) .trend-value {
      color: var(--color-text);
    }

    :host-context(.dark) .form-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    @media (max-width: 768px) {
      .rapports-container {
        padding: var(--space-md);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filters-bar {
        flex-direction: column;
      }

      .filters-bar .form-select,
      .filters-bar .btn {
        width: 100%;
      }

      .stats-grid,
      .delais-grid {
        grid-template-columns: 1fr;
      }

      .developer-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-sm);
      }

      .trend-item {
        flex-wrap: wrap;
      }

      .trend-label,
      .trend-value {
        width: auto;
      }
    }
  `]
})
export class ChefRapportsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  activeTab = 'avancement';
  
  periode = 'semaine';
  selectedProjet = '';
  avancement = 0;

  projets: any[] = [];

  tachesTerminees = 0;
  tempsMoyen = 0;
  vlocuteur = 0;
  rendement = 0;

  developpeurs: any[] = [];

  dansLesDelais = 0;
  avecRetard = 0;
  nonTermines = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ nom: p.nom, avancement: Math.floor(Math.random() * 40) + 60 }));
        if (this.projets.length > 0) {
          this.avancement = this.projets[0].avancement;
        }
      },
      error: () => {}
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.developpeurs = employes.slice(0, 5).map((e: any) => ({
          nom: e.nom,
          role: e.typeUtilisateurId || 'Développeur',
          taches: Math.floor(Math.random() * 20) + 5,
          heures: Math.floor(Math.random() * 40) + 40
        }));
        this.tachesTerminees = this.developpeurs.reduce((sum: number, d: any) => sum + d.taches, 0);
        this.vlocuteur = this.developpeurs.length;
        this.rendement = Math.floor(Math.random() * 20) + 80;
        this.tempsMoyen = 3 + Math.floor(Math.random() * 4);
      },
      error: () => {}
    });
    
    this.dansLesDelais = Math.floor(Math.random() * 15) + 5;
    this.avecRetard = Math.floor(Math.random() * 5);
    this.nonTermines = Math.floor(Math.random() * 3);
  }

  updateRapport() {
    alert('Rapport mis à jour: ' + this.periode);
  }
}

