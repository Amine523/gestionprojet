import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="metric-card">
      <div class="metric-header">
        <div class="metric-icon" [ngClass]="computedIconBgClass">
          <i [class]="computedIconClass + ' ' + computedIconColorClass"></i>
        </div>
        @if (trend) {
          <div class="metric-trend" [ngClass]="isPositive ? 'trend-positive' : 'trend-negative'">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path [attr.d]="isPositive ? 'M7 17L17 7M17 7H7M17 7V17' : 'M17 7L7 17M7 17H17M7 17V7'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ trend }}
          </div>
        }
      </div>
      <div class="metric-content">
        <p class="metric-label">{{ computedLabel }}</p>
        <h3 class="metric-value">{{ value }}</h3>
      </div>
    </div>
  `,
  styles: [`
    .metric-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .metric-card:hover {
      box-shadow: var(--shadow-md);
    }

    .metric-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-md);
    }

    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.5s;
    }

    .metric-card:hover .metric-icon {
      transform: scale(1.1);
    }

    .metric-icon i {
      font-size: 24px;
    }

    .metric-trend {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .trend-positive {
      background: #d1fae5;
      color: #059669;
    }

    .trend-negative {
      background: #fee2e2;
      color: #dc2626;
    }

    .metric-content {
      display: flex;
      flex-direction: column;
    }

    .metric-label {
      font-size: 10px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: var(--space-xs);
    }

    .metric-value {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      letter-spacing: -1px;
    }

    /* Icon background colors */
    .bg-indigo {
      background: #e0e7ff;
    }

    .bg-blue {
      background: #dbeafe;
    }

    .bg-emerald {
      background: #d1fae5;
    }

    .bg-rose {
      background: #fee2e2;
    }

    .bg-orange {
      background: #ffedd5;
    }

    .bg-purple {
      background: #f3e8ff;
    }

    .bg-sky {
      background: #e0f2fe;
    }

    .bg-amber {
      background: #fef3c7;
    }

    /* Icon text colors */
    .text-indigo {
      color: #4f46e5;
    }

    .text-blue {
      color: #2563eb;
    }

    .text-emerald {
      color: #059669;
    }

    .text-rose {
      color: #dc2626;
    }

    .text-orange {
      color: #ea580c;
    }

    .text-purple {
      color: #9333ea;
    }

    .text-sky {
      color: #0284c7;
    }

    .text-amber {
      color: #d97706;
    }

    /* Dark mode */
    :host-context(.dark) .metric-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .metric-value {
      color: var(--color-text);
    }

    :host-context(.dark) .bg-indigo {
      background: rgba(79, 70, 229, 0.1);
    }

    :host-context(.dark) .bg-blue {
      background: rgba(37, 99, 235, 0.1);
    }

    :host-context(.dark) .bg-emerald {
      background: rgba(5, 150, 105, 0.1);
    }

    :host-context(.dark) .bg-rose {
      background: rgba(220, 38, 38, 0.1);
    }

    :host-context(.dark) .bg-orange {
      background: rgba(234, 88, 12, 0.1);
    }

    :host-context(.dark) .bg-purple {
      background: rgba(147, 51, 234, 0.1);
    }

    :host-context(.dark) .bg-sky {
      background: rgba(2, 132, 199, 0.1);
    }

    :host-context(.dark) .bg-amber {
      background: rgba(217, 119, 6, 0.1);
    }

    :host-context(.dark) .text-indigo {
      color: #818cf8;
    }

    :host-context(.dark) .text-blue {
      color: #60a5fa;
    }

    :host-context(.dark) .text-emerald {
      color: #34d399;
    }

    :host-context(.dark) .text-rose {
      color: #f87171;
    }

    :host-context(.dark) .text-orange {
      color: #fb923c;
    }

    :host-context(.dark) .text-purple {
      color: #c084fc;
    }

    :host-context(.dark) .text-sky {
      color: #38bdf8;
    }

    :host-context(.dark) .text-amber {
      color: #fbbf24;
    }

    :host-context(.dark) .trend-positive {
      background: rgba(5, 150, 105, 0.1);
      color: #34d399;
    }

    :host-context(.dark) .trend-negative {
      background: rgba(220, 38, 38, 0.1);
      color: #f87171;
    }
  `]
})
export class MetricCardComponent {
  @Input() label: string = '';
  @Input() title: string = '';
  @Input() value: string | number = '';
  @Input() iconClass: string = '';
  @Input() iconBgClass: string = 'bg-indigo-50 dark:bg-indigo-500/10';
  @Input() iconColorClass: string = 'text-indigo-600 dark:text-indigo-400';
  @Input() trend?: string | number;
  @Input() isPositive: boolean = true;
  @Input() icon: string = '';
  @Input() color: string = '';

  get computedLabel(): string {
    return this.title || this.label;
  }

  get computedIconClass(): string {
    if (this.icon) return this.icon;
    return this.iconClass;
  }

  get computedIconBgClass(): string {
    if (this.color) {
      const colorMap: { [key: string]: string } = {
        indigo: 'bg-indigo',
        blue: 'bg-blue',
        emerald: 'bg-emerald',
        rose: 'bg-rose',
        orange: 'bg-orange',
        purple: 'bg-purple',
        sky: 'bg-sky',
        amber: 'bg-amber'
      };
      return colorMap[this.color] || 'bg-indigo';
    }
    return 'bg-indigo';
  }

  get computedIconColorClass(): string {
    if (this.color) {
      const colorMap: { [key: string]: string } = {
        indigo: 'text-indigo',
        blue: 'text-blue',
        emerald: 'text-emerald',
        rose: 'text-rose',
        orange: 'text-orange',
        purple: 'text-purple',
        sky: 'text-sky',
        amber: 'text-amber'
      };
      return colorMap[this.color] || 'text-indigo';
    }
    return 'text-indigo';
  }
}
