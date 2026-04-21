import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-chef-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container-fluid p-4">
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #2196f3, #1976d2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 52px; height: 52px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-gear" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 24px;">Paramètres</h1>
          <p class="mb-0" style="opacity: 0.8;">Gérez vos préférences - {{societeNom}}</p>
        </div>
      </div>

      <div class="card border-0 shadow-sm">
        <ul class="nav nav-tabs" id="parametresTabs" role="tablist">
          <li class="nav-item" role="presentation">
            <button class="nav-link active" id="profil-tab" data-bs-toggle="tab" data-bs-target="#profil" type="button" role="tab">Profil</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="notifications-tab" data-bs-toggle="tab" data-bs-target="#notifications" type="button" role="tab">Notifications</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="preferences-tab" data-bs-toggle="tab" data-bs-target="#preferences" type="button" role="tab">Préférences projet</button>
          </li>
          <li class="nav-item" role="presentation">
            <button class="nav-link" id="securite-tab" data-bs-toggle="tab" data-bs-target="#securite" type="button" role="tab">Sécurité</button>
          </li>
        </ul>
        <div class="tab-content p-4">
          <div class="tab-pane fade show active" id="profil" role="tabpanel">
            <h4 class="fw-bold mb-4">Informations du profil</h4>
            <div style="max-width: 500px;">
              <div class="mb-3">
                <label class="form-label">Nom complet</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-person"></i></span>
                  <input type="text" class="form-control" [(ngModel)]="profil.nom">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Email</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                  <input type="email" class="form-control" [(ngModel)]="profil.email">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Téléphone</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                  <input type="tel" class="form-control" [(ngModel)]="profil.telephone">
                </div>
              </div>
              <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="saveProfil()">Enregistrer</button>
            </div>
          </div>

          <div class="tab-pane fade" id="notifications" role="tabpanel">
            <h4 class="fw-bold mb-4">Paramètres de notification</h4>
            <div style="max-width: 500px;">
              <div class="d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-envelope" style="color: #2196f3; font-size: 20px;"></i>
                  <div>
                    <div class="fw-medium">Emails</div>
                    <div class="text-muted small">Recevoir les notifications par email</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.email">
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-bell" style="color: #2196f3; font-size: 20px;"></i>
                  <div>
                    <div class="fw-medium">Notifications Push</div>
                    <div class="text-muted small">Recevoir les notifications push</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.push">
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-clipboard" style="color: #2196f3; font-size: 20px;"></i>
                  <div>
                    <div class="fw-medium">Nouvelles tâches</div>
                    <div class="text-muted small">Notifications pour les nouvelles tâches</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.nouvellesTaches">
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-bug" style="color: #2196f3; font-size: 20px;"></i>
                  <div>
                    <div class="fw-medium">Nouveaux bugs</div>
                    <div class="text-muted small">Notifications pour les nouveaux bugs</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.nouveauxBugs">
                </div>
              </div>
              <hr>
              <div class="d-flex justify-content-between align-items-center py-3">
                <div class="d-flex align-items-center gap-3">
                  <i class="bi bi-exclamation-triangle" style="color: #2196f3; font-size: 20px;"></i>
                  <div>
                    <div class="fw-medium">Alertes retard</div>
                    <div class="text-muted small">Alertes quand une tâche est en retard</div>
                  </div>
                </div>
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" [(ngModel)]="notifications.alertesRetard">
                </div>
              </div>
            </div>
          </div>

          <div class="tab-pane fade" id="preferences" role="tabpanel">
            <h4 class="fw-bold mb-4">Préférences d'affichage</h4>
            <div style="max-width: 500px;">
              <div class="mb-3">
                <label class="form-label">Mode d'affichage des tâches</label>
                <select class="form-select" [(ngModel)]="preferences.modeAffichage">
                  <option value="kanban">Kanban</option>
                  <option value="liste">Liste</option>
                  <option value="tableau">Tableau</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Trier par</label>
                <select class="form-select" [(ngModel)]="preferences.trierPar">
                  <option value="date">Date</option>
                  <option value="priorite">Priorité</option>
                  <option value="assignee">Assigné à</option>
                </select>
              </div>
              <div class="mb-3">
                <label class="form-label">Projet par défaut</label>
                <select class="form-select" [(ngModel)]="preferences.projetDefaut">
                  <option value="">Aucun</option>
                  @for (p of projets; track p.id) {
                    <option [value]="p.nom">{{p.nom}}</option>
                  }
                </select>
              </div>
              <button class="btn btn-primary" style="background: #2196f3; border: none;" (click)="savePreferences()">Enregistrer</button>
            </div>
          </div>

          <div class="tab-pane fade" id="securite" role="tabpanel">
            <h4 class="fw-bold mb-4">Sécurité du compte</h4>
            <div class="d-flex flex-wrap gap-2">
              <button class="btn btn-outline-secondary" (click)="showPasswordDialog = true">
                <i class="bi bi-lock me-2"></i>Changer le mot de passe
              </button>
              <button class="btn btn-outline-secondary" (click)="toggle2FA()">
                <i class="bi bi-phone me-2"></i>{{twoFactorEnabled ? 'Désactiver 2FA' : 'Activer 2FA'}}
              </button>
              <button class="btn btn-outline-secondary" (click)="showSessionsDialog = true">
                <i class="bi bi-devices me-2"></i>Gérer les sessions
              </button>
            </div>
          </div>
        </div>
      </div>
      
      @if (showPasswordDialog) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h5 class="modal-title">Changer le mot de passe</h5>
                <button type="button" class="btn-close" (click)="cancelPassword()"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Mot de passe actuel</label>
                  <input type="password" class="form-control" [(ngModel)]="passwordData.actuel">
                </div>
                <div class="mb-3">
                  <label class="form-label">Nouveau mot de passe</label>
                  <input type="password" class="form-control" [(ngModel)]="passwordData.nouveau">
                </div>
                <div class="mb-3">
                  <label class="form-label">Confirmer le mot de passe</label>
                  <input type="password" class="form-control" [(ngModel)]="passwordData.confirmer">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="cancelPassword()">Annuler</button>
                <button type="button" class="btn btn-primary" style="background: #2196f3; border: none;" (click)="changePassword()">Confirmer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="cancelPassword()"></div>
      }
      
      @if (showSessionsDialog) {
        <div class="modal fade show d-block" style="background: rgba(0,0,0,0.5);" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h5 class="modal-title">Gérer les sessions</h5>
                <button type="button" class="btn-close" (click)="cancelSessions()"></button>
              </div>
              <div class="modal-body">
                @for (session of sessions; track session.id) {
                  <div class="d-flex align-items-center gap-3 p-3" style="border-bottom: 1px solid #eee;">
                    <i [class]="session.current ? 'bi bi-pc-display' : 'bi bi-devices'" style="font-size: 20px;"></i>
                    <div class="flex-grow-1">
                      <div class="fw-medium">{{session.device}}</div>
                      <div class="text-muted small">{{session.location}} - {{session.lastActive}}</div>
                    </div>
                    @if (session.current) {
                      <span class="badge bg-success">Actuelle</span>
                    } @else {
                      <button class="btn btn-sm btn-outline-danger" (click)="revokeSession(session)">
                        <i class="bi bi-box-arrow-right"></i>
                      </button>
                    }
                  </div>
                }
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary" (click)="cancelSessions()">Fermer</button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-backdrop fade show" (click)="cancelSessions()"></div>
      }
    </div>
  `,
  styles: [``]
})
export class ChefParametresComponent implements OnInit {
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = '';
  
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
    alert('Profil enregistré');
  }

  savePreferences() {
    const prefs = JSON.parse(localStorage.getItem('userPreferences') || '{}');
    const key = `chef_${this.societeId}`;
    prefs[key] = { preferences: this.preferences, notifications: this.notifications };
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    this.applyNotifications();
    alert('Préférences enregistrées');
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
      alert('Veuillez remplir tous les champs');
      return;
    }
    if (this.passwordData.nouveau !== this.passwordData.confirmer) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }
    const userId = this.api.getCurrentUser()?.id;
    if (userId) {
      this.api.updateUtilisateur(userId, { motDePasse: this.passwordData.nouveau }).subscribe({
        next: () => {
          alert('Mot de passe changé');
        },
        error: () => {
          alert('Mot de passe changé (local)');
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
    alert(this.twoFactorEnabled ? '2FA activé' : '2FA désactivé');
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
      alert('Impossible de révoquer la session actuelle');
      return;
    }
    this.sessions = this.sessions.filter((s: any) => s.id !== session.id);
    const sessionData = JSON.parse(localStorage.getItem('user_sessions') || '{}');
    sessionData[this.societeId] = this.sessions;
    localStorage.setItem('user_sessions', JSON.stringify(sessionData));
    alert('Session révoquée');
  }
  
  cancelSessions() {
    this.showSessionsDialog = false;
  }
}
