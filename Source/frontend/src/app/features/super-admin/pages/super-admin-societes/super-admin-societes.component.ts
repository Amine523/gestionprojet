import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-super-admin-societes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Centre de Commande SaaS</span>
          </div>
          <h1 class="header-title">
            Gestion des <span class="gradient-text">Sociétés.</span>
          </h1>
          <p class="header-subtitle">
            Supervision globale de l'écosystème et déploiement des instances.
          </p>
        </div>
        <div class="header-actions">
          <div class="stats-card">
            <div class="stat-item">
              <p class="stat-label">Total</p>
              <p class="stat-value">{{societes.length}}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <p class="stat-label">Actives</p>
              <p class="stat-value text-primary">{{activeCount}}</p>
            </div>
          </div>
          <button (click)="openDialog()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvelle Société
          </button>
        </div>
      </header>

      <!-- Filters -->
      <div class="card">
        <div class="card-filters">
          <div class="search-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" [(ngModel)]="searchFilters.global" (ngModelChange)="applyAdvancedFilter()" placeholder="Rechercher par organisation, DNS, email...">
          </div>
          <select [(ngModel)]="searchFilters.plan" (change)="applyAdvancedFilter()" class="filter-select">
            <option value="">Tous les plans</option>
            <option value="GOLD">Gold (Entreprise)</option>
            <option value="SILVER">Silver (Pro)</option>
            <option value="FREE">Standard</option>
          </select>
          <div class="filter-actions">
            <button (click)="exportExcel()" class="btn-icon btn-success">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </button>
            <button (click)="exportPdf()" class="btn-icon btn-danger">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Organisation</th>
                <th>Email</th>
                <th>Localisation</th>
                <th>Plan</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (s of dataSource; track s.id) {
                <tr>
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">{{s.nom?.charAt(0) || 'S'}}</div>
                      <div class="user-details">
                        <span class="user-name">{{s.nom || '-'}}</span>
                        <span class="user-email">{{s.id || 'N/A'}}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-muted">{{s.email || 'no-contact@domain.com'}}</span>
                  </td>
                  <td>
                    <div class="location-info">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                        <circle cx="12" cy="10" r="3"/>
                      </svg>
                      <span>{{s.ville || '-'}}{{s.ville && s.pays ? ', ' : ''}}{{s.pays || ''}}</span>
                    </div>
                  </td>
                  <td>
                    <span class="badge" [class.badge-primary]="s.plan === 'GOLD'" [class.badge-secondary]="s.plan === 'SILVER'" [class.badge-tertiary]="!s.plan || s.plan === 'FREE'">
                      {{s.plan || 'Standard'}}
                    </span>
                  </td>
                  <td>
                    <div class="status-indicator">
                      <span class="status-dot" [class.active]="s.actif"></span>
                      <span [class.active]="s.actif">{{s.actif ? 'Actif' : 'Suspendu'}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button (click)="viewProjets(s)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <rect x="2" y="3" width="20" height="14" rx="2"/>
                          <line x1="8" y1="21" x2="16" y2="21"/>
                          <line x1="12" y1="17" x2="12" y2="21"/>
                        </svg>
                      </button>
                      <button (click)="openDialog(s)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button (click)="toggleStatus(s)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          @if (s.actif) {
                            <rect x="6" y="4" width="4" height="16"/>
                            <rect x="14" y="4" width="4" height="16"/>
                          } @else {
                            <polygon points="5 3 19 12 5 21 5 3"/>
                          }
                        </svg>
                      </button>
                      <button (click)="deleteSociete(s)" class="btn-icon btn-danger">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (dataSource.length > 0) {
          <footer class="pagination-footer">
            <p class="pagination-info">
              Affichage de <span class="text-primary">{{(page - 1) * pageSize + 1}}</span> à <span class="text-primary">{{Math.min(page * pageSize, totalItems)}}</span> sur <span class="text-primary">{{totalItems}}</span> entrées
            </p>
            <div class="pagination-controls">
              <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="page-size-select">
                <option [ngValue]="5">5</option>
                <option [ngValue]="10">10</option>
                <option [ngValue]="25">25</option>
                <option [ngValue]="50">50</option>
              </select>
              <div class="pagination-buttons">
                <button (click)="setPage(page - 1)" [disabled]="page === 1" class="btn-icon btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                @for (p of getVisiblePages(); track p) {
                  @if (p === '...') {
                    <span class="pagination-ellipsis">...</span>
                  } @else {
                    <button (click)="setPage(+p)" class="page-btn" [class.active]="p === page">{{p}}</button>
                  }
                }
                <button (click)="setPage(page + 1)" [disabled]="page >= Math.ceil(totalItems / pageSize)" class="btn-icon btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        }

        @if (dataSource.length === 0) {
          <div class="empty-state">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>
            </svg>
            <p class="empty-state-text">Aucune organisation détectée</p>
          </div>
        }
    </div>

      </div>

    <!-- Modal -->
    @if (showDialog) {
      <div class="modal-overlay" (click)="showDialog = false">
         <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <div>
                  <h2>{{editingSociete ? 'CONFIGURATION' : 'DÉPLOIEMENT INSTANCE'}}</h2>
                  <p class="modal-subtitle">Paramètres d'Infrastructure SaaS</p>
               </div>
               <button (click)="showDialog = false" class="btn-icon btn-ghost">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
               </button>
            </div>
            <div class="modal-body">
               <div class="form-grid">
                  <div class="form-field full-width">
                     <label>Nom de l'organisation</label>
                     <input [(ngModel)]="formData.nom" class="form-input" placeholder="Ex: Soft Pro Industries">
                  </div>
                  <div class="form-field">
                     <label>Email Administratif</label>
                     <input [(ngModel)]="formData.email" class="form-input" placeholder="admin@domain.com">
                  </div>
                  <div class="form-field">
                     <label>Plan de Souscription</label>
                     <select [(ngModel)]="formData.plan" class="form-input">
                        <option value="GOLD">Gold (Entreprise)</option>
                        <option value="SILVER">Silver (Pro)</option>
                        <option value="FREE">Standard</option>
                     </select>
                  </div>
                  <div class="form-field full-width">
                     <label>Adresse du Siège</label>
                     <input [(ngModel)]="formData.adresse" class="form-input" placeholder="Rue, Bâtiment...">
                  </div>
                  <div class="form-field">
                     <label>Ville</label>
                     <input [(ngModel)]="formData.ville" class="form-input" placeholder="Ex: Tunis">
                  </div>
                  <div class="form-field">
                     <label>Pays</label>
                     <input [(ngModel)]="formData.pays" class="form-input" placeholder="Ex: Tunisie">
                  </div>
               </div>
               <div class="toggle-field">
                  <div>
                     <p class="toggle-label">État de l'Infrastructure</p>
                     <p class="toggle-sublabel">Activer les services réseau immédiatement</p>
                  </div>
                  <button (click)="formData.actif = !formData.actif" class="toggle-btn" [class.active]="formData.actif">
                     <span class="toggle-knob"></span>
                  </button>
               </div>
            </div>
            <div class="modal-footer">
               <button (click)="showDialog = false" class="btn btn-ghost">ANNULER</button>
               <button (click)="saveSociete()" class="btn btn-primary">{{editingSociete ? 'VALIDER CONFIGURATION' : 'INITIER DÉPLOIEMENT'}}</button>
            </div>
         </div>
      </div>
    }
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
      background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
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
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge-secondary {
      background: rgba(99, 102, 241, 0.1);
      color: #6366f1;
      border: 1px solid rgba(99, 102, 241, 0.2);
    }

    .badge-tertiary {
      background: rgba(148, 163, 184, 0.1);
      color: #94a3b8;
      border: 1px solid rgba(148, 163, 184, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #34d399, #2dd4bf, #06b6d4);
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
      color: #10b981;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
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
      background: white;
      color: #0f172a;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .card-filters {
      display: flex;
      gap: var(--space-md);
    }

    .search-box {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      padding: 0 var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
    }

    .search-box svg {
      color: var(--color-text-muted);
    }

    .search-box input {
      flex: 1;
      padding: var(--space-md) 0;
      border: none;
      background: transparent;
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
    }

    .filter-select {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text);
      outline: none;
      cursor: pointer;
    }

    .filter-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-success {
      color: #10b981;
    }

    .btn-success:hover {
      background: rgba(16, 185, 129, 0.1);
    }

    .btn-danger {
      color: #ef4444;
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table thead {
      background: var(--color-bg);
    }

    .data-table th {
      padding: var(--space-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
    }

    .data-table tbody tr {
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition-base);
    }

    .data-table tbody tr:hover {
      background: var(--color-bg);
    }

    .data-table td {
      padding: var(--space-md);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #10b981, #06b6d4);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--font-weight-bold);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }

    .user-details {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .user-email {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .text-muted {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .location-info svg {
      color: var(--color-text-muted);
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--color-text-muted);
    }

    .status-dot.active {
      background: #10b981;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);
    }

    .status-indicator span {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .status-indicator span.active {
      color: #10b981;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-xs);
      justify-content: flex-end;
    }

    .pagination-footer {
      padding: var(--space-lg);
      background: var(--color-bg);
      border-top: 1px solid var(--color-border);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: var(--space-md);
    }

    .pagination-info {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .text-primary {
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .page-size-select {
      padding: var(--space-xs) var(--space-sm);
      background: white;
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text);
      outline: none;
      cursor: pointer;
    }

    .pagination-buttons {
      display: flex;
      gap: var(--space-xs);
      align-items: center;
    }

    .page-btn {
      min-width: 36px;
      height: 36px;
      padding: 0 var(--space-sm);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .page-btn:hover {
      background: var(--color-bg);
    }

    .page-btn.active {
      background: #10b981;
      color: white;
    }

    .pagination-ellipsis {
      padding: 0 var(--space-sm);
      color: var(--color-text-muted);
    }

    .empty-state {
      padding: var(--space-3xl) 0;
      text-align: center;
    }

    .empty-state svg {
      margin: 0 auto var(--space-lg);
      color: var(--color-text-muted);
    }

    .empty-state-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      margin: 0;
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(8px);
    }

    .modal {
      width: 100%;
      max-width: 640px;
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: var(--shadow-2xl);
      overflow: hidden;
    }

    .modal-header {
      padding: var(--space-xl);
      border-bottom: 1px solid var(--color-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: var(--color-bg);
    }

    .modal-header h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
    }

    .modal-subtitle {
      font-size: var(--font-size-xs);
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-xs) 0 0;
    }

    .modal-body {
      padding: var(--space-xl);
      max-height: 60vh;
      overflow-y: auto;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-lg);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-field.full-width {
      grid-column: 1 / -1;
    }

    .form-field label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-input {
      padding: var(--space-md);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(16, 185, 129, 0.3);
    }

    .toggle-field {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-lg);
    }

    .toggle-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      margin: 0;
    }

    .toggle-sublabel {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: var(--space-xs) 0 0;
    }

    .toggle-btn {
      width: 80px;
      height: 40px;
      background: #d1d5db;
      border-radius: 20px;
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
      top: 4px;
      left: 4px;
      width: 32px;
      height: 32px;
      background: white;
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .toggle-btn.active .toggle-knob {
      transform: translateX(40px);
    }

    .modal-footer {
      padding: var(--space-xl);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      background: var(--color-bg);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .search-box,
    :host-context(.dark) .filter-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .data-table tbody tr:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .modal {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .toggle-field {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .toggle-btn {
      background: #4b5563;
    }

    :host-context(.dark) .pagination-footer {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .page-size-select {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .page-btn:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .card-filters {
        flex-direction: column;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminSocietesComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private exportService = inject(ExportService);

  get activeCount() {
    return this.societes.filter(s => s.actif).length;
  }

  viewProjets(societe: any) {
    const id = societe.id || societe.Id;
    if (!id) return;
    this.router.navigate(['/superadmin/projets'], { queryParams: { societeId: id } });
  }

  societes: any[] = [];
  dataSource: any[] = [];
  selection = new SelectionModel<any>(true, []);

  searchQuery = '';
  searchFilters = { global: '', city: '', plan: '' };
  showDialog = false;
  editingSociete: any = null;
  formData: any = { nom: '', adresse: '', telephoneContact: '', actif: true, plan: 'Standard' };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) this.searchQuery = params['filter'];
    });
    this.loadSocietes();
  }

  loadSocietes() {
    this.isLoading = true;
    this.api.getSocietesPage(this.page, this.pageSize).subscribe({
      next: (res: any) => {
        this.societes = (res.items || []).map((s: any, idx: number) => {
          if (!s.id && !s.Id) s.id = 'SOC_TN' + (idx + 1);
          return s;
        });
        this.dataSource = this.societes;
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.societes = [];
        this.dataSource = [];
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadSocietes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadSocietes();
  }

  getVisiblePages(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (this.page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (this.page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = this.page - 1; i <= this.page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }

  exportExcel() {
    this.exportService.exportToExcel(this.dataSource, 'Societes_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Ville', 'Statut'];
    const data = this.dataSource.map(s => [
      s.nom, s.email, s.ville, s.actif ? 'Actif' : 'Suspendu'
    ]);
    this.exportService.exportToPdf(cols, data, 'Societes_Nadhemni', 'Liste des Sociétés');
  }

  applyAdvancedFilter() {
    this.dataSource = this.societes.filter(s => {
      const g = (s.nom + (s.email || '')).toLowerCase().includes(this.searchFilters.global.toLowerCase());
      const c = (s.ville + (s.pays || '')).toLowerCase().includes(this.searchFilters.city.toLowerCase());
      const p = !this.searchFilters.plan || (s.plan || 'Standard').toUpperCase() === this.searchFilters.plan;
      return g && c && p;
    });
  }

  openDialog(societe?: any) {
    this.editingSociete = societe;
    this.formData = societe ? { 
      ...societe
    } : { 
      nom: '', adresse: '', telephoneContact: '', actif: true, plan: 'Standard', email: '', ville: '', pays: ''
    };
    this.showDialog = true;
  }

  saveSociete() {
    if (this.editingSociete) {
      this.api.updateSociete(this.formData).subscribe({
        next: () => {
          this.showDialog = false;
          this.loadSocietes();
        }
      });
    } else {
      const societeId = 'SOC_' + Date.now().toString(36).toUpperCase();
      this.formData.id = societeId;
      this.api.createSociete(this.formData).subscribe({
        next: () => {
          this.showDialog = false;
          this.loadSocietes();
        }
      });
    }
  }

  toggleStatus(societe: any) {
    const updated = { ...societe, actif: !societe.actif };
    this.api.updateSociete(updated).subscribe({
      next: () => this.loadSocietes()
    });
  }

  deleteSociete(societe: any) {
    const id = societe.id || societe.Id || '';
    if (!id) return;
    if (confirm('Confirmer la suppression définitive de ' + societe.nom + ' ?')) {
      this.api.deleteSociete(id).subscribe({
        next: () => this.loadSocietes()
      });
    }
  }
}
