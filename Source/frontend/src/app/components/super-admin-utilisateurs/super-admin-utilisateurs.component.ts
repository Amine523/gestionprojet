import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-super-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="font-size: 28px; color: #1a1a2e;">Gestion Utilisateurs</h1>
          <p class="text-muted mb-0">Tous les utilisateurs du SaaS</p>
        </div>
        <button class="btn btn-primary" (click)="openDialog()">
          <i class="bi bi-person-plus me-2"></i>Ajouter un Utilisateur
        </button>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 mb-3">
            <div class="col-md-4">
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control" [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Nom, email...">
              </div>
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="selectedSociete" (ngModelChange)="filterBySociete()">
                <option value="">Toutes les sociétés</option>
                @for (s of societes; track s.id) {
                  <option [value]="s.id">{{s.nom}}</option>
                }
              </select>
            </div>
            <div class="col-md-5 d-flex gap-2">
              <button class="btn btn-light border" (click)="applyFilter()" title="Rechercher">
                <i class="bi bi-search text-primary"></i>
              </button>
              <button class="btn btn-light border" (click)="clearFilters()" title="Réinitialiser">
                <i class="bi bi-arrow-counterclockwise"></i>
              </button>
              <div class="ms-auto d-flex gap-2">
                <button class="btn btn-outline-success btn-sm" (click)="exportExcel()">
                  <i class="bi bi-file-earmark-excel me-1"></i>Excel
                </button>
                <button class="btn btn-outline-danger btn-sm" (click)="exportPdf()">
                  <i class="bi bi-file-earmark-pdf me-1"></i>PDF
                </button>
              </div>
            </div>
          </div>

          <div class="table-responsive position-relative">
            @if (isLoading) {
              <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style="z-index: 10;">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Chargement...</span>
                </div>
              </div>
            }
            <table class="table table-hover mb-0">
              <thead class="bg-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Société</th>
                  <th>Rôle</th>
                  <th>Statut</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (u of dataSource; track u.id) {
                  <tr>
                    <td>{{u.id}}</td>
                    <td>{{u.nom}}</td>
                    <td>{{u.email}}</td>
                    <td>{{getSocieteName(u.societeId)}}</td>
                    <td>
                      <span class="badge bg-info">{{u.typeUtilisateurId}}</span>
                    </td>
                    <td>
                      <span class="badge rounded-pill" [class.bg-success]="u.actif" [class.bg-danger]="!u.actif">
                        {{u.actif ? 'Actif' : 'Inactif'}}
                      </span>
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="openDialog(u)"><i class="bi bi-pencil me-2"></i>Modifier</a></li>
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="toggleStatus(u)"><i class="bi bi-{{u.actif ? 'ban' : 'check-circle'}} me-2"></i>{{u.actif ? 'Désactiver' : 'Activer'}}</a></li>
                          <li><a class="dropdown-item text-danger" href="javascript:void(0)" (click)="deleteUser(u)"><i class="bi bi-trash me-2"></i>Supprimer</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-3 px-3">
            <div class="text-muted" style="font-size: 13px;">
              Affichage de {{ (page - 1) * pageSize + 1 }} à {{ Math.min(page * pageSize, totalItems) }} sur {{ totalItems }} entrées
            </div>
            <div class="d-flex align-items-center gap-2">
              <select class="form-select form-select-sm" style="width: 70px;" [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option [value]="5">5</option>
                <option [value]="10">10</option>
                <option [value]="25">25</option>
                <option [value]="50">50</option>
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

          @if (dataSource.length === 0) {
            <div class="text-center py-5 text-muted">
              <i class="bi bi-people" style="font-size: 48px;"></i>
              <span class="d-block mt-2">Aucun utilisateur trouvé</span>
              <button class="btn btn-primary mt-3" (click)="openDialog()">Ajouter un utilisateur</button>
            </div>
          }
        </div>
      </div>
    </div>

    <!-- Dialog -->
    @if (showDialog) {
      <div class="modal-backdrop" (click)="showDialog = false">
        <div class="card modal-container" (click)="$event.stopPropagation()">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0">{{editingUser ? 'Modifier' : 'Ajouter'}} un Utilisateur</h5>
            <button class="btn btn-sm btn-light" (click)="showDialog = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="card-body scrollable">
            <form (ngSubmit)="saveUser()">
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Nom</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-person"></i>
                  </span>
                  <input type="text" class="form-control" [(ngModel)]="formData.nom" name="nom" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Email</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-envelope"></i>
                  </span>
                  <input type="email" class="form-control" [(ngModel)]="formData.email" name="email" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Société</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-building"></i>
                  </span>
                  <select class="form-select" [(ngModel)]="formData.societeId" name="societeId">
                    <option value="">Aucune</option>
                    @for (s of societes; track s.id) {
                      <option [value]="s.id">{{s.nom}}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Rôle</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-gear"></i>
                  </span>
                  <select class="form-select" [(ngModel)]="formData.typeUtilisateurId" name="typeUtilisateurId">
                    <option value="T002">Admin Société</option>
                    <option value="T003">RH</option>
                    <option value="T004">Chef de Projet</option>
                    <option value="T005">Développeur</option>
                    <option value="T006">Testeur</option>
                    <option value="T007">Utilisateur / Candidat</option>
                  </select>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Téléphone</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-telephone"></i>
                  </span>
                  <input type="text" class="form-control" [(ngModel)]="formData.telephone" name="telephone">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Mot de passe</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-lock"></i>
                  </span>
                  <input type="password" class="form-control" [(ngModel)]="formData.password" name="password">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">N° Version</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-layers"></i>
                  </span>
                  <input type="text" class="form-control" [(ngModel)]="formData.nv" name="nv" [readonly]="true" placeholder="Auto-généré">
                </div>
                <small class="text-muted">Numéro de version généré automatiquement</small>
              </div>

              <div class="mb-3 p-3 bg-light rounded-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="formData.actif" name="actif" id="actif">
                  <label class="form-check-label fw-bold" for="actif">Actif</label>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-light" type="button" (click)="showDialog = false">Annuler</button>
                <button class="btn btn-primary" type="submit" [disabled]="!formData.nom || !formData.email">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(10px); }
    .modal-container { width: 520px; padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
    .modal-body.scrollable { overflow-y: auto; }
  `]
})
export class SuperAdminUtilisateursComponent implements OnInit {
  private api = inject(ApiService);
  private exportService = inject(ExportService);

  displayedColumns = ['id', 'nom', 'email', 'societeId', 'typeUtilisateurId', 'actif', 'actions'];
  dataSource: any[] = [];

  societes: any[] = [];
  allUsers: any[] = [];
  searchQuery = '';
  selectedSociete = '';
  showDialog = false;
  editingUser: any = null;
  formData: any = { nom: '', email: '', societeId: '', typeUtilisateurId: 'developpeur', actif: true };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  ngOnInit() {
    this.loadSocietes();
    this.loadUsers();
  }

  loadSocietes() {
    this.api.getSocietes().subscribe({
      next: (data) => { 
        const validSocietes = (data || []).filter((s: any) => s.id && s.id.trim());
        this.societes = validSocietes;
      }
    });
  }

  loadUsers() {
    this.isLoading = true;
    // We use the CritereRecherche structure expected by the backend
    const condition = {
      nom: this.searchQuery,
      societeId: this.selectedSociete,
      criteres: {}
    };

    const obs = (this.searchQuery || this.selectedSociete) 
      ? this.api.getUtilisateursByConditionPage(this.page, this.pageSize, condition)
      : this.api.getUtilisateursPage(this.page, this.pageSize);

    obs.subscribe({
      next: (res: any) => {
        this.dataSource = res.items || [];
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.dataSource = [];
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadUsers();
  }

  applyFilter() {
    this.page = 1;
    this.loadUsers();
  }

  filterBySociete() {
    this.page = 1;
    this.loadUsers();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedSociete = '';
    this.page = 1;
    this.loadUsers();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.dataSource, 'Utilisateurs_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Société', 'Statut'];
    const data = this.dataSource.map(u => [
      u.nom, u.email, this.getSocieteName(u.societeId), u.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Utilisateurs_Nadhemni', 'Liste des Utilisateurs');
  }

  getSocieteName(societeId: string): string {
    const societe = this.societes.find(s => s.id === societeId);
    return societe ? societe.nom : '-';
  }

  openDialog(user?: any) {
    this.editingUser = user;
    const autoNv = 'V' + new Date().getFullYear() + '.' + String(Date.now()).slice(-4);
    this.formData = user ? { 
      ...user,
      telephone: user.telephone || '',
      password: '',
      nv: user.nv || autoNv
    } : { 
      nom: '', 
      email: '', 
      societeId: '', 
      typeUtilisateurId: 'T005', 
      actif: true,
      telephone: '',
      password: '',
      nv: autoNv
    };
    this.loadSocietes();
    this.showDialog = true;
  }

  saveUser() {
    if (this.editingUser) {
      this.api.updateUtilisateur(this.editingUser.id, this.formData).subscribe({
        next: () => {
          alert('Utilisateur modifié');
          this.showDialog = false;
          this.loadUsers();
        },
        error: () => {
          alert('Erreur lors de la modification');
        }
      });
    } else {
      this.api.createUtilisateur(this.formData).subscribe({
        next: () => {
          alert('Utilisateur créé');
          this.showDialog = false;
          this.loadUsers();
        },
        error: () => {
          alert('Erreur lors de la création');
        }
      });
    }
  }

  deleteUser(user: any) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.api.deleteUtilisateur(user.id).subscribe({
        next: () => {
          alert('Utilisateur supprimé');
          this.loadUsers();
        },
        error: () => {
          alert('Erreur lors de la suppression');
        }
      });
    }
  }

  toggleStatus(user: any) {
    const updated = { ...user, actif: !user.actif };
    this.api.updateUtilisateur(user.id, updated).subscribe({
      next: () => {
        alert(updated.actif ? 'Utilisateur activé' : 'Utilisateur désactivé');
        this.loadUsers();
      }
    });
  }
}
