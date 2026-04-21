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
    <div class="page-container p-4">
      <div class="d-flex align-items-center gap-3 mb-4">
        <div class="header-icon d-flex align-items-center justify-content-center">
          <i class="bi bi-shield-check text-white" style="font-size: 28px;"></i>
        </div>
        <div>
          <h1 class="fw-bold mb-1" style="font-size: 24px; color: #1a1a2e;">Politique de Sécurité</h1>
          <p class="text-muted mb-0" style="font-size: 14px;">Règles et politiques de sécurité</p>
        </div>
      </div>
      <div class="politiques">
        @for (p of politiques; track p.id) {
          <div class="card politique-card border-0 shadow-sm">
            <div class="card-body">
              <div class="politique-header d-flex align-items-start gap-3 mb-3">
                <i class="bi bi-{{p.icon}}" style="font-size: 40px; color: #673ab7; width: 40px; height: 40px;"></i>
                <div class="flex-grow-1">
                  <h5 class="fw-bold mb-1" style="font-size: 16px;">{{p.titre}}</h5>
                  <p class="text-muted mb-0" style="font-size: 13px;">{{p.description}}</p>
                </div>
                <span class="badge rounded-pill" [class.bg-success]="p.active" [class.bg-secondary]="!p.active" style="font-size: 11px;">{{p.active ? 'Active' : 'Inactive'}}</span>
              </div>
              <ul class="list-unstyled text-muted mb-3">
                @for (regle of p.regles; track regle) {
                  <li style="font-size: 14px; margin: 8px 0;">• {{regle}}</li>
                }
              </ul>
              <div class="politique-actions d-flex gap-2 pt-3 border-top">
                <button class="btn btn-primary btn-sm" (click)="modifierPolitique(p)">
                  <i class="bi bi-pencil me-2"></i>Modifier
                </button>
                <button class="btn btn-outline-danger btn-sm" (click)="togglePolitique(p)">
                  <i class="bi bi-{{p.active ? 'pause-circle' : 'play-circle'}} me-2"></i>{{p.active ? 'Désactiver' : 'Activer'}}
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Edit Dialog -->
    @if (showEditDialog) {
      <div class="modal-backdrop" (click)="showEditDialog = false">
        <div class="card modal-container" (click)="$event.stopPropagation()">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="mb-0"><i class="bi bi-pencil me-2"></i>Modifier la Politique</h5>
            <button class="btn btn-sm btn-light" (click)="showEditDialog = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="card-body">
            <form (ngSubmit)="savePolitique()">
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Titre</label>
                <input type="text" class="form-control" [(ngModel)]="editForm.titre" name="titre" required>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Description</label>
                <textarea class="form-control" [(ngModel)]="editForm.description" name="description" rows="2"></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold" style="font-size: 12px; color: #64748b;">Règles (une par ligne)</label>
                <textarea class="form-control" [(ngModel)]="editForm.regles" name="regles" rows="4"></textarea>
              </div>
              <div class="d-flex justify-content-end gap-2">
                <button class="btn btn-light" type="button" (click)="showEditDialog = false">Annuler</button>
                <button class="btn btn-primary" type="submit">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .header-icon { width: 56px; height: 56px; background: linear-gradient(135deg, #673ab7, #512da8); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
    .politiques { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
    .politique-card { padding: 24px; border-radius: 12px; background: #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.6); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(10px); }
    .modal-container { width: 500px; padding: 0 !important; overflow: hidden; display: flex; flex-direction: column; max-height: 90vh; }
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
