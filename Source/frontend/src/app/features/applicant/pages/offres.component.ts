import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-offres',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `

    <div class="offres-page">
      <!-- Header -->
      <header class="page-header">
        <div class="header-bg"></div>
        
        <div class="header-content">
          <div class="header-icon-group">
            <div class="header-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <span class="header-badge">Grille Carrière</span>
          </div>
          <h1 class="header-title">
            Offres <span class="gradient-text">Disponibles.</span>
          </h1>
          <p class="header-subtitle">Déployez vos compétences dans un environnement haute performance.</p>
        </div>
      </header>

      <div class="offres-grid">
        @for (offre of offres; track offre.id) {
          <div (click)="postuler(offre)" class="offre-card">
            <div class="offre-bg"></div>
            
            <div class="offre-content">
              <div class="offre-header">
                 <div class="offre-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/>
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
                    </svg>
                 </div>
                 <span class="offre-badge">Nouveau Poste</span>
              </div>

              <div class="offre-body">
                <h3 class="offre-title">{{offre.titre}}</h3>
                <p class="offre-desc">{{offre.description}}</p>
              </div>

              <div class="offre-footer">
                <div class="offre-meta">
                  <div class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {{offre.lieu}}
                  </div>
                  <div class="meta-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                    {{offre.type}}
                  </div>
                </div>
                
                <button class="btn btn-primary">INITIER LA CANDIDATURE</button>
              </div>
            </div>
          </div>
        }
      </div>

      @if (offres.length === 0) {
        <div class="empty-state">
           <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
             <path d="m3.3 7 8.7 5 8.7-5"/>
             <path d="M12 22V12"/>
           </svg>
           <p class="empty-text">Aucune offre détectée</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .offres-page {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .page-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      margin-bottom: var(--space-xl);
    }

    .header-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      filter: blur(120px);
      margin-right: -192px;
      margin-top: -192px;
    }

    .header-content {
      position: relative;
    }

    .header-icon-group {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: rgba(59, 130, 246, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #60a5fa;
    }

    .header-badge {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(96, 165, 250, 0.8);
      font-style: italic;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-md);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(to right, #60a5fa, #818cf8, #22d3ee);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
      max-width: 600px;
      margin: 0;
    }

    .offres-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-xl);
    }

    @media (min-width: 768px) {
      .offres-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (min-width: 1024px) {
      .offres-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    .offre-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .offre-card:hover {
      box-shadow: var(--shadow-xl);
      transform: translateY(-4px);
      border-color: rgba(59, 130, 246, 0.3);
    }

    .offre-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 128px;
      height: 128px;
      background: rgba(59, 130, 246, 0.05);
      filter: blur(48px);
      opacity: 0;
      transition: opacity var(--transition-base);
    }

    .offre-card:hover .offre-bg {
      opacity: 1;
    }

    .offre-content {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .offre-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-lg);
    }

    .offre-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .offre-card:hover .offre-icon {
      transform: scale(1.05);
    }

    .offre-badge {
      padding: var(--space-xs) var(--space-md);
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .offre-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .offre-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      letter-spacing: -0.02em;
      text-transform: uppercase;
      font-style: italic;
      line-height: 1.2;
    }

    .offre-card:hover .offre-title {
      color: #3b82f6;
    }

    .offre-desc {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-text-muted);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin: 0;
    }

    .offre-footer {
      margin-top: var(--space-lg);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .offre-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
    }

    .btn-primary {
      background: #0f172a;
      color: white;
      width: 100%;
      height: 48px;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      background: #3b82f6;
    }

    .btn-primary:active {
      transform: scale(0.98);
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xl);
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
    }

    .empty-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
      color: var(--color-text-muted);
    }

    /* Dark mode */
    :host-context(.dark) .offre-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .offre-title {
      color: var(--color-text);
    }

    :host-context(.dark) .offre-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .empty-state {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .page-header {
        padding: var(--space-xl);
      }

      .header-title {
        font-size: var(--font-size-2xl);
      }

      .header-subtitle {
        font-size: var(--font-size-base);
      }

      .offres-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApplicantOffresComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  offres: any[] = [];
  constructor() {
    this.api.getOffresEmploi().subscribe(allOffres => {
      // Normalisation des données pour gérer les différences de casse entre le backend et le frontend
      const normalized = (allOffres || []).map((o: any) => ({
        id: o.id || o.Id,
        titre: o.titre || o.Titre,
        description: o.description || o.Description,
        type: o.type || o.Type || 'CDI',
        lieu: o.lieu || o.Lieu,
        salaire: o.salaire || o.Salaire,
        statut: o.statut || o.Statut,
        poste: o.poste || o.Poste,
        societeId: o.societeId || o.SocieteId
      }));

      // Filtre plus flexible pour le statut
      this.offres = normalized.filter((o: any) => {
        const s = (o.statut || '').toUpperCase();
        return s === 'OUVERTE' || s === 'OUVERT' || s === 'ACTIVE' || s === 'PUBLIÉE' || s === 'PUBLIE';
      });
      console.log('Offres filtrées pour le candidat:', this.offres);
    });
  }
  postuler(offre: any) {
    this.api.setOffreEmploiTemp(offre);
    this.router.navigate(['/applicant/postuler']);
  }
}
