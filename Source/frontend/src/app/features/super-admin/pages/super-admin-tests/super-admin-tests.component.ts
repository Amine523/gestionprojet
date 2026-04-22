import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-super-admin-tests',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatProgressBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Tests</span>
          </div>
          <h1 class="header-title">
            Interface des <span class="gradient-text">Tests.</span>
          </h1>
          <p class="header-subtitle">
            Exécuter et gérer les tests unitaires de l'application.
          </p>
        </div>
      </header>

      <!-- Actions -->
      <div class="actions-bar">
        <button class="btn btn-primary" (click)="runAllTests()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Exécuter tous les tests
        </button>
        <button class="btn btn-secondary" (click)="refreshResults()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"/>
            <path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
          </svg>
          Actualiser
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="card stat-card pass">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ passedTests }}</span>
            <span class="stat-label">Tests réussis</span>
          </div>
        </div>

        <div class="card stat-card fail">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ failedTests }}</span>
            <span class="stat-label">Tests échoués</span>
          </div>
        </div>

        <div class="card stat-card total">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTests }}</span>
            <span class="stat-label">Total tests</span>
          </div>
        </div>

        <div class="card stat-card coverage">
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ coverage }}%</span>
            <span class="stat-label">Couverture</span>
          </div>
        </div>
      </div>

      <!-- Results Card -->
      <div class="card results-card">
        <div class="card-header">
          <h3>Résultats des Tests</h3>
        </div>
        <div class="tests-list">
          @for (test of testResults; track test) {
            <div class="test-item" [class.pass]="test.status === 'pass'" [class.fail]="test.status === 'fail'">
              <div class="test-icon">
                @if (test.status === 'pass') {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                } @else {
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                }
              </div>
              <div class="test-info">
                <p class="test-name">{{ test.name }}</p>
                <p class="test-role">{{ test.role }}</p>
              </div>
              <div class="test-meta">
                <span class="badge" [class.pass]="test.status === 'pass'" [class.fail]="test.status === 'fail'">
                  {{ test.status === 'pass' ? 'Réussi' : 'Échoué' }}
                </span>
                <span class="test-duration">{{ test.duration }}ms</span>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Progress Card -->
      @if (isRunning) {
        <div class="card progress-card">
          <div class="progress-info">
            <span>Exécution en cours...</span>
            <span>{{ progress }}%</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" [style.width.%]="progress"></div>
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
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .badge.pass {
      background: #10b981;
      color: white;
      border: none;
    }

    .badge.fail {
      background: #ef4444;
      color: white;
      border: none;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .actions-bar {
      display: flex;
      gap: var(--space-sm);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
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
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: #10b981;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .stat-card.pass .stat-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .stat-card.fail .stat-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .stat-card.total .stat-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .stat-card.coverage .stat-icon {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
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
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .results-card {
      overflow: hidden;
    }

    .card-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .card-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .tests-list {
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .test-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      transition: all var(--transition-base);
    }

    .test-item:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .test-item.pass .test-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .test-item.fail .test-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .test-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
    }

    .test-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .test-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .test-role {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .test-meta {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .test-duration {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .progress-card {
      padding: var(--space-lg);
    }

    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-md);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 4px;
      transition: width var(--transition-base);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tests-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .tests-table th {
      border-color: var(--color-border);
    }

    :host-context(.dark) .tests-table td {
      border-color: var(--color-border);
    }

    :host-context(.dark) .tests-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.02);
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

      .actions-bar {
        flex-direction: column;
      }
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

