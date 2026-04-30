import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './chef-parametres.component.html',
  styleUrls: ['./chef-parametres.component.scss']
})
export class ChefParametresComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
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
    this.snackBar.open('Profil enregistré', 'Fermer', { duration: 3000 });
  }

  savePreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const key = `chef_${this.societeId}`;
    prefs[key] = { preferences: this.preferences, notifications: this.notifications };
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    this.applyNotifications();
    this.snackBar.open('Préférences enregistrées', 'Fermer', { duration: 3000 });
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
      this.snackBar.open('Veuillez remplir tous les champs', 'Fermer', { duration: 3000 });
      return;
    }
    if (this.passwordData.nouveau !== this.passwordData.confirmer) {
      this.snackBar.open('Les mots de passe ne correspondent pas', 'Fermer', { duration: 3000 });
      return;
    }
    const userId = this.api.getCurrentUser()?.id;
    if (userId) {
      this.api.updateUtilisateur(userId, { motDePasse: this.passwordData.nouveau }).subscribe({
        next: () => {
          this.snackBar.open('Mot de passe changé', 'Fermer', { duration: 3000 });
        },
        error: () => {
          this.snackBar.open('Mot de passe changé (local)', 'Fermer', { duration: 3000 });
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
    this.snackBar.open(this.twoFactorEnabled ? '2FA activé' : '2FA désactivé', 'Fermer', { duration: 3000 });
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
      this.snackBar.open('Impossible de révoquer la session actuelle', 'Fermer', { duration: 3000 });
      return;
    }
    this.sessions = this.sessions.filter((s: any) => s.id !== session.id);
    const sessionData = JSON.parse(localStorage.getItem('user_sessions') || '{}');
    sessionData[this.societeId] = this.sessions;
    localStorage.setItem('user_sessions', JSON.stringify(sessionData));
    this.snackBar.open('Session révoquée', 'Fermer', { duration: 3000 });
  }
  
  cancelSessions() {
    this.showSessionsDialog = false;
  }
}

