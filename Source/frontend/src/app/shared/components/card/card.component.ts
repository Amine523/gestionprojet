import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div [ngClass]="cardClass">
      @if (header) {
        <div class="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-3">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">{{ header }}</h3>
            @if (subtitle) {
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{{ subtitle }}</p>
            }
          </div>
          <ng-content select="[header-action]"></ng-content>
        </div>
      }
      <div class="p-5">
        <ng-content></ng-content>
      </div>
      @if (footer) {
        <div class="px-5 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl">
          <ng-content select="[footer]"></ng-content>
        </div>
      }
    </div>
  `
})
export class CardComponent {
  @Input() header?: string;
  @Input() subtitle?: string;
  @Input() footer?: string;
  @Input() variant: 'default' | 'glass' | 'solid' | 'gradient' = 'default';
  @Input() hoverable = false;

  get cardClass(): string {
    const base = 'rounded-xl border overflow-hidden';
    const variantMap: Record<string, string> = {
      'default': 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm',
      'glass': 'bg-white/80 dark:bg-white/5 backdrop-blur-xl border-white/20 dark:border-white/5',
      'solid': 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800',
      'gradient': 'bg-gradient-to-r from-brand-500 to-brand-700 text-white border-0',
    };
    const hover = this.hoverable ? 'transition-all duration-300 hover:shadow-md' : '';
    return `${base} ${variantMap[this.variant] || variantMap['default']} ${hover}`;
  }
}
