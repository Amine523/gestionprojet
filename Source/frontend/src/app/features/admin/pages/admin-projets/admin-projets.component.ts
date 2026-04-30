import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface Projet {
  id: string;
  nom: string;
  nomClient: string;
  chef: string;
  status: string;
  startDate: string;
  endDate: string;
  avancee: number;
  avanceeCalculee: number;
  healthScore: number;
  healthColor: string;
  endDatePredicted: string;
  membres: number;
}



@Component({
  selector: 'app-admin-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Projets</span>
          </div>
          <h1 class="header-title">
            Contrôle des <span class="gradient-text">Missions.</span>
          </h1>
          <p class="header-subtitle">
            Orchestration stratégique des projets pour {{societeNom}}.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="openAddDialog()" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle Mission
          </button>
        </div>
      </header>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (keyup.enter)="applyFilter()" placeholder="Rechercher des missions par nom...">
        </div>
        <div class="filter-selects">
          <select [(ngModel)]="filterStatut" (change)="applyFilter()">
            <option value="">Tous les Statuts</option>
            <option value="En cours">En cours</option>
            <option value="Terminé">Terminé</option>
            <option value="En attente">En attente</option>
          </select>
          <button (click)="exportExcel()" class="btn-icon" title="Excel">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="8" y1="13" x2="16" y2="13"/>
              <line x1="8" y1="17" x2="16" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </button>
          <button (click)="exportPdf()" class="btn-icon" title="PDF">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Projects Table -->
      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Client / Type</th>
              <th>Statut</th>
              <th>Commandant</th>
              <th>Unité</th>
              <th>Progression</th>
              <th>Échéance</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of projetsSignal(); track p.id) {
              <tr>
                <td>
                  <div class="project-info">
                    <span class="project-name">{{p.nom}}</span>
                  </div>
                </td>
                <td>
                  <span class="project-client">{{p.nomClient || 'Unité Interne'}}</span>
                </td>
                <td>
                  <span class="badge" [class]="getStatusClass(p.status)">{{p.status}}</span>
                </td>
                <td>
                  <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <span>{{p.chef}}</span>
                  </div>
                </td>
                <td>
                  <div class="detail-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span>{{p.membres}} Unités</span>
                  </div>
                </td>
                <td>
                  <div class="project-progress">
                    <div class="progress-header">
                      <span>{{p.avanceeCalculee}}% (Pondéré)</span>
                      <span class="health-dot" [class]="p.healthColor?.toLowerCase()" [title]="'Score Santé: ' + p.healthScore"></span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="p.avanceeCalculee" [class]="p.healthColor?.toLowerCase()"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="date-group">
                    <div class="date-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {{p.endDate | date:'dd MMM yyyy'}}
                    </div>
                    @if (p.endDatePredicted && p.status !== 'Terminé') {
                      <div class="prediction-item" [class.danger]="p.healthColor === 'Rouge'">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        IA: {{p.endDatePredicted | date:'dd MMM yyyy'}}
                      </div>
                    }
                  </div>
                </td>
                <td class="text-right">
                  <div class="project-actions">
                    <button (click)="generateReport(p)" class="btn-icon" title="Rapport d'Intelligence">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </button>
                    <button (click)="editProjet(p)" class="btn-icon" title="Configurer Mission">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button (click)="deleteProjet(p)" class="btn-icon btn-danger" title="Supprimer">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (projetsSignal().length === 0) {
          <div class="empty-state">
            <p>Aucune mission trouvée.</p>
          </div>
        }
      </div>

      <!-- Pagination Footer -->
      <footer class="pagination-footer">
        <p>Affichage de {{ (page - 1) * pageSize + 1 }} à {{ Math.min(page * pageSize, totalItems) }} sur {{ totalItems }} Entités Projets</p>
        <div class="pagination-controls">
          <select [(ngModel)]="pageSize" (change)="onPageSizeChange()">
            <option [value]="6">6 Unités/Page</option>
            <option [value]="12">12 Unités/Page</option>
            <option [value]="24">24 Unités/Page</option>
          </select>
          <div class="pagination-buttons">
            <button (click)="setPage(page - 1)" [disabled]="page === 1" class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="page-number">{{page}}</div>
            <button (click)="setPage(page + 1)" [disabled]="page * pageSize >= totalItems" class="btn-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
      </footer>

      <!-- Modal -->
      @if (showDialog) {
        <div class="modal-backdrop" (click)="closeDialog()">
           <div class="modal-container" (click)="$event.stopPropagation()">
              <div class="modal-header">
                 <div>
                    <h3>{{editingProjet ? 'SYNTHÈSE MISSION' : 'GENÈSE MISSION'}}</h3>
                    <p>Initialisation de l'Espace de Travail Stratégique</p>
                 </div>
                 <button (click)="closeDialog()" class="btn-icon">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"/>
                     <line x1="6" y1="6" x2="18" y2="18"/>
                   </svg>
                 </button>
              </div>

              <form (ngSubmit)="saveProjet()">
                 <div class="form-field">
                    <label>Nom de la Mission</label>
                    <input [(ngModel)]="formData.nom" name="nom" class="form-input" placeholder="Entrez l'identifiant de la mission...">
                 </div>
                 <div class="form-field">
                    <label>Directive de Mission</label>
                    <textarea [(ngModel)]="formData.description" name="description" class="form-input" rows="4" placeholder="Résumé de l'objectif principal..."></textarea>
                 </div>

                 <div class="form-grid">
                    <div class="form-field">
                       <label>État Opérationnel</label>
                       <select [(ngModel)]="formData.status" name="status" class="form-input">
                          <option value="En attente">En attente</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Mission Accomplie</option>
                       </select>
                    </div>
                    <div class="form-field">
                       <label>Commandant</label>
                       <select [(ngModel)]="formData.chef" name="chef" class="form-input">
                          <option value="">Sélectionner un officier lead</option>
                          @for (user of chefsSignal(); track (user.id || user.Id)) {
                            <option [value]="user.id || user.Id">{{user.nom || user.Nom}}</option>
                          }
                       </select>
                    </div>
                 </div>

                 <div class="form-grid">
                    <div class="form-field">
                       <label>Séquence de Lancement</label>
                       <input type="date" [(ngModel)]="formData.dateDebut" name="dateDebut" class="form-input">
                    </div>
                    <div class="form-field">
                       <label>Heure Zéro</label>
                       <input type="date" [(ngModel)]="formData.dateFin" name="dateFin" class="form-input">
                    </div>
                 </div>
              </form>

              <div class="modal-actions">
                 <button type="button" (click)="closeDialog()" class="btn btn-ghost">ANNULER</button>
                 <button type="button" (click)="saveProjet()" class="btn btn-primary">
                    {{editingProjet ? 'VALIDER MODIFICATIONS' : 'EXÉCUTER LANCEMENT'}}
                 </button>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-warning {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.2);
    }

    .badge-info {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #a78bfa, #8b5cf6, #7c3aed);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-actions {
      position: relative;
      z-index: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #8b5cf6;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-action {
      flex: 1;
      background: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-action:hover {
      background: #8b5cf6;
      color: white;
      border-color: #8b5cf6;
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .btn-icon.btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      color: var(--color-text);
    }

    .filter-bar {
      display: flex;
      gap: var(--space-md);
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--color-bg);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
    }

    .search-input svg {
      color: var(--color-text-muted);
    }

    .search-input input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .search-input:focus-within {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .search-input:focus-within svg {
      color: #8b5cf6;
    }

    .filter-selects {
      display: flex;
      gap: var(--space-sm);
    }

    .filter-selects select {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      cursor: pointer;
    }

    .filter-selects select:focus {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .table-wrapper {
      position: relative;
      background: white;
      border-radius: var(--radius-xl);
      overflow-x: auto;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .project-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .project-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .project-client {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .detail-item svg {
      width: 14px;
      height: 14px;
    }

    .project-progress {
      width: 100%;
      min-width: 100px;
    }

    .progress-header {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      margin-bottom: 4px;
    }

    .progress-bar {
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #7c3aed);
      border-radius: 3px;
      transition: width var(--transition-base);
    }

    .progress-fill.vert { background: linear-gradient(90deg, #10b981, #059669); }
    .progress-fill.orange { background: linear-gradient(90deg, #f59e0b, #d97706); }
    .progress-fill.rouge { background: linear-gradient(90deg, #ef4444, #dc2626); }

    .health-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-left: var(--space-xs);
    }
    .health-dot.vert { background: #10b981; box-shadow: 0 0 8px rgba(16, 185, 129, 0.5); }
    .health-dot.orange { background: #f59e0b; box-shadow: 0 0 8px rgba(245, 158, 11, 0.5); }
    .health-dot.rouge { background: #ef4444; box-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }

    .date-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .prediction-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      color: #8b5cf6;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .prediction-item.danger {
      color: #ef4444;
    }

    .date-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .date-item svg {
      width: 14px;
      height: 14px;
    }

    .text-right {
      text-align: right;
    }

    .project-actions {
      display: flex;
      gap: var(--space-xs);
      justify-content: flex-end;
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .pagination-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
    }

    .pagination-footer p {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .pagination-controls {
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }

    .pagination-controls select {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      cursor: pointer;
    }

    .pagination-buttons {
      display: flex;
      gap: var(--space-sm);
    }

    .page-number {
      width: 48px;
      height: 40px;
      background: #8b5cf6;
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .modal-container {
      width: 500px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-header h3 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .modal-header p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: #8b5cf6;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modal-container form {
      padding: var(--space-lg);
    }

    .form-field {
      margin-bottom: var(--space-md);
    }

    .form-field label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .filter-bar {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .search-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .filter-selects select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-header {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-actions {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .pagination-footer {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .filter-bar {
        flex-direction: column;
      }

      .filter-selects {
        flex-direction: column;
        width: 100%;
      }

      .filter-selects select {
        width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .pagination-footer {
        flex-direction: column;
      }
    }
  `]
})
export class AdminProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private exportService = inject(ExportService);
  private snackBar = inject(MatSnackBar);
  
  societeId: string = '';
  societeNom: string = '';
  projetsSignal = signal<Projet[]>([]);
  chefsSignal = signal<any[]>([]);

  searchQuery = '';
  filterStatut = '';
  page = 1;
  pageSize = 6;
  totalItems = 0;
  Math = Math;
  showDialog = false;
  editingProjet: any = null;
  formData: any = { nom: '', description: '', chef: '', dateDebut: '', dateFin: '', status: 'En attente' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.loadChefs();
  }

  loadChefs() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (users: any) => {
        let list: any[] = Array.isArray(users) ? users : (users?.items || []);
        const filtered = list.filter(u => {
          const typeId = (u.typeUtilisateurId || u.TypeUtilisateurId || u.typeUtilisateur?.id || u.TypeUtilisateur?.Id || '').toString().toUpperCase();
          const poste = (u.poste || u.Poste || '').toString().toUpperCase();
          const nom = (u.nom || u.Nom || '').toString().toUpperCase();
          
          return typeId === 'T004' || typeId.includes('CHEF') || poste.includes('CHEF');
        });
        console.log('AdminProjets - Chefs filtrés:', filtered.length, 'sur', list.length);
        this.chefsSignal.set(filtered);
        this.loadProjets();
      },
      error: () => {
        this.loadProjets();
      }
    });
  }

  loadProjets() {
    const condition: any = { 
      criteres: {},
      SortColumn: 'Id',
      SortOrder: 'DESC'
    };
    if (this.searchQuery) condition.criteres.Nom = this.searchQuery;
    if (this.filterStatut) condition.criteres.Status = this.filterStatut;
    if (this.societeId) condition.criteres.SocieteId = this.societeId;

    this.api.getProjetsDetailleByConditionPage(this.page, this.pageSize, condition).subscribe((res: any) => {
      if (!res) return;
      const items = res.items || [];
      const mapped = items.map((detail: any) => {
        const p = detail.projet || detail.Projet;
        const chefId = p.utilisateurId || p.UtilisateurId;
        const chef = this.chefsSignal().find(c => (c.id || c.Id) === chefId);
        const chefName = p.utilisateurNom || (chef ? `${chef.prenom || ''} ${chef.nom || ''}` : 'Non assigné');
        
        return {
          id: p.id || p.Id, 
          nom: p.nom || p.Nom, 
          nomClient: p.nomClient || p.NomClient, 
          chef: chefName, 
          status: p.status || p.Status || 'En attente',
          startDate: p.startDate || p.StartDate, 
          endDate: p.endDate || p.EndDate, 
          avancee: p.avancee || p.Avancee || 0, 
          avanceeCalculee: detail.avanceeCalculee || detail.AvanceeCalculee || 0,
          healthScore: detail.healthScore || detail.HealthScore || 0,
          healthColor: detail.healthColor || detail.HealthColor || 'Gris',
          endDatePredicted: detail.endDatePredicted || detail.EndDatePredicted || null,
          membres: p.membresCount || p.membres || 1,
          utilisateurId: chefId
        };
      });
      this.projetsSignal.set(mapped);
      this.totalItems = res.totalCount || 0;
      if (this.societeId) {
        const s = this.api.getRawStorage().societes?.find((x: any) => x.id === this.societeId);
        this.societeNom = s?.nom || '';
      }
    });
  }

  getStatusClass(s: string) {
    if (s === 'Terminé') return 'badge-success';
    if (s === 'En cours') return 'badge-info';
    return 'badge-warning';
  }

  setPage(p: number) { this.page = p; this.loadProjets(); }
  onPageSizeChange() { this.page = 1; this.loadProjets(); }
  applyFilter() { this.page = 1; this.loadProjets(); }
  exportExcel() { this.exportService.exportToExcel(this.projetsSignal(), 'Registre_Missions'); }
  exportPdf() { this.exportService.exportToPdf(['Nom', 'Statut', 'Chef'], this.projetsSignal().map(p => [p.nom, p.status, p.chef]), 'Rapport_Controle_Missions', 'Données Intelligence Mission'); }
  generateReport(project: Projet) { this.exportService.generateProjectIntelligenceReport(project, {}); }
  
  openAddDialog() { this.editingProjet = null; this.formData = { nom: '', description: '', chef: '', dateDebut: new Date().toISOString().split('T')[0], dateFin: '', status: 'En attente' }; this.showDialog = true; }
  editProjet(p: any) { this.editingProjet = p; this.formData = { ...p, dateDebut: p.startDate?.split('T')[0], dateFin: p.endDate?.split('T')[0] }; this.showDialog = true; }
  closeDialog() { this.showDialog = false; }

  saveProjet() {
    console.log('saveProjet called', this.formData);
    if (!this.formData.nom) {
      console.log('Nom is required');
      return;
    }
    const data = { 
      ...this.formData, 
      societeId: this.societeId,
      utilisateurId: this.formData.chef, 
      startDate: this.formData.dateDebut, 
      endDate: this.formData.dateFin 
    };
    
    const chefName = this.chefsSignal().find(c => c.id === data.utilisateurId)?.nom || 'Non assigné';
    console.log('Creating project with data:', data, 'chefName:', chefName);

    if (this.editingProjet) {
      this.api.updateProjet({ ...data, id: this.editingProjet.id }).subscribe(() => { 
        this.loadProjets();
        this.closeDialog(); 
      });
    } else {
      this.api.createProjet(data).subscribe((res: any) => { 
        console.log('Create response:', res);
        this.closeDialog();
        // Reload projects to ensure we have the correct data from backend
        this.loadProjets();
      }, (err) => {
        console.error('Error creating project:', err);
      });
    }
  }

  deleteProjet(p: any) {
    if (confirm('Décommissionner la mission ?')) {
      this.api.deleteProjet(p.id).subscribe({
        next: () => {
          this.snackBar.open('Mission décommissionnée', 'Fermer', { duration: 3000 });
          this.loadProjets();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
