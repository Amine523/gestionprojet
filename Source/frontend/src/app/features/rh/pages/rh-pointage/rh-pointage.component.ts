import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="header-title">
            Monitoring des <span class="gradient-text">Présences.</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • {{currentDateDisplay}}
          </p>
        </div>
        <div class="header-stats">
            <div class="stat-tile">
               <span class="stat-value emerald">{{stats.employesPresents}}</span>
               <span class="stat-label">Présents</span>
            </div>
           <div class="stat-tile">
              <span class="stat-value amber">{{stats.employesAbsents}}</span>
              <span class="stat-label">Absents</span>
           </div>
           <div class="stat-tile">
              <span class="stat-value indigo">{{stats.tauxPresence}}%</span>
              <span class="stat-label">Taux Présence</span>
           </div>
        </div>
      </header>

      <div class="card toolbar-widget">
        <div class="filters-row">
            <div class="search-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Rechercher un collaborateur..." class="search-input">
            </div>

            <div class="filter-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input type="date" [ngModel]="filterDate()" (ngModelChange)="filterDate.set($event); loadData()" class="date-input">
            </div>

            <div class="filter-spacer"></div>

            <button class="btn btn-secondary" (click)="loadData()">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M23 4v6h-6"/>
                 <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
               </svg>
               Actualiser
            </button>

            <button class="btn btn-primary" (click)="exportRapportHTML()" title="Rapport {{rapportMois}}/{{rapportAnnee}}">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                 <polyline points="14 2 14 8 20 8"/>
                 <line x1="16" y1="13" x2="8" y2="13"/>
                 <line x1="16" y1="17" x2="8" y2="17"/>
                 <polyline points="10 9 8 9 8 11"/>
               </svg>
               Rapport PDF
            </button>

            <button class="btn btn-outline" (click)="exportRapportCSV()">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <line x1="12" y1="5" x2="12" y2="19"/>
                 <line x1="5" y1="12" x2="19" y2="12"/>
               </svg>
               CSV
            </button>
        </div>

        <div class="rapport-controls">
          <label class="rc-label">Mois du rapport :</label>
          <select [(ngModel)]="rapportMois" class="date-select">
            <option [value]="1">Janvier</option><option [value]="2">Février</option>
            <option [value]="3">Mars</option><option [value]="4">Avril</option>
            <option [value]="5">Mai</option><option [value]="6">Juin</option>
            <option [value]="7">Juillet</option><option [value]="8">Août</option>
            <option [value]="9">Septembre</option><option [value]="10">Octobre</option>
            <option [value]="11">Novembre</option><option [value]="12">Décembre</option>
          </select>
          <select [(ngModel)]="rapportAnnee" class="date-select">
            <option [value]="2024">2024</option>
            <option [value]="2025">2025</option>
            <option [value]="2026">2026</option>
          </select>
        </div>
      </div>

      <div class="card main-content">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Activité</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredPointages(); track p.id) {
                <tr>
                  <td>
                     <div class="emp-cell">
                        <div class="user-avatar" [style.background]="'hsl('+(p.utilisateurNom?.length * 45 || 0)+', 60%, 55%)'">{{(p.utilisateurNom || '?').charAt(0)}}</div>
                        <div class="emp-info">
                           <span class="emp-name">{{p.utilisateurNom}}</span>
                           <span class="emp-id">#{{p.utilisateurId?.substring(0,6)}}</span>
                        </div>
                     </div>
                  </td>
                  <td>
                     <div class="time-pill" [class.empty]="!p.heureDebut">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                          <polyline points="10 17 15 12 10 7"/>
                          <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        <span>{{p.heureDebut || '--:--'}}</span>
                     </div>
                  </td>
                  <td>
                     <div class="time-pill" [class.empty]="!p.heureFin">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>{{p.heureFin || (p.heureDebut ? 'En cours' : '--:--')}}</span>
                     </div>
                  </td>
                  <td>
                     @if (p.heuresTravaillees > 0) {
                       <span class="activity-tag">{{p.heuresTravaillees}}h</span>
                     } @else {
                       <span class="no-activity">--</span>
                     }
                  </td>
                  <td>
                    <span class="status-chip" [class]="'status-'+(p.heureFin ? 'présent' : (p.heureDebut ? 'en-cours' : 'absent'))">
                      <span class="dot"></span>
                      {{p.heureFin ? 'Présent' : (p.heureDebut ? 'En cours' : 'Absent')}}
                    </span>
                  </td>
                  <td>
                    <div class="action-row">
                       <button class="btn-icon" title="Ajuster" (click)="editPointage(p)">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                           <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                         </svg>
                       </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (filteredPointages().length === 0 && !isLoading) {
            <div class="empty-state">
               <div class="empty-icon">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                   <circle cx="12" cy="12" r="10"/>
                   <path d="M12 8v4"/>
                   <path d="M12 16h.01"/>
                 </svg>
               </div>
               <h3>Aucun résultat trouvé</h3>
               <p>Modifiez vos filtres ou lancez une nouvelle recherche.</p>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showEditDialog) {
      <div class="modal-overlay" (click)="closeEditDialog()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header-form">
             <h2>Ajustement du Temps</h2>
             <button class="btn-close" (click)="closeEditDialog()">✕</button>
          </div>
          <div class="modal-body">
             <div class="form-group">
                <label>Collaborateur</label>
                <div class="readonly-field">{{editingPointage?.utilisateurNom}}</div>
             </div>
             <div class="form-grid">
                <div class="form-group">
                  <label>Heure d'entrée</label>
                  <input type="time" [(ngModel)]="editForm.entre" class="time-input">
                </div>
                <div class="form-group">
                  <label>Heure de sortie</label>
                  <input type="time" [(ngModel)]="editForm.sortie" class="time-input">
                </div>
             </div>
          </div>
          <div class="modal-footer">
             <button class="btn btn-secondary" (click)="closeEditDialog()">Annuler</button>
             <button class="btn btn-primary" (click)="savePointageEdit()">Appliquer</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dashboard-container { display: flex; flex-direction: column; gap: 24px; padding: 24px; }
    .dashboard-header { 
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); 
      border-radius: 24px; padding: 32px; display: flex; justify-content: space-between; align-items: center; 
      color: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .header-title { font-size: 32px; font-weight: 800; margin: 0; }
    .gradient-text { color: #c7d2fe; }
    .header-subtitle { opacity: 0.8; margin: 8px 0 0; font-weight: 600; }
    .header-stats { display: flex; gap: 16px; background: rgba(255, 255, 255, 0.1); padding: 16px; border-radius: 20px; backdrop-filter: blur(10px); }
    .stat-tile { display: flex; flex-direction: column; align-items: center; padding: 0 16px; border-right: 1px solid rgba(255, 255, 255, 0.2); }
    .stat-tile:last-child { border-right: none; }
    .stat-value { font-size: 24px; font-weight: 800; }
    .stat-label { font-size: 11px; text-transform: uppercase; opacity: 0.8; margin-top: 4px; }
    
    .card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; }
    .toolbar-widget { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
    .filters-row { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
    .search-group { flex: 1; min-width: 300px; display: flex; align-items: center; gap: 12px; background: #f8fafc; padding: 12px 16px; border-radius: 12px; border: 1px solid #e2e8f0; }
    .search-input { border: none; background: transparent; outline: none; flex: 1; font-weight: 600; color: #1e293b; }
    .date-input { padding: 10px 16px; border-radius: 12px; border: 1px solid #e2e8f0; background: #f8fafc; font-weight: 600; cursor: pointer; }
    .filter-spacer { flex: 1; }
    
    .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; border: none; transition: all 0.2s; }
    .btn-primary { background: #4f46e5; color: white; }
    .btn-secondary { background: #f1f5f9; color: #475569; }
    .btn-outline { background: transparent; border: 1px solid #e2e8f0; color: #475569; }
    .btn:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
    
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { padding: 16px; text-align: left; background: #f8fafc; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; }
    
    .emp-cell { display: flex; align-items: center; gap: 12px; }
    .user-avatar { width: 40px; height: 40px; border-radius: 12px; color: white; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .emp-name { font-weight: 700; color: #1e293b; display: block; }
    .emp-id { font-size: 11px; color: #94a3b8; font-family: monospace; }
    
    .time-pill { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; background: #f1f5f9; border-radius: 10px; font-weight: 600; color: #1e293b; border: 1px solid #e2e8f0; }
    .time-pill.empty { opacity: 0.5; font-style: italic; }
    .activity-tag { background: #e0e7ff; color: #4338ca; padding: 4px 8px; border-radius: 6px; font-weight: 700; font-size: 12px; }
    
    .status-chip { display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
    .status-chip .dot { width: 6px; height: 6px; border-radius: 50%; }
    .status-présent { background: #dcfce7; color: #15803d; }
    .status-présent .dot { background: #22c55e; }
    .status-en-cours { background: #dbeafe; color: #1d4ed8; }
    .status-en-cours .dot { background: #3b82f6; animation: pulse 2s infinite; }
    .status-absent { background: #fee2e2; color: #b91c1c; }
    .status-absent .dot { background: #ef4444; }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }
    
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: white; border-radius: 24px; width: 100%; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    .modal-header-form { padding: 24px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .modal-header-form h2 { margin: 0; font-size: 20px; font-weight: 800; color: #1e293b; }
    .btn-close { border: none; background: transparent; font-size: 20px; cursor: pointer; color: #94a3b8; }
    .modal-body { padding: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
    .readonly-field { padding: 12px; background: #f8fafc; border-radius: 12px; font-weight: 700; color: #1e293b; }
    .time-input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 12px; outline: none; font-weight: 600; }
    .time-input:focus { border-color: #4338ca; }
    .modal-footer { padding: 16px 24px; display: flex; justify-content: flex-end; gap: 12px; background: #f8fafc; border-radius: 0 0 24px 24px; }
  `]
})
export class RhPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  rapportMois = new Date().getMonth() + 1;
  rapportAnnee = new Date().getFullYear();
  
  pointagesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterUtilisateur = signal('');
  filterDate = signal(new Date().toISOString().split('T')[0]);
  
  filteredPointages = computed(() => {
    const list = this.pointagesSignal();
    const q = this.searchQuery().toLowerCase();
    const date = this.filterDate();
    
    return list.filter(p => {
      const matchesSearch = !q || p.utilisateurNom?.toLowerCase().includes(q);
      
      // Robust date matching
      let matchesDate = !date;
      if (date && p.date) {
        const pDateStr = typeof p.date === 'string' ? p.date : '';
        matchesDate = pDateStr.startsWith(date);
      }
      
      return matchesSearch && matchesDate;
    });
  });

  isLoading = false;
  stats = { totalEmployes: 0, employesActifs: 0, employesPresents: 0, employesAbsents: 0, tauxPresence: 0 };
  employesMap: { [id: string]: string } = {};
  
  showEditDialog = false;
  editingPointage: any = null;
  editForm: any = { entre: '', sortie: '' };

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

    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        this.employesMap = {};
        employes.forEach((e: any) => {
          this.employesMap[e.id || e.Id] = e.nom || e.Nom;
        });

        this.api.getPointages().subscribe({
          next: (allPointages) => {
            const list = (allPointages || [])
              .filter((p: any) => {
                const uId = p.utilisateurId || p.UtilisateurId;
                return !!this.employesMap[uId];
              })
              .map((p: any) => {
                const uId = p.utilisateurId || p.UtilisateurId;
                const uNom = p.utilisateurNom || p.UtilisateurNom || this.employesMap[uId] || 'Utilisateur ' + uId;
              return {
                id: p.id || p.Id,
                utilisateurId: uId,
                utilisateurNom: uNom,
                date: p.date || p.Date,
                heureDebut: p.heureEntree || p.HeureEntree,
                heureFin: p.heureSortie || p.HeureSortie,
                heuresTravaillees: p.duree || p.Duree || 0,
                note: p.note || p.Note,
                typeId: p.typeId || p.TypeId
              };
            });
            this.pointagesSignal.set(list);
            this.isLoading = false;
          },
          error: () => {
            this.pointagesSignal.set([]);
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId, this.filterDate()).subscribe(res => {
       this.stats = res;
    });
  }

  editPointage(p: any) {
     this.editingPointage = p;
     this.editForm = {
        entre: p.heureDebut ? p.heureDebut.substring(0, 5) : '',
        sortie: p.heureFin ? p.heureFin.substring(0, 5) : ''
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
      ...this.editingPointage, 
      heureDebut: this.editForm.entre, 
      heureFin: this.editForm.sortie,
      societeId: this.societeId 
    };
    
    this.api.updatePointage(data).subscribe({
      next: () => {
        this.pointagesSignal.update(list => list.map(p => 
          (p.id === data.id) ? { ...p, heureDebut: data.heureDebut, heureFin: data.heureFin } : p
        ));
        this.snackBar.open('Pointage mis à jour avec succès', 'Fermer', { duration: 2000 });
        this.showEditDialog = false;
        this.loadStats(); // Update stats since status might change
      },
      error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
    });
  }

  exportRapportHTML() {
    const url = this.api.getRapportPresenceUrl(this.societeId, this.rapportMois, this.rapportAnnee, 'html');
    window.open(url, '_blank');
  }

  exportRapportCSV() {
    this.api.getRapportPresence(this.societeId, this.rapportMois, this.rapportAnnee).subscribe((blob: Blob) => {
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
