import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatSnackBarModule],
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
                        <span class="task-title">{{tache.titre || tache.nom}}</span>
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
                          <span>{{(tache.dateLimite || tache.dateEcheance) | date:'dd/MM/yyyy'}}</span>
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
  private snackBar = inject(MatSnackBar);
  private notificationService = inject(NotificationService);

  societeId = '';
  societeNom = 'Votre société';
  selectedProjet: number | null = null;

  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

  taches: any[] = [];
  membres: any[] = [];
  projets: any[] = [];

  showTacheForm = false;
  editingTache: any = null;
  viewingTache: any = null;
  formData: any = { titre: '', description: '', priorite: 'Medium', assigneeId: '', dateEcheance: '', projetId: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    // Load projets for this societe first, then filter tasks by matching projetId
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = (projets || [])
          .map((p: any) => ({ id: p.id || p.Id, nom: p.nom || p.Nom || p.titre || p.Titre }));

        // Load members FIRST to have them available for task mapping
        this.api.getEmployesBySociete(this.societeId).subscribe({
          next: (res: any) => {
            const list = Array.isArray(res) ? res : (res?.items || []);
            this.membres = list
              .filter((e: any) => {
                const typeId = (e.typeUtilisateurId || e.TypeUtilisateurId || e.typeUtilisateur?.id || e.TypeUtilisateur?.Id || '').toString().toUpperCase();
                const poste = (e.poste || e.Poste || '').toString().toUpperCase();
                return typeId === 'T005' || typeId === 'T006' ||
                  typeId.includes('DEV') || typeId.includes('TEST') || typeId.includes('QA') ||
                  poste.includes('DEV') || poste.includes('TEST') || poste.includes('QA');
              })
              .map((e: any) => ({ id: e.id || e.Id, nom: (e.nom || e.Nom || '') + ' ' + (e.prenom || e.Prenom || '') }));

            // Now load tasks
            const projetIds = new Set(this.projets.map((p: any) => String(p.id)));
            this.api.getTaches().subscribe({
              next: (taches) => {
                const allTaches = (taches || [])
                  .filter((t: any) => {
                    const pId = t.projetId || t.ProjetId;
                    return projetIds.has(String(pId)) || projetIds.size === 0;
                  })
                  .map((t: any) => {
                    const rawStatus = (t.statut || t.Statut || t.status || t.Status || '').toLowerCase().trim();
                    let normalizedStatus = 'todo';
                    if (rawStatus === 'done' || rawStatus === 'terminé' || rawStatus === 'terminee' || rawStatus === 'terminée') normalizedStatus = 'done';
                    else if (rawStatus === 'in progress' || rawStatus === 'en cours' || rawStatus === 'inprogress') normalizedStatus = 'inprogress';
                    return {
                      ...t,
                      id: t.id || t.Id,
                      titre: t.titre || t.Titre,
                      description: t.description || t.Description,
                      statut: normalizedStatus,
                      priorite: t.priorite || t.Priorite || 'Medium',
                      dateLimite: t.dateLimite || t.DateLimite || t.dateFin || t.DateFin,
                      projetId: t.projetId || t.ProjetId,
                      assignees: [] // will be filled below
                    };
                  });

                this.taches = allTaches;

                // Now enrich each task with its assignees from TacheAssignation
                this.api.get<any>('tacheassignees/Liste').subscribe({
                  next: (res: any) => {
                    const assignations = Array.isArray(res) ? res : (res?.items || []);
                    const assignationMap = new Map<string, string[]>();
                    assignations.forEach((a: any) => {
                      const tid = a.tacheId || a.TacheId || '';
                      const uid = a.utilisateurId || a.UtilisateurId || '';
                      if (tid && uid) {
                        if (!assignationMap.has(tid)) assignationMap.set(tid, []);
                        assignationMap.get(tid)!.push(uid);
                      }
                    });

                    this.taches = this.taches.map((t: any) => {
                      const userIds = assignationMap.get(t.id) || [];
                      const assignees = userIds.map((uid: string) => {
                        const member = this.membres.find((m: any) => String(m.id) === String(uid));
                        return member ? { id: member.id, nom: member.nom } : { id: uid, nom: 'Inconnu' };
                      });
                      return { ...t, assignees };
                    });
                  },
                  error: () => { /* keep assignees empty if endpoint fails */ }
                });
              },
              error: () => { }
            });

          },
          error: () => { }
        });
      },
      error: () => { }
    });
  }

  getColumnTasks(columnId: string): any[] {
    return this.taches.filter(t => {
      const s = (t.statut || t.status || '').toLowerCase().trim().replace(/ /g, '');
      switch (columnId) {
        case 'todo': return s === 'todo' || s === 'todo' || s === 'todo';
        case 'inprogress': return s === 'inprogress' || s === 'encours';
        case 'done': return s === 'done' || s === 'termin\u00e9' || s === 'terminee';
        default: return s === columnId;
      }
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
      task.status = event.container.id;
      this.api.saveTache(task).subscribe();
    }
  }

  viewTache(t: any) { this.viewingTache = t; }
  editTache(t: any) {
    this.editingTache = t;
    this.formData = {
      titre: t.titre || t.nom,
      description: t.description,
      priorite: t.priorite || 'Medium',
      assigneeId: t.assignees && t.assignees.length > 0 ? t.assignees[0].id : '',
      dateEcheance: (t.dateLimite || t.dateEcheance) ? new Date(t.dateLimite || t.dateEcheance).toISOString().split('T')[0] : '',
      projetId: t.projetId
    };
  }
  deleteTache(t: any) {
    if (confirm('Supprimer cette tâche?')) {
      this.api.saveTache({ ...t, Actif: false, Id: t.id }).subscribe({
        next: () => {
          this.taches = this.taches.filter((x: any) => x.id !== t.id);
          this.snackBar.open('Tâche supprimée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 })
      });
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
      this.snackBar.open('Veuillez entrer un titre', 'Fermer', { duration: 3000 });
      return;
    }
    if (!this.formData.projetId) {
      this.snackBar.open('Veuillez sélectionner un projet', 'Fermer', { duration: 3000 });
      return;
    }

    // Mapping frontend data to backend Tache entity
    // Normalize statut from internal kanban ids to backend expected values
    let statutValue = 'To Do';
    if (this.editingTache) {
      const rawS = (this.editingTache.statut || this.editingTache.status || '').toLowerCase();
      if (rawS === 'done' || rawS === 'terminé' || rawS === 'terminée') statutValue = 'Done';
      else if (rawS === 'inprogress' || rawS === 'in progress' || rawS === 'en cours') statutValue = 'In Progress';
      else statutValue = 'To Do';
    }

    const taskData: any = {
      titre: this.formData.titre,
      description: this.formData.description || '',
      priorite: this.formData.priorite || 'Medium',
      statut: statutValue,
      dateFin: (this.formData.dateEcheance && !isNaN(new Date(this.formData.dateEcheance).getTime())) ? new Date(this.formData.dateEcheance).toISOString() : null,
      projetId: this.formData.projetId,
      societeId: this.societeId,
      // Send null when no assignee selected — empty string causes backend issues
      utilisateurId: this.formData.assigneeId ? this.formData.assigneeId : null,
      devComment: '',
      testComment: '',
      actif: true
    };

    if (this.editingTache) {
      taskData.id = this.editingTache.id;
    }

    this.api.saveTache(taskData).subscribe({
      next: () => {
        const assigneeId = taskData.utilisateurId;
        const assignee = assigneeId ? this.membres.find((m: any) => String(m.id) === String(assigneeId)) : null;

        // After save, also persist the assignation if an assignee was selected (for editing where we know the id)
        if (assigneeId && this.editingTache?.id) {
          this.api.assignerTache(this.editingTache.id, assigneeId).subscribe({
            next: () => {
              this.notificationService.notifyUser(
                assigneeId,
                'Nouvelle Tâche Assignée',
                `Le Chef de Projet vous a assigné la tâche: ${taskData.titre}`,
                'info'
              );
            },
            error: (e: any) => console.warn('Assignation:', e?.error || e)
          });
        }

        if (this.editingTache) {
          const idx = this.taches.findIndex((t: any) => t.id === this.editingTache.id);
          if (idx !== -1) {
            const rawStatus = (taskData.statut || 'To Do').toLowerCase();
            let normalizedStatus = 'todo';
            if (rawStatus === 'done' || rawStatus === 'terminé' || rawStatus === 'terminée') normalizedStatus = 'done';
            else if (rawStatus === 'in progress' || rawStatus === 'en cours' || rawStatus === 'inprogress') normalizedStatus = 'inprogress';
            this.taches[idx] = {
              ...this.taches[idx], ...taskData,
              statut: normalizedStatus,
              assignees: assignee ? [{ id: assignee.id, nom: assignee.nom }] : this.taches[idx].assignees
            };
          }
        } else {
          const newTask = {
            ...taskData,
            id: 'temp-' + Date.now(),
            statut: 'todo',
            titre: taskData.titre,
            dateLimite: taskData.dateFin,
            assignees: assignee ? [{ id: assignee.id, nom: assignee.nom }] : []
          };
          this.taches = [...this.taches, newTask];
        }

        this.snackBar.open('Tâche enregistrée avec succès', 'Fermer', { duration: 3000 });
        this.closeForm();
        // Reload to get server-assigned ID, then assign if needed
        const pendingAssigneeId = taskData.utilisateurId;
        const isNew = !this.editingTache;
        const tacheTitre = taskData.titre;

        setTimeout(() => {
          this.loadData();

          // For NEW tasks: after reload, find the just-created task by titre and assign
          if (isNew && pendingAssigneeId) {
            setTimeout(() => {
              const newT = this.taches.find((t: any) => (t.titre || t.Titre) === tacheTitre);
              if (newT?.id && !String(newT.id).startsWith('temp-')) {
                this.api.assignerTache(newT.id, pendingAssigneeId).subscribe({
                  next: () => {
                    this.notificationService.notifyUser(
                      pendingAssigneeId,
                      'Nouvelle Tâche Assignée',
                      `Le Chef de Projet vous a assigné la tâche: ${tacheTitre}`,
                      'info'
                    );
                    // Reload again to show assignee name
                    this.loadData();
                  },
                  error: (e: any) => console.warn('Assignation nouvelle tâche:', e?.error || e)
                });
              }
            }, 800);
          }
        }, 600);
      },
      error: (err) => {
        console.error('Error saving task:', err);
        this.snackBar.open('Erreur lors de l\'enregistrement de la tâche', 'Fermer', { duration: 3000 });
      }
    });
  }
}

