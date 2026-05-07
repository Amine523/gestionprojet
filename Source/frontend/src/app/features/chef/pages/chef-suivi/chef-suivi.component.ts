import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chef-suivi',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
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
          <option value="" disabled>Sélectionner un projet</option>
          @for (p of projets; track p.id) {
            <option [value]="p.id">{{p.nom}}</option>
          }
        </select>
        <button class="btn btn-primary" (click)="exporter()">
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
          <button class="tab" [class.active]="activeTab === 'tableau'" (click)="activeTab = 'tableau'">Tableau de suivi</button>
          <button class="tab" [class.active]="activeTab === 'graphiques'" (click)="activeTab = 'graphiques'">Graphiques</button>
          <button class="tab" [class.active]="activeTab === 'alertes'" (click)="activeTab = 'alertes'">Alertes</button>
          <button class="tab" [class.active]="activeTab === 'feedbacks'" (click)="activeTab = 'feedbacks'">Feedbacks Client</button>
        </div>

        @if (activeTab === 'tableau') {
          <div class="tab-content">
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Titre</th>
                    <th>UtilisateurId</th>
                    <th>Statut</th>
                    <th>TempsEstime</th>
                    <th>Progression</th>
                  </tr>
                </thead>
                <tbody>
                  @for (t of paginatedTaches; track t.id) {
                    <tr [ngClass]="t.retard ? 'row-warning' : ''">
                      <td><small class="id-tag">{{t.id}}</small></td>
                      <td>{{t.titre}}</td>
                      <td>{{t.responsable || t.utilisateurId}}</td>
                      <td>
                        <span class="badge" [ngClass]="{
                          'badge-secondary': t.statut?.includes('todo') || t.statut?.includes('attente'),
                          'badge-primary': t.statut?.includes('progress') || t.statut?.includes('cours'),
                          'badge-success': t.statut?.includes('done') || t.statut?.includes('termin')
                        }">{{t.statutLabel || t.statut}}</span>
                      </td>
                      <td>{{t.tempsEstime}}h</td>
                      <td>
                        <div class="progress-display">
                          <div class="progress-bar">
                            <div class="progress-fill" [style.width.%]="t.progression"></div>
                          </div>
                          <span class="progress-text">{{t.progression}}%</span>
                        </div>
                      </td>
                    </tr>
                  }
                  @if (taches.length > 0) {
                    <tr>
                      <td colspan="6">
                        <div class="pagination-mini">
                          <button class="btn-p" [disabled]="page === 1" (click)="page = page - 1">&lt;</button>
                          <span>Page {{page}} / {{totalPages}}</span>
                          <button class="btn-p" [disabled]="page === totalPages" (click)="page = page + 1">&gt;</button>
                        </div>
                      </td>
                    </tr>
                  }
                  @if (taches.length === 0) {
                    <tr>
                      <td colspan="6" style="text-align: center; padding: var(--space-xl); color: var(--color-text-muted);">
                        Aucune tâche trouvée pour ce projet.
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
                <div class="time-bar" [style.width.%]="tempsEstime > 0 ? (tempsReel/tempsEstime)*100 : 0" style="background: #f59e0b; max-width: 100%;"></div>
                <span class="time-value">{{tempsReel}}h</span>
              </div>
            </div>
          </div>
        }

        @if (activeTab === 'alertes') {
          <div class="tab-content">
            <h3 class="tab-title">Alertes actives</h3>
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Gravité</th>
                    <th>Alerte</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (a of alertes; track a.id) {
                    <tr>
                      <td>
                        <span class="badge" [class.badge-danger]="a.critique" [class.badge-warning]="!a.critique">
                          {{a.critique ? 'CRITIQUE' : 'ATTENTION'}}
                        </span>
                      </td>
                      <td>
                        <strong>{{a.titre}}</strong><br/>
                        <small>{{a.description}}</small>
                      </td>
                      <td>{{a.date}}</td>
                      <td>
                        <button class="btn btn-sm btn-primary" (click)="resoudreAlerte(a.id)">Résoudre</button>
                      </td>
                    </tr>
                  } @empty {
                    <tr><td colspan="4" class="empty-state">Aucune alerte.</td></tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (activeTab === 'feedbacks') {
          <div class="tab-content">
            <h3 class="tab-title">Retours du client</h3>
            <div class="alerts-list">
              @for (fb of feedbacks; track fb.id) {
                <div class="alert-item" style="background: rgba(59, 130, 246, 0.1);">
                  <div class="alert-icon" style="color: #3b82f6;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                  </div>
                  <div class="alert-content">
                    <div class="alert-title">{{fb.projet}} - {{fb.type}}</div>
                    <div class="alert-desc">{{fb.message}}</div>
                    <div class="alert-date">{{fb.date}}</div>
                  </div>
                  <button class="btn btn-sm btn-primary" (click)="repondreFeedback(fb.id)">Répondre</button>
                </div>
              }
              @if (feedbacks.length === 0) {
                <p style="color: #94a3b8; text-align: center; padding: var(--space-lg);">Aucun feedback récent pour ce projet.</p>
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
      min-width: 200px;
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
      min-height: 300px;
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

     .pagination-mini {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
    }

    .btn-p {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
      background: white;
      cursor: pointer;
    }

    .btn-p:disabled { opacity: 0.5; }

    .badge-danger { background: #fee2e2; color: #ef4444; }
    .badge-warning { background: #fffbeb; color: #f59e0b; }

    .empty-state { text-align: center; color: #94a3b8; padding: 2rem; font-size: 14px; }

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
  private snackBar = inject(MatSnackBar);

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
  allRawTaches: any[] = [];
  displayedColumns = ['tache', 'responsable', 'statut', 'temps', 'progression', 'alerte'];

  alertes: any[] = [];
  feedbacks: any[] = [];
  employeeMap = new Map<string, string>();

  // Pagination
  page = 1;
  pageSize = 5;
  protected readonly Math = Math;

  get totalPages(): number {
    return Math.ceil(this.taches.length / this.pageSize) || 1;
  }

  get paginatedTaches() {
    const start = (this.page - 1) * this.pageSize;
    return this.taches.slice(start, start + this.pageSize);
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    forkJoin({
      projets: this.api.getProjetsBySociete(this.societeId),
      employes: this.api.getEmployesBySociete(this.societeId),
      taches: this.api.getTaches(),
      assignations: this.api.get<any>('tacheassignees/Liste').pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ projets, employes, taches, assignations }: any) => {
        // 1. Map Projets
        this.projets = (projets || [])
          .map((p: any) => ({
            id: String(p.id || p.Id),
            nom: p.nom || p.Nom || p.titre || p.Titre,
            chefId: String(p.utilisateurId || p.UtilisateurId || '')
          }));

        if (this.projets.length > 0 && !this.selectedProjet) {
          this.selectedProjet = this.projets[0].id;
        }

        // 2. Map Employees for name resolution
        const employeeMap = new Map<string, string>();
        
        // Add current user to map for self-resolution
        const currentUser = this.api.getCurrentUser();
        if (currentUser) {
          const cid = String(currentUser.id || currentUser.Id || '');
          const cname = ((currentUser.prenom || currentUser.Prenom || '') + ' ' + (currentUser.nom || currentUser.Nom || '')).trim() || currentUser.nom || currentUser.Nom || currentUser.email || currentUser.Email || 'Moi';
          if (cid) employeeMap.set(cid, cname);
        }

        const list = Array.isArray(employes) ? employes : (employes?.value || []);
        list.forEach((e: any) => {
          const firstName = (e.prenom || e.Prenom || '').trim();
          const lastName = (e.nom || e.Nom || '').trim();
          let name = (firstName + ' ' + lastName).trim();
          
          if (!name) name = e.nom || e.Nom || e.email || e.Email || e.utilisateurNom || e.UtilisateurNom || 'Utilisateur';
          
          employeeMap.set(String(e.id || e.Id), name);
        });

        // 3. Map Assignations
        const assigns = Array.isArray(assignations) ? assignations : (assignations?.value || assignations?.items || []);
        const assignationMap = new Map<string, string[]>();
        assigns.forEach((a: any) => {
          const tid = String(a.tacheId || a.TacheId || '');
          const uid = String(a.utilisateurId || a.UtilisateurId || '');
          if (tid && uid) {
            if (!assignationMap.has(tid)) assignationMap.set(tid, []);
            const currentUids = assignationMap.get(tid)!;
            if (!currentUids.includes(uid)) currentUids.push(uid);
          }
        });

        // 4. Store raw tasks for project-specific filtering
        this.allRawTaches = (taches || []).map((t: any) => {
          const tid = String(t.id || t.Id);
          const uids = assignationMap.get(tid) || [];
          
          // Add creator/primary user as an assignee if not already there
          const directId = t.assigneeId || t.AssigneeId || t.utilisateurId || t.UtilisateurId;
          if (directId) uids.push(String(directId));

          const uniqueUids = Array.from(new Set(uids));
          
          const creatorId = String(t.utilisateurId || t.UtilisateurId || '');
          const proj = this.projets.find(p => p.id === String(t.projetId || t.ProjetId));
          const chefId = proj?.chefId;

          let resp = t.responsable || t.Responsable || t.assigneeNom || t.AssigneeNom || t.utilisateurNom || t.UtilisateurNom || '';

          if (!resp && uniqueUids.length > 0) {
            // Prioritize assignees that are NOT the chef if there are multiple
            const nonChefUids = uniqueUids.filter(id => id !== chefId);
            const targetId = nonChefUids.length > 0 ? nonChefUids[0] : uniqueUids[0];
            resp = employeeMap.get(targetId) || '';
          }

          if (!resp && creatorId && creatorId !== chefId) {
            resp = employeeMap.get(creatorId) || '';
          }

          // If still no name, we will try to resolve it via project chef in updateData
          return {
            ...t,
            id: tid,
            projetId: String(t.projetId || t.ProjetId),
            titre: t.titre || t.Titre || t.nom || t.Nom || 'Tâche sans titre',
            responsable: resp,
            statut: (t.statut || t.Statut || t.status || t.Status || 'To Do').toLowerCase().trim(),
            tempsEstime: t.tempsEstime || t.TempsEstime || 0,
            tempsReel: t.tempsReel || t.TempsReel || 0,
            dateLimite: t.dateLimite || t.DateLimite || t.dateFin || t.DateFin
          };
        });

        this.employeeMap = employeeMap; // Store for later use in updateData
        this.updateData();
      },
      error: (err) => {
        console.error('ChefSuivi - Erreur chargement:', err);
        this.snackBar.open('Erreur de chargement des données', 'Fermer', { duration: 3000 });
      }
    });
  }

  updateData() {
    if (!this.selectedProjet) return;

    // Filter tasks for selected project
    const filteredTaches = this.allRawTaches.filter(t => t.projetId === this.selectedProjet);

    // Calculate Stats
    this.tempsEstime = filteredTaches.reduce((acc, t) => acc + (t.tempsEstime || 0), 0);
    this.tempsReel = filteredTaches.reduce((acc, t) => acc + (t.tempsReel || 0), 0);

    const doneCount = filteredTaches.filter(t => ['done', 'terminé', 'terminee', 'terminée'].includes(t.statut)).length;
    const progressCount = filteredTaches.filter(t => ['in progress', 'en cours', 'inprogress', 'encours'].includes(t.statut)).length;
    const todoCount = filteredTaches.length - doneCount - progressCount;

    this.stats = {
      todo: filteredTaches.length ? Math.round((todoCount / filteredTaches.length) * 100) : 0,
      inProgress: filteredTaches.length ? Math.round((progressCount / filteredTaches.length) * 100) : 0,
      done: filteredTaches.length ? Math.round((doneCount / filteredTaches.length) * 100) : 0
    };

    this.avancement = this.stats.done;
    this.tauxRetard = this.tempsEstime > 0 ? Math.round(Math.max(0, (this.tempsReel - this.tempsEstime) / this.tempsEstime * 100)) : 0;

    // Normalize task display
    const currentProjet = this.projets.find(p => p.id === this.selectedProjet);
    const chefName = currentProjet?.chefId ? this.employeeMap.get(currentProjet.chefId) : '';

    this.taches = filteredTaches.map(t => {
      let progress = 0;
      if (['done', 'terminé', 'terminee', 'terminée'].includes(t.statut)) progress = 100;
      else if (['in progress', 'en cours', 'inprogress', 'encours'].includes(t.statut)) progress = 50;

      const isLate = t.dateLimite ? (new Date(t.dateLimite) < new Date() && progress < 100) : false;

      let resp = t.responsable;
      if (!resp || resp === 'Non assigné' || resp === 'Utilisateur' || resp === 'Responsable') {
        resp = 'À assigner';
      }

      return {
        ...t,
        progression: progress,
        retard: isLate,
        responsable: resp,
        statutLabel: t.statut.charAt(0).toUpperCase() + t.statut.slice(1)
      };
    });

    // Mock Alerts & Feedbacks based on real data
    this.alertes = [];
    if (this.tauxRetard > 10) {
      this.alertes.push({
        id: 1,
        titre: 'Dépassement de budget temps',
        description: 'Le projet a dépassé l\'estimation de ' + this.tauxRetard + '%.',
        critique: true,
        date: 'Aujourd\'hui'
      });
    }
    this.taches.filter(t => t.retard).forEach((t, i) => {
      if (i < 2) {
        this.alertes.push({
          id: 2 + i,
          titre: 'Tâche en retard',
          description: 'La tâche "' + t.titre + '" a dépassé son échéance.',
          critique: false,
          date: 'Hier'
        });
      }
    });

    const projetObj = this.projets.find(p => p.id === this.selectedProjet);
    this.feedbacks = [
      { id: 1, projet: projetObj?.nom || 'Projet', type: 'Commentaire', message: 'Progression satisfaisante sur les derniers modules.', date: 'Aujourd\'hui' }
    ];
  }

  exporter() {
    this.snackBar.open('Exportation du rapport en cours...', 'Fermer', { duration: 2000 });
    // Simulation d'exportation
    setTimeout(() => {
      this.snackBar.open('Rapport exporté avec succès (Simulation)', 'Fermer', { duration: 3000 });
    }, 1500);
  }

  resoudreAlerte(id: any) {
    this.alertes = this.alertes.filter(a => a.id !== id);
    this.snackBar.open('Alerte marquée comme résolue', 'Fermer', { duration: 2000 });
  }

  repondreFeedback(id: any) {
    this.snackBar.open('Ouverture de la messagerie pour répondre au feedback...', 'Fermer', { duration: 2000 });
  }
}

