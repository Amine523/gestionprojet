import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="relative overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group bg-white dark:bg-slate-800 rounded-2xl">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <div [class]="'p-3 rounded-xl ' + colorClass + ' bg-opacity-10 text-' + colorClass">
            <mat-icon>{{ icon }}</mat-icon>
          </div>
          @if (trend !== undefined) {
            <div [class]="'flex items-center text-sm font-semibold ' + (trend >= 0 ? 'text-emerald-500' : 'text-rose-500')">
              <mat-icon class="text-sm h-4 w-4 mr-1">{{ trend >= 0 ? 'trending_up' : 'trending_down' }}</mat-icon>
              {{ trend >= 0 ? '+' : '' }}{{ trend }}%
            </div>
          }
        </div>
        
        <div>
          <h3 class="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{{ label }}</h3>
          <div class="flex items-baseline space-x-2">
            <span class="text-2xl font-bold text-slate-900 dark:text-white">{{ value }}</span>
            @if (suffix) {
              <span class="text-slate-400 text-sm font-normal">{{ suffix }}</span>
            }
          </div>
        </div>
      </div>
      
      <!-- Subtle background decoration -->
      <div [class]="'absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500 ' + colorBg"></div>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }
    .bg-indigo { background-color: #6366f1; }
    .text-indigo { color: #6366f1; }
    .bg-emerald { background-color: #10b981; }
    .text-emerald { color: #10b981; }
    .bg-amber { background-color: #f59e0b; }
    .text-amber { color: #f59e0b; }
    .bg-rose { background-color: #f43f5e; }
    .text-rose { color: #f43f5e; }
    .bg-sky { background-color: #0ea5e9; }
    .text-sky { color: #0ea5e9; }
  `]
})
export class KpiCardComponent {
  @Input() label: string = '';
  @Input() value: string | number = 0;
  @Input() icon: string = 'show_chart';
  @Input() trend?: number;
  @Input() suffix: string = '';
  @Input() color: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' = 'indigo';

  get colorClass() { return this.color; }
  get colorBg() { return 'bg-' + this.color; }
}
