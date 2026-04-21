import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

interface Conge {
  id: string;
  utilisateurId: string;
  utilisateurNom: string;
  typeNom: string;
  dateDebut: string;
  dateFin: string;
  nombreJours: number;
  motif: string;
  status: string;
}

@Component({
  selector: 'app-rh-conges',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Centre de Validation RH</h1>
          <p class="subtitle">{{societeNom}} • Coordination de la disponibilité des équipes</p>
        </div>
        <div class="header-actions">
           <div class="header-badge p-badge-outline" [class.urgent]="getEnAttenteCount() > 0">
              <span class="pulse-amber" *ngIf="getEnAttenteCount() > 0"></span>
              {{getEnAttenteCount()}} requêtes à traiter
           </div>
           <button mat-flat-button class="p-btn p-btn-secondary" (click)="loadData()">
             <mat-icon>refresh</mat-icon> Actualiser
           </button>
        </div>
      </div>

      <div class="stats-grid-row">
        <div class="premium-card mini-stat">
          <div class="m-icon indigo-soft"><mat-icon>groups</mat-icon></div>
          <div class="m-info">
             <div class="m-val">{{stats.totalEmployes}}</div>
             <div class="m-label">Collaborateurs</div>
          </div>
        </div>
        <div class="premium-card mini-stat">
          <div class="m-icon emerald-soft"><mat-icon>event_available</mat-icon></div>
          <div class="m-info">
             <div class="m-val">{{stats.congesValidesCeMois}}</div>
             <div class="m-label">Approuvés ce mois</div>
          </div>
        </div>
        <div class="premium-card mini-stat pulse-card" *ngIf="stats.demandesCongesEnAttente > 0">
          <div class="m-icon amber-soft"><mat-icon>pending_actions</mat-icon></div>
          <div class="m-info">
             <div class="m-val">{{stats.demandesCongesEnAttente}}</div>
             <div class="m-label">En attente</div>
          </div>
        </div>
      </div>

      <div class="premium-card main-content shadow-premium">
        <div class="content-header">
            <h3>Registre des Demandes</h3>
            <div class="table-actions">
               <button mat-icon-button class="p-btn-icon" matTooltip="Filtrer"><mat-icon>filter_list</mat-icon></button>
               <button mat-icon-button class="p-btn-icon" matTooltip="Exporter PDF"><mat-icon>file_download</mat-icon></button>
            </div>
        </div>

        <div class="table-container">
          <table mat-table [dataSource]="conges" class="p-table">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>Réf.</th>
              <td mat-cell *matCellDef="let c" class="ref-cell">#{{c.id?.substring(0,6)}}</td>
            </ng-container>

            <ng-container matColumnDef="employe">
              <th mat-header-cell *matHeaderCellDef>Collaborateur</th>
              <td mat-cell *matCellDef="let c">
                 <div class="emp-cell">
                    <div class="mini-orb" [style.background]="'hsl('+(c.utilisateurNom?.length * 40)+', 60%, 55%)'">{{c.utilisateurNom?.charAt(0)}}</div>
                    <div class="emp-info">
                      <span class="emp-name">{{c.utilisateurNom}}</span>
                    </div>
                 </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="type">
              <th mat-header-cell *matHeaderCellDef>Type</th>
              <td mat-cell *matCellDef="let c">
                 <span class="type-pill" [class.type-maladie]="c.typeNom === 'Maladie'">{{c.typeNom}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="periode">
              <th mat-header-cell *matHeaderCellDef>Période</th>
              <td mat-cell *matCellDef="let c" class="date-range">
                 <div class="date-display">
                   <span>{{c.dateDebut | date:'dd MMM'}}</span>
                   <mat-icon>arrow_right_alt</mat-icon>
                   <span>{{c.dateFin | date:'dd MMM'}}</span>
                 </div>
                 <span class="day-count">{{c.nombreJours}}j</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="motif">
              <th mat-header-cell *matHeaderCellDef>Motif</th>
              <td mat-cell *matCellDef="let c" class="motif-cell">
                <span [matTooltip]="c.motif">{{c.motif || 'Non spécifié'}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>État</th>
              <td mat-cell *matCellDef="let c">
                <span class="status-chip-premium" [class]="'status-'+c.status?.toLowerCase().replace(' ', '-')">
                  <span class="dot"></span>
                  {{c.status}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Décision</th>
              <td mat-cell *matCellDef="let c">
                <div class="action-group">
                  @if (c.status === 'En attente') {
                    <button mat-icon-button class="btn-check" (click)="validerConge(c, true)" matTooltip="Approuver"><mat-icon>done</mat-icon></button>
                    <button mat-icon-button class="btn-cancel" (click)="validerConge(c, false)" matTooltip="Refuser"><mat-icon>close</mat-icon></button>
                  } @else {
                    <button mat-icon-button (click)="voirDetail(c)" matTooltip="Détails"><mat-icon>info_outline</mat-icon></button>
                  }
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="p-row-hover"></tr>
          </table>

          @if (conges.length === 0) {
            <div class="empty-state-p">
               <div class="empty-icon-circle">
                 <mat-icon>verified_user</mat-icon>
               </div>
               <h3>Aucune demande en attente</h3>
               <p>Votre équipe est à jour. Profitez-en pour consulter les rapports.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 40px; max-width: 1400px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 14px; margin: 6px 0 0; font-weight: 500; }
    
    .header-actions { display: flex; gap: 16px; align-items: center; }
    .header-badge { display: flex; align-items: center; gap: 12px; padding: 10px 24px; border-radius: 40px; font-size: 13px; font-weight: 700; color: #475569; background: white; border: 1px solid #e2e8f0; }
    .header-badge.urgent { border-color: #fbd38d; background: #fffaf0; color: #b7791f; }
    .pulse-amber { width: 8px; height: 8px; background: #f59e0b; border-radius: 50%; box-shadow: 0 0 0 rgba(245, 158, 11, 0.4); animation: pulse-a 2s infinite; }
    @keyframes pulse-a { 0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); } 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); } }

    .stats-grid-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 32px; }
    .mini-stat { display: flex; align-items: center; gap: 24px; padding: 24px !important; border-radius: 20px; transition: transform 0.3s; }
    .mini-stat:hover { transform: translateY(-5px); }
    .m-icon { width: 52px; height: 52px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
    .m-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }
    
    .indigo-soft { background: #eef2ff; color: #4f46e5; }
    .emerald-soft { background: #ecfdf5; color: #10b981; }
    .amber-soft { background: #fffbeb; color: #f59e0b; }

    .m-val { font-size: 24px; font-weight: 900; color: #1e293b; line-height: 1; }
    .m-label { font-size: 13px; color: #64748b; font-weight: 600; margin-top: 4px; }

    .main-content { padding: 0 !important; overflow: hidden; border-radius: 24px; border: none; }
    .content-header { padding: 32px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; background: white; }
    .content-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; }
    
    .table-container { background: white; }
    .p-table { width: 100%; border: none; }
    ::ng-deep .p-table th { background: #f8fafc !important; color: #64748b !important; font-size: 12px !important; font-weight: 800 !important; text-transform: uppercase !important; letter-spacing: 1px !important; padding: 20px 32px !important; }
    ::ng-deep .p-table td { padding: 20px 32px !important; border-bottom: 1px solid #f1f5f9; font-size: 14px; color: #475569; }
    
    .ref-cell { font-family: 'JetBrains Mono', monospace; font-weight: 700; color: #3b82f6; font-size: 12px; }
    .emp-cell { display: flex; align-items: center; gap: 14px; }
    .mini-orb { width: 36px; height: 36px; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 900; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
    .emp-name { font-weight: 700; color: #1e293b; display: block; }
    
    .type-pill { background: #f1f5f9; padding: 6px 14px; border-radius: 10px; font-size: 12px; font-weight: 700; color: #475569; }
    .type-maladie { background: #fef2f2; color: #ef4444; }
    
    .date-range { display: flex; flex-direction: column; gap: 4px; }
    .date-display { display: flex; align-items: center; gap: 8px; font-weight: 600; color: #334155; }
    .date-display mat-icon { font-size: 16px; width: 16px; height: 16px; color: #94a3b8; }
    .day-count { font-weight: 900; color: #3b82f6; font-size: 11px; background: #eff6ff; padding: 2px 8px; border-radius: 4px; width: fit-content; }
    
    .motif-cell { color: #94a3b8; font-style: italic; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; cursor: pointer; }
    
    .status-chip-premium { 
      display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; 
      border-radius: 40px; font-size: 12px; font-weight: 700;
    }
    .status-chip-premium .dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-validée { background: #ecfdf5; color: #059669; }
    .status-validée .dot { background: #059669; box-shadow: 0 0 8px #059669; }
    .status-refusée { background: #fef2f2; color: #dc2626; }
    .status-refusée .dot { background: #dc2626; }
    .status-en-attente { background: #fffbeb; color: #d97706; }
    .status-en-attente .dot { background: #d97706; animation: blink 1.5s infinite; }
    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

    .action-group { display: flex; gap: 10px; }
    .btn-check { color: #059669; background: #ecfdf5; transition: all 0.2s; }
    .btn-check:hover { background: #059669; color: white; transform: scale(1.1); }
    .btn-cancel { color: #dc2626; background: #fef2f2; transition: all 0.2s; }
    .btn-cancel:hover { background: #dc2626; color: white; transform: scale(1.1); }
    
    .empty-state-p { padding: 100px; text-align: center; color: #94a3b8; background: white; }
    .empty-icon-circle { width: 80px; height: 80px; background: #f1f5f9; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #cbd5e1; }
    .empty-icon-circle mat-icon { font-size: 40px; width: 40px; height: 40px; }
    .empty-state-p h3 { color: #334155; font-weight: 800; margin-bottom: 8px; }
  `]
})
export class RhCongesComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  
  societeId: string = '';
  societeNom: string = '';
  currentUserId: string = '';
  
  conges: Conge[] = [];
  displayedColumns = ['id', 'employe', 'type', 'periode', 'motif', 'status', 'actions'];

  stats = { 
    totalEmployes: 0, 
    congesValidesCeMois: 0, 
    demandesCongesEnAttente: 0 
  };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentUserId = user?.id || '';
    this.loadData();
  }

  loadData() {
    this.loadStats();
    this.loadConges();
  }

  loadStats() {
    this.api.getRHStats(this.societeId).subscribe(res => {
      this.stats = res;
    });
  }

  loadConges() {
    this.api.getDemandesEnAttenteReal(this.societeId).subscribe({
      next: (data) => {
        this.conges = data;
      },
      error: () => {
        this.snackBar.open('Erreur de chargement des demandes', 'Fermer', { duration: 3000 });
      }
    });
  }

  getEnAttenteCount() {
    return this.conges.filter(c => c.status === 'En attente').length;
  }

  validerConge(c: Conge, approuve: boolean) {
    this.api.validerDemandeCongeReal(c.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.snackBar.open(res.message, 'Fermer', { duration: 3000 });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }

  voirDetail(c: Conge) {
    this.snackBar.open(`Détails: ${c.utilisateurNom} - ${c.typeNom} (${c.nombreJours} jours)`, 'Fermer', { duration: 3000 });
  }
}
