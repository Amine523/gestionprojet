import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-candidate-matcher-ai',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './candidate-matcher-ai.component.html',
  styleUrls: ['./candidate-matcher-ai.component.scss']
})
export class CandidateMatcherAI implements OnInit {
  @Input() offreId?: string;

  private ai = inject(AiService);
  
  matches = signal<any[]>([]);

  ngOnInit() {
    this.match();
  }

  match() {
    this.ai.search('Recrutement/Match', { offreId: this.offreId }).subscribe(res => {
      this.matches.set(res || this.getMockMatches());
    });
  }

  getScoreColor(score: number) {
    if (score > 80) return 'text-emerald-500';
    if (score > 50) return 'text-indigo-500';
    return 'text-amber-500';
  }

  viewProfile(match: any) {}
  contact(match: any) {}

  private getMockMatches() {
    return [
      { id: '1', nom: 'Sarah Mansour', titre: 'Expert Angular / Node.js', score: 94, skillMatch: 98, matchingSkills: ['Angular 17', 'Signals', 'RxJS', 'TypeScript'], aiRecommendation: 'Candidat idéal pour le poste de Senior Frontend. Excellente maîtrise des nouvelles API Angular.' },
      { id: '2', nom: 'Karim Ben Ali', titre: 'Développeur Fullstack', score: 72, skillMatch: 65, matchingSkills: ['Angular', 'SQL', 'C#'], aiRecommendation: 'Profil intéressant mais nécessite une montée en compétence sur les fonctionnalités réactives d\'Angular 17.' }
    ];
  }
}
