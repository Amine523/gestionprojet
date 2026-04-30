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

interface Module {
  id: string;
  nom: string;
  actif: boolean;
  description?: string;
}

interface SocieteModule {
  societeId: string;
  societeNom: string;
  modules: string[];
}

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
  societes: any[] = [];
  selectedSociete: any = null;
  societeModules: { [key: string]: string[] } = {};
  
  availableModules = [
    { id: 'societes', nom: 'Gestion Sociétés', description: '.multitenant', icon: 'apartment', category: 'Core' },
    { id: 'utilisateurs', nom: 'Utilisateurs', description: 'Gestion des utilisateurs', icon: 'people', category: 'Core' },
    { id: 'roles', nom: 'Rôles & Permissions', description: 'Sécurité RBAC', icon: 'admin_panel_settings', category: 'Core' },
    { id: 'projets', nom: 'Gestion Projets', description: 'Suivi des projets', icon: 'folder', category: 'Gestion' },
    { id: 'taches', nom: 'Tâches', description: 'Gestion des tâches', icon: 'task', category: 'Gestion' },
    { id: 'bugs', nom: 'Gestion Bugs', description: 'Suivi des anomalies', icon: 'bug_report', category: 'Gestion' },
    { id: 'rh', nom: 'RH', description: ' Ressources humaines', icon: 'supervisor_account', category: 'RH' },
    { id: 'pointage', nom: 'Pointage', description: 'Gestion du temps', icon: 'access_time', category: 'RH' },
    { id: 'conges', nom: 'Congés', description: 'Gestion des congés', icon: 'event_available', category: 'RH' },
    { id: 'recrutement', nom: 'Recrutement', description: 'Gestion du recrutement', icon: 'person_search', category: 'RH' },
    { id: 'chat', nom: 'Chat & Communication', description: 'Messagerie interne', icon: 'forum', category: 'Communication' },
    { id: 'notifications', nom: 'Notifications', description: 'Alertes et notifications', icon: 'notifications', category: 'Communication' },
    { id: 'dashboards', nom: 'Tableaux de bord', description: 'Statistiques et rapports', icon: 'dashboard', category: 'Analytics' },
    { id: 'documents', nom: 'Documents', description: ' Gestion documentaire', icon: 'description', category: 'Outils' },
    { id: 'calendrier', nom: 'Calendrier', description: 'Planification', icon: 'event', category: 'Outils' },
    { id: 'api', nom: 'API Accès', description: 'APIs externes', icon: 'api', category: 'Technique' }
  ];

  moduleCategories = [
    { name: 'Core', icon: 'apps' },
    { name: 'Gestion', icon: 'folder' },
    { name: 'RH', icon: 'supervisor_account' },
    { name: 'Communication', icon: 'forum' },
    { name: 'Analytics', icon: 'dashboard' },
    { name: 'Outils', icon: 'build' },
    { name: 'Technique', icon: 'code' }
  ];

  ngOnInit() {
    this.loadSocietes();
  }

  loadSocietes() {
    this.loading = true;
    this.api.getSocietes().subscribe({
      next: (data) => {
        this.societes = data || [];
        if (this.societes.length > 0) {
          this.societeModules = {};
          this.societes.forEach(s => {
            this.societeModules[s.id] = this.availableModules.map(m => m.id);
          });
        }
        this.loading = false;
      },
      error: () => {
        this.societes = [
          { id: 'SOC001', nom: 'Leadertec' },
          { id: 'SOC002', nom: 'TechCorp' },
          { id: 'SOC003', nom: 'InnovTech' }
        ];
        this.societes.forEach(s => {
          this.societeModules[s.id] = this.availableModules.map(m => m.id);
        });
        this.loading = false;
      }
    });
  }

  selectSociete(societe: any) {
    this.selectedSociete = societe;
    if (!this.societeModules[societe.id]) {
      this.societeModules[societe.id] = this.availableModules.map(m => m.id);
    }
  }

  isModuleActive(moduleId: string): boolean {
    if (!this.selectedSociete) return false;
    return this.societeModules[this.selectedSociete.id]?.includes(moduleId) || false;
  }

  toggleModule(moduleId: string, active: boolean) {
    if (!this.selectedSociete) return;
    const modules = this.societeModules[this.selectedSociete.id] || [];
    if (active) {
      if (!modules.includes(moduleId)) {
        modules.push(moduleId);
      }
    } else {
      const index = modules.indexOf(moduleId);
      if (index > -1) {
        modules.splice(index, 1);
      }
    }
    this.societeModules[this.selectedSociete.id] = modules;
    
    this.saveToStorage();
    
    this.snackBar.open(
      `Module ${active ? 'activé' : 'désactivé'} pour ${this.selectedSociete.nom}`, 
      'OK', 
      { duration: 2000 }
    );
  }

  saveModules() {
    this.saveToStorage();
    
    this.snackBar.open(
      `Modules enregistrés pour ${this.selectedSociete.nom}`, 
      'OK', 
      { duration: 3000 }
    );
  }
  
  private saveToStorage() {
    const data = localStorage.getItem('app_data');
    const storage = data ? JSON.parse(data) : {};
    
    storage.modules = storage.modules || {};
    storage.modules[this.selectedSociete.id] = this.societeModules[this.selectedSociete.id] || [];
    
    localStorage.setItem('app_data', JSON.stringify(storage));
    
    this.saveModulesToDatabase();
  }
  
  private saveModulesToDatabase() {
    if (!this.selectedSociete) return;
    const modulesJson = JSON.stringify(this.societeModules[this.selectedSociete.id] || []);
    this.api.updateSocieteModules(this.selectedSociete.id, modulesJson).subscribe({
      next: () => console.log('Modules enregistrés en base de données'),
      error: () => console.log('Erreur lors de l\'enregistrement des modules')
    });
  }

  getTotalActive(): number {
    return Object.values(this.societeModules).reduce((sum, mods) => sum + mods.length, 0);
  }

  getCategoryProgress(category: string): number {
    if (!this.selectedSociete) return 0;
    const catModules = this.availableModules.filter(m => m.category === category);
    const activeCount = catModules.filter(m => this.isModuleActive(m.id)).length;
    return (activeCount / catModules.length) * 100;
  }

  getCategoryActiveCount(category: string): number {
    if (!this.selectedSociete) return 0;
    const catModules = this.availableModules.filter(m => m.category === category);
    return catModules.filter(m => this.isModuleActive(m.id)).length;
  }

  getCategoryTotalCount(category: string): number {
    return this.availableModules.filter(m => m.category === category).length;
  }
}

