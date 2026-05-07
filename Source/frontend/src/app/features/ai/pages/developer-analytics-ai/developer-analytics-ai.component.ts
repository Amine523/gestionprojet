import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AiService } from '@core/services/ai.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-developer-analytics-ai',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressBarModule],
  templateUrl: './developer-analytics-ai.component.html',
  styleUrls: ['./developer-analytics-ai.component.scss']
})
export class DeveloperAnalyticsAI implements OnInit {
  private ai = inject(AiService);
  private auth = inject(AuthService);

  analytics = signal<any>(null);

  ngOnInit() {
    this.loadAnalytics();
  }

  loadAnalytics() {
    const user = this.auth.currentUser();
    this.ai.search('Analytics/Developer', { userId: user?.id }).subscribe(res => {
      this.analytics.set(res || this.getMockData());
    });
  }

  getRiskColor(risk: string) {
    switch (risk) {
      case 'Low': return 'text-emerald-500';
      case 'Medium': return 'text-amber-500';
      case 'High': return 'text-rose-500';
      default: return 'text-slate-400';
    }
  }

  private getMockData() {
    return {
      efficiency: 87,
      efficiencyText: 'En hausse de 4% par rapport au mois dernier.',
      burnoutRisk: 'Low',
      topSkills: ['Angular 17', 'Tailwind', 'Signals', 'RxJS'],
    };
  }
}
