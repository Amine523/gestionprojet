import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { FormStateService } from '@core/services/form-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ValidationErrorComponent } from '@shared/components';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSnackBarModule, ValidationErrorComponent],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Équipe</span>
          </div>
          <h1 class="header-title">
            Répertoire <span class="gradient-text">Équipe.</span>
          </h1>
          <p class="header-subtitle">
            Répertoire centralisé des ressources humaines pour {{societeNom}}.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="openAddDialog()" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Intégrer un Talent
          </button>
        </div>
      </header>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterEmployes()" placeholder="Rechercher par nom ou email...">
        </div>
        <div class="filter-selects">
          <select [(ngModel)]="filterPoste" (change)="filterEmployes()">
            <option value="">Tous les Rôles</option>
            <option value="developpeur">Ingénieur Logiciel</option>
            <option value="testeur">Spécialiste QA</option>
            <option value="chef_projet">Chef de Projet</option>
            <option value="rh">Ressources Humaines</option>
            <option value="admin_societe">Administrateur Site</option>
          </select>
          <select [(ngModel)]="filterStatut" (change)="filterEmployes()">
            <option value="">Tous les États</option>
            <option value="actif">Unité Active</option>
            <option value="inactif">En Veille</option>
          </select>
        </div>
      </div>

       <!-- Personnel Table -->
      <div class="card table-card animate-scale-in">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Email</th>
                <th>Actif</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (e of paginatedEmployes; track e.id) {
                <tr class="hover-row">
                  <td><span class="id-tag">{{e.id}}</span></td>
                  <td><span class="name">{{e.nom}}</span></td>
                  <td>
                    <span class="role-badge" [ngClass]="e.typeUtilisateurId?.toLowerCase()">
                      {{getRoleLabel(e.typeUtilisateurId)}}
                    </span>
                  </td>
                  <td>{{e.email}}</td>
                  <td>
                    <span [class]="'badge ' + (e.actif ? 'badge-success' : 'badge-danger')">
                      {{e.actif ? 'True' : 'False'}}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="action-row">
                      <button (click)="editEmploye(e)" class="btn-table-icon" title="Modifier">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button (click)="toggleStatut(e)" class="btn-table-icon" [title]="e.actif ? 'Désactiver' : 'Activer'">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          @if (e.actif) { <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/> }
                          @else { <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/> }
                        </svg>
                      </button>
                      <button (click)="deleteEmploye(e)" class="btn-table-icon danger" title="Supprimer">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-footer">
          <div class="pagination-info">
            Affichage de {{ Math.min((page - 1) * pageSize + 1, filteredEmployes.length) }} à {{ Math.min(page * pageSize, filteredEmployes.length) }} sur {{ filteredEmployes.length }} employés
          </div>
          <div class="pagination-actions">
            <button class="btn-page" [disabled]="page === 1" (click)="page = page - 1">Précédent</button>
            <div class="page-numbers">
              @for (p of [].constructor(totalPages); track $index) {
                <button class="btn-number" [class.active]="$index + 1 === page" (click)="page = $index + 1">{{$index + 1}}</button>
              }
            </div>
            <button class="btn-page" [disabled]="page === totalPages" (click)="page = page + 1">Suivant</button>
          </div>
        </div>
      </div>

      @if (filteredEmployes.length === 0) {
        <div class="empty-state">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <p>Aucun Signal Détecté</p>
        </div>
      }

      <!-- Modal -->
      @if (showAddDialog || editingEmploye) {
        <div class="modal-backdrop" (click)="closeDialog()">
           <div class="modal-container" (click)="$event.stopPropagation()">
              <div class="modal-header">
                 <div>
                    <h3>{{editingEmploye ? 'Mise à jour' : 'Intégration Talent'}}</h3>
                    <p>Protocole de Ressource Stratégique</p>
                 </div>
                 <button (click)="closeDialog()" class="btn-icon">
                   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <line x1="18" y1="6" x2="6" y2="18"/>
                     <line x1="6" y1="6" x2="18" y2="18"/>
                   </svg>
                 </button>
              </div>

              <form [formGroup]="employeForm" (ngSubmit)="saveEmploye()">
                  @if (errorMessage) {
                    <div class="error-banner">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                      </svg>
                      <span>{{errorMessage}}</span>
                      <button type="button" (click)="errorMessage = null" class="btn-close-error">×</button>
                    </div>
                  }
                  <div class="form-grid">
                     <div class="form-field">
                        <label>Identité</label>
                        <input formControlName="nom" class="form-input" placeholder="Entrez le nom complet...">
                        <app-validation-error [control]="employeForm.get('nom')"></app-validation-error>
                     </div>
                     <div class="form-field">
                        <label>Email de Transmission</label>
                        <input formControlName="email" type="email" class="form-input" placeholder="nom@domaine.com">
                        <app-validation-error [control]="employeForm.get('email')"></app-validation-error>
                     </div>
                     <div class="form-field">
                        <label>Clé de Sécurité</label>
                        <input type="password" formControlName="password" class="form-input" placeholder="••••••••">
                        <app-validation-error [control]="employeForm.get('password')"></app-validation-error>
                     </div>
                     <div class="form-field">
                        <label>Unité Fonctionnelle</label>
                        <select formControlName="typeUtilisateurId" class="form-input">
                            <option value="T005">Développeur</option>
                            <option value="T006">Testeur</option>
                            <option value="T004">Chef de projet</option>
                            <option value="T003">RH</option>
                            <option value="T002">Admin Société</option>
                        </select>
                        <app-validation-error [control]="employeForm.get('typeUtilisateurId')"></app-validation-error>
                     </div>
                  </div>

                  <div class="toggle-section">
                     <div class="toggle-info">
                        <p>Droits d'Accès Système</p>
                        <span>Autoriser la synchronisation du nœud</span>
                     </div>
                     <button type="button" (click)="employeForm.get('actif')?.setValue(!employeForm.get('actif')?.value)" class="toggle-btn" [class.active]="employeForm.get('actif')?.value">
                       <span class="toggle-knob"></span>
                     </button>
                  </div>
               </form>

               <div class="modal-actions">
                  <button type="button" (click)="closeDialog()" class="btn btn-ghost">Séquence d'Avortement</button>
                  <button type="button" (click)="saveEmploye()" class="btn btn-primary" [disabled]="employeForm.invalid">
                     {{editingEmploye ? 'Valider Mise à Jour' : 'Initialiser Talent'}}
                  </button>
               </div>
           </div>
        </div>
      }
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
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
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
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.2);
    }

    .badge-role {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      border: none;
      font-size: var(--font-size-xs);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #3b82f6, #2563eb);
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
      position: relative;
      z-index: 1;
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
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-action {
      flex: 1;
      background: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-action:hover {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .btn-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .btn-icon.btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-ghost {
      background: transparent;
      color: var(--color-text-muted);
    }

    .btn-ghost:hover {
      color: var(--color-text);
    }

    .filter-bar {
      display: flex;
      gap: var(--space-md);
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      flex-wrap: wrap;
    }

    .search-input {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: var(--color-bg);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
    }

    .search-input svg {
      color: var(--color-text-muted);
    }

    .search-input input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .search-input:focus-within {
      border-color: rgba(59, 130, 246, 0.3);
    }

    .search-input:focus-within svg {
      color: #3b82f6;
    }

    .filter-selects {
      display: flex;
      gap: var(--space-sm);
    }

    .filter-selects select {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      cursor: pointer;
    }

    .filter-selects select:focus {
      border-color: rgba(59, 130, 246, 0.3);
    }

    .personnel-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-lg);
    }

     .table-card {
      padding: 0;
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      text-align: left;
      padding: var(--space-lg);
      background: #f8fafc;
      color: #64748b;
      font-size: var(--font-size-xs);
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-lg);
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .hover-row:hover {
      background: #f8fafc;
    }

    .employee-identity {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .identity-info {
      display: flex;
      flex-direction: column;
    }

    .identity-info .name {
      font-weight: 700;
      color: var(--color-text);
      font-size: var(--font-size-sm);
    }

    .identity-info .id-tag {
      font-size: 10px;
      color: var(--color-text-muted);
      font-family: monospace;
    }

    .role-badge {
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }

    .role-badge.t005 { background: #eef2ff; color: #6366f1; } /* Dev */
    .role-badge.t006 { background: #ecfdf5; color: #10b981; } /* Test */
    .role-badge.t004 { background: #fffbeb; color: #f59e0b; } /* Chef */
    .role-badge.t003 { background: #fdf2f8; color: #ec4899; } /* RH */
    .role-badge.t002 { background: #f8fafc; color: #475569; } /* Admin */

    .contact-box {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: var(--font-size-xs);
      font-weight: 700;
    }

    .action-row {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    .btn-table-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-table-icon:hover {
      background: #f1f5f9;
      color: var(--color-text);
    }

    .btn-table-icon.danger:hover {
      background: #fee2e2;
      color: #ef4444;
      border-color: #fecaca;
    }

    .pagination-footer {
      padding: var(--space-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border-top: 1px solid var(--color-border);
    }

    .pagination-info {
      font-size: var(--font-size-xs);
      font-weight: 700;
      color: #64748b;
    }

    .pagination-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .page-numbers {
      display: flex;
      gap: 4px;
    }

    .btn-page {
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      background: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      cursor: pointer;
    }

    .btn-number {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      border: 1px solid var(--color-border);
      background: white;
      font-size: var(--font-size-xs);
      font-weight: 700;
      cursor: pointer;
    }

    .btn-number.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .text-right { text-align: right; }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-3xl) 0;
      color: var(--color-text-muted);
    }

    .empty-state svg {
      margin: 0 auto var(--space-lg);
      color: #94a3b8;
    }

    .empty-state p {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      margin: 0;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .modal-container {
      width: 500px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-header h3 {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .modal-header p {
      margin: 0;
      font-size: var(--font-size-xs);
      color: #3b82f6;
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .modal-container form {
      padding: var(--space-lg);
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

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }

    .form-field {
      margin-bottom: var(--space-md);
    }

    .form-field label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(59, 130, 246, 0.3);
    }

    .toggle-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      border: 2px solid var(--color-border);
    }

    .toggle-info p {
      margin: 0 0 var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .toggle-info span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
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
      background: #3b82f6;
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

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .filter-bar {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .search-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .filter-selects select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-header {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .toggle-section {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-actions {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .filter-bar {
        flex-direction: column;
      }

      .filter-selects {
        flex-direction: column;
        width: 100%;
      }

      .filter-selects select {
        width: 100%;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminEmployesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  private formState = inject(FormStateService);

  private subs: Subscription[] = [];
  private readonly DRAFT_KEY = 'admin_employe_draft';
  private readonly STATE_KEY = 'admin_employe_state';

  employeForm!: FormGroup;

  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchQuery = '';
  filterPoste = '';
  filterStatut = '';
  showAddDialog = false;
  editingEmploye: any = null;
  societeId = '';
  societeNom = '';
  errorMessage: string | null = null;

  // Pagination
  page = 1;
  pageSize = 6;
  protected readonly Math = Math;

  get totalPages(): number {
    return Math.ceil(this.filteredEmployes.length / this.pageSize);
  }

  get paginatedEmployes() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployes.slice(start, start + this.pageSize);
  }

  getRoleLabel(id: string) {
    return ApiService.getRoleLabel(id);
  }

  ngOnInit() {
    this.initForm();
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    
    // Robust societeNom initialization
    const rawNom = user?.societe?.nom || user?.SocieteNom || 'Votre société';
    this.societeNom = (typeof rawNom === 'string') ? rawNom.replace(/undefined/g, '').trim() : 'Votre société';
    if (!this.societeNom) this.societeNom = 'Votre société';

    this.restoreState();
    this.loadEmployes();
  }

  private restoreState() {
    const state = this.formState.getDraft(this.STATE_KEY);
    if (state) {
      if (state.searchQuery) this.searchQuery = state.searchQuery;
      if (state.filterPoste) this.filterPoste = state.filterPoste;
      if (state.filterStatut) this.filterStatut = state.filterStatut;
    }

    const draft = this.formState.getDraft(this.DRAFT_KEY);
    if (draft) {
      this.employeForm.patchValue(draft, { emitEvent: false });
      if (this.formState.hasDraft(this.DRAFT_KEY)) {
        this.showAddDialog = true;
      }
    }
  }

  saveGeneralState() {
    this.formState.saveDraft(this.STATE_KEY, {
      searchQuery: this.searchQuery,
      filterPoste: this.filterPoste,
      filterStatut: this.filterStatut
    });
  }

  initForm() {
    this.employeForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      typeUtilisateurId: ['T005', [Validators.required]],
      actif: [true]
    });

    this.subs.push(
      this.employeForm.valueChanges.pipe(debounceTime(500)).subscribe(val => {
        if (!this.editingEmploye) {
          this.formState.saveDraft(this.DRAFT_KEY, val);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  loadEmployes() {
    this.api.getEmployesBySociete(this.societeId).subscribe(data => {
      this.employes = data || [];
      this.filterEmployes();
    });
  }

  filterEmployes() {
    this.saveGeneralState();
    this.filteredEmployes = this.employes.filter(e => {
      const isClient = (e.typeUtilisateurId || '').toUpperCase() === 'T008';
      if (isClient) return false;
      
      const matchesSearch = !this.searchQuery || e.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.email?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPoste = !this.filterPoste || (e.typeUtilisateurId || e.poste || '').toLowerCase() === this.filterPoste.toLowerCase();
      const matchesStatut = !this.filterStatut || (this.filterStatut === 'actif' ? e.actif : !e.actif);
      return matchesSearch && matchesPoste && matchesStatut;
    });
  }

   getPosteLabel(p: string): string {
    const R = ApiService.ROLES;
    const labels: any = { 
      [R.DEVELOPPEUR]: 'Ingénieur', 
      [R.TESTEUR]: 'QA', 
      [R.CHEF_PROJET]: 'Chef de Projet', 
      [R.RH]: 'RH', 
      [R.ADMIN_SOCIETE]: 'Administrateur', 
      [R.CLIENT]: 'Client',
      'developpeur': 'Ingénieur',
      'testeur': 'QA',
      'chef_projet': 'Chef de Projet',
      'rh': 'RH',
      'admin_societe': 'Administrateur'
    };
    return labels[p?.toUpperCase()] || labels[p?.toLowerCase()] || p;
  }

  openAddDialog() { 
    this.errorMessage = null;
    this.editingEmploye = null; 
    this.employeForm.reset({ 
      typeUtilisateurId: 'T005', 
      actif: true 
    }); 
    this.employeForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
    this.employeForm.get('password')?.updateValueAndValidity();
    this.restoreState();
    this.showAddDialog = true; 
  }
  editEmploye(e: any) { 
    this.errorMessage = null;
    this.editingEmploye = e; 
    this.employeForm.patchValue({ ...e }); 
    this.employeForm.get('password')?.setValidators([Validators.minLength(8)]);
    this.employeForm.get('password')?.updateValueAndValidity();
    this.showAddDialog = true; 
  }
  closeDialog() { this.showAddDialog = false; this.editingEmploye = null; }

   saveEmploye() {
    if (this.employeForm.invalid) {
      this.employeForm.markAllAsTouched();
      return;
    }
    const formVal = this.employeForm.value;
    const payload = { ...formVal, societeId: this.societeId };
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id, payload).subscribe({
        next: () => { 
          this.loadEmployes(); 
          this.closeDialog(); 
          this.snackBar.open('Talent mis à jour', 'OK', { duration: 2000 });
        },
        error: (err) => {
          this.errorMessage = typeof err.error === 'string' ? err.error : (err.error?.message || 'Échec de la mise à jour');
          this.snackBar.open('Erreur: ' + this.errorMessage, 'Fermer', { duration: 5000 });
        }
      });
    } else {
      this.api.createUtilisateur(payload).subscribe({
        next: () => { 
          this.loadEmployes(); 
          this.closeDialog(); 
          this.formState.clearDraft(this.DRAFT_KEY);
          this.snackBar.open('Nouveau talent intégré', 'OK', { duration: 2000 });
        },
        error: (err) => {
          const errorMsg = typeof err.error === 'string' ? err.error : (err.error?.message || 'Échec de la création');
          this.errorMessage = (errorMsg.includes('UNIQUE KEY') || errorMsg.includes('email'))
             ? "Cet email est déjà utilisé par un autre utilisateur"
             : errorMsg;
          this.snackBar.open('Erreur: ' + this.errorMessage, 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  toggleStatut(e: any) {
    e.actif = !e.actif;
    this.api.updateUtilisateur(e.id, e).subscribe(() => this.snackBar.open(e.actif ? 'Unité Activée' : 'Unité Hors Ligne', 'OK', { duration: 2000 }));
  }

  deleteEmploye(e: any) {
    if (confirm('Supprimer cette unité ?')) {
      this.api.deleteUtilisateur(e.id).subscribe({
        next: () => {
          this.snackBar.open('Unité supprimée', 'Fermer', { duration: 3000 });
          this.loadEmployes();
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}
