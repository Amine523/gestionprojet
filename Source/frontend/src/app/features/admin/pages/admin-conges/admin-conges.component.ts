import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';

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
  selector: 'app-admin-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Administration</span>
          </div>
          <h1 class="header-title">
            Contrôle des <span class="gradient-text">Congés.</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • Supervision globale des absences et validation des demandes collaborateurs.
          </p>
        </div>
        <div class="header-actions">
           <div class="header-badge" [class.urgent]="enAttenteCount() > 0">
              @if (enAttenteCount() > 0) {
                <span class="pulse-dot"></span>
              }
              {{enAttenteCount()}} en attente
           </div>
           <button class="btn btn-secondary" (click)="loadData()">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
               <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
               <path d="M3 3v5h5"/>
               <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
               <path d="M16 21h5v-5"/>
             </svg>
             Actualiser
           </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-info">
             <div class="stat-value">{{statsSignal().totalEmployes}}</div>
             <div class="stat-label">Collaborateurs</div>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-info">
             <div class="stat-value">{{statsSignal().congesValidesCeMois}}</div>
             <div class="stat-label">Approuvés (Mois)</div>
          </div>
        </div>
        <div class="card stat-card pulse-card" *ngIf="enAttenteCount() > 0">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
             <div class="stat-value">{{enAttenteCount()}}</div>
             <div class="stat-label">À Valider</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="card main-content">
        <div class="content-header">
            <div class="header-left">
              <h3>Registre Central des Absences</h3>
              <div class="filter-tabs">
                <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'">Tous</button>
                <button class="tab-btn" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">
                  En attente
                  <span class="count-badge" *ngIf="enAttenteCount() > 0">{{enAttenteCount()}}</span>
                </button>
                <button class="tab-btn" [class.active]="activeTab === 'approved'" (click)="activeTab = 'approved'">Validés</button>
              </div>
            </div>
            <div class="table-actions">
               <button class="btn-icon" title="Filtrer">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                 </svg>
               </button>
               <button class="btn-icon" title="Exporter Excel">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                   <polyline points="7 10 12 15 17 10"/>
                   <line x1="12" y1="15" x2="12" y2="3"/>
                 </svg>
               </button>
            </div>
        </div>

        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Type</th>
                <th>Période</th>
                <th>Motif</th>
                <th>État</th>
                <th>Décision</th>
              </tr>
            </thead>
            <tbody>
              @for (c of filteredConges(); track c.id) {
                <tr>
                  <td>
                     <div class="emp-cell">
                        <div class="user-avatar" [style.background]="'hsl('+((c.utilisateurNom.length || 0) * 40)+', 60%, 55%)'">{{c.utilisateurNom.charAt(0)}}</div>
                        <span class="emp-name">{{c.utilisateurNom}}</span>
                     </div>
                  </td>
                  <td>
                     <span class="type-pill" [class.type-maladie]="c.typeNom === 'Maladie'">{{c.typeNom}}</span>
                  </td>
                  <td class="date-range">
                     <div class="date-display">
                       <span>{{c.dateDebut | date:'dd MMM'}}</span>
                       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                         <polyline points="9 18 15 12 9 6"/>
                       </svg>
                       <span>{{c.dateFin | date:'dd MMM'}}</span>
                     </div>
                     <span class="day-count">{{c.nombreJours}}j</span>
                  </td>
                  <td class="motif-cell" [title]="c.motif">{{c.motif || 'Non spécifié'}}</td>
                  <td>
                    <span class="status-chip" [class]="'status-'+(c.status ? c.status.toLowerCase().replace(' ', '-') : 'pending')">
                      <span class="dot"></span>
                      {{c.status}}
                    </span>
                  </td>
                  <td>
                    <div class="action-group">
                      @if (c.status === 'En attente') {
                        <button class="btn-icon btn-check" (click)="validerConge(c, true)" title="Approuver">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        </button>
                        <button class="btn-icon btn-cancel" (click)="validerConge(c, false)" title="Refuser">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      } @else {
                        <button class="btn-icon" (click)="voirDetail(c)" title="Détails">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="12" y1="16" x2="12" y2="12"/>
                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                          </svg>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (filteredConges().length === 0) {
            <div class="empty-state">
               <div class="empty-icon">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                   <path d="M9 12l2 2 4-4"/>
                   <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5"/>
                 </svg>
               </div>
               <h3>Aucun enregistrement</h3>
               <p>Le registre est vide pour ce filtre.</p>
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
      padding: var(--space-lg);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
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

    .header-actions {
      position: relative;
      z-index: 1;
      display: flex;
      gap: var(--space-sm);
      align-items: center;
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      background: white;
      border: 1px solid var(--color-border);
    }

    .header-badge.urgent {
      border-color: #fbbf24;
      background: #fef3c7;
      color: #b45309;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      box-shadow: 0 0 0 rgba(245, 158, 11, 0.4);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.7); }
      70% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
      100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
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

    .btn-secondary {
      background: white;
      color: var(--color-text);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .btn-secondary:hover {
      background: var(--color-bg);
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      border-color: rgba(244, 63, 94, 0.3);
      color: #f43f5e;
    }

    .btn-check { color: #059669; background: #ecfdf5; }
    .btn-check:hover { background: #059669; color: white; transform: scale(1.1); }
    
    .btn-cancel { color: #dc2626; background: #fef2f2; }
    .btn-cancel:hover { background: #dc2626; color: white; transform: scale(1.1); }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-lg);
      transition: transform var(--transition-base);
    }

    .stat-card:hover { transform: translateY(-4px); }

    .stat-icon {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.indigo { background: #eef2ff; color: #4f46e5; }
    .stat-icon.emerald { background: #ecfdf5; color: #10b981; }
    .stat-icon.amber { background: #fffbeb; color: #f59e0b; }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      margin-top: var(--space-xs);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .pulse-card { animation: pulse-border 2s infinite; }

    @keyframes pulse-border {
      0%, 100% { box-shadow: var(--shadow-sm); }
      50% { box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.2); }
    }

    .main-content { padding: 0; overflow: hidden; }

    .content-header {
      padding: var(--space-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
      background: white;
    }

    .header-left { display: flex; align-items: center; gap: var(--space-xl); }

    .content-header h3 { margin: 0; font-size: var(--font-size-lg); font-weight: var(--font-weight-bold); color: var(--color-text); }

    .filter-tabs {
      display: flex;
      background: var(--color-bg);
      padding: 4px;
      border-radius: var(--radius-lg);
      gap: 4px;
    }

    .tab-btn {
      padding: 8px 16px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tab-btn.active { background: white; color: #f43f5e; box-shadow: var(--shadow-sm); }

    .count-badge { background: #f43f5e; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px; }

    .table-actions { display: flex; gap: var(--space-xs); }

    .table-container { background: white; overflow-x: auto; }

    .data-table { width: 100%; border-collapse: collapse; }

    .data-table thead { background: var(--color-bg); }

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

    .data-table td { padding: var(--space-md); border-bottom: 1px solid var(--color-border); }

    .emp-cell { display: flex; align-items: center; gap: var(--space-md); }

    .user-avatar {
      width: 36px; height: 36px; border-radius: var(--radius-md); color: white;
      display: flex; align-items: center; justify-content: center;
      font-size: var(--font-size-sm); font-weight: var(--font-weight-bold);
      box-shadow: var(--shadow-sm);
    }

    .emp-name { font-weight: var(--font-weight-semibold); color: var(--color-text); }

    .type-pill { background: var(--color-bg); padding: 4px 10px; border-radius: var(--radius-md); font-size: var(--font-size-xs); font-weight: var(--font-weight-semibold); color: var(--color-text); }

    .type-maladie { background: #fef2f2; color: #ef4444; }

    .date-range { display: flex; flex-direction: column; gap: 4px; }

    .date-display { display: flex; align-items: center; gap: 8px; font-weight: var(--font-weight-semibold); color: var(--color-text); font-size: 13px; }

    .day-count { font-weight: var(--font-weight-bold); color: #f43f5e; font-size: var(--font-size-xs); background: #fff1f2; padding: 2px 8px; border-radius: var(--radius-sm); width: fit-content; }

    .motif-cell { color: var(--color-text-muted); font-style: italic; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; }

    .status-chip { display: inline-flex; align-items: center; gap: 8px; padding: 4px 12px; border-radius: var(--radius-full); font-size: 11px; font-weight: var(--font-weight-semibold); text-transform: uppercase; }

    .status-chip .dot { width: 6px; height: 6px; border-radius: 50%; }

    .status-validée { background: #ecfdf5; color: #059669; }
    .status-validée .dot { background: #059669; box-shadow: 0 0 8px #059669; }
    
    .status-refusée { background: #fef2f2; color: #dc2626; }
    .status-refusée .dot { background: #dc2626; }
    
    .status-en-attente { background: #fffbeb; color: #d97706; }
    .status-en-attente .dot { background: #d97706; animation: blink 1.5s infinite; }

    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

    .action-group { display: flex; gap: 8px; }

    .empty-state { padding: var(--space-3xl); text-align: center; color: var(--color-text-muted); }

    .empty-icon { width: 64px; height: 64px; background: var(--color-bg); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-lg); }

    @media (max-width: 768px) { .dashboard-header { flex-direction: column; } .header-left { flex-direction: column; align-items: flex-start; gap: var(--space-md); } }
  `]
})
export class AdminCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private notificationService = inject(NotificationService);

  societeId = '';
  societeNom = '';
  currentUserId = '';
  
  congesSignal = signal<Conge[]>([]);
  statsSignal = signal({ totalEmployes: 0, congesValidesCeMois: 0, demandesCongesEnAttente: 0 });
  activeTab = 'pending';
  employesMap: { [id: string]: string } = {};

  enAttenteCount = computed(() => this.congesSignal().filter(c => c.status === 'En attente').length);

  filteredConges = computed(() => {
    const list = this.congesSignal();
    if (this.activeTab === 'pending') return list.filter(c => c.status === 'En attente');
    if (this.activeTab === 'approved') return list.filter(c => c.status === 'Validée');
    return list;
  });

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
      this.statsSignal.set(res);
    });
  }

  loadConges() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.employesMap = {};
        employes.forEach((e: any) => {
          this.employesMap[e.id || e.Id] = e.nom || e.Nom;
        });

        this.api.getDemandesCongeBySociete(this.societeId).subscribe({
          next: (data) => {
            const list = data.map((d: any) => {
              const uId = d.utilisateurId || d.UtilisateurId;
              const uNom = d.utilisateurNom || d.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              
              let jours = d.jours || d.Jours || 0;
              if (jours === 0 && d.dateDebut && d.dateFin) {
                const start = new Date(d.dateDebut);
                const end = new Date(d.dateFin);
                const diffTime = Math.abs(end.getTime() - start.getTime());
                jours = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
              }

              return {
                id: d.id || d.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                typeNom: d.typeNom || d.TypeNom || 'Congé',
                dateDebut: d.dateDebut || d.DateDebut,
                dateFin: d.dateFin || d.DateFin,
                nombreJours: jours,
                motif: d.motif || d.Motif || '',
                status: this.normalizeStatus(d.status || d.Status || 'En attente')
              };
            });
            this.congesSignal.set(list);
          },
          error: () => {
            this.snackBar.open('Erreur de chargement des demandes', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  private normalizeStatus(status: string): string {
    if (!status) return 'En attente';
    const s = status.toLowerCase().replace('_', ' ');
    if (s === 'en attente') return 'En attente';
    if (s === 'validée' || s === 'valide' || s === 'approuvé' || s === 'validé') return 'Validée';
    if (s === 'refusée' || s === 'refuse') return 'Refusée';
    return status;
  }

  validerConge(conge: Conge, approuve: boolean) {
    const status = approuve ? 'Validée' : 'Refusée';
    const typeNotif = approuve ? 'success' : 'error';

    this.api.validerDemandeCongeReal(conge.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.congesSignal.update(list => list.map(c => c.id === conge.id ? { ...c, status } : c));
        
        this.notificationService.notifyUser(
          conge.utilisateurId, 
          `Demande de congé ${status}`, 
          `Votre demande pour la période du ${new Date(conge.dateDebut).toLocaleDateString()} au ${new Date(conge.dateFin).toLocaleDateString()} a été ${status.toLowerCase()}.`,
          typeNotif
        );

        this.snackBar.open(res.message || `Demande ${status.toLowerCase()} avec succès`, 'Fermer', { duration: 3000 });
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }

  voirDetail(conge: Conge) {
    this.snackBar.open(`Détails: #${conge.id.substring(0,6)} - Motif: ${conge.motif || 'Aucun'}`, 'Fermer', { duration: 5000 });
  }
}
