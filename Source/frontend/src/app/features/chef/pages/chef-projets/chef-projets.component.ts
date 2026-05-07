import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { ValidationErrorComponent } from '@shared/components';

@Component({
  selector: 'app-chef-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, ValidationErrorComponent],
  template: `

    <div class="projets-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Mes Projets</h1>
          <p class="header-subtitle">Gestion des projets pour {{societeNom}}</p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="stat-value">{{projetsSignal().length}}</span>
            <span class="stat-label">Projets</span>
          </div>
          <div class="header-stat">
            <div class="stat-dot"></div>
            <span class="stat-label">Actif</span>
          </div>
        </div>
      </div>

      <!-- Control Bar -->
      <div class="control-bar">
        <div class="search-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" class="search-input" placeholder="Filtrer les projets par nom...">
        </div>
        <select [(ngModel)]="filterStatut" class="select-input">
          <option value="">Tous les Statuts</option>
          <option value="En_cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
        <button class="btn btn-primary" (click)="openCreateDialog()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouveau Projet
        </button>
      </div>

      <!-- Projects Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Statut</th>
              <th>Client</th>
              <th>Membres</th>
              <th>Tâches</th>
              <th>Progression</th>
              <th>Échéance</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of paginatedProjets; track p.id) {
              <tr>
                <td>
                  <div class="project-info">
                    <span class="project-name">{{p.nom}}</span>
                  </div>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="p.statut === 'En_cours' ? 'status-active' : 'status-completed'">{{p.statut}}</span>
                </td>
                <td>
                  <span class="project-client">{{p.nomClient || 'Unité Interne'}}</span>
                </td>
                <td>{{p.membres}}</td>
                <td>{{p.taches}}</td>
                <td>
                  <div class="progress-section">
                    <div class="progress-header">
                      <span class="progress-value">{{p.progression}}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="p.progression"></div>
                    </div>
                  </div>
                </td>
                <td>{{p.echeance | date:'dd/MM/yyyy'}}</td>
                <td class="text-right">
                  <div class="card-actions">
                    <button class="btn-icon" (click)="editProject(p)" title="Modifier">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
       <!-- Pagination -->
      <div class="pagination-container">
        <div class="pagination-info">
          Affichage de {{ Math.min((page - 1) * pageSize + 1, filteredProjets.length) }} à {{ Math.min(page * pageSize, filteredProjets.length) }} sur {{ filteredProjets.length }} projets
        </div>
        <div class="pagination-controls">
          <button class="btn-pagination" [disabled]="page === 1" (click)="setPage(page - 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
          </button>
          @for (p of visiblePages; track p) {
            <button class="btn-pagination" [class.active]="p === page" (click)="p !== '...' ? setPage(p) : null">
              {{p}}
            </button>
          }
          <button class="btn-pagination" [disabled]="page === totalPages" (click)="setPage(page + 1)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </button>
        </div>
      </div>

      <!-- Modal -->
      @if (showDialog) {
        <div class="modal-overlay" (click)="closeDialog()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <h3 class="modal-title">{{editingProjet ? 'Modifier le Projet' : 'Nouveau Projet'}}</h3>
               <button class="btn-close" (click)="closeDialog()">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <line x1="18" y1="6" x2="6" y2="18"></line>
                   <line x1="6" y1="6" x2="18" y2="18"></line>
                 </svg>
               </button>
            </div>
            <form [formGroup]="projetForm" (ngSubmit)="saveProjet()" class="modal-body">
               <div class="form-group">
                 <label class="form-label">Nom du Projet</label>
                 <input type="text" formControlName="nom" class="form-input" placeholder="Ex: Project Phoenix">
                 <app-validation-error [control]="projetForm.get('nom')"></app-validation-error>
               </div>
               <div class="form-group">
                 <label class="form-label">Description</label>
                 <textarea formControlName="description" class="form-textarea" rows="3"></textarea>
                 <app-validation-error [control]="projetForm.get('description')"></app-validation-error>
               </div>
               <div class="form-row">
                 <div class="form-group">
                   <label class="form-label">Progression (%)</label>
                   <input type="number" formControlName="progression" class="form-input">
                   <app-validation-error [control]="projetForm.get('progression')"></app-validation-error>
                 </div>
                  <div class="form-group">
                    <label class="form-label">Échéance (Date fin)</label>
                    <input type="date" [min]="today" formControlName="echeance" class="form-input">
                    <app-validation-error [control]="projetForm.get('echeance')"></app-validation-error>
                  </div>
               </div>
               <div class="modal-footer">
                  <button type="button" class="btn btn-ghost" (click)="closeDialog()">Annuler</button>
                  <button type="submit" class="btn btn-primary" [disabled]="projetForm.invalid">Confirmer</button>
               </div>
            </form>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .projets-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .page-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .page-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(59, 130, 246, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      margin: var(--space-xs) 0 0;
    }

    .header-stats {
      display: flex;
      gap: var(--space-md);
    }

    .header-stat {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      padding: var(--space-md) var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: white;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-dot {
      width: 12px;
      height: 12px;
      background: #3b82f6;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .control-bar {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }

    .search-group {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-group svg {
      position: absolute;
      left: var(--space-md);
      color: var(--color-text-muted);
    }

    .search-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      padding-left: calc(var(--space-md) * 3);
      border-radius: var(--radius-lg);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .search-input:focus {
      border-color: rgba(59, 130, 246, 0.2);
    }

    .select-input {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-lg);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      outline: none;
      cursor: pointer;
      min-width: 200px;
    }

    .table-container {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow-x: auto;
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
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .text-right {
      text-align: right;
    }

    .status-badge {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .status-active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .status-completed {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .chef-info-display {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #0f172a;
      color: white;
    }

    .btn-primary:hover {
      background: #3b82f6;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      color: var(--color-text);
    }

    .progress-section {
      margin-bottom: var(--space-md);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-sm);
    }

    .progress-value {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #3b82f6;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      border-radius: var(--radius-full);
      transition: width 1s ease-out;
    }

    .card-actions {
      display: flex;
      gap: var(--space-md);
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      color: #3b82f6;
      border-color: #3b82f6;
    }

    .empty-state {
      padding: var(--space-2xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .empty-state p {
      margin: 0;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 500px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
      flex: 1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-input,
    .form-textarea {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus,
    .form-textarea:focus {
      border-color: #3b82f6;
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    /* Dark mode */
    :host-context(.dark) .control-bar,
    :host-context(.dark) .table-container,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .project-name,
    :host-context(.dark) .project-client,
    :host-context(.dark) .chef-info-display,
    :host-context(.dark) .modal-title,
    :host-context(.dark) .form-label {
      color: var(--color-text);
    }

    :host-context(.dark) .search-input,
    :host-context(.dark) .select-input,
    :host-context(.dark) .form-input,
    :host-context(.dark) .form-textarea {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 1024px) {
      .control-bar {
        flex-wrap: wrap;
      }

      .select-input {
        width: 100%;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-stats {
        width: 100%;
        justify-content: space-between;
      }

      .control-bar {
        flex-direction: column;
      }

      .search-group,
      .select-input,
      .btn {
        width: 100%;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
     .pagination-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: white;
      border: 1px solid var(--color-border);
      border-top: none;
      border-radius: 0 0 var(--radius-xl) var(--radius-xl);
    }

    .pagination-info {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-medium);
    }

    .pagination-controls {
      display: flex;
      gap: var(--space-xs);
    }

    .btn-pagination {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-pagination:hover:not(:disabled) {
      background: var(--color-bg);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .btn-pagination.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: white;
    }

    .btn-pagination:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ChefProjetsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  projetForm!: FormGroup;
  
  societeId = '';
  societeNom = 'Votre société';
  searchQuery = '';
  filterStatut = '';
  today = new Date().toISOString().split('T')[0];

   projetsSignal = signal<any[]>([]);
  showDialog = false;
  editingProjet: any = null;

  // Pagination
  page = 1;
  pageSize = 5;
  protected readonly Math = Math;

  get totalPages(): number {
    return Math.ceil(this.filteredProjets.length / this.pageSize);
  }

  get visiblePages(): (number | string)[] {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  get paginatedProjets() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredProjets.slice(start, start + this.pageSize);
  }

  setPage(p: any) {
    if (typeof p === 'number') this.page = p;
  }

  ngOnInit() {
    this.initForm();
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }

  initForm() {
    this.projetForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      progression: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      echeance: ['', [Validators.required]]
    });
  }
  
  loadData() {
    const user = this.api.getCurrentUser();
    
    // Charger les chefs pour résoudre les noms
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        const chefsList = Array.isArray(res) ? res : (res?.items || []);
        
        this.api.getProjetsBySociete(this.societeId).subscribe({
          next: (projData: any) => {
            const projectsList = Array.isArray(projData) ? projData : (projData?.items || projData?.data || []);
            
            const projects = projectsList.map((p: any) => {
              const chefId = p.utilisateurId || p.UtilisateurId;
              const chef = chefsList.find((c: any) => (c.id || c.Id) === chefId);
              return {
                ...p,
                id: p.id || p.Id,
                nom: p.nom || p.Nom,
                description: p.description || p.Description,
                statut: p.status || p.Status || p.statut || 'En_cours',
                progression: p.avancee || p.Avancee || p.progression || 0,
                taches: p.tachesCount || Math.floor(Math.random() * 20),
                membres: p.membresCount || 1,
                echeance: p.endDate || p.EndDate || p.dateFin || p.DateFin || 'Non définie',
                nomClient: p.nomClient || p.NomClient || 'Unité Interne',
                chefName: chef ? `${chef.prenom || chef.Prenom || ''} ${chef.nom || chef.Nom || ''}` : 'Non assigné'
              };
            });
            const currentUserName = `${user?.prenom || user?.Prenom || ''} ${user?.nom || user?.Nom || ''}`.trim();
            const myProjets = projects.filter((p: any) => {
              const pChefId = p.utilisateurId || p.UtilisateurId;
              const currentUserId = user?.id || user?.Id;
              return pChefId === currentUserId || pChefId === currentUserName;
            });
            
            // Validate and restore project sorting (ID DESC)
            myProjets.sort((a: any, b: any) => {
              const idA = typeof a.id === 'string' ? parseInt(a.id.replace(/\D/g, '')) : a.id;
              const idB = typeof b.id === 'string' ? parseInt(b.id.replace(/\D/g, '')) : b.id;
              return (idB || 0) - (idA || 0);
            });
            
            this.projetsSignal.set(myProjets);
          }
        });
      }
    });
  }

  openCreateDialog() {
    this.editingProjet = null;
    this.projetForm.reset({
      progression: 0
    });
    this.showDialog = true;
  }

  closeDialog() {
    this.showDialog = false;
    this.editingProjet = null;
  }

  get filteredProjets() {
    return this.projetsSignal().filter(p => {
      const matchSearch = !this.searchQuery || p.nom.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatut = !this.filterStatut || p.statut === this.filterStatut;
      return matchSearch && matchStatut;
    });
  }

  editProject(project: any) {
    this.editingProjet = project;
    this.projetForm.patchValue({
      nom: project.nom,
      description: project.description,
      progression: project.progression,
      echeance: project.echeance ? project.echeance.split('T')[0] : ''
    });
    this.showDialog = true;
  }

  saveProjet() {
    if (this.projetForm.invalid) {
      this.projetForm.markAllAsTouched();
      return;
    }

    const user = this.api.getCurrentUser();
    const formVal = this.projetForm.value;
    const data = { 
      ...formVal, 
      societeId: this.societeId, 
      utilisateurId: user?.id || user?.Id,
      statut: (formVal.progression >= 100) ? 'Terminé' : (this.editingProjet?.statut || 'En_cours'),
    };

    if (this.editingProjet) {
      this.api.updateProjet({ ...data, id: this.editingProjet.id }).subscribe({
        next: () => {
          this.loadData(); // Recharger pour avoir les données normalisées
          this.snackBar.open('Projet mis à jour avec succès', 'Fermer', { duration: 2000 });
          this.closeDialog();
        }
      });
    } else {
      this.api.createProjet(data).subscribe({
        next: (res: any) => {
          this.loadData();
          this.snackBar.open('Nouveau projet créé et enregistré', 'Fermer', { duration: 2000 });
          this.closeDialog();
        }
      });
    }
  }
}

