import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { ExportService } from '@core/services/export.service';

@Component({
  selector: 'app-rh-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <h1 class="header-title">
              Gestion des <span class="gradient-text">Employés.</span>
            </h1>
            <p class="header-subtitle">
              Espace de Travail RH • {{societeNom}}
            </p>
          </div>
        </div>
        <button type="button" (click)="openForm()" class="btn btn-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Ajouter employé
        </button>
      </header>

      <div class="stats-grid">
        <div class="card stat-card">
          <div class="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div>
            <p class="stat-label">Total</p>
            <h3 class="stat-value">{{totalEmployes}}</h3>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div>
            <p class="stat-label">Actifs</p>
            <h3 class="stat-value">{{employesActifs}}</h3>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <p class="stat-label">Inactifs</p>
            <h3 class="stat-value">{{employesInactifs}}</h3>
          </div>
        </div>
        <div class="card stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <div>
            <p class="stat-label">Nouveaux</p>
            <h3 class="stat-value">{{nouveauxEmployes}}</h3>
          </div>
        </div>
      </div>

      <div class="card main-content">
        <div class="tabs-header">
          <button class="tab-btn active">Liste des employés</button>
          <button class="tab-btn">Statistiques</button>
        </div>

        <div class="tab-content">
          <div class="toolbar">
            <div class="search-filters">
              <div class="search-wrapper">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input type="text" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)"
                  class="search-input"
                  placeholder="Rechercher un talent...">
              </div>
              <select [ngModel]="filterDepartement()" (ngModelChange)="filterDepartement.set($event)"
                class="filter-select">
                <option value="">Tous les départements</option>
                <option value="informatique">Informatique</option>
                <option value="rh">RH</option>
                <option value="commercial">Commercial</option>
                <option value="finance">Finance</option>
              </select>
            </div>
            <div class="export-actions">
              <button (click)="exportExcel()" class="btn btn-emerald">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
                Excel
              </button>
              <button (click)="exportPdf()" class="btn btn-red">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 8 9 8 11"/>
                </svg>
                PDF
              </button>
            </div>
          </div>

          <div class="table-wrapper">
            @if (isLoading) {
              <div class="loading-overlay">
                <div class="spinner"></div>
              </div>
            }

            <table class="data-table">
              <thead>
                <tr>
                  <th>Nom complet</th>
                  <th>Email</th>
                  <th>Poste</th>
                  <th>Département</th>
                  <th>Contrat</th>
                  <th>Statut</th>
                  <th class="text-right">Gestion</th>
                </tr>
              </thead>
              <tbody>
                @for (e of filteredEmployes(); track e.id || e.Id) {
                  <tr>
                    <td>
                      <div class="user-cell">
                        <div class="user-avatar">{{e.nom.charAt(0)}}</div>
                        <span>{{e.nom}}</span>
                      </div>
                    </td>
                    <td>{{e.email}}</td>
                    <td><span class="badge">{{e.poste}}</span></td>
                    <td>{{e.departement || '-'}}</td>
                    <td>{{e.contrat || 'CDI'}}</td>
                    <td>
                      <div class="status-indicator">
                        <div [class]="e.actif ? 'status-dot active' : 'status-dot'"></div>
                        <span [class]="e.actif ? 'status-text active' : 'status-text'">{{e.actif ? 'Actif' : 'Inactif'}}</span>
                      </div>
                    </td>
                    <td class="text-right">
                      <div class="action-buttons">
                        <button (click)="viewDetails(e)" class="btn-icon" title="Voir">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button (click)="editEmploye(e)" class="btn-icon" title="Modifier">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button (click)="deleteEmploye(e)" class="btn-icon btn-danger" title="Supprimer">
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

            @if (!isLoading && filteredEmployes().length === 0) {
              <div class="empty-state">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <p>Aucun talent identifié</p>
              </div>
            }
          </div>

          <footer class="pagination-footer">
            <p class="pagination-info">
              Affichage de <span>{{ (page - 1) * pageSize + 1 }}</span> à <span>{{ Math.min(page * pageSize, totalItems) }}</span> sur <span>{{ totalItems }}</span> entrées
            </p>
            <div class="pagination-controls">
              <select [(ngModel)]="pageSize" (change)="onPageSizeChange()" class="page-size-select">
                <option [value]="5">5 entrées</option>
                <option [value]="10">10 entrées</option>
                <option [value]="25">25 entrées</option>
              </select>
              <div class="pagination-buttons">
                <button (click)="setPage(page - 1)" [disabled]="page === 1" class="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <div class="page-number">{{page}}</div>
                <button (click)="setPage(page + 1)" [disabled]="page * pageSize >= totalItems" class="pagination-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>

    <!-- MODAL: Ajouter / Modifier un employé -->
    @if (showForm) {
      <div class="modal-backdrop" (click)="closeDialog()">
        <div class="modal-box" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingEmploye ? 'Modifier' : 'Ajouter un employé' }}</h2>
            <button class="btn-close" (click)="closeDialog()">✕</button>
          </div>
          <div class="modal-body">
            <div class="form-grid">
              <div class="form-group">
                <label>Nom complet *</label>
                <input type="text" [(ngModel)]="formData.nom" placeholder="Ex: Amine Ben Salah" class="form-input">
              </div>
              <div class="form-group">
                <label>Email *</label>
                <input type="email" [(ngModel)]="formData.email" placeholder="email@entreprise.com" class="form-input">
              </div>
              <div class="form-group">
                <label>Mot de passe</label>
                <input type="password" [(ngModel)]="formData.motDePasse" placeholder="••••••••" class="form-input">
              </div>
              <div class="form-group">
                <label>Téléphone</label>
                <input type="text" [(ngModel)]="formData.telephone" placeholder="+216 XX XXX XXX" class="form-input">
              </div>
              <div class="form-group">
                <label>Poste</label>
                <select [(ngModel)]="formData.poste" class="form-input">
                  <option>Développeur</option><option>Chef de projet</option>
                  <option>Testeur QA</option><option>RH</option>
                  <option>Administrateur</option><option>Commercial</option>
                </select>
              </div>
              <div class="form-group">
                <label>Département</label>
                <select [(ngModel)]="formData.departement" class="form-input">
                  <option>Informatique</option><option>RH</option>
                  <option>Commercial</option><option>Finance</option>
                </select>
              </div>
              <div class="form-group">
                <label>Contrat</label>
                <select [(ngModel)]="formData.contrat" class="form-input">
                  <option>CDI</option><option>CDD</option><option>Stage</option><option>Freelance</option>
                </select>
              </div>
              <div class="form-group">
                <label>Rôle système</label>
                <select [(ngModel)]="formData.typeUtilisateurId" class="form-input">
                  <option value="T002">Admin</option>
                  <option value="T003">RH</option>
                  <option value="T004">Chef de projet</option>
                  <option value="T005">Développeur</option>
                  <option value="T006">Testeur QA</option>
                </select>
              </div>
            </div>
            <label class="checkbox-row" style="margin-top:16px;display:flex;align-items:center;gap:10px;font-weight:600;cursor:pointer">
              <input type="checkbox" [(ngModel)]="formData.actif"> Compte actif
            </label>
          </div>
          <div class="modal-footer">
            <button (click)="closeDialog()" class="btn-cancel">Annuler</button>
            <button type="button" (click)="saveEmploye()" class="btn-save">{{ editingEmploye ? 'Enregistrer' : 'Créer' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* ---- Modal ---- */
    .modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px}
    .modal-box{background:white;border-radius:20px;width:100%;max-width:620px;box-shadow:0 25px 60px rgba(0,0,0,.3);overflow:hidden;animation:slideIn .3s ease}
    @keyframes slideIn{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    .modal-header{padding:20px 24px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg,#f59e0b,#f97316)}
    .modal-header h2{color:white;margin:0;font-size:18px;font-weight:700}
    .btn-close{width:32px;height:32px;border-radius:8px;border:none;background:rgba(255,255,255,.2);color:white;cursor:pointer;font-size:18px;display:flex;align-items:center;justify-content:center}
    .btn-close:hover{background:rgba(255,255,255,.35)}
    .modal-body{padding:24px}
    .form-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
    .form-group{display:flex;flex-direction:column;gap:6px}
    .form-group label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--color-text-muted)}
    .form-input{padding:10px 14px;border:2px solid var(--color-border);border-radius:10px;font-size:14px;color:var(--color-text);outline:none;transition:border-color .2s;width:100%;box-sizing:border-box}
    .form-input:focus{border-color:#f97316}
    .modal-footer{padding:16px 24px;display:flex;justify-content:flex-end;gap:12px;background:var(--color-bg);border-top:1px solid var(--color-border)}
    .btn-cancel{padding:10px 22px;border-radius:10px;border:2px solid var(--color-border);background:transparent;color:var(--color-text);font-weight:600;cursor:pointer}
    .btn-save{padding:10px 26px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#f97316);color:white;font-weight:700;cursor:pointer}
    .btn-save:hover{opacity:.9}
    /* --------------- */

    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      position: relative;
      z-index: 1;
    }

    .header-icon {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fcd34d, #fbbf24);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin: 0;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      position: relative;
      z-index: 2;
    }

    .btn-primary {
      background: white;
      color: #f97316;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-emerald {
      background: #ecfdf5;
      color: #10b981;
    }

    .btn-emerald:hover {
      background: #d1fae5;
    }

    .btn-red {
      background: #fef2f2;
      color: #ef4444;
    }

    .btn-red:hover {
      background: #fee2e2;
    }

    .btn-danger {
      color: #ef4444;
      background: #fef2f2;
    }

    .btn-danger:hover {
      background: #ef4444;
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      padding: var(--space-lg);
    }

    .stat-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stat-icon.orange {
      background: #fff7ed;
      color: #f97316;
    }

    .stat-icon.emerald {
      background: #ecfdf5;
      color: #10b981;
    }

    .stat-icon.amber {
      background: #fffbeb;
      color: #f59e0b;
    }

    .stat-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      line-height: 1;
      margin: 0;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .main-content {
      padding: 0;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .tab-btn {
      padding: var(--space-md) var(--space-lg);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-base);
      border-bottom: 2px solid transparent;
    }

    .tab-btn.active {
      color: var(--color-text);
      border-bottom-color: #f97316;
    }

    .tab-btn:hover:not(.active) {
      color: var(--color-text);
    }

    .tab-content {
      padding: var(--space-lg);
    }

    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
    }

    .search-filters {
      display: flex;
      gap: var(--space-md);
      flex: 1;
      flex-wrap: wrap;
    }

    .search-wrapper {
      position: relative;
      flex: 1;
      min-width: 280px;
    }

    .search-wrapper svg {
      position: absolute;
      left: var(--space-md);
      top: 50%;
      transform: translateY(-50%);
      color: var(--color-text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md) var(--space-sm) 44px;
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      transition: all var(--transition-base);
    }

    .search-input:focus {
      border-color: rgba(249, 115, 22, 0.3);
    }

    .filter-select {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      cursor: pointer;
      min-width: 160px;
    }

    .export-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .table-wrapper {
      position: relative;
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .loading-overlay {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(4px);
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(249, 115, 22, 0.2);
      border-top-color: #f97316;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
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
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .user-cell {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: var(--color-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .badge {
      display: inline-block;
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
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
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
    }

    .status-text {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      color: var(--color-text-muted);
    }

    .status-text.active {
      color: #10b981;
    }

    .text-right {
      text-align: right;
    }

    .action-buttons {
      display: flex;
      gap: var(--space-xs);
      justify-content: flex-end;
    }

    .btn-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      color: #f97316;
      border-color: #f97316;
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      color: var(--color-text-muted);
    }

    .empty-state svg {
      margin-bottom: var(--space-lg);
      color: var(--color-border);
    }

    .empty-state p {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .pagination-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-lg);
      padding-top: var(--space-md);
      flex-wrap: wrap;
    }

    .pagination-info {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
    }

    .pagination-info span {
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
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      outline: none;
    }

    .pagination-buttons {
      display: flex;
      gap: var(--space-xs);
    }

    .pagination-btn {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .pagination-btn:hover:not(:disabled) {
      background: var(--color-bg);
    }

    .pagination-btn:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }

    .page-number {
      width: 36px;
      height: 36px;
      background: var(--color-surface);
      color: var(--color-text);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tabs-header,
    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .tab-btn.active {
      border-bottom-color: #f97316;
    }

    :host-context(.dark) .search-input,
    :host-context(.dark) .filter-select,
    :host-context(.dark) .page-size-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .user-avatar,
    :host-context(.dark) .badge {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .btn-icon {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .pagination-btn {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .pagination-btn:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .page-number {
      background: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .toolbar {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-filters {
        width: 100%;
      }

      .search-wrapper {
        min-width: 100%;
      }
    }
  `]
})
export class RhEmployesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private exportService = inject(ExportService);

  employesSignal = signal<any[]>([]);
  searchQuery = signal('');
  filterDepartement = signal('');
  filterStatut = signal('');
  
  filteredEmployes = computed(() => {
    const list = this.employesSignal();
    const q = this.searchQuery().toLowerCase();
    const dept = this.filterDepartement().toLowerCase();
    const stat = this.filterStatut();
    
    return list.filter(e => {
      const matchesSearch = !q || e.nom.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
      const matchesDept = !dept || e.departement?.toLowerCase() === dept;
      const matchesStatut = !stat || 
        (stat === 'actif' && e.actif) || 
        (stat === 'inactif' && !e.actif);
      return matchesSearch && matchesDept && matchesStatut;
    });
  });

  displayedColumns = ['nom', 'email', 'poste', 'departement', 'contrat', 'statut', 'actions'];
  
  page = 1;
  pageSize = 10;
  totalItems = 0;
  Math = Math;
  isLoading = false;
  
  showForm = false;
  editingEmploye: any = null;
  viewingEmploye: any = null;
  formData: any = { nom: '', email: '', motDePasse: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true };
  
  totalEmployes = 0;
  employesActifs = 0;
  employesInactifs = 0;
  nouveauxEmployes = 0;
  departementsStats: any[] = [];
  societeId: string = '';
  societeNom: string = '';

  ngOnInit() { 
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadEmployes(); 
  }

  private normalizeEmploye(e: any): any {
    if (!e) return null;
    return {
      id: e.id || e.Id || e.utilisateurId || e.UtilisateurId,
      nom: e.nom || e.Nom || 'Sans nom',
      email: e.email || e.Email || '',
      telephone: e.telephone || e.Telephone || '',
      poste: e.poste || e.Poste || 'Employé',
      departement: e.departement || e.Departement || 'Général',
      contrat: e.contrat || e.Contrat || 'CDI',
      actif: e.actif !== undefined ? e.actif : (e.Actif !== undefined ? e.Actif : true),
      societeId: e.societeId || e.SocieteId || this.societeId,
      typeUtilisateurId: e.typeUtilisateurId || e.TypeUtilisateurId || 'T005'
    };
  }

  loadEmployes() {
    this.isLoading = true;
    // Utilisation directe du filtrage par société côté Backend
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        let list: any[] = Array.isArray(res) ? res : (res?.items || []);
        const normalized = list.map((e: any) => this.normalizeEmploye(e)).filter(e => e !== null);
        this.employesSignal.set(normalized);
        this.totalItems = normalized.length;
        this.calculateStats();
        this.isLoading = false;
      },
      error: (err) => { 
        console.error('RH Error:', err);
        this.employesSignal.set([]);
        this.isLoading = false; 
      }
    });
  }

  filterEmployes() {
    this.page = 1;
    this.loadEmployes();
  }


  
  setPage(p: number) {
    this.page = p;
    this.loadEmployes();
  }

  onPageSizeChange() {
    this.page = 1;
    this.loadEmployes();
  }

  exportExcel() {
    this.exportService.exportToExcel(this.filteredEmployes(), 'Talents_Ecosystem_' + this.societeNom);
  }

  exportPdf() {
    const cols = ['Nom', 'Email', 'Poste', 'Contrat', 'Statut'];
    const data = this.filteredEmployes().map(e => [
      e.nom, e.email, e.poste, e.contrat || 'CDI', e.actif ? 'Actif' : 'Inactif'
    ]);
    this.exportService.exportToPdf(cols, data, 'Talents_Ecosystem', 'Audit Stratégique Talents - ' + this.societeNom);
  }

  calculateStats() {
    const list = this.employesSignal();
    this.totalEmployes = list.length;
    this.employesActifs = list.filter(e => e.actif).length;
    this.employesInactifs = this.totalEmployes - this.employesActifs;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    this.nouveauxEmployes = 0; // calculated from real data when available
    
    const depts = ['Informatique', 'RH', 'Commercial', 'Finance'];
    this.departementsStats = depts.map(d => ({
      nom: d,
      nombre: list.filter(e => e.departement === d).length,
      percentage: 0
    }));
    const max = Math.max(...this.departementsStats.map(d => d.nombre), 1);
    this.departementsStats.forEach(d => d.percentage = (d.nombre / max) * 100);
  }

  viewDetails(e: any) { this.viewingEmploye = e; }
  editEmploye(e: any) { this.editingEmploye = e; this.formData = { ...e }; this.showForm = true; }
  
  toggleStatut(e: any) {
    const updatedUser = { ...e, actif: !e.actif };
    this.api.updateUtilisateur(e.id || e.Id, updatedUser).subscribe({
      next: () => {
        // Immediate update
        this.employesSignal.update(list => list.map(item => 
          (item.id === e.id) ? { ...item, actif: !item.actif } : item
        ));
        this.snackBar.open(e.actif ? 'Talent activé' : 'Talent désactivé', 'Fermer', { duration: 2000 });
        this.calculateStats();
      }
    });
  }

  deleteEmploye(e: any) {
    if (confirm("Confirmer la suppression de " + e.nom + " ?")) {
      this.api.deleteUtilisateur(e.id || e.Id).subscribe({
        next: () => {
          this.snackBar.open("Collaborateur supprimé", 'Fermer', { duration: 2000 });
          this.loadEmployes();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  openForm() {
    this.formData = { nom: '', email: '', motDePasse: '', telephone: '', poste: 'Développeur', departement: 'Informatique', contrat: 'CDI', actif: true, typeUtilisateurId: 'T005' };
    this.showForm = true;
    this.editingEmploye = null;
  }

  closeDialog() {
    this.showForm = false;
    this.editingEmploye = null;
    this.viewingEmploye = null;
  }

  saveEmploye() {
    if (!this.formData.nom || this.formData.nom.trim().length < 3) {
      this.snackBar.open("Le nom doit contenir au moins 3 caractères", 'Fermer', { duration: 3000 });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.formData.email || !emailRegex.test(this.formData.email)) {
      this.snackBar.open("Format d'email invalide", 'Fermer', { duration: 3000 });
      return;
    }

    const payload = { 
      id: this.editingEmploye ? (this.editingEmploye.id || this.editingEmploye.Id) : '',
      nom: this.formData.nom,
      email: this.formData.email,
      motDePasse: this.formData.motDePasse || '123456',
      typeUtilisateurId: this.formData.typeUtilisateurId || 'T005',
      societeId: this.societeId,
      actif: this.formData.actif !== undefined ? this.formData.actif : true,
      roleId: 'R001'
    };
    
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id || this.editingEmploye.Id, payload).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Registre mis à jour', 'Fermer', { duration: 2000 });
          this.closeDialog();
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => {
          this.loadEmployes();
          this.snackBar.open('Nouveau collaborateur ajouté', 'Fermer', { duration: 2000 });
          this.closeDialog();
        },
        error: (err) => this.snackBar.open('Erreur: ' + (err.message || 'Échec'), 'Fermer', { duration: 3000 })
      });
    }
  }
}
