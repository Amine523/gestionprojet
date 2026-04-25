import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '@core/services/api.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatSnackBarModule],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="logo-section">
            <svg class="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
            <span class="logo-text">GestProjet</span>
          </div>
          <h1 class="register-title">Enregistrer votre société</h1>
          <p class="register-subtitle">Remplissez le formulaire pour demander l'accès à la plateforme</p>
        </div>

        @if (isSubmitted) {
          <div class="success-message">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Demande envoyée !</h2>
            <p>Votre demande de création de société a été transmise à notre équipe administrative. Vous recevrez un email dès qu'elle sera approuvée.</p>
            <button class="btn btn-primary" routerLink="/">Retour à la connexion</button>
          </div>
        } @else {
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
            <div class="form-section">
              <h3>Informations Société</h3>
              <div class="form-group">
                <label class="form-label">Nom de la société</label>
                <input type="text" formControlName="societeNom" class="form-input" placeholder="Ex: Tech Solutions">
              </div>
              <div class="form-group">
                <label class="form-label">Adresse</label>
                <input type="text" formControlName="societeAdresse" class="form-input" placeholder="Ex: Tunis, Tunisie">
              </div>
            </div>

            <div class="form-section">
              <h3>Informations Administrateur</h3>
              <div class="form-group">
                <label class="form-label">Nom complet</label>
                <input type="text" formControlName="adminNom" class="form-input" placeholder="Ex: Amine Ben Ali">
              </div>
              <div class="form-group">
                <label class="form-label">Email professionnel</label>
                <input type="email" formControlName="adminEmail" class="form-input" placeholder="amine@tech.com">
              </div>
              <div class="form-group">
                <label class="form-label">Mot de passe souhaité</label>
                <input type="password" formControlName="adminPassword" class="form-input" placeholder="••••••••">
              </div>
              <div class="form-group">
                <label class="form-label">Téléphone</label>
                <input type="text" formControlName="telephone" class="form-input" placeholder="+216 12 345 678">
              </div>
            </div>

            <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isLoading">
              @if (isLoading) {
                <span>Traitement en cours...</span>
              } @else {
                Soumettre la demande
              }
            </button>
            
            <a routerLink="/" class="back-link">Annuler et retourner au login</a>
          </form>
        }
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
      padding: 40px 20px;
    }

    .register-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      width: 100%;
      max-width: 500px;
    }

    .register-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      margin-bottom: 16px;
      color: #2d5a87;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: #1e3a5f;
    }

    .register-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px;
    }

    .register-subtitle {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .form-section {
      margin-bottom: 24px;
    }

    .form-section h3 {
      font-size: 16px;
      color: #1e3a5f;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 16px;
    }

    .form-group {
      margin-bottom: 16px;
    }

    .form-label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #475569;
      margin-bottom: 4px;
    }

    .form-input {
      width: 100%;
      padding: 10px 12px;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #2d5a87;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #2d5a87;
      color: white;
    }

    .btn-primary:hover {
      background: #1e3a5f;
    }

    .btn-block {
      width: 100%;
    }

    .back-link {
      display: block;
      text-align: center;
      margin-top: 16px;
      color: #64748b;
      font-size: 13px;
      text-decoration: none;
    }

    .back-link:hover {
      text-decoration: underline;
    }

    .success-message {
      text-align: center;
      padding: 24px 0;
    }

    .success-icon {
      color: #10b981;
      margin-bottom: 16px;
    }

    .success-message h2 {
      color: #1e293b;
      margin-bottom: 12px;
    }

    .success-message p {
      color: #64748b;
      margin-bottom: 24px;
      line-height: 1.5;
    }
  `]
})
export class RegisterCompanyComponent {
  private fb = inject(FormBuilder);
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);

  registerForm: FormGroup;
  isLoading = false;
  isSubmitted = false;

  constructor() {
    this.registerForm = this.fb.group({
      societeNom: ['', [Validators.required, Validators.minLength(2)]],
      societeAdresse: ['', [Validators.required]],
      adminNom: ['', [Validators.required]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminPassword: ['', [Validators.required, Validators.minLength(8)]],
      telephone: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.api.soumettreDemandeSociete(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.isSubmitted = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Erreur lors de l\'envoi de la demande. Veuillez réessayer.', 'Fermer', { duration: 3000 });
      }
    });
  }
}
