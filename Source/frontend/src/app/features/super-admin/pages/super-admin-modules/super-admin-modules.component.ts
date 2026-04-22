import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '@core/services/api.service';

interface Module {
  id: string;
  nom: string;
  actif: boolean;
  description?: string;
}

interface SocieteModule {
  societeId: string;
  societeNom: string;
  modules: string[];
}

@Component({
  selector: 'app-super-admin-modules',
  standalone: true,
  imports: [

    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, 
    MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatProgressBarModule, MatChipsModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Gestion Modules</span>
          </div>
          <h1 class="header-title">
            Modules <span class="gradient-text">SaaS.</span>
          </h1>
          <p class="header-subtitle">
            Activation et configuration des fonctionnalités par société.
          </p>
        </div>
        <div class="header-actions">
          <div class="stats-card">
            <div class="stat-item">
              <p class="stat-label">Sociétés</p>
              <p class="stat-value text-primary">{{societes.length}}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <p class="stat-label">Modules actifs</p>
              <p class="stat-value text-primary">{{getTotalActive()}}</p>
            </div>
          </div>
        </div>
      </header>

      @if (loading) {
        <div class="loading-overlay">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
          <span>Chargement des modules...</span>
        </div>
      }

      <!-- Content -->
      <div class="modules-content">
        <!-- Societies Selector -->
        <div class="card">
          <div class="card-header">
            <h3>Sélectionner une société</h3>
          </div>
          <div class="societe-list">
            @for (societe of societes; track societe.id) {
              <div class="societe-item" [class.selected]="selectedSociete?.id === societe.id" (click)="selectSociete(societe)">
                <div class="societe-avatar">
                  {{societe.nom.charAt(0)}}
                </div>
                <div class="societe-info">
                  <strong>{{societe.nom}}</strong>
                  <span class="text-muted">{{societe.id}}</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </div>
            }
          </div>
        </div>

        <!-- Modules Panel -->
        @if (selectedSociete) {
          <div class="card config-card">
            <div class="card-header">
              <div class="config-title">
                <div class="config-avatar">
                  {{selectedSociete.nom.charAt(0)}}
                </div>
                <div>
                  <h3>{{selectedSociete.nom}}</h3>
                  <span class="config-subtitle">Configuration des modules</span>
                </div>
              </div>
              <button class="btn btn-primary" (click)="saveModules()" [disabled]="saving">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Enregistrer
              </button>
            </div>

            <div class="modules-grid">
              @for (module of availableModules; track module.id) {
                <div class="module-card" [class.active]="isModuleActive(module.id)" [class.inactive]="!isModuleActive(module.id)">
                  <div class="module-header">
                    <div class="module-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="7" height="7"/>
                        <rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/>
                        <rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    </div>
                    <button class="toggle-btn" [class.active]="isModuleActive(module.id)" (click)="toggleModule(module.id, !isModuleActive(module.id))">
                      <span class="toggle-knob"></span>
                    </button>
                  </div>
                  <div class="module-body">
                    <h4>{{module.nom}}</h4>
                    <p>{{module.description}}</p>
                  </div>
                  <div class="module-footer">
                    <span class="badge" [class.active]="isModuleActive(module.id)" [class.inactive]="!isModuleActive(module.id)">
                      @if (isModuleActive(module.id)) {
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      } @else {
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      }
                      {{isModuleActive(module.id) ? 'Actif' : 'Inactif'}}
                    </span>
                  </div>
                </div>
              }
            </div>

            <div class="activation-summary">
              <h4>Résumé d'activation</h4>
              <div class="summary-bars">
                @for (category of moduleCategories; track category.name) {
                  <div class="summary-item">
                    <div class="summary-label">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="16" x2="12" y2="12"/>
                        <line x1="12" y1="8" x2="12.01" y2="8"/>
                      </svg>
                      <span>{{category.name}}</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress-fill" [style.width.%]="getCategoryProgress(category.name)"></div>
                    </div>
                    <span class="summary-value">{{getCategoryActiveCount(category.name)}}/{{getCategoryTotalCount(category.name)}}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }

        @if (!selectedSociete) {
          <div class="no-selection">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
            <h3>Sélectionnez une société</h3>
            <p>Choisissez une société dans la liste pour configurer ses modules</p>
          </div>
        }
      </div>

      <!-- Info Card -->
      <div class="card info-card">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <div class="info-content">
          <h4>Modules disponibles</h4>
          <p>Chaque module représente une fonctionnalité majeure de la plateforme. Les société peuvent activer/désactiver les modules selon leurs besoins.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #a78bfa, #c084fc);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      color: white;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .text-primary {
      color: #6366f1;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-3xl);
      color: var(--color-text-muted);
    }

    .loading-overlay svg {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .modules-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
    }

    .card-header {
      margin-bottom: var(--space-lg);
    }

    .card-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .societe-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      max-height: 500px;
      overflow-y: auto;
    }

    .societe-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      cursor: pointer;
      transition: all var(--transition-base);
      border-radius: var(--radius-md);
    }

    .societe-item:hover {
      background: var(--color-bg);
    }

    .societe-item.selected {
      background: rgba(99, 102, 241, 0.1);
      border-left: 3px solid #6366f1;
    }

    .societe-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-semibold);
    }

    .societe-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .societe-info strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .text-muted {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .config-card {
      display: flex;
      flex-direction: column;
    }

    .config-title {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .config-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .config-title h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .config-subtitle {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #6366f1;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .module-card {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      transition: all var(--transition-base);
      border: 2px solid transparent;
    }

    .module-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .module-card.active {
      background: rgba(16, 185, 129, 0.05);
      border-color: #10b981;
    }

    .module-card.inactive {
      opacity: 0.7;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .module-icon {
      width: 36px;
      height: 36px;
      background: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
      box-shadow: var(--shadow-sm);
    }

    .toggle-btn {
      width: 48px;
      height: 24px;
      background: #d1d5db;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background var(--transition-base);
      border: none;
    }

    .toggle-btn.active {
      background: #10b981;
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .toggle-btn.active .toggle-knob {
      transform: translateX(24px);
    }

    .module-body h4 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .module-body p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
    }

    .module-footer {
      margin-top: var(--space-md);
    }

    .activation-summary {
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .activation-summary h4 {
      margin: 0 0 var(--space-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .summary-bars {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .summary-label {
      width: 140px;
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: var(--color-bg);
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #8b5cf6);
      border-radius: 3px;
      transition: width var(--transition-base);
    }

    .summary-value {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      width: 40px;
      text-align: right;
    }

    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      background: var(--color-bg);
      border-radius: var(--radius-xl);
      text-align: center;
    }

    .no-selection svg {
      color: var(--color-text-muted);
      margin-bottom: var(--space-md);
    }

    .no-selection h3 {
      margin: 0 0 var(--space-sm);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .no-selection p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .info-card {
      display: flex;
      gap: var(--space-md);
      align-items: flex-start;
      background: rgba(99, 102, 241, 0.05);
      border-color: rgba(99, 102, 241, 0.2);
    }

    .info-card svg {
      color: #6366f1;
      flex-shrink: 0;
    }

    .info-content h4 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .info-content p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .societe-item:hover,
    :host-context(.dark) .module-card {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .societe-item.selected {
      background: rgba(99, 102, 241, 0.2);
    }

    :host-context(.dark) .module-card.active {
      background: rgba(16, 185, 129, 0.1);
    }

    :host-context(.dark) .module-icon {
      background: var(--color-surface);
    }

    :host-context(.dark) .toggle-btn {
      background: #4b5563;
    }

    :host-context(.dark) .progress-bar {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .no-selection {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .info-card {
      background: rgba(99, 102, 241, 0.1);
      border-color: rgba(99, 102, 241, 0.3);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .modules-content {
        grid-template-columns: 1fr;
      }

      .modules-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminModulesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  loading = true;
  saving = false;
  societes: any[] = [];
  selectedSociete: any = null;
  societeModules: { [key: string]: string[] } = {};
  
  availableModules = [
    { id: 'societes', nom: 'Gestion Sociétés', description: '.multitenant', icon: 'apartment', category: 'Core' },
    { id: 'utilisateurs', nom: 'Utilisateurs', description: 'Gestion des utilisateurs', icon: 'people', category: 'Core' },
    { id: 'roles', nom: 'Rôles & Permissions', description: 'Sécurité RBAC', icon: 'admin_panel_settings', category: 'Core' },
    { id: 'projets', nom: 'Gestion Projets', description: 'Suivi des projets', icon: 'folder', category: 'Gestion' },
    { id: 'taches', nom: 'Tâches', description: 'Gestion des tâches', icon: 'task', category: 'Gestion' },
    { id: 'bugs', nom: 'Gestion Bugs', description: 'Suivi des anomalies', icon: 'bug_report', category: 'Gestion' },
    { id: 'rh', nom: 'RH', description: ' Ressources humaines', icon: 'supervisor_account', category: 'RH' },
    { id: 'pointage', nom: 'Pointage', description: 'Gestion du temps', icon: 'access_time', category: 'RH' },
    { id: 'conges', nom: 'Congés', description: 'Gestion des congés', icon: 'event_available', category: 'RH' },
    { id: 'recrutement', nom: 'Recrutement', description: 'Gestion du recrutement', icon: 'person_search', category: 'RH' },
    { id: 'chat', nom: 'Chat & Communication', description: 'Messagerie interne', icon: 'forum', category: 'Communication' },
    { id: 'notifications', nom: 'Notifications', description: 'Alertes et notifications', icon: 'notifications', category: 'Communication' },
    { id: 'dashboards', nom: 'Tableaux de bord', description: 'Statistiques et rapports', icon: 'dashboard', category: 'Analytics' },
    { id: 'documents', nom: 'Documents', description: ' Gestion documentaire', icon: 'description', category: 'Outils' },
    { id: 'calendrier', nom: 'Calendrier', description: 'Planification', icon: 'event', category: 'Outils' },
    { id: 'api', nom: 'API Accès', description: 'APIs externes', icon: 'api', category: 'Technique' }
  ];

  moduleCategories = [
    { name: 'Core', icon: 'apps' },
    { name: 'Gestion', icon: 'folder' },
    { name: 'RH', icon: 'supervisor_account' },
    { name: 'Communication', icon: 'forum' },
    { name: 'Analytics', icon: 'dashboard' },
    { name: 'Outils', icon: 'build' },
    { name: 'Technique', icon: 'code' }
  ];

  ngOnInit() {
    this.loadSocietes();
  }

  loadSocietes() {
    this.loading = true;
    this.api.getSocietes().subscribe({
      next: (data) => {
        this.societes = data || [];
        if (this.societes.length > 0) {
          this.societeModules = {};
          this.societes.forEach(s => {
            this.societeModules[s.id] = this.availableModules.map(m => m.id);
          });
        }
        this.loading = false;
      },
      error: () => {
        this.societes = [
          { id: 'SOC001', nom: 'Leadertec' },
          { id: 'SOC002', nom: 'TechCorp' },
          { id: 'SOC003', nom: 'InnovTech' }
        ];
        this.societes.forEach(s => {
          this.societeModules[s.id] = this.availableModules.map(m => m.id);
        });
        this.loading = false;
      }
    });
  }

  selectSociete(societe: any) {
    this.selectedSociete = societe;
    if (!this.societeModules[societe.id]) {
      this.societeModules[societe.id] = this.availableModules.map(m => m.id);
    }
  }

  isModuleActive(moduleId: string): boolean {
    if (!this.selectedSociete) return false;
    return this.societeModules[this.selectedSociete.id]?.includes(moduleId) || false;
  }

  toggleModule(moduleId: string, active: boolean) {
    if (!this.selectedSociete) return;
    const modules = this.societeModules[this.selectedSociete.id] || [];
    if (active) {
      if (!modules.includes(moduleId)) {
        modules.push(moduleId);
      }
    } else {
      const index = modules.indexOf(moduleId);
      if (index > -1) {
        modules.splice(index, 1);
      }
    }
    this.societeModules[this.selectedSociete.id] = modules;
    
    this.saveToStorage();
    
    this.snackBar.open(
      `Module ${active ? 'activé' : 'désactivé'} pour ${this.selectedSociete.nom}`, 
      'OK', 
      { duration: 2000 }
    );
  }

  saveModules() {
    this.saveToStorage();
    
    this.snackBar.open(
      `Modules enregistrés pour ${this.selectedSociete.nom}`, 
      'OK', 
      { duration: 3000 }
    );
  }
  
  private saveToStorage() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    
    storage.modules = storage.modules || {};
    storage.modules[this.selectedSociete.id] = this.societeModules[this.selectedSociete.id] || [];
    
    localStorage.setItem('app_data', JSON.stringify(storage));
    
    this.saveModulesToDatabase();
  }
  
  private saveModulesToDatabase() {
    if (!this.selectedSociete) return;
    const modulesJson = JSON.stringify(this.societeModules[this.selectedSociete.id] || []);
    this.api.updateSocieteModules(this.selectedSociete.id, modulesJson).subscribe({
      next: () => console.log('Modules enregistrés en base de données'),
      error: () => console.log('Erreur lors de l\'enregistrement des modules')
    });
  }

  getTotalActive(): number {
    return Object.values(this.societeModules).reduce((sum, mods) => sum + mods.length, 0);
  }

  getCategoryProgress(category: string): number {
    if (!this.selectedSociete) return 0;
    const catModules = this.availableModules.filter(m => m.category === category);
    const activeCount = catModules.filter(m => this.isModuleActive(m.id)).length;
    return (activeCount / catModules.length) * 100;
  }

  getCategoryActiveCount(category: string): number {
    if (!this.selectedSociete) return 0;
    const catModules = this.availableModules.filter(m => m.category === category);
    return catModules.filter(m => this.isModuleActive(m.id)).length;
  }

  getCategoryTotalCount(category: string): number {
    return this.availableModules.filter(m => m.category === category).length;
  }
}

