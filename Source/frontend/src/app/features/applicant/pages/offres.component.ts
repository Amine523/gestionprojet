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
            <span class="header-badge">Career Grid</span>
          </div>
          <h1 class="header-title">
            Open <span class="gradient-text">Missions.</span>
          </h1>
          <p class="header-subtitle">Deploy your skills in a high-performance environment.</p>
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
                 <span class="offre-badge">New Slot</span>
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
                
                <button class="btn btn-primary">INITIATE APPLICATION</button>
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
           <p class="empty-text">No Signals Detected</p>
        </div>
      }
    </div>
  `,
  styles: [`
    .offres-page {
      padding: var(--space-xl) var(--space-lg);
    }

    .page-header {
      background: var(--color-slate-900);
      border-radius: var(--radius-3xl);
      padding: var(--space-3xl);
      overflow: hidden;
      box-shadow: var(--shadow-2xl);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      margin-bottom: var(--space-3xl);
    }

    .header-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 500px;
      height: 500px;
      background: linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2));
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
      background: rgba(99, 102, 241, 0.2);
      backdrop-filter: blur(24px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #818cf8;
    }

    .header-badge {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 6px;
      color: rgba(129, 140, 248, 0.8);
      font-style: italic;
    }

    .header-title {
      font-size: 48px;
      font-weight: var(--font-weight-black);
      color: white;
      margin: 0 0 var(--space-md);
      letter-spacing: -1px;
    }

    .gradient-text {
      background: linear-gradient(to right, #818cf8, #60a5fa, #22d3ee);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: var(--color-slate-400);
      font-weight: var(--font-weight-bold);
      font-size: 18px;
      max-width: 600px;
      margin: 0;
    }

    .offres-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3xl);
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
      border-radius: var(--radius-3xl);
      padding: var(--space-3xl);
      box-shadow: var(--shadow-sm);
      cursor: pointer;
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .offre-card:hover {
      box-shadow: var(--shadow-2xl);
      transform: translateY(-8px);
    }

    .offre-bg {
      position: absolute;
      top: 0;
      right: 0;
      width: 128px;
      height: 128px;
      background: rgba(99, 102, 241, 0.05);
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
      margin-bottom: var(--space-2xl);
    }

    .offre-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-2xl);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .offre-card:hover .offre-icon {
      transform: scale(1.1);
    }

    .offre-badge {
      padding: var(--space-xs) var(--space-md);
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border-radius: var(--radius-full);
      font-size: 9px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .offre-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .offre-title {
      font-size: 24px;
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      letter-spacing: -0.5px;
      text-transform: uppercase;
      font-style: italic;
      line-height: 1.2;
    }

    .offre-card:hover .offre-title {
      color: #4f46e5;
    }

    .offre-desc {
      font-size: 14px;
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
      margin-top: var(--space-2xl);
      padding-top: var(--space-2xl);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .offre-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-md);
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
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
      padding: var(--space-md) var(--space-lg);
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-black);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
    }

    .btn-primary {
      background: var(--color-slate-900);
      color: white;
      width: 100%;
      height: 56px;
      box-shadow: var(--shadow-xl);
    }

    .btn-primary:hover {
      transform: scale(1.02);
    }

    .btn-primary:active {
      transform: scale(0.95);
    }

    .empty-state {
      padding: var(--space-5xl);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-2xl);
      opacity: 0.2;
    }

    .empty-text {
      font-size: 20px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 10px;
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .offre-card {
      background: var(--color-slate-900);
      border-color: var(--color-slate-800);
    }

    :host-context(.dark) .offre-title {
      color: white;
    }

    :host-context(.dark) .offre-icon {
      background: var(--color-slate-800);
    }

    @media (max-width: 768px) {
      .page-header {
        padding: var(--space-2xl);
      }

      .header-title {
        font-size: 32px;
      }

      .header-subtitle {
        font-size: 14px;
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
      this.offres = allOffres.filter((o: any) =>
        o.statut?.toUpperCase() === 'OUVERTE'
      );
    });
  }
  postuler(offre: any) {
    this.api.setOffreEmploiTemp(offre);
    this.router.navigate(['/applicant/postuler']);
  }
}
