import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';

interface Permission {
  id: string;
  nom: string;
  moduleId: string;
  moduleNom: string;
  selected: boolean;
}

interface RoleData {
  id: string;
  nom: string;
  description: string;
  actif: boolean;
  permissions: Permission[];
  expanded?: boolean;
}

const ALL_PERMISSIONS: Permission[] = [
  { id: 'soc.lire', nom: 'Voir sociétés', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.creer', nom: 'Créer société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.modifier', nom: 'Modifier société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.supprimer', nom: 'Supprimer société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'usr.lire', nom: 'Voir utilisateurs', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.creer', nom: 'Créer utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.modifier', nom: 'Modifier utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.supprimer', nom: 'Supprimer utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'prj.lire', nom: 'Voir projets', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.creer', nom: 'Créer projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.modifier', nom: 'Modifier projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.supprimer', nom: 'Supprimer projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'tsk.lire', nom: 'Voir tâches', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.creer', nom: 'Créer tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.modifier', nom: 'Modifier tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.supprimer', nom: 'Supprimer tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'rh.lire', nom: 'Voir RH', moduleId: 'rh', moduleNom: 'RH', selected: false },
  { id: 'rh.conges', nom: 'Gérer congés', moduleId: 'rh', moduleNom: 'RH', selected: false },
  { id: 'rh.pointages', nom: 'Gérer pointages', moduleId: 'rh', moduleNom: 'RH', selected: false },
  { id: 'rec.lire', nom: 'Voir offres', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  { id: 'rec.creer', nom: 'Créer offre', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  { id: 'rec.candidatures', nom: 'Gérer candidatures', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  { id: 'dash.lire', nom: 'Voir tableau de bord', moduleId: 'dash', moduleNom: 'Dashboard', selected: false },
  { id: 'dash.stats', nom: 'Voir statistiques', moduleId: 'dash', moduleNom: 'Dashboard', selected: false },
  { id: 'param.lire', nom: 'Voir paramètres', moduleId: 'param', moduleNom: 'Paramètres', selected: false },
  { id: 'param.modifier', nom: 'Modifier paramètres', moduleId: 'param', moduleNom: 'Paramètres', selected: false },
];

const ROLE_PERMISSIONS: { [key: string]: string[] } = {
  'T001': ['soc.lire','soc.creer','soc.modifier','soc.supprimer','usr.lire','usr.creer','usr.modifier','usr.supprimer','prj.lire','prj.creer','prj.modifier','prj.supprimer','tsk.lire','tsk.creer','tsk.modifier','tsk.supprimer','rh.lire','rh.conges','rh.pointages','rec.lire','rec.creer','rec.candidatures','dash.lire','dash.stats','param.lire','param.modifier'],
  'T002': ['soc.lire','soc.modifier','usr.lire','usr.creer','usr.modifier','prj.lire','prj.creer','prj.modifier','tsk.lire','tsk.creer','rh.lire','rh.conges','rh.pointages','rec.lire','rec.creer','rec.candidatures','dash.lire','dash.stats','param.lire','param.modifier'],
  'T003': ['usr.lire','rh.lire','rh.conges','rh.pointages','rec.lire','rec.creer','rec.candidatures','dash.lire'],
  'T004': ['prj.lire','prj.creer','prj.modifier','tsk.lire','tsk.creer','tsk.modifier','tsk.supprimer','usr.lire','dash.lire','dash.stats'],
  'T005': ['prj.lire','tsk.lire','tsk.creer','tsk.modifier','dash.lire'],
  'T006': ['prj.lire','tsk.lire','tsk.modifier','dash.lire'],
  'T007': ['rec.lire'],
};

@Component({
  selector: 'app-super-admin-roles',
  standalone: true,
  imports: [

    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatChipsModule, MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatDialogModule
  ],
  template: `
    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Contrôle d'Accès RBAC</span>
          </div>
          <h1 class="header-title">
            Gestion des <span class="gradient-text">Rôles.</span>
          </h1>
          <p class="header-subtitle">
            Définition des privilèges et matrice de sécurité globale.
          </p>
        </div>
        <div class="header-actions">
          <div class="stats-card">
            <div class="stat-item">
              <p class="stat-label">Rôles</p>
              <p class="stat-value">{{roles.length}}</p>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <p class="stat-label">Permissions</p>
              <p class="stat-value text-primary">{{allPermissions.length}}</p>
            </div>
          </div>
        </div>
      </header>

      <!-- Roles Matrix -->
      <div class="roles-grid">
        @for (role of roles; track role.id) {
          <div class="role-card" [class.expanded]="role.expanded">
             <div class="role-header">
                <div class="role-info">
                  <div class="role-icon" [style.background]="getRoleColor(role.id)">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (role.id === 'T001') {
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      } @else if (role.id === 'T002') {
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      } @else if (role.id === 'T003') {
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      } @else if (role.id === 'T004') {
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="8.5" cy="7" r="4"/>
                        <polyline points="17 11 19 13 23 9"/>
                      } @else if (role.id === 'T005') {
                        <polyline points="4 17 10 11 4 5"/>
                        <line x1="12" y1="19" x2="20" y2="19"/>
                      } @else if (role.id === 'T006') {
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      } @else {
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M12 6v6l4 2"/>
                      }
                    </svg>
                  </div>
                  <div>
                    <h3 class="role-name">{{role.nom}}</h3>
                    <span class="role-id">{{role.id}}</span>
                  </div>
                </div>
                <div class="role-actions">
                  <button (click)="toggleRoleActif(role, { checked: !role.actif })" class="toggle-btn" [class.active]="role.actif">
                    <span class="toggle-knob"></span>
                  </button>
                  <button (click)="toggleRoleExpand(role)" class="btn-icon btn-ghost">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (role.expanded) {
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      } @else {
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      }
                    </svg>
                  </button>
                </div>
             </div>

             @if (!role.expanded) {
               <div class="role-summary">
                  <p class="role-description">{{role.description}}</p>
                  <div class="role-modules">
                    @for (mod of getActiveModules(role); track mod) {
                      <span class="module-badge">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="12" cy="12" r="3"/>
                          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        {{mod}}
                      </span>
                    }
                  </div>
                  <div class="role-stats">
                    <span class="stats-label">{{getEnabledCount(role)}} permissions activées</span>
                  </div>
               </div>
             }

             @if (role.expanded) {
               <div class="role-permissions">
                  <div class="permissions-grid">
                    @for (moduleGroup of getPermissionsByModule(role.permissions); track moduleGroup.name) {
                      <div class="permission-group">
                        <div class="permission-group-header">
                          <h4 class="module-name">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <circle cx="12" cy="12" r="3"/>
                              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                            {{moduleGroup.name}}
                          </h4>
                          <button (click)="toggleModule(role, moduleGroup)" class="text-xs font-black uppercase tracking-widest text-primary">Basculer</button>
                        </div>
                        <div class="permissions-list">
                          @for (perm of moduleGroup.permissions; track perm.id) {
                            <div (click)="togglePermission(role, perm)" class="permission-item" [class.selected]="perm.selected">
                              <span class="permission-name" [class.selected]="perm.selected">{{perm.nom}}</span>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [class.text-primary]="perm.selected" [class.text-muted]="!perm.selected">
                                @if (perm.selected) {
                                  <polyline points="20 6 9 17 4 12"/>
                                } @else {
                                  <circle cx="12" cy="12" r="10"/>
                                }
                              </svg>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                  
                  <div class="role-footer">
                    <button (click)="role.expanded = false" class="btn btn-ghost">Fermer</button>
                    <button (click)="savePermissions(role)" class="btn btn-primary">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                        <polyline points="17 21 17 13 7 13 7 21"/>
                        <polyline points="7 3 7 8 15 8"/>
                      </svg>
                      ENREGISTRER LA MATRICE
                    </button>
                  </div>
               </div>
             }
          </div>
        }
      </div>
    </div>
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
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--space-lg);
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
      background: radial-gradient(circle, rgba(244, 63, 94, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      flex: 1;
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
      background: rgba(244, 63, 94, 0.1);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #fb7185, #f97316, #f59e0b);
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

    .header-actions {
      position: relative;
      z-index: 1;
    }

    .stats-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-lg);
      padding: var(--space-md);
      border: 1px solid rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      gap: var(--space-lg);
      color: white;
    }

    .stat-item {
      text-align: center;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0 0 var(--space-xs);
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .text-primary {
      color: #f43f5e;
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
    }

    .roles-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-lg);
    }

    .role-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .role-card:hover {
      box-shadow: var(--shadow-md);
    }

    .role-card.expanded {
      grid-column: 1 / -1;
    }

    .role-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-lg);
    }

    .role-info {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .role-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .role-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      margin: 0;
    }

    .role-id {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .role-actions {
      display: flex;
      gap: var(--space-sm);
      align-items: center;
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
      background: #f43f5e;
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
      color: var(--color-text-muted);
    }

    .btn-icon:hover {
      color: #f43f5e;
      background: rgba(244, 63, 94, 0.05);
    }

    .btn-ghost {
      background: rgba(255, 255, 255, 0.05);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .btn-ghost:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .role-summary {
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .role-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .role-modules {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-xs);
    }

    .module-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .role-stats {
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .stats-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: #f43f5e;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .role-permissions {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .permissions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: var(--space-lg);
    }

    .permission-group {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .permission-group-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--space-md);
    }

    .module-name {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      text-transform: uppercase;
      margin: 0;
    }

    .permissions-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .permission-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-xs) var(--space-sm);
      background: white;
      border: 2px solid transparent;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .permission-item:hover {
      background: var(--color-bg);
    }

    .permission-item.selected {
      background: rgba(244, 63, 94, 0.05);
      border-color: rgba(244, 63, 94, 0.2);
    }

    .permission-name {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .permission-name.selected {
      color: #f43f5e;
    }

    .text-muted {
      color: var(--color-text-muted);
    }

    .role-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding-top: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #f43f5e;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      background: #e11d48;
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    /* Dark mode */
    :host-context(.dark) .role-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .role-icon svg {
      color: white;
    }

    :host-context(.dark) .role-name {
      color: var(--color-text);
    }

    :host-context(.dark) .module-badge {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .permission-group {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .permission-item {
      background: var(--color-surface);
    }

    :host-context(.dark) .permission-item:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .permission-item.selected {
      background: rgba(244, 63, 94, 0.1);
      border-color: rgba(244, 63, 94, 0.3);
    }

    :host-context(.dark) .toggle-btn {
      background: #4b5563;
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .roles-grid {
        grid-template-columns: 1fr;
      }

      .permissions-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuperAdminRolesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  roles: RoleData[] = [];
  loading = true;
  allPermissions = ALL_PERMISSIONS;

  private roleColors: { [key: string]: string } = {
    'T001': 'linear-gradient(135deg, #f43f5e, #be123c)',
    'T002': 'linear-gradient(135deg, #0ea5e9, #0369a1)',
    'T003': 'linear-gradient(135deg, #10b981, #047857)',
    'T004': 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    'T005': 'linear-gradient(135deg, #6366f1, #4338ca)',
    'T006': 'linear-gradient(135deg, #f59e0b, #b45309)',
    'T007': 'linear-gradient(135deg, #64748b, #334155)',
  };

  private roleIcons: { [key: string]: string } = {
    'T001': 'admin_panel_settings',
    'T002': 'business',
    'T003': 'badge',
    'T004': 'assignment_ind',
    'T005': 'terminal',
    'T006': 'bug_report',
    'T007': 'person_pin',
  };

  private moduleIcons: { [key: string]: string } = {
    'Sociétés': 'apartment',
    'Utilisateurs': 'people',
    'Projets': 'folder',
    'Tâches': 'task',
    'RH': 'history_toggle_off',
    'Recrutement': 'search',
    'Dashboard': 'monitoring',
    'Paramètres': 'settings',
  };

  ngOnInit() { this.loadRoles(); }

  loadRoles() {
    this.loading = true;
    this.api.getRoles().subscribe({
      next: (data: any[]) => {
        const savedPerms = this.loadSavedPermissions();
        this.roles = (data || []).map((item: any) => {
          const id = item.id || item.Id;
          const nom = ApiService.getRoleLabel(item.nom || item.Nom || id);
          const desc = item.description || item.Description || '';
          const actif = item.actif ?? item.Actif ?? true;
          const enabledIds: string[] = savedPerms[id] || ROLE_PERMISSIONS[id] || [];
          const permissions: Permission[] = ALL_PERMISSIONS.map(p => ({ ...p, selected: enabledIds.includes(p.id) }));
          return { id, nom, description: desc, actif, permissions, expanded: false };
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erreur chargement des rôles', 'Fermer', { duration: 3000 });
      }
    });
  }

  getRoleColor(id: string): string { return this.roleColors[id] || 'linear-gradient(135deg, #64748b, #334155)'; }
  getRoleIcon(id: string): string { return this.roleIcons[id] || 'person'; }
  getModuleIcon(name: string): string { return this.moduleIcons[name] || 'more_horiz'; }

  getEnabledCount(role: RoleData): number { return role.permissions.filter(p => p.selected).length; }
  getActiveModules(role: RoleData): string[] {
    const mods = new Set<string>();
    role.permissions.filter(p => p.selected).forEach(p => mods.add(p.moduleNom));
    return Array.from(mods);
  }

  getPermissionsByModule(permissions: Permission[]): any[] {
    const grouped: { [key: string]: Permission[] } = {};
    permissions.forEach(p => {
      if (!grouped[p.moduleNom]) grouped[p.moduleNom] = [];
      grouped[p.moduleNom].push(p);
    });
    return Object.keys(grouped).map(k => ({ name: k, permissions: grouped[k] }));
  }

  toggleRoleExpand(role: RoleData) { role.expanded = !role.expanded; }
  toggleRoleActif(role: RoleData, event: any) { 
    const prevStatus = role.actif;
    role.actif = event.checked; 
    
    this.api.updateRole(role).subscribe({
      next: () => {
        this.snackBar.open(`Statut du rôle ${role.nom} mis à jour : ${role.actif ? 'ACTIF' : 'INACTIF'}`, 'OK', { duration: 3000 });
      },
      error: (err) => {
        role.actif = prevStatus;
        this.snackBar.open('Erreur lors de la mise à jour du statut', 'Fermer', { duration: 3000 });
      }
    });
  }
  togglePermission(role: RoleData, perm: Permission) { perm.selected = !perm.selected; }

  toggleModule(role: RoleData, group: any) {
    const allEnabled = group.permissions.every((p: Permission) => p.selected);
    group.permissions.forEach((p: Permission) => p.selected = !allEnabled);
  }

  savePermissions(role: RoleData) {
    const savedPerms = this.loadSavedPermissions();
    savedPerms[role.id] = role.permissions.filter(p => p.selected).map(p => p.id);
    localStorage.setItem('rbac_permissions', JSON.stringify(savedPerms));
    this.snackBar.open(`✓ Matrice enregistrée pour ${role.nom}`, 'OK', { duration: 3000 });
    role.expanded = false;
  }

  private loadSavedPermissions(): { [roleId: string]: string[] } {
    try {
      const raw = localStorage.getItem('rbac_permissions');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
}
