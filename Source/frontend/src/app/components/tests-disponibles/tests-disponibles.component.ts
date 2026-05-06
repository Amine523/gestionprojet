import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  template: `
    <div class="container-fluid py-4">
      <!-- Page Header -->
      <div class="d-flex align-items-center gap-3 p-4 rounded-4 mb-4 text-white" style="background: linear-gradient(135deg, #667eea, #764ba2);">
        <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 56px; height: 56px; background: rgba(255,255,255,0.2);">
          <i class="bi bi-clipboard-check" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-0" style="font-size: 26px;">Tests Disponibles</h1>
          <p class="mb-0" style="opacity: 0.9;">Liste des tests par rôle et fonctionnalité</p>
        </div>
      </div>

      <!-- Tests Grid -->
      <div class="row g-3 mb-4">
        @for (category of testCategories; track category.name) {
          <div class="col-lg-4 col-md-6">
            <div class="card border-0 shadow-sm overflow-hidden">
              <div class="p-3 text-white d-flex align-items-center gap-3" [style.background]="category.color">
                <i class="bi bi-{{category.icon}}" style="font-size: 22px;"></i>
                <span class="fw-bold" style="font-size: 15px;">{{category.name}}</span>
              </div>
              <div class="p-3" style="max-height: 300px; overflow-y: auto;">
                @for (test of category.tests; track test.name) {
                  <div class="d-flex align-items-center gap-2 p-2 rounded-2 mb-2" style="background: #f8f9fa;">
                    <i class="bi bi-check-circle text-success" style="font-size: 18px;"></i>
                    <div class="flex-grow-1">
                      <div class="fw-bold" style="font-size: 13px;">{{test.name}}</div>
                      <div class="text-muted" style="font-size: 11px;">{{test.description}}</div>
                    </div>
                    <span class="badge bg-info text-white" style="font-size: 10px;">{{test.role}}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Summary Card -->
      <div class="card border-0 shadow-sm mb-4">
        <div class="card-body p-4">
          <h5 class="fw-bold mb-4">Résumé des Tests</h5>
          <div class="d-flex gap-5">
            <div class="text-center">
              <div class="fw-bold" style="font-size: 32px; color: #667eea;">{{totalTests}}</div>
              <div class="text-muted" style="font-size: 13px;">Tests totaux</div>
            </div>
            <div class="text-center">
              <div class="fw-bold" style="font-size: 32px; color: #667eea;">{{testCategories.length}}</div>
              <div class="text-muted" style="font-size: 13px;">Catégories</div>
            </div>
            <div class="text-center">
              <div class="fw-bold" style="font-size: 32px; color: #667eea;">{{rolesCount}}</div>
              <div class="text-muted" style="font-size: 13px;">Rôles couverts</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Postes Card -->
      <div class="card border-0 shadow-sm">
        <div class="card-body p-4">
          <div class="d-flex align-items-center gap-2 mb-4">
            <i class="bi bi-briefcase text-primary" style="font-size: 24px;"></i>
            <h5 class="fw-bold mb-0">27 Postes Disponibles - Formulaire Recrutement</h5>
          </div>
          <div class="d-flex flex-wrap gap-2">
            @for (poste of postes; track poste) {
              <span class="badge bg-light text-secondary" style="font-size: 12px;">{{poste}}</span>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
    }
  `]
})
export class TestsDisponiblesComponent implements OnInit {
  
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

  ngOnInit() {}
}
