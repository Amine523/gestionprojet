import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './rh-tests.component.html',
  styleUrls: ['./rh-tests.component.scss']
})
export class RhTestsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  evaluations: any[] = [];
  filteredResultats: any[] = [];
  noteMoyenne = 0;
  
  showAssignDialog = false;
  selectedTest: any = null;
  assignableCandidates: any[] = [];
  
  showEmbaucherDialog = false;
  selectedResult: any = null;
  selectedRole = 'developpeur';

  selectedQuizRole = 'developpeur';
  roleQuizzes: any[] = [];

  roleQuizData: { [key: string]: any[] } = {
    developpeur: [
      { id: 1, titre: 'JavaScript Avancé', description: 'Test sur les closures, prototypes, async/await', niveau: 'Avancé', nbQuestions: 15, duree: 45, icon: 'javascript', tauxReussite: 72, nbAttempts: 15 },
      { id: 2, titre: 'TypeScript', description: 'Types, génériques, interfaces', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'code', tauxReussite: 85, nbAttempts: 12 },
      { id: 3, titre: 'Angular Framework', description: 'Components, Services, Routing, HTTP', niveau: 'Intermédiaire', nbQuestions: 15, duree: 40, icon: 'angular', tauxReussite: 68, nbAttempts: 8 }
    ],
    testeur: [
      { id: 1, titre: 'Tests Unitaires', description: 'Jest, Jasmine, couverture de code', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'science', tauxReussite: 78, nbAttempts: 9 }
    ],
    chef_projet: [
      { id: 1, titre: 'Gestion de Projet', description: 'Méthodologies Agile, Scrum, Kanban', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'project', tauxReussite: 80, nbAttempts: 11 }
    ],
    rh: [
      { id: 1, titre: 'Droit du Travail', description: 'Congés, CDI, CDD, rupture, convention', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'gavel', tauxReussite: 76, nbAttempts: 9 }
    ]
  };

  selectedQuiz: any = null;
  showQuizDetailsDialog = false;
  showEditQuizDialog = false;
  showCreateQuizDialog = false;
  sampleQuestions: any[] = [];
  
  iconOptions = ['code', 'science', 'engineering', 'gavel', 'psychology', 'terminal', 'data_object', 'bug_report', 'cloud', 'storage', 'security', 'analytics'];
  
  newQuiz: any = {
    titre: '',
    description: '',
    niveau: 'Intermédiaire',
    nbQuestions: 15,
    duree: 30,
    icon: 'code',
    tauxReussite: 0,
    nbAttempts: 0
  };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
    this.loadRoleQuizzes();
  }
  
  loadData() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        const candidateUsers = (employes || []).filter((e: any) => e.typeUtilisateurId === 'candidat');
        this.evaluations = candidateUsers.map((e: any, idx: number) => ({
          id: idx + 1,
          candidat: e.nom,
          test: 'Test Technique',
          date: '10/04/2026',
          note: Math.floor(Math.random() * 10) + 10
        }));
        this.filteredResultats = [...this.evaluations];
        this.calculateStats();
      },
      error: () => {
        this.filteredResultats = [];
        this.calculateStats();
      }
    });
  }
  
  loadRoleQuizzes() {
    this.roleQuizzes = this.roleQuizData[this.selectedQuizRole] || [];
  }
  
  calculateStats() {
    if (this.evaluations.length > 0) {
      const total = this.evaluations.reduce((sum: number, r: any) => sum + r.note, 0);
      this.noteMoyenne = Math.round((total / this.evaluations.length) * 10) / 10;
    }
  }

  viewQuizDetails(quiz: any) {
    this.selectedQuiz = quiz;
    this.showQuizDetailsDialog = true;
    this.sampleQuestions = this.getSampleQuestions(quiz.titre);
  }

  getSampleQuestions(quizTitre: string): any[] {
    return [
      { q: 'Question 1', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 2', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 }
    ];
  }

  closeQuizDetails() {
    this.showQuizDetailsDialog = false;
    this.selectedQuiz = null;
  }

  editQuiz(quiz: any) {
    this.selectedQuiz = { ...quiz };
    this.showEditQuizDialog = true;
  }

  closeEditQuiz() {
    this.showEditQuizDialog = false;
  }

  saveQuiz() {
    this.loadRoleQuizzes();
    this.snackBar.open('Quiz modifié localement', 'Fermer', { duration: 2000 });
    this.closeEditQuiz();
  }

  cancelAssign() {
    this.showAssignDialog = false;
  }

  confirmAssign(c: any) {
    this.snackBar.open('Test assigné à ' + c.nom, 'Fermer', { duration: 2000 });
    this.showAssignDialog = false;
  }

  cancelEmbaucher() {
    this.showEmbaucherDialog = false;
  }

  embaucherCandidat() {
    this.snackBar.open('Candidat embauché (local)', 'Fermer', { duration: 2000 });
    this.showEmbaucherDialog = false;
  }
  
  openCreateQuiz() {
    this.newQuiz = {
      titre: '',
      description: '',
      niveau: 'Intermédiaire',
      nbQuestions: 15,
      duree: 30,
      icon: 'code',
      tauxReussite: 0,
      nbAttempts: 0
    };
    this.showCreateQuizDialog = true;
  }
  
  closeCreateQuiz() {
    this.showCreateQuizDialog = false;
  }
  
  createQuiz() {
    if (!this.newQuiz.titre) {
      this.snackBar.open('Veuillez saisir un titre', 'Fermer', { duration: 2000 });
      return;
    }
    
    const role = this.selectedQuizRole;
    if (!this.roleQuizData[role]) {
      this.roleQuizData[role] = [];
    }
    
    const newId = Math.max(0, ...this.roleQuizData[role].map((q: any) => q.id)) + 1;
    this.roleQuizData[role].push({ ...this.newQuiz, id: newId });
    this.loadRoleQuizzes();
    
    this.snackBar.open('Test "' + this.newQuiz.titre + '" créé avec succès', 'Fermer', { duration: 3000 });
    this.closeCreateQuiz();
  }
}

