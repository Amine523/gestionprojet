import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="parametres-container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="header-title">Paramètres - {{societeNom}}</h1>
      </div>

      <!-- Profile Card -->
      <div class="settings-card">
        <h3 class="card-title">Profil</h3>
        <div class="form-group">
          <label class="form-label">Nom</label>
          <input class="form-input" [(ngModel)]="profil.nom" placeholder="Votre nom">
        </div>
        <div class="form-group">
          <label class="form-label">Email</label>
          <input class="form-input" [(ngModel)]="profil.email" type="email" placeholder="votre@email.com">
        </div>
        <button class="btn btn-primary" (click)="save()">Enregistrer</button>
      </div>

      <!-- Notifications Card -->
      <div class="settings-card">
        <h3 class="card-title">Notifications</h3>
        <div class="toggle-item">
          <span class="toggle-label">Nouveau test assigné</span>
          <label class="toggle-switch">
            <input type="checkbox" [(ngModel)]="notifications.tests">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="toggle-item">
          <span class="toggle-label">Bug détecté</span>
          <label class="toggle-switch">
            <input type="checkbox" [(ngModel)]="notifications.bugs">
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="toggle-item">
          <span class="toggle-label">Mise à jour projet</span>
          <label class="toggle-switch">
            <input type="checkbox" [(ngModel)]="notifications.projects">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>

      <!-- Security Card -->
      <div class="settings-card">
        <h3 class="card-title">Sécurité</h3>
        <button class="btn btn-outline" (click)="showPasswordDialog = true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Changer le mot de passe
        </button>
      </div>

      <!-- Password Dialog -->
      @if (showPasswordDialog) {
        <div class="dialog-overlay" (click)="showPasswordDialog = false">
          <div class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2 class="dialog-title">Changer le mot de passe</h2>
              <button class="btn-icon" (click)="showPasswordDialog = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="dialog-body">
              <div class="form-group">
                <label class="form-label">Ancien mot de passe</label>
                <input class="form-input" [(ngModel)]="passwordData.oldPassword" type="password" placeholder="••••••">
              </div>
              <div class="form-group">
                <label class="form-label">Nouveau mot de passe</label>
                <input class="form-input" [(ngModel)]="passwordData.newPassword" type="password" placeholder="••••••">
              </div>
              <div class="form-group">
                <label class="form-label">Confirmer mot de passe</label>
                <input class="form-input" [(ngModel)]="passwordData.confirmPassword" type="password" placeholder="••••••">
              </div>
              @if (passwordError) {
                <p class="error-text">{{passwordError}}</p>
              }
            </div>
            <div class="dialog-footer">
              <button class="btn btn-outline" (click)="showPasswordDialog = false">Annuler</button>
              <button class="btn btn-primary" (click)="changePassword()">Mettre à jour</button>
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
      margin-bottom: var(--space-xl);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .settings-card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      margin-bottom: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }

    .card-title {
      margin: 0 0 var(--space-lg);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
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

    .btn-icon {
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

    .btn-icon:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .toggle-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .toggle-item:last-child {
      border-bottom: none;
    }

    .toggle-label {
      font-size: var(--font-size-sm);
      color: var(--color-text);
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

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog-card {
      width: 400px;
      max-width: 90vw;
      background: white;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-xl);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      background: #3b82f6;
      color: white;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    }

    .dialog-title {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
    }

    .dialog-body {
      padding: var(--space-lg);
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      padding: var(--space-md) var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .error-text {
      color: #ef4444;
      font-size: var(--font-size-sm);
      margin-top: var(--space-sm);
    }

    /* Dark mode */
    :host-context(.dark) .settings-card,
    :host-context(.dark) .dialog-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .card-title,
    :host-context(.dark) .form-label,
    :host-context(.dark) .toggle-label {
      color: var(--color-text);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .form-input:focus {
      border-color: #3b82f6;
    }

    :host-context(.dark) .btn-outline {
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .btn-outline:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .toggle-item {
      border-color: var(--color-border);
    }

    :host-context(.dark) .toggle-slider {
      background-color: rgba(255, 255, 255, 0.2);
    }

    :host-context(.dark) .toggle-slider:before {
      background-color: white;
    }

    :host-context(.dark) .dialog-footer {
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .parametres-container {
        padding: var(--space-md);
      }

      .settings-card {
        padding: var(--space-md);
      }

      .dialog-card {
        width: 90vw;
      }
    }
  `]
})
export class QaParametresComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);

  societeId = '';
  societeNom = '';
  userId = '';
  profil = { nom: '', email: '' };
  notifications = { tests: true, bugs: true, projects: true };

  showPasswordDialog = false;
  passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
  passwordError = '';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.profil.nom = user.nom || '';
      this.profil.email = user.email || '';
      this.societeId = user.societeId || '';
      this.userId = user.id || user.utilisateurId || '';
      this.societeNom = user.societe?.nom || 'Votre société';
      this.loadNotificationSettings();
    }
  }

  loadNotificationSettings() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const userPrefs = data.notificationSettings?.[this.societeId] || {};
    this.notifications = { ...this.notifications, ...userPrefs };
  }

  save() {
    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    if (!data.notificationSettings) data.notificationSettings = {};
    data.notificationSettings[this.societeId] = this.notifications;
    localStorage.setItem('app_data', JSON.stringify(data));
    this.snackBar.open('Paramètres enregistrés', 'Fermer', { duration: 2000 });
  }

  changePassword() {
    this.passwordError = '';

    if (!this.passwordData.oldPassword || !this.passwordData.newPassword || !this.passwordData.confirmPassword) {
      this.passwordError = 'Veuillez remplir tous les champs';
      return;
    }

    if (this.passwordData.newPassword !== this.passwordData.confirmPassword) {
      this.passwordError = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.passwordData.newPassword.length < 6) {
      this.passwordError = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    const data = JSON.parse(localStorage.getItem('app_data') || '{}');
    const utilisateurs = data.utilisateurs || [];
    const userIndex = utilisateurs.findIndex((u: any) => u.id === this.userId);

    if (userIndex >= 0) {
      if (utilisateurs[userIndex].motDePasse !== this.passwordData.oldPassword) {
        this.passwordError = 'Ancien mot de passe incorrect';
        return;
      }

      utilisateurs[userIndex].motDePasse = this.passwordData.newPassword;
      data.utilisateurs = utilisateurs;
      localStorage.setItem('app_data', JSON.stringify(data));
      
      this.snackBar.open('Mot de passe mis à jour', 'Fermer', { duration: 2000 });
      this.showPasswordDialog = false;
      this.passwordData = { oldPassword: '', newPassword: '', confirmPassword: '' };
    } else {
      this.passwordError = 'Utilisateur non trouvé';
    }
  }
}

