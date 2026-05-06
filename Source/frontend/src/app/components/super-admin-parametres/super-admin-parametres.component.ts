import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface SystemStats {
  cpu: number;
  memory: number;
  disk: number;
  uptime: string;
  users: number;
  companies: number;
}

@Component({
  selector: 'app-super-admin-parametres',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="params-container">
      <div class="page-header">
        <div class="header-icon">
          <i class="bi bi-gear text-white" style="font-size: 28px;"></i>
        </div>
        <div class="header-text">
          <h1>Paramètres Système</h1>
          <p>Configuration et gestion de la plateforme Nouveau</p>
        </div>
        <div class="header-stats">
          <div class="stat-badge">
            <i class="bi bi-cpu"></i>
            <span>{{systemStats.cpu}}% CPU</span>
          </div>
          <div class="stat-badge">
            <i class="bi bi-memory"></i>
            <span>{{systemStats.memory}}% RAM</span>
          </div>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#general">Général</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#securite">Sécurité</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#notifications">Notifications</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#api">API & Système</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#sauvegarde">Sauvegarde</button>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane fade show active" id="general">
          <div class="tab-content">
            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-building"></i>
                  <h3>Informations de la Plateforme</h3>
                </div>
                <div class="form-grid">
                  <div class="mb-3">
                    <label class="form-label">Nom de la plateforme</label>
                    <input type="text" class="form-control" [(ngModel)]="settings.platformName">
                  </div>
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-globe"></i>
                  <h3>Configuration Régionale</h3>
                </div>
              <div class="form-grid">
                <div class="mb-3">
                  <label class="form-label">Langue par défaut</label>
                  <select class="form-select" [(ngModel)]="settings.defaultLanguage">
                    <option value="fr">🇹🇳 Français</option>
                    <option value="en">🇬🇧 English</option>
                    <option value="ar">🇸🇦 العربية</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Fuseau horaire</label>
                  <select class="form-select" [(ngModel)]="settings.timezone">
                    <option value="Africa/Tunis">Tunisie (GMT+1)</option>
                    <option value="Europe/Paris">France (GMT+1)</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Devise</label>
                  <select class="form-select" [(ngModel)]="settings.currency">
                    <option value="TND">DT - Dinar Tunisien</option>
                    <option value="EUR">€ - Euro</option>
                    <option value="USD">$ - Dollar US</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Format date</label>
                  <select class="form-select" [(ngModel)]="settings.dateFormat">
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="securite">
          <div class="tab-content">
            <div class="card section-card border-0 shadow-sm">
              <div class="section-header">
                <i class="bi bi-key"></i>
                <h3>Politique de Mot de Passe</h3>
                <span class="badge bg-info">{{settings.minPasswordLength}} caractères minimum</span>
              </div>
              <div class="toggle-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Exiger majuscules</span>
                    <span class="toggle-desc">Au moins une lettre majuscule (A-Z)</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.requireUppercase" id="requireUppercase">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Exiger minuscules</span>
                    <span class="toggle-desc">Au moins une lettre minuscule (a-z)</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.requireLowercase" id="requireLowercase">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Exiger chiffres</span>
                    <span class="toggle-desc">Au moins un chiffre (0-9)</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.requireNumbers" id="requireNumbers">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Exiger caractères spéciaux</span>
                    <span class="toggle-desc">&#64;!#$%^&amp;*()+=?</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.requireSpecial" id="requireSpecial">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Expiration</span>
                    <span class="toggle-desc">Renouvellement obligatoire</span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Expiration</label>
                    <select class="form-select" [(ngModel)]="settings.passwordExpiry">
                      <option [value]="30">30 jours</option>
                      <option [value]="60">60 jours</option>
                      <option [value]="90">90 jours</option>
                      <option [value]="180">180 jours</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-shield-lock"></i>
                  <h3>Authentification</h3>
                </div>
              <div class="toggle-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Authentification à deux facteurs (2FA)</span>
                    <span class="toggle-desc">Obligatoire pour tous les admins</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.require2FA" id="require2FA">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Connexions simultanées</span>
                    <span class="toggle-desc">Autoriser plusieurs sessions</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.allowMultipleSessions" id="allowMultipleSessions">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Verrouillage après échecs</span>
                    <span class="toggle-desc">Bloquer après N tentatives</span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Tentatives max</label>
                    <select class="form-select" [(ngModel)]="settings.maxLoginAttempts">
                      <option [value]="3">3 tentatives</option>
                      <option [value]="5">5 tentatives</option>
                      <option [value]="10">10 tentatives</option>
                    </select>
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Délai de session</span>
                    <span class="toggle-desc">Déconnexion automatique</span>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Timeout de session</label>
                    <select class="form-select" [(ngModel)]="settings.sessionTimeout">
                      <option [value]="15">15 min</option>
                      <option [value]="30">30 min</option>
                      <option [value]="60">1 heure</option>
                      <option [value]="120">2 heures</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="notifications">
          <div class="tab-content">
            <div class="card section-card border-0 shadow-sm">
              <div class="section-header">
                <i class="bi bi-envelope"></i>
                <h3>Notifications par Email</h3>
              </div>
              <div class="toggle-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Nouvel utilisateur</span>
                    <span class="toggle-desc">Email lors création d'un utilisateur</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notifyNewUser" id="notifyNewUser">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Nouvelle société</span>
                    <span class="toggle-desc">Email lors création d'une société</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notifyNewSociete" id="notifyNewSociete">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Abonnement</span>
                    <span class="toggle-desc">Nouvel abonnement souscrit</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notifyAbonnement" id="notifyAbonnement">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Expiration abonnements</span>
                    <span class="toggle-desc">Rappel avant expiration</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notifyExpiry" id="notifyExpiry">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Alertes de sécurité</span>
                    <span class="toggle-desc">Activité suspecte détectée</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notifySecurity" id="notifySecurity">
                  </div>
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="section-header">
                <i class="bi bi-bell"></i>
                <h3>Notifications in-app</h3>
              </div>
              <div class="toggle-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Notifications système</span>
                    <span class="toggle-desc">Alertes dans l'application</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.inAppNotifications" id="inAppNotifications">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Sons de notification</span>
                    <span class="toggle-desc">Jouer un son</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.notificationSounds" id="notificationSounds">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="api">
          <div class="tab-content">
            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-gear"></i>
                  <h3>Configuration API</h3>
                </div>
              <div class="api-key-section">
                <div class="mb-3">
                  <label class="form-label">Clé API</label>
                  <div class="input-group">
                    <input [type]="showApiKey ? 'text' : 'password'" class="form-control" [(ngModel)]="settings.publicApiKey" readonly>
                    <button class="btn btn-outline-secondary" type="button" (click)="showApiKey = !showApiKey">
                      <i class="bi bi-{{showApiKey ? 'eye-slash' : 'eye'}}"></i>
                    </button>
                    <button class="btn btn-outline-secondary" type="button" (click)="copyApiKey()">
                      <i class="bi bi-clipboard"></i>
                    </button>
                  </div>
                </div>
                <button class="btn btn-outline-primary" (click)="regenerateApiKey()">
                  <i class="bi bi-arrow-counterclockwise me-2"></i>Régénérer la clé
                </button>
              </div>
              <hr class="my-4">
              <div class="form-grid" style="margin-top: 16px;">
                <div class="mb-3">
                  <label class="form-label">Rate Limit (req/min)</label>
                  <input type="number" class="form-control" [(ngModel)]="settings.rateLimit">
                </div>
                <div class="mb-3">
                  <label class="form-label">Timeout (ms)</label>
                  <input type="number" class="form-control" [(ngModel)]="settings.apiTimeout">
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="section-header">
                <i class="bi bi-shield-lock"></i>
                <h3>CORS & Sécurité</h3>
              </div>
              <div class="toggle-list">
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Autoriser toutes les origines</span>
                    <span class="toggle-desc">Pour le développement</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.corsAllowAll" id="corsAllowAll">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Mode débogage API</span>
                    <span class="toggle-desc">Logs detalliés</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.debugMode" id="debugMode">
                  </div>
                </div>
                <div class="toggle-item">
                  <div class="toggle-info">
                    <span class="toggle-label">Maintenance</span>
                    <span class="toggle-desc">Mode hors-ligne</span>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="settings.maintenanceMode" id="maintenanceMode">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="sauvegarde">
          <div class="tab-content">
            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-database"></i>
                  <h3>Sauvegardes</h3>
                </div>
              <div class="backup-info">
                <div class="backup-stats">
                  <div class="backup-stat">
                    <i class="bi bi-clock text-primary"></i>
                    <div>
                      <strong>Dernière sauvegarde</strong>
                      <span>{{lastBackup}}</span>
                    </div>
                  </div>
                  <div class="backup-stat">
                    <i class="bi bi-cloud-check text-success"></i>
                    <div>
                      <strong>Prochaine sauvegarde</strong>
                      <span>{{nextBackup}}</span>
                    </div>
                  </div>
                </div>
                <div class="backup-actions">
                  <button class="btn btn-primary" (click)="createBackup()">
                    <i class="bi bi-cloud-upload me-2"></i>Sauvegarder maintenant
                  </button>
                  <button class="btn btn-outline-primary" (click)="downloadBackup()">
                    <i class="bi bi-download me-2"></i>Télécharger
                  </button>
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-arrow-counterclockwise"></i>
                  <h3>Restauration</h3>
                </div>
                <div class="restore-zone">
                  <div class="mb-3">
                    <label class="form-label">Sélectionner un fichier de sauvegarde</label>
                    <input type="file" class="form-control" (change)="onFileSelected($event)">
                  </div>
                  <button class="btn btn-danger" [disabled]="!selectedFile">
                    <i class="bi bi-arrow-counterclockwise me-2"></i>Restaurer
                  </button>
                </div>
              </div>
            </div>

            <div class="card section-card border-0 shadow-sm">
              <div class="card-body">
                <div class="section-header">
                  <i class="bi bi-clock-history"></i>
                  <h3>Historique des Sauvegardes</h3>
                </div>
                <div class="backup-list">
                  @for (b of backups; track b.name) {
                    <div class="backup-item d-flex align-items-center gap-3">
                      <i class="bi bi-file-text"></i>
                      <div class="backup-details flex-grow-1">
                        <strong>{{b.name}}</strong>
                        <span class="text-muted">{{b.date}} - {{b.size}}</span>
                      </div>
                      <button class="btn btn-sm btn-outline-primary"><i class="bi bi-download"></i></button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="actions-bar">
        <button class="btn btn-outline-secondary" (click)="resetDefaults()" class="reset-btn">
          <i class="bi bi-arrow-counterclockwise me-2"></i>Réinitialiser
        </button>
        <button class="btn btn-primary" (click)="saveSettings()" class="save-btn">
          <i class="bi bi-save me-2"></i>Enregistrer les modifications
        </button>
      </div>
    </div>
  `,
  styles: [`
    .params-container { padding: 24px; background: #f5f7fa; min-height: 100vh; }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 24px 32px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px;
      color: white;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 64px; height: 64px;
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon mat-icon { font-size: 32px; width: 32px; height: 32px; }
    .header-text { flex: 1; }
    .header-text h1 { margin: 0; font-size: 26px; font-weight: 700; }
    .header-text p { margin: 4px 0 0; opacity: 0.7; font-size: 14px; }
    .header-stats { display: flex; gap: 12px; }
    .stat-badge {
      display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.1);
      padding: 8px 14px; border-radius: 20px; font-size: 13px;
    }

    .params-tabs { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .tab-content { padding: 24px; }

    .section-card { padding: 24px; border-radius: 12px; margin-bottom: 20px; background: white; border: 1px solid #e8e8e8; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .section-header mat-icon { color: #1a1a2e; }
    .section-header h3 { margin: 0; font-size: 16px; font-weight: 600; color: #1a1a2e; }
    .chip-info { background: #e3f2fd; color: #1976d2; font-size: 11px; }

    .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .full-width { grid-column: span 2; }

    .toggle-list { display: flex; flex-direction: column; gap: 12px; }
    .toggle-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 14px 18px; background: #f8f9fa; border-radius: 10px;
    }
    .toggle-info { display: flex; flex-direction: column; gap: 2px; }
    .toggle-label { font-weight: 500; font-size: 14px; color: #333; }
    .toggle-desc { font-size: 12px; color: #777; }
    .small-field { width: 130px; }

    .api-key-section { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
    .api-key-section mat-form-field { flex: 1; }

    .backup-info { text-align: center; }
    .backup-stats { display: flex; justify-content: center; gap: 40px; margin-bottom: 24px; }
    .backup-stat { display: flex; align-items: center; gap: 12px; }
    .backup-stat mat-icon { font-size: 32px; color: #4caf50; }
    .backup-stat strong { display: block; font-size: 12px; color: #777; }
    .backup-stat span { display: block; font-size: 16px; font-weight: 600; }
    .backup-actions { display: flex; gap: 12px; justify-content: center; }

    .restore-zone { display: flex; gap: 12px; align-items: center; }
    .restore-zone mat-form-field { flex: 1; }

    .backup-list { display: flex; flex-direction: column; gap: 8px; }
    .backup-item { display: flex; align-items: center; gap: 12px; padding: 12px; background: #f8f9fa; border-radius: 8px; }
    .backup-item mat-icon { color: #555; }
    .backup-details { flex: 1; }
    .backup-details strong { display: block; font-size: 14px; }
    .backup-details span { font-size: 12px; color: #777; }

    .actions-bar { display: flex; justify-content: space-between; padding: 20px 24px; background: white; border-radius: 12px; margin-top: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
    .reset-btn { border-radius: 8px; }
    .save-btn { border-radius: 8px; padding: 0 24px; }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: span 1; }
      .backup-stats { flex-direction: column; gap: 20px; }
    }
  `]
})
export class SuperAdminParametresComponent implements OnInit {
  private api = inject(ApiService);

  systemStats: SystemStats = { cpu: 23, memory: 47, disk: 62, uptime: '14 jours', users: 42, companies: 10 };
  showApiKey = false;
  selectedFile: File | null = null;
  lastBackup = '04/04/2026 14:30';
  nextBackup = '05/04/2026 02:00';
  backups = [
    { name: 'backup_20260404.sql', date: '04/04/2026 14:30', size: '2.4 MB' },
    { name: 'backup_20260403.sql', date: '03/04/2026 02:00', size: '2.3 MB' },
    { name: 'backup_20260402.sql', date: '02/04/2026 02:00', size: '2.2 MB' }
  ];

  settings = {
    platformName: 'NADHEMNI',
    version: '1.0.0',
    systemUrl: 'https://nademhni.tn',
    contactEmail: 'support@nademhni.tn',
    contactPhone: '+216 00 000 000',
    defaultLanguage: 'fr',
    timezone: 'Africa/Tunis',
    currency: 'TND',
    dateFormat: 'DD/MM/YYYY',
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecial: false,
    minPasswordLength: 8,
    passwordExpiry: 90,
    require2FA: false,
    allowMultipleSessions: true,
    maxLoginAttempts: 5,
    sessionTimeout: 60,
    notifyNewUser: true,
    notifyNewSociete: true,
    notifyAbonnement: true,
    notifyExpiry: true,
    notifySecurity: true,
    inAppNotifications: true,
    notificationSounds: false,
    publicApiKey: 'pk_live_' + this.generateApiKey(),
    rateLimit: 100,
    apiTimeout: 30000,
    corsAllowAll: true,
    debugMode: false,
    maintenanceMode: false
  };

  ngOnInit() {}

  generateApiKey(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  copyApiKey() {
    navigator.clipboard.writeText(this.settings.publicApiKey);
    alert('Clé API copiée');
  }

  regenerateApiKey() {
    if (confirm('Générer une nouvelle clé API? L\'ancienne sera invalidée.')) {
      this.settings.publicApiKey = 'pk_live_' + this.generateApiKey();
      alert('Nouvelle clé API générée');
    }
  }

  createBackup() {
    alert('Sauvegarde en cours...');
    setTimeout(() => {
      this.lastBackup = new Date().toLocaleString('fr-FR');
      alert('Sauvegarde créée avec succès');
    }, 1500);
  }

  downloadBackup() {
    alert('Téléchargement...');
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      alert(`Fichier sélectionné: ${this.selectedFile.name}`);
    }
  }

  saveSettings() {
    localStorage.setItem('app_settings', JSON.stringify(this.settings));
    alert('Paramètres enregistrés avec succès');
  }

  resetDefaults() {
    if (confirm('Réinitialiser tous les paramètres aux valeurs par défaut?')) {
      alert('Paramètres réinitialisés');
    }
  }
}
