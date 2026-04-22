import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `

    <div class="taches-container">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="header-title">Gestion du Backlog</h1>
          <p class="header-subtitle">{{societeNom}} • Planification et distribution des sprints</p>
        </div>
        <button class="btn btn-primary" (click)="openAddTache()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle Tâche
        </button>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        @for (column of columns; track column.id) {
          <div class="kanban-column">
            <div class="column-header">
              <h3 class="column-title">{{column.title}}</h3>
              <span class="column-count">{{getColumnTasks(column.id).length}}</span>
            </div>
            
            <div class="column-tasks" cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id" [cdkDropListConnectedTo]="connectedLists" (cdkDropListDropped)="drop($event)">
              @for (tache of getColumnTasks(column.id); track tache.id) {
                <div class="task-card" cdkDrag>
                  <div class="task-priority" [ngClass]="'prio-' + (tache.priorite || 'Medium').toLowerCase()"></div>
                  <div class="task-content">
                    <div class="task-header">
                      <span class="task-title">{{tache.nom}}</span>
                    </div>
                    <p class="task-description">{{tache.description}}</p>
                    
                    <div class="task-footer">
                      <div class="task-assignee">
                        <div class="avatar">
                          {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom.charAt(0) : '?' }}
                        </div>
                        <span class="assignee-name">
                          {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom + (tache.assignees.length > 1 ? ' +' + (tache.assignees.length - 1) : '') : 'Non assigné' }}
                        </span>
                      </div>
                      <div class="task-date">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        <span>{{tache.dateEcheance | date:'dd/MM/yyyy'}}</span>
                      </div>
                    </div>

                    <div class="task-actions">
                      <button class="btn-icon" (click)="viewTache(tache)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button class="btn-icon" (click)="editTache(tache)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn-icon btn-danger" (click)="deleteTache(tache)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showTacheForm || editingTache || viewingTache) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">{{viewingTache ? 'Détails' : (editingTache ? 'Éditer' : 'Créer')}} la Tâche</h3>
              <button class="btn-close" (click)="closeForm()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            @if (viewingTache) {
              <div class="modal-body">
                <div class="info-block">
                  <label class="info-label">Description</label>
                  <p>{{viewingTache.description}}</p>
                </div>
                <div class="info-block">
                  <label class="info-label">Assigné à</label>
                  <div class="badges-list">
                    @for (a of viewingTache.assignees; track a.id) {
                      <span class="badge">{{a.nom}}</span>
                    } @empty {
                      <span class="text-muted">Aucun assigné</span>
                    }
                  </div>
                </div>
              </div>
            } @else {
              <div class="modal-body">
                <div class="form-group">
                  <label class="form-label">Titre de la tâche</label>
                  <input type="text" class="form-input" [(ngModel)]="formData.titre" placeholder="ex: Intégration Auth">
                </div>

                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-input" [(ngModel)]="formData.description" rows="3"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Priorité</label>
                    <select class="form-input" [(ngModel)]="formData.priorite">
                      <option value="Low">Basse</option>
                      <option value="Medium">Moyenne</option>
                      <option value="High">Haute</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Projet</label>
                    <select class="form-input" [(ngModel)]="formData.projetId">
                      @for (p of projets; track p.id) {
                        <option [value]="p.id">{{p.nom}}</option>
                      }
                    </select>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Date d'échéance</label>
                    <input type="date" class="form-input" [(ngModel)]="formData.dateEcheance">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Assigner à</label>
                    <select class="form-input" [(ngModel)]="formData.assigneeId">
                      <option value="">Sélectionner un membre</option>
                      @for (m of membres; track m.id) {
                        <option [value]="m.id">{{m.nom}}</option>
                      }
                    </select>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline" (click)="closeForm()">Annuler</button>
                <button class="btn btn-primary" (click)="saveTache()">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Enregistrer
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .taches-container {
      padding: var(--space-lg);
      height: calc(100vh - 64px);
      display: flex;
      flex-direction: column;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: var(--space-xl);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 var(--space-sm);
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
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
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
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
    }

    .btn-icon.btn-danger {
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-icon.btn-danger:hover {
      background: #ef4444;
      color: white;
    }

    .kanban-board {
      display: flex;
      gap: var(--space-lg);
      flex: 1;
      overflow-x: auto;
      padding-bottom: var(--space-md);
      align-items: flex-start;
    }

    .kanban-column {
      min-width: 350px;
      flex: 1;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      background: rgba(248, 250, 252, 0.5);
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      border: 1px solid var(--color-border);
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .column-title {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
      color: var(--color-text);
    }

    .column-count {
      background: rgba(107, 114, 128, 0.1);
      color: #6b7280;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .column-tasks {
      flex: 1;
      overflow-y: auto;
      min-height: 200px;
    }

    .task-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
      box-shadow: var(--shadow-sm);
      cursor: grab;
      position: relative;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .task-card:hover {
      box-shadow: var(--shadow-md);
    }

    .task-card:hover .task-actions {
      opacity: 1;
      visibility: visible;
    }

    .task-priority {
      width: 4px;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }

    .task-priority.prio-high {
      background: #ef4444;
    }

    .task-priority.prio-medium {
      background: #f59e0b;
    }

    .task-priority.prio-low {
      background: #10b981;
    }

    .task-content {
      padding: var(--space-md);
      padding-left: calc(var(--space-md) + 8px);
      position: relative;
    }

    .task-header {
      margin-bottom: var(--space-sm);
    }

    .task-title {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .task-description {
      font-size: 12px;
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .task-assignee {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #667eea;
      color: white;
      font-size: 10px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .assignee-name {
      font-size: 12px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .task-date {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: 11px;
      color: var(--color-text-muted);
    }

    .task-actions {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      background: rgba(255, 255, 255, 0.9);
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-base);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.4);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      width: 500px;
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
      background: linear-gradient(135deg, #667eea, #764ba2);
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

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .info-block {
      padding: var(--space-md);
      background: #f8fafc;
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
    }

    .info-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      color: var(--color-text-muted);
      margin-bottom: var(--space-sm);
      display: block;
    }

    .badges-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .badge {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
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
      border-color: #667eea;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    /* Dark mode */
    :host-context(.dark) .kanban-column,
    :host-context(.dark) .task-card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .column-title,
    :host-context(.dark) .task-title,
    :host-context(.dark) .assignee-name,
    :host-context(.dark) .modal-title {
      color: var(--color-text);
    }

    :host-context(.dark) .info-block {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 1024px) {
      .kanban-board {
        flex-direction: column;
      }

      .kanban-column {
        min-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .taches-container {
        padding: var(--space-md);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .form-row {
        grid-template-columns: 1fr;
      }

      .modal-card {
        width: 90vw;
      }
    }
  `]
})
export class ChefTachesComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

  taches: any[] = [
    { id: 1, titre: 'Créer la page d\'accueil', description: 'Design et implémentation de la page d\'accueil', priorite: 'High', status: 'todo', assignee: 'Ahmed Ben Ali', deadline: '10/04/2026', projet: 'Application Mobile', commentaires: [{id: 1, auteur: 'Chef', texte: 'Priorité absolue'}] },
    { id: 2, titre: 'Intégrer API REST', description: 'Connexion avec le backend', priorite: 'High', status: 'inprogress', assignee: 'Mohamed Salah', deadline: '15/04/2026', projet: 'API REST', commentaires: [] },
    { id: 3, titre: 'Tests unitaires', description: 'Écrire les tests pour le module auth', priorite: 'Medium', status: 'todo', assignee: 'Leila Amiri', deadline: '20/04/2026', projet: 'API REST', commentaires: [] },
    { id: 4, titre: 'Design dashboard', description: 'Mockups pour le dashboard admin', priorite: 'Medium', status: 'done', assignee: 'Sofia Karoui', deadline: '05/04/2026', projet: 'Dashboard', commentaires: [{id: 1, auteur: 'Chef', texte: 'Bien reçu!'}] },
    { id: 5, titre: 'Correction bugs login', description: 'Bug sur la validation du mot de passe', priorite: 'High', status: 'inprogress', assignee: 'Youssef Mejri', deadline: '08/04/2026', projet: 'Application Mobile', commentaires: [] },
    { id: 6, titre: 'Documentation API', description: 'Rédiger la doc Swagger', priorite: 'Low', status: 'todo', assignee: 'Ahmed Ben Ali', deadline: '30/04/2026', projet: 'API REST', commentaires: [] }
  ];

  membres = [
    { id: 1, nom: 'Ahmed Ben Ali' },
    { id: 2, nom: 'Sofia Karoui' },
    { id: 3, nom: 'Mohamed Salah' },
    { id: 4, nom: 'Leila Amiri' },
    { id: 5, nom: 'Youssef Mejri' }
  ];

  projets = [
    { id: 1, nom: 'Application Mobile' },
    { id: 2, nom: 'API REST' },
    { id: 3, nom: 'Dashboard' }
  ];

  showTacheForm = false;
  editingTache: any = null;
  viewingTache: any = null;
  formData: any = { titre: '', description: '', priorite: 'Medium', assigneeId: '', dateEcheance: '', projetId: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getTaches().subscribe({
      next: (taches) => {
        this.taches = (taches || []).filter((t: any) => t.societeId === this.societeId).map((t: any) => {
          // Si on a des tacheAssignees avec des Utilisateurs, on les mappe
          if (t.tacheAssignees && !t.assignees) {
            t.assignees = t.tacheAssignees
              .filter((ta: any) => ta.utilisateur)
              .map((ta: any) => ta.utilisateur);
          }
          return t;
        });
      },
      error: () => {}
    });
    
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.membres = employes.map((e: any) => ({ id: e.id, nom: e.nom }));
      },
      error: () => {}
    });
    
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets.map((p: any) => ({ id: p.id, nom: p.nom }));
      },
      error: () => {}
    });
  }

  getColumnTasks(status: string): any[] {
    return this.taches.filter(t => t.status === status);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.status = event.container.id;
    }
  }

  viewTache(t: any) { this.viewingTache = t; }
  editTache(t: any) { 
    this.editingTache = t; 
    this.formData = { 
      titre: t.nom, 
      description: t.description, 
      priorite: t.priorite || 'Medium', 
      assigneeId: t.assigneeIds && t.assigneeIds.length > 0 ? t.assigneeIds[0] : (t.tacheAssignees && t.tacheAssignees.length > 0 ? t.tacheAssignees[0].utilisateurId : ''), 
      dateEcheance: t.dateEcheance ? new Date(t.dateEcheance).toISOString().split('T')[0] : '', 
      projetId: t.projetId 
    }; 
  }
  deleteTache(t: any) {
    if (confirm('Supprimer cette tâche?')) {
      this.taches = this.taches.filter(x => x.id !== t.id);
      alert('Tâche supprimée');
    }
  }

  openAddTache() {
    this.formData = { titre: '', description: '', priorite: 'Medium', assigneeId: '', dateEcheance: '', projetId: '' };
    this.showTacheForm = true;
  }

  closeForm() {
    this.showTacheForm = false;
    this.editingTache = null;
    this.viewingTache = null;
  }

  saveTache() {
    if (!this.formData.titre) {
      alert('Veuillez entrer un titre');
      return;
    }
    if (!this.formData.projetId) {
      alert('Veuillez sélectionner un projet');
      return;
    }
    
    // Mapping frontend data to backend Tache entity
    const taskData: any = {
      nom: this.formData.titre,
      description: this.formData.description,
      priorite: this.formData.priorite,
      status: this.editingTache ? this.editingTache.status : 'todo',
      dateEcheance: (this.formData.dateEcheance && !isNaN(new Date(this.formData.dateEcheance).getTime())) ? new Date(this.formData.dateEcheance).toISOString() : null,
      projetId: this.formData.projetId,
      societeId: this.societeId,
      actif: true
    };

    if (this.editingTache) {
      taskData.id = this.editingTache.id;
    }

    // Map assignments to IDs for the DTO
    if (this.formData.assigneeId) {
      taskData.assigneeIds = [this.formData.assigneeId];
    }

    this.api.saveTache(taskData).subscribe({
      next: (res) => {
        // Trigger notification for assignee
        if (this.formData.assigneeId) {
          this.api.createNotification(
            this.societeId, 
            'task', 
            'Nouvelle Tâche Assignée', 
            `Vous avez été assigné à la tâche: ${this.formData.titre}`,
            this.formData.assigneeId
          );
        }
        alert('Tâche enregistrée avec succès');
        this.loadData();
        this.closeForm();
      },
      error: (err) => {
        console.error('Error saving task:', err);
        alert('Erreur lors de l\'enregistrement de la tâche');
      }
    });
  }
}

