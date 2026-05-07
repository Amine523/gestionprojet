import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { ToastService } from '@core/services/toast.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chef-equipe',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="equipe-container">
      <!-- Header -->
      <div class="page-header" [class.compact]="selectedProjet">
        <div class="header-main">
          <div class="header-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="header-content">
            <h1 class="header-title">Gestion des Équipes</h1>
            <p class="header-subtitle">
              {{ selectedProjet ? 'Équipe du projet : ' + selectedProjet.nom : 'Gérez les équipes par projet' }}
            </p>
          </div>
        </div>
        
        @if (selectedProjet) {
          <button class="btn btn-outline btn-back" (click)="backToProjects()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Retour aux projets
          </button>
        }
      </div>

      @if (!selectedProjet) {
        <!-- Projects Grid -->
        <div class="projects-grid">
          @for (p of projets; track p.id) {
            <div class="project-card" (click)="selectProjet(p)">
              <div class="project-card-header">
                <div class="project-badge">{{ p.statut || 'Actif' }}</div>
                <div class="project-team-count">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                  </svg>
                  {{ p.memberCount || 0 }} membres
                </div>
              </div>
              <h3 class="project-name">{{ p.nom }}</h3>
              <p class="project-desc">{{ p.description || 'Aucune description' }}</p>
              <div class="project-footer">
                <div class="progress-container">
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="p.avancement || 0"></div>
                  </div>
                  <span>{{ p.avancement || 0 }}%</span>
                </div>
                <button class="btn-manage">Gérer l'équipe</button>
              </div>
            </div>
          } @empty {
            <div class="empty-state">
              <p>Aucun projet trouvé. Créez un projet pour gérer son équipe.</p>
            </div>
          }
        </div>
      } @else {
        <!-- Team Dashboard for Selected Project -->
        <div class="team-dashboard">
          <!-- Stats Summary -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon stat-icon-blue">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ membresDuProjet.length }}</div>
                <div class="stat-label">Membres</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-green">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ projectTachesDone }}</div>
                <div class="stat-label">Tâches terminées</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-orange">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ projectTachesActive }}</div>
                <div class="stat-label">Tâches en cours</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon stat-icon-purple">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2v20M2 12h20"/>
                </svg>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ teamProductivity }}%</div>
                <div class="stat-label">Productivité équipe</div>
              </div>
            </div>
          </div>

          <div class="dashboard-main">
            <!-- Tabs -->
            <div class="card">
              <div class="tabs">
                <button class="tab" [class.active]="activeTab === 'membres'" (click)="activeTab = 'membres'">Équipe</button>
                <button class="tab" [class.active]="activeTab === 'performance'" (click)="activeTab = 'performance'">Performance</button>
                <button class="tab" [class.active]="activeTab === 'disponibilite'" (click)="activeTab = 'disponibilite'">Charge & Dispo</button>
              </div>

              <div class="tab-content">
                @if (activeTab === 'membres') {
                  <div class="team-management">
                    <div class="tab-header">
                      <h3>Membres de l'équipe ({{ filteredMembresDuProjet.length }})</h3>
                      <div class="header-actions">
                        <div class="search-input-group">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                          <input type="text" [(ngModel)]="teamSearch" placeholder="Rechercher dans l'équipe...">
                        </div>
                        <button class="btn btn-primary" (click)="openAddMemberModal()">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                          Ajouter un membre
                        </button>
                      </div>
                    </div>

                    <div class="members-table-container">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Membre</th>
                            <th>Rôle</th>
                            <th>Performance</th>
                            <th>Charge</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          @for (m of filteredMembresDuProjet; track m.id) {
                            <tr>
                              <td>
                                <div class="member-info">
                                  <div class="member-avatar" [style.background-color]="getAvatarColor(m.nom)">{{ m.nom?.charAt(0) }}</div>
                                  <div>
                                    <div class="member-name">{{ m.nom }}</div>
                                    <div class="member-email">{{ m.email }}</div>
                                  </div>
                                </div>
                              </td>
                              <td><span class="badge">{{ m.role || 'Membre' }}</span></td>
                              <td>
                                <div class="perf-indicator">
                                  <div class="perf-bar">
                                    <div class="perf-fill" [style.width.%]="m.performance || 0"></div>
                                  </div>
                                  <span>{{ m.performance || 0 }}%</span>
                                </div>
                              </td>
                              <td>
                                <div class="charge-indicator">
                                  <span [class.text-danger]="m.charge > 80">{{ m.charge || 0 }}%</span>
                                </div>
                              </td>
                              <td>
                                <button class="btn-icon btn-danger" (click)="removeMember(m)" title="Retirer de l'équipe">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          } @empty {
                            <tr>
                              <td colspan="5" class="empty-table">Aucun membre dans cette équipe.</td>
                            </tr>
                          }
                        </tbody>
                      </table>
                    </div>
                  </div>
                }

                @if (activeTab === 'performance') {
                  <div class="performance-view">
                    <div class="performance-grid">
                      @for (m of membresDuProjet; track m.id) {
                        <div class="perf-card">
                          <div class="perf-card-header">
                            <div class="member-avatar large" [style.background-color]="getAvatarColor(m.nom)">{{ m.nom?.charAt(0) }}</div>
                            <div class="perf-card-info">
                              <h4>{{ m.nom }}</h4>
                              <span>{{ m.role }}</span>
                            </div>
                          </div>
                          <div class="perf-metrics">
                            <div class="metric">
                              <span class="metric-label">Tâches Finies</span>
                              <span class="metric-value">{{ m.tachesTerminees || 0 }}</span>
                            </div>
                            <div class="metric">
                              <span class="metric-label">Temps Moyen</span>
                              <span class="metric-value">{{ m.tempsMoyen || 0 }}h</span>
                            </div>
                            <div class="metric">
                              <span class="metric-label">Score</span>
                              <span class="metric-value success">{{ m.performance || 0 }}%</span>
                            </div>
                          </div>
                          <div class="perf-progress">
                            <div class="progress-bar">
                              <div class="progress-fill" [style.width.%]="m.performance || 0"></div>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                @if (activeTab === 'disponibilite') {
                  <div class="availability-view">
                    <div class="workload-list">
                      @for (m of membresDuProjet; track m.id) {
                        <div class="workload-item" [class.overloaded]="m.charge > 80">
                          <div class="workload-member">
                            <div class="member-avatar" [style.background-color]="getAvatarColor(m.nom)">{{ m.nom?.charAt(0) }}</div>
                            <span>{{ m.nom }}</span>
                          </div>
                          <div class="workload-gauge">
                            <div class="gauge-container">
                              <div class="gauge-fill" [style.width.%]="m.charge || 0"></div>
                            </div>
                            <span class="gauge-label">{{ m.charge || 0 }}%</span>
                          </div>
                          <div class="workload-status">
                            @if (m.charge > 80) {
                              <span class="status-badge danger">Surchargé</span>
                            } @else if (m.charge > 50) {
                              <span class="status-badge warning">Occupé</span>
                            } @else {
                              <span class="status-badge success">Disponible</span>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- Add Member Modal -->
    @if (showAddModal) {
      <div class="modal-overlay" (click)="showAddModal = false">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Ajouter un membre au projet</h3>
            <button class="btn-close" (click)="showAddModal = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="search-members">
              <input type="text" [(ngModel)]="memberSearch" placeholder="Rechercher un utilisateur...">
            </div>
            <div class="available-members">
              @for (u of filteredAvailableMembers; track u.id) {
                <div class="available-member-item">
                  <div class="member-info">
                    <div class="member-avatar" [style.background-color]="getAvatarColor(u.nom)">{{ u.nom?.charAt(0) }}</div>
                    <div>
                      <div class="member-name">{{ u.nom }}</div>
                      <div class="member-role">{{ u.role }}</div>
                    </div>
                  </div>
                  <button class="btn btn-sm btn-primary" (click)="addMember(u)">Ajouter</button>
                </div>
              } @empty {
                <p class="empty-search">Aucun utilisateur trouvé ou déjà dans l'équipe.</p>
              }
            </div>
          </div>
        </div>
      </div>
    }

  `,
  styles: [`
    .equipe-container {
      padding: var(--space-xl);
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Header Styling */
    .page-header {
      margin-bottom: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
    }

    .page-header.compact {
      margin-bottom: var(--space-xl);
    }

    .header-main {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .header-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: var(--radius-2xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 8px 16px -4px rgba(59, 130, 246, 0.4);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: 800;
      color: var(--color-text);
      letter-spacing: -0.02em;
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      margin: var(--space-xs) 0 0;
      font-size: var(--font-size-lg);
    }

    .btn-back {
      border-radius: var(--radius-xl);
      padding: var(--space-sm) var(--space-lg);
    }

    /* Projects Grid */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-xl);
    }

    .project-card {
      background: white;
      border-radius: var(--radius-2xl);
      padding: var(--space-xl);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }

    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-xl);
      border-color: #3b82f6;
    }

    .project-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .project-badge {
      padding: 4px 12px;
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border-radius: var(--radius-full);
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .project-team-count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--color-text-muted);
      font-size: 13px;
    }

    .project-name {
      font-size: var(--font-size-xl);
      font-weight: 700;
      margin: 0 0 var(--space-sm);
      color: var(--color-text);
    }

    .project-desc {
      color: var(--color-text-muted);
      font-size: 14px;
      line-height: 1.5;
      margin-bottom: var(--space-xl);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .project-footer {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .progress-container {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted);
    }

    .progress-bar {
      flex: 1;
      height: 8px;
      background: var(--color-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
      border-radius: 4px;
    }

    .btn-manage {
      width: 100%;
      padding: var(--space-md);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      color: var(--color-text);
      font-weight: 600;
      transition: all 0.2s;
    }

    .project-card:hover .btn-manage {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    /* Team Dashboard Stats */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      background: white;
      padding: var(--space-lg);
      border-radius: var(--radius-2xl);
      border: 1px solid var(--color-border);
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon-blue { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
    .stat-icon-green { background: linear-gradient(135deg, #10b981, #059669); }
    .stat-icon-orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
    .stat-icon-purple { background: linear-gradient(135deg, #8b5cf6, #7c3aed); }

    .stat-value {
      font-size: 24px;
      font-weight: 800;
      color: var(--color-text);
      line-height: 1;
    }

    .stat-label {
      font-size: 12px;
      color: var(--color-text-muted);
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 4px;
    }

    /* Dashboard Layout */
    .dashboard-main {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
    }

    .card {
      background: white;
      border-radius: var(--radius-2xl);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .tabs {
      display: flex;
      padding: var(--space-md) var(--space-xl);
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      gap: var(--space-md);
    }

    .tab {
      padding: var(--space-sm) var(--space-lg);
      border: none;
      background: transparent;
      font-weight: 600;
      color: var(--color-text-muted);
      cursor: pointer;
      border-radius: var(--radius-lg);
      transition: all 0.2s;
    }

    .tab.active {
      background: white;
      color: #3b82f6;
      box-shadow: var(--shadow-sm);
    }

    .tab-content {
      padding: var(--space-xl);
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
      gap: var(--space-lg);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .search-input-group {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input-group svg {
      position: absolute;
      left: 12px;
      color: var(--color-text-muted);
    }

    .search-input-group input {
      padding: 10px 12px 10px 36px;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      font-size: 14px;
      width: 250px;
      outline: none;
      transition: all 0.2s;
    }

    .search-input-group input:focus {
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .tab-header h3 {
      font-size: 20px;
      font-weight: 700;
      margin: 0;
    }

    /* Table Styling */
    .data-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .data-table th {
      padding: var(--space-md);
      text-align: left;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-lg) var(--space-md);
      border-bottom: 1px solid var(--color-bg);
    }

    .member-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .member-avatar {
      width: 40px;
      height: 40px;
      background: #3b82f6;
      color: white;
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      border: 2px solid white;
      box-shadow: var(--shadow-sm);
    }

    .member-avatar.large {
      width: 52px;
      height: 52px;
      font-size: 20px;
    }

    .member-name {
      font-weight: 700;
      color: var(--color-text);
      font-size: 15px;
    }

    .member-email {
      font-size: 12px;
      color: var(--color-text-muted);
    }

    .badge {
      padding: 4px 10px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
    }

    .perf-indicator {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 13px;
      font-weight: 700;
    }

    .perf-bar {
      width: 80px;
      height: 6px;
      background: var(--color-bg);
      border-radius: 3px;
    }

    .perf-fill {
      height: 100%;
      background: #10b981;
      border-radius: 3px;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-border);
      background: transparent;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-icon.btn-danger:hover {
      background: #fef2f2;
      border-color: #fecaca;
      color: #ef4444;
    }

    /* Performance View */
    .performance-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: var(--space-xl);
    }

    .perf-card {
      background: var(--color-bg);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      border: 1px solid var(--color-border);
    }

    .perf-card-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .perf-card-info h4 { margin: 0; font-weight: 700; }
    .perf-card-info span { font-size: 12px; color: var(--color-text-muted); }

    .perf-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .metric {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: var(--color-text-muted); }
    .metric-value { font-size: 16px; font-weight: 800; }
    .metric-value.success { color: #10b981; }

    /* Availability View */
    .workload-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .workload-item {
      display: flex;
      align-items: center;
      gap: var(--space-xl);
      padding: var(--space-lg);
      background: var(--color-bg);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
    }

    .workload-member {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      width: 200px;
      font-weight: 700;
    }

    .workload-gauge {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .gauge-container {
      flex: 1;
      height: 12px;
      background: white;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .gauge-fill {
      height: 100%;
      background: #3b82f6;
      transition: width 0.5s ease;
    }

    .workload-item.overloaded .gauge-fill { background: #ef4444; }

    .gauge-label { font-weight: 800; font-size: 14px; width: 45px; }

    .status-badge {
      padding: 6px 12px;
      border-radius: var(--radius-lg);
      font-size: 12px;
      font-weight: 700;
    }

    .status-badge.success { background: #dcfce7; color: #15803d; }
    .status-badge.warning { background: #fef3c7; color: #92400e; }
    .status-badge.danger { background: #fee2e2; color: #b91c1c; }

    /* Modal Styling */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.4);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .modal-card {
      width: 500px;
      background: white;
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
    }

    .modal-header {
      padding: var(--space-lg) var(--space-xl);
      background: var(--color-bg);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 { margin: 0; font-size: 18px; font-weight: 700; }

    .btn-close {
      font-size: 24px;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-text-muted);
    }

    .modal-body { padding: var(--space-xl); }

    .search-members input {
      width: 100%;
      padding: var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      margin-bottom: var(--space-xl);
      outline: none;
    }

    .available-members {
      max-height: 300px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .available-member-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-xl);
    }

    .btn-sm { padding: 6px 12px; font-size: 12px; border-radius: 8px; }

    /* Utils */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: var(--space-md) var(--space-xl);
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary { background: #3b82f6; color: white; border-radius: var(--radius-xl); }
    .btn-primary:hover { background: #2563eb; transform: translateY(-1px); }

    .btn-outline { background: white; border: 1px solid var(--color-border); border-radius: var(--radius-xl); }
    .btn-outline:hover { background: var(--color-bg); }

    .text-danger { color: #ef4444; }
    .empty-table { text-align: center; color: var(--color-text-muted); padding: var(--space-2xl) !important; font-style: italic; }

  `],
})
export class ChefEquipeComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  societeId = localStorage.getItem('societeId') || '';
  projets: any[] = [];
  selectedProjet: any = null;
  membresDuProjet: any[] = [];
  tousLesUtilisateurs: any[] = [];
  
  activeTab: 'membres' | 'performance' | 'disponibilite' = 'membres';
  showAddModal = false;
  memberSearch = '';
  teamSearch = '';

  // Stats
  projectTachesDone = 0;
  projectTachesActive = 0;
  teamProductivity = 0;

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    forkJoin({
      projets: this.api.getProjetsBySociete(this.societeId),
      utilisateurs: this.api.getEmployesBySociete(this.societeId)
    }).subscribe({
      next: (res) => {
        const rawProjets = res.projets || [];
        this.projets = rawProjets.map((p: any) => ({
          id: p.id || p.Id,
          nom: p.nom || p.Nom || 'Sans Nom',
          description: p.description || p.Description || '',
          statut: p.statut || p.Statut || p.status || p.Status || 'Actif',
          avancement: p.avancement || p.Avancement || 0,
          memberCount: p.memberCount || p.MemberCount || 0
        }));
        this.tousLesUtilisateurs = res.utilisateurs || [];
      },
      error: (err) => {
        console.error('Erreur chargement données', err);
        this.toast.error('Erreur lors du chargement des projets');
      }
    });
  }

  selectProjet(projet: any) {
    this.selectedProjet = projet;
    this.loadProjectTeam();
  }

  backToProjects() {
    this.selectedProjet = null;
    this.membresDuProjet = [];
  }

  loadProjectTeam() {
    if (!this.selectedProjet) return;

    forkJoin({
      membres: this.api.getMembresProjet(this.selectedProjet.id),
      taches: this.api.getTachesByProjet(this.selectedProjet.id)
    }).subscribe({
      next: (res) => {
        const projectTaches = res.taches || [];
        
        // Calculate project stats
        this.projectTachesDone = projectTaches.filter(t => t.statut === 'Done' || t.statut === 'Terminé' || t.Statut === 'Done').length;
        this.projectTachesActive = projectTaches.filter(t => t.statut === 'In Progress' || t.statut === 'En cours' || t.Statut === 'In Progress').length;
        
        // Map members and calculate their metrics for this project
        this.membresDuProjet = res.membres.map(m => {
          const mUtilId = m.utilisateurId || m.UtilisateurId;
          const user = this.tousLesUtilisateurs.find(u => u.id === mUtilId || u.Id === mUtilId);
          const userTaches = projectTaches.filter(t => t.utilisateurId === mUtilId || t.UtilisateurId === mUtilId);
          const done = userTaches.filter(t => t.statut === 'Done' || t.statut === 'Terminé' || t.Statut === 'Done').length;
          
          // Calculate individual performance for this project
          const perf = userTaches.length > 0 ? Math.round((done / userTaches.length) * 100) : 0;
          
          // Global charge (across all projects - for simplicity we use task count)
          const globalTaches = res.taches.filter(t => (t.utilisateurId === mUtilId || t.UtilisateurId === mUtilId) && (t.statut !== 'Done' && t.Statut !== 'Done'));
          const charge = Math.min(100, globalTaches.length * 20); // 5 tasks = 100%

          return {
            ...m,
            id: m.id || m.Id,
            utilisateurId: mUtilId,
            nom: user ? user.nom : 'Inconnu',
            email: user ? user.email : '',
            role: user ? user.role : 'Membre',
            performance: perf,
            tachesTerminees: done,
            tachesTotal: userTaches.length,
            charge: charge,
            tempsMoyen: 4.5 // Mock for now
          };
        });

        // Team productivity average
        if (this.membresDuProjet.length > 0) {
          this.teamProductivity = Math.round(this.membresDuProjet.reduce((acc, m) => acc + m.performance, 0) / this.membresDuProjet.length);
        } else {
          this.teamProductivity = 0;
        }
      },
      error: (err) => {
        console.error('Erreur chargement équipe', err);
        this.toast.error('Erreur lors du chargement de l\'équipe');
      }
    });
  }

  get filteredMembresDuProjet() {
    if (!this.teamSearch) return this.membresDuProjet;
    const s = this.teamSearch.toLowerCase();
    return this.membresDuProjet.filter(m => 
      m.nom?.toLowerCase().includes(s) || 
      m.email?.toLowerCase().includes(s) ||
      m.role?.toLowerCase().includes(s)
    );
  }

  get filteredAvailableMembers() {
    const projectUserIds = new Set(this.membresDuProjet.map(m => m.utilisateurId));
    return this.tousLesUtilisateurs.filter(u => {
      const matchesSearch = !this.memberSearch || u.nom?.toLowerCase().includes(this.memberSearch.toLowerCase()) || u.email?.toLowerCase().includes(this.memberSearch.toLowerCase());
      
      // Filter roles allowed in project teams (standardized roles)
      const roleId = (u.typeUtilisateurId || u.TypeUtilisateurId || '').toUpperCase();
      const isTeamRole = roleId === 'T005' || roleId === 'T006' || roleId === 'T004'; // Dev, QA, or even another Chef
      
      if (!isTeamRole) return false;
      return matchesSearch && !projectUserIds.has(u.id);
    });
  }

  getAvatarColor(name: string): string {
    if (!name) return '#3b82f6';
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', 
      '#ec4899', '#06b6d4', '#f43f5e', '#14b8a6'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }


  openAddMemberModal() {
    this.showAddModal = true;
    this.memberSearch = '';
  }

  addMember(user: any) {
    if (!this.selectedProjet) return;

    const payload = {
      Id: null,
      ProjetId: this.selectedProjet.id || this.selectedProjet.Id,
      projetId: this.selectedProjet.id || this.selectedProjet.Id, // Fallback
      UtilisateurId: user.id || user.Id,
      utilisateurId: user.id || user.Id, // Fallback
      Actif: true,
      actif: true
    };

    this.api.addMembreAuProjet(payload).subscribe({
      next: () => {
        this.toast.success(`${user.nom} ajouté à l'équipe`);
        this.loadProjectTeam();
      },
      error: (err) => {
        console.error('Erreur ajout membre', err);
        this.toast.error('Erreur lors de l\'ajout du membre');
      }
    });
  }

  removeMember(member: any) {
    if (!confirm(`Voulez-vous vraiment retirer ${member.nom} de cette équipe ?`)) return;

    const memberId = member.id || member.Id;
    this.api.removeMembreDuProjet(memberId).subscribe({
      next: () => {
        this.toast.success('Membre retiré avec succès');
        this.loadProjectTeam();
      },
      error: (err) => {
        console.error('Erreur suppression membre', err);
        this.toast.error('Erreur lors du retrait du membre');
      }
    });
  }
}
