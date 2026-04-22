import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
      <div class="flex justify-between items-start mb-4">
        <div class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
             [ngClass]="computedIconBgClass">
          <i [class]="computedIconClass + ' text-2xl ' + computedIconColorClass"></i>
        </div>
        @if (trend) {
          <div class="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
               [ngClass]="isPositive ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path [attr.d]="isPositive ? 'M7 17L17 7M17 7H7M17 7V17' : 'M17 7L7 17M7 17H17M7 17V7'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ trend }}
          </div>
        }
      </div>
      <div>
        <p class="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-1">{{ label }}</p>
        <h3 class="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">{{ value }}</h3>
      </div>
    </div>
  `
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = '';
  @Input() iconClass: string = '';
  @Input() iconBgClass: string = 'bg-indigo-50 dark:bg-indigo-500/10';
  @Input() iconColorClass: string = 'text-indigo-600 dark:text-indigo-400';
  @Input() trend?: string | number;
  @Input() isPositive: boolean = true;
  @Input() icon: string = '';
  @Input() color: string = '';

  get computedIconClass(): string {
    if (this.icon) return this.icon;
    return this.iconClass;
  }

  get computedIconBgClass(): string {
    if (this.color) {
      const colorMap: { [key: string]: string } = {
        indigo: 'bg-indigo-50 dark:bg-indigo-500/10',
        blue: 'bg-blue-50 dark:bg-blue-500/10',
        emerald: 'bg-emerald-50 dark:bg-emerald-500/10',
        rose: 'bg-rose-50 dark:bg-rose-500/10',
        orange: 'bg-orange-50 dark:bg-orange-500/10',
        purple: 'bg-purple-50 dark:bg-purple-500/10'
      };
      return colorMap[this.color] || this.iconBgClass;
    }
    return this.iconBgClass;
  }

  get computedIconColorClass(): string {
    if (this.color) {
      const colorMap: { [key: string]: string } = {
        indigo: 'text-indigo-600 dark:text-indigo-400',
        blue: 'text-blue-600 dark:text-blue-400',
        emerald: 'text-emerald-600 dark:text-emerald-400',
        rose: 'text-rose-600 dark:text-rose-400',
        orange: 'text-orange-600 dark:text-orange-400',
        purple: 'text-purple-600 dark:text-purple-400'
      };
      return colorMap[this.color] || this.iconColorClass;
    }
    return this.iconColorClass;
  }
}
