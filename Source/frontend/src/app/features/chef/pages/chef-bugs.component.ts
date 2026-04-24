import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="bugs-container">
      <div class="page-header gradient-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>
        <div class="header-content">
          <h1 class="page-title">Bugs & Qualité</h1>
          <p class="page-subtitle">Gérez les bugs et assurez la qualité - {{societeNom}}</p>
        </div>
        <button class="btn btn-light" (click)="openAddBug()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Signaler un bug
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-danger">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{bugsOuverts}}</span>
            <span class="stat-label">Ouverts</span>
          </div>
        </div>

        <div class="stat-card stat-warning">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{bugsEnCours}}</span>
            <span class="stat-label">En cours</span>
          </div>
        </div>

        <div class="stat-card stat-primary">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{bugsCorriges}}</span>
            <span class="stat-label">Corrigés</span>
          </div>
        </div>

        <div class="stat-card stat-success">
          <div class="stat-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{tauxQualite}}%</span>
            <span class="stat-label">Qualité</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="tabs-header">
          <button class="tab-btn active" (click)="activeTab = 'list'">Liste des bugs</button>
          <button class="tab-btn" (click)="activeTab = 'priority'">Par priorité</button>
          <button class="tab-btn" (click)="activeTab = 'project'">Par projet</button>
        </div>
        <div class="card-body">
          @if (activeTab === 'list') {
            <div class="filters-bar">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input type="text" [(ngModel)]="searchBug" placeholder="Titre, description..." class="search-input">
              </div>
              <select class="filter-select" [(ngModel)]="filterStatut">
                <option value="">Tous</option>
                <option value="Ouvert">Ouvert</option>
                <option value="En_cours">En cours</option>
                <option value="Corrigé">Corrigé</option>
              </select>
              <select class="filter-select" [(ngModel)]="filterPriorite">
                <option value="">Toutes</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Priorité</th>
                    <th>Statut</th>
                    <th>Assigné à</th>
                    <th>Projet</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (b of filteredBugs; track b.id) {
                    <tr [class.border-left-critical]="b.priorite === 'Critical'" [class.border-left-high]="b.priorite === 'High'">
                      <td>{{b.titre}}</td>
                      <td>
                        <span class="badge" [class.badge-critical]="b.priorite === 'Critical'" [class.badge-high]="b.priorite === 'High'" [class.badge-medium]="b.priorite === 'Medium'" [class.badge-low]="b.priorite === 'Low'">{{b.priorite}}</span>
                      </td>
                      <td>
                        <span class="badge" [class.badge-danger]="b.statut === 'Ouvert'" [class.badge-warning]="b.statut === 'En_cours'" [class.badge-success]="b.statut === 'Corrigé'">{{b.statut}}</span>
                      </td>
                      <td>{{b.assignee || '-'}}</td>
                      <td>{{b.projet}}</td>
                      <td>{{b.date}}</td>
                      <td>
                        <div class="action-buttons">
                          <button class="btn-icon" (click)="viewBug(b)" title="Voir détails">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          </button>
                          <button class="btn-icon" (click)="editBug(b)" title="Modifier">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                          </button>
                          <button class="btn-icon" (click)="affecterBug(b)" title="Affecter">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                              <circle cx="8.5" cy="7" r="4"></circle>
                              <line x1="20" y1="8" x2="20" y2="14"></line>
                              <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                          </button>
                          @if (b.statut !== 'Corrigé') {
                            <button class="btn-icon btn-success" (click)="corrigerBug(b)" title="Marquer corrigé">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            </button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          }

          @if (activeTab === 'priority') {
            <div class="priority-grid">
              <div class="priority-card priority-critical">
                <span class="priority-label">Critical</span>
                <span class="priority-value">{{getCountByPriority('Critical')}}</span>
              </div>
              <div class="priority-card priority-high">
                <span class="priority-label">High</span>
                <span class="priority-value">{{getCountByPriority('High')}}</span>
              </div>
              <div class="priority-card priority-medium">
                <span class="priority-label">Medium</span>
                <span class="priority-value">{{getCountByPriority('Medium')}}</span>
              </div>
              <div class="priority-card priority-low">
                <span class="priority-label">Low</span>
                <span class="priority-value">{{getCountByPriority('Low')}}</span>
              </div>
            </div>
          }

          @if (activeTab === 'project') {
            <div class="projects-list">
              @for (p of projets; track p.nom) {
                <div class="project-card">
                  <div class="project-header">
                    <span class="project-name">{{p.nom}}</span>
                    <span class="project-count">{{getCountByProject(p.nom)}} bugs</span>
                  </div>
                  <div class="project-progress">
                    <div class="progress-item">
                      <span class="progress-label">Ouverts</span>
                      <div class="progress-bar">
                        <div class="progress-fill progress-red" [style.width.%]="getPercentByProject(p.nom, 'Ouvert')"></div>
                      </div>
                      <span class="progress-value">{{getCountByProjectStatus(p.nom, 'Ouvert')}}</span>
                    </div>
                    <div class="progress-item">
                      <span class="progress-label">En cours</span>
                      <div class="progress-bar">
                        <div class="progress-fill progress-orange" [style.width.%]="getPercentByProject(p.nom, 'En_cours')"></div>
                      </div>
                      <span class="progress-value">{{getCountByProjectStatus(p.nom, 'En_cours')}}</span>
                    </div>
                    <div class="progress-item">
                      <span class="progress-label">Corrigés</span>
                      <div class="progress-bar">
                        <div class="progress-fill progress-green" [style.width.%]="getPercentByProject(p.nom, 'Corrigé')"></div>
                      </div>
                      <span class="progress-value">{{getCountByProjectStatus(p.nom, 'Corrigé')}}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      @if (showAddBug || editingBug) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header modal-header-danger">
              <h3 class="modal-title">{{editingBug ? 'Modifier' : 'Signaler'}} un bug</h3>
              <button class="btn-close" (click)="closeForm()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Titre</label>
                <input type="text" class="form-input" [(ngModel)]="formData.titre">
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input" [(ngModel)]="formData.description" rows="4"></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Priorité</label>
                <select class="form-select" [(ngModel)]="formData.priorite">
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Projet</label>
                <select class="form-select" [(ngModel)]="formData.projet">
                  @for (p of projets; track p.nom) {
                    <option [value]="p.nom">{{p.nom}}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Étapes pour reproduire</label>
                <textarea class="form-input" [(ngModel)]="formData.etapes" rows="3"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" (click)="closeForm()">Annuler</button>
              <button class="btn btn-primary" (click)="saveBug()">Enregistrer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .bugs-container {
      padding: var(--space-xl);
      background: var(--color-bg);
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-xl);
      color: white;
    }

    .gradient-header {
      background: linear-gradient(135deg, #dc3545, #c62828);
    }

    .header-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .header-content {
      flex: 1;
    }

    .page-title {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-xs);
    }

    .page-subtitle {
      opacity: 0.8;
      margin: 0;
      font-size: var(--font-size-sm);
    }

    .btn-light {
      background: white;
      color: #dc3545;
      border: none;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .stat-card.stat-danger .stat-icon {
      background: linear-gradient(135deg, #f44336, #c62828);
    }

    .stat-card.stat-warning .stat-icon {
      background: linear-gradient(135deg, #ff9800, #f57c00);
    }

    .stat-card.stat-primary .stat-icon {
      background: linear-gradient(135deg, #2196f3, #1976d2);
    }

    .stat-card.stat-success .stat-icon {
      background: linear-gradient(135deg, #4caf50, #388e3c);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .stat-label {
      font-size: 12px;
      color: var(--color-text-muted);
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .tab-btn {
      padding: var(--space-md) var(--space-lg);
      border: none;
      background: none;
      cursor: pointer;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      border-bottom: 2px solid transparent;
      transition: all var(--transition-base);
    }

    .tab-btn.active {
      color: #dc3545;
      border-bottom-color: #dc3545;
    }

    .tab-btn:hover {
      color: var(--color-text);
    }

    .card-body {
      padding: var(--space-lg);
    }

    .filters-bar {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      padding: var(--space-sm) var(--space-md);
      min-width: 250px;
    }

    .search-input {
      border: none;
      background: none;
      outline: none;
      width: 100%;
      font-size: var(--font-size-sm);
    }

    .filter-select {
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: white;
      font-size: var(--font-size-sm);
      cursor: pointer;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .data-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .border-left-critical {
      border-left: 4px solid #dc3545;
    }

    .border-left-high {
      border-left: 4px solid #ff9800;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .badge-critical {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-high {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-medium {
      background: #dbeafe;
      color: #2563eb;
    }

    .badge-low {
      background: #d1fae5;
      color: #059669;
    }

    .badge-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-xs);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: white;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
    }

    .btn-icon.btn-success {
      color: #059669;
    }

    .priority-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--space-lg);
    }

    .priority-card {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      padding: var(--space-xl);
      text-align: center;
    }

    .priority-card.priority-critical {
      background: #fee2e2;
    }

    .priority-card.priority-high {
      background: #fef3c7;
    }

    .priority-card.priority-medium {
      background: #dbeafe;
    }

    .priority-card.priority-low {
      background: #d1fae5;
    }

    .priority-label {
      font-size: 14px;
      display: block;
      margin-bottom: var(--space-sm);
    }

    .priority-value {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
    }

    .projects-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .project-card {
      background: #f9f9f9;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
    }

    .project-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-md);
    }

    .project-name {
      font-weight: var(--font-weight-bold);
    }

    .project-count {
      color: var(--color-text-muted);
    }

    .project-progress {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .progress-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .progress-label {
      width: 80px;
      font-size: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 16px;
      background: #e0e0e0;
      border-radius: 8px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 8px;
      transition: width 0.3s ease;
    }

    .progress-red {
      background: #f44336;
    }

    .progress-orange {
      background: #ff9800;
    }

    .progress-green {
      background: #4caf50;
    }

    .progress-value {
      width: 30px;
      text-align: right;
      font-weight: 600;
      font-size: 12px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-lg);
      max-width: 600px;
      width: 90%;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header-danger {
      background: linear-gradient(135deg, #f44336, #c62828);
      color: white;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--space-xs);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-header-danger .btn-close {
      color: white;
    }

    .modal-body {
      padding: var(--space-lg);
    }

    .form-group {
      margin-bottom: var(--space-lg);
    }

    .form-label {
      display: block;
      margin-bottom: var(--space-sm);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #dc3545;
    }

    .modal-footer {
      display: flex;
      gap: var(--space-md);
      justify-content: flex-end;
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .btn {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
    }

    .btn-secondary {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .btn-primary {
      background: #2196f3;
      color: white;
    }

    .btn-primary:hover {
      background: #1976d2;
    }

    /* Dark mode */
    :host-context(.dark) .bugs-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .stat-card,
    :host-context(.dark) .card,
    :host-context(.dark) .project-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tabs-header {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .data-table th {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .data-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .search-box,
    :host-context(.dark) .filter-select,
    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .modal-card {
      background: var(--color-surface);
    }
  `]
})
export class ChefBugsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  
  activeTab = 'list';
  bugs: any[] = [];

  filteredBugs: any[] = [];
  displayedColumns = ['titre', 'priorite', 'statut', 'assignee', 'projet', 'date', 'actions'];

  searchBug = '';
  filterStatut = '';
  filterPriorite = '';

  projets: any[] = [];
  membres: any[] = [];

  showAddBug = false;
  editingBug: any = null;
  formData: any = { titre: '', description: '', priorite: 'Medium', projet: '', etapes: '' };

  bugsOuverts = 0;
  bugsEnCours = 0;
  bugsCorriges = 0;
  tauxQualite = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ nom: p.nom }));
        this.generateBugs();
      },
      error: () => { this.generateBugs(); }
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.membres = employes.map((e: any) => e.nom);
      },
      error: () => {}
    });
  }
  
  generateBugs() {
    const priorites = ['Critical', 'High', 'Medium', 'Low'];
    const statuts = ['Ouvert', 'En_cours', 'Corrigé'];
    this.bugs = Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      titre: `Bug ${i + 1}`,
      priorite: priorites[Math.floor(Math.random() * 4)],
      statut: statuts[Math.floor(Math.random() * 3)],
      assignee: this.membres.length > 0 ? this.membres[Math.floor(Math.random() * this.membres.length)] : '',
      projet: this.projets.length > 0 ? this.projets[Math.floor(Math.random() * this.projets.length)].nom : 'Projet',
      date: new Date().toLocaleDateString('fr-FR')
    }));
    this.filteredBugs = [...this.bugs];
    this.calculateStats();
  }

  calculateStats() {
    this.bugsOuverts = this.bugs.filter(b => b.statut === 'Ouvert').length;
    this.bugsEnCours = this.bugs.filter(b => b.statut === 'En_cours').length;
    this.bugsCorriges = this.bugs.filter(b => b.statut === 'Corrigé').length;
    this.tauxQualite = Math.round((this.bugsCorriges / this.bugs.length) * 100);
  }

  getCountByPriority(priority: string): number {
    return this.bugs.filter(b => b.priorite === priority).length;
  }

  getCountByProject(projet: string): number {
    return this.bugs.filter(b => b.projet === projet).length;
  }

  getCountByProjectStatus(projet: string, statut: string): number {
    return this.bugs.filter(b => b.projet === projet && b.statut === statut).length;
  }

  getPercentByProject(projet: string, statut: string): number {
    const total = this.getCountByProject(projet);
    if (total === 0) return 0;
    return (this.getCountByProjectStatus(projet, statut) / total) * 100;
  }

  viewBug(b: any) { this.snackBar.open('Voir bug: ' + b.titre, 'Fermer', { duration: 3000 }); }
  editBug(b: any) { this.editingBug = b; this.formData = { ...b }; }
  affecterBug(b: any) { this.snackBar.open('Affecter bug: ' + b.titre, 'Fermer', { duration: 3000 }); }
  corrigerBug(b: any) {
    b.statut = 'Corrigé';
    this.calculateStats();
    this.snackBar.open('Bug marqué comme corrigé', 'Fermer', { duration: 3000 });
  }

  openAddBug() {
    this.formData = { titre: '', description: '', priorite: 'Medium', projet: '', etapes: '' };
    this.showAddBug = true;
  }

  closeForm() {
    this.showAddBug = false;
    this.editingBug = null;
  }

  saveBug() {
    if (!this.formData.titre) {
      this.snackBar.open('Veuillez entrer un titre', 'Fermer', { duration: 3000 });
      return;
    }
    if (this.editingBug) {
      const index = this.bugs.findIndex(b => b.id === this.editingBug.id);
      if (index >= 0) this.bugs[index] = { ...this.formData, id: this.editingBug.id };
    } else {
      this.bugs.push({ ...this.formData, id: Date.now(), statut: 'Ouvert', assignee: '', date: new Date().toLocaleDateString('fr-FR') });
    }
    this.filteredBugs = [...this.bugs];
    this.calculateStats();
    this.snackBar.open('Bug enregistré', 'Fermer', { duration: 3000 });
    this.closeForm();
  }
}

