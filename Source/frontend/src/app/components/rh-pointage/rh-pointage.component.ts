import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

interface PointageDisplay {
  id?: string;
  utilisateurId: string;
  nomComplet: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  heuresTravaillees: number;
  status: 'Présent' | 'En cours' | 'Absent';
}

@Component({
  selector: 'app-rh-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Monitoring des Présences</h1>
          <p class="subtitle">{{societeNom}} • {{currentDateDisplay}}</p>
        </div>
        <div class="header-monitor shadow-premium">
           <div class="monitor-tile">
              <span class="m-val emerald">{{stats.employesActifs}}</span>
              <span class="m-label">Présents</span>
           </div>
           <div class="monitor-tile">
              <span class="m-val amber">{{stats.employesAbsents}}</span>
              <span class="m-label">Absents</span>
           </div>
           <div class="monitor-tile">
              <span class="m-val indigo">{{stats.tauxPresence}}%</span>
              <span class="m-label">Taux Présence</span>
           </div>
        </div>
      </div>

      <div class="premium-card toolbar-widget shadow-premium">
        <div class="filters-row">
            <div class="filter-group main-search">
              <mat-icon>search</mat-icon>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterData()" placeholder="Rechercher un collaborateur..." class="p-ghost-input">
            </div>

            <div class="filter-group">
              <mat-icon>calendar_today</mat-icon>
              <input type="date" [(ngModel)]="filterDate" (ngModelChange)="loadData()" class="p-date-input">
            </div>

            <div class="filter-spacer"></div>

            <button mat-flat-button class="p-btn p-btn-secondary" (click)="loadData()">
               <mat-icon>refresh</mat-icon> Actualiser
            </button>

            <button mat-flat-button class="p-btn p-btn-primary" (click)="exportRapportHTML()" [matTooltip]="'Rapport ' + rapportMois + '/' + rapportAnnee">
               <mat-icon>picture_as_pdf</mat-icon> Rapport PDF
            </button>

            <button mat-stroked-button class="p-btn" (click)="exportRapportCSV()">
               <mat-icon>table_chart</mat-icon> CSV
            </button>
        </div>

        <div class="rapport-controls">
          <label class="rc-label">Mois du rapport :</label>
          <select [(ngModel)]="rapportMois" class="p-date-input">
            <option [value]="1">Janvier</option><option [value]="2">Février</option>
            <option [value]="3">Mars</option><option [value]="4">Avril</option>
            <option [value]="5">Mai</option><option [value]="6">Juin</option>
            <option [value]="7">Juillet</option><option [value]="8">Août</option>
            <option [value]="9">Septembre</option><option [value]="10">Octobre</option>
            <option [value]="11">Novembre</option><option [value]="12">Décembre</option>
          </select>
          <select [(ngModel)]="rapportAnnee" class="p-date-input">
            <option [value]="2024">2024</option>
            <option [value]="2025">2025</option>
            <option [value]="2026">2026</option>
          </select>
        </div>
      </div>

      <div class="premium-card main-content shadow-premium">
        <div class="table-container custom-scroll">
          <table mat-table [dataSource]="filteredPointages" class="p-table">
            <ng-container matColumnDef="employe">
              <th mat-header-cell *matHeaderCellDef>Collaborateur</th>
              <td mat-cell *matCellDef="let p">
                 <div class="emp-cell">
                    <div class="mini-orb" [style.background]="'hsl('+(p.nomComplet.length * 45)+', 60%, 55%)'">{{p.nomComplet.charAt(0)}}</div>
                    <div class="emp-info">
                       <span class="emp-name">{{p.nomComplet}}</span>
                       <span class="emp-id">#{{p.utilisateurId?.substring(0,6)}}</span>
                    </div>
                 </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="entre">
              <th mat-header-cell *matHeaderCellDef>Arrivée</th>
              <td mat-cell *matCellDef="let p">
                 <div class="time-pill" [class.empty]="!p.heureDebut">
                    <mat-icon>login</mat-icon>
                    <span>{{p.heureDebut || '--:--'}}</span>
                 </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="sortie">
              <th mat-header-cell *matHeaderCellDef>Départ</th>
              <td mat-cell *matCellDef="let p">
                 <div class="time-pill" [class.empty]="!p.heureFin">
                    <mat-icon>logout</mat-icon>
                    <span>{{p.heureFin || (p.heureDebut ? 'En cours' : '--:--')}}</span>
                 </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="total">
              <th mat-header-cell *matHeaderCellDef>Activité</th>
              <td mat-cell *matCellDef="let p">
                 <span class="activity-tag" *ngIf="p.heuresTravaillees > 0">
                    {{p.heuresTravaillees}}h
                 </span>
                 <span class="no-activity" *ngIf="!p.heuresTravaillees || p.heuresTravaillees === 0">--</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="statut">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let p">
                <span class="status-indicator-premium" [class]="'status-'+p.status?.toLowerCase().replace(' ', '-')">
                  <span class="dot"></span>
                  {{p.status}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef></th>
              <td mat-cell *matCellDef="let p">
                <div class="action-row">
                   <button mat-icon-button class="p-btn-icon" matTooltip="Ajuster" (click)="editPointage(p)"><mat-icon>tune</mat-icon></button>
                   <button mat-icon-button class="p-btn-icon" matTooltip="Historique"><mat-icon>bar_chart</mat-icon></button>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="p-row-hover"></tr>
          </table>

          @if (filteredPointages.length === 0) {
            <div class="empty-state-p">
               <div class="empty-orb"><mat-icon>person_search</mat-icon></div>
               <h3>Aucun résultat trouvé</h3>
               <p>Modifiez vos filtres ou lancez une nouvelle recherche.</p>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showEditDialog) {
      <div class="p-modal-overlay" (click)="closeEditDialog()">
        <div class="premium-card p-modal shadow-premium" (click)="$event.stopPropagation()">
          <div class="p-modal-header">
             <h2>Ajustement du Temps</h2>
             <button mat-icon-button (click)="closeEditDialog()"><mat-icon>close</mat-icon></button>
          </div>
          <div class="p-modal-body">
             <div class="p-form-group">
                <label>Collaborateur</label>
                <div class="p-readonly-field">{{editingPointage?.nomComplet}}</div>
             </div>
             <div class="p-form-grid">
                <div class="p-form-group">
                  <label>Heure d'entrée</label>
                  <input type="time" [(ngModel)]="editForm.entre" class="p-time-input">
                </div>
                <div class="p-form-group">
                  <label>Heure de sortie</label>
                  <input type="time" [(ngModel)]="editForm.sortie" class="p-time-input">
                </div>
             </div>
          </div>
          <div class="p-modal-footer">
             <button mat-button class="p-btn-text" (click)="closeEditDialog()">Annuler</button>
             <button mat-flat-button class="p-btn p-btn-primary" (click)="savePointageEdit()">Appliquer</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .container { padding: 40px; max-width: 1400px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 14px; margin: 6px 0 0; font-weight: 500; }
    
    .header-monitor { display: flex; background: white; padding: 12px; border-radius: 24px; border: 1px solid #e2e8f0; }
    .monitor-tile { 
      padding: 12px 32px; border-right: 1px solid #f1f5f9;
      display: flex; flex-direction: column; align-items: center;
    }
    .monitor-tile:last-child { border-right: none; }
    .m-val { font-size: 28px; font-weight: 900; line-height: 1; }
    .m-val.emerald { color: #10b981; }
    .m-val.amber { color: #f59e0b; }
    .m-val.indigo { color: #6366f1; }
    .m-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-top: 6px; letter-spacing: 0.5px; }

    .toolbar-widget { padding: 16px 32px; margin-bottom: 32px; border-radius: 24px; background: white; }
    .filters-row { display: flex; gap: 32px; align-items: center; }
    .filter-group { display: flex; align-items: center; gap: 12px; color: #64748b; }
    .main-search { flex: 1; max-width: 400px; padding: 10px 20px; background: #f8fafc; border-radius: 14px; }
    .p-ghost-input { border: none; background: transparent; width: 100%; font-size: 14px; font-weight: 600; color: #1e293b; outline: none; }
    .p-date-input { border: none; background: #f1f5f9; padding: 8px 16px; border-radius: 10px; font-size: 14px; font-weight: 700; color: #1e293b; cursor: pointer; }
    .filter-spacer { flex: 1; }

    .main-content { padding: 0 !important; overflow: hidden; border-radius: 28px; border: none; }
    .p-table { width: 100%; border: none; }
    ::ng-deep .p-table th { background: #f8fafc !important; color: #64748b !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; padding: 24px 32px !important; }
    ::ng-deep .p-table td { padding: 20px 32px !important; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #475569; background: white; }
    
    .emp-cell { display: flex; align-items: center; gap: 16px; }
    .mini-orb { width: 40px; height: 40px; border-radius: 14px; color: white; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; }
    .emp-name { font-weight: 800; color: #1e293b; display: block; line-height: 1.2; }
    .emp-id { font-size: 11px; color: #94a3b8; font-weight: 700; font-family: 'JetBrains Mono', monospace; }

    .time-pill { display: inline-flex; align-items: center; gap: 10px; padding: 8px 16px; background: #f8fafc; border-radius: 12px; font-weight: 700; color: #1e293b; border: 1px solid #f1f5f9; }
    .time-pill mat-icon { font-size: 18px; width: 18px; height: 18px; color: #3b82f6; }
    .time-pill.empty { opacity: 0.4; font-weight: 500; font-style: italic; }

    .activity-tag { background: #eff6ff; color: #2563eb; padding: 6px 14px; border-radius: 8px; font-weight: 900; font-size: 13px; }
    .no-activity { color: #cbd5e1; font-weight: 900; }

    .status-indicator-premium { 
      display: inline-flex; align-items: center; gap: 10px; padding: 8px 18px; 
      border-radius: 40px; font-size: 12px; font-weight: 800;
    }
    .status-indicator-premium .dot { width: 8px; height: 8px; border-radius: 50%; }
    .status-présent { background: #ecfdf5; color: #059669; }
    .status-présent .dot { background: #10b981; box-shadow: 0 0 10px #10b981; }
    .status-en-cours { background: #eff6ff; color: #2563eb; }
    .status-en-cours .dot { background: #3b82f6; animation: blink 1.5s infinite; }
    .status-absent { background: #fef2f2; color: #dc2626; }
    .status-absent .dot { background: #dc2626; }
    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

    .action-row { display: flex; gap: 8px; }
    .empty-state-p { padding: 120px; text-align: center; color: #94a3b8; background: white; }
    .empty-orb { width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
    .empty-orb mat-icon { font-size: 40px; width: 40px; height: 40px; color: #cbd5e1; }
    .empty-state-p h3 { color: #334155; font-weight: 800; margin-bottom: 8px; }

    .p-modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
    .p-modal { width: 480px; padding: 0 !important; border-radius: 32px; overflow: hidden; border: none; }
    .p-modal-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; background: white; border-bottom: 1px solid #f1f5f9; }
    .p-modal-header h2 { margin: 0; font-size: 20px; font-weight: 900; color: #1e293b; }
    .p-modal-body { padding: 32px; background: white; }
    .p-modal-footer { padding: 24px 32px; display: flex; justify-content: flex-end; gap: 16px; background: #f8fafc; }
    .p-form-group label { display: block; font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 1px; }
    .p-readonly-field { padding: 14px 20px; background: #f1f5f9; border-radius: 14px; font-weight: 800; color: #1e293b; }
    .p-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    .p-time-input { width: 100%; padding: 14px 20px; border: 2px solid #f1f5f9; border-radius: 14px; font-weight: 800; color: #1e293b; outline: none; transition: all 0.2s; }
    .p-time-input:focus { border-color: #3b82f6; background: white; box-shadow: 0 0 0 4px rgba(59,130,246,0.1); }
    .rapport-controls { display: flex; align-items: center; gap: 12px; padding: 12px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9; }
    .rc-label { font-size: 13px; font-weight: 700; color: #64748b; }
  `]
})
export class RhPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  filterDate = '';
  searchQuery = '';
  rapportMois = new Date().getMonth() + 1;
  rapportAnnee = new Date().getFullYear();
  
  pointages: PointageDisplay[] = [];
  filteredPointages: PointageDisplay[] = [];
  displayedColumns = ['employe', 'entre', 'sortie', 'total', 'statut', 'actions'];
  
  stats = { totalEmployes: 0, employesActifs: 0, employesAbsents: 0, tauxPresence: 0 };
  
  showEditDialog = false;
  editingPointage: PointageDisplay | null = null;
  editForm: any = {};

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentDateDisplay = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.filterDate = new Date().toISOString().split('T')[0];
    this.loadData();
  }

  loadData() {
    this.loadStats();
    
    this.api.getEmployesBySociete(this.societeId).subscribe(employes => {
       this.api.getPointages().subscribe(allPointages => {
          const targetDate = this.filterDate;
          const todayPointages = allPointages.filter((p: any) => p.date?.split('T')[0] === targetDate);
          
          this.pointages = employes.map((emp: any) => {
             const p = todayPointages.find((ptg: any) => ptg.utilisateurId === emp.id);
             let status: 'Présent' | 'En cours' | 'Absent' = 'Absent';
             
             if (p) {
                status = p.heureFin ? 'Présent' : 'En cours';
             }
             
             return {
                id: p?.id,
                utilisateurId: emp.id,
                nomComplet: emp.nom + ' ' + (emp.prenom || ''),
                date: targetDate,
                heureDebut: p?.heureDebut ? p.heureDebut.substring(0, 5) : '',
                heureFin: p?.heureFin ? p.heureFin.substring(0, 5) : '',
                heuresTravaillees: 0, // Will be fetched or calculated
                status: status
             };
          });

          // Fetch worked hours for each
          this.pointages.forEach(ptg => {
             if (ptg.heureDebut && ptg.heureFin) {
                this.api.getWorkedHoursReal(ptg.utilisateurId, ptg.date).subscribe(res => {
                   ptg.heuresTravaillees = res.heuresTravaillees;
                });
             }
          });

          this.filterData();
       });
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId, this.filterDate).subscribe(res => {
       this.stats = res;
    });
  }

  filterData() {
    this.filteredPointages = this.pointages.filter(p => 
       p.nomComplet.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  editPointage(p: PointageDisplay) {
     this.editingPointage = p;
     this.editForm = {
        entre: p.heureDebut,
        sortie: p.heureFin
     };
     this.showEditDialog = true;
  }

  closeEditDialog() {
     this.showEditDialog = false;
     this.editingPointage = null;
  }

  savePointageEdit() {
     if (!this.editingPointage) return;
     
     const data = {
        id: this.editingPointage.id,
        utilisateurId: this.editingPointage.utilisateurId,
        societeId: this.societeId,
        date: this.editingPointage.date,
        heureDebut: this.editForm.entre,
        heureFin: this.editForm.sortie,
        actif: true
     };

     const action = data.id ? this.api.updatePointage(data) : this.api.createPointage(data);
     
     action.subscribe({
        next: () => {
           this.snackBar.open('Pointage mis à jour avec succès', 'Fermer', { duration: 3000 });
           this.closeEditDialog();
           this.loadData();
        },
        error: () => {
           this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
     });
  }

  /** Open the HTML report in a new tab so the user can Print → Save as PDF */
  exportRapportHTML() {
    const url = this.api.getRapportPresenceUrl(this.societeId, this.rapportMois, this.rapportAnnee, 'html');
    window.open(url, '_blank');
  }

  /** Download a CSV attendance report */
  exportRapportCSV() {
    this.api.getRapportPresence(this.societeId, this.rapportMois, this.rapportAnnee).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presence_${this.societeNom}_${this.rapportAnnee}_${String(this.rapportMois).padStart(2,'0')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.snackBar.open('Export CSV téléchargé ✓', 'Fermer', { duration: 3000 });
    });
  }
}
