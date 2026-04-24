import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="pointage-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <h1 class="header-title">Monitoring Présence</h1>
            <p class="header-subtitle">Équipe {{societeNom}} • {{currentDateDisplay}}</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-tile">
            <span class="stat-value emerald">{{stats.employesActifs}}</span>
            <span class="stat-label">Présents</span>
          </div>
          <div class="stat-tile">
            <span class="stat-value amber">{{stats.employesAbsents}}</span>
            <span class="stat-label">Absents</span>
          </div>
          <div class="stat-tile">
            <span class="stat-value indigo">{{stats.tauxPresence}}%</span>
            <span class="stat-label">Taux</span>
          </div>
        </div>
      </header>

      <!-- Toolbar -->
      <div class="toolbar-card">
        <div class="toolbar-row">
          <div class="search-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Rechercher..." class="search-input">
          </div>
          <div class="date-group">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <input type="date" [ngModel]="filterDate()" (ngModelChange)="filterDate.set($event); loadData()" class="date-input">
          </div>
          <button class="btn btn-secondary" (click)="loadData()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Actualiser
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-card">
        <div class="card-header">
          <h3>Pointages du Jour</h3>
          <div class="legend">
            <span class="legend-item"><span class="dot present"></span>Présent</span>
            <span class="legend-item"><span class="dot in-progress"></span>En cours</span>
            <span class="legend-item"><span class="dot absent"></span>Absent</span>
          </div>
        </div>

        <div class="pointage-list">
          @for (p of filteredPointages(); track p.id) {
            <div class="pointage-card">
              <div class="pointage-left">
                <div class="user-avatar" [style.background]="'hsl('+(p.utilisateurNom?.length * 45 || 0)+', 60%, 55%)'">
                  {{(p.utilisateurNom || '?').charAt(0)}}
                </div>
                <div class="pointage-info">
                  <div class="pointage-name">{{p.utilisateurNom}}</div>
                  <div class="pointage-id">#{{p.utilisateurId?.substring(0,6)}}</div>
                </div>
              </div>
              <div class="pointage-times">
                <div class="time-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  <span [class.empty]="!p.heureDebut">{{p.heureDebut || '--:--'}}</span>
                </div>
                <div class="time-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span [class.empty]="!p.heureFin">{{p.heureFin || (p.heureDebut ? 'En cours' : '--:--')}}</span>
                </div>
              </div>
              <div class="pointage-center">
                @if (p.heuresTravaillees > 0) {
                  <span class="activity-tag">{{p.heuresTravaillees}}h</span>
                } @else {
                  <span class="no-activity">--</span>
                }
              </div>
              <div class="pointage-right">
                <span class="status-badge" [class]="'status-'+(p.heureFin ? 'present' : (p.heureDebut ? 'in-progress' : 'absent'))">
                  <span class="dot"></span>
                  {{p.heureFin ? 'Présent' : (p.heureDebut ? 'En cours' : 'Absent')}}
                </span>
              </div>
            </div>
          }

          @if (filteredPointages().length === 0 && !isLoading) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
              <h3>Aucun pointage</h3>
              <p>Aucun pointage trouvé pour cette date.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pointage-container {
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

    .header-stats {
      display: flex;
      gap: 16px;
      background: rgba(255, 255, 255, 0.15);
      padding: 16px;
      border-radius: 16px;
      backdrop-filter: blur(10px);
    }

    .stat-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 16px;
      border-right: 1px solid rgba(255, 255, 255, 0.2);
    }

    .stat-tile:last-child {
      border-right: none;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
    }

    .stat-value.emerald { color: #10b981; }
    .stat-value.amber { color: #f59e0b; }
    .stat-value.indigo { color: #818cf8; }

    .stat-label {
      font-size: 11px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-top: 4px;
    }

    .toolbar-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .toolbar-row {
      display: flex;
      gap: 16px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-group, .date-group {
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
      padding: 12px 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
    }

    .search-input, .date-input {
      border: none;
      background: transparent;
      outline: none;
      font-weight: 600;
      color: #1e293b;
    }

    .date-input {
      cursor: pointer;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #f1f5f9;
      color: #475569;
    }

    .btn-secondary:hover {
      background: #e2e8f0;
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

    .legend {
      display: flex;
      gap: 16px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
    }

    .legend-item .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .legend-item .dot.present { background: #10b981; }
    .legend-item .dot.in-progress { background: #3b82f6; }
    .legend-item .dot.absent { background: #ef4444; }

    .pointage-list {
      padding: 16px;
    }

    .pointage-card {
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

    .pointage-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .pointage-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 180px;
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

    .pointage-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 14px;
    }

    .pointage-id {
      font-size: 11px;
      color: #94a3b8;
      font-family: monospace;
      margin-top: 2px;
    }

    .pointage-times {
      display: flex;
      gap: 16px;
      flex: 1;
    }

    .time-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #f8fafc;
      border-radius: 8px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .time-item span.empty {
      opacity: 0.5;
      font-style: italic;
    }

    .pointage-center {
      display: flex;
      align-items: center;
    }

    .activity-tag {
      background: #e0e7ff;
      color: #4338ca;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
    }

    .no-activity {
      color: #94a3b8;
      font-style: italic;
    }

    .pointage-right {
      display: flex;
      align-items: center;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .status-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    .status-present {
      background: #dcfce7;
      color: #15803d;
    }

    .status-present .dot {
      background: #22c55e;
    }

    .status-in-progress {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .status-in-progress .dot {
      background: #3b82f6;
      animation: pulse 2s infinite;
    }

    .status-absent {
      background: #fee2e2;
      color: #b91c1c;
    }

    .status-absent .dot {
      background: #ef4444;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
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
export class ChefPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  
  pointagesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterDate = signal(new Date().toISOString().split('T')[0]);
  
  filteredPointages = computed(() => {
    const list = this.pointagesSignal();
    const q = this.searchQuery().toLowerCase();
    const date = this.filterDate();
    
    return list.filter(p => {
      const matchesSearch = !q || p.utilisateurNom?.toLowerCase().includes(q);
      const matchesDate = !date || p.date?.split('T')[0] === date;
      return matchesSearch && matchesDate;
    });
  });

  isLoading = false;
  stats = { totalEmployes: 0, employesActifs: 0, employesAbsents: 0, tauxPresence: 0 };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentDateDisplay = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.loadStats();

    this.api.getPointages().subscribe({
      next: (allPointages) => {
        const list = allPointages.map((p: any) => ({
          id: p.id || p.Id,
          utilisateurId: p.utilisateurId || p.UtilisateurId,
          utilisateurNom: p.utilisateurNom || 'Utilisateur ' + (p.utilisateurId || p.UtilisateurId),
          date: p.date || p.Date,
          heureDebut: p.heureEntree || p.HeureEntree,
          heureFin: p.heureSortie || p.HeureSortie,
          heuresTravaillees: p.duree || p.Duree || 0,
          note: p.note || p.Note,
          typeId: p.typeId || p.TypeId
        }));
        this.pointagesSignal.set(list);
        this.isLoading = false;
      },
      error: () => {
        this.pointagesSignal.set([]);
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId, this.filterDate()).subscribe(res => {
       this.stats = res;
    });
  }
}
