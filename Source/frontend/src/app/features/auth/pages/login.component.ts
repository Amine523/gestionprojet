import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
      'T008': '/client',
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
      'CANDIDAT': '/applicant',
      'CLIENT_PROJET': '/client',
      'CLIENT': '/client'
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
