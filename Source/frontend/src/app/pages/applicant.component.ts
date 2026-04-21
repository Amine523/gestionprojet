import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-applicant-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="home">
      <mat-card class="hero">
        <div class="hero-content">
          <h1>Rejoignez Notre Équipe</h1>
          <p>Découvrez nos opportunités de carrière et développez votre carrière avec nous</p>
          <button mat-flat-button class="hero-btn" routerLink="/applicant/offres">
            <mat-icon>search</mat-icon> Voir les offres d'emploi
          </button>
        </div>
      </mat-card>
      <div class="features">
        <mat-card class="feature">
          <div class="feature-icon"><mat-icon>work</mat-icon></div>
          <h3>Des Opportunités Variées</h3>
          <p>Découvrez des postes dans différents domaines technologiques</p>
        </mat-card>
        <mat-card class="feature">
          <div class="feature-icon"><mat-icon>trending_up</mat-icon></div>
          <h3>Évolution de Carrière</h3>
          <p>Des opportunités de promotion et de croissance professionnelle</p>
        </mat-card>
        <mat-card class="feature">
          <div class="feature-icon"><mat-icon>groups</mat-icon></div>
          <h3>Environnement Collaboratif</h3>
          <p>Travaillez avec des équipes dynamiques et innovantes</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .home { padding: 0; max-width: 1200px; margin: 0 auto; }
    .hero { padding: 80px 60px; text-align: center; border-radius: 24px; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%); color: #fff; position: relative; overflow: hidden; }
    .hero::before { content: ''; position: absolute; inset: 0; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/svg%3E"); }
    .hero-content { position: relative; z-index: 1; }
    .hero h1 { font-size: 48px; margin-bottom: 20px; font-weight: 700; letter-spacing: -0.5px; }
    .hero p { font-size: 20px; margin-bottom: 32px; opacity: 0.9; max-width: 600px; margin-left: auto; margin-right: auto; }
    .hero-btn { background: #fff; color: #1e3a8a; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; }
    .hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
    .hero-btn mat-icon { margin-right: 8px; }
    .features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
    .feature { padding: 40px 32px; text-align: center; border-radius: 20px; transition: all 0.3s ease; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .feature:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
    .feature-icon { width: 72px; height: 72px; margin: 0 auto 20px; background: linear-gradient(135deg, #dbeafe, #bfdbfe); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
    .feature-icon mat-icon { font-size: 36px; width: 36px; height: 36px; color: #2563eb; }
    .feature h3 { margin: 0 0 12px; color: #1e293b; font-size: 20px; font-weight: 600; }
    .feature p { color: #64748b; margin: 0; font-size: 15px; line-height: 1.6; }
  `]
})
export class ApplicantHomeComponent {}

@Component({
  selector: 'app-applicant-offres',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="offres">
      <div class="page-header">
        <h1>Offres d'Emploi</h1>
        <p>Rejoignez notre équipe dynamique</p>
      </div>
      <div class="offres-grid">
        <mat-card *ngFor="let offre of offres" class="offre-card">
          <div class="offre-header">
            <h3>{{ offre.titre }}</h3>
            <span class="badge">Nouveau</span>
          </div>
          <p class="offre-desc">{{ offre.description }}</p>
          <div class="offre-meta">
            <span><mat-icon>business</mat-icon> {{ offre.societe || offre.societe?.nom }}</span>
            <span><mat-icon>location_on</mat-icon> {{ offre.lieu }}</span>
          </div>
          <div class="offre-details">
            @if (offre.salaire) {<span class="detail"><mat-icon>attach_money</mat-icon> {{offre.salaire}}</span>}
            @if (offre.type) {<span class="detail"><mat-icon>description</mat-icon> {{offre.type}}</span>}
            @if (offre.adresse) {<span class="detail"><mat-icon>home</mat-icon> {{offre.adresse}}</span>}
          </div>
          <button mat-flat-button class="postuler-btn" (click)="postuler(offre)">
            <mat-icon>send</mat-icon> Postuler maintenant
          </button>
        </mat-card>
        <div *ngIf="offres.length === 0" class="empty">
          <mat-icon>work_off</mat-icon>
          <p>Aucune offre disponible pour le moment</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .offres { max-width: 1200px; margin: 0 auto; padding: 40px 24px; }
    .page-header { text-align: center; margin-bottom: 48px; }
    .page-header h1 { color: #1e293b; font-size: 36px; margin-bottom: 12px; font-weight: 700; }
    .page-header p { color: #64748b; font-size: 18px; }
    .offres-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px; }
    .offre-card { padding: 28px; border-radius: 20px; transition: all 0.3s ease; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
    .offre-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1); }
    .offre-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .offre-header h3 { margin: 0; color: #1e293b; font-size: 20px; font-weight: 600; flex: 1; }
    .badge { background: linear-gradient(135deg, #dcfce7, #bbf7d0); color: #166534; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
    .offre-desc { color: #64748b; margin-bottom: 20px; line-height: 1.6; font-size: 15px; }
    .offre-meta { display: flex; gap: 20px; margin-bottom: 12px; color: #94a3b8; font-size: 14px; }
    .offre-meta span { display: flex; align-items: center; gap: 6px; }
    .offre-meta mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .offre-details { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 20px; }
    .offre-details .detail { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #64748b; background: #f1f5f9; padding: 4px 10px; border-radius: 8px; }
    .offre-details .detail mat-icon { font-size: 16px; width: 16px; height: 16px; color: #64748b; }
    .postuler-btn { background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; padding: 12px 24px; border-radius: 12px; font-weight: 500; width: 100%; }
    .postuler-btn:hover { background: linear-gradient(135deg, #1e40af, #2563eb); }
    .postuler-btn mat-icon { margin-right: 8px; }
    .empty { grid-column: 1 / -1; text-align: center; color: #94a3b8; padding: 60px; }
    .empty mat-icon { font-size: 64px; margin-bottom: 16px; opacity: 0.5; }
    .empty p { font-size: 18px; }
  `]
})
export class ApplicantOffresComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  offres: any[] = [];
  constructor() {
    const relevantTitles = ['Développeur', 'Developer', 'DevOps', 'QA', 'Testeur', 'Test', 'Chef de Projet', 'Product', 'Scrum', 'Tech Lead', 'RH', 'Recruteur'];
    this.api.getOffresEmploi().subscribe(allOffres => {
      this.offres = allOffres.filter((o: any) =>
        (o.statut?.toUpperCase() === 'OUVERTE') &&
        relevantTitles.some(title => o.titre?.toLowerCase().includes(title.toLowerCase()))
      );
    });
  }
  postuler(offre: any) {
    this.api.setOffreEmploiTemp(offre);
    this.router.navigate(['/applicant/postuler']);
  }
}

@Component({
  selector: 'app-applicant-postuler',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MatCardModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatProgressBarModule, MatSnackBarModule],
  template: `
    <div class="postuler">
      <mat-card class="form-card">
        <div class="form-header">
          <h1>{{ isLoginMode ? 'Connexion Candidat' : 'Créer un compte' }}</h1>
          <p>{{ isLoginMode ? 'Connectez-vous pour postuler' : 'Inscrivez-vous pour suivre vos candidatures' }}</p>
        </div>

        <div class="auth-toggle">
          <button mat-button type="button" [class.active]="!isLoginMode" (click)="isLoginMode = false">Inscription</button>
          <button mat-button type="button" [class.active]="isLoginMode" (click)="isLoginMode = true">Connexion</button>
        </div>

        <form [formGroup]="applyForm" (ngSubmit)="submit()">
          <div class="form-row" *ngIf="!isLoginMode">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Nom complet</mat-label>
              <input matInput formControlName="nom" [required]="!isLoginMode">
            </mat-form-field>
          </div>
          
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" type="email" required>
            <mat-error *ngIf="applyForm.get('email')?.invalid">Email invalide</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Mot de passe</mat-label>
            <input matInput formControlName="password" type="password" required>
            <mat-error *ngIf="applyForm.get('password')?.invalid">6 caractères minimum</mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline" class="full-width" *ngIf="!isLoginMode">
            <mat-label>Téléphone</mat-label>
            <input matInput formControlName="telephone">
          </mat-form-field>
          
          <div class="offre-info" *ngIf="selectedOffre">
            <mat-icon>work</mat-icon>
            <div class="offre-details-text">
              <strong>Poste :</strong> {{selectedOffre.titre}}
              <span *ngIf="selectedOffre.lieu"> - {{selectedOffre.lieu}}</span>
            </div>
          </div>
          
          <div class="file-input" *ngIf="!isLoginMode">
            <label>CV (PDF/DOC) - Optionnel</label>
            <label class="file-drop" for="cv-input" [class.has-file]="cvFile">
              <mat-icon>{{ cvFile ? 'check_circle' : 'cloud_upload' }}</mat-icon>
              <span>{{ cvFile ? cvFile.name : 'Glissez votre CV ici ou cliquez pour sélectionner' }}</span>
            </label>
            <input type="file" id="cv-input" accept=".pdf,.doc,.docx" (change)="onFileSelected($event)" style="display: none;">
          </div>
          
          <div class="info-alert info-blue">
            <mat-icon>info</mat-icon>
            <span>{{ isLoginMode ? 'Connectez-vous pour accéder à votre espace candidat.' : 'Votre compte vous permettra de suivre l\'avancement de votre dossier.' }}</span>
          </div>
          
          <button mat-flat-button class="submit-btn" type="submit" [disabled]="applyForm.invalid || isSubmitting">
            <ng-container *ngIf="isSubmitting; else notSubmitting">
              <span class="spinner"></span> Traitement...
            </ng-container>
            <ng-template #notSubmitting>
              <mat-icon>{{ isLoginMode ? 'login' : 'person_add' }}</mat-icon> 
              {{ isLoginMode ? 'Se connecter et postuler' : 'S\'inscrire et postuler' }}
            </ng-template>
          </button>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .postuler { max-width: 640px; margin: 40px auto; padding: 0 24px; }
    .form-card { padding: 40px; border-radius: 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); }
    .form-header { text-align: center; margin-bottom: 32px; }
    .form-header h1 { margin: 0 0 8px; color: #1e293b; font-size: 28px; font-weight: 700; font-family: 'Inter', sans-serif; }
    .form-header p { color: #64748b; margin: 0; font-size: 16px; }
    form { display: flex; flex-direction: column; gap: 16px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .full-width { width: 100%; }
    
    .file-input { margin: 8px 0; }
    .file-input label { display: block; margin-bottom: 10px; font-weight: 500; color: #374151; }
    .file-drop { border: 2px dashed #d1d5db; border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; transition: all 0.3s ease; background: #fafafa; }
    .file-drop:hover { border-color: #3b82f6; background: #f0f9ff; }
    .file-drop.has-file { border-color: #10b981; background: #ecfdf5; border-style: solid; }
    .file-drop.has-file mat-icon { color: #10b981; }
    .file-drop mat-icon { font-size: 36px; color: #94a3b8; margin-bottom: 8px; transition: color 0.3s ease; }
    .file-drop span { display: block; color: #64748b; font-size: 14px; font-weight: 500;}
    
    .offre-info { display: flex; align-items: center; gap: 12px; padding: 16px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0; }
    .offre-info mat-icon { color: #3b82f6; font-size: 24px; width: 24px; height: 24px; }
    .offre-details-text strong { color: #1e293b; }
    .offre-details-text span { color: #64748b; }
    
    .info-alert { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-radius: 12px; font-size: 14px; line-height: 1.5; margin-top: 8px; }
    .info-blue { background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; }
    .info-blue mat-icon { color: #2563eb; }
    
    .submit-btn { margin-top: 16px; height: 56px; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: #fff; border-radius: 12px; font-size: 16px; font-weight: 600; font-family: 'Inter', sans-serif; transition: all 0.3s ease; }
    .submit-btn:not([disabled]):hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); }
    .submit-btn[disabled] { opacity: 0.7; }
    
    .spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: #fff; animation: spin 1s ease-in-out infinite; margin-right: 8px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-toggle { display: flex; justify-content: center; gap: 8px; margin-bottom: 24px; background: #f1f5f9; padding: 4px; border-radius: 12px; }
    .auth-toggle button { flex: 1; border-radius: 8px; color: #64748b; font-weight: 500; }
    .auth-toggle button.active { background: #fff; color: #1e3a8a; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
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
        this.snackBar.open('Le fichier est trop volumineux (max 5 MB)', 'Fermer', { duration: 3000, panelClass: 'error-snackbar' });
        return;
      }
      this.cvFile = file;
    }
  }
  
  getQuizQuestions(quizTitre: string): any[] {
    const baseQuestions = [
      { q: 'Question 1', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 2', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 },
      { q: 'Question 3', options: [' Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 2 },
      { q: 'Question 4', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 3 },
      { q: 'Question 5', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 6', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 },
      { q: 'Question 7', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 2 },
      { q: 'Question 8', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 3 },
      { q: 'Question 9', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 10', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 },
      { q: 'Question 11', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 2 },
      { q: 'Question 12', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 3 },
      { q: 'Question 13', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 0 },
      { q: 'Question 14', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 1 },
      { q: 'Question 15', options: ['Réponse A', 'Réponse B', 'Réponse C', 'Réponse D'], correct: 2 }
    ];
    
    const questionsData: { [key: string]: any[] } = {
      'JavaScript Avancé': [
        { q: 'Qu\'est-ce qu\'une closure?', options: ['Une fonction qui retourne une fonction', 'Une fonction avec accès aux vars de son scope externe', 'Un objet', 'Une class'], correct: 1 },
        { q: 'Comment créer un promise?', options: ['new Promise(executor)', 'Promise.create()', 'Promise.new()', 'createPromise()'], correct: 0 },
        { q: 'Qu\'est-ce que async/await?', options: ['Syntaxe pour gérer les callbacks', 'Syntaxe pour écrire du sync code de manière async', 'Un framework', 'Une library'], correct: 1 },
        { q: 'Comment déclarer une variable dyna?', options: ['var', 'let', 'const', 'Les 3'], correct: 3 },
        { q: 'Qu\'est-ce que le hoisting?', options: ['Déclaration hissée en haut du scope', 'Une animation', 'Un event', 'Une méthode'], correct: 0 },
        { q: 'Qu\'est-ce que le concept de "this"?', options: ['Contexte courant d\'exécution', 'Une variable globale', 'Un objet', 'Une function'], correct: 0 },
        { q: 'Comment éviter le callback hell?', options: ['async/await', 'Promises', 'Les deux', 'Callbacks'], correct: 2 },
        { q: 'Qu\'est-ce qu\'un prototype?', options: ['Modèle d\'objet', 'Héritage JS', 'Class', 'Instance'], correct: 1 },
        { q: 'typeof null?', options: ['null', 'undefined', 'object', 'boolean'], correct: 2 },
        { q: 'Comment cloner un objet?', options: ['Object.assign()', 'Spread operator', 'JSON methods', 'Toutes'], correct: 3 },
        { q: 'Event loop en JS?', options: ['Execute code async', 'Gère les events', 'Loop principal', 'Timer'], correct: 0 },
        { q: 'Qu\'est-ce qu\'un closure?', options: ['Fonction avec scope externe', 'Bloc de code', 'Classe', 'Module'], correct: 0 },
        { q: 'Différence == et ===?', options: ['Type coerce', 'Exact equality', 'Compare objects', 'Compare arrays'], correct: 1 },
        { q: 'NaN === NaN?', options: ['true', 'false', 'undefined', 'Error'], correct: 1 },
        { q: 'Comment déclarer une class?', options: ['class keyword', 'function', 'object', 'prototype'], correct: 0 }
      ],
      'TypeScript': [
        { q: 'Comment définir un type?', options: [': type', ': string', ': number', ': boolean'], correct: 1 },
        { q: 'Qu\'est-ce qu\'une interface?', options: ['Un type', 'Un contrat pour les objets', 'Une class', 'Une function'], correct: 1 },
        { q: 'Les génériques?', options: ['Type paramétré', 'Une class', 'Un objet', 'Une function'], correct: 0 },
        { q: 'tsconfig.json?', options: ['Config TypeScript', 'Un fichier de test', 'Un package.json', 'Un fichier de build'], correct: 0 },
        { q: 'Type any vs unknown?', options: ['unknown est plus sécurisé', 'any est plus sécurisé', 'Identiques', 'unknown est plus rapide'], correct: 0 },
        { q: 'Comment typer une fonction?', options: ['(param: type) => returnType', 'function: type', 'type function', 'return: type'], correct: 0 },
        { q: 'Qu\'est-ce qu\'un type union?', options: ['Plusieurs types possibles', 'Un seul type', 'Type complexe', 'Array'], correct: 0 },
        { q: 'readonly?', options: ['Lecture seule', 'Écriture seule', '两者', 'Aucun'], correct: 0 },
        { q: 'Typeguards?', options: ['Vérifie les types', 'Crée les types', 'Modifie les types', 'Supprime les types'], correct: 0 },
        { q: 'Utility types?', options: ['Types prédéfinis', 'Nouveau type', 'Type custom', 'Type externe'], correct: 0 },
        { q: 'Pick<T,K>?', options: ['Sélectionne props', 'Omet props', 'Crée props', 'Supprime props'], correct: 0 },
        { q: 'Omit<T,K>?', options: ['Omet props', 'Sélectionne props', 'Crée props', 'Modifie props'], correct: 0 },
        { q: 'Partial<T>?', options: ['Tous optional', 'Tous requis', 'Aucun', 'Mixte'], correct: 0 },
        { q: 'Required<T>?', options: ['Tous requis', 'Tous optional', 'Aucun', 'Mixte'], correct: 0 },
        { q: 'as keyword?', options: ['Assertion de type', 'Création type', 'Modif type', 'Supprim type'], correct: 0 }
      ],
      'Angular Framework': [
        { q: '@Component décorateur?', options: ['Définit un composant', 'Définit un service', 'Définit un pipe', 'Définit un module'], correct: 0 },
        { q: '@Injectable?', options: ['Service', 'Component', 'Pipe', 'Directive'], correct: 0 },
        { q: 'Routing navigation?', options: ['Router', 'Navigate', 'Route', 'Link'], correct: 0 },
        { q: 'HTTP client?', options: ['HttpClient', 'Http', 'Ajax', 'Fetch'], correct: 0 },
        { q: 'Data binding?', options: ['[property]', '(event)', '[()]-two-way', 'Tous'], correct: 3 },
        { q: 'Directives?', options: ['Component, Structural, Attribute', 'Classes', 'Functions', 'Modules'], correct: 0 },
        { q: '@Input?', options: ['Données parent→enfant', 'Données enfant→parent', 'Events', 'Services'], correct: 0 },
        { q: '@Output?', options: ['Données enfant→parent', 'Données parent→enfant', '双向数据', 'Services'], correct: 1 },
        { q: 'Lifecycle ngOnInit?', options: ['Apres init', 'Avant destr', 'Apres destr', 'Aucun'], correct: 0 },
        { q: 'Services injection?', options: ['constructor', 'ngOnInit', 'Methods', 'Properties'], correct: 0 },
        { q: 'Pipes?', options: ['Transforme données', 'Valide données', 'Filtre données', 'Trie données'], correct: 0 },
        { q: 'Modules?', options: ['Groupe composants', 'Groupe services', 'Groupe pipes', 'Groupe directives'], correct: 0 },
        { q: 'Lazy loading?', options: ['Charge à la demande', 'Charge tout', 'Preload', 'Cache'], correct: 0 },
        { q: 'Guards?', options: ['Protection routes', 'Auth', 'Roles', 'Permissions'], correct: 0 },
        { q: 'Interceptors?', options: ['Modif requete', 'Auth', 'Routing', 'Caching'], correct: 0 }
      ],
      'Tests Unitaires': [
        { q: 'Framework de test JS?', options: ['Jest', 'Jasmine', 'Les 2', 'Mocha'], correct: 2 },
        { q: 'describe?', options: ['Suite de tests', 'Un test unique', 'Setup', 'Teardown'], correct: 0 },
        { q: 'it/test?', options: ['Un test', 'Une suite', 'Un describe', 'Un hook'], correct: 0 },
        { q: 'expect?', options: ['Assertion', 'Setup', 'Teardown', 'Mock'], correct: 0 },
        { q: 'Couverture?', options: ['% de code testé', 'Nombre de tests', 'Complexité', 'Tempo'], correct: 0 },
        { q: 'Mock?', options: ['Simulation objet', 'Vrai objet', 'Test', 'Setup'], correct: 0 },
        { q: 'Spy?', options: ['Surveillance fonc', 'Creates obj', 'Test', 'Setup'], correct: 0 },
        { q: 'Stub?', options: ['Remplac comportement', 'Crée behavior', 'Test', 'Setup'], correct: 0 },
        { q: 'beforeEach?', options: ['Setup avant test', 'Teardown', 'Cleanup', 'Init'], correct: 0 },
        { q: 'afterEach?', options: ['Teardown', 'Setup', 'Cleanup', 'Init'], correct: 0 },
        { q: 'toBe?', options: ['Égalité stricte', 'Égalité loose', 'Truthy', 'Falsy'], correct: 0 },
        { q: 'toEqual?', options: ['Égalité profonde', 'Égalité stricte', 'Identique', 'Similar'], correct: 0 },
        { q: 'toContain?', options: ['Contient substring', 'Contient element', 'Les deux', 'Aucun'], correct: 2 },
        { q: 'toThrow?', options: ['Test exception', 'Test error', 'Test fail', 'Test reject'], correct: 0 },
        { q: 'Test coverage?', options: ['% code exécuté', 'Lignes non testées', 'Complexité', 'Temps'], correct: 0 }
      ],
      'Gestion de Projet': [
        { q: 'Méthodologie Agile?', options: ['Iterative et incrémentale', 'Waterfall', 'V', 'En cascade'], correct: 0 },
        { q: 'Scrum?', options: ['Framework Agile', 'Un outil', 'Un language', 'Une method'], correct: 0 },
        { q: 'Sprint?', options: ['Période courte', 'Un an', 'Un mois', 'Une semaine'], correct: 0 },
        { q: 'Daily standup?', options: ['Mêlée quotidienne', 'Réunion hebdo', 'Review', 'Retro'], correct: 0 },
        { q: 'Backlog?', options: ['Liste de tâches', 'Un document', 'Un tableau', 'Un projet'], correct: 0 },
        { q: 'User story?', options: ['Fonctionnalité', 'Tâche', 'Bug', 'Test'], correct: 0 },
        { q: 'Story points?', options: ['Effort relatif', 'Temps', 'Budget', 'Ressource'], correct: 0 },
        { q: 'Velocity?', options: ['Capacité équipe', 'Vitesse', 'Nombre bugs', 'Temps'], correct: 0 },
        { q: 'Retrospective?', options: ['Amélioration', 'Planification', 'Review', 'Daily'], correct: 0 },
        { q: 'Sprint review?', options: ['Demo', 'Retro', 'Plan', 'Daily'], correct: 0 },
        { q: 'Product owner?', options: ['Propriétaire produit', 'Scrum master', 'Équipe', 'Stakeholder'], correct: 0 },
        { q: 'Scrum master?', options: ['Facilitateur', 'Proprio', 'Équipe', 'Client'], correct: 0 },
        { q: 'Definition of Done?', options: ['Critères terminaison', 'Critères start', 'Critères test', 'Critères deploy'], correct: 0 },
        { q: 'Kanban?', options: ['Tableau visuel', 'Methode', 'Outil', 'Process'], correct: 0 },
        { q: 'WIP limits?', options: ['Limite travail en cours', 'Limite temps', 'Limite budget', 'Limite équipe'], correct: 0 }
      ],
      'Droit du Travail': [
        { q: 'CDI?', options: ['Contrat durée indéterminée', 'Contrat durée illimitée', 'Contrat intermittent', 'Contrat invalide'], correct: 0 },
        { q: 'Préavis rupture CDI?', options: ['Variable selon ancienneté', '2 semaines', '1 mois', 'Aucun'], correct: 0 },
        { q: 'Congés payé?', options: ['5 semaines/an', '4 semaines/an', '6 semaines/an', '3 semaines/an'], correct: 0 },
        { q: 'SMIC?', options: ['Salaire minimum', 'Salaire moyen', 'Salaire max', 'Prime'], correct: 0 },
        { q: 'Période essai?', options: ['Durée probatoire', 'Durée indéterminée', 'Durée courte', 'Durée longue'], correct: 0 },
        { q: 'Heures supp?', options: ['Majoration salaire', 'Temps', 'Congé', 'Aucun'], correct: 0 },
        { q: 'Congé maladie?', options: ['Droit protégé', 'Droit limité', 'Droit nul', 'Aucun droit'], correct: 0 },
        { q: 'Licenciement?', options: ['Rupture contrat', 'Fin CDD', 'Démission', 'rupture'], correct: 0 },
        { q: 'Convention collective?', options: ['Accord entre partenaires', 'Droit du travail', 'Contrat', 'Accord'], correct: 1 },
        { q: 'RUPTURE conventionnelle?', options: ['Mutuel consentement', 'Unilatéral', 'Aucun motif', 'Procédure'], correct: 0 },
        { q: 'Droit de retrait?', options: ['Refus situation danger', 'Refus travail', 'Refus', 'Aucun'], correct: 0 },
        { q: 'Elections professionnelles?', options: ['Représentation salariés', 'Direction', 'Aucun', 'Partielle'], correct: 0 },
        { q: 'Prime de précarité?', options: ['Fin CDD', 'Fin CDI', 'Démission', 'Licenciement'], correct: 0 },
        { q: 'Accident du travail?', options: ['Survenu au travail', 'Survenu trajet', 'Les deux', 'Aucun'], correct: 2 },
        { q: 'Formation professionnelle?', options: ['Droit du salarié', 'Obligation patron', 'Optionnel', 'Aucun'], correct: 0 }
      ],
      'Développeur Frontend': [
        { q: 'HTML5语义化标签?', options: ['header, nav, article', 'div, span', 'table, tr', 'form, input'], correct: 0 },
        { q: 'CSS Flexbox?', options: ['Mise en page flexible', 'Grille fixe', 'Animation', 'Transform'], correct: 0 },
        { q: 'CSS Grid?', options: ['Grille bidimensionnelle', 'Mise en page flexible', 'Animation', 'Transform'], correct: 0 },
        { q: 'Responsive Design?', options: ['Adaptatif tous écrans', 'Site fixe', 'Mobile only', 'Desktop only'], correct: 0 },
        { q: 'DOM?', options: ['Modèle objet document', 'Base de données', 'Serveur', 'Langage'], correct: 0 },
        { q: 'Event bubbling?', options: ['Propagation événement', 'Arrêt événement', 'Création événement', 'Suppression événement'], correct: 0 },
        { q: 'AJAX?', options: ['Requête asynchrone', 'Requête synchrone', 'Base de données', 'Serveur'], correct: 0 },
        { q: 'fetch API?', options: ['Requêtes réseau', 'Base de données', 'UI framework', 'CSS'], correct: 0 },
        { q: 'LocalStorage?', options: ['Stockage local', 'Base de données', 'Session', 'Cookie'], correct: 0 },
        { q: 'Web Components?', options: ['Composants personnalisés', 'Framework', 'Bibliothèque', 'Serveur'], correct: 0 },
        { q: 'CSS préprocesseur?', options: ['Sass, Less, Stylus', 'JavaScript', 'HTML', 'Base de données'], correct: 0 },
        { q: 'BEM?', options: ['Naming convention CSS', 'Framework JS', 'Base de données', 'Serveur'], correct: 0 },
        { q: 'Media queries?', options: ['Responsive design', 'Animation', 'Base de données', 'Serveur'], correct: 0 },
        { q: 'Animations CSS?', options: ['Transitions, keyframes', 'JavaScript', 'Base de données', 'Serveur'], correct: 0 },
        { q: 'Performance web?', options: ['Optimisation chargement', 'Design', 'Base de données', 'Serveur'], correct: 0 }
      ],
      'Développeur Backend': [
        { q: 'API REST?', options: ['Architecture web', 'Base de données', 'Frontend', 'Mobile'], correct: 0 },
        { q: 'Méthodes HTTP?', options: ['GET, POST, PUT, DELETE', 'READ, WRITE', 'SELECT, INSERT', 'All, Any'], correct: 0 },
        { q: 'JWT?', options: ['Token authentification', 'Base de données', 'Framework', 'Cache'], correct: 0 },
        { q: 'ORM?', options: ['Mapping objet-relationnel', 'Base NoSQL', 'Frontend', 'Cache'], correct: 0 },
        { q: 'SQL vs NoSQL?', options: ['Relationnel vs Document', 'Frontend vs Backend', 'Mobile vs Desktop', 'Cloud vs Local'], correct: 0 },
        { q: 'Index base données?', options: ['Optimisation requêtes', 'Stockage', 'Cache', 'Backup'], correct: 0 },
        { q: 'Injection SQL?', options: ['Vulnérabilité sécurité', 'Optimisation', 'Performance', 'Design'], correct: 0 },
        { q: 'Microservices?', options: ['Architecture distribuée', 'Monolithe', 'Frontend', 'Mobile'], correct: 0 },
        { q: 'Docker?', options: ['Conteneurisation', 'Virtualisation', 'Base de données', 'Monitoring'], correct: 0 },
        { q: 'API GraphQL?', options: ['Requête flexible', 'REST uniquement', 'Base de données', 'Frontend'], correct: 0 },
        { q: 'Authentification?', options: ['Connexion utilisateur', 'Base de données', 'Cache', 'Logging'], correct: 0 },
        { q: 'Session vs Token?', options: ['Stockage serveur vs client', 'Identique', 'Frontend only', 'Backend only'], correct: 0 },
        { q: 'Middleware?', options: ['Fonction intermédiaire', 'Base de données', 'Frontend', 'Cache'], correct: 0 },
        { q: 'Cache?', options: ['Stockage temporaire', 'Base de données', 'Frontend', 'Logging'], correct: 0 },
        { q: 'RESTful?', options: ['Convention API', 'Base de données', 'Frontend', 'Mobile'], correct: 0 }
      ],
      'Développeur Full Stack': [
        { q: 'Stack MERN?', options: ['Mongo, Express, React, Node', 'MySQL, Redux, Ruby, Nest', 'Mongo, Ember, React, Nest', 'MS SQL, Express, Angular, Node'], correct: 0 },
        { q: 'Développeur full stack?', options: ['Front + Back', 'Back only', 'Front only', 'Mobile only'], correct: 0 },
        { q: 'Git?', options: ['Gestion versions', 'Base de données', 'IDE', 'Cloud'], correct: 0 },
        { q: 'CI/CD?', options: ['Intégration/Déploiement continu', 'Base de données', 'Design', 'Marketing'], correct: 0 },
        { q: 'Docker Compose?', options: ['Multi-conteneurs', 'Conteneur unique', 'Base de données', 'Monitoring'], correct: 0 },
        { q: 'API?', options: ['Interface programmation', 'Base de données', 'Design', 'Marketing'], correct: 0 },
        { q: 'JWT?', options: ['Token sécurisé', 'Base de données', 'Framework', 'Cache'], correct: 0 },
        { q: 'Responsive?', options: ['Adaptatif', 'Fixe', 'Desktop only', 'Mobile only'], correct: 0 },
        { q: 'SEO?', options: ['Optimisation moteur recherche', 'Design', 'Base de données', 'Security'], correct: 0 },
        { q: 'WebSocket?', options: ['Communication temps réel', 'Requête unique', 'Base de données', 'Cache'], correct: 0 },
        { q: 'Authentication?', options: ['Connexion utilisateur', 'Base de données', 'Design', 'Marketing'], correct: 0 },
        { q: 'Cloud?', options: ['Hébergement distant', 'Local only', 'Hardware', 'Network'], correct: 0 },
        { q: 'Agile/Scrum?', options: ['Méthodologie projet', 'Langage programmation', 'Base de données', 'Design'], correct: 0 },
        { q: 'Tests?', options: ['Validation code', 'Design', 'Base de données', 'Marketing'], correct: 0 },
        { q: 'DevOps?', options: ['Dev + Ops', 'Design only', 'Test only', 'Marketing'], correct: 0 }
      ],
      'Développeur Mobile': [
        { q: 'React Native?', options: ['Framework mobile cross-platform', 'Langage', 'Base de données', 'Design'], correct: 0 },
        { q: 'Flutter?', options: ['Framework Google cross-platform', 'Langage', 'Base de données', 'Design'], correct: 0 },
        { q: 'Swift?', options: ['Langage iOS', 'Framework Android', 'Web', 'Desktop'], correct: 0 },
        { q: 'Kotlin?', options: ['Langage Android', 'iOS only', 'Web', 'Desktop'], correct: 0 },
        { q: 'APK?', options: ['Format Android', 'iOS only', 'Web', 'Desktop'], correct: 0 },
        { q:       'App Store?', options: ['Distribution iOS', 'Distribution Android', 'Web', 'Desktop'], correct: 0 },
        { q: 'Push notification?', options: ['Notification mobile', 'Email', 'SMS', 'Call'], correct: 0 },
        { q: 'Offline-first?', options: ['Fonctionne sans internet', 'Always online', 'Web only', 'Desktop'], correct: 0 },
        { q: 'API mobile?', options: ['Communication backend', 'Stockage local', 'Design', 'Marketing'], correct: 0 },
        { q: 'Hybrid app?', options: ['Web + Native', 'Pure native', 'Web only', 'Desktop'], correct: 0 },
        { q: 'Native app?', options: ['Plateforme spécifique', 'Cross-platform', 'Web', 'Desktop'], correct: 0 },
        { q: 'PWA?', options: ['Progressive Web App', 'Native iOS', 'Native Android', 'Desktop'], correct: 0 },
        { q: 'Mobile UX?', options: ['Expérience mobile', 'Desktop UX', 'Web UX', 'Print UX'], correct: 0 },
        { q: 'Gesture?', options: ['Interaction tactile', 'Click souris', 'Keyboard', 'Voice'], correct: 0 },
        { q: 'App performance?', options: ['Vitesse, fluidité', 'Design', 'Base de données', 'Marketing'], correct: 0 }
      ],
      'Testeur Logiciel': [
        { q: 'Test unitaire?', options: ['Test composant iso', 'Test système complet', 'Test manuel', 'Acceptance test'], correct: 0 },
        { q: 'Test d\'intégration?', options: ['Test composants ensemble', 'Test unitaire', 'Test manuel', 'Test performance'], correct: 0 },
        { q: 'Test E2E?', options: ['Test parcours complet', 'Test unitaire', 'Test composant', 'Test performance'], correct: 0 },
        { q: 'Test manuel?', options: ['Exécution humaine', 'Automatisé', 'Performance', 'Security'], correct: 0 },
        { q: 'Test automatisé?', options: ['Exécution script', 'Manuel', 'Exploratoire', 'Acceptance'], correct: 0 },
        { q: 'Bug?', options: ['Defaut software', 'Feature', 'Enhancement', 'Task'], correct: 0 },
        { q: 'Test case?', options: ['Scénario test', 'Bug report', 'Feature', 'Release'], correct: 0 },
        { q: 'Regression test?', options: ['Vérif nouvelles修改', 'Nouveau test', 'Performance', 'Security'], correct: 0 },
        { q: ' smoke test?', options: ['Test rapide majeur', 'Test complet', 'Performance', 'Security'], correct: 0 },
        { q: 'Test coverage?', options: ['% code testé', 'Nombre bugs', 'Temps test', 'Cost'], correct: 0 },
        { q: 'Test report?', options: ['Résumé résultats', 'Code', 'Design', 'Budget'], correct: 0 },
        { q: 'Severity?', options: ['Gravité bug', 'Priorité', 'Complexité', 'Cost'], correct: 0 },
        { q: 'Priority?', options: ['Urgence fix', 'Gravité', 'Complexité', 'Cost'], correct: 0 },
        { q: 'Exploratory testing?', options: ['Test découverte', 'Scripté', 'Automatisé', 'Performance'], correct: 0 },
        { q: 'STLC?', options: ['Cycle vie test', 'Cycle dev', 'Release', 'Deployment'], correct: 0 }
      ],
      'Testeur Automation': [
        { q: 'Selenium?', options: ['Framework automatisation web', 'Language', 'Base de données', 'Design'], correct: 0 },
        { q: 'Cypress?', options: ['Framework test E2E', 'Unit test', 'Load test', 'Security test'], correct: 0 },
        { q: 'Robot Framework?', options: ['Framework automatisation', 'Language', 'Base de données', 'Design'], correct: 0 },
        { q: 'API testing?', options: ['Test services web', 'Test UI', 'Test performance', 'Test security'], correct: 0 },
        { q: 'CI/CD testing?', options: ['Test intégration continue', 'Manual test', 'Exploratory', 'UAT'], correct: 0 },
        { q: 'Test automation framework?', options: ['Architecture automatisation', 'Language', 'Base de données', 'Design'], correct: 0 },
        { q: 'Page Object Model?', options: ['Design pattern test', 'Language', 'Base de données', 'Design UI'], correct: 0 },
        { q: 'Assert?', options: ['Vérification résultat', 'Setup', 'Teardown', 'Report'], correct: 0 },
        { q: 'Test data?', options: ['Données test', 'Production data', 'Config', 'Code'], correct: 0 },
        { q: 'Mock/Stub?', options: ['Simulation dépendance', 'Vrai dépendance', 'Test data', 'Report'], correct: 0 },
        { q: 'Headless browser?', options: ['Navigateur sans UI', 'Navigateur avec UI', 'API', 'Base de données'], correct: 0 },
        { q: 'Locator?', options: ['Identification élément', 'Style', 'Data', 'Config'], correct: 0 },
        { q: 'Wait/Sleep?', options: ['Attendre élément', 'Fermer browser', 'Ouvrir browser', 'Clear cache'], correct: 0 },
        { q: 'Cross-browser testing?', options: ['Test multi-navigateurs', 'Single browser', 'Mobile only', 'API only'], correct: 0 },
        { q: 'Performance testing?', options: ['Test charge/vitesse', 'Test fonctionnel', 'Test security', 'Test UI'], correct: 0 }
      ],
      'Chef de Projet IT': [
        { q: 'Rôle chef projet?', options: ['Coordination équipe', 'Développement code', 'Test', 'Support'], correct: 0 },
        { q: 'Planification?', options: ['Définition tâches/schedule', 'Coding', 'Testing', 'Deployment'], correct: 0 },
        { q: 'Gestion risques?', options: ['Identification/mitigation', 'Coding', 'Testing', 'Marketing'], correct: 0 },
        { q: 'Budget?', options: ['Estimation coûts', 'Code', 'Test', 'Design'], correct: 0 },
        { q: 'Équipe projet?', options: ['Ressources humaines', 'Recrutement', 'Formation', 'Paie'], correct: 0 },
        { q: 'Stakeholder?', options: ['Partie prenante', 'Développeur', 'Testeur', 'Client final'], correct: 0 },
        { q: 'Gantt?', options: ['Diagramme planning', 'Code', 'Test', 'Design'], correct: 0 },
        { q: 'Waterfall?', options: ['Méthode séquentielle', 'Itérative', 'Agile', 'Hybrid'], correct: 0 },
        { q: 'Agile?', options: ['Méthode itérative', 'Séquentielle', 'Fix', 'Waterfall'], correct: 0 },
        { q: 'MVP?', options: ['Produit minimum viable', 'Produit complet', 'Documentation', 'Marketing'], correct: 0 },
        { q: 'Poker planning?', options: ['Estimation effort', 'Jeu', 'Meeting', 'Training'], correct: 0 },
        { q: 'Release?', options: ['Mise en production', 'Coding', 'Testing', 'Design'], correct: 0 },
        { q: 'Change management?', options: ['Gestion changement', 'Coding', 'Testing', 'Support'], correct: 0 },
        { q: 'Reporting?', options: ['Suivi avancement', 'Coding', 'Testing', 'Development'], correct: 0 },
        { q: 'PMO?', options: ['Gestion projets organisation', 'Marketing', 'HR', 'Finance'], correct: 0 }
      ],
      'Product Owner': [
        { q: 'Rôle PO?', options: ['Définition valeur produit', 'Développement', 'Test', 'Support'], correct: 0 },
        { q: 'Backlog?', options: ['Liste fonctionnalités', 'Code', 'Test', 'Design'], correct: 0 },
        { q: 'User story?', options: ['Fonctionnalité utilisateur', 'Bug', 'Tech task', 'Spike'], correct: 0 },
        { q: 'Acceptance criteria?', options: ['Critères validation', 'Description', 'Design', 'Budget'], correct: 0 },
        { q: 'Priorisation?', options: ['Ordre backlog', 'Scheduling', 'Budget', 'Team building'], correct: 0 },
        { q: 'MVP?', options: ['Produit minimum viable', 'Produit parfait', 'Documentation', 'Marketing'], correct: 0 },
        { q: 'Persona?', options: ['Profil utilisateur type', 'Développeur', 'Testeur', 'Manager'], correct: 0 },
        { q: 'Discovery?', options: ['Recherche utilisateur', 'Développement', 'Test', 'Release'], correct: 0 },
        { q: 'Roadmap?', options: ['Plan produit long terme', 'Sprint plan', 'Code', 'Test'], correct: 0 },
        { q: 'Metrics?', options: ['Mesures produit', 'Code', 'Design', 'HR'], correct: 0 },
        { q: 'Customer feedback?', options: ['Retour utilisateur', 'Code review', 'Test', 'HR'], correct: 0 },
        { q: 'User research?', options: ['Étude utilisateur', 'Coding', 'Testing', 'Marketing'], correct: 0 },
        { q: 'Sprint review?', options: ['Démo produit', 'Planning', 'Retro', 'Daily'], correct: 0 },
        { q: 'Value?', options: ['Valeur métier', 'Coût', 'Temps', 'Effort'], correct: 0 },
        { q: 'Product vision?', options: ['Direction produit', 'Sprint goal', 'Task', 'Bug'], correct: 0 }
      ],
      'RH IT': [
        { q: 'Recrutement IT?', options: ['Technique + soft skills', 'Soft skills only', 'Technique only', 'Experience only'], correct: 0 },
        { q: 'Tech interview?', options: ['Évaluation technique', 'RH only', 'Management', 'Finance'], correct: 0 },
        { q: 'Onboarding?', options: ['Intégration nouveau', 'Recrutement', 'Formation', 'Evaluation'], correct: 0 },
        { q: 'Formation continue?', options: ['Développement compétences', 'Recrutement', 'Paie', 'Legal'], correct: 0 },
        { q: 'Évaluation performance?', options: ['Review annuel', 'Quotidien', 'Mensuel', 'Hebdomadaire'], correct: 0 },
        { q: 'Turnover?', options: ['Rotation personnel', 'Recrutement', 'Formation', 'Paie'], correct: 0 },
        { q: 'GPEC?', options: ['Gestion compétences', 'Paie', 'Recrutement', 'Marketing'], correct: 0 },
        { q: 'RSE?', options: ['Responsabilité sociale', 'Finance', 'IT', 'Marketing'], correct: 0 },
        { q: 'Diversité?', options: ['Équipe variée', 'Uniformité', 'Hierarchie', 'Process'], correct: 0 },
        { q: 'Well-being?', options: ['Bien-être travail', 'Salaire only', 'Hierarchy', 'Process'], correct: 0 },
        { q: 'Conflit travail?', options: ['Médiation', 'Licenciement', 'Promotion', 'Formation'], correct: 0 },
        { q: 'Skill matrix?', options: ['Grille compétences', 'Organigramme', 'Budget', 'Planning'], correct: 0 },
        { q: 'Learning path?', options: ['Parcours formation', 'Recrutement', 'Paie', 'Legal'], correct: 0 },
        { q: ' Employer branding?', options: ['Image employeur', 'Product', 'Sales', 'Finance'], correct: 0 },
        { q: 'Internal mobility?', options: ['Évolution interne', 'Externe only', 'Formation', 'Paie'], correct: 0 }
      ],
      'Scrum Master': [
        { q: 'Rôle Scrum Master?', options: ['Facilitateur Agile', 'Manager', 'Développeur', 'Testeur'], correct: 0 },
        { q: 'Daily standup?', options: ['Mêlée quotidienne', 'Weekly', 'Monthly', 'Quarterly'], correct: 0 },
        { q: 'Sprint planning?', options: ['Planification sprint', 'Daily', 'Retro', 'Review'], correct: 0 },
        { q: 'Sprint review?', options: ['Démo sprint', 'Planning', 'Retro', 'Daily'], correct: 0 },
        { q: 'Sprint retro?', options: ['Amélioration continue', 'Planning', 'Demo', 'Daily'], correct: 0 },
        { q: 'Impediment?', options: ['Obstacle à lever', 'Feature', 'Bug', 'Task'], correct: 0 },
        { q: 'Self-organizing?', options: ['Équipe autonome', 'Top-down', 'Manager-led', 'HR-led'], correct: 0 },
        { q: 'Definition of Done?', options: ['Critères terminaison', 'Start criteria', 'Exit', 'Entry'], correct: 0 },
        { q: 'Velocity?', options: ['Capacité équipe', 'Budget', 'Timeline', 'Headcount'], correct: 0 },
        { q: 'Burndown chart?', options: ['Suivi travail restant', 'Budget', 'Team', 'Client'], correct: 0 },
        { q: 'Product backlog?', options: ['Backlog produit', 'Sprint backlog', 'Impediment', 'DoD'], correct: 0 },
        { q: 'Sprint backlog?', options: ['Backlog sprint', 'Product backlog', 'Impediment', 'DoD'], correct: 0 },
        { q: 'User story?', options: ['Fonctionnalité', 'Task', 'Bug', 'Spike'], correct: 0 },
        { q: 'Estimation?', options: ['Effort relatif', 'Temps absolu', 'Budget', 'Headcount'], correct: 0 },
        { q: 'Blocker?', options: ['Empêche progression', 'Priorité haute', 'Bug', 'Task'], correct: 0 }
      ]
    };
    
    if (questionsData[quizTitre]) {
      const qs = questionsData[quizTitre];
      while (qs.length < 15) {
        qs.push(baseQuestions[qs.length % baseQuestions.length]);
      }
      return qs;
    }
    return baseQuestions;
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
        
        // Use FormData for File Upload
        const formData = new FormData();
        formData.append('candidatId', res.utilisateur.id);
        formData.append('offreId', this.selectedOffre?.id);
        if (this.cvFile) {
          formData.append('cv', this.cvFile);
        }

        this.api.postulerForm(formData).subscribe({
          next: () => {
            this.snackBar.open('Candidature soumise avec succès avec votre CV !', 'Fermer', { duration: 4000 });
            this.isSubmitting = false;
            this.router.navigate(['/applicant/profil']);
          },
          error: (err: any) => {
            console.error('Upload error', err);
            this.snackBar.open('Erreur lors de l\'envoi du dossier.', 'Fermer', { duration: 4000 });
            this.isSubmitting = false;
          }
        });
      },
      error: (err: any) => {
        this.snackBar.open(err.error?.message || 'Erreur d\'authentification', 'Fermer', { duration: 4000 });
        this.isSubmitting = false;
      }
    });
  } 
}

@Component({
  selector: 'app-applicant-profil',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <div class="profil">
      @if (showQuiz && selectedCandidature) {
        <mat-card class="quiz-card">
          <div class="quiz-header">
            <h2>Test: {{selectedCandidature.quiz}}</h2>
            <p>Répondez aux questions pour finaliser votre candidature au poste de {{selectedCandidature.offreTitre}}</p>
          </div>
          <div class="quiz-progress">
            <span>Question {{currentQuestion + 1}} / {{quizQuestions.length}}</span>
            <mat-progress-bar mode="determinate" [value]="progressPercent"></mat-progress-bar>
          </div>
          <div class="question">
            <h3>{{quizQuestions[currentQuestion].q}}</h3>
            <div class="options">
              @for (opt of quizQuestions[currentQuestion].options; track opt; let i = $index) {
                <button mat-stroked-button class="option-btn" (click)="answerQuestion(i)">
                  {{opt}}
                </button>
              }
            </div>
          </div>
        </mat-card>
      } @else if (showResult) {
        <mat-card class="result-card">
          <div class="result-header">
            <mat-icon class="result-icon" [ngClass]="{'success': score >= passingScore, 'fail': score < passingScore}">
              {{ score >= passingScore ? 'check_circle' : 'cancel' }}
            </mat-icon>
            <h1>Test terminé</h1>
            <p class="score">Votre score: {{score}}/{{quizQuestions.length}} ({{scorePercent}}%)</p>
            @if (score >= passingScore) {
              <p>Félicitations, vos résultats ont été transmis aux ressources humaines.</p>
            } @else {
              <p>Merci pour votre participation. Vos résultats ont été enregistrés.</p>
            }
          </div>
          <button mat-flat-button color="primary" (click)="closeTest()">Retour au profil</button>
        </mat-card>
      } @else {
        <div class="profil-header">
          <mat-card class="profil-card">
            <div class="avatar-container">
              <mat-icon class="avatar">account_circle</mat-icon>
            </div>
            <div class="info">
              <h2>{{ userName || 'Candidat' }}</h2>
              <p class="text-muted">{{ userEmail || 'Aucune adresse renseignée' }}</p>
            </div>
          </mat-card>
        </div>

        <h3 class="section-title">Mes Candidatures</h3>
        
        @if (myCandidatures.length === 0) {
          <mat-card class="empty-state">
            <mat-icon>work_outline</mat-icon>
            <p>Vous n'avez soumis aucune candidature pour le moment.</p>
            <button mat-flat-button color="primary" routerLink="/applicant/offres">Voir les offres</button>
          </mat-card>
        } @else {
          <div class="candidatures-list">
            @for (cand of myCandidatures; track cand.id) {
              <mat-card class="candidature-card">
                <div class="c-header">
                  <h4>{{ cand.offreTitre || cand.poste }}</h4>
                  <span class="status-badge" [ngClass]="getStatusClass(cand.statut)">
                    {{ formatStatut(cand.statut) }}
                  </span>
                </div>
                <div class="c-body">
                  <p><mat-icon>business</mat-icon> {{ cand.societe || 'Entreprise' }}</p>
                  <p><mat-icon>event</mat-icon> Soumise le {{ cand.dateCandidature | date:'dd/MM/yyyy' }}</p>
                </div>
                
                <div class="c-actions">
                  @if (cand.statut === 'Test_autorise' && cand.quiz) {
                    <div class="alert-test">
                      <mat-icon>notification_important</mat-icon>
                      <span>Votre candidature a été présélectionnée. Vous pouvez maintenant passer le test technique.</span>
                    </div>
                    <button mat-flat-button color="primary" class="full-btn" (click)="startTest(cand)">
                      <mat-icon>play_circle</mat-icon> Passer le test
                    </button>
                  } @else if (cand.statut === 'Test_termine') {
                    <p class="test-done-text"><mat-icon>done_all</mat-icon> Test complété ({{cand.quizScore}}/{{cand.quizTotal}})</p>
                  }
                </div>
              </mat-card>
            }
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .profil { max-width: 800px; margin: 40px auto; padding: 0 24px; font-family: 'Inter', sans-serif; }
    .profil-card { display: flex; align-items: center; gap: 24px; padding: 32px; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .avatar-container { background: #eff6ff; padding: 16px; border-radius: 50%; display: flex; }
    .avatar { font-size: 64px; width: 64px; height: 64px; color: #3b82f6; }
    .info h2 { margin: 0 0 8px; color: #1e293b; font-size: 24px; font-weight: 700; }
    .text-muted { color: #64748b; margin: 0; font-size: 16px; }
    
    .section-title { margin: 40px 0 20px; color: #1e293b; font-size: 20px; font-weight: 600; }
    
    .empty-state { padding: 48px; text-align: center; border-radius: 16px; background: #f8fafc; border: 1px dashed #cbd5e1; box-shadow: none; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; color: #94a3b8; margin-bottom: 16px; }
    .empty-state p { color: #475569; margin-bottom: 24px; font-size: 16px; }
    
    .candidatures-list { display: grid; grid-template-columns: 1fr; gap: 16px; }
    .candidature-card { padding: 24px; border-radius: 16px; }
    .c-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
    .c-header h4 { margin: 0; font-size: 18px; color: #0f172a; font-weight: 600; }
    .c-body p { display: flex; align-items: center; gap: 8px; color: #64748b; margin: 8px 0; font-size: 14px; }
    .c-body mat-icon { font-size: 18px; width: 18px; height: 18px; color: #94a3b8; }
    
    .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }
    .bg-waiting { background: #fef3c7; color: #92400e; }
    .bg-test { background: #dbeafe; color: #1e40af; }
    .bg-success { background: #dcfce7; color: #166534; }
    .bg-default { background: #f1f5f9; color: #475569; }
    
    .c-actions { margin-top: 20px; padding-top: 16px; border-top: 1px solid #f1f5f9; }
    .alert-test { display: flex; align-items: flex-start; gap: 12px; background: #eff6ff; padding: 12px; border-radius: 8px; color: #1e40af; font-size: 14px; margin-bottom: 16px; }
    .alert-test mat-icon { color: #3b82f6; }
    .full-btn { width: 100%; border-radius: 8px; }
    .test-done-text { color: #10b981; font-weight: 500; display: flex; align-items: center; gap: 8px; margin: 0; }
    
    .quiz-card, .result-card { padding: 32px; border-radius: 24px; }
    .quiz-header { text-align: center; margin-bottom: 24px; }
    .quiz-header h2 { color: #1d4ed8; margin: 0 0 8px; font-weight: 700; }
    .quiz-header p { color: #64748b; }
    .quiz-progress { margin: 20px 0; }
    .quiz-progress span { display: block; text-align: center; margin-bottom: 8px; color: #64748b; font-size: 14px; }
    .question { margin-top: 24px; }
    .question h3 { color: #1e293b; font-size: 18px; margin-bottom: 24px; line-height: 1.4; }
    .options { display: flex; flex-direction: column; gap: 12px; }
    .option-btn { justify-content: flex-start; text-align: left; padding: 16px; border-radius: 12px; height: auto; white-space: normal; line-height: 1.4; }
    .option-btn:hover { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
    
    .result-header { margin-bottom: 32px; text-align: center; }
    .result-icon { font-size: 64px; width: 64px; height: 64px; margin-bottom: 16px; }
    .result-icon.success { color: #10b981; }
    .result-icon.fail { color: #f59e0b; }
    .score { font-size: 28px; font-weight: 700; color: #1e293b; margin: 16px 0; }
  `]
})
export class ApplicantProfilComponent implements OnInit {
  private api = inject(ApiService);
  private snackBar = inject(MatSnackBar);
  
  userName = '';
  userEmail = '';
  myCandidatures: any[] = [];
  
  showQuiz = false;
  showResult = false;
  selectedCandidature: any = null;
  quizQuestions: any[] = [];
  currentQuestion = 0;
  userAnswers: number[] = [];
  score = 0;
  passingScore = 10;
  
  get progressPercent() { return ((this.currentQuestion + 1) / (this.quizQuestions.length || 1)) * 100; }
  get scorePercent() { return Math.round((this.score / (this.quizQuestions.length || 1)) * 100); }
  
  ngOnInit() {
    const user = this.api.getCurrentUser();
    if (user) {
      this.userName = user.nom;
      this.userEmail = user.email;
      this.loadCandidatures(user.id);
    }
  }
  
  loadCandidatures(userId: string) {
    this.api.getCandidatures().subscribe(all => {
      this.myCandidatures = all.filter((c: any) => c.utilisateurId === userId || c.candidatId === userId);
    });
  }
  
  getStatusClass(statut: string) {
    switch (statut?.toUpperCase()) {
      case 'EN_ATTENTE': return 'bg-waiting';
      case 'TEST_AUTORISE': return 'bg-test';
      case 'TEST_TERMINE': return 'bg-success';
      case 'ACCEPTE': return 'bg-success';
      case 'REJETE': return 'bg-default';
      default: return 'bg-default';
    }
  }
  
  formatStatut(statut: string) {
    const s = statut?.toUpperCase();
    if (s === 'EN_ATTENTE') return 'En attente RH';
    if (s === 'TEST_AUTORISE') return 'Test requis';
    if (s === 'TEST_TERMINE') return 'Évaluation en cours';
    return statut?.replace(/_/g, ' ') || 'En attente';
  }
  
  startTest(cand: any) {
    this.selectedCandidature = cand;
    this.api.getQuizQuestionsBackend(cand.quiz || 'JavaScript Avancé').subscribe(questions => {
      this.quizQuestions = questions;
      this.currentQuestion = 0;
      this.userAnswers = [];
      this.showQuiz = true;
    });
  }
  
  answerQuestion(index: number) {
    this.userAnswers.push(index);
    if (this.currentQuestion < this.quizQuestions.length - 1) {
      this.currentQuestion++;
    } else {
      this.finishTest();
    }
  }
  
  finishTest() {
    this.api.validateQuizBackend(this.selectedCandidature.id, this.selectedCandidature.quiz, this.userAnswers)
      .subscribe(res => {
        this.score = res.score;
        this.showQuiz = false;
        this.showResult = true;
        this.loadCandidatures(this.api.getCurrentUser().id);
      });
  }
  
  closeTest() {
    this.showResult = false;
    this.selectedCandidature = null;
  }
}


