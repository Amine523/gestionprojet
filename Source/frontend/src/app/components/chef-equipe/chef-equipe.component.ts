import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-people" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Gestion Équipe</h1>
          <p class="mb-0" style="opacity: 0.8;">Gérez les membres de votre équipe - {{societeNom}}</p>
        </div>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 22px;">
                <i class="bi bi-people"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{membres.length}}</div>
                <div class="text-muted" style="font-size: 12px;">Membres</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #4caf50, #388e3c); color: white; font-size: 22px;">
                <i class="bi bi-check-circle"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{tachesTerminees}}</div>
                <div class="text-muted" style="font-size: 12px;">Tâches faites</div>
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
                <div class="fw-bold" style="font-size: 24px;">{{tachesEnCours}}</div>
                <div class="text-muted" style="font-size: 12px;">En cours</div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; background: linear-gradient(135deg, #9c27b0, #7b1fa2); color: white; font-size: 22px;">
                <i class="bi bi-speedometer2"></i>
              </div>
              <div>
                <div class="fw-bold" style="font-size: 24px;">{{productiviteMoyenne}}%</div>
                <div class="text-muted" style="font-size: 12px;">Productivité</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="equipeTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="membres-tab" data-bs-toggle="tab" data-bs-target="#membres" type="button" role="tab">Membres</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="performance-tab" data-bs-toggle="tab" data-bs-target="#performance" type="button" role="tab">Performance</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="disponibilite-tab" data-bs-toggle="tab" data-bs-target="#disponibilite" type="button" role="tab">Disponibilité</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="membres" role="tabpanel">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div class="input-group" style="min-width: 250px;">
                <span class="input-group-text bg-light border-end-0"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control border-start-0 bg-light" [(ngModel)]="searchQuery" placeholder="Nom, rôle...">
              </div>
              <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="openAddMembre()">
                <i class="bi bi-person-plus me-2"></i>Ajouter membre
              </button>
            </div>

            <div class="table-responsive">
              <table class="table table-hover align-middle">
                <thead class="table-light">
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
                        <div class="d-flex align-items-center gap-3">
                          <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 12px; font-weight: 600;">{{m.initials}}</div>
                          <span>{{m.nom}}</span>
                        </div>
                      </td>
                      <td>
                        <span class="badge rounded-pill bg-primary">{{m.role}}</span>
                      </td>
                      <td>{{m.projet || '-'}}</td>
                      <td>
                        <div class="d-flex align-items-center gap-2" style="width: 100px;">
                          <div class="progress flex-grow-1" style="height: 6px;">
                            <div class="progress-bar" [style.width.%]="m.charge" [style.background]="m.charge > 80 ? '#dc3545' : '#2196f3'"></div>
                          </div>
                          <span class="small fw-bold">{{m.charge}}%</span>
                        </div>
                      </td>
                      <td>{{m.tachesTerminees}} / {{m.tachesTotal}}</td>
                      <td>
                        <div class="btn-group">
                          <button class="btn btn-sm btn-outline-primary" (click)="viewDetails(m)" title="Voir détails"><i class="bi bi-eye"></i></button>
                          <button class="btn btn-sm btn-outline-secondary" (click)="editMembre(m)" title="Modifier"><i class="bi bi-pencil"></i></button>
                          <button class="btn btn-sm btn-outline-info" (click)="affecterProjet(m)" title="Affecter à projet"><i class="bi bi-clipboard"></i></button>
                          <button class="btn btn-sm btn-outline-danger" (click)="retirerMembre(m)" title="Retirer"><i class="bi bi-person-dash"></i></button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <div class="tab-pane fade" id="performance" role="tabpanel">
            <h4 class="fw-bold mb-4">Performance par membre</h4>
            <div class="row g-4">
              @for (m of membres; track m.id) {
                <div class="col-md-4">
                  <div class="card border-0 shadow-sm p-4">
                    <div class="d-flex align-items-center gap-3 mb-4">
                      <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 12px; font-weight: 600;">{{m.initials}}</div>
                      <div>
                        <div class="fw-bold">{{m.nom}}</div>
                        <div class="small text-muted">{{m.role}}</div>
                      </div>
                    </div>
                    <div class="d-flex gap-4 mb-3">
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-check-circle text-primary" style="font-size: 20px;"></i>
                        <div>
                          <div class="fw-bold" style="font-size: 16px;">{{m.tachesTerminees}}</div>
                          <div class="small text-muted" style="font-size: 11px;">Terminées</div>
                        </div>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-clock text-primary" style="font-size: 20px;"></i>
                        <div>
                          <div class="fw-bold" style="font-size: 16px;">{{m.tempsMoyen}}h</div>
                          <div class="small text-muted" style="font-size: 11px;">Temps moyen</div>
                        </div>
                      </div>
                      <div class="d-flex align-items-center gap-2">
                        <i class="bi bi-graph-up text-primary" style="font-size: 20px;"></i>
                        <div>
                          <div class="fw-bold" style="font-size: 16px;">{{m.productivite}}%</div>
                          <div class="small text-muted" style="font-size: 11px;">Productivité</div>
                        </div>
                      </div>
                    </div>
                    <div class="progress" style="height: 6px;">
                      <div class="progress-bar" [style.width.%]="m.productivite" style="background: #2196f3;"></div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="tab-pane fade" id="disponibilite" role="tabpanel">
            <h4 class="fw-bold mb-4">Charge de travail</h4>
            <div class="d-flex flex-column gap-3">
              @for (m of membres; track m.id) {
                <div class="d-flex align-items-center gap-3 p-3 rounded-3" style="background: #f9f9f9;">
                  <div class="d-flex align-items-center gap-3" style="width: 180px;">
                    <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 36px; height: 36px; background: linear-gradient(135deg, #2196f3, #1976d2); color: white; font-size: 12px; font-weight: 600;">{{m.initials}}</div>
                    <span>{{m.nom}}</span>
                  </div>
                  <div class="flex-grow-1">
                    <div class="progress" style="height: 16px;">
                      <div class="progress-bar" [style.width.%]="m.charge" [style.background]="m.charge > 80 ? '#dc3545' : '#2196f3'"></div>
                    </div>
                  </div>
                  <div class="fw-bold" style="width: 50px; text-align: right;" [class.text-danger]="m.charge > 80">{{m.charge}}%</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      @if (showAddForm || editingMembre) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
                <h5 class="modal-title">{{editingMembre ? 'Modifier' : 'Ajouter'}} Membre</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeForm()"></button>
              </div>
              <div class="modal-body">
                <div class="d-flex flex-column gap-3">
                  <div>
                    <label class="form-label">Nom</label>
                    <input type="text" class="form-control" [(ngModel)]="formData.nom">
                  </div>
                  <div>
                    <label class="form-label">Rôle</label>
                    <select class="form-select" [(ngModel)]="formData.role">
                      <option value="Développeur">Développeur</option>
                      <option value="Testeur">Testeur</option>
                      <option value="Designer">Designer</option>
                      <option value="Chef de projet">Chef de projet</option>
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Projet</label>
                    <select class="form-select" [(ngModel)]="formData.projet">
                      <option value="">Aucun</option>
                      @for (p of projets; track p.id) {
                        <option [value]="p.nom">{{p.nom}}</option>
                      }
                    </select>
                  </div>
                  <div>
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" [(ngModel)]="formData.email">
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="closeForm()">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: #2196f3; border: none;" (click)="saveMembre()">Enregistrer</button>
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
export class ChefEquipeComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  membres: any[] = [];
  projets: any[] = [];

  filteredMembres: any[] = [];
  displayedColumns = ['nom', 'role', 'projet', 'charge', 'taches', 'actions'];

  searchQuery = '';
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
        this.membres = employes.map((e: any, idx: number) => ({
          id: e.id,
          nom: e.nom,
          initials: e.nom?.charAt(0) || 'E',
          role: e.typeUtilisateurId || 'Développeur',
          projet: e.poste || 'Non assigné',
          charge: 50 + Math.floor(Math.random() * 45),
          tachesTerminees: Math.floor(Math.random() * 15),
          tachesTotal: 15 + Math.floor(Math.random() * 10),
          tempsMoyen: 2 + Math.floor(Math.random() * 4),
          productivite: 70 + Math.floor(Math.random() * 25)
        }));
        this.filteredMembres = [...this.membres];
        this.calculateStats();
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

  calculateStats() {
    this.tachesTerminees = this.membres.reduce((sum, m) => sum + m.tachesTerminees, 0);
    this.tachesEnCours = this.membres.reduce((sum, m) => sum + (m.tachesTotal - m.tachesTerminees), 0);
    this.productiviteMoyenne = Math.round(this.membres.reduce((sum, m) => sum + m.productivite, 0) / this.membres.length);
  }

  viewDetails(m: any) { alert('Voir détails: ' + m.nom); }
  editMembre(m: any) { this.editingMembre = m; this.formData = { ...m }; }
  affecterProjet(m: any) { alert('Affecter projet: ' + m.nom); }
  retirerMembre(m: any) {
    if (confirm('Retirer ' + m.nom + ' de l\'équipe?')) {
      this.membres = this.membres.filter(x => x.id !== m.id);
      this.filteredMembres = [...this.membres];
      this.calculateStats();
      alert('Membre retiré');
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
      alert('Veuillez entrer un nom');
      return;
    }
    const initials = this.formData.nom.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    if (this.editingMembre) {
      const index = this.membres.findIndex(m => m.id === this.editingMembre.id);
      if (index >= 0) this.membres[index] = { ...this.formData, initials };
    } else {
      this.membres.push({ ...this.formData, initials, id: Date.now(), charge: 0, tachesTerminees: 0, tachesTotal: 0, tempsMoyen: 0, productivite: 0 });
    }
    this.filteredMembres = [...this.membres];
    this.calculateStats();
    alert('Membre enregistré');
    this.closeForm();
  }
}
