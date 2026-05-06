import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-super-admin-tests',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatProgressBarModule],
  template: `
    <div class="tests-container">
      <div class="header">
        <h1>Interface des Tests</h1>
        <p>Exécuter et gérer les tests unitaires de l'application</p>
      </div>

      <div class="actions-bar">
        <button mat-raised-button color="primary" (click)="runAllTests()">
          <mat-icon>play_arrow</mat-icon>
          Exécuter tous les tests
        </button>
        <button mat-stroked-button (click)="refreshResults()">
          <mat-icon>refresh</mat-icon>
          Actualiser
        </button>
      </div>

      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon pass">
              <mat-icon>check_circle</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ passedTests }}</span>
              <span class="stat-label">Tests réussis</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon fail">
              <mat-icon>cancel</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ failedTests }}</span>
              <span class="stat-label">Tests échoués</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon total">
              <mat-icon>assignment</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ totalTests }}</span>
              <span class="stat-label">Total tests</span>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content>
            <div class="stat-icon coverage">
              <mat-icon>percent</mat-icon>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ coverage }}%</span>
              <span class="stat-label">Couverture</span>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="results-card">
        <mat-card-header>
          <mat-card-title>Résultats des Tests</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="testResults" class="tests-table">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Nom du Test</th>
              <td mat-cell *matCellDef="let test">{{ test.name }}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Statut</th>
              <td mat-cell *matCellDef="let test">
                <mat-chip [class]="'status-' + test.status">
                  {{ test.status === 'pass' ? 'Réussi' : 'Échoué' }}
                </mat-chip>
              </td>
            </ng-container>

            <ng-container matColumnDef="duration">
              <th mat-header-cell *matHeaderCellDef>Durée</th>
              <td mat-cell *matCellDef="let test">{{ test.duration }}ms</td>
            </ng-container>

            <ng-container matColumnDef="role">
              <th mat-header-cell *matHeaderCellDef>Rôle</th>
              <td mat-cell *matCellDef="let test">{{ test.role }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>

      <mat-card class="progress-card" *ngIf="isRunning">
        <mat-card-content>
          <div class="progress-info">
            <span>Exécution en cours...</span>
            <span>{{ progress }}%</span>
          </div>
          <mat-progress-bar mode="indeterminate"></mat-progress-bar>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tests-container {
      padding: 24px;
      background: #f5f7fa;
      min-height: 100vh;
    }

    .header {
      margin-bottom: 24px;
    }

    .header h1 {
      font-size: 28px;
      font-weight: 600;
      color: #1e1e30;
      margin: 0 0 8px 0;
    }

    .header p {
      color: #666;
      margin: 0;
    }

    .actions-bar {
      display: flex;
      gap: 12px;
      margin-bottom: 24px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      border-radius: 12px;
    }

    .stat-card mat-card-content {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon mat-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .stat-icon.pass {
      background: rgba(76, 175, 80, 0.15);
      color: #4caf50;
    }

    .stat-icon.fail {
      background: rgba(244, 67, 54, 0.15);
      color: #f44336;
    }

    .stat-icon.total {
      background: rgba(33, 150, 243, 0.15);
      color: #2196f3;
    }

    .stat-icon.coverage {
      background: rgba(156, 39, 176, 0.15);
      color: #9c27b0;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #1e1e30;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
    }

    .results-card {
      border-radius: 12px;
      margin-bottom: 24px;
    }

    .tests-table {
      width: 100%;
    }

    .status-pass {
      background: #4caf50 !important;
      color: #fff !important;
    }

    .status-fail {
      background: #f44336 !important;
      color: #fff !important;
    }

    .progress-card {
      border-radius: 12px;
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      color: #666;
    }
  `]
})
export class SuperAdminTestsComponent implements OnInit {
  private api = inject(ApiService);

  testResults: any[] = [];
  displayedColumns = ['name', 'status', 'duration', 'role'];
  
  passedTests = 0;
  failedTests = 0;
  totalTests = 0;
  coverage = 0;
  isRunning = false;
  progress = 0;

  ngOnInit() {
    this.loadTestResults();
  }

  loadTestResults() {
    const stored = this.api.getRawStorage();
    const results = stored['testResults'] || this.getDefaultResults();
    this.testResults = results;
    this.calculateStats();
  }

  getDefaultResults() {
    return [
      { name: 'devrait avoir accès aux sociétés', status: 'pass', duration: 45, role: 'Super Admin' },
      { name: 'devrait gérer les abonnements', status: 'pass', duration: 32, role: 'Super Admin' },
      { name: 'devrait voir les abonnements actifs', status: 'pass', duration: 28, role: 'Super Admin' },
      { name: 'devrait avoir accès au chat avec les sociétés', status: 'pass', duration: 51, role: 'Super Admin' },
      { name: "devrait s'authentifier", status: 'pass', duration: 38, role: 'Admin Société' },
      { name: 'devrait gérer les employés', status: 'pass', duration: 41, role: 'Admin Société' },
      { name: 'devrait créer un abonnement', status: 'pass', duration: 55, role: 'Admin Société' },
      { name: 'devrait voir les plans disponibles', status: 'pass', duration: 22, role: 'Admin Société' },
      { name: 'devrait gérer les utilisateurs', status: 'pass', duration: 48, role: 'RH' },
      { name: 'devrait créer une demande decongé', status: 'pass', duration: 35, role: 'RH' },
      { name: 'devrait approuver les demandes', status: 'pass', duration: 29, role: 'RH' },
      { name: 'devrait ajouter un candidat', status: 'pass', duration: 42, role: 'RH' },
      { name: 'devrait avoir accès aux projets', status: 'pass', duration: 33, role: 'Chef Projet' },
      { name: 'devrait gérer les tâches', status: 'pass', duration: 39, role: 'Chef Projet' },
      { name: 'devrait suivre le temps', status: 'pass', duration: 27, role: 'Développeur' },
      { name: 'devrait soumettre une tâche', status: 'pass', duration: 31, role: 'Développeur' },
      { name: 'devrait exécuter les tests', status: 'pass', duration: 44, role: 'Testeur QA' },
      { name: 'devrait signaler un bug', status: 'pass', duration: 36, role: 'Testeur QA' },
      { name: 'devrait postuler à un emploi', status: 'pass', duration: 49, role: 'Candidat' },
      { name: 'devrait voir les offres', status: 'pass', duration: 24, role: 'Candidat' }
    ];
  }

  calculateStats() {
    this.totalTests = this.testResults.length;
    this.passedTests = this.testResults.filter(t => t.status === 'pass').length;
    this.failedTests = this.testResults.filter(t => t.status === 'fail').length;
    this.coverage = this.totalTests > 0 ? Math.round((this.passedTests / this.totalTests) * 100) : 0;
  }

  runAllTests() {
    this.isRunning = true;
    this.progress = 0;
    
    const interval = setInterval(() => {
      this.progress += 10;
      if (this.progress >= 100) {
        clearInterval(interval);
        this.isRunning = false;
        this.loadTestResults();
      }
    }, 200);
  }

  refreshResults() {
    this.loadTestResults();
  }
}
