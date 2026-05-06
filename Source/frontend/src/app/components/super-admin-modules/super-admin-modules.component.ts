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
import { ApiService } from '../../services/api.service';

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
  template: `
    <div class="modules-container">
      <div class="modules-header">
        <div class="header-left">
          <div class="header-icon apps">
            <mat-icon>apps</mat-icon>
          </div>
          <div class="header-text">
            <h1>Modules SaaS</h1>
            <p>Activation et configuration des fonctionnalités par société</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <mat-icon>apartment</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{societes.length}}</span>
              <span class="stat-label">Sociétés</span>
            </div>
          </div>
          <div class="stat-card">
            <mat-icon>toggle_on</mat-icon>
            <div class="stat-info">
              <span class="stat-value">{{getTotalActive()}}</span>
              <span class="stat-label">Modules actifs</span>
            </div>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="loading-overlay">
          <mat-icon>sync</mat-icon>
          <span>Chargement des modules...</span>
        </div>
      }

      <div class="modules-content">
        <mat-card class="societes-selector">
          <div class="selector-header">
            <h3>Sélectionner une société</h3>
          </div>
          <div class="societe-list">
            @for (societe of societes; track societe.id) {
              <div 
                class="societe-item" 
                [class.selected]="selectedSociete?.id === societe.id"
                (click)="selectSociete(societe)">
                <div class="societe-avatar">
                  {{societe.nom.charAt(0)}}
                </div>
                <div class="societe-info">
                  <span class="societe-nom">{{societe.nom}}</span>
                  <span class="societe-id">{{societe.id}}</span>
                </div>
                <mat-icon class="chevron">chevron_right</mat-icon>
              </div>
            }
          </div>
        </mat-card>

        <div class="modules-panel">
          @if (selectedSociete) {
            <mat-card class="config-card">
              <div class="config-header">
                <div class="config-title">
                  <div class="config-avatar">
                    {{selectedSociete.nom.charAt(0)}}
                  </div>
                  <div>
                    <h3>{{selectedSociete.nom}}</h3>
                    <span class="config-subtitle">Configuration des modules</span>
                  </div>
                </div>
                <button mat-flat-button color="primary" (click)="saveModules()" [disabled]="saving">
                  <mat-icon>save</mat-icon>
                  Enregistrer
                </button>
              </div>

              <div class="modules-grid">
                @for (module of availableModules; track module.id) {
                  <div 
                    class="module-card"
                    [class.active]="isModuleActive(module.id)"
                    [class.inactive]="!isModuleActive(module.id)">
                    <div class="module-header">
                      <mat-icon class="module-icon">{{module.icon}}</mat-icon>
                      <div class="module-toggle">
                        <mat-slide-toggle
                          [checked]="isModuleActive(module.id)"
                          (change)="toggleModule(module.id, $event.checked)"
                          color="primary">
                        </mat-slide-toggle>
                      </div>
                    </div>
                    <div class="module-body">
                      <h4>{{module.nom}}</h4>
                      <p>{{module.description}}</p>
                    </div>
                    <div class="module-footer">
                      <mat-chip [class]="isModuleActive(module.id) ? 'chip-active' : 'chip-inactive'">
                        <mat-icon>{{isModuleActive(module.id) ? 'check_circle' : 'cancel'}}</mat-icon>
                        {{isModuleActive(module.id) ? 'Actif' : 'Inactif'}}
                      </mat-chip>
                    </div>
                  </div>
                }
              </div>

              <div class="activation-summary">
                <h4>Résumé d'activation</h4>
                <div class="summary-bars">
                  @for (category of moduleCategories; track category.name) {
                    <div class="summary-item">
                      <div class="summary-label">
                        <mat-icon>{{category.icon}}</mat-icon>
                        <span>{{category.name}}</span>
                      </div>
                      <mat-progress-bar 
                        mode="determinate" 
                        [value]="getCategoryProgress(category.name)">
                      </mat-progress-bar>
                      <span class="summary-value">{{getCategoryActiveCount(category.name)}}/{{getCategoryTotalCount(category.name)}}</span>
                    </div>
                  }
                </div>
              </div>
            </mat-card>
          }

          @if (!selectedSociete) {
            <div class="no-selection">
              <mat-icon>touch_app</mat-icon>
              <h3>Sélectionnez une société</h3>
              <p>Choisissez une société dans la liste pour configurer ses modules</p>
            </div>
          }
        </div>
      </div>

      <mat-card class="info-card">
        <mat-icon>info</mat-icon>
        <div class="info-content">
          <h4>Modules disponibles</h4>
          <p>Chaque module représente une fonctionnalité majeure de la plateforme. Les société peuvent activer/désactiver les modules selon leurs besoins.</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .modules-container {
      padding: 28px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .modules-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 28px;
      padding: 24px;
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
      border-radius: 16px;
      color: #fff;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-icon.apps {
      background: linear-gradient(135deg, #42a5f5, #1e88e5);
    }
    .header-icon mat-icon { font-size: 28px; width: 28px; height: 28px; }

    .header-text h1 {
      font-size: 26px;
      font-weight: 700;
      margin: 0;
    }
    .header-text p {
      font-size: 13px;
      color: rgba(255,255,255,0.7);
      margin: 4px 0 0;
    }

    .header-stats {
      display: flex;
      gap: 16px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 20px;
      background: rgba(255,255,255,0.15);
      border-radius: 10px;
    }
    .stat-card mat-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-value {
      font-size: 20px;
      font-weight: 700;
    }
    .stat-label {
      font-size: 11px;
      opacity: 0.8;
    }

    .loading-overlay {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 60px;
      color: #888;
    }
    .loading-overlay mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    .modules-content {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 24px;
    }

    .societes-selector {
      border-radius: 14px;
      overflow: hidden;
    }

    .selector-header {
      padding: 20px;
      border-bottom: 1px solid #eee;
    }
    .selector-header h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .societe-list {
      max-height: 500px;
      overflow-y: auto;
    }

    .societe-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 20px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid #f5f5f5;
    }
    .societe-item:hover {
      background: #f8f9fa;
    }
    .societe-item.selected {
      background: #e3f2fd;
      border-left: 3px solid #1976d2;
    }

    .societe-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .societe-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .societe-nom {
      font-size: 14px;
      font-weight: 500;
      color: #1a1a2e;
    }
    .societe-id {
      font-size: 11px;
      color: #888;
      font-family: monospace;
    }
    .chevron {
      color: #ccc;
    }

    .modules-panel {
      min-height: 500px;
    }

    .config-card {
      border-radius: 14px;
      overflow: hidden;
    }

    .config-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
    }

    .config-title {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .config-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #1976d2, #1565c0);
      color: #fff;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 600;
    }

    .config-title h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .config-subtitle {
      font-size: 12px;
      color: #888;
    }

    .modules-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
      padding: 20px;
    }

    .module-card {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      transition: all 0.3s;
      border: 2px solid transparent;
    }
    .module-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .module-card.active {
      background: #e8f5e9;
      border-color: #4caf50;
    }
    .module-card.inactive {
      opacity: 0.7;
    }

    .module-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .module-icon {
      width: 36px;
      height: 36px;
      background: #fff;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #666;
    }

    .module-body h4 {
      margin: 0 0 4px;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }
    .module-body p {
      margin: 0;
      font-size: 12px;
      color: #666;
      line-height: 1.4;
    }

    .module-footer {
      margin-top: 12px;
    }

    .chip-active {
      background: #c8e6c9;
      color: #2e7d32;
      font-size: 11px;
    }
    .chip-inactive {
      background: #ffcdd2;
      color: #c62828;
      font-size: 11px;
    }
    .chip-active mat-icon, .chip-inactive mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }

    .activation-summary {
      padding: 20px;
      border-top: 1px solid #eee;
    }
    .activation-summary h4 {
      margin: 0 0 16px;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .summary-bars {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .summary-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .summary-label {
      width: 140px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #666;
    }
    .summary-label mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .summary-item mat-progress-bar {
      flex: 1;
      height: 6px;
      border-radius: 3px;
    }
    .summary-value {
      font-size: 12px;
      color: #888;
      width: 40px;
      text-align: right;
    }

    .no-selection {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      background: #f8f9fa;
      border-radius: 14px;
      text-align: center;
    }
    .no-selection mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #ccc;
      margin-bottom: 16px;
    }
    .no-selection h3 {
      margin: 0 0 8px;
      color: #666;
    }
    .no-selection p {
      margin: 0;
      color: #999;
      font-size: 13px;
    }

    .info-card {
      margin-top: 24px;
      padding: 20px;
      border-radius: 14px;
      display: flex;
      gap: 16px;
      background: #e3f2fd;
    }
    .info-card > mat-icon {
      color: #1976d2;
      font-size: 24px;
    }
    .info-content h4 {
      margin: 0 0 4px;
      color: #1565c0;
    }
    .info-content p {
      margin: 0;
      font-size: 13px;
      color: #666;
    }

    @media (max-width: 900px) {
      .modules-content {
        grid-template-columns: 1fr;
      }
      .modules-header {
        flex-direction: column;
        gap: 20px;
      }
      .header-stats {
        width: 100%;
        justify-content: center;
      }
    }
  `]
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
