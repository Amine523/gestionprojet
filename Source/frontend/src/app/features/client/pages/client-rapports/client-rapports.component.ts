import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

interface Rapport {
  ProjetId: string;
  ProjetNom: string;
  Avancement: number;
  TotalTaches: number;
  TachesTerminees: number;
  TachesEnCours: number;
  TachesAFaire: number;
  DateDebut?: string;
  DateFin?: string;
  Statut?: string;
}

interface BurndownPoint {
  day: string;
  ideal: number;
  remaining: number;
}

@Component({
  selector: 'app-client-rapports',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-rapports.component.html',
  styleUrls: ['./client-rapports.component.scss']
})
export class ClientRapportsComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  rapports: Rapport[] = [];
  burndownData: BurndownPoint[] = [];
  selectedProjetId: string | null = null;
  isLoading = true;

  private get apiBase() {
    return (this.api as any).baseUrl || '/api';
  }

  get globalAvancement(): number {
    if (!this.rapports.length) return 0;
    return this.rapports.reduce((sum, r) => sum + (r.Avancement || 0), 0) / this.rapports.length;
  }

  get totalTachesTerminees(): number {
    return this.rapports.reduce((sum, r) => sum + (r.TachesTerminees || 0), 0);
  }

  get totalTachesEnCours(): number {
    return this.rapports.reduce((sum, r) => sum + (r.TachesEnCours || 0), 0);
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    if (userId) {
      this.http.get<Rapport[]>(`${this.apiBase}/client-projet/rapports/${userId}`)
        .subscribe({
          next: (data) => { this.rapports = data || []; this.isLoading = false; },
          error: () => { this.rapports = []; this.isLoading = false; }
        });
    } else {
      this.isLoading = false;
    }
  }

  loadBurndown(projetId: string) {
    if (this.selectedProjetId === projetId) {
      this.selectedProjetId = null;
      return;
    }
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    this.http.get<BurndownPoint[]>(`${this.apiBase}/client-projet/burndown/${userId}/${projetId}`)
      .subscribe({
        next: (data) => { this.burndownData = data || []; this.selectedProjetId = projetId; },
        error: () => { this.burndownData = []; this.selectedProjetId = projetId; }
      });
  }

  getStatutClass(statut?: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('cours') || s.includes('actif')) return 'rapport-statut status-actif';
    if (s.includes('retard') || s.includes('delay')) return 'rapport-statut status-retard';
    if (s.includes('termin') || s.includes('done')) return 'rapport-statut status-termin';
    return 'rapport-statut status-defaut';
  }

  getProgressClass(pct: number): string {
    if (pct < 33) return 'big-progress-fill progress-low';
    if (pct < 66) return 'big-progress-fill progress-mid';
    return 'big-progress-fill progress-high';
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return date; }
  }
}
