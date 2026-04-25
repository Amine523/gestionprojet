import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { marked } from 'marked';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dev-projets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Mes Projets</h1>
          <p class="header-subtitle">Environnement de développement et gestion du backlog pour {{societeNom}}</p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="stat-value">{{projets.length}}</span>
            <span class="stat-label">Missions</span>
          </div>
          <div class="header-stat">
            <div class="stat-dot"></div>
            <span class="stat-label">Actif</span>
          </div>
        </div>
      </div>

      <!-- Control Bar -->
      <div class="control-bar">
        <div class="search-group">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" class="search-input" placeholder="Filtrer mes projets par nom...">
        </div>
        <select [(ngModel)]="filterStatut" class="select-input">
          <option value="">Tous les Statuts</option>
          <option value="En cours">En cours</option>
          <option value="Terminé">Terminé</option>
        </select>
      </div>

      <!-- Projects Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Projet</th>
              <th>Statut</th>
              <th>Membres</th>
              <th>Tâches</th>
              <th>Progression</th>
              <th class="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filteredProjets; track p.id) {
              <tr class="clickable-row" (click)="selectProjet(p)">
                <td>
                  <div class="project-info">
                    <span class="project-name">{{p.nom}}</span>
                  </div>
                </td>
                <td>
                  <span class="project-status" [class.status-done]="p.statut === 'Terminé'">{{p.statut}}</span>
                </td>
                <td>
                  <div class="team-avatars">
                    @for (i of [1,2,3]; track i) {
                      <div class="avatar">{{i}}</div>
                    }
                  </div>
                </td>
                <td>
                  <span class="task-count">{{p.taches}} Tâches</span>
                </td>
                <td>
                  <div class="project-progress">
                    <div class="progress-labels">
                      <span class="progress-value">{{p.avancement || 0}}%</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="p.avancement || 0"></div>
                    </div>
                  </div>
                </td>
                <td class="text-right">
                  <button class="btn-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </button>
                </td>
              </tr>
            }
          </tbody>
        </table>
        @if (filteredProjets.length === 0) {
          <div class="empty-state">
            <p>Aucun projet trouvé.</p>
          </div>
        }
      </div>

      <!-- Project Detail Modal -->
      @if (selectedProjet) {
        <div class="modal-overlay" (click)="selectedProjet = null">
          <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <h3 class="modal-title">{{selectedProjet.nom}}</h3>
                <span class="modal-subtitle">Détails et Analyse IA Llama 3.2</span>
              </div>
              <button class="btn-close" (click)="selectedProjet = null">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="detail-section">
                <h6 class="section-title">Objectifs Mission</h6>
                <p class="section-text">{{selectedProjet.description}}</p>
              </div>
              <div class="detail-grid">
                <div class="detail-card">
                  <p class="detail-label">Cycle de Vie</p>
                  <p class="detail-value">
                    {{selectedProjet.dateDebut || 'Non défini'}} 
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                    {{selectedProjet.dateFin || '-'}}
                  </p>
                </div>
                <div class="detail-card">
                  <p class="detail-label">Backlog Unités</p>
                  <p class="detail-value">{{selectedProjet.taches}} Tâches répertoriées</p>
                </div>
              </div>
              @if (aiLoading) {
                <div class="ai-loading">
                  <div class="spinner"></div>
                  <p class="loading-text">L'IA Llama 3.2 synthétise les données...</p>
                </div>
              }
              @if (aiInsights) {
                <div class="ai-insights">
                  <div class="ai-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                      <circle cx="12" cy="5" r="2"></circle>
                      <path d="M12 7v4"></path>
                      <line x1="8" y1="16" x2="8" y2="16"></line>
                      <line x1="16" y1="16" x2="16" y2="16"></line>
                    </svg>
                    <h4 class="ai-title">Synthèse IA Llama 3.2</h4>
                  </div>
                  <div class="ai-content" [innerHTML]="aiInsights"></div>
                </div>
              }
            </div>
            <div class="modal-footer">
              <button (click)="analyserProjet()" [disabled]="aiLoading" class="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
                Analyser
              </button>
              <div class="footer-actions">
                <button (click)="selectedProjet = null" class="btn btn-ghost">Fermer</button>
                <button routerLink="/dev/taches" (click)="selectedProjet = null" class="btn btn-primary">
                  Ouvrir Backlog
                </button>
              </div>
            </div>
          </div>
        </div>
      }
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
      align-items: center;
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
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(16, 185, 129, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      margin: var(--space-xs) 0 0;
    }

    .header-stats {
      display: flex;
      gap: var(--space-md);
    }

    .header-stat {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      padding: var(--space-md) var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: white;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .stat-dot {
      width: 12px;
      height: 12px;
      background: #10b981;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .control-bar {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      display: flex;
      gap: var(--space-md);
      align-items: center;
    }

    .search-group {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-group svg {
      position: absolute;
      left: var(--space-md);
      color: var(--color-text-muted);
    }

    .search-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      padding-left: calc(var(--space-md) * 3);
      border-radius: var(--radius-lg);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .search-input:focus {
      border-color: rgba(16, 185, 129, 0.2);
    }

    .select-input {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-lg);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      outline: none;
      cursor: pointer;
      min-width: 200px;
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

    .clickable-row {
      cursor: pointer;
      transition: background 0.2s;
    }

    .clickable-row:hover {
      background: var(--color-bg);
    }

    .project-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .project-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .project-status {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: rgba(6, 182, 212, 0.1);
      color: #06b6d4;
    }

    .project-status.status-done {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .text-right {
      text-align: right;
    }

    .project-progress {
      margin-bottom: var(--space-md);
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      margin-bottom: var(--space-xs);
    }

    .progress-value {
      color: #10b981;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #06b6d4);
      border-radius: var(--radius-full);
      transition: width 1s ease-out;
    }

    .project-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .team-avatars {
      display: flex;
      margin-left: calc(var(--space-xs) * -1);
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--color-bg);
      border: 2px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
    }

    .task-count {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      color: #10b981;
      border-color: #10b981;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-wide {
      max-width: 700px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .modal-subtitle {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
      flex: 1;
    }

    .detail-section {
      margin-bottom: var(--space-lg);
    }

    .section-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-sm);
    }

    .section-text {
      font-size: var(--font-size-base);
      color: var(--color-text);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .detail-card {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-md);
    }

    .detail-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .detail-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .ai-loading {
      background: #0f172a;
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(16, 185, 129, 0.2);
      border-top-color: #10b981;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-text {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .ai-insights {
      background: #020617;
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid rgba(16, 185, 129, 0.2);
      position: relative;
      overflow: hidden;
    }

    .ai-insights::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 128px;
      height: 128px;
      background: rgba(16, 185, 129, 0.1);
      filter: blur(48px);
    }

    .ai-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
      position: relative;
      z-index: 1;
    }

    .ai-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .ai-content {
      font-size: var(--font-size-sm);
      color: #94a3b8;
      line-height: var(--line-height-relaxed);
      position: relative;
      z-index: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
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

    .btn-primary {
      background: #0f172a;
      color: white;
    }

    .btn-primary:hover {
      background: #10b981;
    }

    .btn-secondary {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .btn-secondary:hover {
      background: #10b981;
      color: white;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      color: var(--color-text);
    }

    .footer-actions {
      display: flex;
      gap: var(--space-sm);
    }

    /* Dark mode */
    :host-context(.dark) .control-bar,
    :host-context(.dark) .project-card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .project-icon,
    :host-context(.dark) .avatar {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .project-title,
    :host-context(.dark) .detail-value {
      color: var(--color-text);
    }

    :host-context(.dark) .search-input,
    :host-context(.dark) .select-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .detail-card {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 1024px) {
      .projects-grid {
        grid-template-columns: 1fr;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-stats {
        width: 100%;
        justify-content: space-between;
      }

      .control-bar {
        flex-direction: column;
      }

      .select-input {
        width: 100%;
      }

      .modal-footer {
        flex-direction: column;
      }

      .footer-actions {
        width: 100%;
        justify-content: space-between;
      }
    }
  `]
})
export class DevProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private aiService = inject(AiService);

  searchQuery = '';
  filterStatut = '';
  projets: any[] = [];
  selectedProjet: any = null;
  aiLoading = false;
  aiInsights: string | null = null;
  societeId = '';
  societeNom = '';

  get filteredProjets() {
    return this.projets.filter(p => {
      const matchSearch = !this.searchQuery || p.nom.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatut = !this.filterStatut || p.statut === this.filterStatut;
      return matchSearch && matchStatut;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (data) => {
        this.projets = (data || []).map(p => ({
          ...p,
          avancement: p.avancee || Math.floor(Math.random() * 100),
          taches: p.taches || Math.floor(Math.random() * 20) + 5
        }));
      },
      error: () => {}
    });
  }

  selectProjet(projet: any) {
    this.selectedProjet = projet;
    this.aiInsights = null;
  }

  async analyserProjet() {
    if (!this.selectedProjet) return;
    this.aiLoading = true;
    this.aiInsights = null;

    this.aiService.getProjectInsights(this.selectedProjet).subscribe({
      next: async (res) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "L'IA n'a pas pu générer d'analyse pour ce projet.";
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = "Erreur de connexion au module IA.";
        this.aiLoading = false;
      }
    });
  }
}
