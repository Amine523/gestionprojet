import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '../../services/api.service';
import { ExportService } from '../../services/export.service';

@Component({
  selector: 'app-rh-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, MatTabsModule, MatDialogModule, MatProgressSpinnerModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-icon"><mat-icon>people</mat-icon></div>
        <div>
          <h1>Gestion des Employés</h1>
          <p>Gestion du personnel - {{societeNom}}</p>
        </div>
      </div>

      <mat-card class="content-card">
        <mat-tab-group>
          <mat-tab label="Liste des employés">
            <div class="tab-content">
              <div class="toolbar">
                <div class="filters">
                  <mat-form-field appearance="outline" class="search-field">
                    <mat-label>Rechercher</mat-label>
                    <input matInput [(ngModel)]="searchQuery" (ngModelChange)="filterEmployes()" placeholder="Nom, email, poste...">
                    <mat-icon matPrefix>search</mat-icon>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Département</mat-label>
                    <mat-select [(ngModel)]="filterDepartement" (ngModelChange)="filterEmployes()">
                      <mat-option value="">Tous</mat-option>
                      <mat-option value="informatique">Informatique</mat-option>
                      <mat-option value="rh">RH</mat-option>
                      <mat-option value="commercial">Commercial</mat-option>
                      <mat-option value="finance">Finance</mat-option>
                    </mat-select>
                  </mat-form-field>
                  
                  <mat-form-field appearance="outline">
                    <mat-label>Statut</mat-label>
                    <mat-select [(ngModel)]="filterStatut" (ngModelChange)="filterEmployes()">
                      <mat-option value="">Tous</mat-option>
                      <mat-option value="actif">Actif</mat-option>
                      <mat-option value="inactif">Inactif</mat-option>
                    </mat-select>
                  </mat-form-field>
                </div>
                
                <div class="actions" style="display: flex; gap: 8px;">
                  <button mat-stroked-button color="primary" (click)="exportExcel()"><mat-icon>table_chart</mat-icon> Excel</button>
                  <button mat-stroked-button color="warn" (click)="exportPdf()"><mat-icon>picture_as_pdf</mat-icon> PDF</button>
                  <button mat-flat-button class="add-btn" (click)="openForm()">
                    <mat-icon>add</mat-icon>Ajouter employé
                  </button>
                </div>
              </div>

              <div class="table-container" style="position: relative;">
                @if (isLoading) {
                  <div class="loading-overlay" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.7); z-index: 10;">
                    <mat-spinner diameter="40"></mat-spinner>
                  </div>
                }

              <table mat-table [dataSource]="filteredEmployes" class="employees-table">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let e">{{e.id || e.Id}}</td>
                </ng-container>
                <ng-container matColumnDef="nom">
                  <th mat-header-cell *matHeaderCellDef>Nom complet</th>
                  <td mat-cell *matCellDef="let e">{{e.nom}}</td>
                </ng-container>
                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let e">{{e.email}}</td>
                </ng-container>
                <ng-container matColumnDef="poste">
                  <th mat-header-cell *matHeaderCellDef>Poste</th>
                  <td mat-cell *matCellDef="let e">{{e.poste}}</td>
                </ng-container>
                <ng-container matColumnDef="departement">
                  <th mat-header-cell *matHeaderCellDef>Département</th>
                  <td mat-cell *matCellDef="let e">{{e.departement || '-'}}</td>
                </ng-container>
                <ng-container matColumnDef="contrat">
                  <th mat-header-cell *matHeaderCellDef>Contrat</th>
                  <td mat-cell *matCellDef="let e">
                    <mat-chip class="chip-contrat">{{e.contrat || 'CDI'}}</mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="statut">
                  <th mat-header-cell *matHeaderCellDef>Statut</th>
                  <td mat-cell *matCellDef="let e">
                    <mat-chip [class]="e.actif ? 'chip-active' : 'chip-inactive'">
                      {{e.actif ? 'Actif' : 'Inactif'}}
                    </mat-chip>
                  </td>
                </ng-container>
                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Actions</th>
                  <td mat-cell *matCellDef="let e">
                    <button mat-icon-button (click)="viewDetails(e)" title="Voir détails">
                      <mat-icon>visibility</mat-icon>
                    </button>
                    <button mat-icon-button (click)="editEmploye(e)" title="Modifier">
                      <mat-icon>edit</mat-icon>
                    </button>
                    <button mat-icon-button (click)="toggleStatut(e)" [title]="e.actif ? 'Désactiver' : 'Activer'">
                      <mat-icon>{{e.actif ? 'block' : 'check_circle'}}</mat-icon>
                    </button>
                    <button mat-icon-button class="delete-btn" (click)="deleteEmploye(e)" title="Supprimer">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              @if (!isLoading && filteredEmployes.length === 0) {
                <div class="empty">
                  <mat-icon>person_off</mat-icon>
                  <span>Aucun employé trouvé</span>
                </div>
              }

              <!-- Pagination -->
              <div class="pagination-footer" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-top: 1px solid #eee;">
                <div style="font-size: 13px; color: #666;">
                  Affichage de {{ (page - 1) * pageSize + 1 }} à {{ Math.min(page * pageSize, totalItems) }} sur {{ totalItems }} entrées
                </div>
                <div style="display: flex; align-items: center; gap: 16px;">
                  <mat-form-field appearance="outline" style="width: 80px; margin-bottom: -1.25em;">
                    <mat-select [(ngModel)]="pageSize" (selectionChange)="onPageSizeChange()">
                      <mat-option [value]="5">5</mat-option>
                      <mat-option [value]="10">10</mat-option>
                      <mat-option [value]="25">25</mat-option>
                    </mat-select>
                  </mat-form-field>
                  <div style="display: flex; gap: 8px;">
                    <button mat-icon-button [disabled]="page === 1" (click)="setPage(page - 1)">
                      <mat-icon>chevron_left</mat-icon>
                    </button>
                    <button mat-icon-button disabled style="color: #000; font-weight: bold;">{{page}}</button>
                    <button mat-icon-button [disabled]="page * pageSize >= totalItems" (click)="setPage(page + 1)">
                      <mat-icon>chevron_right</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Statistiques">
            <div class="tab-content stats-tab">
              <div class="stats-grid">
                <mat-card class="stat-card">
                  <mat-icon class="stat-icon">people</mat-icon>
                  <div class="stat-info">
                    <span class="stat-value">{{totalEmployes}}</span>
                    <span class="stat-label">Total employés</span>
                  </div>
                </mat-card>
                <mat-card class="stat-card">
                  <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #4caf50, #388e3c);">check_circle</mat-icon>
                  <div class="stat-info">
                    <span class="stat-value">{{employesActifs}}</span>
                    <span class="stat-label">Actifs</span>
                  </div>
                </mat-card>
                <mat-card class="stat-card">
                  <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #ff9800, #f57c00);">event_busy</mat-icon>
                  <div class="stat-info">
                    <span class="stat-value">{{employesInactifs}}</span>
                    <span class="stat-label">Inactifs</span>
                  </div>
                </mat-card>
                <mat-card class="stat-card">
                  <mat-icon class="stat-icon" style="background: linear-gradient(135deg, #2196f3, #1976d2);">trending_up</mat-icon>
                  <div class="stat-info">
                    <span class="stat-value">{{nouveauxEmployes}}</span>
                    <span class="stat-label">Nouveaux (mois)</span>
                  </div>
                </mat-card>
              </div>
              
              <div class="departement-stats">
                <h3>Répartition par département</h3>
                <div class="dept-bars">
                  @for (d of departementsStats; track d.nom) {
                    <div class="dept-bar">
                      <span class="dept-label">{{d.nom}}</span>
                      <div class="dept-progress">
                        <div class="dept-fill" [style.width.%]="d.percentage"></div>
                      </div>
                      <span class="dept-value">{{d.nombre}}</span>
                    </div>
                  }
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>

      @if (showForm || editingEmploye || viewingEmploye) {
        <div class="dialog-overlay" (click)="closeDialog()">
          <mat-card class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{viewingEmploye ? 'Détails' : (editingEmploye ? 'Modifier' : 'Nouvel')}} Employé</h2>
              <button mat-icon-button (click)="closeDialog()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            @if (viewingEmploye) {
              <div class="dialog-body details-view">
                <div class="detail-section">
                  <h4>Informations personnelles</h4>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="label">Nom:</span><span>{{viewingEmploye.nom}}</span></div>
                    <div class="detail-item"><span class="label">Email:</span><span>{{viewingEmploye.email}}</span></div>
                    <div class="detail-item"><span class="label">Téléphone:</span><span>{{viewingEmploye.telephone || '-'}}</span></div>
                    <div class="detail-item"><span class="label">Adresse:</span><span>{{viewingEmploye.adresse || '-'}}</span></div>
                  </div>
                </div>
                <div class="detail-section">
                  <h4>Informations professionnelles</h4>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="label">Poste:</span><span>{{viewingEmploye.poste}}</span></div>
                    <div class="detail-item"><span class="label">Département:</span><span>{{viewingEmploye.departement || '-'}}</span></div>
                    <div class="detail-item"><span class="label">Contrat:</span><span>{{viewingEmploye.contrat || 'CDI'}}</span></div>
                    <div class="detail-item"><span class="label">Salaire:</span><span>{{viewingEmploye.salaire || '-'}} TND</span></div>
                  </div>
                </div>
                <div class="detail-section">
                  <h4>Congés</h4>
                  <div class="detail-grid">
                    <div class="detail-item"><span class="label">Solde actuel:</span><span>{{viewingEmploye.soldeConge || 0}} jours</span></div>
                    <div class="detail-item"><span class="label">Pris cette année:</span><span>{{viewingEmploye.congesPris || 0}} jours</span></div>
                  </div>
                </div>
                <div class="detail-actions">
                  <button mat-flat-button color="primary" (click)="viewingEmploye = null; editingEmploye = viewingEmploye">
                    <mat-icon>edit</mat-icon> Modifier
                  </button>
                </div>
              </div>
            } @else {
              <div class="dialog-body">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nom complet</mat-label>
                  <input matInput [(ngModel)]="formData.nom" placeholder="Nom et prénom">
                  <mat-icon matPrefix>person</mat-icon>
                </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input matInput [(ngModel)]="formData.email" type="email" placeholder="email@exemple.com">
                  <mat-icon matPrefix>email</mat-icon>
                </mat-form-field>
                
                 <mat-form-field appearance="outline" class="full-width">
                   <mat-label>Téléphone</mat-label>
                   <input matInput [(ngModel)]="formData.telephone" placeholder="+216 00 000 000">
                   <mat-icon matPrefix>phone</mat-icon>
                 </mat-form-field>

                 <mat-form-field appearance="outline" class="full-width">
                   <mat-label>Mot de passe</mat-label>
                   <input matInput [(ngModel)]="formData.password" type="password" placeholder="Mot de passe de l'utilisateur">
                   <mat-icon matPrefix>lock</mat-icon>
                 </mat-form-field>
                
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Poste</mat-label>
                  <mat-select [(ngModel)]="formData.poste">
                    <mat-option value="Développeur">Développeur</mat-option>
                    <mat-option value="Testeur">Testeur</mat-option>
                    <mat-option value="Chef de projet">Chef de projet</mat-option>
                    <mat-option value="RH">RH</mat-option>
                    <mat-option value="Designer">Designer</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>work</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Département</mat-label>
                  <mat-select [(ngModel)]="formData.departement">
                    <mat-option value="Informatique">Informatique</mat-option>
                    <mat-option value="RH">RH</mat-option>
                    <mat-option value="Commercial">Commercial</mat-option>
                    <mat-option value="Finance">Finance</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>business</mat-icon>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Type de contrat</mat-label>
                  <mat-select [(ngModel)]="formData.contrat">
                    <mat-option value="CDI">CDI</mat-option>
                    <mat-option value="CDD">CDD</mat-option>
                    <mat-option value="Stage">Stage</mat-option>
                    <mat-option value="Freelance">Freelance</mat-option>
                  </mat-select>
                  <mat-icon matPrefix>description</mat-icon>
                </mat-form-field>

                <div class="toggle-row">
                  <span>Employé actif</span>
                  <mat-slide-toggle [(ngModel)]="formData.actif"></mat-slide-toggle>
                </div>
              </div>
              
              <div class="dialog-footer">
                <button mat-stroked-button (click)="closeDialog()">Annuler</button>
                <button mat-flat-button class="save-btn" (click)="saveEmploye()">
                  <mat-icon>save</mat-icon>
                  {{editingEmploye ? 'Modifier' : 'Enregistrer'}}
                </button>
              </div>
            }
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .page-header { display: flex; align-items: center; gap: 16px; padding: 24px; background: linear-gradient(135deg, #ff9800, #f57c00); border-radius: 12px; color: white; margin-bottom: 24px; }
    .header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .header-icon mat-icon { font-size: 28px; }
    h1 { margin: 0; font-size: 24px; font-weight: 700; }
    p { margin: 4px 0 0; opacity: 0.8; }
    
    .content-card { border-radius: 12px; }
    .tab-content { padding: 24px 0; }
    .toolbar { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 16px; }
    .filters { display: flex; gap: 12px; flex-wrap: wrap; }
    .search-field { min-width: 250px; }
    .add-btn { background: #ff9800; color: white; }
    .save-btn { background: #ff9800; color: white; }
    
    .employees-table { width: 100%; }
    .chip-active { background: #e8f5e9; color: #2e7d32; }
    .chip-inactive { background: #ffebee; color: #c62828; }
    .chip-contrat { background: #e3f2fd; color: #1976d2; }
    .delete-btn { color: #c62828; }
    
    .empty { display: flex; flex-direction: column; align-items: center; padding: 40px; color: #888; }
    .empty mat-icon { font-size: 48px; margin-bottom: 12px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 32px; }
    .stat-card { display: flex; align-items: center; gap: 16px; padding: 24px; border-radius: 12px; }
    .stat-icon { width: 48px; height: 48px; background: linear-gradient(135deg, #ff9800, #f57c00); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1a1a2e; display: block; }
    .stat-label { font-size: 13px; color: #666; }
    
    .departement-stats h3 { margin: 0 0 20px; color: #1a1a2e; }
    .dept-bars { display: flex; flex-direction: column; gap: 16px; }
    .dept-bar { display: flex; align-items: center; gap: 16px; }
    .dept-label { width: 120px; font-size: 14px; color: #333; }
    .dept-progress { flex: 1; height: 24px; background: #eee; border-radius: 12px; overflow: hidden; }
    .dept-fill { height: 100%; background: linear-gradient(90deg, #ff9800, #f57c00); border-radius: 12px; transition: width 0.3s; }
    .dept-value { width: 40px; text-align: right; font-weight: 600; color: #1a1a2e; }
    
    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-card { width: 520px; max-height: 90vh; padding: 0; border-radius: 16px; background: #fff; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: linear-gradient(135deg, #ff9800, #f57c00); color: white; border-radius: 16px 16px 0 0; }
    .dialog-header h2 { margin: 0; font-size: 18px; }
    .dialog-header button { color: white; }
    .dialog-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
    .full-width { width: 100%; }
    .toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #eee; }
    .dialog-footer button { border-radius: 8px; }
    
    .details-view { padding: 0; }
    .detail-section { padding: 20px 24px; border-bottom: 1px solid #eee; }
    .detail-section:last-child { border-bottom: none; }
    .detail-section h4 { margin: 0 0 16px; color: #1a1a2e; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .detail-item { display: flex; flex-direction: column; }
    .detail-item .label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .detail-item span:last-child { font-size: 14px; color: #333; }
    .detail-actions { padding: 16px 24px; border-top: 1px solid #eee; }
  `]
})
export class RhEmployesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private exportService = inject(ExportService);

  employes: any[] = [];
  filteredEmployes: any[] = [];
  displayedColumns = ['id', 'nom', 'email', 'poste', 'departement', 'contrat', 'statut', 'actions'];
  
  searchQuery = '';
  filterDepartement = '';
  filterStatut = '';
  
  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;
  
  showForm = false;
  editingEmploye: any = null;
  viewingEmploye: any = null;
  formData: any = { nom: '', email: '', password: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true };
  
  totalEmployes = 0;
  employesActifs = 0;
  employesInactifs = 0;
  nouveauxEmployes = 0;
  departementsStats: any[] = [];
  societeId: string = '';
  societeNom: string = '';

  ngOnInit() { 
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadEmployes(); 
  }

  loadEmployes() {
    this.isLoading = true;
    const condition = {
      nom: this.searchQuery,
      societeId: this.societeId,
      criteres: {
        // We can pass additional criteria if needed
      }
    };
    
    // Si on a d'autres filtres (Departement, etc), on pourrait les ajouter dans criteres
    
    const obs = (this.searchQuery || this.societeId)
      ? this.api.getUtilisateursByConditionPage(this.page, this.pageSize, condition)
      : this.api.getUtilisateursPage(this.page, this.pageSize);
      
    obs.subscribe({
      next: (res: any) => { 
        this.employes = res.items || [];
        this.totalItems = res.totalCount || 0;
        this.filterEmployesLocal(); // For the dropdown filters that aren't natively supported by backend yet
        this.calculateStats();
        this.isLoading = false;
      },
      error: () => { 
        this.employes = []; 
        this.filterEmployesLocal(); 
        this.isLoading = false;
      }
    });
  }

  filterEmployes() {
    this.page = 1;
    this.loadEmployes();
  }

  filterEmployesLocal() {
    this.filteredEmployes = this.employes.filter(e => {
      const matchesDept = !this.filterDepartement || e.departement === this.filterDepartement;
      const matchesStatut = !this.filterStatut || 
        (this.filterStatut === 'actif' && e.actif) || 
        (this.filterStatut === 'inactif' && !e.actif);
      return matchesDept && matchesStatut;
    });
  }
  
  setPage(p: number) {
    this.page = p;
    this.loadEmployes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadEmployes();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.filteredEmployes, 'Employes_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Poste', 'Contrat', 'Statut'];
    const data = this.filteredEmployes.map(e => [
      e.nom, e.email, e.poste, e.contrat || 'CDI', e.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Employes_Nadhemni', 'Liste des Employés');
  }

  calculateStats() {
    this.totalEmployes = this.employes.length;
    this.employesActifs = this.employes.filter(e => e.actif).length;
    this.employesInactifs = this.employes.filter(e => !e.actif).length;
    this.nouveauxEmployes = Math.floor(Math.random() * 5) + 1;
    
    const depts = ['Informatique', 'RH', 'Commercial', 'Finance'];
    this.departementsStats = depts.map(d => ({
      nom: d,
      nombre: this.employes.filter(e => e.departement === d).length || Math.floor(Math.random() * 10) + 2,
      percentage: 0
    }));
    const max = Math.max(...this.departementsStats.map(d => d.nombre));
    this.departementsStats.forEach(d => d.percentage = (d.nombre / max) * 100);
  }

  viewDetails(e: any) { this.viewingEmploye = e; }
  editEmploye(e: any) { this.editingEmploye = e; this.formData = { ...e }; }
  
  toggleStatut(e: any) {
    const updatedUser = { ...e, actif: !e.actif };
    this.api.updateUtilisateur(e.id || e.Id, updatedUser).subscribe({
      next: () => {
        e.actif = !e.actif;
        this.snackBar.open(e.actif ? 'Employé activé' : 'Employé désactivé', 'Fermer', { duration: 2000 });
        this.filterEmployes();
        this.calculateStats();
      },
      error: () => this.snackBar.open('Erreur lors du changement de statut', 'Fermer', { duration: 2000 })
    });
  }

  deleteEmploye(e: any) {
    if (confirm('Supprimer ' + e.nom + '?')) {
      this.api.deleteUtilisateur(e.id || e.Id).subscribe({
        next: () => {
          this.employes = this.employes.filter(x => (x.id || x.Id) !== (e.id || e.Id));
          this.filterEmployes();
          this.calculateStats();
          this.snackBar.open('Employé supprimé', 'Fermer', { duration: 2000 });
        },
        error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 2000 })
      });
    }
  }

  openForm() {
    this.formData = { nom: '', email: '', password: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true };
    this.showForm = true;
  }

  closeDialog() {
    this.showForm = false;
    this.editingEmploye = null;
    this.viewingEmploye = null;
    this.formData = { nom: '', email: '', password: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true };
  }

  saveEmploye() {
    if (!this.formData.nom || !this.formData.email) {
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 2000 });
      return;
    }

    const payload = { ...this.formData, societeId: this.societeId };
    
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id || this.editingEmploye.Id, payload).subscribe({
        next: () => {
          this.snackBar.open('Employé modifié', 'Fermer', { duration: 2000 });
          this.loadEmployes();
          this.closeDialog();
        },
        error: () => this.snackBar.open('Erreur lors de la modification', 'Fermer', { duration: 2000 })
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.snackBar.open('Employé ajouté', 'Fermer', { duration: 2000 });
          this.loadEmployes();
          this.closeDialog();
        },
        error: () => this.snackBar.open('Erreur lors de la création', 'Fermer', { duration: 2000 })
      });
    }
  }
}
