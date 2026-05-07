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
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-admin-modules',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule,
    MatSlideToggleModule, MatTooltipModule, MatSnackBarModule, MatProgressBarModule, MatChipsModule
  ],
  templateUrl: './admin-modules.component.html',
  styleUrls: ['./admin-modules.component.scss']
})
export class AdminModulesComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  loading = true;
  saving = false;
  societeId = '';
  societeNom = '';
  activeModules: string[] = [];
  roles: any[] = [];

  availableModules = [
    { id: 'projets', nom: 'Gestion Projets', description: 'Suivi opérationnel des projets', icon: 'folder', category: 'Gestion' },
    { id: 'taches', nom: 'Tâches', description: 'Gestion des livrables et deadlines', icon: 'task', category: 'Gestion' },
    { id: 'bugs', nom: 'Gestion Bugs', description: 'Tracking des anomalies logicielles', icon: 'bug_report', category: 'Gestion' },
    { id: 'rh', nom: 'RH', description: 'Ressources humaines & Talents', icon: 'supervisor_account', category: 'RH' },
    { id: 'pointage', nom: 'Pointage', description: 'Suivi des présences et temps', icon: 'access_time', category: 'RH' },
    { id: 'conges', nom: 'Congés', description: 'Gestion des absences et congés', icon: 'event_available', category: 'RH' },
    { id: 'recrutement', nom: 'Recrutement', description: 'Gestion des candidats et offres', icon: 'person_search', category: 'RH' },
    { id: 'chat', nom: 'Communication', description: 'Messagerie instantanée interne', icon: 'forum', category: 'Communication' },
    { id: 'notifications', nom: 'Notifications', description: 'Alertes et rappels système', icon: 'notifications', category: 'Communication' },
    { id: 'dashboards', nom: 'Tableaux de bord', description: 'Statistiques et rapports visuels', icon: 'dashboard', category: 'Analytics' },
    { id: 'documents', nom: 'Documents', description: 'GED et partage de fichiers', icon: 'description', category: 'Outils' },
    { id: 'calendrier', nom: 'Calendrier', description: 'Planning et événements partagés', icon: 'event', category: 'Outils' }
  ];

  moduleCategories = [
    { name: 'Gestion', icon: 'business_center' },
    { name: 'RH', icon: 'groups' },
    { name: 'Communication', icon: 'chat' },
    { name: 'Analytics', icon: 'analytics' },
    { name: 'Outils', icon: 'construction' }
  ];

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || user?.SocieteId || '';
    this.societeNom = user?.societe?.nom || user?.SocieteNom || 'Votre Société';
    this.loadData();
  }

  loadData() {
    if (!this.societeId) return;
    this.loading = true;
    
    forkJoin({
      modules: this.api.getSocieteModules(this.societeId).pipe(catchError(() => of([]))),
      roles: this.api.getRoles().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        // Si aucun module n'est configuré (ex: nouvelle société), on active tout par défaut
        // conformément à l'exigence : "les modules sont actives pour admin societe"
        if (!res.modules || res.modules.length === 0) {
          this.activeModules = this.availableModules.map(m => m.id);
        } else {
          this.activeModules = res.modules;
        }
        this.roles = res.roles || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  isModuleActive(moduleId: string): boolean {
    return this.activeModules.includes(moduleId);
  }

  getRolesForModule(moduleId: string): string[] {
    return []; // No longer used in display
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

  toggleModule(moduleId: string) {
    const index = this.activeModules.indexOf(moduleId);
    if (index > -1) {
      this.activeModules.splice(index, 1);
    } else {
      this.activeModules.push(moduleId);
    }
  }

  saveModules() {
    this.saving = true;
    const modulesJson = JSON.stringify(this.activeModules);
    this.api.updateSocieteModules(this.societeId, modulesJson).subscribe({
      next: () => {
        this.saving = false;
        this.snackBar.open('Configuration sauvegardée avec succès', 'OK', { duration: 3000 });
      },
      error: () => {
        this.saving = false;
        this.snackBar.open('Erreur lors de la sauvegarde', 'Fermer', { duration: 3000 });
      }
    });
  }

  getTotalActive(): number {
    return this.activeModules.length;
  }
}
