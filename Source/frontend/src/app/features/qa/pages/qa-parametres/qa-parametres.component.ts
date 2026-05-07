import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-qa-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './qa-parametres.component.html',
  styleUrls: ['./qa-parametres.component.scss']
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

