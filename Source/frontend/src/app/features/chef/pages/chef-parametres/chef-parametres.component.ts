import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { LanguageService, Language } from '@core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chef-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="parametres-container">
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">{{lang.translate('settings')}}</h1>
          <p class="header-subtitle">{{lang.translate('manage_profile')}} (Chef) - {{societeNom}}</p>
        </div>
        <div class="header-actions">
           <select class="lang-select" [ngModel]="lang.lang" (ngModelChange)="changeLang($event)">
              <option value="fr">FR 🇫🇷</option>
              <option value="en">EN 🇺🇸</option>
           </select>
        </div>
      </div>

      <div class="settings-grid">
        <div class="settings-col">
          <div class="card profile-card">
            <div class="card-body">
              <h5 class="card-title">{{lang.translate('profile')}}</h5>
              <div class="profile-photo-section">
                <div class="photo-container" (click)="fileInput.click()">
                  @if (profil.photo) {
                    <img [src]="profil.photo" class="profile-img">
                  } @else {
                    <div class="photo-placeholder">{{profil.initials}}</div>
                  }
                  <div class="photo-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                      <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <input #fileInput type="file" (change)="onPhotoSelected($event)" accept="image/*" hidden>
                <button class="btn btn-ghost btn-sm" (click)="fileInput.click()">{{lang.translate('upload')}}</button>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">{{lang.translate('name')}}</label>
                  <input type="text" [(ngModel)]="profil.nom" class="form-input">
                </div>
                <div class="form-group">
                  <label class="form-label">{{lang.translate('email')}}</label>
                  <input type="email" [(ngModel)]="profil.email" class="form-input">
                </div>
              </div>
              <button class="btn btn-primary" (click)="saveProfil()">{{lang.translate('save')}}</button>
            </div>
          </div>
        </div>

        <div class="settings-col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{lang.translate('notifications')}}</h5>
              <div class="setting-item">
                <span class="setting-label">Alertes de retard projet</span>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.retards" (change)="saveNotifications()">
                  <span class="toggle-slider"></span>
                </label>
              </div>
              <div class="setting-item">
                <span class="setting-label">Validation de congés</span>
                <label class="toggle-switch">
                  <input type="checkbox" [(ngModel)]="notifications.conges" (change)="saveNotifications()">
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Same styles as dev-parametres but slightly adjusted for layout if needed */
    .parametres-container { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-2xl); }
    .header-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 8px 16px rgba(245, 158, 11, 0.2); }
    .header-info { flex: 1; }
    .header-title { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); color: var(--color-text); margin: 0; }
    .header-subtitle { color: var(--color-text-muted); font-size: var(--font-size-base); }
    .lang-select { padding: var(--space-sm) var(--space-md); border-radius: var(--radius-lg); border: 1px solid var(--color-border); background: white; font-weight: 600; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); }
    .card { background: white; border-radius: var(--radius-2xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden; margin-bottom: var(--space-xl); }
    .card-body { padding: var(--space-xl); }
    .card-title { font-size: var(--font-size-xl); font-weight: var(--font-weight-bold); margin-bottom: var(--space-xl); }
    .profile-photo-section { display: flex; flex-direction: column; align-items: center; gap: var(--space-md); margin-bottom: var(--space-2xl); }
    .photo-container { width: 120px; height: 120px; border-radius: 50%; position: relative; cursor: pointer; overflow: hidden; background: var(--color-bg); border: 4px solid white; box-shadow: var(--shadow-lg); }
    .profile-img { width: 100%; height: 100%; object-fit: cover; }
    .photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 48px; font-weight: bold; color: white; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); }
    .photo-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4); display: flex; align-items: center; justify-content: center; color: white; opacity: 0; transition: opacity 0.3s; }
    .photo-container:hover .photo-overlay { opacity: 1; }
    .form-grid { display: grid; grid-template-columns: 1fr; gap: var(--space-md); margin-bottom: var(--space-xl); }
    .form-label { font-size: var(--font-size-sm); font-weight: 600; }
    .form-input { padding: var(--space-md); border-radius: var(--radius-lg); border: 1px solid var(--color-border); background: var(--color-bg); width: 100%; }
    .btn { padding: var(--space-md) var(--space-xl); border-radius: var(--radius-lg); font-weight: 600; cursor: pointer; border: none; width: 100%; }
    .btn-primary { background: #f59e0b; color: white; }
    .btn-ghost { background: transparent; border: 1px solid var(--color-border); }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: var(--space-lg) 0; border-bottom: 1px solid var(--color-border); }
    .toggle-switch { position: relative; width: 44px; height: 24px; }
    .toggle-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #e2e8f0; border-radius: 24px; }
    .toggle-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: 0.4s; }
    input:checked + .toggle-slider { background-color: #f59e0b; }
    input:checked + .toggle-slider:before { transform: translateX(20px); }
  `]
})
export class ChefParametresComponent implements OnInit {
  private api = inject(ApiService);
  public lang = inject(LanguageService);
  private snackBar = inject(MatSnackBar);

  societeNom = '';
  profil = { nom: '', email: '', role: '', initials: '', photo: '' };
  notifications = { retards: true, conges: true };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.profil = {
      nom: (user?.prenom || '') + ' ' + (user?.nom || ''),
      email: user?.email || '',
      role: ApiService.getRoleLabel(user?.typeUtilisateurId || 'T004'),
      initials: (user?.nom?.charAt(0) || 'C'),
      photo: user?.photo || ''
    };
    this.loadFromStorage();
  }

  changeLang(l: Language) { this.lang.setLanguage(l); }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profil.photo = e.target.result;
        this.saveProfil();
      };
      reader.readAsDataURL(file);
    }
  }

  loadFromStorage() {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    if (notifData.chef) this.notifications = notifData.chef;
  }

  saveProfil() {
    this.api.updateCurrentUser({ nom: this.profil.nom, email: this.profil.email, photo: this.profil.photo });
    this.snackBar.open(this.lang.translate('success_save'), 'OK', { duration: 3000 });
  }

  saveNotifications() {
    const notifData = JSON.parse(localStorage.getItem('user_notifications') || '{}');
    notifData.chef = this.notifications;
    localStorage.setItem('user_notifications', JSON.stringify(notifData));
    this.snackBar.open(this.lang.translate('success_notif'), 'OK', { duration: 2000 });
  }
}
