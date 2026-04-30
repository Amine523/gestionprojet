import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

  isDark = false;
  currentQuestionIndex = 0;
  timeLeft = 900; // 15 minutes
  timerInterval: any;
  testFinished = false;
  finalScore = 0;

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
    this.startTimer();
    this.isDark = document.body.classList.contains('dark');
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
  }

  exit() {
    this.router.navigate(['/applicant/home']);
  }
}
