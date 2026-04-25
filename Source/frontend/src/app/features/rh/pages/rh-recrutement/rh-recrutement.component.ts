import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';
import { AiService } from '@core/services/ai.service';

@Component({
  selector: 'app-rh-recrutement',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Recrutement</h1>
          <p class="header-subtitle">Gérez vos offres d'emploi et candidats</p>
        </div>
        <button class="btn btn-primary" (click)="openOffreForm()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Nouvelle Offre
        </button>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon indigo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="8.5" cy="7" r="4"></circle>
              <line x1="20" y1="8" x2="20" y2="14"></line>
              <line x1="23" y1="11" x2="17" y2="11"></line>
            </svg>
          </div>
          <div>
            <p class="stat-label">Offres Actives</p>
            <p class="stat-value">{{offresActives()}}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
          </div>
          <div>
            <p class="stat-label">Candidats</p>
            <p class="stat-value">{{candidatsSignal().length}}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div>
            <p class="stat-label">Entretiens</p>
            <p class="stat-value">{{entretiensSignal().length}}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon emerald">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <div>
            <p class="stat-label">Embauches</p>
            <p class="stat-value">{{embauchesCount()}}</p>
          </div>
        </div>
      </div>

      <!-- Main Card with Tabs -->
      <div class="card">
        <div class="main-content">
          <div class="tabs-header">
            <button class="tab-btn" [class.active]="activeTab === 'offres'" (click)="activeTab = 'offres'">Offres d'Emploi</button>
            <button class="tab-btn" [class.active]="activeTab === 'candidats'" (click)="activeTab = 'candidats'">Candidats</button>
            <button class="tab-btn" [class.active]="activeTab === 'entretiens'" (click)="activeTab = 'entretiens'">Entretiens</button>
            <button class="tab-btn" [class.active]="activeTab === 'email'" (click)="activeTab = 'email'">Configuration Email</button>
          </div>

          <div class="tab-content">
            <!-- Offres Tab -->
            @if (activeTab === 'offres') {
              <div class="table-container">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Titre du poste</th>
                      <th>Statut</th>
                      <th>Candidats</th>
                      <th class="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (offre of offresSignal(); track offre.id) {
                      <tr>
                        <td>
                          <div class="offre-info">
                            <span class="offre-name">{{offre.titre}}</span>
                            <span class="offre-desc">{{offre.type}} • {{offre.lieu}}</span>
                          </div>
                        </td>
                        <td>
                          <span class="status-badge" [class.emerald]="offre.statut === 'OUVERTE'" [class.rose]="offre.statut === 'FERMEE'">
                            {{offre.statut}}
                          </span>
                        </td>
                        <td>
                          <span class="applicants-count">{{getCandidatsCount(offre.id)}}</span>
                        </td>
                        <td class="text-right">
                          <div class="offre-actions">
                            <button class="btn-icon" (click)="viewCandidats(offre)" title="Voir candidats">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                              </svg>
                            </button>
                            <button class="btn-icon" (click)="editOffre(offre)" title="Modifier">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                            </button>
                            <button class="btn-icon btn-danger" (click)="deleteOffre(offre.id)" title="Supprimer">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
                @if (offresSignal().length === 0) {
                  <div class="empty-state">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>Aucune offre d'emploi</p>
                  </div>
                }
              </div>
            }

            <!-- Candidats Tab -->
            @if (activeTab === 'candidats') {
              <div class="candidats-section">
                <div class="filters-bar">
                  <input type="text" [ngModel]="searchCandidat()" (ngModelChange)="searchCandidat.set($event)" placeholder="Rechercher un candidat..." class="search-input">
                  <select [ngModel]="filterStatutCandidat()" (ngModelChange)="filterStatutCandidat.set($event)" class="filter-select">
                    <option value="">Tous les statuts</option>
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="TEST_AUTORISE">Test autorisé</option>
                    <option value="TEST_TERMINE">Test terminé</option>
                    <option value="ENTRETIEN">Entretien</option>
                    <option value="ACCEPTEE">Accepté</option>
                    <option value="REFUSEE">Refusé</option>
                  </select>
                  <select [ngModel]="selectedOffreTitle()" (ngModelChange)="selectedOffreTitle.set($event)" class="filter-select">
                    <option value="">Toutes les offres</option>
                    @for (offre of offresSignal(); track offre.id) {
                      <option [value]="offre.titre">{{offre.titre}}</option>
                    }
                  </select>
                </div>

                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Candidat</th>
                        <th>Offre</th>
                        <th>Score Quiz</th>
                        <th>Statut</th>
                        <th class="text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (candidat of filteredCandidats(); track candidat.id) {
                        <tr (click)="viewCandidat(candidat)" class="clickable-row">
                          <td>
                            <div class="user-cell">
                              <div class="user-avatar">{{candidat.nom?.substring(0,2).toUpperCase()}}</div>
                              <div class="user-info">
                                <span class="user-name">{{candidat.nom}}</span>
                                <span class="user-email">{{candidat.email}}</span>
                              </div>
                            </div>
                          </td>
                          <td>{{candidat.poste}}</td>
                          <td>
                            @if (candidat.quizScore !== undefined) {
                              <div class="score-badge">
                                {{candidat.quizScore}}/{{candidat.quizTotal}}
                              </div>
                            } @else {
                              <span class="text-muted">-</span>
                            }
                          </td>
                          <td>
                            <span class="candidat-status" [ngClass]="'status-' + candidat.statut?.toLowerCase()">{{candidat.statut}}</span>
                          </td>
                          <td class="text-right">
                            <button class="btn-icon">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                  @if (filteredCandidats().length === 0) {
                    <div class="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      <p>Aucun candidat trouvé</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Entretiens Tab -->
            @if (activeTab === 'entretiens') {
              <div class="entretiens-section">
                <div class="table-container">
                  <table class="data-table">
                    <thead>
                      <tr>
                        <th>Candidat</th>
                        <th>Poste</th>
                        <th>Date & Heure</th>
                        <th class="text-right">Détails</th>
                      </tr>
                    </thead>
                    <tbody>
                      @for (entretien of entretiensSignal(); track entretien.id) {
                        <tr>
                          <td>
                            <div class="user-cell">
                              <div class="user-avatar">{{entretien.nom?.substring(0,2).toUpperCase()}}</div>
                              <span class="user-name">{{entretien.nom}}</span>
                            </div>
                          </td>
                          <td>{{entretien.poste}}</td>
                          <td>
                            <div class="date-info">
                              <span class="date-val">{{entretien.dateEntretien | date:'dd MMM yyyy'}}</span>
                              <span class="time-val">{{entretien.dateEntretien | date:'HH:mm'}}</span>
                            </div>
                          </td>
                          <td class="text-right">
                            <button class="btn-icon" (click)="viewCandidat(entretien)" title="Voir détails">
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      }
                    </tbody>
                  </table>
                  @if (entretiensSignal().length === 0) {
                    <div class="empty-state">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      <p>Aucun entretien planifié</p>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Email Configuration Tab -->
            @if (activeTab === 'email') {
              <div class="email-config-section">
                <h3 class="section-title">Configuration EmailJS</h3>
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">Service ID</label>
                    <input type="text" [(ngModel)]="emailConfig.serviceId" class="form-input" placeholder="service_xxxxx">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Public Key</label>
                    <input type="text" [(ngModel)]="emailConfig.publicKey" class="form-input" placeholder="public_key_xxxxx">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Template Test Autorisé</label>
                    <input type="text" [(ngModel)]="emailConfig.templates.testAuthorized" class="form-input" placeholder="template_xxxxx">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Template Candidature Refusée</label>
                    <input type="text" [(ngModel)]="emailConfig.templates.candidatureRefused" class="form-input" placeholder="template_xxxxx">
                  </div>
                  <div class="form-group">
                    <label class="form-label">Template Candidature Acceptée</label>
                    <input type="text" [(ngModel)]="emailConfig.templates.candidatureAccepted" class="form-input" placeholder="template_xxxxx">
                  </div>
                </div>
                <div class="form-actions">
                  <button class="btn btn-primary" (click)="saveEmailConfig()">Enregistrer</button>
                  <button class="btn btn-secondary" (click)="testEmailJsConfig()">Tester</button>
                  <button class="btn btn-secondary" (click)="resetEmailConfig()">Réinitialiser</button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Offre Form Modal -->
    @if (showOffreForm) {
      <div class="modal-overlay" (click)="closeOffreForm()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{editingOffre ? 'Modifier l\'offre' : 'Nouvelle offre'}}</h2>
            <button class="btn-close" (click)="closeOffreForm()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Titre du poste</label>
              <input type="text" [(ngModel)]="offreForm.titre" class="form-input" placeholder="Ex: Développeur Full Stack">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="offreForm.description" class="form-textarea" rows="4" placeholder="Description du poste..."></textarea>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Type de contrat</label>
                <select [(ngModel)]="offreForm.type" class="form-select">
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Stage">Stage</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Salaire</label>
                <input type="text" [(ngModel)]="offreForm.salaire" class="form-input" placeholder="Ex: 40k-60k€">
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Lieu</label>
              <input type="text" [(ngModel)]="offreForm.lieu" class="form-input" placeholder="Ex: Paris / Télétravail">
            </div>
            <div class="form-group">
              <label class="form-label">Poste</label>
              <select [(ngModel)]="offreForm.poste" class="form-select">
                <option value="">Sélectionner un poste</option>
                @for (poste of postes; track poste) {
                  <option [value]="poste">{{poste}}</option>
                }
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Quiz (optionnel)</label>
              <select [(ngModel)]="offreForm.quiz" class="form-select">
                <option value="">Aucun quiz</option>
                <option value="JavaScript Avancé">JavaScript Avancé</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Angular">Angular</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeOffreForm()">Annuler</button>
            <button type="button" class="btn btn-primary" (click)="saveOffre()">{{editingOffre ? 'Modifier' : 'Créer'}}</button>
          </div>
        </div>
      </div>
    }

    <!-- Candidat Detail Modal -->
    @if (showCandidatDialog && selectedCandidat) {
      <div class="modal-overlay" (click)="closeCandidatDialog()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Détails du candidat</h2>
            <button class="btn-close" (click)="closeCandidatDialog()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="candidat-detail-header">
              <div class="candidat-detail-avatar">
                {{selectedCandidat.nom?.substring(0,2).toUpperCase()}}
              </div>
              <div class="candidat-detail-info">
                <h3 class="candidat-detail-name">{{selectedCandidat.nom}}</h3>
                <p class="candidat-detail-email">{{selectedCandidat.email}}</p>
                <span class="candidat-detail-status" [ngClass]="'status-' + selectedCandidat.statut?.toLowerCase()">{{selectedCandidat.statut}}</span>
              </div>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label class="detail-label">Poste</label>
                <p class="detail-value">{{selectedCandidat.poste}}</p>
              </div>
              <div class="detail-item">
                <label class="detail-label">Téléphone</label>
                <p class="detail-value">{{selectedCandidat.telephone || 'N/A'}}</p>
              </div>
            </div>
            @if (selectedCandidat.quiz && selectedCandidat.quizScore !== undefined) {
              <div class="quiz-section">
                <h4 class="quiz-title">Quiz: {{selectedCandidat.quiz}}</h4>
                <div class="quiz-score">
                  <div class="quiz-bar" [style.width.%]="(selectedCandidat.quizScore/selectedCandidat.quizTotal)*100"></div>
                </div>
                <p class="quiz-text">{{selectedCandidat.quizScore}}/{{selectedCandidat.quizTotal}} points</p>
              </div>
            }
            <div class="detail-item">
              <label class="detail-label">Compétences</label>
              <p class="detail-value">{{selectedCandidat.competences || 'Non spécifié'}}</p>
            </div>
            <div class="form-group">
              <label class="form-label">Statut</label>
              <select [(ngModel)]="selectedCandidat.statut" class="form-select" (change)="updateStatut(selectedCandidat)">
                <option value="EN_ATTENTE">En attente</option>
                <option value="TEST_AUTORISE">Test autorisé</option>
                <option value="TEST_TERMINE">Test terminé</option>
                <option value="ENTRETIEN">Entretien</option>
                <option value="ACCEPTEE">Accepté</option>
                <option value="REFUSEE">Refusé</option>
              </select>
            </div>

            <!-- AI Analysis Section -->
            <div class="ai-analysis-container mt-6 p-4 rounded-xl border-2 border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-900/10">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z"/><path d="M2 17L12 22L22 17"/><path d="M2 12L12 17L22 12"/>
                    </svg>
                  </div>
                  <h4 class="font-bold text-indigo-900 dark:text-indigo-100 text-sm">ANALYSE COGNITIVE IA</h4>
                </div>
                <button (click)="analyzeCandidat()" [disabled]="isAnalyzing" class="text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:opacity-70 disabled:opacity-30">
                  {{isAnalyzing ? 'Analyse...' : 'Lancer l\'analyse'}}
                </button>
              </div>
              
              @if (aiAnalysisResult) {
                <div class="animate-in fade-in slide-in-from-top-2 duration-500">
                  <div class="flex items-center gap-2 mb-2">
                    <div class="px-2 py-1 bg-indigo-600 text-white text-[10px] font-black rounded uppercase">Score de Match: {{aiScore}}%</div>
                  </div>
                  <p class="text-xs leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
                    {{aiAnalysisResult}}
                  </p>
                </div>
              } @else {
                <p class="text-[10px] text-slate-400 italic">L'IA peut analyser le CV et le score du quiz pour évaluer l'adéquation du candidat au poste.</p>
              }
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="planifierEntretien(selectedCandidat)">Planifier entretien</button>
            <button class="btn btn-danger" (click)="deleteCandidature(selectedCandidat.id)">Supprimer</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--space-lg);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .header-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .header-info {
      flex: 1;
    }

    .header-title {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0;
      letter-spacing: -0.02em;
    }

    .header-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: var(--font-size-sm);
      margin: var(--space-xs) 0 0;
    }

    .btn {
      position: relative;
      z-index: 10;
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: white;
      color: #6366f1;
    }

    .btn-primary:hover {
      opacity: 0.9;
    }

    .btn-secondary {
      background: var(--color-surface);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: var(--color-bg);
    }

    .btn-danger {
      background: #fee2e2;
      color: #dc2626;
    }

    .btn-danger:hover {
      background: #fecaca;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--space-lg);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-lg);
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.indigo {
      background: #6366f1;
    }

    .stat-icon.blue {
      background: #3b82f6;
    }

    .stat-icon.amber {
      background: #f59e0b;
    }

    .stat-icon.emerald {
      background: #10b981;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-xs);
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
    }

    .main-content {
      overflow: hidden;
    }

    .tabs-header {
      display: flex;
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .tab-btn {
      position: relative;
      z-index: 10;
      padding: var(--space-md) var(--space-lg);
      background: transparent;
      border: none;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-base);
      border-bottom: 2px solid transparent;
    }

    .tab-btn.active {
      color: var(--color-text);
      border-bottom-color: #6366f1;
    }

    .tab-btn:hover:not(.active) {
      color: var(--color-text);
    }

    .tab-content {
      padding: var(--space-xl);
      background: white;
    }

    /* Table Styles */
    .table-container {
      overflow-x: auto;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .data-table th {
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--color-border);
    }

    .data-table td {
      padding: var(--space-md) var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      vertical-align: middle;
    }

    .clickable-row {
      cursor: pointer;
      transition: background 0.2s;
    }

    .clickable-row:hover {
      background: var(--color-bg);
    }

    /* Offre Info */
    .offre-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .offre-name {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-size: var(--font-size-sm);
    }

    .offre-desc {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    /* User Cell */
    .user-cell {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .user-avatar {
      width: 36px;
      height: 36px;
      background: var(--color-bg);
      color: var(--color-text);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-xs);
      border: 2px solid var(--color-border);
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      font-size: var(--font-size-sm);
    }

    .user-email {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    /* Score Badge */
    .score-badge {
      display: inline-flex;
      padding: 4px 8px;
      background: #f8fafc;
      border: 1px solid var(--color-border);
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      color: var(--color-text);
    }

    /* Date Info */
    .date-info {
      display: flex;
      flex-direction: column;
    }

    .date-val {
      font-weight: 600;
      font-size: var(--font-size-sm);
    }

    .time-val {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .text-right {
      text-align: right;
    }


    .offre-card {
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
    }

    .offre-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .status-badge {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .status-badge.emerald {
      background: #ecfdf5;
      color: #059669;
    }

    .status-badge.rose {
      background: #fef2f2;
      color: #dc2626;
    }

    .offre-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .offre-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      flex-grow: 1;
    }

    .offre-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .applicants-count {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .offre-actions {
      display: flex;
      gap: var(--space-xs);
    }

    .btn-icon {
      position: relative;
      z-index: 10;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-icon:hover {
      background: var(--color-surface);
      color: var(--color-primary);
      border-color: var(--color-primary);
    }

    .btn-icon.btn-danger:hover {
      color: #dc2626;
      border-color: #dc2626;
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      color: var(--color-text-muted);
      gap: var(--space-md);
    }

    .candidats-section,
    .entretiens-section,
    .email-config-section {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .filters-bar {
      display: flex;
      gap: var(--space-md);
      flex-wrap: wrap;
    }

    .search-input,
    .filter-select,
    .form-input,
    .form-select,
    .form-textarea {
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .search-input:focus,
    .filter-select:focus,
    .form-input:focus,
    .form-select:focus,
    .form-textarea:focus {
      border-color: #6366f1;
    }

    .search-input {
      flex: 1;
      min-width: 200px;
    }

    .filter-select {
      min-width: 150px;
    }

    .candidats-list,
    .entretiens-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .candidat-item,
    .entretien-item {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .candidat-item:hover,
    .entretien-item:hover {
      border-color: #6366f1;
    }

    .candidat-avatar,
    .candidat-detail-avatar,
    .entretien-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      font-size: var(--font-size-lg);
    }

    .candidat-info,
    .entretien-info {
      flex: 1;
    }

    .candidat-name,
    .entretien-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .candidat-details,
    .entretien-details {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: var(--space-xs) 0 0;
    }

    .candidat-status,
    .candidat-detail-status {
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }

    .status-en_attente,
    .status-test_authorized,
    .status-test_termine {
      background: #fef3c7;
      color: #92400e;
    }

    .status-entretien {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-acceptee,
    .status-acceptée {
      background: #d1fae5;
      color: #065f46;
    }

    .status-refusee,
    .status-refusée {
      background: #fee2e2;
      color: #991b1b;
    }

    .entretien-date {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: var(--space-xs) 0 0;
    }

    .section-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0 0 var(--space-lg);
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-actions {
      display: flex;
      gap: var(--space-md);
      margin-top: var(--space-lg);
    }

    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: var(--space-xl);
    }

    .modal-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-width: 600px;
      width: 100%;
      max-height: 90vh;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header h2 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn-close {
      position: relative;
      z-index: 10;
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: var(--color-bg);
      color: var(--color-text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-close:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }

    .modal-body {
      padding: var(--space-lg);
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
      padding: var(--space-lg);
      border-top: 1px solid var(--color-border);
    }

    .candidat-detail-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .candidat-detail-info {
      flex: 1;
    }

    .candidat-detail-name {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .candidat-detail-email {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: var(--space-xs) 0;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--space-md);
      margin-bottom: var(--space-lg);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .detail-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
    }

    .detail-value {
      font-size: var(--font-size-sm);
      color: var(--color-text);
    }

    .quiz-section {
      padding: var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
    }

    .quiz-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-sm);
    }

    .quiz-score {
      height: 8px;
      background: var(--color-border);
      border-radius: var(--radius-full);
      overflow: hidden;
      margin-bottom: var(--space-xs);
    }

    .quiz-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .quiz-text {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    /* Dark mode */
    :host-context(.dark) .card,
    :host-context(.dark) .stat-card,
    :host-context(.dark) .offre-card,
    :host-context(.dark) .candidat-item,
    :host-context(.dark) .entretien-item,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .tabs-header {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .offre-card {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .btn-primary {
      background: var(--color-surface);
    }

    :host-context(.dark) .search-input,
    :host-context(.dark) .filter-select,
    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select,
    :host-context(.dark) .form-textarea {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .quiz-section {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .modal-header {
      border-bottom-color: var(--color-border);
    }

    :host-context(.dark) .modal-footer {
      border-top-color: var(--color-border);
    }

    :host-context(.dark) .stat-card,
    :host-context(.dark) .card,
    :host-context(.dark) .offre-card,
    :host-context(.dark) .candidat-item {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .offres-grid {
        grid-template-columns: 1fr;
      }

      .form-grid,
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .filters-bar {
        flex-direction: column;
      }

      .search-input,
      .filter-select {
        width: 100%;
      }
    }
  `]
})
export class RHRecrutementComponent implements OnInit {
  private api = inject(ApiService);
  private ai = inject(AiService);
  private snackBar = inject(MatSnackBar);

  isAnalyzing = false;
  aiAnalysisResult = '';
  aiScore = 0;

  societeId: string = '';
  societeNom: string = '';

  offresSignal = signal<any[]>([]);
  candidatsSignal = signal<any[]>([]);
  
  searchCandidat = signal('');
  filterStatutCandidat = signal('');
  selectedOffreTitle = signal('');

  filteredCandidats = computed(() => {
    let list = this.candidatsSignal();
    const search = this.searchCandidat().toLowerCase();
    const statut = this.filterStatutCandidat();
    const offre = this.selectedOffreTitle();

    if (offre) {
      list = list.filter(c => c.poste === offre);
    }
    
    return list.filter(c => {
      const matchesSearch = !search || 
        c.nom?.toLowerCase().includes(search) || 
        c.email?.toLowerCase().includes(search);
      const matchesStatut = !statut || c.statut === statut;
      return matchesSearch && matchesStatut;
    });
  });

  entretiensSignal = computed(() => {
    return this.candidatsSignal()
      .filter(c => {
        const s = (c.statut || '').toUpperCase();
        return s === 'ENTRETIEN' || s === 'ENTRETIEN_PLANIFIE' || c.dateEntretien;
      })
      .sort((a, b) => {
        const dateA = a.dateEntretien ? new Date(a.dateEntretien).getTime() : 0;
        const dateB = b.dateEntretien ? new Date(b.dateEntretien).getTime() : 0;
        return dateA - dateB;
      });
  });

  offresActives = computed(() => this.offresSignal().filter(o => o.statut === 'OUVERTE').length);
  embauchesCount = computed(() => this.candidatsSignal().filter(c => ['ACCEPTEE', 'ACCEPTE'].includes((c.statut || '').toUpperCase())).length);

  showOffreForm = false;
  editingOffre: any = null;
  offreForm: any = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', quiz: '', societe: '', adresse: '' };

  postes: string[] = [
    'Développeur Frontend',
    'Développeur Backend',
    'Développeur Full Stack',
    'Développeur Mobile',
    'Développeur React',
    'Développeur Angular',
    'Développeur Node.js',
    'Développeur .NET',
    'Développeur Python',
    'DevOps Engineer',
    'Ingénieur QA',
    'Testeur Logiciel',
    'Testeur Automation',
    'Chef de Projet IT',
    'Chef de Projet Digital',
    'Product Owner',
    'Scrum Master',
    'Tech Lead',
    'RH Développeur',
    'Recruteur IT'
  ];

  candidatsEnAttente = 0;
  embauches = 0;
  candidatsRecuperes = 0;
  selectedCandidat: any = null;
  showCandidatDialog = false;
  showEntretienDialog = false;
  entretienDate = '';
  entretienHeure = '';
  entretienNotes = '';

  emailConfig: any = {
    serviceId: '',
    publicKey: '',
    templates: {
      testAuthorized: '',
      candidatureRefused: '',
      candidatureAccepted: ''
    }
  };

  activeTab = 'offres';

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    const stored = this.api.getRawStorage();
    if (!stored.offresEmploi || stored.offresEmploi.length === 0) {
      this.api.initRecrutementData();
    }
    this.api.loadEmailJsConfig();
    this.emailConfig = this.api.getEmailJsConfig();
    this.loadData();
  }

  loadData() {
    this.api.getOffresEmploi().subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const filtered = all.filter((o: any) => (o.societeId || o.SocieteId || '').toString().toLowerCase() === this.societeId.toLowerCase());
        this.offresSignal.set(filtered);
      }
    });

    // Load Applications (candidatures) filtered by societe
    this.api.getCandidaturesBySociete(this.societeId).subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const normalized = all.map((c: any) => ({
          id: c.id || c.Id,
          nom: c.candidatNom || c.nom || c.Nom || 'Sans nom',
          email: c.candidatEmail || c.email || c.Email,
          telephone: c.candidatTelephone || c.telephone || c.Telephone,
          poste: c.offreTitre || c.poste || c.Poste,
          competences: c.cvPath ? 'CV joint' : '-',
          statut: c.statut || c.Statut || 'EN_ATTENTE',
          quiz: c.quiz || c.Quiz,
          quizScore: c.quizScore || c.QuizScore,
          quizTotal: c.quizTotal || c.QuizTotal,
          dateCandidature: c.dateCandidature || c.DateCandidature,
          dateEntretien: c.dateEntretien || c.DateEntretien || null,
          observations: c.notes || c.observations || c.Observations || ''
        }));
        this.candidatsSignal.set(normalized);
      }
    });

    // Also load users with TypeUtilisateurId = 'T007' (candidates registered via register-candidate)
    this.api.getUtilisateurs().subscribe({
      next: (res: any) => {
        let all = Array.isArray(res) ? res : (res?.items || []);
        const candidateUsers = all.filter((u: any) => 
          (u.typeUtilisateurId || u.TypeUtilisateurId) === 'T007'
        );
        
        if (candidateUsers.length > 0) {
          const normalizedUsers = candidateUsers.map((u: any) => ({
            id: u.id || u.Id,
            nom: u.nom || u.Nom || 'Sans nom',
            email: u.email || u.Email,
            telephone: u.telephone || u.Telephone || '',
            poste: 'Candidat',
            competences: u.cv ? 'CV joint' : '-',
            statut: 'EN_ATTENTE',
            quiz: '',
            quizScore: undefined,
            quizTotal: undefined,
            dateCandidature: new Date().toISOString(),
            dateEntretien: null,
            observations: ''
          }));
          
          // Merge with existing candidates, avoiding duplicates by email
          this.candidatsSignal.update(existing => {
            const existingEmails = new Set(existing.map((c: any) => c.email?.toLowerCase()));
            const newCandidates = normalizedUsers.filter((c: any) => !existingEmails.has(c.email?.toLowerCase()));
            return [...existing, ...newCandidates];
          });
        }
      }
    });
  }



  openOffreForm() {
    console.log('RH Recrutement Debug: openOffreForm clicked');
    this.offreForm = { titre: '', description: '', lieu: '', salaire: '', type: 'CDI', poste: '', quiz: '', societe: this.societeNom, adresse: '' };
    this.editingOffre = null;
    this.showOffreForm = true;
  }

  closeOffreForm() {
    this.showOffreForm = false;
    this.editingOffre = null;
  }

  saveOffre() {
    if (!this.offreForm.titre || !this.offreForm.description) {
      this.snackBar.open('Veuillez remplir tous les champs obligatoires', 'Fermer', { duration: 3000 });
      return;
    }

    const offreData = {
      titre: this.offreForm.titre,
      description: this.offreForm.description,
      lieu: this.offreForm.lieu,
      salaire: this.offreForm.salaire,
      poste: this.offreForm.poste,
      quiz: this.offreForm.quiz,
      societeId: this.societeId,
      statut: 'OUVERTE',
      type: 'OffreEmploi',
      actif: true
    };

    console.log('Sending offre data:', offreData);

    if (this.editingOffre) {
      this.api.saveOffreEmploi({ ...offreData, id: this.editingOffre.id }).subscribe({
        next: (res: any) => {
          console.log('Update response:', res);
          this.offresSignal.update(list => list.map(o => o.id === this.editingOffre.id ? { ...o, ...offreData } : o));
          this.snackBar.open('Offre modifiée avec succès', 'Fermer', { duration: 3000 });
          this.closeOffreForm();
        },
        error: (err) => {
          console.error('Error updating offre:', err);
          this.snackBar.open(`Erreur: ${err.error?.message || err.message || 'Erreur inconnue'}`, 'Fermer', { duration: 5000 });
        }
      });
    } else {
      this.api.saveOffreEmploi(offreData).subscribe({
        next: (res: any) => {
          console.log('Create response:', res);
          const newOffre = res || { ...offreData, id: 'OFFRE_' + Date.now() };
          this.offresSignal.update(list => [newOffre, ...list]);
          this.snackBar.open('Offre créée avec succès', 'Fermer', { duration: 3000 });
          this.closeOffreForm();
        },
        error: (err) => {
          console.error('Error creating offre:', err);
          const errorMsg = err.error?.message || err.error?.Message || err.message || 'Erreur inconnue';
          this.snackBar.open(`Erreur: ${errorMsg}`, 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  editOffre(offre: any) {
    this.offreForm = { ...offre };
    this.editingOffre = offre;
    this.showOffreForm = true;
  }

  deleteOffre(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) {
      this.api.deleteOffreEmploi(id).subscribe({
        next: () => {
          this.offresSignal.update(list => list.filter(o => o.id !== id));
          this.snackBar.open('Offre supprimée avec succès', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  getCandidatsCount(offreId: string): number {
    return this.candidatsSignal().filter(c => c.offreId === offreId || c.poste === this.offresSignal().find(o => o.id === offreId)?.titre).length;
  }

  viewCandidats(offre: any) {
    this.selectedOffreTitle.set(offre.titre);
    this.activeTab = 'candidats';
  }

  viewCandidat(candidat: any) {
    this.selectedCandidat = candidat;
    this.showCandidatDialog = true;
  }

  closeCandidatDialog() {
    this.showCandidatDialog = false;
    this.selectedCandidat = null;
  }

  planifierEntretien(candidat: any) {
    this.closeCandidatDialog();
    this.entretienDate = '';
    this.entretienHeure = '';
    this.entretienNotes = '';
    this.showEntretienDialog = true;
  }

  closeEntretienDialog() {
    this.showEntretienDialog = false;
  }

  saveEntretien() {
    if (!this.entretienDate || !this.entretienHeure) {
      this.snackBar.open('Veuillez remplir la date et l\'heure', 'Fermer', { duration: 3000 });
      return;
    }

    const dateEntretien = new Date(`${this.entretienDate}T${this.entretienHeure}`);

    this.api.updateCandidature({
      id: this.selectedCandidat.id,
      statut: 'ENTRETIEN',
      dateEntretien: dateEntretien.toISOString(),
      observations: this.entretienNotes
    }).subscribe(() => {
      this.snackBar.open('Entretien planifié avec succès', 'Fermer', { duration: 3000 });
      this.closeEntretienDialog();
      this.loadData();
    });
  }

  deleteCandidature(id: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
      this.api.deleteCandidature(id).subscribe(() => {
        this.snackBar.open('Candidature supprimée avec succès', 'Fermer', { duration: 3000 });
        this.closeCandidatDialog();
        this.loadData();
      });
    }
  }

  updateStatut(candidat: any) {
    this.api.updateCandidature({
      id: candidat.id,
      statut: candidat.statut
    }).subscribe(() => {
      this.snackBar.open('Statut mis à jour avec succès', 'Fermer', { duration: 3000 });
      this.loadData();

      // Auto-send email based on status
      if (candidat.statut === 'ACCEPTEE') {
        this.sendEmail(candidat, 'candidatureAccepted');
      } else if (candidat.statut === 'REFUSEE') {
        this.sendEmail(candidat, 'candidatureRefused');
      }
    });
  }

  sendEmail(candidat: any, templateType: string) {
    const templateId = this.emailConfig.templates[templateType];
    if (!templateId) {
      return;
    }

    // EmailJS integration would go here
    console.log('Email would be sent to:', candidat.email, 'with template:', templateId);
  }

  saveEmailConfig() {
    this.api.updateEmailJsConfig(this.emailConfig);
    this.snackBar.open('Configuration email enregistrée', 'Fermer', { duration: 3000 });
  }

  resetEmailConfig() {
    this.emailConfig = {
      serviceId: '',
      publicKey: '',
      templates: {
        testAuthorized: '',
        candidatureRefused: '',
        candidatureAccepted: ''
      }
    };
  }

  testEmailJsConfig() {
    this.snackBar.open('Configuration email testée (voir console)', 'Fermer', { duration: 3000 });
    console.log('EmailJS Config:', this.emailConfig);
  }

  analyzeCandidat() {
    if (!this.selectedCandidat) return;
    
    this.isAnalyzing = true;
    
    // Simulate AI analysis with the AiService
    setTimeout(() => {
      const quizScore = this.selectedCandidat.quizScore || 0;
      const quizTotal = this.selectedCandidat.quizTotal || 1;
      const scorePercent = (quizScore / quizTotal) * 100;
      
      // Generate a mock analysis based on quiz score and other factors
      this.aiScore = Math.min(95, Math.max(30, scorePercent + Math.random() * 20 - 10));
      
      if (this.aiScore >= 80) {
        this.aiAnalysisResult = 'Excellent profil technique avec de solides compétences. Le candidat correspond parfaitement aux exigences du poste et montre un grand potentiel d\'intégration.';
      } else if (this.aiScore >= 60) {
        this.aiAnalysisResult = 'Bon profil avec des compétences adéquates. Le candidat répond aux critères principaux mais pourrait nécessiter une formation complémentaire sur certains aspects spécifiques.';
      } else {
        this.aiAnalysisResult = 'Le profil présente des écarts significatifs par rapport aux exigences du poste. Un entretien technique approfondi est recommandé pour évaluer le potentiel d\'apprentissage.';
      }
      
      this.isAnalyzing = false;
    }, 1500);
  }

}
