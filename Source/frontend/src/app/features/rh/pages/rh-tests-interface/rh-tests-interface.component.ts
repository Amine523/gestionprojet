import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-tests-interface',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="test-interface" [class.dark]="isDark">
      <!-- Minimalist Header -->
      <header class="test-header">
        <div class="test-logo">
          <div class="logo-box">N</div>
          <span class="logo-text">Nadhemni <span class="text-indigo-500">Eval</span></span>
        </div>
        <div class="test-timer" [class.urgent]="timeLeft < 60">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{{formatTime(timeLeft)}}</span>
        </div>
        <div class="test-progress">
          <span class="progress-text">Question {{currentQuestionIndex + 1}} sur {{questions.length}}</span>
          <div class="progress-track">
            <div class="progress-fill" [style.width.%]="(currentQuestionIndex + 1) * 100 / questions.length"></div>
          </div>
        </div>
      </header>

      <!-- Main Test Content -->
      <main class="test-main">
        @if (!testFinished) {
          <div class="question-container animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 class="question-title">{{questions[currentQuestionIndex].q}}</h2>
            
            <div class="options-list">
              @for (opt of questions[currentQuestionIndex].options; track opt; let i = $index) {
                <label class="option-card" [class.selected]="selectedAnswers[currentQuestionIndex] === i">
                  <input type="radio" 
                         [name]="'q' + currentQuestionIndex" 
                         [value]="i" 
                         [(ngModel)]="selectedAnswers[currentQuestionIndex]"
                         class="hidden">
                  <div class="option-index">{{getOptionLabel(i)}}</div>
                  <div class="option-text">{{opt}}</div>
                </label>
              }
            </div>
          </div>

          <footer class="test-footer">
            <button (click)="previousQuestion()" [disabled]="currentQuestionIndex === 0" class="btn-nav">
              Précédent
            </button>
            
            @if (currentQuestionIndex < questions.length - 1) {
              <button (click)="nextQuestion()" [disabled]="selectedAnswers[currentQuestionIndex] === undefined" class="btn-primary">
                Suivant
              </button>
            } @else {
              <button (click)="finishTest()" [disabled]="selectedAnswers[currentQuestionIndex] === undefined" class="btn-finish">
                Terminer le test
              </button>
            }
          </footer>
        } @else {
          <div class="finish-container animate-in zoom-in duration-500">
            <div class="success-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h1>Félicitations !</h1>
            <p>Vous avez terminé l'évaluation technique. Vos résultats ont été transmis au département RH.</p>
            <div class="score-card">
              <span class="score-label">Votre Score</span>
              <span class="score-value">{{finalScore}}%</span>
            </div>
            <button (click)="exit()" class="btn-primary">Retour à l'accueil</button>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .test-interface {
      position: fixed;
      inset: 0;
      background: #f8fafc;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
    }

    .test-header {
      height: 80px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .test-logo {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo-box {
      width: 36px;
      height: 36px;
      background: #4f46e5;
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      font-size: 20px;
    }

    .logo-text {
      font-weight: 800;
      font-size: 18px;
      color: #1e293b;
    }

    .test-timer {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 16px;
      background: #f1f5f9;
      border-radius: 12px;
      font-weight: 700;
      color: #475569;
      font-variant-numeric: tabular-nums;
    }

    .test-timer.urgent {
      background: #fee2e2;
      color: #dc2626;
      animation: pulse 1s infinite;
    }

    .test-progress {
      width: 240px;
    }

    .progress-text {
      display: block;
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      margin-bottom: 6px;
      text-align: right;
    }

    .progress-track {
      height: 6px;
      background: #e2e8f0;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: #4f46e5;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .test-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .question-container {
      max-width: 800px;
      width: 100%;
    }

    .question-title {
      font-size: 28px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 40px;
      line-height: 1.3;
    }

    .options-list {
      display: grid;
      gap: 16px;
    }

    .option-card {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px;
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .option-card:hover {
      border-color: #cbd5e1;
      background: #fdfdfd;
    }

    .option-card.selected {
      border-color: #4f46e5;
      background: #f5f3ff;
      box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
    }

    .option-index {
      width: 32px;
      height: 32px;
      background: #f1f5f9;
      color: #64748b;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 14px;
      transition: all 0.2s;
    }

    .option-card.selected .option-index {
      background: #4f46e5;
      color: white;
    }

    .option-text {
      font-size: 18px;
      font-weight: 500;
      color: #334155;
    }

    .test-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 100px;
      background: white;
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .btn-primary, .btn-finish, .btn-nav {
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
    }

    .btn-primary:hover {
      background: #4338ca;
      transform: translateY(-2px);
    }

    .btn-finish {
      background: #10b981;
      color: white;
      border: none;
    }

    .btn-finish:hover {
      background: #059669;
      transform: translateY(-2px);
    }

    .btn-nav {
      background: white;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .btn-nav:hover:not(:disabled) {
      background: #f8fafc;
      border-color: #cbd5e1;
    }

    .btn-nav:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .finish-container {
      text-align: center;
      max-width: 500px;
    }

    .success-icon {
      width: 100px;
      height: 100px;
      background: #d1fae5;
      color: #10b981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
    }

    .finish-container h1 {
      font-size: 32px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 16px;
    }

    .finish-container p {
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 40px;
    }

    .score-card {
      background: #f1f5f9;
      padding: 24px;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 40px;
    }

    .score-label {
      font-size: 12px;
      font-weight: 800;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .score-value {
      font-size: 48px;
      font-weight: 900;
      color: #4f46e5;
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `]
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
