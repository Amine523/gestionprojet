import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Focus Développeur
          </h1>
          <p class="text-muted mb-0">{{societeNom}} • Centre de commandement technique</p>
        </div>
        <div class="d-flex gap-2">
          <div class="d-flex align-items-center gap-2 px-3 py-2 rounded-pill border" *ngIf="isTimerActive">
            <i class="bi bi-stopwatch text-primary" style="animation: pulse-icon 2s infinite;"></i>
            <span class="fw-bold">{{formattedTime}}</span>
            <button class="btn btn-sm btn-outline-danger" (click)="stopTimer()">
              <i class="bi bi-stop-circle"></i>
            </button>
          </div>
          <button class="btn btn-danger" (click)="signalBlockage()">
            <i class="bi bi-exclamation-triangle me-1"></i> Signaler Blocage
          </button>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        <a routerLink="/dev/taches" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #3b82f6; cursor: pointer;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(59, 130, 246, 0.1); color: #3b82f6;">
                <i class="bi bi-clipboard-check" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Assignées</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.tachesAssignees}}</h2>
              </div>
            </div>
          </div>
        </a>

        <a routerLink="/dev/taches" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #0ea5e9; cursor: pointer; animation: pulse-blue 2s infinite;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(14, 165, 233, 0.1); color: #0ea5e9;">
                <i class="bi bi-hourglass-split" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">En Cours</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.enCours}}</h2>
              </div>
            </div>
          </div>
        </a>

        <a routerLink="/dev/taches" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #16a34a; cursor: pointer;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(22, 163, 74, 0.1); color: #16a34a;">
                <i class="bi bi-check-circle" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Terminées</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.terminees}}</h2>
              </div>
            </div>
          </div>
        </a>

        <a routerLink="/dev/taches" class="col-lg-3 col-md-6 text-decoration-none">
          <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #ef4444; cursor: pointer; animation: pulse-red 2s infinite;">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(239, 68, 68, 0.1); color: #ef4444;">
                <i class="bi bi-clock" style="font-size: 24px;"></i>
              </div>
              <div>
                <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">Urgences</div>
                <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stats.deadlinesProches}}</h2>
              </div>
            </div>
          </div>
        </a>
      </div>

      <!-- Kanban Board -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-kanban text-primary"></i>
              <h5 class="fw-bold mb-0">Tableau Kanban (Mes Tâches)</h5>
            </div>
            <span class="badge bg-light text-secondary">Sprint Actuel: Nadhemni-Alpha</span>
          </div>
          <div class="row g-3">
            <!-- À FAIRE -->
            <div class="col-md-4">
              <div class="bg-light rounded-3 p-3" style="min-height: 400px;">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 class="fw-bold mb-0 text-primary">À FAIRE</h6>
                  <span class="badge bg-primary rounded-pill">{{kanban.todo.length}}</span>
                </div>
                <div class="d-flex flex-column gap-2">
                  @for (t of kanban.todo; track t.id) {
                    <div class="card border-0 shadow-sm p-3 cursor-pointer" (click)="startTask(t)" style="transition: transform 0.2s;">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-secondary rounded-pill" style="font-size: 10px;">#{{t.id.slice(-4)}}</span>
                        <span class="badge" [class.bg-danger]="t.priorite === 'High'" [class.bg-warning]="t.priorite === 'Medium'" [class.bg-info]="t.priorite === 'Low'" style="font-size: 10px;">{{t.priorite}}</span>
                      </div>
                      <div class="fw-bold" style="font-size: 13px;">{{t.nom || t.titre}}</div>
                      <div class="text-muted" style="font-size: 11px; margin-top: 8px;">
                        <i class="bi bi-calendar"></i> {{t.dateEcheance | date:'shortDate'}}
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- EN COURS -->
            <div class="col-md-4">
              <div class="bg-light rounded-3 p-3" style="min-height: 400px;">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 class="fw-bold mb-0 text-primary">EN COURS</h6>
                  <span class="badge bg-primary rounded-pill">{{kanban.inprogress.length}}</span>
                </div>
                <div class="d-flex flex-column gap-2">
                  @for (t of kanban.inprogress; track t.id) {
                    <div class="card border-0 shadow-sm p-3 border-start border-4 border-primary">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-secondary rounded-pill" style="font-size: 10px;">#{{t.id.slice(-4)}}</span>
                        <span class="badge" [class.bg-danger]="t.priorite === 'High'" [class.bg-warning]="t.priorite === 'Medium'" [class.bg-info]="t.priorite === 'Low'" style="font-size: 10px;">{{t.priorite}}</span>
                      </div>
                      <div class="fw-bold" style="font-size: 13px;">{{t.nom || t.titre}}</div>
                      <div class="progress mt-3" style="height: 6px;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 60%;"></div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- TERMINÉ -->
            <div class="col-md-4">
              <div class="bg-light rounded-3 p-3" style="min-height: 400px;">
                <div class="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h6 class="fw-bold mb-0 text-primary">TERMINÉ</h6>
                  <span class="badge bg-primary rounded-pill">{{kanban.done.length}}</span>
                </div>
                <div class="d-flex flex-column gap-2">
                  @for (t of kanban.done; track t.id) {
                    <div class="card border-0 shadow-sm p-3 bg-success-subtle">
                      <div class="d-flex justify-content-between mb-2">
                        <span class="badge bg-secondary rounded-pill" style="font-size: 10px;">#{{t.id.slice(-4)}}</span>
                        <i class="bi bi-check-circle text-success"></i>
                      </div>
                      <div class="fw-bold" style="font-size: 13px;">{{t.nom || t.titre}}</div>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress & Bottom Widgets -->
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <h5 class="fw-bold mb-4">Progression</h5>
              <div class="position-relative d-flex justify-content-center" style="height: 160px;">
                <svg viewBox="0 0 36 36" class="circular-chart" style="width: 160px; height: 160px;">
                  <path class="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#f1f5f9" stroke-width="2.5" fill="none"/>
                  <path class="circle" [attr.stroke-dasharray]="stats.progression + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke="#0284c7" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  <text x="18" y="20.35" class="percentage" fill="#1e293b" font-size="0.5em" font-weight="800" text-anchor="middle">{{stats.progression}}%</text>
                </svg>
              </div>
              <p class="text-muted mt-3 mb-0" style="font-size: 13px;">{{stats.terminees}} / {{stats.tachesAssignees}} complétées</p>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-clock-history text-primary"></i>
                <h5 class="fw-bold mb-0">Journal d'activité</h5>
              </div>
              <div class="d-flex flex-column gap-3" style="max-height: 200px; overflow-y: auto;">
                @for (activity of activities; track activity.id) {
                  <div class="d-flex align-items-center gap-3 p-2 rounded-2" style="background: #f8fafc;">
                    <div class="rounded-2 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background: #f1f5f9; color: #64748b;">
                      <i class="bi bi-{{activity.icon}}" style="font-size: 16px;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 13px;">{{activity.texte}}</div>
                      <div class="text-muted" style="font-size: 10px;">{{activity.heure}}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4">
              <div class="d-flex align-items-center gap-2 mb-4">
                <i class="bi bi-bell text-primary"></i>
                <h5 class="fw-bold mb-0">Alertes Directes</h5>
              </div>
              <div class="d-flex flex-column gap-3" style="max-height: 200px; overflow-y: auto;">
                @for (notif of notifications; track notif.id) {
                  <div class="d-flex align-items-center gap-3 p-2 rounded-2" [class.bg-primary-subtle]="!notif.lu">
                    <i class="bi bi-{{notif.icon}} text-primary" style="font-size: 20px;"></i>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 13px;">{{notif.texte}}</div>
                      <div class="text-muted" style="font-size: 10px;">{{notif.heure}}</div>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-blue {
      0% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(14, 165, 233, 0); }
      100% { box-shadow: 0 0 0 0 rgba(14, 165, 233, 0); }
    }

    @keyframes pulse-red {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @keyframes pulse-icon {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .circular-chart:hover .circle {
      transition: stroke-dasharray 1s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class DevDashboardComponent implements OnInit {
  private api = inject(ApiService);
  
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
      }
    });

    this.api.getNotifications().subscribe({
      next: (notifications) => {
        this.notifications = (notifications || []).slice(0, 5).map((n: any) => ({
          ...n,
          icon: n.type === 'test' ? 'assignment' : n.type === 'bug' ? 'bug_report' : 'info'
        }));
        this.unreadCount = this.notifications.filter((n: any) => !n.lu).length;
      }
    });
  }

  startTask(task: any) {
    if (this.isTimerActive) {
      alert('Terminez votre tâche actuelle d\'abord.');
      return;
    }
    this.isTimerActive = true;
    this.seconds = 0;
    this.timerInterval = setInterval(() => {
      this.seconds++;
      this.updateFormattedTime();
    }, 1000);
    alert(`Session démarrée: ${(task as any).nom || (task as any).titre}`);
  }

  stopTimer() {
    clearInterval(this.timerInterval);
    this.isTimerActive = false;
    alert(`Session terminée! Temps total: ${this.formattedTime}`);
    this.formattedTime = '00:00:00';
  }

  private updateFormattedTime() {
    const h = Math.floor(this.seconds / 3600);
    const m = Math.floor((this.seconds % 3600) / 60);
    const s = this.seconds % 60;
    this.formattedTime = [h, m, s].map(v => v < 10 ? '0' + v : v).join(':');
  }

  signalBlockage() {
    alert('Signal de blocage envoyé au Chef de Projet.');
    const user = this.api.getCurrentUser();
    this.api.createNotification(this.societeId, 'warning', 'ALERTE BLOCAGE', `Développeur ${user?.nom} signale un blocage critique.`);
  }
}
