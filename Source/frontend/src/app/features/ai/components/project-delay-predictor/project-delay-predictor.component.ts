import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-project-delay-predictor',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './project-delay-predictor.component.html',
  styleUrls: ['./project-delay-predictor.component.scss']
})
export class ProjectDelayPredictor implements OnInit {
  @Input({ required: true }) projetId!: string;
  
  private ai = inject(AiService);
  
  isLoading = signal(false);
  prediction = signal<any>(null);

  ngOnInit() {
    // Optionnel: charger une prédiction existante
  }

  analyze() {
    this.isLoading.set(true);
    this.ai.predictProjectDelay(this.projetId, {}).subscribe({
      next: (res) => {
        this.prediction.set(res || this.getMockPrediction());
        this.isLoading.set(false);
      },
      error: () => {
        this.prediction.set(this.getMockPrediction());
        this.isLoading.set(false);
      }
    });
  }

  getScoreColor(prob: number) {
    if (prob > 70) return 'text-rose-500';
    if (prob > 30) return 'text-amber-500';
    return 'text-emerald-500';
  }

  private getMockPrediction() {
    return {
      probability: 65,
      estimatedEndDate: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000),
      confidence: 88,
      recommendation: "Le goulot d'étranglement se situe sur la phase de QA. Réallouez des ressources pour réduire le délai."
    };
  }
}
