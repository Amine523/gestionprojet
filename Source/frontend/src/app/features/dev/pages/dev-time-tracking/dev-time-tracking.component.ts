import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-dev-time-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="time-tracking-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="header-title">Présence & Activité</h1>
          <p class="header-subtitle">{{societeNom}} • {{currentDate}}</p>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="main-grid">
        <div class="left-col">
          <!-- Clock Widget -->
          <div class="clock-widget" [class.active]="isClockedIn">
             <div class="clock-content">
                <div class="status-indicator">
                   <span class="status-dot" [class.online]="isClockedIn"></span>
                   {{isClockedIn ? 'EN POSTE' : 'HORS LIGNE'}}
                </div>
                <div class="digital-clock">{{currentTimeDisplay}}</div>
                
                @if (!isClockedIn) {
                   <button class="clock-btn clock-in-btn" (click)="clockIn()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" y1="12" x2="3" y2="12"></line>
                      </svg>
                      Pointer l'Arrivée
                   </button>
                } @else {
                   <div class="active-stats">
                      <div class="a-stat">
                         <span class="a-label">Début à</span>
                         <span class="a-val">{{clockInData?.heureEntree}}</span>
                      </div>
                      <div class="a-stat">
                         <span class="a-label">Cumul Jour</span>
                         <span class="a-val text-primary">{{workedHours}}h</span>
                      </div>
                   </div>
                   <button class="clock-btn clock-out-btn" (click)="clockOut()">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Pointer le Départ
                   </button>
                }
             </div>
          </div>

          <!-- Stats Mini Grid -->
          <div class="stats-mini-grid">
             <div class="mini-tile indigo">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <div class="mt-info">
                   <span class="mt-val">40h</span>
                   <span class="mt-label">Objectif Semaine</span>
                </div>
             </div>
             <div class="mini-tile emerald">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                <div class="mt-info">
                   <span class="mt-val">{{efficiency}}%</span>
                   <span class="mt-label">Productivité</span>
                </div>
             </div>
          </div>
        </div>

        <!-- History Card -->
        <div class="right-col">
          <div class="history-card">
             <div class="card-header">
                <h3>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  Historique de Pointage
                </h3>
             </div>
             <div class="history-list">
                @for (p of history; track p.id) {
                   <div class="history-item-p">
                      <div class="h-icon" [class.full]="p.heureSortie">
                        @if (p.heureSortie) {
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                          </svg>
                        } @else {
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                        }
                      </div>
                      <div class="h-details">
                         <div class="h-row">
                            <span class="h-date">{{p.date | date:'dd MMMM yyyy'}}</span>
                            @if (p.heuresTravaillees) {
                              <span class="h-hours">{{p.heuresTravaillees}}h travaillées</span>
                            }
                         </div>
                         <div class="h-row sub">
                            <span class="h-times">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                <polyline points="10 17 15 12 10 7"></polyline>
                                <line x1="15" y1="12" x2="3" y2="12"></line>
                              </svg>
                              {{p.heureEntree}}
                              @if (p.heureSortie) {
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                  <polyline points="16 17 21 12 16 7"></polyline>
                                  <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                {{p.heureSortie}}
                              } @else {
                                <span>...</span>
                              }
                            </span>
                         </div>
                      </div>
                   </div>
                }
                @if (history.length === 0) {
                   <div class="empty-state">
                      <p>Aucun historique disponible</p>
                   </div>
                }
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .time-tracking-container {
      padding: var(--space-2xl);
      max-width: 1400px;
      margin: 0 auto;
      background: var(--color-bg);
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: var(--space-2xl);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
      margin: var(--space-sm) 0 0;
      font-weight: var(--font-weight-semibold);
    }

    .main-grid {
      display: grid;
      grid-template-columns: 420px 1fr;
      gap: var(--space-lg);
      align-items: start;
    }

    .clock-widget {
      padding: var(--space-2xl);
      text-align: center;
      background: white;
      border-radius: var(--radius-xl);
      transition: all var(--transition-base);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .clock-widget.active {
      border-color: #3b82f6;
      background: linear-gradient(to bottom, #ffffff, #f0f7ff);
    }

    .status-indicator {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      margin-bottom: var(--space-lg);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: #cbd5e1;
    }

    .status-dot.online {
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse-green 2s infinite;
    }

    @keyframes pulse-green {
      0% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.5); opacity: 0.5; }
      100% { transform: scale(1); opacity: 1; }
    }

    .digital-clock {
      font-family: monospace;
      font-size: 56px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin-bottom: var(--space-lg);
      letter-spacing: -2px;
    }

    .clock-btn {
      width: 100%;
      height: 64px;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      transition: all var(--transition-base);
      border: none;
      cursor: pointer;
    }

    .clock-in-btn {
      background: #1e293b;
      color: white;
    }

    .clock-in-btn:hover {
      background: #0f172a;
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .clock-out-btn {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fee2e2;
    }

    .clock-out-btn:hover {
      background: #dc2626;
      color: white;
    }

    .active-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .a-stat {
      display: flex;
      flex-direction: column;
      text-align: left;
    }

    .a-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .a-val {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .text-primary {
      color: #3b82f6;
    }

    .stats-mini-grid {
      margin-top: var(--space-md);
      padding: var(--space-lg) !important;
      display: grid;
      grid-template-rows: 1fr 1fr;
      gap: var(--space-md);
      background: transparent;
      box-shadow: none !important;
      border: none;
    }

    .mini-tile {
      background: white;
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .mini-tile.indigo svg {
      color: #6366f1;
    }

    .mini-tile.emerald svg {
      color: #10b981;
    }

    .mt-val {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: block;
    }

    .mt-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .history-card {
      background: white;
      border-radius: var(--radius-xl);
      overflow: hidden;
      height: 100%;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .card-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .card-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .card-header svg {
      color: #3b82f6;
    }

    .history-list {
      padding: var(--space-md) var(--space-lg);
      max-height: 600px;
      overflow-y: auto;
    }

    .history-item-p {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg) 0;
      border-bottom: 1px solid var(--color-bg);
    }

    .history-item-p:last-child {
      border-bottom: none;
    }

    .h-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #cbd5e1;
    }

    .h-icon.full {
      background: #ecfdf5;
      color: #10b981;
    }

    .h-details {
      flex: 1;
    }

    .h-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xs);
    }

    .h-date {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-size: var(--font-size-base);
    }

    .h-hours {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: #3b82f6;
      background: #eff6ff;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
    }

    .h-row.sub {
      display: flex;
      align-items: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .h-times {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .empty-state {
      text-align: center;
      color: var(--color-text-muted);
      padding: var(--space-lg);
    }

    /* Dark mode */
    :host-context(.dark) .time-tracking-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .clock-widget,
    :host-context(.dark) .mini-tile,
    :host-context(.dark) .history-card,
    :host-context(.dark) .active-stats {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .clock-widget.active {
      background: linear-gradient(to bottom, var(--color-surface), rgba(59, 130, 246, 0.1));
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .digital-clock,
    :host-context(.dark) .a-val,
    :host-context(.dark) .mt-val,
    :host-context(.dark) .card-header h3,
    :host-context(.dark) .h-date {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .status-indicator,
    :host-context(.dark) .a-label,
    :host-context(.dark) .mt-label,
    :host-context(.dark) .h-row.sub,
    :host-context(.dark) .empty-state {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .status-indicator {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .h-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .h-icon.full {
      background: rgba(16, 185, 129, 0.2);
    }

    @media (max-width: 1024px) {
      .main-grid {
        grid-template-columns: 1fr;
      }

      .clock-widget {
        max-width: 420px;
        margin: 0 auto;
      }
    }

    @media (max-width: 768px) {
      .time-tracking-container {
        padding: var(--space-lg);
      }

      .digital-clock {
        font-size: 40px;
      }

      .active-stats {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DevTimeTrackingComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeNom = '';
  currentDate = '';
  currentTimeDisplay = '';
  timerInterval: any;
  
  isClockedIn = false;
  clockInData: any = null;
  workedHours = '0.0';
  efficiency = 92;
  
  history: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    this.startClock();
    this.loadTodayStatus();
    this.loadHistory();
  }

  startClock() {
    this.updateClock();
    this.timerInterval = setInterval(() => this.updateClock(), 1000);
  }

  updateClock() {
    const now = new Date();
    this.currentTimeDisplay = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  loadTodayStatus() {
    const user = this.api.getCurrentUser();
    if (!user) return;
    const uid = user.id || user.utilisateurId;
    
    this.api.getPointages(uid).subscribe(data => {
      console.log('Pointages reçus:', data);
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      // Trouver l'entrée d'aujourd'hui (flexible sur le format de date et le casing)
      const todayEntry = data.find((p: any) => {
        const rawDate = p.date || p.Date;
        if (!rawDate) return false;
        const pDate = typeof rawDate === 'string' ? rawDate.split('T')[0] : new Date(rawDate).toISOString().split('T')[0];
        return pDate === today;
      });
      
      if (todayEntry) {
        console.log('Entrée du jour trouvée:', todayEntry);
        this.clockInData = todayEntry;
        const hs = todayEntry.heureSortie || todayEntry.HeureSortie;
        // On est "clocked in" si on a une entrée mais pas encore de sortie
        this.isClockedIn = !hs || hs === '00:00:00' || hs === '00:00';
        
        if (todayEntry.heureEntree || todayEntry.HeureEntree) {
          this.api.getWorkedHoursReal(uid).subscribe(res => {
             this.workedHours = (res.hours || res.heuresTravaillees || 0).toFixed(1);
          });
        }
      } else {
        this.isClockedIn = false;
        this.clockInData = null;
      }
    });
  }

  loadHistory() {
    const user = this.api.getCurrentUser();
    if (!user) return;
    const uid = user.id || user.utilisateurId;
    
    this.api.getPointages(uid).subscribe(data => {
      this.history = data.sort((a: any, b: any) => {
        const dateA = new Date(a.date || a.Date).getTime();
        const dateB = new Date(b.date || b.Date).getTime();
        return dateB - dateA;
      }).slice(0, 10); // Limiter à 10 entrées
    });
  }

  clockIn() {
    const user = this.api.getCurrentUser();
    const uid = user.id || user.utilisateurId;
    this.api.clockIn(uid, user.societeId).subscribe({
      next: (res) => {
        this.snackBar.open('Pointage d\'entrée validé. Bon travail !', 'Fermer', { duration: 4000 });
        this.isClockedIn = true;
        this.loadTodayStatus();
        this.loadHistory();
      },
      error: () => {
        this.snackBar.open('Erreur lors du pointage', 'Fermer', { duration: 3000 });
      }
    });
  }

  clockOut() {
    const user = this.api.getCurrentUser();
    const uid = user.id || user.utilisateurId;
    const pointageId = this.clockInData?.id || this.clockInData?.Id;
    this.api.clockOut(uid, user.societeId, '', pointageId).subscribe({
      next: () => {
        this.snackBar.open('Pointage de sortie validé. Bonne soirée !', 'Fermer', { duration: 4000 });
        this.isClockedIn = false;
        this.loadTodayStatus();
        this.loadHistory();
      },
      error: () => {
        this.snackBar.open('Erreur lors du pointage', 'Fermer', { duration: 3000 });
      }
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }
}

