import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';
import { NotificationService } from '@core/services/notification.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-pointage-clock',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './pointage-clock.component.html',
  styleUrls: ['./pointage-clock.component.scss']
})
export class PointageClockComponent implements OnInit, OnDestroy {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  today = new Date();
  currentTime = signal('');
  isClockedIn = signal(false);
  sessionStart = signal<Date | null>(null);
  sessionDuration = signal('00:00:00');
  lastPointage = signal<any>(null);

  private timerSub?: Subscription;

  ngOnInit() {
    this.startClock();
    this.checkCurrentStatus();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  private startClock() {
    this.timerSub = interval(1000).subscribe(() => {
      const now = new Date();
      this.currentTime.set(now.toLocaleTimeString('fr-FR'));
      
      if (this.isClockedIn() && this.sessionStart()) {
        const diff = Math.floor((now.getTime() - this.sessionStart()!.getTime()) / 1000);
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        this.sessionDuration.set(
          `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        );
      }
    });
  }

  private checkCurrentStatus() {
    const user = this.auth.currentUser();
    if (!user) return;

    this.api.search('pointage', { utilisateurId: user.id, date: new Date().toISOString().split('T')[0] }).subscribe((res: any) => {
      const todayPointages = res || [];
      if (todayPointages.length > 0) {
        const last = todayPointages[todayPointages.length - 1];
        this.lastPointage.set(last);
        if (!last.heureSortie) {
          this.isClockedIn.set(true);
          // Reconstruire l'heure de début
          const [h, m, s] = last.heureEntree.split(':');
          const startDate = new Date();
          startDate.setHours(+h, +m, +s);
          this.sessionStart.set(startDate);
        }
      }
    });
  }

  clockIn() {
    const user = this.auth.currentUser();
    const now = new Date();
    const payload = {
      utilisateurId: user?.id,
      societeId: user?.societeId,
      date: now.toISOString().split('T')[0],
      heureEntree: now.toLocaleTimeString('fr-FR', { hour12: false }),
      typePointageId: 'NORMAL',
      actif: true
    };

    this.api.ajouterOuModifier('pointage', payload).subscribe(() => {
      this.isClockedIn.set(true);
      this.sessionStart.set(now);
      this.notify.showToast('Pointage entrée enregistré', 'success');
      this.checkCurrentStatus();
    });
  }

  clockOut() {
    const pointage = this.lastPointage();
    if (!pointage) return;

    const now = new Date();
    const update = {
      ...pointage,
      heureSortie: now.toLocaleTimeString('fr-FR', { hour12: false })
    };

    this.api.ajouterOuModifier('pointage', update).subscribe(() => {
      this.isClockedIn.set(false);
      this.sessionStart.set(null);
      this.notify.showToast('Pointage sortie enregistré', 'success');
      this.checkCurrentStatus();
    });
  }
}
