import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-taches',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule],
  template: `
    <div class="container-fluid p-4" style="height: 100vh; display: flex; flex-direction: column; overflow: hidden;">
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px; background: linear-gradient(135deg, #2196f3, #1976d2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Mes Engagements</h1>
          <p class="text-muted mb-0">{{societeNom}} • Excellence technique et livraison continue</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn" [class.btn-primary]="viewMode === 'kanban'" [class.btn-outline-secondary]="viewMode !== 'kanban'" (click)="viewMode = 'kanban'">
            <i class="bi bi-kanban me-2"></i>Kanban
          </button>
          <button class="btn" [class.btn-primary]="viewMode === 'list'" [class.btn-outline-secondary]="viewMode !== 'list'" (click)="viewMode = 'list'">
            <i class="bi bi-list me-2"></i>Liste
          </button>
        </div>
      </div>

      @if (viewMode === 'kanban') {
        <div class="d-flex gap-4 flex-grow-1 overflow-auto pb-4">
          @for (column of columns; track column.id) {
            <div class="card border-0 shadow-sm flex-grow-1" style="min-width: 380px; padding: 24px; background: rgba(241, 245, 249, 0.4);">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0" style="font-size: 15px; text-transform: uppercase; color: #334155;">{{column.title}}</h5>
                <span class="badge rounded-pill" style="background: white; padding: 2px 10px; font-weight: 700; color: #2196f3;">{{getColumnTasks(column.id).length}}</span>
              </div>
              
              <div cdkDropList [cdkDropListData]="getColumnTasks(column.id)" [id]="column.id" [cdkDropListConnectedTo]="connectedLists" (cdkDropListDropped)="drop($event)" class="flex-grow-1">
                @for (tache of getColumnTasks(column.id); track tache.id) {
                  <div class="card mb-3 border-0 shadow-sm" cdkDrag [class.border-primary]="activeTask?.id === tache.id" [class.border-2]="activeTask?.id === tache.id" style="cursor: pointer; transition: all 0.25s;" (click)="viewTache(tache)">
                    <div class="card-body p-0">
                      <div class="d-flex">
                        <div class="border-0 rounded-start" style="width: 4px;" [class.bg-danger]="tache.priorite.toLowerCase() === 'high'" [class.bg-warning]="tache.priorite.toLowerCase() === 'medium'" [class.bg-success]="tache.priorite.toLowerCase() === 'low'"></div>
                        <div class="flex-grow-1 p-3 position-relative">
                          <div class="fw-bold mb-2" style="font-size: 14px; color: #1e293b;">{{tache.titre}}</div>
                          <div class="d-flex gap-2 mb-3">
                            <span class="badge rounded-pill" style="font-size: 10px; font-weight: 800; text-transform: uppercase;" [class.bg-danger]="tache.priorite.toLowerCase() === 'high'" [class.bg-warning]="tache.priorite.toLowerCase() === 'medium'" [class.bg-success]="tache.priorite.toLowerCase() === 'low'">{{tache.priorite}}</span>
                            <span class="badge rounded-pill bg-secondary" style="font-size: 10px; font-weight: 700;">{{tache.projet}}</span>
                          </div>
                          
                          <div class="d-flex justify-content-between border-top pt-2" style="border-color: #f1f5f9;">
                            <div class="d-flex gap-3 text-muted" style="font-size: 11px;">
                              <span><i class="bi bi-clock"></i> {{tache.tempsEstime}}h</span>
                              <span><i class="bi bi-calendar"></i> {{tache.deadline}}</span>
                            </div>
                            <div class="d-flex gap-1 position-absolute bottom-3 end-3" (click)="$event.stopPropagation()">
                               @if (tache.statut === 'todo') {
                                  <button class="btn btn-sm" style="color: #16a34a;" (click)="startTask(tache)"><i class="bi bi-play-circle"></i></button>
                               }
                               @if (tache.statut === 'inprogress') {
                                  <button class="btn btn-sm" style="color: #d97706;" (click)="pauseTask(tache)"><i class="bi bi-pause-circle"></i></button>
                                  <button class="btn btn-sm" style="color: #2196f3;" (click)="doneTask(tache)"><i class="bi bi-check-circle"></i></button>
                               }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="card border-0 shadow-sm flex-grow-1 overflow-auto">
           <div class="card-body p-0">
             <div class="p-4 border-bottom" style="background: #f8fafc; border-radius: 16px 16px 0 0;">
               <h5 class="fw-bold mb-0" style="font-size: 16px; color: #1e293b;"><i class="bi bi-list me-2"></i>Backlog & Liste des Tâches</h5>
             </div>
             
             <div class="table-responsive">
               <table class="table table-hover mb-0">
                 <thead class="table-light">
                   <tr>
                     <th>Titre</th>
                     <th>Projet</th>
                     <th>Priorité</th>
                     <th>Statut</th>
                     <th>Deadline</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   @for (tache of taches; track tache.id) {
                     <tr class="backlog-row">
                       <td>
                         <strong>{{tache.titre}}</strong><br/>
                         <small class="text-muted">{{tache.description.substring(0, 60)}}...</small>
                       </td>
                       <td><span class="badge rounded-pill bg-secondary" style="font-size: 10px; font-weight: 700;">{{tache.projet}}</span></td>
                       <td><span class="badge rounded-pill" style="font-size: 10px; font-weight: 800; text-transform: uppercase;" [class.bg-danger]="tache.priorite.toLowerCase() === 'high'" [class.bg-warning]="tache.priorite.toLowerCase() === 'medium'" [class.bg-success]="tache.priorite.toLowerCase() === 'low'">{{tache.priorite}}</span></td>
                       <td>
                         <span class="badge rounded-pill" style="font-size: 11px; font-weight: 800; text-transform: uppercase;" [class.bg-secondary]="tache.statut === 'todo'" [class.bg-primary]="tache.statut === 'inprogress'" [class.bg-success]="tache.statut === 'done'">{{tache.statut || 'todo'}}</span>
                       </td>
                       <td>
                         <div class="text-muted" style="font-size: 11px;"><i class="bi bi-calendar me-1"></i>{{tache.deadline}}</div>
                       </td>
                       <td>
                         <button class="btn btn-sm btn-outline-primary" (click)="viewTache(tache)"><i class="bi bi-eye"></i></button>
                         @if (tache.statut === 'todo') {
                           <button class="btn btn-sm" style="color: #16a34a;" (click)="startTask(tache)" title="Démarrer"><i class="bi bi-play-circle"></i></button>
                         }
                       </td>
                     </tr>
                   }
                 </tbody>
               </table>
             </div>
             
             @if (taches.length === 0) {
               <div class="p-5 text-center text-muted">Aucune tâche dans le backlog.</div>
             }
           </div>
        </div>
      }

      @if (activeTask) {
        <div class="card border-0 shadow-sm" style="position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%); width: 500px; padding: 16px 32px; background: rgba(255,255,255,0.9); backdrop-filter: blur(20px); border: 1px solid #bbdefb;">
          <div class="d-flex align-items-center">
            <div class="rounded-circle" style="width: 12px; height: 12px; background: #2196f3; margin-right: 20px; animation: pulse 2s infinite;"></div>
            <div class="flex-grow-1">
               <div class="small fw-bold text-muted" style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Séquence de travail active</div>
               <h6 class="mb-0" style="font-size: 14px; color: #1e293b;">{{activeTask.titre}}</h6>
            </div>
            <div class="fw-bold" style="font-family: monospace; font-size: 24px; color: #2196f3; margin: 0 24px;">{{formatTime(timerSeconds)}}</div>
            <button class="btn btn-sm" style="color: #ef4444;" (click)="stopTimer()"><i class="bi bi-stop-circle"></i></button>
          </div>
        </div>
      }

      @if (viewingTache) {
        <div class="modal fade show d-block" style="background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h5 class="modal-title" style="background: linear-gradient(135deg, #2196f3, #1976d2); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Explorateur de Tâche</h5>
                <button type="button" class="btn-close" (click)="viewingTache = null"></button>
              </div>
              <div class="modal-body" style="overflow-y: auto;">
                <h4>{{viewingTache.titre}}</h4>
                <p class="text-muted">{{viewingTache.description}}</p>

                <div class="row g-4 my-4">
                  <div class="col-6">
                    <label class="small fw-bold mb-2"><i class="bi bi-terminal me-2"></i>Artifacts de livraison (Git / PR)</label>
                    <input type="text" class="form-control" [(ngModel)]="gitLink" placeholder="https://github.com/..." style="background: #f1f5f9; border: 1px solid #e2e8f0;">
                  </div>
                  <div class="col-6">
                     <label class="small fw-bold mb-2"><i class="bi bi-journal-text me-2"></i>Notes d'implémentation</label>
                     <textarea class="form-control" [(ngModel)]="techNotes" rows="3" style="background: #f1f5f9; border: 1px solid #e2e8f0;"></textarea>
                  </div>
                </div>

                <label class="fw-bold mb-3">Journal de Tâche</label>
                @for (comment of viewingTache.commentaires; track comment.id) {
                   <div class="card mb-3 border-0" style="background: #f1f5f9;">
                     <div class="card-body p-3 position-relative">
                       <span class="small fw-bold" style="color: #2196f3;">{{comment.auteur}}</span>
                       <div style="font-size: 13px; color: #334155;">{{comment.texte}}</div>
                       <span class="small text-muted position-absolute top-3 end-3">{{comment.heure}}</span>
                     </div>
                   </div>
                }
              </div>
              <div class="modal-footer">
                 <div class="input-group flex-grow-1">
                   <input type="text" class="form-control" [(ngModel)]="newComment" placeholder="Ajouter une note...">
                   <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="addComment()"><i class="bi bi-send"></i></button>
                 </div>
                 <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="saveChanges()">
                   <i class="bi bi-save me-2"></i>Mettre à jour
                 </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="viewingTache = null"></div>
      }
    </div>
  `,
  styles: [``]
})
export class DevTachesComponent implements OnInit {
  private api = inject(ApiService);
  private timerInterval: any;

  viewMode = 'kanban';

  columns = [
    { id: 'todo', title: 'To Do' },
    { id: 'inprogress', title: 'In Progress' },
    { id: 'done', title: 'Done' }
  ];

  connectedLists = ['todo', 'inprogress', 'done'];

taches: any[] = [
    { id: 1, titre: 'Implémenter auth JWT', description: 'Créer le middleware d\'authentification JWT avec refresh token', priorite: 'High', statut: 'inprogress', projet: 'API REST', deadline: 'Aujourd\'hui', tempsEstime: 4, piecesJointes: [], commentaires: [{id: 1, auteur: 'Chef', texte: 'Penser à inclure le refresh token', heure: 'Hier'}] },
    { id: 2, titre: 'Tests unitaires', description: 'Écrire les tests pour le module auth', priorite: 'Medium', statut: 'todo', projet: 'API REST', deadline: 'Demain', tempsEstime: 2, piecesJointes: [], commentaires: [] },
    { id: 3, titre: 'Page profil utilisateur', description: 'Design et implémentation du profil', priorite: 'Low', statut: 'todo', projet: 'App Mobile', deadline: '25/04', tempsEstime: 3, piecesJointes: ['mockup.png'], commentaires: [] },
    { id: 4, titre: 'Correction bug login', description: 'Debug de la validation mot de passe', priorite: 'High', statut: 'done', projet: 'App Mobile', deadline: 'Terminé', tempsEstime: 2, piecesJointes: [], commentaires: [{id: 1, auteur: 'QA', texte: 'Bug confirmé', heure: 'Mardi'}] }
  ];

  displayedColumns = ['titre', 'projet', 'priorite', 'statut', 'deadline', 'actions'];

  activeTask: any = null;
  isTimerRunning = false;
  timerSeconds = 0;
  viewingTache: any = null;
  gitLink = '';
  techNotes = '';
  tempsTravaille = 0;
  newComment = '';
  
  societeId = '';
  societeNom = '';
  compactMode = false;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPreferences();
    this.loadData();
  }

  loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    this.compactMode = prefs.dev?.compactKanban || false;
  }
  
  loadData() {
    const currentUser = this.api.getCurrentUser();
    this.api.getTaches().subscribe({
      next: (taches) => {
        let societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId);
        this.taches = societeTaches.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
        if (this.taches.length === 0) {
          this.initDefaultTasks();
        }
      },
      error: () => { this.initDefaultTasks(); }
    });
  }
  
  initDefaultTasks() {
    this.taches = [];
  }

  getColumnTasks(status: string): any[] {
    return this.taches.filter(t => t.statut === status);
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const task = event.container.data[event.currentIndex];
      task.statut = event.container.id;
    }
  }

  startTask(tache: any) {
    tache.statut = 'inprogress';
    this.activeTask = tache;
    this.startTimer();
    alert('Tâche démarrée');
  }

  pauseTask(tache: any) {
    this.stopTimer();
    alert('Tâche en pause');
  }

  doneTask(tache: any) {
    tache.statut = 'done';
    this.activeTask = null;
    this.stopTimer();
    
    // Trigger notification for Test/QA team
    this.api.createNotification(
      this.societeId, 
      'qa', 
      'Tâche Prête pour Test (QA)', 
      `La tâche "${tache.titre}" a été complétée par le développeur et attend votre validation.`
    );
    
    alert('Tâche terminée et envoyée en QA!');
  }

  viewTache(tache: any) {
    this.viewingTache = tache;
    this.gitLink = '';
    this.techNotes = tache.techNotes || '';
    this.tempsTravaille = tache.tempsTravaille || 0;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingTache) {
      this.viewingTache.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  saveChanges() {
    if (this.viewingTache) {
      this.viewingTache.gitLink = this.gitLink;
      this.viewingTache.techNotes = this.techNotes;
      this.viewingTache.tempsTravaille = this.tempsTravaille;
    }
    this.viewingTache = null;
    alert('Modifications enregistrées');
  }

  startTimer() {
    this.isTimerRunning = true;
    this.timerInterval = setInterval(() => { this.timerSeconds++; }, 1000);
  }

  stopTimer() {
    this.isTimerRunning = false;
    if (this.timerInterval) { clearInterval(this.timerInterval); }
  }

  formatTime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
}
