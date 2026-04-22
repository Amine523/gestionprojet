import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-projets',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="projets-container">
      <!-- Header -->
      <header class="page-header">
        <div class="header-decoration"></div>
        <div class="header-content-wrapper">
          <div class="header-left">
            <div class="header-badge-group">
              <div class="header-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="header-badge">Strategic Portfolio</span>
            </div>
            <h1 class="header-title">Mission <span class="gradient-text">Ledger.</span></h1>
            <p class="header-subtitle">Project lifecycle management & temporal orchestration for {{societeNom}}</p>
          </div>
          <div class="header-right">
            <div class="tab-switcher">
              <button class="tab-btn" [class.active]="currentTab === 'grid'" (click)="currentTab = 'grid'">Grid Matrix</button>
              <button class="tab-btn" [class.active]="currentTab === 'timeline'" (click)="currentTab = 'timeline'">Timeline Ops</button>
            </div>
          </div>
        </div>
      </header>

      <!-- View Content -->
      <div class="content-area">
        @if (currentTab === 'grid') {
          <div class="projects-grid">
            @for (p of projets; track p.id) {
              <div class="project-card">
                <div class="card-glow"></div>
                <div class="card-content">
                  <div class="card-header">
                    <div class="card-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <span class="status-badge" [ngClass]="p.statut === 'En_cours' ? 'status-active' : 'status-completed'">{{p.statut}}</span>
                  </div>
                  <h3 class="card-title">{{p.nom}}</h3>
                  <p class="card-description">{{p.description}}</p>
                  <div class="card-body">
                    <div class="progress-section">
                      <div class="progress-header">
                        <span class="progress-label">Deployment Progress</span>
                        <span class="progress-value">{{p.progression}}%</span>
                      </div>
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="p.progression"></div>
                      </div>
                    </div>
                    <div class="stats-grid">
                      <div class="stat-item">
                        <p class="stat-label">Nodes</p>
                        <p class="stat-value">{{p.taches}}</p>
                      </div>
                      <div class="stat-item stat-item-border">
                        <p class="stat-label">Units</p>
                        <p class="stat-value">{{p.membres}}</p>
                      </div>
                      <div class="stat-item">
                        <p class="stat-label">Zero Hour</p>
                        <p class="stat-value">{{p.echeance}}</p>
                      </div>
                    </div>
                    <div class="card-actions">
                      <button class="btn btn-primary btn-full">Audit</button>
                      <button class="btn btn-icon">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
        }

        @if (currentTab === 'timeline') {
          <div class="timeline-view">
            <div class="timeline-header">
              <div class="timeline-header-left">Mission Codename</div>
              <div class="timeline-header-right">
                <span>Cycle Alpha</span>
                <span>Cycle Beta</span>
                <span>Cycle Gamma</span>
                <span>Cycle Delta</span>
                <span>Cycle Epsilon</span>
                <span>Final Sync</span>
              </div>
            </div>
            <div class="timeline-body">
              @for (p of projets; track p.id) {
                <div class="timeline-row">
                  <div class="timeline-row-left">
                    <h4 class="project-name">{{p.nom}}</h4>
                    <span class="project-meta">{{p.taches}} ACTIVE NODES</span>
                  </div>
                  <div class="timeline-row-right">
                    <div class="timeline-grid">
                      @for (i of [1,2,3,4,5]; track i) { <div class="grid-line"></div> }
                    </div>
                    <div class="timeline-bar-wrapper" [style.left.%]="p.id * 8" [style.width.%]="30 + (p.id * 5)">
                      <div class="timeline-bar">
                        <div class="timeline-bar-fill" [style.width.%]="p.progression">
                          <span class="timeline-bar-text">{{p.progression}}% COMPLETE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .projets-container {
      padding: var(--space-lg);
      padding-bottom: var(--space-2xl);
    }

    .page-header {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: var(--radius-3xl);
      padding: var(--space-3xl);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
      margin-bottom: var(--space-xl);
    }

    .header-decoration {
      position: absolute;
      top: -50%;
      right: -20%;
      width: 500px;
      height: 500px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content-wrapper {
      position: relative;
      z-index: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-xl);
    }

    .header-left {
      flex: 1;
    }

    .header-badge-group {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(59, 130, 246, 0.15);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #60a5fa;
    }

    .header-badge {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 6px;
      color: rgba(96, 165, 250, 0.8);
      font-style: italic;
    }

    .header-title {
      font-size: 3.5rem;
      font-weight: var(--font-weight-black);
      color: white;
      letter-spacing: -0.05em;
      line-height: 1;
      margin: 0 0 var(--space-sm);
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #818cf8, #22d3ee);
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

    .header-right {
      display: flex;
      gap: var(--space-md);
    }

    .tab-switcher {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(20px);
      padding: var(--space-xs);
      border-radius: var(--radius-3xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tab-btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-2xl);
      font-weight: var(--font-weight-black);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 2px;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn.active {
      background: white;
      color: #0f172a;
    }

    .content-area {
      animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-xl);
    }

    .project-card {
      position: relative;
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-3xl);
      padding: var(--space-2xl);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
      overflow: hidden;
    }

    .project-card:hover {
      box-shadow: var(--shadow-2xl), 0 0 0 1px rgba(59, 130, 246, 0.05);
      transform: translateY(-8px);
    }

    .card-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 128px;
      height: 128px;
      background: rgba(59, 130, 246, 0.05);
      filter: blur(48px);
      transition: background var(--transition-base);
    }

    .project-card:hover .card-glow {
      background: rgba(59, 130, 246, 0.1);
    }

    .card-content {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--space-xl);
    }

    .card-icon {
      width: 56px;
      height: 56px;
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #3b82f6;
      transition: transform var(--transition-base);
    }

    .project-card:hover .card-icon {
      transform: scale(1.1);
    }

    .status-badge {
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: 9px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 1px;
      border: 1px solid;
    }

    .status-active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.2);
    }

    .status-completed {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.2);
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      letter-spacing: -0.02em;
      margin: 0 0 var(--space-md);
      text-transform: uppercase;
      font-style: italic;
      line-height: 1;
    }

    .card-description {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-xl);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-body {
      margin-top: auto;
    }

    .progress-section {
      margin-bottom: var(--space-xl);
    }

    .progress-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--space-sm);
    }

    .progress-label {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
    }

    .progress-value {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #3b82f6;
      font-style: italic;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #6366f1);
      border-radius: var(--radius-full);
      box-shadow: 0 0 8px rgba(59, 130, 246, 0.4);
      transition: width 1s ease-out;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
      margin-bottom: var(--space-lg);
    }

    .stat-item {
      text-align: center;
    }

    .stat-item-border {
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
    }

    .stat-label {
      font-size: 9px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 1px;
      color: var(--color-text-muted);
      margin-bottom: var(--space-xs);
    }

    .stat-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      font-style: italic;
    }

    .card-actions {
      display: flex;
      gap: var(--space-md);
      padding-top: var(--space-md);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      font-weight: var(--font-weight-black);
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #0f172a;
      color: white;
    }

    .btn-primary:hover {
      background: #3b82f6;
    }

    .btn-full {
      flex: 1;
      height: 48px;
    }

    .btn-icon {
      width: 48px;
      height: 48px;
      background: var(--color-bg);
      color: var(--color-text-muted);
      border-radius: var(--radius-lg);
    }

    .btn-icon:hover {
      color: #3b82f6;
    }

    .timeline-view {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .timeline-header {
      display: flex;
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
    }

    .timeline-header-left {
      width: 288px;
      padding: var(--space-xl);
      border-right: 1px solid var(--color-border);
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--color-text-muted);
      font-style: italic;
    }

    .timeline-header-right {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      padding: var(--space-xl);
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
      color: var(--color-text-muted);
      text-align: center;
      font-style: italic;
    }

    .timeline-body {
      display: flex;
      flex-direction: column;
    }

    .timeline-row {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition-base);
    }

    .timeline-row:hover {
      background: rgba(59, 130, 246, 0.05);
    }

    .timeline-row-left {
      width: 288px;
      padding: var(--space-xl);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .project-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      text-transform: uppercase;
      font-style: italic;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .project-meta {
      font-size: 9px;
      font-weight: var(--font-weight-black);
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: var(--space-xs);
    }

    .timeline-row-right {
      flex: 1;
      position: relative;
      padding: var(--space-xl);
      display: flex;
      align-items: center;
    }

    .timeline-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      pointer-events: none;
      opacity: 0.2;
    }

    .grid-line {
      border-right: 1px solid var(--color-border);
    }

    .timeline-bar-wrapper {
      position: relative;
      height: 56px;
      background: var(--color-bg);
      border-radius: var(--radius-2xl);
      overflow: hidden;
      cursor: pointer;
      transition: all var(--transition-base);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .timeline-bar-wrapper:hover {
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .timeline-bar {
      position: relative;
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #4f46e5);
      box-shadow: 0 0 20px rgba(37, 99, 235, 0.4);
      display: flex;
      align-items: center;
      padding: 0 var(--space-lg);
      transition: width 1s ease-out;
    }

    .timeline-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #2563eb, #4f46e5);
      display: flex;
      align-items: center;
      padding: 0 var(--space-md);
      transition: width 1s ease-out;
    }

    .timeline-bar-text {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      color: white;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-style: italic;
    }

    /* Dark mode */
    :host-context(.dark) .project-card,
    :host-context(.dark) .timeline-view {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .card-title,
    :host-context(.dark) .project-name,
    :host-context(.dark) .stat-value {
      color: var(--color-text);
    }

    :host-context(.dark) .card-icon,
    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .progress-bar,
    :host-context(.dark) .timeline-bar-wrapper {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 1024px) {
      .header-content-wrapper {
        flex-direction: column;
        align-items: flex-start;
      }

      .projects-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      }
    }

    @media (max-width: 768px) {
      .projets-container {
        padding: var(--space-md);
      }

      .page-header {
        padding: var(--space-xl);
      }

      .header-title {
        font-size: 2.5rem;
      }

      .projects-grid {
        grid-template-columns: 1fr;
      }

      .timeline-header {
        flex-direction: column;
      }

      .timeline-header-left {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--color-border);
      }

      .timeline-header-right {
        grid-template-columns: repeat(3, 1fr);
      }

      .timeline-row {
        flex-direction: column;
      }

      .timeline-row-left {
        width: 100%;
        border-right: none;
        border-bottom: 1px solid var(--color-border);
      }

      .timeline-row-right {
        padding: var(--space-lg);
      }
    }
  `]
})
export class ChefProjetsComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  currentTab: 'grid' | 'timeline' = 'grid';

  
  projets: any[] = [];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
  }
  
  loadData() {
    const user = this.api.getCurrentUser();
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (data) => { 
        // Filtre pour ne voir que ses propres projets
        const myProjets = data.filter((p: any) => p.utilisateurId === user?.id);
        
        this.projets = myProjets.length ? myProjets : (data.length ? [] : [
          { id: 1, nom: 'Projet démo', description: 'Projet de démonstration', progression: 50, statut: 'En_cours', taches: 10, membres: 3, echeance: '15/05/2026', societeId: this.societeId }
        ]); 
      },
      error: () => {
        this.projets = [
          { id: 1, nom: 'Projet démo', description: 'Projet de démonstration', progression: 50, statut: 'En_cours', taches: 10, membres: 3, echeance: '15/05/2026', societeId: this.societeId }
        ];
      }
    });
  }
}

