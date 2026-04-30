import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

interface Projet {
  id?: string;
  nom?: string;
  description?: string;
  statut?: string;
  avancement?: string;
  dateDebut?: string;
  dateFin?: string;
  societeId?: string;
}

@Component({
  selector: 'app-client-projets',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './client-projets.component.html',
  styleUrls: ['./client-projets.component.scss']
})
export class ClientProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  projets: Projet[] = [];
  isLoading = true;
  searchQuery = '';
  filterStatut = '';

  private get apiBase() {
    return (this.api as any).baseUrl || 'http://localhost:5221';
  }

  get filteredProjets(): Projet[] {
    return this.projets.filter(p => {
      const matchSearch = !this.searchQuery ||
        (p.nom || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchStatut = !this.filterStatut ||
        (p.statut || '').toLowerCase().includes(this.filterStatut);
      return matchSearch && matchStatut;
    });
  }

  ngOnInit() {
    const user = this.api.getCurrentUser();
    const userId = user?.id || user?.Id || '';
    if (userId) this.loadProjets(userId);
    else this.isLoading = false;
  }

  private loadProjets(userId: string) {
    this.http.get<Projet[]>(`${this.apiBase}/api/client-projet/projets/${userId}`)
      .subscribe({
        next: (data) => { this.projets = data || []; this.isLoading = false; },
        error: () => { this.projets = []; this.isLoading = false; }
      });
  }

  getInitiales(nom?: string): string {
    if (!nom) return '?';
    return nom.split(' ').map(w => w[0]).join('').toUpperCase().substring(0, 2);
  }

  getStatutClass(statut?: string): string {
    const s = (statut || '').toLowerCase();
    if (s.includes('cours') || s.includes('actif')) return 'status-chip status-actif';
    if (s.includes('retard') || s.includes('delay')) return 'status-chip status-retard';
    if (s.includes('termin') || s.includes('done')) return 'status-chip status-termin';
    return 'status-chip status-defaut';
  }

  formatDate(date?: string): string {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch { return date; }
  }
}
