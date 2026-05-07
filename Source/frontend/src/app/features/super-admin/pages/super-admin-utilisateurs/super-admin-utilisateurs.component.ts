import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Contrôle Central v4.0</span>
            <span class="badge badge-primary">
              <span class="status-dot"></span>
              Actif
            </span>
          </div>
          <h1 class="header-title">
            GESTION <span class="gradient-text">UTILISATEURS</span>
          </h1>
          <p class="header-subtitle">
            Supervision globale de tous les comptes utilisateurs au sein de l'écosystème Nadhemni.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="openDialog()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Ajouter Utilisateur
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
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilter()" placeholder="Rechercher par nom, email ou identifiant...">
          </div>
          <select [(ngModel)]="selectedSociete" (ngModelChange)="filterBySociete()" class="filter-select">
            <option value="">Toutes les sociétés</option>
            @for (s of societesSignal(); track s.id) {
              <option [value]="s.id">{{s.nom}}</option>
            }
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
            <button (click)="clearFilters()" class="btn-icon btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="card">
        @if (isLoading) {
          <div class="loading-overlay">
            <div class="spinner"></div>
          </div>
        }
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Société</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (u of usersSignal(); track u.id) {
                <tr>
                  <td>
                    <div class="user-info">
                      <div class="user-avatar">{{u.nom.charAt(0)}}</div>
                      <div class="user-details">
                        <span class="user-name">{{u.nom}}</span>
                        <span class="user-email">{{u.email}}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="text-muted">{{getSocieteName(u.societeId)}}</span>
                  </td>
                  <td>
                    <span class="badge badge-primary">{{u.typeUtilisateurId}}</span>
                  </td>
                  <td>
                    <div class="status-indicator">
                      <span class="status-dot" [class.active]="u.actif"></span>
                      <span [class.active]="u.actif">{{u.actif ? 'Actif' : 'Inactif'}}</span>
                    </div>
                  </td>
                  <td>
                    <div class="action-buttons">
                      <button (click)="openDialog(u)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button (click)="toggleStatus(u)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          @if (u.actif) {
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="23" y1="11" x2="17" y2="11"/>
                          } @else {
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <polyline points="17 8 12 3 7 8"/>
                            <line x1="12" y1="3" x2="12" y2="15"/>
                          }
                        </svg>
                      </button>
                      <button (click)="deleteUser(u)" class="btn-icon btn-danger">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          <line x1="10" y1="11" x2="10" y2="17"/>
                          <line x1="14" y1="11" x2="14" y2="17"/>
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
        <footer class="pagination-footer">
          <p class="pagination-info">
            Affichage de <span class="text-primary">{{ (page - 1) * pageSize + 1 }}</span> à <span class="text-primary">{{ Math.min(page * pageSize, totalItems) }}</span> sur <span class="text-primary">{{ totalItems }}</span> entrées
          </p>
          <div class="pagination-controls">
            <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="page-size-select">
              <option [value]="10">10 entrées</option>
              <option [value]="25">25 entrées</option>
              <option [value]="50">50 entrées</option>
            </select>
            <div class="pagination-buttons">
              <button (click)="setPage(page - 1)" [disabled]="page === 1" class="btn-icon btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <div class="page-current">{{page}}</div>
              <button (click)="setPage(page + 1)" [disabled]="page * pageSize >= totalItems" class="btn-icon btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>

    <!-- Modal -->
    @if (showDialog) {
      <div class="modal-overlay" (click)="showDialog = false">
         <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <div>
                  <h2>{{editingUser ? 'MISE À JOUR' : 'NOUVEL UTILISATEUR'}}</h2>
                  <p class="modal-subtitle">Configuration des Accès Système</p>
               </div>
               <button (click)="showDialog = false" class="btn-icon btn-ghost">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
               </button>
            </div>
            <div class="modal-body">
               @if (errorMessage) {
                 <div class="error-banner">
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                     <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                   </svg>
                   <span>{{errorMessage}}</span>
                   <button (click)="errorMessage = null" class="btn-close-error">×</button>
                 </div>
               }
               <div class="form-grid">
                  <div class="form-field">
                     <label>Nom Complet</label>
                     <input [(ngModel)]="formData.nom" name="nom" class="form-input" placeholder="Entrez le nom...">
                  </div>
                  <div class="form-field">
                     <label>Email Principal</label>
                     <input [(ngModel)]="formData.email" name="email" class="form-input" placeholder="nom@exemple.com">
                  </div>
                  <div class="form-field">
                     <label>Société Affiliée</label>
                     <select [(ngModel)]="formData.societeId" name="societeId" class="form-input">
                        <option value="">Aucune</option>
                        @for (s of societesSignal(); track s.id) {
                          <option [value]="s.id">{{s.nom}}</option>
                        }
                     </select>
                  </div>
                  <div class="form-field">
                     <label>Rôle Système</label>
                     <select [(ngModel)]="formData.typeUtilisateurId" name="role" class="form-input">
                        <option value="T002">Admin Société</option>
                        <option value="T003">RH</option>
                        <option value="T004">Chef de Projet</option>
                        <option value="T005">Développeur</option>
                        <option value="T006">Testeur</option>
                        <option value="T007">Candidat / Utilisateur</option>
                     </select>
                  </div>
                  <div class="form-field">
                     <label>Téléphone</label>
                     <input [(ngModel)]="formData.telephone" name="telephone" class="form-input" placeholder="+216 ...">
                  </div>
                  <div class="form-field">
                     <label>Mot de Passe</label>
                     <input type="password" [(ngModel)]="formData.password" name="password" class="form-input" placeholder="••••••••">
                  </div>
               </div>
               <div class="toggle-field">
                  <div>
                     <p class="toggle-label">État du Compte</p>
                     <p class="toggle-sublabel">Activer l'accès aux services</p>
                  </div>
                  <button (click)="formData.actif = !formData.actif" class="toggle-btn" [class.active]="formData.actif">
                     <span class="toggle-knob"></span>
                  </button>
               </div>
            </div>
            <div class="modal-footer">
               <button type="button" (click)="showDialog = false" class="btn btn-ghost">ANNULER</button>
               <button type="button" (click)="saveUser()" class="btn btn-primary">{{editingUser ? 'CONFIRMER MISE À JOUR' : 'CRÉER UTILISATEUR'}}</button>
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
      background: radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%);
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
      background: rgba(168, 85, 247, 0.1);
      color: #a855f7;
      border: 1px solid rgba(168, 85, 247, 0.2);
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: currentColor;
      border-radius: 50%;
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #c084fc, #8b5cf6, #6366f1);
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
      position: relative;
      z-index: 1;
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

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(4px);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(168, 85, 247, 0.2);
      border-top-color: #a855f7;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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
      background: linear-gradient(135deg, #a855f7, #6366f1);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--font-weight-bold);
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
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
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
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

    .page-current {
      width: 48px;
      height: 48px;
      background: #a855f7;
      color: white;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      box-shadow: 0 4px 12px rgba(168, 85, 247, 0.2);
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
      color: #a855f7;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: var(--space-xs) 0 0;
    }

    .modal-body {
      padding: var(--space-xl);
      max-height: 60vh;
      overflow-y: auto;
    }

    .error-banner {
      background: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
      padding: var(--space-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-sm);
      font-weight: 600;
      animation: slideDown 0.3s ease-out;
    }

    .btn-close-error {
      margin-left: auto;
      background: none;
      border: none;
      color: #b91c1c;
      font-size: 20px;
      cursor: pointer;
      line-height: 1;
    }

    @keyframes slideDown {
      from { transform: translateY(-10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
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
      border-color: rgba(168, 85, 247, 0.3);
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
      background: #a855f7;
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

    :host-context(.dark) .loading-overlay {
      background: rgba(0, 0, 0, 0.6);
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
export class SuperAdminUtilisateursComponent implements OnInit {
  private api = inject(ApiService);
  private exportService = inject(ExportService);
  private snackBar = inject(MatSnackBar);

  displayedColumns = ['id', 'nom', 'email', 'societeId', 'typeUtilisateurId', 'actif', 'actions'];
  usersSignal = signal<any[]>([]);
  societesSignal = signal<any[]>([]);

  searchQuery = '';
  selectedSociete = '';
  showDialog = false;
  editingUser: any = null;
  formData: any = { nom: '', email: '', societeId: '', typeUtilisateurId: 'T005', actif: true };

  // Pagination
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;
  errorMessage: string | null = null;

  ngOnInit() {
    this.loadSocietes();
    this.loadUsers();
  }

  loadSocietes() {
    this.api.getSocietes().subscribe({
      next: (data) => { 
        const validSocietes = (data || []).filter((s: any) => s.id && s.id.trim());
        this.societesSignal.set(validSocietes);
      }
    });
  }

  loadUsers() {
    this.isLoading = true;
    const condition = {
      nom: this.searchQuery,
      societeId: this.selectedSociete,
      criteres: {}
    };

    const obs = (this.searchQuery || this.selectedSociete) 
      ? this.api.getUtilisateursByConditionPage(this.page, this.pageSize, condition)
      : this.api.getUtilisateursPage(this.page, this.pageSize);

    obs.subscribe({
      next: (res: any) => {
        this.usersSignal.set(res.items || []);
        this.totalItems = res.totalCount || 0;
        this.isLoading = false;
      },
      error: () => {
        this.usersSignal.set([]);
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  setPage(p: number) {
    this.page = p;
    this.loadUsers();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadUsers();
  }

  applyFilter() {
    this.page = 1;
    this.loadUsers();
  }

  filterBySociete() {
    this.page = 1;
    this.loadUsers();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedSociete = '';
    this.page = 1;
    this.loadUsers();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.usersSignal(), 'Utilisateurs_Nadhemni');
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Société', 'Statut'];
    const data = this.usersSignal().map(u => [
      u.nom, u.email, this.getSocieteName(u.societeId), u.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Utilisateurs_Nadhemni', 'Liste des Utilisateurs');
  }

  getSocieteName(societeId: string): string {
    const societe = this.societesSignal().find(s => s.id === societeId);
    return societe ? societe.nom : '-';
  }

  openDialog(user?: any) {
    this.errorMessage = null;
    this.editingUser = user;
    const autoNv = 'V' + new Date().getFullYear() + '.' + String(Date.now()).slice(-4);
    this.formData = user ? { 
      ...user,
      telephone: user.telephone || '',
      password: '',
      nv: user.nv || autoNv
    } : { 
      nom: '', 
      email: '', 
      societeId: '', 
      typeUtilisateurId: 'T005', 
      actif: true,
      telephone: '',
      password: '',
      nv: autoNv
    };
    this.loadSocietes();
    this.showDialog = true;
  }

  saveUser() {
    if (!this.formData.nom || this.formData.nom.trim().length < 3) {
      this.snackBar.open("Le nom doit contenir au moins 3 caractères", 'Fermer', { duration: 3000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      this.snackBar.open("Format d'email invalide", 'Fermer', { duration: 3000 });
      return;
    }

    // Vérifier si l'email existe déjà (uniquement pour la création)
    if (!this.editingUser) {
      const emailExists = this.usersSignal().some(u => u.email === this.formData.email);
      if (emailExists) {
        this.snackBar.open("Cet email est déjà utilisé par un autre utilisateur", 'Fermer', { duration: 3000 });
        return;
      }
    }

    const payload = {
      ...this.formData,
      motDePasse: this.formData.password || this.formData.motDePasse || (this.editingUser ? '' : 'admin123')
    };

    if (this.editingUser) {
      this.api.updateUtilisateur(this.editingUser.id, payload).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur mis à jour', 'Fermer', { duration: 3000 });
          this.showDialog = false;
          this.loadUsers();
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.error || 'Échec'), 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.snackBar.open('Nouvel utilisateur créé', 'Fermer', { duration: 3000 });
          this.showDialog = false;
          this.loadUsers();
        },
        error: (err) => {
          const errorText = typeof err.error === 'string' ? err.error : JSON.stringify(err.error);
          this.errorMessage = errorText.includes('UNIQUE KEY') && errorText.includes('email') 
            ? "Cet email existe déjà dans la base de données"
            : 'Erreur: ' + (err.error?.message || errorText || 'Échec de la création');
          this.snackBar.open(this.errorMessage, 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  deleteUser(user: any) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.api.deleteUtilisateur(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  toggleStatus(user: any) {
    const updated = { ...user, actif: !user.actif };
    this.api.updateUtilisateur(user.id, updated).subscribe({
      next: () => {
        this.loadUsers();
      }
    });
  }
}
