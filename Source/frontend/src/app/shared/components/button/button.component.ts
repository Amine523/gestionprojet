import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `

    <button [ngClass]="btnClass" [disabled]="disabled" (click)="onClick.emit($event)">
      <span [innerHTML]="iconSvg" *ngIf="icon"></span>
      @if (content) {
        <span>{{ content }}</span>
      }
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'brand' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline' = 'brand';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon?: string;
  @Input() content?: string;
  @Input() disabled = false;
  @Input() fullWidth = false;

  onClick = output<Event>();

  get btnClass(): string {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 cursor-pointer';
    const sizeMap: Record<string, string> = {
      'sm': 'px-3 py-1.5 text-sm',
      'md': 'px-4 py-2.5 text-sm',
      'lg': 'px-6 py-3 text-base',
    };
    const variantMap: Record<string, string> = {
      'brand': 'bg-brand-500 text-white hover:bg-brand-700 active:scale-95',
      'secondary': 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
      'danger': 'bg-error-500 text-white hover:bg-error-700 active:scale-95',
      'success': 'bg-success-500 text-white hover:bg-success-700 active:scale-95',
      'ghost': 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800',
      'outline': 'border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    };
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
    const widthClass = this.fullWidth ? 'w-full' : '';
    return `${base} ${sizeMap[this.size]} ${variantMap[this.variant]} ${disabledClass} ${widthClass}`;
  }

  get iconSvg(): string {
    const icons: Record<string, string> = {
      plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      download: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      filter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
      eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5"/></svg>`,
      x: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    };
    return icons[this.icon || ''] || '';
  }
}
