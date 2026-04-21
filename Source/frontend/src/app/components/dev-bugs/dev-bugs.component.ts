import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="mb-4">
        <h1 class="fw-bold" style="font-size: 28px; color: #1a1a2e;">Mes Bugs</h1>
        <p class="text-muted">Les bugs qui me sont assignés - {{societeNom}}</p>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <i class="bi bi-exclamation-triangle" style="color: #f44336; font-size: 28px;"></i>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{stats.ouverts}}</div>
                <div class="text-muted" style="font-size: 12px;">Ouverts</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <i class="bi bi-clock" style="color: #ff9800; font-size: 28px;"></i>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{stats.enCours}}</div>
                <div class="text-muted" style="font-size: 12px;">En cours</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <i class="bi bi-check-circle" style="color: #4caf50; font-size: 28px;"></i>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{stats.corriges}}</div>
                <div class="text-muted" style="font-size: 12px;">Corrigés</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <i class="bi bi-arrow-repeat" style="color: #2196f3; font-size: 28px;"></i>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{stats.total}}</div>
                <div class="text-muted" style="font-size: 12px;">Total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex gap-3 mb-4">
        <select class="form-select" style="width: auto;" [(ngModel)]="filterProjet">
          <option value="">Tous</option>
          <option value="App Mobile">App Mobile</option>
          <option value="API REST">API REST</option>
          <option value="Dashboard">Dashboard</option>
        </select>
        <select class="form-select" style="width: auto;" [(ngModel)]="filterPriorite">
          <option value="">Toutes</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="table-responsive">
          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Titre</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Projet</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (b of filteredBugs; track b.id) {
                <tr>
                  <td>{{b.titre}}</td>
                  <td>
                    <span class="badge rounded-pill" [class.bg-danger]="b.priorite.toLowerCase() === 'critical'" [class.bg-warning]="b.priorite.toLowerCase() === 'high'" [class.bg-primary]="b.priorite.toLowerCase() === 'medium'" [class.bg-success]="b.priorite.toLowerCase() === 'low'">{{b.priorite}}</span>
                  </td>
                  <td>
                    <span class="badge rounded-pill" [class.bg-danger]="b.statut.toLowerCase() === 'ouvert'" [class.bg-warning]="b.statut.toLowerCase() === 'en cours'" [class.bg-success]="b.statut.toLowerCase() === 'corrigé'">{{b.statut}}</span>
                  </td>
                  <td>{{b.projet}}</td>
                  <td>
                    @if (b.statut !== 'Corrigé') {
                      <button class="btn btn-sm" style="background: #4caf50; color: white;" (click)="corriger(b)">
                        <i class="bi bi-check me-1"></i>Corriger
                      </button>
                    }
                    <button class="btn btn-sm btn-outline-primary" (click)="viewDetails(b)"><i class="bi bi-eye"></i></button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (viewingBug) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header" style="background: #f44336; color: white; border-radius: 16px 16px 0 0;">
                <h5 class="modal-title">Détails du bug</h5>
                <button type="button" class="btn-close" style="color: white;" (click)="viewingBug = null"></button>
              </div>
              <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                <div class="mb-4">
                  <h6 class="fw-bold mb-2">Description</h6>
                  <p class="mb-0">{{viewingBug.description}}</p>
                </div>
                <div class="mb-4">
                  <h6 class="fw-bold mb-2">Steps to reproduce</h6>
                  <ol>
                    @for (step of viewingBug.steps; track step) {
                      <li>{{step}}</li>
                    }
                  </ol>
                </div>
                <div class="row g-3 mb-4">
                  <div class="col-6">
                    <div class="small text-muted mb-1">Projet:</div>
                    <div class="fw-bold">{{viewingBug.projet}}</div>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Priorité:</div>
                    <span class="badge rounded-pill" [class.bg-danger]="viewingBug.priorite.toLowerCase() === 'critical'" [class.bg-warning]="viewingBug.priorite.toLowerCase() === 'high'" [class.bg-primary]="viewingBug.priorite.toLowerCase() === 'medium'" [class.bg-success]="viewingBug.priorite.toLowerCase() === 'low'">{{viewingBug.priorite}}</span>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Statut:</div>
                    <span class="badge rounded-pill" [class.bg-danger]="viewingBug.statut.toLowerCase() === 'ouvert'" [class.bg-warning]="viewingBug.statut.toLowerCase() === 'en cours'" [class.bg-success]="viewingBug.statut.toLowerCase() === 'corrigé'">{{viewingBug.statut}}</span>
                  </div>
                  <div class="col-6">
                    <div class="small text-muted mb-1">Créé par:</div>
                    <div class="fw-bold">{{viewingBug.createur}}</div>
                  </div>
                </div>
                <div>
                  <h6 class="fw-bold mb-3">Commentaires</h6>
                  <div class="mb-3" style="max-height: 150px; overflow-y: auto;">
                    @for (comment of viewingBug.commentaires; track comment.id) {
                      <div class="d-flex gap-2 p-3 mb-2 rounded-3" style="background: #f5f5f5;">
                        <i class="bi bi-person-circle" style="color: #666; font-size: 20px;"></i>
                        <div class="flex-grow-1">
                          <div class="fw-bold" style="font-size: 13px;">{{comment.auteur}}</div>
                          <div style="font-size: 13px;">{{comment.texte}}</div>
                        </div>
                        <span class="text-muted" style="font-size: 11px;">{{comment.heure}}</span>
                      </div>
                    }
                  </div>
                  <div class="input-group">
                    <input type="text" class="form-control" [(ngModel)]="newComment" placeholder="Votre commentaire...">
                    <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="addComment()"><i class="bi bi-send"></i></button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-outline-secondary" (click)="viewingBug = null">Fermer</button>
                @if (viewingBug.statut !== 'Corrigé') {
                  <button class="btn" style="background: #4caf50; color: white;" (click)="corriger(viewingBug); viewingBug = null">
                    <i class="bi bi-check me-1"></i> Marquer comme corrigé
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="viewingBug = null"></div>
      }
    </div>
  `,
  styles: [``]
})
export class DevBugsComponent implements OnInit {
  private api = inject(ApiService);

  filterProjet = '';
  filterPriorite = '';

stats = { ouverts: 0, enCours: 0, corriges: 0, total: 0 };

  bugs: any[] = [];

  displayedColumns = ['titre', 'priorite', 'statut', 'projet', 'actions'];
  viewingBug: any = null;
  newComment = '';
  
  societeId = '';
  societeNom = '';

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projet === this.filterProjet;
      const matchPriorite = !this.filterPriorite || b.priorite === this.filterPriorite;
      return matchProjet && matchPriorite;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const currentUser = this.api.getCurrentUser();
    this.api.getTaches().subscribe({
      next: (taches) => {
        let societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId && t.type === 'bug');
        this.bugs = societeTaches.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
        if (this.bugs.length === 0) {
          this.initDefaultBugs();
        }
        this.calculateStats();
      },
      error: () => { this.initDefaultBugs(); this.calculateStats(); }
    });
  }
  
  initDefaultBugs() {
    this.bugs = [];
  }
  
  calculateStats() {
    this.stats.ouverts = this.bugs.filter(b => b.statut === 'Ouvert').length;
    this.stats.enCours = this.bugs.filter(b => b.statut === 'En cours').length;
    this.stats.corriges = this.bugs.filter(b => b.statut === 'Corrigé').length;
    this.stats.total = this.bugs.length;
  }

  viewDetails(bug: any) {
    this.viewingBug = bug;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  corriger(bug: any) {
    bug.statut = 'Corrigé';
    this.stats.corriges++;
    this.stats.ouverts--;
    alert('Bug marqué comme corrigé');
  }
}
