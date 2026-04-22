import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Politique {
  id: string;
  titre: string;
  icon: string;
  description: string;
  regles: string[];
  active: boolean;
}

@Component({
  selector: 'app-super-admin-politique',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `

    <div class="dashboard-container">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-content">
          <div class="header-badges">
            <span class="badge badge-primary">Politique Sécurité</span>
          </div>
          <h1 class="header-title">
            Politique <span class="gradient-text">de Sécurité.</span>
          </h1>
          <p class="header-subtitle">
            Règles et politiques de sécurité.
          </p>
        </div>
      </header>

      <!-- Policies Grid -->
      <div class="politiques-grid">
        @for (p of politiques; track p.id) {
          <div class="card politique-card" [class.inactive]="!p.active">
            <div class="politique-header">
              <div class="politique-icon">
                @if (p.icon === 'lock') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                } @else if (p.icon === 'wifi') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                    <line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                } @else if (p.icon === 'supervised_user_circle') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"/>
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                    <path d="M12 22a8 8 0 0 0-8-8 8 8 0 0 0-8 8"/>
                  </svg>
                } @else if (p.icon === 'verified_user') {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                } @else {
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                    <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                    <line x1="6" y1="6" x2="6.01" y2="6"/>
                    <line x1="6" y1="18" x2="6.01" y2="18"/>
                  </svg>
                }
              </div>
              <div class="politique-info">
                <h3>{{p.titre}}</h3>
                <p class="text-muted">{{p.description}}</p>
              </div>
              <span class="badge" [class.active]="p.active" [class.inactive]="!p.active">{{p.active ? 'Active' : 'Inactive'}}</span>
            </div>
            <ul class="regles-list">
              @for (regle of p.regles; track regle) {
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{regle}}
                </li>
              }
            </ul>
            <div class="politique-actions">
              <button class="btn btn-secondary" (click)="modifierPolitique(p)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Modifier
              </button>
              <button class="btn btn-danger" (click)="togglePolitique(p)">
                @if (p.active) {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <rect x="10" y="9" width="4" height="6"/>
                  </svg>
                  Désactiver
                } @else {
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  Activer
                }
              </button>
            </div>
          </div>
        }
      </div>

    <!-- Edit Dialog -->
    @if (showEditDialog) {
      <div class="modal-backdrop" (click)="showEditDialog = false">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Modifier la Politique</h3>
            <button class="btn-icon" (click)="showEditDialog = false">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form (ngSubmit)="savePolitique()">
            <div class="form-field">
              <label>Titre</label>
              <input type="text" class="form-input" [(ngModel)]="editForm.titre" name="titre" required>
            </div>
            <div class="form-field">
              <label>Description</label>
              <textarea class="form-input" [(ngModel)]="editForm.description" name="description" rows="2"></textarea>
            </div>
            <div class="form-field">
              <label>Règles (une par ligne)</label>
              <textarea class="form-input" [(ngModel)]="editForm.regles" name="regles" rows="4"></textarea>
            </div>
            <div class="modal-actions">
              <button class="btn btn-secondary" type="button" (click)="showEditDialog = false">Annuler</button>
              <button class="btn btn-primary" type="submit">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    }
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: var(--space-xl);
      padding-bottom: var(--space-2xl);
    }

    .dashboard-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      border-radius: var(--radius-xl);
      padding: var(--space-2xl);
      position: relative;
      overflow: hidden;
      box-shadow: var(--shadow-xl);
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    .header-content {
      position: relative;
      z-index: 1;
    }

    .header-badges {
      display: flex;
      gap: var(--space-sm);
      margin-bottom: var(--space-md);
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--space-xs);
      padding: var(--space-xs) var(--space-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge-primary {
      background: rgba(139, 92, 246, 0.1);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.2);
    }

    .badge.active {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .badge.inactive {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .header-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--space-sm);
      letter-spacing: -0.02em;
    }

    .gradient-text {
      background: linear-gradient(135deg, #c4b5fd, #a78bfa, #8b5cf6);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .header-subtitle {
      color: #94a3b8;
      font-size: var(--font-size-base);
      max-width: 600px;
      line-height: var(--line-height-relaxed);
      margin: 0;
    }

    .politiques-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: var(--space-lg);
    }

    .card {
      background: white;
      border-radius: var(--radius-xl);
      border: 1px solid var(--color-border);
      box-shadow: var(--shadow-sm);
      padding: var(--space-lg);
      transition: all var(--transition-base);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
    }

    .card.inactive {
      opacity: 0.7;
    }

    .politique-header {
      display: flex;
      align-items: flex-start;
      gap: var(--space-md);
      margin-bottom: var(--space-md);
    }

    .politique-icon {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: var(--shadow-sm);
    }

    .politique-info {
      flex: 1;
    }

    .politique-info h3 {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0 0 var(--space-xs);
    }

    .text-muted {
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }

    .regles-list {
      list-style: none;
      padding: 0;
      margin: 0 0 var(--space-md);
    }

    .regles-list li {
      display: flex;
      align-items: center;
      gap: var(--space-xs);
      font-size: var(--font-size-sm);
      color: var(--color-text-muted);
      margin-bottom: var(--space-sm);
    }

    .regles-list li svg {
      color: #10b981;
      flex-shrink: 0;
    }

    .politique-actions {
      display: flex;
      gap: var(--space-sm);
      padding-top: var(--space-md);
      border-top: 1px solid var(--color-border);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--space-sm);
      padding: var(--space-sm) var(--space-md);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .btn-primary {
      background: #8b5cf6;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-secondary {
      background: #10b981;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-secondary:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .btn-danger {
      background: #ef4444;
      color: white;
      box-shadow: var(--shadow-md);
    }

    .btn-danger:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(10px);
    }

    .modal-container {
      width: 500px;
      background: white;
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      max-height: 90vh;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--space-lg);
      border-bottom: 1px solid var(--color-border);
    }

    .modal-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text);
      margin: 0;
    }

    .btn-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: none;
      cursor: pointer;
      transition: all var(--transition-base);
      background: transparent;
      color: inherit;
    }

    .btn-icon:hover {
      background: var(--color-bg);
    }

    .modal-container form {
      padding: var(--space-lg);
    }

    .form-field {
      margin-bottom: var(--space-md);
    }

    .form-field label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: var(--space-xs);
    }

    .form-input {
      width: 100%;
      padding: var(--space-md);
      background: white;
      border: 2px solid var(--color-border);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      color: var(--color-text);
      outline: none;
      transition: border-color var(--transition-base);
    }

    .form-input:focus {
      border-color: rgba(139, 92, 246, 0.3);
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-sm);
      margin-top: var(--space-lg);
    }

    /* Dark mode */
    :host-context(.dark) .card {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-container {
      background: var(--color-surface);
    }

    :host-context(.dark) .form-input {
      background: var(--color-surface);
      border-color: var(--color-border);
    }

    :host-context(.dark) .modal-header {
      border-color: var(--color-border);
    }

    @media (max-width: 768px) {
      .politiques-grid {
        grid-template-columns: 1fr;
      }

      .modal-container {
        width: 90%;
      }
    }
  `]
})
export class SuperAdminPolitiqueComponent {
  showEditDialog = false;
  editingPolitique: Politique | null = null;
  editForm = { titre: '', description: '', regles: '' };
  
  politiques: Politique[] = [
    {
      id: 'pwd',
      titre: 'Politique de Mot de Passe',
      icon: 'lock',
      description: 'Regles de confidentialite et robustesse des mots de passe',
      regles: ['Minimum 8 caracteres', 'Majuscules et minuscules', 'Chiffres et caracteres speciaux', 'Expiration tous les 90 jours'],
      active: true
    },
    {
      id: 'ip',
      titre: 'Politique d\'Acces IP',
      icon: 'wifi',
      description: 'Controle des acces par adresse IP',
      regles: ['IPs autorisees configurables', 'Blocage apres 5 echecs', 'Liste blanche/blacklist'],
      active: true
    },
    {
      id: 'session',
      titre: 'Politique de Session',
      icon: 'supervised_user_circle',
      description: 'Gestion des sessions utilisateur',
      regles: ['Timeout apres 30 min inactivite', 'Connexion unique par compte', 'Audit de toutes les actions'],
      active: true
    },
    {
      id: 'auth',
      titre: 'Politique d\'Authentification',
      icon: 'verified_user',
      description: 'Regles d\'authentification multi-facteur',
      regles: ['MFA obligatoire pour Admin', 'Verification par email', 'Code SMS 2FA'],
      active: false
    },
    {
      id: 'data',
      titre: 'Politique de Protection Donnees',
      icon: 'storage',
      description: 'Chiffrement et protection des donnees',
      regles: ['Chiffrement AES-256', 'Sauvegarde quotidienne', 'Retention 30 jours'],
      active: true
    }
  ];

  modifierPolitique(politique: Politique) {
    this.editingPolitique = politique;
    this.editForm = {
      titre: politique.titre,
      description: politique.description,
      regles: politique.regles.join('\n')
    };
    this.showEditDialog = true;
  }

  savePolitique() {
    if (this.editingPolitique) {
      this.editingPolitique.titre = this.editForm.titre;
      this.editingPolitique.description = this.editForm.description;
      this.editingPolitique.regles = this.editForm.regles.split('\n').filter(r => r.trim());
      alert(`${this.editingPolitique.titre} modifiée avec succès`);
      this.showEditDialog = false;
    }
  }

  togglePolitique(politique: Politique) {
    politique.active = !politique.active;
    alert(`${politique.titre} ${politique.active ? 'activée' : 'désactivée'}`);
  }
}
