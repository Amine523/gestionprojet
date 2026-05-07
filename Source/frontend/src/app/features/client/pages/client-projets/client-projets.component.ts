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
  template: `
    <div class="client-projets">
      <!-- Header -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">📁 Mes Projets</h1>
          <p class="page-subtitle">{{ projets.length }} projet(s) vous sont affectés</p>
        </div>
        <div class="header-actions">
          <div class="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" placeholder="Rechercher un projet..." [(ngModel)]="searchQuery" class="search-input">
          </div>
          <select [(ngModel)]="filterStatut" class="filter-select">
            <option value="">Tous les statuts</option>
            <option value="cours">En cours</option>
            <option value="termin">Terminé</option>
            <option value="retard">En retard</option>
          </select>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="loading-grid">
          @for (i of [1,2,3,4]; track i) {
            <div class="skeleton-card">
              <div class="skeleton-avatar"></div>
              <div class="skeleton-lines">
                <div class="skeleton-line w-60"></div>
                <div class="skeleton-line w-40"></div>
                <div class="skeleton-line w-80"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredProjets.length === 0) {
        <div class="empty-state">
          <div class="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
          </div>
          <h3>Aucun projet trouvé</h3>
          <p>Aucun projet ne correspond à votre recherche ou vous n'avez pas encore de projets affectés.</p>
        </div>
      } @else {
        <div class="projets-grid">
          @for (projet of filteredProjets; track projet.id) {
            <div class="projet-card" [routerLink]="['/client/projets', projet.id]">
              <!-- Card Header -->
              <div class="card-header">
                <div class="card-avatar">{{ getInitiales(projet.nom) }}</div>
                <div class="card-meta">
                  <span class="card-title">{{ projet.nom || 'Projet sans nom' }}</span>
                  <span class="status-chip" [class]="getStatutClass(projet.statut)">
                    {{ projet.statut || 'Indéfini' }}
                  </span>
                </div>
              </div>

              <!-- Description -->
              <p class="card-desc">{{ projet.description?.substring(0, 100) || 'Aucune description disponible.' }}</p>

              <!-- Progress -->
              <div class="card-progress">
                <div class="progress-header">
                  <span class="progress-label">Avancement</span>
                  <span class="progress-value">{{ projet.avancement || '0%' }}</span>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" [style.width]="projet.avancement || '0%'"></div>
                </div>
              </div>

              <!-- Dates -->
              <div class="card-dates">
                <div class="date-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{{ formatDate(projet.dateDebut) }}</span>
                </div>
                <span class="date-arrow">→</span>
                <div class="date-item">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span>{{ formatDate(projet.dateFin) }}</span>
                </div>
              </div>

              <!-- Footer -->
              <div class="card-footer">
                <span class="view-btn">
                  Voir les détails
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .client-projets { display: flex; flex-direction: column; gap: 24px; }

    /* Header */
    .page-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      flex-wrap: wrap; gap: 16px;
    }

    .page-title {
      font-size: 24px; font-weight: 800; color: #0f172a; margin: 0;
    }

    .page-subtitle { font-size: 14px; color: #64748b; margin: 4px 0 0; }

    .header-actions { display: flex; gap: 12px; flex-wrap: wrap; }

    .search-box {
      display: flex; align-items: center; gap: 8px;
      background: white; border: 1px solid #e2e8f0;
      border-radius: 10px; padding: 10px 14px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      color: #94a3b8;
    }

    .search-input {
      border: none; outline: none; font-size: 14px;
      color: #0f172a; background: transparent; width: 200px;
    }

    .filter-select {
      border: 1px solid #e2e8f0; border-radius: 10px;
      padding: 10px 14px; font-size: 14px; color: #374151;
      background: white; cursor: pointer;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    /* Grid */
    .projets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    /* Card */
    .projet-card {
      background: white; border-radius: 18px;
      padding: 24px; border: 1px solid #f1f5f9;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
      cursor: pointer; transition: all 0.25s;
      display: flex; flex-direction: column; gap: 18px;
    }

    .projet-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(59,130,246,0.15);
      border-color: #93c5fd;
    }

    .card-header { display: flex; align-items: center; gap: 14px; }

    .card-avatar {
      width: 50px; height: 50px; border-radius: 14px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white; font-weight: 800; font-size: 16px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    .card-meta { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 0; }

    .card-title {
      font-size: 15px; font-weight: 700; color: #0f172a;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }

    .status-chip {
      font-size: 11px; font-weight: 600; padding: 3px 10px;
      border-radius: 20px; width: fit-content;
    }

    .status-actif { background: #dcfce7; color: #15803d; }
    .status-retard { background: #fee2e2; color: #b91c1c; }
    .status-termin { background: #e0f2fe; color: #0369a1; }
    .status-defaut { background: #f1f5f9; color: #475569; }

    .card-desc {
      font-size: 13px; color: #64748b; line-height: 1.6;
      margin: 0;
    }

    /* Progress */
    .card-progress { display: flex; flex-direction: column; gap: 8px; }

    .progress-header {
      display: flex; justify-content: space-between; align-items: center;
    }

    .progress-label { font-size: 12px; color: #94a3b8; font-weight: 500; }
    .progress-value { font-size: 14px; font-weight: 700; color: #3b82f6; }

    .progress-track {
      height: 8px; background: #f1f5f9; border-radius: 4px; overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
      border-radius: 4px; transition: width 0.6s ease;
    }

    /* Dates */
    .card-dates {
      display: flex; align-items: center; gap: 12px;
      font-size: 12px; color: #64748b;
    }

    .date-item { display: flex; align-items: center; gap: 5px; }
    .date-arrow { color: #94a3b8; }

    /* Footer */
    .card-footer {
      border-top: 1px solid #f1f5f9; padding-top: 16px;
      margin-top: auto;
    }

    .view-btn {
      display: flex; align-items: center; gap: 6px;
      font-size: 13px; font-weight: 600; color: #3b82f6;
    }

    /* Loading skeleton */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
    }

    .skeleton-card {
      background: white; border-radius: 18px; padding: 24px;
      display: flex; gap: 16px; border: 1px solid #f1f5f9;
    }

    .skeleton-avatar {
      width: 50px; height: 50px; border-radius: 14px;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
      flex-shrink: 0;
    }

    .skeleton-lines { flex: 1; display: flex; flex-direction: column; gap: 10px; justify-content: center; }

    .skeleton-line {
      height: 12px; border-radius: 6px;
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200% 100%; animation: shimmer 1.5s infinite;
    }

    .w-60 { width: 60%; }
    .w-40 { width: 40%; }
    .w-80 { width: 80%; }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* Empty state */
    .empty-state {
      display: flex; flex-direction: column; align-items: center;
      text-align: center; padding: 80px 24px; gap: 16px; color: #94a3b8;
    }

    .empty-icon {
      width: 100px; height: 100px; border-radius: 24px;
      background: #f8fafc; display: flex; align-items: center; justify-content: center;
    }

    .empty-state h3 { font-size: 18px; font-weight: 700; color: #374151; margin: 0; }
    .empty-state p { font-size: 14px; max-width: 360px; margin: 0; }
  `]
})
export class ClientProjetsComponent implements OnInit {
  private api = inject(ApiService);
  private http = inject(HttpClient);

  projets: Projet[] = [];
  isLoading = true;
  searchQuery = '';
  filterStatut = '';

  private get apiBase() {
    return (this.api as any).baseUrl || '/api';
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
    this.http.get<Projet[]>(`${this.apiBase}/client-projet/projets/${userId}`)
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
