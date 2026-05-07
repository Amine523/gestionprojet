import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';
import { interval, Subscription } from 'rxjs';

interface Question {
  id: string;
  text: string;
  options: string[];
}

@Component({
  selector: 'app-test-runner',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatRadioModule, FormsModule],
  templateUrl: './test-runner.component.html',
  styleUrls: ['./test-runner.component.scss']
})
export class TestRunnerComponent implements OnInit, OnDestroy {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  questions = signal<Question[]>([]);
  currentQuestionIndex = signal(0);
  selectedAnswers = signal<number[]>([]);
  timeRemaining = signal(1800); // 30 minutes in seconds
  progress = computed(() => ((this.currentQuestionIndex() + 1) / this.questions().length) * 100);

  private timerSub?: Subscription;

  ngOnInit() {
    this.loadQuestions();
    this.startTimer();
  }

  ngOnDestroy() {
    this.timerSub?.unsubscribe();
  }

  loadQuestions() {
    // Simuler le chargement des questions
    this.questions.set([
      { id: '1', text: 'Quelle est la principale différence entre un Signal et un Observable dans Angular 17 ?', options: ['Les Signals sont synchrones', 'Les Observables sont plus rapides', 'Les Signals ne peuvent pas être transformés', 'Il n\'y a aucune différence'] },
      { id: '2', text: 'Comment injecter un service dans un composant standalone ?', options: ['Via le constructeur uniquement', 'Via la fonction inject() uniquement', 'Les deux sont possibles', 'Ce n\'est pas possible'] },
      { id: '3', text: 'Quelle commande permet de créer un nouveau projet Angular avec SSR par défaut ?', options: ['ng new app --ssr', 'ng new app --standalone', 'ng new app', 'npm init angular'] }
    ]);
    this.selectedAnswers.set(new Array(this.questions().length).fill(-1));
  }

  startTimer() {
    this.timerSub = interval(1000).subscribe(() => {
      if (this.timeRemaining() > 0) {
        this.timeRemaining.update(t => t - 1);
      } else {
        this.finish();
      }
    });
  }

  formatTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }

  selectOption(index: number) {
    const answers = [...this.selectedAnswers()];
    answers[this.currentQuestionIndex()] = index;
    this.selectedAnswers.set(answers);
  }

  next() {
    if (this.currentQuestionIndex() < this.questions().length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    }
  }

  prev() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  finish() {
    this.timerSub?.unsubscribe();
    this.notify.showToast('Test terminé ! Envoi des résultats...', 'success');
    // Envoyer les résultats à l'API
  }
}
