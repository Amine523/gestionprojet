import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TestCategory {
  name: string;
  icon: string;
  color: string;
  tests: TestItem[];
}

interface TestItem {
  name: string;
  description: string;
  role: string;
}

@Component({
  selector: 'app-tests-disponibles',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="container-fluid py-5" style="background: #f5f7fa; min-height: 100vh;">
      <!-- Page Header -->
      <div class="d-flex align-items-center justify-content-between mb-5">
        <div class="d-flex align-items-center gap-4">
          <div class="rounded-4 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; background: linear-gradient(135deg, #667eea, #764ba2); box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);">
            <i class="bi bi-clipboard-check text-white" style="font-size: 36px;"></i>
          </div>
          <div>
            <h1 class="fw-bold mb-1" style="font-size: 32px; color: #1a202c;">Tests Disponibles</h1>
            <p class="mb-0" style="color: #718096; font-size: 15px;">Liste complète des tests par rôle et fonctionnalité</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <input 
            type="text" 
            class="form-control rounded-3 px-4" 
            style="width: 300px; border: 2px solid #e2e8f0; transition: all 0.3s;"
            placeholder="🔍 Rechercher un test..."
            [(ngModel)]="searchQuery"
            (input)="filterTests()"
          >
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="row g-4 mb-5">
        <div class="col-md-4">
          <div class="card border-0 rounded-4 shadow-lg" style="background: linear-gradient(135deg, #667eea, #764ba2); transition: transform 0.3s, box-shadow 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="text-white mb-1" style="font-size: 14px; opacity: 0.9;">Tests Totaux</div>
                  <div class="fw-bold text-white" style="font-size: 42px;">{{totalTests}}</div>
                </div>
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; background: rgba(255,255,255,0.2);">
                  <i class="bi bi-list-check text-white" style="font-size: 32px;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 rounded-4 shadow-lg" style="background: linear-gradient(135deg, #f093fb, #f5576c); transition: transform 0.3s, box-shadow 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="text-white mb-1" style="font-size: 14px; opacity: 0.9;">Catégories</div>
                  <div class="fw-bold text-white" style="font-size: 42px;">{{testCategories.length}}</div>
                </div>
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; background: rgba(255,255,255,0.2);">
                  <i class="bi bi-grid text-white" style="font-size: 32px;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 rounded-4 shadow-lg" style="background: linear-gradient(135deg, #4facfe, #00f2fe); transition: transform 0.3s, box-shadow 0.3s;">
            <div class="card-body p-4">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="text-white mb-1" style="font-size: 14px; opacity: 0.9;">Rôles Couverts</div>
                  <div class="fw-bold text-white" style="font-size: 42px;">{{rolesCount}}</div>
                </div>
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 64px; height: 64px; background: rgba(255,255,255,0.2);">
                  <i class="bi bi-people text-white" style="font-size: 32px;"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tests Grid -->
      <div class="row g-4 mb-5">
        @for (category of filteredCategories; track category.name) {
          <div class="col-lg-4 col-md-6">
            <div class="card border-0 rounded-4 shadow-lg overflow-hidden" style="transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); height: 100%;">
              <div class="p-4 text-white d-flex align-items-center gap-3" [style.background]="category.color">
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px; background: rgba(255,255,255,0.25);">
                  <i class="bi bi-{{category.icon}}" style="font-size: 24px;"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-bold" style="font-size: 18px;">{{category.name}}</div>
                  <div style="font-size: 12px; opacity: 0.9;">{{category.tests.length}} tests</div>
                </div>
              </div>
              <div class="p-4" style="max-height: 320px; overflow-y: auto; background: white;">
                @for (test of category.tests; track test.name) {
                  <div class="d-flex align-items-start gap-3 p-3 rounded-3 mb-3" style="background: linear-gradient(135deg, #f8f9fa, #e9ecef); transition: all 0.2s;">
                    <div class="rounded-2 d-flex align-items-center justify-content-center flex-shrink-0" style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981, #059669);">
                      <i class="bi bi-check text-white" style="font-size: 18px;"></i>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-bold mb-1" style="font-size: 14px; color: #1a202c;">{{test.name}}</div>
                      <div class="text-muted" style="font-size: 12px; color: #718096;">{{test.description}}</div>
                    </div>
                    <span class="badge rounded-3 px-3 py-2" style="font-size: 11px; font-weight: 600; background: linear-gradient(135deg, #667eea, #764ba2); color: white;">{{test.role}}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Postes Card -->
      <div class="card border-0 rounded-4 shadow-lg">
        <div class="card-body p-5">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div class="d-flex align-items-center gap-3">
              <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: linear-gradient(135deg, #f093fb, #f5576c);">
                <i class="bi bi-briefcase text-white" style="font-size: 28px;"></i>
              </div>
              <div>
                <h5 class="fw-bold mb-0" style="font-size: 20px; color: #1a202c;">27 Postes Disponibles</h5>
                <p class="mb-0" style="color: #718096; font-size: 14px;">Formulaire de recrutement</p>
              </div>
            </div>
            <span class="badge rounded-3 px-4 py-2" style="font-size: 14px; font-weight: 600; background: linear-gradient(135deg, #4facfe, #00f2fe); color: white;">{{postes.length}} postes</span>
          </div>
          <div class="d-flex flex-wrap gap-2">
            @for (poste of postes; track poste) {
              <span class="badge rounded-3 px-4 py-2" style="font-size: 13px; font-weight: 500; background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #4338ca; transition: all 0.2s;">{{poste}}</span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card:hover {
      transform: translateY(-8px) !important;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
    }
    
    .badge:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    input:focus {
      border-color: #667eea !important;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1) !important;
      outline: none;
    }

    ::-webkit-scrollbar {
      width: 8px;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 4px;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #764ba2, #667eea);
    }
  `]
})
export class TestsDisponiblesComponent implements OnInit {
  
  searchQuery: string = '';
  filteredCategories: TestCategory[] = [];
  
  testCategories: TestCategory[] = [
    {
      name: 'Super Admin',
      icon: 'admin_panel_settings',
      color: 'linear-gradient(135deg, #e53935, #c62828)',
      tests: [
        { name: 'Accès aux sociétés', description: 'Gestion des sociétés', role: 'Super Admin' },
        { name: 'Gestion des abonnements', description: 'Voir les abonnements actifs', role: 'Super Admin' },
        { name: 'Chat avec les sociétés', description: 'Conversation avec Admin', role: 'Super Admin' }
      ]
    },
    {
      name: 'Admin Société',
      icon: 'apartment',
      color: 'linear-gradient(135deg, #1976d2, #1565c0)',
      tests: [
        { name: 'Authentification', description: 'Connexion utilisateur', role: 'Admin' },
        { name: 'Gestion des employés', description: 'CRUD employés', role: 'Admin' },
        { name: 'Création abonnement', description: 'Souscrire à un plan', role: 'Admin' },
        { name: 'Contact support', description: 'Envoyer message au Super Admin', role: 'Admin' }
      ]
    },
    {
      name: 'RH',
      icon: 'people',
      color: 'linear-gradient(135deg, #ff9800, #f57c00)',
      tests: [
        { name: 'Demandes de congés', description: 'Voir les demandes', role: 'RH' },
        { name: 'Validation congés', description: 'Approuver/rejeter', role: 'RH' },
        { name: 'Statistiques congés', description: 'Calculsolde, pris, reste', role: 'RH' },
        { name: 'Pointage', description: 'Gestion du pointage', role: 'RH' }
      ]
    },
    {
      name: 'Chef de Projet',
      icon: 'assignment',
      color: 'linear-gradient(135deg, #4caf50, #388e3c)',
      tests: [
        { name: 'Créer un projet', description: 'Nouveau projet', role: 'Chef' },
        { name: 'Tâches Kanban', description: 'todo/inprogress/done', role: 'Chef' },
        { name: 'Déplacer tâches', description: 'Changerstatut', role: 'Chef' },
        { name: 'Assigner tâches', description: 'Affecter à membre', role: 'Chef' },
        { name: 'Gérer bugs', description: 'Suivi des bugs', role: 'Chef' },
        { name: 'Suivre avancement', description: '% complétion', role: 'Chef' }
      ]
    },
    {
      name: 'Développeur',
      icon: 'code',
      color: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
      tests: [
        { name: 'Voir mes tâches', description: 'Tâches assignées', role: 'Dev' },
        { name: 'Mettre à jour statut', description: 'Changerstatut', role: 'Dev' },
        { name: 'Gérer mes bugs', description: 'Bugs assignés', role: 'Dev' },
        { name: 'Time tracking', description: 'Suivre temps', role: 'Dev' },
        { name: 'Pointage', description: 'Entrée/sortie', role: 'Dev' }
      ]
    },
    {
      name: 'Testeur QA',
      icon: 'bug_report',
      color: 'linear-gradient(135deg, #00bcd4, #00838f)',
      tests: [
        { name: 'Plans de test', description: 'Créer plans', role: 'QA' },
        { name: 'Exécuter tests', description: 'Run tests', role: 'QA' },
        { name: 'Signaler bugs', description: 'Créer bug report', role: 'QA' }
      ]
    },
    {
      name: 'Candidat',
      icon: 'person_search',
      color: 'linear-gradient(135deg, #795548, #5d4037)',
      tests: [
        { name: 'Voir offres', description: 'Liste postes ouverts', role: 'Candidat' },
        { name: 'Postuler', description: 'Envoyer candidature', role: 'Candidat' },
        { name: 'Suivre candidatures', description: 'Statutpostulations', role: 'Candidat' }
      ]
    },
    {
      name: 'Recrutement',
      icon: 'work',
      color: 'linear-gradient(135deg, #607d8b, #455a64)',
      tests: [
        { name: '27 Postes prédéfinis', description: 'Sélection poste', role: 'RH' },
        { name: 'Poste personnalisé', description: 'Autre option', role: 'RH' },
        { name: 'Filtrer candidats', description: 'Par poste', role: 'RH' },
        { name: 'Valider candidats', description: 'Accepter/rejeter', role: 'RH' }
      ]
    },
    {
      name: 'Intégration',
      icon: 'sync_alt',
      color: 'linear-gradient(135deg, #3f51b5, #303f9f)',
      tests: [
        { name: 'Flux abonnement', description: 'Admin → Super Admin', role: 'Multi' },
        { name: 'Flux validation congés', description: 'Employé → RH', role: 'Multi' },
        { name: 'Flux chat', description: 'Admin ↔ Super Admin', role: 'Multi' }
      ]
    }
  ];

  postes = [
    'Développeur Frontend', 'Développeur Backend', 'Développeur Full Stack', 'Développeur Mobile',
    'DevOps Engineer', 'Data Scientist', 'Data Analyst', 'Ingénieur QA', 'Chef de Projet',
    'Product Manager', 'UI/UX Designer', 'Graphic Designer', 'Consultant', 'Analyste Fonctionnel',
    'Architecte Logiciel', 'Tech Lead', 'Scrum Master', 'RH Manager', 'Comptable',
    'Assistant Administratif', 'Chef de Produit', 'Marketing Manager', 'Community Manager',
    'Content Manager', 'Sales Manager', 'Account Manager', 'Customer Success Manager'
  ];

  get totalTests(): number {
    return this.testCategories.reduce((sum, cat) => sum + cat.tests.length, 0);
  }

  get rolesCount(): number {
    return this.testCategories.filter(c => ['Super Admin', 'Admin Société', 'RH', 'Chef de Projet', 'Développeur', 'Testeur QA', 'Candidat'].includes(c.name)).length;
  }

  ngOnInit() {
    this.filteredCategories = [...this.testCategories];
  }

  filterTests() {
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.filteredCategories = [...this.testCategories];
      return;
    }

    const query = this.searchQuery.toLowerCase();
    this.filteredCategories = this.testCategories.map(category => ({
      ...category,
      tests: category.tests.filter(test => 
        test.name.toLowerCase().includes(query) || 
        test.description.toLowerCase().includes(query) ||
        test.role.toLowerCase().includes(query) ||
        category.name.toLowerCase().includes(query)
      )
    })).filter(category => category.tests.length > 0);
  }
}
