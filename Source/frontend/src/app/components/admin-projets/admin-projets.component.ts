import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';

interface Projet {
  id: string;
  nom: string;
  nomClient: string;
  chef: string;
  statut: string;
  status: string;
  dateDebut: string;
  dateFin: string;
  startDate: string;
  endDate: string;
  avancee: number;
  membres: number;
  societeId?: string;
}

@Component({
  selector: 'app-admin-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        @if (societeId) {
          <button class="btn btn-sm btn-outline-light" (click)="goBack()">
            <i class="bi bi-arrow-left"></i>
          </button>
        }
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-folder" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Projets{{societeNom ? ' - ' + societeNom : ''}}</h1>
          <p class="mb-0" style="opacity: 0.8;">{{societeId ? 'Projets de la société' : 'Gestion des projets'}}</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="row g-3 align-items-center mb-4">
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bg-light"><i class="bi bi-search"></i></span>
                <input type="text" class="form-control" [(ngModel)]="searchQuery" (keyup.enter)="applyFilter()" placeholder="Nom du projet...">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="filterStatut" (change)="applyFilter()">
                <option value="">Tous les statuts</option>
                <option value="En cours">En cours</option>
                <option value="Terminé">Terminé</option>
                <option value="En attente">En attente</option>
              </select>
            </div>
            <div class="col-md-auto d-flex gap-2">
              <button class="btn btn-light border" (click)="applyFilter()" title="Filtrer">
                <i class="bi bi-search text-primary"></i>
              </button>
              <button class="btn btn-light border" (click)="clearFilters()" title="Réinitialiser">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
            </div>
            <div class="col-md-auto ms-auto d-flex gap-2">
              <button class="btn btn-outline-success" (click)="exportExcel()"><i class="bi bi-file-earmark-excel me-2"></i>Excel</button>
              <button class="btn btn-outline-danger" (click)="exportPdf()"><i class="bi bi-file-earmark-pdf me-2"></i>PDF</button>
              <button class="btn btn-primary" (click)="openAddDialog()">
                <i class="bi bi-plus-lg me-2"></i>Créer projet
              </button>
            </div>
          </div>

          <div class="position-relative" style="min-height: 200px;">
            @if (isLoading) {
              <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 rounded-3" style="z-index: 10;">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>
            }

            <div class="row g-4">
            @for (projet of filteredProjets; track projet.id) {
              <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                      <h5 class="card-title fw-bold mb-0">{{projet.nom}}</h5>
                      <span class="badge rounded-pill" [class]="projet.status === 'En cours' ? 'bg-primary' : projet.status === 'Terminé' ? 'bg-success' : 'bg-warning'">
                        {{projet.status === 'En cours' ? 'En cours' : projet.status === 'Terminé' ? 'Terminé' : projet.status === 'En attente' ? 'En attente' : projet.status}}
                      </span>
                    </div>
                    <p class="card-text text-muted small mb-3">{{projet.nomClient}}</p>
                    <div class="d-flex gap-3 mb-2">
                      <span class="small text-muted"><i class="bi bi-person me-1"></i>{{projet.chef || 'Non assigné'}}</span>
                      <span class="small text-muted"><i class="bi bi-people me-1"></i>{{projet.membres || 0}} membres</span>
                    </div>
                    <div class="d-flex gap-3 mb-3">
                      <span class="small text-muted"><i class="bi bi-calendar me-1"></i>{{projet.startDate | date:'dd/MM/yyyy'}}</span>
                      <span class="small text-muted"><i class="bi bi-calendar-check me-1"></i>{{projet.endDate | date:'dd/MM/yyyy'}}</span>
                    </div>
                    <div class="mb-3">
                      <div class="d-flex justify-content-between small mb-1">
                        <span>Avancé</span>
                        <span>{{projet.avancee || 0}}%</span>
                      </div>
                      <div class="progress" style="height: 6px;">
                        <div class="progress-bar" role="progressbar" [style.width.%]="projet.avancee || 0"></div>
                      </div>
                    </div>
                    <div class="d-flex gap-2">
                      <button class="btn btn-sm btn-outline-primary flex-grow-1" (click)="editProjet(projet)">
                        <i class="bi bi-pencil me-1"></i>Modifier
                      </button>
                      <button class="btn btn-sm btn-outline-danger" (click)="deleteProjet(projet)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>

          @if (!isLoading && filteredProjets.length === 0) {
            <div class="text-center py-5 text-muted">
              <i class="bi bi-folder-x" style="font-size: 48px;"></i>
              <p class="mt-3">Aucun projet trouvé</p>
            </div>
          }

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-4">
            <div class="text-muted" style="font-size: 13px;">
              Affichage de {{ (page - 1) * pageSize + 1 }} à {{ Math.min(page * pageSize, totalItems) }} sur {{ totalItems }} entrées
            </div>
            <div class="d-flex align-items-center gap-2">
              <select class="form-select form-select-sm" style="width: 70px;" [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option [value]="6">6</option>
                <option [value]="12">12</option>
                <option [value]="24">24</option>
              </select>
              <nav>
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item" [class.disabled]="page === 1">
                    <a class="page-link" href="javascript:void(0)" (click)="setPage(page - 1)"><i class="bi bi-chevron-left"></i></a>
                  </li>
                  <li class="page-item active"><a class="page-link">{{page}}</a></li>
                  <li class="page-item" [class.disabled]="page * pageSize >= totalItems">
                    <a class="page-link" href="javascript:void(0)" (click)="setPage(page + 1)"><i class="bi bi-chevron-right"></i></a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          </div>
        </div>
      </div>

      @if (showDialog) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
                <h5 class="modal-title">{{editingProjet ? 'Modifier' : 'Nouveau'}} Projet</h5>
                <button type="button" class="btn-close btn-close-white" (click)="closeDialog()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nom du projet</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-folder"></i></span>
                    <input type="text" class="form-control" [(ngModel)]="formData.nom">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <textarea class="form-control" [(ngModel)]="formData.description" rows="3"></textarea>
                </div>
                <div class="mb-3">
                  <label class="form-label">Statut</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-info-circle"></i></span>
                    <select class="form-select" [(ngModel)]="formData.status">
                      <option value="En attente">En attente</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Chef de projet</label>
                  <div class="input-group">
                    <span class="input-group-text"><i class="bi bi-person"></i></span>
                    <select class="form-select" [(ngModel)]="formData.chef">
                      <option value="">Sélectionner un chef</option>
                      @for (user of chefs; track user.id) {
                        <option [value]="user.id">{{user.nom}}</option>
                      }
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Date début</label>
                    <input type="date" class="form-control" [(ngModel)]="formData.dateDebut">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Date fin</label>
                    <input type="date" class="form-control" [(ngModel)]="formData.dateFin">
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nombre de membres</label>
                  <input type="number" class="form-control" [(ngModel)]="formData.membres">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="closeDialog()">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="saveProjet()">
                  <i class="bi bi-save me-2"></i>{{editingProjet ? 'Modifier' : 'Créer'}}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="closeDialog()"></div>
      }
    </div>
  `,
  styles: [``]
})
export class AdminProjetsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private exportService = inject(ExportService);
  
  societeId: string | null = null;
  societeNom: string = '';

  projets: Projet[] = [];
  filteredProjets: Projet[] = [];
  chefs: any[] = [];
  
  // Search & Filter
  searchQuery = '';
  filterStatut = '';

  // Pagination
  page = 1;
  pageSize = 6;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  showDialog = false;
  editingProjet: any = null;
  formData: any = { nom: '', description: '', chef: '', dateDebut: '', dateFin: '', membres: 1, statut: 'En attente', societeId: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const role = this.api.getUserRole();
    
    this.loadChefs();
    
    this.route.queryParams.subscribe(params => {
      if (params['societeId']) {
        this.societeId = params['societeId'];
        this.loadProjets();
      } else if (user && user.societeId && role === 'admin_societe') {
        this.societeId = user.societeId;
        this.loadProjets();
      } else {
        this.loadProjets();
      }
    });
  }

  loadChefs() {
    this.api.getUtilisateurs().subscribe(users => {
      // Filtrage plus souple pour trouver les chefs (insensible à la casse)
      this.chefs = users.filter((u: any) => {
        const type = (u.typeUtilisateurId || '').toUpperCase();
        return type === 'CHEF_PROJET' || type === 'ADMIN_SOCIETE' || type === 'ADMIN' || type === '2';
      });

      // Si après filtrage la liste est vide, on montre tous les employés de la société pour débloquer l'utilisateur
      if (this.chefs.length === 0 && this.societeId) {
        this.chefs = users.filter((u: any) => u.societeId === this.societeId);
      } else if (this.chefs.length === 0) {
        this.chefs = users;
      }
    });
  }

  loadProjets() {
    this.isLoading = true;
    
    const condition: any = { criteres: {} };
    if (this.searchQuery) condition.nom = this.searchQuery;
    if (this.filterStatut) condition.status = this.filterStatut;
    if (this.societeId) condition.societeId = this.societeId;

    const user = this.api.getCurrentUser();
    const role = this.api.getUserRole();
    if (role === 'CHEF_PROJET' && user) {
      condition.utilisateurId = user.id;
    }

    const obs = (this.searchQuery || this.filterStatut || this.societeId || role === 'CHEF_PROJET')
      ? this.api.getProjetsByConditionPage(this.page, this.pageSize, condition)
      : this.api.getProjetsPage(this.page, this.pageSize);

    obs.subscribe({
      next: (res: any) => {
        const items = res.items || [];
        this.filteredProjets = items.map((p: any) => ({
          id: p.id,
          nom: p.nom || '',
          nomClient: p.nomClient || '',
          chef: p.utilisateurNom || p.utilisateurId || 'Non assigné',
          statut: p.status || 'En attente',
          status: p.status || 'En attente',
          startDate: p.startDate || '',
          endDate: p.endDate || '',
          dateDebut: p.startDate || '',
          dateFin: p.endDate || '',
          avancee: p.avancee || 0,
          membres: p.membres || 0,
          societeId: p.societeId
        }));
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;

        if (this.societeId) {
          const storage = this.api.getRawStorage();
          const societes = storage.societes || [];
          const societe = societes.find((s: any) => s.id === this.societeId);
          this.societeNom = societe?.nom || '';
        }
      },
      error: () => {
        this.filteredProjets = [];
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadProjets();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadProjets();
  }

  applyFilter() {
    this.page = 1;
    this.loadProjets();
  }

  clearFilters() {
    this.searchQuery = '';
    this.filterStatut = '';
    this.page = 1;
    this.loadProjets();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.filteredProjets, 'Projets_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Statut', 'Chef de Projet', 'Avancement'];
    const data = this.filteredProjets.map(p => [
      p.nom, p.status, p.chef, p.avancee + '%'
    ]);
    this.exportService.exportToPdf(cols, data, 'Projets_Nadhemni', 'Liste des Projets');
  }

  openAddDialog() {
    this.editingProjet = null;
    this.formData = { nom: '', description: '', chef: '', dateDebut: new Date().toISOString().split('T')[0], dateFin: '', membres: 1, statut: 'En attente', status: 'En attente', societeId: this.societeId || '' };
    this.showDialog = true;
  }

  editProjet(p: Projet) {
    this.editingProjet = p;
    this.formData = { ...p };
    this.showDialog = true;
  }

  closeDialog() { this.showDialog = false; }

  saveProjet() {
    if (!this.formData.nom) {
      alert('Veuillez entrer un nom');
      return;
    }
    
    // Convert to exactly what backend expects
    const projetData = {
      nom: this.formData.nom,
      // description is missing on backend, but let's keep it safe
      utilisateurId: this.formData.chef,
      startDate: this.formData.dateDebut,
      endDate: this.formData.dateFin,
      status: this.formData.status,
      priorite: 'Moyenne',
      societeId: this.formData.societeId || this.societeId
    };

    if (this.editingProjet) {
      this.api.updateProjet({ ...projetData, id: this.editingProjet.id }).subscribe({
        next: () => {
          const index = this.projets.findIndex(p => p.id === this.editingProjet.id);
          if (index >= 0) this.projets[index] = { ...this.projets[index], ...this.formData };
          this.applyFilter();
          alert('Projet modifié');
        },
        error: () => {
          const index = this.projets.findIndex(p => p.id === this.editingProjet.id);
          if (index >= 0) this.projets[index] = { ...this.projets[index], ...this.formData };
          this.saveToStorage();
          this.applyFilter();
          alert('Projet modifié (hors ligne)');
        }
      });
    } else {
      this.api.createProjet(projetData).subscribe({
        next: (res) => {
          const newProjetId = res.id;
          // Automatiquement ajouter le chef comme membre pour éviter "0 membres"
          if (this.formData.chef) {
            this.api.addMembreAuProjet({ 
              projetId: newProjetId, 
              utilisateurId: this.formData.chef, 
              role: 'Chef de Projet' 
            }).subscribe();
          }
          
          this.projets.push({ ...this.formData, id: newProjetId || Date.now().toString(), avancee: 0, membres: 1 });
          this.applyFilter();
          alert('Projet créé et Chef assigné comme membre');
        },
        error: () => {
          this.projets.push({ ...this.formData, id: Date.now().toString(), avancee: 0, membres: 1 });
          this.saveToStorage();
          this.applyFilter();
          alert('Projet créé (hors ligne)');
        }
      });
    }
    this.closeDialog();
  }

  saveToStorage() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const parsed = JSON.parse(data);
      parsed.projets = this.projets;
      localStorage.setItem('app_data', JSON.stringify(parsed));
    }
  }

  deleteProjet(p: Projet) {
    if (confirm('Supprimer le projet ' + p.nom + '?')) {
      const id = p.id;
      this.api.deleteProjet(id).subscribe({
        next: () => {
          this.projets = this.projets.filter(x => x.id !== p.id);
          this.applyFilter();
          alert('Projet supprimé');
        },
        error: () => {
          this.projets = this.projets.filter(x => x.id !== p.id);
          this.saveToStorage();
          this.applyFilter();
          alert('Projet supprimé (hors ligne)');
        }
      });
    }
  }

  goBack() {
    window.history.back();
  }
}
