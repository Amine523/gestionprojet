import { Component, OnInit, inject, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';
import { Chart, registerables } from 'chart.js';
import { marked } from 'marked';
import { TranslationService } from '@core/services/translation.service';
import { ExportService } from '@core/services/export.service';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('activityChart') activityChartRef!: ElementRef<HTMLCanvasElement>;

  private api = inject(ApiService);
  private aiService = inject(AiService);
  public t = inject(TranslationService);

  societeId = '';
  societeNom = '';

  stats = { employes: 0, projetsActifs: 0, heuresTravaillees: 0, productivite: 0 };
  projets: any[] = [];
  equipes: any[] = [];
  activites: any[] = [];

  aiLoading = false;
  aiInsights: string | null = null;
  private activitiesChart: any;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }

  loadData() {
    this.api.getSocieteStats(this.societeId).subscribe({
      next: (res: any) => {
        this.stats.employes = res.totalEmployes;
        this.stats.projetsActifs = res.projetsEnCours;
        this.stats.heuresTravaillees = res.rh?.totalHeuresAujourdhui || 0;
        this.stats.productivite = res.rh?.tauxPresence || 0;
      }
    });

    this.api.getProjectsProgress(this.societeId).subscribe({
      next: (data: any[]) => {
        this.projets = data.slice(0, 4);
      }
    });

    this.api.getAttendanceTrends(this.societeId).subscribe({
      next: (data: any[]) => {
        this.updateActivityChart(data);
      }
    });
  }

  updateActivityChart(trends: any[]) {
    if (!this.activityChartRef?.nativeElement) return;
    if (this.activitiesChart) this.activitiesChart.destroy();

    const isDark = document.body.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)';

    this.activitiesChart = new Chart(this.activityChartRef.nativeElement, {
      type: 'line',
      data: {
        labels: trends.map((t: any) => t.date),
        datasets: [{
          label: 'Productivity Rate (%)',
          data: trends.map((t: any) => t.rate),
          borderColor: '#0ea5e9',
          borderWidth: 4,
          pointBackgroundColor: '#0ea5e9',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
          backgroundColor: (context: any) => {
            const chart = context.chart;
            const { ctx, chartArea } = chart;
            if (!chartArea) return null;
            const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
            gradient.addColorStop(0, 'rgba(14, 165, 233, 0.2)');
            gradient.addColorStop(1, 'rgba(14, 165, 233, 0)');
            return gradient;
          },
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { intersect: false, mode: 'index' },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: isDark ? '#1e293b' : '#fff',
            titleColor: isDark ? '#fff' : '#0f172a',
            bodyColor: isDark ? '#94a3b8' : '#64748b',
            padding: 12,
            // borderRadius: 12,
            borderWidth: 1,
            borderColor: isDark ? '#334155' : '#e2e8f0',
            displayColors: false
          }
        },
        scales: {
          y: {
            min: 0,
            max: 100,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { weight: 'bold', size: 10 } }
          },
          x: {
            grid: { display: false },
            ticks: { color: textColor, font: { weight: 'bold', size: 10 } }
          }
        }
      }
    });
  }

  private exportService = inject(ExportService);

  exportRapport() {
    const columns = ['Indicator', 'Value'];
    const data = [
      ['Collaborateurs', this.stats.employes.toString()],
      ['Projets Actifs', this.stats.projetsActifs.toString()],
      ['Productivité', this.stats.productivite + '%']
    ];
    this.exportService.exportToPdf(columns, data, 'ecosystem_report', 'Strategic Ecosystem Report - ' + this.societeNom);
  }

  ngAfterViewInit() {
    // Chart will be initialized when data arrives
  }

  async analyserDashboard() {
    this.aiLoading = true;
    this.aiInsights = null;

    const payload = {
      stats: this.stats,
      projets: this.projets,
      equipes: this.equipes
    };

    this.aiService.getDashboardInsights(payload).subscribe({
      next: async (res: any) => {
        if (res?.response) {
          this.aiInsights = await marked.parse(res.response);
        } else {
          this.aiInsights = "AI could not process the data at this time.";
        }
        this.aiLoading = false;
      },
      error: () => {
        this.aiInsights = "Ecosystem communication error.";
        this.aiLoading = false;
      }
    });
  }
}
