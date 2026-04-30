import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { Chart, registerables } from 'chart.js';
import { ExportUtils } from '@core/utils/export.utils';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
Chart.register(...registerables);

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  change?: string;
  changeUp?: boolean;
}

interface AlertItem {
  id?: number;
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  time: string;
  date?: string;
}

import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Commandement Global v8.0</span>
            <span class="badge badge-success">
              <span class="status-dot"></span>
              SYSTÈME NOMINAL
            </span>
          </div>
          <h1 class="header-title">
            SURVEILLANCE <span class="gradient-text">ÉCOSYSTÈME</span>
          </h1>
          <p class="header-subtitle">
            Surveillance multi-tenant en temps réel, performance financière et santé de l'infrastructure à travers l'écosystème SaaS Nadhemni.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="exportToCSV()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter Analyses
          </button>
          <button (click)="loadData()" class="btn-icon btn-ghost btn-white">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 4v6h-6"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
          </button>
        </div>
      </header>



      <!-- Critical Metrics Grid -->
      <div class="metrics-grid">
        @for (stat of stats; track stat.title) {
          <app-metric-card
            [title]="stat.title.toUpperCase()"
            [value]="stat.value.toString()"
            [icon]="'bi-' + stat.icon"
            [color]="stat.color === '#3b82f6' ? 'indigo' : stat.color === '#10b981' ? 'emerald' : stat.color === '#f59e0b' ? 'amber' : 'rose'"
            [trend]="stat.change || 'N/A'"
            [isPositive]="stat.changeUp ?? true">
          </app-metric-card>
        }
      </div>

      <div class="dashboard-grid">


        <!-- Demandes de création de société -->
        <div class="card card-requests">
          <div class="card-header">
            <h3>Demandes de création de société</h3>
            <span class="badge badge-warning">{{demandes.length}} En attente</span>
          </div>
          <div class="requests-list">
            @for (d of demandes; track d.id) {
              <div class="request-item">
                <div class="request-info">
                  <h4>{{d.titre || d.Titre || 'Sans titre'}}</h4>
                  <p>{{d.statut || d.Statut}} - {{d.type || d.Type}}</p>
                </div>
                <div class="request-actions">
                  <button (click)="traiterDemande(d.id || d.Id, true)" class="btn-action approve" title="Approuver">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </button>
                  <button (click)="traiterDemande(d.id || d.Id, false)" class="btn-action reject" title="Refuser">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                  </button>
                </div>
              </div>
            } @empty {
              <div class="empty-state">
                <p>Aucune demande en attente</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-danger {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge-gray {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #3b82f6, #06b6d4);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
      position: relative;
      z-index: 1;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: white;
      color: #0f172a;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .card-uptime {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--space-lg);
      border-left: 4px solid #3b82f6;
    }

    .uptime-content {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .uptime-icon {
      width: 64px;
      height: 64px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .uptime-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .uptime-value {
      display: flex;
      align-items: baseline;
      gap: var(--space-sm);
    }

    .uptime-percent {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .uptime-tag {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
    }

    .uptime-nodes {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .node-tag {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .uptime-last {
      border-left: 1px solid var(--color-border);
      padding-left: var(--space-lg);
    }

    .uptime-last-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .uptime-last-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--space-lg);
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .card-title h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: -0.01em;
    }

    .card-subtitle {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-xs) 0 0;
    }

    .card-tabs {
      display: flex;
      background: var(--color-bg);
      padding: var(--space-xs);
      border-radius: var(--radius-md);
      gap: var(--space-xs);
    }

    .card-tabs button {
      padding: var(--space-xs) var(--space-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .card-tabs button.active {
      background: white;
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }

    .revenue-display {
      display: flex;
      align-items: baseline;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .revenue-display h2 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .revenue-display span {
      font-size: var(--font-size-xl);
      color: var(--color-text-muted);
    }

    .trend-up {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      color: #10b981;
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
    }

    .chart-container {
      height: 300px;
      position: relative;
    }

    .chart-container.small {
      height: 200px;
    }

    .icon-box {
      width: 40px;
      height: 40px;
      background: rgba(59, 130, 246, 0.1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
    }

    .alerts-list {
      max-height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .alert-item {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: all var(--transition-base);
    }

    .alert-item:hover {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .alert-item.alert-error .alert-icon {
      color: #ef4444;
    }

    .alert-item.alert-warning .alert-icon {
      color: #f59e0b;
    }

    .alert-icon {
      flex-shrink: 0;
    }

    .alert-content {
      flex: 1;
      min-width: 0;
    }

    .alert-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .alert-message {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
      line-height: var(--line-height-normal);
    }

    .empty-alerts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      gap: var(--space-md);
      color: var(--color-text-muted);
    }

    .empty-alerts p {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      transition: all var(--transition-base);
    }

    .activity-item:hover {
      background: var(--color-bg);
      border-color: var(--color-border);
    }

    .activity-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform var(--transition-base);
    }

    .activity-item:hover .activity-icon {
      transform: scale(1.1);
    }

    .activity-icon.activity-user {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .activity-icon.activity-societe {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
    }

    .card-finance {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .finance-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .finance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .finance-societe {
      font-size: 0.85rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .finance-date {
      font-size: 0.75rem;
      color: #64748b;
      margin: 0;
    }

    .finance-amount {
      font-weight: 800;
      color: #10b981;
      font-size: 0.9rem;
    }

    .card-footer-action {
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
      text-align: center;
    }

    .card-footer-action .btn {
      width: 100%;
      color: #6366f1;
    }

    .activity-icon.activity-projet {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .activity-details {
      flex: 1;
      min-width: 0;
    }

    .activity-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .activity-item:hover .activity-title {
      color: #3b82f6;
    }

    .activity-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .activity-status {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-title h3 {
      color: var(--color-text);
    }

    :host-context(.dark) .revenue-display h2 {
      color: var(--color-text);
    }

    :host-context(.dark) .revenue-display span {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .alert-title,
    :host-context(.dark) .activity-title {
      color: var(--color-text);
    }

    :host-context(.dark) .uptime-percent {
      color: var(--color-text);
    }

    :host-context(.dark) .node-tag {
      background: rgba(255, 255, 255, 0.05);
      color: var(--color-text-muted);
    }

    :host-context(.dark) .activity-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .card-requests {
      border-left: 4px solid #f59e0b;
    }

    .requests-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .request-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
    }

    .request-info h4 {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .request-info p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .request-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .btn-action {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action.approve {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .btn-action.approve:hover {
      background: #10b981;
      color: white;
    }

    .btn-action.reject {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .btn-action.reject:hover {
      background: #ef4444;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: var(--space-xl);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .card-uptime {
        flex-direction: column;
        align-items: flex-start;
      }

      .uptime-last {
        border-left: none;
        padding-left: 0;
        border-top: 1px solid var(--color-border);
        padding-top: var(--space-md);
      }
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersChart') usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('societiesChart') societiesChartRef!: ElementRef<HTMLCanvasElement>;

  stats: StatCard[] = [
    { title: 'Sociétés', value: 0, icon: 'building', color: '#3b82f6', change: '0 actives', changeUp: true },
    { title: 'Utilisateurs', value: 0, icon: 'people', color: '#10b981', change: '0 actifs', changeUp: true },
    { title: 'Abonnements', value: 0, icon: 'credit-card', color: '#f59e0b', change: '0 DT', changeUp: true },
    { title: 'Alertes', value: 0, icon: 'exclamation-triangle', color: '#ef4444', change: 'À traiter', changeUp: false }
  ];
  revenue = 0;
  currentFilter = 'month';

  societies: any[] = [];
  demandes: any[] = [];
  alerts: AlertItem[] = [];
  revenueByMonth: any[] = [];
  activities: any[] = [];

  ngOnInit() {
    this.loadData();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initCharts(), 500);
  }

  initCharts() {
    if (this.revenueChartRef?.nativeElement) {
      this.api.getRevenus('year').subscribe({
        next: (data: any) => {
          const months = data?.byMonth || [];
          new Chart(this.revenueChartRef.nativeElement, {
            type: 'line',
            data: {
              labels: months.map((m: any) => m.name),
              datasets: [{
                label: 'Revenus (DT)',
                data: months.map((m: any) => m.percent * 100),
                borderColor: '#0284c7',
                backgroundColor: 'rgba(2, 132, 199, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
          });
        }
      });
    }

    this.api.getUtilisateursParType().subscribe({
      next: (data: any) => {
        if (this.usersChartRef?.nativeElement && data?.length > 0) {
          const labels = data.map((d: any) => d.type || 'Inconnu');
          const values = data.map((d: any) => d.count);
          new Chart(this.usersChartRef.nativeElement, {
            type: 'doughnut',
            data: {
              labels: labels,
              datasets: [{
                data: values,
                backgroundColor: ['#0284c7', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
              }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
          });
        }
      }
    });

    this.api.getSocietesParMois().subscribe({
      next: (data: any) => {
        if (this.societiesChartRef?.nativeElement && data?.length > 0) {
          const labels = data.map((d: any) => d.name);
          const values = data.map((d: any) => d.count);
          new Chart(this.societiesChartRef.nativeElement, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'Nouvelles sociétés',
                data: values,
                backgroundColor: '#0284c7'
              }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
          });
        }
      }
    });
  }

  loadData() {
    this.api.getDashboardStats().subscribe({
      next: (data: any) => {
        if (data) {
          // Mapping according to backend keys: TotalSocietes, TotalUtilisateurs, etc.
          this.stats[0].value = data.totalSocietes || data.TotalSocietes || 0;
          const actives = data.societesActives || data.SocietesActives || 0;
          this.stats[0].change = `${actives} actives`;
          
          this.stats[1].value = data.totalUtilisateurs || data.TotalUtilisateurs || 0;
          this.stats[1].change = `Tous les noeuds`;
          
          this.stats[2].value = data.totalProjets || data.TotalProjets || 0;
          this.stats[2].change = `${data.revenusMensuels || data.RevenusMensuels || 0} DT / mois`;
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des statistiques globales', 'Fermer', { duration: 3000 });
      }
    });

    this.api.getSocietesRecentes(5).subscribe({
      next: (data: any[]) => {
        this.societies = data || [];
      },
      error: () => {
        this.societies = [];
      }
    });

    this.api.getRevenus(this.currentFilter).subscribe({
      next: (data: any) => {
        this.revenue = data?.revenus || data?.Revenus || 0;
        this.revenueByMonth = data?.byMonth || [];
      },
      error: () => {
        this.revenue = 0;
        this.revenueByMonth = [];
      }
    });

    this.api.getAlertes().subscribe({
      next: (data: any[]) => {
        this.alerts = (data || []).map((a: any) => ({
          title: a.type || 'Alerte',
          message: a.message || 'Action requise',
          type: (a.type?.toLowerCase().includes('error') ? 'error' : 'warning') as 'error' | 'warning' | 'info',
          time: 'Récent'
        }));
        if (this.stats[3]) this.stats[3].value = this.alerts.length;
      },
      error: () => {
        this.alerts = [];
        if (this.stats[3]) this.stats[3].value = 0;
      }
    });


    this.api.getDemandesSociete().subscribe({
      next: (data) => {
        this.demandes = (data || []).filter(d => {
          const s = (d.statut || d.Statut || '').toString().toLowerCase();
          return s === 'en_attente' || s === 'en attente' || s === 'pending';
        });
      }
    });
  }

  traiterDemande(id: string, approuver: boolean) {
    this.api.traiterDemandeSociete(id, approuver).subscribe({
      next: (res) => {
        this.snackBar.open(res.message || 'Demande traitée', 'Fermer', { duration: 3000 });
        this.loadData();
        this.loadSocietes();
      },
      error: (err) => { 
        this.snackBar.open('Erreur lors du traitement : ' + (err.error || err.message || 'Serveur indisponible'), 'Fermer', { duration: 5000 });
        this.loadData();
      }
    });
  }


  loadSocietes() {
    this.api.getSocietesRecentes(5).subscribe({
      next: (data: any[]) => this.societies = data || []
    });
  }

  exportData() {
    const data = {
      exportDate: new Date().toISOString(),
      stats: this.stats,
      societes: this.societies,
      alertes: this.alerts,
      activities: this.activities
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `superadmin-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.snackBar.open('Données exportées avec succès!', 'Fermer', { duration: 3000 });
  }

  exportToCSV() {
    const data = this.societies.map(s => ({
      ID: s.id,
      Nom: s.Nom,
      Status: s.Actif ? 'Actif' : 'Inactif',
      Adresse: s.Adresse || 'N/A'
    }));

    ExportUtils.exportToCSV(data, 'SuperAdmin_Societes', {
      ID: 'Identifiant',
      Nom: 'Nom de la Société',
      Status: 'État Actuel',
      Adresse: 'Localisation'
    });

    this.snackBar.open('Export CSV réussi!', 'Fermer', { duration: 3000 });
  }

  filterRevenue(filter: string) {
    this.currentFilter = filter;
    this.api.getRevenus(filter).subscribe({
      next: (data: any) => {
        this.revenue = data?.total || 0;
        this.revenueByMonth = data?.byMonth || [];
        this.snackBar.open('Revenus: ' + this.getFilterLabel(), 'Fermer', { duration: 3000 });
      }
    });
  }

  getFilterLabel(): string {
    const labels: { [key: string]: string } = { month: 'CE MOIS', quarter: 'CE TRIMESTRE', year: 'CETTE ANNÉE' };
    return labels[this.currentFilter] || 'CE MOIS';
  }
}

