import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `

    <span [ngClass]="badgeClass">
      {{ content }}
    </span>
  `
})
export class BadgeComponent {
  @Input() variant: 'success' | 'warning' | 'error' | 'brand' | 'info' | 'secondary' | 'purple' | 'pink' |
    'solid-success' | 'solid-warning' | 'solid-error' | 'solid-brand' | 'solid-info' = 'brand';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get badgeClass(): string {
    const base = 'inline-flex items-center font-semibold rounded-full';
    const sizeMap: Record<string, string> = {
      'sm': 'px-2.5 py-0.5 text-[11px]',
      'md': 'px-3 py-1 text-xs',
      'lg': 'px-4 py-1.5 text-sm',
    };
    const variantMap: Record<string, string> = {
      'success': 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400',
      'warning': 'bg-warning-50 text-warning-700 dark:bg-warning-500/10 dark:text-warning-400',
      'error': 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400',
      'brand': 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400',
      'info': 'bg-blue-light-50 text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-400',
      'secondary': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
      'purple': 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
      'pink': 'bg-pink-50 text-pink-700 dark:bg-pink-500/10 dark:text-pink-400',
      'solid-success': 'bg-success-500 text-white',
      'solid-warning': 'bg-warning-500 text-white',
      'solid-error': 'bg-error-500 text-white',
      'solid-brand': 'bg-brand-500 text-white',
      'solid-info': 'bg-blue-light-500 text-white',
    };
    return `${base} ${sizeMap[this.size]} ${variantMap[this.variant] || variantMap['brand']}`;
  }
}
