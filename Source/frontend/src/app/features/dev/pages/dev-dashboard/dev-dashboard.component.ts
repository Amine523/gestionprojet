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
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Hub d'Ingénierie v5.2</span>
            @if (isTimerActive) {
              <span class="badge badge-danger">
                <span class="status-dot"></span>
                Session Active: {{formattedTime}}
              </span>
            }
          </div>
          <h1 class="header-title">
            COMMANDE <span class="gradient-text">CODE</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • Focus sur les livrables, les sprints actifs et la vélocité technique.
          </p>
        </div>
        <div class="header-actions">
          @if (isTimerActive) {
            <button (click)="stopTimer()" class="btn btn-danger">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="6" y="4" width="4" height="16"/>
                <rect x="14" y="4" width="4" height="16"/>
              </svg>
              Arrêter Session
            </button>
          }
          <button (click)="signalBlockage()" class="btn btn-ghost btn-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            Signaler Blocage
          </button>
        </div>
      </header>

      <!-- Critical Metrics Grid -->
      <div class="metrics-grid">
        <app-metric-card
          title="TÂCHES ASSIGNÉES"
          [value]="stats.tachesAssignees.toString()"
          icon="bi-clipboard-check"
          color="indigo"
          [trend]="'+2 Nouvelles'"
          [isPositive]="true">
        </app-metric-card>

        <app-metric-card
          title="EN COURS"
          [value]="stats.enCours.toString()"
          icon="bi-hourglass-split"
          color="sky"
          [trend]="'Focus Actuel'"
          [isPositive]="true">
        </app-metric-card>

        <app-metric-card
          title="TERMINÉES"
          [value]="stats.terminees.toString()"
          icon="bi-check-circle-fill"
          color="emerald"
          [trend]="stats.progression + '% Prêtes'"
          [isPositive]="true">
        </app-metric-card>

        <app-metric-card
          title="DÉLAIS"
          [value]="stats.deadlinesProches.toString()"
          icon="bi-clock-fill"
          color="rose"
          [trend]="'Chemin Critique'"
          [isPositive]="false">
        </app-metric-card>
      </div>

      <!-- Kanban View -->
      <div class="card">
        <div class="card-header">
          <h3>Kanban du Sprint</h3>
          <span class="badge badge-gray">Cycle de développement actif</span>
        </div>
        <div class="kanban-board">
          <!-- TODO -->
          <div class="kanban-column">
            <div class="kanban-header">
              <span class="column-title">À faire</span>
              <span class="column-count">{{kanban.todo.length}}</span>
            </div>
            <div class="kanban-list">
              @for (t of kanban.todo; track t.id) {
                <div (click)="startTask(t)" class="kanban-item">
                  <div class="kanban-item-header">
                    <span class="task-id">#{{(t.id?.toString() || '').slice(-4)}}</span>
                    <span class="task-priority">{{t.priorite}}</span>
                  </div>
                  <p class="task-name">{{t.nom || t.titre}}</p>
                  <div class="task-meta">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {{t.dateEcheance | date:'shortDate'}}
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- IN PROGRESS -->
          <div class="kanban-column">
            <div class="kanban-header">
              <span class="column-title active">En cours</span>
              <span class="column-count active">{{kanban.inprogress.length}}</span>
            </div>
            <div class="kanban-list">
              @for (t of kanban.inprogress; track t.id) {
                <div class="kanban-item active">
                  <div class="kanban-item-header">
                    <span class="task-id">#{{(t.id?.toString() || '').slice(-4)}}</span>
                    <span class="status-dot"></span>
                  </div>
                  <p class="task-name">{{t.nom || t.titre}}</p>
                  <div class="progress-bar">
                    <div class="progress-fill" style="width: 60%;"></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- DONE -->
          <div class="kanban-column">
            <div class="kanban-header">
              <span class="column-title done">Terminées</span>
              <span class="column-count done">{{kanban.done.length}}</span>
            </div>
            <div class="kanban-list">
              @for (t of kanban.done; track t.id) {
                <div class="kanban-item done">
                  <div class="kanban-item-header">
                    <span class="task-id">#{{(t.id?.toString() || '').slice(-4)}}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <p class="task-name done">{{t.nom || t.titre}}</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Velocity Circle -->
        <div class="card card-circle">
          <div class="card-header">
            <h3>Vélocité du Sprint</h3>
          </div>
          <div class="quality-circle">
            <svg class="circle-svg" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="12" fill="transparent" class="circle-bg"></circle>
              <circle cx="100" cy="100" r="80" stroke="currentColor" stroke-width="12" fill="transparent" 
                      [attr.stroke-dasharray]="(stats.progression * 5.02) + ' 502'"
                      stroke-linecap="round"
                      class="circle-progress"></circle>
            </svg>
            <div class="circle-content">
              <span class="circle-value">{{stats.progression}}%</span>
              <span class="circle-label">Finis</span>
            </div>
          </div>
          <p class="circle-description">
            {{stats.terminees}} sur {{stats.tachesAssignees}} composants vérifiés
          </p>
        </div>

        <!-- Activity Feed -->
        <div class="card">
          <div class="card-header">
            <h3>Flux Système</h3>
          </div>
          <div class="activity-list">
            @for (activity of activities; track activity.id) {
              <div class="activity-item">
                <span class="activity-dot"></span>
                <div class="activity-details">
                  <p class="activity-title">{{activity.texte}}</p>
                  <p class="activity-meta">{{activity.heure}}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Direct Alerts -->
        <div class="card card-alerts">
          <div class="card-header">
            <h3>Alertes Directes</h3>
          </div>
          <div class="alerts-list">
            @for (notif of notifications; track notif.id) {
              <div class="alert-item" [class.unread]="!notif.lu">
                <div class="alert-content">
                  <p class="alert-title">{{notif.texte}}</p>
                  <p class="alert-message">{{notif.heure}}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge-gray {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
      position: relative;
      z-index: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .kanban-board {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--space-lg);
    }

    .kanban-column {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .kanban-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 var(--space-sm);
    }

    .column-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .column-title.active {
      color: #3b82f6;
    }

    .column-title.done {
      color: #10b981;
    }

    .column-count {
      width: 24px;
      height: 24px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      background: var(--color-bg);
    }

    .column-count.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .column-count.done {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .kanban-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .kanban-item {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .kanban-item:hover {
      border-color: rgba(59, 130, 246, 0.5);
      transform: translateY(-2px);
    }

    .kanban-item.active {
      background: white;
      border: 2px solid rgba(59, 130, 246, 0.2);
      box-shadow: var(--shadow-md);
    }

    .kanban-item.done {
      opacity: 0.7;
    }

    .kanban-item.done:hover {
      opacity: 1;
    }

    .kanban-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-sm);
    }

    .task-id {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      font-style: italic;
    }

    .task-priority {
      padding: var(--space-xs) var(--space-sm);
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .task-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .kanban-item.done .task-name {
      text-decoration: line-through;
      color: var(--color-text-muted);
    }

    .task-meta {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .progress-bar {
      height: 6px;
      background: var(--color-border);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #06b6d4);
      border-radius: 3px;
      transition: width 1s ease-out;
    }

    .card-circle {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .quality-circle {
      position: relative;
      width: 192px;
      height: 192px;
      margin: var(--space-lg) 0;
    }

    .circle-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .circle-bg {
      color: var(--color-border);
    }

    .circle-progress {
      color: #3b82f6;
      transition: stroke-dasharray 1s ease-out;
    }

    .circle-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .circle-value {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .circle-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .circle-description {
      text-align: center;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      max-height: 300px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .activity-dot {
      width: 8px;
      height: 8px;
      background: #3b82f6;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .activity-details {
      flex: 1;
    }

    .activity-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .activity-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .card-alerts {
      background: linear-gradient(135deg, #1e3a8a, #0f172a);
      color: white;
    }

    .card-alerts .card-header h3 {
      color: white;
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .alert-item {
      padding: var(--space-md);
      background: rgba(255, 255, 255, 0.05);
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .alert-item.unread {
      background: rgba(59, 130, 246, 0.1);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .alert-content {
      flex: 1;
    }

    .alert-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: white;
      margin: 0 0 var(--space-xs);
    }

    .alert-message {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .circle-bg {
      color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .circle-value,
    :host-context(.dark) .task-name,
    :host-context(.dark) .activity-title {
      color: var(--color-text);
    }

    :host-context(.dark) .circle-label,
    :host-context(.dark) .circle-description,
    :host-context(.dark) .task-meta,
    :host-context(.dark) .activity-meta {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .kanban-item {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .kanban-item.active {
      background: var(--color-surface);
      border-color: rgba(59, 130, 246, 0.2);
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .metrics-grid {
        grid-template-columns: 1fr;
      }

      .kanban-board {
        grid-template-columns: 1fr;
      }
    }
  `]
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

