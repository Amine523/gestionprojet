import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '@core/services/api.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-super-admin-modules',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatProgressBarModule, MatChipsModule
  ],
  templateUrl: './super-admin-modules.component.html',
  styleUrls: ['./super-admin-modules.component.scss']
})
export class SuperAdminModulesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  loading = true;
  saving = false;
  activeTab: 'catalog' | 'societes' = 'catalog';
  societes: any[] = [];
  roles: any[] = [];
  societeModules: { [key: string]: string[] } = {};

  availableModules = [
    { id: 'societes', nom: 'Gestion Sociétés', description: 'Multitenancy & Clients', icon: 'apartment', category: 'Core' },
    { id: 'utilisateurs', nom: 'Utilisateurs', description: 'Gestion des accès', icon: 'people', category: 'Core' },
    { id: 'roles', nom: 'Rôles & Permissions', description: 'Sécurité RBAC', icon: 'admin_panel_settings', category: 'Core' },
    { id: 'projets', nom: 'Gestion Projets', description: 'Suivi & Planning', icon: 'folder', category: 'Gestion' },
    { id: 'taches', nom: 'Tâches', description: 'Workflow & Kanban', icon: 'task', category: 'Gestion' },
    { id: 'bugs', nom: 'Gestion Bugs', description: 'Suivi anomalies', icon: 'bug_report', category: 'Gestion' },
    { id: 'rh', nom: 'RH', description: 'Ressources humaines', icon: 'supervisor_account', category: 'RH' },
    { id: 'pointage', nom: 'Pointage', description: 'Temps & Présence', icon: 'access_time', category: 'RH' },
    { id: 'conges', nom: 'Congés', description: 'Absences & Congés', icon: 'event_available', category: 'RH' },
    { id: 'recrutement', nom: 'Recrutement', description: 'Candidats & Offres', icon: 'person_search', category: 'RH' },
    { id: 'chat', nom: 'Communication', description: 'Messagerie interne', icon: 'forum', category: 'Collab' },
    { id: 'notifications', nom: 'Notifications', description: 'Alertes système', icon: 'notifications', category: 'Collab' },
    { id: 'dashboards', nom: 'Tableaux de bord', description: 'Analyses & KPIs', icon: 'dashboard', category: 'Analytics' },
    { id: 'documents', nom: 'Documents', description: 'Gestion GED', icon: 'description', category: 'Outils' },
    { id: 'calendrier', nom: 'Calendrier', description: 'Événements', icon: 'event', category: 'Outils' },
    { id: 'api', nom: 'API Accès', description: 'Intégrations', icon: 'api', category: 'Technique' }
  ];

  moduleCategories = [
    { name: 'Core', icon: 'apps' },
    { name: 'Gestion', icon: 'folder' },
    { name: 'RH', icon: 'supervisor_account' },
    { name: 'Collab', icon: 'forum' },
    { name: 'Analytics', icon: 'dashboard' },
    { name: 'Outils', icon: 'build' },
    { name: 'Technique', icon: 'code' }
  ];

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;
    forkJoin({
      societes: this.api.getSocietes(),
      roles: this.api.getRoles()
    }).subscribe({
      next: (res) => {
        this.societes = res.societes || [];
        this.roles = res.roles || [];
        
        const moduleRequests = this.societes.map(s => 
          this.api.getSocieteModules(s.id).pipe(
            catchError(() => of([])),
            map(mods => ({ id: s.id, mods }))
          )
        );

        if (moduleRequests.length > 0) {
          forkJoin(moduleRequests).subscribe(results => {
            this.societeModules = {};
            results.forEach(res => {
              this.societeModules[res.id] = res.mods || [];
            });
            this.loading = false;
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.snackBar.open('Erreur lors du chargement des données', 'Fermer', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getRolesForModule(moduleId: string): string[] {
    const mapping: { [key: string]: string[] } = {
      'societes': ['T001'],
      'utilisateurs': ['T001', 'T002', 'T003'],
      'roles': ['T001'],
      'projets': ['T001', 'T002', 'T004', 'T005', 'T006'],
      'taches': ['T001', 'T002', 'T004', 'T005', 'T006'],
      'bugs': ['T001', 'T004', 'T006'],
      'rh': ['T001', 'T002', 'T003'],
      'pointage': ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'],
      'conges': ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'],
      'recrutement': ['T001', 'T002', 'T003', 'T007'],
      'chat': ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'],
      'notifications': ['T001', 'T002', 'T003', 'T004', 'T005', 'T006'],
      'dashboards': ['T001', 'T002', 'T003', 'T004'],
      'documents': ['T001', 'T002', 'T004'],
      'calendrier': ['T001', 'T002', 'T004', 'T005', 'T006'],
      'api': ['T001']
    };
    return mapping[moduleId] || [];
  }

  getRoleLabel(roleId: string): string {
    return ApiService.getRoleLabel(roleId);
  }

  getRoleColor(roleId: string): string {
    const colors: { [key: string]: string } = {
      'T001': '#f43f5e', 'T002': '#0ea5e9', 'T003': '#10b981',
      'T004': '#8b5cf6', 'T005': '#6366f1', 'T006': '#f59e0b', 'T007': '#64748b'
    };
    return colors[roleId] || '#94a3b8';
  }

  isModuleActiveFor(societeId: string, moduleId: string): boolean {
    return this.societeModules[societeId]?.includes(moduleId) || false;
  }

  toggleModuleFor(societeId: string, moduleId: string, active: boolean) {
    const modules = this.societeModules[societeId] || [];
    if (active) {
      if (!modules.includes(moduleId)) modules.push(moduleId);
    } else {
      const idx = modules.indexOf(moduleId);
      if (idx > -1) modules.splice(idx, 1);
    }
    this.societeModules[societeId] = [...modules];
  }

  saveSocieteModules(societe: any) {
    this.saving = true;
    const modulesJson = JSON.stringify(this.societeModules[societe.id] || []);
    this.api.updateSocieteModules(societe.id, modulesJson).subscribe({
      next: () => {
        this.snackBar.open(`Modules enregistrés pour ${societe.nom}`, 'OK', { duration: 2000 });
        this.saving = false;
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'enregistrement', 'Fermer', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  getTotalActive(): number {
    return Object.values(this.societeModules).reduce((sum, mods) => sum + mods.length, 0);
  }
}
