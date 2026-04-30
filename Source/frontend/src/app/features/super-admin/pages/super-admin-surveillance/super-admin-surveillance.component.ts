import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';

interface SurveillanceData {
  utilisateursActifs: number;
  connexionsTempsReel: number;
  requetesApiMinute: number;
  notificationsRecues: number;
  alerts: number;
  cpu: number;
  memoire: number;
}

@Component({
  selector: 'app-super-admin-surveillance',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './super-admin-surveillance.component.html',
  styleUrls: ['./super-admin-surveillance.component.scss']
})
export class SuperAdminSurveillanceComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private intervalSub: any;
  
  data: SurveillanceData = { utilisateursActifs: 24, connexionsTempsReel: 18, requetesApiMinute: 156, notificationsRecues: 42, alerts: 0, cpu: 45, memoire: 62 };
  activities = [
    { id: 1, time: '16:23:30', action: 'Connexion utilisateur SOC_TN001_ADM', ip: '196.216.84.12' },
    { id: 2, time: '16:23:15', action: 'API /api/projets appelée', ip: '196.216.85.10' },
    { id: 3, time: '16:23:00', action: 'Notification envoyée', ip: '196.216.86.12' },
    { id: 4, time: '16:22:45', action: 'Modification rôle SuperAdmin', ip: '196.216.84.12' },
    { id: 5, time: '16:22:30', action: 'Sauvegarde DB réussie', ip: 'internal' },
  ];

  ngOnInit() {
    this.intervalSub = setInterval(() => {
      this.data.utilisateursActifs = Math.floor(Math.random() * 10) + 20;
      this.data.requetesApiMinute = Math.floor(Math.random() * 50) + 140;
      this.data.cpu = Math.floor(Math.random() * 30) + 35;
      this.data.memoire = Math.floor(Math.random() * 10) + 55;
    }, 3000);
  }

  ngOnDestroy() { if (this.intervalSub) clearInterval(this.intervalSub); }
}
