import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="flex flex-col gap-1.5">
      @if (label) {
        <label class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
      }
      <div class="relative">
        @if (type === 'textarea') {
          <textarea
            [placeholder]="placeholder"
            [value]="value"
            (input)="onInput.emit($event)"
            [rows]="rows"
            [disabled]="disabled"
            [readonly]="readonly"
            [ngClass]="inputClass"
            class="w-full rounded-lg border bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none"
          ></textarea>
        } @else {
          <input
            [type]="type || 'text'"
            [placeholder]="placeholder"
            [value]="value"
            (input)="onInput.emit($event)"
            [disabled]="disabled"
            [readonly]="readonly"
            [ngClass]="inputClass"
            class="w-full rounded-lg border bg-white dark:bg-gray-900 text-gray-800 dark:text-white/90 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all"
          />
        }
        @if (suffix) {
          <span class="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">{{ suffix }}</span>
        }
      </div>
      @if (error) {
        <span class="text-xs text-error-500">{{ error }}</span>
      }
      @if (hint && !error) {
        <span class="text-xs text-gray-500">{{ hint }}</span>
      }
    </div>
  `
})
export class InputComponent {
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() value = '';
  @Input() type?: 'text' | 'email' | 'password' | 'number' | 'textarea';
  @Input() suffix?: string;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() rows = 4;

  onInput = output<Event>();

  get inputClass(): string {
    const borderClass = this.error ? 'border-error-500' : 'border-gray-300 dark:border-gray-700';
    const sizeMap: Record<string, string> = {
      'sm': 'px-3 py-1.5 text-sm',
      'md': 'px-4 py-2.5 text-sm',
      'lg': 'px-5 py-3 text-base',
    };
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : '';
    const readonlyClass = this.readonly ? 'bg-gray-50 dark:bg-gray-800 cursor-default' : '';
    return `${borderClass} ${sizeMap[this.size]} ${disabledClass} ${readonlyClass}`;
  }
}
