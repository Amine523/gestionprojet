import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-employes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
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

      <!-- Personnel Grid -->
      <div class="personnel-grid">
        @for (e of filteredEmployes; track e.id) {
          <div class="card employee-card" [class.active]="e.actif">
            <div class="employee-header">
              <div class="employee-avatar">{{e.nom.charAt(0)}}</div>
              <div class="employee-info">
                <h3 class="employee-name">{{e.nom}}</h3>
                <span class="badge badge-role">{{getPosteLabel(e.typeUtilisateurId || e.poste)}}</span>
              </div>
            </div>
            <div class="employee-details">
              <div class="detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <span>{{e.email}}</span>
              </div>
              <div class="detail-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{e.telephone || '—'}}</span>
              </div>
              <div class="detail-item">
                <div class="status-dot" [class.active]="e.actif"></div>
                <span [class.active]="e.actif">{{e.actif ? 'Déploiement Actif' : 'État Hors Ligne'}}</span>
              </div>
            </div>
            <div class="employee-actions">
              <button (click)="editEmploye(e)" class="btn btn-action">
                Matrice Profil
              </button>
              <button (click)="toggleStatut(e)" class="btn-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </button>
              <button (click)="deleteEmploye(e)" class="btn-icon btn-danger">
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

              <form>
                 <div class="form-grid">
                    <div class="form-field">
                       <label>Identité</label>
                       <input [(ngModel)]="formData.nom" class="form-input" placeholder="Entrez le nom complet...">
                    </div>
                    <div class="form-field">
                       <label>Email de Transmission</label>
                       <input [(ngModel)]="formData.email" class="form-input" placeholder="nom@domaine.com">
                    </div>
                    <div class="form-field">
                       <label>Clé de Sécurité</label>
                       <input type="password" [(ngModel)]="formData.password" class="form-input" placeholder="••••••••">
                    </div>
                    <div class="form-field">
                       <label>Unité Fonctionnelle</label>
                       <select [(ngModel)]="formData.typeUtilisateurId" class="form-input">
                          <option value="developpeur">Développeur</option>
                          <option value="testeur">Testeur</option>
                          <option value="chef_projet">Chef de projet</option>
                          <option value="rh">RH</option>
                          <option value="admin_societe">Admin Société</option>
                       </select>
                    </div>
                 </div>

                 <div class="toggle-section">
                    <div class="toggle-info">
                       <p>Droits d'Accès Système</p>
                       <span>Autoriser la synchronisation du nœud</span>
                    </div>
                    <button (click)="formData.actif = !formData.actif" class="toggle-btn" [class.active]="formData.actif">
                      <span class="toggle-knob"></span>
                    </button>
                 </div>
              </form>

              <div class="modal-actions">
                 <button (click)="closeDialog()" class="btn btn-ghost">Séquence d'Avortement</button>
                 <button (click)="saveEmploye()" class="btn btn-primary">
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

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }

    .employee-card {
      padding: var(--space-lg);
    }

    .employee-card.active {
      background: rgba(16, 185, 129, 0.02);
      border-color: rgba(16, 185, 129, 0.2);
    }

    .employee-header {
      display: flex;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .employee-avatar {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .employee-info {
      flex: 1;
    }

    .employee-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .employee-details {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
      margin-bottom: var(--space-lg);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
    }

    .detail-item svg {
      width: 14px;
      height: 14px;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #d1d5db;
    }

    .status-dot.active {
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
    }

    .detail-item span.active {
      color: #10b981;
      font-weight: var(--font-weight-semibold);
    }

    .employee-actions {
      display: flex;
      gap: var(--space-sm);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

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
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  employes: any[] = [];
  filteredEmployes: any[] = [];
  searchQuery = '';
  filterPoste = '';
  filterStatut = '';
  showAddDialog = false;
  editingEmploye: any = null;
  formData: any = { nom: '', email: '', telephone: '', typeUtilisateurId: 'developpeur', password: '', actif: true };
  societeId = '';
  societeNom = '';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadEmployes();
  }

  loadEmployes() {
    this.api.getUtilisateurs().subscribe(data => {
      this.employes = (data || []).filter(u => u.societeId === this.societeId);
      this.filterEmployes();
    });
  }

  filterEmployes() {
    this.filteredEmployes = this.employes.filter(e => {
      const matchesSearch = !this.searchQuery || e.nom?.toLowerCase().includes(this.searchQuery.toLowerCase()) || e.email?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesPoste = !this.filterPoste || (e.typeUtilisateurId || e.poste || '').toLowerCase() === this.filterPoste.toLowerCase();
      const matchesStatut = !this.filterStatut || (this.filterStatut === 'actif' ? e.actif : !e.actif);
      return matchesSearch && matchesPoste && matchesStatut;
    });
  }

  getPosteLabel(p: string): string {
    const labels: any = { developpeur: 'Ingénieur', testeur: 'QA', chef_projet: 'Chef de Projet', rh: 'RH', admin_societe: 'Administrateur' };
    return labels[p?.toLowerCase()] || p;
  }

  openAddDialog() { this.formData = { nom: '', email: '', telephone: '', typeUtilisateurId: 'developpeur', password: '', actif: true }; this.showAddDialog = true; }
  editEmploye(e: any) { this.editingEmploye = e; this.formData = { ...e }; this.showAddDialog = false; }
  closeDialog() { this.showAddDialog = false; this.editingEmploye = null; }

  saveEmploye() {
    if (!this.formData.nom || !this.formData.email) return;
    const payload = { ...this.formData, societeId: this.societeId };
    if (this.editingEmploye) {
      this.api.updateUtilisateur(this.editingEmploye.id, payload).subscribe(() => { this.loadEmployes(); this.closeDialog(); });
    } else {
      this.api.createUtilisateur(payload).subscribe(() => { this.loadEmployes(); this.closeDialog(); });
    }
  }

  toggleStatut(e: any) {
    e.actif = !e.actif;
    this.api.updateUtilisateur(e.id, e).subscribe(() => this.snackBar.open(e.actif ? 'Unité Activée' : 'Unité Hors Ligne', 'OK', { duration: 2000 }));
  }

  deleteEmploye(e: any) {
    if (confirm('Supprimer cette unité ?')) this.api.deleteUtilisateur(e.id).subscribe(() => this.loadEmployes());
  }
}
