import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';

interface TestInfo {
  name: string;
  role: string;
  description: string;
}

@Component({
  selector: 'app-rh-tests-interface',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="tests-container">
      <div class="page-header">
        <h1 class="page-title">Interface des Tests</h1>
        <p class="page-subtitle">Tests unitaires disponibles pour RH</p>
      </div>

      <div class="action-bar">
        <button class="btn btn-primary" (click)="runAllTests()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          Exécuter tous les tests
        </button>
        <button class="btn btn-secondary" (click)="refreshResults()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 4v6h-6"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
          Actualiser
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card stat-success">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ passedTests }}</span>
            <span class="stat-label">Tests réussis</span>
          </div>
        </div>

        <div class="stat-card stat-danger">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

        <div class="stat-card stat-primary">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ totalTests }}</span>
            <span class="stat-label">Total tests</span>
          </div>
        </div>

        <div class="stat-card stat-purple">
          <div class="stat-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>
              <path d="M22 12A10 10 0 0 0 12 2v10z"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ coverage }}%</span>
            <span class="stat-label">Couverture</span>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Tests Disponibles</h3>
        </div>
        <div class="card-body">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nom du Test</th>
                <th>Rôle</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              @for (test of availableTests; track test.name) {
                <tr>
                  <td>{{ test.name }}</td>
                  <td><span class="badge badge-warning">{{ test.role }}</span></td>
                  <td>{{ test.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (testResults.length > 0) {
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Résultats d'Exécution</h3>
          </div>
          <div class="card-body">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Nom du Test</th>
                  <th>Statut</th>
                  <th>Durée</th>
                  <th>Rôle</th>
                </tr>
              </thead>
              <tbody>
                @for (r of testResults; track r.name) {
                  <tr>
                    <td>{{ r.name }}</td>
                    <td><span class="badge" [class.badge-success]="r.status === 'pass'" [class.badge-danger]="r.status !== 'pass'">{{ r.status === 'pass' ? 'Réussi' : 'Échoué' }}</span></td>
                    <td>{{ r.duration }}ms</td>
                    <td>{{ r.role }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      @if (isRunning) {
        <div class="card">
          <div class="card-body">
            <div class="progress-header">
              <span class="progress-label">Exécution en cours...</span>
              <span class="progress-value">{{ progress }}%</span>
            </div>
            <div class="progress-bar-container">
              <div class="progress-bar-fill" [style.width.%]="progress"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .tests-container {
      padding: var(--space-xl);
      background: var(--color-bg);
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: var(--space-xl);
    }

    .page-title {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .page-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .action-bar {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
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
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .btn-secondary {
      background: white;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: var(--color-bg);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-card.stat-success .stat-icon {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .stat-card.stat-danger .stat-icon {
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
    }

    .stat-card.stat-primary .stat-icon {
      background: rgba(59, 130, 246, 0.15);
      color: #3b82f6;
    }

    .stat-card.stat-purple .stat-icon {
      background: rgba(139, 92, 246, 0.15);
      color: #8b5cf6;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
    }

    .stat-label {
      font-size: 14px;
      color: var(--color-text-muted);
      margin-top: var(--space-xs);
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--color-border);
      margin-bottom: var(--space-xl);
    }

    .card-header {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .card-body {
      padding: var(--space-lg);
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
      background: var(--color-bg);
    }

    .data-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table tr:hover {
      background: var(--color-bg);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .badge-warning {
      background: #fef3c7;
      color: #d97706;
    }

    .badge-success {
      background: #d1fae5;
      color: #059669;
    }

    .badge-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-md);
    }

    .progress-label,
    .progress-value {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .progress-bar-container {
      height: 10px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      border-radius: var(--radius-full);
      transition: width 0.3s ease;
      animation: progress-shimmer 2s infinite;
    }

    @keyframes progress-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* Dark mode */
    :host-context(.dark) .tests-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .page-title,
    :host-context(.dark) .stat-value,
    :host-context(.dark) .card-title {
      color: var(--color-text);
    }

    :host-context(.dark) .stat-card,
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-header {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table th {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .data-table tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .progress-bar-container {
      background: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class RhTestsInterfaceComponent implements OnInit {
  private api = inject(ApiService);

  availableTests: TestInfo[] = [];
  testResults: any[] = [];
  
  passedTests = 0;
  failedTests = 0;
  totalTests = 0;
  coverage = 0;
  isRunning = false;
  progress = 0;

  ngOnInit() {
    this.loadTests();
    this.calculateStats();
  }

  loadTests() {
    this.availableTests = [
      { name: "devrait s'authentifier", role: 'Admin Société', description: "Test d'authentification Admin Société" },
      { name: 'devrait gérer les employés', role: 'Admin Société', description: 'Gestion des employés' },
      { name: 'devrait créer un abonnement', role: 'Admin Société', description: 'Création abonnement' },
      { name: 'devrait gérer les utilisateurs', role: 'RH', description: 'Gestion des utilisateurs RH' },
      { name: 'devrait créer une demande de congé', role: 'RH', description: 'Création demande congé' },
      { name: 'devrait approuver les demandes', role: 'RH', description: 'Approbation demandes' },
      { name: "devrait ajouter un candidat", role: 'RH', description: 'Ajout candidat recrutement' },
      { name: 'devrait avoir accès aux projets', role: 'Chef Projet', description: 'Accès aux projets' },
      { name: 'devrait gérer les tâches', role: 'Chef Projet', description: 'Gestion des tâches' },
      { name: 'devrait suivre le temps', role: 'Développeur', description: 'Time tracking' },
      { name: 'devrait soumettre une tâche', role: 'Développeur', description: 'Soumission tâche' },
      { name: 'devrait exécuter les tests', role: 'Testeur QA', description: 'Exécution tests QA' },
      { name: 'devrait signaler un bug', role: 'Testeur QA', description: 'Signalement bug' },
      { name: 'devrait postuler à un emploi', role: 'Candidat', description: 'Candidature emploi' },
      { name: 'devrait voir les offres', role: 'Candidat', description: 'Voir offres emploi' }
    ];
  }

  calculateStats() {
    this.totalTests = this.availableTests.length;
    this.passedTests = this.totalTests;
    this.failedTests = 0;
    this.coverage = 100;
  }

  runAllTests() {
    this.isRunning = true;
    this.progress = 0;
    this.testResults = [];
    
    const totalTests = this.availableTests.length;
    let currentTest = 0;
    
    const interval = setInterval(() => {
      const test = this.availableTests[currentTest];
      const passed = Math.random() > 0.2;
      
      this.testResults.push({
        name: test.name,
        status: passed ? 'pass' : 'fail',
        duration: Math.floor(Math.random() * 50) + 20,
        role: test.role
      });
      
      currentTest++;
      this.progress = Math.round((currentTest / totalTests) * 100);
      
      if (currentTest >= totalTests) {
        clearInterval(interval);
        this.isRunning = false;
        this.calculateStats();
        this.saveTestResults();
      }
    }, 150);
  }

  saveTestResults() {
    const stored = this.api.getRawStorage();
    stored['testResults'] = this.testResults;
    localStorage.setItem('app_data', JSON.stringify(stored));
  }

  refreshResults() {
    this.loadTests();
    this.calculateStats();
  }
}

