import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { FormStateService } from '@core/services/form-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-rh',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="module-bg bg-module-rh">
      <div class="content-wrapper dashboard-container">
        <!-- Header -->
        <header class="dashboard-header glass-card">
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
            <button (click)="setView('pointage')" 
              [class.active]="currentView === 'pointage'">
              Présence
            </button>
            <button (click)="setView('conges')" 
              [class.active]="currentView === 'conges'">
              Congés
            </button>
            <button (click)="setView('salaires')" 
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
                     <input type="date" [(ngModel)]="pointageDate" (change)="onDateChange()"
                       class="date-input" [max]="today">
                  </div>
               </div>

               <div class="card table-card glass-card">
                  <table class="data-table">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>UtilisateurId</th>
                           <th>HeureEntree</th>
                           <th>HeureSortie</th>
                           <th>Duree</th>
                           <th class="text-right">Statut</th>
                        </tr>
                     </thead>
                     <tbody>
                        @for (p of paginatedPointages; track p.id) {
                          <tr>
                             <td><small>{{p.id}}</small></td>
                             <td>
                                <div class="user-cell">
                                   <div class="user-avatar">{{p.utilisateurNom?.charAt(0)}}</div>
                                   <div>
                                      <p>{{p.utilisateurNom || p.utilisateurId}}</p>
                                      <span>{{p.utilisateurId}}</span>
                                   </div>
                                </div>
                             </td>
                             <td>{{p.heureEntree || '--:--'}}</td>
                             <td>{{p.heureSortie || '--:--'}}</td>
                             <td class="duration-cell">{{p.totalHeures || p.duree || '0'}}h</td>
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
               @if (pointages.length > pageSize) {
                 <div class="pagination-mini">
                   <button class="btn-p" [disabled]="page === 1" (click)="page = page - 1">&lt;</button>
                   <span>Page {{page}} / {{totalPagesPointages}}</span>
                   <button class="btn-p" [disabled]="page === totalPagesPointages" (click)="page = page + 1">&gt;</button>
                 </div>
               }
            </div>
          }

          <!-- Leave Module -->
          @if (currentView === 'conges') {
            <div class="section-container">
               <div class="section-header">
                  <h3>File d'Attente des Congés</h3>
               </div>

               <div class="card table-card glass-card">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Id</th>
                        <th>UtilisateurId</th>
                        <th>TypePointageId</th>
                        <th>DateDebut</th>
                        <th>DateFin</th>
                        <th>Status</th>
                        <th>Motif</th>
                        <th class="text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (c of paginatedConges; track c.id) {
                        <tr>
                          <td><small>{{c.id}}</small></td>
                          <td>
                            <div class="user-cell">
                              <div class="user-avatar">{{c.utilisateurNom?.charAt(0)}}</div>
                              <div>
                                 <p>{{c.utilisateurNom || c.utilisateurId}}</p>
                                 <span>{{c.utilisateurId}}</span>
                              </div>
                            </div>
                          </td>
                          <td><span class="leave-type">{{c.typePointageId || c.type}}</span></td>
                          <td>{{c.dateDebut | date:'dd/MM/yyyy'}}</td>
                          <td>{{c.dateFin | date:'dd/MM/yyyy'}}</td>
                          <td>
                             <span [class]="'status-text ' + (c.statut === 'Validé' || c.status === 'Validé' ? 'text-success' : (c.statut === 'Refusé' || c.status === 'Refusé' ? 'text-danger' : ''))">
                               {{c.status || c.statut}}
                             </span>
                          </td>
                          <td><div class="leave-motif-mini" [title]="c.motif">{{c.motif || '...'}}</div></td>
                          <td class="text-right">
                            <div class="leave-actions-mini">
                              @if (c.statut === 'En attente') {
                                <button (click)="validerConge(c, true)" class="btn-icon btn-s" title="Autoriser">✓</button>
                                <button (click)="validerConge(c, false)" class="btn-icon btn-d" title="Refuser">✕</button>
                              } @else {
                                <span [class]="'status-text ' + (c.statut === 'Validé' ? 'text-success' : 'text-danger')">
                                  {{c.statut}}
                                </span>
                              }
                            </div>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
               </div>
               @if (conges.length > pageSize) {
                 <div class="pagination-mini">
                   <button class="btn-p" [disabled]="page === 1" (click)="page = page - 1">&lt;</button>
                   <span>Page {{page}} / {{totalPagesConges}}</span>
                   <button class="btn-p" [disabled]="page === totalPagesConges" (click)="page = page + 1">&gt;</button>
                 </div>
               }
            </div>
          }

          <!-- Payroll Module -->
          @if (currentView === 'salaires') {
            <div class="section-container">
               <div class="section-header">
                  <h3>Compensation de Rendement</h3>
                  <button (click)="genererSalaires()" class="btn btn-primary">Générer Batch</button>
               </div>

               <div class="card table-card glass-card">
                  <table class="data-table">
                     <thead>
                        <tr>
                           <th>Id</th>
                           <th>UtilisateurId</th>
                           <th>SalaireBase</th>
                           <th>Primes</th>
                           <th>Retenues</th>
                           <th>NetAPayer</th>
                           <th class="text-right">Fiche</th>
                        </tr>
                     </thead>
                     <tbody>
                        @for (s of paginatedSalaires; track s.id) {
                          <tr>
                             <td><small>{{s.id}}</small></td>
                             <td>
                                <div class="user-cell">
                                   <div class="user-avatar">{{s.utilisateurNom?.charAt(0)}}</div>
                                   <div>
                                      <p>{{s.utilisateurNom || s.utilisateurId}}</p>
                                      <span>{{s.utilisateurId}}</span>
                                   </div>
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
               @if (salaires.length > pageSize) {
                 <div class="pagination-mini">
                   <button class="btn-p" [disabled]="page === 1" (click)="page = page - 1">&lt;</button>
                   <span>Page {{page}} / {{totalPagesSalaires}}</span>
                   <button class="btn-p" [disabled]="page === totalPagesSalaires" (click)="page = page + 1">&gt;</button>
                 </div>
               }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding: var(--space-2xl);
      padding-bottom: var(--space-2xl);
      background: transparent;
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

    .leave-motif-mini { max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 11px; opacity: 0.7; }
    .leave-actions-mini { display: flex; gap: 4px; justify-content: flex-end; }
    .btn-s { background: #10b981; color: white; border: none; }
    .btn-d { background: #ef4444; color: white; border: none; }
    .status-text { font-size: 11px; font-weight: 700; text-transform: uppercase; }

    .pagination-mini { display: flex; justify-content: center; align-items: center; gap: 1rem; padding: 1rem; font-size: 12px; font-weight: 700; color: #64748b; }
    .btn-p { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; transition: all 0.2s; }
    .btn-p:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; }
    .btn-p:disabled { opacity: 0.5; cursor: not-allowed; }

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
  private formState = inject(FormStateService);
  
  currentView: 'pointage' | 'conges' | 'salaires' = 'pointage';
  societeId = '';
  societeNom = '';
  pointageDate = new Date().toISOString().split('T')[0];
  today = new Date().toISOString().split('T')[0];

  private readonly STATE_KEY = 'admin_rh_state';
  
  pointages: any[] = [];
  conges: any[] = [];
  salaires: any[] = [];

  // Pagination
  page = 1;
  pageSize = 5;

  get totalPagesPointages(): number { return Math.ceil(this.pointages.length / this.pageSize) || 1; }
  get paginatedPointages() { return this.pointages.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }

  get totalPagesConges(): number { return Math.ceil(this.conges.length / this.pageSize) || 1; }
  get paginatedConges() { return this.conges.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }

  get totalPagesSalaires(): number { return Math.ceil(this.salaires.length / this.pageSize) || 1; }
  get paginatedSalaires() { return this.salaires.slice((this.page - 1) * this.pageSize, this.page * this.pageSize); }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    
    // Robust societeNom initialization
    const rawNom = user?.societe?.nom || user?.SocieteNom || 'Votre société';
    this.societeNom = (typeof rawNom === 'string') ? rawNom.replace(/undefined/g, '').trim() : 'Votre société';
    if (!this.societeNom) this.societeNom = 'Votre société';

    this.restoreState();
    this.loadPointages();
    this.loadConges();
    this.loadSalaires();
  }

  private restoreState() {
    const state = this.formState.getDraft(this.STATE_KEY);
    if (state) {
      if (state.currentView) this.currentView = state.currentView;
      if (state.pointageDate) this.pointageDate = state.pointageDate;
    }
  }

  setView(view: 'pointage' | 'conges' | 'salaires') {
    this.currentView = view;
    this.saveState();
  }

  onDateChange() {
    this.saveState();
    this.loadPointages();
  }

  private saveState() {
    this.formState.saveDraft(this.STATE_KEY, {
      currentView: this.currentView,
      pointageDate: this.pointageDate
    });
  }

  loadPointages() {
    // Charger les pointages réels des employés de la société
    this.api.getEmployesBySociete(this.societeId).subscribe(employes => {
      const staffOnly = employes.filter((e: any) => (e.typeUtilisateurId || '').toUpperCase() !== 'T008');
      const employeMap = new Map(staffOnly.map((e: any) => [e.id || e.Id, e.nom || e.Nom || 'Employé']));
      this.api.getPointages().subscribe({
        next: (pts: any[]) => {
          const list = Array.isArray(pts) ? pts : (pts as any)?.value || [];
          // Filtrer les pointages pour la date sélectionnée et les employés de la société
          this.pointages = list
            .filter((p: any) => {
              const uid = p.utilisateurId || p.UtilisateurId;
              const pDate = (p.date || p.Date || '').toString().split('T')[0];
              return employeMap.has(uid) && (!this.pointageDate || pDate === this.pointageDate);
            })
            .map((p: any) => {
              const uid = p.utilisateurId || p.UtilisateurId;
              return {
                id: p.id || p.Id,
                utilisateurId: uid,
                utilisateurNom: employeMap.get(uid) || uid,
                heureEntree: p.heureEntree || p.HeureEntree || '--:--',
                heureSortie: p.heureSortie || p.HeureSortie || '--:--',
                duree: p.duree || p.Duree || p.totalHeures || '0',
                statut: p.heureSortie || p.HeureSortie ? 'Present' : 'En cours'
              };
            });
        },
        error: () => { this.pointages = []; }
      });
    });
  }

  loadConges() {
    // Charger les demandes de congé réelles des employés de la société
    this.api.getDemandesEnAttenteReal(this.societeId).subscribe({
      next: (conges: any[]) => {
        this.conges = conges.map((c: any) => ({
          id: c.id || c.Id,
          utilisateurId: c.utilisateurId || c.UtilisateurId,
          utilisateurNom: c.utilisateurNom || c.utilisateurId || 'Employé',
          typePointageId: c.typePointageId || c.TypePointageId || 'Annuel',
          dateDebut: c.dateDebut || c.DateDebut,
          dateFin: c.dateFin || c.DateFin,
          motif: c.motif || c.Motif || '',
          statut: c.statut || c.Status || 'En attente',
          status: c.status || c.Status || c.statut || 'En attente'
        }));
      },
      error: () => { this.conges = []; }
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
