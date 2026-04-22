import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-applicant-postuler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `

    <div class="postuler-page">
      <div class="postuler-card">
        <div class="postuler-header">
          <div class="header-icon-group">
             <div class="header-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                 <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
               <path d="m9 12 2 2 4-4"/>
               <path d="M12 8v8"/>
                 <path d="M12 16H8"/>
               </svg>
             </div>
             <div>
               <h1 class="header-title">{{ isLoginMode ? 'Terminal Sync' : 'Genetic Induction' }}</h1>
               <p class="header-subtitle">{{ isLoginMode ? 'Link your existing node' : 'Initialize your career profile' }}</p>
             </div>
          </div>

          <div class="mode-toggle">
            <button type="button" [class.active]="!isLoginMode" (click)="isLoginMode = false">SIGN UP</button>
            <button type="button" [class.active]="isLoginMode" (click)="isLoginMode = true">SIGN IN</button>
          </div>
        </div>

        <form [formGroup]="applyForm" (ngSubmit)="submit()" class="postuler-form">
          @if (!isLoginMode) {
            <div class="form-group">
              <label>Codename (Full Name)</label>
              <input formControlName="nom" class="form-input" placeholder="e.g. John Doe">
            </div>
          }
          
          <div class="form-group">
            <label>Signal Channel (Email)</label>
            <input formControlName="email" type="email" class="form-input" placeholder="name@domain.com">
          </div>

          <div class="form-group">
            <label>Access Keyphrase (Password)</label>
            <input formControlName="password" type="password" class="form-input" placeholder="••••••••">
          </div>
          
          @if (!isLoginMode) {
            <div class="form-group">
              <label>Comm Line (Phone)</label>
              <input formControlName="telephone" class="form-input" placeholder="+216 ...">
            </div>
          }
          
          @if (selectedOffre) {
            <div class="target-mission">
               <div class="mission-icon">
                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                   <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
                   <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                 </svg>
               </div>
               <div>
                 <p class="mission-label">Target Mission</p>
                 <p class="mission-title">{{selectedOffre.titre}}</p>
               </div>
            </div>
          }
          
          @if (!isLoginMode) {
            <div class="form-group">
              <label>Bio-Data Asset (CV PDF)</label>
              <div class="file-upload"
                     [class.has-file]="cvFile"
                     (click)="cvInput?.click()">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" [ngClass]="cvFile ? 'text-emerald-500' : 'text-slate-400'">
                  @if (cvFile) {
                    <polyline points="20 6 9 17 4 12"/>
                  } @else {
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  }
                </svg>
                <span [ngClass]="cvFile ? 'text-emerald-600' : 'text-slate-500'">
                  {{ cvFile ? cvFile.name : 'Upload encrypted CV asset' }}
                </span>
                <input #cvInput type="file" id="cv-input" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" class="hidden">
              </div>
            </div>
          }
          
          <button type="submit" [disabled]="applyForm.invalid || isSubmitting" class="btn btn-primary btn-large">
            @if (isSubmitting) {
              <div class="spinner"></div>
              <span>PROCESSING...</span>
            } @else {
              @if (isLoginMode) {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
              } @else {
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              }
              <span>{{ isLoginMode ? 'CONNECT & DEPLOY' : 'REGISTER & APPLY' }}</span>
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .postuler-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-lg);
      background: var(--color-bg);
    }

    .postuler-card {
      width: 100%;
      max-width: 500px;
      background: white;
      border-radius: var(--radius-3xl);
      box-shadow: var(--shadow-3xl);
      overflow: hidden;
      border: 1px solid var(--color-border);
    }

    .postuler-header {
      padding: var(--space-3xl);
      border-bottom: 1px solid var(--color-border);
      background: var(--color-bg);
    }

    .header-icon-group {
      display: flex;
      align-items: center;
      gap: var(--space-md);
      margin-bottom: var(--space-2xl);
    }

    .header-icon {
      width: 56px;
      height: 56px;
      border-radius: var(--radius-lg);
      background: #4f46e5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 0 20px rgba(79, 70, 229, 0.2);
    }

    .header-title {
      font-size: 24px;
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      margin: 0;
      text-transform: uppercase;
      font-style: italic;
      letter-spacing: -0.5px;
    }

    .header-subtitle {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: var(--space-xs) 0 0;
    }

    .mode-toggle {
      display: flex;
      background: white;
      padding: 6px;
      border-radius: var(--radius-lg);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
      border: 1px solid var(--color-border);
    }

    .mode-toggle button {
      flex: 1;
      padding: var(--space-sm);
      border-radius: var(--radius-md);
      font-size: 10px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
      border: none;
      background: transparent;
      color: var(--color-text-muted);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .mode-toggle button.active {
      background: var(--color-slate-900);
      color: white;
      box-shadow: var(--shadow-lg);
    }

    .postuler-form {
      padding: var(--space-3xl);
      display: flex;
      flex-direction: column;
      gap: var(--space-2xl);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--space-sm);
    }

    .form-group label {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .form-input {
      padding: var(--space-md) var(--space-lg);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      background: white;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      outline: none;
      border-color: #4f46e5;
    }

    .target-mission {
      padding: var(--space-lg);
      background: rgba(79, 70, 229, 0.05);
      border-radius: var(--radius-2xl);
      border: 1px solid rgba(79, 70, 229, 0.1);
      display: flex;
      align-items: center;
      gap: var(--space-md);
    }

    .mission-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #4f46e5;
      box-shadow: var(--shadow-sm);
    }

    .mission-label {
      font-size: 10px;
      font-weight: var(--font-weight-black);
      color: #4f46e5;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0 0 var(--space-xs);
      font-style: italic;
    }

    .mission-title {
      font-size: 14px;
      font-weight: var(--font-weight-black);
      color: var(--color-text);
      text-transform: uppercase;
      margin: 0;
    }

    .file-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--space-3xl);
      border: 2px dashed var(--color-border);
      border-radius: var(--radius-2xl);
      cursor: pointer;
      transition: all var(--transition-base);
      gap: var(--space-md);
    }

    .file-upload:hover {
      background: var(--color-bg);
    }

    .file-upload.has-file {
      border-color: rgba(16, 185, 129, 0.5);
      background: rgba(16, 185, 129, 0.05);
    }

    .file-upload span {
      font-size: 12px;
      font-weight: var(--font-weight-black);
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-md);
      padding: var(--space-lg) var(--space-2xl);
      border-radius: var(--radius-2xl);
      font-weight: var(--font-weight-black);
      font-size: var(--font-size-sm);
      text-transform: uppercase;
      letter-spacing: 4px;
      cursor: pointer;
      transition: all var(--transition-base);
      border: none;
    }

    .btn-large {
      padding: var(--space-xl) var(--space-3xl);
    }

    .btn-primary {
      background: var(--color-slate-900);
      color: white;
      box-shadow: var(--shadow-2xl);
    }

    .btn-primary:hover {
      transform: scale(1.02);
    }

    .btn-primary:active {
      transform: scale(0.95);
    }

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Dark mode */
    :host-context(.dark) .postuler-card {
      background: var(--color-slate-900);
      border-color: var(--color-slate-800);
    }

    :host-context(.dark) .postuler-header {
      background: rgba(255, 255, 255, 0.05);
    }

    :host-context(.dark) .mode-toggle {
      background: var(--color-slate-800);
    }

    :host-context(.dark) .form-input {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--color-border);
      color: var(--color-text);
    }

    :host-context(.dark) .target-mission {
      background: rgba(79, 70, 229, 0.1);
    }

    :host-context(.dark) .mission-icon {
      background: var(--color-slate-800);
    }

    :host-context(.dark) .mission-title {
      color: white;
    }

    @media (max-width: 768px) {
      .postuler-page {
        padding: var(--space-md);
      }

      .postuler-header,
      .postuler-form {
        padding: var(--space-2xl);
      }
    }
  `]
})
export class ApplicantPostulerComponent { 
  private api = inject(ApiService);
  private router = inject(Router);
  
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
        alert('Le fichier est trop volumineux (max 5 MB)');
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
            alert('Candidature soumise avec succès !');
            this.isSubmitting = false;
            this.router.navigate(['/applicant/profil']);
          },
          error: (err: any) => {
            console.error('Upload error', err);
            alert('Erreur lors de l\'envoi du dossier.');
            this.isSubmitting = false;
          }
        });
      },
      error: (err: any) => {
        alert(err.error?.message || 'Erreur d\'authentification');
        this.isSubmitting = false;
      }
    });
  } 
}
