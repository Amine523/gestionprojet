import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="premium-card p-5 flex items-center gap-4">
      <div [ngClass]="iconClass" class="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0">
        <span [innerHTML]="iconSvg"></span>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-2xl font-bold text-gray-900 dark:text-white/90">{{ value }}</p>
        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{{ label }}</p>
        @if (trend !== undefined && trend !== null) {
          <div class="flex items-center gap-1 mt-1"
            [ngClass]="{ 'text-success-600 dark:text-success-400': trend > 0, 'text-error-600 dark:text-error-400': trend < 0 }">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path [attr.d]="trend > 0 ? 'M7 17L17 7M17 7H7M17 7V17' : 'M17 7L7 17M7 17H17M7 17V7'"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-xs font-semibold">{{ Math.abs(trend) }}%</span>
          </div>
        }
      </div>
    </div>
  `
})
export class StatCardComponent {
  @Input() value: string | number = 0;
  @Input() label = '';
  @Input() icon = 'grid';
  @Input() color: 'brand' | 'success' | 'warning' | 'error' | 'blue-light' | 'orange' | 'pink' = 'brand';
  @Input() trend?: number;
  Math = Math;

  get iconClass(): string {
    const map: Record<string, string> = {
      'brand': 'bg-brand-500',
      'success': 'bg-success-500',
      'warning': 'bg-warning-500',
      'error': 'bg-error-500',
      'blue-light': 'bg-blue-light-500',
      'orange': 'bg-orange-500',
      'pink': 'bg-theme-pink-500'
    };
    return map[this.color] || 'bg-brand-500';
  }

  get iconSvg(): string {
    const icons: Record<string, string> = {
      grid: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      dollar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      chart: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18M7 16l4-4 4 4 5-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      folder: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      clock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 6v6l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
      check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      bug: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 2v4M16 2v4M9 13h6M9 17h6M12 8c-4.42 0-8 2.24-8 5v3c0 2.76 3.58 5 8 5s8-2.24 8-5v-3c0-2.76-3.58-5-8-5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
    };
    return icons[this.icon] || icons['grid'];
  }
}
