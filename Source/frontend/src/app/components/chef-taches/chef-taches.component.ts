import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="container-fluid p-4" style="height: calc(100vh - 64px); display: flex; flex-direction: column;">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-0" style="background: linear-gradient(135deg, #667eea, #764ba2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Gestion du Backlog</h1>
          <p class="text-muted mb-0">{{societeNom}} • Planification et distribution des sprints</p>
        </div>
        <button class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="openAddTache()">
          <i class="bi bi-plus-lg me-2"></i>Nouvelle Tâche
        </button>
      </div>

      <div class="d-flex gap-4 flex-grow-1 overflow-x-auto pb-3 align-items-start">
        @for (column of columns; track column.id) {
          <div class="card border-0 shadow-sm" style="min-width: 350px; flex: 1; max-height: 100%; display: flex; flex-direction: column; background: rgba(248, 250, 252, 0.5); padding: 20px;">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <h5 class="fw-bold mb-0 text-uppercase" style="font-size: 14px; letter-spacing: 0.5px;">{{column.title}}</h5>
              <span class="badge bg-secondary rounded-pill">{{getColumnTasks(column.id).length}}</span>
            </div>
            
            <div class="flex-grow-1 overflow-y-auto" style="min-height: 200px;" cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id" [cdkDropListConnectedTo]="connectedLists" (cdkDropListDropped)="drop($event)">
              @for (tache of getColumnTasks(column.id); track tache.id) {
                <div class="card mb-3 border-0 shadow-sm" cdkDrag style="cursor: grab;">
                  <div class="d-flex overflow-hidden rounded-3" style="position: relative;">
                    <div [class]="'prio-' + (tache.priorite || 'Medium').toLowerCase()" style="width: 4px; height: 100%;"></div>
                    <div class="flex-grow-1 p-3" style="position: relative;">
                      <div>
                        <span class="fw-bold d-block mb-2" style="font-size: 14px;">{{tache.nom}}</span>
                        <p class="text-muted small mb-3" style="font-size: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{tache.description}}</p>
                      </div>
                      
                      <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center gap-2">
                          <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 24px; height: 24px; background: #667eea; color: white; font-size: 10px; font-weight: 800;">
                            {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom.charAt(0) : '?' }}
                          </div>
                          <span class="small fw-bold" style="font-size: 12px;">
                            {{ (tache.assignees && tache.assignees.length > 0) ? tache.assignees[0].nom + (tache.assignees.length > 1 ? ' +' + (tache.assignees.length - 1) : '') : 'Non assigné' }}
                          </span>
                        </div>
                        <div class="d-flex align-items-center gap-1 text-muted" style="font-size: 11px;">
                          <i class="bi bi-calendar"></i>
                          <span>{{tache.dateEcheance | date:'dd/MM/yyyy'}}</span>
                        </div>
                      </div>

                      <div class="position-absolute top-0 end-0 bottom-0 start-0 d-flex align-items-center justify-content-center gap-2" style="background: rgba(255,255,255,0.9); opacity: 0; transition: opacity 0.2s; visibility: hidden;">
                        <button class="btn btn-sm btn-outline-primary" (click)="viewTache(tache)"><i class="bi bi-eye"></i></button>
                        <button class="btn btn-sm btn-outline-secondary" (click)="editTache(tache)"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger" (click)="deleteTache(tache)"><i class="bi bi-trash"></i></button>
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
        <div class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                <h5 class="modal-title">{{viewingTache ? 'Détails' : (editingTache ? 'Éditer' : 'Créer')}} la Tâche</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeForm()"></button>
              </div>

              @if (viewingTache) {
                <div class="modal-body">
                  <div class="mb-3 p-3 rounded-3" style="background: #f8fafc;">
                    <label class="small fw-bold text-uppercase text-muted d-block mb-2">Description</label>
                    <p>{{viewingTache.description}}</p>
                  </div>
                  <div class="p-3 rounded-3" style="background: #f8fafc;">
                    <label class="small fw-bold text-uppercase text-muted d-block mb-2">Assigné à</label>
                    <div class="d-flex flex-wrap gap-2">
                      @for (a of viewingTache.assignees; track a.id) {
                        <span class="badge bg-primary">{{a.nom}}</span>
                      } @empty {
                        <span class="text-muted">Aucun assigné</span>
                      }
                    </div>
                  </div>
                </div>
              } @else {
                <div class="modal-body">
                  <div class="d-flex flex-column gap-3">
                    <div>
                      <label class="form-label">Titre de la tâche</label>
                      <input type="text" class="form-control" [(ngModel)]="formData.titre" placeholder="ex: Intégration Auth">
                    </div>

                    <div>
                      <label class="form-label">Description</label>
                      <textarea class="form-control" [(ngModel)]="formData.description" rows="3"></textarea>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <label class="form-label">Priorité</label>
                        <select class="form-select" [(ngModel)]="formData.priorite">
                          <option value="Low">Basse</option>
                          <option value="Medium">Moyenne</option>
                          <option value="High">Haute</option>
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Projet</label>
                        <select class="form-select" [(ngModel)]="formData.projetId">
                          @for (p of projets; track p.id) {
                            <option [value]="p.id">{{p.nom}}</option>
                          }
                        </select>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-6">
                        <label class="form-label">Date d'échéance</label>
                        <input type="date" class="form-control" [(ngModel)]="formData.dateEcheance">
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">Assigner à</label>
                        <select class="form-select" [(ngModel)]="formData.assigneeId">
                          <option value="">Sélectionner un membre</option>
                          @for (m of membres; track m.id) {
                            <option [value]="m.id">{{m.nom}}</option>
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-outline-secondary" (click)="closeForm()">Annuler</button>
                  <button type="button" class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="saveTache()">
                    <i class="bi bi-check me-2"></i>Enregistrer
                  </button>
                </div>
              }
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="closeForm()"></div>
      }
    </div>
  `,
  styles: [`
    .prio-high { background: #dc3545; }
    .prio-medium { background: #ffc107; }
    .prio-low { background: #28a745; }
    .card:hover .position-absolute { opacity: 1; visibility: visible; }
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
