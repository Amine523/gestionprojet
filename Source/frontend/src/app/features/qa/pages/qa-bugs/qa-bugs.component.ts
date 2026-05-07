import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { FormStateService } from '@core/services/form-state.service';

@Component({
  selector: 'app-qa-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="module-bg bg-module-qa">
      <div class="content-wrapper bugs-container">
        <!-- Premium Header -->
        <div class="premium-header">
          <div class="header-banner-overlay"></div>
          <div class="header-main">
            <div class="header-content">
              <h1 class="header-title">Gestion des Bugs</h1>
              <p class="header-subtitle">Signalez et suivez les anomalies logicielles - {{societeNom}}</p>
            </div>
            <button class="btn btn-primary add-btn" (click)="openCreateForm()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Signaler un bug
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card glass-card">
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
          <div class="stat-card glass-card">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path>
            </svg>
            <div class="stat-info">
              <span class="stat-value">{{stats.enCours}}</span>
              <span class="stat-label">En cours</span>
            </div>
          </div>
          <div class="stat-card glass-card">
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
        <div class="filters glass-card">
          <div class="form-group">
            <label class="form-label">Projet</label>
            <select class="form-select" [(ngModel)]="filterProjet">
              <option value="">Tous</option>
              @for (p of projets; track p.id) {
                <option [value]="p.id || p.Id">{{p.nom || p.Nom}}</option>
              }
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

        <!-- Bugs Table -->
        <div class="bugs-card glass-card">
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Titre & Description</th>
                  <th>Projet</th>
                  <th>Priorité</th>
                  <th>Assigné</th>
                  <th>Statut</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                @for (bug of filteredBugs; track bug.id) {
                  <tr [class.critique-row]="bug.priorite === 'Critical'">
                    <td><span class="id-badge">#{{bug.id?.substring(0, 5)}}</span></td>
                    <td>
                      <div class="bug-info-cell">
                        <span class="bug-titre">{{bug.titre}}</span>
                        <p class="bug-desc-mini">{{bug.description}}</p>
                      </div>
                    </td>
                    <td>
                      <span class="project-tag">
                        {{bug.projet}}
                      </span>
                    </td>
                    <td><span class="badge" [ngClass]="'priorite-' + bug.priorite.toLowerCase()">{{bug.priorite}}</span></td>
                    <td>
                      <div class="assignee-cell">
                        <div class="mini-avatar">{{(bug.assignee || 'U').charAt(0)}}</div>
                        <span>{{bug.assignee || 'Non assigné'}}</span>
                      </div>
                    </td>
                    <td><span class="badge" [ngClass]="'statut-' + bug.statut.toLowerCase()">{{bug.statut}}</span></td>
                    <td class="text-right">
                      <div class="action-buttons">
                        @if (bug.statut === 'Open') {
                          <button class="btn-action" (click)="affecter(bug)" title="Affecter">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                          </button>
                          <button class="btn-action btn-success-light" (click)="corriger(bug)" title="Corriger">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                          </button>
                        }
                        <button class="btn-action" (click)="details(bug)" title="Détails">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
                @if (filteredBugs.length === 0) {
                  <tr>
                    <td colspan="7" class="empty-row">Aucun bug identifié pour ces critères.</td>
                  </tr>
                }
              </tbody>
            </table>
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
                  <input type="text" class="form-input" [(ngModel)]="formData.titre" (ngModelChange)="onFormChange()" placeholder="Titre du bug..." required minlength="5">
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea class="form-input" [(ngModel)]="formData.description" (ngModelChange)="onFormChange()" rows="3" placeholder="Description détaillée..." required></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Projet</label>
                    <select class="form-select" [(ngModel)]="formData.projetId" (ngModelChange)="onFormChange()">
                      @for (p of projets; track p.id) {
                        <option [value]="p.id || p.Id">{{p.nom || p.Nom}}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Priorité</label>
                    <select class="form-select" [(ngModel)]="formData.priorite" (ngModelChange)="onFormChange()">
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">Assigner à</label>
                  <select class="form-select" [(ngModel)]="formData.utilisateurId" (ngModelChange)="onFormChange()">
                    <option value="">Non assigné</option>
                    @for (u of utilisateurs; track u.id) {
                      <option [value]="u.id || u.Id">{{u.nom || u.Nom}}</option>
                    }
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Étapes pour reproduire</label>
                  <textarea class="form-input" [(ngModel)]="formData.steps" (ngModelChange)="onFormChange()" rows="4" placeholder="1. ...&#10;2. ...&#10;3. ..."></textarea>
                </div>

                @if (viewingBug) {
                  <div class="comment-section">
                    <h4>Commentaires</h4>
                    <div class="comment-list">
                      @for (comment of viewingBug.commentaires; track comment.id) {
                        <div class="comment-item">
                          <div class="comment-avatar">{{comment.auteur.charAt(0)}}</div>
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
                        <input type="text" class="form-input" [(ngModel)]="newComment" placeholder="Votre commentaire..." (keyup.enter)="addComment()">
                        <button class="btn-send" (click)="addComment()">
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
                <button class="btn btn-success" (click)="saveBug()">
                  {{viewingBug ? 'Mettre à jour' : 'Enregistrer'}}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .bugs-container { padding: 2.5rem; background: transparent; min-height: 100vh; }
    .premium-header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: 3rem; color: white; margin-bottom: 2.5rem; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.1); position: relative; overflow: hidden; }
    .header-banner-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at top right, rgba(239, 68, 68, 0.15), transparent); }
    .header-main { display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 2; }
    .header-title { font-size: 2.5rem; font-weight: 800; margin: 0; letter-spacing: -0.02em; }
    .header-subtitle { color: #94a3b8; font-size: 1.1rem; margin-top: 0.5rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
    .stat-card { background: white; padding: 2rem; border-radius: 20px; display: flex; align-items: center; gap: 1.5rem; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .stat-value { font-size: 2.5rem; font-weight: 800; color: #1e293b; line-height: 1; }
    .stat-label { font-size: 0.875rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .filters { background: white; padding: 1.5rem; border-radius: 16px; margin-bottom: 2rem; display: flex; gap: 1.5rem; border: 1px solid #e2e8f0; }
    .bugs-card { background: white; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .table-container { overflow-x: auto; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { background: #f8fafc; padding: 1.25rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; }
    .data-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; color: #334155; vertical-align: middle; }
    .data-table tr:hover { background: #f8fafc; }
    .bug-info-cell { display: flex; flex-direction: column; gap: 0.25rem; }
    .bug-titre { font-weight: 700; font-size: 0.95rem; color: #1e293b; }
    .bug-desc-mini { font-size: 0.8rem; color: #64748b; margin: 0; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .id-badge { font-family: monospace; font-weight: 600; color: #64748b; font-size: 0.8rem; }
    .project-tag { background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; color: #475569; }
    .badge { padding: 0.35rem 0.75rem; border-radius: 99px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; }
    .priorite-critical { background: #fef2f2; color: #ef4444; border: 1px solid #fee2e2; }
    .priorite-high { background: #fff7ed; color: #f97316; border: 1px solid #ffedd5; }
    .priorite-medium { background: #eff6ff; color: #3b82f6; border: 1px solid #dbeafe; }
    .priorite-low { background: #f0fdf4; color: #22c55e; border: 1px solid #dcfce7; }
    .statut-open { background: #fef2f2; color: #ef4444; }
    .statut-in_progress { background: #fff7ed; color: #f97316; }
    .statut-fixed { background: #f0fdf4; color: #22c55e; }
    .assignee-cell { display: flex; align-items: center; gap: 0.75rem; }
    .mini-avatar { width: 28px; height: 28px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; color: #475569; }
    .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
    .btn-action { width: 36px; height: 36px; border-radius: 10px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: 0.2s; }
    .btn-action:hover { border-color: #0f172a; color: #0f172a; background: #f8fafc; }
    .btn-success-light:hover { border-color: #22c55e; color: #22c55e; background: #f0fdf4; }
    .critique-row { background: #fffafb; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { width: 100%; max-width: 600px; background: white; border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }
    .modal-header { padding: 2rem; background: #ef4444; color: white; display: flex; justify-content: space-between; align-items: center; }
    .modal-body { padding: 2rem; max-height: 70vh; overflow-y: auto; }
    .modal-footer { padding: 1.5rem 2rem; background: #f8fafc; display: flex; justify-content: flex-end; gap: 1rem; }
    .comment-item { display: flex; gap: 1rem; padding: 1rem; background: #f8fafc; border-radius: 16px; margin-bottom: 1rem; }
    .comment-avatar { width: 32px; height: 32px; background: #e2e8f0; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: 700; color: #475569; flex-shrink: 0; }
    .comment-author { display: block; font-weight: 700; font-size: 0.9rem; color: #1e293b; }
    .comment-text { color: #64748b; font-size: 0.9rem; }
    .comment-time { font-size: 0.75rem; color: #94a3b8; display: block; margin-top: 0.25rem; }
    .btn-send { background: #0f172a; color: white; border: none; border-radius: 12px; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
    .btn-ghost { background: transparent; border: 1px solid #e2e8f0; color: #64748b; }
    .btn-success { background: #22c55e; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .form-group { margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .form-label { font-size: 0.875rem; font-weight: 700; color: #475569; }
    .form-input, .form-select { padding: 0.875rem; border-radius: 12px; border: 1px solid #e2e8f0; outline: none; font-size: 0.95rem; }
    .form-input:focus { border-color: #ef4444; box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.1); }
    .empty-row { padding: 4rem !important; text-align: center; color: #94a3b8; font-style: italic; }
    :host-context(.dark) { .stat-card, .filters, .bugs-card, .modal-card, .btn-action { background: #1e293b; border-color: #334155; } .data-table th { background: #0f172a; border-color: #334155; } .data-table td { border-color: #334155; color: #cbd5e1; } .bug-titre, .stat-value { color: white; } .form-input, .form-select { background: #0f172a; border-color: #334155; color: white; } .comment-item { background: #0f172a; } .modal-footer { background: #0f172a; } }
  `]
})
export class QaBugsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  private formState = inject(FormStateService);

  societeId = '';
  societeNom = '';
  filterProjet = '';
  filterStatut = '';

  stats = { ouverts: 0, enCours: 0, corriges: 0 };
  bugs: any[] = [];
  projets: any[] = [];
  utilisateurs: any[] = [];

  showCreateForm = false;
  viewingBug: any = null;
  newComment = '';
  formData: any = { titre: '', description: '', projetId: '', priorite: 'Medium', steps: '', utilisateurId: '' };

  private readonly DRAFT_KEY = 'qa_bugs_draft';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.Societe?.Nom || 'Votre société';
    this.loadProjets();
    this.loadUtilisateurs();
    this.loadBugs();
    this.restoreDraft();
  }

  restoreDraft() {
    const draft = this.formState.getDraft(this.DRAFT_KEY);
    if (draft) {
      this.formData = { ...this.formData, ...draft };
      // Automatically open form if draft exists and is not empty
      if (this.formState.hasDraft(this.DRAFT_KEY)) {
        this.showCreateForm = true;
      }
    }
  }

  onFormChange() {
    // Only save draft for new bugs, not when editing existing ones
    if (!this.viewingBug) {
      this.formState.saveDraft(this.DRAFT_KEY, this.formData);
    }
  }

  loadProjets() {
    this.api.getProjetsBySociete(this.societeId).subscribe(res => {
      this.projets = res || [];
    });
  }

  loadUtilisateurs() {
    this.api.getUtilisateurs().subscribe(all => {
      this.utilisateurs = (all || []).filter((u: any) => (u.societeId || u.SocieteId) === this.societeId);
    });
  }

  loadBugs() {
    if (!this.societeId) return;
    this.api.getProjetsBySociete(this.societeId).subscribe(projets => {
      this.projets = projets || [];
      const projectIds = new Set(this.projets.map(p => p.id || p.Id));
      this.api.getUtilisateurs().subscribe(users => {
        const usersList = users || [];
        this.utilisateurs = usersList.filter((u: any) => (u.societeId || u.SocieteId) === this.societeId);
        this.api.getTaches().subscribe(all => {
          const tasksForSociete = (all || []).filter((t: any) => projectIds.has(t.projetId || t.ProjetId));
          this.bugs = tasksForSociete.map((t: any) => {
            const assigneeUser = usersList.find((u: any) => (u.id || u.Id) === (t.utilisateurId || t.UtilisateurId));
            return {
              id: t.id || t.Id,
              titre: t.titre || t.Titre,
              description: t.description || t.Description,
              projet: this.projets.find(p => (p.id || p.Id) === (t.projetId || t.ProjetId))?.nom || 'Inconnu',
              projetId: t.projetId || t.ProjetId,
              priorite: t.priorite || t.Priorite || 'Medium',
              statut: t.statut || t.Statut || 'Open',
              assignee: assigneeUser ? (assigneeUser.nom || assigneeUser.Nom) : 'Non assigné',
              assigneeId: t.utilisateurId || t.UtilisateurId || '',
              commentaires: t.testComment && !t.testComment.startsWith('Étapes:') ? [{ id: Date.now(), auteur: 'Système', texte: t.testComment, heure: 'Auto' }] : []
            };
          });
          this.updateStats();
        });
      });
    });
  }

  updateStats() {
    this.stats.ouverts = this.bugs.filter(b => b.statut === 'Open' || b.statut === 'Todo').length;
    this.stats.enCours = this.bugs.filter(b => b.statut === 'In_progress' || b.statut === 'InProgress').length;
    this.stats.corriges = this.bugs.filter(b => b.statut === 'Fixed' || b.statut === 'Done').length;
  }

  get filteredBugs() {
    return this.bugs.filter(b => {
      const matchProjet = !this.filterProjet || b.projetId === this.filterProjet;
      const matchStatut = !this.filterStatut || b.statut === this.filterStatut;
      return matchProjet && matchStatut;
    });
  }

  openCreateForm() {
    this.viewingBug = null;
    this.showCreateForm = true;
    this.restoreDraft();
  }

  affecter(bug: any) {
    this.details(bug);
  }

  corriger(bug: any) {
    const payload = { 
      Id: bug.id, 
      Statut: 'Fixed',
      Titre: bug.titre,
      ProjetId: bug.projetId,
      Priorite: bug.priorite,
      UtilisateurId: bug.assigneeId
    };
    this.api.saveTache(payload).subscribe(() => {
      this.snackBar.open('Bug marqué corrigé', 'OK', { duration: 2000 });
      this.loadBugs();
    });
  }

  details(bug: any) {
    this.viewingBug = bug;
    this.formData = {
      titre: bug.titre,
      description: bug.description,
      projetId: bug.projetId,
      priorite: bug.priorite,
      utilisateurId: bug.assigneeId || '',
      steps: ''
    };
    this.newComment = '';
    this.showCreateForm = false;
  }

  addComment() {
    if (this.newComment && this.viewingBug) {
      this.viewingBug.commentaires.push({
        id: Date.now(),
        auteur: 'QA',
        texte: this.newComment,
        heure: 'À l\'instant'
      });
      this.api.saveTache({ 
        Id: this.viewingBug.id, 
        TestComment: this.newComment,
        Titre: this.viewingBug.titre,
        Statut: this.viewingBug.statut,
        UtilisateurId: this.viewingBug.assigneeId
      }).subscribe();
      this.newComment = '';
    }
  }

  closeForm() {
    // If we have a draft, we keep it in state service but close the UI
    this.showCreateForm = false;
    this.viewingBug = null;
    // We don't reset formData here if it's a draft, 
    // but we reset it to blank for the next time it's needed if it was an edit
    this.formData = { titre: '', description: '', projetId: '', priorite: 'Medium', steps: '', utilisateurId: '' };
    // If it was a create form, we restore the draft into formData so it's ready for next time
    this.restoreDraft();
  }

  saveBug() {
    if (this.formData.titre && this.formData.description && this.formData.projetId) {
      const bugData = {
        Id: this.viewingBug ? this.viewingBug.id : '',
        Titre: this.formData.titre,
        Description: this.formData.description,
        ProjetId: this.formData.projetId,
        Priorite: this.formData.priorite,
        Statut: this.viewingBug ? this.viewingBug.statut : 'Open',
        UtilisateurId: this.formData.utilisateurId,
        TestComment: this.formData.steps ? 'Étapes: ' + this.formData.steps : ''
      };

      this.api.saveTache(bugData).subscribe({
        next: () => {
          this.snackBar.open('Bug enregistré et assigné', 'OK', { duration: 2000 });
          this.formState.clearDraft(this.DRAFT_KEY);
          this.loadBugs();
          this.closeForm();
        },
        error: () => this.snackBar.open('Erreur de sauvegarde', 'Fermer', { duration: 3000 })
      });
    } else {
      this.snackBar.open('Veuillez remplir les champs obligatoires', 'Fermer', { duration: 3000 });
    }
  }
}
