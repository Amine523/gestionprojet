import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { LanguageService, Language } from '@core/services/language.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="parametres-container">
      <div class="page-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">{{lang.translate('settings')}}</h1>
          <p class="header-subtitle">Configuration Administrateur - {{societeNom}}</p>
        </div>
        <div class="header-actions">
           <select class="lang-select" [ngModel]="lang.lang" (ngModelChange)="lang.setLanguage($event)">
              <option value="fr">FR 🇫🇷</option>
              <option value="en">EN 🇺🇸</option>
           </select>
        </div>
      </div>

      <div class="settings-grid">
        <div class="settings-col">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{lang.translate('profile')}}</h5>
              <div class="profile-photo-section">
                <div class="photo-container" (click)="fileInput.click()">
                  @if (profil.photo) {
                    <img [src]="profil.photo" class="profile-img">
                  } @else {
                    <div class="photo-placeholder">{{profil.initials}}</div>
                  }
                  <div class="photo-overlay"><span>CHANGER</span></div>
                </div>
                <input #fileInput type="file" (change)="onPhotoSelected($event)" accept="image/*" hidden>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>{{lang.translate('name')}}</label>
                  <input type="text" [(ngModel)]="profil.nom" class="form-input">
                </div>
                <div class="form-group">
                  <label>{{lang.translate('email')}}</label>
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
              <h5 class="card-title">Paramètres Société</h5>
              <div class="form-group">
                <label>Nom de la société</label>
                <input type="text" [(ngModel)]="societeNom" class="form-input" disabled>
              </div>
              <div class="setting-item">
                <span class="setting-label">Mode Maintenance</span>
                <label class="toggle-switch">
                  <input type="checkbox">
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
    .parametres-container { padding: var(--space-xl); max-width: 1200px; margin: 0 auto; }
    .page-header { display: flex; align-items: center; gap: var(--space-lg); margin-bottom: var(--space-2xl); }
    .header-icon { width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; color: white; }
    .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-xl); }
    .card { background: white; border-radius: var(--radius-2xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); }
    .card-body { padding: var(--space-xl); }
    .profile-photo-section { display: flex; flex-direction: column; align-items: center; margin-bottom: var(--space-xl); }
    .photo-container { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative; cursor: pointer; border: 4px solid white; box-shadow: var(--shadow-md); }
    .photo-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 40px; background: #3b82f6; color: white; }
    .profile-img { width: 100%; height: 100%; object-fit: cover; }
    .photo-overlay { position: absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.4); display:flex; align-items:center; justify-content:center; color:white; opacity:0; transition:0.3s; }
    .photo-container:hover .photo-overlay { opacity:1; }
    .form-group { margin-bottom: var(--space-md); }
    .form-input { width: 100%; padding: var(--space-md); border-radius: var(--radius-lg); border: 1px solid var(--color-border); }
    .btn-primary { width: 100%; padding: var(--space-md); background: #3b82f6; color: white; border: none; border-radius: var(--radius-lg); font-weight: 600; cursor: pointer; }
    .lang-select { padding: 8px 12px; border-radius: 8px; border: 1px solid var(--color-border); }
    .setting-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid var(--color-border); }
    .toggle-switch { position: relative; width: 44px; height: 24px; }
    .toggle-slider { position: absolute; cursor: pointer; top:0; left:0; right:0; bottom:0; background:#e2e8f0; border-radius: 24px; }
    .toggle-slider:before { position: absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.4s; }
    input:checked + .toggle-slider { background: #3b82f6; }
    input:checked + .toggle-slider:before { transform: translateX(20px); }
  `]
})
export class AdminParametresComponent implements OnInit {
  private api = inject(ApiService);
  public lang = inject(LanguageService);
  private snackBar = inject(MatSnackBar);

  societeNom = '';
  profil = { nom: '', email: '', initials: '', photo: '' };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    
    // Fix: Use name instead of ID
    const rawNom = user?.societe?.nom || user?.SocieteNom || 'Votre Société';
    this.societeNom = (typeof rawNom === 'string') ? rawNom.replace(/undefined/g, '').trim() : 'Votre Société';
    if (!this.societeNom) this.societeNom = 'Votre Société';

    this.profil = {
      nom: ((user?.prenom || '') + ' ' + (user?.nom || '')).replace(/undefined/g, '').trim(),
      email: user?.email || '',
      initials: (user?.nom?.charAt(0) || 'A'),
      photo: user?.photo || ''
    };
  }

  onPhotoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.profil.photo = e.target.result; this.saveProfil(); };
      reader.readAsDataURL(file);
    }
  }

  saveProfil() {
    this.api.updateCurrentUser({ nom: this.profil.nom, email: this.profil.email, photo: this.profil.photo });
    this.snackBar.open(this.lang.translate('success_save'), 'OK', { duration: 3000 });
  }
}
