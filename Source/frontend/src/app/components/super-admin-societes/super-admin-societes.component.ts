import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';

import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-super-admin-societes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Command Center</h1>
          <p class="subtitle">Supervision globale de l'écosystème SaaS</p>
        </div>
        <div class="header-monitor">
           <div class="monitor-tile">
              <span class="m-val">{{societes.length}}</span>
              <span class="m-label">Sociétés</span>
           </div>
           <div class="monitor-tile">
              <span class="m-val">{{activeCount}}</span>
              <span class="m-label">Actives</span>
           </div>
           <div class="monitor-tile p-highlight">
              <span class="m-val">99.9%</span>
              <span class="m-label">Uptime</span>
           </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3 align-items-center">
            <div class="col-md-3">
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-search"></i>
                </span>
                <input type="text" class="form-control" [(ngModel)]="searchFilters.global" (ngModelChange)="applyAdvancedFilter()" placeholder="Organisation, DNS...">
              </div>
            </div>
            <div class="col-md-2">
              <div class="input-group">
                <span class="input-group-text bg-light">
                  <i class="bi bi-geo-alt"></i>
                </span>
                <input type="text" class="form-control" [(ngModel)]="searchFilters.city" (ngModelChange)="applyAdvancedFilter()" placeholder="Ville/Pays">
              </div>
            </div>
            <div class="col-md-2">
              <select class="form-select" [(ngModel)]="searchFilters.plan" (change)="applyAdvancedFilter()">
                <option value="">Tous les plans</option>
                <option value="GOLD">Gold (Entreprise)</option>
                <option value="SILVER">Silver (Pro)</option>
                <option value="FREE">Standard</option>
              </select>
            </div>
            <div class="col-md-auto ms-auto">
              @if (selection.hasValue()) {
                <div class="btn-group me-2">
                  <button class="btn btn-sm btn-success" (click)="bulkStatus(true)">Activer ({{selection.selected.length}})</button>
                  <button class="btn btn-sm btn-danger" (click)="bulkStatus(false)">Suspendre</button>
                </div>
              }
              <button class="btn btn-primary" (click)="openDialog()">
                <i class="bi bi-plus-lg me-2"></i>Nouvelle Société
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <div class="card-body p-0 position-relative">
          @if (isLoading) {
            <div class="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style="z-index: 10;">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Chargement...</span>
              </div>
            </div>
          }
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="bg-light">
                <tr>
                  <th>
                    <input type="checkbox" class="form-check-input"
                           (change)="masterToggle()"
                           [checked]="selection.hasValue() && isAllSelected()">
                  </th>
                  <th>Organisation</th>
                  <th>Plan SaaS</th>
                  <th>Infrastructure</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @for (s of dataSource; track s.id) {
                  <tr>
                    <td>
                      <input type="checkbox" class="form-check-input"
                             (change)="selection.toggle(s)"
                             [checked]="selection.isSelected(s)">
                    </td>
                    <td>
                      <div class="d-flex align-items-center gap-3">
                        <div class="rounded-2 d-flex align-items-center justify-content-center fw-bold text-white" style="width: 36px; height: 36px; background: hsl({{(s.id?.length * 40 || 200)}}, 70%, 50%);">
                          {{s.nom?.charAt(0)}}
                        </div>
                        <div>
                          <div class="fw-bold" style="color: #1e293b;">{{s.nom}}</div>
                          <div class="text-muted" style="font-size: 11px;">{{s.email || 'no-contact@domain.com'}}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge rounded-pill" [class.bg-warning]="s.plan === 'GOLD'" [class.bg-secondary]="s.plan === 'SILVER'" [class.bg-info]="!s.plan || s.plan === 'FREE'">
                        <i class="bi bi-{{getPlanIcon(s.plan)}} me-1"></i>
                        {{s.plan || 'Standard'}}
                      </span>
                    </td>
                    <td>
                      <button class="btn btn-sm rounded-pill" [class.btn-success]="s.actif" [class.btn-secondary]="!s.actif" (click)="toggleStatus(s)">
                        {{s.actif ? 'Opérationnel' : 'Suspendu'}}
                      </button>
                    </td>
                    <td>
                      <div class="dropdown">
                        <button class="btn btn-sm btn-light" data-bs-toggle="dropdown">
                          <i class="bi bi-three-dots"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="viewProjets(s)"><i class="bi bi-speedometer2 me-2"></i>Dashboard Dédié</a></li>
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="viewAbonnements(s)"><i class="bi bi-credit-card me-2"></i>Plan SaaS</a></li>
                          <li><hr class="dropdown-divider"></li>
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="openDialog(s)"><i class="bi bi-gear me-2"></i>Configuration</a></li>
                          <li><a class="dropdown-item" href="javascript:void(0)" (click)="toggleStatus(s)"><i class="bi bi-{{s.actif ? 'pause' : 'play'}} me-2"></i>{{s.actif ? 'Suspendre' : 'Réactiver'}}</a></li>
                          <li><a class="dropdown-item text-danger" href="javascript:void(0)" (click)="deleteSociete(s)"><i class="bi bi-trash me-2"></i>Terminer l'instance</a></li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
            <div class="text-muted" style="font-size: 13px;">
              Affichage de {{ (page - 1) * pageSize + 1 }} à {{ Math.min(page * pageSize, totalItems) }} sur {{ totalItems }} entrées
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="btn-group">
                <button class="btn btn-outline-success btn-sm" (click)="exportExcel()"><i class="bi bi-file-earmark-excel"></i></button>
                <button class="btn btn-outline-danger btn-sm" (click)="exportPdf()"><i class="bi bi-file-earmark-pdf"></i></button>
              </div>
              <select class="form-select form-select-sm" style="width: 70px;" [(ngModel)]="pageSize" (change)="onPageSizeChange()">
                <option [value]="5">5</option>
                <option [value]="10">10</option>
                <option [value]="25">25</option>
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

    <!-- Deployment Dialog -->
    @if (showDialog) {
      <div class="modal-backdrop" (click)="showDialog = false">
        <div class="card modal-container" (click)="$event.stopPropagation()">
           <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0"><i class="bi bi-rocket me-2"></i>{{editingSociete ? 'Configuration' : 'Nouveau Déploiement'}}</h5>
              <button class="btn btn-sm btn-light" (click)="showDialog = false"><i class="bi bi-x-lg"></i></button>
           </div>
           
           <div class="card-body scrollable">
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Nom de l'organisation</label>
                <input type="text" class="form-control" [(ngModel)]="formData.nom" placeholder="Ex: Soft Pro" name="nom">
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Email Admin</label>
                  <input type="email" class="form-control" [(ngModel)]="formData.email" name="email">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Service Contact</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.telephoneContact" name="tel">
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Siège Social (Adresse)</label>
                <input type="text" class="form-control" [(ngModel)]="formData.adresse" name="adr">
              </div>

              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Ville</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.ville" name="ville">
                </div>
                <div class="col-md-6">
                  <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Pays</label>
                  <input type="text" class="form-control" [(ngModel)]="formData.pays" name="pays">
                </div>
              </div>

              <div class="mb-3 p-3 bg-light rounded-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="formData.actif" id="actif">
                  <label class="form-check-label fw-bold" for="actif">Activer l'infrastructure immédiatement</label>
                </div>
              </div>
           </div>

           <div class="card-footer d-flex justify-content-end gap-2">
              <button class="btn btn-light" (click)="showDialog = false">Annuler</button>
              <button class="btn btn-primary" (click)="saveSociete()">
                 {{editingSociete ? 'Valider la Config' : 'Initier le Déploiement'}}
              </button>
           </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .container { padding: 32px; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 14px; margin: 4px 0 0; }
    
    .header-monitor { display: flex; gap: 16px; }
    .monitor-tile { 
      background: white; padding: 12px 24px; border-radius: 16px; 
      box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f1f5f9;
      display: flex; flex-direction: column; align-items: center;
    }
    .m-val { font-size: 24px; font-weight: 800; color: #1e293b; line-height: 1; }
    .m-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 4px; }
    .p-highlight .m-val { color: #16a34a; }

    /* Modal Styling */
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(10px); }
    .modal-container { width: 520px; padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
    .modal-body.scrollable { overflow-y: auto; }
  `]
})
export class SuperAdminSocietesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private exportService = inject(ExportService);

  get activeCount() {
    return this.societes.filter(s => s.actif).length;
  }

  viewProjets(societe: any) {
    const id = societe.id || societe.Id;
    if (!id) {
      alert('ID de société manquant');
      return;
    }
    this.router.navigate(['/superadmin/projets'], { queryParams: { societeId: id } });
  }

  displayedColumns = ['select', 'nom', 'plan', 'actif', 'actions'];
  societes: any[] = [];
  dataSource: any[] = [];
  selection = new SelectionModel<any>(true, []);

  searchQuery = '';
  searchFilters = { global: '', city: '', plan: '' };
  showDialog = false;
  editingSociete: any = null;
  formData: any = { nom: '', adresse: '', telephoneContact: '', actif: true, plan: 'Standard' };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.searchQuery = params['filter'];
      }
    });
    this.loadSocietes();
  }

  loadSocietes() {
    this.isLoading = true;
    this.api.getSocietesPage(this.page, this.pageSize).subscribe({
      next: (res: any) => {
        this.societes = (res.items || []).map((s: any, idx: number) => {
          if (!s.id && !s.Id) s.id = 'SOC_TN' + (idx + 1);
          return s;
        });
        this.dataSource = this.societes;
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.societes = [];
        this.dataSource = [];
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadSocietes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadSocietes();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.dataSource, 'Societes_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Ville', 'Statut'];
    const data = this.dataSource.map(s => [
      s.nom, s.email, s.ville, s.actif ? 'Actif' : 'Suspendu'
    ]);
    this.exportService.exportToPdf(cols, data, 'Societes_Nadhemni', 'Liste des Sociétés');
  }

  getDeletedFromStorage(): string[] {
    const data = localStorage.getItem('app_deleted');
    return data ? JSON.parse(data) : [];
  }

  saveDeletedToStorage(id: string) {
    const deleted = this.getDeletedFromStorage();
    if (!deleted.includes(id)) {
      deleted.push(id);
      localStorage.setItem('app_deleted', JSON.stringify(deleted));
    }
  }

  getLocalStorageData(key: string): any[] {
    const data = localStorage.getItem('app_data');
    if (!data) return [];
    const parsed = JSON.parse(data);
    return parsed[key] || [];
  }

  applyFilter() {
    const filter = this.searchQuery.trim().toLowerCase();
    this.dataSource = this.societes.filter(s => 
      (s.nom + (s.email || '')).toLowerCase().includes(filter)
    );
  }

  applyAdvancedFilter() {
    this.dataSource = this.societes.filter(s => {
      const g = (s.nom + (s.email || '')).toLowerCase().includes(this.searchFilters.global.toLowerCase());
      const c = (s.ville + (s.pays || '')).toLowerCase().includes(this.searchFilters.city.toLowerCase());
      const p = !this.searchFilters.plan || (s.plan || 'Standard').toUpperCase() === this.searchFilters.plan;
      return g && c && p;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach((row: any) => this.selection.select(row));
  }

  getPlanIcon(plan?: string): string {
    const p = plan?.toUpperCase();
    if (p === 'GOLD') return 'workspace_premium';
    if (p === 'SILVER') return 'verified_user';
    return 'stars';
  }

  bulkStatus(status: boolean) {
    const selected = this.selection.selected;
    // Sequential updates to avoid DB locking in multi-tenant mode
    selected.forEach(s => {
      s.actif = status;
      this.api.updateSociete(s).subscribe();
    });
    alert(`${selected.length} instances ${status ? 'activées' : 'suspendues'}`);
    this.selection.clear();
  }

  openDialog(societe?: any) {
    this.editingSociete = societe;
    this.formData = societe ? { 
      ...societe,
      email: societe.email || '',
      codePostale: societe.codePostale || '',
      ville: societe.ville || '',
      pays: societe.pays || '',
      personneContact: societe.personneContact || '',
      fax: societe.fax || '',
      siteWeb: societe.siteWeb || ''
    } : { 
      nom: '', 
      adresse: '', 
      telephoneContact: '', 
      actif: true,
      email: '',
      codePostale: '',
      ville: '',
      pays: '',
      personneContact: '',
      fax: '',
      siteWeb: ''
    };
    this.showDialog = true;
  }

  saveSociete() {
    if (this.editingSociete) {
      this.api.updateSociete(this.formData).subscribe({
        next: () => {
          alert('Société modifiée');
          this.showDialog = false;
          this.formData = { nom: '', adresse: '', telephoneContact: '', actif: true, email: '', codePostale: '', ville: '', pays: '', personneContact: '', fax: '', siteWeb: '' };
        },
        error: (err) => {
          console.error('Update error:', err);
          alert('Erreur lors de la modification');
        }
      });
    } else {
      const societeId = 'SOC_' + Date.now().toString(36).toUpperCase();
      this.formData.id = societeId;
      this.api.createSociete(this.formData).subscribe({
        next: () => {
          this.api.sendEmailNotification('newSociete', {
            nom: this.formData.nom,
            email: this.formData.email,
            telephone: this.formData.telephoneContact,
            personneContact: this.formData.personneContact
          });
          alert('Société créée');
          this.showDialog = false;
          this.formData = { nom: '', adresse: '', telephoneContact: '', actif: true, email: '', codePostale: '', ville: '', pays: '', personneContact: '', fax: '', siteWeb: '' };
        },
        error: (err) => {
          console.error('Create error:', err);
          alert('Erreur lors de la création');
        }
      });
    }
  }

  toggleStatus(societe: any) {
    const updated = { ...societe, actif: !societe.actif };
    this.api.updateSociete(updated).subscribe({
      next: () => {
        alert(updated.actif ? 'Société activée' : 'Société désactivée');
        this.loadSocietes();
      }
    });
  }

  deleteSociete(societe: any) {
    const id = societe.id || societe.Id || '';
    if (!id) {
      alert('ID de société manquant');
      return;
    }
    const message = 'Voulez-vous vraiment supprimer la société "' + societe.nom + '" ?\n\nCela supprimera également:\n- Tous les utilisateurs de cette société\n- Tous les abonnements associés\n- Toutes les données liées\n\nCette action est irréversible.';
    if (confirm(message)) {
      this.api.deleteSociete(id).subscribe({
        next: (res: any) => {
          this.saveDeletedToStorage(id);
          this.removeFromLocalStorage('societes', id);
          this.removeFromLocalStorage('utilisateurs', id, 'societeId');
          this.removeFromLocalStorage('abonnements', id, 'societeId');
          this.societes = this.societes.filter((s: any) => s.id !== id);
          this.dataSource = this.societes;
          alert('Société "' + societe.nom + '" et toutes ses données supprimées');
        },
        error: (err) => {
          console.error('Delete error:', err);
          this.saveDeletedToStorage(id);
          this.removeFromLocalStorage('societes', id);
          this.removeFromLocalStorage('utilisateurs', id, 'societeId');
          this.removeFromLocalStorage('abonnements', id, 'societeId');
          this.societes = this.societes.filter((s: any) => s.id !== id);
          this.dataSource = this.societes;
          alert('Société "' + societe.nom + '" supprimée (hors ligne)');
        }
      });
    }
  }

  removeFromLocalStorage(key: string, id: string, searchField?: string) {
    const data = localStorage.getItem('app_data');
    if (!data) return;
    const parsed = JSON.parse(data);
    if (parsed[key]) {
      parsed[key] = parsed[key].filter((item: any) => {
        const field = searchField || 'id';
        return item[field] !== id;
      });
      localStorage.setItem('app_data', JSON.stringify(parsed));
    }
  }
  
  viewAbonnements(societe: any) {
    const storage = this.getStorage();
    const abonnements = (storage.abonnements || []).filter((a: any) => a.societeId === societe.id);
    
    if (abonnements.length === 0) {
      alert('Aucun abonnement pour cette société');
    } else {
      let message = 'Abonnements:\n';
      abonnements.forEach((a: any) => {
        message += `- ${a.type || 'Standard'}: ${a.prix || 0} DT\n`;
      });
      alert(message);
    }
  }
  
  private getStorage(): any {
    const data = localStorage.getItem('app_data');
    return data ? JSON.parse(data) : {};
  }
}
