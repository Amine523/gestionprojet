import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-dev-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="parametres-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Paramètres</h1>
          <p class="header-subtitle">Gérez votre profil et préférences - {{societeNom}}</p>
        </div>
      </div>

      <!-- Profile Card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Profil</h5>
          <div class="profile-header">
            <div class="avatar">{{profil.initials}}</div>
            <div class="profile-info">
              <span class="profile-name">{{profil.nom}}</span>
              <span class="profile-role">{{profil.role}}</span>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nom</label>
            <input type="text" [(ngModel)]="profil.nom" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input type="email" [(ngModel)]="profil.email" class="form-input">
          </div>
          <div class="form-group">
            <label class="form-label">Société</label>
            <input type="text" [value]="societeNom" class="form-input" disabled>
          </div>
          <button class="btn btn-success" (click)="save()">Enregistrer</button>
        </div>
      </div>

      <!-- Notifications Card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Notifications</h5>
          <div class="setting-item">
            <span class="setting-label">Nouvelles tâches assignées</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="notifications.taches" (change)="saveNotifications()">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Bugs assignés</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="notifications.bugs" (change)="saveNotifications()">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Commentaires</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="notifications.commentaires" (change)="saveNotifications()">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Mentions</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="notifications.mentions" (change)="saveNotifications()">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      <!-- Preferences Card -->
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">Préférences</h5>
          <div class="setting-item">
            <span class="setting-label">Mode sombre</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="preferences.darkMode" (change)="savePreferences()">
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="setting-item">
            <span class="setting-label">Compact Kanban</span>
            <label class="toggle-switch">
              <input type="checkbox" [(ngModel)]="preferences.compactKanban" (change)="savePreferences()">
              <span class="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .parametres-container {
      padding: var(--space-lg);
    }

    .page-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-xl);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .header-subtitle {
      color: var(--color-text-muted);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      margin-bottom: var(--space-lg);
      box-shadow: var(--shadow-sm);
    }

    .card-body {
      padding: var(--space-lg);
    }

    .card-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-md);
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
    }

    .avatar {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-full);
      background: #10b981;
      color: white;
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
    }

    .profile-name {
      font-size: 18px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .profile-role {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
      margin-bottom: var(--space-md);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-input {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: white;
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
    }

    .form-input:focus {
      border-color: #3b82f6;
    }

    .form-input:disabled {
      background: var(--color-bg);
      color: var(--color-text-muted);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
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

    .setting-label {
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 48px;
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
      border-radius: var(--radius-full);
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 20px;
      width: 20px;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: var(--transition-base);
      border-radius: var(--radius-full);
    }

    .toggle-switch input:checked + .toggle-slider {
      background-color: #10b981;
    }

    .toggle-switch input:checked + .toggle-slider:before {
      transform: translateX(24px);
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .profile-header {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .header-title,
    :host-context(.dark) .card-title,
    :host-context(.dark) .profile-name,
    :host-context(.dark) .form-label,
    :host-context(.dark) .setting-label {
      color: var(--color-text);
    }

    :host-context(.dark) .header-subtitle,
    :host-context(.dark) .profile-role {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .form-input:disabled {
      background: rgba(255, 255, 255, 0.02);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class DevParametresComponent implements OnInit {
  private api = inject(ApiService);

  societeNom = '';
  profil = { nom: '', email: '', role: '', initials: '' };
  notifications = { taches: true, bugs: true, commentaires: true, mentions: true };
  preferences = { darkMode: false, compactKanban: false };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.profil = {
      nom: user?.nom || 'Développeur',
      email: user?.email || 'dev@leadertec.com',
      role: user?.typeUtilisateurId || 'developpeur',
      initials: user?.nom?.charAt(0) || 'D'
    };
    this.loadFromStorage();
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.preferences.darkMode) {
      document.body.classList.add('dark-mode');
      let style = document.getElementById('dark-mode-styles');
      if (!style) {
        style = document.createElement('style');
        style.id = 'dark-mode-styles';
        style.textContent = `
          body.dark-mode { background: #121212; color: #e0e0e0; }
          body.dark-mode .card { background: #1e1e1e; color: #e0e0e0; border-color: #333; }
          body.dark-mode .form-control { background: #2a2a2a; color: #e0e0e0; border-color: #444; }
          body.dark-mode .form-control:disabled { background: #1a1a1a; color: #666; }
          body.dark-mode .form-label { color: #aaa; }
        `;
        document.head.appendChild(style);
      }
    } else {
      document.body.classList.remove('dark-mode');
      const style = document.getElementById('dark-mode-styles');
      if (style) style.remove();
    }
  }

  loadFromStorage() {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    if (notifData.dev) this.notifications = notifData.dev;
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    if (prefs.dev) this.preferences = prefs.dev;
  }

  save() {
    alert('Paramètres enregistrés');
  }

  saveNotifications() {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    notifData.dev = this.notifications;
    localStorage.setItem('user_notifications', JSON.stringify(notifData));
    alert('Notifications mises à jour');
  }

  savePreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    prefs.dev = this.preferences;
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    this.applyDarkMode();
    alert('Préférences mises à jour');
  }
}

