import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-tests-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rh-tests-interface.component.html',
  styleUrls: ['./rh-tests-interface.component.scss']
})
export class RhTestsInterfaceComponent implements OnInit, OnDestroy {
  private api = inject(ApiService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isDark = false;
  currentQuestionIndex = 0;
  timeLeft = 900; // 15 minutes
  timerInterval: any;
  testFinished = false;
  finalScore = 0;
  applicationId: string | null = null;
  candidatName: string = '';
  testName: string = '';

  questions = [
    {
      q: "Lequel de ces langages est principalement utilisé pour le développement d'interfaces web réactives ?",
      options: ["Python", "Java", "TypeScript / JavaScript", "C++"],
      correct: 2
    },
    {
      q: "Dans une architecture microservices, quel est le rôle principal d'une passerelle API (API Gateway) ?",
      options: ["Stocker les données", "Point d'entrée unique et routage", "Compiler le code", "Générer de la documentation"],
      correct: 1
    },
    {
      q: "Quelle commande Git permet de récupérer les changements du dépôt distant et de les fusionner ?",
      options: ["git push", "git commit", "git pull", "git status"],
      correct: 2
    },
    {
      q: "Quel est l'avantage principal de l'utilisation de Docker dans un projet ?",
      options: ["Réduire la taille des images", "Isolation et portabilité de l'environnement", "Accélérer la connexion internet", "Remplacer la base de données"],
      correct: 1
    }
  ];

  selectedAnswers: number[] = [];

  ngOnInit() {
    this.applicationId = this.route.snapshot.queryParamMap.get('token');
    if (this.applicationId) {
      this.loadApplicationData();
    }
    this.startTimer();
    this.isDark = document.body.classList.contains('dark');
  }

  loadApplicationData() {
    if (!this.applicationId) return;
    
    this.api.get(`application/obtenir/id/${this.applicationId}`).subscribe({
      next: (res: any) => {
        this.candidatName = res.nom || res.candidatNom || '';
        this.testName = res.quiz || res.Quiz || 'Test Technique';
        // If we had a backend for questions, we would load them here
        // this.api.getQuizQuestionsBackend(this.testName).subscribe(q => this.questions = q);
      },
      error: (err) => console.error('Error loading application:', err)
    });
  }

  ngOnDestroy() {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.finishTest();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  getOptionLabel(index: number): string {
    return String.fromCharCode(65 + index);
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  finishTest() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    
    let score = 0;
    this.questions.forEach((q, i) => {
      if (this.selectedAnswers[i] === q.correct) {
        score++;
      }
    });

    this.finalScore = Math.round((score / this.questions.length) * 100);
    this.testFinished = true;

    // Save score to backend
    if (this.applicationId) {
      this.api.updateCandidatureStatus(this.applicationId, 'TEST_TERMINE', score, this.questions.length).subscribe({
        next: () => console.log('Score saved successfully'),
        error: (err) => console.error('Error saving score:', err)
      });
    }
  }

  exit() {
    this.router.navigate(['/applicant/home']);
  }
}
