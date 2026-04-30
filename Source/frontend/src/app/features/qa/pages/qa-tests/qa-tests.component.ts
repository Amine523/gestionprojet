import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="tests-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="header-title">Tests à exécuter</h1>
        <p class="header-subtitle">Gérez et exécutez vos tests - {{societeNom}}</p>
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
          <label class="form-label">Priorité</label>
          <select class="form-select" [(ngModel)]="filterPriorite">
            <option value="">Toutes</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Statut</label>
          <select class="form-select" [(ngModel)]="filterStatut">
            <option value="">Tous</option>
            <option value="Pending">À faire</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        </div>
      </div>

      <!-- Tests Table -->
      <div class="tests-card">
        <table class="tests-table">
          <thead>
            <tr>
              <th>Nom du test</th>
              <th>Type</th>
              <th>Projet</th>
              <th>Priorité</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (t of filteredTests; track t.id) {
              <tr class="test-row">
                <td class="test-name">{{t.nom}}</td>
                <td>
                  <span class="badge type-chip">{{t.type}}</span>
                </td>
                <td>{{t.projet}}</td>
                <td>
                  <span class="badge" [ngClass]="'priority-' + t.priorite.toLowerCase()">{{t.priorite}}</span>
                </td>
                <td>
                  <span class="badge" [ngClass]="'statut-' + t.statut.toLowerCase()">{{t.statut}}</span>
                </td>
                <td>
                  <div class="test-actions">
                    @if (t.statut === 'Pending') {
                      <button class="btn btn-sm btn-success" (click)="passTest(t)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Pass
                      </button>
                      <button class="btn btn-sm btn-danger" (click)="failTest(t)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                        Fail
                      </button>
                    }
                    <button class="btn btn-icon" (click)="viewDetails(t)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      @if (viewingTest) {
        <div class="modal-overlay" (click)="viewingTest = null">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{viewingTest.nom}}</h2>
              <button class="btn-close btn-close-white" (click)="viewingTest = null">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="detail-section">
                <h4>Description</h4>
                <p>{{viewingTest.description}}</p>
              </div>
              <div class="detail-section">
                <h4>Étapes à suivre</h4>
                <ol>
                  @for (etape of viewingTest.etapes; track etape) {
                    <li>{{etape}}</li>
                  }
                </ol>
              </div>
              <div class="detail-section">
                <h4>Résultat attendu</h4>
                <p>{{viewingTest.resultatAttendu}}</p>
              </div>

              @if (viewingTest.resultatAttentes && viewingTest.resultatAttentes.length) {
                <div class="detail-section">
                  <h4>Résultats attendus détaillés</h4>
                  <ul>
                    @for (res of viewingTest.resultatAttentes; track res) {
                      <li>{{res}}</li>
                    }
                  </ul>
                </div>
              }

              <div class="comment-section">
                <h4>Commentaires</h4>
                <div class="comment-list">
                  @for (comment of viewingTest.commentaires; track comment.id) {
                    <div class="comment-item">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
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
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              @if (viewingTest.statut === 'Pending') {
                <button class="btn btn-success" (click)="passTest(viewingTest); viewingTest = null">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Pass
                </button>
                <button class="btn btn-danger" (click)="failTest(viewingTest); viewingTest = null">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                  Fail
                </button>
              }
              <button class="btn btn-ghost" (click)="viewingTest = null">Fermer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tests-container {
      padding: var(--space-lg);
    }

    .page-header {
      margin-bottom: var(--space-xl);
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

    .form-select,
    .form-input {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .form-select:focus,
    .form-input:focus {
      border-color: #3b82f6;
    }

    .tests-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .tests-table {
      width: 100%;
      border-collapse: collapse;
    }

    .tests-table thead th {
      text-align: left;
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 2px solid var(--color-border);
    }

    .test-row {
      border-bottom: 1px solid var(--color-border);
    }

    .test-row:last-child {
      border-bottom: none;
    }

    .test-row td {
      padding: var(--space-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .test-name {
      font-weight: var(--font-weight-semibold);
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

    .type-chip {
      background: #e3f2fd;
      color: #1976d2;
    }

    .priority-high {
      background: #ffebee;
      color: #c62828;
    }

    .priority-medium {
      background: #fff3e0;
      color: #e65100;
    }

    .priority-low {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .statut-pass {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .statut-fail {
      background: #ffebee;
      color: #c62828;
    }

    .statut-pending {
      background: #fff3e0;
      color: #e65100;
    }

    .test-actions {
      display: flex;
      gap: var(--space-xs);
      align-items: center;
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

    .btn-sm {
      padding: var(--space-xs) var(--space-sm);
      font-size: var(--font-size-xs);
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
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

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
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
      width: 550px;
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
      background: #3b82f6;
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

    .detail-section {
      margin-bottom: var(--space-lg);
    }

    .detail-section h4 {
      margin: 0 0 var(--space-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .detail-section p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .detail-section ol,
    .detail-section ul {
      margin: 0;
      padding-left: var(--space-lg);
    }

    .detail-section li {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-xs);
    }

    .comment-section h4 {
      margin: 0 0 var(--space-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .comment-list {
      margin-bottom: var(--space-md);
      max-height: 120px;
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
    :host-context(.dark) .tests-card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .modal-header h2,
    :host-context(.dark) .test-name,
    :host-context(.dark) .detail-section h4,
    :host-context(.dark) .comment-author {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .detail-section p,
    :host-context(.dark) .detail-section li,
    :host-context(.dark) .comment-text,
    :host-context(.dark) .comment-time {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .tests-table thead th {
      color: var(--color-text-muted);
      border-color: var(--color-border);
    }

    :host-context(.dark) .test-row {
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-select,
    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .comment-item {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }

      .tests-card {
        padding: var(--space-md);
      }

      .tests-table {
        font-size: var(--font-size-xs);
      }

      .test-actions {
        flex-direction: column;
      }
    }
  `]
})
export class QaTestsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';
  filterProjet = '';
  filterPriorite = '';
  filterStatut = '';

  tests: any[] = [];

  displayedColumns = ['nom', 'type', 'projet', 'priorite', 'statut', 'actions'];
  viewingTest: any = null;
  newComment = '';

  get filteredTests() {
    return this.tests.filter(t => {
      const matchProjet = !this.filterProjet || t.projet === this.filterProjet;
      const matchPriorite = !this.filterPriorite || t.priorite === this.filterPriorite;
      const matchStatut = !this.filterStatut || t.statut === this.filterStatut;
      return matchProjet && matchPriorite && matchStatut;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadTests();
  }

  loadTests() {
    const currentUser = this.api.getCurrentUser();
    const userId = currentUser?.id || currentUser?.Id || '';
    if (!userId) return;

    this.api.getTachesParUtilisateur(userId).subscribe({
      next: (tasks: any[]) => {
        this.tests = (tasks || []).map((t: any) => {
          const rawStatus = (t.statut || t.Statut || t.status || '').toLowerCase().trim().replace(/ /g, '');
          let normalizedStatus = 'Pending';
          if (['done', 'terminé', 'terminée', 'valide', 'validé', 'pass'].includes(rawStatus)) normalizedStatus = 'Pass';
          else if (['fail', 'echoué', 'échec'].includes(rawStatus)) normalizedStatus = 'Fail';

          return {
            id: t.id || t.Id,
            nom: t.titre || t.Titre || 'Sans titre',
            type: 'Tâche',
            projet: t.projetNom || t.ProjetNom || 'Projet',
            priorite: t.priorite || t.Priorite || 'Medium',
            statut: normalizedStatus,
            description: t.description || t.Description || '',
            commentaires: []
          };
        });
      }
    });
  }

  viewDetails(test: any) {
    this.viewingTest = test;
    this.newComment = '';
  }

  passTest(test: any) {
    test.statut = 'Pass';
    this.snackBar.open('Test marqué comme PASS', 'Fermer', { duration: 2000 });
  }

  failTest(test: any) {
    test.statut = 'Fail';
    this.snackBar.open('Test marqué comme FAIL', 'Fermer', { duration: 2000 });
  }

  addComment() {
    if (this.newComment && this.viewingTest) {
      this.viewingTest.commentaires.push({
        id: Date.now(),
        auteur: 'Moi',
        texte: this.newComment,
       heure: 'À l\'instant'
      });
      this.newComment = '';
    }
  }
}

