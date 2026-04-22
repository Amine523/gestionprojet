import { Component, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `

    @if (isOpen) {
      <div class="fixed inset-0 z-[1000] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
        (click)="onClose.emit()">
        <div [ngClass]="dialogClass" (click)="$event.stopPropagation()"
          class="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl max-h-[90vh] flex flex-col w-full">
          @if (header) {
            <div [ngClass]="headerClass" class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 class="text-lg font-semibold">{{ header }}</h3>
              <button (click)="onClose.emit()"
                class="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          }
          <div class="p-6 overflow-y-auto flex-1">
            <ng-content></ng-content>
          </div>
          @if (showFooter) {
            <div class="flex justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 rounded-b-xl">
              <ng-content select="[footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() header?: string;
  @Input() headerVariant: 'default' | 'danger' = 'default';
  @Input() showFooter = false;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

  onClose = output<void>();

  get dialogClass(): string {
    const sizeMap: Record<string, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-lg',
      'lg': 'max-w-2xl',
      'xl': 'max-w-4xl',
    };
    return sizeMap[this.size] || 'max-w-lg';
  }

  get headerClass(): string {
    return this.headerVariant === 'danger'
      ? 'bg-error-500 text-white border-error-600'
      : 'text-gray-800 dark:text-white';
  }
}
