import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="applicant-home animate-in">
      <!-- Hero Section -->
      <header class="hero-section">
        <div class="hero-bg hero-bg-1"></div>
        <div class="hero-bg hero-bg-2"></div>
        
        <div class="hero-content">
          <div class="hero-badge">Espace Candidat v2.5</div>
          
          <h1 class="hero-title">
            BIENVENUE, <span class="gradient-text">{{userNom}}</span>
          </h1>
          
          <p class="hero-subtitle">
            Suivez vos candidatures en temps réel et explorez de nouvelles opportunités de carrière.
          </p>
          
          <div class="hero-actions">
            <button routerLink="/applicant/offres" class="btn btn-primary btn-large">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
              VOIR LES OFFRES
            </button>
            <button routerLink="/applicant/profil" class="btn btn-outline btn-large">
              MON DOSSIER
            </button>
          </div>
        </div>
      </header>

      <!-- Dashboard Stats -->
      <div class="stats-grid">
        <div class="stat-card">
          <span class="stat-label">Candidatures</span>
          <span class="stat-value">{{candidatures.length}}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">En Entretien</span>
          <span class="stat-value">{{entretiensCount}}</span>
        </div>
        <div class="stat-card highlight">
          <span class="stat-label">Offres Matchées</span>
          <span class="stat-value">12</span>
        </div>
      </div>

      <!-- My Applications -->
      <div class="section-container">
        <div class="section-header">
          <h2 class="section-title">MES CANDIDATURES RÉCENTES</h2>
          <a routerLink="/applicant/offres" class="link-more">Postuler à d'autres offres</a>
        </div>

        <div class="applications-list">
          @for (c of candidatures; track c.id) {
            <div class="app-card">
              <div class="app-info">
                <h3>{{c.poste || 'Poste non spécifié'}}</h3>
                <p>{{c.societeNom || 'Entreprise Partenaire'}}</p>
              </div>
              <div class="app-status">
                <span class="status-pill" [ngClass]="getStatusClass(c.statut)">
                  {{c.statut}}
                </span>
                <span class="app-date">Postulé le {{c.datePostulation | date:'dd/MM/yyyy'}}</span>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <p>Vous n'avez pas encore postulé à des offres.</p>
              <button routerLink="/applicant/offres" class="btn btn-primary">Explorer les offres</button>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .applicant-home { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    
    .hero-section {
      background: #0f172a;
      border-radius: 2rem;
      padding: 4rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
      margin-bottom: 2rem;
    }

    .hero-bg { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.3; }
    .hero-bg-1 { top: -50px; right: -50px; width: 300px; height: 300px; background: #3b82f6; }
    .hero-bg-2 { bottom: -50px; left: -50px; width: 200px; height: 200px; background: #8b5cf6; }

    .hero-content { position: relative; z-index: 1; }
    .hero-badge { display: inline-block; padding: 0.5rem 1rem; background: rgba(255,255,255,0.1); border-radius: 2rem; color: #94a3b8; font-size: 0.75rem; font-weight: 700; margin-bottom: 1.5rem; }
    .hero-title { font-size: 3rem; font-weight: 900; color: white; margin-bottom: 1rem; }
    .gradient-text { background: linear-gradient(to right, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .hero-subtitle { color: #94a3b8; font-size: 1.25rem; margin-bottom: 2.5rem; }

    .hero-actions { display: flex; gap: 1rem; justify-content: center; }
    .btn { padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; cursor: pointer; transition: all 0.3s; border: none; }
    .btn-primary { background: white; color: #0f172a; }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
    .btn-outline { background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
    .stat-card { background: white; padding: 2rem; border-radius: 1.5rem; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 0.5rem; }
    .stat-card.highlight { background: #3b82f6; color: white; }
    .stat-card.highlight .stat-label { color: rgba(255,255,255,0.8); }
    .stat-label { color: #64748b; font-weight: 600; font-size: 0.875rem; text-transform: uppercase; }
    .stat-value { font-size: 2.5rem; font-weight: 800; }

    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .section-title { font-size: 1.25rem; font-weight: 800; color: #1e293b; }
    .link-more { color: #3b82f6; font-weight: 600; text-decoration: none; font-size: 0.875rem; }

    .applications-list { display: flex; flex-direction: column; gap: 1rem; }
    .app-card { background: white; padding: 1.5rem; border-radius: 1.25rem; border: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s; }
    .app-card:hover { border-color: #3b82f6; transform: translateX(8px); }
    .app-info h3 { font-size: 1.125rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
    .app-info p { color: #64748b; font-size: 0.875rem; }

    .app-status { text-align: right; display: flex; flex-direction: column; gap: 0.5rem; }
    .status-pill { padding: 0.4rem 1rem; border-radius: 2rem; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
    .status-pill.pending { background: #fef3c7; color: #d97706; }
    .status-pill.interview { background: #dcfce7; color: #16a34a; }
    .status-pill.rejected { background: #fee2e2; color: #dc2626; }
    .app-date { font-size: 0.75rem; color: #94a3b8; }

    .empty-state { text-align: center; padding: 4rem; background: #f8fafc; border-radius: 2rem; border: 2px dashed #e2e8f0; }

    @media (max-width: 768px) {
      .hero-title { font-size: 2rem; }
      .hero-actions { flex-direction: column; }
    }
  `]
})
export class ApplicantHomeComponent implements OnInit {
  private api = inject(ApiService);
  
  userNom = '';
  candidatures: any[] = [];
  entretiensCount = 0;

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.userNom = user?.nom || 'Candidat';
    this.loadCandidatures();
  }

  loadCandidatures() {
    const userId = this.api.getCurrentUserId();
    this.api.getCandidaturesByCandidat(userId).subscribe(data => {
      this.candidatures = data || [];
      this.entretiensCount = this.candidatures.filter(c => 
        (c.statut || '').toUpperCase().includes('ENTRETIEN')
      ).length;
    });
  }

  getStatusClass(status: string): string {
    const s = (status || '').toUpperCase();
    if (s.includes('ATTENTE') || s.includes('NOUVEAU')) return 'pending';
    if (s.includes('ENTRETIEN') || s.includes('ACCEPTE')) return 'interview';
    return 'rejected';
  }
}
