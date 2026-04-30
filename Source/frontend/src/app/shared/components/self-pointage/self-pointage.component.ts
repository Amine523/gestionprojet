import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-self-pointage',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `
    <div class="pointage-container">
      <header class="page-header">
        <div class="header-content">
          <h1 class="header-title">Ma <span class="gradient-text">Présence</span></h1>
          <p class="header-subtitle">Enregistrez vos heures d'arrivée et de départ quotidiennement.</p>
        </div>
        <div class="header-clock">
          <div class="digital-clock">{{currentTime}}</div>
          <div class="current-date">{{currentDate}}</div>
        </div>
      </header>

      <div class="main-grid">
        <!-- Punch Card -->
        <div class="card punch-card" [class.active]="isPunchedIn">
          <div class="status-badge" [class.online]="isPunchedIn">
            <span class="dot"></span>
            {{isPunchedIn ? 'En service' : 'Hors service'}}
          </div>

          <div class="timer" *ngIf="isPunchedIn">
            <span class="timer-label">Durée de session</span>
            <span class="timer-value">{{sessionDuration}}</span>
          </div>

          <div class="punch-actions">
            <button *ngIf="!isPunchedIn" class="btn-punch in" (click)="punchIn()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Pointer l'arrivée
            </button>
            <button *ngIf="isPunchedIn" class="btn-punch out" (click)="punchOut()">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Pointer le départ
            </button>
          </div>

          <div class="session-info" *ngIf="lastPointage">
            <div class="info-item">
              <span class="label">Entrée :</span>
              <span class="value">{{lastPointage.heureDebut}}</span>
            </div>
            <div class="info-item" *ngIf="lastPointage.heureFin">
              <span class="label">Sortie :</span>
              <span class="value">{{lastPointage.heureFin}}</span>
            </div>
          </div>
        </div>

        <!-- History Card -->
        <div class="card history-card">
          <div class="card-header">
            <h3>Historique récent</h3>
            <button class="btn-text">Voir tout</button>
          </div>
          <div class="history-list">
            <div *ngFor="let p of history" class="history-item">
              <div class="history-date">
                <span class="day">{{p.date | date:'dd'}}</span>
                <span class="month">{{p.date | date:'MMM'}}</span>
              </div>
              <div class="history-times">
                <div class="time-range">{{p.heureDebut}} - {{p.heureFin || '--:--'}}</div>
                <div class="duration">{{p.heuresTravaillees}}h travaillées</div>
              </div>
              <div class="history-status" [class.complete]="p.heureFin">
                {{p.heureFin ? 'Complet' : 'Incomplet'}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pointage-container { display: flex; flex-direction: column; gap: var(--space-xl); }
    .page-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: var(--space-lg); border-bottom: 1px solid var(--color-border); }
    .header-title { font-size: 28px; font-weight: 800; letter-spacing: -1px; margin: 0; }
    .gradient-text { background: linear-gradient(135deg, #10b981, #3b82f6); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
    .header-clock { text-align: right; }
    .digital-clock { font-size: 32px; font-weight: 800; color: #1e293b; font-family: 'Courier New', monospace; }
    .current-date { color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; font-size: 12px; }

    .main-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: var(--space-xl); }
    .card { background: white; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden; padding: var(--space-xl); }
    
    .punch-card { display: flex; flex-direction: column; align-items: center; gap: var(--space-xl); border: 2px solid #e2e8f0; transition: all 0.3s; }
    .punch-card.active { border-color: #10b981; background: rgba(16, 185, 129, 0.02); }

    .status-badge { display: inline-flex; align-items: center; gap: 8px; padding: 8px 16px; background: #f1f5f9; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
    .status-badge.online { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .status-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: #94a3b8; }
    .status-badge.online .dot { background: #10b981; animation: pulse 2s infinite; }

    .timer { text-align: center; }
    .timer-label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .timer-value { font-size: 40px; font-weight: 800; color: #1e293b; }

    .btn-punch { width: 100%; height: 80px; border-radius: 20px; border: none; font-size: 18px; font-weight: 800; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.2s; }
    .btn-punch.in { background: #10b981; box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.4); }
    .btn-punch.out { background: #f43f5e; box-shadow: 0 10px 15px -3px rgba(244, 63, 94, 0.4); }
    .btn-punch:hover { transform: translateY(-4px); }
    .btn-punch:active { transform: translateY(0); }

    .session-info { width: 100%; display: flex; flex-direction: column; gap: 8px; padding-top: var(--space-lg); border-top: 1px solid #f1f5f9; }
    .info-item { display: flex; justify-content: space-between; font-size: 14px; font-weight: 600; }
    .info-item .label { color: #64748b; }
    .info-item .value { color: #1e293b; }

    .history-card { padding: 0; }
    .card-header { padding: var(--space-xl); display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
    .card-header h3 { font-size: 18px; font-weight: 700; margin: 0; }
    .btn-text { background: transparent; border: none; color: #3b82f6; font-weight: 700; cursor: pointer; }

    .history-list { display: flex; flex-direction: column; }
    .history-item { display: flex; align-items: center; gap: 16px; padding: 16px var(--space-xl); border-bottom: 1px solid #f8fafc; }
    .history-date { width: 48px; height: 48px; border-radius: 12px; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid #e2e8f0; }
    .history-date .day { font-size: 18px; font-weight: 800; line-height: 1; color: #1e293b; }
    .history-date .month { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; }
    .history-times { flex: 1; }
    .time-range { font-weight: 700; color: #1e293b; font-size: 14px; }
    .duration { font-size: 12px; color: #64748b; }
    .history-status { font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 8px; border-radius: 6px; background: #fee2e2; color: #ef4444; }
    .history-status.complete { background: #dcfce7; color: #10b981; }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.3; } 100% { opacity: 1; } }

    @media (max-width: 1024px) {
      .main-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SelfPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  currentTime = '';
  currentDate = '';
  isPunchedIn = false;
  sessionDuration = '00:00:00';
  lastPointage: any = null;
  history: any[] = [];
  private timerInterval: any;

  ngOnInit() {
    this.updateClock();
    setInterval(() => this.updateClock(), 1000);
    this.loadTodayStatus();
    this.loadHistory();
  }

  updateClock() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('fr-FR', { hour12: false });
    this.currentDate = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    if (this.isPunchedIn && this.lastPointage?.heureDebut) {
      const [h, m] = this.lastPointage.heureDebut.split(':');
      const start = new Date();
      start.setHours(+h, +m, 0);
      const diff = now.getTime() - start.getTime();
      const hh = Math.floor(diff / 3600000);
      const mm = Math.floor((diff % 3600000) / 60000);
      const ss = Math.floor((diff % 60000) / 1000);
      this.sessionDuration = `${hh.toString().padStart(2,'0')}:${mm.toString().padStart(2,'0')}:${ss.toString().padStart(2,'0')}`;
    }
  }

  loadTodayStatus() {
    const user = this.api.getCurrentUser();
    this.api.getPointageAujourdhui(user.id).subscribe(p => {
      if (p && !p.heureFin) {
        this.isPunchedIn = true;
        this.lastPointage = p;
      } else {
        this.isPunchedIn = false;
        this.lastPointage = p;
      }
    });
  }

  loadHistory() {
    const user = this.api.getCurrentUser();
    this.api.getPointages().subscribe(list => {
      this.history = list.filter((p: any) => p.utilisateurId === user.id).slice(0, 5);
    });
  }

  punchIn() {
    const user = this.api.getCurrentUser();
    this.api.pointerEntree(user.id).subscribe(() => {
      this.isPunchedIn = true;
      this.loadTodayStatus();
      this.snackBar.open('Bonne journée de travail !', 'OK', { duration: 3000 });
    });
  }

  punchOut() {
    const user = this.api.getCurrentUser();
    this.api.pointerSortie(user.id).subscribe(() => {
      this.isPunchedIn = false;
      this.loadTodayStatus();
      this.loadHistory();
      this.snackBar.open('Session terminée. Bonne soirée !', 'OK', { duration: 3000 });
    });
  }
}
