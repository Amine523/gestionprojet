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

    <div class="tests-container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
          <div class="header-text">
            <h1 class="page-title">Tests Disponibles</h1>
            <p class="page-subtitle">Liste complète des tests par rôle et fonctionnalité</p>
          </div>
        </div>
        <div class="search-wrapper">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input 
            type="text" 
            class="search-input"
            placeholder="Rechercher un test..."
            [(ngModel)]="searchQuery"
            (input)="filterTests()"
          >
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="stats-grid">
        <div class="stat-card stat-purple">
          <div class="stat-content">
            <span class="stat-label">Tests Totaux</span>
            <span class="stat-value">{{totalTests}}</span>
          </div>
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 11l3 3L22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
          </div>
        </div>
        <div class="stat-card stat-pink">
          <div class="stat-content">
            <span class="stat-label">Catégories</span>
            <span class="stat-value">{{testCategories.length}}</span>
          </div>
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
          </div>
        </div>
        <div class="stat-card stat-cyan">
          <div class="stat-content">
            <span class="stat-label">Rôles Couverts</span>
            <span class="stat-value">{{rolesCount}}</span>
          </div>
          <div class="stat-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
        </div>
      </div>

      <!-- Tests Grid -->
      <div class="tests-grid">
        @for (category of filteredCategories; track category.name) {
          <div class="category-card">
            <div class="category-header" [style.background]="category.color">
              <div class="category-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
              <div class="category-info">
                <h3 class="category-name">{{category.name}}</h3>
                <span class="category-count">{{category.tests.length}} tests</span>
              </div>
            </div>
            <div class="category-body">
              @for (test of category.tests; track test.name) {
                <div class="test-item">
                  <div class="test-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                  <div class="test-info">
                    <h4 class="test-name">{{test.name}}</h4>
                    <p class="test-description">{{test.description}}</p>
                  </div>
                  <span class="test-role">{{test.role}}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Postes Card -->
      <div class="postes-card">
        <div class="postes-header">
          <div class="postes-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <div class="postes-info">
            <h3 class="postes-title">27 Postes Disponibles</h3>
            <p class="postes-subtitle">Formulaire de recrutement</p>
          </div>
          <span class="postes-count">{{postes.length}} postes</span>
        </div>
        <div class="postes-list">
          @for (poste of postes; track poste) {
            <span class="poste-badge">{{poste}}</span>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .tests-container {
      padding: var(--space-xl);
      background: #f5f7fa;
      min-height: 100vh;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-xl);
      gap: var(--space-lg);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: var(--space-lg);
    }

    .header-icon {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-xl);
      background: linear-gradient(135deg, #667eea, #764ba2);
      box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .header-text {
      display: flex;
      flex-direction: column;
    }

    .page-title {
      font-size: 32px;
      font-weight: var(--font-weight-bold);
      color: #1a202c;
      margin: 0 0 var(--space-xs);
    }

    .page-subtitle {
      color: #718096;
      font-size: 15px;
      margin: 0;
    }

    .search-wrapper {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: var(--radius-lg);
      padding: var(--space-sm) var(--space-md);
      width: 300px;
      transition: all 0.3s;
    }

    .search-wrapper:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .search-input {
      border: none;
      background: none;
      outline: none;
      width: 100%;
      font-size: var(--font-size-sm);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .stat-card {
      border-radius: var(--radius-xl);
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: var(--shadow-lg);
      transition: transform 0.3s, box-shadow 0.3s;
      color: white;
    }

    .stat-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .stat-card.stat-purple {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .stat-card.stat-pink {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }

    .stat-card.stat-cyan {
      background: linear-gradient(135deg, #4facfe, #00f2fe);
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: var(--space-xs);
    }

    .stat-value {
      font-size: 42px;
      font-weight: var(--font-weight-bold);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .tests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: var(--space-lg);
      margin-bottom: var(--space-xl);
    }

    .category-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
    }

    .category-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .category-header {
      padding: var(--space-lg);
      display: flex;
      align-items: center;
      gap: var(--space-md);
      color: white;
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .category-info {
      flex: 1;
    }

    .category-name {
      font-size: 18px;
      font-weight: var(--font-weight-bold);
      margin: 0;
    }

    .category-count {
      font-size: 12px;
      opacity: 0.9;
    }

    .category-body {
      padding: var(--space-lg);
      max-height: 320px;
      overflow-y: auto;
      background: white;
    }

    .test-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
      padding: var(--space-md);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-md);
      background: linear-gradient(135deg, #f8f9fa, #e9ecef);
      transition: all 0.2s;
    }

    .test-item:hover {
      transform: scale(1.02);
    }

    .test-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #10b981, #059669);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .test-info {
      flex: 1;
    }

    .test-name {
      font-size: 14px;
      font-weight: var(--font-weight-bold);
      color: #1a202c;
      margin: 0 0 var(--space-xs);
    }

    .test-description {
      font-size: 12px;
      color: #718096;
      margin: 0;
    }

    .test-role {
      padding: var(--space-xs) var(--space-md);
      border-radius: var(--radius-lg);
      font-size: 11px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
    }

    .postes-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-lg);
      padding: var(--space-xl);
    }

    .postes-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--space-lg);
      gap: var(--space-md);
    }

    .postes-header-left {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .postes-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #f093fb, #f5576c);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .postes-info {
      display: flex;
      flex-direction: column;
    }

    .postes-title {
      font-size: 20px;
      font-weight: var(--font-weight-bold);
      color: #1a202c;
      margin: 0 0 var(--space-xs);
    }

    .postes-subtitle {
      color: #718096;
      font-size: 14px;
      margin: 0;
    }

    .postes-count {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-lg);
      font-size: 14px;
      font-weight: 600;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      color: white;
    }

    .postes-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--space-sm);
    }

    .poste-badge {
      padding: var(--space-sm) var(--space-lg);
      border-radius: var(--radius-lg);
      font-size: 13px;
      font-weight: 500;
      background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
      color: #4338ca;
      transition: all 0.2s;
    }

    .poste-badge:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
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

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .search-wrapper {
        width: 100%;
      }

      .stats-grid {
        grid-template-columns: 1fr;
      }

      .tests-grid {
        grid-template-columns: 1fr;
      }

      .postes-header {
        flex-direction: column;
        align-items: flex-start;
      }
    }

    /* Dark mode */
    :host-context(.dark) .tests-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .page-title,
    :host-context(.dark) .test-name,
    :host-context(.dark) .postes-title {
      color: var(--color-text);
    }

    :host-context(.dark) .page-subtitle,
    :host-context(.dark) .test-description,
    :host-context(.dark) .postes-subtitle {
      color: var(--color-text-muted);
    }

    :host-context(.dark) .search-wrapper {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .category-card,
    :host-context(.dark) .postes-card {
      background: var(--color-surface);
    }

    :host-context(.dark) .category-body {
      background: var(--color-surface);
    }

    :host-context(.dark) .test-item {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .poste-badge {
      background: rgba(255, 255, 255, 0.1);
      color: var(--color-text);
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
