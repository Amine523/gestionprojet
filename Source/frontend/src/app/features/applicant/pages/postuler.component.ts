import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .postuler-container {
      width: 100%;
      max-width: 480px;
    }

    .postuler-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }

    .card-header {
      padding: 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      text-align: center;
    }

    .header-logo {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
      backdrop-filter: blur(10px);
    }

    .header-logo svg {
      color: white;
    }

    .header-text h1 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
      color: white;
    }

    .header-text p {
      font-size: 14px;
      margin: 0;
      opacity: 0.9;
      color: white;
    }

    .mode-switch {
      display: flex;
      background: #f3f4f6;
      padding: 4px;
      margin: 24px 32px 0;
      border-radius: 12px;
    }

    .mode-switch button {
      flex: 1;
      padding: 12px;
      border: none;
      background: transparent;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
    }

    .mode-switch button.active {
      background: white;
      color: #667eea;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .postuler-form {
      padding: 32px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-field label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
    }

    .form-control {
      padding: 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      background: white;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control::placeholder {
      color: #9ca3af;
    }

    .selected-offre {
      padding: 16px;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
      border: 2px solid rgba(102, 126, 234, 0.2);
      border-radius: 12px;
    }

    .offre-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: #667eea;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .offre-badge svg {
      width: 16px;
      height: 16px;
    }

    .offre-title {
      font-size: 16px;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .file-upload-zone {
      padding: 32px;
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #f9fafb;
    }

    .file-upload-zone:hover {
      border-color: #667eea;
      background: rgba(102, 126, 234, 0.05);
    }

    .file-upload-zone.has-file {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }

    .upload-icon {
      margin-bottom: 12px;
      color: #9ca3af;
    }

    .file-upload-zone.has-file .upload-icon {
      color: #10b981;
    }

    .upload-text {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 4px;
    }

    .upload-hint {
      font-size: 12px;
      color: #6b7280;
      margin: 0;
    }

    .btn-submit {
      padding: 14px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
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
      padding: 24px 32px;
      background: #f9fafb;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }

    .card-footer p {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 8px;
    }

    .link-btn {
      background: none;
      border: none;
      color: #667eea;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      text-decoration: underline;
    }

    .link-btn:hover {
      color: #764ba2;
    }

    .hidden {
      display: none;
    }

    @media (max-width: 640px) {
      .postuler-page {
        padding: 16px;
      }

      .card-header,
      .postuler-form,
      .card-footer {
        padding: 24px;
      }

      .header-text h1 {
        font-size: 20px;
      }
    }
  `]
})
export class ApplicantPostulerComponent { 
  private api = inject(ApiService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  
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
