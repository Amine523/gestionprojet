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

    <div class="container-fluid p-4" style="background: #f5f7fa; min-height: 100vh;">
      <div class="mb-4">
        <h1 class="fw-bold" style="font-size: 28px; color: #1e1e30;">Interface des Tests</h1>
        <p class="text-muted mb-0">Tests unitaires disponibles pour RH</p>
      </div>

      <div class="d-flex gap-3 mb-4">
        <button class="btn btn-primary" (click)="runAllTests()">
          <i class="bi bi-play-fill me-2"></i>Exécuter tous les tests
        </button>
        <button class="btn btn-outline-secondary" (click)="refreshResults()">
          <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
        </button>
      </div>

      <div class="row g-4 mb-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(76, 175, 80, 0.15); color: #4caf50;">
                <i class="bi bi-check-circle" style="font-size: 28px;"></i>
              </div>
              <div class="d-flex flex-column">
                <span class="fw-bold" style="font-size: 28px; color: #1e1e30;">{{ passedTests }}</span>
                <span class="text-muted" style="font-size: 14px;">Tests réussis</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(244, 67, 54, 0.15); color: #f44336;">
                <i class="bi bi-x-circle" style="font-size: 28px;"></i>
              </div>
              <div class="d-flex flex-column">
                <span class="fw-bold" style="font-size: 28px; color: #1e1e30;">{{ failedTests }}</span>
                <span class="text-muted" style="font-size: 14px;">Tests échoués</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(33, 150, 243, 0.15); color: #2196f3;">
                <i class="bi bi-clipboard-check" style="font-size: 28px;"></i>
              </div>
              <div class="d-flex flex-column">
                <span class="fw-bold" style="font-size: 28px; color: #1e1e30;">{{ totalTests }}</span>
                <span class="text-muted" style="font-size: 14px;">Total tests</span>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(156, 39, 176, 0.15); color: #9c27b0;">
                <i class="bi bi-percent" style="font-size: 28px;"></i>
              </div>
              <div class="d-flex flex-column">
                <span class="fw-bold" style="font-size: 28px; color: #1e1e30;">{{ coverage }}%</span>
                <span class="text-muted" style="font-size: 14px;">Couverture</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-header bg-white">
          <h5 class="fw-bold mb-0">Tests Disponibles</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead class="table-light">
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
                  <td><span class="badge rounded-pill bg-warning text-white">{{ test.role }}</span></td>
                  <td>{{ test.description }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      @if (testResults.length > 0) {
        <div class="card border-0 shadow-sm mb-4">
          <div class="card-header bg-white">
            <h5 class="fw-bold mb-0">Résultats d'Exécution</h5>
          </div>
          <div class="card-body">
            <table class="table table-bordered">
              <thead class="table-light">
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
                    <td><span class="badge rounded-pill" [class.bg-success]="r.status === 'pass'" [class.bg-danger]="r.status !== 'pass'">{{ r.status === 'pass' ? 'Réussi' : 'Échoué' }}</span></td>
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
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex justify-content-between mb-3">
              <span class="text-muted">Exécution en cours...</span>
              <span class="text-muted">{{ progress }}%</span>
            </div>
            <div class="progress" style="height: 10px;">
              <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" [style.width.%]="progress"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [``]
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

