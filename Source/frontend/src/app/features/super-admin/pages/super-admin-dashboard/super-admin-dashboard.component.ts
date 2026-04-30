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
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.scss']
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

