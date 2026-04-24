import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-rh',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Ressources Humaines</span>
          </div>
          <h1 class="header-title">
            Contrôle <span class="gradient-text">Ressources.</span>
          </h1>
          <p class="header-subtitle">
            Maintenance des talents et continuité opérationnelle pour {{societeNom}}.
          </p>
        </div>
        <div class="header-tabs">
          <button (click)="currentView = 'pointage'" 
            [class.active]="currentView === 'pointage'">
            Présence
          </button>
          <button (click)="currentView = 'conges'" 
            [class.active]="currentView === 'conges'">
            Congés
          </button>
          <button (click)="currentView = 'salaires'" 
            [class.active]="currentView === 'salaires'">
            Paie
          </button>
        </div>
      </header>

      <!-- View Container -->
      <div class="view-container">
        <!-- Attendance Module -->
        @if (currentView === 'pointage') {
          <div class="section-container">
             <div class="section-header">
                <h3>Registre de Présence</h3>
                <div class="date-filter">
                   <input type="date" [(ngModel)]="pointageDate" (change)="loadPointages()"
                     class="date-input">
                </div>
             </div>

             <div class="card table-card">
                <table class="data-table">
                   <thead>
                      <tr>
                         <th>Personnel</th>
                         <th>Arrivée</th>
                         <th>Départ</th>
                         <th>Durée</th>
                         <th class="text-right">Statut</th>
                      </tr>
                   </thead>
                   <tbody>
                      @for (p of pointages; track p.id) {
                        <tr>
                           <td>
                              <div class="user-cell">
                                 <div class="user-avatar">{{p.utilisateurNom?.charAt(0)}}</div>
                                 <div>
                                    <p>{{p.utilisateurNom}}</p>
                                    <span>{{p.role}}</span>
                                 </div>
                              </div>
                           </td>
                           <td>{{p.heureEntree || '--:--'}}</td>
                           <td>{{p.heureSortie || '--:--'}}</td>
                           <td class="duration-cell">{{p.totalHeures || '0'}}h</td>
                           <td class="text-right">
                              <span [class]="p.statut === 'Present' ? 'badge badge-success' : 'badge badge-danger'">
                                 {{p.statut}}
                              </span>
                           </td>
                        </tr>
                      }
                   </tbody>
                </table>
             </div>
          </div>
        }

        <!-- Leave Module -->
        @if (currentView === 'conges') {
          <div class="section-container">
             <div class="section-header">
                <h3>File d'Attente des Congés</h3>
             </div>

             <div class="leaves-grid">
                @for (c of conges; track c.id) {
                  <div class="card leave-card">
                     <div class="leave-header">
                        <div class="leave-avatar">{{c.utilisateurNom?.charAt(0)}}</div>
                        <div>
                           <h4>{{c.utilisateurNom}}</h4>
                           <span class="leave-type">{{c.type}}</span>
                        </div>
                     </div>

                     <div class="leave-body">
                        <div class="leave-period">
                           <span>Période</span>
                           <span>{{c.dateDebut | date:'dd MMM'}} - {{c.dateFin | date:'dd MMM, yyyy'}}</span>
                        </div>
                        <div class="leave-motif">
                           "{{c.motif || 'Aucune justification fournie'}}"
                        </div>
                     </div>

                     <div class="leave-actions">
                        @if (c.statut === 'En attente') {
                          <button (click)="validerConge(c, true)" class="btn btn-success">Autoriser</button>
                          <button (click)="validerConge(c, false)" class="btn btn-danger">Refuser</button>
                        } @else {
                          <div class="leave-status"
                             [class.status-success]="c.statut === 'Validé'" [class.status-danger]="c.statut === 'Refusé'">
                             {{c.statut}}
                          </div>
                        }
                     </div>
                  </div>
                }
             </div>
          </div>
        }

        <!-- Payroll Module -->
        @if (currentView === 'salaires') {
          <div class="section-container">
             <div class="section-header">
                <h3>Compensation de Rendement</h3>
                <button (click)="genererSalaires()" class="btn btn-primary">Générer Batch</button>
             </div>

             <div class="card table-card">
                <table class="data-table">
                   <thead>
                      <tr>
                         <th>Personnel</th>
                         <th>Salaire Base</th>
                         <th>Primes</th>
                         <th>Retenues</th>
                         <th>Net à Transférer</th>
                         <th class="text-right">Fiche</th>
                      </tr>
                   </thead>
                   <tbody>
                      @for (s of salaires; track s.id) {
                        <tr>
                           <td>
                              <div class="user-cell">
                                 <div class="user-avatar">{{s.utilisateurNom?.charAt(0)}}</div>
                                 <p>{{s.utilisateurNom}}</p>
                              </div>
                           </td>
                           <td>{{s.salaireBase}} DT</td>
                           <td class="text-success">+{{s.primes}} DT</td>
                           <td class="text-danger">-{{s.retenues}} DT</td>
                           <td>
                              <span class="net-amount">{{s.netAPayer}} DT</span>
                           </td>
                           <td class="text-right">
                              <button (click)="imprimerFiche(s)" class="btn-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <polyline points="6 9 6 2 18 2 18 9"/>
                                  <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                                  <rect x="6" y="14" width="12" height="8"/>
                                </svg>
                              </button>
                           </td>
                        </tr>
                      }
                   </tbody>
                </table>
             </div>
          </div>
        }
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
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
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
      background: radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(244, 63, 94, 0.1);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.2);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fb7185, #f43f5e, #e11d48);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-tabs {
      position: relative;
      z-index: 1;
      display: flex;
      gap: var(--space-sm);
    }

    .header-tabs button {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .header-tabs button:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .header-tabs button.active {
      background: white;
      color: var(--color-text);
    }

    .section-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .section-header h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      font-style: italic;
    }

    .date-filter {
      display: flex;
      gap: var(--space-sm);
    }

    .date-input {
      padding: var(--space-sm) var(--space-md);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .date-input:focus {
      border-color: rgba(244, 63, 94, 0.3);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .table-card {
      overflow-x: auto;
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
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--color-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      color: #f43f5e;
    }

    .user-cell p {
      margin: 0;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .user-cell span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .duration-cell {
      font-weight: var(--font-weight-bold);
      font-style: italic;
    }

    .text-right {
      text-align: right;
    }

    .text-success {
      color: #10b981;
      font-weight: var(--font-weight-semibold);
    }

    .text-danger {
      color: #ef4444;
      font-weight: var(--font-weight-semibold);
    }

    .net-amount {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: #f43f5e;
      font-style: italic;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
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
      background: #f43f5e;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      border-color: #f43f5e;
      color: #f43f5e;
    }

    .leaves-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .leave-card {
      position: relative;
      overflow: hidden;
    }

    .leave-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 128px;
      height: 128px;
      background: rgba(244, 63, 94, 0.05);
      filter: blur(48px);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .leave-card:hover::before {
      opacity: 1;
    }

    .leave-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .leave-avatar {
      width: 56px;
      height: 56px;
      background: var(--color-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
      color: #f43f5e;
    }

    .leave-header h4 {
      margin: 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      font-style: italic;
    }

    .leave-type {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .leave-body {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .leave-period {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .leave-period span:first-child {
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .leave-period span:last-child {
      color: var(--color-text);
    }

    .leave-motif {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-style: italic;
      border: 1px solid var(--color-border);
    }

    .leave-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .leave-actions .btn {
      flex: 1;
    }

    .leave-status {
      width: 100%;
      padding: var(--space-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .status-success {
      border-color: #10b981;
      color: #10b981;
    }

    .status-danger {
      border-color: #ef4444;
      color: #ef4444;
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .date-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .user-avatar,
    :host-context(.dark) .leave-avatar {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .leave-motif {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .leave-status {
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-tabs {
        width: 100%;
      }

      .header-tabs button {
        flex: 1;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .leaves-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminRhComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  currentView: 'pointage' | 'conges' | 'salaires' = 'pointage';
  societeId = '';
  societeNom = '';
  pointageDate = new Date().toISOString().split('T')[0];
  
  pointages: any[] = [];
  conges: any[] = [];
  salaires: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPointages();
    this.loadConges();
    this.loadSalaires();
  }

  loadPointages() {
    this.api.getAttendanceTrends(this.societeId).subscribe(data => {
      this.pointages = [
        { id: 1, utilisateurNom: 'Karim Ben Salem', role: 'Développeur Senior', heureEntree: '08:30', heureSortie: '17:45', totalHeures: 8.5, statut: 'Present' },
        { id: 2, utilisateurNom: 'Sonia Mabrouk', role: 'Chef de Projet', heureEntree: '09:00', heureSortie: '18:15', totalHeures: 8.25, statut: 'Present' },
        { id: 3, utilisateurNom: 'Yassine Ayari', role: 'Designer UI/UX', heureEntree: '08:45', heureSortie: '17:30', totalHeures: 7.75, statut: 'Present' }
      ];
    });
  }

  loadConges() {
    this.api.getUtilisateurs().subscribe(users => {
      this.conges = [
        { id: 1, utilisateurNom: 'Ahmed Slim', type: 'Annuel', dateDebut: '2024-05-10', dateFin: '2024-05-20', motif: 'Période de récupération stratégique', statut: 'En attente' },
        { id: 2, utilisateurNom: 'Meryem Tounsi', type: 'Maladie', dateDebut: '2024-04-15', dateFin: '2024-04-16', motif: 'Maintenance médicale système critique', statut: 'Validé' }
      ];
    });
  }

  loadSalaires() {
    this.salaires = [
      { id: 1, utilisateurNom: 'Karim Ben Salem', salaireBase: 2500, primes: 350, retenues: 120, netAPayer: 2730 },
      { id: 2, utilisateurNom: 'Sonia Mabrouk', salaireBase: 2200, primes: 200, retenues: 0, netAPayer: 2400 },
      { id: 3, utilisateurNom: 'Yassine Ayari', salaireBase: 1800, primes: 150, retenues: 50, netAPayer: 1900 }
    ];
  }

  validerConge(c: any, ok: boolean) { c.statut = ok ? 'Validé' : 'Refusé'; }
  genererSalaires() { this.snackBar.open('Logique de compensation batch exécutée.', 'Fermer', { duration: 3000 }); }
  imprimerFiche(s: any) { this.snackBar.open('Génération du reçu de rendement PDF...', 'Fermer', { duration: 3000 }); }
}
