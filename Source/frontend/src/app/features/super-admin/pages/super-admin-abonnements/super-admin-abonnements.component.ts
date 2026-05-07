import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-super-admin-abonnements',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Architecture Financière</span>
          </div>
          <h1 class="header-title">
            Plans & <span class="gradient-text">Abonnements.</span>
          </h1>
          <p class="header-subtitle">
            Gestion des flux de revenus, des plans de souscription et de la facturation écosystème.
          </p>
        </div>
        <div class="header-actions">
          <button (click)="openAddDialog()" class="btn btn-primary">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Nouvel Abonnement
          </button>
        </div>
      </header>

      <!-- Navigation Tabs -->
      <div class="tabs-container">
        @for (tab of ['plans', 'abonnements', 'factures']; track tab) {
          <button (click)="activeTab = tab" [class.active]="activeTab === tab" class="tab-btn">
            {{tab === 'plans' ? 'Plans Stratégiques' : (tab === 'abonnements' ? 'Abonnements Actifs' : 'Registre de Facturation')}}
          </button>
        }
      </div>

      <!-- Tab Content: Plans -->
      @if (activeTab === 'plans') {
        <div class="plans-grid">
          @for (plan of plans; track plan.id) {
            <div class="plan-card" [class.featured]="plan.populaire">
              @if (plan.populaire) {
                <span class="plan-badge">Plus Populaire</span>
              }
              <div class="plan-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  @if (plan.id === 'starter') {
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>
                  } @else if (plan.id === 'pro') {
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10"/>
                  } @else {
                    <polygon points="12 2 2 12 12 12 11 22 21 10 12 10"/>
                  }
                </svg>
              </div>
              <h3 class="plan-name">{{plan.nom}}</h3>
              <div class="plan-price">
                <span class="price-amount">{{plan.prix}}</span>
                <span class="price-currency">DT</span>
                <span class="price-period">/{{plan.periode}}</span>
              </div>
              <div class="plan-features">
                <div class="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{{plan.utilisateurs === -1 ? 'Utilisateurs Illimités' : plan.utilisateurs + ' Utilisateurs'}}</span>
                </div>
                <div class="feature-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                  </svg>
                  <span>{{plan.stockage}} de Stockage</span>
                </div>
                <div class="feature-list">
                  @for (feat of plan.features; track feat) {
                    <div class="feature-list-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{{feat}}</span>
                    </div>
                  }
                </div>
              </div>
              <div class="plan-actions">
                <button class="btn btn-primary plan-btn" (click)="configurePlan(plan)">Configuration</button>
                <button class="btn-icon btn-danger" (click)="deletePlan(plan)">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/>
                    <line x1="14" y1="11" x2="14" y2="17"/>
                  </svg>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Tab Content: Abonnements -->
      @if (activeTab === 'abonnements') {
        <div class="card">
          <div class="card-filters">
            <div class="search-box">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" [(ngModel)]="filterSocieteId" (ngModelChange)="applyFilters()" placeholder="Rechercher par société ou ID...">
            </div>
            <select [(ngModel)]="filterPlan" (change)="applyFilters()" class="filter-select">
              <option value="">Tous les plans</option>
              <option value="Starter">Starter</option>
              <option value="Premium">Premium</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Organisation</th>
                  <th>Plan</th>
                  <th>Période</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>Gestion</th>
                </tr>
              </thead>
              <tbody>
                @for (abo of abonnements; track abo.id) {
                  <tr>
                    <td>
                      <div class="org-info">
                        <div class="org-avatar">{{abo.societeNom?.charAt(0) || 'S'}}</div>
                        <div class="org-details">
                          <span class="org-name">{{abo.societeNom}}</span>
                          <span class="org-id">ID: {{abo.societeId}}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span class="badge badge-primary">{{abo.planNom}}</span>
                    </td>
                    <td>
                      <span class="date-text">{{abo.dateDebut}} — {{abo.dateFin}}</span>
                    </td>
                    <td>
                      <span class="amount-text">{{abo.montant}} DT</span>
                    </td>
                    <td>
                      <div class="status-indicator">
                        <span class="status-dot" [class.active]="abo.statut === 'Actif'"></span>
                        <span [class.active]="abo.statut === 'Actif'">{{abo.statut || 'Inactif'}}</span>
                      </div>
                    </td>
                    <td>
                      <button (click)="sendRenewalAlert(abo)" class="btn-icon btn-ghost">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }

      <!-- Tab Content: Factures -->
      @if (activeTab === 'factures') {
        <div class="card">
          <div class="card-header">
            <h3>Registre de Facturation</h3>
            <button class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Exporter PDF
            </button>
          </div>
          <div class="invoices-list">
            @for (f of factures; track f.id) {
              <div class="invoice-item">
                <div class="invoice-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                </div>
                <div class="invoice-details">
                  <span class="invoice-number">{{f.numero}}</span>
                  <span class="invoice-meta">{{f.societeNom}} • {{f.date}}</span>
                </div>
                <div class="invoice-amount">
                  <span class="amount-label">Montant Total</span>
                  <span class="amount-value">{{f.montant}} DT</span>
                </div>
                <span class="badge badge-success">{{f.statut}}</span>
                <button (click)="exportPDF(f)" class="btn-icon btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Modal -->
    @if (showAddDialog) {
      <div class="modal-overlay" (click)="closeDialog()">
         <div class="modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <div>
                  <h2>NOUVEL ABONNEMENT</h2>
                  <p class="modal-subtitle">Activation de Licence Système</p>
               </div>
               <button (click)="closeDialog()" class="btn-icon btn-ghost">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
               </button>
            </div>
            <div class="modal-body">
               <div class="form-grid">
                  <div class="form-field">
                     <label>Organisation</label>
                     <select [(ngModel)]="newAbo.societeId" (change)="onSocieteChange()" class="form-input">
                        <option value="">Sélectionner une société</option>
                        @for (s of societes; track s.id) {
                          <option [value]="s.id">{{s.nom}}</option>
                        }
                     </select>
                  </div>
                  <div class="form-field">
                     <label>Plan de Service</label>
                     <select [(ngModel)]="newAbo.planId" (change)="onPlanChange()" class="form-input">
                        <option value="">Sélectionner un plan</option>
                        @for (p of plans; track p.id) {
                          <option [value]="p.id">{{p.nom}} ({{p.prix}} DT)</option>
                        }
                     </select>
                  </div>
                  <div class="form-field">
                     <label>Date d'Activation</label>
                     <input type="date" [(ngModel)]="newAbo.dateDebut" class="form-input">
                  </div>
                  <div class="form-field">
                     <label>Durée d'Engagement</label>
                     <select [(ngModel)]="newAbo.dureeMois" class="form-input">
                        <option [value]="1">1 mois</option>
                        <option [value]="3">3 mois</option>
                        <option [value]="12">12 mois</option>
                        <option [value]="24">24 mois</option>
                     </select>
                  </div>
               </div>
               @if (selectedPlanForForm) {
                 <div class="pricing-summary">
                    <div class="pricing-info">
                       <p class="pricing-label">Total à facturer</p>
                       <h4 class="pricing-amount">{{selectedPlanForForm.prix * newAbo.dureeMois}} <span>DT</span></h4>
                    </div>
                    <div class="pricing-details">
                       <p>{{selectedPlanForForm.nom}}</p>
                       <p>{{newAbo.dureeMois}} mois d'accès</p>
                    </div>
                 </div>
               }
            </div>
            <div class="modal-footer">
               <button (click)="closeDialog()" class="btn btn-ghost">ANNULER</button>
               <button (click)="createAbonnement()" class="btn btn-primary">ACTIVER L'ABONNEMENT</button>
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

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #a855f7, #ec4899);
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

    .btn-danger {
      color: #ef4444;
    }

    .btn-danger:hover {
      background: rgba(239, 68, 68, 0.1);
    }

    .tabs-container {
      display: flex;
      gap: var(--space-sm);
      padding: var(--space-xs);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      width: fit-content;
    }

    .tab-btn {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-xs);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--color-text-muted);
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn.active {
      background: white;
      color: var(--color-text);
      box-shadow: var(--shadow-sm);
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

    .plans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-lg);
    }

    .plan-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 2px solid var(--color-border);
      padding: var(--space-xl);
      position: relative;
      transition: all var(--transition-base);
    }

    .plan-card.featured {
      border-color: #6366f1;
    }

    .plan-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }

    .plan-badge {
      position: absolute;
      top: var(--space-lg);
      right: var(--space-lg);
      padding: var(--space-xs) var(--space-sm);
      background: #6366f1;
      color: white;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .plan-icon {
      width: 64px;
      height: 64px;
      background: rgba(99, 102, 241, 0.1);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6366f1;
      margin-bottom: var(--space-lg);
    }

    .plan-name {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-md);
    }

    .plan-price {
      display: flex;
      align-items: baseline;
      gap: var(--space-xs);
      margin-bottom: var(--space-lg);
    }

    .price-amount {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .price-currency {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .price-period {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .plan-features {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .feature-list {
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .feature-list-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
      font-size: var(--font-size-xs);
    }

    .plan-actions {
      display: flex;
      gap: var(--space-sm);
    }

    .plan-btn {
      flex: 1;
    }

    .card-filters {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
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

    .org-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .org-avatar {
      width: 48px;
      height: 48px;
      background: #6366f1;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: var(--font-weight-bold);
    }

    .org-details {
      display: flex;
      flex-direction: column;
    }

    .org-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .org-id {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .date-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .amount-text {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: #6366f1;
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

    .invoices-list {
      display: flex;
      flex-direction: column;
    }

    .invoice-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      transition: background var(--transition-base);
    }

    .invoice-item:hover {
      background: var(--color-bg);
    }

    .invoice-icon {
      width: 56px;
      height: 56px;
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-text-muted);
    }

    .invoice-details {
      flex: 1;
    }

    .invoice-number {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      text-transform: uppercase;
    }

    .invoice-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .invoice-amount {
      text-align: right;
    }

    .amount-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .amount-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
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
      color: #6366f1;
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
      border-color: rgba(99, 102, 241, 0.3);
    }

    .pricing-summary {
      padding: var(--space-lg);
      background: #0f172a;
      border-radius: var(--radius-lg);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
    }

    .pricing-summary::before {
      content: '';
      position: absolute;
      top: -20px;
      right: -20px;
      width: 80px;
      height: 80px;
      background: rgba(99, 102, 241, 0.2);
      border-radius: 50%;
      filter: blur(24px);
    }

    .pricing-info {
      position: relative;
      z-index: 1;
    }

    .pricing-label {
      font-size: var(--font-size-xs);
      color: #818cf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .pricing-amount {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .pricing-amount span {
      font-size: var(--font-size-lg);
    }

    .pricing-details {
      position: relative;
      z-index: 1;
      text-align: right;
    }

    .pricing-details p {
      font-size: var(--font-size-xs);
      color: #94a3b8;
      margin: 0;
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

    :host-context(.dark) .plan-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-btn {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .tab-btn.active {
      background: var(--color-surface);
      color: var(--color-text);
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

    :host-context(.dark) .invoice-item:hover {
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

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .plans-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminAbonnementsComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'plans';
  plans = [
    { id: 'starter', nom: 'Starter', prix: 99, periode: 'mois', utilisateurs: 5, stockage: '5Go', features: ['Gestion des tâches', '1 projet', 'Support par email', '5 utilisateurs'], actif: true },
    { id: 'pro', nom: 'Professionnel', prix: 299, periode: 'mois', utilisateurs: 20, stockage: '50Go', features: ['Gestion complète', 'Projets illimités', 'Support prioritaire', '20 utilisateurs', 'Chat interne', 'Rapports avancés'], actif: true, populaire: true },
    { id: 'enterprise', nom: 'Enterprise', prix: 599, periode: 'mois', utilisateurs: -1, stockage: 'Illimité', features: ['Toutes les fonctionnalités', 'Support 24/7', 'Utilisateurs illimités', 'API access', 'Formation incluse', 'Manager dédié'], actif: true }
  ];

  societes: any[] = [];
  abonnements: any[] = [];
  abonnementsFull: any[] = [];
  factures: any[] = [];
  showAddDialog = false;
  newAbo: any = { societeId: '', planId: '', dateDebut: '', notes: '', dureeMois: 12, modePaiement: 'mensuel' };
  selectedPlanForForm: any = null;
  selectedSocieteForForm: any = null;
  filterSocieteId = '';
  filterPlan = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getSocietes().subscribe({
      next: (data) => { 
        this.societes = data || [];
        this.loadAllAbonnements();
        this.loadFactures();
      },
      error: () => { 
        this.societes = [];
        this.loadAllAbonnements();
        this.loadFactures();
      }
    });
  }

  loadAllAbonnements() {
    this.api.getAbonnements().subscribe({
      next: (abos) => {
        const abosList = abos || [];
        const societesMap = new Map((this.societes || []).map((s: any) => [s.id || s.Id, s.nom || s.Nom]));
        
        this.abonnementsFull = abosList.map((abo: any) => ({
          id: abo.id || abo.Id,
          societeId: abo.societeId || abo.SocieteId,
          societeNom: societesMap.get(abo.societeId || abo.SocieteId) || 'Organisation Inconnue',
          planNom: abo.typeAbonnement || abo.TypeAbonnement || 'Standard',
          montant: abo.prix || abo.Prix || 0,
          statut: (abo.actif === true || abo.Actif === true) ? 'Actif' : 'Inactif',
          dateDebut: (abo.dateDebut || abo.DateDebut) ? new Date(abo.dateDebut || abo.DateDebut).toLocaleDateString('fr-FR') : '-',
          dateFin: (abo.dateFin || abo.DateFin) ? new Date(abo.dateFin || abo.DateFin).toLocaleDateString('fr-FR') : '-'
        }));
        
        this.applyFilters();
      }
    });
  }

  loadFactures() {
    this.api.getPaiements().subscribe({
      next: (paiements) => {
        const societesMap = new Map((this.societes || []).map((s: any) => [s.id || s.Id, s.nom || s.Nom]));
        this.factures = (paiements || []).map((p: any) => ({
          id: p.id || p.Id,
          numero: 'INV-' + (p.id || p.Id || '').toString().slice(-6).toUpperCase(),
          societeNom: societesMap.get(p.societeId || p.SocieteId) || 'Organisation Inconnue',
          montant: p.montant || p.Montant || 0,
          date: (p.date || p.Date) ? new Date(p.date || p.Date).toLocaleDateString('fr-FR') : '-',
          statut: p.statut || p.Statut || 'Payé'
        }));
      }
    });
  }

  applyFilters() {
    this.abonnements = this.abonnementsFull.filter(abo => {
      const matchesSociete = !this.filterSocieteId || abo.societeNom.toLowerCase().includes(this.filterSocieteId.toLowerCase());
      const matchesPlan = !this.filterPlan || abo.planNom.toLowerCase() === this.filterPlan.toLowerCase();
      return matchesSociete && matchesPlan;
    });
  }

  getPlanIcon(id: string): string {
    if (id === 'starter') return 'send';
    if (id === 'pro') return 'lightning';
    return 'gem';
  }

  openAddDialog() {
    this.newAbo = { societeId: '', planId: '', dateDebut: new Date().toISOString().split('T')[0], notes: '', dureeMois: 12, modePaiement: 'mensuel' };
    this.showAddDialog = true;
  }

  closeDialog() { this.showAddDialog = false; }

  onPlanChange() {
    this.selectedPlanForForm = this.plans.find(p => p.id === this.newAbo.planId);
  }

  onSocieteChange() {
    this.selectedSocieteForForm = this.societes.find(s => s.id === this.newAbo.societeId);
  }

  createAbonnement() {
    if (!this.newAbo.societeId || !this.newAbo.planId) {
      this.snackBar.open('Veuillez sélectionner une société et un plan', 'Fermer', { duration: 3000 });
      return;
    }

    const plan = this.plans.find(p => p.id === this.newAbo.planId);
    
    // Calcul de la date de fin
    const startDate = new Date(this.newAbo.dateDebut);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + parseInt(this.newAbo.dureeMois.toString()));

    const payload = {
      societeId: this.newAbo.societeId,
      typeAbonnement: plan?.nom,
      prix: plan?.prix ? (plan.prix * parseInt(this.newAbo.dureeMois.toString())) : 0,
      dateDebut: startDate.toISOString(),
      dateFin: endDate.toISOString(),
      actif: true
    };

    this.api.createAbonnement(payload).subscribe({
      next: () => {
        this.snackBar.open('Abonnement activé avec succès', 'Fermer', { duration: 3000 });
        this.showAddDialog = false;
        this.loadAllAbonnements();
      },
      error: (err) => {
        console.error('Erreur lors de la création de l\'abonnement:', err);
        this.snackBar.open('Erreur lors de l\'activation', 'Fermer', { duration: 3000 });
      }
    });
  }

  sendRenewalAlert(abo: any) {
    this.snackBar.open('Alerte de renouvellement envoyée à ' + abo.societeNom, 'Fermer', { duration: 3000 });
  }

  exportPDF(facture: any) {
    this.snackBar.open('Téléchargement de la facture ' + facture.numero, 'Fermer', { duration: 3000 });
  }

  configurePlan(plan: any) {
    this.snackBar.open(`Configuration du plan: ${plan.nom}`, 'Fermer', { duration: 3000 });
  }

  deletePlan(plan: any) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le plan ${plan.nom} ?`)) {
      this.snackBar.open(`Plan ${plan.nom} supprimé`, 'Fermer', { duration: 3000 });
    }
  }
}
