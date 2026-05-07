import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DashboardService } from '../service/dashboard.service';
import { AiService } from '@core/services/ai.service';
import { DashboardStats, Task } from '../model/dashboard.model';
import { marked } from 'marked';

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, MatSnackBarModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private aiService = inject(AiService);
  private snackBar = inject(MatSnackBar);

  userName = '';
  societeId = '';
  
  isClockedIn = false;
  currentTime = '00:00:00';
  private timer: any;

  stats: DashboardStats = { tachesAssignees: 0, enCours: 0, terminees: 0, projets: 0 };
  taches: Task[] = [];

  aiLoading = false;
  aiInsights: string | null = null;

  ngOnInit() {
    const user = this.dashboardService.getCurrentUser();
    this.userName = user?.nom || 'Développeur';
    this.societeId = this.dashboardService.getCurrentSocieteId();
    this.loadData();
    this.checkClockStatus();
    this.startClock();
  }

  loadData() {
    const userId = this.dashboardService.getCurrentUserId();
    this.dashboardService.getTachesParUtilisateur(userId).subscribe({
      next: (res: any[]) => {
        this.taches = res;
        this.stats.tachesAssignees = res.length;
        this.stats.enCours = res.filter(t => (t.statut || t.Statut) === 'In Progress').length;
        this.stats.terminees = res.filter(t => (t.statut || t.Statut) === 'Done' || (t.statut || t.Statut) === 'Terminée').length;
        
        const projIds = new Set(res.map(t => t.projetId || t.ProjetId));
        this.stats.projets = projIds.size;
      }
    });
  }

  checkClockStatus() {
    const userId = this.dashboardService.getCurrentUserId();
    this.dashboardService.getPointageAujourdhui(userId).subscribe(p => {
      this.isClockedIn = !!(p && !p.heureSortie && !p.HeureSortie);
    });
  }

  toggleClock() {
    const userId = this.dashboardService.getCurrentUserId();
    if (this.isClockedIn) {
      this.dashboardService.pointerSortie(userId).subscribe(() => {
        this.isClockedIn = false;
        this.snackBar.open('Session terminée. Bon repos !', 'OK', { duration: 3000 });
      });
    } else {
      this.dashboardService.pointerEntree(userId).subscribe(() => {
        this.isClockedIn = true;
        this.snackBar.open('Session démarrée. Bon code !', 'OK', { duration: 3000 });
      });
    }
  }

  startClock() {
    this.timer = setInterval(() => {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString();
    }, 1000);
  }

  signalBlockage() {
    this.snackBar.open('Signal de blocage envoyé au Chef de Projet.', 'Fermer', { duration: 3000 });
    const user = this.dashboardService.getCurrentUser();
    this.dashboardService.createNotification(this.societeId, 'warning', 'ALERTE BLOCAGE', `Développeur ${user?.nom} signale un blocage critique.`).subscribe();
  }

  async analyserTaches() {
    this.aiLoading = true;
    this.aiInsights = null;

    const context = `
      Utilisateur: ${this.userName}
      Tâches assignées: ${this.stats.tachesAssignees}
      En cours: ${this.stats.enCours}
      Tâches list: ${this.taches.map(t => t.titre + ' (' + t.priorite + ')').join(', ')}
    `;

    const prompt = `En tant que coach de productivité technique, analyse mes tâches et propose un plan d'action optimisé pour ma journée. Utilise le format Markdown.`;

    try {
      const res = await this.aiService.generateResponse(prompt, context).toPromise();
      this.aiInsights = String(marked.parse(res || "Désolé, l'analyse a échoué."));
    } catch (e) {
      this.aiInsights = "Une erreur est survenue lors de l'analyse.";
    } finally {
      this.aiLoading = false;
    }
  }
}
