import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-projets',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <div class="projets-container">
      <!-- Header -->
      <header class="header">
        <div class="header-bg"></div>
        <div class="header-content">
          <div class="header-left">
            <div class="header-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span class="badge-text">Assurance Qualité</span>
            </div>
            <h1 class="header-title">
              Missions de <span class="gradient-text">Validation.</span>
            </h1>
            <p class="header-subtitle">Accès prioritaire aux écosystèmes nécessitant des audits de qualité et des tests de régression.</p>
          </div>
          <div class="header-stat">
            <p class="stat-label">Audit Global</p>
            <div class="stat-value">
              <span class="value">{{projets.length}}</span>
              <span class="unit">Unités</span>
            </div>
          </div>
        </div>
      </header>

      <!-- Project Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Statut</th>
              <th>Description</th>
              <th>Scénarios</th>
              <th>Anomalies</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (projet of projets; track projet.id) {
              <tr>
                <td>
                  <div class="project-info">
                    <span class="project-name">{{projet.nom}}</span>
                  </div>
                </td>
                <td>
                  <div class="card-status">
                    <span class="status-dot"></span>
                    <span class="status-text">Sous Audit Qualité</span>
                  </div>
                </td>
                <td>
                  <span class="project-desc">{{projet.description || 'Synthèse de l\'environnement de test'}}</span>
                </td>
                <td>
                  <span class="stat-value-text">{{projet.tests || 0}}</span>
                </td>
                <td>
                  <span class="stat-value-text bugs">{{projet.bugs || 0}}</span>
                </td>
                <td class="text-right">
                  <div class="card-actions">
                    <a routerLink="/qa/tests" class="btn btn-primary">Tests</a>
                    <a routerLink="/qa/bugs" class="btn btn-secondary">Bugs</a>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (projets.length === 0) {
          <div class="empty-state">
            <p>Aucune mission trouvée.</p>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .projets-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
      padding-bottom: var(--space-2xl);
    }

    .header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .header-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 70%, transparent 100%);
      filter: blur(120px);
      margin-top: -200px;
      margin-right: -200px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-xl);
      position: relative;
      z-index: 1;
    }

    .header-left {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .header-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: rgba(59, 130, 246, 0.2);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.3);
      color: #60a5fa;
    }

    .badge-text {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(96, 165, 250, 0.8);
      font-style: italic;
    }

    .header-title {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #a78bfa, #c084fc);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      margin: 0;
      max-width: 600px;
    }

    .header-stat {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid rgba(255, 255, 255, 0.1);
      text-align: center;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: var(--space-xs);
    }

    .stat-value {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
    }

    .unit {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #60a5fa;
      text-transform: uppercase;
    }

    .table-container {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      overflow-x: auto;
      box-shadow: var(--shadow-sm);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .project-info {
      display: flex;
      flex-direction: column;
    }

    .project-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      font-style: italic;
    }

    .card-status {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
    }

    .status-text {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      font-style: italic;
    }

    .project-desc {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      font-style: italic;
    }

    .stat-value-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      font-style: italic;
    }

    .stat-value-text.bugs {
      color: #e11d48;
    }

    .text-right {
      text-align: right;
    }

    .card-actions {
      display: flex;
      gap: var(--space-md);
    }

    .btn {
      flex: 1;
      height: 56px;
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-xs);
      text-decoration: none;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #0f172a;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #3b82f6;
    }

    .btn-secondary {
      background: white;
      color: var(--color-text);
      border: 2px solid var(--color-border);
    }

    .btn-secondary:hover {
      border-color: rgba(244, 63, 94, 0.2);
      color: #e11d48;
    }

    /* Dark mode */
    :host-context(.dark) .project-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-title,
    :host-context(.dark) .stat-box-value {
      color: var(--color-text);
    }

    :host-context(.dark) .card-description,
    :host-context(.dark) .status-text,
    :host-context(.dark) .stat-box-label {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .stat-box {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #60a5fa;
    }

    :host-context(.dark) .btn-secondary {
      background: var(--color-surface);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-primary {
      background: #1e293b;
    }

    @media (max-width: 1024px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    @media (max-width: 768px) {
      .header {
        padding: var(--space-lg);
      }

      .header-title {
        font-size: var(--font-size-3xl);
      }
    }
  `]
})
export class QaProjetsComponent implements OnInit {
  private api = inject(ApiService);
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const societeId = user?.societeId || '';
    this.api.getProjetsBySociete(societeId).subscribe(data => {
      this.projets = (data || []).map(p => ({
        ...p,
        tests: Math.floor(Math.random() * 40) + 10,
        bugs: Math.floor(Math.random() * 8)
      }));
    });
  }
}
