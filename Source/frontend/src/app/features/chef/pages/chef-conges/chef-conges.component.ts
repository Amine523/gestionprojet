import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

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
  selector: 'app-chef-conges',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="conges-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h1 class="header-title">Gestion des Absences</h1>
            <p class="header-subtitle">Équipe {{societeNom}} • Chef de projet</p>
          </div>
        </div>
        <div class="header-actions">
          <div class="badge-count" [class.urgent]="enAttenteCount() > 0">
            <span class="pulse-dot" *ngIf="enAttenteCount() > 0"></span>
            {{enAttenteCount()}} en attente
          </div>
          <button class="btn btn-secondary" (click)="loadData()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Actualiser
          </button>
        </div>
      </header>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{stats().totalEquipe}}</div>
            <div class="stat-label">Membres Équipe</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{stats().congesValides}}</div>
            <div class="stat-label">Approuvés</div>
          </div>
        </div>
        <div class="stat-card" *ngIf="enAttenteCount() > 0">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{enAttenteCount()}}</div>
            <div class="stat-label">À traiter</div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-card">
        <div class="card-header">
          <h3>Demandes de l'Équipe</h3>
          <div class="filter-tabs">
            <button class="tab-btn" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'">Toutes</button>
            <button class="tab-btn" [class.active]="activeTab === 'pending'" (click)="activeTab = 'pending'">En attente</button>
            <button class="tab-btn" [class.active]="activeTab === 'approved'" (click)="activeTab = 'approved'">Approuvées</button>
          </div>
        </div>

        <div class="conges-list">
          @for (c of filteredConges(); track c.id) {
            <div class="conge-card" [class.status-pending]="c.status === 'En attente'" [class.status-approved]="c.status === 'Validée'" [class.status-rejected]="c.status === 'Refusée'">
              <div class="conge-left">
                <div class="user-avatar" [style.background]="'hsl('+(c.utilisateurNom.length * 40)+', 60%, 55%)'">
                  {{c.utilisateurNom.charAt(0)}}
                </div>
                <div class="conge-info">
                  <div class="conge-name">{{c.utilisateurNom}}</div>
                  <div class="conge-type">{{c.typeNom}}</div>
                </div>
              </div>
              <div class="conge-center">
                <div class="conge-dates">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <span>{{c.dateDebut | date:'dd MMM'}} - {{c.dateFin | date:'dd MMM yyyy'}}</span>
                </div>
                <div class="conge-days">{{c.nombreJours}} jour(s)</div>
                <div class="conge-motif" *ngIf="c.motif">{{c.motif}}</div>
              </div>
              <div class="conge-right">
                <span class="status-badge" [class]="'status-'+c.status.toLowerCase().replace(' ', '-')">{{c.status}}</span>
                @if (c.status === 'En attente') {
                  <div class="action-buttons">
                    <button class="btn-icon btn-approve" (click)="validerConge(c, true)" title="Approuver">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                    <button class="btn-icon btn-reject" (click)="validerConge(c, false)" title="Refuser">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            </div>
          }

          @if (filteredConges().length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 12l2 2 4-4"/>
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5"/>
              </svg>
              <h3>Aucune demande</h3>
              <p>Aucune demande de congé trouvée pour ce filtre.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .conges-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8fafc;
      min-height: 100vh;
    }

    .page-header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: 20px;
      padding: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      margin-bottom: 24px;
      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header-title {
      font-size: 28px;
      font-weight: 800;
      margin: 0;
    }

    .header-subtitle {
      opacity: 0.9;
      margin: 4px 0 0;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .badge-count {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-count.urgent {
      background: #fef3c7;
      color: #b45309;
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #f59e0b;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: white;
      color: #4f46e5;
    }

    .btn-secondary:hover {
      background: #f1f5f9;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.indigo { background: #eef2ff; color: #4f46e5; }
    .stat-icon.emerald { background: #ecfdf5; color: #10b981; }
    .stat-icon.amber { background: #fffbeb; color: #f59e0b; }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
    }

    .stat-label {
      font-size: 12px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
    }

    .main-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .card-header {
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
    }

    .tab-btn {
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background: #f1f5f9;
      color: #64748b;
      font-weight: 600;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: #4f46e5;
      color: white;
    }

    .conges-list {
      padding: 16px;
    }

    .conge-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      margin-bottom: 12px;
      background: white;
      transition: all 0.2s;
    }

    .conge-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .conge-card.status-pending {
      border-left: 4px solid #f59e0b;
    }

    .conge-card.status-approved {
      border-left: 4px solid #10b981;
    }

    .conge-card.status-rejected {
      border-left: 4px solid #ef4444;
    }

    .conge-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 200px;
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 18px;
    }

    .conge-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 14px;
    }

    .conge-type {
      font-size: 12px;
      color: #64748b;
      margin-top: 2px;
    }

    .conge-center {
      flex: 1;
    }

    .conge-dates {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .conge-days {
      font-size: 12px;
      color: #64748b;
      margin-top: 4px;
    }

    .conge-motif {
      font-size: 12px;
      color: #94a3b8;
      font-style: italic;
      margin-top: 4px;
    }

    .conge-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-en-attente {
      background: #fffbeb;
      color: #d97706;
    }

    .status-validée {
      background: #ecfdf5;
      color: #059669;
    }

    .status-refusée {
      background: #fef2f2;
      color: #dc2626;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-approve {
      background: #ecfdf5;
      color: #059669;
    }

    .btn-approve:hover {
      background: #059669;
      color: white;
    }

    .btn-reject {
      background: #fef2f2;
      color: #dc2626;
    }

    .btn-reject:hover {
      background: #dc2626;
      color: white;
    }

    .empty-state {
      padding: 48px;
      text-align: center;
      color: #94a3b8;
    }

    .empty-state svg {
      margin-bottom: 16px;
      opacity: 0.5;
    }

    .empty-state h3 {
      color: #64748b;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .empty-state p {
      margin: 0;
      font-size: 14px;
    }
  `]
})
export class ChefCongesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  societeId = '';
  societeNom = '';
  currentUserId = '';
  
  congesSignal = signal<Conge[]>([]);
  statsSignal = signal({ totalEquipe: 0, congesValides: 0, demandesCongesEnAttente: 0 });
  activeTab = 'all';

  stats = computed(() => this.statsSignal());
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
    this.api.getDemandesEnAttenteReal(this.societeId).subscribe({
      next: (data) => {
        const list = data.map((d: any) => ({
          id: d.id || d.Id,
          utilisateurId: d.utilisateurId || d.UtilisateurId,
          utilisateurNom: d.utilisateurNom || 'Utilisateur ' + (d.utilisateurId || d.UtilisateurId),
          typeNom: d.typeNom || d.TypeNom || 'Congé',
          dateDebut: d.dateDebut || d.DateDebut,
          dateFin: d.dateFin || d.DateFin,
          nombreJours: d.jours || d.Jours || 0,
          motif: d.motif || d.Motif || '',
          status: d.status || d.Status || 'En attente'
        }));
        this.congesSignal.set(list);
      },
      error: () => {
        this.snackBar.open('Erreur de chargement des demandes', 'Fermer', { duration: 3000 });
      }
    });
  }

  validerConge(conge: Conge, approuve: boolean) {
    const status = approuve ? 'Validée' : 'Refusée';
    this.api.validerDemandeCongeReal(conge.id, this.currentUserId, approuve).subscribe({
      next: (res) => {
        this.congesSignal.update(list => list.map(c => c.id === conge.id ? { ...c, status } : c));
        this.snackBar.open(res.message, 'Fermer', { duration: 3000 });
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la validation', 'Fermer', { duration: 3000 });
      }
    });
  }
}
