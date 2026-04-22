import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="suivi-container">
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
          <h1 class="header-title">Suivi d'Avancement</h1>
          <p class="header-subtitle">Analysez la progression de vos projets - {{societeNom}}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <select class="form-select form-select-sm" [(ngModel)]="selectedProjet" (ngModelChange)="updateData()">
          @for (p of projets; track p.id) {
            <option [value]="p.nom">{{p.nom}}</option>
          }
        </select>
        <button class="btn btn-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Exporter
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{avancement}}%</div>
            <div class="stat-label">Avancement</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-orange">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{tempsEstime}}h</div>
            <div class="stat-label">Temps estimé</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
              <line x1="12" y1="16" x2="12" y2="18"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{tempsReel}}h</div>
            <div class="stat-label">Temps réel</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" [ngClass]="tauxRetard > 20 ? 'stat-icon-red' : 'stat-icon-green'">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{tauxRetard}}%</div>
            <div class="stat-label">Taux retard</div>
          </div>
        </div>
      </div>

      <!-- Tabs Card -->
      <div class="card">
        <div class="tabs">
          <button class="tab active" (click)="activeTab = 'tableau'">Tableau de suivi</button>
          <button class="tab" (click)="activeTab = 'graphiques'">Graphiques</button>
          <button class="tab" (click)="activeTab = 'alertes'">Alertes</button>
        </div>

        @if (activeTab === 'tableau') {
          <div class="tab-content">
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Tâche</th>
                    <th>Responsable</th>
                    <th>Statut</th>
                    <th>Temps</th>
                    <th>Progression</th>
                    <th>Alerte</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of taches; track t.id) {
                    <tr [ngClass]="t.retard ? 'row-warning' : ''">
                      <td>{{t.titre}}</td>
                      <td>{{t.responsable}}</td>
                      <td>
                        <span class="badge" [ngClass]="t.statut === 'To Do' ? 'badge-secondary' : t.statut === 'In Progress' ? 'badge-primary' : 'badge-success'">{{t.statut}}</span>
                      </td>
                      <td>{{t.temps}}h</td>
                      <td>
                        <div class="progress-display">
                          <div class="progress-bar">
                            <div class="progress-fill" [style.width.%]="t.progression"></div>
                          </div>
                          <span class="progress-text">{{t.progression}}%</span>
                        </div>
                      </td>
                      <td>
                        @if (t.retard) {
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                            <line x1="12" y1="9" x2="12" y2="13"/>
                            <line x1="12" y1="17" x2="12.01" y2="17"/>
                          </svg>
                        }
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (activeTab === 'graphiques') {
          <div class="tab-content">
            <h3 class="tab-title">Avancement du projet</h3>
            <div class="progress-section">
              <div class="progress-bar large">
                <div class="progress-fill" [style.width.%]="avancement"></div>
              </div>
              <div class="progress-center">{{avancement}}% terminé</div>
            </div>

            <div class="status-grid">
              <div class="status-item">
                <div class="status-label">To Do</div>
                <div class="progress-bar">
                  <div class="progress-fill progress-gray" [style.width.%]="stats.todo"></div>
                </div>
                <div class="status-value">{{stats.todo}}%</div>
              </div>
              <div class="status-item">
                <div class="status-label">In Progress</div>
                <div class="progress-bar">
                  <div class="progress-fill progress-cyan" [style.width.%]="stats.inProgress"></div>
                </div>
                <div class="status-value">{{stats.inProgress}}%</div>
              </div>
              <div class="status-item">
                <div class="status-label">Done</div>
                <div class="progress-bar">
                  <div class="progress-fill progress-blue" [style.width.%]="stats.done"></div>
                </div>
                <div class="status-value">{{stats.done}}%</div>
              </div>
            </div>

            <h3 class="tab-title">Temps estimé vs réel</h3>
            <div class="time-comparison">
              <div class="time-item">
                <span class="time-label">Estimé</span>
                <div class="time-bar" style="width: 200px; background: #3b82f6;"></div>
                <span class="time-value">{{tempsEstime}}h</span>
              </div>
              <div class="time-item">
                <span class="time-label">Réel</span>
                <div class="time-bar" [style.width.%]="(tempsReel/tempsEstime)*100" style="background: #f59e0b;"></div>
                <span class="time-value">{{tempsReel}}h</span>
              </div>
            </div>
          </div>
        }

        @if (activeTab === 'alertes') {
          <div class="tab-content">
            <h3 class="tab-title">Alertes actives</h3>
            <div class="alerts-list">
              @for (a of alertes; track a.id) {
                <div class="alert-item" [ngClass]="a.critique ? 'alert-danger' : 'alert-warning'">
                  <div class="alert-icon">
                    @if (a.critique) {
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                    } @else {
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    }
                  </div>
                  <div class="alert-content">
                    <div class="alert-title">{{a.titre}}</div>
                    <div class="alert-desc">{{a.description}}</div>
                    <div class="alert-date">{{a.date}}</div>
                  </div>
                  <button class="btn btn-sm btn-primary">Résoudre</button>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .suivi-container {
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

    .btn-sm {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-xs);
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
      display: flex;
      align-items: center;
      gap: var(--space-md);
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-icon-green {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-icon-orange {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stat-icon-blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .stat-icon-red {
      background: linear-gradient(135deg, #ef4444, #dc2626);
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
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

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      padding: var(--space-md);
      text-align: left;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .data-table tr.row-warning {
      background: rgba(245, 158, 11, 0.1);
    }

    .badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .badge-secondary {
      background: rgba(107, 114, 128, 0.1);
      color: #6b7280;
    }

    .badge-primary {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .progress-display {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 150px;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--color-border);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-bar.large {
      height: 24px;
      border-radius: 12px;
    }

    .progress-fill {
      height: 100%;
      background: #3b82f6;
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .progress-fill.progress-gray {
      background: #6b7280;
    }

    .progress-fill.progress-cyan {
      background: #06b6d4;
    }

    .progress-fill.progress-blue {
      background: #3b82f6;
    }

    .progress-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .progress-section {
      margin-bottom: var(--space-2xl);
    }

    .progress-center {
      text-align: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-top: var(--space-sm);
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-2xl);
    }

    .status-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .status-label {
      font-size: 13px;
      color: var(--color-text);
    }

    .status-value {
      text-align: right;
      font-size: 12px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .time-comparison {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .time-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .time-label {
      width: 80px;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .time-bar {
      height: 24px;
      border-radius: 12px;
      flex: 1;
    }

    .time-value {
      width: 60px;
      text-align: right;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .alert-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-lg);
    }

    .alert-danger {
      background: rgba(239, 68, 68, 0.1);
    }

    .alert-warning {
      background: rgba(245, 158, 11, 0.1);
    }

    .alert-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alert-content {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .alert-title {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .alert-desc {
      font-size: 12px;
      color: var(--color-text-muted);
    }

    .alert-date {
      font-size: 11px;
      color: var(--color-text-muted);
      margin-top: var(--space-xs);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .stat-card,
    :host-context(.dark) .data-table th {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-title,
    :host-context(.dark) .data-table th,
    :host-context(.dark) .data-table td,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .status-label,
    :host-context(.dark) .status-value,
    :host-context(.dark) .time-label,
    :host-context(.dark) .time-value,
    :host-context(.dark) .alert-title {
      color: var(--color-text);
    }

    :host-context(.dark) .form-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .data-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .suivi-container {
        padding: var(--space-md);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .status-grid {
        grid-template-columns: 1fr;
      }

      .filters-bar {
        flex-direction: column;
      }

      .filters-bar .form-select,
      .filters-bar .btn {
        width: 100%;
      }
    }
  `]
})
export class ChefSuiviComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  activeTab = 'tableau';
  
  selectedProjet = '';
  projets: any[] = [];

  avancement = 0;
  tempsEstime = 0;
  tempsReel = 0;
  tauxRetard = 0;

  stats = { todo: 0, inProgress: 0, done: 0 };

  taches: any[] = [];
  displayedColumns = ['tache', 'responsable', 'statut', 'temps', 'progression', 'alerte'];

  alertes: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ id: p.id, nom: p.nom }));
        if (this.projets.length > 0 && !this.selectedProjet) {
          this.selectedProjet = this.projets[0].nom;
        }
        this.updateData();
      },
      error: () => {}
    });
    
    this.api.getTaches().subscribe({
      next: (taches) => {
        const societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId);
        this.taches = societeTaches.map((t: any, idx: number) => {
          // Utiliser les vrais assignés si disponibles
          let responsable = 'Non assigné';
          if (t.assignees && t.assignees.length > 0) {
            responsable = t.assignees[0].nom;
          } else if (t.utilisateurNom) {
            responsable = t.utilisateurNom;
          }
          
          return {
            id: t.id || idx + 1,
            titre: t.nom || t.titre || 'Tâche sans nom',
            responsable: responsable,
            statut: t.status || 'To Do',
            temps: t.tempsEstime || 0,
            progression: t.progression || (t.status === 'Done' ? 100 : t.status === 'In Progress' ? 50 : 0),
            retard: t.estEnRetard || false
          };
        });
        this.stats.done = this.taches.filter(t => t.statut === 'Done' || t.statut === 'done').length;
        this.stats.inProgress = this.taches.filter(t => t.statut === 'In Progress' || t.statut === 'inprogress').length;
        this.stats.todo = this.taches.filter(t => t.statut === 'To Do' || t.statut === 'todo').length;
        if (this.taches.length > 0) {
          this.avancement = Math.round(this.stats.done / this.taches.length * 100);
        }
      },
      error: () => {}
    });
  }

  updateData() {
    if (this.selectedProjet) {
      const projet = this.projets.find(p => p.nom === this.selectedProjet);
      this.tempsEstime = projet ? (projet.taches?.length || 10) * 8 : 80;
      this.tempsReel = Math.floor(this.tempsEstime * (1 + Math.random() * 0.3));
      this.tauxRetard = Math.round((this.tempsReel - this.tempsEstime) / this.tempsEstime * 100);
    }
    alert('Données mises à jour pour: ' + this.selectedProjet);
  }
}

