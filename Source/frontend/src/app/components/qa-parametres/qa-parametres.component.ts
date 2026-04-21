import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-qa-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatSlideToggleModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatDialogModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1>Paramètres - {{societeNom}}</h1>
      </div>

      <mat-card class="settings-card">
        <h3>Profil</h3>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput [(ngModel)]="profil.nom">
        </mat-form-field>
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput [(ngModel)]="profil.email" type="email">
        </mat-form-field>
        <button mat-flat-button class="save-btn" (click)="save()">Enregistrer</button>
      </mat-card>

      <mat-card class="settings-card">
        <h3>Notifications</h3>
        <div class="toggle-item">
          <span>Nouveau test assigné</span>
          <mat-slide-toggle [(ngModel)]="notifications.tests"></mat-slide-toggle>
        </div>
        <div class="toggle-item">
          <span>Bug détecté</span>
          <mat-slide-toggle [(ngModel)]="notifications.bugs"></mat-slide-toggle>
        </div>
        <div class="toggle-item">
          <span>Mise à jour projet</span>
          <mat-slide-toggle [(ngModel)]="notifications.projects"></mat-slide-toggle>
        </div>
      </mat-card>

      <mat-card class="settings-card">
        <h3>Sécurité</h3>
        <button mat-stroked-button class="security-btn" (click)="showPasswordDialog = true">
          <mat-icon>lock</mat-icon> Changer le mot de passe
        </button>
      </mat-card>

      @if (showPasswordDialog) {
        <div class="dialog-overlay" (click)="showPasswordDialog = false">
          <mat-card class="dialog-card" (click)="$event.stopPropagation()">
            <div class="dialog-header">
              <h2>Changer le mot de passe</h2>
              <button mat-icon-button (click)="showPasswordDialog = false">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="dialog-body">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Ancien mot de passe</mat-label>
                <input matInput [(ngModel)]="passwordData.oldPassword" type="password">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Nouveau mot de passe</mat-label>
                <input matInput [(ngModel)]="passwordData.newPassword" type="password">
              </mat-form-field>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Confirmer mot de passe</mat-label>
                <input matInput [(ngModel)]="passwordData.confirmPassword" type="password">
              </mat-form-field>
              @if (passwordError) {
                <p class="error-text">{{passwordError}}</p>
              }
            </div>
            <div class="dialog-footer">
              <button mat-stroked-button (click)="showPasswordDialog = false">Annuler</button>
              <button mat-flat-button class="save-btn" (click)="changePassword()">Mettre à jour</button>
            </div>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .page { padding: 24px; }
    .page-header { margin-bottom: 24px; }
    .page-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin: 0; }

    .settings-card { padding: 24px; border-radius: 12px; margin-bottom: 24px; }
    .settings-card h3 { margin: 0 0 20px; font-size: 16px; font-weight: 600; }
    .full-width { width: 100%; }
    .save-btn { background: #2196f3; color: white; margin-top: 16px; }

    .toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid #eee; }
    .security-btn { margin-top: 8px; }

    .dialog-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .dialog-card { width: 400px; padding: 0; border-radius: 16px; background: #fff; }
    .dialog-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; background: #2196f3; color: white; border-radius: 16px 16px 0 0; }
    .dialog-header h2 { margin: 0; font-size: 18px; }
    .dialog-header button { color: white; }
    .dialog-body { padding: 24px; }
    .dialog-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #eee; }
    .error-text { color: #f44336; font-size: 13px; margin-top: 8px; }
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
