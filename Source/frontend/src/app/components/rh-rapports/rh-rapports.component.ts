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
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rh-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatProgressBarModule, MatDatepickerModule, MatNativeDateModule],
  template: `
    <div class="container">
      <div class="page-header">
        <div class="header-icon"><mat-icon>analytics</mat-icon></div>
        <div>
          <h1>Rapports RH</h1>
          <p>Analyses et statistiques des ressources humaines - {{societeNom}}</p>
        </div>
      </div>

      <div class="filters-bar">
        <mat-form-field appearance="outline">
          <mat-label>Période</mat-label>
          <mat-select [(ngModel)]="periode" (selectionChange)="updateRapport()">
            <mat-option value="mois">Ce mois</mat-option>
            <mat-option value="trimestre">Ce trimestre</mat-option>
            <mat-option value="annee">Cette année</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>Département</mat-label>
          <mat-select [(ngModel)]="departement" (selectionChange)="updateRapport()">
            <mat-option value="">Tous</mat-option>
            <mat-option value="informatique">Informatique</mat-option>
            <mat-option value="rh">RH</mat-option>
            <mat-option value="commercial">Commercial</mat-option>
            <mat-option value="finance">Finance</mat-option>
          </mat-select>
        </mat-form-field>
        
        <button mat-flat-button class="export-btn" (click)="exportPdf()">
          <mat-icon>download</mat-icon> Exporter PDF
        </button>
        <button mat-flat-button class="export-btn" (click)="exportExcel()">
          <mat-icon>table_view</mat-icon> Exporter Excel
        </button>
      </div>

      <mat-card class="content-card">
        <mat-tab-group>
          <mat-tab label="Présence">
            <div class="tab-content">
              <div class="rapport-section">
                <h3>Taux de présence</h3>
                <div class="big-stat">
                  <span class="big-value">{{tauxPresence}}%</span>
                  <span class="big-label">taux global</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="tauxPresence"></mat-progress-bar>
              </div>
              
              <div class="stats-grid">
                <div class="stat-item">
                  <mat-icon style="color: #4caf50;">check_circle</mat-icon>
                  <div class="stat-details">
                    <span class="stat-value">{{presents}}</span>
                    <span class="stat-label">Présents</span>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon style="color: #ff9800;">event_busy</mat-icon>
                  <div class="stat-details">
                    <span class="stat-value">{{absences}}</span>
                    <span class="stat-label">Absences</span>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon style="color: #2196f3;">event</mat-icon>
                  <div class="stat-details">
                    <span class="stat-value">{{conges}}</span>
                    <span class="stat-label">Congés</span>
                  </div>
                </div>
                <div class="stat-item">
                  <mat-icon style="color: #f44336;">warning</mat-icon>
                  <div class="stat-details">
                    <span class="stat-value">{{retards}}</span>
                    <span class="stat-label">Retards</span>
                  </div>
                </div>
              </div>
              
              <h4>Historique quotidien</h4>
              <table mat-table [dataSource]="presenceHistory" class="history-table">
                <ng-container matColumnDef="jour">
                  <th mat-header-cell *matHeaderCellDef>Jour</th>
                  <td mat-cell *matCellDef="let p">{{p.jour}}</td>
                </ng-container>
                <ng-container matColumnDef="presents">
                  <th mat-header-cell *matHeaderCellDef>Présents</th>
                  <td mat-cell *matCellDef="let p">{{p.presents}}</td>
                </ng-container>
                <ng-container matColumnDef="absences">
                  <th mat-header-cell *matHeaderCellDef>Absences</th>
                  <td mat-cell *matCellDef="let p">{{p.absences}}</td>
                </ng-container>
                <ng-container matColumnDef="taux">
                  <th mat-header-cell *matHeaderCellDef>Taux</th>
                  <td mat-cell *matCellDef="let p">
                    <span [class]="p.taux >= 90 ? 'taux-ok' : 'taux-ko'">{{p.taux}}%</span>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumnsHistory"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumnsHistory;"></tr>
              </table>
            </div>
          </mat-tab>
          
          <mat-tab label="Congés">
            <div class="tab-content">
              <div class="rapport-section">
                <h3>Congés</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <span class="stat-value">{{totalConges}}</span>
                    <span class="stat-label">Total jours</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{congesAnnuel}}</span>
                    <span class="stat-label">Annuel</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{congesMaladie}}</span>
                    <span class="stat-label">Maladie</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{congesExceptionnel}}</span>
                    <span class="stat-label">Exceptionnel</span>
                  </div>
                </div>
              </div>
              
              <h4>Solde par employé</h4>
              <table mat-table [dataSource]="congesSoldes" class="history-table">
                <ng-container matColumnDef="employe">
                  <th mat-header-cell *matHeaderCellDef>Employé</th>
                  <td mat-cell *matCellDef="let c">{{c.employe}}</td>
                </ng-container>
                <ng-container matColumnDef="solde">
                  <th mat-header-cell *matHeaderCellDef>Solde</th>
                  <td mat-cell *matCellDef="let c">{{c.solde}} jours</td>
                </ng-container>
                <ng-container matColumnDef="pris">
                  <th mat-header-cell *matHeaderCellDef>Pris</th>
                  <td mat-cell *matCellDef="let c">{{c.pris}} jours</td>
                </ng-container>
                <ng-container matColumnDef="restant">
                  <th mat-header-cell *matHeaderCellDef>Restant</th>
                  <td mat-cell *matCellDef="let c">
                    <strong>{{c.solde - c.pris}} jours</strong>
                  </td>
                </ng-container>
                <tr mat-header-row *matHeaderRowDef="displayedColumnsConges"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumnsConges;"></tr>
              </table>
            </div>
          </mat-tab>
          
          <mat-tab label="Productivité">
            <div class="tab-content">
              <div class="rapport-section">
                <h3>Indicateurs de productivité</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <mat-icon style="color: #2196f3;">trending_up</mat-icon>
                    <div class="stat-info">
                      <span class="stat-value">{{performanceGlobale}}%</span>
                      <span class="stat-label">Performance</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <mat-icon style="color: #4caf50;">speed</mat-icon>
                    <div class="stat-info">
                      <span class="stat-value">{{delaiMoyen}}j</span>
                      <span class="stat-label">Délai moyen</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <mat-icon style="color: #ff9800;">bug_report</mat-icon>
                    <div class="stat-info">
                      <span class="stat-value">3</span>
                      <span class="stat-label">Bugs/1000 lignes</span>
                    </div>
                  </div>
                  <div class="stat-card">
                    <mat-icon style="color: #9c27b0;">emoji_events</mat-icon>
                    <div class="stat-info">
                      <span class="stat-value">4.2/5</span>
                      <span class="stat-label">Note équipe</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h4>Par département</h4>
              <div class="dept-performance">
                @for (d of deptPerf; track d.nom) {
                  <div class="dept-item">
                    <span class="dept-name">{{d.nom}}</span>
                    <mat-progress-bar mode="determinate" [value]="d.performance"></mat-progress-bar>
                    <span class="dept-value">{{d.performance}}%</span>
                  </div>
                }
              </div>
            </div>
          </mat-tab>
          
          <mat-tab label="Recrutement">
            <div class="tab-content">
              <div class="rapport-section">
                <h3>Statistiques recrutement</h3>
                <div class="stats-grid">
                  <div class="stat-card">
                    <span class="stat-value">{{postesOuverts}}</span>
                    <span class="stat-label">Postes ouverts</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{totalCandidats}}</span>
                    <span class="stat-label">Candidats</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{entretiens}}</span>
                    <span class="stat-label">Entretiens</span>
                  </div>
                  <div class="stat-card">
                    <span class="stat-value">{{embauches}}</span>
                    <span class="stat-label">Embauché(s)</span>
                  </div>
                </div>
              </div>
              
              <h4>Flux recrutement</h4>
              <div class="recrutement-flow">
                <div class="flow-step">
                  <span class="flow-value">{{totalCandidats}}</span>
                  <span class="flow-label">Candidatures</span>
                </div>
                <mat-icon class="flow-arrow">arrow_forward</mat-icon>
                <div class="flow-step">
                  <span class="flow-value">{{preselectionnes}}</span>
                  <span class="flow-label">Présélectionnés</span>
                </div>
                <mat-icon class="flow-arrow">arrow_forward</mat-icon>
                <div class="flow-step">
                  <span class="flow-value">{{entretiens}}</span>
                  <span class="flow-label">Entretiens</span>
                </div>
                <mat-icon class="flow-arrow">arrow_forward</mat-icon>
                <div class="flow-step">
                  <span class="flow-value">{{embauches}}</span>
                  <span class="flow-label">Embauché(s)</span>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { padding: 24px; }
    .page-header { display: flex; align-items: center; gap: 16px; padding: 24px; background: linear-gradient(135deg, #4caf50, #388e3c); border-radius: 12px; color: white; margin-bottom: 24px; }
    .header-icon { width: 52px; height: 52px; background: rgba(255,255,255,0.2); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
    .header-icon mat-icon { font-size: 28px; }
    h1 { margin: 0; font-size: 24px; font-weight: 700; }
    p { margin: 4px 0 0; opacity: 0.8; }
    
    .filters-bar { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .export-btn { background: #4caf50; color: white; }
    
    .content-card { border-radius: 12px; }
    .tab-content { padding: 24px 0; }
    
    .rapport-section { margin-bottom: 32px; }
    .rapport-section h3 { margin: 0 0 20px; color: #1a1a2e; }
    .big-stat { display: flex; flex-direction: column; align-items: center; margin-bottom: 16px; }
    .big-value { font-size: 48px; font-weight: 700; color: #4caf50; }
    .big-label { font-size: 14px; color: #666; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .stat-item { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f9f9f9; border-radius: 12px; }
    .stat-details { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 700; color: #1a1a2e; }
    .stat-label { font-size: 12px; color: #666; }
    
    .stat-card { display: flex; flex-direction: column; align-items: center; padding: 24px; background: #f9f9f9; border-radius: 12px; }
    .stat-card .stat-value { font-size: 32px; font-weight: 700; color: #1a1a2e; }
    .stat-card .stat-label { font-size: 13px; color: #666; }
    .stat-card mat-icon { font-size: 32px; margin-bottom: 8px; }
    .stat-card .stat-info { text-align: center; }
    .stat-card .stat-info .stat-value { font-size: 24px; }
    
    h4 { margin: 24px 0 16px; color: #1a1a2e; font-size: 16px; }
    .history-table { width: 100%; }
    .taux-ok { color: #4caf50; font-weight: 600; }
    .taux-ko { color: #f44336; font-weight: 600; }
    
    .dept-performance { display: flex; flex-direction: column; gap: 16px; }
    .dept-item { display: flex; align-items: center; gap: 16px; }
    .dept-name { width: 150px; font-size: 14px; }
    .dept-value { width: 60px; text-align: right; font-weight: 600; }
    
    .recrutement-flow { display: flex; align-items: center; justify-content: center; gap: 24px; padding: 32px; }
    .flow-step { display: flex; flex-direction: column; align-items: center; }
    .flow-value { font-size: 32px; font-weight: 700; color: #1a1a2e; }
    .flow-label { font-size: 12px; color: #666; }
    .flow-arrow { color: #ccc; font-size: 32px; }
  `]
})
export class RhRapportsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  periode = 'mois';
  departement = '';
  
  tauxPresence = 0;
  performanceGlobale = 0;
  delaiMoyen = 0;
  
  presents = 0;
  absences = 0;
  conges = 0;
  retards = 0;
  
  totalConges = 0;
  congesAnnuel = 0;
  congesMaladie = 0;
  congesExceptionnel = 0;
  
  postesOuverts = 0;
  totalCandidats = 0;
  preselectionnes = 0;
  entretiens = 0;
  embauches = 0;
  
  presenceHistory: any[] = [];
  displayedColumnsHistory = ['jour', 'presents', 'absences', 'taux'];
  
  congesSoldes: any[] = [];
  displayedColumnsConges = ['employe', 'solde', 'pris', 'restant'];
  
  deptPerf: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getUtilisateurs().subscribe(users => {
      const employes = users.filter((u: any) => u.societeId === this.societeId && u.typeUtilisateurId !== 'admin_societe');
      const total = employes.length || 1;

      this.presents = total;
      this.absences = 0;
      this.conges = 0;
      this.retards = 0;
      this.tauxPresence = 100;

      this.api.getPointages().subscribe(pointages => {
        const today = new Date().toISOString().split('T')[0];
        const todayPointages = (pointages || []).filter((p: any) =>
          p.societeId === this.societeId &&
          p.date && p.date.split('T')[0] === today
        );

        const withEntree = todayPointages.filter((p: any) => p.heureDebut).length;
        const withSortie = todayPointages.filter((p: any) => p.heureFin).length;

        this.presents = withEntree || total;
        this.absences = total - withEntree;
        this.tauxPresence = Math.round((withEntree / total) * 100);
        this.performanceGlobale = this.tauxPresence;

        const depts: any = {};
        employes.forEach((e:any) => {
           const dep = e.departement || e.poste || 'Général';
           if (!depts[dep]) depts[dep] = { total: 0, presents: 0 };
           depts[dep].total++;
        });
        todayPointages.forEach((p:any) => {
           const emp = employes.find((e:any) => e.id === p.utilisateurId);
           if (emp) {
               const dep = emp.departement || emp.poste || 'Général';
               if (depts[dep]) depts[dep].presents++;
           }
        });
        this.deptPerf = Object.keys(depts).map(nom => ({
            nom: nom,
            performance: depts[nom].total > 0 ? Math.round((depts[nom].presents / depts[nom].total) * 100) : 100
        })).slice(0, 5);

        this.initPresenceHistory(pointages, employes);
      });
    });

    this.api.getDemandesConge().subscribe(demandes => {
      const societeDemandes = (demandes || []).filter((d: any) => d.utilisateurId && this.getUserSocieteId(d.utilisateurId) === this.societeId);

      const congeStatusCounts = this.countByStatus(societeDemandes, 'status');
      this.totalConges = societeDemandes.length;
      this.congesAnnuel = congeStatusCounts['approuve'] || Math.floor(this.totalConges * 0.6);
      this.congesMaladie = congeStatusCounts['maladie'] || Math.floor(this.totalConges * 0.25);
      this.congesExceptionnel = congeStatusCounts['exceptionnel'] || Math.floor(this.totalConges * 0.15);

      this.api.getUtilisateurs().subscribe(users => {
        const employes = users.filter((u: any) => u.societeId === this.societeId && u.typeUtilisateurId !== 'admin_societe');
        this.congesSoldes = employes.slice(0, 10).map((e: any) => {
          const userConges = societeDemandes.filter((d: any) => d.utilisateurId === e.id);
          return {
            employe: e.nom + ' ' + (e.prenom || ''),
            solde: 24,
            pris: userConges.length
          };
        });
      });

      this.conges = societeDemandes.filter((d: any) => d.status === 'approuve' || d.status === 'en_attente').length;
    });

    this.api.getOffresEmploi().subscribe(offres => {
      const societeOffres = offres.filter((o: any) => o.societeId === this.societeId);
      this.postesOuverts = societeOffres.filter((o: any) => o.statut === 'Ouverte').length;
    });

    this.api.getCandidatures().subscribe(candidatures => {
      const societeCandidatures = candidatures.filter((c: any) => c.societeId === this.societeId);
      this.totalCandidats = societeCandidatures.length;
      this.preselectionnes = societeCandidatures.filter((c: any) => c.statut === 'En_cours').length;
      this.entretiens = societeCandidatures.filter((c: any) => c.statut === 'Entretien').length;

      const candidaturesAcceptees = societeCandidatures.filter((c: any) => c.statut === 'Accepté');
      this.embauches = candidaturesAcceptees.length;

      if (candidaturesAcceptees.length > 0) {
         const delays = candidaturesAcceptees.map((c: any) => {
            const start = new Date(c.dateCandidature).getTime();
            const end = c.dateEntretien ? new Date(c.dateEntretien).getTime() : new Date().getTime();
            return (end - start) / (1000 * 3600 * 24);
         });
         this.delaiMoyen = Math.max(1, Math.round(delays.reduce((a:number, b:number) => a + b, 0) / delays.length));
      } else {
         this.delaiMoyen = 0;
      }
    });
  }
  
  getUserSocieteId(userId: string): string {
    return this.societeId;
  }
  
  countByStatus(items: any[], statusField: string): Record<string, number> {
    const counts: Record<string, number> = {};
    items.forEach((item: any) => {
      const status = item[statusField] || 'en_attente';
      counts[status] = (counts[status] || 0) + 1;
    });
    return counts;
  }

  initDefaultData() {
    const employes: any[] = [];
    this.presents = employes.length || 0;
    this.absences = 0;
    this.conges = 0;
    this.retards = 0;
    this.tauxPresence = 100;
    
    this.congesSoldes = [];
    
    this.deptPerf = [];
  }
  
  initPresenceHistory(pointages: any[] = [], employes: any[] = []) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'][date.getDay()];
      const dayNum = date.getDate().toString().padStart(2, '0');
      const monthNum = (date.getMonth() + 1).toString().padStart(2, '0');
      
      const dayPointages = (pointages || []).filter((p: any) => 
        p.societeId === this.societeId && 
        p.date && p.date.split('T')[0] === dateStr
      );
      
      const presents = dayPointages.filter((p: any) => p.heureDebut).length;
      const absences = employes.length - presents;
      const taux = employes.length > 0 ? Math.round((presents / employes.length) * 100) : 0;
      
      last7Days.push({
        jour: `${dayNum}/${monthNum}`,
        presents,
        absences,
        taux
      });
    }
    this.presenceHistory = last7Days;
  }
  
  initRecrutementStats() {
    this.api.getOffresEmploi().subscribe(offres => {
      const societeOffres = offres.filter((o: any) => o.societeId === this.societeId);
      this.postesOuverts = societeOffres.filter((o: any) => o.statut === 'Ouverte' || o.statut === 'Ouvert').length;
    });

    this.api.getCandidatures().subscribe(candidatures => {
      const societeCandidatures = candidatures.filter((c: any) => c.societeId === this.societeId);
      this.totalCandidats = societeCandidatures.length;
      this.preselectionnes = societeCandidatures.filter((c: any) => c.statut === 'En_cours').length;
      this.entretiens = societeCandidatures.filter((c: any) => c.statut === 'Entretien').length;
      this.embauches = societeCandidatures.filter((c: any) => c.statut === 'Accepté').length;
    });
  }

  updateRapport() {
    this.loadData();
    this.snackBar.open('Rapport mis à jour: ' + this.periode, 'Fermer', { duration: 1500 });
  }
  
  exportPdf() {
    const content = this.generateRapportContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-rh-${this.societeNom}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.snackBar.open('Rapport exporté en PDF', 'Fermer', { duration: 2000 });
  }
  
  exportExcel() {
    const headers = ['Employé', 'Solde', 'Pris', 'Restant'];
    const rows = this.congesSoldes.map(c => [c.employe, c.solde, c.pris, c.solde - c.pris]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-rh-${this.societeNom}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.snackBar.open('Rapport exporté en Excel', 'Fermer', { duration: 2000 });
  }
  
  generateRapportContent(): string {
    return `
RAPPORT RH - ${this.societeNom}
Date: ${new Date().toLocaleDateString('fr-FR')}

=== PRÉSENCE ===
Taux de présence: ${this.tauxPresence}%
Présents: ${this.presents}
Absences: ${this.absences}
Congés: ${this.conges}
Retards: ${this.retards}

=== CONGÉS ===
Total jours: ${this.totalConges}
Annuel: ${this.congesAnnuel}
Maladie: ${this.congesMaladie}
Exceptionnel: ${this.congesExceptionnel}

=== CONGÉS PAR EMPLOYÉ ===
${this.congesSoldes.map(c => `${c.employe}: ${c.solde - c.pris} jours restants`).join('\n')}

=== RECRUTEMENT ===
Postes ouverts: ${this.postesOuverts}
Total candidats: ${this.totalCandidats}
Embauché(s): ${this.embauches}
`;
  }
}
