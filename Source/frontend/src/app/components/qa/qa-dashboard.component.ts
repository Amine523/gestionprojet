import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjetsService } from '../service/projets.service';
import { AuthService } from '../service/auth.service';
import { Projet } from '../model/projets.model';

interface Bug {
  id: string;
  titre: string;
  description: string;
  severite: 'critique' | 'elevee' | 'moyenne' | 'basse';
  statut: 'ouvert' | 'en_cours' | 'resolu' | 'ferme';
  projetId: string;
  projetNom: string;
  assigneA?: string;
  creePar: string;
  dateCreation: string;
  dateResolution?: string;
}

interface TestCase {
  id: string;
  nom: string;
  description: string;
  projetId: string;
  projetNom: string;
  statut: 'brouillon' | 'pret' | 'en_cours' | 'termine';
  resultats: {
    passes: number;
    echecs: number;
    total: number;
  };
  dateExecution?: string;
}

@Component({
  selector: 'app-qa-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './qa-dashboard.component.html',
  styleUrls: ['./qa-dashboard.component.scss']
})
export class QaDashboardComponent implements OnInit {
  private projetsService = inject(ProjetsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  currentUser = this.authService.currentUser();
  searchQuery = signal('');

  // Mock data - à remplacer par des vrais appels API
  bugs = signal<Bug[]>([
    {
      id: '1',
      titre: 'Erreur de connexion à la base de données',
      description: 'Les utilisateurs ne peuvent pas se connecter lors des pics de trafic',
      severite: 'critique',
      statut: 'en_cours',
      projetId: 'proj1',
      projetNom: 'Application Mobile',
      assigneA: 'Dev Team',
      creePar: 'QA Team',
      dateCreation: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      titre: 'Interface responsive cassée sur mobile',
      description: 'Le layout ne s\'adapte pas correctement sur les petits écrans',
      severite: 'elevee',
      statut: 'ouvert',
      projetId: 'proj2',
      projetNom: 'API Backend',
      creePar: 'QA Team',
      dateCreation: '2024-01-14T14:20:00Z'
    }
  ]);

  testCases = signal<TestCase[]>([
    {
      id: '1',
      nom: 'Tests d\'authentification',
      description: 'Suite complète de tests pour le flux d\'authentification',
      projetId: 'proj1',
      projetNom: 'Application Mobile',
      statut: 'termine',
      resultats: {
        passes: 15,
        echecs: 2,
        total: 17
      },
      dateExecution: '2024-01-15T09:00:00Z'
    },
    {
      id: '2',
      nom: 'Tests de performance API',
      description: 'Tests de charge et de performance pour les endpoints critiques',
      projetId: 'proj2',
      projetNom: 'API Backend',
      statut: 'en_cours',
      resultats: {
        passes: 8,
        echecs: 1,
        total: 9
      }
    }
  ]);

  // Computed properties
  filteredBugs = computed(() => {
    const allBugs = this.bugs();
    if (!this.searchQuery()) return allBugs;
    
    return allBugs.filter(bug => 
      bug.titre.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      bug.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  filteredTestCases = computed(() => {
    const allTests = this.testCases();
    if (!this.searchQuery()) return allTests;
    
    return allTests.filter(test => 
      test.nom.toLowerCase().includes(this.searchQuery().toLowerCase()) ||
      test.description.toLowerCase().includes(this.searchQuery().toLowerCase())
    );
  });

  stats = computed(() => {
    const allBugs = this.bugs();
    const allTests = this.testCases();
    
    return {
      bugsCritiques: allBugs.filter(b => b.severite === 'critique').length,
      bugsOuverts: allBugs.filter(b => b.statut === 'ouvert').length,
      bugsEnCours: allBugs.filter(b => b.statut === 'en_cours').length,
      testsTermines: allTests.filter(t => t.statut === 'termine').length,
      testsEnCours: allTests.filter(t => t.statut === 'en_cours').length,
      couvertureTests: this.calculateCouverture(allTests)
    };
  });

  // Form groups
  bugForm!: FormGroup;
  testCaseForm!: FormGroup;
  showBugModal = signal(false);
  showTestModal = signal(false);

  ngOnInit() {
    this.initializeForms();
    this.loadProjets();
  }

  initializeForms() {
    this.bugForm = this.fb.group({
      titre: ['', Validators.required],
      description: ['', Validators.required],
      severite: ['moyenne', Validators.required],
      projetId: ['', Validators.required],
      steps: ['', Validators.required]
    });

    this.testCaseForm = this.fb.group({
      nom: ['', Validators.required],
      description: ['', Validators.required],
      projetId: ['', Validators.required],
      type: ['manuel', Validators.required],
      priorite: ['moyenne', Validators.required]
    });
  }

  loadProjets() {
    this.projetsService.getProjets().subscribe();
  }

  openBugModal() {
    this.bugForm.reset();
    this.showBugModal.set(true);
  }

  closeBugModal() {
    this.showBugModal.set(false);
  }

  openTestModal() {
    this.testCaseForm.reset();
    this.showTestModal.set(true);
  }

  closeTestModal() {
    this.showTestModal.set(false);
  }

  submitBug() {
    if (this.bugForm.valid) {
      // Logique pour soumettre le bug
      console.log('Bug submitted:', this.bugForm.value);
      this.closeBugModal();
    }
  }

  submitTestCase() {
    if (this.testCaseForm.valid) {
      // Logique pour soumettre le test case
      console.log('Test case submitted:', this.testCaseForm.value);
      this.closeTestModal();
    }
  }

  navigateToBugs() {
    this.router.navigate(['/qa/bugs']);
  }

  navigateToTests() {
    this.router.navigate(['/qa/tests']);
  }

  navigateToReports() {
    this.router.navigate(['/qa/reports']);
  }

  // Helper methods
  getSeveriteLabel(severite: string): string {
    const labels: { [key: string]: string } = {
      'critique': 'Critique',
      'elevee': 'Élevée',
      'moyenne': 'Moyenne',
      'basse': 'Basse'
    };
    return labels[severite] || severite;
  }

  getSeveriteClass(severite: string): string {
    const classes: { [key: string]: string } = {
      'critique': 'severity-critical',
      'elevee': 'severity-high',
      'moyenne': 'severity-medium',
      'basse': 'severity-low'
    };
    return classes[severite] || 'severity-medium';
  }

  getStatutLabel(statut: string): string {
    const labels: { [key: string]: string } = {
      'ouvert': 'Ouvert',
      'en_cours': 'En Cours',
      'resolu': 'Résolu',
      'ferme': 'Fermé',
      'brouillon': 'Brouillon',
      'pret': 'Prêt',
      'termine': 'Terminé'
    };
    return labels[statut] || statut;
  }

  getStatutClass(statut: string): string {
    const classes: { [key: string]: string } = {
      'ouvert': 'status-open',
      'en_cours': 'status-progress',
      'resolu': 'status-resolved',
      'ferme': 'status-closed',
      'brouillon': 'status-draft',
      'pret': 'status-ready',
      'termine': 'status-completed'
    };
    return classes[statut] || 'status-default';
  }

  private calculateCouverture(tests: TestCase[]): number {
    if (tests.length === 0) return 0;
    const totalTests = tests.reduce((sum, test) => sum + test.resultats.total, 0);
    const totalPasses = tests.reduce((sum, test) => sum + test.resultats.passes, 0);
    return Math.round((totalPasses / totalTests) * 100);
  }
}
