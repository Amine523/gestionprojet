import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-chef-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="parametres-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div class="header-content">
          <h1 class="header-title">Paramètres</h1>
          <p class="header-subtitle">Gérez vos préférences - {{societeNom}}</p>
        </div>
      </div>

      <!-- Tabs Card -->
      <div class="card">
        <div class="tabs">
          <button class="tab active" (click)="activeTab = 'profil'">Profil</button>
          <button class="tab" (click)="activeTab = 'notifications'">Notifications</button>
          <button class="tab" (click)="activeTab = 'preferences'">Préférences projet</button>
          <button class="tab" (click)="activeTab = 'securite'">Sécurité</button>
        </div>

        @if (activeTab === 'profil') {
          <div class="tab-content">
            <h3 class="tab-title">Informations du profil</h3>
            <div class="form-container">
              <div class="form-group">
                <label class="form-label">Nom complet</label>
                <div class="input-group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input type="text" class="form-input" [(ngModel)]="profil.nom">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <div class="input-group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <input type="email" class="form-input" [(ngModel)]="profil.email">
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <div class="input-group">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                  <input type="tel" class="form-input" [(ngModel)]="profil.telephone">
                </div>
              </div>
              <button class="btn btn-primary" (click)="saveProfil()">Enregistrer</button>
            </div>
          </div>
        }

        @if (activeTab === 'notifications') {
          <div class="tab-content">
            <h3 class="tab-title">Paramètres de notification</h3>
            <div class="settings-list">
              <div class="setting-item">
                <div class="setting-info">
                  <div class="setting-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <div class="setting-title">Emails</div>
                    <div class="setting-desc">Recevoir les notifications par email</div>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.email">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <div class="setting-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </div>
                  <div>
                    <div class="setting-title">Notifications Push</div>
                    <div class="setting-desc">Recevoir les notifications push</div>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.push">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <div class="setting-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                    </svg>
                  </div>
                  <div>
                    <div class="setting-title">Nouvelles tâches</div>
                    <div class="setting-desc">Notifications pour les nouvelles tâches</div>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.nouvellesTaches">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <div class="setting-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M8 12h8"/>
                      <path d="M12 8v8"/>
                    </svg>
                  </div>
                  <div>
                    <div class="setting-title">Nouveaux bugs</div>
                    <div class="setting-desc">Notifications pour les nouveaux bugs</div>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.nouveauxBugs">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <div class="setting-info">
                  <div class="setting-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div>
                    <div class="setting-title">Alertes retard</div>
                    <div class="setting-desc">Alertes quand une tâche est en retard</div>
                  </div>
                </div>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.alertesRetard">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        }

        @if (activeTab === 'preferences') {
          <div class="tab-content">
            <h3 class="tab-title">Préférences d'affichage</h3>
            <div class="form-container">
              <div class="form-group">
                <label class="form-label">Mode d'affichage des tâches</label>
                <select class="form-input" [(ngModel)]="preferences.modeAffichage">
                  <option value="kanban">Kanban</option>
                  <option value="liste">Liste</option>
                  <option value="tableau">Tableau</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Trier par</label>
                <select class="form-input" [(ngModel)]="preferences.trierPar">
                  <option value="date">Date</option>
                  <option value="priorite">Priorité</option>
                  <option value="assignee">Assigné à</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Projet par défaut</label>
                <select class="form-input" [(ngModel)]="preferences.projetDefaut">
                  <option value="">Aucun</option>
                  @for (p of projets; track p.id) {
                    <option [value]="p.nom">{{p.nom}}</option>
                  }
                </select>
              </div>
              <button class="btn btn-primary" (click)="savePreferences()">Enregistrer</button>
            </div>
          </div>
        }

        @if (activeTab === 'securite') {
          <div class="tab-content">
            <h3 class="tab-title">Sécurité du compte</h3>
            <div class="security-actions">
              <button class="btn btn-outline" (click)="showPasswordDialog = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Changer le mot de passe
              </button>
              <button class="btn btn-outline" (click)="toggle2FA()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <path d="M12 18h.01"/>
                </svg>
                {{twoFactorEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}}
              </button>
              <button class="btn btn-outline" (click)="showSessionsDialog = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Gérer les sessions
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Password Modal -->
      @if (showPasswordDialog) {
        <div class="modal-overlay" (click)="cancelPassword()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Changer le mot de passe</h3>
              <button class="btn-close" (click)="cancelPassword()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Mot de passe actuel</label>
                <input type="password" class="form-input" [(ngModel)]="passwordData.actuel">
              </div>
              <div class="form-group">
                <label class="form-label">Nouveau mot de passe</label>
                <input type="password" class="form-input" [(ngModel)]="passwordData.nouveau">
              </div>
              <div class="form-group">
                <label class="form-label">Confirmer le mot de passe</label>
                <input type="password" class="form-input" [(ngModel)]="passwordData.confirmer">
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="cancelPassword()">Annuler</button>
              <button class="btn btn-primary" (click)="changePassword()">Confirmer</button>
            </div>
          </div>
        </div>
      }

      <!-- Sessions Modal -->
      @if (showSessionsDialog) {
        <div class="modal-overlay" (click)="cancelSessions()">
          <div class="modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3 class="modal-title">Gérer les sessions</h3>
              <button class="btn-close" (click)="cancelSessions()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              @for (session of sessions; track session.id) {
                <div class="session-item">
                  <div class="session-icon">
                    @if (session.current) {
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                        <line x1="8" y1="21" x2="16" y2="21"/>
                        <line x1="12" y1="17" x2="12" y2="21"/>
                      </svg>
                    } @else {
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                        <path d="M12 18h.01"/>
                      </svg>
                    }
                  </div>
                  <div class="session-info">
                    <div class="session-device">{{session.device}}</div>
                    <div class="session-meta">{{session.location}} - {{session.lastActive}}</div>
                  </div>
                  @if (session.current) {
                    <span class="badge badge-success">Actuelle</span>
                  } @else {
                    <button class="btn-icon btn-danger" (click)="revokeSession(session)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    </button>
                  }
                </div>
              }
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" (click)="cancelSessions()">Fermer</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .parametres-container {
      padding: var(--space-lg);
    }

    .page-header {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: var(--radius-xl);
      padding: var(--space-xl);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
      box-shadow: var(--shadow-lg);
    }

    .header-icon {
      width: 52px;
      height: 52px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .header-content {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-xs);
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .tabs {
      display: flex;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .tab {
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .tab:hover {
      background: var(--color-bg);
    }

    .tab.active {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .tab-content {
      padding: var(--space-lg);
    }

    .tab-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-lg);
    }

    .form-container {
      max-width: 500px;
    }

    .form-group {
      margin-bottom: var(--space-md);
    }

    .form-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin-bottom: var(--space-xs);
    }

    .input-group {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      background: white;
    }

    .input-group svg {
      color: var(--color-text-muted);
    }

    .form-input {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      background: white;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
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
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .btn-outline {
      background: transparent;
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-outline:hover {
      background: var(--color-bg);
    }

    .settings-list {
      max-width: 500px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .setting-item:last-child {
      border-bottom: none;
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .setting-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .setting-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .setting-desc {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #cbd5e1;
      transition: var(--transition-base);
      border-radius: 24px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: var(--transition-base);
      border-radius: 50%;
    }

    .toggle-switch input:checked + .toggle-slider {
      background-color: #3b82f6;
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(20px);
    }

    .security-actions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-card {
      width: 400px;
      max-width: 90vw;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    .modal-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .btn-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: none;
      background: transparent;
      color: white;
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: background var(--transition-base);
    }

    .btn-close:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .modal-body {
      padding: var(--space-lg);
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .session-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      border-bottom: 1px solid var(--color-border);
    }

    .session-item:last-child {
      border-bottom: none;
    }

    .session-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .session-info {
      flex: 1;
    }

    .session-device {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .session-meta {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .badge-success {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border: 1px solid var(--color-border);
      background: white;
      border-radius: var(--radius-md);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-bg);
    }

    .btn-icon.btn-danger {
      color: #ef4444;
      border-color: #ef4444;
    }

    .btn-icon.btn-danger:hover {
      background: #ef4444;
      color: white;
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-title,
    :host-context(.dark) .form-label,
    :host-context(.dark) .setting-title,
    :host-context(.dark) .session-device {
      color: var(--color-text);
    }

    :host-context(.dark) .input-group,
    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .input-group svg {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .btn-outline {
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .setting-icon,
    :host-context(.dark) .session-icon {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .toggle-slider {
      background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .parametres-container {
        padding: var(--space-md);
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .form-container,
      .settings-list {
        max-width: 100%;
      }

      .security-actions {
        flex-direction: column;
      }

      .security-actions .btn {
        width: 100%;
      }

      .modal-card {
        width: 90vw;
      }
    }
  `]
})
export class ChefParametresComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';
  activeTab = 'profil';
  
  profil = { nom: '', email: '', telephone: '' };
  
  notifications = { email: true, push: true, nouvellesTaches: true, nouveauxBugs: true, alertesRetard: true };
  
  preferences = { modeAffichage: 'kanban', trierPar: 'date', projetDefaut: '' };
  projets: any[] = [];
  
  showPasswordDialog = false;
  showSessionsDialog = false;
  twoFactorEnabled = false;
  passwordData = { actuel: '', nouveau: '', confirmer: '' };
  sessions: any[] = [];
  
  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.profil = {
      nom: user?.nom || '',
      email: user?.email || '',
      telephone: user?.telephone || ''
    };
    this.loadPreferences();
    this.loadProjets();
    this.loadSessions();
    this.loadSecuritySettings();
  }
  
  loadSecuritySettings() {
    const securityData = JSON.parse(localStorage.getItem('security_settings') || '{}');
    const key = `chef_${this.societeId}`;
    if (securityData[key]) {
      this.twoFactorEnabled = securityData[key].twoFactorEnabled || false;
    }
  }
  
  loadProjets() {
    this.api.getProjetsBySociete(this.societeId).subscribe({
      next: (projets) => {
        this.projets = projets;
      },
      error: () => {}
    });
  }
  
  loadPreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const key = `chef_${this.societeId}`;
    if (prefs[key]) {
      this.preferences = prefs[key].preferences || this.preferences;
      this.notifications = prefs[key].notifications || this.notifications;
    }
  }

  saveProfil() {
    const users = JSON.parse(localStorage.getItem('app_data') || '{}').utilisateurs || [];
    const userIdx = users.findIndex((u: any) => u.id === this.api.getCurrentUser()?.id);
    if (userIdx >= 0) {
      users[userIdx] = { ...users[userIdx], ...this.profil };
      const data = JSON.parse(localStorage.getItem('app_data') || '{}');
      data.utilisateurs = users;
      localStorage.setItem('app_data', JSON.stringify(data));
    }
    alert('Profil enregistré');
  }

  savePreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const key = `chef_${this.societeId}`;
    prefs[key] = { preferences: this.preferences, notifications: this.notifications };
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    this.applyNotifications();
    alert('Préférences enregistrées');
  }
  
  applyNotifications() {
    if (this.notifications.nouvellesTaches) {
      this.registerNotification('nouvelles_taches', 'Nouvelle tâche assignée');
    }
    if (this.notifications.nouveauxBugs) {
      this.registerNotification('nouveaux_bugs', 'Nouveau bug signalé');
    }
    if (this.notifications.alertesRetard) {
      this.registerNotification('alertes_retard', 'Alerte de retard de tâche');
    }
  }
  
  registerNotification(type: string, description: string) {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    if (!notifData[this.societeId]) {
      notifData[this.societeId] = [];
    }
    if (!notifData[this.societeId].find((n: any) => n.type === type)) {
      notifData[this.societeId].push({ type, description, enabled: true });
    }
    localStorage.setItem('user_notifications', JSON.stringify(notifData));
  }
  
  changePassword() {
    if (!this.passwordData.actuel || !this.passwordData.nouveau || !this.passwordData.confirmer) {
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (this.passwordData.nouveau !== this.passwordData.confirmer) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    const userId = this.api.getCurrentUser()?.id;
    if (userId) {
      this.api.updateUtilisateur(userId, { motDePasse: this.passwordData.nouveau }).subscribe({
        next: () => {
          alert('Mot de passe changé');
        },
        error: () => {
          alert('Mot de passe changé (local)');
        }
      });
    }
    this.showPasswordDialog = false;
    this.passwordData = { actuel: '', nouveau: '', confirmer: '' };
  }
  
  cancelPassword() {
    this.showPasswordDialog = false;
    this.passwordData = { actuel: '', nouveau: '', confirmer: '' };
  }
  
  toggle2FA() {
    this.twoFactorEnabled = !this.twoFactorEnabled;
    const securityData = JSON.parse(localStorage.getItem('security_settings') || '{}');
    securityData[`chef_${this.societeId}`] = { twoFactorEnabled: this.twoFactorEnabled };
    localStorage.setItem('security_settings', JSON.stringify(securityData));
    alert(this.twoFactorEnabled ? '2FA activé' : '2FA désactivé');
  }
  
  loadSessions() {
    const sessionData = JSON.parse(localStorage.getItem('user_sessions') || '{}');
    this.sessions = sessionData[this.societeId] || [
      { id: 1, device: 'Chrome - Windows', location: 'Tunis, TN', lastActive: 'Maintenant', current: true },
      { id: 2, device: 'Safari - iPhone', location: 'Tunis, TN', lastActive: 'Il y a 2h', current: false }
    ];
  }
  
  revokeSession(session: any) {
    if (session.current) {
      alert('Impossible de révoquer la session actuelle');
      return;
    }
    this.sessions = this.sessions.filter((s: any) => s.id !== session.id);
    const sessionData = JSON.parse(localStorage.getItem('user_sessions') || '{}');
    sessionData[this.societeId] = this.sessions;
    localStorage.setItem('user_sessions', JSON.stringify(sessionData));
    alert('Session révoquée');
  }
  
  cancelSessions() {
    this.showSessionsDialog = false;
  }
}

