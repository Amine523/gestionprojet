import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-plans',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  template: `

    <div class="plans-container">
      <!-- Premium Header -->
      <div class="premium-header">
        <div class="header-banner-overlay"></div>
        <div class="header-main">
          <div class="header-content">
            <h1 class="header-title">Plans de Test</h1>
            <p class="header-subtitle">Stratégies et planification de l'assurance qualité - {{societeNom}}</p>
          </div>
          <button class="btn btn-primary" (click)="createPlan()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouveau plan
          </button>
        </div>
      </div>

      <!-- Plans List -->
      <div class="plans-list">
        @for (plan of plans; track plan.id) {
          <div class="plan-card">
            <div class="plan-header">
              <h3>{{plan.nom}}</h3>
              <span class="badge">{{plan.projet}}</span>
            </div>
            <p class="plan-desc">{{plan.description}}</p>
            <div class="plan-stats">
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                {{plan.tests}} tests
              </span>
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {{plan.reussis}} réussit
              </span>
              <span class="stat-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                {{plan.echecs}} échecs
              </span>
            </div>
            <div class="plan-actions">
              <button class="btn btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Détails
              </button>
              <button class="btn btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modifier
              </button>
            </div>
          </div>
        } @empty {
          <p class="no-plans">Aucun plan de test pour cette société</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .plans-container {
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }

    .header-left {
      display: flex;
      flex-direction: column;
    }

    .premium-header {
      position: relative;
      padding: 3rem 2rem;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: 20px;
      margin-bottom: 2rem;
      overflow: hidden;
      color: white;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .header-banner-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('/assets/qa_banner.png') center/cover;
      opacity: 0.1;
      z-index: 1;
    }

    .header-main {
      position: relative;
      z-index: 2;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1.5rem;
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      letter-spacing: -0.025em;
      background: linear-gradient(to right, #fff, #94a3b8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      font-size: 1.1rem;
      color: #94a3b8;
      margin-top: 0.5rem;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
      border: 1px solid var(--color-border);
    }

    .btn-ghost:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .plans-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .plan-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }

    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .plan-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      background: #e3f2fd;
      color: #1976d2;
    }

    .plan-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
    }

    .plan-stats {
      display: flex;
      gap: var(--space-lg);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .plan-actions {
      display: flex;
      gap: var(--space-sm);
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-md);
    }

    .no-plans {
      text-align: center;
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
      padding: var(--space-2xl);
    }

    /* Dark mode */
    :host-context(.dark) .plan-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .plan-header h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .plan-desc,
    :host-context(.dark) .plan-stats,
    :host-context(.dark) .no-plans {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .btn-ghost {
      border-color: var(--color-border);
      color: var(--color-text-muted);
    }

    :host-context(.dark) .plan-actions {
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .plan-stats {
        flex-direction: column;
        gap: var(--space-sm);
      }

      .plan-actions {
        flex-direction: column;
      }
    }
  `]
})
export class QaPlansComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';

  plans: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadPlans();
  }

  loadPlans() {
    if (!this.societeId) return;

    this.api.getProjetsBySociete(this.societeId).subscribe(projets => {
      const pList = projets || [];
      const projectIds = new Set(pList.map(p => p.id || p.Id));

      this.api.getTaches().subscribe(all => {
        // Filtrer les tâches qui sont des plans (titre commençant par [PLAN])
        this.plans = (all || [])
          .filter((t: any) => projectIds.has(t.projetId || t.ProjetId) && (t.titre || '').includes('[PLAN]'))
          .map((t: any) => ({
            id: t.id || t.Id,
            nom: (t.titre || '').replace('[PLAN]', '').trim(),
            description: t.description || '',
            projet: pList.find(p => (p.id || p.Id) === (t.projetId || t.ProjetId))?.nom || 'Projet',
            tests: 5, // Mock values for stats as they are not in TacheCore
            reussis: 4,
            echecs: 1
          }));
      });
    });
  }

  createPlan() {
    // Simple prompt for demonstration, usually would use a form/modal
    const nom = prompt('Nom du plan de test:');
    if (nom) {
      this.api.getProjetsBySociete(this.societeId).subscribe(projets => {
        if (projets && projets.length > 0) {
          const firstProject = projets[0];
          const newPlan = {
            Titre: `[PLAN] ${nom}`,
            Description: 'Nouveau plan de test créé depuis l\'interface QA',
            ProjetId: firstProject.id || firstProject.Id,
            Statut: 'Open',
            Priorite: 'Medium'
          };
          this.api.saveTache(newPlan).subscribe(() => {
            this.snackBar.open('Plan de test enregistré dans la base de données', 'OK', { duration: 2000 });
            this.loadPlans();
          });
        } else {
          this.snackBar.open('Aucun projet disponible pour créer un plan', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}

