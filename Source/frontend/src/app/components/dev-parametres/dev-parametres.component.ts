import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dev-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="mb-4">
        <h1 class="fw-bold" style="font-size: 28px; color: #1a1a2e;">Paramètres</h1>
        <p class="text-muted" style="font-size: 14px;">Gérez votre profil et préférences - {{societeNom}}</p>
      </div>

      <div class="card border-0 shadow-sm mb-4" style="padding: 24px; border-radius: 12px;">
        <h5 class="fw-bold mb-4" style="font-size: 16px;">Profil</h5>
        <div class="d-flex align-items-center gap-4 p-4 rounded-3 mb-4" style="background: #f5f5f5;">
          <div class="rounded-circle d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; font-size: 24px; background: #4caf50; color: white;">{{profil.initials}}</div>
          <div class="d-flex flex-column">
            <span class="fw-bold" style="font-size: 18px;">{{profil.nom}}</span>
            <span class="text-muted" style="font-size: 14px;">{{profil.role}}</span>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Nom</label>
          <input type="text" class="form-control" [(ngModel)]="profil.nom">
        </div>
        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" [(ngModel)]="profil.email">
        </div>
        <div class="mb-3">
          <label class="form-label">Société</label>
          <input type="text" class="form-control" [value]="societeNom" disabled>
        </div>
        <button class="btn" style="background: #4caf50; color: white; margin-top: 16px; border: none;" (click)="save()">Enregistrer</button>
      </div>

      <div class="card border-0 shadow-sm mb-4" style="padding: 24px; border-radius: 12px;">
        <h5 class="fw-bold mb-4" style="font-size: 16px;">Notifications</h5>
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <span>Nouvelles tâches assignées</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.taches" (change)="saveNotifications()">
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <span>Bugs assignés</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.bugs" (change)="saveNotifications()">
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <span>Commentaires</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.commentaires" (change)="saveNotifications()">
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center py-3">
          <span>Mentions</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.mentions" (change)="saveNotifications()">
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm" style="padding: 24px; border-radius: 12px;">
        <h5 class="fw-bold mb-4" style="font-size: 16px;">Préférences</h5>
        <div class="d-flex justify-content-between align-items-center py-3 border-bottom">
          <span>Mode sombre</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="preferences.darkMode" (change)="savePreferences()">
          </div>
        </div>
        <div class="d-flex justify-content-between align-items-center py-3">
          <span>Compact Kanban</span>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" [(ngModel)]="preferences.compactKanban" (change)="savePreferences()">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
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
