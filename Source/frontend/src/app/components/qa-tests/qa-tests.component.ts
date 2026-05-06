import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Tests à exécuter</h1>
        <p>Gérez et exécutez vos tests - {{societeNom}}</p>
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
          <mat-label>Priorité</mat-label>
          <mat-select [(ngModel)]="filterPriorite">
            <mat-option value="">Toutes</mat-option>
            <mat-option value="High">High</mat-option>
            <mat-option value="Medium">Medium</mat-option>
            <mat-option value="Low">Low</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Statut</mat-label>
          <mat-select [(ngModel)]="filterStatut">
            <mat-option value="">Tous</mat-option>
            <mat-option value="Pending">À faire</mat-option>
            <mat-option value="Pass">Pass</mat-option>
            <mat-option value="Fail">Fail</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-card class="tests-card">
        <table mat-table [dataSource]="filteredTests" class="tests-table">
          <ng-container matColumnDef="nom">
            <th mat-header-cell *matHeaderCellDef>Nom du test</th>
            <td mat-cell *matCellDef="let t">{{t.nom}}</td>
          </ng-container>
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef>Type</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip class="type-chip">{{t.type}}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="projet">
            <th mat-header-cell *matHeaderCellDef>Projet</th>
            <td mat-cell *matCellDef="let t">{{t.projet}}</td>
          </ng-container>
          <ng-container matColumnDef="priorite">
            <th mat-header-cell *matHeaderCellDef>Priorité</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [class]="'priority-' + t.priorite.toLowerCase()">{{t.priorite}}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="statut">
            <th mat-header-cell *matHeaderCellDef>Statut</th>
            <td mat-cell *matCellDef="let t">
              <mat-chip [class]="'statut-' + t.statut.toLowerCase()">{{t.statut}}</mat-chip>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Actions</th>
            <td mat-cell *matCellDef="let t">
              <button mat-flat-button class="pass-btn" (click)="passTest(t)" *ngIf="t.statut === 'Pending'">
                <mat-icon>check</mat-icon> Pass
              </button>
              <button mat-flat-button class="fail-btn" (click)="failTest(t)" *ngIf="t.statut === 'Pending'">
                <mat-icon>close</mat-icon> Fail
              </button>
              <button mat-icon-button (click)="viewDetails(t)">
                <mat-icon>visibility</mat-icon>
              </button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>

      @if (viewingTest) {
        <div class="dialog-overlay" (click)="viewingTest = null">
          <mat-card class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>{{viewingTest.nom}}</h2>
              <button mat-icon-button (click)="viewingTest = null">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="dialog-body">
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
            </div>
            <div class="dialog-footer">
              @if (viewingTest.statut === 'Pending') {
                <button mat-flat-button class="pass-btn" (click)="passTest(viewingTest); viewingTest = null">
                  <mat-icon>check</mat-icon> Pass
                </button>
                <button mat-flat-button class="fail-btn" (click)="failTest(viewingTest); viewingTest = null">
                  <mat-icon>close</mat-icon> Fail
                </button>
              }
              <button mat-stroked-button (click)="viewingTest = null">Fermer</button>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }
    .page-header p { font-size: 14px; color: #666; margin: 4px 0 0; }

    .filters { display: flex; gap: 16px; margin-bottom: 24px; }

    .tests-card { padding: 0; border-radius: 12px; overflow: hidden; }
    .tests-table { width: 100%; }
    .type-chip { background: #e3f2fd; color: #1976d2; font-size: 11px; }
    .priority-high { background: #ffebee; color: #c62828; }
    .priority-medium { background: #fff3e0; color: #e65100; }
    .priority-low { background: #e8f5e9; color: #2e7d32; }
    .statut-pass { background: #e8f5e9; color: #2e7d32; }
    .statut-fail { background: #ffebee; color: #c62828; }
    .statut-pending { background: #fff3e0; color: #e65100; }

    .pass-btn { background: #4caf50; color: white; margin-right: 8px; }
    .fail-btn { background: #f44336; color: white; }

    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-card { width: 550px; max-height: 90vh; padding: 0; border-radius: 16px; background: #fff; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: #2196f3; color: white; border-radius: 16px 16px 0 0; }
    .dialog-header h2 { margin: 0; font-size: 18px; }
    .dialog-header button { color: white; }
    .dialog-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #eee; }

    .detail-section { margin-bottom: 20px; }
    .detail-section h4 { margin: 0 0 12px; font-size: 14px; font-weight: 600; }
    .detail-section p { margin: 0; font-size: 14px; }
    .detail-section ol, .detail-section ul { margin: 0; padding-left: 20px; }

    .comment-section h4 { margin: 0 0 12px; }
    .comment-list { margin-bottom: 16px; max-height: 120px; overflow-y: auto; }
    .comment-item { display: flex; gap: 10px; padding: 10px; background: #f5f5f5; border-radius: 8px; margin-bottom: 8px; }
    .comment-item mat-icon { color: #666; }
    .comment-content { flex: 1; }
    .comment-author { display: block; font-weight: 600; font-size: 13px; }
    .comment-text { display: block; font-size: 13px; }
    .comment-time { font-size: 11px; color: #999; }
    .full-width { width: 100%; }
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
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const currentUser = this.api.getCurrentUser();
    const storedTasks = data.taches?.[this.societeId] || [];
    const assignedTasks = storedTasks.filter((t: any) => t.assignee === currentUser?.nom || t.assignee === currentUser?.id);
    this.tests = assignedTasks.map((t: any) => ({
      id: t.id,
      nom: t.titre,
      type: 'Tâche',
      projet: t.projet,
      priorite: t.priorite,
      statut: t.statut === 'todo' ? 'Pending' : t.statut === 'done' ? 'Pass' : 'Pending',
      description: t.description
    }));
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
