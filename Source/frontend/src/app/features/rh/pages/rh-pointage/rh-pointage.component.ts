import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

interface PointageDisplay {
  id?: string;
  utilisateurId: string;
  nomComplet: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  heuresTravaillees: number;
  status: 'Présent' | 'En cours' | 'Absent';
}

@Component({
  selector: 'app-rh-pointage',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <header class="dashboard-header">
        <div class="header-content">
          <h1 class="header-title">
            Monitoring des <span class="gradient-text">Présences.</span>
          </h1>
          <p class="header-subtitle">
            {{societeNom}} • {{currentDateDisplay}}
          </p>
        </div>
        <div class="header-stats">
           <div class="stat-tile">
              <span class="stat-value emerald">{{stats.employesActifs}}</span>
              <span class="stat-label">Présents</span>
           </div>
           <div class="stat-tile">
              <span class="stat-value amber">{{stats.employesAbsents}}</span>
              <span class="stat-label">Absents</span>
           </div>
           <div class="stat-tile">
              <span class="stat-value indigo">{{stats.tauxPresence}}%</span>
              <span class="stat-label">Taux Présence</span>
           </div>
        </div>
      </header>

      <div class="card toolbar-widget">
        <div class="filters-row">
            <div class="search-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="filterData()" placeholder="Rechercher un collaborateur..." class="search-input">
            </div>

            <div class="filter-group">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <input type="date" [(ngModel)]="filterDate" (ngModelChange)="loadData()" class="date-input">
            </div>

            <div class="filter-spacer"></div>

            <button class="btn btn-secondary" (click)="loadData()">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M23 4v6h-6"/>
                 <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
               </svg>
               Actualiser
            </button>

            <button class="btn btn-primary" (click)="exportRapportHTML()" title="Rapport {{rapportMois}}/{{rapportAnnee}}">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                 <polyline points="14 2 14 8 20 8"/>
                 <line x1="16" y1="13" x2="8" y2="13"/>
                 <line x1="16" y1="17" x2="8" y2="17"/>
                 <polyline points="10 9 8 9 8 11"/>
               </svg>
               Rapport PDF
            </button>

            <button class="btn btn-outline" (click)="exportRapportCSV()">
               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <line x1="12" y1="5" x2="12" y2="19"/>
                 <line x1="5" y1="12" x2="19" y2="12"/>
               </svg>
               CSV
            </button>
        </div>

        <div class="rapport-controls">
          <label class="rc-label">Mois du rapport :</label>
          <select [(ngModel)]="rapportMois" class="date-select">
            <option [value]="1">Janvier</option><option [value]="2">Février</option>
            <option [value]="3">Mars</option><option [value]="4">Avril</option>
            <option [value]="5">Mai</option><option [value]="6">Juin</option>
            <option [value]="7">Juillet</option><option [value]="8">Août</option>
            <option [value]="9">Septembre</option><option [value]="10">Octobre</option>
            <option [value]="11">Novembre</option><option [value]="12">Décembre</option>
          </select>
          <select [(ngModel)]="rapportAnnee" class="date-select">
            <option [value]="2024">2024</option>
            <option [value]="2025">2025</option>
            <option [value]="2026">2026</option>
          </select>
        </div>
      </div>

      <div class="card main-content">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Collaborateur</th>
                <th>Arrivée</th>
                <th>Départ</th>
                <th>Activité</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              @for (p of filteredPointages; track p.id) {
                <tr>
                  <td>
                     <div class="emp-cell">
                        <div class="user-avatar" [style.background]="'hsl('+(p.nomComplet.length * 45)+', 60%, 55%)'">{{p.nomComplet.charAt(0)}}</div>
                        <div class="emp-info">
                           <span class="emp-name">{{p.nomComplet}}</span>
                           <span class="emp-id">#{{p.utilisateurId.substring(0,6)}}</span>
                        </div>
                     </div>
                  </td>
                  <td>
                     <div class="time-pill" [class.empty]="!p.heureDebut">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                          <polyline points="10 17 15 12 10 7"/>
                          <line x1="15" y1="12" x2="3" y2="12"/>
                        </svg>
                        <span>{{p.heureDebut || '--:--'}}</span>
                     </div>
                  </td>
                  <td>
                     <div class="time-pill" [class.empty]="!p.heureFin">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                          <polyline points="16 17 21 12 16 7"/>
                          <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span>{{p.heureFin || (p.heureDebut ? 'En cours' : '--:--')}}</span>
                     </div>
                  </td>
                  <td>
                     @if (p.heuresTravaillees > 0) {
                       <span class="activity-tag">{{p.heuresTravaillees}}h</span>
                     } @else {
                       <span class="no-activity">--</span>
                     }
                  </td>
                  <td>
                    <span class="status-chip" [class]="'status-'+(p.status ? p.status.toLowerCase().replace(' ', '-') : 'pending')">
                      <span class="dot"></span>
                      {{p.status}}
                    </span>
                  </td>
                  <td>
                    <div class="action-row">
                       <button class="btn-icon" title="Ajuster" (click)="editPointage(p)">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           <circle cx="12" cy="12" r="3"/>
                           <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0-9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                         </svg>
                       </button>
                       <button class="btn-icon" title="Historique">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                           <line x1="18" y1="20" x2="18" y2="10"/>
                           <line x1="12" y1="20" x2="12" y2="4"/>
                           <line x1="6" y1="20" x2="6" y2="14"/>
                         </svg>
                       </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>

          @if (filteredPointages.length === 0) {
            <div class="empty-state">
               <div class="empty-icon">
                 <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                   <circle cx="12" cy="12" r="10"/>
                   <path d="M12 8v4"/>
                   <path d="M12 16h.01"/>
                 </svg>
               </div>
               <h3>Aucun résultat trouvé</h3>
               <p>Modifiez vos filtres ou lancez une nouvelle recherche.</p>
            </div>
          }
        </div>
      </div>
    </div>

    @if (showEditDialog) {
      <div class="modal-overlay" (click)="closeEditDialog()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
             <h2>Ajustement du Temps</h2>
             <button class="btn-close" (click)="closeEditDialog()">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <line x1="18" y1="6" x2="6" y2="18"/>
                 <line x1="6" y1="6" x2="18" y2="18"/>
               </svg>
             </button>
          </div>
          <div class="modal-body">
             <div class="form-group">
                <label>Collaborateur</label>
                <div class="readonly-field">{{editingPointage?.nomComplet}}</div>
             </div>
             <div class="form-grid">
                <div class="form-group">
                  <label>Heure d'entrée</label>
                  <input type="time" [(ngModel)]="editForm.entre" class="time-input">
                </div>
                <div class="form-group">
                  <label>Heure de sortie</label>
                  <input type="time" [(ngModel)]="editForm.sortie" class="time-input">
                </div>
             </div>
          </div>
          <div class="modal-footer">
             <button class="btn btn-text" (click)="closeEditDialog()">Annuler</button>
             <button class="btn btn-primary" (click)="savePointageEdit()">Appliquer</button>
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
      background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #818cf8, #6366f1, #4f46e5);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .header-stats {
      display: flex;
      background: white;
      padding: var(--space-md);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      position: relative;
      z-index: 1;
    }

    .stat-tile {
      padding: var(--space-md) var(--space-xl);
      border-right: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .stat-tile:last-child {
      border-right: none;
    }

    .stat-value {
      font-size: 28px;
      font-weight: var(--font-weight-bold);
      line-height: 1;
    }

    .stat-value.emerald {
      color: #10b981;
    }

    .stat-value.amber {
      color: #f59e0b;
    }

    .stat-value.indigo {
      color: #6366f1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      margin-top: var(--space-xs);
      letter-spacing: 0.05em;
    }

    .toolbar-widget {
      padding: var(--space-lg);
      margin-bottom: var(--space-lg);
      border-radius: var(--radius-xl);
      background: white;
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .filters-row {
      display: flex;
      gap: var(--space-lg);
      align-items: center;
      flex-wrap: wrap;
    }

    .search-group {
      flex: 1;
      max-width: 400px;
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .search-group svg {
      color: var(--color-text-muted);
    }

    .search-input {
      border: none;
      background: transparent;
      width: 100%;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
    }

    .date-input {
      border: none;
      background: var(--color-bg);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      cursor: pointer;
    }

    .filter-spacer {
      flex: 1;
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

    .btn-secondary {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: var(--color-surface);
    }

    .btn-primary {
      background: var(--color-primary);
      color: white;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-outline:hover {
      background: var(--color-bg);
    }

    .btn-text {
      background: transparent;
      color: var(--color-text-muted);
      border: none;
    }

    .btn-text:hover {
      color: var(--color-text);
    }

    .rapport-controls {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      border-top: 1px solid var(--color-border);
      flex-wrap: wrap;
    }

    .rc-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .date-select {
      border: none;
      background: white;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      cursor: pointer;
    }

    .main-content {
      padding: 0 !important;
      overflow: hidden;
      border-radius: var(--radius-xl);
      border: none;
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
      padding: var(--space-lg);
      text-align: left;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: white;
    }

    .emp-cell {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
    }

    .emp-name {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      display: block;
      line-height: 1.2;
    }

    .emp-id {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-family: monospace;
    }

    .time-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .time-pill svg {
      color: #3b82f6;
    }

    .time-pill.empty {
      opacity: 0.4;
      font-weight: var(--font-weight-normal);
      font-style: italic;
    }

    .activity-tag {
      background: #eff6ff;
      color: #2563eb;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-sm);
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-sm);
    }

    .no-activity {
      color: var(--color-text-muted);
      font-weight: var(--font-weight-bold);
    }

    .status-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
    }

    .status-chip .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .status-présent {
      background: #ecfdf5;
      color: #059669;
    }

    .status-présent .dot {
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
    }

    .status-en-cours {
      background: #eff6ff;
      color: #2563eb;
    }

    .status-en-cours .dot {
      background: #3b82f6;
      animation: blink 1.5s infinite;
    }

    .status-absent {
      background: #fef2f2;
      color: #dc2626;
    }

    .status-absent .dot {
      background: #dc2626;
    }

    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0.3; }
      100% { opacity: 1; }
    }

    .action-row {
      display: flex;
      gap: var(--space-xs);
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
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .empty-state {
      padding: var(--space-3xl);
      text-align: center;
      color: var(--color-text-muted);
      background: white;
    }

    .empty-icon {
      width: 80px;
      height: 80px;
      background: var(--color-bg);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-lg);
      color: var(--color-text-muted);
    }

    .empty-state h3 {
      color: var(--color-text);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--space-xs);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(4px);
    }

    .modal-content {
      width: 480px;
      background: white;
      border-radius: var(--radius-xl);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .modal-header {
      padding: var(--space-xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: white;
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header h2 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .btn-close {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close:hover {
      background: var(--color-bg);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-xl);
      background: white;
    }

    .modal-footer {
      padding: var(--space-lg) var(--space-xl);
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      background: var(--color-bg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .form-group label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .readonly-field {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-lg);
      margin-top: var(--space-lg);
    }

    .time-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      outline: none;
      transition: all var(--transition-base);
    }

    .time-input:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .toolbar-widget,
    :host-context(.dark) .header-stats {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .data-table td {
      background: var(--color-surface);
    }

    :host-context(.dark) .data-table thead {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .search-group,
    :host-context(.dark) .date-input,
    :host-context(.dark) .time-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .time-pill {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .activity-tag {
      background: rgba(59, 130, 246, 0.1);
    }

    :host-context(.dark) .rapport-controls {
      background: rgba(255, 255, 255, 0.02);
      border-color: var(--color-border);
    }

    :host-context(.dark) .date-select {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-content,
    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-body {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.02);
    }

    :host-context(.dark) .readonly-field {
      background: rgba(255, 255, 255, 0.05);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-stats {
        width: 100%;
        flex-wrap: wrap;
      }

      .stat-tile {
        flex: 1;
        border-right: none;
        border-bottom: 1px solid var(--color-border);
      }

      .filters-row {
        flex-direction: column;
        align-items: stretch;
      }

      .search-group {
        max-width: 100%;
      }

      .filter-spacer {
        display: none;
      }
    }
  `]
})
export class RhPointageComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  societeId = '';
  societeNom = '';
  currentDateDisplay = '';
  filterDate = '';
  searchQuery = '';
  rapportMois = new Date().getMonth() + 1;
  rapportAnnee = new Date().getFullYear();
  
  pointages: PointageDisplay[] = [];
  filteredPointages: PointageDisplay[] = [];
  displayedColumns = ['employe', 'entre', 'sortie', 'total', 'statut', 'actions'];
  
  stats = { totalEmployes: 0, employesActifs: 0, employesAbsents: 0, tauxPresence: 0 };
  
  showEditDialog = false;
  editingPointage: PointageDisplay | null = null;
  editForm: any = {};

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.currentDateDisplay = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    this.filterDate = new Date().toISOString().split('T')[0];
    this.loadData();
  }

  loadData() {
    this.loadStats();
    
    this.api.getEmployesBySociete(this.societeId).subscribe(employes => {
       this.api.getPointages().subscribe(allPointages => {
          const targetDate = this.filterDate;
          const todayPointages = allPointages.filter((p: any) => p.date?.split('T')[0] === targetDate);
          
          this.pointages = employes.map((emp: any) => {
             const p = todayPointages.find((ptg: any) => ptg.utilisateurId === emp.id);
             let status: 'Présent' | 'En cours' | 'Absent' = 'Absent';
             
             if (p) {
                status = p.heureFin ? 'Présent' : 'En cours';
             }
             
             return {
                id: p?.id,
                utilisateurId: emp.id,
                nomComplet: emp.nom + ' ' + (emp.prenom || ''),
                date: targetDate,
                heureDebut: p?.heureDebut ? p.heureDebut.substring(0, 5) : '',
                heureFin: p?.heureFin ? p.heureFin.substring(0, 5) : '',
                heuresTravaillees: 0, // Will be fetched or calculated
                status: status
             };
          });

          // Fetch worked hours for each
          this.pointages.forEach(ptg => {
             if (ptg.heureDebut && ptg.heureFin) {
                this.api.getWorkedHoursReal(ptg.utilisateurId, ptg.date).subscribe(res => {
                   ptg.heuresTravaillees = res.heuresTravaillees;
                });
             }
          });

          this.filterData();
       });
    });
  }

  loadStats() {
    this.api.getRHStats(this.societeId, this.filterDate).subscribe(res => {
       this.stats = res;
    });
  }

  filterData() {
    this.filteredPointages = this.pointages.filter(p => 
       p.nomComplet.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  editPointage(p: PointageDisplay) {
     this.editingPointage = p;
     this.editForm = {
        entre: p.heureDebut,
        sortie: p.heureFin
     };
     this.showEditDialog = true;
  }

  closeEditDialog() {
     this.showEditDialog = false;
     this.editingPointage = null;
  }

  savePointageEdit() {
     if (!this.editingPointage) return;
     
     const data = {
        id: this.editingPointage.id,
        utilisateurId: this.editingPointage.utilisateurId,
        societeId: this.societeId,
        date: this.editingPointage.date,
        heureDebut: this.editForm.entre,
        heureFin: this.editForm.sortie,
        actif: true
     };

     const action = data.id ? this.api.updatePointage(data) : this.api.createPointage(data);
     
     action.subscribe({
        next: () => {
           this.snackBar.open('Pointage mis à jour avec succès', 'Fermer', { duration: 3000 });
           this.closeEditDialog();
           this.loadData();
        },
        error: () => {
           this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
        }
     });
  }

  /** Open the HTML report in a new tab so the user can Print → Save as PDF */
  exportRapportHTML() {
    const url = this.api.getRapportPresenceUrl(this.societeId, this.rapportMois, this.rapportAnnee, 'html');
    window.open(url, '_blank');
  }

  /** Download a CSV attendance report */
  exportRapportCSV() {
    this.api.getRapportPresence(this.societeId, this.rapportMois, this.rapportAnnee).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `presence_${this.societeNom}_${this.rapportAnnee}_${String(this.rapportMois).padStart(2,'0')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.snackBar.open('Export CSV téléchargé ✓', 'Fermer', { duration: 3000 });
    });
  }
}

