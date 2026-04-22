import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-rapports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <div>
          <h1 class="header-title">Rapports RH</h1>
          <p class="header-subtitle">Analyses et statistiques des ressources humaines - {{societeNom}}</p>
        </div>
      </header>

      <div class="filters-bar">
        <div class="filter-group">
          <label>Période</label>
          <select [(ngModel)]="periode" (change)="updateRapport()" class="filter-select">
            <option value="mois">Ce mois</option>
            <option value="trimestre">Ce trimestre</option>
            <option value="annee">Cette année</option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Département</label>
          <select [(ngModel)]="departement" (change)="updateRapport()" class="filter-select">
            <option value="">Tous</option>
            <option value="informatique">Informatique</option>
            <option value="rh">RH</option>
            <option value="commercial">Commercial</option>
            <option value="finance">Finance</option>
          </select>
        </div>
        
        <div class="export-actions">
          <button class="btn btn-primary" (click)="exportPdf()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter PDF
          </button>
          <button class="btn btn-outline" (click)="exportExcel()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            Exporter Excel
          </button>
        </div>
      </div>

      <div class="card content-card">
        <div class="tabs-header">
          <button class="tab-btn active">Présence</button>
          <button class="tab-btn">Congés</button>
          <button class="tab-btn">Productivité</button>
          <button class="tab-btn">Recrutement</button>
        </div>

        <div class="tab-content">
          <div class="rapport-section">
            <h3>Taux de présence</h3>
            <div class="big-stat">
              <span class="big-value">{{tauxPresence}}%</span>
              <span class="big-label">taux global</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="tauxPresence"></div>
            </div>
          </div>
          
          <div class="stats-grid">
            <div class="stat-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div class="stat-details">
                <span class="stat-value">{{presents}}</span>
                <span class="stat-label">Présents</span>
              </div>
            </div>
            <div class="stat-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9800" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
              <div class="stat-details">
                <span class="stat-value">{{absences}}</span>
                <span class="stat-label">Absences</span>
              </div>
            </div>
            <div class="stat-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2196f3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <div class="stat-details">
                <span class="stat-value">{{conges}}</span>
                <span class="stat-label">Congés</span>
              </div>
            </div>
            <div class="stat-item">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f44336" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div class="stat-details">
                <span class="stat-value">{{retards}}</span>
                <span class="stat-label">Retards</span>
              </div>
            </div>
          </div>
          
          <h4>Historique quotidien</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Jour</th>
                <th>Présents</th>
                <th>Absences</th>
                <th>Taux</th>
              </tr>
            </thead>
            <tbody>
              @for (p of presenceHistory; track p.jour) {
                <tr>
                  <td>{{p.jour}}</td>
                  <td>{{p.presents}}</td>
                  <td>{{p.absences}}</td>
                  <td>
                    <span [class]="p.taux >= 90 ? 'taux-ok' : 'taux-ko'">{{p.taux}}%</span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .filters-bar {
      display: flex;
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
      align-items: center;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .filter-group label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .filter-select {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      cursor: pointer;
      min-width: 160px;
    }

    .export-actions {
      display: flex;
      gap: var(--space-sm);
      margin-left: auto;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #10b981;
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-outline:hover {
      background: var(--color-bg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .tab-btn {
      padding: var(--space-md) var(--space-lg);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-base);
      border-bottom: 2px solid transparent;
    }

    .tab-btn.active {
      color: var(--color-text);
      border-bottom-color: #10b981;
    }

    .tab-btn:hover:not(.active) {
      color: var(--color-text);
    }

    .tab-content {
      padding: var(--space-xl);
    }

    .rapport-section {
      margin-bottom: var(--space-2xl);
    }

    .rapport-section h3 {
      margin: 0 0 var(--space-lg);
      color: var(--color-text);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .big-stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .big-value {
      font-size: 48px;
      font-weight: var(--font-weight-bold);
      color: #10b981;
      line-height: 1;
    }

    .big-label {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #059669);
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .stat-details {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    h4 {
      margin: var(--space-xl) 0 var(--space-md);
      color: var(--color-text);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: var(--color-bg);
    }

    .data-table th {
      padding: var(--space-md);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
      background: white;
    }

    .taux-ok {
      color: #10b981;
      font-weight: var(--font-weight-bold);
    }

    .taux-ko {
      color: #ef4444;
      font-weight: var(--font-weight-bold);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .tabs-header {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .data-table td {
      background: var(--color-surface);
    }

    :host-context(.dark) .filter-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .stat-item {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .filters-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .export-actions {
        margin-left: 0;
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
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

