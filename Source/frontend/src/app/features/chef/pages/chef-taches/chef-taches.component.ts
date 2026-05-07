import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, MatSnackBarModule],
  template: `
    <div class="taches-container">
      <div class="page-header gradient-bg">
        <div class="header-main">
          <h1 class="header-title">Gestion du Backlog</h1>
          <p class="header-subtitle">{{societeNom}} • Planification des Sprints & Distribution</p>
        </div>
        <button class="btn btn-premium" (click)="openAddTache()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Nouvelle Tâche
        </button>
      </div>

      <div class="kanban-board">
        @for (column of columns; track column.id) {
          <div class="kanban-column glass-panel">
            <div class="column-header">
              <div class="column-title-group">
                <div class="column-indicator" [ngClass]="column.id"></div>
                <h3 class="column-title">{{column.title}}</h3>
              </div>
              <span class="column-count-badge">{{getColumnTasks(column.id).length}}</span>
            </div>
            
            <div class="column-tasks-area" cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id" [cdkDropListConnectedTo]="connectedLists" (cdkDropListDropped)="drop($event)">
              @for (tache of getColumnTasks(column.id); track tache.id) {
                <div class="task-card-premium" cdkDrag>
                  <div class="task-priority-indicator" [ngClass]="'prio-' + (tache.priorite || 'Medium').toLowerCase()"></div>
                  
                  <div class="task-card-content">
                    <div class="task-card-top">
                      <span class="project-tag">{{tache.projetNom || 'Projet'}}</span>
                      <div class="task-actions-overlay">
                        <button class="icon-btn-sm" (click)="editTache(tache)" title="Modifier">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="icon-btn-sm danger" (click)="deleteTache(tache)" title="Supprimer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>

                    <h4 class="task-card-title">{{tache.titre || tache.nom}}</h4>
                    <p class="task-card-desc">{{tache.description}}</p>
                    
                    <div class="task-card-bottom">
                      <div class="task-assignee-box">
                        <div class="user-avatar-sm">
                          {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom.charAt(0) : '?' }}
                        </div>
                        <span class="user-name-sm">
                          {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom : '-' }}
                        </span>
                      </div>

                      <div class="task-due-date" [class.is-late]="isOverdue(tache.dateLimite || tache.dateEcheance)">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <span>{{(tache.dateLimite || tache.dateEcheance) | date:'dd MMM'}}</span>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      @if (showTacheForm || editingTache || viewingTache) {
        <div class="premium-modal-overlay" (click)="closeForm()">
          <div class="premium-modal-card" (click)="$event.stopPropagation()">
            <div class="modal-gradient-header">
              <h3 class="modal-title">{{editingTache ? 'Éditer' : 'Nouvelle'}} Tâche</h3>
              <button class="modal-close-btn" (click)="closeForm()">&times;</button>
            </div>

            <div class="modal-body">
              <div class="form-grid">
                <div class="form-field full">
                  <label>Titre de la tâche</label>
                  <input type="text" [(ngModel)]="formData.titre" placeholder="Titre descriptif...">
                </div>
                <div class="form-field full">
                  <label>Description</label>
                  <textarea [(ngModel)]="formData.description" rows="3" placeholder="Détails de la tâche..."></textarea>
                </div>
                <div class="form-field">
                  <label>Priorité</label>
                  <select [(ngModel)]="formData.priorite">
                    <option value="Low">Basse</option>
                    <option value="Medium">Moyenne</option>
                    <option value="High">Haute</option>
                  </select>
                </div>
                <div class="form-field">
                  <label>Projet</label>
                  <select [(ngModel)]="formData.projetId">
                    <option value="">Sélectionner un projet</option>
                    @for (p of projets; track p.id) {
                      <option [value]="p.id">{{p.nom}}</option>
                    }
                  </select>
                </div>
                <div class="form-field">
                  <label>Date d'échéance</label>
                  <input type="date" [(ngModel)]="formData.dateEcheance">
                </div>
                <div class="form-field">
                  <label>Assigner à</label>
                  <select [(ngModel)]="formData.assigneeId">
                    <option value="">Non assigné</option>
                    @for (m of membres; track m.id) {
                      <option [value]="m.id">{{m.nom}}</option>
                    }
                  </select>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="btn-text" (click)="closeForm()">Annuler</button>
              <button class="btn-save" (click)="saveTache()">Enregistrer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .taches-container {
      padding: 24px;
      background: #f1f5f9;
      min-height: calc(100vh - 64px);
      font-family: 'Inter', system-ui, sans-serif;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px;
      border-radius: 16px;
      color: white;
    }

    .gradient-bg {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
    }

    .header-title {
      font-size: 28px;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.5px;
    }

    .header-subtitle {
      opacity: 0.9;
      margin: 4px 0 0;
      font-size: 14px;
    }

    .btn-premium {
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: all 0.2s;
    }

    .btn-premium:hover {
      background: white;
      color: #4f46e5;
      transform: translateY(-2px);
    }

    .kanban-board {
      display: flex;
      gap: 20px;
      overflow-x: auto;
      padding-bottom: 20px;
      align-items: flex-start;
    }

    .kanban-column {
      min-width: 320px;
      flex: 1;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.8);
      border-radius: 20px;
      padding: 20px;
      max-height: calc(100vh - 220px);
      display: flex;
      flex-direction: column;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .column-title-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .column-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .column-indicator.todo { background: #94a3b8; }
    .column-indicator.inprogress { background: #3b82f6; }
    .column-indicator.done { background: #10b981; }

    .column-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0;
    }

    .column-count-badge {
      background: #e2e8f0;
      color: #475569;
      font-size: 12px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
    }

    .column-tasks-area {
      flex: 1;
      overflow-y: auto;
      min-height: 100px;
    }

    .task-card-premium {
      background: white;
      border-radius: 16px;
      margin-bottom: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #f1f5f9;
      position: relative;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .task-card-premium:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .task-priority-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
    }

    .task-priority-indicator.prio-high { background: #ef4444; }
    .task-priority-indicator.prio-medium { background: #f59e0b; }
    .task-priority-indicator.prio-low { background: #10b981; }

    .task-card-content {
      padding: 16px;
    }

    .task-card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }

    .project-tag {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      color: #6366f1;
      background: #eef2ff;
      padding: 2px 8px;
      border-radius: 4px;
    }

    .task-actions-overlay {
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .task-card-premium:hover .task-actions-overlay {
      opacity: 1;
    }

    .icon-btn-sm {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #64748b;
    }

    .icon-btn-sm:hover {
      background: #e2e8f0;
      color: #1e293b;
    }

    .icon-btn-sm.danger:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fecaca;
    }

    .task-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .task-card-desc {
      font-size: 13px;
      color: #64748b;
      margin: 0 0 16px;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .task-card-bottom {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid #f8fafc;
    }

    .task-assignee-box {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .user-avatar-sm {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #6366f1;
      color: white;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-name-sm {
      font-size: 12px;
      font-weight: 600;
      color: #475569;
    }

    .task-due-date {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
    }

    .task-due-date.is-late {
      color: #ef4444;
    }

    .premium-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .premium-modal-card {
      width: 550px;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }

    .modal-gradient-header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 24px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-close-btn {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 24px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
    }

    .modal-body { padding: 32px; }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-field.full { grid-column: span 2; }

    .form-field label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 8px;
    }

    .form-field input, .form-field select, .form-field textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-field input:focus { border-color: #6366f1; outline: none; }

    .modal-actions {
      padding: 24px 32px;
      background: #f8fafc;
      display: flex;
      justify-content: flex-end;
      gap: 16px;
    }

    .btn-text {
      background: transparent;
      border: none;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
    }

    .btn-save {
      background: #4f46e5;
      color: white;
      border: none;
      padding: 12px 32px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
    }
  `]
})
export class ChefTachesComponent implements OnInit {
  isOverdue(date: any): boolean {
    if (!date) return false;
    const d = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d < now;
  }
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
  membres: any[] = [];      // filtered for dropdown (devs/testers)
  allEmployesMap = new Map<string, string>(); // full map for name resolution
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
    forkJoin({
      projets: this.api.getProjetsBySociete(this.societeId),
      employes: this.api.getEmployesBySociete(this.societeId),
      taches: this.api.getTaches(),
      assignations: this.api.get<any>('tacheassignees/Liste').pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ projets, employes, taches, assignations }: any) => {
        // 1. Map Projets
        this.projets = (projets || [])
          .map((p: any) => ({ id: p.id || p.Id, nom: p.nom || p.Nom || p.titre || p.Titre }));
        const projetIds = new Set(this.projets.map((p: any) => String(p.id)));

        // 2. Map Employees for name resolution
        const list = employes || [];
        
        const isDevOrTester = (e: any): boolean => {
          const typeId = (e.typeUtilisateurId || e.TypeUtilisateurId || e.typeUtilisateur?.id || e.TypeUtilisateur?.Id || '').toString().toLowerCase();
          const poste  = (e.poste || e.Poste || '').toString().toLowerCase();
          return typeId === 't005' || typeId === 't006'
            || typeId === 'developpeur' || typeId === 'testeur'
            || typeId.includes('dev') || typeId.includes('test') || typeId.includes('qa')
            || poste.includes('dev') || poste.includes('test') || poste.includes('qa');
        };

        this.allEmployesMap.clear();
        list.forEach((e: any) => {
          const name = (e.nom || e.Nom || e.prenom || e.Prenom || '').trim() || e.email || e.Email || 'Utilisateur';
          this.allEmployesMap.set(String(e.id || e.Id), name);
        });

        this.membres = list
          .filter(isDevOrTester)
          .map((e: any) => ({ 
            id: e.id || e.Id, 
            nom: this.allEmployesMap.get(String(e.id || e.Id)) 
          }));

        // 3. Build Assignation Map
        const assigns = Array.isArray(assignations) ? assignations : (assignations?.value || []);
        const assignationMap = new Map<string, string[]>();
        assigns.forEach((a: any) => {
          const tid = String(a.tacheId || a.TacheId || '');
          const uid = String(a.utilisateurId || a.UtilisateurId || '');
          if (tid && uid) {
            if (!assignationMap.has(tid)) assignationMap.set(tid, []);
            assignationMap.get(tid)!.push(uid);
          }
        });

        // 4. Map and Filter Tasks
        this.taches = (taches || [])
          .filter((t: any) => {
            const pId = String(t.projetId || t.ProjetId);
            return projetIds.has(pId) || projetIds.size === 0;
          })
          .map((t: any) => {
            const taskId = String(t.id || t.Id);
            const rawStatus = (t.statut || t.Statut || t.status || t.Status || '').toLowerCase().trim();
            let normalizedStatus = 'todo';
            if (['done', 'terminé', 'terminee', 'terminée', 'terminÃ©', 'terminÃ©e'].includes(rawStatus)) normalizedStatus = 'done';
            else if (['in progress', 'en cours', 'inprogress', 'encours', 'in-progress'].includes(rawStatus)) normalizedStatus = 'inprogress';

            // Resolve assignees from both map and direct fields
            const userIds = new Set(assignationMap.get(taskId) || []);
            const directId = t.assigneeId || t.AssigneeId || t.utilisateurId || t.UtilisateurId;
            if (directId) userIds.add(String(directId));

            const assignees = Array.from(userIds).map(uid => ({
              id: uid,
              nom: this.allEmployesMap.get(String(uid)) || uid
            }));

            const pId = t.projetId || t.ProjetId;
            const proj = this.projets.find((p: any) => String(p.id) === String(pId));

            return {
              ...t,
              id: taskId,
              titre: t.titre || t.Titre || t.nom || t.Nom || 'Tâche sans titre',
              description: t.description || t.Description || '',
              statut: normalizedStatus,
              priorite: t.priorite || t.Priorite || 'Medium',
              dateLimite: t.dateLimite || t.DateLimite || t.dateFin || t.DateFin,
              projetId: pId,
              projetNom: proj ? proj.nom : 'Projet',
              assignees
            };
          });
      },
      error: (err) => {
        console.error('ChefTaches - Erreur chargement données:', err);
      }
    });
  }

  getColumnTasks(columnId: string): any[] {
    return this.taches.filter(t => (t.statut || 'todo') === columnId);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const task = event.previousContainer.data[event.previousIndex];
      const newStatus = event.container.id;
      
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      
      // Update local state
      task.statut = newStatus;
      task.status = newStatus;

      // Map to backend expected values
      let backendStatus = 'To Do';
      if (newStatus === 'inprogress') backendStatus = 'In Progress';
      else if (newStatus === 'done') backendStatus = 'Done';

      // Send to backend
      const payload = { ...task, statut: backendStatus, Statut: backendStatus };
      this.api.saveTache(payload).subscribe({
        next: () => {
          this.snackBar.open(`Statut mis à jour : ${backendStatus}`, 'Fermer', { duration: 2000 });
        },
        error: (err) => {
          console.error('ChefTaches - Erreur drag drop:', err);
          this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
          // Optionnel: On pourrait recharger les données pour annuler visuellement le changement
          this.loadData();
        }
      });
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
      this.api.deleteTache(t.id).subscribe({
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

    // Normalize statut from internal kanban ids to backend expected values
    let statutValue = 'To Do';
    if (this.editingTache) {
      const rawS = (this.editingTache.statut || this.editingTache.status || '').toLowerCase();
      if (['done', 'terminé', 'terminee', 'terminée', 'terminÃ©', 'terminÃ©e'].includes(rawS)) statutValue = 'Done';
      else if (['inprogress', 'in progress', 'en cours', 'in-progress'].includes(rawS)) statutValue = 'In Progress';
      else statutValue = 'To Do';
    }

    const taskData: any = {
      titre: this.formData.titre,
      description: this.formData.description || '',
      priorite: this.formData.priorite || 'Medium',
      statut: statutValue,
      Statut: statutValue, // Both just in case
      dateFin: (this.formData.dateEcheance && !isNaN(new Date(this.formData.dateEcheance).getTime())) ? new Date(this.formData.dateEcheance).toISOString() : null,
      projetId: this.formData.projetId,
      societeId: this.societeId,
      // Send null when no assignee selected â€” empty string causes backend issues
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
                  error: (e: any) => console.warn('Assignation nouvelle tÃ¢che:', e?.error || e)
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

