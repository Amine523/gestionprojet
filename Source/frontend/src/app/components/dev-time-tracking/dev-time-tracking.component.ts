import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-time-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule, MatTooltipModule],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Présence & Activité</h1>
          <p class="subtitle">{{societeNom}} • {{currentDate}}</p>
        </div>
      </div>

      <div class="main-grid">
        <div class="left-col">
          <div class="premium-card clock-widget shadow-premium" [class.active]="isClockedIn">
             <div class="clock-content">
                <div class="status-indicator">
                   <span class="status-dot" [class.online]="isClockedIn"></span>
                   {{isClockedIn ? 'EN POSTE' : 'HORS LIGNE'}}
                </div>
                <div class="digital-clock">{{currentTimeDisplay}}</div>
                
                @if (!isClockedIn) {
                   <button mat-flat-button class="clock-btn clock-in-btn" (click)="clockIn()">
                      <mat-icon>login</mat-icon> Pointer l'Arrivée
                   </button>
                } @else {
                   <div class="active-stats">
                      <div class="a-stat">
                         <span class="a-label">Début à</span>
                         <span class="a-val">{{clockInData?.heureDebut}}</span>
                      </div>
                      <div class="a-stat">
                         <span class="a-label">Cumul Jour</span>
                         <span class="a-val text-primary">{{workedHours}}h</span>
                      </div>
                   </div>
                   <button mat-flat-button class="clock-btn clock-out-btn" (click)="clockOut()">
                      <mat-icon>logout</mat-icon> Pointer le Départ
                   </button>
                }
             </div>
          </div>

          <div class="premium-card stats-mini-grid">
             <div class="mini-tile indigo">
                <mat-icon>schedule</mat-icon>
                <div class="mt-info">
                   <span class="mt-val">40h</span>
                   <span class="mt-label">Objectif Semaine</span>
                </div>
             </div>
             <div class="mini-tile emerald">
                <mat-icon>trending_up</mat-icon>
                <div class="mt-info">
                   <span class="mt-val">{{efficiency}}%</span>
                   <span class="mt-label">Productivité</span>
                </div>
             </div>
          </div>
        </div>

        <div class="right-col">
          <div class="premium-card history-card shadow-premium">
             <div class="card-header">
                <h3><mat-icon>history</mat-icon> Historique de Pointage</h3>
             </div>
             <div class="history-list custom-scroll">
                @for (p of history; track p.id) {
                   <div class="history-item-p">
                      <div class="h-icon" [class.full]="p.heureFin">
                         <mat-icon>{{p.heureFin ? 'verified' : 'timer'}}</mat-icon>
                      </div>
                      <div class="h-details">
                         <div class="h-row">
                            <span class="h-date">{{p.date | date:'dd MMMM yyyy'}}</span>
                            <span class="h-hours" *ngIf="p.heuresTravaillees">{{p.heuresTravaillees}}h travaillées</span>
                         </div>
                         <div class="h-row sub">
                            <span class="h-times">
                               <mat-icon>login</mat-icon> {{p.heureDebut}} 
                               <mat-icon *ngIf="p.heureFin">logout</mat-icon> {{p.heureFin || '...'}}
                            </span>
                         </div>
                      </div>
                   </div>
                } @empty {
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
    .container { padding: 40px; max-width: 1400px; margin: 0 auto; background: #f8fafc; min-height: 100vh; }
    .page-header { margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 15px; margin: 8px 0 0; font-weight: 500; }

    .main-grid { display: grid; grid-template-columns: 420px 1fr; gap: 32px; align-items: start; }
    
    .clock-widget { 
      padding: 48px 32px; text-align: center; background: white; border-radius: 32px; 
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid #f1f5f9;
    }
    .clock-widget.active { border-color: #3b82f6; background: linear-gradient(to bottom, #ffffff, #f0f7ff); }
    
    .status-indicator { 
      display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; 
      background: #f1f5f9; border-radius: 20px; font-size: 11px; font-weight: 800; color: #64748b; margin-bottom: 32px;
    }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; }
    .status-dot.online { background: #10b981; box-shadow: 0 0 10px #10b981; animation: pulse-green 2s infinite; }
    @keyframes pulse-green { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }

    .digital-clock { font-family: 'JetBrains Mono', monospace; font-size: 56px; font-weight: 800; color: #1e293b; margin-bottom: 40px; letter-spacing: -2px; }
    
    .clock-btn { 
      width: 100%; height: 64px; border-radius: 20px; font-size: 16px; font-weight: 700; 
      display: flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.3s;
    }
    .clock-in-btn { background: #1e293b; color: white; }
    .clock-in-btn:hover { background: #0f172a; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
    .clock-out-btn { background: #fef2f2; color: #dc2626; border: 1px solid #fee2e2; }
    .clock-out-btn:hover { background: #dc2626; color: white; }

    .active-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px; padding: 24px; background: white; border-radius: 20px; border: 1px solid #e2e8f0; }
    .a-stat { display: flex; flex-direction: column; text-align: left; }
    .a-label { font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
    .a-val { font-size: 20px; font-weight: 800; color: #1e293b; }

    .stats-mini-grid { margin-top: 24px; padding: 24px !important; display: grid; grid-template-rows: 1fr 1fr; gap: 16px; background: transparent; box-shadow: none !important; border: none; }
    .mini-tile { background: white; padding: 20px; border-radius: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid #f1f5f9; }
    .mini-tile mat-icon { font-size: 28px; width: 28px; height: 28px; }
    .mini-tile.indigo mat-icon { color: #6366f1; }
    .mini-tile.emerald mat-icon { color: #10b981; }
    .mt-val { font-size: 18px; font-weight: 800; color: #1e293b; display: block; }
    .mt-label { font-size: 12px; font-weight: 600; color: #64748b; }

    .history-card { background: white; border-radius: 32px; overflow: hidden; height: 100%; border: 1px solid #f1f5f9; }
    .card-header { padding: 32px; border-bottom: 1px solid #f1f5f9; }
    .card-header h3 { margin: 0; font-size: 18px; font-weight: 800; color: #1e293b; display: flex; align-items: center; gap: 12px; }
    .card-header mat-icon { color: #3b82f6; }

    .history-list { padding: 20px 32px; max-height: 600px; overflow-y: auto; }
    .history-item-p { display: flex; align-items: center; gap: 20px; padding: 24px 0; border-bottom: 1px solid #f8fafc; }
    .history-item-p:last-child { border-bottom: none; }
    
    .h-icon { width: 48px; height: 48px; border-radius: 14px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #cbd5e1; }
    .h-icon.full { background: #ecfdf5; color: #10b981; }
    .h-details { flex: 1; }
    .h-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
    .h-date { font-weight: 700; color: #1e293b; font-size: 15px; }
    .h-hours { font-size: 13px; font-weight: 800; color: #3b82f6; background: #eff6ff; padding: 4px 10px; border-radius: 6px; }
    .h-row.sub { display: flex; align-items: center; color: #94a3b8; font-size: 13px; font-weight: 500; }
    .h-times { display: flex; align-items: center; gap: 8px; }
    .h-times mat-icon { font-size: 14px; width: 14px; height: 14px; }
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
    this.api.getPointages(user.id).subscribe(data => {
      const today = new Date().toISOString().split('T')[0];
      const todayEntry = data.find((p: any) => p.date?.split('T')[0] === today);
      
      if (todayEntry) {
        this.clockInData = todayEntry;
        this.isClockedIn = !todayEntry.heureFin;
        
        if (todayEntry.heureDebut) {
          this.api.getWorkedHoursReal(user.id).subscribe(res => {
             this.workedHours = res.heuresTravaillees.toFixed(1);
          });
        }
      }
    });
  }

  loadHistory() {
    const user = this.api.getCurrentUser();
    this.api.getPointages(user.id).subscribe(data => {
      this.history = data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });
  }

  clockIn() {
    const user = this.api.getCurrentUser();
    this.api.clockIn(user.id, user.societeId).subscribe({
      next: (res) => {
        this.snackBar.open('Pointage d\'entrée validé. Bon travail !', 'Fermer', { duration: 4000 });
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
    this.api.clockOut(user.id, user.societeId).subscribe({
      next: () => {
        this.snackBar.open('Pointage de sortie validé. Bonne soirée !', 'Fermer', { duration: 4000 });
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
