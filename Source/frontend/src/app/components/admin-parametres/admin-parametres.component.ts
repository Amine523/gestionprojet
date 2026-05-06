import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-gear" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Paramètres</h1>
          <p class="mb-0" style="opacity: 0.8;">Configuration - {{societe.nom}}</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <h4 class="fw-bold mb-4">Informations de la Société</h4>
          <div class="d-flex gap-2 mb-3 p-3 rounded-2" style="background: #f5f5f5;">
            <span class="fw-bold text-muted">ID:</span>
            <span class="font-monospace">{{societe.id}}</span>
          </div>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Nom de la société</label>
              <input type="text" class="form-control" [(ngModel)]="societe.nom">
            </div>
            <div class="col-md-6">
              <label class="form-label">Adresse</label>
              <input type="text" class="form-control" [(ngModel)]="societe.adresse">
            </div>
            <div class="col-md-6">
              <label class="form-label">Téléphone</label>
              <input type="text" class="form-control" [(ngModel)]="societe.telephoneContact">
            </div>
            <div class="col-md-6">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" [(ngModel)]="societe.email">
            </div>
            <div class="col-md-6">
              <label class="form-label">Ville</label>
              <input type="text" class="form-control" [(ngModel)]="societe.ville">
            </div>
            <div class="col-md-6">
              <label class="form-label">Pays</label>
              <input type="text" class="form-control" [(ngModel)]="societe.pays">
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <h4 class="fw-bold mb-4">Contact</h4>
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">Personne à contacter</label>
              <input type="text" class="form-control" [(ngModel)]="societe.personneContact">
            </div>
            <div class="col-md-6">
              <label class="form-label">Site Web</label>
              <input type="url" class="form-control" [(ngModel)]="societe.siteWeb">
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <h4 class="fw-bold mb-4">Notifications</h4>
          <div class="d-flex flex-column gap-3">
            <div class="d-flex align-items-center justify-content-between p-3 rounded-2" style="background: #f5f5f5;">
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">Notifications par email</span>
                <span class="text-muted small">Recevoir les notifications par email</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.emailNotifications">
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-2" style="background: #f5f5f5;">
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">Alertes de sécurité</span>
                <span class="text-muted small">Notifications pour les activités suspectes</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.securite">
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-2" style="background: #f5f5f5;">
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">Rappels de projet</span>
                <span class="text-muted small">Rappels pour les deadlines</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.projets">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <h4 class="fw-bold mb-4">Apparence</h4>
          <div class="d-flex flex-column gap-3">
            <div class="d-flex align-items-center justify-content-between p-3 rounded-2" style="background: #f5f5f5;">
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">Mode sombre</span>
                <span class="text-muted small">Activer le thème sombre</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="apparence.darkMode" (change)="applySettings()">
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between p-3 rounded-2" style="background: #f5f5f5;">
              <div class="d-flex flex-column gap-1">
                <span class="fw-bold">Notifications bureau</span>
                <span class="text-muted small">Afficher les notifications sur le bureau</span>
              </div>
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" [(ngModel)]="apparence.notificationsBureau">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2">
        <button class="btn btn-outline-secondary" (click)="loadSettings()">Réinitialiser</button>
        <button class="btn btn-primary" style="background: linear-gradient(135deg, #667eea, #764ba2); border: none;" (click)="save()">
          <i class="bi bi-save me-2"></i>Enregistrer
        </button>
      </div>
    </div>
  `,
  styles: [``]
})
export class AdminParametresComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId: string = '';
  
  societe: any = { id: '', nom: '', adresse: '', telephoneContact: '', email: '', ville: '', pays: '', personneContact: '', siteWeb: '' };
  notifications = { emailNotifications: true, securite: true, projets: true };
  apparence = { darkMode: false, notificationsBureau: true };

  ngOnInit() { this.loadSociete(); }

  loadSociete() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.societeId = user.societeId || '';
      this.societe = user.societe ? { ...user.societe } : this.societe;
    }
    this.loadSettings();
  }

  loadSettings() {
    const storageKey = 'admin_settings_' + this.societeId;
    const settings = localStorage.getItem(storageKey);
    if (settings) {
      const parsed = JSON.parse(settings);
      this.notifications = parsed.notifications || this.notifications;
      this.apparence = parsed.apparence || this.apparence;
    }
    
    this.applySettings();
    
    this.api.getSocietes().subscribe({
      next: (societes) => {
        const s = societes.find((so: any) => so.id === this.societeId);
        if (s) {
          this.societe = { ...s, id: s.id || s.Id || this.societeId };
        }
      },
      error: () => {}
    });
  }

  applySettings() {
    if (this.apparence.darkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    
    if (this.apparence.notificationsBureau) {
      if ('Notification' in window) {
        if (Notification.permission === 'granted') {
          console.log('Desktop notifications already enabled');
        } else if (Notification.permission !== 'denied') {
          Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
              new Notification('Notifications activées', { body: 'Vous recevrez des notifications du système.' });
            }
          });
        }
      }
    }
    
    if (this.notifications.securite) {
      console.log('Security alerts enabled');
    }
    
    if (this.notifications.projets) {
      console.log('Project reminders enabled');
    }
    
    this.api.setUserPreference('notifications', this.notifications);
    this.api.setUserPreference('apparence', this.apparence);
  }

  save() {
    const storageKey = 'admin_settings_' + this.societeId;
    const settings = { notifications: this.notifications, apparence: this.apparence };
    localStorage.setItem(storageKey, JSON.stringify(settings));
    
    this.applySettings();
    
    this.api.updateSociete(this.societe).subscribe({
      next: () => {
        alert('Paramètres enregistrés');
      },
      error: () => {
        alert('Paramètres enregistrés (hors ligne)');
      }
    });
  }
}
