import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dev-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  templateUrl: './dev-parametres.component.html',
  styleUrls: ['./dev-parametres.component.scss']
})
export class DevParametresComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

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

  saveProfil() {
    this.snackBar.open('Profil enregistré', 'Fermer', { duration: 3000 });
  }

  saveNotifications() {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    notifData.dev = this.notifications;
    localStorage.setItem('user_notifications', JSON.stringify(notifData));
    this.snackBar.open('Notifications mises à jour', 'Fermer', { duration: 3000 });
  }

  savePreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    prefs.dev = this.preferences;
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    this.snackBar.open('Préférences mises à jour', 'Fermer', { duration: 3000 });
  }
}
