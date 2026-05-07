import { Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { ApiGenericService } from '@core/services/api-generic.service';

Chart.register(...registerables);

@Component({
  selector: 'app-utilisateurs-par-type-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './utilisateurs-par-type-chart.component.html',
  styleUrls: ['./utilisateurs-par-type-chart.component.scss']
})
export class UtilisateursParTypeChart implements OnInit {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private api = inject(ApiGenericService);
  private chart?: Chart;

  totalUsers = signal(1250);
  legendItems = signal<any[]>([]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.search('Dashboard', { type: 'utilisateurs-par-type' }).subscribe((data: any) => {
      this.initChart(data || this.getMockData());
    });
  }

  initChart(data: any) {
    if (this.chart) this.chart.destroy();

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const colors = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#0ea5e9'];
    this.legendItems.set(data.labels.map((l: string, i: number) => ({
      label: l,
      value: data.values[i],
      colorClass: this.getColorClass(i)
    })));

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.labels,
        datasets: [{
          data: data.values,
          backgroundColor: colors,
          borderWidth: 0,
          hoverOffset: 10,
          cutout: '75%'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  private getColorClass(index: number) {
    const classes = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-sky-500'];
    return classes[index % classes.length];
  }

  private getMockData() {
    return {
      labels: ['Développeurs', 'Admins', 'RH', 'Chefs Projet', 'Testeurs'],
      values: [45, 15, 10, 20, 10]
    };
  }
}
