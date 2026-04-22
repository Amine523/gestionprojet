import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #dc3545, #c62828);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-bug" style="font-size: 28px;"></i>
        </div>
        <div class="flex-grow-1">
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Bugs & Qualité</h1>
          <p class="mb-0" style="opacity: 0.8;">Gérez les bugs et assures la qualité - {{societeNom}}</p>
        </div>
        <button class="btn btn-light text-danger" (click)="openAddBug()">
          <i class="bi bi-plus-lg me-2"></i>Signaler un bug
        </button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #f44336, #c62828); color: white; font-size: 22px;">
                <i class="bi bi-exclamation-triangle"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{bugsOuverts}}</div>
                <div class="text-muted" style="font-size: 12px;">Ouverts</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #ff9800, #f57c00); color: white; font-size: 22px;">
                <i class="bi bi-clock"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{bugsEnCours}}</div>
                <div class="text-muted" style="font-size: 12px;">En cours</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 22px;">
                <i class="bi bi-check-circle"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{bugsCorriges}}</div>
                <div class="text-muted" style="font-size: 12px;">Corrigés</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #4caf50, #388e3c); color: white; font-size: 22px;">
                <i class="bi bi-shield-check"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{tauxQualite}}%</div>
                <div class="text-muted" style="font-size: 12px;">Qualité</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="bugsTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="list-tab" data-bs-toggle="tab" data-bs-target="#list" type="button" role="tab">Liste des bugs</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="priority-tab" data-bs-toggle="tab" data-bs-target="#priority" type="button" role="tab">Par priorité</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="project-tab" data-bs-toggle="tab" data-bs-target="#project" type="button" role="tab">Par projet</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="list" role="tabpanel">
            <div class="d-flex gap-3 mb-4 flex-wrap">
              <div class="input-group" style="min-width: 250px;">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchBug" placeholder="Titre, description...">
              </div>
              <select class="form-select" style="width: auto;" [(ngModel)]="filterStatut">
                <option value="">Tous</option>
                <option value="Ouvert">Ouvert</option>
                <option value="En_cours">En cours</option>
                <option value="Corrigé">Corrigé</option>
              </select>
              <select class="form-select" style="width: auto;" [(ngModel)]="filterPriorite">
                <option value="">Toutes</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
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
                    <tr [class.border-start-4]="b.priorite === 'Critical'" [class.border-danger]="b.priorite === 'Critical'" [class.border-warning]="b.priorite === 'High'">
                      <td>{{b.titre}}</td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-danger]="b.priorite === 'Critical'" [class.bg-warning]="b.priorite === 'High'" [class.bg-primary]="b.priorite === 'Medium'" [class.bg-success]="b.priorite === 'Low'">{{b.priorite}}</span>
                      </td>
                      <td>
                        <span class="badge rounded-pill" [class.bg-danger]="b.statut === 'Ouvert'" [class.bg-warning]="b.statut === 'En_cours'" [class.bg-success]="b.statut === 'Corrigé'">{{b.statut}}</span>
                      </td>
                      <td>{{b.assignee || '-'}}</td>
                      <td>{{b.projet}}</td>
                      <td>{{b.date}}</td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="viewBug(b)" title="Voir détails"><i class="bi bi-eye"></i></button>
                          <button class="btn btn-sm btn-outline-secondary" (click)="editBug(b)" title="Modifier"><i class="bi bi-pencil"></i></button>
                          <button class="btn btn-sm btn-outline-info" (click)="affecterBug(b)" title="Affecter"><i class="bi bi-person-plus"></i></button>
                          @if (b.statut !== 'Corrigé') {
                            <button class="btn btn-sm btn-outline-success" (click)="corrigerBug(b)" title="Marquer corrigé"><i class="bi bi-check-circle"></i></button>
                          }
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="tab-pane fade" id="priority" role="tabpanel">
            <div class="d-flex gap-4">
              <div class="card border-0 flex-grow-1 text-center p-4" [class.bg-danger-subtle]="true">
                <div class="mb-2" style="font-size: 14px;">Critical</div>
                <div class="fw-bold" style="font-size: 32px;">{{getCountByPriority('Critical')}}</div>
              </div>
              <div class="card border-0 flex-grow-1 text-center p-4" [class.bg-warning-subtle]="true">
                <div class="mb-2" style="font-size: 14px;">High</div>
                <div class="fw-bold" style="font-size: 32px;">{{getCountByPriority('High')}}</div>
              </div>
              <div class="card border-0 flex-grow-1 text-center p-4" [class.bg-primary-subtle]="true">
                <div class="mb-2" style="font-size: 14px;">Medium</div>
                <div class="fw-bold" style="font-size: 32px;">{{getCountByPriority('Medium')}}</div>
              </div>
              <div class="card border-0 flex-grow-1 text-center p-4" [class.bg-success-subtle]="true">
                <div class="mb-2" style="font-size: 14px;">Low</div>
                <div class="fw-bold" style="font-size: 32px;">{{getCountByPriority('Low')}}</div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="project" role="tabpanel">
            <div class="d-flex flex-column gap-4">
              @for (p of projets; track p.nom) {
                <div class="card border-0 p-4" style="background: #f9f9f9;">
                  <div class="d-flex justify-content-between mb-3">
                    <span class="fw-bold">{{p.nom}}</span>
                    <span class="text-muted">{{getCountByProject(p.nom)}} bugs</span>
                  </div>
                  <div class="d-flex flex-column gap-3">
                    <div class="d-flex align-items-center gap-3">
                      <span style="width: 80px; font-size: 12px;">Ouverts</span>
                      <div class="flex-grow-1" style="height: 16px; background: #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div class="h-100" [style.width.%]="getPercentByProject(p.nom, 'Ouvert')" style="background: #f44336; border-radius: 8px;"></div>
                      </div>
                      <span style="width: 30px; text-align: right; font-weight: 600; font-size: 12px;">{{getCountByProjectStatus(p.nom, 'Ouvert')}}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span style="width: 80px; font-size: 12px;">En cours</span>
                      <div class="flex-grow-1" style="height: 16px; background: #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div class="h-100" [style.width.%]="getPercentByProject(p.nom, 'En_cours')" style="background: #ff9800; border-radius: 8px;"></div>
                      </div>
                      <span style="width: 30px; text-align: right; font-weight: 600; font-size: 12px;">{{getCountByProjectStatus(p.nom, 'En_cours')}}</span>
                    </div>
                    <div class="d-flex align-items-center gap-3">
                      <span style="width: 80px; font-size: 12px;">Corrigés</span>
                      <div class="flex-grow-1" style="height: 16px; background: #e0e0e0; border-radius: 8px; overflow: hidden;">
                        <div class="h-100" [style.width.%]="getPercentByProject(p.nom, 'Corrigé')" style="background: #4caf50; border-radius: 8px;"></div>
                      </div>
                      <span style="width: 30px; text-align: right; font-weight: 600; font-size: 12px;">{{getCountByProjectStatus(p.nom, 'Corrigé')}}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      @if (showAddBug || editingBug) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: linear-gradient(135deg, #f44336, #c62828);">
                <h5 class="modal-title">{{editingBug ? 'Modifier' : 'Signaler'}} un bug</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeForm()"></button>
              </div>
              <div class="modal-body">
                <div class="d-flex flex-column gap-3">
                  <div>
                    <label class="form-label">Titre</label>
                    <input type="text" class="form-control" [(ngModel)]="formData.titre">
                  </div>
                  <div>
                    <label class="form-label">Description</label>
                    <textarea class="form-control" [(ngModel)]="formData.description" rows="4"></textarea>
                  </div>
                  <div>
                    <label class="form-label">Priorité</label>
                    <select class="form-select" [(ngModel)]="formData.priorite">
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Projet</label>
                    <select class="form-select" [(ngModel)]="formData.projet">
                      @for (p of projets; track p.nom) {
                        <option [value]="p.nom">{{p.nom}}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Étapes pour reproduire</label>
                    <textarea class="form-control" [(ngModel)]="formData.etapes" rows="3"></textarea>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="closeForm()">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: #2196f3; border: none;" (click)="saveBug()">Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="closeForm()"></div>
      }
    </div>
  `,
  styles: [``]
})
export class ChefBugsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
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

  viewBug(b: any) { alert('Voir bug: ' + b.titre); }
  editBug(b: any) { this.editingBug = b; this.formData = { ...b }; }
  affecterBug(b: any) { alert('Affecter bug: ' + b.titre); }
  corrigerBug(b: any) {
    b.statut = 'Corrigé';
    this.calculateStats();
    alert('Bug marqué comme corrigé');
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
      alert('Veuillez entrer un titre');
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
    alert('Bug enregistré');
    this.closeForm();
  }
}

