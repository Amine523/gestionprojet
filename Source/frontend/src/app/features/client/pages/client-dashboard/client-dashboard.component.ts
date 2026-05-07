import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-client-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule],
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {
  private api = inject(ApiGenericService);
  private auth = inject(AuthService);

  dashboardData: DashboardData | null = null;
  projets: Projet[] = [];
  isLoading = true;
  userName = '';

  private get apiBase() {
    return (this.api as any).baseUrl || '/api';
  }

  ngOnInit() {
    this.loadProjects();
  }

  private loadDashboard(userId: string) {
    this.http.get<DashboardData>(`${this.apiBase}/client-projet/dashboard/${userId}`)
      .subscribe({
        next: (data) => this.dashboardData = data,
        error: () => this.dashboardData = {
          TotalProjets: 0, AvancementMoyen: 0,
          TachesEnCours: 0, TachesTerminees: 0, TotalTaches: 0,
          ProjetsActifs: 0, ProjetsTermines: 0, ProjetsEnRetard: 0
        }
      });
  }

  private loadProjets(userId: string) {
    this.http.get<Projet[]>(`${this.apiBase}/client-projet/projets/${userId}`)
      .subscribe({
        next: (data) => {
          this.projets = data || [];
          this.isLoading = false;
        },
        error: () => {
          this.projets = [];
          this.isLoading = false;
        }
      });
  }

  getInitiales(nom?: string): string {
    if (!nom) return '?';
    return nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatutClass(statut?: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('cours') || s.includes('actif')) return 'status-badge status-actif';
    if (s.includes('retard') || s.includes('delay')) return 'status-badge status-retard';
    if (s.includes('termin') || s.includes('done')) return 'status-badge status-termin';
    return 'status-badge status-defaut';
  }
}
