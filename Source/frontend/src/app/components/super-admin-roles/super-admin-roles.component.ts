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
import { ApiService } from '../../services/api.service';

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

// Define all available permissions grouped by module
const ALL_PERMISSIONS: Permission[] = [
  // Sociétés
  { id: 'soc.lire', nom: 'Voir sociétés', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.creer', nom: 'Créer société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.modifier', nom: 'Modifier société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  { id: 'soc.supprimer', nom: 'Supprimer société', moduleId: 'soc', moduleNom: 'Sociétés', selected: false },
  // Utilisateurs
  { id: 'usr.lire', nom: 'Voir utilisateurs', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.creer', nom: 'Créer utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.modifier', nom: 'Modifier utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  { id: 'usr.supprimer', nom: 'Supprimer utilisateur', moduleId: 'usr', moduleNom: 'Utilisateurs', selected: false },
  // Projets
  { id: 'prj.lire', nom: 'Voir projets', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.creer', nom: 'Créer projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.modifier', nom: 'Modifier projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  { id: 'prj.supprimer', nom: 'Supprimer projet', moduleId: 'prj', moduleNom: 'Projets', selected: false },
  // Tâches
  { id: 'tsk.lire', nom: 'Voir tâches', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.creer', nom: 'Créer tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.modifier', nom: 'Modifier tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  { id: 'tsk.supprimer', nom: 'Supprimer tâche', moduleId: 'tsk', moduleNom: 'Tâches', selected: false },
  // RH
  { id: 'rh.lire', nom: 'Voir RH', moduleId: 'rh', moduleNom: 'RH', selected: false },
  { id: 'rh.conges', nom: 'Gérer congés', moduleId: 'rh', moduleNom: 'RH', selected: false },
  { id: 'rh.pointages', nom: 'Gérer pointages', moduleId: 'rh', moduleNom: 'RH', selected: false },
  // Recrutement
  { id: 'rec.lire', nom: 'Voir offres', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  { id: 'rec.creer', nom: 'Créer offre', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  { id: 'rec.candidatures', nom: 'Gérer candidatures', moduleId: 'rec', moduleNom: 'Recrutement', selected: false },
  // Dashboard
  { id: 'dash.lire', nom: 'Voir tableau de bord', moduleId: 'dash', moduleNom: 'Dashboard', selected: false },
  { id: 'dash.stats', nom: 'Voir statistiques', moduleId: 'dash', moduleNom: 'Dashboard', selected: false },
  // Paramètres
  { id: 'param.lire', nom: 'Voir paramètres', moduleId: 'param', moduleNom: 'Paramètres', selected: false },
  { id: 'param.modifier', nom: 'Modifier paramètres', moduleId: 'param', moduleNom: 'Paramètres', selected: false },
];

// Default permissions per role ID
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
    <div class="rbac-container">
      <div class="rbac-header">
        <div class="header-left">
          <div class="header-icon">
            <mat-icon>security</mat-icon>
          </div>
          <div class="header-text">
            <h1>Sécurité RBAC</h1>
            <p>Gestion des rôles et permissions — Contrôle d'accès basé sur les rôles</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <span class="stat-value">{{roles.length}}</span>
            <span class="stat-label">Rôles</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{getTotalPermissionsEnabled()}}</span>
            <span class="stat-label">Permissions actives</span>
          </div>
          <div class="stat-item">
            <span class="stat-value">{{allPermissions.length}}</span>
            <span class="stat-label">Permissions totales</span>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="loading-overlay">
          <div class="loading-spinner">
            <mat-icon class="spin">sync</mat-icon>
            <span>Chargement des rôles...</span>
          </div>
        </div>
      }

      <div class="roles-grid">
        @for (role of roles; track role.id) {
          <mat-card class="role-card" [class.expanded]="role.expanded" [class.inactive]="!role.actif">
            <div class="role-card-header" (click)="toggleRoleExpand(role)">
              <div class="role-badge" [style.background]="getRoleColor(role.id)">
                <mat-icon>{{getRoleIcon(role.id)}}</mat-icon>
              </div>
              <div class="role-info">
                <h3>{{role.nom}}</h3>
                <span class="role-id">{{role.id}}</span>
                <span class="role-desc">{{role.description}}</span>
              </div>
              <div class="role-meta">
                <span class="perm-badge">{{getEnabledCount(role)}} / {{allPermissions.length}} perms</span>
              </div>
              <div class="role-toggle" (click)="$event.stopPropagation()">
                <mat-slide-toggle
                  [checked]="role.actif"
                  (change)="toggleRoleActif(role, $event)"
                  color="primary"
                  [matTooltip]="role.actif ? 'Désactiver' : 'Activer'">
                </mat-slide-toggle>
              </div>
              <button mat-icon-button class="expand-btn" [class.rotated]="role.expanded">
                <mat-icon>expand_more</mat-icon>
              </button>
            </div>

            @if (!role.expanded) {
              <div class="role-preview">
                <div class="preview-modules">
                  @for (mod of getActiveModules(role); track mod) {
                    <span class="module-chip">
                      <mat-icon>{{getModuleIcon(mod)}}</mat-icon>
                      {{mod}}
                    </span>
                  }
                </div>
              </div>
            }

            @if (role.expanded) {
              <div class="role-card-body">
                <div class="permissions-header">
                  <h4><mat-icon>admin_panel_settings</mat-icon> Permissions</h4>
                  <div class="perm-actions">
                    <button mat-stroked-button (click)="selectAll(role)" style="font-size:11px">Tout sélectionner</button>
                    <button mat-stroked-button (click)="deselectAll(role)" style="font-size:11px">Tout désélectionner</button>
                    <span class="perm-count">{{getEnabledCount(role)}} activées</span>
                  </div>
                </div>

                <div class="modules-sections">
                  @for (moduleGroup of getPermissionsByModule(role.permissions); track moduleGroup.name) {
                    <div class="module-section">
                      <div class="module-header">
                        <mat-icon>{{getModuleIcon(moduleGroup.name)}}</mat-icon>
                        <span>{{moduleGroup.name}}</span>
                        <span class="module-count">{{getModuleEnabledCount(moduleGroup)}} / {{moduleGroup.permissions.length}}</span>
                        <button mat-icon-button (click)="toggleModule(role, moduleGroup)" style="width:28px;height:28px;line-height:28px" [matTooltip]="'Tout (dé)sélectionner'">
                          <mat-icon style="font-size:16px;width:16px;height:16px">{{getModuleEnabledCount(moduleGroup) === moduleGroup.permissions.length ? 'check_box' : 'check_box_outline_blank'}}</mat-icon>
                        </button>
                      </div>
                      <div class="module-permissions">
                        @for (perm of moduleGroup.permissions; track perm.id) {
                          <div class="permission-item"
                               [class.enabled]="perm.selected"
                               (click)="togglePermission(role, perm)">
                            <mat-icon class="perm-check">
                              {{perm.selected ? 'check_circle' : 'radio_button_unchecked'}}
                            </mat-icon>
                            <span class="perm-name">{{perm.nom}}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }
                </div>

                <div class="role-actions">
                  <button mat-button (click)="role.expanded = false">Fermer</button>
                  <button mat-raised-button color="primary" (click)="savePermissions(role)">
                    <mat-icon>save</mat-icon>
                    Enregistrer les permissions
                  </button>
                </div>
              </div>
            }
          </mat-card>
        }
      </div>

      @if (!loading && roles.length === 0) {
        <div class="empty-state">
          <mat-icon>admin_panel_settings</mat-icon>
          <h3>Aucun rôle trouvé</h3>
          <p>Impossible de charger les rôles depuis le backend. Vérifiez que le serveur Core (port 5050) est démarré.</p>
          <button mat-raised-button color="primary" (click)="loadRoles()">
            <mat-icon>refresh</mat-icon> Réessayer
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .rbac-container { padding: 28px; max-width: 1400px; margin: 0 auto; }

    .rbac-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 32px; padding: 24px;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      border-radius: 16px; color: #fff;
    }
    .header-left { display: flex; align-items: center; gap: 20px; }
    .header-icon {
      width: 56px; height: 56px;
      background: linear-gradient(135deg, #d32f2f, #b71c1c);
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
    }
    .header-icon mat-icon { font-size: 28px; width: 28px; height: 28px; color:#fff; }
    .header-text h1 { font-size: 26px; font-weight: 700; margin: 0; }
    .header-text p { font-size: 13px; color: rgba(255,255,255,0.7); margin: 4px 0 0; }

    .header-stats { display: flex; gap: 16px; }
    .stat-item {
      display: flex; flex-direction: column; align-items: center;
      padding: 12px 20px; background: rgba(255,255,255,0.1); border-radius: 10px;
    }
    .stat-value { font-size: 24px; font-weight: 700; color: #ff7043; }
    .stat-label { font-size: 12px; color: rgba(255,255,255,0.7); }

    .loading-overlay { display:flex; justify-content:center; align-items:center; padding:80px; }
    .loading-spinner { display:flex; flex-direction:column; align-items:center; gap:12px; color:#888; }
    .loading-spinner mat-icon { font-size:40px; width:40px; height:40px; }
    .spin { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .roles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; }
    .role-card { border-radius: 14px; overflow: hidden; transition: all 0.3s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .role-card.expanded { grid-column: 1 / -1; }
    .role-card.inactive { opacity: 0.55; }

    .role-card-header {
      display: flex; align-items: center; gap: 12px; padding: 18px 20px;
      cursor: pointer; transition: background 0.2s;
    }
    .role-card-header:hover { background: #f5f5f5; }

    .role-badge {
      width: 46px; height: 46px; min-width: 46px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .role-badge mat-icon { font-size: 22px; width: 22px; height: 22px; }

    .role-info { flex: 1; min-width: 0; }
    .role-info h3 { font-size: 15px; font-weight: 600; margin: 0; color: #1a1a2e; }
    .role-id { font-size: 11px; color: #888; font-family: monospace; display: block; }
    .role-desc { font-size: 11px; color: #aaa; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .role-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
    .perm-badge { font-size: 11px; background: #e3f2fd; color: #1976d2; padding: 3px 10px; border-radius: 10px; white-space: nowrap; }

    .expand-btn { transition: transform 0.3s; }
    .expand-btn.rotated { transform: rotate(180deg); }

    .role-preview { padding: 0 20px 16px; }
    .preview-modules { display: flex; flex-wrap: wrap; gap: 6px; }
    .module-chip {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; padding: 4px 10px; border-radius: 12px;
      background: #f0f0f0; color: #555;
    }
    .module-chip mat-icon { font-size: 13px; width: 13px; height: 13px; }

    .role-card-body { padding: 0 20px 20px; border-top: 1px solid #eee; animation: slideDown 0.25s ease; }
    @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }

    .permissions-header {
      display: flex; justify-content: space-between; align-items: center; margin: 16px 0 12px;
    }
    .permissions-header h4 { display:flex; align-items:center; gap:6px; font-size: 14px; font-weight: 600; margin: 0; color: #1a1a2e; }
    .permissions-header h4 mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .perm-actions { display: flex; align-items: center; gap: 8px; }
    .perm-count { font-size: 12px; color: #1976d2; font-weight: 600; background: #e3f2fd; padding: 3px 10px; border-radius: 10px; }

    .modules-sections { display: flex; flex-direction: column; gap: 14px; max-height: 440px; overflow-y: auto; }
    .module-section { background: #f8f9fa; border-radius: 10px; padding: 12px; }
    .module-header {
      display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
      font-size: 13px; font-weight: 600; color: #d32f2f;
    }
    .module-header mat-icon { font-size: 17px; width: 17px; height: 17px; }
    .module-count { margin-left: auto; font-size: 11px; color: #888; background: #fff; padding: 2px 8px; border-radius: 10px; }

    .module-permissions { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 7px; }
    .permission-item {
      display: flex; align-items: center; gap: 7px; padding: 9px 12px;
      background: #fff; border-radius: 8px; cursor: pointer; transition: all 0.18s;
      border: 1px solid #eee;
    }
    .permission-item:hover { border-color: #d32f2f; background: #fff5f5; }
    .permission-item.enabled { background: #e8f5e9; border-color: #43a047; }
    .perm-check { font-size: 17px; width: 17px; height: 17px; color: #ccc; }
    .permission-item.enabled .perm-check { color: #43a047; }
    .perm-name { flex: 1; font-size: 12px; color: #333; }

    .role-actions { margin-top: 16px; padding-top: 14px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }

    .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:80px; color:#888; gap: 12px; }
    .empty-state mat-icon { font-size: 56px; width:56px; height:56px; }
    .empty-state h3 { font-size:20px; margin:0; }

    @media (max-width: 900px) {
      .roles-grid { grid-template-columns: 1fr; }
      .rbac-header { flex-direction: column; gap: 20px; }
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
    'T001': 'linear-gradient(135deg, #d32f2f, #b71c1c)',
    'T002': 'linear-gradient(135deg, #1976d2, #1565c0)',
    'T003': 'linear-gradient(135deg, #00897b, #00796b)',
    'T004': 'linear-gradient(135deg, #388e3c, #2e7d32)',
    'T005': 'linear-gradient(135deg, #7b1fa2, #6a1b9a)',
    'T006': 'linear-gradient(135deg, #f57c00, #ef6c00)',
    'T007': 'linear-gradient(135deg, #5e35b1, #4527a0)',
  };

  private roleIcons: { [key: string]: string } = {
    'T001': 'shield',
    'T002': 'domain',
    'T003': 'supervisor_account',
    'T004': 'assignment',
    'T005': 'code',
    'T006': 'fact_check',
    'T007': 'work',
  };

  private moduleIcons: { [key: string]: string } = {
    'Sociétés': 'apartment',
    'Utilisateurs': 'people',
    'Projets': 'folder',
    'Tâches': 'task',
    'RH': 'access_time',
    'Recrutement': 'person_search',
    'Dashboard': 'dashboard',
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
          const nom = item.nom || item.Nom || id;
          const desc = item.description || item.Description || '';
          const actif = item.actif ?? item.Actif ?? true;

          // Use saved permissions if available, else defaults
          const enabledIds: string[] = savedPerms[id] || ROLE_PERMISSIONS[id] || [];

          const permissions: Permission[] = ALL_PERMISSIONS.map(p => ({
            ...p,
            selected: enabledIds.includes(p.id)
          }));

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

  getRoleColor(id: string): string { return this.roleColors[id] || 'linear-gradient(135deg, #666, #444)'; }
  getRoleIcon(id: string): string { return this.roleIcons[id] || 'person'; }
  getModuleIcon(name: string): string { return this.moduleIcons[name] || 'more_horiz'; }

  getTotalPermissionsEnabled(): number {
    return this.roles.reduce((sum, r) => sum + r.permissions.filter(p => p.selected).length, 0);
  }

  getEnabledCount(role: RoleData): number {
    return role.permissions.filter(p => p.selected).length;
  }

  getModuleEnabledCount(group: any): number {
    return group.permissions.filter((p: Permission) => p.selected).length;
  }

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
    role.actif = event.checked;
    this.snackBar.open(role.actif ? 'Rôle activé' : 'Rôle désactivé', 'OK', { duration: 2000 });
  }

  togglePermission(role: RoleData, perm: Permission) {
    perm.selected = !perm.selected;
  }

  selectAll(role: RoleData) { role.permissions.forEach(p => p.selected = true); }
  deselectAll(role: RoleData) { role.permissions.forEach(p => p.selected = false); }

  toggleModule(role: RoleData, group: any) {
    const allEnabled = group.permissions.every((p: Permission) => p.selected);
    group.permissions.forEach((p: Permission) => p.selected = !allEnabled);
  }

  savePermissions(role: RoleData) {
    const savedPerms = this.loadSavedPermissions();
    savedPerms[role.id] = role.permissions.filter(p => p.selected).map(p => p.id);
    localStorage.setItem('rbac_permissions', JSON.stringify(savedPerms));

    const enabled = role.permissions.filter(p => p.selected).length;
    this.snackBar.open(`✓ ${enabled} permission(s) enregistrée(s) pour ${role.nom}`, 'OK', { duration: 3000 });
    role.expanded = false;
  }

  private loadSavedPermissions(): { [roleId: string]: string[] } {
    try {
      const raw = localStorage.getItem('rbac_permissions');
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }
}
