import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-section">
            <svg class="logo-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            <span class="logo-text">GestProjet</span>
          </div>
          <h1 class="login-title">Bienvenue</h1>
          <p class="login-subtitle">Connectez-vous à votre espace de travail</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Adresse email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input 
                id="email"
                type="email" 
                formControlName="email" 
                class="form-input" 
                placeholder="nom@entreprise.com"
                autocomplete="email"
              >
            </div>
            @if (loginForm.get('email')?.touched && loginForm.get('email')?.invalid) {
              <span class="error-message">Veuillez entrer une adresse email valide</span>
            }
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input 
                id="password"
                type="password" 
                formControlName="password" 
                class="form-input" 
                placeholder="••••••••"
                autocomplete="current-password"
              >
            </div>
            @if (loginForm.get('password')?.touched && loginForm.get('password')?.invalid) {
              <span class="error-message">Veuillez entrer votre mot de passe</span>
            }
          </div>
          
          <div class="form-options">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="remember">
              <span>Se souvenir de moi</span>
            </label>
            <a routerLink="/auth/forgot-password" class="forgot-link">Mot de passe oublié ?</a>
          </div>
          
          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
            @if (isLoading) {
              <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Connexion en cours...
            } @else {
              Se connecter
            }
          </button>
          
          @if (errorMessage) {
            <div class="error-alert">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          }
        </form>
        
        <div class="login-footer">
          <p class="footer-text">Vous êtes candidat ? <a routerLink="/applicant" class="footer-link">Postulez ici</a></p>
          <p class="footer-text" style="margin-top: 8px;">Vous voulez utiliser GestProjet ? <a routerLink="/register-company" class="footer-link">Enregistrez votre société</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 50%, #3d7ab5 100%);
      padding: 20px;
      position: relative;
    }

    .login-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 48px 40px;
      width: 100%;
      max-width: 440px;
      animation: fadeIn 0.5s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .logo-icon {
      color: #2d5a87;
    }

    .logo-text {
      font-size: 28px;
      font-weight: 700;
      color: #1e3a5f;
      letter-spacing: -0.5px;
    }

    .login-title {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
      letter-spacing: -0.3px;
    }

    .login-subtitle {
      color: #64748b;
      margin: 0;
      font-size: 15px;
      font-weight: 400;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 32px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #334155;
      letter-spacing: 0.2px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 14px;
      color: #94a3b8;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .form-input {
      width: 100%;
      padding: 14px 14px 14px 44px;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.2s ease;
      background: #f8fafc;
      color: #1e293b;
    }

    .form-input:focus {
      outline: none;
      border-color: #2d5a87;
      background: white;
      box-shadow: 0 0 0 3px rgba(45, 90, 135, 0.1);
    }

    .form-input:focus ~ .input-icon {
      color: #2d5a87;
    }

    .error-message {
      font-size: 13px;
      color: #dc2626;
      margin-top: 4px;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -4px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #475569;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #2d5a87;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 14px;
      color: #2d5a87;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: #1e3a5f;
      text-decoration: underline;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 24px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #2d5a87 0%, #3d7ab5 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(45, 90, 135, 0.3);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(45, 90, 135, 0.4);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .btn-block {
      width: 100%;
    }

    .spinner {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    .login-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .footer-text {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .footer-link {
      color: #2d5a87;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #1e3a5f;
      text-decoration: underline;
    }

    .error-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 10px;
      color: #dc2626;
      font-size: 14px;
      font-weight: 500;
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';

    // Nettoyer le localStorage avant le login
    localStorage.removeItem('app_token');
    localStorage.removeItem('utilisateur');
    localStorage.removeItem('app_permissions');
    console.log('Login - LocalStorage nettoyé');

    this.api.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.errorMessage = '';
        
        console.log('Login - Réponse complète du backend:', response);
        
        const token = response.token || response.Token;
        const utilisateur = response.utilisateur || response.Utilisateur;
        
        if (token) this.api.setToken(token);
        if (utilisateur) localStorage.setItem('utilisateur', JSON.stringify(utilisateur));

        const role = (utilisateur?.typeUtilisateurId || utilisateur?.TypeUtilisateurId || 'USER').toUpperCase();
        console.log('Login - Role détecté:', role);
        console.log('Login - Utilisateur complet:', utilisateur);
        this.redirectBasedOnRole(role);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || error?.error?.Message || 'Email ou mot de passe incorrect. Vérifiez vos identifiants.';
      }
    });
  }

  private redirectBasedOnRole(role: string) {
    const routes: Record<string, string> = {
      'T001': '/superadmin',
      'T002': '/admin',
      'T003': '/rh',
      'T004': '/chef',
      'T005': '/dev',
      'T006': '/qa',
      'T007': '/applicant',
      'SUPER_ADMIN': '/superadmin',
      'ADMIN': '/admin',
      'ADMIN_SOCIETE': '/admin',
      'ADMIN SOCIETE': '/admin',
      'ADMIN SOCIÉTÉ': '/admin',
      'ADMINSOCIETE': '/admin',
      'RH': '/rh',
      'DEVELOPPEUR': '/dev',
      'QA': '/qa',
      'CHEF_PROJET': '/chef',
      'CHEF PROJET': '/chef',
      'CANDIDAT': '/applicant'
    };

    let route = routes[role] || '/admin';
    
    // Fallback pour les admins qui auraient été assignés au rôle chef_projet par erreur
    if (role === 'CHEF_PROJET' && this.loginForm.value.email.toLowerCase().includes('admin')) {
      route = '/admin';
    }

    console.log('Login - Route choisie:', route, 'pour le rôle:', role);
    this.router.navigate([route]);
  }
}
