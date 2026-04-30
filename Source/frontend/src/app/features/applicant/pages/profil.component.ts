import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './profil.component.html'
})
export class ApplicantProfilComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  userName = '';
  userEmail = '';
  myCandidatures: any[] = [];
  
  showQuiz = false;
  showResult = false;
  selectedCandidature: any = null;
  quizQuestions: any[] = [];
  currentQuestion = 0;
  score = 0;
  passingScore = 10;

  get progressPercent() { return (this.currentQuestion / this.quizQuestions.length) * 100; }
  get scorePercent() { return Math.round((this.score / this.quizQuestions.length) * 100); }

  getLetter(i: number): string {
    return String.fromCharCode(65 + i);
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = user.nom;
      this.userEmail = user.email;
      this.loadCandidatures(user.id || user.utilisateurId);
    } else {
      this.router.navigate(['/applicant/postuler']);
    }
  }

  loadCandidatures(userId: string) {
    this.api.getCandidaturesByCandidat(userId).subscribe((data: any) => {
      this.myCandidatures = data;
    });
  }

  getStatusClass(statut: string) {
    switch (statut) {
      case 'En_attente': return 'bg-waiting';
      case 'Test_autorise': return 'bg-test';
      case 'Test_termine': return 'bg-success';
      case 'Accepte': return 'bg-success';
      case 'Refuse': return 'bg-default';
      default: return 'bg-default';
    }
  }

  formatStatut(statut: string) {
    return statut?.replace('_', ' ');
  }

  startTest(cand: any) {
    this.selectedCandidature = cand;
    this.quizQuestions = this.getQuizQuestions(cand.quiz);
    this.currentQuestion = 0;
    this.score = 0;
    this.showQuiz = true;
  }

  answerQuestion(index: number) {
    if (index === this.quizQuestions[this.currentQuestion].correct) {
      this.score++;
    }

    if (this.currentQuestion < this.quizQuestions.length - 1) {
      this.currentQuestion++;
    } else {
      this.finishTest();
    }
  }

  finishTest() {
    this.showQuiz = false;
    this.showResult = true;
    
    // Update status in API
    this.api.updateCandidatureStatus(this.selectedCandidature.id, 'Test_termine', this.score, this.quizQuestions.length)
      .subscribe(() => {
        const user = this.api.getCurrentUser();
        this.loadCandidatures(user.id || user.utilisateurId);
      });
  }

  closeTest() {
    this.showResult = false;
    this.selectedCandidature = null;
  }

  getQuizQuestions(quizTitre: string): any[] {
    // Logic for quiz questions... 
    // (Simplified for brevity, usually should be in a service)
    return [
      { q: 'Question 1', options: ['A', 'B', 'C', 'D'], correct: 0 },
      { q: 'Question 2', options: ['A', 'B', 'C', 'D'], correct: 1 },
      // ... more questions
    ];
  }
}
