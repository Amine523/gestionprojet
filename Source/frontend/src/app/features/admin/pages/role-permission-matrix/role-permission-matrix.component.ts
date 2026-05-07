import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiGenericService } from '@core/services/api-generic.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-role-permission-matrix',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatSlideToggleModule, MatButtonModule, MatIconModule],
  templateUrl: './role-permission-matrix.component.html',
  styleUrls: ['./role-permission-matrix.component.scss']
})
export class RolePermissionMatrix implements OnInit {
  private api = inject(ApiGenericService);
  private notify = inject(NotificationService);

  roles = signal<any[]>([]);
  permissions = signal<any[]>([]);
  matrix = signal<Map<string, Set<string>>>(new Map());

  displayedColumns = computed(() => ['role', ...this.permissions().map(p => p.id)]);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    // Simuler le chargement
    this.roles.set([
      { id: 'ADMIN', nom: 'Administrateur' },
      { id: 'CHEF', nom: 'Chef de Projet' },
      { id: 'DEV', nom: 'Développeur' },
      { id: 'RH', nom: 'Ressources Humaines' }
    ]);

    this.permissions.set([
      { id: 'PROJ_VIEW', nom: 'Voir Projets' },
      { id: 'PROJ_EDIT', nom: 'Éditer Projets' },
      { id: 'USER_MGT', nom: 'Gérer Users' },
      { id: 'CONGE_VAL', nom: 'Valider Congés' },
      { id: 'STATS_VIEW', nom: 'Voir Stats' }
    ]);

    // Initialiser la matrice
    const m = new Map();
    this.roles().forEach(r => m.set(r.id, new Set(['PROJ_VIEW'])));
    this.matrix.set(m);
  }

  hasPermission(roleId: string, permId: string): boolean {
    return this.matrix().get(roleId)?.has(permId) || false;
  }

  togglePermission(roleId: string, permId: string) {
    const m = new Map(this.matrix());
    const rolePerms = new Set(m.get(roleId));
    if (rolePerms.has(permId)) {
      rolePerms.delete(permId);
    } else {
      rolePerms.add(permId);
    }
    m.set(roleId, rolePerms);
    this.matrix.set(m);
  }

  savePermissions() {
    this.notify.showToast('Permissions sauvegardées avec succès', 'success');
  }
}
