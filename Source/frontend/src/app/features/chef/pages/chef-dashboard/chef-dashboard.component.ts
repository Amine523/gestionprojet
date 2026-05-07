import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, MatSnackBarModule],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Ingénierie & Projets</span>
            <span class="badge badge-success">
              <span class="status-dot"></span>
              Live
            </span>
          </div>
          <h1 class="header-title">
            ORCHESTRATION <span class="gradient-text">DES PROJETS</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • Pilotage stratégique, suivi de la vélocité d'équipe et gestion du portfolio.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="analyserProjets()" [disabled]="aiLoading" class="btn btn-primary" [class.btn-disabled]="aiLoading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
              <path d="M12 12 2.1 12.05"/>
              <path d="M12 12 12 21.9"/>
            </svg>
            Analyste Stratégique
          </button>
          <div class="timer-card" [class.active]="isClockedIn">
            <div class="timer-info">
              <span class="timer-label">{{isClockedIn ? 'Session en cours' : 'Hors ligne'}}</span>
              <span class="timer-val">{{currentTimeDisplay}}</span>
            </div>
            <button (click)="toggleClock()" class="btn-clock" [class.btn-out]="isClockedIn">
              {{isClockedIn ? 'Fin de session' : 'Démarrer session'}}
            </button>
          </div>
          <button (click)="loadData()" class="btn-icon btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- Metrics Grid -->
      <div class="metrics-grid">
        <app-metric-card
          title="PROJETS ACTIFS"
          [value]="stats.projets.toString()"
          icon="bi-folder2-open"
          color="indigo"
          [trend]="'Sous votre gestion'">
        </app-metric-card>

        <app-metric-card
          title="TÂCHES TOTALES"
          [value]="stats.taches.toString()"
          icon="bi-clipboard-data"
          color="emerald"
          [trend]="stats.tacheTerminees + ' terminées'">
        </app-metric-card>

        <app-metric-card
          title="BACKLOG ÉQUIPE"
          [value]="(stats.taches - stats.tacheTerminees).toString()"
          icon="bi-list-task"
          color="amber"
          [trend]="'Tâches en attente'"
          [isPositive]="(stats.taches - stats.tacheTerminees) < 10">
        </app-metric-card>

        <app-metric-card
          title="COLLABORATEURS"
          [value]="stats.membres.toString()"
          icon="bi-people"
          color="purple"
          [trend]="'Équipe active'">
        </app-metric-card>
      </div>

      <!-- AI Strategy Panel -->
      @if (aiLoading || aiInsights) {
        <div class="card card-ai animate-in slide-in-from-top duration-500">
          <div class="card-header">
            <div class="ai-header">
              <div class="ai-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a10 10 0 1 0 10 10H12V2z"/>
                  <path d="M12 12 2.1 12.05"/>
                  <path d="M12 12 12 21.9"/>
                </svg>
              </div>
              <div class="ai-info">
                <h3>Analyse de Portefeuille IA</h3>
                <p class="ai-subtitle">Moteur Prédictif Llama 3.2</p>
              </div>
            </div>
          </div>

          @if (aiLoading) {
            <div class="ai-loading">
              <div class="spinner"></div>
              <p>Évaluation des trajectoires projets...</p>
            </div>
          } @else {
            <div class="ai-content markdown-body" [innerHTML]="aiInsights"></div>
          }
        </div>
      }

      <div class="dashboard-grid">
        <!-- Project Portfolio -->
        <div class="card">
          <div class="card-header">
            <h3>État du Portfolio</h3>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Projet</th>
                  <th>Avancement</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                @for (p of projets; track p.id) {
                  <tr>
                    <td>
                      <div class="project-info">
                        <span class="project-name">{{p.nom}}</span>
                        <span class="project-desc">{{p.description}}</span>
                      </div>
                    </td>
                    <td>
                      <div class="progress-container">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="p.pourcentageAvancement || 0"></div>
                        </div>
                        <span class="progress-val">{{p.pourcentageAvancement || 0}}%</span>
                      </div>
                    </td>
                    <td>
                      <span class="badge" [ngClass]="p.statut === 'En cours' ? 'badge-success' : 'badge-gray'">
                        {{p.statut}}
                      </span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="empty-state">Aucun projet actif trouvé.</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Team Workload -->
        <div class="card">
          <div class="card-header">
            <h3>Charge d'Équipe</h3>
          </div>
          <div class="workload-list">
            @for (m of membres; track m.id) {
              <div class="workload-item">
                <div class="member-avatar">{{m.initials}}</div>
                <div class="member-info">
                  <p class="member-name">{{m.nom}}</p>
                  <p class="member-role">{{m.role}}</p>
                </div>
                <div class="member-load">
                  <div class="load-bar">
                    <div class="load-fill" [style.width.%]="m.load" [class.danger]="m.load > 80"></div>
                  </div>
                  <span class="load-val">{{m.load}}%</span>
                </div>
              </div>
            } @empty {
              <div class="empty-state">Aucun membre d'équipe trouvé.</div>
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
      gap: 2rem;
      padding: 1rem;
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 1.5rem;
      padding: 2.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      color: white;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      letter-spacing: -0.025em;
    }

    .gradient-text {
      background: linear-gradient(to right, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      max-width: 600px;
    }

    .header-badges {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-primary { background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .badge-success { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }

    .status-dot {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      margin-right: 4px;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      z-index: 1;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: white;
      color: #0f172a;
      border: none;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .btn-icon {
      width: 3rem;
      height: 3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.75rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(255, 255, 255, 0.05);
      color: white;
      cursor: pointer;
    }

    .timer-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
      padding: 0.5rem 1rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .timer-card.active {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.2);
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.1);
    }
    .timer-info { display: flex; flex-direction: column; }
    .timer-label { font-size: 0.7rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.05em; }
    .timer-val { font-size: 1.25rem; font-weight: 800; font-variant-numeric: tabular-nums; }
    .btn-clock {
      padding: 0.6rem 1.2rem;
      border-radius: 0.75rem;
      background: #10b981;
      color: white;
      border: none;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-clock:hover { transform: scale(1.05); filter: brightness(1.1); }
    .btn-clock.btn-out { background: #ef4444; }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 1.25rem;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card-header h3 {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 1.5rem;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: 1rem;
      font-size: 0.75rem;
      color: #64748b;
      text-transform: uppercase;
      border-bottom: 1px solid #f1f5f9;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .project-info {
      display: flex;
      flex-direction: column;
    }

    .project-name {
      font-weight: 700;
      color: #1e293b;
    }

    .project-desc {
      font-size: 0.75rem;
      color: #64748b;
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .progress-bar {
      flex: 1;
      height: 0.5rem;
      background: #f1f5f9;
      border-radius: 9999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #38bdf8;
      border-radius: 9999px;
    }

    .progress-val {
      font-size: 0.75rem;
      font-weight: 700;
      color: #1e293b;
      min-width: 2.5rem;
    }

    .workload-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .workload-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .member-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: #6366f1;
    }

    .member-info {
      flex: 1;
    }

    .member-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .member-role {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }

    .member-load {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
      width: 5rem;
    }

    .load-bar {
      width: 100%;
      height: 0.25rem;
      background: #f1f5f9;
      border-radius: 9999px;
    }

    .load-fill {
      height: 100%;
      background: #34d399;
      border-radius: 9999px;
    }

    .load-fill.danger { background: #ef4444; }

    .load-val {
      font-size: 0.75rem;
      font-weight: 700;
      color: #1e293b;
    }

    .card-ai {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .ai-header {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .ai-icon {
      width: 3rem;
      height: 3rem;
      background: #0ea5e9;
      color: white;
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ai-subtitle {
      margin: 0;
      font-size: 0.75rem;
      color: #0ea5e9;
      font-weight: 700;
      text-transform: uppercase;
    }

    .ai-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      gap: 1rem;
    }

    .spinner {
      width: 2.5rem;
      height: 2.5rem;
      border: 3px solid #e2e8f0;
      border-top-color: #0ea5e9;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    .ai-content {
      padding: 1.5rem;
      color: #334155;
      line-height: 1.6;
    }

    .empty-state {
      text-align: center;
      padding: 2rem;
      color: #94a3b8;
    }

    @media (max-width: 1024px) {
      .dashboard-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ChefDashboardComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);
  private snackBar = inject(MatSnackBar);

  societeId = '';
  societeNom = '';

  isClockedIn = false;
  currentTimeDisplay = '00:00:00';
  private timer: any;

  stats = { projets: 0, membres: 0, tacheTerminees: 0, taches: 0 };
  projets: any[] = [];
  membres: any[] = [];
  
  aiLoading = false;
  aiInsights: string | null = null;

  ngOnInit() {
    this.societeId = this.api.getCurrentSocieteId();
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadData();
    this.checkClockStatus();
    this.startClock();
  }

  checkClockStatus() {
    const userId = this.api.getCurrentUserId();
    this.api.getPointageAujourdhui(userId).subscribe(p => {
      this.isClockedIn = !!(p && !p.heureSortie && !p.HeureSortie);
    });
  }

  toggleClock() {
    const userId = this.api.getCurrentUserId();
    const societeId = this.api.getCurrentSocieteId();
    if (this.isClockedIn) {
      this.api.clockOut(userId, societeId, 'Fin de session dashboard').subscribe(() => {
        this.isClockedIn = false;
        this.snackBar.open('Session terminée.', 'OK', { duration: 3000 });
      });
    } else {
      this.api.clockIn(userId, societeId).subscribe(() => {
        this.isClockedIn = true;
        this.snackBar.open('Session démarrée.', 'OK', { duration: 3000 });
      });
    }
  }

  startClock() {
    this.timer = setInterval(() => {
      const now = new Date();
      this.currentTimeDisplay = now.toLocaleTimeString();
    }, 1000);
  }

  loadData() {
    const user = this.api.getCurrentUser();
    
    // Projets
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (res: any) => {
        const allProjets = Array.isArray(res) ? res : (res.items || []);
        // On ne garde que les projets où l'utilisateur est le chef de projet
        this.projets = allProjets.filter((p: any) => (p.utilisateurId || p.UtilisateurId) === (user?.id || user?.Id));
        this.stats.projets = this.projets.length;
      }
    });

    // Employés et Tâches pour la charge de travail
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes: any[]) => {
        this.stats.membres = employes.length;
        
        this.api.getTachesBySociete(this.societeId).subscribe({
          next: (taches: any[]) => {
            this.stats.taches = taches.length;
            this.stats.tacheTerminees = taches.filter((t: any) => {
              const status = (t.statut || t.Statut || '').toLowerCase();
              return status === 'terminée' || status === 'terminé' || status === 'done';
            }).length;

            this.membres = employes.map(e => {
              const userTaches = taches.filter(t => (t.utilisateurId || t.UtilisateurId) === (e.id || e.Id));
              const total = userTaches.length;
              const done = userTaches.filter(t => {
                const s = (t.statut || t.Statut || '').toLowerCase();
                return s === 'terminée' || s === 'terminé' || s === 'done';
              }).length;
              
              return {
                id: e.id || e.Id,
                nom: e.nom || e.Nom,
                initials: (e.nom || e.Nom || 'E').charAt(0),
                role: e.typeUtilisateurNom || 'Membre',
                load: total > 0 ? Math.round((done / total) * 100) : 0
              };
            });
          }
        });
      }
    });
  }

  async analyserProjets() {
    this.aiLoading = true;
    this.aiInsights = null;

    const context = `
      Données de Portefeuille Projets pour ${this.societeNom}:
      - Projets actifs: ${this.stats.projets}
      - Tâches totales: ${this.stats.taches} (${this.stats.tacheTerminees} terminées)
      - Équipe: ${this.stats.membres} membres
      - Projets: ${this.projets.map(p => `${p.nom} (${p.pourcentageAvancement}%)`).join(', ')}
    `;

    const prompt = `En tant qu'expert en gestion de projet (PMP), analyse l'état de santé de ce portefeuille et propose des actions correctives ou stratégiques. Utilise le format Markdown avec des icônes.`;

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
