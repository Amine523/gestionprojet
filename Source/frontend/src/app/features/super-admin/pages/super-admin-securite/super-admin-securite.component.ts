import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Sécurité</span>
          </div>
          <h1 class="header-title">
            Sécurité <span class="gradient-text">& Surveillance.</span>
          </h1>
          <p class="header-subtitle">
            Protection et surveillance de la plateforme.
          </p>
        </div>
      </header>

      <!-- Tabs -->
      <div class="tabs-container">
        <button class="tab-btn" [class.active]="activeTab === 'alertes'" (click)="activeTab = 'alertes'">
          Alertes
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'politique'" (click)="activeTab = 'politique'">
          Politique
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'ips'" (click)="activeTab = 'ips'">
          IPs Bloquées
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'notifications'" (click)="activeTab = 'notifications'">
          Notifications
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'surveillance'" (click)="activeTab = 'surveillance'">
          Surveillance Temps Réel
        </button>
      </div>

      <!-- Content -->
      @if (activeTab === 'alertes') {
        <div class="tab-content">
          <div class="tab-header">
            <h3>Alertes de Sécurité</h3>
            <button class="btn btn-secondary" (click)="refreshAlerts()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 4v6h-6"/>
                <path d="M1 20v-6h6"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              Actualiser
            </button>
          </div>

          <div class="stats-grid">
            <div class="card stat-card critical">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{getCriticalCount()}}</span>
                <span class="stat-label">Critiques</span>
              </div>
            </div>
            <div class="card stat-card high">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{getHighCount()}}</span>
                <span class="stat-label">Élevées</span>
              </div>
            </div>
            <div class="card stat-card medium">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="16" x2="12" y2="12"/>
                <line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{getMediumCount()}}</span>
                <span class="stat-label">Moyennes</span>
              </div>
            </div>
            <div class="card stat-card low">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <div class="stat-info">
                <span class="stat-value">{{getLowCount()}}</span>
                <span class="stat-label">Basses</span>
              </div>
            </div>
          </div>

          <div class="alerts-list">
            @for (alert of alerts; track alert.id) {
              <div class="card alert-card" [class.critical]="alert.niveau === 'critical'" [class.high]="alert.niveau === 'high'" [class.medium]="alert.niveau === 'medium'" [class.low]="alert.niveau === 'low'">
                <div class="alert-icon" [class.critical]="alert.niveau === 'critical'" [class.high]="alert.niveau === 'high'" [class.medium]="alert.niveau === 'medium'" [class.low]="alert.niveau === 'low'">
                  @if (alert.niveau === 'critical') {
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  } @else if (alert.niveau === 'high') {
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  } @else if (alert.niveau === 'medium') {
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  } @else {
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  }
                </div>
                <div class="alert-content">
                  <strong>{{alert.type}}</strong>
                  <span>{{alert.description}}</span>
                </div>
                <span class="badge" [class.critical]="alert.niveau === 'critical'" [class.high]="alert.niveau === 'high'" [class.medium]="alert.niveau === 'medium'" [class.low]="alert.niveau === 'low'">{{alert.niveau}}</span>
                <span class="badge" [class.resolved]="alert.statut === 'resolved'" [class.investigating]="alert.statut === 'investigating'" [class.active]="alert.statut === 'active'">{{alert.statut === 'active' ? 'Active' : alert.statut === 'investigating' ? 'En cours' : 'Résolu'}}</span>
                <span class="alert-date">{{alert.date}}</span>
              </div>
            }
          </div>
        </div>
      }

      @if (activeTab === 'politique') {
        <div class="tab-content">
          <div class="tab-header">
            <h3>Politique de Sécurité</h3>
            <div class="header-buttons">
              <button class="btn btn-danger" (click)="clearSecurityData()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Effacer
              </button>
              <button class="btn btn-primary" (click)="savePolicy()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/>
                  <polyline points="7 3 7 8 15 8"/>
                </svg>
                Enregistrer
              </button>
            </div>
          </div>

          <div class="policy-section">
            <h4>Politique de mot de passe</h4>
            <div class="card">
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Exiger majuscules</strong>
                  <span>Le mot de passe doit contenir au moins une lettre majuscule</span>
                </div>
                <button class="toggle-btn" [class.active]="passwordPolicy.requireUppercase" (click)="passwordPolicy.requireUppercase = !passwordPolicy.requireUppercase">
                  <span class="toggle-knob"></span>
                </button>
              </div>
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Exiger chiffres</strong>
                  <span>Le mot de passe doit contenir au moins un chiffre</span>
                </div>
                <button class="toggle-btn" [class.active]="passwordPolicy.requireNumbers" (click)="passwordPolicy.requireNumbers = !passwordPolicy.requireNumbers">
                  <span class="toggle-knob"></span>
                </button>
              </div>
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Exiger caractères spéciaux</strong>
                  <span>Le mot de passe doit contenir un caractère spécial</span>
                </div>
                <button class="toggle-btn" [class.active]="passwordPolicy.requireSpecial" (click)="passwordPolicy.requireSpecial = !passwordPolicy.requireSpecial">
                  <span class="toggle-knob"></span>
                </button>
              </div>
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Longueur minimale</strong>
                  <span>Nombre minimum de caractères: {{passwordPolicy.minLength}} caractères</span>
                </div>
                <input type="number" class="form-input" [(ngModel)]="passwordPolicy.minLength" name="minLength" min="4" max="32">
              </div>
            </div>

            <h4>Authentification</h4>
            <div class="card">
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Authentification à deux facteurs (2FA)</strong>
                  <span>Exiger 2FA pour tous les utilisateurs</span>
                </div>
                <button class="toggle-btn" [class.active]="passwordPolicy.require2FA" (click)="passwordPolicy.require2FA = !passwordPolicy.require2FA">
                  <span class="toggle-knob"></span>
                </button>
              </div>
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Sessions simultanées</strong>
                  <span>Autoriser plusieurs connexions simultanées</span>
                </div>
                <button class="toggle-btn" [class.active]="passwordPolicy.allowSimultaneous" (click)="passwordPolicy.allowSimultaneous = !passwordPolicy.allowSimultaneous">
                  <span class="toggle-knob"></span>
                </button>
              </div>
              <div class="policy-item">
                <div class="policy-info">
                  <strong>Délai d'expiration de session</strong>
                  <span>Minutes avant déconnexion automatique: {{passwordPolicy.sessionTimeout}} min</span>
                </div>
                <div class="timeout-input">
                  <input type="number" class="form-input" [(ngModel)]="passwordPolicy.sessionTimeout" name="sessionTimeout" min="5" max="120">
                  <span>minutes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      @if (activeTab === 'ips') {
        <div class="tab-content">
          <div class="tab-header">
            <h3>Adresses IP Bloquées</h3>
            <button class="btn btn-primary" (click)="openBlockDialog()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Bloquer IP
            </button>
          </div>

          <div class="blocked-list">
            @for (ip of blockedIps; track ip.id) {
              <div class="card blocked-card">
                <div class="blocked-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div class="blocked-content">
                  <strong>{{ip.ip}}</strong>
                  <span>{{ip.raison}}</span>
                  <span class="blocked-date">Bloqué le: {{ip.dateBlocage}}</span>
                </div>
                <span class="badge" [class.blocked]="ip.statut === 'bloque'" [class.unblocked]="ip.statut !== 'bloque'">{{ip.statut === 'bloque' ? 'Bloquée' : 'Débloquée'}}</span>
                <button class="btn btn-secondary" (click)="toggleIpBlock(ip)">
                  @if (ip.statut === 'bloque') {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  } @else {
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="8" y="7" width="10" height="10" rx="2" ry="2"/>
                      <path d="M9 7V5a5 5 0 0 1 8 0v2"/>
                    </svg>
                  }
                  {{ip.statut === 'bloque' ? 'Débloquer' : 'Bloquer'}}
                </button>
              </div>
            }
            @if (blockedIps.length === 0) {
              <div class="empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="M9 12l2 2 4-4"/>
                </svg>
                <span>Aucune IP bloquée</span>
              </div>
            }
          </div>
        </div>
      }

      @if (activeTab === 'notifications') {
        <div class="tab-content">
          <div class="tab-header">
            <h3>Notifications par Email</h3>
            <button class="btn btn-primary" (click)="saveEmailSettings()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Enregistrer
            </button>
          </div>

          <div class="card">
            <div class="form-field">
              <label>Email du destinataire</label>
              <div class="input-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input type="email" class="form-input" [(ngModel)]="emailSettings.recipientEmail" name="recipientEmail" placeholder="admin@exemple.com">
              </div>
            </div>

            <h4>Événements à notifier</h4>
            <div class="policy-item">
              <div class="policy-info">
                <strong>Nouvel utilisateur</strong>
                <span>Envoyer un email lors de la création d'un nouvel utilisateur</span>
              </div>
              <button class="toggle-btn" [class.active]="emailSettings.newUser" (click)="emailSettings.newUser = !emailSettings.newUser">
                <span class="toggle-knob"></span>
              </button>
            </div>
            <div class="policy-item">
              <div class="policy-info">
                <strong>Nouvelle société</strong>
                <span>Envoyer un email lors de la création d'une nouvelle société</span>
              </div>
              <button class="toggle-btn" [class.active]="emailSettings.newSociete" (click)="emailSettings.newSociete = !emailSettings.newSociete">
                <span class="toggle-knob"></span>
              </button>
            </div>
            <div class="policy-item">
              <div class="policy-info">
                <strong>Nouvel abonnement</strong>
                <span>Envoyer un email lors d'un nouvel abonnement</span>
              </div>
              <button class="toggle-btn" [class.active]="emailSettings.newAbonnement" (click)="emailSettings.newAbonnement = !emailSettings.newAbonnement">
                <span class="toggle-knob"></span>
              </button>
            </div>
            <div class="policy-item">
              <div class="policy-info">
                <strong>Alertes de sécurité</strong>
                <span>Envoyer un email en cas d'activité suspecte</span>
              </div>
              <button class="toggle-btn" [class.active]="emailSettings.securityAlerts" (click)="emailSettings.securityAlerts = !emailSettings.securityAlerts">
                <span class="toggle-knob"></span>
              </button>
            </div>

            <button class="btn btn-secondary" (click)="testEmail()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/>
                <polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
              Tester l'email
            </button>
          </div>
        </div>
      }

      @if (activeTab === 'surveillance') {
        <div class="tab-content">
          <h3>Activité en Temps Réel</h3>

          <div class="card monitor-card">
            <div class="monitor-header">
              <h4>Connexions actives</h4>
              <span class="monitor-value">{{connexionsActives}}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="connexionsActives"></div>
            </div>
          </div>

          <div class="card monitor-card">
            <div class="monitor-header">
              <h4>Requêtes API (/min)</h4>
              <span class="monitor-value">{{requetesApi}}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="requetesApi / 2"></div>
            </div>
          </div>

          <div class="card monitor-card">
            <div class="monitor-header">
              <h4>Tentatives de connexion échouées</h4>
              <span class="monitor-value text-danger">{{echecsConnexion}}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill danger" [style.width.%]="echecsConnexion * 2"></div>
            </div>
          </div>

          <div class="live-activity">
            <h4>Activité récente</h4>
            @for (activity of activities; track activity.id) {
              <div class="activity-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>{{activity.description}}</span>
                <span class="activity-time">{{activity.time}}</span>
              </div>
            }
          </div>
        </div>
      }
    </div>

    <!-- Block IP Dialog -->
    @if (showBlockDialog) {
      <div class="modal-backdrop" (click)="showBlockDialog = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Bloquer une IP</h3>
            <button class="btn-icon" (click)="showBlockDialog = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form (ngSubmit)="submitBlockIp()">
            <div class="form-field">
              <label>Adresse IP</label>
              <div class="input-with-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
                <input type="text" class="form-input" [(ngModel)]="blockIpForm.ip" name="ip" placeholder="192.168.1.100" required>
              </div>
            </div>
            <div class="form-field">
              <label>Raison du blocage</label>
              <textarea class="form-input" [(ngModel)]="blockIpForm.raison" name="raison" rows="2" placeholder="Trop de tentatives..." required></textarea>
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" type="button" (click)="showBlockDialog = false">Annuler</button>
              <button class="btn btn-primary" type="submit" [disabled]="!blockIpForm.ip || !blockIpForm.raison">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Bloquer
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .badge.critical {
      background: #ef4444;
      color: white;
      border: none;
    }

    .badge.high {
      background: #f97316;
      color: white;
      border: none;
    }

    .badge.medium {
      background: #3b82f6;
      color: white;
      border: none;
    }

    .badge.low {
      background: #10b981;
      color: white;
      border: none;
    }

    .badge.resolved {
      background: #10b981;
      color: white;
      border: none;
    }

    .badge.investigating {
      background: #f97316;
      color: white;
      border: none;
    }

    .badge.active {
      background: #ef4444;
      color: white;
      border: none;
    }

    .badge.blocked {
      background: #ef4444;
      color: white;
      border: none;
    }

    .badge.unblocked {
      background: #10b981;
      color: white;
      border: none;
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fca5a5, #f87171, #ef4444);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .tabs-container {
      display: flex;
      gap: var(--space-xs);
      background: white;
      border-radius: var(--radius-lg);
      padding: var(--space-xs);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .tab-btn {
      flex: 1;
      padding: var(--space-sm) var(--space-md);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .tab-btn:hover {
      background: var(--color-bg);
    }

    .tab-btn.active {
      background: #ef4444;
      color: white;
    }

    .tab-content {
      padding: var(--space-lg);
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .tab-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .header-buttons {
      display: flex;
      gap: var(--space-sm);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-md);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .stat-card.critical {
      background: rgba(239, 68, 68, 0.05);
      border-color: rgba(239, 68, 68, 0.2);
    }

    .stat-card.critical svg {
      color: #ef4444;
    }

    .stat-card.high {
      background: rgba(249, 115, 22, 0.05);
      border-color: rgba(249, 115, 22, 0.2);
    }

    .stat-card.high svg {
      color: #f97316;
    }

    .stat-card.medium {
      background: rgba(59, 130, 246, 0.05);
      border-color: rgba(59, 130, 246, 0.2);
    }

    .stat-card.medium svg {
      color: #3b82f6;
    }

    .stat-card.low {
      background: rgba(16, 185, 129, 0.05);
      border-color: rgba(16, 185, 129, 0.2);
    }

    .stat-card.low svg {
      color: #10b981;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .alert-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .alert-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .alert-card.critical .alert-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .alert-card.high .alert-icon {
      background: rgba(249, 115, 22, 0.1);
      color: #f97316;
    }

    .alert-card.medium .alert-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .alert-card.low .alert-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .alert-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .alert-content strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .alert-content span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .alert-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      white-space: nowrap;
    }

    .policy-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .policy-section h4 {
      margin: 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .policy-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .policy-item:last-child {
      border-bottom: none;
    }

    .policy-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .policy-info strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .policy-info span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .toggle-btn {
      width: 48px;
      height: 24px;
      background: #d1d5db;
      border-radius: 12px;
      position: relative;
      cursor: pointer;
      transition: background var(--transition-base);
      border: none;
    }

    .toggle-btn.active {
      background: #10b981;
    }

    .toggle-knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      box-shadow: var(--shadow-sm);
      transition: transform var(--transition-base);
    }

    .toggle-btn.active .toggle-knob {
      transform: translateX(24px);
    }

    .form-input {
      width: 80px;
      padding: var(--space-sm);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(239, 68, 68, 0.3);
    }

    .timeout-input {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
    }

    .timeout-input span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .blocked-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .blocked-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .blocked-icon {
      width: 48px;
      height: 48px;
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .blocked-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .blocked-content strong {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .blocked-content span {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .blocked-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--space-3xl) 0;
      color: var(--color-text-muted);
    }

    .empty-state svg {
      margin: 0 auto var(--space-lg);
      color: #10b981;
    }

    .empty-state span {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
    }

    .monitor-card {
      margin-bottom: var(--space-md);
    }

    .monitor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .monitor-header h4 {
      margin: 0;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .monitor-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: #ef4444;
    }

    .monitor-value.text-danger {
      color: #ef4444;
    }

    .progress-bar {
      height: 8px;
      background: var(--color-bg);
      border-radius: 4px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #ef4444, #f97316);
      border-radius: 4px;
      transition: width var(--transition-base);
    }

    .progress-fill.danger {
      background: #ef4444;
    }

    .live-activity {
      margin-top: var(--space-lg);
    }

    .live-activity h4 {
      margin: 0 0 var(--space-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md) 0;
      border-bottom: 1px solid var(--color-border);
    }

    .activity-item svg {
      color: var(--color-text-muted);
    }

    .activity-item span {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .activity-time {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .form-field {
      margin-bottom: var(--space-md);
    }

    .form-field label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .input-with-icon {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
    }

    .input-with-icon svg {
      color: var(--color-text-muted);
    }

    .input-with-icon .form-input {
      flex: 1;
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .modal-container {
      width: 400px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-icon:hover {
      background: var(--color-bg);
    }

    .modal-container form {
      padding: var(--space-lg);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      margin-top: var(--space-lg);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: #10b981;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    /* Dark mode */
    :host-context(.dark) .tabs-container {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tab-btn {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .tab-btn:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .modal-header {
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .modal-container {
        width: 90%;
      }
    }
  `]
})
export class SuperAdminSecuriteComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  activeTab = 'alertes';
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

  loading = false;

  ngOnInit() {
    this.loadAllData();
  }

  loadAllData() {
    this.loading = true;
    
    forkJoin({
      societes: this.api.getSocietes(),
      users: this.api.getUtilisateurs(),
      activities: this.api.getGlobalActivities(20),
      blockedIps: this.api.getBlockedIps()
    }).pipe(
      catchError(() => of({ societes: [], users: [], activities: [], blockedIps: [] }))
    ).subscribe((res: any) => {
      // 1. Activités réelles
      if (res.activities && res.activities.length > 0) {
        this.activities = res.activities.map((a: any) => ({
          id: a.id,
          description: a.description || a.action,
          time: new Date(a.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
          icon: this.getIconForType(a.type)
        }));
      }

      // 2. IPs Bloquées réelles
      if (res.blockedIps && res.blockedIps.length > 0) {
        this.blockedIps = res.blockedIps.map((ip: any) => ({
          id: ip.id || ip.Id,
          ip: ip.ipAddress || ip.IpAddress,
          raison: ip.reason || ip.Reason,
          dateBlocage: new Date(ip.blockedAt || ip.BlockedAt).toLocaleString('fr-FR'),
          statut: 'bloque'
        }));
      }

      // 3. Alertes dynamiques basées sur le système
      this.generateDynamicAlerts(res.societes, res.users);

      // 4. Stats Surveillance
      this.connexionsActives = Math.max(5, Math.floor(res.users.length * 0.15));
      this.requetesApi = 45 + Math.floor(Math.random() * 30);
      this.echecsConnexion = Math.floor(Math.random() * 5);
      
      this.loading = false;
    });

    this.loadFromStorage();
  }

  private loadFromStorage() {
    const data = localStorage.getItem('app_data');
    if (data) {
      const storage = JSON.parse(data);
      if (storage.passwordPolicy) this.passwordPolicy = storage.passwordPolicy;
      if (storage.emailSettings) this.emailSettings = storage.emailSettings;
      if (storage.blockedIps) this.blockedIps = storage.blockedIps;
      // On ne surcharge pas alerts et activities s'ils viennent de l'API
    }
  }

  private generateDynamicAlerts(societes: any[], users: any[]) {
    const newAlerts: SecurityAlert[] = [];
    
    // Alerte: Sociétés en attente
    const pendingSocietes = societes.filter(s => (s.status || s.Statut) === 'EN_ATTENTE' || (s.actif === false));
    if (pendingSocietes.length > 0) {
      newAlerts.push({
        id: 101,
        type: 'Approbation Requise',
        description: `${pendingSocietes.length} sociétés en attente de validation.`,
        date: new Date().toLocaleDateString(),
        niveau: 'high',
        statut: 'active'
      });
    }

    // Alerte: Nouveau volume d'utilisateurs
    if (users.length > 50) {
      newAlerts.push({
        id: 102,
        type: 'Charge Système',
        description: `Volume d'utilisateurs élevé détecté (${users.length} comptes).`,
        date: new Date().toLocaleDateString(),
        niveau: 'medium',
        statut: 'active'
      });
    }

    // Fusionner avec les alertes existantes (manuelles)
    this.alerts = [...newAlerts, ...this.alerts.filter(a => a.id < 100)];
  }

  private getIconForType(type: string): string {
    switch (type?.toLowerCase()) {
      case 'auth': return 'lock';
      case 'rh': return 'people';
      case 'projet': return 'folder';
      default: return 'activity';
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
    this.snackBar.open('Politique de sécurité enregistrée', 'Fermer', { duration: 3000 });
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
    this.snackBar.open('Paramètres d\'email enregistrés', 'Fermer', { duration: 3000 });
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
    
    this.api.blockIp({ ipAddress: ip, raison: raison }).subscribe({
      next: () => {
        this.blockedIps.push(newBlock);
        this.saveBlockedIps();
        this.snackBar.open('IP ' + ip + ' bloquée', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur lors du blocage de l\'IP', 'Fermer', { duration: 3000 })
    });
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
      this.snackBar.open('Veuillez entrer une adresse email', 'Fermer', { duration: 3000 });
      return;
    }
    this.api.sendTestEmail(this.emailSettings.recipientEmail).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.snackBar.open('Email de test envoyé à ' + this.emailSettings.recipientEmail, 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Échec de l\'envoi de l\'email', 'Fermer', { duration: 3000 });
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'envoi de l\'email (API non disponible)', 'Fermer', { duration: 3000 });
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
    this.snackBar.open('Alerte de sécurité: ' + type, 'Fermer', { duration: 3000 });
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
    this.snackBar.open('Alertes actualisées', 'Fermer', { duration: 3000 });
  }

  saveAlerts() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    storage.securityAlerts = this.alerts;
    localStorage.setItem('app_data', JSON.stringify(storage));
    this.snackBar.open('Alertes enregistrées', 'Fermer', { duration: 3000 });
  }

  deblockIp(ip: IpBlock) {
    this.api.unblockIp(ip.id.toString()).subscribe({
      next: () => {
        ip.statut = 'debloque';
        this.saveBlockedIps();
        this.snackBar.open('IP ' + ip.ip + ' débloquée', 'Fermer', { duration: 3000 });
      },
      error: () => this.snackBar.open('Erreur lors du déblocage', 'Fermer', { duration: 3000 })
    });
  }
 
  toggleIpBlock(ip: IpBlock) {
    const newStatut = ip.statut === 'bloque' ? 'debloque' : 'bloque';
    if (newStatut === 'debloque') {
      this.api.unblockIp(ip.id.toString()).subscribe({
        next: () => {
          ip.statut = 'debloque';
          this.saveBlockedIps();
          this.snackBar.open('IP ' + ip.ip + ' débloquée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du déblocage', 'Fermer', { duration: 3000 })
      });
    } else {
      this.api.blockIp({ ipAddress: ip.ip, raison: ip.raison }).subscribe({
        next: () => {
          ip.statut = 'bloque';
          this.saveBlockedIps();
          this.snackBar.open('IP ' + ip.ip + ' bloquée', 'Fermer', { duration: 3000 });
        },
        error: () => this.snackBar.open('Erreur lors du blocage', 'Fermer', { duration: 3000 })
      });
    }
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
      this.snackBar.open('Données de sécurité effacées', 'Fermer', { duration: 3000 });
    }
  }
}

