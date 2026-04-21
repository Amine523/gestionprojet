import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

interface DemoAccount {
  email: string;
  password: string;
  label: string;
  icon: string;
  societe?: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px;">
      <div class="position-absolute top-0 start-0 w-100 h-100" [style.background]="societeBg"></div>
      
      <div class="d-flex gap-5 align-items-center position-relative" style="max-width: 1100px; width: 100%; z-index: 1;">
        <div class="flex-grow-1" style="color: #0f172a;">
          <div class="d-flex align-items-center gap-4 mb-4">
            @if (selectedSociete) {
              <div class="rounded-4 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; background: linear-gradient(135deg, #0284c7, #0891b2); box-shadow: 0 12px 40px rgba(2, 132, 199, 0.35);">
                <i class="bi bi-{{societeIcon}}" style="font-size: 36px; color: white;"></i>
              </div>
              <h1 class="fw-bold mb-0" style="font-size: 52px; letter-spacing: -1px; background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{societeNom}}</h1>
            } @else {
              <div class="rounded-4 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; background: linear-gradient(135deg, #0284c7, #0891b2); box-shadow: 0 12px 40px rgba(2, 132, 199, 0.35);">
                <i class="bi bi-buildings" style="font-size: 36px; color: white;"></i>
              </div>
              <h1 class="fw-bold mb-0" style="font-size: 52px; letter-spacing: -1px; background: linear-gradient(135deg, #0f172a 0%, #0284c7 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">NADHEMNI</h1>
            }
          </div>
          <p class="mb-5" style="font-size: 20px; color: #64748b; font-weight: 500;">Plateforme de Gestion d'Entreprise</p>
          
          <div class="d-flex flex-column gap-3">
            @for (feat of features; track feat.icon) {
              <div class="d-flex align-items-center gap-3" style="font-size: 17px; color: #334155; font-weight: 500;">
                <div class="rounded-3 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px; background: rgba(2, 132, 199, 0.1); color: #0284c7;">
                  <i class="bi bi-{{feat.icon}}" style="font-size: 16px;"></i>
                </div>
                <span>{{feat.label}}</span>
              </div>
            }
          </div>
        </div>

        <div class="card border-0 shadow-lg" style="flex: 0 0 440px; border-radius: 24px; background: #ffffff; backdrop-filter: blur(20px); border: 1px solid #e2e8f0;">
          <div class="card-body p-5">
            <div class="text-center mb-4">
              <h2 class="fw-bold" style="font-size: 28px; color: #0f172a; letter-spacing: -0.5px;">Bienvenue</h2>
              <p class="mb-0" style="font-size: 15px; color: #64748b;">Connectez-vous pour accéder à votre espace</p>
            </div>

            <form (ngSubmit)="login()" class="d-flex flex-column gap-2">
              <div class="form-floating">
                <input type="email" class="form-control" [(ngModel)]="email" name="email" id="email" placeholder="exemple@entreprise.com" required>
                <label for="email">Adresse email</label>
                <i class="bi bi-envelope position-absolute" style="top: 18px; left: 15px; color: #64748b;"></i>
              </div>

              <div class="form-floating">
                <input [type]="hidePassword ? 'password' : 'text'" class="form-control" [(ngModel)]="password" name="password" id="password" placeholder="••••••••" required>
                <label for="password">Mot de passe</label>
                <i class="bi bi-lock position-absolute" style="top: 18px; left: 15px; color: #64748b;"></i>
                <button type="button" class="btn position-absolute" style="top: 10px; right: 10px; background: none; border: none;" (click)="hidePassword = !hidePassword">
                  <i class="bi bi-{{hidePassword ? 'eye-slash' : 'eye'}}" style="color: #64748b;"></i>
                </button>
              </div>

              <div class="d-flex justify-content-between align-items-center my-3">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="remember">
                  <label class="form-check-label" for="remember" style="font-size: 14px; color: #64748b;">Se souvenir de moi</label>
                </div>
                <a href="javascript:void(0)" class="text-decoration-none" style="font-size: 14px; color: #0284c7; font-weight: 500;">Mot de passe oublié?</a>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-3 fw-bold" style="height: 52px; background: linear-gradient(135deg, #0284c7, #0891b2); border-radius: 14px; font-size: 16px;" [disabled]="loading">
                @if (loading) {
                  <span class="spinner-border spinner-border-sm me-2"></span>
                } @else {
                  <i class="bi bi-box-arrow-in-right me-2"></i>Se connecter
                }
              </button>

              @if (error) {
                <div class="d-flex align-items-center justify-content-center gap-2 text-danger" style="font-size: 14px; margin-top: 16px; padding: 14px; background: rgba(220, 38, 38, 0.06); border-radius: 12px; border: 1px solid rgba(220, 38, 38, 0.1);">
                  <i class="bi bi-exclamation-triangle"></i>
                  {{error}}
                </div>
              }
            </form>

            <div class="mt-4 pt-4 text-center" style="border-top: 1px solid #e2e8f0;">
              <button class="btn w-100 py-3 fw-bold text-white" style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); border-radius: 12px; font-size: 15px;" (click)="demoLogin('super@nadhemni.tn', 'admin123')">
                <i class="bi bi-shield-check me-2"></i>Connexion Super Administrateur
              </button>
              <button class="btn w-100 py-3 fw-bold text-white mt-2" style="background: linear-gradient(135deg, #059669, #10b981); border-radius: 12px; font-size: 15px;" (click)="demoLogin('rh@softpro.tn', 'admin123')">
                <i class="bi bi-people me-2"></i>Connexion RH
              </button>
            </div>

            <div class="mt-4 pt-4 text-center" style="border-top: 1px solid #e2e8f0;">
              <a routerLink="/applicant" class="text-decoration-none d-inline-flex align-items-center gap-2" style="color: #0284c7; font-weight: 600; font-size: 15px;">
                <i class="bi bi-briefcase"></i>Voir les offres d'emploi
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [``]
})
export class LoginComponent implements OnInit {
  private api = inject(ApiService);
  private router = inject(Router);

  email = '';
  password = '';
  hidePassword = true;
  loading = false;
  error = '';

  societeId = '';
  societeNom = 'NADHEMNI';
  societeCouleur = '#0284c7';
  societeIcon = 'corporate_fare';

  societes: any[] = [];
  selectedSociete: any = null;

  features = [
    { icon: 'buildings', label: 'Multi-Sociétés' },
    { icon: 'kanban', label: 'Gestion Projets' },
    { icon: 'clock-history', label: 'RH & Pointage' },
    { icon: 'chat-dots', label: 'Communication' }
  ];

  ngOnInit() {
    this.loadSocietes();
  }

  loadSocietes() {
    let data = JSON.parse(localStorage.getItem('app_data') || '{}');

    if (!data.societes || data.societes.length === 0) {
      data.societes = [
        { id: 'SP001', nom: 'Soft Pro', domaine: 'softpro.tn', couleur: '#0284c7', icone: 'computer', adresse: 'Avenue Habib Bourguiba, Tunis', telephone: '+216 55 100 000', email: 'contact@softpro.tn' }
      ];
    }

    if (!data.utilisateurs || data.utilisateurs.length === 0) {
      data.utilisateurs = [
        { id: 'SP_ADM', nom: 'Admin Soft Pro', email: 'admin@softpro.tn', societeId: 'SP001', typeUtilisateurId: 'admin_societe', actif: true, password: 'admin123' },
        { id: 'SP_RH', nom: 'RH Soft Pro', email: 'rh@softpro.tn', societeId: 'SP001', typeUtilisateurId: 'rh', actif: true, password: 'admin123' },
        { id: 'SP_CHEF', nom: 'Chef Groupe Soft Pro', email: 'chef@softpro.tn', societeId: 'SP001', typeUtilisateurId: 'chef_projet', actif: true, password: 'admin123' },
        { id: 'SP_DEV', nom: 'Développeur Soft Pro', email: 'dev@softpro.tn', societeId: 'SP001', typeUtilisateurId: 'developpeur', actif: true, password: 'admin123' },
        { id: 'SP_TEST', nom: 'Testeur QA Soft Pro', email: 'test@softpro.tn', societeId: 'SP001', typeUtilisateurId: 'testeur', actif: true, password: 'admin123' }
      ];
    }

    if (!data.projets) data.projets = {};
    if (!data.projets['SP001']) {
      data.projets['SP001'] = [
        { id: 1, nom: 'Application Mobile', statut: 'Actif', progression: 65, chefProjet: 'Chef Groupe Soft Pro' },
        { id: 2, nom: 'API REST v2', statut: 'Actif', progression: 45, chefProjet: 'Chef Groupe Soft Pro' }
      ];
    }

    if (!data.taches) data.taches = {};
    if (!data.taches['SP001']) {
      data.taches['SP001'] = [
        { id: 1, titre: 'Implémenter authentification JWT', projet: 'API REST v2', priorite: 'High', statut: 'inprogress', assignee: 'Développeur Soft Pro', dateEcheance: '2026-04-10' },
        { id: 2, titre: 'Créer interface login', projet: 'Application Mobile', priorite: 'High', statut: 'todo', assignee: 'Développeur Soft Pro', dateEcheance: '2026-04-08' },
        { id: 3, titre: 'Tests unitaires API', projet: 'API REST v2', priorite: 'Medium', statut: 'todo', assignee: 'Testeur QA Soft Pro', dateEcheance: '2026-04-12' }
      ];
    }

    if (!data.qaBugs) data.qaBugs = {};
    if (!data.qaBugs['SP001']) {
      data.qaBugs['SP001'] = [
        { id: 1, titre: 'Bug connexion OAuth', priorite: 'Critical', statut: 'Open', projet: 'Application Mobile', createur: 'Testeur QA Soft Pro' },
        { id: 2, titre: 'Erreur 500 API users', priorite: 'High', statut: 'Open', projet: 'API REST v2', createur: 'Testeur QA Soft Pro' }
      ];
    }

    if (!data.qaProjets) data.qaProjets = {};
    if (!data.qaProjets['SP001']) {
      data.qaProjets['SP001'] = [
        { id: 1, nom: 'Application Mobile', statut: 'Actif', testsTotal: 45, testsPasses: 38 },
        { id: 2, nom: 'API REST v2', statut: 'Actif', testsTotal: 32, testsPasses: 30 }
      ];
    }

    if (!data.rhEmployes) data.rhEmployes = {};
    if (!data.rhEmployes['SP001']) {
      data.rhEmployes['SP001'] = [
        { id: 'SP_ADM', nom: 'Admin Soft Pro', email: 'admin@softpro.tn', poste: 'Admin Société', actif: true },
        { id: 'SP_RH', nom: 'RH Soft Pro', email: 'rh@softpro.tn', poste: 'RH', actif: true },
        { id: 'SP_CHEF', nom: 'Chef Groupe Soft Pro', email: 'chef@softpro.tn', poste: 'Chef de Projet', actif: true },
        { id: 'SP_DEV', nom: 'Développeur Soft Pro', email: 'dev@softpro.tn', poste: 'Développeur', actif: true },
        { id: 'SP_TEST', nom: 'Testeur QA Soft Pro', email: 'test@softpro.tn', poste: 'Testeur QA', actif: true }
      ];
    }

    localStorage.setItem('app_data', JSON.stringify(data));
    this.societes = data.societes;
  }

  selectSociete(s: any) {
    this.selectedSociete = s;
    this.societeId = s.id;
    this.societeNom = s.nom || 'NADHEMNI';
    this.societeCouleur = s.couleur || '#0284c7';
    this.societeIcon = s.icone || 'corporate_fare';
  }

  detectSocieteFromEmail(email: string) {
    if (!email) return;
    const domain = email.split('@')[1];
    if (!domain) return;

    const societe = this.societes.find(s =>
      s.domaine && email.endsWith('@' + s.domaine)
    );
    if (societe) {
      this.selectSociete(societe);
    }
  }

  get societeBg(): string {
    if (this.selectedSociete) {
      const c = this.societeCouleur;
      return `radial-gradient(ellipse at 0% 0%, ${c}22 0%, transparent 50%), radial-gradient(ellipse at 100% 100%, ${c}15 0%, transparent 50%), linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)`;
    }
    return '';
  }

  demoAccounts: DemoAccount[] = [
    { email: 'super@nadhemni.tn', password: 'admin123', label: 'Super Administrateur', icon: 'shield', societe: 'NADHEMNI' }
  ];

  login() {
    if (!this.email || !this.password) return;
    this.loading = true;
    this.error = '';

    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.error) {
          this.error = 'Email ou mot de passe incorrect';
          this.loading = false;
          return;
        }
        this.api.setToken(res.token);
        this.api.setPermissions(res.permissions || []);
        localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));
        const rawRole = res.utilisateur?.typeUtilisateurId || res.utilisateur?.typeUtilisateur?.id || 'candidat';
        const role = rawRole.toLowerCase();
        console.log('Role:', role);

        const routes: { [key: string]: string } = {
          'superadmin': '/superadmin',
          'admin_societe': '/admin/dashboard',
          'rh': '/rh/dashboard',
          'chef_projet': '/chef/dashboard',
          'developpeur': '/dev/dashboard',
          'testeur': '/qa/dashboard',
          'candidat': '/applicant',
          't001': '/superadmin',
          't002': '/admin/dashboard',
          't003': '/rh/dashboard',
          't004': '/chef/dashboard',
          't005': '/dev/dashboard',
          't006': '/qa/dashboard'
        };

        let targetRoute = routes[role];
        if (!targetRoute) {
          if (role.includes('super')) targetRoute = '/superadmin';
          else if (role.includes('admin')) targetRoute = '/admin/dashboard';
          else if (role.includes('rh')) targetRoute = '/rh/dashboard';
          else if (role.includes('chef')) targetRoute = '/chef/dashboard';
          else if (role.includes('dev') || role.includes('develop')) targetRoute = '/dev/dashboard';
          else if (role.includes('test')) targetRoute = '/qa/dashboard';
          else targetRoute = '/applicant';
        }

        this.loading = false;
        this.router.navigate([targetRoute]);
      },
      error: (err) => {
        this.error = err.error?.message || "Email ou mot de passe incorrect";
        this.loading = false;
      }
    });
  }

  demoLogin(email: string, password: string) {
    this.email = email;
    this.password = password;
    this.loading = true;
    this.error = '';

    this.api.login(this.email, this.password).subscribe({
      next: (res) => {
        if (res.error) {
          this.error = 'Email ou mot de passe incorrect';
          this.loading = false;
          return;
        }
        console.log('Login response:', res);
        this.api.setToken(res.token);
        this.api.setPermissions(res.permissions || []);
        localStorage.setItem('utilisateur', JSON.stringify(res.utilisateur));

        console.log('Full response:', JSON.stringify(res));

        const rawRole = res.utilisateur?.typeUtilisateurId ||
          res.utilisateur?.typeUtilisateur?.id ||
          'candidat';
        const role = rawRole.toLowerCase();
        console.log('Extracted role:', role);
        console.log('Role:', role);

        const routes: { [key: string]: string } = {
          'superadmin': '/superadmin',
          'admin_societe': '/admin/dashboard',
          'rh': '/rh/dashboard',
          'chef_projet': '/chef/dashboard',
          'developpeur': '/dev/dashboard',
          'testeur': '/qa/dashboard',
          'candidat': '/applicant',
          't001': '/superadmin',
          't002': '/admin/dashboard',
          't003': '/rh/dashboard',
          't004': '/chef/dashboard',
          't005': '/dev/dashboard',
          't006': '/qa/dashboard'
        };

        let targetRoute = routes[role];
        if (!targetRoute) {
          console.log('Role not found in routes, available keys:', Object.keys(routes));
          if (role.includes('super')) targetRoute = '/superadmin';
          else if (role.includes('admin')) targetRoute = '/admin/dashboard';
          else if (role.includes('rh')) targetRoute = '/rh/dashboard';
          else if (role.includes('chef')) targetRoute = '/chef/dashboard';
          else if (role.includes('dev') || role.includes('develop')) targetRoute = '/dev/dashboard';
          else if (role.includes('test')) targetRoute = '/qa/dashboard';
          else targetRoute = '/applicant';
        }
        console.log('Final target:', targetRoute);
        console.log('Navigate to:', targetRoute);
        this.loading = false;
        this.router.navigate([targetRoute]);
      },
      error: () => {
        this.error = 'Email ou mot de passe incorrect';
        this.loading = false;
      }
    });
  }
}
