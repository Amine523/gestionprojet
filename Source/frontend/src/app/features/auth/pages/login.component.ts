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
      <div class="background-pattern"></div>
      <div class="login-card">
        <div class="login-header">
          <div class="logo-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h1 class="login-title">Connexion</h1>
          <p class="login-subtitle">Accédez à votre espace de travail</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Email</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input type="email" formControlName="email" class="form-input" placeholder="votre@email.com">
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Mot de passe</label>
            <div class="input-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input type="password" formControlName="password" class="form-input" placeholder="">
            </div>
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
            } @else {
              Se connecter
            }
          </button>
        </form>
        
        <div class="demo-logins">
          <p class="demo-title">Comptes de démonstration</p>
          <div class="demo-buttons">
            <button type="button" class="btn btn-demo" (click)="demoLogin('superadmin@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Super Admin
            </button>
            <button type="button" class="btn btn-demo" (click)="demoLogin('admin@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Admin
            </button>
            <button type="button" class="btn btn-demo" (click)="demoLogin('rh@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              RH
            </button>
            <button type="button" class="btn btn-demo" (click)="demoLogin('dev@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Développeur
            </button>
            <button type="button" class="btn btn-demo" (click)="demoLogin('qa@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              QA
            </button>
            <button type="button" class="btn btn-demo" (click)="demoLogin('chef@demo.com', 'demo123')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              Chef de projet
            </button>
          </div>
        </div>
        
        <div class="login-footer">
          <p class="footer-text">Vous êtes candidat ? <a routerLink="/applicant/home" class="footer-link">Postulez ici</a></p>
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    .background-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
      pointer-events: none;
    }

    .login-card {
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      box-shadow: 
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(255, 255, 255, 0.2);
      padding: 48px 40px;
      width: 100%;
      max-width: 460px;
      position: relative;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
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

    .logo-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      margin-bottom: 24px;
      color: white;
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .login-title {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 12px;
      letter-spacing: -0.5px;
    }

    .login-subtitle {
      color: #6b7280;
      margin: 0;
      font-size: 16px;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
      margin-bottom: 32px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      letter-spacing: 0.3px;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-icon {
      position: absolute;
      left: 16px;
      color: #9ca3af;
      pointer-events: none;
      transition: color 0.2s ease;
    }

    .form-input {
      width: 100%;
      padding: 16px 16px 16px 48px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 15px;
      transition: all 0.2s ease;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #667eea;
      background: white;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
    }

    .form-input:focus + .input-icon {
      color: #667eea;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: -8px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #4b5563;
      cursor: pointer;
      user-select: none;
    }

    .checkbox-label input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: #667eea;
      cursor: pointer;
    }

    .forgot-link {
      font-size: 14px;
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: #764ba2;
      text-decoration: underline;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 16px 24px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(102, 126, 234, 0.4);
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
    }

    .btn-primary:active:not(:disabled) {
      transform: translateY(0);
    }

    .btn-primary:disabled {
      opacity: 0.6;
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

    .demo-logins {
      background: #f3f4f6;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 32px;
      border: 1px solid #e5e7eb;
    }

    .demo-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 0 0 16px;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .demo-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      justify-content: center;
    }

    .btn-demo {
      background: white;
      border: 2px solid #e5e7eb;
      color: #4b5563;
      padding: 10px 16px;
      font-size: 13px;
      border-radius: 10px;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .btn-demo:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-color: transparent;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-demo svg {
      transition: stroke 0.2s ease;
    }

    .login-footer {
      text-align: center;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .footer-text {
      color: #6b7280;
      font-size: 14px;
      margin: 0;
    }

    .footer-link {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: #764ba2;
      text-decoration: underline;
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

    this.api.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        const role = response.role || 'USER';
        this.redirectBasedOnRole(role);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Email ou mot de passe incorrect';
      }
    });
  }

  demoLogin(email: string, password: string) {
    this.loginForm.patchValue({ email, password });
    this.onSubmit();
  }

  private redirectBasedOnRole(role: string) {
    const routes: Record<string, string> = {
      'SUPER_ADMIN': '/super-admin/dashboard',
      'ADMIN': '/admin/dashboard',
      'RH': '/rh/dashboard',
      'DEVELOPPEUR': '/developpeur/dashboard',
      'QA': '/qa/dashboard',
      'CHEF_PROJET': '/chef/dashboard'
    };

    const route = routes[role] || '/applicant/home';
    this.router.navigate([route]);
  }
}
