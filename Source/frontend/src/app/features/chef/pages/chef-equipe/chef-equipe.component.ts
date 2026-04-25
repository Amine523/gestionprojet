import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="equipe-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="header-content">
          <h1 class="header-title">Gestion Équipe</h1>
          <p class="header-subtitle">Gérez les membres de votre équipe - {{societeNom}}</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{membres.length}}</div>
            <div class="stat-label">Membres</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{tachesTerminees}}</div>
            <div class="stat-label">Tâches faites</div>
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
            <div class="stat-value">{{tachesEnCours}}</div>
            <div class="stat-label">En cours</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-purple">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20M2 12h20"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{productiviteMoyenne}}%</div>
            <div class="stat-label">Productivité</div>
          </div>
        </div>
      </div>

      <!-- Tabs Card -->
      <div class="card">
        <div class="tabs">
          <button class="tab active" (click)="activeTab = 'membres'">Membres</button>
          <button class="tab" (click)="activeTab = 'performance'">Performance</button>
          <button class="tab" (click)="activeTab = 'disponibilite'">Disponibilité</button>
        </div>

        @if (activeTab === 'membres') {
          <div class="tab-content">
            <div class="tab-header">
              <div class="search-box">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" [(ngModel)]="searchQuery" placeholder="Nom, rôle...">
              </div>
              <button class="btn btn-primary" (click)="openAddMembre()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Ajouter membre
              </button>
            </div>

            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Rôle</th>
                    <th>Projet</th>
                    <th>Charge</th>
                    <th>Tâches</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (m of filteredMembres; track m.id) {
                    <tr>
                      <td>
                        <div class="member-info">
                          <div class="member-avatar">{{m.initials}}</div>
                          <span>{{m.nom}}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge">{{m.role}}</span>
                      </td>
                      <td>{{m.projet || '-'}}</td>
                      <td>
                        <div class="charge-display">
                          <div class="progress-bar">
                            <div class="progress-fill" [style.width.%]="m.charge" [ngClass]="m.charge > 80 ? 'progress-high' : ''"></div>
                          </div>
                          <span class="charge-text" [ngClass]="m.charge > 80 ? 'charge-high' : ''">{{m.charge}}%</span>
                        </div>
                      </td>
                      <td>{{m.tachesTerminees}} / {{m.tachesTotal}}</td>
                      <td>
                        <div class="action-buttons">
                          <button class="btn-icon" (click)="viewDetails(m)" title="Voir détails">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button class="btn-icon" (click)="editMembre(m)" title="Modifier">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                          </button>
                          <button class="btn-icon" (click)="affecterProjet(m)" title="Affecter à projet">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                            </svg>
                          </button>
                          <button class="btn-icon btn-danger" (click)="retirerMembre(m)" title="Retirer">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                              <line x1="9" y1="9" x2="15" y2="9"/>
                              <line x1="9" y1="13" x2="15" y2="13"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }

        @if (activeTab === 'performance') {
          <div class="tab-content">
            <h3 class="tab-title">Performance par membre</h3>
            <div class="performance-grid">
              @for (m of membres; track m.id) {
                <div class="performance-card">
                  <div class="performance-header">
                    <div class="member-avatar">{{m.initials}}</div>
                    <div>
                      <div class="member-name">{{m.nom}}</div>
                      <div class="member-role">{{m.role}}</div>
                    </div>
                  </div>
                  <div class="performance-stats">
                    <div class="perf-stat">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <div>
                        <div class="perf-value">{{m.tachesTerminees}}</div>
                        <div class="perf-label">Terminées</div>
                      </div>
                    </div>
                    <div class="perf-stat">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <div>
                        <div class="perf-value">{{m.tempsMoyen}}h</div>
                        <div class="perf-label">Temps moyen</div>
                      </div>
                    </div>
                    <div class="perf-stat">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="12" y1="20" x2="12" y2="10"/>
                        <line x1="18" y1="20" x2="18" y2="4"/>
                        <line x1="6" y1="20" x2="6" y2="16"/>
                      </svg>
                      <div>
                        <div class="perf-value">{{m.productivite}}%</div>
                        <div class="perf-label">Productivité</div>
                      </div>
                    </div>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="m.productivite"></div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        @if (activeTab === 'disponibilite') {
          <div class="tab-content">
            <h3 class="tab-title">Charge de travail</h3>
            <div class="workload-list">
              @for (m of membres; track m.id) {
                <div class="workload-item">
                  <div class="workload-info">
                    <div class="member-avatar">{{m.initials}}</div>
                    <span>{{m.nom}}</span>
                  </div>
                  <div class="workload-progress">
                    <div class="progress-bar large">
                      <div class="progress-fill" [style.width.%]="m.charge" [ngClass]="m.charge > 80 ? 'progress-high' : ''"></div>
                    </div>
                    <span class="charge-text" [ngClass]="m.charge > 80 ? 'charge-high' : ''">{{m.charge}}%</span>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showAddForm || editingMembre) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">{{editingMembre ? 'Modifier' : 'Ajouter'}} Membre</h3>
              <button class="btn-close" (click)="closeForm()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Nom</label>
                <input type="text" class="form-input" [(ngModel)]="formData.nom">
              </div>
              <div class="form-group">
                <label class="form-label">Rôle</label>
                <select class="form-input" [(ngModel)]="formData.role">
                  <option value="Développeur">Développeur</option>
                  <option value="Testeur">Testeur</option>
                  <option value="Designer">Designer</option>
                  <option value="Chef de projet">Chef de projet</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Projet</label>
                <select class="form-input" [(ngModel)]="formData.projet">
                  <option value="">Aucun</option>
                  @for (p of projets; track p.id) {
                    <option [value]="p.nom">{{p.nom}}</option>
                  }
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input type="email" class="form-input" [(ngModel)]="formData.email">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeForm()">Annuler</button>
              <button class="btn btn-primary" (click)="saveMembre()">Enregistrer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .equipe-container {
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

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
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
    }

    .stat-icon-blue {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    .stat-icon-green {
      background: linear-gradient(135deg, #10b981, #059669);
    }

    .stat-icon-orange {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    .stat-icon-purple {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    .stat-info {
      flex: 1;
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
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

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      min-width: 250px;
    }

    .search-box svg {
      color: var(--color-text-muted);
    }

    .search-box input {
      border: none;
      background: transparent;
      outline: none;
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text);
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

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-outline:hover {
      background: var(--color-bg);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--color-border);
      background: white;
      border-radius: var(--radius-md);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .btn-icon.btn-danger {
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-icon.btn-danger:hover {
      background: #ef4444;
      color: white;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: var(--color-bg);
    }

    .data-table th {
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
    }

    .data-table tbody tr {
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition-base);
    }

    .data-table tbody tr:hover {
      background: var(--color-bg);
    }

    .data-table td {
      padding: var(--space-md);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .member-avatar {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .charge-display {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 100px;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-bar.large {
      height: 16px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #1d4ed8);
      border-radius: 3px;
      transition: width var(--transition-base);
    }

    .progress-fill.progress-high {
      background: #ef4444;
    }

    .charge-text {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #3b82f6;
    }

    .charge-text.charge-high {
      color: #ef4444;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-xs);
    }

    .tab-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-lg);
    }

    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .performance-card {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      border: 1px solid var(--color-border);
    }

    .performance-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .member-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .member-role {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .performance-stats {
      display: flex;
      gap: var(--space-lg);
      margin-bottom: var(--space-md);
    }

    .perf-stat {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .perf-stat svg {
      color: #3b82f6;
    }

    .perf-value {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .perf-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .workload-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .workload-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .workload-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      width: 180px;
    }

    .workload-progress {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      flex: 1;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      width: 400px;
      max-width: 90vw;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    .modal-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .btn-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: background var(--transition-base);
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: var(--space-lg);
    }

    .form-group {
      margin-bottom: var(--space-md);
    }

    .form-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      background: white;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    /* Dark mode */
    :host-context(.dark) .stat-card,
    :host-context(.dark) .card,
    :host-context(.dark) .modal-card,
    :host-context(.dark) .performance-card,
    :host-context(.dark) .workload-item {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .stat-value,
    :host-context(.dark) .tab-title,
    :host-context(.dark) .member-name,
    :host-context(.dark) .perf-value,
    :host-context(.dark) .form-label {
      color: var(--color-text);
    }

    :host-context(.dark) .search-box,
    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .data-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .equipe-container {
        padding: var(--space-md);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tab-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .performance-grid {
        grid-template-columns: 1fr;
      }

      .workload-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .workload-info {
        width: auto;
      }

      .workload-progress {
        width: 100%;
      }
    }
  `]
})
export class ChefEquipeComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = 'Votre société';
  
  membres: any[] = [];
  projets: any[] = [];

  filteredMembres: any[] = [];
  displayedColumns = ['nom', 'role', 'projet', 'charge', 'taches', 'actions'];

  searchQuery = '';
  activeTab = 'membres';
  showAddForm = false;
  editingMembre: any = null;
  formData: any = { nom: '', role: 'Développeur', projet: '', email: '' };

  tachesTerminees = 0;
  tachesEnCours = 0;
  productiviteMoyenne = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.membres = employes.map((e: any) => {
          const stats = e.stats || {};
          return {
            id: e.id || e.Id,
            nom: e.nom || e.Nom,
            initials: (e.nom || e.Nom || 'E').charAt(0),
            role: e.poste || e.Poste || 'Collaborateur',
            projet: e.projetNom || 'Aucun',
            charge: stats.charge || 0,
            tachesTerminees: stats.tachesTerminees || 0,
            tachesTotal: stats.tachesTotal || 0,
            tempsMoyen: stats.tempsMoyen || 0,
            productivite: stats.productivite || 0
          };
        });
        this.filteredMembres = [...this.membres];
        this.calculateStats();
      },
      error: () => {}
    });
    
    const user = this.api.getCurrentUser();
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = (projets || [])
          .filter((p: any) => p.utilisateurId === user?.id)
          .map((p: any) => ({ id: p.id, nom: p.nom }));
      },
      error: () => {}
    });
  }

  calculateStats() {
    this.tachesTerminees = this.membres.reduce((sum, m) => sum + m.tachesTerminees, 0);
    this.tachesEnCours = this.membres.reduce((sum, m) => sum + (m.tachesTotal - m.tachesTerminees), 0);
    this.productiviteMoyenne = Math.round(this.membres.reduce((sum, m) => sum + m.productivite, 0) / this.membres.length);
  }

  viewDetails(m: any) { this.snackBar.open('Voir détails: ' + m.nom, 'Fermer', { duration: 3000 }); }
  editMembre(m: any) { this.editingMembre = m; this.formData = { ...m }; }
  affecterProjet(m: any) { this.snackBar.open('Affecter projet: ' + m.nom, 'Fermer', { duration: 3000 }); }
  retirerMembre(m: any) {
    if (confirm('Retirer ' + m.nom + ' de l\'équipe?')) {
      // Dans cette plateforme, retirer signifie souvent désactiver ou changer de société
      // Pour l'instant on va simplement désactiver ou notifier l'admin
      this.api.updateUtilisateur(m.id, { ...m, Actif: false }).subscribe({
        next: () => {
          this.membres = this.membres.filter(x => x.id !== m.id);
          this.filteredMembres = [...this.membres];
          this.calculateStats();
          this.snackBar.open('Membre retiré et désactivé', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du retrait', 'Fermer', { duration: 3000 })
      });
    }
  }

  openAddMembre() {
    this.formData = { nom: '', role: 'Développeur', projet: '', email: '' };
    this.showAddForm = true;
  }

  closeForm() {
    this.showAddForm = false;
    this.editingMembre = null;
  }

  saveMembre() {
    if (!this.formData.nom) {
      this.snackBar.open('Veuillez entrer un nom', 'Fermer', { duration: 3000 });
      return;
    }

    const payload = {
      nom: this.formData.nom,
      email: this.formData.email,
      poste: this.formData.role,
      societeId: this.societeId,
      typeUtilisateurId: 'T005', // Par défaut développeur
      motDePasse: '123456',
      actif: true
    };

    if (this.editingMembre) {
      this.api.updateUtilisateur(this.editingMembre.id, payload).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open('Membre mis à jour', 'Fermer', { duration: 3000 });
          this.closeForm();
        }
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.loadData();
          this.snackBar.open('Nouveau membre créé', 'Fermer', { duration: 3000 });
          this.closeForm();
        }
      });
    }
  }
}

