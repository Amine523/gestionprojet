import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-dev-time-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-time-tracking.component.html',
  styleUrls: ['./dev-time-tracking.component.scss']
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

