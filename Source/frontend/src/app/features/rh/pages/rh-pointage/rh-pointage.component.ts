import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';

interface PointageDisplay {
  id: string | null;
  utilisateurId: string;
  utilisateurNom: string;
  departement: string;
  date: string;
  heureDebut: string | null;
  heureFin: string | null;
  heuresTravaillees: number;
  typeId: string;
  note: string;
  statusType: 'présent' | 'absent' | 'congé' | 'modifié' | 'en-cours';
  statusLabel: string;
}

@Component({
  selector: 'app-rh-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule, MatIconModule],
  template: `
    <div class="rh-pointage-page">
      <!-- Premium Header -->
      <header class="page-header">
        <div class="header-main">
          <div class="badge-pointage">Live Monitoring</div>
          <h1 class="glass-title">Pilotage des <span>Présences.</span></h1>
          <p class="subtitle">{{societeNom}} • {{currentDateDisplay}}</p>
        </div>
        
        <div class="stats-glass-row">
          <div class="stat-mini">
            <span class="val emerald">{{statsCalculated().presents}}</span>
            <span class="lbl">Présents</span>
          </div>
          <div class="stat-mini">
            <span class="val amber">{{statsCalculated().absents}}</span>
            <span class="lbl">Absents</span>
          </div>
          <div class="stat-mini">
            <span class="val blue">{{statsCalculated().conges}}</span>
            <span class="lbl">Congés</span>
          </div>
          <div class="stat-mini highlight">
            <span class="val indigo">{{statsCalculated().taux}}%</span>
            <span class="lbl">Taux</span>
          </div>
        </div>
      </header>

      <!-- Advanced Toolbar -->
      <div class="toolbar-glass">
        <div class="search-box">
          <mat-icon>search</mat-icon>
          <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" placeholder="Collaborateur, Département...">
        </div>
        
        <div class="filters-actions">
          <div class="input-wrap date">
            <mat-icon>calendar_today</mat-icon>
            <input type="date" [ngModel]="filterDate()" (ngModelChange)="onDateChange($event)">
          </div>

          <div class="input-wrap select">
            <mat-icon>filter_alt</mat-icon>
            <select [ngModel]="filterStatus()" (ngModelChange)="filterStatus.set($event)">
              <option value="ALL">Tous les statuts</option>
              <option value="PRESENT">Présents & En cours</option>
              <option value="ABSENT">Absents</option>
              <option value="CONGE">En Congé</option>
              <option value="MODIFIE">Modifiés RH</option>
            </select>
          </div>

          <div class="action-btns">
            <button class="btn-glass refresh" (click)="loadData()" [class.loading]="isLoading">
              <mat-icon>sync</mat-icon>
            </button>
            <button class="btn-glass report" (click)="exportRapportHTML()">
              <mat-icon>picture_as_pdf</mat-icon>
              Rapport
            </button>
          </div>
        </div>
      </div>

      <!-- Presence Registry -->
      <div class="registry-card-glass">
        <div class="table-container">
          <table class="presence-table">
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Département</th>
                <th>Statut</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredPointages(); track $index) {
                <tr [class.is-absent]="p.statusType === 'absent'">
                  <td>
                    <div class="user-info">
                      <div class="avatar-glass" [style.background]="'hsl('+((p.utilisateurNom.length || 0) * 45)+', 60%, 50%)'">{{p.utilisateurNom.charAt(0)}}</div>
                      <div class="txt">
                        <span class="name">{{p.utilisateurNom}}</span>
                        <span class="id">#{{(p.utilisateurId || 'XXXXXX').substring(0,6)}}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="dpt-label" *ngIf="p.departement">{{p.departement}}</span>
                    <span class="muted" *ngIf="!p.departement">--</span>
                  </td>
                  <td>
                    <span class="status-pill" [class]="p.statusType">
                      <span class="dot"></span>
                      {{p.statusLabel}}
                    </span>
                  </td>
                  <td>
                    <div class="time-box" [class.empty]="!p.heureDebut">
                      <mat-icon>login</mat-icon>
                      <span>{{p.heureDebut || '--:--'}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="time-box" [class.empty]="!p.heureFin">
                      <mat-icon>logout</mat-icon>
                      <span>{{p.heureFin || '--:--'}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="note-box" *ngIf="p.note" [title]="p.note">
                      <mat-icon>notes</mat-icon>
                      <span class="truncate">{{p.note}}</span>
                    </div>
                    <span class="muted" *ngIf="!p.note">--</span>
                  </td>
                  <td>
                    <button class="edit-btn-circle" (click)="editPointage(p)">
                      <mat-icon>edit_note</mat-icon>
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          <div class="empty-state-glass" *ngIf="filteredPointages().length === 0 && !isLoading">
            <mat-icon>sentiment_dissatisfied</mat-icon>
            <h3>Aucune donnée</h3>
            <p>Vérifiez les filtres ou changez de date.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal Glass -->
    <div class="modal-overlay" *ngIf="showEditDialog" (click)="closeEditDialog()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <h2>Ajustement Présence</h2>
          <button class="close-btn" (click)="closeEditDialog()"><mat-icon>close</mat-icon></button>
        </div>
        <div class="modal-body">
          <div class="user-summary">
            <div class="sum-avatar" [style.background]="'hsl('+((editingPointage?.utilisateurNom?.length || 0) * 45)+', 60%, 50%)'">{{editingPointage?.utilisateurNom?.charAt(0)}}</div>
            <div class="sum-txt">
              <span class="name">{{editingPointage?.utilisateurNom}}</span>
              <span class="date">{{filterDate() | date:'fullDate'}}</span>
            </div>
          </div>

          <div class="form-grid">
            <div class="field-group">
              <label>Type de Statut</label>
              <div class="select-wrap">
                <mat-icon>tune</mat-icon>
                <select [(ngModel)]="editForm.typeId">
                  <option value="NORMAL">Normal</option>
                  <option value="FORMATION">Formation</option>
                  <option value="MISSION">Mission</option>
                  <option value="EXCEPTIONNEL">Exceptionnel</option>
                  <option value="AUTRE">Autre</option>
                </select>
              </div>
            </div>

            <div class="time-row">
              <div class="field-group">
                <label>Entrée</label>
                <input type="time" [(ngModel)]="editForm.entre" class="glass-input">
              </div>
              <div class="field-group">
                <label>Sortie</label>
                <input type="time" [(ngModel)]="editForm.sortie" class="glass-input">
              </div>
            </div>

            <div class="field-group">
              <label>Notes RH</label>
              <textarea [(ngModel)]="editForm.note" placeholder="Justification de la modification..." rows="3" class="glass-input"></textarea>
            </div>
          </div>
        </div>
        <div class="modal-foot">
          <button class="btn-cancel" (click)="closeEditDialog()">Annuler</button>
          <button class="btn-save" (click)="savePointageEdit()">Enregistrer</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      --primary: #6366f1;
      --glass-bg: rgba(255, 255, 255, 0.7);
      --glass-border: rgba(255, 255, 255, 0.4);
      --glass-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
    }

    .rh-pointage-page {
      padding: var(--space-xl);
      animation: fadeIn 0.5s ease-out;
    }

    /* Header */
    .page-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-3xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-2xl);
      box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);
      position: relative;
      overflow: hidden;

      &::after {
        content: ''; position: absolute; top: -50%; right: -10%; width: 500px; height: 500px;
        background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%); border-radius: 50%;
      }
    }

    .header-main {
      position: relative; z-index: 1;
      .badge-pointage { display: inline-block; padding: 4px 12px; background: rgba(99, 102, 241, 0.2); color: #818cf8; border-radius: 20px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.1em; }
      .glass-title { font-size: 2.8rem; font-weight: 900; color: white; margin: 0; span { background: linear-gradient(135deg, #6366f1, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; } }
      .subtitle { color: #94a3b8; font-size: 1rem; margin-top: 8px; font-weight: 500; }
    }

    .stats-glass-row {
      display: flex; gap: 12px; position: relative; z-index: 1; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 24px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.05);
      .stat-mini {
        padding: 8px 16px; border-right: 1px solid rgba(255,255,255,0.05); text-align: center; display: flex; flex-direction: column;
        &:last-child { border: none; }
        .val { display: block; font-size: 1.5rem; font-weight: 900; }
        .val.emerald { color: #10b981; }
        .val.amber { color: #f59e0b; }
        .val.blue { color: #3b82f6; }
        .val.indigo { color: #818cf8; }
        .lbl { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; opacity: 0.6; color: #94a3b8; }
      }
    }

    /* Toolbar */
    .toolbar-glass {
      background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--glass-border); border-radius: var(--radius-2xl); padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-xl); box-shadow: var(--glass-shadow);
      
      .search-box {
        flex: 1; max-width: 400px; display: flex; align-items: center; gap: 12px; background: white; padding: 10px 16px; border-radius: 16px; border: 1px solid #e2e8f0;
        mat-icon { color: #94a3b8; }
        input { border: none; outline: none; flex: 1; font-weight: 600; color: #1e293b; font-size: 0.9rem; }
      }
    }

    .filters-actions {
      display: flex; align-items: center; gap: 16px;
      .input-wrap {
        display: flex; align-items: center; gap: 8px; background: white; padding: 10px 14px; border-radius: 14px; border: 1px solid #e2e8f0;
        mat-icon { font-size: 18px; width: 18px; height: 18px; color: #64748b; }
        input, select { border: none; outline: none; font-weight: 700; color: #1e293b; font-size: 0.85rem; background: transparent; }
      }
      .action-btns {
        display: flex; gap: 10px;
        .btn-glass {
          display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 14px; border: none; font-weight: 800; cursor: pointer; transition: all 0.2s;
          &.refresh { background: #f1f5f9; color: #475569; width: 44px; justify-content: center; padding: 0; &.loading mat-icon { animation: spin 1s linear infinite; } }
          &.report { background: var(--primary); color: white; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); &:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(99, 102, 241, 0.3); } }
        }
      }
    }

    /* Table Glass */
    .registry-card-glass {
      background: white; border-radius: 28px; border: 1px solid #e2e8f0; box-shadow: var(--shadow-sm); overflow: hidden;
    }

    .presence-table {
      width: 100%; border-collapse: collapse;
      th { padding: 18px 24px; text-align: left; background: #f8fafc; color: #94a3b8; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
      td { padding: 20px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
      tr.is-absent td { background: #fffcfc; }
      tr:hover td { background: #f8fafc; }
    }

    .user-info {
      display: flex; align-items: center; gap: 14px;
      .avatar-glass { width: 42px; height: 42px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
      .txt { display: flex; flex-direction: column; .name { font-weight: 800; color: #1e293b; font-size: 0.9rem; } .id { font-size: 0.7rem; color: #94a3b8; font-family: monospace; } }
    }

    .dpt-label { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; border: 1px solid #e2e8f0; }
    .status-pill {
      display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 800;
      .dot { width: 6px; height: 6px; border-radius: 50%; }
      &.présent { background: #dcfce7; color: #15803d; .dot { background: #22c55e; } }
      &.en-cours { background: #dbeafe; color: #1d4ed8; .dot { background: #3b82f6; animation: pulse 2s infinite; } }
      &.absent { background: #fee2e2; color: #b91c1c; .dot { background: #ef4444; } }
      &.congé { background: #e0f2fe; color: #0369a1; .dot { background: #0ea5e9; } }
      &.modifié { background: #ffedd5; color: #c2410c; .dot { background: #f97316; } }
    }

    .time-box {
      display: inline-flex; align-items: center; gap: 8px; background: #f8fafc; padding: 6px 12px; border-radius: 10px; border: 1px solid #e2e8f0; font-weight: 700; color: #1e293b; font-size: 0.85rem;
      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #94a3b8; }
      &.empty { background: transparent; border-color: transparent; color: #cbd5e1; mat-icon { color: #e2e8f0; } }
    }

    .note-box { display: flex; align-items: center; gap: 6px; max-width: 140px; color: #64748b; font-size: 0.8rem; background: #f1f5f9; padding: 4px 8px; border-radius: 8px; mat-icon { font-size: 14px; width: 14px; height: 14px; } .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; } }
    .edit-btn-circle { width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e2e8f0; background: white; color: #64748b; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; &:hover { color: var(--primary); border-color: var(--primary); background: #f5f3ff; transform: scale(1.1); } }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; background: rgba(15,23,42,0.4); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; animation: fadeIn 0.3s; }
    .modal-card { background: white; border-radius: 28px; width: 100%; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; }
    .modal-head { padding: 24px 32px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; h2 { margin: 0; font-size: 1.3rem; font-weight: 900; } .close-btn { border: none; background: #f1f5f9; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; } }
    .modal-body { padding: 32px; }
    .user-summary { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; padding: 16px; background: #f8fafc; border-radius: 20px; .sum-avatar { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 1.3rem; } .sum-txt { .name { display: block; font-weight: 800; color: #1e293b; font-size: 1.1rem; } .date { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: capitalize; } } }
    .field-group { margin-bottom: 20px; label { display: block; font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em; } }
    .select-wrap { display: flex; align-items: center; gap: 12px; background: #f1f5f9; padding: 0 16px; border-radius: 16px; mat-icon { color: #94a3b8; font-size: 18px; width: 18px; height: 18px; } select { flex: 1; padding: 14px 0; border: none; background: transparent; outline: none; font-weight: 700; color: #1e293b; } }
    .time-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .glass-input { width: 100%; padding: 14px 16px; background: #f1f5f9; border-radius: 16px; border: 2px solid transparent; outline: none; font-weight: 700; color: #1e293b; transition: all 0.2s; box-sizing: border-box; &:focus { background: white; border-color: var(--primary); } }
    .modal-foot { padding: 24px 32px; display: flex; gap: 12px; justify-content: flex-end; background: #f8fafc; .btn-cancel { padding: 12px 24px; border: none; background: #e2e8f0; color: #475569; font-weight: 800; border-radius: 14px; cursor: pointer; } .btn-save { padding: 12px 32px; border: none; background: var(--primary); color: white; font-weight: 800; border-radius: 14px; cursor: pointer; box-shadow: 0 10px 15px rgba(99,102,241,0.2); } }

    .muted { color: #cbd5e1; font-weight: 600; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
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
  
  pointagesSignal = signal<PointageDisplay[]>([]);
  searchQuery = signal('');
  filterDate = signal(new Date().toISOString().split('T')[0]);
  filterStatus = signal('ALL');
  
  isLoading = false;
  
  showEditDialog = false;
  editingPointage: PointageDisplay | null = null;
  editForm: any = { entre: '', sortie: '', note: '', typeId: 'NORMAL' };

  ngOnInit() {
    this.societeId = this.api.getCurrentSocieteId();
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.updateDateDisplay();
    this.loadData();
  }

  updateDateDisplay() {
    const d = new Date(this.filterDate());
    this.currentDateDisplay = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  onDateChange(newDate: string) {
    this.filterDate.set(newDate);
    this.updateDateDisplay();
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    const targetDate = this.filterDate();

    forkJoin({
      employes: this.api.getEmployesBySociete(this.societeId).pipe(catchError(() => of([]))),
      pointages: this.api.getPointages().pipe(catchError(() => of([]))),
      conges: this.api.getDemandesCongeBySociete(this.societeId).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ employes, pointages, conges }) => {
        
        // 1. Filter pointages for the target date
        const pointagesToday = pointages.filter((p: any) => {
           const pDate = p.date || p.Date;
           return pDate && pDate.startsWith(targetDate);
        });
        const pointageMap = new Map<string, any>();
        pointagesToday.forEach((p: any) => pointageMap.set(p.utilisateurId || p.UtilisateurId, p));

        // 2. Filter conges for the target date
        const targetTime = new Date(targetDate).getTime();
        const congesToday = conges.filter((c: any) => {
           if (c.status !== 'Validée' && c.Status !== 'Validée') return false;
           const dDebut = new Date(c.dateDebut || c.DateDebut).getTime();
           const dFin = new Date(c.dateFin || c.DateFin).getTime();
           return targetTime >= dDebut && targetTime <= (dFin + 86400000); // include end day
        });
        const congeMap = new Map<string, any>();
        congesToday.forEach((c: any) => congeMap.set(c.utilisateurId || c.UtilisateurId, c));

        // 3. Build comprehensive list (filter out admin, client, candidat)
        const employesAffiches = employes.filter((e: any) => {
           const typeId = (e.typeUtilisateurId || e.TypeUtilisateurId || '').toLowerCase();
           const roleId = (e.roleId || e.RoleId || '').toLowerCase();
           return !typeId.includes('admin') && !roleId.includes('admin') &&
                  !typeId.includes('client') && !roleId.includes('client') &&
                  !typeId.includes('t008') &&
                  !typeId.includes('candidat') && !roleId.includes('candidat');
        });

        const results: PointageDisplay[] = employesAffiches.map((e: any) => {
          const uId = e.id || e.Id;
          const pointage = pointageMap.get(uId);
          const conge = congeMap.get(uId);
          
          let statusType: 'présent' | 'absent' | 'congé' | 'modifié' | 'en-cours' = 'absent';
          let statusLabel = 'Absent';
          
          if (pointage) {
            const tId = (pointage.typeId || pointage.TypeId || 'NORMAL').toUpperCase();
            if (tId !== 'NORMAL' && tId !== '') {
               statusType = 'modifié';
               statusLabel = tId === 'EXCEPTIONNEL' ? 'Présent' : (tId.charAt(0) + tId.slice(1).toLowerCase());
            } else if (pointage.heureSortie || pointage.HeureSortie) {
               statusType = 'présent';
               statusLabel = 'Présent';
            } else {
               statusType = 'en-cours';
               statusLabel = 'En cours';
            }
          } else if (conge) {
            statusType = 'congé';
            statusLabel = 'En congé' + (conge.motif || conge.Motif ? ` (${conge.motif || conge.Motif})` : '');
          }

          const nomComplet = `${e.prenom || ''} ${e.nom || e.Nom || ''}`.trim();
          const emailFallback = e.email || e.Email || 'Sans Nom';

          return {
            id: pointage ? (pointage.id || pointage.Id) : null,
            utilisateurId: uId,
            utilisateurNom: nomComplet || emailFallback,
            departement: e.departement || e.Departement || '',
            date: targetDate,
            heureDebut: pointage ? (pointage.heureEntree || pointage.HeureEntree) : null,
            heureFin: pointage ? (pointage.heureSortie || pointage.HeureSortie) : null,
            heuresTravaillees: pointage ? (pointage.duree || pointage.Duree || 0) : 0,
            typeId: pointage ? (pointage.typeId || pointage.TypeId || 'NORMAL') : 'NORMAL',
            note: pointage ? (pointage.note || pointage.Note || '') : '',
            statusType,
            statusLabel
          };
        });

        // Sort by name
        results.sort((a, b) => a.utilisateurNom.localeCompare(b.utilisateurNom));

        this.pointagesSignal.set(results);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load presence data', err);
        this.isLoading = false;
        this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 3000 });
      }
    });
  }

  filteredPointages = computed(() => {
    const list = this.pointagesSignal();
    const q = this.searchQuery().toLowerCase();
    const s = this.filterStatus();
    
    return list.filter(p => {
      const matchesSearch = !q || 
        (p.utilisateurNom || '').toLowerCase().includes(q) || 
        (p.departement || '').toLowerCase().includes(q);
      
      let matchesStatus = true;
      if (s === 'PRESENT') matchesStatus = p.statusType === 'présent' || p.statusType === 'en-cours';
      else if (s === 'ABSENT') matchesStatus = p.statusType === 'absent';
      else if (s === 'CONGE') matchesStatus = p.statusType === 'congé';
      else if (s === 'MODIFIE') matchesStatus = p.statusType === 'modifié';
      
      return matchesSearch && matchesStatus;
    });
  });

  statsCalculated = computed(() => {
    const list = this.pointagesSignal();
    let presents = 0;
    let absents = 0;
    let conges = 0;
    
    list.forEach(p => {
      if (p.statusType === 'présent' || p.statusType === 'en-cours' || p.statusType === 'modifié') presents++;
      else if (p.statusType === 'absent') absents++;
      else if (p.statusType === 'congé') conges++;
    });
    
    const total = presents + absents; // usually excluding conges from active rate
    const taux = total > 0 ? Math.round((presents / total) * 100) : 0;
    
    return { presents, absents, conges, taux };
  });

  editPointage(p: PointageDisplay) {
     this.editingPointage = p;
     this.editForm = {
        entre: p.heureDebut ? p.heureDebut.substring(0, 5) : '',
        sortie: p.heureFin ? p.heureFin.substring(0, 5) : '',
        note: p.note || '',
        typeId: p.typeId || 'NORMAL'
     };
     this.showEditDialog = true;
  }

  closeEditDialog() {
     this.showEditDialog = false;
     this.editingPointage = null;
  }

  savePointageEdit() {
    if (!this.editingPointage) return;
    
    // Preparation
    const isNew = !this.editingPointage.id;
    const he = this.editForm.entre || null;
    const hs = this.editForm.sortie || null;
    
    const data = {
      Id: this.editingPointage.id,
      UtilisateurId: this.editingPointage.utilisateurId,
      SocieteId: this.societeId,
      Date: this.filterDate(),
      HeureEntree: he,
      HeureSortie: hs,
      TypeId: this.editForm.typeId,
      Note: this.editForm.note
    };
    
    const req$ = isNew ? this.api.createPointage(data) : this.api.updatePointage(data);
    
    req$.subscribe({
      next: () => {
        this.snackBar.open('Statut mis à jour avec succès', 'Fermer', { duration: 2000 });
        this.showEditDialog = false;
        this.loadData(); // Reload to refresh list and statuses properly
      },
      error: (err) => {
         console.error('Update err', err);
         this.snackBar.open('Erreur: ' + (err.message || 'Échec de la modification'), 'Fermer', { duration: 3000 });
      }
    });
  }

  exportRapportHTML() {
    const url = this.api.getRapportPresenceUrl(this.societeId, this.rapportMois, this.rapportAnnee, 'html');
    window.open(url, '_blank');
  }
}
