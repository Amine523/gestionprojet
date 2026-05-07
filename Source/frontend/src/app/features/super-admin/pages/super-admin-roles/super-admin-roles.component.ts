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
  templateUrl: './super-admin-roles.component.html',
  styleUrls: ['./super-admin-roles.component.scss']
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
