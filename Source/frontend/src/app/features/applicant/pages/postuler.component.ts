import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { FormStateService } from '@core/services/form-state.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-applicant-postuler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatSnackBarModule],
  template: `

    <div class="postuler-page">
      <div class="postuler-container">
        <div class="postuler-card">
          <div class="card-header">
            <div class="header-logo">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="header-text">
              <h1>{{ isLoginMode ? 'Connexion' : 'Créer un compte' }}</h1>
              <p>{{ isLoginMode ? 'Connectez-vous pour accéder à votre espace candidat' : 'Rejoignez notre plateforme de recrutement' }}</p>
            </div>
          </div>

          <div class="mode-switch">
            <button type="button" [class.active]="!isLoginMode" (click)="isLoginMode = false">Inscription</button>
            <button type="button" [class.active]="isLoginMode" (click)="isLoginMode = true">Connexion</button>
          </div>

          <form [formGroup]="applyForm" (ngSubmit)="submit()" class="postuler-form">
            @if (!isLoginMode) {
              <div class="form-field">
                <label for="nom">Nom complet</label>
                <input id="nom" formControlName="nom" class="form-control" placeholder="Entrez votre nom complet">
              </div>
            }
            
            <div class="form-field">
              <label for="email">Adresse email</label>
              <input id="email" formControlName="email" type="email" class="form-control" placeholder="exemple@email.com">
            </div>

            <div class="form-field">
              <label for="password">Mot de passe</label>
              <input id="password" formControlName="password" type="password" class="form-control" placeholder="••••••••">
            </div>
            
            @if (!isLoginMode) {
              <div class="form-field">
                <label for="telephone">Numéro de téléphone</label>
                <input id="telephone" formControlName="telephone" class="form-control" placeholder="+216 XX XXX XXX">
              </div>
            }
            
            @if (selectedOffre) {
              <div class="selected-offre">
                <div class="offre-badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <span>Poste sélectionné</span>
                </div>
                <p class="offre-title">{{selectedOffre.titre}}</p>
              </div>
            }
            
            @if (!isLoginMode) {
              <div class="form-field">
                <label>CV (PDF, DOC, DOCX)</label>
                <div class="file-upload-zone"
                       [class.has-file]="cvFile"
                       (click)="cvInput?.click()">
                  <div class="upload-icon">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      @if (cvFile) {
                        <polyline points="20 6 9 17 4 12"/>
                      } @else {
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      }
                    </svg>
                  </div>
                  <p class="upload-text">{{ cvFile ? cvFile.name : 'Cliquez pour télécharger votre CV' }}</p>
                  <p class="upload-hint">Taille maximale: 5 MB</p>
                  <input #cvInput type="file" id="cv-input" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" class="hidden">
                </div>
              </div>
            }
            
            <button type="submit" [disabled]="applyForm.invalid || isSubmitting" class="btn-submit">
              @if (isSubmitting) {
                <div class="btn-spinner"></div>
                <span>Traitement en cours...</span>
              } @else {
                <span>{{ isLoginMode ? 'Se connecter' : "S'inscrire et postuler" }}</span>
              }
            </button>
          </form>

          <div class="card-footer">
            <p>{{ isLoginMode ? 'Pas encore de compte ?' : 'Déjà inscrit ?' }}</p>
            <button type="button" (click)="isLoginMode = !isLoginMode" class="link-btn">
              {{ isLoginMode ? "Créer un compte" : 'Se connecter' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .postuler-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-xl);
      background: var(--color-bg);
    }

    .postuler-container {
      width: 100%;
      max-width: 500px;
    }

    .postuler-card {
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      border: 1px solid var(--color-border);
      overflow: hidden;
    }

    .card-header {
      padding: var(--space-2xl);
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .card-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 400px;
      height: 400px;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-logo {
      width: 64px;
      height: 64px;
      background: rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--space-lg);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(59, 130, 246, 0.3);
      position: relative;
      z-index: 1;
    }

    .header-logo svg {
      color: #60a5fa;
    }

    .header-text h1 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--space-sm);
      color: white;
      position: relative;
      z-index: 1;
    }

    .header-text p {
      font-size: var(--font-size-sm);
      margin: 0;
      color: #94a3b8;
      position: relative;
      z-index: 1;
    }

    .mode-switch {
      display: flex;
      background: var(--color-bg);
      padding: var(--space-xs);
      margin: var(--space-lg) var(--space-2xl) 0;
      border-radius: var(--radius-lg);
      border: 1px solid var(--color-border);
    }

    .mode-switch button {
      flex: 1;
      padding: var(--space-sm);
      border: none;
      background: transparent;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .mode-switch button.active {
      background: white;
      color: #3b82f6;
      box-shadow: var(--shadow-sm);
    }

    .postuler-form {
      padding: var(--space-2xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-lg);
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: var(--space-xs);
    }

    .form-field label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
    }

    .form-control {
      padding: var(--space-sm) var(--space-md);
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      transition: all var(--transition-base);
      background: var(--color-bg);
      color: var(--color-text);
    }

    .form-control:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .form-control::placeholder {
      color: var(--color-text-muted);
    }

    .selected-offre {
      padding: var(--space-lg);
      background: rgba(59, 130, 246, 0.05);
      border: 2px solid rgba(59, 130, 246, 0.2);
      border-radius: var(--radius-lg);
    }

    .offre-badge {
      display: flex;
      align-items: center;
      gap: var(--space-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-bold);
      color: #3b82f6;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-sm);
    }

    .offre-badge svg {
      width: 16px;
      height: 16px;
    }

    .offre-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--color-text);
      margin: 0;
    }

    .file-upload-zone {
      padding: var(--space-2xl);
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-lg);
      text-align: center;
      cursor: pointer;
      transition: all var(--transition-base);
      background: var(--color-bg);
    }

    .file-upload-zone:hover {
      border-color: #3b82f6;
      background: rgba(59, 130, 246, 0.05);
    }

    .file-upload-zone.has-file {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }

    .upload-icon {
      margin-bottom: var(--space-md);
      color: var(--color-text-muted);
    }

    .file-upload-zone.has-file .upload-icon {
      color: #10b981;
    }

    .upload-text {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .upload-hint {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      margin: 0;
    }

    .btn-submit {
      padding: var(--space-lg) var(--space-2xl);
      background: #0f172a;
      color: white;
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      cursor: pointer;
      transition: all var(--transition-base);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
    }

    .btn-submit:hover:not(:disabled) {
      background: #3b82f6;
      transform: translateY(-2px);
    }

    .btn-submit:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .card-footer {
      padding: var(--space-xl) var(--space-2xl);
      background: var(--color-bg);
      text-align: center;
      border-top: 1px solid var(--color-border);
    }

    .card-footer p {
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin: 0 0 var(--space-sm);
    }

    .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }

    .link-btn:hover {
      color: #2563eb;
    }

    .hidden {
      display: none;
    }

    /* Dark mode */
    :host-context(.dark) .postuler-page {
      background: var(--color-surface);
    }

    :host-context(.dark) .postuler-card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .form-control {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .mode-switch {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    :host-context(.dark) .mode-switch button.active {
      background: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark) .card-footer {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
    }

    @media (max-width: 640px) {
      .postuler-page {
        padding: var(--space-lg);
      }

      .card-header,
      .postuler-form,
      .card-footer {
        padding: var(--space-xl);
      }

      .header-text h1 {
        font-size: var(--font-size-xl);
      }
    }
  `]
})
export class ApplicantPostulerComponent { 
  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private formState = inject(FormStateService);
  
  private subs: Subscription[] = [];
  private readonly DRAFT_KEY = 'applicant_postuler_draft';
  
  selectedOffre: any = null;
  cvFile: File | null = null;
  isSubmitting = false;
  isLoginMode = false;
  
  applyForm = new FormGroup({
    nom: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    telephone: new FormControl('', Validators.pattern('^[0-9+ ]+$'))
  });
  
  constructor() { 
    this.selectedOffre = this.api.getOffreEmploiTemp(); 
  }
  
  ngOnInit() {
    this.restoreDraft();
    this.subs.push(
      this.applyForm.valueChanges.pipe(debounceTime(500)).subscribe(v => {
        this.formState.saveDraft(this.DRAFT_KEY, v);
      })
    );
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private restoreDraft() {
    const draft = this.formState.getDraft(this.DRAFT_KEY);
    if (draft) {
      this.applyForm.patchValue(draft, { emitEvent: false });
    }
  }
  
  onFileSelected(event: any) { 
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('Le fichier est trop volumineux (max 5 MB)', 'Fermer', { duration: 3000 });
        return;
      }
      this.cvFile = file;
    }
  }
  
  submit() {
    if (this.applyForm.invalid) return;
    this.isSubmitting = true;
    
    const { email, password, nom, telephone } = this.applyForm.value;
    
    const authObs = this.isLoginMode 
      ? this.api.login(email!, password!) 
      : this.api.registerCandidate({ email, password, nom });

    authObs.subscribe({
      next: (res: any) => {
        this.api.setToken(res.token);
        localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));
        
        const formData = new FormData();
        formData.append('candidatId', res.utilisateur.id);
        formData.append('offreId', this.selectedOffre?.id);
        if (this.cvFile) {
          formData.append('cv', this.cvFile);
        }

        this.api.postulerForm(formData).subscribe({
          next: () => {
            this.snackBar.open('Candidature soumise avec succès !', 'Fermer', { duration: 3000 });
            this.formState.clearDraft(this.DRAFT_KEY);
            this.isSubmitting = false;
            this.router.navigate(['/applicant/profil']);
          },
          error: (err: any) => {
            console.error('Upload error', err);
            this.snackBar.open('Erreur lors de l\'envoi du dossier.', 'Fermer', { duration: 3000 });
            this.isSubmitting = false;
          }
        });
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Erreur d\'authentification', 'Fermer', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  } 
}
