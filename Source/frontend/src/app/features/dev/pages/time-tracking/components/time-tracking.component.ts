import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TimeTrackingService } from '../service/time-tracking.service';
import { Pointage } from '../model/time-tracking.model';

@Component({
  selector: 'app-time-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './time-tracking.component.html',
  styleUrls: ['./time-tracking.component.scss']
})
export class TimeTrackingComponent implements OnInit, OnDestroy {
  private timeTrackingService = inject(TimeTrackingService);
  private snackBar = inject(MatSnackBar);
  
  societeNom = '';
  currentDate = '';
  currentTimeDisplay = '';
  timerInterval: any;
  refreshInterval: any;
  
  isClockedIn = false;
  clockInData: Pointage | null = null;
  workedHours = '0.0';
  efficiency = 92;
  
  history: Pointage[] = [];

  ngOnInit() {
    const user = this.timeTrackingService.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentDate = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    
    this.startClock();
    this.loadTodayStatus();
    this.loadHistory();

    // Refresh worked hours every minute
    this.refreshInterval = setInterval(() => this.loadTodayStatus(), 60000);
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
    const uid = this.timeTrackingService.getCurrentUserId();
    if (!uid) return;
    
    this.timeTrackingService.getPointages(uid).subscribe(data => {
      const now = new Date();
      const today = now.toISOString().split('T')[0];
      
      const todayEntry = data.find((p: any) => {
        const rawDate = p.date || p.Date;
        if (!rawDate) return false;
        const pDate = typeof rawDate === 'string' ? rawDate.split('T')[0] : new Date(rawDate).toISOString().split('T')[0];
        return pDate === today;
      });
      
      if (todayEntry) {
        this.clockInData = todayEntry;
        const hs = todayEntry.heureSortie || todayEntry.heureSortie;
        this.isClockedIn = !hs || hs === '00:00:00' || hs === '00:00';
        
        if (todayEntry.heureEntree || todayEntry.heureEntree) {
          this.timeTrackingService.getWorkedHoursReal(uid).subscribe(res => {
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
    const uid = this.timeTrackingService.getCurrentUserId();
    if (!uid) return;
    
    this.timeTrackingService.getPointages(uid).subscribe(data => {
      this.history = data.sort((a: any, b: any) => {
        const dateA = (a.date || a.Date).split('T')[0];
        const dateB = (b.date || b.Date).split('T')[0];
        
        if (dateA !== dateB) {
          return dateB.localeCompare(dateA);
        }
        
        // If same day, sort by arrival time
        const timeA = a.heureEntree || a.HeureEntree || '00:00:00';
        const timeB = b.heureEntree || b.HeureEntree || '00:00:00';
        return timeB.localeCompare(timeA);
      }).slice(0, 10);
    });
  }

  clockIn() {
    const user = this.timeTrackingService.getCurrentUser();
    const uid = this.timeTrackingService.getCurrentUserId();
    const societeId = this.timeTrackingService.getCurrentSocieteId();
    
    this.timeTrackingService.clockIn(uid, societeId).subscribe({
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
    const user = this.timeTrackingService.getCurrentUser();
    const uid = this.timeTrackingService.getCurrentUserId();
    const societeId = this.timeTrackingService.getCurrentSocieteId();
    const pointageId = this.clockInData?.id || this.clockInData?.id;
    
    this.timeTrackingService.clockOut(uid, societeId, '', pointageId).subscribe({
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
    if (this.refreshInterval) clearInterval(this.refreshInterval);
  }
}
