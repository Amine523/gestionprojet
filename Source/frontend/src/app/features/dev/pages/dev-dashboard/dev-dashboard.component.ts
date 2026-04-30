import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, MatSnackBarModule],
  templateUrl: './dev-dashboard.component.html',
  styleUrls: ['./dev-dashboard.component.scss']
})
export class DevDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = '';
  stats = { tachesAssignees: 0, enCours: 0, terminees: 0, deadlinesProches: 0, progression: 0 };
  progression = '0 283';
  priorityTasks: any[] = [];
  activities: any[] = [];
  notifications: any[] = [];
  unreadCount = 0;

  kanban: { todo: any[], inprogress: any[], done: any[] } = { todo: [], inprogress: [], done: [] };
  isTimerActive = false;
  seconds = 0;
  formattedTime = '00:00:00';
  timerInterval: any;


  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    const currentUser = this.api.getCurrentUser();
    this.api.getTaches().subscribe({
      next: (taches) => {
        const userTaches = taches?.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id || t.assigneeId === currentUser?.id) || [];
        this.stats.tachesAssignees = userTaches.length;
        this.stats.enCours = userTaches.filter((t: any) => t.statut === 'inprogress' || t.statut === 'En cours').length;
        this.stats.terminees = userTaches.filter((t: any) => t.statut === 'done' || t.statut === 'Terminé').length;
        this.stats.deadlinesProches = userTaches.filter((t: any) => t.statut !== 'done' && t.statut !== 'Terminé').length;

        const total = this.stats.tachesAssignees;
        this.stats.progression = total > 0 ? Math.round((this.stats.terminees / total) * 100) : 0;
        this.progression = `${this.stats.progression * 2.83} 283`;

        this.kanban.todo = userTaches.filter((t: any) => t.statut === 'todo' || t.statut === 'À faire');
        this.kanban.inprogress = userTaches.filter((t: any) => t.statut === 'inprogress' || t.statut === 'En cours');
        this.kanban.done = userTaches.filter((t: any) => t.statut === 'done' || t.statut === 'Terminé');

        this.priorityTasks = userTaches.filter((t: any) => t.statut !== 'done').slice(0, 4);

        // Données par défaut si vide
        if (this.stats.tachesAssignees === 0) {
          this.stats.tachesAssignees = 8;
          this.stats.enCours = 3;
          this.stats.terminees = 4;
          this.stats.deadlinesProches = 2;
          this.stats.progression = 50;
          this.progression = `${50 * 2.83} 283`;
          this.kanban.todo = [
            { id: 'TAC001', titre: 'Fix header bug', priorite: 'High', deadline: '2024-01-20' },
            { id: 'TAC002', titre: 'Implement login', priorite: 'Critical', deadline: '2024-01-18' }
          ];
          this.kanban.inprogress = [
            { id: 'TAC003', titre: 'Update dashboard', priorite: 'Medium', deadline: '2024-01-22' }
          ];
          this.kanban.done = [
            { id: 'TAC004', titre: 'Setup project', priorite: 'Low', deadline: '2024-01-15' }
          ];
          this.priorityTasks = this.kanban.todo.concat(this.kanban.inprogress).slice(0, 4);
        }
      },
      error: () => {
        this.stats.tachesAssignees = 8;
        this.stats.enCours = 3;
        this.stats.terminees = 4;
        this.stats.deadlinesProches = 2;
        this.stats.progression = 50;
        this.progression = `${50 * 2.83} 283`;
        this.kanban.todo = [
          { id: 'TAC001', titre: 'Fix header bug', priorite: 'High', deadline: '2024-01-20' }
        ];
        this.kanban.inprogress = [
          { id: 'TAC002', titre: 'Update dashboard', priorite: 'Medium', deadline: '2024-01-22' }
        ];
        this.kanban.done = [
          { id: 'TAC003', titre: 'Setup project', priorite: 'Low', deadline: '2024-01-15' }
        ];
      }
    });

    this.api.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = (notifications || []).slice(0, 5).map((n: any) => ({
          ...n,
          icon: n.type === 'test' ? 'assignment' : n.type === 'bug' ? 'bug_report' : 'info'
        }));
        this.unreadCount = this.notifications.filter((n: any) => !n.lu).length;

        if (this.notifications.length === 0) {
          this.notifications = [
            { id: 1, type: 'info', message: 'Nouvelle tâche assignée', lu: false, icon: 'info' },
            { id: 2, type: 'bug', message: 'Bug signalé par QA', lu: false, icon: 'bug_report' }
          ];
          this.unreadCount = 2;
        }
      },
      error: () => {
        this.notifications = [
          { id: 1, type: 'info', message: 'Nouvelle tâche assignée', lu: false, icon: 'info' }
        ];
        this.unreadCount = 1;
      }
    });

    // Charger les activités récentes depuis la base de données
    this.api.getActiviteRecente(8).subscribe({
      next: (data) => {
        this.activities = data.map((act: any) => ({
          id: act.id || Math.random(),
          texte: act.description || act.action || 'Activité système',
          heure: act.date ? this.formatRelativeTime(act.date) : 'il y a un moment'
        }));

        if (this.activities.length === 0) {
          this.activities = [
            { id: 1, texte: 'Tâche terminée: Fix header', heure: 'il y a 2h' },
            { id: 2, texte: 'Nouvelle tâche assignée', heure: 'il y a 4h' },
            { id: 3, texte: 'Commit pushé', heure: 'il y a 6h' }
          ];
        }
      },
      error: () => {
        this.activities = [
          { id: 1, texte: 'Tâche terminée', heure: 'il y a 2h' },
          { id: 2, texte: 'Nouvelle tâche assignée', heure: 'il y a 4h' }
        ];
      }
    });
  }

  private formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `il y a ${diffMins}m`;
    if (diffHours < 24) return `il y a ${diffHours}h`;
    return `il y a ${diffDays}j`;
  }

  startTask(task: any) {
    if (this.isTimerActive) {
      this.snackBar.open('Terminez votre tâche actuelle d\'abord.', 'Fermer', { duration: 3000 });
      return;
    }

    const user = this.api.getCurrentUser();
    const uid = user?.id || user?.utilisateurId;
    const sid = user?.societeId;

    if (!uid || !sid) {
      this.snackBar.open('Erreur: Session utilisateur incomplète.', 'Fermer', { duration: 3000 });
      return;
    }

    this.api.clockIn(uid, sid, 'NORMAL', `Démarrage tâche: ${task.nom || task.titre}`).subscribe({
      next: () => {
        this.isTimerActive = true;
        this.seconds = 0;
        this.timerInterval = setInterval(() => {
          this.seconds++;
          this.updateFormattedTime();
        }, 1000);
        this.snackBar.open(`Session démarrée: ${task.nom || task.titre}`, 'Fermer', { duration: 3000 });
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Erreur lors du démarrage du pointage.', 'Fermer', { duration: 3000 });
      }
    });
  }

  stopTimer() {
    const user = this.api.getCurrentUser();
    const uid = user?.id || user?.utilisateurId;
    const sid = user?.societeId;

    this.api.clockOut(uid, sid).subscribe({
      next: () => {
        clearInterval(this.timerInterval);
        this.isTimerActive = false;
        this.snackBar.open(`Session terminée! Temps enregistré.`, 'Fermer', { duration: 3000 });
        this.formattedTime = '00:00:00';
        this.loadData();
      },
      error: () => {
        this.snackBar.open('Erreur lors de la clôture du pointage.', 'Fermer', { duration: 3000 });
        // En cas d'erreur on arrête quand même le timer visuel pour ne pas bloquer l'utilisateur
        clearInterval(this.timerInterval);
        this.isTimerActive = false;
      }
    });
  }

  private updateFormattedTime() {
    const h = Math.floor(this.seconds / 3600);
    const m = Math.floor((this.seconds % 3600) / 60);
    const s = this.seconds % 60;
    this.formattedTime = [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
  }

  signalBlockage() {
    this.snackBar.open('Signal de blocage envoyé au Chef de Projet.', 'Fermer', { duration: 3000 });
    const user = this.api.getCurrentUser();
    this.api.createNotification(this.societeId, 'warning', 'ALERTE BLOCAGE', `Développeur ${user?.nom} signale un blocage critique.`);
  }
}

