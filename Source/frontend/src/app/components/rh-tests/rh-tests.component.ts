import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-rh-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule, MatChipsModule, MatSnackBarModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatTabsModule, MatRadioModule, MatProgressBarModule],
  template: `
    <div class="container premium-layout">
      <div class="page-header">
        <div class="header-content">
          <h1 class="gradient-text">Evaluation Hub</h1>
          <p class="subtitle">Gestion des tests techniques et évaluations de compétences</p>
        </div>
        <div class="header-stats-row">
           <div class="h-stat">
              <span class="h-val">{{roleQuizzes.length}}</span>
              <span class="h-label">Tests Actifs</span>
           </div>
           <div class="h-stat">
              <span class="h-val">{{noteMoyenne}}/20</span>
              <span class="h-label">Moyenne Globale</span>
           </div>
        </div>
      </div>

      <div class="premium-card main-workspace">
        <div class="workspace-nav">
          <div class="nav-title">Modules par Rôle</div>
          <div class="nav-items">
            <button class="nav-btn" [class.active]="selectedQuizRole === 'developpeur'" (click)="selectedQuizRole = 'developpeur'; loadRoleQuizzes()">
               <mat-icon>code</mat-icon> Développeur
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'testeur'" (click)="selectedQuizRole = 'testeur'; loadRoleQuizzes()">
               <mat-icon>bug_report</mat-icon> Testeur QA
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'chef_projet'" (click)="selectedQuizRole = 'chef_projet'; loadRoleQuizzes()">
               <mat-icon>engineering</mat-icon> Chef de Projet
            </button>
            <button class="nav-btn" [class.active]="selectedQuizRole === 'rh'" (click)="selectedQuizRole = 'rh'; loadRoleQuizzes()">
               <mat-icon>groups</mat-icon> Ressources Humaines
            </button>
          </div>
        </div>

        <div class="workspace-content">
          <div class="grid-header">
            <h3>Filière {{selectedQuizRole | titlecase}}</h3>
            <button mat-flat-button class="p-btn p-btn-primary" (click)="openCreateQuiz()"><mat-icon>add</mat-icon> Créer un Test</button>
          </div>

          <div class="quizzes-grid">
            @for (quiz of roleQuizzes; track quiz.id) {
              <div class="premium-card quiz-item-card">
                <div class="q-header">
                  <div class="q-icon-wrap" [style.background]="'rgba(var(--p-primary-rgb), 0.1)'">
                    <mat-icon>{{quiz.icon}}</mat-icon>
                  </div>
                  <div class="q-meta">
                    <span class="q-diff" [class]="'diff-'+quiz.niveau">{{quiz.niveau}}</span>
                    <h4 class="q-title">{{quiz.titre}}</h4>
                  </div>
                </div>
                
                <p class="q-desc">{{quiz.description}}</p>
                
                <div class="q-details">
                   <div class="d-item"><mat-icon>help</mat-icon> {{quiz.nbQuestions}} Q.</div>
                   <div class="d-item"><mat-icon>timer</mat-icon> {{quiz.duree}}m</div>
                   <div class="d-item"><mat-icon>trending_up</mat-icon> {{quiz.nbAttempts}} acc.</div>
                </div>

                <div class="q-progress">
                   <div class="p-labels">
                      <span>Taux de réussite</span>
                      <span class="p-val">{{quiz.tauxReussite}}%</span>
                   </div>
                   <div class="p-bar-bg"><div class="p-bar-fill" [style.width.%]="quiz.tauxReussite"></div></div>
                </div>

                <div class="q-actions">
                  <button mat-button class="q-btn" (click)="viewQuizDetails(quiz)">
                    <mat-icon>remove_red_eye</mat-icon> Présentation
                  </button>
                  <button mat-icon-button class="q-btn-icon" (click)="editQuiz(quiz)">
                    <mat-icon>tune</mat-icon>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
      
      @if (showQuizDetailsDialog) {
        <div class="modal-backdrop" (click)="closeQuizDetails()">
          <div class="premium-card modal-container wide" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div class="m-title-block">
                <mat-icon class="m-icon">{{selectedQuiz?.icon}}</mat-icon>
                <div>
                   <h3 class="gradient-text">{{selectedQuiz?.titre}}</h3>
                   <span class="m-subtitle">Architecture & Questions</span>
                </div>
              </div>
              <button mat-icon-button (click)="closeQuizDetails()"><mat-icon>close</mat-icon></button>
            </div>
            
            <div class="modal-body scrollable">
              <div class="q-stats-bar">
                 <div class="qs-item"><strong>{{sampleQuestions.length}}</strong> Questions</div>
                 <div class="qs-item"><strong>{{selectedQuiz?.duree}}</strong> Minutes</div>
                 <div class="qs-item"><strong>{{selectedQuiz?.niveau}}</strong> Difficulté</div>
              </div>

              <div class="questions-stack">
                @for (q of sampleQuestions; track q.q; let i = $index) {
                  <div class="q-stack-item">
                    <div class="q-num">Q{{i + 1}}</div>
                    <div class="q-body">
                      <p class="q-text">{{q.q}}</p>
                      <div class="options-grid">
                        @for (opt of q.options; track opt; let j = $index) {
                          <div class="opt-chip" [class.correct]="j === q.correct">
                            <mat-icon>{{j === q.correct ? 'check_circle' : 'radio_button_unchecked'}}</mat-icon>
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
               <button mat-button (click)="closeQuizDetails()">Fermer la vue</button>
               <button mat-flat-button class="p-btn p-btn-primary"><mat-icon>ios_share</mat-icon> Partager le test</button>
            </div>
          </div>
        </div>
      }

      @if (showEditQuizDialog) {
        <div class="modal-backdrop" (click)="closeEditQuiz()">
          <div class="premium-card modal-container small" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <h3>Paramètres du Test</h3>
               <button mat-icon-button (click)="closeEditQuiz()"><mat-icon>close</mat-icon></button>
            </div>
            <div class="modal-body">
               <div class="p-form-group">
                  <label>Titre de l'évaluation</label>
                  <input type="text" [(ngModel)]="selectedQuiz.titre" class="p-input">
               </div>
               <div class="p-form-group">
                  <label>Niveau de difficulté</label>
                  <select [(ngModel)]="selectedQuiz.niveau" class="p-input">
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                  </select>
               </div>
               <div class="p-form-grid">
                  <div class="p-form-group">
                    <label>Questions</label>
                    <input type="number" [(ngModel)]="selectedQuiz.nbQuestions" class="p-input">
                  </div>
                  <div class="p-form-group">
                    <label>Temps (min)</label>
                    <input type="number" [(ngModel)]="selectedQuiz.duree" class="p-input">
                  </div>
               </div>
            </div>
            <div class="modal-footer">
               <button mat-button (click)="closeEditQuiz()">Annuler</button>
               <button mat-flat-button class="p-btn p-btn-primary" (click)="saveQuiz()">Mettre à jour</button>
            </div>
          </div>
        </div>
      }
      
      @if (showAssignDialog) {
        <div class="modal-backdrop" (click)="cancelAssign()">
          <div class="premium-card modal-container small" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Assigner: {{selectedTest?.titre}}</h3>
              <button mat-icon-button (click)="cancelAssign()"><mat-icon>close</mat-icon></button>
            </div>
            <div class="modal-body">
              <p>Sélectionnez un candidat:</p>
              <div class="candidate-list">
                @for (c of assignableCandidates; track c.id) {
                  <div class="candidate-item" (click)="confirmAssign(c)">
                    <mat-icon>person</mat-icon> {{c.nom}}
                  </div>
                }
                @if (assignableCandidates.length === 0) {
                  <p>Aucun candidat disponible</p>
                }
              </div>
            </div>
          </div>
        </div>
      }
      
      @if (showEmbaucherDialog) {
        <div class="modal-backdrop" (click)="cancelEmbaucher()">
          <div class="premium-card modal-container small" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>Embaucher: {{selectedResult?.candidat}}</h3>
              <button mat-icon-button (click)="cancelEmbaucher()"><mat-icon>close</mat-icon></button>
            </div>
            <div class="modal-body">
              <mat-form-field appearance="outline" class="w-100">
                <mat-label>Rôle</mat-label>
                <mat-select [(ngModel)]="selectedRole">
                  <mat-option value="developpeur">Développeur</mat-option>
                  <mat-option value="testeur">Testeur</mat-option>
                  <mat-option value="chef_projet">Chef de Projet</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            <div class="modal-footer">
              <button mat-button (click)="cancelEmbaucher()">Annuler</button>
              <button mat-flat-button color="primary" (click)="embaucherCandidat()">Confirmer</button>
            </div>
          </div>
        </div>
      }

      @if (showCreateQuizDialog) {
        <div class="modal-backdrop" (click)="closeCreateQuiz()">
          <div class="premium-card modal-container small" (click)="$event.stopPropagation()">
            <div class="modal-header">
               <h3>Créer un nouveau Test</h3>
               <button mat-icon-button (click)="closeCreateQuiz()"><mat-icon>close</mat-icon></button>
            </div>
            <div class="modal-body">
               <div class="p-form-group">
                 <label>Titre du test</label>
                 <input type="text" [(ngModel)]="newQuiz.titre" class="p-input" placeholder="ex: React Avancé">
               </div>
               <div class="p-form-group">
                 <label>Description</label>
                 <input type="text" [(ngModel)]="newQuiz.description" class="p-input" placeholder="Brève description du contenu">
               </div>
               <div class="p-form-group">
                 <label>Niveau de difficulté</label>
                 <select [(ngModel)]="newQuiz.niveau" class="p-input">
                   <option value="Débutant">Débutant</option>
                   <option value="Intermédiaire">Intermédiaire</option>
                   <option value="Avancé">Avancé</option>
                 </select>
               </div>
               <div class="p-form-grid">
                 <div class="p-form-group">
                   <label>Nb Questions</label>
                   <input type="number" [(ngModel)]="newQuiz.nbQuestions" class="p-input" min="1" max="50">
                 </div>
                 <div class="p-form-group">
                   <label>Durée (min)</label>
                   <input type="number" [(ngModel)]="newQuiz.duree" class="p-input" min="5" max="120">
                 </div>
               </div>
               <div class="p-form-group">
                 <label>Icône Material</label>
                 <div class="icon-picker">
                   <button *ngFor="let ic of iconOptions" class="icon-opt" [class.selected]="newQuiz.icon === ic" (click)="newQuiz.icon = ic">
                     <mat-icon>{{ic}}</mat-icon>
                   </button>
                 </div>
               </div>
            </div>
            <div class="modal-footer">
               <button mat-button (click)="closeCreateQuiz()">Annuler</button>
               <button mat-flat-button class="p-btn p-btn-primary" (click)="createQuiz()" [disabled]="!newQuiz.titre">Créer le test</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .container { padding: 32px; max-width: 1400px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
    .subtitle { color: #64748b; font-size: 14px; margin: 4px 0 0; }
    
    .header-stats-row { display: flex; gap: 16px; }
    .h-stat { 
      background: white; padding: 12px 24px; border-radius: 16px; 
      box-shadow: var(--p-shadow); border: 1px solid #f1f5f9;
      display: flex; flex-direction: column; align-items: center;
    }
    .h-val { font-size: 24px; font-weight: 800; color: var(--p-primary); line-height: 1; }
    .h-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-top: 4px; }

    .main-workspace { display: grid; grid-template-columns: 280px 1fr; padding: 0 !important; overflow: hidden; min-height: 700px; }
    
    .workspace-nav { background: #f8fafc; border-right: 1px solid #f1f5f9; padding: 32px 16px; }
    .nav-title { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; padding-left: 16px; }
    .nav-items { display: flex; flex-direction: column; gap: 8px; }
    .nav-btn { 
      display: flex; align-items: center; gap: 12px; padding: 12px 16px; 
      border-radius: 12px; border: none; background: transparent; 
      color: #64748b; font-weight: 600; cursor: pointer; transition: all 0.2s;
      text-align: left;
    }
    .nav-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .nav-btn:hover { background: #f1f5f9; color: #1e293b; }
    .nav-btn.active { background: white; color: var(--p-primary); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }

    .workspace-content { padding: 40px; background: white; }
    .grid-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
    .grid-header h3 { margin: 0; font-size: 22px; font-weight: 800; color: #1e293b; }
    
    .quizzes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
    .quiz-item-card { 
      padding: 24px; display: flex; flex-direction: column; gap: 20px;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .quiz-item-card:hover { transform: translateY(-8px); }
    
    .q-header { display: flex; align-items: center; gap: 16px; }
    .q-icon-wrap { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; color: var(--p-primary); }
    .q-icon-wrap mat-icon { font-size: 24px; }
    .q-meta { display: flex; flex-direction: column; }
    .q-diff { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
    .diff-Débutant { color: #16a34a; }
    .diff-Intermédiaire { color: #d97706; }
    .diff-Avancé { color: #dc2626; }
    .q-title { margin: 0; font-size: 16px; font-weight: 800; color: #1e293b; }
    
    .q-desc { font-size: 13px; color: #64748b; margin: 0; line-height: 1.5; height: 40px; overflow: hidden; }
    
    .q-details { display: flex; gap: 16px; padding: 12px; background: #f8fafc; border-radius: 12px; }
    .d-item { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #475569; }
    .d-item mat-icon { font-size: 14px; width: 14px; height: 14px; color: #94a3b8; }
    
    .q-progress { display: flex; flex-direction: column; gap: 8px; }
    .p-labels { display: flex; justify-content: space-between; font-size: 11px; font-weight: 700; color: #64748b; }
    .p-val { color: var(--p-primary); }
    .p-bar-bg { height: 6px; background: #f1f5f9; border-radius: 3px; overflow: hidden; }
    .p-bar-fill { height: 100%; background: var(--p-primary); border-radius: 3px; }

    .q-actions { display: flex; gap: 8px; align-items: center; }
    .q-btn { flex: 1; height: 36px; border-radius: 10px; font-weight: 700; font-size: 12px; background: #f8fafc; color: #475569; }
    .q-btn:hover { background: #f1f5f9; color: #1e293b; }
    .q-btn-icon { color: #94a3b8; }

    .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
    .modal-container { padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; }
    .modal-container.wide { width: 900px; height: 80vh; }
    .modal-container.small { width: 460px; }
    
    .modal-header { padding: 24px 32px; display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border-bottom: 1px solid #f1f5f9; }
    .m-title-block { display: flex; align-items: center; gap: 16px; }
    .m-icon { font-size: 32px; width: 32px; height: 32px; color: var(--p-primary); }
    .m-subtitle { font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; }
    
    .modal-body { padding: 32px; }
    .modal-body.scrollable { flex: 1; overflow-y: auto; }
    .modal-footer { padding: 20px 32px; display: flex; justify-content: flex-end; gap: 16px; background: #f8fafc; border-top: 1px solid #f1f5f9; }

    .q-stats-bar { display: flex; gap: 32px; padding: 16px 24px; background: #f1f5f9; border-radius: 16px; margin-bottom: 32px; }
    .qs-item { font-size: 14px; color: #475569; }
    .qs-item strong { color: #1e293b; margin-right: 4px; }

    .questions-stack { display: flex; flex-direction: column; gap: 24px; }
    .q-stack-item { display: grid; grid-template-columns: 48px 1fr; gap: 20px; }
    .q-num { width: 48px; height: 48px; background: white; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--p-primary); }
    .q-text { font-size: 16px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .opt-chip { 
      padding: 12px 16px; background: #f8fafc; border-radius: 12px; display: flex; align-items: center; gap: 12px;
      font-size: 13px; font-weight: 600; color: #64748b; border: 1px solid transparent;
    }
    .opt-chip mat-icon { font-size: 18px; width: 18px; height: 18px; color: #cbd5e1; }
    .opt-chip.correct { background: #f0fdf4; color: #16a34a; border-color: #dcfce7; }
    .opt-chip.correct mat-icon { color: #16a34a; }

    .p-input { width: 100%; padding: 12px 16px; border: 2px solid #f1f5f9; border-radius: 12px; font-weight: 700; color: #1e293b; outline: none; transition: border-color 0.2s; background: white; }
    .p-input:focus { border-color: var(--p-primary); }
    .p-form-group { margin-bottom: 24px; }
    .p-form-group label { display: block; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 8px; }
    .p-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    .candidate-list { display: flex; flex-direction: column; gap: 8px; }
    .candidate-item { padding: 12px; background: #f8fafc; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 12px; }
    .candidate-item:hover { background: #f1f5f9; }
    .w-100 { width: 100%; }
    
    .icon-picker { display: flex; flex-wrap: wrap; gap: 8px; }
    .icon-opt { width: 42px; height: 42px; border: 2px solid #f1f5f9; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fafafa; transition: all 0.2s; }
    .icon-opt:hover { border-color: #cbd5e1; background: #f1f5f9; }
    .icon-opt.selected { border-color: var(--p-primary); background: rgba(59,130,246,0.08); color: var(--p-primary); }
    .icon-opt mat-icon { font-size: 20px; width: 20px; height: 20px; }
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
