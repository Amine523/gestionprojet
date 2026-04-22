import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-gray-200 dark:border-gray-800">
            @for (column of columns; track column.key) {
              <th [class.cursor-pointer]="column.sortable"
                class="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ column.label }}
              </th>
            }
          </tr>
        </thead>
        <tbody>
          @for (row of data; track row.id; let i = $index) {
            <tr class="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              @for (column of columns; track column.key) {
                <td [ngClass]="cellClass" class="text-sm text-gray-700 dark:text-gray-300">
                  {{ row[column.key] }}
                </td>
              }
            </tr>
          }
        </tbody>
      </table>

      @if (data.length === 0) {
        <div class="text-center py-12 text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" class="mx-auto mb-4">
            <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.3"/>
          </svg>
          <p class="text-sm">Aucune donnée disponible</p>
        </div>
      }
    </div>
  `
})
export class TableComponent {
  @Input() columns: Array<{ label: string; key: string; sortable?: boolean }> = [];
  @Input() data: any[] = [];
  @Input() variant: 'default' | 'compact' = 'default';

  get cellClass(): string {
    return this.variant === 'compact' ? 'px-4 py-2' : 'px-5 py-4';
  }
}
