import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-diagrams',
  standalone: true,
  imports: [CommonModule],
  template: `

    <div class="diagrams-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h20"></path>
            <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"></path>
            <path d="M7 21h10"></path>
            <path d="M12 21v-7"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Diagrammes d'Architecture</h1>
          <p class="header-subtitle">Schémas applicatifs, flux de données et processus CI/CD</p>
        </div>
      </div>

      <!-- Architecture Section -->
      <div class="section">
        <h2 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          Architecture Globale du SaaS
        </h2>
        <div class="card">
          <div class="architecture-diagram">
            
            <div class="diagram-layer diagram-layer-blue">
              <span class="layer-label">Client Tier (Angular)</span>
              <div class="layer-content">
                <div class="layer-item">Admin UI</div>
                <div class="layer-item">Agile UI</div>
                <div class="layer-item">RH UI</div>
              </div>
            </div>

            <div class="diagram-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <span>HTTP/JSON via interceptor</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>

            <div class="diagram-layer diagram-layer-green">
              <span class="layer-label">API Gateway & Logic (.NET Core REST)</span>
              <div class="layer-content">
                <div class="service-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  Auth Service
                </div>
                <div class="service-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                  User Service
                </div>
                <div class="service-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                  Task Service
                </div>
                <div class="service-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Calculate Service
                </div>
              </div>
            </div>

            <div class="diagram-connector">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              <span>Entity Framework Core / Dapper ORM</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>

            <div class="diagram-layer diagram-layer-red">
              <span class="layer-label">Data Layer</span>
              <div class="layer-content layer-content-center">
                <div class="database-item">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                  SQL Server
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <!-- Workflow Section -->
      <div class="section">
        <h2 class="section-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"></path>
            <path d="M16 21h5v-5"></path>
          </svg>
          Workflow Git & Intégration (Agile)
        </h2>
        <div class="card">
          <div class="workflow-diagram">
            
            <div class="workflow-step">
              <div class="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <span class="step-label">1. Backlog & Jira</span>
            </div>
            
            <svg class="workflow-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
            
            <div class="workflow-step">
              <div class="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
              </div>
              <span class="step-label">2. Feature Branch</span>
            </div>

            <svg class="workflow-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>

            <div class="workflow-step workflow-step-highlight">
              <div class="step-icon step-icon-highlight">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="18" r="3"></circle>
                  <circle cx="6" cy="6" r="3"></circle>
                  <circle cx="18" cy="6" r="3"></circle>
                  <path d="M6 9v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V9"></path>
                  <path d="M12 12V3"></path>
                </svg>
              </div>
              <span class="step-label">3. Pull Request (PR)</span>
            </div>

            <svg class="workflow-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>

            <div class="workflow-step">
              <div class="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span class="step-label">4. QA & Tests</span>
            </div>

            <svg class="workflow-arrow" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>

            <div class="workflow-step">
              <div class="step-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <span class="step-label">5. Deploy (Prod)</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .diagrams-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--space-lg);
      height: 100vh;
      overflow-y: auto;
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .section {
      margin-bottom: var(--space-2xl);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .section-title svg {
      color: #3b82f6;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-2xl);
      box-shadow: var(--shadow-sm);
    }

    .architecture-diagram {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-lg);
    }

    .diagram-layer {
      max-width: 800px;
      width: 100%;
      padding: var(--space-lg);
      border-radius: var(--radius-lg);
      border: 2px dashed;
      position: relative;
      background: white;
    }

    .diagram-layer-blue {
      border-color: #93c5fd;
    }

    .diagram-layer-green {
      border-color: #86efac;
      background: #f0fdf4;
    }

    .diagram-layer-red {
      border-color: #fca5a5;
      background: #fef2f2;
    }

    .layer-label {
      position: absolute;
      top: -12px;
      left: var(--space-lg);
      background: white;
      padding: 0 var(--space-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      border: 2px solid;
      border-radius: var(--radius-full);
    }

    .diagram-layer-blue .layer-label {
      color: #2563eb;
      border-color: #93c5fd;
    }

    .diagram-layer-green .layer-label {
      color: #16a34a;
      border-color: #86efac;
    }

    .diagram-layer-red .layer-label {
      color: #dc2626;
      border-color: #fca5a5;
    }

    .layer-content {
      display: flex;
      justify-content: center;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .layer-content-center {
      justify-content: center;
    }

    .layer-item {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      background: white;
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      text-align: center;
      min-width: 150px;
      cursor: pointer;
      transition: transform var(--transition-base);
      box-shadow: var(--shadow-sm);
    }

    .layer-item:hover {
      transform: translateY(-2px);
    }

    .service-item {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-lg);
      background: white;
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
    }

    .database-item {
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      background: white;
      min-width: 300px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      box-shadow: var(--shadow-sm);
    }

    .diagram-connector {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-xs);
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      font-family: monospace;
    }

    .workflow-diagram {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .workflow-step {
      flex: 1;
      min-width: 120px;
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      background: white;
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      transition: transform var(--transition-base), border-color var(--transition-base);
      cursor: pointer;
      box-shadow: var(--shadow-sm);
    }

    .workflow-step:hover {
      transform: translateY(-2px);
      border-color: #3b82f6;
    }

    .workflow-step-highlight {
      border: 2px solid #3b82f6;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
    }

    .step-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-full);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .step-icon-highlight {
      background: #3b82f6;
      color: white;
    }

    .step-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-align: center;
    }

    .workflow-arrow {
      color: var(--color-border);
      flex-shrink: 0;
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .diagram-layer,
    :host-context(.dark) .layer-item,
    :host-context(.dark) .service-item,
    :host-context(.dark) .database-item,
    :host-context(.dark) .workflow-step {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .diagram-layer-green {
      background: rgba(16, 185, 129, 0.1);
    }

    :host-context(.dark) .diagram-layer-red {
      background: rgba(239, 68, 68, 0.1);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .section-title,
    :host-context(.dark) .layer-item,
    :host-context(.dark) .service-item,
    :host-context(.dark) .database-item,
    :host-context(.dark) .step-label {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .diagram-connector,
    :host-context(.dark) .workflow-arrow {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .step-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .workflow-diagram {
        flex-direction: column;
      }

      .workflow-arrow {
        transform: rotate(90deg);
      }
    }
  `]
})
export class DevDiagramsComponent {

}
