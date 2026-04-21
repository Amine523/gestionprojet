import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Chart, registerables } from 'chart.js';
import { ExportUtils } from '../../utils/export.utils';
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
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  time: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex justify-content-between align-items-end mb-4">
        <div>
          <h1 class="fw-bold mb-1" style="background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
            Surveillance Globale
          </h1>
          <p class="text-muted mb-0">Analyse en temps réel de l'écosystème SaaS Nadhemni</p>
        </div>
        <div class="d-flex gap-2">
          <div class="d-flex align-items-center gap-2 px-3 py-2 rounded-pill border" [class.bg-light]="revenue === 0">
            <span class="rounded-circle bg-success" style="width: 8px; height: 8px; box-shadow: 0 0 10px #16a34a; animation: pulse-glow 2s infinite;"></span>
            <span class="fw-bold text-uppercase" style="font-size: 11px; letter-spacing: 0.5px;">Système Connecté</span>
          </div>
          <button class="btn btn-primary" (click)="exportToCSV()">
            <i class="bi bi-download me-1"></i> Exporter CSV
          </button>
          <button class="btn btn-outline-primary" (click)="exportData()">
            <i class="bi bi-terminal me-1"></i> Log JSON
          </button>
        </div>
      </div>

      <!-- Uptime Strip -->
      <div class="card mb-4 border-start border-4 border-primary" [style.background]="'linear-gradient(90deg, #fff 0%, #f0f9ff 100%)'" *ngIf="uptimeData">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div class="d-flex align-items-center gap-3">
            <i class="bi bi-activity text-primary fs-2" style="animation: pulse-icon 2s infinite;"></i>
            <div>
              <div class="text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 1.5px; color: #64748b;">DISPONIBILITÉ SYSTÈME (uptime)</div>
              <div class="d-flex align-items-baseline gap-2">
                <span class="fs-4 fw-bold">{{uptimeData.percent}}%</span>
                <span class="badge bg-success rounded-pill" style="font-size: 11px;">{{uptimeData.status}}</span>
              </div>
            </div>
          </div>
          <div class="d-flex gap-2">
            @for (node of uptimeData.nodes; track node) {
              <span class="badge bg-white border rounded-pill px-3 py-2">
                <i class="bi bi-hdd text-primary me-1"></i>{{node}}
              </span>
            }
          </div>
          <div class="border-start ps-4">
            <div class="text-uppercase fw-bold" style="font-size: 10px; letter-spacing: 1.5px; color: #64748b;">DERNIÈRE INTERRUPTION</div>
            <div class="fw-bold" style="font-size: 13px;">{{uptimeData.lastOccurrence}}</div>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="row g-3 mb-4">
        @for (stat of stats; track stat.title) {
          <div class="col-lg-3 col-md-6">
            <div class="card border-0 shadow-sm h-100" [style.border-left]="'4px solid ' + stat.color" style="transition: transform 0.3s;">
              <div class="card-body d-flex align-items-center gap-3">
                <div class="rounded-3 d-flex align-items-center justify-content-center" [style.background]="stat.color + '22'" [style.color]="stat.color" style="width: 56px; height: 56px;">
                  <i class="bi bi-{{stat.icon}}" style="font-size: 24px;"></i>
                </div>
                <div>
                  <div class="text-uppercase fw-bold" style="font-size: 11px; letter-spacing: 0.5px; color: #64748b;">{{stat.title}}</div>
                  <h2 class="fw-bold mb-0" style="font-size: 28px; color: #1e293b;">{{stat.value}}</h2>
                  <div class="d-flex align-items-center gap-1" [class.text-success]="stat.changeUp" [class.text-danger]="!stat.changeUp" style="font-size: 11px; font-weight: 700;">
                    <i class="bi bi-{{stat.changeUp ? 'trend-up' : 'trend-down'}}"></i>
                    <span>{{stat.change}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Dashboard Grid -->
      <div class="row g-4">
        <div class="col-lg-8">
          <!-- Revenue Chart -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-body p-4">
              <div class="d-flex justify-content-between align-items-center mb-4">
                <h5 class="fw-bold mb-0">Revenu Mensuel Récurrent (RMR)</h5>
                <div class="btn-group" role="group">
                  <button type="button" class="btn btn-sm" [class.btn-primary]="currentFilter === 'month'" [class.btn-outline-secondary]="currentFilter !== 'month'" (click)="filterRevenue('month')">Mois</button>
                  <button type="button" class="btn btn-sm" [class.btn-primary]="currentFilter === 'quarter'" [class.btn-outline-secondary]="currentFilter !== 'quarter'" (click)="filterRevenue('quarter')">Trimestre</button>
                  <button type="button" class="btn btn-sm" [class.btn-primary]="currentFilter === 'year'" [class.btn-outline-secondary]="currentFilter !== 'year'" (click)="filterRevenue('year')">Année</button>
                </div>
              </div>
              <div class="mb-4">
                <div class="d-flex align-items-baseline gap-3">
                  <h1 class="fw-bold mb-0" style="font-size: 40px; background: linear-gradient(135deg, #0284c7 0%, #0891b2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{revenue | number:'1.0-0'}} DT</h1>
                  <span class="badge bg-success rounded-pill" style="font-size: 12px;">+12.4%</span>
                </div>
                <p class="text-muted mb-0" style="font-size: 14px; font-weight: 500;">Volume total des transactions pour {{getFilterLabel()}}</p>
              </div>
              <div style="height: 300px;">
                <canvas #revenueChart></canvas>
              </div>
            </div>
          </div>

          <!-- Sub Charts Row -->
          <div class="row g-4">
            <div class="col-md-6">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="fw-bold mb-3">Répartition Clusters</h5>
                  <div style="height: 180px;">
                    <canvas #usersChart></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card border-0 shadow-sm">
                <div class="card-body p-4">
                  <h5 class="fw-bold mb-3">Expansion Réseau</h5>
                  <div style="height: 180px;">
                    <canvas #societiesChart></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <!-- Alerts Section -->
          <div class="card border-0 shadow-sm mb-4" style="height: 420px;">
            <div class="card-header bg-white border-0 px-4 pt-4 pb-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">État du Système (Alertes)</h5>
                <span class="badge rounded-pill" [class.bg-danger]="alerts.length > 0" [class.bg-secondary]="alerts.length === 0">{{alerts.length}} active</span>
              </div>
            </div>
            <div class="card-body px-4 pb-4" style="overflow-y: auto; max-height: 340px;">
              @for (alert of alerts; track alert.title) {
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-2" [class.bg-danger-subtle]="alert.type === 'error'" [class.bg-warning-subtle]="alert.type === 'warning'" [class.border]="alert.type === 'error' || alert.type === 'warning'" [class.border-danger]="alert.type === 'error'" [class.border-warning]="alert.type === 'warning'">
                  <i class="bi bi-{{alert.type === 'error' ? 'exclamation-triangle' : 'info-circle'}}" [class.text-danger]="alert.type === 'error'" [class.text-warning]="alert.type === 'warning'" style="font-size: 20px;"></i>
                  <div class="flex-grow-1">
                    <div class="fw-bold" style="font-size: 13px;">{{alert.title}}</div>
                    <div class="text-muted" style="font-size: 11px;">{{alert.message}}</div>
                  </div>
                  <div class="text-muted" style="font-size: 11px; font-weight: 600;">{{alert.time}}</div>
                </div>
              }
              @if (alerts.length === 0) {
                <div class="text-center py-5">
                  <i class="bi bi-check-circle text-success" style="font-size: 40px;"></i>
                  <p class="fw-bold text-uppercase mt-2" style="font-size: 12px; letter-spacing: 1px; color: #16a34a;">Système Nominal</p>
                </div>
              }
            </div>
          </div>

          <!-- Activity History -->
          <div class="card border-0 shadow-sm" style="height: 420px;">
            <div class="card-header bg-white border-0 px-4 pt-4 pb-3">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">Journal d'Activité Global</h5>
                <button class="btn btn-sm btn-outline-primary"><i class="bi bi-arrow-clockwise"></i></button>
              </div>
            </div>
            <div class="card-body px-4 pb-4" style="overflow-y: auto; max-height: 340px;">
              @for (a of activities; track a.time) {
                <div class="d-flex align-items-center gap-3 p-3 rounded-3 mb-2 hover-bg">
                  <div class="rounded-2 d-flex align-items-center justify-content-center" [class.bg-primary-subtle]="a.type === 'user'" [class.bg-purple-subtle]="a.type === 'societe'" [class.bg-success-subtle]="a.type === 'projet'" [class.text-primary]="a.type === 'user'" [class.text-purple]="a.type === 'societe'" [class.text-success]="a.type === 'projet'" style="width: 36px; height: 36px;">
                    <i class="bi bi-{{a.icon}}" style="font-size: 18px;"></i>
                  </div>
                  <div class="flex-grow-1">
                    <div class="fw-bold" style="font-size: 13px;">{{a.title}}</div>
                    <div class="text-muted" style="font-size: 11px;">Node: {{a.user}} • {{a.time}}</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse-glow {
      0% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.4); }
      70% { transform: scale(1.1); opacity: 0.8; box-shadow: 0 0 0 10px rgba(22, 163, 74, 0); }
      100% { transform: scale(1); opacity: 1; box-shadow: 0 0 0 0 rgba(22, 163, 74, 0); }
    }

    @keyframes pulse-icon {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }

    .hover-bg:hover {
      background-color: #f8fafc;
    }

    .text-purple {
      color: #8b5cf6 !important;
    }

    .bg-purple-subtle {
      background-color: rgba(139, 92, 246, 0.1) !important;
    }
  `]
})
export class SuperAdminDashboardComponent implements OnInit, AfterViewInit {
  private api = inject(ApiService);

  @ViewChild('revenueChart') revenueChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('usersChart') usersChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('societiesChart') societiesChartRef!: ElementRef<HTMLCanvasElement>;

  stats: StatCard[] = [
    { title: 'Sociétés', value: 0, icon: 'building', color: '#3b82f6', change: 'Loading...', changeUp: true },
    { title: 'Utilisateurs', value: 0, icon: 'people', color: '#10b981', change: 'Loading...', changeUp: true },
    { title: 'Abonnements', value: 0, icon: 'credit-card', color: '#f59e0b', change: 'Loading...', changeUp: true },
    { title: 'Alertes', value: 0, icon: 'exclamation-triangle', color: '#ef4444', change: 'Loading...', changeUp: false }
  ];
  revenue = 0;
  currentFilter = 'month';
  
  revenueData = {
    month: { total: 12500, byMonth: [
      { name: 'Jan', percent: 40, color: '#e53935' },
      { name: 'Fév', percent: 55, color: '#d32f2f' },
      { name: 'Mar', percent: 80, color: '#c62828' }
    ]},
    quarter: { total: 38500, byMonth: [
      { name: 'Jan', percent: 50, color: '#e53935' },
      { name: 'Fév', percent: 65, color: '#d32f2f' },
      { name: 'Mar', percent: 72, color: '#c62828' }
    ]},
    year: { total: 85000, byMonth: [
      { name: 'Jan', percent: 65, color: '#e53935' },
      { name: 'Fév', percent: 80, color: '#d32f2f' },
      { name: 'Mar', percent: 72, color: '#c62828' },
      { name: 'Avr', percent: 90, color: '#b71c1c' }
    ]}
  };
  
  revenueByMonth = [
    { name: 'Jan', percent: 65, color: '#e53935' },
    { name: 'Fév', percent: 80, color: '#d32f2f' },
    { name: 'Mar', percent: 72, color: '#c62828' },
    { name: 'Avr', percent: 90, color: '#b71c1c' }
  ];
  alerts: AlertItem[] = [];
  societies: any[] = [];
  activities: any[] = [];
  uptimeData: any = null;

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
        if (data?.societes) {
          this.stats[0].value = data.societes.total;
          this.stats[0].change = `${data.societes.actives} actives`;
          this.stats[0].changeUp = data.societes.actives >= data.societes.total / 2;
        }
        if (data?.utilisateurs) {
          this.stats[1].value = data.utilisateurs.total;
          this.stats[1].change = `${data.utilisateurs.actifs} actifs`;
          this.stats[1].changeUp = data.utilisateurs.actifs >= data.utilisateurs.total / 2;
        }
        if (data?.abonnements) {
          this.stats[2].value = data.abonnements.total;
          this.stats[2].change = `${data.abonnements.revenus} DT`;
          this.stats[2].changeUp = true;
        }
      },
      error: () => {
        this.api.getSocietes().subscribe({
          next: (societes) => {
            if (this.stats[0]) this.stats[0].value = (societes || []).length;
          }
        });
        this.api.getUtilisateurs().subscribe({
          next: (users: any) => {
            if (this.stats[1]) this.stats[1].value = (users || []).length;
          }
        });
      }
    });

    this.api.getSocietesRecentes(5).subscribe({
      next: (data: any[]) => { this.societies = data || []; }
    });

    this.api.getRevenus(this.currentFilter).subscribe({
      next: (data: any) => {
        this.revenue = data?.total || 0;
        this.revenueByMonth = data?.byMonth || [];
      }
    });

    this.api.getAlertes().subscribe({
      next: (data: any[]) => {
        this.alerts = data || [];
        if (this.stats[3]) this.stats[3].value = this.alerts.length;
      }
    });

    this.api.getActiviteRecente(10).subscribe({
      next: (data: any[]) => { this.activities = data || []; }
    });

    this.api.getUptime().subscribe({
      next: (data: any) => { this.uptimeData = data; }
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
    
    alert('Données exportées avec succès!');
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
    
    alert('Export CSV réussi!');
  }

  filterRevenue(filter: string) {
    this.currentFilter = filter;
    this.api.getRevenus(filter).subscribe({
      next: (data: any) => {
        this.revenue = data?.total || 0;
        this.revenueByMonth = data?.byMonth || [];
        alert('Revenus: ' + this.getFilterLabel());
      }
    });
  }

  getFilterLabel(): string {
    const labels: { [key: string]: string } = { month: 'CE MOIS', quarter: 'CE TRIMESTRE', year: 'CETTE ANNÉE' };
    return labels[this.currentFilter] || 'CE MOIS';
  }
}
