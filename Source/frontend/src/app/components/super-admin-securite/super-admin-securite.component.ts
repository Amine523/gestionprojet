import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

interface SecurityAlert {
  id: number;
  type: string;
  description: string;
  date: string;
  niveau: 'critical' | 'high' | 'medium' | 'low';
  statut: 'active' | 'investigating' | 'resolved';
}

interface IpBlock {
  id: number;
  ip: string;
  raison: string;
  dateBlocage: string;
  statut: 'bloque' | 'debloque';
}

interface PasswordPolicy {
  requireUppercase: boolean;
  requireNumbers: boolean;
  requireSpecial: boolean;
  minLength: number;
  require2FA: boolean;
  allowSimultaneous: boolean;
  sessionTimeout: number;
}

interface EmailNotificationSettings {
  newUser: boolean;
  newSociete: boolean;
  newAbonnement: boolean;
  securityAlerts: boolean;
  recipientEmail: string;
}

@Component({
  selector: 'app-super-admin-securite',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="sec-container">
      <div class="page-header">
        <div class="header-icon">
          <i class="bi bi-shield-check text-white" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1>Sécurité</h1>
          <p>Protection et surveillance de la plateforme</p>
        </div>
      </div>

      <ul class="nav nav-tabs mb-4" role="tablist">
        <li class="nav-item">
          <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#alertes">Alertes</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#politique">Politique</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#ips">IPs Bloquées</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#notifications">Notifications</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" data-bs-toggle="tab" data-bs-target="#surveillance">Surveillance Temps Réel</button>
        </li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane fade show active" id="alertes">
          <div class="tab-header">
            <h3>Alertes de Sécurité</h3>
            <button class="btn btn-outline-primary" (click)="refreshAlerts()">
              <i class="bi bi-arrow-clockwise me-2"></i>Actualiser
            </button>
          </div>

            <div class="stats-row">
              <div class="card stat-card border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-exclamation-triangle-fill text-danger stat-icon critical"></i>
                  <div class="stat-info">
                    <span class="stat-value">{{getCriticalCount()}}</span>
                    <span class="stat-label">Critiques</span>
                  </div>
                </div>
              </div>
              <div class="card stat-card border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-exclamation-triangle-fill text-warning stat-icon high"></i>
                  <div class="stat-info">
                    <span class="stat-value">{{getHighCount()}}</span>
                    <span class="stat-label">Élevées</span>
                  </div>
                </div>
              </div>
              <div class="card stat-card border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-info-circle-fill text-info stat-icon medium"></i>
                  <div class="stat-info">
                    <span class="stat-value">{{getMediumCount()}}</span>
                    <span class="stat-label">Moyennes</span>
                  </div>
                </div>
              </div>
              <div class="card stat-card border-0 shadow-sm">
                <div class="card-body">
                  <i class="bi bi-check-circle-fill text-success stat-icon low"></i>
                  <div class="stat-info">
                    <span class="stat-value">{{getLowCount()}}</span>
                    <span class="stat-label">Basses</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="alerts-list">
              @for (alert of alerts; track alert.id) {
                <div class="card alert-card border-0 shadow-sm" [class]="alert.niveau">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="alert-icon">
                      <i class="bi bi-{{alert.niveau === 'critical' ? 'exclamation-triangle-fill' : alert.niveau === 'high' ? 'exclamation-triangle-fill' : alert.niveau === 'medium' ? 'info-circle-fill' : 'check-circle-fill'}}"></i>
                    </div>
                    <div class="alert-content flex-grow-1">
                      <strong>{{alert.type}}</strong>
                      <span>{{alert.description}}</span>
                    </div>
                    <span class="badge rounded-pill" [class.bg-danger]="alert.niveau === 'critical'" [class.bg-warning]="alert.niveau === 'high'" [class.bg-info]="alert.niveau === 'medium'" [class.bg-success]="alert.niveau === 'low'">{{alert.niveau}}</span>
                    <span class="badge rounded-pill" [class.bg-success]="alert.statut === 'resolved'" [class.bg-warning]="alert.statut === 'investigating'" [class.bg-danger]="alert.statut === 'active'">{{alert.statut === 'active' ? 'Active' : alert.statut === 'investigating' ? 'En cours' : 'Résolu'}}</span>
                    <span class="alert-date text-muted">{{alert.date}}</span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="politique">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Politique de Sécurité</h3>
              <div class="header-buttons">
                <button class="btn btn-outline-danger" (click)="clearSecurityData()">
                  <i class="bi bi-trash me-2"></i>Effacer
                </button>
                <button class="btn btn-primary" (click)="savePolicy()">
                  <i class="bi bi-save me-2"></i>Enregistrer
                </button>
              </div>
            </div>

            <div class="policy-section">
              <h5 class="fw-bold mb-3" style="font-size: 14px; color: #1e293b;">Politique de mot de passe</h5>
              
              <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Exiger majuscules</div>
                      <div class="text-muted" style="font-size: 11px;">Le mot de passe doit contenir au moins une lettre majuscule</div>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="passwordPolicy.requireUppercase" id="requireUppercase">
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Exiger chiffres</div>
                      <div class="text-muted" style="font-size: 11px;">Le mot de passe doit contenir au moins un chiffre</div>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="passwordPolicy.requireNumbers" id="requireNumbers">
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Exiger caractères spéciaux</div>
                      <div class="text-muted" style="font-size: 11px;">Le mot de passe doit contenir un caractère spécial</div>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="passwordPolicy.requireSpecial" id="requireSpecial">
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Longueur minimale</div>
                      <div class="text-muted" style="font-size: 11px;">Nombre minimum de caractères: {{passwordPolicy.minLength}} caractères</div>
                    </div>
                    <div class="d-flex align-items-center">
                      <input type="number" class="form-control form-control-sm" style="width: 80px;" [(ngModel)]="passwordPolicy.minLength" min="4" max="32">
                    </div>
                  </div>
                </div>
              </div>

              <h5 class="fw-bold mb-3" style="font-size: 14px; color: #1e293b;">Authentification</h5>
              
              <div class="card border-0 shadow-sm">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Authentification à deux facteurs (2FA)</div>
                      <div class="text-muted" style="font-size: 11px;">Exiger 2FA pour tous les utilisateurs</div>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="passwordPolicy.require2FA" id="require2FA">
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Sessions simultanées</div>
                      <div class="text-muted" style="font-size: 11px;">Autoriser plusieurs connexions simultanées</div>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" [(ngModel)]="passwordPolicy.allowSimultaneous" id="allowSimultaneous">
                    </div>
                  </div>
                  
                  <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                    <div>
                      <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Délai d'expiration de session</div>
                      <div class="text-muted" style="font-size: 11px;">Minutes avant déconnexion automatique: {{passwordPolicy.sessionTimeout}} min</div>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                      <input type="number" class="form-control form-control-sm" style="width: 80px;" [(ngModel)]="passwordPolicy.sessionTimeout" min="5" max="120">
                      <span class="text-muted" style="font-size: 12px;">minutes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="ips">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Adresses IP Bloquées</h3>
              <button class="btn btn-primary" (click)="openBlockDialog()">
                <i class="bi bi-shield-x me-2"></i>Bloquer IP
              </button>
            </div>

            <div class="blocked-list">
              @for (ip of blockedIps; track ip.id) {
                <div class="card blocked-card border-0 shadow-sm">
                  <div class="card-body d-flex align-items-center gap-3">
                    <div class="blocked-icon">
                      <i class="bi bi-shield-x text-danger"></i>
                    </div>
                    <div class="blocked-content flex-grow-1">
                      <strong>{{ip.ip}}</strong>
                      <span>{{ip.raison}}</span>
                      <span class="blocked-date text-muted">Bloqué le: {{ip.dateBlocage}}</span>
                    </div>
                    <span class="badge rounded-pill" [class.bg-danger]="ip.statut === 'bloque'" [class.bg-success]="ip.statut !== 'bloque'">{{ip.statut === 'bloque' ? 'Bloquée' : 'Débloquée'}}</span>
                    <button class="btn btn-sm btn-outline-primary" (click)="toggleIpBlock(ip)" class="deblock-btn">
                      <i class="bi bi-{{ip.statut === 'bloque' ? 'unlock' : 'shield-x'}} me-1"></i>
                      {{ip.statut === 'bloque' ? 'Débloquer' : 'Bloquer'}}
                    </button>
                  </div>
                </div>
              }
              @if (blockedIps.length === 0) {
                <div class="empty text-center py-4">
                  <i class="bi bi-shield-check text-success" style="font-size: 48px;"></i>
                  <span class="text-muted d-block mt-2">Aucune IP bloquée</span>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="notifications">
          <div class="tab-content">
            <div class="tab-header">
              <h3>Notifications par Email</h3>
              <button class="btn btn-primary" (click)="saveEmailSettings()">
                <i class="bi bi-save me-2"></i>Enregistrer
              </button>
            </div>

            <div class="card border-0 shadow-sm">
              <div class="card-body">
                <div class="mb-3">
                  <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Email du destinataire</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input type="email" class="form-control" [(ngModel)]="emailSettings.recipientEmail" placeholder="admin@exemple.com">
                  </div>
                </div>

                <h5 class="fw-bold mb-3" style="font-size: 14px; color: #1e293b;">Événements à notifier</h5>

                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                  <div>
                    <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Nouvel utilisateur</div>
                    <div class="text-muted" style="font-size: 11px;">Envoyer un email lors de la création d'un nouvel utilisateur</div>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="emailSettings.newUser" id="newUser">
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                  <div>
                    <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Nouvelle société</div>
                    <div class="text-muted" style="font-size: 11px;">Envoyer un email lors de la création d'une nouvelle société</div>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="emailSettings.newSociete" id="newSociete">
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                  <div>
                    <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Nouvel abonnement</div>
                    <div class="text-muted" style="font-size: 11px;">Envoyer un email lors d'un nouvel abonnement</div>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="emailSettings.newAbonnement" id="newAbonnement">
                  </div>
                </div>

                <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-3">
                  <div>
                    <div class="fw-bold" style="font-size: 13px; color: #1e293b;">Alertes de sécurité</div>
                    <div class="text-muted" style="font-size: 11px;">Envoyer un email en cas d'activité suspecte</div>
                  </div>
                  <div class="form-check form-switch">
                    <input class="form-check-input" type="checkbox" [(ngModel)]="emailSettings.securityAlerts" id="securityAlerts">
                  </div>
                </div>

                <button class="btn btn-outline-primary" (click)="testEmail()">
                  <i class="bi bi-send me-2"></i>Tester l'email
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane fade" id="surveillance">
          <div class="tab-content">
            <h3>Activité en Temps Réel</h3>

            <div class="card monitor-card border-0 shadow-sm">
              <div class="card-body">
                <div class="monitor-header">
                  <h4>Connexions actives</h4>
                  <span class="monitor-value">{{connexionsActives}}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" role="progressbar" [style.width.%]="connexionsActives / 100 * 100"></div>
                </div>
              </div>
            </div>

            <div class="card monitor-card border-0 shadow-sm">
              <div class="card-body">
                <div class="monitor-header">
                  <h4>Requêtes API (/min)</h4>
                  <span class="monitor-value">{{requetesApi}}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar" role="progressbar" [style.width.%]="requetesApi / 200 * 100"></div>
                </div>
              </div>
            </div>

            <div class="card monitor-card border-0 shadow-sm">
              <div class="card-body">
                <div class="monitor-header">
                  <h4>Tentatives de connexion échouées</h4>
                  <span class="monitor-value">{{echecsConnexion}}</span>
                </div>
                <div class="progress" style="height: 8px;">
                  <div class="progress-bar bg-danger" role="progressbar" [style.width.%]="echecsConnexion / 50 * 100"></div>
                </div>
              </div>
            </div>

            <div class="live-activity">
              <h4>Activité récente</h4>
              @for (activity of activities; track activity.id) {
                <div class="activity-item">
                  <i class="bi bi-{{activity.icon}}"></i>
                  <span>{{activity.description}}</span>
                  <span class="activity-time">{{activity.time}}</span>
                </div>
              }
            </div>
          </div>
        </div>
    </div>

    <!-- Block IP Dialog -->
    @if (showBlockDialog) {
      <div class="modal-backdrop" (click)="showBlockDialog = false">
        <div class="card modal-container" (click)="$event.stopPropagation()">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-shield-lock me-2"></i>Bloquer une IP</h5>
            <button class="btn btn-sm btn-light" (click)="showBlockDialog = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="card-body">
            <form (ngSubmit)="submitBlockIp()">
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Adresse IP</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-router"></i>
                  </span>
                  <input type="text" class="form-control" [(ngModel)]="blockIpForm.ip" name="ip" placeholder="192.168.1.100" required>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Raison du blocage</label>
                <div class="input-group">
                  <span class="input-group-text bg-light">
                    <i class="bi bi-card-text"></i>
                  </span>
                  <textarea class="form-control" [(ngModel)]="blockIpForm.raison" name="raison" rows="2" placeholder="Trop de tentatives..." required></textarea>
                </div>
              </div>

              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-light" type="button" (click)="showBlockDialog = false">Annuler</button>
                <button class="btn btn-primary" type="submit" [disabled]="!blockIpForm.ip || !blockIpForm.raison">
                  <i class="bi bi-shield-lock me-2"></i>Bloquer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .sec-container { padding: 24px; }

    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
      border-radius: 12px;
      color: white;
      margin-bottom: 24px;
    }
    .header-icon {
      width: 52px; height: 52px;
      background: rgba(255,255,255,0.2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon mat-icon { font-size: 28px; }
    h1 { margin: 0; font-size: 24px; font-weight: 700; }
    p { margin: 4px 0 0; opacity: 0.8; }

    .sec-tabs { background: white; border-radius: 12px; }
    .tab-content { padding: 24px; }
    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .tab-header h3 { margin: 0; font-size: 18px; font-weight: 600; }
    .header-buttons { display: flex; gap: 8px; }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      border-radius: 12px;
    }
    .stat-icon { font-size: 32px; }
    .stat-icon.critical { color: #c62828; }
    .stat-icon.high { color: #ef6c00; }
    .stat-icon.medium { color: #1976d2; }
    .stat-icon.low { color: #4caf50; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-value { font-size: 24px; font-weight: 700; }
    .stat-label { font-size: 12px; color: #666; }

    .alerts-list { display: flex; flex-direction: column; gap: 12px; }
    .alert-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 10px;
    }
    .alert-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
    .alert-card.critical .alert-icon { background: #ffebee; color: #c62828; }
    .alert-card.high .alert-icon { background: #fff3e0; color: #ef6c00; }
    .alert-card.medium .alert-icon { background: #e3f2fd; color: #1976d2; }
    .alert-card.low .alert-icon { background: #e8f5e9; color: #4caf50; }
    .alert-content { flex: 1; display: flex; flex-direction: column; }
    .alert-content strong { font-size: 14px; font-weight: 600; }
    .alert-content span { font-size: 12px; color: #666; }
    .alert-date { font-size: 12px; color: #888; white-space: nowrap; }

    .chip-critical { background: #ffebee; color: #c62828; }
    .chip-high { background: #fff3e0; color: #ef6c00; }
    .chip-medium { background: #e3f2fd; color: #1976d2; }
    .chip-low { background: #e8f5e9; color: #4caf50; }
    .chip-success { background: #e8f5e9; color: #2e7d32; }
    .chip-warning { background: #fff3e0; color: #ef6c00; }
    .chip-error { background: #ffebee; color: #c62828; }

    .policy-section h4 { margin: 24px 0 16px; font-size: 16px; color: #333; }
    .policy-section h4:first-child { margin-top: 0; }
    .policy-card { padding: 20px; border-radius: 12px; margin-bottom: 16px; }
    .policy-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #eee;
    }
    .policy-item:last-child { border-bottom: none; }
    .policy-info { display: flex; flex-direction: column; gap: 4px; }
    .policy-info strong { font-size: 14px; color: #333; }
    .policy-info span { font-size: 12px; color: #666; }
    .length-input input, .timeout-input input {
      width: 80px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
    }
    .timeout-input { display: flex; align-items: center; gap: 8px; }
    .timeout-input span { font-size: 12px; color: #666; }

    .email-settings-card { padding: 24px; border-radius: 12px; }
    .email-settings-card h4 { margin: 24px 0 16px; font-size: 16px; color: #333; }
    .email-settings-card h4:first-child { margin-top: 0; }
    .test-email-section { margin-top: 24px; padding-top: 20px; border-top: 1px solid #eee; }

    .blocked-list { display: flex; flex-direction: column; gap: 12px; }
    .blocked-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      border-radius: 10px;
    }
    .blocked-icon {
      width: 44px; height: 44px;
      background: #ffebee;
      color: #c62828;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .blocked-content { flex: 1; display: flex; flex-direction: column; }
    .blocked-content strong { font-size: 15px; font-weight: 600; }
    .blocked-content span { font-size: 12px; color: #666; }
    .blocked-date { font-size: 11px; color: #888; }
    .deblock-btn { border-radius: 8px; }

    .monitor-card {
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .monitor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .monitor-header h4 { margin: 0; font-size: 14px; font-weight: 500; }
    .monitor-value { font-size: 20px; font-weight: 700; color: #d32f2f; }

    .live-activity { margin-top: 24px; }
    .live-activity h4 { margin: 0 0 16px; font-size: 14px; font-weight: 600; }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    .activity-item mat-icon { color: #666; }
    .activity-item span { font-size: 13px; }
    .activity-time { margin-left: auto; font-size: 11px; color: #888; }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      color: #888;
    }
    .empty mat-icon { font-size: 48px; margin-bottom: 12px; }

    .chip-blocked { background: #ffebee; color: #c62828; }
    .chip-unblocked { background: #e8f5e9; color: #2e7d32; }

    .dialog-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog-card {
      width: 400px;
      padding: 24px;
      border-radius: 12px;
      background: white;
    }
    .dialog-card h2 {
      margin: 0 0 20px;
      font-size: 20px;
      color: #333;
    }
    .dialog-card h2 mat-icon { color: #d32f2f; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 20px;
    }
  `]
})
export class SuperAdminSecuriteComponent implements OnInit {
  private api = inject(ApiService);

  showBlockDialog = false;
  blockIpForm = { ip: '', raison: '' };
  connexionsActives = 12;
  requetesApi = 45;
  echecsConnexion = 3;

  emailSettings: EmailNotificationSettings = {
    newUser: true,
    newSociete: true,
    newAbonnement: true,
    securityAlerts: true,
    recipientEmail: 'admin@leadertec.com'
  };

  alerts: SecurityAlert[] = [
    { id: 1, type: 'Tentative d\'injection SQL', description: 'Requête suspecte détectée depuis IP 192.168.1.55', date: '03/04/2026 16:35', niveau: 'critical', statut: 'active' },
    { id: 2, type: 'Multiple échecs de connexion', description: '5 tentatives échouées pour utilisateur admin@leadertec.com', date: '03/04/2026 16:25', niveau: 'high', statut: 'investigating' },
    { id: 3, type: 'Nouvelle localisation', description: 'Connexion depuis un nouveau pays: Maroc', date: '03/04/2026 15:20', niveau: 'medium', statut: 'resolved' },
    { id: 4, type: 'Session suspecte', description: 'Session inactive détectée puis réactivée', date: '03/04/2026 14:10', niveau: 'low', statut: 'resolved' }
  ];

  blockedIps: IpBlock[] = [
    { id: 1, ip: '10.0.0.55', raison: 'Trop de tentatives de connexion', dateBlocage: '03/04/2026 16:20', statut: 'bloque' },
    { id: 2, ip: '192.168.1.200', raison: 'Activités suspectes détectées', dateBlocage: '02/04/2026 10:30', statut: 'bloque' }
  ];

  activities = [
    { id: 1, icon: 'login', description: 'Connexion: admin@leadertec.com', time: '16:40' },
    { id: 2, icon: 'api', description: 'API: GET /societes', time: '16:39' },
    { id: 3, icon: 'update', description: 'Mise à jour: Utilisateur USR003', time: '16:38' },
    { id: 4, icon: 'logout', description: 'Déconnexion: test@leadertec.com', time: '16:35' }
  ];

  passwordPolicy: PasswordPolicy = {
    requireUppercase: false,
    requireNumbers: false,
    requireSpecial: false,
    minLength: 4,
    require2FA: false,
    allowSimultaneous: true,
    sessionTimeout: 60
  };

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.passwordPolicy) this.passwordPolicy = storage.passwordPolicy;
      if (storage.emailSettings) this.emailSettings = storage.emailSettings;
      if (storage.securityAlerts && storage.securityAlerts.length > 0) this.alerts = storage.securityAlerts;
      if (storage.blockedIps && storage.blockedIps.length > 0) this.blockedIps = storage.blockedIps;
      if (storage.activities && storage.activities.length > 0) this.activities = storage.activities;
    }
  }

  saveAllData() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.passwordPolicy = this.passwordPolicy;
    storage.emailSettings = this.emailSettings;
    storage.securityAlerts = this.alerts;
    storage.blockedIps = this.blockedIps;
    storage.activities = this.activities;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  loadPolicy() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.passwordPolicy) {
        this.passwordPolicy = storage.passwordPolicy;
      }
    }
  }

  savePolicy() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.passwordPolicy = this.passwordPolicy;
    localStorage.setItem('app_data', JSON.stringify(storage));
    alert('Politique de sécurité enregistrée');
  }

  loadEmailSettings() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.emailSettings) {
        this.emailSettings = storage.emailSettings;
      }
    }
  }

  saveEmailSettings() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.emailSettings = this.emailSettings;
    localStorage.setItem('app_data', JSON.stringify(storage));
    alert('Paramètres d\'email enregistrés');
  }

  saveBlockedIps() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.blockedIps = this.blockedIps;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  addBlockedIp(ip: string, raison: string) {
    const newBlock: IpBlock = {
      id: Date.now(),
      ip: ip,
      raison: raison,
      dateBlocage: new Date().toLocaleString('fr-FR'),
      statut: 'bloque'
    };
    this.blockedIps.push(newBlock);
    this.saveBlockedIps();
    alert('IP ' + ip + ' bloquée');
  }

  createAlert(type: string, description: string, niveau: 'critical' | 'high' | 'medium' | 'low') {
    const newAlert: SecurityAlert = {
      id: Date.now(),
      type: type,
      description: description,
      date: new Date().toLocaleString('fr-FR'),
      niveau: niveau,
      statut: 'active'
    };
    this.alerts.unshift(newAlert);
    this.saveAlerts();
    if (this.emailSettings.securityAlerts) {
      this.triggerSecurityAlert(type, description, niveau);
    }
  }

  updateActivity() {
    const user = this.api.getCurrentUser();
    const newActivity = {
      id: Date.now(),
      icon: 'refresh',
      description: 'Actualisation du tableau de bord',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    this.activities.unshift(newActivity);
    if (this.activities.length > 10) this.activities.pop();
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.activities = this.activities;
    localStorage.setItem('app_data', JSON.stringify(storage));
  }

  testEmail() {
    if (!this.emailSettings.recipientEmail) {
      alert('Veuillez entrer une adresse email');
      return;
    }
    this.api.sendTestEmail(this.emailSettings.recipientEmail).subscribe({
      next: (res: any) => {
        if (res.success) {
          alert('Email de test envoyé à ' + this.emailSettings.recipientEmail);
        } else {
          alert('Échec de l\'envoi de l\'email');
        }
      },
      error: () => {
        alert('Erreur lors de l\'envoi de l\'email (API non disponible)');
      }
    });
  }

  triggerSecurityAlert(type: string, description: string, niveau: 'critical' | 'high' | 'medium' | 'low') {
    const alert: SecurityAlert = {
      id: Date.now(),
      type: type,
      description: description,
      date: new Date().toLocaleString('fr-FR'),
      niveau: niveau,
      statut: 'active'
    };
    this.alerts.unshift(alert);
    this.api.sendEmailNotification('securityAlerts', {
      type: type,
      description: description,
      niveau: niveau,
      timestamp: new Date().toISOString()
    });
    window.alert('Alerte de sécurité: ' + type);
  }

  getEmailSettings(): EmailNotificationSettings {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      return storage.emailSettings || this.emailSettings;
    }
    return this.emailSettings;
  }

  getCriticalCount() { return this.alerts.filter(a => a.niveau === 'critical' && a.statut !== 'resolved').length; }
  getHighCount() { return this.alerts.filter(a => a.niveau === 'high' && a.statut !== 'resolved').length; }
  getMediumCount() { return this.alerts.filter(a => a.niveau === 'medium' && a.statut !== 'resolved').length; }
  getLowCount() { return this.alerts.filter(a => a.niveau === 'low' && a.statut !== 'resolved').length; }

  refreshAlerts() {
    this.loadAllData();
    alert('Alertes actualisées');
  }

  saveAlerts() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.securityAlerts = this.alerts;
    localStorage.setItem('app_data', JSON.stringify(storage));
    alert('Alertes enregistrées');
  }

  deblockIp(ip: IpBlock) {
    ip.statut = 'debloque';
    this.saveBlockedIps();
    alert('IP ' + ip.ip + ' débloquée');
  }

  toggleIpBlock(ip: IpBlock) {
    ip.statut = ip.statut === 'bloque' ? 'debloque' : 'bloque';
    this.saveBlockedIps();
    alert('IP ' + ip.ip + (ip.statut === 'bloque' ? ' bloquée' : ' débloquée'));
  }

  openBlockDialog() {
    this.blockIpForm = { ip: '', raison: '' };
    this.showBlockDialog = true;
  }

  submitBlockIp() {
    if (this.blockIpForm.ip && this.blockIpForm.raison) {
      this.addBlockedIp(this.blockIpForm.ip, this.blockIpForm.raison);
      this.showBlockDialog = false;
    }
  }

  clearSecurityData() {
    if (confirm('Voulez-vous effacer toutes les données de sécurité?')) {
      this.passwordPolicy = {
        requireUppercase: false,
        requireNumbers: false,
        requireSpecial: false,
        minLength: 4,
        require2FA: false,
        allowSimultaneous: true,
        sessionTimeout: 60
      };
      this.emailSettings = {
        newUser: true,
        newSociete: true,
        newAbonnement: true,
        securityAlerts: true,
        recipientEmail: ''
      };
      this.blockedIps = [];
      this.alerts = [];
      this.saveAllData();
      alert('Données de sécurité effacées');
    }
  }
}
