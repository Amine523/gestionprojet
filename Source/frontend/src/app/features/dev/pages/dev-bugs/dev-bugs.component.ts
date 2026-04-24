import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="bugs-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Mes Bugs</h1>
          <p class="header-subtitle">Les bugs qui me sont assignés - {{societeNom}}</p>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card stat-danger">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.ouverts}}</span>
            <span class="stat-label">Ouverts</span>
          </div>
        </div>
        <div class="stat-card stat-warning">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.enCours}}</span>
            <span class="stat-label">En cours</span>
          </div>
        </div>
        <div class="stat-card stat-success">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.corriges}}</span>
            <span class="stat-label">Corrigés</span>
          </div>
        </div>
        <div class="stat-card stat-primary">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21h5v-5"></path>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.total}}</span>
            <span class="stat-label">Total</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-bar">
        <select [(ngModel)]="filterProjet" class="select-input">
          <option value="">Tous</option>
          <option value="App Mobile">App Mobile</option>
          <option value="API REST">API REST</option>
          <option value="Dashboard">Dashboard</option>
        </select>
        <select [(ngModel)]="filterPriorite" class="select-input">
          <option value="">Toutes</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <!-- Bugs Table -->
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Priorité</th>
                <th>Statut</th>
                <th>Projet</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (b of filteredBugs; track b.id) {
                <tr>
                  <td>{{b.titre}}</td>
                  <td>
                    <span class="badge" [class.badge-critical]="b.priorite.toLowerCase() === 'critical'" [class.badge-high]="b.priorite.toLowerCase() === 'high'" [class.badge-medium]="b.priorite.toLowerCase() === 'medium'" [class.badge-low]="b.priorite.toLowerCase() === 'low'">{{b.priorite}}</span>
                  </td>
                  <td>
                    <span class="badge" [class.badge-danger]="b.statut.toLowerCase() === 'ouvert'" [class.badge-warning]="b.statut.toLowerCase() === 'en cours'" [class.badge-success]="b.statut.toLowerCase() === 'corrigé'">{{b.statut}}</span>
                  </td>
                  <td>{{b.projet}}</td>
                  <td>
                    <div class="action-buttons">
                      @if (b.statut !== 'Corrigé') {
                        <button class="btn btn-success btn-sm" (click)="corriger(b)">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Corriger
                        </button>
                      }
                      <button class="btn-icon" (click)="viewDetails(b)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                          <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bug Detail Modal -->
      @if (viewingBug) {
        <div class="modal-overlay" (click)="viewingBug = null">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header modal-header-danger">
              <h3 class="modal-title">Détails du bug</h3>
              <button class="btn-close btn-close-white" (click)="viewingBug = null">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="detail-section">
                <h6 class="section-title">Description</h6>
                <p class="section-text">{{viewingBug.description}}</p>
              </div>
              <div class="detail-section">
                <h6 class="section-title">Steps to reproduce</h6>
                <ol class="steps-list">
                  @for (step of viewingBug.steps; track step) {
                    <li>{{step}}</li>
                  }
                </ol>
              </div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Projet:</span>
                  <span class="detail-value">{{viewingBug.projet}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Priorité:</span>
                  <span class="badge" [class.badge-critical]="viewingBug.priorite.toLowerCase() === 'critical'" [class.badge-high]="viewingBug.priorite.toLowerCase() === 'high'" [class.badge-medium]="viewingBug.priorite.toLowerCase() === 'medium'" [class.badge-low]="viewingBug.priorite.toLowerCase() === 'low'">{{viewingBug.priorite}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Statut:</span>
                  <span class="badge" [class.badge-danger]="viewingBug.statut.toLowerCase() === 'ouvert'" [class.badge-warning]="viewingBug.statut.toLowerCase() === 'en cours'" [class.badge-success]="viewingBug.statut.toLowerCase() === 'corrigé'">{{viewingBug.statut}}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Créé par:</span>
                  <span class="detail-value">{{viewingBug.createur}}</span>
                </div>
              </div>
              <div class="comments-section">
                <h6 class="section-title">Commentaires</h6>
                <div class="comments-list">
                  @for (comment of viewingBug.commentaires; track comment.id) {
                    <div class="comment-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      <div class="comment-content">
                        <span class="comment-author">{{comment.auteur}}</span>
                        <span class="comment-text">{{comment.texte}}</span>
                      </div>
                      <span class="comment-time">{{comment.heure}}</span>
                    </div>
                  }
                </div>
                <div class="comment-input-group">
                  <input type="text" [(ngModel)]="newComment" class="form-input" placeholder="Votre commentaire...">
                  <button class="btn btn-primary" (click)="addComment()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13"></polygon>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" (click)="viewingBug = null">Fermer</button>
              @if (viewingBug.statut !== 'Corrigé') {
                <button class="btn btn-success" (click)="corriger(viewingBug); viewingBug = null">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Marquer comme corrigé
                </button>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .bugs-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      box-shadow: var(--shadow-sm);
    }

    .stat-card svg {
      flex-shrink: 0;
    }

    .stat-card.stat-danger svg {
      color: #ef4444;
    }

    .stat-card.stat-warning svg {
      color: #f59e0b;
    }

    .stat-card.stat-success svg {
      color: #10b981;
    }

    .stat-card.stat-primary svg {
      color: #3b82f6;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .filters-bar {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .select-input {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
      cursor: pointer;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
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
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .badge {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .badge-critical {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-high {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-medium {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-low {
      background: #d1fae5;
      color: #059669;
    }

    .badge-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .badge-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-xs);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-xs);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
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
    }

    .btn-ghost:hover {
      background: var(--color-bg);
    }

    .btn-sm {
      padding: var(--space-xs) var(--space-sm);
    }

    .btn-icon {
      width: 32px;
      height: 32px;
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
      color: var(--color-text);
      border-color: var(--color-primary);
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

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header-danger {
      background: #ef4444;
      color: white;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    .modal-header-danger .modal-title {
      color: white;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-close-white {
      color: white;
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
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
    }

    .section-text {
      color: var(--color-text-muted);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    .steps-list {
      padding-left: var(--space-lg);
      color: var(--color-text);
    }

    .steps-list li {
      margin-bottom: var(--space-xs);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .detail-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .detail-value {
      font-size: var(--font-size-sm);
      color: var(--color-text);
      font-weight: var(--font-weight-semibold);
    }

    .comments-section {
      margin-top: var(--space-lg);
    }

    .comments-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      max-height: 150px;
      overflow-y: auto;
      margin-bottom: var(--space-md);
    }

    .comment-item {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
    }

    .comment-content {
      flex: 1;
    }

    .comment-author {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .comment-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .comment-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .comment-input-group {
      display: flex;
      gap: var(--space-xs);
    }

    .form-input {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .form-input:focus {
      border-color: #3b82f6;
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

    /* Dark mode */
    :host-context(.dark) .stat-card,
    :host-context(.dark) .card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .detail-value,
    :host-context(.dark) .section-title,
    :host-context(.dark) .data-table th {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .stat-label,
    :host-context(.dark) .section-text,
    :host-context(.dark) .detail-label,
    :host-context(.dark) .data-table td {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .select-input,
    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .data-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .comment-item {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 1024px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }

      .filters-bar {
        flex-direction: column;
      }

      .select-input {
        width: 100%;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }

      .modal-footer {
        flex-direction: column;
      }
    }
  `]
})
export class DevBugsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  filterProjet = '';
  filterPriorite = '';

stats = { ouverts: 0, enCours: 0, corriges: 0, total: 0 };

  bugs: any[] = [];

  displayedColumns = ['titre', 'priorite', 'statut', 'projet', 'actions'];
  viewingBug: any = null;
  newComment = '';
  
  societeId = '';
  societeNom = '';

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projet === this.filterProjet;
      const matchPriorite = !this.filterPriorite || b.priorite === this.filterPriorite;
      return matchProjet && matchPriorite;
    });
  }

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
        let societeTaches = (taches || []).filter((t: any) => t.societeId === this.societeId && t.type === 'bug');
        this.bugs = societeTaches.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
        if (this.bugs.length === 0) {
          this.initDefaultBugs();
        }
        this.calculateStats();
      },
      error: () => { this.initDefaultBugs(); this.calculateStats(); }
    });
  }
  
  initDefaultBugs() {
    this.bugs = [];
  }
  
  calculateStats() {
    this.stats.ouverts = this.bugs.filter(b => b.statut === 'Ouvert').length;
    this.stats.enCours = this.bugs.filter(b => b.statut === 'En cours').length;
    this.stats.corriges = this.bugs.filter(b => b.statut === 'Corrigé').length;
    this.stats.total = this.bugs.length;
  }

  viewDetails(bug: any) {
    this.viewingBug = bug;
    this.newComment = '';
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }

  corriger(bug: any) {
    bug.statut = 'Corrigé';
    this.stats.corriges++;
    this.stats.ouverts--;
    this.snackBar.open('Bug marqué comme corrigé', 'Fermer', { duration: 3000 });
  }
}

