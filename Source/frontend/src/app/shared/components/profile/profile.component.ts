import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-container">
      <header class="profile-header">
        <div class="header-overlay"></div>
        <div class="header-content">
          <div class="avatar-wrapper">
            <div class="profile-avatar">
              {{userInitials}}
            </div>
            <button class="edit-avatar-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </button>
          </div>
          <div class="user-meta">
            <h1 class="user-name">{{userName}}</h1>
            <p class="user-role">{{userRoleLabel}}</p>
          </div>
        </div>
      </header>

      <div class="profile-content">
        <div class="content-grid">
          <!-- Left Column: Personal Info -->
          <div class="card info-card">
            <div class="card-header">
              <h3>Informations Personnelles</h3>
              <button class="btn-text" (click)="toggleEdit()">{{isEditing ? 'Annuler' : 'Modifier'}}</button>
            </div>
            
            <div class="form-grid">
              <div class="form-field">
                <label>Nom</label>
                <input type="text" [(ngModel)]="profileData.nom" [disabled]="!isEditing" class="form-input">
              </div>
              <div class="form-field">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="profileData.prenom" [disabled]="!isEditing" class="form-input">
              </div>
              <div class="form-field">
                <label>Email</label>
                <input type="email" [(ngModel)]="profileData.email" [disabled]="true" class="form-input">
              </div>
              <div class="form-field">
                <label>Téléphone</label>
                <input type="text" [(ngModel)]="profileData.telephone" [disabled]="!isEditing" class="form-input">
              </div>
            </div>

            <div class="card-footer" *ngIf="isEditing">
              <button class="btn btn-primary" (click)="saveProfile()">Enregistrer les modifications</button>
            </div>
          </div>

          <!-- Right Column: Security & Settings -->
          <div class="space-y-6">
            <div class="card">
              <div class="card-header">
                <h3>Sécurité</h3>
              </div>
              <div class="security-item">
                <div class="item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div class="item-content">
                  <p class="item-title">Mot de passe</p>
                  <p class="item-desc">Dernière modification il y a 3 mois</p>
                </div>
                <button class="btn btn-outline btn-sm">Changer</button>
              </div>
              <div class="security-item">
                <div class="item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3L15.5 7.5z"/></svg>
                </div>
                <div class="item-content">
                  <p class="item-title">Double authentification</p>
                  <p class="item-desc">Non activée</p>
                </div>
                <button class="btn btn-outline btn-sm">Activer</button>
              </div>
            </div>

            <div class="card">
              <div class="card-header">
                <h3>Statistiques d'activité</h3>
              </div>
              <div class="stats-list">
                <div class="stat-item">
                  <span class="stat-label">Dernière connexion</span>
                  <span class="stat-value">Aujourd'hui, 09:42</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Tâches complétées</span>
                  <span class="stat-value">124</span>
                </div>
                <div class="stat-item">
                  <span class="stat-label">Temps total traqué</span>
                  <span class="stat-value">450h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      flex-direction: column;
      gap: 0;
      margin: -20px; /* Offset parent padding */
    }

    .profile-header {
      height: 240px;
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      position: relative;
      display: flex;
      align-items: flex-end;
      padding: var(--space-2xl);
    }

    .header-overlay {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent);
    }

    .header-content {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--space-xl);
      z-index: 1;
      transform: translateY(40px);
    }

    .avatar-wrapper {
      position: relative;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 40px;
      background: white;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      font-weight: 800;
      color: #4f46e5;
      box-shadow: var(--shadow-xl);
    }

    .edit-avatar-btn {
      position: absolute;
      bottom: -10px;
      right: -10px;
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: #4f46e5;
      color: white;
      border: 4px solid white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: var(--shadow-md);
      transition: transform 0.2s;
    }

    .edit-avatar-btn:hover {
      transform: scale(1.1);
    }

    .user-meta {
      color: white;
      padding-top: 40px;
    }

    .user-name {
      font-size: 32px;
      font-weight: 800;
      letter-spacing: -1px;
      margin: 0;
    }

    .user-role {
      font-size: 14px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .profile-content {
      padding: 80px var(--space-2xl) var(--space-2xl);
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: var(--space-xl);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-xl);
      box-shadow: var(--shadow-sm);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-xl);
    }

    .card-header h3 {
      font-size: 18px;
      font-weight: 700;
      margin: 0;
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
      font-size: 12px;
      font-weight: 600;
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .form-input {
      padding: var(--space-md);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-lg);
      font-size: 14px;
      transition: all 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .form-input:disabled {
      background: #f8fafc;
      border-color: #f1f5f9;
      color: #64748b;
    }

    .card-footer {
      margin-top: var(--space-xl);
      padding-top: var(--space-xl);
      border-top: 1px solid var(--color-border);
      display: flex;
      justify-content: flex-end;
    }

    .btn {
      padding: var(--space-md) var(--space-xl);
      border-radius: var(--radius-lg);
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #4f46e5;
      color: white;
      border: none;
    }

    .btn-outline {
      background: transparent;
      border: 2px solid var(--color-border);
      color: var(--color-text);
    }

    .btn-outline:hover {
      background: #f8fafc;
    }

    .btn-sm {
      padding: var(--space-sm) var(--space-md);
      font-size: 12px;
    }

    .btn-text {
      background: transparent;
      border: none;
      color: #4f46e5;
      font-weight: 700;
      cursor: pointer;
    }

    .security-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .security-item:last-child {
      border-bottom: none;
    }

    .item-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }

    .item-content {
      flex: 1;
    }

    .item-title {
      font-weight: 600;
      margin: 0;
    }

    .item-desc {
      font-size: 12px;
      color: var(--color-text-muted);
      margin: 0;
    }

    .stats-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .stat-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-label {
      color: var(--color-text-muted);
      font-size: 14px;
    }

    .stat-value {
      font-weight: 700;
      color: var(--color-text);
    }

    .space-y-6 > * + * { margin-top: var(--space-lg); }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  userName = '';
  userRoleLabel = '';
  userInitials = '';
  isEditing = false;

  profileData: any = {
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = `${user.prenom || ''} ${user.nom || ''}`.trim();
      this.userInitials = (user.prenom?.charAt(0) || '') + (user.nom?.charAt(0) || '');
      this.userRoleLabel = this.getRoleLabel(this.api.getUserRole());
      
      this.profileData = {
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || 'Non renseigné'
      };
    }
  }

  getRoleLabel(role: string): string {
    const labels: Record<string, string> = {
      'superadmin': 'Super Admin',
      'admin_societe': 'Administrateur Société',
      'rh': 'Ressources Humaines',
      'chef_projet': 'Chef de Projet',
      'developpeur': 'Développeur Fullstack',
      'testeur': 'Ingénieur QA',
      'client_projet': 'Client Partenaire'
    };
    return labels[role] || role;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  saveProfile() {
    this.isEditing = false;
    this.snackBar.open('Profil mis à jour avec succès', 'Fermer', { duration: 3000 });
  }
}
