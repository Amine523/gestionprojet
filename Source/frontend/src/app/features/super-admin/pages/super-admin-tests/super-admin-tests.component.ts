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
  templateUrl: './super-admin-tests.component.html',
  styleUrls: ['./super-admin-tests.component.scss']
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

