import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="bugs-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="header-title">Gestion des Bugs</h1>
          <p class="header-subtitle">Signalez et suivez les bugs - {{societeNom}}</p>
        </div>
        <button class="btn btn-primary add-btn" (click)="showCreateForm = true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Signaler un bug
        </button>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.ouverts}}</span>
            <span class="stat-label">Ouverts</span>
          </div>
        </div>
        <div class="stat-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.enCours}}</span>
            <span class="stat-label">En cours</span>
          </div>
        </div>
        <div class="stat-card">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          <div class="stat-info">
            <span class="stat-value">{{stats.corriges}}</span>
            <span class="stat-label">Corrigés</span>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="form-group">
          <label class="form-label">Projet</label>
          <select class="form-select" [(ngModel)]="filterProjet">
            <option value="">Tous</option>
            <option value="App Mobile">App Mobile</option>
            <option value="API REST">API REST</option>
            <option value="Dashboard">Dashboard</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Statut</label>
          <select class="form-select" [(ngModel)]="filterStatut">
            <option value="">Tous</option>
            <option value="Open">Open</option>
            <option value="In_progress">En cours</option>
            <option value="Fixed">Corrigé</option>
          </select>
        </div>
      </div>

      <!-- Bugs List -->
      <div class="bugs-card">
        <div class="bugs-list">
          @for (bug of filteredBugs; track bug.id) {
            <div class="bug-item" [class.critique]="bug.priorite === 'Critical'">
              <div class="bug-header">
                <span class="bug-titre">{{bug.titre}}</span>
                <span class="badge" [ngClass]="'priorite-' + bug.priorite.toLowerCase()">{{bug.priorite}}</span>
              </div>
              <p class="bug-desc">{{bug.description}}</p>
              <div class="bug-meta">
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                  {{bug.projet}}
                </span>
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  {{bug.assignee || 'Non assigné'}}
                </span>
                <span class="badge" [ngClass]="'statut-' + bug.statut.toLowerCase()">{{bug.statut}}</span>
              </div>
              <div class="bug-actions">
                @if (bug.statut === 'Open') {
                  <button class="btn btn-ghost" (click)="affecter(bug)">Affecter</button>
                  <button class="btn btn-ghost" (click)="corriger(bug)">Corriger</button>
                }
                <button class="btn btn-ghost" (click)="details(bug)">Détails</button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Modal -->
      @if (showCreateForm || viewingBug) {
        <div class="modal-overlay" (click)="closeForm()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{viewingBug ? 'Détails du bug' : 'Signaler un bug'}}</h2>
              <button class="btn-close btn-close-white" (click)="closeForm()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Titre</label>
                <input type="text" class="form-input" [(ngModel)]="formData.titre" placeholder="Titre du bug...">
              </div>
              <div class="form-group">
                <label class="form-label">Description</label>
                <textarea class="form-input" [(ngModel)]="formData.description" rows="3" placeholder="Description détaillée..."></textarea>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">Projet</label>
                  <select class="form-select" [(ngModel)]="formData.projet">
                    <option value="App Mobile">App Mobile</option>
                    <option value="API REST">API REST</option>
                    <option value="Dashboard">Dashboard</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Priorité</label>
                  <select class="form-select" [(ngModel)]="formData.priorite">
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Étapes pour reproduire</label>
                <textarea class="form-input" [(ngModel)]="formData.steps" rows="4" placeholder="1. ...&#10;2. ...&#10;3. ..."></textarea>
              </div>

              @if (viewingBug) {
                <div class="comment-section">
                  <h4>Commentaires</h4>
                  <div class="comment-list">
                    @for (comment of viewingBug.commentaires; track comment.id) {
                      <div class="comment-item">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        <div class="comment-content">
                          <span class="comment-author">{{comment.auteur}}</span>
                          <span class="comment-text">{{comment.texte}}</span>
                          <span class="comment-time">{{comment.heure}}</span>
                        </div>
                      </div>
                    }
                  </div>
                  <div class="form-group">
                    <label class="form-label">Ajouter un commentaire</label>
                    <div class="input-with-btn">
                      <input type="text" class="form-input" [(ngModel)]="newComment" placeholder="Votre commentaire...">
                      <button class="btn btn-icon" (click)="addComment()">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="22" y1="2" x2="11" y2="13"></line>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-ghost" (click)="closeForm()">Annuler</button>
              <button class="btn btn-success save-btn" (click)="saveBug()">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                  <polyline points="17 21 17 13 7 13 7 21"></polyline>
                  <polyline points="7 3 7 8 15 8"></polyline>
                </svg>
                {{viewingBug ? 'Mettre à jour' : 'Créer'}}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .bugs-container {
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      gap: var(--space-md);
    }

    .header-content {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
      margin: var(--space-xs) 0 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #ef4444;
      color: white;
    }

    .btn-primary:hover {
      background: #dc2626;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .filters {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-input,
    .form-select {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #ef4444;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    .bugs-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }

    .bugs-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .bug-item {
      padding: var(--space-lg);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .bug-item.critique {
      border-left: 4px solid #ef4444;
      background: #fff5f5;
    }

    .bug-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-sm);
      gap: var(--space-sm);
    }

    .bug-titre {
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-base);
      color: var(--color-text);
    }

    .bug-desc {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-md);
    }

    .bug-meta {
      display: flex;
      gap: var(--space-md);
      align-items: center;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
      flex-wrap: wrap;
    }

    .bug-meta span {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .bug-actions {
      display: flex;
      gap: var(--space-sm);
      border-top: 1px solid var(--color-border);
      padding-top: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .priorite-critical {
      background: #ffebee;
      color: #c62828;
    }

    .priorite-high {
      background: #fff3e0;
      color: #e65100;
    }

    .priorite-medium {
      background: #e3f2fd;
      color: #1976d2;
    }

    .priorite-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .statut-open {
      background: #ffebee;
      color: #c62828;
    }

    .statut-in_progress {
      background: #fff3e0;
      color: #e65100;
    }

    .statut-fixed {
      background: #e8f5e9;
      color: #2e7d32;
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
      width: 500px;
      max-height: 90vh;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: #ef4444;
      color: white;
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
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
      max-height: 60vh;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .comment-section h4 {
      margin: 0 0 var(--space-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .comment-list {
      margin-bottom: var(--space-md);
      max-height: 100px;
      overflow-y: auto;
    }

    .comment-item {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-sm);
    }

    .comment-content {
      flex: 1;
    }

    .comment-author {
      display: block;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .comment-text {
      display: block;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .comment-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .input-with-btn {
      display: flex;
      gap: var(--space-xs);
    }

    .input-with-btn .form-input {
      flex: 1;
    }

    /* Dark mode */
    :host-context(.dark) .stat-card,
    :host-context(.dark) .bugs-card,
    :host-context(.dark) .bug-item,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .bug-titre,
    :host-context(.dark) .modal-header h2,
    :host-context(.dark) .comment-author {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .stat-label,
    :host-context(.dark) .bug-desc,
    :host-context(.dark) .bug-meta,
    :host-context(.dark) .comment-text,
    :host-context(.dark) .comment-time {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .bug-item.critique {
      background: rgba(239, 68, 68, 0.1);
    }

    :host-context(.dark) .comment-item {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class QaBugsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';
  filterProjet = '';
  filterStatut = '';

  stats = { ouverts: 0, enCours: 0, corriges: 0 };

  bugs: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadBugs();
  }

  loadBugs() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const storedBugs = data.qaBugs?.[this.societeId] || [];
    if (storedBugs.length > 0) {
      this.bugs = storedBugs;
    }
  }

  showCreateForm = false;
  viewingBug: any = null;
  newComment = '';
  formData = { titre: '', description: '', projet: 'App Mobile', priorite: 'Medium', steps: '' };

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projet === this.filterProjet;
      const matchStatut = !this.filterStatut || b.statut === this.filterStatut;
      return matchProjet && matchStatut;
    });
  }

  affecter(bug: any) {
    this.snackBar.open('Affecter: ' + bug.titre, 'Fermer', { duration: 2000 });
  }

  corriger(bug: any) {
    bug.statut = 'Fixed';
    this.snackBar.open('Bug marqué corrigé', 'Fermer', { duration: 2000 });
  }

  details(bug: any) {
    this.viewingBug = bug;
    this.formData = {
      titre: bug.titre,
      description: bug.description,
      projet: bug.projet,
      priorite: bug.priorite,
      steps: ''
    };
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

  closeForm() {
    this.showCreateForm = false;
    this.viewingBug = null;
    this.formData = { titre: '', description: '', projet: 'App Mobile', priorite: 'Medium', steps: '' };
  }

  saveBug() {
    if (this.formData.titre && this.formData.description) {
      if (this.viewingBug) {
        this.viewingBug.titre = this.formData.titre;
        this.viewingBug.description = this.formData.description;
        this.viewingBug.projet = this.formData.projet;
        this.viewingBug.priorite = this.formData.priorite;
      } else {
        this.bugs.unshift({
          id: Date.now(),
          titre: this.formData.titre,
          description: this.formData.description,
          projet: this.formData.projet,
          priorite: this.formData.priorite,
          statut: 'Open',
          assignee: '',
          commentaires: []
        });
      }
      this.snackBar.open('Bug enregistré', 'Fermer', { duration: 2000 });
      this.closeForm();
    }
  }
}

