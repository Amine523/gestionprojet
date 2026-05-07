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
            <span class="badge badge-primary">Plateforme Nadhemni v8.2</span>
            <span class="badge badge-success">
              <span class="status-dot"></span>
              SYSTÈME OPÉRATIONNEL
            </span>
          </div>
          <h1 class="header-title">
            TABLEAU DE BORD <span class="gradient-text">ADMINISTRATION</span>
          </h1>
          <p class="header-subtitle">
            Supervision globale de l'écosystème : gestion des sociétés, monitoring des performances et historique des activités.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="exportToCSV()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Exporter Données
          </button>
          <button (click)="loadData()" class="btn-icon btn-ghost">
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
            [title]="stat.title"
            [value]="stat.value.toString()"
            [icon]="'bi-' + stat.icon"
            [color]="getMetricColor(stat.color)"
            [trend]="stat.change || 'Stable'"
            [isPositive]="stat.changeUp ?? true">
          </app-metric-card>
        }
      </div>

      <div class="dashboard-grid">
        <!-- Main Content Area -->
        <div class="main-content">
          <!-- Historique des Activités -->
          <div class="card card-activities">
            <div class="card-header">
              <div class="card-title">
                <h3>Historique des Activités</h3>
                <p class="card-subtitle">Journal des événements récents</p>
              </div>
              <div class="card-actions">
                <div class="search-box">
                  <i class="bi bi-search"></i>
                  <input type="text" placeholder="Filtrer..." (input)="onFilterActivities($event)">
                </div>
              </div>
            </div>
            
            <div class="table-container">
              <table class="premium-table">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Action & Ressource</th>
                    <th>Utilisateur</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  @for (act of filteredActivities; track act.id) {
                    <tr>
                      <td>
                        <span class="badge" [ngClass]="getTypeBadgeClass(act.type)">
                          {{act.type}}
                        </span>
                      </td>
                      <td>
                        <div class="action-info">
                          <span class="action-name">{{act.action}}</span>
                          <span class="resource-name">{{act.ressource}}</span>
                        </div>
                      </td>
                      <td>
                        <div class="user-chip">
                          <div class="user-avatar" [style.background-color]="getUserColor(act.utilisateur)">
                            {{act.utilisateur.charAt(0).toUpperCase()}}
                          </div>
                          <span>{{act.utilisateur}}</span>
                        </div>
                      </td>
                      <td class="date-cell">
                        <span class="time-text">{{act.date | date:'HH:mm'}}</span>
                        <span class="date-text">{{act.date | date:'dd/MM'}}</span>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="4" class="empty-state-row">
                        <i class="bi bi-journal-x"></i>
                        <p>Aucune activité enregistrée</p>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
            
            <div class="card-footer">
              <div class="pagination">
                <span class="page-info">Page 1 sur 3</span>
                <div class="page-controls">
                  <button class="btn-page disabled"><i class="bi bi-chevron-left"></i></button>
                  <button class="btn-page active">1</button>
                  <button class="btn-page">2</button>
                  <button class="btn-page">3</button>
                  <button class="btn-page"><i class="bi bi-chevron-right"></i></button>
                </div>
              </div>
            </div>
          </div>

          <!-- Charts Row -->
          <div class="charts-row">
            <div class="card chart-card">
              <div class="card-header">
                <h3>Croissance Sociétés</h3>
              </div>
              <div class="chart-container">
                <canvas #societiesChart></canvas>
              </div>
            </div>
            <div class="card chart-card">
              <div class="card-header">
                <h3>Distribution Utilisateurs</h3>
              </div>
              <div class="chart-container">
                <canvas #usersChart></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Area -->
        <div class="sidebar">
          <!-- Demandes en attente -->
          <div class="card card-requests">
            <div class="card-header">
              <h3>Demandes Sociétés</h3>
              <span class="badge badge-warning">{{demandes.length}}</span>
            </div>
            <div class="requests-list">
              @for (d of demandes; track d.id) {
                <div class="request-item">
                  <div class="request-icon">
                    <i class="bi bi-building-add"></i>
                  </div>
                  <div class="request-content">
                    <h4>{{d.titre || d.Titre || d.nom || d.Nom || 'Nouvelle Société'}}</h4>
                    <p>{{d.adminEmail || d.email || d.Email || 'Contact en attente'}}</p>
                  </div>
                  <div class="request-actions">
                    <button (click)="traiterDemande(d.id || d.Id, true)" class="btn-action approve">
                      <i class="bi bi-check2"></i>
                    </button>
                    <button (click)="traiterDemande(d.id || d.Id, false)" class="btn-action reject">
                      <i class="bi bi-x-lg"></i>
                    </button>
                  </div>
                </div>
              } @empty {
                <div class="empty-sidebar-state">
                  <i class="bi bi-check-circle"></i>
                  <p>Toutes les demandes ont été traitées</p>
                </div>
              }
            </div>
          </div>

          <!-- Alertes Système -->
          <div class="card card-alerts">
            <div class="card-header">
              <h3>Alertes Système</h3>
              <a routerLink="/super-admin/notifications" class="view-all">Voir tout</a>
            </div>
            <div class="alerts-list">
              @for (alert of alerts; track alert.title) {
                <div class="alert-item" [ngClass]="'alert-' + alert.type">
                  <div class="alert-indicator"></div>
                  <div class="alert-body">
                    <span class="alert-title">{{alert.title}}</span>
                    <p class="alert-msg">{{alert.message}}</p>
                    <span class="alert-time">{{alert.time}}</span>
                  </div>
                </div>
              } @empty {
                <div class="empty-sidebar-state">
                  <i class="bi bi-shield-check"></i>
                  <p>Aucune alerte critique</p>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem;
      max-width: 1600px;
      margin: 0 auto;
    }

    /* Header Styling */
    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: 24px;
      padding: 3rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }

    .dashboard-header::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      width: 40%;
      background: radial-gradient(circle at top right, rgba(59, 130, 246, 0.15), transparent 70%);
    }

    .header-title {
      font-size: 2.5rem;
      font-weight: 800;
      color: white;
      margin: 0.5rem 0;
      letter-spacing: -0.025em;
    }

    .gradient-text {
      background: linear-gradient(to right, #60a5fa, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      max-width: 600px;
      font-size: 1.1rem;
    }

    .header-badges {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .badge {
      padding: 0.4rem 0.8rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .badge-primary { background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3); }
    .badge-success { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-warning { background: rgba(245, 158, 11, 0.15); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }
    .badge-danger { background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-info { background: rgba(139, 92, 246, 0.15); color: #a78bfa; border: 1px solid rgba(139, 92, 246, 0.3); }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
      70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .header-actions {
      display: flex;
      gap: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.2s;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: white;
      color: #0f172a;
    }

    .btn-primary:hover {
      background: #f8fafc;
      transform: translateY(-2px);
    }

    .btn-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    /* Grid Layout */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 2rem;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    /* Card Styling */
    .card {
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0.25rem 0 0;
    }

    /* Activity Table */
    .table-container {
      overflow-x: auto;
    }

    .premium-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .premium-table th {
      padding: 1rem 1.5rem;
      background: #f8fafc;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      border-bottom: 1px solid #f1f5f9;
    }

    .premium-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .action-info {
      display: flex;
      flex-direction: column;
    }

    .action-name {
      font-weight: 600;
      color: #1e293b;
    }

    .resource-name {
      font-size: 0.8rem;
      color: #3b82f6;
    }

    .user-chip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 500;
      color: #334155;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 0.875rem;
    }

    .date-cell {
      display: flex;
      flex-direction: column;
    }

    .time-text {
      font-weight: 600;
      color: #1e293b;
    }

    .date-text {
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Requests List */
    .requests-list {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .request-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .request-item:hover {
      border-color: #cbd5e1;
      background: #f1f5f9;
    }

    .request-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }

    .request-content {
      flex: 1;
    }

    .request-content h4 {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 700;
      color: #1e293b;
    }

    .request-content p {
      margin: 0;
      font-size: 0.75rem;
      color: #64748b;
    }

    .request-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-action.approve { background: rgba(16, 185, 129, 0.1); color: #10b981; }
    .btn-action.approve:hover { background: #10b981; color: white; }
    .btn-action.reject { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    .btn-action.reject:hover { background: #ef4444; color: white; }

    /* Alert Items */
    .alerts-list {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .alert-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: 12px;
      background: #fefce8;
      border: 1px solid #fef08a;
      position: relative;
      overflow: hidden;
    }

    .alert-item.alert-error { background: #fef2f2; border-color: #fecaca; }
    .alert-item.alert-info { background: #f0f9ff; border-color: #bae6fd; }

    .alert-indicator {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: #eab308;
    }

    .alert-error .alert-indicator { background: #ef4444; }
    .alert-info .alert-indicator { background: #0ea5e9; }

    .alert-title {
      display: block;
      font-weight: 700;
      font-size: 0.85rem;
      color: #1e293b;
      margin-bottom: 0.25rem;
    }

    .alert-msg {
      font-size: 0.75rem;
      color: #475569;
      margin: 0;
      line-height: 1.4;
    }

    .alert-time {
      font-size: 0.7rem;
      color: #94a3b8;
      margin-top: 0.5rem;
      display: block;
    }

    .view-all {
      font-size: 0.75rem;
      font-weight: 600;
      color: #3b82f6;
      text-decoration: none;
    }

    /* Search Box */
    .search-box {
      position: relative;
      width: 250px;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-box input {
      width: 100%;
      padding: 0.6rem 1rem 0.6rem 2.5rem;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
      font-size: 0.875rem;
      transition: all 0.2s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Charts Row */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    .chart-container {
      padding: 1.5rem;
      height: 300px;
    }

    /* Pagination */
    .card-footer {
      padding: 1rem 1.5rem;
      border-top: 1px solid #f1f5f9;
      background: #f8fafc;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-info {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
    }

    .page-controls {
      display: flex;
      gap: 0.5rem;
    }

    .btn-page {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      background: white;
      color: #475569;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-page:hover:not(.disabled) {
      border-color: #3b82f6;
      color: #3b82f6;
    }

    .btn-page.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .btn-page.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .empty-sidebar-state {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
    }

    .empty-sidebar-state i {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      display: block;
    }

    .empty-state-row {
      padding: 4rem !important;
      text-align: center;
      color: #94a3b8;
    }

    .empty-state-row i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    @media (max-width: 1200px) {
      .dashboard-grid { grid-template-columns: 1fr; }
      .charts-row { grid-template-columns: 1fr; }
    }

    @media (max-width: 768px) {
      .dashboard-header { flex-direction: column; align-items: flex-start; padding: 2rem; }
      .header-actions { margin-top: 1.5rem; width: 100%; }
      .header-actions .btn { flex: 1; }
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
    { title: 'Sociétés', value: 0, icon: 'building', color: '#3b82f6', change: 'En attente...', changeUp: true },
    { title: 'Utilisateurs', value: 0, icon: 'people', color: '#10b981', change: 'Système nominal', changeUp: true },
    { title: 'Abonnements', value: 0, icon: 'credit-card', color: '#f59e0b', change: '0 DT', changeUp: true },
    { title: 'Alertes', value: 0, icon: 'exclamation-triangle', color: '#ef4444', change: 'Aucune critique', changeUp: false }
  ];
  
  revenue = 0;
  currentFilter = 'month';
  societies: any[] = [];
  demandes: any[] = [];
  alerts: AlertItem[] = [];
  revenueByMonth: any[] = [];
  
  activities: any[] = [];
  filteredActivities: any[] = [];

  ngOnInit() {
    this.loadData();
    // Auto-refresh stats every 5 minutes
    setInterval(() => this.loadData(), 300000);
  }

  ngAfterViewInit() {
    setTimeout(() => this.initCharts(), 500);
  }

  getMetricColor(color: string): string {
    if (color === '#3b82f6') return 'indigo';
    if (color === '#10b981') return 'emerald';
    if (color === '#f59e0b') return 'amber';
    if (color === '#ef4444') return 'rose';
    return 'slate';
  }

  initCharts() {
    // Societies Growth Chart
    if (this.societiesChartRef?.nativeElement) {
      this.api.getSocietesParMois().subscribe(data => {
        const labels = data?.map((d: any) => d.name) || ['Jan', 'Fev', 'Mar', 'Avr', 'Mai'];
        const values = data?.map((d: any) => d.count) || [10, 15, 8, 22, 18];
        
        new Chart(this.societiesChartRef.nativeElement, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'Nouvelles Sociétés',
              data: values,
              backgroundColor: '#3b82f6',
              borderRadius: 8,
              barThickness: 20
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
              y: { beginAtZero: true, grid: { display: false } },
              x: { grid: { display: false } }
            }
          }
        });
      });
    }

    // User Distribution Chart
    if (this.usersChartRef?.nativeElement) {
      this.api.getUtilisateursParType().subscribe(data => {
        const labels = data?.map((d: any) => d.type) || ['Admin', 'RH', 'Chef', 'Dev'];
        const values = data?.map((d: any) => d.count) || [5, 12, 20, 50];
        
        new Chart(this.usersChartRef.nativeElement, {
          type: 'doughnut',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
              borderWidth: 0,
              hoverOffset: 10
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            },
            cutout: '70%'
          }
        });
      });
    }
  }

  loadData() {
    // 1. Stats Globales Réelles
    this.api.getDashboardStats().subscribe({
      next: (data: any) => {
        if (data) {
          this.stats[0].value = data.totalSocietes || 0;
          this.stats[0].change = `${data.societesActives || 0} actives`;
          
          this.stats[1].value = data.totalUtilisateurs || 0;
          this.stats[1].change = `${data.utilisateursActifs || 0} actifs`;
          
          this.stats[2].value = data.totalProjets || 0;
          this.stats[2].change = `${data.revenusMensuels || 0} DT / mois`;
        }
      }
    });

    // 2. Activités Récentes (Données réelles)
    this.api.getActiviteRecente(10).subscribe({
      next: (data: any[]) => {
        this.activities = (data || []).map(a => ({
          id: a.id || Math.random().toString(36).substr(2, 9),
          type: a.type || 'SYSTÈME',
          action: a.action || 'Action enregistrée',
          ressource: a.nom || '-',
          utilisateur: a.utilisateur || 'Système',
          date: a.date || new Date()
        })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        this.filteredActivities = [...this.activities];
      }
    });

    // 3. Demandes en attente (Données réelles)
    this.api.getDemandesSociete().subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.items || res?.value || []);
        this.demandes = list.filter((d: any) => {
          const s = (d.statut || d.Statut || '').toString().toLowerCase();
          return s.includes('attente') || s.includes('pending');
        });
      }
    });

    // 4. Alertes (Données réelles)
    this.api.getAlertes().subscribe(data => {
      this.alerts = (data || []).map((a: any) => ({
        title: a.type || 'Alerte Système',
        message: a.message || 'Vérification requise',
        type: (a.type || '').toLowerCase().includes('erreur') ? 'error' : 'warning',
        time: 'En direct'
      }));
      this.stats[3].value = this.alerts.length;
    });
  }

  onFilterActivities(event: any) {
    const query = event.target.value.toLowerCase();
    this.filteredActivities = this.activities.filter(a => 
      a.type.toLowerCase().includes(query) || 
      a.action.toLowerCase().includes(query) || 
      a.ressource.toLowerCase().includes(query) ||
      a.utilisateur.toLowerCase().includes(query)
    );
  }

  getTypeBadgeClass(type: string): string {
    const t = type.toLowerCase();
    if (t.includes('recrutement')) return 'badge-info';
    if (t.includes('societe') || t.includes('entreprise')) return 'badge-primary';
    if (t.includes('projet')) return 'badge-warning';
    if (t.includes('utilisateur')) return 'badge-success';
    return 'badge-primary';
  }

  getUserColor(name: string): string {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  traiterDemande(id: string, approuver: boolean) {
    this.api.traiterDemandeSociete(id, approuver).subscribe({
      next: (res) => {
        this.snackBar.open(approuver ? 'Demande approuvée' : 'Demande refusée', 'Fermer', { duration: 3000 });
        this.loadData();
      },
      error: () => this.snackBar.open('Erreur lors du traitement', 'Fermer', { duration: 3000 })
    });
  }

  exportToCSV() {
    const data = this.activities.map(a => ({
      Date: new Date(a.date).toLocaleString(),
      Type: a.type,
      Action: a.action,
      Ressource: a.ressource,
      Utilisateur: a.utilisateur
    }));
    ExportUtils.exportToCSV(data, 'SuperAdmin_Activities');
    this.snackBar.open('Export réussi', 'Fermer', { duration: 2000 });
  }
}

