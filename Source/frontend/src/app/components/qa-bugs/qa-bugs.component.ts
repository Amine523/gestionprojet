import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-bugs',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="page">
      <div class="page-header">
        <div>
          <h1>Gestion des Bugs</h1>
          <p>Signalez et suivez les bugs - {{societeNom}}</p>
        </div>
        <button mat-flat-button class="add-btn" (click)="showCreateForm = true">
          <mat-icon>add</mat-icon> Signaler un bug
        </button>
      </div>

      <div class="stats-row">
        <mat-card class="stat-card">
          <mat-icon style="color: #f44336;">error</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{stats.ouverts}}</span>
            <span class="stat-label">Ouverts</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon style="color: #ff9800;">pending</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{stats.enCours}}</span>
            <span class="stat-label">En cours</span>
          </div>
        </mat-card>
        <mat-card class="stat-card">
          <mat-icon style="color: #2196f3;">autorenew</mat-icon>
          <div class="stat-info">
            <span class="stat-value">{{stats.corriges}}</span>
            <span class="stat-label">Corrigés</span>
          </div>
        </mat-card>
      </div>

      <div class="filters">
        <mat-form-field appearance="outline">
          <mat-label>Projet</mat-label>
          <mat-select [(ngModel)]="filterProjet">
            <mat-option value="">Tous</mat-option>
            <mat-option value="App Mobile">App Mobile</mat-option>
            <mat-option value="API REST">API REST</mat-option>
            <mat-option value="Dashboard">Dashboard</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [(ngModel)]="filterStatut">
            <mat-option value="">Tous</mat-option>
            <mat-option value="Open">Open</mat-option>
            <mat-option value="In_progress">En cours</mat-option>
            <mat-option value="Fixed">Corrigé</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-card class="bugs-card">
        <div class="bugs-list">
          @for (bug of filteredBugs; track bug.id) {
            <div class="bug-item" [class.critique]="bug.priorite === 'Critical'">
              <div class="bug-header">
                <span class="bug-titre">{{bug.titre}}</span>
                <mat-chip [class]="'priorite-' + bug.priorite.toLowerCase()">{{bug.priorite}}</mat-chip>
              </div>
              <p class="bug-desc">{{bug.description}}</p>
              <div class="bug-meta">
                <span><mat-icon>folder</mat-icon> {{bug.projet}}</span>
                <span><mat-icon>person</mat-icon> {{bug.assignee || 'Non assigné'}}</span>
                <mat-chip [class]="'statut-' + bug.statut.toLowerCase()">{{bug.statut}}</mat-chip>
              </div>
              <div class="bug-actions">
                @if (bug.statut === 'Open') {
                  <button mat-button color="primary" (click)="affecter(bug)">Affecter</button>
                  <button mat-button color="primary" (click)="corriger(bug)">Corriger</button>
                }
                <button mat-button (click)="details(bug)">Détails</button>
              </div>
            </div>
          }
        </div>
      </mat-card>

      @if (showCreateForm || viewingBug) {
        <div class="dialog-overlay" (click)="closeForm()">
          <mat-card class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{viewingBug ? 'Détails du bug' : 'Signaler un bug'}}</h2>
              <button mat-icon-button (click)="closeForm()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="dialog-body">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Titre</mat-label>
                <input matInput [(ngModel)]="formData.titre" placeholder="Titre du bug...">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput [(ngModel)]="formData.description" rows="3" placeholder="Description détaillée..."></textarea>
              </mat-form-field>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Projet</mat-label>
                  <mat-select [(ngModel)]="formData.projet">
                    <mat-option value="App Mobile">App Mobile</mat-option>
                    <mat-option value="API REST">API REST</mat-option>
                    <mat-option value="Dashboard">Dashboard</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Priorité</mat-label>
                  <mat-select [(ngModel)]="formData.priorite">
                    <mat-option value="Critical">Critical</mat-option>
                    <mat-option value="High">High</mat-option>
                    <mat-option value="Medium">Medium</mat-option>
                    <mat-option value="Low">Low</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Étapes pour reproduire</mat-label>
                  <textarea matInput [(ngModel)]="formData.steps" rows="4" placeholder="1. ...
2. ...
3. ..."></textarea>
                </mat-form-field>
              </div>

              @if (viewingBug) {
                <div class="comment-section">
                  <h4>Commentaires</h4>
                  <div class="comment-list">
                    @for (comment of viewingBug.commentaires; track comment.id) {
                      <div class="comment-item">
                        <mat-icon>account_circle</mat-icon>
                        <div class="comment-content">
                          <span class="comment-author">{{comment.auteur}}</span>
                          <span class="comment-text">{{comment.texte}}</span>
                          <span class="comment-time">{{comment.heure}}</span>
                        </div>
                      </div>
                    }
                  </div>
                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Ajouter un commentaire</mat-label>
                    <input matInput [(ngModel)]="newComment" placeholder="Votre commentaire...">
                    <button mat-icon-button matSuffix (click)="addComment()">
                      <mat-icon>send</mat-icon>
                    </button>
                  </mat-form-field>
                </div>
              }
            </div>
            <div class="dialog-footer">
              <button mat-stroked-button (click)="closeForm()">Annuler</button>
              <button mat-flat-button class="save-btn" (click)="saveBug()">
                <mat-icon>save</mat-icon> {{viewingBug ? 'Mettre à jour' : 'Créer'}}
              </button>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .add-btn { background: #f44336; color: white; }

    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card { display: flex; align-items: center; gap: 14px; padding: 20px; border-radius: 12px; }
    .stat-card mat-icon { font-size: 28px; }
    .stat-value { font-size: 24px; font-weight: 700; display: block; }
    .stat-label { font-size: 12px; color: #666; }

    .filters { display: flex; gap: 16px; margin-bottom: 24px; }

    .bugs-card { padding: 24px; border-radius: 12px; }
    .bugs-list { display: flex; flex-direction: column; gap: 16px; }
    .bug-item { padding: 20px; background: #f9f9f9; border-radius: 12px; }
    .bug-item.critique { border-left: 4px solid #f44336; background: #fff5f5; }
    .bug-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .bug-titre { font-weight: 600; font-size: 16px; }
    .bug-desc { font-size: 13px; color: #666; margin: 0 0 12px; }
    .bug-meta { display: flex; gap: 16px; align-items: center; font-size: 12px; color: #888; margin-bottom: 12px; }
    .bug-meta span { display: flex; align-items: center; gap: 4px; }
    .bug-actions { display: flex; gap: 8px; border-top: 1px solid #eee; padding-top: 12px; }

    .priorite-critical { background: #ffebee; color: #c62828; }
    .priorite-high { background: #fff3e0; color: #e65100; }
    .priorite-medium { background: #e3f2fd; color: #1976d2; }
    .priorite-low { background: #e8f5e9; color: #2e7d32; }
    .statut-open { background: #ffebee; color: #c62828; }
    .statut-in_progress { background: #fff3e0; color: #e65100; }
    .statut-fixed { background: #e8f5e9; color: #2e7d32; }

    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-card { width: 500px; max-height: 90vh; padding: 0; border-radius: 16px; background: #fff; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: #f44336; color: white; border-radius: 16px 16px 0 0; }
    .dialog-header h2 { margin: 0; font-size: 18px; }
    .dialog-header button { color: white; }
    .dialog-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #eee; }
    .save-btn { background: #4caf50; color: white; }

    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }

    .comment-section h4 { margin: 0 0 12px; }
    .comment-list { margin-bottom: 16px; max-height: 100px; overflow-y: auto; }
    .comment-item { display: flex; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px; margin-bottom: 8px; }
    .comment-item mat-icon { color: #666; }
    .comment-content { flex: 1; }
    .comment-author { display: block; font-weight: 600; font-size: 13px; }
    .comment-text { display: block; font-size: 13px; }
    .comment-time { font-size: 11px; color: #999; }
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
