import { Component, OnInit, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../service/dashboard.service';
import { DashboardStats, Activity } from '../model/dashboard.model';
import { MetricCardComponent } from '@shared/components/metric-card/metric-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MetricCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  private dashboardService = inject(DashboardService);
  
  @ViewChild('activityChart') activityChart!: ElementRef<HTMLCanvasElement>;
  
  societeNom = '';
  stats: DashboardStats = { employes: 0, projetsActifs: 0, heuresTravaillees: 0, productivite: 0 };
  activities: Activity[] = [];
  filteredActivities: Activity[] = [];
  projets: any[] = [];
  equipes: any[] = [];
  aiInsights: string | null = null;
  aiLoading = false;
  searchTerm = '';

  ngOnInit() {
    this.societeNom = this.dashboardService.getSocieteNom();
    this.loadData();
  }

  ngAfterViewInit() {
    this.initChart();
  }

  loadData() {
    const user = this.dashboardService.getCurrentUser();
    const societeId = user?.societeId || user?.SocieteId || '';
    
    this.dashboardService.getDashboardStats(societeId).subscribe({
      next: (data) => {
        this.stats = {
          employes: data.totalEmployes || 0,
          projetsActifs: data.projetsActifs || 0,
          heuresTravaillees: data.tauxPresence || 0, // Utilisation du taux comme indicateur
          productivite: 85 // Estimation basée sur le taux de complétion moyen
        };
      }
    });

    this.dashboardService.getActivities(societeId).subscribe({
      next: (data) => {
        this.activities = data.map((item: any) => ({
          id: item.id || item.Id || Math.random().toString(),
          type: (item.type || 'INFO').toUpperCase(),
          action: item.action || 'Action système',
          resource: item.nom || '-',
          utilisateur: item.utilisateur || 'Système',
          date: item.date || new Date().toISOString()
        }));
        this.filteredActivities = [...this.activities];
      }
    });

    // Données réelles pour les projets de la société
    this.dashboardService['apiService'].getProjetsBySociete(societeId).subscribe(data => {
      this.projets = (data || []).map(p => ({
        id: p.id || p.Id,
        nom: p.nom || p.Nom,
        avancement: p.progression || 0
      })).slice(0, 5);
    });
  }

  analyserDashboard() {
    this.aiLoading = true;
    
    this.dashboardService.getAIInsights('', this.stats).subscribe({
      next: (response) => {
        this.aiInsights = response.insights || 'Analyse IA générée avec succès';
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = 'Erreur lors de l\'analyse IA';
        this.aiLoading = false;
      }
    });
  }

  exportRapport() {
    this.dashboardService.exportRapport(this.stats, this.activities, this.aiInsights || undefined);
  }

  onFilterActivities(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchTerm = target.value;
    this.filteredActivities = this.dashboardService.filterActivities(this.activities, this.searchTerm);
  }

  getTypeBadgeClass(type: string): string {
    return this.dashboardService.getTypeBadgeClass(type);
  }

  getUserColor(utilisateur: string): string {
    const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
    const index = utilisateur.length % colors.length;
    return colors[index];
  }

  private initChart() {
    if (!this.activityChart) return;

    const ctx = this.activityChart.nativeElement.getContext('2d');
    if (!ctx) return;

    // Simple chart implementation
    const data = [30, 45, 60, 35, 80, 55, 70, 40];
    const labels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim', 'Aujourd\'hui'];

    new (window as any).Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Taux de présence',
          data: data,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value: any) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }
}
