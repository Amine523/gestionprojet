import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-rh-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatSnackBarModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <div class="dashboard-header">
        <div class="header-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
        </div>
        <div class="header-info">
          <h1 class="header-title">Evaluation Hub</h1>
          <p class="header-subtitle">Gestion des tests techniques et évaluations de compétences</p>
        </div>
        <div class="header-stats">
          <div class="header-stat">
            <span class="stat-value">{{roleQuizzes.length}}</span>
            <span class="stat-label">Tests Actifs</span>
          </div>
          <div class="header-stat">
            <span class="stat-value">{{noteMoyenne}}/20</span>
            <span class="stat-label">Moyenne</span>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Navigation Sidebar -->
        <div class="sidebar-nav">
          <div class="nav-title">Modules par Rôle</div>
          <div class="nav-items">
            <button class="nav-btn" [class.active]="selectedQuizRole === 'developpeur'" (click)="selectedQuizRole = 'developpeur'; loadRoleQuizzes()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Développeur
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'testeur'" (click)="selectedQuizRole = 'testeur'; loadRoleQuizzes()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                <path d="M2 17l10 5 10-5"></path>
                <path d="M2 12l10 5 10-5"></path>
              </svg>
              Testeur QA
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'chef_projet'" (click)="selectedQuizRole = 'chef_projet'; loadRoleQuizzes()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Chef de Projet
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'rh'" (click)="selectedQuizRole = 'rh'; loadRoleQuizzes()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Ressources Humaines
            </button>
          </div>
        </div>

        <!-- Quiz Grid -->
        <div class="quiz-content">
          <div class="content-header">
            <h2 class="content-title">Filière {{selectedQuizRole | titlecase}}</h2>
            <button class="btn btn-primary" (click)="openCreateQuiz()">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Créer un Test
            </button>
          </div>

          <div class="quizzes-grid">
            @for (quiz of roleQuizzes; track quiz.id) {
              <div class="quiz-card">
                <div class="quiz-header">
                  <div class="quiz-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                    </svg>
                  </div>
                  <div class="quiz-meta">
                    <span class="quiz-difficulty" [class]="'diff-'+quiz.niveau">{{quiz.niveau}}</span>
                    <h3 class="quiz-title">{{quiz.titre}}</h3>
                  </div>
                </div>
                
                <p class="quiz-description">{{quiz.description}}</p>
                
                <div class="quiz-details">
                  <div class="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    {{quiz.nbQuestions}} Q.
                  </div>
                  <div class="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    {{quiz.duree}}m
                  </div>
                  <div class="detail-item">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                      <polyline points="17 6 23 6 23 12"></polyline>
                    </svg>
                    {{quiz.nbAttempts}} acc.
                  </div>
                </div>

                <div class="quiz-progress">
                  <div class="progress-labels">
                    <span>Taux de réussite</span>
                    <span class="progress-value">{{quiz.tauxReussite}}%</span>
                  </div>
                  <div class="progress-bar">
                    <div class="progress-fill" [style.width.%]="quiz.tauxReussite"></div>
                  </div>
                </div>

                <div class="quiz-actions">
                  <button class="btn btn-secondary btn-sm" (click)="viewQuizDetails(quiz)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Présentation
                  </button>
                  <button class="btn-icon" (click)="editQuiz(quiz)">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>

    <!-- Quiz Details Modal -->
    @if (showQuizDetailsDialog) {
      <div class="modal-overlay" (click)="closeQuizDetails()">
        <div class="modal-card modal-wide" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div class="modal-title-block">
              <div class="modal-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div>
                <h3 class="modal-title">{{selectedQuiz?.titre}}</h3>
                <span class="modal-subtitle">Architecture & Questions</span>
              </div>
            </div>
            <button class="btn-close" (click)="closeQuizDetails()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          <div class="modal-body scrollable">
            <div class="quiz-stats-bar">
              <div class="stat-item"><strong>{{sampleQuestions.length}}</strong> Questions</div>
              <div class="stat-item"><strong>{{selectedQuiz?.duree}}</strong> Minutes</div>
              <div class="stat-item"><strong>{{selectedQuiz?.niveau}}</strong> Difficulté</div>
            </div>

            <div class="questions-stack">
              @for (q of sampleQuestions; track q.q; let i = $index) {
                <div class="question-item">
                  <div class="question-number">Q{{i + 1}}</div>
                  <div class="question-body">
                    <p class="question-text">{{q.q}}</p>
                    <div class="options-grid">
                      @for (opt of q.options; track opt; let j = $index) {
                        <div class="option-chip" [class.correct]="j === q.correct">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            @if (j === q.correct) {
                              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                              <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            } @else {
                              <circle cx="12" cy="12" r="10"></circle>
                            }
                          </svg>
                          <span>{{opt}}</span>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeQuizDetails()">Fermer la vue</button>
            <button class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              Partager le test
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Edit Quiz Modal -->
    @if (showEditQuizDialog) {
      <div class="modal-overlay" (click)="closeEditQuiz()">
        <div class="modal-card modal-small" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Paramètres du Test</h3>
            <button class="btn-close" (click)="closeEditQuiz()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Titre de l'évaluation</label>
              <input type="text" [(ngModel)]="selectedQuiz.titre" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Niveau de difficulté</label>
              <select [(ngModel)]="selectedQuiz.niveau" class="form-select">
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Questions</label>
                <input type="number" [(ngModel)]="selectedQuiz.nbQuestions" class="form-input">
              </div>
              <div class="form-group">
                <label class="form-label">Temps (min)</label>
                <input type="number" [(ngModel)]="selectedQuiz.duree" class="form-input">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeEditQuiz()">Annuler</button>
            <button class="btn btn-primary" (click)="saveQuiz()">Mettre à jour</button>
          </div>
        </div>
      </div>
    }
    
    <!-- Create Quiz Modal -->
    @if (showCreateQuizDialog) {
      <div class="modal-overlay" (click)="closeCreateQuiz()">
        <div class="modal-card modal-small" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">Créer un nouveau Test</h3>
            <button class="btn-close" (click)="closeCreateQuiz()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Titre du test</label>
              <input type="text" [(ngModel)]="newQuiz.titre" class="form-input" placeholder="ex: React Avancé">
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <input type="text" [(ngModel)]="newQuiz.description" class="form-input" placeholder="Brève description du contenu">
            </div>
            <div class="form-group">
              <label class="form-label">Niveau de difficulté</label>
              <select [(ngModel)]="newQuiz.niveau" class="form-select">
                <option value="Débutant">Débutant</option>
                <option value="Intermédiaire">Intermédiaire</option>
                <option value="Avancé">Avancé</option>
              </select>
            </div>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">Nb Questions</label>
                <input type="number" [(ngModel)]="newQuiz.nbQuestions" class="form-input" min="1" max="50">
              </div>
              <div class="form-group">
                <label class="form-label">Durée (min)</label>
                <input type="number" [(ngModel)]="newQuiz.duree" class="form-input" min="5" max="120">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeCreateQuiz()">Annuler</button>
            <button class="btn btn-primary" (click)="createQuiz()" [disabled]="!newQuiz.titre">Créer le test</button>
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

    .header-stats {
      display: flex;
      gap: var(--space-md);
    }

    .header-stat {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: var(--radius-lg);
      padding: var(--space-md) var(--space-lg);
      display: flex;
      flex-direction: column;
      align-items: center;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .stat-value {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: white;
      line-height: 1;
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: rgba(255, 255, 255, 0.8);
      margin-top: var(--space-xs);
    }

    .main-content {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: var(--space-lg);
      min-height: 700px;
    }

    .sidebar-nav {
      background: var(--color-bg);
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
    }

    .nav-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-md);
    }

    .nav-items {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .nav-btn {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-base);
      text-align: left;
    }

    .nav-btn:hover {
      background: var(--color-surface);
      color: var(--color-text);
    }

    .nav-btn.active {
      background: white;
      color: #6366f1;
      box-shadow: var(--shadow-sm);
    }

    .quiz-content {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .content-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .content-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .btn {
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
      background: #6366f1;
      color: white;
    }

    .btn-primary:hover {
      background: #4f46e5;
    }

    .btn-secondary {
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
      background: var(--color-surface);
    }

    .btn-sm {
      padding: var(--space-xs) var(--space-sm);
    }

    .btn-icon {
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

    .quizzes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-lg);
    }

    .quiz-card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      padding: var(--space-lg);
      display: flex;
      flex-direction: column;
      gap: var(--space-md);
      transition: all var(--transition-base);
    }

    .quiz-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .quiz-header {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .quiz-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: rgba(99, 102, 241, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6366f1;
    }

    .quiz-meta {
      flex: 1;
    }

    .quiz-difficulty {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .diff-Débutant {
      color: #16a34a;
    }

    .diff-Intermédiaire {
      color: #d97706;
    }

    .diff-Avancé {
      color: #dc2626;
    }

    .quiz-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: var(--space-xs) 0 0;
    }

    .quiz-description {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0;
      line-height: var(--line-height-relaxed);
    }

    .quiz-details {
      display: flex;
      gap: var(--space-md);
      padding: var(--space-sm);
      background: var(--color-bg);
      border-radius: var(--radius-md);
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .quiz-progress {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .progress-labels {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }

    .progress-value {
      color: #6366f1;
    }

    .progress-bar {
      height: 6px;
      background: var(--color-bg);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #6366f1, #4f46e5);
      border-radius: var(--radius-full);
      transition: width var(--transition-base);
    }

    .quiz-actions {
      display: flex;
      gap: var(--space-xs);
      align-items: center;
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

    .modal-wide {
      width: 900px;
    }

    .modal-small {
      width: 460px;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .modal-title-block {
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .modal-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: rgba(99, 102, 241, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6366f1;
    }

    .modal-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .modal-subtitle {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .btn-close {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      border: none;
      background: transparent;
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
      background: var(--color-bg);
    }

    .quiz-stats-bar {
      display: flex;
      gap: var(--space-xl);
      padding: var(--space-md) var(--space-lg);
      background: var(--color-bg);
      border-radius: var(--radius-lg);
      margin-bottom: var(--space-lg);
    }

    .stat-item {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
    }

    .stat-item strong {
      color: var(--color-text);
      margin-right: var(--space-xs);
    }

    .questions-stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .question-item {
      display: grid;
      grid-template-columns: 48px 1fr;
      gap: var(--space-lg);
    }

    .question-number {
      width: 48px;
      height: 48px;
      background: var(--color-bg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: var(--font-weight-bold);
      color: #6366f1;
    }

    .question-text {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin-bottom: var(--space-md);
    }

    .options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-sm);
    }

    .option-chip {
      padding: var(--space-sm) var(--space-md);
      background: var(--color-bg);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      border: 1px solid transparent;
    }

    .option-chip.correct {
      background: #f0fdf4;
      color: #16a34a;
      border-color: #dcfce7;
    }

    .form-group {
      margin-bottom: var(--space-md);
    }

    .form-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .form-input,
    .form-select {
      width: 100%;
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      border: 1px solid var(--color-border);
      background: var(--color-bg);
      color: var(--color-text);
      font-size: var(--font-size-sm);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus,
    .form-select:focus {
      border-color: #6366f1;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-md);
    }

    /* Dark mode */
    :host-context(.dark) .sidebar-nav,
    :host-context(.dark) .quiz-card,
    :host-context(.dark) .modal-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .nav-btn.active {
      background: rgba(255, 255, 255, 0.1);
      color: #6366f1;
    }

    :host-context(.dark) .modal-header,
    :host-context(.dark) .modal-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .quiz-icon,
    :host-context(.dark) .modal-icon {
      background: rgba(99, 102, 241, 0.2);
    }

    :host-context(.dark) .quiz-details,
    :host-context(.dark) .quiz-stats-bar {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .question-number {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-input,
    :host-context(.dark) .form-select {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    @media (max-width: 1024px) {
      .main-content {
        grid-template-columns: 1fr;
      }

      .sidebar-nav {
        display: flex;
        overflow-x: auto;
        padding: var(--space-md);
      }

      .nav-items {
        flex-direction: row;
      }

      .quizzes-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-stats {
        width: 100%;
        justify-content: space-between;
      }

      .content-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-md);
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .options-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RhTestsComponent implements OnInit {
  private snackBar = inject(MatSnackBar);
  private api = inject(ApiService);
  
  societeId = '';
  societeNom = 'Votre société';
  
  evaluations: any[] = [];
  filteredResultats: any[] = [];
  noteMoyenne = 0;
  
  showAssignDialog = false;
  selectedTest: any = null;
  assignableCandidates: any[] = [];
  
  showEmbaucherDialog = false;
  selectedResult: any = null;
  selectedRole = 'developpeur';

  selectedQuizRole = 'developpeur';
  roleQuizzes: any[] = [];

  roleQuizData: { [key: string]: any[] } = {
    developpeur: [
      { id: 1, titre: 'JavaScript Avancé', description: 'Test sur les closures, prototypes, async/await', niveau: 'Avancé', nbQuestions: 15, duree: 45, icon: 'javascript', tauxReussite: 72, nbAttempts: 15 },
      { id: 2, titre: 'TypeScript', description: 'Types, génériques, interfaces', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'code', tauxReussite: 85, nbAttempts: 12 },
      { id: 3, titre: 'Angular Framework', description: 'Components, Services, Routing, HTTP', niveau: 'Intermédiaire', nbQuestions: 15, duree: 40, icon: 'angular', tauxReussite: 68, nbAttempts: 8 }
    ],
    testeur: [
      { id: 1, titre: 'Tests Unitaires', description: 'Jest, Jasmine, couverture de code', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'science', tauxReussite: 78, nbAttempts: 9 }
    ],
    chef_projet: [
      { id: 1, titre: 'Gestion de Projet', description: 'Méthodologies Agile, Scrum, Kanban', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'project', tauxReussite: 80, nbAttempts: 11 }
    ],
    rh: [
      { id: 1, titre: 'Droit du Travail', description: 'Congés, CDI, CDD, rupture, convention', niveau: 'Intermédiaire', nbQuestions: 15, duree: 30, icon: 'gavel', tauxReussite: 76, nbAttempts: 9 }
    ]
  };

  selectedQuiz: any = null;
  showQuizDetailsDialog = false;
  showEditQuizDialog = false;
  showCreateQuizDialog = false;
  sampleQuestions: any[] = [];
  
  iconOptions = ['code', 'science', 'engineering', 'gavel', 'psychology', 'terminal', 'data_object', 'bug_report', 'cloud', 'storage', 'security', 'analytics'];
  
  newQuiz: any = {
    titre: '',
    description: '',
    niveau: 'Intermédiaire',
    nbQuestions: 15,
    duree: 30,
    icon: 'code',
    tauxReussite: 0,
    nbAttempts: 0
  };

  ngOnInit() {
    const user = this.api.getCurrentUser();
    this.societeId = user?.societeId || '';
    this.societeNom = user?.societe?.nom || 'Votre société';
    this.loadData();
    this.loadRoleQuizzes();
  }
  
  loadData() {
    this.api.getEmployesBySociete(this.societeId).subscribe({
      next: (employes) => {
        const candidateUsers = (employes || []).filter((e: any) => e.typeUtilisateurId === 'candidat');
        this.evaluations = candidateUsers.map((e: any, idx: number) => ({
          id: idx + 1,
          candidat: e.nom,
          test: 'Test Technique',
          date: '10/04/2026',
          note: Math.floor(Math.random() * 10) + 10
        }));
        this.filteredResultats = [...this.evaluations];
        this.calculateStats();
      },
      error: () => {
        this.filteredResultats = [];
        this.calculateStats();
      }
    });
  }
  
  loadRoleQuizzes() {
    this.roleQuizzes = this.roleQuizData[this.selectedQuizRole] || [];
  }
  
  calculateStats() {
    if (this.evaluations.length > 0) {
      const total = this.evaluations.reduce((sum: number, r: any) => sum + r.note, 0);
      this.noteMoyenne = Math.round((total / this.evaluations.length) * 10) / 10;
    }
  }

  viewQuizDetails(quiz: any) {
    this.selectedQuiz = quiz;
    this.showQuizDetailsDialog = true;
    this.sampleQuestions = this.getSampleQuestions(quiz.titre);
  }

  getSampleQuestions(quizTitre: string): any[] {
    return [
      { q: 'Question 1', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 2', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 }
    ];
  }

  closeQuizDetails() {
    this.showQuizDetailsDialog = false;
    this.selectedQuiz = null;
  }

  editQuiz(quiz: any) {
    this.selectedQuiz = { ...quiz };
    this.showEditQuizDialog = true;
  }

  closeEditQuiz() {
    this.showEditQuizDialog = false;
  }

  saveQuiz() {
    this.loadRoleQuizzes();
    this.snackBar.open('Quiz modifié localement', 'Fermer', { duration: 2000 });
    this.closeEditQuiz();
  }

  cancelAssign() {
    this.showAssignDialog = false;
  }

  confirmAssign(c: any) {
    this.snackBar.open('Test assigné à ' + c.nom, 'Fermer', { duration: 2000 });
    this.showAssignDialog = false;
  }

  cancelEmbaucher() {
    this.showEmbaucherDialog = false;
  }

  embaucherCandidat() {
    this.snackBar.open('Candidat embauché (local)', 'Fermer', { duration: 2000 });
    this.showEmbaucherDialog = false;
  }
  
  openCreateQuiz() {
    this.newQuiz = {
      titre: '',
      description: '',
      niveau: 'Intermédiaire',
      nbQuestions: 15,
      duree: 30,
      icon: 'code',
      tauxReussite: 0,
      nbAttempts: 0
    };
    this.showCreateQuizDialog = true;
  }
  
  closeCreateQuiz() {
    this.showCreateQuizDialog = false;
  }
  
  createQuiz() {
    if (!this.newQuiz.titre) {
      this.snackBar.open('Veuillez saisir un titre', 'Fermer', { duration: 2000 });
      return;
    }
    
    const role = this.selectedQuizRole;
    if (!this.roleQuizData[role]) {
      this.roleQuizData[role] = [];
    }
    
    const newId = Math.max(0, ...this.roleQuizData[role].map((q: any) => q.id)) + 1;
    this.roleQuizData[role].push({ ...this.newQuiz, id: newId });
    this.loadRoleQuizzes();
    
    this.snackBar.open('Test "' + this.newQuiz.titre + '" créé avec succès', 'Fermer', { duration: 3000 });
    this.closeCreateQuiz();
  }
}

