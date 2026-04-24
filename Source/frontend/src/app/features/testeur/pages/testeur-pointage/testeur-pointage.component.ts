import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-testeur-pointage',
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
            <h1 class="header-title">Mon Pointage</h1>
            <p class="header-subtitle">{{currentDateDisplay}}</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn btn-primary" (click)="pointerArrivee()" [disabled]="hasArrivee">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Arrivée
          </button>
          <button class="btn btn-secondary" (click)="pointerDepart()" [disabled]="!hasArrivee || hasDepart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Départ
          </button>
        </div>
      </header>

      <!-- Today's Status -->
      <div class="status-card">
        <div class="status-item">
          <div class="status-label">Arrivée</div>
          <div class="status-value" [class.empty]="!todayPointage().heureDebut">
            {{todayPointage().heureDebut || '--:--'}}
          </div>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <div class="status-label">Départ</div>
          <div class="status-value" [class.empty]="!todayPointage().heureFin">
            {{todayPointage().heureFin || (todayPointage().heureDebut ? 'En cours' : '--:--')}}
          </div>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <div class="status-label">Durée</div>
          <div class="status-value highlight">
            {{todayPointage().heuresTravaillees || 0}}h
          </div>
        </div>
      </div>

      <!-- History -->
      <div class="history-card">
        <div class="card-header">
          <h3>Historique de Pointage</h3>
          <div class="filter-group">
            <select [(ngModel)]="selectedMonth" (ngModelChange)="loadHistory()" class="month-select">
              <option [value]="0">Janvier</option>
              <option [value]="1">Février</option>
              <option [value]="2">Mars</option>
              <option [value]="3">Avril</option>
              <option [value]="4">Mai</option>
              <option [value]="5">Juin</option>
              <option [value]="6">Juillet</option>
              <option [value]="7">Août</option>
              <option [value]="8">Septembre</option>
              <option [value]="9">Octobre</option>
              <option [value]="10">Novembre</option>
              <option [value]="11">Décembre</option>
            </select>
            <select [(ngModel)]="selectedYear" (ngModelChange)="loadHistory()" class="year-select">
              <option [value]="2024">2024</option>
              <option [value]="2025">2025</option>
              <option [value]="2026">2026</option>
            </select>
          </div>
        </div>

        <div class="history-list">
          @for (p of filteredHistory(); track p.id) {
            <div class="history-item">
              <div class="history-date">
                <div class="date-day">{{p.date | date:'dd'}}</div>
                <div class="date-month">{{p.date | date:'MMM'}}</div>
              </div>
              <div class="history-times">
                <div class="time-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10 17 15 12 10 7"/>
                    <line x1="15" y1="12" x2="3" y2="12"/>
                  </svg>
                  <span [class.empty]="!p.heureDebut">{{p.heureDebut || '--:--'}}</span>
                </div>
                <div class="time-row">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  <span [class.empty]="!p.heureFin">{{p.heureFin || '--:--'}}</span>
                </div>
              </div>
              <div class="history-duration">
                <span class="duration-badge">{{p.heuresTravaillees || 0}}h</span>
              </div>
            </div>
          }

          @if (filteredHistory().length === 0) {
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4"/>
                <path d="M12 16h.01"/>
              </svg>
              <h3>Aucun pointage</h3>
              <p>Aucun pointage trouvé pour cette période.</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pointage-container {
      padding: 24px;
      max-width: 1000px;
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
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: white;
      color: #4f46e5;
    }

    .btn-primary:hover:not(:disabled) {
      background: #f1f5f9;
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
    }

    .btn-secondary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .status-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 24px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .status-item {
      text-align: center;
    }

    .status-label {
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .status-value {
      font-size: 24px;
      font-weight: 800;
      color: #1e293b;
    }

    .status-value.empty {
      color: #94a3b8;
      font-style: italic;
    }

    .status-value.highlight {
      color: #4f46e5;
    }

    .status-divider {
      width: 1px;
      height: 40px;
      background: #e2e8f0;
    }

    .history-card {
      background: white;
      border-radius: 16px;
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

    .filter-group {
      display: flex;
      gap: 8px;
    }

    .month-select,
    .year-select {
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-weight: 600;
      color: #1e293b;
      cursor: pointer;
    }

    .history-list {
      padding: 16px;
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      margin-bottom: 8px;
      background: #f8fafc;
      transition: all 0.2s;
    }

    .history-item:hover {
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .history-date {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 60px;
    }

    .date-day {
      font-size: 20px;
      font-weight: 800;
      color: #1e293b;
    }

    .date-month {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .history-times {
      flex: 1;
      display: flex;
      gap: 20px;
    }

    .time-row {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1e293b;
      font-size: 14px;
    }

    .time-row span.empty {
      color: #94a3b8;
      font-style: italic;
    }

    .history-duration {
      display: flex;
      align-items: center;
    }

    .duration-badge {
      background: #e0e7ff;
      color: #4338ca;
      padding: 6px 12px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
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
export class TesteurPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  currentDateDisplay = '';
  currentUserId = '';
  
  pointagesSignal = signal<any[]>([]);
  selectedMonth = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  
  todayPointage = signal<{ heureDebut: string | null; heureFin: string | null; heuresTravaillees: number }>({ heureDebut: null, heureFin: null, heuresTravaillees: 0 });
  
  hasArrivee = computed(() => !!this.todayPointage().heureDebut);
  hasDepart = computed(() => !!this.todayPointage().heureFin);

  filteredHistory = computed(() => {
    const list = this.pointagesSignal();
    return list.filter(p => {
      const date = new Date(p.date);
      return date.getMonth() === this.selectedMonth && date.getFullYear() === this.selectedYear;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.currentUserId = user?.id || user?.utilisateurId || '';
    this.currentDateDisplay = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.loadData();
  }

  loadData() {
    this.api.getPointages().subscribe({
      next: (allPointages) => {
        const list = allPointages.map((p: any) => ({
          id: p.id || p.Id,
          utilisateurId: p.utilisateurId || p.UtilisateurId,
          date: p.date || p.Date,
          heureDebut: p.heureEntree || p.HeureEntree,
          heureFin: p.heureSortie || p.HeureSortie,
          heuresTravaillees: p.duree || p.Duree || 0
        }));
        
        this.pointagesSignal.set(list);
        
        // Find today's pointage
        const today = new Date().toISOString().split('T')[0];
        const todayData = list.find(p => p.date?.split('T')[0] === today && p.utilisateurId === this.currentUserId);
        this.todayPointage.set(todayData || { heureDebut: null, heureFin: null, heuresTravaillees: 0 });
      },
      error: () => {
        this.pointagesSignal.set([]);
      }
    });
  }

  loadHistory() {
    this.loadData();
  }

  pointerArrivee() {
    const now = new Date();
    const time = now.toTimeString().substring(0, 5);
    
    const data = {
      utilisateurId: this.currentUserId,
      date: now.toISOString().split('T')[0],
      heureEntree: time,
      heureSortie: null,
      duree: 0
    };

    this.api.createPointage(data).subscribe({
      next: () => {
        this.snackBar.open('Arrivée enregistrée ✓', 'Fermer', { duration: 3000 });
        this.todayPointage.update(t => ({ ...t, heureDebut: time }));
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }

  pointerDepart() {
    const now = new Date();
    const time = now.toTimeString().substring(0, 5);
    const today = new Date().toISOString().split('T')[0];
    
    // Calculate duration
    const arrivee = this.todayPointage().heureDebut;
    if (!arrivee) return;
    
    const [h1, m1] = arrivee.split(':').map(Number);
    const [h2, m2] = time.split(':').map(Number);
    const duration = ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
    
    const data = {
      utilisateurId: this.currentUserId,
      date: today,
      heureEntree: arrivee,
      heureSortie: time,
      duree: duration > 0 ? duration : 0
    };

    this.api.updatePointage(data).subscribe({
      next: () => {
        this.snackBar.open('Départ enregistré ✓', 'Fermer', { duration: 3000 });
        this.todayPointage.update(t => ({ ...t, heureFin: time, heuresTravaillees: duration > 0 ? duration : 0 }));
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
      }
    });
  }
}
