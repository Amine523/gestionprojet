import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-ai-health-badge',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  template: `
    <div [matTooltip]="tooltipText()" class="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all">
      <div [class]="'w-2 h-2 rounded-full ' + statusColor()"></div>
      <span class="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">AI Core</span>
    </div>
  `,
  styles: [`:host { display: inline-block; }`]
})
export class AIHealthBadge {
  private aiService = inject(AiService);

  isHealthy = this.aiService.isHealthy;
  
  statusColor = computed(() => this.isHealthy() ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]');
  tooltipText = computed(() => this.isHealthy() ? 'Service IA Opérationnel' : 'Service IA Indisponible');
}
